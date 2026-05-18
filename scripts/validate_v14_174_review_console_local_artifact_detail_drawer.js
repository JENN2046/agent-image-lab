#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_174_review_console_local_artifact_detail_drawer.md",
  fixture: "tests/schema_examples/v14_174_review_console_local_artifact_detail_drawer.example.json",
  sourceFixture: "tests/schema_examples/v14_169_review_console_artifact_lifecycle_state_reader.example.json",
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
  phase: "v14_174_review_console_local_artifact_detail_drawer_static_only",
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

function selectRecord(source, selectedId) {
  const records = source.records || [];
  return records.find((record) => record.sample_id === selectedId || record.candidate_id === selectedId) || records[0] || null;
}

function evaluate(input, source) {
  const record = selectRecord(source, input.selected_artifact_id);
  const guard = input.guard || {};
  const required = input.required_detail_fields || [];
  const fieldsOk = Boolean(record) && required.every((field) => {
    if (field === "registration_blocker") return Object.prototype.hasOwnProperty.call(record, field);
    return record[field] !== undefined && record[field] !== null && record[field] !== "";
  });
  const selectableOk = (source.records || []).length === input.expected_selectable_count;
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
    passed: fieldsOk && selectableOk && noWrites && noExternal && noRuntimeClaim,
    fieldsOk,
    selectableOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
    selectedRecord: record,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_local_artifact_detail_drawer;
const sourceFixture = core.parseJson(files.sourceFixture).review_console_artifact_lifecycle_state_reader;
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

const baseEval = evaluate(fixture, sourceFixture);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("detail_drawer_evaluation_passes", baseEval.passed);

const missingArtifact = clone(sourceFixture);
missingArtifact.records[0].artifact_ref = "";
const missingHash = clone(sourceFixture);
missingHash.records[0].sha256 = "";
const unknownSelected = selectRecord(sourceFixture, "unknown_id");
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingArtifactEval = evaluate(fixture, missingArtifact);
const missingHashEval = evaluate(fixture, missingHash);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_missing_artifact_ref_fails", missingArtifactEval.passed === false && missingArtifactEval.fieldsOk === false);
addResult("negative_case_missing_hash_fails", missingHashEval.passed === false && missingHashEval.fieldsOk === false);
addResult("negative_case_unknown_selected_artifact_falls_back_to_first", unknownSelected?.sample_id === sourceFixture.records[0].sample_id);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "artifactDetailSummary",
  "artifactDetailBody",
  "artifactDetailGuard",
]) {
  requireToken("index", indexText, token);
}

for (const token of [
  "selectedArtifactId",
  "setSelectedArtifact",
  "renderArtifactDetailDrawer",
  "artifact_detail_drawer_state",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "artifact-detail-body",
]) {
  requireToken("styles", stylesText, token);
}

for (const token of [
  "scripts/validate_v14_174_review_console_local_artifact_detail_drawer.js",
  "tests/schema_examples/v14_174_review_console_local_artifact_detail_drawer.example.json",
  "docs/v14_174_review_console_local_artifact_detail_drawer.md",
  "v14_174_review_console_local_artifact_detail_drawer_static_only",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_174_review_console_local_artifact_detail_drawer",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  selected_artifact_id: fixture.selected_artifact_id,
  expected_selectable_count: fixture.expected_selectable_count,
  static_detail_only: true,
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
  negative_case_missing_artifact_ref_fails: missingArtifactEval.passed === false && missingArtifactEval.fieldsOk === false,
  negative_case_missing_hash_fails: missingHashEval.passed === false && missingHashEval.fieldsOk === false,
  negative_case_unknown_selected_artifact_falls_back_to_first: unknownSelected?.sample_id === sourceFixture.records[0].sample_id,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
