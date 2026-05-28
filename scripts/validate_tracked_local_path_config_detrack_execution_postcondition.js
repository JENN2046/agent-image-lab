#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const targetRef = "configs/local_paths/doubaogen_plugin_dir.local.yaml";
const expectedCommand = `git rm --cached -- ${targetRef}`;
const postconditionCommand = "node scripts/validate_tracked_local_path_config_detrack_execution_postcondition.js";
const publicDisclosureCoreCommand = "node scripts/validate_public_repo_disclosure_audit.js";

const files = {
  phaseRecord: "docs/V0_6_103_TRACKED_LOCAL_PATH_CONFIG_DETRACK_EXECUTION_POSTCONDITION.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_102_public_disclosure_gate_scope_gap_wiring_no_read.json",
  packageJson: "package.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_103_tracked_local_path_config_detrack_execution_postcondition.json",
  receipt: "reports/memory_write_receipts/v0_6_103_tracked_local_path_config_detrack_execution_postcondition.json",
  passFixture: "tests/schema_examples/tracked_local_path_config_detrack_execution_postcondition.example.json",
  failFixture: "tests/schema_examples/tracked_local_path_config_detrack_execution_postcondition_fail.example.json"
};

const expected = {
  phase: "v0_6_103_tracked_local_path_config_detrack_execution_postcondition",
  status: "completed_validated_tracked_local_path_config_detrack_execution_postcondition",
  sourcePhase: "v0_6_102_public_disclosure_gate_scope_gap_wiring_no_read",
  recommendedNext: "refresh_push_pr_readiness_after_detrack_without_push"
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
  const tracked = git(["ls-files", "configs/local_paths/*.local.yaml"])
    .split(/\r?\n/)
    .filter(Boolean);
  const ignored = git(["check-ignore", "--verbose", "--", targetRef]);
  const packageJson = readJson(files.packageJson);
  return {
    branch: git(["branch", "--show-current"]),
    targetExists: fs.existsSync(repoPath(targetRef)),
    tracked,
    ignored,
    publicDisclosureScript: packageJson.scripts && packageJson.scripts["validate:public-disclosure"]
  };
}

function validateSource(source) {
  const record = source.public_disclosure_gate_scope_gap_wiring_no_read;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.scope_boundary.tracked_local_path_config_detected === true, "source must show pre-detrack tracked config risk");
  assert(record.scope_boundary.public_disclosure_gate_includes_scope_gap_validator === true, "source must show previous gate wiring");
}

function validatePackageScript(script) {
  assert(typeof script === "string", "validate:public-disclosure script missing");
  assert(script.includes(publicDisclosureCoreCommand), "validate:public-disclosure must include core public audit");
  assert(script.includes(postconditionCommand), "validate:public-disclosure must include postcondition validator");
  assert(script.indexOf(publicDisclosureCoreCommand) < script.indexOf(postconditionCommand), "core public audit must run before postcondition validator");
}

function validateCurrentTargetState(facts) {
  assert(!facts.tracked.includes(targetRef), "current git index must not track target");
  assert(facts.ignored.includes("configs/local_paths/*.local.yaml"), "current git check-ignore must cite local config ignore rule");
  assert(
    facts.targetExists === true || facts.ignored.includes("configs/local_paths/*.local.yaml"),
    "current working copy file must either exist locally or remain ignored after de-track"
  );
}

function validateCommon(record, context, facts) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "authorized_git_index_detrack_postcondition", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_authorized_index_detrack", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_authorized_index_detrack", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const authorization = record.authorization || {};
  const execution = record.execution_result || {};
  const packageChange = record.package_script_change || {};
  const validation = record.validation_observed || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(authorization.owner_authorized_exact_command === true, `${context} exact owner authorization missing`);
  assert(authorization.authorized_command === expectedCommand, `${context} authorized command mismatch`);
  assert(authorization.content_read_allowed === false, `${context} content read must not be allowed`);
  assert(authorization.working_copy_delete_allowed === false, `${context} working copy delete must not be allowed`);
  assert(authorization.push_tag_release_deploy_allowed === false, `${context} remote release boundary must be false`);

  assert(execution.git_rm_cached_performed === true, `${context} git rm cached must be performed`);
  assert(execution.target_ref === targetRef, `${context} target ref mismatch`);
  assert(execution.working_copy_file_exists_after === true, `${context} working copy must exist`);
  assert(execution.git_tracking_removed_after === true, `${context} git tracking must be removed`);
  assert(execution.git_ls_files_returns_target_after === false, `${context} git ls-files must not return target`);
  assert(execution.gitignore_rule_ref === ".gitignore:configs/local_paths/*.local.yaml", `${context} gitignore ref mismatch`);
  assert(execution.gitignore_rule_effective_after === true, `${context} gitignore rule must be effective`);
  assert(execution.working_copy_delete_performed === false, `${context} working copy delete must be false`);
  assert(execution.local_config_content_read === false, `${context} local config content read must be false`);

  validateCurrentTargetState(facts);

  assert(packageChange.package_json_modified === true, `${context} package json change must be recorded`);
  assert(packageChange.dependency_manifest_changed === false, `${context} dependency manifest must not change`);
  assert(packageChange.dependency_lock_changed === false, `${context} dependency lock must not change`);
  assert(packageChange.postcondition_command === postconditionCommand, `${context} postcondition command mismatch`);
  assert(packageChange.aggregate_gate_runs_postcondition === true, `${context} aggregate gate must run postcondition`);

  for (const [key, value] of Object.entries(validation)) {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  }
  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }

  assert(goNoGo.detrack_execution_recorded === true, `${context} de-track execution must be recorded`);
  assert(goNoGo.tracked_local_path_config_blocks_sync === false, `${context} tracked local path must not block sync`);
  assert(goNoGo.remote_write_authorized_now === false, `${context} remote write auth must be false`);
  assert(goNoGo.push_ready_now === false, `${context} push ready must be false`);
  assert(goNoGo.pr_ready_now === false, `${context} pr ready must be false`);
  assert(goNoGo.next_auto_step_allowed === "green_readiness_refresh_only", `${context} next auto scope mismatch`);

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === true, `${context} recommended next auto must be true for Green readiness refresh`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_tracked_local_path_config_detrack_execution_postcondition_receipt", "receipt type mismatch");
  assert(receipt.status === expected.status, "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.remote_write_performed === false, "receipt remote write must be false");
  assert(receipt.calls_used.provider_calls === 0, "receipt provider calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "receipt memory writes must be zero");
  assert(receipt.git_index_change.git_rm_cached_performed === true, "receipt must record git rm cached");
  assert(receipt.git_index_change.working_copy_file_exists_after === true, "receipt must record working copy exists");
  assert(receipt.git_index_change.git_tracking_removed_after === true, "receipt must record tracking removed");
  assert(receipt.next_auto_step_allowed === "green_readiness_refresh_only", "receipt next auto scope mismatch");
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
  assert(facts.branch === "master", "current branch must be master");
  validatePackageScript(facts.publicDisclosureScript);
  validateSource(readJson(files.sourceReport));

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).tracked_local_path_config_detrack_execution_postcondition;
  const receipt = readJson(files.receipt).tracked_local_path_config_detrack_execution_postcondition;
  const passFixture = readJson(files.passFixture).tracked_local_path_config_detrack_execution_postcondition;
  const failFixture = readJson(files.failFixture).tracked_local_path_config_detrack_execution_postcondition;

  for (const token of [
    `phase: ${expected.phase}`,
    `authorized_command: ${expectedCommand}`,
    "working_copy_file_exists_after: true",
    "git_tracking_removed_after: true",
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
    expectFailure(passFixture, "authorization_missing_fails", (candidate) => {
      candidate.authorization.owner_authorized_exact_command = false;
    }, facts),
    expectFailure(passFixture, "working_copy_missing_fails", (candidate) => {
      candidate.execution_result.working_copy_file_exists_after = false;
    }, facts),
    expectFailure(passFixture, "tracking_not_removed_fails", (candidate) => {
      candidate.execution_result.git_tracking_removed_after = false;
    }, facts),
    expectFailure(passFixture, "gitignore_not_effective_fails", (candidate) => {
      candidate.execution_result.gitignore_rule_effective_after = false;
    }, facts),
    expectFailure(passFixture, "content_read_fails", (candidate) => {
      candidate.execution_result.local_config_content_read = true;
    }, facts),
    expectFailure(passFixture, "working_copy_delete_fails", (candidate) => {
      candidate.guard.working_copy_delete_performed = true;
    }, facts),
    expectFailure(passFixture, "postcondition_command_missing_fails", (candidate) => {
      candidate.package_script_change.postcondition_command = "";
    }, facts),
    expectFailure(passFixture, "remote_write_authorized_fails", (candidate) => {
      candidate.go_no_go.remote_write_authorized_now = true;
    }, facts),
    expectFailure(passFixture, "push_ready_true_fails", (candidate) => {
      candidate.go_no_go.push_ready_now = true;
    }, facts)
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    working_copy_file_exists_after: report.execution_result.working_copy_file_exists_after,
    current_working_copy_file_present: facts.targetExists,
    git_tracking_removed_after: report.execution_result.git_tracking_removed_after,
    gitignore_rule_effective_after: report.execution_result.gitignore_rule_effective_after,
    local_config_content_read: report.execution_result.local_config_content_read,
    git_rm_cached_performed: report.execution_result.git_rm_cached_performed,
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
