#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_37_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_EXECUTION_PREFLIGHT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_accepted_samples_registration_execution_preflight.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_accepted_samples_registration_execution_preflight_fail.example.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  gateAlignment: "reports/visual_asset_eval_dry_run/v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.json",
  registrationPreflightDraft: "reports/visual_asset_eval_dry_run/v0_6_35_exact_new_trial_003_post_approval_registration_preflight_draft.json",
  authorizationPackageDraft: "reports/visual_asset_eval_dry_run/v0_6_36_exact_new_trial_003_accepted_samples_registration_authorization_package_draft.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  blocker: "missing_human_approval_and_authorization_grant",
  recommendedNext: "prepare_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight_with_accepted_sample_dependency_preserved"
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
  const allowedFiles = input.allowed_files_after_approval || [];
  const forbiddenPaths = input.forbidden_write_paths || [];
  const required = input.required_before_execution || [];
  const validationRequired = input.validation_required_before_execution || [];
  const guard = input.guard || {};

  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const gateAlignment = readJson(files.gateAlignment).exact_new_trial_003_selected_candidate_post_approval_gate_alignment;
  const registrationPreflightDraft = readJson(files.registrationPreflightDraft).exact_new_trial_003_post_approval_registration_preflight_draft;
  const authorizationPackageDraft = readJson(files.authorizationPackageDraft).exact_new_trial_003_accepted_samples_registration_authorization_package_draft;
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);
  const targetSampleRegisteredNow =
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    registryText.includes("source_phase: v0_6_56") &&
    categoryText.includes(`  - ${expected.sampleId}`) &&
    categoryText.includes(`  ${expected.sampleId}:`);

  const sourceRefsOk =
    sourceRefs.human_review === files.humanReview &&
    sourceRefs.post_approval_gate_alignment === files.gateAlignment &&
    sourceRefs.registration_preflight_draft === files.registrationPreflightDraft &&
    sourceRefs.authorization_package_draft === files.authorizationPackageDraft &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const targetOk =
    input.phase === expected.phase &&
    input.execution_mode === "accepted_samples_registration_execution_preflight_only" &&
    input.preflight_status === "blocked" &&
    input.blocker === expected.blocker &&
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.verified_sha256 === expected.sha256 &&
    target.verified_dimensions === expected.dimensions &&
    target.verified_mime === expected.mime &&
    target.human_approval_status === "pending" &&
    target.approved_by === null &&
    target.authorization_package_status === "prepared_blocked_not_granted" &&
    target.authorization_granted_by_this_record === false &&
    target.registration_preflight_draft_ready === true &&
    target.registry_duplicate_absent === true &&
    target.category_duplicate_absent === true &&
    ((!registryText.includes(expected.sampleId) && !categoryText.includes(expected.sampleId)) || targetSampleRegisteredNow) &&
    target.execution_allowed_now === false &&
    humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId &&
    humanReview.candidate_comparison.selected_candidate_output_image_sha256 === expected.sha256 &&
    gateAlignment.target.proposed_sample_id === expected.sampleId &&
    registrationPreflightDraft.proposed_registration.sample_id === expected.sampleId &&
    registrationPreflightDraft.eligibility.accepted_samples_registration_eligible === false &&
    authorizationPackageDraft.target.sample_id === expected.sampleId &&
    authorizationPackageDraft.authorization_package_status === "prepared_blocked_not_granted" &&
    authorizationPackageDraft.authorization_granted_by_this_record === false;

  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/fashion_lookbook_portrait.yaml") &&
    forbiddenPaths.includes("runs/real_generation/") &&
    forbiddenPaths.includes("failure_samples/") &&
    forbiddenPaths.includes("production_candidate/") &&
    forbiddenPaths.includes("DailyNote") &&
    forbiddenPaths.includes("VCP memory");

  const requiredOk =
    required.includes("Jenn human approval for the selected exact_new_trial_003 shot_2 candidate") &&
    required.includes("exact accepted_samples metadata write authorization must be granted from the frozen v0.6.36 package wording") &&
    required.includes("v0.6.35 registration preflight draft must still match artifact, review, and gate evidence") &&
    required.includes("validators must pass before and after the metadata write") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_accepted_samples_registration_execution_preflight.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.preflight_only === true &&
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
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: sourceRefsOk && targetOk && scopeOk && requiredOk && noWrites && noExternal && noRuntimeClaim,
    sourceRefsOk,
    targetOk,
    scopeOk,
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
    expectFailure(validRecord, "human_approval_overclaim_fails", (candidate) => {
      candidate.target.human_approval_status = "approved";
      candidate.target.approved_by = "Jenn";
      candidate.target.execution_allowed_now = true;
      candidate.preflight_status = "ready";
    }),
    expectFailure(validRecord, "authorization_granted_overclaim_fails", (candidate) => {
      candidate.target.authorization_package_status = "granted";
      candidate.target.authorization_granted_by_this_record = true;
      candidate.preflight_status = "ready";
    }),
    expectFailure(validRecord, "registration_preflight_not_ready_fails", (candidate) => {
      candidate.target.registration_preflight_draft_ready = false;
    }),
    expectFailure(validRecord, "broad_allowed_files_fails", (candidate) => {
      candidate.allowed_files_after_approval.push("accepted_samples/");
    }),
    expectFailure(validRecord, "accepted_samples_write_flag_fails", (candidate) => {
      candidate.guard.accepted_samples_write_performed = true;
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
  const report = readJson(files.report).exact_new_trial_003_accepted_samples_registration_execution_preflight;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_accepted_samples_registration_execution_preflight;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_accepted_samples_registration_execution_preflight;

  for (const token of [
    `phase: ${expected.phase}`,
    expected.sampleId,
    expected.candidateId,
    "preflight_status: blocked",
    "blocker: missing_human_approval_and_authorization_grant",
    "execution_allowed_now: false",
    "preflight_only: true"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_accepted_samples_registration_execution_preflight.js"), "validate_mvp missing new validator");

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
    human_approval_status: report.target.human_approval_status,
    authorization_package_status: report.target.authorization_package_status,
    authorization_granted_by_this_record: report.target.authorization_granted_by_this_record,
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
