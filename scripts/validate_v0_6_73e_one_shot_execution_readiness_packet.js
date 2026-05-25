#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/V0_6_73E_ONE_SHOT_EXECUTION_READINESS_PACKET.md",
  fixture: "tests/schema_examples/v0_6_73e_one_shot_execution_readiness_packet.example.yaml",
  baseline: "docs/vcp_integration/V0_6_73A_BASELINE_SYNC_AND_ROUTE_STATE_CHECK.md",
  binding: "docs/vcp_integration/V0_6_73B_NATIVE_DOUBAO_SECRETLESS_BINDING_IMPLEMENTATION_SURFACE.md",
  receipt: "docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md",
  handoff: "docs/vcp_integration/V0_6_73D_REAL_GENERATION_REVIEW_HANDOFF_CONTRACT.md",
};

const requiredTokens = [
  "phase_name: v0_6_73e_one_shot_execution_readiness_packet",
  "source_phase: v0_6_73d_real_generation_review_handoff_contract",
  "source_commit: fd424c5599486bf492e3dc9a94b8e5ffa99bb72b",
  "readiness_packet_kind: native_doubao_one_shot_execution_readiness_packet",
  "selected_route: NativeDoubaoImage_one_shot_project_plugin",
  "provider_binding_ref_redacted: true",
  "secretless_binding_contract_present: true",
  "secretless_receipt_contract_present: true",
  "review_handoff_contract_present: true",
  "future_max_provider_calls: 1",
  "future_max_plugin_calls: 1",
  "future_max_api_calls: 1",
  "future_max_images_created: 1",
  "max_provider_calls_now: 0",
  "execution_authorization_required: true",
  "execution_allowed_now: false",
  "exact_a5_authorization_draft_required: true",
  "v0_6_73_execution_allowed: false",
];

const falseKeys = [
  "provider_binding_ref_is_secret",
  "provider_binding_secret_value_present",
  "execution_allowed_now",
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
];

const trueKeys = [
  "provider_binding_ref_redacted",
  "secretless_binding_contract_present",
  "secretless_receipt_contract_present",
  "review_handoff_contract_present",
  "human_review_required",
  "review_console_required",
  "execution_authorization_required",
  "exact_a5_authorization_draft_required",
  "baseline_synced",
  "mvp_validation_green_at_packet_time",
  "selected_route_stable",
  "prompt_package_ref_project_relative",
  "output_directory_ref_project_relative",
  "output_directory_ref_under_runs_real_generation",
  "receipt_ref_project_relative",
  "review_handoff_ref_project_relative",
  "no_raw_secret_path_required",
  "no_raw_provider_payload_retention",
  "human_review_gate_required",
  "exact_a5_authorization_still_required",
  "readiness_packet_declared",
  "all_contract_refs_present",
  "future_budget_is_one_shot",
  "current_call_budget_is_zero",
];

const oneKeys = [
  "future_max_provider_calls",
  "future_max_plugin_calls",
  "future_max_api_calls",
  "future_max_images_created",
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
  "execution_allowed_now: true",
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
  validator: "validate_v0_6_73e_one_shot_execution_readiness_packet",
  phase_name: "v0_6_73e_one_shot_execution_readiness_packet",
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
