#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_17_30_day_exact_new_trial_checkpoint";
const checkpointId = "30_day_exact_new_trial_checkpoint_v0_1";
const checkpointDocPath = "30_DAY_EXACT_NEW_TRIAL_CHECKPOINT.md";
const schemaPath = "schemas/exact_new_trial_30_day_checkpoint.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_17_30_day_exact_new_trial_checkpoint.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_30_day_checkpoint.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_30_day_checkpoint_fail.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const sourcePaths = {
  local_preflight_ref: "reports/visual_asset_eval_dry_run/v0_6_12_local_preflight_only_gate.json",
  failed_attempt_review_ref: "reports/visual_asset_eval_dry_run/v0_6_13_failed_provider_attempt_review.json",
  action_packet_ref: "reports/visual_asset_eval_dry_run/v0_6_14_exact_new_trial_action_packet_v0_1.json",
  noop_rehearsal_gate_ref: "reports/visual_asset_eval_dry_run/v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate.json",
  human_approval_intake_ref: "reports/visual_asset_eval_dry_run/v0_6_16_exact_new_trial_human_approval_intake_validator.json"
};

const expectedPackage = {
  authorization_package_id: "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001",
  action_packet_id: "exact_new_trial_action_packet_v0_1",
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

const requiredRisks = [
  "human_approval_missing",
  "provider_tool_user_error_history",
  "path_collision_risk",
  "review_gap_risk",
  "memory_promotion_risk"
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

function loadSources() {
  const preflight = readJson(sourcePaths.local_preflight_ref).exact_new_trial_local_preflight_only_gate;
  const failedReview = readJson(sourcePaths.failed_attempt_review_ref).exact_new_trial_failed_provider_attempt_review;
  const actionPacket = readJson(sourcePaths.action_packet_ref).exact_new_trial_action_packet_v0_1;
  const noopGate = readJson(sourcePaths.noop_rehearsal_gate_ref).exact_new_trial_noop_rehearsal_human_approval_gate;
  const intake = readJson(sourcePaths.human_approval_intake_ref).exact_new_trial_human_approval_intake_validator;

  assert(preflight.phase === "v0_6_12_local_preflight_only_gate", "v0.6.12 source phase mismatch");
  assert(preflight.local_preflight_status?.source_preflight_authorization_consumed === true, "v0.6.12 preflight must be consumed");
  assert(failedReview.phase === "v0_6_13_failed_provider_attempt_review", "v0.6.13 source phase mismatch");
  assert(failedReview.review_findings?.failed_attempt_count === 2, "v0.6.13 must review two failed attempts");
  assert(failedReview.review_findings?.cannot_reuse_failed_output_receipt_registry_bridge_paths === true, "v0.6.13 must block failed path reuse");
  assert(actionPacket.phase === "v0_6_14_exact_new_trial_action_packet_v0_1", "v0.6.14 source phase mismatch");
  assert(actionPacket.packet_status === "frozen_not_executable", "v0.6.14 packet must be frozen");
  assert(noopGate.phase === "v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate", "v0.6.15 source phase mismatch");
  assert(noopGate.noop_execution_report?.noop_execution_completed === true, "v0.6.15 no-op rehearsal must be complete");
  assert(intake.phase === "v0_6_16_exact_new_trial_human_approval_intake_validator", "v0.6.16 source phase mismatch");
  assert(intake.intake_state?.human_approval_status === "pending", "v0.6.16 approval must remain pending");
  assert(intake.intake_state?.can_execute_now === false, "v0.6.16 must block execution");
  assert(intake.intake_state?.real_generation_authorized_now === false, "v0.6.16 must not authorize real generation");

  return { preflight, failedReview, actionPacket, noopGate, intake };
}

function validateRecord(record) {
  assert(record && typeof record === "object", "30 day checkpoint record missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_30_day_checkpoint");
  assert(record.checkpoint_id === checkpointId, "checkpoint_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");

  for (const [key, value] of Object.entries(sourcePaths)) {
    assert(record.source_refs?.[key] === value, `source_refs.${key} mismatch`);
  }
  const sources = loadSources();
  assertSameObject(record.frozen_trial_package, expectedPackage, "frozen_trial_package");
  assert(record.frozen_trial_package.prompt_package_ref === sources.actionPacket.frozen_targets.prompt_package_ref, "checkpoint prompt must match frozen packet");
  assert(record.frozen_trial_package.output_directory === sources.actionPacket.frozen_targets.output_directory, "checkpoint output must match frozen packet");
  assert(record.frozen_trial_package.receipt_path === sources.actionPacket.frozen_targets.receipt_path, "checkpoint receipt must match frozen packet");
  assert(record.frozen_trial_package.registry_path === sources.actionPacket.frozen_targets.registry_path, "checkpoint registry must match frozen packet");
  assert(record.frozen_trial_package.review_console_bridge_ref === sources.actionPacket.frozen_targets.review_console_bridge_ref, "checkpoint bridge must match frozen packet");

  const readiness = record.readiness_state;
  assert(readiness.readiness_state === "ready_for_human_choice_not_ready_for_execution", "readiness_state mismatch");
  assert(readiness.auditable_preparation_loop_complete === true, "auditable loop must be complete");
  assert(readiness.preflight_consumed === true, "preflight_consumed must be true");
  assert(readiness.failed_attempt_review_complete === true, "failed_attempt_review_complete must be true");
  assert(readiness.action_packet_frozen === true, "action_packet_frozen must be true");
  assert(readiness.noop_rehearsal_complete === true, "noop_rehearsal_complete must be true");
  assert(readiness.human_approval_gate_defined === true, "human_approval_gate_defined must be true");
  assert(readiness.human_approval_intake_validator_complete === true, "human_approval_intake_validator_complete must be true");
  assert(readiness.human_choice_captured === false, "human_choice_captured must remain false");
  assert(readiness.real_generation_authorized_now === false, "real_generation_authorized_now must remain false");
  assert(readiness.can_execute_now === false, "can_execute_now must remain false");

  const decision = record.executive_decision;
  assert(decision.should_enter_real_generation_now === false, "should_enter_real_generation_now must be false");
  assert(decision.recommendation === "do_not_enter_real_generation_yet", "recommendation mismatch");
  assert(decision.future_real_generation_allowed_only_after_exact_authorization === true, "future generation must require exact authorization");
  assert(/not_captured|authorization/i.test(decision.reason), "decision reason must cite missing authorization");

  assert(Array.isArray(record.risk_list), "risk_list must be an array");
  const riskIds = record.risk_list.map((risk) => risk.risk_id);
  for (const risk of requiredRisks) {
    assert(riskIds.includes(risk), `missing risk: ${risk}`);
  }

  const route = record.next_stage_route;
  assert(route.if_keep_idle === "keep_checkpoint_as_terminal_local_state", "keep_idle route mismatch");
  assert(route.if_continue_dry_run === "continue_local_dry_run_review_loop_or_execution_preflight_hardening", "continue_dry_run route mismatch");
  assert(route.if_authorize_one_real_generation === "create_separate_execution_preflight_before_provider_call", "authorize route mismatch");
  assert(route.real_generation_requires_new_explicit_step === true, "real generation must require new explicit step");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.checkpoint_only === true, "checkpoint_only must be true");
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
  assert(invalidFixtureCaught, "invalid 30 day checkpoint fixture must fail");

  const cases = [
    expectFailure(validRecord, "source_ref_drift_fails", (candidate) => { candidate.source_refs.human_approval_intake_ref = "reports/other.json"; }),
    expectFailure(validRecord, "readiness_execution_ready_fails", (candidate) => { candidate.readiness_state.readiness_state = "ready_for_execution"; }),
    expectFailure(validRecord, "loop_incomplete_fails", (candidate) => { candidate.readiness_state.auditable_preparation_loop_complete = false; }),
    expectFailure(validRecord, "preflight_false_fails", (candidate) => { candidate.readiness_state.preflight_consumed = false; }),
    expectFailure(validRecord, "failed_review_false_fails", (candidate) => { candidate.readiness_state.failed_attempt_review_complete = false; }),
    expectFailure(validRecord, "action_packet_false_fails", (candidate) => { candidate.readiness_state.action_packet_frozen = false; }),
    expectFailure(validRecord, "noop_false_fails", (candidate) => { candidate.readiness_state.noop_rehearsal_complete = false; }),
    expectFailure(validRecord, "intake_false_fails", (candidate) => { candidate.readiness_state.human_approval_intake_validator_complete = false; }),
    expectFailure(validRecord, "human_choice_true_fails", (candidate) => { candidate.readiness_state.human_choice_captured = true; }),
    expectFailure(validRecord, "real_generation_authorized_true_fails", (candidate) => { candidate.readiness_state.real_generation_authorized_now = true; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.readiness_state.can_execute_now = true; }),
    expectFailure(validRecord, "decision_enter_now_fails", (candidate) => { candidate.executive_decision.should_enter_real_generation_now = true; }),
    expectFailure(validRecord, "recommendation_enter_now_fails", (candidate) => { candidate.executive_decision.recommendation = "enter_real_generation_now"; }),
    expectFailure(validRecord, "future_authorization_false_fails", (candidate) => { candidate.executive_decision.future_real_generation_allowed_only_after_exact_authorization = false; }),
    expectFailure(validRecord, "prompt_drift_fails", (candidate) => { candidate.frozen_trial_package.prompt_package_ref = "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml"; }),
    expectFailure(validRecord, "output_drift_fails", (candidate) => { candidate.frozen_trial_package.output_directory = "runs/real_generation/other/"; }),
    expectFailure(validRecord, "provider_route_drift_fails", (candidate) => { candidate.frozen_trial_package.provider_route = "other.route"; }),
    expectFailure(validRecord, "call_count_widened_fails", (candidate) => { candidate.frozen_trial_package.exact_call_count = 2; }),
    expectFailure(validRecord, "candidate_count_widened_fails", (candidate) => { candidate.frozen_trial_package.max_image_candidates = 2; }),
    expectFailure(validRecord, "retry_widened_fails", (candidate) => { candidate.frozen_trial_package.retry_limit = 1; }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => { candidate.frozen_trial_package.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "secret_allowed_fails", (candidate) => { candidate.frozen_trial_package.secret_value_read_allowed = true; }),
    expectFailure(validRecord, "risk_missing_fails", (candidate) => { candidate.risk_list = candidate.risk_list.filter((risk) => risk.risk_id !== "human_approval_missing"); }),
    expectFailure(validRecord, "route_executes_now_fails", (candidate) => { candidate.next_stage_route.if_authorize_one_real_generation = "execute_now"; }),
    expectFailure(validRecord, "new_step_false_fails", (candidate) => { candidate.next_stage_route.real_generation_requires_new_explicit_step = false; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "receipt_write_true_fails", (candidate) => { candidate.side_effects.receipt_write_performed = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
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
  const checkpointDoc = read(checkpointDocPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).exact_new_trial_30_day_checkpoint;
  const validRecord = readJson(passFixturePath).exact_new_trial_30_day_checkpoint;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_30_day_checkpoint;

  for (const token of [
    "Recommendation: do not enter real generation yet",
    "ready_for_human_choice_not_ready_for_execution",
    "human_approval_missing",
    "30_DAY_EXACT_NEW_TRIAL_CHECKPOINT.md",
    "provider_call_performed: false"
  ]) {
    assert(checkpointDoc.includes(token), `checkpoint doc missing token: ${token}`);
  }
  assert(schema.includes("exact_new_trial_30_day_checkpoint"), "schema must define exact_new_trial_30_day_checkpoint");
  assert(mvp.includes("validate_exact_new_trial_30_day_checkpoint.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_17_30_DAY_EXACT_NEW_TRIAL_CHECKPOINT_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_30_day_checkpoint",
    phase,
    checkpoint_doc_present: true,
    checkpoint_schema_present: true,
    checkpoint_report_present: true,
    checkpoint_fixture_present: true,
    checkpoint_fail_fixture_present: true,
    source_local_preflight_verified: true,
    source_failed_attempt_review_verified: true,
    source_action_packet_verified: true,
    source_noop_gate_verified: true,
    source_human_approval_intake_verified: true,
    checkpoint_id: reportRecord.checkpoint_id,
    readiness_state: reportRecord.readiness_state.readiness_state,
    auditable_preparation_loop_complete: reportRecord.readiness_state.auditable_preparation_loop_complete,
    should_enter_real_generation_now: reportRecord.executive_decision.should_enter_real_generation_now,
    recommendation: reportRecord.executive_decision.recommendation,
    human_choice_captured: reportRecord.readiness_state.human_choice_captured,
    real_generation_authorized_now: reportRecord.readiness_state.real_generation_authorized_now,
    can_execute_now: reportRecord.readiness_state.can_execute_now,
    risk_count: reportRecord.risk_list.length,
    required_risks_present: requiredRisks.every((risk) => reportRecord.risk_list.some((item) => item.risk_id === risk)),
    next_stage_real_generation_requires_new_explicit_step: reportRecord.next_stage_route.real_generation_requires_new_explicit_step,
    real_generation_requires_new_explicit_step: reportRecord.next_stage_route.real_generation_requires_new_explicit_step,
    prompt_package_ref: reportRecord.frozen_trial_package.prompt_package_ref,
    output_directory: reportRecord.frozen_trial_package.output_directory,
    receipt_path: reportRecord.frozen_trial_package.receipt_path,
    registry_path: reportRecord.frozen_trial_package.registry_path,
    review_console_bridge_ref: reportRecord.frozen_trial_package.review_console_bridge_ref,
    provider_route: reportRecord.frozen_trial_package.provider_route,
    exact_call_count: reportRecord.frozen_trial_package.exact_call_count,
    max_image_candidates: reportRecord.frozen_trial_package.max_image_candidates,
    retry_limit: reportRecord.frozen_trial_package.retry_limit,
    overwrite_existing_files_allowed: reportRecord.frozen_trial_package.overwrite_existing_files_allowed,
    secret_value_read_allowed: reportRecord.frozen_trial_package.secret_value_read_allowed,
    metadata_only: reportRecord.boundaries.metadata_only,
    checkpoint_only: reportRecord.boundaries.checkpoint_only,
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
