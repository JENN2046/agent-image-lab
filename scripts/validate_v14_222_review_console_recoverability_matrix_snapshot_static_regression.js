#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_222_review_console_recoverability_matrix_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_222_review_console_recoverability_matrix_snapshot_static_regression.example.json",
  sourceWorkbench: "tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json",
  sourceWorkbenchRecord: "docs/v14_221_review_console_recoverability_matrix_static_workbench.md",
  sourceValidator: "scripts/validate_v14_221_review_console_recoverability_matrix_static_workbench.js",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_222_review_console_recoverability_matrix_snapshot_static_regression",
  sourcePhase: "v14_221_review_console_recoverability_matrix_static_workbench",
  draftOutputKey: "recoverability_matrix_state",
  blockedSampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  blockedCandidateId: "v14_166_lamp_v3_generated_candidate_001",
  blocker: "human_approval_missing",
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
  const sourceRows = source.rows || [];
  const sourceLamp = sourceRows.find((row) => row.sample_id === expected.blockedSampleId) || {};

  const identityOk =
    snapshot.phase === expected.phase &&
    snapshot.snapshot_status === "golden_static_snapshot" &&
    snapshot.source_workbench_ref === files.sourceWorkbench &&
    snapshot.source_workbench_record_ref === files.sourceWorkbenchRecord &&
    source.phase === expected.sourcePhase &&
    snapshot.draft_output_key === expected.draftOutputKey &&
    source.draft_output_key === expected.draftOutputKey;

  const countsOk =
    snapshot.row_count === 3 &&
    snapshot.row_count === source.rows.length &&
    snapshot.required_full_recoverable_sample_count === source.required_full_recoverable_sample_count &&
    snapshot.complete_recoverable_sample_count === 2 &&
    snapshot.complete_recoverable_sample_count === source.complete_recoverable_sample_count &&
    snapshot.blocked_registration_candidate_count === 1 &&
    snapshot.blocked_registration_candidate_count === source.blocked_registration_candidate_count &&
    snapshot.remaining_full_recoverable_sample_gap === 1 &&
    snapshot.remaining_full_recoverable_sample_gap === source.remaining_full_recoverable_sample_gap &&
    snapshot.hard_acceptance_three_full_samples_met === false &&
    snapshot.hard_acceptance_three_full_samples_met === source.hard_acceptance_three_full_samples_met &&
    snapshot.pending_candidate_counted_as_accepted === false &&
    snapshot.pending_candidate_counted_as_accepted === source.pending_candidate_counted_as_accepted;

  const blockerOk =
    snapshot.matrix_status === "blocked_by_human_approval_missing" &&
    snapshot.matrix_status === source.matrix_status &&
    snapshot.blocked_sample_id === expected.blockedSampleId &&
    snapshot.blocked_sample_id === sourceLamp.sample_id &&
    snapshot.blocked_candidate_id === expected.blockedCandidateId &&
    snapshot.blocked_candidate_id === sourceLamp.candidate_id &&
    snapshot.blocker === expected.blocker &&
    snapshot.blocker === sourceLamp.registration_blocker &&
    Array.isArray(snapshot.blocked_missing_fields) &&
    snapshot.blocked_missing_fields.includes("human_approval_status") &&
    Array.isArray(sourceLamp.missing_fields) &&
    sourceLamp.missing_fields.includes("human_approval_status");

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
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && countsOk && blockerOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    countsOk,
    blockerOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).review_console_recoverability_matrix_snapshot_static_regression;
const source = core.parseJson(files.sourceWorkbench).review_console_recoverability_matrix_static_workbench;
const phaseRecord = core.read(files.phaseRecord);
const app = core.read(files.app);
const readme = core.read(files.readme);
const currentSurfaces = [
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
addResult("recoverability_matrix_snapshot_evaluation_passes", baseEval.passed);

const countOverclaim = clone(snapshot);
countOverclaim.complete_recoverable_sample_count = 3;
countOverclaim.remaining_full_recoverable_sample_gap = 0;
countOverclaim.hard_acceptance_three_full_samples_met = true;
const pendingCounted = clone(snapshot);
pendingCounted.pending_candidate_counted_as_accepted = true;
const approvalOverclaim = clone(snapshot);
approvalOverclaim.blocked_missing_fields = [];
const acceptedWrite = clone(snapshot);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(snapshot);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(snapshot);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const countOverclaimEval = evaluate(countOverclaim, source);
const pendingCountedEval = evaluate(pendingCounted, source);
const approvalOverclaimEval = evaluate(approvalOverclaim, source);
const acceptedWriteEval = evaluate(acceptedWrite, source);
const externalActionEval = evaluate(externalAction, source);
const runtimeClaimEval = evaluate(runtimeClaim, source);

addResult("negative_case_three_sample_overclaim_fails", countOverclaimEval.passed === false && countOverclaimEval.countsOk === false);
addResult("negative_case_pending_candidate_counted_as_accepted_fails", pendingCountedEval.passed === false && pendingCountedEval.countsOk === false);
addResult("negative_case_human_approval_overclaim_fails", approvalOverclaimEval.passed === false && approvalOverclaimEval.blockerOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "recoverabilityMatrixState",
  "recoverability_matrix_state",
  "renderRecoverabilityMatrix",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "v14.222",
  "recoverability_matrix_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "v14_222_review_console_recoverability_matrix_snapshot_static_regression",
  "docs/v14_222_review_console_recoverability_matrix_snapshot_static_regression.md",
  "tests/schema_examples/v14_222_review_console_recoverability_matrix_snapshot_static_regression.example.json",
  "scripts/validate_v14_222_review_console_recoverability_matrix_snapshot_static_regression.js",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_222_review_console_recoverability_matrix_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: snapshot.phase,
  snapshot_status: snapshot.snapshot_status,
  draft_output_key: snapshot.draft_output_key,
  row_count: snapshot.row_count,
  complete_recoverable_sample_count: snapshot.complete_recoverable_sample_count,
  blocked_registration_candidate_count: snapshot.blocked_registration_candidate_count,
  remaining_full_recoverable_sample_gap: snapshot.remaining_full_recoverable_sample_gap,
  matrix_status: snapshot.matrix_status,
  pending_candidate_counted_as_accepted: snapshot.pending_candidate_counted_as_accepted,
  blocker: snapshot.blocker,
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
  negative_case_three_sample_overclaim_fails: countOverclaimEval.passed === false && countOverclaimEval.countsOk === false,
  negative_case_pending_candidate_counted_as_accepted_fails: pendingCountedEval.passed === false && pendingCountedEval.countsOk === false,
  negative_case_human_approval_overclaim_fails: approvalOverclaimEval.passed === false && approvalOverclaimEval.blockerOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
