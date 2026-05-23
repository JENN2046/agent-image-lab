#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_16_exact_new_trial_human_approval_intake_validator";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const actionPacketId = "exact_new_trial_action_packet_v0_1";
const noopRehearsalId = "exact_new_trial_noop_rehearsal_v0_1";
const humanApprovalPacketId = "exact_new_trial_human_approval_packet_v0_1";
const intakeValidatorId = "exact_new_trial_human_approval_intake_validator_v0_1";
const docPath = "docs/V0_6_16_EXACT_NEW_TRIAL_HUMAN_APPROVAL_INTAKE_VALIDATOR.md";
const schemaPath = "schemas/exact_new_trial_human_approval_intake_validator.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_16_exact_new_trial_human_approval_intake_validator.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_human_approval_intake_validator.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_human_approval_intake_validator_fail.example.json";
const sourceNoopGatePath = "reports/visual_asset_eval_dry_run/v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const expectedOptions = ["keep_idle", "continue_dry_run", "authorize_one_real_generation"];
const requiredTokens = [
  "Jenn",
  packageId,
  "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml",
  "runs/real_generation/v0_3_3_exact_new_trial_001/",
  "reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json",
  "reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json",
  "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001",
  "image_gen.imagegen",
  "exactly 1 call",
  "exactly 1 candidate",
  "0 retry",
  "no overwrite",
  "no secret read",
  "no raw provider payload or response capture",
  "no DailyNote or VCP memory write",
  "no accepted-sample promotion",
  "no production-candidate promotion",
  "no push/tag/release/deploy"
];

const expectedConstraints = {
  prompt_package_ref: "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml",
  output_directory: "runs/real_generation/v0_3_3_exact_new_trial_001/",
  receipt_path: "reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json",
  registry_path: "reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json",
  review_console_bridge_ref: "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001",
  provider_route: "image_gen.imagegen",
  exact_call_count: 1,
  max_image_candidates: 1,
  retry_limit: 0,
  overwrite_existing_files_allowed: false,
  secret_value_read_allowed: false,
  raw_provider_payload_capture_allowed: false,
  raw_provider_response_capture_allowed: false,
  review_required_after_generation: true,
  no_memory_write_default: true
};

const requiredStopConditions = [
  "human_choice_not_captured",
  "authorization_phrase_missing",
  "authorization_phrase_missing_required_token",
  "selected_option_not_allowed",
  "selected_option_authorize_without_exact_phrase",
  "execute_requested_by_intake_record",
  "provider_or_image_call_requested_by_intake_record",
  "overwrite_requested",
  "retry_requested",
  "max_image_candidates_above_one",
  "secret_value_required",
  "raw_provider_payload_capture_requested",
  "raw_provider_response_capture_requested",
  "memory_write_requested",
  "DailyNote_write_requested",
  "runtime_execution_requested",
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

function validateSourceNoopGate(record) {
  const source = readJson(sourceNoopGatePath).exact_new_trial_noop_rehearsal_human_approval_gate;
  assert(source.phase === "v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate", "source no-op gate phase mismatch");
  assert(source.noop_execution_report?.runner_mode === "no_op_rehearsal_only", "source runner mode must remain no-op");
  assert(source.human_approval_packet?.human_approval_status === "pending", "source human approval must remain pending");
  assert(source.human_approval_packet?.real_generation_authorized_now === false, "source must not authorize real generation");
  assert(source.human_approval_packet?.can_execute_now === false, "source must not execute now");
  assert(record.source_noop_gate_ref === sourceNoopGatePath, "source_noop_gate_ref mismatch");
  assert(record.intake_state.source_noop_gate_verified === true, "source_noop_gate_verified must be true");
  assert(sameStringList(source.human_approval_packet.allowed_options, expectedOptions), "source allowed options mismatch");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "human approval intake validator record missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_human_approval_intake_validator");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.action_packet_id === actionPacketId, "action_packet_id mismatch");
  assert(record.noop_rehearsal_id === noopRehearsalId, "noop_rehearsal_id mismatch");
  assert(record.human_approval_packet_id === humanApprovalPacketId, "human_approval_packet_id mismatch");
  assert(record.approval_intake_validator_id === intakeValidatorId, "approval_intake_validator_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  validateSourceNoopGate(record);

  const intake = record.intake_state;
  assert(intake.intake_mode === "approval_intake_validator_only", "intake_mode must remain validator only");
  assert(intake.current_user_choice === "not_captured", "current_user_choice must remain not_captured");
  assert(intake.human_response_captured_now === false, "human response must not be captured now");
  assert(intake.authorization_phrase_captured === false, "authorization phrase must not be captured now");
  assert(intake.human_approval_status === "pending", "human approval status must remain pending");
  assert(intake.decision_result === "stay_idle", "decision_result must stay idle");
  assert(intake.can_execute_now === false, "intake must not execute now");
  assert(intake.real_generation_authorized_now === false, "intake must not authorize real generation now");
  assert(intake.future_provider_execution_requires_new_explicit_step === true, "future provider execution must require explicit step");

  const choices = record.choice_classification;
  assert(sameStringList(choices.allowed_options, expectedOptions), "allowed options mismatch");
  assert(choices.keep_idle?.classification === "green_idle", "keep_idle classification mismatch");
  assert(choices.keep_idle?.local_only === true, "keep_idle must be local only");
  assert(choices.keep_idle?.real_generation_allowed === false, "keep_idle must not allow generation");
  assert(choices.keep_idle?.can_execute_now === false, "keep_idle must not execute now");
  assert(choices.continue_dry_run?.classification === "green_dry_run_only", "continue_dry_run classification mismatch");
  assert(choices.continue_dry_run?.local_only === true, "continue_dry_run must be local only");
  assert(choices.continue_dry_run?.real_generation_allowed === false, "continue_dry_run must not allow generation");
  assert(choices.continue_dry_run?.can_execute_now === false, "continue_dry_run must not execute now");
  assert(choices.authorize_one_real_generation?.classification === "requires_future_explicit_authorization_and_separate_execution_preflight", "authorize_one_real_generation classification mismatch");
  assert(choices.authorize_one_real_generation?.real_generation_allowed_by_this_record === false, "intake record must not grant real generation");
  assert(choices.authorize_one_real_generation?.can_execute_now === false, "authorize option must not execute now in this record");
  assert(choices.authorize_one_real_generation?.exact_phrase_required === true, "authorize option must require exact phrase");

  assert(sameStringList(record.required_authorization_phrase_tokens, requiredTokens), "required authorization phrase token set mismatch");
  const joinedTokens = record.required_authorization_phrase_tokens.join(" ");
  assert(!/execute now|submit now|can execute now/i.test(joinedTokens), "required tokens must not request immediate execution");

  for (const [key, value] of Object.entries(expectedConstraints)) {
    assert(record.future_execution_constraints?.[key] === value, `future_execution_constraints.${key} mismatch`);
  }

  assert(Array.isArray(record.stop_conditions), "stop_conditions must be an array");
  for (const condition of requiredStopConditions) {
    assert(record.stop_conditions.includes(condition), `missing stop condition: ${condition}`);
  }

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.approval_intake_validator_only === true, "approval_intake_validator_only must be true");
  assert(record.boundaries?.no_new_human_approval_captured === true, "no_new_human_approval_captured must be true");
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
  assert(invalidFixtureCaught, "invalid human approval intake validator fixture must fail");

  const cases = [
    expectFailure(validRecord, "intake_mode_real_fails", (candidate) => { candidate.intake_state.intake_mode = "real_execution_intake"; }),
    expectFailure(validRecord, "source_ref_drift_fails", (candidate) => { candidate.source_noop_gate_ref = "reports/other.json"; }),
    expectFailure(validRecord, "choice_captured_fails", (candidate) => { candidate.intake_state.current_user_choice = "authorize_one_real_generation"; }),
    expectFailure(validRecord, "human_response_captured_fails", (candidate) => { candidate.intake_state.human_response_captured_now = true; }),
    expectFailure(validRecord, "authorization_phrase_captured_fails", (candidate) => { candidate.intake_state.authorization_phrase_captured = true; }),
    expectFailure(validRecord, "human_approval_approved_fails", (candidate) => { candidate.intake_state.human_approval_status = "approved"; }),
    expectFailure(validRecord, "decision_execute_fails", (candidate) => { candidate.intake_state.decision_result = "execute_now"; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.intake_state.can_execute_now = true; }),
    expectFailure(validRecord, "real_generation_authorized_true_fails", (candidate) => { candidate.intake_state.real_generation_authorized_now = true; }),
    expectFailure(validRecord, "allowed_options_missing_fails", (candidate) => { candidate.choice_classification.allowed_options = ["authorize_one_real_generation"]; }),
    expectFailure(validRecord, "keep_idle_allows_generation_fails", (candidate) => { candidate.choice_classification.keep_idle.real_generation_allowed = true; }),
    expectFailure(validRecord, "dry_run_allows_generation_fails", (candidate) => { candidate.choice_classification.continue_dry_run.real_generation_allowed = true; }),
    expectFailure(validRecord, "authorize_grants_generation_fails", (candidate) => { candidate.choice_classification.authorize_one_real_generation.real_generation_allowed_by_this_record = true; }),
    expectFailure(validRecord, "authorize_can_execute_fails", (candidate) => { candidate.choice_classification.authorize_one_real_generation.can_execute_now = true; }),
    expectFailure(validRecord, "authorize_no_exact_phrase_fails", (candidate) => { candidate.choice_classification.authorize_one_real_generation.exact_phrase_required = false; }),
    expectFailure(validRecord, "required_token_missing_fails", (candidate) => { candidate.required_authorization_phrase_tokens = candidate.required_authorization_phrase_tokens.filter((item) => item !== "Jenn"); }),
    expectFailure(validRecord, "required_token_execute_now_fails", (candidate) => { candidate.required_authorization_phrase_tokens.push("execute now"); }),
    expectFailure(validRecord, "prompt_constraint_drift_fails", (candidate) => { candidate.future_execution_constraints.prompt_package_ref = "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml"; }),
    expectFailure(validRecord, "output_constraint_drift_fails", (candidate) => { candidate.future_execution_constraints.output_directory = "runs/real_generation/other/"; }),
    expectFailure(validRecord, "provider_route_drift_fails", (candidate) => { candidate.future_execution_constraints.provider_route = "other.route"; }),
    expectFailure(validRecord, "call_count_widened_fails", (candidate) => { candidate.future_execution_constraints.exact_call_count = 2; }),
    expectFailure(validRecord, "candidate_count_widened_fails", (candidate) => { candidate.future_execution_constraints.max_image_candidates = 2; }),
    expectFailure(validRecord, "retry_widened_fails", (candidate) => { candidate.future_execution_constraints.retry_limit = 1; }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => { candidate.future_execution_constraints.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "secret_read_allowed_fails", (candidate) => { candidate.future_execution_constraints.secret_value_read_allowed = true; }),
    expectFailure(validRecord, "raw_payload_capture_allowed_fails", (candidate) => { candidate.future_execution_constraints.raw_provider_payload_capture_allowed = true; }),
    expectFailure(validRecord, "review_not_required_fails", (candidate) => { candidate.future_execution_constraints.review_required_after_generation = false; }),
    expectFailure(validRecord, "memory_default_false_fails", (candidate) => { candidate.future_execution_constraints.no_memory_write_default = false; }),
    expectFailure(validRecord, "stop_condition_missing_fails", (candidate) => { candidate.stop_conditions = candidate.stop_conditions.filter((item) => item !== "authorization_phrase_missing_required_token"); }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "output_created_true_fails", (candidate) => { candidate.side_effects.output_directory_created = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.approval_intake_validator_id = "C:\\private\\approval.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.approval_intake_validator_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    intake_mode_guard_caught: cases.some((item) => item.case_id === "intake_mode_real_fails" && item.result === "caught"),
    captured_approval_guard_caught: cases.some((item) => item.case_id === "authorization_phrase_captured_fails" && item.result === "caught"),
    choice_guard_caught: cases.some((item) => item.case_id === "allowed_options_missing_fails" && item.result === "caught"),
    future_constraint_guard_caught: cases.some((item) => item.case_id === "call_count_widened_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
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
  const reportRecord = readJson(reportPath).exact_new_trial_human_approval_intake_validator;
  const validRecord = readJson(passFixturePath).exact_new_trial_human_approval_intake_validator;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_human_approval_intake_validator;

  for (const token of [
    "approval_intake_validator_only",
    "keep_idle",
    "continue_dry_run",
    "authorize_one_real_generation",
    "no_new_human_approval_captured"
  ]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("exact_new_trial_human_approval_intake_validator"), "schema must define human approval intake validator");
  assert(mvp.includes("validate_exact_new_trial_human_approval_intake_validator.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_16_EXACT_NEW_TRIAL_HUMAN_APPROVAL_INTAKE_VALIDATOR_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_human_approval_intake_validator",
    phase,
    intake_doc_present: true,
    intake_schema_present: true,
    intake_report_present: true,
    intake_fixture_present: true,
    intake_fail_fixture_present: true,
    authorization_package_id: reportRecord.authorization_package_id,
    action_packet_id: reportRecord.action_packet_id,
    noop_rehearsal_id: reportRecord.noop_rehearsal_id,
    human_approval_packet_id: reportRecord.human_approval_packet_id,
    approval_intake_validator_id: reportRecord.approval_intake_validator_id,
    source_noop_gate_verified: reportRecord.intake_state.source_noop_gate_verified,
    intake_mode: reportRecord.intake_state.intake_mode,
    current_user_choice: reportRecord.intake_state.current_user_choice,
    human_response_captured_now: reportRecord.intake_state.human_response_captured_now,
    authorization_phrase_captured: reportRecord.intake_state.authorization_phrase_captured,
    human_approval_status: reportRecord.intake_state.human_approval_status,
    decision_result: reportRecord.intake_state.decision_result,
    can_execute_now: reportRecord.intake_state.can_execute_now,
    real_generation_authorized_now: reportRecord.intake_state.real_generation_authorized_now,
    future_provider_execution_requires_new_explicit_step: reportRecord.intake_state.future_provider_execution_requires_new_explicit_step,
    allowed_human_options: reportRecord.choice_classification.allowed_options,
    keep_idle_classification: reportRecord.choice_classification.keep_idle.classification,
    continue_dry_run_classification: reportRecord.choice_classification.continue_dry_run.classification,
    authorize_one_real_generation_classification: reportRecord.choice_classification.authorize_one_real_generation.classification,
    required_authorization_phrase_token_count: reportRecord.required_authorization_phrase_tokens.length,
    prompt_package_ref: reportRecord.future_execution_constraints.prompt_package_ref,
    output_directory: reportRecord.future_execution_constraints.output_directory,
    receipt_path: reportRecord.future_execution_constraints.receipt_path,
    registry_path: reportRecord.future_execution_constraints.registry_path,
    review_console_bridge_ref: reportRecord.future_execution_constraints.review_console_bridge_ref,
    provider_route: reportRecord.future_execution_constraints.provider_route,
    exact_call_count: reportRecord.future_execution_constraints.exact_call_count,
    max_image_candidates: reportRecord.future_execution_constraints.max_image_candidates,
    retry_limit: reportRecord.future_execution_constraints.retry_limit,
    overwrite_existing_files_allowed: reportRecord.future_execution_constraints.overwrite_existing_files_allowed,
    secret_value_read_allowed: reportRecord.future_execution_constraints.secret_value_read_allowed,
    raw_provider_payload_capture_allowed: reportRecord.future_execution_constraints.raw_provider_payload_capture_allowed,
    raw_provider_response_capture_allowed: reportRecord.future_execution_constraints.raw_provider_response_capture_allowed,
    review_required_after_generation: reportRecord.future_execution_constraints.review_required_after_generation,
    no_memory_write_default: reportRecord.future_execution_constraints.no_memory_write_default,
    stop_condition_count: reportRecord.stop_conditions.length,
    metadata_only: reportRecord.boundaries.metadata_only,
    approval_intake_validator_only: reportRecord.boundaries.approval_intake_validator_only,
    no_new_human_approval_captured: reportRecord.boundaries.no_new_human_approval_captured,
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
