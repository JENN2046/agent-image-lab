#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const helperPath = "adapters/runtime/review_decision_record_v1.js";
const bridgePath = "adapters/runtime/review_bridge_runtime_v1_readonly.js";
const kernelPath = "kernel/runtime_kernel_v1_real_provider_guarded.js";
const fixturePath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";
const schemaPath = "schemas/review_decision_record.schema.yaml";
const retry007ReceiptPath = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json";
const retry007ReviewNotePath = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/review_note.json";
const retry007DecisionPath = "review_console/review_decisions/v0_6_73_real_vcp_agent_generation_retry_007/decision_record.json";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    return { case_id: caseId, result: "caught" };
  }
  throw new Error(`${caseId} was not caught`);
}

function assertCleanRecord(record, label) {
  assert(record.schema === "review_decision_record.v1", `${label} schema mismatch`);
  assert(typeof record.decision_id === "string" && record.decision_id.length > 0, `${label} decision id missing`);
  assert(typeof record.artifact_record_ref === "string" && record.artifact_record_ref.length > 0, `${label} artifact ref missing`);
  assert(typeof record.audit_receipt_ref === "string" && record.audit_receipt_ref.length > 0, `${label} audit ref missing`);
  assert(typeof record.reviewer_note === "string" && record.reviewer_note.length > 0, `${label} reviewer note missing`);
  assert(record.production_candidate === false, `${label} production candidate must be false`);
  assert(record.memory_write_performed === false, `${label} memory write must be false`);
  assert(record.accepted_samples_write_performed === false, `${label} accepted samples write must be false`);
  assert(record.DailyNote_write_performed === false, `${label} DailyNote write must be false`);
  assert(record.VCP_memory_write_performed === false, `${label} VCP memory write must be false`);
  assert(record.metadata_only === true, `${label} metadata_only must be true`);
  assert(record.image_binary_copied === false, `${label} image binary copied must be false`);
  assert(record.image_binary_read_performed === false, `${label} image binary read must be false`);
  assert(record.source_image_moved_or_copied === false, `${label} source image copied/moved must be false`);
  assert(record.formal_registry_write_performed === false, `${label} formal registry write must be false`);
  Object.entries(record.side_effect_flags || {}).forEach(([field, value]) => {
    assert(value === false, `${label}.side_effect_flags.${field} must be false`);
  });
}

async function main() {
  [helperPath, bridgePath, kernelPath, schemaPath, retry007ReceiptPath, retry007ReviewNotePath, retry007DecisionPath].forEach((file) => {
    assert(fs.existsSync(repoPath(file)), `${file} missing`);
  });
  runNode(["--check", helperPath]);
  runNode(["--check", "scripts/validate_review_decision_record_v1.js"]);

  const helper = require(repoPath(helperPath));
  const bridge = require(repoPath(bridgePath));
  const kernel = require(repoPath(kernelPath));
  assert(helper.allowedDecisions.length === 5, "decision enum count mismatch");
  [
    "accept_sample_draft",
    "reject_sample_draft",
    "request_rework",
    "provider_link_success_evidence_only",
    "invalid_artifact",
  ].forEach((decision) => assert(helper.allowedDecisions.includes(decision), `${decision} enum missing`));

  const schema = readText(schemaPath);
  helper.allowedDecisions.forEach((decision) => assert(schema.includes(decision), `${decision} missing from schema`));
  [
    "production_candidate: false",
    "memory_write_performed: false",
    "output_directory: review_console/review_decisions",
  ].forEach((token) => assert(schema.includes(token), `${token} missing from schema`));

  const runtimeResult = await kernel.runRuntimeKernelV1(readJson(fixturePath));
  const session = bridge.buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(runtimeResult);
  const runtimeRecord = helper.buildReviewDecisionRecordFromRuntimeV1Session(session, {
    decision: "request_rework",
    reviewer_note: "Reviewer requests one metadata-only rework before any registry draft.",
    created_at: "2026-05-29T00:00:00.000Z",
  });
  assertCleanRecord(runtimeRecord, "runtime_record");
  assert(runtimeRecord.decision === "request_rework", "runtime decision mismatch");
  assert(runtimeRecord.artifact_record_ref === runtimeResult.artifact_record_ref, "runtime artifact ref mismatch");
  assert(runtimeRecord.audit_receipt_ref === runtimeResult.audit_receipt_ref, "runtime audit ref mismatch");

  const writeDir = "review_console/review_decisions/_validator_probe";
  const writeResult = helper.writeReviewDecisionRecord(runtimeRecord, { outputDir: writeDir, overwrite: true });
  assert(writeResult.output_path.startsWith(`${writeDir}/`), "write output path mismatch");
  assert(writeResult.file_write_performed === true, "write probe did not write");
  const written = readJson(writeResult.output_path);
  assertCleanRecord(written, "written_probe_record");
  fs.unlinkSync(repoPath(writeResult.output_path));
  fs.rmdirSync(repoPath(writeDir));

  const retryReceipt = readJson(retry007ReceiptPath);
  const retryReviewNote = readJson(retry007ReviewNotePath);
  const retryGenerated = helper.buildRetry007EvidenceOnlyDecisionRecord({
    receipt: retryReceipt,
    reviewNote: retryReviewNote,
  });
  const retryTracked = readJson(retry007DecisionPath);
  assertCleanRecord(retryTracked, "retry_007_tracked_record");
  assert(JSON.stringify(retryGenerated) === JSON.stringify(retryTracked), "retry_007 generated record must match tracked record");
  assert(retryTracked.decision === "provider_link_success_evidence_only", "retry_007 decision mismatch");
  assert(retryTracked.production_candidate === false, "retry_007 must not be production");
  assert(retryTracked.accepted_samples_write_performed === false, "retry_007 must not write accepted samples");
  assert(!retryTracked.decision_id.includes("accept_sample_draft"), "retry_007 must not become accepted draft");

  const negativeCases = [
    expectFailure("invalid_decision_enum_rejected", () => helper.buildReviewDecisionRecord({
      artifact_record_ref: "artifact-ref",
      audit_receipt_ref: "audit-ref",
      reviewer_note: "note",
      decision: "accept",
    })),
    expectFailure("missing_reviewer_note_rejected", () => helper.buildReviewDecisionRecord({
      artifact_record_ref: "artifact-ref",
      audit_receipt_ref: "audit-ref",
      decision: "request_rework",
    })),
    expectFailure("missing_artifact_ref_rejected", () => helper.buildReviewDecisionRecord({
      audit_receipt_ref: "audit-ref",
      reviewer_note: "note",
      decision: "request_rework",
    })),
    expectFailure("production_candidate_true_rejected", () => {
      const dirty = clone(runtimeRecord);
      dirty.production_candidate = true;
      helper.validateReviewDecisionRecord(dirty);
    }),
    expectFailure("memory_write_true_rejected", () => {
      const dirty = clone(runtimeRecord);
      dirty.memory_write_performed = true;
      helper.validateReviewDecisionRecord(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_review_decision_record_v1",
    helper_id: helper.helperId,
    decision_enum_count: helper.allowedDecisions.length,
    runtime_decision_record_verified: true,
    retry_007_regression_decision: retryTracked.decision,
    retry_007_not_accepted_sample: true,
    retry_007_not_production_candidate: true,
    write_probe_output_dir: writeDir,
    write_probe_cleaned_up: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    memory_write_performed: false,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_review_decision_record_v1",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
});
