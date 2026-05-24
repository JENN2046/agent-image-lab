#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_48_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_RECEIPT_CONTRACT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_48_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract.json",
  contract: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_receipt_contract.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract_fail.example.json",
  payloadRefreshReport: "reports/visual_asset_eval_dry_run/v0_6_47_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.json",
  payloadRefreshPackage: "reports/memory_write_payloads/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_payload_refresh_package.json",
  executionPreflight: "reports/visual_asset_eval_dry_run/v0_6_46_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.json",
  authorizationDraft: "reports/visual_asset_eval_dry_run/v0_6_45_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.json",
  exactAllowedTargetsPackage: "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expectedTargets = {
  dailyNote: "exact_new_trial_003_shot_2_daily_note_review_learning_entry",
  vcpMemory: "exact_new_trial_003_shot_2_vcp_memory_review_learning_summary"
};

const expected = {
  phase: "v0_6_48_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract",
  contractStatus: "prepared_blocked_not_executed",
  blocker: "missing_human_approval_accepted_sample_registration_archive_completion_production_candidate_authorization_and_exact_daily_note_vcp_memory_write_grant",
  authorizationId: "AUTH-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  receiptContractId: "RCPT-CONTRACT-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  reviewer: "Jenn",
  futureReceiptPath: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_receipt.json",
  futureRegistryPath: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_registry.json",
  futureBridgeRef: "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2_memory_write",
  recommendedNext: "prepare_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract_with_receipt_contract_preserved"
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoRawLocalDrivePath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawLocalDrivePath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawLocalDrivePath(item, `${context}.${key}`));
  }
}

function evaluate(reportRecord, contractRecord) {
  const payloadRefreshReport = readJson(files.payloadRefreshReport).exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package;
  const payloadRefreshPackage = readJson(files.payloadRefreshPackage).daily_note_vcp_memory_write_payload_refresh_package;
  const executionPreflight = readJson(files.executionPreflight).exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight;
  const authorizationDraft = readJson(files.authorizationDraft).exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft;
  const exactAllowedTargets = readJson(files.exactAllowedTargetsPackage).exact_allowed_memory_targets_package;

  return (
    reportRecord.phase === expected.phase &&
    reportRecord.execution_mode === "daily_note_vcp_memory_write_receipt_contract_only" &&
    reportRecord.receipt_contract_ref === files.contract &&
    reportRecord.receipt_contract_status === expected.contractStatus &&
    reportRecord.blocker === expected.blocker &&
    reportRecord.target.sample_id === expected.sampleId &&
    reportRecord.target.candidate_id === expected.candidateId &&
    reportRecord.target.category === expected.category &&
    reportRecord.target.reviewer === expected.reviewer &&
    reportRecord.target.authorization_id === expected.authorizationId &&
    reportRecord.target.accepted_sample_registration_completed === false &&
    reportRecord.target.durable_archive_ready === false &&
    reportRecord.target.production_candidate_ready === false &&
    reportRecord.target.daily_note_write_authorized === false &&
    reportRecord.target.vcp_memory_write_authorized === false &&
    reportRecord.target.write_command_permission === false &&
    reportRecord.target.execution_ready === false &&
    reportRecord.target.execution_allowed_now === false &&
    reportRecord.contract_identity.receipt_contract_id === expected.receiptContractId &&
    reportRecord.contract_identity.future_local_receipt_path === expected.futureReceiptPath &&
    reportRecord.contract_identity.future_local_registry_path === expected.futureRegistryPath &&
    reportRecord.contract_identity.future_review_bridge_ref === expected.futureBridgeRef &&
    reportRecord.contract_identity.receipt_created_now === false &&
    reportRecord.contract_identity.registry_created_now === false &&
    reportRecord.contract_identity.bridge_created_now === false &&
    reportRecord.contract_scope.daily_note_target_id === expectedTargets.dailyNote &&
    reportRecord.contract_scope.vcp_memory_target_id === expectedTargets.vcpMemory &&
    reportRecord.contract_scope.exact_operations_count === 2 &&
    reportRecord.contract_scope.daily_note_write_must_precede_vcp_memory_write === true &&
    reportRecord.contract_scope.payload_refresh_ref_present === true &&
    reportRecord.contract_scope.payload_refresh_status_verified === true &&
    reportRecord.contract_scope.contract_requires_success_receipt_and_registry === true &&
    reportRecord.guard.receipt_contract_only === true &&
    reportRecord.guard.receipt_created_now === false &&
    reportRecord.guard.registry_created_now === false &&
    reportRecord.guard.bridge_created_now === false &&
    reportRecord.guard.authorization_granted_by_this_contract === false &&
    reportRecord.guard.execution_ready === false &&
    reportRecord.guard.execution_allowed_now === false &&
    reportRecord.guard.DailyNote_write_performed === false &&
    reportRecord.guard.VCP_memory_write_performed === false &&
    reportRecord.guard.accepted_samples_write_performed === false &&
    reportRecord.guard.archive_write_performed === false &&
    reportRecord.guard.production_candidate_write_performed === false &&
    reportRecord.guard.provider_contact_performed === false &&
    reportRecord.guard.plugin_call_performed === false &&
    reportRecord.guard.api_call_performed === false &&
    reportRecord.guard.mcp_runtime_performed === false &&
    reportRecord.guard.image_generation_performed === false &&
    reportRecord.guard.staging_performed === false &&
    reportRecord.guard.commit_performed === false &&
    reportRecord.guard.push_tag_release_deploy_performed === false &&
    reportRecord.guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    reportRecord.guard.vcp_runtime_integration_proven === false &&
    reportRecord.recommended_next === expected.recommendedNext &&
    contractRecord.report_version === 1 &&
    contractRecord.contract_type === "daily_note_vcp_memory_write_receipt_contract" &&
    contractRecord.phase === expected.phase &&
    contractRecord.contract_status === expected.contractStatus &&
    contractRecord.target_sample_id === expected.sampleId &&
    contractRecord.target_candidate_id === expected.candidateId &&
    contractRecord.category === expected.category &&
    contractRecord.reviewer === expected.reviewer &&
    contractRecord.authorization_id === expected.authorizationId &&
    contractRecord.source_refs.payload_refresh_report === files.payloadRefreshReport &&
    contractRecord.source_refs.payload_refresh_package === files.payloadRefreshPackage &&
    contractRecord.source_refs.memory_write_execution_preflight === files.executionPreflight &&
    contractRecord.source_refs.memory_write_authorization_package_draft === files.authorizationDraft &&
    contractRecord.source_refs.exact_allowed_targets_package === files.exactAllowedTargetsPackage &&
    contractRecord.receipt_identity.receipt_contract_id === expected.receiptContractId &&
    contractRecord.receipt_identity.future_local_receipt_path === expected.futureReceiptPath &&
    contractRecord.receipt_identity.future_local_registry_path === expected.futureRegistryPath &&
    contractRecord.receipt_identity.future_review_bridge_ref === expected.futureBridgeRef &&
    contractRecord.receipt_identity.receipt_created_now === false &&
    contractRecord.receipt_identity.registry_created_now === false &&
    contractRecord.receipt_identity.bridge_created_now === false &&
    contractRecord.exact_operation_contract.daily_note_target_id === expectedTargets.dailyNote &&
    contractRecord.exact_operation_contract.vcp_memory_target_id === expectedTargets.vcpMemory &&
    contractRecord.exact_operation_contract.exact_operations_count === 2 &&
    contractRecord.exact_operation_contract.daily_note_write_must_precede_vcp_memory_write === true &&
    contractRecord.exact_operation_contract.requires_daily_note_success_before_vcp_memory === true &&
    contractRecord.exact_operation_contract.payload_refresh_package_ref_must_match === files.payloadRefreshPackage &&
    contractRecord.exact_operation_contract.payload_refresh_status_must_match === "refreshed_blocked_not_executable" &&
    contractRecord.future_success_receipt_requirements.receipt_status === "succeeded_daily_note_and_vcp_memory_write" &&
    contractRecord.future_success_receipt_requirements.daily_note_write_performed === true &&
    contractRecord.future_success_receipt_requirements.daily_note_write_succeeded === true &&
    contractRecord.future_success_receipt_requirements.vcp_memory_write_performed === true &&
    contractRecord.future_success_receipt_requirements.vcp_memory_write_succeeded === true &&
    contractRecord.future_success_receipt_requirements.exact_operations_executed_count === 2 &&
    contractRecord.future_success_receipt_requirements.secret_value_read_performed === false &&
    contractRecord.future_success_receipt_requirements.push_performed === false &&
    contractRecord.future_success_receipt_requirements.runtime_probe_performed === false &&
    contractRecord.future_partial_failure_rules.if_daily_note_write_fails_then_vcp_memory_must_not_run === true &&
    contractRecord.future_partial_failure_rules.if_vcp_memory_write_fails_then_receipt_status_must_not_claim_full_success === true &&
    contractRecord.future_partial_failure_rules.authorization_id_must_match === true &&
    contractRecord.future_partial_failure_rules.target_ids_must_match === true &&
    contractRecord.future_partial_failure_rules.payload_refresh_package_ref_must_match === true &&
    contractRecord.required_blockers.includes("human_approval_missing") &&
    contractRecord.required_blockers.includes("accepted_sample_registration_missing") &&
    contractRecord.required_blockers.includes("durable_archive_completion_missing") &&
    contractRecord.required_blockers.includes("production_candidate_authorization_missing") &&
    contractRecord.required_blockers.includes("explicit_daily_note_write_authorization_missing") &&
    contractRecord.required_blockers.includes("explicit_vcp_memory_write_authorization_missing") &&
    contractRecord.required_blockers.includes("write_command_permission_missing") &&
    contractRecord.execution_state.authorization_granted_by_this_contract === false &&
    contractRecord.execution_state.execution_ready === false &&
    contractRecord.execution_state.execution_allowed_now === false &&
    contractRecord.execution_state.receipt_created_now === false &&
    contractRecord.execution_state.registry_created_now === false &&
    contractRecord.execution_state.bridge_created_now === false &&
    contractRecord.execution_state.DailyNote_write_performed === false &&
    contractRecord.execution_state.VCP_memory_write_performed === false &&
    contractRecord.execution_state.accepted_samples_write_performed === false &&
    contractRecord.execution_state.archive_write_performed === false &&
    contractRecord.execution_state.production_candidate_write_performed === false &&
    contractRecord.execution_state.provider_contact_performed === false &&
    contractRecord.execution_state.plugin_call_performed === false &&
    contractRecord.execution_state.api_call_performed === false &&
    contractRecord.execution_state.mcp_runtime_performed === false &&
    contractRecord.execution_state.image_generation_performed === false &&
    contractRecord.execution_state.push_tag_release_deploy_performed === false &&
    contractRecord.execution_state.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    contractRecord.execution_state.vcp_runtime_integration_proven === false &&
    payloadRefreshReport.payload_refresh_status === "refreshed_blocked_not_executable" &&
    payloadRefreshReport.refreshed_payload.daily_note_target_id === expectedTargets.dailyNote &&
    payloadRefreshReport.refreshed_payload.vcp_memory_target_id === expectedTargets.vcpMemory &&
    payloadRefreshPackage.daily_note_payload.target_id === expectedTargets.dailyNote &&
    payloadRefreshPackage.vcp_memory_payload.target_id === expectedTargets.vcpMemory &&
    executionPreflight.preflight_status === "blocked" &&
    executionPreflight.target.execution_allowed_now === false &&
    authorizationDraft.authorization_package_status === "prepared_blocked_not_granted" &&
    exactAllowedTargets.exact_allowed_memory_targets[0].target_id === expectedTargets.dailyNote &&
    exactAllowedTargets.exact_allowed_memory_targets[1].target_id === expectedTargets.vcpMemory
  );
}

function validateRecord(reportRecord, contractRecord, context) {
  assert(reportRecord && typeof reportRecord === "object", `${context} report missing`);
  assert(contractRecord && typeof contractRecord === "object", `${context} contract missing`);
  assertNoRawLocalDrivePath(reportRecord, `${context}.report`);
  assertNoRawLocalDrivePath(contractRecord, `${context}.contract`);
  assert(evaluate(reportRecord, contractRecord), `${context} evaluation failed`);
}

function expectFailure(baseReport, baseContract, caseId, mutate) {
  const candidateReport = clone(baseReport);
  const candidateContract = clone(baseContract);
  mutate(candidateReport, candidateContract);
  try {
    validateRecord(candidateReport, candidateContract, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract;
  const contract = readJson(files.contract).daily_note_vcp_memory_write_receipt_contract;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    `receipt_contract_id: ${expected.receiptContractId}`,
    `future_local_receipt_path: ${expected.futureReceiptPath}`,
    `future_local_registry_path: ${expected.futureRegistryPath}`,
    "receipt_contract_status: prepared_blocked_not_executed",
    "daily_note_write_must_precede_vcp_memory_write: true",
    "receipt_created_now: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract.js"),
    "validate_mvp missing exact memory-write receipt contract validator"
  );

  validateRecord(report, contract, "report");
  validateRecord(passFixture, contract, "pass_fixture");

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, contract, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, contract, "receipt_status_success_overclaim_fails", (candidateReport, candidateContract) => {
      candidateContract.future_success_receipt_requirements.receipt_status = "succeeded_now";
    }),
    expectFailure(passFixture, contract, "daily_note_target_drift_fails", (candidateReport, candidateContract) => {
      candidateReport.contract_scope.daily_note_target_id = "wrong_target";
      candidateContract.exact_operation_contract.daily_note_target_id = "wrong_target";
    }),
    expectFailure(passFixture, contract, "receipt_path_drift_fails", (candidateReport, candidateContract) => {
      candidateReport.contract_identity.future_local_receipt_path = "reports/memory_write_receipts/wrong_receipt.json";
      candidateContract.receipt_identity.future_local_receipt_path = "reports/memory_write_receipts/wrong_receipt.json";
    }),
    expectFailure(passFixture, contract, "registry_path_drift_fails", (candidateReport, candidateContract) => {
      candidateReport.contract_identity.future_local_registry_path = "reports/memory_write_receipts/wrong_registry.json";
      candidateContract.receipt_identity.future_local_registry_path = "reports/memory_write_receipts/wrong_registry.json";
    }),
    expectFailure(passFixture, contract, "execution_allowed_now_true_fails", (candidateReport, candidateContract) => {
      candidateReport.target.execution_allowed_now = true;
      candidateReport.guard.execution_allowed_now = true;
      candidateContract.execution_state.execution_allowed_now = true;
    }),
    expectFailure(passFixture, contract, "broad_scope_claim_fails", (candidateReport, candidateContract) => {
      candidateReport.contract_scope.exact_operations_count = 3;
      candidateContract.exact_operation_contract.exact_operations_count = 3;
    }),
    expectFailure(passFixture, contract, "runtime_claim_fails", (candidateReport, candidateContract) => {
      candidateReport.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
      candidateReport.guard.vcp_runtime_integration_proven = true;
      candidateContract.execution_state.artifact_recoverability_is_not_vcp_runtime_integration = false;
      candidateContract.execution_state.vcp_runtime_integration_proven = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    receipt_contract_status: report.receipt_contract_status,
    receipt_contract_id: report.contract_identity.receipt_contract_id,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    future_local_receipt_path: report.contract_identity.future_local_receipt_path,
    future_local_registry_path: report.contract_identity.future_local_registry_path,
    exact_operations_count: report.contract_scope.exact_operations_count,
    execution_allowed_now: report.target.execution_allowed_now,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught")
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
