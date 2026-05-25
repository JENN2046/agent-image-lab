#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/NATIVE_DOUBAO_SECRETLESS_RUNTIME_BINDING_DESIGN_GATE.md",
  fixture: "tests/schema_examples/native_doubao_secretless_runtime_binding_design.example.yaml",
  preflightValidator: "scripts/validate_real_vcp_agent_generation_preflight_no_call.js",
};

const requiredTokens = [
  "phase_name: v0_6_72b_native_doubao_secretless_runtime_binding_design_gate",
  "source_phase: v0_6_72_real_vcp_agent_generation_preflight_no_call",
  "source_commit: ee23ce11912f5142c9e628cb27a52a9ec0d798ea",
  "provider_binding_as_non_secret_capability_handle: true",
  "agent_image_lab_receives_only_redacted_provider_binding_reference: true",
  "secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime",
  "provider_contact_count_owner: provider_runtime_receipt_bridge",
  "raw_provider_payload_retention_policy: forbidden",
  "output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "receipt_proves_zero_secret_exposure: true",
  "human_review_receives_only_sanitized_result_metadata: true",
  "v0_6_73_execution_allowed: false",
  "blocked_next_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
];

const falseKeys = [
  "provider_binding_ref_is_secret",
  "provider_binding_secret_value_present",
  "agent_image_lab_may_read_env_file",
  "agent_image_lab_may_read_env_local_file",
  "agent_image_lab_may_read_secret_value",
  "agent_image_lab_secret_ownership",
  "raw_provider_payload_retained_by_agent_image_lab",
  "raw_provider_payload_allowed_in_receipt",
  "raw_provider_response_allowed_in_receipt",
  "raw_stdout_stderr_allowed_in_receipt",
  "private_absolute_path_allowed_in_receipt",
  "output_write_allowed_by_this_gate",
  "review_handoff_write_allowed_by_this_gate",
  "review_handoff_raw_payload_allowed",
  "env_file_content_read_performed",
  "env_local_file_content_read_performed",
  "secret_value_read_performed",
  "secret_value_recorded",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "image_binary_read_performed",
  "output_write_performed",
  "receipt_for_successful_generation_written",
  "review_handoff_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "dependency_change_performed",
  "package_json_change_performed",
  "push_tag_release_deploy_performed",
  "v0_6_73_execution_allowed",
  "next_phase_started",
];

const trueKeys = [
  "provider_binding_ref_redacted",
  "provider_binding_as_non_secret_capability_handle",
  "agent_image_lab_receives_only_redacted_provider_binding_reference",
  "output_directory_ref_under_runs_real_generation",
  "human_review_receives_only_sanitized_result_metadata",
  "human_review_sanitized_metadata_only",
  "receipt_proves_zero_secret_exposure",
];

const expectedDesignAnswers = [
  "provider_binding_as_non_secret_capability_handle",
  "agent_image_lab_receives_only_redacted_provider_binding_reference",
  "secret_owner_process",
  "provider_contact_count_owner",
  "raw_provider_payload_retention_policy",
  "output_directory_ref",
  "receipt_proves_zero_secret_exposure",
  "human_review_receives_only_sanitized_result_metadata",
];

const forbiddenFragments = [
  "DOUBAO_IMAGE_API_KEY:",
  "sk-",
  "bearer ",
  "Authorization:",
  ".env.local contents",
  "raw_provider_response:",
  "b64_json:",
];

const blockedMutations = [
  ["env_file_content_read_performed_true", "env_file_content_read_performed: false", "env_file_content_read_performed: true"],
  ["env_local_file_content_read_performed_true", "env_local_file_content_read_performed: false", "env_local_file_content_read_performed: true"],
  ["secret_value_read_performed_true", "secret_value_read_performed: false", "secret_value_read_performed: true"],
  ["provider_contact_performed_true", "provider_contact_performed: false", "provider_contact_performed: true"],
  ["plugin_call_performed_true", "plugin_call_performed: false", "plugin_call_performed: true"],
  ["api_call_performed_true", "api_call_performed: false", "api_call_performed: true"],
  ["image_generation_performed_true", "image_generation_performed: false", "image_generation_performed: true"],
  ["output_write_performed_true", "output_write_performed: false", "output_write_performed: true"],
  ["raw_payload_allowed", "raw_provider_payload_allowed_in_receipt: false", "raw_provider_payload_allowed_in_receipt: true"],
  ["v0_6_73_execution_allowed_true", "v0_6_73_execution_allowed: false", "v0_6_73_execution_allowed: true"],
  ["output_directory_wrong_root", "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/", "runs/other_phase/"],
  ["provider_binding_secret_present", "provider_binding_secret_value_present: false", "provider_binding_secret_value_present: true"],
  ["redacted_binding_ref_false", "provider_binding_ref_redacted: true", "provider_binding_ref_redacted: false"],
  ["human_review_raw_payload_allowed", "review_handoff_raw_payload_allowed: false", "review_handoff_raw_payload_allowed: true"],
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
  const result = { check, passed: Boolean(passed) };
  if (detail !== undefined) result.detail = detail;
  results.push(result);
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

function isSafeOutputDirectory(ref) {
  return (
    ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/" &&
    !ref.includes("..") &&
    !path.isAbsolute(ref) &&
    !/^[A-Za-z]:[\\/]/.test(ref)
  );
}

function evaluatePacket(text) {
  const outputRefs = valuesForKey(text, "output_directory_ref");
  return (
    requiredTokens.every((token) => text.includes(token)) &&
    falseKeys.every((key) => allValuesEqual(text, key, "false")) &&
    trueKeys.every((key) => allValuesEqual(text, key, "true")) &&
    expectedDesignAnswers.every((key) => valuesForKey(text, key).length > 0) &&
    outputRefs.length > 0 &&
    outputRefs.every(isSafeOutputDirectory) &&
    forbiddenFragments.every((fragment) => !text.toLowerCase().includes(fragment.toLowerCase()))
  );
}

for (const [key, file] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(file), file);
}

const doc = read(files.doc);
const fixture = read(files.fixture);
const joined = `${doc}\n${fixture}`;

for (const token of requiredTokens) {
  addResult(`contains_${token}`, joined.includes(token), token);
}

for (const key of falseKeys) {
  addResult(`${key}_is_false`, allValuesEqual(joined, key, "false"), key);
}

for (const key of trueKeys) {
  addResult(`${key}_is_true`, allValuesEqual(joined, key, "true"), key);
}

for (const key of expectedDesignAnswers) {
  addResult(`${key}_answered`, valuesForKey(joined, key).length > 0, key);
}

for (const outputRef of valuesForKey(joined, "output_directory_ref")) {
  addResult("output_directory_ref_is_exact_safe_future_target", isSafeOutputDirectory(outputRef), outputRef);
}

for (const fragment of forbiddenFragments) {
  addResult(`forbidden_fragment_absent_${fragment}`, !joined.toLowerCase().includes(fragment.toLowerCase()), fragment);
}

addResult("valid_packet_passes", evaluatePacket(joined), "doc + fixture");

for (const [caseName, from, to] of blockedMutations) {
  const mutated = joined.replace(from, to);
  addResult(`blocked_case_${caseName}_fails`, !evaluatePacket(mutated), caseName);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_native_doubao_secretless_runtime_binding_design",
  phase_name: "v0_6_72b_native_doubao_secretless_runtime_binding_design_gate",
  source_phase: "v0_6_72_real_vcp_agent_generation_preflight_no_call",
  source_commit: "ee23ce11912f5142c9e628cb27a52a9ec0d798ea",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  blocked_case_count: blockedMutations.length,
  v0_6_73_execution_allowed: false,
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
  next_phase_started: false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
