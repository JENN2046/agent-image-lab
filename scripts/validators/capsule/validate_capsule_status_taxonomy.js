#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  FAILURE_CLASS,
  PREVIEW_FAILURE_CLASS_SUMMARY_KEYS,
  FAILURE_SAMPLE_FAILURE_CLASS_SUMMARY_KEYS,
  MANIFEST_FAILURE_CLASS_SUMMARY_KEYS,
  classifyPreviewFailures,
  classifyFailureSampleFailures,
  classifyManifestFailures,
  summarizeFailureClasses,
} = require("../../lib/capsule_status_taxonomy");

const repoRoot = path.resolve(__dirname, "../../..");
const previewValidatorText = fs.readFileSync(
  path.join(repoRoot, "scripts", "validators", "capsule", "validate_preview_capsule_registry.js"),
  "utf8"
);
const failureValidatorText = fs.readFileSync(path.join(repoRoot, "scripts", "validate_failure_sample_capsule_registry.js"), "utf8");
const manifestContractText = fs.readFileSync(path.join(repoRoot, "scripts", "lib", "capsule_manifest_contract.js"), "utf8");

function expect(condition, check, detail = null) {
  return { check, passed: Boolean(condition), ...(detail === null ? {} : { detail }) };
}

const checks = [];

checks.push(expect(previewValidatorText.includes("classifyPreviewFailures"), "preview_validator_uses_shared_taxonomy"));
checks.push(expect(failureValidatorText.includes("classifyFailureSampleFailures"), "failure_validator_uses_shared_taxonomy"));
checks.push(expect(manifestContractText.includes("classifyManifestFailures"), "manifest_contract_uses_shared_taxonomy"));
checks.push(expect(!previewValidatorText.includes("function classifyFailures"), "preview_validator_local_classifier_removed"));
checks.push(expect(!failureValidatorText.includes("function classifyFailures"), "failure_validator_local_classifier_removed"));
checks.push(expect(!manifestContractText.includes("function classifyFailures"), "manifest_contract_local_classifier_removed"));
checks.push(expect(PREVIEW_FAILURE_CLASS_SUMMARY_KEYS.includes(FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH), "preview_summary_keys_include_manifest_contract"));
checks.push(expect(!PREVIEW_FAILURE_CLASS_SUMMARY_KEYS.includes(FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION), "preview_summary_keys_omit_failure_only_guard_class"));
checks.push(expect(FAILURE_SAMPLE_FAILURE_CLASS_SUMMARY_KEYS.includes(FAILURE_CLASS.CHAIN_RECORD_MISMATCH), "failure_summary_keys_include_chain_mismatch"));
checks.push(expect(FAILURE_SAMPLE_FAILURE_CLASS_SUMMARY_KEYS.includes(FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION), "failure_summary_keys_include_guard_violation"));
checks.push(expect(MANIFEST_FAILURE_CLASS_SUMMARY_KEYS.includes(FAILURE_CLASS.CHAIN_RECORD_MISMATCH), "manifest_summary_keys_include_chain_mismatch"));
checks.push(expect(MANIFEST_FAILURE_CLASS_SUMMARY_KEYS.includes(FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION), "manifest_summary_keys_include_guard_violation"));

const previewClasses = classifyPreviewFailures([
  "manifest_exists",
  "preview_file_exists",
  "preview_sha256_matches_manifest",
  "base64_absent_from_manifest",
]);
checks.push(expect(previewClasses.includes(FAILURE_CLASS.MISSING_CAPSULE_MANIFEST), "preview_manifest_missing_classified", previewClasses));
checks.push(expect(previewClasses.includes(FAILURE_CLASS.MISSING_PREVIEW_FILE), "preview_missing_file_classified", previewClasses));
checks.push(expect(previewClasses.includes(FAILURE_CLASS.PREVIEW_HASH_MISMATCH), "preview_hash_mismatch_classified", previewClasses));
checks.push(expect(previewClasses.includes(FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH), "preview_contract_mismatch_classified", previewClasses));

const failureClasses = classifyFailureSampleFailures([
  "failure_record_sample_id_matches",
  "review_record_no_vcp_memory_write",
  "DailyNote_write_allowed_false",
  "original_sha256_not_required",
]);
checks.push(expect(failureClasses.includes(FAILURE_CLASS.CHAIN_RECORD_MISMATCH), "failure_chain_record_mismatch_classified", failureClasses));
checks.push(expect(failureClasses.includes(FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION), "failure_guard_violation_classified", failureClasses));
checks.push(expect(failureClasses.includes(FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH), "failure_manifest_contract_mismatch_classified", failureClasses));

const manifestClasses = classifyManifestFailures([
  "manifest_exists",
  "manifest_type_matches",
  "approval_record_exists",
  "review_record_sample_id_matches",
  "manifest_guard_VCP_memory_write_performed_false",
  "commercial_delivery_allowed_false",
]);
checks.push(expect(manifestClasses.includes(FAILURE_CLASS.MISSING_CAPSULE_MANIFEST), "manifest_missing_classified", manifestClasses));
checks.push(expect(manifestClasses.includes(FAILURE_CLASS.MANIFEST_CONTRACT_MISMATCH), "manifest_contract_mismatch_classified", manifestClasses));
checks.push(expect(manifestClasses.includes(FAILURE_CLASS.MISSING_CHAIN_FILE), "manifest_missing_chain_classified", manifestClasses));
checks.push(expect(manifestClasses.includes(FAILURE_CLASS.CHAIN_RECORD_MISMATCH), "manifest_chain_record_mismatch_classified", manifestClasses));
checks.push(expect(manifestClasses.includes(FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION), "manifest_guard_violation_classified", manifestClasses));

const summary = summarizeFailureClasses(
  [
    { failure_classes: [FAILURE_CLASS.CHAIN_RECORD_MISMATCH, FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION] },
    { failure_classes: [FAILURE_CLASS.MISSING_PREVIEW_FILE] },
  ],
  ["sample_failed:sample_a", "unsupported_mode:bad"],
  FAILURE_SAMPLE_FAILURE_CLASS_SUMMARY_KEYS
);
checks.push(expect(summary.chain_record_mismatch === 1, "summary_counts_chain_mismatch", summary));
checks.push(expect(summary.production_or_memory_guard_violation === 1, "summary_counts_guard_violation", summary));
checks.push(expect(summary.missing_preview_file === 1, "summary_counts_missing_preview_file", summary));
checks.push(expect(summary.sample_failed === 1, "summary_counts_sample_failed", summary));
checks.push(expect(summary.registry_configuration === 1, "summary_counts_registry_configuration", summary));

const manifestSummary = summarizeFailureClasses(
  [
    { failure_classes: [FAILURE_CLASS.MISSING_CAPSULE_MANIFEST, FAILURE_CLASS.CHAIN_RECORD_MISMATCH] },
    { failure_classes: [FAILURE_CLASS.PRODUCTION_OR_MEMORY_GUARD_VIOLATION] },
  ],
  [],
  MANIFEST_FAILURE_CLASS_SUMMARY_KEYS
);
checks.push(expect(manifestSummary.missing_capsule_manifest === 1, "manifest_summary_counts_missing_manifest", manifestSummary));
checks.push(expect(manifestSummary.chain_record_mismatch === 1, "manifest_summary_counts_chain_mismatch", manifestSummary));
checks.push(expect(manifestSummary.production_or_memory_guard_violation === 1, "manifest_summary_counts_guard_violation", manifestSummary));

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_capsule_status_taxonomy",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0
    ? "capsule_status_taxonomy_verified"
    : "capsule_status_taxonomy_failed",
  check_count: checks.length,
  failed_count: failed.length,
  taxonomy_shared_by_registry_validators: failed.length === 0,
  writes_performed: false,
  preview_creation_or_copy_performed: false,
  image_generation_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  runtime_execution_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  production_candidate_write_performed: false,
  push_tag_release_deploy_performed: false,
  checks,
  failures: failed,
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
process.exit(output.passed ? 0 : 1);
