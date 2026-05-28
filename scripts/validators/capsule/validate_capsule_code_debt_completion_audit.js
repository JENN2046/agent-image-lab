#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function expect(condition, check, detail = null) {
  return { check, passed: Boolean(condition), ...(detail === null ? {} : { detail }) };
}

const files = {
  audit: "docs/CAPSULE_CODE_DEBT_AUDIT.md",
  mvpHelper: "scripts/validate_mvp_capsule_product_core.ps1",
  creatorCommon: "scripts/lib/capsule_creator_common.js",
  registryCommon: "scripts/lib/capsule_registry_source_common.js",
  acceptedRegistry: "scripts/lib/accepted_sample_registry_source.js",
  failureRegistry: "scripts/lib/failure_sample_registry_source.js",
  taxonomy: "scripts/lib/capsule_status_taxonomy.js",
  manifestContract: "scripts/lib/capsule_manifest_contract.js",
  reportV2: "scripts/validators/capsule/validate_capsule_registry_report_v2.js",
  failureCreator: "scripts/create_failure_sample_capsule.js",
};

const text = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, exists(file) ? read(file) : ""]));
const checks = [];

checks.push(expect(text.mvpHelper.includes("Invoke-CapsuleProductCoreValidation"), "mvp_validator_slice_present"));
checks.push(expect(text.creatorCommon.includes("createCapsuleCreatorCommon"), "creator_common_helper_present"));
checks.push(expect(text.failureRegistry.includes("parseCommonRegistryRows"), "failure_registry_uses_common_parser"));
checks.push(expect(text.acceptedRegistry.includes("parseCommonRegistryRows"), "accepted_registry_uses_common_parser"));
checks.push(expect(text.taxonomy.includes("classifyManifestFailures"), "manifest_taxonomy_present"));
checks.push(expect(!text.manifestContract.includes("function classifyFailures"), "manifest_local_classifier_removed"));
checks.push(expect(text.manifestContract.includes("createFailureClassSummary"), "manifest_summary_key_stability_present"));
checks.push(expect(text.reportV2.includes("FAILURE_CLASS."), "report_v2_uses_shared_taxonomy_constants"));
checks.push(expect(text.failureCreator.includes("createCapsuleCreatorCommon"), "failure_creator_common_helper_preserved"));
checks.push(expect(text.mvpHelper.includes("Invoke-CapsuleNodeJsonValidator"), "mvp_helper_json_runner_present"));
checks.push(expect(text.mvpHelper.includes("Test-CapsuleNoExternalActionFlags"), "mvp_helper_no_external_guard_present"));
checks.push(expect(text.audit.includes("P1-1") && text.audit.includes("P3-1"), "original_audit_reference_present"));

const completed = [
  "capsule_mvp_validator_slice_gate",
  "capsule_creator_shared_utils_gate",
  "failure_registry_yaml_parser_alignment_gate",
  "capsule_status_taxonomy_index_gate",
  "capsule_manifest_taxonomy_gate",
  "capsule_manifest_summary_key_stability",
  "registry_source_common_parser_gate",
  "registry_report_v2_taxonomy_alignment",
];

const remaining = [
  "PowerShell product-core validator runner can be further generalized across the whole helper",
  "failure capsule creator can be formatted mechanically when a formatter gate is approved",
  "Review Console static contract slicing remains deferred",
  "package script index remains deferred because package.json changes are outside the current dependency-safe slice",
];

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_capsule_code_debt_completion_audit",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0
    ? "capsule_code_debt_completion_audit_verified"
    : "capsule_code_debt_completion_audit_failed",
  check_count: checks.length,
  failed_count: failed.length,
  completed_code_debt_items: completed,
  remaining_code_debt_items: remaining,
  docs_pile_created: false,
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
