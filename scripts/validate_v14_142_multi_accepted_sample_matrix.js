#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_142_multi_accepted_sample_matrix.md",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  fashionLookbookIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  fashionLifestyleIndex: "accepted_samples/categories/fashion_lifestyle_still_life.yaml",
  productStillLifeIndex: "accepted_samples/categories/product_still_life.yaml",
  recoverabilityCore: "scripts/lib/artifact_recoverability_core.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const completeSampleIds = [
  "accepted_womens_resort_relaxed_knit_codex_v2_001",
  "accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001",
  "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
];
const legacyArtifactSampleIds = [
  "accepted_french_summer_rattan_bucket_bag_002_shot_1",
  "accepted_french_summer_rattan_bucket_bag_003_shot_2",
  "accepted_french_summer_rattan_bucket_bag_004_shot_3",
];
const expectedPositive = {
  sampleId: completeSampleIds[0],
  importRecordRef: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
  reviewRecordRef: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  closeoutRef: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  imagePath: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png",
  sha256: "9d23208d05427b02ffc177664c1918ed73bf57831a9694be16522fe9a8f3c910",
  dimensions: "1254x1254",
  mimeType: "image/png",
  category: "fashion_lookbook_portrait",
};
const approvalRecordBySampleId = {
  accepted_womens_resort_relaxed_knit_codex_v2_001:
    "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001:
    "docs/v14_161_codex_session_generated_candidate_readiness.md",
  accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001:
    "docs/v14_166_lamp_v3_generated_candidate_readiness.md",
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

function readIfExists(relativePath) {
  return core.exists(relativePath) ? core.read(relativePath) : "";
}

function categoryIndexPath(category) {
  return `accepted_samples/categories/${category}.yaml`;
}

function matrixRowFromBlock(sampleBlock) {
  const sampleId = sampleBlock.sampleId;
  const block = sampleBlock.block;
  const imagePath = core.extractScalarField(block, "image_path");
  const category = core.extractScalarField(block, "category");
  const importRecordRef = core.extractScalarField(block, "import_record_ref");
  const reviewRecordRef = core.extractScalarField(block, "review_doc_ref");
  const verifiedSha256 = core.extractScalarField(block, "verified_sha256") || core.extractScalarField(block, "image_sha256");
  const verifiedDimensions = core.extractScalarField(block, "verified_dimensions") || core.extractScalarField(block, "image_dimensions");
  const verifiedMime = core.extractScalarField(block, "verified_mime");
  const artifactExists = Boolean(imagePath && core.exists(imagePath));
  const artifactMetadata = artifactExists ? core.readImageMetadata(imagePath) : null;
  const actualSha256 = artifactExists ? core.sha256File(imagePath) : null;
  const categoryIndexText = category ? readIfExists(categoryIndexPath(category)) : "";
  const categoryIndexSamples = core.extractCategoryIndexSamples(categoryIndexText);
  const approvalText = approvalRecordBySampleId[sampleId] ? readIfExists(approvalRecordBySampleId[sampleId]) : "";
  const registryApprovalPresent =
    /human_approval:[\s\S]*?approved:\s+true[\s\S]*?approved_by:\s+Jenn/.test(block) ||
    /human_approval:[\s\S]*?approved_by:\s+Jenn/.test(block);

  return {
    sample_id: sampleId,
    category,
    image_path: imagePath,
    import_record_ref: importRecordRef,
    review_record_ref: reviewRecordRef,
    verified_sha256: verifiedSha256,
    verified_dimensions: verifiedDimensions,
    verified_mime: verifiedMime,
    artifact_exists: artifactExists,
    artifact_mime: artifactMetadata?.mimeType || null,
    artifact_dimensions: artifactMetadata?.width && artifactMetadata?.height ? `${artifactMetadata.width}x${artifactMetadata.height}` : null,
    artifact_sha256: actualSha256,
    category_index_contains_sample: categoryIndexSamples.includes(sampleId),
    import_record_exists: Boolean(importRecordRef && core.exists(importRecordRef)),
    review_record_exists: Boolean(reviewRecordRef && core.exists(reviewRecordRef)),
    human_approval_present: approvalText.includes("approved_by: Jenn") || registryApprovalPresent,
  };
}

function validateRecoverabilityRow(row, overrides = {}) {
  const candidate = { ...row, ...overrides };
  const failures = [];

  function check(condition, label) {
    if (!condition) failures.push(label);
  }

  check(Boolean(candidate.image_path), "artifact_path_present");
  check(candidate.artifact_exists === true, "artifact_file_exists");
  check(Boolean(candidate.verified_sha256), "registry_verified_sha256_present");
  check(Boolean(candidate.verified_dimensions), "registry_verified_dimensions_present");
  check(Boolean(candidate.verified_mime), "registry_verified_mime_present");
  check(candidate.artifact_sha256 === candidate.verified_sha256, "artifact_sha256_matches_registry");
  check(candidate.artifact_dimensions === candidate.verified_dimensions, "artifact_dimensions_match_registry");
  check(candidate.artifact_mime === candidate.verified_mime, "artifact_mime_matches_registry");
  check(candidate.import_record_exists === true, "import_record_exists");
  check(candidate.review_record_exists === true, "review_record_exists");
  check(candidate.category_index_contains_sample === true, "category_index_contains_sample");
  check(candidate.human_approval_present === true, "human_approval_present");

  return {
    passed: failures.length === 0,
    failures,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const registry = core.read(files.registry);
const phaseRecord = core.read(files.phaseRecord);
const mvpValidator = core.read(files.mvpValidator);
const recoverabilityCore = core.read(files.recoverabilityCore);
const currentSurfaces = [
  phaseRecord,
  mvpValidator,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
].join("\n");

const registryBlocks = core.listRegistrySampleBlocks(registry);
const matrixRows = registryBlocks.map(matrixRowFromBlock);
const fullRows = matrixRows.filter((row) => validateRecoverabilityRow(row).passed);
const localArtifactRows = matrixRows.filter((row) => row.artifact_exists);
const legacyArtifactRows = matrixRows.filter((row) => legacyArtifactSampleIds.includes(row.sample_id) && row.artifact_exists);
const categorySet = new Set(matrixRows.map((row) => row.category).filter(Boolean));
const positiveRows = completeSampleIds.map((sampleId) => matrixRows.find((row) => row.sample_id === sampleId)).filter(Boolean);
const positiveValidations = positiveRows.map((row) => validateRecoverabilityRow(row));

addResult("registry_has_multiple_samples", registryBlocks.length >= 3, `${registryBlocks.length}`);
addResult("matrix_has_multiple_rows", matrixRows.length >= 3, `${matrixRows.length}`);
addResult("matrix_has_multiple_categories", categorySet.size >= 3, `${categorySet.size}`);
addResult("complete_recoverable_positive_samples_present", positiveRows.length === completeSampleIds.length, `${positiveRows.length}`);
addResult(
  "complete_recoverable_positive_samples_pass",
  positiveValidations.length === completeSampleIds.length && positiveValidations.every((validation) => validation.passed),
  positiveValidations.map((validation) => validation.failures.join("; ")).join(" | "),
);
addResult("legacy_artifact_rows_detected", legacyArtifactRows.length >= 3, `${legacyArtifactRows.length}`);
addResult("legacy_rows_not_promoted_to_full_recoverability", legacyArtifactRows.every((row) => !validateRecoverabilityRow(row).passed));
addResult("local_artifact_rows_detected", localArtifactRows.length >= 4, `${localArtifactRows.length}`);
addResult("full_recoverability_count_is_currently_three", fullRows.length === 3, `${fullRows.length}`);
addResult(
  "full_recoverability_samples_are_v14_105_v14_161_bag_and_v14_166_lamp",
  completeSampleIds.every((sampleId) => fullRows.some((row) => row.sample_id === sampleId)),
);

for (const token of [
  "function readJpegDimensions",
  "function readImageMetadata",
  "function listRegistrySampleBlocks",
  "function extractScalarField",
  "function extractCategoryIndexSamples",
]) {
  requireToken("recoverability_core", recoverabilityCore, token);
}

for (const token of [
  "phase: v14_142_multi_accepted_sample_matrix",
  "multi_sample_matrix_created: true",
  "complete_recoverable_sample_count: 3",
  "legacy_partial_artifact_sample_count: 3",
  "full_recoverability_count_is_currently_three: true",
  "accepted_samples_write_performed: false",
  "image_binary_copy_performed: false",
  "vcp_runtime_integration_proven: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_142_multi_accepted_sample_matrix.js",
  "docs/v14_142_multi_accepted_sample_matrix.md",
  "v14_142_multi_accepted_sample_matrix",
  "multi_sample_matrix_created: true",
  "complete_recoverable_sample_count: 3",
  "legacy_partial_artifact_sample_count: 3",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const negativeBaseRow = positiveRows[0] || {};
const missingArtifactNegative = validateRecoverabilityRow(negativeBaseRow, { artifact_exists: false });
const hashMismatchNegative = validateRecoverabilityRow(negativeBaseRow, { verified_sha256: "0".repeat(64) });
const dimensionsMismatchNegative = validateRecoverabilityRow(negativeBaseRow, { verified_dimensions: "1x1" });
const mimeMismatchNegative = validateRecoverabilityRow(negativeBaseRow, { verified_mime: "image/jpeg" });
const reviewMissingNegative = validateRecoverabilityRow(negativeBaseRow, { review_record_exists: false });
const approvalMissingNegative = validateRecoverabilityRow(negativeBaseRow, { human_approval_present: false });
const categoryIndexMissingNegative = validateRecoverabilityRow(negativeBaseRow, { category_index_contains_sample: false });
const registryCategoryMismatchNegative = validateRecoverabilityRow(negativeBaseRow, {
  category: "product_still_life",
  category_index_contains_sample: false,
});

const negativeCases = {
  artifact_missing: missingArtifactNegative,
  hash_mismatch: hashMismatchNegative,
  dimensions_mismatch: dimensionsMismatchNegative,
  mime_mismatch: mimeMismatchNegative,
  review_record_missing: reviewMissingNegative,
  human_approval_missing: approvalMissingNegative,
  category_index_missing: categoryIndexMissingNegative,
  registry_category_mismatch: registryCategoryMismatchNegative,
};

addResult("negative_case_artifact_missing_fails", !negativeCases.artifact_missing.passed && negativeCases.artifact_missing.failures.includes("artifact_file_exists"));
addResult("negative_case_hash_mismatch_fails", !negativeCases.hash_mismatch.passed && negativeCases.hash_mismatch.failures.includes("artifact_sha256_matches_registry"));
addResult("negative_case_dimensions_mismatch_fails", !negativeCases.dimensions_mismatch.passed && negativeCases.dimensions_mismatch.failures.includes("artifact_dimensions_match_registry"));
addResult("negative_case_mime_mismatch_fails", !negativeCases.mime_mismatch.passed && negativeCases.mime_mismatch.failures.includes("artifact_mime_matches_registry"));
addResult("negative_case_review_record_missing_fails", !negativeCases.review_record_missing.passed && negativeCases.review_record_missing.failures.includes("review_record_exists"));
addResult("negative_case_human_approval_missing_fails", !negativeCases.human_approval_missing.passed && negativeCases.human_approval_missing.failures.includes("human_approval_present"));
addResult("negative_case_category_index_missing_fails", !negativeCases.category_index_missing.passed && negativeCases.category_index_missing.failures.includes("category_index_contains_sample"));
addResult("negative_case_registry_category_mismatch_fails", !negativeCases.registry_category_mismatch.passed && negativeCases.registry_category_mismatch.failures.includes("category_index_contains_sample"));

forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_142_multi_accepted_sample_matrix",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  sample_count: registryBlocks.length,
  matrix_row_count: matrixRows.length,
  category_count: categorySet.size,
  multi_sample_matrix_created: true,
  complete_recoverable_sample_count: fullRows.length,
  complete_recoverable_sample_ids: fullRows.map((row) => row.sample_id),
  legacy_partial_artifact_sample_count: legacyArtifactRows.length,
  local_artifact_sample_count: localArtifactRows.length,
  full_recoverability_count_is_currently_three: fullRows.length === 3,
  positive_matrix_passes: positiveValidations.length === completeSampleIds.length && positiveValidations.every((validation) => validation.passed),
  negative_case_artifact_missing_fails: !negativeCases.artifact_missing.passed,
  negative_case_hash_mismatch_fails: !negativeCases.hash_mismatch.passed,
  negative_case_dimensions_mismatch_fails: !negativeCases.dimensions_mismatch.passed,
  negative_case_mime_mismatch_fails: !negativeCases.mime_mismatch.passed,
  negative_case_review_record_missing_fails: !negativeCases.review_record_missing.passed,
  negative_case_human_approval_missing_fails: !negativeCases.human_approval_missing.passed,
  negative_case_category_index_missing_fails: !negativeCases.category_index_missing.passed,
  negative_case_registry_category_mismatch_fails: !negativeCases.registry_category_mismatch.passed,
  matrix_rows: matrixRows,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  image_binary_copy_performed: false,
  runs_source_image_modified: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  output_file_write_performed: false,
  push_tag_release_deploy_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
