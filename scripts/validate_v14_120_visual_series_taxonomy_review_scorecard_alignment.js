#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  reviewScoreExample: "tests/schema_examples/review_score.example.yaml",
  assetStatusTaxonomy: "docs/review_console_asset_status_taxonomy.md",
  canonicalLoopModel: "docs/visual_production_loop_canonical_model.md",
  lanternCodexPrompt: "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v1.yaml",
  womensSeriesReview: "docs/v14_104_codex_session_womens_fashion_three_outfit_first_round_review.md",
  womensFinalReview: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  acceptedCategory: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  promptArtifactAudit: "docs/v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.md",
  phaseRecord: "docs/v14_120_visual_series_taxonomy_review_scorecard_alignment.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_120_visual_series_taxonomy_review_scorecard_alignment.js",
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

function assertNoForbiddenTrue(label, text) {
  const forbiddenTruePatterns = [
    /provider_contact_performed:\s+true/i,
    /plugin_call_performed:\s+true/i,
    /api_call_performed:\s+true/i,
    /mcp_runtime_performed:\s+true/i,
    /image_generation_performed:\s+true/i,
    /DailyNote_write_performed:\s+true/i,
    /VCP_memory_write_performed:\s+true/i,
    /accepted_samples_write_performed:\s+true/i,
    /failure_samples_write_performed:\s+true/i,
    /production_candidate_created:\s+true/i,
    /real_manifest_read_performed:\s+true/i,
    /real_vcpchat_read_performed:\s+true/i,
    /real_vcptoolbox_read_performed:\s+true/i,
    /output_file_write_performed:\s+true/i,
  ];
  for (const pattern of forbiddenTruePatterns) {
    addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
  }
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, fileExists(relativePath), relativePath);
}

const reviewScore = read(files.reviewScoreExample);
for (const token of [
  "review_score:",
  "total_score:",
  "breakdown:",
  "composition:",
  "subject_clarity:",
  "style_consistency:",
  "premium_quality:",
  "detail_control:",
  "color_light:",
  "iteration_potential:",
  "asset_value:",
  "human_review_note_cn:",
]) {
  requireToken("review_score_example", reviewScore, token);
}

const assetTaxonomy = read(files.assetStatusTaxonomy);
for (const token of [
  "generated_pending_review",
  "needs_revision",
  "rejected",
  "accepted_candidate",
  "accepted_final",
  "archived_reference_only",
  "human_score:",
  "product_fidelity_result:",
  "composition_result:",
  "artifact_result:",
  "memory_suitability_status:",
  "provider_contacted: false",
  "plugin_called: false",
  "image_generated: false",
  "accepted_samples_written: false",
  "DailyNote_written: false",
  "VCP_memory_written: false",
]) {
  requireToken("asset_status_taxonomy", assetTaxonomy, token);
}

const canonical = read(files.canonicalLoopModel);
for (const token of [
  "`HumanReview`",
  "`AcceptedCandidate`",
  "`MemorySuitabilityDecision`",
  "`PromptPackage` is not `GenerationAuthorization`.",
  "`AcceptedCandidate` is not `commercial_delivery_ready`.",
  "`MemorySuitabilityDecision` is not `memory_write`.",
  "No object in this model authorizes provider contact",
]) {
  requireToken("canonical_loop_model", canonical, token);
}

const lanternPrompt = read(files.lanternCodexPrompt);
for (const token of [
  "shot_role: premium_outdoor_lifestyle_hero_product_shot",
  "commercial_goal: commercially usable square ecommerce hero main image",
  "hero_selling_points:",
  "acceptance_criteria:",
  "human_review_checklist:",
  "Is the image a true 1:1 square hero frame?",
  "Does the blue-hour background support the product without dominating?",
  "codex_session_generation_direct_user_request_sufficient_now: true",
  "provider_contact_allowed: false",
  "image_generation_by_project_script_allowed: false",
  "accepted_samples_write_allowed: false",
]) {
  requireToken("lantern_codex_prompt", lanternPrompt, token);
}

const womensSeriesReview = read(files.womensSeriesReview);
for (const token of [
  "asset_role: womens_fashion_lookbook_square_hero_series",
  "commuter_tailored_suit:",
  "outdoor_technical:",
  "resort_relaxed_knit:",
  "Outfit Checklist",
  "clothing_first_visual: pass",
  "background_secondary: pass",
  "candidate_status:",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
]) {
  requireToken("womens_series_review", womensSeriesReview, token);
}

const womensFinalReview = read(files.womensFinalReview);
for (const token of [
  "asset_role: womens_fashion_lookbook_square_hero_final_candidate",
  "decision: final_visual_candidate_pass",
  "fixed_1_to_1_square_frame: pass",
  "adult_model_only: pass",
  "clothing_first_visual: pass",
  "resort_relaxed_direction_clear: pass",
  "knit_texture_visible: pass",
  "trouser_pleats_and_drape_visible: pass",
  "background_secondary: pass",
  "final_candidate_status: pass",
]) {
  requireToken("womens_final_review", womensFinalReview, token);
}

const acceptedRegistry = read(files.acceptedRegistry);
for (const token of [
  "sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001",
  "category: fashion_lookbook_portrait",
  "square_hero_portrait",
  "acceptance_summary:",
  "adult_model_only: pass",
  "clothing_first_visual: pass",
  "resort_relaxed_direction_clear: pass",
  "knit_texture_visible: pass",
  "trouser_pleats_and_drape_visible: pass",
  "background_secondary: pass",
  "no_text_logo_watermark: pass",
  "commercial_usability: pass",
  "memory_suitability: false",
  "write_to_memory_allowed: false",
  "daily_note_write_allowed: false",
]) {
  requireToken("accepted_registry", acceptedRegistry, token);
}
requireToken("accepted_category", read(files.acceptedCategory), "accepted_womens_resort_relaxed_knit_codex_v2_001");
requireToken("prompt_artifact_audit", read(files.promptArtifactAudit), "visual_series_taxonomy_and_review_scorecard_alignment");

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
  "visual_series_taxonomy_review_scorecard_aligned: true",
  "fashion_lookbook_portrait_scorecard_fields_verified: true",
  "product_hero_prompt_review_checklist_verified: true",
  "accepted_samples_acceptance_summary_mapped: true",
  "review_console_asset_status_taxonomy_verified: true",
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
  validator: "validate_v14_120_visual_series_taxonomy_review_scorecard_alignment",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  visual_series_taxonomy_review_scorecard_aligned: passed,
  fashion_lookbook_portrait_scorecard_fields_verified: passed,
  product_hero_prompt_review_checklist_verified: passed,
  accepted_samples_acceptance_summary_mapped: passed,
  review_console_asset_status_taxonomy_verified: passed,
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
