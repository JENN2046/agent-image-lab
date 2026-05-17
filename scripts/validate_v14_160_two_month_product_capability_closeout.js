#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_160_two_month_product_capability_closeout.md",
  schema: "schemas/two_month_product_capability_closeout.schema.yaml",
  fixture: "tests/schema_examples/v14_160_two_month_product_capability_closeout.example.yaml",
  v14_142_validator: "scripts/validate_v14_142_multi_accepted_sample_matrix.js",
  v14_153_validator: "scripts/validate_v14_153_manifest_read_authorization_gate_package.js",
  v14_159_validator: "scripts/validate_v14_159_end_to_end_audit_rollback_package.js",
  currentValidator: "scripts/validate_v14_160_two_month_product_capability_closeout.js",
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

function evaluateCloseout(input) {
  const localChainOk = input.localLifecycleChainCompletedValidated === true && input.auditedLocalStageCount === 13;
  const matrixCountsOk =
    input.registrySampleCount >= 3 &&
    input.registryCategoryCount >= 3 &&
    input.localArtifactSampleCount >= 4 &&
    input.fullRecoverableSampleCount === 1 &&
    input.hardAcceptanceThreeFullSamplesMet === false &&
    input.remainingFullRecoverableSampleGap === 2;
  const goalNotOverclaimed = input.twoMonthGoalFullyComplete === false && input.updateGoalCalled === false;
  const skippedA5Ok = input.a5ExecutionSlotsSkippedWithoutAuthorization === true && input.skippedA5MarkedComplete === false;
  const noRuntimeClaim =
    input.artifactRecoverabilityIsNotVcpRuntimeIntegration === true &&
    input.vcpRuntimeIntegrationProven === false;
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
    input.imageBinaryCopyPerformed === false &&
    input.productionCandidateWritePerformed === false &&
    input.failureSamplesWritePerformed === false &&
    input.dailyNoteWritePerformed === false &&
    input.vcpMemoryWritePerformed === false;

  return {
    passed: localChainOk && matrixCountsOk && goalNotOverclaimed && skippedA5Ok && noRuntimeClaim && noExternalActions && noWrites,
    localChainOk,
    matrixCountsOk,
    goalNotOverclaimed,
    skippedA5Ok,
    noRuntimeClaim,
    noExternalActions,
    noWrites,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
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
  "two_month_product_capability_closeout:",
  "execution_mode: local_closeout_only",
  "local_lifecycle_chain_completed_validated: true",
  "registry_sample_count: 6",
  "registry_category_count: 3",
  "local_artifact_sample_count: 4",
  "full_recoverable_sample_count: 1",
  "hard_acceptance_three_full_samples_met: false",
  "remaining_full_recoverable_sample_gap: 2",
  "two_month_goal_fully_complete: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("schema", schema, token);
  requireToken("fixture", fixture, token);
}

let v14_142 = null;
let v14_153 = null;
let v14_159 = null;
try {
  v14_142 = runJson(files.v14_142_validator);
  addResult("v14_142_multi_accepted_sample_matrix_still_passes", v14_142.passed === true);
} catch (error) {
  addResult("v14_142_multi_accepted_sample_matrix_still_passes", false, error.message);
}
try {
  v14_153 = runJson(files.v14_153_validator);
  addResult("v14_153_manifest_read_authorization_gate_still_passes", v14_153.passed === true);
} catch (error) {
  addResult("v14_153_manifest_read_authorization_gate_still_passes", false, error.message);
}
try {
  v14_159 = runJson(files.v14_159_validator);
  addResult("v14_159_end_to_end_audit_rollback_still_passes", v14_159.passed === true);
} catch (error) {
  addResult("v14_159_end_to_end_audit_rollback_still_passes", false, error.message);
}

const observed = {
  registrySampleCount: v14_142?.sample_count || 0,
  registryCategoryCount: v14_142?.category_count || 0,
  localArtifactSampleCount: v14_142?.local_artifact_sample_count || 0,
  fullRecoverableSampleCount: v14_142?.complete_recoverable_sample_count || 0,
  hardAcceptanceThreeFullSamplesMet: (v14_142?.complete_recoverable_sample_count || 0) >= 3,
  remainingFullRecoverableSampleGap: Math.max(0, 3 - (v14_142?.complete_recoverable_sample_count || 0)),
};

addResult("observed_registry_sample_count_is_6", observed.registrySampleCount === 6, `${observed.registrySampleCount}`);
addResult("observed_registry_category_count_is_3", observed.registryCategoryCount === 3, `${observed.registryCategoryCount}`);
addResult("observed_local_artifact_sample_count_is_4", observed.localArtifactSampleCount === 4, `${observed.localArtifactSampleCount}`);
addResult("observed_full_recoverable_sample_count_is_1", observed.fullRecoverableSampleCount === 1, `${observed.fullRecoverableSampleCount}`);
addResult("observed_three_sample_hard_acceptance_not_met", observed.hardAcceptanceThreeFullSamplesMet === false);
addResult("observed_remaining_full_sample_gap_is_2", observed.remainingFullRecoverableSampleGap === 2, `${observed.remainingFullRecoverableSampleGap}`);

const baseInput = {
  localLifecycleChainCompletedValidated: true,
  auditedLocalStageCount: v14_159?.audited_local_stage_count || 0,
  registrySampleCount: observed.registrySampleCount,
  registryCategoryCount: observed.registryCategoryCount,
  localArtifactSampleCount: observed.localArtifactSampleCount,
  fullRecoverableSampleCount: observed.fullRecoverableSampleCount,
  hardAcceptanceThreeFullSamplesMet: observed.hardAcceptanceThreeFullSamplesMet,
  remainingFullRecoverableSampleGap: observed.remainingFullRecoverableSampleGap,
  twoMonthGoalFullyComplete: false,
  updateGoalCalled: false,
  a5ExecutionSlotsSkippedWithoutAuthorization: v14_159?.a5_execution_slots_skipped_without_authorization === true,
  skippedA5MarkedComplete: false,
  artifactRecoverabilityIsNotVcpRuntimeIntegration: true,
  vcpRuntimeIntegrationProven: false,
  providerContactPerformed: false,
  pluginCallPerformed: false,
  apiCallPerformed: false,
  mcpRuntimePerformed: false,
  imageGenerationPerformed: false,
  realManifestReadPerformed: false,
  realVcpchatReadPerformed: false,
  realVcptoolboxReadPerformed: false,
  imageBinaryCopyPerformed: false,
  productionCandidateWritePerformed: false,
  failureSamplesWritePerformed: false,
  dailyNoteWritePerformed: false,
  vcpMemoryWritePerformed: false,
};

const evaluation = evaluateCloseout(baseInput);
addResult("two_month_product_capability_closeout_evaluation_passes", evaluation.passed, JSON.stringify(evaluation));

const threeSamplesOverclaimed = evaluateCloseout({ ...baseInput, hardAcceptanceThreeFullSamplesMet: true, remainingFullRecoverableSampleGap: 0, twoMonthGoalFullyComplete: true });
const skippedA5Complete = evaluateCloseout({ ...baseInput, skippedA5MarkedComplete: true });
const runtimeClaim = evaluateCloseout({ ...baseInput, artifactRecoverabilityIsNotVcpRuntimeIntegration: false, vcpRuntimeIntegrationProven: true });
const dashboardTokenProgress = evaluateCloseout({ ...baseInput, fullRecoverableSampleCount: 3, hardAcceptanceThreeFullSamplesMet: true, remainingFullRecoverableSampleGap: 0 });
const externalAction = evaluateCloseout({ ...baseInput, pluginCallPerformed: true });

addResult("negative_case_three_sample_gap_must_block_goal_completion", threeSamplesOverclaimed.passed === false && threeSamplesOverclaimed.goalNotOverclaimed === false);
addResult("negative_case_skipped_a5_marked_complete_blocks_closeout", skippedA5Complete.passed === false && skippedA5Complete.skippedA5Ok === false);
addResult("negative_case_vcp_runtime_claim_blocks_closeout", runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false);
addResult("negative_case_dashboard_token_progress_blocks_closeout", dashboardTokenProgress.passed === false && dashboardTokenProgress.matrixCountsOk === false);
addResult("negative_case_external_action_flag_blocks_closeout", externalAction.passed === false && externalAction.noExternalActions === false);

for (const token of [
  "phase: v14_160_two_month_product_capability_closeout",
  "two_month_product_capability_closeout_created: true",
  "local_lifecycle_chain_completed_validated: true",
  "full_recoverable_sample_count: 1",
  "hard_acceptance_three_full_samples_met: false",
  "remaining_full_recoverable_sample_gap: 2",
  "two_month_goal_fully_complete: false",
  "product_capability_progress:",
  "approximate_progress_percent: 72",
  "governance_capability_progress:",
  "approximate_progress_percent: 90",
  "real_vcp_integration_progress:",
  "approximate_progress_percent: 38",
  "goal_status: active_not_complete",
  "update_goal_called: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_160_two_month_product_capability_closeout.js",
  "docs/v14_160_two_month_product_capability_closeout.md",
  "schemas/two_month_product_capability_closeout.schema.yaml",
  "tests/schema_examples/v14_160_two_month_product_capability_closeout.example.yaml",
  "v14_160_two_month_product_capability_closeout",
  "two_month_product_capability_closeout_created: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("phase_surfaces", phaseSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /hard_acceptance_three_full_samples_met:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /two_month_goal_fully_complete:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /update_goal_called:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /api_call_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_160_two_month_product_capability_closeout",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  two_month_product_capability_closeout_created: true,
  local_lifecycle_chain_completed_validated: true,
  audited_local_stage_count: v14_159?.audited_local_stage_count || 0,
  registry_sample_count: observed.registrySampleCount,
  registry_category_count: observed.registryCategoryCount,
  local_artifact_sample_count: observed.localArtifactSampleCount,
  full_recoverable_sample_count: observed.fullRecoverableSampleCount,
  hard_acceptance_three_full_samples_met: observed.hardAcceptanceThreeFullSamplesMet,
  remaining_full_recoverable_sample_gap: observed.remainingFullRecoverableSampleGap,
  product_capability_progress_percent: 72,
  governance_capability_progress_percent: 90,
  real_vcp_integration_progress_percent: 38,
  a5_execution_slots_skipped_without_authorization: true,
  two_month_goal_fully_complete: false,
  goal_status: "active_not_complete",
  negative_case_three_sample_gap_must_block_goal_completion: threeSamplesOverclaimed.passed === false && threeSamplesOverclaimed.goalNotOverclaimed === false,
  negative_case_skipped_a5_marked_complete_blocks_closeout: skippedA5Complete.passed === false && skippedA5Complete.skippedA5Ok === false,
  negative_case_vcp_runtime_claim_blocks_closeout: runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false,
  negative_case_dashboard_token_progress_blocks_closeout: dashboardTokenProgress.passed === false && dashboardTokenProgress.matrixCountsOk === false,
  negative_case_external_action_flag_blocks_closeout: externalAction.passed === false && externalAction.noExternalActions === false,
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
  image_binary_copy_performed: false,
  production_candidate_write_performed: false,
  failure_samples_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  push_tag_release_deploy_performed: false,
  update_goal_called: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
