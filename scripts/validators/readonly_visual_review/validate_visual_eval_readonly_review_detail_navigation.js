#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyReviewDetailNavigation,
} = require("../../../kernel/visual_eval_readonly_review_detail_navigation");
const {
  loadReadonlyReviewDetailView,
} = require("../../../kernel/visual_eval_readonly_review_detail_view");

const root = path.resolve(__dirname, "../../..");
const navigationPath = "tests/schema_examples/visual_eval_readonly_review_detail_navigation.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_detail_navigation_negative_cases.example.json";
const surfacePath = "tests/schema_examples/visual_eval_readonly_review_surface_snapshot.example.json";
const collectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const selectedReviewResultId = "visual_eval_review_result_patch_synthetic_001";
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedNegativeCases = new Map([
  ["selected_id_not_in_navigation", "navigation_selected_id_resolves"],
  ["navigation_item_outcome_mismatch", "navigation_item_matches_detail_outcome"],
  ["unknown_navigation_route_action", "navigation_selector_route_action_readonly"],
  ["detail_guard_provider_true", "navigation_selected_detail_guard_provider_false"],
  ["absolute_local_source_surface", "navigation_no_absolute_or_loopback"],
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
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_review_detail_navigation.js"), ...args], {
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

function applyMutation(navigation, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(navigation, negativeCase.mutation.field, negativeCase.mutation.value);
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
    addResult("navigation_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function detailFor(navigation, reviewResultId) {
  return loadReadonlyReviewDetailView({
    surfacePath: navigation.source_surface_snapshot,
    collectionConsumerPath: navigation.source_collection_consumer,
    reviewResultId,
  });
}

function validateNavigationShape(navigation) {
  addResult("navigation_type_expected", navigation.navigation_type === "metadata_only_visual_eval_readonly_review_detail_navigation");
  addResult("navigation_status_ready", navigation.status === "readonly_detail_navigation_ready");
  addResult("navigation_source_surface_expected", navigation.source_surface_snapshot === surfacePath);
  addResult("navigation_source_collection_consumer_expected", navigation.source_collection_consumer === collectionConsumerPath);
  addResult("navigation_source_detail_kernel_expected", navigation.source_detail_kernel === "kernel/visual_eval_readonly_review_detail_view.js");
  addResult("navigation_no_absolute_or_loopback", !hasAbsoluteOrLoopback(navigation));
  addResult("navigation_contract_metadata_only_true", navigation.navigation_contract?.metadata_only === true);
  addResult("navigation_contract_read_only_true", navigation.navigation_contract?.read_only === true);
  addResult("navigation_contract_detail_loadable_true", navigation.navigation_contract?.all_navigation_items_detail_loadable === true);
  addResult("navigation_contract_write_allowed_false", navigation.navigation_contract?.write_allowed === false);
  addResult("navigation_available_outcomes_exact", sameSet(navigation.available_outcomes, expectedOutcomes));
  addResult("navigation_items_count_three", (navigation.navigation_items || []).length === 3);
  addResult("navigation_items_outcomes_exact", sameSet((navigation.navigation_items || []).map((item) => item.outcome), expectedOutcomes));

  const selectedItems = (navigation.navigation_items || []).filter((item) => item.review_result_id === navigation.selected_review_result_id);
  addResult("navigation_selected_id_resolves", selectedItems.length === 1, navigation.selected_review_result_id);
  addResult("navigation_selected_flag_exactly_one", (navigation.navigation_items || []).filter((item) => item.selected === true).length === 1);
  addResult("navigation_selected_flag_matches_selected_id", selectedItems[0]?.selected === true);
  addResult("navigation_selected_detail_matches_selected_id", navigation.selected_detail?.selected_review_result_id === navigation.selected_review_result_id);

  for (const item of navigation.navigation_items || []) {
    const detail = detailFor(navigation, item.review_result_id);
    addResult("navigation_selector_kernel_expected", item.detail_selector?.detail_kernel === "kernel/visual_eval_readonly_review_detail_view.js", item.review_result_id);
    addResult("navigation_selector_review_result_matches_item", item.detail_selector?.review_result_id === item.review_result_id, item.review_result_id);
    addResult("navigation_selector_route_action_readonly", item.detail_selector?.route_action === "load_readonly_detail_only", item.review_result_id);
    addResult("navigation_selector_write_allowed_false", item.detail_selector?.write_allowed === false, item.review_result_id);
    addResult("navigation_item_matches_detail_candidate", item.candidate_id === detail.selected_card?.candidate_id, item.review_result_id);
    addResult("navigation_item_matches_detail_outcome", item.outcome === detail.selected_card?.outcome, item.review_result_id);
    addResult("navigation_item_matches_detail_next_action", item.next_review_action === detail.selected_card?.next_review_action, item.review_result_id);
    addResult("navigation_item_matches_detail_metadata_action", item.metadata_accumulation_action === detail.selected_card?.metadata_accumulation_action, item.review_result_id);
  }

  addResult("navigation_selected_detail_guard_provider_false", navigation.selected_detail?.guard?.provider_contact_performed === false);
  addResult("navigation_selected_detail_guard_memory_false", navigation.selected_detail?.guard?.memory_write_performed === false);
  for (const [field, expected] of Object.entries(navigation.guard || {})) {
    addResult(`navigation_guard_${field}_${expected}`, navigation.guard[field] === expected);
  }
}

function validatePositiveCase(navigation) {
  const directPayload = loadReadonlyReviewDetailNavigation({
    surfacePath,
    collectionConsumerPath,
    selectedReviewResultId,
  });
  const cliPayload = runCli([
    "--surface", surfacePath,
    "--collection-consumer", collectionConsumerPath,
    "--selected-review-result-id", selectedReviewResultId,
  ]);
  addResult("direct_navigation_matches_cli_navigation", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_navigation_matches_example_navigation", JSON.stringify(directPayload) === JSON.stringify(navigation));
  validateNavigationShape(navigation);
}

function validateNegativeCases(navigation, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_detail_navigation_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_navigation_expected", negativeCases.source_navigation === navigationPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(navigation));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateNavigationShape(mutated));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${navigationPath}_exists`, fs.existsSync(repoPath(navigationPath)), navigationPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  const navigation = readJson(navigationPath);
  const negativeCases = readJson(negativeCasesPath);
  addResult("navigation_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  validatePositiveCase(navigation);
  validateNegativeCases(navigation, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_detail_navigation",
    passed,
    navigation: navigationPath,
    negative_cases: negativeCasesPath,
    navigation_item_count: navigation.navigation_items?.length || 0,
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
    validator: "validate_visual_eval_readonly_review_detail_navigation",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
