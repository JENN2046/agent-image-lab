#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_46_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_EXECUTION_PREFLIGHT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_46_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight_fail.example.json",
  authorizationPackageDraft: "reports/visual_asset_eval_dry_run/v0_6_45_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.json",
  exactAllowedMemoryTargetsPackage: "reports/visual_asset_eval_dry_run/v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package.json",
  targetsPackage: "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json",
  memoryDeltaDraftPackage: "reports/visual_asset_eval_dry_run/v0_6_41_exact_new_trial_003_memory_delta_draft_package.json",
  sensitiveDataScanPreflight: "reports/visual_asset_eval_dry_run/v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  acceptedSampleRegistry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  memoryDeltaDraft: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  sensitiveDataScan: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expectedReadRefs = [
  "accepted_samples/accepted_sample_registry.yaml",
  "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json"
];

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
  phase: "v0_6_46_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  reviewer: "Jenn",
  authorizationId: "AUTH-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  blocker: "missing_human_approval_accepted_sample_registration_archive_completion_production_candidate_authorization_and_exact_daily_note_vcp_memory_write_grant",
  recommendedNext: "prepare_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package_with_execution_preflight_preserved"
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

function sameReadRefs(refs) {
  return JSON.stringify(refs) === JSON.stringify(expectedReadRefs);
}

function evaluate(record) {
  const sourceRefs = record.source_refs || {};
  const target = record.target || {};
  const guard = record.guard || {};
  const forbidden = record.forbidden_operations || {};
  const required = record.required_before_execution || [];
  const validationRequired = record.validation_required_before_execution || [];

  const authorizationPackageDraft = readJson(files.authorizationPackageDraft).exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft;
  const exactTargetsPackageReport = readJson(files.exactAllowedMemoryTargetsPackage).exact_new_trial_003_exact_allowed_memory_targets_package;
  const targetsPackage = readJson(files.targetsPackage).exact_allowed_memory_targets_package;
  const memoryDeltaDraftPackage = readJson(files.memoryDeltaDraftPackage).exact_new_trial_003_memory_delta_draft_package;
  const sensitiveDataScanPreflight = readJson(files.sensitiveDataScanPreflight).exact_new_trial_003_sensitive_data_scan_preflight;
  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const memoryDeltaDraftText = read(files.memoryDeltaDraft);
  const sensitiveDataScan = readJson(files.sensitiveDataScan);
  const acceptedSampleRegistryText = read(files.acceptedSampleRegistry);
  const categoryIndexText = read(files.categoryIndex);

  return (
    record.phase === expected.phase &&
    record.execution_mode === "daily_note_vcp_memory_write_execution_preflight_only" &&
    sourceRefs.authorization_package_draft === files.authorizationPackageDraft &&
    sourceRefs.exact_allowed_memory_targets_package === files.exactAllowedMemoryTargetsPackage &&
    sourceRefs.targets_package === files.targetsPackage &&
    sourceRefs.memory_delta_draft_package === files.memoryDeltaDraftPackage &&
    sourceRefs.sensitive_data_scan_preflight === files.sensitiveDataScanPreflight &&
    sourceRefs.human_review === files.humanReview &&
    sourceRefs.accepted_sample_registry === files.acceptedSampleRegistry &&
    sourceRefs.category_index === files.categoryIndex &&
    record.preflight_status === "blocked" &&
    record.blocker === expected.blocker &&
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.reviewer === expected.reviewer &&
    target.human_approval_status === "pending" &&
    target.approved_by === null &&
    target.accepted_sample_registration_completed === false &&
    target.durable_archive_ready === false &&
    target.production_candidate_ready === false &&
    target.authorization_package_status === "prepared_blocked_not_granted" &&
    target.authorization_id === expected.authorizationId &&
    target.authorization_granted_by_this_record === false &&
    target.daily_note_write_authorized === false &&
    target.vcp_memory_write_authorized === false &&
    target.write_command_permission === false &&
    target.exact_allowed_memory_targets_defined === true &&
    target.exact_allowed_memory_targets_count === 2 &&
    target.memory_delta_draft_present === true &&
    target.sensitive_data_scan_present === true &&
    target.execution_ready === false &&
    target.execution_allowed_now === false &&
    sameReadRefs(record.exact_allowed_read_refs) &&
    sameTargets(record.allowed_external_targets_after_approval) &&
    required.includes("Jenn human approval for the selected exact_new_trial_003 shot_2 candidate") &&
    required.includes("accepted_samples registration must be completed for accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001") &&
    required.includes("durable archive must be completed for the selected shot_2 route") &&
    required.includes("production candidate readiness must be completed for the selected shot_2 route") &&
    required.includes("the frozen v0.6.45 DailyNote / VCP memory authorization package must be explicitly granted") &&
    required.includes("exact DailyNote and VCP memory write permissions must both be true") &&
    required.includes("write command permission must be true") &&
    required.includes("the frozen memory_delta draft, sensitive-data scan, and exact targets package must still match current evidence") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_commit_and_authorization_readiness_audit.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1") &&
    forbidden.image_binary_read === true &&
    forbidden.image_binary_copy === true &&
    forbidden.runs_write === true &&
    forbidden.accepted_samples_write === true &&
    forbidden.failure_samples_write === true &&
    forbidden.asset_archive_write === true &&
    forbidden.production_write === true &&
    forbidden.provider_contact === true &&
    forbidden.plugin_call === true &&
    forbidden.api_call === true &&
    forbidden.runtime_execution === true &&
    forbidden.real_manifest_VCPChat_VCPToolBox_read === true &&
    forbidden.push_tag_release_deploy === true &&
    authorizationPackageDraft.authorization_package_status === "prepared_blocked_not_granted" &&
    authorizationPackageDraft.authorization_granted_by_this_record === false &&
    authorizationPackageDraft.target.write_command_permission === false &&
    exactTargetsPackageReport.target.exact_allowed_memory_targets_defined === true &&
    exactTargetsPackageReport.target.exact_allowed_memory_targets_count === 2 &&
    sameTargets(exactTargetsPackageReport.exact_allowed_memory_targets) &&
    sameTargets(targetsPackage.exact_allowed_memory_targets) &&
    memoryDeltaDraftPackage.verified_content.daily_note_draft_cn_present === true &&
    memoryDeltaDraftPackage.verified_content.vcp_memory_draft_cn_present === true &&
    sensitiveDataScanPreflight.target.scan_status === "passed_local_no_sensitive_content_detected" &&
    sensitiveDataScan.scan_passed === true &&
    humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId &&
    humanReview.candidate_comparison.selected_candidate_output_image_sha256 === "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b" &&
    acceptedSampleRegistryText.includes("sample_id:") &&
    categoryIndexText.includes("fashion_lookbook_portrait") &&
    memoryDeltaDraftText.includes("title_cn:") &&
    memoryDeltaDraftText.includes("summary_cn:") &&
    guard.preflight_only === true &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.direct_memory_write_performed === false &&
    guard.local_project_file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.archive_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false &&
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

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateRecord(invalidRecord, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const cases = [
    expectFailure(validRecord, "human_approval_overclaim_fails", (candidate) => {
      candidate.target.human_approval_status = "approved";
      candidate.target.approved_by = "Jenn";
      candidate.preflight_status = "ready";
      candidate.target.execution_allowed_now = true;
    }),
    expectFailure(validRecord, "authorization_granted_overclaim_fails", (candidate) => {
      candidate.target.authorization_package_status = "granted";
      candidate.target.authorization_granted_by_this_record = true;
      candidate.target.execution_ready = true;
      candidate.target.execution_allowed_now = true;
    }),
    expectFailure(validRecord, "exact_targets_missing_fails", (candidate) => {
      candidate.target.exact_allowed_memory_targets_defined = false;
      candidate.target.exact_allowed_memory_targets_count = 1;
    }),
    expectFailure(validRecord, "sensitive_data_scan_missing_fails", (candidate) => {
      candidate.target.sensitive_data_scan_present = false;
    }),
    expectFailure(validRecord, "broad_read_scope_fails", (candidate) => {
      candidate.exact_allowed_read_refs.push("runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png");
    }),
    expectFailure(validRecord, "daily_note_write_flag_fails", (candidate) => {
      candidate.guard.DailyNote_write_performed = true;
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
  const report = readJson(files.report).exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "preflight_status: blocked",
    `blocker: ${expected.blocker}`,
    "authorization_package_status: prepared_blocked_not_granted",
    `authorization_id: ${expected.authorizationId}`,
    "exact_allowed_memory_targets_count: 2",
    "memory_delta_draft_present: true",
    "sensitive_data_scan_present: true",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.js"), "validate_mvp missing new validator");

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const summary = {
    phase: expected.phase,
    passed: true,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    preflight_status: report.preflight_status,
    blocker: report.blocker,
    authorization_package_status: report.target.authorization_package_status,
    authorization_id: report.target.authorization_id,
    exact_allowed_memory_targets_count: report.target.exact_allowed_memory_targets_count,
    execution_ready: report.target.execution_ready,
    execution_allowed_now: report.target.execution_allowed_now,
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
