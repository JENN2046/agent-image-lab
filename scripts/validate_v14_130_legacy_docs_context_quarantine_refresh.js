#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  contextGuide: "docs/CONTEXT_LOAD_GUIDE.md",
  historicalIndex: "docs/HISTORICAL_DOCS_COMPACTION_INDEX.md",
  quarantineMap: "docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md",
  phaseRecord: "docs/v14_130_legacy_docs_context_quarantine_refresh.md",
  sourcePhase: "docs/v14_129_current_goal_completion_audit_gap_map.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_130_legacy_docs_context_quarantine_refresh.js",
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

const contextGuide = read(files.contextGuide);
const historicalIndex = read(files.historicalIndex);
const quarantineMap = read(files.quarantineMap);
const phase = read(files.phaseRecord);
const sourcePhase = read(files.sourcePhase);
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

for (const token of [
  "docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md",
  "Hot Context Packet",
  "docs/v14_129_current_goal_completion_audit_gap_map.md",
  "docs/v14_124_context_load_guide_and_historical_docs_compaction.md",
  "Then use exact search for supporting records",
  "avoid bulk-loading all `docs/v14_*.md`",
  "Legacy Quarantine Rule",
  "Old route chains are quarantined from default context",
  "prefer current board state and v14.129 audit",
]) {
  requireToken("context_guide", contextGuide, token);
}

for (const token of [
  "Context Quarantine",
  "docs/LEGACY_DOCS_CONTEXT_QUARANTINE.md",
  "legacy_docs_context_quarantine_active: true",
  "bulk_historical_load_allowed: false",
  "current_goal_audit_ref: docs/v14_129_current_goal_completion_audit_gap_map.md",
  "use v14.129 as the current audit summary",
]) {
  requireToken("historical_index", historicalIndex, token);
}

for (const token of [
  "legacy_docs_context_quarantine_active: true",
  "default_context_should_start_from_board_surfaces: true",
  "hot_context_packet_ref: docs/CONTEXT_LOAD_GUIDE.md",
  "current_goal_audit_ref: docs/v14_129_current_goal_completion_audit_gap_map.md",
  "bulk_historical_load_allowed: false",
  "historical_docs_deleted: false",
  "historical_docs_moved: false",
  "historical_docs_rewritten: false",
  "large_ledger:",
  "numbered_runtime_and_release_chain:",
  "v7_bridge_and_vcpchat_chain:",
  "v8_to_v10_provider_and_product_chain:",
  "v11_to_v13_reconstruction_chain:",
  "older_v14_control_records:",
  "targeted_lookup_only",
  "targeted_lookup_only_unless_named_by_current_audit",
  "Read AGENTS.md, overlay, and .agent_board surfaces.",
]) {
  requireToken("quarantine_map", quarantineMap, token);
}

for (const token of [
  "phase: v14_130_legacy_docs_context_quarantine_refresh",
  "source_phase: v14_129_current_goal_completion_audit_gap_map",
  "legacy_docs_context_quarantine_created: true",
  "context_load_guide_hot_packet_refreshed: true",
  "historical_compaction_index_quarantine_refreshed: true",
  "current_goal_audit_is_hot_context: true",
  "v14_129_preferred_over_old_v14_chain: true",
  "bulk_historical_load_allowed: false",
  "targeted_lookup_required_for_legacy_docs: true",
  "historical_docs_deleted: false",
  "historical_docs_moved: false",
  "historical_docs_rewritten: false",
  "docs/v14_129_current_goal_completion_audit_gap_map.md",
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
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "push_tag_release_deploy_performed: false",
  "next_safe_cycle: review_console_current_goal_gap_dashboard_alignment",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "context_compaction:",
  "status: verified_local",
  "docs/CONTEXT_LOAD_GUIDE.md",
  "docs/HISTORICAL_DOCS_COMPACTION_INDEX.md",
  "goal_complete_now: false",
  "update_goal_called: false",
]) {
  requireToken("source_phase", sourcePhase, token);
}

for (const token of [
  "v14_130_legacy_docs_context_quarantine_refresh",
  "legacy_docs_context_quarantine_created: true",
  "context_load_guide_hot_packet_refreshed: true",
  "historical_compaction_index_quarantine_refreshed: true",
  "current_goal_audit_is_hot_context: true",
  "v14_129_preferred_over_old_v14_chain: true",
  "bulk_historical_load_allowed: false",
  "targeted_lookup_required_for_legacy_docs: true",
  "historical_docs_deleted: false",
  "historical_docs_moved: false",
  "historical_docs_rewritten: false",
  "goal_complete_now: false",
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
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "push_tag_release_deploy_performed: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("mvp_validator", mvpValidator, files.currentValidator);
requireToken("mvp_validator", mvpValidator, files.quarantineMap);
requireToken("mvp_validator", mvpValidator, files.phaseRecord);

forbidPattern("current_surfaces", currentSurfaces, /bulk_historical_load_allowed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /goal_complete_now:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /update_goal_called:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /historical_docs_deleted:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /historical_docs_moved:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /historical_docs_rewritten:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_130_legacy_docs_context_quarantine_refresh",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  legacy_docs_context_quarantine_created: true,
  context_load_guide_hot_packet_refreshed: true,
  historical_compaction_index_quarantine_refreshed: true,
  current_goal_audit_is_hot_context: true,
  v14_129_preferred_over_old_v14_chain: true,
  bulk_historical_load_allowed: false,
  targeted_lookup_required_for_legacy_docs: true,
  goal_complete_now: false,
  update_goal_called: false,
  historical_docs_deleted: false,
  historical_docs_moved: false,
  historical_docs_rewritten: false,
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
