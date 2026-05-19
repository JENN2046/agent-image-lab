#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  matrix: "tests/schema_examples/CAPSULE_OPERATOR_REVIEWER_ACTION_MATRIX.example.json",
  sourceFixture: "tests/schema_examples/CAPSULE_STATIC_PRODUCT_SMOKE_UNIFIED_CONTRACT.example.json",
};

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(root, relPath), "utf8"));
}

const matrix = readJson(files.matrix);
const sourceFixture = readJson(files.sourceFixture);
const sourceReport = sourceFixture.unified_capsule_contract_report;
const sourceCatalog = sourceReport.reviewer_action_catalog;
const actions = matrix.operator_actions;
const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
const labels = actions.map((action) => action.label);
const sourceLabels = sourceCatalog.map((action) => action.label);
const guard = matrix.guard;

add("phase", matrix.phase === "capsule_operator_reviewer_action_matrix_gate");
add("matrix_status", matrix.matrix_status === "static_operator_action_matrix_ready");
add("baseline_accepted_2", matrix.baseline.accepted === 2 && sourceReport.totals.accepted === 2);
add("baseline_failure_2", matrix.baseline.failure === 2 && sourceReport.totals.failure === 2);
add("baseline_total_4", matrix.baseline.total === 4 && sourceReport.totals.total === 4);
add("all_source_catalog_labels_mapped", sourceLabels.every((label) => labels.includes(label)) && labels.length === sourceLabels.length);
add("one_pass_action", actions.filter((action) => action.state === "pass").length === 1);
add("four_fail_closed_actions", actions.filter((action) => action.state === "fail_closed").length === 4);
add("pass_label_accept_contract_baseline", actions.some((action) => action.label === "accept_contract_baseline" && action.state === "pass"));
for (const label of ["inspect_manifest_failure", "repair_relation_link", "block_production_guard_violation", "rerun_local_validator_outside_ui"]) {
  add(`fail_closed_label_${label}`, actions.some((action) => action.label === label && action.state === "fail_closed"));
}
add("all_actions_have_human_action", actions.every((action) => typeof action.human_action === "string" && action.human_action.length > 20));
add("all_actions_block_production", actions.every((action) => action.production_allowed === false));
add("all_actions_block_memory_write", actions.every((action) => action.memory_write_allowed === false));
add("all_actions_block_runtime_action", actions.every((action) => action.runtime_action_allowed === false));
for (const key of [
  "static_matrix_only",
  "executable_buttons_created",
  "browser_validator_executed",
  "asset_archive_read_performed",
  "asset_archive_ui_read_performed",
  "preview_loaded_or_rendered",
  "capsule_creation_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "runtime_execution_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "production_candidate_write_performed",
  "push_tag_release_deploy_performed",
]) {
  add(`guard_${key}`, key === "static_matrix_only" ? guard[key] === true : guard[key] === false);
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_capsule_operator_reviewer_action_matrix",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "capsule_operator_reviewer_action_matrix_verified" : "capsule_operator_reviewer_action_matrix_failed",
  matrix_ref: files.matrix,
  source_fixture_ref: files.sourceFixture,
  accepted_count: matrix.baseline.accepted,
  failure_count: matrix.baseline.failure,
  total_count: matrix.baseline.total,
  pass_action_count: actions.filter((action) => action.state === "pass").length,
  fail_closed_action_count: actions.filter((action) => action.state === "fail_closed").length,
  runtime_execution_performed: false,
  asset_archive_ui_read_performed: false,
  preview_loaded_or_rendered: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  production_candidate_write_performed: false,
  check_count: checks.length,
  failed_count: failed.length,
  checks,
  failures: failed,
};
console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
