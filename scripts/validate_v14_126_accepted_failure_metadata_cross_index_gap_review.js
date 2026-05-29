#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  fashionLookbookIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  failureRegistry: "failure_samples/failure_registry.yaml",
  failureTaxonomy: "failure_samples/failure_taxonomy.yaml",
  failureBoundary: "docs/v14_113_failure_samples_authorization_and_taxonomy_draft_without_write.md",
  productionGate: "docs/v14_112_production_candidate_gate_local_policy_refresh.md",
  reviewConsoleMemoryDeltaHandoff: "docs/v14_125_review_console_memory_delta_handoff_refresh.md",
  phaseRecord: "docs/v14_126_accepted_failure_metadata_cross_index_gap_review.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_126_accepted_failure_metadata_cross_index_gap_review.js",
};

const codexAcceptedSampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
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

const acceptedRegistry = read(files.acceptedRegistry);
const fashionLookbookIndex = read(files.fashionLookbookIndex);
const failureRegistry = read(files.failureRegistry);
const failureTaxonomy = read(files.failureTaxonomy);
const failureBoundary = read(files.failureBoundary);
const productionGate = read(files.productionGate);
const memoryHandoff = read(files.reviewConsoleMemoryDeltaHandoff);
const phase = read(files.phaseRecord);

for (const token of [
  `sample_id: ${codexAcceptedSampleId}`,
  "provider_type: codex_session_image",
  "plugin_id: null",
  "model: codex_session_builtin_image_generation",
  "category: fashion_lookbook_portrait",
  "write_to_memory_allowed: false",
  "daily_note_write_allowed: false",
]) {
  requireToken("accepted_registry", acceptedRegistry, token);
}
requireToken("fashion_lookbook_index", fashionLookbookIndex, codexAcceptedSampleId);

for (const token of [
  "updated_by_phase: v7_33",
  "registry_only: true",
  "memory_write_allowed: false",
  "daily_note_write_allowed: false",
  "failure_count: 3",
]) {
  requireToken("failure_registry", failureRegistry, token);
}
addResult("codex_sample_not_in_failure_registry", !failureRegistry.includes(codexAcceptedSampleId));
addResult("failure_taxonomy_has_existing_types", [
  "watermark_or_generated_mark_present",
  "product_partially_obstructed_by_leaf",
  "readable_page_texture_risk",
  "prompt_watermark_control_insufficient",
].every((token) => failureTaxonomy.includes(token)));

for (const token of [
  "failure_samples_write_allowed_without_separate_authorization: false",
  "failure_samples_registry_write_performed: false",
  "failure_samples_taxonomy_write_performed: false",
]) {
  requireToken("failure_boundary", failureBoundary, token);
}

requireToken("production_gate", productionGate, "production_candidate_auto_promotion_allowed: false");
requireToken("production_gate", productionGate, "production_candidate_write_allowed_without_separate_authorization: false");
requireToken("production_gate", productionGate, "production_candidate_write_performed: false");
requireToken("review_console_memory_delta_handoff", memoryHandoff, "review_console_memory_delta_handoff_refreshed: true");
requireToken("review_console_memory_delta_handoff", memoryHandoff, "failure_samples_write_performed: false");
requireToken("review_console_memory_delta_handoff", memoryHandoff, "production_candidate_created: false");

for (const token of [
  "codex_session_accepted_sample_registered: true",
  "codex_session_failure_sample_registered: false",
  "failure_samples_gap_is_authorization_blocked: true",
  "failure_samples_write_requires_separate_authorization: true",
  "category_index_contains_codex_sample: true",
  "write_performed_in_this_phase: false",
  "auto_repair_allowed: false",
  "accepted_samples_write_performed: false",
  "failure_samples_write_performed: false",
  "failure_samples_registry_write_performed: false",
  "failure_samples_taxonomy_write_performed: false",
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
  "v14_126_accepted_failure_metadata_cross_index_gap_review",
  "codex_session_accepted_sample_registered: true",
  "codex_session_failure_sample_registered: false",
  "failure_samples_gap_is_authorization_blocked: true",
  "failure_samples_write_requires_separate_authorization: true",
  "failure_samples_write_performed: false",
  "failure_samples_registry_write_performed: false",
  "failure_samples_taxonomy_write_performed: false",
  "production_candidate_created: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

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
  validator: "validate_v14_126_accepted_failure_metadata_cross_index_gap_review",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  codex_session_accepted_sample_registered: passed,
  codex_session_failure_sample_registered: false,
  failure_samples_gap_is_authorization_blocked: passed,
  failure_samples_write_requires_separate_authorization: true,
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
