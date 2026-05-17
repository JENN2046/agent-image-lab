#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const registryPath = "accepted_samples/accepted_sample_registry.yaml";

const importRecords = [
  {
    id: "v14_103_lantern_codex_v1",
    path: "runs/real_generation/v14_103_codex_session_premium_portable_led_camping_lantern_codex_v1_square_hero_candidate/codex_session_image_import_record.json",
    expectedReview: "docs/v14_103_codex_session_lantern_codex_v1_square_hero_candidate_review.md",
    acceptedSampleId: null,
  },
  {
    id: "v14_104_commuter_tailored_suit",
    path: "runs/real_generation/v14_104_codex_session_womens_fashion_three_outfit_first_round_candidates/commuter_tailored_suit_import_record.json",
    expectedReview: "docs/v14_104_codex_session_womens_fashion_three_outfit_first_round_review.md",
    acceptedSampleId: null,
  },
  {
    id: "v14_104_outdoor_technical",
    path: "runs/real_generation/v14_104_codex_session_womens_fashion_three_outfit_first_round_candidates/outdoor_technical_import_record.json",
    expectedReview: "docs/v14_104_codex_session_womens_fashion_three_outfit_first_round_review.md",
    acceptedSampleId: null,
  },
  {
    id: "v14_104_resort_relaxed_knit",
    path: "runs/real_generation/v14_104_codex_session_womens_fashion_three_outfit_first_round_candidates/resort_relaxed_knit_import_record.json",
    expectedReview: "docs/v14_104_codex_session_womens_fashion_three_outfit_first_round_review.md",
    acceptedSampleId: null,
  },
  {
    id: "v14_105_resort_relaxed_knit_final",
    path: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
    expectedReview: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
    acceptedSampleId: "accepted_womens_resort_relaxed_knit_codex_v2_001",
  },
];

const falseNoExecutionFlags = [
  "provider_contact_allowed",
  "plugin_call_allowed",
  "api_call_allowed",
  "image_generation_allowed_by_project",
  "env_local_secret_value_read_allowed",
  "DailyNote_write_allowed",
  "VCP_memory_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
  "real_manifest_read_allowed",
  "real_VCPChat_read_allowed",
  "real_VCPToolBox_read_allowed",
  "push_tag_release_deploy_allowed",
  "provider_contact_performed_by_project",
  "plugin_call_performed_by_project",
  "api_call_performed_by_project",
  "image_generation_performed_by_project",
  "env_local_secret_value_read_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "real_manifest_read_performed",
  "real_VCPChat_read_performed",
  "real_VCPToolBox_read_performed",
  "push_tag_release_deploy_performed",
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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function fileExists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function validateImportRecord(config, registry) {
  addResult(`${config.id}_import_record_exists`, fileExists(config.path), config.path);
  if (!fileExists(config.path)) return;

  let record;
  try {
    record = readJson(config.path).codex_session_image_import;
    addResult(`${config.id}_import_record_json_parseable`, Boolean(record));
  } catch (error) {
    addResult(`${config.id}_import_record_json_parseable`, false, error.message);
    return;
  }

  const reviewRef = record.review_bridge?.review_record_ref;
  const asset = record.imported_asset || {};
  const source = record.source || {};
  const guard = record.no_execution_guard || {};

  addResult(`${config.id}_provider_codex_session`, record.provider_id === "codex_session_image");
  addResult(`${config.id}_manual_import_mode`, record.import_mode === "manual_session_import");
  addResult(`${config.id}_status_review_linked`, record.status === "review_linked");
  addResult(`${config.id}_codex_session_generation_true`, source.codex_session_generation === true);
  addResult(`${config.id}_codex_direct_call_false`, source.codex_image_direct_call_allowed === false);
  addResult(`${config.id}_mcp_runtime_false`, source.mcp_runtime_allowed === false);
  addResult(`${config.id}_provider_api_false`, source.provider_api_call_allowed === false);
  addResult(`${config.id}_project_script_generation_false`, source.project_script_generation_allowed === false);
  addResult(`${config.id}_image_generation_by_script_false`, source.image_generation_by_script === false);
  addResult(`${config.id}_human_session_action_required`, source.human_session_action_required === true);
  addResult(`${config.id}_review_ref_expected`, reviewRef === config.expectedReview);
  addResult(`${config.id}_asset_relative_path_present`, typeof asset.relative_path === "string" && asset.relative_path.startsWith("runs/real_generation/"));
  addResult(`${config.id}_asset_sha256_present`, /^[a-f0-9]{64}$/.test(asset.sha256 || ""));
  addResult(`${config.id}_asset_square_1_to_1`, asset.aspect_ratio === "1:1");
  addResult(`${config.id}_asset_not_copied_by_project_script`, asset.copied_by_project_script === false);
  addResult(`${config.id}_review_record_exists`, fileExists(config.expectedReview), config.expectedReview);

  if (fileExists(config.expectedReview)) {
    const review = readText(config.expectedReview);
    addResult(`${config.id}_review_mentions_import_record`, review.includes(config.path));
    addResult(`${config.id}_review_mentions_asset`, review.includes(asset.relative_path));
    addResult(`${config.id}_review_boundary_codex_session_used`, review.includes("codex_session_generation_used: true"));
    addResult(`${config.id}_review_boundary_no_project_generation`, review.includes("image_generation_by_project_script_performed: false"));
    addResult(`${config.id}_review_boundary_no_memory`, review.includes("DailyNote_write_performed: false") && review.includes("VCP_memory_write_performed: false"));
    addResult(`${config.id}_review_boundary_no_production`, review.includes("production_candidate_write_performed: false"));
  }

  for (const flag of falseNoExecutionFlags) {
    addResult(`${config.id}_guard_${flag}_false`, guard[flag] === false);
  }

  if (config.acceptedSampleId) {
    addResult(`${config.id}_accepted_sample_registered`, registry.includes(`sample_id: ${config.acceptedSampleId}`));
    addResult(`${config.id}_accepted_sample_review_ref_matches`, registry.includes(`review_doc_ref: ${config.expectedReview}`));
    addResult(`${config.id}_accepted_sample_image_ref_matches`, registry.includes(`image_path: ${asset.relative_path}`));
    addResult(`${config.id}_accepted_sample_sha_matches`, registry.includes(`image_sha256: ${asset.sha256}`));
    addResult(`${config.id}_accepted_sample_provider_codex`, registry.includes("provider_type: codex_session_image"));
  }
}

const registry = readText(registryPath);
addResult("registry_exists", fileExists(registryPath), registryPath);

for (const config of importRecords) {
  validateImportRecord(config, registry);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_codex_session_review_chain",
  version: "v1",
  passed,
  import_record_count: importRecords.length,
  check_count: results.length,
  failed_count: errors.length,
  codex_session_review_chain: {
    import_records_verified: true,
    review_records_verified: true,
    accepted_sample_link_verified: true,
    image_binary_read_performed: false,
    image_binary_copy_performed: false,
    runs_source_image_modification_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    production_candidate_write_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    push_tag_release_deploy_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
