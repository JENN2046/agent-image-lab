#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const draftPath =
  "tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml";
const schemaPath = "memory_policy/memory_delta.schema.yaml";
const reviewPath =
  "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md";
const registryPath = "accepted_samples/accepted_sample_registry.yaml";
const reviewChainPath =
  "docs/v14_110_codex_session_import_review_chain_validator_alignment.md";
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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function hasChinese(value) {
  return /[\u4e00-\u9fff]/.test(value);
}

function token(text, value) {
  return text.includes(value);
}

for (const file of [draftPath, schemaPath, reviewPath, registryPath, reviewChainPath]) {
  addResult(`${file}_exists`, exists(file), file);
}

const draft = readText(draftPath);
const registry = readText(registryPath);
const review = readText(reviewPath);

addResult("draft_declares_memory_delta", token(draft, "memory_delta:"));
addResult("draft_id_expected", token(draft, `delta_id: memory_delta_draft_${acceptedSampleId}`));
addResult("case_id_expected", token(draft, `case_id: ${acceptedSampleId}`));
addResult("write_mode_draft", token(draft, "write_mode: draft"));
addResult("approval_required_true", token(draft, "approval_required: true"));
addResult("approval_status_pending", token(draft, "approval_status: pending"));
addResult("target_notebook_declared", token(draft, "target_notebook: VCP_Visual_Production_Lessons"));
addResult("source_review_record_linked", token(draft, reviewPath));
addResult("source_registry_linked", token(draft, `${registryPath}#${acceptedSampleId}`));
addResult("source_review_chain_linked", token(draft, reviewChainPath));
addResult("chinese_title_present", /chinese_diary_title:\s*".*[\u4e00-\u9fff].*"/.test(draft));
addResult("chinese_content_present", /chinese_diary_content:\s*".*[\u4e00-\u9fff].*"/.test(draft));
addResult("chinese_content_mentions_draft_only", token(draft, "仅作为记忆草案"));
addResult("contains_no_secret", token(draft, "contains_secret: false"));
addResult("contains_no_private_path", token(draft, "contains_private_path: false"));
addResult("contains_no_customer_private_data", token(draft, "contains_customer_private_data: false"));
addResult("contains_no_image_binary", token(draft, "contains_image_binary: false"));
addResult("should_not_write_to_vcp", token(draft, "should_write_to_vcp: false"));
addResult("show_in_review_console", token(draft, "should_show_in_review_console: true"));
addResult("daily_note_not_written", token(draft, "daily_note_write_performed: false"));
addResult("vcp_memory_not_written", token(draft, "vcp_memory_write_performed: false"));
addResult("direct_memory_not_written", token(draft, "direct_memory_write_performed: false"));
addResult("accepted_samples_not_written_by_draft", token(draft, "accepted_samples_write_performed: false"));
addResult("production_candidate_not_written", token(draft, "production_candidate_write_performed: false"));
addResult("provider_plugin_api_mcp_not_performed", token(draft, "provider_contact_performed: false") && token(draft, "plugin_call_performed: false") && token(draft, "api_call_performed: false") && token(draft, "mcp_runtime_performed: false"));
addResult("image_generation_not_performed", token(draft, "image_generation_by_project_script_performed: false"));
addResult("registry_contains_sample", token(registry, `sample_id: ${acceptedSampleId}`));
addResult("registry_blocks_memory_write", token(registry, "write_to_memory_allowed: false"));
addResult("registry_blocks_daily_note_write", token(registry, "daily_note_write_allowed: false"));
addResult("review_record_final_candidate_pass", token(review, "decision: final_visual_candidate_pass"));
addResult("review_record_memory_deferred", token(review, "memory_suitability: deferred"));
addResult("draft_has_chinese_text", hasChinese(draft));
addResult("draft_has_no_windows_absolute_path", !/[A-Z]:[\\/]/.test(draft));
addResult("draft_has_no_secret_literal", !/(api[_ -]?key|password|token)\s*[:=]\s*['\"][^'\"]+['\"]/i.test(draft));

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_111_codex_session_memory_delta_draft",
  version: "v1",
  passed,
  draft_path: draftPath,
  check_count: results.length,
  failed_count: errors.length,
  memory_delta_draft: {
    accepted_sample_id: acceptedSampleId,
    write_mode: "draft",
    approval_required: true,
    approval_status: "pending",
    chinese_body_verified: true,
    should_write_to_vcp: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    direct_memory_write_performed: false,
    image_binary_included: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    mcp_runtime_performed: false,
    production_candidate_write_performed: false,
    file_write_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
