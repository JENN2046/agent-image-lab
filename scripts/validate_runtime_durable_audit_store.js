#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const storePath = "adapters/runtime/durable_audit_store.js";
const bridgePath = "adapters/runtime/review_bridge_readonly_stub.js";
const kernelPath = "kernel/runtime_kernel_v0.js";
const greenFixturePath = "tests/fixtures/runtime_kernel_v0_green_task.fixture.json";
const redFixturePath = "tests/fixtures/runtime_kernel_v0_red_task.fixture.json";
const validationStoreRoot = `.agent_private/runtime_audit_store/validation_${process.pid}_${Date.now()}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: options.timeout || 30000,
  });
}

function runNode(args) {
  return run(process.execPath, args);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertFalse(value, label) {
  assert(value === false, `${label} must be false`);
}

function assertGitIgnored(relativePath) {
  const output = run("git", ["check-ignore", "--verbose", "--", relativePath]).trim();
  assert(output.includes("/.agent_private/") || output.includes(".agent_private"), `${relativePath} must be ignored by .gitignore`);
  return output;
}

function assertStoreResult(result, expected) {
  assert(result.adapter_id === "durable_audit_store_v0", `${expected.label} adapter id mismatch`);
  assert(result.state === "durable_audit_record_stored", `${expected.label} state mismatch`);
  assert(result.store_root === validationStoreRoot, `${expected.label} store root mismatch`);
  assert(result.run_id === expected.runId, `${expected.label} run id mismatch`);
  assert(result.task_id === expected.taskId, `${expected.label} task id mismatch`);
  assert(result.final_state === expected.finalState, `${expected.label} final state mismatch`);
  assert(result.chain_sequence === expected.sequence, `${expected.label} chain sequence mismatch`);
  assert(result.previous_record_hash === expected.previousHash, `${expected.label} previous hash mismatch`);
  assert(result.local_audit_write_performed === true, `${expected.label} local audit write must be true`);
  assert(result.overwrite_existing_allowed === false, `${expected.label} overwrite must be false`);
  assertFalse(result.provider_contact_performed, `${expected.label}.provider_contact_performed`);
  assertFalse(result.plugin_call_performed, `${expected.label}.plugin_call_performed`);
  assertFalse(result.api_call_performed, `${expected.label}.api_call_performed`);
  assertFalse(result.image_generation_performed, `${expected.label}.image_generation_performed`);
  assertFalse(result.production_write_performed, `${expected.label}.production_write_performed`);
  assertFalse(result.DailyNote_write_performed, `${expected.label}.DailyNote_write_performed`);
  assertFalse(result.VCP_memory_write_performed, `${expected.label}.VCP_memory_write_performed`);
  assertFalse(result.secret_value_read_performed, `${expected.label}.secret_value_read_performed`);
  [result.run_ref, result.task_index_ref, result.chain_ref].forEach((ref) => {
    assert(ref.startsWith(`${validationStoreRoot}/`), `${expected.label} ref must stay under validation store`);
    assert(fs.existsSync(repoPath(ref)), `${expected.label} missing stored ref ${ref}`);
  });
}

function assertStoredFiles(result, expected) {
  const runRecord = readJson(result.run_ref);
  const taskIndex = readJson(result.task_index_ref);
  const chain = readJson(result.chain_ref);

  assert(runRecord.store_schema === "runtime_durable_audit_store.v0", `${expected.label} run schema mismatch`);
  assert(runRecord.adapter_id === "durable_audit_store_v0", `${expected.label} run adapter mismatch`);
  assert(runRecord.run_id === expected.runId, `${expected.label} stored run id mismatch`);
  assert(runRecord.task_id === expected.taskId, `${expected.label} stored task id mismatch`);
  assert(runRecord.final_state === expected.finalState, `${expected.label} stored final state mismatch`);
  assert(runRecord.record_hash === result.record_hash, `${expected.label} record hash mismatch`);
  assert(runRecord.previous_record_hash === expected.previousHash, `${expected.label} stored previous hash mismatch`);
  assert(runRecord.immutable_write === true, `${expected.label} immutable write missing`);
  assert(runRecord.overwrite_existing_allowed === false, `${expected.label} stored overwrite must be false`);
  assert(runRecord.guard.git_ignored_required === true, `${expected.label} git ignored guard missing`);

  assert(taskIndex.store_schema === "runtime_durable_audit_store.v0.task_index", `${expected.label} task index schema mismatch`);
  assert(taskIndex.task_id === expected.taskId, `${expected.label} task index task mismatch`);
  assert(taskIndex.run_ref === result.run_ref, `${expected.label} task index run ref mismatch`);
  assert(taskIndex.record_hash === result.record_hash, `${expected.label} task index hash mismatch`);

  assert(chain.store_schema === "runtime_durable_audit_store.v0.hash_chain", `${expected.label} chain schema mismatch`);
  assert(chain.chain_sequence === expected.sequence, `${expected.label} stored chain sequence mismatch`);
  assert(chain.previous_record_hash === expected.previousHash, `${expected.label} chain previous hash mismatch`);
  assert(chain.record_hash === result.record_hash, `${expected.label} chain record hash mismatch`);
  assert(typeof chain.chain_hash === "string" && chain.chain_hash.startsWith("fnv1a32:"), `${expected.label} chain hash missing`);

  return { runRecord, taskIndex, chain };
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    return {
      case_id: caseId,
      result: "caught",
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function cleanupValidationStore() {
  const rootPath = repoPath(validationStoreRoot);
  if (!fs.existsSync(rootPath)) {
    return;
  }
  const files = [];
  const dirs = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      const relative = path.relative(root, fullPath).replace(/\\/g, "/");
      assert(relative.startsWith(`${validationStoreRoot}/`), `Cleanup escaped validation store: ${relative}`);
      if (entry.isDirectory()) {
        walk(fullPath);
        dirs.push(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  walk(rootPath);
  files.forEach((file) => fs.unlinkSync(file));
  dirs.sort((a, b) => b.length - a.length).forEach((dir) => fs.rmdirSync(dir));
  fs.rmdirSync(rootPath);
}

function main() {
  cleanupValidationStore();

  assert(fs.existsSync(repoPath(storePath)), "durable audit store adapter missing");
  assert(fs.existsSync(repoPath(bridgePath)), "review bridge adapter missing");
  assert(fs.existsSync(repoPath(kernelPath)), "kernel file missing");
  runNode(["--check", storePath]);
  runNode(["--check", bridgePath]);
  runNode(["--check", kernelPath]);

  const ignoreEvidence = assertGitIgnored(`${validationStoreRoot}/probe.json`);
  const store = require(repoPath(storePath));
  const bridge = require(repoPath(bridgePath));
  const kernel = require(repoPath(kernelPath));
  assert(typeof store.storeRuntimeAuditRecord === "function", "storeRuntimeAuditRecord export missing");
  assert(typeof store.listTaskRuns === "function", "listTaskRuns export missing");
  assert(typeof store.readRunRecord === "function", "readRunRecord export missing");

  const greenResult = kernel.runRuntimeKernelV0(readJson(greenFixturePath));
  const greenBridge = bridge.buildReviewBridgeReadonlyStub(greenResult);
  const greenStore = store.storeRuntimeAuditRecord({
    runtimeResult: greenResult,
    reviewBridge: greenBridge,
    storeRoot: validationStoreRoot,
    runId: "green_run_001",
  });
  assertStoreResult(greenStore, {
    label: "green",
    runId: "green_run_001",
    taskId: "runtime-v0-green-task-001",
    finalState: "completed_stub",
    sequence: 1,
    previousHash: "GENESIS",
  });
  const greenFiles = assertStoredFiles(greenStore, {
    label: "green",
    runId: "green_run_001",
    taskId: "runtime-v0-green-task-001",
    finalState: "completed_stub",
    sequence: 1,
    previousHash: "GENESIS",
  });
  assert(greenFiles.runRecord.review_bridge.review_session_id === "review_session_runtime-v0-green-task-001", "green review bridge session mismatch");

  const redResult = kernel.runRuntimeKernelV0(readJson(redFixturePath));
  const redStore = store.storeRuntimeAuditRecord({
    runtimeResult: redResult,
    reviewBridge: null,
    storeRoot: validationStoreRoot,
    runId: "red_run_001",
  });
  assertStoreResult(redStore, {
    label: "red",
    runId: "red_run_001",
    taskId: "runtime-v0-red-task-001",
    finalState: "blocked_red",
    sequence: 2,
    previousHash: greenStore.record_hash,
  });
  assertStoredFiles(redStore, {
    label: "red",
    runId: "red_run_001",
    taskId: "runtime-v0-red-task-001",
    finalState: "blocked_red",
    sequence: 2,
    previousHash: greenStore.record_hash,
  });

  const cliOutput = JSON.parse(runNode([
    storePath,
    "--input",
    greenFixturePath,
    "--store-root",
    validationStoreRoot,
    "--run-id",
    "green_cli_run_001",
  ]));
  assertStoreResult(cliOutput, {
    label: "cli",
    runId: "green_cli_run_001",
    taskId: "runtime-v0-green-task-001",
    finalState: "completed_stub",
    sequence: 3,
    previousHash: redStore.record_hash,
  });
  assertStoredFiles(cliOutput, {
    label: "cli",
    runId: "green_cli_run_001",
    taskId: "runtime-v0-green-task-001",
    finalState: "completed_stub",
    sequence: 3,
    previousHash: redStore.record_hash,
  });

  const taskRuns = store.listTaskRuns(validationStoreRoot, "runtime-v0-green-task-001");
  assert(taskRuns.length === 2, "green task should have two task index records");
  const readBack = store.readRunRecord(validationStoreRoot, "green_run_001");
  assert(readBack.record_hash === greenStore.record_hash, "readRunRecord hash mismatch");

  const negativeCases = [
    expectFailure("duplicate_run_id_rejected", () => store.storeRuntimeAuditRecord({
      runtimeResult: greenResult,
      reviewBridge: greenBridge,
      storeRoot: validationStoreRoot,
      runId: "green_run_001",
    })),
    expectFailure("outside_store_root_rejected", () => store.resolveStoreRoot("runs/runtime_audit_store")),
    expectFailure("traversal_store_root_rejected", () => store.resolveStoreRoot(".agent_private/runtime_audit_store/../escape")),
    expectFailure("dirty_side_effect_flag_rejected", () => {
      const dirty = clone(greenResult);
      dirty.audit_record.side_effect_flags.provider_contact_performed = true;
      store.storeRuntimeAuditRecord({
        runtimeResult: dirty,
        reviewBridge: greenBridge,
        storeRoot: validationStoreRoot,
        runId: "dirty_side_effect",
      });
    }),
    expectFailure("red_review_bridge_rejected", () => store.storeRuntimeAuditRecord({
      runtimeResult: redResult,
      reviewBridge: greenBridge,
      storeRoot: validationStoreRoot,
      runId: "red_with_bridge",
    })),
    expectFailure("review_bridge_task_drift_rejected", () => {
      const dirtyBridge = clone(greenBridge);
      dirtyBridge.review_console_case_data.image_case_draft.task_id = "other-task";
      store.storeRuntimeAuditRecord({
        runtimeResult: greenResult,
        reviewBridge: dirtyBridge,
        storeRoot: validationStoreRoot,
        runId: "bridge_task_drift",
      });
    }),
  ];

  cleanupValidationStore();

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_durable_audit_store",
    adapter_id: "durable_audit_store_v0",
    store_schema: "runtime_durable_audit_store.v0",
    store_root: validationStoreRoot,
    store_root_git_ignored: true,
    audit_ignore_evidence: ignoreEvidence,
    green_run: {
      run_id: greenStore.run_id,
      final_state: greenStore.final_state,
      chain_sequence: greenStore.chain_sequence,
      previous_record_hash: greenStore.previous_record_hash,
    },
    red_run: {
      run_id: redStore.run_id,
      final_state: redStore.final_state,
      chain_sequence: redStore.chain_sequence,
      previous_record_hash: redStore.previous_record_hash,
    },
    cli_run_stored: true,
    task_index_query_count: taskRuns.length,
    hash_chain_verified: true,
    no_overwrite_verified: true,
    cleanup_performed: true,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    local_audit_write_performed: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    production_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    secret_value_read_performed: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  try {
    cleanupValidationStore();
  } catch (_cleanupError) {
    // Validation cleanup is best-effort after a failed assertion.
  }
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_durable_audit_store",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
