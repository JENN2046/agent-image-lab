#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_memory_candidate_no_write_mapping_gate";

const files = {
  gate: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_memory_candidate_no_write_mapping_gate_20260609.json",
  draft: "reports/memory_delta_drafts/r2r_v2_trial_002_lantern_ecommerce_hero_memory_delta_candidate_no_write_20260609.json",
  decision: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json",
  attemptSuccess: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_003_success_20260609.json",
  receipt: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_receipt.json",
  artifactRecord: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json",
  reviewBridge: "review_console/live_receipt_bridge/r2r_v2_trial_002_lantern_ecommerce_hero/bridge_entry.json",
  criteria: "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json",
  promptPackage: "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml",
  outputImage: "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/image/doubaogen/3e31d80a-5e43-4504-95bd-cef1decc720d.jpg"
};

const expected = {
  trialId: "r2r_v2_trial_002_lantern_ecommerce_hero",
  candidateId: "memcand_r2r_v2_trial_002_lantern_ecommerce_hero_20260609",
  sha256: "775b9f584daaa28eebc5e1eb100479d3efd1ce0c30379c6750038e6930952f36",
  decision: "accepted_candidate",
  dimensions: "1920x1920"
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
      assert(value === false || value === 0, `${context}.${key} must be false or zero`);
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

  const gate = readJson(files.gate);
  const draft = readJson(files.draft);
  const decision = readJson(files.decision);
  const attemptSuccess = readJson(files.attemptSuccess);
  const receipt = readJson(files.receipt);
  const artifactRecord = readJson(files.artifactRecord);
  const reviewBridge = readJson(files.reviewBridge);

  assertNoRawLocalDrivePath(gate, "gate");
  assertNoRawLocalDrivePath(draft, "draft");

  const checks = [];
  function check(name, fn) {
    fn();
    checks.push({ check: name, passed: true });
  }

  check("source_review_decision_is_accepted_candidate_not_delivery", () => {
    assert(decision.trial_id === expected.trialId, "decision trial id mismatch");
    assert(decision.decision === expected.decision, "decision must be accepted_candidate");
    assert(decision.commercial_delivery_ready === false, "decision must not be commercial delivery ready");
    assert(decision.explicit_non_actions.archive_write_performed === false, "review decision must not archive");
    assert(decision.explicit_non_actions.Codex_memory_write_performed === false, "review decision must not write Codex memory");
    assert(decision.next_gate_required.includes("separate_promotion_archive_or_memory_candidate_gate"), "decision must require separate next gate");
  });

  check("gate_is_mapping_only_no_write", () => {
    assert(gate.schema === "runtime_to_review_v2_memory_candidate_no_write_mapping_gate.v1", "gate schema mismatch");
    assert(gate.status === "completed_validated_memory_candidate_no_write_mapping", "gate status mismatch");
    assert(gate.execution_mode === "Green_mapping_only_no_write", "gate execution mode mismatch");
    assert(gate.target.trial_id === expected.trialId, "gate trial id mismatch");
    assert(gate.target.candidate_id === expected.candidateId, "gate candidate id mismatch");
    assert(gate.target.decision === expected.decision, "gate decision mismatch");
    assert(gate.target.commercial_delivery_ready === false, "gate must preserve non-delivery status");
    assert(gate.target.artifact_sha256 === expected.sha256, "gate sha mismatch");
    assert(gate.target.source_image_ref === files.outputImage, "gate source image ref mismatch");
    assert(gate.target.prompt_package_ref === files.promptPackage, "gate prompt ref mismatch");
    assert(gate.candidate_mapping.mapping_created === true, "mapping must be created");
    assert(gate.candidate_mapping.memory_delta_candidate_ref === files.draft, "draft ref mismatch");
    assert(gate.candidate_mapping.adapter_can_execute_now === false, "adapter must not execute now");
    assert(gate.candidate_mapping.memory_write_can_execute_now === false, "memory write must not execute now");
    assert(gate.candidate_mapping.daily_note_write_can_execute_now === false, "DailyNote write must not execute now");
    assert(gate.candidate_mapping.record_memory_selected_as_writer_now === false, "record_memory must not be selected now");
  });

  check("gate_source_refs_are_complete_and_aligned", () => {
    assert(gate.source_gate_refs.review_decision_ref === files.decision, "decision ref mismatch");
    assert(gate.source_gate_refs.execution_attempt_success_ref === files.attemptSuccess, "attempt success ref mismatch");
    assert(gate.source_gate_refs.receipt_ref === files.receipt, "receipt ref mismatch");
    assert(gate.source_gate_refs.artifact_record_ref === files.artifactRecord, "artifact ref mismatch");
    assert(gate.source_gate_refs.review_bridge_ref === files.reviewBridge, "review bridge ref mismatch");
    assert(gate.source_gate_refs.review_criteria_ref === files.criteria, "criteria ref mismatch");
    assert(receipt.human_review_decision_ref === files.decision, "receipt review decision ref mismatch");
    assert(artifactRecord.review_decision_ref === files.decision, "artifact review decision ref mismatch");
    assert(reviewBridge.human_review_decision.review_decision_ref === files.decision, "bridge review decision ref mismatch");
  });

  check("source_artifact_integrity_matches_candidate", () => {
    assert(sha256(files.outputImage) === expected.sha256, "output image sha mismatch");
    assert(artifactRecord.status === expected.decision, "artifact must be accepted_candidate");
    assert(artifactRecord.output_files[0].sha256 === expected.sha256, "artifact sha mismatch");
    assert(artifactRecord.output_files[0].path === files.outputImage, "artifact image ref mismatch");
    assert(artifactRecord.output_files[0].dimensions === expected.dimensions, "artifact dimensions mismatch");
    assert(receipt.output_files[0].sha256 === expected.sha256, "receipt sha mismatch");
    assert(attemptSuccess.output_file.sha256 === expected.sha256, "attempt success sha mismatch");
    assert(reviewBridge.image.sha256 === expected.sha256, "bridge sha mismatch");
  });

  check("gate_forbidden_actions_and_calls_are_zero", () => {
    includesAll(
      gate.forbidden_actions_preserved,
      [
        "call_record_memory",
        "call_daily_note_writer",
        "call_vcp_memory_writer",
        "provider_or_plugin_or_api_call",
        "image_generation",
        "accepted_samples_write",
        "durable_archive_write",
        "push_tag_release_deploy"
      ],
      "forbidden_actions_preserved"
    );
    for (const [key, value] of Object.entries(gate.calls_used)) {
      assert(value === 0, `calls_used.${key} must be zero`);
    }
    assertAllFalseExcept(gate.guard, ["mapping_only"], "gate.guard");
  });

  check("go_no_go_blocks_memory_archive_and_promotion", () => {
    assert(gate.go_no_go.memory_candidate_mapping_created === true, "mapping go must be true");
    assert(gate.go_no_go.memory_delta_candidate_created === true, "draft go must be true");
    assert(gate.go_no_go.memory_write_can_execute_now === false, "memory write must be false");
    assert(gate.go_no_go.daily_note_write_can_execute_now === false, "DailyNote write must be false");
    assert(gate.go_no_go.next_auto_write_allowed === false, "next auto write must be false");
    assert(gate.go_no_go.accepted_samples_promotion_allowed === false, "accepted_samples promotion must be false");
    assert(gate.go_no_go.durable_archive_allowed === false, "durable archive must be false");
    assert(gate.recommended_next_auto_execution_allowed === false, "auto execution must be false");
  });

  check("draft_matches_memory_delta_no_write_contract", () => {
    const memoryDelta = draft.memory_delta;
    assert(draft.schema === "agent_image_lab_memory_delta_candidate_no_write.v1", "draft schema mismatch");
    assert(memoryDelta.task_id === expected.trialId, "draft task id mismatch");
    assert(memoryDelta.write_mode === "draft", "draft write mode mismatch");
    assert(memoryDelta.approval_required === true, "draft approval must be required");
    assert(memoryDelta.approval_status === "pending", "draft approval status mismatch");
    assert(memoryDelta.final_decision.should_write_to_vcp === false, "draft must not allow VCP write");
    assert(memoryDelta.final_decision.should_show_in_review_console === true, "draft should be visible in review console");
    assert(/[\u4e00-\u9fff]/.test(memoryDelta.chinese_diary_title), "title must contain Chinese");
    assert(/[\u4e00-\u9fff]/.test(memoryDelta.chinese_diary_content), "content must contain Chinese");
    assert(memoryDelta.chinese_diary_content.includes("尚未写入 DailyNote"), "content must state no DailyNote write");
    assert(memoryDelta.chinese_diary_content.includes("尚未写入") && memoryDelta.chinese_diary_content.includes("VCP memory"), "content must state no VCP memory write");
    assert(memoryDelta.chinese_diary_content.includes("Codex knowledge memory"), "content must state no Codex knowledge memory write");
    assert(memoryDelta.chinese_diary_content.includes("accepted_samples") && memoryDelta.chinese_diary_content.includes("durable archive"), "content must block promotion/archive");
    assert(memoryDelta.preserved_original.prompt_en_inline === null, "prompt must not be inlined");
    assert(memoryDelta.preserved_original.file_ref === files.outputImage, "draft file ref mismatch");
    assert(memoryDelta.preserved_original.prompt_en_ref === files.promptPackage, "draft prompt ref mismatch");
  });

  check("draft_safety_is_non_secret_non_binary", () => {
    const safety = draft.memory_delta.memory_safety;
    assert(safety.contains_secret === false, "draft must not contain secret");
    assert(safety.contains_private_path === false, "draft must not contain private path");
    assert(safety.contains_customer_private_data === false, "draft must not contain customer data");
    assert(safety.contains_image_binary === false, "draft must not contain image binary");
    assertAllFalseExcept(draft.guard, ["memory_candidate_mapping_created"], "draft.guard");
  });

  check("draft_refs_back_to_gate_and_source_evidence", () => {
    assert(draft.source_refs.mapping_gate_ref === files.gate, "draft gate ref mismatch");
    assert(draft.source_refs.review_decision_ref === files.decision, "draft decision ref mismatch");
    assert(draft.source_refs.execution_attempt_success_ref === files.attemptSuccess, "draft attempt ref mismatch");
    assert(draft.source_refs.artifact_record_ref === files.artifactRecord, "draft artifact ref mismatch");
    assert(draft.source_refs.receipt_ref === files.receipt, "draft receipt ref mismatch");
    assert(draft.source_refs.review_bridge_ref === files.reviewBridge, "draft bridge ref mismatch");
  });

  const result = {
    passed: true,
    validator,
    gate_ref: files.gate,
    memory_delta_candidate_ref: files.draft,
    trial_id: expected.trialId,
    candidate_id: expected.candidateId,
    decision: expected.decision,
    commercial_delivery_ready: false,
    artifact_sha256: expected.sha256,
    memory_candidate_mapping_created: true,
    memory_write_can_execute_now: false,
    accepted_samples_promotion_allowed: false,
    durable_archive_allowed: false,
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
