#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("../../lib/artifact_recoverability_core");
const {
  SCHEMA_REF,
  loadCapsuleManifestSchema,
  validateSchemaRuntimeBinding,
} = require("../../lib/capsule_manifest_contract");

const root = path.resolve(__dirname, "../../..");
const core = createRecoverabilityCore(root);
const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });

const loaded = loadCapsuleManifestSchema(core, SCHEMA_REF);
const positive = loaded.schema ? validateSchemaRuntimeBinding(loaded.schema) : { passed: false, failures: loaded.failures };
add("schema_file_loads", Boolean(loaded.schema), loaded);
add("schema_runtime_binding_passes", positive.passed, positive.failures);

if (loaded.schema) {
  const manifestTypeDrift = JSON.parse(JSON.stringify(loaded.schema));
  manifestTypeDrift.accepted_manifest_type = "drifted_manifest_type";
  const manifestTypeResult = validateSchemaRuntimeBinding(manifestTypeDrift);
  add("accepted_manifest_type_drift_fails_closed", manifestTypeResult.passed === false && manifestTypeResult.failures.includes("schema_accepted_manifest_type_matches_runtime"), manifestTypeResult.failures);

  const chainDrift = JSON.parse(JSON.stringify(loaded.schema));
  chainDrift.failure_chain_required = ["review_record", "failure_record"];
  const chainResult = validateSchemaRuntimeBinding(chainDrift);
  add("chain_order_or_shape_drift_fails_closed", chainResult.passed === false && chainResult.failures.includes("schema_failure_chain_matches_runtime"), chainResult.failures);

  const guardDrift = JSON.parse(JSON.stringify(loaded.schema));
  guardDrift.manifest_guard_required_false = guardDrift.manifest_guard_required_false.filter((field) => field !== "push_tag_release_deploy_performed");
  const guardResult = validateSchemaRuntimeBinding(guardDrift);
  add("manifest_guard_drift_fails_closed", guardResult.passed === false && guardResult.failures.includes("schema_manifest_guard_fields_match_runtime"), guardResult.failures);

  const topLevelDrift = JSON.parse(JSON.stringify(loaded.schema));
  topLevelDrift.accepted_top_level_required_false = topLevelDrift.accepted_top_level_required_false.filter((field) => field !== "commercial_delivery_allowed");
  const topLevelResult = validateSchemaRuntimeBinding(topLevelDrift);
  add("accepted_top_level_false_drift_fails_closed", topLevelResult.passed === false && topLevelResult.failures.includes("schema_accepted_top_level_false_fields_match_runtime"), topLevelResult.failures);
}

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_capsule_manifest_schema_runtime_binding",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "capsule_manifest_schema_runtime_binding_verified" : "capsule_manifest_schema_runtime_binding_failed",
  schema_ref: SCHEMA_REF,
  check_count: checks.length,
  failed_count: failed.length,
  no_capsule_created: true,
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
  checks,
  failures: failed,
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
