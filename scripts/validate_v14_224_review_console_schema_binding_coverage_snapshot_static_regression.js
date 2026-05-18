#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_224_review_console_schema_binding_coverage_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_224_review_console_schema_binding_coverage_snapshot_static_regression.example.json",
  sourcePanel: "tests/schema_examples/v14_223_review_console_schema_binding_coverage_static_panel.example.json",
  sourcePanelRecord: "docs/v14_223_review_console_schema_binding_coverage_static_panel.md",
  sourceValidator: "scripts/validate_v14_223_review_console_schema_binding_coverage_static_panel.js",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_224_review_console_schema_binding_coverage_snapshot_static_regression",
  sourcePhase: "v14_223_review_console_schema_binding_coverage_static_panel",
  draftOutputKey: "review_console_schema_binding_coverage_state",
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

  const identityOk =
    snapshot.phase === expected.phase &&
    snapshot.snapshot_status === "golden_static_snapshot" &&
    snapshot.source_panel_ref === files.sourcePanel &&
    snapshot.source_panel_record_ref === files.sourcePanelRecord &&
    source.phase === expected.sourcePhase &&
    snapshot.draft_output_key === expected.draftOutputKey &&
    source.draft_output_key === expected.draftOutputKey;

  const coverageOk =
    snapshot.bound_schema_count === 3 &&
    snapshot.bound_schema_count === source.bound_schema_count &&
    snapshot.matrix_required_field_count === 10 &&
    snapshot.matrix_required_field_count === source.matrix_required_field_count &&
    snapshot.covered_matrix_required_field_count === 10 &&
    snapshot.covered_matrix_required_field_count === source.covered_matrix_required_field_count &&
    Array.isArray(snapshot.missing_matrix_required_fields) &&
    snapshot.missing_matrix_required_fields.length === 0 &&
    Array.isArray(source.missing_matrix_required_fields) &&
    source.missing_matrix_required_fields.length === 0 &&
    snapshot.binding_status === "covered_static_read_only" &&
    snapshot.binding_status === source.binding_status &&
    snapshot.schema_binding_coverage_complete === true &&
    snapshot.schema_binding_coverage_complete === source.schema_binding_coverage_complete &&
    snapshot.pending_candidate_counted_as_accepted === false &&
    snapshot.pending_candidate_counted_as_accepted === source.pending_candidate_counted_as_accepted &&
    snapshot.hard_acceptance_three_full_samples_met === false &&
    snapshot.hard_acceptance_three_full_samples_met === source.hard_acceptance_three_full_samples_met;

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
    passed: identityOk && coverageOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    coverageOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).review_console_schema_binding_coverage_snapshot_static_regression;
const source = core.parseJson(files.sourcePanel).review_console_schema_binding_coverage_static_panel;
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
addResult("schema_binding_coverage_snapshot_evaluation_passes", baseEval.passed);

const schemaCountDrift = clone(snapshot);
schemaCountDrift.bound_schema_count = 2;
const fieldCoverageDrift = clone(snapshot);
fieldCoverageDrift.covered_matrix_required_field_count = 9;
fieldCoverageDrift.missing_matrix_required_fields = ["human_approval_status"];
fieldCoverageDrift.schema_binding_coverage_complete = false;
const acceptedWrite = clone(snapshot);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(snapshot);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(snapshot);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const schemaCountDriftEval = evaluate(schemaCountDrift, source);
const fieldCoverageDriftEval = evaluate(fieldCoverageDrift, source);
const acceptedWriteEval = evaluate(acceptedWrite, source);
const externalActionEval = evaluate(externalAction, source);
const runtimeClaimEval = evaluate(runtimeClaim, source);

addResult("negative_case_schema_count_drift_fails", schemaCountDriftEval.passed === false && schemaCountDriftEval.coverageOk === false);
addResult("negative_case_field_coverage_drift_fails", fieldCoverageDriftEval.passed === false && fieldCoverageDriftEval.coverageOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "reviewConsoleSchemaBindingCoverageState",
  "review_console_schema_binding_coverage_state",
  "renderReviewConsoleSchemaBindingCoverage",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "v14.224",
  "review_console_schema_binding_coverage_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "v14_224_review_console_schema_binding_coverage_snapshot_static_regression",
  "docs/v14_224_review_console_schema_binding_coverage_snapshot_static_regression.md",
  "tests/schema_examples/v14_224_review_console_schema_binding_coverage_snapshot_static_regression.example.json",
  "scripts/validate_v14_224_review_console_schema_binding_coverage_snapshot_static_regression.js",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_224_review_console_schema_binding_coverage_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: snapshot.phase,
  snapshot_status: snapshot.snapshot_status,
  draft_output_key: snapshot.draft_output_key,
  binding_status: snapshot.binding_status,
  bound_schema_count: snapshot.bound_schema_count,
  matrix_required_field_count: snapshot.matrix_required_field_count,
  covered_matrix_required_field_count: snapshot.covered_matrix_required_field_count,
  schema_binding_coverage_complete: snapshot.schema_binding_coverage_complete,
  pending_candidate_counted_as_accepted: snapshot.pending_candidate_counted_as_accepted,
  hard_acceptance_three_full_samples_met: snapshot.hard_acceptance_three_full_samples_met,
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
  negative_case_schema_count_drift_fails: schemaCountDriftEval.passed === false && schemaCountDriftEval.coverageOk === false,
  negative_case_field_coverage_drift_fails: fieldCoverageDriftEval.passed === false && fieldCoverageDriftEval.coverageOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
