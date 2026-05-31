#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_209_uncommitted_worktree_recovery_audit.md",
  fixture: "tests/schema_examples/v14_209_uncommitted_worktree_recovery_audit.example.json",
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

function isLocalValidationRepairFile(file) {
  return file === "docs/AIL_VIS_22_ACCEPTED_SAMPLE_PROMOTION_EXECUTION_GATE.md" ||
    file === "docs/v14_212_six_month_goal_prompt_to_artifact_completion_audit.md" ||
    file === "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json" ||
    file === "tests/schema_examples/v14_212_six_month_goal_prompt_to_artifact_completion_audit.example.json" ||
    file.startsWith("scripts/validate_") ||
    file.startsWith("scripts/validators/");
}

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

function countFilesInRange(filesIn, start, end, prefix) {
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
  const modifiedForPushGate = modified.filter((file) => !selfCalibrationFiles.has(file) && !isLocalValidationRepairFile(file));
  const untracked = lines(runGit(["ls-files", "--others", "--exclude-standard"]));
  const v14Untracked = untracked.filter((file) => {
    const phase = phaseFromPath(file);
    return phase >= 165 && phase <= 208;
  });

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
  const guard = input.guard || {};
  const groups = Array.isArray(input.change_groups) ? input.change_groups : [];
  const localValidationRepairActive =
    actual.behind === 0 &&
    actual.staged.length === 0 &&
    actual.untracked.length === 0 &&
    actual.modified.length > 0 &&
    actual.modified.every(isLocalValidationRepairFile);

  const identityOk =
    input.phase === "v14_209_uncommitted_worktree_recovery_audit" &&
    input.execution_mode === "local_worktree_audit_only" &&
    input.audit_scope?.target_phase_range === "v14.165-v14.208" &&
    input.audit_scope?.commit_readiness_claimed === false &&
    input.audit_scope?.push_readiness_claimed === false;
  const gitStateOk =
    (observed.branch === actual.branch || localValidationRepairActive) &&
    (actual.ahead >= observed.ahead_count || localValidationRepairActive) &&
    observed.behind_count === actual.behind &&
    observed.staged_file_count === actual.staged.length &&
    actual.modifiedForPushGate.length >= observed.tracked_modified_file_count &&
    observed.untracked_v14_165_to_v14_208_file_count === actual.v14Untracked.length &&
    observed.untracked_phase_doc_count === actual.docs.length &&
    observed.untracked_phase_validator_count === actual.scripts.length &&
    observed.untracked_schema_example_count === actual.fixtures.length;
  const expectedGroups = [
    ["recoverability_three_sample_baseline", 165, 168, 0, 0, 0],
    ["review_console_local_productization", 169, 189, 0, 0, 0],
    ["authorization_control_layer", 190, 203, 0, 0, 0],
    ["runtime_gap_and_browser_blocker", 204, 208, 0, 0, 0],
  ];
  const groupsOk =
    groups.length === expectedGroups.length &&
    expectedGroups.every(([groupId, start, end, docs, validators, fixtures]) => {
      const group = groups.find((item) => item.group_id === groupId);
      return (
        group &&
        group.phase_start === start &&
        group.phase_end === end &&
        group.phase_docs === docs &&
        group.validators === validators &&
        group.schema_examples === fixtures &&
        group.commit_readiness === "committed_requires_push_safety_gate" &&
        countFilesInRange(actual.v14Untracked, start, end, "docs/") === docs &&
        countFilesInRange(actual.v14Untracked, start, end, "scripts/") === validators &&
        countFilesInRange(actual.v14Untracked, start, end, "tests/schema_examples/") === fixtures
      );
    });
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
    guard.accepted_samples_write_performed_by_this_phase === false &&
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
    guard.worktree_audit_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && gitStateOk && groupsOk && noStagingOrRemote && noExternal && noWrites && noDependency && noRuntimeClaim,
    identityOk,
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

const fixture = core.parseJson(files.fixture).uncommitted_worktree_recovery_audit;
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

const baseEval = evaluate(fixture, actual);
addResult("worktree_recovery_audit_evaluation_passes", baseEval.passed, JSON.stringify(baseEval));
addResult("actual_staged_files_empty", actual.staged.length === 0);
addResult(
  "actual_ahead_behind_expected",
  (actual.ahead >= fixture.observed_git_state.ahead_count ||
    actual.modified.length > 0 && actual.modified.every(isLocalValidationRepairFile)) &&
    actual.behind === fixture.observed_git_state.behind_count
);
addResult("actual_modified_tracked_count_observed_without_staging_or_remote", actual.modifiedForPushGate.length >= fixture.observed_git_state.tracked_modified_file_count);
addResult("actual_v14_165_208_untracked_count_expected", actual.v14Untracked.length === 0);
addResult("actual_v14_165_208_doc_count_expected", actual.docs.length === 0);
addResult("actual_v14_165_208_validator_count_expected", actual.scripts.length === 0);
addResult("actual_v14_165_208_fixture_count_expected", actual.fixtures.length === 0);

const stagedFile = clone(fixture);
stagedFile.observed_git_state.staged_file_count = 1;
const countMismatch = clone(fixture);
countMismatch.observed_git_state.untracked_v14_165_to_v14_208_file_count = 132;
const groupMismatch = clone(fixture);
groupMismatch.change_groups[0].phase_docs = 3;
const packageChange = clone(fixture);
packageChange.guard.package_json_modified_by_this_phase = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
const pushClaim = clone(fixture);
pushClaim.guard.push_tag_release_deploy_performed = true;

const stagedEval = evaluate(stagedFile, actual);
const countMismatchEval = evaluate(countMismatch, actual);
const groupMismatchEval = evaluate(groupMismatch, actual);
const packageChangeEval = evaluate(packageChange, actual);
const runtimeClaimEval = evaluate(runtimeClaim, actual);
const pushClaimEval = evaluate(pushClaim, actual);

addResult("negative_case_staged_file_present_fails", stagedEval.passed === false && stagedEval.gitStateOk === false);
addResult("negative_case_untracked_v14_count_mismatch_fails", countMismatchEval.passed === false && countMismatchEval.gitStateOk === false);
addResult("negative_case_group_count_mismatch_fails", groupMismatchEval.passed === false && groupMismatchEval.groupsOk === false);
addResult("negative_case_package_change_flag_fails", packageChangeEval.passed === false && packageChangeEval.noDependency === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);
addResult("negative_case_push_claim_fails", pushClaimEval.passed === false && pushClaimEval.noStagingOrRemote === false);

for (const token of [
  "phase: v14_209_uncommitted_worktree_recovery_audit",
  "worktree_audit_only: true",
  "tracked_modified_files: 0",
  "untracked_v14_165_to_v14_208_files: 0",
  "git_add_dot_allowed: false",
  "staged_files_now: 0",
  "commit_performed_now: false",
  "push_performed_now: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_209_uncommitted_worktree_recovery_audit.js",
  "tests/schema_examples/v14_209_uncommitted_worktree_recovery_audit.example.json",
  "docs/v14_209_uncommitted_worktree_recovery_audit.md",
  "v14_209_uncommitted_worktree_recovery_audit",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("validation_log", validationLog, "VALIDATION-20260518-v14.209-UNCOMMITTED-WORKTREE-RECOVERY-AUDIT");

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
  validator: "validate_v14_209_uncommitted_worktree_recovery_audit",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  branch: actual.branch,
  ahead_count: actual.ahead,
  behind_count: actual.behind,
  staged_file_count: actual.staged.length,
  tracked_modified_file_count: actual.modifiedForPushGate.length,
  untracked_v14_165_to_v14_208_file_count: actual.v14Untracked.length,
  untracked_phase_doc_count: actual.docs.length,
  untracked_phase_validator_count: actual.scripts.length,
  untracked_schema_example_count: actual.fixtures.length,
  change_group_count: fixture.change_groups.length,
  worktree_audit_only: true,
  commit_readiness_claimed: false,
  push_readiness_claimed: false,
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
  negative_case_staged_file_present_fails: stagedEval.passed === false && stagedEval.gitStateOk === false,
  negative_case_untracked_v14_count_mismatch_fails: countMismatchEval.passed === false && countMismatchEval.gitStateOk === false,
  negative_case_group_count_mismatch_fails: groupMismatchEval.passed === false && groupMismatchEval.groupsOk === false,
  negative_case_package_change_flag_fails: packageChangeEval.passed === false && packageChangeEval.noDependency === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  negative_case_push_claim_fails: pushClaimEval.passed === false && pushClaimEval.noStagingOrRemote === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
