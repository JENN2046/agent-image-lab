#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_226_review_console_six_month_goal_gap_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_226_review_console_six_month_goal_gap_snapshot_static_regression.example.json",
  sourcePanel: "tests/schema_examples/v14_225_review_console_six_month_goal_gap_static_panel.example.json",
  sourcePanelRecord: "docs/v14_225_review_console_six_month_goal_gap_static_panel.md",
  sourceValidator: "scripts/validate_v14_225_review_console_six_month_goal_gap_static_panel.js",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_226_review_console_six_month_goal_gap_snapshot_static_regression",
  sourcePhase: "v14_225_review_console_six_month_goal_gap_static_panel",
  draftOutputKey: "six_month_goal_gap_state",
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function currentBoardBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function evaluate(snapshot, source) {
  const guard = snapshot.guard || {};
  const sourceMonth1 = (source.goals || []).find((goal) => goal.month === 1) || {};
  const sourceMonth5 = (source.goals || []).find((goal) => goal.month === 5) || {};

  const identityOk =
    snapshot.phase === expected.phase &&
    snapshot.snapshot_status === "golden_static_snapshot" &&
    snapshot.source_panel_ref === files.sourcePanel &&
    snapshot.source_panel_record_ref === files.sourcePanelRecord &&
    source.phase === expected.sourcePhase &&
    snapshot.draft_output_key === expected.draftOutputKey &&
    source.draft_output_key === expected.draftOutputKey;

  const goalGapOk =
    snapshot.month_count === 6 &&
    snapshot.month_count === source.month_count &&
    snapshot.complete_recoverable_sample_count === 2 &&
    snapshot.complete_recoverable_sample_count === source.complete_recoverable_sample_count &&
    snapshot.required_full_recoverable_sample_count === 3 &&
    snapshot.required_full_recoverable_sample_count === source.required_full_recoverable_sample_count &&
    snapshot.remaining_full_recoverable_sample_gap === 1 &&
    snapshot.remaining_full_recoverable_sample_gap === source.remaining_full_recoverable_sample_gap &&
    snapshot.hard_acceptance_three_full_samples_met === false &&
    snapshot.hard_acceptance_three_full_samples_met === source.hard_acceptance_three_full_samples_met &&
    snapshot.pending_candidate_counted_as_accepted === false &&
    snapshot.pending_candidate_counted_as_accepted === source.pending_candidate_counted_as_accepted &&
    snapshot.overall_status === "month_1_blocked_by_third_sample_human_approval" &&
    snapshot.overall_status === source.overall_status &&
    snapshot.vcp_runtime_integration_proven_month_count === 0 &&
    snapshot.vcp_runtime_integration_proven_month_count === source.vcp_runtime_integration_proven_month_count &&
    snapshot.month_1_status === "blocked_by_human_approval_missing" &&
    snapshot.month_1_status === sourceMonth1.status &&
    snapshot.month_5_status === "blocked_requires_jenn_A5" &&
    snapshot.month_5_status === sourceMonth5.status;

  const noWrites =
    guard.static_snapshot_only === true &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.dry_run_adapter_is_not_vcp_runtime_integration === true &&
    guard.review_console_static_read_is_not_vcp_runtime_integration === true &&
    guard.authorization_package_draft_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && goalGapOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    goalGapOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).review_console_six_month_goal_gap_snapshot_static_regression;
const source = core.parseJson(files.sourcePanel).review_console_six_month_goal_gap_static_panel;
const phaseRecord = core.read(files.phaseRecord);
const app = core.read(files.app);
const readme = core.read(files.readme);
const currentSurfaces = [
  Object.values(files).join("\n"),
  phaseRecord,
  JSON.stringify(snapshot, null, 2),
  app,
  readme,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(snapshot, source);
addResult("six_month_goal_gap_snapshot_evaluation_passes", baseEval.passed);

const month1Overclaim = clone(snapshot);
month1Overclaim.complete_recoverable_sample_count = 3;
month1Overclaim.remaining_full_recoverable_sample_gap = 0;
month1Overclaim.hard_acceptance_three_full_samples_met = true;
month1Overclaim.month_1_status = "met";
const pendingAccepted = clone(snapshot);
pendingAccepted.pending_candidate_counted_as_accepted = true;
const acceptedWrite = clone(snapshot);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(snapshot);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(snapshot);
runtimeClaim.vcp_runtime_integration_proven_month_count = 1;
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.dry_run_adapter_is_not_vcp_runtime_integration = false;
const missingMonth = clone(snapshot);
missingMonth.month_count = 5;

const month1OverclaimEval = evaluate(month1Overclaim, source);
const pendingAcceptedEval = evaluate(pendingAccepted, source);
const acceptedWriteEval = evaluate(acceptedWrite, source);
const externalActionEval = evaluate(externalAction, source);
const runtimeClaimEval = evaluate(runtimeClaim, source);
const missingMonthEval = evaluate(missingMonth, source);

addResult("negative_case_month_1_overclaim_fails", month1OverclaimEval.passed === false && month1OverclaimEval.goalGapOk === false);
addResult("negative_case_pending_candidate_counted_as_accepted_fails", pendingAcceptedEval.passed === false && pendingAcceptedEval.goalGapOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_missing_month_count_fails", missingMonthEval.passed === false && missingMonthEval.goalGapOk === false);

for (const token of [
  "sixMonthGoalGapState",
  "six_month_goal_gap_state",
  "renderSixMonthGoalGap",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "v14.226",
  "six_month_goal_gap_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "v14_226_review_console_six_month_goal_gap_snapshot_static_regression",
  "docs/v14_226_review_console_six_month_goal_gap_snapshot_static_regression.md",
  "tests/schema_examples/v14_226_review_console_six_month_goal_gap_snapshot_static_regression.example.json",
  "scripts/validate_v14_226_review_console_six_month_goal_gap_snapshot_static_regression.js",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_226_review_console_six_month_goal_gap_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: snapshot.phase,
  snapshot_status: snapshot.snapshot_status,
  draft_output_key: snapshot.draft_output_key,
  month_count: snapshot.month_count,
  complete_recoverable_sample_count: snapshot.complete_recoverable_sample_count,
  required_full_recoverable_sample_count: snapshot.required_full_recoverable_sample_count,
  remaining_full_recoverable_sample_gap: snapshot.remaining_full_recoverable_sample_gap,
  hard_acceptance_three_full_samples_met: snapshot.hard_acceptance_three_full_samples_met,
  pending_candidate_counted_as_accepted: snapshot.pending_candidate_counted_as_accepted,
  overall_status: snapshot.overall_status,
  vcp_runtime_integration_proven_month_count: snapshot.vcp_runtime_integration_proven_month_count,
  month_1_status: snapshot.month_1_status,
  month_5_status: snapshot.month_5_status,
  accepted_samples_write_performed: snapshot.guard.accepted_samples_write_performed,
  production_candidate_write_performed: snapshot.guard.production_candidate_write_performed,
  daily_note_write_performed: snapshot.guard.DailyNote_write_performed,
  vcp_memory_write_performed: snapshot.guard.VCP_memory_write_performed,
  provider_contact_performed: snapshot.guard.provider_contact_performed,
  plugin_call_performed: snapshot.guard.plugin_call_performed,
  api_call_performed: snapshot.guard.api_call_performed,
  mcp_runtime_performed: snapshot.guard.mcp_runtime_performed,
  image_generation_performed: snapshot.guard.image_generation_performed,
  env_or_secret_read_performed: snapshot.guard.env_or_secret_read_performed,
  real_manifest_read_performed: snapshot.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: snapshot.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: snapshot.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: snapshot.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: snapshot.guard.vcp_runtime_integration_proven,
  negative_case_month_1_overclaim_fails: month1OverclaimEval.passed === false && month1OverclaimEval.goalGapOk === false,
  negative_case_pending_candidate_counted_as_accepted_fails: pendingAcceptedEval.passed === false && pendingAcceptedEval.goalGapOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_missing_month_count_fails: missingMonthEval.passed === false && missingMonthEval.goalGapOk === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
