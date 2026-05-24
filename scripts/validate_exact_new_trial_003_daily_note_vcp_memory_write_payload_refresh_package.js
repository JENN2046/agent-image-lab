#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_47_EXACT_NEW_TRIAL_003_DAILY_NOTE_VCP_MEMORY_WRITE_PAYLOAD_REFRESH_PACKAGE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_47_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.json",
  payloadPackage: "reports/memory_write_payloads/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_payload_refresh_package.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package_fail.example.json",
  memoryDeltaDraft: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  sensitiveDataScan: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  exactAllowedTargetsPackage: "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json",
  memoryWriteAuthorizationDraft: "reports/visual_asset_eval_dry_run/v0_6_45_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft.json",
  memoryWriteExecutionPreflight: "reports/visual_asset_eval_dry_run/v0_6_46_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight.json",
  memoryDeltaDraftPackage: "reports/visual_asset_eval_dry_run/v0_6_41_exact_new_trial_003_memory_delta_draft_package.json",
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
  phase: "v0_6_47_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package",
  payloadStatus: "refreshed_blocked_not_executable",
  blocker: "missing_human_approval_accepted_sample_registration_archive_completion_production_candidate_authorization_and_exact_daily_note_vcp_memory_write_grant",
  authorizationId: "AUTH-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-MEMORY-WRITE-20260524-001",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  reviewer: "Jenn",
  dailyNoteTarget: "exact_new_trial_003_shot_2_daily_note_review_learning_entry",
  vcpMemoryTarget: "exact_new_trial_003_shot_2_vcp_memory_review_learning_summary",
  recommendedNext: "prepare_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract_with_payload_refresh_package_preserved"
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

function extractScalar(text, key) {
  const match = text.match(new RegExp(`${key}:\\s*"([^"]+)"`));
  assert(match, `Missing scalar ${key} in memory delta draft`);
  return match[1];
}

function extractLessons(text) {
  const lines = text.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.trim() === "lessons_cn:");
  assert(startIndex >= 0, "Missing lessons_cn block in memory delta draft");
  const lessons = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith("      - ")) break;
    const match = line.match(/-\s+"([^"]+)"\s*$/);
    assert(match, `Malformed lessons_cn entry: ${line}`);
    lessons.push(match[1]);
  }
  assert(lessons.length === 3, "Expected exactly 3 lessons in memory delta draft");
  return lessons;
}

function sameTargets(targets) {
  return JSON.stringify(targets) === JSON.stringify(expectedTargets);
}

function isChineseTag(value) {
  return value === "zh-CN";
}

function evaluate(reportRecord, payloadRecord) {
  const memoryDraftText = read(files.memoryDeltaDraft);
  const memoryDraftPackage = readJson(files.memoryDeltaDraftPackage).exact_new_trial_003_memory_delta_draft_package;
  const scan = readJson(files.sensitiveDataScan);
  const targetsPackage = readJson(files.exactAllowedTargetsPackage).exact_allowed_memory_targets_package;
  const authorizationDraft = readJson(files.memoryWriteAuthorizationDraft).exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft;
  const executionPreflight = readJson(files.memoryWriteExecutionPreflight).exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight;

  const titleCn = extractScalar(memoryDraftText, "title_cn");
  const bodyCn = extractScalar(memoryDraftText, "body_cn");
  const summaryCn = extractScalar(memoryDraftText, "summary_cn");
  const lessonsCn = extractLessons(memoryDraftText);

  return (
    reportRecord.phase === expected.phase &&
    reportRecord.execution_mode === "daily_note_vcp_memory_write_payload_refresh_package_only" &&
    reportRecord.payload_package_ref === files.payloadPackage &&
    reportRecord.payload_refresh_status === expected.payloadStatus &&
    reportRecord.blocker === expected.blocker &&
    reportRecord.target.sample_id === expected.sampleId &&
    reportRecord.target.candidate_id === expected.candidateId &&
    reportRecord.target.category === expected.category &&
    reportRecord.target.reviewer === expected.reviewer &&
    reportRecord.target.authorization_id === expected.authorizationId &&
    reportRecord.target.accepted_sample_registration_completed === false &&
    reportRecord.target.durable_archive_ready === false &&
    reportRecord.target.production_candidate_ready === false &&
    reportRecord.target.daily_note_write_authorized === false &&
    reportRecord.target.vcp_memory_write_authorized === false &&
    reportRecord.target.write_command_permission === false &&
    reportRecord.target.execution_ready === false &&
    reportRecord.target.execution_allowed_now === false &&
    reportRecord.refreshed_payload.daily_note_target_id === expected.dailyNoteTarget &&
    isChineseTag(reportRecord.refreshed_payload.daily_note_language) &&
    reportRecord.refreshed_payload.daily_note_title_cn_present === true &&
    reportRecord.refreshed_payload.daily_note_body_cn_present === true &&
    reportRecord.refreshed_payload.vcp_memory_target_id === expected.vcpMemoryTarget &&
    isChineseTag(reportRecord.refreshed_payload.vcp_memory_language) &&
    reportRecord.refreshed_payload.vcp_memory_summary_cn_present === true &&
    reportRecord.refreshed_payload.vcp_memory_lessons_count === 3 &&
    reportRecord.refreshed_payload.payload_source_chain_verified === true &&
    reportRecord.refreshed_payload.scan_state_preserved === true &&
    reportRecord.guard.payload_refresh_only === true &&
    reportRecord.guard.authorization_granted_by_this_package === false &&
    reportRecord.guard.execution_ready === false &&
    reportRecord.guard.execution_allowed_now === false &&
    reportRecord.guard.DailyNote_write_performed === false &&
    reportRecord.guard.VCP_memory_write_performed === false &&
    reportRecord.guard.accepted_samples_write_performed === false &&
    reportRecord.guard.archive_write_performed === false &&
    reportRecord.guard.production_candidate_write_performed === false &&
    reportRecord.guard.provider_contact_performed === false &&
    reportRecord.guard.plugin_call_performed === false &&
    reportRecord.guard.api_call_performed === false &&
    reportRecord.guard.mcp_runtime_performed === false &&
    reportRecord.guard.image_generation_performed === false &&
    reportRecord.guard.staging_performed === false &&
    reportRecord.guard.commit_performed === false &&
    reportRecord.guard.push_tag_release_deploy_performed === false &&
    reportRecord.guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    reportRecord.guard.vcp_runtime_integration_proven === false &&
    reportRecord.recommended_next === expected.recommendedNext &&
    payloadRecord.report_version === 1 &&
    payloadRecord.package_type === "daily_note_vcp_memory_write_payload_refresh_package" &&
    payloadRecord.phase === expected.phase &&
    payloadRecord.payload_status === expected.payloadStatus &&
    payloadRecord.target_sample_id === expected.sampleId &&
    payloadRecord.target_candidate_id === expected.candidateId &&
    payloadRecord.category === expected.category &&
    payloadRecord.reviewer === expected.reviewer &&
    payloadRecord.authorization_id === expected.authorizationId &&
    payloadRecord.source_refs.memory_delta_draft === files.memoryDeltaDraft &&
    payloadRecord.source_refs.sensitive_data_scan === files.sensitiveDataScan &&
    payloadRecord.source_refs.exact_allowed_targets_package === files.exactAllowedTargetsPackage &&
    payloadRecord.source_refs.memory_write_authorization_package_draft === files.memoryWriteAuthorizationDraft &&
    payloadRecord.source_refs.memory_write_execution_preflight === files.memoryWriteExecutionPreflight &&
    sameTargets(payloadRecord.exact_allowed_targets) &&
    payloadRecord.daily_note_payload.target_id === expected.dailyNoteTarget &&
    isChineseTag(payloadRecord.daily_note_payload.language) &&
    payloadRecord.daily_note_payload.title_cn === titleCn &&
    payloadRecord.daily_note_payload.body_cn === bodyCn &&
    payloadRecord.daily_note_payload.write_mode === "draft_refresh" &&
    payloadRecord.daily_note_payload.approval_required === true &&
    payloadRecord.daily_note_payload.approval_status === "pending" &&
    payloadRecord.daily_note_payload.write_allowed_now === false &&
    payloadRecord.daily_note_payload.DailyNote_write_performed === false &&
    payloadRecord.vcp_memory_payload.target_id === expected.vcpMemoryTarget &&
    isChineseTag(payloadRecord.vcp_memory_payload.language) &&
    payloadRecord.vcp_memory_payload.memory_type === "accepted_candidate_review_learning_draft" &&
    payloadRecord.vcp_memory_payload.summary_cn === summaryCn &&
    JSON.stringify(payloadRecord.vcp_memory_payload.lessons_cn) === JSON.stringify(lessonsCn) &&
    payloadRecord.vcp_memory_payload.depends_on_daily_note_success === true &&
    payloadRecord.vcp_memory_payload.write_mode === "draft_refresh" &&
    payloadRecord.vcp_memory_payload.approval_required === true &&
    payloadRecord.vcp_memory_payload.approval_status === "pending" &&
    payloadRecord.vcp_memory_payload.should_write_to_vcp === false &&
    payloadRecord.vcp_memory_payload.write_allowed_now === false &&
    payloadRecord.vcp_memory_payload.VCP_memory_write_performed === false &&
    payloadRecord.payload_safety.contains_secret === false &&
    payloadRecord.payload_safety.contains_private_path === false &&
    payloadRecord.payload_safety.contains_customer_private_data === false &&
    payloadRecord.payload_safety.contains_image_binary === false &&
    payloadRecord.payload_safety.raw_sensitive_content_saved === false &&
    payloadRecord.required_blockers.includes("human_approval_missing") &&
    payloadRecord.required_blockers.includes("accepted_sample_registration_missing") &&
    payloadRecord.required_blockers.includes("durable_archive_completion_missing") &&
    payloadRecord.required_blockers.includes("production_candidate_authorization_missing") &&
    payloadRecord.required_blockers.includes("explicit_daily_note_write_authorization_missing") &&
    payloadRecord.required_blockers.includes("explicit_vcp_memory_write_authorization_missing") &&
    payloadRecord.required_blockers.includes("write_command_permission_missing") &&
    payloadRecord.execution_state.authorization_granted_by_this_package === false &&
    payloadRecord.execution_state.execution_ready === false &&
    payloadRecord.execution_state.execution_allowed_now === false &&
    payloadRecord.execution_state.DailyNote_write_performed === false &&
    payloadRecord.execution_state.VCP_memory_write_performed === false &&
    payloadRecord.execution_state.accepted_samples_write_performed === false &&
    payloadRecord.execution_state.archive_write_performed === false &&
    payloadRecord.execution_state.production_candidate_write_performed === false &&
    payloadRecord.execution_state.provider_contact_performed === false &&
    payloadRecord.execution_state.plugin_call_performed === false &&
    payloadRecord.execution_state.api_call_performed === false &&
    payloadRecord.execution_state.mcp_runtime_performed === false &&
    payloadRecord.execution_state.image_generation_performed === false &&
    payloadRecord.execution_state.push_tag_release_deploy_performed === false &&
    payloadRecord.execution_state.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    payloadRecord.execution_state.vcp_runtime_integration_proven === false &&
    memoryDraftPackage.draft_content.daily_note_draft_language === "zh-CN" &&
    memoryDraftPackage.draft_content.vcp_memory_draft_language === "zh-CN" &&
    memoryDraftPackage.verified_content.daily_note_draft_cn_present === true &&
    memoryDraftPackage.verified_content.vcp_memory_draft_cn_present === true &&
    memoryDraftPackage.verified_content.memory_delta_source_chain_verified === true &&
    scan.scan_passed === true &&
    targetsPackage.memory_delta_draft_ref === files.memoryDeltaDraft &&
    targetsPackage.sensitive_data_scan_ref === files.sensitiveDataScan &&
    sameTargets(targetsPackage.exact_allowed_memory_targets) &&
    authorizationDraft.authorization_package_status === "prepared_blocked_not_granted" &&
    executionPreflight.preflight_status === "blocked" &&
    executionPreflight.target.execution_allowed_now === false
  );
}

function validateRecord(reportRecord, payloadRecord, context) {
  assert(reportRecord && typeof reportRecord === "object", `${context} report missing`);
  assert(payloadRecord && typeof payloadRecord === "object", `${context} payload package missing`);
  assertNoRawLocalDrivePath(reportRecord, `${context}.report`);
  assertNoRawLocalDrivePath(payloadRecord, `${context}.payload`);
  assert(evaluate(reportRecord, payloadRecord), `${context} evaluation failed`);
}

function expectFailure(baseReport, basePayload, caseId, mutate) {
  const candidateReport = clone(baseReport);
  const candidatePayload = clone(basePayload);
  mutate(candidateReport, candidatePayload);
  try {
    validateRecord(candidateReport, candidatePayload, caseId);
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
  const report = readJson(files.report).exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package;
  const payloadPackage = readJson(files.payloadPackage).daily_note_vcp_memory_write_payload_refresh_package;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    `authorization_id: ${expected.authorizationId}`,
    `daily_note_target_id: ${expected.dailyNoteTarget}`,
    `vcp_memory_target_id: ${expected.vcpMemoryTarget}`,
    "payload_refresh_status: refreshed_blocked_not_executable",
    "daily_note_title_cn_present: true",
    "vcp_memory_lessons_count: 3",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package.js"),
    "validate_mvp missing exact memory-write payload refresh validator"
  );

  validateRecord(report, payloadPackage, "report");
  validateRecord(passFixture, payloadPackage, "pass_fixture");

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, payloadPackage, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, payloadPackage, "non_chinese_daily_note_title_fails", (candidateReport, candidatePayload) => {
      candidateReport.refreshed_payload.daily_note_language = "en-US";
      candidatePayload.daily_note_payload.language = "en-US";
    }),
    expectFailure(passFixture, payloadPackage, "daily_note_target_drift_fails", (candidateReport, candidatePayload) => {
      candidateReport.refreshed_payload.daily_note_target_id = "wrong_target";
      candidatePayload.daily_note_payload.target_id = "wrong_target";
    }),
    expectFailure(passFixture, payloadPackage, "vcp_memory_lessons_count_drift_fails", (candidateReport, candidatePayload) => {
      candidateReport.refreshed_payload.vcp_memory_lessons_count = 2;
      candidatePayload.vcp_memory_payload.lessons_cn = candidatePayload.vcp_memory_payload.lessons_cn.slice(0, 2);
    }),
    expectFailure(passFixture, payloadPackage, "execution_allowed_now_true_fails", (candidateReport, candidatePayload) => {
      candidateReport.target.execution_allowed_now = true;
      candidateReport.guard.execution_allowed_now = true;
      candidatePayload.execution_state.execution_allowed_now = true;
    }),
    expectFailure(passFixture, payloadPackage, "sensitive_data_scan_not_preserved_fails", (candidateReport) => {
      candidateReport.refreshed_payload.scan_state_preserved = false;
    }),
    expectFailure(passFixture, payloadPackage, "broad_target_scope_fails", (candidateReport, candidatePayload) => {
      candidatePayload.exact_allowed_targets.push({
        system: "VCP_memory",
        operation: "write_many",
        language: "zh-CN",
        target_id: "broad_target"
      });
    }),
    expectFailure(passFixture, payloadPackage, "runtime_claim_fails", (candidateReport, candidatePayload) => {
      candidateReport.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
      candidateReport.guard.vcp_runtime_integration_proven = true;
      candidatePayload.execution_state.artifact_recoverability_is_not_vcp_runtime_integration = false;
      candidatePayload.execution_state.vcp_runtime_integration_proven = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    package_type: payloadPackage.package_type,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    payload_refresh_status: report.payload_refresh_status,
    daily_note_target_id: report.refreshed_payload.daily_note_target_id,
    vcp_memory_target_id: report.refreshed_payload.vcp_memory_target_id,
    vcp_memory_lessons_count: report.refreshed_payload.vcp_memory_lessons_count,
    execution_allowed_now: report.target.execution_allowed_now,
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
