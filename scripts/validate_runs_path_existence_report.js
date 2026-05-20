#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const reportsDirRef = "reports/runs_path_existence_verification";
const packageRef = "docs/RUNS_RESTORE_VERIFICATION_AUTHORIZATION_PACKAGE_DRAFT.md";

function readJson(ref) {
  return JSON.parse(fs.readFileSync(path.join(root, ref), "utf8"));
}

function isSafeRunsPath(value) {
  return typeof value === "string"
    && value.startsWith("runs/")
    && value.length > "runs/".length
    && !value.includes("\\")
    && !value.includes("..")
    && !value.includes("*")
    && !value.includes("?")
    && !path.isAbsolute(value)
    && !/^[A-Za-z]:[\\/]/.test(value);
}

function latestReportRef() {
  const dir = path.join(root, reportsDirRef);
  const files = fs.readdirSync(dir)
    .filter((name) => name.endsWith("_runs_path_existence_scan_report.json"))
    .sort((a, b) => b.localeCompare(a));

  if (files.length === 0) {
    throw new Error("No runs path existence scan report found");
  }

  return `${reportsDirRef}/${files[0]}`;
}

const reportRef = process.argv[2] || latestReportRef();
const report = readJson(reportRef);
const packageText = fs.readFileSync(path.join(root, packageRef), "utf8");
const checks = [];

function check(name, passed, details) {
  checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
}

check("report_version_v1", report.report_version === "v1");
check("phase_matches_goal", report.phase === "runs_path_existence_verification_A5_scan_train_v1");
check("scan_root_runs", report.scan_root === "runs/");
check("candidate_path_count_positive", Number.isInteger(report.candidate_path_count) && report.candidate_path_count > 0);
check("scanned_counts_present", Number.isInteger(report.scanned_file_count) && Number.isInteger(report.scanned_directory_count));
check("exact_counts_sum", report.exact_existing_count + report.exact_missing_count === report.candidate_path_count);
check("basename_match_count_consistent", report.matched_by_basename_count === report.matched_required_basenames.length);
check("exact_results_count", report.exact_target_results.length === report.candidate_path_count);
check("scanned_file_paths_count", report.scanned_file_paths.length === report.scanned_file_count);
check("scanned_directory_paths_count", report.scanned_directory_paths.length === report.scanned_directory_count);

for (const item of report.exact_target_results) {
  check(`candidate_safe_${item.project_relative_path}`, isSafeRunsPath(item.project_relative_path));
}

for (const item of report.scanned_file_paths) {
  check(`scanned_file_safe_${item.project_relative_path}`, isSafeRunsPath(item.project_relative_path));
  check(`scanned_file_metadata_only_${item.project_relative_path}`, Object.prototype.hasOwnProperty.call(item, "size_bytes") && Object.prototype.hasOwnProperty.call(item, "last_write_time_utc"));
}

for (const item of report.scanned_directory_paths) {
  check(`scanned_directory_safe_${item.project_relative_path}`, isSafeRunsPath(item.project_relative_path));
}

const guardFalseFields = [
  "image_binary_read_performed",
  "file_content_read_performed_under_runs",
  "hash_extraction_performed",
  "dimensions_extraction_performed",
  "preview_generation_performed",
  "runs_mutation_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "production_candidate_write_performed",
];

for (const field of guardFalseFields) {
  check(`guard_${field}_false`, report.guard?.[field] === false);
}

check("authorization_package_mentions_report", packageText.includes(reportRef));
check("authorization_package_mentions_path_count", packageText.includes(`max_path_count: ${report.candidate_path_count}`));
check("authorization_package_keeps_image_binary_false", packageText.includes("image_binary_read_allowed: false"));
check("authorization_package_keeps_hash_false", packageText.includes("hash_extraction_allowed: false"));
check("authorization_package_keeps_dimensions_false", packageText.includes("dimensions_extraction_allowed: false"));

const failures = checks.filter((item) => !item.passed);
const result = {
  validator: "validate_runs_path_existence_report",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0 ? "runs_path_existence_report_verified" : "runs_path_existence_report_failed",
  report_ref: reportRef,
  package_ref: packageRef,
  candidate_path_count: report.candidate_path_count,
  scanned_file_count: report.scanned_file_count,
  scanned_directory_count: report.scanned_directory_count,
  exact_existing_count: report.exact_existing_count,
  exact_missing_count: report.exact_missing_count,
  matched_by_basename_count: report.matched_by_basename_count,
  image_binary_read_performed: false,
  hash_extraction_performed: false,
  dimensions_extraction_performed: false,
  preview_generation_performed: false,
  runs_mutation_performed: false,
  check_count: checks.length,
  failed_count: failures.length,
  failures,
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
