#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const files = {
  doc: "docs/review_console_asset_archive_real_preview_render_gate.md",
  fixture: "tests/schema_examples/ASSET_ARCHIVE_REAL_PREVIEW_RENDER_GATE.example.json",
  mappingFixture: "tests/schema_examples/ASSET_ARCHIVE_READONLY_PREVIEW_ADAPTER_MAPPING_DRAFT.example.json",
  validator: "scripts/validators/review_console/validate_asset_archive_real_preview_render_gate.js"
};

const expectedQuestion = "Render the 3 selected asset_archive preview refs in the Review Console now, yes or no?";
const expectedSkinFallbacks = ["product_still_life", "studio_dashboard", "evidence_blocker"];

const falseGuardKeys = [
  "can_execute_now",
  "can_render_real_preview_now",
  "actual_render_execution_authorized_now",
  "asset_archive_read_performed_by_this_gate",
  "asset_archive_manifest_read_performed_by_this_gate",
  "asset_archive_preview_binary_read_performed_by_this_gate",
  "asset_archive_directory_listing_performed",
  "asset_archive_glob_performed",
  "thumbnail_ref_populated",
  "preview_loaded_or_rendered",
  "browser_preview_load_performed",
  "preview_creation_or_copy_performed",
  "fetch_performed",
  "file_write_performed",
  "source_image_binary_read_performed",
  "hash_extraction_performed",
  "dimensions_extraction_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "failure_samples_write_performed",
  "production_candidate_write_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "push_tag_release_deploy_performed"
];

const checks = [];
const failures = [];

function relPath(rel) {
  return path.join(root, rel);
}

function readText(rel) {
  return fs.readFileSync(relPath(rel), "utf8");
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function addResult(check, passed, detail = null) {
  const result = { check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) };
  checks.push(result);
  if (!result.passed) failures.push(result);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function arrayEquals(left, right) {
  return Array.isArray(left) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
}

function isAllowedPreviewRef(value) {
  return typeof value === "string" &&
    !path.isAbsolute(value) &&
    !value.includes("..") &&
    (
      /^asset_archive\/accepted_samples\/[^/]+\/preview\.webp$/.test(value) ||
      /^asset_archive\/failure_samples\/[^/]+\/preview\.webp$/.test(value)
    );
}

function evaluateGate(gate, mapping) {
  const guard = isPlainObject(gate.guard) ? gate.guard : {};
  const refs = Array.isArray(gate.selected_preview_refs) ? gate.selected_preview_refs : [];
  const budget = isPlainObject(gate.future_render_budget) ? gate.future_render_budget : {};
  const preconditions = isPlainObject(gate.render_preconditions) ? gate.render_preconditions : {};
  const mappingSamples = Array.isArray(mapping.display_samples) ? mapping.display_samples : [];

  const identityOk =
    gate.phase === "review_console_asset_archive_real_preview_render_gate" &&
    gate.gate_status === "prepared_not_authorized" &&
    gate.gate_type === "real_preview_render_gate" &&
    gate.source_mapping_ref === files.mappingFixture &&
    gate.source_mapping_phase === "review_console_asset_archive_readonly_preview_adapter_mapping_draft" &&
    gate.target_contract === "preview_display_state" &&
    gate.can_execute_now === false &&
    gate.can_render_real_preview_now === false &&
    gate.actual_render_execution_authorized_now === false &&
    gate.render_execution_decision_state === "undecided" &&
    gate.requires_separate_render_activation === true &&
    gate.required_future_question === expectedQuestion;

  const mappingOk =
    mapping.phase === "review_console_asset_archive_readonly_preview_adapter_mapping_draft" &&
    mapping.can_render_real_preview_now === false &&
    mapping.guard.asset_archive_read_performed_by_mapping === false &&
    mapping.guard.preview_loaded_or_rendered === false &&
    mappingSamples.length === 3;

  const refsOk =
    gate.selected_preview_ref_count === 3 &&
    refs.length === 3 &&
    refs.every((ref, index) => {
      const sample = mappingSamples[index];
      return Boolean(sample) &&
        ref.preview_id === sample.preview_id &&
        ref.version_id === sample.version_id &&
        ref.preview_ref === sample.source_asset_ref &&
        ref.mapping_thumbnail_ref === null &&
        sample.thumbnail_ref === null &&
        ref.current_render_mode === "css_skin_only" &&
        sample.render_mode === "css_skin_only" &&
        ref.future_render_mode_after_activation === "asset_archive_preview_image" &&
        ref.css_skin_fallback === sample.skin_id &&
        ref.css_skin_fallback === expectedSkinFallbacks[index] &&
        ref.real_preview_render_allowed_now === false &&
        ref.preview_loaded_or_rendered === false &&
        isAllowedPreviewRef(ref.preview_ref);
    });

  const budgetOk =
    budget.future_allowed_operation === "browser_load_existing_preview_refs_only" &&
    budget.max_preview_refs === 3 &&
    budget.max_browser_preview_loads === 3 &&
    budget.max_manifest_reads === 0 &&
    budget.max_node_preview_binary_reads === 0 &&
    budget.max_asset_archive_directory_listings === 0 &&
    budget.max_hash_extractions === 0 &&
    budget.max_dimension_extractions === 0 &&
    budget.max_file_writes === 0;

  const preconditionsOk =
    preconditions.mapping_draft_must_validate === true &&
    preconditions.selected_refs_must_match_mapping === true &&
    preconditions.thumbnail_ref_population_allowed_only_after_activation === true &&
    preconditions.css_skin_fallback_required === true &&
    preconditions.receipt_required_after_future_render === true &&
    preconditions.rollback_plan === "restore thumbnail_ref=null and render_mode=css_skin_only" &&
    preconditions.stop_on_fourth_ref === true &&
    preconditions.stop_on_absolute_path === true &&
    preconditions.stop_on_remote_url === true &&
    preconditions.stop_on_directory_listing === true &&
    preconditions.stop_on_hash_or_dimension_requirement === true &&
    preconditions.stop_on_write_requirement === true &&
    preconditions.stop_on_generation_or_memory_requirement === true;

  const guardTrueOk =
    guard.render_gate_draft_only === true &&
    guard.prepared_not_authorized === true &&
    guard.mapping_ref_only === true &&
    guard.real_preview_refs_selected === true;

  const guardFalseOk = falseGuardKeys.every((key) => guard[key] === false);

  return {
    passed: identityOk && mappingOk && refsOk && budgetOk && preconditionsOk && guardTrueOk && guardFalseOk,
    identityOk,
    mappingOk,
    refsOk,
    budgetOk,
    preconditionsOk,
    guardTrueOk,
    guardFalseOk
  };
}

for (const [key, rel] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(relPath(rel)) && fs.statSync(relPath(rel)).isFile(), rel);
}

const doc = readText(files.doc);
const validatorSource = readText(files.validator);
const fixture = readJson(files.fixture).asset_archive_real_preview_render_gate;
const mapping = readJson(files.mappingFixture).asset_archive_readonly_preview_adapter_mapping_draft;
const baseEval = evaluateGate(fixture, mapping);

addResult("render_gate_fixture_passes", baseEval.passed, baseEval);

const executeClaim = clone(fixture);
executeClaim.can_execute_now = true;
executeClaim.guard.can_execute_now = true;
addResult("negative_case_can_execute_now_fails", evaluateGate(executeClaim, mapping).passed === false);

const renderClaim = clone(fixture);
renderClaim.can_render_real_preview_now = true;
renderClaim.guard.can_render_real_preview_now = true;
renderClaim.selected_preview_refs[0].real_preview_render_allowed_now = true;
addResult("negative_case_render_authorized_now_fails", evaluateGate(renderClaim, mapping).passed === false);

const fourthRef = clone(fixture);
fourthRef.selected_preview_refs.push(clone(fourthRef.selected_preview_refs[0]));
fourthRef.selected_preview_ref_count = 4;
addResult("negative_case_fourth_ref_fails", evaluateGate(fourthRef, mapping).refsOk === false);

const thumbnailPopulated = clone(fixture);
thumbnailPopulated.selected_preview_refs[0].mapping_thumbnail_ref = thumbnailPopulated.selected_preview_refs[0].preview_ref;
thumbnailPopulated.guard.thumbnail_ref_populated = true;
addResult("negative_case_thumbnail_ref_populated_fails", evaluateGate(thumbnailPopulated, mapping).passed === false);

const mappingMismatch = clone(fixture);
mappingMismatch.selected_preview_refs[0].preview_ref = "asset_archive/accepted_samples/not_in_mapping/preview.webp";
addResult("negative_case_mapping_ref_mismatch_fails", evaluateGate(mappingMismatch, mapping).refsOk === false);

const directoryListing = clone(fixture);
directoryListing.future_render_budget.max_asset_archive_directory_listings = 1;
directoryListing.guard.asset_archive_directory_listing_performed = true;
addResult("negative_case_directory_listing_fails", evaluateGate(directoryListing, mapping).passed === false);

for (const token of [
  "gate_status: prepared_not_authorized",
  "gate_type: real_preview_render_gate",
  "can_execute_now: false",
  "can_render_real_preview_now: false",
  "actual_render_execution_authorized_now: false",
  "Render the 3 selected asset_archive preview refs in the Review Console now, yes or no?",
  "future_allowed_operation: browser_load_existing_preview_refs_only",
  "node scripts/validate_asset_archive_real_preview_render_gate.js"
]) {
  addResult(`doc_token_${token}`, doc.includes(token));
}

for (const token of [
  "asset_archive_real_preview_render_gate",
  "selected_preview_refs",
  "future_render_budget",
  "render_preconditions",
  "can_render_real_preview_now",
  "preview_loaded_or_rendered",
  "browser_preview_load_performed"
]) {
  addResult(`fixture_token_${token}`, JSON.stringify(fixture).includes(token));
}

const forbiddenArchiveOpenPatterns = [
  "fs." + "readdirSync(path.join(root, " + JSON.stringify("asset_archive") + ")",
  "fs." + "readFileSync(path.join(root, " + JSON.stringify("asset_archive"),
  ["gl", "ob("].join(""),
  ["fast", "-glob"].join("")
];
addResult(
  "validator_does_not_open_real_asset_archive",
  forbiddenArchiveOpenPatterns.every((pattern) => !validatorSource.includes(pattern))
);

const passed = failures.length === 0;
const output = {
  validator: "validate_asset_archive_real_preview_render_gate",
  version: "v1",
  passed,
  status: passed ? "asset_archive_real_preview_render_gate_verified" : "asset_archive_real_preview_render_gate_failed",
  gate_status: fixture.gate_status,
  gate_type: fixture.gate_type,
  can_execute_now: fixture.can_execute_now,
  can_render_real_preview_now: fixture.can_render_real_preview_now,
  actual_render_execution_authorized_now: fixture.actual_render_execution_authorized_now,
  render_execution_decision_state: fixture.render_execution_decision_state,
  selected_preview_ref_count: fixture.selected_preview_ref_count,
  max_browser_preview_loads: fixture.future_render_budget.max_browser_preview_loads,
  preview_loaded_or_rendered: fixture.guard.preview_loaded_or_rendered,
  browser_preview_load_performed: fixture.guard.browser_preview_load_performed,
  asset_archive_read_performed_by_this_gate: fixture.guard.asset_archive_read_performed_by_this_gate,
  file_write_performed: fixture.guard.file_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  image_generation_performed: fixture.guard.image_generation_performed,
  DailyNote_write_performed: fixture.guard.DailyNote_write_performed,
  VCP_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  check_count: checks.length,
  failed_count: failures.length,
  checks,
  failures
};

console.log(JSON.stringify(output, null, 2));
process.exit(passed ? 0 : 1);
