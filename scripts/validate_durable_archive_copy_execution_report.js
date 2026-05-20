#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const executionReportRef = "reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json";
const authorizationRef = "reports/durable_archive_copy_authorization/2026-05-20_durable_archive_copy_A5_authorization_package.json";
const targetRoot = "asset_archive/original_assets/by_sha256/";
const sha256Pattern = /^[a-f0-9]{64}$/;
const mimeByFormat = { jpeg: "image/jpeg", jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

function readJson(ref) {
  return JSON.parse(fs.readFileSync(path.join(root, ref), "utf8"));
}

function isSafeProjectRelativePath(value) {
  return typeof value === "string"
    && value.length > 0
    && !path.isAbsolute(value)
    && !/^[A-Za-z]:[\\/]/.test(value)
    && !value.includes("\\")
    && !value.includes("..")
    && !value.includes("*")
    && !value.includes("?");
}

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function readImageEvidence(projectRelativePath) {
  const absolutePath = path.join(root, projectRelativePath);
  const buffer = fs.readFileSync(absolutePath);
  const metadata = await sharp(buffer, { failOn: "none" }).metadata();
  const stat = fs.statSync(absolutePath);
  return {
    sha256: hashBuffer(buffer),
    width: metadata.width,
    height: metadata.height,
    mime_type: mimeByFormat[metadata.format] || null,
    size_bytes: stat.size,
  };
}

(async () => {
  const reportRef = process.argv[2] || executionReportRef;
  const report = readJson(reportRef);
  const authorization = readJson(authorizationRef);
  const authorizationByTarget = new Map((authorization.exact_copy_pairs || []).map((pair) => [pair.target_archive_path, pair]));
  const checks = [];

  function check(name, passed, details) {
    checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
  }

  check("report_version_v1", report.report_version === 1);
  check("phase", report.phase === "durable_archive_copy_A5_execution");
  check("status_completed_validated", report.status === "completed_validated");
  check("authorization_ref", report.authorization_package_ref === authorizationRef);
  check("pair_count", report.exact_copy_pair_count === authorization.exact_copy_pair_count);
  check("copied_count", report.copied_count === authorization.exact_copy_pair_count);
  check("post_copy_verified_count", report.post_copy_verified_count === authorization.exact_copy_pair_count);
  check("failed_count_zero", report.failed_count === 0 && Array.isArray(report.failures) && report.failures.length === 0);

  for (const field of [
    "durable_archive_copy_performed",
    "target_archive_directory_created",
    "target_archive_artifact_created",
    "source_image_binary_read_performed_for_copy_and_verify",
    "target_image_binary_read_performed_for_verify",
    "hash_extraction_performed_for_copy_verify",
    "dimensions_extraction_performed_for_copy_verify",
  ]) {
    check(`${field}_true`, report[field] === true);
  }

  for (const field of [
    "runs_mutation_performed",
    "source_move_performed",
    "source_delete_performed",
    "overwrite_performed",
    "preview_generation_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "production_candidate_write_performed",
  ]) {
    check(`${field}_false`, report[field] === false);
  }

  for (const result of report.results || []) {
    const authorized = authorizationByTarget.get(result.target_archive_path);
    check(`target_safe_${result.target_archive_path}`, isSafeProjectRelativePath(result.target_archive_path) && result.target_archive_path.startsWith(targetRoot));
    check(`source_safe_${result.source_runs_path}`, isSafeProjectRelativePath(result.source_runs_path) && result.source_runs_path.startsWith("runs/"));
    check(`authorized_target_${result.target_archive_path}`, Boolean(authorized));
    check(`target_exists_${result.target_archive_path}`, fs.existsSync(path.join(root, result.target_archive_path)));
    check(`expected_hash_valid_${result.target_archive_path}`, sha256Pattern.test(result.expected_sha256 || ""));
    check(`result_hashes_match_${result.target_archive_path}`, result.source_sha256 === result.expected_sha256 && result.target_sha256 === result.expected_sha256);
    check(`result_dimensions_match_${result.target_archive_path}`, result.target_dimensions?.width === result.expected_dimensions?.width && result.target_dimensions?.height === result.expected_dimensions?.height);
    check(`result_mime_matches_${result.target_archive_path}`, result.target_mime_type === result.expected_mime_type);
    check(`result_copy_true_${result.target_archive_path}`, result.copy_performed === true);
    check(`result_move_delete_overwrite_false_${result.target_archive_path}`, result.move_performed === false && result.delete_performed === false && result.overwrite_performed === false);
    check(`result_post_copy_verified_${result.target_archive_path}`, result.post_copy_verified === true);

    if (fs.existsSync(path.join(root, result.target_archive_path))) {
      const evidence = await readImageEvidence(result.target_archive_path);
      check(`actual_target_hash_${result.target_archive_path}`, evidence.sha256 === result.expected_sha256);
      check(`actual_target_dimensions_${result.target_archive_path}`, evidence.width === result.expected_dimensions?.width && evidence.height === result.expected_dimensions?.height);
      check(`actual_target_mime_${result.target_archive_path}`, evidence.mime_type === result.expected_mime_type);
      check(`actual_target_size_${result.target_archive_path}`, evidence.size_bytes === result.expected_size_bytes);
    }
  }

  check("all_authorized_pairs_reported", (authorization.exact_copy_pairs || []).every((pair) => (report.results || []).some((item) => item.target_archive_path === pair.target_archive_path)));

  const failures = checks.filter((item) => !item.passed);
  const output = {
    validator: "validate_durable_archive_copy_execution_report",
    version: "v1",
    passed: failures.length === 0,
    status: failures.length === 0 ? "durable_archive_copy_execution_report_verified" : "durable_archive_copy_execution_report_failed",
    execution_report_ref: reportRef,
    authorization_ref: authorizationRef,
    copied_count: report.copied_count,
    post_copy_verified_count: report.post_copy_verified_count,
    failed_count: report.failed_count,
    durable_archive_copy_performed: report.durable_archive_copy_performed,
    runs_mutation_performed: report.runs_mutation_performed,
    preview_generation_performed: report.preview_generation_performed,
    provider_contact_performed: report.provider_contact_performed,
    plugin_call_performed: report.plugin_call_performed,
    api_call_performed: report.api_call_performed,
    DailyNote_write_performed: report.DailyNote_write_performed,
    VCP_memory_write_performed: report.VCP_memory_write_performed,
    production_candidate_write_performed: report.production_candidate_write_performed,
    check_count: checks.length,
    failed_count_checks: failures.length,
    failures,
  };

  console.log(JSON.stringify(output, null, 2));
  process.exit(output.passed ? 0 : 1);
})().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
