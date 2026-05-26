#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const vcpToolBoxRoot = "A:\\VCP\\apps\\VCPToolBox";

const files = {
  doc: "docs/vcp_integration/V0_6_73AN_VCPTOOLBOX_RUNTIME_DRY_RUN_NO_PROVIDER_VERIFY.md",
  fixture: "tests/schema_examples/v0_6_73an_vcptoolbox_runtime_dry_run_no_provider_verify.example.yaml"
};

const requiredTokens = [
  "phase: v0_6_73an_vcptoolbox_runtime_dry_run_no_provider_verify",
  "result: COMPLETED_VALIDATED_RUNTIME_DRY_RUN_NO_PROVIDER",
  "vcptoolbox_runtime_probe_performed: true",
  "provider_boundary: mock_processToolCall_only",
  "server_started: false",
  "server_js_required: false",
  "env_file_content_read: false",
  "route_response_mode: real_execution",
  "executor_result_status: completed",
  "executor_result_mode: real_execution",
  "mock_processToolCall_count: 1",
  "toolName: DoubaoGen",
  "command: generate",
  "requestSource: agent-image-lab-secretless-runtime",
  "providerBindingRefRedacted: true",
  "no_server_start: true",
  "no_server_js_require: true",
  "no_env_file_content_read: true",
  "no_secret_value_read: true",
  "no_real_provider_contact: true",
  "no_real_api_call: true",
  "no_real_image_generation: true",
  "no_remote_write: true",
  "real_provider_execution_allowed_now: false",
  "next_safe_task: request_exact_provider_execution_authorization_or_stop"
];

const forbiddenTokens = [
  "server_started: true",
  "server_js_required: true",
  "env_file_content_read: true",
  "no_env_file_content_read: false",
  "no_secret_value_read: false",
  "no_real_provider_contact: false",
  "no_real_api_call: false",
  "no_real_image_generation: false",
  "no_remote_write: false",
  "provider_contact_performed: true",
  "plugin_call_performed: true",
  "api_call_performed: true",
  "image_generation_performed: true",
  "secret_value_read_performed: true",
  "remote_write_performed: true",
  "push_performed: true",
  "real_provider_execution_allowed_now: true"
];

function localPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(localPath(relativePath), "utf8");
}

function addResult(results, errors, check, passed, detail = null) {
  results.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
  if (!passed) errors.push({ check, ...(detail === null ? {} : { detail }) });
}

function hasExactLineToken(text, token) {
  return text.split(/\r?\n/).some((line) => line.trim() === token);
}

async function runRuntimeProbe() {
  process.env.AIGENT_PIPELINE_ALLOW_EXECUTION = "true";

  const { handleAiImagePipelineRequest } = require(path.join(
    vcpToolBoxRoot,
    "routes",
    "admin",
    "aiImageAgents"
  ));
  const {
    createNativeDoubaoSecretlessRuntimeDelegate
  } = require(path.join(
    vcpToolBoxRoot,
    "modules",
    "nativeDoubaoSecretlessRuntimeDelegate"
  ));

  const calls = [];
  const mockPluginManager = {
    async processToolCall(toolName, toolArgs, requestIp, executionContext) {
      calls.push({ toolName, toolArgs, requestIp, executionContext });
      return {
        imageUrl: "mock://native-doubao-runtime-dry-run",
        fileName: "mock-runtime-dry-run.png"
      };
    }
  };

  const delegate = createNativeDoubaoSecretlessRuntimeDelegate({
    enabled: true,
    pluginManager: mockPluginManager,
    requestIp: "127.0.0.1",
    bridgeId: "v0_6_73an_mock_runtime_dry_run"
  });

  const req = {
    adminAuthUser: "mock-operator",
    body: {
      dryRun: false,
      confirm: true,
      pipelineId: "v0_6_73an_runtime_dry_run",
      taskId: "v0_6_73an_runtime_dry_run_task",
      plan: {
        steps: [
          {
            type: "generate_image",
            plugin: "DoubaoGen",
            prompt: "mock prompt only - no provider",
            resolution: "1024x1024"
          }
        ]
      },
      requestFlags: {
        reason: "mock runtime dry-run no provider"
      }
    }
  };

  const response = await handleAiImagePipelineRequest(req, {
    forceDryRun: false,
    pluginManager: mockPluginManager,
    requireNativeDoubaoSecretlessRuntimeDelegate: true,
    nativeDoubaoSecretlessRuntimeDelegate: delegate
  });

  return { response, calls };
}

async function main() {
  const results = [];
  const errors = [];

  for (const file of Object.values(files)) {
    addResult(results, errors, `file_exists:${file}`, fs.existsSync(localPath(file)), file);
  }

  const joined = `${read(files.doc)}\n${read(files.fixture)}`;
  for (const token of requiredTokens) {
    addResult(results, errors, `contains:${token}`, joined.includes(token), token);
  }
  for (const token of forbiddenTokens) {
    addResult(results, errors, `forbidden_absent:${token}`, !hasExactLineToken(joined, token), token);
  }

  const { response, calls } = await runRuntimeProbe();
  const call = calls[0] || {};

  addResult(results, errors, "runtime_probe_response_ok", response && response.ok === true);
  addResult(results, errors, "runtime_probe_result_completed",
    response && response.result && response.result.status === "completed");
  addResult(results, errors, "runtime_probe_mock_call_count", calls.length === 1, calls.length);
  addResult(results, errors, "runtime_probe_tool_shape",
    call.toolName === "DoubaoGen" &&
    call.toolArgs &&
    call.toolArgs.command === "generate");
  addResult(results, errors, "runtime_probe_secretless_context",
    call.executionContext &&
    call.executionContext.requestSource === "agent-image-lab-secretless-runtime" &&
    call.executionContext.providerBindingRefRedacted === true);

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73an_vcptoolbox_runtime_dry_run_no_provider_verify",
    phase: "v0_6_73an_vcptoolbox_runtime_dry_run_no_provider_verify",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    route_response_ok: response && response.ok === true,
    route_response_mode: response && response.mode,
    executor_result_status: response && response.result && response.result.status,
    executor_result_mode: response && response.result && response.result.mode,
    mock_processToolCall_count: calls.length,
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
    real_provider_execution_allowed_now: false,
    next_safe_task: "request_exact_provider_execution_authorization_or_stop",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
