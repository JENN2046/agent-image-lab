#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_41_EXACT_NEW_TRIAL_003_MEMORY_DELTA_DRAFT_PACKAGE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_41_exact_new_trial_003_memory_delta_draft_package.json",
  draftPackage: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  passFixture: "tests/schema_examples/exact_new_trial_003_memory_delta_draft_package.example.yaml",
  failFixture: "tests/schema_examples/exact_new_trial_003_memory_delta_draft_package_fail.example.yaml",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  shot2Closeout: "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  promptPackage: "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml",
  productionCandidatePreflight: "reports/visual_asset_eval_dry_run/v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.json",
  memoryAuthorizationPreflight: "reports/visual_asset_eval_dry_run/v0_6_40_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_41_exact_new_trial_003_memory_delta_draft_package",
  packageType: "memory_delta_draft_package",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  draftPackageRef: files.draftPackage,
  reportStatus: "completed_validated_local_memory_delta_draft_package_pending_external_human_approval_accepted_sample_archive_production_and_memory_authorization",
  packageStatus: "draft_only_blocked_by_accepted_sample_archive_production_and_memory_authorization_dependencies",
  recommendedNext: "prepare_exact_new_trial_003_sensitive_data_scan_preflight_with_memory_delta_dependency_preserved"
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

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
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

function extractMatch(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1] : null;
}

function evaluatePackageText(text) {
  const dailyNoteBody = extractMatch(text, /body_cn:\s*"([^"]+)"/);
  const memorySummary = extractMatch(text, /summary_cn:\s*"([^"]+)"/);
  const lessons = Array.from(text.matchAll(/^\s*-\s*"([^"]+)"/gm)).map((match) => match[1]);

  const packageOk =
    text.includes(`phase: ${expected.phase}`) &&
    text.includes(`package_type: ${expected.packageType}`) &&
    text.includes("execution_mode: exact_new_trial_memory_delta_draft_package_only") &&
    text.includes("authorization_granted_by_this_package: false");

  const sourceChainOk =
    text.includes(`sample_id: ${expected.sampleId}`) &&
    text.includes(`candidate_id: ${expected.candidateId}`) &&
    text.includes(`category: ${expected.category}`) &&
    text.includes(`prompt_package_ref: ${files.promptPackage}`) &&
    text.includes(`human_review_ref: ${files.humanReview}`) &&
    text.includes(`shot_closeout_ref: ${files.shot2Closeout}`) &&
    text.includes(`production_candidate_preflight_ref: ${files.productionCandidatePreflight}`) &&
    text.includes(`memory_authorization_preflight_ref: ${files.memoryAuthorizationPreflight}`) &&
    text.includes("memory_suitability_status: deferred") &&
    text.includes("accepted_sample_registration_completed: false") &&
    text.includes("durable_archive_ready: false") &&
    text.includes("production_candidate_ready: false") &&
    text.includes("daily_note_write_authorized: false") &&
    text.includes("vcp_memory_write_authorized: false");

  const draftContentOk =
    text.includes("language: zh-CN") &&
    text.includes("write_mode: draft") &&
    text.includes("approval_required: true") &&
    text.includes("approval_status: pending") &&
    text.includes("write_allowed_now: false") &&
    text.includes("should_write_to_vcp: false") &&
    dailyNoteBody !== null &&
    memorySummary !== null &&
    hasChinese(dailyNoteBody) &&
    hasChinese(memorySummary) &&
    lessons.length >= 3 &&
    lessons.every((item) => hasChinese(item));

  const safetyOk =
    text.includes("contains_secret: false") &&
    text.includes("contains_private_path: false") &&
    text.includes("contains_customer_private_data: false") &&
    text.includes("contains_image_binary: false") &&
    text.includes("raw_sensitive_content_saved: false") &&
    !/^[A-Za-z]:[\\/]/m.test(text);

  const boundaryOk =
    text.includes("execution_allowed_now: false") &&
    text.includes("DailyNote_write_performed: false") &&
    text.includes("VCP_memory_write_performed: false") &&
    text.includes("direct_memory_write_performed: false") &&
    text.includes("archive_write_performed: false") &&
    text.includes("production_candidate_write_performed: false") &&
    text.includes("provider_contact_performed: false") &&
    text.includes("plugin_call_performed: false") &&
    text.includes("api_call_performed: false") &&
    text.includes("mcp_runtime_performed: false") &&
    text.includes("image_generation_performed: false") &&
    text.includes("image_binary_included: false") &&
    text.includes("push_tag_release_deploy_performed: false") &&
    text.includes("artifact_recoverability_is_not_vcp_runtime_integration: true") &&
    text.includes("vcp_runtime_integration_proven: false");

  return {
    passed: packageOk && sourceChainOk && draftContentOk && safetyOk && boundaryOk,
    packageOk,
    sourceChainOk,
    draftContentOk,
    safetyOk,
    boundaryOk
  };
}

function validateReport(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);

  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const shot2Closeout = readJson(files.shot2Closeout).exact_new_trial_003_shot_2_execution_closeout;
  const productionCandidatePreflight = readJson(files.productionCandidatePreflight).exact_new_trial_003_production_candidate_authorization_compiler_output_preflight;
  const memoryAuthorizationPreflight = readJson(files.memoryAuthorizationPreflight).exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight;

  assert(record.phase === expected.phase, `${context}.phase mismatch`);
  assert(record.status === expected.reportStatus, `${context}.status mismatch`);
  assert(record.execution_mode === "exact_new_trial_memory_delta_draft_package_only", `${context}.execution_mode mismatch`);
  assert(record.package_type === expected.packageType, `${context}.package_type mismatch`);
  assert(record.package_status === expected.packageStatus, `${context}.package_status mismatch`);
  assert(record.target.sample_id === expected.sampleId, `${context}.target.sample_id mismatch`);
  assert(record.target.candidate_id === expected.candidateId, `${context}.target.candidate_id mismatch`);
  assert(record.target.category === expected.category, `${context}.target.category mismatch`);
  assert(record.target.draft_package_ref === expected.draftPackageRef, `${context}.draft package ref mismatch`);
  assert(record.target.accepted_sample_registration_completed === false, `${context}.accepted_sample_registration_completed mismatch`);
  assert(record.target.durable_archive_ready === false, `${context}.durable_archive_ready mismatch`);
  assert(record.target.production_candidate_ready === false, `${context}.production_candidate_ready mismatch`);
  assert(record.target.daily_note_write_authorized === false, `${context}.daily_note_write_authorized mismatch`);
  assert(record.target.vcp_memory_write_authorized === false, `${context}.vcp_memory_write_authorized mismatch`);
  assert(record.target.memory_suitability_status === "deferred", `${context}.memory_suitability_status mismatch`);
  assert(record.draft_content.daily_note_draft_language === "zh-CN", `${context}.daily_note_draft_language mismatch`);
  assert(record.draft_content.vcp_memory_draft_language === "zh-CN", `${context}.vcp_memory_draft_language mismatch`);
  assert(record.draft_content.write_mode === "draft", `${context}.write_mode mismatch`);
  assert(record.draft_content.approval_required === true, `${context}.approval_required mismatch`);
  assert(record.draft_content.approval_status === "pending", `${context}.approval_status mismatch`);
  assert(record.draft_content.should_write_to_vcp === false, `${context}.should_write_to_vcp mismatch`);
  assert(record.draft_content.execution_allowed_now === false, `${context}.execution_allowed_now mismatch`);
  assert(record.verified_content.daily_note_draft_cn_present === true, `${context}.daily_note_draft_cn_present mismatch`);
  assert(record.verified_content.vcp_memory_draft_cn_present === true, `${context}.vcp_memory_draft_cn_present mismatch`);
  assert(record.guard.authorization_granted_by_this_package === false, `${context}.authorization guard mismatch`);
  assert(record.guard.DailyNote_write_performed === false, `${context}.DailyNote guard mismatch`);
  assert(record.guard.VCP_memory_write_performed === false, `${context}.VCP guard mismatch`);
  assert(record.guard.vcp_runtime_integration_proven === false, `${context}.runtime guard mismatch`);
  assert(record.recommended_next === expected.recommendedNext, `${context}.recommended_next mismatch`);

  assert(humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId, `${context}.human review selected candidate mismatch`);
  assert(humanReview.decision_boundary.memory_suitability === "deferred", `${context}.human review memory suitability mismatch`);
  assert(shot2Closeout.review.memory_suitability === "deferred", `${context}.shot_2 closeout memory suitability mismatch`);
  assert(productionCandidatePreflight.execution_allowed_now === false, `${context}.production candidate preflight execution mismatch`);
  assert(memoryAuthorizationPreflight.execution_allowed_now === false, `${context}.memory authorization preflight execution mismatch`);
}

function expectFailure(baseText, caseId, mutate) {
  const candidate = mutate(baseText);
  const result = evaluatePackageText(candidate);
  if (!result.passed) {
    return { case_id: caseId, result: "caught", detail: result };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).exact_new_trial_003_memory_delta_draft_package;
  const draftPackageText = read(files.draftPackage);
  const passFixtureText = read(files.passFixture);
  const failFixtureText = read(files.failFixture);
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "memory_delta_draft_package_created: true",
    `draft_package_ref: ${files.draftPackage}`,
    "daily_note_draft_language: zh-CN",
    "vcp_memory_draft_language: zh-CN",
    "write_mode: draft",
    "approval_required: true",
    "approval_status: pending",
    "should_write_to_vcp: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_memory_delta_draft_package.js"), "validate_mvp missing new validator");

  validateReport(report, "report");

  const draftPackageEval = evaluatePackageText(draftPackageText);
  assert(draftPackageEval.passed, `draft package evaluation failed: ${JSON.stringify(draftPackageEval)}`);

  const passFixtureEval = evaluatePackageText(passFixtureText);
  assert(passFixtureEval.passed, `pass fixture evaluation failed: ${JSON.stringify(passFixtureEval)}`);

  const failFixtureEval = evaluatePackageText(failFixtureText);
  assert(!failFixtureEval.passed, "fail fixture must fail");

  const negativeCases = [
    expectFailure(passFixtureText, "non_chinese_daily_note_body_fails", (text) => text.replace("language: zh-CN", "language: en").replace("这次 exact-new-trial 003 的有效经验是把专业编辑感、保守着装、自然姿态和证据可追溯性一起看，而不是只看单一美观度。shot_2 成为当前首选，是因为它在红色西装、白色上衣、深色长裤、黄昏露台背景和专业表情之间取得了最稳的平衡，同时保留了 literal pre-provider-call payload capture。当前内容只是 DailyNote 草案；在 formal human approval、accepted_samples 注册、archive 完成和 production-candidate readiness 之前，不得写入。", "English text should fail.")),
    expectFailure(passFixtureText, "should_write_to_vcp_without_authorization_fails", (text) => text.replace("should_write_to_vcp: false", "should_write_to_vcp: true")),
    expectFailure(passFixtureText, "approval_granted_without_A5_fails", (text) => text.replace("authorization_granted_by_this_package: false", "authorization_granted_by_this_package: true")),
    expectFailure(passFixtureText, "raw_sensitive_content_fails", (text) => text.replace("raw_sensitive_content_saved: false", "raw_sensitive_content_saved: true")),
    expectFailure(passFixtureText, "image_binary_reference_fails", (text) => text.replace("contains_image_binary: false", "contains_image_binary: true").replace("image_binary_included: false", "image_binary_included: true")),
    expectFailure(passFixtureText, "execution_allowed_now_true_fails", (text) => text.replace("execution_allowed_now: false", "execution_allowed_now: true"))
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    package_type: expected.packageType,
    target_sample_id: expected.sampleId,
    target_candidate_id: expected.candidateId,
    category: expected.category,
    memory_delta_draft_package_created: true,
    draft_package_ref: expected.draftPackageRef,
    daily_note_draft_cn_present: true,
    vcp_memory_draft_cn_present: true,
    memory_suitability_status: "deferred",
    approval_required: true,
    approval_status: "pending",
    should_write_to_vcp: false,
    execution_allowed_now: false,
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
