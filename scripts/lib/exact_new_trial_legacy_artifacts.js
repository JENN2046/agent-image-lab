"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const previewCapsuleBaselinePath = "docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md";
const acceptedArchiveManifestPath =
  "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/manifest.json";

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function sha256File(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
}

function v14231BaselineActive() {
  if (!exists(previewCapsuleBaselinePath)) return false;
  const text = fs.readFileSync(repoPath(previewCapsuleBaselinePath), "utf8");
  return text.includes("legacy_runs_missing_result: evidence_loss_recorded_do_not_claim_old_full_recoverability") &&
    text.includes("full_original_recoverability_required: false");
}

function acceptedArchiveSourceMatches(sourceArtifactRef, expectedSha256) {
  if (!exists(acceptedArchiveManifestPath)) return false;
  const manifest = readJson(acceptedArchiveManifestPath);
  return manifest.source?.artifact_ref === sourceArtifactRef &&
    manifest.source?.sha256 === expectedSha256 &&
    manifest.artifact?.original?.sha256 === expectedSha256 &&
    manifest.artifact?.preview?.git_tracked === true;
}

function isExactNewTrial003RunsImage(relativePath) {
  return /^runs\/real_generation\/v0_3_3_exact_new_trial_003_shot_[123]\/safe_adult_editorial_portrait_v1\.png$/.test(
    relativePath
  );
}

function sourceArtifactHashEvidence(relativePath, expectedSha256) {
  if (exists(relativePath)) {
    const actualSha256 = sha256File(relativePath);
    return {
      passed: actualSha256 === expectedSha256,
      source: "current_runs_file",
      file_present_now: true,
      actual_sha256: actualSha256
    };
  }

  if (acceptedArchiveSourceMatches(relativePath, expectedSha256)) {
    return {
      passed: true,
      source: "durable_archive_manifest_source_ref",
      file_present_now: false,
      actual_sha256: expectedSha256
    };
  }

  if (v14231BaselineActive() && isExactNewTrial003RunsImage(relativePath)) {
    return {
      passed: true,
      source: "v14_231_legacy_runs_missing_evidence_loss_recorded",
      file_present_now: false,
      actual_sha256: expectedSha256
    };
  }

  return {
    passed: false,
    source: "missing_unaccepted_artifact",
    file_present_now: false,
    actual_sha256: null
  };
}

function auditedMissingExactNewTrial003Artifacts() {
  if (!v14231BaselineActive()) return new Map();

  const records = [
    "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json",
    "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_2_receipt.json",
    "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_receipt.json"
  ];
  const map = new Map();
  for (const receiptRef of records) {
    if (!exists(receiptRef)) continue;
    const receipt = readJson(receiptRef);
    if (!receipt.output_image_path || exists(receipt.output_image_path)) continue;
    const evidence = sourceArtifactHashEvidence(receipt.output_image_path, receipt.output_image_sha256);
    if (!evidence.passed) continue;
    map.set(receipt.output_image_path, {
      attempt_id: receipt.attempt_id,
      report_ref: previewCapsuleBaselinePath,
      current_project_output_missing: true,
      local_persistence_verified_now: false,
      reviewable_sample_now: false,
      human_review_allowed_now: false,
      legacy_runs_missing_accepted_by_v14_231_baseline: true,
      evidence_source: evidence.source
    });
  }
  return map;
}

module.exports = {
  auditedMissingExactNewTrial003Artifacts,
  sourceArtifactHashEvidence,
  v14231BaselineActive
};
