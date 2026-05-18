#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight.md",
  fixture: "tests/schema_examples/v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight.example.json",
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
  const memoryType = (matrix.package_types || []).find((entry) => entry.package_type === "daily_note_vcp_memory") || {};
  const target = input.target_scope || {};
  const guard = input.guard || {};
  const required = input.required_before_execution || [];
  const validationRequired = input.validation_required || [];
  const allowedMemoryTargets = target.exact_allowed_memory_targets || [];
  const forbiddenMemoryTargets = target.forbidden_memory_targets || [];

  const sourceOk =
    input.source_type_matrix_ref === files.sourceTypeMatrix &&
    matrix.compiler_matrix_status === "local_contract_ready_execution_blocked" &&
    matrix.execution_allowed_now === false &&
    memoryType.default_blocker === "missing_daily_note_vcp_memory_write_authorization" &&
    memoryType.default_execution_allowed === false &&
    memoryType.minimum_authorization_level === "A5_exact_memory_write_authorization";

  const packageOk =
    input.phase === "v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight" &&
    input.execution_mode === "daily_note_vcp_memory_authorization_compiler_output_preflight_only" &&
    input.package_type === "daily_note_vcp_memory" &&
    input.package_id === "AUTH-DRAFT-DAILYNOTE-VCP-MEMORY-PREFLIGHT-20260518-001" &&
    input.package_status === "draft_blocked_missing_daily_note_vcp_memory_write_authorization" &&
    input.daily_note_write_authorized === false &&
    input.vcp_memory_write_authorized === false &&
    input.memory_delta_draft_present === false &&
    input.sensitive_data_scan_present === false &&
    input.write_command_permission === false &&
    input.execution_allowed_now === false;

  const targetOk =
    target.memory_delta_draft_ref === null &&
    target.daily_note_body_language === "zh_required_before_execution" &&
    target.sensitive_data_scan_ref === null &&
    target.blocker_decision === "blocked_missing_memory_delta_scan_targets_and_authorization" &&
    Array.isArray(allowedMemoryTargets) &&
    allowedMemoryTargets.length === 0 &&
    !allowedMemoryTargets.includes("DailyNote") &&
    !allowedMemoryTargets.includes("VCP memory") &&
    forbiddenMemoryTargets.includes("DailyNote") &&
    forbiddenMemoryTargets.includes("VCP memory") &&
    forbiddenMemoryTargets.includes(".env") &&
    forbiddenMemoryTargets.includes(".env.local") &&
    forbiddenMemoryTargets.includes("real VCPChat") &&
    forbiddenMemoryTargets.includes("real VCPToolBox");

  const requiredOk =
    required.includes("Jenn exact A5 DailyNote/VCP memory write authorization") &&
    required.includes("reviewed Chinese memory_delta draft ref") &&
    required.includes("DailyNote body language is Chinese") &&
    required.includes("sensitive data scan pass ref") &&
    required.includes("exact allowed DailyNote/VCP memory targets") &&
    required.includes("rollback plan") &&
    required.includes("reviewer") &&
    required.includes("stop conditions") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_v14_196_authorization_package_compiler_type_matrix.js") &&
    validationRequired.includes("node scripts/validate_agent_board_state.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.preflight_only === true &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.memory_delta_written_to_runtime === false &&
    guard.secret_or_private_path_included === false &&
    guard.image_binary_included === false &&
    guard.production_candidate_write_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false;

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

const fixture = core.parseJson(files.fixture).daily_note_vcp_memory_authorization_compiler_output_preflight;
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
addResult("daily_note_vcp_memory_authorization_preflight_evaluation_passes", baseEval.passed);

const memoryDeltaRefWithoutScan = clone(fixture);
memoryDeltaRefWithoutScan.target_scope.memory_delta_draft_ref = "drafts/memory_delta/example.md";
const dailyNoteWritePerformed = clone(fixture);
dailyNoteWritePerformed.guard.DailyNote_write_performed = true;
const vcpMemoryWritePerformed = clone(fixture);
vcpMemoryWritePerformed.guard.VCP_memory_write_performed = true;
const broadAllowedMemoryTarget = clone(fixture);
broadAllowedMemoryTarget.target_scope.exact_allowed_memory_targets.push("DailyNote");
const blockerMissing = clone(fixture);
blockerMissing.target_scope.blocker_decision = null;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const memoryDeltaRefWithoutScanEval = evaluate(memoryDeltaRefWithoutScan, sourceTypeMatrix);
const dailyNoteWritePerformedEval = evaluate(dailyNoteWritePerformed, sourceTypeMatrix);
const vcpMemoryWritePerformedEval = evaluate(vcpMemoryWritePerformed, sourceTypeMatrix);
const broadAllowedMemoryTargetEval = evaluate(broadAllowedMemoryTarget, sourceTypeMatrix);
const blockerMissingEval = evaluate(blockerMissing, sourceTypeMatrix);
const runtimeClaimEval = evaluate(runtimeClaim, sourceTypeMatrix);

addResult("negative_case_memory_delta_ref_without_scan_fails", memoryDeltaRefWithoutScanEval.passed === false && memoryDeltaRefWithoutScanEval.targetOk === false);
addResult("negative_case_daily_note_write_performed_fails", dailyNoteWritePerformedEval.passed === false && dailyNoteWritePerformedEval.noWrites === false);
addResult("negative_case_vcp_memory_write_performed_fails", vcpMemoryWritePerformedEval.passed === false && vcpMemoryWritePerformedEval.noWrites === false);
addResult("negative_case_broad_allowed_memory_target_fails", broadAllowedMemoryTargetEval.passed === false && broadAllowedMemoryTargetEval.targetOk === false);
addResult("negative_case_blocker_missing_fails", blockerMissingEval.passed === false && blockerMissingEval.targetOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "package_status: draft_blocked_missing_daily_note_vcp_memory_write_authorization",
  "daily_note_write_authorized: false",
  "vcp_memory_write_authorized: false",
  "write_command_permission: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight.js",
  "tests/schema_examples/v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight.example.json",
  "docs/v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight.md",
  "v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  package_type: fixture.package_type,
  package_id: fixture.package_id,
  package_status: fixture.package_status,
  daily_note_write_authorized: fixture.daily_note_write_authorized,
  vcp_memory_write_authorized: fixture.vcp_memory_write_authorized,
  memory_delta_draft_present: fixture.memory_delta_draft_present,
  sensitive_data_scan_present: fixture.sensitive_data_scan_present,
  write_command_permission: fixture.write_command_permission,
  execution_allowed_now: fixture.execution_allowed_now,
  exact_allowed_memory_target_count: fixture.target_scope.exact_allowed_memory_targets.length,
  required_before_execution_count: fixture.required_before_execution.length,
  validation_required_count: fixture.validation_required.length,
  preflight_only: fixture.guard.preflight_only,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  memory_delta_written_to_runtime: fixture.guard.memory_delta_written_to_runtime,
  secret_or_private_path_included: fixture.guard.secret_or_private_path_included,
  image_binary_included: fixture.guard.image_binary_included,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  durable_archive_copy_performed: fixture.guard.durable_archive_copy_performed,
  image_file_copy_performed: fixture.guard.image_file_copy_performed,
  runs_source_image_modified: fixture.guard.runs_source_image_modified,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  failure_samples_write_performed: fixture.guard.failure_samples_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  mcp_runtime_performed: fixture.guard.mcp_runtime_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: fixture.guard.push_tag_release_deploy_performed,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_memory_delta_ref_without_scan_fails:
    memoryDeltaRefWithoutScanEval.passed === false && memoryDeltaRefWithoutScanEval.targetOk === false,
  negative_case_daily_note_write_performed_fails:
    dailyNoteWritePerformedEval.passed === false && dailyNoteWritePerformedEval.noWrites === false,
  negative_case_vcp_memory_write_performed_fails:
    vcpMemoryWritePerformedEval.passed === false && vcpMemoryWritePerformedEval.noWrites === false,
  negative_case_broad_allowed_memory_target_fails:
    broadAllowedMemoryTargetEval.passed === false && broadAllowedMemoryTargetEval.targetOk === false,
  negative_case_blocker_missing_fails: blockerMissingEval.passed === false && blockerMissingEval.targetOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
