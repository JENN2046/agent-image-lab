#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_201_authorization_package_compiler_coverage_closeout.md",
  fixture: "tests/schema_examples/v14_201_authorization_package_compiler_coverage_closeout.example.json",
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

function runValidator(relativePath) {
  const output = childProcess.execFileSync(process.execPath, [path.join(root, relativePath)], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function evaluate(input, sourceTypeMatrix, validatorSummariesByType) {
  const matrix = sourceTypeMatrix.authorization_package_compiler_type_matrix || {};
  const matrixTypes = (matrix.package_types || []).map((entry) => entry.package_type);
  const covered = input.covered_packages || [];
  const guard = input.guard || {};
  const coveredTypes = covered.map((entry) => entry.package_type);
  const uniqueCoveredTypes = new Set(coveredTypes);

  const packageCoverageOk =
    input.phase === "v14_201_authorization_package_compiler_coverage_closeout" &&
    input.execution_mode === "authorization_package_compiler_coverage_closeout_only" &&
    input.compiler_matrix_ref === files.sourceTypeMatrix &&
    input.coverage_status === "complete_local_blocked_coverage" &&
    input.package_type_count_expected === 5 &&
    input.package_type_count_covered === 5 &&
    matrix.compiler_matrix_status === "local_contract_ready_execution_blocked" &&
    matrix.execution_allowed_now === false &&
    matrixTypes.length === 5 &&
    covered.length === 5 &&
    uniqueCoveredTypes.size === 5 &&
    matrixTypes.every((type) => uniqueCoveredTypes.has(type));

  const entryCoverageOk = covered.every((entry) => {
    const summary = validatorSummariesByType[entry.package_type] || {};
    return (
      core.exists(entry.coverage_ref) &&
      core.exists(entry.validator_ref) &&
      entry.execution_allowed_now === false &&
      summary.passed === true &&
      summary.package_type === entry.package_type &&
      summary.execution_allowed_now === false &&
      summary[entry.blocked_status_field] === entry.blocked_status_value
    );
  });

  const validationOk =
    (input.validation_required || []).includes("node scripts/validate_v14_195_authorization_package_compiler_contract_accepted_samples_registration.js") &&
    (input.validation_required || []).includes("node scripts/validate_v14_196_authorization_package_compiler_type_matrix.js") &&
    (input.validation_required || []).includes("node scripts/validate_v14_200_daily_note_vcp_memory_authorization_compiler_output_preflight.js") &&
    (input.validation_required || []).includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noExecution =
    guard.coverage_closeout_only === true &&
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
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: packageCoverageOk && entryCoverageOk && validationOk && noExecution && noExternal && noRuntimeClaim,
    packageCoverageOk,
    entryCoverageOk,
    validationOk,
    noExecution,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).authorization_package_compiler_coverage_closeout;
const sourceTypeMatrix = core.parseJson(files.sourceTypeMatrix);
const validatorSummariesByType = {};

for (const entry of fixture.covered_packages || []) {
  try {
    validatorSummariesByType[entry.package_type] = runValidator(entry.validator_ref);
    addResult(`validator_${entry.package_type}_passes`, validatorSummariesByType[entry.package_type].passed === true, entry.validator_ref);
  } catch (error) {
    addResult(`validator_${entry.package_type}_passes`, false, `${entry.validator_ref}: ${error.message}`);
  }
}

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

const baseEval = evaluate(fixture, sourceTypeMatrix, validatorSummariesByType);
addResult("authorization_package_compiler_coverage_closeout_evaluation_passes", baseEval.passed);

const missingPackageCoverage = clone(fixture);
missingPackageCoverage.covered_packages = missingPackageCoverage.covered_packages.filter((entry) => entry.package_type !== "daily_note_vcp_memory");
missingPackageCoverage.package_type_count_covered = 4;
const executionAllowedPackage = clone(fixture);
executionAllowedPackage.covered_packages[0].execution_allowed_now = true;
const validatorMissing = clone(fixture);
validatorMissing.covered_packages[1].validator_ref = "scripts/missing_validator.js";
const wrongBlockedStatus = clone(fixture);
wrongBlockedStatus.covered_packages[2].blocked_status_value = "ready";
const memoryWriteFlag = clone(fixture);
memoryWriteFlag.guard.VCP_memory_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingPackageCoverageEval = evaluate(missingPackageCoverage, sourceTypeMatrix, validatorSummariesByType);
const executionAllowedPackageEval = evaluate(executionAllowedPackage, sourceTypeMatrix, validatorSummariesByType);
const validatorMissingEval = evaluate(validatorMissing, sourceTypeMatrix, validatorSummariesByType);
const wrongBlockedStatusEval = evaluate(wrongBlockedStatus, sourceTypeMatrix, validatorSummariesByType);
const memoryWriteFlagEval = evaluate(memoryWriteFlag, sourceTypeMatrix, validatorSummariesByType);
const runtimeClaimEval = evaluate(runtimeClaim, sourceTypeMatrix, validatorSummariesByType);

addResult("negative_case_missing_package_coverage_fails", missingPackageCoverageEval.passed === false && missingPackageCoverageEval.packageCoverageOk === false);
addResult("negative_case_execution_allowed_package_fails", executionAllowedPackageEval.passed === false && executionAllowedPackageEval.entryCoverageOk === false);
addResult("negative_case_validator_missing_fails", validatorMissingEval.passed === false && validatorMissingEval.entryCoverageOk === false);
addResult("negative_case_wrong_blocked_status_fails", wrongBlockedStatusEval.passed === false && wrongBlockedStatusEval.entryCoverageOk === false);
addResult("negative_case_memory_write_flag_fails", memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noExecution === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "coverage_status: complete_local_blocked_coverage",
  "package_type_count_expected: 5",
  "package_type_count_covered: 5",
  "authorization_execution_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_201_authorization_package_compiler_coverage_closeout.js",
  "tests/schema_examples/v14_201_authorization_package_compiler_coverage_closeout.example.json",
  "docs/v14_201_authorization_package_compiler_coverage_closeout.md",
  "v14_201_authorization_package_compiler_coverage_closeout",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_201_authorization_package_compiler_coverage_closeout",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  coverage_status: fixture.coverage_status,
  package_type_count_expected: fixture.package_type_count_expected,
  package_type_count_covered: fixture.package_type_count_covered,
  covered_package_types: fixture.covered_packages.map((entry) => entry.package_type),
  validator_pass_count: Object.values(validatorSummariesByType).filter((summary) => summary.passed === true).length,
  validation_required_count: fixture.validation_required.length,
  coverage_closeout_only: fixture.guard.coverage_closeout_only,
  authorization_execution_performed: fixture.guard.authorization_execution_performed,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  manifest_read_performed: fixture.guard.manifest_read_performed,
  durable_archive_copy_performed: fixture.guard.durable_archive_copy_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
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
  negative_case_missing_package_coverage_fails:
    missingPackageCoverageEval.passed === false && missingPackageCoverageEval.packageCoverageOk === false,
  negative_case_execution_allowed_package_fails:
    executionAllowedPackageEval.passed === false && executionAllowedPackageEval.entryCoverageOk === false,
  negative_case_validator_missing_fails:
    validatorMissingEval.passed === false && validatorMissingEval.entryCoverageOk === false,
  negative_case_wrong_blocked_status_fails:
    wrongBlockedStatusEval.passed === false && wrongBlockedStatusEval.entryCoverageOk === false,
  negative_case_memory_write_flag_fails: memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noExecution === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
