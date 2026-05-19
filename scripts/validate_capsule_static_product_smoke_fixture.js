#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);
const fixtureRef = "tests/schema_examples/CAPSULE_STATIC_PRODUCT_SMOKE_UNIFIED_CONTRACT.example.json";

function runJson(relativePath) {
  const result = spawnSync(process.execPath, [core.repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8"
  });
  return {
    exitCode: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    parsed: result.stdout.trim() ? JSON.parse(result.stdout.trim()) : null
  };
}

const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });

const fixture = core.parseJsonIfExists(fixtureRef);
const reportRun = runJson("scripts/validate_capsule_registry_report_v2.js");
const report = reportRun.parsed;
const contract = fixture?.unified_capsule_contract_report;
const fixtureSampleIds = (contract?.samples || []).map((sample) => sample.sample_id).sort();
const reportSampleIds = (report?.per_sample_results || []).map((sample) => sample.sample_id).sort();
const catalogLabels = (contract?.reviewer_action_catalog || []).map((item) => item.label);
const failClosedLabels = (contract?.reviewer_action_catalog || []).filter((item) => item.state === "fail_closed").map((item) => item.label);

add("fixture_exists", Boolean(fixture), fixtureRef);
add("fixture_phase_matches", fixture?.phase === "capsule_static_product_smoke_fixture_gate", fixture?.phase);
add("fixture_key_matches", fixture?.draft_output_key === "unified_capsule_contract_report", fixture?.draft_output_key);
add("registry_report_validator_passes", reportRun.exitCode === 0 && report?.passed === true, report?.status);
add("fixture_totals_match_report", contract?.totals?.accepted === report?.totals?.accepted && contract?.totals?.failure === report?.totals?.failure && contract?.totals?.total === report?.totals?.total && contract?.totals?.passed === report?.totals?.passed && contract?.totals?.failed === report?.totals?.failed, { fixture: contract?.totals, report: report?.totals });
add("fixture_preserves_2x2_baseline", contract?.totals?.accepted === 2 && contract?.totals?.failure === 2 && contract?.totals?.total === 4, contract?.totals);
add("fixture_sample_ids_match_report", JSON.stringify(fixtureSampleIds) === JSON.stringify(reportSampleIds), { fixtureSampleIds, reportSampleIds });
add("fixture_contract_status_matches_report", contract?.contract_status?.registry_passed === report?.contract_status?.registry_passed && contract?.contract_status?.manifest_passed === report?.contract_status?.manifest_passed && contract?.contract_status?.relation_passed === report?.contract_status?.relation_passed && contract?.contract_status?.guard_passed === report?.contract_status?.guard_passed && contract?.contract_status?.overall_passed === report?.contract_status?.overall_passed, { fixture: contract?.contract_status, report: report?.contract_status });
add("fixture_samples_have_pass_reviewer_action", (contract?.samples || []).every((sample) => sample.reviewer_action === "accept_contract_baseline"), (contract?.samples || []).map((sample) => ({ sample_id: sample.sample_id, reviewer_action: sample.reviewer_action })));
add("fixture_has_fail_closed_reviewer_actions", ["inspect_manifest_failure", "repair_relation_link", "block_production_guard_violation", "rerun_local_validator_outside_ui"].every((label) => failClosedLabels.includes(label)), failClosedLabels);
add("fixture_has_pass_action_label", catalogLabels.includes("accept_contract_baseline"), catalogLabels);
add("fixture_guard_static_only", contract?.guard?.static_fixture_only === true && contract?.guard?.browser_runtime_validator_executed === false && contract?.guard?.asset_archive_ui_read_performed === false && contract?.guard?.preview_loaded_or_rendered === false, contract?.guard);
add("fixture_guard_no_external_or_production", contract?.guard?.provider_contact_performed === false && contract?.guard?.plugin_call_performed === false && contract?.guard?.api_call_performed === false && contract?.guard?.image_generation_performed === false && contract?.guard?.DailyNote_write_performed === false && contract?.guard?.VCP_memory_write_performed === false && contract?.guard?.runtime_execution_performed === false && contract?.guard?.real_vcpchat_read_performed === false && contract?.guard?.real_vcptoolbox_read_performed === false && contract?.guard?.production_candidate_write_performed === false, contract?.guard);

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_capsule_static_product_smoke_fixture",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0 ? "capsule_static_product_smoke_fixture_verified" : "capsule_static_product_smoke_fixture_failed",
  fixture_ref: fixtureRef,
  check_count: checks.length,
  failed_count: failed.length,
  accepted_count: contract?.totals?.accepted || 0,
  failure_count: contract?.totals?.failure || 0,
  total_count: contract?.totals?.total || 0,
  browser_runtime_validator_executed: false,
  asset_archive_ui_read_performed: false,
  preview_loaded_or_rendered: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  production_candidate_write_performed: false,
  checks,
  failures: failed
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
