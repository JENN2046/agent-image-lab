#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const validators = [
  ["v14_141_recoverability_core_extraction", "scripts/validate_v14_141_recoverability_core_extraction.js"],
  ["v14_142_multi_accepted_sample_matrix", "scripts/validate_v14_142_multi_accepted_sample_matrix.js"],
  ["v14_143_import_review_registry_schema_hardening", "scripts/validate_v14_143_import_review_registry_schema_hardening.js"],
  ["v14_144_review_console_schema_binding", "scripts/validate_v14_144_review_console_schema_binding.js"],
  ["v14_145_sample_lifecycle_state_machine", "scripts/validate_v14_145_sample_lifecycle_state_machine.js"],
  ["v14_146_durable_archive_dry_run_manifest", "scripts/validate_v14_146_durable_archive_dry_run_manifest.js"],
  ["v14_147_production_candidate_eligibility_preflight", "scripts/validate_v14_147_production_candidate_eligibility_preflight.js"],
  ["v14_148_memory_delta_draft_package", "scripts/validate_v14_148_memory_delta_draft_package.js"],
  ["v14_149_authorization_package_compiler", "scripts/validate_v14_149_authorization_package_compiler.js"],
];

function runValidator(phase, script) {
  try {
    const stdout = execFileSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
    const parsed = JSON.parse(stdout);
    return {
      phase,
      script,
      exit_zero: true,
      passed: parsed.passed === true,
      failed_count: parsed.failed_count || 0,
      check_count: parsed.check_count || parsed.results?.length || 0,
    };
  } catch (error) {
    return {
      phase,
      script,
      exit_zero: false,
      passed: false,
      error: error.message,
    };
  }
}

const validatorResults = validators.map(([phase, script]) => runValidator(phase, script));
const failed = validatorResults.filter((result) => result.passed !== true);
const summary = {
  suite_id: "v14_150_local_regression_suite_consolidation",
  version: "v1",
  passed: failed.length === 0,
  validator_count: validatorResults.length,
  passed_count: validatorResults.length - failed.length,
  failed_count: failed.length,
  validators: validatorResults,
  output_file_write_performed: false,
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
  push_tag_release_deploy_performed: false,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(summary.passed ? 0 : 1);
