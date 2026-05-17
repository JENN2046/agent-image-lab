#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  memoryDeltaDraft: "tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml",
  memoryDeltaSchema: "memory_policy/memory_delta.schema.yaml",
  reviewConsoleHandoffTaxonomy: "docs/v14_114_review_console_handoff_taxonomy_index_alignment.md",
  memoryDeltaAlignment: "docs/v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.md",
  phaseRecord: "docs/v14_125_review_console_memory_delta_handoff_refresh.md",
  handoffTaxonomyValidator: "scripts/validate_v14_114_review_console_handoff_taxonomy_alignment.js",
  memoryDeltaValidator: "scripts/validate_v14_111_codex_session_memory_delta_draft.js",
  memoryDeltaAlignmentValidator: "scripts/validate_v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.js",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_125_review_console_memory_delta_handoff_refresh.js",
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

const fieldMapping = read(files.fieldMapping);
for (const token of [
  "v14.125 Codex Session memory_delta Draft Handoff",
  "tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml",
  "`memory_delta.write_mode`",
  "必须保持 `draft`",
  "`memory_delta.approval_status`",
  "必须保持 `pending`",
  "`memory_delta.final_decision.should_write_to_vcp`",
  "未批准时必须为 `false`",
  "`memory_delta.final_decision.should_show_in_review_console`",
  "可以在 Review Console 展示",
  "只能展示该草案并请求未来单独的 memory write authorization",
  "不能直接写 DailyNote 或 VCP memory",
]) {
  requireToken("field_mapping", fieldMapping, token);
}

const draft = read(files.memoryDeltaDraft);
for (const token of [
  "write_mode: draft",
  "approval_required: true",
  "approval_status: pending",
  "should_write_to_vcp: false",
  "should_show_in_review_console: true",
  "daily_note_write_performed: false",
  "vcp_memory_write_performed: false",
  "direct_memory_write_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_by_project_script_performed: false",
  "image_binary_included: false",
]) {
  requireToken("memory_delta_draft", draft, token);
}
addResult("memory_delta_draft_chinese_body_present", /chinese_diary_content: ".*[\u4e00-\u9fff]/.test(draft));

const handoffTaxonomy = runJsonValidator(files.handoffTaxonomyValidator, "review_console_handoff_taxonomy_validator");
addResult(
  "handoff_taxonomy_display_only_no_memory_write",
  handoffTaxonomy?.review_console_display_only === true &&
    handoffTaxonomy?.runtime_integration_performed === false &&
    handoffTaxonomy?.daily_note_write_performed === false &&
    handoffTaxonomy?.vcp_memory_write_performed === false
);

const memoryDelta = runJsonValidator(files.memoryDeltaValidator, "codex_memory_delta_draft_validator");
addResult(
  "codex_memory_delta_draft_remains_pending_visible_no_write",
  memoryDelta?.memory_delta_draft?.write_mode === "draft" &&
    memoryDelta?.memory_delta_draft?.approval_status === "pending" &&
    memoryDelta?.memory_delta_draft?.should_write_to_vcp === false &&
    memoryDelta?.memory_delta_draft?.daily_note_write_performed === false &&
    memoryDelta?.memory_delta_draft?.vcp_memory_write_performed === false
);

const memoryDeltaAlignment = runJsonValidator(files.memoryDeltaAlignmentValidator, "memory_delta_alignment_validator");
addResult(
  "memory_delta_alignment_confirms_review_mapping_no_write",
  memoryDeltaAlignment?.memory_delta_draft_schema_aligned_for_codex_reviews === true &&
    memoryDeltaAlignment?.review_record_to_memory_delta_mapping_verified === true &&
    memoryDeltaAlignment?.daily_note_vcp_memory_write_blocked === true
);

const phase = read(files.phaseRecord);
for (const token of [
  "review_console_memory_delta_handoff_refreshed: true",
  "codex_session_memory_delta_draft_visible_in_review_console: true",
  "memory_delta_write_mode_remains_draft: true",
  "memory_delta_approval_status_remains_pending: true",
  "memory_delta_should_write_to_vcp_false: true",
  "review_console_memory_handoff_display_only: true",
  "daily_note_vcp_memory_write_blocked: true",
  "runtime_integration_performed: false",
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
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
  "v14_125_review_console_memory_delta_handoff_refresh",
  "review_console_memory_delta_handoff_refreshed: true",
  "codex_session_memory_delta_draft_visible_in_review_console: true",
  "memory_delta_write_mode_remains_draft: true",
  "memory_delta_approval_status_remains_pending: true",
  "memory_delta_should_write_to_vcp_false: true",
  "review_console_memory_handoff_display_only: true",
  "daily_note_vcp_memory_write_blocked: true",
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
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);

requireToken("mvp_validator", read(files.mvpValidator), files.currentValidator);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_125_review_console_memory_delta_handoff_refresh",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  review_console_memory_delta_handoff_refreshed: passed,
  codex_session_memory_delta_draft_visible_in_review_console: passed,
  memory_delta_write_mode_remains_draft: passed,
  memory_delta_approval_status_remains_pending: passed,
  memory_delta_should_write_to_vcp_false: passed,
  review_console_memory_handoff_display_only: passed,
  daily_note_vcp_memory_write_blocked: passed,
  runtime_integration_performed: false,
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
process.exit(passed ? 0 : 1);
