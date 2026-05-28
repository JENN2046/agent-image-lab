#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { loadReadonlyReviewWorkspace } = require("../../../kernel/visual_eval_readonly_review_workspace");

const root = path.resolve(__dirname, "../../..");
const workspacePath = "tests/schema_examples/visual_eval_readonly_review_workspace.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_workspace_negative_cases.example.json";
const sessionDrilldownPath = "tests/schema_examples/visual_eval_readonly_review_session_drilldown.example.json";
const metadataNavigationPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_detail_navigation.example.json";
const expectedSelectedId = "visual_eval_review_result_patch_synthetic_001";
const expectedNegativeCases = new Map([
  ["wrong_selected_result_id", "workspace_selected_result_matches_sources"],
  ["missing_metadata_queue_panel", "workspace_metadata_queue_panel_present"],
  ["selected_outcome_mismatch", "workspace_selected_outcome_matches"],
  ["guard_api_true", "workspace_guard_api_call_performed_false"],
  ["absolute_local_source_session", "workspace_no_absolute_or_loopback"],
]);

const results = [];
const errors = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`path escapes repository root: ${relativePath}`);
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
  if (typeof value === "string") return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function runCli(args) {
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_review_workspace.js"), ...args], {
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
  if (Array.isArray(cursor)) cursor[Number(last)] = value;
  else cursor[last] = value;
}

function applyMutation(workspace, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(workspace, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "delete_field") {
    const segments = negativeCase.mutation.field.split(".");
    let cursor = workspace;
    for (let index = 0; index < segments.length - 1; index += 1) cursor = cursor[segments[index]];
    delete cursor[segments[segments.length - 1]];
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
    addResult("workspace_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function validateWorkspaceShape(workspace, sessionDrilldown, metadataNavigation) {
  addResult("workspace_type_expected", workspace.workspace_type === "metadata_only_visual_eval_readonly_review_workspace");
  addResult("workspace_status_ready", workspace.status === "readonly_review_workspace_ready");
  addResult("workspace_source_session_expected", workspace.source_session_drilldown === sessionDrilldownPath);
  addResult("workspace_source_metadata_navigation_expected", workspace.source_metadata_queue_navigation === metadataNavigationPath);
  addResult("workspace_no_absolute_or_loopback", !hasAbsoluteOrLoopback(workspace));
  addResult("workspace_selected_result_matches_sources", workspace.selected_review_result_id === sessionDrilldown.selected_review_result_id && workspace.selected_review_result_id === metadataNavigation.selected_detail?.selected_review_result_id);
  addResult("workspace_contract_route_action_expected", workspace.workspace_contract?.route_action === "render_readonly_review_workspace_only");
  addResult("workspace_contract_write_allowed_false", workspace.workspace_contract?.write_allowed === false);
  addResult("workspace_session_panel_present", Boolean(workspace.review_session_panel?.session_id));
  addResult("workspace_metadata_queue_panel_present", Boolean(workspace.metadata_queue_panel?.selected_navigation_key));
  addResult("workspace_image_case_panel_present", Boolean(workspace.image_case_panel?.case_id));
  addResult("workspace_taxonomy_panel_present", Array.isArray(workspace.taxonomy_panel?.failure_tags));
  addResult("workspace_selected_id_expected", workspace.selected_review_result_id === expectedSelectedId);
  addResult("workspace_selected_outcome_matches", workspace.selected_result_panel?.outcome === sessionDrilldown.selected_review_row?.outcome && workspace.selected_result_panel?.outcome === metadataNavigation.selected_detail?.selected_card?.outcome);
  addResult("workspace_selected_case_matches", workspace.image_case_panel?.case_id === sessionDrilldown.selected_image_case?.case_id && workspace.image_case_panel?.case_id === metadataNavigation.selected_detail?.selected_card?.case_id);
  addResult("workspace_next_action_matches", workspace.selected_result_panel?.next_review_action === sessionDrilldown.selected_metadata_accumulation?.metadata_accumulation?.next_review_action && workspace.selected_result_panel?.next_review_action === metadataNavigation.selected_detail?.selected_card?.next_review_action);
  addResult("workspace_outcome_tabs_exact", sameSet((workspace.review_session_panel?.outcome_tabs || []).map((tab) => tab.outcome), ["pass", "patch", "reject"]));
  addResult("workspace_selected_metadata_sections_present", (workspace.metadata_queue_panel?.section_membership || []).includes("patch_plan_only") && (workspace.metadata_queue_panel?.section_membership || []).includes("archive_references"));
  addResult("workspace_metadata_navigation_count_matches", workspace.metadata_queue_panel?.navigation_item_count === (metadataNavigation.navigation_items || []).length);
  addResult("workspace_route_guard_write_allowed_false", workspace.readonly_route_guard_summary?.write_allowed === false);
  for (const [field, expected] of Object.entries(workspace.guard || {})) {
    addResult(`workspace_guard_${field}_${expected}`, workspace.guard[field] === expected);
  }
  addResult("workspace_guard_api_call_performed_false", workspace.guard?.api_call_performed === false);
}

function validatePositiveCase(workspace, sessionDrilldown, metadataNavigation) {
  const directPayload = loadReadonlyReviewWorkspace({ sessionDrilldownPath, metadataNavigationPath });
  const cliPayload = runCli(["--session-drilldown", sessionDrilldownPath, "--metadata-navigation", metadataNavigationPath]);
  addResult("direct_workspace_matches_cli", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_workspace_matches_example", JSON.stringify(directPayload) === JSON.stringify(workspace));
  validateWorkspaceShape(workspace, sessionDrilldown, metadataNavigation);
}

function validateNegativeCases(workspace, sessionDrilldown, metadataNavigation, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_workspace_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_workspace_expected", negativeCases.source_workspace === workspacePath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);
  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(workspace));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateWorkspaceShape(mutated, sessionDrilldown, metadataNavigation));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${workspacePath}_exists`, fs.existsSync(repoPath(workspacePath)), workspacePath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${sessionDrilldownPath}_exists`, fs.existsSync(repoPath(sessionDrilldownPath)), sessionDrilldownPath);
  addResult(`${metadataNavigationPath}_exists`, fs.existsSync(repoPath(metadataNavigationPath)), metadataNavigationPath);
  const workspace = readJson(workspacePath);
  const negativeCases = readJson(negativeCasesPath);
  const sessionDrilldown = readJson(sessionDrilldownPath);
  const metadataNavigation = readJson(metadataNavigationPath);
  validatePositiveCase(workspace, sessionDrilldown, metadataNavigation);
  validateNegativeCases(workspace, sessionDrilldown, metadataNavigation, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_workspace",
    passed,
    workspace: workspacePath,
    session_drilldown: sessionDrilldownPath,
    metadata_navigation: metadataNavigationPath,
    negative_cases: negativeCasesPath,
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
  process.stderr.write(`${JSON.stringify({ validator: "validate_visual_eval_readonly_review_workspace", passed: false, errors }, null, 2)}\n`);
  process.exitCode = 1;
}
