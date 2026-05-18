#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_177_review_console_compare_state_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_177_review_console_compare_state_snapshot_static_regression.example.json",
  sourceFixture: "tests/schema_examples/v14_176_review_console_artifact_evidence_side_by_side_compare.example.json",
  app: "review_console/static_prototype/app.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_177_review_console_compare_state_snapshot_static_regression",
  draftKey: "artifact_evidence_compare_state",
  snapshotStatus: "golden_static_snapshot",
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evaluate(input, sourceFixture) {
  const snapshot = input.snapshot || {};
  const guard = input.guard || {};
  const sourceExpected = sourceFixture.expected || {};
  const snapshotOk =
    input.snapshot_status === expected.snapshotStatus &&
    input.draft_output_key === expected.draftKey &&
    snapshot.primary_artifact_id === sourceFixture.primary_artifact_id &&
    snapshot.comparison_artifact_id === sourceFixture.comparison_artifact_id &&
    snapshot.compare_pair_status === "recoverable_vs_blocked_registration" &&
    snapshot.compared_field_count === sourceExpected.compared_field_count &&
    snapshot.compare_fields.length === sourceFixture.compare_fields.length &&
    snapshot.primary_recoverable === sourceExpected.primary_recoverable &&
    snapshot.comparison_blocked === sourceExpected.comparison_blocked &&
    snapshot.lamp_blocker === sourceExpected.lamp_blocker &&
    snapshot.hard_acceptance_three_full_samples_met === false;
  const noWrites =
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false;
  const noExternal =
    guard.fetch_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false;
  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: snapshotOk && noWrites && noExternal && noRuntimeClaim,
    snapshotOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.snapshot).review_console_compare_state_snapshot_static_regression;
const sourceFixture = core.parseJson(files.sourceFixture).review_console_artifact_evidence_side_by_side_compare;
const phaseRecord = core.read(files.phaseRecord);
const appText = core.read(files.app);
const mvpText = core.read(files.mvpValidator);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  mvpText,
].join("\n");

const baseEval = evaluate(fixture, sourceFixture);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("compare_state_snapshot_evaluation_passes", baseEval.passed);

const comparisonMismatch = clone(fixture);
comparisonMismatch.snapshot.comparison_artifact_id = "wrong_id";
const fieldCountMismatch = clone(fixture);
fieldCountMismatch.snapshot.compare_fields.pop();
const overclaim = clone(fixture);
overclaim.snapshot.hard_acceptance_three_full_samples_met = true;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const comparisonMismatchEval = evaluate(comparisonMismatch, sourceFixture);
const fieldCountMismatchEval = evaluate(fieldCountMismatch, sourceFixture);
const overclaimEval = evaluate(overclaim, sourceFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_comparison_id_mismatch_fails", comparisonMismatchEval.passed === false && comparisonMismatchEval.snapshotOk === false);
addResult("negative_case_compare_field_count_mismatch_fails", fieldCountMismatchEval.passed === false && fieldCountMismatchEval.snapshotOk === false);
addResult("negative_case_three_sample_overclaim_fails", overclaimEval.passed === false && overclaimEval.snapshotOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "artifactEvidenceCompareState",
  "artifact_evidence_compare_state",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "scripts/validate_v14_177_review_console_compare_state_snapshot_static_regression.js",
  "tests/schema_examples/v14_177_review_console_compare_state_snapshot_static_regression.example.json",
  "docs/v14_177_review_console_compare_state_snapshot_static_regression.md",
  "v14_177_review_console_compare_state_snapshot_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_177_review_console_compare_state_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: fixture.snapshot_status,
  draft_output_key: fixture.draft_output_key,
  primary_artifact_id: fixture.snapshot.primary_artifact_id,
  comparison_artifact_id: fixture.snapshot.comparison_artifact_id,
  compare_pair_status: fixture.snapshot.compare_pair_status,
  compared_field_count: fixture.snapshot.compared_field_count,
  primary_recoverable: fixture.snapshot.primary_recoverable,
  comparison_blocked: fixture.snapshot.comparison_blocked,
  lamp_blocker: fixture.snapshot.lamp_blocker,
  hard_acceptance_three_full_samples_met: fixture.snapshot.hard_acceptance_three_full_samples_met,
  static_snapshot_only: true,
  fetch_performed: false,
  file_write_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_comparison_id_mismatch_fails: comparisonMismatchEval.passed === false && comparisonMismatchEval.snapshotOk === false,
  negative_case_compare_field_count_mismatch_fails: fieldCountMismatchEval.passed === false && fieldCountMismatchEval.snapshotOk === false,
  negative_case_three_sample_overclaim_fails: overclaimEval.passed === false && overclaimEval.snapshotOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
