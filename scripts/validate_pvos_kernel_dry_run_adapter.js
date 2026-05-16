#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/pvos_kernel_dry_run_adapter.js";
const kernelPath = "kernel/pvos_kernel.js";
const schemaPath = "schemas/pvos_kernel_dry_run_adapter.schema.yaml";
const examplePath = "tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json";
const fixturePath = "tests/schema_examples/pvos_kernel_input.example.json";

const errors = [];
const results = [];

const falseGuardFields = [
  "execution_authorized",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "daily_note_write_performed",
  "vcp_memory_write_performed",
  "image_generation_performed",
  "output_file_write_performed",
  "accepted_samples_write_performed",
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

function validateNoSensitiveMaterial(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "env_file_reference", pattern: /\.env|config\.env/i },
    { id: "image_binary_reference", pattern: /\.(png|jpe?g|webp|gif|psd)\b/i },
    { id: "real_generation_run_path", pattern: /runs\/real_generation/i },
    { id: "accepted_samples_path", pattern: /accepted_samples\//i },
    { id: "external_url", pattern: /https?:\/\//i },
    { id: "real_manifest_ref", pattern: /real[_ -]?manifest/i },
    { id: "vcpchat_source_ref", pattern: /VCPChat source|real VCPChat/i },
    { id: "vcptoolbox_source_ref", pattern: /VCPToolBox source|real VCPToolBox/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

function runAdapter() {
  const result = childProcess.spawnSync(
    process.execPath,
    [repoPath(adapterPath), "--input", fixturePath],
    { cwd: root, encoding: "utf8" }
  );
  addResult("adapter_cli_exit_zero", result.status === 0, result.stderr || result.stdout);
  addResult("adapter_cli_stderr_empty", result.stderr.trim() === "", result.stderr);
  if (result.status !== 0) return null;
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    addResult("adapter_cli_stdout_json_parseable", false, error.message);
    return null;
  }
}

function validateResponse(response) {
  addResult("response_version_v1", response.pvos_kernel_dry_run_adapter_response_version === "v1");
  addResult("adapter_id_expected", response.adapter_id === "pvos_kernel_dry_run_adapter");
  addResult("adapter_status_accepted_draft", response.status === "accepted_draft");
  addResult("adapter_mode_no_execution", response.mode === "local_no_execution_adapter_contract");
  addResult("kernel_run_present", Boolean(response.kernel_run));
  addResult("kernel_run_version_v1", response.kernel_run?.pvos_kernel_run_version === "v1");
  addResult("kernel_run_stdout_mode", response.kernel_run?.mode === "local_stdout_only_kernel");
  addResult("vcp_handoff_present", Boolean(response.vcp_adapter_handoff_draft));
  addResult("review_console_handoff_present", Boolean(response.review_console_handoff_draft));
  addResult("provenance_handoff_present", Boolean(response.provenance_handoff_draft));
  addResult("audit_record_present", Boolean(response.audit_record));

  const vcp = response.vcp_adapter_handoff_draft || {};
  addResult("vcp_selected_plugin_null", vcp.selected_plugin === null);
  addResult("vcp_max_plugin_calls_zero", vcp.max_plugin_calls === 0);
  addResult("vcp_execution_not_authorized", vcp.execution_authorized === false);
  addResult("vcp_provider_contact_blocked", vcp.provider_contact_allowed === false);
  addResult("vcp_plugin_call_blocked", vcp.plugin_call_allowed === false);
  addResult("vcp_api_call_blocked", vcp.api_call_allowed === false);
  addResult("vcp_output_write_blocked", vcp.output_write_allowed === false);

  const review = response.review_console_handoff_draft || {};
  addResult("review_console_display_only", review.display_only === true);
  addResult("review_console_has_accepted_candidate", Array.isArray(review.accepted_candidate_ids) && review.accepted_candidate_ids.length === 1);
  addResult("review_console_has_rejected_candidate", Array.isArray(review.rejected_candidate_ids) && review.rejected_candidate_ids.length === 1);
  addResult("review_console_human_required", review.human_review_required_for_production === true);
  addResult("review_console_memory_separate_approval", review.memory_write_requires_separate_approval === true);

  const provenance = response.provenance_handoff_draft || {};
  addResult("provenance_payload_absent", provenance.provider_payload_included === false);
  addResult("provenance_image_binary_absent", provenance.image_binary_included === false);
  addResult("provenance_private_path_absent", provenance.private_path_included === false);
  addResult("provenance_metadata_only", provenance.artifact_refs_are_metadata_only === true);

  for (const flag of falseGuardFields) {
    addResult(`adapter_guard_${flag}_false`, response.no_execution_guard?.[flag] === false, String(response.no_execution_guard?.[flag]));
  }

  addResult("audit_selected_plugin_null", response.audit_record?.selected_plugin === null);
  addResult("audit_max_plugin_calls_zero", response.audit_record?.max_plugin_calls_observed === 0);
  addResult("audit_external_api_false", response.audit_record?.external_api_observed === false);
  addResult("audit_output_write_false", response.audit_record?.output_file_write_observed === false);
  addResult("audit_image_generation_false", response.audit_record?.image_generation_observed === false);
  addResult("audit_memory_write_false", response.audit_record?.memory_write_observed === false);

  validateNoSensitiveMaterial("adapter_response_stdout", JSON.stringify(response));
}

for (const file of [adapterPath, kernelPath, schemaPath, examplePath, fixturePath]) {
  addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
}

runNodeCheck(adapterPath);
runNodeCheck(kernelPath);
runNodeCheck("scripts/validate_pvos_kernel_dry_run_adapter.js");

try {
  const schema = readFile(schemaPath);
  addResult("schema_stdout_policy_declared", /output_channel: stdout/.test(schema));
  addResult("schema_no_file_write_declared", /output_file_write_allowed: false/.test(schema));
  addResult("schema_max_plugin_calls_zero", /max_plugin_calls: 0/.test(schema));
  validateNoSensitiveMaterial("schema", schema);
} catch (error) {
  addResult("schema_readable", false, error.message);
}

try {
  const example = JSON.parse(readFile(examplePath));
  addResult("example_version_v1", example.pvos_kernel_dry_run_adapter_response_version === "v1");
  addResult("example_selected_plugin_null", example.vcp_adapter_handoff_draft?.selected_plugin === null);
  addResult("example_max_plugin_calls_zero", example.vcp_adapter_handoff_draft?.max_plugin_calls === 0);
  for (const flag of falseGuardFields) {
    addResult(`example_guard_${flag}_false`, example.no_execution_guard?.[flag] === false);
  }
  validateNoSensitiveMaterial("example", JSON.stringify(example));
} catch (error) {
  addResult("example_parseable", false, error.message);
}

const response = runAdapter();
if (response) {
  addResult("adapter_cli_stdout_json_parseable", true);
  validateResponse(response);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_pvos_kernel_dry_run_adapter",
  version: "v1",
  passed,
  files_checked: [adapterPath, kernelPath, schemaPath, examplePath, fixturePath],
  check_count: results.length,
  failed_count: errors.length,
  pvos_kernel_dry_run_adapter: {
    adapter_cli_present: fs.existsSync(repoPath(adapterPath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    example_present: fs.existsSync(repoPath(examplePath)),
    kernel_dependency_present: fs.existsSync(repoPath(kernelPath)),
    stdout_only: true,
    external_network_required: false,
    external_service_required: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    output_file_write_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
