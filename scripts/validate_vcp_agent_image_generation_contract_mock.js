#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  contractDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  mockDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION.md",
  requestSchema: "schemas/vcp_agent_image_generation_request.schema.yaml",
  responseSchema: "schemas/vcp_agent_image_generation_response.schema.yaml",
  requestFixture: "tests/schema_examples/vcp_agent_image_generation_request.example.yaml",
  requestFailFixture: "tests/schema_examples/vcp_agent_image_generation_request_fail.example.yaml",
  responseFixture: "tests/schema_examples/vcp_agent_image_generation_response.example.yaml",
  responseFailFixture: "tests/schema_examples/vcp_agent_image_generation_response_fail.example.yaml",
  blockedCases: "tests/schema_examples/vcp_agent_image_generation_mock_blocked_cases.example.yaml",
  toolContractValidator: "scripts/validate_vcp_agent_image_generation_tool_contract.js",
  mockValidator: "scripts/validate_vcp_agent_image_generation_contract_mock.js",
};

const allowedRoutes = new Set([
  "codex_session_image_import",
  "native_doubao_project_plugin",
  "future_vcp_provider_adapter",
]);

const requestFalseKeys = [
  "caller_owns_visual_core_truth",
  "execution_allowed_by_this_contract",
  "memory_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
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

const responseFalseKeys = [
  "execution_allowed_by_this_contract",
  "route_selected_for_execution_now",
  "memory_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
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

const forbiddenRequestFieldRegexes = [
  /^\s*raw_prompt_payload:/m,
  /^\s*secret_value:/m,
  /^\s*env_value:/m,
  /^\s*provider_raw_response:/m,
  /^\s*raw_provider_response:/m,
  /^\s*provider_endpoint:/m,
  /^\s*api_key:/m,
  /^\s*token:/m,
  /^\s*cookie:/m,
  /^\s*image_binary:/m,
  /^\s*private_absolute_path:/m,
  /^\s*raw_stdout:/m,
  /^\s*raw_stderr:/m,
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

function lineValue(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^\\s*${escaped}:\\s*(.*?)\\s*$`, "m"));
  return match ? match[1].replace(/^["']|["']$/g, "") : null;
}

function valuesForKey(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...text.matchAll(new RegExp(`^\\s*${escaped}:\\s*(.*?)\\s*$`, "gm"))];
  return matches.map((match) => match[1].replace(/^["']|["']$/g, ""));
}

function boolIsFalseOrAbsent(text, key) {
  const values = valuesForKey(text, key);
  return values.every((value) => value === "false" || value === "null");
}

function evaluateRequest(text) {
  const checks = {
    callerIsVcpAgent: /^vcp_agent_/i.test(lineValue(text, "vcp_agent_id") || ""),
    callerRole: lineValue(text, "vcp_agent_role") === "caller_or_orchestrator",
    routeAllowed: allowedRoutes.has(lineValue(text, "selected_route")),
    promptPackageRef: /^prompts\/image_generation\/[^/].+\.ya?ml$/.test(lineValue(text, "prompt_package_ref") || ""),
    generationPlanRef: Boolean(lineValue(text, "generation_plan_ref")),
    outputDirectory: /^runs\/real_generation\/[^/].+\/$/.test(lineValue(text, "output_directory_ref") || ""),
    reviewConsoleRequired: lineValue(text, "review_console_required") === "true",
    humanReviewRequired: lineValue(text, "human_review_required") === "true",
    maxPluginCalls: lineValue(text, "max_plugin_calls") === "1",
    maxImagesCreated: lineValue(text, "max_images_created") === "1",
    retryLimit: lineValue(text, "retry_limit") === "0",
    falseFlags: requestFalseKeys.every((key) => boolIsFalseOrAbsent(text, key)),
    noForbiddenFields: forbiddenRequestFieldRegexes.every((regex) => !regex.test(text)),
  };
  return { passed: Object.values(checks).every(Boolean), checks };
}

function evaluateResponse(text) {
  const checks = {
    status: ["blocked_or_mock_ok", "contract_validated_no_execution", "contract_rejected"].includes(lineValue(text, "response_status")),
    routeAllowed: allowedRoutes.has(lineValue(text, "selected_route")),
    promptPackageRef: /^prompts\/image_generation\/[^/].+\.ya?ml$/.test(lineValue(text, "prompt_package_ref") || ""),
    generationPlanRef: Boolean(lineValue(text, "generation_plan_ref")),
    outputDirectory: /^runs\/real_generation\/[^/].+\/$/.test(lineValue(text, "output_directory_ref") || ""),
    maxPluginCalls: lineValue(text, "max_plugin_calls") === "1",
    maxImagesCreated: lineValue(text, "max_images_created") === "1",
    retryLimit: lineValue(text, "retry_limit") === "0",
    reviewConsoleRequired: lineValue(text, "review_console_required") === "true",
    humanReviewRequired: lineValue(text, "human_review_required") === "true",
    routeSelectionGateRequired: lineValue(text, "route_selection_gate_required") === "true",
    nextGate: lineValue(text, "next_route_gate") === "v0_6_65_vcp_agent_generation_route_selection_gate",
    falseFlags: responseFalseKeys.every((key) => boolIsFalseOrAbsent(text, key)),
  };
  return { passed: Object.values(checks).every(Boolean), checks };
}

function mutateRequest(baseText, caseId) {
  const replacements = {
    missing_prompt_package_ref: [/^\s*prompt_package_ref:.*\n/m, ""],
    arbitrary_plugin_id: [/^\s*selected_route:.*$/m, "    selected_route: arbitrary_plugin_id"],
    max_plugin_calls_gt_1: [/^\s*max_plugin_calls:.*$/m, "    max_plugin_calls: 2"],
    max_images_created_gt_1: [/^\s*max_images_created:.*$/m, "    max_images_created: 2"],
    retry_limit_gt_0: [/^\s*retry_limit:.*$/m, "    retry_limit: 1"],
    memory_write_allowed_true: [/^\s*memory_write_allowed:.*$/m, "    memory_write_allowed: true"],
    accepted_samples_write_allowed_true: [/^\s*accepted_samples_write_allowed:.*$/m, "    accepted_samples_write_allowed: true"],
    production_candidate_write_allowed_true: [/^\s*production_candidate_write_allowed:.*$/m, "    production_candidate_write_allowed: true"],
    output_directory_outside_runs_real_generation: [/^\s*output_directory_ref:.*$/m, "    output_directory_ref: temp/generated/"],
  };
  if (replacements[caseId]) {
    const [pattern, replacement] = replacements[caseId];
    return baseText.replace(pattern, replacement);
  }
  if (caseId === "raw_prompt_payload_present") return `${baseText}\n  raw_prompt_payload: forbidden\n`;
  if (caseId === "secret_value_present") return `${baseText}\n  secret_value: forbidden\n`;
  if (caseId === "raw_provider_response_present") return `${baseText}\n  raw_provider_response: forbidden\n`;
  if (caseId === "private_absolute_path_present") return `${baseText}\n  private_absolute_path: C:/Users/private/generated.png\n`;
  return baseText;
}

function mutateResponse(baseText, caseId) {
  if (caseId === "mock_response_claims_image_generation") {
    return baseText.replace(/^\s*image_generation_performed:.*$/m, "    image_generation_performed: true");
  }
  if (caseId === "mock_response_claims_output_write") {
    return baseText.replace(/^\s*output_write_performed:.*$/m, "    output_write_performed: true");
  }
  return baseText;
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const contractDoc = read(files.contractDoc);
const mockDoc = read(files.mockDoc);
const requestSchema = read(files.requestSchema);
const responseSchema = read(files.responseSchema);
const requestFixture = read(files.requestFixture);
const requestFailFixture = read(files.requestFailFixture);
const responseFixture = read(files.responseFixture);
const responseFailFixture = read(files.responseFailFixture);
const blockedCases = read(files.blockedCases);
const joined = [contractDoc, mockDoc, requestSchema, responseSchema, requestFixture, responseFixture, blockedCases].join("\n");

for (const token of [
  "phase: v0_6_64_vcp_agent_image_generation_contract_mock_validation",
  "source_phase: v0_6_63_vcp_agent_image_generation_tool_contract_v1",
  "mock_validation_only: true",
  "blocked_or_mock_ok",
  "production_candidate_write_allowed: false",
  "v0_6_65_vcp_agent_generation_route_selection_gate",
]) {
  addResult(`surface_contains_${token}`, joined.includes(token), token);
}

const requestEval = evaluateRequest(requestFixture);
const requestFailEval = evaluateRequest(requestFailFixture);
const responseEval = evaluateResponse(responseFixture);
const responseFailEval = evaluateResponse(responseFailFixture);
addResult("valid_request_with_vcp_agent_passes", requestEval.passed, JSON.stringify(requestEval.checks));
addResult("invalid_request_fixture_fails", requestFailEval.passed === false, JSON.stringify(requestFailEval.checks));
addResult("valid_response_mock_passes", responseEval.passed, JSON.stringify(responseEval.checks));
addResult("invalid_response_fixture_fails", responseFailEval.passed === false, JSON.stringify(responseFailEval.checks));

const caseIds = [...blockedCases.matchAll(/case_id:\s*([A-Za-z0-9_]+)/g)].map((match) => match[1]);
addResult("blocked_case_count_is_15", caseIds.length === 15, String(caseIds.length));

for (const caseId of caseIds) {
  const requestMutation = mutateRequest(requestFixture, caseId);
  const responseMutation = mutateResponse(responseFixture, caseId);
  const evaluation = caseId.startsWith("mock_response_")
    ? evaluateResponse(responseMutation)
    : evaluateRequest(requestMutation);
  addResult(`blocked_case_${caseId}_is_rejected`, evaluation.passed === false, JSON.stringify(evaluation.checks));
}

for (const regex of [
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
  /secret_read_performed:\s+true/i,
]) {
  addResult(`valid_surfaces_do_not_claim_${regex}`, ![requestFixture, responseFixture, mockDoc].join("\n").match(regex), String(regex));
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_vcp_agent_image_generation_contract_mock",
  phase: "v0_6_64_vcp_agent_image_generation_contract_mock_validation",
  source_phase: "v0_6_63_vcp_agent_image_generation_tool_contract_v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  mock_validation_only: true,
  blocked_case_count: caseIds.length,
  valid_request_passed: requestEval.passed,
  valid_response_passed: responseEval.passed,
  invalid_request_rejected: requestFailEval.passed === false,
  invalid_response_rejected: responseFailEval.passed === false,
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
  next_recommended: ["v0_6_65_vcp_agent_generation_route_selection_gate"],
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
