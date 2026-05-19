#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const rel = {
  fixture: "tests/schema_examples/CAPSULE_STATIC_PRODUCT_SMOKE_UNIFIED_CONTRACT.example.json",
  snapshot: "tests/schema_examples/CAPSULE_STATIC_PRODUCT_SMOKE_REVIEW_CONSOLE_SNAPSHOT.example.json",
  mock: "review_console/static_prototype/mock_data.js",
  app: "review_console/static_prototype/app.js",
};

function readText(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function loadMock() {
  const sandbox = { window: {} };
  vm.runInNewContext(readText(rel.mock), sandbox, { filename: rel.mock, timeout: 1000 });
  return sandbox.window.REVIEW_CONSOLE_MOCK;
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });

const fixture = readJson(rel.fixture);
const snapshot = readJson(rel.snapshot);
const mock = loadMock();
const app = readText(rel.app);
const fixtureReport = fixture.unified_capsule_contract_report;
const mockReport = mock.unified_capsule_contract_report;
const renderSurface = snapshot.render_surface;
const guard = snapshot.guard;

add("draft_output_key", fixture.draft_output_key === snapshot.draft_output_key && snapshot.draft_output_key === "unified_capsule_contract_report");
add("mock_report_matches_checked_in_fixture", sameJson(mockReport, fixtureReport));
add("totals_total_4", mockReport.totals.total === 4);
add("totals_accepted_2", mockReport.totals.accepted === 2);
add("totals_failure_2", mockReport.totals.failure === 2);
add("samples_count_4", mockReport.samples.length === 4);
add("snapshot_row_count_4", renderSurface.row_count === 4);
add("sample_ids_match_snapshot", sameJson(mockReport.samples.map((sample) => sample.sample_id), renderSurface.sample_ids));
add("all_samples_have_fixture_shape_reviewer_action", mockReport.samples.every((sample) => typeof sample.reviewer_action === "string" && sample.reviewer_action === renderSurface.pass_reviewer_action));
add("app_renders_fixture_reviewer_action", app.includes("sample.reviewer_action || sample.reviewer_action_cn"));
for (const field of renderSurface.row_fields) {
  add(`row_field_${field}`, mockReport.samples.every((sample) => Object.prototype.hasOwnProperty.call(sample, field)));
}
for (const token of renderSurface.summary_tokens) {
  const [key, value] = token.split(":");
  const passed = key === "total"
    ? String(mockReport.totals.total) === value
    : mockReport.contract_status[`${key}_passed`] === (value === "passed");
  add(`summary_token_${token}`, passed);
}
const catalog = mockReport.reviewer_action_catalog || [];
add("pass_action_in_catalog", catalog.some((action) => action.label === renderSurface.pass_reviewer_action && action.state === "pass"));
for (const label of renderSurface.fail_closed_reviewer_actions) {
  add(`fail_closed_action_${label}`, catalog.some((action) => action.label === label && action.state === "fail_closed"));
}
for (const [key, expected] of Object.entries(guard)) {
  add(`snapshot_guard_${key}`, expected === false || expected === true);
  if (key in mockReport.guard) add(`mock_guard_${key}`, mockReport.guard[key] === expected);
}
add("no_asset_archive_ui_read", mockReport.guard.asset_archive_ui_read_performed === false);
add("no_preview_load", mockReport.guard.preview_loaded_or_rendered === false);
add("no_browser_runtime_validator", mockReport.guard.browser_runtime_validator_executed === false);
add("no_provider_plugin_api_image_memory_production", [
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "production_candidate_write_performed",
].every((key) => mockReport.guard[key] === false));

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_capsule_static_product_smoke_review_console_snapshot",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "capsule_static_product_smoke_review_console_snapshot_verified" : "capsule_static_product_smoke_review_console_snapshot_failed",
  fixture_ref: rel.fixture,
  snapshot_ref: rel.snapshot,
  static_mock_ref: rel.mock,
  draft_output_key: "unified_capsule_contract_report",
  totals: mockReport.totals,
  browser_runtime_validator_executed: false,
  asset_archive_ui_read_performed: false,
  preview_loaded_or_rendered: false,
  check_count: checks.length,
  failed_count: failed.length,
  checks,
  failures: failed,
};
console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
