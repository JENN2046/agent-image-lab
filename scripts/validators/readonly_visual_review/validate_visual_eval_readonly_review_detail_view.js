#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  defaultReviewResultId,
  loadReadonlyReviewDetailView,
} = require("../../../kernel/visual_eval_readonly_review_detail_view");

const root = path.resolve(__dirname, "../../..");
const detailPath = "tests/schema_examples/visual_eval_readonly_review_detail_view.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_detail_view_negative_cases.example.json";
const surfacePath = "tests/schema_examples/visual_eval_readonly_review_surface_snapshot.example.json";
const collectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const expectedNegativeCases = new Map([
  ["selected_id_missing_from_surface", "detail_selected_id_resolves"],
  ["selected_card_outcome_mismatch", "detail_card_outcome_matches_collection"],
  ["selected_card_next_action_mismatch", "detail_card_next_action_matches_collection"],
  ["detail_guard_memory_true", "detail_guard_memory_write_performed_false"],
  ["absolute_local_surface_source", "detail_no_absolute_or_loopback"],
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

function runCli(relativeScript, args) {
  const result = spawnSync(process.execPath, [repoPath(relativeScript), ...args], {
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
    cursor = cursor[segments[index]];
  }
  cursor[segments[segments.length - 1]] = value;
}

function applyMutation(detail, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(detail, negativeCase.mutation.field, negativeCase.mutation.value);
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
    addResult("detail_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function surfaceCardIds(surface) {
  return new Set((surface.surface?.outcome_lanes || []).flatMap((lane) => (lane.cards || []).map((card) => card.review_result_id)));
}

function collectionRowMap(collectionConsumer) {
  return new Map((collectionConsumer.collection_rows || []).map((row) => [row.review_result_id, row]));
}

function validateDetailShape(detail, surface, collectionConsumer) {
  addResult("detail_view_type_expected", detail.detail_view_type === "metadata_only_visual_eval_readonly_review_detail_view");
  addResult("detail_status_ready", detail.status === "readonly_detail_view_ready");
  addResult("detail_source_surface_expected", detail.source_surface_snapshot === surfacePath);
  addResult("detail_source_collection_consumer_expected", detail.source_collection_consumer === collectionConsumerPath);
  addResult("detail_no_absolute_or_loopback", !hasAbsoluteOrLoopback(detail));
  addResult("detail_selected_id_expected", detail.selected_review_result_id === defaultReviewResultId);

  const selectedIdResolves = surfaceCardIds(surface).has(detail.selected_review_result_id);
  addResult("detail_selected_id_resolves", selectedIdResolves, detail.selected_review_result_id);
  const row = collectionRowMap(collectionConsumer).get(detail.selected_review_result_id);
  addResult("detail_selected_row_resolves", Boolean(row), detail.selected_review_result_id);
  if (row) {
    addResult("detail_card_candidate_matches_collection", detail.selected_card?.candidate_id === row.candidate_id);
    addResult("detail_card_outcome_matches_collection", detail.selected_card?.outcome === row.outcome);
    addResult("detail_card_next_action_matches_collection", detail.selected_card?.next_review_action === row.next_review_action);
    addResult("detail_card_metadata_action_matches_collection", detail.selected_card?.metadata_accumulation_action === row.metadata_accumulation_action);
    addResult("detail_row_summary_matches_collection", detail.collection_row_detail?.summary === row.summary);
    addResult("detail_row_taxonomy_count_matches_collection", (detail.collection_row_detail?.failure_taxonomy || []).length === (row.failure_taxonomy || []).length);
  }
  addResult("detail_patch_taxonomy_membership_present", (detail.selected_card?.taxonomy_section_membership || []).includes("material_failed") && (detail.selected_card?.taxonomy_section_membership || []).includes("lighting_failed"));
  addResult("detail_patch_next_action_membership_present", (detail.selected_card?.next_action_queue_membership || []).includes("write_patch_plan_only"));

  for (const [field, expected] of Object.entries(detail.guard || {})) {
    addResult(`detail_guard_${field}_${expected}`, detail.guard[field] === expected);
  }
  addResult("detail_guard_memory_write_performed_false", detail.guard?.memory_write_performed === false);
}

function validatePositiveCase(detail, surface, collectionConsumer) {
  const directPayload = loadReadonlyReviewDetailView({ surfacePath, collectionConsumerPath, reviewResultId: defaultReviewResultId });
  const cliPayload = runCli("kernel/visual_eval_readonly_review_detail_view.js", [
    "--surface", surfacePath,
    "--collection-consumer", collectionConsumerPath,
    "--review-result-id", defaultReviewResultId,
  ]);
  addResult("direct_detail_matches_cli_detail", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_detail_matches_example_detail", JSON.stringify(directPayload) === JSON.stringify(detail));
  validateDetailShape(detail, surface, collectionConsumer);
}

function validateNegativeCases(detail, surface, collectionConsumer, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_detail_view_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_detail_expected", negativeCases.source_detail_view === detailPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(detail));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateDetailShape(mutated, surface, collectionConsumer));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${detailPath}_exists`, fs.existsSync(repoPath(detailPath)), detailPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${surfacePath}_exists`, fs.existsSync(repoPath(surfacePath)), surfacePath);
  addResult(`${collectionConsumerPath}_exists`, fs.existsSync(repoPath(collectionConsumerPath)), collectionConsumerPath);
  const detail = readJson(detailPath);
  const negativeCases = readJson(negativeCasesPath);
  const surface = readJson(surfacePath);
  const collectionConsumer = readJson(collectionConsumerPath);
  addResult("detail_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  addResult("surface_json_parseable", true);
  addResult("collection_consumer_json_parseable", true);
  validatePositiveCase(detail, surface, collectionConsumer);
  validateNegativeCases(detail, surface, collectionConsumer, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_detail_view",
    passed,
    detail: detailPath,
    surface: surfacePath,
    collection_consumer: collectionConsumerPath,
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
  process.stderr.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_detail_view",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
