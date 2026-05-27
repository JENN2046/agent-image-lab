#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyReviewSessionDrilldown,
} = require("../kernel/visual_eval_readonly_review_session_drilldown");

const root = path.resolve(__dirname, "..");
const drilldownPath = "tests/schema_examples/visual_eval_readonly_review_session_drilldown.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_session_drilldown_negative_cases.example.json";
const navigationPath = "tests/schema_examples/visual_eval_readonly_review_detail_navigation.example.json";
const bridgePayloadPath = "tests/schema_examples/visual_eval_review_result_review_bridge_payload.example.json";
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedNegativeCases = new Map([
  ["selected_result_missing_from_session", "drilldown_selected_result_in_session"],
  ["image_case_outcome_mismatch", "drilldown_image_case_outcome_matches"],
  ["metadata_next_action_mismatch", "drilldown_metadata_next_action_matches"],
  ["drilldown_guard_memory_true", "drilldown_guard_memory_write_performed_false"],
  ["absolute_local_bridge_payload", "drilldown_no_absolute_or_loopback"],
]);

const results = [];
const errors = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function runCli(args) {
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_review_session_drilldown.js"), ...args], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

function setByPath(target, fieldPath, value) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    cursor = Array.isArray(cursor) ? cursor[Number(segment)] : cursor[segment];
  }
  const last = segments[segments.length - 1];
  if (Array.isArray(cursor)) {
    cursor[Number(last)] = value;
  } else {
    cursor[last] = value;
  }
}

function applyMutation(drilldown, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(drilldown, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  throw new Error(`unknown mutation operation: ${negativeCase.mutation.operation}`);
}

function collectFailureCodes(fn) {
  const startResults = results.length;
  const startErrors = errors.length;
  try {
    fn();
  } catch (error) {
    addResult("drilldown_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function validateDrilldownShape(drilldown) {
  addResult("drilldown_type_expected", drilldown.drilldown_type === "metadata_only_visual_eval_readonly_review_session_drilldown");
  addResult("drilldown_status_ready", drilldown.status === "readonly_session_drilldown_ready");
  addResult("drilldown_source_navigation_expected", drilldown.source_detail_navigation === navigationPath);
  addResult("drilldown_source_bridge_payload_expected", drilldown.source_bridge_payload === bridgePayloadPath);
  addResult("drilldown_no_absolute_or_loopback", !hasAbsoluteOrLoopback(drilldown));
  addResult("drilldown_contract_metadata_only_true", drilldown.drilldown_contract?.metadata_only === true);
  addResult("drilldown_contract_read_only_true", drilldown.drilldown_contract?.read_only === true);
  addResult("drilldown_contract_write_allowed_false", drilldown.drilldown_contract?.write_allowed === false);
  addResult("drilldown_session_id_expected", drilldown.session_id === "visual_eval_review_session_synthetic_bundle_001");
  addResult("drilldown_session_status_readonly", drilldown.session_panel?.status === "draft_readonly");
  addResult("drilldown_session_outcomes_exact", sameSet(drilldown.session_panel?.final_outcomes_visible, expectedOutcomes));
  addResult("drilldown_selected_result_in_session", (drilldown.session_panel?.review_result_ids || []).includes(drilldown.selected_review_result_id));
  addResult("drilldown_selected_row_matches_selected", drilldown.selected_review_row?.review_result_id === drilldown.selected_review_result_id);
  addResult("drilldown_selected_row_outcome_patch", drilldown.selected_review_row?.outcome === "patch");
  addResult("drilldown_image_case_matches_selected", drilldown.selected_image_case?.case_id === drilldown.selected_review_row?.case_id);
  addResult("drilldown_image_case_outcome_matches", drilldown.selected_image_case?.visible_outcome === drilldown.selected_review_row?.outcome);
  addResult("drilldown_metadata_record_matches_selected", drilldown.selected_metadata_accumulation?.review_result_id === drilldown.selected_review_result_id);
  addResult("drilldown_metadata_outcome_matches", drilldown.selected_metadata_accumulation?.outcome === drilldown.selected_review_row?.outcome);
  addResult("drilldown_metadata_next_action_matches", drilldown.selected_metadata_accumulation?.metadata_accumulation?.next_review_action === drilldown.selected_image_case?.next_review_action);
  addResult("drilldown_metadata_write_allowed_false", drilldown.selected_metadata_accumulation?.write_allowed_now === false);
  addResult("drilldown_sibling_refs_count_three", (drilldown.sibling_case_refs || []).length === 3);
  addResult("drilldown_sibling_refs_outcomes_exact", sameSet((drilldown.sibling_case_refs || []).map((item) => item.visible_outcome), expectedOutcomes));
  addResult("drilldown_sibling_selected_exactly_one", (drilldown.sibling_case_refs || []).filter((item) => item.selected === true).length === 1);

  for (const [field, expected] of Object.entries(drilldown.guard || {})) {
    addResult(`drilldown_guard_${field}_${expected}`, drilldown.guard[field] === expected);
  }
  addResult("drilldown_guard_memory_write_performed_false", drilldown.guard?.memory_write_performed === false);
}

function validatePositiveCase(drilldown) {
  const directPayload = loadReadonlyReviewSessionDrilldown({ navigationPath, bridgePayloadPath });
  const cliPayload = runCli(["--navigation", navigationPath, "--bridge-payload", bridgePayloadPath]);
  addResult("direct_drilldown_matches_cli_drilldown", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_drilldown_matches_example_drilldown", JSON.stringify(directPayload) === JSON.stringify(drilldown));
  validateDrilldownShape(drilldown);
}

function validateNegativeCases(drilldown, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_session_drilldown_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_drilldown_expected", negativeCases.source_drilldown === drilldownPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(drilldown));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateDrilldownShape(mutated));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${drilldownPath}_exists`, fs.existsSync(repoPath(drilldownPath)), drilldownPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  const drilldown = readJson(drilldownPath);
  const negativeCases = readJson(negativeCasesPath);
  addResult("drilldown_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  validatePositiveCase(drilldown);
  validateNegativeCases(drilldown, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_session_drilldown",
    passed,
    drilldown: drilldownPath,
    negative_cases: negativeCasesPath,
    sibling_case_count: drilldown.sibling_case_refs?.length || 0,
    negative_case_count: negativeCases.negative_cases?.length || 0,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_written: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    production_candidate_002_started: false,
    Batch_005_started: false,
    failed_count: errors.length,
    errors,
    results,
  }, null, 2)}\n`);
  process.exitCode = passed ? 0 : 1;
}

try {
  main();
} catch (error) {
  errors.push({ check: "validator_exception", detail: error.message });
  process.stderr.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_session_drilldown",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
