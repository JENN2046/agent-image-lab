#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const expectedSha = "9d23208d05427b02ffc177664c1918ed73bf57831a9694be16522fe9a8f3c910";

const files = {
  phaseRecord: "docs/v14_138_dashboard_alignment_from_real_artifact_evidence.md",
  dashboardFixture: "tests/schema_examples/artifact_recoverability_dashboard_evidence.example.json",
  staticMock: "review_console/static_prototype/mock_data.js",
  staticApp: "review_console/static_prototype/app.js",
  staticHtml: "review_console/static_prototype/index.html",
  staticReadme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  artifactValidator: "scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js",
  verificationRecord: "docs/v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate.md",
  projectMasterPlan: "PROJECT_MASTER_PLAN.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_138_dashboard_alignment_from_real_artifact_evidence.js",
};

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

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const phase = read(files.phaseRecord);
const fixture = JSON.parse(read(files.dashboardFixture)).artifact_recoverability_dashboard_evidence;
const staticMock = read(files.staticMock);
const staticApp = read(files.staticApp);
const staticHtml = read(files.staticHtml);
const staticReadme = read(files.staticReadme);
const fieldMapping = read(files.fieldMapping);
const verificationRecord = read(files.verificationRecord);
const projectMasterPlan = read(files.projectMasterPlan);
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

for (const token of [
  "phase: v14_138_dashboard_alignment_from_real_artifact_evidence",
  "source_phase: v14_137_project_master_plan_quarantine_status_demotion",
  "dashboard_alignment_from_real_artifact_evidence_completed: true",
  "artifact_recoverability_dashboard_evidence_created: true",
  "dashboard_evidence_source: v14_131_real_artifact_validator",
  "dashboard_progress_basis: real_artifact_recoverability_evidence",
  "project_master_plan_progress_allowed: false",
  "documentation_token_progress_allowed: false",
  "product_status_promotion_allowed_from_dashboard: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phase, token);
}

for (const [key, value] of Object.entries({
  evidence_source: "v14_131_real_artifact_validator",
  accepted_sample_id: sampleId,
  verified_sha256: expectedSha,
  verified_dimensions: "1254x1254",
  dashboard_progress_basis: "real_artifact_recoverability_evidence",
  project_master_plan_progress_allowed: false,
  documentation_token_progress_allowed: false,
  product_status_promotion_allowed_from_dashboard: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
})) {
  addResult(`fixture_${key}_matches`, fixture[key] === value, `${fixture[key]}`);
}

for (const token of [
  "artifact_recoverability_dashboard_evidence",
  "v14_131_real_artifact_validator",
  sampleId,
  expectedSha,
  "dashboard_progress_basis",
  "real_artifact_recoverability_evidence",
  "project_master_plan_progress_allowed: false",
  "documentation_token_progress_allowed: false",
  "product_status_promotion_allowed_from_dashboard: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("static_mock", staticMock, token.replace(/: /g, ": "));
}

for (const token of [
  "artifact_dashboard_evidence",
  "renderArtifactEvidenceDashboard",
  "#artifactEvidenceSummary",
  "artifact_recoverability_dashboard_evidence: state.artifact_dashboard_evidence",
]) {
  requireToken("static_app", staticApp, token);
}

for (const token of [
  "artifact-evidence-dashboard",
  "artifactEvidenceSummary",
  "真实样片证据",
]) {
  requireToken("static_html", staticHtml, token);
}

for (const token of [
  "artifact_recoverability_dashboard_evidence",
  "v14.131",
  "PROJECT_MASTER_PLAN.md",
  "token 数量",
  "VCP runtime integration",
]) {
  requireToken("static_docs", `${staticReadme}\n${fieldMapping}`, token);
}

for (const token of [
  "real_import_record_parsed: true",
  "real_artifact_file_exists: true",
  `verified_sha256: ${expectedSha}`,
  "negative_case_hash_mismatch_fails: true",
  "negative_case_missing_artifact_fails: true",
  "negative_case_missing_human_approval_fails: true",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("verification_record", verificationRecord, token);
}

for (const token of [
  "project_master_plan_status: historical_reference_only",
  "dashboard_progress_from_this_file_allowed: false",
  "old_ledger_must_not_raise_product_progress: true",
]) {
  requireToken("project_master_plan", projectMasterPlan, token);
}

for (const token of [
  "v14_138_dashboard_alignment_from_real_artifact_evidence",
  "dashboard_alignment_from_real_artifact_evidence_completed: true",
  "artifact_recoverability_dashboard_evidence_created: true",
  "dashboard_evidence_source: v14_131_real_artifact_validator",
  "dashboard_progress_basis: real_artifact_recoverability_evidence",
  "dashboard_uses_real_v14_131_recoverability_evidence: true",
  "dashboard_uses_project_master_plan_progress: false",
  "dashboard_uses_document_token_progress: false",
  "dashboard_promotes_product_status: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "file_write_performed: false",
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
requireToken("mvp_validator", mvpValidator, files.dashboardFixture);

forbidPattern("static_surface", `${staticMock}\n${staticApp}`, /fetch\s*\(/i);
forbidPattern("static_surface", `${staticMock}\n${staticApp}`, /XMLHttpRequest/i);
forbidPattern("static_surface", `${staticMock}\n${staticApp}`, /writeFile|createWriteStream|localStorage|sessionStorage/i);
forbidPattern("current_surfaces", currentSurfaces, /dashboard_uses_project_master_plan_progress:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /dashboard_uses_document_token_progress:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /dashboard_promotes_product_status:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /file_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_138_dashboard_alignment_from_real_artifact_evidence",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  dashboard_alignment_from_real_artifact_evidence_completed: true,
  artifact_recoverability_dashboard_evidence_created: true,
  dashboard_evidence_source: "v14_131_real_artifact_validator",
  dashboard_progress_basis: "real_artifact_recoverability_evidence",
  dashboard_uses_real_v14_131_recoverability_evidence: true,
  dashboard_uses_project_master_plan_progress: false,
  dashboard_uses_document_token_progress: false,
  dashboard_promotes_product_status: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  file_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
