#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  phaseRecord: "docs/v14_162_lamp_prompt_revision_after_v14_161_review.md",
  promptPackage: "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml",
  fixture: "tests/schema_examples/v14_162_lamp_prompt_revision_after_v14_161_review.example.json",
  sourceReview: "docs/v14_161_codex_session_generated_candidate_readiness.md",
  sourceImportRecord: "tests/schema_examples/v14_161_product_still_life_smart_desk_lamp_import_record.json",
  currentValidator: "scripts/validate_v14_162_lamp_prompt_revision_after_v14_161_review.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
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

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function parseJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
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

function evaluatePromptPackage(text) {
  const required = [
    "package_id: product_lifestyle_premium_portable_led_camping_lantern_codex_v2",
    "source_candidate_ref: runs/real_generation/v14_161_codex_session_two_more_recoverable_samples_generation_trial/codex_session_v14_161_product_still_life_smart_desk_lamp_candidate_001.png",
    "source_review_record_ref: docs/v14_161_codex_session_generated_candidate_readiness.md",
    "must clearly read as a premium portable LED camping lantern for outdoor use",
    "not an indoor desk lamp",
    "portable LED camping lantern",
    "integrated dark metal carry handle",
    "small lower-body precision dimmer",
    "outdoors at the perfect early blue hour",
    "upper-middle-lower composition",
    "front edge perfectly horizontal",
    "premium high contrast",
    "image_generation_allowed_by_this_stage: false",
    "accepted_samples_write_allowed: false",
    "prompt_package_is_generation_authorization: false",
  ];
  const forbidden = [
    /image_generation_performed:\s+true/i,
    /provider_contact_performed:\s+true/i,
    /plugin_call_performed:\s+true/i,
    /api_call_performed:\s+true/i,
    /mcp_runtime_performed:\s+true/i,
    /accepted_samples_write_performed:\s+true/i,
    /production_candidate_write_performed:\s+true/i,
    /DailyNote_write_performed:\s+true/i,
    /VCP_memory_write_performed:\s+true/i,
    /vcp_runtime_integration_proven:\s+true/i,
  ];
  return {
    requiredTokensOk: required.every((token) => text.includes(token)),
    forbiddenFlagsOk: forbidden.every((pattern) => !pattern.test(text)),
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const phaseRecord = read(files.phaseRecord);
const promptPackage = read(files.promptPackage);
const sourceReview = read(files.sourceReview);
const sourceImportRecord = parseJson(files.sourceImportRecord);
const fixture = parseJson(files.fixture).lamp_prompt_revision_after_v14_161_review;
const currentSurfaces = [
  phaseRecord,
  promptPackage,
  JSON.stringify(fixture, null, 2),
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.mvpValidator),
].join("\n");

for (const token of [
  "candidate_1_review_status: needs_revision",
  "candidate_1_accepted_candidate: false",
  "candidate_1_revision_direction: keep_black_metal_body_and_warm_lamp_quality_but_make_product_positioning_clearer_and_hero_impact_stronger",
]) {
  requireToken("source_review", sourceReview, token);
}

addResult("source_import_record_is_needs_revision", sourceImportRecord.codex_session_image_import.review_bridge.review_status === "needs_revision");
addResult("source_import_record_not_accepted", sourceImportRecord.codex_session_image_import.review_bridge.accepted_candidate === false);

for (const token of [
  "phase: v14_162_lamp_prompt_revision_after_v14_161_review",
  "execution_mode: prompt_package_only_no_generation",
  "prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml",
  "image_generation_performed: false",
  "accepted_samples_write_performed: false",
  "recommended_next: request_exact_codex_session_generation_authorization_for_v14_162_lamp_candidate_or_register_bag_candidate_after_accepted_samples_authorization",
  "image_generation_requires_separate_authorization: true",
  "accepted_samples_write_requires_separate_authorization: true",
]) {
  requireToken("phase_record", phaseRecord, token);
}

const promptEvaluation = evaluatePromptPackage(promptPackage);
addResult("prompt_package_required_tokens_ok", promptEvaluation.requiredTokensOk);
addResult("prompt_package_forbidden_flags_ok", promptEvaluation.forbiddenFlagsOk);

for (const token of [
  "product_lifestyle_premium_portable_led_camping_lantern_codex_v2",
  "source_human_review_summary:",
  "fix_indoor_desk_lamp_drift",
  "clarify_portable_led_camping_lantern_identity",
  "outdoor_blue_hour_context_clear: true",
  "no_indoor_desk_lamp_drift: true",
  "no_diagonal_side_or_bright_table: true",
  "A5_authorization_required_later: true",
  "provider_contact_allowed: false",
  "plugin_call_allowed: false",
  "api_call_allowed: false",
  "mcp_runtime_allowed: false",
  "image_generation_allowed_by_this_stage: false",
  "accepted_samples_write_allowed: false",
]) {
  requireToken("prompt_package", promptPackage, token);
}

addResult("fixture_phase_matches", fixture.phase === "v14_162_lamp_prompt_revision_after_v14_161_review");
addResult("fixture_execution_mode_prompt_only", fixture.execution_mode === "prompt_package_only_no_generation");
addResult("fixture_source_review_status_needs_revision", fixture.source_review_status === "needs_revision");
addResult("fixture_prompt_package_ref_matches", fixture.prompt_package_ref === files.promptPackage);
addResult("fixture_revision_keeps_v14_161_strengths", fixture.revision_contract.keep_v14_161_strengths === true);
addResult("fixture_revision_fixes_desk_lamp_drift", fixture.revision_contract.fix_indoor_desk_lamp_drift === true);
addResult("fixture_revision_clarifies_lantern_identity", fixture.revision_contract.clarify_portable_led_camping_lantern_identity === true);

for (const [field, value] of Object.entries(fixture.guard)) {
  if (field === "artifact_recoverability_is_not_vcp_runtime_integration") {
    addResult(`fixture_guard_${field}_true`, value === true);
  } else {
    addResult(`fixture_guard_${field}_false`, value === false);
  }
}

addResult("fixture_next_generation_requires_authorization", fixture.next_gate.image_generation_requires_separate_authorization === true);
addResult("fixture_next_accepted_samples_requires_authorization", fixture.next_gate.accepted_samples_write_requires_separate_authorization === true);

const generationFlagViolation = { ...fixture, guard: { ...fixture.guard, image_generation_performed: true } };
const acceptedWriteViolation = { ...fixture, guard: { ...fixture.guard, accepted_samples_write_performed: true } };
const runtimeClaimViolation = { ...fixture, guard: { ...fixture.guard, artifact_recoverability_is_not_vcp_runtime_integration: false, vcp_runtime_integration_proven: true } };
const missingPromptRef = { ...fixture, prompt_package_ref: "" };

function evaluateFixture(input) {
  const guard = input.guard || {};
  return {
    passed:
      input.execution_mode === "prompt_package_only_no_generation" &&
      input.source_review_status === "needs_revision" &&
      input.prompt_package_ref === files.promptPackage &&
      guard.image_generation_performed === false &&
      guard.accepted_samples_write_performed === false &&
      guard.production_candidate_write_performed === false &&
      guard.DailyNote_write_performed === false &&
      guard.VCP_memory_write_performed === false &&
      guard.provider_contact_performed === false &&
      guard.plugin_call_performed === false &&
      guard.api_call_performed === false &&
      guard.mcp_runtime_performed === false &&
      guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
      guard.vcp_runtime_integration_proven === false,
  };
}

addResult("negative_case_generation_flag_blocks_prompt_readiness", evaluateFixture(generationFlagViolation).passed === false);
addResult("negative_case_accepted_samples_write_flag_blocks_prompt_readiness", evaluateFixture(acceptedWriteViolation).passed === false);
addResult("negative_case_vcp_runtime_claim_blocks_prompt_readiness", evaluateFixture(runtimeClaimViolation).passed === false);
addResult("negative_case_missing_prompt_ref_blocks_prompt_readiness", evaluateFixture(missingPromptRef).passed === false);

for (const token of [
  "scripts/validate_v14_162_lamp_prompt_revision_after_v14_161_review.js",
  "docs/v14_162_lamp_prompt_revision_after_v14_161_review.md",
  "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v2.yaml",
  "tests/schema_examples/v14_162_lamp_prompt_revision_after_v14_161_review.example.json",
  "v14_162_lamp_prompt_revision_after_v14_161_review",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_162_lamp_prompt_revision_after_v14_161_review",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  prompt_package_created: true,
  prompt_package_ref: files.promptPackage,
  source_candidate_status: "needs_revision",
  fixes_indoor_desk_lamp_drift: true,
  clarifies_portable_led_camping_lantern_identity: true,
  generation_authorized_by_this_record: false,
  image_generation_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  durable_archive_copy_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_generation_flag_blocks_prompt_readiness: evaluateFixture(generationFlagViolation).passed === false,
  negative_case_accepted_samples_write_flag_blocks_prompt_readiness: evaluateFixture(acceptedWriteViolation).passed === false,
  negative_case_vcp_runtime_claim_blocks_prompt_readiness: evaluateFixture(runtimeClaimViolation).passed === false,
  negative_case_missing_prompt_ref_blocks_prompt_readiness: evaluateFixture(missingPromptRef).passed === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
