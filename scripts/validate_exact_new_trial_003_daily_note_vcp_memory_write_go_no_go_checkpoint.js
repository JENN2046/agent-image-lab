#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_50_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_GO_NO_GO_CHECKPOINT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_50_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint.json",
  checkpoint: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_go_no_go_checkpoint.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint_fail.example.json",
  registryReport: "reports/visual_asset_eval_dry_run/v0_6_49_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract.json",
  registryContract: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_registry_contract.json",
  receiptReport: "reports/visual_asset_eval_dry_run/v0_6_48_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract.json",
  payloadReport: "reports/visual_asset_eval_dry_run/v0_6_47_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.json",
  scanReport: "reports/visual_asset_eval_dry_run/v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight.json",
  acceptedSamplesPreflight: "reports/visual_asset_eval_dry_run/v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight.json",
  archivePreflight: "reports/visual_asset_eval_dry_run/v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.json",
  productionPreflight: "reports/visual_asset_eval_dry_run/v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_50_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint",
  checkpointStatus: "no_go_unmet_workflow_prerequisites",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  reviewer: "Jenn",
  authorizationId: "AUTH-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  dailyNoteTargetId: "exact_new_trial_003_shot_2_daily_note_review_learning_entry",
  vcpMemoryTargetId: "exact_new_trial_003_shot_2_vcp_memory_review_learning_summary",
  receiptContractId: "RCPT-CONTRACT-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  registryContractId: "REGISTRY-CONTRACT-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  registryEntryId: "REGISTRY-ENTRY-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  futureReceiptPath: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_receipt.json",
  futureRegistryPath: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_registry.json",
  futureBridgeRef: "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_2_memory_write",
  recommendedNext: "prepare_exact_new_trial_003_workflow_prerequisite_reconciliation_packet_before_any_memory_write"
};

const noGoReasons = [
  "formal_human_approval_not_captured",
  "accepted_sample_registration_not_completed",
  "durable_archive_not_ready",
  "production_candidate_not_ready"
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

function reasonsMatch(reasons) {
  return JSON.stringify(reasons) === JSON.stringify(noGoReasons);
}

function commonReportChecks(report) {
  return (
    report.phase === expected.phase &&
    report.execution_mode === "daily_note_vcp_memory_write_go_no_go_checkpoint_only" &&
    report.checkpoint_ref === files.checkpoint &&
    report.checkpoint_status === expected.checkpointStatus &&
    report.target.sample_id === expected.sampleId &&
    report.target.candidate_id === expected.candidateId &&
    report.target.category === expected.category &&
    report.target.reviewer === expected.reviewer &&
    report.target.authorization_id === expected.authorizationId &&
    report.authorization_model.active_autonomy_model === "Smart Standing Authorization v3" &&
    report.authorization_model.amber_lane_type === "Amber_C_memory" &&
    report.authorization_model.amber_memory_write_default_allowed === true &&
    report.authorization_model.step_by_step_auth_request_required === false &&
    report.authorization_model.authorization_missing_is_current_blocker === false &&
    report.authorization_model.exact_scope_defined === true &&
    report.readiness.go_allowed_now === false &&
    report.readiness.formal_human_approval_captured === false &&
    report.readiness.accepted_sample_registration_completed === false &&
    report.readiness.durable_archive_ready === false &&
    report.readiness.production_candidate_ready === false &&
    report.readiness.payload_refresh_present === true &&
    report.readiness.sensitive_data_scan_present === true &&
    report.readiness.receipt_contract_present === true &&
    report.readiness.registry_contract_present === true &&
    reasonsMatch(report.readiness.current_no_go_reasons) &&
    report.memory_route_scope.daily_note_target_id === expected.dailyNoteTargetId &&
    report.memory_route_scope.vcp_memory_target_id === expected.vcpMemoryTargetId &&
    report.memory_route_scope.receipt_contract_id === expected.receiptContractId &&
    report.memory_route_scope.registry_contract_id === expected.registryContractId &&
    report.memory_route_scope.registry_entry_id === expected.registryEntryId &&
    report.memory_route_scope.future_local_receipt_path === expected.futureReceiptPath &&
    report.memory_route_scope.future_local_registry_path === expected.futureRegistryPath &&
    report.memory_route_scope.future_review_bridge_ref === expected.futureBridgeRef &&
    report.guard.go_no_go_checkpoint_only === true &&
    report.guard.authorization_granted_by_this_checkpoint === false &&
    report.guard.execution_ready === false &&
    report.guard.execution_allowed_now === false &&
    report.guard.DailyNote_write_performed === false &&
    report.guard.VCP_memory_write_performed === false &&
    report.guard.accepted_samples_write_performed === false &&
    report.guard.archive_write_performed === false &&
    report.guard.production_candidate_write_performed === false &&
    report.guard.provider_contact_performed === false &&
    report.guard.plugin_call_performed === false &&
    report.guard.api_call_performed === false &&
    report.guard.mcp_runtime_performed === false &&
    report.guard.image_generation_performed === false &&
    report.guard.secret_value_read_performed === false &&
    report.guard.staging_performed === false &&
    report.guard.commit_performed === false &&
    report.guard.push_tag_release_deploy_performed === false &&
    report.guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    report.guard.vcp_runtime_integration_proven === false &&
    report.recommended_next === expected.recommendedNext
  );
}

function evaluate(report, checkpoint) {
  const registryReport = readJson(files.registryReport).exact_new_trial_003_daily_note_vcp_memory_write_registry_contract;
  const registryContract = readJson(files.registryContract).daily_note_vcp_memory_write_registry_contract;
  const receiptReport = readJson(files.receiptReport).exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract;
  const payloadReport = readJson(files.payloadReport).exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package;
  const scanReport = readJson(files.scanReport).exact_new_trial_003_sensitive_data_scan_preflight;
  const acceptedSamples = readJson(files.acceptedSamplesPreflight).exact_new_trial_003_accepted_samples_registration_execution_preflight;
  const archive = readJson(files.archivePreflight).exact_new_trial_003_durable_archive_authorization_compiler_output_preflight;
  const production = readJson(files.productionPreflight).exact_new_trial_003_production_candidate_authorization_compiler_output_preflight;

  return (
    commonReportChecks(report) &&
    checkpoint.report_version === 1 &&
    checkpoint.checkpoint_type === "daily_note_vcp_memory_write_go_no_go_checkpoint" &&
    checkpoint.phase === expected.phase &&
    checkpoint.checkpoint_status === expected.checkpointStatus &&
    checkpoint.target_sample_id === expected.sampleId &&
    checkpoint.target_candidate_id === expected.candidateId &&
    checkpoint.category === expected.category &&
    checkpoint.reviewer === expected.reviewer &&
    checkpoint.authorization_id === expected.authorizationId &&
    checkpoint.source_refs.registry_contract_report === files.registryReport &&
    checkpoint.source_refs.registry_contract === files.registryContract &&
    checkpoint.source_refs.receipt_contract_report === files.receiptReport &&
    checkpoint.source_refs.payload_refresh_report === files.payloadReport &&
    checkpoint.source_refs.sensitive_data_scan === files.scanReport &&
    checkpoint.source_refs.accepted_samples_preflight === files.acceptedSamplesPreflight &&
    checkpoint.source_refs.durable_archive_preflight === files.archivePreflight &&
    checkpoint.source_refs.production_candidate_preflight === files.productionPreflight &&
    checkpoint.authorization_model.active_autonomy_model === "Smart Standing Authorization v3" &&
    checkpoint.authorization_model.amber_lane_type === "Amber_C_memory" &&
    checkpoint.authorization_model.amber_memory_write_default_allowed === true &&
    checkpoint.authorization_model.step_by_step_auth_request_required === false &&
    checkpoint.authorization_model.authorization_missing_is_current_blocker === false &&
    checkpoint.authorization_model.exact_scope_defined === true &&
    checkpoint.authorization_model.secret_value_read_allowed === false &&
    checkpoint.authorization_model.push_allowed === false &&
    checkpoint.readiness_matrix.go_allowed_now === false &&
    checkpoint.readiness_matrix.formal_human_approval_captured === false &&
    checkpoint.readiness_matrix.accepted_sample_registration_completed === false &&
    checkpoint.readiness_matrix.durable_archive_ready === false &&
    checkpoint.readiness_matrix.production_candidate_ready === false &&
    checkpoint.readiness_matrix.payload_refresh_present === true &&
    checkpoint.readiness_matrix.sensitive_data_scan_present === true &&
    checkpoint.readiness_matrix.receipt_contract_present === true &&
    checkpoint.readiness_matrix.registry_contract_present === true &&
    checkpoint.readiness_matrix.daily_note_target_id === expected.dailyNoteTargetId &&
    checkpoint.readiness_matrix.vcp_memory_target_id === expected.vcpMemoryTargetId &&
    checkpoint.readiness_matrix.receipt_contract_id === expected.receiptContractId &&
    checkpoint.readiness_matrix.registry_contract_id === expected.registryContractId &&
    checkpoint.readiness_matrix.registry_entry_id === expected.registryEntryId &&
    checkpoint.readiness_matrix.future_local_receipt_path === expected.futureReceiptPath &&
    checkpoint.readiness_matrix.future_local_registry_path === expected.futureRegistryPath &&
    checkpoint.readiness_matrix.future_review_bridge_ref === expected.futureBridgeRef &&
    reasonsMatch(checkpoint.current_no_go_reasons) &&
    checkpoint.future_go_requires.includes("exact_Amber_C_memory_packet_still_matches_payload_receipt_and_registry_contracts") &&
    checkpoint.execution_state.authorization_granted_by_this_checkpoint === false &&
    checkpoint.execution_state.execution_ready === false &&
    checkpoint.execution_state.execution_allowed_now === false &&
    checkpoint.execution_state.DailyNote_write_performed === false &&
    checkpoint.execution_state.VCP_memory_write_performed === false &&
    checkpoint.execution_state.accepted_samples_write_performed === false &&
    checkpoint.execution_state.archive_write_performed === false &&
    checkpoint.execution_state.production_candidate_write_performed === false &&
    checkpoint.execution_state.provider_contact_performed === false &&
    checkpoint.execution_state.plugin_call_performed === false &&
    checkpoint.execution_state.api_call_performed === false &&
    checkpoint.execution_state.mcp_runtime_performed === false &&
    checkpoint.execution_state.image_generation_performed === false &&
    checkpoint.execution_state.secret_value_read_performed === false &&
    checkpoint.execution_state.push_tag_release_deploy_performed === false &&
    checkpoint.execution_state.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    checkpoint.execution_state.vcp_runtime_integration_proven === false &&
    registryReport.registry_contract_status === "prepared_blocked_not_executed" &&
    registryReport.authorization_model === undefined &&
    registryContract.registry_identity.registry_contract_id === expected.registryContractId &&
    registryContract.registry_identity.registry_entry_id === expected.registryEntryId &&
    receiptReport.receipt_contract_status === "prepared_blocked_not_executed" &&
    payloadReport.payload_refresh_status === "refreshed_blocked_not_executable" &&
    scanReport.scan_findings?.contains_secret === false &&
    scanReport.scan_findings?.contains_private_path === false &&
    scanReport.scan_findings?.contains_customer_private_data === false &&
    scanReport.scan_findings?.raw_sensitive_content_saved === false &&
    acceptedSamples.target.human_approval_status === "pending" &&
    acceptedSamples.target.execution_allowed_now === false &&
    archive.target.accepted_sample_registration_completed === false &&
    archive.execution_allowed_now === false &&
    production.target.accepted_sample_registration_completed === false &&
    production.target.durable_archive_ready === false &&
    production.execution_allowed_now === false
  );
}

function validateRecord(report, checkpoint, context) {
  assert(report && typeof report === "object", `${context} report missing`);
  assert(checkpoint && typeof checkpoint === "object", `${context} checkpoint missing`);
  assertNoRawLocalDrivePath(report, `${context}.report`);
  assertNoRawLocalDrivePath(checkpoint, `${context}.checkpoint`);
  assert(evaluate(report, checkpoint), `${context} evaluation failed`);
}

function expectFailure(baseReport, baseCheckpoint, caseId, mutate) {
  const report = clone(baseReport);
  const checkpoint = clone(baseCheckpoint);
  mutate(report, checkpoint);
  try {
    validateRecord(report, checkpoint, caseId);
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
  const report = readJson(files.report).exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint;
  const checkpoint = readJson(files.checkpoint).daily_note_vcp_memory_write_go_no_go_checkpoint;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "amber_memory_write_default_allowed: true",
    "step_by_step_auth_request_required: false",
    "authorization_missing_is_current_blocker: false",
    "formal_human_approval_captured: false",
    "accepted_sample_registration_completed: false",
    "durable_archive_ready: false",
    "production_candidate_ready: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint.js"),
    "validate_mvp missing exact memory-write go/no-go checkpoint validator"
  );

  validateRecord(report, checkpoint, "report");
  validateRecord(passFixture, checkpoint, "pass_fixture");

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, checkpoint, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, checkpoint, "authorization_missing_blocker_overclaim_fails", (report, checkpoint) => {
      report.authorization_model.authorization_missing_is_current_blocker = true;
      checkpoint.authorization_model.authorization_missing_is_current_blocker = true;
    }),
    expectFailure(passFixture, checkpoint, "go_allowed_now_overclaim_fails", (report, checkpoint) => {
      report.readiness.go_allowed_now = true;
      checkpoint.readiness_matrix.go_allowed_now = true;
      checkpoint.checkpoint_status = "go";
    }),
    expectFailure(passFixture, checkpoint, "human_approval_overclaim_fails", (report, checkpoint) => {
      report.readiness.formal_human_approval_captured = true;
      checkpoint.readiness_matrix.formal_human_approval_captured = true;
    }),
    expectFailure(passFixture, checkpoint, "accepted_sample_overclaim_fails", (report, checkpoint) => {
      report.readiness.accepted_sample_registration_completed = true;
      checkpoint.readiness_matrix.accepted_sample_registration_completed = true;
    }),
    expectFailure(passFixture, checkpoint, "archive_ready_overclaim_fails", (report, checkpoint) => {
      report.readiness.durable_archive_ready = true;
      checkpoint.readiness_matrix.durable_archive_ready = true;
    }),
    expectFailure(passFixture, checkpoint, "production_ready_overclaim_fails", (report, checkpoint) => {
      report.readiness.production_candidate_ready = true;
      checkpoint.readiness_matrix.production_candidate_ready = true;
    }),
    expectFailure(passFixture, checkpoint, "memory_write_flag_fails", (report, checkpoint) => {
      report.guard.DailyNote_write_performed = true;
      report.guard.VCP_memory_write_performed = true;
      checkpoint.execution_state.DailyNote_write_performed = true;
      checkpoint.execution_state.VCP_memory_write_performed = true;
    }),
    expectFailure(passFixture, checkpoint, "runtime_claim_fails", (report, checkpoint) => {
      report.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
      report.guard.vcp_runtime_integration_proven = true;
      checkpoint.execution_state.artifact_recoverability_is_not_vcp_runtime_integration = false;
      checkpoint.execution_state.vcp_runtime_integration_proven = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    checkpoint_status: report.checkpoint_status,
    amber_memory_write_default_allowed: report.authorization_model.amber_memory_write_default_allowed,
    step_by_step_auth_request_required: report.authorization_model.step_by_step_auth_request_required,
    authorization_missing_is_current_blocker: report.authorization_model.authorization_missing_is_current_blocker,
    go_allowed_now: report.readiness.go_allowed_now,
    formal_human_approval_captured: report.readiness.formal_human_approval_captured,
    accepted_sample_registration_completed: report.readiness.accepted_sample_registration_completed,
    durable_archive_ready: report.readiness.durable_archive_ready,
    production_candidate_ready: report.readiness.production_candidate_ready,
    no_go_reason_count: report.readiness.current_no_go_reasons.length,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
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
