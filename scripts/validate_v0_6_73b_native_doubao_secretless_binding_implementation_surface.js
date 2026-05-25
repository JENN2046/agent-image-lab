#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/V0_6_73B_NATIVE_DOUBAO_SECRETLESS_BINDING_IMPLEMENTATION_SURFACE.md",
  fixture: "tests/schema_examples/v0_6_73b_native_doubao_secretless_binding_implementation_surface.example.yaml",
  baselineDoc: "docs/vcp_integration/V0_6_73A_BASELINE_SYNC_AND_ROUTE_STATE_CHECK.md",
  designDoc: "docs/vcp_integration/NATIVE_DOUBAO_SECRETLESS_RUNTIME_BINDING_DESIGN_GATE.md",
};

const requiredTokens = [
  "phase_name: v0_6_73b_native_doubao_secretless_binding_implementation_surface",
  "source_phase: v0_6_73a_baseline_sync_and_route_state_check",
  "source_commit: 5039271e792a4cb69517109aa4598183ada780fc",
  "binding_surface_kind: native_doubao_secretless_binding_implementation_surface",
  "selected_route: NativeDoubaoImage_one_shot_project_plugin",
  "selected_plugin_id: NativeDoubaoImage",
  "provider_id: native_doubao",
  "model: doubao-seedream-5-0-260128",
  "provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "agent_image_lab_receives_secret_value: false",
  "secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime",
  "callable_surface_type: capability_handle_request_envelope",
  "real_executor_code_created: false",
  "operation_execute_allowed_now: false",
  "receipt_contract_ref: docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md",
  "review_handoff_contract_ref: docs/vcp_integration/V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT.md",
  "v0_6_73_execution_allowed: false",
];

const falseKeys = [
  "provider_binding_ref_is_secret",
  "provider_binding_secret_value_present",
  "agent_image_lab_receives_secret_value",
  "agent_image_lab_may_read_env_file",
  "agent_image_lab_may_read_env_local_file",
  "agent_image_lab_may_read_secret_value",
  "callable_surface_implemented_as_runtime_code_now",
  "real_executor_code_created",
  "provider_runtime_probe_performed",
  "operation_execute_allowed_now",
  "raw_prompt_payload_allowed",
  "raw_provider_payload_allowed",
  "raw_provider_response_allowed",
  "private_absolute_path_allowed",
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
  "provider_binding_ref_redacted",
  "secret_owner_process_must_not_disclose_secret",
  "review_console_required",
  "human_review_required",
  "binding_surface_declared",
  "binding_handle_is_non_secret",
  "agent_image_lab_secretless_boundary_preserved",
  "receipt_contract_deferred_to_next_phase",
  "review_handoff_contract_deferred_to_later_phase",
];

const zeroKeys = [
  "max_provider_calls_now",
  "max_plugin_calls_now",
  "max_api_calls_now",
  "max_images_created_now",
  "max_output_files_written_now",
];

const forbiddenFragments = [
  "DOUBAO_IMAGE_API_KEY:",
  "api_key:",
  "token:",
  "authorization_header:",
  "raw_provider_payload:",
  "raw_provider_response:",
  "provider_contact_performed: true",
  "image_generation_performed: true",
  "secret_value_read_performed: true",
  "operation_execute_allowed_now: true",
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
  validator: "validate_v0_6_73b_native_doubao_secretless_binding_implementation_surface",
  phase_name: "v0_6_73b_native_doubao_secretless_binding_implementation_surface",
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
