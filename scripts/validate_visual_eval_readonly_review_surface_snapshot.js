#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyReviewSurfaceSnapshot,
} = require("../kernel/visual_eval_readonly_review_surface_snapshot");

const root = path.resolve(__dirname, "..");
const snapshotPath = "tests/schema_examples/visual_eval_readonly_review_surface_snapshot.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_surface_snapshot_negative_cases.example.json";
const queryPath = "tests/schema_examples/visual_eval_readonly_review_collection_query.example.json";
const collectionConsumerPath = "tests/schema_examples/visual_eval_readonly_review_collection_consumer.example.json";
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedSections = ["outcome_lanes", "taxonomy_sections", "next_action_queues"];
const expectedNegativeCases = new Map([
  ["missing_reject_lane", "surface_outcome_lanes_complete"],
  ["dangling_surface_card_ref", "surface_card_ref_resolves"],
  ["card_next_action_mismatch", "surface_card_next_action_matches_collection"],
  ["surface_guard_provider_true", "surface_guard_provider_contact_performed_false"],
  ["absolute_local_source_query", "surface_no_absolute_or_loopback"],
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

function setByPath(target, fieldPath, value) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    cursor = cursor[segments[index]];
  }
  cursor[segments[segments.length - 1]] = value;
}

function applyMutation(snapshot, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(snapshot, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_lane_by_outcome") {
    snapshot.surface.outcome_lanes = snapshot.surface.outcome_lanes.filter((lane) => lane.outcome !== negativeCase.mutation.outcome);
    return;
  }
  if (negativeCase.mutation.operation === "set_first_taxonomy_ref_field") {
    const section = snapshot.surface.taxonomy_sections.find((item) => item.taxonomy_tag === negativeCase.mutation.taxonomy_tag);
    if (section) section.card_refs[0][negativeCase.mutation.field] = negativeCase.mutation.value;
    return;
  }
  if (negativeCase.mutation.operation === "set_first_lane_card_field") {
    const lane = snapshot.surface.outcome_lanes.find((item) => item.outcome === negativeCase.mutation.outcome);
    if (lane) lane.cards[0][negativeCase.mutation.field] = negativeCase.mutation.value;
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
    addResult("surface_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function rowMap(collectionConsumer) {
  return new Map((collectionConsumer.collection_rows || []).map((row) => [row.review_result_id, row]));
}

function validateCard(card, rowsById) {
  const row = rowsById.get(card.review_result_id);
  addResult("surface_card_ref_resolves", Boolean(row), card.review_result_id);
  if (!row) return;
  addResult("surface_card_candidate_matches_collection", card.candidate_id === row.candidate_id, card.review_result_id);
  addResult("surface_card_outcome_matches_collection", card.outcome === row.outcome, card.review_result_id);
  addResult("surface_card_next_action_matches_collection", card.next_review_action === row.next_review_action, card.review_result_id);
  addResult("surface_card_metadata_action_matches_collection", card.metadata_accumulation_action === row.metadata_accumulation_action, card.review_result_id);
}

function validateRef(ref, rowsById) {
  const row = rowsById.get(ref.review_result_id);
  addResult("surface_card_ref_resolves", Boolean(row), ref.review_result_id);
  if (!row) return;
  addResult("surface_card_ref_candidate_matches_collection", ref.candidate_id === row.candidate_id, ref.review_result_id);
  addResult("surface_card_ref_outcome_matches_collection", ref.outcome === row.outcome, ref.review_result_id);
}

function validateSnapshotShape(snapshot, query, collectionConsumer) {
  addResult("surface_snapshot_type_expected", snapshot.surface_snapshot_type === "metadata_only_visual_eval_readonly_review_surface_snapshot");
  addResult("surface_status_ready", snapshot.status === "readonly_surface_snapshot_ready");
  addResult("surface_source_query_expected", snapshot.source_query === queryPath);
  addResult("surface_source_collection_consumer_expected", snapshot.source_collection_consumer === collectionConsumerPath);
  addResult("surface_no_absolute_or_loopback", !hasAbsoluteOrLoopback(snapshot));
  addResult("surface_contract_metadata_only_true", snapshot.snapshot_contract?.metadata_only === true);
  addResult("surface_contract_read_only_true", snapshot.snapshot_contract?.read_only === true);
  addResult("surface_sections_exact", sameSet(snapshot.snapshot_contract?.surface_sections, expectedSections));
  addResult("surface_total_cards_matches_collection", snapshot.surface?.total_cards === collectionConsumer.collection?.display_row_count);
  addResult("surface_outcome_summary_matches_collection", JSON.stringify(snapshot.surface?.outcome_summary) === JSON.stringify(collectionConsumer.collection?.outcome_summary));
  addResult("surface_outcome_lanes_complete", sameSet((snapshot.surface?.outcome_lanes || []).map((lane) => lane.outcome), expectedOutcomes));

  const rowsById = rowMap(collectionConsumer);
  for (const lane of snapshot.surface?.outcome_lanes || []) {
    addResult(`surface_lane_${lane.outcome}_count_matches`, lane.count === (lane.cards || []).length);
    addResult(`surface_lane_${lane.outcome}_query_count_matches`, lane.count === (query.indexes?.by_outcome?.[lane.outcome] || []).length);
    for (const card of lane.cards || []) validateCard(card, rowsById);
  }
  for (const section of snapshot.surface?.taxonomy_sections || []) {
    addResult(`surface_taxonomy_${section.taxonomy_tag}_count_matches`, section.count === (section.card_refs || []).length);
    addResult(`surface_taxonomy_${section.taxonomy_tag}_query_count_matches`, section.count === (query.indexes?.by_taxonomy_tag?.[section.taxonomy_tag] || []).length);
    for (const ref of section.card_refs || []) validateRef(ref, rowsById);
  }
  for (const queue of snapshot.surface?.next_action_queues || []) {
    addResult(`surface_next_action_${queue.next_review_action}_count_matches`, queue.count === (queue.card_refs || []).length);
    addResult(`surface_next_action_${queue.next_review_action}_query_count_matches`, queue.count === (query.indexes?.by_next_review_action?.[queue.next_review_action] || []).length);
    for (const ref of queue.card_refs || []) validateRef(ref, rowsById);
  }

  for (const [field, expected] of Object.entries(snapshot.guard || {})) {
    addResult(`surface_guard_${field}_${expected}`, snapshot.guard[field] === expected);
  }
  addResult("surface_guard_provider_contact_performed_false", snapshot.guard?.provider_contact_performed === false);
}

function validatePositiveCase(snapshot, query, collectionConsumer) {
  const directPayload = loadReadonlyReviewSurfaceSnapshot({ queryPath, collectionConsumerPath });
  const cliPayload = runCli("kernel/visual_eval_readonly_review_surface_snapshot.js", ["--query", queryPath, "--collection-consumer", collectionConsumerPath]);
  addResult("direct_surface_matches_cli_surface", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_surface_matches_example_surface", JSON.stringify(directPayload) === JSON.stringify(snapshot));
  validateSnapshotShape(snapshot, query, collectionConsumer);
}

function validateNegativeCases(snapshot, query, collectionConsumer, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_surface_snapshot_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_surface_expected", negativeCases.source_surface_snapshot === snapshotPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(snapshot));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateSnapshotShape(mutated, query, collectionConsumer));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${snapshotPath}_exists`, fs.existsSync(repoPath(snapshotPath)), snapshotPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${queryPath}_exists`, fs.existsSync(repoPath(queryPath)), queryPath);
  addResult(`${collectionConsumerPath}_exists`, fs.existsSync(repoPath(collectionConsumerPath)), collectionConsumerPath);
  const snapshot = readJson(snapshotPath);
  const negativeCases = readJson(negativeCasesPath);
  const query = readJson(queryPath);
  const collectionConsumer = readJson(collectionConsumerPath);
  addResult("surface_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  addResult("query_json_parseable", true);
  addResult("collection_consumer_json_parseable", true);
  validatePositiveCase(snapshot, query, collectionConsumer);
  validateNegativeCases(snapshot, query, collectionConsumer, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_surface_snapshot",
    passed,
    snapshot: snapshotPath,
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
    validator: "validate_visual_eval_readonly_review_surface_snapshot",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
