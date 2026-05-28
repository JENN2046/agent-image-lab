#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "../../..");
const consumerKernelPath = "kernel/visual_eval_readonly_review_bundle_consumer.js";
const bundleValidatorPath = "scripts/validate_visual_eval_readonly_review_bundle.js";
const bundlePath = "tests/schema_examples/visual_eval_readonly_review_bundle.example.json";
const consumerExamplePath = "tests/schema_examples/visual_eval_readonly_review_bundle_consumer.example.json";

const errors = [];
const results = [];

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

function runNode(args) {
  return execFileSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function assertNoAbsoluteOrLoopback(value, label) {
  const text = JSON.stringify(value);
  addResult(`${label}_no_windows_absolute_path`, !/[A-Za-z]:[\\/]/.test(text));
  addResult(`${label}_no_loopback_url`, !/(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1)/i.test(text));
}

function assertGuard(payload) {
  const guard = payload.guard || {};
  addResult("consumer_guard_metadata_only_true", guard.metadata_only === true);
  addResult("consumer_guard_read_only_true", guard.read_only === true);
  addResult("consumer_guard_display_only_true", guard.display_only === true);
  for (const field of [
    "file_write_performed",
    "approval_write_performed",
    "accepted_samples_write_performed",
    "production_candidate_created",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "memory_write_performed",
    "Batch_005_started",
    "production_candidate_002_started",
  ]) {
    addResult(`consumer_guard_${field}_false`, guard[field] === false);
  }
}

function assertConsumerShape(payload) {
  addResult("consumer_payload_type_expected", payload.consumer_payload_type === "metadata_only_visual_eval_readonly_review_bundle_consumer");
  addResult("consumer_payload_status_ready", payload.status === "readonly_consumer_payload_ready");
  addResult("consumer_source_bundle_expected", payload.source_bundle === bundlePath);
  addResult("consumer_session_status_readonly", payload.session?.status === "draft_readonly");
  addResult("consumer_session_display_row_count_three", payload.session?.display_row_count === 3);
  addResult("consumer_summary_pass_count_one", payload.session?.outcome_summary?.pass === 1);
  addResult("consumer_summary_patch_count_one", payload.session?.outcome_summary?.patch === 1);
  addResult("consumer_summary_reject_count_one", payload.session?.outcome_summary?.reject === 1);

  const rows = payload.display_rows || [];
  addResult("consumer_rows_count_three", rows.length === 3);
  addResult("consumer_rows_include_pass_patch_reject", ["pass", "patch", "reject"].every((outcome) =>
    rows.some((row) => row.outcome === outcome)
  ));
  addResult("consumer_rows_have_reasons", rows.every((row) => Array.isArray(row.reasons)));
  addResult("consumer_rows_do_not_own_positive_reasons", rows.every((row) =>
    !Object.prototype.hasOwnProperty.call(row, "positive_reasons")
  ));
  addResult("consumer_rows_do_not_own_never_production_fields", rows.every((row) =>
    !Object.prototype.hasOwnProperty.call(row, "never_production") &&
    !Object.prototype.hasOwnProperty.call(row, "never_production_reason")
  ));
  addResult("consumer_rows_do_not_own_taxonomy_refs", rows.every((row) =>
    !Object.prototype.hasOwnProperty.call(row, "taxonomy_ref") &&
    !Object.prototype.hasOwnProperty.call(row, "taxonomy_refs")
  ));
  addResult("consumer_patch_has_taxonomy_and_blockers", rows.some((row) =>
    row.outcome === "patch" &&
    row.failure_taxonomy.length === 2 &&
    row.blocking_watch_items.length === 2 &&
    row.next_review_action === "write_patch_plan_only"
  ));
  addResult("consumer_reject_has_taxonomy_and_never_production", rows.some((row) =>
    row.outcome === "reject" &&
    row.failure_taxonomy.every((item) => item.severity === "blocking") &&
    row.next_review_action === "defer_until_taxonomy_update"
  ));
  addResult("consumer_pass_has_positive_metadata_action", rows.some((row) =>
    row.outcome === "pass" &&
    row.metadata_accumulation_action === "keep_as_metadata_candidate" &&
    row.next_review_action === "queue_for_future_human_review"
  ));
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    addResult(`negative_${caseId}_caught`, true);
    return;
  }
  addResult(`negative_${caseId}_caught`, false, "case unexpectedly passed");
}

function main() {
  for (const file of [consumerKernelPath, bundleValidatorPath, bundlePath, consumerExamplePath]) {
    addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
  }
  runNode(["--check", consumerKernelPath]);
  runNode(["--check", bundleValidatorPath]);
  runNode([bundleValidatorPath]);

  const consumerKernel = require(repoPath(consumerKernelPath));
  const directPayload = consumerKernel.loadReadonlyReviewBundleConsumer({});
  const cliPayload = JSON.parse(runNode([consumerKernelPath]));
  const expectedPayload = readJson(consumerExamplePath);

  addResult("direct_payload_matches_cli_payload", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_payload_matches_example_payload", JSON.stringify(directPayload) === JSON.stringify(expectedPayload));
  assertConsumerShape(directPayload);
  assertGuard(directPayload);
  assertNoAbsoluteOrLoopback(directPayload, "consumer_payload");

  expectFailure("write_guard_true_rejected", () => {
    const bundle = readJson(bundlePath);
    bundle.readonly_artifacts.review_session_draft.route_guards.memory_write_allowed_now = true;
    consumerKernel.loadReadonlyReviewBundleConsumer({ bundle });
  });
  expectFailure("unknown_taxonomy_tag_rejected", () => {
    const bundle = readJson(bundlePath);
    const protocol = readJson(bundle.source_refs.review_result_protocol);
    protocol.review_results[1].failure_tags = ["unknown_taxonomy_tag"];
    const tempBundle = clone(bundle);
    tempBundle.source_refs.review_result_protocol = bundle.source_refs.review_result_protocol;
    const originalReadFileSync = fs.readFileSync;
    fs.readFileSync = (target, encoding) => {
      if (path.resolve(target) === repoPath(bundle.source_refs.review_result_protocol)) {
        return JSON.stringify(protocol);
      }
      return originalReadFileSync(target, encoding);
    };
    try {
      consumerKernel.loadReadonlyReviewBundleConsumer({ bundle: tempBundle });
    } finally {
      fs.readFileSync = originalReadFileSync;
    }
  });

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_bundle_consumer",
    passed,
    consumer_kernel: consumerKernelPath,
    consumer_example: consumerExamplePath,
    bundle_source: bundlePath,
    negative_case_count: 2,
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
    validator: "validate_visual_eval_readonly_review_bundle_consumer",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
