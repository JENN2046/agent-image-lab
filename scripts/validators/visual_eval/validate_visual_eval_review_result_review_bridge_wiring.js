#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "../../..");
const bridgeKernelPath = "kernel/visual_eval_review_result_bridge.js";
const protocolValidatorPath = "scripts/validate_visual_eval_review_result_protocol.js";
const reviewResultPath = "tests/schema_examples/visual_eval_review_result_protocol.example.json";
const taxonomyPath = "tests/schema_examples/visual_eval_failure_taxonomy.example.json";
const accumulationPath = "tests/schema_examples/visual_eval_metadata_accumulation.example.json";
const payloadExamplePath = "tests/schema_examples/visual_eval_review_result_review_bridge_payload.example.json";

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

function assertGuardFalse(guard, label) {
  const falseFields = [
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
  ];
  addResult(`${label}_metadata_only_true`, guard?.metadata_only === true);
  addResult(`${label}_read_only_true`, guard?.read_only === true);
  addResult(`${label}_display_only_true`, guard?.display_only === true);
  for (const field of falseFields) {
    addResult(`${label}_${field}_false`, guard?.[field] === false);
  }
}

function assertOutcomeCoverage(payload) {
  addResult("payload_status_ready", payload.status === "readonly_bridge_payload_ready");
  addResult("payload_type_expected", payload.payload_type === "metadata_only_visual_eval_review_result_bridge_payload");
  addResult("source_review_result_ref_expected", payload.source_refs?.review_result_protocol === reviewResultPath);
  addResult("source_taxonomy_ref_expected", payload.source_refs?.taxonomy === taxonomyPath);
  addResult("source_accumulation_ref_expected", payload.source_refs?.metadata_accumulation === accumulationPath);
  addResult("outcome_pass_count_one", payload.outcome_summary?.pass === 1);
  addResult("outcome_patch_count_one", payload.outcome_summary?.patch === 1);
  addResult("outcome_reject_count_one", payload.outcome_summary?.reject === 1);

  const rows = payload.review_bridge_readable_payload?.review_rows || [];
  addResult("review_bridge_rows_count_three", rows.length === 3);
  addResult("review_bridge_rows_include_pass_patch_reject", ["pass", "patch", "reject"].every((outcome) =>
    rows.some((row) => row.outcome === outcome)
  ));
  addResult("review_bridge_rows_have_session_and_case_refs", rows.every((row) =>
    row.session_id && row.case_id && row.taxonomy_ref === taxonomyPath && row.accumulation_ref === accumulationPath
  ));
  addResult("review_session_draft_status_readonly", payload.review_session_draft?.status === "draft_readonly");
  addResult("review_session_final_outcomes_visible", JSON.stringify(payload.review_session_draft?.final_outcomes_visible) === JSON.stringify(["pass", "patch", "reject"]));

  const imageCases = payload.image_case_drafts || [];
  addResult("image_case_drafts_count_three", imageCases.length === 3);
  addResult("image_case_drafts_show_pass_patch_reject", ["pass", "patch", "reject"].every((outcome) =>
    imageCases.some((item) => item.visible_outcome === outcome)
  ));
  addResult("image_case_drafts_have_session_refs", imageCases.every((item) => item.session_id === payload.review_session_draft?.session_id));
  addResult("patch_image_case_requires_patch", imageCases.some((item) => item.visible_outcome === "patch" && item.patch_required === true));
  addResult("reject_image_case_never_production", imageCases.some((item) => item.visible_outcome === "reject" && item.never_production === true));

  const records = payload.metadata_accumulation_draft?.records || [];
  addResult("metadata_accumulation_records_count_three", records.length === 3);
  addResult("metadata_accumulation_records_all_readonly", records.every((record) => record.write_allowed_now === false && record.consumer_status === "readonly_draft"));
  addResult("metadata_accumulation_records_have_artifact_refs", records.every((record) =>
    record.review_result_id && record.session_id === payload.review_session_draft?.session_id && record.case_id && record.accumulation_ref === accumulationPath
  ));
}

function assertNoAbsoluteOrLoopback(value, label) {
  const text = JSON.stringify(value);
  addResult(`${label}_no_windows_absolute_path`, !/[A-Za-z]:[\\/]/.test(text));
  addResult(`${label}_no_loopback_url`, !/(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1)/i.test(text));
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
  for (const file of [bridgeKernelPath, protocolValidatorPath, reviewResultPath, taxonomyPath, accumulationPath, payloadExamplePath]) {
    addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
  }
  runNode(["--check", bridgeKernelPath]);
  runNode(["--check", protocolValidatorPath]);
  runNode([protocolValidatorPath]);

  const bridgeKernel = require(repoPath(bridgeKernelPath));
  const payload = bridgeKernel.buildVisualEvalReviewResultBridgePayload({});
  const cliPayload = JSON.parse(runNode([bridgeKernelPath]));
  const expectedPayload = readJson(payloadExamplePath);

  addResult("direct_payload_matches_cli_payload", JSON.stringify(payload) === JSON.stringify(cliPayload));
  addResult("direct_payload_matches_example_payload", JSON.stringify(payload) === JSON.stringify(expectedPayload));
  assertOutcomeCoverage(payload);
  assertGuardFalse(payload.guard, "payload_guard");
  assertNoAbsoluteOrLoopback(payload, "payload");

  expectFailure("route_guard_true_rejected", () => {
    const fixture = readJson(reviewResultPath);
    fixture.review_results[0].route_guards.memory_write_allowed_now = true;
    bridgeKernel.buildVisualEvalReviewResultBridgePayload({ reviewResultFixture: fixture });
  });
  expectFailure("unknown_failure_tag_rejected", () => {
    const fixture = readJson(reviewResultPath);
    fixture.review_results[2].failure_tags = ["hallucinated_failure_tag"];
    bridgeKernel.buildVisualEvalReviewResultBridgePayload({ reviewResultFixture: fixture });
  });
  expectFailure("unknown_accumulation_ref_rejected", () => {
    const fixture = readJson(reviewResultPath);
    fixture.review_results[1].accumulation_ref = "tests/schema_examples/unknown_visual_eval_metadata_accumulation.example.json";
    bridgeKernel.buildVisualEvalReviewResultBridgePayload({ reviewResultFixture: fixture });
  });
  expectFailure("missing_outcome_rejected", () => {
    const fixture = readJson(reviewResultPath);
    fixture.review_results = fixture.review_results.filter((record) => record.outcome !== "patch");
    bridgeKernel.buildVisualEvalReviewResultBridgePayload({ reviewResultFixture: fixture });
  });

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_review_result_review_bridge_wiring",
    passed,
    payload_example: payloadExamplePath,
    bridge_kernel: bridgeKernelPath,
    review_result_consumed: true,
    review_session_draft_created: true,
    image_case_drafts_created: true,
    metadata_accumulation_draft_created: true,
    negative_case_count: 4,
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
  process.stderr.write(`${JSON.stringify({ passed: false, validator: "validate_visual_eval_review_result_review_bridge_wiring", errors }, null, 2)}\n`);
  process.exitCode = 1;
}
