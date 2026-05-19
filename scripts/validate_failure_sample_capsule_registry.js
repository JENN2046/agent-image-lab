#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const DEFAULT_ROOT = "asset_archive/failure_samples";

function readArg(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function normalizePath(value) {
  return value.replace(/\\/g, "/").replace(/\/+$/, "");
}

function failureCapsuleRoot(root, sampleId) {
  if (typeof sampleId !== "string" || !/^[A-Za-z0-9_.-]+$/.test(sampleId)) {
    throw new Error(`invalid failure sample id: ${sampleId}`);
  }
  return `${root}/${sampleId}`;
}

function failureCapsulePaths(root, sampleId) {
  const capsuleRoot = failureCapsuleRoot(root, sampleId);
  return {
    root: capsuleRoot,
    manifest: `${capsuleRoot}/manifest.json`,
    preview: `${capsuleRoot}/preview.webp`,
    failureRecord: `${capsuleRoot}/failure_record.json`,
    reviewRecord: `${capsuleRoot}/review_record.json`,
  };
}

function classifyFailures(failures) {
  const classes = new Set();
  for (const failure of failures || []) {
    if (failure === "manifest_exists") {
      classes.add("missing_capsule_manifest");
    } else if (failure === "preview_file_exists") {
      classes.add("missing_preview_file");
    } else if (failure === "preview_webp_signature_valid") {
      classes.add("invalid_preview_signature");
    } else if (failure === "preview_manifest_long_edge_matches" || failure === "preview_file_long_edge_matches") {
      classes.add("preview_long_edge_mismatch");
    } else if (failure === "preview_manifest_sha256_present" || failure === "preview_sha256_matches_manifest") {
      classes.add("preview_hash_mismatch");
    } else if (failure === "failure_record_exists" || failure === "review_record_exists") {
      classes.add("missing_chain_file");
    } else if (
      failure === "sample_id_matches" ||
      failure === "preview_path_matches" ||
      failure === "preview_format_webp" ||
      failure === "base64_absent_from_manifest" ||
      failure === "original_sha256_not_required"
    ) {
      classes.add("manifest_contract_mismatch");
    } else if (
      failure === "production_candidate_allowed_false" ||
      failure === "memory_write_allowed_false" ||
      failure === "DailyNote_write_allowed_false"
    ) {
      classes.add("production_or_memory_guard_violation");
    } else {
      classes.add("other");
    }
  }
  return Array.from(classes).sort();
}

function summarizeFailureClasses(samples, failures) {
  const summary = {
    registry_configuration: 0,
    sample_failed: 0,
    missing_capsule_manifest: 0,
    missing_preview_file: 0,
    invalid_preview_signature: 0,
    preview_long_edge_mismatch: 0,
    preview_hash_mismatch: 0,
    missing_chain_file: 0,
    manifest_contract_mismatch: 0,
    production_or_memory_guard_violation: 0,
    other: 0,
  };

  for (const sample of samples) {
    for (const failureClass of sample.failure_classes || []) {
      summary[failureClass] = (summary[failureClass] || 0) + 1;
    }
  }

  for (const failure of failures) {
    if (failure.startsWith("sample_failed:")) {
      summary.sample_failed += 1;
    } else {
      summary.registry_configuration += 1;
    }
  }

  return summary;
}

function validateFailureCapsule(core, root, sampleId, requiredLongEdge) {
  const paths = failureCapsulePaths(root, sampleId);
  const manifest = core.parseJsonIfExists(paths.manifest);
  const failures = [];

  function check(condition, label) {
    if (!condition) failures.push(label);
  }

  check(Boolean(manifest), "manifest_exists");
  if (!manifest) {
    return {
      sample_id: sampleId,
      passed: false,
      status: "failure_capsule_missing",
      preview_sha256: null,
      preview_width: null,
      preview_height: null,
      preview_long_edge: null,
      failures,
      failure_classes: classifyFailures(failures),
    };
  }

  const previewPath = manifest?.artifact?.preview?.path || "preview.webp";
  const previewRelativePath = `${paths.root}/${previewPath}`;
  const previewExists = core.exists(previewRelativePath);
  const previewSha256 = previewExists ? core.sha256File(previewRelativePath) : null;
  const previewDimensions = previewExists ? core.readWebpDimensions(previewRelativePath) : null;
  const previewLongEdge = previewDimensions?.width && previewDimensions?.height
    ? Math.max(previewDimensions.width, previewDimensions.height)
    : null;

  const manifestText = JSON.stringify(manifest);
  check(manifest.sample_id === sampleId, "sample_id_matches");
  check(previewPath === "preview.webp", "preview_path_matches");
  check(manifest.artifact?.preview?.format === "webp", "preview_format_webp");
  check(manifest.artifact?.preview?.long_edge === requiredLongEdge, "preview_manifest_long_edge_matches");
  check(!manifestText.includes("base64"), "base64_absent_from_manifest");
  check(manifest.artifact?.original?.required_for_portable_validation !== true, "original_sha256_not_required");
  check(manifest.production_candidate_allowed === false, "production_candidate_allowed_false");
  check(manifest.memory_write_allowed === false, "memory_write_allowed_false");
  check(manifest.DailyNote_write_allowed === false, "DailyNote_write_allowed_false");
  check(previewExists, "preview_file_exists");
  check(previewDimensions?.signatureValid === true, "preview_webp_signature_valid");
  check(previewLongEdge === requiredLongEdge, "preview_file_long_edge_matches");
  check(Boolean(manifest.artifact?.preview?.sha256), "preview_manifest_sha256_present");
  check(previewSha256 === manifest.artifact?.preview?.sha256, "preview_sha256_matches_manifest");
  check(core.exists(paths.failureRecord), "failure_record_exists");
  check(core.exists(paths.reviewRecord), "review_record_exists");

  return {
    sample_id: sampleId,
    passed: failures.length === 0,
    status: failures.length === 0 ? "git_portable_failure_preview_evidence_verified" : "failure_capsule_incomplete",
    preview_sha256: previewSha256,
    preview_width: previewDimensions?.width || null,
    preview_height: previewDimensions?.height || null,
    preview_long_edge: previewLongEdge,
    failures,
    failure_classes: classifyFailures(failures),
  };
}

function main() {
  const root = normalizePath(readArg("root", DEFAULT_ROOT));
  const mode = readArg("mode", "archive-directory");
  const requiredLongEdge = Number(readArg("long-edge", "512"));
  const requireAtLeast = Number(readArg("require-at-least", "0"));
  const core = createRecoverabilityCore(process.cwd());
  const failures = [];

  if (mode !== "archive-directory") failures.push(`unsupported_mode:${mode}`);
  if (root !== DEFAULT_ROOT) failures.push(`unsupported_root:${root}`);
  if (!Number.isInteger(requiredLongEdge) || requiredLongEdge <= 0) failures.push("invalid_required_long_edge");
  if (!Number.isInteger(requireAtLeast) || requireAtLeast < 0) failures.push("invalid_require_at_least");

  let sampleIds = [];
  if (failures.length === 0) {
    const rootPath = core.repoPath(root);
    if (!fs.existsSync(rootPath)) {
      failures.push("registry_root_missing");
    } else {
      sampleIds = fs.readdirSync(rootPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right));
    }
  }

  if (sampleIds.length < requireAtLeast) failures.push("sample_count_below_required_minimum");

  const samples = sampleIds.map((sampleId) => {
    try {
      return validateFailureCapsule(core, root, sampleId, requiredLongEdge);
    } catch (error) {
      return {
        sample_id: sampleId,
        passed: false,
        status: "failure_capsule_validation_error",
        preview_sha256: null,
        preview_width: null,
        preview_height: null,
        preview_long_edge: null,
        failures: [error.message],
        failure_classes: ["other"],
      };
    }
  });

  const failedSamples = samples.filter((sample) => !sample.passed);
  for (const sample of failedSamples) failures.push(`sample_failed:${sample.sample_id}`);

  const result = {
    passed: failures.length === 0,
    status: failures.length === 0 ? "failure_sample_capsules_verified" : "failure_sample_capsules_failed",
    report_version: "v1",
    root,
    mode,
    required_long_edge: requiredLongEdge,
    required_sample_minimum: requireAtLeast,
    total_samples: samples.length,
    sample_count: samples.length,
    passed_count: samples.filter((sample) => sample.passed).length,
    failed_count: failedSamples.length,
    failed_sample_ids: failedSamples.map((sample) => sample.sample_id),
    failure_class_summary: summarizeFailureClasses(samples, failures),
    samples,
    guard: {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      preview_creation_or_copy_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      runtime_execution_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      push_tag_release_deploy_performed: false,
    },
    failures,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.passed ? 0 : 1);
}

main();
