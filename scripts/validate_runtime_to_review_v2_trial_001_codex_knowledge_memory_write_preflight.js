#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  preflight: "reports/memory_write_authorization/r2r_v2_trial_001_codex_knowledge_memory_write_preflight_20260608.json",
  payload: "reports/memory_write_payloads/r2r_v2_trial_001_codex_knowledge_memory_write_payload_20260608.json",
  memoryCandidate: "reports/memory_delta_drafts/r2r_v2_trial_001_serum_detail_control_memory_delta_candidate_no_write_20260608.json",
  mappingGate: "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_memory_candidate_no_write_mapping_gate_20260608.json",
  acceptedSampleMetadata: "accepted_samples/accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001/metadata.json",
  durableArchiveReport: "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_durable_archive_execution_report_20260608.json"
};

const expected = {
  sampleId: "accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001",
  candidateId: "memcand_r2r_v2_trial_001_serum_detail_control_20260608",
  sha256: "60af66aa0f26fc8e26eabd0719408d92b4efdc21b2f26737ae3e6fce1c1f9f82",
  targetSystem: "mcp__vcp_codex_memory.record_memory",
  target: "knowledge",
  targetDiary: "Codex knowledge"
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

function assertAllFalseExcept(object, allowedTrueKeys, context) {
  for (const [key, value] of Object.entries(object || {})) {
    if (allowedTrueKeys.includes(key)) {
      assert(value === true, `${context}.${key} must be true`);
    } else {
      assert(value === false || value === 0 || value === null, `${context}.${key} must be false, zero, or null`);
    }
  }
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(fs.existsSync(repoPath(relativePath)), `Missing required file: ${relativePath}`);
  }

  const preflight = readJson(files.preflight);
  const payload = readJson(files.payload);
  const memoryCandidate = readJson(files.memoryCandidate);
  const mappingGate = readJson(files.mappingGate);
  const metadata = readJson(files.acceptedSampleMetadata);
  const durableArchiveReport = readJson(files.durableArchiveReport);
  const checks = [];

  function check(name, fn) {
    fn();
    checks.push({ check: name, passed: true });
  }

  check("preflight_identity_and_no_write_status", () => {
    assert(preflight.schema === "agent_image_lab_codex_knowledge_memory_write_preflight.v1", "preflight schema mismatch");
    assert(preflight.status === "completed_validated_codex_knowledge_memory_write_preflight_no_write", "preflight status mismatch");
    assert(preflight.lane_executed === "Green_preflight_no_write", "lane mismatch");
    assert(preflight.payload_ref === files.payload, "payload ref mismatch");
    assert(preflight.authorization_scope.preflight_only === true, "preflight_only must be true");
    assert(preflight.authorization_scope.authorization_granted_by_this_preflight === false, "authorization must not be granted");
    assert(preflight.authorization_scope.can_execute_now === false, "can_execute_now must be false");
  });

  check("target_is_codex_knowledge_only", () => {
    assert(preflight.target.target_system === expected.targetSystem, "target system mismatch");
    assert(preflight.target.writer_kind === "Codex_knowledge_memory_single_write", "writer kind mismatch");
    assert(preflight.target.target === expected.target, "target mismatch");
    assert(preflight.target.targetDiary === expected.targetDiary, "targetDiary mismatch");
    assert(preflight.target.max_write_entries === 1, "max write entries mismatch");
    assert(preflight.target.DailyNote_target === null, "DailyNote target must be null");
    assert(preflight.target.VCP_memory_dual_target === null, "VCP dual target must be null");
    assert(preflight.target.DailyNote_write_allowed === false, "DailyNote must be excluded");
    assert(preflight.target.VCP_memory_write_allowed === false, "VCP memory must be excluded");
    assert(preflight.target.Codex_knowledge_memory_write_allowed_in_future_execution === true, "future Codex write flag mismatch");
  });

  check("payload_matches_candidate_and_is_chinese_safe", () => {
    assert(payload.schema === "agent_image_lab_codex_knowledge_memory_write_payload.v1", "payload schema mismatch");
    assert(payload.status === "prepared_no_write", "payload status mismatch");
    assert(payload.source_memory_delta_candidate_ref === files.memoryCandidate, "source memory candidate ref mismatch");
    assert(payload.target_system === expected.targetSystem, "payload target system mismatch");
    assert(payload.target === expected.target, "payload target mismatch");
    assert(payload.targetDiary === expected.targetDiary, "payload targetDiary mismatch");
    assert(payload.metadata.source_sample_id === expected.sampleId, "payload sample id mismatch");
    assert(payload.metadata.source_candidate_id === expected.candidateId, "payload candidate id mismatch");
    assert(payload.metadata.artifact_sha256 === expected.sha256, "payload sha mismatch");
    assert(payload.metadata.language === "zh-CN", "payload language mismatch");
    assert(/[\u4e00-\u9fff]/.test(payload.title), "payload title must contain Chinese");
    assert(/[\u4e00-\u9fff]/.test(payload.content), "payload content must contain Chinese");
    assert(payload.content.includes("不是最终品牌交付图"), "payload must preserve commercial boundary");
    assert(payload.content.includes("accepted_samples/"), "payload must include project-relative evidence ref");
  });

  check("content_safety_blocks_secret_private_path_and_binary", () => {
    assertNoRawLocalDrivePath(preflight, "preflight");
    assertNoRawLocalDrivePath(payload, "payload");
    for (const [key, value] of Object.entries(payload.content_safety)) {
      if (key === "uses_project_relative_refs") {
        assert(value === true, `payload.content_safety.${key} must be true`);
      } else {
        assert(value === false, `payload.content_safety.${key} must be false`);
      }
    }
    assert(preflight.content_safety.payload_contains_secret === false, "secret safety mismatch");
    assert(preflight.content_safety.payload_contains_private_raw_data === false, "private data safety mismatch");
    assert(preflight.content_safety.payload_contains_private_path === false, "private path safety mismatch");
    assert(preflight.content_safety.payload_contains_image_binary === false, "image binary safety mismatch");
  });

  check("source_chain_is_accepted_and_archived", () => {
    assert(memoryCandidate.memory_delta.final_decision.should_write_to_vcp === false, "source candidate must remain no-write draft");
    assert(mappingGate.go_no_go.memory_write_can_execute_now === false, "mapping gate must not execute");
    assert(mappingGate.target.sample_id === expected.sampleId, "mapping gate sample mismatch");
    assert(metadata.sample_id === expected.sampleId, "metadata sample mismatch");
    assert(metadata.artifact.durable_archive_ready === true, "durable archive must be ready");
    assert(durableArchiveReport.status === "completed_validated", "durable archive report status mismatch");
    assert(durableArchiveReport.results[0].target_sha256 === expected.sha256, "durable archive sha mismatch");
  });

  check("future_execute_packet_requirements_are_bounded", () => {
    const req = preflight.future_execute_packet_requirements;
    assert(req.selected_tool === expected.targetSystem, "future selected tool mismatch");
    assert(req.target === expected.target, "future target mismatch");
    assert(req.targetDiary === expected.targetDiary, "future targetDiary mismatch");
    assert(req.max_record_memory_calls === 1, "future max calls mismatch");
    assert(req.max_successful_writes === 1, "future max writes mismatch");
    assert(req.idempotency_required === true, "idempotency must be required");
    for (const required of ["memoryId", "canonicalHash", "idempotency_status", "validated", "reusable"]) {
      assert(req.post_write_required_evidence.includes(required), `missing post-write evidence ${required}`);
    }
  });

  check("guard_and_go_no_go_block_actual_write", () => {
    for (const [key, value] of Object.entries(preflight.calls_used)) {
      assert(value === 0, `calls_used.${key} must be zero`);
    }
    assertAllFalseExcept(preflight.guard, ["preflight_only"], "preflight.guard");
    assertAllFalseExcept(payload.guard, [], "payload.guard");
    assert(preflight.go_no_go.payload_prepared === true, "payload prepared mismatch");
    assert(preflight.go_no_go.target_is_codex_knowledge_only === true, "target go/no-go mismatch");
    assert(preflight.go_no_go.DailyNote_excluded === true, "DailyNote go/no-go mismatch");
    assert(preflight.go_no_go.VCP_memory_dual_write_excluded === true, "VCP dual go/no-go mismatch");
    assert(preflight.go_no_go.can_execute_now === false, "can execute must be false");
    assert(preflight.go_no_go.next_auto_write_allowed === false, "next auto write must be false");
  });

  const result = {
    passed: true,
    validator: "runtime_to_review_v2_trial_001_codex_knowledge_memory_write_preflight",
    preflight_ref: files.preflight,
    payload_ref: files.payload,
    target_system: expected.targetSystem,
    target: expected.target,
    targetDiary: expected.targetDiary,
    can_execute_now: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    Codex_memory_write_performed: false,
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
