#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_178_review_console_artifact_evidence_compare_filter_lock.md",
  fixture: "tests/schema_examples/v14_178_review_console_artifact_evidence_compare_filter_lock.example.json",
  sourceFixture: "tests/schema_examples/v14_176_review_console_artifact_evidence_side_by_side_compare.example.json",
  sourceSnapshot: "tests/schema_examples/v14_177_review_console_compare_state_snapshot_static_regression.example.json",
  app: "review_console/static_prototype/app.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_178_review_console_artifact_evidence_compare_filter_lock_static_only",
  draftKey: "artifact_evidence_compare_state",
  primaryArtifactId: "accepted_womens_resort_relaxed_knit_codex_v2_001",
  comparisonArtifactId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  blocker: "human_approval_missing",
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

function evaluate(input, sourceFixture, sourceSnapshot) {
  const lock = input.compare_filter_lock || {};
  const guard = input.guard || {};
  const sourceExpected = sourceFixture.expected || {};
  const sourceSnapshotValue = sourceSnapshot.snapshot || {};
  const lockOk =
    input.draft_output_key === expected.draftKey &&
    input.primary_artifact_id === expected.primaryArtifactId &&
    input.comparison_artifact_id === expected.comparisonArtifactId &&
    input.comparison_artifact_id === sourceFixture.comparison_artifact_id &&
    input.comparison_artifact_id === sourceSnapshotValue.comparison_artifact_id &&
    lock.locked_to_blocked_candidate === true &&
    lock.locked_blocker === expected.blocker &&
    lock.ignores_lifecycle_filter === true &&
    lock.comparison_source === "blocked_registration_candidate" &&
    lock.locked_comparison_artifact_id === expected.comparisonArtifactId &&
    input.expected?.comparison_blocked === sourceExpected.comparison_blocked &&
    input.expected?.lamp_blocker === expected.blocker &&
    input.expected?.hard_acceptance_three_full_samples_met === false &&
    sourceSnapshotValue.hard_acceptance_three_full_samples_met === false;
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
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: lockOk && noWrites && noExternal && noRuntimeClaim,
    lockOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_artifact_evidence_compare_filter_lock;
const sourceFixture = core.parseJson(files.sourceFixture).review_console_artifact_evidence_side_by_side_compare;
const sourceSnapshot = core.parseJson(files.sourceSnapshot).review_console_compare_state_snapshot_static_regression;
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

const baseEval = evaluate(fixture, sourceFixture, sourceSnapshot);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("compare_filter_lock_evaluation_passes", baseEval.passed);

const unlocked = clone(fixture);
unlocked.compare_filter_lock.locked_to_blocked_candidate = false;
const blockerMismatch = clone(fixture);
blockerMismatch.compare_filter_lock.locked_blocker = "none";
const missingLock = clone(fixture);
delete missingLock.compare_filter_lock;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const unlockedEval = evaluate(unlocked, sourceFixture, sourceSnapshot);
const blockerMismatchEval = evaluate(blockerMismatch, sourceFixture, sourceSnapshot);
const missingLockEval = evaluate(missingLock, sourceFixture, sourceSnapshot);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture, sourceSnapshot);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture, sourceSnapshot);

addResult("negative_case_locked_to_blocked_candidate_false_fails", unlockedEval.passed === false && unlockedEval.lockOk === false);
addResult("negative_case_locked_blocker_mismatch_fails", blockerMismatchEval.passed === false && blockerMismatchEval.lockOk === false);
addResult("negative_case_filter_lock_missing_fails", missingLockEval.passed === false && missingLockEval.lockOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "compare_filter_lock",
  "locked_to_blocked_candidate",
  "ignores_lifecycle_filter",
  "locked_comparison_artifact_id",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "scripts/validate_v14_178_review_console_artifact_evidence_compare_filter_lock.js",
  "tests/schema_examples/v14_178_review_console_artifact_evidence_compare_filter_lock.example.json",
  "docs/v14_178_review_console_artifact_evidence_compare_filter_lock.md",
  "v14_178_review_console_artifact_evidence_compare_filter_lock_static_only",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_178_review_console_artifact_evidence_compare_filter_lock",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  draft_output_key: fixture.draft_output_key,
  primary_artifact_id: fixture.primary_artifact_id,
  comparison_artifact_id: fixture.comparison_artifact_id,
  locked_to_blocked_candidate: fixture.compare_filter_lock.locked_to_blocked_candidate,
  locked_blocker: fixture.compare_filter_lock.locked_blocker,
  ignores_lifecycle_filter: fixture.compare_filter_lock.ignores_lifecycle_filter,
  comparison_source: fixture.compare_filter_lock.comparison_source,
  locked_comparison_artifact_id: fixture.compare_filter_lock.locked_comparison_artifact_id,
  comparison_blocked: fixture.expected.comparison_blocked,
  lamp_blocker: fixture.expected.lamp_blocker,
  hard_acceptance_three_full_samples_met: fixture.expected.hard_acceptance_three_full_samples_met,
  static_filter_lock_only: true,
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
  negative_case_locked_to_blocked_candidate_false_fails: unlockedEval.passed === false && unlockedEval.lockOk === false,
  negative_case_locked_blocker_mismatch_fails: blockerMismatchEval.passed === false && blockerMismatchEval.lockOk === false,
  negative_case_filter_lock_missing_fails: missingLockEval.passed === false && missingLockEval.lockOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
