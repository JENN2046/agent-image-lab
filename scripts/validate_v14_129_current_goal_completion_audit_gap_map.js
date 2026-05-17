#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/v14_129_current_goal_completion_audit_gap_map.md",
  goalGate: "docs/v14_108_three_month_visual_control_layer_goal_alignment_gate.md",
  promptAudit: "docs/v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.md",
  acceptedFailureGap: "docs/v14_126_accepted_failure_metadata_cross_index_gap_review.md",
  productionExclusionGap: "docs/v14_127_production_exclusion_draft_current_goal_gap_review.md",
  failureSamplesTemplate: "docs/v14_128_failure_samples_authorization_template_current_goal_gap_review.md",
  contextGuide: "docs/CONTEXT_LOAD_GUIDE.md",
  historicalIndex: "docs/HISTORICAL_DOCS_COMPACTION_INDEX.md",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  failureRegistry: "failure_samples/failure_registry.yaml",
  failureTaxonomy: "failure_samples/failure_taxonomy.yaml",
  reviewConsoleFieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  productionExclusionRegister: "tests/schema_examples/review_report_production_exclusion_register.example.json",
  memoryDeltaDraft: "tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  promptAuditValidator: "scripts/validate_v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.js",
  failureTemplateValidator: "scripts/validate_v14_128_failure_samples_authorization_template_current_goal_gap_review.js",
  currentValidator: "scripts/validate_v14_129_current_goal_completion_audit_gap_map.js",
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

function runJsonValidator(relativePath, label) {
  const result = childProcess.spawnSync(process.execPath, [repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${label}_exec_passed`, result.status === 0, result.stderr || result.stdout);
  if (result.status !== 0) return null;
  try {
    const parsed = JSON.parse(result.stdout);
    addResult(`${label}_json_parseable`, true);
    addResult(`${label}_reported_passed`, parsed.passed === true);
    return parsed;
  } catch (error) {
    addResult(`${label}_json_parseable`, false, error.message);
    return null;
  }
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const phase = read(files.phaseRecord);
const promptAudit = read(files.promptAudit);
const currentSurfaces = [
  phase,
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  read(files.mvpValidator),
].join("\n");

for (const token of [
  "objective_restated: true",
  "goal_complete_now: false",
  "update_goal_allowed: false",
  "checklist:",
  "codex_session_generation_default:",
  "accepted_samples_metadata:",
  "pvos_evidence_blocker_reviewreport_pipeline:",
  "memory_delta_draft:",
  "production_exclusion_draft:",
  "review_console_handoff:",
  "failure_samples_metadata:",
  "taxonomy_and_scorecards:",
  "validators:",
  "dry_run_vcp_adapter_contract:",
  "plugin_dispatch_preflight:",
  "manifest_read_authorization_package:",
  "DailyNote_VCP_memory_authorization_chain:",
  "production_candidate_gate:",
  "rollback_audit_validation_package:",
  "context_compaction:",
  "missing_or_incomplete_items_present: true",
  "authorization_blocked_items_count: 5",
  "completion_audit_performed: true",
  "proxy_signal_only: false",
  "update_goal_called: false",
  "next_safe_local_route: review_console_current_goal_gap_dashboard_alignment",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "prompt_to_artifact_completion_audit_aligned: true",
  "goal_to_artifact_trace_complete: true",
  "codex_session_generation_route_preserved: true",
  "rollback_audit_validation_chain_verified: true",
]) {
  requireToken("prior_prompt_audit", promptAudit, token);
}

for (const [label, relativePath] of Object.entries({
  goalGate: files.goalGate,
  acceptedFailureGap: files.acceptedFailureGap,
  productionExclusionGap: files.productionExclusionGap,
  failureSamplesTemplate: files.failureSamplesTemplate,
  contextGuide: files.contextGuide,
  acceptedRegistry: files.acceptedRegistry,
  failureRegistry: files.failureRegistry,
  reviewConsoleFieldMapping: files.reviewConsoleFieldMapping,
  productionExclusionRegister: files.productionExclusionRegister,
  memoryDeltaDraft: files.memoryDeltaDraft,
})) {
  addResult(`${label}_nonempty`, read(relativePath).trim().length > 0, relativePath);
}

const promptAuditSummary = runJsonValidator(files.promptAuditValidator, "prompt_audit_validator");
const failureTemplateSummary = runJsonValidator(files.failureTemplateValidator, "failure_template_validator");

addResult("prompt_audit_summary_not_complete_proxy_only", promptAuditSummary?.prompt_to_artifact_completion_audit_not_proxy_only === true);
addResult("failure_template_summary_inactive", failureTemplateSummary?.failure_samples_authorization_template_active === false);
addResult("failure_template_summary_write_blocked", failureTemplateSummary?.actual_failure_samples_write_blocked_until_separate_exact_a5_authorization === true);

for (const token of [
  "v14_129_current_goal_completion_audit_gap_map",
  "current_goal_completion_audit_gap_map_created: true",
  "goal_complete_now: false",
  "missing_or_incomplete_items_present: true",
  "authorization_blocked_items_count: 5",
  "update_goal_called: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "accepted_samples_write_performed: false",
  "failure_samples_write_performed: false",
  "production_candidate_created: false",
  "push_tag_release_deploy_performed: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /goal_complete_now:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /update_goal_called:\s+true/i);
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

requireToken("mvp_validator", read(files.mvpValidator), files.currentValidator);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_129_current_goal_completion_audit_gap_map",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  current_goal_completion_audit_gap_map_created: true,
  objective_restated: true,
  prompt_to_artifact_checklist_created: true,
  completion_audit_uses_real_artifacts: true,
  proxy_signal_only: false,
  goal_complete_now: false,
  update_goal_called: false,
  missing_or_incomplete_items_present: true,
  authorization_blocked_items_count: 5,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
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
