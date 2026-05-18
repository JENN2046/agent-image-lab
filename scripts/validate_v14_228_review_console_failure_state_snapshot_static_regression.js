#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_228_review_console_failure_state_snapshot_static_regression.md",
  snapshot: "tests/schema_examples/v14_228_review_console_failure_state_snapshot_static_regression.example.json",
  sourceWorkbench: "tests/schema_examples/v14_227_review_console_failure_state_static_workbench.example.json",
  sourceWorkbenchRecord: "docs/v14_227_review_console_failure_state_static_workbench.md",
  sourceValidator: "scripts/validate_v14_227_review_console_failure_state_static_workbench.js",
  app: "review_console/static_prototype/app.js",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_228_review_console_failure_state_snapshot_static_regression",
  sourcePhase: "v14_227_review_console_failure_state_static_workbench",
  sourceExecutionMode: "review_console_static_failure_state_only",
  executionMode: "review_console_static_failure_state_snapshot_only",
  draftOutputKey: "failure_state_static_workbench_state",
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

function evaluate(snapshot, source) {
  const guard = snapshot.guard || {};
  const records = snapshot.records || [];
  const sourceRecords = source.records || [];
  const memoryForbidden = records.filter((record) => record.memory_forbidden === true);
  const neverProduction = records.filter((record) => record.never_production === true);
  const productionExclusions = records.filter((record) => record.production_exclusion_record_id);

  const identityOk =
    snapshot.phase === expected.phase &&
    snapshot.snapshot_status === "golden_static_snapshot" &&
    snapshot.source_workbench_ref === files.sourceWorkbench &&
    snapshot.source_workbench_record_ref === files.sourceWorkbenchRecord &&
    snapshot.source_validator_ref === files.sourceValidator &&
    snapshot.source_execution_mode === expected.sourceExecutionMode &&
    snapshot.execution_mode === expected.executionMode &&
    snapshot.draft_output_key === expected.draftOutputKey &&
    source.phase === expected.sourcePhase &&
    source.execution_mode === expected.sourceExecutionMode &&
    source.draft_output_key === expected.draftOutputKey;

  const failureStateOk =
    snapshot.failure_candidate_count === 2 &&
    snapshot.failure_candidate_count === source.failure_candidate_count &&
    records.length === sourceRecords.length &&
    snapshot.memory_forbidden_count === 1 &&
    snapshot.memory_forbidden_count === source.memory_forbidden_count &&
    memoryForbidden.length === 1 &&
    snapshot.never_production_count === 2 &&
    snapshot.never_production_count === source.never_production_count &&
    neverProduction.length === 2 &&
    snapshot.production_exclusion_count === 2 &&
    snapshot.production_exclusion_count === source.production_exclusion_count &&
    productionExclusions.length === 2 &&
    snapshot.failure_samples_state === "static_review_only_not_written" &&
    snapshot.failure_samples_state === source.failure_samples_state &&
    snapshot.failure_samples_write_allowed === false &&
    snapshot.failure_samples_write_allowed === source.failure_samples_write_allowed &&
    snapshot.failure_samples_write_performed === false &&
    snapshot.failure_samples_write_performed === source.failure_samples_write_performed &&
    records.every((record) => record.review_outcome === "reject" && record.writes_allowed_now_count === 0) &&
    records.some((record) => Array.isArray(record.unknown_failure_tags) && record.unknown_failure_tags.length > 0 && record.memory_forbidden === true);

  const noWrites =
    guard.static_snapshot_only === true &&
    guard.local_static_workbench_only === true &&
    guard.fetch_performed === false &&
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.failure_state_is_not_failure_samples_registry_write === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && failureStateOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    failureStateOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).review_console_failure_state_snapshot_static_regression;
const source = core.parseJson(files.sourceWorkbench).review_console_failure_state_static_workbench;
const phaseRecord = core.read(files.phaseRecord);
const app = core.read(files.app);
const readme = core.read(files.readme);
const currentSurfaces = [
  Object.values(files).join("\n"),
  phaseRecord,
  JSON.stringify(snapshot, null, 2),
  app,
  readme,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(snapshot, source);
addResult("failure_state_snapshot_evaluation_passes", baseEval.passed);

const missingFailure = clone(snapshot);
missingFailure.records = missingFailure.records.slice(0, 1);
missingFailure.failure_candidate_count = 1;
const missingMemoryForbidden = clone(snapshot);
missingMemoryForbidden.memory_forbidden_count = 0;
missingMemoryForbidden.records[1].memory_forbidden = false;
missingMemoryForbidden.memory_forbidden_candidate_ids = [];
const failureWrite = clone(snapshot);
failureWrite.failure_samples_write_allowed = true;
failureWrite.failure_samples_write_performed = true;
failureWrite.guard.failure_samples_write_performed = true;
const productionWrite = clone(snapshot);
productionWrite.guard.production_candidate_write_performed = true;
const externalAction = clone(snapshot);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(snapshot);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.failure_state_is_not_failure_samples_registry_write = false;

const missingFailureEval = evaluate(missingFailure, source);
const missingMemoryForbiddenEval = evaluate(missingMemoryForbidden, source);
const failureWriteEval = evaluate(failureWrite, source);
const productionWriteEval = evaluate(productionWrite, source);
const externalActionEval = evaluate(externalAction, source);
const runtimeClaimEval = evaluate(runtimeClaim, source);

addResult("negative_case_failure_count_drift_fails", missingFailureEval.passed === false && missingFailureEval.failureStateOk === false);
addResult("negative_case_memory_forbidden_drift_fails", missingMemoryForbiddenEval.passed === false && missingMemoryForbiddenEval.failureStateOk === false);
addResult("negative_case_failure_samples_write_flag_fails", failureWriteEval.passed === false && failureWriteEval.noWrites === false);
addResult("negative_case_production_write_flag_fails", productionWriteEval.passed === false && productionWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "failureStateStaticWorkbenchState",
  "failure_state_static_workbench_state",
  "renderFailureStateStaticWorkbench",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "v14.228",
  "failure_state_static_workbench_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "v14_228_review_console_failure_state_snapshot_static_regression",
  "docs/v14_228_review_console_failure_state_snapshot_static_regression.md",
  "tests/schema_examples/v14_228_review_console_failure_state_snapshot_static_regression.example.json",
  "scripts/validate_v14_228_review_console_failure_state_snapshot_static_regression.js",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_228_review_console_failure_state_snapshot_static_regression",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: snapshot.phase,
  snapshot_status: snapshot.snapshot_status,
  draft_output_key: snapshot.draft_output_key,
  failure_candidate_count: snapshot.failure_candidate_count,
  memory_forbidden_count: snapshot.memory_forbidden_count,
  never_production_count: snapshot.never_production_count,
  production_exclusion_count: snapshot.production_exclusion_count,
  failure_samples_write_allowed: snapshot.failure_samples_write_allowed,
  failure_samples_write_performed: snapshot.failure_samples_write_performed,
  production_candidate_write_performed: snapshot.guard.production_candidate_write_performed,
  daily_note_write_performed: snapshot.guard.DailyNote_write_performed,
  vcp_memory_write_performed: snapshot.guard.VCP_memory_write_performed,
  provider_contact_performed: snapshot.guard.provider_contact_performed,
  plugin_call_performed: snapshot.guard.plugin_call_performed,
  api_call_performed: snapshot.guard.api_call_performed,
  mcp_runtime_performed: snapshot.guard.mcp_runtime_performed,
  image_generation_performed: snapshot.guard.image_generation_performed,
  env_or_secret_read_performed: snapshot.guard.env_or_secret_read_performed,
  real_manifest_read_performed: snapshot.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: snapshot.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: snapshot.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: snapshot.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: snapshot.guard.vcp_runtime_integration_proven,
  negative_case_failure_count_drift_fails: missingFailureEval.passed === false && missingFailureEval.failureStateOk === false,
  negative_case_memory_forbidden_drift_fails: missingMemoryForbiddenEval.passed === false && missingMemoryForbiddenEval.failureStateOk === false,
  negative_case_failure_samples_write_flag_fails: failureWriteEval.passed === false && failureWriteEval.noWrites === false,
  negative_case_production_write_flag_fails: productionWriteEval.passed === false && productionWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
