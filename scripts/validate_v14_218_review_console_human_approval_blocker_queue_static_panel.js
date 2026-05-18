#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_218_review_console_human_approval_blocker_queue_static_panel.md",
  fixture: "tests/schema_examples/v14_218_review_console_human_approval_blocker_queue_static_panel.example.json",
  sourceSnapshot: "tests/schema_examples/v14_217_review_console_post_approval_gate_snapshot_static_regression.example.json",
  sourcePanel: "tests/schema_examples/v14_216_review_console_post_approval_gate_static_panel.example.json",
  sourceGate: "tests/schema_examples/v14_215_third_sample_accepted_samples_post_approval_gate_alignment.example.json",
  intakeValidator: "scripts/validate_v14_214_lamp_third_sample_human_approval_intake_validator.js",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  mockData: "review_console/static_prototype/mock_data.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_218_review_console_human_approval_blocker_queue_static_panel",
  draftOutputKey: "human_approval_blocker_queue_state",
  queueStatus: "active_blocker_queue",
  blockerId: "lamp_v3_third_sample_human_approval_missing",
  blockerType: "human_approval_missing",
  sampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  candidateId: "v14_166_lamp_v3_generated_candidate_001",
  category: "product_still_life",
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

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function currentBoardBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function evaluate(queue, sourceSnapshot, sourcePanel, sourceGate) {
  const snapshot = sourceSnapshot.review_console_post_approval_gate_snapshot_static_regression.snapshot;
  const panel = sourcePanel.review_console_post_approval_gate_static_panel;
  const gate = sourceGate.third_sample_accepted_samples_post_approval_gate_alignment;
  const blockers = queue.blockers || [];
  const blocker = blockers[0] || {};
  const guard = queue.guard || {};

  const sourceOk =
    queue.phase === expected.phase &&
    queue.execution_mode === "review_console_static_blocker_queue_only" &&
    queue.draft_output_key === expected.draftOutputKey &&
    queue.source_snapshot_ref === files.sourceSnapshot &&
    queue.source_panel_ref === files.sourcePanel &&
    queue.source_gate_ref === files.sourceGate &&
    queue.source_intake_validator_ref === files.intakeValidator;

  const queueOk =
    queue.queue_status === expected.queueStatus &&
    queue.total_blockers === 1 &&
    blockers.length === queue.total_blockers;

  const blockerOk =
    blocker.blocker_id === expected.blockerId &&
    blocker.blocker_type === expected.blockerType &&
    blocker.blocker_type === snapshot.blocker &&
    blocker.blocker_type === panel.blocker &&
    blocker.blocker_type === gate.gate.blocker &&
    blocker.severity === "hard_blocker" &&
    blocker.target_sample_id === expected.sampleId &&
    blocker.target_sample_id === snapshot.target_sample_id &&
    blocker.target_sample_id === panel.target.sample_id &&
    blocker.target_sample_id === gate.target.proposed_sample_id &&
    blocker.target_candidate_id === expected.candidateId &&
    blocker.target_candidate_id === snapshot.target_candidate_id &&
    blocker.target_candidate_id === panel.target.candidate_id &&
    blocker.target_candidate_id === gate.target.candidate_id &&
    blocker.target_category === expected.category &&
    blocker.target_category === snapshot.target_category &&
    blocker.target_category === panel.target.category &&
    blocker.target_category === gate.target.category &&
    blocker.required_evidence_count === 4 &&
    Array.isArray(blocker.required_evidence) &&
    blocker.required_evidence.length === blocker.required_evidence_count &&
    blocker.approval_statement_source_is_user_submission === false &&
    blocker.approval_statement_source_is_user_submission === snapshot.approval_statement_source_is_user_submission &&
    blocker.approval_statement_source_is_user_submission === panel.approval_statement_source_is_user_submission &&
    blocker.approval_statement_source_is_user_submission === gate.gate.approval_statement_source_is_user_submission &&
    blocker.human_approval_captured_now === false &&
    blocker.human_approval_captured_now === snapshot.human_approval_captured_now &&
    blocker.human_approval_captured_now === panel.human_approval_captured_now &&
    blocker.human_approval_captured_now === gate.gate.human_approval_captured_now &&
    blocker.accepted_samples_registration_ready_now === false &&
    blocker.accepted_samples_registration_ready_now === snapshot.accepted_samples_registration_ready_now &&
    blocker.accepted_samples_registration_ready_now === panel.accepted_samples_registration_ready_now &&
    blocker.accepted_samples_registration_ready_now === gate.gate.accepted_samples_registration_ready_now &&
    blocker.next_allowed_local_action === "wait_for_jenn_user_submission_then_run_v14_214_intake" &&
    blocker.next_write_action_allowed_now === false;

  const noWrites =
    guard.static_panel_only === true &&
    guard.read_only_queue === true &&
    guard.approval_capture_performed === false &&
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
    passed: sourceOk && queueOk && blockerOk && noWrites && noExternal && noRuntimeClaim,
    sourceOk,
    queueOk,
    blockerOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_human_approval_blocker_queue_static_panel;
const sourceSnapshot = core.parseJson(files.sourceSnapshot);
const sourcePanel = core.parseJson(files.sourcePanel);
const sourceGate = core.parseJson(files.sourceGate);
const phaseRecord = core.read(files.phaseRecord);
const app = core.read(files.app);
const index = core.read(files.index);
const styles = core.read(files.styles);
const mockData = core.read(files.mockData);
const readme = core.read(files.readme);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  app,
  index,
  styles,
  mockData,
  readme,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(fixture, sourceSnapshot, sourcePanel, sourceGate);
addResult("human_approval_blocker_queue_static_panel_evaluation_passes", baseEval.passed);

const missingSource = clone(fixture);
missingSource.source_snapshot_ref = null;
const countMismatch = clone(fixture);
countMismatch.total_blockers = 2;
const approvalCaptureOverclaim = clone(fixture);
approvalCaptureOverclaim.guard.approval_capture_performed = true;
const humanApprovalOverclaim = clone(fixture);
humanApprovalOverclaim.blockers[0].human_approval_captured_now = true;
const registrationReadyOverclaim = clone(fixture);
registrationReadyOverclaim.blockers[0].accepted_samples_registration_ready_now = true;
const writeAllowed = clone(fixture);
writeAllowed.blockers[0].next_write_action_allowed_now = true;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingSourceEval = evaluate(missingSource, sourceSnapshot, sourcePanel, sourceGate);
const countMismatchEval = evaluate(countMismatch, sourceSnapshot, sourcePanel, sourceGate);
const approvalCaptureOverclaimEval = evaluate(approvalCaptureOverclaim, sourceSnapshot, sourcePanel, sourceGate);
const humanApprovalOverclaimEval = evaluate(humanApprovalOverclaim, sourceSnapshot, sourcePanel, sourceGate);
const registrationReadyOverclaimEval = evaluate(registrationReadyOverclaim, sourceSnapshot, sourcePanel, sourceGate);
const writeAllowedEval = evaluate(writeAllowed, sourceSnapshot, sourcePanel, sourceGate);
const acceptedWriteEval = evaluate(acceptedWrite, sourceSnapshot, sourcePanel, sourceGate);
const externalActionEval = evaluate(externalAction, sourceSnapshot, sourcePanel, sourceGate);
const runtimeClaimEval = evaluate(runtimeClaim, sourceSnapshot, sourcePanel, sourceGate);

addResult("negative_case_missing_v14_217_source_fails", missingSourceEval.passed === false && missingSourceEval.sourceOk === false);
addResult("negative_case_blocker_count_mismatch_fails", countMismatchEval.passed === false && countMismatchEval.queueOk === false);
addResult("negative_case_approval_capture_overclaim_fails", approvalCaptureOverclaimEval.passed === false && approvalCaptureOverclaimEval.noWrites === false);
addResult("negative_case_human_approval_overclaim_fails", humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.blockerOk === false);
addResult("negative_case_registration_ready_overclaim_fails", registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.blockerOk === false);
addResult("negative_case_next_write_action_allowed_fails", writeAllowedEval.passed === false && writeAllowedEval.blockerOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "human_approval_blocker_queue_seed",
  "humanApprovalBlockerQueueState",
  "renderHumanApprovalBlockerQueue",
  "human_approval_blocker_queue_state: humanApprovalBlockerQueueState()",
]) {
  requireToken("app_or_mock", `${app}\n${mockData}`, token);
}

for (const token of [
  "human-approval-blocker-queue",
  "humanApprovalBlockerQueueSummary",
  "humanApprovalBlockerQueueBody",
  "humanApprovalBlockerQueueGuard",
]) {
  requireToken("index", index, token);
}

for (const token of [
  "human-approval-blocker-queue-body",
  "human-approval-blocker-queue-card",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "v14.218",
  "human_approval_blocker_queue_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "phase: v14_218_review_console_human_approval_blocker_queue_static_panel",
  "draft_output_key: human_approval_blocker_queue_state",
  "approval_statement_source_is_user_submission: false",
  "next_write_action_allowed_now: false",
  "accepted_samples_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_218_review_console_human_approval_blocker_queue_static_panel.js",
  "tests/schema_examples/v14_218_review_console_human_approval_blocker_queue_static_panel.example.json",
  "docs/v14_218_review_console_human_approval_blocker_queue_static_panel.md",
  "v14_218_review_console_human_approval_blocker_queue_static_panel",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_218_review_console_human_approval_blocker_queue_static_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  draft_output_key: fixture.draft_output_key,
  queue_status: fixture.queue_status,
  total_blockers: fixture.total_blockers,
  blocker_id: fixture.blockers[0].blocker_id,
  blocker_type: fixture.blockers[0].blocker_type,
  target_sample_id: fixture.blockers[0].target_sample_id,
  target_candidate_id: fixture.blockers[0].target_candidate_id,
  approval_statement_source_is_user_submission: fixture.blockers[0].approval_statement_source_is_user_submission,
  human_approval_captured_now: fixture.blockers[0].human_approval_captured_now,
  accepted_samples_registration_ready_now: fixture.blockers[0].accepted_samples_registration_ready_now,
  next_write_action_allowed_now: fixture.blockers[0].next_write_action_allowed_now,
  static_panel_only: fixture.guard.static_panel_only,
  read_only_queue: fixture.guard.read_only_queue,
  approval_capture_performed: fixture.guard.approval_capture_performed,
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
  negative_case_missing_v14_217_source_fails: missingSourceEval.passed === false && missingSourceEval.sourceOk === false,
  negative_case_blocker_count_mismatch_fails: countMismatchEval.passed === false && countMismatchEval.queueOk === false,
  negative_case_approval_capture_overclaim_fails: approvalCaptureOverclaimEval.passed === false && approvalCaptureOverclaimEval.noWrites === false,
  negative_case_human_approval_overclaim_fails: humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.blockerOk === false,
  negative_case_registration_ready_overclaim_fails: registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.blockerOk === false,
  negative_case_next_write_action_allowed_fails: writeAllowedEval.passed === false && writeAllowedEval.blockerOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
