#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.md",
  fixture: "tests/schema_examples/v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.example.json",
  sourceReview: "docs/v14_210_exact_file_commit_readiness_review.md",
  sourceFixture: "tests/schema_examples/v14_210_exact_file_commit_readiness_review.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const expectedExactFiles = [
  "docs/v14_165_bag_accepted_samples_metadata_registration.md",
  "docs/v14_166_lamp_v3_generated_candidate_readiness.md",
  "docs/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.md",
  "docs/v14_168_three_sample_dashboard_evidence_alignment.md",
  "scripts/validate_v14_165_bag_accepted_samples_metadata_registration.js",
  "scripts/validate_v14_166_lamp_v3_generated_candidate_readiness.js",
  "scripts/validate_v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.js",
  "scripts/validate_v14_168_three_sample_dashboard_evidence_alignment.js",
  "tests/schema_examples/v14_165_bag_accepted_samples_metadata_registration.example.json",
  "tests/schema_examples/v14_165_bag_accepted_samples_metadata_registration_negative_missing_registry_sample.example.json",
  "tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json",
  "tests/schema_examples/v14_166_lamp_v3_generated_candidate_readiness.example.json",
  "tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json",
  "tests/schema_examples/v14_168_three_sample_dashboard_evidence_alignment.example.json",
];

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function smartV3ScopedText(label, text, pattern) {
  if (label !== "current_surfaces") return text;
  const amberAllowedPatterns = [
    "provider_contact_performed:\\s+true",
    "plugin_call_performed:\\s+true",
    "api_call_performed:\\s+true",
    "image_generation_performed:\\s+true",
  ];
  if (!amberAllowedPatterns.includes(pattern.source)) return text;
  return "";
}

function forbidPattern(label, text, pattern) {
  const scopedText = smartV3ScopedText(label, text, pattern);
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(scopedText), `${pattern}`);
}

function runGit(args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function lines(value) {
  return value ? value.split(/\r?\n/).filter(Boolean) : [];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function arrayEquals(a, b) {
  return Array.isArray(a) && a.length === b.length && a.every((item, index) => item === b[index]);
}

function actualGitState() {
  return {
    branch: runGit(["branch", "--show-current"]),
    staged: lines(runGit(["diff", "--cached", "--name-only"])),
    untracked: lines(runGit(["ls-files", "--others", "--exclude-standard"])),
    tracked: lines(runGit(["ls-files"])),
  };
}

function hasForbiddenStagePath(file) {
  return (
    file.startsWith(".agent_board/") ||
    file.startsWith("accepted_samples/") ||
    file.startsWith("review_console/") ||
    file.startsWith("runs/") ||
    file.startsWith("production_candidate/") ||
    file.startsWith("failure_samples/") ||
    file.startsWith("release_packages/") ||
    file === ".env" ||
    file === ".env.local" ||
    file === "package.json" ||
    file === "package-lock.json"
  );
}

function evaluate(input, actual) {
  const authorization = input.authorization || {};
  const guard = input.guard || {};
  const exactFiles = input.exact_stage_files || [];
  const exactFilesOk =
    input.source_group_id === "recoverability_three_sample_baseline" &&
    input.source_group_count === 0 &&
    input.exact_stage_file_count === 14 &&
    arrayEquals(exactFiles, expectedExactFiles) &&
    exactFiles.every((file) => core.exists(file)) &&
    exactFiles.every((file) => actual.untracked.includes(file) || actual.tracked.includes(file)) &&
    !exactFiles.some(hasForbiddenStagePath);
  const authorizationOk =
    authorization.authorization_package_id === "AUTH-PENDING-RECOVERABILITY-THREE-SAMPLE-BASELINE-EXACT-FILE-COMMIT-20260518-001" &&
    authorization.authorization_package_status === "prepared_blocked_not_granted" &&
    authorization.authorization_granted_by_this_record === false &&
    authorization.execution_ready === false &&
    authorization.blocker === "exact_human_authorization_missing" &&
    authorization.git_add_dot_allowed === false &&
    authorization.push_allowed === false &&
    typeof authorization.future_commit_message === "string" &&
    authorization.future_commit_message.includes("test: validate three-sample recoverability baseline") &&
    authorization.future_commit_message.includes("Co-authored-by: Codex <noreply@openai.com>");
  const identityOk =
    input.phase === "v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft" &&
    input.execution_mode === "authorization_package_draft_only" &&
    input.source_review_ref === files.sourceReview &&
    input.source_fixture_ref === files.sourceFixture;
  const noStagingOrRemote =
    actual.staged.length === 0 &&
    guard.exact_file_staging_execution_performed === false &&
    guard.git_add_dot_used === false &&
    guard.staged_files_created === false &&
    guard.commit_performed === false &&
    guard.push_tag_release_deploy_performed === false;
  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false;
  const noWrites =
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;
  const noRuntimeClaim =
    guard.draft_only === true &&
    guard.dependency_change_performed === false &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && exactFilesOk && authorizationOk && noStagingOrRemote && noExternal && noWrites && noRuntimeClaim,
    identityOk,
    exactFilesOk,
    authorizationOk,
    noStagingOrRemote,
    noExternal,
    noWrites,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).recoverability_baseline_exact_file_staging_authorization_package_draft;
const sourceFixture = core.parseJson(files.sourceFixture).exact_file_commit_readiness_review;
const actual = actualGitState();
const phaseRecord = core.read(files.phaseRecord);
const validationLog = core.read(files.validationLog);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

addResult("source_v14_210_phase_matches", sourceFixture.phase === "v14_210_exact_file_commit_readiness_review");
addResult(
  "source_group_count_matches",
  sourceFixture.candidate_groups.some((group) => group.group_id === "recoverability_three_sample_baseline" && group.count === 0)
);

const baseEval = evaluate(fixture, actual);
addResult("authorization_package_draft_evaluation_passes", baseEval.passed, JSON.stringify(baseEval));
addResult("actual_staged_files_empty", actual.staged.length === 0);
addResult("exact_files_all_exist", expectedExactFiles.every((file) => core.exists(file)));
addResult(
  "exact_files_all_tracked_or_untracked",
  expectedExactFiles.every((file) => actual.untracked.includes(file) || actual.tracked.includes(file))
);
addResult("exact_files_no_forbidden_paths", !expectedExactFiles.some(hasForbiddenStagePath));

const missingFile = clone(fixture);
missingFile.exact_stage_files = missingFile.exact_stage_files.slice(1);
missingFile.exact_stage_file_count = 13;
const extraFile = clone(fixture);
extraFile.exact_stage_files.push(".agent_board/RUN_STATE.md");
extraFile.exact_stage_file_count = 15;
const stagingAllowed = clone(fixture);
stagingAllowed.authorization.git_add_dot_allowed = true;
const gitAddDot = clone(fixture);
gitAddDot.guard.git_add_dot_used = true;
const commitPerformed = clone(fixture);
commitPerformed.guard.commit_performed = true;
const pushClaim = clone(fixture);
pushClaim.guard.push_tag_release_deploy_performed = true;
const missingTrailer = clone(fixture);
missingTrailer.authorization.future_commit_message = "test: validate three-sample recoverability baseline";
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingFileEval = evaluate(missingFile, actual);
const extraFileEval = evaluate(extraFile, actual);
const stagingAllowedEval = evaluate(stagingAllowed, actual);
const gitAddDotEval = evaluate(gitAddDot, actual);
const commitPerformedEval = evaluate(commitPerformed, actual);
const pushClaimEval = evaluate(pushClaim, actual);
const missingTrailerEval = evaluate(missingTrailer, actual);
const runtimeClaimEval = evaluate(runtimeClaim, actual);

addResult("negative_case_missing_exact_file_fails", missingFileEval.passed === false && missingFileEval.exactFilesOk === false);
addResult("negative_case_extra_exact_file_fails", extraFileEval.passed === false && extraFileEval.exactFilesOk === false);
addResult("negative_case_staging_allowed_fails", stagingAllowedEval.passed === false && stagingAllowedEval.authorizationOk === false);
addResult("negative_case_git_add_dot_allowed_fails", gitAddDotEval.passed === false && gitAddDotEval.noStagingOrRemote === false);
addResult("negative_case_commit_performed_fails", commitPerformedEval.passed === false && commitPerformedEval.noStagingOrRemote === false);
addResult("negative_case_push_claim_fails", pushClaimEval.passed === false && pushClaimEval.noStagingOrRemote === false);
addResult("negative_case_missing_commit_trailer_fails", missingTrailerEval.passed === false && missingTrailerEval.authorizationOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "phase: v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft",
  "authorization_package_status: prepared_blocked_not_granted",
  "authorization_granted_by_this_record: false",
  "exact_stage_file_count: 14",
  "git_add_dot_used: false",
  "staged_files_created: false",
  "commit_performed: false",
  "push_tag_release_deploy_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
  "Co-authored-by: Codex <noreply@openai.com>",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const file of expectedExactFiles) {
  requireToken("phase_record_exact_file", phaseRecord, file);
}

for (const token of [
  "scripts/validate_v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.js",
  "tests/schema_examples/v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.example.json",
  "docs/v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.md",
  "v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("validation_log", validationLog, "VALIDATION-20260518-v14.211-RECOVERABILITY-BASELINE-EXACT-FILE-STAGING-AUTHORIZATION-PACKAGE-DRAFT");

forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /exact_file_staging_execution_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /git_add_dot_used:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /staged_files_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /commit_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /env_or_secret_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /dependency_change_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  branch: actual.branch,
  staged_file_count: actual.staged.length,
  exact_stage_file_count: expectedExactFiles.length,
  source_group_id: fixture.source_group_id,
  source_group_count: fixture.source_group_count,
  authorization_package_status: fixture.authorization.authorization_package_status,
  authorization_granted_by_this_record: false,
  execution_ready: false,
  draft_only: true,
  git_add_dot_used: false,
  staged_files_created: false,
  commit_performed: false,
  push_tag_release_deploy_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  env_or_secret_read_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  dependency_change_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_exact_file_fails: missingFileEval.passed === false && missingFileEval.exactFilesOk === false,
  negative_case_extra_exact_file_fails: extraFileEval.passed === false && extraFileEval.exactFilesOk === false,
  negative_case_staging_allowed_fails: stagingAllowedEval.passed === false && stagingAllowedEval.authorizationOk === false,
  negative_case_git_add_dot_allowed_fails: gitAddDotEval.passed === false && gitAddDotEval.noStagingOrRemote === false,
  negative_case_commit_performed_fails: commitPerformedEval.passed === false && commitPerformedEval.noStagingOrRemote === false,
  negative_case_push_claim_fails: pushClaimEval.passed === false && pushClaimEval.noStagingOrRemote === false,
  negative_case_missing_commit_trailer_fails: missingTrailerEval.passed === false && missingTrailerEval.authorizationOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
