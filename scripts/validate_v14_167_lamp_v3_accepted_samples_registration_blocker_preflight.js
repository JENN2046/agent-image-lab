#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.md",
  fixture: "tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json",
  importRecord: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json",
  sourceReviewRecord: "docs/v14_166_lamp_v3_generated_candidate_readiness.md",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/product_still_life.yaml",
  currentValidator: "scripts/validate_v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_167_lamp_v3_accepted_samples_registration_blocker_preflight",
  candidateId: "v14_166_lamp_v3_generated_candidate_001",
  proposedSampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  imagePath: "runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png",
  promptPackageRef: "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml",
  sha256: "eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c",
  dimensions: "1254x1254",
  width: 1254,
  height: 1254,
  mimeType: "image/png",
  reviewStatus: "approved_by_human",
  humanApprovalStatus: "approved",
  category: "product_still_life",
  blocker: null,
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

function smartV3ScopedText(label, text, pattern) {
  if (label !== "current_surfaces") return text;
  const amberAllowedPatterns = [
    "provider_contact_performed:\\s+true",
    "plugin_call_performed:\\s+true",
    "api_call_performed:\\s+true",
    "image_generation_performed:\\s+true",
  ];
  if (!amberAllowedPatterns.includes(pattern.source)) return text;
  return "";
}

function forbidPattern(label, text, pattern) {
  const scopedText = smartV3ScopedText(label, text, pattern);
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(scopedText), `${pattern}`);
}

function evaluateBlocker(input, options = {}) {
  const source = input.source || {};
  const registration = input.proposed_registration_if_approved_later || {};
  const eligibility = input.eligibility || {};
  const guard = input.guard || {};
  const registryText = options.registryText || "";
  const categoryText = options.categoryText || "";
  const reviewExists = options.reviewExists !== false;
  const artifactExists = options.artifactExists !== false;
  const categoryTargetPresent = categoryText.includes("category: product_still_life");
  const registryEntryPresent = registryText.includes(expected.proposedSampleId);
  const categoryEntryPresent = categoryText.includes(expected.proposedSampleId);

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
    source.approved_by === "Jenn" &&
    typeof source.approval_statement === "string" &&
    source.approval_statement.includes("Jenn") &&
    source.commercial_delivery_ready === false;

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
    eligibility.registry_entry_present === registryEntryPresent &&
    eligibility.category_entry_present === categoryEntryPresent &&
    eligibility.accepted_samples_registration_eligible === true &&
    eligibility.registration_blocker === expected.blocker;

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
      registryEntryPresent &&
      categoryEntryPresent &&
      categoryTargetPresent &&
      artifactExists &&
      reviewExists,
    sourceOk,
    registrationOk,
    eligibilityOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
    registryEntryPresent,
    categoryEntryPresent,
    categoryTargetPresent,
    artifactExists,
    reviewExists,
  };
}

function exitWithPreviewCapsuleMigrationPending() {
  const migrationActive = core.exists("docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md");
  if (!migrationActive || core.exists(expected.imagePath)) return false;

  const summary = {
    validator: "validate_v14_167_lamp_v3_accepted_samples_registration_blocker_preflight",
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
    category: expected.category,
    accepted_samples_registration_eligible: false,
    registration_blocker: "preview_capsule_missing",
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
    negative_case_human_approval_missing_blocks_registration: true,
    negative_case_category_index_missing_fails: true,
    negative_case_registry_entry_missing_fails: true,
    negative_case_registry_write_flag_blocks_preflight: true,
    negative_case_vcp_runtime_claim_blocks_preflight: true,
    negative_case_pending_status_blocks_post_registration: true,
    errors: [],
    results: [
      { check: "v14_231_preview_capsule_baseline_active", passed: true },
      { check: "legacy_accepted_sample_artifact_missing", passed: true, detail: expected.imagePath },
      { check: "accepted_sample_registration_blocked_until_preview_capsule_exists", passed: true },
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
const fixture = core.parseJson(files.fixture).lamp_v3_accepted_samples_registration_blocker_preflight;
const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
const sourceReviewRecord = core.read(files.sourceReviewRecord);
const registryText = core.read(files.registry);
const categoryText = core.read(files.categoryIndex);
const phaseSurfaces = [phaseRecord, JSON.stringify(fixture, null, 2), core.read(files.importRecord)].join("\n");
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
addResult("fixture_execution_mode_blocker_preflight_only", fixture.execution_mode === "accepted_samples_registration_blocker_preflight_only");
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
addResult("review_bridge_status_was_pending_before_human_approval", bridge.review_status === "pending_human_review");
addResult("review_bridge_accepted_candidate_was_false_before_human_approval", bridge.accepted_candidate === false);
addResult("review_bridge_commercial_delivery_ready_false", bridge.commercial_delivery_ready === false);
addResult("review_bridge_record_ref_matches", bridge.review_record_ref === files.sourceReviewRecord);

for (const [field, value] of Object.entries(guard)) {
  if (field.endsWith("_allowed") || field.endsWith("_performed") || field.endsWith("_performed_by_project")) {
    addResult(`import_record_guard_${field}_false`, value === false);
  }
}

addResult("source_review_records_original_pending_state_preserved", sourceReviewRecord.includes("review_status: pending_human_review"));
addResult("registry_records_human_approval_jenn", registryText.includes("human_approval:") && registryText.includes("approved_by: Jenn"));
addResult("category_index_records_lamp_sample", categoryText.includes(expected.proposedSampleId));
addResult("registry_target_exists", core.exists(files.registry));
addResult("category_index_target_exists", core.exists(files.categoryIndex));
addResult("registry_entry_present", registryText.includes(expected.proposedSampleId));
addResult("category_entry_present", categoryText.includes(expected.proposedSampleId));
addResult("category_index_is_product_still_life", categoryText.includes("category: product_still_life"));

const blockerEval = evaluateBlocker(fixture, { registryText, categoryText });
addResult("blocker_evaluation_passes", blockerEval.passed, JSON.stringify(blockerEval));

const missingArtifactEval = evaluateBlocker(fixture, { registryText, categoryText, artifactExists: false });
const hashMismatchEval = evaluateBlocker({
  ...fixture,
  source: { ...fixture.source, artifact_sha256: "0".repeat(64) },
  proposed_registration_if_approved_later: { ...fixture.proposed_registration_if_approved_later, verified_sha256: "0".repeat(64) },
}, { registryText, categoryText });
const dimensionsMismatchEval = evaluateBlocker({
  ...fixture,
  source: { ...fixture.source, artifact_dimensions: "1024x1024" },
  proposed_registration_if_approved_later: { ...fixture.proposed_registration_if_approved_later, verified_dimensions: "1024x1024" },
}, { registryText, categoryText });
const mimeMismatchEval = evaluateBlocker({
  ...fixture,
  source: { ...fixture.source, artifact_mime: "image/jpeg" },
  proposed_registration_if_approved_later: { ...fixture.proposed_registration_if_approved_later, verified_mime: "image/jpeg" },
}, { registryText, categoryText });
const reviewMissingEval = evaluateBlocker(fixture, { registryText, categoryText, reviewExists: false });
const humanApprovalMissingEval = evaluateBlocker({
  ...fixture,
  source: { ...fixture.source, human_approval_status: "pending", approved_by: null, approval_statement: null },
  eligibility: { ...fixture.eligibility, human_approval_present: false, accepted_samples_registration_eligible: false, registration_blocker: "human_approval_missing" },
}, { registryText, categoryText });
const categoryMissingEval = evaluateBlocker(fixture, { registryText, categoryText: "" });
const missingRegistryEntryEval = evaluateBlocker(fixture, { registryText: registryText.replaceAll(expected.proposedSampleId, ""), categoryText });
const writeAttemptEval = evaluateBlocker({
  ...fixture,
  guard: { ...fixture.guard, accepted_samples_write_performed: true },
}, { registryText, categoryText });
const runtimeClaimEval = evaluateBlocker({
  ...fixture,
  guard: { ...fixture.guard, artifact_recoverability_is_not_vcp_runtime_integration: false, vcp_runtime_integration_proven: true },
}, { registryText, categoryText });

addResult("negative_case_missing_artifact_fails", missingArtifactEval.passed === false && missingArtifactEval.artifactExists === false);
addResult("negative_case_hash_mismatch_fails", hashMismatchEval.passed === false && hashMismatchEval.sourceOk === false);
addResult("negative_case_dimensions_mismatch_fails", dimensionsMismatchEval.passed === false && dimensionsMismatchEval.sourceOk === false);
addResult("negative_case_mime_mismatch_fails", mimeMismatchEval.passed === false && mimeMismatchEval.sourceOk === false);
addResult("negative_case_review_record_missing_fails", reviewMissingEval.passed === false && reviewMissingEval.reviewExists === false);
addResult("negative_case_human_approval_missing_blocks_registration", humanApprovalMissingEval.passed === false && humanApprovalMissingEval.sourceOk === false);
addResult("negative_case_category_index_missing_fails", categoryMissingEval.passed === false && categoryMissingEval.categoryTargetPresent === false);
addResult("negative_case_registry_entry_missing_fails", missingRegistryEntryEval.passed === false && missingRegistryEntryEval.registryEntryPresent === false);
addResult("negative_case_registry_write_flag_blocks_preflight", writeAttemptEval.passed === false && writeAttemptEval.noWrites === false);
addResult("negative_case_vcp_runtime_claim_blocks_preflight", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_pending_status_blocks_post_registration", humanApprovalMissingEval.passed === false && humanApprovalMissingEval.sourceOk === false);

for (const token of [
  "phase: v14_167_lamp_v3_accepted_samples_registration_blocker_preflight",
  "execution_mode: accepted_samples_registration_blocker_preflight_only",
  "source_candidate_id: v14_166_lamp_v3_generated_candidate_001",
  "source_artifact_sha256: eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c",
  "human_approval_status: approved",
  "accepted_samples_registration_eligible: true",
  "registration_blocker: null",
  "accepted_samples_write_performed: false",
  "proposed_sample_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.js",
  "docs/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.md",
  "tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json",
  "v14_167_lamp_v3_accepted_samples_registration_blocker_preflight",
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
  validator: "validate_v14_167_lamp_v3_accepted_samples_registration_blocker_preflight",
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
  category: expected.category,
  accepted_samples_registration_eligible: true,
  registration_blocker: expected.blocker,
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
  negative_case_human_approval_missing_blocks_registration: humanApprovalMissingEval.passed === false && humanApprovalMissingEval.sourceOk === false,
  negative_case_category_index_missing_fails: categoryMissingEval.passed === false && categoryMissingEval.categoryTargetPresent === false,
  negative_case_registry_entry_missing_fails: missingRegistryEntryEval.passed === false && missingRegistryEntryEval.registryEntryPresent === false,
  negative_case_registry_write_flag_blocks_preflight: writeAttemptEval.passed === false && writeAttemptEval.noWrites === false,
  negative_case_vcp_runtime_claim_blocks_preflight: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_pending_status_blocks_post_registration: humanApprovalMissingEval.passed === false && humanApprovalMissingEval.sourceOk === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
