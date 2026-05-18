#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_204_review_console_runtime_gap_dashboard_contract.md",
  fixture: "tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json",
  sourceDashboardEvidence: "tests/schema_examples/v14_168_three_sample_dashboard_evidence_alignment.example.json",
  sourceReviewConsoleHandoff: "tests/schema_examples/v14_203_authorization_compiler_review_console_handoff_state.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expectedRows = [
  "artifact_recoverability",
  "accepted_samples_gap",
  "authorization_handoff_cards",
  "manifest_read",
  "vcpchat_vcptoolbox_runtime",
  "daily_note_vcp_memory",
  "production_candidate_archive",
];

const localRows = new Set(["artifact_recoverability", "accepted_samples_gap", "authorization_handoff_cards"]);
const a5Rows = new Set(["manifest_read", "vcpchat_vcptoolbox_runtime", "daily_note_vcp_memory", "production_candidate_archive"]);

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

function evaluate(input, sourceDashboardEvidence, sourceReviewConsoleHandoff) {
  const dashboard = sourceDashboardEvidence.three_sample_dashboard_evidence_alignment || {};
  const handoff = sourceReviewConsoleHandoff.review_console_authorization_handoff_state || {};
  const rows = input.rows || [];
  const rowIds = rows.map((row) => row.row_id);
  const guard = input.guard || {};

  const sourceOk =
    input.source_dashboard_evidence_ref === files.sourceDashboardEvidence &&
    input.source_review_console_handoff_ref === files.sourceReviewConsoleHandoff &&
    dashboard.dashboard_counts &&
    dashboard.dashboard_counts.full_recoverable_accepted_sample_count === 3 &&
    dashboard.dashboard_counts.remaining_full_recoverable_sample_gap === 0 &&
    handoff.handoff_state_status === "static_ready_no_runtime" &&
    handoff.package_card_count === 5;

  const contractOk =
    input.phase === "v14_204_review_console_runtime_gap_dashboard_contract" &&
    input.execution_mode === "static_runtime_gap_dashboard_contract_only" &&
    input.dashboard_contract_status === "static_runtime_gap_contract_ready" &&
    input.dashboard_progress_basis === "validator_outputs_and_static_fixtures_only" &&
    input.runtime_gap_row_count === 7 &&
    input.local_capability_row_count === 3 &&
    input.a5_boundary_row_count === 4 &&
    input.runtime_claim_allowed === false;

  const rowsOk =
    rows.length === 7 &&
    new Set(rowIds).size === 7 &&
    expectedRows.every((rowId) => rowIds.includes(rowId)) &&
    rows.every((row) => {
      const isLocal = localRows.has(row.row_id);
      const isA5 = a5Rows.has(row.row_id);
      return (
        row.display_allowed === true &&
        row.runtime_integration_claim_allowed === false &&
        typeof row.source_evidence_ref === "string" &&
        row.source_evidence_ref.startsWith("tests/schema_examples/") &&
        ((isLocal &&
          row.row_kind === "local_capability" &&
          row.requires_a5_authorization_before_execution === false) ||
          (isA5 &&
            row.row_kind === "a5_boundary" &&
            row.current_status === "not_performed_requires_exact_a5" &&
            row.requires_a5_authorization_before_execution === true))
      );
    });

  const validationOk =
    (input.validation_required || []).includes("git diff --check") &&
    (input.validation_required || []).includes("node scripts/validate_v14_168_three_sample_dashboard_evidence_alignment.js") &&
    (input.validation_required || []).includes("node scripts/validate_v14_203_authorization_compiler_review_console_handoff_state.js") &&
    (input.validation_required || []).includes("node scripts/validate_agent_board_state.js") &&
    (input.validation_required || []).includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noDashboardProxy =
    guard.runtime_gap_dashboard_contract_only === true &&
    guard.dashboard_uses_project_master_plan_progress === false &&
    guard.dashboard_uses_document_token_progress === false &&
    guard.dashboard_promotes_product_status === false;

  const noExecution =
    guard.authorization_execution_performed === false &&
    guard.package_execution_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.manifest_read_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.fetch_performed === false &&
    guard.file_write_performed === false &&
    guard.review_console_runtime_integration_performed === false &&
    guard.ipc_preload_renderer_integration_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: sourceOk && contractOk && rowsOk && validationOk && noDashboardProxy && noExecution && noExternal && noRuntimeClaim,
    sourceOk,
    contractOk,
    rowsOk,
    validationOk,
    noDashboardProxy,
    noExecution,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_runtime_gap_dashboard_contract;
const sourceDashboardEvidence = core.parseJson(files.sourceDashboardEvidence);
const sourceReviewConsoleHandoff = core.parseJson(files.sourceReviewConsoleHandoff);
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

const baseEval = evaluate(fixture, sourceDashboardEvidence, sourceReviewConsoleHandoff);
addResult("review_console_runtime_gap_dashboard_contract_evaluation_passes", baseEval.passed);

const missingGapRow = clone(fixture);
missingGapRow.rows = missingGapRow.rows.filter((row) => row.row_id !== "accepted_samples_gap");
const docsProgressBasis = clone(fixture);
docsProgressBasis.dashboard_progress_basis = "document_token_progress";
docsProgressBasis.guard.dashboard_uses_document_token_progress = true;
const runtimeClaim = clone(fixture);
runtimeClaim.runtime_claim_allowed = true;
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
const manifestReadFlag = clone(fixture);
manifestReadFlag.guard.real_manifest_read_performed = true;
const packageExecutionFlag = clone(fixture);
packageExecutionFlag.guard.package_execution_performed = true;
const memoryWriteFlag = clone(fixture);
memoryWriteFlag.guard.VCP_memory_write_performed = true;

const missingGapRowEval = evaluate(missingGapRow, sourceDashboardEvidence, sourceReviewConsoleHandoff);
const docsProgressBasisEval = evaluate(docsProgressBasis, sourceDashboardEvidence, sourceReviewConsoleHandoff);
const runtimeClaimEval = evaluate(runtimeClaim, sourceDashboardEvidence, sourceReviewConsoleHandoff);
const manifestReadFlagEval = evaluate(manifestReadFlag, sourceDashboardEvidence, sourceReviewConsoleHandoff);
const packageExecutionFlagEval = evaluate(packageExecutionFlag, sourceDashboardEvidence, sourceReviewConsoleHandoff);
const memoryWriteFlagEval = evaluate(memoryWriteFlag, sourceDashboardEvidence, sourceReviewConsoleHandoff);

addResult("negative_case_missing_gap_row_fails", missingGapRowEval.passed === false && missingGapRowEval.rowsOk === false);
addResult("negative_case_docs_progress_basis_fails", docsProgressBasisEval.passed === false && docsProgressBasisEval.contractOk === false && docsProgressBasisEval.noDashboardProxy === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.contractOk === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_manifest_read_flag_fails", manifestReadFlagEval.passed === false && manifestReadFlagEval.noExternal === false);
addResult("negative_case_package_execution_flag_fails", packageExecutionFlagEval.passed === false && packageExecutionFlagEval.noExecution === false);
addResult("negative_case_memory_write_flag_fails", memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noExecution === false);

for (const token of [
  "dashboard_contract_status: static_runtime_gap_contract_ready",
  "runtime_gap_row_count: 7",
  "local_capability_row_count: 3",
  "a5_boundary_row_count: 4",
  "dashboard_progress_basis: validator_outputs_and_static_fixtures_only",
  "runtime_claim_allowed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_204_review_console_runtime_gap_dashboard_contract.js",
  "tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json",
  "docs/v14_204_review_console_runtime_gap_dashboard_contract.md",
  "v14_204_review_console_runtime_gap_dashboard_contract",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_204_review_console_runtime_gap_dashboard_contract",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  dashboard_contract_status: fixture.dashboard_contract_status,
  dashboard_progress_basis: fixture.dashboard_progress_basis,
  runtime_gap_row_count: fixture.runtime_gap_row_count,
  local_capability_row_count: fixture.local_capability_row_count,
  a5_boundary_row_count: fixture.a5_boundary_row_count,
  runtime_claim_allowed: fixture.runtime_claim_allowed,
  runtime_gap_dashboard_contract_only: fixture.guard.runtime_gap_dashboard_contract_only,
  dashboard_uses_project_master_plan_progress: fixture.guard.dashboard_uses_project_master_plan_progress,
  dashboard_uses_document_token_progress: fixture.guard.dashboard_uses_document_token_progress,
  dashboard_promotes_product_status: fixture.guard.dashboard_promotes_product_status,
  authorization_execution_performed: fixture.guard.authorization_execution_performed,
  package_execution_performed: fixture.guard.package_execution_performed,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  manifest_read_performed: fixture.guard.manifest_read_performed,
  durable_archive_copy_performed: fixture.guard.durable_archive_copy_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  failure_samples_write_performed: fixture.guard.failure_samples_write_performed,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  mcp_runtime_performed: fixture.guard.mcp_runtime_performed,
  fetch_performed: fixture.guard.fetch_performed,
  file_write_performed: fixture.guard.file_write_performed,
  review_console_runtime_integration_performed: fixture.guard.review_console_runtime_integration_performed,
  ipc_preload_renderer_integration_performed: fixture.guard.ipc_preload_renderer_integration_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: fixture.guard.push_tag_release_deploy_performed,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_gap_row_fails: missingGapRowEval.passed === false && missingGapRowEval.rowsOk === false,
  negative_case_docs_progress_basis_fails:
    docsProgressBasisEval.passed === false && docsProgressBasisEval.contractOk === false && docsProgressBasisEval.noDashboardProxy === false,
  negative_case_runtime_claim_fails:
    runtimeClaimEval.passed === false && runtimeClaimEval.contractOk === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_manifest_read_flag_fails: manifestReadFlagEval.passed === false && manifestReadFlagEval.noExternal === false,
  negative_case_package_execution_flag_fails: packageExecutionFlagEval.passed === false && packageExecutionFlagEval.noExecution === false,
  negative_case_memory_write_flag_fails: memoryWriteFlagEval.passed === false && memoryWriteFlagEval.noExecution === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
