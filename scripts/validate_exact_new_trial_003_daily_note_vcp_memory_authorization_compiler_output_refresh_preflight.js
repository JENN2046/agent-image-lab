#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_43_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_AUTHORIZATION_COMPILER_OUTPUT_REFRESH_PREFLIGHT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_43_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight_fail.example.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  productionCandidatePreflight: "reports/visual_asset_eval_dry_run/v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.json",
  memoryDeltaDraftPackage: "reports/visual_asset_eval_dry_run/v0_6_41_exact_new_trial_003_memory_delta_draft_package.json",
  sensitiveDataScanPreflight: "reports/visual_asset_eval_dry_run/v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight.json",
  memoryDeltaDraft: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  sensitiveDataScan: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_43_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight",
  packageType: "daily_note_vcp_memory",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  blocker: "missing_accepted_sample_registration_archive_completion_production_candidate_authorization_exact_memory_targets_and_daily_note_vcp_memory_authorization",
  blockerDecision: "blocked_missing_accepted_sample_registration_archive_completion_production_candidate_authorization_exact_memory_targets_and_daily_note_vcp_memory_authorization",
  packageStatus: "draft_blocked_missing_accepted_sample_registration_archive_completion_production_candidate_authorization_exact_memory_targets_and_daily_note_vcp_memory_authorization",
  recommendedNext: "prepare_exact_new_trial_003_exact_allowed_memory_targets_package_with_memory_authorization_dependency_preserved"
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

function evaluate(input) {
  const sourceRefs = input.source_refs || {};
  const target = input.target || {};
  const allowedMemoryTargets = target.exact_allowed_memory_targets || [];
  const forbiddenMemoryTargets = target.forbidden_memory_targets || [];
  const required = input.required_before_execution || [];
  const validationRequired = input.validation_required_before_execution || [];
  const guard = input.guard || {};

  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const productionCandidatePreflight = readJson(files.productionCandidatePreflight).exact_new_trial_003_production_candidate_authorization_compiler_output_preflight;
  const memoryDeltaDraftPackage = readJson(files.memoryDeltaDraftPackage).exact_new_trial_003_memory_delta_draft_package;
  const sensitiveDataScanPreflight = readJson(files.sensitiveDataScanPreflight).exact_new_trial_003_sensitive_data_scan_preflight;
  const sensitiveDataScan = readJson(files.sensitiveDataScan);
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);
  const memoryDeltaDraftText = read(files.memoryDeltaDraft);
  const targetSampleRegisteredNow =
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    registryText.includes("source_phase: v0_6_56") &&
    categoryText.includes(`  - ${expected.sampleId}`) &&
    categoryText.includes(`  ${expected.sampleId}:`);

  const sourceRefsOk =
    sourceRefs.human_review === files.humanReview &&
    sourceRefs.production_candidate_preflight === files.productionCandidatePreflight &&
    sourceRefs.memory_delta_draft_package === files.memoryDeltaDraftPackage &&
    sourceRefs.sensitive_data_scan_preflight === files.sensitiveDataScanPreflight &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const packageOk =
    input.phase === expected.phase &&
    input.execution_mode === "daily_note_vcp_memory_authorization_compiler_output_refresh_preflight_only" &&
    input.package_type === expected.packageType &&
    input.package_status === expected.packageStatus &&
    input.blocker === expected.blocker &&
    input.daily_note_write_authorized === false &&
    input.vcp_memory_write_authorized === false &&
    input.memory_delta_draft_present === true &&
    input.sensitive_data_scan_present === true &&
    input.write_command_permission === false &&
    input.execution_allowed_now === false;

  const targetOk =
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.accepted_sample_registry_ref === files.registry &&
    target.accepted_sample_category_ref === files.categoryIndex &&
    target.production_candidate_preflight_ref === files.productionCandidatePreflight &&
    target.memory_delta_draft_ref === files.memoryDeltaDraft &&
    target.daily_note_body_language === "zh-CN_draft_present_before_execution" &&
    target.sensitive_data_scan_ref === files.sensitiveDataScan &&
    target.accepted_sample_registration_completed === false &&
    target.durable_archive_ready === false &&
    target.production_candidate_ready === false &&
    target.blocker_decision === expected.blockerDecision &&
    Array.isArray(allowedMemoryTargets) &&
    allowedMemoryTargets.length === 0 &&
    forbiddenMemoryTargets.includes("DailyNote") &&
    forbiddenMemoryTargets.includes("VCP memory") &&
    forbiddenMemoryTargets.includes(".env") &&
    forbiddenMemoryTargets.includes(".env.local") &&
    forbiddenMemoryTargets.includes("real VCPChat") &&
    forbiddenMemoryTargets.includes("real VCPToolBox") &&
    forbiddenMemoryTargets.includes("production/") &&
    forbiddenMemoryTargets.includes("asset_archive/") &&
    humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId &&
    humanReview.decision_boundary.memory_suitability === "deferred" &&
    productionCandidatePreflight.target.sample_id === expected.sampleId &&
    productionCandidatePreflight.execution_allowed_now === false &&
    memoryDeltaDraftPackage.target.memory_suitability_status === "deferred" &&
    sensitiveDataScanPreflight.target.memory_delta_draft_present === true &&
    sensitiveDataScanPreflight.target.sensitive_data_scan_present === true &&
    sensitiveDataScan.scan_passed === true &&
    sensitiveDataScan.contains_secret === false &&
    sensitiveDataScan.contains_private_path === false &&
    memoryDeltaDraftText.includes("title_cn:") &&
    memoryDeltaDraftText.includes("summary_cn:") &&
    ((!registryText.includes(expected.sampleId) && !categoryText.includes(expected.sampleId)) || targetSampleRegisteredNow);

  const requiredOk =
    required.includes("Jenn human approval must already be captured through the exact_new_trial_003 shot_2 approval chain") &&
    required.includes("exact accepted_samples registration for the selected shot_2 candidate must be completed first") &&
    required.includes("durable archive execution for the selected shot_2 accepted sample must be completed first") &&
    required.includes("exact production-candidate authorization and readiness for the selected shot_2 accepted sample must be completed first") &&
    required.includes("exact allowed DailyNote and VCP memory targets") &&
    required.includes("Jenn exact A5 DailyNote and VCP memory write authorization") &&
    required.includes("rollback plan") &&
    required.includes("reviewer") &&
    required.includes("stop conditions") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.js") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight.js") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_memory_delta_draft_package.js") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_sensitive_data_scan_preflight.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.preflight_only === true &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.memory_delta_written_to_runtime === false &&
    guard.secret_or_private_path_included === false &&
    guard.image_binary_included === false &&
    guard.production_candidate_write_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: sourceRefsOk && packageOk && targetOk && requiredOk && noWrites && noExternal && noRuntimeClaim,
    sourceRefsOk,
    packageOk,
    targetOk,
    requiredOk,
    noWrites,
    noExternal,
    noRuntimeClaim
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

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateRecord(invalidRecord, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const cases = [
    expectFailure(validRecord, "accepted_sample_registration_overclaim_fails", (candidate) => {
      candidate.target.accepted_sample_registration_completed = true;
    }),
    expectFailure(validRecord, "durable_archive_ready_overclaim_fails", (candidate) => {
      candidate.target.durable_archive_ready = true;
    }),
    expectFailure(validRecord, "production_candidate_ready_overclaim_fails", (candidate) => {
      candidate.target.production_candidate_ready = true;
    }),
    expectFailure(validRecord, "memory_delta_regression_fails", (candidate) => {
      candidate.memory_delta_draft_present = false;
      candidate.target.memory_delta_draft_ref = null;
    }),
    expectFailure(validRecord, "sensitive_data_scan_regression_fails", (candidate) => {
      candidate.sensitive_data_scan_present = false;
      candidate.target.sensitive_data_scan_ref = null;
    }),
    expectFailure(validRecord, "memory_authorization_overclaim_fails", (candidate) => {
      candidate.daily_note_write_authorized = true;
      candidate.vcp_memory_write_authorized = true;
      candidate.write_command_permission = true;
      candidate.execution_allowed_now = true;
    }),
    expectFailure(validRecord, "broad_memory_target_fails", (candidate) => {
      candidate.target.exact_allowed_memory_targets.push("DailyNote");
    }),
    expectFailure(validRecord, "memory_write_flag_fails", (candidate) => {
      candidate.guard.DailyNote_write_performed = true;
      candidate.guard.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "runtime_claim_fails", (candidate) => {
      candidate.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
      candidate.guard.vcp_runtime_integration_proven = true;
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const mvpText = read(files.mvpValidator);
  const report = readJson(files.report).exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight;

  for (const token of [
    `phase: ${expected.phase}`,
    "package_type: daily_note_vcp_memory",
    `package_status: ${expected.packageStatus}`,
    `blocker: ${expected.blocker}`,
    "memory_delta_draft_present: true",
    "sensitive_data_scan_present: true",
    "daily_note_write_authorized: false",
    "vcp_memory_write_authorized: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.js"), "validate_mvp missing refresh validator");

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const summary = {
    phase: expected.phase,
    passed: true,
    package_type: report.package_type,
    package_status: report.package_status,
    blocker: report.blocker,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    accepted_sample_registration_completed: report.target.accepted_sample_registration_completed,
    durable_archive_ready: report.target.durable_archive_ready,
    production_candidate_ready: report.target.production_candidate_ready,
    daily_note_write_authorized: report.daily_note_write_authorized,
    vcp_memory_write_authorized: report.vcp_memory_write_authorized,
    memory_delta_draft_present: report.memory_delta_draft_present,
    sensitive_data_scan_present: report.sensitive_data_scan_present,
    write_command_permission: report.write_command_permission,
    execution_allowed_now: report.execution_allowed_now,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
