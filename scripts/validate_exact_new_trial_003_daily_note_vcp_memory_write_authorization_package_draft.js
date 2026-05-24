#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_45_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_AUTHORIZATION_PACKAGE_DRAFT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_45_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.json",
  authorizationPackage: "reports/memory_write_authorization/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_authorization_package_draft.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft_fail.example.json",
  memoryAuthorizationRefresh: "reports/visual_asset_eval_dry_run/v0_6_43_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight.json",
  exactAllowedMemoryTargetsPackage: "reports/visual_asset_eval_dry_run/v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package.json",
  targetsPackage: "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json",
  memoryDeltaDraftPackage: "reports/visual_asset_eval_dry_run/v0_6_41_exact_new_trial_003_memory_delta_draft_package.json",
  sensitiveDataScanPreflight: "reports/visual_asset_eval_dry_run/v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight.json",
  shot2Closeout: "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  acceptedSampleRegistry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
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

const expectedReadRefs = [
  "accepted_samples/accepted_sample_registry.yaml",
  "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json"
];

const expected = {
  phase: "v0_6_45_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  reviewer: "Jenn",
  authorizationId: "AUTH-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  packageStatus: "prepared_blocked_not_granted",
  blocker: "missing_human_approval_accepted_sample_registration_archive_completion_production_candidate_authorization_and_exact_daily_note_vcp_memory_write_grant",
  recommendedNext: "prepare_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight_with_authorization_package_and_exact_targets_preserved"
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

function validateAuthorizationPackage(pkg, context) {
  assert(pkg && typeof pkg === "object", `${context} missing`);
  assertNoRawLocalDrivePath(pkg, context);

  assert(pkg.report_version === 1, `${context}.report_version mismatch`);
  assert(pkg.phase === expected.phase, `${context}.phase mismatch`);
  assert(pkg.authorization_id === expected.authorizationId, `${context}.authorization_id mismatch`);
  assert(pkg.authorization_state === "draft_not_granted", `${context}.authorization_state mismatch`);
  assert(pkg.source_phase === "v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package", `${context}.source_phase mismatch`);
  assert(pkg.source_sample_id === expected.sampleId, `${context}.source_sample_id mismatch`);
  assert(pkg.source_candidate_id === expected.candidateId, `${context}.source_candidate_id mismatch`);
  assert(pkg.source_category === expected.category, `${context}.source_category mismatch`);
  assert(pkg.output_report_path === files.authorizationPackage, `${context}.output_report_path mismatch`);
  assert(pkg.reviewer === expected.reviewer, `${context}.reviewer mismatch`);
  assert(pkg.activation_requires_future_user_authorization === true, `${context}.activation flag mismatch`);
  assert(JSON.stringify(pkg.target_systems) === JSON.stringify(["DailyNote", "VCP_memory"]), `${context}.target_systems mismatch`);
  assert(sameReadRefs(pkg.exact_allowed_read_refs), `${context}.exact_allowed_read_refs mismatch`);
  assert(Array.isArray(pkg.exact_future_external_operations) && pkg.exact_future_external_operations.length === 2, `${context}.exact_future_external_operations mismatch`);
  assert(sameTargets(pkg.exact_future_external_targets), `${context}.exact_future_external_targets mismatch`);
  assert(pkg.allowed_operations_after_activation.read_exact_metadata_refs_only === true, `${context}.read_exact_metadata_refs_only mismatch`);
  assert(pkg.allowed_operations_after_activation.write_one_DailyNote_entry_in_Chinese_only_to_frozen_target === true, `${context}.DailyNote operation mismatch`);
  assert(pkg.allowed_operations_after_activation.write_one_VCP_memory_summary_only_after_DailyNote_success_to_frozen_target === true, `${context}.VCP operation mismatch`);
  assert(pkg.allowed_operations_after_activation.use_memory_delta_draft_only_payload_no_binary_or_secret_content === true, `${context}.memory_delta payload mismatch`);
  assert(pkg.allowed_operations_after_activation.create_or_update_local_project_files === false, `${context}.local project write mismatch`);
  assert(pkg.allowed_operations_after_activation.update_existing_external_records_allowed === false, `${context}.external record update mismatch`);
  assert(pkg.future_memory_payload_requirements.source_memory_delta_draft_ref === files.memoryDeltaDraft, `${context}.source_memory_delta_draft_ref mismatch`);
  assert(pkg.future_memory_payload_requirements.sensitive_data_scan_ref === files.sensitiveDataScan, `${context}.sensitive_data_scan_ref mismatch`);
  assert(pkg.future_memory_payload_requirements.exact_allowed_targets_package_ref === files.targetsPackage, `${context}.exact_allowed_targets_package_ref mismatch`);
  assert(pkg.future_memory_payload_requirements.daily_note_language === "zh-CN", `${context}.daily_note_language mismatch`);
  assert(pkg.future_memory_payload_requirements.vcp_memory_summary_language === "zh-CN", `${context}.vcp_memory_summary_language mismatch`);
  assert(pkg.future_memory_payload_requirements.image_binary_included === false, `${context}.image_binary_included mismatch`);
  assert(pkg.future_memory_payload_requirements.raw_secret_or_private_path_allowed === false, `${context}.secret/private mismatch`);
  assert(pkg.future_memory_payload_requirements.customer_private_data_allowed === false, `${context}.customer_private_data mismatch`);
  assert(pkg.required_preconditions.human_approval_captured === false, `${context}.human_approval_captured mismatch`);
  assert(pkg.required_preconditions.accepted_sample_registration_completed === false, `${context}.accepted_sample_registration_completed mismatch`);
  assert(pkg.required_preconditions.durable_archive_ready === false, `${context}.durable_archive_ready mismatch`);
  assert(pkg.required_preconditions.production_candidate_ready === false, `${context}.production_candidate_ready mismatch`);
  assert(pkg.required_preconditions.exact_allowed_memory_targets_present === true, `${context}.exact_allowed_memory_targets_present mismatch`);
  assert(pkg.required_preconditions.memory_delta_draft_present === true, `${context}.memory_delta_draft_present mismatch`);
  assert(pkg.required_preconditions.sensitive_data_scan_present === true, `${context}.sensitive_data_scan_present mismatch`);
  assert(pkg.required_preconditions.explicit_daily_note_write_authorization_present === false, `${context}.explicit_daily_note_write_authorization_present mismatch`);
  assert(pkg.required_preconditions.explicit_vcp_memory_write_authorization_present === false, `${context}.explicit_vcp_memory_write_authorization_present mismatch`);
  assert(pkg.required_preconditions.write_command_permission_present === false, `${context}.write_command_permission_present mismatch`);
  for (const blocker of [
    "human_approval_missing",
    "accepted_sample_registration_missing",
    "durable_archive_completion_missing",
    "production_candidate_authorization_missing",
    "explicit_daily_note_write_authorization_missing",
    "explicit_vcp_memory_write_authorization_missing",
    "write_command_permission_missing"
  ]) {
    assert(pkg.current_blockers.includes(blocker), `${context}.current_blockers missing ${blocker}`);
  }
  for (const field of [
    "image_binary_read",
    "image_binary_copy",
    "runs_source_modification",
    "accepted_samples_write",
    "failure_samples_write",
    "production_candidate_write",
    "durable_archive_write",
    "local_project_file_write",
    "provider_contact",
    "plugin_call",
    "api_call",
    "runtime_execution",
    "real_manifest_VCPChat_VCPToolBox_read",
    "push_tag_release_deploy",
    "dependency_change"
  ]) {
    assert(pkg.forbidden_operations[field] === true, `${context}.forbidden_operations.${field} mismatch`);
  }
  assert(pkg.rollback_plan.mode === "revoke_future_memory_write_request_only_if_future_execution_fails", `${context}.rollback mode mismatch`);
  assert(pkg.rollback_plan.local_project_cleanup_allowed === false, `${context}.rollback local cleanup mismatch`);
  assert(pkg.rollback_plan.delete_any_unlisted_path_allowed === false, `${context}.rollback delete mismatch`);
  assert(pkg.rollback_plan.external_revoke_required_after_future_write === true, `${context}.rollback external revoke mismatch`);
  assert(typeof pkg.exact_future_approval_phrase === "string" && pkg.exact_future_approval_phrase.includes(expected.authorizationId), `${context}.exact_future_approval_phrase mismatch`);
  assert(pkg.exact_future_approval_phrase.includes(expectedTargets[0].target_id), `${context}.approval phrase DailyNote target mismatch`);
  assert(pkg.exact_future_approval_phrase.includes(expectedTargets[1].target_id), `${context}.approval phrase VCP target mismatch`);
  for (const field of [
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "direct_memory_write_performed",
    "local_project_file_write_performed",
    "accepted_samples_write_performed",
    "archive_write_performed",
    "production_candidate_write_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "runtime_execution_performed",
    "real_manifest_read_performed",
    "real_vcpchat_read_performed",
    "real_vcptoolbox_read_performed",
    "push_tag_release_deploy_performed",
    "dependency_change_performed"
  ]) {
    assert(pkg.execution_performed[field] === false, `${context}.execution_performed.${field} mismatch`);
  }
}

function evaluate(record) {
  const sourceRefs = record.source_refs || {};
  const target = record.target || {};
  const draftScope = record.draft_scope || {};
  const guard = record.guard || {};

  const refreshPreflight = readJson(files.memoryAuthorizationRefresh).exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight;
  const exactTargetsPackageReport = readJson(files.exactAllowedMemoryTargetsPackage).exact_new_trial_003_exact_allowed_memory_targets_package;
  const targetsPackage = readJson(files.targetsPackage).exact_allowed_memory_targets_package;
  const memoryDeltaDraftPackage = readJson(files.memoryDeltaDraftPackage).exact_new_trial_003_memory_delta_draft_package;
  const sensitiveDataScanPreflight = readJson(files.sensitiveDataScanPreflight).exact_new_trial_003_sensitive_data_scan_preflight;
  const shot2Closeout = readJson(files.shot2Closeout).exact_new_trial_003_shot_2_execution_closeout;
  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const authorizationPackage = readJson(files.authorizationPackage);
  const memoryDeltaDraftText = read(files.memoryDeltaDraft);
  const sensitiveDataScan = readJson(files.sensitiveDataScan);
  const registryText = read(files.acceptedSampleRegistry);
  const categoryText = read(files.categoryIndex);

  validateAuthorizationPackage(authorizationPackage, "authorization_package");

  return (
    record.phase === expected.phase &&
    record.execution_mode === "memory_write_authorization_package_draft_only" &&
    sourceRefs.memory_authorization_refresh_preflight === files.memoryAuthorizationRefresh &&
    sourceRefs.exact_allowed_memory_targets_package === files.exactAllowedMemoryTargetsPackage &&
    sourceRefs.memory_delta_draft_package === files.memoryDeltaDraftPackage &&
    sourceRefs.sensitive_data_scan_preflight === files.sensitiveDataScanPreflight &&
    sourceRefs.shot_2_closeout === files.shot2Closeout &&
    sourceRefs.human_review === files.humanReview &&
    record.authorization_package_ref === files.authorizationPackage &&
    record.authorization_package_status === expected.packageStatus &&
    record.authorization_granted_by_this_record === false &&
    record.execution_ready === false &&
    record.execution_allowed_now === false &&
    record.blocker === expected.blocker &&
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.reviewer === expected.reviewer &&
    target.human_approval_status === "pending" &&
    target.approved_by === null &&
    target.memory_delta_draft_ref === files.memoryDeltaDraft &&
    target.sensitive_data_scan_ref === files.sensitiveDataScan &&
    target.exact_allowed_memory_targets_package_ref === files.targetsPackage &&
    target.accepted_sample_registration_completed === false &&
    target.durable_archive_ready === false &&
    target.production_candidate_ready === false &&
    target.daily_note_write_authorized === false &&
    target.vcp_memory_write_authorized === false &&
    target.write_command_permission === false &&
    typeof record.exact_approval_statement_draft === "string" &&
    record.exact_approval_statement_draft.includes(expected.authorizationId) &&
    record.exact_approval_statement_draft.includes(expectedTargets[0].target_id) &&
    record.exact_approval_statement_draft.includes(expectedTargets[1].target_id) &&
    sameReadRefs(draftScope.would_read_refs) &&
    sameTargets(draftScope.exact_allowed_memory_targets) &&
    Array.isArray(draftScope.forbidden_paths_or_operations) &&
    draftScope.forbidden_paths_or_operations.includes("accepted_samples/") &&
    draftScope.forbidden_paths_or_operations.includes("provider/plugin/API/runtime") &&
    Array.isArray(draftScope.validation_required) &&
    draftScope.validation_required.includes("node scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.js") &&
    Array.isArray(draftScope.stop_conditions) &&
    draftScope.stop_conditions.includes("human approval remains missing") &&
    refreshPreflight.memory_delta_draft_present === true &&
    refreshPreflight.sensitive_data_scan_present === true &&
    exactTargetsPackageReport.target.exact_allowed_memory_targets_defined === true &&
    exactTargetsPackageReport.target.exact_allowed_memory_targets_count === 2 &&
    sameTargets(exactTargetsPackageReport.exact_allowed_memory_targets) &&
    sameTargets(targetsPackage.exact_allowed_memory_targets) &&
    memoryDeltaDraftPackage.verified_content.daily_note_draft_cn_present === true &&
    memoryDeltaDraftPackage.verified_content.vcp_memory_draft_cn_present === true &&
    sensitiveDataScanPreflight.target.scan_status === "passed_local_no_sensitive_content_detected" &&
    sensitiveDataScan.scan_passed === true &&
    shot2Closeout.review.memory_suitability === "deferred" &&
    humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId &&
    humanReview.decision_boundary.memory_suitability === "deferred" &&
    registryText.includes("sample_id:") &&
    categoryText.includes("fashion_lookbook_portrait") &&
    memoryDeltaDraftText.includes("title_cn:") &&
    memoryDeltaDraftText.includes("summary_cn:") &&
    guard.draft_only === true &&
    guard.authorization_package_only === true &&
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

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "authorization_package_created: true",
    `authorization_package_ref: ${files.authorizationPackage}`,
    "reviewer: Jenn",
    "authorization_granted_by_this_record: false",
    "exact_allowed_memory_targets_count: 2",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.js"), "validate_mvp missing exact memory-write authorization draft validator");

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
    expectFailure(passFixture, "granted_package_fails", (candidate) => {
      candidate.authorization_granted_by_this_record = true;
      candidate.authorization_package_status = "granted";
    }),
    expectFailure(passFixture, "execution_ready_without_grant_fails", (candidate) => {
      candidate.execution_ready = true;
      candidate.execution_allowed_now = true;
    }),
    expectFailure(passFixture, "daily_note_target_drift_fails", (candidate) => {
      candidate.draft_scope.exact_allowed_memory_targets[0].target_id = "wrong_target";
    }),
    expectFailure(passFixture, "missing_memory_delta_ref_fails", (candidate) => {
      candidate.target.memory_delta_draft_ref = null;
    }),
    expectFailure(passFixture, "broad_write_scope_fails", (candidate) => {
      candidate.guard.accepted_samples_write_performed = true;
      candidate.guard.local_project_file_write_performed = true;
    }),
    expectFailure(passFixture, "runtime_claim_fails", (candidate) => {
      candidate.guard.vcp_runtime_integration_proven = true;
      candidate.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    authorization_package_status: report.authorization_package_status,
    authorization_id: expected.authorizationId,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    reviewer: report.target.reviewer,
    exact_allowed_memory_targets_count: report.draft_scope.exact_allowed_memory_targets.length,
    authorization_granted_by_this_record: report.authorization_granted_by_this_record,
    execution_ready: report.execution_ready,
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
