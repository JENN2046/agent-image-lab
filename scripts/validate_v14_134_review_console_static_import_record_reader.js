#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/v14_134_review_console_static_import_record_reader.md",
  app: "review_console/static_prototype/app.js",
  html: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  mock: "review_console/static_prototype/mock_data.js",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  realImportRecord: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_134_review_console_static_import_record_reader.js",
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
const app = read(files.app);
const html = read(files.html);
const styles = read(files.styles);
const mockText = read(files.mock);
const readme = read(files.readme);
const fieldMapping = read(files.fieldMapping);
const realImportRecordText = read(files.realImportRecord);
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

const context = { window: {} };
vm.runInNewContext(mockText, context, { filename: files.mock });
const mock = context.window.REVIEW_CONSOLE_MOCK;
const seed = mock.codex_session_import_record_seed.codex_session_image_import;
const realRecord = JSON.parse(realImportRecordText).codex_session_image_import;

for (const token of [
  "phase: v14_134_review_console_static_import_record_reader",
  "source_phase: v14_133_main_validator_real_import_record_wiring",
  "review_console_static_import_record_reader_created: true",
  "import_record_project_seed_available: true",
  "user_selected_file_reader_available: true",
  "textarea_import_record_parse_available: true",
  "parsed_in_memory_only: true",
  "draft_output_carries_import_record_reader: true",
  "fetch_performed: false",
  "file_write_performed: false",
  "runtime_vcp_integration_performed: false",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "importRecordInput",
  "importRecordFile",
  "loadImportSeedBtn",
  "parseImportRecordBtn",
  "importRecordStatus",
  "importRecordSummary",
]) {
  requireToken("html", html, token);
}

for (const token of [
  "codex_session_import_record_seed",
  "importRecordSeedText",
  "normalizeImportRecord",
  "parseImportRecordText",
  "renderImportRecordReader",
  "loadImportRecordSeed",
  "handleImportRecordFile",
  "new FileReader()",
  "reader.readAsText(file)",
  "codex_session_import_record_reader: state.import_record_reader",
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

for (const token of [
  "import-record-reader",
  "import-actions",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "codex_session_import_record_reader",
  "不 fetch",
  "不写文件",
  "不调用 runtime",
  "VCP memory",
]) {
  requireToken("readme", readme, token);
  requireToken("field_mapping", fieldMapping, token);
}

forbidPattern("app", app, /fetch\s*\(/);
forbidPattern("app", app, /XMLHttpRequest/);
forbidPattern("app", app, /localStorage/);
forbidPattern("app", app, /sessionStorage/);
forbidPattern("app", app, /navigator\.sendBeacon/);
forbidPattern("app", app, /writeFile/);
forbidPattern("html", html, /<form/i);

for (const [field, expected, actual] of [
  ["import_id", realRecord.import_id, seed.import_id],
  ["provider_id", realRecord.provider_id, seed.provider_id],
  ["prompt_package_ref", realRecord.prompt_package_ref, seed.prompt_package_ref],
  ["asset_relative_path", realRecord.imported_asset.relative_path, seed.imported_asset.relative_path],
  ["asset_sha256", realRecord.imported_asset.sha256, seed.imported_asset.sha256],
  ["asset_width", realRecord.imported_asset.width_px, seed.imported_asset.width_px],
  ["asset_height", realRecord.imported_asset.height_px, seed.imported_asset.height_px],
  ["asset_mime", realRecord.imported_asset.mime_type, seed.imported_asset.mime_type],
  ["review_record_ref", realRecord.review_bridge.review_record_ref, seed.review_bridge.review_record_ref],
]) {
  addResult(`seed_matches_real_import_record_${field}`, actual === expected, `${actual}`);
}

for (const token of [
  "v14_134_review_console_static_import_record_reader",
  "review_console_static_import_record_reader_created: true",
  "import_record_project_seed_available: true",
  "user_selected_file_reader_available: true",
  "textarea_import_record_parse_available: true",
  "parsed_in_memory_only: true",
  "draft_output_carries_import_record_reader: true",
  "fetch_performed: false",
  "file_write_performed: false",
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
  validator: "validate_v14_134_review_console_static_import_record_reader",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  review_console_static_import_record_reader_created: true,
  import_record_project_seed_available: true,
  user_selected_file_reader_available: true,
  textarea_import_record_parse_available: true,
  parsed_in_memory_only: true,
  draft_output_carries_import_record_reader: true,
  fetch_performed: false,
  file_write_performed: false,
  runtime_vcp_integration_performed: false,
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
