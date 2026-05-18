#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_217_review_console_post_approval_gate_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_217_review_console_post_approval_gate_snapshot_static_regression.example.json",
  sourceFixture: "tests/schema_examples/v14_216_review_console_post_approval_gate_static_panel.example.json",
  sourceGate: "tests/schema_examples/v14_215_third_sample_accepted_samples_post_approval_gate_alignment.example.json",
  app: "review_console/static_prototype/app.js",
  mockData: "review_console/static_prototype/mock_data.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_217_review_console_post_approval_gate_snapshot_static_regression",
  snapshotStatus: "golden_static_snapshot",
  draftKey: "third_sample_post_approval_gate_state",
  sampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  candidateId: "v14_166_lamp_v3_generated_candidate_001",
  category: "product_still_life",
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

function currentBoardBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function evaluate(input, sourceFixture) {
  const source = sourceFixture.review_console_post_approval_gate_static_panel;
  const snapshot = input.snapshot || {};
  const guard = input.guard || {};

  const snapshotOk =
    input.phase === expected.phase &&
    input.snapshot_status === expected.snapshotStatus &&
    input.draft_output_key === expected.draftKey &&
    input.source_fixture_ref === files.sourceFixture &&
    input.source_gate_ref === files.sourceGate &&
    snapshot.target_sample_id === expected.sampleId &&
    snapshot.target_sample_id === source.target.sample_id &&
    snapshot.target_candidate_id === expected.candidateId &&
    snapshot.target_candidate_id === source.target.candidate_id &&
    snapshot.target_category === expected.category &&
    snapshot.target_category === source.target.category &&
    snapshot.gate_status === "blocked" &&
    snapshot.gate_status === source.gate_status &&
    snapshot.blocker === expected.blocker &&
    snapshot.blocker === source.blocker &&
    snapshot.approval_statement_source_is_user_submission === false &&
    snapshot.approval_statement_source_is_user_submission === source.approval_statement_source_is_user_submission &&
    snapshot.human_approval_captured_now === false &&
    snapshot.human_approval_captured_now === source.human_approval_captured_now &&
    snapshot.accepted_samples_registration_ready_now === false &&
    snapshot.accepted_samples_registration_ready_now === source.accepted_samples_registration_ready_now &&
    snapshot.future_registration_requires_v14_214_user_submission === true &&
    snapshot.future_registration_requires_v14_214_user_submission === source.future_registration_requires_v14_214_user_submission &&
    snapshot.required_before_write_count === source.required_before_write.length &&
    snapshot.static_panel_only === true &&
    snapshot.static_panel_only === source.static_panel_guard.static_panel_only &&
    snapshot.next_allowed_local_action === "wait_for_jenn_human_approval_and_post_approval_registration_preflight";

  const noWrites =
    guard.static_snapshot_only === true &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
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

  const noRuntimeClaim =
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

const fixture = core.parseJson(files.snapshot).review_console_post_approval_gate_snapshot_static_regression;
const sourceFixture = core.parseJson(files.sourceFixture);
const phaseRecord = core.read(files.phaseRecord);
const app = core.read(files.app);
const mockData = core.read(files.mockData);
const readme = core.read(files.readme);
const currentSurfaces = [
  Object.values(files).join("\n"),
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  app,
  mockData,
  readme,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(fixture, sourceFixture);
addResult("post_approval_gate_snapshot_evaluation_passes", baseEval.passed);

const missingSource = clone(fixture);
missingSource.source_fixture_ref = null;
const userSubmissionOverclaim = clone(fixture);
userSubmissionOverclaim.snapshot.approval_statement_source_is_user_submission = true;
const humanApprovalOverclaim = clone(fixture);
humanApprovalOverclaim.snapshot.human_approval_captured_now = true;
const registrationReadyOverclaim = clone(fixture);
registrationReadyOverclaim.snapshot.accepted_samples_registration_ready_now = true;
const requiredCountDrift = clone(fixture);
requiredCountDrift.snapshot.required_before_write_count = 5;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingSourceEval = evaluate(missingSource, sourceFixture);
const userSubmissionOverclaimEval = evaluate(userSubmissionOverclaim, sourceFixture);
const humanApprovalOverclaimEval = evaluate(humanApprovalOverclaim, sourceFixture);
const registrationReadyOverclaimEval = evaluate(registrationReadyOverclaim, sourceFixture);
const requiredCountDriftEval = evaluate(requiredCountDrift, sourceFixture);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture);
const externalActionEval = evaluate(externalAction, sourceFixture);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture);

addResult("negative_case_missing_v14_216_source_fails", missingSourceEval.passed === false && missingSourceEval.snapshotOk === false);
addResult("negative_case_user_submission_overclaim_fails", userSubmissionOverclaimEval.passed === false && userSubmissionOverclaimEval.snapshotOk === false);
addResult("negative_case_human_approval_overclaim_fails", humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.snapshotOk === false);
addResult("negative_case_registration_ready_overclaim_fails", registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.snapshotOk === false);
addResult("negative_case_required_count_drift_fails", requiredCountDriftEval.passed === false && requiredCountDriftEval.snapshotOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "thirdSamplePostApprovalGateState",
  "third_sample_post_approval_gate_state",
  "renderThirdSamplePostApprovalGate",
]) {
  requireToken("app_or_mock", `${app}\n${mockData}`, token);
}

for (const token of [
  "v14.217",
  "third_sample_post_approval_gate_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "scripts/validate_v14_217_review_console_post_approval_gate_snapshot_static_regression.js",
  "tests/schema_examples/v14_217_review_console_post_approval_gate_snapshot_static_regression.example.json",
  "docs/v14_217_review_console_post_approval_gate_snapshot_static_regression.md",
  "v14_217_review_console_post_approval_gate_snapshot_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_217_review_console_post_approval_gate_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: fixture.snapshot_status,
  draft_output_key: fixture.draft_output_key,
  target_sample_id: fixture.snapshot.target_sample_id,
  target_candidate_id: fixture.snapshot.target_candidate_id,
  gate_status: fixture.snapshot.gate_status,
  blocker: fixture.snapshot.blocker,
  approval_statement_source_is_user_submission: fixture.snapshot.approval_statement_source_is_user_submission,
  human_approval_captured_now: fixture.snapshot.human_approval_captured_now,
  accepted_samples_registration_ready_now: fixture.snapshot.accepted_samples_registration_ready_now,
  future_registration_requires_v14_214_user_submission: fixture.snapshot.future_registration_requires_v14_214_user_submission,
  required_before_write_count: fixture.snapshot.required_before_write_count,
  static_panel_only: fixture.snapshot.static_panel_only,
  static_snapshot_only: fixture.guard.static_snapshot_only,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  category_index_write_performed: fixture.guard.category_index_write_performed,
  failure_samples_write_performed: fixture.guard.failure_samples_write_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
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
  artifact_recoverability_is_not_vcp_runtime_integration: fixture.guard.artifact_recoverability_is_not_vcp_runtime_integration,
  vcp_runtime_integration_proven: fixture.guard.vcp_runtime_integration_proven,
  negative_case_missing_v14_216_source_fails: missingSourceEval.passed === false && missingSourceEval.snapshotOk === false,
  negative_case_user_submission_overclaim_fails: userSubmissionOverclaimEval.passed === false && userSubmissionOverclaimEval.snapshotOk === false,
  negative_case_human_approval_overclaim_fails: humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.snapshotOk === false,
  negative_case_registration_ready_overclaim_fails: registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.snapshotOk === false,
  negative_case_required_count_drift_fails: requiredCountDriftEval.passed === false && requiredCountDriftEval.snapshotOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
