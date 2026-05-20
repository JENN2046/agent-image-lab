#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  fixture: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_EXACT_FILE_COMMIT_READINESS_REVIEW.example.json",
  phaseRecord: "docs/CONTROLLED_VISUAL_PRODUCTION_LOOP_EXACT_FILE_COMMIT_READINESS_REVIEW.md",
  mvpWiring: "scripts/validate_mvp_capsule_product_core.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md"
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

const results = [];
const failures = [];
const add = (check, passed, detail = null) => {
  results.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
  if (!passed) failures.push({ check, ...(detail === null ? {} : { detail }) });
};

const fixture = readJson(files.fixture).controlled_visual_production_loop_exact_file_commit_readiness_review;
const stagedFiles = lines(runGit(["diff", "--cached", "--name-only"]));
const modifiedTracked = lines(runGit(["diff", "--name-only"]));
const untrackedFiles = lines(runGit(["ls-files", "--others", "--exclude-standard"]));
const changedFiles = [...modifiedTracked, ...untrackedFiles].sort();
const branch = runGit(["branch", "--show-current"]);
const ahead = Number(runGit(["rev-list", "--count", "origin/master..HEAD"]));
const behind = Number(runGit(["rev-list", "--count", "HEAD..origin/master"]));

const exactExpected = [...fixture.exact_stage_files].sort();
const candidateGroupsTotal = fixture.candidate_groups.reduce((sum, group) => sum + group.count, 0);

add("phase_record_exists", fs.existsSync(path.join(root, files.phaseRecord)));
add("fixture_phase", fixture.phase === "controlled_visual_production_loop_exact_file_commit_readiness_review");
add("execution_mode", fixture.execution_mode === "exact_file_commit_readiness_review_only");
add("commit_ready_after_human_review", fixture.commit_readiness_decision.local_commit_ready_after_explicit_human_review === true);
add("auto_commit_blocked", fixture.commit_readiness_decision.auto_commit_allowed_now === false);
add("staging_blocked", fixture.commit_readiness_decision.staging_allowed_now === false);
add("commit_blocked", fixture.commit_readiness_decision.commit_allowed_now === false);
add("push_blocked", fixture.commit_readiness_decision.push_allowed_now === false);
add("commit_message_present", fixture.commit_readiness_decision.suggested_commit_message === "chore: ready controlled visual production loop slice");
add("commit_trailer_present", fixture.commit_readiness_decision.commit_trailer_required === "Co-authored-by: Codex <noreply@openai.com>");
add("branch", branch === fixture.git_expectation.branch, branch);
add("ahead_count", ahead === fixture.git_expectation.ahead_count, String(ahead));
add("behind_count", behind === fixture.git_expectation.behind_count, String(behind));
add("staged_file_count", stagedFiles.length === fixture.git_expectation.staged_file_count, String(stagedFiles.length));
add("tracked_modified_count", modifiedTracked.length === fixture.git_expectation.tracked_modified_file_count, String(modifiedTracked.length));
add("untracked_file_count", untrackedFiles.length === fixture.git_expectation.untracked_file_count, String(untrackedFiles.length));
add("exact_stage_file_count", changedFiles.length === fixture.git_expectation.exact_stage_file_count, String(changedFiles.length));
add("candidate_groups_total_matches", candidateGroupsTotal === fixture.git_expectation.exact_stage_file_count, String(candidateGroupsTotal));
add("exact_stage_files_match", JSON.stringify(changedFiles) === JSON.stringify(exactExpected));
add("no_staged_files_now", stagedFiles.length === 0);

for (const forbidden of fixture.forbidden_path_families) {
  add(`forbidden_path_${forbidden}_untouched`, !changedFiles.some((file) => file === forbidden || file.startsWith(forbidden)));
}

for (const [key, expected] of Object.entries(fixture.guard)) {
  add(`guard_${key}`, expected === (key === "exact_file_commit_readiness_review_only" ? true : false));
}

for (const token of [
  "controlled_visual_production_loop_exact_file_commit_readiness_review",
  "chore: ready controlled visual production loop slice",
  "Co-authored-by: Codex <noreply@openai.com>"
]) {
  add(`phase_record_token_${token}`, readText(files.phaseRecord).includes(token));
}

for (const token of [
  "validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "validate_controlled_visual_production_loop_memory_write_authorization.js",
  "validate_controlled_visual_production_loop_production_candidate_authorization.js",
  "validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js"
]) {
  add(`mvp_token_${token}`, readText(files.mvpWiring).includes(token));
}

for (const token of [
  "controlled_visual_production_loop_exact_file_commit_readiness_review",
  "explicit_A5_activation_decision_for_controlled_visual_production_loop_production_candidate_static_only"
]) {
  add(`run_state_token_${token}`, readText(files.runState).includes(token));
  add(`task_queue_token_${token}`, readText(files.taskQueue).includes(token));
  add(`checkpoint_token_${token}`, readText(files.checkpoint).includes(token));
  add(`handoff_token_${token}`, readText(files.handoff).includes(token));
}

const output = {
  validator: "validate_controlled_visual_production_loop_exact_file_commit_readiness_review",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0
    ? "controlled_visual_production_loop_exact_file_commit_readiness_review_verified"
    : "controlled_visual_production_loop_exact_file_commit_readiness_review_failed",
  branch,
  ahead_count: ahead,
  behind_count: behind,
  staged_file_count: stagedFiles.length,
  tracked_modified_file_count: modifiedTracked.length,
  untracked_file_count: untrackedFiles.length,
  exact_stage_file_count: changedFiles.length,
  local_commit_ready_after_explicit_human_review: fixture.commit_readiness_decision.local_commit_ready_after_explicit_human_review,
  auto_commit_allowed_now: fixture.commit_readiness_decision.auto_commit_allowed_now,
  staging_allowed_now: fixture.commit_readiness_decision.staging_allowed_now,
  commit_allowed_now: fixture.commit_readiness_decision.commit_allowed_now,
  push_allowed_now: fixture.commit_readiness_decision.push_allowed_now,
  exact_stage_files: changedFiles,
  suggested_commit_message: fixture.commit_readiness_decision.suggested_commit_message,
  commit_trailer_required: fixture.commit_readiness_decision.commit_trailer_required,
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
