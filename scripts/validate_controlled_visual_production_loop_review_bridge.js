#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const files = {
  fixture: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_REVIEW_BRIDGE_STATE.example.json",
  mock: "review_console/static_prototype/mock_data.js",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  readme: "review_console/static_prototype/README.md"
};

function readText(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function loadMock() {
  const sandbox = { window: {} };
  vm.runInNewContext(readText(files.mock), sandbox, { filename: files.mock, timeout: 1000 });
  return sandbox.window.REVIEW_CONSOLE_MOCK;
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });

const fixture = readJson(files.fixture).controlled_visual_production_loop_review_bridge_snapshot;
const mock = loadMock();
const app = readText(files.app);
const index = readText(files.index);
const fieldMapping = readText(files.fieldMapping);
const readme = readText(files.readme);
const stateView = mock.controlled_visual_production_loop_review_bridge_seed;

add("mock_seed_matches_fixture", sameJson(stateView, fixture));
add("phase", stateView.phase === "controlled_visual_production_loop_review_bridge_gate");
add("snapshot_status", stateView.snapshot_status === "golden_static_snapshot");
add("draft_output_key", stateView.draft_output_key === "controlled_visual_production_loop_review_bridge_state");
add("review_report_binding_status", stateView.review_report_binding_status === "sample_route_bound_static_only");
add("accepted_sample_id", stateView.accepted_sample_id === "accepted_product_still_life_tennis_wallet_001");
add("failure_sample_id", stateView.failure_sample_id === "failure_tennis_wallet_v7_21_001");
add("bridge_rows_count", Array.isArray(stateView.bridge_rows) && stateView.bridge_rows.length === 2);
add("accepted_row_present", stateView.bridge_rows.some((row) => row.sample_id === "accepted_product_still_life_tennis_wallet_001" && row.review_outcome === "pass"));
add("failure_row_present", stateView.bridge_rows.some((row) => row.sample_id === "failure_tennis_wallet_v7_21_001" && row.review_outcome === "reject" && row.never_production === true));
add("summary_sample_count", stateView.bridge_summary.sample_count === 2);
add("summary_never_production_count", stateView.bridge_summary.never_production_count === 1);
add("summary_generic_report_still_present", stateView.bridge_summary.generic_review_report_handoff_still_present === true);
for (const blocker of [
  "production_candidate_requires_separate_authorization",
  "memory_write_requires_separate_authorization",
  "vcp_runtime_integration_unproven"
]) {
  add(`next_blocker_${blocker}`, stateView.next_blockers.includes(blocker));
}
for (const key of [
  "static_panel_only",
  "fetch_performed",
  "file_write_performed",
  "asset_archive_read_performed",
  "preview_loaded_or_rendered",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "production_candidate_write_performed",
  "runtime_execution_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "push_tag_release_deploy_performed",
  "vcp_runtime_integration_proven"
]) {
  add(`guard_${key}`, key === "static_panel_only" ? stateView.guard[key] === true : stateView.guard[key] === false);
}
for (const token of [
  "controlled_visual_production_loop_review_bridge_state: mock.controlled_visual_production_loop_review_bridge_seed",
  "function controlledVisualProductionLoopReviewBridgeState()",
  "function renderControlledVisualProductionLoopReviewBridge()",
  "controlled_visual_production_loop_review_bridge_state: controlledVisualProductionLoopReviewBridgeState()",
  "renderControlledVisualProductionLoopReviewBridge();"
]) {
  add(`app_token_${token}`, app.includes(token));
}
for (const token of [
  'id="controlledLoopReviewBridgeTitle"',
  'id="controlledLoopReviewBridgeSummary"',
  'id="controlledLoopReviewBridgeBody"',
  'id="controlledLoopReviewBridgeGuard"'
]) {
  add(`index_token_${token}`, index.includes(token));
}
for (const token of [
  "## P6O Controlled Visual Production Loop Review Bridge",
  "controlled_visual_production_loop_review_bridge_state",
  "sample_route_bound_static_only"
]) {
  add(`field_mapping_token_${token}`, fieldMapping.includes(token));
}
for (const token of [
  "P6O 新增 controlled visual production loop review bridge",
  "controlled_visual_production_loop_review_bridge_state"
]) {
  add(`readme_token_${token}`, readme.includes(token));
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_controlled_visual_production_loop_review_bridge",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "controlled_visual_production_loop_review_bridge_verified" : "controlled_visual_production_loop_review_bridge_failed",
  draft_output_key: stateView.draft_output_key,
  review_report_binding_status: stateView.review_report_binding_status,
  accepted_sample_id: stateView.accepted_sample_id,
  failure_sample_id: stateView.failure_sample_id,
  sample_count: stateView.bridge_summary.sample_count,
  never_production_count: stateView.bridge_summary.never_production_count,
  asset_archive_read_performed: stateView.guard.asset_archive_read_performed,
  preview_loaded_or_rendered: stateView.guard.preview_loaded_or_rendered,
  provider_contact_performed: stateView.guard.provider_contact_performed,
  plugin_call_performed: stateView.guard.plugin_call_performed,
  api_call_performed: stateView.guard.api_call_performed,
  image_generation_performed: stateView.guard.image_generation_performed,
  DailyNote_write_performed: stateView.guard.DailyNote_write_performed,
  VCP_memory_write_performed: stateView.guard.VCP_memory_write_performed,
  production_candidate_write_performed: stateView.guard.production_candidate_write_performed,
  runtime_execution_performed: stateView.guard.runtime_execution_performed,
  real_manifest_read_performed: stateView.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: stateView.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: stateView.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: stateView.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: stateView.guard.vcp_runtime_integration_proven,
  check_count: checks.length,
  failed_count: failed.length,
  checks,
  failures: failed
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
