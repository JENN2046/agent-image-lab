#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_198_durable_archive_authorization_compiler_output_preflight.md",
  fixture: "tests/schema_examples/v14_198_durable_archive_authorization_compiler_output_preflight.example.json",
  sourceTypeMatrix: "tests/schema_examples/v14_196_authorization_package_compiler_type_matrix.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  artifactRef:
    "runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png",
  artifactHash: "eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c",
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
  const durableArchiveType = (matrix.package_types || []).find((entry) => entry.package_type === "durable_archive") || {};
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
    durableArchiveType.default_blocker === "missing_archive_copy_authorization" &&
    durableArchiveType.default_execution_allowed === false &&
    durableArchiveType.minimum_authorization_level === "A5_exact_archive_copy_authorization";

  const packageOk =
    input.phase === "v14_198_durable_archive_authorization_compiler_output_preflight" &&
    input.execution_mode === "durable_archive_authorization_compiler_output_preflight_only" &&
    input.package_type === "durable_archive" &&
    input.package_id === "AUTH-DRAFT-DURABLE-ARCHIVE-PREFLIGHT-20260518-001" &&
    input.package_status === "draft_blocked_missing_archive_copy_authorization" &&
    input.archive_copy_authorized === false &&
    input.archive_copy_performed === false &&
    input.target_archive_path_provided === false &&
    input.write_command_permission === false &&
    input.execution_allowed_now === false;

  const targetOk =
    target.source_artifact_ref === expected.artifactRef &&
    target.source_artifact_hash_ref === expected.artifactHash &&
    target.hash_verification_required === true &&
    target.target_archive_path === null &&
    Array.isArray(allowedWritePaths) &&
    allowedWritePaths.length === 0 &&
    !allowedWritePaths.includes("durable_archive/") &&
    !allowedWritePaths.includes("accepted_samples/") &&
    forbiddenWritePaths.includes("runs/real_generation/") &&
    forbiddenWritePaths.includes("accepted_samples/") &&
    forbiddenWritePaths.includes("failure_samples/") &&
    forbiddenWritePaths.includes("production_candidate/") &&
    forbiddenWritePaths.includes("DailyNote") &&
    forbiddenWritePaths.includes("VCP memory");

  const requiredOk =
    required.includes("Jenn exact A5 durable archive copy authorization") &&
    required.includes("exact source artifact ref") &&
    required.includes("exact target archive path") &&
    required.includes("hash verification requirement") &&
    required.includes("rollback plan") &&
    required.includes("reviewer") &&
    required.includes("stop conditions") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_v14_196_authorization_package_compiler_type_matrix.js") &&
    validationRequired.includes("node scripts/validate_agent_board_state.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.preflight_only === true &&
    guard.durable_archive_copy_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.accepted_samples_write_performed === false &&
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

const fixture = core.parseJson(files.fixture).durable_archive_authorization_compiler_output_preflight;
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
addResult("durable_archive_authorization_preflight_evaluation_passes", baseEval.passed);

const targetArchivePathFilled = clone(fixture);
targetArchivePathFilled.target_scope.target_archive_path = "durable_archive/lamp.png";
targetArchivePathFilled.target_archive_path_provided = true;
const archiveCopyPerformed = clone(fixture);
archiveCopyPerformed.archive_copy_performed = true;
archiveCopyPerformed.guard.durable_archive_copy_performed = true;
archiveCopyPerformed.guard.image_file_copy_performed = true;
const broadAllowedWritePath = clone(fixture);
broadAllowedWritePath.target_scope.exact_allowed_write_paths.push("accepted_samples/");
const missingHashVerification = clone(fixture);
missingHashVerification.target_scope.hash_verification_required = false;
const productionCandidateWriteFlag = clone(fixture);
productionCandidateWriteFlag.guard.production_candidate_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const targetArchivePathFilledEval = evaluate(targetArchivePathFilled, sourceTypeMatrix);
const archiveCopyPerformedEval = evaluate(archiveCopyPerformed, sourceTypeMatrix);
const broadAllowedWritePathEval = evaluate(broadAllowedWritePath, sourceTypeMatrix);
const missingHashVerificationEval = evaluate(missingHashVerification, sourceTypeMatrix);
const productionCandidateWriteFlagEval = evaluate(productionCandidateWriteFlag, sourceTypeMatrix);
const runtimeClaimEval = evaluate(runtimeClaim, sourceTypeMatrix);

addResult("negative_case_target_archive_path_filled_without_authorization_fails", targetArchivePathFilledEval.passed === false && targetArchivePathFilledEval.packageOk === false);
addResult("negative_case_archive_copy_performed_fails", archiveCopyPerformedEval.passed === false && archiveCopyPerformedEval.packageOk === false && archiveCopyPerformedEval.noWrites === false);
addResult("negative_case_broad_allowed_write_path_fails", broadAllowedWritePathEval.passed === false && broadAllowedWritePathEval.targetOk === false);
addResult("negative_case_missing_hash_verification_fails", missingHashVerificationEval.passed === false && missingHashVerificationEval.targetOk === false);
addResult("negative_case_production_candidate_write_flag_fails", productionCandidateWriteFlagEval.passed === false && productionCandidateWriteFlagEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "package_status: draft_blocked_missing_archive_copy_authorization",
  "archive_copy_authorized: false",
  "archive_copy_performed: false",
  "write_command_permission: false",
  "durable_archive_copy_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_198_durable_archive_authorization_compiler_output_preflight.js",
  "tests/schema_examples/v14_198_durable_archive_authorization_compiler_output_preflight.example.json",
  "docs/v14_198_durable_archive_authorization_compiler_output_preflight.md",
  "v14_198_durable_archive_authorization_compiler_output_preflight",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_198_durable_archive_authorization_compiler_output_preflight",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  package_type: fixture.package_type,
  package_id: fixture.package_id,
  package_status: fixture.package_status,
  archive_copy_authorized: fixture.archive_copy_authorized,
  archive_copy_performed: fixture.archive_copy_performed,
  target_archive_path_provided: fixture.target_archive_path_provided,
  write_command_permission: fixture.write_command_permission,
  execution_allowed_now: fixture.execution_allowed_now,
  exact_allowed_write_path_count: fixture.target_scope.exact_allowed_write_paths.length,
  hash_verification_required: fixture.target_scope.hash_verification_required,
  required_before_execution_count: fixture.required_before_execution.length,
  validation_required_count: fixture.validation_required.length,
  preflight_only: fixture.guard.preflight_only,
  durable_archive_copy_performed: false,
  image_file_copy_performed: false,
  runs_source_image_modified: false,
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
  negative_case_target_archive_path_filled_without_authorization_fails:
    targetArchivePathFilledEval.passed === false && targetArchivePathFilledEval.packageOk === false,
  negative_case_archive_copy_performed_fails:
    archiveCopyPerformedEval.passed === false && archiveCopyPerformedEval.packageOk === false && archiveCopyPerformedEval.noWrites === false,
  negative_case_broad_allowed_write_path_fails: broadAllowedWritePathEval.passed === false && broadAllowedWritePathEval.targetOk === false,
  negative_case_missing_hash_verification_fails: missingHashVerificationEval.passed === false && missingHashVerificationEval.targetOk === false,
  negative_case_production_candidate_write_flag_fails: productionCandidateWriteFlagEval.passed === false && productionCandidateWriteFlagEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
