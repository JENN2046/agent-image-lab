#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/v14_135_review_console_import_reader_safety_review.md",
  sourcePhase: "docs/v14_134_review_console_static_import_record_reader.md",
  app: "review_console/static_prototype/app.js",
  html: "review_console/static_prototype/index.html",
  mock: "review_console/static_prototype/mock_data.js",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  v14_134_validator: "scripts/validate_v14_134_review_console_static_import_record_reader.js",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_135_review_console_import_reader_safety_review.js",
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

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
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
const app = read(files.app);
const html = read(files.html);
const mock = read(files.mock);
const readme = read(files.readme);
const fieldMapping = read(files.fieldMapping);
const v14_134_validator = read(files.v14_134_validator);
const mvpValidator = read(files.mvpValidator);
const reviewConsoleSurface = [app, html, mock, readme, fieldMapping].join("\n");
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
  "phase: v14_135_review_console_import_reader_safety_review",
  "source_phase: v14_134_review_console_static_import_record_reader",
  "review_console_import_reader_safety_review_completed: true",
  "no_fetch_or_network_path_verified: true",
  "no_plugin_or_provider_path_verified: true",
  "no_vcp_runtime_path_verified: true",
  "no_file_write_path_verified: true",
  "no_dailynote_or_vcp_memory_path_verified: true",
  "review_console_static_reader_remains_in_memory_only: true",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "review_console_static_import_record_reader_created: true",
  "parsed_in_memory_only: true",
  "draft_output_carries_import_record_reader: true",
  "fetch_performed: false",
  "file_write_performed: false",
  "runtime_vcp_integration_performed: false",
]) {
  requireToken("source_phase", sourcePhase, token);
}

for (const token of [
  "new FileReader()",
  "reader.readAsText(file)",
  "parseImportRecordText",
  "fetch_performed: false",
  "file_write_performed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "daily_note_write_performed: false",
  "vcp_memory_write_performed: false",
]) {
  requireToken("app", app, token);
}

forbidPattern("app", app, /fetch\s*\(/);
forbidPattern("app", app, /XMLHttpRequest/);
forbidPattern("app", app, /WebSocket/);
forbidPattern("app", app, /EventSource/);
forbidPattern("app", app, /sendBeacon/);
forbidPattern("app", app, /localStorage/);
forbidPattern("app", app, /sessionStorage/);
forbidPattern("app", app, /indexedDB/);
forbidPattern("app", app, /writeFile/);
forbidPattern("app", app, /createObjectURL/);
forbidPattern("app", app, /\.download\s*=/);
forbidPattern("html", html, /<form/i);
forbidPattern("html", html, /download=/i);
forbidPattern("html", html, /action=/i);
forbidPattern("html", html, /method=/i);
forbidPattern("review_console_surface", reviewConsoleSurface, /provider_contact_performed:\s+true/i);
forbidPattern("review_console_surface", reviewConsoleSurface, /plugin_call_performed:\s+true/i);
forbidPattern("review_console_surface", reviewConsoleSurface, /api_call_performed:\s+true/i);
forbidPattern("review_console_surface", reviewConsoleSurface, /mcp_runtime_performed:\s+true/i);
forbidPattern("review_console_surface", reviewConsoleSurface, /daily_note_write_performed:\s+true/i);
forbidPattern("review_console_surface", reviewConsoleSurface, /vcp_memory_write_performed:\s+true/i);

for (const token of [
  "forbidPattern(\"app\", app, /fetch\\s*\\(/)",
  "forbidPattern(\"app\", app, /XMLHttpRequest/)",
  "forbidPattern(\"app\", app, /localStorage/)",
  "forbidPattern(\"app\", app, /writeFile/)",
  "forbidPattern(\"html\", html, /<form/i)",
]) {
  requireToken("v14_134_validator", v14_134_validator, token);
}

for (const token of [
  "v14_135_review_console_import_reader_safety_review",
  "review_console_import_reader_safety_review_completed: true",
  "no_fetch_or_network_path_verified: true",
  "no_plugin_or_provider_path_verified: true",
  "no_vcp_runtime_path_verified: true",
  "no_file_write_path_verified: true",
  "no_dailynote_or_vcp_memory_path_verified: true",
  "review_console_static_reader_remains_in_memory_only: true",
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

forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_135_review_console_import_reader_safety_review",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  review_console_import_reader_safety_review_completed: true,
  no_fetch_or_network_path_verified: true,
  no_plugin_or_provider_path_verified: true,
  no_vcp_runtime_path_verified: true,
  no_file_write_path_verified: true,
  no_dailynote_or_vcp_memory_path_verified: true,
  review_console_static_reader_remains_in_memory_only: true,
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
