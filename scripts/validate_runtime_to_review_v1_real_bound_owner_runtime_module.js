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
const fixtureRoot = path.join(root, ".agent_private", "runtime_to_review_v1", "real_bound_owner_runtime_fixture");
const ownerRootEnvName = "AGENT_IMAGE_LAB_VCPTOOLBOX_ROOT";
const hardCodedOwnerRootLiteralPattern = /(?:[A-Za-z]:\\\\|\/(?:Users|home|mnt|opt|var)\/)[^"'`\r\n]*(?:VCPToolBox|VCP)[^"'`\r\n]*/;

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

function writeFixtureFile(relativePath, body) {
  const target = path.join(fixtureRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body, "utf8");
}

function prepareFixtureRoot() {
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
  writeFixtureFile(path.join("Plugin", "DoubaoGen", "DoubaoGen.js"), "\"use strict\";\nmodule.exports = {};\n");
  writeFixtureFile(path.join("Plugin", "DoubaoGen", "config.env"), "VOLCENGINE_API_KEY=fixture_value_not_read\n");
  writeFixtureFile(path.join("Plugin", "DoubaoGen", "plugin-manifest.json"), "{\"name\":\"DoubaoGen\"}\n");
  return fixtureRoot;
}

async function withOwnerRootEnvBlocked(fn) {
  const hadOwnerRootEnv = Object.prototype.hasOwnProperty.call(process.env, ownerRootEnvName);
  const previousOwnerRootEnv = process.env[ownerRootEnvName];
  delete process.env[ownerRootEnvName];
  try {
    return await fn();
  } finally {
    if (hadOwnerRootEnv) process.env[ownerRootEnvName] = previousOwnerRootEnv;
    else delete process.env[ownerRootEnvName];
  }
}

async function main() {
  runNode(["--check", runnerPath]);
  runNode(["--check", delegatePath]);
  runNode(["--check", ownerRuntimePath]);
  runNode(["--check", ownerRuntimeChildPath]);
  runNode(["--check", "scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_module.js"]);

  const runner = require(repoPath(runnerPath));
  const ownerRuntimeModule = require(repoPath(ownerRuntimePath));
  const secretlessBridge = require(repoPath("scripts/native_doubao_secretless_provider_runtime_bridge.js"));
  assert(typeof ownerRuntimeModule.createSecretlessProviderRuntime === "function", "real owner runtime factory missing");
  assert(ownerRuntimeModule.moduleId === "native_doubao_runtime_v1_real_bound_owner_runtime", "real owner runtime module id mismatch");
  assert(ownerRuntimeModule.allowedOutputDirectory === "runs/real_generation/runtime_to_review_v1_guarded_live_probe/", "allowed output directory mismatch");
  assert(ownerRuntimeModule.allowedPromptPackageRef === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml", "allowed prompt package mismatch");
  assert(ownerRuntimeModule.requiredModel === "doubao-seedream-5-0-260128", "required model mismatch");
  assert(typeof ownerRuntimeModule.buildSafeChildEnv === "function", "safe child env builder missing");
  const ownerRuntimeSource = fs.readFileSync(repoPath(ownerRuntimePath), "utf8");
  assert(!ownerRuntimeSource.includes("...process.env"), "real owner runtime must not copy full process.env into child runtime");
  assert(!ownerRuntimeSource.includes("defaultVcpToolBoxRootCandidates"), "real owner runtime must not keep implicit owner-root candidates");
  assert(!hardCodedOwnerRootLiteralPattern.test(ownerRuntimeSource), "real owner runtime must not hard-code private VCPToolBox roots");
  assert(ownerRuntimeSource.includes("owner_vcptoolbox_root_not_explicitly_configured"), "real owner runtime must fail closed without explicit owner root");
  assert(ownerRuntimeSource.includes("vcptoolbox_doubao_owner_runtime_child.js"), "real owner runtime must use VCPToolBox owner runtime child");
  const childSource = fs.readFileSync(repoPath(ownerRuntimeChildPath), "utf8");
  assert(childSource.includes("diagnosticOnly"), "owner runtime child must expose diagnosticOnly mode");
  assert(childSource.includes("dotenv.config"), "owner runtime child must load plugin config inside the child process");
  assert(childSource.includes("\"Plugin\", \"DoubaoGen\", \"config.env\""), "owner runtime child must use DoubaoGen config.env path");
  assert(childSource.includes("provider_config_key_present"), "owner runtime child must report config key presence without exposing values");
  assert(ownerRuntimeSource.includes("config_key_present"), "real owner runtime must preserve child config-key blocker precision");
  assert(ownerRuntimeSource.includes("outputRefWithObservedExtension"), "real owner runtime must normalize output extension from observed format");
  assert(ownerRuntimeSource.includes("extension_normalized_from"), "real owner runtime must record extension normalization source");

  const missingRootReadiness = await withOwnerRootEnvBlocked(() => ownerRuntimeModule.inspectRealBoundOwnerRuntimeReadiness({}));
  assert(missingRootReadiness.owner_root_explicitly_configured === false, "owner root must be explicit");
  assert(missingRootReadiness.current_blocker === "owner_vcptoolbox_root_not_explicitly_configured", "missing owner root blocker mismatch");
  assert(missingRootReadiness.plugin_entry_present === false, "missing owner root must not probe plugin entry");
  assert(missingRootReadiness.plugin_config_present === false, "missing owner root must not probe plugin config");
  assert(missingRootReadiness.plugin_manifest_present === false, "missing owner root must not probe plugin manifest");
  assert(missingRootReadiness.env_file_content_read_performed === false, "missing-root readiness must not read env file content");
  assert(missingRootReadiness.secret_value_read_performed === false, "missing-root readiness must not read secret values");

  const publicFixtureRoot = prepareFixtureRoot();
  const readiness = ownerRuntimeModule.inspectRealBoundOwnerRuntimeReadiness({ vcpToolBoxRoot: publicFixtureRoot });
  assert(readiness.owner_root_explicitly_configured === true, "explicit fixture owner root must be recorded");
  assert(readiness.current_blocker === null, "explicit fixture owner root should not have a root blocker");
  assert(readiness.plugin_entry_present === true, "fixture DoubaoGen plugin entry must be present");
  assert(readiness.plugin_config_present === true, "fixture DoubaoGen plugin config.env must be present");
  assert(readiness.plugin_manifest_present === true, "fixture DoubaoGen plugin manifest must be present");
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
  const missingRootRequest = secretlessBridge.buildSecretlessProviderRuntimeRequest({
    provider_binding_ref: secretlessBridge.EXPECTED_PROVIDER_BINDING_REF,
    secretless_runtime_required: true,
    prompt_package_ref: ownerRuntimeModule.allowedPromptPackageRef,
    output_directory: ownerRuntimeModule.allowedOutputDirectory,
    model: ownerRuntimeModule.requiredModel,
    max_plugin_calls: 1,
    max_images_created: 1,
    retry_allowed: false,
    execution_authorized: true,
  }, { preflight_passed: true });
  const missingRootResult = await withOwnerRootEnvBlocked(() => {
    const runtimeWithoutRoot = ownerRuntimeModule.createSecretlessProviderRuntime();
    return runtimeWithoutRoot(missingRootRequest);
  });
  assert(missingRootResult.blocker === "owner_vcptoolbox_root_not_explicitly_configured", "runtime without explicit owner root must fail closed");
  assert(missingRootResult.provider_contact_performed === false, "missing-root runtime must not contact provider");
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
    outputDirectory: path.join(root, "runs", "real_generation", "runtime_to_review_v1_guarded_live_probe"),
    model: ownerRuntimeModule.requiredModel,
    vcpToolBoxRoot: publicFixtureRoot,
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
    explicit_owner_root_required: true,
    missing_owner_root_blocked: true,
    owner_root_env_blocked_for_missing_root_checks: true,
    implicit_owner_root_candidates_removed: true,
    readiness_checked_without_secret_read: true,
    safe_child_env_does_not_copy_process_env: true,
    provider_secret_env_not_passed_to_child: true,
    local_fixture_root_used: true,
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
