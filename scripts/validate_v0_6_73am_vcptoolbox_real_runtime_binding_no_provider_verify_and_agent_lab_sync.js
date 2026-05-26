#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const vcpToolBoxRoot = "A:\\VCP\\apps\\VCPToolBox";

const localFiles = {
  doc: "docs/vcp_integration/V0_6_73AM_VCPTOOLBOX_REAL_RUNTIME_BINDING_NO_PROVIDER_VERIFY_AND_AGENT_LAB_SYNC.md",
  fixture: "tests/schema_examples/v0_6_73am_vcptoolbox_real_runtime_binding_no_provider_verify_and_agent_lab_sync.example.yaml"
};

const vcpFiles = {
  delegate: path.join(vcpToolBoxRoot, "modules", "nativeDoubaoSecretlessRuntimeDelegate.js"),
  route: path.join(vcpToolBoxRoot, "routes", "admin", "aiImageAgents.js"),
  server: path.join(vcpToolBoxRoot, "server.js")
};

const requiredLocalTokens = [
  "phase: v0_6_73am_vcptoolbox_real_runtime_binding_no_provider_verify_and_agent_lab_sync",
  "result: COMPLETED_VALIDATED_NO_PROVIDER_VERIFY_AND_AGENT_LAB_SYNC",
  "vcptoolbox_read_only_in_this_phase: true",
  "no_vcptoolbox_write_in_this_phase: true",
  "no_env_file_content_read: true",
  "no_secret_value_read: true",
  "no_provider_contact: true",
  "no_plugin_call: true",
  "no_api_call: true",
  "no_image_generation: true",
  "no_remote_write: true",
  "real_runtime_dry_run_allowed_now: false",
  "real_provider_execution_allowed_now: false",
  "next_safe_task: request_exact_runtime_dry_run_or_provider_execution_authorization_or_stop"
];

const forbiddenLocalTokens = [
  "vcptoolbox_read_only_in_this_phase: false",
  "no_vcptoolbox_write_in_this_phase: false",
  "no_env_file_content_read: false",
  "no_secret_value_read: false",
  "no_provider_contact: false",
  "no_plugin_call: false",
  "no_api_call: false",
  "no_image_generation: false",
  "no_remote_write: false",
  "real_runtime_dry_run_allowed_now: true",
  "real_provider_execution_allowed_now: true",
  "provider_contact_performed: true",
  "plugin_call_performed: true",
  "api_call_performed: true",
  "image_generation_performed: true",
  "secret_value_read_performed: true",
  "remote_write_performed: true",
  "push_performed: true"
];

const requiredVcpTokens = {
  delegate: [
    "createNativeDoubaoSecretlessRuntimeDelegate",
    "function failClosed",
    "native_doubao_secretless_runtime_delegate_not_enabled",
    "native_doubao_secretless_runtime_delegate_plugin_manager_not_callable",
    "native_doubao_secretless_runtime_delegate_tool_not_allowed",
    "native_doubao_secretless_runtime_delegate_command_not_allowed",
    "DEFAULT_REQUEST_SOURCE = 'agent-image-lab-secretless-runtime'",
    "providerBindingRefRedacted: true",
    "pluginManager.processToolCall",
    "DOUBAO_TOOL_NAME",
    "ALLOWED_COMMANDS"
  ],
  route: [
    "requireNativeDoubaoSecretlessRuntimeDelegate",
    "nativeDoubaoSecretlessRuntimeDelegate",
    "createNativeDoubaoDelegatePluginManagerFacade",
    "native_doubao_secretless_runtime_delegate_not_callable",
    "native_doubao_secretless_runtime_delegate_failed_closed",
    "DoubaoGen",
    "executeAiImagePipelineV2"
  ],
  server: [
    "createNativeDoubaoSecretlessRuntimeDelegate",
    "ENABLE_NATIVE_DOUBAO_SECRETLESS_RUNTIME_DELEGATE",
    "routeOptions.requireNativeDoubaoSecretlessRuntimeDelegate = true",
    "routeOptions.nativeDoubaoSecretlessRuntimeDelegate",
    "route remains fail-closed"
  ]
};

function readAbsolute(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readLocal(relativePath) {
  return readAbsolute(path.join(root, relativePath));
}

function existsAbsolute(filePath) {
  return fs.existsSync(filePath);
}

const results = [];
const errors = [];

function addResult(check, passed, detail = null) {
  results.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
  if (!passed) errors.push({ check, ...(detail === null ? {} : { detail }) });
}

function main() {
  for (const file of Object.values(localFiles)) {
    const filePath = path.join(root, file);
    addResult(`local_file_exists:${file}`, existsAbsolute(filePath), file);
  }

  for (const [label, filePath] of Object.entries(vcpFiles)) {
    addResult(`vcptoolbox_file_exists:${label}`, existsAbsolute(filePath), filePath);
  }

  const localJoined = `${readLocal(localFiles.doc)}\n${readLocal(localFiles.fixture)}`;
  for (const token of requiredLocalTokens) {
    addResult(`local_contains:${token}`, localJoined.includes(token), token);
  }

  for (const token of forbiddenLocalTokens) {
    addResult(`local_forbidden_absent:${token}`, !localJoined.includes(token), token);
  }

  for (const [label, tokens] of Object.entries(requiredVcpTokens)) {
    const text = readAbsolute(vcpFiles[label]);
    for (const token of tokens) {
      addResult(`vcptoolbox_${label}_contains:${token}`, text.includes(token), token);
    }
  }

  const delegateText = readAbsolute(vcpFiles.delegate);
  const routeText = readAbsolute(vcpFiles.route);
  const serverText = readAbsolute(vcpFiles.server);

  addResult(
    "delegate_fail_closed_before_processToolCall",
    delegateText.indexOf("native_doubao_secretless_runtime_delegate_not_enabled") <
      delegateText.indexOf("pluginManager.processToolCall")
  );

  addResult(
    "route_requires_delegate_before_executor_plugin_manager",
    routeText.indexOf("requireNativeDoubaoSecretlessRuntimeDelegate") <
      routeText.indexOf("executorOptions.pluginManager")
  );

  addResult(
    "server_env_gate_before_delegate_creation",
    serverText.indexOf("ENABLE_NATIVE_DOUBAO_SECRETLESS_RUNTIME_DELEGATE") <
      serverText.indexOf("createNativeDoubaoSecretlessRuntimeDelegate({")
  );

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73am_vcptoolbox_real_runtime_binding_no_provider_verify_and_agent_lab_sync",
    phase: "v0_6_73am_vcptoolbox_real_runtime_binding_no_provider_verify_and_agent_lab_sync",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    vcptoolbox_read_only_in_this_phase: true,
    vcptoolbox_files_checked: Object.values(vcpFiles),
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    output_write_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    remote_write_performed: false,
    commit_performed: false,
    push_performed: false,
    real_runtime_dry_run_allowed_now: false,
    real_provider_execution_allowed_now: false,
    next_safe_task: "request_exact_runtime_dry_run_or_provider_execution_authorization_or_stop",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
