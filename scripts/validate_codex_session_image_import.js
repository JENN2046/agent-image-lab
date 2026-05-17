#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contractPath = "docs/codex_session_image_provider_minimal_contract.md";
const schemaPath = "schemas/codex_session_image_import.schema.yaml";
const examplePath = "tests/schema_examples/codex_session_image_import.example.json";
const validatorPath = "scripts/validate_codex_session_image_import.js";

const errors = [];
const results = [];

const falseGuardFields = [
  "codex_image_direct_call_allowed",
  "mcp_runtime_allowed",
  "provider_api_call_allowed",
  "project_script_generation_allowed",
  "image_generation_by_script",
];

const falseNoExecutionFields = [
  "provider_contact_allowed",
  "plugin_call_allowed",
  "api_call_allowed",
  "image_generation_allowed_by_project",
  "env_local_secret_value_read_allowed",
  "DailyNote_write_allowed",
  "VCP_memory_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
  "real_manifest_read_allowed",
  "real_VCPChat_read_allowed",
  "real_VCPToolBox_read_allowed",
  "push_tag_release_deploy_allowed",
  "provider_contact_performed_by_project",
  "plugin_call_performed_by_project",
  "api_call_performed_by_project",
  "image_generation_performed_by_project",
  "env_local_secret_value_read_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "real_manifest_read_performed",
  "real_VCPChat_read_performed",
  "real_VCPToolBox_read_performed",
  "push_tag_release_deploy_performed",
];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function readFile(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function parseJson(relativePath) {
  return JSON.parse(readFile(relativePath));
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

function assertNoSensitiveValues(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "env_file_reference", pattern: /\.env(?!_local_secret_value_read)|config\.env/i },
    { id: "external_url", pattern: /https?:\/\//i },
    { id: "api_key_literal", pattern: /api[_ -]?key\s*[:=]\s*['"][^'"]+['"]/i },
    { id: "token_literal", pattern: /token\s*[:=]\s*['"][^'"]+['"]/i },
    { id: "password_literal", pattern: /password\s*[:=]\s*['"][^'"]+['"]/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function validateContract(text) {
  for (const token of [
    "Codex Session Image Provider",
    "manual bridge",
    "codex_image_direct_call_allowed: false",
    "mcp_runtime_allowed: false",
    "provider_api_call_allowed: false",
    "image_generation_by_script: false",
    "DailyNote_write_allowed: false",
    "VCP_memory_write_allowed: false",
    "accepted_samples_write_allowed: false",
    "production_candidate_write_allowed: false",
  ]) {
    requireToken("contract", text, token);
  }
  assertNoSensitiveValues("contract", text);
}

function validateSchema(text) {
  for (const token of [
    "codex_session_image_import:",
    "provider_id: codex_session_image",
    "import_mode: manual_session_import",
    "codex_image_direct_call_allowed: false",
    "mcp_runtime_allowed: false",
    "provider_api_call_allowed: false",
    "project_script_generation_allowed: false",
    "image_generation_by_script: false",
    "human_session_action_required: true",
    "accepted_samples_write_allowed: false",
    "production_candidate_write_allowed: false",
    "push_tag_release_deploy_performed: false",
  ]) {
    requireToken("schema", text, token);
  }
  assertNoSensitiveValues("schema", text);
}

function validateExample(record) {
  const wrapper = record.codex_session_image_import;
  addResult("example_wrapper_present", Boolean(wrapper));
  if (!wrapper) return;

  addResult("example_import_version_v1", wrapper.import_version === "v1");
  addResult("example_provider_id", wrapper.provider_id === "codex_session_image");
  addResult("example_import_mode", wrapper.import_mode === "manual_session_import");
  addResult("example_status_draft", wrapper.status === "draft_import_record");
  addResult("example_prompt_package_ref_present", typeof wrapper.prompt_package_ref === "string" && wrapper.prompt_package_ref.length > 0);
  addResult("example_output_directory_ref_present", typeof wrapper.imported_asset?.output_directory_ref === "string");
  addResult("example_relative_path_under_runs", /^runs\/real_generation\//.test(wrapper.imported_asset?.relative_path || ""));
  addResult("example_local_file_not_claimed_verified", wrapper.imported_asset?.local_file_verified === false);
  addResult("example_copied_by_project_script_false", wrapper.imported_asset?.copied_by_project_script === false);
  addResult("example_review_pending", wrapper.review_bridge?.review_status === "pending_human_review");
  addResult("example_not_accepted", wrapper.review_bridge?.accepted_candidate === false);
  addResult("example_not_commercial_ready", wrapper.review_bridge?.commercial_delivery_ready === false);
  addResult("example_memory_deferred", wrapper.review_bridge?.memory_suitability === "deferred");

  for (const field of falseGuardFields) {
    addResult(`example_source_${field}_false`, wrapper.source?.[field] === false);
  }
  addResult("example_source_human_session_action_required_true", wrapper.source?.human_session_action_required === true);

  for (const field of falseNoExecutionFields) {
    addResult(`example_no_execution_${field}_false`, wrapper.no_execution_guard?.[field] === false);
  }

  assertNoSensitiveValues("example", JSON.stringify(wrapper));
}

for (const relativePath of [contractPath, schemaPath, examplePath, validatorPath]) {
  addResult(`${relativePath}_exists`, fs.existsSync(repoPath(relativePath)), relativePath);
}

runNodeCheck(validatorPath);

try {
  validateContract(readFile(contractPath));
} catch (error) {
  addResult("contract_readable", false, error.message);
}

try {
  validateSchema(readFile(schemaPath));
} catch (error) {
  addResult("schema_readable", false, error.message);
}

try {
  validateExample(parseJson(examplePath));
} catch (error) {
  addResult("example_parseable", false, error.message);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_codex_session_image_import",
  version: "v1",
  passed,
  files_checked: [contractPath, schemaPath, examplePath, validatorPath],
  check_count: results.length,
  failed_count: errors.length,
  codex_session_image_import: {
    contract_present: fs.existsSync(repoPath(contractPath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    example_present: fs.existsSync(repoPath(examplePath)),
    manual_import_only: true,
    codex_image_direct_call_allowed: false,
    mcp_runtime_allowed: false,
    provider_api_call_allowed: false,
    project_script_generation_allowed: false,
    image_generation_by_script: false,
    env_local_secret_value_read_allowed: false,
    daily_note_write_allowed: false,
    vcp_memory_write_allowed: false,
    accepted_samples_write_allowed: false,
    production_candidate_write_allowed: false,
    real_manifest_read_allowed: false,
    vcpchat_source_read_allowed: false,
    vcptoolbox_source_read_allowed: false,
    push_tag_release_deploy_allowed: false,
    file_write_performed: false,
    external_network_required: false,
    external_service_required: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
