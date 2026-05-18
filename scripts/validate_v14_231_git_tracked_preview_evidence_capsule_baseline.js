#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md",
  supersededDraft: "docs/v14_230_artifact_restoration_a5_authorization_package_draft.md",
  fixture: "tests/schema_examples/v14_231_git_tracked_preview_evidence_capsule_baseline.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  blockers: ".agent_board/BLOCKERS.md",
  riskRegister: ".agent_board/RISK_REGISTER.md",
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token), token);
}

function forbidToken(label, text, token) {
  addResult(`${label}_token_${token}_absent`, !text.includes(token), token);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evaluate(input) {
  const policy = input.artifact_portability_policy || {};
  const layout = input.capsule_layout || {};
  const manifest = input.manifest_contract || {};
  const preview = input.preview_contract || {};
  const semantics = input.validator_semantics || {};
  const guard = input.guard || {};

  const requiredFiles = Array.isArray(layout.required_files) ? layout.required_files : [];
  const forbiddenFields = Array.isArray(manifest.must_not_include) ? manifest.must_not_include : [];
  const guardValues = Object.values(guard);

  const identityOk =
    input.phase === "v14_231_git_tracked_preview_evidence_capsule_baseline" &&
    input.execution_mode === "policy_and_schema_baseline_only";
  const policyOk =
    policy.old_runs_as_long_term_evidence === false &&
    policy.base64_allowed === false &&
    policy.original_sha256_tracked === false &&
    policy.original_required_for_portable_validation === false &&
    policy.preview_required === true &&
    policy.preview_format === "webp" &&
    policy.preview_long_edge === 512 &&
    policy.preview_git_tracked === true &&
    policy.preview_sha256_in_manifest === true;
  const layoutOk =
    layout.root_pattern === "asset_archive/accepted_samples/<sample_id>/" &&
    requiredFiles.includes("manifest.json") &&
    requiredFiles.includes("preview.webp") &&
    requiredFiles.includes("import_record.json") &&
    requiredFiles.includes("review_record.json") &&
    requiredFiles.includes("approval_record.json");
  const manifestOk =
    forbiddenFields.includes("artifact.original.sha256") &&
    forbiddenFields.includes("preview_base64") &&
    forbiddenFields.includes("thumbnail_base64") &&
    forbiddenFields.includes("original_base64");
  const previewOk =
    preview.format === "webp" &&
    preview.long_edge === 512 &&
    preview.resize_policy === "preserve_aspect_ratio_downscale_to_long_edge_512" &&
    preview.sha256_in_manifest === true;
  const semanticsOk =
    semantics.portable_evidence_verified === true &&
    semantics.full_original_recoverability_required === false &&
    semantics.legacy_runs_missing_result === "evidence_loss_recorded_do_not_claim_old_full_recoverability";
  const guardOk = guardValues.length > 0 && guardValues.every((value) => value === false);

  return {
    passed: identityOk && policyOk && layoutOk && manifestOk && previewOk && semanticsOk && guardOk,
    identityOk,
    policyOk,
    layoutOk,
    manifestOk,
    previewOk,
    semanticsOk,
    guardOk,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).git_tracked_preview_evidence_capsule_baseline;
const phaseRecord = core.read(files.phaseRecord);
const supersededDraft = core.read(files.supersededDraft);
const currentSurfaces = [
  phaseRecord,
  supersededDraft,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.blockers),
  core.read(files.riskRegister),
  core.read(files.mvpValidator),
].join("\n");
const phaseSpecificSurfaces = [
  phaseRecord,
  supersededDraft,
  JSON.stringify(fixture, null, 2),
].join("\n");

const baseEval = evaluate(fixture);
addResult("git_tracked_preview_evidence_capsule_baseline_evaluation_passes", baseEval.passed, JSON.stringify(baseEval));

const base64Allowed = clone(fixture);
base64Allowed.artifact_portability_policy.base64_allowed = true;
const originalShaTracked = clone(fixture);
originalShaTracked.artifact_portability_policy.original_sha256_tracked = true;
const originalRequired = clone(fixture);
originalRequired.artifact_portability_policy.original_required_for_portable_validation = true;
const wrongPreviewEdge = clone(fixture);
wrongPreviewEdge.artifact_portability_policy.preview_long_edge = 1024;
wrongPreviewEdge.preview_contract.long_edge = 1024;
const missingPreview = clone(fixture);
missingPreview.capsule_layout.required_files = missingPreview.capsule_layout.required_files.filter((item) => item !== "preview.webp");
const a5Execution = clone(fixture);
a5Execution.guard.A5_execution = true;

const base64Eval = evaluate(base64Allowed);
const originalShaEval = evaluate(originalShaTracked);
const originalRequiredEval = evaluate(originalRequired);
const wrongPreviewEdgeEval = evaluate(wrongPreviewEdge);
const missingPreviewEval = evaluate(missingPreview);
const a5ExecutionEval = evaluate(a5Execution);

addResult("negative_case_base64_allowed_fails", base64Eval.passed === false && base64Eval.policyOk === false);
addResult("negative_case_original_sha256_tracked_fails", originalShaEval.passed === false && originalShaEval.policyOk === false);
addResult("negative_case_original_required_fails", originalRequiredEval.passed === false && originalRequiredEval.policyOk === false);
addResult("negative_case_preview_long_edge_drift_fails", wrongPreviewEdgeEval.passed === false && wrongPreviewEdgeEval.policyOk === false && wrongPreviewEdgeEval.previewOk === false);
addResult("negative_case_missing_preview_webp_fails", missingPreviewEval.passed === false && missingPreviewEval.layoutOk === false);
addResult("negative_case_A5_execution_flag_fails", a5ExecutionEval.passed === false && a5ExecutionEval.guardOk === false);

for (const token of [
  "phase: v14_231_git_tracked_preview_evidence_capsule_baseline",
  "old_runs_as_long_term_evidence: false",
  "base64_allowed: false",
  "original_sha256_tracked: false",
  "original_sha256_in_manifest: false",
  "preview_long_edge: 512",
  "preview_git_tracked: true",
  "preview_sha256_in_manifest: true",
  "asset_archive/accepted_samples/<sample_id>/",
  "preview.webp",
  "portable_evidence_verified",
  "full_original_recoverability_required: false",
  "git_portable_preview_evidence",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "superseded_by_v14_231_git_tracked_preview_evidence_capsule_baseline",
  "old artifact restoration is no longer the current route",
  "original_sha256_tracked: false",
  "base64_allowed: false",
]) {
  requireToken("superseded_draft", supersededDraft, token);
}

for (const token of [
  "scripts/validate_v14_231_git_tracked_preview_evidence_capsule_baseline.js",
  "tests/schema_examples/v14_231_git_tracked_preview_evidence_capsule_baseline.example.json",
  "docs/v14_231_git_tracked_preview_evidence_capsule_baseline.md",
  "v14_231_git_tracked_preview_evidence_capsule_baseline",
  "new durable archive baseline",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidToken("phase_specific_surfaces", phaseSpecificSurfaces, "base64_allowed: true");
forbidToken("phase_specific_surfaces", phaseSpecificSurfaces, "original_sha256_tracked: true");
forbidToken("phase_specific_surfaces", phaseSpecificSurfaces, "original_required_for_portable_validation: true");
forbidToken("phase_specific_surfaces", phaseSpecificSurfaces, "preview_long_edge: 1024");
forbidToken("phase_specific_surfaces", phaseSpecificSurfaces, "A5_execution: true");
forbidToken("phase_specific_surfaces", phaseSpecificSurfaces, "runs_write: true");
forbidToken("phase_specific_surfaces", phaseSpecificSurfaces, "image_generation: true");

const policy = fixture.artifact_portability_policy;
const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_231_git_tracked_preview_evidence_capsule_baseline",
  version: "v1",
  phase: fixture.phase,
  passed,
  check_count: results.length,
  failed_count: errors.length,
  old_runs_as_long_term_evidence: policy.old_runs_as_long_term_evidence,
  base64_allowed: policy.base64_allowed,
  original_sha256_tracked: policy.original_sha256_tracked,
  original_required_for_portable_validation: policy.original_required_for_portable_validation,
  preview_required: policy.preview_required,
  preview_format: policy.preview_format,
  preview_long_edge: policy.preview_long_edge,
  preview_git_tracked: policy.preview_git_tracked,
  preview_sha256_in_manifest: policy.preview_sha256_in_manifest,
  portable_evidence_verified: fixture.validator_semantics.portable_evidence_verified,
  full_original_recoverability_required: fixture.validator_semantics.full_original_recoverability_required,
  A5_execution: fixture.guard.A5_execution,
  provider_contact: fixture.guard.provider_contact,
  plugin_call: fixture.guard.plugin_call,
  api_call: fixture.guard.api_call,
  image_generation: fixture.guard.image_generation,
  runs_write: fixture.guard.runs_write,
  daily_note_write: fixture.guard.DailyNote_write,
  vcp_memory_write: fixture.guard.VCP_memory_write,
  runtime_execution: fixture.guard.runtime_execution,
  real_manifest_read: fixture.guard.real_manifest_read,
  real_vcpchat_read: fixture.guard.real_vcpchat_read,
  real_vcptoolbox_read: fixture.guard.real_vcptoolbox_read,
  push_tag_release_deploy: fixture.guard.push_tag_release_deploy,
  negative_case_base64_allowed_fails: base64Eval.passed === false && base64Eval.policyOk === false,
  negative_case_original_sha256_tracked_fails: originalShaEval.passed === false && originalShaEval.policyOk === false,
  negative_case_original_required_fails: originalRequiredEval.passed === false && originalRequiredEval.policyOk === false,
  negative_case_preview_long_edge_drift_fails:
    wrongPreviewEdgeEval.passed === false && wrongPreviewEdgeEval.policyOk === false && wrongPreviewEdgeEval.previewOk === false,
  negative_case_missing_preview_webp_fails: missingPreviewEval.passed === false && missingPreviewEval.layoutOk === false,
  negative_case_A5_execution_flag_fails: a5ExecutionEval.passed === false && a5ExecutionEval.guardOk === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
