#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  localReviewSchema: "schemas/local_review_record.schema.yaml",
  memoryDeltaSchema: "memory_policy/memory_delta.schema.yaml",
  memoryDeltaDraft: "tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml",
  memoryDeltaValidator: "scripts/validate_v14_111_codex_session_memory_delta_draft.js",
  reviewRecord: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  localReviewGate: "docs/v14_122_local_review_record_schema_refresh.md",
  phaseRecord: "docs/v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_123_memory_delta_draft_schema_alignment_for_codex_reviews.js",
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

function fileExists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
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

function assertNoForbiddenTrue(label, text) {
  const forbiddenTruePatterns = [
    /DailyNote_write_performed:\s+true/i,
    /VCP_memory_write_performed:\s+true/i,
    /daily_note_write_performed:\s+true/i,
    /vcp_memory_write_performed:\s+true/i,
    /direct_memory_write_performed:\s+true/i,
    /provider_contact_performed:\s+true/i,
    /plugin_call_performed:\s+true/i,
    /api_call_performed:\s+true/i,
    /mcp_runtime_performed:\s+true/i,
    /image_generation_performed:\s+true/i,
    /accepted_samples_write_performed:\s+true/i,
    /failure_samples_write_performed:\s+true/i,
    /production_candidate_created:\s+true/i,
    /real_manifest_read_performed:\s+true/i,
    /real_vcpchat_read_performed:\s+true/i,
    /real_vcptoolbox_read_performed:\s+true/i,
  ];
  for (const pattern of forbiddenTruePatterns) {
    addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
  }
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, fileExists(relativePath), relativePath);
}

const localReviewSchema = read(files.localReviewSchema);
for (const token of [
  "required_review_fields:",
  "commercial_delivery_ready",
  "memory_suitability",
  "required_boundary_fields:",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "non_authorization:",
  "DailyNote_write_allowed_by_schema: false",
  "VCP_memory_write_allowed_by_schema: false",
]) {
  requireToken("local_review_schema", localReviewSchema, token);
}

const memorySchema = read(files.memoryDeltaSchema);
for (const token of [
  "memory_delta:",
  "write_mode: draft | confirmed | audit_only | forbidden",
  "approval_required: boolean",
  "approval_status: not_required | pending | approved | rejected",
  "source:",
  "chinese_diary_title:",
  "chinese_diary_content:",
  "memory_safety:",
  "contains_secret: boolean",
  "contains_private_path: boolean",
  "contains_customer_private_data: boolean",
  "contains_image_binary: boolean",
  "final_decision:",
  "should_write_to_vcp: boolean",
  "draft_mode:",
  "final_decision.should_write_to_vcp: false",
]) {
  requireToken("memory_delta_schema", memorySchema, token);
}

const draft = read(files.memoryDeltaDraft);
for (const token of [
  "delta_id: memory_delta_draft_accepted_womens_resort_relaxed_knit_codex_v2_001",
  "source_type: codex_session_review_record",
  "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  "accepted_samples/accepted_sample_registry.yaml#accepted_womens_resort_relaxed_knit_codex_v2_001",
  "write_mode: draft",
  "approval_required: true",
  "approval_status: pending",
  "chinese_diary_title:",
  "chinese_diary_content:",
  "should_write_to_vcp: false",
  "should_show_in_review_console: true",
  "daily_note_write_performed: false",
  "vcp_memory_write_performed: false",
  "direct_memory_write_performed: false",
  "image_binary_included: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
]) {
  requireToken("memory_delta_draft", draft, token);
}

const review = read(files.reviewRecord);
for (const token of [
  "decision: final_visual_candidate_pass",
  "commercial_delivery_ready: false",
  "memory_suitability: deferred",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
]) {
  requireToken("review_record", review, token);
}

const registry = read(files.acceptedRegistry);
for (const token of [
  "sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001",
  "provider_type: codex_session_image",
  "memory_suitability: false",
  "write_to_memory_allowed: false",
  "daily_note_write_allowed: false",
]) {
  requireToken("accepted_registry", registry, token);
}

const childSummary = runJsonValidator(files.memoryDeltaValidator, "memory_delta_child_validator");
addResult(
  "child_validator_confirms_draft_no_memory_write",
  childSummary?.memory_delta_draft?.write_mode === "draft" &&
    childSummary?.memory_delta_draft?.approval_status === "pending" &&
    childSummary?.memory_delta_draft?.should_write_to_vcp === false &&
    childSummary?.memory_delta_draft?.daily_note_write_performed === false &&
    childSummary?.memory_delta_draft?.vcp_memory_write_performed === false
);

requireToken("local_review_gate", read(files.localReviewGate), "memory_delta_draft_schema_alignment_for_codex_reviews");

const currentSurfaces = [
  read(files.phaseRecord),
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  read(files.mvpValidator),
].join("\n");
for (const token of [
  "memory_delta_draft_schema_aligned_for_codex_reviews: true",
  "review_record_to_memory_delta_mapping_verified: true",
  "memory_delta_draft_only_verified: true",
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
assertNoForbiddenTrue("current_surfaces", currentSurfaces);
requireToken("mvp_validator", read(files.mvpValidator), files.currentValidator);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_123_memory_delta_draft_schema_alignment_for_codex_reviews",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  memory_delta_draft_schema_aligned_for_codex_reviews: passed,
  review_record_to_memory_delta_mapping_verified: passed,
  memory_delta_draft_only_verified: passed,
  daily_note_vcp_memory_write_blocked: passed,
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
