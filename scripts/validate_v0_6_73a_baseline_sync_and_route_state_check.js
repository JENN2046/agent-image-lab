#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/V0_6_73A_BASELINE_SYNC_AND_ROUTE_STATE_CHECK.md",
  fixture: "tests/schema_examples/v0_6_73a_baseline_sync_and_route_state_check.example.yaml",
  designDoc: "docs/vcp_integration/NATIVE_DOUBAO_SECRETLESS_RUNTIME_BINDING_DESIGN_GATE.md",
  preflightDoc: "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_PREFLIGHT_NO_CALL.md",
  promptPackage: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
};

const requiredTokens = [
  "phase_name: v0_6_73a_baseline_sync_and_route_state_check",
  "source_commit: 8e011d3af8e6fcb8b22c1818019650df995ca024",
  "source_phase: mvp_legacy_debt_validator_repair",
  "baseline_commit: 8e011d3af8e6fcb8b22c1818019650df995ca024",
  "baseline_validation_expected: npm_run_validate_mvp_passed",
  "selected_route: NativeDoubaoImage_one_shot_project_plugin",
  "selected_plugin_id: NativeDoubaoImage",
  "provider_id: native_doubao",
  "model: doubao-seedream-5-0-260128",
  "prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
  "output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "secretless_design_ref: docs/vcp_integration/NATIVE_DOUBAO_SECRETLESS_RUNTIME_BINDING_DESIGN_GATE.md",
  "preflight_no_call_ref: docs/vcp_integration/REAL_VCP_AGENT_GENERATION_PREFLIGHT_NO_CALL.md",
  "provider_binding_ref_required_before_execution: true",
  "provider_binding_ref_secret_value_allowed: false",
  "review_console_required: true",
  "human_review_required: true",
  "v0_6_73_execution_allowed: false",
];

const falseKeys = [
  "provider_binding_ref_secret_value_allowed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "mcp_runtime_performed",
  "VCPToolBox_runtime_performed",
  "VCPChat_runtime_performed",
  "image_generation_performed",
  "image_binary_read_performed",
  "output_write_performed",
  "env_file_content_read_performed",
  "env_local_file_content_read_performed",
  "secret_value_read_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "v0_6_73_execution_allowed",
];

const trueKeys = [
  "provider_binding_ref_required_before_execution",
  "review_console_required",
  "human_review_required",
  "baseline_commit_recorded",
  "route_state_recorded",
  "secretless_design_reference_recorded",
  "preflight_no_call_reference_recorded",
  "mvp_legacy_debt_repair_baseline_preserved",
  "execution_boundary_all_false",
];

const zeroKeys = [
  "max_provider_calls_now",
  "max_plugin_calls_now",
  "max_api_calls_now",
  "max_images_created_now",
];

const forbiddenFragments = [
  "DOUBAO_IMAGE_API_KEY:",
  "sk-",
  "Authorization:",
  "b64_json:",
  "raw_provider_response:",
  "provider_contact_performed: true",
  "image_generation_performed: true",
  "secret_value_read_performed: true",
];

const results = [];
const errors = [];

function repoPath(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), detail });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function valuesForKey(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...text.matchAll(new RegExp(`^\\s*${escaped}:\\s*(.*?)\\s*$`, "gm"))]
    .map((match) => match[1].replace(/^["']|["']$/g, ""));
}

function allValuesEqual(text, key, expected) {
  const values = valuesForKey(text, key);
  return values.length > 0 && values.every((value) => value === expected);
}

function isSafeProjectRef(ref, prefix) {
  return ref.startsWith(prefix) && !ref.includes("..") && !path.isAbsolute(ref) && !/^[A-Za-z]:[\\/]/.test(ref);
}

for (const [key, file] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(file), file);
}

const joined = [read(files.doc), read(files.fixture)].join("\n");

for (const token of requiredTokens) {
  addResult(`contains_${token}`, joined.includes(token), token);
}

for (const key of falseKeys) {
  addResult(`${key}_is_false`, allValuesEqual(joined, key, "false"), key);
}

for (const key of trueKeys) {
  addResult(`${key}_is_true`, allValuesEqual(joined, key, "true"), key);
}

for (const key of zeroKeys) {
  addResult(`${key}_is_zero`, allValuesEqual(joined, key, "0"), key);
}

for (const ref of valuesForKey(joined, "prompt_package_ref")) {
  addResult("prompt_package_ref_under_allowed_root", isSafeProjectRef(ref, "prompts/image_generation/"), ref);
}

for (const ref of valuesForKey(joined, "output_directory_ref")) {
  addResult("output_directory_ref_under_allowed_root", isSafeProjectRef(ref, "runs/real_generation/"), ref);
}

for (const fragment of forbiddenFragments) {
  addResult(`forbidden_fragment_absent_${fragment}`, !joined.includes(fragment), fragment);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v0_6_73a_baseline_sync_and_route_state_check",
  phase_name: "v0_6_73a_baseline_sync_and_route_state_check",
  source_commit: "8e011d3af8e6fcb8b22c1818019650df995ca024",
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
  next_phase_started: true,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
