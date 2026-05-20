#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const files = {
  fixture: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_CONTRACT.example.json",
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

const fixture = readJson(files.fixture).controlled_visual_production_loop_contract_snapshot;
const mock = loadMock();
const app = readText(files.app);
const index = readText(files.index);
const fieldMapping = readText(files.fieldMapping);
const readme = readText(files.readme);
const stateView = mock.controlled_visual_production_loop_contract_seed;

add("mock_seed_matches_fixture", sameJson(stateView, fixture));
add("phase", stateView.phase === "controlled_visual_production_loop_review_bridge_gate");
add("snapshot_status", stateView.snapshot_status === "golden_static_snapshot");
add("draft_output_key", stateView.draft_output_key === "controlled_visual_production_loop_contract");
add("route_alignment_status", stateView.route_alignment_status === "capsule_archive_review_bridge_aligned_authorization_pending");
add("accepted_sample_id", stateView.accepted_sample_id === "accepted_product_still_life_tennis_wallet_001");
add("failure_sample_id", stateView.failure_sample_id === "failure_tennis_wallet_v7_21_001");
add("resolved_by_accepted_sample", stateView.resolved_by_accepted_sample === "accepted_product_still_life_tennis_wallet_001");
add("aligned_segment_count", stateView.alignment_summary.aligned_segment_count === 5);
add("blocked_segment_count", stateView.alignment_summary.blocked_segment_count === 0);
add("review_report_contract_present", stateView.alignment_summary.review_report_contract_present === true);
add("review_report_sample_bound_now", stateView.alignment_summary.review_report_sample_bound_now === true);
add("route_segments_count", Array.isArray(stateView.route_segments) && stateView.route_segments.length === 5);
add("review_report_segment_aligned", stateView.route_segments.some((segment) => segment.segment === "review_report_binding" && segment.status === "aligned" && segment.sample_bound_now === true && segment.binding_status === "sample_route_bound_static_only"));
add("review_report_bridge_generic_template_detected", stateView.review_report_bridge.generic_candidate_template_detected === true);
add("review_report_bridge_sample_bound_now", stateView.review_report_bridge.sample_bound_now === true);
add("next_blockers_count", Array.isArray(stateView.next_blockers) && stateView.next_blockers.length === 3);
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
  "controlled_visual_production_loop_contract: mock.controlled_visual_production_loop_contract_seed",
  "function controlledVisualProductionLoopContractState()",
  "function renderControlledVisualProductionLoopContract()",
  "controlled_visual_production_loop_contract: controlledVisualProductionLoopContractState()",
  "renderControlledVisualProductionLoopContract();"
]) {
  add(`app_token_${token}`, app.includes(token));
}
for (const token of [
  'id="controlledLoopTitle"',
  'id="controlledLoopSummary"',
  'id="controlledLoopBody"',
  'id="controlledLoopGuard"'
]) {
  add(`index_token_${token}`, index.includes(token));
}
for (const token of [
  "## P6N Controlled Visual Production Loop Contract",
  "controlled_visual_production_loop_contract",
  "sample_route_bound_static_only",
  "capsule_archive_review_bridge_aligned_authorization_pending"
]) {
  add(`field_mapping_token_${token}`, fieldMapping.includes(token));
}
for (const token of [
  "P6N 新增 controlled visual production loop contract",
  "controlled_visual_production_loop_contract"
]) {
  add(`readme_token_${token}`, readme.includes(token));
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_controlled_visual_production_loop_contract",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "controlled_visual_production_loop_contract_verified" : "controlled_visual_production_loop_contract_failed",
  draft_output_key: stateView.draft_output_key,
  route_alignment_status: stateView.route_alignment_status,
  accepted_sample_id: stateView.accepted_sample_id,
  failure_sample_id: stateView.failure_sample_id,
  review_report_sample_bound_now: stateView.alignment_summary.review_report_sample_bound_now,
  aligned_segment_count: stateView.alignment_summary.aligned_segment_count,
  blocked_segment_count: stateView.alignment_summary.blocked_segment_count,
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
