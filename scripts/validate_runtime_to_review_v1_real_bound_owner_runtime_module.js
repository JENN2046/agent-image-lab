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
const ownerRuntimeChildPath = "scripts/vcptoolbox_doubao_owner_runtime_child.js";

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
  runNode(["--check", ownerRuntimeChildPath]);
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
  assert(ownerRuntimeSource.includes("vcptoolbox_doubao_owner_runtime_child.js"), "real owner runtime must use VCPToolBox owner runtime child");
  const childSource = fs.readFileSync(repoPath(ownerRuntimeChildPath), "utf8");
  assert(childSource.includes("diagnosticOnly"), "owner runtime child must expose diagnosticOnly mode");
  assert(childSource.includes("dotenv.config"), "owner runtime child must load plugin config inside the child process");
  assert(childSource.includes("\"Plugin\", \"DoubaoGen\", \"config.env\""), "owner runtime child must use DoubaoGen config.env path");
  assert(childSource.includes("provider_config_key_present"), "owner runtime child must report config key presence without exposing values");
  assert(ownerRuntimeSource.includes("config_key_present"), "real owner runtime must preserve child config-key blocker precision");
  assert(ownerRuntimeSource.includes("outputRefWithObservedExtension"), "real owner runtime must normalize output extension from observed format");
  assert(ownerRuntimeSource.includes("extension_normalized_from"), "real owner runtime must record extension normalization source");

  const readiness = ownerRuntimeModule.inspectRealBoundOwnerRuntimeReadiness();
  assert(readiness.plugin_entry_present === true, "VCPToolBox DoubaoGen plugin entry must be present");
  assert(readiness.plugin_config_present === true, "VCPToolBox DoubaoGen plugin config.env must be present");
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
  assert(typeof ownerRuntimeModule.buildDoubaoPluginChildEnv === "function", "Doubao plugin child env builder missing");
  assert(ownerRuntimeModule._private.outputRefWithObservedExtension(
    "runs/real_generation/runtime_to_review_v1_guarded_live_probe/image/doubaogen/example.png",
    "jpeg"
  ).endsWith("/example.jpg"), "real owner runtime must map jpeg bytes away from .png extension");
  assert(ownerRuntimeModule._private.outputRefWithObservedExtension(
    "runs/real_generation/runtime_to_review_v1_guarded_live_probe/image/doubaogen/example.png",
    "png"
  ).endsWith("/example.png"), "real owner runtime must keep matching png extension");
  const safeEnv = ownerRuntimeModule.buildSafeChildEnv({
    PATH: "path-ok",
    VOLCENGINE_API_KEY: "must-not-pass",
    SECRET_TOKEN: "must-not-pass",
  });
  assert(safeEnv.PATH === "path-ok", "safe env should preserve PATH");
  assert(!Object.prototype.hasOwnProperty.call(safeEnv, "VOLCENGINE_API_KEY"), "safe env must not pass provider API key");
  assert(!Object.prototype.hasOwnProperty.call(safeEnv, "SECRET_TOKEN"), "safe env must not pass arbitrary secret token");
  const pluginEnv = ownerRuntimeModule.buildDoubaoPluginChildEnv({
    outputDirectory: "A:\\agent-image-lab\\agent-image-lab-v0.2\\runs\\real_generation\\runtime_to_review_v1_guarded_live_probe",
    model: ownerRuntimeModule.requiredModel,
    vcpToolBoxRoot: "A:\\VCP\\VCPToolBox",
  });
  assert(typeof pluginEnv.DOTENV_CONFIG_PATH === "string" && pluginEnv.DOTENV_CONFIG_PATH.endsWith("Plugin\\DoubaoGen\\config.env"), "plugin child env must point to DoubaoGen config.env");
  assert(!Object.prototype.hasOwnProperty.call(pluginEnv, "VOLCENGINE_API_KEY"), "plugin child env must not receive provider API key from parent");

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
    plugin_config_present: readiness.plugin_config_present,
    plugin_child_uses_dotenv_config_path: true,
    vcptoolbox_owner_runtime_child_present: true,
    vcptoolbox_owner_runtime_child_diagnostic_mode_present: true,
    vcptoolbox_owner_runtime_child_loads_plugin_config: true,
    vcptoolbox_owner_runtime_child_reports_key_presence_without_value: true,
    output_extension_normalized_from_observed_format: true,
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
