#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifestRef = "reports/full_asset_archive_dry_run_manifest/2026-05-20_full_asset_archive_dry_run_manifest.json";
const sourceReportRef = "reports/runs_asset_verification/2026-05-20_hash_dimensions_report.json";
const sha256Pattern = /^[a-f0-9]{64}$/;
const imageExtPattern = /\.(png|jpe?g|webp)$/i;
const archiveTargetRoot = "asset_archive/original_assets/by_sha256/";
const disallowedPayloadKeyPattern = /(base64|binary|buffer|bytes|data_uri|image_data)/i;

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

function collectKeys(value, keys = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, keys);
    return keys;
  }
  if (!value || typeof value !== "object") return keys;

  for (const key of Object.keys(value)) {
    keys.push(key);
    collectKeys(value[key], keys);
  }
  return keys;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateManifest(manifest, sourceReport) {
  const failures = [];
  const sourceByPath = new Map((sourceReport.results || []).map((item) => [item.project_relative_path, item]));

  function requireCheck(name, passed, detail) {
    if (!passed) failures.push({ check: name, detail: detail || "check failed" });
  }

  requireCheck("report_version_v1", manifest.report_version === 1);
  requireCheck("manifest_type", manifest.manifest_type === "full_asset_archive_dry_run_manifest");
  requireCheck("phase", manifest.phase === "full_asset_archive_dry_run_manifest");
  requireCheck("source_asset_verification_report", manifest.source_asset_verification_report === sourceReportRef);
  requireCheck("dry_run_only", manifest.dry_run_only === true);
  requireCheck("target_archive_root", manifest.target_archive_root === archiveTargetRoot);
  requireCheck("max_file_count", manifest.max_file_count === sourceReport.verified_file_count);
  requireCheck("asset_count", manifest.asset_count === (manifest.entries || []).length);
  requireCheck("asset_count_matches_source", manifest.asset_count === sourceReport.verified_file_count);

  requireCheck("source_report_image_binary_read_performed", manifest.source_report_image_binary_read_performed === true);
  requireCheck("source_report_hash_extraction_performed", manifest.source_report_hash_extraction_performed === true);
  requireCheck("source_report_dimensions_extraction_performed", manifest.source_report_dimensions_extraction_performed === true);
  requireCheck("dry_run_image_binary_read_performed_false", manifest.dry_run_image_binary_read_performed === false);
  requireCheck("dry_run_hash_extraction_performed_false", manifest.dry_run_hash_extraction_performed === false);
  requireCheck("dry_run_dimensions_extraction_performed_false", manifest.dry_run_dimensions_extraction_performed === false);

  const guardFalseFields = [
    "runs_mutation_performed",
    "image_binary_read_performed",
    "hash_extraction_performed",
    "dimensions_extraction_performed",
    "preview_generation_performed",
    "archive_target_created",
    "archive_copy_performed",
    "source_image_copy_performed",
    "copy_move_delete_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "production_candidate_allowed",
    "production_candidate_write_performed",
  ];
  requireCheck("guard_dry_run_only_true", manifest.guard?.dry_run_only === true);
  for (const field of guardFalseFields) {
    requireCheck(`guard_${field}_false`, manifest.guard?.[field] === false);
  }

  const seenSourcePaths = new Set();
  for (const entry of manifest.entries || []) {
    const source = sourceByPath.get(entry.source_runs_path);
    const extension = path.extname(entry.source_runs_path || "").toLowerCase();
    const expectedTarget = `${archiveTargetRoot}${entry.source_sha256}${extension}`;

    requireCheck(`entry_source_safe_${entry.source_runs_path}`, isSafeProjectRelativePath(entry.source_runs_path) && entry.source_runs_path.startsWith("runs/") && imageExtPattern.test(entry.source_runs_path));
    requireCheck(`entry_source_exists_in_report_${entry.source_runs_path}`, Boolean(source));
    requireCheck(`entry_sha256_valid_${entry.source_runs_path}`, sha256Pattern.test(entry.source_sha256 || ""));
    requireCheck(`entry_sha256_matches_source_${entry.source_runs_path}`, source?.sha256 === entry.source_sha256);
    requireCheck(`entry_width_matches_source_${entry.source_runs_path}`, Number.isInteger(entry.source_dimensions?.width) && entry.source_dimensions.width === source?.width);
    requireCheck(`entry_height_matches_source_${entry.source_runs_path}`, Number.isInteger(entry.source_dimensions?.height) && entry.source_dimensions.height === source?.height);
    requireCheck(`entry_mime_matches_source_${entry.source_runs_path}`, typeof entry.source_mime_type === "string" && entry.source_mime_type === source?.mime_type);
    requireCheck(`entry_target_safe_${entry.source_runs_path}`, isSafeProjectRelativePath(entry.proposed_archive_target_ref) && entry.proposed_archive_target_ref === expectedTarget);
    requireCheck(`entry_status_not_created_${entry.source_runs_path}`, entry.archive_target_status === "proposed_not_created");
    requireCheck(`entry_overwrite_false_${entry.source_runs_path}`, entry.overwrite_existing_allowed === false);
    requireCheck(`entry_copy_false_${entry.source_runs_path}`, entry.copy_performed === false);
    requireCheck(`entry_move_false_${entry.source_runs_path}`, entry.move_performed === false);
    requireCheck(`entry_delete_false_${entry.source_runs_path}`, entry.delete_performed === false);
    requireCheck(`entry_production_false_${entry.source_runs_path}`, entry.production_candidate_allowed === false);

    if (entry.source_runs_path) seenSourcePaths.add(entry.source_runs_path);
  }
  requireCheck("all_source_report_results_mapped", (sourceReport.results || []).every((item) => seenSourcePaths.has(item.project_relative_path)));

  const disallowedPayloadKeys = collectKeys(manifest)
    .filter((key) => disallowedPayloadKeyPattern.test(key))
    .filter((key) => ![
      "source_report_image_binary_read_performed",
      "dry_run_image_binary_read_performed",
      "image_binary_read_performed",
      "source_size_bytes",
    ].includes(key));
  requireCheck("no_embedded_image_payload_keys", disallowedPayloadKeys.length === 0, disallowedPayloadKeys.join(", "));

  return failures;
}

const manifest = readJson(process.argv[2] || manifestRef);
const sourceReport = readJson(sourceReportRef);
const checks = [];

function check(name, passed, details) {
  checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
}

const positiveFailures = validateManifest(manifest, sourceReport);
check("positive_manifest_valid", positiveFailures.length === 0, positiveFailures);

const missingHash = clone(manifest);
delete missingHash.entries[0].source_sha256;
check("negative_case_missing_hash_fails", validateManifest(missingHash, sourceReport).length > 0);

const missingDimensions = clone(manifest);
delete missingDimensions.entries[0].source_dimensions;
check("negative_case_missing_dimensions_fails", validateManifest(missingDimensions, sourceReport).length > 0);

const pathEscape = clone(manifest);
pathEscape.entries[0].proposed_archive_target_ref = "asset_archive/original_assets/by_sha256/../escape.jpg";
check("negative_case_path_escape_fails", validateManifest(pathEscape, sourceReport).length > 0);

const mimeDrift = clone(manifest);
mimeDrift.entries[0].source_mime_type = "image/png";
check("negative_case_mime_mismatch_fails", validateManifest(mimeDrift, sourceReport).length > 0);

const copyPerformed = clone(manifest);
copyPerformed.entries[0].copy_performed = true;
check("negative_case_copy_performed_fails", validateManifest(copyPerformed, sourceReport).length > 0);

const productionAllowed = clone(manifest);
productionAllowed.guard.production_candidate_allowed = true;
check("negative_case_production_allowed_fails", validateManifest(productionAllowed, sourceReport).length > 0);

const failures = checks.filter((item) => !item.passed);
const result = {
  validator: "validate_full_asset_archive_dry_run_manifest",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0 ? "full_asset_archive_dry_run_manifest_verified" : "full_asset_archive_dry_run_manifest_failed",
  manifest_ref: process.argv[2] || manifestRef,
  source_report_ref: sourceReportRef,
  asset_count: manifest.asset_count,
  dry_run_only: manifest.dry_run_only,
  source_report_image_binary_read_performed: manifest.source_report_image_binary_read_performed,
  dry_run_image_binary_read_performed: manifest.dry_run_image_binary_read_performed,
  dry_run_hash_extraction_performed: manifest.dry_run_hash_extraction_performed,
  dry_run_dimensions_extraction_performed: manifest.dry_run_dimensions_extraction_performed,
  archive_copy_performed: manifest.guard?.archive_copy_performed,
  runs_mutation_performed: manifest.guard?.runs_mutation_performed,
  preview_generation_performed: manifest.guard?.preview_generation_performed,
  provider_contact_performed: manifest.guard?.provider_contact_performed,
  plugin_call_performed: manifest.guard?.plugin_call_performed,
  api_call_performed: manifest.guard?.api_call_performed,
  DailyNote_write_performed: manifest.guard?.DailyNote_write_performed,
  VCP_memory_write_performed: manifest.guard?.VCP_memory_write_performed,
  production_candidate_write_performed: manifest.guard?.production_candidate_write_performed,
  negative_case_missing_hash_fails: checks.find((item) => item.check === "negative_case_missing_hash_fails")?.passed === true,
  negative_case_missing_dimensions_fails: checks.find((item) => item.check === "negative_case_missing_dimensions_fails")?.passed === true,
  negative_case_path_escape_fails: checks.find((item) => item.check === "negative_case_path_escape_fails")?.passed === true,
  negative_case_mime_mismatch_fails: checks.find((item) => item.check === "negative_case_mime_mismatch_fails")?.passed === true,
  check_count: checks.length,
  failed_count: failures.length,
  failures,
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
