#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const defaultInputPath = "tests/fixtures/runtime_kernel_v0_green_task.fixture.json";
const defaultStoreRoot = ".agent_private/runtime_audit_store/v0";
const storeSchema = "runtime_durable_audit_store.v0";
const adapterId = "durable_audit_store_v0";

const storeGuard = Object.freeze({
  local_audit_write_allowed: true,
  overwrite_existing_allowed: false,
  git_ignored_required: true,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  production_write_performed: false,
  accepted_samples_write_performed: false,
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
  const sanitized = value.replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  if (!sanitized) {
    throw new Error("id must contain at least one safe character");
  }
  return sanitized;
}

function stableHash(value) {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
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

function resolveInputPath(argv) {
  const inputIndex = argv.indexOf("--input");
  const inputPath = inputIndex >= 0 ? argv[inputIndex + 1] : defaultInputPath;
  const { normalized, resolved } = normalizeRepoRelativePath(inputPath, "--input");
  if (!normalized.startsWith("tests/fixtures/")) {
    throw new Error("--input must be a repository-relative path under tests/fixtures/");
  }
  return resolved;
}

function resolveStoreRoot(value = defaultStoreRoot) {
  const { normalized, resolved } = normalizeRepoRelativePath(value, "--store-root");
  if (!normalized.startsWith(".agent_private/runtime_audit_store/")) {
    throw new Error("--store-root must be under .agent_private/runtime_audit_store/");
  }
  return {
    normalized: normalized.replace(/\/+$/g, ""),
    resolved,
  };
}

function resolveRunId(argv, taskId) {
  const runIndex = argv.indexOf("--run-id");
  if (runIndex >= 0) {
    return sanitizeId(argv[runIndex + 1]);
  }
  return sanitizeId(`${taskId}_${new Date().toISOString()}`);
}

function resolveStoreRootFromArgv(argv) {
  const storeRootIndex = argv.indexOf("--store-root");
  return resolveStoreRoot(storeRootIndex >= 0 ? argv[storeRootIndex + 1] : defaultStoreRoot);
}

function assertFalseSideEffects(flags, label) {
  for (const [field, value] of Object.entries(flags || {})) {
    if (value === true) {
      throw new Error(`${label}.${field} must be false`);
    }
  }
}

function validateRuntimeResult(runtimeResult) {
  assertObject(runtimeResult, "runtimeResult");
  assertString(runtimeResult.task_id, "runtimeResult.task_id");
  assertString(runtimeResult.final_state, "runtimeResult.final_state");
  assertObject(runtimeResult.transition, "runtimeResult.transition");
  assertObject(runtimeResult.audit_record, "runtimeResult.audit_record");
  assertObject(runtimeResult.audit_record.side_effect_flags, "runtimeResult.audit_record.side_effect_flags");
  if (!["completed_stub", "blocked_red"].includes(runtimeResult.final_state)) {
    throw new Error("runtimeResult.final_state must be completed_stub or blocked_red");
  }
  assertFalseSideEffects(runtimeResult.audit_record.side_effect_flags, "runtimeResult.audit_record.side_effect_flags");
}

function validateReviewBridge(runtimeResult, reviewBridge) {
  if (reviewBridge === null || reviewBridge === undefined) {
    return null;
  }
  assertObject(reviewBridge, "reviewBridge");
  if (runtimeResult.final_state !== "completed_stub") {
    throw new Error("reviewBridge can only be stored for completed_stub runtime results");
  }
  if (reviewBridge.adapter_id !== "review_bridge_readonly_stub_v0") {
    throw new Error("reviewBridge.adapter_id must be review_bridge_readonly_stub_v0");
  }
  if (reviewBridge.writes_allowed_now !== false || reviewBridge.approve_reject_write_allowed_now !== false) {
    throw new Error("reviewBridge write flags must be false");
  }
  const caseDraft = reviewBridge.review_console_case_data?.image_case_draft;
  assertObject(caseDraft, "reviewBridge.review_console_case_data.image_case_draft");
  if (caseDraft.task_id !== runtimeResult.task_id) {
    throw new Error("reviewBridge task_id must match runtimeResult.task_id");
  }
  return {
    adapter_id: reviewBridge.adapter_id,
    state: reviewBridge.state,
    output_ref: reviewBridge.output_ref,
    image_case_id: caseDraft.case_id,
    review_session_id: reviewBridge.review_console_case_data.review_session_draft.session_id,
    display_only: true,
    writes_allowed_now: false,
  };
}

function listChainRecords(storeRoot) {
  const chainDir = path.join(storeRoot.resolved, "chains");
  if (!fs.existsSync(chainDir)) {
    return [];
  }
  return fs.readdirSync(chainDir)
    .filter((file) => file.endsWith(".chain.json"))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(chainDir, file), "utf8")));
}

function nextChainState(storeRoot) {
  const records = listChainRecords(storeRoot);
  const last = records[records.length - 1] || null;
  return {
    chain_sequence: records.length + 1,
    previous_record_hash: last ? last.record_hash : "GENESIS",
  };
}

function writeJsonNoOverwrite(relativePath, payload) {
  const { resolved } = normalizeRepoRelativePath(relativePath, "write path");
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, `${JSON.stringify(payload, null, 2)}\n`, { flag: "wx" });
}

function buildRunRecord(runtimeResult, reviewBridgeSummary, runId, storeRoot, chainState) {
  const payloadForHash = {
    store_schema: storeSchema,
    run_id: runId,
    task_id: runtimeResult.task_id,
    final_state: runtimeResult.final_state,
    transition: clone(runtimeResult.transition),
    audit_record: clone(runtimeResult.audit_record),
    review_bridge: reviewBridgeSummary,
    previous_record_hash: chainState.previous_record_hash,
  };
  const recordHash = stableHash(payloadForHash);
  return {
    ...payloadForHash,
    adapter_id: adapterId,
    store_root: storeRoot.normalized,
    record_hash: recordHash,
    immutable_write: true,
    overwrite_existing_allowed: false,
    git_ignored_required: true,
    guard: { ...storeGuard },
  };
}

function buildTaskIndexRecord(runRecord, runPath, taskIndexPath) {
  return {
    store_schema: `${storeSchema}.task_index`,
    adapter_id: adapterId,
    task_id: runRecord.task_id,
    run_id: runRecord.run_id,
    run_ref: runPath,
    task_index_ref: taskIndexPath,
    final_state: runRecord.final_state,
    record_hash: runRecord.record_hash,
    immutable_write: true,
    overwrite_existing_allowed: false,
    guard: { ...storeGuard },
  };
}

function buildChainRecord(runRecord, chainPath, chainState) {
  return {
    store_schema: `${storeSchema}.hash_chain`,
    adapter_id: adapterId,
    chain_sequence: chainState.chain_sequence,
    chain_ref: chainPath,
    run_id: runRecord.run_id,
    task_id: runRecord.task_id,
    previous_record_hash: chainState.previous_record_hash,
    record_hash: runRecord.record_hash,
    chain_hash: stableHash({
      chain_sequence: chainState.chain_sequence,
      previous_record_hash: chainState.previous_record_hash,
      record_hash: runRecord.record_hash,
      run_id: runRecord.run_id,
    }),
    immutable_write: true,
    overwrite_existing_allowed: false,
    guard: { ...storeGuard },
  };
}

function storeRuntimeAuditRecord({ runtimeResult, reviewBridge = null, storeRoot = defaultStoreRoot, runId }) {
  validateRuntimeResult(runtimeResult);
  const resolvedStoreRoot = typeof storeRoot === "string" ? resolveStoreRoot(storeRoot) : storeRoot;
  assertObject(resolvedStoreRoot, "storeRoot");
  assertString(resolvedStoreRoot.normalized, "storeRoot.normalized");
  assertString(resolvedStoreRoot.resolved, "storeRoot.resolved");

  const safeRunId = sanitizeId(runId || runtimeResult.task_id);
  const safeTaskId = sanitizeId(runtimeResult.task_id);
  const reviewBridgeSummary = validateReviewBridge(runtimeResult, reviewBridge);
  const chainState = nextChainState(resolvedStoreRoot);
  const runPath = `${resolvedStoreRoot.normalized}/runs/${safeRunId}.audit.json`;
  const taskIndexPath = `${resolvedStoreRoot.normalized}/tasks/${safeTaskId}/${safeRunId}.task-index.json`;
  const chainPath = `${resolvedStoreRoot.normalized}/chains/${String(chainState.chain_sequence).padStart(6, "0")}_${safeRunId}.chain.json`;

  const runRecord = buildRunRecord(runtimeResult, reviewBridgeSummary, safeRunId, resolvedStoreRoot, chainState);
  const taskIndexRecord = buildTaskIndexRecord(runRecord, runPath, taskIndexPath);
  const chainRecord = buildChainRecord(runRecord, chainPath, chainState);

  writeJsonNoOverwrite(runPath, runRecord);
  writeJsonNoOverwrite(taskIndexPath, taskIndexRecord);
  writeJsonNoOverwrite(chainPath, chainRecord);

  return {
    store_schema: storeSchema,
    adapter_id: adapterId,
    state: "durable_audit_record_stored",
    store_root: resolvedStoreRoot.normalized,
    run_id: safeRunId,
    task_id: runtimeResult.task_id,
    final_state: runtimeResult.final_state,
    run_ref: runPath,
    task_index_ref: taskIndexPath,
    chain_ref: chainPath,
    record_hash: runRecord.record_hash,
    previous_record_hash: chainState.previous_record_hash,
    chain_sequence: chainState.chain_sequence,
    local_audit_write_performed: true,
    overwrite_existing_allowed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    production_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    secret_value_read_performed: false,
    guard: { ...storeGuard },
  };
}

function readRunRecord(storeRoot, runId) {
  const resolvedStoreRoot = typeof storeRoot === "string" ? resolveStoreRoot(storeRoot) : storeRoot;
  const runPath = `${resolvedStoreRoot.normalized}/runs/${sanitizeId(runId)}.audit.json`;
  const { resolved } = normalizeRepoRelativePath(runPath, "run record path");
  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

function listTaskRuns(storeRoot, taskId) {
  const resolvedStoreRoot = typeof storeRoot === "string" ? resolveStoreRoot(storeRoot) : storeRoot;
  const safeTaskId = sanitizeId(taskId);
  const taskDir = path.join(resolvedStoreRoot.resolved, "tasks", safeTaskId);
  if (!fs.existsSync(taskDir)) {
    return [];
  }
  return fs.readdirSync(taskDir)
    .filter((file) => file.endsWith(".task-index.json"))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(taskDir, file), "utf8")));
}

function main() {
  const argv = process.argv.slice(2);
  const { runRuntimeKernelV0 } = require("../../kernel/runtime_kernel_v0");
  const { buildReviewBridgeReadonlyStub } = require("./review_bridge_readonly_stub");
  const inputPath = resolveInputPath(argv);
  const storeRoot = resolveStoreRootFromArgv(argv);
  const task = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const runtimeResult = runRuntimeKernelV0(task);
  const runId = resolveRunId(argv, runtimeResult.task_id);
  const reviewBridge = runtimeResult.final_state === "completed_stub"
    ? buildReviewBridgeReadonlyStub(runtimeResult)
    : null;
  const result = storeRuntimeAuditRecord({ runtimeResult, reviewBridge, storeRoot, runId });
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(JSON.stringify({
      adapter_id: adapterId,
      passed: false,
      error: error.message,
      guard: { ...storeGuard },
    }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = {
  adapterId,
  storeSchema,
  defaultStoreRoot,
  storeGuard,
  stableHash,
  sanitizeId,
  normalizeRepoRelativePath,
  resolveInputPath,
  resolveStoreRoot,
  storeRuntimeAuditRecord,
  readRunRecord,
  listTaskRuns,
};
