#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const targetRef = "configs/local_paths/doubaogen_plugin_dir.local.yaml";

const files = {
  phaseRecord: "docs/V0_6_107_PENDING_SYNC_SAFETY_CLASSIFIER_NO_PUSH.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_106_pending_remote_sync_diff_scope_review_no_push.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_107_pending_sync_safety_classifier_no_push.json",
  receipt: "reports/memory_write_receipts/v0_6_107_pending_sync_safety_classifier_no_push.json",
  passFixture: "tests/schema_examples/pending_sync_safety_classifier_no_push.example.json",
  failFixture: "tests/schema_examples/pending_sync_safety_classifier_no_push_fail.example.json"
};

const expected = {
  phase: "v0_6_107_pending_sync_safety_classifier_no_push",
  status: "completed_validated_pending_sync_safety_classifier_no_push",
  sourcePhase: "v0_6_106_pending_remote_sync_diff_scope_review_no_push",
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

function requireFiles() {
  Object.values(files).forEach((relativePath) => {
    assert(fs.existsSync(repoPath(relativePath)), `Missing required file: ${relativePath}`);
  });
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

function currentFacts() {
  const [ahead, behind] = git(["rev-list", "--left-right", "--count", "HEAD...origin/master"])
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10));
  const rows = git(["diff", "--name-only", "origin/master...HEAD"])
    .split(/\r?\n/)
    .filter(Boolean);
  const tracked = git(["ls-files", "configs/local_paths/*.local.yaml"])
    .split(/\r?\n/)
    .filter(Boolean);
  const ignored = git(["check-ignore", "--verbose", "--", targetRef]);
  return {
    branch: git(["branch", "--show-current"]),
    headShort: git(["rev-parse", "--short", "HEAD"]),
    ahead,
    behind,
    diffPathCount: rows.length,
    containsProviderAdjacentCode: rows.some((item) => item.startsWith("plugins/") || item.startsWith("adapters/")),
    containsReviewConsoleStaticChanges: rows.some((item) => item.startsWith("review_console/static_prototype/")),
    containsRunsMetadata: rows.some((item) => item.startsWith("runs/")),
    containsPackageJsonChange: rows.includes("package.json"),
    containsLocalConfigIndexDelete: rows.includes(targetRef),
    containsBinaryLikePaths: rows.some((item) => /\.(png|jpe?g|webp|gif|bmp|tiff|psd|mp4|mov|zip|7z|rar|exe|dll)$/i.test(item)),
    targetExists: fs.existsSync(repoPath(targetRef)),
    tracked,
    ignored
  };
}

function validateSource(source) {
  const record = source.pending_remote_sync_diff_scope_review_no_push;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.risk_classification.broad_diff_requires_explicit_review_before_push === true, "source must classify broad diff");
  assert(record.risk_classification.remote_write_authorized_now === false, "source must not authorize remote write");
  assert(record.go_no_go.next_auto_step_allowed === false, "source must stop before remote write");
}

function validateTopLevelCounts(counts, context) {
  const expectedCounts = {
    tests: 30,
    reports: 28,
    scripts: 26,
    docs: 17,
    ".agent_board": 5,
    configs: 2,
    review_console: 2,
    schemas: 2,
    "package.json": 1,
    plugins: 1,
    runs: 1
  };
  Object.entries(expectedCounts).forEach(([key, value]) => {
    assert(counts[key] === value, `${context} top-level count mismatch for ${key}`);
  });
}

function validateCommon(record, context, facts) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "pending_sync_safety_classifier_no_push", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_safety_classifier", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_safety_classifier", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const gitState = record.git_state_observed_before_checkpoint_commit || {};
  const diffScope = record.diff_scope_observed_before_checkpoint_commit || {};
  const classifier = record.classifier_result || {};
  const post = record.detrack_postcondition_carried_forward || {};
  const validation = record.validation_observed || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(gitState.branch === "master", `${context} branch mismatch`);
  assert(gitState.tracking_ref === "origin/master", `${context} tracking ref mismatch`);
  assert(gitState.local_head_short === "666f547", `${context} local head mismatch`);
  assert(gitState.ahead_count === 48, `${context} ahead count mismatch`);
  assert(gitState.behind_count === 0, `${context} behind count mismatch`);
  assert(gitState.worktree_clean_before_checkpoint_edits === true, `${context} worktree clean mismatch`);

  assert(diffScope.comparison === "origin/master...HEAD", `${context} comparison mismatch`);
  assert(diffScope.total_paths === 115, `${context} total paths mismatch`);
  assert(diffScope.added_paths === 100, `${context} added paths mismatch`);
  assert(diffScope.modified_paths === 14, `${context} modified paths mismatch`);
  assert(diffScope.deleted_paths === 1, `${context} deleted paths mismatch`);
  validateTopLevelCounts(diffScope.top_level_counts || {}, context);

  assert(classifier.sync_safety_classification === "broad_review_required_no_auto_push", `${context} classifier label mismatch`);
  assert(classifier.tiny_docs_only_push_candidate === false, `${context} tiny docs-only must be false`);
  assert(classifier.broad_review_required_no_auto_push === true, `${context} broad review flag must be true`);
  assert(classifier.contains_provider_adjacent_code === true, `${context} provider-adjacent flag must be true`);
  assert(classifier.contains_review_console_static_changes === true, `${context} review console flag must be true`);
  assert(classifier.contains_runs_metadata === true, `${context} runs metadata flag must be true`);
  assert(classifier.contains_package_json_change === true, `${context} package.json flag must be true`);
  assert(classifier.contains_local_config_index_delete === true, `${context} local config index delete flag must be true`);
  assert(classifier.contains_binary_like_paths === false, `${context} binary-like flag must be false`);
  assert(classifier.remote_write_authorized_now === false, `${context} remote write auth must be false`);
  assert(classifier.push_ready_now === false, `${context} push ready must be false`);
  assert(classifier.pr_ready_now === false, `${context} PR ready must be false`);

  assert(post.working_copy_file_exists_after === true, `${context} working copy must exist`);
  assert(post.git_tracking_removed_after === true, `${context} git tracking must be removed`);
  assert(post.git_ls_files_returns_target_after === false, `${context} git ls-files must not return target`);
  assert(post.gitignore_rule_effective_after === true, `${context} gitignore must be effective`);
  assert(post.local_config_content_read === false, `${context} local config content read must be false`);

  assert(facts.branch === "master", "current branch must be master");
  assert(facts.ahead >= gitState.ahead_count, "current ahead count must be at least snapshot");
  assert(facts.behind === 0, "current behind count must be zero");
  assert(facts.diffPathCount >= diffScope.total_paths, "current diff path count must not shrink below snapshot");
  assert(facts.containsProviderAdjacentCode === true, "current diff must contain provider-adjacent code");
  assert(facts.containsReviewConsoleStaticChanges === true, "current diff must contain review console static changes");
  assert(facts.containsRunsMetadata === true, "current diff must contain runs metadata");
  assert(facts.containsPackageJsonChange === true, "current diff must contain package.json");
  assert(facts.containsLocalConfigIndexDelete === true, "current diff must contain local config index delete");
  assert(facts.containsBinaryLikePaths === false, "current diff must not contain binary-like paths");
  assert(facts.targetExists === true, "current local config working copy must exist");
  assert(!facts.tracked.includes(targetRef), "current Git index must not track local config");
  assert(facts.ignored.includes("configs/local_paths/*.local.yaml"), "current ignore rule must cover local config");

  for (const [key, value] of Object.entries(validation)) {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  }
  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }

  assert(goNoGo.safety_classifier_created === true, `${context} classifier must be created`);
  assert(goNoGo.remote_write_authorized_now === false, `${context} go/no-go remote write auth must be false`);
  assert(goNoGo.push_ready_now === false, `${context} go/no-go push ready must be false`);
  assert(goNoGo.pr_ready_now === false, `${context} go/no-go PR ready must be false`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto step must be false`);
  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} recommended next auto must be false`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_pending_sync_safety_classifier_no_push_receipt", "receipt type mismatch");
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
  const report = readJson(files.report).pending_sync_safety_classifier_no_push;
  const receipt = readJson(files.receipt).pending_sync_safety_classifier_no_push;
  const passFixture = readJson(files.passFixture).pending_sync_safety_classifier_no_push;
  const failFixture = readJson(files.failFixture).pending_sync_safety_classifier_no_push;

  for (const token of [
    `phase: ${expected.phase}`,
    "diff_scope_total_paths_before_checkpoint_commit: 115",
    "sync_safety_classification: broad_review_required_no_auto_push",
    "contains_provider_adjacent_code: true",
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
    expectFailure(passFixture, "tiny_docs_only_true_fails", (candidate) => {
      candidate.classifier_result.tiny_docs_only_push_candidate = true;
    }, facts),
    expectFailure(passFixture, "broad_review_false_fails", (candidate) => {
      candidate.classifier_result.broad_review_required_no_auto_push = false;
    }, facts),
    expectFailure(passFixture, "provider_flag_false_fails", (candidate) => {
      candidate.classifier_result.contains_provider_adjacent_code = false;
    }, facts),
    expectFailure(passFixture, "runs_flag_false_fails", (candidate) => {
      candidate.classifier_result.contains_runs_metadata = false;
    }, facts),
    expectFailure(passFixture, "package_json_flag_false_fails", (candidate) => {
      candidate.classifier_result.contains_package_json_change = false;
    }, facts),
    expectFailure(passFixture, "remote_write_authorized_fails", (candidate) => {
      candidate.classifier_result.remote_write_authorized_now = true;
    }, facts),
    expectFailure(passFixture, "push_ready_true_fails", (candidate) => {
      candidate.classifier_result.push_ready_now = true;
    }, facts),
    expectFailure(passFixture, "binary_like_true_fails", (candidate) => {
      candidate.classifier_result.contains_binary_like_paths = true;
    }, facts),
    expectFailure(passFixture, "local_config_content_read_fails", (candidate) => {
      candidate.detrack_postcondition_carried_forward.local_config_content_read = true;
    }, facts),
    expectFailure(passFixture, "total_paths_wrong_fails", (candidate) => {
      candidate.diff_scope_observed_before_checkpoint_commit.total_paths = 1;
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
    snapshot_total_paths: report.diff_scope_observed_before_checkpoint_commit.total_paths,
    current_diff_path_count: facts.diffPathCount,
    sync_safety_classification: report.classifier_result.sync_safety_classification,
    push_ready_now: report.classifier_result.push_ready_now,
    remote_write_authorized_now: report.classifier_result.remote_write_authorized_now,
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
