#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_99_TRACKED_LOCAL_PATH_CONFIG_DETRACK_AUTHORIZATION_PACKET_NO_EXEC.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_98_tracked_local_path_config_hygiene_preflight_no_read.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_99_tracked_local_path_config_detrack_authorization_packet_no_exec.json",
  receipt: "reports/memory_write_receipts/v0_6_99_tracked_local_path_config_detrack_authorization_packet_no_exec.json",
  passFixture: "tests/schema_examples/tracked_local_path_config_detrack_authorization_packet_no_exec.example.json",
  failFixture: "tests/schema_examples/tracked_local_path_config_detrack_authorization_packet_no_exec_fail.example.json"
};

const expected = {
  phase: "v0_6_99_tracked_local_path_config_detrack_authorization_packet_no_exec",
  status: "completed_validated_tracked_local_path_config_detrack_authorization_packet_no_exec",
  sourcePhase: "v0_6_98_tracked_local_path_config_hygiene_preflight_no_read",
  targetRef: "configs/local_paths/doubaogen_plugin_dir.local.yaml",
  allowedFutureCommand: "git rm --cached -- configs/local_paths/doubaogen_plugin_dir.local.yaml",
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

function validateGitState() {
  const tracked = git(["ls-files", "configs/local_paths/*.local.yaml"])
    .split(/\r?\n/)
    .filter(Boolean);
  assert(tracked.includes(expected.targetRef), "target must still be tracked before no-exec authorization packet");
  const ignore = git(["check-ignore", "--no-index", "-v", expected.targetRef]);
  assert(ignore.includes("configs/local_paths/*.local.yaml"), "ignore rule must match target");
}

function validateSource(source) {
  const record = source.tracked_local_path_config_hygiene_preflight_no_read;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.observed_state.tracked_local_path_config_detected === true, "source must detect tracked config");
  assert(record.guard.local_config_content_read === false, "source must not read config content");
  assert(record.guard.git_rm_cached_performed === false, "source must not perform git rm cached");
}

function validateCommon(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "detrack_authorization_packet_no_exec", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_authorization_packet_only", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_authorization_packet_only", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const target = record.target || {};
  const packet = record.authorization_packet || {};
  const effects = packet.allowed_effects_future_only || {};
  const validation = record.validation_plan || {};
  const rollback = record.rollback_plan || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(target.tracked_path_ref === expected.targetRef, `${context} target ref mismatch`);
  assert(target.ignore_rule_ref === ".gitignore:configs/local_paths/*.local.yaml", `${context} ignore rule ref mismatch`);
  assert(target.tracked_probe_command === "git ls-files configs/local_paths/*.local.yaml", `${context} tracked probe mismatch`);
  assert(target.ignore_probe_command === `git check-ignore --no-index -v ${expected.targetRef}`, `${context} ignore probe mismatch`);

  assert(packet.packet_id === "tracked_local_path_config_detrack_exact_path_packet_v1", `${context} packet id mismatch`);
  assert(packet.allowed_future_command === expected.allowedFutureCommand, `${context} allowed future command mismatch`);
  assert(Array.isArray(packet.allowed_future_paths) && packet.allowed_future_paths.length === 1, `${context} allowed paths count mismatch`);
  assert(packet.allowed_future_paths[0] === expected.targetRef, `${context} allowed path mismatch`);
  assert((packet.forbidden_paths || []).includes(".env.local"), `${context} forbidden paths must include .env.local`);
  assert((packet.forbidden_paths || []).includes("configs/local_secrets/"), `${context} forbidden paths must include local secrets`);
  assert(effects.index_remove_one_tracked_path === true, `${context} future index remove effect must be true`);
  assert(effects.working_copy_file_deleted === false, `${context} working copy delete must be false`);
  assert(effects.file_content_read === false, `${context} file content read must be false`);
  assert(effects.secret_value_read === false, `${context} secret value read must be false`);
  assert(effects.remote_write === false, `${context} remote write must be false`);
  assert(packet.requires_explicit_owner_execution_authorization === true, `${context} explicit owner authorization must be required`);
  assert(packet.can_execute_now === false, `${context} packet must not execute now`);

  assert((validation.before_execution || []).includes("git status --short --branch"), `${context} before validation incomplete`);
  assert((validation.before_execution || []).includes("git ls-files configs/local_paths/*.local.yaml"), `${context} before tracked validation missing`);
  assert((validation.after_future_execution || []).includes("npm run validate:public-disclosure"), `${context} after public disclosure validation missing`);
  assert((validation.after_future_execution || []).includes("npm run validate:smoke"), `${context} after smoke validation missing`);

  assert(rollback.rollback_if_staged_only === `git restore --staged -- ${expected.targetRef}`, `${context} staged rollback mismatch`);
  assert(rollback.must_not_delete_working_copy === true, `${context} rollback must preserve working copy`);

  for (const [key, value] of Object.entries(guard)) {
    if (key === "authorization_packet_only") {
      assert(value === true, `${context} authorization packet only must be true`);
    } else {
      assert(value === false, `${context} guard.${key} must be false`);
    }
  }

  assert(goNoGo.authorization_packet_created === true, `${context} authorization packet must be created`);
  assert(goNoGo.exact_future_command_defined === true, `${context} exact future command must be defined`);
  assert(goNoGo.working_copy_delete_allowed === false, `${context} working copy delete must not be allowed`);
  assert(goNoGo.content_read_allowed === false, `${context} content read must not be allowed`);
  assert(goNoGo.secret_value_read_allowed === false, `${context} secret read must not be allowed`);
  assert(goNoGo.execution_performed === false, `${context} execution must be false`);
  assert(goNoGo.remediation_performed === false, `${context} remediation must be false`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} recommended next auto must be false`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_detrack_authorization_packet_no_exec_receipt", "receipt type mismatch");
  assert(receipt.status === expected.status, "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.target_ref === expected.targetRef, "receipt target mismatch");
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
  validateGitState();
  validateSource(readJson(files.sourceReport));

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).tracked_local_path_config_detrack_authorization_packet_no_exec;
  const receipt = readJson(files.receipt).tracked_local_path_config_detrack_authorization_packet_no_exec;
  const passFixture = readJson(files.passFixture).tracked_local_path_config_detrack_authorization_packet_no_exec;
  const failFixture = readJson(files.failFixture).tracked_local_path_config_detrack_authorization_packet_no_exec;

  for (const token of [
    `phase: ${expected.phase}`,
    "authorization_packet_created: true",
    "content_read_performed: false",
    "git_rm_cached_performed: false",
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
    expectFailure(passFixture, "wrong_command_fails", (candidate) => {
      candidate.authorization_packet.allowed_future_command = `git rm -f ${expected.targetRef}`;
    }),
    expectFailure(passFixture, "working_copy_delete_allowed_fails", (candidate) => {
      candidate.authorization_packet.allowed_effects_future_only.working_copy_file_deleted = true;
    }),
    expectFailure(passFixture, "content_read_allowed_fails", (candidate) => {
      candidate.authorization_packet.allowed_effects_future_only.file_content_read = true;
    }),
    expectFailure(passFixture, "missing_owner_authorization_fails", (candidate) => {
      candidate.authorization_packet.requires_explicit_owner_execution_authorization = false;
    }),
    expectFailure(passFixture, "can_execute_now_fails", (candidate) => {
      candidate.authorization_packet.can_execute_now = true;
    }),
    expectFailure(passFixture, "git_rm_cached_performed_fails", (candidate) => {
      candidate.guard.git_rm_cached_performed = true;
    }),
    expectFailure(passFixture, "remediation_performed_fails", (candidate) => {
      candidate.go_no_go.remediation_performed = true;
    }),
    expectFailure(passFixture, "push_allowed_fails", (candidate) => {
      candidate.authorization_packet.allowed_effects_future_only.remote_write = true;
    }),
    expectFailure(passFixture, "raw_local_path_fails", (candidate) => {
      candidate.target.tracked_path_ref = "A:\\secret\\config.local.yaml";
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    target_ref: report.target.tracked_path_ref,
    authorization_packet_created: report.go_no_go.authorization_packet_created,
    allowed_future_command: report.authorization_packet.allowed_future_command,
    can_execute_now: report.authorization_packet.can_execute_now,
    content_read_performed: report.guard.local_config_content_read,
    git_rm_cached_performed: report.guard.git_rm_cached_performed,
    remediation_performed: report.go_no_go.remediation_performed,
    secret_value_read_performed: report.guard.secret_value_read_performed,
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
