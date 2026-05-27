#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyMetadataAccumulationQueueQuery,
} = require("../kernel/visual_eval_readonly_metadata_accumulation_queue_query");

const root = path.resolve(__dirname, "..");
const queryPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_query.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_query_negative_cases.example.json";
const queueConsumerPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_consumer.example.json";
const expectedSections = [
  "accepted_metadata_candidates",
  "patch_plan_only",
  "failure_learning_metadata",
  "archive_references",
  "next_review_actions",
];
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedIndexNames = [
  "by_section",
  "by_outcome",
  "by_next_review_action",
  "by_metadata_action",
  "by_failure_tag",
  "selected_items",
];
const expectedNegativeCases = new Map([
  ["missing_patch_section_index", "metadata_queue_query_sections_complete"],
  ["dangling_query_item_ref", "metadata_queue_query_item_ref_resolves"],
  ["query_guard_memory_true", "metadata_queue_query_guard_memory_write_performed_false"],
  ["absolute_local_source_consumer", "metadata_queue_query_no_absolute_or_loopback"],
  ["missing_selected_patch_ref", "metadata_queue_query_selected_patch_visible"],
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
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_metadata_accumulation_queue_query.js"), ...args], {
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

function applyMutation(query, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(query, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_index_key") {
    delete query.indexes[negativeCase.mutation.index][negativeCase.mutation.key];
    return;
  }
  if (negativeCase.mutation.operation === "clear_selected_items") {
    query.indexes.selected_items = [];
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
    addResult("metadata_queue_query_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function consumerItemLookup(consumer) {
  const rows = new Map();
  for (const section of consumer.sections || []) {
    for (const item of section.items || []) {
      rows.set(`${section.section_id}:${item.review_result_id}`, { section, item });
    }
  }
  return rows;
}

function allIndexRefs(query) {
  const refs = [];
  for (const [indexName, index] of Object.entries(query.indexes || {})) {
    if (indexName === "selected_items") {
      refs.push(...(index || []));
      continue;
    }
    for (const itemRefs of Object.values(index || {})) refs.push(...(itemRefs || []));
  }
  return refs;
}

function validateQueryShape(query, consumer, options = {}) {
  addResult("metadata_queue_query_payload_type_expected", query.query_payload_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_query");
  addResult("metadata_queue_query_status_ready", query.status === "readonly_metadata_accumulation_queue_query_payload_ready");
  addResult("metadata_queue_query_source_consumer_expected", query.source_queue_consumer === queueConsumerPath);
  addResult("metadata_queue_query_no_absolute_or_loopback", !hasAbsoluteOrLoopback(query));
  addResult("metadata_queue_query_contract_metadata_only_true", query.query_contract?.metadata_only === true);
  addResult("metadata_queue_query_contract_read_only_true", query.query_contract?.read_only === true);
  addResult("metadata_queue_query_contract_write_allowed_false", query.query_contract?.write_allowed === false);
  addResult("metadata_queue_query_index_names_exact", sameSet(Object.keys(query.indexes || {}), expectedIndexNames));
  addResult("metadata_queue_query_sections_complete", expectedSections.every((sectionId) => Array.isArray(query.indexes?.by_section?.[sectionId]) && query.indexes.by_section[sectionId].length > 0));
  addResult("metadata_queue_query_outcomes_complete", expectedOutcomes.every((outcome) => Array.isArray(query.indexes?.by_outcome?.[outcome]) && query.indexes.by_outcome[outcome].length > 0));
  addResult("metadata_queue_query_selected_patch_visible", (query.indexes?.selected_items || []).some((ref) => ref.section_id === "patch_plan_only" && ref.review_result_id === "visual_eval_review_result_patch_synthetic_001"));

  const rowsByKey = consumerItemLookup(consumer);
  for (const ref of allIndexRefs(query)) {
    const row = rowsByKey.get(`${ref.section_id}:${ref.review_result_id}`);
    addResult("metadata_queue_query_item_ref_resolves", Boolean(row), `${ref.section_id}:${ref.review_result_id}`);
    if (!row) continue;
    addResult("metadata_queue_query_item_ref_candidate_matches", row.item.candidate_id === ref.candidate_id, ref.review_result_id);
    addResult("metadata_queue_query_item_ref_case_matches", row.item.case_id === ref.case_id, ref.review_result_id);
    addResult("metadata_queue_query_item_ref_outcome_matches", row.item.outcome === ref.outcome, ref.review_result_id);
  }

  for (const [field, expected] of Object.entries(query.guard || {})) {
    addResult(`metadata_queue_query_guard_${field}_${expected}`, query.guard[field] === expected);
  }
  addResult("metadata_queue_query_guard_memory_write_performed_false", query.guard?.memory_write_performed === false);

  if (!options.skipExpectedKeys) {
    addResult("metadata_queue_query_patch_action_present", Array.isArray(query.indexes?.by_next_review_action?.write_patch_plan_only));
    addResult("metadata_queue_query_failure_learning_action_present", Array.isArray(query.indexes?.by_metadata_action?.keep_as_failure_learning_metadata));
    addResult("metadata_queue_query_material_failed_tag_present", Array.isArray(query.indexes?.by_failure_tag?.material_failed));
  }
}

function validatePositiveCase(query, consumer) {
  const directPayload = loadReadonlyMetadataAccumulationQueueQuery({ queueConsumerPath });
  const cliPayload = runCli(["--queue-consumer", queueConsumerPath]);
  addResult("direct_metadata_queue_query_matches_cli_query", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_metadata_queue_query_matches_example_query", JSON.stringify(directPayload) === JSON.stringify(query));
  validateQueryShape(query, consumer);
}

function validateNegativeCases(query, consumer, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_query_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_query_expected", negativeCases.source_query === queryPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(query));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateQueryShape(mutated, consumer, { skipExpectedKeys: true }));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${queryPath}_exists`, fs.existsSync(repoPath(queryPath)), queryPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${queueConsumerPath}_exists`, fs.existsSync(repoPath(queueConsumerPath)), queueConsumerPath);
  const query = readJson(queryPath);
  const negativeCases = readJson(negativeCasesPath);
  const consumer = readJson(queueConsumerPath);
  addResult("metadata_queue_query_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  addResult("queue_consumer_json_parseable", true);
  validatePositiveCase(query, consumer);
  validateNegativeCases(query, consumer, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue_query",
    passed,
    query: queryPath,
    queue_consumer: queueConsumerPath,
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
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue_query",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
