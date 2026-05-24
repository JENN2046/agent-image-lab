#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  contractDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  requestSchema: "schemas/vcp_agent_image_generation_request.schema.yaml",
  responseSchema: "schemas/vcp_agent_image_generation_response.schema.yaml",
  validFixture: "tests/schema_examples/vcp_agent_image_generation_request.example.yaml",
  failFixture: "tests/schema_examples/vcp_agent_image_generation_request_fail.example.yaml",
  validator: "scripts/validate_vcp_agent_image_generation_tool_contract.js",
};

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
  if (detail) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_contains_${token}`, text.includes(token), token);
}

function forbidRegex(label, text, regex) {
  addResult(`${label}_forbids_${regex}`, !regex.test(text), String(regex));
}

function lineValue(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^\\s*${escaped}:\\s*(.*?)\\s*$`, "m"));
  return match ? match[1].replace(/^["']|["']$/g, "") : null;
}

function boolValue(text, key) {
  return lineValue(text, key);
}

function evaluateRequestFixture(text) {
  const allowedRoutes = new Set([
    "codex_session_image_import",
    "native_doubao_project_plugin",
    "future_vcp_provider_adapter",
  ]);
  const forbiddenFieldRegexes = [
    /^\s*raw_prompt_payload:/m,
    /^\s*secret_value:/m,
    /^\s*env_value:/m,
    /^\s*provider_raw_response:/m,
    /^\s*provider_endpoint:/m,
    /^\s*api_key:/m,
    /^\s*token:/m,
    /^\s*cookie:/m,
    /^\s*image_binary:/m,
    /^\s*private_absolute_path:/m,
    /^\s*raw_stdout:/m,
    /^\s*raw_stderr:/m,
  ];
  const falseKeys = [
    "caller_owns_visual_core_truth",
    "execution_allowed_by_this_contract",
    "memory_write_allowed",
    "accepted_samples_write_allowed",
    "provider_contact_requested",
    "plugin_call_requested",
    "api_call_requested",
    "mcp_runtime_requested",
    "image_generation_requested_now",
    "image_binary_read_requested",
    "output_file_write_requested",
    "DailyNote_write_requested",
    "VCP_memory_write_requested",
    "accepted_samples_write_requested",
    "production_candidate_write_requested",
    "real_vcpchat_runtime_requested",
    "real_vcptoolbox_runtime_requested",
    "env_read_requested",
    "secret_read_requested",
    "raw_prompt_payload_included",
    "secret_value_included",
    "provider_raw_response_included",
    "private_absolute_path_included",
    "image_binary_included",
  ];
  const checks = {
    routeAllowed: allowedRoutes.has(lineValue(text, "selected_route")),
    callerRole: lineValue(text, "vcp_agent_role") === "caller_or_orchestrator",
    promptPackageExact: /^prompts\/image_generation\/[^/].+\.ya?ml$/.test(lineValue(text, "prompt_package_ref") || ""),
    generationPlanExact: Boolean(lineValue(text, "generation_plan_ref")),
    outputUnderRuns: /^runs\/real_generation\/[^/].+\/$/.test(lineValue(text, "output_directory_ref") || ""),
    reviewConsoleRequired: boolValue(text, "review_console_required") === "true",
    humanReviewRequired: boolValue(text, "human_review_required") === "true",
    maxPluginCallsOne: lineValue(text, "max_plugin_calls") === "1",
    maxImagesCreatedOne: lineValue(text, "max_images_created") === "1",
    retryLimitZero: lineValue(text, "retry_limit") === "0",
    allFalseFlags: falseKeys.every((key) => {
      const value = boolValue(text, key);
      return value === null || value === "false";
    }),
    noForbiddenFields: forbiddenFieldRegexes.every((regex) => !regex.test(text)),
  };
  return {
    passed: Object.values(checks).every(Boolean),
    checks,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const contractDoc = read(files.contractDoc);
const requestSchema = read(files.requestSchema);
const responseSchema = read(files.responseSchema);
const validFixture = read(files.validFixture);
const failFixture = read(files.failFixture);
const joined = [contractDoc, requestSchema, responseSchema, validFixture].join("\n");

for (const token of [
  "phase: v0_6_63_vcp_agent_image_generation_tool_contract_v1",
  "Agent Image Lab core independent",
  "vcp_agent_role: caller_or_orchestrator",
  "agent_image_lab_core_independent: true",
  "vcp_native_adapter: true",
  "vcp_agent_role: caller_or_orchestrator",
  "caller_owns_visual_core_truth: false",
  "codex_session_image_import",
  "native_doubao_project_plugin",
  "future_vcp_provider_adapter",
  "prompt_package_ref",
  "generation_plan_ref",
  "output_directory_ref",
  "runs/real_generation/",
  "max_plugin_calls: 1",
  "max_images_created: 1",
  "retry_limit: 0",
  "review_console_required: true",
  "human_review_required: true",
  "memory_write_allowed: false",
  "accepted_samples_write_allowed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "image_generation_performed: false",
  "output_write_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
]) {
  requireToken("contract_surface", joined, token);
}

for (const token of [
  "raw_prompt_payload",
  "secret_value",
  "provider_raw_response",
  "private_absolute_path",
  "image_binary",
]) {
  requireToken("forbidden_fields_defined", requestSchema, token);
}

for (const token of [
  "response_receipt:",
  "contract_validated_no_execution",
  "contract_rejected",
  "route_selection_gate_required: true",
  "review_handoff:",
  "artifact_refs_or_empty_list:",
  "side_effects:",
]) {
  requireToken("response_schema", responseSchema, token);
}

const validEvaluation = evaluateRequestFixture(validFixture);
const failEvaluation = evaluateRequestFixture(failFixture);
addResult("valid_fixture_passes_contract_evaluation", validEvaluation.passed, JSON.stringify(validEvaluation.checks));
addResult("fail_fixture_is_rejected_by_contract_evaluation", failEvaluation.passed === false, JSON.stringify(failEvaluation.checks));
requireToken("fail_fixture", failFixture, "negative_case_expected_fail: true");

for (const regex of [
  /provider_contact_performed:\s+true/i,
  /plugin_call_performed:\s+true/i,
  /api_call_performed:\s+true/i,
  /mcp_runtime_performed:\s+true/i,
  /image_generation_performed:\s+true/i,
  /image_binary_read_performed:\s+true/i,
  /output_write_performed:\s+true/i,
  /DailyNote_write_performed:\s+true/i,
  /VCP_memory_write_performed:\s+true/i,
  /accepted_samples_write_performed:\s+true/i,
  /production_candidate_write_performed:\s+true/i,
  /real_vcpchat_runtime_performed:\s+true/i,
  /real_vcptoolbox_runtime_performed:\s+true/i,
  /env_read_performed:\s+true/i,
  /secret_read_performed:\s+true/i,
  /push_tag_release_deploy_performed:\s+true/i,
]) {
  forbidRegex("contract_surface", joined, regex);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_vcp_agent_image_generation_tool_contract",
  phase: "v0_6_63_vcp_agent_image_generation_tool_contract_v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  contract_defined: true,
  request_schema_defined: true,
  response_schema_defined: true,
  valid_fixture_passes: validEvaluation.passed,
  invalid_fixture_rejected: failEvaluation.passed === false,
  selected_route_options: [
    "codex_session_image_import",
    "native_doubao_project_plugin",
    "future_vcp_provider_adapter",
  ],
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  image_binary_read_performed: false,
  output_write_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  push_performed: false,
  next_recommended: ["v0_6_64_vcp_agent_image_generation_contract_mock_validation"],
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
