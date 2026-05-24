#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_44_EXACT_NEW_TRIAL_003_EXACT_ALLOWED_MEMORY_TARGETS_PACKAGE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package.json",
  targetsPackage: "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_exact_allowed_memory_targets_package.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_exact_allowed_memory_targets_package_fail.example.json",
  memoryAuthorizationRefresh: "reports/visual_asset_eval_dry_run/v0_6_43_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.json",
  memoryDeltaDraftPackage: "reports/visual_asset_eval_dry_run/v0_6_41_exact_new_trial_003_memory_delta_draft_package.json",
  sensitiveDataScanPreflight: "reports/visual_asset_eval_dry_run/v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight.json",
  memoryDeltaDraft: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  sensitiveDataScan: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expectedTargets = [
  {
    system: "DailyNote",
    operation: "write_one_entry",
    language: "zh-CN",
    target_id: "exact_new_trial_003_shot_2_daily_note_review_learning_entry"
  },
  {
    system: "VCP_memory",
    operation: "write_one_summary_after_DailyNote_success",
    language: "zh-CN",
    target_id: "exact_new_trial_003_shot_2_vcp_memory_review_learning_summary"
  }
];

const expected = {
  phase: "v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  packageType: "exact_allowed_memory_targets",
  packageStatus: "draft_only_blocked_by_accepted_sample_archive_production_and_memory_authorization_dependencies",
  recommendedNext: "prepare_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft_with_exact_targets_preserved"
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

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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

function sameTargets(targets) {
  return JSON.stringify(targets) === JSON.stringify(expectedTargets);
}

function evaluate(record) {
  const sourceRefs = record.source_refs || {};
  const target = record.target || {};
  const guard = record.guard || {};

  const refreshPreflight = readJson(files.memoryAuthorizationRefresh).exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight;
  const memoryDeltaDraftPackage = readJson(files.memoryDeltaDraftPackage).exact_new_trial_003_memory_delta_draft_package;
  const sensitiveDataScanPreflight = readJson(files.sensitiveDataScanPreflight).exact_new_trial_003_sensitive_data_scan_preflight;
  const targetsPackage = readJson(files.targetsPackage).exact_allowed_memory_targets_package;
  const memoryDeltaDraftText = read(files.memoryDeltaDraft);
  const sensitiveDataScan = readJson(files.sensitiveDataScan);

  return (
    record.phase === expected.phase &&
    record.execution_mode === "exact_allowed_memory_targets_package_only" &&
    sourceRefs.memory_authorization_refresh_preflight === files.memoryAuthorizationRefresh &&
    sourceRefs.memory_delta_draft_package === files.memoryDeltaDraftPackage &&
    sourceRefs.sensitive_data_scan_preflight === files.sensitiveDataScanPreflight &&
    sourceRefs.targets_package === files.targetsPackage &&
    record.package_type === expected.packageType &&
    record.package_status === expected.packageStatus &&
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.memory_delta_draft_ref === files.memoryDeltaDraft &&
    target.sensitive_data_scan_ref === files.sensitiveDataScan &&
    target.exact_allowed_memory_targets_defined === true &&
    target.exact_allowed_memory_targets_count === 2 &&
    target.accepted_sample_registration_completed === false &&
    target.durable_archive_ready === false &&
    target.production_candidate_ready === false &&
    sameTargets(record.exact_allowed_memory_targets) &&
    sameTargets(targetsPackage.exact_allowed_memory_targets) &&
    refreshPreflight.memory_delta_draft_present === true &&
    refreshPreflight.sensitive_data_scan_present === true &&
    memoryDeltaDraftPackage.verified_content.daily_note_draft_cn_present === true &&
    memoryDeltaDraftPackage.verified_content.vcp_memory_draft_cn_present === true &&
    sensitiveDataScan.scan_passed === true &&
    memoryDeltaDraftText.includes("title_cn:") &&
    memoryDeltaDraftText.includes("summary_cn:") &&
    record.daily_note_write_authorized === false &&
    record.vcp_memory_write_authorized === false &&
    record.write_command_permission === false &&
    record.execution_allowed_now === false &&
    Array.isArray(record.forbidden_memory_targets) &&
    record.forbidden_memory_targets.includes(".env") &&
    record.forbidden_memory_targets.includes("real VCPChat") &&
    record.forbidden_memory_targets.includes("production/") &&
    guard.package_only === true &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.archive_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false
  );
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(evaluate(record), `${context} evaluation failed`);
  assert(record.recommended_next === expected.recommendedNext, `${context}.recommended_next mismatch`);
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).exact_new_trial_003_exact_allowed_memory_targets_package;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_exact_allowed_memory_targets_package;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_exact_allowed_memory_targets_package;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "targets_package_created: true",
    `targets_package_ref: ${files.targetsPackage}`,
    "exact_allowed_memory_targets_defined: true",
    "exact_allowed_memory_targets_count: 2",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_exact_allowed_memory_targets_package.js"), "validate_mvp missing exact memory targets validator");

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "memory_target_count_drift_fails", (candidate) => {
      candidate.target.exact_allowed_memory_targets_count = 1;
    }),
    expectFailure(passFixture, "daily_note_target_drift_fails", (candidate) => {
      candidate.exact_allowed_memory_targets[0].operation = "write_now";
    }),
    expectFailure(passFixture, "vcp_memory_target_drift_fails", (candidate) => {
      candidate.exact_allowed_memory_targets[1].target_id = "wrong_target";
    }),
    expectFailure(passFixture, "memory_authorization_overclaim_fails", (candidate) => {
      candidate.daily_note_write_authorized = true;
      candidate.vcp_memory_write_authorized = true;
      candidate.write_command_permission = true;
      candidate.execution_allowed_now = true;
    }),
    expectFailure(passFixture, "accepted_sample_overclaim_fails", (candidate) => {
      candidate.target.accepted_sample_registration_completed = true;
    }),
    expectFailure(passFixture, "external_write_flag_fails", (candidate) => {
      candidate.guard.DailyNote_write_performed = true;
      candidate.guard.VCP_memory_write_performed = true;
      candidate.guard.vcp_runtime_integration_proven = true;
      candidate.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    package_type: report.package_type,
    package_status: report.package_status,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    exact_allowed_memory_targets_defined: report.target.exact_allowed_memory_targets_defined,
    exact_allowed_memory_targets_count: report.target.exact_allowed_memory_targets_count,
    daily_note_write_authorized: report.daily_note_write_authorized,
    vcp_memory_write_authorized: report.vcp_memory_write_authorized,
    execution_allowed_now: report.execution_allowed_now,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught")
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
