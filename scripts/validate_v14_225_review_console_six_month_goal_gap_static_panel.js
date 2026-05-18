#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_225_review_console_six_month_goal_gap_static_panel.md",
  fixture: "tests/schema_examples/v14_225_review_console_six_month_goal_gap_static_panel.example.json",
  sourceMatrix: "tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json",
  sourceSchemaSnapshot: "tests/schema_examples/v14_224_review_console_schema_binding_coverage_snapshot_static_regression.example.json",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_225_review_console_six_month_goal_gap_static_panel",
  executionMode: "review_console_static_six_month_goal_gap_only",
  draftOutputKey: "six_month_goal_gap_state",
  monthObjectives: [
    "three_full_recoverable_accepted_samples",
    "review_console_static_productization",
    "authorization_control_layer",
    "vcp_dry_run_adapter_productization",
    "authorized_real_integration_pilot",
    "v1_visual_production_control_layer_closeout",
  ],
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

function evaluate(panel, matrix, schemaSnapshot) {
  const guard = panel.guard || {};
  const goals = panel.goals || [];
  const month1 = goals.find((goal) => goal.month === 1) || {};
  const month2 = goals.find((goal) => goal.month === 2) || {};
  const month5 = goals.find((goal) => goal.month === 5) || {};

  const identityOk =
    panel.phase === expected.phase &&
    panel.execution_mode === expected.executionMode &&
    panel.draft_output_key === expected.draftOutputKey &&
    panel.source_recoverability_matrix_ref === files.sourceMatrix &&
    panel.source_schema_binding_snapshot_ref === files.sourceSchemaSnapshot;

  const monthMapOk =
    panel.month_count === 6 &&
    goals.length === 6 &&
    expected.monthObjectives.every((objective) => goals.some((goal) => goal.objective === objective)) &&
    goals.every((goal, index) => goal.month === index + 1) &&
    goals.every((goal) => Array.isArray(goal.evidence_refs) && typeof goal.status === "string");

  const recoverabilityOk =
    panel.complete_recoverable_sample_count === 2 &&
    panel.complete_recoverable_sample_count === matrix.complete_recoverable_sample_count &&
    panel.required_full_recoverable_sample_count === 3 &&
    panel.required_full_recoverable_sample_count === matrix.required_full_recoverable_sample_count &&
    panel.remaining_full_recoverable_sample_gap === 1 &&
    panel.remaining_full_recoverable_sample_gap === matrix.remaining_full_recoverable_sample_gap &&
    panel.hard_acceptance_three_full_samples_met === false &&
    panel.hard_acceptance_three_full_samples_met === matrix.hard_acceptance_three_full_samples_met &&
    panel.pending_candidate_counted_as_accepted === false &&
    panel.pending_candidate_counted_as_accepted === matrix.pending_candidate_counted_as_accepted &&
    month1.status === "blocked_by_human_approval_missing" &&
    month1.proven_count === 2 &&
    month1.required_count === 3 &&
    month1.remaining_gap === 1 &&
    month1.blocker === "human_approval_missing";

  const staticProgressOk =
    month2.status === "in_progress_static_read_only" &&
    schemaSnapshot.schema_binding_coverage_complete === true &&
    month5.status === "blocked_requires_jenn_A5" &&
    month5.blocker === "no_active_A5_authorization" &&
    panel.vcp_runtime_integration_proven_month_count === 0 &&
    panel.overall_status === "month_1_blocked_by_third_sample_human_approval";

  const evidenceRefsOk = goals
    .flatMap((goal) => goal.evidence_refs || [])
    .every((ref) => core.exists(ref));

  const noWrites =
    guard.local_static_panel_only === true &&
    guard.fetch_performed === false &&
    guard.file_write_performed === false &&
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
    passed: identityOk && monthMapOk && recoverabilityOk && staticProgressOk && evidenceRefsOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    monthMapOk,
    recoverabilityOk,
    staticProgressOk,
    evidenceRefsOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const panel = core.parseJson(files.fixture).review_console_six_month_goal_gap_static_panel;
const matrix = core.parseJson(files.sourceMatrix).review_console_recoverability_matrix_static_workbench;
const schemaSnapshot = core.parseJson(files.sourceSchemaSnapshot).review_console_schema_binding_coverage_snapshot_static_regression;
const phaseRecord = core.read(files.phaseRecord);
const app = core.read(files.app);
const index = core.read(files.index);
const styles = core.read(files.styles);
const readme = core.read(files.readme);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(panel, null, 2),
  app,
  index,
  styles,
  readme,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(panel, matrix, schemaSnapshot);
addResult("six_month_goal_gap_static_panel_evaluation_passes", baseEval.passed);

const overclaimMonth1 = clone(panel);
overclaimMonth1.complete_recoverable_sample_count = 3;
overclaimMonth1.remaining_full_recoverable_sample_gap = 0;
overclaimMonth1.hard_acceptance_three_full_samples_met = true;
overclaimMonth1.goals[0].status = "met";
overclaimMonth1.goals[0].proven_count = 3;
overclaimMonth1.goals[0].remaining_gap = 0;
overclaimMonth1.goals[0].blocker = null;
const pendingAccepted = clone(panel);
pendingAccepted.pending_candidate_counted_as_accepted = true;
const acceptedWrite = clone(panel);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(panel);
externalAction.guard.real_vcpchat_read_performed = true;
const runtimeClaim = clone(panel);
runtimeClaim.vcp_runtime_integration_proven_month_count = 1;
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.review_console_static_read_is_not_vcp_runtime_integration = false;
const missingMonth = clone(panel);
missingMonth.goals = missingMonth.goals.slice(0, 5);
missingMonth.month_count = 5;

const overclaimMonth1Eval = evaluate(overclaimMonth1, matrix, schemaSnapshot);
const pendingAcceptedEval = evaluate(pendingAccepted, matrix, schemaSnapshot);
const acceptedWriteEval = evaluate(acceptedWrite, matrix, schemaSnapshot);
const externalActionEval = evaluate(externalAction, matrix, schemaSnapshot);
const runtimeClaimEval = evaluate(runtimeClaim, matrix, schemaSnapshot);
const missingMonthEval = evaluate(missingMonth, matrix, schemaSnapshot);

addResult("negative_case_month_1_overclaim_fails", overclaimMonth1Eval.passed === false && overclaimMonth1Eval.recoverabilityOk === false);
addResult("negative_case_pending_candidate_counted_as_accepted_fails", pendingAcceptedEval.passed === false && pendingAcceptedEval.recoverabilityOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_missing_month_record_fails", missingMonthEval.passed === false && missingMonthEval.monthMapOk === false);

for (const token of [
  "sixMonthGoalGapState",
  "renderSixMonthGoalGap",
  "six_month_goal_gap_state: sixMonthGoalGapState()",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "six-month-goal-gap",
  "sixMonthGoalGapSummary",
  "sixMonthGoalGapBody",
  "sixMonthGoalGapGuard",
]) {
  requireToken("index", index, token);
}

for (const token of [
  "six-month-goal-gap-body",
  "six-month-goal-gap-card",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "v14.225",
  "six_month_goal_gap_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "v14_225_review_console_six_month_goal_gap_static_panel",
  "docs/v14_225_review_console_six_month_goal_gap_static_panel.md",
  "tests/schema_examples/v14_225_review_console_six_month_goal_gap_static_panel.example.json",
  "scripts/validate_v14_225_review_console_six_month_goal_gap_static_panel.js",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_225_review_console_six_month_goal_gap_static_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: panel.phase,
  draft_output_key: panel.draft_output_key,
  execution_mode: panel.execution_mode,
  month_count: panel.month_count,
  complete_recoverable_sample_count: panel.complete_recoverable_sample_count,
  required_full_recoverable_sample_count: panel.required_full_recoverable_sample_count,
  remaining_full_recoverable_sample_gap: panel.remaining_full_recoverable_sample_gap,
  hard_acceptance_three_full_samples_met: panel.hard_acceptance_three_full_samples_met,
  pending_candidate_counted_as_accepted: panel.pending_candidate_counted_as_accepted,
  overall_status: panel.overall_status,
  vcp_runtime_integration_proven_month_count: panel.vcp_runtime_integration_proven_month_count,
  accepted_samples_write_performed: panel.guard.accepted_samples_write_performed,
  production_candidate_write_performed: panel.guard.production_candidate_write_performed,
  daily_note_write_performed: panel.guard.DailyNote_write_performed,
  vcp_memory_write_performed: panel.guard.VCP_memory_write_performed,
  provider_contact_performed: panel.guard.provider_contact_performed,
  plugin_call_performed: panel.guard.plugin_call_performed,
  api_call_performed: panel.guard.api_call_performed,
  mcp_runtime_performed: panel.guard.mcp_runtime_performed,
  image_generation_performed: panel.guard.image_generation_performed,
  env_or_secret_read_performed: panel.guard.env_or_secret_read_performed,
  real_manifest_read_performed: panel.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: panel.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: panel.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: panel.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: panel.guard.vcp_runtime_integration_proven,
  negative_case_month_1_overclaim_fails: overclaimMonth1Eval.passed === false && overclaimMonth1Eval.recoverabilityOk === false,
  negative_case_pending_candidate_counted_as_accepted_fails: pendingAcceptedEval.passed === false && pendingAcceptedEval.recoverabilityOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_missing_month_record_fails: missingMonthEval.passed === false && missingMonthEval.monthMapOk === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
