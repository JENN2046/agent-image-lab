#!/usr/bin/env node
"use strict";

const BRIDGE_ID = "native_doubao_secretless_provider_runtime_bridge:v0_6_73h";
const EXPECTED_PROVIDER_BINDING_REF = "native_doubao:capability:owner-runtime:v0_6_73";
const REDACTED_PROVIDER_BINDING_REF = "native_doubao:capability:owner-runtime:<redacted>";
const EXPECTED_DELEGATE_AUTHORIZATION_REF = "docs/vcp_integration/V0_6_73I_EXACT_BRIDGE_DELEGATE_AUTHORIZATION_OR_STOP_BEFORE_REAL_EXECUTION_RETRY.md";
const EXPECTED_DELEGATE_AUTHORIZATION_STATUS = "authorized_by_exact_bridge_delegate_authorization";
const SECRETLESS_PROVIDER_RUNTIME_BRIDGE_MARKER = Symbol("agent_image_lab_secretless_provider_runtime_bridge");
const ALLOWED_OUTPUT_DIRECTORY_REFS = new Set([
  "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_002/",
]);

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function addIssue(issues, condition, message) {
  if (!condition) issues.push(message);
}

function buildSecretlessProviderRuntimeRequest(options, preflight) {
  return {
    bridge_id: BRIDGE_ID,
    provider_binding_ref: REDACTED_PROVIDER_BINDING_REF,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    provider_binding_ref_matches_expected: options.provider_binding_ref === EXPECTED_PROVIDER_BINDING_REF,
    secretless_runtime_required: options.secretless_runtime_required === true,
    selected_route: "NativeDoubaoImage_one_shot_project_plugin",
    selected_plugin_id: "NativeDoubaoImage",
    command: "generate",
    mode: "text_to_image",
    model: options.model || "doubao-seedream-5-0-260128",
    prompt_package_ref: options.prompt_package_ref,
    output_directory_ref: options.output_directory,
    max_plugin_calls: options.max_plugin_calls,
    max_images_created: options.max_images_created,
    retry_allowed: options.retry_allowed === true,
    dry_run: options.dryRun !== false,
    execution_authorized: options.execution_authorized === true,
    a5_activation_ref: options.a5_activation_ref || null,
    preflight_passed: preflight && preflight.preflight_passed === true,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    raw_prompt_payload_included: false,
    secret_value_included: false,
    private_absolute_path_included: false,
    provider_raw_response_allowed: false,
    output_write_allowed: false,
    accepted_samples_write_allowed: false,
    production_candidate_write_allowed: false,
    DailyNote_write_allowed: false,
    VCP_memory_write_allowed: false
  };
}

function validateSecretlessProviderRuntimeRequest(request) {
  const issues = [];
  addIssue(issues, request && typeof request === "object", "request must be an object");
  if (!request || typeof request !== "object") return issues;
  addIssue(issues, request.bridge_id === BRIDGE_ID, "bridge_id mismatch");
  addIssue(issues, request.provider_binding_ref === REDACTED_PROVIDER_BINDING_REF, "provider_binding_ref must be redacted");
  addIssue(issues, request.provider_binding_ref_redacted === true, "provider_binding_ref_redacted must be true");
  addIssue(issues, request.provider_binding_ref_is_secret === false, "provider_binding_ref_is_secret must be false");
  addIssue(issues, request.provider_binding_ref_matches_expected === true, "provider binding handle mismatch");
  addIssue(issues, request.secretless_runtime_required === true, "secretless_runtime_required must be true");
  addIssue(issues, request.selected_plugin_id === "NativeDoubaoImage", "selected_plugin_id mismatch");
  addIssue(issues, request.command === "generate", "command must be generate");
  addIssue(issues, request.mode === "text_to_image", "mode must be text_to_image");
  addIssue(issues, request.prompt_package_ref === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml", "prompt_package_ref mismatch");
  addIssue(issues, ALLOWED_OUTPUT_DIRECTORY_REFS.has(request.output_directory_ref), "output_directory_ref mismatch");
  addIssue(issues, request.max_plugin_calls === 1, "max_plugin_calls must be 1");
  addIssue(issues, request.max_images_created === 1, "max_images_created must be 1");
  addIssue(issues, request.retry_allowed === false, "retry_allowed must be false");
  addIssue(issues, request.execution_authorized === true, "execution_authorized must be true for bridge readiness");
  addIssue(issues, request.preflight_passed === true, "preflight_passed must be true");
  addIssue(issues, request.env_file_content_read_performed === false, "env file content read must be false");
  addIssue(issues, request.secret_value_read_performed === false, "secret value read must be false");
  addIssue(issues, request.raw_prompt_payload_included === false, "raw prompt payload must not be included");
  addIssue(issues, request.secret_value_included === false, "secret value must not be included");
  addIssue(issues, request.private_absolute_path_included === false, "private absolute path must not be included");
  addIssue(issues, request.output_write_allowed === false, "output write must not be allowed by bridge request");
  return issues;
}

function sanitizeSecretlessProviderRuntimeResult(result) {
  const safeResult = result && typeof result === "object" ? cloneJson(result) : {};
  const blocker = Object.prototype.hasOwnProperty.call(safeResult, "blocker")
    ? safeResult.blocker
    : "provider_runtime_delegate_not_bound";
  return {
    bridge_id: safeResult.bridge_id || BRIDGE_ID,
    status: safeResult.status || "BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND",
    provider_binding_ref: REDACTED_PROVIDER_BINDING_REF,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    provider_contact_performed: safeResult.provider_contact_performed === true,
    plugin_call_performed: safeResult.plugin_call_performed === true,
    api_call_performed: safeResult.api_call_performed === true,
    image_generation_performed: safeResult.image_generation_performed === true,
    image_binary_read_performed: false,
    output_write_performed: safeResult.output_write_performed === true,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    raw_provider_payload_retained: false,
    raw_provider_payload_returned: false,
    provider_url_returned: false,
    human_review_required_now: safeResult.human_review_required_now === true,
    sanitized_result_metadata_only: true,
    blocker
  };
}

function validateSecretlessProviderRuntimeDelegateBinding(runtime, options = {}) {
  const issues = [];
  const isFunction = typeof runtime === "function";
  addIssue(issues, isFunction, "secretless_provider_runtime must be a function");

  if (!isFunction) {
    return {
      authorized_to_call_bridge: false,
      runtime_delegate_bound: false,
      delegate_authorization_required: true,
      delegate_authorization_passed: false,
      status: "BLOCKED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_AUTHORIZATION_REQUIRED",
      blocker: "secretless_provider_runtime_not_callable",
      issues
    };
  }

  const isKnownBridge = runtime[SECRETLESS_PROVIDER_RUNTIME_BRIDGE_MARKER] === true;
  const bridgeId = runtime.secretless_provider_runtime_bridge_id || null;
  const runtimeDelegateBound = runtime.secretless_provider_runtime_delegate_bound === true;
  const delegateAuthorizationRef = options.secretless_delegate_authorization_ref || null;
  const delegateAuthorizationStatus = options.secretless_delegate_authorization_status || null;
  const delegateAuthorizationActive = options.secretless_delegate_authorization_active === true;
  const canExecuteNow = options.secretless_delegate_authorization_can_execute_now === true;

  addIssue(issues, isKnownBridge, "secretless_provider_runtime must be created by the controlled bridge module");
  addIssue(issues, bridgeId === BRIDGE_ID, "secretless_provider_runtime bridge_id mismatch");

  if (!runtimeDelegateBound) {
    return {
      authorized_to_call_bridge: issues.length === 0,
      runtime_delegate_bound: false,
      delegate_authorization_required: false,
      delegate_authorization_passed: false,
      status: issues.length === 0
        ? "UNBOUND_BRIDGE_ALLOWED_TO_FAIL_CLOSED"
        : "BLOCKED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_AUTHORIZATION_REQUIRED",
      blocker: issues.length === 0
        ? "provider_runtime_delegate_not_bound"
        : "secretless_provider_runtime_not_controlled_bridge",
      issues
    };
  }

  addIssue(issues, delegateAuthorizationRef === EXPECTED_DELEGATE_AUTHORIZATION_REF, "delegate authorization ref mismatch");
  addIssue(issues, delegateAuthorizationStatus === EXPECTED_DELEGATE_AUTHORIZATION_STATUS, "delegate authorization status mismatch");
  addIssue(issues, delegateAuthorizationActive === true, "delegate authorization must be active");
  addIssue(issues, canExecuteNow === true, "delegate authorization must allow execution now");

  return {
    authorized_to_call_bridge: issues.length === 0,
    runtime_delegate_bound: true,
    delegate_authorization_required: true,
    delegate_authorization_passed: issues.length === 0,
    expected_delegate_authorization_ref: EXPECTED_DELEGATE_AUTHORIZATION_REF,
    status: issues.length === 0
      ? "AUTHORIZED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_BOUND"
      : "BLOCKED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_AUTHORIZATION_REQUIRED",
    blocker: issues.length === 0
      ? null
      : "exact_bridge_delegate_authorization_missing_or_inactive",
    issues
  };
}

function createUnboundSecretlessProviderRuntimeBridge() {
  const unboundSecretlessProviderRuntimeBridge = async function unboundSecretlessProviderRuntimeBridge(request) {
    const issues = validateSecretlessProviderRuntimeRequest(request);
    return sanitizeSecretlessProviderRuntimeResult({
      bridge_id: BRIDGE_ID,
      status: issues.length === 0 ? "BLOCKED_PROVIDER_RUNTIME_DELEGATE_NOT_BOUND" : "BLOCKED_PROVIDER_RUNTIME_REQUEST_INVALID",
      blocker: issues.length === 0 ? "provider_runtime_delegate_not_bound" : "provider_runtime_request_invalid",
      request_validation_passed: issues.length === 0,
      request_validation_issues: issues,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      output_write_performed: false,
      human_review_required_now: false
    });
  };
  Object.defineProperties(unboundSecretlessProviderRuntimeBridge, {
    [SECRETLESS_PROVIDER_RUNTIME_BRIDGE_MARKER]: {
      value: true
    },
    secretless_provider_runtime_bridge_id: {
      value: BRIDGE_ID
    },
    secretless_provider_runtime_delegate_bound: {
      value: false
    },
    secretless_provider_runtime_delegate_authorization_ref: {
      value: null
    },
    secretless_provider_runtime_delegate_authorization_status: {
      value: "unbound_no_delegate"
    }
  });
  return unboundSecretlessProviderRuntimeBridge;
}

function createBoundSecretlessProviderRuntimeBridge(delegate, metadata = {}) {
  if (typeof delegate !== "function") {
    throw new TypeError("secretless provider runtime delegate must be a function");
  }

  const boundSecretlessProviderRuntimeBridge = async function boundSecretlessProviderRuntimeBridge(request) {
    const issues = validateSecretlessProviderRuntimeRequest(request);
    if (issues.length > 0) {
      return sanitizeSecretlessProviderRuntimeResult({
        bridge_id: BRIDGE_ID,
        status: "BLOCKED_PROVIDER_RUNTIME_REQUEST_INVALID",
        blocker: "provider_runtime_request_invalid",
        request_validation_passed: false,
        request_validation_issues: issues,
        provider_contact_performed: false,
        plugin_call_performed: false,
        api_call_performed: false,
        image_generation_performed: false,
        output_write_performed: false,
        human_review_required_now: false
      });
    }

    try {
      const delegateResult = await delegate(cloneJson(request));
      return sanitizeSecretlessProviderRuntimeResult(delegateResult);
    } catch (error) {
      return sanitizeSecretlessProviderRuntimeResult({
        bridge_id: BRIDGE_ID,
        status: "BLOCKED_PROVIDER_RUNTIME_DELEGATE_FAILED",
        blocker: "provider_runtime_delegate_failed",
        provider_contact_performed: false,
        plugin_call_performed: false,
        api_call_performed: false,
        image_generation_performed: false,
        output_write_performed: false,
        human_review_required_now: false
      });
    }
  };

  Object.defineProperties(boundSecretlessProviderRuntimeBridge, {
    [SECRETLESS_PROVIDER_RUNTIME_BRIDGE_MARKER]: {
      value: true
    },
    secretless_provider_runtime_bridge_id: {
      value: BRIDGE_ID
    },
    secretless_provider_runtime_delegate_bound: {
      value: true
    },
    secretless_provider_runtime_delegate_authorization_ref: {
      value: metadata.delegateAuthorizationRef || EXPECTED_DELEGATE_AUTHORIZATION_REF
    },
    secretless_provider_runtime_delegate_authorization_status: {
      value: metadata.delegateAuthorizationStatus || EXPECTED_DELEGATE_AUTHORIZATION_STATUS
    },
    secretless_provider_runtime_delegate_owner: {
      value: metadata.delegateOwner || "VCPToolBox_or_owner_authorized_provider_runtime"
    }
  });
  return boundSecretlessProviderRuntimeBridge;
}

module.exports = {
  BRIDGE_ID,
  EXPECTED_PROVIDER_BINDING_REF,
  REDACTED_PROVIDER_BINDING_REF,
  EXPECTED_DELEGATE_AUTHORIZATION_REF,
  EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
  buildSecretlessProviderRuntimeRequest,
  validateSecretlessProviderRuntimeRequest,
  validateSecretlessProviderRuntimeDelegateBinding,
  sanitizeSecretlessProviderRuntimeResult,
  createUnboundSecretlessProviderRuntimeBridge,
  createBoundSecretlessProviderRuntimeBridge
};
