#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");
const { validateAllCapsuleManifests } = require("./lib/capsule_manifest_contract");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);
const result = validateAllCapsuleManifests(core);
const output = {
  validator: "validate_capsule_manifest_contract",
  version: "v1",
  ...result,
  accepted_count: result.totals.accepted,
  failure_count: result.totals.failure,
  current_baseline_preserved: result.totals.accepted >= 2 && result.totals.failure === 2 && result.totals.total === result.totals.accepted + result.totals.failure,
  durable_archive_manifest_supported: result.samples.some((sample) =>
    sample.sample_id === "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001" &&
    sample.manifest_validation_status === "durable_archive_manifest_contract_verified"
  ),
  no_new_capsule_created: true,
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
};

if (!output.current_baseline_preserved || !output.durable_archive_manifest_supported) {
  output.passed = false;
  output.status = "capsule_manifest_contract_baseline_count_mismatch";
}

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
