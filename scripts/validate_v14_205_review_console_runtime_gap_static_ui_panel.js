#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_205_review_console_runtime_gap_static_ui_panel.md",
  app: "review_console/static_prototype/app.js",
  html: "review_console/static_prototype/index.html",
  mockData: "review_console/static_prototype/mock_data.js",
  styles: "review_console/static_prototype/styles.css",
  sourceContract: "tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expectedRows = [
  "artifact_recoverability",
  "accepted_samples_gap",
  "authorization_handoff_cards",
  "manifest_read",
  "vcpchat_vcptoolbox_runtime",
  "daily_note_vcp_memory",
  "production_candidate_archive",
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

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const app = core.read(files.app);
const html = core.read(files.html);
const mockData = core.read(files.mockData);
const styles = core.read(files.styles);
const phaseRecord = core.read(files.phaseRecord);
const sourceContract = core.parseJson(files.sourceContract).review_console_runtime_gap_dashboard_contract;
const currentSurfaces = [
  phaseRecord,
  app,
  html,
  mockData,
  styles,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

addResult("source_contract_is_v14_204", sourceContract.phase === "v14_204_review_console_runtime_gap_dashboard_contract");
addResult("source_contract_has_seven_rows", sourceContract.runtime_gap_row_count === 7 && sourceContract.rows.length === 7);
addResult("source_contract_runtime_not_claimed", sourceContract.runtime_claim_allowed === false && sourceContract.guard.vcp_runtime_integration_proven === false);

for (const token of [
  "review_console_runtime_gap_dashboard_contract_seed",
  "source_contract_ref: \"tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json\"",
  "runtime_gap_row_count: 7",
  "local_capability_row_count: 3",
  "a5_boundary_row_count: 4",
  "runtime_claim_allowed: false",
  "runtime_gap_dashboard_static_ui_only: true",
]) {
  requireToken("mock_data", mockData, token);
}

for (const rowId of expectedRows) {
  requireToken("mock_data", mockData, `row_id: "${rowId}"`);
}

for (const token of [
  "runtime_gap_dashboard: mock.review_console_runtime_gap_dashboard_contract_seed",
  "function reviewConsoleRuntimeGapDashboardState()",
  "function renderReviewConsoleRuntimeGapDashboard()",
  "review_console_runtime_gap_dashboard_state: reviewConsoleRuntimeGapDashboardState()",
  "renderReviewConsoleRuntimeGapDashboard();",
  "runtime_gap_dashboard_static_ui_only: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "id=\"runtimeGapSummary\"",
  "id=\"runtimeGapBody\"",
  "id=\"runtimeGapGuard\"",
  "runtime-gap-dashboard",
  "本地能力 / VCP 接入缺口",
]) {
  requireToken("html", html, token);
}

for (const token of [
  ".runtime-gap-body",
  ".runtime-gap-card",
  ".runtime-gap-card.blocked",
  ".runtime-gap-card dl",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "phase_id: v14_205_review_console_runtime_gap_static_ui_panel",
  "static_ui_panel_status: wired_static_only",
  "runtime_gap_row_count: 7",
  "runtime_claim_allowed: false",
  "fetch_performed: false",
  "file_write_performed: false",
  "package_execution_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_205_review_console_runtime_gap_static_ui_panel.js",
  "docs/v14_205_review_console_runtime_gap_static_ui_panel.md",
  "v14_205_review_console_runtime_gap_static_ui_panel",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("app", app, /\bfetch\s*\(/);
forbidPattern("app", app, /localStorage\.setItem|sessionStorage\.setItem/);
forbidPattern("app", app, /real_vcpchat_read_performed:\s*true|real_vcptoolbox_read_performed:\s*true|plugin_call_performed:\s*true|api_call_performed:\s*true/);
forbidPattern("mock_data", mockData, /vcp_runtime_integration_proven:\s*true/);
forbidPattern("current_surfaces", currentSurfaces, /runtime_claim_allowed:\s*true/);
forbidPattern("current_surfaces", currentSurfaces, /package_execution_performed:\s*true/);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_205_review_console_runtime_gap_static_ui_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  static_ui_panel_status: "wired_static_only",
  runtime_gap_row_count: 7,
  local_capability_row_count: 3,
  a5_boundary_row_count: 4,
  runtime_claim_allowed: false,
  runtime_gap_dashboard_static_ui_only: true,
  fetch_performed: false,
  file_write_performed: false,
  package_execution_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  vcp_runtime_integration_proven: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
