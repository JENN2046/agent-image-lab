"use strict";

const FAILURE_CLASS = Object.freeze({
  REGISTRY_CONFIGURATION: "registry_configuration",
  SAMPLE_FAILED: "sample_failed",
  MISSING_CAPSULE_MANIFEST: "missing_capsule_manifest",
  MISSING_PREVIEW_FILE: "missing_preview_file",
  INVALID_PREVIEW_SIGNATURE: "invalid_preview_signature",
  PREVIEW_LONG_EDGE_MISMATCH: "preview_long_edge_mismatch",
  PREVIEW_HASH_MISMATCH: "preview_hash_mismatch",
  MISSING_CHAIN_FILE: "missing_chain_file",
  CHAIN_RECORD_MISMATCH: "chain_record_mismatch",
  MANIFEST_CONTRACT_MISMATCH: "manifest_contract_mismatch",
  PRODUCTION_OR_MEMORY_GUARD_VIOLATION: "production_or_memory_guard_violation",
  OTHER: "other",
});

const PREVIEW_FAILURE_CLASS_SUMMARY_KEYS = Object.freeze([
  FAILURE_CLASS.REGISTRY_CONFIGURATION,
  FAILURE_CLASS.SAMPLE_FAILED,
  FAILURE_CLASS.MISSING_CAPSULE_MANIFEST,
  FAILURE_CLASS.MISSING_PREVIEW_FILE,
  FAILURE_CLASS.INVALID_PREVIEW_SIGNATURE,
  FAILURE_CLASS.PREVIEW_LONG_EDGE_MISMATCH,
  FAILURE_CLASS.PREVIEW_HASH_MISMATCH,
  FAILURE_CLASS.MISSING_CHAIN_FILE,
  FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  FAILURE_CLASS.OTHER,
]);

const FAILURE_SAMPLE_FAILURE_CLASS_SUMMARY_KEYS = Object.freeze([
  FAILURE_CLASS.REGISTRY_CONFIGURATION,
  FAILURE_CLASS.SAMPLE_FAILED,
  FAILURE_CLASS.MISSING_CAPSULE_MANIFEST,
  FAILURE_CLASS.MISSING_PREVIEW_FILE,
  FAILURE_CLASS.INVALID_PREVIEW_SIGNATURE,
  FAILURE_CLASS.PREVIEW_LONG_EDGE_MISMATCH,
  FAILURE_CLASS.PREVIEW_HASH_MISMATCH,
  FAILURE_CLASS.MISSING_CHAIN_FILE,
  FAILURE_CLASS.CHAIN_RECORD_MISMATCH,
  FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  FAILURE_CLASS.OTHER,
]);

const MANIFEST_FAILURE_CLASS_SUMMARY_KEYS = Object.freeze([
  FAILURE_CLASS.MISSING_CAPSULE_MANIFEST,
  FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  FAILURE_CLASS.MISSING_PREVIEW_FILE,
  FAILURE_CLASS.INVALID_PREVIEW_SIGNATURE,
  FAILURE_CLASS.PREVIEW_LONG_EDGE_MISMATCH,
  FAILURE_CLASS.PREVIEW_HASH_MISMATCH,
  FAILURE_CLASS.MISSING_CHAIN_FILE,
  FAILURE_CLASS.CHAIN_RECORD_MISMATCH,
  FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  FAILURE_CLASS.OTHER,
]);

const PREVIEW_FAILURE_LABELS = Object.freeze({
  manifest_exists: FAILURE_CLASS.MISSING_CAPSULE_MANIFEST,
  preview_file_exists: FAILURE_CLASS.MISSING_PREVIEW_FILE,
  preview_webp_signature_valid: FAILURE_CLASS.INVALID_PREVIEW_SIGNATURE,
  preview_manifest_long_edge_matches: FAILURE_CLASS.PREVIEW_LONG_EDGE_MISMATCH,
  preview_file_long_edge_matches: FAILURE_CLASS.PREVIEW_LONG_EDGE_MISMATCH,
  preview_manifest_sha256_present: FAILURE_CLASS.PREVIEW_HASH_MISMATCH,
  preview_sha256_matches_manifest: FAILURE_CLASS.PREVIEW_HASH_MISMATCH,
  import_record_exists: FAILURE_CLASS.MISSING_CHAIN_FILE,
  review_record_exists: FAILURE_CLASS.MISSING_CHAIN_FILE,
  approval_record_exists: FAILURE_CLASS.MISSING_CHAIN_FILE,
  sample_id_matches: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  preview_path_matches: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  preview_format_webp: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  preview_git_tracked_true: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  original_sha256_not_in_manifest: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  base64_absent_from_manifest: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
});

const FAILURE_SAMPLE_EXTRA_LABELS = Object.freeze({
  failure_record_exists: FAILURE_CLASS.MISSING_CHAIN_FILE,
  review_record_exists: FAILURE_CLASS.MISSING_CHAIN_FILE,
  failure_record_type_matches: FAILURE_CLASS.CHAIN_RECORD_MISMATCH,
  failure_record_sample_id_matches: FAILURE_CLASS.CHAIN_RECORD_MISMATCH,
  review_record_type_matches: FAILURE_CLASS.CHAIN_RECORD_MISMATCH,
  review_record_sample_id_matches: FAILURE_CLASS.CHAIN_RECORD_MISMATCH,
  review_record_final_route_matches: FAILURE_CLASS.CHAIN_RECORD_MISMATCH,
  original_sha256_not_required: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  production_candidate_allowed_false: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  memory_write_allowed_false: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  DailyNote_write_allowed_false: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  failure_record_production_candidate_allowed_false: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  failure_record_memory_suitability_false: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  failure_record_no_provider_contact: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  failure_record_no_plugin_call: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  failure_record_no_api_call: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  failure_record_no_image_generation: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  failure_record_no_dailynote_write: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  failure_record_no_vcp_memory_write: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_production_candidate_allowed_false: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_dailynote_write_allowed_false: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_vcp_memory_write_allowed_false: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_no_provider_contact: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_no_plugin_call: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_no_api_call: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_no_image_generation: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_no_dailynote_write: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
  review_record_no_vcp_memory_write: FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION,
});

const MANIFEST_FAILURE_LABELS = Object.freeze({
  manifest_exists: FAILURE_CLASS.MISSING_CAPSULE_MANIFEST,
  manifest_type_matches: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  manifest_version_v1: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  sample_id_matches: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  preview_path_matches: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  preview_format_webp: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  preview_git_tracked_true: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  original_not_required: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  base64_absent_from_manifest: FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH,
  preview_file_exists: FAILURE_CLASS.MISSING_PREVIEW_FILE,
  preview_webp_signature_valid: FAILURE_CLASS.INVALID_PREVIEW_SIGNATURE,
  preview_manifest_long_edge_matches: FAILURE_CLASS.PREVIEW_LONG_EDGE_MISMATCH,
  preview_file_long_edge_matches: FAILURE_CLASS.PREVIEW_LONG_EDGE_MISMATCH,
  preview_manifest_sha256_present: FAILURE_CLASS.PREVIEW_HASH_MISMATCH,
  preview_sha256_matches_manifest: FAILURE_CLASS.PREVIEW_HASH_MISMATCH,
  failure_review_final_route_matches: FAILURE_CLASS.CHAIN_RECORD_MISMATCH,
});

function classifyFromMap(failures, labelMap, fallback = () => FAILURE_CLASS.OTHER) {
  const classes = new Set();
  for (const failure of failures || []) {
    classes.add(labelMap[failure] || fallback(failure));
  }
  return Array.from(classes).sort();
}

function classifyPreviewFailures(failures) {
  return classifyFromMap(failures, PREVIEW_FAILURE_LABELS);
}

function classifyFailureSampleFailures(failures) {
  return classifyFromMap(failures, {
    ...PREVIEW_FAILURE_LABELS,
    ...FAILURE_SAMPLE_EXTRA_LABELS,
  });
}

function classifyManifestFailures(failures) {
  return classifyFromMap(failures, MANIFEST_FAILURE_LABELS, (failure) => {
    if (failure.endsWith("_exists")) return FAILURE_CLASS.MISSING_CHAIN_FILE;
    if (failure.endsWith("_record_type_matches") || failure.endsWith("_sample_id_matches")) {
      return FAILURE_CLASS.CHAIN_RECORD_MISMATCH;
    }
    if (failure.includes("guard_") || failure.includes("allowed_false") || failure.includes("production_candidate")) {
      return FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION;
    }
    return FAILURE_CLASS.OTHER;
  });
}

function createFailureClassSummary(keys) {
  return Object.fromEntries(keys.map((key) => [key, 0]));
}

function summarizeFailureClasses(samples, failures, keys) {
  const summary = createFailureClassSummary(keys);

  for (const sample of samples) {
    for (const failureClass of sample.failure_classes || []) {
      summary[failureClass] = (summary[failureClass] || 0) + 1;
    }
  }

  for (const failure of failures) {
    if (failure.startsWith("sample_failed:")) {
      summary[FAILURE_CLASS.SAMPLE_FAILED] += 1;
    } else {
      summary[FAILURE_CLASS.REGISTRY_CONFIGURATION] += 1;
    }
  }

  return summary;
}

module.exports = {
  FAILURE_CLASS,
  PREVIEW_FAILURE_CLASS_SUMMARY_KEYS,
  FAILURE_SAMPLE_FAILURE_CLASS_SUMMARY_KEYS,
  MANIFEST_FAILURE_CLASS_SUMMARY_KEYS,
  PREVIEW_FAILURE_LABELS,
  FAILURE_SAMPLE_EXTRA_LABELS,
  MANIFEST_FAILURE_LABELS,
  classifyPreviewFailures,
  classifyFailureSampleFailures,
  classifyManifestFailures,
  createFailureClassSummary,
  summarizeFailureClasses,
};
