#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_0_controlled_generation_readiness_packet";
const docPath = "docs/V0_5_0_CONTROLLED_GENERATION_READINESS_PACKET.md";
const schemaPath = "schemas/controlled_generation_readiness_packet.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json";
const passFixturePath = "tests/schema_examples/controlled_generation_readiness_packet.example.json";
const failFixturePath = "tests/schema_examples/controlled_generation_readiness_packet_fail.example.json";
const evidenceConsistencyPath = "reports/visual_asset_eval_dry_run/v0_4_9_evidence_consistency_hardening.json";
const promptCorrectionHintPath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const requiredReadinessFields = [
  "prompt_package_preview",
  "max_generation_calls",
  "output_policy",
  "review_gate",
  "failure_stop_condition",
  "no_memory_by_default"
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

function assertNonEmptyStringArray(value, message) {
  assert(Array.isArray(value) && value.length > 0, message);
  value.forEach((item) => assert(typeof item === "string" && item.trim().length > 0, message));
}

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function sourceEvidence() {
  const evidence = readJson(evidenceConsistencyPath).visual_evidence_consistency_hardening;
  const hints = readJson(promptCorrectionHintPath).visual_prompt_correction_hints;
  assert(evidence.phase === "v0_4_9_visual_evidence_consistency_hardening", "source evidence consistency phase mismatch");
  assert(evidence.consistency_rules.asset_id_consistent === true, "source evidence asset_id consistency missing");
  assert(evidence.consistency_rules.receipt_path_consistent === true, "source evidence receipt path consistency missing");
  assert(evidence.consistency_rules.attempt_result_path_consistent === true, "source evidence attempt result path consistency missing");
  assert(evidence.consistency_rules.output_image_sha256_consistent === true, "source evidence hash consistency missing");
  assert(evidence.consistency_rules.no_raw_local_path === true, "source evidence raw path guard missing");
  assert(evidence.consistency_rules.no_image_binary_read === true, "source evidence binary-read guard missing");
  assert(evidence.boundaries.image_binary_read_performed === false, "source evidence must not read image binary");
  assert(hints.phase === "v0_4_3_review_to_prompt_correction_hint", "source prompt correction hint phase mismatch");
  assert(Array.isArray(hints.hints) && hints.hints.length > 0, "source prompt correction hints missing");
  return { evidence, hints };
}

function validatePromptPreview(preview, hints) {
  assert(preview && typeof preview === "object", "prompt_package_preview missing");
  assert(typeof preview.preview_id === "string" && preview.preview_id.length > 0, "prompt preview id missing");
  assert(typeof preview.selected_taxonomy_category === "string", "selected taxonomy category missing");
  const sourceHint = hints.hints.find((hint) => hint.taxonomy_category_id === preview.selected_taxonomy_category);
  assert(sourceHint, "selected taxonomy category must exist in correction hints");
  assertNonEmptyStringArray(preview.positive_constraints, "positive constraints must be non-empty");
  assertNonEmptyStringArray(preview.negative_constraints, "negative constraints must be non-empty");
  assertNonEmptyStringArray(preview.avoid_fragments, "avoid fragments must be non-empty");
  assert(sourceHint.prompt_constraints_to_add.some((item) => preview.positive_constraints.includes(item)), "positive constraints must reuse correction hint constraints");
  assert(sourceHint.prompt_fragments_to_avoid.every((item) => preview.avoid_fragments.includes(item)), "avoid fragments must include correction hint avoid fragments");
  assert(preview.generation_dispatch_allowed === false, "prompt preview must not authorize generation dispatch");
}

function validateReadinessRecord(record) {
  assert(record && typeof record === "object", "controlled generation readiness packet missing");
  assertNoSecretOrRawPath(record, "controlled_generation_readiness_packet");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_evidence_consistency_ref === evidenceConsistencyPath, "source evidence consistency ref mismatch");
  assert(record.source_prompt_correction_hint_ref === promptCorrectionHintPath, "source prompt correction hint ref mismatch");
  for (const field of requiredReadinessFields) {
    assert(Object.prototype.hasOwnProperty.call(record, field), `required readiness field missing: ${field}`);
  }

  const sources = sourceEvidence();
  validatePromptPreview(record.prompt_package_preview, sources.hints);

  const maxCalls = record.max_generation_calls;
  assert(maxCalls && typeof maxCalls === "object", "max_generation_calls missing");
  assert(Number.isInteger(maxCalls.configured_limit) && maxCalls.configured_limit >= 1 && maxCalls.configured_limit <= 3, "configured generation call limit must be bounded");
  assert(maxCalls.actual_generation_calls === 0, "actual generation calls must remain zero");
  assert(maxCalls.provider_call_budget_consumed === 0, "provider call budget consumed must remain zero");
  assert(maxCalls.future_execution_authorized_by_this_packet === false, "readiness packet must not authorize future execution by itself");

  const outputPolicy = record.output_policy;
  assert(outputPolicy && typeof outputPolicy === "object", "output_policy missing");
  assert(outputPolicy.preview_only === true, "output policy must be preview-only");
  assert(outputPolicy.actual_output_written === false, "output policy must not write actual output");
  assert(outputPolicy.image_binary_output_allowed === false, "output policy must not allow image binary output");
  assert(outputPolicy.production_candidate_allowed === false, "output policy must not allow production candidates");

  const reviewGate = record.review_gate;
  assert(reviewGate && typeof reviewGate === "object", "review_gate missing");
  assert(reviewGate.review_required_before_acceptance === true, "review gate must require review before acceptance");
  assert(reviewGate.evidence_consistency_required === true, "review gate must require evidence consistency");
  assert(reviewGate.semantic_hardening_required === true, "review gate must require semantic hardening");
  assert(reviewGate.human_acceptance_required === true, "review gate must require human acceptance");
  assert(reviewGate.accepted_sample_auto_promotion_allowed === false, "review gate must block auto promotion");

  const stopCondition = record.failure_stop_condition;
  assert(stopCondition && typeof stopCondition === "object", "failure_stop_condition missing");
  assert(stopCondition.stop_on_provider_error === true, "failure stop must stop on provider errors");
  assert(stopCondition.stop_on_evidence_mismatch === true, "failure stop must stop on evidence mismatch");
  assert(stopCondition.stop_on_memory_or_production_request === true, "failure stop must stop on memory or production requests");
  assert(stopCondition.stop_on_review_gate_failure === true, "failure stop must stop on review gate failure");
  assert(stopCondition.retry_without_new_authorization_allowed === false, "failure stop must not allow retry without authorization");

  const memoryDefault = record.no_memory_by_default;
  assert(memoryDefault && typeof memoryDefault === "object", "no_memory_by_default missing");
  assert(memoryDefault.enabled === true, "no_memory_by_default must be enabled");
  assert(memoryDefault.VCP_memory_write_allowed === false, "VCP memory writes must be disabled by default");
  assert(memoryDefault.DailyNote_write_allowed === false, "DailyNote writes must be disabled by default");
  assert(memoryDefault.memory_seed_promotion_allowed === false, "memory seed promotion must be disabled by default");

  assert(record.boundaries?.planning_only === true, "planning_only must be true");
  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.actual_generation_calls === 0, "boundary actual generation calls must remain zero");
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
    validateReadinessRecord(candidate);
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
    validateReadinessRecord(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid controlled generation readiness fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_prompt_package_preview_fails", (candidate) => {
      delete candidate.prompt_package_preview;
    }),
    expectFailure(validRecord, "max_generation_calls_too_high_fails", (candidate) => {
      candidate.max_generation_calls.configured_limit = 4;
    }),
    expectFailure(validRecord, "actual_generation_calls_nonzero_fails", (candidate) => {
      candidate.max_generation_calls.actual_generation_calls = 1;
    }),
    expectFailure(validRecord, "future_execution_authorized_fails", (candidate) => {
      candidate.max_generation_calls.future_execution_authorized_by_this_packet = true;
    }),
    expectFailure(validRecord, "prompt_preview_dispatch_allowed_fails", (candidate) => {
      candidate.prompt_package_preview.generation_dispatch_allowed = true;
    }),
    expectFailure(validRecord, "output_written_fails", (candidate) => {
      candidate.output_policy.actual_output_written = true;
    }),
    expectFailure(validRecord, "review_gate_disabled_fails", (candidate) => {
      candidate.review_gate.review_required_before_acceptance = false;
    }),
    expectFailure(validRecord, "failure_stop_disabled_fails", (candidate) => {
      candidate.failure_stop_condition.stop_on_evidence_mismatch = false;
    }),
    expectFailure(validRecord, "memory_default_disabled_fails", (candidate) => {
      candidate.no_memory_by_default.enabled = false;
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
    expectFailure(validRecord, "daily_note_write_true_fails", (candidate) => {
      candidate.side_effects.DailyNote_write_performed = true;
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
      candidate.readiness_packet_id = "C:\\private\\prompt.txt";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.readiness_packet_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    missing_prompt_package_preview_caught: cases.some((item) => item.case_id === "missing_prompt_package_preview_fails" && item.result === "caught"),
    max_generation_calls_guard_caught: cases.some((item) => item.case_id === "max_generation_calls_too_high_fails" && item.result === "caught"),
    actual_generation_call_caught: cases.some((item) => item.case_id === "actual_generation_calls_nonzero_fails" && item.result === "caught"),
    output_policy_drift_caught: cases.some((item) => item.case_id === "output_written_fails" && item.result === "caught"),
    review_gate_drift_caught: cases.some((item) => item.case_id === "review_gate_disabled_fails" && item.result === "caught"),
    failure_stop_condition_drift_caught: cases.some((item) => item.case_id === "failure_stop_disabled_fails" && item.result === "caught"),
    no_memory_by_default_drift_caught: cases.some((item) => item.case_id === "memory_default_disabled_fails" && item.result === "caught"),
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
  const reportRecord = readJson(reportPath).controlled_generation_readiness_packet;
  const validRecord = readJson(passFixturePath).controlled_generation_readiness_packet;
  const invalidRecord = readJson(failFixturePath).controlled_generation_readiness_packet;

  assert(doc.includes("prompt_package_preview"), "doc must mention prompt_package_preview");
  assert(doc.includes("max_generation_calls"), "doc must mention max_generation_calls");
  assert(doc.includes("output_policy"), "doc must mention output_policy");
  assert(doc.includes("review_gate"), "doc must mention review_gate");
  assert(doc.includes("failure_stop_condition"), "doc must mention failure_stop_condition");
  assert(doc.includes("no_memory_by_default"), "doc must mention no_memory_by_default");
  assert(schema.includes("controlled_generation_readiness_packet"), "schema must define controlled generation readiness packet");
  assert(mvp.includes("validate_controlled_generation_readiness_packet.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_0_CONTROLLED_GENERATION_READINESS_PACKET_SLICE"), "exact-slice wiring missing");

  validateReadinessRecord(reportRecord);
  validateReadinessRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_controlled_generation_readiness_packet",
    phase,
    readiness_doc_present: true,
    readiness_schema_present: true,
    readiness_report_present: true,
    readiness_fixture_present: true,
    readiness_fail_fixture_present: true,
    source_evidence_consistency_verified: true,
    source_prompt_correction_hint_verified: true,
    prompt_package_preview_present: true,
    max_generation_calls_present: true,
    output_policy_present: true,
    review_gate_present: true,
    failure_stop_condition_present: true,
    no_memory_by_default_present: true,
    max_generation_calls_bounded: true,
    actual_generation_calls_zero: true,
    provider_call_budget_consumed_zero: true,
    future_execution_authorized_by_this_packet: false,
    prompt_preview_dispatch_allowed: false,
    preview_only_output_policy: true,
    review_gate_required: true,
    failure_stop_condition_required: true,
    no_memory_by_default: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    missing_prompt_package_preview_caught: negativeCaseSummary.missing_prompt_package_preview_caught,
    max_generation_calls_guard_caught: negativeCaseSummary.max_generation_calls_guard_caught,
    actual_generation_call_caught: negativeCaseSummary.actual_generation_call_caught,
    output_policy_drift_caught: negativeCaseSummary.output_policy_drift_caught,
    review_gate_drift_caught: negativeCaseSummary.review_gate_drift_caught,
    failure_stop_condition_drift_caught: negativeCaseSummary.failure_stop_condition_drift_caught,
    no_memory_by_default_drift_caught: negativeCaseSummary.no_memory_by_default_drift_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    planning_only: true,
    metadata_only: true,
    dry_run_only: true,
    image_binary_read_performed: false,
    actual_generation_calls: 0,
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
