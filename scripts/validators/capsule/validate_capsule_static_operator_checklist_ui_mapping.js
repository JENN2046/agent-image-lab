#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../../..");
const files = {
  matrix: "tests/schema_examples/CAPSULE_OPERATOR_REVIEWER_ACTION_MATRIX.example.json",
  mock: "review_console/static_prototype/mock_data.js",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
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

const matrix = readJson(files.matrix);
const mock = loadMock();
const readme = readText(files.readme);
const fieldMapping = readText(files.fieldMapping);
const checklist = mock.operator_reviewer_checklist_state;
const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });

const matrixLabels = matrix.operator_actions.map((action) => action.label);
const checklistLabels = checklist.checklist_items.map((item) => item.reviewer_action);
const failClosedLabels = ["inspect_manifest_failure", "repair_relation_link", "block_production_guard_violation", "rerun_local_validator_outside_ui"];

add("checklist_present", Boolean(checklist));
add("phase", checklist.phase === "capsule_static_operator_checklist_ui_mapping_gate");
add("draft_output_key", checklist.draft_output_key === "operator_reviewer_checklist_state");
add("source_matrix_ref", checklist.source_matrix_ref === files.matrix);
add("baseline_accepted_3", checklist.baseline.accepted === 3 && matrix.baseline.accepted === 3);
add("baseline_failure_2", checklist.baseline.failure === 2 && matrix.baseline.failure === 2);
add("baseline_total_5", checklist.baseline.total === 5 && matrix.baseline.total === 5);
add("all_matrix_actions_mapped", matrixLabels.every((label) => checklistLabels.includes(label)) && checklistLabels.length === matrixLabels.length);
add("one_pass_checklist_item", checklist.checklist_items.filter((item) => item.state === "pass").length === 1);
add("four_fail_closed_checklist_items", checklist.checklist_items.filter((item) => item.state === "fail_closed").length === 4);
add("pass_label_accept_contract_baseline", checklist.checklist_items.some((item) => item.reviewer_action === "accept_contract_baseline" && item.state === "pass"));
for (const label of failClosedLabels) {
  add(`fail_closed_checklist_${label}`, checklist.checklist_items.some((item) => item.reviewer_action === label && item.state === "fail_closed"));
}
add("all_items_are_static_text_not_buttons", checklist.checklist_items.every((item) => item.ui_affordance === "static_text_only_not_executable_button"));
add("all_items_require_human_confirmation", checklist.checklist_items.every((item) => item.required_human_confirmation === true));
for (const key of ["production_allowed", "memory_write_allowed", "runtime_action_allowed", "provider_or_api_allowed", "preview_load_allowed"]) {
  add(`all_items_block_${key}`, checklist.checklist_items.every((item) => item[key] === false));
}
for (const key of [
  "static_checklist_only",
  "executable_ui_buttons_created",
  "browser_validator_executed",
  "runtime_execution_performed",
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
  "production_candidate_write_performed",
]) {
  add(`guard_${key}`, key === "static_checklist_only" ? checklist.guard[key] === true : checklist.guard[key] === false);
}
for (const token of ["operator_reviewer_checklist_state", "static_text_only_not_executable_button", "accept_contract_baseline", "inspect_manifest_failure"]) {
  add(`readme_token_${token}`, readme.includes(token));
  add(`field_mapping_token_${token}`, fieldMapping.includes(token));
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_capsule_static_operator_checklist_ui_mapping",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "capsule_static_operator_checklist_ui_mapping_verified" : "capsule_static_operator_checklist_ui_mapping_failed",
  draft_output_key: "operator_reviewer_checklist_state",
  accepted_count: checklist.baseline.accepted,
  failure_count: checklist.baseline.failure,
  total_count: checklist.baseline.total,
  checklist_item_count: checklist.checklist_items.length,
  executable_ui_buttons_created: false,
  browser_validator_executed: false,
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
