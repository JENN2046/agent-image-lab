#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const schemaRef = "schemas/full_asset_archive_manifest.schema.yaml";
const exampleRef = "tests/schema_examples/full_asset_archive_manifest.example.json";
const designRef = "docs/FULL_ASSET_ARCHIVE_DESIGN.md";
const executionReportRef = "reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json";
const durableArchiveRoot = "asset_archive/original_assets/by_sha256/";
const sha256Pattern = /^[a-f0-9]{64}$/;

function readProjectFile(projectRelativePath) {
  return fs.readFileSync(path.join(root, projectRelativePath), "utf8");
}

function isProjectRelative(value) {
  return typeof value === "string"
    && value.length > 0
    && !path.isAbsolute(value)
    && !/^[A-Za-z]:[\\/]/.test(value)
    && !value.includes("\\")
    && !value.split("/").includes("..");
}

function isPreviewCapsuleRoot(value, lane) {
  const expectedRoot = lane === "failure"
    ? "asset_archive/failure_samples/"
    : "asset_archive/accepted_samples/";
  return isProjectRelative(value) && value.startsWith(expectedRoot) && value.endsWith("/");
}

function isDurableArchivePath(value) {
  return isProjectRelative(value) && value.startsWith(durableArchiveRoot);
}

function basenameStem(value) {
  return path.posix.basename(value || "", path.posix.extname(value || ""));
}

function validateManifest(manifest, executionReport) {
  const failures = [];

  function requireCheck(name, passed, detail) {
    if (!passed) failures.push({ check: name, detail: detail || "check failed" });
  }

  requireCheck("manifest_version_v1", manifest.manifest_version === "v1");
  requireCheck("manifest_type", manifest.manifest_type === "full_asset_archive_manifest");
  requireCheck("lane_allowed", ["accepted", "failure"].includes(manifest.lane));
  requireCheck("sample_id_present", typeof manifest.sample_id === "string" && manifest.sample_id.length > 0);

  const capsuleRoot = manifest.preview_capsule_ref?.capsule_root;
  const manifestRef = manifest.preview_capsule_ref?.manifest_ref;
  const previewRef = manifest.preview_capsule_ref?.preview_artifact_ref;
  requireCheck("preview_capsule_root_project_relative", isPreviewCapsuleRoot(capsuleRoot, manifest.lane), capsuleRoot);
  requireCheck("preview_manifest_under_capsule_root", isProjectRelative(manifestRef) && manifestRef === `${capsuleRoot}manifest.json`, manifestRef);
  requireCheck("preview_artifact_under_capsule_root", isProjectRelative(previewRef) && previewRef === `${capsuleRoot}preview.webp`, previewRef);

  const preview = manifest.preview_validation || {};
  requireCheck("git_tracked_preview_static_validation_allowed", preview.git_tracked_preview_static_validation_allowed === true);
  requireCheck("preview_required_long_edge_512", preview.preview_required_long_edge === 512);
  requireCheck("preview_format_webp", preview.preview_format === "webp");
  requireCheck("source_image_binary_not_required", preview.source_image_binary_read_required === false);
  requireCheck("original_not_required_for_portable_validation", preview.original_asset_required_for_portable_validation === false);

  const original = manifest.original_asset || {};
  requireCheck("original_storage_strategy_allowed", ["not_yet_verified", "missing", "external_local", "external_cloud", "git_tracked_durable_archive"].includes(original.storage_strategy));
  requireCheck("original_verification_status_allowed", ["blocked_until_A5_authorization", "verified_durable_archive_git_tracked"].includes(original.verification_status));

  if (original.verification_status === "blocked_until_A5_authorization") {
    requireCheck("blocked_original_ref_null", original.original_asset_ref === null);
    requireCheck("blocked_original_sha256_null", original.original_sha256 === null);
    requireCheck("blocked_original_dimensions_null", original.original_dimensions === null);
    requireCheck("blocked_original_mime_null", original.original_mime_type === null);
    requireCheck("blocked_original_verification_evidence_ref_null", original.verification_evidence_ref === null);
  }

  if (original.verification_status === "verified_durable_archive_git_tracked") {
    requireCheck("verified_storage_strategy_git_tracked_durable_archive", original.storage_strategy === "git_tracked_durable_archive");
    requireCheck("verified_original_ref_safe", isDurableArchivePath(original.original_asset_ref), original.original_asset_ref);
    requireCheck("verified_original_sha256_format", sha256Pattern.test(original.original_sha256 || ""), original.original_sha256);
    requireCheck("verified_original_path_stem_matches_sha256", basenameStem(original.original_asset_ref) === original.original_sha256, original.original_asset_ref);
    requireCheck("verified_original_dimensions_object", Number.isInteger(original.original_dimensions?.width) && original.original_dimensions.width > 0 && Number.isInteger(original.original_dimensions?.height) && original.original_dimensions.height > 0, original.original_dimensions);
    requireCheck("verified_original_mime_present", typeof original.original_mime_type === "string" && original.original_mime_type.startsWith("image/"), original.original_mime_type);
    requireCheck("verified_original_evidence_ref", original.verification_evidence_ref === executionReportRef, original.verification_evidence_ref);
    requireCheck("verified_original_target_exists", fs.existsSync(path.join(root, original.original_asset_ref)));

    const matchedResult = (executionReport.results || []).find((result) => result.target_archive_path === original.original_asset_ref);
    requireCheck("verified_original_result_present_in_execution_report", Boolean(matchedResult), original.original_asset_ref);
    if (matchedResult) {
      requireCheck("verified_original_sha256_matches_execution_report", matchedResult.target_sha256 === original.original_sha256 && matchedResult.expected_sha256 === original.original_sha256, matchedResult.target_sha256);
      requireCheck("verified_original_dimensions_match_execution_report", matchedResult.expected_dimensions?.width === original.original_dimensions.width && matchedResult.expected_dimensions?.height === original.original_dimensions.height, matchedResult.expected_dimensions);
      requireCheck("verified_original_mime_matches_execution_report", matchedResult.expected_mime_type === original.original_mime_type, matchedResult.expected_mime_type);
      requireCheck("verified_original_post_copy_verified", matchedResult.post_copy_verified === true);
    }
  }

  requireCheck("original_required_for_full_archive_ready", original.required_for_full_archive_ready === true);
  requireCheck("original_required_for_production_candidate", original.required_for_production_candidate === true);

  const recovery = manifest.recovery || {};
  requireCheck("clone_restore_preview_capsule_ready", recovery.clone_restore_preview_capsule_ready === true);
  requireCheck("missing_original_blocks_full_archive_ready", recovery.missing_original_blocks_full_archive_ready === true);
  requireCheck("missing_original_blocks_production_candidate", recovery.missing_original_blocks_production_candidate === true);
  requireCheck("missing_original_does_not_invalidate_preview_capsule", recovery.missing_original_invalidates_preview_capsule === false);

  for (const field of forbiddenFields) {
    requireCheck(`forbidden_${field}_null`, manifest.forbidden_fields?.[field] === null);
  }
  for (const field of guardFalseFields) {
    requireCheck(`guard_${field}_false`, manifest.guard?.[field] === false);
  }

  return failures;
}

function makeNegativeFixture(overrides) {
  return JSON.parse(JSON.stringify({ ...example, ...overrides }));
}

const schemaText = readProjectFile(schemaRef);
const schema = YAML.parse(schemaText);
const example = JSON.parse(readProjectFile(exampleRef));
const designText = readProjectFile(designRef);
const executionReport = JSON.parse(readProjectFile(executionReportRef));
const checks = [];

function check(name, passed, details) {
  checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
}

const forbiddenFields = [
  "absolute_original_asset_path",
  "absolute_preview_capsule_path",
  "secret",
  "token",
  "cookie",
  "password",
  "api_key",
  "provider_credential",
  "raw_chat_history",
  "customer_private_data",
  "image_binary_inline",
  "base64_image",
  "generated_preview_binary",
  "production_candidate_path",
];

const guardFalseFields = [
  "actual_runs_scan_performed",
  "runs_mutation_performed",
  "source_image_binary_read_performed",
  "image_binary_read_performed",
  "hash_extraction_performed",
  "dimensions_extraction_performed",
  "preview_generation_performed",
  "original_copy_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "production_candidate_allowed",
  "production_candidate_write_performed",
  "memory_write_allowed",
  "commercial_delivery_allowed",
];

check("schema_id", schema.schema_id === "full_asset_archive_manifest_v1");
check("schema_manifest_type", schema.manifest_type === "full_asset_archive_manifest");
check("schema_required_fields", ["preview_capsule_ref", "preview_validation", "original_asset", "recovery", "guard"].every((field) => schema.required_fields.includes(field)));
check("schema_allowed_preview_roots", schema.field_rules.preview_capsule_ref.path_scope.allowed_roots.includes("asset_archive/accepted_samples/") && schema.field_rules.preview_capsule_ref.path_scope.allowed_roots.includes("asset_archive/failure_samples/"));
check("schema_preview_static_validation_only", schema.field_rules.preview_validation.source_image_binary_read_required === false && schema.field_rules.preview_validation.original_asset_required_for_portable_validation === false);
check("schema_original_blocked_until_A5", schema.field_rules.original_asset.blocked_until_A5_requires_null.includes("original_sha256") && schema.field_rules.original_asset.blocked_until_A5_requires_null.includes("verification_evidence_ref"));
check("schema_original_verified_git_tracked_allowed", schema.field_rules.original_asset.storage_strategy_allowed.includes("git_tracked_durable_archive") && schema.field_rules.original_asset.verification_status_allowed.includes("verified_durable_archive_git_tracked"));
check("schema_verified_git_tracked_root", schema.field_rules.original_asset.verified_git_tracked_durable_archive.path_scope.allowed_roots.includes(durableArchiveRoot));

for (const field of forbiddenFields) {
  check(`schema_forbidden_${field}`, schema.forbidden_fields.must_be_null.includes(field));
}
for (const field of guardFalseFields) {
  check(`schema_guard_${field}`, schema.guard.must_be_false.includes(field));
}

check("execution_report_completed_validated", executionReport.status === "completed_validated");
check("execution_report_target_root", (executionReport.results || []).every((result) => typeof result.target_archive_path === "string" && result.target_archive_path.startsWith(durableArchiveRoot)));

const positiveFailures = validateManifest(example, executionReport);
check("example_positive_manifest_valid", positiveFailures.length === 0, positiveFailures);
check("design_ref_present", /preview capsule/i.test(designText) && /original asset/i.test(designText) && /A5/i.test(designText) && /by_sha256/i.test(designText));

const negativeFixtures = [
  {
    name: "absolute_preview_capsule_path_fails",
    fixture: makeNegativeFixture({
      preview_capsule_ref: {
        ...example.preview_capsule_ref,
        capsule_root: "A:/agent-image-lab/asset_archive/accepted_samples/example/",
      },
    }),
  },
  {
    name: "path_escape_fails",
    fixture: makeNegativeFixture({
      preview_capsule_ref: {
        ...example.preview_capsule_ref,
        capsule_root: "asset_archive/accepted_samples/../escape/",
      },
    }),
  },
  {
    name: "source_image_binary_requirement_fails",
    fixture: makeNegativeFixture({
      preview_validation: {
        ...example.preview_validation,
        source_image_binary_read_required: true,
      },
    }),
  },
  {
    name: "blocked_original_sha256_fails",
    fixture: makeNegativeFixture({
      original_asset: {
        ...example.original_asset,
        storage_strategy: "not_yet_verified",
        verification_status: "blocked_until_A5_authorization",
        original_asset_ref: null,
        original_sha256: "abc123",
        original_dimensions: null,
        original_mime_type: null,
        verification_evidence_ref: null,
      },
    }),
  },
  {
    name: "verified_original_bad_target_root_fails",
    fixture: makeNegativeFixture({
      original_asset: {
        ...example.original_asset,
        original_asset_ref: "asset_archive/accepted_samples/not-allowed.jpg",
      },
    }),
  },
  {
    name: "verified_original_bad_report_ref_fails",
    fixture: makeNegativeFixture({
      original_asset: {
        ...example.original_asset,
        verification_evidence_ref: "reports/other_execution_report.json",
      },
    }),
  },
  {
    name: "missing_original_production_not_blocked_fails",
    fixture: makeNegativeFixture({
      recovery: {
        ...example.recovery,
        missing_original_blocks_production_candidate: false,
      },
    }),
  },
  {
    name: "production_candidate_guard_true_fails",
    fixture: makeNegativeFixture({
      guard: {
        ...example.guard,
        production_candidate_allowed: true,
      },
    }),
  },
];

for (const negative of negativeFixtures) {
  check(`negative_${negative.name}`, validateManifest(negative.fixture, executionReport).length > 0);
}

const failures = checks.filter((item) => !item.passed);
const result = {
  validator: "validate_full_asset_archive_manifest",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0 ? "full_asset_archive_manifest_verified" : "full_asset_archive_manifest_failed",
  schema_ref: schemaRef,
  example_ref: exampleRef,
  design_ref: designRef,
  execution_report_ref: executionReportRef,
  static_validator_only: true,
  existing_git_tracked_preview_static_validation_allowed: true,
  source_image_binary_read_performed: false,
  actual_runs_scan_performed: false,
  runs_mutation_performed: false,
  image_binary_read_performed: false,
  hash_extraction_performed: false,
  dimensions_extraction_performed: false,
  preview_generation_performed: false,
  original_copy_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  runtime_execution_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  production_candidate_write_performed: false,
  push_tag_release_deploy_performed: false,
  check_count: checks.length,
  failed_count: failures.length,
  checks,
  failures,
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
