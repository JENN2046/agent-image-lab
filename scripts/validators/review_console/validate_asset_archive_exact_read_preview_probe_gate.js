#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const files = {
  doc: "docs/review_console_asset_archive_exact_read_preview_probe_gate.md",
  fixture: "tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_PREVIEW_PROBE_GATE.example.json",
  validator: "scripts/validators/review_console/validate_asset_archive_exact_read_preview_probe_gate.js"
};

const expectedPreviewRefs = [
  "asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp",
  "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/preview.webp",
  "asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp"
];

const expectedFallbackSkins = [
  "product_still_life",
  "studio_dashboard",
  "evidence_blocker"
];

const falseGuardKeys = [
  "real_asset_archive_read_performed",
  "asset_archive_directory_listing_performed",
  "asset_archive_manifest_read_performed",
  "asset_archive_preview_binary_read_performed",
  "asset_archive_original_binary_read_performed",
  "preview_loaded_or_rendered",
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
  "real_manifest_read_performed",
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

function pathLooksSafeRepoRelative(value) {
  return typeof value === "string" &&
    value.startsWith("asset_archive/") &&
    !value.includes("..") &&
    !value.includes("*") &&
    !value.includes("\\") &&
    !value.startsWith("/") &&
    !/^[A-Za-z]:/.test(value) &&
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    !value.startsWith("file://");
}

function expectedManifestForPreview(previewRef) {
  return previewRef.replace(/\/preview\.webp$/, "/manifest.json");
}

function laneRoot(lane) {
  return lane === "failure" ? "asset_archive/failure_samples/" : "asset_archive/accepted_samples/";
}

function evaluate(gate) {
  const refs = Array.isArray(gate.selected_preview_refs) ? gate.selected_preview_refs : [];
  const limits = isPlainObject(gate.future_probe_limits) ? gate.future_probe_limits : {};
  const overlay = isPlainObject(gate.preview_display_state_overlay) ? gate.preview_display_state_overlay : {};
  const activation = isPlainObject(gate.activation_requirements) ? gate.activation_requirements : {};
  const guard = isPlainObject(gate.guard) ? gate.guard : {};
  const previewRefs = refs.map((item) => item.preview_ref);
  const uniqueRefs = new Set(previewRefs);

  const identityOk =
    gate.phase === "review_console_asset_archive_exact_read_preview_probe_gate" &&
    gate.gate_status === "prepared_not_authorized" &&
    gate.gate_type === "exact_read_probe_gate" &&
    gate.source_adapter_contract_ref === "docs/review_console_asset_archive_readonly_preview_adapter_contract.md" &&
    gate.fixture_ref === "tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_PREVIEW_PROBE_GATE.example.json" &&
    gate.execution_mode === "exact_read_probe_gate_no_execution" &&
    gate.can_execute_now === false &&
    gate.requires_separate_activation === true;

  const refsOk =
    refs.length >= 1 &&
    refs.length <= 3 &&
    refs.length === uniqueRefs.size &&
    arrayEquals(previewRefs, expectedPreviewRefs) &&
    refs.every((item) =>
      typeof item.preview_probe_id === "string" &&
      item.preview_probe_id.startsWith("exact-read-preview-probe-") &&
      ["accepted", "failure"].includes(item.lane) &&
      typeof item.sample_id === "string" &&
      item.preview_ref.startsWith(laneRoot(item.lane)) &&
      item.preview_ref.endsWith("/preview.webp") &&
      item.manifest_ref === expectedManifestForPreview(item.preview_ref) &&
      pathLooksSafeRepoRelative(item.preview_ref) &&
      pathLooksSafeRepoRelative(item.manifest_ref) &&
      item.preview_mime_type === "image/webp" &&
      expectedFallbackSkins.includes(item.css_skin_fallback) &&
      typeof item.selection_source_ref === "string" &&
      !item.selection_source_ref.startsWith("asset_archive/") &&
      ["checked_in_doc_reference", "checked_in_schema_reference"].includes(item.selection_source_kind) &&
      item.existence_verified_now === false &&
      item.manifest_read_performed === false &&
      item.preview_binary_read_performed === false &&
      item.preview_loaded_or_rendered === false
    );

  const limitsOk =
    limits.max_preview_refs === 3 &&
    limits.max_manifest_reads === 3 &&
    limits.max_preview_loads === 3 &&
    limits.retry_allowed === false &&
    limits.fallback_to_glob_allowed === false &&
    limits.directory_listing_allowed === false &&
    limits.broad_asset_archive_glob_allowed === false &&
    limits.allowed_operation === "read_selected_manifest_and_preview_refs_only";

  const overlayOk =
    overlay.target_draft_output_key === "preview_display_state" &&
    overlay.preserve_current_review_session_version === true &&
    overlay.thumbnail_ref_source === "selected_preview_refs.preview_ref" &&
    overlay.manifest_ref_source === "selected_preview_refs.manifest_ref" &&
    overlay.css_skin_fallback_source === "selected_preview_refs.css_skin_fallback" &&
    overlay.do_not_infer_archive_approval === true &&
    overlay.do_not_infer_production_candidate_readiness === true &&
    overlay.do_not_infer_memory_readiness === true;

  const activationOk =
    activation.requires_separate_exact_read_activation === true &&
    activation.activation_must_repeat_selected_refs === true &&
    activation.activation_must_define_receipt_path === true &&
    activation.activation_must_define_rollback_plan === true &&
    activation.activation_must_stop_on_missing_ref === true &&
    activation.activation_must_stop_on_any_write_need === true &&
    activation.activation_must_not_expand_to_glob === true;

  const guardTrueOk =
    guard.gate_package_only === true &&
    guard.read_only_intent === true &&
    guard.can_execute_now === false;

  const guardFalseOk = falseGuardKeys.every((key) => guard[key] === false);

  return {
    passed: identityOk && refsOk && limitsOk && overlayOk && activationOk && guardTrueOk && guardFalseOk,
    identityOk,
    refsOk,
    limitsOk,
    overlayOk,
    activationOk,
    guardTrueOk,
    guardFalseOk
  };
}

for (const [key, rel] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(relPath(rel)) && fs.statSync(relPath(rel)).isFile(), rel);
}

const doc = readText(files.doc);
const validatorSource = readText(files.validator);
const fixture = readJson(files.fixture).asset_archive_exact_read_preview_probe_gate;
const baseEval = evaluate(fixture);

addResult("probe_gate_fixture_passes", baseEval.passed, baseEval);

const executeNow = clone(fixture);
executeNow.can_execute_now = true;
executeNow.guard.can_execute_now = true;
addResult("negative_case_can_execute_now_fails", evaluate(executeNow).passed === false);

const broadRef = clone(fixture);
broadRef.selected_preview_refs[0].preview_ref = "asset_archive/**";
addResult("negative_case_broad_asset_archive_ref_fails", evaluate(broadRef).refsOk === false);

const fourthRef = clone(fixture);
fourthRef.selected_preview_refs.push(clone(fourthRef.selected_preview_refs[0]));
fourthRef.selected_preview_refs[3].preview_ref = "asset_archive/accepted_samples/fourth_sample/preview.webp";
fourthRef.selected_preview_refs[3].manifest_ref = "asset_archive/accepted_samples/fourth_sample/manifest.json";
addResult("negative_case_fourth_preview_ref_fails", evaluate(fourthRef).refsOk === false);

const previewLoaded = clone(fixture);
previewLoaded.selected_preview_refs[0].preview_loaded_or_rendered = true;
previewLoaded.guard.preview_loaded_or_rendered = true;
addResult("negative_case_preview_loaded_claim_fails", evaluate(previewLoaded).passed === false);

const originalAsset = clone(fixture);
originalAsset.selected_preview_refs[0].preview_ref = "asset_archive/original_assets/by_sha256/example.webp";
originalAsset.selected_preview_refs[0].manifest_ref = "asset_archive/original_assets/by_sha256/manifest.json";
addResult("negative_case_original_asset_ref_fails", evaluate(originalAsset).refsOk === false);

for (const token of [
  "gate_status: prepared_not_authorized",
  "can_execute_now: false",
  "requires_separate_activation: true",
  "asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp",
  "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/preview.webp",
  "asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp",
  "node scripts/validate_asset_archive_exact_read_preview_probe_gate.js"
]) {
  addResult(`doc_token_${token}`, doc.includes(token));
}

for (const token of [
  "selected_preview_refs",
  "future_probe_limits",
  "preview_display_state_overlay",
  "activation_requirements",
  "real_asset_archive_read_performed",
  "asset_archive_manifest_read_performed",
  "preview_loaded_or_rendered"
]) {
  addResult(`fixture_token_${token}`, JSON.stringify(fixture).includes(token));
}

const forbiddenArchiveOpenPatterns = [
  "fs." + "readdirSync(path.join(root, " + JSON.stringify("asset_archive") + ")",
  "fs." + "readFileSync(path.join(root, " + JSON.stringify("asset_archive")
];
addResult(
  "validator_does_not_open_real_asset_archive",
  forbiddenArchiveOpenPatterns.every((pattern) => !validatorSource.includes(pattern))
);

const passed = failures.length === 0;
const output = {
  validator: "validate_asset_archive_exact_read_preview_probe_gate",
  version: "v1",
  passed,
  status: passed ? "asset_archive_exact_read_preview_probe_gate_verified" : "asset_archive_exact_read_preview_probe_gate_failed",
  gate_status: fixture.gate_status,
  gate_type: fixture.gate_type,
  can_execute_now: fixture.can_execute_now,
  selected_preview_ref_count: fixture.selected_preview_refs.length,
  selected_preview_refs: fixture.selected_preview_refs.map((item) => item.preview_ref),
  max_manifest_reads: fixture.future_probe_limits.max_manifest_reads,
  max_preview_loads: fixture.future_probe_limits.max_preview_loads,
  real_asset_archive_read_performed: fixture.guard.real_asset_archive_read_performed,
  asset_archive_directory_listing_performed: fixture.guard.asset_archive_directory_listing_performed,
  asset_archive_manifest_read_performed: fixture.guard.asset_archive_manifest_read_performed,
  asset_archive_preview_binary_read_performed: fixture.guard.asset_archive_preview_binary_read_performed,
  preview_loaded_or_rendered: fixture.guard.preview_loaded_or_rendered,
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
