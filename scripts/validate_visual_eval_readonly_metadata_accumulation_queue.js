#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyMetadataAccumulationQueue,
} = require("../kernel/visual_eval_readonly_metadata_accumulation_queue");

const root = path.resolve(__dirname, "..");
const queuePath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_negative_cases.example.json";
const drilldownPath = "tests/schema_examples/visual_eval_readonly_review_session_drilldown.example.json";
const bridgePayloadPath = "tests/schema_examples/visual_eval_review_result_review_bridge_payload.example.json";
const accumulationContractPath = "tests/schema_examples/visual_eval_metadata_accumulation.example.json";
const expectedNextActions = ["queue_for_future_human_review", "write_patch_plan_only", "defer_until_taxonomy_update"];
const expectedNegativeCases = new Map([
  ["missing_patch_plan_queue", "queue_patch_plan_count_matches"],
  ["illegal_next_review_action", "queue_next_action_allowed"],
  ["selected_queue_item_unmarked", "queue_selected_patch_item_present"],
  ["queue_guard_memory_true", "queue_guard_memory_write_performed_false"],
  ["absolute_local_contract_source", "queue_no_absolute_or_loopback"],
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
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_metadata_accumulation_queue.js"), ...args], {
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

function applyMutation(queue, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(queue, negativeCase.mutation.field, negativeCase.mutation.value);
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
    addResult("queue_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function allQueueEntries(queue) {
  return [
    ...(queue.queues?.accepted_metadata_candidates || []),
    ...(queue.queues?.patch_plan_only || []),
    ...(queue.queues?.failure_learning_metadata || []),
    ...(queue.queues?.archive_references || []),
    ...(queue.queues?.next_review_actions || []),
  ];
}

function validateQueueShape(queue) {
  addResult("queue_type_expected", queue.queue_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue");
  addResult("queue_status_ready", queue.status === "readonly_metadata_accumulation_queue_ready");
  addResult("queue_source_drilldown_expected", queue.source_session_drilldown === drilldownPath);
  addResult("queue_source_bridge_payload_expected", queue.source_bridge_payload === bridgePayloadPath);
  addResult("queue_source_accumulation_contract_expected", queue.source_accumulation_contract === accumulationContractPath);
  addResult("queue_no_absolute_or_loopback", !hasAbsoluteOrLoopback(queue));
  addResult("queue_contract_metadata_only_true", queue.queue_contract?.metadata_only === true);
  addResult("queue_contract_read_only_true", queue.queue_contract?.read_only === true);
  addResult("queue_contract_write_allowed_false", queue.queue_contract?.write_allowed === false);
  addResult("queue_total_records_three", queue.queue_summary?.total_records === 3);
  addResult("queue_accepted_candidate_count_matches", (queue.queues?.accepted_metadata_candidates || []).length === queue.queue_summary?.accepted_metadata_candidates);
  addResult("queue_patch_plan_count_matches", (queue.queues?.patch_plan_only || []).length === queue.queue_summary?.patch_plan_only);
  addResult("queue_failure_learning_count_matches", (queue.queues?.failure_learning_metadata || []).length === queue.queue_summary?.failure_learning_metadata);
  addResult("queue_archive_reference_count_matches", (queue.queues?.archive_references || []).length === queue.queue_summary?.archive_references);
  addResult("queue_next_actions_count_three", (queue.queues?.next_review_actions || []).length === 3);
  addResult("queue_next_actions_exact", sameSet((queue.queues?.next_review_actions || []).map((entry) => entry.next_review_action), expectedNextActions));
  addResult("queue_selected_patch_item_present", (queue.queues?.patch_plan_only || []).some((entry) => entry.review_result_id === queue.selected_review_result_id && entry.selected === true));
  addResult("queue_failure_learning_reject_present", (queue.queues?.failure_learning_metadata || []).some((entry) => entry.outcome === "reject" && entry.rejected_metadata_action === "keep_as_failure_learning_metadata"));
  addResult("queue_accepted_pass_present", (queue.queues?.accepted_metadata_candidates || []).some((entry) => entry.outcome === "pass" && entry.accepted_metadata_action === "keep_as_metadata_candidate"));

  for (const entry of allQueueEntries(queue)) {
    addResult("queue_entry_write_allowed_false", entry.write_allowed_now === false, entry.review_result_id);
    if (entry.next_review_action) {
      addResult("queue_next_action_allowed", expectedNextActions.includes(entry.next_review_action), entry.next_review_action);
    }
  }

  for (const [field, expected] of Object.entries(queue.guard || {})) {
    addResult(`queue_guard_${field}_${expected}`, queue.guard[field] === expected);
  }
  addResult("queue_guard_memory_write_performed_false", queue.guard?.memory_write_performed === false);
}

function validatePositiveCase(queue) {
  const directPayload = loadReadonlyMetadataAccumulationQueue({ drilldownPath, bridgePayloadPath, accumulationContractPath });
  const cliPayload = runCli([
    "--drilldown", drilldownPath,
    "--bridge-payload", bridgePayloadPath,
    "--accumulation-contract", accumulationContractPath,
  ]);
  addResult("direct_queue_matches_cli_queue", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_queue_matches_example_queue", JSON.stringify(directPayload) === JSON.stringify(queue));
  validateQueueShape(queue);
}

function validateNegativeCases(queue, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_queue_expected", negativeCases.source_queue === queuePath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(queue));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateQueueShape(mutated));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${queuePath}_exists`, fs.existsSync(repoPath(queuePath)), queuePath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  const queue = readJson(queuePath);
  const negativeCases = readJson(negativeCasesPath);
  addResult("queue_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  validatePositiveCase(queue);
  validateNegativeCases(queue, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue",
    passed,
    queue: queuePath,
    negative_cases: negativeCasesPath,
    total_records: queue.queue_summary?.total_records || 0,
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
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
