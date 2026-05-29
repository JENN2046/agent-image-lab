#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const defaultInputPath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";
const adapterId = "review_bridge_runtime_v1_readonly";
const adapterContract = "runtime_kernel_v1_contract.review_bridge_readonly.v1";

const bridgeGuard = Object.freeze({
  read_only: true,
  display_only: true,
  metadata_only: true,
  image_binary_read_performed: false,
  fetch_performed: false,
  file_write_performed: false,
  approval_write_performed: false,
  archive_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_created: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  secret_value_read_performed: false,
  push_tag_release_deploy_performed: false,
});

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeId(value) {
  assertString(value, "id");
  const safe = value.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  if (!safe) throw new Error("id must contain at least one safe character");
  return safe;
}

function assertFalse(value, label) {
  if (value === true) {
    throw new Error(`${label} must be false`);
  }
}

function normalizeRepoRelativePath(value, label) {
  assertString(value, label);
  if (path.isAbsolute(value)) {
    throw new Error(`${label} must be a repository-relative path`);
  }
  const normalized = value.replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal segments`);
  }
  const resolved = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return {
    normalized: relative,
    resolved,
  };
}

function assertNoBridgeSideEffects(entry, label) {
  [
    "image_binary_read_performed",
    "file_write_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "accepted_samples_write_performed",
    "production_candidate_write_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
  ].forEach((field) => assertFalse(entry[field], `${label}.${field}`));
}

function assertAuditSideEffectsClean(auditReceipt) {
  const flags = auditReceipt.side_effect_flags || {};
  [
    "forbidden_disk_write_performed",
    "production_write_performed",
    "accepted_samples_write_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "secret_value_read_performed",
    "env_file_content_read_performed",
    "push_tag_release_deploy_performed",
  ].forEach((field) => assertFalse(flags[field], `audit_receipt.side_effect_flags.${field}`));

  const forbiddenWrites = auditReceipt.forbidden_writes || {};
  [
    "daily_note",
    "vcp_memory",
    "accepted_samples",
    "production_candidate",
    "push_tag_release_deploy",
  ].forEach((field) => assertFalse(forbiddenWrites[field], `audit_receipt.forbidden_writes.${field}`));

  const secret = auditReceipt.secret_handling || {};
  [
    "secret_value_read_allowed",
    "secret_value_read_performed",
    "env_file_content_read_performed",
    "secret_values_printed",
    "secret_values_written",
  ].forEach((field) => assertFalse(secret[field], `audit_receipt.secret_handling.${field}`));
}

function validateRuntimeV1BridgeParts({ reviewBridgeEntry, artifactRecord, auditReceipt }) {
  assertObject(reviewBridgeEntry, "reviewBridgeEntry");
  assertObject(artifactRecord, "artifactRecord");
  assertObject(auditReceipt, "auditReceipt");

  if (reviewBridgeEntry.schema !== "runtime_v1_review_bridge_entry.v1") {
    throw new Error("reviewBridgeEntry schema mismatch");
  }
  if (artifactRecord.schema !== "runtime_v1_artifact_record.v1") {
    throw new Error("artifactRecord schema mismatch");
  }
  if (auditReceipt.schema !== "runtime_v1_audit_receipt.v1") {
    throw new Error("auditReceipt schema mismatch");
  }
  if (artifactRecord.status !== "review_pending") {
    throw new Error("artifactRecord must be review_pending");
  }
  if (!["completed_fixture_artifact", "completed_provider_image_created"].includes(auditReceipt.status)) {
    throw new Error("auditReceipt status is not reviewable");
  }

  [
    ["run_id", reviewBridgeEntry.run_id],
    ["task_id", reviewBridgeEntry.task_id],
    ["source_prompt_package_ref", reviewBridgeEntry.source_prompt_package_ref],
    ["provider_route", reviewBridgeEntry.provider_route],
    ["model_required", reviewBridgeEntry.model_required],
    ["model_sent", reviewBridgeEntry.model_sent],
    ["image_dimensions", reviewBridgeEntry.image_dimensions],
    ["image_sha256", reviewBridgeEntry.image_sha256],
    ["artifact_record_ref", reviewBridgeEntry.artifact_record_ref],
    ["audit_receipt_ref", reviewBridgeEntry.audit_receipt_ref],
    ["current_review_status", reviewBridgeEntry.current_review_status],
  ].forEach(([field, value]) => assertString(value, `reviewBridgeEntry.${field}`));

  if (reviewBridgeEntry.current_review_status !== "pending_human_review") {
    throw new Error("reviewBridgeEntry must be pending_human_review");
  }
  if (reviewBridgeEntry.image_count !== 1 || artifactRecord.image_count !== 1) {
    throw new Error("runtime v1 readonly bridge requires exactly one image metadata record");
  }
  if (reviewBridgeEntry.metadata_only !== true || reviewBridgeEntry.display_only !== true) {
    throw new Error("reviewBridgeEntry must be metadata-only display-only");
  }
  if (reviewBridgeEntry.artifact_record_ref !== auditReceipt.artifact_record_ref) {
    throw new Error("artifact record ref mismatch between bridge and audit");
  }
  if (artifactRecord.audit_receipt_ref !== reviewBridgeEntry.audit_receipt_ref) {
    throw new Error("audit receipt ref mismatch between artifact and bridge");
  }
  if (artifactRecord.review_bridge_ref === null) {
    throw new Error("artifactRecord must reference a review bridge entry");
  }
  if (artifactRecord.sha256 !== reviewBridgeEntry.image_sha256) {
    throw new Error("image hash mismatch between artifact and bridge");
  }
  if (artifactRecord.dimensions !== reviewBridgeEntry.image_dimensions) {
    throw new Error("image dimensions mismatch between artifact and bridge");
  }
  if (artifactRecord.model_required !== reviewBridgeEntry.model_required) {
    throw new Error("model_required mismatch between artifact and bridge");
  }
  if (artifactRecord.model_sent !== reviewBridgeEntry.model_sent) {
    throw new Error("model_sent mismatch between artifact and bridge");
  }
  if (!Array.isArray(artifactRecord.output_files) || artifactRecord.output_files.length !== 1) {
    throw new Error("artifactRecord.output_files must contain exactly one metadata record");
  }

  const outputFile = artifactRecord.output_files[0];
  ["path", "sha256", "mime_type", "dimensions"].forEach((field) => {
    assertString(outputFile[field], `artifactRecord.output_files[0].${field}`);
  });
  normalizeRepoRelativePath(outputFile.path, "artifactRecord.output_files[0].path");
  assertNoBridgeSideEffects(reviewBridgeEntry, "reviewBridgeEntry");
  assertAuditSideEffectsClean(auditReceipt);
}

function buildRuntimeV1ReadonlyReviewSession({ reviewBridgeEntry, artifactRecord, auditReceipt }) {
  validateRuntimeV1BridgeParts({ reviewBridgeEntry, artifactRecord, auditReceipt });

  const outputFile = artifactRecord.output_files[0];
  const runId = reviewBridgeEntry.run_id;
  const caseId = `runtime_v1_case_${sanitizeId(runId)}`;
  const versionId = `${caseId}:version:metadata_only`;

  return {
    schema: "runtime_v1_readonly_review_session.v1",
    adapter_id: adapterId,
    adapter_contract: adapterContract,
    session_mode: "runtime_v1_real_entry_readonly",
    session_id: `runtime_v1_review_session_${sanitizeId(runId)}`,
    case_id: caseId,
    task_id: reviewBridgeEntry.task_id,
    project: "agent-image-lab",
    status: "readonly_real_session",
    current_review_status: reviewBridgeEntry.current_review_status,
    display_fields: {
      run_id: runId,
      prompt_package_ref: reviewBridgeEntry.source_prompt_package_ref,
      provider_route: reviewBridgeEntry.provider_route,
      provider_mode: reviewBridgeEntry.provider_mode,
      model_required: reviewBridgeEntry.model_required,
      model_sent: reviewBridgeEntry.model_sent,
      image_dimensions: reviewBridgeEntry.image_dimensions,
      image_sha256: reviewBridgeEntry.image_sha256,
      audit_receipt_ref: reviewBridgeEntry.audit_receipt_ref,
      artifact_record_ref: reviewBridgeEntry.artifact_record_ref,
    },
    image_versions: [
      {
        version_id: versionId,
        label: "Runtime v1 artifact metadata",
        asset_ref: outputFile.path,
        mime_type: outputFile.mime_type,
        dimensions: outputFile.dimensions,
        sha256: outputFile.sha256,
        image_binary_loaded: false,
      },
    ],
    current_version_id: versionId,
    audit_summary: {
      status: auditReceipt.status,
      calls_used: clone(auditReceipt.calls_used),
      budget: clone(auditReceipt.provider_plugin_api_call_budget),
      output_scope: auditReceipt.output_scope,
      stop_reason: auditReceipt.stop_reason,
    },
    allowed_actions: ["inspect_runtime_metadata", "inspect_audit_receipt", "record_human_decision_metadata_later"],
    forbidden_actions: [
      "read_image_binary",
      "call_provider",
      "call_plugin",
      "call_api",
      "generate_image",
      "write_accepted_samples",
      "write_production_candidate",
      "write_memory",
      "write_daily_note",
    ],
    guard: { ...bridgeGuard },
  };
}

function buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(runtimeResult) {
  assertObject(runtimeResult, "runtimeResult");
  if (!["completed_fixture_artifact", "completed_provider_image_created"].includes(runtimeResult.status)) {
    throw new Error("runtimeResult is not reviewable");
  }
  return buildRuntimeV1ReadonlyReviewSession({
    reviewBridgeEntry: runtimeResult.review_bridge_entry,
    artifactRecord: runtimeResult.artifact_record,
    auditReceipt: runtimeResult.audit_receipt,
  });
}

function resolveInputPath(argv) {
  const inputIndex = argv.indexOf("--input");
  const inputPath = inputIndex >= 0 ? argv[inputIndex + 1] : defaultInputPath;
  const { normalized, resolved } = normalizeRepoRelativePath(inputPath, "--input");
  if (!normalized.startsWith("tests/fixtures/")) {
    throw new Error("--input must be a repository-relative path under tests/fixtures/");
  }
  return resolved;
}

async function main() {
  const { runRuntimeKernelV1 } = require("../../kernel/runtime_kernel_v1_real_provider_guarded");
  const inputPath = resolveInputPath(process.argv.slice(2));
  const task = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const runtimeResult = await runRuntimeKernelV1(task);
  const session = buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult(runtimeResult);
  console.log(JSON.stringify(session, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(JSON.stringify({
      adapter_id: adapterId,
      passed: false,
      error: error.message,
      guard: { ...bridgeGuard },
    }, null, 2));
    process.exitCode = 1;
  });
}

module.exports = {
  adapterId,
  adapterContract,
  bridgeGuard,
  buildRuntimeV1ReadonlyReviewSession,
  buildRuntimeV1ReadonlyReviewSessionFromRuntimeResult,
  normalizeRepoRelativePath,
  resolveInputPath,
};
