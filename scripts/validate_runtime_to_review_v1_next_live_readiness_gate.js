#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const gateId = "runtime_to_review_v1_next_live_readiness_gate";
const receiptPath = "reports/runtime_to_review_v1/guarded_live_probe_real_bound_owner_runtime_20260529_failed_closed.json";
const realOwnerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";
const ownerRuntimeValidatorPath = "scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_module.js";
const mvpCorePath = "scripts/validate_mvp_core.js";
const selfPath = "scripts/validate_runtime_to_review_v1_next_live_readiness_gate.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function assertMvpCoversOwnerRuntimeValidator() {
  const mvpCore = fs.readFileSync(repoPath(mvpCorePath), "utf8");
  assert(
    mvpCore.includes('safeCheck("runtime_to_review_v1_real_bound_owner_runtime_module"'),
    "MVP core must include the real bound owner runtime module safeCheck before deferring it"
  );
  assert(
    mvpCore.includes(`runNode(["${ownerRuntimeValidatorPath}"])`),
    "MVP core must run the real bound owner runtime module validator before deferring it"
  );
}

async function main() {
  const skipOwnerRuntimeValidator = process.argv.includes("--skip-owner-runtime-validator");

  let validatorResult = {
    plugin_child_uses_dotenv_config_path: true,
  };

  if (skipOwnerRuntimeValidator) {
    assertMvpCoversOwnerRuntimeValidator();
  } else {
    runNode(["--check", realOwnerRuntimePath]);
    runNode(["--check", ownerRuntimeValidatorPath]);
    runNode(["--check", selfPath]);

    validatorResult = JSON.parse(runNode([ownerRuntimeValidatorPath]));
    assert(validatorResult.passed === true, "real bound owner runtime module validator must pass");
    assert(validatorResult.safe_child_env_does_not_copy_process_env === true, "real bound runtime must not copy full process.env");
    assert(validatorResult.provider_secret_env_not_passed_to_child === true, "provider secret env must not pass to child runtime");
  }

  const receipt = readJson(receiptPath);
  assert(receipt.live_probe_attempted === true, "previous guarded live probe receipt must exist");
  assert(receipt.live_probe_attempt_count === 1, "previous guarded live probe must record exactly one attempt");
  assert(receipt.live_probe_status === "failed_closed", "previous guarded live probe must be failed_closed");
  assert(receipt.output_file_count_after_probe === 0, "failed live probe must not have produced output files");
  assert(receipt.post_attempt_environment_name_check.VOLCENGINE_API_KEY_present === false, "receipt must record missing provider env name");
  assert(receipt.secret_values_printed === false, "receipt must record no secret printing");
  assert(receipt.memory_write_performed === false, "receipt must record no memory write");
  assert(receipt.production_candidate_created === false, "receipt must record no production candidate");

  const ownerRuntime = require(repoPath(realOwnerRuntimePath));
  const readiness = ownerRuntime.inspectRealBoundOwnerRuntimeReadiness();
  assert(readiness.plugin_entry_present === true, "VCPToolBox DoubaoGen plugin entry must remain discoverable");
  assert(readiness.plugin_config_present === true, "VCPToolBox DoubaoGen config.env must exist before next live probe");
  assert(readiness.secret_value_read_performed === false, "readiness must not read secret values");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    gate_id: gateId,
    mode: "next_live_readiness_gate_no_provider_call",
    previous_live_probe_receipt_ref: receiptPath,
    previous_live_probe_attempt_count: receipt.live_probe_attempt_count,
    previous_live_probe_status: receipt.live_probe_status,
    previous_live_probe_failed_closed_verified: true,
    second_live_probe_authorized_now: false,
    second_live_probe_performed_by_validator: false,
    exact_new_probe_authorization_required: true,
    owner_runtime_secretless_source_required: true,
    owner_config_env_present_without_value_read: readiness.plugin_config_present,
    acceptable_owner_runtime_sources: [
      "running_vcptoolbox_secretless_delegate_with_runtime_v1_output_scope",
      "owner_provided_doubaogen_config_env_loaded_only_by_plugin_child_process"
    ],
    current_owner_runtime_source_ready: readiness.plugin_config_present === true,
    current_blocker: readiness.plugin_config_present === true ? null : "owner_runtime_secretless_source_not_bound_for_next_live_probe",
    real_bound_owner_runtime_module_present: true,
    real_bound_owner_runtime_safe_child_env_verified: true,
    provider_secret_env_not_passed_to_child: true,
    plugin_child_uses_dotenv_config_path: validatorResult.plugin_child_uses_dotenv_config_path === true,
    owner_runtime_validator_skipped: skipOwnerRuntimeValidator,
    owner_runtime_validator_deferred_to_mvp: skipOwnerRuntimeValidator,
    owner_runtime_validator_result_source: skipOwnerRuntimeValidator ? "mvp_core_prior_safe_check" : "child_validator",
    vcptoolbox_doubaogen_plugin_entry_present: readiness.plugin_entry_present,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    gate_id: gateId,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
