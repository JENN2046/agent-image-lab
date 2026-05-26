#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_100_PUSH_PR_READINESS_REFRESH_WITHOUT_PUSH.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_99_tracked_local_path_config_detrack_authorization_packet_no_exec.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_100_push_pr_readiness_refresh_without_push.json",
  receipt: "reports/memory_write_receipts/v0_6_100_push_pr_readiness_refresh_without_push.json",
  passFixture: "tests/schema_examples/push_pr_readiness_refresh_without_push.example.json",
  failFixture: "tests/schema_examples/push_pr_readiness_refresh_without_push_fail.example.json"
};

const expected = {
  phase: "v0_6_100_push_pr_readiness_refresh_without_push",
  status: "completed_validated_push_pr_readiness_refresh_without_push",
  sourcePhase: "v0_6_99_tracked_local_path_config_detrack_authorization_packet_no_exec",
  targetRef: "configs/local_paths/doubaogen_plugin_dir.local.yaml",
  originHash: "319ee3e5621b38d41cdddc29b1f4360c861215aa",
  recommendedNext: "await_explicit_detrack_execution_authorization_or_choose_no_write_task"
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function assertNoRawLocalDrivePath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawLocalDrivePath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawLocalDrivePath(item, `${context}.${key}`));
  }
}

function requireFiles() {
  Object.values(files).forEach((relativePath) => {
    assert(fs.existsSync(repoPath(relativePath)), `Missing required file: ${relativePath}`);
  });
}

function currentGitFacts() {
  const [ahead, behind] = git(["rev-list", "--left-right", "--count", "HEAD...origin/master"])
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10));
  const branch = git(["branch", "--show-current"]);
  const originHash = git(["rev-parse", "origin/master"]);
  const tracked = git(["ls-files", "configs/local_paths/*.local.yaml"])
    .split(/\r?\n/)
    .filter(Boolean);
  return { ahead, behind, branch, originHash, tracked };
}

function validateSource(source) {
  const record = source.tracked_local_path_config_detrack_authorization_packet_no_exec;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.go_no_go.authorization_packet_created === true, "source authorization packet must exist");
  assert(record.go_no_go.execution_performed === false, "source must not execute detrack");
  assert(record.guard.git_rm_cached_performed === false, "source must not run git rm cached");
}

function validateCommon(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "push_pr_readiness_refresh_without_push", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_readiness_refresh", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_readiness_refresh", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const gitState = record.git_state_observed_before_checkpoint_commit || {};
  const range = record.ahead_range_summary || {};
  const blockers = record.blocking_risks || {};
  const readiness = record.readiness_result || {};
  const validation = record.validation_observed || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(gitState.branch === "master", `${context} branch mismatch`);
  assert(gitState.tracking_ref === "origin/master", `${context} tracking ref mismatch`);
  assert(gitState.ahead_count === 41, `${context} checkpoint ahead count mismatch`);
  assert(gitState.behind_count === 0, `${context} checkpoint behind count mismatch`);
  assert(gitState.remote_head_observed === expected.originHash, `${context} origin hash mismatch`);
  assert(gitState.worktree_clean_before_checkpoint_edits === true, `${context} worktree clean precondition mismatch`);

  assert(range.changed_file_count === 72, `${context} changed file count mismatch`);
  assert(range.insertions === 28686, `${context} insertion count mismatch`);
  assert(range.deletions === 110, `${context} deletion count mismatch`);
  assert(range.diff_check_origin_range_passed === true, `${context} origin diff check must pass`);

  assert(blockers.tracked_local_path_config_detected === true, `${context} tracked local config blocker missing`);
  assert(blockers.tracked_local_path_config_ref === expected.targetRef, `${context} tracked path mismatch`);
  assert(blockers.ignore_rule_ref === ".gitignore:configs/local_paths/*.local.yaml", `${context} ignore rule ref mismatch`);
  assert(blockers.content_read_performed === false, `${context} content read must be false`);
  assert(blockers.detrack_execution_performed === false, `${context} detrack execution must be false`);

  assert(readiness.remote_write_authorized_now === false, `${context} remote write authorization must be false`);
  assert(readiness.push_ready_now === false, `${context} push ready must be false`);
  assert(readiness.pr_ready_now === false, `${context} pr ready must be false`);
  assert(readiness.reason.includes("tracked local path config"), `${context} readiness reason must cite tracked local path config`);

  for (const [key, value] of Object.entries(validation)) {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  }

  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }

  assert(goNoGo.readiness_refresh_created === true, `${context} readiness refresh must be created`);
  assert(goNoGo.remote_sync_ready_now === false, `${context} remote sync ready must be false`);
  assert(goNoGo.remote_write_authorized_now === false, `${context} remote write auth must be false`);
  assert(goNoGo.tracked_local_path_config_blocks_sync === true, `${context} tracked config must block sync`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} recommended next auto must be false`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_push_pr_readiness_refresh_without_push_receipt", "receipt type mismatch");
  assert(receipt.status === expected.status, "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.remote_write_performed === false, "remote write must be false");
  assert(receipt.calls_used.provider_calls === 0, "provider calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "memory writes must be zero");
  assert(receipt.next_auto_step_allowed === false, "receipt next auto must be false");
  assert(receipt.recommended_next === expected.recommendedNext, "receipt recommended next mismatch");
  for (const [key, value] of Object.entries(receipt.guard || {})) {
    assert(value === false, `receipt guard.${key} must be false`);
  }
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateCommon(candidate, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  requireFiles();
  const facts = currentGitFacts();
  assert(facts.branch === "master", "current branch must be master");
  assert(facts.ahead >= 41, "current ahead count must be at least the checkpoint observation");
  assert(facts.behind === 0, "current behind count must remain zero");
  assert(facts.originHash === expected.originHash, "origin/master hash changed since checkpoint observation");
  assert(facts.tracked.includes(expected.targetRef), "tracked local path config must remain tracked");
  validateSource(readJson(files.sourceReport));

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).push_pr_readiness_refresh_without_push;
  const receipt = readJson(files.receipt).push_pr_readiness_refresh_without_push;
  const passFixture = readJson(files.passFixture).push_pr_readiness_refresh_without_push;
  const failFixture = readJson(files.failFixture).push_pr_readiness_refresh_without_push;

  for (const token of [
    `phase: ${expected.phase}`,
    "push_ready_now: false",
    "pr_ready_now: false",
    "push_status: not_performed",
    expected.recommendedNext
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  validateCommon(report, "report");
  validateCommon(passFixture, "pass_fixture");
  validateReceipt(receipt);

  let failFixtureCaught = false;
  try {
    validateCommon(failFixture, "fail_fixture");
  } catch {
    failFixtureCaught = true;
  }
  assert(failFixtureCaught, "fail fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "push_ready_true_fails", (candidate) => {
      candidate.readiness_result.push_ready_now = true;
    }),
    expectFailure(passFixture, "pr_ready_true_fails", (candidate) => {
      candidate.readiness_result.pr_ready_now = true;
    }),
    expectFailure(passFixture, "remote_write_authorized_fails", (candidate) => {
      candidate.readiness_result.remote_write_authorized_now = true;
    }),
    expectFailure(passFixture, "tracked_blocker_missing_fails", (candidate) => {
      candidate.blocking_risks.tracked_local_path_config_detected = false;
    }),
    expectFailure(passFixture, "content_read_fails", (candidate) => {
      candidate.blocking_risks.content_read_performed = true;
    }),
    expectFailure(passFixture, "detrack_executed_fails", (candidate) => {
      candidate.blocking_risks.detrack_execution_performed = true;
    }),
    expectFailure(passFixture, "origin_diff_check_failed_fails", (candidate) => {
      candidate.ahead_range_summary.diff_check_origin_range_passed = false;
    }),
    expectFailure(passFixture, "push_performed_fails", (candidate) => {
      candidate.guard.push_performed = true;
    }),
    expectFailure(passFixture, "next_auto_allowed_fails", (candidate) => {
      candidate.go_no_go.next_auto_step_allowed = true;
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    current_ahead_count: facts.ahead,
    current_behind_count: facts.behind,
    observed_ahead_before_checkpoint_commit: report.git_state_observed_before_checkpoint_commit.ahead_count,
    tracked_local_path_config_detected: report.blocking_risks.tracked_local_path_config_detected,
    push_ready_now: report.readiness_result.push_ready_now,
    pr_ready_now: report.readiness_result.pr_ready_now,
    remote_write_authorized_now: report.readiness_result.remote_write_authorized_now,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    recommended_next: report.recommended_next,
    recommended_next_auto_execution_allowed: report.recommended_next_auto_execution_allowed
  };

  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
