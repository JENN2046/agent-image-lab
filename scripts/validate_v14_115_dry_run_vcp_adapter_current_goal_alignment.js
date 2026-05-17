#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const adapterPath = "adapters/pvos_kernel_dry_run_adapter.js";
const adapterSchemaPath = "schemas/pvos_kernel_dry_run_adapter.schema.yaml";
const adapterExamplePath = "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json";
const codexImportValidatorPath = "scripts/validate_codex_session_image_import.js";
const codexContractPath = "docs/codex_session_image_provider_minimal_contract.md";
const goalGatePath = "docs/v14_108_three_month_visual_control_layer_goal_alignment_gate.md";
const runStatePath = ".agent_board/RUN_STATE.md";
const taskQueuePath = ".agent_board/TASK_QUEUE.md";
const phaseRecordPath = "docs/v14_115_dry_run_vcp_adapter_current_goal_alignment.md";

const errors = [];
const results = [];

const falseAdapterGuardFields = [
  "execution_authorized",
  "provider_contact_allowed",
  "plugin_call_allowed",
  "api_call_allowed",
  "daily_note_write_allowed",
  "vcp_memory_write_allowed",
  "image_generation_allowed",
  "output_file_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
  "external_manifest_read_allowed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "daily_note_write_performed",
  "vcp_memory_write_performed",
  "image_generation_performed",
  "output_file_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_created",
  "external_manifest_read_performed",
  "vcpchat_source_read_performed",
  "vcptoolbox_source_read_performed",
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

function runNodeScript(relativePath, args = []) {
  const result = childProcess.spawnSync(process.execPath, [repoPath(relativePath), ...args], {
    cwd: root,
    encoding: "utf8",
  });
  return result;
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function requireAnyToken(label, text, tokens) {
  addResult(`${label}_one_of_${tokens.join("|")}_present`, tokens.some((token) => text.includes(token)));
}

function assertFalseFields(label, object, fields) {
  for (const field of fields) {
    addResult(`${label}_${field}_false`, object?.[field] === false);
  }
}

function assertNoRuntimeScriptExpansion(label, text) {
  const forbidden = [
    { id: "provider_contact_true", pattern: /provider_contact_(?:allowed|performed):\s+true/i },
    { id: "plugin_call_true", pattern: /plugin_call_(?:allowed|performed):\s+true/i },
    { id: "api_call_true", pattern: /api_call_(?:allowed|performed):\s+true/i },
    { id: "mcp_runtime_true", pattern: /mcp_(?:default_route|runtime|runtime_performed):\s+true/i },
    { id: "real_vcp_read_true", pattern: /real_(?:manifest|VCPChat|VCPToolBox).*:\s+true/i },
    { id: "production_candidate_true", pattern: /production_candidate_(?:write|created|upgrade).*:\s+true/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

for (const relativePath of [
  adapterPath,
  adapterSchemaPath,
  adapterExamplePath,
  codexImportValidatorPath,
  codexContractPath,
  goalGatePath,
  runStatePath,
  taskQueuePath,
  phaseRecordPath,
]) {
  addResult(`${relativePath}_exists`, fs.existsSync(repoPath(relativePath)), relativePath);
}

runNodeCheck(adapterPath);
runNodeCheck(codexImportValidatorPath);

let adapterResponse = null;
try {
  adapterResponse = parseJson(adapterExamplePath);
  addResult("adapter_example_parseable", true);
} catch (error) {
  addResult("adapter_example_parseable", false, error.message);
}

if (adapterResponse) {
  addResult("adapter_mode_local_no_execution", adapterResponse.mode === "local_no_execution_adapter_contract");
  addResult("adapter_status_accepted_draft", adapterResponse.status === "accepted_draft");
  addResult("adapter_selected_plugin_null", adapterResponse.vcp_adapter_handoff_draft?.selected_plugin === null);
  addResult("adapter_fallback_plugins_empty", Array.isArray(adapterResponse.vcp_adapter_handoff_draft?.fallback_plugins) && adapterResponse.vcp_adapter_handoff_draft.fallback_plugins.length === 0);
  addResult("adapter_max_plugin_calls_zero", adapterResponse.vcp_adapter_handoff_draft?.max_plugin_calls === 0);
  addResult("adapter_expected_outputs_zero", adapterResponse.vcp_adapter_handoff_draft?.expected_outputs === 0);
  addResult("adapter_provider_payload_excluded", adapterResponse.provenance_handoff_draft?.provider_payload_included === false);
  addResult("adapter_image_binary_excluded", adapterResponse.provenance_handoff_draft?.image_binary_included === false);
  addResult("adapter_private_path_excluded", adapterResponse.provenance_handoff_draft?.private_path_included === false);
  assertFalseFields("adapter_no_execution_guard", adapterResponse.no_execution_guard, falseAdapterGuardFields);
}

const adapterRun = runNodeScript(adapterPath);
addResult("adapter_cli_exit_zero", adapterRun.status === 0, adapterRun.status === 0 ? null : adapterRun.stderr || adapterRun.stdout);
addResult("adapter_cli_stderr_empty", adapterRun.stderr.trim() === "", adapterRun.stderr);
if (adapterRun.status === 0) {
  try {
    const cliResponse = JSON.parse(adapterRun.stdout);
    addResult("adapter_cli_stdout_json_parseable", true);
    addResult("adapter_cli_mode_local_no_execution", cliResponse.mode === "local_no_execution_adapter_contract");
    addResult("adapter_cli_selected_plugin_null", cliResponse.vcp_adapter_handoff_draft?.selected_plugin === null);
    addResult("adapter_cli_max_plugin_calls_zero", cliResponse.vcp_adapter_handoff_draft?.max_plugin_calls === 0);
    addResult("adapter_cli_provider_payload_excluded", cliResponse.provenance_handoff_draft?.provider_payload_included === false);
    assertFalseFields("adapter_cli_no_execution_guard", cliResponse.no_execution_guard, falseAdapterGuardFields);
  } catch (error) {
    addResult("adapter_cli_stdout_json_parseable", false, error.message);
  }
}

const codexImportRun = runNodeScript(codexImportValidatorPath);
addResult("codex_import_validator_exit_zero", codexImportRun.status === 0, codexImportRun.status === 0 ? null : codexImportRun.stderr || codexImportRun.stdout);
if (codexImportRun.status === 0) {
  try {
    const codexImport = JSON.parse(codexImportRun.stdout);
    addResult("codex_import_validator_passed", codexImport.passed === true);
    addResult("codex_import_manual_import_only", codexImport.codex_session_image_import?.manual_import_only === true);
    addResult("codex_import_provider_api_call_disallowed", codexImport.codex_session_image_import?.provider_api_call_allowed === false);
    addResult("codex_import_mcp_runtime_disallowed", codexImport.codex_session_image_import?.mcp_runtime_allowed === false);
    addResult("codex_import_project_generation_disallowed", codexImport.codex_session_image_import?.image_generation_by_script === false);
    addResult("codex_import_file_write_not_performed", codexImport.codex_session_image_import?.file_write_performed === false);
  } catch (error) {
    addResult("codex_import_validator_stdout_json_parseable", false, error.message);
  }
}

try {
  const adapterSource = readFile(adapterPath);
  for (const token of [
    "selected_plugin: null",
    "max_plugin_calls: 0",
    "provider_payload_included: false",
    "It writes JSON to stdout only",
    "performs no provider, plugin, API, image, memory, or output-file action",
  ]) {
    requireToken("adapter_source", adapterSource, token);
  }
} catch (error) {
  addResult("adapter_source_readable", false, error.message);
}

try {
  const schemaText = readFile(adapterSchemaPath);
  for (const token of [
    "mode:",
    "local_no_execution_adapter_contract",
    "selected_plugin: null",
    "max_plugin_calls: 0",
    "execution_authorized: false",
    "provider_contact_allowed: false",
    "plugin_call_allowed: false",
    "api_call_allowed: false",
    "output_write_allowed: false",
    "expected_outputs: 0",
  ]) {
    requireToken("adapter_schema", schemaText, token);
  }
} catch (error) {
  addResult("adapter_schema_readable", false, error.message);
}

try {
  const codexContract = readFile(codexContractPath);
  for (const token of [
    "Codex Session Image Provider",
    "It is not a project-callable provider",
    "It is not MCP runtime",
    "provider_api_call_allowed: false",
    "project_script_generation_allowed: false",
    "image_generation_by_script: false",
  ]) {
    requireToken("codex_contract", codexContract, token);
  }
} catch (error) {
  addResult("codex_contract_readable", false, error.message);
}

for (const [label, relativePath] of [
  ["goal_gate", goalGatePath],
  ["run_state", runStatePath],
  ["task_queue", taskQueuePath],
  ["phase_record", phaseRecordPath],
]) {
  try {
    const text = readFile(relativePath);
    requireToken(label, text, "default_generation_route_for_next_three_months: codex_session_image");
    requireAnyToken(label, text, ["provider_api_default_route: false", "provider_API_default_route: false"]);
    requireToken(label, text, "plugin_default_route: false");
    requireAnyToken(label, text, ["mcp_default_route: false", "MCP_default_route: false"]);
    requireToken(label, text, "accepted_samples_metadata");
    requireToken(label, text, "production_candidate");
    if (label !== "goal_gate") {
      for (const boundaryToken of [
        "real_manifest_read_performed: false",
        "real_vcpchat_read_performed: false",
        "real_vcptoolbox_read_performed: false",
        "provider_contact_performed: false",
        "plugin_call_performed: false",
        "api_call_performed: false",
        "mcp_runtime_performed: false",
        "image_generation_performed: false",
        "production_candidate_created: false",
      ]) {
        requireToken(label, text, boundaryToken);
      }
    }
    if (label === "phase_record") {
      assertNoRuntimeScriptExpansion(label, text);
    }
  } catch (error) {
    addResult(`${label}_readable`, false, error.message);
  }
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_115_dry_run_vcp_adapter_current_goal_alignment",
  version: "v1",
  passed,
  files_checked: [
    adapterPath,
    adapterSchemaPath,
    adapterExamplePath,
    codexImportValidatorPath,
    codexContractPath,
    goalGatePath,
    runStatePath,
    taskQueuePath,
    phaseRecordPath,
  ],
  check_count: results.length,
  failed_count: errors.length,
  dry_run_vcp_adapter_contract_aligned: passed,
  codex_session_default_route_preserved: passed,
  selected_plugin: null,
  max_plugin_calls: 0,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
  output_file_write_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
