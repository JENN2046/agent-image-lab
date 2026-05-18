#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_197_manifest_read_authorization_compiler_output_preflight.md",
  fixture: "tests/schema_examples/v14_197_manifest_read_authorization_compiler_output_preflight.example.json",
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
  const manifestType = (matrix.package_types || []).find((entry) => entry.package_type === "manifest_read") || {};
  const target = input.target_scope || {};
  const guard = input.guard || {};
  const forbiddenReadPaths = input.forbidden_read_paths || [];
  const required = input.required_before_execution || [];
  const validationRequired = input.validation_required || [];

  const sourceOk =
    input.source_type_matrix_ref === files.sourceTypeMatrix &&
    matrix.compiler_matrix_status === "local_contract_ready_execution_blocked" &&
    matrix.execution_allowed_now === false &&
    manifestType.default_blocker === "missing_real_manifest_read_authorization" &&
    manifestType.default_execution_allowed === false &&
    manifestType.minimum_authorization_level === "A5_exact_manifest_read_authorization";

  const packageOk =
    input.phase === "v14_197_manifest_read_authorization_compiler_output_preflight" &&
    input.execution_mode === "manifest_read_authorization_compiler_output_preflight_only" &&
    input.package_type === "manifest_read" &&
    input.package_id === "AUTH-DRAFT-MANIFEST-READ-PREFLIGHT-20260518-001" &&
    input.package_status === "draft_blocked_missing_exact_manifest_authorization" &&
    input.source_read_authorized === false &&
    input.source_read_performed === false &&
    input.real_manifest_path_provided === false &&
    input.read_command_permission === false &&
    input.execution_allowed_now === false;

  const targetOk =
    target.real_manifest_target === null &&
    Array.isArray(target.exact_allowed_read_paths) &&
    target.exact_allowed_read_paths.length === 0 &&
    Array.isArray(target.allowed_file_types) &&
    target.allowed_file_types.length === 0 &&
    Array.isArray(target.allowed_extracted_fields) &&
    target.allowed_extracted_fields.length === 0 &&
    target.forbidden_extracted_fields.includes("secret_values") &&
    target.forbidden_extracted_fields.includes("raw_source_copy") &&
    forbiddenReadPaths.includes(".env") &&
    forbiddenReadPaths.includes(".env.local") &&
    forbiddenReadPaths.includes("VCPChat") &&
    forbiddenReadPaths.includes("VCPToolBox") &&
    forbiddenReadPaths.includes("plugin-manifest.json") &&
    forbiddenReadPaths.includes("private local paths") &&
    !target.exact_allowed_read_paths.includes("VCPChat") &&
    !target.exact_allowed_read_paths.includes("VCPToolBox");

  const requiredOk =
    required.includes("Jenn exact A5 manifest read authorization") &&
    required.includes("real manifest target path supplied by Jenn") &&
    required.includes("exact allowed read paths") &&
    required.includes("allowed extracted fields") &&
    required.includes("reviewer") &&
    required.includes("rollback plan") &&
    required.includes("stop conditions") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_v14_196_authorization_package_compiler_type_matrix.js") &&
    validationRequired.includes("node scripts/validate_agent_board_state.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWritesOrReads =
    guard.preflight_only === true &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.file_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: sourceOk && packageOk && targetOk && requiredOk && noWritesOrReads && noExternal && noRuntimeClaim,
    sourceOk,
    packageOk,
    targetOk,
    requiredOk,
    noWritesOrReads,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).manifest_read_authorization_compiler_output_preflight;
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
addResult("manifest_read_authorization_preflight_evaluation_passes", baseEval.passed);

const realManifestPathFilled = clone(fixture);
realManifestPathFilled.target_scope.real_manifest_target = "A:/VCP/plugin-manifest.json";
realManifestPathFilled.real_manifest_path_provided = true;
const sourceReadPerformed = clone(fixture);
sourceReadPerformed.source_read_performed = true;
sourceReadPerformed.guard.real_manifest_read_performed = true;
const readCommandPermission = clone(fixture);
readCommandPermission.read_command_permission = true;
const broadAllowedReadPath = clone(fixture);
broadAllowedReadPath.target_scope.exact_allowed_read_paths.push("VCPToolBox");
const missingReviewerRequirement = clone(fixture);
missingReviewerRequirement.required_before_execution = missingReviewerRequirement.required_before_execution.filter((item) => item !== "reviewer");
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const realManifestPathFilledEval = evaluate(realManifestPathFilled, sourceTypeMatrix);
const sourceReadPerformedEval = evaluate(sourceReadPerformed, sourceTypeMatrix);
const readCommandPermissionEval = evaluate(readCommandPermission, sourceTypeMatrix);
const broadAllowedReadPathEval = evaluate(broadAllowedReadPath, sourceTypeMatrix);
const missingReviewerRequirementEval = evaluate(missingReviewerRequirement, sourceTypeMatrix);
const runtimeClaimEval = evaluate(runtimeClaim, sourceTypeMatrix);

addResult("negative_case_real_manifest_path_filled_without_authorization_fails", realManifestPathFilledEval.passed === false && realManifestPathFilledEval.packageOk === false);
addResult("negative_case_source_read_performed_fails", sourceReadPerformedEval.passed === false && sourceReadPerformedEval.packageOk === false && sourceReadPerformedEval.noWritesOrReads === false);
addResult("negative_case_read_command_permission_fails", readCommandPermissionEval.passed === false && readCommandPermissionEval.packageOk === false);
addResult("negative_case_broad_allowed_read_path_fails", broadAllowedReadPathEval.passed === false && broadAllowedReadPathEval.targetOk === false);
addResult("negative_case_missing_reviewer_requirement_fails", missingReviewerRequirementEval.passed === false && missingReviewerRequirementEval.requiredOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "package_status: draft_blocked_missing_exact_manifest_authorization",
  "source_read_authorized: false",
  "source_read_performed: false",
  "read_command_permission: false",
  "real_manifest_read_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_197_manifest_read_authorization_compiler_output_preflight.js",
  "tests/schema_examples/v14_197_manifest_read_authorization_compiler_output_preflight.example.json",
  "docs/v14_197_manifest_read_authorization_compiler_output_preflight.md",
  "v14_197_manifest_read_authorization_compiler_output_preflight",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_197_manifest_read_authorization_compiler_output_preflight",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  package_type: fixture.package_type,
  package_id: fixture.package_id,
  package_status: fixture.package_status,
  source_read_authorized: fixture.source_read_authorized,
  source_read_performed: fixture.source_read_performed,
  real_manifest_path_provided: fixture.real_manifest_path_provided,
  read_command_permission: fixture.read_command_permission,
  execution_allowed_now: fixture.execution_allowed_now,
  exact_allowed_read_path_count: fixture.target_scope.exact_allowed_read_paths.length,
  required_before_execution_count: fixture.required_before_execution.length,
  validation_required_count: fixture.validation_required.length,
  preflight_only: fixture.guard.preflight_only,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  file_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_real_manifest_path_filled_without_authorization_fails: realManifestPathFilledEval.passed === false && realManifestPathFilledEval.packageOk === false,
  negative_case_source_read_performed_fails: sourceReadPerformedEval.passed === false && sourceReadPerformedEval.packageOk === false && sourceReadPerformedEval.noWritesOrReads === false,
  negative_case_read_command_permission_fails: readCommandPermissionEval.passed === false && readCommandPermissionEval.packageOk === false,
  negative_case_broad_allowed_read_path_fails: broadAllowedReadPathEval.passed === false && broadAllowedReadPathEval.targetOk === false,
  negative_case_missing_reviewer_requirement_fails: missingReviewerRequirementEval.passed === false && missingReviewerRequirementEval.requiredOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
