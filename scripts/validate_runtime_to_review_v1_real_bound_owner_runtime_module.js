#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validatorId = "runtime_to_review_v1_real_bound_owner_runtime_module";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";

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
  runNode(["--check", "scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_module.js"]);

  const runner = require(repoPath(runnerPath));
  const ownerRuntimeModule = require(repoPath(ownerRuntimePath));
  assert(typeof ownerRuntimeModule.createSecretlessProviderRuntime === "function", "real owner runtime factory missing");
  assert(ownerRuntimeModule.moduleId === "native_doubao_runtime_v1_real_bound_owner_runtime", "real owner runtime module id mismatch");
  assert(ownerRuntimeModule.allowedOutputDirectory === "runs/real_generation/runtime_to_review_v1_guarded_live_probe/", "allowed output directory mismatch");
  assert(ownerRuntimeModule.allowedPromptPackageRef === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml", "allowed prompt package mismatch");
  assert(ownerRuntimeModule.requiredModel === "doubao-seedream-5-0-260128", "required model mismatch");
  assert(typeof ownerRuntimeModule.buildSafeChildEnv === "function", "safe child env builder missing");
  const ownerRuntimeSource = fs.readFileSync(repoPath(ownerRuntimePath), "utf8");
  assert(!ownerRuntimeSource.includes("...process.env"), "real owner runtime must not copy full process.env into child runtime");

  const readiness = ownerRuntimeModule.inspectRealBoundOwnerRuntimeReadiness();
  assert(readiness.plugin_entry_present === true, "VCPToolBox DoubaoGen plugin entry must be present");
  assert(readiness.plugin_manifest_present === true, "VCPToolBox DoubaoGen plugin manifest must be present");
  assert(readiness.env_file_content_read_performed === false, "readiness must not read env file content");
  assert(readiness.secret_value_read_performed === false, "readiness must not read secret values");
  assert(readiness.config_env_read_performed === false, "readiness must not read config.env");

  const exactPreflight = runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: runner.exactConfirmation,
  });
  assert(exactPreflight.passed === true, "delegate + real owner runtime + exact phrase should pass preflight");

  const wrongPhrasePreflight = runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: "WRONG_CONFIRMATION",
  });
  assert(wrongPhrasePreflight.passed === false, "wrong exact phrase must block real owner runtime preflight");

  const runtime = ownerRuntimeModule.createSecretlessProviderRuntime();
  assert(typeof runtime === "function", "real owner runtime bridge must be callable");
  assert(runtime.secretless_provider_runtime_delegate_bound === true, "real owner runtime bridge must be bound");
  assert(runtime.secretless_provider_runtime_bridge_id, "real owner runtime bridge id missing");
  const safeEnv = ownerRuntimeModule.buildSafeChildEnv({
    PATH: "path-ok",
    VOLCENGINE_API_KEY: "must-not-pass",
    SECRET_TOKEN: "must-not-pass",
  });
  assert(safeEnv.PATH === "path-ok", "safe env should preserve PATH");
  assert(!Object.prototype.hasOwnProperty.call(safeEnv, "VOLCENGINE_API_KEY"), "safe env must not pass provider API key");
  assert(!Object.prototype.hasOwnProperty.call(safeEnv, "SECRET_TOKEN"), "safe env must not pass arbitrary secret token");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: validatorId,
    runner: runnerPath,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    exact_confirmation_required: runner.exactConfirmation,
    real_owner_runtime_module_present: true,
    real_owner_runtime_bridge_bound: true,
    exact_owner_runtime_preflight_passed: true,
    wrong_phrase_blocked: true,
    readiness_checked_without_secret_read: true,
    safe_child_env_does_not_copy_process_env: true,
    provider_secret_env_not_passed_to_child: true,
    vcp_toolbox_plugin_entry_present: readiness.plugin_entry_present,
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
