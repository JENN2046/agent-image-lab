#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { loadReadonlyReviewCorpusRenderer } = require("../../../kernel/visual_eval_readonly_review_corpus_renderer");

const root = path.resolve(__dirname, "../../..");
const rendererPath = "tests/schema_examples/visual_eval_readonly_review_corpus_renderer.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_corpus_renderer_negative_cases.example.json";
const corpusPath = "tests/schema_examples/visual_eval_readonly_review_workspace_corpus.example.json";
const matrixPath = "tests/schema_examples/visual_eval_readonly_review_workspace_case_matrix.example.json";
const expectedNegativeCases = new Map([
  ["missing_display_row", "renderer_row_count_matches_corpus"],
  ["patch_next_action_mismatch", "renderer_patch_next_action_expected"],
  ["missing_taxonomy_exposure", "renderer_failure_rows_expose_taxonomy"],
  ["missing_metadata_panel", "renderer_metadata_section_panels_exact"],
  ["guard_image_true", "renderer_guard_image_generation_performed_false"],
  ["absolute_local_source_corpus", "renderer_no_absolute_or_loopback"],
]);

const results = [];
const errors = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`path escapes repository root: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function runCli(args) {
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_review_corpus_renderer.js"), ...args], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

function setByPath(target, fieldPath, value) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    cursor = Array.isArray(cursor) ? cursor[Number(segment)] : cursor[segment];
  }
  const last = segments[segments.length - 1];
  if (Array.isArray(cursor)) cursor[Number(last)] = value;
  else cursor[last] = value;
}

function applyMutation(renderer, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(renderer, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_row_by_outcome") {
    renderer.display_model.display_rows = renderer.display_model.display_rows.filter((row) => row.outcome !== negativeCase.mutation.outcome);
    return;
  }
  throw new Error(`unknown mutation operation: ${negativeCase.mutation.operation}`);
}

function collectFailureCodes(fn) {
  const startResults = results.length;
  const startErrors = errors.length;
  try {
    fn();
  } catch (error) {
    addResult("renderer_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function validateRendererShape(renderer, corpus, matrix) {
  const rows = renderer.display_model?.display_rows || [];
  const outcomeSections = renderer.display_model?.outcome_sections || [];
  const nextActionSections = renderer.display_model?.next_action_sections || [];
  const metadataSectionPanels = renderer.display_model?.metadata_section_panels || [];
  addResult("renderer_type_expected", renderer.renderer_type === "metadata_only_visual_eval_readonly_review_corpus_renderer");
  addResult("renderer_status_ready", renderer.status === "readonly_review_corpus_renderer_ready");
  addResult("renderer_source_corpus_expected", renderer.source_corpus === corpusPath);
  addResult("renderer_source_matrix_expected", renderer.source_case_matrix === matrixPath);
  addResult("renderer_no_absolute_or_loopback", !hasAbsoluteOrLoopback(renderer));
  addResult("renderer_contract_route_action_expected", renderer.renderer_contract?.route_action === "render_readonly_review_corpus_display_only");
  addResult("renderer_contract_write_allowed_false", renderer.renderer_contract?.write_allowed === false);
  addResult("renderer_row_count_matches_corpus", rows.length === corpus.corpus_summary?.total_case_rows);
  addResult("renderer_outcomes_exact", sameSet(rows.map((row) => row.outcome), ["pass", "patch", "reject"]));
  addResult("renderer_rows_match_matrix", (matrix.case_rows || []).every((row) => rows.some((displayRow) => displayRow.review_result_id === row.review_result_id && displayRow.summary === row.summary)));
  addResult("renderer_rows_expose_required_fields", rows.every((row) => row.outcome && row.summary && Array.isArray(row.reasons) && row.next_review_action && row.metadata_accumulation_action));
  addResult("renderer_failure_rows_expose_taxonomy", rows.filter((row) => row.outcome !== "pass").every((row) => Array.isArray(row.taxonomy_tags) && row.taxonomy_tags.length > 0));
  addResult("renderer_patch_next_action_expected", rows.find((row) => row.outcome === "patch")?.next_review_action === "write_patch_plan_only");
  addResult("renderer_reject_next_action_expected", rows.find((row) => row.outcome === "reject")?.next_review_action === "defer_until_taxonomy_update");
  addResult("renderer_outcome_sections_exact", sameSet(outcomeSections.map((section) => section.outcome), ["pass", "patch", "reject"]));
  addResult("renderer_outcome_sections_cover_rows", outcomeSections.every((section) => section.count === section.rows.length && section.review_result_ids.every((id) => rows.some((row) => row.review_result_id === id))));
  addResult("renderer_next_action_sections_exact", sameSet(nextActionSections.map((section) => section.section_id), Object.keys(corpus.indexes?.by_next_review_action || {})));
  addResult("renderer_next_action_sections_cover_rows", nextActionSections.every((section) => section.count === section.rows.length && section.review_result_ids.every((id) => rows.some((row) => row.review_result_id === id))));
  addResult("renderer_metadata_section_panels_exact", sameSet(metadataSectionPanels.map((section) => section.section_id), Object.keys(corpus.indexes?.by_metadata_section || {})));
  addResult("renderer_metadata_section_panels_cover_rows", metadataSectionPanels.every((section) => section.count === section.rows.length && section.review_result_ids.every((id) => rows.some((row) => row.review_result_id === id))));
  addResult("renderer_indexes_match_corpus", JSON.stringify(renderer.indexes?.by_next_review_action) === JSON.stringify(corpus.indexes?.by_next_review_action));
  addResult("renderer_route_guard_write_allowed_false", renderer.readonly_route_guard_summary?.write_allowed === false);
  for (const [field, expected] of Object.entries(renderer.guard || {})) {
    addResult(`renderer_guard_${field}_${expected}`, renderer.guard[field] === expected);
  }
  addResult("renderer_guard_image_generation_performed_false", renderer.guard?.image_generation_performed === false);
}

function validatePositiveCase(renderer, corpus, matrix) {
  const directPayload = loadReadonlyReviewCorpusRenderer({ corpusPath, matrixPath });
  const cliPayload = runCli(["--corpus", corpusPath, "--matrix", matrixPath]);
  addResult("direct_renderer_matches_cli", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_renderer_matches_example", JSON.stringify(directPayload) === JSON.stringify(renderer));
  validateRendererShape(renderer, corpus, matrix);
}

function validateNegativeCases(renderer, corpus, matrix, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_corpus_renderer_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_renderer_expected", negativeCases.source_renderer === rendererPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);
  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(renderer));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateRendererShape(mutated, corpus, matrix));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${rendererPath}_exists`, fs.existsSync(repoPath(rendererPath)), rendererPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${corpusPath}_exists`, fs.existsSync(repoPath(corpusPath)), corpusPath);
  addResult(`${matrixPath}_exists`, fs.existsSync(repoPath(matrixPath)), matrixPath);
  const renderer = readJson(rendererPath);
  const negativeCases = readJson(negativeCasesPath);
  const corpus = readJson(corpusPath);
  const matrix = readJson(matrixPath);
  validatePositiveCase(renderer, corpus, matrix);
  validateNegativeCases(renderer, corpus, matrix, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_corpus_renderer",
    passed,
    renderer: rendererPath,
    corpus: corpusPath,
    matrix: matrixPath,
    negative_cases: negativeCasesPath,
    negative_case_count: negativeCases.negative_cases?.length || 0,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_written: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    production_candidate_002_started: false,
    Batch_005_started: false,
    failed_count: errors.length,
    errors,
    results,
  }, null, 2)}\n`);
  process.exitCode = passed ? 0 : 1;
}

try {
  main();
} catch (error) {
  errors.push({ check: "validator_exception", detail: error.message });
  process.stderr.write(`${JSON.stringify({ validator: "validate_visual_eval_readonly_review_corpus_renderer", passed: false, errors }, null, 2)}\n`);
  process.exitCode = 1;
}
