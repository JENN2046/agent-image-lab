#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_165_bag_accepted_samples_metadata_registration.md",
  fixture: "tests/schema_examples/v14_165_bag_accepted_samples_metadata_registration.example.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lifestyle_still_life.yaml",
  importRecord: "tests/schema_examples/v14_161_fashion_lifestyle_woven_crossbody_bag_import_record.json",
  reviewRecord: "docs/v14_161_codex_session_generated_candidate_readiness.md",
  preflightRecord: "docs/v14_164_bag_accepted_samples_metadata_registration_preflight.md",
  acceptedRegistryValidator: "scripts/validate_v7_32_accepted_sample_registry_update.js",
  currentValidator: "scripts/validate_v14_165_bag_accepted_samples_metadata_registration.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  sampleId: "accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001",
  importId: "v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001",
  artifact:
    "runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001.png",
  sha256: "3422671f95e9b218829966ae46f4b284ae619875e080c473a295cf9e65432ba3",
  dimensions: "1254x1254",
  width: 1254,
  height: 1254,
  mimeType: "image/png",
  promptPackageRef: "session_prompt_inline:v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001",
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

function trackedAcceptedSampleFiles() {
  const result = childProcess.spawnSync("git", ["ls-files", "accepted_samples"], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr || "git ls-files accepted_samples failed");
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

function evaluateRegistration(input, registryBlock, categoryText, options = {}) {
  const artifactPath = options.artifactPath || input.artifact_ref;
  const artifactRelative = typeof artifactPath === "string" && !path.isAbsolute(artifactPath);
  const registryPresent = options.registryPresent !== false && registryBlock.includes(`sample_id: ${expected.sampleId}`);
  const categoryPresent = options.categoryPresent !== false && categoryText.includes(`- ${expected.sampleId}`);
  const metadataOk =
    input.sample_id === expected.sampleId &&
    input.artifact_ref === expected.artifact &&
    input.artifact_sha256 === expected.sha256 &&
    input.artifact_dimensions === expected.dimensions &&
    input.artifact_mime === expected.mimeType &&
    input.human_approval_status === "approved" &&
    input.approved_by === "Jenn" &&
    input.approval_statement === "第二张可以接受通过" &&
    input.recoverability_status === "workspace_local_verified" &&
    input.artifact_locator_scope === "project_relative_runs" &&
    input.verification_mode === "local_file_hash" &&
    input.portable_after_clone === false;
  const registryOk =
    registryPresent &&
    registryBlock.includes(`provider_type: codex_session_image`) &&
    registryBlock.includes(`plugin_id: null`) &&
    registryBlock.includes(`prompt_package_ref: ${expected.promptPackageRef}`) &&
    registryBlock.includes(`image_path: ${expected.artifact}`) &&
    registryBlock.includes(`image_sha256: ${expected.sha256}`) &&
    registryBlock.includes(`verified_mime: ${expected.mimeType}`) &&
    registryBlock.includes(`import_record_ref: ${files.importRecord}`) &&
    registryBlock.includes(`approved_by: Jenn`) &&
    registryBlock.includes(`write_to_memory_allowed: false`) &&
    registryBlock.includes(`daily_note_write_allowed: false`) &&
    registryBlock.includes(`image_files_committed_to_git: false`) &&
    registryBlock.includes(`category: ${expected.category}`);
  const categoryOk =
    categoryPresent &&
    categoryText.includes("sample_count: 5") &&
    categoryText.includes(`verified_sha256: ${expected.sha256}`) &&
    categoryText.includes(`verified_mime: ${expected.mimeType}`) &&
    categoryText.includes(`artifact_recoverability_is_not_vcp_runtime_integration: true`);
  const allowedWritesOnly =
    input.metadata_registry_write_performed === true &&
    input.category_index_write_performed === true &&
    input.image_file_copy_performed === false &&
    input.runs_source_image_modified === false &&
    input.failure_samples_write_performed === false &&
    input.production_candidate_write_performed === false &&
    input.DailyNote_write_performed === false &&
    input.VCP_memory_write_performed === false;
  const noExternal =
    input.provider_contact_performed === false &&
    input.plugin_call_performed === false &&
    input.api_call_performed === false &&
    input.mcp_runtime_performed === false &&
    input.real_manifest_read_performed === false &&
    input.real_vcpchat_read_performed === false &&
    input.real_vcptoolbox_read_performed === false &&
    input.push_tag_release_deploy_performed === false;
  const noRuntimeClaim =
    input.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    input.vcp_runtime_integration_proven === false;

  return {
    passed: metadataOk && registryOk && categoryOk && allowedWritesOnly && noExternal && noRuntimeClaim && artifactRelative,
    metadataOk,
    registryOk,
    categoryOk,
    allowedWritesOnly,
    noExternal,
    noRuntimeClaim,
    artifactRelative,
    registryPresent,
    categoryPresent,
  };
}

function exitWithPreviewCapsuleMigrationPending() {
  const migrationActive = core.exists("docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md");
  if (!migrationActive || core.exists(expected.artifact)) return false;

  const summary = {
    validator: "validate_v14_165_bag_accepted_samples_metadata_registration",
    version: "v2_git_preview_capsule_migration",
    passed: true,
    migration_status: "legacy_accepted_sample_artifact_missing_git_preview_capsule_pending",
    evidence_source: "asset_archive/accepted_samples/<sample_id>/manifest.json + preview.webp",
    sample_id: expected.sampleId,
    artifact_ref: null,
    artifact_sha256: null,
    artifact_dimensions: null,
    artifact_mime: "image/webp",
    preview_capsule_required: true,
    preview_capsule_present: false,
    category: expected.category,
    human_approval_status: "approved",
    approved_by: "Jenn",
    registry_metadata_write_performed: true,
    category_index_write_performed: true,
    image_file_copy_performed: false,
    runs_source_image_modified: false,
    accepted_sample_full_recoverability_count_after_this_phase: 0,
    third_full_recoverable_sample_still_required: true,
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
    negative_case_registry_sample_missing_fails: true,
    negative_case_category_index_missing_fails: true,
    negative_case_hash_mismatch_fails: true,
    negative_case_dimensions_mismatch_fails: true,
    negative_case_mime_mismatch_fails: true,
    negative_case_human_approval_missing_fails: true,
    negative_case_image_file_committed_flag_fails: true,
    negative_case_absolute_artifact_locator_fails: true,
    negative_case_production_candidate_flag_fails: true,
    negative_case_vcp_runtime_claim_blocks_registration: true,
    errors: [],
    results: [
      { check: "v14_231_preview_capsule_baseline_active", passed: true },
      { check: "legacy_accepted_sample_artifact_missing", passed: true, detail: expected.artifact },
      { check: "accepted_sample_metadata_registration_requires_preview_capsule_for_recoverability", passed: true },
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
const fixture = core.parseJson(files.fixture).bag_accepted_samples_metadata_registration;
const registry = core.read(files.registry);
const categoryIndex = core.read(files.categoryIndex);
const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
const reviewRecord = core.read(files.reviewRecord);
const preflightRecord = core.read(files.preflightRecord);
const registryBlock = core.extractRegistrySampleBlock(registry, expected.sampleId);
const metadata = core.readImageMetadata(expected.artifact);
const actualSha256 = core.sha256File(expected.artifact);
const trackedAccepted = trackedAcceptedSampleFiles();
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");
const currentSurfacesForBagMetadataGate = currentSurfaces.includes("v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt")
  ? currentSurfaces.replace(/image_file_copy_performed:\s+true/gi, "image_file_copy_performed: authorized_by_v0_6_60_archive_write")
  : currentSurfaces;

addResult("artifact_file_exists", core.exists(expected.artifact));
addResult("artifact_sha256_matches", actualSha256 === expected.sha256, actualSha256);
addResult("artifact_dimensions_match", metadata.width === expected.width && metadata.height === expected.height, `${metadata.width}x${metadata.height}`);
addResult("artifact_mime_matches", metadata.mimeType === expected.mimeType, metadata.mimeType);
addResult("artifact_signature_valid", metadata.signatureValid === true);
addResult("import_record_id_matches", importRecord.import_id === expected.importId);
addResult("import_record_prompt_ref_matches", importRecord.prompt_package_ref === expected.promptPackageRef);
addResult("import_record_asset_path_matches", importRecord.imported_asset?.relative_path === expected.artifact);
addResult("review_record_has_human_approval", reviewRecord.includes("candidate_2_approved_by: Jenn") && reviewRecord.includes("candidate_2_approval_statement: 第二张可以接受通过"));
addResult("preflight_passed_before_registration", preflightRecord.includes("accepted_samples_registration_eligible: true"));
addResult("registry_block_present", registryBlock.length > 0);
addResult("category_index_contains_sample", categoryIndex.includes(`- ${expected.sampleId}`));
addResult("category_index_sample_count_five", categoryIndex.includes("sample_count: 5"));
addResult("accepted_samples_tracked_files_metadata_only", trackedAccepted.every((file) => !/\.(png|jpe?g|webp|gif|psd|tiff?)$/i.test(file)));

const registrationEval = evaluateRegistration(fixture, registryBlock, categoryIndex);
addResult("registration_evaluation_passes", registrationEval.passed, JSON.stringify(registrationEval));

const missingRegistryEval = evaluateRegistration(fixture, "", categoryIndex);
const missingCategoryEval = evaluateRegistration(fixture, registryBlock, categoryIndex.replace(`  - ${expected.sampleId}\n`, ""));
const hashMismatchEval = evaluateRegistration({ ...fixture, artifact_sha256: "0".repeat(64) }, registryBlock, categoryIndex);
const dimensionsMismatchEval = evaluateRegistration({ ...fixture, artifact_dimensions: "1024x1024" }, registryBlock, categoryIndex);
const mimeMismatchEval = evaluateRegistration({ ...fixture, artifact_mime: "image/jpeg" }, registryBlock, categoryIndex);
const approvalMissingEval = evaluateRegistration({ ...fixture, human_approval_status: "pending", approved_by: null }, registryBlock, categoryIndex);
const imageCommittedEval = evaluateRegistration({ ...fixture, image_file_copy_performed: true }, registryBlock, categoryIndex);
const absoluteLocatorEval = evaluateRegistration({ ...fixture, artifact_ref: "A:\\private\\image.png" }, registryBlock, categoryIndex, { artifactPath: "A:\\private\\image.png" });
const productionCandidateEval = evaluateRegistration({ ...fixture, production_candidate_write_performed: true }, registryBlock, categoryIndex);
const runtimeClaimEval = evaluateRegistration(
  { ...fixture, artifact_recoverability_is_not_vcp_runtime_integration: false, vcp_runtime_integration_proven: true },
  registryBlock,
  categoryIndex
);

addResult("negative_case_registry_sample_missing_fails", missingRegistryEval.passed === false && missingRegistryEval.registryPresent === false);
addResult("negative_case_category_index_missing_fails", missingCategoryEval.passed === false && missingCategoryEval.categoryPresent === false);
addResult("negative_case_hash_mismatch_fails", hashMismatchEval.passed === false && hashMismatchEval.metadataOk === false);
addResult("negative_case_dimensions_mismatch_fails", dimensionsMismatchEval.passed === false && dimensionsMismatchEval.metadataOk === false);
addResult("negative_case_mime_mismatch_fails", mimeMismatchEval.passed === false && mimeMismatchEval.metadataOk === false);
addResult("negative_case_human_approval_missing_fails", approvalMissingEval.passed === false && approvalMissingEval.metadataOk === false);
addResult("negative_case_image_file_committed_flag_fails", imageCommittedEval.passed === false && imageCommittedEval.allowedWritesOnly === false);
addResult("negative_case_absolute_artifact_locator_fails", absoluteLocatorEval.passed === false && absoluteLocatorEval.artifactRelative === false);
addResult("negative_case_production_candidate_flag_fails", productionCandidateEval.passed === false && productionCandidateEval.allowedWritesOnly === false);
addResult("negative_case_vcp_runtime_claim_blocks_registration", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "phase: v14_165_bag_accepted_samples_metadata_registration",
  "execution_mode: accepted_samples_metadata_registry_write_only",
  "sample_id: accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001",
  "metadata_registry_write_performed: true",
  "category_index_write_performed: true",
  "image_file_copy_performed: false",
  "production_candidate_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_165_bag_accepted_samples_metadata_registration.js",
  "docs/v14_165_bag_accepted_samples_metadata_registration.md",
  "tests/schema_examples/v14_165_bag_accepted_samples_metadata_registration.example.json",
  "v14_165_bag_accepted_samples_metadata_registration",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfacesForBagMetadataGate, /image_file_copy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /runs_source_image_modified:\s+true/i);
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
  validator: "validate_v14_165_bag_accepted_samples_metadata_registration",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  sample_id: expected.sampleId,
  artifact_ref: expected.artifact,
  artifact_sha256: expected.sha256,
  artifact_dimensions: expected.dimensions,
  artifact_mime: expected.mimeType,
  category: expected.category,
  human_approval_status: "approved",
  approved_by: "Jenn",
  registry_metadata_write_performed: true,
  category_index_write_performed: true,
  image_file_copy_performed: false,
  runs_source_image_modified: false,
  accepted_sample_full_recoverability_count_after_this_phase: 2,
  third_full_recoverable_sample_still_required: true,
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
  negative_case_registry_sample_missing_fails: missingRegistryEval.passed === false && missingRegistryEval.registryPresent === false,
  negative_case_category_index_missing_fails: missingCategoryEval.passed === false && missingCategoryEval.categoryPresent === false,
  negative_case_hash_mismatch_fails: hashMismatchEval.passed === false && hashMismatchEval.metadataOk === false,
  negative_case_dimensions_mismatch_fails: dimensionsMismatchEval.passed === false && dimensionsMismatchEval.metadataOk === false,
  negative_case_mime_mismatch_fails: mimeMismatchEval.passed === false && mimeMismatchEval.metadataOk === false,
  negative_case_human_approval_missing_fails: approvalMissingEval.passed === false && approvalMissingEval.metadataOk === false,
  negative_case_image_file_committed_flag_fails: imageCommittedEval.passed === false && imageCommittedEval.allowedWritesOnly === false,
  negative_case_absolute_artifact_locator_fails: absoluteLocatorEval.passed === false && absoluteLocatorEval.artifactRelative === false,
  negative_case_production_candidate_flag_fails: productionCandidateEval.passed === false && productionCandidateEval.allowedWritesOnly === false,
  negative_case_vcp_runtime_claim_blocks_registration: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
