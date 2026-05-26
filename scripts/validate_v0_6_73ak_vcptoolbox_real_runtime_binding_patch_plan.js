#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  doc: "docs/vcp_integration/V0_6_73AK_VCPTOOLBOX_REAL_RUNTIME_BINDING_PATCH_PLAN.md",
  fixture: "tests/schema_examples/v0_6_73ak_vcptoolbox_real_runtime_binding_patch_plan.example.yaml"
};

const requiredTokens = [
  "phase: v0_6_73ak_vcptoolbox_real_runtime_binding_patch_plan",
  "result: COMPLETED_VALIDATED_PATCH_PLAN_ONLY",
  "real_vcptoolbox_modified: false",
  "real_vcptoolbox_executed: false",
  "A:\\VCP\\apps\\VCPToolBox\\routes\\admin\\aiImageAgents.js",
  "A:\\VCP\\apps\\VCPToolBox\\modules\\aiImagePipelineExecutor.js",
  "A:\\VCP\\apps\\VCPToolBox\\modules\\aiImageExecutionAdapter.js",
  "A:\\VCP\\apps\\VCPToolBox\\server.js",
  "createNativeDoubaoSecretlessRuntimeDelegate",
  "pluginManager.processToolCall",
  "\"DoubaoGen\"",
  "command: \"generate\"",
  "requestSource: \"agent-image-lab-secretless-runtime\"",
  "explicit permission to modify A:\\VCP\\apps\\VCPToolBox",
  "no .env/.env.local/config.env/secret value reads",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "image_generation_performed: false",
  "secret_value_read_performed: false",
  "remote_write_performed: false",
  "real_vcptoolbox_patch_allowed_now: false",
  "real_provider_execution_allowed_now: false",
  "next_safe_task: request_exact_vcptoolbox_patch_authorization_or_stop"
];

const forbiddenTokens = [
  "real_vcptoolbox_modified: true",
  "real_vcptoolbox_executed: true",
  "provider_contact_performed: true",
  "plugin_call_performed: true",
  "api_call_performed: true",
  "image_generation_performed: true",
  "secret_value_read_performed: true",
  "remote_write_performed: true",
  "push_performed: true",
  "real_vcptoolbox_patch_allowed_now: true",
  "real_provider_execution_allowed_now: true"
];

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

function main() {
  for (const file of Object.values(files)) {
    addResult(`file_exists:${file}`, exists(file), file);
  }

  const joined = `${read(files.doc)}\n${read(files.fixture)}`;
  for (const token of requiredTokens) {
    addResult(`contains:${token}`, joined.includes(token), token);
  }

  for (const token of forbiddenTokens) {
    addResult(`forbidden_absent:${token}`, !joined.includes(token), token);
  }

  addResult("plan_mentions_all_required_authorization_items",
    [
      "exact target file list",
      "whether a new module file is allowed",
      "no provider/API calls during patch validation",
      "no real image generation during patch validation",
      "no remote write, commit, or push unless separately authorized"
    ].every((token) => joined.includes(token)));

  addResult("plan_defines_future_validation_without_provider",
    joined.includes("future_validation_without_provider") &&
    joined.includes("mock pluginManager.processToolCall") &&
    joined.includes("external side-effect flags remain false"));

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73ak_vcptoolbox_real_runtime_binding_patch_plan",
    phase: "v0_6_73ak_vcptoolbox_real_runtime_binding_patch_plan",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    real_vcptoolbox_modified: false,
    real_vcptoolbox_executed: false,
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
    next_safe_task: "request_exact_vcptoolbox_patch_authorization_or_stop",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
