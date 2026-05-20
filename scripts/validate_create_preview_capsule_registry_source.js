#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");
const { loadAcceptedSampleFromRegistry } = require("./lib/accepted_sample_registry_source");
const { resolveSampleFromRegistry, validateCliAgainstRegistry, planOnly } = require("./create_preview_capsule");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);
const sourceText = fs.readFileSync(path.join(root, "scripts", "create_preview_capsule.js"), "utf8");
const registrySourceText = fs.readFileSync(path.join(root, "scripts", "lib", "accepted_sample_registry_source.js"), "utf8");
const creatorCommonText = fs.readFileSync(path.join(root, "scripts", "lib", "capsule_creator_common.js"), "utf8");
const failureCreatorText = fs.readFileSync(path.join(root, "scripts", "create_failure_sample_capsule.js"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });

add("hardcoded_samples_table_removed", !sourceText.includes("const SAMPLES"));
add("creator_uses_registry_source_lib", sourceText.includes("loadAcceptedSampleFromRegistry"));
add("registry_source_uses_yaml_parser", registrySourceText.includes('require("yaml")') && registrySourceText.includes("YAML.parse"));
add("registry_source_no_sample_id_block_regex", !registrySourceText.includes("line.match(/^\\s*-\\s+sample_id"));
add("creator_preserves_temp_dir_rename", sourceText.includes("tempTargetRoot") && sourceText.includes("renamePath") && creatorCommonText.includes("fs.renameSync"));
add("creator_uses_common_safety_helper", sourceText.includes("createCapsuleCreatorCommon"));
add("creator_exports_dry_run_functions", sourceText.includes("module.exports") && sourceText.includes("resolveSampleFromRegistry"));
add("creator_requires_confirm_create", sourceText.includes("confirm-create") && sourceText.includes("planOnly(sample)"));
add("target_dir_existing_is_blocked", sourceText.includes("assertTargetClean") && creatorCommonText.includes("target capsule directory already exists"));
add("failure_creator_target_dir_existing_is_blocked", failureCreatorText.includes("assertTargetClean") && creatorCommonText.includes("target capsule directory already exists"));
add("npm_default_script_is_plan_only", packageJson.scripts["create-preview-capsule"] === "node scripts/create_preview_capsule.js");
add("npm_confirmed_script_is_explicit", packageJson.scripts["create-preview-capsule:confirmed"] === "node scripts/create_preview_capsule.js --confirm-create=true");

const sample = resolveSampleFromRegistry("accepted_french_summer_rattan_bucket_bag_001");
add("known_sample_resolves_from_registry", sample.sampleId === "accepted_french_summer_rattan_bucket_bag_001", sample);
add("sample_target_root_derived_from_sample_id", sample.targetRoot === "asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001", sample.targetRoot);
add("sample_source_image_from_registry", sample.sourceImage === "runs/real_generation/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_run/native_doubao_1778327047448_0.jpg", sample.sourceImage);
add("sample_category_ref_from_registry", sample.categoryRef === "accepted_samples/categories/fashion_lifestyle_still_life.yaml", sample.categoryRef);
add("sample_long_edge_default_512", sample.requiredLongEdge === 512, sample.requiredLongEdge);
const plan = planOnly(sample);
add("default_mode_plan_only", plan.mode === "plan_only" && plan.writes_performed === false && plan.confirm_create_required === true, plan);
add("plan_only_reports_existing_target_without_writing", plan.target_root_exists === true && plan.preview_creation_or_copy_performed !== true, plan);

try {
  resolveSampleFromRegistry("unknown_registry_sample_001");
  add("unknown_sample_fails_closed", false);
} catch (error) {
  add("unknown_sample_fails_closed", /sample not found/.test(error.message), error.message);
}

try {
  validateCliAgainstRegistry(sample, "runs/wrong/source.png", null);
  add("source_mismatch_fails_closed", false);
} catch (error) {
  add("source_mismatch_fails_closed", /source image does not match accepted registry image_path/.test(error.message), error.message);
}

try {
  validateCliAgainstRegistry(sample, null, "1024");
  add("long_edge_mismatch_fails_closed", false);
} catch (error) {
  add("long_edge_mismatch_fails_closed", /long edge does not match accepted registry preview long_edge/.test(error.message), error.message);
}

try {
  loadAcceptedSampleFromRegistry(core, "accepted_product_still_life_tennis_wallet_001", { registryRef: "missing_registry.yaml" });
  add("missing_registry_fails_closed", false);
} catch (error) {
  add("missing_registry_fails_closed", /registry missing/.test(error.message), error.message);
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_create_preview_capsule_registry_source",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "create_preview_capsule_registry_source_verified" : "create_preview_capsule_registry_source_failed",
  check_count: checks.length,
  failed_count: failed.length,
  registry_driven_source: true,
  hardcoded_samples_table_present: sourceText.includes("const SAMPLES"),
  real_capsule_created: false,
  preview_creation_or_copy_performed: false,
  image_generation_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  checks,
  failures: failed,
};
console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
