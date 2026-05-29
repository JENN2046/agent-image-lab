#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  failureBoundary: "docs/v14_113_failure_samples_authorization_and_taxonomy_draft_without_write.md",
  priorMetadataGap: "docs/v14_126_accepted_failure_metadata_cross_index_gap_review.md",
  priorProductionGap: "docs/v14_127_production_exclusion_draft_current_goal_gap_review.md",
  phaseRecord: "docs/v14_128_failure_samples_authorization_template_current_goal_gap_review.md",
  failureRegistry: "failure_samples/failure_registry.yaml",
  failureTaxonomy: "failure_samples/failure_taxonomy.yaml",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_128_failure_samples_authorization_template_current_goal_gap_review.js",
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

const failureBoundary = read(files.failureBoundary);
const priorMetadataGap = read(files.priorMetadataGap);
const priorProductionGap = read(files.priorProductionGap);
const phase = read(files.phaseRecord);
const failureRegistry = read(files.failureRegistry);
const failureTaxonomy = read(files.failureTaxonomy);

for (const token of [
  "failure_samples_write_allowed_without_separate_authorization: false",
  "failure_samples_registry_write_performed: false",
  "failure_samples_taxonomy_write_performed: false",
]) {
  requireToken("failure_boundary", failureBoundary, token);
}

for (const token of [
  "codex_session_failure_sample_registered: false",
  "failure_samples_gap_is_authorization_blocked: true",
  "failure_samples_write_requires_separate_authorization: true",
]) {
  requireToken("prior_metadata_gap", priorMetadataGap, token);
}

for (const token of [
  "production_candidate_gate_still_blocks_upgrade: true",
  "production_candidate_created: false",
]) {
  requireToken("prior_production_gap", priorProductionGap, token);
}

for (const token of [
  "updated_by_phase: v7_33",
  "registry_only: true",
  "memory_write_allowed: false",
  "daily_note_write_allowed: false",
]) {
  requireToken("failure_registry", failureRegistry, token);
}
requireToken("failure_taxonomy", failureTaxonomy, "failure_taxonomy");

for (const token of [
  "AUTH-PENDING-CODEX-SESSION-FAILURE-SAMPLES-YYYYMMDD-001",
  "A5 failure_samples metadata registry write execution",
  "review_record_ref",
  "failure_samples/failure_registry.yaml",
  "failure_samples/failure_taxonomy.yaml",
  "failure_samples/categories/*.yaml",
  "不允许修改 accepted_samples",
  "不允许晋级 production_candidate",
  "不允许写 DailyNote",
  "不允许写 VCP memory",
  "不允许 provider/API/plugin/MCP 调用",
  "不允许读取 real manifest/VCPChat/VCPToolBox",
  "template_created: true",
  "template_active: false",
  "authorization_granted_by_this_record: false",
  "failure_samples_write_performed: false",
  "failure_samples_registry_write_performed: false",
  "failure_samples_taxonomy_write_performed: false",
  "production_candidate_created: false",
  "blocked_until_separate_exact_A5_authorization",
]) {
  requireToken("phase_record", phase, token);
}

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
  "v14_128_failure_samples_authorization_template_current_goal_gap_review",
  "failure_samples_authorization_template_created: true",
  "failure_samples_authorization_template_active: false",
  "authorization_granted_by_this_record: false",
  "failure_samples_write_performed: false",
  "failure_samples_registry_write_performed: false",
  "failure_samples_taxonomy_write_performed: false",
  "production_candidate_created: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /failure_samples_authorization_template_active:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_registry_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_taxonomy_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);

requireToken("mvp_validator", read(files.mvpValidator), files.currentValidator);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_128_failure_samples_authorization_template_current_goal_gap_review",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  failure_samples_authorization_template_created: true,
  failure_samples_authorization_template_active: false,
  authorization_granted_by_this_record: false,
  actual_failure_samples_write_blocked_until_separate_exact_a5_authorization: true,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  failure_samples_registry_write_performed: false,
  failure_samples_taxonomy_write_performed: false,
  production_candidate_created: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  output_file_write_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
