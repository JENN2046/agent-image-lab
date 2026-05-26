#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const bridgePath = "scripts/native_doubao_secretless_provider_runtime_bridge.js";
const runnerPath = "scripts/run_native_doubao_image_generation.js";
const docPath = "docs/vcp_integration/V0_6_73H_SECRETLESS_PROVIDER_RUNTIME_BRIDGE.md";
const fixturePath = "tests/schema_examples/v0_6_73h_secretless_provider_runtime_bridge.example.yaml";

const bridge = require(path.join(root, bridgePath));
const runner = require(path.join(root, runnerPath));

const requiredFiles = [bridgePath, runnerPath, docPath, fixturePath];
const requiredTokens = [
  "phase: v0_6_73h_secretless_provider_runtime_bridge",
  "result: COMPLETED_VALIDATED",
  "bridge_id: native_doubao_secretless_provider_runtime_bridge:v0_6_73h",
  "provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "runtime_delegate_bound: false",
  "unbound_bridge_status: BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND",
  "request_includes_raw_prompt_payload: false",
  "request_includes_secret_value: false",
  "request_includes_private_absolute_path: false",
  "output_write_allowed_by_bridge: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "image_generation_performed: false",
  "image_binary_read_performed: false",
  "output_write_performed: false",
  "env_file_content_read_performed: false",
  "secret_value_read_performed: false",
  "v0_6_73_execution_allowed: false",
  "next_safe_task: draft_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry"
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

async function main() {
  for (const file of requiredFiles) {
    addResult(`file_exists:${file}`, fs.existsSync(repoPath(file)), file);
  }

  const joinedDocs = `${read(docPath)}\n${read(fixturePath)}`;
  for (const token of requiredTokens) {
    addResult(`docs_contain:${token}`, joinedDocs.includes(token), token);
  }

  addResult("bridge_id_exact", bridge.BRIDGE_ID === "native_doubao_secretless_provider_runtime_bridge:v0_6_73h", bridge.BRIDGE_ID);
  addResult("bridge_exports_expected_helpers", typeof bridge.buildSecretlessProviderRuntimeRequest === "function" &&
    typeof bridge.validateSecretlessProviderRuntimeRequest === "function" &&
    typeof bridge.createUnboundSecretlessProviderRuntimeBridge === "function" &&
    typeof bridge.createBoundSecretlessProviderRuntimeBridge === "function", bridgePath);

  const options = {
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
    secretless_runtime_required: true
  };

  const preflight = runner.preflightCheck(options);
  const request = bridge.buildSecretlessProviderRuntimeRequest(options, preflight);
  const requestIssues = bridge.validateSecretlessProviderRuntimeRequest(request);
  addResult("secretless_preflight_still_passes_without_env_read", preflight.preflight_passed === true && preflight.env_file_content_read_performed === false && preflight.secret_value_read_performed === false, preflight);
  addResult("bridge_request_validates", requestIssues.length === 0, requestIssues);
  addResult("bridge_request_is_sanitized", request.raw_prompt_payload_included === false && request.secret_value_included === false && request.private_absolute_path_included === false, request);
  addResult("bridge_request_blocks_output_write", request.output_write_allowed === false && request.accepted_samples_write_allowed === false && request.production_candidate_write_allowed === false, request);

  const unboundBridge = bridge.createUnboundSecretlessProviderRuntimeBridge();
  const bridgeResult = await unboundBridge(request);
  addResult("unbound_bridge_blocks_before_provider_delegate", bridgeResult.status === "BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND", bridgeResult);
  addResult("unbound_bridge_has_no_external_side_effects", bridgeResult.provider_contact_performed === false &&
    bridgeResult.plugin_call_performed === false &&
    bridgeResult.api_call_performed === false &&
    bridgeResult.image_generation_performed === false &&
    bridgeResult.output_write_performed === false, bridgeResult);

  const runnerResult = await runner.run({
    ...options,
    secretless_provider_runtime: unboundBridge
  });
  addResult("runner_calls_secretless_bridge_and_blocks_unbound_delegate", runnerResult.status === "BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND", runnerResult.status);
  addResult("runner_bridge_path_has_no_provider_or_api_call", runnerResult.provider_contact_performed === false &&
    runnerResult.plugin_call_performed === false &&
    runnerResult.api_call_performed === false, runnerResult);
  addResult("runner_bridge_path_has_no_image_or_output", runnerResult.image_generation_performed === false &&
    runnerResult.image_binary_read_performed === false &&
    runnerResult.output_write_performed === false, runnerResult);
  addResult("runner_bridge_path_has_no_env_or_secret_read", runnerResult.env_file_content_read_performed === false &&
    runnerResult.secret_value_read_performed === false, runnerResult);

  let mockDelegateCalled = false;
  const boundMockBridge = bridge.createBoundSecretlessProviderRuntimeBridge(async function mockNoProviderDelegate(mockRequest) {
    mockDelegateCalled = true;
    const mockIssues = bridge.validateSecretlessProviderRuntimeRequest(mockRequest);
    return {
      bridge_id: bridge.BRIDGE_ID,
      status: mockIssues.length === 0 ? "BLOCKED_MOCK_PROVIDER_RUNTIME_FAIL_CLOSED" : "BLOCKED_PROVIDER_RUNTIME_REQUEST_INVALID",
      blocker: mockIssues.length === 0 ? "mock_provider_runtime_fail_closed_no_provider_call" : "provider_runtime_request_invalid",
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      output_write_performed: false,
      human_review_required_now: false
    };
  }, {
    delegateOwner: "mock_no_provider_runtime"
  });

  const boundRunnerResult = await runner.run({
    ...options,
    secretless_provider_runtime: boundMockBridge,
    secretless_delegate_authorization_ref: bridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
    secretless_delegate_authorization_status: bridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
    secretless_delegate_authorization_active: true,
    secretless_delegate_authorization_can_execute_now: true
  });
  addResult("runner_accepts_bound_controlled_bridge_before_mock_fail_closed",
    boundRunnerResult.status === "BLOCKED_MOCK_PROVIDER_RUNTIME_FAIL_CLOSED" && mockDelegateCalled === true,
    boundRunnerResult.status);
  addResult("bound_mock_bridge_does_not_report_secretless_runtime_not_callable",
    boundRunnerResult.status !== "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE",
    boundRunnerResult.status);
  addResult("bound_mock_bridge_has_no_provider_or_api_call", boundRunnerResult.provider_contact_performed === false &&
    boundRunnerResult.plugin_call_performed === false &&
    boundRunnerResult.api_call_performed === false, boundRunnerResult);
  addResult("bound_mock_bridge_has_no_image_or_output", boundRunnerResult.image_generation_performed === false &&
    boundRunnerResult.image_binary_read_performed === false &&
    boundRunnerResult.output_write_performed === false, boundRunnerResult);
  addResult("bound_mock_bridge_has_no_env_or_secret_read", boundRunnerResult.env_file_content_read_performed === false &&
    boundRunnerResult.secret_value_read_performed === false, boundRunnerResult);

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73h_secretless_provider_runtime_bridge",
    phase: "v0_6_73h_secretless_provider_runtime_bridge",
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
    next_safe_task: "draft_exact_bridge_delegate_authorization_or_stop_before_real_execution_retry",
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
