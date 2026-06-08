#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  gate: "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_memory_candidate_no_write_mapping_gate_20260608.json",
  draft: "reports/memory_delta_drafts/r2r_v2_trial_001_serum_detail_control_memory_delta_candidate_no_write_20260608.json",
  metadata: "accepted_samples/accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001/metadata.json",
  manifest: "accepted_samples/accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001/manifest.json",
  sourceEvidence: "accepted_samples/accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001/source_evidence.json",
  artifactRecord: "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_artifact_record.json",
  durableArchiveReport: "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_durable_archive_execution_report_20260608.json"
};

const expected = {
  sampleId: "accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001",
  candidateId: "memcand_r2r_v2_trial_001_serum_detail_control_20260608",
  sha256: "60af66aa0f26fc8e26eabd0719408d92b4efdc21b2f26737ae3e6fce1c1f9f82",
  sourceImageRef: "runs/real_generation/runtime_to_review_v2_trial_001_serum_detail_control/7bb59380-abb4-4180-9fa6-6a71549aec41.jpg",
  durableArchiveRef: "asset_archive/original_assets/by_sha256/60af66aa0f26fc8e26eabd0719408d92b4efdc21b2f26737ae3e6fce1c1f9f82.jpg",
  memoryWriteReceiptRef: "reports/memory_write_receipts/r2r_v2_trial_001_codex_knowledge_memory_write_receipt_20260608.json",
  codexKnowledgeMemoryId: "codex-knowledge-3a86b6bc791e427f9eeec8d53d9f3c79"
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
  const metadata = readJson(files.metadata);
  const manifest = readJson(files.manifest);
  const sourceEvidence = readJson(files.sourceEvidence);
  const artifactRecord = readJson(files.artifactRecord);
  const durableArchiveReport = readJson(files.durableArchiveReport);

  assertNoRawLocalDrivePath(gate, "gate");
  assertNoRawLocalDrivePath(draft, "draft");

  const checks = [];
  function check(name, fn) {
    fn();
    checks.push({ check: name, passed: true });
  }

  check("gate_is_mapping_only_no_write", () => {
    assert(gate.schema === "runtime_to_review_v2_memory_candidate_no_write_mapping_gate.v1", "gate schema mismatch");
    assert(gate.status === "completed_validated_memory_candidate_no_write_mapping", "gate status mismatch");
    assert(gate.execution_mode === "Green_mapping_only_no_write", "gate execution mode mismatch");
    assert(gate.target.sample_id === expected.sampleId, "gate sample id mismatch");
    assert(gate.target.candidate_id === expected.candidateId, "gate candidate id mismatch");
    assert(gate.target.artifact_sha256 === expected.sha256, "gate sha mismatch");
    assert(gate.target.source_image_ref === expected.sourceImageRef, "gate source image ref mismatch");
    assert(gate.target.durable_archive_ref === expected.durableArchiveRef, "gate durable archive ref mismatch");
    assert(gate.candidate_mapping.mapping_created === true, "mapping must be created");
    assert(gate.candidate_mapping.memory_delta_candidate_ref === files.draft, "draft ref mismatch");
    assert(gate.candidate_mapping.adapter_can_execute_now === false, "adapter must not execute now");
    assert(gate.candidate_mapping.memory_write_can_execute_now === false, "memory write must not execute now");
    assert(gate.candidate_mapping.daily_note_write_can_execute_now === false, "DailyNote write must not execute now");
    assert(gate.candidate_mapping.record_memory_selected_as_writer_now === false, "record_memory must not be selected now");
  });

  check("gate_forbidden_actions_and_calls_are_zero", () => {
    includesAll(
      gate.forbidden_actions_preserved,
      [
        "call_record_memory",
        "call_daily_note_writer",
        "call_vcp_memory_writer",
        "read_env_or_secret_files",
        "provider_or_plugin_or_api_call",
        "image_generation",
        "push_tag_release_deploy"
      ],
      "forbidden_actions_preserved"
    );
    for (const [key, value] of Object.entries(gate.calls_used)) {
      assert(value === 0, `calls_used.${key} must be zero`);
    }
    assertAllFalseExcept(gate.guard, ["mapping_only"], "gate.guard");
  });

  check("go_no_go_blocks_write", () => {
    assert(gate.go_no_go.memory_candidate_mapping_created === true, "mapping go must be true");
    assert(gate.go_no_go.memory_delta_candidate_created === true, "draft go must be true");
    assert(gate.go_no_go.adapter_packet_created === false, "adapter packet must be false");
    assert(gate.go_no_go.future_writer_target_resolved === false, "writer target must not be resolved");
    assert(gate.go_no_go.memory_write_can_execute_now === false, "memory write must be false");
    assert(gate.go_no_go.daily_note_write_can_execute_now === false, "DailyNote write must be false");
    assert(gate.go_no_go.next_auto_write_allowed === false, "next auto write must be false");
    assert(gate.recommended_next_auto_execution_allowed === false, "auto execution must be false");
  });

  check("draft_matches_memory_delta_no_write_contract", () => {
    const memoryDelta = draft.memory_delta;
    assert(draft.schema === "agent_image_lab_memory_delta_candidate_no_write.v1", "draft schema mismatch");
    assert(memoryDelta.task_id === "r2r_v2_trial_001_serum_detail_control", "draft task id mismatch");
    assert(memoryDelta.write_mode === "draft", "draft write mode mismatch");
    assert(memoryDelta.approval_required === true, "draft approval must be required");
    assert(memoryDelta.approval_status === "pending", "draft approval status mismatch");
    assert(memoryDelta.final_decision.should_write_to_vcp === false, "draft must not allow VCP write");
    assert(memoryDelta.final_decision.should_show_in_review_console === true, "draft should be visible in review console");
    assert(/[\u4e00-\u9fff]/.test(memoryDelta.chinese_diary_title), "title must contain Chinese");
    assert(/[\u4e00-\u9fff]/.test(memoryDelta.chinese_diary_content), "content must contain Chinese");
    assert(memoryDelta.chinese_diary_content.includes("尚未写入 DailyNote"), "content must state no DailyNote write");
    assert(memoryDelta.chinese_diary_content.includes("尚未写入") && memoryDelta.chinese_diary_content.includes("VCP memory"), "content must state no VCP memory write");
    assert(memoryDelta.preserved_original.prompt_en_inline === null, "prompt must not be inlined");
    assert(memoryDelta.preserved_original.file_ref === expected.durableArchiveRef, "draft file ref must use durable archive");
  });

  check("draft_safety_is_non_secret_non_binary", () => {
    const safety = draft.memory_delta.memory_safety;
    assert(safety.contains_secret === false, "draft must not contain secret");
    assert(safety.contains_private_path === false, "draft must not contain private path");
    assert(safety.contains_customer_private_data === false, "draft must not contain customer data");
    assert(safety.contains_image_binary === false, "draft must not contain image binary");
    assertAllFalseExcept(draft.guard, ["memory_candidate_mapping_created"], "draft.guard");
  });

  check("accepted_sample_surfaces_reference_candidate_and_later_codex_memory_receipt", () => {
    assert(metadata.memory_candidate.mapping_gate_ref === files.gate, "metadata mapping gate ref mismatch");
    assert(metadata.memory_candidate.memory_delta_candidate_ref === files.draft, "metadata draft ref mismatch");
    assert(metadata.memory_candidate.status === "codex_knowledge_memory_written", "metadata memory status mismatch");
    assert(metadata.memory_candidate.write_performed === true, "metadata must record later Codex knowledge memory write");
    assert(metadata.memory_candidate.memory_write_receipt_ref === expected.memoryWriteReceiptRef, "metadata memory receipt ref mismatch");
    assert(metadata.memory_candidate.codex_knowledge_memory_id === expected.codexKnowledgeMemoryId, "metadata Codex memory id mismatch");
    assert(metadata.memory_candidate.DailyNote_write_performed === false, "metadata DailyNote write must be false");
    assert(metadata.memory_candidate.VCP_memory_write_performed === false, "metadata VCP memory write must be false");
    assert(metadata.memory_effects.codex_knowledge_memory_written === true, "metadata memory effects must record Codex write");
    assert(metadata.memory_effects.codex_knowledge_memory_receipt_ref === expected.memoryWriteReceiptRef, "metadata memory effects receipt mismatch");
    assert(metadata.memory_effects.additional_memory_write_performed_after_codex_receipt === false, "metadata must not record extra memory write after receipt");
    assert(manifest.memory_candidate.mapping_gate_ref === files.gate, "manifest mapping gate ref mismatch");
    assert(manifest.memory_candidate.memory_delta_candidate_ref === files.draft, "manifest draft ref mismatch");
    assert(manifest.memory_candidate.status === "codex_knowledge_memory_written", "manifest memory status mismatch");
    assert(manifest.memory_candidate.write_performed === true, "manifest must record later Codex knowledge memory write");
    assert(manifest.memory_candidate.memory_write_receipt_ref === expected.memoryWriteReceiptRef, "manifest memory receipt ref mismatch");
    assert(manifest.memory_candidate.codex_knowledge_memory_id === expected.codexKnowledgeMemoryId, "manifest Codex memory id mismatch");
    assert(manifest.memory_candidate.DailyNote_write_performed === false, "manifest DailyNote write must be false");
    assert(manifest.memory_candidate.VCP_memory_write_performed === false, "manifest VCP memory write must be false");
    assert(sourceEvidence.evidence_refs.memory_candidate_mapping_gate_ref === files.gate, "source evidence gate ref mismatch");
    assert(sourceEvidence.evidence_refs.memory_delta_candidate_ref === files.draft, "source evidence draft ref mismatch");
    assert(sourceEvidence.evidence_refs.memory_write_receipt_ref === expected.memoryWriteReceiptRef, "source evidence memory receipt ref mismatch");
    assert(sourceEvidence.side_effects.memory_candidate_no_write_mapping_created === true, "source evidence mapping side effect mismatch");
    assert(sourceEvidence.side_effects.Codex_knowledge_memory_write_performed === true, "source evidence must record later Codex knowledge memory write");
    assert(sourceEvidence.side_effects.Codex_knowledge_memory_id === expected.codexKnowledgeMemoryId, "source evidence Codex memory id mismatch");
    assert(sourceEvidence.memory_effects.record_memory_attempts === 1, "source evidence record_memory attempts mismatch");
    assert(sourceEvidence.memory_effects.successful_record_memory_writes === 1, "source evidence successful record_memory writes mismatch");
    assert(sourceEvidence.memory_effects.vcptoolbox_dailynote_write_called === false, "source evidence VCPToolBox DailyNote call must be false");
    assert(sourceEvidence.memory_effects.project_memory_write_allowed === false, "source evidence project memory write must be false");
  });

  check("source_artifact_and_archive_evidence_match", () => {
    assert(artifactRecord.status === "accepted_candidate", "artifact must remain accepted_candidate");
    assert(artifactRecord.output_files[0].sha256 === expected.sha256, "artifact sha mismatch");
    assert(durableArchiveReport.status === "completed_validated", "durable archive report status mismatch");
    assert(durableArchiveReport.results[0].target_archive_path === expected.durableArchiveRef, "durable archive target mismatch");
    assert(durableArchiveReport.results[0].target_sha256 === expected.sha256, "durable archive sha mismatch");
    assert(durableArchiveReport.DailyNote_write_performed === false, "durable archive DailyNote write must be false");
    assert(durableArchiveReport.VCP_memory_write_performed === false, "durable archive VCP memory write must be false");
  });

  const result = {
    passed: true,
    validator: "runtime_to_review_v2_trial_001_memory_candidate_no_write_mapping_gate",
    gate_ref: files.gate,
    memory_delta_candidate_ref: files.draft,
    sample_id: expected.sampleId,
    candidate_id: expected.candidateId,
    artifact_sha256: expected.sha256,
    memory_candidate_mapping_created: true,
    memory_write_can_execute_now: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    Codex_memory_write_performed_by_mapping_gate: false,
    Codex_memory_write_performed_after_separate_binding_ready_packet: true,
    codex_knowledge_memory_id: expected.codexKnowledgeMemoryId,
    memory_write_receipt_ref: expected.memoryWriteReceiptRef,
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
