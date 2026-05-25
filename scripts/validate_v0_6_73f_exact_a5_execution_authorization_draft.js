#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/V0_6_73F_EXACT_A5_EXECUTION_AUTHORIZATION_DRAFT.md",
  fixture: "tests/schema_examples/v0_6_73f_exact_a5_execution_authorization_draft.example.yaml",
  readiness: "docs/vcp_integration/V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET.md",
};

const requiredTokens = [
  "phase_name: v0_6_73f_exact_a5_execution_authorization_draft",
  "source_phase: v0_6_73e_one_shot_execution_readiness_packet",
  "source_commit: d255c13e739ca55061bda3485a4a02f87c3a6e07",
  "authorization_packet_kind: native_doubao_exact_a5_execution_authorization_draft",
  "authorization_status: draft_not_active",
  "authorization_active: false",
  "can_execute_now: false",
  "requires_future_explicit_human_activation: true",
  "future_activation_must_name_phase: v0_6_73_real_vcp_agent_generation_one_shot",
  "future_activation_must_preserve_secretless_binding: true",
  "source_readiness_packet_ref: docs/vcp_integration/V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET.md",
  "provider_binding_ref_redacted: true",
  "provider_binding_ref_is_secret: false",
  "future_max_provider_calls: 1",
  "future_max_plugin_calls: 1",
  "future_max_api_calls: 1",
  "future_max_images_created: 1",
  "retry_limit: 0",
  "overwrite_existing_files_allowed: false",
  "v0_6_73_execution_allowed: false",
  "next_phase_started: false",
];

const falseKeys = [
  "authorization_active",
  "can_execute_now",
  "provider_binding_ref_is_secret",
  "provider_binding_secret_value_present",
  "overwrite_existing_files_allowed",
  "raw_prompt_payload_allowed",
  "raw_provider_payload_allowed",
  "raw_provider_response_allowed",
  "raw_stdout_stderr_allowed",
  "private_absolute_path_allowed",
  "secret_value_allowed",
  "env_file_content_read_allowed",
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
  "receipt_write_performed",
  "review_handoff_write_performed",
  "env_file_content_read_performed",
  "env_local_file_content_read_performed",
  "secret_value_read_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "v0_6_73_execution_allowed",
  "next_phase_started",
  "current_execution_performed",
];

const trueKeys = [
  "requires_future_explicit_human_activation",
  "future_activation_must_preserve_secretless_binding",
  "provider_binding_ref_redacted",
  "human_review_required",
  "review_console_required",
  "authorization_draft_declared",
  "authorization_status_is_draft_not_active",
  "secretless_binding_required",
  "future_budget_is_one_shot",
];

const oneKeys = [
  "future_max_provider_calls",
  "future_max_plugin_calls",
  "future_max_api_calls",
  "future_max_images_created",
];

const zeroKeys = ["retry_limit"];

const forbiddenFragments = [
  "DOUBAO_IMAGE_API_KEY:",
  "api_key:",
  "token:",
  "authorization_header:",
  "raw_provider_payload:",
  "raw_provider_response:",
  "authorization_active: true",
  "can_execute_now: true",
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

for (const key of oneKeys) {
  addResult(`${key}_is_one`, allValuesEqual(joined, key, "1"), key);
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

for (const ref of valuesForKey(joined, "future_receipt_ref")) {
  addResult("future_receipt_ref_under_allowed_root", isSafeProjectRef(ref, "reports/provider_receipts/"), ref);
}

for (const ref of valuesForKey(joined, "future_review_handoff_ref")) {
  addResult("future_review_handoff_ref_under_allowed_root", isSafeProjectRef(ref, "review_console/live_receipt_bridge/"), ref);
}

for (const fragment of forbiddenFragments) {
  addResult(`forbidden_fragment_absent_${fragment}`, !joined.includes(fragment), fragment);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v0_6_73f_exact_a5_execution_authorization_draft",
  phase_name: "v0_6_73f_exact_a5_execution_authorization_draft",
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
  next_phase_started: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
