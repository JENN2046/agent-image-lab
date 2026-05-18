#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression.example.json",
  sourceFixture: "tests/schema_examples/v14_188_review_console_third_sample_acceptance_readiness.example.json",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression",
  snapshotStatus: "golden_static_snapshot",
  draftKey: "third_sample_acceptance_readiness_state",
  targetSampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  targetCandidateId: "v14_166_lamp_v3_generated_candidate_001",
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evaluate(input, sourceFixture) {
  const source = sourceFixture.review_console_third_sample_acceptance_readiness;
  const snapshot = input.snapshot || {};
  const guard = input.guard || {};
  const snapshotOk =
    input.phase === expected.phase &&
    input.snapshot_status === expected.snapshotStatus &&
    input.draft_output_key === expected.draftKey &&
    snapshot.target_sample_id === expected.targetSampleId &&
    snapshot.target_sample_id === source.target_sample_id &&
    snapshot.target_candidate_id === expected.targetCandidateId &&
    snapshot.target_candidate_id === source.target_candidate_id &&
    snapshot.target_visual_task === source.target_visual_task &&
    snapshot.readiness_status === "blocked_missing_human_approval" &&
    snapshot.required_approval_by === "Jenn" &&
    snapshot.human_approval_status === "pending" &&
    snapshot.approved_by === null &&
    snapshot.registration_ready === false &&
    snapshot.accepted_samples_registration_eligible === false &&
    snapshot.accepted_samples_metadata_registered === false &&
    snapshot.accepted_samples_write_allowed === false &&
    snapshot.production_candidate_write_allowed === false &&
    snapshot.failure_samples_write_allowed === false &&
    snapshot.present_evidence_count === source.present_evidence_count &&
    snapshot.missing_requirement_count === source.missing_requirement_count &&
    snapshot.next_allowed_local_action === "wait_for_jenn_human_approval";
  const noWrites =
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false;
  const noExternal =
    guard.fetch_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;
  const noRuntimeClaim =
    guard.static_snapshot_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: snapshotOk && noWrites && noExternal && noRuntimeClaim,
    snapshotOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.snapshot).review_console_third_sample_acceptance_readiness_snapshot_static_regression;
const sourceFixture = core.parseJson(files.sourceFixture);
const phaseRecord = core.read(files.phaseRecord);
const appText = core.read(files.app);
const readmeText = core.read(files.readme);
const mvpText = core.read(files.mvpValidator);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  readmeText,
  mvpText,
].join("\n");

const baseEval = evaluate(fixture, sourceFixture);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("third_sample_acceptance_readiness_snapshot_evaluation_passes", baseEval.passed);

const approvalOverclaim = clone(fixture);
approvalOverclaim.snapshot.human_approval_status = "approved";
approvalOverclaim.snapshot.approved_by = "Jenn";
const registrationReadyOverclaim = clone(fixture);
registrationReadyOverclaim.snapshot.registration_ready = true;
registrationReadyOverclaim.snapshot.accepted_samples_registration_eligible = true;
const targetMismatch = clone(fixture);
targetMismatch.snapshot.target_candidate_id = "v14_105_womens_resort_relaxed_knit_final_v2";
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const approvalOverclaimEval = evaluate(approvalOverclaim, sourceFixture);
const registrationReadyOverclaimEval = evaluate(registrationReadyOverclaim, sourceFixture);
const targetMismatchEval = evaluate(targetMismatch, sourceFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_approval_overclaim_fails", approvalOverclaimEval.passed === false && approvalOverclaimEval.snapshotOk === false);
addResult("negative_case_registration_ready_overclaim_fails", registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.snapshotOk === false);
addResult("negative_case_target_candidate_mismatch_fails", targetMismatchEval.passed === false && targetMismatchEval.snapshotOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "thirdSampleAcceptanceReadinessState",
  "third_sample_acceptance_readiness_state",
  "renderThirdSampleAcceptanceReadiness",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "scripts/validate_v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression.js",
  "tests/schema_examples/v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression.example.json",
  "docs/v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression.md",
  "v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_189_review_console_third_sample_acceptance_readiness_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: fixture.snapshot_status,
  draft_output_key: fixture.draft_output_key,
  target_sample_id: fixture.snapshot.target_sample_id,
  target_candidate_id: fixture.snapshot.target_candidate_id,
  readiness_status: fixture.snapshot.readiness_status,
  required_approval_by: fixture.snapshot.required_approval_by,
  human_approval_status: fixture.snapshot.human_approval_status,
  approved_by: fixture.snapshot.approved_by,
  registration_ready: fixture.snapshot.registration_ready,
  accepted_samples_registration_eligible: fixture.snapshot.accepted_samples_registration_eligible,
  accepted_samples_metadata_registered: fixture.snapshot.accepted_samples_metadata_registered,
  accepted_samples_write_allowed: fixture.snapshot.accepted_samples_write_allowed,
  production_candidate_write_allowed: fixture.snapshot.production_candidate_write_allowed,
  failure_samples_write_allowed: fixture.snapshot.failure_samples_write_allowed,
  present_evidence_count: fixture.snapshot.present_evidence_count,
  missing_requirement_count: fixture.snapshot.missing_requirement_count,
  next_allowed_local_action: fixture.snapshot.next_allowed_local_action,
  static_snapshot_only: fixture.guard.static_snapshot_only,
  fetch_performed: false,
  file_write_performed: false,
  accepted_samples_write_performed: false,
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
  negative_case_approval_overclaim_fails: approvalOverclaimEval.passed === false && approvalOverclaimEval.snapshotOk === false,
  negative_case_registration_ready_overclaim_fails: registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.snapshotOk === false,
  negative_case_target_candidate_mismatch_fails: targetMismatchEval.passed === false && targetMismatchEval.snapshotOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
