#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning.md",
  packageExample: "tests/schema_examples/v14_139_authorization_split_package.example.yaml",
  productionGate: "docs/v14_112_production_candidate_gate_local_policy_refresh.md",
  memoryGate: "docs/v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.md",
  archiveWorkflow: "workflows/asset_archive_workflow.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning.js",
};

const packageIds = [
  "AUTH-PENDING-WOMENS-RESORT-KNIT-DURABLE-ARCHIVE-20260517-001",
  "AUTH-PENDING-WOMENS-RESORT-KNIT-PRODUCTION-CANDIDATE-20260517-001",
  "AUTH-PENDING-WOMENS-RESORT-KNIT-MEMORY-WRITE-20260517-001",
];

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
const packageExample = read(files.packageExample);
const productionGate = read(files.productionGate);
const memoryGate = read(files.memoryGate);
const archiveWorkflow = read(files.archiveWorkflow);
const mvpValidator = read(files.mvpValidator);
const currentSurfaces = [
  phase,
  packageExample,
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  mvpValidator,
].join("\n");

for (const token of [
  "phase: v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning",
  "source_phase: v14_138_dashboard_alignment_from_real_artifact_evidence",
  "durable_archive_authorization_prepared: true",
  "production_candidate_authorization_prepared: true",
  "memory_write_authorization_prepared: true",
  "authorization_packages_split: true",
  "durable_archive_is_not_production_candidate: true",
  "production_candidate_is_not_memory_write: true",
  "memory_write_is_not_durable_archive: true",
  "authorization_granted_by_this_record: false",
  "durable_archive_executed: false",
  "image_binary_copy_performed: false",
  "production_candidate_created: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
]) {
  requireToken("phase_record", phase, token);
}

for (const id of packageIds) {
  requireToken("phase_record", phase, id);
  requireToken("package_example", packageExample, id);
}

for (const token of [
  "package_status: prepared_not_granted",
  "authorization_granted_by_this_record: false",
  "durable_archive_is_not_production_candidate: true",
  "production_candidate_is_not_memory_write: true",
  "memory_write_is_not_durable_archive: true",
  "durable_archive_executed: false",
  "image_binary_copy_performed: false",
  "production_candidate_created: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
]) {
  requireToken("package_example", packageExample, token);
}

for (const token of [
  "production_candidate_auto_promotion_allowed: false",
  "production_candidate_write_allowed_without_separate_authorization: false",
]) {
  requireToken("production_gate", productionGate, token);
}

for (const token of [
  "daily_note_write_authorized: false",
  "vcp_memory_write_performed: false",
  "actual_write_performed: false",
]) {
  requireToken("memory_gate", memoryGate, token);
}

for (const token of [
  "MVP 阶段不保存真实图片大文件",
  "是否会写 VCP 记忆",
  "false",
]) {
  requireToken("archive_workflow", archiveWorkflow, token);
}

for (const token of [
  "v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning",
  "durable_archive_authorization_prepared: true",
  "production_candidate_authorization_prepared: true",
  "memory_write_authorization_prepared: true",
  "authorization_packages_split: true",
  "authorization_granted_by_this_record: false",
  "durable_archive_executed: false",
  "archive_manifest_written: false",
  "image_binary_copy_performed: false",
  "production_candidate_created: false",
  "production_candidate_write_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "push_tag_release_deploy_performed: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("mvp_validator", mvpValidator, files.currentValidator);
requireToken("mvp_validator", mvpValidator, files.phaseRecord);
requireToken("mvp_validator", mvpValidator, files.packageExample);

forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /package_status:\s+granted/i);
forbidPattern("current_surfaces", currentSurfaces, /durable_archive_executed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /archive_manifest_written:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  durable_archive_authorization_prepared: true,
  production_candidate_authorization_prepared: true,
  memory_write_authorization_prepared: true,
  authorization_packages_split: true,
  authorization_granted_by_this_record: false,
  durable_archive_executed: false,
  archive_manifest_written: false,
  image_binary_copy_performed: false,
  production_candidate_created: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
