#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression.example.json",
  sourceFixture: "tests/schema_examples/v14_191_review_console_accepted_samples_authorization_package_panel.example.json",
  sourcePackage: "tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression",
  snapshotStatus: "golden_static_snapshot",
  draftKey: "third_sample_accepted_samples_authorization_package_state",
  sampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  candidateId: "v14_166_lamp_v3_generated_candidate_001",
  status: "prepared_blocked_not_granted",
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

function evaluate(input, sourceFixture, sourcePackage) {
  const source = sourceFixture.review_console_accepted_samples_authorization_package_panel;
  const sourceDraft = sourcePackage.third_sample_accepted_samples_registration_authorization_package_draft;
  const snapshot = input.snapshot || {};
  const guard = input.guard || {};

  const snapshotOk =
    input.phase === expected.phase &&
    input.snapshot_status === expected.snapshotStatus &&
    input.draft_output_key === expected.draftKey &&
    input.source_fixture_ref === files.sourceFixture &&
    snapshot.target_sample_id === expected.sampleId &&
    snapshot.target_sample_id === source.target.sample_id &&
    snapshot.target_sample_id === sourceDraft.target.sample_id &&
    snapshot.target_candidate_id === expected.candidateId &&
    snapshot.target_candidate_id === source.target.candidate_id &&
    snapshot.target_candidate_id === sourceDraft.target.candidate_id &&
    snapshot.authorization_package_status === expected.status &&
    snapshot.authorization_package_status === source.authorization_package_status &&
    snapshot.authorization_granted_by_this_record === false &&
    snapshot.authorization_granted_by_this_record === source.authorization_granted_by_this_record &&
    snapshot.execution_ready === false &&
    snapshot.execution_ready === source.execution_ready &&
    snapshot.blocker === expected.blocker &&
    snapshot.blocker === source.blocker &&
    snapshot.human_approval_status === "pending" &&
    snapshot.approved_by === null &&
    snapshot.registration_ready === false &&
    snapshot.exact_allowed_file_count === source.exact_allowed_files.length &&
    snapshot.forbidden_operation_count === source.forbidden_operations.length &&
    snapshot.missing_requirement_count === source.missing_requirements.length &&
    snapshot.exact_approval_statement_draft_present === true &&
    snapshot.static_panel_only === true &&
    snapshot.next_allowed_local_action === "wait_for_jenn_human_approval_and_exact_authorization";

  const noWrites =
    guard.static_snapshot_only === true &&
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

const fixture = core.parseJson(files.snapshot).review_console_accepted_samples_authorization_package_snapshot_static_regression;
const sourceFixture = core.parseJson(files.sourceFixture);
const sourcePackage = core.parseJson(files.sourcePackage);
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

const baseEval = evaluate(fixture, sourceFixture, sourcePackage);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("accepted_samples_authorization_package_snapshot_evaluation_passes", baseEval.passed);

const authorizationGranted = clone(fixture);
authorizationGranted.snapshot.authorization_granted_by_this_record = true;
authorizationGranted.snapshot.authorization_package_status = "granted";
const executionReady = clone(fixture);
executionReady.snapshot.execution_ready = true;
executionReady.snapshot.registration_ready = true;
const missingStatement = clone(fixture);
missingStatement.snapshot.exact_approval_statement_draft_present = false;
const allowedFileCountDrift = clone(fixture);
allowedFileCountDrift.snapshot.exact_allowed_file_count = 3;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const authorizationGrantedEval = evaluate(authorizationGranted, sourceFixture, sourcePackage);
const executionReadyEval = evaluate(executionReady, sourceFixture, sourcePackage);
const missingStatementEval = evaluate(missingStatement, sourceFixture, sourcePackage);
const allowedFileCountDriftEval = evaluate(allowedFileCountDrift, sourceFixture, sourcePackage);
const acceptedWriteEval = evaluate(acceptedWrite, sourceFixture, sourcePackage);
const runtimeClaimEval = evaluate(runtimeClaim, sourceFixture, sourcePackage);

addResult("negative_case_authorization_granted_overclaim_fails", authorizationGrantedEval.passed === false && authorizationGrantedEval.snapshotOk === false);
addResult("negative_case_execution_ready_overclaim_fails", executionReadyEval.passed === false && executionReadyEval.snapshotOk === false);
addResult("negative_case_missing_statement_fails", missingStatementEval.passed === false && missingStatementEval.snapshotOk === false);
addResult("negative_case_allowed_file_count_drift_fails", allowedFileCountDriftEval.passed === false && allowedFileCountDriftEval.snapshotOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "thirdSampleAcceptedSamplesAuthorizationPackageState",
  "third_sample_accepted_samples_authorization_package_state",
  "renderThirdSampleAcceptedSamplesAuthorizationPackage",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "scripts/validate_v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression.js",
  "tests/schema_examples/v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression.example.json",
  "docs/v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression.md",
  "v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_192_review_console_accepted_samples_authorization_package_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: fixture.snapshot_status,
  draft_output_key: fixture.draft_output_key,
  target_sample_id: fixture.snapshot.target_sample_id,
  target_candidate_id: fixture.snapshot.target_candidate_id,
  authorization_package_status: fixture.snapshot.authorization_package_status,
  authorization_granted_by_this_record: fixture.snapshot.authorization_granted_by_this_record,
  execution_ready: fixture.snapshot.execution_ready,
  blocker: fixture.snapshot.blocker,
  human_approval_status: fixture.snapshot.human_approval_status,
  approved_by: fixture.snapshot.approved_by,
  registration_ready: fixture.snapshot.registration_ready,
  exact_allowed_file_count: fixture.snapshot.exact_allowed_file_count,
  forbidden_operation_count: fixture.snapshot.forbidden_operation_count,
  missing_requirement_count: fixture.snapshot.missing_requirement_count,
  exact_approval_statement_draft_present: fixture.snapshot.exact_approval_statement_draft_present,
  static_panel_only: fixture.snapshot.static_panel_only,
  static_snapshot_only: fixture.guard.static_snapshot_only,
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
  negative_case_authorization_granted_overclaim_fails: authorizationGrantedEval.passed === false && authorizationGrantedEval.snapshotOk === false,
  negative_case_execution_ready_overclaim_fails: executionReadyEval.passed === false && executionReadyEval.snapshotOk === false,
  negative_case_missing_statement_fails: missingStatementEval.passed === false && missingStatementEval.snapshotOk === false,
  negative_case_allowed_file_count_drift_fails: allowedFileCountDriftEval.passed === false && allowedFileCountDriftEval.snapshotOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
