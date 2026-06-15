#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  preflight: "reports/memory_write_authorization/r2r_v2_trial_002_codex_knowledge_memory_authorization_preflight_20260609.json",
  payload: "reports/memory_write_payloads/r2r_v2_trial_002_codex_knowledge_memory_write_payload_candidate_20260609.json",
  mappingGate: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_memory_candidate_no_write_mapping_gate_20260609.json",
  draft: "reports/memory_delta_drafts/r2r_v2_trial_002_lantern_ecommerce_hero_memory_delta_candidate_no_write_20260609.json",
  decision: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json",
  attemptSuccess: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_003_success_20260609.json",
  receipt: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_receipt.json",
  artifactRecord: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json",
  reviewBridge: "review_console/live_receipt_bridge/r2r_v2_trial_002_lantern_ecommerce_hero/bridge_entry.json",
  outputImage: "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/image/doubaogen/3e31d80a-5e43-4504-95bd-cef1decc720d.jpg"
};

const expected = {
  trialId: "r2r_v2_trial_002_lantern_ecommerce_hero",
  candidateId: "memcand_r2r_v2_trial_002_lantern_ecommerce_hero_20260609",
  decision: "accepted_candidate",
  sha256: "775b9f584daaa28eebc5e1eb100479d3efd1ce0c30379c6750038e6930952f36",
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

function sha256(relativePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(repoPath(relativePath)));
  return hash.digest("hex");
}

function assertNoRawLocalDrivePath(value, context) {
  if (typeof value === "string") {
    const windowsAbsolutePathPattern = /(?:^|[^A-Za-z0-9_])(?:[A-Za-z]:[\\/]|\\\\[^\\/\s]+[\\/][^\\/\s]+)/;
    assert(!windowsAbsolutePathPattern.test(value), `Raw local drive path found in ${context}`);
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

function includesAll(values, required, context) {
  for (const item of required) {
    assert(values.includes(item), `${context} missing ${item}`);
  }
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(fs.existsSync(repoPath(relativePath)), `Missing required file: ${relativePath}`);
  }

  const preflight = readJson(files.preflight);
  const payload = readJson(files.payload);
  const mappingGate = readJson(files.mappingGate);
  const draft = readJson(files.draft);
  const decision = readJson(files.decision);
  const attemptSuccess = readJson(files.attemptSuccess);
  const receipt = readJson(files.receipt);
  const artifactRecord = readJson(files.artifactRecord);
  const reviewBridge = readJson(files.reviewBridge);
  const checks = [];

  function check(name, fn) {
    fn();
    checks.push({ check: name, passed: true });
  }

  check("preflight_identity_and_no_write_status", () => {
    assert(preflight.schema === "agent_image_lab_trial_002_memory_authorization_preflight.v1", "preflight schema mismatch");
    assert(preflight.status === "completed_validated_memory_authorization_preflight_no_write", "preflight status mismatch");
    assert(preflight.lane_executed === "Green_preflight_no_write", "lane mismatch");
    assert(preflight.intent.includes("without_calling_any_writer"), "intent must be no-write");
    assert(preflight.payload_ref === files.payload, "payload ref mismatch");
    assert(preflight.authorization_decision.decision === "eligible_for_future_codex_knowledge_memory_write_packet", "authorization decision mismatch");
    assert(preflight.authorization_decision.should_write_memory_now === false, "preflight must not authorize immediate write");
    assert(preflight.authorization_decision.authorization_granted_by_this_preflight === false, "preflight must not grant execution authorization");
  });

  check("source_chain_is_accepted_candidate_not_delivery", () => {
    assert(decision.trial_id === expected.trialId, "decision trial id mismatch");
    assert(decision.decision === expected.decision, "decision mismatch");
    assert(decision.commercial_delivery_ready === false, "decision must not be commercial delivery ready");
    assert(mappingGate.target.trial_id === expected.trialId, "mapping trial id mismatch");
    assert(mappingGate.target.candidate_id === expected.candidateId, "candidate id mismatch");
    assert(mappingGate.go_no_go.memory_write_can_execute_now === false, "mapping gate must remain no-write");
    assert(draft.memory_delta.final_decision.should_write_to_vcp === false, "draft must remain no-write");
    assert(receipt.human_review_decision_ref === files.decision, "receipt decision ref mismatch");
    assert(artifactRecord.review_decision_ref === files.decision, "artifact decision ref mismatch");
    assert(reviewBridge.human_review_decision.review_decision_ref === files.decision, "bridge decision ref mismatch");
  });

  check("target_is_single_codex_knowledge_memory_future_write", () => {
    assert(preflight.target.target_system === expected.targetSystem, "target system mismatch");
    assert(preflight.target.writer_kind === "Codex_knowledge_memory_single_write", "writer kind mismatch");
    assert(preflight.target.target === expected.target, "target mismatch");
    assert(preflight.target.targetDiary === expected.targetDiary, "targetDiary mismatch");
    assert(preflight.target.max_write_entries === 1, "max write entries mismatch");
    assert(preflight.target.DailyNote_write_allowed === false, "DailyNote must be excluded");
    assert(preflight.target.VCP_memory_write_allowed === false, "VCP memory must be excluded");
    assert(preflight.target.Codex_knowledge_memory_write_allowed_in_future_execution === true, "future Codex write flag mismatch");
  });

  check("authorization_scope_blocks_execution_now", () => {
    assert(preflight.authorization_scope.preflight_only === true, "preflight_only must be true");
    assert(preflight.authorization_scope.authorization_granted_by_this_preflight === false, "execution authorization must be false");
    assert(preflight.authorization_scope.can_execute_now === false, "can_execute_now must be false");
    assert(preflight.authorization_scope.requires_next_explicit_execute_step === true, "explicit execute step must be required");
    includesAll(
      preflight.authorization_scope.forbidden_future_operations,
      [
        "DailyNote_write",
        "VCP_memory_dual_write",
        "provider_or_plugin_or_api_call",
        "image_generation",
        "secret_value_read",
        "accepted_samples_write",
        "durable_archive_write",
        "production_candidate_write",
        "push_tag_release_deploy"
      ],
      "forbidden_future_operations"
    );
  });

  check("payload_matches_candidate_and_is_chinese_safe", () => {
    assert(payload.schema === "agent_image_lab_codex_knowledge_memory_write_payload_candidate.v1", "payload schema mismatch");
    assert(payload.status === "prepared_candidate_no_write", "payload status mismatch");
    assert(payload.source_authorization_preflight_ref === files.preflight, "payload preflight ref mismatch");
    assert(payload.source_memory_delta_candidate_ref === files.draft, "payload draft ref mismatch");
    assert(payload.source_memory_candidate_mapping_gate_ref === files.mappingGate, "payload mapping ref mismatch");
    assert(payload.target_system === expected.targetSystem, "payload target system mismatch");
    assert(payload.target === expected.target, "payload target mismatch");
    assert(payload.targetDiary === expected.targetDiary, "payload targetDiary mismatch");
    assert(payload.metadata.source_trial_id === expected.trialId, "payload trial id mismatch");
    assert(payload.metadata.source_candidate_id === expected.candidateId, "payload candidate id mismatch");
    assert(payload.metadata.source_decision === expected.decision, "payload decision mismatch");
    assert(payload.metadata.commercial_delivery_ready === false, "payload must preserve non-delivery status");
    assert(payload.metadata.artifact_sha256 === expected.sha256, "payload sha mismatch");
    assert(payload.metadata.language === "zh-CN", "payload language mismatch");
    assert(/[\u4e00-\u9fff]/.test(payload.title), "payload title must contain Chinese");
    assert(/[\u4e00-\u9fff]/.test(payload.content), "payload content must contain Chinese");
    assert(payload.content.includes("不是最终商用交付图"), "payload must preserve commercial boundary");
    assert(payload.content.includes("尚未写入 DailyNote、VCP memory 或 Codex knowledge memory"), "payload must state no memory writes");
  });

  check("content_safety_blocks_secret_private_path_and_binary", () => {
    assertNoRawLocalDrivePath(preflight, "preflight");
    assertNoRawLocalDrivePath(payload, "payload");
    assert(preflight.content_safety.payload_contains_secret === false, "preflight secret safety mismatch");
    assert(preflight.content_safety.payload_contains_private_raw_data === false, "preflight private data safety mismatch");
    assert(preflight.content_safety.payload_contains_private_path === false, "preflight private path safety mismatch");
    assert(preflight.content_safety.payload_contains_image_binary === false, "preflight binary safety mismatch");
    assert(payload.content_safety.contains_secret === false, "payload secret safety mismatch");
    assert(payload.content_safety.contains_private_raw_data === false, "payload private data safety mismatch");
    assert(payload.content_safety.contains_private_path === false, "payload private path safety mismatch");
    assert(payload.content_safety.contains_image_binary === false, "payload binary safety mismatch");
    assert(payload.content_safety.uses_project_relative_refs === true, "payload must use project relative refs");
  });

  check("source_artifact_integrity_matches_payload", () => {
    assert(sha256(files.outputImage) === expected.sha256, "output image sha mismatch");
    assert(attemptSuccess.output_file.sha256 === expected.sha256, "attempt success sha mismatch");
    assert(receipt.output_files[0].sha256 === expected.sha256, "receipt sha mismatch");
    assert(artifactRecord.output_files[0].sha256 === expected.sha256, "artifact sha mismatch");
    assert(reviewBridge.image.sha256 === expected.sha256, "review bridge sha mismatch");
  });

  check("future_execute_packet_requirements_are_bounded", () => {
    const req = preflight.future_execute_packet_requirements;
    assert(req.selected_tool === expected.targetSystem, "future selected tool mismatch");
    assert(req.target === expected.target, "future target mismatch");
    assert(req.targetDiary === expected.targetDiary, "future targetDiary mismatch");
    assert(req.max_record_memory_calls === 1, "max record_memory calls mismatch");
    assert(req.max_successful_writes === 1, "max successful writes mismatch");
    assert(req.max_retries === 0, "max retries mismatch");
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
    assert(preflight.go_no_go.source_decision_is_accepted_candidate === true, "source decision go/no-go mismatch");
    assert(preflight.go_no_go.source_is_not_commercial_delivery_ready === true, "commercial boundary go/no-go mismatch");
    assert(preflight.go_no_go.target_is_codex_knowledge_only === true, "target go/no-go mismatch");
    assert(preflight.go_no_go.DailyNote_excluded === true, "DailyNote go/no-go mismatch");
    assert(preflight.go_no_go.VCP_memory_dual_write_excluded === true, "VCP go/no-go mismatch");
    assert(preflight.go_no_go.can_execute_now === false, "can execute must be false");
    assert(preflight.go_no_go.next_step_can_be_binding_ready_execution_packet === true, "next packet go/no-go mismatch");
    assert(preflight.go_no_go.next_auto_write_allowed === false, "next auto write must be false");
  });

  const result = {
    passed: true,
    validator: "runtime_to_review_v2_trial_002_memory_authorization_preflight",
    preflight_ref: files.preflight,
    payload_ref: files.payload,
    decision: preflight.authorization_decision.decision,
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
