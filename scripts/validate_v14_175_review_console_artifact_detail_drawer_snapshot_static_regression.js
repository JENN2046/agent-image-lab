#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_175_review_console_artifact_detail_drawer_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_175_review_console_artifact_detail_drawer_snapshot_static_regression.example.json",
  sourceFixture: "tests/schema_examples/v14_174_review_console_local_artifact_detail_drawer.example.json",
  sourceLifecycleFixture: "tests/schema_examples/v14_169_review_console_artifact_lifecycle_state_reader.example.json",
  app: "review_console/static_prototype/app.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_175_review_console_artifact_detail_drawer_snapshot_static_regression",
  draftKey: "artifact_detail_drawer_state",
  snapshotStatus: "golden_static_snapshot",
};

const detailFields = [
  "artifact_ref",
  "sha256",
  "dimensions",
  "mime",
  "prompt_package_ref",
  "import_record_ref",
  "review_record_ref",
  "category_index_ref",
  "human_approval_status",
  "registration_blocker",
];

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

function selectRecord(source, selectedId) {
  const records = source.records || [];
  return records.find((record) => record.sample_id === selectedId || record.candidate_id === selectedId) || records[0] || null;
}

function evaluate(input, sourceFixture, sourceLifecycleFixture) {
  const snapshot = input.snapshot || {};
  const guard = input.guard || {};
  const source = sourceFixture || {};
  const selected = selectRecord(sourceLifecycleFixture, snapshot.selected_artifact_id);
  const lamp = (sourceLifecycleFixture.records || []).find((record) => record.registration_blocker === "human_approval_missing");
  const snapshotOk =
    input.snapshot_status === expected.snapshotStatus &&
    input.draft_output_key === expected.draftKey &&
    snapshot.selected_artifact_id === source.selected_artifact_id &&
    snapshot.expected_selectable_count === source.expected_selectable_count &&
    snapshot.detail_field_count === (source.required_detail_fields || []).length &&
    snapshot.detail_field_count === detailFields.length &&
    snapshot.hard_acceptance_three_full_samples_met === false &&
    Boolean(selected) &&
    snapshot.selected_candidate_id === selected.candidate_id &&
    snapshot.selected_lifecycle_state === selected.lifecycle_state &&
    snapshot.selected_human_approval_status === selected.human_approval_status &&
    snapshot.selected_artifact_ref === selected.artifact_ref &&
    snapshot.selected_sha256 === selected.sha256 &&
    snapshot.selected_dimensions === selected.dimensions &&
    snapshot.selected_mime === selected.mime &&
    snapshot.selected_prompt_package_ref === selected.prompt_package_ref &&
    snapshot.selected_import_record_ref === selected.import_record_ref &&
    snapshot.selected_review_record_ref === selected.review_record_ref &&
    snapshot.selected_category_index_ref === selected.category_index_ref &&
    snapshot.lamp_blocker === "human_approval_missing" &&
    Boolean(lamp);
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

const fixture = core.parseJson(files.snapshot).review_console_artifact_detail_drawer_snapshot_static_regression;
const sourceFixture = core.parseJson(files.sourceFixture).review_console_local_artifact_detail_drawer;
const sourceLifecycleFixture = core.parseJson(files.sourceLifecycleFixture).review_console_artifact_lifecycle_state_reader;
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

const baseEval = evaluate(fixture, sourceFixture, sourceLifecycleFixture);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("artifact_detail_snapshot_evaluation_passes", baseEval.passed);

const hashMismatch = clone(fixture);
hashMismatch.snapshot.selected_sha256 = "mismatch";
const detailFieldMismatch = clone(fixture);
detailFieldMismatch.snapshot.detail_field_count = 9;
const missingLampBlocker = clone(fixture);
missingLampBlocker.snapshot.lamp_blocker = null;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const hashMismatchEval = evaluate(hashMismatch, sourceFixture, sourceLifecycleFixture);
const detailFieldMismatchEval = evaluate(detailFieldMismatch, sourceFixture, sourceLifecycleFixture);
const missingLampBlockerEval = evaluate(missingLampBlocker, sourceFixture, sourceLifecycleFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture, sourceLifecycleFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture, sourceLifecycleFixture);

addResult("negative_case_selected_hash_mismatch_fails", hashMismatchEval.passed === false && hashMismatchEval.snapshotOk === false);
addResult("negative_case_detail_field_count_mismatch_fails", detailFieldMismatchEval.passed === false && detailFieldMismatchEval.snapshotOk === false);
addResult("negative_case_lamp_blocker_missing_fails", missingLampBlockerEval.passed === false && missingLampBlockerEval.snapshotOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "artifact_detail_drawer_state",
  "renderArtifactDetailDrawer",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "scripts/validate_v14_175_review_console_artifact_detail_drawer_snapshot_static_regression.js",
  "tests/schema_examples/v14_175_review_console_artifact_detail_drawer_snapshot_static_regression.example.json",
  "docs/v14_175_review_console_artifact_detail_drawer_snapshot_static_regression.md",
  "v14_175_review_console_artifact_detail_drawer_snapshot_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_175_review_console_artifact_detail_drawer_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: fixture.snapshot_status,
  draft_output_key: fixture.draft_output_key,
  selected_artifact_id: fixture.snapshot.selected_artifact_id,
  selected_sha256: fixture.snapshot.selected_sha256,
  detail_field_count: fixture.snapshot.detail_field_count,
  expected_selectable_count: fixture.snapshot.expected_selectable_count,
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
  negative_case_selected_hash_mismatch_fails: hashMismatchEval.passed === false && hashMismatchEval.snapshotOk === false,
  negative_case_detail_field_count_mismatch_fails: detailFieldMismatchEval.passed === false && detailFieldMismatchEval.snapshotOk === false,
  negative_case_lamp_blocker_missing_fails: missingLampBlockerEval.passed === false && missingLampBlockerEval.snapshotOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
