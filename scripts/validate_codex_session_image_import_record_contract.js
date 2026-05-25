#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  recordDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT.md",
  recordSchema: "schemas/codex_session_image_import_record.schema.yaml",
  recordFixture: "tests/schema_examples/codex_session_image_import_record.example.yaml",
  failFixture: "tests/schema_examples/codex_session_image_import_record_fail.example.yaml",
  preflightDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  preflightSchema: "schemas/codex_session_image_import_preflight.schema.yaml",
  preflightFixture: "tests/schema_examples/codex_session_image_import_preflight.example.yaml",
  routeSelectionDoc: "docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  toolContractDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  validator: "scripts/validate_codex_session_image_import_record_contract.js",
};

const falseKeys = [
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
  "image_import_executed",
  "image_binary_read_performed",
  "image_hash_computed",
  "output_write_performed",
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
  "phase: v0_6_67_codex_session_image_import_record_contract",
  "phase_name: v0_6_67_codex_session_image_import_record_contract_gate",
  "source_phase: v0_6_66a_exact_file_commit_readiness_gate",
  "remote_baseline_commit: 76f9e77d4c55bb3433d97070cd898cd8cf4ea21f",
  "contract_only: true",
  "import_record_id",
  "import_route_id: codex_session_image_import",
  "provider_id: codex_session_image",
  "import_mode: manual_session_import",
  "prompt_package_ref",
  "generation_contract_ref: docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  "route_selection_ref: docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  "preflight_ref: docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  "source_preflight_ref: docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  "future_image_file_ref",
  "output_directory_ref",
  "runs/real_generation/",
  "project_relative_image_path_placeholder_only: true",
  "review_case_ref",
  "review_console_required: true",
  "human_review_required: true",
  "imported_asset_status: draft_only",
  "accepted_samples_write_allowed: false",
  "production_candidate_write_allowed: false",
  "DailyNote_write_allowed: false",
  "VCP_memory_write_allowed: false",
  "image_import_executed: false",
  "image_binary_read_performed: false",
  "image_hash_computed: false",
  "output_write_performed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "VCPToolBox_runtime_performed: false",
  "VCPChat_runtime_performed: false",
  "next_recommended: v0_6_68_codex_session_image_import_record_mock_validation",
];

const expectedFailCases = [
  "provider_id_not_codex_session_image",
  "import_route_id_not_codex_session_image_import",
  "import_mode_not_manual_session_import",
  "prompt_package_ref_missing",
  "prompt_package_ref_outside_prompts_image_generation",
  "preflight_ref_missing",
  "source_preflight_ref_missing",
  "output_directory_ref_outside_runs_real_generation",
  "project_relative_image_path_placeholder_only_false",
  "image_hash_computed_true",
  "review_console_required_false",
  "imported_asset_status_not_draft_only",
  "accepted_samples_write_allowed_true",
  "production_candidate_write_allowed_true",
  "DailyNote_write_allowed_true",
  "VCP_memory_write_allowed_true",
  "image_binary_read_performed_true",
  "output_write_performed_true",
  "private_absolute_path_present_true",
  "secret_value_present_true",
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
    importRoute: lineValue(text, "import_route_id") === "codex_session_image_import",
    providerId: lineValue(text, "provider_id") === "codex_session_image",
    importMode: lineValue(text, "import_mode") === "manual_session_import",
    importedAssetStatus: lineValue(text, "imported_asset_status") === "draft_only",
    promptPackageRefPresent: Boolean(promptPackageRef),
    promptPackageRefUnderPromptRoot: /^prompts\/image_generation\/[^/].+\.ya?ml$/.test(promptPackageRef || ""),
    promptPackageRefExists: Boolean(promptPackageRef) && exists(promptPackageRef),
    generationContractRef: lineValue(text, "generation_contract_ref") === files.toolContractDoc && exists(files.toolContractDoc),
    routeSelectionRef: lineValue(text, "route_selection_ref") === files.routeSelectionDoc && exists(files.routeSelectionDoc),
    preflightRef: lineValue(text, "preflight_ref") === files.preflightDoc && exists(files.preflightDoc),
    sourcePreflightRef: lineValue(text, "source_preflight_ref") === files.preflightDoc && exists(files.preflightDoc),
    outputDirectoryUnderRuns: /^runs\/real_generation\/[^/].+\/$/.test(outputDirectoryRef || ""),
    futureImageFileRefPlaceholder: lineValue(text, "future_image_file_ref_placeholder_only") === "true",
    projectRelativeImagePathPlaceholderOnly: lineValue(text, "project_relative_image_path_placeholder_only") === "true",
    futureImageFileRefRelative: (
      isProjectRelative(futureImageFileRef) &&
      Boolean(outputDirectoryRef) &&
      futureImageFileRef.startsWith(outputDirectoryRef)
    ),
    reviewCaseRefPresent: Boolean(reviewCaseRef),
    reviewCaseRefRelative: isProjectRelative(reviewCaseRef),
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

function mutateRecord(baseText, caseId) {
  const replacements = {
    provider_id_not_codex_session_image: ["provider_id", "    provider_id: other_provider"],
    import_route_id_not_codex_session_image_import: ["import_route_id", "    import_route_id: other_route"],
    import_mode_not_manual_session_import: ["import_mode", "    import_mode: automated_provider_import"],
    prompt_package_ref_outside_prompts_image_generation: ["prompt_package_ref", "    prompt_package_ref: prompts/other/example.yaml"],
    output_directory_ref_outside_runs_real_generation: ["output_directory_ref", "    output_directory_ref: temp/generated/"],
    project_relative_image_path_placeholder_only_false: ["project_relative_image_path_placeholder_only", "    project_relative_image_path_placeholder_only: false"],
    image_hash_computed_true: ["image_hash_computed", "    image_hash_computed: true"],
    review_console_required_false: ["review_console_required", "    review_console_required: false"],
    imported_asset_status_not_draft_only: ["imported_asset_status", "    imported_asset_status: imported_ready"],
    accepted_samples_write_allowed_true: ["accepted_samples_write_allowed", "    accepted_samples_write_allowed: true"],
    production_candidate_write_allowed_true: ["production_candidate_write_allowed", "    production_candidate_write_allowed: true"],
    DailyNote_write_allowed_true: ["DailyNote_write_allowed", "    DailyNote_write_allowed: true"],
    VCP_memory_write_allowed_true: ["VCP_memory_write_allowed", "    VCP_memory_write_allowed: true"],
    image_binary_read_performed_true: ["image_binary_read_performed", "    image_binary_read_performed: true"],
    output_write_performed_true: ["output_write_performed", "    output_write_performed: true"],
    private_absolute_path_present_true: ["private_absolute_path_present", "    private_absolute_path_present: true"],
    secret_value_present_true: ["secret_value_present", "    secret_value_present: true"],
  };
  if (caseId === "prompt_package_ref_missing") {
    return baseText.replace(/^\s*prompt_package_ref:.*(?:\r?\n)/m, "");
  }
  if (caseId === "preflight_ref_missing") {
    return baseText.replace(/^\s*preflight_ref:.*(?:\r?\n)/m, "");
  }
  if (caseId === "source_preflight_ref_missing") {
    return baseText.replace(/^\s*source_preflight_ref:.*(?:\r?\n)/m, "");
  }
  const replacement = replacements[caseId];
  return replacement ? replaceLine(baseText, replacement[0], replacement[1]) : baseText;
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const recordDoc = read(files.recordDoc);
const recordSchema = read(files.recordSchema);
const recordFixture = read(files.recordFixture);
const failFixture = read(files.failFixture);
const joinedValidSurfaces = [recordDoc, recordSchema, recordFixture].join("\n");
const joinedReferenceSurfaces = [
  read(files.preflightDoc),
  read(files.preflightSchema),
  read(files.preflightFixture),
  read(files.routeSelectionDoc),
  read(files.toolContractDoc),
].join("\n");

for (const token of requiredTokens) {
  addResult(`record_surface_contains_${token}`, joinedValidSurfaces.includes(token), token);
}

addResult("preflight_surface_exists_and_points_to_v0_6_67", joinedReferenceSurfaces.includes("v0_6_67_codex_session_image_import_record_contract"), "preflight next");
addResult("route_selection_selected_codex_session_import", joinedReferenceSurfaces.includes("selected_route: codex_session_image_import"), "selected_route");
addResult("tool_contract_allows_codex_session_import", joinedReferenceSurfaces.includes("codex_session_image_import"), "codex_session_image_import");

for (const regex of forbiddenTrueRegexes) {
  addResult(`valid_surfaces_do_not_claim_${regex}`, !regex.test(joinedValidSurfaces), String(regex));
}

const validEvaluation = evaluateRecord(recordFixture);
addResult("valid_record_fixture_passes", validEvaluation.passed, JSON.stringify(validEvaluation.checks));

const caseIds = [...failFixture.matchAll(/case_id:\s*([A-Za-z0-9_]+)/g)].map((match) => match[1]);
addResult(
  `blocked_case_count_is_${expectedFailCases.length}`,
  caseIds.length === expectedFailCases.length,
  String(caseIds.length)
);
addResult("blocked_cases_match_expected_list", JSON.stringify(caseIds) === JSON.stringify(expectedFailCases), JSON.stringify(caseIds));

for (const caseId of caseIds) {
  const mutated = mutateRecord(recordFixture, caseId);
  const evaluation = evaluateRecord(mutated);
  addResult(`blocked_case_${caseId}_is_rejected`, evaluation.passed === false, JSON.stringify(evaluation.checks));
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_codex_session_image_import_record_contract",
  phase: "v0_6_67_codex_session_image_import_record_contract",
  source_phase: "v0_6_66a_exact_file_commit_readiness_gate",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  contract_only: true,
  import_record_id: "codex_session_image_import_record_001",
  provider_id: "codex_session_image",
  import_mode: "manual_session_import",
  imported_asset_status: "draft_only",
  blocked_case_count: caseIds.length,
  valid_record_fixture_passes: validEvaluation.passed,
  image_import_executed: false,
  image_generation_performed: false,
  image_binary_read_performed: false,
  image_hash_computed: false,
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
  next_phase_started: false,
  next_recommended: ["v0_6_68_codex_session_image_import_record_mock_validation"],
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
