#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const targetRef = "configs/local_paths/doubaogen_plugin_dir.local.yaml";

const files = {
  phaseRecord: "docs/V0_6_108_PENDING_SYNC_BROAD_STACK_GROUP_REVIEW_NO_PUSH.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_107_pending_sync_safety_classifier_no_push.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_108_pending_sync_broad_stack_group_review_no_push.json",
  receipt: "reports/memory_write_receipts/v0_6_108_pending_sync_broad_stack_group_review_no_push.json",
  passFixture: "tests/schema_examples/pending_sync_broad_stack_group_review_no_push.example.json",
  failFixture: "tests/schema_examples/pending_sync_broad_stack_group_review_no_push_fail.example.json"
};

const expected = {
  phase: "v0_6_108_pending_sync_broad_stack_group_review_no_push",
  status: "completed_validated_pending_sync_broad_stack_group_review_no_push",
  sourcePhase: "v0_6_107_pending_sync_safety_classifier_no_push",
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

function parseNameStatusRows() {
  const output = git(["diff", "--name-status", "origin/master...HEAD"]);
  if (!output) return [];
  return output.split(/\r?\n/).filter(Boolean).map((line) => {
    const parts = line.split("\t");
    return { status: parts[0], path: parts[parts.length - 1] };
  });
}

function countTopLevel(rows) {
  const counts = {};
  rows.forEach((row) => {
    const top = row.path.includes("/") ? row.path.split("/")[0] : row.path;
    counts[top] = (counts[top] || 0) + 1;
  });
  return counts;
}

function countRiskGroups(rows) {
  const matches = (predicate) => rows.filter((row) => predicate(row.path, row.status)).length;
  return {
    providerOrRunner: matches((item) =>
      item.startsWith("plugins/image_generation/") ||
      item === "scripts/run_native_doubao_image_generation.js" ||
      item.startsWith("scripts/validate_native_doubao") ||
      item.startsWith("scripts/validate_v7_20_native_doubao") ||
      item === "configs/native_doubao_runner_cases.json"
    ),
    reviewConsole: matches((item) =>
      item.startsWith("review_console/") ||
      item.startsWith("scripts/validate_review_console")
    ),
    packageManifest: matches((item) => item === "package.json"),
    runsMetadata: matches((item) => item.startsWith("runs/real_generation/")),
    localConfigIndexDelete: matches((item, status) => status === "D" && item === targetRef),
    governanceDocsReports: matches((item) =>
      item.startsWith("docs/") ||
      item.startsWith("reports/") ||
      item.startsWith(".agent_board/")
    ),
    validatorsAndFixtures: matches((item) =>
      item.startsWith("scripts/validate") ||
      item.startsWith("tests/schema_examples/") ||
      item.startsWith("schemas/")
    ),
    binaryLike: matches((item) => /\.(png|jpe?g|webp|gif|bmp|tiff|psd|mp4|mov|zip|7z|rar|exe|dll)$/i.test(item))
  };
}

function currentFacts() {
  const [ahead, behind] = git(["rev-list", "--left-right", "--count", "HEAD...origin/master"])
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10));
  const rows = parseNameStatusRows();
  const tracked = git(["ls-files", "configs/local_paths/*.local.yaml"])
    .split(/\r?\n/)
    .filter(Boolean);
  const ignored = git(["check-ignore", "--verbose", "--", targetRef]);
  return {
    branch: git(["branch", "--show-current"]),
    headShort: git(["rev-parse", "--short", "HEAD"]),
    ahead,
    behind,
    rows,
    totalPaths: rows.length,
    topLevel: countTopLevel(rows),
    riskGroups: countRiskGroups(rows),
    targetExists: fs.existsSync(repoPath(targetRef)),
    tracked,
    ignored
  };
}

function validateSource(source) {
  const record = source.pending_sync_safety_classifier_no_push;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.classifier_result.broad_review_required_no_auto_push === true, "source must classify broad sync risk");
  assert(record.go_no_go.remote_write_authorized_now === false, "source must not authorize remote write");
  assert(record.go_no_go.next_auto_step_allowed === false, "source must stop before remote write");
}

function validateTopLevelCounts(counts, context) {
  const expectedCounts = {
    tests: 32,
    reports: 30,
    scripts: 27,
    docs: 18,
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
  assert(record.execution_mode === "pending_sync_broad_stack_group_review_no_push", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_group_review", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_group_review", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);

  const gitState = record.git_state_observed_before_checkpoint_commit || {};
  const diffScope = record.diff_scope_observed_before_checkpoint_commit || {};
  const riskGroups = record.risk_groups || {};
  const classification = record.classification || {};
  const post = record.detrack_postcondition_carried_forward || {};
  const validation = record.validation_observed || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(gitState.branch === "master", `${context} branch mismatch`);
  assert(gitState.tracking_ref === "origin/master", `${context} tracking ref mismatch`);
  assert(gitState.local_head_short === "d2a6803", `${context} local head mismatch`);
  assert(gitState.ahead_count === 49, `${context} ahead count mismatch`);
  assert(gitState.behind_count === 0, `${context} behind count mismatch`);
  assert(gitState.worktree_clean_before_checkpoint_edits === true, `${context} worktree clean mismatch`);

  assert(diffScope.comparison === "origin/master...HEAD", `${context} comparison mismatch`);
  assert(diffScope.total_paths === 121, `${context} total paths mismatch`);
  assert(diffScope.added_paths === 106, `${context} added paths mismatch`);
  assert(diffScope.modified_paths === 14, `${context} modified paths mismatch`);
  assert(diffScope.deleted_paths === 1, `${context} deleted paths mismatch`);
  validateTopLevelCounts(diffScope.top_level_counts || {}, context);

  assert(riskGroups.governance_docs_reports === 53, `${context} governance docs/reports count mismatch`);
  assert(riskGroups.validators_and_fixtures === 60, `${context} validators/fixtures count mismatch`);
  assert(riskGroups.provider_or_runner_paths === 5, `${context} provider/runner count mismatch`);
  assert(riskGroups.review_console_paths === 3, `${context} review console count mismatch`);
  assert(riskGroups.package_manifest_paths === 1, `${context} package manifest count mismatch`);
  assert(riskGroups.runs_metadata_paths === 1, `${context} runs metadata count mismatch`);
  assert(riskGroups.local_config_index_delete_paths === 1, `${context} local config delete count mismatch`);
  assert(riskGroups.binary_like_paths === 0, `${context} binary-like count mismatch`);

  assert(classification.sync_safety_classification === "broad_review_required_no_auto_push", `${context} classification mismatch`);
  assert(classification.tiny_docs_only_push_candidate === false, `${context} tiny docs-only must be false`);
  assert(classification.broad_review_required_no_auto_push === true, `${context} broad review flag must be true`);
  assert(classification.manual_remote_authorization_required_before_push === true, `${context} manual authorization flag must be true`);
  assert(classification.remote_write_authorized_now === false, `${context} remote write auth must be false`);
  assert(classification.push_ready_now === false, `${context} push ready must be false`);
  assert(classification.pr_ready_now === false, `${context} PR ready must be false`);

  assert(post.target_ref === targetRef, `${context} target ref mismatch`);
  assert(post.working_copy_file_exists_after === true, `${context} working copy must exist`);
  assert(post.git_tracking_removed_after === true, `${context} git tracking must be removed`);
  assert(post.git_ls_files_returns_target_after === false, `${context} git ls-files must not return target`);
  assert(post.gitignore_rule_effective_after === true, `${context} gitignore must be effective`);
  assert(post.local_config_content_read === false, `${context} local config content read must be false`);

  assert(facts.branch === "master", "current branch must be master");
  assert(facts.ahead >= gitState.ahead_count, "current ahead count must be at least snapshot");
  assert(facts.behind === 0, "current behind count must be zero");
  assert(facts.totalPaths >= diffScope.total_paths, "current diff path count must not shrink below snapshot");
  assert(facts.riskGroups.providerOrRunner >= riskGroups.provider_or_runner_paths, "current provider/runner group must be preserved");
  assert(facts.riskGroups.reviewConsole >= riskGroups.review_console_paths, "current review console group must be preserved");
  assert(facts.riskGroups.packageManifest === riskGroups.package_manifest_paths, "current package manifest count mismatch");
  assert(facts.riskGroups.runsMetadata === riskGroups.runs_metadata_paths, "current runs metadata count mismatch");
  assert(facts.riskGroups.localConfigIndexDelete === riskGroups.local_config_index_delete_paths, "current local config delete count mismatch");
  assert(facts.riskGroups.binaryLike === 0, "current diff must not contain binary-like paths");
  assert(facts.targetExists === true, "current local config working copy must exist");
  assert(!facts.tracked.includes(targetRef), "current Git index must not track local config");
  assert(facts.ignored.includes("configs/local_paths/*.local.yaml"), "current ignore rule must cover local config");

  Object.entries(validation).forEach(([key, value]) => {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  });
  Object.entries(guard).forEach(([key, value]) => {
    assert(value === false, `${context} guard.${key} must be false`);
  });

  assert(goNoGo.group_review_created === true, `${context} group review must be created`);
  assert(goNoGo.remote_write_authorized_now === false, `${context} go/no-go remote write auth must be false`);
  assert(goNoGo.push_ready_now === false, `${context} go/no-go push ready must be false`);
  assert(goNoGo.pr_ready_now === false, `${context} go/no-go PR ready must be false`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto step must be false`);
  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} recommended next auto must be false`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_pending_sync_broad_stack_group_review_no_push_receipt", "receipt type mismatch");
  assert(receipt.status === expected.status, "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.remote_write_performed === false, "receipt remote write must be false");
  assert(receipt.calls_used.provider_calls === 0, "receipt provider calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "receipt memory writes must be zero");
  assert(receipt.next_auto_step_allowed === false, "receipt next auto must be false");
  assert(receipt.recommended_next === expected.recommendedNext, "receipt recommended next mismatch");
  Object.entries(receipt.guard || {}).forEach(([key, value]) => {
    assert(value === false, `receipt guard.${key} must be false`);
  });
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
  const report = readJson(files.report).pending_sync_broad_stack_group_review_no_push;
  const receipt = readJson(files.receipt).pending_sync_broad_stack_group_review_no_push;
  const passFixture = readJson(files.passFixture).pending_sync_broad_stack_group_review_no_push;
  const failFixture = readJson(files.failFixture).pending_sync_broad_stack_group_review_no_push;

  [
    `phase: ${expected.phase}`,
    "diff_scope_total_paths_before_checkpoint_commit: 121",
    "provider_or_runner_paths: 5",
    "review_console_paths: 3",
    "push_ready_now: false",
    expected.recommendedNext
  ].forEach((token) => assert(phaseText.includes(token), `phase record missing token: ${token}`));

  validateCommon(report, "report", facts);
  validateCommon(passFixture, "passFixture", facts);
  validateReceipt(receipt);

  const caught = [
    expectFailure(report, "negative_remote_write_authorized", (record) => {
      record.classification.remote_write_authorized_now = true;
    }, facts),
    expectFailure(report, "negative_push_ready", (record) => {
      record.classification.push_ready_now = true;
    }, facts),
    expectFailure(report, "negative_tiny_docs_only", (record) => {
      record.classification.tiny_docs_only_push_candidate = true;
    }, facts),
    expectFailure(report, "negative_provider_group_missing", (record) => {
      record.risk_groups.provider_or_runner_paths = 0;
    }, facts),
    expectFailure(report, "negative_review_console_group_missing", (record) => {
      record.risk_groups.review_console_paths = 0;
    }, facts),
    expectFailure(report, "negative_total_paths_too_small", (record) => {
      record.diff_scope_observed_before_checkpoint_commit.total_paths = 12;
    }, facts),
    expectFailure(report, "negative_binary_like_paths", (record) => {
      record.risk_groups.binary_like_paths = 1;
    }, facts),
    expectFailure(report, "negative_local_config_content_read", (record) => {
      record.guard.local_config_content_read = true;
    }, facts),
    expectFailure(report, "negative_next_auto_step", (record) => {
      record.go_no_go.next_auto_step_allowed = true;
    }, facts),
    expectFailure(failFixture, "negative_fixture", (record) => record, facts)
  ];

  const output = {
    phase: expected.phase,
    passed: true,
    status: expected.status,
    source_phase: expected.sourcePhase,
    current_head_short: facts.headShort,
    current_ahead_count: facts.ahead,
    current_behind_count: facts.behind,
    snapshot_total_paths: report.diff_scope_observed_before_checkpoint_commit.total_paths,
    current_diff_path_count: facts.totalPaths,
    risk_groups: report.risk_groups,
    sync_safety_classification: report.classification.sync_safety_classification,
    push_ready_now: report.classification.push_ready_now,
    remote_write_authorized_now: report.classification.remote_write_authorized_now,
    negative_case_count: caught.length,
    caught_negative_case_count: caught.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: caught.every((item) => item.result === "caught"),
    recommended_next: report.recommended_next,
    recommended_next_auto_execution_allowed: report.recommended_next_auto_execution_allowed
  };

  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    phase: expected.phase,
    passed: false,
    error: error.message
  }, null, 2));
  process.exitCode = 1;
}
