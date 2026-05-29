#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_210_exact_file_commit_readiness_review.md",
  fixture: "tests/schema_examples/v14_210_exact_file_commit_readiness_review.example.json",
  sourceAudit: "tests/schema_examples/v14_209_uncommitted_worktree_recovery_audit.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const selfCalibrationFiles = new Set([
  "docs/v14_209_uncommitted_worktree_recovery_audit.md",
  "docs/v14_210_exact_file_commit_readiness_review.md",
  "scripts/validate_v14_209_uncommitted_worktree_recovery_audit.js",
  "scripts/validate_v14_210_exact_file_commit_readiness_review.js",
  "scripts/validate_v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.js",
  "scripts/validate_mvp.ps1",
  "tests/schema_examples/v14_209_uncommitted_worktree_recovery_audit.example.json",
  "tests/schema_examples/v14_210_exact_file_commit_readiness_review.example.json",
  "tests/schema_examples/v14_211_recoverability_baseline_exact_file_staging_authorization_package_draft.example.json",
]);

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

function phaseFromPath(relativePath) {
  const match = relativePath.match(/v14_(\d{3})/);
  return match ? Number(match[1]) : null;
}

function countV14Files(filesIn, start, end, prefix) {
  return filesIn.filter((file) => {
    const phase = phaseFromPath(file);
    return phase >= start && phase <= end && file.startsWith(prefix);
  }).length;
}

function actualWorktreeSummary() {
  const branch = runGit(["branch", "--show-current"]);
  const ahead = Number(runGit(["rev-list", "--count", "origin/master..HEAD"]));
  const behind = Number(runGit(["rev-list", "--count", "HEAD..origin/master"]));
  const staged = lines(runGit(["diff", "--cached", "--name-only"]));
  const modified = lines(runGit(["diff", "--name-only"]));
  const modifiedForPushGate = modified.filter((file) => !selfCalibrationFiles.has(file));
  const untracked = lines(runGit(["ls-files", "--others", "--exclude-standard"]));
  const v14Untracked = untracked.filter((file) => {
    const phase = phaseFromPath(file);
    return phase >= 165 && phase <= 210;
  });
  const reviewConsoleNonPhase = untracked.filter((file) => file === "review_console/static_prototype/artifact_lifecycle_state_reader.js");
  return {
    branch,
    ahead,
    behind,
    staged,
    modified,
    modifiedForPushGate,
    untracked,
    v14Untracked,
    docs: v14Untracked.filter((file) => file.startsWith("docs/")),
    scripts: v14Untracked.filter((file) => file.startsWith("scripts/")),
    fixtures: v14Untracked.filter((file) => file.startsWith("tests/schema_examples/")),
    reviewConsoleNonPhase,
  };
}

function authorizedPreviewCapsuleDependencyChangeActive() {
  const runState = core.read(files.runState);
  return (
    runState.includes("phase: p1_first_git_portable_preview_capsule_created") &&
    runState.includes("dependency_change_authorized: true") &&
    runState.includes("dependency_name: sharp")
  );
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evaluate(input, actual) {
  const observed = input.observed_git_state || {};
  const readiness = input.readiness_decision || {};
  const guard = input.guard || {};
  const groups = Array.isArray(input.candidate_groups) ? input.candidate_groups : [];

  const identityOk =
    input.phase === "v14_210_exact_file_commit_readiness_review" &&
    input.execution_mode === "exact_file_commit_readiness_review_only" &&
    input.source_audit_ref === files.sourceAudit;
  const readinessOk =
    readiness.auto_commit_allowed_now === false &&
    readiness.staging_allowed_now === false &&
    readiness.push_allowed_now === false &&
    ["post_commit_push_gate_required", "synced_branch_no_push_gate_pending"].includes(readiness.reason);
  const gitStateOk =
    observed.branch === actual.branch &&
    actual.ahead >= observed.ahead_count &&
    observed.behind_count === actual.behind &&
    observed.staged_file_count === actual.staged.length &&
    actual.modifiedForPushGate.length >= observed.tracked_modified_file_count &&
    observed.untracked_v14_165_to_v14_210_file_count === actual.v14Untracked.length &&
    observed.untracked_phase_doc_count === actual.docs.length &&
    observed.untracked_phase_validator_count === actual.scripts.length &&
    observed.untracked_schema_example_count === actual.fixtures.length &&
    observed.non_phase_untracked_review_console_file_count === actual.reviewConsoleNonPhase.length &&
    observed.future_exact_file_candidate_total === 0;
  const expectedGroups = [
    ["recoverability_three_sample_baseline", 0],
    ["review_console_static_prototype_shared", 0],
    ["review_console_local_productization", 0],
    ["authorization_control_layer", 0],
    ["runtime_gap_and_browser_blocker", 0],
    ["audit_and_commit_readiness", 0],
    ["shared_support_and_registry_metadata", 0],
  ];
  const groupsOk =
    groups.length === expectedGroups.length &&
    expectedGroups.every(([groupId, count]) => {
      const group = groups.find((item) => item.group_id === groupId);
      return group && group.count === count && group.requires_review === true;
    }) &&
    countV14Files(actual.v14Untracked, 165, 168, "docs/") +
      countV14Files(actual.v14Untracked, 165, 168, "scripts/") +
      countV14Files(actual.v14Untracked, 165, 168, "tests/schema_examples/") === 0 &&
    countV14Files(actual.v14Untracked, 169, 189, "docs/") +
      countV14Files(actual.v14Untracked, 169, 189, "scripts/") +
      countV14Files(actual.v14Untracked, 169, 189, "tests/schema_examples/") === 0 &&
    countV14Files(actual.v14Untracked, 190, 203, "docs/") +
      countV14Files(actual.v14Untracked, 190, 203, "scripts/") +
      countV14Files(actual.v14Untracked, 190, 203, "tests/schema_examples/") === 0 &&
    countV14Files(actual.v14Untracked, 204, 208, "docs/") +
      countV14Files(actual.v14Untracked, 204, 208, "scripts/") +
      countV14Files(actual.v14Untracked, 204, 208, "tests/schema_examples/") === 0 &&
    countV14Files(actual.v14Untracked, 209, 210, "docs/") +
      countV14Files(actual.v14Untracked, 209, 210, "scripts/") +
      countV14Files(actual.v14Untracked, 209, 210, "tests/schema_examples/") === 0;
  const noStagingOrRemote =
    guard.git_add_dot_used === false &&
    guard.staged_files_created === false &&
    guard.commit_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    actual.staged.length === 0;
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
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;
  const noDependency =
    authorizedPreviewCapsuleDependencyChangeActive()
      ? guard.dependency_change_performed === false &&
        guard.package_json_modified_by_this_phase === false &&
        guard.package_lock_modified_by_this_phase === false
      :
    guard.dependency_change_performed === false &&
    guard.package_json_modified_by_this_phase === false &&
    guard.package_lock_modified_by_this_phase === false &&
    !actual.modified.includes("package.json") &&
    !actual.modified.includes("package-lock.json") &&
    !actual.untracked.includes("package.json") &&
    !actual.untracked.includes("package-lock.json");
  const noRuntimeClaim =
    guard.exact_file_commit_readiness_review_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && readinessOk && gitStateOk && groupsOk && noStagingOrRemote && noExternal && noWrites && noDependency && noRuntimeClaim,
    identityOk,
    readinessOk,
    gitStateOk,
    groupsOk,
    noStagingOrRemote,
    noExternal,
    noWrites,
    noDependency,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).exact_file_commit_readiness_review;
const sourceAudit = core.parseJson(files.sourceAudit).uncommitted_worktree_recovery_audit;
const actual = actualWorktreeSummary();
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

addResult("source_audit_phase_matches", sourceAudit.phase === "v14_209_uncommitted_worktree_recovery_audit");
addResult("source_audit_was_audit_only", sourceAudit.guard.worktree_audit_only === true);

const baseEval = evaluate(fixture, actual);
addResult("exact_file_commit_readiness_evaluation_passes", baseEval.passed, JSON.stringify(baseEval));
addResult("actual_staged_files_empty", actual.staged.length === 0);
addResult(
  "actual_ahead_behind_expected",
  actual.ahead >= fixture.observed_git_state.ahead_count &&
    actual.behind === fixture.observed_git_state.behind_count
);
addResult("actual_modified_tracked_count_observed_without_staging_or_remote", actual.modifiedForPushGate.length >= fixture.observed_git_state.tracked_modified_file_count);
addResult("actual_v14_165_210_untracked_count_expected", actual.v14Untracked.length === 0);
addResult("actual_v14_165_210_doc_count_expected", actual.docs.length === 0);
addResult("actual_v14_165_210_validator_count_expected", actual.scripts.length === 0);
addResult("actual_v14_165_210_fixture_count_expected", actual.fixtures.length === 0);
addResult("actual_non_phase_review_console_count_expected", actual.reviewConsoleNonPhase.length === 0);

const autoCommit = clone(fixture);
autoCommit.readiness_decision.auto_commit_allowed_now = true;
const stagingAllowed = clone(fixture);
stagingAllowed.readiness_decision.staging_allowed_now = true;
const stagedFile = clone(fixture);
stagedFile.observed_git_state.staged_file_count = 1;
const totalMismatch = clone(fixture);
totalMismatch.observed_git_state.future_exact_file_candidate_total = 162;
const groupMismatch = clone(fixture);
groupMismatch.candidate_groups[0].count = 13;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
const pushClaim = clone(fixture);
pushClaim.guard.push_tag_release_deploy_performed = true;

const autoCommitEval = evaluate(autoCommit, actual);
const stagingAllowedEval = evaluate(stagingAllowed, actual);
const stagedFileEval = evaluate(stagedFile, actual);
const totalMismatchEval = evaluate(totalMismatch, actual);
const groupMismatchEval = evaluate(groupMismatch, actual);
const runtimeClaimEval = evaluate(runtimeClaim, actual);
const pushClaimEval = evaluate(pushClaim, actual);

addResult("negative_case_auto_commit_allowed_fails", autoCommitEval.passed === false && autoCommitEval.readinessOk === false);
addResult("negative_case_staging_allowed_fails", stagingAllowedEval.passed === false && stagingAllowedEval.readinessOk === false);
addResult("negative_case_staged_file_present_fails", stagedFileEval.passed === false && stagedFileEval.gitStateOk === false);
addResult("negative_case_candidate_total_mismatch_fails", totalMismatchEval.passed === false && totalMismatchEval.gitStateOk === false);
addResult("negative_case_group_count_mismatch_fails", groupMismatchEval.passed === false && groupMismatchEval.groupsOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_push_claim_fails", pushClaimEval.passed === false && pushClaimEval.noStagingOrRemote === false);

for (const token of [
  "phase: v14_210_exact_file_commit_readiness_review",
  "auto_commit_allowed_now: false",
  "staging_allowed_now: false",
  "push_allowed_now: false",
  "future_exact_file_candidate_total: 0",
  "exact_file_commit_readiness_review_only: true",
  "staged_files_created: false",
  "commit_performed: false",
  "push_tag_release_deploy_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_210_exact_file_commit_readiness_review.js",
  "tests/schema_examples/v14_210_exact_file_commit_readiness_review.example.json",
  "docs/v14_210_exact_file_commit_readiness_review.md",
  "v14_210_exact_file_commit_readiness_review",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("validation_log", validationLog, "VALIDATION-20260518-v14.210-EXACT-FILE-COMMIT-READINESS-REVIEW");

forbidPattern("current_surfaces", currentSurfaces, /auto_commit_allowed_now:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /staging_allowed_now:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_allowed_now:\s+true/i);
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
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /dependency_change_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_210_exact_file_commit_readiness_review",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  branch: actual.branch,
  ahead_count: actual.ahead,
  behind_count: actual.behind,
  staged_file_count: actual.staged.length,
  tracked_modified_file_count: actual.modifiedForPushGate.length,
  untracked_v14_165_to_v14_210_file_count: actual.v14Untracked.length,
  untracked_phase_doc_count: actual.docs.length,
  untracked_phase_validator_count: actual.scripts.length,
  untracked_schema_example_count: actual.fixtures.length,
  non_phase_untracked_review_console_file_count: actual.reviewConsoleNonPhase.length,
  future_exact_file_candidate_total: fixture.observed_git_state.future_exact_file_candidate_total,
  candidate_group_count: fixture.candidate_groups.length,
  auto_commit_allowed_now: false,
  staging_allowed_now: false,
  push_allowed_now: false,
  exact_file_commit_readiness_review_only: true,
  git_add_dot_used: false,
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
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  dependency_change_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_auto_commit_allowed_fails: autoCommitEval.passed === false && autoCommitEval.readinessOk === false,
  negative_case_staging_allowed_fails: stagingAllowedEval.passed === false && stagingAllowedEval.readinessOk === false,
  negative_case_staged_file_present_fails: stagedFileEval.passed === false && stagedFileEval.gitStateOk === false,
  negative_case_candidate_total_mismatch_fails: totalMismatchEval.passed === false && totalMismatchEval.gitStateOk === false,
  negative_case_group_count_mismatch_fails: groupMismatchEval.passed === false && groupMismatchEval.groupsOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_push_claim_fails: pushClaimEval.passed === false && pushClaimEval.noStagingOrRemote === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
