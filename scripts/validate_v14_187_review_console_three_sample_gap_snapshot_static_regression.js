#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_187_review_console_three_sample_gap_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_187_review_console_three_sample_gap_snapshot_static_regression.example.json",
  sourceFixture: "tests/schema_examples/v14_186_review_console_three_sample_gap_summary_panel.example.json",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_187_review_console_three_sample_gap_snapshot_static_regression",
  snapshotStatus: "golden_static_snapshot",
  draftKey: "three_sample_gap_summary_state",
  lampArtifactId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  lampBlocker: "human_approval_missing",
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
  const source = sourceFixture.review_console_three_sample_gap_summary_panel;
  const snapshot = input.snapshot || {};
  const guard = input.guard || {};
  const snapshotOk =
    input.phase === expected.phase &&
    input.snapshot_status === expected.snapshotStatus &&
    input.draft_output_key === expected.draftKey &&
    snapshot.required_full_recoverable_sample_count === source.required_full_recoverable_sample_count &&
    snapshot.recoverable_accepted_sample_count === source.recoverable_accepted_sample_count &&
    snapshot.blocked_registration_candidate_count === source.blocked_registration_candidate_count &&
    snapshot.remaining_full_recoverable_sample_gap === source.remaining_full_recoverable_sample_gap &&
    snapshot.hard_acceptance_three_full_samples_met === false &&
    snapshot.pending_candidate_counted_as_accepted === false &&
    snapshot.gap_status === source.gap_status &&
    snapshot.blocker_candidate_id === expected.lampArtifactId &&
    snapshot.blocker_candidate_id === source.blocker_candidate_id &&
    snapshot.blocker_reason === expected.lampBlocker &&
    snapshot.blocker_reason === source.blocker_reason &&
    snapshot.blocker_human_approval_status === "pending" &&
    snapshot.blocker_accepted_samples_metadata_registered === false &&
    snapshot.blocker_production_candidate_status === "not_created";
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
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;
  const noRuntimeClaim =
    guard.static_snapshot_only === true &&
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

const fixture = core.parseJson(files.snapshot).review_console_three_sample_gap_snapshot_static_regression;
const sourceFixture = core.parseJson(files.sourceFixture);
const phaseRecord = core.read(files.phaseRecord);
const appText = core.read(files.app);
const readmeText = core.read(files.readme);
const mvpText = core.read(files.mvpValidator);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  readmeText,
  mvpText,
].join("\n");

const baseEval = evaluate(fixture, sourceFixture);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("three_sample_gap_snapshot_evaluation_passes", baseEval.passed);

const gapZeroOverclaim = clone(fixture);
gapZeroOverclaim.snapshot.remaining_full_recoverable_sample_gap = 0;
gapZeroOverclaim.snapshot.hard_acceptance_three_full_samples_met = true;
const pendingCounted = clone(fixture);
pendingCounted.snapshot.pending_candidate_counted_as_accepted = true;
const blockerMismatch = clone(fixture);
blockerMismatch.snapshot.blocker_candidate_id = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const gapZeroOverclaimEval = evaluate(gapZeroOverclaim, sourceFixture);
const pendingCountedEval = evaluate(pendingCounted, sourceFixture);
const blockerMismatchEval = evaluate(blockerMismatch, sourceFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_gap_zero_overclaim_fails", gapZeroOverclaimEval.passed === false && gapZeroOverclaimEval.snapshotOk === false);
addResult("negative_case_pending_counted_as_accepted_fails", pendingCountedEval.passed === false && pendingCountedEval.snapshotOk === false);
addResult("negative_case_blocker_candidate_mismatch_fails", blockerMismatchEval.passed === false && blockerMismatchEval.snapshotOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "threeSampleGapSummaryState",
  "three_sample_gap_summary_state",
  "threeSampleGapSummary",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "scripts/validate_v14_187_review_console_three_sample_gap_snapshot_static_regression.js",
  "tests/schema_examples/v14_187_review_console_three_sample_gap_snapshot_static_regression.example.json",
  "docs/v14_187_review_console_three_sample_gap_snapshot_static_regression.md",
  "v14_187_review_console_three_sample_gap_snapshot_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_187_review_console_three_sample_gap_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: fixture.snapshot_status,
  draft_output_key: fixture.draft_output_key,
  required_full_recoverable_sample_count: fixture.snapshot.required_full_recoverable_sample_count,
  recoverable_accepted_sample_count: fixture.snapshot.recoverable_accepted_sample_count,
  blocked_registration_candidate_count: fixture.snapshot.blocked_registration_candidate_count,
  remaining_full_recoverable_sample_gap: fixture.snapshot.remaining_full_recoverable_sample_gap,
  hard_acceptance_three_full_samples_met: fixture.snapshot.hard_acceptance_three_full_samples_met,
  pending_candidate_counted_as_accepted: fixture.snapshot.pending_candidate_counted_as_accepted,
  gap_status: fixture.snapshot.gap_status,
  blocker_candidate_id: fixture.snapshot.blocker_candidate_id,
  blocker_reason: fixture.snapshot.blocker_reason,
  blocker_accepted_samples_metadata_registered: fixture.snapshot.blocker_accepted_samples_metadata_registered,
  blocker_production_candidate_status: fixture.snapshot.blocker_production_candidate_status,
  static_snapshot_only: fixture.guard.static_snapshot_only,
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
  negative_case_gap_zero_overclaim_fails: gapZeroOverclaimEval.passed === false && gapZeroOverclaimEval.snapshotOk === false,
  negative_case_pending_counted_as_accepted_fails: pendingCountedEval.passed === false && pendingCountedEval.snapshotOk === false,
  negative_case_blocker_candidate_mismatch_fails: blockerMismatchEval.passed === false && blockerMismatchEval.snapshotOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
