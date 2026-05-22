#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_6_human_review_gate_packet";
const docPath = "docs/V0_5_6_HUMAN_REVIEW_GATE_PACKET.md";
const schemaPath = "schemas/human_review_gate_packet.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json";
const passFixturePath = "tests/schema_examples/human_review_gate_packet.example.json";
const failFixturePath = "tests/schema_examples/human_review_gate_packet_fail.example.json";
const readinessSemanticsPath = "reports/visual_asset_eval_dry_run/v0_5_5_controlled_generation_readiness_semantics_hardening.json";
const promptPreviewPath = "reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json";
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

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateSources() {
  const readiness = readJson(readinessSemanticsPath).controlled_generation_readiness_semantics_hardening;
  const promptPreview = readJson(promptPreviewPath).prompt_package_preview;
  assert(readiness.phase === "v0_5_5_controlled_generation_readiness_semantics_hardening", "source readiness semantics phase mismatch");
  assert(readiness.no_execute_now_true === undefined || readiness.semantic_assertions.no_execute_now_must_be_true === true, "source readiness semantics no_execute_now guard missing");
  assert(promptPreview.phase === "v0_5_1_prompt_package_preview", "source prompt preview phase mismatch");
  assert(promptPreview.boundaries.actual_generation_calls === 0, "source prompt preview actual generation calls must remain zero");
}

function validateNonEmptyStringArray(value, message) {
  assert(Array.isArray(value) && value.length > 0, message);
  value.forEach((item) => assert(typeof item === "string" && item.trim().length > 0, message));
}

function validateRecord(record) {
  assert(record && typeof record === "object", "human review gate packet missing");
  assertNoSecretOrRawPath(record, "human_review_gate_packet");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_readiness_semantics_ref === readinessSemanticsPath, "source readiness semantics ref mismatch");
  assert(record.source_prompt_package_preview_ref === promptPreviewPath, "source prompt package preview ref mismatch");

  validateSources();

  const reviewer = record.reviewer_required;
  assert(reviewer && typeof reviewer === "object", "reviewer_required missing");
  assert(reviewer.enabled === true, "reviewer_required must be enabled");
  assert(typeof reviewer.human_reviewer_role === "string" && reviewer.human_reviewer_role.length > 0, "human_reviewer_role required");
  assert(reviewer.auto_approval_allowed === false, "auto approval must remain false");

  const scope = record.approval_scope;
  assert(scope && typeof scope === "object", "approval_scope missing");
  assert(scope.prompt_package_preview_ref === promptPreviewPath, "approval scope prompt preview ref mismatch");
  validateNonEmptyStringArray(scope.allowed_asset_scope, "approval scope allowed_asset_scope required");
  assert(typeof scope.allowed_action === "string" && scope.allowed_action.length > 0, "approval scope allowed_action required");
  assert(scope.production_candidate_promotion_allowed === false, "production candidate promotion must remain false");

  const maxCalls = record.max_generation_calls;
  assert(maxCalls && typeof maxCalls === "object", "max_generation_calls missing");
  assert(Number.isInteger(maxCalls.configured_limit) && maxCalls.configured_limit >= 1 && maxCalls.configured_limit <= 3, "configured limit must be bounded");
  assert(maxCalls.actual_generation_calls === 0, "actual generation calls must remain zero");
  assert(maxCalls.approved_limit_required_before_execution === true, "approved limit must be required before execution");

  const outputPolicy = record.approved_output_policy;
  assert(outputPolicy && typeof outputPolicy === "object", "approved_output_policy missing");
  assert(outputPolicy.preview_receipt_only === true, "approved output policy must remain preview receipt only");
  assert(outputPolicy.output_dir_preapproved === false, "output dir must not be preapproved yet");
  assert(outputPolicy.accepted_sample_promotion_allowed === false, "accepted sample promotion must remain false");
  assert(outputPolicy.production_candidate_allowed === false, "production candidate must remain false");

  const stopConditions = record.stop_conditions;
  assert(stopConditions && typeof stopConditions === "object", "stop_conditions missing");
  assert(stopConditions.stop_without_reviewer === true, "stop_without_reviewer must remain true");
  assert(stopConditions.stop_on_scope_drift === true, "stop_on_scope_drift must remain true");
  assert(stopConditions.stop_on_output_policy_drift === true, "stop_on_output_policy_drift must remain true");
  assert(stopConditions.stop_on_memory_request === true, "stop_on_memory_request must remain true");

  const memoryDefault = record.no_memory_by_default;
  assert(memoryDefault && typeof memoryDefault === "object", "no_memory_by_default missing");
  assert(memoryDefault.enabled === true, "no_memory_by_default must remain enabled");
  assert(memoryDefault.VCP_memory_write_allowed === false, "VCP memory write must remain false");
  assert(memoryDefault.DailyNote_write_allowed === false, "DailyNote write must remain false");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.review_gate_packet_only === true, "review_gate_packet_only must be true");
  assert(record.boundaries?.actual_generation_calls === 0, "boundary actual generation calls must remain zero");
  assert(record.boundaries?.real_executor_implemented_now === false, "real executor must remain false");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2 must remain false");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate);
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
    validateRecord(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid human review gate packet fixture must fail");

  const cases = [
    expectFailure(validRecord, "reviewer_required_disabled_fails", (candidate) => {
      candidate.reviewer_required.enabled = false;
    }),
    expectFailure(validRecord, "auto_approval_allowed_fails", (candidate) => {
      candidate.reviewer_required.auto_approval_allowed = true;
    }),
    expectFailure(validRecord, "approval_scope_missing_asset_scope_fails", (candidate) => {
      candidate.approval_scope.allowed_asset_scope = [];
    }),
    expectFailure(validRecord, "approval_scope_action_missing_fails", (candidate) => {
      candidate.approval_scope.allowed_action = "";
    }),
    expectFailure(validRecord, "max_generation_calls_unbounded_fails", (candidate) => {
      candidate.max_generation_calls.configured_limit = 4;
    }),
    expectFailure(validRecord, "actual_generation_calls_nonzero_fails", (candidate) => {
      candidate.max_generation_calls.actual_generation_calls = 1;
    }),
    expectFailure(validRecord, "approved_limit_not_required_fails", (candidate) => {
      candidate.max_generation_calls.approved_limit_required_before_execution = false;
    }),
    expectFailure(validRecord, "output_policy_preview_receipt_only_fails", (candidate) => {
      candidate.approved_output_policy.preview_receipt_only = false;
    }),
    expectFailure(validRecord, "output_dir_preapproved_true_fails", (candidate) => {
      candidate.approved_output_policy.output_dir_preapproved = true;
    }),
    expectFailure(validRecord, "stop_without_reviewer_false_fails", (candidate) => {
      candidate.stop_conditions.stop_without_reviewer = false;
    }),
    expectFailure(validRecord, "stop_on_memory_request_false_fails", (candidate) => {
      candidate.stop_conditions.stop_on_memory_request = false;
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
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => {
      candidate.side_effects.production_candidate_created = true;
    }),
    expectFailure(validRecord, "push_l2_exercised_true_fails", (candidate) => {
      candidate.boundaries.Push_L2_exercised = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.review_gate_packet_id = "C:\\private\\review-gate.json";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.review_gate_packet_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    reviewer_required_guard_caught: cases.some((item) => item.case_id === "reviewer_required_disabled_fails" && item.result === "caught"),
    approval_scope_guard_caught: cases.some((item) => item.case_id === "approval_scope_missing_asset_scope_fails" && item.result === "caught"),
    max_generation_calls_guard_caught: cases.some((item) => item.case_id === "max_generation_calls_unbounded_fails" && item.result === "caught"),
    output_policy_guard_caught: cases.some((item) => item.case_id === "output_policy_preview_receipt_only_fails" && item.result === "caught"),
    stop_conditions_guard_caught: cases.some((item) => item.case_id === "stop_without_reviewer_false_fails" && item.result === "caught"),
    no_memory_default_guard_caught: cases.some((item) => item.case_id === "memory_default_disabled_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "memory_write_true_fails" && item.result === "caught"),
    production_candidate_caught: cases.some((item) => item.case_id === "production_candidate_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).human_review_gate_packet;
  const validRecord = readJson(passFixturePath).human_review_gate_packet;
  const invalidRecord = readJson(failFixturePath).human_review_gate_packet;

  for (const token of [
    "reviewer_required",
    "approval_scope",
    "max_generation_calls",
    "approved_output_policy",
    "stop_conditions",
    "no_memory_by_default"
  ]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("human_review_gate_packet"), "schema must define human_review_gate_packet");
  assert(mvp.includes("validate_human_review_gate_packet.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_6_HUMAN_REVIEW_GATE_PACKET_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_human_review_gate_packet",
    phase,
    review_gate_doc_present: true,
    review_gate_schema_present: true,
    review_gate_report_present: true,
    review_gate_fixture_present: true,
    review_gate_fail_fixture_present: true,
    source_readiness_semantics_verified: true,
    source_prompt_package_preview_verified: true,
    reviewer_required: true,
    approval_scope: true,
    max_generation_calls: true,
    approved_output_policy: true,
    stop_conditions: true,
    no_memory_by_default: true,
    actual_generation_calls_zero: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    reviewer_required_guard_caught: negativeCaseSummary.reviewer_required_guard_caught,
    approval_scope_guard_caught: negativeCaseSummary.approval_scope_guard_caught,
    max_generation_calls_guard_caught: negativeCaseSummary.max_generation_calls_guard_caught,
    output_policy_guard_caught: negativeCaseSummary.output_policy_guard_caught,
    stop_conditions_guard_caught: negativeCaseSummary.stop_conditions_guard_caught,
    no_memory_default_guard_caught: negativeCaseSummary.no_memory_default_guard_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    production_candidate_caught: negativeCaseSummary.production_candidate_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    dry_run_only: true,
    review_gate_packet_only: true,
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
