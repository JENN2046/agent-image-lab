#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_194_third_sample_accepted_samples_registration_execution_preflight.md",
  fixture: "tests/schema_examples/v14_194_third_sample_accepted_samples_registration_execution_preflight.example.json",
  readiness: "docs/v14_166_lamp_v3_generated_candidate_readiness.md",
  authorizationPackage: "tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json",
  dryRunPatch: "tests/schema_examples/v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_194_third_sample_accepted_samples_registration_execution_preflight",
  executionMode: "accepted_samples_registration_execution_preflight_only",
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

function evaluate(input, readinessText, authorizationPackage, dryRunPatch) {
  const target = input.target || {};
  const guard = input.guard || {};
  const auth = authorizationPackage.third_sample_accepted_samples_registration_authorization_package_draft || {};
  const dryRun = dryRunPatch.third_sample_accepted_samples_registration_dry_run_patch_preview || {};
  const allowedFiles = input.allowed_files_after_approval || [];
  const forbiddenPaths = input.forbidden_write_paths || [];
  const required = input.required_before_execution || [];
  const validationRequired = input.validation_required_before_execution || [];

  const targetOk =
    input.phase === expected.phase &&
    input.execution_mode === expected.executionMode &&
    input.preflight_status === "blocked" &&
    input.blocker === "missing_human_approval_and_exact_authorization" &&
    input.source_readiness_ref === files.readiness &&
    input.source_authorization_package_ref === files.authorizationPackage &&
    input.source_dry_run_patch_ref === files.dryRunPatch &&
    target.sample_id === expected.sampleId &&
    target.sample_id === auth.target.sample_id &&
    target.sample_id === dryRun.target.sample_id &&
    target.candidate_id === expected.candidateId &&
    target.candidate_id === auth.target.candidate_id &&
    target.candidate_id === dryRun.target.candidate_id &&
    target.category === expected.category &&
    target.category === dryRun.target.category &&
    target.human_approval_status === "pending" &&
    target.human_approval_status === dryRun.target.human_approval_status &&
    target.approved_by === null &&
    target.authorization_package_status === "prepared_blocked_not_granted" &&
    target.authorization_package_status === auth.authorization_package_status &&
    target.authorization_granted_by_this_record === false &&
    target.authorization_granted_by_this_record === auth.authorization_granted_by_this_record &&
    target.dry_run_patch_ready === true &&
    dryRun.dry_run_status === "blocked_pending_human_approval" &&
    target.execution_allowed_now === false &&
    readinessText.includes("human_approval_present: fail_pending") &&
    readinessText.includes("accepted_samples_ready: false");

  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/product_still_life.yaml") &&
    !allowedFiles.includes("accepted_samples/") &&
    forbiddenPaths.includes("runs/real_generation/") &&
    forbiddenPaths.includes("failure_samples/") &&
    forbiddenPaths.includes("production_candidate/") &&
    forbiddenPaths.includes("DailyNote") &&
    forbiddenPaths.includes("VCP memory");

  const requiredOk =
    required.includes("Jenn human approval for lamp candidate") &&
    required.includes("exact accepted_samples metadata write authorization") &&
    required.includes("dry-run patch preview must still match import/review/artifact evidence") &&
    required.includes("validators must pass before and after the metadata write") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.js") &&
    validationRequired.includes("node scripts/validate_agent_board_state.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.preflight_only === true &&
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
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: targetOk && scopeOk && requiredOk && noWrites && noExternal && noRuntimeClaim,
    targetOk,
    scopeOk,
    requiredOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).third_sample_accepted_samples_registration_execution_preflight;
const readinessText = core.read(files.readiness);
const authorizationPackage = core.parseJson(files.authorizationPackage);
const dryRunPatch = core.parseJson(files.dryRunPatch);
const phaseRecord = core.read(files.phaseRecord);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const baseEval = evaluate(fixture, readinessText, authorizationPackage, dryRunPatch);
addResult("third_sample_execution_preflight_evaluation_passes", baseEval.passed);

const humanApprovalOverclaim = clone(fixture);
humanApprovalOverclaim.target.human_approval_status = "approved";
humanApprovalOverclaim.target.approved_by = "Jenn";
humanApprovalOverclaim.target.execution_allowed_now = true;
const authorizationGranted = clone(fixture);
authorizationGranted.target.authorization_granted_by_this_record = true;
authorizationGranted.target.authorization_package_status = "granted";
const dryRunTargetMismatch = clone(fixture);
dryRunTargetMismatch.target.sample_id = "accepted_wrong_sample";
const broadAllowedFiles = clone(fixture);
broadAllowedFiles.allowed_files_after_approval.push("accepted_samples/");
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const humanApprovalOverclaimEval = evaluate(humanApprovalOverclaim, readinessText, authorizationPackage, dryRunPatch);
const authorizationGrantedEval = evaluate(authorizationGranted, readinessText, authorizationPackage, dryRunPatch);
const dryRunTargetMismatchEval = evaluate(dryRunTargetMismatch, readinessText, authorizationPackage, dryRunPatch);
const broadAllowedFilesEval = evaluate(broadAllowedFiles, readinessText, authorizationPackage, dryRunPatch);
const acceptedWriteEval = evaluate(acceptedWrite, readinessText, authorizationPackage, dryRunPatch);
const runtimeClaimEval = evaluate(runtimeClaim, readinessText, authorizationPackage, dryRunPatch);

addResult("negative_case_human_approval_overclaim_fails", humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.targetOk === false);
addResult("negative_case_authorization_granted_overclaim_fails", authorizationGrantedEval.passed === false && authorizationGrantedEval.targetOk === false);
addResult("negative_case_dry_run_target_mismatch_fails", dryRunTargetMismatchEval.passed === false && dryRunTargetMismatchEval.targetOk === false);
addResult("negative_case_broad_allowed_files_fails", broadAllowedFilesEval.passed === false && broadAllowedFilesEval.scopeOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "preflight_status: blocked",
  "blocker: missing_human_approval_and_exact_authorization",
  "execution_allowed_now: false",
  "accepted_samples_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_194_third_sample_accepted_samples_registration_execution_preflight.js",
  "tests/schema_examples/v14_194_third_sample_accepted_samples_registration_execution_preflight.example.json",
  "docs/v14_194_third_sample_accepted_samples_registration_execution_preflight.md",
  "v14_194_third_sample_accepted_samples_registration_execution_preflight",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_194_third_sample_accepted_samples_registration_execution_preflight",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  preflight_status: fixture.preflight_status,
  blocker: fixture.blocker,
  target_sample_id: fixture.target.sample_id,
  target_candidate_id: fixture.target.candidate_id,
  category: fixture.target.category,
  human_approval_status: fixture.target.human_approval_status,
  approved_by: fixture.target.approved_by,
  authorization_package_status: fixture.target.authorization_package_status,
  authorization_granted_by_this_record: fixture.target.authorization_granted_by_this_record,
  dry_run_patch_ready: fixture.target.dry_run_patch_ready,
  execution_allowed_now: fixture.target.execution_allowed_now,
  allowed_file_count_after_approval: fixture.allowed_files_after_approval.length,
  required_before_execution_count: fixture.required_before_execution.length,
  validation_required_before_execution_count: fixture.validation_required_before_execution.length,
  preflight_only: fixture.guard.preflight_only,
  accepted_samples_write_performed: false,
  category_index_write_performed: false,
  image_file_copy_performed: false,
  runs_source_image_modified: false,
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
  negative_case_human_approval_overclaim_fails: humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.targetOk === false,
  negative_case_authorization_granted_overclaim_fails: authorizationGrantedEval.passed === false && authorizationGrantedEval.targetOk === false,
  negative_case_dry_run_target_mismatch_fails: dryRunTargetMismatchEval.passed === false && dryRunTargetMismatchEval.targetOk === false,
  negative_case_broad_allowed_files_fails: broadAllowedFilesEval.passed === false && broadAllowedFilesEval.scopeOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
