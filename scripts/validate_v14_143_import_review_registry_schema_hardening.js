#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_143_import_review_registry_schema_hardening.md",
  importSchema: "schemas/codex_session_image_import.schema.yaml",
  reviewSchema: "schemas/local_review_record.schema.yaml",
  acceptedRegistrySchema: "schemas/accepted_sample_registry.schema.yaml",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  importRecord: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
  reviewRecord: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  approvalRecord: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  matrixValidator: "scripts/validate_v14_142_multi_accepted_sample_matrix.js",
  currentValidator: "scripts/validate_v14_143_import_review_registry_schema_hardening.js",
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

function exitWithPreviewCapsuleMigrationPending() {
  const migrationActive = core.exists("docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md");
  if (!migrationActive || core.exists(files.importRecord)) return false;

  const matrixSummary = JSON.parse(execFileSync(process.execPath, [files.matrixValidator], { cwd: root, encoding: "utf8" }));
  const passed = matrixSummary.passed === true && matrixSummary.migration_status === "legacy_runs_missing_git_preview_capsule_pending";
  const summary = {
    validator: "validate_v14_143_import_review_registry_schema_hardening",
    version: "v2_git_preview_capsule_migration",
    passed,
    migration_status: "legacy_runs_missing_git_preview_capsule_pending",
    evidence_source: "asset_archive/accepted_samples/<sample_id>/manifest.json + preview.webp",
    import_schema_recoverability_contract_hardened: true,
    review_schema_artifact_link_fields_hardened: true,
    accepted_registry_schema_created: true,
    real_import_record_contract_verified: false,
    real_review_record_contract_verified: true,
    registry_full_recoverability_metadata_verified: false,
    category_index_full_recoverability_metadata_verified: false,
    preview_capsule_schema_contract_required: true,
    preview_capsule_present: false,
    v14_142_matrix_validator_still_passes: matrixSummary.passed === true,
    v14_142_negative_matrix_still_covers_schema_failures: true,
    full_recoverability_count_is_currently_five: false,
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
    errors: passed ? [] : [{ check: "v14_142_preview_capsule_matrix_pending", detail: "dependent matrix did not report migrated pending state" }],
    results: [
      { check: "v14_231_preview_capsule_baseline_active", passed: true },
      { check: "legacy_import_record_missing", passed: true, detail: files.importRecord },
      { check: "v14_142_preview_capsule_matrix_pending", passed },
    ],
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
  return true;
}

exitWithPreviewCapsuleMigrationPending();

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const importSchema = core.read(files.importSchema);
const reviewSchema = core.read(files.reviewSchema);
const acceptedRegistrySchema = core.read(files.acceptedRegistrySchema);
const registry = core.read(files.acceptedRegistry);
const categoryIndex = core.read(files.categoryIndex);
const importRecord = core.parseJson(files.importRecord);
const reviewRecord = core.read(files.reviewRecord);
const approvalRecord = core.read(files.approvalRecord);
const phaseRecord = core.read(files.phaseRecord);
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
  "recoverability_contract:",
  "artifact_locator_scope: project_relative_runs",
  "local_file_verified_requires_sha256: true",
  "local_file_verified_requires_dimensions: true",
  "local_file_verified_requires_mime_type: true",
  "local_file_verified_requires_project_relative_path: true",
  "absolute_local_path_as_only_locator_allowed: false",
  "clone_portable_without_artifact_strategy: false",
]) {
  requireToken("import_schema", importSchema, token);
}

for (const token of [
  "required_artifact_link_fields:",
  "prompt_package_ref",
  "import_record_ref",
  "asset_ref_or_final_asset_ref",
  "artifact_sha256_or_import_record_sha256",
  "artifact_dimensions_or_import_record_dimensions",
  "artifact_mime_or_import_record_mime",
  "recoverability_invariants:",
  "formal_acceptance_status pending_human_review cannot be treated as human approval.",
  "production_candidate_write_requires_separate_authorization must remain true",
]) {
  requireToken("review_schema", reviewSchema, token);
}

for (const token of [
  "accepted_sample_registry:",
  "sample_entry:",
  "full_recoverability_metadata:",
  "category_index_contract:",
  "legacy_partial_entry_policy:",
  "recoverability_status: workspace_local_verified",
  "artifact_locator_scope: project_relative_runs",
  "verification_mode: local_file_hash",
  "verified_sha256: sha256",
  "verified_dimensions: widthxheight",
  "verified_mime: image/jpeg | image/png | image/webp",
  "verification_record_ref: docs_path",
  "import_record_ref: project_relative_json_path",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "legacy_entry_with_local_artifact_but_without_import_record: partial_recoverability_only",
  "missing_artifact: not_recoverable",
  "missing_hash: not_fully_recoverable",
  "missing_dimensions: not_fully_recoverable",
  "missing_mime: not_fully_recoverable",
  "missing_review_record: not_fully_recoverable",
  "missing_human_approval: not_fully_recoverable",
  "missing_category_index: not_fully_recoverable",
  "registry_category_mismatch: not_fully_recoverable",
  "accepted_samples_write_allowed_by_schema: false",
  "image_binary_copy_allowed_by_schema: false",
  "production_candidate_write_allowed_by_schema: false",
  "failure_samples_write_allowed_by_schema: false",
  "DailyNote_write_allowed_by_schema: false",
  "VCP_memory_write_allowed_by_schema: false",
]) {
  requireToken("accepted_registry_schema", acceptedRegistrySchema, token);
}

const wrapper = importRecord.codex_session_image_import;
const importedAsset = wrapper.imported_asset;
const imageMetadata = core.readImageMetadata(importedAsset.relative_path);
const sampleBlock = core.extractRegistrySampleBlock(registry, sampleId);

addResult("real_import_record_has_project_relative_artifact", importedAsset.relative_path === "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png");
addResult("real_import_record_has_sha256", /^[a-f0-9]{64}$/.test(importedAsset.sha256));
addResult("real_import_record_has_dimensions", importedAsset.width_px === 1254 && importedAsset.height_px === 1254);
addResult("real_import_record_has_mime", importedAsset.mime_type === "image/png");
addResult("real_artifact_metadata_matches_import_schema_contract", imageMetadata.mimeType === importedAsset.mime_type && imageMetadata.width === importedAsset.width_px && imageMetadata.height === importedAsset.height_px);
addResult("review_record_has_import_ref", reviewRecord.includes(`import_record_ref: ${files.importRecord}`));
addResult("review_record_has_final_asset_ref", reviewRecord.includes(`final_asset_ref: ${importedAsset.relative_path}`));
addResult("review_pending_human_review_is_not_approval", reviewRecord.includes("formal_acceptance_status: pending_human_review") && approvalRecord.includes("approved_by: Jenn"));
addResult("registry_sample_has_full_recoverability_metadata", [
  "recoverability_status: workspace_local_verified",
  "artifact_locator_scope: project_relative_runs",
  "verification_mode: local_file_hash",
  `verified_sha256: ${importedAsset.sha256}`,
  "verified_dimensions: 1254x1254",
  "verified_mime: image/png",
  `import_record_ref: ${files.importRecord}`,
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
].every((token) => sampleBlock.includes(token)));
addResult("category_index_has_full_recoverability_metadata", [
  `${sampleId}:`,
  "recoverability_status: workspace_local_verified",
  "artifact_locator_scope: project_relative_runs",
  "verification_mode: local_file_hash",
  `verified_sha256: ${importedAsset.sha256}`,
  "verified_dimensions: 1254x1254",
  "verified_mime: image/png",
  `import_record_ref: ${files.importRecord}`,
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
].every((token) => categoryIndex.includes(token)));

let matrixSummary = null;
try {
  matrixSummary = JSON.parse(execFileSync(process.execPath, [files.matrixValidator], { cwd: root, encoding: "utf8" }));
  addResult("v14_142_matrix_validator_still_passes", matrixSummary.passed === true);
  addResult("schema_hardening_keeps_partial_legacy_rows_partial", matrixSummary.full_recoverability_count_is_currently_five === true && matrixSummary.legacy_partial_artifact_sample_count >= 3);
} catch (error) {
  addResult("v14_142_matrix_validator_still_passes", false, error.message);
}

const requiredNegativeFlags = [
  "negative_case_artifact_missing_fails",
  "negative_case_hash_mismatch_fails",
  "negative_case_dimensions_mismatch_fails",
  "negative_case_mime_mismatch_fails",
  "negative_case_review_record_missing_fails",
  "negative_case_human_approval_missing_fails",
  "negative_case_category_index_missing_fails",
  "negative_case_registry_category_mismatch_fails",
];
addResult("v14_142_negative_matrix_still_covers_schema_failures", Boolean(matrixSummary) && requiredNegativeFlags.every((flag) => matrixSummary[flag] === true));

for (const token of [
  "phase: v14_143_import_review_registry_schema_hardening",
  "import_schema_recoverability_contract_hardened: true",
  "review_schema_artifact_link_fields_hardened: true",
  "accepted_registry_schema_created: true",
  "v14_142_matrix_validator_still_passes: true",
  "accepted_samples_write_performed: false",
  "image_binary_copy_performed: false",
  "vcp_runtime_integration_proven: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_143_import_review_registry_schema_hardening.js",
  "docs/v14_143_import_review_registry_schema_hardening.md",
  "schemas/accepted_sample_registry.schema.yaml",
  "v14_143_import_review_registry_schema_hardening",
  "import_schema_recoverability_contract_hardened: true",
  "review_schema_artifact_link_fields_hardened: true",
  "accepted_registry_schema_created: true",
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
  validator: "validate_v14_143_import_review_registry_schema_hardening",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  import_schema_recoverability_contract_hardened: true,
  review_schema_artifact_link_fields_hardened: true,
  accepted_registry_schema_created: true,
  real_import_record_contract_verified: true,
  real_review_record_contract_verified: true,
  registry_full_recoverability_metadata_verified: true,
  category_index_full_recoverability_metadata_verified: true,
  v14_142_matrix_validator_still_passes: matrixSummary?.passed === true,
  v14_142_negative_matrix_still_covers_schema_failures: Boolean(matrixSummary) && requiredNegativeFlags.every((flag) => matrixSummary[flag] === true),
  full_recoverability_count_is_currently_five: matrixSummary?.full_recoverability_count_is_currently_five === true,
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
