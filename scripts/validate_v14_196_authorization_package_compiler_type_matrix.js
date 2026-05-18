#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_196_authorization_package_compiler_type_matrix.md",
  fixture: "tests/schema_examples/v14_196_authorization_package_compiler_type_matrix.example.json",
  sourceCompilerContract: "tests/schema_examples/v14_195_authorization_package_compiler_contract_accepted_samples_registration.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expectedTypes = [
  "accepted_samples_metadata_registration",
  "manifest_read",
  "durable_archive",
  "production_candidate",
  "daily_note_vcp_memory",
];

const expectedBlockers = new Map([
  ["accepted_samples_metadata_registration", "missing_human_approval_or_exact_authorization"],
  ["manifest_read", "missing_real_manifest_read_authorization"],
  ["durable_archive", "missing_archive_copy_authorization"],
  ["production_candidate", "missing_production_candidate_authorization"],
  ["daily_note_vcp_memory", "missing_daily_note_vcp_memory_write_authorization"],
]);

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

function evaluate(input, sourceCompilerContract) {
  const packageTypes = input.package_types || [];
  const guard = input.guard || {};
  const sharedRequired = input.shared_required_fields || [];
  const validationRequired = input.validation_required || [];
  const source = sourceCompilerContract.authorization_package_compiler_contract_accepted_samples_registration || {};
  const typeNames = packageTypes.map((entry) => entry.package_type);
  const acceptedSamplesType = packageTypes.find((entry) => entry.package_type === "accepted_samples_metadata_registration") || {};
  const manifestReadType = packageTypes.find((entry) => entry.package_type === "manifest_read") || {};
  const memoryType = packageTypes.find((entry) => entry.package_type === "daily_note_vcp_memory") || {};

  const matrixOk =
    input.phase === "v14_196_authorization_package_compiler_type_matrix" &&
    input.execution_mode === "authorization_package_compiler_type_matrix_only" &&
    input.source_compiler_contract_ref === files.sourceCompilerContract &&
    input.compiler_matrix_status === "local_contract_ready_execution_blocked" &&
    input.execution_allowed_now === false &&
    packageTypes.length === expectedTypes.length &&
    expectedTypes.every((type) => typeNames.includes(type)) &&
    source.phase === "v14_195_authorization_package_compiler_contract_accepted_samples_registration" &&
    source.compiler_status === "contract_ready_execution_blocked";

  const blockersOk = packageTypes.every(
    (entry) =>
      expectedBlockers.get(entry.package_type) === entry.default_blocker &&
      entry.default_execution_allowed === false &&
      Array.isArray(entry.required_fields) &&
      entry.required_fields.includes("package_id") &&
      Array.isArray(entry.forbidden_operations) &&
      entry.forbidden_operations.length >= 5
  );

  const sharedOk = [
    "package_id",
    "package_type",
    "target_scope",
    "exact_allowed_paths",
    "forbidden_paths",
    "allowed_operations",
    "forbidden_operations",
    "validation_required",
    "rollback_plan",
    "reviewer",
    "stop_conditions",
  ].every((field) => sharedRequired.includes(field));

  const typeSpecificOk =
    acceptedSamplesType.minimum_authorization_level === "A4.8_exact_metadata_write_authorization" &&
    acceptedSamplesType.required_fields.includes("human_approval") &&
    acceptedSamplesType.forbidden_operations.includes("read_real_manifest_or_VCPChat_or_VCPToolBox") &&
    manifestReadType.minimum_authorization_level === "A5_exact_manifest_read_authorization" &&
    manifestReadType.required_fields.includes("exact_allowed_read_paths") &&
    manifestReadType.forbidden_operations.includes("write_files") &&
    memoryType.minimum_authorization_level === "A5_exact_memory_write_authorization" &&
    memoryType.required_fields.includes("daily_note_body_language") &&
    memoryType.forbidden_operations.includes("write_without_memory_approval");

  const validationOk =
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_v14_195_authorization_package_compiler_contract_accepted_samples_registration.js") &&
    validationRequired.includes("node scripts/validate_agent_board_state.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.type_matrix_only === true &&
    guard.authorization_execution_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.manifest_read_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: matrixOk && blockersOk && sharedOk && typeSpecificOk && validationOk && noWrites && noExternal && noRuntimeClaim,
    matrixOk,
    blockersOk,
    sharedOk,
    typeSpecificOk,
    validationOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).authorization_package_compiler_type_matrix;
const sourceCompilerContract = core.parseJson(files.sourceCompilerContract);
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

const baseEval = evaluate(fixture, sourceCompilerContract);
addResult("authorization_package_compiler_type_matrix_evaluation_passes", baseEval.passed);

const missingPackageType = clone(fixture);
missingPackageType.package_types = missingPackageType.package_types.filter((entry) => entry.package_type !== "manifest_read");
const directExecutionAllowed = clone(fixture);
directExecutionAllowed.execution_allowed_now = true;
directExecutionAllowed.guard.authorization_execution_performed = true;
const acceptedSamplesBroadScope = clone(fixture);
acceptedSamplesBroadScope.package_types.find((entry) => entry.package_type === "accepted_samples_metadata_registration").forbidden_operations =
  acceptedSamplesBroadScope.package_types.find((entry) => entry.package_type === "accepted_samples_metadata_registration").forbidden_operations.filter(
    (operation) => operation !== "read_real_manifest_or_VCPChat_or_VCPToolBox"
  );
const manifestReadExecutionAllowed = clone(fixture);
manifestReadExecutionAllowed.package_types.find((entry) => entry.package_type === "manifest_read").default_execution_allowed = true;
const memoryWriteWithoutBlocker = clone(fixture);
memoryWriteWithoutBlocker.package_types.find((entry) => entry.package_type === "daily_note_vcp_memory").default_blocker = "none";
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingPackageTypeEval = evaluate(missingPackageType, sourceCompilerContract);
const directExecutionAllowedEval = evaluate(directExecutionAllowed, sourceCompilerContract);
const acceptedSamplesBroadScopeEval = evaluate(acceptedSamplesBroadScope, sourceCompilerContract);
const manifestReadExecutionAllowedEval = evaluate(manifestReadExecutionAllowed, sourceCompilerContract);
const memoryWriteWithoutBlockerEval = evaluate(memoryWriteWithoutBlocker, sourceCompilerContract);
const runtimeClaimEval = evaluate(runtimeClaim, sourceCompilerContract);

addResult("negative_case_missing_package_type_fails", missingPackageTypeEval.passed === false && missingPackageTypeEval.matrixOk === false);
addResult("negative_case_direct_execution_allowed_fails", directExecutionAllowedEval.passed === false && directExecutionAllowedEval.noWrites === false);
addResult("negative_case_accepted_samples_broad_scope_fails", acceptedSamplesBroadScopeEval.passed === false && acceptedSamplesBroadScopeEval.typeSpecificOk === false);
addResult("negative_case_manifest_read_execution_allowed_fails", manifestReadExecutionAllowedEval.passed === false && manifestReadExecutionAllowedEval.blockersOk === false);
addResult("negative_case_memory_write_without_blocker_fails", memoryWriteWithoutBlockerEval.passed === false && memoryWriteWithoutBlockerEval.blockersOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "compiler_matrix_status: local_contract_ready_execution_blocked",
  "execution_allowed_now: false",
  "accepted_samples_write_performed: false",
  "manifest_read_performed: false",
  "production_candidate_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_196_authorization_package_compiler_type_matrix.js",
  "tests/schema_examples/v14_196_authorization_package_compiler_type_matrix.example.json",
  "docs/v14_196_authorization_package_compiler_type_matrix.md",
  "v14_196_authorization_package_compiler_type_matrix",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const packageTypes = fixture.package_types || [];
const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_196_authorization_package_compiler_type_matrix",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  compiler_matrix_status: fixture.compiler_matrix_status,
  execution_allowed_now: fixture.execution_allowed_now,
  package_type_count: packageTypes.length,
  package_types: packageTypes.map((entry) => entry.package_type),
  shared_required_field_count: fixture.shared_required_fields.length,
  validation_required_count: fixture.validation_required.length,
  type_matrix_only: fixture.guard.type_matrix_only,
  authorization_execution_performed: false,
  accepted_samples_write_performed: false,
  manifest_read_performed: false,
  durable_archive_copy_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_package_type_fails: missingPackageTypeEval.passed === false && missingPackageTypeEval.matrixOk === false,
  negative_case_direct_execution_allowed_fails: directExecutionAllowedEval.passed === false && directExecutionAllowedEval.noWrites === false,
  negative_case_accepted_samples_broad_scope_fails: acceptedSamplesBroadScopeEval.passed === false && acceptedSamplesBroadScopeEval.typeSpecificOk === false,
  negative_case_manifest_read_execution_allowed_fails: manifestReadExecutionAllowedEval.passed === false && manifestReadExecutionAllowedEval.blockersOk === false,
  negative_case_memory_write_without_blocker_fails: memoryWriteWithoutBlockerEval.passed === false && memoryWriteWithoutBlockerEval.blockersOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
