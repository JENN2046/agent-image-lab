#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  loadReadonlyMetadataAccumulationQueueDetailView,
} = require("../kernel/visual_eval_readonly_metadata_accumulation_queue_detail_view");

const root = path.resolve(__dirname, "..");
const detailPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_detail_view.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_detail_view_negative_cases.example.json";
const surfacePath = "tests/schema_examples/visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.example.json";
const selectedReviewResultId = "visual_eval_review_result_patch_synthetic_001";
const selectedSectionId = "patch_plan_only";
const expectedNegativeCases = new Map([
  ["wrong_selected_section", "metadata_queue_detail_selected_section_matches"],
  ["missing_patch_membership", "metadata_queue_detail_patch_section_membership_present"],
  ["guard_memory_true", "metadata_queue_detail_guard_memory_write_performed_false"],
  ["absolute_local_source_surface", "metadata_queue_detail_no_absolute_or_loopback"],
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
  const result = spawnSync(process.execPath, [repoPath("kernel/visual_eval_readonly_metadata_accumulation_queue_detail_view.js"), ...args], {
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

function applyMutation(detail, negativeCase) {
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(detail, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "remove_membership") {
    detail.selected_card[negativeCase.mutation.field] = (detail.selected_card[negativeCase.mutation.field] || []).filter((item) => item !== negativeCase.mutation.value);
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
    addResult("metadata_queue_detail_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function validateDetailShape(detail, surface) {
  addResult("metadata_queue_detail_type_expected", detail.detail_view_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_detail_view");
  addResult("metadata_queue_detail_status_ready", detail.status === "readonly_metadata_accumulation_queue_detail_view_ready");
  addResult("metadata_queue_detail_source_surface_expected", detail.source_surface_snapshot === surfacePath);
  addResult("metadata_queue_detail_no_absolute_or_loopback", !hasAbsoluteOrLoopback(detail));
  addResult("metadata_queue_detail_selected_section_matches", detail.selected_section_id === selectedSectionId);
  addResult("metadata_queue_detail_selected_id_matches", detail.selected_review_result_id === selectedReviewResultId);
  addResult("metadata_queue_detail_card_key_matches", detail.selected_card?.section_id === detail.selected_section_id && detail.selected_card?.review_result_id === detail.selected_review_result_id);
  addResult("metadata_queue_detail_patch_section_membership_present", (detail.selected_card?.section_membership || []).includes("patch_plan_only"));
  addResult("metadata_queue_detail_archive_membership_present", (detail.selected_card?.section_membership || []).includes("archive_references"));
  addResult("metadata_queue_detail_next_action_membership_present", (detail.selected_card?.next_action_membership || []).includes("write_patch_plan_only"));
  addResult("metadata_queue_detail_material_failed_visible", (detail.selected_card?.failure_tags || []).includes("material_failed"));
  addResult("metadata_queue_detail_write_allowed_false", detail.detail_contract?.write_allowed === false);

  const sourceLane = (surface.surface?.section_lanes || []).find((lane) => lane.section_id === detail.selected_section_id);
  const sourceCard = (sourceLane?.cards || []).find((card) => card.review_result_id === detail.selected_review_result_id);
  addResult("metadata_queue_detail_source_card_resolves", Boolean(sourceCard));
  if (sourceCard) {
    addResult("metadata_queue_detail_candidate_matches_source", sourceCard.candidate_id === detail.selected_card?.candidate_id);
    addResult("metadata_queue_detail_next_action_matches_source", sourceCard.next_review_action === detail.selected_card?.next_review_action);
  }

  for (const [field, expected] of Object.entries(detail.guard || {})) {
    addResult(`metadata_queue_detail_guard_${field}_${expected}`, detail.guard[field] === expected);
  }
  addResult("metadata_queue_detail_guard_memory_write_performed_false", detail.guard?.memory_write_performed === false);
}

function validatePositiveCase(detail, surface) {
  const directPayload = loadReadonlyMetadataAccumulationQueueDetailView({ surfacePath });
  const cliPayload = runCli(["--surface", surfacePath]);
  addResult("direct_metadata_queue_detail_matches_cli_detail", JSON.stringify(directPayload) === JSON.stringify(cliPayload));
  addResult("direct_metadata_queue_detail_matches_example_detail", JSON.stringify(directPayload) === JSON.stringify(detail));
  validateDetailShape(detail, surface);
}

function validateNegativeCases(detail, surface, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_metadata_accumulation_queue_detail_view_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_detail_expected", negativeCases.source_detail_view === detailPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);
  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(detail));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectFailureCodes(() => validateDetailShape(mutated, surface));
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${detailPath}_exists`, fs.existsSync(repoPath(detailPath)), detailPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  addResult(`${surfacePath}_exists`, fs.existsSync(repoPath(surfacePath)), surfacePath);
  const detail = readJson(detailPath);
  const negativeCases = readJson(negativeCasesPath);
  const surface = readJson(surfacePath);
  addResult("metadata_queue_detail_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  addResult("surface_json_parseable", true);
  validatePositiveCase(detail, surface);
  validateNegativeCases(detail, surface, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_metadata_accumulation_queue_detail_view",
    passed,
    detail_view: detailPath,
    surface: surfacePath,
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
  process.stderr.write(`${JSON.stringify({ validator: "validate_visual_eval_readonly_metadata_accumulation_queue_detail_view", passed: false, errors }, null, 2)}\n`);
  process.exitCode = 1;
}
