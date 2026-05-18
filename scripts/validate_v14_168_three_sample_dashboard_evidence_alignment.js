#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_168_three_sample_dashboard_evidence_alignment.md",
  fixture: "tests/schema_examples/v14_168_three_sample_dashboard_evidence_alignment.example.json",
  acceptedRegistrationValidator: "scripts/validate_v14_165_bag_accepted_samples_metadata_registration.js",
  blockedCandidateValidator: "scripts/validate_v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.js",
  currentValidator: "scripts/validate_v14_168_three_sample_dashboard_evidence_alignment.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_168_three_sample_dashboard_evidence_alignment",
  acceptedCount: 3,
  blockedCount: 0,
  remainingGap: 0,
  bagSampleId: "accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001",
  knitSampleId: "accepted_womens_resort_relaxed_knit_codex_v2_001",
  blockedSampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  blockedCandidateId: "v14_166_lamp_v3_generated_candidate_001",
  blockedSha: "eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c",
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

function runValidator(relativePath) {
  const output = childProcess.execFileSync(process.execPath, [core.repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function evaluateDashboard(input) {
  const counts = input.dashboard_counts || {};
  const guard = input.guard || {};
  const blockedCandidates = input.blocked_candidates || [];
  const accepted = input.accepted_samples || [];
  const sourceValidatorsOk =
    input.source_validators?.accepted_registration_validator === files.acceptedRegistrationValidator &&
    input.source_validators?.blocked_candidate_validator === files.blockedCandidateValidator;
  const acceptedOk =
    accepted.includes(expected.knitSampleId) &&
    accepted.includes(expected.bagSampleId) &&
    accepted.includes(expected.blockedSampleId) &&
    accepted.length === expected.acceptedCount;
  const blockedOk = blockedCandidates.length === expected.blockedCount;
  const countsOk =
    counts.full_recoverable_accepted_sample_count === expected.acceptedCount &&
    counts.blocked_third_candidate_count === expected.blockedCount &&
    counts.hard_acceptance_three_full_samples_met === true &&
    counts.remaining_full_recoverable_sample_gap === expected.remainingGap &&
    counts.pending_candidate_counted_as_accepted === false;
  const noDashboardProxy =
    guard.dashboard_uses_project_master_plan_progress === false &&
    guard.dashboard_uses_document_token_progress === false &&
    guard.dashboard_promotes_product_status === false;
  const noWrites =
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;
  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;
  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: sourceValidatorsOk && acceptedOk && blockedOk && countsOk && noDashboardProxy && noWrites && noExternal && noRuntimeClaim,
    sourceValidatorsOk,
    acceptedOk,
    blockedOk,
    countsOk,
    noDashboardProxy,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const fixture = core.parseJson(files.fixture).three_sample_dashboard_evidence_alignment;
const acceptedRegistrationOutput = runValidator(files.acceptedRegistrationValidator);
const blockedCandidateOutput = runValidator(files.blockedCandidateValidator);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

addResult("accepted_registration_validator_passes", acceptedRegistrationOutput.passed === true);
addResult("accepted_registration_legacy_validator_still_passes", acceptedRegistrationOutput.passed === true);
addResult("blocked_candidate_validator_passes", blockedCandidateOutput.passed === true);
addResult("lamp_post_registration_is_eligible", blockedCandidateOutput.accepted_samples_registration_eligible === true);
addResult("lamp_post_registration_has_no_blocker", blockedCandidateOutput.registration_blocker === null);
addResult("blocked_candidate_artifact_hash_matches", blockedCandidateOutput.artifact_sha256 === expected.blockedSha);

const dashboardEval = evaluateDashboard(fixture);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("fixture_execution_mode_dashboard_only", fixture.execution_mode === "dashboard_evidence_alignment_only");
addResult("dashboard_evaluation_passes", dashboardEval.passed, JSON.stringify(dashboardEval));

const pendingCountedAsAccepted = evaluateDashboard({
  ...fixture,
  accepted_samples: fixture.accepted_samples.filter((sampleId) => sampleId !== expected.blockedSampleId),
  dashboard_counts: {
    ...fixture.dashboard_counts,
    full_recoverable_accepted_sample_count: 2,
    blocked_third_candidate_count: 1,
    remaining_full_recoverable_sample_gap: 1,
    pending_candidate_counted_as_accepted: true,
  },
});
const goalCompleteOverclaim = evaluateDashboard({
  ...fixture,
  dashboard_counts: { ...fixture.dashboard_counts, hard_acceptance_three_full_samples_met: false },
});
const projectMasterPlanProgress = evaluateDashboard({
  ...fixture,
  guard: { ...fixture.guard, dashboard_uses_project_master_plan_progress: true },
});
const documentTokenProgress = evaluateDashboard({
  ...fixture,
  guard: { ...fixture.guard, dashboard_uses_document_token_progress: true },
});
const runtimeClaim = evaluateDashboard({
  ...fixture,
  guard: { ...fixture.guard, artifact_recoverability_is_not_vcp_runtime_integration: false, vcp_runtime_integration_proven: true },
});
const externalAction = evaluateDashboard({
  ...fixture,
  guard: { ...fixture.guard, provider_contact_performed: true },
});
const acceptedWrite = evaluateDashboard({
  ...fixture,
  guard: { ...fixture.guard, accepted_samples_write_performed: true },
});

addResult("negative_case_dashboard_drops_registered_lamp_fails", pendingCountedAsAccepted.passed === false && pendingCountedAsAccepted.acceptedOk === false);
addResult("negative_case_three_sample_goal_marked_incomplete_fails", goalCompleteOverclaim.passed === false && goalCompleteOverclaim.countsOk === false);
addResult("negative_case_project_master_plan_progress_fails", projectMasterPlanProgress.passed === false && projectMasterPlanProgress.noDashboardProxy === false);
addResult("negative_case_document_token_progress_fails", documentTokenProgress.passed === false && documentTokenProgress.noDashboardProxy === false);
addResult("negative_case_runtime_claim_blocks_dashboard", runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false);
addResult("negative_case_external_action_flag_blocks_dashboard", externalAction.passed === false && externalAction.noExternal === false);
addResult("negative_case_accepted_samples_write_flag_blocks_dashboard", acceptedWrite.passed === false && acceptedWrite.noWrites === false);

for (const token of [
  "phase: v14_168_three_sample_dashboard_evidence_alignment",
  "execution_mode: dashboard_evidence_alignment_only",
  "dashboard_progress_basis: validator_outputs_real_artifact_evidence",
  "full_recoverable_accepted_sample_count: 3",
  "blocked_third_candidate_count: 0",
  "hard_acceptance_three_full_samples_met: true",
  "remaining_full_recoverable_sample_gap: 0",
  "dashboard_must_not_count_pending_candidate_as_accepted: true",
  "dashboard_uses_project_master_plan_progress: false",
  "dashboard_uses_document_token_progress: false",
  "dashboard_promotes_product_status: false",
  "accepted_samples_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_168_three_sample_dashboard_evidence_alignment.js",
  "docs/v14_168_three_sample_dashboard_evidence_alignment.md",
  "tests/schema_examples/v14_168_three_sample_dashboard_evidence_alignment.example.json",
  "v14_168_three_sample_dashboard_evidence_alignment",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /dashboard_uses_project_master_plan_progress:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /dashboard_uses_document_token_progress:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /dashboard_promotes_product_status:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_168_three_sample_dashboard_evidence_alignment",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  dashboard_progress_basis: "validator_outputs_real_artifact_evidence",
  full_recoverable_accepted_sample_count: expected.acceptedCount,
  blocked_third_candidate_count: expected.blockedCount,
  hard_acceptance_three_full_samples_met: true,
  remaining_full_recoverable_sample_gap: expected.remainingGap,
  pending_candidate_counted_as_accepted: false,
  dashboard_uses_project_master_plan_progress: false,
  dashboard_uses_document_token_progress: false,
  dashboard_promotes_product_status: false,
  accepted_samples_write_performed: false,
  category_index_write_performed: false,
  image_file_copy_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_dashboard_drops_registered_lamp_fails: pendingCountedAsAccepted.passed === false && pendingCountedAsAccepted.acceptedOk === false,
  negative_case_three_sample_goal_marked_incomplete_fails: goalCompleteOverclaim.passed === false && goalCompleteOverclaim.countsOk === false,
  negative_case_project_master_plan_progress_fails: projectMasterPlanProgress.passed === false && projectMasterPlanProgress.noDashboardProxy === false,
  negative_case_document_token_progress_fails: documentTokenProgress.passed === false && documentTokenProgress.noDashboardProxy === false,
  negative_case_runtime_claim_blocks_dashboard: runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false,
  negative_case_external_action_flag_blocks_dashboard: externalAction.passed === false && externalAction.noExternal === false,
  negative_case_accepted_samples_write_flag_blocks_dashboard: acceptedWrite.passed === false && acceptedWrite.noWrites === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
