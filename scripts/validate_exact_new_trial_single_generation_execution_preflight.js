#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_18_single_generation_execution_preflight";
const preflightId = "single_generation_execution_preflight_v0_1";
const docPath = "docs/V0_6_18_SINGLE_GENERATION_EXECUTION_PREFLIGHT.md";
const schemaPath = "schemas/exact_new_trial_single_generation_execution_preflight.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_18_single_generation_execution_preflight.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_single_generation_execution_preflight.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_single_generation_execution_preflight_fail.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const sourcePaths = {
  checkpoint_ref: "30_DAY_EXACT_NEW_TRIAL_CHECKPOINT.md",
  checkpoint_report_ref: "reports/visual_asset_eval_dry_run/v0_6_17_30_day_exact_new_trial_checkpoint.json",
  action_packet_ref: "reports/visual_asset_eval_dry_run/v0_6_14_exact_new_trial_action_packet_v0_1.json",
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
  command: "generate",
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

const requiredAuthorizationTokens = [
  "authorize_one_real_generation",
  expectedPackage.authorization_package_id,
  expectedPackage.prompt_package_ref,
  expectedPackage.output_directory,
  expectedPackage.receipt_path,
  expectedPackage.registry_path,
  expectedPackage.review_console_bridge_ref,
  expectedPackage.provider_route,
  "1 call",
  "1 candidate",
  "0 retry",
  "no overwrite",
  "no secret read",
  "no raw provider payload capture",
  "no raw provider response capture",
  "review required",
  "no automatic accepted-sample promotion",
  "no memory write",
  "no push"
];

const requiredStopConditions = [
  "missing_exact_human_authorization",
  "authorization_phrase_missing_required_token",
  "output_directory_already_exists",
  "receipt_path_already_exists",
  "registry_path_already_exists",
  "review_console_bridge_already_exists",
  "prompt_package_missing",
  "retry_limit_not_zero",
  "candidate_limit_greater_than_one",
  "overwrite_allowed",
  "secret_read_requested",
  "raw_provider_capture_requested",
  "review_after_generation_not_required",
  "memory_or_DailyNote_write_requested",
  "accepted_sample_or_production_promotion_requested",
  "commit_push_tag_release_or_deploy_requested"
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

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
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

function assertIncludesAll(actual, expected, context) {
  assert(Array.isArray(actual), `${context} must be an array`);
  for (const value of expected) {
    assert(actual.includes(value), `${context} missing: ${value}`);
  }
}

function validateSources() {
  const checkpointDoc = read(sourcePaths.checkpoint_ref);
  const checkpoint = readJson(sourcePaths.checkpoint_report_ref).exact_new_trial_30_day_checkpoint;
  const actionPacket = readJson(sourcePaths.action_packet_ref).exact_new_trial_action_packet_v0_1;
  const intake = readJson(sourcePaths.human_approval_intake_ref).exact_new_trial_human_approval_intake_validator;

  assert(checkpointDoc.includes("Recommendation: do not enter real generation yet"), "checkpoint doc must block direct real generation");
  assert(checkpoint.phase === "v0_6_17_30_day_exact_new_trial_checkpoint", "v0.6.17 checkpoint phase mismatch");
  assert(checkpoint.readiness_state?.auditable_preparation_loop_complete === true, "v0.6.17 loop must be complete");
  assert(checkpoint.executive_decision?.recommendation === "do_not_enter_real_generation_yet", "v0.6.17 must recommend not entering generation yet");
  assert(checkpoint.readiness_state?.can_execute_now === false, "v0.6.17 must block execution");
  assert(actionPacket.phase === "v0_6_14_exact_new_trial_action_packet_v0_1", "v0.6.14 source phase mismatch");
  assert(actionPacket.packet_status === "frozen_not_executable", "v0.6.14 packet must remain frozen");
  assert(intake.phase === "v0_6_16_exact_new_trial_human_approval_intake_validator", "v0.6.16 source phase mismatch");
  assert(intake.intake_state?.current_user_choice === "not_captured", "v0.6.16 must not capture user choice");
  assert(intake.intake_state?.can_execute_now === false, "v0.6.16 must block execution");

  return { checkpoint, actionPacket, intake };
}

function validateRecord(record) {
  assert(record && typeof record === "object", "execution preflight record missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_single_generation_execution_preflight");
  assert(record.preflight_id === preflightId, "preflight_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");

  for (const [key, value] of Object.entries(sourcePaths)) {
    assert(record.source_refs?.[key] === value, `source_refs.${key} mismatch`);
  }

  const sources = validateSources();
  assertSameObject(record.frozen_execution_package, expectedPackage, "frozen_execution_package");
  assert(record.frozen_execution_package.prompt_package_ref === sources.checkpoint.frozen_trial_package.prompt_package_ref, "preflight prompt must match checkpoint");
  assert(record.frozen_execution_package.output_directory === sources.actionPacket.frozen_targets.output_directory, "preflight output must match action packet");
  assert(record.frozen_execution_package.receipt_path === sources.actionPacket.frozen_targets.receipt_path, "preflight receipt must match action packet");
  assert(record.frozen_execution_package.registry_path === sources.actionPacket.frozen_targets.registry_path, "preflight registry must match action packet");
  assert(record.frozen_execution_package.review_console_bridge_ref === sources.actionPacket.frozen_targets.review_console_bridge_ref, "preflight bridge must match action packet");

  const authorization = record.authorization_state;
  assert(authorization.readiness_state === "preflight_ready_waiting_for_exact_execution_authorization", "readiness_state mismatch");
  assert(authorization.execution_preflight_ready === true, "execution_preflight_ready must be true");
  assert(authorization.exact_real_generation_authorization_captured === false, "exact authorization must not be captured");
  assert(authorization.authorization_phrase_captured === false, "authorization phrase must not be captured");
  assert(authorization.human_approval_status === "pending_exact_execution_authorization", "human approval status mismatch");
  assert(authorization.provider_call_allowed_now === false, "provider call must not be allowed now");
  assert(authorization.image_generation_allowed_now === false, "image generation must not be allowed now");
  assert(authorization.can_execute_now === false, "can_execute_now must remain false");

  const pathCheck = record.path_collision_preflight;
  assert(pathCheck.paths_checked === true, "paths_checked must be true");
  assert(pathCheck.prompt_package_exists === true, "prompt package must exist");
  assert(pathCheck.output_directory_exists === false, "output directory must not already exist");
  assert(pathCheck.receipt_path_exists === false, "receipt path must not already exist");
  assert(pathCheck.registry_path_exists === false, "registry path must not already exist");
  assert(pathCheck.review_console_bridge_exists === false, "review bridge must not already exist");
  assert(pathCheck.target_paths_clear_now === true, "target paths must be clear now");
  assert(pathCheck.recheck_required_immediately_before_execution === true, "execution must require immediate recheck");
  assert(exists(record.frozen_execution_package.prompt_package_ref) === true, "prompt package is missing on disk");

  assertIncludesAll(record.required_authorization_tokens, requiredAuthorizationTokens, "required_authorization_tokens");
  assertIncludesAll(record.stop_conditions, requiredStopConditions, "stop_conditions");

  const next = record.next_route;
  assert(next.recommended_next === "wait_for_exact_authorize_one_real_generation", "recommended_next mismatch");
  assert(next.if_authorization_captured === "rerun_preflight_immediately_before_provider_call", "authorization route mismatch");
  assert(next.if_any_preflight_drift === "stop_before_provider_call", "drift route mismatch");
  assert(next.real_generation_requires_separate_explicit_authorization === true, "real generation must require separate explicit authorization");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.execution_preflight_only === true, "execution_preflight_only must be true");
  assert(record.boundaries?.no_provider_contact === true, "no_provider_contact must be true");
  assert(record.boundaries?.no_image_generation === true, "no_image_generation must be true");
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
  assert(invalidFixtureCaught, "invalid execution preflight fixture must fail");

  const cases = [
    expectFailure(validRecord, "source_ref_drift_fails", (candidate) => { candidate.source_refs.checkpoint_report_ref = "reports/other.json"; }),
    expectFailure(validRecord, "readiness_execute_now_fails", (candidate) => { candidate.authorization_state.readiness_state = "ready_for_execution"; }),
    expectFailure(validRecord, "preflight_not_ready_fails", (candidate) => { candidate.authorization_state.execution_preflight_ready = false; }),
    expectFailure(validRecord, "exact_authorization_true_fails", (candidate) => { candidate.authorization_state.exact_real_generation_authorization_captured = true; }),
    expectFailure(validRecord, "authorization_phrase_true_fails", (candidate) => { candidate.authorization_state.authorization_phrase_captured = true; }),
    expectFailure(validRecord, "provider_allowed_true_fails", (candidate) => { candidate.authorization_state.provider_call_allowed_now = true; }),
    expectFailure(validRecord, "image_allowed_true_fails", (candidate) => { candidate.authorization_state.image_generation_allowed_now = true; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.authorization_state.can_execute_now = true; }),
    expectFailure(validRecord, "prompt_drift_fails", (candidate) => { candidate.frozen_execution_package.prompt_package_ref = "prompts/image_generation/other.yaml"; }),
    expectFailure(validRecord, "output_drift_fails", (candidate) => { candidate.frozen_execution_package.output_directory = "runs/real_generation/other/"; }),
    expectFailure(validRecord, "provider_route_drift_fails", (candidate) => { candidate.frozen_execution_package.provider_route = "other.route"; }),
    expectFailure(validRecord, "call_count_widened_fails", (candidate) => { candidate.frozen_execution_package.exact_call_count = 2; }),
    expectFailure(validRecord, "candidate_count_widened_fails", (candidate) => { candidate.frozen_execution_package.max_image_candidates = 2; }),
    expectFailure(validRecord, "retry_widened_fails", (candidate) => { candidate.frozen_execution_package.retry_limit = 1; }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => { candidate.frozen_execution_package.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "secret_allowed_fails", (candidate) => { candidate.frozen_execution_package.secret_value_read_allowed = true; }),
    expectFailure(validRecord, "raw_payload_capture_allowed_fails", (candidate) => { candidate.frozen_execution_package.raw_provider_payload_capture_allowed = true; }),
    expectFailure(validRecord, "review_not_required_fails", (candidate) => { candidate.frozen_execution_package.review_required_after_generation = false; }),
    expectFailure(validRecord, "paths_unchecked_fails", (candidate) => { candidate.path_collision_preflight.paths_checked = false; }),
    expectFailure(validRecord, "prompt_missing_fails", (candidate) => { candidate.path_collision_preflight.prompt_package_exists = false; }),
    expectFailure(validRecord, "output_exists_fails", (candidate) => { candidate.path_collision_preflight.output_directory_exists = true; }),
    expectFailure(validRecord, "receipt_exists_fails", (candidate) => { candidate.path_collision_preflight.receipt_path_exists = true; }),
    expectFailure(validRecord, "registry_exists_fails", (candidate) => { candidate.path_collision_preflight.registry_path_exists = true; }),
    expectFailure(validRecord, "bridge_exists_fails", (candidate) => { candidate.path_collision_preflight.review_console_bridge_exists = true; }),
    expectFailure(validRecord, "targets_not_clear_fails", (candidate) => { candidate.path_collision_preflight.target_paths_clear_now = false; }),
    expectFailure(validRecord, "recheck_not_required_fails", (candidate) => { candidate.path_collision_preflight.recheck_required_immediately_before_execution = false; }),
    expectFailure(validRecord, "missing_authorization_token_fails", (candidate) => { candidate.required_authorization_tokens = candidate.required_authorization_tokens.filter((token) => token !== "no secret read"); }),
    expectFailure(validRecord, "missing_stop_condition_fails", (candidate) => { candidate.stop_conditions = candidate.stop_conditions.filter((item) => item !== "missing_exact_human_authorization"); }),
    expectFailure(validRecord, "recommended_execute_now_fails", (candidate) => { candidate.next_route.recommended_next = "execute_now"; }),
    expectFailure(validRecord, "drift_route_ignores_fails", (candidate) => { candidate.next_route.if_any_preflight_drift = "ignore"; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "receipt_write_true_fails", (candidate) => { candidate.side_effects.receipt_write_performed = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.preflight_id = "C:\\private\\preflight.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.preflight_id = ".env.local"; })
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
  const reportRecord = readJson(reportPath).exact_new_trial_single_generation_execution_preflight;
  const validRecord = readJson(passFixturePath).exact_new_trial_single_generation_execution_preflight;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_single_generation_execution_preflight;

  for (const token of [
    "preflight_ready_waiting_for_exact_execution_authorization",
    "execution_preflight_ready: true",
    "provider_call_allowed_now: false",
    "can_execute_now: false",
    "v0_6_18_single_generation_execution_preflight"
  ]) {
    assert(doc.includes(token), `execution preflight doc missing token: ${token}`);
  }
  assert(schema.includes("exact_new_trial_single_generation_execution_preflight"), "schema must define execution preflight root key");
  assert(mvp.includes("validate_exact_new_trial_single_generation_execution_preflight.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_18_SINGLE_GENERATION_EXECUTION_PREFLIGHT_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_single_generation_execution_preflight",
    phase,
    preflight_doc_present: true,
    preflight_schema_present: true,
    preflight_report_present: true,
    preflight_fixture_present: true,
    preflight_fail_fixture_present: true,
    source_checkpoint_verified: true,
    source_action_packet_verified: true,
    source_human_approval_intake_verified: true,
    preflight_id: reportRecord.preflight_id,
    readiness_state: reportRecord.authorization_state.readiness_state,
    execution_preflight_ready: reportRecord.authorization_state.execution_preflight_ready,
    exact_real_generation_authorization_captured: reportRecord.authorization_state.exact_real_generation_authorization_captured,
    authorization_phrase_captured: reportRecord.authorization_state.authorization_phrase_captured,
    provider_call_allowed_now: reportRecord.authorization_state.provider_call_allowed_now,
    image_generation_allowed_now: reportRecord.authorization_state.image_generation_allowed_now,
    can_execute_now: reportRecord.authorization_state.can_execute_now,
    prompt_package_ref: reportRecord.frozen_execution_package.prompt_package_ref,
    output_directory: reportRecord.frozen_execution_package.output_directory,
    receipt_path: reportRecord.frozen_execution_package.receipt_path,
    registry_path: reportRecord.frozen_execution_package.registry_path,
    review_console_bridge_ref: reportRecord.frozen_execution_package.review_console_bridge_ref,
    provider_route: reportRecord.frozen_execution_package.provider_route,
    exact_call_count: reportRecord.frozen_execution_package.exact_call_count,
    max_image_candidates: reportRecord.frozen_execution_package.max_image_candidates,
    retry_limit: reportRecord.frozen_execution_package.retry_limit,
    overwrite_existing_files_allowed: reportRecord.frozen_execution_package.overwrite_existing_files_allowed,
    secret_value_read_allowed: reportRecord.frozen_execution_package.secret_value_read_allowed,
    paths_checked: reportRecord.path_collision_preflight.paths_checked,
    prompt_package_exists: reportRecord.path_collision_preflight.prompt_package_exists,
    output_directory_exists: reportRecord.path_collision_preflight.output_directory_exists,
    receipt_path_exists: reportRecord.path_collision_preflight.receipt_path_exists,
    registry_path_exists: reportRecord.path_collision_preflight.registry_path_exists,
    review_console_bridge_exists: reportRecord.path_collision_preflight.review_console_bridge_exists,
    target_paths_clear_now: reportRecord.path_collision_preflight.target_paths_clear_now,
    required_authorization_token_count: reportRecord.required_authorization_tokens.length,
    stop_condition_count: reportRecord.stop_conditions.length,
    real_generation_requires_separate_explicit_authorization: reportRecord.next_route.real_generation_requires_separate_explicit_authorization,
    metadata_only: reportRecord.boundaries.metadata_only,
    execution_preflight_only: reportRecord.boundaries.execution_preflight_only,
    no_provider_contact: reportRecord.boundaries.no_provider_contact,
    no_image_generation: reportRecord.boundaries.no_image_generation,
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
