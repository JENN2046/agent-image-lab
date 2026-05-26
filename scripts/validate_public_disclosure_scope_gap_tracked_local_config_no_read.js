#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_101_PUBLIC_DISCLOSURE_SCOPE_GAP_TRACKED_LOCAL_CONFIG_NO_READ.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_100_push_pr_readiness_refresh_without_push.json",
  publicDisclosureValidator: "scripts/validate_public_repo_disclosure_audit.js",
  report: "reports/visual_asset_eval_dry_run/v0_6_101_public_disclosure_scope_gap_tracked_local_config_no_read.json",
  receipt: "reports/memory_write_receipts/v0_6_101_public_disclosure_scope_gap_tracked_local_config_no_read.json",
  passFixture: "tests/schema_examples/public_disclosure_scope_gap_tracked_local_config_no_read.example.json",
  failFixture: "tests/schema_examples/public_disclosure_scope_gap_tracked_local_config_no_read_fail.example.json"
};

const expected = {
  phase: "v0_6_101_public_disclosure_scope_gap_tracked_local_config_no_read",
  status: "completed_validated_public_disclosure_scope_gap_tracked_local_config_no_read",
  sourcePhase: "v0_6_100_push_pr_readiness_refresh_without_push",
  targetRef: "configs/local_paths/doubaogen_plugin_dir.local.yaml",
  recommendedNext: "await_explicit_detrack_execution_authorization_or_choose_no_write_task",
  publicScopeRoots: [
    "review_console/static_prototype/mock_data.js",
    "runs/real_generation",
    "reports/production_candidate_authorization",
    "reports/visual_asset_eval_dry_run",
    "reports/production"
  ],
  dedicatedValidators: [
    "scripts/validate_tracked_local_path_config_hygiene_preflight_no_read.js",
    "scripts/validate_tracked_local_path_config_detrack_authorization_packet_no_exec.js",
    "scripts/validate_push_pr_readiness_refresh_without_push.js"
  ]
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
  expected.dedicatedValidators.forEach((relativePath) => {
    assert(fs.existsSync(repoPath(relativePath)), `Missing dedicated validator: ${relativePath}`);
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

function parsePublicDisclosureScopeRoots(scriptText) {
  const match = scriptText.match(/const scopeRoots = \[([\s\S]*?)\];/);
  assert(match, "public disclosure scopeRoots array not found");
  const roots = [];
  const quoted = /"([^"]+)"/g;
  for (const item of match[1].matchAll(quoted)) roots.push(item[1]);
  return roots;
}

function assertArrayEquals(actual, expectedValues, context) {
  assert(Array.isArray(actual), `${context} must be array`);
  assert(actual.length === expectedValues.length, `${context} length mismatch`);
  expectedValues.forEach((value, index) => {
    assert(actual[index] === value, `${context}[${index}] mismatch`);
  });
}

function validateSource(source) {
  const record = source.push_pr_readiness_refresh_without_push;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.go_no_go.tracked_local_path_config_blocks_sync === true, "source must keep tracked config blocker");
  assert(record.go_no_go.remote_write_authorized_now === false, "source must block remote write");
  assert(record.readiness_result.push_ready_now === false, "source must block push readiness");
  assert(record.readiness_result.pr_ready_now === false, "source must block PR readiness");
  assert(record.guard.local_config_content_read === false, "source must not read local config content");
  assert(record.guard.git_rm_cached_performed === false, "source must not run git rm cached");
}

function validateCommon(record, context, publicDisclosureScopeRoots) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "public_disclosure_scope_gap_tracked_local_config_no_read", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_scope_gap_record", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_scope_gap_record", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const gitState = record.git_state_observed_before_checkpoint_commit || {};
  const scope = record.scope_analysis || {};
  const validation = record.validation_observed || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(gitState.branch === "master", `${context} branch mismatch`);
  assert(gitState.tracking_ref === "origin/master", `${context} tracking ref mismatch`);
  assert(gitState.ahead_count === 42, `${context} checkpoint ahead count mismatch`);
  assert(gitState.behind_count === 0, `${context} checkpoint behind count mismatch`);
  assert(gitState.worktree_clean_before_checkpoint_edits === true, `${context} worktree clean precondition mismatch`);

  assert(scope.public_disclosure_validator_ref === files.publicDisclosureValidator, `${context} public disclosure validator ref mismatch`);
  assertArrayEquals(scope.public_disclosure_scope_roots, expected.publicScopeRoots, `${context} public disclosure scope roots`);
  assertArrayEquals(publicDisclosureScopeRoots, expected.publicScopeRoots, "actual public disclosure scope roots");
  assert(scope.configs_local_paths_in_public_disclosure_scope === false, `${context} must record configs/local_paths outside public disclosure scope`);
  assert(!scope.public_disclosure_scope_roots.includes("configs/local_paths"), `${context} scope roots must not include configs/local_paths`);
  assert(scope.tracked_local_path_config_ref === expected.targetRef, `${context} tracked local config ref mismatch`);
  assert(scope.tracked_local_path_config_detected === true, `${context} tracked local config must be detected`);
  assert(scope.validate_public_disclosure_pass_does_not_clear_tracked_local_config === true, `${context} public disclosure pass boundary missing`);
  assert(scope.dedicated_validators_cover_risk === true, `${context} dedicated validator coverage missing`);
  assertArrayEquals(scope.dedicated_validator_refs, expected.dedicatedValidators, `${context} dedicated validator refs`);

  for (const [key, value] of Object.entries(validation)) {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  }
  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }

  assert(goNoGo.scope_gap_recorded === true, `${context} scope gap must be recorded`);
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
  assert(receipt.receipt_type === "green_public_disclosure_scope_gap_tracked_local_config_no_read_receipt", "receipt type mismatch");
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

function expectFailure(baseRecord, caseId, mutate, publicDisclosureScopeRoots) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateCommon(candidate, caseId, publicDisclosureScopeRoots);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  requireFiles();
  const facts = currentGitFacts();
  assert(facts.branch === "master", "current branch must be master");
  assert(facts.ahead >= 42, "current ahead count must be at least the checkpoint observation");
  assert(facts.behind === 0, "current behind count must remain zero");
  assert(facts.tracked.includes(expected.targetRef), "tracked local path config must remain tracked for this gap record");

  validateSource(readJson(files.sourceReport));
  const publicDisclosureScopeRoots = parsePublicDisclosureScopeRoots(read(files.publicDisclosureValidator));

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).public_disclosure_scope_gap_tracked_local_config_no_read;
  const receipt = readJson(files.receipt).public_disclosure_scope_gap_tracked_local_config_no_read;
  const passFixture = readJson(files.passFixture).public_disclosure_scope_gap_tracked_local_config_no_read;
  const failFixture = readJson(files.failFixture).public_disclosure_scope_gap_tracked_local_config_no_read;

  for (const token of [
    `phase: ${expected.phase}`,
    "public_disclosure_scope_gap_detected: true",
    "tracked_local_path_config_detected: true",
    "push_ready_now: false",
    expected.recommendedNext
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  validateCommon(report, "report", publicDisclosureScopeRoots);
  validateCommon(passFixture, "pass_fixture", publicDisclosureScopeRoots);
  validateReceipt(receipt);

  let failFixtureCaught = false;
  try {
    validateCommon(failFixture, "fail_fixture", publicDisclosureScopeRoots);
  } catch {
    failFixtureCaught = true;
  }
  assert(failFixtureCaught, "fail fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "configs_local_paths_in_scope_fails", (candidate) => {
      candidate.scope_analysis.configs_local_paths_in_public_disclosure_scope = true;
    }, publicDisclosureScopeRoots),
    expectFailure(passFixture, "public_disclosure_clears_tracked_config_fails", (candidate) => {
      candidate.scope_analysis.validate_public_disclosure_pass_does_not_clear_tracked_local_config = false;
    }, publicDisclosureScopeRoots),
    expectFailure(passFixture, "dedicated_validator_refs_missing_fails", (candidate) => {
      candidate.scope_analysis.dedicated_validator_refs = [];
    }, publicDisclosureScopeRoots),
    expectFailure(passFixture, "tracked_config_not_detected_fails", (candidate) => {
      candidate.scope_analysis.tracked_local_path_config_detected = false;
    }, publicDisclosureScopeRoots),
    expectFailure(passFixture, "local_config_content_read_fails", (candidate) => {
      candidate.guard.file_content_read_for_local_config = true;
    }, publicDisclosureScopeRoots),
    expectFailure(passFixture, "git_rm_cached_fails", (candidate) => {
      candidate.guard.git_rm_cached_performed = true;
    }, publicDisclosureScopeRoots),
    expectFailure(passFixture, "push_ready_true_fails", (candidate) => {
      candidate.go_no_go.push_ready_now = true;
    }, publicDisclosureScopeRoots),
    expectFailure(passFixture, "remote_write_authorized_fails", (candidate) => {
      candidate.go_no_go.remote_write_authorized_now = true;
    }, publicDisclosureScopeRoots),
    expectFailure(passFixture, "next_auto_allowed_fails", (candidate) => {
      candidate.go_no_go.next_auto_step_allowed = true;
    }, publicDisclosureScopeRoots)
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    current_ahead_count: facts.ahead,
    current_behind_count: facts.behind,
    public_disclosure_scope_gap_detected: true,
    public_disclosure_scope_roots_include_configs_local_paths: false,
    tracked_local_path_config_detected: report.scope_analysis.tracked_local_path_config_detected,
    validate_public_disclosure_pass_does_not_clear_tracked_local_config:
      report.scope_analysis.validate_public_disclosure_pass_does_not_clear_tracked_local_config,
    dedicated_validators_cover_risk: report.scope_analysis.dedicated_validators_cover_risk,
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
