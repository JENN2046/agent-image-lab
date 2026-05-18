#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_171_review_console_lifecycle_state_local_filter_controls.md",
  fixture: "tests/schema_examples/v14_171_review_console_lifecycle_state_local_filter_controls.example.json",
  snapshot: "tests/schema_examples/v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot.example.json",
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
  phase: "v14_171_review_console_lifecycle_state_local_filter_controls_static_only",
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

function visibleRecords(snapshot, filter) {
  const normalizedFilter = ["all", "recoverable", "blocked"].includes(filter) ? filter : "all";
  const records = snapshot.artifact_lifecycle_state_reader.record_expectations;
  if (normalizedFilter === "recoverable") return records.filter((record) => record.recoverable === true);
  if (normalizedFilter === "blocked") return records.filter((record) => record.blocked_registration === true);
  return records;
}

function evaluate(input, snapshot) {
  const filtersOk =
    Array.isArray(input.allowed_filters) &&
    input.allowed_filters.join(",") === "all,recoverable,blocked";
  const countsOk =
    visibleRecords(snapshot, "all").length === input.expected_visible_counts.all &&
    visibleRecords(snapshot, "recoverable").length === input.expected_visible_counts.recoverable &&
    visibleRecords(snapshot, "blocked").length === input.expected_visible_counts.blocked;
  const recoverableRecords = visibleRecords(snapshot, "recoverable");
  const blockedRecords = visibleRecords(snapshot, "blocked");
  const recoverableHidesLamp = !recoverableRecords.some((record) => record.sample_id === expected.lampId);
  const blockedShowsOnlyLamp = blockedRecords.length === 1 && blockedRecords[0].sample_id === expected.lampId;
  const guard = input.filter_state || {};
  const noWrites =
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.production_candidate_write_performed === false;
  const noRuntimeClaim = guard.vcp_runtime_integration_proven === false;
  return {
    passed: filtersOk && countsOk && recoverableHidesLamp && blockedShowsOnlyLamp && noWrites && noRuntimeClaim,
    filtersOk,
    countsOk,
    recoverableHidesLamp,
    blockedShowsOnlyLamp,
    noWrites,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_lifecycle_state_local_filter_controls;
const snapshot = core.parseJson(files.snapshot).review_console_artifact_lifecycle_state_reader_draft_output_snapshot;
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

const baseEval = evaluate(fixture, snapshot);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("filter_evaluation_passes", baseEval.passed);

const unknownFilterFallsBack = visibleRecords(snapshot, "unknown").length === fixture.expected_visible_counts.all;
const recoverableFilterMustNotShowBlockedLamp = baseEval.recoverableHidesLamp;
const blockedFilterMustShowOnlyLamp = baseEval.blockedShowsOnlyLamp;
const acceptedWrite = clone(fixture);
acceptedWrite.filter_state.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.filter_state.vcp_runtime_integration_proven = true;

const acceptedWriteEval = evaluate(acceptedWrite, snapshot);
const runtimeClaimEval = evaluate(runtimeClaim, snapshot);

addResult("negative_case_unknown_filter_falls_back_to_all", unknownFilterFallsBack === true);
addResult("negative_case_recoverable_filter_must_not_show_blocked_lamp", recoverableFilterMustNotShowBlockedLamp === true);
addResult("negative_case_blocked_filter_must_show_only_lamp", blockedFilterMustShowOnlyLamp === true);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "data-lifecycle-filter=\"all\"",
  "data-lifecycle-filter=\"recoverable\"",
  "data-lifecycle-filter=\"blocked\"",
]) {
  requireToken("index", indexText, token);
}

for (const token of [
  "lifecycleFilter: \"all\"",
  "setLifecycleFilter",
  "artifact_lifecycle_filter_state",
  "filter_is_local_ui_only: true",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "lifecycle-filter-actions",
  "grid-template-columns: repeat(3, minmax(0, 1fr))",
]) {
  requireToken("styles", stylesText, token);
}

for (const token of [
  "scripts/validate_v14_171_review_console_lifecycle_state_local_filter_controls.js",
  "tests/schema_examples/v14_171_review_console_lifecycle_state_local_filter_controls.example.json",
  "docs/v14_171_review_console_lifecycle_state_local_filter_controls.md",
  "v14_171_review_console_lifecycle_state_local_filter_controls_static_only",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_171_review_console_lifecycle_state_local_filter_controls",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  allowed_filters: fixture.allowed_filters,
  visible_count_all: visibleRecords(snapshot, "all").length,
  visible_count_recoverable: visibleRecords(snapshot, "recoverable").length,
  visible_count_blocked: visibleRecords(snapshot, "blocked").length,
  filter_is_local_ui_only: true,
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
  negative_case_unknown_filter_falls_back_to_all: unknownFilterFallsBack === true,
  negative_case_recoverable_filter_must_not_show_blocked_lamp: recoverableFilterMustNotShowBlockedLamp === true,
  negative_case_blocked_filter_must_show_only_lamp: blockedFilterMustShowOnlyLamp === true,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
