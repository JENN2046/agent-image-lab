#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  packet: "reports/memory_write_authorization/r2r_v2_trial_001_codex_knowledge_memory_write_binding_ready_packet_20260608.json",
  preflight: "reports/memory_write_authorization/r2r_v2_trial_001_codex_knowledge_memory_write_preflight_20260608.json",
  payload: "reports/memory_write_payloads/r2r_v2_trial_001_codex_knowledge_memory_write_payload_20260608.json",
  mappingGate: "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_memory_candidate_no_write_mapping_gate_20260608.json"
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

  const packet = readJson(files.packet);
  const preflight = readJson(files.preflight);
  const payload = readJson(files.payload);
  const mappingGate = readJson(files.mappingGate);
  const args = packet.tool_arguments || {};
  const checks = [];

  function check(name, fn) {
    fn();
    checks.push({ check: name, passed: true });
  }

  check("packet_identity_and_binding_ready", () => {
    assert(packet.schema === "agent_image_lab_codex_knowledge_memory_write_binding_ready_packet.v1", "schema mismatch");
    assert(packet.status === "completed_validated_binding_ready_pending_single_record_memory_call", "status mismatch");
    assert(packet.lane === "Amber_C_memory", "lane mismatch");
    assert(packet.source_preflight_ref === files.preflight, "preflight ref mismatch");
    assert(packet.payload_ref === files.payload, "payload ref mismatch");
    assert(packet.can_execute_now === true, "can_execute_now must be true");
    assert(packet.execute_once === true, "execute_once must be true");
    assert(packet.retry_allowed === false, "retry must be false");
    assert(packet.selected_tool === "mcp__vcp_codex_memory.record_memory", "tool mismatch");
  });

  check("tool_arguments_are_exact_codex_knowledge", () => {
    assert(args.client_id === "codex", "client_id mismatch");
    assert(args.project_id === "agent-image-lab", "project_id mismatch");
    assert(args.task_id === "r2r_v2_trial_001_serum_detail_control", "task_id mismatch");
    assert(args.target === "knowledge", "target mismatch");
    assert(args.targetDiary === "Codex knowledge", "targetDiary mismatch");
    assert(args.visibility === "project", "visibility mismatch");
    assert(args.sensitivity === "none", "sensitivity mismatch");
    assert(args.validated === true, "validated mismatch");
    assert(args.reusable === true, "reusable mismatch");
    assert(args.title_ref.endsWith("#/title"), "title ref mismatch");
    assert(args.content_ref.endsWith("#/content"), "content ref mismatch");
    assert(args.evidence_ref === files.mappingGate, "evidence ref mismatch");
  });

  check("payload_and_preflight_match_packet", () => {
    assert(preflight.payload_ref === files.payload, "preflight payload mismatch");
    assert(preflight.go_no_go.can_execute_now === false, "preflight must remain no-write");
    assert(preflight.go_no_go.next_step_can_be_binding_ready_execution_packet === true, "preflight next step mismatch");
    assert(payload.target_system === packet.selected_tool, "payload target system mismatch");
    assert(payload.target === args.target, "payload target mismatch");
    assert(payload.targetDiary === args.targetDiary, "payload targetDiary mismatch");
    assert(payload.title && typeof payload.title === "string", "payload title missing");
    assert(payload.content && typeof payload.content === "string", "payload content missing");
    assert(/[\u4e00-\u9fff]/.test(payload.content), "payload content must contain Chinese");
    assert(mappingGate.go_no_go.memory_write_can_execute_now === false, "mapping gate must remain no-write");
  });

  check("execution_limits_are_one_call_no_retry", () => {
    const limits = packet.execution_limits || {};
    assert(limits.max_record_memory_calls === 1, "max record_memory calls mismatch");
    assert(limits.max_successful_writes === 1, "max successful writes mismatch");
    assert(limits.max_retries === 0, "max retries mismatch");
    assert(limits.secret_value_read_allowed === false, "secret read must be false");
    assert(limits.raw_private_data_print_allowed === false, "raw private print must be false");
    assert(limits.DailyNote_write_allowed === false, "DailyNote must be false");
    assert(limits.VCP_memory_write_allowed === false, "VCP memory must be false");
    assert(limits.provider_plugin_api_allowed === false, "provider/plugin/API must be false");
    assert(limits.image_generation_allowed === false, "image generation must be false");
  });

  check("guard_and_stop_conditions_are_safe", () => {
    assertNoRawLocalDrivePath(packet, "packet");
    for (const [key, value] of Object.entries(packet.guard_before_execution || {})) {
      assert(value === false, `guard_before_execution.${key} must be false`);
    }
    for (const required of [
      "record_memory_tool_unavailable",
      "target_not_knowledge",
      "targetDiary_not_Codex_knowledge",
      "request_would_call_DailyNote",
      "any_retry_would_be_needed"
    ]) {
      assert(packet.stop_conditions.includes(required), `missing stop condition ${required}`);
    }
  });

  const result = {
    passed: true,
    validator: "runtime_to_review_v2_trial_001_codex_knowledge_memory_write_binding_ready_packet",
    packet_ref: files.packet,
    can_execute_now: true,
    selected_tool: packet.selected_tool,
    target: args.target,
    targetDiary: args.targetDiary,
    max_record_memory_calls: packet.execution_limits.max_record_memory_calls,
    retry_allowed: packet.retry_allowed,
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
