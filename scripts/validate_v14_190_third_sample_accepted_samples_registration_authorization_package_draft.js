#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.md",
  fixture: "tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json",
  readiness: "tests/schema_examples/v14_188_review_console_third_sample_acceptance_readiness.example.json",
  blockerPreflight: "tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_190_third_sample_accepted_samples_registration_authorization_package_draft",
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

function evaluate(input, readinessFixture, blockerFixture) {
  const readiness = readinessFixture.review_console_third_sample_acceptance_readiness;
  const blocker = blockerFixture.lamp_v3_accepted_samples_registration_blocker_preflight;
  const target = input.target || {};
  const scope = input.draft_scope || {};
  const guard = input.guard || {};
  const allowedFiles = scope.would_modify_files || [];
  const forbiddenPaths = scope.forbidden_paths || [];
  const validationRequired = scope.validation_required || [];
  const exactStatement = input.exact_approval_statement_draft || "";
  const blockerStillPending = blocker.eligibility.accepted_samples_registration_eligible === false;
  const blockerClearedByLaterApproval =
    blocker.eligibility.human_approval_present === true &&
    blocker.eligibility.accepted_samples_registration_eligible === true &&
    blocker.eligibility.registration_blocker === null;

  const targetOk =
    input.phase === expected.phase &&
    input.execution_mode === "authorization_package_draft_only" &&
    input.authorization_package_status === expected.status &&
    input.authorization_granted_by_this_record === false &&
    input.execution_ready === false &&
    input.blocker === expected.blocker &&
    target.sample_id === expected.sampleId &&
    target.sample_id === readiness.target_sample_id &&
    target.sample_id === blocker.proposed_registration_if_approved_later.sample_id &&
    target.candidate_id === expected.candidateId &&
    target.candidate_id === readiness.target_candidate_id &&
    target.import_record_ref === blocker.source.import_record_ref &&
    target.review_record_ref === blocker.source.review_record_ref &&
    target.artifact_ref === blocker.source.artifact_ref &&
    target.verified_sha256 === blocker.source.artifact_sha256 &&
    target.verified_dimensions === blocker.source.artifact_dimensions &&
    target.verified_mime === blocker.source.artifact_mime &&
    target.human_approval_status === "pending" &&
    target.approved_by === null &&
    target.registration_ready === false &&
    readiness.registration_ready === false &&
    (blockerStillPending || blockerClearedByLaterApproval);

  const exactStatementOk =
    exactStatement.includes("AUTH-PENDING-LAMP-V14-166-ACCEPTED-SAMPLES-REGISTRATION-20260518-001") &&
    exactStatement.includes(expected.sampleId) &&
    exactStatement.includes("允许仅修改 accepted_samples/accepted_sample_registry.yaml 和 accepted_samples/categories/product_still_life.yaml") &&
    exactStatement.includes("不允许复制或提交图片文件") &&
    exactStatement.includes("不允许写 production_candidate") &&
    exactStatement.includes("不允许写 DailyNote") &&
    exactStatement.includes("不允许写 VCP memory") &&
    exactStatement.includes("不允许 provider/API/plugin/MCP 调用") &&
    exactStatement.includes("审批人 Jenn");

  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/product_still_life.yaml") &&
    forbiddenPaths.includes("runs/real_generation/") &&
    forbiddenPaths.includes("production_candidate/") &&
    forbiddenPaths.includes("failure_samples/") &&
    forbiddenPaths.includes(".env.local") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_agent_board_state.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.draft_only === true &&
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
    passed: targetOk && exactStatementOk && scopeOk && noWrites && noExternal && noRuntimeClaim,
    targetOk,
    exactStatementOk,
    scopeOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const fixture = core.parseJson(files.fixture).third_sample_accepted_samples_registration_authorization_package_draft;
const readinessFixture = core.parseJson(files.readiness);
const blockerFixture = core.parseJson(files.blockerPreflight);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const baseEval = evaluate(fixture, readinessFixture, blockerFixture);
addResult("authorization_package_draft_evaluation_passes", baseEval.passed);

const grantedPackage = clone(fixture);
grantedPackage.authorization_granted_by_this_record = true;
grantedPackage.authorization_package_status = "granted";
const executionReady = clone(fixture);
executionReady.execution_ready = true;
executionReady.target.registration_ready = true;
const missingStatement = clone(fixture);
missingStatement.exact_approval_statement_draft = "";
const broadWriteScope = clone(fixture);
broadWriteScope.draft_scope.would_modify_files.push("accepted_samples/");
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const grantedPackageEval = evaluate(grantedPackage, readinessFixture, blockerFixture);
const executionReadyEval = evaluate(executionReady, readinessFixture, blockerFixture);
const missingStatementEval = evaluate(missingStatement, readinessFixture, blockerFixture);
const broadWriteScopeEval = evaluate(broadWriteScope, readinessFixture, blockerFixture);
const acceptedWriteEval = evaluate(acceptedWrite, readinessFixture, blockerFixture);
const runtimeClaimEval = evaluate(runtimeClaim, readinessFixture, blockerFixture);

addResult("negative_case_granted_package_fails", grantedPackageEval.passed === false && grantedPackageEval.targetOk === false);
addResult("negative_case_execution_ready_without_approval_fails", executionReadyEval.passed === false && executionReadyEval.targetOk === false);
addResult("negative_case_missing_exact_statement_fails", missingStatementEval.passed === false && missingStatementEval.exactStatementOk === false);
addResult("negative_case_broad_write_scope_fails", broadWriteScopeEval.passed === false && broadWriteScopeEval.scopeOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "authorization_package_status: prepared_blocked_not_granted",
  "authorization_granted_by_this_record: false",
  "execution_ready: false",
  "accepted_samples_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_190_third_sample_accepted_samples_registration_authorization_package_draft.js",
  "tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json",
  "docs/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.md",
  "v14_190_third_sample_accepted_samples_registration_authorization_package_draft",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_190_third_sample_accepted_samples_registration_authorization_package_draft",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  authorization_package_status: fixture.authorization_package_status,
  authorization_granted_by_this_record: fixture.authorization_granted_by_this_record,
  execution_ready: fixture.execution_ready,
  blocker: fixture.blocker,
  target_sample_id: fixture.target.sample_id,
  target_candidate_id: fixture.target.candidate_id,
  human_approval_status: fixture.target.human_approval_status,
  approved_by: fixture.target.approved_by,
  registration_ready: fixture.target.registration_ready,
  allowed_file_count: fixture.draft_scope.would_modify_files.length,
  validation_command_count: fixture.draft_scope.validation_required.length,
  draft_only: fixture.guard.draft_only,
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
  negative_case_granted_package_fails: grantedPackageEval.passed === false && grantedPackageEval.targetOk === false,
  negative_case_execution_ready_without_approval_fails: executionReadyEval.passed === false && executionReadyEval.targetOk === false,
  negative_case_missing_exact_statement_fails: missingStatementEval.passed === false && missingStatementEval.exactStatementOk === false,
  negative_case_broad_write_scope_fails: broadWriteScopeEval.passed === false && broadWriteScopeEval.scopeOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
