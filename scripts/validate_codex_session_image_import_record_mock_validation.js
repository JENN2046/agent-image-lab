#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  mockDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_RECORD_MOCK_VALIDATION.md",
  recordDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT.md",
  recordSchema: "schemas/codex_session_image_import_record.schema.yaml",
  mockFixture: "tests/schema_examples/codex_session_image_import_record_mock.example.yaml",
  blockedCases: "tests/schema_examples/codex_session_image_import_record_mock_blocked_cases.example.yaml",
  recordFixture: "tests/schema_examples/codex_session_image_import_record.example.yaml",
  preflightDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  routeSelectionDoc: "docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  toolContractDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  recordValidator: "scripts/validate_codex_session_image_import_record_contract.js",
  mockValidator: "scripts/validate_codex_session_image_import_record_mock_validation.js",
};

const falseKeys = [
  "execution_allowed_by_this_mock_validation",
  "execution_allowed_by_this_contract",
  "image_binary_read_allowed_now",
  "future_image_file_existence_check_allowed_now",
  "existence_check_allowed_now",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
  "DailyNote_write_allowed",
  "VCP_memory_write_allowed",
  "private_absolute_path_present",
  "secret_value_present",
  "env_value_present",
  "image_binary_present",
  "raw_prompt_payload_present",
  "raw_provider_response_present",
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

const expectedBlockedCases = [
  "invalid_provider_id",
  "invalid_import_mode",
  "missing_prompt_package_ref",
  "prompt_package_ref_outside_prompts_image_generation",
  "missing_preflight_ref",
  "output_directory_ref_outside_runs_real_generation",
  "imported_asset_status_not_draft_only",
  "image_binary_read_performed_true",
  "output_write_performed_true",
  "accepted_samples_write_allowed_true",
  "production_candidate_write_allowed_true",
  "DailyNote_write_allowed_true",
  "VCP_memory_write_allowed_true",
  "private_absolute_path_present_true",
  "secret_value_present_true",
];

const requiredTokens = [
  "phase: v0_6_68_codex_session_image_import_record_mock_validation",
  "source_phase: v0_6_67_codex_session_image_import_record_contract",
  "mock_validation_only: true",
  "valid_mock_import_record",
  "provider_id: codex_session_image",
  "import_mode: manual_session_import",
  "prompt_package_ref",
  "generation_contract_ref: docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  "route_selection_ref: docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  "preflight_ref: docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  "future_image_file_ref",
  "output_directory_ref",
  "runs/real_generation/",
  "review_case_ref",
  "human_review_required: true",
  "imported_asset_status: draft_only",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "DailyNote_write_allowed: false",
  "VCP_memory_write_allowed: false",
  "image_binary_read_performed: false",
  "output_write_performed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "VCPToolBox_runtime_performed: false",
  "VCPChat_runtime_performed: false",
  "next_recommended: v0_6_68a_exact_file_commit_readiness_gate",
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

function evaluateRecord(text) {
  const promptPackageRef = lineValue(text, "prompt_package_ref");
  const outputDirectoryRef = lineValue(text, "output_directory_ref");
  const futureImageFileRef = lineValue(text, "future_image_file_ref");
  const reviewCaseRef = lineValue(text, "review_case_ref");
  const checks = {
    importRecordIdPresent: /^codex_session_image_import_record_[A-Za-z0-9_]+$/.test(lineValue(text, "import_record_id") || ""),
    providerId: lineValue(text, "provider_id") === "codex_session_image",
    importMode: lineValue(text, "import_mode") === "manual_session_import",
    importedAssetStatus: lineValue(text, "imported_asset_status") === "draft_only",
    promptPackageRefPresent: Boolean(promptPackageRef),
    promptPackageRefUnderPromptRoot: /^prompts\/image_generation\/[^/].+\.ya?ml$/.test(promptPackageRef || ""),
    promptPackageRefExists: Boolean(promptPackageRef) && exists(promptPackageRef),
    generationContractRef: lineValue(text, "generation_contract_ref") === files.toolContractDoc && exists(files.toolContractDoc),
    routeSelectionRef: lineValue(text, "route_selection_ref") === files.routeSelectionDoc && exists(files.routeSelectionDoc),
    preflightRef: lineValue(text, "preflight_ref") === files.preflightDoc && exists(files.preflightDoc),
    outputDirectoryUnderRuns: /^runs\/real_generation\/[^/].+\/$/.test(outputDirectoryRef || ""),
    futureImageFileRefPlaceholder: lineValue(text, "future_image_file_ref_placeholder_only") === "true",
    futureImageFileRefRelative: (
      isProjectRelative(futureImageFileRef) &&
      Boolean(outputDirectoryRef) &&
      futureImageFileRef.startsWith(outputDirectoryRef)
    ),
    reviewCaseRefPresent: Boolean(reviewCaseRef),
    reviewCaseRefRelative: isProjectRelative(reviewCaseRef),
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

function mutateRecord(baseText, caseId) {
  const replacements = {
    invalid_provider_id: ["provider_id", "    provider_id: other_provider"],
    invalid_import_mode: ["import_mode", "    import_mode: automated_provider_import"],
    prompt_package_ref_outside_prompts_image_generation: ["prompt_package_ref", "    prompt_package_ref: prompts/other/example.yaml"],
    output_directory_ref_outside_runs_real_generation: ["output_directory_ref", "    output_directory_ref: temp/generated/"],
    imported_asset_status_not_draft_only: ["imported_asset_status", "    imported_asset_status: imported_ready"],
    image_binary_read_performed_true: ["image_binary_read_performed", "    image_binary_read_performed: true"],
    output_write_performed_true: ["output_write_performed", "    output_write_performed: true"],
    accepted_samples_write_allowed_true: ["accepted_samples_write_allowed", "    accepted_samples_write_allowed: true"],
    production_candidate_write_allowed_true: ["production_candidate_write_allowed", "    production_candidate_write_allowed: true"],
    DailyNote_write_allowed_true: ["DailyNote_write_allowed", "    DailyNote_write_allowed: true"],
    VCP_memory_write_allowed_true: ["VCP_memory_write_allowed", "    VCP_memory_write_allowed: true"],
    private_absolute_path_present_true: ["private_absolute_path_present", "    private_absolute_path_present: true"],
    secret_value_present_true: ["secret_value_present", "    secret_value_present: true"],
  };
  if (caseId === "missing_prompt_package_ref") {
    return baseText.replace(/^\s*prompt_package_ref:.*\n/m, "");
  }
  if (caseId === "missing_preflight_ref") {
    return baseText.replace(/^\s*preflight_ref:.*\n/m, "");
  }
  const replacement = replacements[caseId];
  return replacement ? replaceLine(baseText, replacement[0], replacement[1]) : baseText;
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const mockDoc = read(files.mockDoc);
const recordDoc = read(files.recordDoc);
const recordSchema = read(files.recordSchema);
const mockFixture = read(files.mockFixture);
const blockedCasesFixture = read(files.blockedCases);
const recordFixture = read(files.recordFixture);
const joinedValidSurfaces = [mockDoc, mockFixture].join("\n");
const joinedReferenceSurfaces = [recordDoc, recordSchema, recordFixture].join("\n");

for (const token of requiredTokens) {
  addResult(`mock_surface_contains_${token}`, joinedValidSurfaces.includes(token), token);
}

addResult("record_contract_surface_exists_and_points_to_v0_6_68", joinedReferenceSurfaces.includes("v0_6_68_codex_session_image_import_record_mock_validation"), "contract next");

for (const key of falseKeys) {
  const regex = new RegExp(`^\\s*${key}:\\s+true\\s*$`, "im");
  addResult(`mock_valid_surfaces_do_not_claim_${regex}`, !regex.test(joinedValidSurfaces), String(regex));
}

const validEvaluation = evaluateRecord(mockFixture);
addResult("valid_mock_import_record_passes", validEvaluation.passed, JSON.stringify(validEvaluation.checks));

const caseIds = [...blockedCasesFixture.matchAll(/case_id:\s*([A-Za-z0-9_]+)/g)].map((match) => match[1]);
addResult("blocked_case_count_is_15", caseIds.length === 15, String(caseIds.length));
addResult("blocked_cases_match_expected_list", JSON.stringify(caseIds) === JSON.stringify(expectedBlockedCases), JSON.stringify(caseIds));

for (const caseId of caseIds) {
  const mutated = mutateRecord(mockFixture, caseId);
  const evaluation = evaluateRecord(mutated);
  addResult(`blocked_case_${caseId}_fails`, evaluation.passed === false, JSON.stringify(evaluation.checks));
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_codex_session_image_import_record_mock_validation",
  phase: "v0_6_68_codex_session_image_import_record_mock_validation",
  source_phase: "v0_6_67_codex_session_image_import_record_contract",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  mock_validation_only: true,
  valid_mock_import_record_passed: validEvaluation.passed,
  blocked_case_count: caseIds.length,
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
  next_recommended: ["v0_6_68a_exact_file_commit_readiness_gate"],
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
