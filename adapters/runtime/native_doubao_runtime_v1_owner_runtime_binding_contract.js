#!/usr/bin/env node
"use strict";

const secretlessBridge = require("../../scripts/native_doubao_secretless_provider_runtime_bridge.js");

const contractId = "native_doubao_runtime_v1_owner_runtime_binding_contract";

function noProviderOwnerRuntimeDelegate(request) {
  return {
    bridge_id: secretlessBridge.BRIDGE_ID,
    status: "BLOCKED_OWNER_RUNTIME_CONTRACT_NO_PROVIDER",
    blocker: "owner_runtime_contract_no_provider_call",
    request_validation_passed: secretlessBridge.validateSecretlessProviderRuntimeRequest(request).length === 0,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    human_review_required_now: false,
    calls_used: { provider: 0, plugin: 0, api: 0 },
    image_count: 0,
    output_files: [],
  };
}

function createSecretlessProviderRuntime() {
  return secretlessBridge.createBoundSecretlessProviderRuntimeBridge(noProviderOwnerRuntimeDelegate, {
    delegateOwner: "agent_image_lab_runtime_v1_owner_runtime_binding_contract_no_provider",
    delegateAuthorizationRef: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_REF,
    delegateAuthorizationStatus: secretlessBridge.EXPECTED_DELEGATE_AUTHORIZATION_STATUS,
  });
}

module.exports = createSecretlessProviderRuntime;
module.exports.contractId = contractId;
module.exports.createSecretlessProviderRuntime = createSecretlessProviderRuntime;
module.exports.noProviderOwnerRuntimeDelegate = noProviderOwnerRuntimeDelegate;
module.exports.provider_contact_performed = false;
module.exports.plugin_call_performed = false;
module.exports.api_call_performed = false;
module.exports.image_generation_performed = false;
module.exports.secret_value_read_performed = false;
module.exports.env_file_content_read_performed = false;
