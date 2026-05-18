#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_191_review_console_accepted_samples_authorization_package_panel.md",
  fixture: "tests/schema_examples/v14_191_review_console_accepted_samples_authorization_package_panel.example.json",
  sourcePackage: "tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json",
  sourceReadiness: "tests/schema_examples/v14_188_review_console_third_sample_acceptance_readiness.example.json",
  sourceBlocker: "tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json",
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
  phase: "v14_191_review_console_accepted_samples_authorization_package_panel_static_only",
  draftOutputKey: "third_sample_accepted_samples_authorization_package_state",
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function evaluate(panel, sourcePackage, sourceReadiness, sourceBlocker) {
  const sourceDraft = sourcePackage.third_sample_accepted_samples_registration_authorization_package_draft;
  const readiness = sourceReadiness.review_console_third_sample_acceptance_readiness;
  const blocker = sourceBlocker.lamp_v3_accepted_samples_registration_blocker_preflight;
  const target = panel.target || {};
  const guard = panel.static_panel_guard || {};
  const allowedFiles = panel.exact_allowed_files || [];
  const forbiddenOperations = panel.forbidden_operations || [];
  const missingRequirements = panel.missing_requirements || [];

  const targetOk =
    panel.phase === expected.phase &&
    panel.execution_mode === "review_console_static_authorization_package_display_only" &&
    panel.draft_output_key === expected.draftOutputKey &&
    panel.source_authorization_package_ref === files.sourcePackage &&
    panel.authorization_package_status === expected.status &&
    panel.authorization_package_status === sourceDraft.authorization_package_status &&
    panel.authorization_granted_by_this_record === false &&
    panel.authorization_granted_by_this_record === sourceDraft.authorization_granted_by_this_record &&
    panel.execution_ready === false &&
    panel.execution_ready === sourceDraft.execution_ready &&
    panel.blocker === expected.blocker &&
    panel.blocker === sourceDraft.blocker &&
    target.sample_id === expected.sampleId &&
    target.sample_id === sourceDraft.target.sample_id &&
    target.sample_id === readiness.target_sample_id &&
    target.sample_id === blocker.proposed_registration_if_approved_later.sample_id &&
    target.candidate_id === expected.candidateId &&
    target.candidate_id === sourceDraft.target.candidate_id &&
    target.candidate_id === readiness.target_candidate_id &&
    target.human_approval_status === "pending" &&
    target.approved_by === null &&
    target.registration_ready === false &&
    target.accepted_samples_metadata_registered === false;

  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/product_still_life.yaml") &&
    forbiddenOperations.includes("copy_or_commit_image_files") &&
    forbiddenOperations.includes("modify_runs_real_generation_source_images") &&
    forbiddenOperations.includes("write_failure_samples") &&
    forbiddenOperations.includes("write_production_candidate") &&
    forbiddenOperations.includes("write_DailyNote") &&
    forbiddenOperations.includes("write_VCP_memory") &&
    forbiddenOperations.includes("provider_or_api_or_plugin_or_mcp_call") &&
    forbiddenOperations.includes("read_env_or_env_local") &&
    forbiddenOperations.includes("read_real_manifest_or_VCPChat_or_VCPToolBox") &&
    forbiddenOperations.includes("push_tag_release_deploy");

  const statementOk =
    panel.exact_approval_statement_draft_present === true &&
    sourceDraft.exact_approval_statement_draft.includes("AUTH-PENDING-LAMP-V14-166-ACCEPTED-SAMPLES-REGISTRATION-20260518-001") &&
    sourceDraft.exact_approval_statement_draft.includes(expected.sampleId) &&
    sourceDraft.exact_approval_statement_draft.includes("审批人 Jenn");

  const missingRequirementsOk =
    missingRequirements.length === 3 &&
    missingRequirements.includes("human_approval_status: approved") &&
    missingRequirements.includes("approved_by: Jenn") &&
    missingRequirements.includes("explicit authorization statement from Jenn");

  const noWrites =
    guard.static_panel_only === true &&
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
    passed: targetOk && scopeOk && statementOk && missingRequirementsOk && noWrites && noExternal && noRuntimeClaim,
    targetOk,
    scopeOk,
    statementOk,
    missingRequirementsOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const fixture = core.parseJson(files.fixture).review_console_accepted_samples_authorization_package_panel;
const sourcePackage = core.parseJson(files.sourcePackage);
const sourceReadiness = core.parseJson(files.sourceReadiness);
const sourceBlocker = core.parseJson(files.sourceBlocker);
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

const baseEval = evaluate(fixture, sourcePackage, sourceReadiness, sourceBlocker);
addResult("authorization_package_panel_evaluation_passes", baseEval.passed);

const authorizationGranted = clone(fixture);
authorizationGranted.authorization_granted_by_this_record = true;
authorizationGranted.authorization_package_status = "granted";
const executionReady = clone(fixture);
executionReady.execution_ready = true;
executionReady.target.registration_ready = true;
const missingStatement = clone(fixture);
missingStatement.exact_approval_statement_draft_present = false;
const broadAllowedFiles = clone(fixture);
broadAllowedFiles.exact_allowed_files.push("accepted_samples/");
const acceptedWrite = clone(fixture);
acceptedWrite.static_panel_guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.static_panel_guard.vcp_runtime_integration_proven = true;
runtimeClaim.static_panel_guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const authorizationGrantedEval = evaluate(authorizationGranted, sourcePackage, sourceReadiness, sourceBlocker);
const executionReadyEval = evaluate(executionReady, sourcePackage, sourceReadiness, sourceBlocker);
const missingStatementEval = evaluate(missingStatement, sourcePackage, sourceReadiness, sourceBlocker);
const broadAllowedFilesEval = evaluate(broadAllowedFiles, sourcePackage, sourceReadiness, sourceBlocker);
const acceptedWriteEval = evaluate(acceptedWrite, sourcePackage, sourceReadiness, sourceBlocker);
const runtimeClaimEval = evaluate(runtimeClaim, sourcePackage, sourceReadiness, sourceBlocker);

addResult("negative_case_authorization_granted_overclaim_fails", authorizationGrantedEval.passed === false && authorizationGrantedEval.targetOk === false);
addResult("negative_case_execution_ready_overclaim_fails", executionReadyEval.passed === false && executionReadyEval.targetOk === false);
addResult("negative_case_missing_statement_fails", missingStatementEval.passed === false && missingStatementEval.statementOk === false);
addResult("negative_case_broad_allowed_files_fails", broadAllowedFilesEval.passed === false && broadAllowedFilesEval.scopeOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "thirdSampleAcceptedSamplesAuthorizationPackageState",
  "third_sample_accepted_samples_authorization_package_state",
  "renderThirdSampleAcceptedSamplesAuthorizationPackage",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "third-sample-authorization-package",
  "thirdSampleAuthorizationPackageBody",
  "thirdSampleAuthorizationPackageGuard",
]) {
  requireToken("index", index, token);
}

for (const token of [
  "third-sample-authorization-package-card",
  "authorization-statement",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "third_sample_accepted_samples_authorization_package_seed",
  "AUTH-PENDING-LAMP-V14-166-ACCEPTED-SAMPLES-REGISTRATION-20260518-001",
]) {
  requireToken("mock_data", mockData, token);
}

for (const token of [
  "v14_191_review_console_accepted_samples_authorization_package_panel_static_only",
  "third_sample_accepted_samples_authorization_package_state",
  "authorization_package_status: prepared_blocked_not_granted",
  "accepted_samples_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "v14.191",
  "third_sample_accepted_samples_authorization_package_state",
  "Review Console accepted_samples authorization package",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_191_review_console_accepted_samples_authorization_package_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  draft_output_key: fixture.draft_output_key,
  authorization_package_status: fixture.authorization_package_status,
  authorization_granted_by_this_record: fixture.authorization_granted_by_this_record,
  execution_ready: fixture.execution_ready,
  blocker: fixture.blocker,
  target_sample_id: fixture.target.sample_id,
  target_candidate_id: fixture.target.candidate_id,
  human_approval_status: fixture.target.human_approval_status,
  approved_by: fixture.target.approved_by,
  registration_ready: fixture.target.registration_ready,
  exact_allowed_file_count: fixture.exact_allowed_files.length,
  forbidden_operation_count: fixture.forbidden_operations.length,
  missing_requirement_count: fixture.missing_requirements.length,
  exact_approval_statement_draft_present: fixture.exact_approval_statement_draft_present,
  static_panel_only: fixture.static_panel_guard.static_panel_only,
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
  negative_case_authorization_granted_overclaim_fails: authorizationGrantedEval.passed === false && authorizationGrantedEval.targetOk === false,
  negative_case_execution_ready_overclaim_fails: executionReadyEval.passed === false && executionReadyEval.targetOk === false,
  negative_case_missing_statement_fails: missingStatementEval.passed === false && missingStatementEval.statementOk === false,
  negative_case_broad_allowed_files_fails: broadAllowedFilesEval.passed === false && broadAllowedFilesEval.scopeOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
