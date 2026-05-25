#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { sourceArtifactHashEvidence } = require("./lib/exact_new_trial_legacy_artifacts");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_33_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_HUMAN_APPROVAL_INTAKE_PACKAGE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_selected_candidate_human_approval_intake_package.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_selected_candidate_human_approval_intake_package_fail.example.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  selectedCloseout: "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package",
  attemptId: "v0_3_3_exact_new_trial_003_shot_2",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  recommendedNext: "prepare_exact_new_trial_003_selected_candidate_post_approval_gate_alignment_before_any_accepted_samples_write"
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
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

function lines(value) {
  return value ? value.split(/\r?\n/).filter(Boolean) : [];
}

function fileSha(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
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

function statementMatches(statement) {
  const tokens = [
    "Jenn",
    `候选 ${expected.attemptId}`,
    expected.sampleId,
    expected.category,
    `artifact 为 ${expected.artifactRef}`,
    `sha256=${expected.sha256}`,
    `dimensions=${expected.dimensions}`,
    `mime=${expected.mime}`,
    "仅登记 accepted_samples 元数据和 fashion_lookbook_portrait 分类索引",
    "不复制图片",
    "不修改 runs 源图",
    "不晋级 production_candidate",
    "不写 failure_samples",
    "不写 DailyNote",
    "不写 VCP memory",
    "不调用 provider/API/plugin/MCP",
    "不读取 .env/.env.local",
    "不读取 real manifest/VCPChat/VCPToolBox",
    "不 push/tag/release/deploy",
    "审批人 Jenn"
  ];
  return typeof statement === "string" && tokens.every((token) => statement.includes(token));
}

function evaluate(input) {
  const target = input.target || {};
  const intake = input.approval_intake || {};
  const allowedFiles = input.future_allowed_files_after_approval || [];
  const required = input.future_required_before_write || [];
  const guard = input.guard || {};

  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const closeout = readJson(files.selectedCloseout).exact_new_trial_003_shot_2_execution_closeout;
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);
  const phaseText = read(files.phaseRecord);
  const validationLog = read(files.validationLog);
  const mvpText = read(files.mvpValidator);
  const stagedFileCount = lines("").length;
  const targetSampleRegisteredNow =
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    registryText.includes("source_phase: v0_6_56") &&
    categoryText.includes(`  - ${expected.sampleId}`) &&
    categoryText.includes(`  ${expected.sampleId}:`);

  assert(humanReview.candidate_comparison.selected_candidate_attempt_id === expected.attemptId, "source human review selected candidate mismatch");
  assert(humanReview.candidate_comparison.selected_candidate_output_image_sha256 === expected.sha256, "source human review selected candidate sha mismatch");
  assert(closeout.attempt_id === expected.attemptId, "source closeout attempt mismatch");
  assert(closeout.output_image_sha256 === expected.sha256, "source closeout sha mismatch");
  assert(closeout.output_image_path === expected.artifactRef, "source closeout artifact path mismatch");
  assert(closeout.review.reviewable_sample === true && closeout.review.accepted_candidate === true, "source closeout review state mismatch");
  assert(closeout.output_image_dimensions.width === 941 && closeout.output_image_dimensions.height === 1672, "source closeout dimensions mismatch");
  assert(sourceArtifactHashEvidence(expected.artifactRef, expected.sha256).passed, "source artifact hash evidence mismatch");
  assert(categoryText.includes("category: fashion_lookbook_portrait"), "category index category mismatch");
  assert(!registryText.includes(expected.sampleId) || targetSampleRegisteredNow, "sample id exists without v0.6.56 registration evidence");
  assert(!categoryText.includes(expected.sampleId) || targetSampleRegisteredNow, "sample id exists in category index without v0.6.56 registration evidence");

  const identityOk =
    input.phase === expected.phase &&
    input.execution_mode === "human_approval_intake_package_only";
  const targetOk =
    target.candidate_attempt_id === expected.attemptId &&
    target.proposed_sample_id === expected.sampleId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.verified_sha256 === expected.sha256 &&
    target.verified_dimensions === expected.dimensions &&
    target.verified_mime === expected.mime &&
    target.reviewer_required === "Jenn" &&
    target.current_formal_human_approval_status === "pending" &&
    target.current_registration_eligible === false &&
    target.current_registration_blocker === "human_approval_missing";
  const intakeOk =
    statementMatches(intake.candidate_approval_statement_under_test) &&
    intake.approval_statement_source === "fixture_only_not_user_submitted" &&
    intake.approval_statement_source_is_user_submission === false &&
    intake.approval_statement_matches_required_form === true &&
    intake.human_approval_captured_now === false &&
    intake.registration_unlocks_only_after_external_user_approval === true &&
    intake.accepted_samples_registration_ready_now === false &&
    intake.current_registration_blocker === "human_approval_missing";
  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/fashion_lookbook_portrait.yaml") &&
    required.includes("approval statement must be submitted by Jenn rather than fixture-only local text") &&
    required.includes("allowed write set remains exactly accepted_samples/accepted_sample_registry.yaml and accepted_samples/categories/fashion_lookbook_portrait.yaml") &&
    required.includes("no image copy, no runs source image modification, no production_candidate, no failure_samples, no DailyNote, no VCP memory");
  const noWrites =
    guard.human_approval_intake_package_only === true &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.archive_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    stagedFileCount === 0;
  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false;
  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  for (const token of [
    "phase: v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package",
    expected.attemptId,
    expected.sampleId,
    expected.category,
    "approval_statement_source_is_user_submission: false",
    "human_approval_captured_now: false",
    "accepted_samples_registration_ready_now: false",
    "human_approval_intake_package_only: true",
    "accepted_samples_write_performed: false",
    "artifact_recoverability_is_not_vcp_runtime_integration: true"
  ]) {
    requireToken("phase_record", phaseText, token);
  }

  for (const token of [
    "validate_exact_new_trial_003_selected_candidate_human_approval_intake_package.js",
    "exact_new_trial_003_selected_candidate_human_approval_intake_package.example.json",
    "V0_6_33_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_HUMAN_APPROVAL_INTAKE_PACKAGE.md"
  ]) {
    requireToken("mvp", mvpText, token);
  }

  requireToken("validation_log", validationLog, "VALIDATION-20260524-v0.6.33-EXACT-NEW-TRIAL-003-SELECTED-CANDIDATE-HUMAN-APPROVAL-INTAKE-PACKAGE");

  return { passed: identityOk && targetOk && intakeOk && scopeOk && noWrites && noExternal && noRuntimeClaim, identityOk, targetOk, intakeOk, scopeOk, noWrites, noExternal, noRuntimeClaim };
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
    expectFailure(validRecord, "missing_reviewer_fails", (candidate) => { candidate.approval_intake.candidate_approval_statement_under_test = candidate.approval_intake.candidate_approval_statement_under_test.replace(/Jenn/g, ""); }),
    expectFailure(validRecord, "missing_candidate_id_fails", (candidate) => { candidate.approval_intake.candidate_approval_statement_under_test = candidate.approval_intake.candidate_approval_statement_under_test.replace(expected.attemptId, ""); }),
    expectFailure(validRecord, "missing_category_fails", (candidate) => { candidate.target.category = "fashion_lifestyle_still_life"; }),
    expectFailure(validRecord, "missing_artifact_hash_fails", (candidate) => { candidate.approval_intake.candidate_approval_statement_under_test = candidate.approval_intake.candidate_approval_statement_under_test.replace(expected.sha256, "deadbeef"); }),
    expectFailure(validRecord, "broad_write_scope_fails", (candidate) => { candidate.approval_intake.candidate_approval_statement_under_test = candidate.approval_intake.candidate_approval_statement_under_test.replace("仅登记 accepted_samples 元数据和 fashion_lookbook_portrait 分类索引", "修改项目文件"); }),
    expectFailure(validRecord, "approval_captured_now_fails", (candidate) => { candidate.approval_intake.human_approval_captured_now = true; }),
    expectFailure(validRecord, "registration_ready_now_fails", (candidate) => { candidate.approval_intake.accepted_samples_registration_ready_now = true; }),
    expectFailure(validRecord, "accepted_samples_write_flag_fails", (candidate) => { candidate.guard.accepted_samples_write_performed = true; }),
    expectFailure(validRecord, "external_action_flag_fails", (candidate) => { candidate.guard.provider_contact_performed = true; }),
    expectFailure(validRecord, "runtime_claim_fails", (candidate) => { candidate.guard.vcp_runtime_integration_proven = true; candidate.guard.artifact_recoverability_is_not_vcp_runtime_integration = false; })
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

  const report = readJson(files.report).exact_new_trial_003_selected_candidate_human_approval_intake_package;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_selected_candidate_human_approval_intake_package;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_selected_candidate_human_approval_intake_package;

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const summary = {
    phase: expected.phase,
    passed: true,
    selected_candidate_attempt_id: report.target.candidate_attempt_id,
    proposed_sample_id: report.target.proposed_sample_id,
    category: report.target.category,
    formal_human_approval_status: report.target.current_formal_human_approval_status,
    human_approval_captured_now: report.approval_intake.human_approval_captured_now,
    accepted_samples_registration_ready_now: report.approval_intake.accepted_samples_registration_ready_now,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
