#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_001_accepted_samples_promotion";
const sampleId = "accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001";
const imagePath = "runs/real_generation/runtime_to_review_v2_trial_001_serum_detail_control/7bb59380-abb4-4180-9fa6-6a71549aec41.jpg";
const expectedSha256 = "60af66aa0f26fc8e26eabd0719408d92b4efdc21b2f26737ae3e6fce1c1f9f82";
const expectedDimensions = "1920x1920";
const expectedMime = "image/jpeg";
const registryPath = "accepted_samples/accepted_sample_registry.yaml";
const categoryPath = "accepted_samples/categories/product_still_life.yaml";
const metadataPath = `accepted_samples/${sampleId}/metadata.json`;
const manifestPath = `accepted_samples/${sampleId}/manifest.json`;
const sourceEvidencePath = `accepted_samples/${sampleId}/source_evidence.json`;
const gatePath = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_accepted_samples_promotion_gate_20260608.json";
const memoryWriteReceiptPath = "reports/memory_write_receipts/r2r_v2_trial_001_codex_knowledge_memory_write_receipt_20260608.json";
const expectedCodexKnowledgeMemoryId = "codex-knowledge-3a86b6bc791e427f9eeec8d53d9f3c79";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function sha256(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

async function main() {
  const registry = readText(registryPath);
  const category = readText(categoryPath);
  const metadata = readJson(metadataPath);
  const manifest = readJson(manifestPath);
  const sourceEvidence = readJson(sourceEvidencePath);
  const gate = readJson(gatePath);
  const artifact = readJson("reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_artifact_record.json");
  const reviewDecision = readJson("reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_review_decision_accepted_candidate_20260608.json");
  const imageMeta = await sharp(repoPath(imagePath)).metadata();
  const imageHash = sha256(imagePath);

  check("source_candidate_is_accepted", () =>
    artifact.status === "accepted_candidate" &&
    reviewDecision.decision === "accepted_candidate"
  );
  check("image_file_matches_expected_evidence", () =>
    imageHash === expectedSha256 &&
    `${imageMeta.width}x${imageMeta.height}` === expectedDimensions &&
    imageMeta.format === "jpeg"
  );
  check("registry_contains_sample_once", () =>
    (registry.match(new RegExp(`sample_id: ${sampleId}`, "g")) || []).length === 1
  );
  check("registry_entry_metadata_matches_image", () =>
    registry.includes(`image_path: ${imagePath}`) &&
    registry.includes(`image_sha256: ${expectedSha256}`) &&
    registry.includes(`verified_sha256: ${expectedSha256}`) &&
    registry.includes(`verified_dimensions: ${expectedDimensions}`) &&
    registry.includes(`verified_mime: ${expectedMime}`) &&
    registry.includes("memory_suitability: true") &&
    registry.includes(`memory_write_receipt_ref: ${memoryWriteReceiptPath}`) &&
    registry.includes("write_to_memory_allowed: false") &&
    registry.includes("daily_note_write_allowed: false") &&
    registry.includes("codex_knowledge_memory_written: true") &&
    registry.includes(`codex_knowledge_memory_id: ${expectedCodexKnowledgeMemoryId}`) &&
    registry.includes("project_dailynote_writer_performed: false") &&
    registry.includes("additional_memory_write_performed_after_codex_receipt: false")
  );
  check("category_index_contains_sample_and_count", () =>
    category.includes("sample_count: 6") &&
    category.includes(`  - ${sampleId}`) &&
    category.includes(`${sampleId}:`) &&
    category.includes(`verified_sha256: ${expectedSha256}`)
  );
  check("metadata_matches_registry_and_records_separate_codex_memory_receipt", () =>
    metadata.sample_id === sampleId &&
    metadata.status === "accepted_candidate" &&
    metadata.artifact.source_image_ref === imagePath &&
    metadata.artifact.source_image_sha256 === expectedSha256 &&
    metadata.artifact.source_image_dimensions === expectedDimensions &&
    metadata.artifact.source_image_mime === expectedMime &&
    metadata.artifact.source_image_copied_or_moved === false &&
    metadata.artifact.image_files_committed_to_git === false &&
    metadata.acceptance_summary.memory_suitability === true &&
    metadata.refs.memory_write_receipt_ref === memoryWriteReceiptPath &&
    metadata.memory_candidate.status === "codex_knowledge_memory_written" &&
    metadata.memory_candidate.write_performed === true &&
    metadata.memory_candidate.memory_write_receipt_ref === memoryWriteReceiptPath &&
    metadata.memory_candidate.codex_knowledge_memory_id === expectedCodexKnowledgeMemoryId &&
    metadata.memory_candidate.DailyNote_write_performed === false &&
    metadata.memory_candidate.VCP_memory_write_performed === false &&
    metadata.memory_effects.codex_knowledge_memory_written === true &&
    metadata.memory_effects.codex_knowledge_memory_id === expectedCodexKnowledgeMemoryId &&
    metadata.memory_effects.codex_knowledge_memory_receipt_ref === memoryWriteReceiptPath &&
    metadata.memory_effects.project_DailyNote_writer_performed === false &&
    metadata.memory_effects.vcp_long_term_memory_write_allowed === false &&
    metadata.memory_effects.additional_memory_write_performed_after_codex_receipt === false
  );
  check("manifest_is_metadata_only_no_binary_copy", () =>
    manifest.sample_id === sampleId &&
    manifest.artifact.original.path === imagePath &&
    manifest.artifact.original.sha256 === expectedSha256 &&
    manifest.artifact.original.bytes === 128380 &&
    manifest.artifact.original.copied_or_moved_by_this_apply === false &&
    manifest.artifact.preview.created === false &&
    manifest.guard.image_copy_or_move_performed_by_this_apply === false &&
    manifest.guard.accepted_samples_registry_write_performed === true &&
    manifest.guard.Codex_knowledge_memory_write_performed === false &&
    manifest.guard.DailyNote_project_writer_performed === false
  );
  check("source_evidence_records_promotion_authorization_and_separate_codex_memory_receipt", () =>
    sourceEvidence.sample_id === sampleId &&
    sourceEvidence.owner_authorization.selected_promotion_target === "accepted_samples" &&
    sourceEvidence.owner_authorization.codex_knowledge_memory_write_allowed === false &&
    sourceEvidence.owner_authorization.archive_binary_copy_allowed === false &&
    sourceEvidence.evidence_refs.memory_write_receipt_ref === memoryWriteReceiptPath &&
    sourceEvidence.verified_source_image.sha256 === expectedSha256 &&
    sourceEvidence.side_effects.accepted_samples_registry_write_performed === true &&
    sourceEvidence.side_effects.image_generation_performed_by_this_apply === false &&
    sourceEvidence.side_effects.Codex_knowledge_memory_write_performed === true &&
    sourceEvidence.side_effects.Codex_knowledge_memory_id === expectedCodexKnowledgeMemoryId &&
    sourceEvidence.side_effects.project_DailyNote_writer_performed === false &&
    sourceEvidence.memory_effects.codex_knowledge_memory_written === true &&
    sourceEvidence.memory_effects.codex_knowledge_memory_receipt_ref === memoryWriteReceiptPath &&
    sourceEvidence.memory_effects.record_memory_attempts === 1 &&
    sourceEvidence.memory_effects.successful_record_memory_writes === 1 &&
    sourceEvidence.memory_effects.vcptoolbox_dailynote_write_called === false &&
    sourceEvidence.memory_effects.project_memory_write_allowed === false
  );
  check("promotion_gate_selects_only_accepted_samples", () =>
    gate.selected_promotion_target === "accepted_samples" &&
    gate.promotion_status === "completed_metadata_only_accepted_samples_registration" &&
    gate.accepted_sample.sample_id === sampleId &&
    gate.side_effect_flags.accepted_samples_write_performed === true &&
    gate.side_effect_flags.archive_write_performed === false &&
    gate.side_effect_flags.VCP_memory_write_performed === false &&
    gate.side_effect_flags.image_generation_performed === false
  );

  const output = {
    passed,
    validator,
    sample_id: sampleId,
    registry_ref: registryPath,
    category_ref: categoryPath,
    metadata_ref: metadataPath,
    manifest_ref: manifestPath,
    source_evidence_ref: sourceEvidencePath,
    gate_ref: gatePath,
    image_sha256_verified: imageHash,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_copy_or_move_performed: false,
    accepted_samples_write_performed: true,
    archive_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    Codex_memory_write_performed_after_separate_binding_ready_packet: true,
    codex_knowledge_memory_id: expectedCodexKnowledgeMemoryId,
    memory_write_receipt_ref: memoryWriteReceiptPath,
    push_tag_release_deploy_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main().catch((error) => {
  process.stdout.write(`${JSON.stringify({
    passed: false,
    validator,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
