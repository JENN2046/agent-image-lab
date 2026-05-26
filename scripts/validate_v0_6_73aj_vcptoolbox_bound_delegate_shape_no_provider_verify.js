#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const shape = require("./native_doubao_vcptoolbox_bound_delegate_shape_no_provider.js");

const root = path.resolve(__dirname, "..");
const files = {
  doc: "docs/vcp_integration/V0_6_73AJ_VCPTOOLBOX_BOUND_DELEGATE_SHAPE_NO_PROVIDER_VERIFY.md",
  fixture: "tests/schema_examples/v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify.example.yaml",
  harness: "scripts/native_doubao_vcptoolbox_bound_delegate_shape_no_provider.js"
};

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

const results = [];
const errors = [];
function addResult(check, passed, detail = null) {
  results.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
  if (!passed) errors.push({ check, ...(detail === null ? {} : { detail }) });
}

async function main() {
  for (const file of Object.values(files)) {
    addResult(`file_exists:${file}`, exists(file), file);
  }

  const joined = `${read(files.doc)}\n${read(files.fixture)}`;
  for (const token of [
    "phase: v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify",
    "result: COMPLETED_VALIDATED_VCPTOOLBOX_BOUND_DELEGATE_SHAPE_NO_PROVIDER",
    "real_vcptoolbox_modified: false",
    "real_vcptoolbox_executed: false",
    "mock_plugin_manager_only: true",
    "tool_name: DoubaoGen",
    "command: generate",
    "requestSource: agent-image-lab-secretless-runtime",
    "provider_contact_performed: false",
    "plugin_call_performed: false",
    "api_call_performed: false",
    "image_generation_performed: false",
    "output_write_performed: false",
    "env_file_content_read_performed: false",
    "secret_value_read_performed: false",
    "next_safe_task: draft_vcptoolbox_real_runtime_binding_patch_or_stop"
  ]) {
    addResult(`docs_contain:${token}`, joined.includes(token), token);
  }

  addResult("harness_exports_shape_helpers",
    typeof shape.createVcpToolBoxBoundDelegateShapeNoProvider === "function" &&
    typeof shape.createMockPluginManager === "function" &&
    typeof shape.buildDoubaoToolArgs === "function" &&
    typeof shape.runShapeVerification === "function",
    files.harness);

  const toolArgs = shape.buildDoubaoToolArgs({
    model: "doubao-seedream-5-0-260128"
  }, "mock prompt");
  addResult("build_doubao_tool_args_shape",
    toolArgs.command === "generate" &&
    toolArgs.prompt === "mock prompt" &&
    toolArgs.model === "doubao-seedream-5-0-260128" &&
    toolArgs.resolution === "1024x1024",
    toolArgs);

  const summary = await shape.runShapeVerification();
  addResult("shape_harness_passed", summary.passed === true, summary.status);
  addResult("shape_harness_calls_mock_plugin_manager_once", summary.mock_plugin_manager_call_count === 1, summary.mock_plugin_manager_call_count);
  const call = summary.mock_plugin_manager_calls[0] || {};
  addResult("shape_harness_call_targets_doubaogen", call.toolName === "DoubaoGen", call);
  addResult("shape_harness_call_uses_secretless_runtime_context",
    call.executionContext &&
    call.executionContext.requestSource === "agent-image-lab-secretless-runtime" &&
    call.executionContext.providerBindingRefRedacted === true,
    call.executionContext);
  addResult("shape_harness_no_external_side_effects",
    summary.provider_contact_performed === false &&
    summary.plugin_call_performed === false &&
    summary.api_call_performed === false &&
    summary.image_generation_performed === false &&
    summary.output_write_performed === false &&
    summary.env_file_content_read_performed === false &&
    summary.secret_value_read_performed === false,
    summary);

  const passed = errors.length === 0;
  const report = {
    validator: "validate_v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify",
    phase: "v0_6_73aj_vcptoolbox_bound_delegate_shape_no_provider_verify",
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
    real_vcptoolbox_modified: false,
    real_vcptoolbox_executed: false,
    v0_6_73_execution_allowed: false,
    next_safe_task: "draft_vcptoolbox_real_runtime_binding_patch_or_stop",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
