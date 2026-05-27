#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const catalogPath = "tests/schema_examples/visual_eval_readonly_review_artifact_catalog.example.json";
const negativeCasesPath = "tests/schema_examples/visual_eval_readonly_review_artifact_catalog_negative_cases.example.json";
const expectedRoles = [
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
];
const expectedValidators = [
  "scripts/validate_visual_eval_review_result_protocol.js",
  "scripts/validate_visual_eval_review_result_review_bridge_wiring.js",
  "scripts/validate_visual_eval_readonly_review_bundle.js",
  "scripts/validate_visual_eval_readonly_review_bundle_consumer.js",
  "scripts/validate_visual_eval_readonly_review_collection_consumer.js",
  "scripts/validate_visual_eval_readonly_review_collection_query.js",
  "scripts/validate_visual_eval_readonly_review_surface_snapshot.js",
  "scripts/validate_visual_eval_readonly_review_detail_view.js",
  "scripts/validate_visual_eval_readonly_review_detail_navigation.js",
  "scripts/validate_visual_eval_readonly_review_session_drilldown.js",
];
const expectedDisplayFields = [
  "outcome",
  "summary",
  "reasons",
  "failure_taxonomy",
  "blocking_watch_items",
  "next_review_action",
  "metadata_accumulation_action",
];
const expectedNegativeCases = new Map([
  ["missing_consumer_artifact_entry", "catalog_roles_exact"],
  ["wrong_consumer_payload_path", "catalog_consumer_expected_path_matches"],
  ["forbidden_boundary_flag_true", "catalog_boundary_image_generation_performed_false"],
  ["absolute_local_artifact_path", "catalog_no_absolute_or_loopback"],
]);

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

function runNode(scriptPath) {
  return execFileSync(process.execPath, [scriptPath], { cwd: root, encoding: "utf8" });
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function collectCheckCodes(fn) {
  const start = results.length;
  const startErrors = errors.length;
  try {
    fn();
  } catch (error) {
    addResult("catalog_negative_case_exception", false, error.message);
  }
  const newErrors = errors.slice(startErrors);
  results.splice(start);
  errors.splice(startErrors);
  return newErrors.map((error) => error.check);
}

function sameSet(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function hasAbsoluteOrLoopback(value) {
  if (typeof value === "string") {
    return /(?:[A-Za-z]:[\\/]|\\\\|file:\/\/\/?[A-Za-z]:[\\/]|<synthetic-windows-absolute-path>|(?:https?|wss?):\/\/(?:127\.0\.0\.1|localhost|\[::1\]|::1))/i.test(value);
  }
  if (Array.isArray(value)) return value.some((item) => hasAbsoluteOrLoopback(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasAbsoluteOrLoopback(item));
  return false;
}

function getEntry(catalog, role) {
  return (catalog.artifact_entries || []).find((entry) => entry.artifact_role === role);
}

function assertBoundary(catalog) {
  addResult("catalog_boundary_metadata_only_true", catalog.boundary_confirmation?.metadata_only === true);
  addResult("catalog_boundary_read_only_true", catalog.boundary_confirmation?.read_only === true);
  for (const field of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "memory_written",
    "DailyNote_written",
    "VCP_memory_written",
    "accepted_samples_written",
    "production_candidate_002_started",
    "Batch_005_started",
  ]) {
    addResult(`catalog_boundary_${field}_false`, catalog.boundary_confirmation?.[field] === false);
  }
}

function validateArtifactEntries(catalog) {
  addResult("catalog_roles_exact", sameSet((catalog.artifact_entries || []).map((entry) => entry.artifact_role), expectedRoles));
  addResult("catalog_composition_order_exact", sameSet(catalog.composition_order, expectedRoles));
  for (const role of expectedRoles) {
    const entry = getEntry(catalog, role);
    addResult(`catalog_entry_${role}_present`, Boolean(entry));
    if (!entry) continue;
    const artifactPathOk = !hasAbsoluteOrLoopback(entry.path) && fs.existsSync(repoPath(entry.path));
    const validatorPathOk = !hasAbsoluteOrLoopback(entry.validator) && fs.existsSync(repoPath(entry.validator));
    addResult(`catalog_entry_${role}_path_exists`, artifactPathOk, entry.path);
    addResult(`catalog_entry_${role}_validator_exists`, validatorPathOk, entry.validator);
    addResult(`catalog_entry_${role}_canonical_true`, entry.canonical === true);
    addResult(`catalog_entry_${role}_readonly_consumable_true`, entry.readonly_consumable === true);
    if (!artifactPathOk) continue;
    const artifact = readJson(entry.path);
    const typeField = artifact.artifact_type || artifact.fixture_type || artifact.payload_type || artifact.consumer_payload_type || artifact.query_payload_type || artifact.surface_snapshot_type || artifact.detail_view_type || artifact.navigation_type || artifact.drilldown_type;
    addResult(`catalog_entry_${role}_artifact_type_matches`, typeField === entry.artifact_type, typeField);
    addResult(`catalog_entry_${role}_artifact_id_matches`, (artifact.artifact_id || artifact.fixture_id || artifact.payload_id || artifact.consumer_payload_id || artifact.query_payload_id || artifact.surface_snapshot_id || artifact.detail_view_id || artifact.navigation_id || artifact.drilldown_id) === entry.artifact_id);
  }
}

function validateConsumerExpectations(catalog) {
  const consumerEntry = getEntry(catalog, "readonly_consumer_payload");
  const bundleEntry = getEntry(catalog, "readonly_review_bundle");
  const consumer = readJson(consumerEntry.path);
  addResult("catalog_consumer_source_bundle_matches", consumer.source_bundle === bundleEntry.path);
  addResult("catalog_consumer_expected_path_matches", catalog.consumer_expectations?.consumer_payload === consumerEntry.path);
  addResult("catalog_consumer_expected_bundle_matches", catalog.consumer_expectations?.source_bundle === bundleEntry.path);
  addResult("catalog_consumer_outcomes_exact", sameSet(catalog.consumer_expectations?.outcomes, ["pass", "patch", "reject"]));
  addResult("catalog_consumer_display_fields_exact", sameSet(catalog.consumer_expectations?.display_fields, expectedDisplayFields));
  for (const field of expectedDisplayFields) {
    addResult(`consumer_rows_expose_${field}`, (consumer.display_rows || []).every((row) => Object.prototype.hasOwnProperty.call(row, field)));
  }

  const collectionEntry = getEntry(catalog, "readonly_review_collection");
  const collectionConsumerEntry = getEntry(catalog, "readonly_collection_consumer_payload");
  const collectionConsumer = readJson(collectionConsumerEntry.path);
  addResult("catalog_collection_consumer_source_matches", collectionConsumer.source_collection === collectionEntry.path);
  addResult("catalog_collection_consumer_expected_path_matches", catalog.collection_consumer_expectations?.consumer_payload === collectionConsumerEntry.path);
  addResult("catalog_collection_consumer_expected_collection_matches", catalog.collection_consumer_expectations?.source_collection === collectionEntry.path);
  addResult("catalog_collection_consumer_member_count_matches", catalog.collection_consumer_expectations?.member_count === collectionConsumer.collection?.member_count);
  addResult("catalog_collection_consumer_display_row_count_matches", catalog.collection_consumer_expectations?.display_row_count === collectionConsumer.collection?.display_row_count);
  addResult("catalog_collection_consumer_outcomes_exact", sameSet(catalog.collection_consumer_expectations?.outcomes, ["pass", "patch", "reject"]));
  addResult("catalog_collection_consumer_display_fields_exact", sameSet(catalog.collection_consumer_expectations?.display_fields, expectedDisplayFields));
  for (const field of expectedDisplayFields) {
    addResult(`collection_consumer_rows_expose_${field}`, (collectionConsumer.collection_rows || []).every((row) => Object.prototype.hasOwnProperty.call(row, field)));
  }

  const queryEntry = getEntry(catalog, "readonly_collection_query_payload");
  const query = readJson(queryEntry.path);
  addResult("catalog_collection_query_source_matches", query.source_collection_consumer === collectionConsumerEntry.path);
  addResult("catalog_collection_query_expected_path_matches", catalog.collection_query_expectations?.query_payload === queryEntry.path);
  addResult("catalog_collection_query_expected_source_matches", catalog.collection_query_expectations?.source_collection_consumer === collectionConsumerEntry.path);
  addResult("catalog_collection_query_indexed_fields_exact", sameSet(query.query_contract?.indexed_fields, catalog.collection_query_expectations?.indexed_fields || []));
  addResult("catalog_collection_query_outcomes_exact", sameSet(Object.keys(query.indexes?.by_outcome || {}), catalog.collection_query_expectations?.outcomes || []));
  addResult("catalog_collection_query_required_taxonomy_tags_present", (catalog.collection_query_expectations?.required_taxonomy_tags || []).every((tag) => Array.isArray(query.indexes?.by_taxonomy_tag?.[tag])));

  const surfaceEntry = getEntry(catalog, "readonly_surface_snapshot");
  const surface = readJson(surfaceEntry.path);
  addResult("catalog_surface_snapshot_expected_path_matches", catalog.surface_snapshot_expectations?.surface_snapshot === surfaceEntry.path);
  addResult("catalog_surface_snapshot_source_query_matches", surface.source_query === queryEntry.path);
  addResult("catalog_surface_snapshot_source_consumer_matches", surface.source_collection_consumer === collectionConsumerEntry.path);
  addResult("catalog_surface_snapshot_expected_query_matches", catalog.surface_snapshot_expectations?.source_query === queryEntry.path);
  addResult("catalog_surface_snapshot_expected_consumer_matches", catalog.surface_snapshot_expectations?.source_collection_consumer === collectionConsumerEntry.path);
  addResult("catalog_surface_snapshot_sections_exact", sameSet(surface.snapshot_contract?.surface_sections, catalog.surface_snapshot_expectations?.surface_sections || []));
  addResult("catalog_surface_snapshot_total_cards_matches", surface.surface?.total_cards === catalog.surface_snapshot_expectations?.total_cards);
  addResult("catalog_surface_snapshot_outcomes_exact", sameSet((surface.surface?.outcome_lanes || []).map((lane) => lane.outcome), catalog.surface_snapshot_expectations?.outcomes || []));

  const detailEntry = getEntry(catalog, "readonly_detail_view");
  const detail = readJson(detailEntry.path);
  addResult("catalog_detail_view_expected_path_matches", catalog.detail_view_expectations?.detail_view === detailEntry.path);
  addResult("catalog_detail_view_source_surface_matches", detail.source_surface_snapshot === surfaceEntry.path);
  addResult("catalog_detail_view_source_consumer_matches", detail.source_collection_consumer === collectionConsumerEntry.path);
  addResult("catalog_detail_view_expected_surface_matches", catalog.detail_view_expectations?.source_surface_snapshot === surfaceEntry.path);
  addResult("catalog_detail_view_expected_consumer_matches", catalog.detail_view_expectations?.source_collection_consumer === collectionConsumerEntry.path);
  addResult("catalog_detail_view_selected_id_matches", detail.selected_review_result_id === catalog.detail_view_expectations?.selected_review_result_id);
  addResult("catalog_detail_view_selected_outcome_matches", detail.selected_card?.outcome === catalog.detail_view_expectations?.selected_outcome);
  addResult("catalog_detail_view_taxonomy_membership_present", (catalog.detail_view_expectations?.required_taxonomy_membership || []).every((tag) => (detail.selected_card?.taxonomy_section_membership || []).includes(tag)));
  addResult("catalog_detail_view_next_action_membership_present", (catalog.detail_view_expectations?.required_next_action_membership || []).every((action) => (detail.selected_card?.next_action_queue_membership || []).includes(action)));

  const navigationEntry = getEntry(catalog, "readonly_detail_navigation");
  const navigation = readJson(navigationEntry.path);
  addResult("catalog_detail_navigation_expected_path_matches", catalog.detail_navigation_expectations?.detail_navigation === navigationEntry.path);
  addResult("catalog_detail_navigation_source_surface_matches", navigation.source_surface_snapshot === surfaceEntry.path);
  addResult("catalog_detail_navigation_source_consumer_matches", navigation.source_collection_consumer === collectionConsumerEntry.path);
  addResult("catalog_detail_navigation_source_detail_kernel_matches", navigation.source_detail_kernel === catalog.detail_navigation_expectations?.source_detail_kernel);
  addResult("catalog_detail_navigation_expected_surface_matches", catalog.detail_navigation_expectations?.source_surface_snapshot === surfaceEntry.path);
  addResult("catalog_detail_navigation_expected_consumer_matches", catalog.detail_navigation_expectations?.source_collection_consumer === collectionConsumerEntry.path);
  addResult("catalog_detail_navigation_selected_id_matches", navigation.selected_review_result_id === catalog.detail_navigation_expectations?.selected_review_result_id);
  addResult("catalog_detail_navigation_selected_detail_matches", navigation.selected_detail?.selected_review_result_id === navigation.selected_review_result_id);
  addResult("catalog_detail_navigation_item_count_matches", (navigation.navigation_items || []).length === catalog.detail_navigation_expectations?.navigation_item_count);
  addResult("catalog_detail_navigation_outcomes_exact", sameSet((navigation.navigation_items || []).map((item) => item.outcome), catalog.detail_navigation_expectations?.outcomes || []));
  addResult("catalog_detail_navigation_route_actions_expected", (navigation.navigation_items || []).every((item) => item.detail_selector?.route_action === catalog.detail_navigation_expectations?.required_route_action));

  const drilldownEntry = getEntry(catalog, "readonly_session_drilldown");
  const drilldown = readJson(drilldownEntry.path);
  addResult("catalog_session_drilldown_expected_path_matches", catalog.session_drilldown_expectations?.session_drilldown === drilldownEntry.path);
  addResult("catalog_session_drilldown_source_navigation_matches", drilldown.source_detail_navigation === navigationEntry.path);
  addResult("catalog_session_drilldown_source_bridge_matches", drilldown.source_bridge_payload === getEntry(catalog, "bridge_readable_payload").path);
  addResult("catalog_session_drilldown_expected_navigation_matches", catalog.session_drilldown_expectations?.source_detail_navigation === navigationEntry.path);
  addResult("catalog_session_drilldown_expected_bridge_matches", catalog.session_drilldown_expectations?.source_bridge_payload === getEntry(catalog, "bridge_readable_payload").path);
  addResult("catalog_session_drilldown_selected_id_matches", drilldown.selected_review_result_id === catalog.session_drilldown_expectations?.selected_review_result_id);
  addResult("catalog_session_drilldown_session_id_matches", drilldown.session_id === catalog.session_drilldown_expectations?.session_id);
  addResult("catalog_session_drilldown_sibling_case_count_matches", (drilldown.sibling_case_refs || []).length === catalog.session_drilldown_expectations?.sibling_case_count);
  addResult("catalog_session_drilldown_selected_outcome_matches", drilldown.selected_review_row?.outcome === catalog.session_drilldown_expectations?.selected_outcome);
  addResult("catalog_session_drilldown_next_action_matches", drilldown.selected_metadata_accumulation?.metadata_accumulation?.next_review_action === catalog.session_drilldown_expectations?.selected_next_review_action);
}

function runReferencedValidators(catalog) {
  const validators = [...new Set((catalog.artifact_entries || []).map((entry) => entry.validator))];
  addResult("catalog_validator_set_expected", sameSet(validators, expectedValidators));
  for (const validator of validators) {
    const parsed = JSON.parse(runNode(validator));
    addResult(`catalog_referenced_validator_${path.basename(validator)}_passes`, parsed.passed === true, validator);
  }
}

function setByPath(target, fieldPath, value) {
  const segments = fieldPath.split(".");
  let cursor = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    cursor = cursor[segments[index]];
  }
  cursor[segments[segments.length - 1]] = value;
}

function applyMutation(catalog, negativeCase) {
  if (negativeCase.mutation.operation === "remove_entry_by_role") {
    catalog.artifact_entries = catalog.artifact_entries.filter(
      (entry) => entry.artifact_role !== negativeCase.mutation.role
    );
    return;
  }
  if (negativeCase.mutation.operation === "set_field") {
    setByPath(catalog, negativeCase.mutation.field, negativeCase.mutation.value);
    return;
  }
  if (negativeCase.mutation.operation === "set_entry_field_by_role") {
    const entry = getEntry(catalog, negativeCase.mutation.role);
    if (entry) entry[negativeCase.mutation.field] = negativeCase.mutation.value;
    return;
  }
  throw new Error(`unknown mutation operation: ${negativeCase.mutation.operation}`);
}

function validateCatalogShape(catalog, options = {}) {
  addResult("catalog_type_expected", catalog.catalog_type === "metadata_only_visual_eval_readonly_review_artifact_catalog");
  addResult("catalog_version_v1", catalog.version === "v1");
  addResult("catalog_canonical_status_expected", catalog.canonical_status === "canonical_readonly_artifact_catalog");
  addResult("catalog_no_absolute_or_loopback", !hasAbsoluteOrLoopback(catalog));
  assertBoundary(catalog);
  validateArtifactEntries(catalog);
  if (!options.skipConsumerExpectations) validateConsumerExpectations(catalog);
  if (!options.skipReferencedValidators) runReferencedValidators(catalog);
}

function validateNegativeCases(catalog, negativeCases) {
  addResult("negative_cases_fixture_type_expected", negativeCases.fixture_type === "metadata_only_visual_eval_readonly_review_artifact_catalog_negative_cases", negativeCases.fixture_type);
  addResult("negative_cases_source_catalog_expected", negativeCases.source_catalog === catalogPath);
  addResult("negative_cases_array_present", Array.isArray(negativeCases.negative_cases) && negativeCases.negative_cases.length === expectedNegativeCases.size);

  for (const [caseId, expectedCode] of expectedNegativeCases.entries()) {
    const negativeCase = (negativeCases.negative_cases || []).find((item) => item.case_id === caseId);
    addResult(`negative_case_${caseId}_present`, Boolean(negativeCase));
    addResult(`negative_case_${caseId}_expected_code`, negativeCase?.expected_failure_code === expectedCode, negativeCase?.expected_failure_code);
    if (!negativeCase) continue;
    const mutated = JSON.parse(JSON.stringify(catalog));
    applyMutation(mutated, negativeCase);
    const failureCodes = collectCheckCodes(() => {
      validateCatalogShape(mutated, {
        skipReferencedValidators: true,
        skipConsumerExpectations: caseId === "missing_consumer_artifact_entry",
      });
    });
    addResult(`negative_case_${caseId}_fails_closed`, failureCodes.length > 0, failureCodes.join(", "));
    addResult(`negative_case_${caseId}_expected_failure_code`, failureCodes.includes(expectedCode), failureCodes.join(", "));
  }
}

function main() {
  addResult(`${catalogPath}_exists`, fs.existsSync(repoPath(catalogPath)), catalogPath);
  addResult(`${negativeCasesPath}_exists`, fs.existsSync(repoPath(negativeCasesPath)), negativeCasesPath);
  const catalog = readJson(catalogPath);
  const negativeCases = readJson(negativeCasesPath);
  addResult("catalog_json_parseable", true);
  addResult("negative_cases_json_parseable", true);
  validateCatalogShape(catalog);
  validateNegativeCases(catalog, negativeCases);

  const passed = errors.length === 0;
  process.stdout.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_artifact_catalog",
    passed,
    catalog: catalogPath,
    negative_cases: negativeCasesPath,
    artifact_count: catalog.artifact_entries?.length || 0,
    negative_case_count: negativeCases.negative_cases?.length || 0,
    validators_run: expectedValidators,
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
  process.stderr.write(`${JSON.stringify({
    validator: "validate_visual_eval_readonly_review_artifact_catalog",
    passed: false,
    errors,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
