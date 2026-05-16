#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packagePath = "kernel/review_decision_package.js";
const schemaPath = "schemas/review_decision_package.schema.yaml";
const examplePath = "tests/schema_examples/review_decision_package.example.json";
const defaultInputPath = "tests/schema_examples/review_result_protocol_input.example.json";
const negativeInputPath = "tests/schema_examples/review_result_protocol_negative_guard_input.example.json";

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

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) {
    errors.push({ check, detail: detail || "check failed" });
  }
}

function readFile(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function parseJson(relativePath) {
  return JSON.parse(readFile(relativePath));
}

function validateNoSensitiveMaterial(label, text) {
  const forbidden = [
    { id: "windows_absolute_path", pattern: /[A-Z]:[\\/]/ },
    { id: "private_key", pattern: /BEGIN [A-Z ]*PRIVATE KEY/ },
    { id: "env_file_reference", pattern: /\.env|config\.env/i },
    { id: "image_binary_reference", pattern: /\.(png|jpe?g|webp|gif|psd)\b/i },
    { id: "real_generation_run_path", pattern: /runs\/real_generation/i },
    { id: "accepted_samples_path", pattern: /accepted_samples\//i },
    { id: "external_url", pattern: /https?:\/\//i },
    { id: "real_manifest_ref", pattern: /real[_ -]?manifest/i },
    { id: "vcpchat_source_ref", pattern: /VCPChat source|real VCPChat/i },
    { id: "vcptoolbox_source_ref", pattern: /VCPToolBox source|real VCPToolBox/i },
  ];
  for (const rule of forbidden) {
    addResult(`${label}_${rule.id}_absent`, !rule.pattern.test(text), `${rule.pattern}`);
  }
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

function runPackageCli(inputPath, label) {
  const result = childProcess.spawnSync(process.execPath, [repoPath(packagePath), "--input", inputPath], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${label}_cli_exit_zero`, result.status === 0, result.stderr || result.stdout);
  addResult(`${label}_cli_stderr_empty`, result.stderr.trim() === "", result.stderr);
  if (result.status !== 0) return null;
  try {
    const parsed = JSON.parse(result.stdout);
    addResult(`${label}_cli_stdout_json_parseable`, true);
    validateNoSensitiveMaterial(`${label}_cli_stdout`, JSON.stringify(parsed));
    return parsed;
  } catch (error) {
    addResult(`${label}_cli_stdout_json_parseable`, false, error.message);
    return null;
  }
}

function validateSchema(schema) {
  for (const token of [
    "review_decision_package_version: v1",
    "accepted_sample_drafts:",
    "rejected_sample_drafts:",
    "memory_delta_drafts:",
    "memory_forbidden_records:",
    "production_exclusion_register:",
    "protocol_pass_is_not_production_approval: true",
    "every_never_production_candidate_blocked: true",
    "production_candidate_created: false",
    "direct_memory_write_performed: false",
    "output_channel: stdout",
  ]) {
    addResult(`schema_token_${token}_present`, schema.includes(token));
  }
  validateNoSensitiveMaterial("schema", schema);
}

function validateCommonPackage(pkg, label) {
  addResult(`${label}_version_v1`, pkg.review_decision_package_version === "v1");
  addResult(`${label}_status_completed`, pkg.status === "completed_local_decision_package");
  addResult(`${label}_mode_stdout_only`, pkg.mode === "local_stdout_only_review_decision_package");
  addResult(`${label}_candidate_records_present`, Array.isArray(pkg.candidate_decision_records));
  addResult(`${label}_accepted_drafts_array`, Array.isArray(pkg.accepted_sample_drafts));
  addResult(`${label}_rejected_drafts_array`, Array.isArray(pkg.rejected_sample_drafts));
  addResult(`${label}_memory_delta_drafts_array`, Array.isArray(pkg.memory_delta_drafts));
  addResult(`${label}_memory_forbidden_array`, Array.isArray(pkg.memory_forbidden_records));
  addResult(`${label}_production_exclusion_array`, Array.isArray(pkg.production_exclusion_register));

  addResult(
    `${label}_accepted_drafts_not_written`,
    pkg.accepted_sample_drafts.every((item) => item.write_performed === false && item.production_candidate === false)
  );
  addResult(
    `${label}_rejected_drafts_not_written`,
    pkg.rejected_sample_drafts.every((item) => item.write_performed === false && item.production_candidate === false)
  );
  addResult(
    `${label}_memory_drafts_are_chinese_draft_only`,
    pkg.memory_delta_drafts.every(
      (item) =>
        item.status === "draft" &&
        item.language === "zh-CN" &&
        item.direct_daily_note_write_allowed === false &&
        item.direct_vcp_memory_write_allowed === false &&
        item.direct_write_performed === false &&
        item.requires_human_memory_approval === true
    )
  );
  addResult(
    `${label}_memory_forbidden_not_allowed`,
    pkg.memory_forbidden_records.every(
      (item) => item.route === "forbidden" && item.allowed_to_enter_memory === false && item.direct_write_performed === false
    )
  );
  addResult(
    `${label}_production_exclusion_never_production`,
    pkg.production_exclusion_register.every(
      (item) => item.status === "never_production" && item.permanent_block === true && item.production_candidate === false
    )
  );

  const summary = pkg.decision_summary || {};
  addResult(`${label}_summary_direct_memory_write_false`, summary.direct_memory_write_performed === false);
  addResult(`${label}_summary_production_candidate_false`, summary.production_candidate_created === false);
  addResult(`${label}_summary_accepted_sample_write_false`, summary.accepted_samples_write_performed === false);

  const promotion = pkg.promotion_guard || {};
  addResult(`${label}_promotion_pass_not_approval`, promotion.protocol_pass_is_not_production_approval === true);
  addResult(`${label}_promotion_never_production_blocked`, promotion.every_never_production_candidate_blocked === true);
  addResult(`${label}_promotion_creation_allowed_false`, promotion.production_candidate_creation_allowed === false);
  addResult(`${label}_promotion_created_false`, promotion.production_candidate_created === false);
  addResult(`${label}_promotion_memory_write_without_approval_false`, promotion.memory_write_allowed_without_human_approval === false);
  addResult(`${label}_promotion_direct_memory_write_false`, promotion.direct_memory_write_performed === false);

  for (const flag of [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "daily_note_write_performed",
    "vcp_memory_write_performed",
    "image_generation_performed",
    "output_file_write_performed",
    "accepted_samples_write_performed",
    "external_manifest_read_performed",
    "vcpchat_source_read_performed",
    "vcptoolbox_source_read_performed",
  ]) {
    addResult(`${label}_no_execution_${flag}_false`, pkg.no_execution_guard?.[flag] === false);
  }

  validateNoSensitiveMaterial(label, JSON.stringify(pkg));
}

function validateDefaultPackage(pkg, label) {
  validateCommonPackage(pkg, label);
  addResult(`${label}_source_protocol_expected`, pkg.source_protocol_id === "review_result_protocol_hardening_v1");
  addResult(`${label}_summary_pass_count_one`, pkg.decision_summary?.pass_count === 1);
  addResult(`${label}_summary_reject_count_one`, pkg.decision_summary?.reject_count === 1);
  addResult(`${label}_accepted_sample_draft_count_one`, pkg.accepted_sample_drafts.length === 1);
  addResult(`${label}_rejected_sample_draft_count_one`, pkg.rejected_sample_drafts.length === 1);
  addResult(`${label}_memory_delta_count_two`, pkg.memory_delta_drafts.length === 2);
  addResult(`${label}_memory_forbidden_count_zero`, pkg.memory_forbidden_records.length === 0);
  addResult(`${label}_production_exclusion_count_one`, pkg.production_exclusion_register.length === 1);
  addResult(
    `${label}_reject_in_exclusion_register`,
    pkg.production_exclusion_register.some((item) => item.candidate_id === "candidate_reject_metadata_001")
  );
}

function validateNegativeGuardPackage(pkg) {
  validateCommonPackage(pkg, "negative_guard_package");
  addResult("negative_guard_source_protocol_expected", pkg.source_protocol_id === "review_result_protocol_negative_guard_v1");
  addResult("negative_guard_summary_pass_count_zero", pkg.decision_summary?.pass_count === 0);
  addResult("negative_guard_summary_reject_count_two", pkg.decision_summary?.reject_count === 2);
  addResult("negative_guard_accepted_sample_draft_count_zero", pkg.accepted_sample_drafts.length === 0);
  addResult("negative_guard_rejected_sample_draft_count_two", pkg.rejected_sample_drafts.length === 2);
  addResult("negative_guard_memory_delta_count_one", pkg.memory_delta_drafts.length === 1);
  addResult("negative_guard_memory_forbidden_count_one", pkg.memory_forbidden_records.length === 1);
  addResult("negative_guard_production_exclusion_count_two", pkg.production_exclusion_register.length === 2);
  addResult(
    "negative_guard_unknown_memory_forbidden_recorded",
    pkg.memory_forbidden_records.some((item) => item.candidate_id === "candidate_reject_unknown_guard_001")
  );
  addResult(
    "negative_guard_all_rejected_never_production_registered",
    ["candidate_reject_mapped_guard_001", "candidate_reject_unknown_guard_001"].every((id) =>
      pkg.production_exclusion_register.some((item) => item.candidate_id === id)
    )
  );
}

for (const file of [packagePath, schemaPath, examplePath, defaultInputPath, negativeInputPath]) {
  addResult(`${file}_exists`, fs.existsSync(repoPath(file)), file);
}

runNodeCheck(packagePath);
runNodeCheck("scripts/validate_review_decision_package.js");

try {
  validateSchema(readFile(schemaPath));
} catch (error) {
  addResult("schema_readable", false, error.message);
}

try {
  validateDefaultPackage(parseJson(examplePath), "example");
} catch (error) {
  addResult("example_parseable", false, error.message);
}

const defaultPackage = runPackageCli(defaultInputPath, "default_package");
if (defaultPackage) {
  validateDefaultPackage(defaultPackage, "default_package");
}

const negativeGuardPackage = runPackageCli(negativeInputPath, "negative_guard_package");
if (negativeGuardPackage) {
  validateNegativeGuardPackage(negativeGuardPackage);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_review_decision_package",
  version: "v1",
  passed,
  files_checked: [packagePath, schemaPath, examplePath, defaultInputPath, negativeInputPath],
  check_count: results.length,
  failed_count: errors.length,
  review_decision_package: {
    package_cli_present: fs.existsSync(repoPath(packagePath)),
    schema_present: fs.existsSync(repoPath(schemaPath)),
    example_present: fs.existsSync(repoPath(examplePath)),
    stdout_only: true,
    accepted_sample_drafts_verified: true,
    rejected_sample_drafts_verified: true,
    memory_delta_drafts_verified: true,
    memory_forbidden_records_verified: true,
    production_exclusion_register_verified: true,
    negative_guard_memory_forbidden_verified: true,
    negative_guard_never_production_register_verified: true,
    no_direct_memory_write_verified: true,
    no_production_candidate_created_verified: true,
    external_network_required: false,
    external_service_required: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    output_file_write_performed: false,
  },
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
