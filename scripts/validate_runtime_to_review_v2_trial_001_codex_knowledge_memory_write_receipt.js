#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  receipt: "reports/memory_write_receipts/r2r_v2_trial_001_codex_knowledge_memory_write_receipt_20260608.json",
  packet: "reports/memory_write_authorization/r2r_v2_trial_001_codex_knowledge_memory_write_binding_ready_packet_20260608.json",
  payload: "reports/memory_write_payloads/r2r_v2_trial_001_codex_knowledge_memory_write_payload_20260608.json",
  preflight: "reports/memory_write_authorization/r2r_v2_trial_001_codex_knowledge_memory_write_preflight_20260608.json"
};

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

function assertNoRawLocalDrivePath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawLocalDrivePath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawLocalDrivePath(item, `${context}.${key}`));
  }
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(fs.existsSync(repoPath(relativePath)), `Missing required file: ${relativePath}`);
  }

  const receipt = readJson(files.receipt);
  const packet = readJson(files.packet);
  const payload = readJson(files.payload);
  const preflight = readJson(files.preflight);
  const write = receipt.memory_write || {};
  const checks = [];

  function check(name, fn) {
    fn();
    checks.push({ check: name, passed: true });
  }

  check("receipt_identity_and_status", () => {
    assert(receipt.schema === "agent_image_lab_codex_knowledge_memory_write_receipt.v1", "schema mismatch");
    assert(receipt.status === "completed_codex_knowledge_memory_written", "status mismatch");
    assert(receipt.lane === "Amber_C_memory", "lane mismatch");
    assert(receipt.source_binding_ready_packet_ref === files.packet, "packet ref mismatch");
    assert(receipt.source_payload_ref === files.payload, "payload ref mismatch");
  });

  check("memory_write_matches_packet_and_payload", () => {
    assert(write.tool === packet.selected_tool, "tool mismatch");
    assert(write.target === packet.tool_arguments.target, "target mismatch");
    assert(write.targetDiary === packet.tool_arguments.targetDiary, "targetDiary mismatch");
    assert(write.target === payload.target, "payload target mismatch");
    assert(write.targetDiary === payload.targetDiary, "payload targetDiary mismatch");
    assert(write.title === payload.title, "title mismatch");
    assert(write.memoryId === "codex-knowledge-3a86b6bc791e427f9eeec8d53d9f3c79", "memoryId mismatch");
    assert(write.canonicalHash === "7ed8df1cd10dfaba0d56b222109299b61d09de37922e57b295a06980908415cf", "canonicalHash mismatch");
    assert(write.idempotency_status === "committed", "idempotency status mismatch");
    assert(write.idempotency_replayed === false, "idempotency replay mismatch");
    assert(write.decision === "accepted", "decision mismatch");
    assert(write.validated === true, "validated mismatch");
    assert(write.reusable === true, "reusable mismatch");
  });

  check("single_call_and_no_retry", () => {
    assert(receipt.calls_used.record_memory_attempts === 1, "record_memory attempts mismatch");
    assert(receipt.calls_used.successful_record_memory_writes === 1, "successful writes mismatch");
    assert(receipt.calls_used.DailyNote_writer_calls === 0, "DailyNote calls mismatch");
    assert(receipt.calls_used.VCP_memory_writer_calls === 0, "VCP memory calls mismatch");
    assert(receipt.guard.retry_performed === false, "retry must be false");
  });

  check("daily_note_and_vcp_dual_write_remain_excluded", () => {
    assert(receipt.daily_note_project_writer.performed === false, "DailyNote must be false");
    assert(receipt.vcp_memory_dual_write.performed === false, "VCP dual memory must be false");
    assert(receipt.guard.DailyNote_write_performed === false, "DailyNote guard mismatch");
    assert(receipt.guard.VCP_memory_write_performed === false, "VCP memory guard mismatch");
    assert(receipt.guard.Codex_memory_write_performed === true, "Codex memory guard mismatch");
  });

  check("receipt_redacts_raw_private_path", () => {
    assertNoRawLocalDrivePath(receipt, "receipt");
    assert(write.raw_memory_file_path_redacted === true, "raw path must be redacted");
    assert(receipt.content_safety.raw_private_path_written_to_project_receipt === false, "raw private path safety mismatch");
  });

  check("source_preflight_and_packet_boundaries_preserved", () => {
    assert(preflight.go_no_go.can_execute_now === false, "preflight must remain can_execute_now false");
    assert(packet.can_execute_now === true, "packet can_execute_now mismatch");
    assert(packet.retry_allowed === false, "packet retry mismatch");
    assert(packet.execution_limits.max_record_memory_calls === 1, "packet max calls mismatch");
    assert(packet.execution_limits.DailyNote_write_allowed === false, "packet DailyNote limit mismatch");
    assert(packet.execution_limits.VCP_memory_write_allowed === false, "packet VCP memory limit mismatch");
  });

  const result = {
    passed: true,
    validator: "runtime_to_review_v2_trial_001_codex_knowledge_memory_write_receipt",
    receipt_ref: files.receipt,
    memoryId: write.memoryId,
    canonicalHash: write.canonicalHash,
    idempotency_status: write.idempotency_status,
    record_memory_attempts: receipt.calls_used.record_memory_attempts,
    successful_record_memory_writes: receipt.calls_used.successful_record_memory_writes,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    check_count: checks.length,
    failed_count: 0,
    results: checks
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
