#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validatorId = "runtime_to_review_v1_owner_runtime_binding_contract";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_owner_runtime_binding_contract.js";

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

async function main() {
  runNode(["--check", runnerPath]);
  runNode(["--check", delegatePath]);
  runNode(["--check", ownerRuntimePath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_owner_runtime_binding_contract.js"]);

  const runner = require(repoPath(runnerPath));
  const ownerRuntimeModule = require(repoPath(ownerRuntimePath));
  assert(typeof ownerRuntimeModule.createSecretlessProviderRuntime === "function", "owner runtime module factory missing");
  assert(ownerRuntimeModule.contractId === "native_doubao_runtime_v1_owner_runtime_binding_contract", "owner runtime contract id mismatch");

  const exactPreflight = runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: runner.exactConfirmation,
  });
  assert(exactPreflight.passed === true, "delegate + owner runtime + exact phrase should pass preflight");

  const wrongPhrasePreflight = runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: "WRONG_CONFIRMATION",
  });
  assert(wrongPhrasePreflight.passed === false, "wrong exact phrase must block owner runtime binding preflight");

  const missingOwnerPreflight = runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: "adapters/runtime/missing_owner_runtime.js",
    confirm_live_provider_probe: runner.exactConfirmation,
  });
  assert(missingOwnerPreflight.passed === false, "missing owner runtime module must fail preflight");

  const noProviderProbe = await runner.runLiveProbe({
    input: runner.defaultInput,
    max_images: 1,
    preflight_only: false,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: runner.exactConfirmation,
  });
  assert(noProviderProbe.passed === false, "no-provider owner runtime contract must not claim live success");
  assert(noProviderProbe.status === "failed_closed", "no-provider owner runtime contract must fail closed");
  assert(noProviderProbe.runtime_result.stop_reason === "provider_delegate_result_invalid", "runtime should reject no-provider contract as provider success");
  assert(noProviderProbe.runtime_result.side_effect_flags.provider_contact_performed === false, "no-provider contract must not contact provider");
  assert(noProviderProbe.runtime_result.side_effect_flags.plugin_call_performed === false, "no-provider contract must not call plugin");
  assert(noProviderProbe.runtime_result.side_effect_flags.api_call_performed === false, "no-provider contract must not call API");
  assert(noProviderProbe.runtime_result.side_effect_flags.image_generation_performed === false, "no-provider contract must not generate image");
  assert(noProviderProbe.secret_value_read_performed_by_runner === false, "runner must not read secret values");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: validatorId,
    runner: runnerPath,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    exact_confirmation_required: runner.exactConfirmation,
    exact_owner_runtime_preflight_passed: true,
    wrong_phrase_blocked: true,
    missing_owner_runtime_module_blocked: true,
    no_provider_contract_probe_status: noProviderProbe.status,
    no_provider_contract_failed_closed: true,
    live_provider_success_claimed: false,
    real_provider_call_performed: false,
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
    validator: validatorId,
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
