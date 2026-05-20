#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const reportsDirRef = "reports/runs_asset_verification";
const sourceReportRef = "reports/runs_path_existence_verification/20260520T092525Z_runs_path_existence_scan_report.json";
const imageExtPattern = /\.(png|jpe?g|webp)$/i;
const sha256Pattern = /^[a-f0-9]{64}$/;
const disallowedPayloadKeyPattern = /(base64|binary|buffer|bytes|data_uri|image_data)/i;

function readJson(ref) {
  return JSON.parse(fs.readFileSync(path.join(root, ref), "utf8"));
}

function isSafeRunsImagePath(value) {
  return typeof value === "string"
    && value.startsWith("runs/")
    && value.length > "runs/".length
    && !value.includes("\\")
    && !value.includes("..")
    && !value.includes("*")
    && !value.includes("?")
    && !path.isAbsolute(value)
    && !/^[A-Za-z]:[\\/]/.test(value)
    && imageExtPattern.test(value);
}

function latestReportRef() {
  const dir = path.join(root, reportsDirRef);
  const files = fs.readdirSync(dir)
    .filter((name) => name.endsWith("_hash_dimensions_report.json"))
    .sort((a, b) => b.localeCompare(a));

  if (files.length === 0) {
    throw new Error("No runs asset verification report found");
  }

  return `${reportsDirRef}/${files[0]}`;
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

function extensionMatchesFormat(extension, format) {
  if (extension === ".jpg" || extension === ".jpeg") return format === "jpeg";
  if (extension === ".png") return format === "png";
  if (extension === ".webp") return format === "webp";
  return false;
}

const reportRef = process.argv[2] || latestReportRef();
const report = readJson(reportRef);
const sourceReport = readJson(sourceReportRef);
const checks = [];

function check(name, passed, details) {
  checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
}

const expectedAllowedPaths = sourceReport.exact_target_results
  .filter((entry) => entry && entry.exists === true && imageExtPattern.test(entry.project_relative_path || ""))
  .map((entry) => entry.project_relative_path);
const expectedAllowedPathSet = new Set(expectedAllowedPaths);
const reportAllowedPathSet = new Set(report.exact_allowed_paths || []);
const resultPathSet = new Set((report.results || []).map((item) => item.project_relative_path));

check("report_version_v1", report.report_version === 1);
check("phase_matches_goal", report.phase === "asset_hash_dimensions_verification_A5");
check("source_report_matches_authorized_report", report.source_report === sourceReportRef);
check("output_report_path_matches_argument", report.output_report_path === reportRef);
check("reviewer_jenn", report.reviewer === "Jenn");
check("generated_at_local_parseable", !Number.isNaN(Date.parse(report.generated_at_local)));
check("max_file_count_matches_expected", report.max_file_count === expectedAllowedPaths.length);
check("exact_allowed_path_count_matches_expected", report.exact_allowed_path_count === expectedAllowedPaths.length);
check("verified_file_count_matches_results", report.verified_file_count === (report.results || []).length);
check("failed_count_matches_failures", report.failed_count === (report.failures || []).length);
check("no_failures", report.failed_count === 0);
check("exact_allowed_paths_unique", reportAllowedPathSet.size === (report.exact_allowed_paths || []).length);
check("expected_allowed_paths_unique", expectedAllowedPathSet.size === expectedAllowedPaths.length);
check("exact_allowed_paths_match_source_report_filter", expectedAllowedPaths.length === reportAllowedPathSet.size && expectedAllowedPaths.every((item) => reportAllowedPathSet.has(item)));
check("result_paths_match_exact_allowed_paths", resultPathSet.size === reportAllowedPathSet.size && [...reportAllowedPathSet].every((item) => resultPathSet.has(item)));

for (const item of report.exact_allowed_paths || []) {
  check(`exact_allowed_path_safe_${item}`, isSafeRunsImagePath(item));
}

for (const item of report.results || []) {
  check(`result_path_safe_${item.project_relative_path}`, isSafeRunsImagePath(item.project_relative_path));
  check(`result_exists_${item.project_relative_path}`, item.exists === true);
  check(`result_type_file_${item.project_relative_path}`, item.type === "file");
  check(`result_size_positive_${item.project_relative_path}`, Number.isInteger(item.size_bytes) && item.size_bytes > 0);
  check(`result_last_write_time_parseable_${item.project_relative_path}`, !Number.isNaN(Date.parse(item.last_write_time_local)));
  check(`result_sha256_${item.project_relative_path}`, sha256Pattern.test(item.sha256 || ""));
  check(`result_width_positive_${item.project_relative_path}`, Number.isInteger(item.width) && item.width > 0);
  check(`result_height_positive_${item.project_relative_path}`, Number.isInteger(item.height) && item.height > 0);
  check(`result_format_matches_extension_${item.project_relative_path}`, extensionMatchesFormat(item.extension, item.format));
  check(`result_mime_present_${item.project_relative_path}`, typeof item.mime_type === "string" && item.mime_type.startsWith("image/"));
  check(`result_metadata_method_static_${item.project_relative_path}`, item.metadata_read_method === "sharp.metadata_from_binary_buffer");
  check(`result_unchanged_after_read_${item.project_relative_path}`, item.unchanged_after_read === true);
}

for (const field of [
  "image_binary_read_allowed",
  "hash_extraction_allowed",
  "dimensions_extraction_allowed",
  "image_binary_read_performed",
  "hash_extraction_performed",
  "dimensions_extraction_performed",
]) {
  check(`${field}_true`, report[field] === true);
}

for (const field of [
  "preview_generation_allowed",
  "preview_generation_performed",
  "runs_mutation_allowed",
  "runs_mutation_performed",
  "copy_move_delete_allowed",
  "copy_move_delete_performed",
  "provider_contact_allowed",
  "provider_contact_performed",
  "plugin_call_allowed",
  "plugin_call_performed",
  "api_call_allowed",
  "api_call_performed",
  "DailyNote_write_allowed",
  "DailyNote_write_performed",
  "VCP_memory_write_allowed",
  "VCP_memory_write_performed",
  "production_candidate_write_allowed",
  "production_candidate_write_performed",
]) {
  check(`${field}_false`, report[field] === false);
}

const disallowedPayloadKeys = collectKeys(report)
  .filter((key) => disallowedPayloadKeyPattern.test(key))
  .filter((key) => ![
    "image_binary_read_allowed",
    "image_binary_read_performed",
    "size_bytes",
  ].includes(key));
check("report_contains_no_embedded_image_payload_keys", disallowedPayloadKeys.length === 0, disallowedPayloadKeys.join(", "));

const failures = checks.filter((item) => !item.passed);
const result = {
  validator: "validate_runs_asset_verification_report",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0 ? "runs_asset_verification_report_verified" : "runs_asset_verification_report_failed",
  report_ref: reportRef,
  source_report_ref: sourceReportRef,
  exact_allowed_path_count: report.exact_allowed_path_count,
  verified_file_count: report.verified_file_count,
  failed_count: report.failed_count,
  image_binary_read_performed: report.image_binary_read_performed,
  hash_extraction_performed: report.hash_extraction_performed,
  dimensions_extraction_performed: report.dimensions_extraction_performed,
  preview_generation_performed: report.preview_generation_performed,
  runs_mutation_performed: report.runs_mutation_performed,
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

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
