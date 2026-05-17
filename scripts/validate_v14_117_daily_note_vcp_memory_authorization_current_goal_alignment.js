#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  handoffContract: "memory_policy/v1_3_daily_note_handoff_contract.md",
  writePermissions: "memory_policy/write_permissions.md",
  memoryDeltaSchema: "memory_policy/memory_delta.schema.yaml",
  memoryWriteChainExample: "tests/schema_examples/v1_3_memory_write_authorization_chain.example.yaml",
  codexMemoryDeltaDraft: "tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml",
  codexMemoryDeltaValidator: "scripts/validate_v14_111_codex_session_memory_delta_draft.js",
  acceptedSampleRegistry: "accepted_samples/accepted_sample_registry.yaml",
  goalGate: "docs/v14_108_three_month_visual_control_layer_goal_alignment_gate.md",
  manifestReadGate: "docs/v14_116_manifest_read_authorization_current_goal_alignment.md",
  phaseRecord: "docs/v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  validator: "scripts/validate_v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.js",
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

function runNodeScript(relativePath) {
  return childProcess.spawnSync(process.execPath, [repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
}

function assertNoSensitiveMaterial(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "api_key_literal", pattern: /api[_ -]?key\s*[:=]\s*['"][^'"]+['"]/i },
    { id: "token_literal", pattern: /token\s*[:=]\s*['"][^'"]+['"]/i },
    { id: "password_literal", pattern: /password\s*[:=]\s*['"][^'"]+['"]/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(repoPath(relativePath)), relativePath);
}

runNodeCheck(files.validator);
runNodeCheck(files.codexMemoryDeltaValidator);

const codexMemoryDeltaRun = runNodeScript(files.codexMemoryDeltaValidator);
addResult("codex_memory_delta_validator_exit_zero", codexMemoryDeltaRun.status === 0, codexMemoryDeltaRun.status === 0 ? null : codexMemoryDeltaRun.stderr || codexMemoryDeltaRun.stdout);
if (codexMemoryDeltaRun.status === 0) {
  try {
    const result = JSON.parse(codexMemoryDeltaRun.stdout);
    addResult("codex_memory_delta_validator_passed", result.passed === true);
    addResult("codex_memory_delta_write_mode_draft", result.memory_delta_draft?.write_mode === "draft");
    addResult("codex_memory_delta_should_not_write_to_vcp", result.memory_delta_draft?.should_write_to_vcp === false);
    addResult("codex_memory_delta_daily_note_not_written", result.memory_delta_draft?.daily_note_write_performed === false);
    addResult("codex_memory_delta_vcp_memory_not_written", result.memory_delta_draft?.vcp_memory_write_performed === false);
    addResult("codex_memory_delta_direct_memory_not_written", result.memory_delta_draft?.direct_memory_write_performed === false);
    addResult("codex_memory_delta_file_write_not_performed", result.memory_delta_draft?.file_write_performed === false);
  } catch (error) {
    addResult("codex_memory_delta_validator_stdout_json_parseable", false, error.message);
  }
}

const handoffText = read(files.handoffContract);
const writePermissionText = read(files.writePermissions);
const chainExampleText = read(files.memoryWriteChainExample);
const memorySchemaText = read(files.memoryDeltaSchema);
const codexDraftText = read(files.codexMemoryDeltaDraft);
const registryText = read(files.acceptedSampleRegistry);
const currentGoalText = [
  read(files.goalGate),
  read(files.manifestReadGate),
  read(files.phaseRecord),
  read(files.runState),
  read(files.taskQueue),
].join("\n");

for (const token of [
  "final_decision.should_write_to_vcp=true` 只表示写入申请已批准",
  "write_mode=confirmed` 只表示满足审批不变量",
  "daily_note_called=false",
  "actual_write_performed=false",
  "vcp_memory_written: false",
  "daily_note_write_authorized: false",
  "image_binary_saved_to_memory: false",
  "raw_sensitive_content_saved: false",
]) {
  requireToken("handoff_contract", handoffText, token);
}

for (const token of [
  "DailyNote / VCP 长期记忆的真实写入必须由未来独立授权流程执行",
  "daily_note_called=false",
  "vcp_memory_written=false",
  "actual_write_performed=false",
  "write_mode: confirmed` 必须有人工审批",
]) {
  requireToken("write_permissions", writePermissionText, token);
}

for (const token of [
  "write_mode: draft | confirmed | audit_only | forbidden",
  "approval_status: not_required | pending | approved | rejected",
  "final_decision.should_write_to_vcp: true",
  "final_decision.should_write_to_vcp: false",
  "敏感原文不得进入 memory_delta",
]) {
  requireToken("memory_delta_schema", memorySchemaText, token);
}

for (const token of [
  "status: no_write_preflight_only",
  "should_write_to_vcp: true",
  "daily_note_write_authorized: false",
  "daily_note_called: false",
  "vcp_memory_written: false",
  "actual_write_performed: false",
  "file_write_performed: false",
  "image_file_created: false",
  "本记录只表示记忆写入申请已经进入审批链，不代表已经写入 DailyNote 或 VCP 长期记忆。",
]) {
  requireToken("memory_write_chain_example", chainExampleText, token);
}
assertNoSensitiveMaterial("memory_write_chain_example", chainExampleText);

for (const token of [
  "write_mode: draft",
  "approval_required: true",
  "approval_status: pending",
  "should_write_to_vcp: false",
  "daily_note_write_performed: false",
  "vcp_memory_write_performed: false",
  "direct_memory_write_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
  "image_binary_included: false",
]) {
  requireToken("codex_memory_delta_draft", codexDraftText, token);
}
assertNoSensitiveMaterial("codex_memory_delta_draft", codexDraftText);

for (const token of [
  "write_to_memory_allowed: false",
  "daily_note_write_allowed: false",
]) {
  requireToken("accepted_sample_registry", registryText, token);
}

for (const token of [
  "default_generation_route_for_next_three_months: codex_session_image",
  "DailyNote_write_allowed_without_separate_authorization: false",
  "VCP_memory_write_allowed_without_separate_authorization: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "daily_note_write_performed: false",
  "vcp_memory_write_performed: false",
  "production_candidate_created: false",
]) {
  requireToken("current_goal_surface", currentGoalText, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_117_daily_note_vcp_memory_authorization_current_goal_alignment",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  daily_note_vcp_memory_authorization_chain_aligned: passed,
  codex_memory_delta_draft_preserved: passed,
  accepted_samples_metadata_does_not_authorize_memory: passed,
  codex_session_default_route_preserved: passed,
  write_mode: "draft",
  approval_required: true,
  approval_status: "pending",
  should_write_to_vcp: false,
  daily_note_write_authorized: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  direct_memory_write_performed: false,
  actual_write_performed: false,
  vcp_memory_written: false,
  image_binary_saved_to_memory: false,
  raw_sensitive_content_saved: false,
  accepted_samples_write_performed: false,
  production_candidate_created: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  output_file_write_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
