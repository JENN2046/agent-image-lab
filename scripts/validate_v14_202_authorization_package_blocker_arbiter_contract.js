#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_202_authorization_package_blocker_arbiter_contract.md",
  fixture: "tests/schema_examples/v14_202_authorization_package_blocker_arbiter_contract.example.json",
  sourceCoverageCloseout: "tests/schema_examples/v14_201_authorization_package_compiler_coverage_closeout.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expectedBlockers = {
  accepted_samples_metadata_registration: "blocked_missing_human_approval_or_exact_authorization",
  manifest_read: "blocked_missing_exact_manifest_read_authorization",
  durable_archive: "blocked_missing_archive_copy_authorization",
  production_candidate: "blocked_missing_production_candidate_authorization",
  daily_note_vcp_memory: "blocked_missing_daily_note_vcp_memory_write_authorization",
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

function evaluate(input, sourceCoverageCloseout) {
  const coverage = sourceCoverageCloseout.authorization_package_compiler_coverage_closeout || {};
  const coveredTypes = new Set((coverage.covered_packages || []).map((entry) => entry.package_type));
  const decisions = input.blocker_decisions || [];
  const decisionTypes = new Set(decisions.map((entry) => entry.package_type));
  const guard = input.guard || {};

  const sourceOk =
    input.source_coverage_closeout_ref === files.sourceCoverageCloseout &&
    coverage.coverage_status === "complete_local_blocked_coverage" &&
    coverage.package_type_count_covered === 5 &&
    coverage.guard &&
    coverage.guard.authorization_execution_performed === false;

  const packageOk =
    input.phase === "v14_202_authorization_package_blocker_arbiter_contract" &&
    input.execution_mode === "authorization_package_blocker_arbiter_contract_only" &&
    input.arbiter_status === "all_package_types_blocked_pending_exact_authorization" &&
    input.package_type_count === 5 &&
    input.all_execution_allowed_now === false &&
    decisions.length === 5 &&
    decisionTypes.size === 5 &&
    [...coveredTypes].every((type) => decisionTypes.has(type));

  const decisionsOk = decisions.every((entry) => {
    return (
      coveredTypes.has(entry.package_type) &&
      entry.blocker_code === expectedBlockers[entry.package_type] &&
      entry.execution_allowed_now === false &&
      entry.unblock_requires_jenn_exact_authorization === true &&
      entry.exact_scope_required === true &&
      entry.rollback_required === true &&
      entry.reviewer_required === true &&
      entry.stop_conditions_required === true &&
      Array.isArray(entry.package_specific_required) &&
      entry.package_specific_required.length >= 3
    );
  });

  const validationOk =
    (input.validation_required || []).includes("git diff --check") &&
    (input.validation_required || []).includes("node scripts/validate_v14_201_authorization_package_compiler_coverage_closeout.js") &&
    (input.validation_required || []).includes("node scripts/validate_agent_board_state.js") &&
    (input.validation_required || []).includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noExecution =
    guard.blocker_arbiter_contract_only === true &&
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
    passed: sourceOk && packageOk && decisionsOk && validationOk && noExecution && noExternal && noRuntimeClaim,
    sourceOk,
    packageOk,
    decisionsOk,
    validationOk,
    noExecution,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).authorization_package_blocker_arbiter_contract;
const sourceCoverageCloseout = core.parseJson(files.sourceCoverageCloseout);
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

const baseEval = evaluate(fixture, sourceCoverageCloseout);
addResult("authorization_package_blocker_arbiter_contract_evaluation_passes", baseEval.passed);

const missingBlockerDecision = clone(fixture);
missingBlockerDecision.blocker_decisions = missingBlockerDecision.blocker_decisions.filter((entry) => entry.package_type !== "manifest_read");
const executionAllowedPackage = clone(fixture);
executionAllowedPackage.blocker_decisions[0].execution_allowed_now = true;
const unknownPackageType = clone(fixture);
unknownPackageType.blocker_decisions[1].package_type = "unknown_package";
const missingExactScope = clone(fixture);
missingExactScope.blocker_decisions[2].exact_scope_required = false;
const memoryWriteFlag = clone(fixture);
memoryWriteFlag.guard.VCP_memory_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingBlockerDecisionEval = evaluate(missingBlockerDecision, sourceCoverageCloseout);
const executionAllowedPackageEval = evaluate(executionAllowedPackage, sourceCoverageCloseout);
const unknownPackageTypeEval = evaluate(unknownPackageType, sourceCoverageCloseout);
const missingExactScopeEval = evaluate(missingExactScope, sourceCoverageCloseout);
const memoryWriteFlagEval = evaluate(memoryWriteFlag, sourceCoverageCloseout);
const runtimeClaimEval = evaluate(runtimeClaim, sourceCoverageCloseout);

addResult("negative_case_missing_blocker_decision_fails", missingBlockerDecisionEval.passed === false && missingBlockerDecisionEval.packageOk === false);
addResult("negative_case_execution_allowed_package_fails", executionAllowedPackageEval.passed === false && executionAllowedPackageEval.decisionsOk === false);
addResult("negative_case_unknown_package_type_fails", unknownPackageTypeEval.passed === false && unknownPackageTypeEval.packageOk === false && unknownPackageTypeEval.decisionsOk === false);
addResult("negative_case_missing_exact_scope_requirement_fails", missingExactScopeEval.passed === false && missingExactScopeEval.decisionsOk === false);
addResult("negative_case_memory_write_flag_fails", memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noExecution === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "arbiter_status: all_package_types_blocked_pending_exact_authorization",
  "package_type_count: 5",
  "all_execution_allowed_now: false",
  "authorization_execution_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_202_authorization_package_blocker_arbiter_contract.js",
  "tests/schema_examples/v14_202_authorization_package_blocker_arbiter_contract.example.json",
  "docs/v14_202_authorization_package_blocker_arbiter_contract.md",
  "v14_202_authorization_package_blocker_arbiter_contract",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_202_authorization_package_blocker_arbiter_contract",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  arbiter_status: fixture.arbiter_status,
  package_type_count: fixture.package_type_count,
  all_execution_allowed_now: fixture.all_execution_allowed_now,
  blocker_decision_count: fixture.blocker_decisions.length,
  validation_required_count: fixture.validation_required.length,
  blocker_arbiter_contract_only: fixture.guard.blocker_arbiter_contract_only,
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
  negative_case_missing_blocker_decision_fails:
    missingBlockerDecisionEval.passed === false && missingBlockerDecisionEval.packageOk === false,
  negative_case_execution_allowed_package_fails:
    executionAllowedPackageEval.passed === false && executionAllowedPackageEval.decisionsOk === false,
  negative_case_unknown_package_type_fails:
    unknownPackageTypeEval.passed === false && unknownPackageTypeEval.packageOk === false && unknownPackageTypeEval.decisionsOk === false,
  negative_case_missing_exact_scope_requirement_fails:
    missingExactScopeEval.passed === false && missingExactScopeEval.decisionsOk === false,
  negative_case_memory_write_flag_fails: memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noExecution === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
