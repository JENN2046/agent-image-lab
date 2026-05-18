#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { normalizeArtifactLifecycleState } = require("../review_console/static_prototype/artifact_lifecycle_state_reader");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_169_review_console_artifact_lifecycle_state_reader.md",
  fixture: "tests/schema_examples/v14_169_review_console_artifact_lifecycle_state_reader.example.json",
  reader: "review_console/static_prototype/artifact_lifecycle_state_reader.js",
  index: "review_console/static_prototype/index.html",
  app: "review_console/static_prototype/app.js",
  mock: "review_console/static_prototype/mock_data.js",
  readme: "review_console/static_prototype/README.md",
  styles: "review_console/static_prototype/styles.css",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_169_review_console_artifact_lifecycle_state_reader",
  acceptedCount: 2,
  blockedCount: 1,
  remainingGap: 1,
  blockedSampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
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

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evaluate(input) {
  const output = normalizeArtifactLifecycleState(input);
  const lamp = output.records.find((record) => record.sample_id === expected.blockedSampleId);
  const countsOk =
    output.counts.recoverable_accepted_sample_count === expected.acceptedCount &&
    output.counts.blocked_registration_candidate_count === expected.blockedCount &&
    output.counts.remaining_full_recoverable_sample_gap === expected.remainingGap &&
    output.counts.hard_acceptance_three_full_samples_met === false &&
    output.counts.pending_candidate_counted_as_accepted === false;
  const lampBlocked =
    lamp &&
    lamp.recoverable === false &&
    lamp.blocked_registration === true &&
    lamp.human_approval_status === "pending" &&
    lamp.registration_blocker === "human_approval_missing";
  const noWrites =
    output.guard.accepted_samples_write_performed === false &&
    output.guard.failure_samples_write_performed === false &&
    output.guard.production_candidate_write_performed === false &&
    output.guard.file_write_performed === false &&
    output.guard.durable_archive_copy_performed === false;
  const noExternal =
    output.guard.fetch_performed === false &&
    output.guard.provider_contact_performed === false &&
    output.guard.plugin_call_performed === false &&
    output.guard.api_call_performed === false &&
    output.guard.mcp_runtime_performed === false &&
    output.guard.real_manifest_read_performed === false &&
    output.guard.real_vcpchat_read_performed === false &&
    output.guard.real_vcptoolbox_read_performed === false &&
    output.guard.push_tag_release_deploy_performed === false;
  const noRuntimeClaim =
    output.guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    output.guard.vcp_runtime_integration_proven === false;
  return {
    output,
    passed: output.parse_status === "parsed" && countsOk && lampBlocked && noWrites && noExternal && noRuntimeClaim,
    countsOk,
    lampBlocked,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_artifact_lifecycle_state_reader;
const phaseRecord = core.read(files.phaseRecord);
const readerText = core.read(files.reader);
const indexText = core.read(files.index);
const appText = core.read(files.app);
const mockText = core.read(files.mock);
const readmeText = core.read(files.readme);
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
addResult("reader_evaluation_passes", baseEval.passed, JSON.stringify(baseEval.output.counts));
addResult("expected_reader_output_matches_fixture", fixture.expected_reader_output.recoverable_accepted_sample_count === expected.acceptedCount);

const pendingCounted = clone(fixture);
pendingCounted.dashboard_counts.pending_candidate_counted_as_accepted = true;
const overclaim = clone(fixture);
overclaim.dashboard_counts.hard_acceptance_three_full_samples_met = true;
const fetchGuard = clone(fixture);
fetchGuard.guard.fetch_performed = true;
const fileWriteGuard = clone(fixture);
fileWriteGuard.guard.file_write_performed = true;
const acceptedWriteGuard = clone(fixture);
acceptedWriteGuard.guard.accepted_samples_write_performed = true;
const productionCandidateGuard = clone(fixture);
productionCandidateGuard.guard.production_candidate_write_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.records[0].vcp_runtime_integration_proven = true;
const approvedLamp = clone(fixture);
approvedLamp.records[2].human_approval_status = "approved";
approvedLamp.records[2].approved_by = "Jenn";
approvedLamp.records[2].accepted_samples_registration_eligible = true;
approvedLamp.records[2].registration_blocker = null;
approvedLamp.records[2].accepted_samples_metadata_registered = false;

const pendingEval = evaluate(pendingCounted);
const overclaimEval = evaluate(overclaim);
const fetchEval = evaluate(fetchGuard);
const fileWriteEval = evaluate(fileWriteGuard);
const acceptedWriteEval = evaluate(acceptedWriteGuard);
const productionCandidateEval = evaluate(productionCandidateGuard);
const runtimeClaimEval = evaluate(runtimeClaim);
const approvedLampEval = evaluate(approvedLamp);

addResult("negative_case_pending_candidate_counted_as_accepted_fails", pendingEval.passed === false && pendingEval.output.parse_status === "blocked");
addResult("negative_case_three_sample_goal_overclaim_fails", overclaimEval.passed === false && overclaimEval.output.parse_status === "blocked");
addResult("negative_case_fetch_guard_flag_blocks_reader", fetchEval.passed === false && fetchEval.output.parse_status === "blocked");
addResult("negative_case_file_write_guard_flag_blocks_reader", fileWriteEval.passed === false && fileWriteEval.output.parse_status === "blocked");
addResult("negative_case_accepted_samples_write_guard_flag_blocks_reader", acceptedWriteEval.passed === false && acceptedWriteEval.output.parse_status === "blocked");
addResult("negative_case_production_candidate_guard_flag_blocks_reader", productionCandidateEval.passed === false && productionCandidateEval.output.parse_status === "blocked");
addResult("negative_case_runtime_claim_blocks_reader", runtimeClaimEval.passed === false && runtimeClaimEval.output.parse_status === "blocked");
addResult("negative_case_missing_human_approval_keeps_lamp_blocked", approvedLampEval.passed === false && approvedLampEval.lampBlocked === false);

for (const token of [
  "ArtifactLifecycleStateReader",
  "normalizeArtifactLifecycleState",
  "forbiddenGuardFields",
]) {
  requireToken("reader", readerText, token);
}

for (const token of [
  "<script src=\"./artifact_lifecycle_state_reader.js\"></script>",
  "artifactLifecycleSummary",
  "artifactLifecycleList",
  "artifactLifecycleGuard",
]) {
  requireToken("index", indexText, token);
}

for (const token of [
  "artifact_lifecycle_state_reader: mock.artifact_lifecycle_state_reader_seed",
  "normalizeArtifactLifecycleState",
  "renderArtifactLifecycleStateReader",
  "artifact_lifecycle_state_reader: normalizeArtifactLifecycleState()",
]) {
  requireToken("app", appText, token);
}

for (const token of [
  "artifact_lifecycle_state_reader_seed",
  expected.blockedSampleId,
  "accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001",
  "accepted_womens_resort_relaxed_knit_codex_v2_001",
]) {
  requireToken("mock", mockText, token);
}

for (const token of [
  "v14.169",
  "artifact_lifecycle_state_reader",
  "Review Console artifact lifecycle state reader",
]) {
  requireToken("readme", readmeText, token);
}

for (const token of [
  "scripts/validate_v14_169_review_console_artifact_lifecycle_state_reader.js",
  "review_console/static_prototype/artifact_lifecycle_state_reader.js",
  "docs/v14_169_review_console_artifact_lifecycle_state_reader.md",
  "v14_169_review_console_artifact_lifecycle_state_reader",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("reader", readerText, /\bfetch\s*\(/);
forbidPattern("reader", readerText, /\bXMLHttpRequest\b/);
forbidPattern("reader", readerText, /\blocalStorage\b/);
forbidPattern("reader", readerText, /\bsessionStorage\b/);
forbidPattern("reader", readerText, /require\(["']node:fs["']\)/);
forbidPattern("reader", readerText, /writeFile|appendFile|createWriteStream/);
forbidPattern("app", appText, /\bfetch\s*\(/);
forbidPattern("app", appText, /\bXMLHttpRequest\b/);
forbidPattern("app", appText, /writeFile|appendFile|createWriteStream/);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_169_review_console_artifact_lifecycle_state_reader",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  parse_status: baseEval.output.parse_status,
  recoverable_accepted_sample_count: baseEval.output.counts.recoverable_accepted_sample_count,
  blocked_registration_candidate_count: baseEval.output.counts.blocked_registration_candidate_count,
  remaining_full_recoverable_sample_gap: baseEval.output.counts.remaining_full_recoverable_sample_gap,
  hard_acceptance_three_full_samples_met: baseEval.output.counts.hard_acceptance_three_full_samples_met,
  pending_candidate_counted_as_accepted: baseEval.output.counts.pending_candidate_counted_as_accepted,
  static_reader_only: true,
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
  negative_case_pending_candidate_counted_as_accepted_fails: pendingEval.passed === false && pendingEval.output.parse_status === "blocked",
  negative_case_three_sample_goal_overclaim_fails: overclaimEval.passed === false && overclaimEval.output.parse_status === "blocked",
  negative_case_fetch_guard_flag_blocks_reader: fetchEval.passed === false && fetchEval.output.parse_status === "blocked",
  negative_case_file_write_guard_flag_blocks_reader: fileWriteEval.passed === false && fileWriteEval.output.parse_status === "blocked",
  negative_case_accepted_samples_write_guard_flag_blocks_reader: acceptedWriteEval.passed === false && acceptedWriteEval.output.parse_status === "blocked",
  negative_case_production_candidate_guard_flag_blocks_reader: productionCandidateEval.passed === false && productionCandidateEval.output.parse_status === "blocked",
  negative_case_runtime_claim_blocks_reader: runtimeClaimEval.passed === false && runtimeClaimEval.output.parse_status === "blocked",
  negative_case_missing_human_approval_keeps_lamp_blocked: approvedLampEval.passed === false && approvedLampEval.lampBlocked === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
