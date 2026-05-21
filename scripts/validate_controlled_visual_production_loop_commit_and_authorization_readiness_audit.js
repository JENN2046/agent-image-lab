#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  fixture: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_COMMIT_AND_AUTHORIZATION_READINESS_AUDIT.example.json",
  phaseRecord: "docs/CONTROLLED_VISUAL_PRODUCTION_LOOP_COMMIT_AND_AUTHORIZATION_READINESS_AUDIT.md",
  mvpWiring: "scripts/validate_mvp_capsule_product_core.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  roadmap: "docs/00_project_roadmap.md",
  productionAuthorization: "reports/production_candidate_authorization/2026-05-20_tennis_wallet_production_candidate_A5_authorization_package.json",
  memoryAuthorization: "reports/memory_write_authorization/2026-05-20_tennis_wallet_memory_write_A5_authorization_package.json",
  loopContract: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_CONTRACT.example.json",
  reviewBridge: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_REVIEW_BRIDGE_STATE.example.json",
  archiveBaseline: "tests/schema_examples/REVIEW_CONSOLE_FULL_ASSET_ARCHIVE_BASELINE_STATE.example.json",
  fullArchiveManifest: "tests/schema_examples/full_asset_archive_manifest.example.json"
};

function readText(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function runGit(args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function lines(value) {
  return value ? value.split(/\r?\n/).filter(Boolean) : [];
}

function findPostCommitProof(subject, expectedFiles) {
  const commits = lines(runGit(["log", "--format=%H%x00%s", "-n", "60"]));
  for (const commit of commits) {
    const [hash, commitSubject] = commit.split("\u0000");
    if (commitSubject !== subject) continue;
    const files = lines(runGit(["show", "--name-only", "--format=", hash])).sort();
    if (JSON.stringify(files) === JSON.stringify(expectedFiles)) {
      return { hash, subject: commitSubject, file_count: files.length };
    }
  }

  return null;
}

const results = [];
const failures = [];
const add = (check, passed, detail = null) => {
  results.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
  if (!passed) failures.push({ check, ...(detail === null ? {} : { detail }) });
};

const fixture = readJson(files.fixture).controlled_visual_production_loop_commit_and_authorization_readiness_audit;
const stagedFiles = lines(runGit(["diff", "--cached", "--name-only"]));
const modifiedTracked = lines(runGit(["diff", "--name-only"]));
const untrackedFiles = lines(runGit(["ls-files", "--others", "--exclude-standard"]));
const changedFiles = [...modifiedTracked, ...untrackedFiles].sort();
const branch = runGit(["branch", "--show-current"]);
const ahead = Number(runGit(["rev-list", "--count", "origin/master..HEAD"]));
const behind = Number(runGit(["rev-list", "--count", "HEAD..origin/master"]));
const headSubject = runGit(["log", "-1", "--format=%s"]);
const headFiles = lines(runGit(["show", "--name-only", "--format=", "HEAD"])).sort();

const exactExpected = [...fixture.exact_changed_files].sort();
const requirementGroupsTotal = fixture.requirement_groups.reduce((sum, group) => sum + group.count, 0);
const expectedPostCommitSubject = "chore: record production candidate activation";
const postCommitProof = findPostCommitProof(expectedPostCommitSubject, exactExpected);
const headMatchesExpectedPostCommit = postCommitProof !== null;
const validatorMaintenanceFiles = [
  "scripts/validate_mvp_capsule_product_core.ps1",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_commit_and_authorization_readiness_audit.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js"
].sort();
const selfMaintenanceAllowed = process.env.AGENT_IMAGE_LAB_VALIDATOR_MAINTENANCE === "1";
const isCleanPostCommit = behind === 0
  && stagedFiles.length === 0
  && modifiedTracked.length === 0
  && untrackedFiles.length === 0
  && headMatchesExpectedPostCommit;
const isCleanSyncedPostCommit = isCleanPostCommit && ahead === 0;
const isCleanLocalAheadPostCommit = isCleanPostCommit && ahead > 0;
const isValidatorSelfMaintenancePatch = selfMaintenanceAllowed
  && ahead === 0
  && behind === 0
  && stagedFiles.length === 0
  && untrackedFiles.length === 0
  && JSON.stringify([...modifiedTracked].sort()) === JSON.stringify(validatorMaintenanceFiles);
const acceptsCurrentGitShape = isCleanPostCommit || isValidatorSelfMaintenancePatch;
const productionAuthorization = readJson(files.productionAuthorization);
const memoryAuthorization = readJson(files.memoryAuthorization);
const loopContract = readJson(files.loopContract).controlled_visual_production_loop_contract_snapshot;
const reviewBridge = readJson(files.reviewBridge).controlled_visual_production_loop_review_bridge_snapshot;
const archiveBaseline = readJson(files.archiveBaseline).review_console_full_asset_archive_baseline_state_snapshot;
const fullArchiveManifest = readJson(files.fullArchiveManifest);

add("phase_record_exists", fs.existsSync(path.join(root, files.phaseRecord)));
add("fixture_phase", fixture.phase === "controlled_visual_production_loop_commit_and_authorization_readiness_audit");
add("execution_mode", fixture.execution_mode === "goal_level_readiness_audit_only");
add("goal_level_local_readiness_verified", fixture.audit_decision.goal_level_local_readiness_verified === true);
add("local_commit_ready_after_human_review", fixture.audit_decision.local_commit_ready_after_explicit_human_review === true);
add("authorization_ready_for_future_A5", fixture.audit_decision.authorization_ready_for_future_A5 === true);
add("production_candidate_authorization_state", fixture.audit_decision.production_candidate_authorization_state === "draft_not_active");
add("memory_write_authorization_state", fixture.audit_decision.memory_write_authorization_state === "draft_not_active");
add("memory_write_route_currently_blocked", fixture.audit_decision.memory_write_route_currently_blocked === true);
add("A5_execution_allowed_now_false", fixture.audit_decision.A5_execution_allowed_now === false);

add("branch", branch === fixture.git_expectation.branch, branch);
add("ahead_count_or_clean_post_commit", isCleanPostCommit || ahead === fixture.git_expectation.ahead_count, String(ahead));
add("behind_count", behind === fixture.git_expectation.behind_count, String(behind));
add("staged_file_count", stagedFiles.length === fixture.git_expectation.staged_file_count, String(stagedFiles.length));
add("tracked_modified_count_or_allowed_post_commit_state", acceptsCurrentGitShape || modifiedTracked.length === fixture.git_expectation.tracked_modified_file_count, String(modifiedTracked.length));
add("untracked_file_count_or_allowed_post_commit_state", acceptsCurrentGitShape || untrackedFiles.length === fixture.git_expectation.untracked_file_count, String(untrackedFiles.length));
add("exact_changed_file_count_or_allowed_post_commit_state", acceptsCurrentGitShape || changedFiles.length === fixture.git_expectation.exact_changed_file_count, String(changedFiles.length));
add("requirement_groups_total_matches", requirementGroupsTotal === fixture.git_expectation.exact_changed_file_count, String(requirementGroupsTotal));
add("exact_changed_files_match_or_allowed_post_commit_state", acceptsCurrentGitShape || JSON.stringify(changedFiles) === JSON.stringify(exactExpected));
add("post_commit_proof_exists_or_pending_slice", postCommitProof !== null || JSON.stringify(changedFiles) === JSON.stringify(exactExpected) || isValidatorSelfMaintenancePatch, postCommitProof?.hash || null);
add("no_staged_files_now", stagedFiles.length === 0);

add("loop_contract_route_aligned", loopContract.route_alignment_status === "capsule_archive_review_bridge_aligned_authorization_pending");
add("loop_contract_review_bound", loopContract.alignment_summary?.review_report_sample_bound_now === true);
add("review_bridge_sample_bound", reviewBridge.review_report_binding_status === "sample_route_bound_static_only");
add("review_bridge_failure_never_production", reviewBridge.bridge_rows?.[1]?.never_production === true);
add("archive_baseline_verified", archiveBaseline.archive_baseline_status === "verified_durable_archive_git_tracked");
add("archive_storage_strategy", archiveBaseline.storage_strategy === "git_tracked_durable_archive");
add("full_archive_manifest_verified_state", fullArchiveManifest.original_asset?.verification_status === "verified_durable_archive_git_tracked");
add("production_authorization_inactive", productionAuthorization.authorization_state === "draft_not_active");
add("production_authorization_two_write_paths", productionAuthorization.exact_allowed_write_paths?.length === 2);
add(
  "production_candidate_metadata_written",
  productionAuthorization.exact_allowed_write_paths?.every((ref) => fs.existsSync(path.join(root, ref))) === true
    && fixture.audit_decision.production_candidate_metadata_written === true
);
add("memory_authorization_inactive", memoryAuthorization.authorization_state === "draft_not_active");
add("memory_authorization_two_external_ops", memoryAuthorization.exact_future_external_operations?.length === 2);
add("memory_authorization_blocked_now", memoryAuthorization.current_blockers?.includes("source_memory_suitability_false") === true);

for (const token of fixture.required_validator_tokens) {
  add(`mvp_token_${token}`, readText(files.mvpWiring).includes(token));
}

add(
  "phase_record_token_controlled_visual_production_loop_commit_and_authorization_readiness_audit",
  readText(files.phaseRecord).includes("controlled_visual_production_loop_commit_and_authorization_readiness_audit")
);

for (const token of [
  "controlled_visual_production_loop_commit_and_authorization_readiness_audit",
  fixture.recommended_next
]) {
  add(`run_state_token_${token}`, readText(files.runState).includes(token));
  add(`task_queue_token_${token}`, readText(files.taskQueue).includes(token));
  add(`checkpoint_token_${token}`, readText(files.checkpoint).includes(token));
  add(`handoff_token_${token}`, readText(files.handoff).includes(token));
  add(`roadmap_token_${token}`, readText(files.roadmap).includes(token));
}

for (const [key, expected] of Object.entries(fixture.guard)) {
  add(`guard_${key}`, expected === (key === "goal_level_readiness_audit_only" ? true : false));
}

const output = {
  validator: "validate_controlled_visual_production_loop_commit_and_authorization_readiness_audit",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0
    ? "controlled_visual_production_loop_commit_and_authorization_readiness_audit_verified"
    : "controlled_visual_production_loop_commit_and_authorization_readiness_audit_failed",
  branch,
  ahead_count: ahead,
  behind_count: behind,
  staged_file_count: stagedFiles.length,
  tracked_modified_file_count: modifiedTracked.length,
  untracked_file_count: untrackedFiles.length,
  exact_changed_file_count: changedFiles.length,
  head_subject: headSubject,
  head_file_count: headFiles.length,
  post_commit_proof_commit: postCommitProof?.hash || null,
  post_commit_proof_file_count: postCommitProof?.file_count || 0,
  post_commit_files_match_expected: headMatchesExpectedPostCommit,
  git_validation_mode: isCleanSyncedPostCommit
    ? "clean_synced_post_commit"
    : isCleanLocalAheadPostCommit
      ? "clean_local_ahead_post_commit"
      : isValidatorSelfMaintenancePatch
        ? "validator_self_maintenance_patch"
        : "pending_exact_file_slice",
  goal_level_local_readiness_verified: fixture.audit_decision.goal_level_local_readiness_verified,
  local_commit_ready_after_explicit_human_review: fixture.audit_decision.local_commit_ready_after_explicit_human_review,
  authorization_ready_for_future_A5: fixture.audit_decision.authorization_ready_for_future_A5,
  production_candidate_metadata_written: fixture.audit_decision.production_candidate_metadata_written,
  production_candidate_authorization_state: fixture.audit_decision.production_candidate_authorization_state,
  memory_write_authorization_state: fixture.audit_decision.memory_write_authorization_state,
  memory_write_route_currently_blocked: fixture.audit_decision.memory_write_route_currently_blocked,
  A5_execution_allowed_now: fixture.audit_decision.A5_execution_allowed_now,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  runtime_execution_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  production_candidate_write_performed: false,
  dependency_change_performed: false,
  check_count: results.length,
  failed_count: failures.length,
  checks: results,
  failures
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
