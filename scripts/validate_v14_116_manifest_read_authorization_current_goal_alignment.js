#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  manifestGate: "integrations/vcp/manifest_read_authorization_gate.md",
  manifestGateExample: "tests/schema_examples/v0_3_manifest_read_authorization_gate.example.yaml",
  phase10Example: "tests/schema_examples/phase10_manifest_authorization_gate.example.yaml",
  vcpchatRequestContract: "review_console/embed_contract/real_vcpchat_read_authorization_request.md",
  vcpchatRequestExample: "tests/schema_examples/v2_1_real_vcpchat_read_authorization_request.example.yaml",
  vcpchatFillContract: "review_console/embed_contract/real_vcpchat_read_authorization_fill.md",
  vcpchatFillExample: "tests/schema_examples/v2_2_real_vcpchat_read_authorization_fill.example.yaml",
  goalGate: "docs/v14_108_three_month_visual_control_layer_goal_alignment_gate.md",
  dryRunAdapterGoalGate: "docs/v14_115_dry_run_vcp_adapter_current_goal_alignment.md",
  phaseRecord: "docs/v14_116_manifest_read_authorization_current_goal_alignment.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  validator: "scripts/validate_v14_116_manifest_read_authorization_current_goal_alignment.js",
};

const errors = [];
const results = [];

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

function requireAnyToken(label, text, tokens) {
  addResult(`${label}_one_of_${tokens.join("|")}_present`, tokens.some((token) => text.includes(token)));
}

function assertNoForbiddenTrue(label, text) {
  const forbiddenTrueKeys = [
    "user_authorized",
    "source_read_authorized",
    "source_read_performed",
    "real_vcpchat_source_read",
    "real_vcptoolbox_source_read",
    "real_manifest_read",
    "external_repo_access_allowed",
    "raw_source_copy_allowed",
    "raw_manifest_copy_allowed",
    "read_authorized",
    "read_performed",
    "api_called",
    "vcp_plugin_called",
    "plugin_called",
    "daily_note_called",
    "vcp_memory_written",
    "disk_write_performed",
    "image_file_created",
    "real_execution_allowed",
    "target_repository_root_provided",
    "exact_real_paths_listed",
  ];

  for (const key of forbiddenTrueKeys) {
    addResult(`${label}_${key}_not_true`, !new RegExp(`${key}:\\s+true\\b`, "i").test(text));
  }
}

function assertNoSensitiveMaterial(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "external_url", pattern: /https?:\/\//i },
    { id: "api_key_literal", pattern: /api[_ -]?key\s*[:=]\s*['"][^'"]+['"]/i },
    { id: "token_literal", pattern: /token\s*[:=]\s*['"][^'"]+['"]/i },
    { id: "password_literal", pattern: /password\s*[:=]\s*['"][^'"]+['"]/i },
    { id: "real_local_path_assignment", pattern: /(^|\n)\s*target_repository_root:\s+(?!null\b|required_later\b)\S+/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, fs.existsSync(repoPath(relativePath)), relativePath);
}

runNodeCheck(files.validator);

const manifestTexts = [
  read(files.manifestGate),
  read(files.manifestGateExample),
  read(files.phase10Example),
].join("\n");

for (const token of [
  "read_authorized: false",
  "read_performed: false",
  "source_authorized: false",
  "source_read_performed: false",
  "real_manifest_read: false",
  "external_repo_access_allowed: false",
  "allowed_source_paths: []",
  "allowed_file_types: []",
  "raw_manifest_copy_allowed: false",
  "selected_plugin: null",
  "max_plugin_calls: 0",
  "real_execution_allowed: false",
  "pending_manifest_review",
]) {
  requireToken("manifest_authorization_package", manifestTexts, token);
}
assertNoForbiddenTrue("manifest_authorization_package", manifestTexts);
assertNoSensitiveMaterial("manifest_authorization_package", manifestTexts);

const vcpchatTexts = [
  read(files.vcpchatRequestContract),
  read(files.vcpchatRequestExample),
  read(files.vcpchatFillContract),
  read(files.vcpchatFillExample),
].join("\n");

for (const token of [
  "user_authorized: false",
  "source_read_authorized: false",
  "source_read_performed: false",
  "real_vcpchat_source_read: false",
  "real_vcptoolbox_source_read: false",
  "real_vcpchat_modified: false",
  "real_vcptoolbox_modified: false",
  "target_repository_root: null",
  "target_repository_root_provided: false",
  "exact_real_paths: []",
  "exact_allowed_paths: []",
  "exact_allowed_paths_redacted: []",
  "allowed_sanitized_output_fields: []",
  "read_command_permission: false",
  "raw_source_copy_allowed: false",
  "real_execution_allowed: false",
  "selected_plugin: null",
  "max_plugin_calls: 0",
]) {
  requireToken("vcpchat_read_authorization_package", vcpchatTexts, token);
}
assertNoForbiddenTrue("vcpchat_read_authorization_package", vcpchatTexts);
assertNoSensitiveMaterial("vcpchat_read_authorization_package", vcpchatTexts);

const currentGoalSurfaces = [
  read(files.goalGate),
  read(files.dryRunAdapterGoalGate),
  read(files.phaseRecord),
  read(files.runState),
  read(files.taskQueue),
].join("\n");

for (const token of [
  "default_generation_route_for_next_three_months: codex_session_image",
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "production_candidate_created: false",
]) {
  requireToken("current_goal_surface", currentGoalSurfaces, token);
}
requireAnyToken("current_goal_surface", currentGoalSurfaces, [
  "real_manifest_read_requires_separate_authorization: true",
  "real_manifest_VCPChat_VCPToolBox_read_allowed_without_separate_authorization: false",
]);
requireAnyToken("current_goal_surface", currentGoalSurfaces, [
  "real_VCPChat_or_VCPToolBox_read_requires_separate_authorization: true",
  "real_manifest_VCPChat_VCPToolBox_read_allowed_without_separate_authorization: false",
]);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_116_manifest_read_authorization_current_goal_alignment",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  manifest_read_authorization_package_aligned: passed,
  vcpchat_read_authorization_package_aligned: passed,
  codex_session_default_route_preserved: passed,
  user_authorized: false,
  read_authorized: false,
  source_read_authorized: false,
  source_read_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  raw_source_copy_allowed: false,
  raw_manifest_copy_allowed: false,
  allowed_source_paths_empty: true,
  exact_real_paths_empty: true,
  target_repository_root_stored: false,
  read_command_permission: false,
  selected_plugin: null,
  max_plugin_calls: 0,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  production_candidate_created: false,
  output_file_write_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
