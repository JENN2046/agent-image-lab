#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_145_sample_lifecycle_state_machine.md",
  lifecycleSchema: "schemas/sample_lifecycle_state_machine.schema.yaml",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  importRecord: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
  reviewRecord: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  approvalRecord: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  v14_142_validator: "scripts/validate_v14_142_multi_accepted_sample_matrix.js",
  currentValidator: "scripts/validate_v14_145_sample_lifecycle_state_machine.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const sampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
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

function evaluateLifecycle(input) {
  const imported = input.importRecordExists && input.artifactPathPresent && input.localFileVerified;
  const reviewed = imported && input.reviewRecordExists && input.reviewDecisionPresent;
  const acceptedMetadataRegistered = reviewed && input.registryEntryExists && input.categoryIndexEntryExists && input.humanApprovalPresent;
  const recoverable = acceptedMetadataRegistered && input.artifactExists && input.sha256Verified && input.dimensionsVerified && input.mimeVerified;
  const archiveReady = recoverable && input.durableArchiveManifestPrepared === true;
  const productionCandidatePending =
    archiveReady &&
    input.productionCandidateAuthorizationActive === true &&
    input.productionCandidateCreated === false;

  let currentState = "none";
  if (productionCandidatePending) currentState = "production_candidate_pending";
  else if (archiveReady) currentState = "archive_ready";
  else if (recoverable) currentState = "recoverable";
  else if (acceptedMetadataRegistered) currentState = "accepted_metadata_registered";
  else if (reviewed) currentState = "reviewed";
  else if (imported) currentState = "imported";

  return {
    imported,
    reviewed,
    acceptedMetadataRegistered,
    recoverable,
    archiveReady,
    productionCandidatePending,
    currentState,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const schema = core.read(files.lifecycleSchema);
const registry = core.read(files.acceptedRegistry);
const categoryIndex = core.read(files.categoryIndex);
const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
const reviewRecord = core.read(files.reviewRecord);
const approvalRecord = core.read(files.approvalRecord);
const phaseRecord = core.read(files.phaseRecord);
const sampleBlock = core.extractRegistrySampleBlock(registry, sampleId);
const metadata = core.readImageMetadata(importRecord.imported_asset.relative_path);
const actualSha256 = core.sha256File(importRecord.imported_asset.relative_path);
const currentSurfaces = [
  phaseRecord,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");

for (const token of [
  "sample_lifecycle_state_machine:",
  "state_order:",
  "- imported",
  "- reviewed",
  "- accepted_metadata_registered",
  "- recoverable",
  "- archive_ready",
  "- production_candidate_pending",
  "accepted_sample_direct_to_production_candidate_forbidden: true",
  "current_state: recoverable",
  "archive_ready: false",
  "production_candidate_pending: false",
  "production_candidate_write_authorization_required: true",
  "production_candidate_is_not_accepted_sample: true",
  "production_candidate_write_allowed_by_schema: false",
]) {
  requireToken("lifecycle_schema", schema, token);
}

let matrixSummary = null;
try {
  matrixSummary = JSON.parse(execFileSync(process.execPath, [files.v14_142_validator], { cwd: root, encoding: "utf8" }));
  addResult("v14_142_matrix_validator_still_passes", matrixSummary.passed === true);
} catch (error) {
  addResult("v14_142_matrix_validator_still_passes", false, error.message);
}

const baseInput = {
  importRecordExists: true,
  artifactPathPresent: Boolean(importRecord.imported_asset.relative_path),
  localFileVerified: importRecord.imported_asset.local_file_verified === true,
  reviewRecordExists: true,
  reviewDecisionPresent: reviewRecord.includes("decision: final_visual_candidate_pass"),
  registryEntryExists: sampleBlock.includes(`sample_id: ${sampleId}`),
  categoryIndexEntryExists: categoryIndex.includes(sampleId),
  humanApprovalPresent: approvalRecord.includes("approved_by: Jenn"),
  artifactExists: core.exists(importRecord.imported_asset.relative_path),
  sha256Verified: actualSha256 === core.extractScalarField(sampleBlock, "verified_sha256"),
  dimensionsVerified: `${metadata.width}x${metadata.height}` === core.extractScalarField(sampleBlock, "verified_dimensions"),
  mimeVerified: metadata.mimeType === core.extractScalarField(sampleBlock, "verified_mime"),
  durableArchiveManifestPrepared: false,
  productionCandidateAuthorizationActive: false,
  productionCandidateCreated: false,
};

const lifecycle = evaluateLifecycle(baseInput);
addResult("current_sample_imported", lifecycle.imported);
addResult("current_sample_reviewed", lifecycle.reviewed);
addResult("current_sample_accepted_metadata_registered", lifecycle.acceptedMetadataRegistered);
addResult("current_sample_recoverable", lifecycle.recoverable);
addResult("current_sample_archive_ready_false", lifecycle.archiveReady === false);
addResult("current_sample_production_candidate_pending_false", lifecycle.productionCandidatePending === false);
addResult("current_sample_state_is_recoverable", lifecycle.currentState === "recoverable", lifecycle.currentState);

const missingApproval = evaluateLifecycle({ ...baseInput, humanApprovalPresent: false });
const missingRecoverability = evaluateLifecycle({ ...baseInput, sha256Verified: false });
const skipArchiveToProduction = evaluateLifecycle({
  ...baseInput,
  productionCandidateAuthorizationActive: true,
  durableArchiveManifestPrepared: false,
});

addResult("negative_case_missing_human_approval_blocks_accepted_metadata_registered", missingApproval.acceptedMetadataRegistered === false);
addResult("negative_case_missing_recoverability_blocks_archive_ready", missingRecoverability.archiveReady === false);
addResult("negative_case_skip_archive_to_production_candidate_fails", skipArchiveToProduction.productionCandidatePending === false);
addResult("accepted_sample_is_not_production_candidate", baseInput.productionCandidateCreated === false && lifecycle.currentState === "recoverable");

for (const token of [
  "phase: v14_145_sample_lifecycle_state_machine",
  "sample_lifecycle_state_machine_created: true",
  "current_sample_state: recoverable",
  "archive_ready: false",
  "production_candidate_pending: false",
  "accepted_sample_is_not_production_candidate: true",
  "negative_case_skip_archive_to_production_candidate_fails: true",
  "accepted_samples_write_performed: false",
  "image_binary_copy_performed: false",
  "production_candidate_created: false",
  "vcp_runtime_integration_proven: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_145_sample_lifecycle_state_machine.js",
  "docs/v14_145_sample_lifecycle_state_machine.md",
  "schemas/sample_lifecycle_state_machine.schema.yaml",
  "v14_145_sample_lifecycle_state_machine",
  "sample_lifecycle_state_machine_created: true",
  "accepted_sample_is_not_production_candidate: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

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
  validator: "validate_v14_145_sample_lifecycle_state_machine",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  sample_lifecycle_state_machine_created: true,
  current_sample_state: lifecycle.currentState,
  current_sample_imported: lifecycle.imported,
  current_sample_reviewed: lifecycle.reviewed,
  current_sample_accepted_metadata_registered: lifecycle.acceptedMetadataRegistered,
  current_sample_recoverable: lifecycle.recoverable,
  archive_ready: lifecycle.archiveReady,
  production_candidate_pending: lifecycle.productionCandidatePending,
  accepted_sample_is_not_production_candidate: baseInput.productionCandidateCreated === false && lifecycle.currentState === "recoverable",
  negative_case_missing_human_approval_blocks_accepted_metadata_registered: missingApproval.acceptedMetadataRegistered === false,
  negative_case_missing_recoverability_blocks_archive_ready: missingRecoverability.archiveReady === false,
  negative_case_skip_archive_to_production_candidate_fails: skipArchiveToProduction.productionCandidatePending === false,
  v14_142_matrix_validator_still_passes: matrixSummary?.passed === true,
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
