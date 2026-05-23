#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const actionPacketId = "exact_new_trial_action_packet_v0_1";
const noopRehearsalId = "exact_new_trial_noop_rehearsal_v0_1";
const humanApprovalPacketId = "exact_new_trial_human_approval_packet_v0_1";
const docPath = "docs/V0_6_15_EXACT_NEW_TRIAL_NOOP_REHEARSAL_HUMAN_APPROVAL_GATE.md";
const schemaPath = "schemas/exact_new_trial_noop_rehearsal_human_approval_gate.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_noop_rehearsal_human_approval_gate.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_noop_rehearsal_human_approval_gate_fail.example.json";
const sourceActionPacketPath = "reports/visual_asset_eval_dry_run/v0_6_14_exact_new_trial_action_packet_v0_1.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const expectedTargets = {
  prompt_package_ref: "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml",
  output_directory: "runs/real_generation/v0_3_3_exact_new_trial_001/",
  receipt_path: "reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json",
  registry_path: "reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json",
  review_console_bridge_ref: "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001"
};

const expectedCall = {
  provider_target: "codex_builtin_image_generation",
  plugin_id_or_provider_route: "image_gen.imagegen",
  model: "managed_by_codex_image_tool",
  command: "generate",
  exact_call_count: 1,
  max_image_candidates: 1,
  retry_limit: 0
};

const expectedOptions = ["keep_idle", "continue_dry_run", "authorize_one_real_generation"];
const requiredStopConditions = [
  "human_approval_pending",
  "authorization_phrase_missing",
  "selected_option_not_authorize_one_real_generation",
  "prompt_package_missing_or_changed",
  "output_directory_exists_before_execution",
  "receipt_path_exists_before_execution",
  "registry_path_exists_before_execution",
  "review_console_bridge_exists_before_execution",
  "overwrite_requested",
  "retry_requested",
  "max_image_candidates_above_one",
  "secret_value_required",
  "raw_provider_payload_capture_requested",
  "raw_provider_response_capture_requested",
  "memory_write_requested",
  "DailyNote_write_requested",
  "runtime_execution_requested",
  "provider_or_image_call_requested_during_noop",
  "accepted_sample_promotion_requested",
  "production_candidate_promotion_requested",
  "push_tag_release_deploy_requested",
  "validation_failure_requiring_judgment"
];

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

function sameStringList(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
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

function assertSameObject(actual, expected, context) {
  for (const [key, value] of Object.entries(expected)) {
    assert(actual?.[key] === value, `${context}.${key} mismatch`);
  }
}

function assertTargetPathsClear(record) {
  const report = record.noop_execution_report;
  assert(report.output_directory_clear === true, "output_directory_clear must be true");
  assert(report.receipt_path_clear === true, "receipt_path_clear must be true");
  assert(report.registry_path_clear === true, "registry_path_clear must be true");
  assert(report.review_console_bridge_clear === true, "review_console_bridge_clear must be true");
}

function validateSourceActionPacket(record) {
  const source = readJson(sourceActionPacketPath).exact_new_trial_action_packet_v0_1;
  assert(source.phase === "v0_6_14_exact_new_trial_action_packet_v0_1", "source action packet phase mismatch");
  assert(source.packet_status === "frozen_not_executable", "source action packet must remain frozen");
  assert(source.execution_guards?.human_approval_gate_required === true, "source must require human approval gate");
  assert(source.execution_guards?.no_op_runner_required_before_execution === true, "source must require no-op runner");
  assert(source.execution_guards?.can_execute_now === false, "source must not be executable");
  assert(record.source_action_packet_ref === sourceActionPacketPath, "source_action_packet_ref mismatch");
  assert(record.noop_execution_report.source_action_packet_verified === true, "source_action_packet_verified must be true");
  for (const [key, value] of Object.entries(expectedTargets)) {
    assert(source.frozen_targets?.[key] === value, `source target ${key} mismatch`);
  }
  assertSameObject(source.frozen_provider_command, expectedCall, "source.frozen_provider_command");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "noop rehearsal human approval gate record missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_noop_rehearsal_human_approval_gate");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.action_packet_id === actionPacketId, "action_packet_id mismatch");
  assert(record.noop_rehearsal_id === noopRehearsalId, "noop_rehearsal_id mismatch");
  assert(record.human_approval_packet_id === humanApprovalPacketId, "human_approval_packet_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  validateSourceActionPacket(record);

  const report = record.noop_execution_report;
  assert(report.runner_mode === "no_op_rehearsal_only", "runner_mode must remain no-op");
  assert(report.prompt_package_ref === expectedTargets.prompt_package_ref, "prompt_package_ref mismatch");
  assert(report.output_directory === expectedTargets.output_directory, "output_directory mismatch");
  assert(report.receipt_path === expectedTargets.receipt_path, "receipt_path mismatch");
  assert(report.registry_path === expectedTargets.registry_path, "registry_path mismatch");
  assert(report.review_console_bridge_ref === expectedTargets.review_console_bridge_ref, "review_console_bridge_ref mismatch");
  assert(fs.existsSync(repoPath(report.prompt_package_ref)), "prompt package must exist");
  assertTargetPathsClear(record);
  assert(sameStringList(report.would_read, [sourceActionPacketPath, expectedTargets.prompt_package_ref, "target_path_collision_state"]), "would_read mismatch");
  assert(Array.isArray(report.would_call_if_authorized) && report.would_call_if_authorized.length === 1, "would_call_if_authorized must contain one call");
  assertSameObject(report.would_call_if_authorized[0], expectedCall, "would_call_if_authorized.0");
  assert(sameStringList(report.would_write_if_real, [
    expectedTargets.output_directory,
    expectedTargets.receipt_path,
    expectedTargets.registry_path,
    expectedTargets.review_console_bridge_ref
  ]), "would_write_if_real mismatch");
  assert(report.would_generate?.emit === true, "would_generate must emit");
  assert(report.would_generate?.actual_generation_call_performed === false, "would_generate must not perform generation");
  assert(report.would_generate?.provider_dispatch_allowed_now === false, "would_generate must not allow provider dispatch now");
  assert(report.would_review?.emit === true, "would_review must emit");
  assert(report.would_review?.actual_review_bridge_written === false, "would_review must not write review bridge");
  assert(report.would_review?.human_review_required_after_future_generation === true, "future generation must require review");
  assert(report.would_stop?.emit === true, "would_stop must emit");
  assert(report.would_stop?.stop_reason === "human_approval_pending_real_generation_not_authorized", "would_stop reason mismatch");
  assert(report.would_stop?.actual_executor_stop_performed === false, "would_stop must not stop a real executor");
  assert(report.noop_execution_completed === true, "noop_execution_completed must be true");

  const approval = record.human_approval_packet;
  assert(approval.packet_status === "pending_human_decision", "approval packet must remain pending");
  assert(sameStringList(approval.allowed_options, expectedOptions), "allowed human options mismatch");
  assert(approval.selected_option === "keep_idle_until_explicit_human_decision", "selected option must remain safe idle");
  assert(approval.default_safe_option === "keep_idle", "default safe option must be keep_idle");
  assert(approval.human_approval_status === "pending", "human approval status must remain pending");
  assert(approval.authorization_phrase_captured === false, "authorization phrase must not be captured");
  assert(approval.real_generation_authorized_now === false, "real generation must not be authorized now");
  assert(approval.can_execute_now === false, "can_execute_now must remain false");
  assert(approval.future_provider_execution_requires_new_explicit_step === true, "future execution must require explicit step");
  const constraints = approval.authorize_one_real_generation_constraints;
  assert(constraints.exact_call_count === 1, "approval constraints exact_call_count must be 1");
  assert(constraints.max_image_candidates === 1, "approval constraints max_image_candidates must be 1");
  assert(constraints.retry_limit === 0, "approval constraints retry_limit must be 0");
  assert(constraints.overwrite_existing_files_allowed === false, "approval constraints must forbid overwrite");
  assert(constraints.secret_value_read_allowed === false, "approval constraints must forbid secret reads");
  assert(constraints.raw_provider_payload_capture_allowed === false, "approval constraints must forbid raw provider payload capture");
  assert(constraints.raw_provider_response_capture_allowed === false, "approval constraints must forbid raw provider response capture");
  assert(constraints.review_required_after_generation === true, "approval constraints must require review");
  assert(constraints.no_memory_write_default === true, "approval constraints must default to no memory write");

  const template = record.exact_future_approval_statement_template;
  for (const token of [
    "Jenn",
    packageId,
    expectedTargets.prompt_package_ref,
    expectedTargets.output_directory,
    expectedTargets.receipt_path,
    expectedTargets.registry_path,
    expectedTargets.review_console_bridge_ref,
    "image_gen.imagegen",
    "exactly 1 call",
    "exactly 1 candidate",
    "0 retry",
    "no overwrite",
    "no secret read"
  ]) {
    assert(template.includes(token), `approval template missing token: ${token}`);
  }
  assert(!/execute now|submit now|can execute now/i.test(template), "approval template must not request immediate execution");

  assert(Array.isArray(record.stop_conditions), "stop_conditions must be an array");
  for (const condition of requiredStopConditions) {
    assert(record.stop_conditions.includes(condition), `missing stop condition: ${condition}`);
  }
  assert(record.stop_conditions.every((condition) => !/submit_now|execute_now|provider_call_now|image_generation_now/i.test(condition)), "stop conditions must not authorize execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.no_op_rehearsal_only === true, "no_op_rehearsal_only must be true");
  assert(record.boundaries?.human_approval_packet_only === true, "human_approval_packet_only must be true");
  assert(record.boundaries?.no_new_trial_executed === true, "no_new_trial_executed must be true");
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
  assert(invalidFixtureCaught, "invalid noop rehearsal human approval fixture must fail");

  const cases = [
    expectFailure(validRecord, "runner_mode_real_executor_fails", (candidate) => { candidate.noop_execution_report.runner_mode = "real_executor"; }),
    expectFailure(validRecord, "source_ref_drift_fails", (candidate) => { candidate.source_action_packet_ref = "reports/other.json"; }),
    expectFailure(validRecord, "prompt_path_drift_fails", (candidate) => { candidate.noop_execution_report.prompt_package_ref = "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml"; }),
    expectFailure(validRecord, "output_path_drift_fails", (candidate) => { candidate.noop_execution_report.output_directory = "runs/real_generation/other/"; }),
    expectFailure(validRecord, "receipt_path_drift_fails", (candidate) => { candidate.noop_execution_report.receipt_path = "reports/provider_receipts/other.json"; }),
    expectFailure(validRecord, "registry_path_drift_fails", (candidate) => { candidate.noop_execution_report.registry_path = "reports/provider_receipts/other_registry.json"; }),
    expectFailure(validRecord, "bridge_path_drift_fails", (candidate) => { candidate.noop_execution_report.review_console_bridge_ref = "review_console/live_receipt_bridge/other"; }),
    expectFailure(validRecord, "target_clear_false_fails", (candidate) => { candidate.noop_execution_report.output_directory_clear = false; }),
    expectFailure(validRecord, "would_read_missing_fails", (candidate) => { candidate.noop_execution_report.would_read = [sourceActionPacketPath]; }),
    expectFailure(validRecord, "would_call_empty_fails", (candidate) => { candidate.noop_execution_report.would_call_if_authorized = []; }),
    expectFailure(validRecord, "call_count_widened_fails", (candidate) => { candidate.noop_execution_report.would_call_if_authorized[0].exact_call_count = 2; }),
    expectFailure(validRecord, "candidate_count_widened_fails", (candidate) => { candidate.noop_execution_report.would_call_if_authorized[0].max_image_candidates = 2; }),
    expectFailure(validRecord, "retry_widened_fails", (candidate) => { candidate.noop_execution_report.would_call_if_authorized[0].retry_limit = 1; }),
    expectFailure(validRecord, "would_write_missing_fails", (candidate) => { candidate.noop_execution_report.would_write_if_real = [expectedTargets.output_directory]; }),
    expectFailure(validRecord, "actual_generation_true_fails", (candidate) => { candidate.noop_execution_report.would_generate.actual_generation_call_performed = true; }),
    expectFailure(validRecord, "provider_dispatch_true_fails", (candidate) => { candidate.noop_execution_report.would_generate.provider_dispatch_allowed_now = true; }),
    expectFailure(validRecord, "review_bridge_written_true_fails", (candidate) => { candidate.noop_execution_report.would_review.actual_review_bridge_written = true; }),
    expectFailure(validRecord, "future_review_false_fails", (candidate) => { candidate.noop_execution_report.would_review.human_review_required_after_future_generation = false; }),
    expectFailure(validRecord, "would_stop_emit_false_fails", (candidate) => { candidate.noop_execution_report.would_stop.emit = false; }),
    expectFailure(validRecord, "stop_reason_missing_fails", (candidate) => { candidate.noop_execution_report.would_stop.stop_reason = ""; }),
    expectFailure(validRecord, "approval_status_approved_fails", (candidate) => { candidate.human_approval_packet.human_approval_status = "approved"; }),
    expectFailure(validRecord, "allowed_options_missing_fails", (candidate) => { candidate.human_approval_packet.allowed_options = ["authorize_one_real_generation"]; }),
    expectFailure(validRecord, "selected_option_authorize_fails", (candidate) => { candidate.human_approval_packet.selected_option = "authorize_one_real_generation"; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.human_approval_packet.can_execute_now = true; }),
    expectFailure(validRecord, "authorization_phrase_captured_true_fails", (candidate) => { candidate.human_approval_packet.authorization_phrase_captured = true; }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => { candidate.human_approval_packet.authorize_one_real_generation_constraints.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "secret_read_allowed_fails", (candidate) => { candidate.human_approval_packet.authorize_one_real_generation_constraints.secret_value_read_allowed = true; }),
    expectFailure(validRecord, "raw_payload_capture_allowed_fails", (candidate) => { candidate.human_approval_packet.authorize_one_real_generation_constraints.raw_provider_payload_capture_allowed = true; }),
    expectFailure(validRecord, "template_execute_now_fails", (candidate) => { candidate.exact_future_approval_statement_template = `${candidate.exact_future_approval_statement_template} execute now`; }),
    expectFailure(validRecord, "stop_condition_missing_fails", (candidate) => { candidate.stop_conditions = candidate.stop_conditions.filter((item) => item !== "human_approval_pending"); }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "output_created_true_fails", (candidate) => { candidate.side_effects.output_directory_created = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.noop_rehearsal_id = "C:\\private\\noop.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.noop_rehearsal_id = "config.env"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    runner_mode_guard_caught: cases.some((item) => item.case_id === "runner_mode_real_executor_fails" && item.result === "caught"),
    would_call_guard_caught: cases.some((item) => item.case_id === "call_count_widened_fails" && item.result === "caught"),
    human_approval_guard_caught: cases.some((item) => item.case_id === "approval_status_approved_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    output_write_caught: cases.some((item) => item.case_id === "output_created_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "memory_write_true_fails" && item.result === "caught"),
    runtime_call_caught: cases.some((item) => item.case_id === "runtime_call_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).exact_new_trial_noop_rehearsal_human_approval_gate;
  const validRecord = readJson(passFixturePath).exact_new_trial_noop_rehearsal_human_approval_gate;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_noop_rehearsal_human_approval_gate;

  for (const token of [
    "would_generate",
    "would_review",
    "would_stop",
    "keep_idle",
    "continue_dry_run",
    "authorize_one_real_generation",
    "human_approval_pending_real_generation_not_authorized"
  ]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("exact_new_trial_noop_rehearsal_human_approval_gate"), "schema must define no-op rehearsal human approval gate");
  assert(mvp.includes("validate_exact_new_trial_noop_rehearsal_human_approval_gate.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_15_EXACT_NEW_TRIAL_NOOP_REHEARSAL_HUMAN_APPROVAL_GATE_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_noop_rehearsal_human_approval_gate",
    phase,
    noop_gate_doc_present: true,
    noop_gate_schema_present: true,
    noop_gate_report_present: true,
    noop_gate_fixture_present: true,
    noop_gate_fail_fixture_present: true,
    authorization_package_id: reportRecord.authorization_package_id,
    action_packet_id: reportRecord.action_packet_id,
    noop_rehearsal_id: reportRecord.noop_rehearsal_id,
    human_approval_packet_id: reportRecord.human_approval_packet_id,
    source_action_packet_verified: true,
    prompt_package_ref: reportRecord.noop_execution_report.prompt_package_ref,
    output_directory: reportRecord.noop_execution_report.output_directory,
    receipt_path: reportRecord.noop_execution_report.receipt_path,
    registry_path: reportRecord.noop_execution_report.registry_path,
    review_console_bridge_ref: reportRecord.noop_execution_report.review_console_bridge_ref,
    target_paths_clear: true,
    would_read_count: reportRecord.noop_execution_report.would_read.length,
    would_call_count: reportRecord.noop_execution_report.would_call_if_authorized.length,
    would_write_count: reportRecord.noop_execution_report.would_write_if_real.length,
    runner_mode: reportRecord.noop_execution_report.runner_mode,
    noop_execution_completed: reportRecord.noop_execution_report.noop_execution_completed,
    would_generate_emit: reportRecord.noop_execution_report.would_generate.emit,
    would_review_emit: reportRecord.noop_execution_report.would_review.emit,
    would_stop_emit: reportRecord.noop_execution_report.would_stop.emit,
    stop_reason: reportRecord.noop_execution_report.would_stop.stop_reason,
    allowed_human_options: reportRecord.human_approval_packet.allowed_options,
    selected_option: reportRecord.human_approval_packet.selected_option,
    human_approval_status: reportRecord.human_approval_packet.human_approval_status,
    authorization_phrase_captured: reportRecord.human_approval_packet.authorization_phrase_captured,
    real_generation_authorized_now: reportRecord.human_approval_packet.real_generation_authorized_now,
    can_execute_now: reportRecord.human_approval_packet.can_execute_now,
    future_provider_execution_requires_new_explicit_step: reportRecord.human_approval_packet.future_provider_execution_requires_new_explicit_step,
    exact_call_count: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.exact_call_count,
    max_image_candidates: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.max_image_candidates,
    retry_limit: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.retry_limit,
    overwrite_existing_files_allowed: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.overwrite_existing_files_allowed,
    secret_value_read_allowed: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.secret_value_read_allowed,
    raw_provider_payload_capture_allowed: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.raw_provider_payload_capture_allowed,
    raw_provider_response_capture_allowed: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.raw_provider_response_capture_allowed,
    review_required_after_generation: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.review_required_after_generation,
    no_memory_write_default: reportRecord.human_approval_packet.authorize_one_real_generation_constraints.no_memory_write_default,
    stop_condition_count: reportRecord.stop_conditions.length,
    metadata_only: reportRecord.boundaries.metadata_only,
    no_op_rehearsal_only: reportRecord.boundaries.no_op_rehearsal_only,
    human_approval_packet_only: reportRecord.boundaries.human_approval_packet_only,
    no_new_trial_executed: reportRecord.boundaries.no_new_trial_executed,
    Push_L2_exercised: reportRecord.boundaries.Push_L2_exercised,
    real_executor_implemented_now: reportRecord.boundaries.real_executor_implemented_now,
    provider_call_performed: reportRecord.side_effects.provider_call_performed,
    image_generation_performed: reportRecord.side_effects.image_generation_performed,
    output_directory_created: reportRecord.side_effects.output_directory_created,
    receipt_write_performed: reportRecord.side_effects.receipt_write_performed,
    registry_write_performed: reportRecord.side_effects.registry_write_performed,
    review_console_bridge_materialized: reportRecord.side_effects.review_console_bridge_materialized,
    VCP_memory_write_performed: reportRecord.side_effects.VCP_memory_write_performed,
    DailyNote_write_performed: reportRecord.side_effects.DailyNote_write_performed,
    runtime_call_performed: reportRecord.side_effects.runtime_call_performed,
    secret_value_read_performed: reportRecord.side_effects.secret_value_read_performed,
    production_candidate_created: reportRecord.side_effects.production_candidate_created,
    accepted_sample_auto_promotion: reportRecord.side_effects.accepted_sample_auto_promotion,
    memory_seed_promoted: reportRecord.side_effects.memory_seed_promoted,
    package_dependency_change_performed: reportRecord.side_effects.package_dependency_change_performed,
    commit_performed: reportRecord.side_effects.commit_performed,
    push_performed: reportRecord.side_effects.push_performed,
    ...negativeCaseSummary
  };

  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
