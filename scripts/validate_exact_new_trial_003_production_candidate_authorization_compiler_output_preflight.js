#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_39_EXACT_NEW_TRIAL_003_PRODUCTION_CANDIDATE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_production_candidate_authorization_compiler_output_preflight_fail.example.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  durableArchivePreflight: "reports/visual_asset_eval_dry_run/v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight",
  packageType: "production_candidate",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  productionCandidateId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001_production_candidate_001",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  blocker: "missing_accepted_sample_registration_archive_completion_and_production_candidate_authorization",
  blockerDecision: "blocked_missing_accepted_sample_registration_archive_completion_and_production_candidate_authorization",
  packageStatus: "draft_blocked_missing_accepted_sample_registration_archive_completion_and_production_candidate_authorization",
  recommendedNext: "prepare_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight_with_production_dependency_preserved"
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
  const allowedWritePaths = target.exact_allowed_write_paths || [];
  const forbiddenWritePaths = target.forbidden_write_paths || [];
  const required = input.required_before_execution || [];
  const validationRequired = input.validation_required_before_execution || [];
  const guard = input.guard || {};

  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const durableArchivePreflight = readJson(files.durableArchivePreflight).exact_new_trial_003_durable_archive_authorization_compiler_output_preflight;
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
    sourceRefs.durable_archive_preflight === files.durableArchivePreflight &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const packageOk =
    input.phase === expected.phase &&
    input.execution_mode === "production_candidate_authorization_compiler_output_preflight_only" &&
    input.package_type === expected.packageType &&
    input.package_status === expected.packageStatus &&
    input.blocker === expected.blocker &&
    input.production_candidate_authorized === false &&
    input.production_candidate_write_performed === false &&
    input.eligibility_preflight_present === false &&
    input.write_command_permission === false &&
    input.execution_allowed_now === false;

  const targetOk =
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.accepted_sample_registry_ref === files.registry &&
    target.accepted_sample_category_ref === files.categoryIndex &&
    target.durable_archive_preflight_ref === files.durableArchivePreflight &&
    target.expected_production_candidate_id === expected.productionCandidateId &&
    target.accepted_sample_registration_completed === false &&
    target.durable_archive_ready === false &&
    target.blocker_decision === expected.blockerDecision &&
    Array.isArray(allowedWritePaths) &&
    allowedWritePaths.length === 0 &&
    forbiddenWritePaths.includes("production/") &&
    forbiddenWritePaths.includes("runs/real_generation/") &&
    forbiddenWritePaths.includes("accepted_samples/") &&
    forbiddenWritePaths.includes("failure_samples/") &&
    forbiddenWritePaths.includes("asset_archive/") &&
    forbiddenWritePaths.includes("DailyNote") &&
    forbiddenWritePaths.includes("VCP memory") &&
    humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId &&
    humanReview.candidate_comparison.selected_candidate_output_image_sha256 === "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b" &&
    durableArchivePreflight.target.sample_id === expected.sampleId &&
    durableArchivePreflight.execution_allowed_now === false &&
    durableArchivePreflight.package_status === "draft_blocked_missing_accepted_sample_registration_and_archive_copy_authorization" &&
    ((!registryText.includes(expected.sampleId) && !categoryText.includes(expected.sampleId)) || targetSampleRegisteredNow);

  const requiredOk =
    required.includes("Jenn human approval must already be captured through the exact_new_trial_003 shot_2 approval chain") &&
    required.includes("exact accepted_samples registration for the selected shot_2 candidate must be completed first") &&
    required.includes("durable archive execution for the selected shot_2 accepted sample must be completed first") &&
    required.includes("Jenn exact A5 production_candidate authorization") &&
    required.includes("exact allowed production write paths") &&
    required.includes("rollback plan") &&
    required.includes("reviewer") &&
    required.includes("stop conditions") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.js") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.preflight_only === true &&
    guard.production_candidate_write_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
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
    expectFailure(validRecord, "production_candidate_authorization_overclaim_fails", (candidate) => {
      candidate.production_candidate_authorized = true;
      candidate.write_command_permission = true;
      candidate.execution_allowed_now = true;
    }),
    expectFailure(validRecord, "broad_allowed_write_path_fails", (candidate) => {
      candidate.target.exact_allowed_write_paths.push("production/");
    }),
    expectFailure(validRecord, "production_candidate_write_flag_fails", (candidate) => {
      candidate.guard.production_candidate_write_performed = true;
      candidate.production_candidate_write_performed = true;
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
  const report = readJson(files.report).exact_new_trial_003_production_candidate_authorization_compiler_output_preflight;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_production_candidate_authorization_compiler_output_preflight;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_production_candidate_authorization_compiler_output_preflight;

  for (const token of [
    `phase: ${expected.phase}`,
    "package_type: production_candidate",
    `package_status: ${expected.packageStatus}`,
    `blocker: ${expected.blocker}`,
    "production_candidate_authorized: false",
    "production_candidate_write_performed: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.js"), "validate_mvp missing new validator");

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
    production_candidate_authorized: report.production_candidate_authorized,
    production_candidate_write_performed: report.production_candidate_write_performed,
    eligibility_preflight_present: report.eligibility_preflight_present,
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
