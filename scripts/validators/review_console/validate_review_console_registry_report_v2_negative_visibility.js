#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("../../lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "../../..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/P6I_REVIEW_CONSOLE_REGISTRY_REPORT_V2_NEGATIVE_VISIBILITY.md",
  sourceDesign: "docs/P6G_REGISTRY_REPORT_V2_NEGATIVE_STATE_DESIGN.md",
  snapshot: "tests/schema_examples/P6I_REVIEW_CONSOLE_REGISTRY_REPORT_V2_NEGATIVE_VISIBILITY.example.json",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md"
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).review_console_registry_report_v2_negative_visibility_snapshot;
const app = core.read(files.app);
const index = core.read(files.index);
const styles = core.read(files.styles);
const readme = core.read(files.readme);
const fieldMapping = core.read(files.fieldMapping);
const phaseRecord = core.read(files.phaseRecord);
const sourceDesign = core.read(files.sourceDesign);

const identityOk =
  snapshot.phase === "p6i_review_console_registry_report_v2_negative_visibility" &&
  snapshot.snapshot_status === "golden_static_snapshot" &&
  snapshot.source_validator_phase === "p6g_registry_report_v2_negative_state_design" &&
  snapshot.source_static_app_ref === "review_console/static_prototype/app.js#registryReportV2NegativeVisibilityState" &&
  snapshot.execution_mode === "review_console_static_registry_report_v2_negative_visibility_only" &&
  snapshot.draft_output_key === "registry_report_v2_negative_visibility_state" &&
  snapshot.status === "negative_states_visible_fail_closed";

const countsOk =
  snapshot.baseline_totals.accepted === 2 &&
  snapshot.baseline_totals.failure === 2 &&
  snapshot.baseline_totals.total === 4 &&
  snapshot.baseline_totals.passed === 4 &&
  snapshot.baseline_totals.failed === 0 &&
  snapshot.scenario_count === 4 &&
  snapshot.negative_state_classes.length === 4 &&
  snapshot.scenarios.length === 4;

const classesOk = [
  "accepted_registry_failed",
  "failure_registry_failed",
  "missing_resolved_by_link",
  "production_or_memory_guard_violation"
].every((name) => snapshot.negative_state_classes.includes(name));

const contractOk =
  snapshot.fail_closed_contract.report_can_stay_green === false &&
  snapshot.fail_closed_contract.relation_can_be_hidden === false &&
  snapshot.fail_closed_contract.guard_violation_can_be_summarized_away === false &&
  snapshot.fail_closed_contract.synthetic_visibility_only === true;

const guard = snapshot.guard || {};
const noWrites =
  guard.static_negative_state_view_only === true &&
  guard.derived_from_static_capsule_mock === true &&
  guard.validator_runtime_executed_in_browser === false &&
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

addResult("negative_visibility_snapshot_identity_ok", identityOk);
addResult("negative_visibility_snapshot_counts_ok", countsOk);
addResult("negative_visibility_snapshot_classes_ok", classesOk);
addResult("negative_visibility_snapshot_contract_ok", contractOk);
addResult("negative_visibility_snapshot_no_writes", noWrites);
addResult("negative_visibility_snapshot_no_external", noExternal);

for (const token of [
  "registryReportV2NegativeVisibilityState",
  "renderRegistryReportV2NegativeVisibility",
  "registry_report_v2_negative_visibility_state: registryReportV2NegativeVisibilityState()"
]) {
  requireToken("app", app, token);
}

for (const token of [
  "registry-report-v2-negative-dashboard",
  "registryReportV2NegativeSummary",
  "registryReportV2NegativeRows",
  "registryReportV2NegativeGuard"
]) {
  requireToken("index", index, token);
}

for (const token of [
  "registry-report-v2-negative-list",
  "registry-report-v2-negative-card"
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "P6I",
  "registry_report_v2_negative_visibility_state",
]) {
  requireToken("readme", readme, token);
  requireToken("field_mapping", fieldMapping, token);
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "accepted_registry_failed",
  "failure_registry_failed",
  "missing_resolved_by_link",
  "production_or_memory_guard_violation"
]) {
  requireToken("readme", readme, token);
  requireToken("field_mapping", fieldMapping, token);
  requireToken("phase_record", phaseRecord, token);
  requireToken("source_design", sourceDesign, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_review_console_registry_report_v2_negative_visibility",
  version: "v1",
  passed,
  phase: snapshot.phase,
  draft_output_key: snapshot.draft_output_key,
  scenario_count: snapshot.scenario_count,
  negative_state_class_count: snapshot.negative_state_classes.length,
  report_can_stay_green: snapshot.fail_closed_contract.report_can_stay_green,
  relation_can_be_hidden: snapshot.fail_closed_contract.relation_can_be_hidden,
  guard_violation_can_be_summarized_away: snapshot.fail_closed_contract.guard_violation_can_be_summarized_away,
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
