#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sampleId = "neutral_red_apple_seedream5_retry_006";
const category = "product_still_life";
const pipelineId = "v0_6_73_real_vcp_agent_generation_retry_006";
const expectedSha256 = "b75492195a390ab5ba9bd18d909db67dbf389ac03ee4d8a6b35c7249c532d446";
const expectedDimensions = "1920x2048";
const expectedMime = "image/jpeg";
const expectedImageRef = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_006/image/doubaogen/67b7aa65-4d90-4af5-8447-7194c7f017d1.png";

const refs = {
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/product_still_life.yaml",
  manifest: "accepted_samples/neutral_red_apple_seedream5_retry_006/manifest.json",
  metadata: "accepted_samples/neutral_red_apple_seedream5_retry_006/metadata.json",
  sourceEvidence: "accepted_samples/neutral_red_apple_seedream5_retry_006/source_evidence.json",
  promotionApplyReceipt: "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_006_promotion_apply_receipt.json",
  categorySyncReceipt: "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_006_category_index_sync_receipt.json",
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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function assertIncludes(text, needle, label) {
  assert(text.includes(needle), `${label} missing expected text: ${needle}`);
}

function assertFalseSideEffects(record, label, allowedTrue = []) {
  const sideEffects = record.side_effects || record.guard || {};
  for (const [key, value] of Object.entries(sideEffects)) {
    if (allowedTrue.includes(key)) continue;
    if (key.endsWith("_performed") || key.endsWith("_printed") || key.endsWith("_read") || key.endsWith("_copied")) {
      assert(value === false, `${label}.${key} must be false`);
    }
  }
}

function assertNoSecretPatterns(value, label) {
  const text = JSON.stringify(value);
  assert(!/Basic\s+[A-Za-z0-9+/=._~-]+/i.test(text), `${label} must not include Basic auth material`);
  assert(!/Bearer\s+[A-Za-z0-9._~+/-]+/i.test(text), `${label} must not include bearer token`);
  assert(!/sk-[A-Za-z0-9_-]{8,}/.test(text), `${label} must not include sk-* token pattern`);
  assert(!/AKLT[A-Za-z0-9_-]{8,}/.test(text), `${label} must not include provider key pattern`);
}

function main() {
  for (const ref of Object.values(refs)) {
    assert(fs.existsSync(repoPath(ref)), `required file missing: ${ref}`);
  }

  const registry = readText(refs.registry);
  const categoryIndex = readText(refs.categoryIndex);
  const manifest = readJson(refs.manifest);
  const metadata = readJson(refs.metadata);
  const sourceEvidence = readJson(refs.sourceEvidence);
  const promotionApplyReceipt = readJson(refs.promotionApplyReceipt);
  const categorySyncReceipt = readJson(refs.categorySyncReceipt);

  assertIncludes(registry, `sample_id: ${sampleId}`, "registry");
  assertIncludes(registry, `category: ${category}`, "registry");
  assertIncludes(registry, `image_path: ${expectedImageRef}`, "registry");
  assertIncludes(registry, `image_sha256: ${expectedSha256}`, "registry");
  assertIncludes(registry, `verified_dimensions: ${expectedDimensions}`, "registry");
  assertIncludes(registry, `verified_mime: ${expectedMime}`, "registry");
  assertIncludes(registry, `capsule_manifest_ref: ${refs.manifest}`, "registry");
  assertIncludes(registry, "write_to_memory_allowed: false", "registry");
  assertIncludes(registry, "daily_note_write_allowed: false", "registry");

  assertIncludes(categoryIndex, "sample_count: 3", "category index");
  assertIncludes(categoryIndex, `  - ${sampleId}`, "category index");
  assertIncludes(categoryIndex, `${sampleId}:`, "category index");
  assertIncludes(categoryIndex, `verified_sha256: ${expectedSha256}`, "category index");
  assertIncludes(categoryIndex, `verified_dimensions: ${expectedDimensions}`, "category index");
  assertIncludes(categoryIndex, `verified_mime: ${expectedMime}`, "category index");
  assertIncludes(categoryIndex, `capsule_manifest_ref: ${refs.manifest}`, "category index");
  assertIncludes(categoryIndex, `source_evidence_ref: ${refs.sourceEvidence}`, "category index");

  assert(manifest.manifest_type === "metadata_only_accepted_sample_capsule_manifest", "manifest type mismatch");
  assert(manifest.sample_id === sampleId, "manifest sample id mismatch");
  assert(manifest.source.pipeline_id === pipelineId, "manifest pipeline id mismatch");
  assert(manifest.artifact.original.path === expectedImageRef, "manifest source image ref mismatch");
  assert(manifest.artifact.original.sha256 === expectedSha256, "manifest source sha mismatch");
  assert(manifest.artifact.original.width === 1920, "manifest width mismatch");
  assert(manifest.artifact.original.height === 2048, "manifest height mismatch");
  assert(manifest.artifact.original.format === "jpeg", "manifest format mismatch");
  assert(manifest.artifact.original.copied_or_moved_by_this_apply === false, "manifest must not copy or move source");
  assert(manifest.artifact.preview.created === false, "manifest preview must not be created");

  assert(metadata.sample_id === sampleId, "metadata sample id mismatch");
  assert(metadata.status === "accepted_review_baseline", "metadata status mismatch");
  assert(metadata.provider.model === "doubao-seedream-5-0-260128", "metadata model mismatch");
  assert(metadata.artifact.source_image_ref === expectedImageRef, "metadata source image ref mismatch");
  assert(metadata.artifact.source_image_sha256 === expectedSha256, "metadata sha mismatch");
  assert(metadata.artifact.source_image_dimensions === expectedDimensions, "metadata dimensions mismatch");
  assert(metadata.artifact.source_image_mime === expectedMime, "metadata mime mismatch");
  assert(metadata.artifact.source_image_copied_or_moved === false, "metadata must not copy or move source");
  assert(metadata.review.accepted_sample === true, "metadata accepted sample flag mismatch");
  assert(metadata.review.production_candidate === false, "metadata production candidate flag mismatch");

  assert(sourceEvidence.sample_id === sampleId, "source evidence sample id mismatch");
  assert(sourceEvidence.verified_source_image.path === expectedImageRef, "source evidence image ref mismatch");
  assert(sourceEvidence.verified_source_image.sha256 === expectedSha256, "source evidence sha mismatch");
  assert(sourceEvidence.verified_source_image.width === 1920, "source evidence width mismatch");
  assert(sourceEvidence.verified_source_image.height === 2048, "source evidence height mismatch");
  assert(sourceEvidence.verified_source_image.mime === expectedMime, "source evidence mime mismatch");

  assert(promotionApplyReceipt.sample_id === sampleId, "promotion receipt sample id mismatch");
  assert(promotionApplyReceipt.status === "APPLIED_METADATA_ONLY", "promotion receipt status mismatch");
  assert(promotionApplyReceipt.source_image.path === expectedImageRef, "promotion receipt source image ref mismatch");
  assert(promotionApplyReceipt.source_image.sha256 === expectedSha256, "promotion receipt sha mismatch");
  assert(promotionApplyReceipt.source_image.copied_or_moved === false, "promotion receipt must not copy or move source");
  assert(promotionApplyReceipt.scope_notes.metadata_only_capsule === true, "promotion receipt metadata-only scope mismatch");
  assert(promotionApplyReceipt.scope_notes.asset_archive_preview_capsule_created === false, "promotion receipt must not create asset archive capsule");

  assert(categorySyncReceipt.sample_id === sampleId, "category sync receipt sample id mismatch");
  assert(categorySyncReceipt.category === category, "category sync receipt category mismatch");
  assert(categorySyncReceipt.status === "APPLIED", "category sync receipt status mismatch");
  assert(categorySyncReceipt.index_update.sample_count_after === 3, "category sync receipt sample count mismatch");
  assert(categorySyncReceipt.index_update.source_image_read_or_copied === false, "category sync receipt must not read or copy image");
  assert(categorySyncReceipt.source_metadata_preserved.source_image_ref === expectedImageRef, "category sync preserved image ref mismatch");
  assert(categorySyncReceipt.source_metadata_preserved.source_image_sha256 === expectedSha256, "category sync preserved sha mismatch");

  assertFalseSideEffects(manifest, "manifest");
  assertFalseSideEffects(sourceEvidence, "sourceEvidence");
  assertFalseSideEffects(promotionApplyReceipt, "promotionApplyReceipt", ["accepted_samples_write_performed"]);
  assertFalseSideEffects(categorySyncReceipt, "categorySyncReceipt");

  assertNoSecretPatterns({ manifest, metadata, sourceEvidence, promotionApplyReceipt, categorySyncReceipt }, "metadata-only accepted sample records");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_metadata_only_accepted_sample_retry_006",
    sample_id: sampleId,
    category,
    pipeline_id: pipelineId,
    source_image_ref_preserved: true,
    source_image_sha256: expectedSha256,
    source_image_content_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_metadata_only_accepted_sample_retry_006",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
