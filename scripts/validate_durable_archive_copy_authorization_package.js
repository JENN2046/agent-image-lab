#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packageRef = "reports/durable_archive_copy_authorization/2026-05-20_durable_archive_copy_A5_authorization_package.json";
const sourceManifestRef = "reports/full_asset_archive_dry_run_manifest/2026-05-20_full_asset_archive_dry_run_manifest.json";
const targetRoot = "asset_archive/original_assets/by_sha256/";
const sha256Pattern = /^[a-f0-9]{64}$/;

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

const authRef = process.argv[2] || packageRef;
const authorization = readJson(authRef);
const sourceManifest = readJson(sourceManifestRef);
const checks = [];

function check(name, passed, details) {
  checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
}

const manifestBySource = new Map((sourceManifest.entries || []).map((entry) => [entry.source_runs_path, entry]));
const pairSourcePaths = new Set((authorization.exact_copy_pairs || []).map((pair) => pair.source_runs_path));

check("report_version_v1", authorization.report_version === 1);
check("phase", authorization.phase === "durable_archive_copy_A5_authorization_package");
check("authorization_inactive", authorization.authorization_state === "draft_not_active");
check("future_authorization_required", authorization.activation_requires_future_user_authorization === true);
check("source_manifest", authorization.source_manifest === sourceManifestRef);
check("source_manifest_commit", typeof authorization.source_manifest_commit === "string" && authorization.source_manifest_commit.length >= 7);
check("reviewer_jenn", authorization.reviewer === "Jenn");
check("max_file_count", authorization.max_file_count === sourceManifest.asset_count);
check("exact_copy_pair_count", authorization.exact_copy_pair_count === (authorization.exact_copy_pairs || []).length);
check("pair_count_matches_manifest", authorization.exact_copy_pair_count === sourceManifest.asset_count);
check("target_archive_root", authorization.target_archive_root === targetRoot);
check("all_manifest_sources_mapped", (sourceManifest.entries || []).every((entry) => pairSourcePaths.has(entry.source_runs_path)));

for (const pair of authorization.exact_copy_pairs || []) {
  const manifestEntry = manifestBySource.get(pair.source_runs_path);
  const expectedTarget = manifestEntry?.proposed_archive_target_ref;

  check(`pair_source_safe_${pair.source_runs_path}`, isSafeProjectRelativePath(pair.source_runs_path) && pair.source_runs_path.startsWith("runs/"));
  check(`pair_target_safe_${pair.source_runs_path}`, isSafeProjectRelativePath(pair.target_archive_path) && pair.target_archive_path?.startsWith(targetRoot));
  check(`pair_target_matches_manifest_${pair.source_runs_path}`, pair.target_archive_path === expectedTarget);
  check(`pair_sha256_valid_${pair.source_runs_path}`, sha256Pattern.test(pair.expected_sha256 || ""));
  check(`pair_sha256_matches_manifest_${pair.source_runs_path}`, pair.expected_sha256 === manifestEntry?.source_sha256);
  check(`pair_dimensions_match_manifest_${pair.source_runs_path}`, pair.expected_dimensions?.width === manifestEntry?.source_dimensions?.width && pair.expected_dimensions?.height === manifestEntry?.source_dimensions?.height);
  check(`pair_mime_matches_manifest_${pair.source_runs_path}`, pair.expected_mime_type === manifestEntry?.source_mime_type);
  check(`pair_size_matches_manifest_${pair.source_runs_path}`, pair.expected_size_bytes === manifestEntry?.source_size_bytes);
  check(`pair_overwrite_false_${pair.source_runs_path}`, pair.overwrite_existing_allowed === false);
  check(`pair_move_false_${pair.source_runs_path}`, pair.move_allowed === false);
  check(`pair_delete_false_${pair.source_runs_path}`, pair.delete_allowed === false);
  check(`pair_copy_not_performed_${pair.source_runs_path}`, pair.copy_performed === false);
}

const allowed = authorization.allowed_operations_after_activation || {};
check("future_copy_exact_pairs_only", allowed.copy_exact_pairs_only === true);
check("future_post_copy_verify", allowed.verify_post_copy_sha256_dimensions_mime_against_package === true);
check("future_named_report_only", allowed.write_named_execution_report_only === true);

for (const field of [
  "overwrite_existing_targets",
  "move_source_files",
  "delete_source_files",
  "mutate_runs",
  "preview_generation",
  "provider_contact",
  "plugin_call",
  "api_call",
  "DailyNote_write",
  "VCP_memory_write",
  "production_candidate_write",
  "dependency_change",
  "tag_release_deploy",
  "force_push_or_history_rewrite",
]) {
  check(`forbidden_${field}`, authorization.forbidden_operations?.[field] === true);
}

for (const field of [
  "durable_archive_copy_performed",
  "target_archive_directory_created",
  "target_archive_artifact_created",
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
  check(`execution_${field}_false`, authorization.execution_performed?.[field] === false);
}

check("rollback_exact_targets_only", authorization.rollback_plan?.allowed_cleanup_scope_ref === "exact_copy_pairs[].target_archive_path");
check("rollback_no_source_cleanup", authorization.rollback_plan?.source_cleanup_allowed === false && authorization.rollback_plan?.runs_cleanup_allowed === false);
check("execution_report_path_safe", isSafeProjectRelativePath(authorization.required_execution_report_path) && authorization.required_execution_report_path.startsWith("reports/durable_archive_copy_execution/"));

const failures = checks.filter((item) => !item.passed);
const result = {
  validator: "validate_durable_archive_copy_authorization_package",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0 ? "durable_archive_copy_authorization_package_verified" : "durable_archive_copy_authorization_package_failed",
  authorization_ref: authRef,
  source_manifest_ref: sourceManifestRef,
  authorization_state: authorization.authorization_state,
  exact_copy_pair_count: authorization.exact_copy_pair_count,
  max_file_count: authorization.max_file_count,
  durable_archive_copy_performed: authorization.execution_performed?.durable_archive_copy_performed,
  runs_mutation_performed: authorization.execution_performed?.runs_mutation_performed,
  preview_generation_performed: authorization.execution_performed?.preview_generation_performed,
  provider_contact_performed: authorization.execution_performed?.provider_contact_performed,
  plugin_call_performed: authorization.execution_performed?.plugin_call_performed,
  api_call_performed: authorization.execution_performed?.api_call_performed,
  DailyNote_write_performed: authorization.execution_performed?.DailyNote_write_performed,
  VCP_memory_write_performed: authorization.execution_performed?.VCP_memory_write_performed,
  production_candidate_write_performed: authorization.execution_performed?.production_candidate_write_performed,
  check_count: checks.length,
  failed_count: failures.length,
  failures,
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
