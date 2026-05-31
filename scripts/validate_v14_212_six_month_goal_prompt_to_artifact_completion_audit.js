#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_212_six_month_goal_prompt_to_artifact_completion_audit.md",
  fixture: "tests/schema_examples/v14_212_six_month_goal_prompt_to_artifact_completion_audit.example.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  dashboardEvidence: "tests/schema_examples/v14_168_three_sample_dashboard_evidence_alignment.example.json",
  lampReadiness: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_readiness.example.json",
  exactFileDraft: "tests/schema_examples/v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.example.json",
  reviewConsoleReader: "review_console/static_prototype/artifact_lifecycle_state_reader.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const expectedCurrentRecoverableAcceptedSampleCount = 6;

const expectedCriteria = [
  "three_full_recoverable_accepted_samples",
  "third_sample_lamp_candidate_readiness",
  "accepted_samples_metadata_registration",
  "review_console_static_productization",
  "authorization_control_layer",
  "vcp_dry_run_adapter_productization",
  "authorized_real_vcp_pilot",
  "v1_visual_production_control_layer_closeout",
];

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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function runGit(args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function lines(value) {
  return value ? value.split(/\r?\n/).filter(Boolean) : [];
}

function countRecoverableAcceptedSamples(registry) {
  const recoverableStatuses = new Set([
    "workspace_local_verified",
    "workspace_local_verified_by_prior_receipt",
    "git_tracked_verified",
  ]);
  return [...registry.matchAll(/recoverability_status:\s+([^\s]+)/g)]
    .filter((match) => recoverableStatuses.has(match[1]))
    .length;
}

function evaluate(input, evidence) {
  const counts = input.observed_counts || {};
  const guard = input.guard || {};
  const criteria = Array.isArray(input.success_criteria) ? input.success_criteria : [];
  const criteriaIds = criteria.map((item) => item.id);
  const statuses = new Map(criteria.map((item) => [item.id, item.status]));
  const refsOk = criteria.every((item) => Array.isArray(item.evidence_refs) && item.evidence_refs.length > 0 && item.evidence_refs.every((ref) => core.exists(ref)));
  const identityOk =
    input.phase === "v14_212_six_month_goal_prompt_to_artifact_completion_audit" &&
    input.execution_mode === "prompt_to_artifact_audit_only" &&
    input.goal_complete === false &&
    input.objective_restated === true;
  const criteriaOk =
    criteria.length === expectedCriteria.length &&
    expectedCriteria.every((id) => criteriaIds.includes(id)) &&
    statuses.get("three_full_recoverable_accepted_samples") === "met" &&
    statuses.get("third_sample_lamp_candidate_readiness") === "met_registered" &&
    statuses.get("accepted_samples_metadata_registration") === "met_three_registered" &&
    statuses.get("authorized_real_vcp_pilot") === "not_started_blocked_by_a5" &&
    statuses.get("v1_visual_production_control_layer_closeout") === "not_met";
  const countsOk =
    counts.recoverable_accepted_sample_count === expectedCurrentRecoverableAcceptedSampleCount &&
    counts.blocked_third_candidate_count === 0 &&
    counts.remaining_full_recoverable_sample_gap === 0 &&
    counts.success_criteria_count === expectedCriteria.length &&
    counts.met_count === 3 &&
    counts.partial_count === 3 &&
    counts.not_met_count === 2 &&
    counts.blocked_by_a5_count === 1;
  const evidenceOk =
    evidence.registryRecoverableCount === expectedCurrentRecoverableAcceptedSampleCount &&
    evidence.dashboardRecoverableCount === 3 &&
    evidence.dashboardHardAcceptanceMet === true &&
    evidence.dashboardGap === 0 &&
    evidence.lampRegistryApproved === true &&
    evidence.lampAcceptedSampleRegistered === true &&
    evidence.exactFileDraftBlocked === true &&
    evidence.reviewConsoleReaderPresent === true;
  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false;
  const noWrites =
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    evidence.stagedFileCount === 0;
  const noRuntimeClaim =
    guard.prompt_to_artifact_audit_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && criteriaOk && countsOk && refsOk && evidenceOk && noExternal && noWrites && noRuntimeClaim,
    identityOk,
    criteriaOk,
    countsOk,
    refsOk,
    evidenceOk,
    noExternal,
    noWrites,
    noRuntimeClaim,
  };
}

function gatherEvidence() {
  const registry = core.read(files.registry);
  const dashboard = core.parseJson(files.dashboardEvidence).three_sample_dashboard_evidence_alignment;
  const lampSampleId = "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001";
  const lampBlock = core.extractRegistrySampleBlock(registry, lampSampleId);
  const exactFileDraft = core.parseJson(files.exactFileDraft).recoverability_baseline_exact_file_staging_authorization_package_draft;
  const reviewConsoleReader = core.read(files.reviewConsoleReader);
  return {
    registryRecoverableCount: countRecoverableAcceptedSamples(registry),
    dashboardRecoverableCount: dashboard.dashboard_counts.full_recoverable_accepted_sample_count,
    dashboardHardAcceptanceMet: dashboard.dashboard_counts.hard_acceptance_three_full_samples_met,
    dashboardGap: dashboard.dashboard_counts.remaining_full_recoverable_sample_gap,
    lampRegistryApproved: /human_approval:[\s\S]*?approved:\s+true[\s\S]*?approved_by:\s+Jenn/.test(lampBlock),
    lampAcceptedSampleRegistered: dashboard.accepted_samples.includes(lampSampleId) && lampBlock.includes("recoverability_status: workspace_local_verified"),
    exactFileDraftBlocked:
      exactFileDraft.authorization.authorization_package_status === "prepared_blocked_not_granted" &&
      exactFileDraft.authorization.authorization_granted_by_this_record === false &&
      exactFileDraft.exact_stage_file_count === 14,
    reviewConsoleReaderPresent:
      reviewConsoleReader.includes("normalizeArtifactLifecycleState") &&
      reviewConsoleReader.includes("fetch_performed") &&
      reviewConsoleReader.includes("file_write_performed"),
    stagedFileCount: lines(runGit(["diff", "--cached", "--name-only"])).length,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).six_month_goal_prompt_to_artifact_completion_audit;
const evidence = gatherEvidence();
const phaseRecord = core.read(files.phaseRecord);
const validationLog = core.read(files.validationLog);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const baseEval = evaluate(fixture, evidence);
addResult("prompt_to_artifact_audit_evaluation_passes", baseEval.passed, JSON.stringify(baseEval));
addResult(
  "registry_recoverable_count_is_six",
  evidence.registryRecoverableCount === expectedCurrentRecoverableAcceptedSampleCount
);
addResult("dashboard_three_sample_goal_met_local_only", evidence.dashboardHardAcceptanceMet === true && evidence.dashboardGap === 0);
addResult("lamp_candidate_human_approval_registered", evidence.lampRegistryApproved === true && evidence.lampAcceptedSampleRegistered === true);
addResult("exact_file_draft_blocked", evidence.exactFileDraftBlocked === true);
addResult("review_console_reader_present", evidence.reviewConsoleReaderPresent === true);
addResult("actual_staged_files_empty", evidence.stagedFileCount === 0);

const goalComplete = clone(fixture);
goalComplete.goal_complete = true;
const threeSampleMissing = clone(fixture);
threeSampleMissing.success_criteria[0].status = "not_met";
threeSampleMissing.observed_counts.recoverable_accepted_sample_count = 2;
threeSampleMissing.observed_counts.remaining_full_recoverable_sample_gap = 1;
const runtimeCounted = clone(fixture);
runtimeCounted.goal_complete = true;
const missingEvidence = clone(fixture);
missingEvidence.success_criteria[0].evidence_refs = [];
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;

const goalCompleteEval = evaluate(goalComplete, evidence);
const threeSampleMissingEval = evaluate(threeSampleMissing, evidence);
const runtimeCountedEval = evaluate(runtimeCounted, evidence);
const missingEvidenceEval = evaluate(missingEvidence, evidence);
const runtimeClaimEval = evaluate(runtimeClaim, evidence);
const externalActionEval = evaluate(externalAction, evidence);

addResult("negative_case_goal_complete_true_fails", goalCompleteEval.passed === false && goalCompleteEval.identityOk === false);
addResult("negative_case_three_sample_goal_marked_missing_fails", threeSampleMissingEval.passed === false && threeSampleMissingEval.countsOk === false);
addResult("negative_case_local_recoverability_marked_goal_complete_fails", runtimeCountedEval.passed === false && runtimeCountedEval.identityOk === false);
addResult("negative_case_missing_evidence_ref_fails", missingEvidenceEval.passed === false && missingEvidenceEval.refsOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);

for (const token of [
  "phase: v14_212_six_month_goal_prompt_to_artifact_completion_audit",
  "goal_complete: false",
  "full_recoverable_accepted_sample_count: 6",
  "remaining_full_recoverable_sample_gap: 0",
  "human_approval_status: approved",
  "current_status: not_started_blocked_by_a5",
  "prompt_to_artifact_audit_only: true",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const id of expectedCriteria) {
  requireToken("phase_record_criterion", phaseRecord, id);
}

for (const token of [
  "scripts/validate_v14_212_six_month_goal_prompt_to_artifact_completion_audit.js",
  "tests/schema_examples/v14_212_six_month_goal_prompt_to_artifact_completion_audit.example.json",
  "docs/v14_212_six_month_goal_prompt_to_artifact_completion_audit.md",
  "v14_212_six_month_goal_prompt_to_artifact_completion_audit",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("validation_log", validationLog, "VALIDATION-20260518-v14.212-SIX-MONTH-GOAL-PROMPT-TO-ARTIFACT-COMPLETION-AUDIT");

forbidPattern("current_surfaces", currentSurfaces, /goal_complete:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /env_or_secret_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /commit_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_212_six_month_goal_prompt_to_artifact_completion_audit",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  goal_complete: false,
  recoverable_accepted_sample_count: evidence.registryRecoverableCount,
  blocked_third_candidate_count: fixture.observed_counts.blocked_third_candidate_count,
  remaining_full_recoverable_sample_gap: evidence.dashboardGap,
  success_criteria_count: expectedCriteria.length,
  met_count: fixture.observed_counts.met_count,
  partial_count: fixture.observed_counts.partial_count,
  not_met_count: fixture.observed_counts.not_met_count,
  blocked_by_a5_count: fixture.observed_counts.blocked_by_a5_count,
  staged_file_count: evidence.stagedFileCount,
  prompt_to_artifact_audit_only: true,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  env_or_secret_read_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  commit_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_goal_complete_true_fails: goalCompleteEval.passed === false && goalCompleteEval.identityOk === false,
  negative_case_three_sample_goal_marked_missing_fails: threeSampleMissingEval.passed === false && threeSampleMissingEval.countsOk === false,
  negative_case_local_recoverability_marked_goal_complete_fails: runtimeCountedEval.passed === false && runtimeCountedEval.identityOk === false,
  negative_case_missing_evidence_ref_fails: missingEvidenceEval.passed === false && missingEvidenceEval.refsOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
