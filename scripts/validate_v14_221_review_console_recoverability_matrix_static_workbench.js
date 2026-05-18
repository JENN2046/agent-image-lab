#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_221_review_console_recoverability_matrix_static_workbench.md",
  fixture: "tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json",
  sourceLifecycleReader: "tests/schema_examples/v14_169_review_console_artifact_lifecycle_state_reader.example.json",
  sourceGap: "tests/schema_examples/v14_187_review_console_three_sample_gap_snapshot_static_regression.example.json",
  sourceBlockerQueue: "tests/schema_examples/v14_219_review_console_human_approval_blocker_queue_snapshot_static_regression.example.json",
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
  phase: "v14_221_review_console_recoverability_matrix_static_workbench",
  draftOutputKey: "recoverability_matrix_state",
  matrixStatus: "blocked_by_human_approval_missing",
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

function evaluate(matrix) {
  const rows = matrix.rows || [];
  const completeRows = rows.filter((row) => row.complete_recoverable === true);
  const blockedRows = rows.filter((row) => row.registration_blocker === expected.blocker);
  const lamp = rows.find((row) => row.sample_id === expected.blockedSampleId) || {};
  const guard = matrix.guard || {};

  const identityOk =
    matrix.phase === expected.phase &&
    matrix.execution_mode === "review_console_static_recoverability_matrix_only" &&
    matrix.draft_output_key === expected.draftOutputKey &&
    matrix.source_lifecycle_reader_ref === files.sourceLifecycleReader &&
    matrix.source_gap_ref === files.sourceGap &&
    matrix.source_blocker_queue_ref === files.sourceBlockerQueue;

  const countsOk =
    rows.length === 3 &&
    matrix.required_full_recoverable_sample_count === 3 &&
    matrix.complete_recoverable_sample_count === 2 &&
    completeRows.length === matrix.complete_recoverable_sample_count &&
    matrix.blocked_registration_candidate_count === 1 &&
    blockedRows.length === matrix.blocked_registration_candidate_count &&
    matrix.remaining_full_recoverable_sample_gap === 1 &&
    matrix.hard_acceptance_three_full_samples_met === false &&
    matrix.pending_candidate_counted_as_accepted === false &&
    matrix.matrix_status === expected.matrixStatus;

  const requiredFieldsOk =
    Array.isArray(matrix.required_fields) &&
    matrix.required_fields.length === 10 &&
    matrix.required_fields.includes("artifact_ref") &&
    matrix.required_fields.includes("sha256") &&
    matrix.required_fields.includes("dimensions") &&
    matrix.required_fields.includes("mime") &&
    matrix.required_fields.includes("prompt_package_ref") &&
    matrix.required_fields.includes("import_record_ref") &&
    matrix.required_fields.includes("review_record_ref") &&
    matrix.required_fields.includes("human_approval_status") &&
    matrix.required_fields.includes("category_index_ref") &&
    matrix.required_fields.includes("accepted_registry_ref");

  const completeRowsOk = completeRows.every((row) =>
    row.lifecycle_state === "recoverable" &&
    row.accepted_samples_metadata_registered === true &&
    row.accepted_samples_registration_eligible === true &&
    row.human_approval_status === "approved" &&
    row.approved_by === "Jenn" &&
    row.registration_blocker === null &&
    row.production_candidate_status === "not_created" &&
    row.present_field_count === 10 &&
    row.required_field_count === 10 &&
    Array.isArray(row.missing_fields) &&
    row.missing_fields.length === 0
  );

  const lampBlockerOk =
    lamp.candidate_id === expected.blockedCandidateId &&
    lamp.complete_recoverable === false &&
    lamp.accepted_samples_metadata_registered === false &&
    lamp.accepted_samples_registration_eligible === false &&
    lamp.human_approval_status === "missing" &&
    lamp.approved_by === null &&
    lamp.registration_blocker === expected.blocker &&
    lamp.production_candidate_status === "not_created" &&
    lamp.present_field_count === 9 &&
    lamp.required_field_count === 10 &&
    Array.isArray(lamp.missing_fields) &&
    lamp.missing_fields.includes("human_approval_status");

  const noWrites =
    guard.local_static_matrix_only === true &&
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
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && countsOk && requiredFieldsOk && completeRowsOk && lampBlockerOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    countsOk,
    requiredFieldsOk,
    completeRowsOk,
    lampBlockerOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_recoverability_matrix_static_workbench;
const phaseRecord = core.read(files.phaseRecord);
const app = core.read(files.app);
const index = core.read(files.index);
const styles = core.read(files.styles);
const readme = core.read(files.readme);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
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

const baseEval = evaluate(fixture);
addResult("recoverability_matrix_static_workbench_evaluation_passes", baseEval.passed);

const missingField = clone(fixture);
missingField.rows[0].present_field_count = 9;
missingField.rows[0].missing_fields = ["sha256"];
const pendingCounted = clone(fixture);
pendingCounted.complete_recoverable_sample_count = 3;
pendingCounted.remaining_full_recoverable_sample_gap = 0;
pendingCounted.hard_acceptance_three_full_samples_met = true;
pendingCounted.pending_candidate_counted_as_accepted = true;
const approvalOverclaim = clone(fixture);
approvalOverclaim.rows[2].human_approval_status = "approved";
approvalOverclaim.rows[2].approved_by = "Jenn";
approvalOverclaim.rows[2].missing_fields = [];
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingFieldEval = evaluate(missingField);
const pendingCountedEval = evaluate(pendingCounted);
const approvalOverclaimEval = evaluate(approvalOverclaim);
const acceptedWriteEval = evaluate(acceptedWrite);
const externalActionEval = evaluate(externalAction);
const runtimeClaimEval = evaluate(runtimeClaim);

addResult("negative_case_missing_required_field_fails", missingFieldEval.passed === false && missingFieldEval.completeRowsOk === false);
addResult("negative_case_pending_candidate_counted_as_accepted_fails", pendingCountedEval.passed === false && pendingCountedEval.countsOk === false);
addResult("negative_case_human_approval_overclaim_fails", approvalOverclaimEval.passed === false && approvalOverclaimEval.lampBlockerOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "recoverabilityMatrixState",
  "renderRecoverabilityMatrix",
  "recoverability_matrix_state: recoverabilityMatrixState()",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "recoverability-matrix",
  "recoverabilityMatrixSummary",
  "recoverabilityMatrixBody",
  "recoverabilityMatrixGuard",
]) {
  requireToken("index", index, token);
}

for (const token of [
  "recoverability-matrix-body",
  "recoverability-matrix-card",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "v14.221",
  "recoverability_matrix_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "v14_221_review_console_recoverability_matrix_static_workbench",
  "docs/v14_221_review_console_recoverability_matrix_static_workbench.md",
  "tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json",
  "scripts/validate_v14_221_review_console_recoverability_matrix_static_workbench.js",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_221_review_console_recoverability_matrix_static_workbench",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: fixture.phase,
  draft_output_key: fixture.draft_output_key,
  row_count: fixture.rows.length,
  complete_recoverable_sample_count: fixture.complete_recoverable_sample_count,
  blocked_registration_candidate_count: fixture.blocked_registration_candidate_count,
  remaining_full_recoverable_sample_gap: fixture.remaining_full_recoverable_sample_gap,
  matrix_status: fixture.matrix_status,
  pending_candidate_counted_as_accepted: fixture.pending_candidate_counted_as_accepted,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  mcp_runtime_performed: fixture.guard.mcp_runtime_performed,
  image_generation_performed: fixture.guard.image_generation_performed,
  env_or_secret_read_performed: fixture.guard.env_or_secret_read_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: fixture.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: fixture.guard.vcp_runtime_integration_proven,
  negative_case_missing_required_field_fails: missingFieldEval.passed === false && missingFieldEval.completeRowsOk === false,
  negative_case_pending_candidate_counted_as_accepted_fails: pendingCountedEval.passed === false && pendingCountedEval.countsOk === false,
  negative_case_human_approval_overclaim_fails: approvalOverclaimEval.passed === false && approvalOverclaimEval.lampBlockerOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
