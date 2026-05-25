#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const runnerPath = "scripts/run_native_doubao_image_generation.js";
const docPath = "docs/vcp_integration/V0_6_73G_SECRETLESS_RUNTIME_BINDING_IMPLEMENTATION_SURFACE.md";
const fixturePath = "tests/schema_examples/v0_6_73g_secretless_runtime_binding_implementation_surface.example.yaml";

const runner = require(path.join(root, runnerPath));

const requiredFiles = [runnerPath, docPath, fixturePath];
const requiredDocTokens = [
  "phase: v0_6_73g_secretless_runtime_binding_implementation_surface",
  "result: COMPLETED_VALIDATED",
  "provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "env_file_content_read_allowed: false",
  "secret_value_read_allowed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "image_generation_performed: false",
  "image_binary_read_performed: false",
  "output_write_performed: false",
  "next_safe_task: provide_exact_secretless_provider_runtime_bridge_before_retry"
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

function hasToken(text, token) {
  return text.includes(token);
}

async function main() {
  for (const file of requiredFiles) {
    addResult(`file_exists:${file}`, fs.existsSync(repoPath(file)), file);
  }

  const runnerSource = read(runnerPath);
  const joinedDocs = `${read(docPath)}\n${read(fixturePath)}`;
  for (const token of requiredDocTokens) {
    addResult(`docs_contain:${token}`, hasToken(joinedDocs, token), token);
  }

  addResult("runner_exports_secretless_binding_ref", runner.SECRETLESS_PROVIDER_BINDING_REF === "native_doubao:capability:owner-runtime:v0_6_73", runnerPath);
  addResult("runner_exports_secretless_helpers", typeof runner.isSecretlessBindingRequest === "function" && typeof runner.validateSecretlessBindingOptions === "function", runnerPath);
  addResult("runner_keeps_legacy_env_gate_for_old_preflight_validator", runnerSource.includes("if (options.dryRun === false && options.execution_authorized === true)") && runnerSource.includes("loadEnvLocal()"), runnerPath);
  addResult("runner_secretless_branch_mentions_no_env_content_read", runnerSource.includes("Secretless binding mode must not read .env.local content at all."), runnerPath);

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
  addResult("secretless_preflight_passes_without_env_read", preflight.preflight_passed === true && preflight.secretless_binding_mode === true, preflight);
  addResult("secretless_preflight_records_zero_secret_access", preflight.env_file_content_read_performed === false && preflight.secret_value_read_performed === false, preflight);
  addResult("secretless_preflight_redacts_binding_ref", preflight.provider_binding_ref === "native_doubao:capability:owner-runtime:<redacted>", preflight.provider_binding_ref);

  const result = await runner.run(options);
  addResult("secretless_real_mode_fails_closed_without_runtime", result.status === "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE", result.status);
  addResult("secretless_real_mode_has_no_provider_or_api_call", result.provider_contact_performed === false && result.plugin_call_performed === false && result.api_call_performed === false, result);
  addResult("secretless_real_mode_has_no_image_or_output", result.image_generation_performed === false && result.image_binary_read_performed === false && result.output_write_performed === false, result);
  addResult("secretless_real_mode_has_no_env_or_secret_read", result.env_file_content_read_performed === false && result.secret_value_read_performed === false, result);

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73g_secretless_runtime_binding_implementation_surface",
    phase: "v0_6_73g_secretless_runtime_binding_implementation_surface",
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
    next_safe_task: "provide_exact_secretless_provider_runtime_bridge_before_retry",
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
