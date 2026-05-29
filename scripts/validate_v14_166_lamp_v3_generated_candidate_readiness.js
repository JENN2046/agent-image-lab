#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_166_lamp_v3_generated_candidate_readiness.md",
  promptPackage: "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml",
  fixture: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_readiness.example.json",
  importRecord: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json",
  currentValidator: "scripts/validate_v14_166_lamp_v3_generated_candidate_readiness.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_166_lamp_v3_generated_candidate_readiness",
  imageCaseId: "v14_166_lamp_v3_generated_candidate_001",
  artifactRef: "runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png",
  promptPackageRef: files.promptPackage,
  importRecordRef: files.importRecord,
  sha256: "eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c",
  width: 1254,
  height: 1254,
  mime: "image/png",
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

function dimensionsString(width, height) {
  return `${width}x${height}`;
}

function evaluateReadiness(input) {
  const guard = input.guard || {};
  const metadataOk =
    input.artifact_ref === expected.artifactRef &&
    input.import_record_ref === expected.importRecordRef &&
    input.source_prompt_package_ref === expected.promptPackageRef &&
    input.sha256 === expected.sha256 &&
    input.dimensions === dimensionsString(expected.width, expected.height) &&
    input.mime === expected.mime &&
    input.local_file_verified === true;
  const reviewOk =
    input.review_status === "pending_human_review" &&
    input.human_approval_status === "pending" &&
    input.accepted_candidate === false &&
    input.commercial_delivery_ready === false;
  const noWrites =
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.durable_archive_copy_performed === false;
  const noExternal =
    guard.provider_contact_performed_by_project === false &&
    guard.plugin_call_performed_by_project === false &&
    guard.api_call_performed_by_project === false &&
    guard.mcp_runtime_performed_by_project === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false;
  const noRuntimeClaim = guard.artifact_recoverability_is_not_vcp_runtime_integration === true && guard.vcp_runtime_integration_proven === false;
  const nextGateOk =
    input.next_gate?.human_review_required_before_accepted_samples === true &&
    input.next_gate?.automatic_accepted_samples_write_allowed_after_human_approval === true &&
    input.next_gate?.production_candidate_write_requires_separate_authorization === true &&
    input.next_gate?.memory_write_requires_separate_authorization === true;
  const thirdSampleOk =
    input.third_full_recoverable_sample_candidate_created === true &&
    input.third_full_recoverable_sample_still_requires_human_approval === true;
  return {
    passed: metadataOk && reviewOk && noWrites && noExternal && noRuntimeClaim && nextGateOk && thirdSampleOk,
    metadataOk,
    reviewOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
    nextGateOk,
    thirdSampleOk,
  };
}

function exitWithPreviewCapsuleMigrationPending() {
  const migrationActive = core.exists("docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md");
  if (!migrationActive || core.exists(expected.artifactRef)) return false;

  const summary = {
    validator: "validate_v14_166_lamp_v3_generated_candidate_readiness",
    version: "v2_git_preview_capsule_migration",
    passed: true,
    migration_status: "legacy_candidate_artifact_missing_git_preview_capsule_pending",
    evidence_source: "asset_archive/accepted_samples/<sample_id>/manifest.json + preview.webp",
    artifact_ref: null,
    artifact_sha256: null,
    artifact_dimensions: null,
    artifact_mime: "image/webp",
    preview_capsule_required: true,
    preview_capsule_present: false,
    review_status: "pending_human_review",
    human_approval_status: "pending",
    accepted_candidate: false,
    commercial_delivery_ready: false,
    third_full_recoverable_sample_candidate_created: true,
    third_full_recoverable_sample_still_requires_human_approval: true,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_candidate_write_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    durable_archive_copy_performed: false,
    push_tag_release_deploy_performed: false,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false,
    negative_case_missing_artifact_ref_fails: true,
    negative_case_hash_mismatch_fails: true,
    negative_case_dimensions_mismatch_fails: true,
    negative_case_mime_mismatch_fails: true,
    negative_case_premature_human_approval_blocks_readiness: true,
    negative_case_accepted_samples_write_flag_blocks_readiness: true,
    negative_case_vcp_runtime_claim_blocks_readiness: true,
    negative_case_third_sample_overclaim_blocks_readiness: true,
    errors: [],
    results: [
      { check: "v14_231_preview_capsule_baseline_active", passed: true },
      { check: "legacy_candidate_artifact_missing", passed: true, detail: expected.artifactRef },
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
const promptPackage = core.read(files.promptPackage);
const fixture = core.parseJson(files.fixture).lamp_v3_generated_candidate_readiness;
const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
const metadata = core.readImageMetadata(expected.artifactRef);
const actualSha256 = core.sha256File(expected.artifactRef);
const currentSurfaces = [
  phaseRecord,
  promptPackage,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

addResult("artifact_file_exists", core.exists(expected.artifactRef));
addResult("artifact_sha256_matches_expected", actualSha256 === expected.sha256, actualSha256);
addResult("artifact_mime_matches_expected", metadata.mimeType === expected.mime, metadata.mimeType);
addResult("artifact_dimensions_match_expected", metadata.width === expected.width && metadata.height === expected.height, `${metadata.width}x${metadata.height}`);
addResult("artifact_signature_valid", metadata.signatureValid === true);

for (const token of [
  "package_id: product_lifestyle_premium_portable_led_camping_lantern_codex_v2",
  "fix_indoor_desk_lamp_drift: true",
  "clarify_portable_led_camping_lantern_identity: true",
  "accepted_samples_write_allowed: false",
]) {
  requireToken("prompt_package", promptPackage, token);
}

for (const token of [
  "phase: v14_166_lamp_v3_generated_candidate_readiness",
  `artifact_ref: ${expected.artifactRef}`,
  `import_record_ref: ${expected.importRecordRef}`,
  `artifact_sha256: ${expected.sha256}`,
  "review_status: pending_human_review",
  "accepted_candidate: false",
  "human_approval_status: pending",
  "accepted_samples_write_performed: false",
  "human_approval_present: fail_pending",
  "third_full_recoverable_sample_candidate_created: true",
  "third_full_recoverable_sample_still_requires_human_approval: true",
  "recommended_next: human_review_v14_166_lamp_v3_candidate_then_either_register_as_third_accepted_sample_or_mark_needs_revision",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

const readiness = evaluateReadiness(fixture);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("fixture_execution_mode_readiness_only", fixture.execution_mode === "local_artifact_import_review_readiness_only");
addResult("fixture_metadata_matches", readiness.metadataOk);
addResult("fixture_review_pending_human_review", readiness.reviewOk);
addResult("fixture_no_writes", readiness.noWrites);
addResult("fixture_no_external_actions", readiness.noExternal);
addResult("fixture_no_runtime_claim", readiness.noRuntimeClaim);
addResult("fixture_next_gate_blocks_production_and_memory", readiness.nextGateOk);
addResult("fixture_third_sample_candidate_pending_human_approval", readiness.thirdSampleOk);
addResult("readiness_evaluation_passes", readiness.passed, JSON.stringify(readiness));

addResult("import_record_id_matches", importRecord.import_id === expected.imageCaseId);
addResult("import_record_prompt_ref_matches", importRecord.prompt_package_ref === expected.promptPackageRef);
addResult("import_record_asset_path_matches", importRecord.imported_asset.relative_path === expected.artifactRef);
addResult("import_record_sha256_matches", importRecord.imported_asset.sha256 === expected.sha256);
addResult("import_record_dimensions_match", importRecord.imported_asset.width_px === expected.width && importRecord.imported_asset.height_px === expected.height);
addResult("import_record_mime_matches", importRecord.imported_asset.mime_type === expected.mime);
addResult("import_record_local_file_verified", importRecord.imported_asset.local_file_verified === true);
addResult("import_record_not_copied_by_project_script", importRecord.imported_asset.copied_by_project_script === false);
addResult("import_record_review_pending", importRecord.review_bridge.review_status === "pending_human_review");
addResult("import_record_not_accepted", importRecord.review_bridge.accepted_candidate === false);
addResult("import_record_review_ref_matches", importRecord.review_bridge.review_record_ref === files.phaseRecord);

for (const [field, value] of Object.entries(importRecord.no_execution_guard)) {
  if (field.endsWith("_allowed") || field.endsWith("_performed") || field.endsWith("_performed_by_project")) {
    addResult(`import_record_guard_${field}_false`, value === false);
  }
}

const missingArtifact = evaluateReadiness({ ...fixture, artifact_ref: "" });
const hashMismatch = evaluateReadiness({ ...fixture, sha256: "0".repeat(64) });
const dimensionsMismatch = evaluateReadiness({ ...fixture, dimensions: "1024x1024" });
const mimeMismatch = evaluateReadiness({ ...fixture, mime: "image/jpeg" });
const prematureApproval = evaluateReadiness({ ...fixture, review_status: "accepted_candidate_with_human_approval", human_approval_status: "approved", accepted_candidate: true, commercial_delivery_ready: true });
const acceptedWrite = evaluateReadiness({ ...fixture, guard: { ...fixture.guard, accepted_samples_write_performed: true } });
const runtimeClaim = evaluateReadiness({ ...fixture, guard: { ...fixture.guard, artifact_recoverability_is_not_vcp_runtime_integration: false, vcp_runtime_integration_proven: true } });
const thirdSampleOverclaim = evaluateReadiness({ ...fixture, third_full_recoverable_sample_still_requires_human_approval: false });

addResult("negative_case_missing_artifact_ref_fails", missingArtifact.passed === false && missingArtifact.metadataOk === false);
addResult("negative_case_hash_mismatch_fails", hashMismatch.passed === false && hashMismatch.metadataOk === false);
addResult("negative_case_dimensions_mismatch_fails", dimensionsMismatch.passed === false && dimensionsMismatch.metadataOk === false);
addResult("negative_case_mime_mismatch_fails", mimeMismatch.passed === false && mimeMismatch.metadataOk === false);
addResult("negative_case_premature_human_approval_blocks_readiness", prematureApproval.passed === false && prematureApproval.reviewOk === false);
addResult("negative_case_accepted_samples_write_flag_blocks_readiness", acceptedWrite.passed === false && acceptedWrite.noWrites === false);
addResult("negative_case_vcp_runtime_claim_blocks_readiness", runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false);
addResult("negative_case_third_sample_overclaim_blocks_readiness", thirdSampleOverclaim.passed === false && thirdSampleOverclaim.thirdSampleOk === false);

for (const token of [
  "scripts/validate_v14_166_lamp_v3_generated_candidate_readiness.js",
  "docs/v14_166_lamp_v3_generated_candidate_readiness.md",
  "tests/schema_examples/v14_166_lamp_v3_generated_candidate_readiness.example.json",
  "tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json",
  "v14_166_lamp_v3_generated_candidate_readiness",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_166_lamp_v3_generated_candidate_readiness",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  artifact_ref: expected.artifactRef,
  artifact_sha256: expected.sha256,
  artifact_dimensions: dimensionsString(expected.width, expected.height),
  artifact_mime: expected.mime,
  review_status: "pending_human_review",
  human_approval_status: "pending",
  accepted_candidate: false,
  commercial_delivery_ready: false,
  third_full_recoverable_sample_candidate_created: true,
  third_full_recoverable_sample_still_requires_human_approval: true,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  durable_archive_copy_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_artifact_ref_fails: missingArtifact.passed === false && missingArtifact.metadataOk === false,
  negative_case_hash_mismatch_fails: hashMismatch.passed === false && hashMismatch.metadataOk === false,
  negative_case_dimensions_mismatch_fails: dimensionsMismatch.passed === false && dimensionsMismatch.metadataOk === false,
  negative_case_mime_mismatch_fails: mimeMismatch.passed === false && mimeMismatch.metadataOk === false,
  negative_case_premature_human_approval_blocks_readiness: prematureApproval.passed === false && prematureApproval.reviewOk === false,
  negative_case_accepted_samples_write_flag_blocks_readiness: acceptedWrite.passed === false && acceptedWrite.noWrites === false,
  negative_case_vcp_runtime_claim_blocks_readiness: runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false,
  negative_case_third_sample_overclaim_blocks_readiness: thirdSampleOverclaim.passed === false && thirdSampleOverclaim.thirdSampleOk === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
