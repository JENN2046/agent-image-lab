#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_220_agent_board_current_recommendation_alignment.md",
  fixture: "tests/schema_examples/v14_220_agent_board_current_recommendation_alignment.example.json",
  sourcePhaseRecord: "docs/v14_219_review_console_human_approval_blocker_queue_snapshot_static_regression.md",
  sourceValidator: "scripts/validate_v14_219_review_console_human_approval_blocker_queue_snapshot_static_regression.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_220_agent_board_current_recommendation_alignment",
  sourcePhase: "v14_219_review_console_human_approval_blocker_queue_snapshot_static_regression",
  recommendedNext: "wait_for_jenn_human_approval_or_continue_review_console_static_productization",
  staleRecommendation: "complete_v14_218_validation",
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function currentBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function forbidToken(label, text, token) {
  addResult(`${label}_token_${token}_absent`, !text.includes(token));
}

function evaluate(input) {
  const guard = input.guard || {};
  const identityOk =
    input.phase === expected.phase &&
    input.execution_mode === "agent_board_status_alignment_only" &&
    input.source_completed_phase === expected.sourcePhase &&
    input.recommended_next === expected.recommendedNext &&
    input.stale_recommendation_forbidden === expected.staleRecommendation;

  const blockerOk =
    input.human_approval_captured_now === false &&
    input.accepted_samples_write_allowed_now === false &&
    input.artifact_recoverability_is_not_vcp_runtime_integration === true;

  const noWrites =
    guard.agent_board_alignment_only === true &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim = guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && blockerOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    blockerOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).agent_board_current_recommendation_alignment;
const phaseRecord = core.read(files.phaseRecord);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.mvpValidator),
  currentBlock(core.read(files.validationLog)),
  currentBlock(core.read(files.runState)),
  currentBlock(core.read(files.taskQueue)),
  currentBlock(core.read(files.checkpoint)),
  currentBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(fixture);
addResult("board_recommendation_alignment_evaluation_passes", baseEval.passed);

const staleRecommendation = clone(fixture);
staleRecommendation.recommended_next = "complete_v14_218_validation_then_wait";
const approvalOverclaim = clone(fixture);
approvalOverclaim.human_approval_captured_now = true;
const acceptedAllowed = clone(fixture);
acceptedAllowed.accepted_samples_write_allowed_now = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;

const staleRecommendationEval = evaluate(staleRecommendation);
const approvalOverclaimEval = evaluate(approvalOverclaim);
const acceptedAllowedEval = evaluate(acceptedAllowed);
const runtimeClaimEval = evaluate(runtimeClaim);
const externalActionEval = evaluate(externalAction);

addResult("negative_case_stale_v14_218_recommendation_fails", staleRecommendationEval.passed === false && staleRecommendationEval.identityOk === false);
addResult("negative_case_approval_capture_overclaim_fails", approvalOverclaimEval.passed === false && approvalOverclaimEval.blockerOk === false);
addResult("negative_case_accepted_samples_write_allowed_fails", acceptedAllowedEval.passed === false && acceptedAllowedEval.blockerOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);

for (const token of [
  "v14_220_agent_board_current_recommendation_alignment",
  "docs/v14_220_agent_board_current_recommendation_alignment.md",
  "tests/schema_examples/v14_220_agent_board_current_recommendation_alignment.example.json",
  "scripts/validate_v14_220_agent_board_current_recommendation_alignment.js",
  expected.recommendedNext,
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

for (const token of [
  "recommended_next: complete_v14_218_validation",
  "recommended_next: complete_v14_218",
  "complete_v14_218_validation_then_wait",
]) {
  forbidToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_220_agent_board_current_recommendation_alignment",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: fixture.phase,
  source_completed_phase: fixture.source_completed_phase,
  recommended_next: fixture.recommended_next,
  stale_recommendation_forbidden: fixture.stale_recommendation_forbidden,
  human_approval_captured_now: fixture.human_approval_captured_now,
  accepted_samples_write_allowed_now: fixture.accepted_samples_write_allowed_now,
  agent_board_alignment_only: fixture.guard.agent_board_alignment_only,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  mcp_runtime_performed: fixture.guard.mcp_runtime_performed,
  image_generation_performed: fixture.guard.image_generation_performed,
  env_or_secret_read_performed: fixture.guard.env_or_secret_read_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: fixture.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: fixture.guard.vcp_runtime_integration_proven,
  negative_case_stale_v14_218_recommendation_fails: staleRecommendationEval.passed === false && staleRecommendationEval.identityOk === false,
  negative_case_approval_capture_overclaim_fails: approvalOverclaimEval.passed === false && approvalOverclaimEval.blockerOk === false,
  negative_case_accepted_samples_write_allowed_fails: acceptedAllowedEval.passed === false && acceptedAllowedEval.blockerOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
