#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_188_review_console_third_sample_acceptance_readiness.md",
  fixture: "tests/schema_examples/v14_188_review_console_third_sample_acceptance_readiness.example.json",
  sourceLifecycleFixture: "tests/schema_examples/v14_169_review_console_artifact_lifecycle_state_reader.example.json",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_188_review_console_third_sample_acceptance_readiness_static_panel",
  draftKey: "third_sample_acceptance_readiness_state",
  targetSampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  targetCandidateId: "v14_166_lamp_v3_generated_candidate_001",
  blocker: "human_approval_missing",
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
  const source = sourceFixture.review_console_artifact_lifecycle_state_reader;
  const target = source.records.find((record) => record.registration_blocker === expected.blocker);
  const guard = input.guard || {};
  const readinessOk =
    input.phase === expected.phase &&
    input.draft_output_key === expected.draftKey &&
    input.target_sample_id === expected.targetSampleId &&
    input.target_sample_id === target?.sample_id &&
    input.target_candidate_id === expected.targetCandidateId &&
    input.target_candidate_id === target?.candidate_id &&
    input.target_visual_task === target?.visual_task &&
    input.readiness_status === "blocked_missing_human_approval" &&
    input.required_approval_by === "Jenn" &&
    input.human_approval_status === "pending" &&
    input.approved_by === null &&
    input.registration_ready === false &&
    input.accepted_samples_registration_eligible === false &&
    input.accepted_samples_metadata_registered === false &&
    input.accepted_samples_write_allowed === false &&
    input.production_candidate_write_allowed === false &&
    input.failure_samples_write_allowed === false &&
    Array.isArray(input.required_registry_files) &&
    input.required_registry_files.includes("accepted_samples/accepted_sample_registry.yaml") &&
    input.required_registry_files.includes(target?.category_index_ref) &&
    Array.isArray(input.evidence_refs) &&
    input.evidence_refs.includes(target?.artifact_ref) &&
    input.evidence_refs.includes(target?.sha256) &&
    input.evidence_refs.includes(target?.import_record_ref) &&
    input.evidence_refs.includes(target?.review_record_ref) &&
    input.evidence_refs.includes(target?.category_index_ref) &&
    input.present_evidence_count === input.evidence_refs.length &&
    input.missing_requirements.includes("human_approval_status: approved") &&
    input.missing_requirements.includes("approved_by: Jenn") &&
    input.missing_requirement_count === 2 &&
    input.next_allowed_local_action === "wait_for_jenn_human_approval";
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
    guard.local_readiness_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: readinessOk && noWrites && noExternal && noRuntimeClaim,
    readinessOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_third_sample_acceptance_readiness;
const sourceFixture = core.parseJson(files.sourceLifecycleFixture);
const phaseRecord = core.read(files.phaseRecord);
const appText = core.read(files.app);
const indexText = core.read(files.index);
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
addResult("third_sample_acceptance_readiness_evaluation_passes", baseEval.passed);

const approvalOverclaim = clone(fixture);
approvalOverclaim.human_approval_status = "approved";
approvalOverclaim.registration_ready = true;
const missingRequirementsEmpty = clone(fixture);
missingRequirementsEmpty.missing_requirements = [];
missingRequirementsEmpty.missing_requirement_count = 0;
const targetMismatch = clone(fixture);
targetMismatch.target_candidate_id = "v14_105_womens_resort_relaxed_knit_final_v2";
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const approvalOverclaimEval = evaluate(approvalOverclaim, sourceFixture);
const missingRequirementsEmptyEval = evaluate(missingRequirementsEmpty, sourceFixture);
const targetMismatchEval = evaluate(targetMismatch, sourceFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_approval_overclaim_fails", approvalOverclaimEval.passed === false && approvalOverclaimEval.readinessOk === false);
addResult("negative_case_missing_requirements_empty_fails", missingRequirementsEmptyEval.passed === false && missingRequirementsEmptyEval.readinessOk === false);
addResult("negative_case_target_candidate_mismatch_fails", targetMismatchEval.passed === false && targetMismatchEval.readinessOk === false);
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
  "third-sample-readiness",
  "thirdSampleReadinessBody",
]) {
  requireToken("index", indexText, token);
}

for (const token of [
  "scripts/validate_v14_188_review_console_third_sample_acceptance_readiness.js",
  "tests/schema_examples/v14_188_review_console_third_sample_acceptance_readiness.example.json",
  "docs/v14_188_review_console_third_sample_acceptance_readiness.md",
  "v14_188_review_console_third_sample_acceptance_readiness_static_panel",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_188_review_console_third_sample_acceptance_readiness",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  draft_output_key: fixture.draft_output_key,
  target_sample_id: fixture.target_sample_id,
  target_candidate_id: fixture.target_candidate_id,
  readiness_status: fixture.readiness_status,
  required_approval_by: fixture.required_approval_by,
  human_approval_status: fixture.human_approval_status,
  approved_by: fixture.approved_by,
  registration_ready: fixture.registration_ready,
  accepted_samples_registration_eligible: fixture.accepted_samples_registration_eligible,
  accepted_samples_metadata_registered: fixture.accepted_samples_metadata_registered,
  accepted_samples_write_allowed: fixture.accepted_samples_write_allowed,
  production_candidate_write_allowed: fixture.production_candidate_write_allowed,
  failure_samples_write_allowed: fixture.failure_samples_write_allowed,
  present_evidence_count: fixture.present_evidence_count,
  missing_requirement_count: fixture.missing_requirement_count,
  next_allowed_local_action: fixture.next_allowed_local_action,
  local_readiness_only: fixture.guard.local_readiness_only,
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
  negative_case_approval_overclaim_fails: approvalOverclaimEval.passed === false && approvalOverclaimEval.readinessOk === false,
  negative_case_missing_requirements_empty_fails: missingRequirementsEmptyEval.passed === false && missingRequirementsEmptyEval.readinessOk === false,
  negative_case_target_candidate_mismatch_fails: targetMismatchEval.passed === false && targetMismatchEval.readinessOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
