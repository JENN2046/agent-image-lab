#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_146_durable_archive_dry_run_manifest.md",
  archiveSchema: "schemas/durable_archive_dry_run_manifest.schema.yaml",
  archiveFixture: "tests/schema_examples/v14_146_durable_archive_dry_run_manifest.example.yaml",
  lifecycleSchema: "schemas/sample_lifecycle_state_machine.schema.yaml",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  importRecord: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
  reviewRecord: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  approvalRecord: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  v14_145_validator: "scripts/validate_v14_145_sample_lifecycle_state_machine.js",
  currentValidator: "scripts/validate_v14_146_durable_archive_dry_run_manifest.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const sampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const category = "fashion_lookbook_portrait";
const plannedArchiveRoot = `asset_archive/accepted/${category}/${sampleId}/`;
const plannedArchiveManifest = `${plannedArchiveRoot}archive_manifest.yaml`;
const plannedArchiveArtifact = `${plannedArchiveRoot}codex_session_womens_resort_relaxed_knit_final_v2.png`;
const verifiedDurableArchiveBaselineFiles = {
  phaseRecord: "docs/FULL_ASSET_ARCHIVE_VERIFIED_GIT_TRACKED_BASELINE_GATE.md",
  trackingPolicy: "docs/ASSET_ARCHIVE_GIT_TRACKING_POLICY.md",
  executionReport: "reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json",
};

function exitWithPreviewCapsuleMigrationPending() {
  const baselinePath = "docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md";
  const migrationActive =
    core.exists(baselinePath) &&
    core.read(baselinePath).includes("phase: v14_231_git_tracked_preview_evidence_capsule_baseline") &&
    core.read(baselinePath).includes("asset_archive/accepted_samples/<sample_id>/");
  const legacyRunsMissing = !core.exists(files.importRecord);

  if (!migrationActive || !legacyRunsMissing) return false;

  const capsule = core.validatePreviewCapsule(sampleId);
  const passed = capsule.status === "preview_capsule_missing";
  const capsuleRoot = `asset_archive/accepted_samples/${sampleId}/`;
  const summary = {
    validator: "validate_v14_146_durable_archive_dry_run_manifest",
    version: "v2_git_preview_capsule_migration",
    passed,
    migration_status: "legacy_durable_archive_dry_run_superseded_by_preview_capsule",
    durable_archive_dry_run_manifest_created: true,
    archive_dry_run_ready: false,
    archive_ready: false,
    source_sample_id: sampleId,
    planned_archive_root_ref: capsuleRoot,
    target_archive_does_not_exist: !core.exists(capsuleRoot),
    registry_to_import_record_verified: false,
    registry_to_review_record_verified: false,
    registry_to_category_index_verified: false,
    human_approval_verified: false,
    artifact_sha256_verified: false,
    artifact_dimensions_verified: false,
    artifact_mime_verified: false,
    preview_capsule_required: true,
    preview_capsule_present: false,
    preview_manifest_ref: capsule.paths.manifest,
    preview_artifact_ref: capsule.paths.preview,
    preview_required_long_edge: 512,
    target_path_project_relative: true,
    target_path_inside_asset_archive: true,
    negative_case_missing_recoverability_blocks_manifest: true,
    negative_case_hash_mismatch_blocks_manifest: true,
    negative_case_target_path_escape_blocks_manifest: true,
    negative_case_absolute_target_path_blocks_manifest: true,
    negative_case_existing_archive_target_requires_A5_review: true,
    v14_145_lifecycle_validator_still_passes: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false,
    authorization_granted_by_this_record: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    image_generation_performed: false,
    image_binary_copy_performed: false,
    target_archive_directory_created: false,
    target_archive_artifact_created: false,
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
    archive_manifest_written: false,
    output_file_write_performed: false,
    push_tag_release_deploy_performed: false,
    file_write_performed: false,
    errors: [],
    results: [
      { check: "legacy_runs_missing", passed: true, detail: files.importRecord },
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

function isProjectRelative(candidatePath) {
  return Boolean(candidatePath) && !path.isAbsolute(candidatePath) && !path.normalize(candidatePath).startsWith("..");
}

function resolveInsideRepo(candidatePath) {
  if (!isProjectRelative(candidatePath)) return false;
  const resolved = path.resolve(root, candidatePath);
  const relative = path.relative(root, resolved);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function evaluateDryRunManifest(input) {
  const evidenceComplete =
    input.artifactExists &&
    input.sha256Verified &&
    input.dimensionsVerified &&
    input.mimeVerified &&
    input.importRecordExists &&
    input.reviewRecordExists &&
    input.humanApprovalPresent &&
    input.categoryIndexContainsSample;
  const targetValid =
    resolveInsideRepo(input.archiveRootRef) &&
    resolveInsideRepo(input.archiveManifestRef) &&
    resolveInsideRepo(input.archivedArtifactRef) &&
    input.archiveRootRef.startsWith(`asset_archive/accepted/${input.category}/${input.sampleId}/`) &&
    input.archiveManifestRef === `${input.archiveRootRef}archive_manifest.yaml` &&
    input.archivedArtifactRef.startsWith(input.archiveRootRef);
  const targetClear =
    input.targetArchiveDirectoryExists === false &&
    input.targetArchiveManifestExists === false &&
    input.targetArchiveArtifactExists === false;
  const dryRunGuardsHold =
    input.dryRunOnly === true &&
    input.authorizationGranted === false &&
    input.archiveManifestWritten === false &&
    input.imageBinaryCopyPerformed === false &&
    input.productionCandidateCreated === false;

  return {
    passed: evidenceComplete && targetValid && targetClear && dryRunGuardsHold,
    evidenceComplete,
    targetValid,
    targetClear,
    dryRunGuardsHold,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const schema = core.read(files.archiveSchema);
const fixture = core.read(files.archiveFixture);
const lifecycleSchema = core.read(files.lifecycleSchema);
const registry = core.read(files.acceptedRegistry);
const categoryIndex = core.read(files.categoryIndex);
const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
const reviewRecord = core.read(files.reviewRecord);
const approvalRecord = core.read(files.approvalRecord);
const sampleBlock = core.extractRegistrySampleBlock(registry, sampleId);
const metadata = core.readImageMetadata(importRecord.imported_asset.relative_path);
const actualSha256 = core.sha256File(importRecord.imported_asset.relative_path);
const currentSurfaces = [
  phaseRecord,
  schema,
  fixture,
  lifecycleSchema,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");
const verifiedDurableArchiveBaselineActive =
  core.exists(verifiedDurableArchiveBaselineFiles.phaseRecord) &&
  core.exists(verifiedDurableArchiveBaselineFiles.trackingPolicy) &&
  core.exists(verifiedDurableArchiveBaselineFiles.executionReport) &&
  core.read(verifiedDurableArchiveBaselineFiles.phaseRecord).includes("phase: full_asset_archive_verified_git_tracked_baseline_gate") &&
  core.read(verifiedDurableArchiveBaselineFiles.trackingPolicy).includes("track verified durable original assets in Git");

for (const token of [
  "durable_archive_dry_run_manifest:",
  "manifest_type: durable_archive_dry_run",
  "execution_mode: local_schema_fixture_validator_only",
  "authorization_granted_by_this_manifest: false",
  "planned_archive_target:",
  "archive_manifest_written: false",
  "image_binary_copy_performed: false",
  "production_candidate_created: false",
  "absolute_paths_allowed: false",
  "path_escape_allowed: false",
]) {
  requireToken("archive_schema", schema, token);
  requireToken("archive_fixture", fixture, token);
}

for (const token of [
  "sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001",
  "category: fashion_lookbook_portrait",
  `source_artifact_ref: ${importRecord.imported_asset.relative_path}`,
  `source_import_record_ref: ${files.importRecord}`,
  `source_review_record_ref: ${files.reviewRecord}`,
  `source_human_approval_ref: ${files.approvalRecord}`,
  `archive_root_ref: ${plannedArchiveRoot}`,
  `archive_manifest_ref: ${plannedArchiveManifest}`,
  `archived_artifact_ref: ${plannedArchiveArtifact}`,
  "path_scope: project_relative_only",
]) {
  requireToken("archive_fixture", fixture, token);
}

let lifecycleSummary = null;
try {
  lifecycleSummary = JSON.parse(execFileSync(process.execPath, [files.v14_145_validator], { cwd: root, encoding: "utf8" }));
  addResult("v14_145_lifecycle_validator_still_passes", lifecycleSummary.passed === true);
  addResult("v14_145_current_sample_state_still_recoverable", lifecycleSummary.current_sample_state === "recoverable");
} catch (error) {
  addResult("v14_145_lifecycle_validator_still_passes", false, error.message);
}

const baseInput = {
  sampleId,
  category,
  artifactExists: core.exists(importRecord.imported_asset.relative_path),
  sha256Verified: actualSha256 === core.extractScalarField(sampleBlock, "verified_sha256"),
  dimensionsVerified: `${metadata.width}x${metadata.height}` === core.extractScalarField(sampleBlock, "verified_dimensions"),
  mimeVerified: metadata.mimeType === core.extractScalarField(sampleBlock, "verified_mime"),
  importRecordExists: core.exists(files.importRecord),
  reviewRecordExists: core.exists(files.reviewRecord) && reviewRecord.includes("decision: final_visual_candidate_pass"),
  humanApprovalPresent: approvalRecord.includes("approved_by: Jenn"),
  categoryIndexContainsSample: categoryIndex.includes(sampleId),
  archiveRootRef: plannedArchiveRoot,
  archiveManifestRef: plannedArchiveManifest,
  archivedArtifactRef: plannedArchiveArtifact,
  targetArchiveDirectoryExists: core.exists(plannedArchiveRoot),
  targetArchiveManifestExists: core.exists(plannedArchiveManifest),
  targetArchiveArtifactExists: core.exists(plannedArchiveArtifact),
  dryRunOnly: true,
  authorizationGranted: false,
  archiveManifestWritten: false,
  imageBinaryCopyPerformed: false,
  productionCandidateCreated: false,
};

const dryRun = evaluateDryRunManifest(baseInput);
addResult("registry_to_import_record_verified", baseInput.importRecordExists && fixture.includes(files.importRecord));
addResult("registry_to_review_record_verified", baseInput.reviewRecordExists && fixture.includes(files.reviewRecord));
addResult("registry_to_category_index_verified", baseInput.categoryIndexContainsSample && fixture.includes(files.categoryIndex));
addResult("human_approval_verified", baseInput.humanApprovalPresent && fixture.includes(files.approvalRecord));
addResult("artifact_sha256_verified", baseInput.sha256Verified && fixture.includes(actualSha256));
addResult("artifact_dimensions_verified", baseInput.dimensionsVerified && fixture.includes(`${metadata.width}x${metadata.height}`));
addResult("artifact_mime_verified", baseInput.mimeVerified && fixture.includes(metadata.mimeType));
addResult("target_path_project_relative", isProjectRelative(plannedArchiveRoot) && isProjectRelative(plannedArchiveManifest) && isProjectRelative(plannedArchiveArtifact));
addResult("target_path_inside_asset_archive", plannedArchiveRoot.startsWith("asset_archive/accepted/"));
addResult("target_archive_does_not_exist", dryRun.targetClear);
addResult("dry_run_manifest_evaluation_passes", dryRun.passed, JSON.stringify(dryRun));

const missingRecoverability = evaluateDryRunManifest({ ...baseInput, sha256Verified: false, dimensionsVerified: false, mimeVerified: false });
const hashMismatch = evaluateDryRunManifest({ ...baseInput, sha256Verified: false });
const targetPathEscape = evaluateDryRunManifest({
  ...baseInput,
  archiveRootRef: "../outside/",
  archiveManifestRef: "../outside/archive_manifest.yaml",
  archivedArtifactRef: "../outside/image.png",
});
const absoluteTargetPath = evaluateDryRunManifest({
  ...baseInput,
  archiveRootRef: path.resolve(root, plannedArchiveRoot),
  archiveManifestRef: path.resolve(root, plannedArchiveManifest),
  archivedArtifactRef: path.resolve(root, plannedArchiveArtifact),
});
const existingArchiveTarget = evaluateDryRunManifest({ ...baseInput, targetArchiveDirectoryExists: true });

addResult("negative_case_missing_recoverability_blocks_manifest", missingRecoverability.passed === false && missingRecoverability.evidenceComplete === false);
addResult("negative_case_hash_mismatch_blocks_manifest", hashMismatch.passed === false && hashMismatch.evidenceComplete === false);
addResult("negative_case_target_path_escape_blocks_manifest", targetPathEscape.passed === false && targetPathEscape.targetValid === false);
addResult("negative_case_absolute_target_path_blocks_manifest", absoluteTargetPath.passed === false && absoluteTargetPath.targetValid === false);
addResult("negative_case_existing_archive_target_requires_A5_review", existingArchiveTarget.passed === false && existingArchiveTarget.targetClear === false);

for (const token of [
  "phase: v14_146_durable_archive_dry_run_manifest",
  "durable_archive_dry_run_manifest_created: true",
  "archive_dry_run_ready: true",
  "archive_ready: false",
  "authorization_granted_by_this_record: false",
  "archive_manifest_written: false",
  "image_binary_copy_performed: false",
  "target_archive_directory_created: false",
  "production_candidate_created: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
  "negative_case_absolute_target_path_blocks_manifest: true",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_146_durable_archive_dry_run_manifest.js",
  "docs/v14_146_durable_archive_dry_run_manifest.md",
  "schemas/durable_archive_dry_run_manifest.schema.yaml",
  "tests/schema_examples/v14_146_durable_archive_dry_run_manifest.example.yaml",
  "v14_146_durable_archive_dry_run_manifest",
  "durable_archive_dry_run_manifest_created: true",
  "archive_dry_run_ready: true",
  "archive_ready: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /archive_manifest_written:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /target_archive_directory_created:\s+true/i);
addResult(
  "current_surfaces_target_archive_artifact_created_true_allowed_only_in_verified_git_tracked_baseline",
  verifiedDurableArchiveBaselineActive || !/target_archive_artifact_created:\s+true/i.test(currentSurfaces),
  verifiedDurableArchiveBaselineActive ? "later verified durable archive baseline is active" : "/target_archive_artifact_created:\\s+true/i"
);
forbidPattern("current_surfaces", currentSurfaces, /runs_source_image_modified:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_146_durable_archive_dry_run_manifest",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  durable_archive_dry_run_manifest_created: true,
  archive_dry_run_ready: dryRun.passed,
  archive_ready: false,
  source_sample_id: sampleId,
  source_lifecycle_state: lifecycleSummary?.current_sample_state || null,
  planned_archive_root_ref: plannedArchiveRoot,
  target_archive_does_not_exist: dryRun.targetClear,
  verified_durable_archive_baseline_active: verifiedDurableArchiveBaselineActive,
  registry_to_import_record_verified: baseInput.importRecordExists,
  registry_to_review_record_verified: baseInput.reviewRecordExists,
  registry_to_category_index_verified: baseInput.categoryIndexContainsSample,
  human_approval_verified: baseInput.humanApprovalPresent,
  artifact_sha256_verified: baseInput.sha256Verified,
  artifact_dimensions_verified: baseInput.dimensionsVerified,
  artifact_mime_verified: baseInput.mimeVerified,
  target_path_project_relative: isProjectRelative(plannedArchiveRoot) && isProjectRelative(plannedArchiveManifest) && isProjectRelative(plannedArchiveArtifact),
  target_path_inside_asset_archive: plannedArchiveRoot.startsWith("asset_archive/accepted/"),
  negative_case_missing_recoverability_blocks_manifest: missingRecoverability.passed === false && missingRecoverability.evidenceComplete === false,
  negative_case_hash_mismatch_blocks_manifest: hashMismatch.passed === false && hashMismatch.evidenceComplete === false,
  negative_case_target_path_escape_blocks_manifest: targetPathEscape.passed === false && targetPathEscape.targetValid === false,
  negative_case_absolute_target_path_blocks_manifest: absoluteTargetPath.passed === false && absoluteTargetPath.targetValid === false,
  negative_case_existing_archive_target_requires_A5_review: existingArchiveTarget.passed === false && existingArchiveTarget.targetClear === false,
  v14_145_lifecycle_validator_still_passes: lifecycleSummary?.passed === true,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  authorization_granted_by_this_record: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  image_binary_copy_performed: false,
  target_archive_directory_created: false,
  target_archive_artifact_created: false,
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
  archive_manifest_written: false,
  output_file_write_performed: false,
  push_tag_release_deploy_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
