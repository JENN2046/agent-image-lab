#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md",
  fixture: "tests/schema_examples/v0_6_73c_secretless_provider_receipt_contract.example.yaml",
  bindingSurfaceDoc: "docs/vcp_integration/V0_6_73B_NATIVE_DOUBAO_SECRETLESS_BINDING_IMPLEMENTATION_SURFACE.md",
};

const requiredTokens = [
  "phase_name: v0_6_73c_secretless_provider_receipt_contract",
  "source_phase: v0_6_73b_native_doubao_secretless_binding_implementation_surface",
  "source_commit: 9b723553f928ebdfa66f80ea97a70ee40cf5b607",
  "receipt_contract_kind: native_doubao_secretless_provider_receipt_contract",
  "future_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "future_receipt_ref_under: reports/provider_receipts/",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "secret_value_recorded_allowed: false",
  "raw_provider_payload_recorded_allowed: false",
  "raw_provider_response_recorded_allowed: false",
  "provider_contact_count_recorded: true",
  "plugin_call_count_recorded: true",
  "api_call_count_recorded: true",
  "image_count_recorded: true",
  "sanitized_result_metadata_only: true",
  "receipt_write_allowed_now: false",
  "successful_generation_receipt_written: false",
  "v0_6_73_execution_allowed: false",
];

const falseKeys = [
  "provider_binding_ref_is_secret",
  "provider_binding_secret_value_present",
  "secret_value_recorded_allowed",
  "env_file_path_recorded_allowed",
  "raw_prompt_payload_recorded_allowed",
  "raw_provider_payload_recorded_allowed",
  "raw_provider_response_recorded_allowed",
  "raw_stdout_stderr_recorded_allowed",
  "private_absolute_path_recorded_allowed",
  "receipt_write_allowed_now",
  "successful_generation_receipt_written",
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
  "provider_contact_count_recorded",
  "plugin_call_count_recorded",
  "api_call_count_recorded",
  "image_count_recorded",
  "sanitized_output_refs_allowed",
  "sanitized_result_metadata_only",
  "receipt_contract_declared",
  "future_receipt_path_is_project_relative",
  "future_receipt_path_under_provider_receipts",
  "receipt_secretless_boundary_preserved",
  "receipt_records_counts_not_secrets",
];

const zeroKeys = [
  "max_provider_calls_now",
  "max_plugin_calls_now",
  "max_api_calls_now",
  "max_images_created_now",
];

const forbiddenFragments = [
  "DOUBAO_IMAGE_API_KEY:",
  "api_key:",
  "token:",
  "authorization_header:",
  "raw_provider_payload:",
  "raw_provider_response:",
  "secret_value_read_performed: true",
  "successful_generation_receipt_written: true",
  "receipt_write_allowed_now: true",
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

for (const ref of valuesForKey(joined, "future_receipt_ref")) {
  addResult("future_receipt_ref_under_allowed_root", isSafeProjectRef(ref, "reports/provider_receipts/"), ref);
}

for (const ref of valuesForKey(joined, "output_directory_ref")) {
  addResult("output_directory_ref_under_allowed_root", isSafeProjectRef(ref, "runs/real_generation/"), ref);
}

for (const fragment of forbiddenFragments) {
  addResult(`forbidden_fragment_absent_${fragment}`, !joined.includes(fragment), fragment);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v0_6_73c_secretless_provider_receipt_contract",
  phase_name: "v0_6_73c_secretless_provider_receipt_contract",
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
