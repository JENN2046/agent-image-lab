#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_7_exact_new_trial_authorization_intake_preflight";
const docPath = "docs/V0_6_7_EXACT_NEW_TRIAL_AUTHORIZATION_INTAKE_PREFLIGHT.md";
const schemaPath = "schemas/exact_new_trial_authorization_intake_preflight.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_7_exact_new_trial_authorization_intake_preflight.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_authorization_intake_preflight.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_authorization_intake_preflight_fail.example.json";
const draftPath = "reports/visual_asset_eval_dry_run/v0_6_6_exact_new_trial_a5_request_draft.json";
const readyCheckpointPath = "reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json";
const authPacketPath = "reports/visual_asset_eval_dry_run/v0_6_0_first_controlled_generation_authorization_packet.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";

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
  const draft = readJson(draftPath).exact_new_trial_a5_request_draft;
  const ready = readJson(readyCheckpointPath).ready_for_exact_new_trial_authorization_checkpoint;
  const auth = readJson(authPacketPath).first_controlled_generation_authorization_packet;
  assertNoSecretOrRawPath({ draft, ready, auth }, "exact_new_trial_authorization_intake_preflight_sources");
  assert(draft.phase === "v0_6_6_exact_new_trial_a5_request_draft", "draft phase mismatch");
  assert(draft.draft_status?.authorization_status === "draft_not_submitted", "draft source must remain non-submitted");
  assert(draft.boundaries?.can_execute_now === false, "draft source must remain non-executable");
  assert(ready.phase === "v0_6_5_ready_for_exact_new_trial_authorization_checkpoint", "ready checkpoint phase mismatch");
  assert(ready.checkpoint_assertions?.ready_for_exact_new_trial_authorization === true, "ready checkpoint must preserve authorization-ready state");
  assert(auth.phase === "v0_6_0_first_controlled_generation_authorization_packet", "authorization packet phase mismatch");
  assert(auth.exact_call_count?.configured_limit === 1, "authorization packet exact call count must remain 1");
  assert(auth.review_required_after_generation?.enabled === true, "authorization packet must keep review required");
  assert(auth.no_memory_write_default?.enabled === true, "authorization packet must keep no-memory default");
}

function validateChecklistEntry(entry, name, placeholderToken, allowedRoot) {
  assert(entry && typeof entry === "object", `${name} entry missing`);
  assert(entry.required === true, `${name}.required must remain true`);
  assert(entry.resolved === false, `${name}.resolved must remain false at intake preflight`);
  assert(entry.placeholder_token === placeholderToken, `${name}.placeholder_token mismatch`);
  assert(entry.allowed_ref_root === allowedRoot, `${name}.allowed_ref_root mismatch`);
}

function validateRecord(record) {
  assert(record && typeof record === "object", "exact new-trial authorization intake preflight missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_authorization_intake_preflight");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_exact_new_trial_a5_request_draft_ref === draftPath, "source_exact_new_trial_a5_request_draft_ref mismatch");
  assert(record.source_ready_for_exact_new_trial_authorization_checkpoint_ref === readyCheckpointPath, "source_ready_for_exact_new_trial_authorization_checkpoint_ref mismatch");
  assert(record.source_first_controlled_generation_authorization_packet_ref === authPacketPath, "source_first_controlled_generation_authorization_packet_ref mismatch");

  validateSources();

  const status = record.intake_status;
  assert(status.authorization_status === "draft_not_submitted", "authorization_status must remain draft_not_submitted");
  assert(status.approval_status === "not_requested", "approval_status must remain not_requested");
  assert(status.active === false, "active must remain false");
  assert(status.execute_now === false, "execute_now must remain false");
  assert(status.submit_ready === false, "submit_ready must remain false");
  assert(status.preflight_only === true, "preflight_only must remain true");

  validateChecklistEntry(record.required_exact_fields_checklist.prompt_package_ref_or_override, "prompt_package_ref_or_override", "<new_prompt_package_ref_under_prompts_image_generation_or_exact_override_statement>", "prompts/image_generation/");
  validateChecklistEntry(record.required_exact_fields_checklist.output_directory, "output_directory", "<new_output_directory_under_runs_real_generation>", "runs/real_generation/");
  validateChecklistEntry(record.required_exact_fields_checklist.receipt_path, "receipt_path", "<new_receipt_path_under_reports_provider_receipts>", "reports/provider_receipts/");
  validateChecklistEntry(record.required_exact_fields_checklist.registry_path, "registry_path", "<new_registry_path_or_existing_registry_refresh_plan_ref>", "reports/provider_receipts/");
  validateChecklistEntry(record.required_exact_fields_checklist.review_console_bridge_ref, "review_console_bridge_ref", "<new_review_console_bridge_ref>", "docs/ or reports/provider_receipts/");

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

  const preflight = record.preflight_assertions;
  assert(preflight.placeholders_grouped_into_one_checklist === true, "placeholders_grouped_into_one_checklist must remain true");
  assert(preflight.all_placeholders_still_unresolved_at_this_phase === true, "all_placeholders_still_unresolved_at_this_phase must remain true");
  assert(preflight.exact_human_A5_phrase_still_required === true, "exact_human_A5_phrase_still_required must remain true");
  assert(preflight.regenerate_request_text_after_resolution === true, "regenerate_request_text_after_resolution must remain true");
  assert(preflight.can_submit_now === false, "can_submit_now must remain false");
  assert(preflight.can_execute_now === false, "can_execute_now must remain false");

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length >= 3, "next_route_options required");
  assert(record.next_route_options.every((item) => !/execute_real_generation_now|submit_now|provider_call/i.test(item)), "next route options must not authorize execution or submission");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.intake_only === true, "intake_only must be true");
  assert(record.boundaries?.preflight_only === true, "boundary preflight_only must be true");
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
  assert(invalidFixtureCaught, "invalid intake preflight fixture must fail");

  const cases = [
    expectFailure(validRecord, "active_true_fails", (candidate) => { candidate.intake_status.active = true; }),
    expectFailure(validRecord, "execute_now_true_fails", (candidate) => { candidate.intake_status.execute_now = true; }),
    expectFailure(validRecord, "submit_ready_true_fails", (candidate) => { candidate.intake_status.submit_ready = true; }),
    expectFailure(validRecord, "preflight_only_false_fails", (candidate) => { candidate.intake_status.preflight_only = false; }),
    expectFailure(validRecord, "approval_status_changed_fails", (candidate) => { candidate.intake_status.approval_status = "approved"; }),
    expectFailure(validRecord, "prompt_resolved_true_fails", (candidate) => { candidate.required_exact_fields_checklist.prompt_package_ref_or_override.resolved = true; }),
    expectFailure(validRecord, "output_resolved_true_fails", (candidate) => { candidate.required_exact_fields_checklist.output_directory.resolved = true; }),
    expectFailure(validRecord, "receipt_placeholder_changed_fails", (candidate) => { candidate.required_exact_fields_checklist.receipt_path.placeholder_token = "reports/provider_receipts/live.json"; }),
    expectFailure(validRecord, "bridge_placeholder_changed_fails", (candidate) => { candidate.required_exact_fields_checklist.review_console_bridge_ref.placeholder_token = "docs/live_bridge.md"; }),
    expectFailure(validRecord, "exact_call_count_gt_1_fails", (candidate) => { candidate.fixed_constraints_confirmation.exact_call_count = 2; }),
    expectFailure(validRecord, "image_candidates_gt_1_fails", (candidate) => { candidate.fixed_constraints_confirmation.max_image_candidates = 2; }),
    expectFailure(validRecord, "retry_limit_nonzero_fails", (candidate) => { candidate.fixed_constraints_confirmation.retry_limit = 1; }),
    expectFailure(validRecord, "review_required_false_fails", (candidate) => { candidate.fixed_constraints_confirmation.review_required_after_generation = false; }),
    expectFailure(validRecord, "memory_default_false_fails", (candidate) => { candidate.fixed_constraints_confirmation.no_memory_write_default = false; }),
    expectFailure(validRecord, "overwrite_true_fails", (candidate) => { candidate.fixed_constraints_confirmation.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "can_submit_true_fails", (candidate) => { candidate.preflight_assertions.can_submit_now = true; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.preflight_assertions.can_execute_now = true; }),
    expectFailure(validRecord, "next_route_execution_fails", (candidate) => { candidate.next_route_options = ["execute_real_generation_now"]; }),
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
  const reportRecord = readJson(reportPath).exact_new_trial_authorization_intake_preflight;
  const validRecord = readJson(passFixturePath).exact_new_trial_authorization_intake_preflight;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_authorization_intake_preflight;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    "authorization_status: draft_not_submitted",
    "approval_status: not_requested",
    "active: false",
    "execute_now: false",
    "submit_ready: false",
    "preflight_only: true",
    "all_placeholders_still_unresolved_at_this_phase: true",
    "exact_human_A5_phrase_still_required: true",
    "can_submit_now: false",
    "can_execute_now: false"
  ]) {
    assert(doc.includes(token), `intake preflight doc missing token: ${token}`);
  }
  assert(schema.includes("exact_new_trial_authorization_intake_preflight"), "schema must define exact_new_trial_authorization_intake_preflight");
  assert(mvp.includes("validate_exact_new_trial_authorization_intake_preflight.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_7_EXACT_NEW_TRIAL_AUTHORIZATION_INTAKE_PREFLIGHT_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_authorization_intake_preflight",
    phase,
    intake_doc_present: true,
    intake_schema_present: true,
    intake_report_present: true,
    intake_fixture_present: true,
    intake_fail_fixture_present: true,
    authorization_package_id: packageId,
    authorization_status: "draft_not_submitted",
    approval_status: "not_requested",
    submit_ready: false,
    preflight_only: true,
    ready_for_exact_new_trial_authorization: true,
    all_placeholders_still_unresolved_at_this_phase: true,
    exact_human_A5_phrase_still_required: true,
    exact_call_count: 1,
    max_image_candidates: 1,
    retry_limit: 0,
    review_required_after_generation: true,
    no_memory_write_default: true,
    overwrite_existing_files_allowed: false,
    metadata_only: true,
    intake_only: true,
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
