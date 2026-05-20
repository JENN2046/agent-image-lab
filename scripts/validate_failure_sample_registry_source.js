#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  FAILURE_REGISTRY_REF,
  FAILURE_CAPSULE_ROOT,
  DEFAULT_LONG_EDGE,
  parseRegistryRows,
  loadFailureSampleFromRegistry,
} = require("./lib/failure_sample_registry_source");

const repoRoot = path.resolve(__dirname, "..");
const creatorText = fs.readFileSync(path.join(repoRoot, "scripts", "create_failure_sample_capsule.js"), "utf8");
const registrySourceText = fs.readFileSync(path.join(repoRoot, "scripts", "lib", "failure_sample_registry_source.js"), "utf8");
const registryCommonText = fs.readFileSync(path.join(repoRoot, "scripts", "lib", "capsule_registry_source_common.js"), "utf8");
const registryText = fs.readFileSync(path.join(repoRoot, FAILURE_REGISTRY_REF), "utf8");

const reader = {
  exists(relativePath) {
    return fs.existsSync(path.join(repoRoot, relativePath));
  },
  readText(relativePath) {
    return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
  },
};

function expect(condition, check, detail = null) {
  return { check, passed: Boolean(condition), ...(detail === null ? {} : { detail }) };
}

const checks = [];

checks.push(expect(registrySourceText.includes("parseCommonRegistryRows"), "failure_registry_source_uses_common_parser"));
checks.push(expect(registryCommonText.includes('require("yaml")'), "registry_common_source_uses_yaml_package"));
checks.push(expect(registryCommonText.includes("YAML.parse"), "registry_common_source_uses_yaml_parse"));
checks.push(expect(!registrySourceText.includes("new RegExp"), "failure_registry_source_no_regex_field_parser"));
checks.push(expect(!creatorText.includes("function parseScalar"), "failure_creator_scalar_regex_removed"));
checks.push(expect(!creatorText.includes("function parseList"), "failure_creator_list_regex_removed"));
checks.push(expect(!creatorText.includes("extractFailureBlock"), "failure_creator_block_scanner_removed"));
checks.push(expect(creatorText.includes("loadFailureSampleFromRegistry"), "failure_creator_uses_registry_source_lib"));

const rows = parseRegistryRows(registryText);
checks.push(expect(rows.length === 3, "registry_rows_parse_expected_count", rows.map((row) => row.failure_id)));
checks.push(expect(rows.every((row) => typeof row.failure_id === "string" && row.failure_id.length > 0), "registry_rows_have_failure_ids"));

const sample = loadFailureSampleFromRegistry(reader, "failure_french_summer_rattan_bag_v7_29_001");
checks.push(expect(sample.sampleId === "failure_french_summer_rattan_bag_v7_29_001", "known_failure_sample_resolves", sample));
checks.push(expect(sample.source === "failure_sample_registry", "sample_source_marked_registry", sample.source));
checks.push(expect(sample.targetRoot === `${FAILURE_CAPSULE_ROOT}/failure_french_summer_rattan_bag_v7_29_001`, "sample_target_root_derived_from_failure_id", sample.targetRoot));
checks.push(expect(sample.sourceImage === "runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg", "sample_image_path_from_registry", sample.sourceImage));
checks.push(expect(sample.reviewDocRef === "docs/285_v7_30_native_doubao_watermark_parameter_enforcement.md", "sample_review_doc_from_registry", sample.reviewDocRef));
checks.push(expect(sample.promptPackageRef === "prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2.yaml", "sample_prompt_package_from_registry", sample.promptPackageRef));
checks.push(expect(sample.requiredLongEdge === DEFAULT_LONG_EDGE && DEFAULT_LONG_EDGE === 512, "sample_default_long_edge_512", sample.requiredLongEdge));
checks.push(expect(Array.isArray(sample.failureTags) && sample.failureTags.length === 4, "sample_failure_tags_structured_list", sample.failureTags));
checks.push(expect(sample.registryFailureBlock.includes("failure_id: failure_french_summer_rattan_bag_v7_29_001"), "sample_registry_block_preserved"));

try {
  loadFailureSampleFromRegistry(reader, "not_authorized_failure_sample");
  checks.push(expect(false, "unknown_failure_sample_fails_closed"));
} catch (error) {
  checks.push(expect(/failure sample not found/.test(error.message), "unknown_failure_sample_fails_closed", error.message));
}

try {
  loadFailureSampleFromRegistry(reader, "failure_french_summer_rattan_bag_v7_29_001", { registryRef: "missing_failure_registry.yaml" });
  checks.push(expect(false, "missing_failure_registry_fails_closed"));
} catch (error) {
  checks.push(expect(/failure sample registry missing/.test(error.message), "missing_failure_registry_fails_closed", error.message));
}

const duplicateRegistry = registryText.replace(
  "failure_count: 3",
  "failure_count: 4"
).replace(
  "    - failure_id: failure_french_summer_rattan_bag_v7_29_001",
  "    - failure_id: failure_french_summer_rattan_bag_v7_29_001\n      source_phase: v_synthetic_duplicate\n      asset_status: needs_human_review\n      provider_type: direct_api\n      plugin_id: NativeDoubaoImage\n      model: doubao-seedream-5-0-260128\n      prompt_package_ref: prompts/example.yaml\n      review_doc_ref: docs/example.md\n      image_path: runs/example.jpg\n      failure_tags:\n        - duplicate_guard\n      image_file_committed_to_git: false\n      memory_suitability: false\n\n    - failure_id: failure_french_summer_rattan_bag_v7_29_001"
);

try {
  loadFailureSampleFromRegistry({
    exists(relativePath) {
      return relativePath === FAILURE_REGISTRY_REF;
    },
    readText() {
      return duplicateRegistry;
    },
  }, "failure_french_summer_rattan_bag_v7_29_001");
  checks.push(expect(false, "duplicate_failure_id_fails_closed"));
} catch (error) {
  checks.push(expect(/duplicate failure_id/.test(error.message), "duplicate_failure_id_fails_closed", error.message));
}

const memoryWriteRegistry = registryText.replace("memory_write_allowed: false", "memory_write_allowed: true");
try {
  loadFailureSampleFromRegistry({
    exists(relativePath) {
      return relativePath === FAILURE_REGISTRY_REF;
    },
    readText() {
      return memoryWriteRegistry;
    },
  }, "failure_french_summer_rattan_bag_v7_29_001");
  checks.push(expect(false, "registry_memory_write_true_fails_closed"));
} catch (error) {
  checks.push(expect(/registry_field_not_false:memory_write_allowed/.test(error.message), "registry_memory_write_true_fails_closed", error.message));
}

const sampleMemoryRegistry = registryText.replace("memory_suitability: false", "memory_suitability: true");
try {
  loadFailureSampleFromRegistry({
    exists(relativePath) {
      return relativePath === FAILURE_REGISTRY_REF;
    },
    readText() {
      return sampleMemoryRegistry;
    },
  }, "failure_tennis_wallet_v7_21_001");
  checks.push(expect(false, "sample_memory_suitability_true_fails_closed"));
} catch (error) {
  checks.push(expect(/sample_field_not_false:memory_suitability/.test(error.message), "sample_memory_suitability_true_fails_closed", error.message));
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_failure_sample_registry_source",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0
    ? "failure_sample_registry_source_verified"
    : "failure_sample_registry_source_failed",
  check_count: checks.length,
  failed_count: failed.length,
  registry_driven_source: true,
  yaml_parser_aligned_with_accepted_lane: failed.length === 0,
  shared_registry_source_common: failed.length === 0,
  real_capsule_created: false,
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
