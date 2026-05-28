#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyMetadataAccumulationQueueDetailNavigation,
} = require("../../../kernel/visual_eval_readonly_metadata_accumulation_queue_detail_navigation");

const root = path.resolve(__dirname, "../../..");
const navigationPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_detail_navigation.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_detail_navigation_negative_cases.example.json";
const surfacePath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.example.json";
const detailPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_detail_view.example.json";
const selectedKey = "patch_plan_only:visual_eval_review_result_patch_synthetic_001";
const expectedNegativeCases = new Map([
  ["missing_selected_item", "metadata_queue_navigation_selected_item_present"],
  ["wrong_route_action", "metadata_queue_navigation_route_action_expected"],
  ["guard_provider_true", "metadata_queue_navigation_guard_provider_contact_performed_false"],
  ["absolute_local_source_surface", "metadata_queue_navigation_no_absolute_or_loopback"],
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
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_metadata_accumulation_queue_detail_navigation.js"), ...args], {
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

function applyMutation(navigation, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(navigation, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_selected_item") {
    navigation.navigation_items = navigation.navigation_items.filter((item) => item.navigation_key !== navigation.selected_navigation_key);
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
    addResult("metadata_queue_navigation_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function surfaceCardCount(surface) {
  return (surface.surface?.section_lanes || []).reduce((sum, lane) => sum + (lane.cards || []).length, 0);
}

function validateNavigationShape(navigation, surface, detail) {
  addResult("metadata_queue_navigation_type_expected", navigation.navigation_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_detail_navigation");
  addResult("metadata_queue_navigation_status_ready", navigation.status === "readonly_metadata_accumulation_queue_detail_navigation_ready");
  addResult("metadata_queue_navigation_source_surface_expected", navigation.source_surface_snapshot === surfacePath);
  addResult("metadata_queue_navigation_no_absolute_or_loopback", !hasAbsoluteOrLoopback(navigation));
  addResult("metadata_queue_navigation_selected_key_matches", navigation.selected_navigation_key === selectedKey);
  addResult("metadata_queue_navigation_item_count_matches_surface", (navigation.navigation_items || []).length === surfaceCardCount(surface));
  addResult("metadata_queue_navigation_selected_item_present", (navigation.navigation_items || []).some((item) => item.navigation_key === navigation.selected_navigation_key && item.selected === true));
  addResult("metadata_queue_navigation_selected_detail_matches", navigation.selected_detail?.selected_section_id === detail.selected_section_id && navigation.selected_detail?.selected_review_result_id === detail.selected_review_result_id);
  addResult("metadata_queue_navigation_route_action_expected", (navigation.navigation_items || []).every((item) => item.detail_selector?.route_action === "load_readonly_metadata_queue_detail_only"));
  addResult("metadata_queue_navigation_write_allowed_false", navigation.navigation_contract?.write_allowed === false && (navigation.navigation_items || []).every((item) => item.detail_selector?.write_allowed === false));
  addResult("metadata_queue_navigation_all_items_detail_loadable", navigation.navigation_contract?.all_navigation_items_detail_loadable === true);

  for (const [field, expected] of Object.entries(navigation.guard || {})) {
    addResult(`metadata_queue_navigation_guard_${field}_${expected}`, navigation.guard[field] === expected);
  }
  addResult("metadata_queue_navigation_guard_provider_contact_performed_false", navigation.guard?.provider_contact_performed === false);
}

function validatePositiveCase(navigation, surface, detail) {
  const directPayload = loadReadonlyMetadataAccumulationQueueDetailNavigation({ surfacePath });
  const cliPayload = runCli(["--surface", surfacePath]);
  addResult("direct_metadata_queue_navigation_matches_cli_navigation", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_metadata_queue_navigation_matches_example_navigation", JSON.stringify(directPayload) === JSON.stringify(navigation));
  validateNavigationShape(navigation, surface, detail);
}

function validateNegativeCases(navigation, surface, detail, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_detail_navigation_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_navigation_expected", negativeCases.source_navigation === navigationPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);
  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(navigation));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateNavigationShape(mutated, surface, detail));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${navigationPath}_exists`, fs.existsSync(repoPath(navigationPath)), navigationPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${surfacePath}_exists`, fs.existsSync(repoPath(surfacePath)), surfacePath);
  addResult(`${detailPath}_exists`, fs.existsSync(repoPath(detailPath)), detailPath);
  const navigation = readJson(navigationPath);
  const negativeCases = readJson(negativeCasesPath);
  const surface = readJson(surfacePath);
  const detail = readJson(detailPath);
  validatePositiveCase(navigation, surface, detail);
  validateNegativeCases(navigation, surface, detail, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue_detail_navigation",
    passed,
    navigation: navigationPath,
    surface: surfacePath,
    detail_view: detailPath,
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
  process.stderr.write(`${JSON.stringify({ validator: "validate_visual_eval_readonly_metadata_accumulation_queue_detail_navigation", passed: false, errors }, null, 2)}\n`);
  process.exitCode = 1;
}
