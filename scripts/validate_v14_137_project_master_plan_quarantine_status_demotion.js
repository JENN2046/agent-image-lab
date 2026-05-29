#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/v14_137_project_master_plan_quarantine_status_demotion.md",
  projectMasterPlan: "PROJECT_MASTER_PLAN.md",
  legacyQuarantine: "docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_137_project_master_plan_quarantine_status_demotion.js",
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

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const phase = read(files.phaseRecord);
const projectMasterPlan = read(files.projectMasterPlan);
const legacyQuarantine = read(files.legacyQuarantine);
const mvpValidator = read(files.mvpValidator);
const currentSurfaces = [
  phase,
  projectMasterPlan,
  legacyQuarantine,
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  mvpValidator,
].join("\n");

for (const token of [
  "phase: v14_137_project_master_plan_quarantine_status_demotion",
  "source_phase: v14_136_accepted_samples_recoverability_metadata_patch",
  "project_master_plan_quarantined: true",
  "project_master_plan_status_demoted: true",
  "project_master_plan_default_authority: false",
  "legacy_ledger_progress_promotion_blocked: true",
  "current_route_remains_artifact_recoverability_chain: true",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "project_master_plan_status: historical_reference_only",
  "default_routing_authority: false",
  "current_goal_routing_source: .agent_board/RUN_STATE.md",
  "current_artifact_recoverability_chain: v14.131-v14.136",
  "old_ledger_must_not_raise_product_progress: true",
  "dashboard_progress_from_this_file_allowed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
  "## Historical Baseline Ledger",
]) {
  requireToken("project_master_plan", projectMasterPlan, token);
}

for (const token of [
  "PROJECT_MASTER_PLAN_default_authority: false",
  "historical_docs_deleted: false",
  "historical_docs_moved: false",
  "historical_docs_rewritten: false",
]) {
  requireToken("legacy_quarantine", legacyQuarantine, token);
}

for (const token of [
  "v14_137_project_master_plan_quarantine_status_demotion",
  "project_master_plan_quarantined: true",
  "project_master_plan_status_demoted: true",
  "project_master_plan_status: historical_reference_only",
  "project_master_plan_default_authority: false",
  "default_routing_authority: false",
  "current_goal_routing_source: .agent_board/RUN_STATE.md",
  "current_artifact_recoverability_chain: v14.131-v14.136",
  "legacy_ledger_progress_promotion_blocked: true",
  "old_ledger_must_not_raise_product_progress: true",
  "dashboard_progress_from_project_master_plan_allowed: false",
  "current_route_remains_artifact_recoverability_chain: true",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
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

forbidPattern("current_surfaces", currentSurfaces, /project_master_plan_default_authority:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /default_routing_authority:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /dashboard_progress_from_project_master_plan_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /old_ledger_must_not_raise_product_progress:\s+false/i);
forbidPattern("current_surfaces", currentSurfaces, /artifact_recoverability_is_not_vcp_runtime_integration:\s+false/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_137_project_master_plan_quarantine_status_demotion",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  project_master_plan_quarantined: true,
  project_master_plan_status_demoted: true,
  project_master_plan_status: "historical_reference_only",
  project_master_plan_default_authority: false,
  default_routing_authority: false,
  current_goal_routing_source: files.runState,
  current_artifact_recoverability_chain: "v14.131-v14.136",
  legacy_ledger_progress_promotion_blocked: true,
  dashboard_progress_from_project_master_plan_allowed: false,
  current_route_remains_artifact_recoverability_chain: true,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
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
