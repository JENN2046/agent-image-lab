#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_150_local_regression_suite_consolidation.md",
  suiteSchema: "schemas/local_regression_suite.schema.yaml",
  suiteManifest: "tests/schema_examples/v14_150_local_regression_suite_manifest.example.yaml",
  runner: "scripts/run_v14_local_regression_suite.js",
  currentValidator: "scripts/validate_v14_150_local_regression_suite_consolidation.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const requiredPhases = [
  "v14_141_recoverability_core_extraction",
  "v14_142_multi_accepted_sample_matrix",
  "v14_143_import_review_registry_schema_hardening",
  "v14_144_review_console_schema_binding",
  "v14_145_sample_lifecycle_state_machine",
  "v14_146_durable_archive_dry_run_manifest",
  "v14_147_production_candidate_eligibility_preflight",
  "v14_148_memory_delta_draft_package",
  "v14_149_authorization_package_compiler",
];

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

function runSuite() {
  return JSON.parse(execFileSync(process.execPath, [files.runner], { cwd: root, encoding: "utf8" }));
}

function evaluateSuite(suite) {
  const phases = Array.isArray(suite.validators) ? suite.validators.map((item) => item.phase) : [];
  const allRequiredPresent = requiredPhases.every((phase) => phases.includes(phase));
  const allPassed = Array.isArray(suite.validators) && suite.validators.every((item) => item.exit_zero === true && item.passed === true);
  const noSideEffects =
    suite.output_file_write_performed === false &&
    suite.provider_contact_performed === false &&
    suite.plugin_call_performed === false &&
    suite.api_call_performed === false &&
    suite.mcp_runtime_performed === false &&
    suite.image_generation_performed === false &&
    suite.real_manifest_read_performed === false &&
    suite.real_vcpchat_read_performed === false &&
    suite.real_vcptoolbox_read_performed === false &&
    suite.accepted_samples_write_performed === false &&
    suite.failure_samples_write_performed === false &&
    suite.production_candidate_write_performed === false &&
    suite.daily_note_write_performed === false &&
    suite.vcp_memory_write_performed === false &&
    suite.push_tag_release_deploy_performed === false;
  return {
    passed: suite.passed === true && suite.validator_count === 9 && suite.failed_count === 0 && allRequiredPresent && allPassed && noSideEffects,
    allRequiredPresent,
    allPassed,
    noSideEffects,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const schema = core.read(files.suiteSchema);
const manifest = core.read(files.suiteManifest);
const runner = core.read(files.runner);
const currentSurfaces = [
  phaseRecord,
  schema,
  manifest,
  runner,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");

for (const token of [
  "local_regression_suite:",
  "suite_id: v14_150_local_regression_suite_consolidation",
  "execution_mode: local_validator_runner_only",
  "output_mode: stdout_json",
  "output_file_write_allowed: false",
]) {
  requireToken("suite_schema", schema, token);
  requireToken("suite_manifest", manifest, token);
}

for (const phase of requiredPhases) {
  requireToken("suite_schema", schema, phase);
  requireToken("suite_manifest", manifest, phase);
  requireToken("runner_source", runner, phase);
}

let suite = null;
try {
  suite = runSuite();
  addResult("suite_runner_outputs_json", suite.suite_id === "v14_150_local_regression_suite_consolidation");
} catch (error) {
  addResult("suite_runner_outputs_json", false, error.message);
  suite = { validators: [] };
}

const suiteEvaluation = evaluateSuite(suite);
addResult("suite_validator_count_is_nine", suite.validator_count === 9, `${suite.validator_count}`);
addResult("suite_all_required_phases_present", suiteEvaluation.allRequiredPresent);
addResult("suite_all_children_passed", suiteEvaluation.allPassed);
addResult("suite_has_no_side_effect_flags", suiteEvaluation.noSideEffects);
addResult("suite_evaluation_passes", suiteEvaluation.passed, JSON.stringify(suiteEvaluation));

const missingValidator = evaluateSuite({ ...suite, validators: suite.validators.slice(0, 8), validator_count: 8 });
const childFailure = evaluateSuite({
  ...suite,
  passed: false,
  failed_count: 1,
  validators: suite.validators.map((item, index) => (index === 0 ? { ...item, passed: false } : item)),
});
const outputWrite = evaluateSuite({ ...suite, output_file_write_performed: true });
const externalAction = evaluateSuite({ ...suite, provider_contact_performed: true });

addResult("negative_case_missing_validator_blocks_suite", missingValidator.passed === false && missingValidator.allRequiredPresent === false);
addResult("negative_case_child_failure_blocks_suite", childFailure.passed === false && childFailure.allPassed === false);
addResult("negative_case_output_file_write_blocks_suite", outputWrite.passed === false && outputWrite.noSideEffects === false);
addResult("negative_case_external_action_flag_blocks_suite", externalAction.passed === false && externalAction.noSideEffects === false);

for (const token of [
  "phase: v14_150_local_regression_suite_consolidation",
  "local_regression_suite_consolidated: true",
  "validator_count: 9",
  "passed_count: 9",
  "failed_count: 0",
  "output_file_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/run_v14_local_regression_suite.js",
  "scripts/validate_v14_150_local_regression_suite_consolidation.js",
  "docs/v14_150_local_regression_suite_consolidation.md",
  "schemas/local_regression_suite.schema.yaml",
  "tests/schema_examples/v14_150_local_regression_suite_manifest.example.yaml",
  "v14_150_local_regression_suite_consolidation",
  "local_regression_suite_consolidated: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_150_local_regression_suite_consolidation",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  local_regression_suite_consolidated: true,
  validator_count: suite.validator_count || 0,
  passed_count: suite.passed_count || 0,
  child_failed_count: suite.failed_count || 0,
  suite_runner_passed: suite.passed === true,
  negative_case_missing_validator_blocks_suite: missingValidator.passed === false && missingValidator.allRequiredPresent === false,
  negative_case_child_failure_blocks_suite: childFailure.passed === false && childFailure.allPassed === false,
  negative_case_output_file_write_blocks_suite: outputWrite.passed === false && outputWrite.noSideEffects === false,
  negative_case_external_action_flag_blocks_suite: externalAction.passed === false && externalAction.noSideEffects === false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  output_file_write_performed: false,
  push_tag_release_deploy_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
