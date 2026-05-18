#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression.example.json",
  sourceFixture: "tests/schema_examples/v14_184_review_console_artifact_evidence_review_notes_panel.example.json",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression",
  draftKey: "artifact_evidence_review_notes_state",
  snapshotStatus: "golden_static_snapshot",
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
  const source = sourceFixture.review_console_artifact_evidence_review_notes_panel;
  const snapshot = input.snapshot || {};
  const guard = input.guard || {};
  const sourceApprovedIds = source.notes
    .filter((note) => note.human_approval_status === "approved")
    .map((note) => note.artifact_id);
  const sourceBlockedNote = source.notes.find((note) => note.registration_blocker === expected.lampBlocker);
  const snapshotOk =
    input.phase === expected.phase &&
    input.snapshot_status === expected.snapshotStatus &&
    input.draft_output_key === expected.draftKey &&
    snapshot.note_count === source.note_count &&
    snapshot.approved_note_count === source.approved_note_count &&
    snapshot.pending_note_count === source.pending_note_count &&
    snapshot.blocked_note_count === source.blocked_note_count &&
    snapshot.lamp_blocker === expected.lampBlocker &&
    JSON.stringify(snapshot.approved_artifact_ids) === JSON.stringify(sourceApprovedIds) &&
    snapshot.blocked_artifact_id === expected.lampArtifactId &&
    snapshot.blocked_artifact_id === sourceBlockedNote?.artifact_id &&
    snapshot.blocked_review_record_ref === sourceBlockedNote?.review_record_ref &&
    snapshot.blocked_accepted_samples_metadata_registered === false &&
    snapshot.blocked_production_candidate_status === "not_created";
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

const fixture = core.parseJson(files.snapshot).review_console_artifact_evidence_review_notes_snapshot_static_regression;
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
addResult("artifact_evidence_review_notes_snapshot_evaluation_passes", baseEval.passed);

const approvedIdsMismatch = clone(fixture);
approvedIdsMismatch.snapshot.approved_artifact_ids.reverse();
const blockedArtifactMismatch = clone(fixture);
blockedArtifactMismatch.snapshot.blocked_artifact_id = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const lampBlockerMissing = clone(fixture);
lampBlockerMissing.snapshot.lamp_blocker = null;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const approvedIdsMismatchEval = evaluate(approvedIdsMismatch, sourceFixture);
const blockedArtifactMismatchEval = evaluate(blockedArtifactMismatch, sourceFixture);
const lampBlockerMissingEval = evaluate(lampBlockerMissing, sourceFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_approved_artifact_ids_mismatch_fails", approvedIdsMismatchEval.passed === false && approvedIdsMismatchEval.snapshotOk === false);
addResult("negative_case_blocked_artifact_id_mismatch_fails", blockedArtifactMismatchEval.passed === false && blockedArtifactMismatchEval.snapshotOk === false);
addResult("negative_case_lamp_blocker_missing_fails", lampBlockerMissingEval.passed === false && lampBlockerMissingEval.snapshotOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "artifactEvidenceReviewNotesState",
  "artifact_evidence_review_notes_state",
  "artifactReviewNotesSummary",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "scripts/validate_v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression.js",
  "tests/schema_examples/v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression.example.json",
  "docs/v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression.md",
  "v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_185_review_console_artifact_evidence_review_notes_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: fixture.snapshot_status,
  draft_output_key: fixture.draft_output_key,
  note_count: fixture.snapshot.note_count,
  approved_note_count: fixture.snapshot.approved_note_count,
  pending_note_count: fixture.snapshot.pending_note_count,
  blocked_note_count: fixture.snapshot.blocked_note_count,
  lamp_blocker: fixture.snapshot.lamp_blocker,
  blocked_artifact_id: fixture.snapshot.blocked_artifact_id,
  blocked_accepted_samples_metadata_registered: fixture.snapshot.blocked_accepted_samples_metadata_registered,
  blocked_production_candidate_status: fixture.snapshot.blocked_production_candidate_status,
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
  negative_case_approved_artifact_ids_mismatch_fails: approvedIdsMismatchEval.passed === false && approvedIdsMismatchEval.snapshotOk === false,
  negative_case_blocked_artifact_id_mismatch_fails: blockedArtifactMismatchEval.passed === false && blockedArtifactMismatchEval.snapshotOk === false,
  negative_case_lamp_blocker_missing_fails: lampBlockerMissingEval.passed === false && lampBlockerMissingEval.snapshotOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
