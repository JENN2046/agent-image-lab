#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_152_review_console_handoff_contract.md",
  handoffContract: "review_console/static_prototype/HANDOFF_CONTRACT.md",
  schema: "schemas/review_console_handoff_contract.schema.yaml",
  fixture: "tests/schema_examples/v14_152_review_console_handoff_contract.example.yaml",
  v14_144_validator: "scripts/validate_v14_144_review_console_schema_binding.js",
  v14_151_validator: "scripts/validate_v14_151_dry_run_vcp_adapter_contract_v1.js",
  currentValidator: "scripts/validate_v14_152_review_console_handoff_contract.js",
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

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

function runJson(scriptPath) {
  return JSON.parse(execFileSync(process.execPath, [scriptPath], { cwd: root, encoding: "utf8" }));
}

function evaluateHandoff(input) {
  const staticOnly =
    input.childWindowRuntimeCreated === false &&
    input.ipcChannelCreated === false &&
    input.preloadScriptCreated === false &&
    input.rendererIntegrationCreated === false &&
    input.fetchPerformed === false &&
    input.fileWritePerformed === false;
  const noExternalRead =
    input.realManifestReadPerformed === false &&
    input.realVcpchatReadPerformed === false &&
    input.realVcptoolboxReadPerformed === false;
  const noExternalWrite =
    input.dailyNoteWritePerformed === false &&
    input.vcpMemoryWritePerformed === false &&
    input.productionCandidateWritePerformed === false;
  const noAuthorizationClaim =
    input.authorizationGranted === false &&
    input.runtimeIntegrationAllowed === false &&
    input.runtimeIntegrationClaim === false;

  return {
    passed: staticOnly && noExternalRead && noExternalWrite && noAuthorizationClaim,
    staticOnly,
    noExternalRead,
    noExternalWrite,
    noAuthorizationClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const handoffContract = core.read(files.handoffContract);
const schema = core.read(files.schema);
const fixture = core.read(files.fixture);
const currentSurfaces = [
  phaseRecord,
  handoffContract,
  schema,
  fixture,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");
const phaseSurfaces = [phaseRecord, handoffContract, schema, fixture].join("\n");

for (const token of [
  "review_console_handoff_contract:",
  "contract_type: review_console_handoff_contract",
  "handoff_mode: static_child_window_data_contract",
  "execution_mode: local_contract_only",
  "runtime_integration_allowed: false",
  "authorization_granted_by_contract: false",
  "child_window_runtime_created: false",
  "ipc_channel_created: false",
  "preload_script_created: false",
  "renderer_integration_created: false",
  "fetch_performed: false",
  "file_write_performed: false",
]) {
  requireToken("schema", schema, token);
  requireToken("fixture", fixture, token);
}

for (const token of [
  "contract_id: v14_152_review_console_handoff_contract",
  "mode: static_child_window_data_contract",
  "accepted_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001",
  "recoverability_suite_ref: scripts/run_v14_local_regression_suite.js",
  "dry_run_vcp_adapter_contract_ref: integrations/vcp/dry_run_vcp_adapter_contract_v1.yaml",
  "authorization_package_compiler_ref: scripts/compile_v14_149_authorization_packages.js",
  "create_ipc_channel",
  "create_preload_script",
  "create_renderer_integration",
  "read_real_manifest",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("handoff_contract", handoffContract, token);
  requireToken("fixture", fixture, token);
}

let v14_144 = null;
let v14_151 = null;
try {
  v14_144 = runJson(files.v14_144_validator);
  addResult("v14_144_review_console_schema_binding_still_passes", v14_144.passed === true);
} catch (error) {
  addResult("v14_144_review_console_schema_binding_still_passes", false, error.message);
}

try {
  v14_151 = runJson(files.v14_151_validator);
  addResult("v14_151_dry_run_vcp_adapter_contract_still_passes", v14_151.passed === true);
} catch (error) {
  addResult("v14_151_dry_run_vcp_adapter_contract_still_passes", false, error.message);
}

const baseInput = {
  authorizationGranted: false,
  runtimeIntegrationAllowed: false,
  runtimeIntegrationClaim: false,
  childWindowRuntimeCreated: false,
  ipcChannelCreated: false,
  preloadScriptCreated: false,
  rendererIntegrationCreated: false,
  fetchPerformed: false,
  fileWritePerformed: false,
  realManifestReadPerformed: false,
  realVcpchatReadPerformed: false,
  realVcptoolboxReadPerformed: false,
  dailyNoteWritePerformed: false,
  vcpMemoryWritePerformed: false,
  productionCandidateWritePerformed: false,
};

const evaluation = evaluateHandoff(baseInput);
addResult("review_console_handoff_contract_evaluation_passes", evaluation.passed, JSON.stringify(evaluation));

const ipcCreated = evaluateHandoff({ ...baseInput, ipcChannelCreated: true });
const preloadCreated = evaluateHandoff({ ...baseInput, preloadScriptCreated: true });
const rendererCreated = evaluateHandoff({ ...baseInput, rendererIntegrationCreated: true });
const fetchPerformed = evaluateHandoff({ ...baseInput, fetchPerformed: true });
const vcpchatRead = evaluateHandoff({ ...baseInput, realVcpchatReadPerformed: true });
const dailyNoteWrite = evaluateHandoff({ ...baseInput, dailyNoteWritePerformed: true });

addResult("negative_case_ipc_channel_created_blocks_contract", ipcCreated.passed === false && ipcCreated.staticOnly === false);
addResult("negative_case_preload_script_created_blocks_contract", preloadCreated.passed === false && preloadCreated.staticOnly === false);
addResult("negative_case_renderer_integration_created_blocks_contract", rendererCreated.passed === false && rendererCreated.staticOnly === false);
addResult("negative_case_fetch_performed_blocks_contract", fetchPerformed.passed === false && fetchPerformed.staticOnly === false);
addResult("negative_case_real_vcpchat_read_blocks_contract", vcpchatRead.passed === false && vcpchatRead.noExternalRead === false);
addResult("negative_case_dailynote_write_blocks_contract", dailyNoteWrite.passed === false && dailyNoteWrite.noExternalWrite === false);

for (const token of [
  "phase: v14_152_review_console_handoff_contract",
  "review_console_handoff_contract_created: true",
  "static_child_window_data_contract_defined: true",
  "review_console_display_only_fields_defined: true",
  "future_runtime_boundary_defined: true",
  "runtime_integration_allowed: false",
  "authorization_granted_by_this_record: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_152_review_console_handoff_contract.js",
  "docs/v14_152_review_console_handoff_contract.md",
  "review_console/static_prototype/HANDOFF_CONTRACT.md",
  "schemas/review_console_handoff_contract.schema.yaml",
  "tests/schema_examples/v14_152_review_console_handoff_contract.example.yaml",
  "v14_152_review_console_handoff_contract",
  "review_console_handoff_contract_created: true",
  "static_child_window_data_contract_defined: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("phase_surfaces", phaseSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /authorization_granted_by_contract:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /runtime_integration_allowed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /child_window_runtime_created:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /ipc_channel_created:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /preload_script_created:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /renderer_integration_created:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /fetch_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /file_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /api_call_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_152_review_console_handoff_contract",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  review_console_handoff_contract_created: true,
  static_child_window_data_contract_defined: true,
  review_console_display_only_fields_defined: true,
  future_runtime_boundary_defined: true,
  v14_144_review_console_schema_binding_still_passes: v14_144?.passed === true,
  v14_151_dry_run_vcp_adapter_contract_still_passes: v14_151?.passed === true,
  negative_case_ipc_channel_created_blocks_contract: ipcCreated.passed === false && ipcCreated.staticOnly === false,
  negative_case_preload_script_created_blocks_contract: preloadCreated.passed === false && preloadCreated.staticOnly === false,
  negative_case_renderer_integration_created_blocks_contract: rendererCreated.passed === false && rendererCreated.staticOnly === false,
  negative_case_fetch_performed_blocks_contract: fetchPerformed.passed === false && fetchPerformed.staticOnly === false,
  negative_case_real_vcpchat_read_blocks_contract: vcpchatRead.passed === false && vcpchatRead.noExternalRead === false,
  negative_case_dailynote_write_blocks_contract: dailyNoteWrite.passed === false && dailyNoteWrite.noExternalWrite === false,
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
  child_window_runtime_created: false,
  ipc_channel_created: false,
  preload_script_created: false,
  renderer_integration_created: false,
  fetch_performed: false,
  file_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  push_tag_release_deploy_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
