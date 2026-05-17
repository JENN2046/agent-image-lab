#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  fashionLookbookIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  productionExclusionRegister: "tests/schema_examples/review_report_production_exclusion_register.example.json",
  productionExclusionPhase: "docs/v14_076_review_report_production_exclusion_register_gate.md",
  productionCandidateGate: "docs/v14_112_production_candidate_gate_local_policy_refresh.md",
  priorGapRecord: "docs/v14_126_accepted_failure_metadata_cross_index_gap_review.md",
  phaseRecord: "docs/v14_127_production_exclusion_draft_current_goal_gap_review.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_127_production_exclusion_draft_current_goal_gap_review.js",
};

const acceptedSampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
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

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
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

const acceptedRegistry = read(files.acceptedRegistry);
const fashionLookbookIndex = read(files.fashionLookbookIndex);
const productionExclusion = readJson(files.productionExclusionRegister);
const productionExclusionPhase = read(files.productionExclusionPhase);
const productionCandidateGate = read(files.productionCandidateGate);
const priorGapRecord = read(files.priorGapRecord);
const phase = read(files.phaseRecord);

const exclusionRecords = productionExclusion.exclusion_records || [];
const nonExclusionRecords = productionExclusion.non_exclusion_records || [];
const allRegisterRecordsText = JSON.stringify(productionExclusion);

for (const token of [
  `sample_id: ${acceptedSampleId}`,
  "provider_type: codex_session_image",
  "plugin_id: null",
  "category: fashion_lookbook_portrait",
  "write_to_memory_allowed: false",
  "daily_note_write_allowed: false",
]) {
  requireToken("accepted_registry", acceptedRegistry, token);
}
requireToken("fashion_lookbook_index", fashionLookbookIndex, acceptedSampleId);

addResult("production_exclusion_register_has_expected_phase", productionExclusion.phase === "v14_076_review_report_production_exclusion_register_gate");
addResult("production_exclusion_register_display_only", productionExclusion.display_only === true);
addResult("production_exclusion_count_is_three", exclusionRecords.length === 3);
addResult("production_non_exclusion_count_is_one", nonExclusionRecords.length === 1);
addResult("production_exclusion_blocks_candidate", productionExclusion.register_summary?.all_exclusions_block_production_candidate === true);
addResult("production_exclusion_no_candidate_created", productionExclusion.register_summary?.production_candidate_created === false);
addResult("production_exclusion_no_accepted_write", productionExclusion.register_summary?.accepted_samples_write_performed === false);
addResult("codex_sample_not_in_production_exclusion_register", !allRegisterRecordsText.includes(acceptedSampleId));

for (const token of [
  "review_report_production_exclusion_register_present: true",
  "review_report_production_exclusion_no_production_candidate_verified: true",
  "production_candidate_created: false",
]) {
  requireToken("production_exclusion_phase", productionExclusionPhase, token);
}

for (const token of [
  "production_candidate_auto_promotion_allowed: false",
  "production_candidate_write_allowed_without_separate_authorization: false",
  "production_candidate_write_performed: false",
]) {
  requireToken("production_candidate_gate", productionCandidateGate, token);
}

for (const token of [
  "codex_session_accepted_sample_registered: true",
  "failure_samples_gap_is_authorization_blocked: true",
  "production_candidate_created: false",
]) {
  requireToken("prior_gap_record", priorGapRecord, token);
}

for (const token of [
  "production_exclusion_register_present: true",
  "production_exclusion_register_scope: historical_review_report_fixture",
  "codex_session_accepted_sample_should_be_production_exclusion: false",
  "codex_session_accepted_sample_in_production_exclusion_register: false",
  "current_codex_sample_production_exclusion_gap_is_expected: true",
  "production_candidate_gate_still_blocks_upgrade: true",
  "production_exclusion_draft_write_performed: false",
  "production_exclusion_register_modified: false",
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
  "v14_127_production_exclusion_draft_current_goal_gap_review",
  "production_exclusion_register_present: true",
  "codex_session_accepted_sample_in_production_exclusion_register: false",
  "current_codex_sample_production_exclusion_gap_is_expected: true",
  "production_candidate_gate_still_blocks_upgrade: true",
  "production_exclusion_draft_write_performed: false",
  "production_exclusion_register_modified: false",
  "accepted_samples_write_performed: false",
  "failure_samples_write_performed: false",
  "production_candidate_created: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /production_exclusion_(?:draft_write_performed|register_modified):\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);

requireToken("mvp_validator", read(files.mvpValidator), files.currentValidator);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_127_production_exclusion_draft_current_goal_gap_review",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  production_exclusion_register_present: true,
  production_exclusion_register_scope: "historical_review_report_fixture",
  codex_session_accepted_sample_should_be_production_exclusion: false,
  codex_session_accepted_sample_in_production_exclusion_register: false,
  current_codex_sample_production_exclusion_gap_is_expected: true,
  production_candidate_gate_still_blocks_upgrade: true,
  production_exclusion_draft_write_performed: false,
  production_exclusion_register_modified: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
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
