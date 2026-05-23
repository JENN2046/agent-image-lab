#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_8_exact_new_trial_intake_field_resolution";
const docPath = "docs/V0_6_8_EXACT_NEW_TRIAL_INTAKE_FIELD_RESOLUTION.md";
const schemaPath = "schemas/exact_new_trial_intake_field_resolution.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_8_exact_new_trial_intake_field_resolution.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_intake_field_resolution.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_intake_field_resolution_fail.example.json";
const intakePreflightPath = "reports/visual_asset_eval_dry_run/v0_6_7_exact_new_trial_authorization_intake_preflight.json";
const draftPath = "reports/visual_asset_eval_dry_run/v0_6_6_exact_new_trial_a5_request_draft.json";
const readyCheckpointPath = "reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json";
const safeReceiptPath = "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json";
const safeRegistryPath = "reports/provider_receipts/v0_3_3_safe_portrait_001_registry.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const sharedTrialKey = "v0_3_3_exact_new_trial_001";
const selectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const selectedOutputDirectory = `runs/real_generation/${sharedTrialKey}/`;
const selectedReceiptPath = `reports/provider_receipts/${sharedTrialKey}_receipt.json`;
const selectedRegistryPath = `reports/provider_receipts/${sharedTrialKey}_registry.json`;
const selectedBridgeRef = `review_console/live_receipt_bridge/${sharedTrialKey}`;
const blockedPromptValues = [
  "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml",
  "prompts/image_generation/fashion_night_balcony_vertical_portrait_retry_001_simple.yaml"
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
  const intake = readJson(intakePreflightPath).exact_new_trial_authorization_intake_preflight;
  const draft = readJson(draftPath).exact_new_trial_a5_request_draft;
  const ready = readJson(readyCheckpointPath).ready_for_exact_new_trial_authorization_checkpoint;
  const safeReceipt = readJson(safeReceiptPath);
  const safeRegistry = readJson(safeRegistryPath);
  assertNoSecretOrRawPath({ intake, draft, ready, safeReceipt, safeRegistry }, "exact_new_trial_intake_field_resolution_sources");
  assert(intake.phase === "v0_6_7_exact_new_trial_authorization_intake_preflight", "intake preflight phase mismatch");
  assert(intake.preflight_assertions?.all_placeholders_still_unresolved_at_this_phase === true, "intake preflight must preserve unresolved placeholders");
  assert(draft.phase === "v0_6_6_exact_new_trial_a5_request_draft", "draft phase mismatch");
  assert(draft.draft_status?.authorization_status === "draft_not_submitted", "draft source must remain non-submitted");
  assert(ready.phase === "v0_6_5_ready_for_exact_new_trial_authorization_checkpoint", "ready checkpoint phase mismatch");
  assert(ready.checkpoint_assertions?.ready_for_exact_new_trial_authorization === true, "ready checkpoint must preserve authorization-ready state");
  assert(safeReceipt.prompt_package_ref === selectedPrompt, "safe portrait receipt must support selected prompt");
  assert(safeReceipt.review_console_bridge_ref === "review_console/live_receipt_bridge/v0_3_3_safe_portrait_001", "safe portrait bridge evidence mismatch");
  assert(Array.isArray(safeRegistry.entries) && safeRegistry.entries.length === 1, "safe portrait registry must contain one entry");
  assert(safeRegistry.entries[0].output_image_path === "runs/real_generation/v0_3_3_safe_portrait_001/safe_adult_editorial_portrait_v1.png", "safe portrait registry output mismatch");
}

function assertSharedKey(value, key, context) {
  assert(value.includes(key), `${context} must include shared trial key ${key}`);
}

function validateRecord(record) {
  assert(record && typeof record === "object", "exact new-trial intake field resolution missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_intake_field_resolution");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_intake_preflight_ref === intakePreflightPath, "source_intake_preflight_ref mismatch");
  assert(record.source_exact_new_trial_a5_request_draft_ref === draftPath, "source_exact_new_trial_a5_request_draft_ref mismatch");
  assert(record.source_ready_for_exact_new_trial_authorization_checkpoint_ref === readyCheckpointPath, "source_ready_for_exact_new_trial_authorization_checkpoint_ref mismatch");
  assert(record.source_safe_portrait_receipt_ref === safeReceiptPath, "source_safe_portrait_receipt_ref mismatch");
  assert(record.source_safe_portrait_registry_ref === safeRegistryPath, "source_safe_portrait_registry_ref mismatch");

  validateSources();

  const status = record.resolution_status;
  assert(status.authorization_status === "draft_not_submitted", "authorization_status must remain draft_not_submitted");
  assert(status.approval_status === "not_requested", "approval_status must remain not_requested");
  assert(status.active === false, "active must remain false");
  assert(status.execute_now === false, "execute_now must remain false");
  assert(status.submit_ready === false, "submit_ready must remain false");
  assert(status.request_text_regenerated_after_resolution === false, "request_text_regenerated_after_resolution must remain false");
  assert(status.resolution_only === true, "resolution_only must remain true");

  const fields = record.resolved_exact_fields;
  assert(fields.prompt_package_ref_or_override.required === true, "prompt field must remain required");
  assert(fields.prompt_package_ref_or_override.resolved === true, "prompt field must be resolved");
  assert(fields.prompt_package_ref_or_override.resolution_mode === "prompt_package_ref", "prompt resolution mode mismatch");
  assert(fields.prompt_package_ref_or_override.selected_value === selectedPrompt, "selected prompt mismatch");
  assert(fields.prompt_package_ref_or_override.evidence_receipt_ref === safeReceiptPath, "prompt evidence receipt mismatch");
  assert(fields.prompt_package_ref_or_override.evidence_registry_ref === safeRegistryPath, "prompt evidence registry mismatch");
  assert(fields.prompt_package_ref_or_override.why_selected === "closest_successful_adult_person_portrait_route_in_current_v0_3_3_evidence_chain", "prompt rationale mismatch");
  assert(Array.isArray(fields.prompt_package_ref_or_override.blocked_values), "blocked prompt values missing");
  assert(fields.prompt_package_ref_or_override.blocked_values.length === blockedPromptValues.length, "blocked prompt value count mismatch");
  for (const blocked of blockedPromptValues) {
    assert(fields.prompt_package_ref_or_override.blocked_values.includes(blocked), `blocked prompt missing: ${blocked}`);
  }

  const output = fields.output_directory;
  assert(output.required === true && output.resolved === true, "output_directory must be required and resolved");
  assert(output.selected_value === selectedOutputDirectory, "output_directory selected_value mismatch");
  assert(output.shared_trial_key === sharedTrialKey, "output_directory shared_trial_key mismatch");
  assertSharedKey(output.selected_value, sharedTrialKey, "output_directory.selected_value");
  assert(Array.isArray(output.must_not_reuse_values) && output.must_not_reuse_values.length >= 4, "output_directory reuse block list missing");
  assert(!output.must_not_reuse_values.includes(selectedOutputDirectory), "output_directory selected value must be new");

  const receipt = fields.receipt_path;
  assert(receipt.required === true && receipt.resolved === true, "receipt_path must be required and resolved");
  assert(receipt.selected_value === selectedReceiptPath, "receipt_path selected_value mismatch");
  assert(receipt.shared_trial_key === sharedTrialKey, "receipt_path shared_trial_key mismatch");
  assertSharedKey(receipt.selected_value, sharedTrialKey, "receipt_path.selected_value");
  assert(Array.isArray(receipt.must_not_reuse_values) && receipt.must_not_reuse_values.length >= 4, "receipt_path reuse block list missing");
  assert(!receipt.must_not_reuse_values.includes(selectedReceiptPath), "receipt_path selected value must be new");

  const registry = fields.registry_path;
  assert(registry.required === true && registry.resolved === true, "registry_path must be required and resolved");
  assert(registry.selected_value === selectedRegistryPath, "registry_path selected_value mismatch");
  assert(registry.shared_trial_key === sharedTrialKey, "registry_path shared_trial_key mismatch");
  assertSharedKey(registry.selected_value, sharedTrialKey, "registry_path.selected_value");
  assert(Array.isArray(registry.must_not_reuse_values) && registry.must_not_reuse_values.length >= 4, "registry_path reuse block list missing");
  assert(registry.must_not_reuse_values.includes("reports/provider_receipts/provider_receipt_registry.json"), "registry_path must explicitly block provider_receipt_registry.json reuse");
  assert(!registry.must_not_reuse_values.includes(selectedRegistryPath), "registry_path selected value must be new");

  const bridge = fields.review_console_bridge_ref;
  assert(bridge.required === true && bridge.resolved === true, "review_console_bridge_ref must be required and resolved");
  assert(bridge.selected_value === selectedBridgeRef, "review_console_bridge_ref selected_value mismatch");
  assert(bridge.shared_trial_key === sharedTrialKey, "review_console_bridge_ref shared_trial_key mismatch");
  assert(bridge.corrected_allowed_ref_root === "review_console/live_receipt_bridge/", "review_console_bridge_ref corrected root mismatch");
  assert(bridge.bridge_materialized_now === false, "review_console_bridge_ref bridge_materialized_now must remain false");
  assertSharedKey(bridge.selected_value, sharedTrialKey, "review_console_bridge_ref.selected_value");
  assert(Array.isArray(bridge.must_not_reuse_values) && bridge.must_not_reuse_values.length >= 2, "review_console_bridge_ref reuse block list missing");
  assert(!bridge.must_not_reuse_values.includes(selectedBridgeRef), "review_console_bridge_ref selected value must be new");
  assert(bridge.selected_value.startsWith("review_console/live_receipt_bridge/"), "review_console_bridge_ref must use corrected review_console root");

  const consistency = record.cross_field_consistency;
  assert(consistency.shared_trial_key === sharedTrialKey, "cross_field_consistency.shared_trial_key mismatch");
  assert(consistency.output_receipt_registry_bridge_share_same_key === true, "shared key consistency must remain true");
  assert(consistency.every_selected_value_is_new_not_reused_from_failed_attempts === true, "new/non-reused assertion must remain true");
  assert(consistency.review_console_bridge_root_corrected_from_preflight_placeholder_note === true, "bridge root correction assertion must remain true");
  assert(consistency.safe_portrait_prompt_selected_as_closest_successful_person_portrait_route === true, "safe prompt selection assertion must remain true");

  const fixed = record.fixed_constraints_confirmation;
  assert(fixed.provider_target === "codex_builtin_image_generation", "provider_target mismatch");
  assert(fixed.plugin_id_or_provider_route === "image_gen.imagegen", "plugin_id_or_provider_route mismatch");
  assert(fixed.model === "managed_by_codex_image_tool", "model mismatch");
  assert(fixed.command === "generate", "command mismatch");
  assert(fixed.exact_call_count === 1, "exact_call_count must remain 1");
  assert(fixed.max_image_candidates === 1, "max_image_candidates must remain 1");
  assert(fixed.retry_limit === 0, "retry_limit must remain 0");
  assert(fixed.review_required_after_generation === true, "review_required_after_generation must remain true");
  assert(fixed.no_memory_write_default === true, "no_memory_write_default must remain true");
  assert(fixed.overwrite_existing_files_allowed === false, "overwrite_existing_files_allowed must remain false");

  const preSubmission = record.pre_submission_assertions;
  assert(preSubmission.all_five_exact_fields_resolved_locally === true, "all_five_exact_fields_resolved_locally must remain true");
  assert(preSubmission.request_text_regenerated_after_resolution === false, "pre_submission request_text_regenerated_after_resolution must remain false");
  assert(preSubmission.ready_to_regenerate_request_text === true, "ready_to_regenerate_request_text must remain true");
  assert(preSubmission.exact_human_A5_phrase_still_required === true, "exact_human_A5_phrase_still_required must remain true");
  assert(preSubmission.can_submit_now === false, "can_submit_now must remain false");
  assert(preSubmission.can_execute_now === false, "can_execute_now must remain false");

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length >= 3, "next_route_options required");
  assert(record.next_route_options.every((item) => !/^(submit_now|execute_real_generation_now|provider_call_now)$/i.test(item)), "next route options must not authorize submission or execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.resolution_only === true, "boundary resolution_only must be true");
  assert(record.boundaries?.request_not_submitted === true, "request_not_submitted must remain true");
  assert(record.boundaries?.can_submit_now === false, "boundary can_submit_now must remain false");
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
  assert(invalidFixtureCaught, "invalid field resolution fixture must fail");

  const cases = [
    expectFailure(validRecord, "active_true_fails", (candidate) => { candidate.resolution_status.active = true; }),
    expectFailure(validRecord, "submit_ready_true_fails", (candidate) => { candidate.resolution_status.submit_ready = true; }),
    expectFailure(validRecord, "request_text_regenerated_true_fails", (candidate) => { candidate.resolution_status.request_text_regenerated_after_resolution = true; }),
    expectFailure(validRecord, "prompt_reuses_original_failed_value", (candidate) => { candidate.resolved_exact_fields.prompt_package_ref_or_override.selected_value = blockedPromptValues[0]; }),
    expectFailure(validRecord, "prompt_reuses_retry_failed_value", (candidate) => { candidate.resolved_exact_fields.prompt_package_ref_or_override.selected_value = blockedPromptValues[1]; }),
    expectFailure(validRecord, "prompt_blocked_values_missing_fails", (candidate) => { candidate.resolved_exact_fields.prompt_package_ref_or_override.blocked_values = [blockedPromptValues[0]]; }),
    expectFailure(validRecord, "output_reuses_old_directory_fails", (candidate) => { candidate.resolved_exact_fields.output_directory.selected_value = "runs/real_generation/v0_3_3_safe_portrait_001/"; }),
    expectFailure(validRecord, "receipt_reuses_old_receipt_fails", (candidate) => { candidate.resolved_exact_fields.receipt_path.selected_value = "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json"; }),
    expectFailure(validRecord, "registry_reuses_global_registry_fails", (candidate) => { candidate.resolved_exact_fields.registry_path.selected_value = "reports/provider_receipts/provider_receipt_registry.json"; }),
    expectFailure(validRecord, "bridge_wrong_root_fails", (candidate) => { candidate.resolved_exact_fields.review_console_bridge_ref.selected_value = "docs/live_bridge.md"; }),
    expectFailure(validRecord, "bridge_materialized_true_fails", (candidate) => { candidate.resolved_exact_fields.review_console_bridge_ref.bridge_materialized_now = true; }),
    expectFailure(validRecord, "shared_key_mismatch_fails", (candidate) => { candidate.cross_field_consistency.shared_trial_key = "broken_key"; }),
    expectFailure(validRecord, "shared_key_false_flag_fails", (candidate) => { candidate.cross_field_consistency.output_receipt_registry_bridge_share_same_key = false; }),
    expectFailure(validRecord, "bridge_root_correction_false_fails", (candidate) => { candidate.cross_field_consistency.review_console_bridge_root_corrected_from_preflight_placeholder_note = false; }),
    expectFailure(validRecord, "safe_prompt_selection_false_fails", (candidate) => { candidate.cross_field_consistency.safe_portrait_prompt_selected_as_closest_successful_person_portrait_route = false; }),
    expectFailure(validRecord, "exact_call_count_gt_1_fails", (candidate) => { candidate.fixed_constraints_confirmation.exact_call_count = 2; }),
    expectFailure(validRecord, "retry_limit_nonzero_fails", (candidate) => { candidate.fixed_constraints_confirmation.retry_limit = 1; }),
    expectFailure(validRecord, "can_submit_true_fails", (candidate) => { candidate.pre_submission_assertions.can_submit_now = true; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.pre_submission_assertions.can_execute_now = true; }),
    expectFailure(validRecord, "next_route_submission_fails", (candidate) => { candidate.next_route_options = ["submit_now"]; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.authorization_package_id = "C:\\private\\AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001"; }),
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
  const reportRecord = readJson(reportPath).exact_new_trial_intake_field_resolution;
  const validRecord = readJson(passFixturePath).exact_new_trial_intake_field_resolution;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_intake_field_resolution;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    "authorization_status: draft_not_submitted",
    "approval_status: not_requested",
    "submit_ready: false",
    "request_text_regenerated_after_resolution: false",
    `selected_value: ${selectedPrompt}`,
    `selected_value: ${selectedOutputDirectory}`,
    `selected_value: ${selectedReceiptPath}`,
    `selected_value: ${selectedRegistryPath}`,
    `selected_value: ${selectedBridgeRef}`,
    "corrected_allowed_ref_root: review_console/live_receipt_bridge/",
    "all_five_exact_fields_resolved_locally: true",
    "can_submit_now: false",
    "can_execute_now: false"
  ]) {
    assert(doc.includes(token), `field resolution doc missing token: ${token}`);
  }

  assert(schema.includes("exact_new_trial_intake_field_resolution"), "schema must define exact_new_trial_intake_field_resolution");
  assert(mvp.includes("validate_exact_new_trial_intake_field_resolution.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_8_EXACT_NEW_TRIAL_INTAKE_FIELD_RESOLUTION_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_intake_field_resolution",
    phase,
    field_resolution_doc_present: true,
    field_resolution_schema_present: true,
    field_resolution_report_present: true,
    field_resolution_fixture_present: true,
    field_resolution_fail_fixture_present: true,
    authorization_package_id: packageId,
    authorization_status: "draft_not_submitted",
    approval_status: "not_requested",
    submit_ready: false,
    request_text_regenerated_after_resolution: false,
    all_five_exact_fields_resolved_locally: true,
    selected_prompt_package_ref: selectedPrompt,
    selected_output_directory: selectedOutputDirectory,
    selected_receipt_path: selectedReceiptPath,
    selected_registry_path: selectedRegistryPath,
    selected_review_console_bridge_ref: selectedBridgeRef,
    shared_trial_key: sharedTrialKey,
    review_console_bridge_root_corrected: true,
    exact_call_count: 1,
    max_image_candidates: 1,
    retry_limit: 0,
    review_required_after_generation: true,
    no_memory_write_default: true,
    overwrite_existing_files_allowed: false,
    ready_to_regenerate_request_text: true,
    exact_human_A5_phrase_still_required: true,
    metadata_only: true,
    resolution_only: true,
    can_submit_now: false,
    can_execute_now: false,
    provider_call_performed: false,
    image_generation_performed: false,
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
