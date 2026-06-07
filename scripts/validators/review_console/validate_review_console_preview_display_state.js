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

const trueGuardKeys = [
  "exact_asset_archive_preview_refs_only",
  "asset_archive_read_performed",
  "asset_archive_ui_read_performed",
  "preview_loaded_or_rendered",
  "browser_preview_load_performed"
];

const falseGuardKeys = [
  "static_proxy_only",
  "css_skin_only",
  "exact_source_original_refs_only",
  "browser_original_image_load_performed",
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

const forbiddenSourcePatterns = [
  { name: "source_image_binary_read_true", pattern: /source_image_binary_read_performed:\s*true/ },
  { name: "browser_original_image_load_true", pattern: /browser_original_image_load_performed:\s*true/ },
  { name: "stage_original_ref_source", pattern: /stage_image_ref:\s*originalRef/ },
  { name: "thumbnail_original_ref_source", pattern: /thumbnail_ref:\s*originalRef/ },
  { name: "original_ref_image_source_mode", pattern: /image_source_mode:\s*"source_original_ref"/ },
  { name: "asset_archive_original_render_mode", pattern: /render_mode:\s*"asset_archive_original_image"/ },
  { name: "source_original_required_policy", pattern: /source_original_ref_required_for_real_review/ }
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

function skinById(skinId) {
  return expectedSkins.find((skin) => skin.skin_id === skinId) || null;
}

function isString(value) {
  return typeof value === "string" && value.length > 0;
}

function scoreOk(score) {
  return score === null || Number.isInteger(score);
}

function hasValidCssAssetRef(sample) {
  if (!isString(sample.source_asset_ref)) return false;
  return sample.source_asset_ref === "static_proxy/no_asset_archive_read" ||
    (sample.source_asset_ref.startsWith("asset_archive/candidates/") && sample.source_asset_ref.endsWith(".placeholder"));
}

function isRealPreviewSample(sample, expectedIndex) {
  const skin = skinById(sample.skin_id);
  const expectedPreviewRef = selectedTrackedPreviewRefs[expectedIndex];
  const expectedOriginalRef = legacyUntrackedSourceOriginalRefs[expectedIndex];
  return Boolean(skin) &&
    isString(sample.preview_id) &&
    sample.preview_id.startsWith("preview-display-asset-archive-") &&
    isString(sample.version_id) &&
    Number.isInteger(sample.sample_number) &&
    isString(sample.label) &&
    isString(sample.variant) &&
    scoreOk(sample.score) &&
    sample.skin_label_cn === skin.label_cn &&
    sample.aspect_ratio === skin.aspect_ratio &&
    sample.source_asset_ref === expectedPreviewRef &&
    sample.source_preview_ref === expectedPreviewRef &&
    sample.source_original_ref === expectedOriginalRef &&
    sample.thumbnail_ref === expectedPreviewRef &&
    sample.stage_image_ref === expectedPreviewRef &&
    sample.image_source_mode === "source_preview_ref" &&
    sample.render_mode === "asset_archive_preview_image" &&
    sample.original_image_required === false &&
    sample.source_original_available === false &&
    sample.static_proxy_only === false &&
    sample.asset_archive_read_performed === true &&
    sample.asset_archive_ui_read_performed === true &&
    sample.browser_preview_load_performed === true &&
    sample.browser_original_image_load_performed === false &&
    sample.source_image_binary_read_performed === false &&
    sample.preview_loaded_or_rendered === true;
}

function isCssProxySample(sample) {
  const skin = skinById(sample.skin_id);
  return Boolean(skin) &&
    isString(sample.preview_id) &&
    sample.preview_id.startsWith("preview-display-") &&
    isString(sample.version_id) &&
    Number.isInteger(sample.sample_number) &&
    isString(sample.label) &&
    isString(sample.variant) &&
    scoreOk(sample.score) &&
    sample.skin_label_cn === skin.label_cn &&
    sample.aspect_ratio === skin.aspect_ratio &&
    hasValidCssAssetRef(sample) &&
    sample.source_preview_ref === null &&
    sample.source_original_ref === null &&
    sample.thumbnail_ref === null &&
    sample.stage_image_ref === null &&
    sample.image_source_mode === "css_skin_only" &&
    sample.render_mode === "css_skin_only" &&
    sample.original_image_required === false &&
    sample.source_original_available === false &&
    sample.static_proxy_only === true &&
    sample.asset_archive_read_performed === false &&
    sample.asset_archive_ui_read_performed === false &&
    sample.browser_preview_load_performed === false &&
    sample.browser_original_image_load_performed === false &&
    sample.source_image_binary_read_performed === false &&
    sample.preview_loaded_or_rendered === false;
}

function evaluateSnapshot(snapshot) {
  const guard = isPlainObject(snapshot.guard) ? snapshot.guard : {};
  const samples = Array.isArray(snapshot.display_samples) ? snapshot.display_samples : [];
  const skinIds = expectedSkins.map((skin) => skin.skin_id);
  const sampleSkinIds = new Set(samples.map((sample) => sample.skin_id));
  const firstThreeSamples = samples.slice(0, selectedTrackedPreviewRefs.length);
  const realSamples = samples.filter((sample) => sample.render_mode === "asset_archive_preview_image");
  const cssSamples = samples.filter((sample) => sample.render_mode === "css_skin_only");

  const identityOk =
    snapshot.phase === "review_console_asset_archive_real_preview_render_contract" &&
    snapshot.snapshot_status === "golden_activated_tracked_preview_example" &&
    snapshot.execution_mode === "review_console_asset_archive_real_preview_render_activated" &&
    snapshot.draft_output_key === "preview_display_state" &&
    snapshot.source_static_app_ref === "review_console/static_prototype/app.js#previewDisplayProxyState" &&
    snapshot.source_style_ref === "review_console/static_prototype/styles.css#preview-skin-*" &&
    snapshot.source_mode === "asset_archive_exact_tracked_preview_refs_to_preview_display_state" &&
    snapshot.render_activation_ref === "review_console_asset_archive_real_preview_render_activation_20260608" &&
    snapshot.original_render_activation_ref === "review_console_asset_archive_original_image_zoom_20260608" &&
    snapshot.render_gate_ref === "tests/schema_examples/ASSET_ARCHIVE_REAL_PREVIEW_RENDER_GATE.example.json" &&
    snapshot.real_image_source_policy === "tracked_asset_archive_preview_ref_required_for_clean_checkout_review";

  const selectionOk =
    snapshot.selected_version_id === "accepted_french_summer_rattan_bucket_bag_001" &&
    snapshot.review_session_current_version_id === "v2" &&
    snapshot.selected_preview_id === "preview-display-asset-archive-accepted-french-summer-rattan-bucket-bag-001" &&
    snapshot.selected_sample_number === 21 &&
    snapshot.selected_asset_ref === selectedTrackedPreviewRefs[0] &&
    snapshot.selected_decision_target_source === "selected_asset_archive_preview" &&
    snapshot.selected_skin_id === "product_still_life";

  const skinSetOk =
    arrayEquals(snapshot.available_skin_ids, skinIds) &&
    snapshot.thumbnail_skin_count === expectedSkins.length &&
    skinIds.every((skinId) => sampleSkinIds.has(skinId));

  const countsOk =
    snapshot.real_preview_ref_count === selectedTrackedPreviewRefs.length &&
    snapshot.real_original_ref_count === legacyUntrackedSourceOriginalRefs.length &&
    Number.isInteger(snapshot.stage_zoom_percent) &&
    snapshot.stage_zoom_percent >= 50 &&
    snapshot.stage_zoom_percent <= 400 &&
    guard.selected_preview_ref_count === selectedTrackedPreviewRefs.length &&
    guard.selected_original_ref_count === legacyUntrackedSourceOriginalRefs.length &&
    guard.max_preview_refs === selectedTrackedPreviewRefs.length &&
    guard.max_original_refs === legacyUntrackedSourceOriginalRefs.length;

  const realSamplesOk =
    realSamples.length === selectedTrackedPreviewRefs.length &&
    firstThreeSamples.length === selectedTrackedPreviewRefs.length &&
    firstThreeSamples.every((sample, index) => sample === realSamples[index]) &&
    realSamples.every((sample, index) => isRealPreviewSample(sample, index));

  const cssSamplesOk =
    cssSamples.length >= expectedSkins.length &&
    cssSamples.every((sample) => isCssProxySample(sample));

  const samplesOk =
    samples.length >= selectedTrackedPreviewRefs.length + expectedSkins.length &&
    realSamplesOk &&
    cssSamplesOk;

  const guardTrueOk = trueGuardKeys.every((key) => guard[key] === true);
  const guardFalseOk = falseGuardKeys.every((key) => guard[key] === false);

  return {
    passed: identityOk && selectionOk && skinSetOk && countsOk && samplesOk && guardTrueOk && guardFalseOk,
    identityOk,
    selectionOk,
    skinSetOk,
    countsOk,
    samplesOk,
    realSamplesOk,
    cssSamplesOk,
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
wrongRenderMode.display_samples[0].render_mode = "css_skin_only";
addResult("negative_case_first_real_render_mode_fails", evaluateSnapshot(wrongRenderMode).realSamplesOk === false);

const staticOnlyIdentity = clone(fixture);
staticOnlyIdentity.phase = "review_console_static_preview_display_proxy_contract";
staticOnlyIdentity.snapshot_status = "golden_static_example";
staticOnlyIdentity.execution_mode = "review_console_static_preview_display_proxy_only";
staticOnlyIdentity.source_mode = "review_session_image_versions_to_css_skin_proxy";
staticOnlyIdentity.guard.asset_archive_read_performed = false;
staticOnlyIdentity.guard.asset_archive_ui_read_performed = false;
staticOnlyIdentity.guard.preview_loaded_or_rendered = false;
staticOnlyIdentity.guard.browser_preview_load_performed = false;
addResult("negative_case_static_only_contract_fails", evaluateSnapshot(staticOnlyIdentity).passed === false);

const previewLoadedMissing = clone(fixture);
previewLoadedMissing.guard.preview_loaded_or_rendered = false;
previewLoadedMissing.display_samples[0].preview_loaded_or_rendered = false;
addResult("negative_case_preview_loaded_false_fails", evaluateSnapshot(previewLoadedMissing).passed === false);

const originalImageLoadClaim = clone(fixture);
originalImageLoadClaim.guard.browser_original_image_load_performed = true;
originalImageLoadClaim.display_samples[0].browser_original_image_load_performed = true;
addResult("negative_case_original_image_load_claim_fails", evaluateSnapshot(originalImageLoadClaim).passed === false);

const fourthRealPreview = clone(fixture);
fourthRealPreview.display_samples.push({
  ...clone(fixture.display_samples[0]),
  source_asset_ref: "asset_archive/unselected/preview.webp",
  source_preview_ref: "asset_archive/unselected/preview.webp",
  thumbnail_ref: "asset_archive/unselected/preview.webp",
  stage_image_ref: "asset_archive/unselected/preview.webp"
});
addResult("negative_case_fourth_real_preview_ref_fails", evaluateSnapshot(fourthRealPreview).realSamplesOk === false);

for (const token of [
  "const previewDisplaySkins = [",
  "function previewDisplayProxyState()",
  "function currentReviewTarget(",
  "function setCurrentReviewSampleByOffset(offset)",
  "const samples = reviewSpineSamples()",
  "selectReviewSpineSample(samples[nextIndex])",
  "button.addEventListener(\"click\", () => setCurrentReviewSampleByOffset(1))",
  "button.addEventListener(\"click\", () => setCurrentReviewSampleByOffset(-1))",
  "setReviewSampleFromDataset(versionId, previewId, skinId)",
  'draft_output_key: "preview_display_state"',
  "const reviewTarget = currentReviewTarget(current)",
  "const decisionTarget = currentReviewTarget()",
  "selected_version_id: reviewTarget.version_id",
  "review_session_current_version_id: state.currentVersionId",
  "selected_asset_ref: reviewTarget.output_asset_ref",
  "selected_decision_target_source: reviewTarget.decision_target_source",
  "output_assets: [reviewTarget.output_asset_ref]",
  "file_ref: reviewTarget.output_asset_ref",
  "sample_id: decisionTarget.sample_id",
  "decision_target_source: decisionTarget.decision_target_source",
  "review_console_static_preview_display_proxy_only",
  "review_session_image_versions_to_css_skin_proxy",
  "review_console_asset_archive_real_preview_render_activated",
  "asset_archive_exact_tracked_preview_refs_to_preview_display_state",
  'real_image_source_policy: "tracked_asset_archive_preview_ref_required_for_clean_checkout_review"',
  'const trackedPreviewActive = boundary.boundary_status === "exact_tracked_preview_refs_render_active"',
  'const label = trackedPreviewActive ? "TRACKED PREVIEW"',
  "root.classList.toggle(\"is-active\", active)",
  'stage_image_ref: previewRef',
  'image_source_mode: "source_preview_ref"',
  'render_mode: "asset_archive_preview_image"',
  "source_original_provenance_only",
  'preview_ref_role: "tracked_review_render_source"',
  'original_ref_role: "provenance_only_not_review_render_source"',
  'render_mode: "css_skin_only"',
  "static_proxy_only: true",
  "asset_archive_ui_read_performed",
  "preview_loaded_or_rendered: realRenderActive",
  "browser_preview_load_performed: realRenderActive",
  "preview_display_state: previewDisplayProxyState()",
  "data-preview-skin-id"
]) {
  addResult(`app_token_${token}`, app.includes(token));
}

for (const token of [
  "output_assets: [currentVersion().asset_ref]",
  "file_ref: currentVersion().asset_ref",
  "sample_id: currentVersion()?.version_id || state.currentVersionId",
  "selected_version_id: state.currentVersionId",
  "function setCurrentVersionByOffset(offset)",
  "state.image_versions[nextIndex].version_id"
]) {
  addResult(`app_forbids_stale_decision_token_${token}`, !app.includes(token));
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

const sourceHits = forbiddenSourcePatterns
  .filter(({ pattern }) => pattern.test(app))
  .map(({ name }) => name);
addResult("app_does_not_render_original_or_read_source_binary", sourceHits.length === 0, sourceHits);

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
for (const key of trueGuardKeys) {
  addResult(`fixture_guard_${key}_true`, fixtureText.includes(`"${key}": true`));
}
for (const key of falseGuardKeys) {
  addResult(`fixture_guard_${key}_false`, fixtureText.includes(`"${key}": false`));
}

const realSamples = fixture.display_samples.filter((sample) => sample.render_mode === "asset_archive_preview_image");
const passed = failures.length === 0;
const output = {
  validator: "validate_review_console_preview_display_state",
  version: "v2",
  passed,
  status: passed
    ? "review_console_preview_display_state_activated_tracked_preview_verified"
    : "review_console_preview_display_state_failed",
  draft_output_key: fixture.draft_output_key,
  execution_mode: fixture.execution_mode,
  source_mode: fixture.source_mode,
  real_image_source_policy: fixture.real_image_source_policy,
  thumbnail_skin_count: fixture.thumbnail_skin_count,
  available_skin_ids: fixture.available_skin_ids,
  display_sample_count: fixture.display_samples.length,
  real_preview_ref_count: fixture.real_preview_ref_count,
  real_original_ref_count: fixture.real_original_ref_count,
  selected_preview_refs: realSamples.map((sample) => sample.source_preview_ref),
  source_original_refs_provenance_only: realSamples.map((sample) => sample.source_original_ref),
  asset_archive_read_performed: fixture.guard.asset_archive_read_performed,
  asset_archive_ui_read_performed: fixture.guard.asset_archive_ui_read_performed,
  preview_loaded_or_rendered: fixture.guard.preview_loaded_or_rendered,
  browser_preview_load_performed: fixture.guard.browser_preview_load_performed,
  browser_original_image_load_performed: fixture.guard.browser_original_image_load_performed,
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
