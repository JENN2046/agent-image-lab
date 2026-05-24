#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_62_EXACT_NEW_TRIAL_003_AMBER_C_MEMORY_WRITE_TARGET_RESOLUTION_BLOCKED.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_62_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked.json",
  receipt: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_amber_c_memory_write_target_resolution_blocked.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_amber_c_memory_write_target_resolution_blocked.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_amber_c_memory_write_target_resolution_blocked_fail.example.json",
  readinessReport: "reports/visual_asset_eval_dry_run/v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write.json",
  readinessPacket: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_chinese_memory_entry_readiness_preflight_no_write.json",
  dailynoteCloseout: "docs/212_v10_26_real_dailynote_write_closeout.md",
  rootCorrection: "docs/213_v10_27_dailynotewrite_root_path_correction.md",
  canonicalGuard: "docs/214_v10_28_dailynote_canonical_location_guard.md",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_62_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked",
  sourcePhase: "v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  approvedBy: "Jenn",
  artifactSha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  attemptedTask: "execute_exact_new_trial_003_chinese_memory_entry_amber_c_memory_write_with_receipt_if_exact_writer_target_is_resolved",
  blockedItemId: "exact_memory_writer_target_unresolved_without_secret_or_broad_vcp_write",
  recommendedNext: "provide_or_install_exact_non_secret_dailynote_vcp_memory_writer_target_then_retry_amber_c_memory_write"
};

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

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoRawLocalDrivePath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawLocalDrivePath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawLocalDrivePath(item, `${context}.${key}`));
  }
}

function commonChecks(record) {
  const auth = record.authorization_reconciliation || {};
  const resolution = record.target_resolution || {};
  const toolSurface = record.tool_surface_evidence || {};
  const canonical = record.canonical_write_guard_requirements || {};
  const blocked = record.blocked_red_item || {};
  const guard = record.guard || {};
  const unblock = record.unblock_condition || {};
  const target = record.target || {};

  return (
    record.version === "v1" &&
    record.phase === expected.phase &&
    record.status === "blocked_red_lane_exact_memory_writer_target_unresolved_no_write" &&
    record.execution_mode === "amber_c_memory_write_target_resolution_probe_no_write" &&
    record.lane_attempted === "Amber_C_memory" &&
    record.lane_executed === "Green_status_sync_only" &&
    record.source_phase === expected.sourcePhase &&
    record.attempted_next_safe_task === expected.attemptedTask &&
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.approved_by === expected.approvedBy &&
    target.artifact_sha256 === expected.artifactSha256 &&
    auth.active_autonomy_model === "Smart Standing Authorization v3" &&
    auth.real_class_authorization_default_allowed === true &&
    auth.step_by_step_auth_request_required === false &&
    auth.authorization_missing_is_blocker === false &&
    auth.amber_memory_write_packet_present === true &&
    resolution.exact_memory_targets_package_present === true &&
    resolution.payload_ready === true &&
    resolution.repo_callable_writer_script_found === false &&
    resolution.available_connector_writer_found === false &&
    resolution.selected_writer_tool_or_command === null &&
    resolution.selected_plugin_id === null &&
    resolution.exact_writer_target_resolved === false &&
    resolution.writer_target_resolution_missing_is_blocker === true &&
    toolSurface.repository_search_performed === true &&
    toolSurface.deferred_tool_search_performed === true &&
    toolSurface.daily_note_writer_connector_found === false &&
    toolSurface.vcp_memory_writer_connector_found === false &&
    Array.isArray(toolSurface.matched_tools_summary) &&
    toolSurface.matched_tools_summary.some((item) => item.includes("no DailyNote")) &&
    canonical.historical_dailynote_write_closeout_present === true &&
    canonical.dailynote_root_path_correction_present === true &&
    canonical.dailynote_canonical_location_guard_present === true &&
    canonical.writer_root_preflight_required === "vcp_root_dailynote" &&
    canonical.post_write_canonical_target_required === true &&
    canonical.post_write_canonical_hash_required === true &&
    canonical.plugin_success_alone_sufficient === false &&
    blocked.blocked_red_item_id === expected.blockedItemId &&
    blocked.red_lane_stop_condition_reached === true &&
    blocked.authorization_missing_is_blocker === false &&
    blocked.capability_or_target_resolution_missing === true &&
    blocked.next_auto_step_allowed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.secret_value_read_performed === false &&
    guard.raw_private_data_printed === false &&
    guard.raw_external_path_read_or_printed === false &&
    guard.broad_vcp_write_performed === false &&
    guard.tag_release_deploy_performed === false &&
    guard.destructive_action_performed === false &&
    unblock.requires_exact_non_secret_writer_target === true &&
    unblock.requires_selected_writer_tool_or_command === true &&
    unblock.requires_canonical_root_preflight === true &&
    unblock.requires_post_write_canonical_hash_validation === true &&
    unblock.max_write_entries === 2 &&
    unblock.max_plugin_calls === 1 &&
    unblock.max_api_calls === 0 &&
    unblock.secret_value_read_allowed === false &&
    unblock.raw_private_data_print_allowed === false &&
    record.recommended_next === expected.recommendedNext &&
    record.recommended_next_auto_execution_allowed === false
  );
}

function validateSourceRefs(record) {
  const refs = record.source_refs || {};
  assert(refs.readiness_report === files.readinessReport, "readiness report ref mismatch");
  assert(refs.readiness_packet === files.readinessPacket, "readiness packet ref mismatch");
  assert(refs.historical_dailynote_write_closeout === files.dailynoteCloseout, "DailyNote closeout ref mismatch");
  assert(refs.dailynote_root_path_correction === files.rootCorrection, "root correction ref mismatch");
  assert(refs.dailynote_canonical_location_guard === files.canonicalGuard, "canonical guard ref mismatch");

  const readiness = readJson(files.readinessReport).exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write;
  const packet = readJson(files.readinessPacket).chinese_memory_entry_readiness_preflight_no_write;
  assert(readiness.readiness.go_allowed_next_amber_memory_packet === true, "v0.6.61 readiness must allow next Amber packet");
  assert(packet.routing_decision.next_safe_task_lane === "Amber_C_memory", "v0.6.61 packet must route to Amber_C_memory");
  assert(read(files.dailynoteCloseout).includes("DailyNote"), "historical DailyNote closeout must be present");
  assert(read(files.rootCorrection).includes("root"), "root correction doc must be present");
  assert(read(files.canonicalGuard).includes("canonical"), "canonical guard doc must be present");
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "red_lane_stop_receipt_for_amber_c_memory_write_target_resolution", "receipt type mismatch");
  assert(receipt.status === "blocked_red_lane_exact_memory_writer_target_unresolved_no_write", "receipt status mismatch");
  assert(receipt.lane_attempted === "Amber_C_memory", "receipt attempted lane mismatch");
  assert(receipt.lane_executed === "Green_status_sync_only", "receipt executed lane mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.target_sample_id === expected.sampleId, "receipt sample mismatch");
  assert(receipt.target_candidate_id === expected.candidateId, "receipt candidate mismatch");
  assert(receipt.artifact_sha256 === expected.artifactSha256, "receipt hash mismatch");
  assert(receipt.authorization_missing_is_blocker === false, "authorization must not be blocker");
  assert(receipt.red_lane_stop_condition_reached === true, "receipt must record Red stop");
  assert(receipt.blocked_red_item_id === expected.blockedItemId, "receipt blocker mismatch");
  assert(receipt.calls_used.plugin_calls === 0 && receipt.calls_used.memory_write_entries === 0, "receipt must record zero calls/writes");
  assert(receipt.writer_resolution_result.exact_writer_target_resolved === false, "receipt must not resolve writer");
  assert(receipt.guard.DailyNote_write_performed === false, "receipt must not write DailyNote");
  assert(receipt.guard.VCP_memory_write_performed === false, "receipt must not write VCP memory");
  assert(receipt.guard.secret_value_read_performed === false, "receipt must not read secrets");
  assert(receipt.next_auto_step_allowed === false, "receipt next auto step must be blocked");
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(commonChecks(record), `${context} common checks failed`);
  validateSourceRefs(record);
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).exact_new_trial_003_amber_c_memory_write_target_resolution_blocked;
  const receipt = readJson(files.receipt).amber_c_memory_write_target_resolution_blocked;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_amber_c_memory_write_target_resolution_blocked;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_amber_c_memory_write_target_resolution_blocked;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "authorization_missing_is_blocker: false",
    "writer_target_resolution_missing_is_blocker: true",
    "red_lane_stop_condition_reached: true",
    "DailyNote_write_performed: false",
    expected.recommendedNext
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_amber_c_memory_write_target_resolution_blocked.js"),
    "validate_mvp missing v0.6.62 validator"
  );

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  validateReceipt(receipt);

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "authorization_missing_overclaim_fails", (candidate) => {
      candidate.authorization_reconciliation.authorization_missing_is_blocker = true;
    }),
    expectFailure(passFixture, "writer_found_overclaim_fails", (candidate) => {
      candidate.target_resolution.exact_writer_target_resolved = true;
      candidate.target_resolution.repo_callable_writer_script_found = true;
    }),
    expectFailure(passFixture, "connector_found_overclaim_fails", (candidate) => {
      candidate.tool_surface_evidence.daily_note_writer_connector_found = true;
    }),
    expectFailure(passFixture, "plugin_success_alone_fails", (candidate) => {
      candidate.canonical_write_guard_requirements.plugin_success_alone_sufficient = true;
    }),
    expectFailure(passFixture, "canonical_hash_not_required_fails", (candidate) => {
      candidate.canonical_write_guard_requirements.post_write_canonical_hash_required = false;
    }),
    expectFailure(passFixture, "red_stop_missing_fails", (candidate) => {
      candidate.blocked_red_item.red_lane_stop_condition_reached = false;
    }),
    expectFailure(passFixture, "dailynote_write_claim_fails", (candidate) => {
      candidate.guard.DailyNote_write_performed = true;
    }),
    expectFailure(passFixture, "vcp_memory_write_claim_fails", (candidate) => {
      candidate.guard.VCP_memory_write_performed = true;
    }),
    expectFailure(passFixture, "secret_read_claim_fails", (candidate) => {
      candidate.guard.secret_value_read_performed = true;
    }),
    expectFailure(passFixture, "next_auto_allowed_fails", (candidate) => {
      candidate.recommended_next_auto_execution_allowed = true;
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    lane_attempted: report.lane_attempted,
    lane_executed: report.lane_executed,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    authorization_missing_is_blocker: report.authorization_reconciliation.authorization_missing_is_blocker,
    writer_target_resolution_missing_is_blocker: report.target_resolution.writer_target_resolution_missing_is_blocker,
    exact_writer_target_resolved: report.target_resolution.exact_writer_target_resolved,
    repo_callable_writer_script_found: report.target_resolution.repo_callable_writer_script_found,
    available_connector_writer_found: report.target_resolution.available_connector_writer_found,
    red_lane_stop_condition_reached: report.blocked_red_item.red_lane_stop_condition_reached,
    DailyNote_write_performed: report.guard.DailyNote_write_performed,
    VCP_memory_write_performed: report.guard.VCP_memory_write_performed,
    plugin_call_performed: report.guard.plugin_call_performed,
    api_call_performed: report.guard.api_call_performed,
    secret_value_read_performed: report.guard.secret_value_read_performed,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    recommended_next: report.recommended_next,
    recommended_next_auto_execution_allowed: report.recommended_next_auto_execution_allowed
  };

  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
