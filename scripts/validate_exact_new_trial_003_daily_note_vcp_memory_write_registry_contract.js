#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_49_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_REGISTRY_CONTRACT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_49_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract.json",
  contract: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_registry_contract.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_registry_contract.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_registry_contract_fail.example.json",
  receiptContractReport: "reports/visual_asset_eval_dry_run/v0_6_48_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract.json",
  receiptContract: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_receipt_contract.json",
  payloadRefreshReport: "reports/visual_asset_eval_dry_run/v0_6_47_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.json",
  payloadRefreshPackage: "reports/memory_write_payloads/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_payload_refresh_package.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expectedTargets = {
  dailyNote: "exact_new_trial_003_shot_2_daily_note_review_learning_entry",
  vcpMemory: "exact_new_trial_003_shot_2_vcp_memory_review_learning_summary"
};

const expected = {
  phase: "v0_6_49_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract",
  contractStatus: "prepared_blocked_not_executed",
  blocker: "missing_human_approval_accepted_sample_registration_archive_completion_production_candidate_authorization_and_exact_daily_note_vcp_memory_write_grant",
  authorizationId: "AUTH-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  receiptContractId: "RCPT-CONTRACT-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  registryContractId: "REGISTRY-CONTRACT-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  registryEntryId: "REGISTRY-ENTRY-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  reviewer: "Jenn",
  futureReceiptPath: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_receipt.json",
  futureRegistryPath: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_registry.json",
  futureBridgeRef: "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2_memory_write",
  recommendedNext: "prepare_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint_with_registry_contract_preserved"
};

const requiredRegistryKeys = [
  "registry_entry_id",
  "receipt_contract_id",
  "receipt_path",
  "authorization_id",
  "target_sample_id",
  "target_candidate_id",
  "daily_note_target_id",
  "vcp_memory_target_id",
  "receipt_status",
  "registry_status"
];

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

function assertRequiredKeys(keys, context) {
  assert(Array.isArray(keys), `${context} required keys must be an array`);
  assert(keys.length === requiredRegistryKeys.length, `${context} required key count mismatch`);
  assert(JSON.stringify(keys) === JSON.stringify(requiredRegistryKeys), `${context} required keys mismatch`);
}

function evaluate(reportRecord, contractRecord) {
  const receiptReport = readJson(files.receiptContractReport).exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract;
  const receiptContract = readJson(files.receiptContract).daily_note_vcp_memory_write_receipt_contract;
  const payloadRefreshReport = readJson(files.payloadRefreshReport).exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package;
  const payloadRefreshPackage = readJson(files.payloadRefreshPackage).daily_note_vcp_memory_write_payload_refresh_package;

  return (
    reportRecord.phase === expected.phase &&
    reportRecord.execution_mode === "daily_note_vcp_memory_write_registry_contract_only" &&
    reportRecord.registry_contract_ref === files.contract &&
    reportRecord.receipt_contract_ref === files.receiptContract &&
    reportRecord.registry_contract_status === expected.contractStatus &&
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
    reportRecord.contract_identity.registry_contract_id === expected.registryContractId &&
    reportRecord.contract_identity.registry_entry_id === expected.registryEntryId &&
    reportRecord.contract_identity.future_local_receipt_path === expected.futureReceiptPath &&
    reportRecord.contract_identity.future_local_registry_path === expected.futureRegistryPath &&
    reportRecord.contract_identity.future_review_bridge_ref === expected.futureBridgeRef &&
    reportRecord.contract_identity.registry_update_mode === "append_only_after_receipt" &&
    reportRecord.contract_identity.receipt_created_now === false &&
    reportRecord.contract_identity.registry_created_now === false &&
    reportRecord.contract_identity.registry_entry_created_now === false &&
    reportRecord.contract_identity.bridge_created_now === false &&
    reportRecord.contract_scope.daily_note_target_id === expectedTargets.dailyNote &&
    reportRecord.contract_scope.vcp_memory_target_id === expectedTargets.vcpMemory &&
    reportRecord.contract_scope.exact_operations_count === 2 &&
    reportRecord.contract_scope.daily_note_write_must_precede_vcp_memory_write === true &&
    reportRecord.contract_scope.receipt_contract_ref_present === true &&
    reportRecord.contract_scope.receipt_contract_status_verified === true &&
    reportRecord.contract_scope.contract_requires_receipt_before_registry_append === true &&
    reportRecord.contract_scope.registry_required_key_count === requiredRegistryKeys.length &&
    reportRecord.guard.registry_contract_only === true &&
    reportRecord.guard.receipt_created_now === false &&
    reportRecord.guard.registry_created_now === false &&
    reportRecord.guard.registry_entry_created_now === false &&
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
    contractRecord.contract_type === "daily_note_vcp_memory_write_registry_contract" &&
    contractRecord.phase === expected.phase &&
    contractRecord.contract_status === expected.contractStatus &&
    contractRecord.target_sample_id === expected.sampleId &&
    contractRecord.target_candidate_id === expected.candidateId &&
    contractRecord.category === expected.category &&
    contractRecord.reviewer === expected.reviewer &&
    contractRecord.authorization_id === expected.authorizationId &&
    contractRecord.source_refs.receipt_contract_report === files.receiptContractReport &&
    contractRecord.source_refs.receipt_contract === files.receiptContract &&
    contractRecord.source_refs.payload_refresh_report === files.payloadRefreshReport &&
    contractRecord.source_refs.payload_refresh_package === files.payloadRefreshPackage &&
    contractRecord.registry_identity.receipt_contract_id === expected.receiptContractId &&
    contractRecord.registry_identity.registry_contract_id === expected.registryContractId &&
    contractRecord.registry_identity.registry_entry_id === expected.registryEntryId &&
    contractRecord.registry_identity.future_local_receipt_path === expected.futureReceiptPath &&
    contractRecord.registry_identity.future_local_registry_path === expected.futureRegistryPath &&
    contractRecord.registry_identity.future_review_bridge_ref === expected.futureBridgeRef &&
    contractRecord.registry_identity.registry_update_mode === "append_only_after_receipt" &&
    contractRecord.registry_identity.receipt_created_now === false &&
    contractRecord.registry_identity.registry_created_now === false &&
    contractRecord.registry_identity.registry_entry_created_now === false &&
    contractRecord.registry_identity.bridge_created_now === false &&
    contractRecord.exact_operation_contract.daily_note_target_id === expectedTargets.dailyNote &&
    contractRecord.exact_operation_contract.vcp_memory_target_id === expectedTargets.vcpMemory &&
    contractRecord.exact_operation_contract.exact_operations_count === 2 &&
    contractRecord.exact_operation_contract.daily_note_write_must_precede_vcp_memory_write === true &&
    contractRecord.exact_operation_contract.receipt_must_exist_before_registry_append === true &&
    contractRecord.exact_operation_contract.receipt_contract_ref_must_match === files.receiptContract &&
    contractRecord.future_success_registry_requirements.receipt_exists_before_registry_append === true &&
    contractRecord.future_success_registry_requirements.receipt_status_allows_registry_append === true &&
    contractRecord.future_success_registry_requirements.registry_entry_must_link_receipt_path === true &&
    contractRecord.future_success_registry_requirements.registry_entry_must_link_review_bridge_ref === true &&
    contractRecord.future_success_registry_requirements.registry_entry_must_preserve_no_secret_state === true &&
    contractRecord.future_success_registry_requirements.secret_value_read_performed === false &&
    contractRecord.future_success_registry_requirements.push_performed === false &&
    contractRecord.future_success_registry_requirements.runtime_probe_performed === false &&
    contractRecord.future_partial_failure_rules.partial_receipt_may_be_indexed_only_as_partial_failure === true &&
    contractRecord.future_partial_failure_rules.failed_daily_note_receipt_must_not_claim_vcp_memory_success === true &&
    contractRecord.future_partial_failure_rules.registry_status_must_not_claim_full_success_without_two_successes === true &&
    contractRecord.future_partial_failure_rules.authorization_id_must_match === true &&
    contractRecord.future_partial_failure_rules.target_ids_must_match === true &&
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
    contractRecord.execution_state.registry_entry_created_now === false &&
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
    receiptReport.receipt_contract_status === "prepared_blocked_not_executed" &&
    receiptReport.contract_identity.receipt_contract_id === expected.receiptContractId &&
    receiptReport.contract_identity.future_local_registry_path === expected.futureRegistryPath &&
    receiptContract.receipt_identity.receipt_contract_id === expected.receiptContractId &&
    receiptContract.receipt_identity.future_local_registry_path === expected.futureRegistryPath &&
    payloadRefreshReport.payload_refresh_status === "refreshed_blocked_not_executable" &&
    payloadRefreshPackage.daily_note_payload.target_id === expectedTargets.dailyNote &&
    payloadRefreshPackage.vcp_memory_payload.target_id === expectedTargets.vcpMemory
  );
}

function validateRecord(reportRecord, contractRecord, context) {
  assert(reportRecord && typeof reportRecord === "object", `${context} report missing`);
  assert(contractRecord && typeof contractRecord === "object", `${context} contract missing`);
  assertNoRawLocalDrivePath(reportRecord, `${context}.report`);
  assertNoRawLocalDrivePath(contractRecord, `${context}.contract`);
  assertRequiredKeys(contractRecord.future_registry_entry_required_keys, `${context}.contract`);
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
  const report = readJson(files.report).exact_new_trial_003_daily_note_vcp_memory_write_registry_contract;
  const contract = readJson(files.contract).daily_note_vcp_memory_write_registry_contract;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_daily_note_vcp_memory_write_registry_contract;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_daily_note_vcp_memory_write_registry_contract;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    `receipt_contract_id: ${expected.receiptContractId}`,
    `registry_contract_id: ${expected.registryContractId}`,
    `registry_entry_id: ${expected.registryEntryId}`,
    `future_local_registry_path: ${expected.futureRegistryPath}`,
    "registry_contract_status: prepared_blocked_not_executed",
    "registry_update_mode: append_only_after_receipt",
    "registry_created_now: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract.js"),
    "validate_mvp missing exact memory-write registry contract validator"
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
    expectFailure(passFixture, contract, "registry_status_success_overclaim_fails", (candidateReport, candidateContract) => {
      candidateReport.registry_contract_status = "succeeded_now";
      candidateContract.contract_status = "succeeded_now";
    }),
    expectFailure(passFixture, contract, "receipt_contract_drift_fails", (candidateReport, candidateContract) => {
      candidateReport.receipt_contract_ref = "reports/memory_write_receipts/wrong_receipt_contract.json";
      candidateContract.exact_operation_contract.receipt_contract_ref_must_match = "reports/memory_write_receipts/wrong_receipt_contract.json";
    }),
    expectFailure(passFixture, contract, "registry_entry_id_drift_fails", (candidateReport, candidateContract) => {
      candidateReport.contract_identity.registry_entry_id = "wrong_registry_entry";
      candidateContract.registry_identity.registry_entry_id = "wrong_registry_entry";
    }),
    expectFailure(passFixture, contract, "registry_path_drift_fails", (candidateReport, candidateContract) => {
      candidateReport.contract_identity.future_local_registry_path = "reports/memory_write_receipts/wrong_registry.json";
      candidateContract.registry_identity.future_local_registry_path = "reports/memory_write_receipts/wrong_registry.json";
    }),
    expectFailure(passFixture, contract, "execution_allowed_now_true_fails", (candidateReport, candidateContract) => {
      candidateReport.target.execution_allowed_now = true;
      candidateReport.guard.execution_allowed_now = true;
      candidateContract.execution_state.execution_allowed_now = true;
    }),
    expectFailure(passFixture, contract, "missing_required_key_fails", (candidateReport, candidateContract) => {
      candidateReport.contract_scope.registry_required_key_count = 9;
      candidateContract.future_registry_entry_required_keys.pop();
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
    registry_contract_status: report.registry_contract_status,
    receipt_contract_id: report.contract_identity.receipt_contract_id,
    registry_contract_id: report.contract_identity.registry_contract_id,
    registry_entry_id: report.contract_identity.registry_entry_id,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    future_local_receipt_path: report.contract_identity.future_local_receipt_path,
    future_local_registry_path: report.contract_identity.future_local_registry_path,
    registry_required_key_count: report.contract_scope.registry_required_key_count,
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
