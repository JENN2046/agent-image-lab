#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const targetRef = "configs/local_paths/doubaogen_plugin_dir.local.yaml";

const files = {
  phaseRecord: "docs/V0_6_104_PUSH_PR_READINESS_AFTER_DETRACK_WITHOUT_PUSH.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_103_tracked_local_path_config_detrack_execution_postcondition.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_104_push_pr_readiness_after_detrack_without_push.json",
  receipt: "reports/memory_write_receipts/v0_6_104_push_pr_readiness_after_detrack_without_push.json",
  passFixture: "tests/schema_examples/push_pr_readiness_after_detrack_without_push.example.json",
  failFixture: "tests/schema_examples/push_pr_readiness_after_detrack_without_push_fail.example.json"
};

const expected = {
  phase: "v0_6_104_push_pr_readiness_after_detrack_without_push",
  status: "completed_validated_push_pr_readiness_after_detrack_without_push",
  sourcePhase: "v0_6_103_tracked_local_path_config_detrack_execution_postcondition",
  recommendedNext: "pause_before_push_or_request_explicit_remote_write_authorization"
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

function currentFacts() {
  const [ahead, behind] = git(["rev-list", "--left-right", "--count", "HEAD...origin/master"])
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10));
  const tracked = git(["ls-files", "configs/local_paths/*.local.yaml"])
    .split(/\r?\n/)
    .filter(Boolean);
  const ignored = git(["check-ignore", "--verbose", "--", targetRef]);
  return {
    branch: git(["branch", "--show-current"]),
    ahead,
    behind,
    targetExists: fs.existsSync(repoPath(targetRef)),
    tracked,
    ignored
  };
}

function validateSource(source) {
  const record = source.tracked_local_path_config_detrack_execution_postcondition;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.execution_result.working_copy_file_exists_after === true, "source must prove working copy exists");
  assert(record.execution_result.git_tracking_removed_after === true, "source must prove tracking removed");
  assert(record.execution_result.gitignore_rule_effective_after === true, "source must prove ignore rule effective");
  assert(record.execution_result.local_config_content_read === false, "source must not read local config content");
}

function validateCommon(record, context, facts) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "push_pr_readiness_after_detrack_without_push", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_readiness_refresh", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_readiness_refresh", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const gitState = record.git_state_observed_before_checkpoint_commit || {};
  const post = record.detrack_postcondition || {};
  const readiness = record.readiness_result || {};
  const validation = record.validation_observed || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(gitState.branch === "master", `${context} branch mismatch`);
  assert(gitState.tracking_ref === "origin/master", `${context} tracking ref mismatch`);
  assert(gitState.ahead_count === 45, `${context} checkpoint ahead count mismatch`);
  assert(gitState.behind_count === 0, `${context} checkpoint behind count mismatch`);
  assert(gitState.worktree_clean_before_checkpoint_edits === true, `${context} worktree clean precondition mismatch`);

  assert(post.target_ref === targetRef, `${context} target ref mismatch`);
  assert(post.working_copy_file_exists_after === true, `${context} working copy must exist`);
  assert(post.git_tracking_removed_after === true, `${context} git tracking must be removed`);
  assert(post.git_ls_files_returns_target_after === false, `${context} git ls-files must not return target`);
  assert(post.gitignore_rule_effective_after === true, `${context} gitignore must be effective`);
  assert(post.local_config_content_read === false, `${context} local config content read must be false`);
  assert(post.tracked_local_path_config_blocker_resolved === true, `${context} tracked local config blocker must be resolved`);

  assert(facts.branch === "master", "current branch must be master");
  assert(facts.ahead >= gitState.ahead_count, "current ahead count must be at least checkpoint observation");
  assert(facts.behind === 0, "current behind count must remain zero");
  assert(facts.targetExists === true, "current working copy file must exist");
  assert(!facts.tracked.includes(targetRef), "current git index must not track target");
  assert(facts.ignored.includes("configs/local_paths/*.local.yaml"), "current ignore rule must cover target");

  assert(readiness.remote_write_authorized_now === false, `${context} remote write authorization must be false`);
  assert(readiness.tracked_local_path_config_blocks_sync === false, `${context} tracked blocker must be false`);
  assert(readiness.remote_sync_preconditions_improved === true, `${context} remote sync preconditions must improve`);
  assert(readiness.push_ready_now === false, `${context} push ready must remain false without authorization`);
  assert(readiness.pr_ready_now === false, `${context} pr ready must remain false without authorization`);
  assert(readiness.reason.includes("Explicit remote write authorization"), `${context} readiness reason must cite explicit remote write authorization`);

  for (const [key, value] of Object.entries(validation)) {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  }
  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }

  assert(goNoGo.readiness_refresh_created === true, `${context} readiness refresh must be created`);
  assert(goNoGo.tracked_local_path_config_blocker_resolved === true, `${context} tracked blocker must be resolved`);
  assert(goNoGo.remote_sync_ready_now === false, `${context} remote sync ready must be false without authorization`);
  assert(goNoGo.remote_write_authorized_now === false, `${context} remote write auth must be false`);
  assert(goNoGo.push_ready_now === false, `${context} push ready must be false`);
  assert(goNoGo.pr_ready_now === false, `${context} pr ready must be false`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} recommended next auto must be false`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_push_pr_readiness_after_detrack_without_push_receipt", "receipt type mismatch");
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

function expectFailure(baseRecord, caseId, mutate, facts) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateCommon(candidate, caseId, facts);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  requireFiles();
  const facts = currentFacts();
  validateSource(readJson(files.sourceReport));

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).push_pr_readiness_after_detrack_without_push;
  const receipt = readJson(files.receipt).push_pr_readiness_after_detrack_without_push;
  const passFixture = readJson(files.passFixture).push_pr_readiness_after_detrack_without_push;
  const failFixture = readJson(files.failFixture).push_pr_readiness_after_detrack_without_push;

  for (const token of [
    `phase: ${expected.phase}`,
    "tracked_local_path_config_detected: false",
    "tracked_local_path_config_blocker_resolved: true",
    "push_ready_now: false",
    expected.recommendedNext
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  validateCommon(report, "report", facts);
  validateCommon(passFixture, "pass_fixture", facts);
  validateReceipt(receipt);

  let failFixtureCaught = false;
  try {
    validateCommon(failFixture, "fail_fixture", facts);
  } catch {
    failFixtureCaught = true;
  }
  assert(failFixtureCaught, "fail fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "working_copy_missing_fails", (candidate) => {
      candidate.detrack_postcondition.working_copy_file_exists_after = false;
    }, facts),
    expectFailure(passFixture, "tracking_not_removed_fails", (candidate) => {
      candidate.detrack_postcondition.git_tracking_removed_after = false;
    }, facts),
    expectFailure(passFixture, "gitignore_not_effective_fails", (candidate) => {
      candidate.detrack_postcondition.gitignore_rule_effective_after = false;
    }, facts),
    expectFailure(passFixture, "content_read_fails", (candidate) => {
      candidate.detrack_postcondition.local_config_content_read = true;
    }, facts),
    expectFailure(passFixture, "tracked_blocker_not_resolved_fails", (candidate) => {
      candidate.detrack_postcondition.tracked_local_path_config_blocker_resolved = false;
    }, facts),
    expectFailure(passFixture, "remote_write_authorized_fails", (candidate) => {
      candidate.readiness_result.remote_write_authorized_now = true;
    }, facts),
    expectFailure(passFixture, "push_ready_true_fails", (candidate) => {
      candidate.readiness_result.push_ready_now = true;
    }, facts),
    expectFailure(passFixture, "push_performed_fails", (candidate) => {
      candidate.guard.push_performed = true;
    }, facts),
    expectFailure(passFixture, "next_auto_allowed_fails", (candidate) => {
      candidate.go_no_go.next_auto_step_allowed = true;
    }, facts)
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    current_ahead_count: facts.ahead,
    current_behind_count: facts.behind,
    tracked_local_path_config_blocker_resolved: report.detrack_postcondition.tracked_local_path_config_blocker_resolved,
    remote_write_authorized_now: report.readiness_result.remote_write_authorized_now,
    push_ready_now: report.readiness_result.push_ready_now,
    pr_ready_now: report.readiness_result.pr_ready_now,
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
