#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = {
  fixture: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_CHECKPOINT_READINESS.example.json",
  phaseRecord: "docs/CONTROLLED_VISUAL_PRODUCTION_LOOP_CHECKPOINT_READINESS_GATE.md",
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

const fixture = readJson(files.fixture).controlled_visual_production_loop_checkpoint_readiness;
const stagedFiles = lines(runGit(["diff", "--cached", "--name-only"]));
const modifiedTracked = lines(runGit(["diff", "--name-only"]));
const untrackedFiles = lines(runGit(["ls-files", "--others", "--exclude-standard"]));
const changedFiles = [...modifiedTracked, ...untrackedFiles].sort();
const branch = runGit(["branch", "--show-current"]);
const ahead = Number(runGit(["rev-list", "--count", "origin/master..HEAD"]));
const behind = Number(runGit(["rev-list", "--count", "HEAD..origin/master"]));

const exactExpected = [...fixture.exact_changed_files].sort();
const candidateGroupsTotal = fixture.candidate_groups.reduce((sum, group) => sum + group.count, 0);

add("phase_record_exists", fs.existsSync(path.join(root, files.phaseRecord)));
add("fixture_phase", fixture.phase === "controlled_visual_production_loop_checkpoint_readiness_gate");
add("execution_mode", fixture.execution_mode === "exact_file_checkpoint_readiness_review_only");
add("readiness_local_slice_ready", fixture.readiness_decision.local_slice_ready_for_human_reviewed_commit === true);
add("readiness_staging_blocked", fixture.readiness_decision.staging_allowed_now === false);
add("readiness_commit_blocked", fixture.readiness_decision.commit_allowed_now === false);
add("readiness_push_blocked", fixture.readiness_decision.push_allowed_now === false);
add("branch", branch === fixture.git_expectation.branch, branch);
add("ahead_count", ahead === fixture.git_expectation.ahead_count, String(ahead));
add("behind_count", behind === fixture.git_expectation.behind_count, String(behind));
add("staged_file_count", stagedFiles.length === fixture.git_expectation.staged_file_count, String(stagedFiles.length));
add("tracked_modified_count", modifiedTracked.length === fixture.git_expectation.tracked_modified_file_count, String(modifiedTracked.length));
add("untracked_file_count", untrackedFiles.length === fixture.git_expectation.untracked_file_count, String(untrackedFiles.length));
add("exact_changed_file_count", changedFiles.length === fixture.git_expectation.exact_changed_file_count, String(changedFiles.length));
add("candidate_groups_total_matches", candidateGroupsTotal === fixture.git_expectation.exact_changed_file_count, String(candidateGroupsTotal));
add("exact_changed_files_match", JSON.stringify(changedFiles) === JSON.stringify(exactExpected));
add("no_staged_files_now", stagedFiles.length === 0);

for (const forbidden of fixture.forbidden_path_families) {
  add(`forbidden_path_${forbidden}_untouched`, !changedFiles.some((file) => file === forbidden || file.startsWith(forbidden)));
}

for (const [key, expected] of Object.entries(fixture.guard)) {
  add(`guard_${key}`, expected === (key === "exact_file_checkpoint_readiness_only" ? true : false));
}

for (const token of [
  "controlled_visual_production_loop_checkpoint_readiness",
  "validate_controlled_visual_production_loop_checkpoint_readiness.js"
]) {
  add(`phase_record_token_${token}`, readText(files.phaseRecord).includes(token));
}

for (const token of [
  "validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js",
  "validate_controlled_visual_production_loop_memory_write_authorization.js",
  "validate_controlled_visual_production_loop_production_candidate_authorization.js",
  "validate_controlled_visual_production_loop_review_bridge.js",
  "validate_controlled_visual_production_loop_contract.js"
]) {
  add(`mvp_token_${token}`, readText(files.mvpWiring).includes(token));
}

for (const token of [
  "controlled_visual_production_loop_checkpoint_readiness_gate",
  "explicit_A5_activation_decision_for_controlled_visual_production_loop_production_candidate_static_only"
]) {
  add(`run_state_token_${token}`, readText(files.runState).includes(token));
  add(`task_queue_token_${token}`, readText(files.taskQueue).includes(token));
  add(`checkpoint_token_${token}`, readText(files.checkpoint).includes(token));
  add(`handoff_token_${token}`, readText(files.handoff).includes(token));
}

const output = {
  validator: "validate_controlled_visual_production_loop_checkpoint_readiness",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0 ? "controlled_visual_production_loop_checkpoint_readiness_verified" : "controlled_visual_production_loop_checkpoint_readiness_failed",
  branch,
  ahead_count: ahead,
  behind_count: behind,
  staged_file_count: stagedFiles.length,
  tracked_modified_file_count: modifiedTracked.length,
  untracked_file_count: untrackedFiles.length,
  exact_changed_file_count: changedFiles.length,
  local_slice_ready_for_human_reviewed_commit: fixture.readiness_decision.local_slice_ready_for_human_reviewed_commit,
  staging_allowed_now: fixture.readiness_decision.staging_allowed_now,
  commit_allowed_now: fixture.readiness_decision.commit_allowed_now,
  push_allowed_now: fixture.readiness_decision.push_allowed_now,
  exact_changed_files: changedFiles,
  check_count: results.length,
  failed_count: failures.length,
  checks: results,
  failures
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
