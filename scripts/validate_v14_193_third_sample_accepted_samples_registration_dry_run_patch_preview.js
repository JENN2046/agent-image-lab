#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.md",
  fixture: "tests/schema_examples/v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.example.json",
  importRecord: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json",
  reviewRecord: "docs/v14_166_lamp_v3_generated_candidate_readiness.md",
  authorizationPackage: "tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview",
  executionMode: "accepted_samples_registration_dry_run_patch_preview_only",
  status: "blocked_pending_human_approval",
  sampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  candidateId: "v14_166_lamp_v3_generated_candidate_001",
  category: "product_still_life",
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function isProjectRelativeRunsPath(value) {
  return typeof value === "string" &&
    value.startsWith("runs/real_generation/") &&
    !path.isAbsolute(value) &&
    !value.includes("..");
}

function evaluate(input, importRecord, reviewText, authorizationPackage) {
  const importWrapper = importRecord.codex_session_image_import || {};
  const asset = importWrapper.imported_asset || {};
  const auth = authorizationPackage.third_sample_accepted_samples_registration_authorization_package_draft || {};
  const target = input.target || {};
  const registryEntry = input.proposed_registry_entry || {};
  const categoryPatch = input.proposed_category_index_patch || {};
  const categoryMeta = categoryPatch.recoverability_metadata || {};
  const humanApproval = registryEntry.human_approval || {};
  const guard = input.guard || {};

  const targetOk =
    input.phase === expected.phase &&
    input.execution_mode === expected.executionMode &&
    input.dry_run_status === expected.status &&
    input.source_import_record_ref === files.importRecord &&
    input.source_review_record_ref === files.reviewRecord &&
    input.source_authorization_package_ref === files.authorizationPackage &&
    target.sample_id === expected.sampleId &&
    target.sample_id === auth.target.sample_id &&
    target.candidate_id === expected.candidateId &&
    target.candidate_id === importWrapper.import_id &&
    target.candidate_id === auth.target.candidate_id &&
    target.category === expected.category &&
    target.human_approval_status === "pending" &&
    target.approved_by === null &&
    target.registration_executable_now === false &&
    reviewText.includes("human_approval_present: fail_pending") &&
    reviewText.includes("accepted_samples_ready: false");

  const registryPatchOk =
    registryEntry.sample_id === expected.sampleId &&
    registryEntry.source_phase === "v14_166" &&
    registryEntry.asset_status === "accepted_candidate_pending_human_approval" &&
    registryEntry.provider_type === "codex_session_image" &&
    registryEntry.plugin_id === null &&
    registryEntry.model === "codex_session_builtin_image_generation" &&
    registryEntry.prompt_package_ref === importWrapper.prompt_package_ref &&
    registryEntry.review_doc_ref === files.reviewRecord &&
    registryEntry.formal_sample_package_ref === files.phaseRecord &&
    registryEntry.image_path === asset.relative_path &&
    registryEntry.image_sha256 === asset.sha256 &&
    registryEntry.image_dimensions === `${asset.width_px}x${asset.height_px}` &&
    registryEntry.verified_sha256 === asset.sha256 &&
    registryEntry.verified_dimensions === `${asset.width_px}x${asset.height_px}` &&
    registryEntry.verified_mime === asset.mime_type &&
    registryEntry.import_record_ref === files.importRecord &&
    registryEntry.category === expected.category &&
    registryEntry.recoverability_status === "workspace_local_verified" &&
    registryEntry.artifact_locator_scope === "project_relative_runs" &&
    registryEntry.verification_mode === "local_file_hash" &&
    registryEntry.portable_after_clone === false &&
    registryEntry.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    registryEntry.image_files_committed_to_git === false &&
    registryEntry.acceptance_summary?.human_approval_present === "fail_pending" &&
    registryEntry.commercial_use_level === "pending_human_review" &&
    humanApproval.approved === false &&
    humanApproval.approved_by === null &&
    humanApproval.approval_statement === null &&
    humanApproval.approval_record_ref === null &&
    registryEntry.write_to_memory_allowed === false &&
    registryEntry.daily_note_write_allowed === false &&
    isProjectRelativeRunsPath(registryEntry.image_path);

  const categoryPatchOk =
    categoryPatch.category_index_ref === "accepted_samples/categories/product_still_life.yaml" &&
    categoryPatch.category === expected.category &&
    categoryPatch.would_add_sample_id === expected.sampleId &&
    categoryPatch.sample_count_delta_after_execution === 1 &&
    categoryPatch.sample_count_after_execution === 2 &&
    categoryMeta.recoverability_status === registryEntry.recoverability_status &&
    categoryMeta.artifact_locator_scope === registryEntry.artifact_locator_scope &&
    categoryMeta.verification_mode === registryEntry.verification_mode &&
    categoryMeta.verified_sha256 === registryEntry.verified_sha256 &&
    categoryMeta.verified_dimensions === registryEntry.verified_dimensions &&
    categoryMeta.verified_mime === registryEntry.verified_mime &&
    categoryMeta.verification_record_ref === registryEntry.verification_record_ref &&
    categoryMeta.import_record_ref === registryEntry.import_record_ref &&
    categoryMeta.portable_after_clone === false &&
    categoryMeta.artifact_recoverability_is_not_vcp_runtime_integration === true;

  const noWrites =
    guard.dry_run_only === true &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
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
    passed: targetOk && registryPatchOk && categoryPatchOk && noWrites && noExternal && noRuntimeClaim,
    targetOk,
    registryPatchOk,
    categoryPatchOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).third_sample_accepted_samples_registration_dry_run_patch_preview;
const importRecord = core.parseJson(files.importRecord);
const reviewText = core.read(files.reviewRecord);
const authorizationPackage = core.parseJson(files.authorizationPackage);
const phaseRecord = core.read(files.phaseRecord);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const baseEval = evaluate(fixture, importRecord, reviewText, authorizationPackage);
addResult("third_sample_dry_run_patch_preview_evaluation_passes", baseEval.passed);

const humanApprovalOverclaim = clone(fixture);
humanApprovalOverclaim.target.human_approval_status = "approved";
humanApprovalOverclaim.target.approved_by = "Jenn";
humanApprovalOverclaim.target.registration_executable_now = true;
humanApprovalOverclaim.proposed_registry_entry.human_approval.approved = true;
humanApprovalOverclaim.proposed_registry_entry.human_approval.approved_by = "Jenn";
const hashMismatch = clone(fixture);
hashMismatch.proposed_registry_entry.verified_sha256 = "0000";
const absolutePath = clone(fixture);
absolutePath.proposed_registry_entry.image_path = "A:/agent-image-lab/secret.png";
const categoryMismatch = clone(fixture);
categoryMismatch.target.category = "fashion_lookbook_portrait";
categoryMismatch.proposed_category_index_patch.category = "fashion_lookbook_portrait";
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const humanApprovalOverclaimEval = evaluate(humanApprovalOverclaim, importRecord, reviewText, authorizationPackage);
const hashMismatchEval = evaluate(hashMismatch, importRecord, reviewText, authorizationPackage);
const absolutePathEval = evaluate(absolutePath, importRecord, reviewText, authorizationPackage);
const categoryMismatchEval = evaluate(categoryMismatch, importRecord, reviewText, authorizationPackage);
const acceptedWriteEval = evaluate(acceptedWrite, importRecord, reviewText, authorizationPackage);
const runtimeClaimEval = evaluate(runtimeClaim, importRecord, reviewText, authorizationPackage);

addResult("negative_case_human_approval_overclaim_fails", humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.targetOk === false);
addResult("negative_case_hash_mismatch_fails", hashMismatchEval.passed === false && hashMismatchEval.registryPatchOk === false);
addResult("negative_case_absolute_artifact_locator_fails", absolutePathEval.passed === false && absolutePathEval.registryPatchOk === false);
addResult("negative_case_category_mismatch_fails", categoryMismatchEval.passed === false && categoryMismatchEval.targetOk === false && categoryMismatchEval.categoryPatchOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "dry_run_status: blocked_pending_human_approval",
  "registration_executable_now: false",
  "accepted_samples_write_performed: false",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.js",
  "tests/schema_examples/v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.example.json",
  "docs/v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview.md",
  "v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_193_third_sample_accepted_samples_registration_dry_run_patch_preview",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  dry_run_status: fixture.dry_run_status,
  target_sample_id: fixture.target.sample_id,
  target_candidate_id: fixture.target.candidate_id,
  category: fixture.target.category,
  human_approval_status: fixture.target.human_approval_status,
  approved_by: fixture.target.approved_by,
  registration_executable_now: fixture.target.registration_executable_now,
  proposed_registry_sample_id: fixture.proposed_registry_entry.sample_id,
  proposed_category_index_ref: fixture.proposed_category_index_patch.category_index_ref,
  sample_count_delta_after_execution: fixture.proposed_category_index_patch.sample_count_delta_after_execution,
  sample_count_after_execution: fixture.proposed_category_index_patch.sample_count_after_execution,
  dry_run_only: fixture.guard.dry_run_only,
  accepted_samples_write_performed: false,
  category_index_write_performed: false,
  image_file_copy_performed: false,
  runs_source_image_modified: false,
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
  negative_case_human_approval_overclaim_fails: humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.targetOk === false,
  negative_case_hash_mismatch_fails: hashMismatchEval.passed === false && hashMismatchEval.registryPatchOk === false,
  negative_case_absolute_artifact_locator_fails: absolutePathEval.passed === false && absolutePathEval.registryPatchOk === false,
  negative_case_category_mismatch_fails: categoryMismatchEval.passed === false && categoryMismatchEval.targetOk === false && categoryMismatchEval.categoryPatchOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
