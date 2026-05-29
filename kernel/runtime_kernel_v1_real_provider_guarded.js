#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const repoRoot = path.resolve(__dirname, "..");
const defaultInputPath = "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json";
const kernelId = "runtime_kernel_v1_real_provider_guarded";
const contractId = "runtime_kernel_v1_contract";
const contractVersion = "v1.0";

const allowedProviderRoutes = Object.freeze(["native_doubao_guarded", "no_provider_fixture"]);
const allowedProviderModes = Object.freeze(["real_guarded", "no_provider_fixture"]);
const terminalStatuses = Object.freeze([
  "completed_provider_image_created",
  "completed_fixture_artifact",
  "failed_closed",
]);

const cleanSideEffectFlags = Object.freeze({
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  forbidden_disk_write_performed: false,
  production_write_performed: false,
  accepted_samples_write_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  secret_value_read_performed: false,
  env_file_content_read_performed: false,
  push_tag_release_deploy_performed: false,
});

const runtimeContract = Object.freeze({
  contract_id: contractId,
  contract_version: contractVersion,
  kernel_id: kernelId,
  status_values: [...terminalStatuses],
  runtime_v1_input: {
    required_fields: [
      "task_id",
      "prompt_package_ref",
      "provider_route",
      "provider_mode",
      "max_images",
      "output_scope",
      "review_required",
    ],
    provider_route: "native_doubao_guarded | no_provider_fixture",
    provider_mode: "real_guarded | no_provider_fixture",
    max_images: 1,
    output_scope: "run_directory_only",
    review_required: true,
    secret_value_read_allowed: false,
  },
  runtime_v1_result: {
    status: "completed_provider_image_created | completed_fixture_artifact | failed_closed",
    artifact_record_ref: "string | null",
    audit_receipt_ref: "string",
    review_bridge_ref: "string | null",
    calls_used: {
      provider: "number",
      plugin: "number",
      api: "number",
    },
    image_count: "number",
    stop_reason: "string | null",
  },
  artifact_record: {
    required_fields: [
      "run_id",
      "task_id",
      "source_prompt_package_ref",
      "provider_route",
      "model_required",
      "model_sent",
      "output_files",
      "image_count",
      "mime_type",
      "dimensions",
      "sha256",
      "audit_receipt_ref",
      "review_bridge_ref",
      "status",
    ],
    status_values: ["created", "failed", "review_pending"],
  },
  side_effect_policy: {
    secret_value_read_allowed: false,
    output_scope: "run_directory_only",
    overwrite_existing_files_allowed: false,
    production_write_allowed: false,
    memory_write_allowed: false,
    default_cli_real_provider_delegate_bound: false,
  },
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

function stableHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function getRuntimeContractV1() {
  return clone(runtimeContract);
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

function emptyCallsUsed() {
  return {
    provider: 0,
    plugin: 0,
    api: 0,
  };
}

function normalizeCallsUsed(value) {
  const calls = value && typeof value === "object" ? value : {};
  return {
    provider: Number(calls.provider || calls.provider_calls || 0),
    plugin: Number(calls.plugin || calls.plugin_calls || 0),
    api: Number(calls.api || calls.api_calls || 0),
  };
}

function buildRefs(task) {
  const runId = sanitizeId(task.run_id || `${task.task_id}_runtime_v1`);
  return {
    runId,
    artifactRecordRef: `runtime-to-review-v1://${runId}/artifact_record.json`,
    auditReceiptRef: `runtime-to-review-v1://${runId}/audit_receipt.json`,
    reviewBridgeRef: `runtime-to-review-v1://${runId}/review_bridge_entry.json`,
  };
}

function validateTaskInput(rawTask) {
  assertObject(rawTask, "runtime_v1_input");
  assertString(rawTask.task_id, "runtime_v1_input.task_id");
  assertString(rawTask.prompt_package_ref, "runtime_v1_input.prompt_package_ref");
  assertString(rawTask.provider_route, "runtime_v1_input.provider_route");
  assertString(rawTask.provider_mode, "runtime_v1_input.provider_mode");
  assertString(rawTask.output_scope, "runtime_v1_input.output_scope");

  if (!allowedProviderRoutes.includes(rawTask.provider_route)) {
    throw new Error("runtime_v1_input.provider_route is not allowed");
  }
  if (!allowedProviderModes.includes(rawTask.provider_mode)) {
    throw new Error("runtime_v1_input.provider_mode is not allowed");
  }
  if (rawTask.max_images !== 1) {
    throw new Error("runtime_v1_input.max_images must be 1");
  }
  if (rawTask.output_scope !== "run_directory_only") {
    throw new Error("runtime_v1_input.output_scope must be run_directory_only");
  }
  if (rawTask.review_required !== true) {
    throw new Error("runtime_v1_input.review_required must be true");
  }
  if (rawTask.secret_value_read_allowed === true) {
    throw new Error("runtime_v1_input.secret_value_read_allowed must be false or omitted");
  }
  if (rawTask.provider_mode === "real_guarded" && rawTask.provider_route !== "native_doubao_guarded") {
    throw new Error("real_guarded mode requires native_doubao_guarded route");
  }

  return {
    ...clone(rawTask),
    model_required: rawTask.model_required || "doubao-seedream-5-0-260128",
  };
}

function buildFailedClosed({ task, refs, stopReason, issues = [], callsUsed = emptyCallsUsed(), sideEffectFlags = cleanSideEffectFlags }) {
  const auditReceipt = buildAuditReceipt({
    task,
    refs,
    status: "failed_closed",
    callsUsed,
    imageCount: 0,
    sideEffectFlags,
    stopReason,
    issues,
  });
  const artifactRecord = buildArtifactRecord({
    task,
    refs,
    status: "failed",
    modelSent: null,
    outputFiles: [],
    imageCount: 0,
    mimeType: null,
    dimensions: null,
    sha256: null,
  });

  return buildResult({
    task,
    refs,
    status: "failed_closed",
    artifactRecord,
    auditReceipt,
    reviewBridgeEntry: null,
    callsUsed,
    imageCount: 0,
    stopReason,
    sideEffectFlags,
  });
}

function buildArtifactRecord({ task, refs, status, modelSent, outputFiles, imageCount, mimeType, dimensions, sha256 }) {
  return {
    schema: "runtime_v1_artifact_record.v1",
    run_id: refs.runId,
    task_id: task.task_id,
    source_prompt_package_ref: task.prompt_package_ref,
    provider_route: task.provider_route,
    model_required: task.model_required,
    model_sent: modelSent,
    output_files: Array.isArray(outputFiles) ? clone(outputFiles) : [],
    image_count: imageCount,
    mime_type: mimeType,
    dimensions,
    sha256,
    audit_receipt_ref: refs.auditReceiptRef,
    review_bridge_ref: status === "failed" ? null : refs.reviewBridgeRef,
    status,
  };
}

function buildAuditReceipt({ task, refs, status, callsUsed, imageCount, sideEffectFlags, stopReason = null, issues = [] }) {
  return {
    schema: "runtime_v1_audit_receipt.v1",
    kernel_id: kernelId,
    contract_id: contractId,
    contract_version: contractVersion,
    run_id: refs.runId,
    task_id: task.task_id,
    status,
    provider_route: task.provider_route,
    provider_mode: task.provider_mode,
    source_prompt_package_ref: task.prompt_package_ref,
    provider_plugin_api_call_budget: {
      max_provider_calls: task.provider_mode === "real_guarded" ? 1 : 0,
      max_plugin_calls: task.provider_mode === "real_guarded" ? 1 : 0,
      max_api_calls: task.provider_mode === "real_guarded" ? 1 : 0,
      max_images: 1,
    },
    calls_used: clone(callsUsed),
    image_count: imageCount,
    model_required: task.model_required,
    output_scope: "run_directory_only",
    forbidden_writes: {
      daily_note: false,
      vcp_memory: false,
      accepted_samples: false,
      production_candidate: false,
      push_tag_release_deploy: false,
    },
    secret_handling: {
      secret_value_read_allowed: false,
      secret_value_read_performed: false,
      env_file_content_read_performed: false,
      secret_values_printed: false,
      secret_values_written: false,
    },
    overwrite_existing_files_allowed: false,
    artifact_record_ref: refs.artifactRecordRef,
    review_bridge_ref: status === "failed_closed" ? null : refs.reviewBridgeRef,
    stop_reason: stopReason,
    issues: [...issues],
    side_effect_flags: { ...sideEffectFlags },
  };
}

function buildReviewBridgeEntry({ task, refs, artifactRecord, auditReceipt }) {
  return {
    schema: "runtime_v1_review_bridge_entry.v1",
    bridge_type: "runtime_to_review_real_entry_metadata_only",
    run_id: refs.runId,
    task_id: task.task_id,
    source_prompt_package_ref: task.prompt_package_ref,
    provider_route: task.provider_route,
    provider_mode: task.provider_mode,
    model_required: artifactRecord.model_required,
    model_sent: artifactRecord.model_sent,
    image_dimensions: artifactRecord.dimensions,
    image_sha256: artifactRecord.sha256,
    image_count: artifactRecord.image_count,
    artifact_record_ref: refs.artifactRecordRef,
    audit_receipt_ref: refs.auditReceiptRef,
    current_review_status: "pending_human_review",
    display_only: true,
    metadata_only: true,
    image_binary_read_performed: false,
    file_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    guard_summary: {
      human_review_required: true,
      production_candidate_allowed_now: false,
      memory_write_allowed_now: false,
      accepted_sample_write_allowed_now: false,
      audit_receipt_status: auditReceipt.status,
    },
  };
}

function buildResult({ task, refs, status, artifactRecord, auditReceipt, reviewBridgeEntry, callsUsed, imageCount, stopReason, sideEffectFlags }) {
  return {
    kernel_id: kernelId,
    version: "v1",
    contract: getRuntimeContractV1(),
    task_id: task.task_id,
    status,
    artifact_record_ref: status === "failed_closed" ? null : refs.artifactRecordRef,
    audit_receipt_ref: refs.auditReceiptRef,
    review_bridge_ref: reviewBridgeEntry ? refs.reviewBridgeRef : null,
    calls_used: clone(callsUsed),
    image_count: imageCount,
    stop_reason: stopReason,
    artifact_record: artifactRecord,
    audit_receipt: auditReceipt,
    review_bridge_entry: reviewBridgeEntry,
    side_effect_flags: { ...sideEffectFlags },
  };
}

function executeFixture(task, refs) {
  const fixtureArtifact = task.fixture_artifact && typeof task.fixture_artifact === "object"
    ? task.fixture_artifact
    : {};
  const outputFile = {
    path: fixtureArtifact.path || "fixtures/runtime_v1/no_provider_fixture_metadata_only.png",
    bytes: Number(fixtureArtifact.bytes || 0),
    sha256: fixtureArtifact.sha256 || stableHash({ task_id: task.task_id, prompt: task.prompt_package_ref }),
    mime_type: fixtureArtifact.mime_type || "image/png",
    dimensions: fixtureArtifact.dimensions || "1x1",
    metadata_only: true,
  };
  const artifactRecord = buildArtifactRecord({
    task,
    refs,
    status: "review_pending",
    modelSent: task.model_required,
    outputFiles: [outputFile],
    imageCount: 1,
    mimeType: outputFile.mime_type,
    dimensions: outputFile.dimensions,
    sha256: outputFile.sha256,
  });
  const callsUsed = emptyCallsUsed();
  const auditReceipt = buildAuditReceipt({
    task,
    refs,
    status: "completed_fixture_artifact",
    callsUsed,
    imageCount: 1,
    sideEffectFlags: cleanSideEffectFlags,
  });
  const reviewBridgeEntry = buildReviewBridgeEntry({ task, refs, artifactRecord, auditReceipt });
  return buildResult({
    task,
    refs,
    status: "completed_fixture_artifact",
    artifactRecord,
    auditReceipt,
    reviewBridgeEntry,
    callsUsed,
    imageCount: 1,
    stopReason: null,
    sideEffectFlags: cleanSideEffectFlags,
  });
}

async function executeRealGuarded(task, refs, providerDelegate) {
  if (typeof providerDelegate !== "function") {
    return buildFailedClosed({
      task,
      refs,
      stopReason: "provider_delegate_not_bound",
      issues: ["real_guarded mode requires an injected provider delegate"],
    });
  }

  const delegateRequest = {
    schema: "runtime_v1_provider_delegate_request.v1",
    task_id: task.task_id,
    prompt_package_ref: task.prompt_package_ref,
    provider_route: task.provider_route,
    provider_mode: task.provider_mode,
    model_required: task.model_required,
    max_images: 1,
    output_scope: "run_directory_only",
    secret_value_read_allowed: false,
    raw_provider_payload_allowed: false,
    production_write_allowed: false,
    memory_write_allowed: false,
  };

  let delegateResult;
  try {
    delegateResult = await providerDelegate(clone(delegateRequest));
  } catch (error) {
    return buildFailedClosed({
      task,
      refs,
      stopReason: "provider_delegate_threw",
      issues: [error.message],
    });
  }

  const validation = validateProviderDelegateResult(task, delegateResult);
  if (!validation.passed) {
    return buildFailedClosed({
      task,
      refs,
      stopReason: "provider_delegate_result_invalid",
      issues: validation.issues,
      callsUsed: validation.callsUsed,
      sideEffectFlags: validation.sideEffectFlags,
    });
  }

  const outputFile = validation.outputFiles[0];
  const artifactRecord = buildArtifactRecord({
    task,
    refs,
    status: "review_pending",
    modelSent: validation.modelSent,
    outputFiles: validation.outputFiles,
    imageCount: 1,
    mimeType: outputFile.mime_type,
    dimensions: outputFile.dimensions,
    sha256: outputFile.sha256,
  });
  const auditReceipt = buildAuditReceipt({
    task,
    refs,
    status: "completed_provider_image_created",
    callsUsed: validation.callsUsed,
    imageCount: 1,
    sideEffectFlags: validation.sideEffectFlags,
  });
  const reviewBridgeEntry = buildReviewBridgeEntry({ task, refs, artifactRecord, auditReceipt });
  return buildResult({
    task,
    refs,
    status: "completed_provider_image_created",
    artifactRecord,
    auditReceipt,
    reviewBridgeEntry,
    callsUsed: validation.callsUsed,
    imageCount: 1,
    stopReason: null,
    sideEffectFlags: validation.sideEffectFlags,
  });
}

function validateProviderDelegateResult(task, result) {
  const issues = [];
  const source = result && typeof result === "object" ? result : {};
  const callsUsed = normalizeCallsUsed(source.calls_used || source);
  const sideEffectFlags = {
    ...cleanSideEffectFlags,
    provider_contact_performed: source.provider_contact_performed === true,
    plugin_call_performed: source.plugin_call_performed === true,
    api_call_performed: source.api_call_performed === true,
    image_generation_performed: source.image_generation_performed === true,
  };
  const outputFiles = Array.isArray(source.output_files) ? clone(source.output_files) : [];
  const modelSent = source.model_sent || source.model_reported || source.model_requested || null;

  if (source.status !== "COMPLETED_PROVIDER_IMAGE_CREATED" && source.status !== "completed_provider_image_created") {
    issues.push("delegate status must be completed provider image created");
  }
  if (Array.isArray(source.issues)) {
    for (const issue of source.issues) {
      if (typeof issue === "string" && issue.trim()) {
        issues.push(`delegate_issue:${issue}`);
      }
    }
  }
  if (typeof source.reason === "string" && source.reason.trim()) {
    issues.push(`delegate_reason:${source.reason}`);
  }
  if (modelSent !== task.model_required) {
    issues.push("delegate model_sent must match model_required");
  }
  if (callsUsed.provider !== 1 || callsUsed.plugin !== 1 || callsUsed.api !== 1) {
    issues.push("delegate calls_used must be exactly provider=1 plugin=1 api=1");
  }
  if (source.image_count !== 1) {
    issues.push("delegate image_count must be 1");
  }
  if (outputFiles.length !== 1) {
    issues.push("delegate output_files must contain exactly one image");
  }
  if (source.secret_value_read_performed === true || source.env_file_content_read_performed === true) {
    issues.push("delegate must not report secret or env file content reads");
  }
  if (source.production_write_performed === true || source.accepted_samples_write_performed === true) {
    issues.push("delegate must not report production or accepted_samples writes");
  }
  if (source.DailyNote_write_performed === true || source.VCP_memory_write_performed === true) {
    issues.push("delegate must not report DailyNote or VCP memory writes");
  }
  if (outputFiles.length === 1) {
    const file = outputFiles[0];
    ["path", "sha256", "mime_type", "dimensions"].forEach((field) => {
      if (typeof file[field] !== "string" || file[field].trim() === "") {
        issues.push(`delegate output_files[0].${field} must be a non-empty string`);
      }
    });
    if (typeof file.path === "string") {
      try {
        normalizeRepoRelativePath(file.path, "delegate output file path");
      } catch (error) {
        issues.push(error.message);
      }
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    callsUsed,
    sideEffectFlags,
    outputFiles,
    modelSent,
  };
}

async function runRuntimeKernelV1(rawTask, options = {}) {
  let task;
  try {
    task = validateTaskInput(rawTask);
  } catch (error) {
    const fallbackTask = {
      task_id: rawTask && rawTask.task_id ? String(rawTask.task_id) : "runtime_v1_invalid_task",
      prompt_package_ref: rawTask && rawTask.prompt_package_ref ? String(rawTask.prompt_package_ref) : "invalid_prompt_package_ref",
      provider_route: rawTask && rawTask.provider_route ? String(rawTask.provider_route) : "no_provider_fixture",
      provider_mode: rawTask && rawTask.provider_mode ? String(rawTask.provider_mode) : "no_provider_fixture",
      model_required: rawTask && rawTask.model_required ? String(rawTask.model_required) : "doubao-seedream-5-0-260128",
    };
    const refs = buildRefs(fallbackTask);
    return buildFailedClosed({
      task: fallbackTask,
      refs,
      stopReason: "input_validation_failed",
      issues: [error.message],
    });
  }

  const refs = buildRefs(task);
  if (task.provider_mode === "no_provider_fixture") {
    return executeFixture(task, refs);
  }
  return executeRealGuarded(task, refs, options.providerDelegate);
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
  const inputPath = resolveInputPath(process.argv.slice(2));
  const task = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const result = await runRuntimeKernelV1(task);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(JSON.stringify({
      kernel_id: kernelId,
      passed: false,
      status: "failed_closed",
      error: error.message,
      side_effect_flags: { ...cleanSideEffectFlags },
    }, null, 2));
    process.exitCode = 1;
  });
}

module.exports = {
  kernelId,
  contractId,
  contractVersion,
  runtimeContract,
  cleanSideEffectFlags,
  getRuntimeContractV1,
  normalizeRepoRelativePath,
  validateTaskInput,
  validateProviderDelegateResult,
  runRuntimeKernelV1,
};
