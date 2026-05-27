#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultCaseMatrixPath = "tests/schema_examples/visual_eval_readonly_review_workspace_case_matrix.example.json";
const guard = Object.freeze({
  metadata_only: true,
  read_only: true,
  display_only: true,
  file_write_performed: false,
  approval_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_created: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  memory_write_performed: false,
  Batch_005_started: false,
  production_candidate_002_started: false,
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `path escapes repository root: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function assertGuardClosed(source, label) {
  assert(source?.metadata_only === true, `${label} must be metadata-only`);
  assert(source?.read_only === true, `${label} must be read-only`);
  for (const [field, value] of Object.entries(source || {})) {
    if (field === "metadata_only" || field === "read_only" || field === "display_only") continue;
    assert(value === false, `${label} guard must remain false: ${field}`);
  }
}

function increment(target, key, amount = 1) {
  target[key] = (target[key] || 0) + amount;
}

function pushIndex(target, key, value) {
  target[key] = target[key] || [];
  if (!target[key].includes(value)) target[key].push(value);
}

function buildCorpusMember(matrix, matrixPath) {
  assert(matrix.matrix_type === "metadata_only_visual_eval_readonly_review_workspace_case_matrix", "case matrix type mismatch");
  assertGuardClosed(matrix.guard, "case matrix");
  assert(Array.isArray(matrix.case_rows) && matrix.case_rows.length === 3, "case matrix must have three rows");
  return {
    corpus_member_id: "readonly_workspace_case_matrix_member_001",
    matrix_id: matrix.matrix_id,
    matrix_path: matrixPath,
    selected_review_result_id: matrix.selected_review_result_id,
    case_row_count: matrix.case_rows.length,
    outcomes: matrix.case_rows.map((row) => row.outcome),
    next_review_actions: Object.keys(matrix.indexes?.by_next_review_action || {}),
    metadata_sections: Object.keys(matrix.indexes?.by_metadata_section || {}),
    selected_outcome: (matrix.case_rows || []).find((row) => row.review_result_id === matrix.selected_review_result_id)?.outcome,
    read_only: true,
    write_allowed: false,
  };
}

function loadReadonlyReviewWorkspaceCorpus(input) {
  const matrixPaths = (input?.matrixPaths || [defaultCaseMatrixPath]).map((item) => item.replace(/\\/g, "/"));
  const matrices = input?.matrices || matrixPaths.map((matrixPath) => readJson(matrixPath));
  assert(matrixPaths.length > 0, "corpus requires at least one matrix path");
  assert(matrixPaths.length === matrices.length, "matrix path count must match matrix payload count");
  assert(!hasAbsoluteOrLoopback({ matrixPaths, matrices }), "corpus sources must not expose absolute local paths or loopback URLs");

  const members = matrices.map((matrix, index) => buildCorpusMember(matrix, matrixPaths[index]));
  const outcomeTotals = {};
  const nextActionIndex = {};
  const metadataSectionIndex = {};
  const matrixBySelectedResult = {};

  for (const matrix of matrices) {
    for (const row of matrix.case_rows || []) {
      increment(outcomeTotals, row.outcome);
      pushIndex(nextActionIndex, row.next_review_action, row.review_result_id);
      for (const section of row.metadata_queue_sections || []) pushIndex(metadataSectionIndex, section, row.review_result_id);
    }
    matrixBySelectedResult[matrix.selected_review_result_id] = matrix.matrix_id;
  }

  return {
    corpus_id: "visual_eval_readonly_review_workspace_corpus_v1_synthetic_001",
    corpus_type: "metadata_only_visual_eval_readonly_review_workspace_corpus",
    status: "readonly_review_workspace_corpus_ready",
    source_case_matrices: matrixPaths,
    corpus_contract: {
      metadata_only: true,
      read_only: true,
      canonical_artifact_collection: true,
      matrix_members_must_be_repo_relative: true,
      member_matrices_must_be_readonly: true,
      outcome_index_must_cover_pass_patch_reject: true,
      next_action_index_must_be_readonly: true,
      route_action: "render_readonly_review_workspace_corpus_only",
      write_allowed: false,
    },
    corpus_summary: {
      member_count: members.length,
      total_case_rows: matrices.reduce((sum, matrix) => sum + (matrix.case_rows || []).length, 0),
      outcome_totals: outcomeTotals,
      selected_review_result_ids: matrices.map((matrix) => matrix.selected_review_result_id),
    },
    corpus_members: members,
    indexes: {
      by_outcome: outcomeTotals,
      by_next_review_action: nextActionIndex,
      by_metadata_section: metadataSectionIndex,
      matrix_by_selected_review_result: matrixBySelectedResult,
    },
    readonly_route_guard_summary: {
      route_action: "render_readonly_review_workspace_corpus_only",
      write_allowed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      memory_write_performed: false,
      production_candidate_002_started: false,
    },
    guard: { ...guard },
  };
}

function parseArgValues(argv, flag, fallback) {
  const values = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === flag) values.push(argv[index + 1]);
  }
  return values.length > 0 ? values : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyReviewWorkspaceCorpus({
    matrixPaths: parseArgValues(argv, "--matrix", [defaultCaseMatrixPath]),
  });
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  loadReadonlyReviewWorkspaceCorpus,
};
