#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const root = path.resolve(__dirname, "../../..");
const catalogPath = "tests/schema_examples/visual_eval_readonly_review_artifact_catalog.example.json";
const rendererPath = "tests/schema_examples/visual_eval_readonly_review_corpus_renderer.example.json";
const consoleHandoffPath = "tests/schema_examples/visual_eval_review_console_readonly_corpus_renderer_static_handoff.example.json";
const catalogValidatorPath = "scripts/validate_visual_eval_readonly_review_artifact_catalog.js";
const consoleValidatorPath = "scripts/validate_visual_eval_review_console_readonly_corpus_renderer.js";

const requiredRoles = [
  "review_result_protocol",
  "failure_taxonomy",
  "metadata_accumulation_contract",
  "bridge_readable_payload",
  "readonly_review_bundle",
  "readonly_consumer_payload",
  "readonly_review_collection",
  "readonly_collection_consumer_payload",
  "readonly_collection_query_payload",
  "readonly_surface_snapshot",
  "readonly_detail_view",
  "readonly_detail_navigation",
  "readonly_session_drilldown",
  "readonly_metadata_accumulation_queue",
  "readonly_metadata_accumulation_queue_consumer",
  "readonly_metadata_accumulation_queue_query",
  "readonly_metadata_accumulation_queue_surface_snapshot",
  "readonly_metadata_accumulation_queue_detail_view",
  "readonly_metadata_accumulation_queue_detail_navigation",
  "readonly_review_workspace",
  "readonly_review_workspace_case_matrix",
  "readonly_review_workspace_corpus",
  "readonly_review_corpus_renderer",
  "review_console_readonly_corpus_renderer_static_handoff",
];

const expectedOutcomes = ["pass", "patch", "reject"];
const expectedNextActions = [
  "queue_for_future_human_review",
  "write_patch_plan_only",
  "defer_until_taxonomy_update",
];
const expectedMetadataSections = [
  "accepted_metadata_candidates",
  "patch_plan_only",
  "failure_learning_metadata",
  "archive_references",
  "next_review_actions",
];
const expectedTaxonomyTags = [
  "material_failed",
  "lighting_failed",
  "subject_drift",
  "commercial_unusable",
];

const forbiddenRouteFields = new Set([
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "memory_write_performed",
  "memory_written",
  "DailyNote_write_performed",
  "DailyNote_written",
  "VCP_memory_write_performed",
  "VCP_memory_written",
  "Batch_005_started",
  "production_candidate_002_started",
  "production_candidate_created",
  "accepted_samples_write_performed",
  "accepted_samples_written",
  "file_write_performed",
  "approval_write_performed",
]);

const negativeCases = [
  {
    case_id: "missing_console_handoff_catalog_role",
    expected_failure_code: "system_catalog_required_roles_present",
    mutate(catalog) {
      catalog.artifact_entries = catalog.artifact_entries.filter(
        (entry) => entry.artifact_role !== "review_console_readonly_corpus_renderer_static_handoff"
      );
    },
  },
  {
    case_id: "console_handoff_image_guard_true",
    expected_failure_code: "system_console_handoff_forbidden_routes_closed",
    mutate(_catalog, _renderer, consoleHandoff) {
      consoleHandoff.guard.image_generation_performed = true;
    },
  },
  {
    case_id: "renderer_missing_reject_row",
    expected_failure_code: "system_renderer_outcomes_cover_pass_patch_reject",
    mutate(_catalog, renderer) {
      renderer.display_model.display_rows = renderer.display_model.display_rows.filter((row) => row.outcome !== "reject");
    },
  },
  {
    case_id: "console_handoff_wrong_renderer_ref",
    expected_failure_code: "system_console_handoff_source_renderer_matches",
    mutate(_catalog, _renderer, consoleHandoff) {
      consoleHandoff.source_renderer_ref = "tests/schema_examples/unknown_renderer.example.json";
    },
  },
];

const results = [];
const errors = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail !== undefined) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function forbiddenRoutesClosed(value) {
  if (Array.isArray(value)) return value.every((item) => forbiddenRoutesClosed(item));
  if (value && typeof value === "object") {
    return Object.entries(value).every(([key, nested]) => {
      if (forbiddenRouteFields.has(key)) return nested === false;
      return forbiddenRoutesClosed(nested);
    });
  }
  return true;
}

function collectRowsByOutcome(rows) {
  return rows.reduce((map, row) => {
    map[row.outcome] = row;
    return map;
  }, {});
}

function collectUnique(rows, field) {
  return [...new Set(rows.flatMap((row) => row[field] || []))];
}

function rowProjection(row) {
  return {
    review_result_id: row.review_result_id,
    candidate_id: row.candidate_id,
    case_id: row.case_id,
    outcome: row.outcome,
    summary: row.summary,
    reasons: row.reasons,
    taxonomy_tags: row.taxonomy_tags,
    blocking_watch_items: row.blocking_watch_items,
    next_review_action: row.next_review_action,
    metadata_accumulation_action: row.metadata_accumulation_action,
    metadata_queue_sections: row.metadata_queue_sections,
    write_allowed: row.write_allowed,
  };
}

function rowsMatchRenderer(renderer, consoleHandoff) {
  const rendererRows = renderer.display_model.display_rows.map(rowProjection);
  return JSON.stringify(rendererRows) === JSON.stringify(consoleHandoff.display_rows);
}

function runNodeValidator(relativePath) {
  const stdout = childProcess.execFileSync(process.execPath, [repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(stdout);
}

function validateSystemShape(catalog, renderer, consoleHandoff, options = {}) {
  const roles = (catalog.artifact_entries || []).map((entry) => entry.artifact_role);
  const entriesByRole = Object.fromEntries((catalog.artifact_entries || []).map((entry) => [entry.artifact_role, entry]));
  const rendererRows = renderer.display_model && Array.isArray(renderer.display_model.display_rows)
    ? renderer.display_model.display_rows
    : [];
  const consoleRows = Array.isArray(consoleHandoff.display_rows) ? consoleHandoff.display_rows : [];
  const rendererRowsByOutcome = collectRowsByOutcome(rendererRows);
  const consoleRowsByOutcome = collectRowsByOutcome(consoleRows);

  addResult("system_catalog_type_expected", catalog.catalog_type === "metadata_only_visual_eval_readonly_review_artifact_catalog");
  addResult("system_catalog_artifact_count_24", catalog.artifact_entries && catalog.artifact_entries.length === 24, roles.length);
  addResult("system_catalog_required_roles_present", sameSet(roles, requiredRoles), roles.join(", "));
  addResult("system_catalog_no_absolute_or_loopback", !hasAbsoluteOrLoopback(catalog));
  addResult("system_catalog_forbidden_routes_closed", forbiddenRoutesClosed(catalog));
  addResult(
    "system_catalog_entries_repo_relative_existing_canonical_readonly",
    (catalog.artifact_entries || []).every((entry) =>
      entry.path &&
      !path.isAbsolute(entry.path) &&
      fs.existsSync(repoPath(entry.path)) &&
      entry.canonical === true &&
      entry.readonly_consumable === true
    )
  );
  addResult(
    "system_catalog_console_handoff_entry_present",
    entriesByRole.review_console_readonly_corpus_renderer_static_handoff &&
      entriesByRole.review_console_readonly_corpus_renderer_static_handoff.path === consoleHandoffPath
  );
  addResult(
    "system_catalog_renderer_entry_present",
    entriesByRole.readonly_review_corpus_renderer &&
      entriesByRole.readonly_review_corpus_renderer.path === rendererPath
  );

  addResult("system_renderer_type_expected", renderer.renderer_type === "metadata_only_visual_eval_readonly_review_corpus_renderer");
  addResult("system_renderer_no_absolute_or_loopback", !hasAbsoluteOrLoopback(renderer));
  addResult("system_renderer_forbidden_routes_closed", forbiddenRoutesClosed(renderer));
  addResult("system_renderer_outcomes_cover_pass_patch_reject", sameSet(rendererRows.map((row) => row.outcome), expectedOutcomes));
  addResult("system_renderer_display_rows_count_3", rendererRows.length === 3, rendererRows.length);
  addResult("system_renderer_next_actions_cover_required", sameSet(rendererRows.map((row) => row.next_review_action), expectedNextActions));
  addResult(
    "system_renderer_metadata_sections_cover_required",
    expectedMetadataSections.every((section) => collectUnique(rendererRows, "metadata_queue_sections").includes(section))
  );
  addResult(
    "system_renderer_patch_reject_taxonomy_tags_present",
    expectedTaxonomyTags.every((tag) => collectUnique(rendererRows, "taxonomy_tags").includes(tag))
  );
  addResult("system_renderer_pass_has_no_taxonomy_tags", (rendererRowsByOutcome.pass?.taxonomy_tags || []).length === 0);
  addResult("system_renderer_patch_has_blocking_watch_items", (rendererRowsByOutcome.patch?.blocking_watch_items || []).length > 0);
  addResult("system_renderer_reject_has_taxonomy_tags", (rendererRowsByOutcome.reject?.taxonomy_tags || []).length > 0);

  addResult(
    "system_console_handoff_type_expected",
    consoleHandoff.artifact_type === "metadata_only_visual_eval_review_console_readonly_corpus_renderer_static_handoff"
  );
  addResult("system_console_handoff_status_draft_ready", consoleHandoff.status === "draft_ready");
  addResult("system_console_handoff_display_only_true", consoleHandoff.display_only === true);
  addResult("system_console_handoff_source_renderer_matches", consoleHandoff.source_renderer_ref === rendererPath);
  addResult("system_console_handoff_no_absolute_or_loopback", !hasAbsoluteOrLoopback(consoleHandoff));
  addResult("system_console_handoff_forbidden_routes_closed", forbiddenRoutesClosed(consoleHandoff));
  addResult("system_console_handoff_rows_match_renderer", rowsMatchRenderer(renderer, consoleHandoff));
  addResult("system_console_handoff_outcomes_cover_pass_patch_reject", sameSet(consoleRows.map((row) => row.outcome), expectedOutcomes));
  addResult("system_console_handoff_next_actions_cover_required", sameSet(consoleRows.map((row) => row.next_review_action), expectedNextActions));
  addResult(
    "system_console_handoff_metadata_sections_cover_required",
    expectedMetadataSections.every((section) => (consoleHandoff.metadata_section_panels || []).some((panel) => panel.section_id === section))
  );
  addResult("system_console_handoff_patch_taxonomy_visible", (consoleRowsByOutcome.patch?.taxonomy_tags || []).length > 0);
  addResult("system_console_handoff_reject_taxonomy_visible", (consoleRowsByOutcome.reject?.taxonomy_tags || []).length > 0);

  if (!options.skipValidatorRuns) {
    const catalogResult = runNodeValidator(catalogValidatorPath);
    const consoleResult = runNodeValidator(consoleValidatorPath);
    addResult("system_catalog_validator_passes", catalogResult.passed === true);
    addResult("system_console_handoff_validator_passes", consoleResult.passed === true);
    addResult("system_catalog_validator_artifact_count_24", catalogResult.artifact_count === 24, catalogResult.artifact_count);
    addResult("system_catalog_validator_negative_cases_present", catalogResult.negative_case_count >= 4, catalogResult.negative_case_count);
    addResult("system_console_validator_negative_cases_present", consoleResult.negative_case_count >= 4, consoleResult.negative_case_count);
    addResult(
      "system_catalog_validator_runs_console_validator",
      (catalogResult.validators_run || []).includes(consoleValidatorPath)
    );
  }
}

function collectFailureCodes(fn) {
  const startResults = results.length;
  const startErrors = errors.length;
  try {
    fn();
  } catch (error) {
    addResult("system_negative_exception", false, error.message);
  }
  const codes = errors.slice(startErrors).map((error) => error.check);
  errors.splice(startErrors);
  results.splice(startResults);
  return codes;
}

function validateNegativeCases(baseCatalog, baseRenderer, baseConsoleHandoff) {
  addResult("system_negative_cases_present", negativeCases.length === 4, negativeCases.length);
  for (const negativeCase of negativeCases) {
    const catalog = clone(baseCatalog);
    const renderer = clone(baseRenderer);
    const consoleHandoff = clone(baseConsoleHandoff);
    negativeCase.mutate(catalog, renderer, consoleHandoff);
    const failureCodes = collectFailureCodes(() => {
      validateSystemShape(catalog, renderer, consoleHandoff, { skipValidatorRuns: true });
    });
    addResult(
      `negative_case_${negativeCase.case_id}_fails_closed`,
      failureCodes.length > 0,
      failureCodes.join(", ")
    );
    addResult(
      `negative_case_${negativeCase.case_id}_expected_failure_code`,
      failureCodes.includes(negativeCase.expected_failure_code),
      failureCodes.join(", ")
    );
  }
}

function main() {
  const catalog = readJson(catalogPath);
  const renderer = readJson(rendererPath);
  const consoleHandoff = readJson(consoleHandoffPath);
  validateSystemShape(catalog, renderer, consoleHandoff);
  validateNegativeCases(catalog, renderer, consoleHandoff);

  const output = {
    validator: "validate_visual_eval_readonly_review_artifact_system",
    passed: errors.length === 0,
    goal_scope: "metadata_only_readonly_review_artifact_system",
    catalog: catalogPath,
    renderer: rendererPath,
    console_handoff: consoleHandoffPath,
    artifact_count: Array.isArray(catalog.artifact_entries) ? catalog.artifact_entries.length : 0,
    negative_case_count: negativeCases.length,
    validators_run: [catalogValidatorPath, consoleValidatorPath],
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
  };

  console.log(JSON.stringify(output, null, 2));
  if (!output.passed) process.exit(1);
}

main();
