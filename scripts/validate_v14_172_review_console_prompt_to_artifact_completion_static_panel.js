#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_172_review_console_prompt_to_artifact_completion_static_panel.md",
  fixture: "tests/schema_examples/v14_172_review_console_prompt_to_artifact_completion_static_panel.example.json",
  reader: "review_console/static_prototype/artifact_lifecycle_state_reader.js",
  index: "review_console/static_prototype/index.html",
  app: "review_console/static_prototype/app.js",
  mock: "review_console/static_prototype/mock_data.js",
  styles: "review_console/static_prototype/styles.css",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_172_review_console_lifecycle_state_prompt_to_artifact_completion_static_panel",
  lampId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evaluate(input) {
  const records = input.records || [];
  const guard = input.guard || {};
  const lamp = records.find((record) => record.sample_id === expected.lampId);
  const promptRefsOk = records.every((record) => typeof record.prompt_package_ref === "string" && record.prompt_package_ref.length > 0);
  const statusesOk = records.every((record) => ["review_complete", "pending_human_review"].includes(record.completion_status));
  const scoresOk = records.every((record) => Number.isInteger(record.completion_score) && record.completion_score >= 0 && record.completion_score <= 100);
  const summaryOk =
    input.summary?.record_count === 3 &&
    input.summary?.review_complete_count === 2 &&
    input.summary?.blocked_count === 1 &&
    input.summary?.average_completion_score === 84 &&
    input.summary?.hard_acceptance_three_full_samples_met === false;
  const lampBlocked =
    lamp &&
    lamp.completion_status === "pending_human_review" &&
    lamp.blocker === "human_approval_missing";
  const noWrites =
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false;
  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false;
  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: promptRefsOk && statusesOk && scoresOk && summaryOk && lampBlocked && noWrites && noExternal && noRuntimeClaim,
    promptRefsOk,
    statusesOk,
    scoresOk,
    summaryOk,
    lampBlocked,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_prompt_to_artifact_completion_static_panel;
const phaseRecord = core.read(files.phaseRecord);
const readerText = core.read(files.reader);
const indexText = core.read(files.index);
const appText = core.read(files.app);
const mockText = core.read(files.mock);
const stylesText = core.read(files.styles);
const mvpText = core.read(files.mvpValidator);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  mvpText,
].join("\n");

const baseEval = evaluate(fixture);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("completion_panel_evaluation_passes", baseEval.passed);

const missingPrompt = clone(fixture);
missingPrompt.records[0].prompt_package_ref = "";
const missingStatus = clone(fixture);
missingStatus.records[1].completion_status = "";
const lampWithoutBlocker = clone(fixture);
lampWithoutBlocker.records[2].blocker = null;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingPromptEval = evaluate(missingPrompt);
const missingStatusEval = evaluate(missingStatus);
const lampWithoutBlockerEval = evaluate(lampWithoutBlocker);
const acceptedWriteEval = evaluate(acceptedWrite);
const runtimeClaimEval = evaluate(runtimeClaim);

addResult("negative_case_missing_prompt_ref_fails", missingPromptEval.passed === false && missingPromptEval.promptRefsOk === false);
addResult("negative_case_missing_completion_status_fails", missingStatusEval.passed === false && missingStatusEval.statusesOk === false);
addResult("negative_case_lamp_without_blocker_fails", lampWithoutBlockerEval.passed === false && lampWithoutBlockerEval.lampBlocked === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "prompt_to_artifact_completion",
  "score:",
  "status:",
  "blocker:",
]) {
  requireToken("reader_or_mock", `${readerText}\n${mockText}`, token);
}

for (const token of [
  "artifactPromptCompletionSummary",
  "artifactPromptCompletionList",
  "artifactPromptCompletionGuard",
]) {
  requireToken("index", indexText, token);
}

for (const token of [
  "renderArtifactPromptCompletionPanel",
  "artifact_prompt_completion_state",
  "static_panel_only: true",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "artifact-prompt-completion-list",
  "artifact-prompt-completion-card",
]) {
  requireToken("styles", stylesText, token);
}

for (const token of [
  "scripts/validate_v14_172_review_console_prompt_to_artifact_completion_static_panel.js",
  "tests/schema_examples/v14_172_review_console_prompt_to_artifact_completion_static_panel.example.json",
  "docs/v14_172_review_console_prompt_to_artifact_completion_static_panel.md",
  "v14_172_review_console_lifecycle_state_prompt_to_artifact_completion_static_panel",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_172_review_console_prompt_to_artifact_completion_static_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  record_count: fixture.summary.record_count,
  review_complete_count: fixture.summary.review_complete_count,
  blocked_count: fixture.summary.blocked_count,
  average_completion_score: fixture.summary.average_completion_score,
  hard_acceptance_three_full_samples_met: fixture.summary.hard_acceptance_three_full_samples_met,
  static_panel_only: true,
  fetch_performed: false,
  file_write_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_prompt_ref_fails: missingPromptEval.passed === false && missingPromptEval.promptRefsOk === false,
  negative_case_missing_completion_status_fails: missingStatusEval.passed === false && missingStatusEval.statusesOk === false,
  negative_case_lamp_without_blocker_fails: lampWithoutBlockerEval.passed === false && lampWithoutBlockerEval.lampBlocked === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
