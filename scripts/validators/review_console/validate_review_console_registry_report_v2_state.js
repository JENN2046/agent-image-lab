#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("../../lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "../../..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/P6C_REVIEW_CONSOLE_REGISTRY_REPORT_V2_STATE.md",
  sourceReport: "docs/P6B_CAPSULE_REGISTRY_REPORT_V2.md",
  snapshot: "tests/schema_examples/P6C_REVIEW_CONSOLE_REGISTRY_REPORT_V2_STATE.example.json",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  reportValidator: "scripts/validate_capsule_registry_report_v2.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md"
};

const expected = {
  phase: "p6c_review_console_registry_report_v2_state",
  reportVersion: "accepted_failure_capsule_registry_report_v2",
  relations: [
    {
      failureId: "failure_french_summer_rattan_bag_v7_29_001",
      acceptedId: "accepted_french_summer_rattan_bucket_bag_001"
    },
    {
      failureId: "failure_tennis_wallet_v7_21_001",
      acceptedId: "accepted_product_still_life_tennis_wallet_001"
    }
  ]
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function currentBoardBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function evaluate(snapshot) {
  const guard = snapshot.guard || {};
  const totals = snapshot.totals || {};
  const relations = snapshot.resolved_by_links || [];
  const summary = snapshot.failure_class_summary || {};

  const identityOk =
    snapshot.phase === expected.phase &&
    snapshot.snapshot_status === "golden_static_snapshot" &&
    snapshot.source_validator_phase === "p6b_capsule_registry_report_v2" &&
    snapshot.source_static_app_ref === "review_console/static_prototype/app.js#registryReportV2State" &&
    snapshot.execution_mode === "review_console_static_registry_report_v2_state_only" &&
    snapshot.draft_output_key === "registry_report_v2_state" &&
    snapshot.report_version === expected.reportVersion &&
    snapshot.status === "accepted_failure_capsule_registry_report_v2_verified";

  const countsOk =
    totals.accepted === 3 &&
    totals.failure === 2 &&
    totals.total === 5 &&
    totals.passed === 5 &&
    totals.failed === 0;

  const relationOk =
    relations.length >= 2 &&
    expected.relations.every((expectedRelation) => {
      const relation = relations.find((item) => item.failure_sample_id === expectedRelation.failureId);
      return relation &&
        relation.accepted_sample_id === expectedRelation.acceptedId &&
        relation.relation_status === "linked" &&
        relation.failure_final_route === "failure_learning_only_never_production" &&
        relation.accepted_is_reusable_positive_example === true &&
        relation.failure_is_never_production === true;
    });

  const summaryOk =
    summary.accepted_failed === 0 &&
    summary.failure_failed === 0 &&
    summary.missing_resolved_by_link === 0 &&
    summary.production_or_memory_guard_violation === 0;

  const noWrites =
    guard.static_report_view_only === true &&
    guard.derived_from_static_capsule_mock === true &&
    guard.validator_output_represented === true &&
    guard.old_runs_source_required_for_portable_validation === false &&
    guard.fetch_performed === false &&
    guard.file_write_performed === false &&
    guard.asset_archive_read_performed === false &&
    guard.preview_loaded_or_rendered === false &&
    guard.preview_creation_or_copy_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.image_generation_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.runtime_execution_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && countsOk && relationOk && summaryOk && noWrites && noExternal,
    identityOk,
    countsOk,
    relationOk,
    summaryOk,
    noWrites,
    noExternal
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).review_console_registry_report_v2_state_snapshot;
const app = core.read(files.app);
const index = core.read(files.index);
const styles = core.read(files.styles);
const readme = core.read(files.readme);
const fieldMapping = core.read(files.fieldMapping);
const currentSurfaces = [
  JSON.stringify(snapshot, null, 2),
  ...Object.values(files).filter((file) => core.exists(file)).map((file) => {
    const text = core.read(file);
    return file.startsWith(".agent_board/") ? currentBoardBlock(text) : text;
  })
].join("\n");

const baseEval = evaluate(snapshot);
addResult("registry_report_v2_state_snapshot_evaluation_passes", baseEval.passed);

const wrongCount = clone(snapshot);
wrongCount.totals.accepted = 1;
const missingRelation = clone(snapshot);
missingRelation.resolved_by_links = [];
const oldRunsRequired = clone(snapshot);
oldRunsRequired.guard.old_runs_source_required_for_portable_validation = true;
const fileReadClaim = clone(snapshot);
fileReadClaim.guard.asset_archive_read_performed = true;
const runtimeClaim = clone(snapshot);
runtimeClaim.guard.runtime_execution_performed = true;
runtimeClaim.guard.vcp_runtime_integration_proven = true;

addResult("negative_case_count_drift_fails", evaluate(wrongCount).countsOk === false);
addResult("negative_case_missing_relation_fails", evaluate(missingRelation).relationOk === false);
addResult("negative_case_old_runs_required_fails", evaluate(oldRunsRequired).noWrites === false);
addResult("negative_case_asset_archive_read_claim_fails", evaluate(fileReadClaim).noWrites === false);
addResult("negative_case_runtime_claim_fails", evaluate(runtimeClaim).noExternal === false);

for (const token of [
  "registryReportV2State",
  "renderRegistryReportV2State",
  "registry_report_v2_state: registryReportV2State()",
  "accepted_failure_capsule_registry_report_v2",
  "p6b_capsule_registry_report_v2"
]) {
  requireToken("app", app, token);
}

for (const token of [
  "registry-report-v2-dashboard",
  "registryReportV2Summary",
  "registryReportV2Rows",
  "registryReportV2Relations",
  "registryReportV2Guard"
]) {
  requireToken("index", index, token);
}

for (const token of [
  "registry-report-v2-card",
  "registry-report-v2-list",
  "registry-report-v2-relations"
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "P6C",
  "registry_report_v2_state",
  "scripts/validate_review_console_registry_report_v2_state.js",
  "accepted_failure_capsule_registry_report_v2",
  "failure_french_summer_rattan_bag_v7_29_001",
  "accepted_french_summer_rattan_bucket_bag_001",
  "failure_tennis_wallet_v7_21_001",
  "accepted_product_still_life_tennis_wallet_001"
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_review_console_registry_report_v2_state",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: snapshot.phase,
  draft_output_key: snapshot.draft_output_key,
  report_version: snapshot.report_version,
  accepted_count: snapshot.totals.accepted,
  failure_count: snapshot.totals.failure,
  total_count: snapshot.totals.total,
  passed_count: snapshot.totals.passed,
  failed_count_total: snapshot.totals.failed,
  relation_count: snapshot.resolved_by_links.length,
  old_runs_source_required_for_portable_validation: snapshot.guard.old_runs_source_required_for_portable_validation,
  fetch_performed: snapshot.guard.fetch_performed,
  file_write_performed: snapshot.guard.file_write_performed,
  asset_archive_read_performed: snapshot.guard.asset_archive_read_performed,
  preview_loaded_or_rendered: snapshot.guard.preview_loaded_or_rendered,
  preview_creation_or_copy_performed: snapshot.guard.preview_creation_or_copy_performed,
  provider_contact_performed: snapshot.guard.provider_contact_performed,
  plugin_call_performed: snapshot.guard.plugin_call_performed,
  api_call_performed: snapshot.guard.api_call_performed,
  image_generation_performed: snapshot.guard.image_generation_performed,
  DailyNote_write_performed: snapshot.guard.DailyNote_write_performed,
  VCP_memory_write_performed: snapshot.guard.VCP_memory_write_performed,
  runtime_execution_performed: snapshot.guard.runtime_execution_performed,
  real_manifest_read_performed: snapshot.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: snapshot.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: snapshot.guard.real_vcptoolbox_read_performed,
  production_candidate_write_performed: snapshot.guard.production_candidate_write_performed,
  push_tag_release_deploy_performed: snapshot.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: snapshot.guard.vcp_runtime_integration_proven,
  results,
  errors
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
