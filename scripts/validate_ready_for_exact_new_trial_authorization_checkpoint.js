#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_5_ready_for_exact_new_trial_authorization_checkpoint";
const docPath = "docs/V0_6_5_READY_FOR_EXACT_NEW_TRIAL_AUTHORIZATION_CHECKPOINT.md";
const schemaPath = "schemas/ready_for_exact_new_trial_authorization_checkpoint.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json";
const passFixturePath = "tests/schema_examples/ready_for_exact_new_trial_authorization_checkpoint.example.json";
const failFixturePath = "tests/schema_examples/ready_for_exact_new_trial_authorization_checkpoint_fail.example.json";
const failedInspectionPath = "reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json";
const refreshPath = "reports/visual_asset_eval_dry_run/v0_6_4_exact_new_trial_authorization_refresh.json";
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

function assertFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateSources() {
  const failedInspection = readJson(failedInspectionPath).failed_provider_attempt_inspection;
  const refresh = readJson(refreshPath).exact_new_trial_authorization_refresh;
  const records = { failedInspection, refresh };
  assertNoSecretOrRawPath(records, "ready_for_exact_new_trial_authorization_sources");

  assert(failedInspection.phase === "v0_6_3_failed_provider_attempt_inspection", "failed inspection phase mismatch");
  assert(failedInspection.inspection_assertions?.all_required_failed_attempt_evidence_present === true, "failed inspection must keep evidence present");
  assert(refresh.phase === "v0_6_4_exact_new_trial_authorization_refresh", "refresh phase mismatch");
  assert(refresh.refreshed_candidate_fields?.explicit_new_prompt_package_or_override_required === true, "refresh must require explicit new prompt or override");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "ready-for-exact-new-trial checkpoint missing");
  assertNoSecretOrRawPath(record, "ready_for_exact_new_trial_authorization_checkpoint");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_failed_provider_attempt_inspection_ref === failedInspectionPath, "source_failed_provider_attempt_inspection_ref mismatch");
  assert(record.source_exact_new_trial_authorization_refresh_ref === refreshPath, "source_exact_new_trial_authorization_refresh_ref mismatch");

  validateSources();

  const assertions = record.checkpoint_assertions;
  assert(assertions.failed_provider_attempt_inspection_exists === true, "failed_provider_attempt_inspection_exists must be true");
  assert(assertions.exact_new_trial_authorization_refresh_exists === true, "exact_new_trial_authorization_refresh_exists must be true");
  assert(assertions.ready_for_exact_new_trial_authorization === true, "ready_for_exact_new_trial_authorization must be true");
  assert(assertions.future_exact_approval_phrase_required === true, "future_exact_approval_phrase_required must be true");
  assert(assertions.can_execute_now === false, "can_execute_now must be false");

  const readiness = record.authorization_readiness;
  assert(readiness.first_attempt_failed_no_image === true, "first_attempt_failed_no_image must be true");
  assert(readiness.retry_001_failed_no_image === true, "retry_001_failed_no_image must be true");
  assert(readiness.smoke_001_succeeded_image_generated === true, "smoke_001_succeeded_image_generated must be true");
  assert(readiness.safe_portrait_001_succeeded_image_generated === true, "safe_portrait_001_succeeded_image_generated must be true");
  assert(readiness.reuse_original_prompt_by_default === false, "reuse_original_prompt_by_default must be false");
  assert(readiness.reuse_retry_001_prompt_by_default === false, "reuse_retry_001_prompt_by_default must be false");
  assert(readiness.explicit_new_prompt_package_or_override_required === true, "explicit_new_prompt_package_or_override_required must be true");
  assert(readiness.new_outputDirectory_required === undefined, "unexpected camel-case field present");
  assert(readiness.new_output_directory_required === true, "new_output_directory_required must be true");
  assert(readiness.new_receipt_path_required === true, "new_receipt_path_required must be true");
  assert(readiness.new_registry_path_required === true, "new_registry_path_required must be true");
  assert(readiness.new_review_console_bridge_ref_required === true, "new_review_console_bridge_ref_required must be true");
  assert(readiness.max_provider_calls_still_1 === true, "max_provider_calls_still_1 must be true");
  assert(readiness.max_image_candidates_still_1 === true, "max_image_candidates_still_1 must be true");
  assert(readiness.retry_limit_still_0 === true, "retry_limit_still_0 must be true");
  assert(readiness.no_memory_write_default_still_true === true, "no_memory_write_default_still_true must be true");

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length > 0, "next_route_options required");
  assert(record.next_route_options.every((item) => !/execute_real_generation_now|provider_call|memory_write/i.test(item)), "next route options must not authorize execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.checkpoint_only === true, "checkpoint_only must be true");
  assert(record.boundaries?.authorization_ready_only === true, "authorization_ready_only must be true");
  assert(record.boundaries?.can_execute_now === false, "boundary can_execute_now must be false");
  assert(record.boundaries?.real_executor_implemented_now === false, "real executor must remain false");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2 must remain false");
  assertFalseFlags(record.boundaries, "boundaries");
  assertFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
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
  assert(invalidFixtureCaught, "invalid ready-for-exact-new-trial checkpoint fixture must fail");

  const cases = [
    expectFailure(validRecord, "failed_inspection_missing_fails", (candidate) => { candidate.checkpoint_assertions.failed_provider_attempt_inspection_exists = false; }),
    expectFailure(validRecord, "refresh_missing_fails", (candidate) => { candidate.checkpoint_assertions.exact_new_trial_authorization_refresh_exists = false; }),
    expectFailure(validRecord, "ready_flag_false_fails", (candidate) => { candidate.checkpoint_assertions.ready_for_exact_new_trial_authorization = false; }),
    expectFailure(validRecord, "approval_phrase_required_false_fails", (candidate) => { candidate.checkpoint_assertions.future_exact_approval_phrase_required = false; }),
    expectFailure(validRecord, "can_execute_now_true_fails", (candidate) => { candidate.checkpoint_assertions.can_execute_now = true; }),
    expectFailure(validRecord, "retry_001_failed_flag_false_fails", (candidate) => { candidate.authorization_readiness.retry_001_failed_no_image = false; }),
    expectFailure(validRecord, "reuse_original_prompt_true_fails", (candidate) => { candidate.authorization_readiness.reuse_original_prompt_by_default = true; }),
    expectFailure(validRecord, "reuse_retry_prompt_true_fails", (candidate) => { candidate.authorization_readiness.reuse_retry_001_prompt_by_default = true; }),
    expectFailure(validRecord, "new_output_dir_required_false_fails", (candidate) => { candidate.authorization_readiness.new_output_directory_required = false; }),
    expectFailure(validRecord, "new_receipt_path_required_false_fails", (candidate) => { candidate.authorization_readiness.new_receipt_path_required = false; }),
    expectFailure(validRecord, "new_registry_path_required_false_fails", (candidate) => { candidate.authorization_readiness.new_registry_path_required = false; }),
    expectFailure(validRecord, "new_review_bridge_required_false_fails", (candidate) => { candidate.authorization_readiness.new_review_console_bridge_ref_required = false; }),
    expectFailure(validRecord, "no_memory_default_false_fails", (candidate) => { candidate.authorization_readiness.no_memory_write_default_still_true = false; }),
    expectFailure(validRecord, "execution_route_option_fails", (candidate) => { candidate.next_route_options = ["execute_real_generation_now"]; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.checkpoint_id = "C:\\private\\checkpoint.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.checkpoint_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).ready_for_exact_new_trial_authorization_checkpoint;
  const validRecord = readJson(passFixturePath).ready_for_exact_new_trial_authorization_checkpoint;
  const invalidRecord = readJson(failFixturePath).ready_for_exact_new_trial_authorization_checkpoint;

  for (const token of [
    "failed_provider_attempt_inspection exists: true",
    "exact_new_trial_authorization_refresh exists: true",
    "ready_for_exact_new_trial_authorization: true",
    "future_exact_approval_phrase_required: true",
    "can_execute_now: false",
    "reuse_original_prompt_by_default: false",
    "reuse_retry_001_prompt_by_default: false",
    "new_output_directory_required: true"
  ]) {
    assert(doc.includes(token), `checkpoint doc missing token: ${token}`);
  }
  assert(schema.includes("ready_for_exact_new_trial_authorization_checkpoint"), "schema must define ready-for-exact-new-trial checkpoint");
  assert(mvp.includes("validate_ready_for_exact_new_trial_authorization_checkpoint.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_5_READY_FOR_EXACT_NEW_TRIAL_AUTHORIZATION_CHECKPOINT_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_ready_for_exact_new_trial_authorization_checkpoint",
    phase,
    checkpoint_doc_present: true,
    checkpoint_schema_present: true,
    checkpoint_report_present: true,
    checkpoint_fixture_present: true,
    checkpoint_fail_fixture_present: true,
    failed_provider_attempt_inspection_exists: true,
    exact_new_trial_authorization_refresh_exists: true,
    ready_for_exact_new_trial_authorization: true,
    future_exact_approval_phrase_required: true,
    can_execute_now: false,
    first_attempt_failed_no_image: true,
    retry_001_failed_no_image: true,
    smoke_001_succeeded_image_generated: true,
    safe_portrait_001_succeeded_image_generated: true,
    reuse_original_prompt_by_default: false,
    reuse_retry_001_prompt_by_default: false,
    explicit_new_prompt_package_or_override_required: true,
    new_output_directory_required: true,
    new_receipt_path_required: true,
    new_registry_path_required: true,
    new_review_console_bridge_ref_required: true,
    max_provider_calls_still_1: true,
    max_image_candidates_still_1: true,
    retry_limit_still_0: true,
    no_memory_write_default_still_true: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    metadata_only: true,
    checkpoint_only: true,
    authorization_ready_only: true,
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

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
}
