#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  schema: "schemas/local_review_record.schema.yaml",
  lanternReview: "docs/v14_103_codex_session_lantern_codex_v1_square_hero_candidate_review.md",
  womensSeriesReview: "docs/v14_104_codex_session_womens_fashion_three_outfit_first_round_review.md",
  womensFinalReview: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  codexReviewChainValidator: "scripts/validate_codex_session_review_chain.js",
  codexImportValidator: "scripts/validate_codex_session_image_import.js",
  promptGovernanceGate: "docs/v14_121_codex_session_prompt_package_library_governance.md",
  phaseRecord: "docs/v14_122_local_review_record_schema_refresh.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_122_local_review_record_schema_refresh.js",
};

const reviewRecords = [
  {
    id: "v14_103_lantern",
    path: files.lanternReview,
    decisionToken: "decision: internal_visual_pass_as_imported_candidate",
    reviewSection: "## Visual Review",
    checklistSection: "## Checklist",
    expectedRefs: [
      "prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v1.yaml",
      "import_record_ref: runs/real_generation/v14_103_codex_session_premium_portable_led_camping_lantern_codex_v1_square_hero_candidate/codex_session_image_import_record.json",
      "asset_ref: runs/real_generation/v14_103_codex_session_premium_portable_led_camping_lantern_codex_v1_square_hero_candidate/codex_session_lantern_codex_v1_square_hero_candidate.png",
    ],
  },
  {
    id: "v14_104_womens_series",
    path: files.womensSeriesReview,
    decisionToken: "overall_decision: first_round_series_candidate_pass",
    reviewSection: "## Series Review",
    checklistSection: "## Outfit Checklist",
    expectedRefs: [
      "output_directory_ref: runs/real_generation/v14_104_codex_session_womens_fashion_three_outfit_first_round_candidates/",
      "commuter_tailored_suit:",
      "outdoor_technical:",
      "resort_relaxed_knit:",
    ],
  },
  {
    id: "v14_105_womens_final",
    path: files.womensFinalReview,
    decisionToken: "decision: final_visual_candidate_pass",
    reviewSection: "## Final Review",
    checklistSection: "## Checklist",
    expectedRefs: [
      "source_first_round_asset: runs/real_generation/v14_104_codex_session_womens_fashion_three_outfit_first_round_candidates/codex_session_womens_resort_relaxed_knit_v1.png",
      "final_asset_ref: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png",
      "import_record_ref: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
    ],
  },
];

const scopeTokens = [
  "phase_id:",
  "asset_role:",
  "provider_id: codex_session_image",
  "project_script_generation: false",
  "MCP_runtime: false",
  "provider_API_call_by_project: false",
  "env_local_secret_value_read: false",
  "DailyNote_write: false",
  "VCP_memory_write: false",
  "accepted_samples_write: false",
  "production_candidate_write: false",
];

const reviewTokens = [
  "formal_acceptance_status: pending_human_review",
  "commercial_delivery_ready: false",
  "memory_suitability: deferred",
];

const boundaryTokens = [
  "codex_session_generation_used: true",
  "separate_A5_for_codex_session_generation_required_now: false",
  "project_provider_contact_performed: false",
  "project_plugin_call_performed: false",
  "project_api_call_performed: false",
  "image_generation_by_project_script_performed: false",
  "env_local_secret_value_read_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
  "push_tag_release_deploy_performed: false",
];

const nextGateTokens = [
  "recommended_next:",
  "automatic_next_generation_recommended: false",
  "accepted_samples_write_requires_separate_authorization: true",
  "production_candidate_write_requires_separate_authorization: true",
  "memory_write_requires_separate_authorization: true",
];

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
  const smartV3AmberReceiptPatterns = new Set([
    "provider_contact_performed:\\s+true",
    "plugin_call_performed:\\s+true",
    "api_call_performed:\\s+true",
    "image_generation_performed:\\s+true",
  ]);
  for (const pattern of forbiddenTruePatterns) {
    if (label === "current_surfaces" && smartV3AmberReceiptPatterns.has(pattern.source)) continue;
    addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
  }
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, fileExists(relativePath), relativePath);
}

const schema = read(files.schema);
for (const token of [
  "schema_id: local_review_record",
  "required_sections:",
  "required_scope_fields:",
  "required_review_fields:",
  "required_boundary_fields:",
  "required_next_gate_fields:",
  "no_execution_defaults:",
  "accepted_samples_write_allowed_by_schema: false",
  "failure_samples_write_allowed_by_schema: false",
  "production_candidate_write_allowed_by_schema: false",
  "DailyNote_write_allowed_by_schema: false",
  "VCP_memory_write_allowed_by_schema: false",
  "provider_api_plugin_mcp_allowed_by_schema: false",
  "real_manifest_vcpchat_vcptoolbox_read_allowed_by_schema: false",
]) {
  requireToken("schema", schema, token);
}

for (const review of reviewRecords) {
  const text = read(review.path);
  for (const token of ["## Scope", review.reviewSection, review.checklistSection, "## Boundary Review", "## Next Gate"]) {
    requireToken(review.id, text, token);
  }
  for (const token of [...scopeTokens, review.decisionToken, ...reviewTokens, ...boundaryTokens, ...nextGateTokens, ...review.expectedRefs]) {
    requireToken(review.id, text, token);
  }
}

requireToken("prompt_governance_gate", read(files.promptGovernanceGate), "local_review_record_schema_refresh");

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
  "local_review_record_schema_aligned: true",
  "codex_session_review_records_verified: true",
  "review_record_boundary_fields_verified: true",
  "review_record_next_gate_authorization_fields_verified: true",
  "review_record_schema_no_execution: true",
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
  validator: "validate_v14_122_local_review_record_schema_refresh",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  review_records_checked: reviewRecords.map((record) => record.path),
  check_count: results.length,
  failed_count: errors.length,
  local_review_record_schema_aligned: passed,
  codex_session_review_records_verified: passed,
  review_record_boundary_fields_verified: passed,
  review_record_next_gate_authorization_fields_verified: passed,
  review_record_schema_no_execution: passed,
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
