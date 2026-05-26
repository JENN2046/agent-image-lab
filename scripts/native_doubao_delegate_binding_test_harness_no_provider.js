#!/usr/bin/env node
"use strict";

const bridge = require("./native_doubao_secretless_provider_runtime_bridge.js");
const runner = require("./run_native_doubao_image_generation.js");

const BASE_OPTIONS = {
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
  secretless_delegate_authorization_ref: bridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
  secretless_delegate_authorization_status: bridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
  secretless_delegate_authorization_active: true,
  secretless_delegate_authorization_can_execute_now: true
};

function externalFlags(result) {
  return {
    provider_contact_performed: result.provider_contact_performed === true,
    plugin_call_performed: result.plugin_call_performed === true,
    api_call_performed: result.api_call_performed === true,
    image_generation_performed: result.image_generation_performed === true,
    image_binary_read_performed: result.image_binary_read_performed === true,
    output_write_performed: result.output_write_performed === true,
    env_file_content_read_performed: result.env_file_content_read_performed === true,
    secret_value_read_performed: result.secret_value_read_performed === true
  };
}

function noExternalSideEffects(flags) {
  return Object.values(flags).every((value) => value === false);
}

async function runCase(id, options, expectedStatus) {
  const result = await runner.run(options);
  const flags = externalFlags(result);
  return {
    id,
    expected_status: expectedStatus,
    actual_status: result.status,
    passed: result.status === expectedStatus && noExternalSideEffects(flags),
    external_side_effects_absent: noExternalSideEffects(flags),
    flags
  };
}

async function runHarness() {
  let arbitraryRuntimeCalled = false;
  const arbitraryRuntime = async function arbitraryRuntime() {
    arbitraryRuntimeCalled = true;
    return {
      status: "SHOULD_NOT_BE_CALLED",
      provider_contact_performed: true,
      api_call_performed: true,
      image_generation_performed: true,
      output_write_performed: true
    };
  };

  const unboundControlledBridge = bridge.createUnboundSecretlessProviderRuntimeBridge();
  let mockBoundDelegateCalled = false;
  let mockBoundDelegateRequestValid = false;
  const mockBoundDelegate = async function mockBoundDelegate(request) {
    mockBoundDelegateCalled = true;
    mockBoundDelegateRequestValid = bridge.validateSecretlessProviderRuntimeRequest(request).length === 0;
    return {
      bridge_id: bridge.BRIDGE_ID,
      status: "BLOCKED_MOCK_PROVIDER_RUNTIME_FAIL_CLOSED",
      blocker: "mock_provider_runtime_fail_closed_no_provider_call",
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      output_write_performed: false,
      human_review_required_now: false
    };
  };
  const boundMockBridge = bridge.createBoundSecretlessProviderRuntimeBridge(mockBoundDelegate, {
    delegateOwner: "mock_no_provider_runtime"
  });

  const cases = [];
  cases.push(await runCase(
    "missing_secretless_provider_runtime",
    { ...BASE_OPTIONS },
    "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE"
  ));
  cases.push(await runCase(
    "arbitrary_uncontrolled_runtime_rejected_before_call",
    { ...BASE_OPTIONS, secretless_provider_runtime: arbitraryRuntime },
    "BLOCKED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_AUTHORIZATION_REQUIRED"
  ));
  cases.push({
    id: "arbitrary_uncontrolled_runtime_not_invoked",
    expected_status: "NOT_INVOKED",
    actual_status: arbitraryRuntimeCalled ? "INVOKED" : "NOT_INVOKED",
    passed: arbitraryRuntimeCalled === false,
    external_side_effects_absent: true,
    flags: externalFlags({})
  });
  cases.push(await runCase(
    "controlled_unbound_bridge_fails_closed",
    { ...BASE_OPTIONS, secretless_provider_runtime: unboundControlledBridge },
    "BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND"
  ));
  cases.push(await runCase(
    "controlled_bound_mock_bridge_called_and_fails_closed",
    { ...BASE_OPTIONS, secretless_provider_runtime: boundMockBridge },
    "BLOCKED_MOCK_PROVIDER_RUNTIME_FAIL_CLOSED"
  ));
  cases.push({
    id: "controlled_bound_mock_delegate_invoked_once_with_valid_request",
    expected_status: "INVOKED_ONCE_VALID_REQUEST",
    actual_status: mockBoundDelegateCalled && mockBoundDelegateRequestValid ? "INVOKED_ONCE_VALID_REQUEST" : "NOT_VALIDLY_INVOKED",
    passed: mockBoundDelegateCalled === true && mockBoundDelegateRequestValid === true,
    external_side_effects_absent: true,
    flags: externalFlags({})
  });
  cases.push(await runCase(
    "bad_provider_binding_ref_blocks_preflight",
    { ...BASE_OPTIONS, provider_binding_ref: "native_doubao:capability:wrong" },
    "BLOCKED_PREFLIGHT_FAILED"
  ));

  const passed = cases.every((item) => item.passed === true);
  return {
    harness: "native_doubao_delegate_binding_test_harness_no_provider",
    phase: "v0_6_73u3_runtime_delegate_binding_test_harness_no_provider",
    passed,
    case_count: cases.length,
    failed_count: cases.filter((item) => item.passed !== true).length,
    accepted_delegate_shape: "controlled_bridge_marker_with_exact_authorization_only",
    arbitrary_runtime_allowed: false,
    unbound_controlled_bridge_allowed_to_fail_closed: true,
    bound_controlled_mock_bridge_allowed_to_fail_closed: true,
    bound_mock_delegate_called: mockBoundDelegateCalled,
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
    push_performed: false,
    v0_6_73_execution_allowed: false,
    cases
  };
}

if (require.main === module) {
  runHarness().then((summary) => {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    process.exit(summary.passed ? 0 : 1);
  }).catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  });
}

module.exports = {
  BASE_OPTIONS,
  runHarness
};
