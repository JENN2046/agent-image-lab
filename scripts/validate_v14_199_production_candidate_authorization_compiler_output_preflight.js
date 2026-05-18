#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_199_production_candidate_authorization_compiler_output_preflight.md",
  fixture: "tests/schema_examples/v14_199_production_candidate_authorization_compiler_output_preflight.example.json",
  sourceTypeMatrix: "tests/schema_examples/v14_196_authorization_package_compiler_type_matrix.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
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

function evaluate(input, sourceTypeMatrix) {
  const matrix = sourceTypeMatrix.authorization_package_compiler_type_matrix || {};
  const productionType = (matrix.package_types || []).find((entry) => entry.package_type === "production_candidate") || {};
  const target = input.target_scope || {};
  const guard = input.guard || {};
  const required = input.required_before_execution || [];
  const validationRequired = input.validation_required || [];
  const allowedWritePaths = target.exact_allowed_write_paths || [];
  const forbiddenWritePaths = target.forbidden_write_paths || [];

  const sourceOk =
    input.source_type_matrix_ref === files.sourceTypeMatrix &&
    matrix.compiler_matrix_status === "local_contract_ready_execution_blocked" &&
    matrix.execution_allowed_now === false &&
    productionType.default_blocker === "missing_production_candidate_authorization" &&
    productionType.default_execution_allowed === false &&
    productionType.minimum_authorization_level === "A5_exact_production_candidate_authorization";

  const packageOk =
    input.phase === "v14_199_production_candidate_authorization_compiler_output_preflight" &&
    input.execution_mode === "production_candidate_authorization_compiler_output_preflight_only" &&
    input.package_type === "production_candidate" &&
    input.package_id === "AUTH-DRAFT-PRODUCTION-CANDIDATE-PREFLIGHT-20260518-001" &&
    input.package_status === "draft_blocked_missing_production_candidate_authorization" &&
    input.production_candidate_authorized === false &&
    input.production_candidate_write_performed === false &&
    input.eligibility_preflight_present === false &&
    input.write_command_permission === false &&
    input.execution_allowed_now === false;

  const targetOk =
    target.accepted_sample_ref === null &&
    target.eligibility_preflight_ref === null &&
    target.blocker_decision === "blocked_missing_accepted_sample_and_authorization" &&
    Array.isArray(allowedWritePaths) &&
    allowedWritePaths.length === 0 &&
    !allowedWritePaths.includes("production_candidate/") &&
    forbiddenWritePaths.includes("production_candidate/") &&
    forbiddenWritePaths.includes("runs/real_generation/") &&
    forbiddenWritePaths.includes("accepted_samples/") &&
    forbiddenWritePaths.includes("failure_samples/") &&
    forbiddenWritePaths.includes("DailyNote") &&
    forbiddenWritePaths.includes("VCP memory");

  const requiredOk =
    required.includes("Jenn exact A5 production_candidate authorization") &&
    required.includes("recoverable accepted sample ref") &&
    required.includes("eligibility preflight ref") &&
    required.includes("blocker decision") &&
    required.includes("exact allowed production_candidate write path") &&
    required.includes("rollback plan") &&
    required.includes("reviewer") &&
    required.includes("stop conditions") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_v14_196_authorization_package_compiler_type_matrix.js") &&
    validationRequired.includes("node scripts/validate_agent_board_state.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.preflight_only === true &&
    guard.production_candidate_write_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
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
    passed: sourceOk && packageOk && targetOk && requiredOk && noWrites && noExternal && noRuntimeClaim,
    sourceOk,
    packageOk,
    targetOk,
    requiredOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).production_candidate_authorization_compiler_output_preflight;
const sourceTypeMatrix = core.parseJson(files.sourceTypeMatrix);
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

const baseEval = evaluate(fixture, sourceTypeMatrix);
addResult("production_candidate_authorization_preflight_evaluation_passes", baseEval.passed);

const acceptedSampleRefWithoutEligibility = clone(fixture);
acceptedSampleRefWithoutEligibility.target_scope.accepted_sample_ref = "accepted_example";
const productionCandidateWritePerformed = clone(fixture);
productionCandidateWritePerformed.production_candidate_write_performed = true;
productionCandidateWritePerformed.guard.production_candidate_write_performed = true;
const broadAllowedWritePath = clone(fixture);
broadAllowedWritePath.target_scope.exact_allowed_write_paths.push("production_candidate/");
const blockerMissing = clone(fixture);
blockerMissing.target_scope.blocker_decision = null;
const memoryWriteFlag = clone(fixture);
memoryWriteFlag.guard.VCP_memory_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const acceptedSampleRefWithoutEligibilityEval = evaluate(acceptedSampleRefWithoutEligibility, sourceTypeMatrix);
const productionCandidateWritePerformedEval = evaluate(productionCandidateWritePerformed, sourceTypeMatrix);
const broadAllowedWritePathEval = evaluate(broadAllowedWritePath, sourceTypeMatrix);
const blockerMissingEval = evaluate(blockerMissing, sourceTypeMatrix);
const memoryWriteFlagEval = evaluate(memoryWriteFlag, sourceTypeMatrix);
const runtimeClaimEval = evaluate(runtimeClaim, sourceTypeMatrix);

addResult("negative_case_accepted_sample_ref_without_eligibility_fails", acceptedSampleRefWithoutEligibilityEval.passed === false && acceptedSampleRefWithoutEligibilityEval.targetOk === false);
addResult("negative_case_production_candidate_write_performed_fails", productionCandidateWritePerformedEval.passed === false && productionCandidateWritePerformedEval.packageOk === false && productionCandidateWritePerformedEval.noWrites === false);
addResult("negative_case_broad_allowed_write_path_fails", broadAllowedWritePathEval.passed === false && broadAllowedWritePathEval.targetOk === false);
addResult("negative_case_blocker_missing_fails", blockerMissingEval.passed === false && blockerMissingEval.targetOk === false);
addResult("negative_case_memory_write_flag_fails", memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "package_status: draft_blocked_missing_production_candidate_authorization",
  "production_candidate_authorized: false",
  "production_candidate_write_performed: false",
  "write_command_permission: false",
  "accepted_samples_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_199_production_candidate_authorization_compiler_output_preflight.js",
  "tests/schema_examples/v14_199_production_candidate_authorization_compiler_output_preflight.example.json",
  "docs/v14_199_production_candidate_authorization_compiler_output_preflight.md",
  "v14_199_production_candidate_authorization_compiler_output_preflight",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_199_production_candidate_authorization_compiler_output_preflight",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  package_type: fixture.package_type,
  package_id: fixture.package_id,
  package_status: fixture.package_status,
  production_candidate_authorized: fixture.production_candidate_authorized,
  production_candidate_write_performed: fixture.production_candidate_write_performed,
  eligibility_preflight_present: fixture.eligibility_preflight_present,
  write_command_permission: fixture.write_command_permission,
  execution_allowed_now: fixture.execution_allowed_now,
  exact_allowed_write_path_count: fixture.target_scope.exact_allowed_write_paths.length,
  required_before_execution_count: fixture.required_before_execution.length,
  validation_required_count: fixture.validation_required.length,
  preflight_only: fixture.guard.preflight_only,
  durable_archive_copy_performed: false,
  image_file_copy_performed: false,
  runs_source_image_modified: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
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
  negative_case_accepted_sample_ref_without_eligibility_fails:
    acceptedSampleRefWithoutEligibilityEval.passed === false && acceptedSampleRefWithoutEligibilityEval.targetOk === false,
  negative_case_production_candidate_write_performed_fails:
    productionCandidateWritePerformedEval.passed === false && productionCandidateWritePerformedEval.packageOk === false && productionCandidateWritePerformedEval.noWrites === false,
  negative_case_broad_allowed_write_path_fails: broadAllowedWritePathEval.passed === false && broadAllowedWritePathEval.targetOk === false,
  negative_case_blocker_missing_fails: blockerMissingEval.passed === false && blockerMissingEval.targetOk === false,
  negative_case_memory_write_flag_fails: memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
