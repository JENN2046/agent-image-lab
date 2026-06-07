#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const files = {
  doc: "docs/review_console_asset_archive_readonly_preview_adapter_mapping_draft.md",
  fixture: "tests/schema_examples/ASSET_ARCHIVE_READONLY_PREVIEW_ADAPTER_MAPPING_DRAFT.example.json",
  receipt: "reports/review_console_asset_archive_readonly_preview_probe/asset_archive_exact_read_preview_probe_receipt_20260607.json",
  validator: "scripts/validators/review_console/validate_asset_archive_readonly_preview_adapter_mapping_draft.js"
};

const expectedSkins = {
  studio_dashboard: { skin_label_cn: "三仪表看板", aspect_ratio: "16:9" },
  product_still_life: { skin_label_cn: "商品静物", aspect_ratio: "4:5" },
  editorial_portrait: { skin_label_cn: "编辑肖像", aspect_ratio: "3:4" },
  evidence_blocker: { skin_label_cn: "阻断证据", aspect_ratio: "1:1" }
};

const falseGuardKeys = [
  "can_render_real_preview_now",
  "asset_archive_read_performed_by_mapping",
  "asset_archive_manifest_read_performed_by_mapping",
  "asset_archive_preview_binary_read_performed_by_mapping",
  "asset_archive_directory_listing_performed",
  "asset_archive_glob_performed",
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

function isRepoRelativeAssetArchivePreview(value) {
  return typeof value === "string" &&
    !path.isAbsolute(value) &&
    !value.includes("..") &&
    (
      /^asset_archive\/accepted_samples\/[^/]+\/preview\.webp$/.test(value) ||
      /^asset_archive\/failure_samples\/[^/]+\/preview\.webp$/.test(value)
    );
}

function isRepoRelativeAssetArchiveManifest(value) {
  return typeof value === "string" &&
    !path.isAbsolute(value) &&
    !value.includes("..") &&
    (
      /^asset_archive\/accepted_samples\/[^/]+\/manifest\.json$/.test(value) ||
      /^asset_archive\/failure_samples\/[^/]+\/manifest\.json$/.test(value)
    );
}

function receiptRefForSample(receipt, sample) {
  return receipt.selected_refs.find((ref) =>
    ref.ref_id === sample.version_id &&
    ref.preview.path === sample.source_asset_ref &&
    ref.manifest.path === sample.source_manifest_ref
  );
}

function evaluateMapping(mapping, receipt) {
  const guard = isPlainObject(mapping.guard) ? mapping.guard : {};
  const samples = Array.isArray(mapping.display_samples) ? mapping.display_samples : [];
  const receiptSummary = isPlainObject(receipt.execution_summary) ? receipt.execution_summary : {};
  const receiptResult = isPlainObject(receipt.contract_result) ? receipt.contract_result : {};

  const identityOk =
    mapping.phase === "review_console_asset_archive_readonly_preview_adapter_mapping_draft" &&
    mapping.mapping_status === "draft_from_probe_receipt_no_render" &&
    mapping.source_receipt_ref === files.receipt &&
    mapping.source_contract_ref === "docs/review_console_asset_archive_readonly_preview_adapter_contract.md" &&
    mapping.source_probe_gate_ref === "docs/review_console_asset_archive_exact_read_preview_probe_gate.md" &&
    mapping.consumer_contract === "preview_display_state" &&
    mapping.draft_output_key === "preview_display_state" &&
    mapping.execution_mode === "receipt_to_preview_display_state_ref_only_no_render" &&
    mapping.source_mode === "exact_read_probe_receipt_to_css_skin_preview_display_state" &&
    mapping.can_render_real_preview_now === false;

  const skinSetOk =
    arrayEquals(mapping.available_skin_ids, Object.keys(expectedSkins)) &&
    Object.prototype.hasOwnProperty.call(expectedSkins, mapping.selected_skin_id);

  const receiptConsistency = isPlainObject(mapping.receipt_consistency) ? mapping.receipt_consistency : {};
  const receiptOk =
    receipt.receipt_type === "asset_archive_exact_read_preview_probe_receipt" &&
    receiptSummary.status === "completed_validated_real_read_only_probe" &&
    receiptSummary.manifest_reads_performed === 3 &&
    receiptSummary.preview_header_reads_performed === 3 &&
    receiptSummary.missing_ref_count === 0 &&
    receiptResult.all_selected_refs_exist === true &&
    receiptResult.all_manifests_parse_as_json === true &&
    receiptResult.all_previews_have_webp_header === true &&
    receiptConsistency.selected_ref_count === 3 &&
    receiptConsistency.manifest_reads_performed_in_source_receipt === 3 &&
    receiptConsistency.preview_header_reads_performed_in_source_receipt === 3 &&
    receiptConsistency.missing_ref_count_in_source_receipt === 0 &&
    receiptConsistency.all_selected_refs_exist_in_source_receipt === true &&
    receiptConsistency.all_manifests_parse_as_json_in_source_receipt === true &&
    receiptConsistency.all_previews_have_webp_header_in_source_receipt === true;

  const samplesOk =
    samples.length === 3 &&
    Array.isArray(receipt.selected_refs) &&
    receipt.selected_refs.length === 3 &&
    samples.every((sample) => {
      const expectedSkin = expectedSkins[sample.skin_id];
      const receiptRef = receiptRefForSample(receipt, sample);
      const evidence = isPlainObject(sample.adapter_evidence) ? sample.adapter_evidence : {};
      return Boolean(expectedSkin) &&
        Boolean(receiptRef) &&
        typeof sample.preview_id === "string" &&
        sample.preview_id.startsWith("preview-display-asset-archive-") &&
        typeof sample.version_id === "string" &&
        Number.isInteger(sample.sample_number) &&
        typeof sample.label === "string" &&
        typeof sample.variant === "string" &&
        sample.score === null &&
        sample.skin_label_cn === expectedSkin.skin_label_cn &&
        sample.aspect_ratio === expectedSkin.aspect_ratio &&
        isRepoRelativeAssetArchivePreview(sample.source_asset_ref) &&
        isRepoRelativeAssetArchiveManifest(sample.source_manifest_ref) &&
        sample.thumbnail_ref === null &&
        sample.render_mode === "css_skin_only" &&
        sample.adapter_source_mode === "probe_receipt_ref_only" &&
        sample.real_preview_ref_present === true &&
        sample.real_preview_render_allowed === false &&
        sample.asset_archive_read_performed_by_mapping === false &&
        sample.asset_archive_read_performed_in_source_receipt === true &&
        sample.preview_loaded_or_rendered === false &&
        evidence.manifest_parse_status === receiptRef.manifest.parse_status &&
        evidence.manifest_byte_count === receiptRef.manifest.byte_count &&
        arrayEquals(evidence.manifest_root_keys, receiptRef.manifest.root_keys) &&
        evidence.preview_header_bytes_read === receiptRef.preview.bytes_read &&
        evidence.preview_file_size_bytes === receiptRef.preview.file_size_bytes &&
        evidence.detected_container === "riff_webp_header" &&
        receiptRef.preview.detected_container === "riff_webp_header";
    });

  const guardTrueOk =
    guard.mapping_draft_only === true &&
    guard.source_receipt_only === true &&
    guard.preview_display_state_ref_only === true &&
    guard.css_skin_only === true &&
    guard.real_preview_ref_present === true &&
    guard.asset_archive_read_performed_in_source_receipt === true;

  const guardFalseOk = falseGuardKeys.every((key) => guard[key] === false);

  return {
    passed: identityOk && skinSetOk && receiptOk && samplesOk && guardTrueOk && guardFalseOk,
    identityOk,
    skinSetOk,
    receiptOk,
    samplesOk,
    guardTrueOk,
    guardFalseOk
  };
}

for (const [key, rel] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(relPath(rel)) && fs.statSync(relPath(rel)).isFile(), rel);
}

const doc = readText(files.doc);
const validatorSource = readText(files.validator);
const fixture = readJson(files.fixture).asset_archive_readonly_preview_adapter_mapping_draft;
const receipt = readJson(files.receipt);
const baseEval = evaluateMapping(fixture, receipt);

addResult("mapping_fixture_passes", baseEval.passed, baseEval);

const renderAllowed = clone(fixture);
renderAllowed.can_render_real_preview_now = true;
renderAllowed.guard.can_render_real_preview_now = true;
renderAllowed.display_samples[0].real_preview_render_allowed = true;
addResult("negative_case_render_allowed_fails", evaluateMapping(renderAllowed, receipt).passed === false);

const thumbnailLoaded = clone(fixture);
thumbnailLoaded.display_samples[0].thumbnail_ref = thumbnailLoaded.display_samples[0].source_asset_ref;
addResult("negative_case_thumbnail_ref_fails", evaluateMapping(thumbnailLoaded, receipt).samplesOk === false);

const wrongRenderMode = clone(fixture);
wrongRenderMode.display_samples[0].render_mode = "asset_archive_image";
addResult("negative_case_asset_render_mode_fails", evaluateMapping(wrongRenderMode, receipt).samplesOk === false);

const fourthSample = clone(fixture);
fourthSample.display_samples.push(clone(fourthSample.display_samples[0]));
addResult("negative_case_fourth_sample_fails", evaluateMapping(fourthSample, receipt).samplesOk === false);

const missingReceiptEvidence = clone(fixture);
missingReceiptEvidence.display_samples[0].source_asset_ref = "asset_archive/accepted_samples/not_in_receipt/preview.webp";
addResult("negative_case_ref_not_in_receipt_fails", evaluateMapping(missingReceiptEvidence, receipt).samplesOk === false);

for (const token of [
  "mapping_status: draft_from_probe_receipt_no_render",
  "draft_output_key: preview_display_state",
  "execution_mode: receipt_to_preview_display_state_ref_only_no_render",
  "can_render_real_preview_now: false",
  "thumbnail_ref: null",
  "render_mode: css_skin_only",
  "no new `asset_archive/` read",
  "node scripts/validate_asset_archive_readonly_preview_adapter_mapping_draft.js"
]) {
  addResult(`doc_token_${token}`, doc.includes(token));
}

for (const token of [
  "asset_archive_readonly_preview_adapter_mapping_draft",
  "source_receipt_ref",
  "preview_display_state",
  "receipt_consistency",
  "asset_archive_read_performed_by_mapping",
  "asset_archive_read_performed_in_source_receipt",
  "can_render_real_preview_now"
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
  validator: "validate_asset_archive_readonly_preview_adapter_mapping_draft",
  version: "v1",
  passed,
  status: passed ? "asset_archive_readonly_preview_adapter_mapping_draft_verified" : "asset_archive_readonly_preview_adapter_mapping_draft_failed",
  draft_output_key: fixture.draft_output_key,
  mapping_status: fixture.mapping_status,
  source_receipt_ref: fixture.source_receipt_ref,
  display_sample_count: fixture.display_samples.length,
  can_render_real_preview_now: fixture.can_render_real_preview_now,
  source_receipt_real_asset_archive_read_performed: receipt.execution_summary.real_asset_archive_read_performed,
  mapping_asset_archive_read_performed: fixture.guard.asset_archive_read_performed_by_mapping,
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
