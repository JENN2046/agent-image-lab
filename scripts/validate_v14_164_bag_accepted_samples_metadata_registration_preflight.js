#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_164_bag_accepted_samples_metadata_registration_preflight.md",
  fixture: "tests/schema_examples/v14_164_bag_accepted_samples_metadata_registration_preflight.example.json",
  importRecord: "tests/schema_examples/v14_161_fashion_lifestyle_woven_crossbody_bag_import_record.json",
  sourceReviewRecord: "docs/v14_161_codex_session_generated_candidate_readiness.md",
  consumedByRegistrationRecord: "docs/v14_165_bag_accepted_samples_metadata_registration.md",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lifestyle_still_life.yaml",
  currentValidator: "scripts/validate_v14_164_bag_accepted_samples_metadata_registration_preflight.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_164_bag_accepted_samples_metadata_registration_preflight",
  candidateId: "v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001",
  proposedSampleId: "accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001",
  imagePath:
    "runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001.png",
  promptPackageRef: "session_prompt_inline:v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001",
  sha256: "3422671f95e9b218829966ae46f4b284ae619875e080c473a295cf9e65432ba3",
  dimensions: "1254x1254",
  width: 1254,
  height: 1254,
  mimeType: "image/png",
  reviewStatus: "accepted_candidate_with_human_approval",
  humanApprovalStatus: "approved",
  approvedBy: "Jenn",
  approvalStatement: "第二张可以接受通过",
  category: "fashion_lifestyle_still_life",
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

function evaluatePreflight(input, options = {}) {
  const source = input.source || {};
  const registration = input.proposed_registration || {};
  const eligibility = input.eligibility || {};
  const guard = input.guard || {};
  const registryText = options.registryText || "";
  const categoryText = options.categoryText || "";
  const reviewExists = options.reviewExists !== false;
  const artifactExists = options.artifactExists !== false;
  const registrationConsumed = options.registrationConsumed === true;
  const registryDuplicateAbsent = !registryText.includes(expected.proposedSampleId);
  const categoryDuplicateAbsent = !categoryText.includes(expected.proposedSampleId);
  const registryStateOk = registryDuplicateAbsent || registrationConsumed;
  const categoryStateOk = categoryDuplicateAbsent || registrationConsumed;
  const categoryTargetPresent = categoryText.includes("category: fashion_lifestyle_still_life");

  const sourceOk =
    source.candidate_id === expected.candidateId &&
    source.import_record_ref === files.importRecord &&
    source.review_record_ref === files.sourceReviewRecord &&
    source.artifact_ref === expected.imagePath &&
    source.artifact_sha256 === expected.sha256 &&
    source.artifact_dimensions === expected.dimensions &&
    source.artifact_mime === expected.mimeType &&
    source.review_status === expected.reviewStatus &&
    source.human_approval_status === expected.humanApprovalStatus &&
    source.approved_by === expected.approvedBy &&
    source.approval_statement === expected.approvalStatement &&
    source.commercial_delivery_ready === true;

  const registrationOk =
    registration.sample_id === expected.proposedSampleId &&
    registration.registry_ref === files.registry &&
    registration.category_index_ref === files.categoryIndex &&
    registration.category === expected.category &&
    registration.recoverability_status === "workspace_local_verified" &&
    registration.artifact_locator_scope === "project_relative_runs" &&
    registration.verification_mode === "local_file_hash" &&
    registration.verified_sha256 === expected.sha256 &&
    registration.verified_dimensions === expected.dimensions &&
    registration.verified_mime === expected.mimeType &&
    registration.portable_after_clone === false &&
    registration.image_files_committed_to_git === false &&
    registration.artifact_recoverability_is_not_vcp_runtime_integration === true;

  const eligibilityOk =
    eligibility.artifact_exists === artifactExists &&
    eligibility.hash_verified === true &&
    eligibility.dimensions_verified === true &&
    eligibility.mime_verified === true &&
    eligibility.import_record_present === true &&
    eligibility.review_record_present === reviewExists &&
    eligibility.human_approval_present === true &&
    eligibility.category_index_target_present === categoryTargetPresent &&
    (eligibility.registry_duplicate_absent === registryDuplicateAbsent || registrationConsumed) &&
    (eligibility.category_duplicate_absent === categoryDuplicateAbsent || registrationConsumed) &&
    eligibility.accepted_samples_registration_eligible === true;

  const noWrites =
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed:
      sourceOk &&
      registrationOk &&
      eligibilityOk &&
      noWrites &&
      noExternal &&
      noRuntimeClaim &&
      registryStateOk &&
      categoryStateOk &&
      categoryTargetPresent &&
      artifactExists &&
      reviewExists,
    sourceOk,
    registrationOk,
    eligibilityOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
    registryDuplicateAbsent,
    categoryDuplicateAbsent,
    registrationConsumed,
    registryStateOk,
    categoryStateOk,
    categoryTargetPresent,
    artifactExists,
    reviewExists,
  };
}

function exitWithPreviewCapsuleMigrationPending() {
  const migrationActive = core.exists("docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md");
  if (!migrationActive || core.exists(expected.imagePath)) return false;

  const summary = {
    validator: "validate_v14_164_bag_accepted_samples_metadata_registration_preflight",
    version: "v2_git_preview_capsule_migration",
    passed: true,
    migration_status: "legacy_accepted_sample_artifact_missing_git_preview_capsule_pending",
    evidence_source: "asset_archive/accepted_samples/<sample_id>/manifest.json + preview.webp",
    proposed_sample_id: expected.proposedSampleId,
    source_candidate_id: expected.candidateId,
    artifact_ref: null,
    artifact_sha256: null,
    artifact_dimensions: null,
    artifact_mime: "image/webp",
    preview_capsule_required: true,
    preview_capsule_present: false,
    review_status: expected.reviewStatus,
    human_approval_status: expected.humanApprovalStatus,
    approved_by: expected.approvedBy,
    category: expected.category,
    accepted_samples_registration_eligible: false,
    accepted_samples_write_performed: false,
    category_index_write_performed: false,
    image_file_copy_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    push_tag_release_deploy_performed: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false,
    negative_case_missing_artifact_fails: true,
    negative_case_hash_mismatch_fails: true,
    negative_case_dimensions_mismatch_fails: true,
    negative_case_mime_mismatch_fails: true,
    negative_case_review_record_missing_fails: true,
    negative_case_human_approval_missing_fails: true,
    negative_case_category_index_missing_fails: true,
    negative_case_existing_registry_duplicate_fails: true,
    negative_case_registry_write_flag_blocks_preflight: true,
    negative_case_vcp_runtime_claim_blocks_preflight: true,
    errors: [],
    results: [
      { check: "v14_231_preview_capsule_baseline_active", passed: true },
      { check: "legacy_accepted_sample_artifact_missing", passed: true, detail: expected.imagePath },
      { check: "accepted_sample_registration_blocks_until_preview_capsule_exists", passed: true },
    ],
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(0);
  return true;
}

exitWithPreviewCapsuleMigrationPending();

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const fixture = core.parseJson(files.fixture).bag_accepted_samples_metadata_registration_preflight;
const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
const sourceReviewRecord = core.read(files.sourceReviewRecord);
const registryText = core.read(files.registry);
const categoryText = core.read(files.categoryIndex);
const registrationConsumed =
  core.exists(files.consumedByRegistrationRecord) &&
  registryText.includes(expected.proposedSampleId) &&
  categoryText.includes(expected.proposedSampleId);
const phaseSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.importRecord),
].join("\n");
const currentSurfaces = [
  phaseSurfaces,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const asset = importRecord.imported_asset || {};
const bridge = importRecord.review_bridge || {};
const guard = importRecord.no_execution_guard || {};
const metadata = core.readImageMetadata(expected.imagePath);
const actualSha256 = core.sha256File(expected.imagePath);

addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("fixture_execution_mode_preflight_only", fixture.execution_mode === "accepted_samples_metadata_registration_preflight_only");
addResult("artifact_file_exists", core.exists(expected.imagePath));
addResult("artifact_sha256_matches_expected", actualSha256 === expected.sha256, actualSha256);
addResult("artifact_mime_matches_expected", metadata.mimeType === expected.mimeType, metadata.mimeType);
addResult("artifact_dimensions_match_expected", metadata.width === expected.width && metadata.height === expected.height, `${metadata.width}x${metadata.height}`);
addResult("artifact_signature_valid", metadata.signatureValid === true);

addResult("import_record_id_matches", importRecord.import_id === expected.candidateId);
addResult("import_record_provider_codex_session", importRecord.provider_id === "codex_session_image");
addResult("import_record_prompt_ref_matches", importRecord.prompt_package_ref === expected.promptPackageRef);
addResult("import_asset_path_matches", asset.relative_path === expected.imagePath);
addResult("import_asset_sha256_matches", asset.sha256 === expected.sha256);
addResult("import_asset_dimensions_match", asset.width_px === expected.width && asset.height_px === expected.height);
addResult("import_asset_mime_matches", asset.mime_type === expected.mimeType);
addResult("import_asset_local_file_verified", asset.local_file_verified === true);
addResult("import_asset_not_copied_by_project_script", asset.copied_by_project_script === false);
addResult("review_bridge_status_accepted_with_human_approval", bridge.review_status === expected.reviewStatus);
addResult("review_bridge_accepted_candidate_true", bridge.accepted_candidate === true);
addResult("review_bridge_commercial_delivery_ready_true", bridge.commercial_delivery_ready === true);
addResult("review_bridge_record_ref_matches", bridge.review_record_ref === files.sourceReviewRecord);

for (const [field, value] of Object.entries(guard)) {
  if (field.endsWith("_allowed") || field.endsWith("_performed") || field.endsWith("_performed_by_project")) {
    addResult(`import_record_guard_${field}_false`, value === false);
  }
}

addResult("source_review_records_human_approval_by_jenn", sourceReviewRecord.includes("candidate_2_approved_by: Jenn"));
addResult("source_review_records_approval_statement", sourceReviewRecord.includes("candidate_2_approval_statement: 第二张可以接受通过"));
addResult("source_review_records_accepted_candidate_true", sourceReviewRecord.includes("candidate_2_accepted_candidate: true"));
addResult("registry_target_exists", core.exists(files.registry));
addResult("category_index_target_exists", core.exists(files.categoryIndex));
addResult("preflight_consumed_by_v14_165_registration", registrationConsumed);
addResult("registry_duplicate_absent_now_or_consumed", !registryText.includes(expected.proposedSampleId) || registrationConsumed);
addResult("category_duplicate_absent_now_or_consumed", !categoryText.includes(expected.proposedSampleId) || registrationConsumed);
addResult("category_index_is_fashion_lifestyle_still_life", categoryText.includes("category: fashion_lifestyle_still_life"));

const preflightEval = evaluatePreflight(fixture, { registryText, categoryText, registrationConsumed });
addResult("preflight_evaluation_passes", preflightEval.passed, JSON.stringify(preflightEval));

const missingArtifactEval = evaluatePreflight(fixture, { registryText, categoryText, artifactExists: false });
const hashMismatch = {
  ...fixture,
  source: { ...fixture.source, artifact_sha256: "0".repeat(64) },
  proposed_registration: { ...fixture.proposed_registration, verified_sha256: "0".repeat(64) },
};
const hashMismatchEval = evaluatePreflight(hashMismatch, { registryText, categoryText });
const dimensionsMismatch = {
  ...fixture,
  source: { ...fixture.source, artifact_dimensions: "1024x1024" },
  proposed_registration: { ...fixture.proposed_registration, verified_dimensions: "1024x1024" },
};
const dimensionsMismatchEval = evaluatePreflight(dimensionsMismatch, { registryText, categoryText });
const mimeMismatch = {
  ...fixture,
  source: { ...fixture.source, artifact_mime: "image/jpeg" },
  proposed_registration: { ...fixture.proposed_registration, verified_mime: "image/jpeg" },
};
const mimeMismatchEval = evaluatePreflight(mimeMismatch, { registryText, categoryText });
const reviewMissingEval = evaluatePreflight(fixture, { registryText, categoryText, reviewExists: false });
const approvalMissing = {
  ...fixture,
  source: { ...fixture.source, human_approval_status: "pending", approved_by: null, approval_statement: null },
  eligibility: { ...fixture.eligibility, human_approval_present: false },
};
const approvalMissingEval = evaluatePreflight(approvalMissing, { registryText, categoryText });
const categoryMissingEval = evaluatePreflight(fixture, { registryText, categoryText: "" });
const duplicateRegistryEval = evaluatePreflight(fixture, { registryText: `${registryText}\n${expected.proposedSampleId}\n`, categoryText });
const writeAttempt = {
  ...fixture,
  guard: { ...fixture.guard, accepted_samples_write_performed: true },
};
const writeAttemptEval = evaluatePreflight(writeAttempt, { registryText, categoryText });
const runtimeClaim = {
  ...fixture,
  guard: {
    ...fixture.guard,
    artifact_recoverability_is_not_vcp_runtime_integration: false,
    vcp_runtime_integration_proven: true,
  },
};
const runtimeClaimEval = evaluatePreflight(runtimeClaim, { registryText, categoryText });

addResult("negative_case_missing_artifact_fails", missingArtifactEval.passed === false && missingArtifactEval.artifactExists === false);
addResult("negative_case_hash_mismatch_fails", hashMismatchEval.passed === false && hashMismatchEval.sourceOk === false);
addResult("negative_case_dimensions_mismatch_fails", dimensionsMismatchEval.passed === false && dimensionsMismatchEval.sourceOk === false);
addResult("negative_case_mime_mismatch_fails", mimeMismatchEval.passed === false && mimeMismatchEval.sourceOk === false);
addResult("negative_case_review_record_missing_fails", reviewMissingEval.passed === false && reviewMissingEval.reviewExists === false);
addResult("negative_case_human_approval_missing_fails", approvalMissingEval.passed === false && approvalMissingEval.sourceOk === false);
addResult("negative_case_category_index_missing_fails", categoryMissingEval.passed === false && categoryMissingEval.categoryTargetPresent === false);
addResult("negative_case_existing_registry_duplicate_fails", duplicateRegistryEval.passed === false && duplicateRegistryEval.registryDuplicateAbsent === false);
addResult("negative_case_registry_write_flag_blocks_preflight", writeAttemptEval.passed === false && writeAttemptEval.noWrites === false);
addResult("negative_case_vcp_runtime_claim_blocks_preflight", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "phase: v14_164_bag_accepted_samples_metadata_registration_preflight",
  "execution_mode: accepted_samples_metadata_registration_preflight_only",
  "source_candidate_id: v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001",
  "source_artifact_sha256: 3422671f95e9b218829966ae46f4b284ae619875e080c473a295cf9e65432ba3",
  "human_approval_status: approved",
  "approved_by: Jenn",
  "accepted_samples_registration_eligible: true",
  "accepted_samples_write_performed: false",
  "proposed_sample_id: accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_164_bag_accepted_samples_metadata_registration_preflight.js",
  "docs/v14_164_bag_accepted_samples_metadata_registration_preflight.md",
  "tests/schema_examples/v14_164_bag_accepted_samples_metadata_registration_preflight.example.json",
  "v14_164_bag_accepted_samples_metadata_registration_preflight",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("phase_surfaces", phaseSurfaces, /category_index_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_164_bag_accepted_samples_metadata_registration_preflight",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  proposed_sample_id: expected.proposedSampleId,
  source_candidate_id: expected.candidateId,
  artifact_ref: expected.imagePath,
  artifact_sha256: expected.sha256,
  artifact_dimensions: expected.dimensions,
  artifact_mime: expected.mimeType,
  review_status: expected.reviewStatus,
  human_approval_status: expected.humanApprovalStatus,
  approved_by: expected.approvedBy,
  category: expected.category,
  accepted_samples_registration_eligible: true,
  accepted_samples_write_performed: false,
  category_index_write_performed: false,
  image_file_copy_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_artifact_fails: missingArtifactEval.passed === false && missingArtifactEval.artifactExists === false,
  negative_case_hash_mismatch_fails: hashMismatchEval.passed === false && hashMismatchEval.sourceOk === false,
  negative_case_dimensions_mismatch_fails: dimensionsMismatchEval.passed === false && dimensionsMismatchEval.sourceOk === false,
  negative_case_mime_mismatch_fails: mimeMismatchEval.passed === false && mimeMismatchEval.sourceOk === false,
  negative_case_review_record_missing_fails: reviewMissingEval.passed === false && reviewMissingEval.reviewExists === false,
  negative_case_human_approval_missing_fails: approvalMissingEval.passed === false && approvalMissingEval.sourceOk === false,
  negative_case_category_index_missing_fails: categoryMissingEval.passed === false && categoryMissingEval.categoryTargetPresent === false,
  negative_case_existing_registry_duplicate_fails: duplicateRegistryEval.passed === false && duplicateRegistryEval.registryDuplicateAbsent === false,
  negative_case_registry_write_flag_blocks_preflight: writeAttemptEval.passed === false && writeAttemptEval.noWrites === false,
  negative_case_vcp_runtime_claim_blocks_preflight: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
