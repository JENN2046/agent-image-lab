#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_176_review_console_artifact_evidence_side_by_side_compare.md",
  fixture: "tests/schema_examples/v14_176_review_console_artifact_evidence_side_by_side_compare.example.json",
  sourceLifecycleFixture: "tests/schema_examples/v14_169_review_console_artifact_lifecycle_state_reader.example.json",
  sourceDetailSnapshot: "tests/schema_examples/v14_175_review_console_artifact_detail_drawer_snapshot_static_regression.example.json",
  index: "review_console/static_prototype/index.html",
  app: "review_console/static_prototype/app.js",
  styles: "review_console/static_prototype/styles.css",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_176_review_console_artifact_evidence_side_by_side_compare_static_only",
  draftKey: "artifact_evidence_compare_state",
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

function findRecord(source, id) {
  return (source.records || []).find((record) => record.sample_id === id || record.candidate_id === id) || null;
}

function evaluate(input, lifecycleSource, detailSnapshot) {
  const expectedValues = input.expected || {};
  const guard = input.guard || {};
  const primary = findRecord(lifecycleSource, input.primary_artifact_id);
  const comparison = findRecord(lifecycleSource, input.comparison_artifact_id);
  const detail = detailSnapshot.snapshot || {};
  const compareOk =
    input.draft_output_key === expected.draftKey &&
    input.compare_fields.length === expectedValues.compared_field_count &&
    input.compare_fields.length === 10 &&
    Boolean(primary) &&
    Boolean(comparison) &&
    input.primary_artifact_id === detail.selected_artifact_id &&
    primary.lifecycle_state === "recoverable" &&
    primary.human_approval_status === "approved" &&
    comparison.registration_blocker === expectedValues.lamp_blocker &&
    expectedValues.primary_recoverable === true &&
    expectedValues.comparison_blocked === true &&
    expectedValues.hard_acceptance_three_full_samples_met === false;
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
    passed: compareOk && noWrites && noExternal && noRuntimeClaim,
    compareOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_artifact_evidence_side_by_side_compare;
const lifecycle = core.parseJson(files.sourceLifecycleFixture).review_console_artifact_lifecycle_state_reader;
const detailSnapshot = core.parseJson(files.sourceDetailSnapshot).review_console_artifact_detail_drawer_snapshot_static_regression;
const phaseRecord = core.read(files.phaseRecord);
const indexText = core.read(files.index);
const appText = core.read(files.app);
const stylesText = core.read(files.styles);
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

const baseEval = evaluate(fixture, lifecycle, detailSnapshot);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("artifact_evidence_compare_evaluation_passes", baseEval.passed);

const missingComparisonBlocker = clone(fixture);
missingComparisonBlocker.expected.lamp_blocker = null;
const primaryNotRecoverable = clone(fixture);
primaryNotRecoverable.expected.primary_recoverable = false;
const fieldCountMismatch = clone(fixture);
fieldCountMismatch.compare_fields.pop();
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingComparisonBlockerEval = evaluate(missingComparisonBlocker, lifecycle, detailSnapshot);
const primaryNotRecoverableEval = evaluate(primaryNotRecoverable, lifecycle, detailSnapshot);
const fieldCountMismatchEval = evaluate(fieldCountMismatch, lifecycle, detailSnapshot);
const acceptedWriteEval = evaluate(acceptedWrite, lifecycle, detailSnapshot);
const runtimeClaimEval = evaluate(runtimeClaim, lifecycle, detailSnapshot);

addResult("negative_case_missing_comparison_blocker_fails", missingComparisonBlockerEval.passed === false && missingComparisonBlockerEval.compareOk === false);
addResult("negative_case_primary_not_recoverable_fails", primaryNotRecoverableEval.passed === false && primaryNotRecoverableEval.compareOk === false);
addResult("negative_case_compare_field_count_mismatch_fails", fieldCountMismatchEval.passed === false && fieldCountMismatchEval.compareOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "artifactCompareSummary",
  "artifactCompareBody",
  "artifactCompareGuard",
]) {
  requireToken("index", indexText, token);
}

for (const token of [
  "artifactEvidenceCompareState",
  "renderArtifactEvidenceCompare",
  "artifact_evidence_compare_state",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "artifact-compare-body",
  "artifact-compare-card",
]) {
  requireToken("styles", stylesText, token);
}

for (const token of [
  "scripts/validate_v14_176_review_console_artifact_evidence_side_by_side_compare.js",
  "tests/schema_examples/v14_176_review_console_artifact_evidence_side_by_side_compare.example.json",
  "docs/v14_176_review_console_artifact_evidence_side_by_side_compare.md",
  "v14_176_review_console_artifact_evidence_side_by_side_compare_static_only",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_176_review_console_artifact_evidence_side_by_side_compare",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  primary_artifact_id: fixture.primary_artifact_id,
  comparison_artifact_id: fixture.comparison_artifact_id,
  compared_field_count: fixture.expected.compared_field_count,
  primary_recoverable: fixture.expected.primary_recoverable,
  comparison_blocked: fixture.expected.comparison_blocked,
  lamp_blocker: fixture.expected.lamp_blocker,
  hard_acceptance_three_full_samples_met: fixture.expected.hard_acceptance_three_full_samples_met,
  static_compare_only: true,
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
  negative_case_missing_comparison_blocker_fails: missingComparisonBlockerEval.passed === false && missingComparisonBlockerEval.compareOk === false,
  negative_case_primary_not_recoverable_fails: primaryNotRecoverableEval.passed === false && primaryNotRecoverableEval.compareOk === false,
  negative_case_compare_field_count_mismatch_fails: fieldCountMismatchEval.passed === false && fieldCountMismatchEval.compareOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
