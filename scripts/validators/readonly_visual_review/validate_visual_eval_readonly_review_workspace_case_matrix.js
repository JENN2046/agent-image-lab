#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { loadReadonlyReviewWorkspaceCaseMatrix } = require("../../../kernel/visual_eval_readonly_review_workspace_case_matrix");

const root = path.resolve(__dirname, "../../..");
const matrixPath = "tests/schema_examples/visual_eval_readonly_review_workspace_case_matrix.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_workspace_case_matrix_negative_cases.example.json";
const workspacePath = "tests/schema_examples/visual_eval_readonly_review_workspace.example.json";
const collectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const metadataNavigationPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_detail_navigation.example.json";
const expectedNegativeCases = new Map([
  ["missing_reject_row", "case_matrix_row_count_three"],
  ["patch_next_action_mismatch", "case_matrix_patch_next_action_expected"],
  ["pass_missing_metadata_sections", "case_matrix_all_rows_have_sections"],
  ["guard_memory_true", "case_matrix_guard_memory_write_performed_false"],
  ["absolute_local_source_workspace", "case_matrix_no_absolute_or_loopback"],
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

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function runCli(args) {
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_review_workspace_case_matrix.js"), ...args], {
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

function applyMutation(matrix, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(matrix, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_row_by_outcome") {
    matrix.case_rows = matrix.case_rows.filter((row) => row.outcome !== negativeCase.mutation.outcome);
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
    addResult("case_matrix_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function validateMatrixShape(matrix, workspace, collectionConsumer, metadataNavigation) {
  addResult("case_matrix_type_expected", matrix.matrix_type === "metadata_only_visual_eval_readonly_review_workspace_case_matrix");
  addResult("case_matrix_status_ready", matrix.status === "readonly_review_workspace_case_matrix_ready");
  addResult("case_matrix_source_workspace_expected", matrix.source_workspace === workspacePath);
  addResult("case_matrix_source_collection_expected", matrix.source_collection_consumer === collectionConsumerPath);
  addResult("case_matrix_source_metadata_navigation_expected", matrix.source_metadata_queue_navigation === metadataNavigationPath);
  addResult("case_matrix_no_absolute_or_loopback", !hasAbsoluteOrLoopback(matrix));
  addResult("case_matrix_selected_id_matches_workspace", matrix.selected_review_result_id === workspace.selected_review_result_id);
  addResult("case_matrix_contract_route_action_expected", matrix.matrix_contract?.route_action === "render_readonly_review_workspace_case_matrix_only");
  addResult("case_matrix_contract_write_allowed_false", matrix.matrix_contract?.write_allowed === false);
  addResult("case_matrix_row_count_three", (matrix.case_rows || []).length === 3);
  addResult("case_matrix_outcomes_exact", sameSet((matrix.case_rows || []).map((row) => row.outcome), ["pass", "patch", "reject"]));
  addResult("case_matrix_one_selected_row", (matrix.case_rows || []).filter((row) => row.selected).length === 1);
  addResult("case_matrix_all_rows_have_sections", (matrix.case_rows || []).every((row) => Array.isArray(row.metadata_queue_sections) && row.metadata_queue_sections.length > 0));
  addResult("case_matrix_all_rows_have_reasons", (matrix.case_rows || []).every((row) => Array.isArray(row.reasons) && row.reasons.length > 0));
  addResult("case_matrix_pass_sections_expected", (matrix.case_rows || []).find((row) => row.outcome === "pass")?.metadata_queue_sections.includes("accepted_metadata_candidates"));
  addResult("case_matrix_patch_sections_expected", (matrix.case_rows || []).find((row) => row.outcome === "patch")?.metadata_queue_sections.includes("patch_plan_only"));
  addResult("case_matrix_reject_sections_expected", (matrix.case_rows || []).find((row) => row.outcome === "reject")?.metadata_queue_sections.includes("failure_learning_metadata"));
  addResult("case_matrix_patch_next_action_expected", (matrix.case_rows || []).find((row) => row.outcome === "patch")?.next_review_action === "write_patch_plan_only");
  addResult("case_matrix_reject_next_action_expected", (matrix.case_rows || []).find((row) => row.outcome === "reject")?.next_review_action === "defer_until_taxonomy_update");
  addResult("case_matrix_collection_rows_mapped", (collectionConsumer.collection_rows || []).every((row) => (matrix.case_rows || []).some((item) => item.review_result_id === row.review_result_id && item.summary === row.summary)));
  addResult("case_matrix_navigation_keys_resolve", (matrix.case_rows || []).every((row) => (row.metadata_navigation_keys || []).every((key) => (metadataNavigation.navigation_items || []).some((item) => item.navigation_key === key))));
  addResult("case_matrix_route_guard_write_allowed_false", matrix.readonly_route_guard_summary?.write_allowed === false);
  for (const [field, expected] of Object.entries(matrix.guard || {})) {
    addResult(`case_matrix_guard_${field}_${expected}`, matrix.guard[field] === expected);
  }
  addResult("case_matrix_guard_memory_write_performed_false", matrix.guard?.memory_write_performed === false);
}

function validatePositiveCase(matrix, workspace, collectionConsumer, metadataNavigation) {
  const directPayload = loadReadonlyReviewWorkspaceCaseMatrix({ workspacePath, collectionConsumerPath, metadataNavigationPath });
  const cliPayload = runCli(["--workspace", workspacePath, "--collection-consumer", collectionConsumerPath, "--metadata-navigation", metadataNavigationPath]);
  addResult("direct_case_matrix_matches_cli", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_case_matrix_matches_example", JSON.stringify(directPayload) === JSON.stringify(matrix));
  validateMatrixShape(matrix, workspace, collectionConsumer, metadataNavigation);
}

function validateNegativeCases(matrix, workspace, collectionConsumer, metadataNavigation, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_workspace_case_matrix_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_matrix_expected", negativeCases.source_matrix === matrixPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);
  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(matrix));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateMatrixShape(mutated, workspace, collectionConsumer, metadataNavigation));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${matrixPath}_exists`, fs.existsSync(repoPath(matrixPath)), matrixPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${workspacePath}_exists`, fs.existsSync(repoPath(workspacePath)), workspacePath);
  addResult(`${collectionConsumerPath}_exists`, fs.existsSync(repoPath(collectionConsumerPath)), collectionConsumerPath);
  addResult(`${metadataNavigationPath}_exists`, fs.existsSync(repoPath(metadataNavigationPath)), metadataNavigationPath);
  const matrix = readJson(matrixPath);
  const negativeCases = readJson(negativeCasesPath);
  const workspace = readJson(workspacePath);
  const collectionConsumer = readJson(collectionConsumerPath);
  const metadataNavigation = readJson(metadataNavigationPath);
  validatePositiveCase(matrix, workspace, collectionConsumer, metadataNavigation);
  validateNegativeCases(matrix, workspace, collectionConsumer, metadataNavigation, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_workspace_case_matrix",
    passed,
    matrix: matrixPath,
    workspace: workspacePath,
    collection_consumer: collectionConsumerPath,
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
  process.stderr.write(`${JSON.stringify({ validator: "validate_visual_eval_readonly_review_workspace_case_matrix", passed: false, errors }, null, 2)}\n`);
  process.exitCode = 1;
}
