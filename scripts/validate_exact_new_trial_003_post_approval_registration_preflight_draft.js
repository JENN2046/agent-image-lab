#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { sourceArtifactHashEvidence } = require("./lib/exact_new_trial_legacy_artifacts");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_35_EXACT_NEW_TRIAL_003_POST_APPROVAL_REGISTRATION_PREFLIGHT_DRAFT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_35_exact_new_trial_003_post_approval_registration_preflight_draft.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_post_approval_registration_preflight_draft.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_post_approval_registration_preflight_draft_fail.example.json",
  selectedCloseout: "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  approvalIntakePackage: "reports/visual_asset_eval_dry_run/v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package.json",
  postApprovalGateAlignment: "reports/visual_asset_eval_dry_run/v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_35_exact_new_trial_003_post_approval_registration_preflight_draft",
  attemptId: "v0_3_3_exact_new_trial_003_shot_2",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  promptPackageRef: "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  recommendedNext: "wait_for_jenn_human_approval_then_upgrade_v0_6_35_draft_to_executable_exact_new_trial_003_post_approval_registration_preflight"
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
  const source = input.source || {};
  const registration = input.proposed_registration || {};
  const eligibility = input.eligibility || {};
  const guard = input.guard || {};

  const closeout = readJson(files.selectedCloseout).exact_new_trial_003_shot_2_execution_closeout;
  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const approvalIntake = readJson(files.approvalIntakePackage).exact_new_trial_003_selected_candidate_human_approval_intake_package;
  const gateAlignment = readJson(files.postApprovalGateAlignment).exact_new_trial_003_selected_candidate_post_approval_gate_alignment;
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);
  const targetSampleRegisteredNow =
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    registryText.includes("source_phase: v0_6_56") &&
    categoryText.includes(`  - ${expected.sampleId}`) &&
    categoryText.includes(`  ${expected.sampleId}:`);

  assert(closeout.attempt_id === expected.attemptId, "source closeout attempt mismatch");
  assert(closeout.output_image_sha256 === expected.sha256, "source closeout sha mismatch");
  assert(closeout.output_image_path === expected.artifactRef, "source closeout artifact path mismatch");
  assert(humanReview.candidate_comparison.selected_candidate_attempt_id === expected.attemptId, "source human review selected candidate mismatch");
  assert(humanReview.candidate_comparison.selected_candidate_output_image_sha256 === expected.sha256, "source human review sha mismatch");
  assert(approvalIntake.target.proposed_sample_id === expected.sampleId, "source approval intake sample id mismatch");
  assert(gateAlignment.target.proposed_sample_id === expected.sampleId, "source post-approval gate sample id mismatch");
  assert(sourceArtifactHashEvidence(expected.artifactRef, expected.sha256).passed, "source artifact hash evidence mismatch");
  assert(categoryText.includes("category: fashion_lookbook_portrait"), "category index target missing");

  const sourceRefsOk =
    sourceRefs.selected_candidate_closeout === files.selectedCloseout &&
    sourceRefs.human_review === files.humanReview &&
    sourceRefs.approval_intake_package === files.approvalIntakePackage &&
    sourceRefs.post_approval_gate_alignment === files.postApprovalGateAlignment &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const sourceOk =
    source.candidate_attempt_id === expected.attemptId &&
    source.closeout_phase === "v0_6_29_exact_new_trial_003_shot_2_execution_closeout" &&
    source.prompt_package_ref === expected.promptPackageRef &&
    source.artifact_ref === expected.artifactRef &&
    source.artifact_sha256 === expected.sha256 &&
    source.artifact_dimensions === expected.dimensions &&
    source.artifact_mime === expected.mime &&
    source.review_status === "accepted_candidate_with_minor_watch_items" &&
    source.human_approval_status === "pending" &&
    source.approved_by === null &&
    source.approval_statement_source_is_user_submission === false &&
    source.commercial_delivery_ready === false;

  const registrationOk =
    registration.sample_id === expected.sampleId &&
    registration.registry_ref === files.registry &&
    registration.category_index_ref === files.categoryIndex &&
    registration.category === expected.category &&
    Array.isArray(registration.style_tags) &&
    registration.style_tags.length === 6 &&
    registration.recoverability_status === "workspace_local_verified" &&
    registration.artifact_locator_scope === "project_relative_runs" &&
    registration.verification_mode === "local_file_hash" &&
    registration.verified_sha256 === expected.sha256 &&
    registration.verified_dimensions === expected.dimensions &&
    registration.verified_mime === expected.mime &&
    registration.verification_record_ref === files.phaseRecord &&
    registration.portable_after_clone === false &&
    registration.image_files_committed_to_git === false &&
    registration.artifact_recoverability_is_not_vcp_runtime_integration === true;

  const eligibilityOk =
    eligibility.artifact_exists === true &&
    eligibility.hash_verified === true &&
    eligibility.dimensions_verified === true &&
    eligibility.mime_verified === true &&
    eligibility.selected_candidate_closeout_present === true &&
    eligibility.human_review_present === true &&
    eligibility.approval_intake_package_present === true &&
    eligibility.post_approval_gate_alignment_present === true &&
    eligibility.human_approval_present === false &&
    eligibility.approval_statement_user_submitted === false &&
    eligibility.category_index_target_present === true &&
    eligibility.registry_duplicate_absent === true &&
    eligibility.category_duplicate_absent === true &&
    ((!registryText.includes(expected.sampleId) && !categoryText.includes(expected.sampleId)) || targetSampleRegisteredNow) &&
    eligibility.accepted_samples_registration_eligible === false &&
    eligibility.registration_blocker === "human_approval_missing";

  const noWrites =
    guard.accepted_samples_metadata_registration_preflight_draft_only === true &&
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
    passed: sourceRefsOk && sourceOk && registrationOk && eligibilityOk && noWrites && noExternal && noRuntimeClaim,
    sourceRefsOk,
    sourceOk,
    registrationOk,
    eligibilityOk,
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
    expectFailure(validRecord, "missing_artifact_fails", (candidate) => {
      candidate.source.artifact_ref = "runs/real_generation/missing.png";
    }),
    expectFailure(validRecord, "hash_mismatch_fails", (candidate) => {
      candidate.source.artifact_sha256 = "deadbeef";
    }),
    expectFailure(validRecord, "dimensions_mismatch_fails", (candidate) => {
      candidate.source.artifact_dimensions = "1024x1024";
    }),
    expectFailure(validRecord, "mime_mismatch_fails", (candidate) => {
      candidate.source.artifact_mime = "image/jpeg";
    }),
    expectFailure(validRecord, "selected_candidate_mismatch_fails", (candidate) => {
      candidate.source.candidate_attempt_id = "v0_3_3_exact_new_trial_003_shot_3";
    }),
    expectFailure(validRecord, "human_approval_overclaim_fails", (candidate) => {
      candidate.eligibility.human_approval_present = true;
      candidate.source.human_approval_status = "approved";
    }),
    expectFailure(validRecord, "registration_eligible_overclaim_fails", (candidate) => {
      candidate.eligibility.accepted_samples_registration_eligible = true;
      candidate.eligibility.registration_blocker = null;
    }),
    expectFailure(validRecord, "registry_duplicate_blocks_preflight", (candidate) => {
      candidate.eligibility.registry_duplicate_absent = false;
    }),
    expectFailure(validRecord, "accepted_samples_write_flag_blocks_preflight", (candidate) => {
      candidate.guard.accepted_samples_write_performed = true;
    }),
    expectFailure(validRecord, "runtime_claim_blocks_preflight", (candidate) => {
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
  const report = readJson(files.report).exact_new_trial_003_post_approval_registration_preflight_draft;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_post_approval_registration_preflight_draft;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_post_approval_registration_preflight_draft;

  for (const token of [
    `phase: ${expected.phase}`,
    expected.attemptId,
    expected.sampleId,
    expected.category,
    "human_approval_status: pending",
    "accepted_samples_registration_eligible: false",
    "accepted_samples_metadata_registration_preflight_draft_only: true"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_post_approval_registration_preflight_draft.js"), "validate_mvp missing new validator");

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const summary = {
    phase: expected.phase,
    passed: true,
    selected_candidate_attempt_id: report.source.candidate_attempt_id,
    proposed_sample_id: report.proposed_registration.sample_id,
    category: report.proposed_registration.category,
    registration_blocker: report.eligibility.registration_blocker,
    human_approval_present: report.eligibility.human_approval_present,
    accepted_samples_registration_eligible: report.eligibility.accepted_samples_registration_eligible,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main();
