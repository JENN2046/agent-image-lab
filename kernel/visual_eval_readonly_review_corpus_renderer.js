#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const defaultCorpusPath = "tests/schema_examples/visual_eval_readonly_review_workspace_corpus.example.json";
const defaultMatrixPath = "tests/schema_examples/visual_eval_readonly_review_workspace_case_matrix.example.json";
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

function buildDisplayRows(matrix) {
  return (matrix.case_rows || []).map((row) => ({
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    case_id: row.case_id,
    outcome: row.outcome,
    selected: row.selected,
    headline: `${row.outcome}: ${row.summary}`,
    summary: row.summary,
    reasons: row.reasons,
    taxonomy_tags: (row.failure_taxonomy || []).map((item) => item.tag_id),
    taxonomy_categories: (row.failure_taxonomy || []).map((item) => item.category_id),
    blocking_watch_items: row.blocking_watch_items,
    next_review_action: row.next_review_action,
    metadata_accumulation_action: row.metadata_accumulation_action,
    metadata_queue_sections: row.metadata_queue_sections,
    route_action: "render_readonly_review_corpus_row_only",
    write_allowed: false,
  }));
}

function buildOutcomeSections(rows, outcomeTotals) {
  return ["pass", "patch", "reject"].map((outcome) => ({
    outcome,
    count: outcomeTotals?.[outcome] || 0,
    review_result_ids: rows.filter((row) => row.outcome === outcome).map((row) => row.review_result_id),
    rows: rows.filter((row) => row.outcome === outcome),
  }));
}

function buildIndexSections(index, rows, sectionType) {
  return Object.entries(index || {}).map(([section_id, reviewResultIds]) => ({
    section_id,
    section_type: sectionType,
    count: reviewResultIds.length,
    review_result_ids: reviewResultIds,
    rows: rows.filter((row) => reviewResultIds.includes(row.review_result_id)),
  }));
}

function loadReadonlyReviewCorpusRenderer(input) {
  const corpusPath = (input?.corpusPath || defaultCorpusPath).replace(/\\/g, "/");
  const matrixPath = (input?.matrixPath || defaultMatrixPath).replace(/\\/g, "/");
  const corpus = input?.corpus || readJson(corpusPath);
  const matrix = input?.matrix || readJson(matrixPath);

  assert(!hasAbsoluteOrLoopback({ corpus, matrix }), "renderer sources must not expose absolute local paths or loopback URLs");
  assert(corpus.corpus_type === "metadata_only_visual_eval_readonly_review_workspace_corpus", "corpus type mismatch");
  assert(matrix.matrix_type === "metadata_only_visual_eval_readonly_review_workspace_case_matrix", "case matrix type mismatch");
  assertGuardClosed(corpus.guard, "corpus");
  assertGuardClosed(matrix.guard, "case matrix");
  assert((corpus.source_case_matrices || []).includes(matrixPath), "renderer matrix must be enumerated by corpus");

  const rows = buildDisplayRows(matrix);
  assert(rows.length === corpus.corpus_summary?.total_case_rows, "renderer row count must match corpus total case rows");

  return {
    renderer_id: "visual_eval_readonly_review_corpus_renderer_v1_synthetic_001",
    renderer_type: "metadata_only_visual_eval_readonly_review_corpus_renderer",
    status: "readonly_review_corpus_renderer_ready",
    source_corpus: corpusPath,
    source_case_matrix: matrixPath,
    renderer_contract: {
      metadata_only: true,
      read_only: true,
      consumes_corpus: true,
      consumes_case_matrix: true,
      display_rows_must_cover_all_cases: true,
      display_rows_must_expose_outcome_taxonomy_next_action: true,
      route_action: "render_readonly_review_corpus_display_only",
      write_allowed: false,
    },
    display_model: {
      title: "Readonly Visual Eval Review Corpus",
      member_count: corpus.corpus_summary?.member_count,
      total_case_rows: corpus.corpus_summary?.total_case_rows,
      outcome_totals: corpus.corpus_summary?.outcome_totals,
      selected_review_result_ids: corpus.corpus_summary?.selected_review_result_ids,
      display_rows: rows,
      outcome_sections: buildOutcomeSections(rows, corpus.corpus_summary?.outcome_totals),
      next_action_sections: buildIndexSections(corpus.indexes?.by_next_review_action, rows, "next_review_action"),
      metadata_section_panels: buildIndexSections(corpus.indexes?.by_metadata_section, rows, "metadata_accumulation_section"),
    },
    indexes: {
      by_outcome: corpus.indexes?.by_outcome,
      by_next_review_action: corpus.indexes?.by_next_review_action,
      by_metadata_section: corpus.indexes?.by_metadata_section,
    },
    readonly_route_guard_summary: {
      route_action: "render_readonly_review_corpus_display_only",
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

function parseArgValue(argv, flag, fallback) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : fallback;
}

function main() {
  const argv = process.argv.slice(2);
  const payload = loadReadonlyReviewCorpusRenderer({
    corpusPath: parseArgValue(argv, "--corpus", defaultCorpusPath),
    matrixPath: parseArgValue(argv, "--matrix", defaultMatrixPath),
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
  loadReadonlyReviewCorpusRenderer,
};
