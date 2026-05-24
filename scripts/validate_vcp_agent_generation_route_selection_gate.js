#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  routeDoc: "docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  routeFixture: "tests/schema_examples/vcp_agent_generation_route_selection_gate.example.yaml",
  contractDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  mockDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION.md",
  responseFixture: "tests/schema_examples/vcp_agent_image_generation_response.example.yaml",
  codexSessionContract: "docs/codex_session_image_provider_minimal_contract.md",
};

const requiredTokens = [
  "phase: v0_6_65_vcp_agent_generation_route_selection_gate",
  "source_phase: v0_6_64_vcp_agent_image_generation_contract_mock_validation",
  "selected_route: codex_session_image_import",
  "selection_status: selected_first_landing_route",
  "NativeDoubaoImage_one_shot_project_plugin",
  "future_vcp_provider_adapter",
  "reserved_for_later_exact_A5_preflight",
  "reserved_for_future_design_route",
  "required_preflight_for_selected_route",
  "prompt_package_ref_under_prompts_image_generation",
  "generation_plan_ref_present",
  "output_directory_ref_under_runs_real_generation",
  "max_plugin_calls_equals_1",
  "max_images_created_equals_1",
  "retry_limit_equals_0",
  "review_console_required_equals_true",
  "human_review_required_equals_true",
  "memory_write_allowed_equals_false",
  "accepted_samples_write_allowed_equals_false",
  "production_candidate_write_allowed_equals_false",
  "blocked_conditions",
  "provider_contact_required",
  "plugin_call_required",
  "api_call_required",
  "mcp_runtime_required",
  "VCPToolBox_runtime_required",
  "VCPChat_runtime_required",
  "image_generation_required",
  "image_binary_read_required",
  "output_write_required",
  "DailyNote_write_requested",
  "VCP_memory_write_requested",
  "accepted_samples_write_requested",
  "production_candidate_write_requested",
  "env_or_secret_read_required",
  "push_tag_release_deploy_requested",
  "git_add_dot_required",
  "next_recommended_phase: v0_6_66_codex_session_image_import_preflight_only",
];

const falseKeys = [
  "execution_allowed_by_this_gate",
  "route_selected_for_execution_now",
  "vcp_agent_owns_visual_core_truth",
  "memory_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
  "raw_prompt_payload_allowed",
  "secret_value_allowed",
  "provider_raw_response_allowed",
  "private_absolute_path_allowed",
  "image_binary_read_allowed_in_preflight",
  "output_write_allowed_in_preflight",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "mcp_runtime_performed",
  "VCPToolBox_runtime_performed",
  "VCPChat_runtime_performed",
  "image_generation_performed",
  "image_binary_read_performed",
  "output_write_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "env_read_performed",
  "secret_read_performed",
  "push_tag_release_deploy_performed",
];

const forbiddenTrueRegexes = [
  /provider_contact_performed:\s+true/i,
  /plugin_call_performed:\s+true/i,
  /api_call_performed:\s+true/i,
  /mcp_runtime_performed:\s+true/i,
  /VCPToolBox_runtime_performed:\s+true/i,
  /VCPChat_runtime_performed:\s+true/i,
  /image_generation_performed:\s+true/i,
  /image_binary_read_performed:\s+true/i,
  /output_write_performed:\s+true/i,
  /DailyNote_write_performed:\s+true/i,
  /VCP_memory_write_performed:\s+true/i,
  /accepted_samples_write_performed:\s+true/i,
  /production_candidate_write_performed:\s+true/i,
  /env_read_performed:\s+true/i,
  /secret_read_performed:\s+true/i,
  /push_tag_release_deploy_performed:\s+true/i,
  /execution_allowed_by_this_gate:\s+true/i,
  /route_selected_for_execution_now:\s+true/i,
];

const results = [];
const errors = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail !== undefined) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function lineValues(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...text.matchAll(new RegExp(`^\\s*${escaped}:\\s*(.*?)\\s*$`, "gm"))];
  return matches.map((match) => match[1].replace(/^["']|["']$/g, ""));
}

function allValuesFalseOrAbsent(text, key) {
  return lineValues(text, key).every((value) => value === "false" || value === "null");
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const routeDoc = read(files.routeDoc);
const routeFixture = read(files.routeFixture);
const contractDoc = read(files.contractDoc);
const mockDoc = read(files.mockDoc);
const responseFixture = read(files.responseFixture);
const codexSessionContract = read(files.codexSessionContract);
const joined = [routeDoc, routeFixture, contractDoc, mockDoc, responseFixture, codexSessionContract].join("\n");

for (const token of requiredTokens) {
  addResult(`surface_contains_${token}`, joined.includes(token), token);
}

for (const key of falseKeys) {
  addResult(`${key}_false_or_absent`, allValuesFalseOrAbsent(joined, key), key);
}

for (const regex of forbiddenTrueRegexes) {
  addResult(`no_forbidden_true_${regex}`, !regex.test(joined), String(regex));
}

const routeOptions = [...routeFixture.matchAll(/^\s*(?:-\s*)?(?:route|selected_route):\s*(.*?)\s*$/gm)]
  .map((match) => match[1].replace(/^["']|["']$/g, ""));
addResult(
  "fixture_compares_three_routes",
  routeOptions.includes("codex_session_image_import") &&
    routeOptions.includes("NativeDoubaoImage_one_shot_project_plugin") &&
    routeOptions.includes("future_vcp_provider_adapter"),
  JSON.stringify(routeOptions)
);

addResult(
  "selected_route_is_codex_session_image_import",
  lineValues(routeFixture, "selected_route").includes("codex_session_image_import"),
  JSON.stringify(lineValues(routeFixture, "selected_route"))
);

addResult(
  "contract_already_allows_selected_route",
  contractDoc.includes("codex_session_image_import"),
  "codex_session_image_import"
);

addResult(
  "mock_response_already_uses_selected_route",
  responseFixture.includes("selected_route: codex_session_image_import"),
  "selected_route: codex_session_image_import"
);

addResult(
  "codex_session_contract_is_manual_import_not_project_provider",
  codexSessionContract.includes("manual bridge") &&
    codexSessionContract.includes("It is not a project-callable provider") &&
    codexSessionContract.includes("manual_session_import"),
  "codex_session_image minimal contract"
);

const passed = errors.length === 0;
const summary = {
  validator: "validate_vcp_agent_generation_route_selection_gate",
  phase: "v0_6_65_vcp_agent_generation_route_selection_gate",
  source_phase: "v0_6_64_vcp_agent_image_generation_contract_mock_validation",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  selected_route: "codex_session_image_import",
  route_selection_document: files.routeDoc,
  route_selection_fixture: files.routeFixture,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  VCPToolBox_runtime_performed: false,
  VCPChat_runtime_performed: false,
  image_generation_performed: false,
  image_binary_read_performed: false,
  output_write_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  push_performed: false,
  next_recommended: ["v0_6_66_codex_session_image_import_preflight_only"],
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
