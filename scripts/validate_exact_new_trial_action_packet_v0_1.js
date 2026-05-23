#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_14_exact_new_trial_action_packet_v0_1";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const actionPacketId = "exact_new_trial_action_packet_v0_1";
const docPath = "docs/V0_6_14_EXACT_NEW_TRIAL_ACTION_PACKET_V0_1.md";
const schemaPath = "schemas/exact_new_trial_action_packet_v0_1.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_14_exact_new_trial_action_packet_v0_1.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_action_packet_v0_1.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_action_packet_v0_1_fail.example.json";
const localPreflightPath = "reports/visual_asset_eval_dry_run/v0_6_12_local_preflight_only_gate.json";
const failedReviewPath = "reports/visual_asset_eval_dry_run/v0_6_13_failed_provider_attempt_review.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const frozenTargets = {
  prompt_package_ref: "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml",
  output_directory: "runs/real_generation/v0_3_3_exact_new_trial_001/",
  receipt_path: "reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json",
  registry_path: "reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json",
  review_console_bridge_ref: "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001"
};

const frozenCommand = {
  provider_target: "codex_builtin_image_generation",
  plugin_id_or_provider_route: "image_gen.imagegen",
  model: "managed_by_codex_image_tool",
  command: "generate"
};

const requiredStopConditions = [
  "missing_human_approval_gate",
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
  "provider_or_image_call_requested_during_freeze",
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
  const localPreflight = readJson(localPreflightPath).exact_new_trial_local_preflight_only_gate;
  const failedReview = readJson(failedReviewPath).exact_new_trial_failed_provider_attempt_review;
  assert(localPreflight.phase === "v0_6_12_local_preflight_only_gate", "local preflight source phase mismatch");
  assert(failedReview.phase === "v0_6_13_failed_provider_attempt_review", "failed review source phase mismatch");
  assert(localPreflight.local_preflight_status?.source_preflight_authorization_consumed === true, "source preflight must be consumed");
  assert(failedReview.review_findings?.failed_attempt_count === 2, "failed review must classify two failed attempts");
  assert(failedReview.review_findings?.cannot_reuse_failed_output_receipt_registry_bridge_paths === true, "failed review must block failed path reuse");
  return { localPreflight, failedReview };
}

function validateNoFailedPathReuse(record, failedReview) {
  const failedPaths = failedReview.non_reusable_paths;
  assert(!failedPaths.prompt_package_refs.includes(record.frozen_targets.prompt_package_ref), "frozen prompt must not reuse failed prompt path");
  assert(!failedPaths.output_directories.includes(record.frozen_targets.output_directory), "frozen output must not reuse failed output directory");
  assert(!failedPaths.receipt_paths.includes(record.frozen_targets.receipt_path), "frozen receipt must not reuse failed receipt path");
  assert(!failedPaths.registry_paths.includes(record.frozen_targets.registry_path), "frozen registry must not reuse failed registry path");
  assert(!failedPaths.review_console_bridge_refs.includes(record.frozen_targets.review_console_bridge_ref), "frozen bridge must not reuse failed bridge ref");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "exact new-trial action packet missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_action_packet_v0_1");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.action_packet_id === actionPacketId, "action_packet_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_local_preflight_ref === localPreflightPath, "source_local_preflight_ref mismatch");
  assert(record.source_failed_provider_attempt_review_ref === failedReviewPath, "source_failed_provider_attempt_review_ref mismatch");
  assert(record.packet_status === "frozen_not_executable", "packet_status must be frozen_not_executable");

  const { localPreflight, failedReview } = loadSources();
  assertSameObject(record.frozen_targets, frozenTargets, "frozen_targets");
  assert(record.frozen_targets.prompt_package_ref === localPreflight.checked_exact_targets.prompt_package_ref, "frozen prompt must match v0.6.12");
  assert(record.frozen_targets.output_directory === localPreflight.checked_exact_targets.output_directory, "frozen output must match v0.6.12");
  assert(record.frozen_targets.receipt_path === localPreflight.checked_exact_targets.receipt_path, "frozen receipt must match v0.6.12");
  assert(record.frozen_targets.registry_path === localPreflight.checked_exact_targets.registry_path, "frozen registry must match v0.6.12");
  assert(record.frozen_targets.review_console_bridge_ref === localPreflight.checked_exact_targets.review_console_bridge_ref, "frozen bridge must match v0.6.12");
  assert(record.frozen_targets.prompt_package_ref === failedReview.next_trial_required_conditions.prompt_package_ref, "frozen prompt must match v0.6.13");
  assert(record.frozen_targets.output_directory === failedReview.next_trial_required_conditions.output_directory, "frozen output must match v0.6.13");
  assert(record.frozen_targets.receipt_path === failedReview.next_trial_required_conditions.receipt_path, "frozen receipt must match v0.6.13");
  assert(record.frozen_targets.registry_path === failedReview.next_trial_required_conditions.registry_path, "frozen registry must match v0.6.13");
  assert(record.frozen_targets.review_console_bridge_ref === failedReview.next_trial_required_conditions.review_console_bridge_ref, "frozen bridge must match v0.6.13");
  assert(fs.existsSync(repoPath(record.frozen_targets.prompt_package_ref)), "frozen prompt package must exist");
  validateNoFailedPathReuse(record, failedReview);

  const command = record.frozen_provider_command;
  assertSameObject(command, frozenCommand, "frozen_provider_command");
  assert(command.exact_call_count === 1, "exact_call_count must remain 1");
  assert(command.max_image_candidates === 1, "max_image_candidates must remain 1");
  assert(command.retry_limit === 0, "retry_limit must remain 0");
  assert(command.review_required_after_generation === true, "review_required_after_generation must remain true");
  assert(command.no_memory_write_default === true, "no_memory_write_default must remain true");
  assert(command.overwrite_existing_files_allowed === false, "overwrite_existing_files_allowed must remain false");
  assert(command.secret_value_read_allowed === false, "secret_value_read_allowed must remain false");
  assert(command.raw_private_data_print_allowed === false, "raw_private_data_print_allowed must remain false");
  assert(command.raw_provider_payload_capture_allowed === false, "raw_provider_payload_capture_allowed must remain false");
  assert(command.raw_provider_response_capture_allowed === false, "raw_provider_response_capture_allowed must remain false");

  const guards = record.execution_guards;
  assert(guards.request_submitted === false, "request_submitted must remain false");
  assert(guards.execute_now === false, "execute_now must remain false");
  assert(guards.can_execute_now === false, "can_execute_now must remain false");
  assert(guards.human_approval_gate_required === true, "human approval gate must be required");
  assert(guards.future_provider_execution_requires_new_explicit_step === true, "future execution must require a new explicit step");
  assert(guards.no_op_runner_required_before_execution === true, "no-op runner must be required before execution");
  assert(guards.preflight_packet_required_before_execution === true, "preflight packet must be required before execution");
  assert(guards.receipt_path_required_before_execution === true, "receipt path must be required before execution");
  assert(guards.rollback_plan_required_before_execution === true, "rollback plan must be required before execution");

  const alignment = record.source_alignment;
  assert(alignment.matches_v0_6_12_checked_targets === true, "must align with v0.6.12 checked targets");
  assert(alignment.matches_v0_6_13_next_trial_required_conditions === true, "must align with v0.6.13 next-trial conditions");
  assert(alignment.failed_attempt_paths_not_reused === true, "must prove failed attempt paths are not reused");
  assert(alignment.safe_portrait_prompt_selected === true, "must select safe portrait prompt");

  assert(Array.isArray(record.stop_conditions), "stop_conditions must be an array");
  for (const condition of requiredStopConditions) {
    assert(record.stop_conditions.includes(condition), `missing stop condition: ${condition}`);
  }
  assert(record.stop_conditions.every((condition) => !/submit_now|execute_now|provider_call_now|image_generation_now/i.test(condition)), "stop conditions must not authorize execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.action_packet_only === true, "action_packet_only must be true");
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
  assert(invalidFixtureCaught, "invalid action-packet fixture must fail");

  const cases = [
    expectFailure(validRecord, "packet_status_executable_fails", (candidate) => { candidate.packet_status = "executable_now"; }),
    expectFailure(validRecord, "prompt_reuses_failed_fails", (candidate) => { candidate.frozen_targets.prompt_package_ref = "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml"; }),
    expectFailure(validRecord, "output_reuses_failed_fails", (candidate) => { candidate.frozen_targets.output_directory = "runs/real_generation/v0_3_3_retry_001_codex_sample/"; }),
    expectFailure(validRecord, "receipt_reuses_failed_fails", (candidate) => { candidate.frozen_targets.receipt_path = "reports/provider_receipts/v0_3_3_retry_001_receipt.json"; }),
    expectFailure(validRecord, "registry_reuses_failed_fails", (candidate) => { candidate.frozen_targets.registry_path = "reports/provider_receipts/provider_receipt_registry.json"; }),
    expectFailure(validRecord, "bridge_reuses_failed_fails", (candidate) => { candidate.frozen_targets.review_console_bridge_ref = "review_console/live_receipt_bridge/v0_3_3_codex_sample_first_trial"; }),
    expectFailure(validRecord, "provider_route_drift_fails", (candidate) => { candidate.frozen_provider_command.plugin_id_or_provider_route = "other.route"; }),
    expectFailure(validRecord, "call_count_widened_fails", (candidate) => { candidate.frozen_provider_command.exact_call_count = 2; }),
    expectFailure(validRecord, "image_candidates_widened_fails", (candidate) => { candidate.frozen_provider_command.max_image_candidates = 2; }),
    expectFailure(validRecord, "retry_limit_widened_fails", (candidate) => { candidate.frozen_provider_command.retry_limit = 1; }),
    expectFailure(validRecord, "review_not_required_fails", (candidate) => { candidate.frozen_provider_command.review_required_after_generation = false; }),
    expectFailure(validRecord, "memory_default_false_fails", (candidate) => { candidate.frozen_provider_command.no_memory_write_default = false; }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => { candidate.frozen_provider_command.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "secret_read_allowed_fails", (candidate) => { candidate.frozen_provider_command.secret_value_read_allowed = true; }),
    expectFailure(validRecord, "raw_payload_capture_allowed_fails", (candidate) => { candidate.frozen_provider_command.raw_provider_payload_capture_allowed = true; }),
    expectFailure(validRecord, "raw_response_capture_allowed_fails", (candidate) => { candidate.frozen_provider_command.raw_provider_response_capture_allowed = true; }),
    expectFailure(validRecord, "request_submitted_fails", (candidate) => { candidate.execution_guards.request_submitted = true; }),
    expectFailure(validRecord, "execute_now_true_fails", (candidate) => { candidate.execution_guards.execute_now = true; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.execution_guards.can_execute_now = true; }),
    expectFailure(validRecord, "human_gate_not_required_fails", (candidate) => { candidate.execution_guards.human_approval_gate_required = false; }),
    expectFailure(validRecord, "future_explicit_step_false_fails", (candidate) => { candidate.execution_guards.future_provider_execution_requires_new_explicit_step = false; }),
    expectFailure(validRecord, "noop_runner_not_required_fails", (candidate) => { candidate.execution_guards.no_op_runner_required_before_execution = false; }),
    expectFailure(validRecord, "alignment_false_fails", (candidate) => { candidate.source_alignment.matches_v0_6_13_next_trial_required_conditions = false; }),
    expectFailure(validRecord, "missing_overwrite_stop_condition_fails", (candidate) => { candidate.stop_conditions = candidate.stop_conditions.filter((item) => item !== "overwrite_requested"); }),
    expectFailure(validRecord, "execution_stop_condition_authorizes_fails", (candidate) => { candidate.stop_conditions.push("execute_now"); }),
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
  const reportRecord = readJson(reportPath).exact_new_trial_action_packet_v0_1;
  const validRecord = readJson(passFixturePath).exact_new_trial_action_packet_v0_1;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_action_packet_v0_1;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    `action_packet_id: ${actionPacketId}`,
    "phase: v0_6_14_exact_new_trial_action_packet_v0_1",
    "packet_status: frozen_not_executable",
    "can_execute_now: false",
    "future_provider_execution_requires_new_explicit_step: true",
    frozenTargets.prompt_package_ref,
    frozenTargets.output_directory,
    frozenTargets.receipt_path,
    frozenTargets.registry_path,
    frozenTargets.review_console_bridge_ref
  ]) {
    assert(doc.includes(token), `action packet doc missing token: ${token}`);
  }

  assert(schema.includes("exact_new_trial_action_packet_v0_1"), "schema must define exact_new_trial_action_packet_v0_1");
  assert(mvp.includes("validate_exact_new_trial_action_packet_v0_1.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_14_EXACT_NEW_TRIAL_ACTION_PACKET_V0_1_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_action_packet_v0_1",
    phase,
    action_packet_doc_present: true,
    action_packet_schema_present: true,
    action_packet_report_present: true,
    action_packet_fixture_present: true,
    action_packet_fail_fixture_present: true,
    authorization_package_id: packageId,
    action_packet_id: actionPacketId,
    packet_status: "frozen_not_executable",
    source_local_preflight_verified: true,
    source_failed_provider_attempt_review_verified: true,
    prompt_package_ref: frozenTargets.prompt_package_ref,
    output_directory: frozenTargets.output_directory,
    receipt_path: frozenTargets.receipt_path,
    registry_path: frozenTargets.registry_path,
    review_console_bridge_ref: frozenTargets.review_console_bridge_ref,
    provider_target: frozenCommand.provider_target,
    plugin_id_or_provider_route: frozenCommand.plugin_id_or_provider_route,
    model: frozenCommand.model,
    command: frozenCommand.command,
    exact_call_count: 1,
    max_image_candidates: 1,
    retry_limit: 0,
    overwrite_existing_files_allowed: false,
    secret_value_read_allowed: false,
    raw_provider_payload_capture_allowed: false,
    raw_provider_response_capture_allowed: false,
    request_submitted: false,
    execute_now: false,
    can_execute_now: false,
    human_approval_gate_required: true,
    no_op_runner_required_before_execution: true,
    future_provider_execution_requires_new_explicit_step: true,
    stop_condition_count: requiredStopConditions.length,
    failed_attempt_paths_not_reused: true,
    metadata_only: true,
    action_packet_only: true,
    no_new_trial_executed: true,
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
