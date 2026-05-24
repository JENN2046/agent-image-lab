#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ACTION_PACKET.md",
  fixture: "tests/schema_examples/real_vcp_agent_generation_action_packet.example.yaml",
  activationDoc: "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ROUTE_ACTIVATION_GATE.md",
  activationValidator: "scripts/validate_real_vcp_agent_generation_route_activation_gate.js",
  pluginProfile: "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
  runner: "scripts/run_native_doubao_image_generation.js",
  adapter: "adapters/image_generation/native_doubao_adapter.js",
  promptPackage: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
};

const requiredTokens = [
  "phase: v0_6_71_real_vcp_agent_generation_action_packet",
  "source_phase: v0_6_70_real_vcp_agent_generation_route_activation_gate",
  "goal_target: to_real_VCP_agent_generation",
  "packet_id: amber_b_v0_6_71_real_vcp_agent_generation_one_shot",
  "task_id: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "lane: Amber_B_provider_image",
  "caller: VCP_Agent",
  "selected_route: NativeDoubaoImage_one_shot_project_plugin",
  "selected_plugin_id: NativeDoubaoImage",
  "command: generate",
  "mode: text_to_image",
  "model: doubao-seedream-5-0-260128",
  "prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
  "output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "max_plugin_calls: 1",
  "max_provider_calls: 1",
  "max_api_calls: 1",
  "max_images_created: 1",
  "retry_limit: 0",
  "overwrite_existing_files_allowed: false",
  "secret_value_read_allowed: false",
  "raw_private_data_print_allowed: false",
  "raw_provider_payload_retention_policy: forbidden",
  "raw_stdout_stderr_retention_policy: forbidden",
  "receipt_required: true",
  "review_handoff_required: true",
  "human_review_required: true",
  "secret_value_read_required",
  "env_file_value_read_required",
  "second_call_required",
  "retry_required",
  "next_recommended: v0_6_72_real_vcp_agent_generation_preflight_no_call",
];

const falseKeys = [
  "memory_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
  "DailyNote_write_allowed",
  "VCP_memory_write_allowed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "image_binary_read_performed",
  "output_write_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "env_value_read_performed",
  "secret_value_read_performed",
  "push_performed",
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

function allFalseOrAbsent(text, key) {
  return valuesForKey(text, key).every((value) => value === "false" || value === "null");
}

for (const [key, file] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(file), file);
}

const joined = [read(files.doc), read(files.fixture)].join("\n");
const activationDoc = read(files.activationDoc);
const runner = read(files.runner);
const adapter = read(files.adapter);

for (const token of requiredTokens) {
  addResult(`contains_${token}`, joined.includes(token), token);
}

for (const key of falseKeys) {
  addResult(`${key}_false_or_absent`, allFalseOrAbsent(joined, key), key);
}

addResult(
  "action_packet_matches_activation_route",
  activationDoc.includes("selected_route: NativeDoubaoImage_one_shot_project_plugin") &&
    activationDoc.includes("selected_plugin_id: NativeDoubaoImage") &&
    activationDoc.includes("model: doubao-seedream-5-0-260128"),
  files.activationDoc
);

addResult(
  "runner_and_adapter_are_exact_target_surfaces",
  runner.includes("runner: \"run_native_doubao_image_generation\"") &&
    runner.includes("plugin_id: \"NativeDoubaoImage\"") &&
    adapter.includes("async function run(options)") &&
    adapter.includes("plugin.realGenerate(options)"),
  "runner + adapter"
);

addResult(
  "packet_forbids_secret_paths_and_promotions",
  joined.includes("- .env.local") &&
    joined.includes("- accepted_samples/") &&
    joined.includes("- production/") &&
    joined.includes("- asset_archive/accepted_samples/"),
  "forbidden paths"
);

const passed = errors.length === 0;
const summary = {
  validator: "validate_real_vcp_agent_generation_action_packet",
  phase: "v0_6_71_real_vcp_agent_generation_action_packet",
  source_phase: "v0_6_70_real_vcp_agent_generation_route_activation_gate",
  result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  goal_target: "to_real_VCP_agent_generation",
  selected_route: "NativeDoubaoImage_one_shot_project_plugin",
  lane: "Amber_B_provider_image",
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  image_binary_read_performed: false,
  output_write_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  push_performed: false,
  receipt_ref: null,
  review_handoff_ref: null,
  next_recommended: "v0_6_72_real_vcp_agent_generation_preflight_no_call",
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
