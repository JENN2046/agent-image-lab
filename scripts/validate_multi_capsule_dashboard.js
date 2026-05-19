#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/P6_MULTI_CAPSULE_ACCEPTED_FAILURE_DASHBOARD_PRODUCTIZATION.md",
  snapshot: "tests/schema_examples/P6_MULTI_CAPSULE_ACCEPTED_FAILURE_DASHBOARD.example.json",
  app: "review_console/static_prototype/app.js",
  mock: "review_console/static_prototype/mock_data.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md"
};

const expected = {
  phase: "p6_multi_capsule_accepted_failure_dashboard_productization",
  acceptedIds: [
    "accepted_french_summer_rattan_bucket_bag_001",
    "accepted_product_still_life_tennis_wallet_001"
  ],
  failureId: "failure_french_summer_rattan_bag_v7_29_001",
  resolvedBy: "accepted_french_summer_rattan_bucket_bag_001",
  reportVersion: "accepted_failure_capsule_report_v1"
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

function includesAll(values, expectedValues) {
  return expectedValues.every((value) => Array.isArray(values) && values.includes(value));
}

function evaluate(snapshot) {
  const guard = snapshot.guard || {};
  const reportShape = snapshot.future_registry_report_shape || {};
  const failurePlan = snapshot.failure_track_expansion_plan || {};
  const perSample = snapshot.per_sample_report || [];
  const relations = snapshot.resolved_by_links || [];
  const relation = relations.find((item) => item.failure_sample_id === expected.failureId);

  const identityOk =
    snapshot.phase === expected.phase &&
    snapshot.snapshot_status === "golden_static_snapshot" &&
    snapshot.source_static_mock_ref === "review_console/static_prototype/mock_data.js#portable_preview_capsule_evidence_list+portable_failure_capsule_evidence_list" &&
    snapshot.source_static_app_ref === "review_console/static_prototype/app.js#multiCapsuleDashboardState" &&
    snapshot.execution_mode === "review_console_static_multi_capsule_dashboard_only" &&
    snapshot.draft_output_key === "multi_capsule_dashboard_state";

  const countOk =
    snapshot.accepted_capsule_count === 2 &&
    snapshot.failure_capsule_count === 1 &&
    snapshot.total_capsule_count === 3 &&
    includesAll(snapshot.accepted_sample_ids, expected.acceptedIds) &&
    includesAll(snapshot.failure_sample_ids, [expected.failureId]);

  const validationOk =
    includesAll(snapshot.clone_portable_statuses, ["passed"]) &&
    includesAll(snapshot.accepted_registry_statuses, ["registry_driven_preview_capsules_verified"]) &&
    includesAll(snapshot.failure_registry_statuses, ["failure_sample_capsules_verified"]) &&
    snapshot.old_runs_source_required_for_portable_validation === false &&
    snapshot.old_runs_source_as_long_term_evidence === false &&
    snapshot.directory_as_registry_currently_sufficient === true;

  const relationOk =
    relations.length >= 1 &&
    relation &&
    relation.accepted_sample_id === expected.resolvedBy &&
    relation.relation_status === "linked" &&
    relation.failure_final_route === "failure_learning_only_never_production" &&
    relation.accepted_is_reusable_positive_example === true &&
    relation.failure_is_never_production === true;

  const perSampleOk =
    perSample.length === 3 &&
    expected.acceptedIds.every((sampleId) => perSample.some((row) =>
      row.lane === "accepted" &&
      row.sample_id === sampleId &&
      row.registry_validator_status === "registry_driven_preview_capsules_verified" &&
      row.clone_portable_validation_status === "passed" &&
      row.passed === true
    )) &&
    perSample.some((row) =>
      row.lane === "failure" &&
      row.sample_id === expected.failureId &&
      row.resolved_by_accepted_sample === expected.resolvedBy &&
      row.final_route === "failure_learning_only_never_production" &&
      row.registry_validator_status === "failure_sample_capsules_verified" &&
      row.clone_portable_validation_status === "passed" &&
      row.passed === true
    );

  const reportShapeOk =
    reportShape.report_version === expected.reportVersion &&
    reportShape.total === 3 &&
    reportShape.passed === 3 &&
    reportShape.failed === 0 &&
    includesAll(reportShape.fields, [
      "lane",
      "sample_id",
      "registry_validator_status",
      "clone_portable_validation_status",
      "failure_class_summary",
      "resolved_by_links"
    ]) &&
    snapshot.failure_class_summary?.accepted_failed === 0 &&
    snapshot.failure_class_summary?.failure_failed === 0 &&
    snapshot.failure_class_summary?.missing_resolved_by_link === 0 &&
    snapshot.failure_class_summary?.production_or_memory_guard_violation === 0;

  const failurePlanOk =
    failurePlan.next_capsule_creation_allowed_now === false &&
    failurePlan.second_failure_capsule_requires_separate_authorization === true &&
    includesAll(failurePlan.candidate_selection_criteria, [
      "source failure has review record",
      "source failure has failure tags",
      "source failure has a useful accepted resolution link"
    ]) &&
    includesAll(failurePlan.required_authorization_fields, [
      "sample_id",
      "source_image",
      "target_capsule_root",
      "allowed_write_paths",
      "validation_commands",
      "stop_conditions"
    ]);

  const noWrites =
    guard.static_dashboard_only === true &&
    guard.mock_in_memory_only === true &&
    guard.fetch_performed === false &&
    guard.file_write_performed === false &&
    guard.asset_archive_read_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.preview_creation_or_copy_performed === false &&
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
    passed: Boolean(identityOk && countOk && validationOk && relationOk && perSampleOk && reportShapeOk && failurePlanOk && noWrites && noExternal),
    identityOk,
    countOk,
    validationOk,
    relationOk: Boolean(relationOk),
    perSampleOk,
    reportShapeOk,
    failurePlanOk,
    noWrites,
    noExternal
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).multi_capsule_dashboard_snapshot;
const app = core.read(files.app);
const mock = core.read(files.mock);
const index = core.read(files.index);
const styles = core.read(files.styles);
const readme = core.read(files.readme);
const fieldMapping = core.read(files.fieldMapping);
const phaseRecord = core.read(files.phaseRecord);
const currentSurfaces = [
  Object.values(files).join("\n"),
  phaseRecord,
  JSON.stringify(snapshot, null, 2),
  app,
  mock,
  index,
  styles,
  readme,
  fieldMapping,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff))
].join("\n");

const baseEval = evaluate(snapshot);
addResult("multi_capsule_dashboard_snapshot_evaluation_passes", baseEval.passed);

const wrongCount = clone(snapshot);
wrongCount.accepted_capsule_count = 1;
const missingRelation = clone(snapshot);
missingRelation.resolved_by_links = [];
const oldRunsRequired = clone(snapshot);
oldRunsRequired.old_runs_source_required_for_portable_validation = true;
const nextFailureAllowed = clone(snapshot);
nextFailureAllowed.failure_track_expansion_plan.next_capsule_creation_allowed_now = true;
nextFailureAllowed.failure_track_expansion_plan.second_failure_capsule_requires_separate_authorization = false;
const providerClaim = clone(snapshot);
providerClaim.guard.provider_contact_performed = true;
const runtimeClaim = clone(snapshot);
runtimeClaim.guard.runtime_execution_performed = true;
runtimeClaim.guard.vcp_runtime_integration_proven = true;

const wrongCountEval = evaluate(wrongCount);
const missingRelationEval = evaluate(missingRelation);
const oldRunsRequiredEval = evaluate(oldRunsRequired);
const nextFailureAllowedEval = evaluate(nextFailureAllowed);
const providerClaimEval = evaluate(providerClaim);
const runtimeClaimEval = evaluate(runtimeClaim);

addResult("negative_case_accepted_count_drift_fails", wrongCountEval.passed === false && wrongCountEval.countOk === false);
addResult("negative_case_missing_relation_fails", missingRelationEval.passed === false && missingRelationEval.relationOk === false);
addResult("negative_case_old_runs_required_fails", oldRunsRequiredEval.passed === false && oldRunsRequiredEval.validationOk === false);
addResult("negative_case_second_failure_creation_allowed_fails", nextFailureAllowedEval.passed === false && nextFailureAllowedEval.failurePlanOk === false);
addResult("negative_case_provider_contact_claim_fails", providerClaimEval.passed === false && providerClaimEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noExternal === false);

for (const token of [
  "multiCapsuleDashboardState",
  "renderMultiCapsuleDashboard",
  "multi_capsule_dashboard_state: multiCapsuleDashboardState()",
  "future_registry_report_shape",
  "failure_track_expansion_plan",
  "resolved_by_links"
]) {
  requireToken("app", app, token);
}

for (const token of [
  "multi-capsule-dashboard",
  "multiCapsuleSummary",
  "multiCapsuleReport",
  "multiCapsuleRelations",
  "multiCapsuleGuard"
]) {
  requireToken("index", index, token);
}

for (const token of [
  "multi-capsule-card",
  "multi-capsule-report",
  "multi-capsule-relations"
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  ...expected.acceptedIds,
  expected.failureId,
  expected.resolvedBy,
  "portable_preview_capsule_evidence_list",
  "portable_failure_capsule_evidence_list"
]) {
  requireToken("mock", mock, token);
}

for (const token of [
  "P6",
  "multi_capsule_dashboard_state",
  "accepted_failure_capsule_report_v1",
  "failure_french_summer_rattan_bag_v7_29_001",
  "accepted_french_summer_rattan_bucket_bag_001"
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_multi_capsule_dashboard",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: snapshot.phase,
  snapshot_status: snapshot.snapshot_status,
  draft_output_key: snapshot.draft_output_key,
  accepted_capsule_count: snapshot.accepted_capsule_count,
  failure_capsule_count: snapshot.failure_capsule_count,
  total_capsule_count: snapshot.total_capsule_count,
  relation_count: snapshot.resolved_by_links.length,
  linked_relation_count: snapshot.resolved_by_links.filter((item) => item.relation_status === "linked").length,
  old_runs_source_required_for_portable_validation: snapshot.old_runs_source_required_for_portable_validation,
  directory_as_registry_currently_sufficient: snapshot.directory_as_registry_currently_sufficient,
  report_version: snapshot.future_registry_report_shape.report_version,
  report_passed: snapshot.future_registry_report_shape.passed,
  report_failed: snapshot.future_registry_report_shape.failed,
  next_capsule_creation_allowed_now: snapshot.failure_track_expansion_plan.next_capsule_creation_allowed_now,
  second_failure_capsule_requires_separate_authorization: snapshot.failure_track_expansion_plan.second_failure_capsule_requires_separate_authorization,
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
