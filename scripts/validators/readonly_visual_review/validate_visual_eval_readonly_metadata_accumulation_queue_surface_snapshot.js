#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyMetadataAccumulationQueueSurfaceSnapshot,
} = require("../../../kernel/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot");

const root = path.resolve(__dirname, "../../..");
const snapshotPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot_negative_cases.example.json";
const queryPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_query.example.json";
const consumerPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_consumer.example.json";
const expectedSections = ["section_lanes", "outcome_lanes", "next_action_queues", "selected_items"];
const expectedQueueSections = [
  "accepted_metadata_candidates",
  "patch_plan_only",
  "failure_learning_metadata",
  "archive_references",
  "next_review_actions",
];
const expectedOutcomes = ["pass", "patch", "reject"];
const expectedNegativeCases = new Map([
  ["missing_patch_section_lane", "metadata_queue_surface_section_lanes_complete"],
  ["dangling_surface_card_ref", "metadata_queue_surface_card_ref_resolves"],
  ["missing_selected_patch_item", "metadata_queue_surface_selected_patch_visible"],
  ["surface_guard_image_true", "metadata_queue_surface_guard_image_generation_performed_false"],
  ["absolute_local_source_query", "metadata_queue_surface_no_absolute_or_loopback"],
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

function runCli(args) {
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.js"), ...args], {
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

function applyMutation(snapshot, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(snapshot, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_section_lane") {
    snapshot.surface.section_lanes = snapshot.surface.section_lanes.filter((lane) => lane.section_id !== negativeCase.mutation.section_id);
    return;
  }
  if (negativeCase.mutation.operation === "clear_selected_items") {
    snapshot.surface.selected_items = [];
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
    addResult("metadata_queue_surface_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function itemLookup(consumer) {
  const rows = new Map();
  for (const section of consumer.sections || []) {
    for (const item of section.items || []) rows.set(`${section.section_id}:${item.review_result_id}`, item);
  }
  return rows;
}

function allCards(snapshot) {
  const cards = [];
  for (const lane of snapshot.surface?.section_lanes || []) cards.push(...(lane.cards || []));
  for (const item of snapshot.surface?.selected_items || []) cards.push(item);
  return cards;
}

function validateCard(card, rowsByKey) {
  const row = rowsByKey.get(`${card.section_id}:${card.review_result_id}`);
  addResult("metadata_queue_surface_card_ref_resolves", Boolean(row), `${card.section_id}:${card.review_result_id}`);
  if (!row) return;
  addResult("metadata_queue_surface_card_candidate_matches", row.candidate_id === card.candidate_id, card.review_result_id);
  addResult("metadata_queue_surface_card_case_matches", row.case_id === card.case_id, card.review_result_id);
  addResult("metadata_queue_surface_card_outcome_matches", row.outcome === card.outcome, card.review_result_id);
  addResult("metadata_queue_surface_card_next_action_matches", row.next_review_action === card.next_review_action, card.review_result_id);
}

function validateSnapshotShape(snapshot, query, consumer) {
  addResult("metadata_queue_surface_type_expected", snapshot.surface_snapshot_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_surface_snapshot");
  addResult("metadata_queue_surface_status_ready", snapshot.status === "readonly_metadata_accumulation_queue_surface_snapshot_ready");
  addResult("metadata_queue_surface_source_query_expected", snapshot.source_query === queryPath);
  addResult("metadata_queue_surface_source_consumer_expected", snapshot.source_queue_consumer === consumerPath);
  addResult("metadata_queue_surface_no_absolute_or_loopback", !hasAbsoluteOrLoopback(snapshot));
  addResult("metadata_queue_surface_contract_metadata_only_true", snapshot.snapshot_contract?.metadata_only === true);
  addResult("metadata_queue_surface_contract_read_only_true", snapshot.snapshot_contract?.read_only === true);
  addResult("metadata_queue_surface_contract_write_allowed_false", snapshot.snapshot_contract?.write_allowed === false);
  addResult("metadata_queue_surface_sections_exact", sameSet(snapshot.snapshot_contract?.surface_sections, expectedSections));
  addResult("metadata_queue_surface_section_lanes_complete", sameSet((snapshot.surface?.section_lanes || []).map((lane) => lane.section_id), expectedQueueSections));
  addResult("metadata_queue_surface_outcome_lanes_complete", sameSet((snapshot.surface?.outcome_lanes || []).map((lane) => lane.outcome), expectedOutcomes));
  addResult("metadata_queue_surface_total_records_matches_consumer", snapshot.surface?.total_records === consumer.dashboard_summary?.total_records);
  addResult("metadata_queue_surface_total_section_items_matches_query", snapshot.surface?.total_section_items === Object.values(query.indexes?.by_section || {}).reduce((sum, refs) => sum + refs.length, 0));
  addResult("metadata_queue_surface_selected_patch_visible", (snapshot.surface?.selected_items || []).some((item) => item.section_id === "patch_plan_only" && item.review_result_id === consumer.dashboard_summary?.selected_review_result_id));

  const rowsByKey = itemLookup(consumer);
  for (const lane of snapshot.surface?.section_lanes || []) {
    addResult(`metadata_queue_surface_section_${lane.section_id}_count_matches`, lane.count === (lane.cards || []).length);
    addResult(`metadata_queue_surface_section_${lane.section_id}_query_count_matches`, lane.count === (query.indexes?.by_section?.[lane.section_id] || []).length);
  }
  for (const lane of snapshot.surface?.outcome_lanes || []) {
    addResult(`metadata_queue_surface_outcome_${lane.outcome}_query_count_matches`, lane.count === (query.indexes?.by_outcome?.[lane.outcome] || []).length);
  }
  for (const queue of snapshot.surface?.next_action_queues || []) {
    addResult(`metadata_queue_surface_next_action_${queue.next_review_action}_query_count_matches`, queue.count === (query.indexes?.by_next_review_action?.[queue.next_review_action] || []).length);
  }
  for (const card of allCards(snapshot)) validateCard(card, rowsByKey);

  for (const [field, expected] of Object.entries(snapshot.guard || {})) {
    addResult(`metadata_queue_surface_guard_${field}_${expected}`, snapshot.guard[field] === expected);
  }
  addResult("metadata_queue_surface_guard_image_generation_performed_false", snapshot.guard?.image_generation_performed === false);
}

function validatePositiveCase(snapshot, query, consumer) {
  const directPayload = loadReadonlyMetadataAccumulationQueueSurfaceSnapshot({ queryPath, consumerPath });
  const cliPayload = runCli(["--query", queryPath, "--queue-consumer", consumerPath]);
  addResult("direct_metadata_queue_surface_matches_cli_surface", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_metadata_queue_surface_matches_example_surface", JSON.stringify(directPayload) === JSON.stringify(snapshot));
  validateSnapshotShape(snapshot, query, consumer);
}

function validateNegativeCases(snapshot, query, consumer, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_surface_snapshot_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_surface_expected", negativeCases.source_surface_snapshot === snapshotPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(snapshot));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateSnapshotShape(mutated, query, consumer));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${snapshotPath}_exists`, fs.existsSync(repoPath(snapshotPath)), snapshotPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${queryPath}_exists`, fs.existsSync(repoPath(queryPath)), queryPath);
  addResult(`${consumerPath}_exists`, fs.existsSync(repoPath(consumerPath)), consumerPath);
  const snapshot = readJson(snapshotPath);
  const negativeCases = readJson(negativeCasesPath);
  const query = readJson(queryPath);
  const consumer = readJson(consumerPath);
  addResult("metadata_queue_surface_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  addResult("query_json_parseable", true);
  addResult("consumer_json_parseable", true);
  validatePositiveCase(snapshot, query, consumer);
  validateNegativeCases(snapshot, query, consumer, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue_surface_snapshot",
    passed,
    snapshot: snapshotPath,
    query: queryPath,
    queue_consumer: consumerPath,
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
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue_surface_snapshot",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
