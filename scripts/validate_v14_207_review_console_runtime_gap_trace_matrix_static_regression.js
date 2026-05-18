#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_207_review_console_runtime_gap_trace_matrix_static_regression.md",
  matrix: "tests/schema_examples/v14_207_review_console_runtime_gap_trace_matrix_static_regression.example.json",
  sourceContract: "tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json",
  sourceStaticPanel: "docs/v14_205_review_console_runtime_gap_static_ui_panel.md",
  sourceDraftSnapshot: "tests/schema_examples/v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.example.json",
  mockData: "review_console/static_prototype/mock_data.js",
  app: "review_console/static_prototype/app.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_207_review_console_runtime_gap_trace_matrix_static_regression",
  traceStatus: "contract_ui_draft_trace_locked",
  sourceContractRef: "tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json",
  sourceDraftSnapshotRef: "tests/schema_examples/v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.example.json",
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

function expectedSurface(surfaceId, status) {
  return (surface) =>
    surface.surface_id === surfaceId &&
    surface.status === status &&
    surface.row_count === 7 &&
    surface.runtime_claim_allowed === false &&
    surface.vcp_runtime_integration_proven === false;
}

function evaluate(input, sources) {
  const surfaces = Array.isArray(input.surfaces) ? input.surfaces : [];
  const rows = Array.isArray(input.row_trace) ? input.row_trace : [];
  const guard = input.guard || {};
  const contractRows = sources.contract.rows || [];
  const draftRows = sources.draft.review_console_runtime_gap_dashboard_state.rows || [];
  const sourceRowIds = contractRows.map((row) => row.row_id);
  const draftRowIds = draftRows.map((row) => row.row_id);
  const uiSeedText = sources.mockData;

  const identityOk =
    input.phase === expected.phase &&
    input.trace_status === expected.traceStatus &&
    input.source_contract_ref === expected.sourceContractRef &&
    input.source_draft_snapshot_ref === expected.sourceDraftSnapshotRef;
  const surfacesOk =
    input.surface_count === 3 &&
    surfaces.length === 3 &&
    surfaces.some(expectedSurface("contract", "static_runtime_gap_contract_ready")) &&
    surfaces.some(expectedSurface("static_ui_seed", "wired_static_only")) &&
    surfaces.some(expectedSurface("draft_output_snapshot", "golden_static_snapshot"));
  const countsOk =
    input.runtime_gap_row_count === 7 &&
    input.local_capability_row_count === 3 &&
    input.a5_boundary_row_count === 4 &&
    input.runtime_claim_allowed === false &&
    input.dashboard_progress_basis === "validator_outputs_and_static_fixtures_only" &&
    !/project_master_plan|document_token|roadmap/i.test(input.dashboard_progress_basis || "");
  const rowsOk =
    rows.length === expected.rowIds.length &&
    expected.rowIds.every((rowId) => rows.some((row) => row.row_id === rowId)) &&
    rows.every((row) => {
      const contract = contractRows.find((item) => item.row_id === row.row_id);
      const draft = draftRows.find((item) => item.row_id === row.row_id);
      return contract &&
        draft &&
        sourceRowIds.includes(row.row_id) &&
        draftRowIds.includes(row.row_id) &&
        uiSeedText.includes(`row_id: "${row.row_id}"`) &&
        row.present_in_contract === true &&
        row.present_in_static_ui_seed === true &&
        row.present_in_draft_snapshot === true &&
        row.row_kind === contract.row_kind &&
        row.row_kind === draft.row_kind &&
        row.requires_a5_authorization_before_execution === contract.requires_a5_authorization_before_execution &&
        row.requires_a5_authorization_before_execution === draft.requires_a5_authorization_before_execution &&
        row.runtime_integration_claim_allowed === false &&
        draft.runtime_integration_claim_allowed === false;
    });
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
    guard.static_trace_matrix_only === true &&
    guard.authorization_execution_performed === false &&
    guard.package_execution_performed === false &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && surfacesOk && countsOk && rowsOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    surfacesOk,
    countsOk,
    rowsOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const matrix = core.parseJson(files.matrix).review_console_runtime_gap_trace_matrix_static_regression;
const contract = core.parseJson(files.sourceContract).review_console_runtime_gap_dashboard_contract;
const draft = core.parseJson(files.sourceDraftSnapshot).review_console_runtime_gap_draft_output_snapshot_static_regression;
const mockData = core.read(files.mockData);
const phaseRecord = core.read(files.phaseRecord);
const staticPanel = core.read(files.sourceStaticPanel);
const appText = core.read(files.app);
const mvpText = core.read(files.mvpValidator);
const sources = { contract, draft, mockData };
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(matrix, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  mvpText,
].join("\n");

const baseEval = evaluate(matrix, sources);
addResult("matrix_phase_matches", matrix.phase === expected.phase);
addResult("runtime_gap_trace_matrix_evaluation_passes", baseEval.passed);
addResult("surface_trace_matches", baseEval.surfacesOk);
addResult("row_trace_matches_contract_ui_and_draft", baseEval.rowsOk);
addResult("counts_and_basis_are_static_only", baseEval.countsOk);

const missingSurface = clone(matrix);
missingSurface.surfaces.pop();
missingSurface.surface_count = 2;
const missingRowTrace = clone(matrix);
missingRowTrace.row_trace.pop();
missingRowTrace.runtime_gap_row_count = 6;
const rowMissingFromUi = clone(matrix);
rowMissingFromUi.row_trace[0].present_in_static_ui_seed = false;
const rowMissingFromDraft = clone(matrix);
rowMissingFromDraft.row_trace[1].present_in_draft_snapshot = false;
const docsBasis = clone(matrix);
docsBasis.dashboard_progress_basis = "roadmap_document_token_progress";
const runtimeClaim = clone(matrix);
runtimeClaim.runtime_claim_allowed = true;
runtimeClaim.row_trace[0].runtime_integration_claim_allowed = true;
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
const packageExecution = clone(matrix);
packageExecution.guard.package_execution_performed = true;
const memoryWrite = clone(matrix);
memoryWrite.guard.DailyNote_write_performed = true;
memoryWrite.guard.VCP_memory_write_performed = true;

const missingSurfaceEval = evaluate(missingSurface, sources);
const missingRowTraceEval = evaluate(missingRowTrace, sources);
const rowMissingFromUiEval = evaluate(rowMissingFromUi, sources);
const rowMissingFromDraftEval = evaluate(rowMissingFromDraft, sources);
const docsBasisEval = evaluate(docsBasis, sources);
const runtimeClaimEval = evaluate(runtimeClaim, sources);
const packageExecutionEval = evaluate(packageExecution, sources);
const memoryWriteEval = evaluate(memoryWrite, sources);

addResult("negative_case_missing_surface_fails", missingSurfaceEval.passed === false && missingSurfaceEval.surfacesOk === false);
addResult("negative_case_missing_row_trace_fails", missingRowTraceEval.passed === false && missingRowTraceEval.rowsOk === false && missingRowTraceEval.countsOk === false);
addResult("negative_case_row_missing_from_static_ui_seed_fails", rowMissingFromUiEval.passed === false && rowMissingFromUiEval.rowsOk === false);
addResult("negative_case_row_missing_from_draft_snapshot_fails", rowMissingFromDraftEval.passed === false && rowMissingFromDraftEval.rowsOk === false);
addResult("negative_case_docs_progress_basis_fails", docsBasisEval.passed === false && docsBasisEval.countsOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_package_execution_flag_fails", packageExecutionEval.passed === false && packageExecutionEval.noRuntimeClaim === false);
addResult("negative_case_memory_write_flag_fails", memoryWriteEval.passed === false && memoryWriteEval.noWrites === false);

for (const token of [
  "review_console_runtime_gap_dashboard_contract_seed",
  "row_id: \"artifact_recoverability\"",
  "row_id: \"production_candidate_archive\"",
]) {
  requireToken("mock_data", mockData, token);
}

for (const token of [
  "review_console_runtime_gap_dashboard_state: reviewConsoleRuntimeGapDashboardState()",
  "function renderReviewConsoleRuntimeGapDashboard()",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "phase_id: v14_205_review_console_runtime_gap_static_ui_panel",
  "static_ui_panel_status: wired_static_only",
  "runtime_gap_row_count: 7",
]) {
  requireToken("static_panel", staticPanel, token);
}

for (const token of [
  "scripts/validate_v14_207_review_console_runtime_gap_trace_matrix_static_regression.js",
  "tests/schema_examples/v14_207_review_console_runtime_gap_trace_matrix_static_regression.example.json",
  "docs/v14_207_review_console_runtime_gap_trace_matrix_static_regression.md",
  "v14_207_review_console_runtime_gap_trace_matrix_static_regression",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_207_review_console_runtime_gap_trace_matrix_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  trace_status: matrix.trace_status,
  surface_count: matrix.surface_count,
  runtime_gap_row_count: matrix.runtime_gap_row_count,
  local_capability_row_count: matrix.local_capability_row_count,
  a5_boundary_row_count: matrix.a5_boundary_row_count,
  dashboard_progress_basis: matrix.dashboard_progress_basis,
  runtime_claim_allowed: matrix.runtime_claim_allowed,
  all_rows_present_in_contract: baseEval.rowsOk,
  all_rows_present_in_static_ui_seed: baseEval.rowsOk,
  all_rows_present_in_draft_snapshot: baseEval.rowsOk,
  static_trace_matrix_only: matrix.guard.static_trace_matrix_only,
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
  negative_case_missing_surface_fails: missingSurfaceEval.passed === false && missingSurfaceEval.surfacesOk === false,
  negative_case_missing_row_trace_fails: missingRowTraceEval.passed === false && missingRowTraceEval.rowsOk === false && missingRowTraceEval.countsOk === false,
  negative_case_row_missing_from_static_ui_seed_fails: rowMissingFromUiEval.passed === false && rowMissingFromUiEval.rowsOk === false,
  negative_case_row_missing_from_draft_snapshot_fails: rowMissingFromDraftEval.passed === false && rowMissingFromDraftEval.rowsOk === false,
  negative_case_docs_progress_basis_fails: docsBasisEval.passed === false && docsBasisEval.countsOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_package_execution_flag_fails: packageExecutionEval.passed === false && packageExecutionEval.noRuntimeClaim === false,
  negative_case_memory_write_flag_fails: memoryWriteEval.passed === false && memoryWriteEval.noWrites === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
