#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const files = {
  fixture: "tests/schema_examples/REVIEW_CONSOLE_PREVIEW_DISPLAY_STATE.example.json",
  app: "review_console/static_prototype/app.js",
  styles: "review_console/static_prototype/styles.css",
  server: "scripts/serve_review_console_static.js"
};

const expectedSkins = [
  {
    skin_id: "studio_dashboard",
    skin_class: "preview-skin-studio-dashboard",
    label_cn: "三仪表看板",
    aspect_ratio: "16:9"
  },
  {
    skin_id: "product_still_life",
    skin_class: "preview-skin-product-still-life",
    label_cn: "商品静物",
    aspect_ratio: "4:5"
  },
  {
    skin_id: "editorial_portrait",
    skin_class: "preview-skin-editorial-portrait",
    label_cn: "编辑肖像",
    aspect_ratio: "3:4"
  },
  {
    skin_id: "evidence_blocker",
    skin_class: "preview-skin-evidence-blocker",
    label_cn: "阻断证据",
    aspect_ratio: "1:1"
  }
];

const falseGuardKeys = [
  "asset_archive_read_performed",
  "asset_archive_ui_read_performed",
  "preview_loaded_or_rendered",
  "preview_creation_or_copy_performed",
  "fetch_performed",
  "file_write_performed",
  "source_image_binary_read_performed",
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
  "real_vcptoolbox_read_performed"
];

const forbiddenTrueSourcePatterns = [
  { name: "asset_archive_read_true", pattern: /asset_archive_read_performed:\s*true/ },
  { name: "asset_archive_ui_read_true", pattern: /asset_archive_ui_read_performed:\s*true/ },
  { name: "preview_loaded_true", pattern: /preview_loaded_or_rendered:\s*true/ },
  { name: "preview_creation_true", pattern: /preview_creation_or_copy_performed:\s*true/ },
  { name: "source_image_binary_read_true", pattern: /source_image_binary_read_performed:\s*true/ }
];

const selectedTrackedPreviewRefs = [
  "asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp",
  "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/preview.webp",
  "asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp"
];

const legacyUntrackedSourceOriginalRefs = [
  "runs/real_generation/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_run/native_doubao_1778327047448_0.jpg",
  "runs/real_generation/v7_24_native_doubao_v3_single_real_run/native_doubao_1778322474131_0.jpg",
  "runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg"
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

function hasValidAssetRef(sample) {
  if (typeof sample.source_asset_ref !== "string" || sample.source_asset_ref.length === 0) return false;
  if (sample.source_asset_ref.startsWith("asset_archive/")) return sample.source_asset_ref.endsWith(".placeholder");
  return sample.source_asset_ref === "static_proxy/no_asset_archive_read";
}

function evaluateSnapshot(snapshot) {
  const guard = isPlainObject(snapshot.guard) ? snapshot.guard : {};
  const samples = Array.isArray(snapshot.display_samples) ? snapshot.display_samples : [];
  const skinIds = expectedSkins.map((skin) => skin.skin_id);
  const sampleSkinIds = new Set(samples.map((sample) => sample.skin_id));

  const identityOk =
    snapshot.phase === "review_console_static_preview_display_proxy_contract" &&
    snapshot.snapshot_status === "golden_static_example" &&
    snapshot.execution_mode === "review_console_static_preview_display_proxy_only" &&
    snapshot.draft_output_key === "preview_display_state" &&
    snapshot.source_static_app_ref === "review_console/static_prototype/app.js#previewDisplayProxyState" &&
    snapshot.source_style_ref === "review_console/static_prototype/styles.css#preview-skin-*" &&
    snapshot.source_mode === "review_session_image_versions_to_css_skin_proxy";

  const selectionOk =
    snapshot.selected_version_id === "v2" &&
    snapshot.selected_preview_id === "preview-display-v2" &&
    snapshot.selected_skin_id === "studio_dashboard";

  const skinSetOk =
    arrayEquals(snapshot.available_skin_ids, skinIds) &&
    snapshot.thumbnail_skin_count === expectedSkins.length;

  const samplesOk =
    samples.length >= expectedSkins.length &&
    skinIds.every((skinId) => sampleSkinIds.has(skinId)) &&
    samples.every((sample) => {
      const skin = expectedSkins.find((item) => item.skin_id === sample.skin_id);
      return Boolean(skin) &&
        typeof sample.preview_id === "string" &&
        sample.preview_id.startsWith("preview-display-") &&
        typeof sample.version_id === "string" &&
        Number.isInteger(sample.sample_number) &&
        typeof sample.label === "string" &&
        typeof sample.variant === "string" &&
        Number.isInteger(sample.score) &&
        sample.skin_label_cn === skin.label_cn &&
        sample.aspect_ratio === skin.aspect_ratio &&
        hasValidAssetRef(sample) &&
        sample.thumbnail_ref === null &&
        sample.render_mode === "css_skin_only" &&
        sample.static_proxy_only === true &&
        sample.asset_archive_read_performed === false &&
        sample.preview_loaded_or_rendered === false;
    });

  const guardTrueOk =
    guard.static_proxy_only === true &&
    guard.css_skin_only === true;

  const guardFalseOk = falseGuardKeys.every((key) => guard[key] === false);

  return {
    passed: identityOk && selectionOk && skinSetOk && samplesOk && guardTrueOk && guardFalseOk,
    identityOk,
    selectionOk,
    skinSetOk,
    samplesOk,
    guardTrueOk,
    guardFalseOk
  };
}

for (const [key, rel] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(relPath(rel)) && fs.statSync(relPath(rel)).isFile(), rel);
}

const fixture = readJson(files.fixture).review_console_preview_display_state_snapshot;
const app = readText(files.app);
const styles = readText(files.styles);
const serverText = readText(files.server);
const staticServer = require(relPath(files.server));

const baseEval = evaluateSnapshot(fixture);
addResult("preview_display_state_fixture_contract_passes", baseEval.passed, baseEval);

const missingSkin = clone(fixture);
missingSkin.available_skin_ids = missingSkin.available_skin_ids.filter((skinId) => skinId !== "evidence_blocker");
addResult("negative_case_missing_skin_fails", evaluateSnapshot(missingSkin).skinSetOk === false);

const wrongRenderMode = clone(fixture);
wrongRenderMode.display_samples[0].render_mode = "asset_archive_image";
addResult("negative_case_asset_render_mode_fails", evaluateSnapshot(wrongRenderMode).samplesOk === false);

const archiveReadClaim = clone(fixture);
archiveReadClaim.guard.asset_archive_read_performed = true;
archiveReadClaim.display_samples[0].asset_archive_read_performed = true;
addResult("negative_case_asset_archive_read_claim_fails", evaluateSnapshot(archiveReadClaim).passed === false);

const previewLoadedClaim = clone(fixture);
previewLoadedClaim.guard.preview_loaded_or_rendered = true;
previewLoadedClaim.display_samples[0].preview_loaded_or_rendered = true;
addResult("negative_case_preview_loaded_claim_fails", evaluateSnapshot(previewLoadedClaim).passed === false);

for (const token of [
  "const previewDisplaySkins = [",
  "function previewDisplayProxyState()",
  'draft_output_key: "preview_display_state"',
  "review_console_static_preview_display_proxy_only",
  "review_session_image_versions_to_css_skin_proxy",
  "asset_archive_exact_tracked_preview_refs_to_preview_display_state",
  'real_image_source_policy: "tracked_asset_archive_preview_ref_required_for_clean_checkout_review"',
  'stage_image_ref: previewRef',
  'image_source_mode: "source_preview_ref"',
  'render_mode: "asset_archive_preview_image"',
  "source_original_provenance_only",
  'render_mode: "css_skin_only"',
  "static_proxy_only: true",
  "asset_archive_ui_read_performed",
  "preview_loaded_or_rendered: false",
  "preview_display_state: previewDisplayProxyState()",
  "data-preview-skin-id"
]) {
  addResult(`app_token_${token}`, app.includes(token));
}

for (const token of [
  'stage_image_ref: originalRef',
  'thumbnail_ref: originalRef',
  'image_source_mode: "source_original_ref"',
  'render_mode: "asset_archive_original_image"',
  'real_image_source_policy: "source_original_ref_required_for_real_review"',
  'preview_ref_role: "provenance_only_not_review_render_source"'
]) {
  addResult(`app_forbids_${token}`, !app.includes(token));
}

for (const skin of expectedSkins) {
  addResult(`app_skin_id_${skin.skin_id}`, app.includes(`skin_id: "${skin.skin_id}"`));
  addResult(`app_skin_class_${skin.skin_class}`, app.includes(`skin_class: "${skin.skin_class}"`));
  addResult(`style_thumb_${skin.skin_class}`, styles.includes(`.spine-sample-thumb.${skin.skin_class}`));
  addResult(`style_stage_${skin.skin_class}`, styles.includes(`.preview-stage-art.${skin.skin_class}`));
}

const sourceHits = forbiddenTrueSourcePatterns
  .filter(({ pattern }) => pattern.test(app))
  .map(({ name }) => name);
addResult("app_does_not_claim_preview_or_archive_side_effects", sourceHits.length === 0, sourceHits);

addResult(
  "server_exports_three_tracked_preview_refs",
  staticServer.exactAssetArchivePreviewRefs instanceof Set &&
    staticServer.exactAssetArchivePreviewRefs.size === selectedTrackedPreviewRefs.length &&
    selectedTrackedPreviewRefs.every((ref) => staticServer.exactAssetArchivePreviewRefs.has(ref))
);
addResult("server_does_not_export_source_original_allowlist", !Object.prototype.hasOwnProperty.call(staticServer, "exactSourceOriginalImageRefs"));
addResult("server_text_does_not_allow_exact_source_original_refs", !serverText.includes("exactSourceOriginalImageRefs"));

for (const ref of selectedTrackedPreviewRefs) {
  const resolved = staticServer.resolveRequestPath(`/${ref}`);
  addResult(`server_allows_tracked_preview_${ref}`, !resolved.errorStatus && fs.existsSync(resolved.filePath), resolved);
}

for (const ref of legacyUntrackedSourceOriginalRefs) {
  const resolved = staticServer.resolveRequestPath(`/${ref}`);
  addResult(`server_blocks_untracked_original_${ref}`, resolved.errorStatus === 403, resolved);
}

const fixtureText = JSON.stringify(fixture, null, 2);
for (const key of falseGuardKeys) {
  addResult(`fixture_guard_${key}_false`, fixtureText.includes(`"${key}": false`));
}

const passed = failures.length === 0;
const output = {
  validator: "validate_review_console_preview_display_state",
  version: "v1",
  passed,
  status: passed ? "review_console_preview_display_state_verified" : "review_console_preview_display_state_failed",
  draft_output_key: fixture.draft_output_key,
  execution_mode: fixture.execution_mode,
  thumbnail_skin_count: fixture.thumbnail_skin_count,
  available_skin_ids: fixture.available_skin_ids,
  display_sample_count: fixture.display_samples.length,
  asset_archive_read_performed: fixture.guard.asset_archive_read_performed,
  asset_archive_ui_read_performed: fixture.guard.asset_archive_ui_read_performed,
  preview_loaded_or_rendered: fixture.guard.preview_loaded_or_rendered,
  preview_creation_or_copy_performed: fixture.guard.preview_creation_or_copy_performed,
  source_image_binary_read_performed: fixture.guard.source_image_binary_read_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  image_generation_performed: fixture.guard.image_generation_performed,
  DailyNote_write_performed: fixture.guard.DailyNote_write_performed,
  VCP_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  check_count: checks.length,
  failed_count: failures.length,
  checks,
  failures
};

console.log(JSON.stringify(output, null, 2));
process.exit(passed ? 0 : 1);
