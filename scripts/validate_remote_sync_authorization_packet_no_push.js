#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const targetRef = "configs/local_paths/doubaogen_plugin_dir.local.yaml";
const expectedPhrase = "我明确授权将 agent-image-lab master 推送到 origin/master。";

const files = {
  phaseRecord: "docs/V0_6_105_REMOTE_SYNC_AUTHORIZATION_PACKET_NO_PUSH.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_104_push_pr_readiness_after_detrack_without_push.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_105_remote_sync_authorization_packet_no_push.json",
  receipt: "reports/memory_write_receipts/v0_6_105_remote_sync_authorization_packet_no_push.json",
  passFixture: "tests/schema_examples/remote_sync_authorization_packet_no_push.example.json",
  failFixture: "tests/schema_examples/remote_sync_authorization_packet_no_push_fail.example.json"
};

const expected = {
  phase: "v0_6_105_remote_sync_authorization_packet_no_push",
  status: "completed_validated_remote_sync_authorization_packet_no_push",
  sourcePhase: "v0_6_104_push_pr_readiness_after_detrack_without_push",
  recommendedNext: "await_explicit_remote_sync_authorization_or_continue_local_no_write_review"
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
    headShort: git(["rev-parse", "--short", "HEAD"]),
    ahead,
    behind,
    targetExists: fs.existsSync(repoPath(targetRef)),
    tracked,
    ignored
  };
}

function validateSource(source) {
  const record = source.push_pr_readiness_after_detrack_without_push;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.detrack_postcondition.working_copy_file_exists_after === true, "source must prove working copy exists");
  assert(record.detrack_postcondition.git_tracking_removed_after === true, "source must prove tracking removed");
  assert(record.detrack_postcondition.gitignore_rule_effective_after === true, "source must prove ignore rule effective");
  assert(record.detrack_postcondition.local_config_content_read === false, "source must not read local config content");
  assert(record.go_no_go.remote_write_authorized_now === false, "source must not authorize remote write");
  assert(record.go_no_go.next_auto_step_allowed === false, "source must stop before remote write");
}

function validatePreflight(preflight, context) {
  const required = [
    "git_status_short_branch",
    "ahead_behind_check",
    "dedicated_readiness_validator",
    "public_disclosure_gate",
    "smoke_gate",
    "mvp_gate",
    "resume_compaction_guard",
    "git_diff_check",
    "tracked_local_config_postconditions"
  ];
  required.forEach((key) => assert(preflight[key] === true, `${context} preflight.${key} must be true`));
}

function validateCommon(record, context, facts) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "remote_sync_authorization_packet_no_push", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_authorization_packet_only", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_authorization_packet_only", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const gitState = record.git_state_observed_before_checkpoint_commit || {};
  const post = record.detrack_postcondition_carried_forward || {};
  const authorization = record.authorization_packet || {};
  const validation = record.validation_observed || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(gitState.branch === "master", `${context} branch mismatch`);
  assert(gitState.tracking_ref === "origin/master", `${context} tracking ref mismatch`);
  assert(gitState.local_head_short === "198cbbd", `${context} local head mismatch`);
  assert(gitState.ahead_count === 46, `${context} ahead count mismatch`);
  assert(gitState.behind_count === 0, `${context} behind count mismatch`);
  assert(gitState.worktree_clean_before_checkpoint_edits === true, `${context} worktree clean precondition mismatch`);

  assert(post.target_ref === targetRef, `${context} target ref mismatch`);
  assert(post.working_copy_file_exists_after === true, `${context} working copy must exist`);
  assert(post.git_tracking_removed_after === true, `${context} git tracking must be removed`);
  assert(post.git_ls_files_returns_target_after === false, `${context} git ls-files must not return target`);
  assert(post.gitignore_rule_effective_after === true, `${context} gitignore must be effective`);
  assert(post.local_config_content_read === false, `${context} local config content read must be false`);
  assert(post.tracked_local_path_config_blocks_sync === false, `${context} tracked local config must not block sync`);

  assert(facts.branch === "master", "current branch must be master");
  assert(facts.ahead >= gitState.ahead_count, "current ahead count must be at least checkpoint observation");
  assert(facts.behind === 0, "current behind count must remain zero");
  assert(facts.targetExists === true, "current working copy local config file must exist");
  assert(!facts.tracked.includes(targetRef), "current Git index must not track local config target");
  assert(facts.ignored.includes("configs/local_paths/*.local.yaml"), "current ignore rule must cover local config target");

  assert(authorization.request_only === true, `${context} authorization request_only must be true`);
  assert(authorization.remote_write_authorized_now === false, `${context} remote write auth must be false`);
  assert(authorization.can_execute_now === false, `${context} can_execute_now must be false`);
  assert(authorization.candidate_remote_command_after_explicit_authorization === "git push origin master", `${context} candidate command mismatch`);
  assert(authorization.required_authorization_phrase_cn === expectedPhrase, `${context} authorization phrase mismatch`);
  assert(authorization.ambiguous_continue_is_not_enough === true, `${context} ambiguous continue guard must be true`);
  assert(authorization.pr_creation_authorized_now === false, `${context} PR creation authorization must be false`);
  assert(authorization.push_safety_classification_now === "remote_write_red_boundary_until_explicit_authorization", `${context} push safety classification mismatch`);

  validatePreflight(record.future_push_preflight_required || {}, context);

  for (const [key, value] of Object.entries(validation)) {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  }
  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }

  assert(goNoGo.authorization_packet_created === true, `${context} authorization packet must be created`);
  assert(goNoGo.remote_write_authorized_now === false, `${context} go/no-go remote write auth must be false`);
  assert(goNoGo.can_execute_now === false, `${context} go/no-go can execute must be false`);
  assert(goNoGo.push_ready_now === false, `${context} push ready must be false`);
  assert(goNoGo.pr_ready_now === false, `${context} PR ready must be false`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto step must be false`);
  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} recommended next auto must be false`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_remote_sync_authorization_packet_no_push_receipt", "receipt type mismatch");
  assert(receipt.status === expected.status, "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.remote_write_performed === false, "receipt remote write must be false");
  assert(receipt.calls_used.provider_calls === 0, "receipt provider calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "receipt memory writes must be zero");
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
  const report = readJson(files.report).remote_sync_authorization_packet_no_push;
  const receipt = readJson(files.receipt).remote_sync_authorization_packet_no_push;
  const passFixture = readJson(files.passFixture).remote_sync_authorization_packet_no_push;
  const failFixture = readJson(files.failFixture).remote_sync_authorization_packet_no_push;

  for (const token of [
    `phase: ${expected.phase}`,
    "candidate_remote_command_after_explicit_authorization: git push origin master",
    "remote_write_authorized_now: false",
    "can_execute_now: false",
    expectedPhrase,
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
    expectFailure(passFixture, "remote_write_authorized_fails", (candidate) => {
      candidate.authorization_packet.remote_write_authorized_now = true;
    }, facts),
    expectFailure(passFixture, "can_execute_now_fails", (candidate) => {
      candidate.authorization_packet.can_execute_now = true;
    }, facts),
    expectFailure(passFixture, "force_push_command_fails", (candidate) => {
      candidate.authorization_packet.candidate_remote_command_after_explicit_authorization = "git push --force origin master";
    }, facts),
    expectFailure(passFixture, "missing_phrase_fails", (candidate) => {
      candidate.authorization_packet.required_authorization_phrase_cn = "";
    }, facts),
    expectFailure(passFixture, "ambiguous_continue_allowed_fails", (candidate) => {
      candidate.authorization_packet.ambiguous_continue_is_not_enough = false;
    }, facts),
    expectFailure(passFixture, "working_copy_missing_fails", (candidate) => {
      candidate.detrack_postcondition_carried_forward.working_copy_file_exists_after = false;
    }, facts),
    expectFailure(passFixture, "tracking_regression_fails", (candidate) => {
      candidate.detrack_postcondition_carried_forward.git_tracking_removed_after = false;
    }, facts),
    expectFailure(passFixture, "content_read_fails", (candidate) => {
      candidate.detrack_postcondition_carried_forward.local_config_content_read = true;
    }, facts),
    expectFailure(passFixture, "preflight_missing_fails", (candidate) => {
      candidate.future_push_preflight_required.mvp_gate = false;
    }, facts),
    expectFailure(passFixture, "push_performed_fails", (candidate) => {
      candidate.guard.push_performed = true;
    }, facts)
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    current_head_short: facts.headShort,
    current_ahead_count: facts.ahead,
    current_behind_count: facts.behind,
    remote_write_authorized_now: report.authorization_packet.remote_write_authorized_now,
    can_execute_now: report.authorization_packet.can_execute_now,
    candidate_remote_command_after_explicit_authorization: report.authorization_packet.candidate_remote_command_after_explicit_authorization,
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
