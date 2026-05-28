#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyMetadataAccumulationQueueConsumer,
} = require("../../../kernel/visual_eval_readonly_metadata_accumulation_queue_consumer");

const root = path.resolve(__dirname, "../../..");
const consumerPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_consumer.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_consumer_negative_cases.example.json";
const queuePath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue.example.json";
const expectedSections = [
  "accepted_metadata_candidates",
  "patch_plan_only",
  "failure_learning_metadata",
  "archive_references",
  "next_review_actions",
];
const expectedNegativeCases = new Map([
  ["missing_patch_section", "consumer_sections_exact"],
  ["selected_patch_plan_unmarked", "consumer_selected_patch_plan_marked"],
  ["archive_reference_count_mismatch", "consumer_archive_reference_count_matches"],
  ["consumer_guard_memory_true", "consumer_guard_memory_write_performed_false"],
  ["absolute_local_source_queue", "consumer_no_absolute_or_loopback"],
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
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_metadata_accumulation_queue_consumer.js"), ...args], {
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

function applyMutation(consumer, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(consumer, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_section") {
    consumer.sections = consumer.sections.filter((section) => section.section_id !== negativeCase.mutation.section_id);
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
    addResult("consumer_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function section(consumer, sectionId) {
  return (consumer.sections || []).find((item) => item.section_id === sectionId);
}

function validateConsumerShape(consumer) {
  addResult("consumer_payload_type_expected", consumer.consumer_payload_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_consumer");
  addResult("consumer_status_ready", consumer.status === "readonly_metadata_accumulation_queue_consumer_ready");
  addResult("consumer_source_queue_expected", consumer.source_queue === queuePath);
  addResult("consumer_no_absolute_or_loopback", !hasAbsoluteOrLoopback(consumer));
  addResult("consumer_display_metadata_only_true", consumer.display_contract?.metadata_only === true);
  addResult("consumer_display_read_only_true", consumer.display_contract?.read_only === true);
  addResult("consumer_display_write_allowed_false", consumer.display_contract?.write_allowed === false);
  addResult("consumer_sections_exact", sameSet((consumer.sections || []).map((item) => item.section_id), expectedSections));
  addResult("consumer_display_sections_exact", sameSet(consumer.display_contract?.queue_sections, expectedSections));
  addResult("consumer_total_records_three", consumer.dashboard_summary?.total_records === 3);
  addResult("consumer_accepted_count_matches", section(consumer, "accepted_metadata_candidates")?.item_count === consumer.dashboard_summary?.accepted_metadata_candidates);
  addResult("consumer_patch_count_matches", section(consumer, "patch_plan_only")?.item_count === consumer.dashboard_summary?.patch_plan_only);
  addResult("consumer_failure_count_matches", section(consumer, "failure_learning_metadata")?.item_count === consumer.dashboard_summary?.failure_learning_metadata);
  addResult("consumer_archive_reference_count_matches", section(consumer, "archive_references")?.item_count === consumer.dashboard_summary?.archive_references);
  addResult("consumer_next_action_count_matches", section(consumer, "next_review_actions")?.item_count === consumer.dashboard_summary?.next_review_actions);
  addResult("consumer_selected_patch_plan_id_matches", consumer.selected_patch_plan?.review_result_id === consumer.dashboard_summary?.selected_review_result_id);
  addResult("consumer_selected_patch_plan_action_matches", consumer.selected_patch_plan?.next_review_action === consumer.dashboard_summary?.selected_next_review_action);
  addResult("consumer_selected_patch_plan_marked", consumer.selected_patch_plan?.selected === true);
  addResult("consumer_patch_plan_section_has_selected_item", (section(consumer, "patch_plan_only")?.items || []).some((item) => item.review_result_id === consumer.selected_patch_plan?.review_result_id && item.selected === true));
  addResult("consumer_failure_learning_reject_visible", (section(consumer, "failure_learning_metadata")?.items || []).some((item) => item.outcome === "reject" && item.metadata_actions?.rejected_metadata_action === "keep_as_failure_learning_metadata"));
  addResult("consumer_accepted_pass_visible", (section(consumer, "accepted_metadata_candidates")?.items || []).some((item) => item.outcome === "pass" && item.metadata_actions?.accepted_metadata_action === "keep_as_metadata_candidate"));

  for (const currentSection of consumer.sections || []) {
    addResult("consumer_section_item_count_matches", currentSection.item_count === (currentSection.items || []).length, currentSection.section_id);
    addResult("consumer_section_selected_count_matches", currentSection.selected_count === (currentSection.items || []).filter((item) => item.selected).length, currentSection.section_id);
    for (const item of currentSection.items || []) {
      addResult("consumer_item_write_allowed_false", item.write_allowed_now === false, item.review_result_id);
    }
  }

  for (const [field, expected] of Object.entries(consumer.guard || {})) {
    addResult(`consumer_guard_${field}_${expected}`, consumer.guard[field] === expected);
  }
  addResult("consumer_guard_memory_write_performed_false", consumer.guard?.memory_write_performed === false);
}

function validatePositiveCase(consumer) {
  const directPayload = loadReadonlyMetadataAccumulationQueueConsumer({ queuePath });
  const cliPayload = runCli(["--queue", queuePath]);
  addResult("direct_consumer_matches_cli_consumer", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_consumer_matches_example_consumer", JSON.stringify(directPayload) === JSON.stringify(consumer));
  validateConsumerShape(consumer);
}

function validateNegativeCases(consumer, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_consumer_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_consumer_expected", negativeCases.source_consumer === consumerPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(consumer));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateConsumerShape(mutated));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${consumerPath}_exists`, fs.existsSync(repoPath(consumerPath)), consumerPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${queuePath}_exists`, fs.existsSync(repoPath(queuePath)), queuePath);
  const consumer = readJson(consumerPath);
  const negativeCases = readJson(negativeCasesPath);
  addResult("consumer_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  validatePositiveCase(consumer);
  validateNegativeCases(consumer, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue_consumer",
    passed,
    consumer: consumerPath,
    negative_cases: negativeCasesPath,
    source_queue: queuePath,
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
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue_consumer",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
