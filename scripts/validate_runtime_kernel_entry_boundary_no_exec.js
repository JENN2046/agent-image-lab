#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_109_RUNTIME_KERNEL_ENTRY_BOUNDARY_NO_EXEC.md",
  gapMap: "docs/V0_6_86_RUNTIME_KERNEL_BACKEND_GAP_MAP.md",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_108_pending_sync_broad_stack_group_review_no_push.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_109_runtime_kernel_entry_boundary_no_exec.json",
  receipt: "reports/memory_write_receipts/v0_6_109_runtime_kernel_entry_boundary_no_exec.json",
  passFixture: "tests/schema_examples/runtime_kernel_entry_boundary_no_exec.example.json",
  failFixture: "tests/schema_examples/runtime_kernel_entry_boundary_no_exec_fail.example.json"
};

const expected = {
  phase: "v0_6_109_runtime_kernel_entry_boundary_no_exec",
  status: "completed_validated_runtime_kernel_entry_boundary_no_exec",
  sourcePhase: "v0_6_108_pending_sync_broad_stack_group_review_no_push",
  gapMapPhase: "v0_6_86_runtime_kernel_backend_gap_map",
  recommendedNext: "create_runtime_contract_schema_no_exec",
  components: [
    "task_intake",
    "policy_gate",
    "executor_interface",
    "artifact_persistence",
    "review_gate",
    "state_transition",
    "audit_record"
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
}

function currentFacts() {
  const [ahead, behind] = git(["rev-list", "--left-right", "--count", "HEAD...origin/master"])
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10));
  const rows = git(["diff", "--name-only", "origin/master...HEAD"])
    .split(/\r?\n/)
    .filter(Boolean);
  return {
    branch: git(["branch", "--show-current"]),
    headShort: git(["rev-parse", "--short", "HEAD"]),
    ahead,
    behind,
    diffPathCount: rows.length,
    runtimeImplementationPaths: rows.filter((item) =>
      item.startsWith("runtime/") ||
      item.startsWith("kernel/") ||
      item.startsWith("server/") ||
      item.startsWith("backend/")
    )
  };
}

function validateSource(source) {
  const record = source.pending_sync_broad_stack_group_review_no_push;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.classification.sync_safety_classification === "broad_review_required_no_auto_push", "source classification mismatch");
  assert(record.classification.remote_write_authorized_now === false, "source must not authorize remote write");
  assert(record.classification.push_ready_now === false, "source must not be push-ready");
}

function validateGapMap(text) {
  assert(text.includes(`phase: ${expected.gapMapPhase}`), "gap map phase missing");
  expected.components.forEach((component) => {
    assert(text.includes(component), `gap map missing component: ${component}`);
  });
  assert(text.includes("does not create runtime kernel code"), "gap map must preserve no-code boundary");
}

function validateCommon(record, context, facts) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === expected.status, `${context} status mismatch`);
  assert(record.execution_mode === "runtime_kernel_entry_boundary_no_exec", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_local_planning_boundary", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_local_planning_boundary", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);
  assert(record.gap_map_source_phase === expected.gapMapPhase, `${context} gap map source mismatch`);

  const gitState = record.git_state_observed_before_checkpoint_commit || {};
  const syncState = record.pending_sync_state_carried_forward || {};
  const boundary = record.entry_boundary || {};
  const next = record.allowed_next_green_slice || {};
  const guard = record.guard || {};
  const goNoGo = record.go_no_go || {};

  assert(gitState.branch === "master", `${context} branch mismatch`);
  assert(gitState.tracking_ref === "origin/master", `${context} tracking ref mismatch`);
  assert(gitState.local_head_short === "7944d38", `${context} local head mismatch`);
  assert(gitState.ahead_count === 50, `${context} ahead count mismatch`);
  assert(gitState.behind_count === 0, `${context} behind count mismatch`);
  assert(gitState.worktree_clean_before_checkpoint_edits === true, `${context} worktree clean mismatch`);

  assert(syncState.comparison === "origin/master...HEAD", `${context} comparison mismatch`);
  assert(syncState.total_paths === 127, `${context} pending sync path count mismatch`);
  assert(syncState.sync_safety_classification === "broad_review_required_no_auto_push", `${context} sync classification mismatch`);
  assert(syncState.remote_write_authorized_now === false, `${context} sync remote write auth must be false`);
  assert(syncState.push_ready_now === false, `${context} sync push ready must be false`);

  assert(Array.isArray(record.minimum_kernel_components), `${context} components must be an array`);
  assert(record.minimum_kernel_components.length === expected.components.length, `${context} component count mismatch`);
  expected.components.forEach((component) => {
    assert(record.minimum_kernel_components.includes(component), `${context} missing component: ${component}`);
  });

  [
    "runtime_kernel_code_created",
    "runtime_implementation_authorized_now",
    "executor_created",
    "state_machine_created",
    "provider_contact_performed",
    "image_generation_performed",
    "production_write_performed",
    "secret_value_read_performed"
  ].forEach((key) => assert(boundary[key] === false, `${context} boundary.${key} must be false`));

  assert(next.task_id === expected.recommendedNext, `${context} next task mismatch`);
  assert(next.allowed === true, `${context} next green slice must be allowed`);
  [
    "runtime_executor_implementation",
    "provider_contact",
    "plugin_call",
    "api_call",
    "image_generation",
    "secret_or_env_read",
    "production_write",
    "push",
    "tag",
    "release",
    "deploy"
  ].forEach((action) => {
    assert((next.forbidden_actions || []).includes(action), `${context} missing forbidden action: ${action}`);
  });

  Object.entries(record.validation_observed || {}).forEach(([key, value]) => {
    assert(value === "passed", `${context} validation ${key} must be passed`);
  });
  Object.entries(guard).forEach(([key, value]) => {
    assert(value === false, `${context} guard.${key} must be false`);
  });

  assert(goNoGo.entry_boundary_created === true, `${context} entry boundary must be created`);
  assert(goNoGo.runtime_kernel_is_present_now === false, `${context} runtime kernel must not be present`);
  assert(goNoGo.runtime_implementation_allowed_now === false, `${context} runtime implementation must not be allowed`);
  assert(goNoGo.next_green_schema_contract_allowed === true, `${context} next schema contract must be allowed`);
  assert(goNoGo.remote_write_authorized_now === false, `${context} remote write auth must be false`);
  assert(goNoGo.push_ready_now === false, `${context} push ready must be false`);
  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === true, `${context} recommended next auto flag mismatch`);

  assert(facts.branch === "master", "current branch must be master");
  assert(facts.ahead >= gitState.ahead_count, "current ahead count must be at least snapshot");
  assert(facts.behind === 0, "current behind count must be zero");
  assert(facts.diffPathCount >= syncState.total_paths, "current diff path count must not shrink below snapshot");
  assert(facts.runtimeImplementationPaths.length === 0, `runtime implementation paths detected: ${facts.runtimeImplementationPaths.join(", ")}`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_runtime_kernel_entry_boundary_no_exec_receipt", "receipt type mismatch");
  assert(receipt.status === expected.status, "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.remote_write_performed === false, "receipt remote write must be false");
  assert(receipt.calls_used.provider_calls === 0, "receipt provider calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "receipt memory writes must be zero");
  assert(receipt.next_auto_step_allowed === true, "receipt next auto flag mismatch");
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
  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).runtime_kernel_entry_boundary_no_exec;
  const receipt = readJson(files.receipt).runtime_kernel_entry_boundary_no_exec;
  const passFixture = readJson(files.passFixture).runtime_kernel_entry_boundary_no_exec;
  const failFixture = readJson(files.failFixture).runtime_kernel_entry_boundary_no_exec;

  validateSource(readJson(files.sourceReport));
  validateGapMap(read(files.gapMap));

  [
    `phase: ${expected.phase}`,
    "runtime_kernel_code_created: false",
    "runtime_implementation_authorized_now: false",
    "create_runtime_contract_schema_no_exec",
    "task_intake",
    "audit_record"
  ].forEach((token) => assert(phaseText.includes(token), `phase record missing token: ${token}`));

  validateCommon(report, "report", facts);
  validateCommon(passFixture, "passFixture", facts);
  validateReceipt(receipt);

  const caught = [
    expectFailure(report, "negative_runtime_code_created", (record) => {
      record.entry_boundary.runtime_kernel_code_created = true;
    }, facts),
    expectFailure(report, "negative_executor_created", (record) => {
      record.entry_boundary.executor_created = true;
    }, facts),
    expectFailure(report, "negative_runtime_implementation_allowed", (record) => {
      record.go_no_go.runtime_implementation_allowed_now = true;
    }, facts),
    expectFailure(report, "negative_provider_contact", (record) => {
      record.guard.provider_contact_performed = true;
    }, facts),
    expectFailure(report, "negative_push_ready", (record) => {
      record.pending_sync_state_carried_forward.push_ready_now = true;
    }, facts),
    expectFailure(report, "negative_missing_component", (record) => {
      record.minimum_kernel_components = record.minimum_kernel_components.filter((item) => item !== "audit_record");
    }, facts),
    expectFailure(report, "negative_wrong_next", (record) => {
      record.recommended_next = "implement_runtime_executor";
    }, facts),
    expectFailure(failFixture, "negative_fixture", (record) => record, facts)
  ];

  console.log(JSON.stringify({
    phase: expected.phase,
    passed: true,
    status: expected.status,
    source_phase: expected.sourcePhase,
    current_head_short: facts.headShort,
    current_ahead_count: facts.ahead,
    current_behind_count: facts.behind,
    snapshot_pending_sync_paths: report.pending_sync_state_carried_forward.total_paths,
    current_diff_path_count: facts.diffPathCount,
    runtime_kernel_code_created: report.entry_boundary.runtime_kernel_code_created,
    runtime_implementation_authorized_now: report.entry_boundary.runtime_implementation_authorized_now,
    minimum_kernel_component_count: report.minimum_kernel_components.length,
    negative_case_count: caught.length,
    caught_negative_case_count: caught.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: caught.every((item) => item.result === "caught"),
    recommended_next: report.recommended_next,
    recommended_next_auto_execution_allowed: report.recommended_next_auto_execution_allowed
  }, null, 2));
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
