#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_2_visual_review_replay_set";
const docPath = "docs/V0_5_2_VISUAL_REVIEW_REPLAY_SET.md";
const schemaPath = "schemas/visual_review_replay_set.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_2_review_replay_set.json";
const passFixturePath = "tests/schema_examples/visual_review_replay_set.example.json";
const failFixturePath = "tests/schema_examples/visual_review_replay_set_fail.example.json";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const semanticHardeningPath = "tests/schema_examples/visual_review_semantics_hardening.example.json";
const promptPreviewPath = "reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json";
const correctionHintPath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const consistencyRules = [
  "same_input_produces_same_decision_contract",
  "failure_taxonomy_stable",
  "correction_hint_stable",
  "memory_flags_stay_false"
];
const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "VCP_memory_write_performed",
  "DailyNote_write_performed",
  "runtime_call_performed",
  "secret_value_read_performed",
  "production_candidate_created",
  "accepted_sample_auto_promotion",
  "memory_seed_promoted",
  "package_dependency_change_performed",
  "commit_performed",
  "push_performed"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = stable(value[key]);
    return result;
  }, {});
}

function sameJson(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

function assertNoSecretOrRawPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Generated image path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretOrRawPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoSecretOrRawPath(item, `${context}.${key}`));
  }
}

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function sourceEvidence() {
  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  const semantic = readJson(semanticHardeningPath).visual_review_semantics_hardening;
  const promptPreview = readJson(promptPreviewPath).prompt_package_preview;
  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "source review pack phase mismatch");
  assert(reviewPack.asset_ref.image_binary_read_performed === false, "source review pack must not read image binary");
  assert(semantic.phase === "v0_4_8_visual_review_semantics_hardening", "source semantic hardening phase mismatch");
  assert(semantic.semantic_constraints.memory_suitability_stays_false === true, "source memory suitability guard missing");
  assert(promptPreview.phase === "v0_5_1_prompt_package_preview", "source prompt preview phase mismatch");
  assert(promptPreview.actual_generation_calls === undefined || promptPreview.boundaries.actual_generation_calls === 0, "source prompt preview must not generate");
  return { reviewPack, semantic, promptPreview };
}

function expectedDecisionHash(decision) {
  return [
    decision.result,
    String(decision.accepted_sample_eligible),
    String(decision.production_candidate_eligible),
    String(decision.memory_seed_eligible),
    String(decision.memory_suitability),
    `human_review_${decision.requires_human_review}`
  ].join("_");
}

function validateReplaySet(record) {
  assert(record && typeof record === "object", "visual review replay set missing");
  assertNoSecretOrRawPath(record, "visual_review_replay_set");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_review_pack_ref === reviewPackPath, "source review pack ref mismatch");
  assert(record.source_semantic_hardening_ref === semanticHardeningPath, "source semantic hardening ref mismatch");
  assert(record.source_prompt_preview_ref === promptPreviewPath, "source prompt preview ref mismatch");

  const { reviewPack, semantic, promptPreview } = sourceEvidence();
  assert(record.input_contract.asset_id === reviewPack.asset_ref.asset_id, "input asset_id must match review pack");
  assert(record.input_contract.review_pack_id === reviewPack.review_pack_id, "input review_pack_id must match review pack");
  assert(record.input_contract.review_mode === reviewPack.review_mode, "input review mode must match review pack");
  assert(record.input_contract.image_binary_read_performed === false, "replay input must not read image binary");

  const sourceDecision = {
    result: semantic.review_decision.result,
    accepted_sample_eligible: reviewPack.review_pack_decision.accepted_sample_eligible,
    production_candidate_eligible: reviewPack.review_pack_decision.production_candidate_eligible,
    memory_seed_eligible: reviewPack.review_pack_decision.memory_seed_eligible,
    memory_suitability: semantic.review_decision.memory_suitability,
    requires_human_review: reviewPack.review_pack_decision.requires_human_review
  };
  assert(sameJson(record.decision_contract, sourceDecision), "decision contract must match source review and semantic records");
  const stableTaxonomy = semantic.review_decision.failure_taxonomy;
  assert(sameJson(record.stable_failure_taxonomy, stableTaxonomy), "stable failure taxonomy must match semantic hardening");
  assert(record.stable_correction_hint.correction_hint_ref === semantic.review_decision.correction_hint_ref, "correction hint ref must match semantic hardening");
  assert(sameJson(record.stable_correction_hint.correction_hint_categories, semantic.review_decision.correction_hint_categories), "correction hint categories must match semantic hardening");
  assert(record.stable_correction_hint.prompt_preview_ref === promptPreviewPath, "prompt preview ref mismatch");
  assert(promptPreview.boundaries.actual_generation_calls === 0, "prompt preview source must not generate");

  assert(Array.isArray(record.replay_runs) && record.replay_runs.length >= 3, "at least three replay runs are required");
  const expectedHash = expectedDecisionHash(record.decision_contract);
  for (const replay of record.replay_runs) {
    assert(replay.input_asset_id === record.input_contract.asset_id, "replay input asset_id drift");
    assert(replay.decision_contract_hash === expectedHash, "replay decision contract hash drift");
    assert(sameJson(replay.failure_taxonomy, record.stable_failure_taxonomy), "replay failure taxonomy drift");
    assert(replay.correction_hint_ref === record.stable_correction_hint.correction_hint_ref, "replay correction hint drift");
    assert(replay.memory_suitability === false, "replay memory suitability must stay false");
    assert(replay.VCP_memory_write_allowed === false, "replay VCP memory write must stay false");
    assert(replay.DailyNote_write_allowed === false, "replay DailyNote write must stay false");
  }
  for (const rule of consistencyRules) {
    assert(record.replay_consistency?.[rule] === true, `replay consistency rule must be true: ${rule}`);
  }

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.replay_only === true, "replay_only must be true");
  assert(record.boundaries?.image_binary_read_performed === false, "image binary read must remain false");
  assert(record.boundaries?.real_executor_implemented_now === false, "real executor must not be implemented");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2 must not be exercised");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateReplaySet(candidate);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      failure_message: error.message
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateReplaySet(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid visual review replay set fixture must fail");

  const cases = [
    expectFailure(validRecord, "input_asset_id_drift_fails", (candidate) => {
      candidate.replay_runs[1].input_asset_id = "visual-asset-drift";
    }),
    expectFailure(validRecord, "decision_contract_drift_fails", (candidate) => {
      candidate.decision_contract.result = "accept";
    }),
    expectFailure(validRecord, "decision_contract_hash_drift_fails", (candidate) => {
      candidate.replay_runs[2].decision_contract_hash = "different";
    }),
    expectFailure(validRecord, "failure_taxonomy_drift_fails", (candidate) => {
      candidate.replay_runs[1].failure_taxonomy = ["lighting_failure"];
    }),
    expectFailure(validRecord, "correction_hint_ref_drift_fails", (candidate) => {
      candidate.replay_runs[0].correction_hint_ref = "tests/schema_examples/other_hint.json";
    }),
    expectFailure(validRecord, "memory_suitability_true_fails", (candidate) => {
      candidate.replay_runs[0].memory_suitability = true;
    }),
    expectFailure(validRecord, "vcp_memory_allowed_true_fails", (candidate) => {
      candidate.replay_runs[1].VCP_memory_write_allowed = true;
    }),
    expectFailure(validRecord, "daily_note_allowed_true_fails", (candidate) => {
      candidate.replay_runs[2].DailyNote_write_allowed = true;
    }),
    expectFailure(validRecord, "consistency_rule_false_fails", (candidate) => {
      candidate.replay_consistency.failure_taxonomy_stable = false;
    }),
    expectFailure(validRecord, "image_binary_read_true_fails", (candidate) => {
      candidate.boundaries.image_binary_read_performed = true;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
    }),
    expectFailure(validRecord, "vcp_memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => {
      candidate.side_effects.production_candidate_created = true;
    }),
    expectFailure(validRecord, "accepted_sample_auto_promotion_true_fails", (candidate) => {
      candidate.side_effects.accepted_sample_auto_promotion = true;
    }),
    expectFailure(validRecord, "push_l2_exercised_true_fails", (candidate) => {
      candidate.boundaries.Push_L2_exercised = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.replay_set_id = "C:\\private\\replay.json";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.replay_set_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    input_drift_caught: cases.some((item) => item.case_id === "input_asset_id_drift_fails" && item.result === "caught"),
    decision_contract_drift_caught: cases.some((item) => item.case_id === "decision_contract_drift_fails" && item.result === "caught"),
    failure_taxonomy_drift_caught: cases.some((item) => item.case_id === "failure_taxonomy_drift_fails" && item.result === "caught"),
    correction_hint_drift_caught: cases.some((item) => item.case_id === "correction_hint_ref_drift_fails" && item.result === "caught"),
    memory_flag_drift_caught: cases.some((item) => item.case_id === "memory_suitability_true_fails" && item.result === "caught"),
    image_binary_read_caught: cases.some((item) => item.case_id === "image_binary_read_true_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "vcp_memory_write_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).visual_review_replay_set;
  const validRecord = readJson(passFixturePath).visual_review_replay_set;
  const invalidRecord = readJson(failFixturePath).visual_review_replay_set;

  assert(doc.includes("same_input_produces_same_decision_contract"), "doc must mention same-input contract stability");
  assert(doc.includes("failure_taxonomy_stable"), "doc must mention failure taxonomy stability");
  assert(doc.includes("correction_hint_stable"), "doc must mention correction hint stability");
  assert(doc.includes("memory_flags_stay_false"), "doc must mention memory flag stability");
  assert(schema.includes("visual_review_replay_set"), "schema must define visual review replay set");
  assert(mvp.includes("validate_visual_review_replay_set.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_2_VISUAL_REVIEW_REPLAY_SET_SLICE"), "exact-slice wiring missing");

  validateReplaySet(reportRecord);
  validateReplaySet(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_review_replay_set",
    phase,
    replay_doc_present: true,
    replay_schema_present: true,
    replay_report_present: true,
    replay_fixture_present: true,
    replay_fail_fixture_present: true,
    source_review_pack_verified: true,
    source_semantic_hardening_verified: true,
    source_prompt_preview_verified: true,
    same_input_produces_same_decision_contract: true,
    failure_taxonomy_stable: true,
    correction_hint_stable: true,
    memory_flags_stay_false: true,
    replay_run_count: reportRecord.replay_runs.length,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    input_drift_caught: negativeCaseSummary.input_drift_caught,
    decision_contract_drift_caught: negativeCaseSummary.decision_contract_drift_caught,
    failure_taxonomy_drift_caught: negativeCaseSummary.failure_taxonomy_drift_caught,
    correction_hint_drift_caught: negativeCaseSummary.correction_hint_drift_caught,
    memory_flag_drift_caught: negativeCaseSummary.memory_flag_drift_caught,
    image_binary_read_caught: negativeCaseSummary.image_binary_read_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    dry_run_only: true,
    replay_only: true,
    image_binary_read_performed: false,
    Push_L2_exercised: false,
    real_executor_implemented_now: false,
    provider_call_performed: false,
    image_generation_performed: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    production_candidate_created: false,
    accepted_sample_auto_promotion: false,
    memory_seed_promoted: false,
    package_dependency_change_performed: false,
    commit_performed: false,
    push_performed: false
  };
  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
