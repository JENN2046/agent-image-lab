#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_6_exact_new_trial_a5_request_draft";
const docPath = "docs/V0_6_6_EXACT_NEW_TRIAL_A5_REQUEST_DRAFT.md";
const schemaPath = "schemas/exact_new_trial_a5_request_draft.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_6_exact_new_trial_a5_request_draft.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_a5_request_draft.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_a5_request_draft_fail.example.json";
const refreshPath = "reports/visual_asset_eval_dry_run/v0_6_4_exact_new_trial_authorization_refresh.json";
const readyCheckpointPath = "reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json";
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
  const refresh = readJson(refreshPath).exact_new_trial_authorization_refresh;
  const ready = readJson(readyCheckpointPath).ready_for_exact_new_trial_authorization_checkpoint;
  assertNoSecretOrRawPath({ refresh, ready }, "exact_new_trial_a5_request_draft_sources");

  assert(refresh.phase === "v0_6_4_exact_new_trial_authorization_refresh", "refresh phase mismatch");
  assert(refresh.refreshed_gate_preflight?.exact_authorization_phrase_refresh_required === true, "refresh must require exact authorization phrase refresh");
  assert(ready.phase === "v0_6_5_ready_for_exact_new_trial_authorization_checkpoint", "ready checkpoint phase mismatch");
  assert(ready.checkpoint_assertions?.ready_for_exact_new_trial_authorization === true, "ready checkpoint must keep authorization-ready state");
  assert(ready.checkpoint_assertions?.future_exact_approval_phrase_required === true, "ready checkpoint must keep exact approval phrase requirement");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "exact new-trial A5 request draft missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_a5_request_draft");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_exact_new_trial_authorization_refresh_ref === refreshPath, "source_exact_new_trial_authorization_refresh_ref mismatch");
  assert(record.source_ready_for_exact_new_trial_authorization_checkpoint_ref === readyCheckpointPath, "source_ready_for_exact_new_trial_authorization_checkpoint_ref mismatch");
  assert(record.source_candidate_packet_ref === "docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md", "source_candidate_packet_ref mismatch");
  assert(record.source_pilot_gate_ref === "docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md", "source_pilot_gate_ref mismatch");

  validateSources();

  const status = record.draft_status;
  assert(status.authorization_status === "draft_not_submitted", "authorization_status must remain draft_not_submitted");
  assert(status.approval_status === "not_requested", "approval_status must remain not_requested");
  assert(status.active === false, "active must remain false");
  assert(status.execute_now === false, "execute_now must remain false");
  assert(status.exact_approval_phrase_received === false, "exact_approval_phrase_received must remain false");

  const fixed = record.fixed_constraints;
  assert(fixed.provider_target === "codex_builtin_image_generation", "provider_target mismatch");
  assert(fixed.plugin_id_or_provider_route === "image_gen.imagegen", "plugin_id_or_provider_route mismatch");
  assert(fixed.model === "managed_by_codex_image_tool", "model mismatch");
  assert(fixed.command === "generate", "command mismatch");
  assert(fixed.max_provider_calls === 1, "max_provider_calls must remain 1");
  assert(fixed.max_image_candidates === 1, "max_image_candidates must remain 1");
  assert(fixed.retry_limit === 0, "retry_limit must remain 0");
  assert(fixed.no_memory_write_default === true, "no_memory_write_default must remain true");
  assert(fixed.overwrite_existing_files_allowed === false, "overwrite_existing_files_allowed must remain false");

  const unresolved = record.unresolved_required_fields;
  assert(unresolved.exact_new_prompt_package_or_override_statement_required === true, "exact_new_prompt_package_or_override_statement_required must be true");
  assert(unresolved.exact_new_output_directory_required === true, "exact_new_output_directory_required must be true");
  assert(unresolved.exact_new_receipt_path_required === true, "exact_new_receipt_path_required must be true");
  assert(unresolved.exact_new_registry_path_required === true, "exact_new_registry_path_required must be true");
  assert(unresolved.exact_new_review_console_bridge_ref_required === true, "exact_new_review_console_bridge_ref_required must be true");

  const approval = record.exact_approval_phrase_draft;
  assert(approval.recommended_exact_approval_phrase_present === true, "recommended_exact_approval_phrase_present must be true");
  assert(approval.draft_uses_placeholders_only === true, "draft_uses_placeholders_only must be true");
  assert(approval.draft_not_executable_until_placeholders_replaced === true, "draft_not_executable_until_placeholders_replaced must be true");
  assert(typeof approval.approval_phrase_draft === "string" && approval.approval_phrase_draft.includes(packageId), "approval_phrase_draft must include package id");
  for (const token of [
    "<new_prompt_package_ref_under_prompts_image_generation_or_exact_override_statement>",
    "<new_output_directory_under_runs_real_generation>",
    "<new_receipt_path_under_reports_provider_receipts>",
    "<new_registry_path_or_existing_registry_refresh_plan_ref>",
    "<new_review_console_bridge_ref>",
    "仅运行 preflight，不调用 provider，不生成图片",
    "不读取任何 env 密钥值",
    "不写 DailyNote",
    "不写 VCP memory"
  ]) {
    assert(approval.approval_phrase_draft.includes(token), `approval_phrase_draft missing token: ${token}`);
  }

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length > 0, "next_route_options required");
  assert(record.next_route_options.every((item) => !/execute_real_generation_now|provider_call|memory_write/i.test(item)), "next route options must not authorize execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.draft_only === true, "draft_only must be true");
  assert(record.boundaries?.request_not_submitted === true, "request_not_submitted must be true");
  assert(record.boundaries?.can_execute_now === false, "boundary can_execute_now must remain false");
  assert(record.boundaries?.ready_for_exact_new_trial_authorization === true, "ready_for_exact_new_trial_authorization must remain true");
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
  assert(invalidFixtureCaught, "invalid exact new-trial A5 request draft fixture must fail");

  const cases = [
    expectFailure(validRecord, "active_true_fails", (candidate) => { candidate.draft_status.active = true; }),
    expectFailure(validRecord, "execute_now_true_fails", (candidate) => { candidate.draft_status.execute_now = true; }),
    expectFailure(validRecord, "approval_status_changed_fails", (candidate) => { candidate.draft_status.approval_status = "approved"; }),
    expectFailure(validRecord, "exact_phrase_received_true_fails", (candidate) => { candidate.draft_status.exact_approval_phrase_received = true; }),
    expectFailure(validRecord, "provider_calls_gt_1_fails", (candidate) => { candidate.fixed_constraints.max_provider_calls = 2; }),
    expectFailure(validRecord, "image_candidates_gt_1_fails", (candidate) => { candidate.fixed_constraints.max_image_candidates = 2; }),
    expectFailure(validRecord, "retry_limit_nonzero_fails", (candidate) => { candidate.fixed_constraints.retry_limit = 1; }),
    expectFailure(validRecord, "memory_default_false_fails", (candidate) => { candidate.fixed_constraints.no_memory_write_default = false; }),
    expectFailure(validRecord, "overwrite_true_fails", (candidate) => { candidate.fixed_constraints.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "prompt_requirement_false_fails", (candidate) => { candidate.unresolved_required_fields.exact_new_prompt_package_or_override_statement_required = false; }),
    expectFailure(validRecord, "output_requirement_false_fails", (candidate) => { candidate.unresolved_required_fields.exact_new_output_directory_required = false; }),
    expectFailure(validRecord, "approval_phrase_missing_placeholder_fails", (candidate) => { candidate.exact_approval_phrase_draft.approval_phrase_draft = candidate.exact_approval_phrase_draft.approval_phrase_draft.replace("<new_output_directory_under_runs_real_generation>", "runs/real_generation/sneaky/"); }),
    expectFailure(validRecord, "next_route_execution_fails", (candidate) => { candidate.next_route_options = ["execute_real_generation_now"]; }),
    expectFailure(validRecord, "boundary_execute_true_fails", (candidate) => { candidate.boundaries.can_execute_now = true; }),
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
  const reportRecord = readJson(reportPath).exact_new_trial_a5_request_draft;
  const validRecord = readJson(passFixturePath).exact_new_trial_a5_request_draft;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_a5_request_draft;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    "authorization_status: draft_not_submitted",
    "approval_status: not_requested",
    "active: false",
    "execute_now: false",
    "exact_approval_phrase_received: false",
    "recommended_exact_approval_phrase_present: true",
    "draft_uses_placeholders_only: true",
    "draft_not_executable_until_placeholders_replaced: true",
    "no_memory_write_default: true"
  ]) {
    assert(doc.includes(token), `request draft doc missing token: ${token}`);
  }
  assert(schema.includes("exact_new_trial_a5_request_draft"), "schema must define exact_new_trial_a5_request_draft");
  assert(mvp.includes("validate_exact_new_trial_a5_request_draft.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_6_EXACT_NEW_TRIAL_A5_REQUEST_DRAFT_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_a5_request_draft",
    phase,
    request_doc_present: true,
    request_schema_present: true,
    request_report_present: true,
    request_fixture_present: true,
    request_fail_fixture_present: true,
    authorization_package_id: packageId,
    authorization_status: "draft_not_submitted",
    approval_status: "not_requested",
    active: false,
    execute_now: false,
    exact_approval_phrase_received: false,
    ready_for_exact_new_trial_authorization: true,
    recommended_exact_approval_phrase_present: true,
    draft_uses_placeholders_only: true,
    draft_not_executable_until_placeholders_replaced: true,
    max_provider_calls: 1,
    max_image_candidates: 1,
    retry_limit: 0,
    no_memory_write_default: true,
    overwrite_existing_files_allowed: false,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    metadata_only: true,
    draft_only: true,
    request_not_submitted: true,
    can_execute_now: false,
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
