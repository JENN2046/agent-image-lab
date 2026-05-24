#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ROUTE_ACTIVATION_GATE.md",
  fixture: "tests/schema_examples/real_vcp_agent_generation_route_activation_gate.example.yaml",
  pluginProfile: "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
  promptPackage: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
  routeGapReview: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_ROUTE_CLOSEOUT_OR_REAL_GENERATION_GAP_REVIEW.md",
};

const requiredTokens = [
  "phase: v0_6_70_real_vcp_agent_generation_route_activation_gate",
  "source_phase: v0_6_69a_exact_file_commit_readiness_gate",
  "goal_target: to_real_VCP_agent_generation",
  "selected_route: NativeDoubaoImage_one_shot_project_plugin",
  "selected_plugin_id: NativeDoubaoImage",
  "plugin_profile_ref: plugins/image_generation/native_doubao_image/plugin.profile.yaml",
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
  "memory_write_allowed: false",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "codex_session_image_import_status: closed_as_safe_manual_import_path",
  "future_vcp_provider_adapter_status: reserved_for_future_design_route",
  "next_recommended: v0_6_71_real_vcp_agent_generation_action_packet",
];

const falseKeys = [
  "execution_allowed_by_this_gate",
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

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
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
const profile = read(files.pluginProfile);
const prompt = read(files.promptPackage);
const routeGapReview = read(files.routeGapReview);

for (const token of requiredTokens) {
  addResult(`contains_${token}`, joined.includes(token), token);
}

for (const key of falseKeys) {
  addResult(`${key}_false_or_absent`, allFalseOrAbsent(joined, key), key);
}

addResult(
  "plugin_profile_locks_native_doubao_route",
  profile.includes("plugin_id: NativeDoubaoImage") &&
    profile.includes("command: generate") &&
    profile.includes("mode: text_to_image") &&
    profile.includes("required_model: doubao-seedream-5-0-260128") &&
    profile.includes("max_images_created: 1") &&
    profile.includes("retry_allowed: false"),
  files.pluginProfile
);

addResult(
  "prompt_package_exists_and_is_generation_neutral",
  prompt.includes("prompt_package_id: neutral_smoke_test_red_apple_v1") &&
    prompt.includes("mode: text_to_image") &&
    prompt.includes("plugin_call_allowed_by_this_file: false") &&
    prompt.includes("image_generation_allowed_by_this_file: false"),
  files.promptPackage
);

addResult(
  "route_gap_review_recommends_native_doubao",
  routeGapReview.includes("recommended_route: NativeDoubaoImage_one_shot_project_plugin"),
  files.routeGapReview
);

const passed = errors.length === 0;
const summary = {
  validator: "validate_real_vcp_agent_generation_route_activation_gate",
  phase: "v0_6_70_real_vcp_agent_generation_route_activation_gate",
  source_phase: "v0_6_69a_exact_file_commit_readiness_gate",
  result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  goal_target: "to_real_VCP_agent_generation",
  selected_route: "NativeDoubaoImage_one_shot_project_plugin",
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
  next_recommended: "v0_6_71_real_vcp_agent_generation_action_packet",
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
