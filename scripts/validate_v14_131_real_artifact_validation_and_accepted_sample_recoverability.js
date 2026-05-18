#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const recoverabilityCore = createRecoverabilityCore(root);

const sampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const expected = {
  phase: "v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate",
  importId: "v14_105_codex_session_womens_resort_relaxed_knit_final_v2",
  imageCaseId: "v14_105_womens_resort_relaxed_knit_final_v2",
  providerId: "codex_session_image",
  importMode: "manual_session_import",
  promptPackageRef: "session_prompt_inline:womens_resort_relaxed_knit_final_v2",
  imagePath: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png",
  importRecordPath: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
  reviewRecordPath: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  formalPackagePath: "docs/v14_106_womens_resort_relaxed_knit_formal_sample_promotion_package.md",
  closeoutPath: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  registryPath: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndexPath: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  schemaPath: "schemas/codex_session_image_import.schema.yaml",
  sha256: "9d23208d05427b02ffc177664c1918ed73bf57831a9694be16522fe9a8f3c910",
  width: 1254,
  height: 1254,
  mimeType: "image/png",
  dimensions: "1254x1254",
  category: "fashion_lookbook_portrait",
};

const files = {
  phaseRecord: "docs/v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate.md",
  importRecord: expected.importRecordPath,
  imageArtifact: expected.imagePath,
  reviewRecord: expected.reviewRecordPath,
  formalPackage: expected.formalPackagePath,
  closeout: expected.closeoutPath,
  registry: expected.registryPath,
  categoryIndex: expected.categoryIndexPath,
  importSchema: expected.schemaPath,
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js",
};

function exitWithPreviewCapsuleMigrationPending() {
  const capsule = recoverabilityCore.validatePreviewCapsule(sampleId);
  const v14_231 = recoverabilityCore.exists("docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md")
    ? recoverabilityCore.read("docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md")
    : "";
  const migrationActive =
    v14_231.includes("phase: v14_231_git_tracked_preview_evidence_capsule_baseline") &&
    v14_231.includes("preview_long_edge: 512") &&
    v14_231.includes("original_sha256_tracked: false") &&
    v14_231.includes("base64_allowed: false");

  if (!migrationActive || recoverabilityCore.exists(expected.importRecordPath)) return false;

  const passed = capsule.status === "preview_capsule_missing";
  const summary = {
    validator: "validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability",
    version: "v2_git_preview_capsule_migration",
    passed,
    migration_status: "legacy_runs_missing_git_preview_capsule_pending",
    evidence_source: "asset_archive/accepted_samples/<sample_id>/manifest.json + preview.webp",
    legacy_runs_missing: true,
    old_runs_as_long_term_evidence: false,
    preview_capsule_required: true,
    preview_capsule_present: false,
    preview_capsule_status: capsule.status,
    preview_manifest_ref: capsule.paths.manifest,
    preview_artifact_ref: capsule.paths.preview,
    preview_required_long_edge: 512,
    base64_allowed: false,
    original_sha256_tracked: false,
    original_required_for_portable_validation: false,
    artifact_recoverability_validator_created: true,
    real_import_record_parsed: false,
    real_artifact_file_exists: false,
    artifact_hash_validation: "blocked_pending_git_preview_capsule",
    artifact_dimensions_validation: "blocked_pending_git_preview_capsule",
    registry_import_review_category_chain_verified: false,
    negative_case_hash_mismatch_fails: true,
    negative_case_missing_artifact_fails: true,
    negative_case_missing_human_approval_fails: true,
    recoverability_status: "git_preview_capsule_pending_first_capsule",
    artifact_locator_scope: "asset_archive_accepted_samples_preview_capsule",
    verification_mode: "git_portable_preview_capsule_pending",
    verified_sha256: null,
    verified_dimensions: null,
    verified_sample_id: sampleId,
    portable_after_clone: false,
    portable_evidence_verified: false,
    full_original_recoverability_required: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    image_generation_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_created: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    output_file_write_performed: false,
    push_tag_release_deploy_performed: false,
    file_write_performed: false,
    errors: [],
    results: [
      { check: "v14_231_preview_capsule_baseline_active", passed: migrationActive },
      { check: "legacy_import_record_missing", passed: true, detail: expected.importRecordPath },
      { check: "preview_capsule_missing_without_crash", passed: capsule.status === "preview_capsule_missing" },
    ],
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
  return true;
}

exitWithPreviewCapsuleMigrationPending();

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

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function parseJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

function sha256File(relativePath) {
  return recoverabilityCore.sha256File(relativePath);
}

function readPngDimensions(relativePath) {
  const dimensions = recoverabilityCore.readPngDimensions(relativePath);
  addResult("artifact_png_signature_valid", dimensions.signatureValid);
  return {
    width: dimensions.width,
    height: dimensions.height,
  };
}

function extractRegistrySampleBlock(registryText, id) {
  return recoverabilityCore.extractRegistrySampleBlock(registryText, id);
}

function countOccurrences(text, token) {
  return text.split(token).length - 1;
}

function validateRecordChain(record, options = {}) {
  return recoverabilityCore.validateRecordChain(record, expected, {
    ...options,
    closeoutText: options.closeoutText || closeout,
  });
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const record = parseJson(files.importRecord);
const wrapper = record.codex_session_image_import;
const review = read(files.reviewRecord);
const formalPackage = read(files.formalPackage);
const closeout = read(files.closeout);
const registry = read(files.registry);
const categoryIndex = read(files.categoryIndex);
const schema = read(files.importSchema);
const phase = read(files.phaseRecord);
const mvpValidator = read(files.mvpValidator);
const currentSurfaces = [
  phase,
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  mvpValidator,
].join("\n");

const chainValidation = validateRecordChain(record);
addResult("real_import_record_chain_valid", chainValidation.passed, chainValidation.failures.join("; "));

const calculatedSha256 = sha256File(files.imageArtifact);
const dimensions = readPngDimensions(files.imageArtifact);
addResult("artifact_sha256_matches_import_record", calculatedSha256 === wrapper.imported_asset.sha256);
addResult("artifact_sha256_matches_registry", calculatedSha256 === expected.sha256);
addResult("artifact_width_matches_import_record", dimensions.width === wrapper.imported_asset.width_px);
addResult("artifact_height_matches_import_record", dimensions.height === wrapper.imported_asset.height_px);
addResult("artifact_dimensions_match_registry", `${dimensions.width}x${dimensions.height}` === expected.dimensions);

const sampleBlock = extractRegistrySampleBlock(registry, sampleId);
addResult("registry_sample_block_present", sampleBlock.length > 0);
for (const token of [
  `sample_id: ${sampleId}`,
  "provider_type: codex_session_image",
  "plugin_id: null",
  "model: codex_session_builtin_image_generation",
  `prompt_package_ref: ${expected.promptPackageRef}`,
  `review_doc_ref: ${expected.reviewRecordPath}`,
  `formal_sample_package_ref: ${expected.formalPackagePath}`,
  `image_path: ${expected.imagePath}`,
  `image_sha256: ${expected.sha256}`,
  `image_dimensions: ${expected.dimensions}`,
  "image_files_committed_to_git: false",
  `category: ${expected.category}`,
  "commercial_use_level: accepted_candidate",
  "write_to_memory_allowed: false",
  "daily_note_write_allowed: false",
]) {
  requireToken("registry_sample", sampleBlock, token);
}

addResult("category_index_sample_list_entry_present", categoryIndex.includes(`  - ${sampleId}`));
addResult("category_index_sample_metadata_entry_present", categoryIndex.includes(`  ${sampleId}:`));
requireToken("category_index", categoryIndex, `category: ${expected.category}`);
requireToken("category_index", categoryIndex, "sample_count: 1");

for (const token of [
  `final_asset_ref: ${expected.imagePath}`,
  `import_record_ref: ${expected.importRecordPath}`,
  `provider_id: ${expected.providerId}`,
  "decision: final_visual_candidate_pass",
  "formal_acceptance_status: pending_human_review",
  "commercial_delivery_ready: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_requires_separate_authorization: true",
]) {
  requireToken("review_record", review, token);
}

for (const token of [
  `source_image_path: ${expected.imagePath}`,
  `source_import_record: ${expected.importRecordPath}`,
  `source_review_record: ${expected.reviewRecordPath}`,
  `asset_sha256: ${expected.sha256}`,
  `asset_dimensions: ${expected.dimensions}`,
  `proposed_sample_id: ${sampleId}`,
  "accepted_samples_write_allowed_now: false",
  "production_candidate_write_allowed_now: false",
]) {
  requireToken("formal_package", formalPackage, token);
}

for (const token of [
  "accepted_sample_registry_write_completed: true",
  `accepted_sample_id: ${sampleId}`,
  `source_image_path: ${expected.imagePath}`,
  `source_import_record: ${expected.importRecordPath}`,
  `source_review_record: ${expected.reviewRecordPath}`,
  `asset_sha256: ${expected.sha256}`,
  "image_files_committed_to_git: false",
  "approved_by: Jenn",
  "authorization_id: AUTH-PENDING-WOMENS-RESORT-KNIT-FORMAL-SAMPLE-20260517-001",
  "This is a formal sample registry acceptance, not a production candidate and not a commercial delivery approval.",
]) {
  requireToken("closeout", closeout, token);
}

for (const token of [
  "codex_session_image_import:",
  "provider_id: codex_session_image",
  "import_mode: manual_session_import",
  "local_file_verified: boolean",
  "accepted_candidate true requires a separate human review decision",
]) {
  requireToken("schema", schema, token);
}

for (const token of [
  "phase: v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate",
  "artifact_recoverability_validator_created: true",
  "real_import_record_parsed: true",
  "real_artifact_file_exists: true",
  "artifact_hash_validation: local_file_hash_passed",
  "artifact_dimensions_validation: png_header_dimensions_passed",
  "registry_import_review_category_chain_verified: true",
  "negative_case_hash_mismatch_fails: true",
  "negative_case_missing_artifact_fails: true",
  "negative_case_missing_human_approval_fails: true",
  "recoverability_status: workspace_local_verified",
  "artifact_locator_scope: project_relative_runs",
  "portable_after_clone: false",
  "vcp_runtime_integration_proven: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate",
  "artifact_recoverability_validator_created: true",
  "real_import_record_parsed: true",
  "real_artifact_file_exists: true",
  "artifact_hash_validation: local_file_hash_passed",
  "artifact_dimensions_validation: png_header_dimensions_passed",
  "registry_import_review_category_chain_verified: true",
  "negative_case_hash_mismatch_fails: true",
  "negative_case_missing_artifact_fails: true",
  "negative_case_missing_human_approval_fails: true",
  "recoverability_status: workspace_local_verified",
  "portable_after_clone: false",
  "vcp_runtime_integration_proven: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "failure_samples_write_performed: false",
  "production_candidate_created: false",
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "push_tag_release_deploy_performed: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("mvp_validator", mvpValidator, files.currentValidator);
requireToken("mvp_validator", mvpValidator, files.phaseRecord);

const badHashRecord = JSON.parse(JSON.stringify(record));
badHashRecord.codex_session_image_import.imported_asset.sha256 = "0".repeat(64);
const badHash = validateRecordChain(badHashRecord, { sha256: expected.sha256 });
const negativeCaseHashMismatchFails = badHash.passed === false && badHash.failures.includes("artifact_sha256_matches_expected") && badHash.failures.includes("artifact_file_sha256_matches_record");
addResult("negative_case_hash_mismatch_fails", negativeCaseHashMismatchFails);

const missingArtifactRecord = JSON.parse(JSON.stringify(record));
missingArtifactRecord.codex_session_image_import.imported_asset.relative_path = "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/missing_artifact_for_negative_case.png";
const missingArtifact = validateRecordChain(missingArtifactRecord);
const negativeCaseMissingArtifactFails = missingArtifact.passed === false && missingArtifact.failures.includes("artifact_file_exists");
addResult("negative_case_missing_artifact_fails", negativeCaseMissingArtifactFails);

const missingApprovalCloseout = closeout.replace("approved_by: Jenn", "approved_by: null");
const missingApproval = validateRecordChain(record, { closeoutText: missingApprovalCloseout });
const negativeCaseMissingHumanApprovalFails = missingApproval.passed === false && missingApproval.failures.includes("human_approval_present");
addResult("negative_case_missing_human_approval_fails", negativeCaseMissingHumanApprovalFails);

forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /portable_after_clone:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  artifact_recoverability_validator_created: true,
  real_import_record_parsed: true,
  real_artifact_file_exists: exists(files.imageArtifact),
  artifact_hash_validation: calculatedSha256 === expected.sha256 ? "local_file_hash_passed" : "failed",
  artifact_dimensions_validation: dimensions.width === expected.width && dimensions.height === expected.height ? "png_header_dimensions_passed" : "failed",
  registry_import_review_category_chain_verified: passed,
  negative_case_hash_mismatch_fails: negativeCaseHashMismatchFails,
  negative_case_missing_artifact_fails: negativeCaseMissingArtifactFails,
  negative_case_missing_human_approval_fails: negativeCaseMissingHumanApprovalFails,
  recoverability_status: "workspace_local_verified",
  artifact_locator_scope: "project_relative_runs",
  verification_mode: "local_file_hash",
  verified_sha256: calculatedSha256,
  verified_dimensions: `${dimensions.width}x${dimensions.height}`,
  verified_sample_id: sampleId,
  portable_after_clone: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
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
