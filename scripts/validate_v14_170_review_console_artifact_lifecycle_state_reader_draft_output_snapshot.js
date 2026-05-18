#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { normalizeArtifactLifecycleState } = require("../review_console/static_prototype/artifact_lifecycle_state_reader");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot.md",
  snapshot: "tests/schema_examples/v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot.example.json",
  sourceFixture: "tests/schema_examples/v14_169_review_console_artifact_lifecycle_state_reader.example.json",
  reader: "review_console/static_prototype/artifact_lifecycle_state_reader.js",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot",
  snapshotStatus: "golden_static_snapshot",
  draftKey: "artifact_lifecycle_state_reader",
  acceptedCount: 2,
  blockedCount: 1,
  remainingGap: 1,
  lampId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
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

function evaluateSnapshot(snapshot, sourceInput) {
  const output = normalizeArtifactLifecycleState(sourceInput);
  const snap = snapshot.artifact_lifecycle_state_reader || {};
  const counts = snap.counts || {};
  const guard = snap.guard || {};
  const records = Array.isArray(snap.record_expectations) ? snap.record_expectations : [];
  const lamp = records.find((record) => record.sample_id === expected.lampId);
  const hasDraftKey = Boolean(snapshot.artifact_lifecycle_state_reader);
  const countsOk =
    counts.recoverable_accepted_sample_count === output.counts.recoverable_accepted_sample_count &&
    counts.blocked_registration_candidate_count === output.counts.blocked_registration_candidate_count &&
    counts.remaining_full_recoverable_sample_gap === output.counts.remaining_full_recoverable_sample_gap &&
    counts.hard_acceptance_three_full_samples_met === false &&
    counts.pending_candidate_counted_as_accepted === false;
  const recordsOk =
    records.length === output.records.length &&
    records.every((record) => {
      const actual = output.records.find((item) => item.sample_id === record.sample_id);
      return actual &&
        actual.lifecycle_state === record.lifecycle_state &&
        actual.recoverable === record.recoverable &&
        actual.blocked_registration === record.blocked_registration &&
        actual.human_approval_status === record.human_approval_status &&
        actual.production_candidate_status === record.production_candidate_status &&
        actual.vcp_runtime_integration_proven === false;
    });
  const lampBlocked =
    lamp &&
    lamp.recoverable === false &&
    lamp.blocked_registration === true &&
    lamp.registration_blocker === "human_approval_missing";
  const noWrites =
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.durable_archive_copy_performed === false;
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
    passed: hasDraftKey && snapshot.snapshot_status === expected.snapshotStatus && snapshot.draft_output_key === expected.draftKey && countsOk && recordsOk && lampBlocked && noWrites && noExternal && noRuntimeClaim,
    hasDraftKey,
    countsOk,
    recordsOk,
    lampBlocked,
    noWrites,
    noExternal,
    noRuntimeClaim,
    output,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).review_console_artifact_lifecycle_state_reader_draft_output_snapshot;
const sourceFixture = core.parseJson(files.sourceFixture).review_console_artifact_lifecycle_state_reader;
const phaseRecord = core.read(files.phaseRecord);
const appText = core.read(files.app);
const readmeText = core.read(files.readme);
const mvpText = core.read(files.mvpValidator);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(snapshot, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  mvpText,
].join("\n");

const baseEval = evaluateSnapshot(snapshot, sourceFixture);
addResult("snapshot_phase_matches", snapshot.phase === expected.phase);
addResult("snapshot_evaluation_passes", baseEval.passed);
addResult("snapshot_counts_match_reader_output", baseEval.countsOk);
addResult("snapshot_records_match_reader_output", baseEval.recordsOk);

const missingKey = clone(snapshot);
delete missingKey.artifact_lifecycle_state_reader;
const countsMismatch = clone(snapshot);
countsMismatch.artifact_lifecycle_state_reader.counts.recoverable_accepted_sample_count = 3;
const lampRecoverable = clone(snapshot);
lampRecoverable.artifact_lifecycle_state_reader.record_expectations[2].recoverable = true;
lampRecoverable.artifact_lifecycle_state_reader.record_expectations[2].blocked_registration = false;
const acceptedWrite = clone(snapshot);
acceptedWrite.artifact_lifecycle_state_reader.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(snapshot);
runtimeClaim.artifact_lifecycle_state_reader.guard.vcp_runtime_integration_proven = true;
runtimeClaim.artifact_lifecycle_state_reader.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingKeyEval = evaluateSnapshot(missingKey, sourceFixture);
const countsMismatchEval = evaluateSnapshot(countsMismatch, sourceFixture);
const lampRecoverableEval = evaluateSnapshot(lampRecoverable, sourceFixture);
const acceptedWriteEval = evaluateSnapshot(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluateSnapshot(runtimeClaim, sourceFixture);

addResult("negative_case_missing_snapshot_key_fails", missingKeyEval.passed === false && missingKeyEval.hasDraftKey === false);
addResult("negative_case_counts_mismatch_fails", countsMismatchEval.passed === false && countsMismatchEval.countsOk === false);
addResult("negative_case_lamp_marked_recoverable_fails", lampRecoverableEval.passed === false && lampRecoverableEval.recordsOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "artifact_lifecycle_state_reader: normalizeArtifactLifecycleState()",
  "prototype_guard",
  "api_called: false",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "v14.170",
  "artifact_lifecycle_state_reader",
  "snapshot",
]) {
  requireToken("readme_or_phase", `${readmeText}\n${phaseRecord}`, token);
}

for (const token of [
  "scripts/validate_v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot.js",
  "tests/schema_examples/v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot.example.json",
  "docs/v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot.md",
  "v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: snapshot.snapshot_status,
  draft_output_key: snapshot.draft_output_key,
  recoverable_accepted_sample_count: snapshot.artifact_lifecycle_state_reader.counts.recoverable_accepted_sample_count,
  blocked_registration_candidate_count: snapshot.artifact_lifecycle_state_reader.counts.blocked_registration_candidate_count,
  remaining_full_recoverable_sample_gap: snapshot.artifact_lifecycle_state_reader.counts.remaining_full_recoverable_sample_gap,
  hard_acceptance_three_full_samples_met: snapshot.artifact_lifecycle_state_reader.counts.hard_acceptance_three_full_samples_met,
  pending_candidate_counted_as_accepted: snapshot.artifact_lifecycle_state_reader.counts.pending_candidate_counted_as_accepted,
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
  negative_case_missing_snapshot_key_fails: missingKeyEval.passed === false && missingKeyEval.hasDraftKey === false,
  negative_case_counts_mismatch_fails: countsMismatchEval.passed === false && countsMismatchEval.countsOk === false,
  negative_case_lamp_marked_recoverable_fails: lampRecoverableEval.passed === false && lampRecoverableEval.recordsOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
