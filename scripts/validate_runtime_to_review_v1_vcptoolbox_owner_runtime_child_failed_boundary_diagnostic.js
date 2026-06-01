#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_vcptoolbox_owner_runtime_child_failed_boundary_diagnostic";
const diagnosticPath = "reports/runtime_to_review_v1/vcptoolbox_owner_runtime_child_failed_boundary_diagnostic_20260601.json";
const receiptPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601_attempt_002.json";
const artifactPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_artifact_record_20260601_attempt_002.json";
const serumOwnerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_serum_bottle_owner_runtime.js";
const childPath = "scripts/vcptoolbox_doubao_owner_runtime_child.js";
const packageScriptName = "validate:runtime-to-review-vcptoolbox-child-failed-boundary";
const manifestId = "runtime_to_review_vcptoolbox_owner_runtime_child_failed_boundary";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function includesAll(values, expectedValues) {
  return Array.isArray(values) && expectedValues.every((value) => values.includes(value));
}

function allFalse(object) {
  return object && Object.values(object).every((value) => value === false);
}

function main() {
  const diagnostic = readJson(diagnosticPath);
  const receipt = readJson(receiptPath);
  const artifact = readJson(artifactPath);
  const serumOwnerSource = fs.readFileSync(repoPath(serumOwnerRuntimePath), "utf8");
  const childSource = fs.readFileSync(repoPath(childPath), "utf8");
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  check("diagnostic_is_non_executing", () =>
    diagnostic.schema === "runtime_to_review_v1_vcptoolbox_owner_runtime_child_failed_boundary_diagnostic.v1" &&
    diagnostic.status === "completed_local_diagnostic_no_live_probe" &&
    diagnostic.source_blocker === "runtime_bridge_blocker:vcptoolbox_owner_runtime_child_failed" &&
    diagnostic.conclusion.new_trial_authorized_now === false &&
    diagnostic.conclusion.future_live_probe_requires_new_exact_activation === true &&
    allFalse(diagnostic.actions_not_performed)
  );
  check("source_refs_are_exact", () => includesAll(diagnostic.source_refs, [
    receiptPath,
    artifactPath,
    serumOwnerRuntimePath,
    "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js",
    childPath,
  ]));
  check("attempt_002_boundary_matches_receipt", () =>
    receipt.status === "failed_closed" &&
    receipt.stop_reason === "provider_delegate_result_invalid" &&
    receipt.failure_category === "vcptoolbox_owner_runtime_child_failed_closed" &&
    receipt.provider_contact_performed === false &&
    receipt.plugin_call_performed === true &&
    receipt.api_call_performed === false &&
    receipt.image_generation_performed === false &&
    receipt.calls_used.provider === 0 &&
    receipt.calls_used.plugin === 0 &&
    receipt.calls_used.api === 0 &&
    receipt.image_count === 0 &&
    receipt.directory_creation_performed === true &&
    artifact.output_directory_created === true &&
    artifact.output_directory_entry_count === 0
  );
  check("diagnostic_boundary_preserves_no_live_probe", () =>
    diagnostic.observed_attempt_002_boundary.prior_output_directory_binding_blocker_resolved === true &&
    diagnostic.observed_attempt_002_boundary.provider_contact_performed === false &&
    diagnostic.observed_attempt_002_boundary.plugin_call_performed === true &&
    diagnostic.observed_attempt_002_boundary.api_call_performed === false &&
    diagnostic.observed_attempt_002_boundary.image_generation_performed === false &&
    diagnostic.current_failure_boundary_summary.not_a_provider_api_failure_yet === true &&
    diagnostic.current_failure_boundary_summary.not_an_output_directory_binding_failure_anymore === true
  );
  check("serum_runtime_preserves_child_config_key_precision", () =>
    serumOwnerSource.includes("vcptoolbox_owner_runtime_child_failed_config_key_present") &&
    serumOwnerSource.includes("vcptoolbox_owner_runtime_child_failed_config_key_missing") &&
    serumOwnerSource.includes("parsed.provider_config_key_present === true") &&
    serumOwnerSource.includes("parsed.provider_config_key_present === false")
  );
  check("child_reports_key_presence_without_value", () =>
    childSource.includes("provider_config_key_present") &&
    childSource.includes("Boolean(process.env.VOLCENGINE_API_KEY)") &&
    !childSource.includes("process.stdout.write(process.env.VOLCENGINE_API_KEY")
  );
  check("future_activation_boundary_is_explicit", () =>
    diagnostic.next_live_attempt_boundary.new_exact_owner_activation_required === true &&
    diagnostic.next_live_attempt_boundary.required_owner_confirmation_phrase === "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE" &&
    diagnostic.next_live_attempt_boundary.runner_confirmation_phrase_still_required === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE" &&
    diagnostic.next_live_attempt_boundary.max_live_probe_attempts === 1 &&
    diagnostic.next_live_attempt_boundary.max_images === 1 &&
    diagnostic.next_live_attempt_boundary.retry_allowed === false
  );
  check("stop_conditions_block_live_probe_and_secret_reads", () =>
    diagnostic.stop_conditions.includes("attempting to treat this diagnostic as an activation packet") &&
    diagnostic.stop_conditions.includes("running scripts/run_runtime_to_review_v1_guarded_live_probe.js without a new exact owner activation") &&
    diagnostic.stop_conditions.includes("reading config.env or any secret value")
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_vcptoolbox_owner_runtime_child_failed_boundary_diagnostic.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_vcptoolbox_owner_runtime_child_failed_boundary_diagnostic.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      includesAll(entry.trigger_paths, [
        diagnosticPath,
        receiptPath,
        artifactPath,
        serumOwnerRuntimePath,
        childPath,
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_vcptoolbox_owner_runtime_child_failed_boundary_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    diagnostic: diagnosticPath,
    source_blocker: diagnostic.source_blocker,
    live_probe_performed: false,
    child_diagnostic_only_process_executed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
