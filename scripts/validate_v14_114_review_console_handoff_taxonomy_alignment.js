#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  handoff: "tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml",
  decisionPackage: "tests/schema_examples/review_decision_package.example.json",
  memoryDeltaRegister: "tests/schema_examples/review_report_memory_delta_draft_register.example.json",
  productionExclusionRegister: "tests/schema_examples/review_report_production_exclusion_register.example.json",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

for (const [label, relativePath] of Object.entries(files)) {
  addResult(`${label}_exists`, exists(relativePath), relativePath);
}

const handoff = readText(files.handoff);
const fieldMapping = readText(files.fieldMapping);
const decisionPackage = readJson(files.decisionPackage);
const memoryDeltaRegister = readJson(files.memoryDeltaRegister);
const productionExclusionRegister = readJson(files.productionExclusionRegister);

const acceptedDrafts = decisionPackage.accepted_sample_drafts || [];
const rejectedDrafts = decisionPackage.rejected_sample_drafts || [];
const memoryDrafts = decisionPackage.memory_delta_drafts || [];
const productionExclusions = productionExclusionRegister.exclusion_records || [];
const memoryRegisterDrafts = memoryDeltaRegister.memory_delta_draft_records || [];

addResult("handoff_is_display_only", handoff.includes("review_console_handoff_mapped: true") && handoff.includes("no_execution_guard_verified: true"));
addResult("handoff_allowed_actions_expected", [
  "mark_candidate",
  "reject_candidate",
  "request_gatekeeper_review",
  "request_memory_edit",
].every((value) => handoff.includes(value)));
addResult("handoff_forbidden_actions_expected", [
  "execute_plugin",
  "call_api",
  "write_daily_note",
  "save_image",
].every((value) => handoff.includes(value)));
addResult("static_field_mapping_mentions_memory_delta", fieldMapping.includes("memory_delta"));
addResult("static_field_mapping_mentions_review_session", fieldMapping.includes("review_session"));

addResult("decision_package_has_accepted_draft", acceptedDrafts.length === 1);
addResult("decision_package_has_rejected_draft", rejectedDrafts.length === 1);
addResult("decision_package_has_memory_drafts", memoryDrafts.length === 2);
addResult("decision_summary_counts_match", decisionPackage.decision_summary?.accepted_sample_draft_count === acceptedDrafts.length && decisionPackage.decision_summary?.rejected_sample_draft_count === rejectedDrafts.length && decisionPackage.decision_summary?.memory_delta_draft_count === memoryDrafts.length);
addResult("accepted_draft_no_write_no_production", acceptedDrafts.every((item) => item.write_performed === false && item.production_candidate === false));
addResult("rejected_draft_no_write_no_production", rejectedDrafts.every((item) => item.write_performed === false && item.production_candidate === false));
addResult("memory_drafts_no_direct_write", memoryDrafts.every((item) => item.direct_daily_note_write_allowed === false && item.direct_vcp_memory_write_allowed === false && item.direct_write_performed === false));
addResult("decision_package_no_execution", decisionPackage.no_execution_guard?.provider_contact_performed === false && decisionPackage.no_execution_guard?.plugin_call_performed === false && decisionPackage.no_execution_guard?.api_call_performed === false);
addResult("decision_package_no_accepted_sample_write", decisionPackage.decision_summary?.accepted_samples_write_performed === false);
addResult("decision_package_no_production_candidate", decisionPackage.decision_summary?.production_candidate_created === false);

addResult("memory_register_drafts_metadata_only", memoryDeltaRegister.register_summary?.all_drafts_metadata_only === true);
addResult("memory_register_no_memory_write", memoryDeltaRegister.register_summary?.no_direct_memory_write_performed === true && memoryDeltaRegister.register_summary?.daily_note_write_performed === false && memoryDeltaRegister.register_summary?.vcp_memory_write_performed === false);
addResult("memory_register_no_production", memoryDeltaRegister.register_summary?.production_candidate_created === false);
addResult("memory_register_failure_lesson_count", memoryDeltaRegister.register_summary?.failure_lesson_draft_count === 2);

addResult("production_exclusion_all_rejects_registered", productionExclusionRegister.register_summary?.all_rejects_registered === true);
addResult("production_exclusion_blocks_production", productionExclusionRegister.register_summary?.all_exclusions_block_production_forever === true && productionExclusionRegister.register_summary?.all_exclusions_block_production_candidate === true);
addResult("production_exclusion_blocks_accepted_samples", productionExclusionRegister.register_summary?.all_exclusions_block_accepted_samples === true);
addResult("production_exclusion_no_write", productionExclusionRegister.register_summary?.production_candidate_created === false && productionExclusionRegister.register_summary?.accepted_samples_write_performed === false);
addResult("production_exclusion_records_count", productionExclusions.length === productionExclusionRegister.register_summary?.exclusion_count);
addResult("memory_register_records_count", memoryRegisterDrafts.length === memoryDeltaRegister.register_summary?.memory_delta_draft_count);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_114_review_console_handoff_taxonomy_alignment",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  accepted_sample_draft_count: acceptedDrafts.length,
  rejected_sample_draft_count: rejectedDrafts.length,
  memory_delta_draft_count: memoryDrafts.length,
  production_exclusion_count: productionExclusions.length,
  review_console_display_only: true,
  runtime_integration_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
