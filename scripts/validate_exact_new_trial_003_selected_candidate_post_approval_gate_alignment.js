#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_34_EXACT_NEW_TRIAL_003_SELECTED_CANDIDATE_POST_APPROVAL_GATE_ALIGNMENT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_selected_candidate_post_approval_gate_alignment.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_selected_candidate_post_approval_gate_alignment_fail.example.json",
  selectedCloseout: "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  approvalIntakePackage: "reports/visual_asset_eval_dry_run/v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package.json",
  approvalIntakeValidator: "scripts/validate_exact_new_trial_003_selected_candidate_human_approval_intake_package.js",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment",
  candidateAttemptId: "v0_3_3_exact_new_trial_003_shot_2",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  recommendedNext: "wait_for_jenn_human_approval_then_run_exact_new_trial_003_post_approval_registration_preflight"
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

function evaluate(input) {
  const sourceRefs = input.source_refs || {};
  const target = input.target || {};
  const gate = input.gate || {};
  const guard = input.guard || {};
  const allowedFiles = input.future_allowed_files_after_approval || [];
  const required = input.future_required_before_write || [];

  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const closeout = readJson(files.selectedCloseout).exact_new_trial_003_shot_2_execution_closeout;
  const approvalIntake = readJson(files.approvalIntakePackage).exact_new_trial_003_selected_candidate_human_approval_intake_package;
  const categoryText = read(files.categoryIndex);
  const registryText = read(files.registry);
  const targetSampleRegisteredNow =
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    registryText.includes("source_phase: v0_6_56") &&
    categoryText.includes(`  - ${expected.sampleId}`) &&
    categoryText.includes(`  ${expected.sampleId}:`);

  assert(humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateAttemptId, "source human review selected candidate mismatch");
  assert(humanReview.candidate_comparison.selected_candidate_output_image_sha256 === expected.sha256, "source human review sha mismatch");
  assert(closeout.attempt_id === expected.candidateAttemptId, "source closeout attempt mismatch");
  assert(closeout.output_image_sha256 === expected.sha256, "source closeout sha mismatch");
  assert(closeout.output_image_path === expected.artifactRef, "source closeout artifact path mismatch");
  assert(closeout.review.reviewable_sample === true && closeout.review.accepted_candidate === true, "source closeout review state mismatch");
  assert(closeout.output_image_dimensions.width === 941 && closeout.output_image_dimensions.height === 1672, "source closeout dimensions mismatch");
  assert(fileSha(expected.artifactRef) === expected.sha256, "source artifact hash mismatch");
  assert(categoryText.includes("category: fashion_lookbook_portrait"), "category index mismatch");
  assert(!registryText.includes(expected.sampleId) || targetSampleRegisteredNow, "sample id exists without v0.6.56 registration evidence");
  assert(!categoryText.includes(expected.sampleId) || targetSampleRegisteredNow, "sample id exists in category index without v0.6.56 registration evidence");

  const sourceOk =
    sourceRefs.selected_candidate_closeout === files.selectedCloseout &&
    sourceRefs.human_review === files.humanReview &&
    sourceRefs.approval_intake_package === files.approvalIntakePackage &&
    sourceRefs.approval_intake_validator === files.approvalIntakeValidator &&
    approvalIntake.target.candidate_attempt_id === expected.candidateAttemptId &&
    approvalIntake.target.proposed_sample_id === expected.sampleId &&
    approvalIntake.target.category === expected.category &&
    approvalIntake.target.artifact_ref === expected.artifactRef &&
    approvalIntake.target.verified_sha256 === expected.sha256 &&
    approvalIntake.approval_intake.approval_statement_matches_required_form === true &&
    approvalIntake.approval_intake.approval_statement_source_is_user_submission === false &&
    approvalIntake.approval_intake.human_approval_captured_now === false &&
    approvalIntake.approval_intake.accepted_samples_registration_ready_now === false;

  const identityOk =
    input.phase === expected.phase &&
    input.execution_mode === "post_approval_gate_alignment_only";

  const targetOk =
    target.candidate_attempt_id === expected.candidateAttemptId &&
    target.proposed_sample_id === expected.sampleId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.verified_sha256 === expected.sha256 &&
    target.verified_dimensions === expected.dimensions &&
    target.verified_mime === expected.mime;

  const gateOk =
    gate.gate_status === "blocked" &&
    gate.blocker === "human_approval_missing" &&
    gate.approval_statement_matches_v0_6_33 === true &&
    gate.approval_statement_source_is_user_submission === false &&
    gate.human_approval_captured_now === false &&
    gate.registration_unlocks_only_after_external_user_approval === true &&
    gate.accepted_samples_registration_ready_now === false &&
    gate.future_registration_requires_v0_6_33_user_submission === true;

  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/fashion_lookbook_portrait.yaml") &&
    !allowedFiles.includes("accepted_samples/") &&
    required.includes("v0.6.32 selected candidate still remains shot_2") &&
    required.includes("v0.6.29 selected candidate closeout evidence still matches artifact hash and dimensions") &&
    required.includes("v0.6.33 exact approval statement is used") &&
    required.includes("future approval capture must come from Jenn rather than fixture-only local text") &&
    required.includes("future approval capture reports approval_statement_source_is_user_submission=true") &&
    required.includes("future approval capture reports human_approval_captured_now=true") &&
    required.includes("allowed write set remains exactly accepted_samples/accepted_sample_registry.yaml and accepted_samples/categories/fashion_lookbook_portrait.yaml") &&
    required.includes("no image copy, no runs source image modification, no production_candidate, no failure_samples, no DailyNote, no VCP memory");

  const noWrites =
    guard.post_approval_gate_alignment_only === true &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && sourceOk && targetOk && gateOk && scopeOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    sourceOk,
    targetOk,
    gateOk,
    scopeOk,
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
    expectFailure(validRecord, "missing_user_submission_requirement_fails", (candidate) => {
      candidate.future_required_before_write = candidate.future_required_before_write.filter((item) => !item.includes("approval_statement_source_is_user_submission=true"));
    }),
    expectFailure(validRecord, "approval_statement_alignment_overclaim_fails", (candidate) => {
      candidate.gate.approval_statement_matches_v0_6_33 = false;
    }),
    expectFailure(validRecord, "user_submission_overclaim_fails", (candidate) => {
      candidate.gate.approval_statement_source_is_user_submission = true;
    }),
    expectFailure(validRecord, "human_approval_overclaim_fails", (candidate) => {
      candidate.gate.human_approval_captured_now = true;
    }),
    expectFailure(validRecord, "registration_ready_overclaim_fails", (candidate) => {
      candidate.gate.accepted_samples_registration_ready_now = true;
    }),
    expectFailure(validRecord, "broad_allowed_files_fails", (candidate) => {
      candidate.future_allowed_files_after_approval.push("accepted_samples/");
    }),
    expectFailure(validRecord, "accepted_samples_write_flag_fails", (candidate) => {
      candidate.guard.accepted_samples_write_performed = true;
    }),
    expectFailure(validRecord, "image_copy_flag_fails", (candidate) => {
      candidate.guard.image_file_copy_performed = true;
    }),
    expectFailure(validRecord, "external_action_flag_fails", (candidate) => {
      candidate.guard.provider_contact_performed = true;
    }),
    expectFailure(validRecord, "runtime_claim_fails", (candidate) => {
      candidate.guard.vcp_runtime_integration_proven = true;
      candidate.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
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
  const report = readJson(files.report).exact_new_trial_003_selected_candidate_post_approval_gate_alignment;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_selected_candidate_post_approval_gate_alignment;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_selected_candidate_post_approval_gate_alignment;

  for (const token of [
    `phase: ${expected.phase}`,
    expected.candidateAttemptId,
    expected.sampleId,
    expected.category,
    "approval_statement_source_is_user_submission: false",
    "human_approval_captured_now: false",
    "accepted_samples_registration_ready_now: false",
    "post_approval_gate_alignment_only: true"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  for (const token of [
    "scripts/validate_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.js"
  ]) {
    assert(mvpText.includes(token), `validate_mvp missing token: ${token}`);
  }

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const summary = {
    phase: expected.phase,
    passed: true,
    selected_candidate_attempt_id: report.target.candidate_attempt_id,
    proposed_sample_id: report.target.proposed_sample_id,
    category: report.target.category,
    gate_status: report.gate.gate_status,
    human_approval_captured_now: report.gate.human_approval_captured_now,
    accepted_samples_registration_ready_now: report.gate.accepted_samples_registration_ready_now,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
