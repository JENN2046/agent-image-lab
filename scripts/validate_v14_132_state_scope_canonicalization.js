#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/v14_132_state_scope_canonicalization.md",
  sourcePhase: "docs/v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_132_state_scope_canonicalization.js",
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
const sourcePhase = read(files.sourcePhase);
const runState = read(files.runState);
const taskQueue = read(files.taskQueue);
const mvpValidator = read(files.mvpValidator);
const currentSurfaces = [
  phase,
  runState,
  taskQueue,
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  mvpValidator,
].join("\n");

for (const token of [
  "phase: v14_132_state_scope_canonicalization",
  "source_phase: v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate",
  "state_scope_canonicalization_created: true",
  "active_scope_defined: true",
  "artifact_scope_defined: true",
  "authorization_scope_defined: true",
  "side_effect_scope_defined: true",
  "history_scope_defined: true",
  "phase_current_project_history_separated: true",
  "recommended_next_source_phase_required: true",
  "supersedes_recommendation_from_recorded: true",
  "progress_percentage_requires_scope_split: true",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "recoverability_status: workspace_local_verified",
  "portable_after_clone: false",
  "vcp_runtime_integration_proven: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("source_phase", sourcePhase, token);
}

for (const label of ["run_state", "task_queue"]) {
  const text = label === "run_state" ? runState : taskQueue;
  for (const token of [
    "active_scope:",
    "artifact_scope:",
    "artifact_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001",
    "artifact_recoverability_status: workspace_local_verified",
    "artifact_locator_scope: project_relative_runs",
    "artifact_portable_after_clone: false",
    "artifact_vcp_runtime_integration_proven: false",
    "authorization_scope:",
    "authorization_failure_samples_write_allowed: false",
    "authorization_production_candidate_allowed: false",
    "authorization_DailyNote_write_allowed: false",
    "authorization_VCP_memory_write_allowed: false",
    "authorization_real_manifest_read_allowed: false",
    "authorization_real_vcpchat_read_allowed: false",
    "authorization_real_vcptoolbox_read_allowed: false",
    "authorization_push_tag_release_deploy_allowed: false",
    "side_effect_scope:",
    "side_effect_current_phase_registry_metadata_write_performed: false",
    "side_effect_current_phase_image_binary_copy_performed: false",
    "side_effect_current_phase_source_image_modified: false",
    "side_effect_current_phase_provider_contact_performed: false",
    "side_effect_current_phase_vcp_runtime_integration_performed: false",
    "history_scope:",
    "history_v14_107_accepted_sample_registry_write_completed: true",
    "history_v14_131_artifact_recoverability_completed: true",
    "history_PROJECT_MASTER_PLAN_default_authority: false",
  ]) {
    requireToken(label, text, token);
  }
}

for (const token of [
  "v14_132_state_scope_canonicalization",
  "state_scope_canonicalization_created: true",
  "active_scope_defined: true",
  "artifact_scope_defined: true",
  "authorization_scope_defined: true",
  "side_effect_scope_defined: true",
  "history_scope_defined: true",
  "phase_current_project_history_separated: true",
  "progress_percentage_requires_scope_split: true",
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

forbidPattern("current_surfaces", currentSurfaces, /authorization_failure_samples_write_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_production_candidate_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_DailyNote_write_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_VCP_memory_write_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_real_manifest_read_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_real_vcpchat_read_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_real_vcptoolbox_read_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_push_tag_release_deploy_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /side_effect_current_phase_provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /side_effect_current_phase_vcp_runtime_integration_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /artifact_vcp_runtime_integration_proven:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /artifact_portable_after_clone:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_132_state_scope_canonicalization",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  state_scope_canonicalization_created: true,
  active_scope_defined: true,
  artifact_scope_defined: true,
  authorization_scope_defined: true,
  side_effect_scope_defined: true,
  history_scope_defined: true,
  phase_current_project_history_separated: true,
  recommended_next_source_phase_required: true,
  supersedes_recommendation_from_recorded: true,
  progress_percentage_requires_scope_split: true,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
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
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
