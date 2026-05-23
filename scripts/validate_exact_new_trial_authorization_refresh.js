#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_4_exact_new_trial_authorization_refresh";
const docPath = "docs/V0_6_4_EXACT_NEW_TRIAL_AUTHORIZATION_REFRESH.md";
const schemaPath = "schemas/exact_new_trial_authorization_refresh.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_4_exact_new_trial_authorization_refresh.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_authorization_refresh.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_authorization_refresh_fail.example.json";
const candidatePacketPath = "docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md";
const pilotGatePath = "docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md";
const failedInspectionPath = "reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json";
const firstReceiptPath = "reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json";
const retryReceiptPath = "reports/provider_receipts/v0_3_3_retry_001_receipt.json";
const smokeReceiptPath = "reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json";
const safePortraitReceiptPath = "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json";
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

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function loadReceipt(relativePath) {
  return readJson(relativePath);
}

function validateRecord(record) {
  assert(record && typeof record === "object", "exact new-trial authorization refresh missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_authorization_refresh");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_candidate_packet_ref === candidatePacketPath, "source_candidate_packet_ref mismatch");
  assert(record.source_pilot_gate_ref === pilotGatePath, "source_pilot_gate_ref mismatch");
  assert(record.failed_attempt_inspection_ref === failedInspectionPath, "failed_attempt_inspection_ref mismatch");
  assert(record.first_attempt_receipt_ref === firstReceiptPath, "first_attempt_receipt_ref mismatch");
  assert(record.retry_001_receipt_ref === retryReceiptPath, "retry_001_receipt_ref mismatch");
  assert(record.smoke_001_receipt_ref === smokeReceiptPath, "smoke_001_receipt_ref mismatch");
  assert(record.safe_portrait_001_receipt_ref === safePortraitReceiptPath, "safe_portrait_001_receipt_ref mismatch");

  const first = loadReceipt(firstReceiptPath);
  const retry = loadReceipt(retryReceiptPath);
  const smoke = loadReceipt(smokeReceiptPath);
  const safe = loadReceipt(safePortraitReceiptPath);

  assert(first.status === "failed_no_image_generated", "first attempt receipt status mismatch");
  assert(retry.status === "failed_no_image_generated", "retry receipt status mismatch");
  assert(smoke.status === "succeeded_image_generated", "smoke receipt status mismatch");
  assert(safe.status === "succeeded_image_generated", "safe portrait receipt status mismatch");

  const diagnostics = record.route_diagnostics;
  assert(diagnostics.first_attempt_failed_no_image === true, "first_attempt_failed_no_image must be true");
  assert(diagnostics.retry_001_failed_no_image === true, "retry_001_failed_no_image must be true");
  assert(diagnostics.smoke_001_succeeded_image_generated === true, "smoke_001_succeeded_image_generated must be true");
  assert(diagnostics.safe_portrait_001_succeeded_image_generated === true, "safe_portrait_001_succeeded_image_generated must be true");
  assert(diagnostics.failure_not_treated_as_general_route_outage === true, "failure_not_treated_as_general_route_outage must be true");

  const candidate = record.refreshed_candidate_fields;
  assert(candidate.reuse_original_prompt_by_default === false, "reuse_original_prompt_by_default must be false");
  assert(candidate.reuse_retry_001_prompt_by_default === false, "reuse_retry_001_prompt_by_default must be false");
  assert(candidate.explicit_new_prompt_package_or_override_required === true, "explicit_new_prompt_package_or_override_required must be true");
  assert(candidate.max_provider_calls_still_1 === true, "max_provider_calls_still_1 must be true");
  assert(candidate.max_image_candidates_still_1 === true, "max_image_candidates_still_1 must be true");
  assert(candidate.retry_limit_still_0 === true, "retry_limit_still_0 must be true");
  assert(candidate.no_memory_write_default_still_true === true, "no_memory_write_default_still_true must be true");
  assert(candidate.new_output_directory_required === true, "new_output_directory_required must be true");
  assert(candidate.new_receipt_path_required === true, "new_receipt_path_required must be true");
  assert(candidate.new_registry_path_required === true, "new_registry_path_required must be true");
  assert(candidate.new_review_console_bridge_ref_required === true, "new_review_console_bridge_ref_required must be true");
  assert(candidate.overwrite_existing_files_allowed === false, "overwrite_existing_files_allowed must be false");

  const preflight = record.refreshed_gate_preflight;
  assert(preflight.new_prompt_decision_required === true, "new_prompt_decision_required must be true");
  assert(preflight.output_collision_check_required === true, "output_collision_check_required must be true");
  assert(preflight.receipt_collision_check_required === true, "receipt_collision_check_required must be true");
  assert(preflight.registry_write_plan_refresh_required === true, "registry_write_plan_refresh_required must be true");
  assert(preflight.review_bridge_uniqueness_required === true, "review_bridge_uniqueness_required must be true");
  assert(preflight.exact_authorization_phrase_refresh_required === true, "exact_authorization_phrase_refresh_required must be true");
  assert(preflight.can_execute_now === false, "can_execute_now must remain false");

  assert(fs.existsSync(repoPath(candidatePacketPath)), "source candidate packet must exist");
  assert(fs.existsSync(repoPath(pilotGatePath)), "source pilot gate must exist");
  assert(fs.existsSync(repoPath(failedInspectionPath)), "failed inspection must exist");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.refresh_packet_only === true, "refresh_packet_only must be true");
  assert(record.boundaries?.no_new_trial_executed === true, "no_new_trial_executed must be true");
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
  assert(invalidFixtureCaught, "invalid new-trial authorization refresh fixture must fail");

  const cases = [
    expectFailure(validRecord, "retry_failure_missing_fails", (candidate) => { candidate.route_diagnostics.retry_001_failed_no_image = false; }),
    expectFailure(validRecord, "route_outage_inference_false_fails", (candidate) => { candidate.route_diagnostics.failure_not_treated_as_general_route_outage = false; }),
    expectFailure(validRecord, "reuse_original_prompt_true_fails", (candidate) => { candidate.refreshed_candidate_fields.reuse_original_prompt_by_default = true; }),
    expectFailure(validRecord, "reuse_retry_prompt_true_fails", (candidate) => { candidate.refreshed_candidate_fields.reuse_retry_001_prompt_by_default = true; }),
    expectFailure(validRecord, "explicit_new_prompt_required_false_fails", (candidate) => { candidate.refreshed_candidate_fields.explicit_new_prompt_package_or_override_required = false; }),
    expectFailure(validRecord, "retry_limit_zero_false_fails", (candidate) => { candidate.refreshed_candidate_fields.retry_limit_still_0 = false; }),
    expectFailure(validRecord, "no_memory_write_default_false_fails", (candidate) => { candidate.refreshed_candidate_fields.no_memory_write_default_still_true = false; }),
    expectFailure(validRecord, "new_output_directory_required_false_fails", (candidate) => { candidate.refreshed_candidate_fields.new_output_directory_required = false; }),
    expectFailure(validRecord, "new_receipt_path_required_false_fails", (candidate) => { candidate.refreshed_candidate_fields.new_receipt_path_required = false; }),
    expectFailure(validRecord, "new_registry_path_required_false_fails", (candidate) => { candidate.refreshed_candidate_fields.new_registry_path_required = false; }),
    expectFailure(validRecord, "review_bridge_uniqueness_false_fails", (candidate) => { candidate.refreshed_gate_preflight.review_bridge_uniqueness_required = false; }),
    expectFailure(validRecord, "authorization_phrase_refresh_false_fails", (candidate) => { candidate.refreshed_gate_preflight.exact_authorization_phrase_refresh_required = false; }),
    expectFailure(validRecord, "can_execute_now_true_fails", (candidate) => { candidate.refreshed_gate_preflight.can_execute_now = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.refresh_id = "C:\\private\\refresh.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.refresh_id = ".env.local"; })
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
  const reportRecord = readJson(reportPath).exact_new_trial_authorization_refresh;
  const validRecord = readJson(passFixturePath).exact_new_trial_authorization_refresh;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_authorization_refresh;

  for (const token of ["reuse_original_prompt_by_default", "reuse_retry_001_prompt_by_default", "new_output_directory_required", "exact_authorization_phrase_refresh_required"]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("exact_new_trial_authorization_refresh"), "schema must define exact_new_trial_authorization_refresh");
  assert(mvp.includes("validate_exact_new_trial_authorization_refresh.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_4_EXACT_NEW_TRIAL_AUTHORIZATION_REFRESH_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_authorization_refresh",
    phase,
    refresh_doc_present: true,
    refresh_schema_present: true,
    refresh_report_present: true,
    refresh_fixture_present: true,
    refresh_fail_fixture_present: true,
    first_attempt_failed_no_image: true,
    retry_001_failed_no_image: true,
    smoke_001_succeeded_image_generated: true,
    safe_portrait_001_succeeded_image_generated: true,
    failure_not_treated_as_general_route_outage: true,
    reuse_original_prompt_by_default: false,
    reuse_retry_001_prompt_by_default: false,
    explicit_new_prompt_package_or_override_required: true,
    max_provider_calls_still_1: true,
    max_image_candidates_still_1: true,
    retry_limit_still_0: true,
    no_memory_write_default_still_true: true,
    new_output_directory_required: true,
    new_receipt_path_required: true,
    new_registry_path_required: true,
    new_review_console_bridge_ref_required: true,
    new_prompt_decision_required: true,
    output_collision_check_required: true,
    receipt_collision_check_required: true,
    registry_write_plan_refresh_required: true,
    review_bridge_uniqueness_required: true,
    exact_authorization_phrase_refresh_required: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    metadata_only: true,
    refresh_packet_only: true,
    no_new_trial_executed: true,
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
