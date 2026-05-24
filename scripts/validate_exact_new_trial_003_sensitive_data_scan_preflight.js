#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_42_EXACT_NEW_TRIAL_003_SENSITIVE_DATA_SCAN_PREFLIGHT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight.json",
  scanRef: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  draftPackage: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  passFixture: "tests/schema_examples/exact_new_trial_003_sensitive_data_scan_preflight.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_sensitive_data_scan_preflight_fail.example.json",
  memoryDeltaDraftPackage: "reports/visual_asset_eval_dry_run/v0_6_41_exact_new_trial_003_memory_delta_draft_package.json",
  memoryAuthorizationPreflight: "reports/visual_asset_eval_dry_run/v0_6_40_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  scanStatus: "passed_local_no_sensitive_content_detected",
  recommendedNext: "refresh_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight_with_memory_delta_and_scan_state_preserved"
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

function evaluate(record) {
  const target = record.target || {};
  const findings = record.scan_findings || {};
  const boundary = record.boundary || {};
  return {
    passed:
      record.phase === expected.phase &&
      target.sample_id === expected.sampleId &&
      target.candidate_id === expected.candidateId &&
      target.category === expected.category &&
      target.memory_delta_draft_present === true &&
      target.sensitive_data_scan_present === true &&
      target.scan_status === expected.scanStatus &&
      findings.contains_secret === false &&
      findings.contains_private_path === false &&
      findings.contains_customer_private_data === false &&
      findings.contains_image_binary === false &&
      findings.raw_sensitive_content_saved === false &&
      boundary.execution_allowed_now === false &&
      boundary.DailyNote_write_performed === false &&
      boundary.VCP_memory_write_performed === false &&
      boundary.direct_memory_write_performed === false &&
      boundary.write_command_permission === false &&
      boundary.artifact_recoverability_is_not_vcp_runtime_integration === true &&
      boundary.vcp_runtime_integration_proven === false,
    target,
    findings,
    boundary
  };
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  const result = evaluate(record);
  assert(result.passed, `${context} evaluation failed: ${JSON.stringify(result)}`);
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
  const draftPackageText = read(files.draftPackage);
  const scan = readJson(files.scanRef);
  const report = readJson(files.report).exact_new_trial_003_sensitive_data_scan_preflight;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_sensitive_data_scan_preflight;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_sensitive_data_scan_preflight;
  const memoryDeltaDraftPackage = readJson(files.memoryDeltaDraftPackage).exact_new_trial_003_memory_delta_draft_package;
  const memoryAuthorizationPreflight = readJson(files.memoryAuthorizationPreflight).exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "scan_preflight_created: true",
    `scan_ref: ${files.scanRef}`,
    "memory_delta_draft_present: true",
    "sensitive_data_scan_present: true",
    `scan_status: ${expected.scanStatus}`,
    "contains_secret: false",
    "contains_private_path: false",
    "raw_sensitive_content_saved: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(scan.scan_passed === true, "scan artifact must pass");
  assert(scan.contains_secret === false, "scan artifact contains_secret mismatch");
  assert(scan.contains_private_path === false, "scan artifact contains_private_path mismatch");
  assert(scan.raw_sensitive_content_saved === false, "scan artifact raw_sensitive_content_saved mismatch");
  assert(draftPackageText.includes("contains_secret: false"), "draft package contains_secret token missing");
  assert(draftPackageText.includes("contains_private_path: false"), "draft package contains_private_path token missing");
  assert(draftPackageText.includes("raw_sensitive_content_saved: false"), "draft package raw_sensitive_content token missing");
  assert(memoryDeltaDraftPackage.target.memory_suitability_status === "deferred", "memory delta draft package memory suitability mismatch");
  assert(memoryAuthorizationPreflight.target.memory_delta_draft_ref === null, "historical memory authorization preflight should still show null draft ref");
  assert(memoryAuthorizationPreflight.target.sensitive_data_scan_ref === null, "historical memory authorization preflight should still show null scan ref");
  assert(mvpText.includes("scripts/validate_exact_new_trial_003_sensitive_data_scan_preflight.js"), "validate_mvp missing new validator");

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
    expectFailure(passFixture, "contains_secret_true_fails", (candidate) => {
      candidate.scan_findings.contains_secret = true;
    }),
    expectFailure(passFixture, "contains_private_path_true_fails", (candidate) => {
      candidate.scan_findings.contains_private_path = true;
    }),
    expectFailure(passFixture, "raw_sensitive_content_saved_true_fails", (candidate) => {
      candidate.scan_findings.raw_sensitive_content_saved = true;
    }),
    expectFailure(passFixture, "scan_passed_false_fails", (candidate) => {
      candidate.target.scan_status = "failed_sensitive_content_present";
    }),
    expectFailure(passFixture, "execution_allowed_now_true_fails", (candidate) => {
      candidate.boundary.execution_allowed_now = true;
      candidate.boundary.write_command_permission = true;
    }),
    expectFailure(passFixture, "memory_write_flag_true_fails", (candidate) => {
      candidate.boundary.DailyNote_write_performed = true;
      candidate.boundary.VCP_memory_write_performed = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    target_sample_id: expected.sampleId,
    target_candidate_id: expected.candidateId,
    category: expected.category,
    scan_preflight_created: true,
    scan_ref: files.scanRef,
    memory_delta_draft_present: report.target.memory_delta_draft_present,
    sensitive_data_scan_present: report.target.sensitive_data_scan_present,
    scan_status: report.target.scan_status,
    contains_secret: report.scan_findings.contains_secret,
    contains_private_path: report.scan_findings.contains_private_path,
    raw_sensitive_content_saved: report.scan_findings.raw_sensitive_content_saved,
    execution_allowed_now: report.boundary.execution_allowed_now,
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
