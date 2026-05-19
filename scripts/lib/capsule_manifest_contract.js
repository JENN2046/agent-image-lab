"use strict";

const fs = require("node:fs");

const ACCEPTED_ROOT = "asset_archive/accepted_samples";
const FAILURE_ROOT = "asset_archive/failure_samples";
const REQUIRED_LONG_EDGE = 512;

function capsuleRoot(lane, sampleId) {
  if (typeof sampleId !== "string" || !/^[A-Za-z0-9_.-]+$/.test(sampleId)) {
    throw new Error(`invalid capsule sample id: ${sampleId}`);
  }
  if (lane === "accepted") return `${ACCEPTED_ROOT}/${sampleId}`;
  if (lane === "failure") return `${FAILURE_ROOT}/${sampleId}`;
  throw new Error(`unsupported capsule lane: ${lane}`);
}

function chainSpec(lane) {
  if (lane === "accepted") {
    return {
      manifestType: "git_portable_preview_capsule_manifest",
      files: {
        import_record: { file: "import_record.json", type: "git_portable_preview_capsule_import_record" },
        review_record: { file: "review_record.json", type: "git_portable_preview_capsule_review_record" },
        approval_record: { file: "approval_record.json", type: "git_portable_preview_capsule_approval_record" },
      },
    };
  }
  return {
    manifestType: "git_portable_failure_sample_capsule_manifest",
    files: {
      failure_record: { file: "failure_record.json", type: "git_portable_failure_sample_capsule_failure_record" },
      review_record: { file: "review_record.json", type: "git_portable_failure_sample_capsule_review_record" },
    },
  };
}

function classifyFailures(failures) {
  const classes = new Set();
  for (const failure of failures || []) {
    if (failure === "manifest_exists") classes.add("missing_capsule_manifest");
    else if (["manifest_type_matches", "manifest_version_v1", "sample_id_matches", "preview_path_matches", "preview_format_webp", "preview_git_tracked_true", "original_not_required", "base64_absent_from_manifest"].includes(failure)) classes.add("manifest_contract_mismatch");
    else if (failure === "preview_file_exists") classes.add("missing_preview_file");
    else if (failure === "preview_webp_signature_valid") classes.add("invalid_preview_signature");
    else if (["preview_manifest_long_edge_matches", "preview_file_long_edge_matches"].includes(failure)) classes.add("preview_long_edge_mismatch");
    else if (["preview_manifest_sha256_present", "preview_sha256_matches_manifest"].includes(failure)) classes.add("preview_hash_mismatch");
    else if (failure.endsWith("_exists")) classes.add("missing_chain_file");
    else if (failure.endsWith("_record_type_matches") || failure.endsWith("_sample_id_matches") || failure === "failure_review_final_route_matches") classes.add("chain_record_mismatch");
    else if (failure.includes("guard_") || failure.includes("allowed_false") || failure.includes("production_candidate")) classes.add("production_or_memory_guard_violation");
    else classes.add("other");
  }
  return Array.from(classes).sort();
}

function validateGuardFalse(value, prefix, failures) {
  const guard = value || {};
  for (const field of ["provider_contact_performed", "plugin_call_performed", "api_call_performed", "image_generation_performed", "DailyNote_write_performed", "VCP_memory_write_performed", "runtime_execution_performed", "real_manifest_read_performed", "real_vcpchat_read_performed", "real_vcptoolbox_read_performed"]) {
    if (guard[field] !== false) failures.push(`${prefix}_guard_${field}_false`);
  }
}

function validateCapsuleManifest(core, lane, sampleId, options = {}) {
  const requiredLongEdge = options.requiredLongEdge || REQUIRED_LONG_EDGE;
  const root = capsuleRoot(lane, sampleId);
  const spec = chainSpec(lane);
  const manifestRef = `${root}/manifest.json`;
  const manifest = core.parseJsonIfExists(manifestRef);
  const failures = [];
  const check = (condition, label) => { if (!condition) failures.push(label); };

  check(Boolean(manifest), "manifest_exists");
  if (!manifest) {
    return { lane, sample_id: sampleId, passed: false, manifest_validation_status: "manifest_missing", manifest_ref: manifestRef, preview_ref: `${root}/preview.webp`, preview_sha256: null, preview_long_edge: null, chain_refs: [], failures, failure_classes: classifyFailures(failures) };
  }

  const previewPath = manifest.artifact?.preview?.path || "preview.webp";
  const previewRef = `${root}/${previewPath}`;
  const previewExists = core.exists(previewRef);
  const previewSha256 = previewExists ? core.sha256File(previewRef) : null;
  const previewDimensions = previewExists ? core.readWebpDimensions(previewRef) : null;
  const previewLongEdge = previewDimensions?.width && previewDimensions?.height ? Math.max(previewDimensions.width, previewDimensions.height) : null;
  const text = JSON.stringify(manifest);

  check(manifest.manifest_type === spec.manifestType, "manifest_type_matches");
  check(manifest.version === "v1", "manifest_version_v1");
  check(manifest.sample_id === sampleId, "sample_id_matches");
  check(previewPath === "preview.webp", "preview_path_matches");
  check(manifest.artifact?.preview?.format === "webp", "preview_format_webp");
  check(manifest.artifact?.preview?.long_edge === requiredLongEdge, "preview_manifest_long_edge_matches");
  check(manifest.artifact?.preview?.git_tracked === true, "preview_git_tracked_true");
  check(manifest.artifact?.original?.required_for_portable_validation === false, "original_not_required");
  check(!text.includes("base64"), "base64_absent_from_manifest");
  check(previewExists, "preview_file_exists");
  check(previewDimensions?.signatureValid === true, "preview_webp_signature_valid");
  check(previewLongEdge === requiredLongEdge, "preview_file_long_edge_matches");
  check(Boolean(manifest.artifact?.preview?.sha256), "preview_manifest_sha256_present");
  check(previewSha256 === manifest.artifact?.preview?.sha256, "preview_sha256_matches_manifest");
  validateGuardFalse(manifest.guard, "manifest", failures);

  if (lane === "failure") {
    check(manifest.production_candidate_allowed === false, "production_candidate_allowed_false");
    check(manifest.memory_write_allowed === false, "memory_write_allowed_false");
    check(manifest.DailyNote_write_allowed === false, "DailyNote_write_allowed_false");
  }

  const chainRefs = [];
  for (const [chainKey, expected] of Object.entries(spec.files)) {
    const fileName = manifest.chain?.[chainKey] || expected.file;
    const ref = `${root}/${fileName}`;
    chainRefs.push(ref);
    const record = core.parseJsonIfExists(ref);
    check(Boolean(record), `${chainKey}_exists`);
    if (record) {
      check(record.record_type === expected.type, `${chainKey}_record_type_matches`);
      check(record.sample_id === sampleId, `${chainKey}_sample_id_matches`);
      validateGuardFalse(record.guard, chainKey, failures);
      if (lane === "failure" && chainKey === "review_record") {
        check(record.review_summary?.final_route === "failure_learning_only_never_production", "failure_review_final_route_matches");
      }
    }
  }

  return { lane, sample_id: sampleId, passed: failures.length === 0, manifest_validation_status: failures.length === 0 ? "capsule_manifest_contract_verified" : "capsule_manifest_contract_failed", manifest_ref: manifestRef, preview_ref: previewRef, preview_sha256: previewSha256, preview_width: previewDimensions?.width || null, preview_height: previewDimensions?.height || null, preview_long_edge: previewLongEdge, chain_refs: chainRefs, failures, failure_classes: classifyFailures(failures) };
}

function listCapsules(core, lane) {
  const root = lane === "accepted" ? ACCEPTED_ROOT : FAILURE_ROOT;
  const rootPath = core.repoPath(root);
  return fs.readdirSync(rootPath, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".tmp-")).map((entry) => entry.name).sort((left, right) => left.localeCompare(right));
}

function validateAllCapsuleManifests(core, options = {}) {
  const accepted = listCapsules(core, "accepted").map((sampleId) => validateCapsuleManifest(core, "accepted", sampleId, options));
  const failure = listCapsules(core, "failure").map((sampleId) => validateCapsuleManifest(core, "failure", sampleId, options));
  const samples = accepted.concat(failure);
  const failed = samples.filter((sample) => !sample.passed);
  const failureClassSummary = {};
  for (const sample of samples) for (const failureClass of sample.failure_classes) failureClassSummary[failureClass] = (failureClassSummary[failureClass] || 0) + 1;
  return { passed: failed.length === 0, status: failed.length === 0 ? "capsule_manifest_contract_verified" : "capsule_manifest_contract_failed", report_version: "capsule_manifest_contract_v1", totals: { accepted: accepted.length, failure: failure.length, total: samples.length, passed: samples.length - failed.length, failed: failed.length }, samples, failed_sample_ids: failed.map((sample) => sample.sample_id), failure_class_summary: failureClassSummary, guard: { static_validator_only: true, preview_creation_or_copy_performed: false, provider_contact_performed: false, plugin_call_performed: false, api_call_performed: false, image_generation_performed: false, DailyNote_write_performed: false, VCP_memory_write_performed: false, runtime_execution_performed: false, real_manifest_read_performed: false, real_vcpchat_read_performed: false, real_vcptoolbox_read_performed: false, push_tag_release_deploy_performed: false } };
}

module.exports = { ACCEPTED_ROOT, FAILURE_ROOT, REQUIRED_LONG_EDGE, classifyFailures, validateCapsuleManifest, validateAllCapsuleManifests };
