#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_PREFLIGHT_NO_CALL.md",
  fixture: "tests/schema_examples/real_vcp_agent_generation_preflight_no_call.example.yaml",
  receipt: "reports/provider_receipts/v0_6_72_real_vcp_agent_generation_preflight_blocked_receipt.json",
  actionPacketDoc: "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ACTION_PACKET.md",
  activationDoc: "docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ROUTE_ACTIVATION_GATE.md",
  actionPacketValidator: "scripts/validate_real_vcp_agent_generation_action_packet.js",
  runner: "scripts/run_native_doubao_image_generation.js",
  plugin: "plugins/image_generation/native_doubao_image/native_doubao_image.js",
  promptPackage: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
};

const outputDirectoryRef = "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/";
const futureSuccessReceiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json";

const requiredTokens = [
  "phase: v0_6_72_real_vcp_agent_generation_preflight_no_call",
  "source_phase: v0_6_71_real_vcp_agent_generation_action_packet",
  "goal_target: to_real_VCP_agent_generation",
  "selected_route: NativeDoubaoImage_one_shot_project_plugin",
  "selected_plugin_id: NativeDoubaoImage",
  "command: generate",
  "mode: text_to_image",
  "model: doubao-seedream-5-0-260128",
  "prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
  "output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "prompt_package_ref_exists: true",
  "prompt_package_ref_under_prompts_image_generation: true",
  "output_directory_ref_under_runs_real_generation: true",
  "max_plugin_calls: 1",
  "max_images_created: 1",
  "retry_limit: 0",
  "overwrite_existing_files_allowed: false",
  "output_directory_has_overwrite_risk: false",
  "future_success_receipt_path_has_overwrite_risk: false",
  "review_handoff_path_has_overwrite_risk: false",
  "raw_provider_payload_retention_policy: forbidden",
  "stop_conditions_present: true",
  "result: BLOCKED",
  "blocker_id: red_lane_secret_value_read_required_by_current_native_doubao_runner",
  "current_runner_real_mode_requires_env_local_value_load: true",
  "env_file_content_read_performed: false",
  "secret_value_read_performed: false",
  "receipt_ref: reports/provider_receipts/v0_6_72_real_vcp_agent_generation_preflight_blocked_receipt.json",
  "next_recommended: BLOCKED_non_secret_native_doubao_runtime_binding_required_before_v0_6_73",
];

const falseKeys = [
  "execution_allowed_by_this_preflight",
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

const receiptFalseKeys = [
  "generation_performed",
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
  "push_performed",
  "raw_provider_payload_recorded",
  "raw_stdout_stderr_recorded",
  "raw_endpoint_recorded",
  "raw_response_recorded",
  "b64_json_recorded",
  "secret_recorded",
  "private_absolute_path_recorded",
  "env_file_content_read_performed",
  "secret_value_read_performed",
  "retry_performed",
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

function isUnder(ref, prefix) {
  return ref.startsWith(prefix) && !ref.includes("..") && !path.isAbsolute(ref) && !/^[A-Za-z]:[\\/]/.test(ref);
}

for (const [key, file] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(file), file);
}

const joined = [read(files.doc), read(files.fixture)].join("\n");
const actionPacket = read(files.actionPacketDoc);
const activation = read(files.activationDoc);
const runner = read(files.runner);
const plugin = read(files.plugin);
const receipt = JSON.parse(read(files.receipt));

for (const token of requiredTokens) {
  addResult(`contains_${token}`, joined.includes(token), token);
}

for (const key of falseKeys) {
  addResult(`${key}_false_or_absent`, allFalseOrAbsent(joined, key), key);
}

addResult("prompt_ref_exists", exists("prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml"), files.promptPackage);
addResult("prompt_ref_under_allowed_root", isUnder("prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml", "prompts/image_generation/"), files.promptPackage);
addResult("output_dir_under_runs_real_generation", isUnder(outputDirectoryRef, "runs/real_generation/"), outputDirectoryRef);
addResult("output_dir_has_no_overwrite_risk", !exists(outputDirectoryRef), outputDirectoryRef);
addResult("future_success_receipt_has_no_overwrite_risk", !exists(futureSuccessReceiptRef), futureSuccessReceiptRef);
addResult("review_handoff_has_no_overwrite_risk", !exists(reviewHandoffRef), reviewHandoffRef);

addResult(
  "activation_and_action_packet_match_route",
  activation.includes("selected_plugin_id: NativeDoubaoImage") &&
    actionPacket.includes("selected_plugin_id: NativeDoubaoImage") &&
    actionPacket.includes("model: doubao-seedream-5-0-260128"),
  "activation + action packet"
);

addResult(
  "current_runner_requires_env_local_value_load_for_real_execution",
  runner.includes("if (options.dryRun === false && options.execution_authorized === true)") &&
    runner.includes("loadEnvLocal()") &&
    runner.includes("loadDotEnv(ENV_LOCAL_PATH, ALLOWED_ENV_KEYS)"),
  files.runner
);

addResult(
  "plugin_real_gate_requires_api_key_environment_variable",
  plugin.includes("DOUBAO_IMAGE_API_KEY environment variable is not set") &&
    plugin.includes("process.env.DOUBAO_IMAGE_API_KEY"),
  files.plugin
);

for (const key of receiptFalseKeys) {
  addResult(`receipt_${key}_is_false`, receipt[key] === false, key);
}

addResult("receipt_result_is_blocked", receipt.result === "BLOCKED", receipt.result);
addResult("receipt_has_zero_call_counts", receipt.plugin_call_count === 0 && receipt.provider_call_count === 0 && receipt.api_call_count === 0 && receipt.image_count === 0, "call counts");
addResult("receipt_records_red_blocker_without_secret", receipt.blocked_reason.includes("secret_value_read_allowed=false") && receipt.next_unblock_condition.includes("non-secret"), "blocked_reason");

const passed = errors.length === 0;
const summary = {
  validator: "validate_real_vcp_agent_generation_preflight_no_call",
  phase: "v0_6_72_real_vcp_agent_generation_preflight_no_call",
  source_phase: "v0_6_71_real_vcp_agent_generation_action_packet",
  result: "BLOCKED",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  goal_target: "to_real_VCP_agent_generation",
  selected_route: "NativeDoubaoImage_one_shot_project_plugin",
  blocker_id: "red_lane_secret_value_read_required_by_current_native_doubao_runner",
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
  receipt_ref: files.receipt,
  review_handoff_ref: null,
  next_recommended: "BLOCKED_non_secret_native_doubao_runtime_binding_required_before_v0_6_73",
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
