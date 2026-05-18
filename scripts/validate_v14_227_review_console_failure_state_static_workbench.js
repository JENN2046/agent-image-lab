#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_227_review_console_failure_state_static_workbench.md",
  fixture: "tests/schema_examples/v14_227_review_console_failure_state_static_workbench.example.json",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_227_review_console_failure_state_static_workbench",
  executionMode: "review_console_static_failure_state_only",
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

function evaluate(panel) {
  const guard = panel.guard || {};
  const records = panel.records || [];
  const memoryForbidden = records.filter((record) => record.memory_forbidden === true);
  const neverProduction = records.filter((record) => record.never_production === true);
  const productionExclusions = records.filter((record) => record.production_exclusion_record_id);

  const identityOk =
    panel.phase === expected.phase &&
    panel.execution_mode === expected.executionMode &&
    panel.draft_output_key === expected.draftOutputKey &&
    panel.source_negative_review_report_ref === "review_console/static_prototype/mock_data.js#review_report_negative_guard_static_handoff" &&
    panel.source_adapter_negative_ref === "review_console/static_prototype/mock_data.js#review_evidence_blocker_adapter_negative_static_handoff";

  const failureStateOk =
    panel.failure_candidate_count === 2 &&
    records.length === 2 &&
    panel.memory_forbidden_count === 1 &&
    memoryForbidden.length === 1 &&
    panel.never_production_count === 2 &&
    neverProduction.length === 2 &&
    panel.production_exclusion_count === 2 &&
    productionExclusions.length === 2 &&
    panel.failure_samples_state === "static_review_only_not_written" &&
    panel.failure_samples_write_allowed === false &&
    panel.failure_samples_write_performed === false &&
    records.every((record) => record.review_outcome === "reject" && record.writes_allowed_now_count === 0) &&
    records.some((record) => Array.isArray(record.unknown_failure_tags) && record.unknown_failure_tags.length > 0 && record.memory_forbidden === true);

  const noWrites =
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

const fixture = core.parseJson(files.fixture).review_console_failure_state_static_workbench;
const phaseRecord = core.read(files.phaseRecord);
const app = core.read(files.app);
const index = core.read(files.index);
const styles = core.read(files.styles);
const readme = core.read(files.readme);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  app,
  index,
  styles,
  readme,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(fixture);
addResult("failure_state_static_workbench_evaluation_passes", baseEval.passed);

const missingFailure = clone(fixture);
missingFailure.records = missingFailure.records.slice(0, 1);
missingFailure.failure_candidate_count = 1;
const missingMemoryForbidden = clone(fixture);
missingMemoryForbidden.memory_forbidden_count = 0;
missingMemoryForbidden.records[1].memory_forbidden = false;
missingMemoryForbidden.memory_forbidden_candidate_ids = [];
const failureWrite = clone(fixture);
failureWrite.failure_samples_write_allowed = true;
failureWrite.failure_samples_write_performed = true;
failureWrite.guard.failure_samples_write_performed = true;
const productionWrite = clone(fixture);
productionWrite.guard.production_candidate_write_performed = true;
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.failure_state_is_not_failure_samples_registry_write = false;

const missingFailureEval = evaluate(missingFailure);
const missingMemoryForbiddenEval = evaluate(missingMemoryForbidden);
const failureWriteEval = evaluate(failureWrite);
const productionWriteEval = evaluate(productionWrite);
const externalActionEval = evaluate(externalAction);
const runtimeClaimEval = evaluate(runtimeClaim);

addResult("negative_case_missing_failure_record_fails", missingFailureEval.passed === false && missingFailureEval.failureStateOk === false);
addResult("negative_case_missing_memory_forbidden_fails", missingMemoryForbiddenEval.passed === false && missingMemoryForbiddenEval.failureStateOk === false);
addResult("negative_case_failure_samples_write_flag_fails", failureWriteEval.passed === false && failureWriteEval.noWrites === false);
addResult("negative_case_production_write_flag_fails", productionWriteEval.passed === false && productionWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "failureStateStaticWorkbenchState",
  "renderFailureStateStaticWorkbench",
  "failure_state_static_workbench_state: failureStateStaticWorkbenchState()",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "failure-state-workbench",
  "failureStateSummary",
  "failureStateBody",
  "failureStateGuard",
]) {
  requireToken("index", index, token);
}

for (const token of [
  "failure-state-body",
  "failure-state-card",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "v14.227",
  "failure_state_static_workbench_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "v14_227_review_console_failure_state_static_workbench",
  "docs/v14_227_review_console_failure_state_static_workbench.md",
  "tests/schema_examples/v14_227_review_console_failure_state_static_workbench.example.json",
  "scripts/validate_v14_227_review_console_failure_state_static_workbench.js",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_227_review_console_failure_state_static_workbench",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: fixture.phase,
  draft_output_key: fixture.draft_output_key,
  execution_mode: fixture.execution_mode,
  failure_candidate_count: fixture.failure_candidate_count,
  memory_forbidden_count: fixture.memory_forbidden_count,
  never_production_count: fixture.never_production_count,
  production_exclusion_count: fixture.production_exclusion_count,
  failure_samples_write_allowed: fixture.failure_samples_write_allowed,
  failure_samples_write_performed: fixture.failure_samples_write_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  mcp_runtime_performed: fixture.guard.mcp_runtime_performed,
  image_generation_performed: fixture.guard.image_generation_performed,
  env_or_secret_read_performed: fixture.guard.env_or_secret_read_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: fixture.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: fixture.guard.vcp_runtime_integration_proven,
  negative_case_missing_failure_record_fails: missingFailureEval.passed === false && missingFailureEval.failureStateOk === false,
  negative_case_missing_memory_forbidden_fails: missingMemoryForbiddenEval.passed === false && missingMemoryForbiddenEval.failureStateOk === false,
  negative_case_failure_samples_write_flag_fails: failureWriteEval.passed === false && failureWriteEval.noWrites === false,
  negative_case_production_write_flag_fails: productionWriteEval.passed === false && productionWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
