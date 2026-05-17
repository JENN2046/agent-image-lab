#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_161_codex_session_generated_candidate_readiness.md",
  schema: "schemas/codex_session_generated_candidate_readiness.schema.yaml",
  fixture: "tests/schema_examples/v14_161_codex_session_generated_candidate_readiness.example.json",
  lampImportRecord: "tests/schema_examples/v14_161_product_still_life_smart_desk_lamp_import_record.json",
  bagImportRecord: "tests/schema_examples/v14_161_fashion_lifestyle_woven_crossbody_bag_import_record.json",
  currentValidator: "scripts/validate_v14_161_codex_session_generated_candidate_readiness.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  lamp: {
    candidateId: "v14_161_product_still_life_smart_desk_lamp_candidate_001",
    visualTask: "product_still_life_square_hero",
    imagePath: "runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_product_still_life_smart_desk_lamp_candidate_001.png",
    importRecordPath: files.lampImportRecord,
    promptPackageRef: "session_prompt_inline:v14_161_product_still_life_smart_desk_lamp_candidate_001",
    sha256: "94e8354eb96b2a38e44d5cb080a2350f46517cab7d1a6201ec6abe2b8f705e40",
    width: 1254,
    height: 1254,
    mimeType: "image/png",
    reviewStatus: "needs_revision",
    humanApprovalStatus: "not_approved",
    acceptedCandidate: false,
    commercialDeliveryReady: false,
  },
  bag: {
    candidateId: "v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001",
    visualTask: "fashion_lifestyle_accessory_square_hero",
    imagePath: "runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001.png",
    importRecordPath: files.bagImportRecord,
    promptPackageRef: "session_prompt_inline:v14_161_fashion_lifestyle_woven_crossbody_bag_candidate_001",
    sha256: "3422671f95e9b218829966ae46f4b284ae619875e080c473a295cf9e65432ba3",
    width: 1254,
    height: 1254,
    mimeType: "image/png",
    reviewStatus: "accepted_candidate_with_human_approval",
    humanApprovalStatus: "approved",
    approvedBy: "Jenn",
    acceptedCandidate: true,
    commercialDeliveryReady: true,
  },
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

function dimensionsString(width, height) {
  return `${width}x${height}`;
}

function validateCandidate(candidate, expectedCandidate, importRecord) {
  const wrapper = importRecord.codex_session_image_import;
  const asset = wrapper?.imported_asset || {};
  const bridge = wrapper?.review_bridge || {};
  const source = wrapper?.source || {};
  const guard = wrapper?.no_execution_guard || {};
  const metadata = core.readImageMetadata(expectedCandidate.imagePath);
  const actualSha256 = core.sha256File(expectedCandidate.imagePath);

  addResult(`${expectedCandidate.candidateId}_candidate_id_matches`, candidate.candidate_id === expectedCandidate.candidateId);
  addResult(`${expectedCandidate.candidateId}_visual_task_matches`, candidate.visual_task === expectedCandidate.visualTask);
  addResult(`${expectedCandidate.candidateId}_artifact_ref_matches`, candidate.artifact_ref === expectedCandidate.imagePath);
  addResult(`${expectedCandidate.candidateId}_import_record_ref_matches`, candidate.import_record_ref === expectedCandidate.importRecordPath);
  addResult(`${expectedCandidate.candidateId}_prompt_ref_matches`, candidate.prompt_package_ref === expectedCandidate.promptPackageRef);
  addResult(`${expectedCandidate.candidateId}_sha256_matches_fixture`, candidate.sha256 === expectedCandidate.sha256);
  addResult(`${expectedCandidate.candidateId}_dimensions_match_fixture`, candidate.dimensions === dimensionsString(expectedCandidate.width, expectedCandidate.height));
  addResult(`${expectedCandidate.candidateId}_mime_matches_fixture`, candidate.mime === expectedCandidate.mimeType);
  addResult(`${expectedCandidate.candidateId}_local_file_verified_true`, candidate.local_file_verified === true);
  addResult(`${expectedCandidate.candidateId}_review_status_matches`, candidate.review_status === expectedCandidate.reviewStatus);
  addResult(`${expectedCandidate.candidateId}_human_approval_status_matches`, candidate.human_approval_status === expectedCandidate.humanApprovalStatus);
  addResult(`${expectedCandidate.candidateId}_accepted_candidate_matches`, candidate.accepted_candidate === expectedCandidate.acceptedCandidate);
  addResult(`${expectedCandidate.candidateId}_commercial_delivery_ready_matches`, candidate.commercial_delivery_ready === expectedCandidate.commercialDeliveryReady);

  addResult(`${expectedCandidate.candidateId}_artifact_exists`, core.exists(expectedCandidate.imagePath));
  addResult(`${expectedCandidate.candidateId}_artifact_sha256_matches`, actualSha256 === expectedCandidate.sha256, actualSha256);
  addResult(`${expectedCandidate.candidateId}_artifact_mime_matches`, metadata.mimeType === expectedCandidate.mimeType, metadata.mimeType);
  addResult(`${expectedCandidate.candidateId}_artifact_dimensions_match`, metadata.width === expectedCandidate.width && metadata.height === expectedCandidate.height, `${metadata.width}x${metadata.height}`);
  addResult(`${expectedCandidate.candidateId}_artifact_signature_valid`, metadata.signatureValid === true);

  addResult(`${expectedCandidate.candidateId}_import_id_matches`, wrapper?.import_id === expectedCandidate.candidateId);
  addResult(`${expectedCandidate.candidateId}_import_provider_codex_session`, wrapper?.provider_id === "codex_session_image");
  addResult(`${expectedCandidate.candidateId}_import_mode_manual`, wrapper?.import_mode === "manual_session_import");
  addResult(`${expectedCandidate.candidateId}_import_status_review_linked`, wrapper?.status === "review_linked");
  addResult(`${expectedCandidate.candidateId}_import_prompt_ref_matches`, wrapper?.prompt_package_ref === expectedCandidate.promptPackageRef);
  addResult(`${expectedCandidate.candidateId}_import_asset_path_matches`, asset.relative_path === expectedCandidate.imagePath);
  addResult(`${expectedCandidate.candidateId}_import_asset_sha256_matches`, asset.sha256 === expectedCandidate.sha256);
  addResult(`${expectedCandidate.candidateId}_import_asset_dimensions_match`, asset.width_px === expectedCandidate.width && asset.height_px === expectedCandidate.height);
  addResult(`${expectedCandidate.candidateId}_import_asset_mime_matches`, asset.mime_type === expectedCandidate.mimeType);
  addResult(`${expectedCandidate.candidateId}_import_asset_local_file_verified`, asset.local_file_verified === true);
  addResult(`${expectedCandidate.candidateId}_import_asset_not_copied_by_project_script`, asset.copied_by_project_script === false);
  addResult(`${expectedCandidate.candidateId}_review_bridge_status_matches`, bridge.review_status === expectedCandidate.reviewStatus);
  addResult(`${expectedCandidate.candidateId}_review_bridge_accepted_candidate_matches`, bridge.accepted_candidate === expectedCandidate.acceptedCandidate);
  addResult(`${expectedCandidate.candidateId}_review_record_ref_matches`, bridge.review_record_ref === files.phaseRecord);

  addResult(`${expectedCandidate.candidateId}_source_codex_session_generation_true`, source.codex_session_generation === true);
  addResult(`${expectedCandidate.candidateId}_source_disallows_project_generation`, source.project_script_generation_allowed === false && source.image_generation_by_script === false);
  addResult(`${expectedCandidate.candidateId}_source_disallows_provider_mcp`, source.provider_api_call_allowed === false && source.mcp_runtime_allowed === false && source.codex_image_direct_call_allowed === false);

  for (const [field, value] of Object.entries(guard)) {
    if (field.endsWith("_allowed") || field.endsWith("_performed") || field.endsWith("_performed_by_project")) {
      addResult(`${expectedCandidate.candidateId}_guard_${field}_false`, value === false);
    }
  }

  if (expectedCandidate.acceptedCandidate) {
    addResult(`${expectedCandidate.candidateId}_human_approval_by_jenn_present`, candidate.approved_by === expectedCandidate.approvedBy);
  } else {
    addResult(`${expectedCandidate.candidateId}_unapproved_candidate_not_approved_by_anyone`, candidate.approved_by === null);
  }
}

function evaluateReadiness(input) {
  const candidates = input.artifacts || [];
  const guard = input.guard || {};
  const lamp = candidates.find((candidate) => candidate.candidate_id === expected.lamp.candidateId) || {};
  const bag = candidates.find((candidate) => candidate.candidate_id === expected.bag.candidateId) || {};
  const countsOk = input.generated_candidate_count === 2 && input.different_visual_task_count === 2 && candidates.length === 2;
  const lampMetadataOk =
    lamp.artifact_ref === expected.lamp.imagePath &&
    lamp.sha256 === expected.lamp.sha256 &&
    lamp.dimensions === dimensionsString(expected.lamp.width, expected.lamp.height) &&
    lamp.mime === expected.lamp.mimeType &&
    lamp.local_file_verified === true;
  const bagMetadataOk =
    bag.artifact_ref === expected.bag.imagePath &&
    bag.sha256 === expected.bag.sha256 &&
    bag.dimensions === dimensionsString(expected.bag.width, expected.bag.height) &&
    bag.mime === expected.bag.mimeType &&
    bag.local_file_verified === true;
  const lampHeldBack = lamp.review_status === "needs_revision" && lamp.accepted_candidate === false && lamp.human_approval_status === "not_approved";
  const bagApproved = bag.review_status === "accepted_candidate_with_human_approval" && bag.accepted_candidate === true && bag.human_approval_status === "approved" && bag.approved_by === "Jenn";
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
  const acceptedWriteStillBlocked = input.next_gate?.automatic_accepted_samples_write_allowed === false && input.next_gate?.accepted_samples_write_requires_separate_authorization === true;
  return {
    passed: countsOk && lampMetadataOk && bagMetadataOk && lampHeldBack && bagApproved && noWrites && noExternal && noRuntimeClaim && acceptedWriteStillBlocked,
    countsOk,
    lampMetadataOk,
    bagMetadataOk,
    lampHeldBack,
    bagApproved,
    noWrites,
    noExternal,
    noRuntimeClaim,
    acceptedWriteStillBlocked,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const schema = core.read(files.schema);
const fixtureWrapper = core.parseJson(files.fixture).codex_session_generated_candidate_readiness;
const lampImportRecord = core.parseJson(files.lampImportRecord);
const bagImportRecord = core.parseJson(files.bagImportRecord);
const currentSurfaces = [
  phaseRecord,
  schema,
  JSON.stringify(fixtureWrapper, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

for (const token of [
  "codex_session_generated_candidate_readiness:",
  "execution_mode: local_artifact_import_review_readiness_only",
  "generated_candidate_count: integer",
  "different_visual_task_count: integer",
  "review_status: needs_revision | accepted_candidate_with_human_approval",
  "accepted_candidate_requires_human_approval: true",
  "accepted_samples_registry_write_requires_separate_authorization: true",
  "accepted_samples_write_allowed_by_this_stage: false",
  "production_candidate_write_allowed_by_this_stage: false",
  "vcp_runtime_claim: fail",
]) {
  requireToken("schema", schema, token);
}

addResult("fixture_wrapper_present", Boolean(fixtureWrapper));
addResult("fixture_version_v1", fixtureWrapper.version === "v1");
addResult("fixture_phase_matches", fixtureWrapper.phase === "v14_161_codex_session_generated_candidate_readiness");
addResult("fixture_execution_mode_readiness_only", fixtureWrapper.execution_mode === "local_artifact_import_review_readiness_only");
addResult("fixture_generated_candidate_count_two", fixtureWrapper.generated_candidate_count === 2);
addResult("fixture_different_visual_task_count_two", fixtureWrapper.different_visual_task_count === 2);

const candidates = fixtureWrapper.artifacts || [];
validateCandidate(candidates.find((candidate) => candidate.candidate_id === expected.lamp.candidateId) || {}, expected.lamp, lampImportRecord);
validateCandidate(candidates.find((candidate) => candidate.candidate_id === expected.bag.candidateId) || {}, expected.bag, bagImportRecord);

const evaluation = evaluateReadiness(fixtureWrapper);
addResult("readiness_evaluation_passes", evaluation.passed, JSON.stringify(evaluation));

const missingArtifact = evaluateReadiness({
  ...fixtureWrapper,
  generated_candidate_count: 1,
  artifacts: candidates.slice(1),
});
const hashMismatch = { ...candidates[1], sha256: "0".repeat(64) };
const hashMismatchEval = evaluateReadiness({ ...fixtureWrapper, artifacts: [candidates[0], hashMismatch] });
const dimensionsMismatch = { ...candidates[1], dimensions: "1024x1024" };
const dimensionsMismatchEval = evaluateReadiness({ ...fixtureWrapper, artifacts: [candidates[0], dimensionsMismatch] });
const mimeMismatch = { ...candidates[1], mime: "image/jpeg" };
const mimeMismatchEval = evaluateReadiness({ ...fixtureWrapper, artifacts: [candidates[0], mimeMismatch] });
const approvalMissing = { ...candidates[1], human_approval_status: "not_approved", approved_by: null };
const approvalMissingEval = evaluateReadiness({ ...fixtureWrapper, artifacts: [candidates[0], approvalMissing] });
const unapprovedAccepted = { ...candidates[0], accepted_candidate: true };
const unapprovedAcceptedEval = evaluateReadiness({ ...fixtureWrapper, artifacts: [unapprovedAccepted, candidates[1]] });
const writeAttempt = evaluateReadiness({
  ...fixtureWrapper,
  guard: { ...fixtureWrapper.guard, accepted_samples_write_performed: true },
});
const runtimeClaim = evaluateReadiness({
  ...fixtureWrapper,
  guard: { ...fixtureWrapper.guard, artifact_recoverability_is_not_vcp_runtime_integration: false, vcp_runtime_integration_proven: true },
});

addResult("negative_case_missing_artifact_fails", missingArtifact.passed === false && missingArtifact.countsOk === false);
addResult("negative_case_hash_mismatch_fails", hashMismatchEval.passed === false && hashMismatchEval.bagMetadataOk === false);
addResult("negative_case_dimensions_mismatch_fails", dimensionsMismatchEval.passed === false && dimensionsMismatchEval.bagMetadataOk === false);
addResult("negative_case_mime_mismatch_fails", mimeMismatchEval.passed === false && mimeMismatchEval.bagMetadataOk === false);
addResult("negative_case_human_approval_missing_for_passed_candidate_fails", approvalMissingEval.passed === false && approvalMissingEval.bagApproved === false);
addResult("negative_case_unapproved_candidate_marked_accepted_fails", unapprovedAcceptedEval.passed === false && unapprovedAcceptedEval.lampHeldBack === false);
addResult("negative_case_accepted_samples_write_flag_blocks_readiness", writeAttempt.passed === false && writeAttempt.noWrites === false);
addResult("negative_case_vcp_runtime_claim_blocks_readiness", runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false);

for (const token of [
  "phase: v14_161_codex_session_generated_candidate_readiness",
  "generated_candidate_count: 2",
  "different_visual_task_count: 2",
  "candidate_1_review_status: needs_revision",
  "candidate_1_accepted_candidate: false",
  "candidate_2_review_status: accepted_candidate_with_human_approval",
  "candidate_2_approved_by: Jenn",
  "candidate_2_approval_statement: 第二张可以接受通过",
  "candidate_2_accepted_candidate: true",
  "accepted_samples_write_performed: false",
  "recommended_next: prepare_A5_or_A4_8_exact_authorization_for_accepted_samples_metadata_registration_of_candidate_2_only",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_161_codex_session_generated_candidate_readiness.js",
  "docs/v14_161_codex_session_generated_candidate_readiness.md",
  "schemas/codex_session_generated_candidate_readiness.schema.yaml",
  "tests/schema_examples/v14_161_codex_session_generated_candidate_readiness.example.json",
  "v14_161_codex_session_generated_candidate_readiness",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed_by_project:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed_by_project:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed_by_project:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed_by_project:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_161_codex_session_generated_candidate_readiness",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  generated_candidate_count: fixtureWrapper.generated_candidate_count,
  different_visual_task_count: fixtureWrapper.different_visual_task_count,
  lamp_candidate_status: expected.lamp.reviewStatus,
  lamp_candidate_accepted: false,
  bag_candidate_status: expected.bag.reviewStatus,
  bag_candidate_approved_by: "Jenn",
  bag_candidate_accepted: true,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed_by_project: false,
  plugin_call_performed_by_project: false,
  api_call_performed_by_project: false,
  mcp_runtime_performed_by_project: false,
  image_generation_performed_by_project_script: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  durable_archive_copy_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_artifact_fails: missingArtifact.passed === false && missingArtifact.countsOk === false,
  negative_case_hash_mismatch_fails: hashMismatchEval.passed === false && hashMismatchEval.bagMetadataOk === false,
  negative_case_dimensions_mismatch_fails: dimensionsMismatchEval.passed === false && dimensionsMismatchEval.bagMetadataOk === false,
  negative_case_mime_mismatch_fails: mimeMismatchEval.passed === false && mimeMismatchEval.bagMetadataOk === false,
  negative_case_human_approval_missing_for_passed_candidate_fails: approvalMissingEval.passed === false && approvalMissingEval.bagApproved === false,
  negative_case_unapproved_candidate_marked_accepted_fails: unapprovedAcceptedEval.passed === false && unapprovedAcceptedEval.lampHeldBack === false,
  negative_case_accepted_samples_write_flag_blocks_readiness: writeAttempt.passed === false && writeAttempt.noWrites === false,
  negative_case_vcp_runtime_claim_blocks_readiness: runtimeClaim.passed === false && runtimeClaim.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
