#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.example.json",
  sourceContract: "tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json",
  sourceStaticPanel: "docs/v14_205_review_console_runtime_gap_static_ui_panel.md",
  app: "review_console/static_prototype/app.js",
  mockData: "review_console/static_prototype/mock_data.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression",
  snapshotStatus: "golden_static_snapshot",
  draftKey: "review_console_runtime_gap_dashboard_state",
  sourceContractRef: "tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json",
  rowIds: [
    "artifact_recoverability",
    "accepted_samples_gap",
    "authorization_handoff_cards",
    "manifest_read",
    "vcpchat_vcptoolbox_runtime",
    "daily_note_vcp_memory",
    "production_candidate_archive",
  ],
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evaluate(input, sourceContract) {
  const state = input.review_console_runtime_gap_dashboard_state || {};
  const rows = Array.isArray(state.rows) ? state.rows : [];
  const guard = state.guard || {};
  const contractRows = Array.isArray(sourceContract.rows) ? sourceContract.rows : [];
  const rowIds = rows.map((row) => row.row_id);
  const localRows = rows.filter((row) => row.row_kind === "local_capability");
  const a5Rows = rows.filter((row) => row.row_kind === "a5_boundary");
  const rowsMatch =
    rows.length === expected.rowIds.length &&
    expected.rowIds.every((rowId) => rowIds.includes(rowId)) &&
    rows.length === contractRows.length &&
    rows.every((row) => {
      const source = contractRows.find((item) => item.row_id === row.row_id);
      return source &&
        row.row_kind === source.row_kind &&
        row.current_status === source.current_status &&
        row.source_evidence_ref === source.source_evidence_ref &&
        row.requires_a5_authorization_before_execution === source.requires_a5_authorization_before_execution &&
        row.runtime_integration_claim_allowed === false;
    });
  const countsOk =
    state.runtime_gap_row_count === rows.length &&
    state.runtime_gap_row_count === 7 &&
    state.local_capability_row_count === localRows.length &&
    state.local_capability_row_count === 3 &&
    state.a5_boundary_row_count === a5Rows.length &&
    state.a5_boundary_row_count === 4;
  const basisOk =
    state.dashboard_contract_status === "static_runtime_gap_contract_ready" &&
    state.dashboard_progress_basis === "validator_outputs_and_static_fixtures_only" &&
    !/project_master_plan|document_token|roadmap/i.test(state.dashboard_progress_basis || "");
  const identityOk =
    input.phase === expected.phase &&
    input.snapshot_status === expected.snapshotStatus &&
    input.draft_output_key === expected.draftKey &&
    Boolean(input.review_console_runtime_gap_dashboard_state) &&
    state.draft_output_key === expected.draftKey &&
    state.source_contract_ref === expected.sourceContractRef;
  const noWrites =
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;
  const noExternal =
    guard.fetch_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;
  const noRuntimeClaim =
    state.runtime_claim_allowed === false &&
    guard.runtime_gap_dashboard_static_ui_only === true &&
    guard.package_execution_performed === false &&
    guard.authorization_execution_performed === false &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && rowsMatch && countsOk && basisOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    rowsMatch,
    countsOk,
    basisOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.snapshot).review_console_runtime_gap_draft_output_snapshot_static_regression;
const sourceContract = core.parseJson(files.sourceContract).review_console_runtime_gap_dashboard_contract;
const phaseRecord = core.read(files.phaseRecord);
const sourceStaticPanel = core.read(files.sourceStaticPanel);
const appText = core.read(files.app);
const mockData = core.read(files.mockData);
const mvpText = core.read(files.mvpValidator);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  mvpText,
].join("\n");

const baseEval = evaluate(fixture, sourceContract);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("runtime_gap_draft_output_snapshot_evaluation_passes", baseEval.passed);
addResult("snapshot_rows_match_source_contract", baseEval.rowsMatch);
addResult("snapshot_counts_match_rows", baseEval.countsOk);
addResult("snapshot_basis_is_validator_static_only", baseEval.basisOk);

const missingKey = clone(fixture);
delete missingKey.review_console_runtime_gap_dashboard_state;
const missingRow = clone(fixture);
missingRow.review_console_runtime_gap_dashboard_state.rows.pop();
missingRow.review_console_runtime_gap_dashboard_state.runtime_gap_row_count = 6;
const docsBasis = clone(fixture);
docsBasis.review_console_runtime_gap_dashboard_state.dashboard_progress_basis = "PROJECT_MASTER_PLAN_document_token_progress";
const runtimeClaim = clone(fixture);
runtimeClaim.review_console_runtime_gap_dashboard_state.runtime_claim_allowed = true;
runtimeClaim.review_console_runtime_gap_dashboard_state.rows[0].runtime_integration_claim_allowed = true;
runtimeClaim.review_console_runtime_gap_dashboard_state.guard.vcp_runtime_integration_proven = true;
runtimeClaim.review_console_runtime_gap_dashboard_state.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
const packageExecution = clone(fixture);
packageExecution.review_console_runtime_gap_dashboard_state.guard.package_execution_performed = true;
const manifestRead = clone(fixture);
manifestRead.review_console_runtime_gap_dashboard_state.guard.real_manifest_read_performed = true;
const memoryWrite = clone(fixture);
memoryWrite.review_console_runtime_gap_dashboard_state.guard.DailyNote_write_performed = true;
memoryWrite.review_console_runtime_gap_dashboard_state.guard.VCP_memory_write_performed = true;

const missingKeyEval = evaluate(missingKey, sourceContract);
const missingRowEval = evaluate(missingRow, sourceContract);
const docsBasisEval = evaluate(docsBasis, sourceContract);
const runtimeClaimEval = evaluate(runtimeClaim, sourceContract);
const packageExecutionEval = evaluate(packageExecution, sourceContract);
const manifestReadEval = evaluate(manifestRead, sourceContract);
const memoryWriteEval = evaluate(memoryWrite, sourceContract);

addResult("negative_case_missing_draft_output_key_fails", missingKeyEval.passed === false && missingKeyEval.identityOk === false);
addResult("negative_case_missing_gap_row_fails", missingRowEval.passed === false && missingRowEval.rowsMatch === false && missingRowEval.countsOk === false);
addResult("negative_case_docs_progress_basis_fails", docsBasisEval.passed === false && docsBasisEval.basisOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_package_execution_flag_fails", packageExecutionEval.passed === false && packageExecutionEval.noRuntimeClaim === false);
addResult("negative_case_manifest_read_flag_fails", manifestReadEval.passed === false && manifestReadEval.noExternal === false);
addResult("negative_case_memory_write_flag_fails", memoryWriteEval.passed === false && memoryWriteEval.noWrites === false);

for (const token of [
  "review_console_runtime_gap_dashboard_state: reviewConsoleRuntimeGapDashboardState()",
  "function reviewConsoleRuntimeGapDashboardState()",
  "runtime_gap_dashboard_static_ui_only: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "review_console_runtime_gap_dashboard_contract_seed",
  "runtime_gap_row_count: 7",
  "local_capability_row_count: 3",
  "a5_boundary_row_count: 4",
]) {
  requireToken("mock_data", mockData, token);
}

for (const token of [
  "static_ui_panel_status: wired_static_only",
  "runtime_gap_row_count: 7",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("source_static_panel", sourceStaticPanel, token);
}

for (const token of [
  "scripts/validate_v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.js",
  "tests/schema_examples/v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.example.json",
  "docs/v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.md",
  "v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const state = fixture.review_console_runtime_gap_dashboard_state;
const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  snapshot_status: fixture.snapshot_status,
  draft_output_key: fixture.draft_output_key,
  dashboard_contract_status: state.dashboard_contract_status,
  dashboard_progress_basis: state.dashboard_progress_basis,
  runtime_gap_row_count: state.runtime_gap_row_count,
  local_capability_row_count: state.local_capability_row_count,
  a5_boundary_row_count: state.a5_boundary_row_count,
  runtime_claim_allowed: state.runtime_claim_allowed,
  static_snapshot_only: true,
  runtime_gap_dashboard_static_ui_only: state.guard.runtime_gap_dashboard_static_ui_only,
  fetch_performed: false,
  file_write_performed: false,
  authorization_execution_performed: false,
  package_execution_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  durable_archive_copy_performed: false,
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
  negative_case_missing_draft_output_key_fails: missingKeyEval.passed === false && missingKeyEval.identityOk === false,
  negative_case_missing_gap_row_fails: missingRowEval.passed === false && missingRowEval.rowsMatch === false && missingRowEval.countsOk === false,
  negative_case_docs_progress_basis_fails: docsBasisEval.passed === false && docsBasisEval.basisOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_package_execution_flag_fails: packageExecutionEval.passed === false && packageExecutionEval.noRuntimeClaim === false,
  negative_case_manifest_read_flag_fails: manifestReadEval.passed === false && manifestReadEval.noExternal === false,
  negative_case_memory_write_flag_fails: memoryWriteEval.passed === false && memoryWriteEval.noWrites === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
