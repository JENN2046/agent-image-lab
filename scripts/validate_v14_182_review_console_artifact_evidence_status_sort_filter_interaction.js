#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_182_review_console_artifact_evidence_status_sort_filter_interaction.md",
  fixture: "tests/schema_examples/v14_182_review_console_artifact_evidence_status_sort_filter_interaction.example.json",
  sourceSortFixture: "tests/schema_examples/v14_180_review_console_artifact_evidence_status_sort.example.json",
  app: "review_console/static_prototype/app.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_182_review_console_artifact_evidence_status_sort_filter_interaction_static_only",
  draftKey: "artifact_evidence_status_sort_filter_interaction_state",
  sourceSortKey: "artifact_evidence_status_sort_state",
  lampArtifactId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
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

function byFilter(input, filter) {
  return (input.filter_results || []).find((item) => item.filter === filter) || {};
}

function evaluate(input, sourceSort) {
  const guard = input.guard || {};
  const all = byFilter(input, "all");
  const recoverable = byFilter(input, "recoverable");
  const blocked = byFilter(input, "blocked");
  const interactionOk =
    input.draft_output_key === expected.draftKey &&
    input.source_sort_key === expected.sourceSortKey &&
    input.sort_mode === sourceSort.sort_mode &&
    input.local_filter_only === true &&
    input.all_filter_blocked_candidate_first === true &&
    all.first_visible_artifact_id === expected.lampArtifactId &&
    JSON.stringify(all.visible_artifact_ids) === JSON.stringify(sourceSort.sorted_artifact_ids) &&
    input.recoverable_filter_excludes_blocked_candidate === true &&
    recoverable.visible_count === 2 &&
    !recoverable.visible_artifact_ids.includes(expected.lampArtifactId) &&
    input.blocked_filter_only_blocked_candidate === true &&
    blocked.visible_count === 1 &&
    JSON.stringify(blocked.visible_artifact_ids) === JSON.stringify([expected.lampArtifactId]);
  const noWrites =
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false;
  const noExternal =
    guard.fetch_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;
  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;
  return {
    passed: interactionOk && noWrites && noExternal && noRuntimeClaim,
    interactionOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_artifact_evidence_status_sort_filter_interaction;
const sourceSort = core.parseJson(files.sourceSortFixture).review_console_artifact_evidence_status_sort;
const phaseRecord = core.read(files.phaseRecord);
const appText = core.read(files.app);
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

const baseEval = evaluate(fixture, sourceSort);
addResult("fixture_phase_matches", fixture.phase === expected.phase);
addResult("artifact_evidence_status_sort_filter_interaction_evaluation_passes", baseEval.passed);

const allNotFirst = clone(fixture);
byFilter(allNotFirst, "all").first_visible_artifact_id = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const recoverableIncludesBlocked = clone(fixture);
byFilter(recoverableIncludesBlocked, "recoverable").visible_artifact_ids.unshift(expected.lampArtifactId);
const blockedExtra = clone(fixture);
byFilter(blockedExtra, "blocked").visible_artifact_ids.push("accepted_womens_resort_relaxed_knit_codex_v2_001");
byFilter(blockedExtra, "blocked").visible_count = 2;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const allNotFirstEval = evaluate(allNotFirst, sourceSort);
const recoverableIncludesBlockedEval = evaluate(recoverableIncludesBlocked, sourceSort);
const blockedExtraEval = evaluate(blockedExtra, sourceSort);
const acceptedWriteEval = evaluate(acceptedWrite, sourceSort);
const runtimeClaimEval = evaluate(runtimeClaim, sourceSort);

addResult("negative_case_all_filter_blocked_candidate_not_first_fails", allNotFirstEval.passed === false && allNotFirstEval.interactionOk === false);
addResult("negative_case_recoverable_filter_includes_blocked_candidate_fails", recoverableIncludesBlockedEval.passed === false && recoverableIncludesBlockedEval.interactionOk === false);
addResult("negative_case_blocked_filter_extra_artifact_fails", blockedExtraEval.passed === false && blockedExtraEval.interactionOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "artifactEvidenceStatusSortFilterInteractionState",
  "artifact_evidence_status_sort_filter_interaction_state",
  "local_filter_only",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "scripts/validate_v14_182_review_console_artifact_evidence_status_sort_filter_interaction.js",
  "tests/schema_examples/v14_182_review_console_artifact_evidence_status_sort_filter_interaction.example.json",
  "docs/v14_182_review_console_artifact_evidence_status_sort_filter_interaction.md",
  "v14_182_review_console_artifact_evidence_status_sort_filter_interaction_static_only",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_182_review_console_artifact_evidence_status_sort_filter_interaction",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  draft_output_key: fixture.draft_output_key,
  source_sort_key: fixture.source_sort_key,
  sort_mode: fixture.sort_mode,
  all_filter_blocked_candidate_first: fixture.all_filter_blocked_candidate_first,
  recoverable_filter_excludes_blocked_candidate: fixture.recoverable_filter_excludes_blocked_candidate,
  blocked_filter_only_blocked_candidate: fixture.blocked_filter_only_blocked_candidate,
  local_filter_only: fixture.local_filter_only,
  static_interaction_only: true,
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
  negative_case_all_filter_blocked_candidate_not_first_fails: allNotFirstEval.passed === false && allNotFirstEval.interactionOk === false,
  negative_case_recoverable_filter_includes_blocked_candidate_fails: recoverableIncludesBlockedEval.passed === false && recoverableIncludesBlockedEval.interactionOk === false,
  negative_case_blocked_filter_extra_artifact_fails: blockedExtraEval.passed === false && blockedExtraEval.interactionOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
