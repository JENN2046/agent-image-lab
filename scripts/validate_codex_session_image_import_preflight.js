#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  preflightDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  preflightSchema: "schemas/codex_session_image_import_preflight.schema.yaml",
  preflightFixture: "tests/schema_examples/codex_session_image_import_preflight.example.yaml",
  failFixture: "tests/schema_examples/codex_session_image_import_preflight_fail.example.yaml",
  minimalImportContract: "docs/codex_session_image_provider_minimal_contract.md",
  routeSelectionDoc: "docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  toolContractDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  mockValidationDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION.md",
  requestSchema: "schemas/vcp_agent_image_generation_request.schema.yaml",
  responseSchema: "schemas/vcp_agent_image_generation_response.schema.yaml",
  validator: "scripts/validate_codex_session_image_import_preflight.js",
};

const falseKeys = [
  "execution_allowed_by_this_preflight",
  "image_binary_read_allowed",
  "image_binary_read_allowed_now",
  "future_image_file_existence_check_allowed_now",
  "existence_check_allowed_now",
  "output_write_allowed",
  "memory_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
  "DailyNote_write_allowed",
  "VCP_memory_write_allowed",
  "raw_prompt_payload_allowed",
  "secret_value_allowed",
  "private_absolute_path_allowed",
  "provider_raw_response_allowed",
  "private_absolute_path_present",
  "secret_value_present",
  "env_value_present",
  "image_binary_present",
  "raw_prompt_payload_present",
  "raw_provider_response_present",
  "image_generation_performed",
  "image_binary_read_performed",
  "output_write_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "mcp_runtime_performed",
  "VCPToolBox_runtime_performed",
  "VCPChat_runtime_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "env_read_performed",
  "secret_read_performed",
  "push_tag_release_deploy_performed",
];

const forbiddenTrueRegexes = falseKeys.map((key) => new RegExp(`^\\s*${key}:\\s+true\\s*$`, "im"));

const requiredTokens = [
  "phase: v0_6_66_codex_session_image_import_preflight_only",
  "source_phase: v0_6_65a_exact_file_commit_readiness_gate",
  "preflight_only: true",
  "caller: VCP_Agent",
  "selected_route: codex_session_image_import",
  "import_route_id: codex_session_image_import",
  "provider_id: codex_session_image",
  "import_mode: manual_session_import",
  "max_plugin_calls: 0",
  "max_images_imported: 0",
  "prompt_package_ref",
  "must_exist: true",
  "required_prefix: prompts/image_generation/",
  "prompt_package_ref_under: prompts/image_generation/",
  "generation_plan_ref_present: true",
  "generation_contract_ref: docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  "route_selection_ref: docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  "output_directory_ref",
  "required_prefix: runs/real_generation/",
  "output_directory_ref_under: runs/real_generation/",
  "future_image_file_path",
  "placeholder_only: true",
  "image_binary_read_allowed: false",
  "image_binary_read_allowed_now: false",
  "image_binary_read_performed: false",
  "output_write_allowed: false",
  "output_write_performed: false",
  "review_handoff_required: true",
  "review_console_required: true",
  "human_review_required: true",
  "memory_write_allowed: false",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "DailyNote_write_allowed: false",
  "VCP_memory_write_allowed: false",
  "raw_prompt_payload_allowed: false",
  "secret_value_allowed: false",
  "private_absolute_path_allowed: false",
  "provider_raw_response_allowed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "VCPToolBox_runtime_performed: false",
  "VCPChat_runtime_performed: false",
  "next_recommended: v0_6_67_codex_session_image_import_record_contract",
];

const expectedFailCases = [
  "caller_not_vcp_agent",
  "selected_route_not_codex_session_image_import",
  "provider_id_not_codex_session_image",
  "import_mode_not_manual_session_import",
  "prompt_package_ref_missing",
  "prompt_package_ref_outside_prompts_image_generation",
  "generation_plan_ref_present_false",
  "output_directory_ref_outside_runs_real_generation",
  "review_console_required_false",
  "max_plugin_calls_nonzero",
  "max_images_imported_nonzero",
  "image_binary_read_allowed_true",
  "image_binary_read_performed_true",
  "output_write_allowed_true",
  "output_write_performed_true",
  "memory_write_allowed_true",
  "accepted_samples_write_allowed_true",
  "production_candidate_write_allowed_true",
  "DailyNote_write_allowed_true",
  "VCP_memory_write_allowed_true",
  "raw_prompt_payload_allowed_true",
  "private_absolute_path_allowed_true",
  "private_absolute_path_present_true",
  "secret_value_allowed_true",
  "secret_value_present_true",
  "provider_raw_response_allowed_true",
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

function lineValue(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^\\s*${escaped}:\\s*(.*?)\\s*$`, "m"));
  return match ? match[1].replace(/^["']|["']$/g, "") : null;
}

function valuesForKey(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...text.matchAll(new RegExp(`^\\s*${escaped}:\\s*(.*?)\\s*$`, "gm"))]
    .map((match) => match[1].replace(/^["']|["']$/g, ""));
}

function boolIsFalseOrAbsent(text, key) {
  return valuesForKey(text, key).every((value) => value === "false" || value === "null");
}

function isProjectRelative(value) {
  return Boolean(value) && !/^[A-Za-z]:[\\/]/.test(value) && !value.startsWith("/") && !value.includes("..");
}

function evaluatePreflight(text) {
  const promptPackageRef = lineValue(text, "prompt_package_ref");
  const outputDirectoryRef = lineValue(text, "output_directory_ref");
  const futureImageFilePath = lineValue(text, "future_image_file_path");
  const checks = {
    caller: lineValue(text, "caller") === "VCP_Agent",
    selectedRoute: lineValue(text, "selected_route") === "codex_session_image_import",
    importRoute: lineValue(text, "import_route_id") === "codex_session_image_import",
    providerId: lineValue(text, "provider_id") === "codex_session_image",
    importMode: lineValue(text, "import_mode") === "manual_session_import",
    maxPluginCallsZero: lineValue(text, "max_plugin_calls") === "0",
    maxImagesImportedZero: lineValue(text, "max_images_imported") === "0",
    promptPackageRefPresent: Boolean(promptPackageRef),
    promptPackageRefUnderPromptRoot: /^prompts\/image_generation\/[^/].+\.ya?ml$/.test(promptPackageRef || ""),
    promptPackageRefUnderField: lineValue(text, "prompt_package_ref_under") === "prompts/image_generation/",
    promptPackageRefExists: Boolean(promptPackageRef) && exists(promptPackageRef),
    generationPlanRefPresent: lineValue(text, "generation_plan_ref_present") === "true",
    generationContractRef: lineValue(text, "generation_contract_ref") === files.toolContractDoc && exists(files.toolContractDoc),
    routeSelectionRef: lineValue(text, "route_selection_ref") === files.routeSelectionDoc && exists(files.routeSelectionDoc),
    outputDirectoryUnderRuns: /^runs\/real_generation\/[^/].+\/$/.test(outputDirectoryRef || ""),
    outputDirectoryRefUnderField: lineValue(text, "output_directory_ref_under") === "runs/real_generation/",
    futureImagePathPlaceholder: lineValue(text, "future_image_file_path_placeholder_only") === "true",
    futureImagePathRelative: futureImageFilePath === null || (
      isProjectRelative(futureImageFilePath) &&
      Boolean(outputDirectoryRef) &&
      futureImageFilePath.startsWith(outputDirectoryRef)
    ),
    reviewHandoffRequired: lineValue(text, "review_handoff_required") === "true",
    reviewConsoleRequired: lineValue(text, "review_console_required") === "true",
    humanReviewRequired: lineValue(text, "human_review_required") === "true",
    allFalseFlags: falseKeys.every((key) => boolIsFalseOrAbsent(text, key)),
    noForbiddenFieldClaims: ["private_absolute_path", "secret_value", "env_value", "image_binary"].every((key) => lineValue(text, key) === null),
  };
  return { passed: Object.values(checks).every(Boolean), checks };
}

function replaceLine(text, key, replacementLine) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`^\\s*${escaped}:.*$`, "m"), replacementLine);
}

function mutatePreflight(baseText, caseId) {
  const replacements = {
    caller_not_vcp_agent: ["caller", "  caller: other_agent"],
    selected_route_not_codex_session_image_import: ["selected_route", "  selected_route: other_route"],
    provider_id_not_codex_session_image: ["provider_id", "    provider_id: other_provider"],
    import_mode_not_manual_session_import: ["import_mode", "    import_mode: automated_provider_import"],
    prompt_package_ref_outside_prompts_image_generation: ["prompt_package_ref", "    prompt_package_ref: prompts/other/example.yaml"],
    generation_plan_ref_present_false: ["generation_plan_ref_present", "    generation_plan_ref_present: false"],
    output_directory_ref_outside_runs_real_generation: ["output_directory_ref", "    output_directory_ref: temp/generated/"],
    review_console_required_false: ["review_console_required", "    review_console_required: false"],
    max_plugin_calls_nonzero: ["max_plugin_calls", "    max_plugin_calls: 1"],
    max_images_imported_nonzero: ["max_images_imported", "    max_images_imported: 1"],
    image_binary_read_allowed_true: ["image_binary_read_allowed", "    image_binary_read_allowed: true"],
    image_binary_read_performed_true: ["image_binary_read_performed", "    image_binary_read_performed: true"],
    output_write_allowed_true: ["output_write_allowed", "    output_write_allowed: true"],
    output_write_performed_true: ["output_write_performed", "    output_write_performed: true"],
    memory_write_allowed_true: ["memory_write_allowed", "    memory_write_allowed: true"],
    accepted_samples_write_allowed_true: ["accepted_samples_write_allowed", "    accepted_samples_write_allowed: true"],
    production_candidate_write_allowed_true: ["production_candidate_write_allowed", "    production_candidate_write_allowed: true"],
    DailyNote_write_allowed_true: ["DailyNote_write_allowed", "    DailyNote_write_allowed: true"],
    VCP_memory_write_allowed_true: ["VCP_memory_write_allowed", "    VCP_memory_write_allowed: true"],
    raw_prompt_payload_allowed_true: ["raw_prompt_payload_allowed", "    raw_prompt_payload_allowed: true"],
    private_absolute_path_allowed_true: ["private_absolute_path_allowed", "    private_absolute_path_allowed: true"],
    private_absolute_path_present_true: ["private_absolute_path_present", "    private_absolute_path_present: true"],
    secret_value_allowed_true: ["secret_value_allowed", "    secret_value_allowed: true"],
    secret_value_present_true: ["secret_value_present", "    secret_value_present: true"],
    provider_raw_response_allowed_true: ["provider_raw_response_allowed", "    provider_raw_response_allowed: true"],
  };
  if (caseId === "prompt_package_ref_missing") {
    return baseText.replace(/^\s*prompt_package_ref:.*(?:\r?\n)/m, "");
  }
  const replacement = replacements[caseId];
  return replacement ? replaceLine(baseText, replacement[0], replacement[1]) : baseText;
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const preflightDoc = read(files.preflightDoc);
const preflightSchema = read(files.preflightSchema);
const preflightFixture = read(files.preflightFixture);
const failFixture = read(files.failFixture);
const minimalImportContract = read(files.minimalImportContract);
const routeSelectionDoc = read(files.routeSelectionDoc);
const joinedValidSurfaces = [preflightDoc, preflightSchema, preflightFixture].join("\n");
const joinedReferenceSurfaces = [
  minimalImportContract,
  routeSelectionDoc,
  read(files.toolContractDoc),
  read(files.mockValidationDoc),
  read(files.requestSchema),
  read(files.responseSchema),
].join("\n");

for (const token of requiredTokens) {
  addResult(`preflight_surface_contains_${token}`, joinedValidSurfaces.includes(token), token);
}

addResult("minimal_import_contract_confirms_manual_bridge", minimalImportContract.includes("manual bridge"), "manual bridge");
addResult("route_selection_selected_codex_session_import", routeSelectionDoc.includes("selected_route: codex_session_image_import"), "selected_route");
addResult("tool_contract_allows_codex_session_import", joinedReferenceSurfaces.includes("codex_session_image_import"), "codex_session_image_import");

for (const regex of forbiddenTrueRegexes) {
  addResult(`valid_surfaces_do_not_claim_${regex}`, !regex.test(joinedValidSurfaces), String(regex));
}

const validEvaluation = evaluatePreflight(preflightFixture);
addResult("valid_preflight_fixture_passes", validEvaluation.passed, JSON.stringify(validEvaluation.checks));

const caseIds = [...failFixture.matchAll(/case_id:\s*([A-Za-z0-9_]+)/g)].map((match) => match[1]);
addResult(
  `blocked_case_count_is_${expectedFailCases.length}`,
  caseIds.length === expectedFailCases.length,
  String(caseIds.length)
);
addResult("blocked_cases_match_expected_list", JSON.stringify(caseIds) === JSON.stringify(expectedFailCases), JSON.stringify(caseIds));

for (const caseId of caseIds) {
  const mutated = mutatePreflight(preflightFixture, caseId);
  const evaluation = evaluatePreflight(mutated);
  addResult(`blocked_case_${caseId}_is_rejected`, evaluation.passed === false, JSON.stringify(evaluation.checks));
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_codex_session_image_import_preflight",
  phase: "v0_6_66_codex_session_image_import_preflight_only",
  source_phase: "v0_6_65a_exact_file_commit_readiness_gate",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  preflight_only: true,
  import_route_id: "codex_session_image_import",
  provider_id: "codex_session_image",
  import_mode: "manual_session_import",
  blocked_case_count: caseIds.length,
  valid_preflight_fixture_passes: validEvaluation.passed,
  image_generation_performed: false,
  image_binary_read_performed: false,
  output_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  VCPToolBox_runtime_performed: false,
  VCPChat_runtime_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  push_performed: false,
  next_recommended: ["v0_6_67_codex_session_image_import_record_contract"],
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
