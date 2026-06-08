#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_001_durable_archive_gate";
const sampleId = "accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001";
const expectedSha256 = "60af66aa0f26fc8e26eabd0719408d92b4efdc21b2f26737ae3e6fce1c1f9f82";
const sourceRef = "runs/real_generation/runtime_to_review_v2_trial_001_serum_detail_control/7bb59380-abb4-4180-9fa6-6a71549aec41.jpg";
const archiveRef = `asset_archive/original_assets/by_sha256/${expectedSha256}.jpg`;
const authorizationRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_durable_archive_authorization_20260608.json";
const reportRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_durable_archive_execution_report_20260608.json";
const metadataRef = `accepted_samples/${sampleId}/metadata.json`;
const manifestRef = `accepted_samples/${sampleId}/manifest.json`;
const sourceEvidenceRef = `accepted_samples/${sampleId}/source_evidence.json`;

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

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
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

async function imageEvidence(relativePath) {
  const stat = fs.statSync(repoPath(relativePath));
  const metadata = await sharp(repoPath(relativePath), { failOn: "none" }).metadata();
  return {
    sha256: sha256(relativePath),
    width: metadata.width,
    height: metadata.height,
    mime: metadata.format === "jpeg" ? "image/jpeg" : metadata.format,
    bytes: stat.size,
  };
}

async function main() {
  const authorization = readJson(authorizationRef);
  const report = readJson(reportRef);
  const metadata = readJson(metadataRef);
  const manifest = readJson(manifestRef);
  const sourceEvidence = readJson(sourceEvidenceRef);
  const registry = readText("accepted_samples/accepted_sample_registry.yaml");
  const category = readText("accepted_samples/categories/product_still_life.yaml");
  const source = await imageEvidence(sourceRef);
  const archived = await imageEvidence(archiveRef);
  const pair = authorization.exact_copy_pairs[0];
  const result = report.results[0];

  check("authorization_is_exact_single_pair", () =>
    authorization.authorization_state === "active_user_requested_single_gate" &&
    authorization.max_file_count === 1 &&
    authorization.exact_copy_pair_count === 1 &&
    pair.source_runs_path === sourceRef &&
    pair.target_archive_path === archiveRef &&
    pair.expected_sha256 === expectedSha256 &&
    pair.overwrite_existing_allowed === false &&
    pair.move_allowed === false &&
    pair.delete_allowed === false
  );
  check("source_and_archive_hash_match", () =>
    source.sha256 === expectedSha256 &&
    archived.sha256 === expectedSha256 &&
    source.bytes === 128380 &&
    archived.bytes === 128380
  );
  check("archive_dimensions_and_mime_match", () =>
    archived.width === 1920 &&
    archived.height === 1920 &&
    archived.mime === "image/jpeg"
  );
  check("execution_report_completed_validated", () =>
    report.status === "completed_validated" &&
    report.authorization_package_ref === authorizationRef &&
    report.exact_copy_pair_count === 1 &&
    report.copied_count === 1 &&
    report.post_copy_verified_count === 1 &&
    report.failed_count === 0 &&
    Array.isArray(report.failures) &&
    report.failures.length === 0
  );
  check("execution_report_side_effects_bounded", () =>
    report.durable_archive_copy_performed === true &&
    report.runs_mutation_performed === false &&
    report.source_move_performed === false &&
    report.source_delete_performed === false &&
    report.overwrite_performed === false &&
    report.preview_generation_performed === false &&
    report.provider_contact_performed === false &&
    report.plugin_call_performed === false &&
    report.api_call_performed === false &&
    report.DailyNote_write_performed === false &&
    report.VCP_memory_write_performed === false &&
    report.production_candidate_write_performed === false &&
    report.push_tag_release_deploy_performed === false
  );
  check("execution_result_matches_authorization", () =>
    result.source_runs_path === pair.source_runs_path &&
    result.target_archive_path === pair.target_archive_path &&
    result.source_sha256 === pair.expected_sha256 &&
    result.target_sha256 === pair.expected_sha256 &&
    result.copy_performed === true &&
    result.move_performed === false &&
    result.delete_performed === false &&
    result.overwrite_performed === false &&
    result.post_copy_verified === true
  );
  check("accepted_sample_metadata_points_to_durable_archive", () =>
    metadata.sample_id === sampleId &&
    metadata.artifact.durable_archive_ref === archiveRef &&
    metadata.artifact.durable_archive_sha256 === expectedSha256 &&
    metadata.artifact.durable_archive_ready === true &&
    metadata.durable_archive.execution_report_ref === reportRef &&
    metadata.durable_archive.copy_performed === true &&
    metadata.durable_archive.source_move_or_delete_performed === false &&
    metadata.durable_archive.overwrite_performed === false
  );
  check("manifest_points_to_verified_durable_original", () =>
    manifest.artifact.durable_original.path === archiveRef &&
    manifest.artifact.durable_original.sha256 === expectedSha256 &&
    manifest.artifact.durable_original.bytes === 128380 &&
    manifest.artifact.durable_original.copy_performed === true &&
    manifest.durable_archive.ready === true &&
    manifest.guard.Codex_knowledge_memory_write_performed === false &&
    manifest.guard.DailyNote_project_writer_performed === false
  );
  check("source_evidence_records_archive_without_memory", () =>
    sourceEvidence.recoverability.durable_archive_ref === archiveRef &&
    sourceEvidence.recoverability.durable_archive_ready === true &&
    sourceEvidence.recoverability.needs_external_artifact_restore === false &&
    sourceEvidence.side_effects.durable_archive_copy_performed_by_separate_gate === true &&
    sourceEvidence.side_effects.Codex_knowledge_memory_write_performed === false &&
    sourceEvidence.side_effects.project_DailyNote_writer_performed === false &&
    sourceEvidence.side_effects.production_candidate_write_performed === false
  );
  check("registry_and_category_record_archive_ref", () =>
    registry.includes(`durable_archive_ref: ${archiveRef}`) &&
    registry.includes(`durable_archive_execution_report_ref: ${reportRef}`) &&
    registry.includes("durable_archive_ready: true") &&
    category.includes(`durable_archive_ref: ${archiveRef}`) &&
    category.includes(`durable_archive_execution_report_ref: ${reportRef}`)
  );

  const output = {
    passed,
    validator,
    sample_id: sampleId,
    authorization_ref: authorizationRef,
    execution_report_ref: reportRef,
    source_ref: sourceRef,
    archive_ref: archiveRef,
    source_sha256: source.sha256,
    archive_sha256: archived.sha256,
    durable_archive_copy_performed: true,
    image_generation_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    production_candidate_write_performed: false,
    push_tag_release_deploy_performed: false,
    check_count: results.length,
    failed_count: results.filter((item) => !item.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main().catch((error) => {
  process.stdout.write(`${JSON.stringify({ passed: false, validator, error: error.message }, null, 2)}\n`);
  process.exitCode = 1;
});
