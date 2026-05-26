#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_98_TRACKED_LOCAL_PATH_CONFIG_HYGIENE_PREFLIGHT_NO_READ.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_98_tracked_local_path_config_hygiene_preflight_no_read.json",
  receipt: "reports/memory_write_receipts/v0_6_98_tracked_local_path_config_hygiene_preflight_no_read.json",
  passFixture: "tests/schema_examples/tracked_local_path_config_hygiene_preflight_no_read.example.json",
  failFixture: "tests/schema_examples/tracked_local_path_config_hygiene_preflight_no_read_fail.example.json"
};

const expected = {
  phase: "v0_6_98_tracked_local_path_config_hygiene_preflight_no_read",
  status: "completed_validated_tracked_local_path_config_hygiene_preflight_no_read",
  sourcePhase: "v0_6_97_concrete_memory_adapter_packet_no_write",
  trackedPath: "configs/local_paths/doubaogen_plugin_dir.local.yaml",
  ignoreRuleRef: ".gitignore:configs/local_paths/*.local.yaml",
  recommendedNext: "pause_for_explicit_tracked_local_path_config_detrack_authorization_or_choose_no_write_task"
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
  assert(tracked.includes(expected.trackedPath), "tracked local path config not detected");

  const ignore = git(["check-ignore", "--no-index", "-v", expected.trackedPath]);
  assert(ignore.includes("configs/local_paths/*.local.yaml"), "ignore rule not detected");

  return { tracked, ignore };
}

function validateCommon(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "tracked_local_path_config_hygiene_preflight_no_read", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_no_read_path_hygiene_preflight", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_no_read_path_hygiene_preflight", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const scope = record.scope || {};
  const observed = record.observed_state || {};
  const risk = record.risk_assessment || {};
  const remediation = record.remediation_plan || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(scope.tracked_path_ref === expected.trackedPath, `${context} tracked path ref mismatch`);
  assert(scope.tracked_probe_command === "git ls-files configs/local_paths/*.local.yaml", `${context} tracked probe mismatch`);
  assert(scope.ignore_probe_command === `git check-ignore --no-index -v ${expected.trackedPath}`, `${context} ignore probe mismatch`);
  assert(scope.content_read_allowed === false, `${context} content read must not be allowed`);
  assert(scope.remediation_allowed_now === false, `${context} remediation must not be allowed now`);

  assert(observed.tracked_local_path_config_detected === true, `${context} tracked local config must be detected`);
  assert(Array.isArray(observed.tracked_local_path_config_refs), `${context} tracked refs must be array`);
  assert(observed.tracked_local_path_config_refs.includes(expected.trackedPath), `${context} tracked refs missing expected path`);
  assert(observed.ignore_rule_present === true, `${context} ignore rule must be present`);
  assert(observed.ignore_rule_ref === expected.ignoreRuleRef, `${context} ignore rule ref mismatch`);
  assert(observed.tracked_despite_ignore === true, `${context} tracked despite ignore must be true`);

  assert(risk.risk_type === "local_path_disclosure_and_config_hygiene", `${context} risk type mismatch`);
  assert(risk.content_sensitive_unknown === true, `${context} content sensitivity must remain unknown`);
  assert(risk.content_inspected === false, `${context} content must not be inspected`);
  assert(risk.safe_to_publish_without_remediation === false, `${context} publish safety must remain false`);

  assert(remediation.recommended_action === "exact_owner_authorized_git_rm_cached_after_no_secret_backup_review", `${context} remediation action mismatch`);
  assert(remediation.example_future_command_not_executed === `git rm --cached -- ${expected.trackedPath}`, `${context} future command mismatch`);
  assert(remediation.requires_explicit_owner_approval === true, `${context} approval must be required`);
  assert(remediation.must_not_delete_working_copy === true, `${context} must not delete working copy`);
  assert(remediation.must_not_read_secret_values === true, `${context} must not read secret values`);
  assert((remediation.must_validate_after || []).includes("npm run validate:public-disclosure"), `${context} remediation validation incomplete`);

  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }

  assert(goNoGo.preflight_created === true, `${context} preflight must be true`);
  assert(goNoGo.tracked_local_path_config_detected === true, `${context} tracked detection go/no-go mismatch`);
  assert(goNoGo.ignore_rule_present === true, `${context} ignore rule go/no-go mismatch`);
  assert(goNoGo.content_read_performed === false, `${context} content read must be false`);
  assert(goNoGo.remediation_performed === false, `${context} remediation must be false`);
  assert(goNoGo.detrack_authorized_now === false, `${context} detrack must not be authorized`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} recommended next auto must be false`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_no_read_path_hygiene_preflight_receipt", "receipt type mismatch");
  assert(receipt.status === expected.status, "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.tracked_path_ref === expected.trackedPath, "receipt tracked path mismatch");
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
  const gitState = validateGitState();

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).tracked_local_path_config_hygiene_preflight_no_read;
  const receipt = readJson(files.receipt).tracked_local_path_config_hygiene_preflight_no_read;
  const passFixture = readJson(files.passFixture).tracked_local_path_config_hygiene_preflight_no_read;
  const failFixture = readJson(files.failFixture).tracked_local_path_config_hygiene_preflight_no_read;

  for (const token of [
    `phase: ${expected.phase}`,
    "tracked_local_path_config_detected: true",
    "local_config_content_read: false",
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
    expectFailure(passFixture, "content_read_allowed_fails", (candidate) => {
      candidate.scope.content_read_allowed = true;
    }),
    expectFailure(passFixture, "remediation_allowed_fails", (candidate) => {
      candidate.scope.remediation_allowed_now = true;
    }),
    expectFailure(passFixture, "tracked_detection_missing_fails", (candidate) => {
      candidate.observed_state.tracked_local_path_config_detected = false;
    }),
    expectFailure(passFixture, "ignore_rule_missing_fails", (candidate) => {
      candidate.observed_state.ignore_rule_present = false;
    }),
    expectFailure(passFixture, "content_inspected_fails", (candidate) => {
      candidate.risk_assessment.content_inspected = true;
    }),
    expectFailure(passFixture, "approval_not_required_fails", (candidate) => {
      candidate.remediation_plan.requires_explicit_owner_approval = false;
    }),
    expectFailure(passFixture, "git_rm_cached_performed_fails", (candidate) => {
      candidate.guard.git_rm_cached_performed = true;
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
    tracked_local_path_config_detected: report.observed_state.tracked_local_path_config_detected,
    tracked_refs_from_git: gitState.tracked,
    ignore_rule_present: report.observed_state.ignore_rule_present,
    git_ignore_probe_matched: gitState.ignore.includes("configs/local_paths/*.local.yaml"),
    local_config_content_read: report.guard.local_config_content_read,
    remediation_performed: report.go_no_go.remediation_performed,
    git_rm_cached_performed: report.guard.git_rm_cached_performed,
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
