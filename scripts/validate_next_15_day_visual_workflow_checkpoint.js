#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_4_next_15_day_visual_workflow_checkpoint";
const docPath = "docs/V0_5_4_NEXT_15_DAY_CHECKPOINT.md";
const schemaPath = "schemas/next_15_day_visual_workflow_checkpoint.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_4_next_15_day_checkpoint.json";
const passFixturePath = "tests/schema_examples/next_15_day_visual_workflow_checkpoint.example.json";
const failFixturePath = "tests/schema_examples/next_15_day_visual_workflow_checkpoint_fail.example.json";
const semanticPath = "tests/schema_examples/visual_review_semantics_hardening.example.json";
const evidencePath = "reports/visual_asset_eval_dry_run/v0_4_9_evidence_consistency_hardening.json";
const readinessPath = "reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json";
const promptPreviewPath = "reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json";
const replaySetPath = "reports/visual_asset_eval_dry_run/v0_5_2_review_replay_set.json";
const memoryReadOnlyPath = "reports/visual_asset_eval_dry_run/v0_5_3_visual_memory_readonly_plan.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

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

function assertNonEmptyArray(value, message) {
  assert(Array.isArray(value) && value.length > 0, message);
}

function assertFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function assertCommonBoundaries(container, context) {
  assertFalseFlags(container, context);
  assert(container.image_generation !== true, `${context}.image_generation must not be true`);
  assert(container.memory_write !== true, `${context}.memory_write must not be true`);
  assert(container.real_executor !== true, `${context}.real_executor must not be true`);
  assert(container.real_executor_implemented_now !== true, `${context}.real_executor_implemented_now must not be true`);
  assert(container.Push_L2_exercised !== true, `${context}.Push_L2_exercised must not be true`);
}

function validateSourceArtifacts() {
  const semantic = readJson(semanticPath).visual_review_semantics_hardening;
  const evidence = readJson(evidencePath).visual_evidence_consistency_hardening;
  const readiness = readJson(readinessPath).controlled_generation_readiness_packet;
  const promptPreview = readJson(promptPreviewPath).prompt_package_preview;
  const replay = readJson(replaySetPath).visual_review_replay_set;
  const memory = readJson(memoryReadOnlyPath).visual_memory_readonly_plan;
  const records = { semantic, evidence, readiness, promptPreview, replay, memory };
  assertNoSecretOrRawPath(records, "next_15_day_visual_workflow_sources");

  assert(semantic.phase === "v0_4_8_visual_review_semantics_hardening", "semantic hardening phase mismatch");
  assert(semantic.semantic_constraints.pass_blocks_blocking_failure === true, "semantic pass/blocking constraint missing");
  assert(semantic.semantic_constraints.reject_requires_failure_taxonomy === true, "semantic reject taxonomy constraint missing");
  assert(semantic.semantic_constraints.patch_requires_correction_hint === true, "semantic patch correction hint constraint missing");
  assert(semantic.semantic_constraints.low_score_requires_finding === true, "semantic low-score finding constraint missing");
  assert(semantic.semantic_constraints.memory_suitability_stays_false === true, "semantic memory suitability constraint missing");
  assert(semantic.review_decision.memory_suitability === false, "semantic memory suitability must stay false");
  if (semantic.review_decision.result === "pass") {
    assert(semantic.review_decision.blocking_failures.length === 0, "pass must not include blocking failures");
  }
  if (semantic.review_decision.result === "reject") {
    assertNonEmptyArray(semantic.review_decision.failure_taxonomy, "reject must include failure taxonomy");
  }
  if (semantic.review_decision.result === "patch") {
    assert(typeof semantic.review_decision.correction_hint_ref === "string" && semantic.review_decision.correction_hint_ref.length > 0, "patch must include correction hint");
  }
  semantic.low_score_findings.forEach((finding) => {
    assert(finding.score <= semantic.low_score_threshold, "low score finding must be at or below threshold");
    assert(typeof finding.finding === "string" && finding.finding.length > 0, "low score finding must include text");
  });

  assert(evidence.phase === "v0_4_9_visual_evidence_consistency_hardening", "evidence consistency phase mismatch");
  assert(evidence.consistency_rules.asset_id_consistent === true, "asset_id consistency missing");
  assert(evidence.consistency_rules.receipt_path_consistent === true, "receipt_path consistency missing");
  assert(evidence.consistency_rules.attempt_result_path_consistent === true, "attempt_result_path consistency missing");
  assert(evidence.consistency_rules.output_image_sha256_consistent === true, "output hash consistency missing");
  assert(evidence.consistency_rules.no_raw_local_path === true, "raw local path guard missing");
  assert(evidence.consistency_rules.no_image_binary_read === true, "image binary read guard missing");
  assert(evidence.asset_evidence.raw_local_path_included === false, "evidence must not include raw local path");
  assert(evidence.asset_evidence.image_binary_read_performed === false, "evidence must not read image binary");

  assert(readiness.phase === "v0_5_0_controlled_generation_readiness_packet", "readiness packet phase mismatch");
  assert(readiness.prompt_package_preview, "readiness packet must include prompt_package_preview");
  assert(readiness.max_generation_calls.configured_limit >= 1, "readiness packet must include generation limit");
  assert(readiness.max_generation_calls.actual_generation_calls === 0, "readiness packet must not consume generation calls");
  assert(readiness.max_generation_calls.future_execution_authorized_by_this_packet === false, "readiness packet must not authorize future execution");
  assert(readiness.output_policy.preview_only === true, "readiness output policy must be preview-only");
  assert(readiness.review_gate.review_required_before_acceptance === true, "readiness review gate missing");
  assert(readiness.failure_stop_condition.stop_on_review_gate_failure === true, "readiness failure stop condition missing");
  assert(readiness.no_memory_by_default.enabled === true, "readiness no-memory default missing");
  assert(readiness.no_memory_by_default.VCP_memory_write_allowed === false, "readiness must disallow VCP memory write");

  assert(promptPreview.phase === "v0_5_1_prompt_package_preview", "prompt package preview phase mismatch");
  assertNonEmptyArray(promptPreview.positive_constraints, "positive constraints required");
  assertNonEmptyArray(promptPreview.negative_constraints, "negative constraints required");
  assertNonEmptyArray(promptPreview.avoid_fragments, "avoid fragments required");
  assert(promptPreview.expected_visual_change.output_claimed === false, "prompt preview must not claim generated output");
  assertNonEmptyArray(promptPreview.risk_notes, "risk notes required");
  assert(promptPreview.boundaries.actual_generation_calls === 0, "prompt preview must not consume generation calls");

  assert(replay.phase === "v0_5_2_visual_review_replay_set", "review replay phase mismatch");
  assert(replay.replay_consistency.same_input_produces_same_decision_contract === true, "replay decision contract not stable");
  assert(replay.replay_consistency.failure_taxonomy_stable === true, "replay taxonomy not stable");
  assert(replay.replay_consistency.correction_hint_stable === true, "replay correction hint not stable");
  assert(replay.replay_consistency.memory_flags_stay_false === true, "replay memory flags must stay false");
  assert(replay.replay_runs.length >= 3, "review replay set must include at least three runs");
  replay.replay_runs.forEach((run) => {
    assert(run.memory_suitability === false, "replay memory suitability must stay false");
    assert(run.VCP_memory_write_allowed === false, "replay VCP memory write must stay false");
    assert(run.DailyNote_write_allowed === false, "replay DailyNote write must stay false");
  });

  assert(memory.phase === "v0_5_3_visual_memory_readonly_plan", "visual memory read-only phase mismatch");
  assert(memory.boundaries.planning_only === true, "visual memory plan must remain planning-only");
  assert(memory.boundaries.read_only_plan_only === true, "visual memory plan must remain read-only plan only");
  assert(memory.side_effects.real_memory_read_performed === false, "visual memory plan must not read real memory");
  assert(memory.no_memory_write.VCP_memory_write_allowed === false, "visual memory plan must disallow VCP memory write");
  assert(memory.no_DailyNote_write.DailyNote_write_allowed === false, "visual memory plan must disallow DailyNote write");

  [
    ["semantic.boundaries", semantic.boundaries],
    ["semantic.side_effects", semantic.side_effects],
    ["evidence.boundaries", evidence.boundaries],
    ["evidence.side_effects", evidence.side_effects],
    ["readiness.boundaries", readiness.boundaries],
    ["readiness.side_effects", readiness.side_effects],
    ["promptPreview.boundaries", promptPreview.boundaries],
    ["promptPreview.side_effects", promptPreview.side_effects],
    ["replay.boundaries", replay.boundaries],
    ["replay.side_effects", replay.side_effects],
    ["memory.boundaries", memory.boundaries],
    ["memory.side_effects", memory.side_effects]
  ].forEach(([context, container]) => assertCommonBoundaries(container, context));

  return records;
}

function validateCheckpoint(record) {
  assert(record && typeof record === "object", "checkpoint record missing");
  assertNoSecretOrRawPath(record, "next_15_day_visual_workflow_checkpoint");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_semantic_hardening_ref === semanticPath, "semantic source ref mismatch");
  assert(record.source_evidence_consistency_ref === evidencePath, "evidence source ref mismatch");
  assert(record.source_controlled_generation_readiness_ref === readinessPath, "readiness source ref mismatch");
  assert(record.source_prompt_package_preview_ref === promptPreviewPath, "prompt preview source ref mismatch");
  assert(record.source_review_replay_set_ref === replaySetPath, "review replay source ref mismatch");
  assert(record.source_visual_memory_readonly_plan_ref === memoryReadOnlyPath, "memory read-only source ref mismatch");
  validateSourceArtifacts();

  const assertions = record.checkpoint_assertions;
  assert(assertions.semantic_hardening_exists === true, "semantic hardening must exist");
  assert(assertions.evidence_consistency_exists === true, "evidence consistency must exist");
  assert(assertions.controlled_generation_readiness_packet_exists === true, "readiness packet must exist");
  assert(assertions.prompt_package_preview_exists === true, "prompt package preview must exist");
  assert(assertions.review_replay_set_exists === true, "review replay set must exist");
  assert(assertions.visual_memory_readonly_remains_planning_only === true, "visual memory plan must remain planning-only");
  assert(assertions.image_generation === false, "image_generation must remain false");
  assert(assertions.memory_write === false, "memory_write must remain false");
  assert(assertions.real_executor === false, "real_executor must remain false");

  const capabilities = record.workflow_capabilities;
  assert(capabilities.review_semantics_non_empty === true, "review semantics capability missing");
  assert(capabilities.evidence_chain_consistent === true, "evidence consistency capability missing");
  assert(capabilities.prompt_correction_reusable === true, "prompt correction capability missing");
  assert(capabilities.controlled_generation_readiness_only === true, "controlled generation readiness must be readiness-only");
  assert(capabilities.visual_memory_readonly_planning_only === true, "visual memory must remain planning-only");
  assertNonEmptyArray(record.next_route_options, "next route options required");
  assert(record.next_route_options.every((item) => !/execute_real_generation_now|provider_call|memory_write/i.test(item)), "next route options must not authorize execution");

  assert(record.boundaries.metadata_only === true, "checkpoint must be metadata-only");
  assert(record.boundaries.dry_run_only === true, "checkpoint must be dry-run-only");
  assert(record.boundaries.checkpoint_only === true, "checkpoint must be checkpoint-only");
  assert(record.boundaries.image_generation === false, "boundary image_generation must be false");
  assert(record.boundaries.memory_write === false, "boundary memory_write must be false");
  assert(record.boundaries.real_executor === false, "boundary real_executor must be false");
  assertCommonBoundaries(record.boundaries, "boundaries");
  assertFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateCheckpoint(candidate);
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
    validateCheckpoint(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid checkpoint fixture must fail");

  const cases = [
    expectFailure(validRecord, "semantic_hardening_missing_fails", (candidate) => {
      candidate.checkpoint_assertions.semantic_hardening_exists = false;
    }),
    expectFailure(validRecord, "evidence_consistency_missing_fails", (candidate) => {
      candidate.checkpoint_assertions.evidence_consistency_exists = false;
    }),
    expectFailure(validRecord, "readiness_packet_missing_fails", (candidate) => {
      candidate.checkpoint_assertions.controlled_generation_readiness_packet_exists = false;
    }),
    expectFailure(validRecord, "prompt_preview_missing_fails", (candidate) => {
      candidate.checkpoint_assertions.prompt_package_preview_exists = false;
    }),
    expectFailure(validRecord, "review_replay_set_missing_fails", (candidate) => {
      candidate.checkpoint_assertions.review_replay_set_exists = false;
    }),
    expectFailure(validRecord, "memory_readonly_planning_drift_fails", (candidate) => {
      candidate.checkpoint_assertions.visual_memory_readonly_remains_planning_only = false;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.checkpoint_assertions.image_generation = true;
    }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => {
      candidate.checkpoint_assertions.memory_write = true;
    }),
    expectFailure(validRecord, "real_executor_true_fails", (candidate) => {
      candidate.checkpoint_assertions.real_executor = true;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "push_l2_exercised_true_fails", (candidate) => {
      candidate.boundaries.Push_L2_exercised = true;
    }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => {
      candidate.side_effects.production_candidate_created = true;
    }),
    expectFailure(validRecord, "accepted_sample_promotion_true_fails", (candidate) => {
      candidate.side_effects.accepted_sample_auto_promotion = true;
    }),
    expectFailure(validRecord, "execution_route_option_fails", (candidate) => {
      candidate.next_route_options = ["execute_real_generation_now"];
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.checkpoint_id = "C:\\private\\checkpoint.json";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.checkpoint_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    semantic_hardening_missing_caught: cases.some((item) => item.case_id === "semantic_hardening_missing_fails" && item.result === "caught"),
    evidence_consistency_missing_caught: cases.some((item) => item.case_id === "evidence_consistency_missing_fails" && item.result === "caught"),
    readiness_packet_missing_caught: cases.some((item) => item.case_id === "readiness_packet_missing_fails" && item.result === "caught"),
    prompt_preview_missing_caught: cases.some((item) => item.case_id === "prompt_preview_missing_fails" && item.result === "caught"),
    replay_set_missing_caught: cases.some((item) => item.case_id === "review_replay_set_missing_fails" && item.result === "caught"),
    memory_readonly_planning_drift_caught: cases.some((item) => item.case_id === "memory_readonly_planning_drift_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "memory_write_true_fails" && item.result === "caught"),
    real_executor_caught: cases.some((item) => item.case_id === "real_executor_true_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function validateTextSurfaces() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  for (const token of [
    phase,
    "semantic_hardening exists: true",
    "evidence_consistency exists: true",
    "controlled_generation_readiness_packet exists: true",
    "prompt_package_preview exists: true",
    "review_replay_set exists: true",
    "visual_memory_readonly remains planning-only: true",
    "image_generation: false",
    "memory_write: false",
    "real_executor: false"
  ]) {
    assert(doc.includes(token), `checkpoint doc missing token: ${token}`);
  }
  assert(schema.includes("next_15_day_visual_workflow_checkpoint"), "schema must define checkpoint");
  assert(mvp.includes("validate_next_15_day_visual_workflow_checkpoint.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_4_NEXT_15_DAY_VISUAL_WORKFLOW_CHECKPOINT_SLICE"), "exact-slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const reportRecord = readJson(reportPath).next_15_day_visual_workflow_checkpoint;
  const validRecord = readJson(passFixturePath).next_15_day_visual_workflow_checkpoint;
  const invalidRecord = readJson(failFixturePath).next_15_day_visual_workflow_checkpoint;
  validateCheckpoint(reportRecord);
  validateCheckpoint(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_next_15_day_visual_workflow_checkpoint",
    phase,
    checkpoint_doc_present: true,
    checkpoint_schema_present: true,
    checkpoint_report_present: true,
    checkpoint_fixture_present: true,
    checkpoint_fail_fixture_present: true,
    semantic_hardening_exists: true,
    evidence_consistency_exists: true,
    controlled_generation_readiness_packet_exists: true,
    prompt_package_preview_exists: true,
    review_replay_set_exists: true,
    visual_memory_readonly_remains_planning_only: true,
    review_semantics_non_empty: true,
    evidence_chain_consistent: true,
    prompt_correction_reusable: true,
    controlled_generation_readiness_only: true,
    visual_memory_readonly_planning_only: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    semantic_hardening_missing_caught: negativeCaseSummary.semantic_hardening_missing_caught,
    evidence_consistency_missing_caught: negativeCaseSummary.evidence_consistency_missing_caught,
    readiness_packet_missing_caught: negativeCaseSummary.readiness_packet_missing_caught,
    prompt_preview_missing_caught: negativeCaseSummary.prompt_preview_missing_caught,
    replay_set_missing_caught: negativeCaseSummary.replay_set_missing_caught,
    memory_readonly_planning_drift_caught: negativeCaseSummary.memory_readonly_planning_drift_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    real_executor_caught: negativeCaseSummary.real_executor_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    dry_run_only: true,
    checkpoint_only: true,
    image_generation: false,
    memory_write: false,
    real_executor: false,
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
