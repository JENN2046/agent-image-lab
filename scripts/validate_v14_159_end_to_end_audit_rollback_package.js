#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const stageValidators = [
  "scripts/validate_v14_141_recoverability_core_extraction.js",
  "scripts/validate_v14_142_multi_accepted_sample_matrix.js",
  "scripts/validate_v14_143_import_review_registry_schema_hardening.js",
  "scripts/validate_v14_144_review_console_schema_binding.js",
  "scripts/validate_v14_145_sample_lifecycle_state_machine.js",
  "scripts/validate_v14_146_durable_archive_dry_run_manifest.js",
  "scripts/validate_v14_147_production_candidate_eligibility_preflight.js",
  "scripts/validate_v14_148_memory_delta_draft_package.js",
  "scripts/validate_v14_149_authorization_package_compiler.js",
  "scripts/validate_v14_150_local_regression_suite_consolidation.js",
  "scripts/validate_v14_151_dry_run_vcp_adapter_contract_v1.js",
  "scripts/validate_v14_152_review_console_handoff_contract.js",
  "scripts/validate_v14_153_manifest_read_authorization_gate_package.js",
];

const files = {
  phaseRecord: "docs/v14_159_end_to_end_audit_and_rollback_package.md",
  schema: "schemas/end_to_end_audit_rollback_package.schema.yaml",
  fixture: "tests/schema_examples/v14_159_end_to_end_audit_rollback_package.example.yaml",
  currentValidator: "scripts/validate_v14_159_end_to_end_audit_rollback_package.js",
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

function evaluateRollbackPackage(input) {
  const validatorChainOk = input.stageValidatorCount === 13 && input.requiredValidatorChainPassed === true;
  const skippedA5Ok = input.a5ExecutionSlotsSkippedWithoutAuthorization === true && input.skippedA5MarkedComplete === false;
  const rollbackLocalOnly =
    input.rollbackScope === "local_draft_metadata_only" &&
    input.rollbackExternalActionPerformed === false &&
    input.destructiveFilesystemActionPerformed === false &&
    input.imageBinaryCopyPerformed === false &&
    input.runsSourceImageModified === false;
  const noExternalActions =
    input.providerContactPerformed === false &&
    input.pluginCallPerformed === false &&
    input.apiCallPerformed === false &&
    input.mcpRuntimePerformed === false &&
    input.imageGenerationPerformed === false &&
    input.realManifestReadPerformed === false &&
    input.realVcpchatReadPerformed === false &&
    input.realVcptoolboxReadPerformed === false;
  const noWrites =
    input.productionCandidateWritePerformed === false &&
    input.failureSamplesWritePerformed === false &&
    input.dailyNoteWritePerformed === false &&
    input.vcpMemoryWritePerformed === false;
  const noRuntimeClaim =
    input.artifactRecoverabilityIsNotVcpRuntimeIntegration === true &&
    input.vcpRuntimeIntegrationProven === false;

  return {
    passed: validatorChainOk && skippedA5Ok && rollbackLocalOnly && noExternalActions && noWrites && noRuntimeClaim,
    validatorChainOk,
    skippedA5Ok,
    rollbackLocalOnly,
    noExternalActions,
    noWrites,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}
for (const relativePath of stageValidators) {
  addResult(`${relativePath}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const schema = core.read(files.schema);
const fixture = core.read(files.fixture);
const currentSurfaces = [
  phaseRecord,
  schema,
  fixture,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");
const phaseSurfaces = [phaseRecord, schema, fixture].join("\n");

for (const token of [
  "end_to_end_audit_rollback_package:",
  "contract_type: end_to_end_audit_rollback_package",
  "execution_mode: local_validation_only",
  "audited_local_stage_count: 13",
  "required_validator_chain_passed: true",
  "a5_execution_slots_skipped_without_authorization: true",
  "rollback_scope: local_draft_metadata_only",
  "rollback_external_action_performed: false",
  "destructive_filesystem_action_performed: false",
  "image_binary_copy_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("schema", schema, token);
  requireToken("fixture", fixture, token);
}

let childFailures = 0;
for (const relativePath of stageValidators) {
  try {
    const output = runJson(relativePath);
    addResult(`${relativePath}_passes`, output.passed === true);
    if (output.passed !== true) childFailures += 1;
  } catch (error) {
    childFailures += 1;
    addResult(`${relativePath}_passes`, false, error.message);
  }
}

const baseInput = {
  stageValidatorCount: stageValidators.length,
  requiredValidatorChainPassed: childFailures === 0,
  a5ExecutionSlotsSkippedWithoutAuthorization: true,
  skippedA5MarkedComplete: false,
  rollbackScope: "local_draft_metadata_only",
  rollbackExternalActionPerformed: false,
  destructiveFilesystemActionPerformed: false,
  imageBinaryCopyPerformed: false,
  runsSourceImageModified: false,
  providerContactPerformed: false,
  pluginCallPerformed: false,
  apiCallPerformed: false,
  mcpRuntimePerformed: false,
  imageGenerationPerformed: false,
  realManifestReadPerformed: false,
  realVcpchatReadPerformed: false,
  realVcptoolboxReadPerformed: false,
  productionCandidateWritePerformed: false,
  failureSamplesWritePerformed: false,
  dailyNoteWritePerformed: false,
  vcpMemoryWritePerformed: false,
  artifactRecoverabilityIsNotVcpRuntimeIntegration: true,
  vcpRuntimeIntegrationProven: false,
};

const evaluation = evaluateRollbackPackage(baseInput);
addResult("end_to_end_audit_rollback_package_evaluation_passes", evaluation.passed, JSON.stringify(evaluation));

const missingValidator = evaluateRollbackPackage({ ...baseInput, stageValidatorCount: 12 });
const externalAction = evaluateRollbackPackage({ ...baseInput, providerContactPerformed: true });
const imageCopyRollback = evaluateRollbackPackage({ ...baseInput, imageBinaryCopyPerformed: true });
const runtimeClaim = evaluateRollbackPackage({ ...baseInput, artifactRecoverabilityIsNotVcpRuntimeIntegration: false, vcpRuntimeIntegrationProven: true });
const skippedA5Complete = evaluateRollbackPackage({ ...baseInput, skippedA5MarkedComplete: true });

addResult("negative_case_missing_stage_validator_blocks_audit", missingValidator.passed === false && missingValidator.validatorChainOk === false);
addResult("negative_case_external_action_flag_blocks_rollback", externalAction.passed === false && externalAction.noExternalActions === false);
addResult("negative_case_image_binary_copy_in_rollback_blocks_package", imageCopyRollback.passed === false && imageCopyRollback.rollbackLocalOnly === false);
addResult("negative_case_recoverability_claimed_as_vcp_runtime_blocks_package", runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false);
addResult("negative_case_skipped_a5_marked_complete_blocks_package", skippedA5Complete.passed === false && skippedA5Complete.skippedA5Ok === false);

for (const token of [
  "phase: v14_159_end_to_end_audit_and_rollback_package",
  "end_to_end_audit_and_rollback_package_created: true",
  "audited_local_stage_count: 13",
  "required_validator_chain_passed: true",
  "a5_execution_slots_skipped_without_authorization: true",
  "rollback_scope: local_draft_metadata_only",
  "rollback_external_action_allowed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_159_end_to_end_audit_rollback_package.js",
  "docs/v14_159_end_to_end_audit_and_rollback_package.md",
  "schemas/end_to_end_audit_rollback_package.schema.yaml",
  "tests/schema_examples/v14_159_end_to_end_audit_rollback_package.example.yaml",
  "v14_159_end_to_end_audit_and_rollback_package",
  "end_to_end_audit_and_rollback_package_created: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

for (const phase of [
  "v14_154_manifest_read_execution",
  "v14_155_durable_archive_execution",
  "v14_156_production_candidate_execution",
  "v14_157_dailynote_vcp_memory_execution",
  "v14_158_external_runtime_or_memory_followup",
]) {
  requireToken("fixture", fixture, phase);
  requireToken("fixture", fixture, "skipped_requires_jenn_A5");
}

forbidPattern("phase_surfaces", phaseSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /rollback_external_action_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /destructive_filesystem_action_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /runs_source_image_modified:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /api_call_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_159_end_to_end_audit_rollback_package",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  end_to_end_audit_and_rollback_package_created: true,
  audited_local_stage_count: stageValidators.length,
  required_validator_chain_passed: childFailures === 0,
  a5_execution_slots_skipped_without_authorization: true,
  rollback_scope: "local_draft_metadata_only",
  rollback_external_action_allowed: false,
  negative_case_missing_stage_validator_blocks_audit: missingValidator.passed === false && missingValidator.validatorChainOk === false,
  negative_case_external_action_flag_blocks_rollback: externalAction.passed === false && externalAction.noExternalActions === false,
  negative_case_image_binary_copy_in_rollback_blocks_package: imageCopyRollback.passed === false && imageCopyRollback.rollbackLocalOnly === false,
  negative_case_recoverability_claimed_as_vcp_runtime_blocks_package: runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false,
  negative_case_skipped_a5_marked_complete_blocks_package: skippedA5Complete.passed === false && skippedA5Complete.skippedA5Ok === false,
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
  durable_archive_executed: false,
  archive_manifest_written: false,
  image_binary_copy_performed: false,
  production_candidate_write_performed: false,
  failure_samples_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  rollback_external_action_performed: false,
  destructive_filesystem_action_performed: false,
  push_tag_release_deploy_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
