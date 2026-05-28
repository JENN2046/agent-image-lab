#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyReviewCollectionConsumer,
} = require("../kernel/visual_eval_readonly_review_collection_consumer");

const root = path.resolve(__dirname, "..");
const collectionPath = "tests/schema_examples/visual_eval_readonly_review_collection.example.json";
const consumerExamplePath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_collection_negative_cases.example.json";
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedSelectedReviewResultId = "visual_eval_review_result_patch_synthetic_001";
const expectedDisplayFields = [
  "outcome",
  "summary",
  "reasons",
  "failure_taxonomy",
  "blocking_watch_items",
  "next_review_action",
  "metadata_accumulation_action",
];
const expectedNegativeCases = new Map([
  ["missing_collection_member", "collection_members_non_empty"],
  ["consumer_payload_mismatch", "collection_member_consumer_payload_matches_generated"],
  ["aggregate_summary_mismatch", "collection_outcome_summary_matches_members"],
  ["forbidden_boundary_flag_true", "collection_boundary_image_generation_performed_false"],
  ["absolute_local_member_path", "collection_no_absolute_or_loopback"],
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

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
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

function selectedPatchMatches(row, selectedPatch) {
  return Boolean(row) &&
    selectedPatch?.selected_patch === true &&
    selectedPatch.review_result_id === row.review_result_id &&
    selectedPatch.candidate_id === row.candidate_id &&
    selectedPatch.session_id === row.session_id &&
    selectedPatch.case_id === row.case_id &&
    selectedPatch.outcome === "patch" &&
    selectedPatch.next_review_action === "write_patch_plan_only" &&
    selectedPatch.metadata_accumulation_action === row.metadata_accumulation_action;
}

function setByPath(target, fieldPath, value) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    cursor = cursor[segments[index]];
  }
  cursor[segments[segments.length - 1]] = value;
}

function applyMutation(collection, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(collection, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "set_member_field") {
    const member = (collection.collection_members || []).find((item) => item.member_id === negativeCase.mutation.member_id);
    if (member) member[negativeCase.mutation.field] = negativeCase.mutation.value;
    return;
  }
  throw new Error(`unknown mutation operation: ${negativeCase.mutation.operation}`);
}

function collectFailureCodes(fn) {
  try {
    fn();
    return [];
  } catch (error) {
    const message = error.message || "";
    const codes = [];
    if (message.includes("collection_members must be non-empty")) codes.push("collection_members_non_empty");
    if (message.includes("consumer payload mismatch") || message.includes("consumer payload id mismatch")) codes.push("collection_member_consumer_payload_matches_generated");
    if (message.includes("collection outcome summary mismatch")) codes.push("collection_outcome_summary_matches_members");
    if (message.includes("image_generation_performed must be false")) codes.push("collection_boundary_image_generation_performed_false");
    if (message.includes("absolute local paths or loopback URLs")) codes.push("collection_no_absolute_or_loopback");
    if (codes.length === 0) codes.push("unexpected_failure");
    return codes;
  }
}

function validatePositiveCase(collection, expectedConsumer) {
  addResult("collection_json_parseable", true);
  addResult("consumer_example_json_parseable", true);
  addResult("collection_no_absolute_or_loopback", !hasAbsoluteOrLoopback(collection));
  addResult("collection_type_expected", collection.artifact_type === "metadata_only_visual_eval_readonly_review_collection");
  addResult("collection_version_v1", collection.version === "v1");
  addResult("collection_members_non_empty", Array.isArray(collection.collection_members) && collection.collection_members.length > 0);
  addResult("collection_contract_outcome_set_exact", sameSet(collection.collection_contract?.outcome_set, expectedOutcomes));

  const directPayload = loadReadonlyReviewCollectionConsumer({ collectionPath });
  const cliPayload = runCli("kernel/visual_eval_readonly_review_collection_consumer.js", ["--collection", collectionPath]);
  addResult("direct_payload_matches_cli_payload", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_payload_matches_example_payload", JSON.stringify(directPayload) === JSON.stringify(expectedConsumer));
  addResult("collection_consumer_payload_type_expected", directPayload.consumer_payload_type === "metadata_only_visual_eval_readonly_review_collection_consumer");
  addResult("collection_consumer_status_ready", directPayload.status === "readonly_collection_consumer_payload_ready");
  addResult("collection_member_count_matches", directPayload.collection.member_count === collection.expected_collection_summary.member_count);
  addResult("collection_display_row_count_matches", directPayload.collection.display_row_count === collection.expected_collection_summary.display_row_count);
  addResult("collection_outcome_summary_matches_members", JSON.stringify(directPayload.collection.outcome_summary) === JSON.stringify(collection.expected_collection_summary.outcome_summary));
  const selectedRow = directPayload.collection_rows.find((row) => row.review_result_id === directPayload.selected_review_result_id);
  addResult("collection_selected_patch_explicit", directPayload.selected_review_result_id === expectedSelectedReviewResultId && directPayload.selected_patch?.selected_patch === true);
  addResult("selected_review_result_id_resolves", Boolean(selectedRow), directPayload.selected_review_result_id);
  addResult("selected_patch_cross_layer_consistent", selectedPatchMatches(selectedRow, directPayload.selected_patch), directPayload.selected_patch?.review_result_id);
  addResult("collection_rows_include_pass_patch_reject", sameSet([...new Set(directPayload.collection_rows.map((row) => row.outcome))], expectedOutcomes));
  for (const field of expectedDisplayFields) {
    addResult(`collection_rows_expose_${field}`, directPayload.collection_rows.every((row) => Object.prototype.hasOwnProperty.call(row, field)));
  }
  for (const [field, expected] of Object.entries(directPayload.guard)) {
    addResult(`collection_guard_${field}_${expected}`, directPayload.guard[field] === expected);
  }
}

function validateNegativeCases(collection, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_collection_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_collection_expected", negativeCases.source_collection === collectionPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(collection));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => loadReadonlyReviewCollectionConsumer({
      collectionPath,
      collection: mutated,
    }));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${collectionPath}_exists`, fs.existsSync(repoPath(collectionPath)), collectionPath);
  addResult(`${consumerExamplePath}_exists`, fs.existsSync(repoPath(consumerExamplePath)), consumerExamplePath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  const collection = readJson(collectionPath);
  const expectedConsumer = readJson(consumerExamplePath);
  const negativeCases = readJson(negativeCasesPath);
  validatePositiveCase(collection, expectedConsumer);
  validateNegativeCases(collection, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_collection_consumer",
    passed,
    collection: collectionPath,
    consumer_example: consumerExamplePath,
    negative_cases: negativeCasesPath,
    collection_member_count: collection.collection_members?.length || 0,
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
    validator: "validate_visual_eval_readonly_review_collection_consumer",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
