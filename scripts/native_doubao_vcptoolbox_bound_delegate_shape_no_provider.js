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

function createMockPluginManager() {
  const calls = [];
  return {
    calls,
    async processToolCall(toolName, toolArgs, requestIp, executionContext) {
      calls.push({ toolName, toolArgs, requestIp, executionContext });
      return {
        status: "success",
        result: {
          details: {
            imageUrls: ["mock://not-a-provider-url"],
            serverPath: "mock://not-written",
            fileName: "mock-native-doubao-shape-only.png"
          }
        }
      };
    }
  };
}

function buildDoubaoToolArgs(request, promptText) {
  return {
    command: "generate",
    prompt: promptText,
    model: request.model || "doubao-seedream-5-0-260128",
    resolution: "1024x1024"
  };
}

function createVcpToolBoxBoundDelegateShapeNoProvider({ pluginManager, promptResolver }) {
  return async function vcpToolBoxBoundDelegateShapeNoProvider(request) {
    const issues = bridge.validateSecretlessProviderRuntimeRequest(request);
    if (issues.length > 0) {
      return {
        bridge_id: bridge.BRIDGE_ID,
        status: "BLOCKED_PROVIDER_RUNTIME_REQUEST_INVALID",
        blocker: "provider_runtime_request_invalid",
        provider_contact_performed: false,
        plugin_call_performed: false,
        api_call_performed: false,
        image_generation_performed: false,
        output_write_performed: false,
        human_review_required_now: false
      };
    }

    if (!pluginManager || typeof pluginManager.processToolCall !== "function") {
      return {
        bridge_id: bridge.BRIDGE_ID,
        status: "BLOCKED_VCPTOOLBOX_PLUGIN_MANAGER_NOT_BOUND",
        blocker: "vcptoolbox_plugin_manager_not_bound",
        provider_contact_performed: false,
        plugin_call_performed: false,
        api_call_performed: false,
        image_generation_performed: false,
        output_write_performed: false,
        human_review_required_now: false
      };
    }

    const promptText = promptResolver(request);
    const toolArgs = buildDoubaoToolArgs(request, promptText);
    await pluginManager.processToolCall(
      "DoubaoGen",
      toolArgs,
      "127.0.0.1",
      {
        requestSource: "agent-image-lab-secretless-runtime",
        bridgeId: request.bridge_id,
        providerBindingRefRedacted: true
      }
    );

    return {
      bridge_id: bridge.BRIDGE_ID,
      status: "MOCK_VCPTOOLBOX_DELEGATE_SHAPE_VERIFIED",
      blocker: null,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      output_write_performed: false,
      human_review_required_now: false
    };
  };
}

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

async function runShapeVerification() {
  const pluginManager = createMockPluginManager();
  const delegate = createVcpToolBoxBoundDelegateShapeNoProvider({
    pluginManager,
    promptResolver(request) {
      return `mock prompt resolved from ${request.prompt_package_ref}`;
    }
  });
  const boundRuntime = bridge.createBoundSecretlessProviderRuntimeBridge(delegate, {
    delegateOwner: "mock_vcptoolbox_plugin_manager"
  });
  const result = await runner.run({
    ...BASE_OPTIONS,
    secretless_provider_runtime: boundRuntime
  });
  const call = pluginManager.calls[0] || null;
  const flags = externalFlags(result);
  const checks = [
    {
      check: "runner_does_not_stop_on_secretless_runtime_not_callable",
      passed: result.status !== "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE",
      detail: result.status
    },
    {
      check: "runner_accepts_bound_bridge_and_delegate_returns_metadata_status",
      passed: result.status === "MOCK_VCPTOOLBOX_DELEGATE_SHAPE_VERIFIED",
      detail: result.status
    },
    {
      check: "mock_plugin_manager_called_once",
      passed: pluginManager.calls.length === 1,
      detail: pluginManager.calls.length
    },
    {
      check: "tool_name_is_doubaogen",
      passed: call && call.toolName === "DoubaoGen",
      detail: call && call.toolName
    },
    {
      check: "tool_args_match_doubaogen_generate_shape",
      passed: call &&
        call.toolArgs.command === "generate" &&
        typeof call.toolArgs.prompt === "string" &&
        call.toolArgs.prompt.length > 0 &&
        call.toolArgs.model === "doubao-seedream-5-0-260128" &&
        call.toolArgs.resolution === "1024x1024",
      detail: call && call.toolArgs
    },
    {
      check: "request_ip_is_local_loopback",
      passed: call && call.requestIp === "127.0.0.1",
      detail: call && call.requestIp
    },
    {
      check: "execution_context_marks_agent_image_lab_secretless_runtime",
      passed: call &&
        call.executionContext.requestSource === "agent-image-lab-secretless-runtime" &&
        call.executionContext.bridgeId === bridge.BRIDGE_ID &&
        call.executionContext.providerBindingRefRedacted === true,
      detail: call && call.executionContext
    },
    {
      check: "runner_result_has_no_external_side_effect_flags",
      passed: noExternalSideEffects(flags),
      detail: flags
    },
    {
      check: "sanitized_result_does_not_return_provider_url_or_raw_payload",
      passed: result.runtime_bridge_result &&
        result.runtime_bridge_result.provider_url_returned === false &&
        result.runtime_bridge_result.raw_provider_payload_returned === false &&
        result.runtime_bridge_result.raw_provider_payload_retained === false,
      detail: result.runtime_bridge_result
    }
  ];
  const failures = checks.filter((item) => item.passed !== true);
  return {
    harness: "native_doubao_vcptoolbox_bound_delegate_shape_no_provider",
    phase: "v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify",
    passed: failures.length === 0,
    status: failures.length === 0
      ? "COMPLETED_VALIDATED_VCPTOOLBOX_BOUND_DELEGATE_SHAPE_NO_PROVIDER"
      : "BLOCKED_VCPTOOLBOX_BOUND_DELEGATE_SHAPE_NO_PROVIDER",
    mock_plugin_manager_call_count: pluginManager.calls.length,
    mock_plugin_manager_calls: pluginManager.calls,
    runner_status: result.status,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    output_write_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    raw_provider_payload_returned: false,
    provider_url_returned: false,
    v0_6_73_execution_allowed: false,
    failures,
    checks
  };
}

if (require.main === module) {
  runShapeVerification().then((summary) => {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    process.exit(summary.passed ? 0 : 1);
  }).catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  });
}

module.exports = {
  BASE_OPTIONS,
  buildDoubaoToolArgs,
  createMockPluginManager,
  createVcpToolBoxBoundDelegateShapeNoProvider,
  runShapeVerification
};
