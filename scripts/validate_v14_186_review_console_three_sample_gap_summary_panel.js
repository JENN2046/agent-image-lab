#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_186_review_console_three_sample_gap_summary_panel.md",
  fixture: "tests/schema_examples/v14_186_review_console_three_sample_gap_summary_panel.example.json",
  sourceLifecycleFixture: "tests/schema_examples/v14_169_review_console_artifact_lifecycle_state_reader.example.json",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_186_review_console_three_sample_gap_summary_panel_static_only",
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
  const source = sourceFixture.review_console_artifact_lifecycle_state_reader;
  const counts = source.expected_reader_output;
  const blockedRecord = source.records.find((record) => record.registration_blocker === expected.lampBlocker);
  const guard = input.guard || {};
  const gapOk =
    input.phase === expected.phase &&
    input.draft_output_key === expected.draftKey &&
    input.required_full_recoverable_sample_count === 3 &&
    input.recoverable_accepted_sample_count === counts.recoverable_accepted_sample_count &&
    input.blocked_registration_candidate_count === counts.blocked_registration_candidate_count &&
    input.remaining_full_recoverable_sample_gap === counts.remaining_full_recoverable_sample_gap &&
    input.hard_acceptance_three_full_samples_met === false &&
    input.pending_candidate_counted_as_accepted === false &&
    input.gap_status === "blocked_by_human_approval_missing" &&
    input.blocker_candidate_id === expected.lampArtifactId &&
    input.blocker_candidate_id === blockedRecord?.sample_id &&
    input.blocker_reason === expected.lampBlocker &&
    input.blocker_human_approval_status === "pending" &&
    input.blocker_accepted_samples_metadata_registered === false &&
    input.blocker_production_candidate_status === "not_created";
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
    guard.local_summary_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: gapOk && noWrites && noExternal && noRuntimeClaim,
    gapOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_three_sample_gap_summary_panel;
const sourceFixture = core.parseJson(files.sourceLifecycleFixture);
const phaseRecord = core.read(files.phaseRecord);
const appText = core.read(files.app);
const indexText = core.read(files.index);
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
addResult("three_sample_gap_summary_panel_evaluation_passes", baseEval.passed);

const gapZeroOverclaim = clone(fixture);
gapZeroOverclaim.remaining_full_recoverable_sample_gap = 0;
gapZeroOverclaim.hard_acceptance_three_full_samples_met = true;
const pendingCounted = clone(fixture);
pendingCounted.pending_candidate_counted_as_accepted = true;
const blockerMissing = clone(fixture);
blockerMissing.blocker_candidate_id = null;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const gapZeroOverclaimEval = evaluate(gapZeroOverclaim, sourceFixture);
const pendingCountedEval = evaluate(pendingCounted, sourceFixture);
const blockerMissingEval = evaluate(blockerMissing, sourceFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_gap_zero_overclaim_fails", gapZeroOverclaimEval.passed === false && gapZeroOverclaimEval.gapOk === false);
addResult("negative_case_pending_counted_as_accepted_fails", pendingCountedEval.passed === false && pendingCountedEval.gapOk === false);
addResult("negative_case_blocker_candidate_missing_fails", blockerMissingEval.passed === false && blockerMissingEval.gapOk === false);
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
  "three-sample-gap",
  "threeSampleGapBody",
]) {
  requireToken("index", indexText, token);
}

for (const token of [
  "scripts/validate_v14_186_review_console_three_sample_gap_summary_panel.js",
  "tests/schema_examples/v14_186_review_console_three_sample_gap_summary_panel.example.json",
  "docs/v14_186_review_console_three_sample_gap_summary_panel.md",
  "v14_186_review_console_three_sample_gap_summary_panel_static_only",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_186_review_console_three_sample_gap_summary_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  draft_output_key: fixture.draft_output_key,
  required_full_recoverable_sample_count: fixture.required_full_recoverable_sample_count,
  recoverable_accepted_sample_count: fixture.recoverable_accepted_sample_count,
  blocked_registration_candidate_count: fixture.blocked_registration_candidate_count,
  remaining_full_recoverable_sample_gap: fixture.remaining_full_recoverable_sample_gap,
  hard_acceptance_three_full_samples_met: fixture.hard_acceptance_three_full_samples_met,
  pending_candidate_counted_as_accepted: fixture.pending_candidate_counted_as_accepted,
  gap_status: fixture.gap_status,
  blocker_candidate_id: fixture.blocker_candidate_id,
  blocker_reason: fixture.blocker_reason,
  local_summary_only: fixture.guard.local_summary_only,
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
  negative_case_gap_zero_overclaim_fails: gapZeroOverclaimEval.passed === false && gapZeroOverclaimEval.gapOk === false,
  negative_case_pending_counted_as_accepted_fails: pendingCountedEval.passed === false && pendingCountedEval.gapOk === false,
  negative_case_blocker_candidate_missing_fails: blockerMissingEval.passed === false && blockerMissingEval.gapOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
