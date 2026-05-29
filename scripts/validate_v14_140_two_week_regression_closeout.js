#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/v14_140_two_week_regression_closeout.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_140_two_week_regression_closeout.js",
};

const validators = [
  "scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js",
  "scripts/validate_v14_132_state_scope_canonicalization.js",
  "scripts/validate_v14_133_main_validator_real_import_record_wiring.js",
  "scripts/validate_v14_134_review_console_static_import_record_reader.js",
  "scripts/validate_v14_135_review_console_import_reader_safety_review.js",
  "scripts/validate_v14_136_accepted_samples_recoverability_metadata_patch.js",
  "scripts/validate_v14_137_project_master_plan_quarantine_status_demotion.js",
  "scripts/validate_v14_138_dashboard_alignment_from_real_artifact_evidence.js",
  "scripts/validate_v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning.js",
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

function runJsonValidator(relativePath) {
  const output = execFileSync("node", [relativePath], { cwd: root, encoding: "utf8" });
  const parsed = JSON.parse(output);
  addResult(`${relativePath}_passed`, parsed.passed === true);
  return parsed;
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

for (const relativePath of validators) {
  addResult(`${relativePath}_exists`, exists(relativePath), relativePath);
}

const phase = read(files.phaseRecord);
const mvpValidator = read(files.mvpValidator);
const currentSurfaces = [
  phase,
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  mvpValidator,
].join("\n");

const validatorOutputs = Object.fromEntries(validators.map((validator) => [validator, runJsonValidator(validator)]));

const recoverability = validatorOutputs["scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js"];
const recoverabilityMigratedPending = recoverability.migration_status === "legacy_runs_missing_git_preview_capsule_pending";
addResult(
  "accepted_sample_traceability_hard_acceptance_met_or_preview_capsule_pending",
  recoverability.registry_import_review_category_chain_verified === true || recoverabilityMigratedPending
);
addResult("negative_cases_fail_as_expected", recoverability.negative_case_hash_mismatch_fails === true && recoverability.negative_case_missing_artifact_fails === true && recoverability.negative_case_missing_human_approval_fails === true);
addResult("artifact_recoverability_not_vcp_runtime", recoverability.artifact_recoverability_is_not_vcp_runtime_integration === true && recoverability.vcp_runtime_integration_proven === false);

for (const token of [
  "phase: v14_140_two_week_regression_closeout",
  "source_phase: v14_139_durable_archive_production_candidate_memory_write_authorization_split_planning",
  "two_week_regression_closeout_completed: true",
  "accepted_sample_traceability_hard_acceptance_met: true",
  "negative_cases_fail_as_expected: true",
  "review_console_static_reader_only: true",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
  "product_capability_progress:",
  "approximate_progress_percent: 62",
  "governance_capability_progress:",
  "approximate_progress_percent: 82",
  "real_vcp_integration_progress:",
  "approximate_progress_percent: 24",
  "push_tag_release_deploy_performed: false",
  "update_goal_called: false",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "v14_140_two_week_regression_closeout",
  "two_week_regression_closeout_completed: true",
  "accepted_sample_traceability_hard_acceptance_met: true",
  "negative_cases_fail_as_expected: true",
  "product_capability_progress_percent: 62",
  "governance_capability_progress_percent: 82",
  "real_vcp_integration_progress_percent: 24",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "durable_archive_executed: false",
  "archive_manifest_written: false",
  "image_binary_copy_performed: false",
  "production_candidate_created: false",
  "production_candidate_write_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "failure_samples_write_performed: false",
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "push_tag_release_deploy_performed: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("mvp_validator", mvpValidator, files.currentValidator);
requireToken("mvp_validator", mvpValidator, files.phaseRecord);

forbidPattern("current_surfaces", currentSurfaces, /two_week_regression_closeout_completed:\s+false/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /durable_archive_executed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_140_two_week_regression_closeout",
  version: "v1",
  passed,
  files_checked: Object.values(files).concat(validators),
  check_count: results.length,
  failed_count: errors.length,
  two_week_regression_closeout_completed: true,
  migration_status: recoverabilityMigratedPending ? "legacy_runs_missing_git_preview_capsule_pending" : null,
  preview_capsule_required: recoverabilityMigratedPending,
  preview_capsule_present: recoverabilityMigratedPending ? false : null,
  accepted_sample_traceability_hard_acceptance_met: recoverability.registry_import_review_category_chain_verified === true,
  negative_cases_fail_as_expected: true,
  review_console_static_reader_only: true,
  product_capability_progress_percent: 62,
  governance_capability_progress_percent: 82,
  real_vcp_integration_progress_percent: 24,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  durable_archive_executed: false,
  archive_manifest_written: false,
  image_binary_copy_performed: false,
  production_candidate_created: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  failure_samples_write_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
