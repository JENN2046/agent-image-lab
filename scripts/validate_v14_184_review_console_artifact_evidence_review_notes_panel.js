#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_184_review_console_artifact_evidence_review_notes_panel.md",
  fixture: "tests/schema_examples/v14_184_review_console_artifact_evidence_review_notes_panel.example.json",
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
  phase: "v14_184_review_console_artifact_evidence_review_notes_panel_static_only",
  draftKey: "artifact_evidence_review_notes_state",
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

function sourceRecords(sourceFixture) {
  return sourceFixture.review_console_artifact_lifecycle_state_reader.records || [];
}

function sourceArtifactId(record) {
  return record.sample_id || record.candidate_id;
}

function evaluate(input, sourceFixture) {
  const records = sourceRecords(sourceFixture);
  const notes = input.notes || [];
  const guard = input.guard || {};
  const approvedCount = records.filter((record) => record.human_approval_status === "approved").length;
  const pendingCount = records.filter((record) => record.human_approval_status === "pending").length;
  const blockedCount = records.filter((record) => record.registration_blocker).length;
  const lampNote = notes.find((note) => note.artifact_id === expected.lampArtifactId);
  const sourceAligned =
    input.phase === expected.phase &&
    input.draft_output_key === expected.draftKey &&
    input.note_count === records.length &&
    input.approved_note_count === approvedCount &&
    input.pending_note_count === pendingCount &&
    input.blocked_note_count === blockedCount &&
    input.lamp_blocker === expected.lampBlocker &&
    notes.length === records.length &&
    records.every((record) => {
      const note = notes.find((candidate) => candidate.artifact_id === sourceArtifactId(record));
      return note &&
        note.visual_task === record.visual_task &&
        note.review_record_ref === record.review_record_ref &&
        note.human_approval_status === record.human_approval_status &&
        note.accepted_samples_metadata_registered === record.accepted_samples_metadata_registered &&
        note.production_candidate_status === record.production_candidate_status;
    });
  const reviewRecordsPresent = notes.every((note) => typeof note.review_record_ref === "string" && note.review_record_ref.length > 0);
  const lampBlockerPresent = Boolean(lampNote && lampNote.registration_blocker === expected.lampBlocker);
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
    guard.static_notes_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: sourceAligned && reviewRecordsPresent && lampBlockerPresent && noWrites && noExternal && noRuntimeClaim,
    sourceAligned,
    reviewRecordsPresent,
    lampBlockerPresent,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_artifact_evidence_review_notes_panel;
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
addResult("artifact_evidence_review_notes_panel_evaluation_passes", baseEval.passed);

const missingReviewRecord = clone(fixture);
missingReviewRecord.notes[0].review_record_ref = "";
const lampBlockerMissing = clone(fixture);
lampBlockerMissing.notes[2].registration_blocker = null;
lampBlockerMissing.lamp_blocker = null;
const approvedCountMismatch = clone(fixture);
approvedCountMismatch.approved_note_count = 3;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingReviewRecordEval = evaluate(missingReviewRecord, sourceFixture);
const lampBlockerMissingEval = evaluate(lampBlockerMissing, sourceFixture);
const approvedCountMismatchEval = evaluate(approvedCountMismatch, sourceFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_missing_review_record_ref_fails", missingReviewRecordEval.passed === false && missingReviewRecordEval.reviewRecordsPresent === false);
addResult("negative_case_lamp_blocker_missing_fails", lampBlockerMissingEval.passed === false && lampBlockerMissingEval.lampBlockerPresent === false);
addResult("negative_case_approved_note_count_mismatch_fails", approvedCountMismatchEval.passed === false && approvedCountMismatchEval.sourceAligned === false);
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
  "artifact-review-notes",
  "artifactReviewNotesList",
]) {
  requireToken("index", indexText, token);
}

for (const token of [
  "scripts/validate_v14_184_review_console_artifact_evidence_review_notes_panel.js",
  "tests/schema_examples/v14_184_review_console_artifact_evidence_review_notes_panel.example.json",
  "docs/v14_184_review_console_artifact_evidence_review_notes_panel.md",
  "v14_184_review_console_artifact_evidence_review_notes_panel_static_only",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_184_review_console_artifact_evidence_review_notes_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  draft_output_key: fixture.draft_output_key,
  note_count: fixture.note_count,
  approved_note_count: fixture.approved_note_count,
  pending_note_count: fixture.pending_note_count,
  blocked_note_count: fixture.blocked_note_count,
  lamp_blocker: fixture.lamp_blocker,
  static_notes_only: fixture.guard.static_notes_only,
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
  negative_case_missing_review_record_ref_fails: missingReviewRecordEval.passed === false && missingReviewRecordEval.reviewRecordsPresent === false,
  negative_case_lamp_blocker_missing_fails: lampBlockerMissingEval.passed === false && lampBlockerMissingEval.lampBlockerPresent === false,
  negative_case_approved_note_count_mismatch_fails: approvedCountMismatchEval.passed === false && approvedCountMismatchEval.sourceAligned === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
