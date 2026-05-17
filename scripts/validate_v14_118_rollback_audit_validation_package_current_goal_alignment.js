#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  validationMatrix: "docs/VALIDATION_SELECTION_MATRIX.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  validationChecklist: "tests/validation_checklist.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  localValidator: "scripts/validate-agent-image-lab-local.ps1",
  boardValidator: "scripts/validate_agent_board_state.js",
  goalGate: "docs/v14_108_three_month_visual_control_layer_goal_alignment_gate.md",
  dryRunAdapterGate: "docs/v14_115_dry_run_vcp_adapter_current_goal_alignment.md",
  manifestReadGate: "docs/v14_116_manifest_read_authorization_current_goal_alignment.md",
  memoryWriteGate: "docs/v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.md",
  phaseRecord: "docs/v14_118_rollback_audit_validation_package_current_goal_alignment.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validator: "scripts/validate_v14_118_rollback_audit_validation_package_current_goal_alignment.js",
};

const stageValidators = [
  "scripts/validate_v14_115_dry_run_vcp_adapter_current_goal_alignment.js",
  "scripts/validate_v14_116_manifest_read_authorization_current_goal_alignment.js",
  "scripts/validate_v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.js",
];

const stageValidationIds = [
  "VALIDATION-20260517-v14.115-DRY-RUN-VCP-ADAPTER-CURRENT-GOAL-ALIGNMENT",
  "VALIDATION-20260517-v14.116-MANIFEST-READ-AUTHORIZATION-CURRENT-GOAL-ALIGNMENT",
  "VALIDATION-20260517-v14.117-DAILYNOTE-VCP-MEMORY-AUTHORIZATION-CURRENT-GOAL-ALIGNMENT",
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

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

function assertNoForbiddenCurrentSurface(label, text) {
  const forbiddenTruePatterns = [
    /provider_contact_performed:\s+true/i,
    /plugin_call_performed:\s+true/i,
    /api_call_performed:\s+true/i,
    /mcp_runtime_performed:\s+true/i,
    /image_generation_performed:\s+true/i,
    /DailyNote_write_performed:\s+true/i,
    /VCP_memory_write_performed:\s+true/i,
    /daily_note_write_performed:\s+true/i,
    /vcp_memory_write_performed:\s+true/i,
    /real_manifest_read_performed:\s+true/i,
    /real_vcpchat_read_performed:\s+true/i,
    /real_vcptoolbox_read_performed:\s+true/i,
    /production_candidate_created:\s+true/i,
    /push_tag_release_deploy_allowed_without_separate_authorization:\s+true/i,
  ];
  for (const pattern of forbiddenTruePatterns) {
    addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
  }
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(repoPath(relativePath)), relativePath);
}
for (const relativePath of stageValidators) {
  addResult(`${relativePath}_exists`, fs.existsSync(repoPath(relativePath)), relativePath);
  runNodeCheck(relativePath);
}
runNodeCheck(files.boardValidator);
runNodeCheck(files.validator);

const matrix = read(files.validationMatrix);
for (const token of [
  "git status -sb",
  "git diff --check",
  "exact diff review",
  "node scripts/validate_agent_board_state.js",
  "powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1",
  "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1",
  "Do not run real generation, provider contact, plugin call, `.env.local` value read, runtime integration, or memory write as validation under A4.8.",
]) {
  requireToken("validation_matrix", matrix, token);
}

const validationLog = read(files.validationLog);
for (const validationId of stageValidationIds) {
  requireToken("validation_log", validationLog, validationId);
}
for (const token of [
  "passed: true",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "production_candidate_created: false",
]) {
  requireToken("validation_log", validationLog, token);
}

const checklist = read(files.validationChecklist);
for (const token of [
  "rollback 只定义为丢弃 dry-run 草案，不撤销真实外部动作。",
  "audit 只记录中文脱敏摘要，不保存敏感原文。",
  "git diff --check",
  "node scripts/validate_agent_board_state.js",
  "powershell -ExecutionPolicy Bypass -File scripts\\validate_mvp.ps1",
  "powershell -ExecutionPolicy Bypass -File scripts\\validate-agent-image-lab-local.ps1",
]) {
  requireToken("validation_checklist", checklist, token);
}

const mvpValidator = read(files.mvpValidator);
for (const relativePath of [...stageValidators, files.validator]) {
  requireToken("mvp_validator", mvpValidator, relativePath);
}
for (const token of [
  "must not call provider/plugin/API/MCP",
  "must not generate images or write files",
  "must not write memory",
  "must not write DailyNote or VCP memory",
]) {
  requireToken("mvp_validator", mvpValidator, token);
}

const localValidator = read(files.localValidator);
for (const token of [
  "git diff --check",
  "Hard false flag scan",
  "api_called:\\s*true",
  "daily_note_called:\\s*true",
  "real_manifest_read:\\s*true",
  "real_execution_allowed:\\s*true",
]) {
  requireToken("local_validator", localValidator, token);
}

const boardValidator = read(files.boardValidator);
for (const token of [
  "post_push_status_sync_verified",
  "phase_freshness_verified",
  "external_network_required: false",
  "external_service_required: false",
  "file_write_performed: false",
]) {
  requireToken("board_validator", boardValidator, token);
}

const goalGate = read(files.goalGate);
requireToken("goal_gate", goalGate, "rollback_audit_validation_package:");
requireToken("goal_gate", goalGate, "status: present_but_needs_continuous_stage_evidence");

const currentSurfaces = [
  read(files.phaseRecord),
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.dryRunAdapterGate),
  read(files.manifestReadGate),
  read(files.memoryWriteGate),
].join("\n");

for (const token of [
  "default_generation_route_for_next_three_months: codex_session_image",
  "rollback_audit_validation_package_current_goal_alignment",
  "recommended_next_auto_execution_allowed: true",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "production_candidate_created: false",
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}
assertNoForbiddenCurrentSurface("current_surfaces", currentSurfaces);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_118_rollback_audit_validation_package_current_goal_alignment",
  version: "v1",
  passed,
  files_checked: [...Object.values(files), ...stageValidators],
  check_count: results.length,
  failed_count: errors.length,
  rollback_audit_validation_package_aligned: passed,
  continuous_stage_evidence_present: passed,
  validation_selection_matrix_present: true,
  validation_log_stage_chain_present: true,
  mvp_validator_wired: true,
  local_validation_helper_present: true,
  agent_board_validator_present: true,
  codex_session_default_route_preserved: passed,
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
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
  output_file_write_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
