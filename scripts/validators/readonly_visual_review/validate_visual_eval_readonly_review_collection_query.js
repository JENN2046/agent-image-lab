#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyReviewCollectionQuery,
} = require("../../../kernel/visual_eval_readonly_review_collection_query");

const root = path.resolve(__dirname, "../../..");
const queryPath = "tests/schema_examples/visual_eval_readonly_review_collection_query.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_collection_query_negative_cases.example.json";
const collectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedSelectedReviewResultId = "visual_eval_review_result_patch_synthetic_001";
const expectedIndexNames = [
  "by_outcome",
  "by_taxonomy_tag",
  "by_next_review_action",
  "by_metadata_accumulation_action",
];
const expectedNegativeCases = new Map([
  ["missing_pass_outcome_index", "query_outcome_index_complete"],
  ["dangling_query_row_ref", "query_row_ref_resolves"],
  ["missing_selected_review_result_id", "collection_query_selected_patch_explicit"],
  ["selected_patch_id_drift", "selected_patch_cross_layer_consistent"],
  ["selected_patch_missing", "collection_query_selected_patch_explicit"],
  ["query_guard_memory_true", "query_guard_memory_write_performed_false"],
  ["absolute_local_source_consumer", "query_no_absolute_or_loopback"],
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

function deleteByPath(target, fieldPath) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    cursor = cursor?.[segments[index]];
  }
  if (cursor && typeof cursor === "object") delete cursor[segments[segments.length - 1]];
}

function applyMutation(query, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(query, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_field") {
    deleteByPath(query, negativeCase.mutation.field);
    return;
  }
  if (negativeCase.mutation.operation === "remove_index_key") {
    delete query.indexes[negativeCase.mutation.index][negativeCase.mutation.key];
    return;
  }
  if (negativeCase.mutation.operation === "set_first_ref_field") {
    query.indexes[negativeCase.mutation.index][negativeCase.mutation.key][0][negativeCase.mutation.field] = negativeCase.mutation.value;
    return;
  }
  throw new Error(`unknown mutation operation: ${negativeCase.mutation.operation}`);
}

function collectFailureCodes(fn) {
  const startResults = results.length;
  const start = errors.length;
  try {
    fn();
  } catch (error) {
    addResult("query_negative_exception", false, error.message);
  }
  const codes = errors.slice(start).map((error) => error.check);
  errors.splice(start);
  results.splice(startResults);
  return codes;
}

function rowLookup(collectionConsumer) {
  return new Map((collectionConsumer.collection_rows || []).map((row) => [row.review_result_id, row]));
}

function selectedPatchMatches(row, selectedPatch) {
  return Boolean(row) &&
    selectedPatch?.selected_patch === true &&
    selectedPatch.review_result_id === row.review_result_id &&
    selectedPatch.candidate_id === row.candidate_id &&
    selectedPatch.session_id === row.session_id &&
    selectedPatch.case_id === row.case_id &&
    selectedPatch.outcome === "patch" &&
    (!Object.prototype.hasOwnProperty.call(selectedPatch, "next_review_action") ||
      selectedPatch.next_review_action === "write_patch_plan_only") &&
    (!Object.prototype.hasOwnProperty.call(selectedPatch, "metadata_accumulation_action") ||
      selectedPatch.metadata_accumulation_action === row.metadata_accumulation_action);
}

function validateQueryShape(query, collectionConsumer, options = {}) {
  addResult("query_payload_type_expected", query.query_payload_type === "metadata_only_visual_eval_readonly_review_collection_query");
  addResult("query_status_ready", query.status === "readonly_collection_query_payload_ready");
  addResult("query_source_consumer_expected", query.source_collection_consumer === collectionConsumerPath);
  addResult("query_no_absolute_or_loopback", !hasAbsoluteOrLoopback(query));
  addResult("query_contract_metadata_only_true", query.query_contract?.metadata_only === true);
  addResult("query_contract_read_only_true", query.query_contract?.read_only === true);
  addResult("query_index_names_exact", sameSet(Object.keys(query.indexes || {}), expectedIndexNames));
  addResult("query_outcome_index_complete", expectedOutcomes.every((outcome) => Array.isArray(query.indexes?.by_outcome?.[outcome]) && query.indexes.by_outcome[outcome].length > 0));

  const rowsById = rowLookup(collectionConsumer);
  const selectedRow = rowsById.get(query.selected_review_result_id);
  addResult(
    "collection_query_selected_patch_explicit",
    query.selected_review_result_id === expectedSelectedReviewResultId && query.selected_patch?.selected_patch === true,
    query.selected_review_result_id
  );
  addResult("selected_review_result_id_resolves", Boolean(selectedRow), query.selected_review_result_id);
  addResult(
    "selected_patch_cross_layer_consistent",
    query.selected_review_result_id === collectionConsumer.selected_review_result_id &&
      query.selected_patch?.review_result_id === query.selected_review_result_id &&
      collectionConsumer.selected_patch?.review_result_id === query.selected_review_result_id &&
      selectedPatchMatches(selectedRow, query.selected_patch) &&
      selectedPatchMatches(selectedRow, collectionConsumer.selected_patch),
    query.selected_patch?.review_result_id
  );
  for (const [indexName, index] of Object.entries(query.indexes || {})) {
    for (const [key, refs] of Object.entries(index || {})) {
      addResult(`query_${indexName}_${key}_refs_non_empty`, Array.isArray(refs) && refs.length > 0);
      for (const ref of refs || []) {
        const row = rowsById.get(ref.review_result_id);
        addResult("query_row_ref_resolves", Boolean(row), ref.review_result_id);
        if (!row) continue;
        addResult("query_row_ref_candidate_matches", row.candidate_id === ref.candidate_id, ref.review_result_id);
        addResult("query_row_ref_outcome_matches", row.outcome === ref.outcome, ref.review_result_id);
      }
    }
  }

  for (const [field, expected] of Object.entries(query.guard || {})) {
    addResult(`query_guard_${field}_${expected}`, query.guard[field] === expected);
  }
  addResult("query_guard_memory_write_performed_false", query.guard?.memory_write_performed === false);

  if (!options.skipExpectedKeys) {
    addResult("query_taxonomy_material_failed_present", Array.isArray(query.indexes?.by_taxonomy_tag?.material_failed));
    addResult("query_next_action_patch_present", Array.isArray(query.indexes?.by_next_review_action?.write_patch_plan_only));
    addResult("query_accumulation_failure_learning_present", Array.isArray(query.indexes?.by_metadata_accumulation_action?.keep_as_failure_learning_metadata));
  }
}

function validatePositiveCase(query, collectionConsumer) {
  const directPayload = loadReadonlyReviewCollectionQuery({ collectionConsumerPath });
  const cliPayload = runCli("kernel/visual_eval_readonly_review_collection_query.js", ["--collection-consumer", collectionConsumerPath]);
  addResult("direct_query_matches_cli_query", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_query_matches_example_query", JSON.stringify(directPayload) === JSON.stringify(query));
  validateQueryShape(query, collectionConsumer);
}

function validateNegativeCases(query, collectionConsumer, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_collection_query_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_query_expected", negativeCases.source_query === queryPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(query));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateQueryShape(mutated, collectionConsumer, { skipExpectedKeys: true }));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${queryPath}_exists`, fs.existsSync(repoPath(queryPath)), queryPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${collectionConsumerPath}_exists`, fs.existsSync(repoPath(collectionConsumerPath)), collectionConsumerPath);
  const query = readJson(queryPath);
  const negativeCases = readJson(negativeCasesPath);
  const collectionConsumer = readJson(collectionConsumerPath);
  addResult("query_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  addResult("collection_consumer_json_parseable", true);
  validatePositiveCase(query, collectionConsumer);
  validateNegativeCases(query, collectionConsumer, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_collection_query",
    passed,
    query: queryPath,
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
    validator: "validate_visual_eval_readonly_review_collection_query",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
