#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  contextGuide: "docs/CONTEXT_LOAD_GUIDE.md",
  compactionIndex: "docs/HISTORICAL_DOCS_COMPACTION_INDEX.md",
  phaseRecord: "docs/v14_124_context_load_guide_and_historical_docs_compaction.md",
  previousPhase: "docs/v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_124_context_load_guide_and_historical_docs_compaction.js",
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

const guide = read(files.contextGuide);
for (const token of [
  "Default Context Packet",
  "AGENTS.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  "docs/HISTORICAL_DOCS_COMPACTION_INDEX.md",
  "docs/v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.md",
  "Do Not Load By Default",
  "docs/00_project_roadmap.md",
  "docs/v7_*.md",
  "docs/[0-9][0-9][0-9]_*.md",
  "Use `rg` to retrieve exact records",
  "Historical records may prove what happened in an older phase",
  "They do not grant new authorization",
  "delete old docs",
  "rewrite historical facts",
  "weaken A5 gates",
  "provider/API/plugin/MCP calls",
  "image generation",
  "DailyNote writes",
  "VCP memory writes",
  "production_candidate promotion",
]) {
  requireToken("context_guide", guide, token);
}

const index = read(files.compactionIndex);
for (const token of [
  "Current Context First",
  "Archive Bands",
  "Foundation And Early Planning",
  "Numbered Gate Chain",
  "V7 Dense Governance And Bridge Chain",
  "V8 To V10 Product And Runtime Follow-Up",
  "V11 To V13 Reconstruction And Canonical Model Work",
  "V14 Current Control Layer Work",
  "Large File Warning",
  "docs/00_project_roadmap.md",
  "Default handling: targeted lookup only",
  "Old provider execution records do not authorize new provider contact",
  "This index is local documentation only",
]) {
  requireToken("compaction_index", index, token);
}

const phase = read(files.phaseRecord);
for (const token of [
  "phase: v14_124_context_load_guide_and_historical_docs_compaction",
  "default_context_packet_defined: true",
  "historical_docs_demoted_to_targeted_lookup: true",
  "docs_00_project_roadmap_not_default_context: true",
  "v7_dense_chain_not_default_context: true",
  "numbered_gate_chain_not_default_context: true",
  "old_authorization_records_not_current_authorization: true",
  "historical_docs_deleted_or_rewritten: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "accepted_samples_write_performed: false",
  "failure_samples_write_performed: false",
  "production_candidate_created: false",
  "historical_docs_deleted: false",
  "historical_docs_moved: false",
  "historical_docs_rewritten: false",
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
  "v14_124_context_load_guide_and_historical_docs_compaction",
  "context_load_guide_created: true",
  "historical_docs_compaction_index_created: true",
  "default_context_packet_defined: true",
  "historical_docs_demoted_to_targeted_lookup: true",
  "old_authorization_records_not_current_authorization: true",
  "historical_docs_deleted: false",
  "historical_docs_moved: false",
  "historical_docs_rewritten: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
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
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /historical_docs_deleted:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /historical_docs_moved:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /historical_docs_rewritten:\s+true/i);

requireToken("mvp_validator", read(files.mvpValidator), files.currentValidator);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_124_context_load_guide_and_historical_docs_compaction",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  default_context_packet_defined: passed,
  historical_docs_demoted_to_targeted_lookup: passed,
  docs_00_project_roadmap_not_default_context: passed,
  v7_dense_chain_not_default_context: passed,
  numbered_gate_chain_not_default_context: passed,
  old_authorization_records_not_current_authorization: passed,
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
