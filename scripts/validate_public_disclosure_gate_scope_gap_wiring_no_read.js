#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_102_PUBLIC_DISCLOSURE_GATE_SCOPE_GAP_WIRING_NO_READ.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_101_public_disclosure_scope_gap_tracked_local_config_no_read.json",
  packageJson: "package.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_102_public_disclosure_gate_scope_gap_wiring_no_read.json",
  receipt: "reports/memory_write_receipts/v0_6_102_public_disclosure_gate_scope_gap_wiring_no_read.json",
  passFixture: "tests/schema_examples/public_disclosure_gate_scope_gap_wiring_no_read.example.json",
  failFixture: "tests/schema_examples/public_disclosure_gate_scope_gap_wiring_no_read_fail.example.json"
};

const expected = {
  phase: "v0_6_102_public_disclosure_gate_scope_gap_wiring_no_read",
  status: "completed_validated_public_disclosure_gate_scope_gap_wiring_no_read",
  sourcePhase: "v0_6_101_public_disclosure_scope_gap_tracked_local_config_no_read",
  targetRef: "configs/local_paths/doubaogen_plugin_dir.local.yaml",
  coreCommand: "node scripts/validate_public_repo_disclosure_audit.js",
  scopeGapCommand: "node scripts/validate_public_disclosure_scope_gap_tracked_local_config_no_read.js",
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
  const tracked = git(["ls-files", "configs/local_paths/*.local.yaml"])
    .split(/\r?\n/)
    .filter(Boolean);
  return { ahead, behind, branch, tracked };
}

function validateSource(source) {
  const record = source.public_disclosure_scope_gap_tracked_local_config_no_read;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.scope_analysis.tracked_local_path_config_detected === true, "source must detect tracked local config");
  assert(record.scope_analysis.validate_public_disclosure_pass_does_not_clear_tracked_local_config === true, "source must preserve scope boundary");
  assert(record.go_no_go.next_auto_step_allowed === false, "source next auto must be false");
}

function validatePackageScripts(packageJson) {
  const scripts = packageJson.scripts || {};
  const aggregate = scripts["validate:public-disclosure"];
  assert(scripts["validate:public-disclosure-core"] === expected.coreCommand, "public disclosure core script mismatch");
  assert(typeof aggregate === "string", "aggregate public disclosure script missing");
  assert(aggregate.includes(expected.coreCommand), "aggregate script must include core audit");
  assert(aggregate.includes(expected.scopeGapCommand), "aggregate script must include scope-gap validator");
  assert(aggregate.indexOf(expected.coreCommand) < aggregate.indexOf(expected.scopeGapCommand), "aggregate script must run core audit before scope-gap validator");
  return aggregate;
}

function validateCommon(record, context, aggregateScript) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "public_disclosure_gate_scope_gap_wiring_no_read", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_validation_wiring", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_validation_wiring", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const scriptChange = record.package_script_change || {};
  const boundary = record.scope_boundary || {};
  const validation = record.validation_observed || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(scriptChange.package_json_modified === true, `${context} package_json_modified must be true`);
  assert(scriptChange.dependency_manifest_changed === false, `${context} dependency manifest must not change`);
  assert(scriptChange.dependency_lock_changed === false, `${context} dependency lock must not change`);
  assert(scriptChange.script_ref === "validate:public-disclosure", `${context} script ref mismatch`);
  assert(scriptChange.core_script_ref === "validate:public-disclosure-core", `${context} core script ref mismatch`);
  assert(scriptChange.public_disclosure_core_command === expected.coreCommand, `${context} core command mismatch`);
  assert(scriptChange.scope_gap_command === expected.scopeGapCommand, `${context} scope gap command mismatch`);
  assert(scriptChange.aggregate_gate_runs_core_audit_first === true, `${context} core audit order missing`);
  assert(scriptChange.aggregate_gate_runs_scope_gap_second === true, `${context} scope gap order missing`);
  assert(aggregateScript.includes(scriptChange.public_disclosure_core_command), `${context} package aggregate missing core command`);
  assert(aggregateScript.includes(scriptChange.scope_gap_command), `${context} package aggregate missing scope gap command`);

  assert(boundary.tracked_local_path_config_ref === expected.targetRef, `${context} tracked local config ref mismatch`);
  assert(boundary.tracked_local_path_config_detected === true, `${context} tracked local config must be detected`);
  assert(boundary.public_disclosure_gate_includes_scope_gap_validator === true, `${context} aggregate gate must include scope gap`);
  assert(boundary.validate_public_disclosure_pass_does_not_clear_tracked_local_config === true, `${context} scope boundary missing`);
  assert(boundary.dedicated_validators_cover_risk === true, `${context} dedicated validator coverage missing`);

  for (const [key, value] of Object.entries(validation)) {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  }
  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }

  assert(goNoGo.gate_wiring_recorded === true, `${context} gate wiring must be recorded`);
  assert(goNoGo.public_disclosure_validator_clears_tracked_local_config === false, `${context} public disclosure must not clear tracked config`);
  assert(goNoGo.tracked_local_path_config_blocks_sync === true, `${context} tracked config must block sync`);
  assert(goNoGo.remote_sync_ready_now === false, `${context} remote sync ready must be false`);
  assert(goNoGo.remote_write_authorized_now === false, `${context} remote write auth must be false`);
  assert(goNoGo.push_ready_now === false, `${context} push ready must be false`);
  assert(goNoGo.pr_ready_now === false, `${context} pr ready must be false`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} recommended next auto must be false`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_public_disclosure_gate_scope_gap_wiring_no_read_receipt", "receipt type mismatch");
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

function expectFailure(baseRecord, caseId, mutate, aggregateScript) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateCommon(candidate, caseId, aggregateScript);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  requireFiles();
  const facts = currentGitFacts();
  assert(facts.branch === "master", "current branch must be master");
  assert(facts.ahead >= 43, "current ahead count must be at least the source checkpoint observation");
  assert(facts.behind === 0, "current behind count must remain zero");
  assert(facts.tracked.includes(expected.targetRef), "tracked local path config must remain tracked for this wiring record");

  validateSource(readJson(files.sourceReport));
  const aggregateScript = validatePackageScripts(readJson(files.packageJson));

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).public_disclosure_gate_scope_gap_wiring_no_read;
  const receipt = readJson(files.receipt).public_disclosure_gate_scope_gap_wiring_no_read;
  const passFixture = readJson(files.passFixture).public_disclosure_gate_scope_gap_wiring_no_read;
  const failFixture = readJson(files.failFixture).public_disclosure_gate_scope_gap_wiring_no_read;

  for (const token of [
    `phase: ${expected.phase}`,
    "package_json_modified: true",
    "public_disclosure_gate_includes_scope_gap_validator: true",
    "push_ready_now: false",
    expected.recommendedNext
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  validateCommon(report, "report", aggregateScript);
  validateCommon(passFixture, "pass_fixture", aggregateScript);
  validateReceipt(receipt);

  let failFixtureCaught = false;
  try {
    validateCommon(failFixture, "fail_fixture", aggregateScript);
  } catch {
    failFixtureCaught = true;
  }
  assert(failFixtureCaught, "fail fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "scope_gap_command_missing_fails", (candidate) => {
      candidate.package_script_change.scope_gap_command = "";
    }, aggregateScript),
    expectFailure(passFixture, "aggregate_scope_gap_false_fails", (candidate) => {
      candidate.package_script_change.aggregate_gate_runs_scope_gap_second = false;
    }, aggregateScript),
    expectFailure(passFixture, "dependency_manifest_changed_fails", (candidate) => {
      candidate.package_script_change.dependency_manifest_changed = true;
    }, aggregateScript),
    expectFailure(passFixture, "gate_does_not_include_scope_gap_fails", (candidate) => {
      candidate.scope_boundary.public_disclosure_gate_includes_scope_gap_validator = false;
    }, aggregateScript),
    expectFailure(passFixture, "tracked_config_not_detected_fails", (candidate) => {
      candidate.scope_boundary.tracked_local_path_config_detected = false;
    }, aggregateScript),
    expectFailure(passFixture, "local_config_content_read_fails", (candidate) => {
      candidate.guard.file_content_read_for_local_config = true;
    }, aggregateScript),
    expectFailure(passFixture, "git_rm_cached_fails", (candidate) => {
      candidate.guard.git_rm_cached_performed = true;
    }, aggregateScript),
    expectFailure(passFixture, "push_ready_true_fails", (candidate) => {
      candidate.go_no_go.push_ready_now = true;
    }, aggregateScript),
    expectFailure(passFixture, "next_auto_allowed_fails", (candidate) => {
      candidate.go_no_go.next_auto_step_allowed = true;
    }, aggregateScript)
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    current_ahead_count: facts.ahead,
    current_behind_count: facts.behind,
    public_disclosure_gate_includes_scope_gap_validator:
      report.scope_boundary.public_disclosure_gate_includes_scope_gap_validator,
    validate_public_disclosure_pass_does_not_clear_tracked_local_config:
      report.scope_boundary.validate_public_disclosure_pass_does_not_clear_tracked_local_config,
    tracked_local_path_config_detected: report.scope_boundary.tracked_local_path_config_detected,
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
