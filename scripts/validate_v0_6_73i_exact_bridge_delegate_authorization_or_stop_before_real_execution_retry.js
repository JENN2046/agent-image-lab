#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const bridgePath = "scripts/native_doubao_secretless_provider_runtime_bridge.js";
const runnerPath = "scripts/run_native_doubao_image_generation.js";
const docPath = "docs/vcp_integration/V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY.md";
const fixturePath = "tests/schema_examples/v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry.example.yaml";

const bridge = require(path.join(root, bridgePath));
const runner = require(path.join(root, runnerPath));

const requiredFiles = [bridgePath, runnerPath, docPath, fixturePath];
const requiredTokens = [
  "phase: v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry",
  "result: COMPLETED_VALIDATED",
  "bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h",
  "delegate_authorization_ref: docs/vcp_integration/V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY.md",
  "delegate_authorization_status_required: authorized_by_exact_bridge_delegate_authorization",
  "controlled_bridge_marker_required: true",
  "unbound_bridge_allowed_to_fail_closed: true",
  "arbitrary_runtime_function_allowed: false",
  "bound_delegate_without_exact_authorization_allowed: false",
  "execution_retry_allowed_now: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "image_generation_performed: false",
  "image_binary_read_performed: false",
  "output_write_performed: false",
  "env_file_content_read_performed: false",
  "secret_value_read_performed: false",
  "v0_6_73_execution_allowed: false",
  "next_safe_task: stop_before_real_execution_retry_until_exact_human_authorization"
];

const results = [];
const errors = [];

function repoPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), detail });
  if (!passed) errors.push({ check, detail });
}

function buildOptions(extra = {}) {
  return {
    prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
    plugin_profile_ref: "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
    output_directory: "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
    model: "doubao-seedream-5-0-260128",
    max_plugin_calls: 1,
    max_images_created: 1,
    retry_allowed: false,
    dryRun: false,
    execution_authorized: true,
    a5_activation_ref: "docs/vcp_integration/V0_6_73F_EXACT_A5_EXECUTION_AUTHORIZATION_DRAFT.md",
    provider_binding_ref: runner.SECRETLESS_PROVIDER_BINDING_REF,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    secretless_runtime_required: true,
    ...extra
  };
}

async function main() {
  for (const file of requiredFiles) {
    addResult(`file_exists:${file}`, fs.existsSync(repoPath(file)), file);
  }

  const joinedDocs = `${read(docPath)}\n${read(fixturePath)}`;
  for (const token of requiredTokens) {
    addResult(`docs_contain:${token}`, joinedDocs.includes(token), token);
  }

  addResult("bridge_exports_delegate_authorization_constants", bridge.EXPECTED_DELEGATE_AUTHORIZATION_REF === docPath &&
    bridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS === "authorized_by_exact_bridge_delegate_authorization", {
    ref: bridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
    status: bridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS
  });
  addResult("bridge_exports_delegate_binding_validator", typeof bridge.validateSecretlessProviderRuntimeDelegateBinding === "function", bridgePath);

  let arbitraryCalled = false;
  async function arbitraryRuntime() {
    arbitraryCalled = true;
    return {
      status: "SHOULD_NOT_BE_CALLED",
      provider_contact_performed: true,
      plugin_call_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
      output_write_performed: true
    };
  }

  const arbitraryAuth = bridge.validateSecretlessProviderRuntimeDelegateBinding(arbitraryRuntime, buildOptions());
  addResult("arbitrary_runtime_rejected_before_call", arbitraryAuth.authorized_to_call_bridge === false &&
    arbitraryAuth.status === "BLOCKED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_AUTHORIZATION_REQUIRED", arbitraryAuth);

  const arbitraryRunnerResult = await runner.run({
    ...buildOptions(),
    secretless_provider_runtime: arbitraryRuntime
  });
  addResult("runner_blocks_arbitrary_runtime_without_invocation", arbitraryRunnerResult.status === "BLOCKED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_AUTHORIZATION_REQUIRED" &&
    arbitraryCalled === false, arbitraryRunnerResult);
  addResult("runner_arbitrary_block_has_no_external_side_effects", arbitraryRunnerResult.provider_contact_performed === false &&
    arbitraryRunnerResult.plugin_call_performed === false &&
    arbitraryRunnerResult.api_call_performed === false &&
    arbitraryRunnerResult.image_generation_performed === false &&
    arbitraryRunnerResult.output_write_performed === false &&
    arbitraryRunnerResult.env_file_content_read_performed === false &&
    arbitraryRunnerResult.secret_value_read_performed === false, arbitraryRunnerResult);

  const unboundBridge = bridge.createUnboundSecretlessProviderRuntimeBridge();
  const unboundAuth = bridge.validateSecretlessProviderRuntimeDelegateBinding(unboundBridge, buildOptions());
  addResult("unbound_controlled_bridge_allowed_to_fail_closed", unboundAuth.authorized_to_call_bridge === true &&
    unboundAuth.runtime_delegate_bound === false &&
    unboundAuth.status === "UNBOUND_BRIDGE_ALLOWED_TO_FAIL_CLOSED", unboundAuth);

  const unboundRunnerResult = await runner.run({
    ...buildOptions(),
    secretless_provider_runtime: unboundBridge
  });
  addResult("runner_still_allows_unbound_bridge_fail_closed_result", unboundRunnerResult.status === "BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND", unboundRunnerResult.status);
  addResult("unbound_bridge_path_has_no_external_side_effects", unboundRunnerResult.provider_contact_performed === false &&
    unboundRunnerResult.plugin_call_performed === false &&
    unboundRunnerResult.api_call_performed === false &&
    unboundRunnerResult.image_generation_performed === false &&
    unboundRunnerResult.output_write_performed === false &&
    unboundRunnerResult.env_file_content_read_performed === false &&
    unboundRunnerResult.secret_value_read_performed === false, unboundRunnerResult);

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry",
    phase: "v0_6_73i_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    output_write_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    v0_6_73_execution_allowed: false,
    next_safe_task: "stop_before_real_execution_retry_until_exact_human_authorization",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
