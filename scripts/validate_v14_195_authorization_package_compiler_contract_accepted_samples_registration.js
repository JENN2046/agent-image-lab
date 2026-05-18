#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_195_authorization_package_compiler_contract_accepted_samples_registration.md",
  fixture: "tests/schema_examples/v14_195_authorization_package_compiler_contract_accepted_samples_registration.example.json",
  sourcePreflight: "tests/schema_examples/v14_194_third_sample_accepted_samples_registration_execution_preflight.example.json",
  sourceDryRunPatch: "tests/schema_examples/v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.example.json",
  sourceAuthorizationDraft: "tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_195_authorization_package_compiler_contract_accepted_samples_registration",
  executionMode: "authorization_package_compiler_contract_only",
  compilerStatus: "contract_ready_execution_blocked",
  packageType: "accepted_samples_metadata_registration",
  packageId: "AUTH-PENDING-LAMP-V14-166-ACCEPTED-SAMPLES-REGISTRATION-20260518-001",
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

function evaluate(input, sourcePreflight, sourceDryRunPatch, sourceAuthorizationDraft) {
  const compiled = input.compiled_package || {};
  const sourceAlignment = input.source_alignment || {};
  const allowedFiles = input.allowed_files_after_approval || [];
  const forbiddenOperations = input.forbidden_operations || [];
  const required = input.required_before_execution || [];
  const validationRequired = input.validation_required || [];
  const guard = input.guard || {};
  const preflight = sourcePreflight.third_sample_accepted_samples_registration_execution_preflight || {};
  const dryRun = sourceDryRunPatch.third_sample_accepted_samples_registration_dry_run_patch_preview || {};
  const auth = sourceAuthorizationDraft.third_sample_accepted_samples_registration_authorization_package_draft || {};

  const targetOk =
    input.phase === expected.phase &&
    input.execution_mode === expected.executionMode &&
    input.compiler_status === expected.compilerStatus &&
    input.package_type === expected.packageType &&
    input.source_preflight_ref === files.sourcePreflight &&
    input.source_dry_run_patch_ref === files.sourceDryRunPatch &&
    input.source_authorization_draft_ref === files.sourceAuthorizationDraft &&
    compiled.package_id === expected.packageId &&
    typeof auth.exact_approval_statement_draft === "string" &&
    auth.exact_approval_statement_draft.includes(expected.packageId) &&
    compiled.status === "blocked_not_granted" &&
    compiled.execution_allowed_now === false &&
    compiled.human_approval_status === "pending" &&
    compiled.approved_by === null &&
    compiled.authorization_granted_by_this_record === false &&
    compiled.target_sample_id === expected.sampleId &&
    compiled.target_sample_id === preflight.target.sample_id &&
    compiled.target_sample_id === dryRun.target.sample_id &&
    compiled.target_sample_id === auth.target.sample_id &&
    compiled.target_candidate_id === expected.candidateId &&
    compiled.target_candidate_id === preflight.target.candidate_id &&
    compiled.target_candidate_id === dryRun.target.candidate_id &&
    compiled.target_candidate_id === auth.target.candidate_id &&
    compiled.target_category === expected.category &&
    compiled.target_category === preflight.target.category &&
    compiled.target_category === dryRun.target.category;

  const sourceOk =
    sourceAlignment.preflight_status === "blocked" &&
    sourceAlignment.preflight_status === preflight.preflight_status &&
    sourceAlignment.preflight_blocker === "missing_human_approval_and_exact_authorization" &&
    sourceAlignment.preflight_blocker === preflight.blocker &&
    sourceAlignment.dry_run_status === "blocked_pending_human_approval" &&
    sourceAlignment.dry_run_status === dryRun.dry_run_status &&
    sourceAlignment.authorization_package_status === "prepared_blocked_not_granted" &&
    sourceAlignment.authorization_package_status === auth.authorization_package_status &&
    sourceAlignment.dry_run_patch_ready === true &&
    preflight.target.dry_run_patch_ready === true &&
    preflight.target.execution_allowed_now === false &&
    auth.authorization_granted_by_this_record === false &&
    auth.execution_ready === false;

  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/product_still_life.yaml") &&
    !allowedFiles.includes("accepted_samples/") &&
    !allowedFiles.includes("accepted_samples/categories/");

  const forbiddenOk = [
    "copy_or_commit_image_files",
    "modify_runs_source_image",
    "write_failure_samples",
    "write_production_candidate",
    "write_DailyNote",
    "write_VCP_memory",
    "provider_or_api_or_plugin_or_mcp_call",
    "read_env_or_env_local",
    "read_real_manifest_or_VCPChat_or_VCPToolBox",
    "push_tag_release_deploy",
  ].every((operation) => forbiddenOperations.includes(operation));

  const requiredOk =
    required.includes("Jenn human approval for lamp candidate") &&
    required.includes("exact accepted_samples metadata write authorization") &&
    required.includes("source preflight must remain blocked until approval") &&
    required.includes("source dry-run patch must still match import/review/artifact evidence") &&
    required.includes("validators must pass before and after the metadata write") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.js") &&
    validationRequired.includes("node scripts/validate_v14_194_third_sample_accepted_samples_registration_execution_preflight.js") &&
    validationRequired.includes("node scripts/validate_agent_board_state.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.compiler_only === true &&
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
    passed: targetOk && sourceOk && scopeOk && forbiddenOk && requiredOk && noWrites && noExternal && noRuntimeClaim,
    targetOk,
    sourceOk,
    scopeOk,
    forbiddenOk,
    requiredOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).authorization_package_compiler_contract_accepted_samples_registration;
const sourcePreflight = core.parseJson(files.sourcePreflight);
const sourceDryRunPatch = core.parseJson(files.sourceDryRunPatch);
const sourceAuthorizationDraft = core.parseJson(files.sourceAuthorizationDraft);
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

const baseEval = evaluate(fixture, sourcePreflight, sourceDryRunPatch, sourceAuthorizationDraft);
addResult("authorization_package_compiler_contract_evaluation_passes", baseEval.passed);

const missingSourcePreflight = clone(fixture);
missingSourcePreflight.source_preflight_ref = "";
const humanApprovalOverclaim = clone(fixture);
humanApprovalOverclaim.compiled_package.human_approval_status = "approved";
humanApprovalOverclaim.compiled_package.approved_by = "Jenn";
humanApprovalOverclaim.compiled_package.execution_allowed_now = true;
const authorizationGranted = clone(fixture);
authorizationGranted.compiled_package.authorization_granted_by_this_record = true;
authorizationGranted.compiled_package.status = "granted";
const broadAllowedFiles = clone(fixture);
broadAllowedFiles.allowed_files_after_approval.push("accepted_samples/");
const missingForbiddenOperation = clone(fixture);
missingForbiddenOperation.forbidden_operations = missingForbiddenOperation.forbidden_operations.filter(
  (operation) => operation !== "provider_or_api_or_plugin_or_mcp_call"
);
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingSourcePreflightEval = evaluate(missingSourcePreflight, sourcePreflight, sourceDryRunPatch, sourceAuthorizationDraft);
const humanApprovalOverclaimEval = evaluate(humanApprovalOverclaim, sourcePreflight, sourceDryRunPatch, sourceAuthorizationDraft);
const authorizationGrantedEval = evaluate(authorizationGranted, sourcePreflight, sourceDryRunPatch, sourceAuthorizationDraft);
const broadAllowedFilesEval = evaluate(broadAllowedFiles, sourcePreflight, sourceDryRunPatch, sourceAuthorizationDraft);
const missingForbiddenOperationEval = evaluate(missingForbiddenOperation, sourcePreflight, sourceDryRunPatch, sourceAuthorizationDraft);
const runtimeClaimEval = evaluate(runtimeClaim, sourcePreflight, sourceDryRunPatch, sourceAuthorizationDraft);

addResult("negative_case_missing_source_preflight_fails", missingSourcePreflightEval.passed === false && missingSourcePreflightEval.targetOk === false);
addResult("negative_case_human_approval_overclaim_fails", humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.targetOk === false);
addResult("negative_case_authorization_granted_overclaim_fails", authorizationGrantedEval.passed === false && authorizationGrantedEval.targetOk === false);
addResult("negative_case_broad_allowed_file_scope_fails", broadAllowedFilesEval.passed === false && broadAllowedFilesEval.scopeOk === false);
addResult("negative_case_forbidden_operation_missing_fails", missingForbiddenOperationEval.passed === false && missingForbiddenOperationEval.forbiddenOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "compiler_status: contract_ready_execution_blocked",
  "compiled_package_status: blocked_not_granted",
  "execution_allowed_now: false",
  "authorization_granted_by_this_record: false",
  "accepted_samples_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_195_authorization_package_compiler_contract_accepted_samples_registration.js",
  "tests/schema_examples/v14_195_authorization_package_compiler_contract_accepted_samples_registration.example.json",
  "docs/v14_195_authorization_package_compiler_contract_accepted_samples_registration.md",
  "v14_195_authorization_package_compiler_contract_accepted_samples_registration",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_195_authorization_package_compiler_contract_accepted_samples_registration",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  compiler_status: fixture.compiler_status,
  package_type: fixture.package_type,
  compiled_package_id: fixture.compiled_package.package_id,
  compiled_package_status: fixture.compiled_package.status,
  target_sample_id: fixture.compiled_package.target_sample_id,
  target_candidate_id: fixture.compiled_package.target_candidate_id,
  category: fixture.compiled_package.target_category,
  human_approval_status: fixture.compiled_package.human_approval_status,
  approved_by: fixture.compiled_package.approved_by,
  authorization_granted_by_this_record: fixture.compiled_package.authorization_granted_by_this_record,
  execution_allowed_now: fixture.compiled_package.execution_allowed_now,
  allowed_file_count_after_approval: fixture.allowed_files_after_approval.length,
  forbidden_operation_count: fixture.forbidden_operations.length,
  required_before_execution_count: fixture.required_before_execution.length,
  validation_required_count: fixture.validation_required.length,
  compiler_only: fixture.guard.compiler_only,
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
  negative_case_missing_source_preflight_fails: missingSourcePreflightEval.passed === false && missingSourcePreflightEval.targetOk === false,
  negative_case_human_approval_overclaim_fails: humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.targetOk === false,
  negative_case_authorization_granted_overclaim_fails: authorizationGrantedEval.passed === false && authorizationGrantedEval.targetOk === false,
  negative_case_broad_allowed_file_scope_fails: broadAllowedFilesEval.passed === false && broadAllowedFilesEval.scopeOk === false,
  negative_case_forbidden_operation_missing_fails: missingForbiddenOperationEval.passed === false && missingForbiddenOperationEval.forbiddenOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
