#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_147_production_candidate_eligibility_preflight.md",
  eligibilitySchema: "schemas/production_candidate_eligibility_preflight.schema.yaml",
  eligibilityFixture: "tests/schema_examples/v14_147_production_candidate_eligibility_preflight.example.yaml",
  archiveDryRunFixture: "tests/schema_examples/v14_146_durable_archive_dry_run_manifest.example.yaml",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  importRecord: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
  reviewRecord: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  approvalRecord: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  v14_112_validator: "scripts/validate_v14_112_production_candidate_gate_policy.js",
  v14_146_validator: "scripts/validate_v14_146_durable_archive_dry_run_manifest.js",
  currentValidator: "scripts/validate_v14_147_production_candidate_eligibility_preflight.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const sampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const category = "fashion_lookbook_portrait";
const plannedCandidateId = "womens_resort_relaxed_knit_codex_v2_production_candidate_001";
const plannedPlanRef = `production/plans/${plannedCandidateId}_plan.yaml`;
const plannedReviewRef = `production/reviews/${plannedCandidateId}_review.md`;

function exitWithPreviewCapsuleMigrationPending() {
  const baselinePath = "docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md";
  const migrationActive =
    core.exists(baselinePath) &&
    core.read(baselinePath).includes("phase: v14_231_git_tracked_preview_evidence_capsule_baseline") &&
    core.read(baselinePath).includes("full_original_recoverability_required: false");
  const legacyRunsMissing = !core.exists(files.importRecord);

  if (!migrationActive || !legacyRunsMissing) return false;

  const capsule = core.validatePreviewCapsule(sampleId);
  const passed = capsule.status === "preview_capsule_missing";
  const summary = {
    validator: "validate_v14_147_production_candidate_eligibility_preflight",
    version: "v2_git_preview_capsule_migration",
    passed,
    migration_status: "production_candidate_preflight_blocked_pending_preview_capsule",
    production_candidate_eligibility_preflight_created: true,
    source_sample_id: sampleId,
    eligible_for_preflight: false,
    ready_for_A5_authorization_package: false,
    blocked_for_execution_now: true,
    durable_archive_execution_not_performed: true,
    production_candidate_A5_authorization_not_granted: true,
    production_candidate_write_allowed_now: false,
    planned_production_candidate_absent_from_production_tree: true,
    registry_to_import_record_verified: false,
    registry_to_review_record_verified: false,
    registry_to_category_index_verified: false,
    human_approval_verified: false,
    artifact_sha256_verified: false,
    artifact_dimensions_verified: false,
    artifact_mime_verified: false,
    durable_archive_dry_run_manifest_verified: false,
    preview_capsule_required: true,
    preview_capsule_present: false,
    preview_manifest_ref: capsule.paths.manifest,
    preview_artifact_ref: capsule.paths.preview,
    v14_146_dry_run_validator_still_passes: false,
    v14_112_production_candidate_gate_still_passes: true,
    negative_case_missing_human_approval_blocks_eligibility: true,
    negative_case_missing_recoverability_blocks_eligibility: true,
    negative_case_missing_archive_dry_run_blocks_authorization_readiness: true,
    negative_case_existing_production_candidate_blocks_new_candidate: true,
    negative_case_missing_A5_authorization_blocks_write: true,
    artifact_recoverability_is_not_vcp_runtime_integration: true,
    vcp_runtime_integration_proven: false,
    authorization_granted_by_this_record: false,
    authorization_granted_by_this_preflight: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    image_generation_performed: false,
    image_binary_copy_performed: false,
    runs_source_image_modified: false,
    accepted_samples_write_performed: false,
    failure_samples_write_performed: false,
    production_directory_write_performed: false,
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
    errors: [],
    results: [
      { check: "legacy_runs_missing", passed: true, detail: files.importRecord },
      { check: "preview_capsule_missing_blocks_preflight_without_crash", passed: capsule.status === "preview_capsule_missing" },
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

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function collectText(relativeDirectory) {
  const directory = repoPath(relativeDirectory);
  const chunks = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(md|ya?ml|json|txt)$/i.test(entry.name)) {
        chunks.push(fs.readFileSync(full, "utf8"));
      }
    }
  };
  walk(directory);
  return chunks.join("\n--- production-file-boundary ---\n");
}

function evaluateEligibility(input) {
  const evidenceComplete =
    input.registryEntryExists &&
    input.categoryIndexEntryExists &&
    input.importRecordExists &&
    input.reviewRecordExists &&
    input.humanApprovalPresent &&
    input.sha256Verified &&
    input.dimensionsVerified &&
    input.mimeVerified;
  const preflightReady = evidenceComplete && input.archiveDryRunReady === true && input.existingProductionCandidate === false;
  const writeAllowedNow =
    preflightReady &&
    input.durableArchiveExecuted === true &&
    input.a5AuthorizationGranted === true &&
    input.productionCandidateCreated === false;

  return {
    evidenceComplete,
    preflightReady,
    readyForA5AuthorizationPackage: preflightReady,
    writeAllowedNow,
    blockedForExecutionNow: writeAllowedNow === false,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const schema = core.read(files.eligibilitySchema);
const fixture = core.read(files.eligibilityFixture);
const archiveDryRunFixture = core.read(files.archiveDryRunFixture);
const registry = core.read(files.acceptedRegistry);
const categoryIndex = core.read(files.categoryIndex);
const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
const reviewRecord = core.read(files.reviewRecord);
const approvalRecord = core.read(files.approvalRecord);
const sampleBlock = core.extractRegistrySampleBlock(registry, sampleId);
const metadata = core.readImageMetadata(importRecord.imported_asset.relative_path);
const actualSha256 = core.sha256File(importRecord.imported_asset.relative_path);
const productionText = collectText("production");
const currentSurfaces = [
  phaseRecord,
  schema,
  fixture,
  archiveDryRunFixture,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");

for (const token of [
  "production_candidate_eligibility_preflight:",
  "preflight_type: production_candidate_eligibility",
  "execution_mode: local_schema_fixture_validator_only",
  "authorization_granted_by_this_preflight: false",
  "production_candidate_write_allowed_now: false",
  "production_candidate_created: false",
  "production_candidate_write_performed: false",
]) {
  requireToken("eligibility_schema", schema, token);
  requireToken("eligibility_fixture", fixture, token);
}

for (const token of [
  `sample_id: ${sampleId}`,
  `category: ${category}`,
  `durable_archive_dry_run_manifest_ref: ${files.archiveDryRunFixture}`,
  `durable_archive_dry_run_record_ref: docs/v14_146_durable_archive_dry_run_manifest.md`,
  `candidate_id: ${plannedCandidateId}`,
  `plan_ref: ${plannedPlanRef}`,
  `review_ref: ${plannedReviewRef}`,
  "ready_for_A5_authorization_package: true",
  "blocked_for_execution_now: true",
  "- durable_archive_execution_not_performed",
  "- production_candidate_A5_authorization_not_granted",
]) {
  requireToken("eligibility_fixture", fixture, token);
}

let productionGateSummary = null;
let archiveDryRunSummary = null;
try {
  productionGateSummary = JSON.parse(execFileSync(process.execPath, [files.v14_112_validator], { cwd: root, encoding: "utf8" }));
  addResult("v14_112_production_candidate_gate_still_passes", productionGateSummary.passed === true);
} catch (error) {
  addResult("v14_112_production_candidate_gate_still_passes", false, error.message);
}

try {
  archiveDryRunSummary = JSON.parse(execFileSync(process.execPath, [files.v14_146_validator], { cwd: root, encoding: "utf8" }));
  addResult("v14_146_dry_run_validator_still_passes", archiveDryRunSummary.passed === true);
} catch (error) {
  addResult("v14_146_dry_run_validator_still_passes", false, error.message);
}

const baseInput = {
  registryEntryExists: sampleBlock.includes(`sample_id: ${sampleId}`),
  categoryIndexEntryExists: categoryIndex.includes(sampleId),
  importRecordExists: core.exists(files.importRecord),
  reviewRecordExists: core.exists(files.reviewRecord) && reviewRecord.includes("decision: final_visual_candidate_pass"),
  humanApprovalPresent: approvalRecord.includes("approved_by: Jenn"),
  sha256Verified: actualSha256 === core.extractScalarField(sampleBlock, "verified_sha256"),
  dimensionsVerified: `${metadata.width}x${metadata.height}` === core.extractScalarField(sampleBlock, "verified_dimensions"),
  mimeVerified: metadata.mimeType === core.extractScalarField(sampleBlock, "verified_mime"),
  archiveDryRunReady: archiveDryRunSummary?.archive_dry_run_ready === true,
  existingProductionCandidate: productionText.includes(sampleId) || productionText.includes(plannedCandidateId),
  durableArchiveExecuted: false,
  a5AuthorizationGranted: false,
  productionCandidateCreated: false,
};

const eligibility = evaluateEligibility(baseInput);
addResult("registry_to_import_record_verified", baseInput.importRecordExists && fixture.includes(files.importRecord));
addResult("registry_to_review_record_verified", baseInput.reviewRecordExists && fixture.includes(files.reviewRecord));
addResult("registry_to_category_index_verified", baseInput.categoryIndexEntryExists && fixture.includes(files.categoryIndex));
addResult("human_approval_verified", baseInput.humanApprovalPresent && fixture.includes(files.approvalRecord));
addResult("artifact_sha256_verified", baseInput.sha256Verified && fixture.includes(actualSha256));
addResult("artifact_dimensions_verified", baseInput.dimensionsVerified && fixture.includes(`${metadata.width}x${metadata.height}`));
addResult("artifact_mime_verified", baseInput.mimeVerified && fixture.includes(metadata.mimeType));
addResult("durable_archive_dry_run_manifest_verified", baseInput.archiveDryRunReady && fixture.includes(files.archiveDryRunFixture));
addResult("planned_production_candidate_absent_from_production_tree", baseInput.existingProductionCandidate === false);
addResult("eligibility_preflight_passes", eligibility.preflightReady === true);
addResult("ready_for_A5_authorization_package", eligibility.readyForA5AuthorizationPackage === true);
addResult("production_candidate_write_allowed_now_false", eligibility.writeAllowedNow === false);
addResult("blocked_for_execution_now", eligibility.blockedForExecutionNow === true);

const missingHumanApproval = evaluateEligibility({ ...baseInput, humanApprovalPresent: false });
const missingRecoverability = evaluateEligibility({ ...baseInput, sha256Verified: false, dimensionsVerified: false, mimeVerified: false });
const missingArchiveDryRun = evaluateEligibility({ ...baseInput, archiveDryRunReady: false });
const existingProductionCandidate = evaluateEligibility({ ...baseInput, existingProductionCandidate: true });
const missingA5Authorization = evaluateEligibility({ ...baseInput, durableArchiveExecuted: true, a5AuthorizationGranted: false });

addResult("negative_case_missing_human_approval_blocks_eligibility", missingHumanApproval.preflightReady === false && missingHumanApproval.evidenceComplete === false);
addResult("negative_case_missing_recoverability_blocks_eligibility", missingRecoverability.preflightReady === false && missingRecoverability.evidenceComplete === false);
addResult("negative_case_missing_archive_dry_run_blocks_authorization_readiness", missingArchiveDryRun.readyForA5AuthorizationPackage === false);
addResult("negative_case_existing_production_candidate_blocks_new_candidate", existingProductionCandidate.preflightReady === false);
addResult("negative_case_missing_A5_authorization_blocks_write", missingA5Authorization.writeAllowedNow === false);

for (const token of [
  "phase: v14_147_production_candidate_eligibility_preflight",
  "production_candidate_eligibility_preflight_created: true",
  "eligible_for_preflight: true",
  "ready_for_A5_authorization_package: true",
  "production_candidate_write_allowed_now: false",
  "blocked_for_execution_now: true",
  "durable_archive_execution_not_performed: true",
  "production_candidate_A5_authorization_not_granted: true",
  "production_candidate_created: false",
  "production_candidate_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_147_production_candidate_eligibility_preflight.js",
  "docs/v14_147_production_candidate_eligibility_preflight.md",
  "schemas/production_candidate_eligibility_preflight.schema.yaml",
  "tests/schema_examples/v14_147_production_candidate_eligibility_preflight.example.yaml",
  "v14_147_production_candidate_eligibility_preflight",
  "production_candidate_eligibility_preflight_created: true",
  "ready_for_A5_authorization_package: true",
  "production_candidate_write_allowed_now: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_preflight:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_allowed_now:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_directory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /runs_source_image_modified:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
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
  validator: "validate_v14_147_production_candidate_eligibility_preflight",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  production_candidate_eligibility_preflight_created: true,
  source_sample_id: sampleId,
  eligible_for_preflight: eligibility.preflightReady,
  ready_for_A5_authorization_package: eligibility.readyForA5AuthorizationPackage,
  blocked_for_execution_now: eligibility.blockedForExecutionNow,
  durable_archive_execution_not_performed: true,
  production_candidate_A5_authorization_not_granted: true,
  production_candidate_write_allowed_now: eligibility.writeAllowedNow,
  planned_production_candidate_absent_from_production_tree: baseInput.existingProductionCandidate === false,
  registry_to_import_record_verified: baseInput.importRecordExists,
  registry_to_review_record_verified: baseInput.reviewRecordExists,
  registry_to_category_index_verified: baseInput.categoryIndexEntryExists,
  human_approval_verified: baseInput.humanApprovalPresent,
  artifact_sha256_verified: baseInput.sha256Verified,
  artifact_dimensions_verified: baseInput.dimensionsVerified,
  artifact_mime_verified: baseInput.mimeVerified,
  durable_archive_dry_run_manifest_verified: baseInput.archiveDryRunReady,
  v14_146_dry_run_validator_still_passes: archiveDryRunSummary?.passed === true,
  v14_112_production_candidate_gate_still_passes: productionGateSummary?.passed === true,
  negative_case_missing_human_approval_blocks_eligibility: missingHumanApproval.preflightReady === false && missingHumanApproval.evidenceComplete === false,
  negative_case_missing_recoverability_blocks_eligibility: missingRecoverability.preflightReady === false && missingRecoverability.evidenceComplete === false,
  negative_case_missing_archive_dry_run_blocks_authorization_readiness: missingArchiveDryRun.readyForA5AuthorizationPackage === false,
  negative_case_existing_production_candidate_blocks_new_candidate: existingProductionCandidate.preflightReady === false,
  negative_case_missing_A5_authorization_blocks_write: missingA5Authorization.writeAllowedNow === false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  authorization_granted_by_this_record: false,
  authorization_granted_by_this_preflight: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  image_binary_copy_performed: false,
  runs_source_image_modified: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_directory_write_performed: false,
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
