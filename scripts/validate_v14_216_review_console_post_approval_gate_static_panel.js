#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_216_review_console_post_approval_gate_static_panel.md",
  fixture: "tests/schema_examples/v14_216_review_console_post_approval_gate_static_panel.example.json",
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
  phase: "v14_216_review_console_post_approval_gate_static_panel",
  draftOutputKey: "third_sample_post_approval_gate_state",
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

function evaluate(panel, sourceGate) {
  const source = sourceGate.third_sample_accepted_samples_post_approval_gate_alignment;
  const target = panel.target || {};
  const guard = panel.static_panel_guard || {};
  const required = panel.required_before_write || [];

  const targetOk =
    panel.phase === expected.phase &&
    panel.execution_mode === "review_console_static_post_approval_gate_panel_only" &&
    panel.draft_output_key === expected.draftOutputKey &&
    panel.source_gate_ref === files.sourceGate &&
    panel.source_intake_validator_ref === files.intakeValidator &&
    target.sample_id === expected.sampleId &&
    target.sample_id === source.target.proposed_sample_id &&
    target.candidate_id === expected.candidateId &&
    target.candidate_id === source.target.candidate_id &&
    target.category === expected.category &&
    target.category === source.target.category;

  const gateOk =
    panel.gate_status === "blocked" &&
    panel.gate_status === source.gate.gate_status &&
    panel.blocker === "human_approval_missing" &&
    panel.blocker === source.gate.blocker &&
    panel.approval_statement_source_is_user_submission === false &&
    panel.approval_statement_source_is_user_submission === source.gate.approval_statement_source_is_user_submission &&
    panel.human_approval_captured_now === false &&
    panel.human_approval_captured_now === source.gate.human_approval_captured_now &&
    panel.accepted_samples_registration_ready_now === false &&
    panel.accepted_samples_registration_ready_now === source.gate.accepted_samples_registration_ready_now &&
    panel.future_registration_requires_v14_214_user_submission === true &&
    panel.future_registration_requires_v14_214_user_submission === source.gate.future_registration_requires_v14_214_user_submission;

  const requirementOk =
    required.includes("v14.214 intake validator reports approval_statement_source_is_user_submission=true") &&
    required.includes("v14.214 intake validator reports human_approval_captured_now=true") &&
    required.includes("allowed write set remains exactly accepted_samples/accepted_sample_registry.yaml and accepted_samples/categories/product_still_life.yaml") &&
    required.includes("no image copy, no runs source image modification, no production_candidate, no failure_samples, no DailyNote, no VCP memory");

  const noWrites =
    guard.static_panel_only === true &&
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
    passed: targetOk && gateOk && requirementOk && noWrites && noExternal && noRuntimeClaim,
    targetOk,
    gateOk,
    requirementOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_post_approval_gate_static_panel;
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
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const baseEval = evaluate(fixture, sourceGate);
addResult("post_approval_gate_static_panel_evaluation_passes", baseEval.passed);

const missingSource = clone(fixture);
missingSource.source_gate_ref = null;
const userSubmissionOverclaim = clone(fixture);
userSubmissionOverclaim.approval_statement_source_is_user_submission = true;
const humanApprovalOverclaim = clone(fixture);
humanApprovalOverclaim.human_approval_captured_now = true;
const registrationReadyOverclaim = clone(fixture);
registrationReadyOverclaim.accepted_samples_registration_ready_now = true;
const acceptedWrite = clone(fixture);
acceptedWrite.static_panel_guard.accepted_samples_write_performed = true;
const externalAction = clone(fixture);
externalAction.static_panel_guard.provider_contact_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.static_panel_guard.vcp_runtime_integration_proven = true;
runtimeClaim.static_panel_guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingSourceEval = evaluate(missingSource, sourceGate);
const userSubmissionOverclaimEval = evaluate(userSubmissionOverclaim, sourceGate);
const humanApprovalOverclaimEval = evaluate(humanApprovalOverclaim, sourceGate);
const registrationReadyOverclaimEval = evaluate(registrationReadyOverclaim, sourceGate);
const acceptedWriteEval = evaluate(acceptedWrite, sourceGate);
const externalActionEval = evaluate(externalAction, sourceGate);
const runtimeClaimEval = evaluate(runtimeClaim, sourceGate);

addResult("negative_case_missing_v14_215_source_fails", missingSourceEval.passed === false && missingSourceEval.targetOk === false);
addResult("negative_case_user_submission_overclaim_fails", userSubmissionOverclaimEval.passed === false && userSubmissionOverclaimEval.gateOk === false);
addResult("negative_case_human_approval_overclaim_fails", humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.gateOk === false);
addResult("negative_case_registration_ready_overclaim_fails", registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.gateOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "third_sample_post_approval_gate_seed",
  "thirdSamplePostApprovalGateState",
  "renderThirdSamplePostApprovalGate",
  "third_sample_post_approval_gate_state: thirdSamplePostApprovalGateState()",
]) {
  requireToken("app_or_mock", `${app}\n${mockData}`, token);
}

for (const token of [
  "third-sample-post-approval-gate",
  "thirdSamplePostApprovalGateSummary",
  "thirdSamplePostApprovalGateBody",
  "thirdSamplePostApprovalGateGuard",
]) {
  requireToken("index", index, token);
}

for (const token of [
  "third-sample-post-approval-gate-body",
  "third-sample-post-approval-gate-card",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "v14.216",
  "third_sample_post_approval_gate_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "phase: v14_216_review_console_post_approval_gate_static_panel",
  "draft_output_key: third_sample_post_approval_gate_state",
  "approval_statement_source_is_user_submission: false",
  "accepted_samples_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_216_review_console_post_approval_gate_static_panel.js",
  "tests/schema_examples/v14_216_review_console_post_approval_gate_static_panel.example.json",
  "docs/v14_216_review_console_post_approval_gate_static_panel.md",
  "v14_216_review_console_post_approval_gate_static_panel",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_216_review_console_post_approval_gate_static_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  draft_output_key: fixture.draft_output_key,
  gate_status: fixture.gate_status,
  blocker: fixture.blocker,
  target_sample_id: fixture.target.sample_id,
  target_candidate_id: fixture.target.candidate_id,
  approval_statement_source_is_user_submission: fixture.approval_statement_source_is_user_submission,
  human_approval_captured_now: fixture.human_approval_captured_now,
  accepted_samples_registration_ready_now: fixture.accepted_samples_registration_ready_now,
  future_registration_requires_v14_214_user_submission: fixture.future_registration_requires_v14_214_user_submission,
  static_panel_only: fixture.static_panel_guard.static_panel_only,
  accepted_samples_write_performed: fixture.static_panel_guard.accepted_samples_write_performed,
  category_index_write_performed: fixture.static_panel_guard.category_index_write_performed,
  failure_samples_write_performed: fixture.static_panel_guard.failure_samples_write_performed,
  production_candidate_write_performed: fixture.static_panel_guard.production_candidate_write_performed,
  daily_note_write_performed: fixture.static_panel_guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.static_panel_guard.VCP_memory_write_performed,
  provider_contact_performed: fixture.static_panel_guard.provider_contact_performed,
  plugin_call_performed: fixture.static_panel_guard.plugin_call_performed,
  api_call_performed: fixture.static_panel_guard.api_call_performed,
  mcp_runtime_performed: fixture.static_panel_guard.mcp_runtime_performed,
  image_generation_performed: fixture.static_panel_guard.image_generation_performed,
  env_or_secret_read_performed: fixture.static_panel_guard.env_or_secret_read_performed,
  real_manifest_read_performed: fixture.static_panel_guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.static_panel_guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.static_panel_guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: fixture.static_panel_guard.push_tag_release_deploy_performed,
  artifact_recoverability_is_not_vcp_runtime_integration: fixture.static_panel_guard.artifact_recoverability_is_not_vcp_runtime_integration,
  vcp_runtime_integration_proven: fixture.static_panel_guard.vcp_runtime_integration_proven,
  negative_case_missing_v14_215_source_fails: missingSourceEval.passed === false && missingSourceEval.targetOk === false,
  negative_case_user_submission_overclaim_fails: userSubmissionOverclaimEval.passed === false && userSubmissionOverclaimEval.gateOk === false,
  negative_case_human_approval_overclaim_fails: humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.gateOk === false,
  negative_case_registration_ready_overclaim_fails: registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.gateOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
