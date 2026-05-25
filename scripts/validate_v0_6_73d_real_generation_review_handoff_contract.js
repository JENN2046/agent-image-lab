#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT.md",
  fixture: "tests/schema_examples/v0_6_73d_real_generation_review_handoff_contract.example.yaml",
  receiptContractDoc: "docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md",
};

const requiredTokens = [
  "phase_name: v0_6_73d_real_generation_review_handoff_contract",
  "source_phase: v0_6_73c_secretless_provider_receipt_contract",
  "source_commit: 60f4e769a8de1906425d0e970998962eb6e51a3d",
  "review_handoff_contract_kind: native_doubao_real_generation_review_handoff_contract",
  "future_review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json",
  "future_review_handoff_ref_under: review_console/live_receipt_bridge/",
  "future_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "human_review_required: true",
  "review_console_required: true",
  "review_handoff_write_allowed_now: false",
  "image_binary_read_allowed_now: false",
  "sanitized_result_metadata_only: true",
  "raw_provider_payload_allowed: false",
  "raw_provider_response_allowed: false",
  "v0_6_73_execution_allowed: false",
];

const falseKeys = [
  "provider_binding_ref_is_secret",
  "review_handoff_write_allowed_now",
  "review_handoff_written",
  "image_binary_embedded_in_handoff_allowed",
  "image_binary_read_allowed_now",
  "image_metadata_extraction_allowed_now",
  "raw_prompt_payload_allowed",
  "raw_provider_payload_allowed",
  "raw_provider_response_allowed",
  "secret_value_allowed",
  "private_absolute_path_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
  "DailyNote_write_allowed",
  "VCP_memory_write_allowed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "mcp_runtime_performed",
  "VCPToolBox_runtime_performed",
  "VCPChat_runtime_performed",
  "image_generation_performed",
  "image_binary_read_performed",
  "image_metadata_extraction_performed",
  "output_write_performed",
  "review_handoff_write_performed",
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
  "human_review_required",
  "review_console_required",
  "output_ref_placeholder_only_now",
  "sanitized_result_metadata_only",
  "review_handoff_contract_declared",
  "future_handoff_path_is_project_relative",
  "future_handoff_path_under_review_console_bridge",
  "human_review_receives_sanitized_metadata_only",
];

const forbiddenFragments = [
  "DOUBAO_IMAGE_API_KEY:",
  "api_key:",
  "token:",
  "authorization_header:",
  "raw_provider_payload:",
  "raw_provider_response:",
  "image_binary:",
  "private_absolute_path:",
  "image_binary_read_performed: true",
  "review_handoff_write_performed: true",
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

for (const ref of valuesForKey(joined, "future_review_handoff_ref")) {
  addResult("future_review_handoff_ref_under_allowed_root", isSafeProjectRef(ref, "review_console/live_receipt_bridge/"), ref);
}

for (const ref of valuesForKey(joined, "future_receipt_ref")) {
  addResult("future_receipt_ref_under_allowed_root", isSafeProjectRef(ref, "reports/provider_receipts/"), ref);
}

for (const fragment of forbiddenFragments) {
  addResult(`forbidden_fragment_absent_${fragment}`, !joined.includes(fragment), fragment);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v0_6_73d_real_generation_review_handoff_contract",
  phase_name: "v0_6_73d_real_generation_review_handoff_contract",
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
