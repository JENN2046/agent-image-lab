#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { loadReadonlyReviewWorkspaceCorpus } = require("../kernel/visual_eval_readonly_review_workspace_corpus");

const root = path.resolve(__dirname, "..");
const corpusPath = "tests/schema_examples/visual_eval_readonly_review_workspace_corpus.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_workspace_corpus_negative_cases.example.json";
const matrixPath = "tests/schema_examples/visual_eval_readonly_review_workspace_case_matrix.example.json";
const expectedNegativeCases = new Map([
  ["missing_corpus_member", "corpus_member_count_positive"],
  ["wrong_total_case_rows", "corpus_total_case_rows_matches_members"],
  ["missing_patch_outcome_index", "corpus_outcome_index_covers_pass_patch_reject"],
  ["guard_provider_true", "corpus_guard_provider_contact_performed_false"],
  ["absolute_local_matrix_path", "corpus_no_absolute_or_loopback"],
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
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_review_workspace_corpus.js"), ...args], {
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

function applyMutation(corpus, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(corpus, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_first_member") {
    corpus.corpus_members = corpus.corpus_members.slice(1);
    return;
  }
  if (negativeCase.mutation.operation === "delete_index_key") {
    delete corpus.indexes[negativeCase.mutation.index_name][negativeCase.mutation.key];
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
    addResult("corpus_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function validateCorpusShape(corpus, matrix) {
  addResult("corpus_type_expected", corpus.corpus_type === "metadata_only_visual_eval_readonly_review_workspace_corpus");
  addResult("corpus_status_ready", corpus.status === "readonly_review_workspace_corpus_ready");
  addResult("corpus_source_matrix_expected", Array.isArray(corpus.source_case_matrices) && corpus.source_case_matrices.includes(matrixPath));
  addResult("corpus_no_absolute_or_loopback", !hasAbsoluteOrLoopback(corpus));
  addResult("corpus_contract_route_action_expected", corpus.corpus_contract?.route_action === "render_readonly_review_workspace_corpus_only");
  addResult("corpus_contract_write_allowed_false", corpus.corpus_contract?.write_allowed === false);
  addResult("corpus_member_count_positive", (corpus.corpus_members || []).length > 0);
  addResult("corpus_summary_member_count_matches", corpus.corpus_summary?.member_count === (corpus.corpus_members || []).length);
  addResult("corpus_total_case_rows_matches_members", corpus.corpus_summary?.total_case_rows === (corpus.corpus_members || []).reduce((sum, member) => sum + member.case_row_count, 0));
  addResult("corpus_member_matrix_path_resolves", (corpus.corpus_members || []).every((member) => member.matrix_path === matrixPath && fs.existsSync(repoPath(member.matrix_path))));
  addResult("corpus_member_readonly", (corpus.corpus_members || []).every((member) => member.read_only === true && member.write_allowed === false));
  addResult("corpus_member_matches_matrix", (corpus.corpus_members || []).some((member) => member.matrix_id === matrix.matrix_id && member.selected_review_result_id === matrix.selected_review_result_id));
  addResult("corpus_outcome_index_covers_pass_patch_reject", ["pass", "patch", "reject"].every((outcome) => Number.isInteger(corpus.indexes?.by_outcome?.[outcome]) && corpus.indexes.by_outcome[outcome] > 0));
  addResult("corpus_next_action_index_covers_required_actions", ["queue_for_future_human_review", "write_patch_plan_only", "defer_until_taxonomy_update"].every((action) => Array.isArray(corpus.indexes?.by_next_review_action?.[action])));
  addResult("corpus_metadata_section_index_covers_required_sections", ["accepted_metadata_candidates", "patch_plan_only", "failure_learning_metadata", "archive_references", "next_review_actions"].every((section) => Array.isArray(corpus.indexes?.by_metadata_section?.[section])));
  addResult("corpus_selected_matrix_index_matches", corpus.indexes?.matrix_by_selected_review_result?.[matrix.selected_review_result_id] === matrix.matrix_id);
  addResult("corpus_route_guard_write_allowed_false", corpus.readonly_route_guard_summary?.write_allowed === false);
  for (const [field, expected] of Object.entries(corpus.guard || {})) {
    addResult(`corpus_guard_${field}_${expected}`, corpus.guard[field] === expected);
  }
  addResult("corpus_guard_provider_contact_performed_false", corpus.guard?.provider_contact_performed === false);
}

function validatePositiveCase(corpus, matrix) {
  const directPayload = loadReadonlyReviewWorkspaceCorpus({ matrixPaths: [matrixPath] });
  const cliPayload = runCli(["--matrix", matrixPath]);
  addResult("direct_corpus_matches_cli", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_corpus_matches_example", JSON.stringify(directPayload) === JSON.stringify(corpus));
  validateCorpusShape(corpus, matrix);
}

function validateNegativeCases(corpus, matrix, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_workspace_corpus_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_corpus_expected", negativeCases.source_corpus === corpusPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);
  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(corpus));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateCorpusShape(mutated, matrix));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${corpusPath}_exists`, fs.existsSync(repoPath(corpusPath)), corpusPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${matrixPath}_exists`, fs.existsSync(repoPath(matrixPath)), matrixPath);
  const corpus = readJson(corpusPath);
  const negativeCases = readJson(negativeCasesPath);
  const matrix = readJson(matrixPath);
  validatePositiveCase(corpus, matrix);
  validateNegativeCases(corpus, matrix, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_workspace_corpus",
    passed,
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
  process.stderr.write(`${JSON.stringify({ validator: "validate_visual_eval_readonly_review_workspace_corpus", passed: false, errors }, null, 2)}\n`);
  process.exitCode = 1;
}
