#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_12_local_preflight_only_gate";
const docPath = "docs/V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE.md";
const schemaPath = "schemas/exact_new_trial_local_preflight_only_gate.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_12_local_preflight_only_gate.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_local_preflight_only_gate.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_local_preflight_only_gate_fail.example.json";
const preflightAuthorizationPath = "reports/visual_asset_eval_dry_run/v0_6_11_exact_new_trial_preflight_authorization_gate.json";
const requestTextPath = "reports/visual_asset_eval_dry_run/v0_6_9_exact_new_trial_request_text_regenerated.json";
const fieldResolutionPath = "reports/visual_asset_eval_dry_run/v0_6_8_exact_new_trial_intake_field_resolution.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const selectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const selectedOutputDirectory = "runs/real_generation/v0_3_3_exact_new_trial_001/";
const selectedReceiptPath = "reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json";
const selectedRegistryPath = "reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json";
const selectedBridgeRef = "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001";

const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "output_directory_created",
  "receipt_write_performed",
  "registry_write_performed",
  "review_console_bridge_materialized",
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
  const preflight = readJson(preflightAuthorizationPath).exact_new_trial_preflight_authorization_gate;
  const requestText = readJson(requestTextPath).exact_new_trial_request_text_regenerated;
  const fieldResolution = readJson(fieldResolutionPath).exact_new_trial_intake_field_resolution;
  assertNoSecretOrRawPath({ preflight, requestText, fieldResolution }, "exact_new_trial_local_preflight_only_gate_sources");

  assert(preflight.phase === "v0_6_11_exact_new_trial_preflight_authorization_gate", "preflight authorization phase mismatch");
  assert(preflight.authorization_status_record?.preflight_authorization_consumed === false, "source preflight authorization must be unconsumed before v0.6.12");
  assert(preflight.authorization_scope?.local_preflight_allowed_now === true, "source must allow local preflight");
  assert(preflight.authorization_scope?.provider_contact_allowed_now === false, "source must still block provider contact");
  assert(preflight.authorization_scope?.image_generation_allowed_now === false, "source must still block image generation");

  assert(requestText.phase === "v0_6_9_exact_new_trial_request_text_regenerated", "request text phase mismatch");
  assert(requestText.regenerated_request_text?.prompt_package_ref === selectedPrompt, "request text prompt mismatch");
  assert(requestText.regenerated_request_text?.output_directory === selectedOutputDirectory, "request text output directory mismatch");
  assert(requestText.regenerated_request_text?.receipt_path === selectedReceiptPath, "request text receipt path mismatch");
  assert(requestText.regenerated_request_text?.registry_path === selectedRegistryPath, "request text registry path mismatch");
  assert(requestText.regenerated_request_text?.review_console_bridge_ref === selectedBridgeRef, "request text bridge ref mismatch");

  assert(fieldResolution.phase === "v0_6_8_exact_new_trial_intake_field_resolution", "field resolution phase mismatch");
  assert(fieldResolution.resolved_exact_fields?.prompt_package_ref_or_override?.selected_value === selectedPrompt, "field resolution prompt mismatch");
  assert(fieldResolution.resolved_exact_fields?.output_directory?.selected_value === selectedOutputDirectory, "field resolution output directory mismatch");
  assert(fieldResolution.resolved_exact_fields?.receipt_path?.selected_value === selectedReceiptPath, "field resolution receipt path mismatch");
  assert(fieldResolution.resolved_exact_fields?.registry_path?.selected_value === selectedRegistryPath, "field resolution registry path mismatch");
  assert(fieldResolution.resolved_exact_fields?.review_console_bridge_ref?.selected_value === selectedBridgeRef, "field resolution bridge ref mismatch");

  assert(fs.existsSync(repoPath(selectedPrompt)), "selected prompt package must exist for local preflight");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "local preflight-only gate missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_local_preflight_only_gate");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_preflight_authorization_gate_ref === preflightAuthorizationPath, "source_preflight_authorization_gate_ref mismatch");
  assert(record.source_request_text_regenerated_ref === requestTextPath, "source_request_text_regenerated_ref mismatch");
  assert(record.source_intake_field_resolution_ref === fieldResolutionPath, "source_intake_field_resolution_ref mismatch");

  validateSources();

  const status = record.local_preflight_status;
  assert(status.authorization_status === "approved_for_metadata_only_preflight_consumed_by_local_preflight", "authorization_status mismatch");
  assert(status.approval_status === "approved_for_preflight_only", "approval_status mismatch");
  assert(status.source_preflight_authorization_consumed === true, "source_preflight_authorization_consumed must be true");
  assert(status.consumed_by_phase === phase, "consumed_by_phase mismatch");
  assert(status.local_preflight_run_performed === true, "local_preflight_run_performed must be true");
  assert(status.request_submitted === false, "request_submitted must remain false");
  assert(status.execute_now === false, "execute_now must remain false");

  const targets = record.checked_exact_targets;
  assert(targets.prompt_package_ref === selectedPrompt, "checked prompt mismatch");
  assert(targets.output_directory === selectedOutputDirectory, "checked output directory mismatch");
  assert(targets.receipt_path === selectedReceiptPath, "checked receipt path mismatch");
  assert(targets.registry_path === selectedRegistryPath, "checked registry path mismatch");
  assert(targets.review_console_bridge_ref === selectedBridgeRef, "checked bridge ref mismatch");

  const constraints = record.fixed_constraints_confirmation;
  assert(constraints.provider_target === "codex_builtin_image_generation", "provider target mismatch");
  assert(constraints.plugin_id_or_provider_route === "image_gen.imagegen", "provider route mismatch");
  assert(constraints.model === "managed_by_codex_image_tool", "model mismatch");
  assert(constraints.command === "generate", "command mismatch");
  assert(constraints.exact_call_count === 1, "exact_call_count must remain 1");
  assert(constraints.max_image_candidates === 1, "max_image_candidates must remain 1");
  assert(constraints.retry_limit === 0, "retry_limit must remain 0");
  assert(constraints.review_required_after_generation === true, "review_required_after_generation must remain true");
  assert(constraints.no_memory_write_default === true, "no_memory_write_default must remain true");
  assert(constraints.overwrite_existing_files_allowed === false, "overwrite_existing_files_allowed must remain false");
  assert(constraints.secret_value_read_allowed === false, "secret_value_read_allowed must remain false");

  const assertions = record.preflight_assertions;
  assert(assertions.prompt_package_ref_exists === true, "prompt_package_ref_exists must be true");
  assert(assertions.all_exact_fields_match_v0_6_8 === true, "all_exact_fields_match_v0_6_8 must be true");
  assert(assertions.approval_phrase_matches_v0_6_9 === true, "approval_phrase_matches_v0_6_9 must be true");
  assert(assertions.source_authorization_matches_v0_6_11 === true, "source_authorization_matches_v0_6_11 must be true");
  assert(assertions.preflight_authorization_consumed_now === true, "preflight_authorization_consumed_now must be true");
  assert(assertions.request_not_submitted === true, "request_not_submitted must be true");
  assert(assertions.can_execute_now === false, "can_execute_now must remain false");
  assert(assertions.provider_contact_allowed_now === false, "provider_contact_allowed_now must remain false");
  assert(assertions.image_generation_allowed_now === false, "image_generation_allowed_now must remain false");
  assert(assertions.future_provider_execution_requires_new_step === true, "future_provider_execution_requires_new_step must remain true");
  assert(assertions.future_image_generation_requires_new_step === true, "future_image_generation_requires_new_step must remain true");

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length >= 3, "next_route_options required");
  assert(record.next_route_options.includes("failed_provider_attempt_review"), "next route must include failed attempt review");
  assert(record.next_route_options.includes("exact_new_trial_action_packet_freeze"), "next route must include action packet freeze");
  assert(record.next_route_options.every((item) => !/^(submit_now|execute_real_generation_now|provider_call_now)$/i.test(item)), "next route options must not authorize execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must remain true");
  assert(record.boundaries?.local_preflight_only === true, "local_preflight_only must remain true");
  assert(record.boundaries?.request_not_submitted === true, "boundary request_not_submitted must remain true");
  assert(record.boundaries?.can_execute_now === false, "boundary can_execute_now must remain false");
  assert(record.boundaries?.real_executor_implemented_now === false, "real_executor_implemented_now must remain false");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2_exercised must remain false");
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
  assert(invalidFixtureCaught, "invalid local preflight-only fixture must fail");

  const cases = [
    expectFailure(validRecord, "authorization_status_changed_fails", (candidate) => { candidate.local_preflight_status.authorization_status = "active_execution"; }),
    expectFailure(validRecord, "source_consumed_false_fails", (candidate) => { candidate.local_preflight_status.source_preflight_authorization_consumed = false; }),
    expectFailure(validRecord, "local_preflight_false_fails", (candidate) => { candidate.local_preflight_status.local_preflight_run_performed = false; }),
    expectFailure(validRecord, "request_submitted_true_fails", (candidate) => { candidate.local_preflight_status.request_submitted = true; }),
    expectFailure(validRecord, "execute_now_true_fails", (candidate) => { candidate.local_preflight_status.execute_now = true; }),
    expectFailure(validRecord, "prompt_mismatch_fails", (candidate) => { candidate.checked_exact_targets.prompt_package_ref = "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml"; }),
    expectFailure(validRecord, "output_reuse_fails", (candidate) => { candidate.checked_exact_targets.output_directory = "runs/real_generation/v0_3_3_safe_portrait_001/"; }),
    expectFailure(validRecord, "receipt_reuse_fails", (candidate) => { candidate.checked_exact_targets.receipt_path = "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json"; }),
    expectFailure(validRecord, "registry_reuse_fails", (candidate) => { candidate.checked_exact_targets.registry_path = "reports/provider_receipts/v0_3_3_safe_portrait_001_registry.json"; }),
    expectFailure(validRecord, "bridge_reuse_fails", (candidate) => { candidate.checked_exact_targets.review_console_bridge_ref = "review_console/live_receipt_bridge/v0_3_3_safe_portrait_001"; }),
    expectFailure(validRecord, "call_count_widened_fails", (candidate) => { candidate.fixed_constraints_confirmation.exact_call_count = 2; }),
    expectFailure(validRecord, "image_candidates_widened_fails", (candidate) => { candidate.fixed_constraints_confirmation.max_image_candidates = 2; }),
    expectFailure(validRecord, "retry_limit_widened_fails", (candidate) => { candidate.fixed_constraints_confirmation.retry_limit = 1; }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => { candidate.fixed_constraints_confirmation.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "secret_read_allowed_fails", (candidate) => { candidate.fixed_constraints_confirmation.secret_value_read_allowed = true; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.preflight_assertions.can_execute_now = true; }),
    expectFailure(validRecord, "provider_contact_true_fails", (candidate) => { candidate.preflight_assertions.provider_contact_allowed_now = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.preflight_assertions.image_generation_allowed_now = true; }),
    expectFailure(validRecord, "future_provider_step_false_fails", (candidate) => { candidate.preflight_assertions.future_provider_execution_requires_new_step = false; }),
    expectFailure(validRecord, "future_image_step_false_fails", (candidate) => { candidate.preflight_assertions.future_image_generation_requires_new_step = false; }),
    expectFailure(validRecord, "next_route_submit_now_fails", (candidate) => { candidate.next_route_options = ["submit_now"]; }),
    expectFailure(validRecord, "provider_call_performed_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_performed_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "receipt_write_true_fails", (candidate) => { candidate.side_effects.receipt_write_performed = true; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.authorization_package_id = ".env.local"; })
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
  const reportRecord = readJson(reportPath).exact_new_trial_local_preflight_only_gate;
  const validRecord = readJson(passFixturePath).exact_new_trial_local_preflight_only_gate;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_local_preflight_only_gate;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    "phase: v0_6_12_local_preflight_only_gate",
    "preflight_authorization_consumed: true",
    "local_preflight_run_performed: true",
    "request_not_submitted: true",
    "can_execute_now: false",
    "provider_contact_allowed_now: false",
    "image_generation_allowed_now: false",
    "provider_call_performed: false",
    "image_generation_performed: false",
    selectedPrompt,
    selectedOutputDirectory,
    selectedReceiptPath,
    selectedRegistryPath,
    selectedBridgeRef
  ]) {
    assert(doc.includes(token), `local preflight-only gate doc missing token: ${token}`);
  }

  assert(schema.includes("exact_new_trial_local_preflight_only_gate"), "schema must define exact_new_trial_local_preflight_only_gate");
  assert(mvp.includes("validate_exact_new_trial_local_preflight_only_gate.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_12_LOCAL_PREFLIGHT_ONLY_GATE_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_local_preflight_only_gate",
    phase,
    local_preflight_doc_present: true,
    local_preflight_schema_present: true,
    local_preflight_report_present: true,
    local_preflight_fixture_present: true,
    local_preflight_fail_fixture_present: true,
    authorization_package_id: packageId,
    authorization_status: "approved_for_metadata_only_preflight_consumed_by_local_preflight",
    approval_status: "approved_for_preflight_only",
    source_preflight_authorization_consumed: true,
    consumed_by_phase: phase,
    local_preflight_run_performed: true,
    prompt_package_ref_exists: true,
    all_exact_fields_match_v0_6_8: true,
    approval_phrase_matches_v0_6_9: true,
    source_authorization_matches_v0_6_11: true,
    request_not_submitted: true,
    can_execute_now: false,
    provider_contact_allowed_now: false,
    image_generation_allowed_now: false,
    exact_call_count: 1,
    max_image_candidates: 1,
    retry_limit: 0,
    overwrite_existing_files_allowed: false,
    secret_value_read_allowed: false,
    metadata_only: true,
    local_preflight_only: true,
    provider_call_performed: false,
    image_generation_performed: false,
    output_directory_created: false,
    receipt_write_performed: false,
    registry_write_performed: false,
    review_console_bridge_materialized: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    production_candidate_created: false,
    accepted_sample_auto_promotion: false,
    memory_seed_promoted: false,
    real_executor_implemented_now: false,
    Push_L2_exercised: false,
    package_dependency_change_performed: false,
    commit_performed: false,
    push_performed: false,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
