#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_153_manifest_read_authorization_gate_package.md",
  authorizationGate: "integrations/vcp/manifest_read_authorization_gate_package_v1.yaml",
  schema: "schemas/manifest_read_authorization_gate_package.schema.yaml",
  fixture: "tests/schema_examples/v14_153_manifest_read_authorization_gate_package.example.yaml",
  v14_116_validator: "scripts/validate_v14_116_manifest_read_authorization_current_goal_alignment.js",
  v14_152_validator: "scripts/validate_v14_152_review_console_handoff_contract.js",
  currentValidator: "scripts/validate_v14_153_manifest_read_authorization_gate_package.js",
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

function evaluateGate(input) {
  const missingPathKeepsIncomplete =
    input.exactRealManifestPathProvided === false &&
    input.packageStatus === "prepared_incomplete_not_granted" &&
    input.manifestReadAuthorizationReady === false;
  const noRead =
    input.readAuthorized === false &&
    input.readPerformed === false &&
    input.sourceAuthorized === false &&
    input.sourceReadPerformed === false &&
    input.realManifestReadPerformed === false &&
    input.realVcpchatReadPerformed === false &&
    input.realVcptoolboxReadPerformed === false;
  const noRawCopy =
    input.rawManifestCopyAllowed === false &&
    Array.isArray(input.allowedSourcePaths) &&
    input.allowedSourcePaths.length === 0 &&
    input.readCommandPermission === false;
  const noRuntimeOrWrites =
    input.runtimeIntegrationAllowed === false &&
    input.runtimeIntegrationPerformed === false &&
    input.dailyNoteWritePerformed === false &&
    input.vcpMemoryWritePerformed === false &&
    input.productionCandidateWritePerformed === false;
  const noAuthorizationClaim = input.authorizationGranted === false;

  return {
    passed: missingPathKeepsIncomplete && noRead && noRawCopy && noRuntimeOrWrites && noAuthorizationClaim,
    missingPathKeepsIncomplete,
    noRead,
    noRawCopy,
    noRuntimeOrWrites,
    noAuthorizationClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const authorizationGate = core.read(files.authorizationGate);
const schema = core.read(files.schema);
const fixture = core.read(files.fixture);
const currentSurfaces = [
  phaseRecord,
  authorizationGate,
  schema,
  fixture,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");
const phaseSurfaces = [phaseRecord, authorizationGate, schema, fixture].join("\n");

for (const token of [
  "manifest_read_authorization_gate_package:",
  "contract_type: manifest_read_authorization_gate_package",
  "mode: local_authorization_package_only",
  "package_status: prepared_incomplete_not_granted",
  "authorization_granted_by_this_record: false",
  "exact_real_manifest_path_provided: false",
  "manifest_read_authorization_ready: false",
  "exact_allowed_paths: []",
  "missing_required_fields:",
  "exact_real_manifest_path",
  "read_authorized: false",
  "read_performed: false",
  "real_manifest_read_performed: false",
  "raw_manifest_copy_allowed: false",
]) {
  requireToken("schema", schema, token);
  requireToken("fixture", fixture, token);
}

for (const token of [
  "phase: v14_153_manifest_read_authorization_gate_package",
  "review_console_handoff_contract_ref: review_console/static_prototype/HANDOFF_CONTRACT.md",
  "dry_run_vcp_adapter_contract_ref: integrations/vcp/dry_run_vcp_adapter_contract_v1.yaml",
  "authorization_package_compiler_ref: scripts/compile_v14_149_authorization_packages.js",
  "prior_manifest_authorization_alignment_ref: docs/v14_116_manifest_read_authorization_current_goal_alignment.md",
  "read_one_explicit_manifest_file",
  "copy_raw_manifest",
  "call_plugin_API_or_MCP",
  "create_runtime_integration",
]) {
  requireToken("authorization_gate", authorizationGate, token);
  requireToken("fixture", fixture, token);
}

let v14_116 = null;
let v14_152 = null;
try {
  v14_116 = runJson(files.v14_116_validator);
  addResult("v14_116_manifest_read_authorization_alignment_still_passes", v14_116.passed === true);
} catch (error) {
  addResult("v14_116_manifest_read_authorization_alignment_still_passes", false, error.message);
}

try {
  v14_152 = runJson(files.v14_152_validator);
  addResult("v14_152_review_console_handoff_contract_still_passes", v14_152.passed === true);
} catch (error) {
  addResult("v14_152_review_console_handoff_contract_still_passes", false, error.message);
}

const baseInput = {
  authorizationGranted: false,
  exactRealManifestPathProvided: false,
  packageStatus: "prepared_incomplete_not_granted",
  manifestReadAuthorizationReady: false,
  readAuthorized: false,
  readPerformed: false,
  sourceAuthorized: false,
  sourceReadPerformed: false,
  realManifestReadPerformed: false,
  realVcpchatReadPerformed: false,
  realVcptoolboxReadPerformed: false,
  rawManifestCopyAllowed: false,
  allowedSourcePaths: [],
  readCommandPermission: false,
  runtimeIntegrationAllowed: false,
  runtimeIntegrationPerformed: false,
  dailyNoteWritePerformed: false,
  vcpMemoryWritePerformed: false,
  productionCandidateWritePerformed: false,
};

const evaluation = evaluateGate(baseInput);
addResult("manifest_read_authorization_gate_evaluation_passes", evaluation.passed, JSON.stringify(evaluation));

const exactPathMissing = evaluateGate({ ...baseInput, packageStatus: "prepared_not_granted", manifestReadAuthorizationReady: true });
const readPerformed = evaluateGate({ ...baseInput, readPerformed: true });
const sourcePathAllowed = evaluateGate({ ...baseInput, allowedSourcePaths: ["redacted-real-manifest-path"], readCommandPermission: true });
const rawCopyAllowed = evaluateGate({ ...baseInput, rawManifestCopyAllowed: true });
const runtimeAllowed = evaluateGate({ ...baseInput, runtimeIntegrationAllowed: true });
const vcpchatRead = evaluateGate({ ...baseInput, realVcpchatReadPerformed: true });

addResult("negative_case_exact_manifest_path_missing_keeps_package_incomplete", exactPathMissing.passed === false && exactPathMissing.missingPathKeepsIncomplete === false);
addResult("negative_case_read_performed_blocks_package", readPerformed.passed === false && readPerformed.noRead === false);
addResult("negative_case_source_path_allowed_without_A5_blocks_package", sourcePathAllowed.passed === false && sourcePathAllowed.noRawCopy === false);
addResult("negative_case_raw_manifest_copy_allowed_blocks_package", rawCopyAllowed.passed === false && rawCopyAllowed.noRawCopy === false);
addResult("negative_case_runtime_integration_allowed_blocks_package", runtimeAllowed.passed === false && runtimeAllowed.noRuntimeOrWrites === false);
addResult("negative_case_real_vcpchat_read_blocks_package", vcpchatRead.passed === false && vcpchatRead.noRead === false);

for (const token of [
  "phase: v14_153_manifest_read_authorization_gate_package",
  "manifest_read_authorization_gate_package_created: true",
  "package_status: prepared_incomplete_not_granted",
  "exact_real_manifest_path_provided: false",
  "manifest_read_authorization_ready: false",
  "read_authorized: false",
  "read_performed: false",
  "real_manifest_read_performed: false",
  "authorization_granted_by_this_record: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_153_manifest_read_authorization_gate_package.js",
  "docs/v14_153_manifest_read_authorization_gate_package.md",
  "integrations/vcp/manifest_read_authorization_gate_package_v1.yaml",
  "schemas/manifest_read_authorization_gate_package.schema.yaml",
  "tests/schema_examples/v14_153_manifest_read_authorization_gate_package.example.yaml",
  "v14_153_manifest_read_authorization_gate_package",
  "manifest_read_authorization_gate_package_created: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("phase_surfaces", phaseSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /manifest_read_authorization_ready:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /exact_real_manifest_path_provided:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /read_authorized:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /source_authorized:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /source_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /raw_manifest_copy_allowed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /read_command_permission:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /api_call_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /runtime_integration_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_153_manifest_read_authorization_gate_package",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  manifest_read_authorization_gate_package_created: true,
  package_status: "prepared_incomplete_not_granted",
  exact_real_manifest_path_provided: false,
  manifest_read_authorization_ready: false,
  v14_116_manifest_read_authorization_alignment_still_passes: v14_116?.passed === true,
  v14_152_review_console_handoff_contract_still_passes: v14_152?.passed === true,
  negative_case_exact_manifest_path_missing_keeps_package_incomplete: exactPathMissing.passed === false && exactPathMissing.missingPathKeepsIncomplete === false,
  negative_case_read_performed_blocks_package: readPerformed.passed === false && readPerformed.noRead === false,
  negative_case_source_path_allowed_without_A5_blocks_package: sourcePathAllowed.passed === false && sourcePathAllowed.noRawCopy === false,
  negative_case_raw_manifest_copy_allowed_blocks_package: rawCopyAllowed.passed === false && rawCopyAllowed.noRawCopy === false,
  negative_case_runtime_integration_allowed_blocks_package: runtimeAllowed.passed === false && runtimeAllowed.noRuntimeOrWrites === false,
  negative_case_real_vcpchat_read_blocks_package: vcpchatRead.passed === false && vcpchatRead.noRead === false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  authorization_granted_by_this_record: false,
  read_authorized: false,
  read_performed: false,
  source_authorized: false,
  source_read_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  raw_manifest_copy_allowed: false,
  read_command_permission: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  runtime_integration_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  production_candidate_write_performed: false,
  push_tag_release_deploy_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
