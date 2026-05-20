#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const files = {
  fixture: "tests/schema_examples/REVIEW_CONSOLE_FULL_ASSET_ARCHIVE_BASELINE_STATE.example.json",
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

const fixture = readJson(files.fixture).review_console_full_asset_archive_baseline_state_snapshot;
const mock = loadMock();
const app = readText(files.app);
const index = readText(files.index);
const fieldMapping = readText(files.fieldMapping);
const readme = readText(files.readme);
const stateView = mock.full_asset_archive_baseline_state_seed;

add("mock_seed_matches_fixture", sameJson(stateView, fixture));
add("phase", stateView.phase === "review_console_full_asset_archive_baseline_bridge_gate");
add("snapshot_status", stateView.snapshot_status === "golden_static_snapshot");
add("draft_output_key", stateView.draft_output_key === "full_asset_archive_baseline_state");
add("archive_baseline_status", stateView.archive_baseline_status === "verified_durable_archive_git_tracked");
add("storage_strategy", stateView.storage_strategy === "git_tracked_durable_archive");
add("sample_id", stateView.sample_id === "accepted_product_still_life_tennis_wallet_001");
add("preview_clone_portable_validation_status", stateView.preview_clone_portable_validation_status === "passed");
add("preview_validation_status", stateView.preview_validation_status === "git_portable_preview_evidence_verified");
add("full_archive_readiness_status", stateView.full_archive_readiness_status === "verified_durable_original_present");
add("production_candidate_write_allowed_now", stateView.production_candidate_write_allowed_now === false);
add("memory_write_allowed_now", stateView.memory_write_allowed_now === false);
add("separate_a5_required_for_new_copy_or_overwrite", stateView.separate_a5_required_for_new_copy_or_overwrite === true);
add("next_blockers_count", Array.isArray(stateView.next_blockers) && stateView.next_blockers.length === 3);
for (const key of [
  "static_panel_only",
  "fetch_performed",
  "file_write_performed",
  "asset_archive_read_performed",
  "preview_loaded_or_rendered",
  "preview_creation_or_copy_performed",
  "runs_mutation_performed",
  "source_image_binary_read_performed",
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
  "full_asset_archive_baseline_state: mock.full_asset_archive_baseline_state_seed",
  "function fullAssetArchiveBaselineState()",
  "function renderFullAssetArchiveBaseline()",
  "full_asset_archive_baseline_state: fullAssetArchiveBaselineState()",
  "renderFullAssetArchiveBaseline();"
]) {
  add(`app_token_${token}`, app.includes(token));
}
for (const token of [
  'id="fullAssetArchiveBaselineTitle"',
  'id="fullAssetArchiveBaselineSummary"',
  'id="fullAssetArchiveBaselineBody"',
  'id="fullAssetArchiveBaselineGuard"'
]) {
  add(`index_token_${token}`, index.includes(token));
}
for (const token of [
  "## P4C Full Asset Archive Baseline Bridge",
  "full_asset_archive_baseline_state",
  "verified_durable_archive_git_tracked",
  "git_tracked_durable_archive"
]) {
  add(`field_mapping_token_${token}`, fieldMapping.includes(token));
}
for (const token of [
  "P6M 新增 full asset archive baseline bridge",
  "full_asset_archive_baseline_state"
]) {
  add(`readme_token_${token}`, readme.includes(token));
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_review_console_full_asset_archive_baseline",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "review_console_full_asset_archive_baseline_verified" : "review_console_full_asset_archive_baseline_failed",
  draft_output_key: stateView.draft_output_key,
  snapshot_status: stateView.snapshot_status,
  archive_baseline_status: stateView.archive_baseline_status,
  storage_strategy: stateView.storage_strategy,
  sample_id: stateView.sample_id,
  asset_archive_read_performed: stateView.guard.asset_archive_read_performed,
  preview_loaded_or_rendered: stateView.guard.preview_loaded_or_rendered,
  preview_creation_or_copy_performed: stateView.guard.preview_creation_or_copy_performed,
  runs_mutation_performed: stateView.guard.runs_mutation_performed,
  source_image_binary_read_performed: stateView.guard.source_image_binary_read_performed,
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
  check_count: checks.length,
  failed_count: failed.length,
  checks,
  failures: failed
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
