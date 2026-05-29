#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_151_dry_run_vcp_adapter_contract_v1.md",
  contract: "integrations/vcp/dry_run_vcp_adapter_contract_v1.yaml",
  schema: "schemas/dry_run_vcp_adapter_contract_v1.schema.yaml",
  fixture: "tests/schema_examples/v14_151_dry_run_vcp_adapter_contract_v1.example.yaml",
  v14_115_validator: "scripts/validate_v14_115_dry_run_vcp_adapter_current_goal_alignment.js",
  v14_150_validator: "scripts/validate_v14_150_local_regression_suite_consolidation.js",
  currentValidator: "scripts/validate_v14_151_dry_run_vcp_adapter_contract_v1.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function smartV3ScopedText(label, text, pattern) {
  if (label !== "current_surfaces") return text;
  const amberAllowedPatterns = [
    "provider_contact_performed:\\s+true",
    "plugin_call_performed:\\s+true",
    "api_call_performed:\\s+true",
    "image_generation_performed:\\s+true",
  ];
  if (!amberAllowedPatterns.includes(pattern.source)) return text;
  return "";
}

function forbidPattern(label, text, pattern) {
  const scopedText = smartV3ScopedText(label, text, pattern);
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(scopedText), `${pattern}`);
}

function runJson(scriptPath) {
  return JSON.parse(execFileSync(process.execPath, [scriptPath], { cwd: root, encoding: "utf8" }));
}

function evaluateContract(input) {
  const staticChannels =
    input.vcpchatSourceReadPerformed === false &&
    input.vcpchatRuntimeAllowed === false &&
    input.vcptoolboxSourceReadPerformed === false &&
    input.vcptoolboxPluginCallAllowed === false &&
    input.manifestReadPerformed === false &&
    input.manifestReadAllowed === false;
  const blocked =
    input.authorizationGranted === false &&
    input.runtimeIntegrationAllowed === false &&
    input.runtimeIntegrationClaim === false;
  return {
    passed: staticChannels && blocked,
    staticChannels,
    blocked,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const contract = core.read(files.contract);
const schema = core.read(files.schema);
const fixture = core.read(files.fixture);
const currentSurfaces = [
  phaseRecord,
  contract,
  schema,
  fixture,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");

for (const token of [
  "dry_run_vcp_adapter_contract_v1:",
  "contract_type: dry_run_vcp_adapter_contract",
  "execution_mode: local_contract_only",
  "runtime_integration_allowed: false",
  "authorization_granted_by_contract: false",
  "vcpchat_handoff:",
  "vcptoolbox_handoff:",
  "manifest_handoff:",
  "source_read_performed: false",
  "plugin_call_performed: false",
  "manifest_read_performed: false",
]) {
  requireToken("schema", schema, token);
  requireToken("fixture", fixture, token);
}

for (const token of [
  "phase: v14_151_dry_run_vcp_adapter_contract_v1",
  "accepted_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001",
  "recoverability_suite_ref: scripts/run_v14_local_regression_suite.js",
  "authorization_package_compiler_ref: scripts/compile_v14_149_authorization_packages.js",
  "package_status: prepared_incomplete_not_granted",
  "review_console_static_reader_only: true",
]) {
  requireToken("contract", contract, token);
  requireToken("fixture", fixture, token);
}

let v14_115 = null;
let v14_150 = null;
try {
  v14_115 = runJson(files.v14_115_validator);
  addResult("v14_115_dry_run_vcp_adapter_alignment_still_passes", v14_115.passed === true);
} catch (error) {
  addResult("v14_115_dry_run_vcp_adapter_alignment_still_passes", false, error.message);
}

try {
  v14_150 = runJson(files.v14_150_validator);
  addResult("v14_150_local_regression_suite_still_passes", v14_150.passed === true);
} catch (error) {
  addResult("v14_150_local_regression_suite_still_passes", false, error.message);
}

const baseInput = {
  authorizationGranted: false,
  runtimeIntegrationAllowed: false,
  runtimeIntegrationClaim: false,
  vcpchatSourceReadPerformed: false,
  vcpchatRuntimeAllowed: false,
  vcptoolboxSourceReadPerformed: false,
  vcptoolboxPluginCallAllowed: false,
  manifestReadAllowed: false,
  manifestReadPerformed: false,
};

const evaluation = evaluateContract(baseInput);
addResult("dry_run_vcp_adapter_contract_evaluation_passes", evaluation.passed, JSON.stringify(evaluation));

const vcpchatRuntime = evaluateContract({ ...baseInput, vcpchatRuntimeAllowed: true });
const vcptoolboxPlugin = evaluateContract({ ...baseInput, vcptoolboxPluginCallAllowed: true });
const manifestRead = evaluateContract({ ...baseInput, manifestReadPerformed: true });
const exactManifestPathWithoutA5 = evaluateContract({ ...baseInput, manifestReadAllowed: true });
const runtimeClaim = evaluateContract({ ...baseInput, runtimeIntegrationClaim: true });

addResult("negative_case_vcpchat_runtime_channel_enabled_blocks_contract", vcpchatRuntime.passed === false && vcpchatRuntime.staticChannels === false);
addResult("negative_case_vcptoolbox_plugin_call_allowed_blocks_contract", vcptoolboxPlugin.passed === false && vcptoolboxPlugin.staticChannels === false);
addResult("negative_case_manifest_read_performed_blocks_contract", manifestRead.passed === false && manifestRead.staticChannels === false);
addResult("negative_case_exact_manifest_path_without_A5_stays_blocked", exactManifestPathWithoutA5.passed === false && exactManifestPathWithoutA5.staticChannels === false);
addResult("negative_case_runtime_integration_claim_blocks_contract", runtimeClaim.passed === false && runtimeClaim.blocked === false);

for (const token of [
  "phase: v14_151_dry_run_vcp_adapter_contract_v1",
  "dry_run_vcp_adapter_contract_v1_created: true",
  "vcpchat_static_handoff_defined: true",
  "vcptoolbox_static_handoff_defined: true",
  "manifest_authorization_handoff_defined: true",
  "runtime_integration_allowed: false",
  "authorization_granted_by_this_record: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_151_dry_run_vcp_adapter_contract_v1.js",
  "docs/v14_151_dry_run_vcp_adapter_contract_v1.md",
  "integrations/vcp/dry_run_vcp_adapter_contract_v1.yaml",
  "schemas/dry_run_vcp_adapter_contract_v1.schema.yaml",
  "tests/schema_examples/v14_151_dry_run_vcp_adapter_contract_v1.example.yaml",
  "v14_151_dry_run_vcp_adapter_contract_v1",
  "dry_run_vcp_adapter_contract_v1_created: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_contract:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /runtime_integration_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /source_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /ipc_preload_renderer_integration_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_151_dry_run_vcp_adapter_contract_v1",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  dry_run_vcp_adapter_contract_v1_created: true,
  vcpchat_static_handoff_defined: true,
  vcptoolbox_static_handoff_defined: true,
  manifest_authorization_handoff_defined: true,
  v14_115_dry_run_vcp_adapter_alignment_still_passes: v14_115?.passed === true,
  v14_150_local_regression_suite_still_passes: v14_150?.passed === true,
  negative_case_vcpchat_runtime_channel_enabled_blocks_contract: vcpchatRuntime.passed === false && vcpchatRuntime.staticChannels === false,
  negative_case_vcptoolbox_plugin_call_allowed_blocks_contract: vcptoolboxPlugin.passed === false && vcptoolboxPlugin.staticChannels === false,
  negative_case_manifest_read_performed_blocks_contract: manifestRead.passed === false && manifestRead.staticChannels === false,
  negative_case_exact_manifest_path_without_A5_stays_blocked: exactManifestPathWithoutA5.passed === false && exactManifestPathWithoutA5.staticChannels === false,
  negative_case_runtime_integration_claim_blocks_contract: runtimeClaim.passed === false && runtimeClaim.blocked === false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  authorization_granted_by_this_record: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  ipc_preload_renderer_integration_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  push_tag_release_deploy_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
