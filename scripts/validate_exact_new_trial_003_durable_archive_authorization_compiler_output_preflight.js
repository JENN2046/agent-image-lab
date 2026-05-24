#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_38_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_AUTHORIZATION_COMPILER_OUTPUT_PREFLIGHT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_authorization_compiler_output_preflight_fail.example.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  acceptedSamplesExecutionPreflight: "reports/visual_asset_eval_dry_run/v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight",
  packageType: "durable_archive",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  blocker: "missing_accepted_sample_registration_and_archive_copy_authorization",
  blockerDecision: "blocked_missing_accepted_sample_registration_and_archive_copy_authorization",
  packageStatus: "draft_blocked_missing_accepted_sample_registration_and_archive_copy_authorization",
  recommendedNext: "prepare_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight_with_archive_dependency_preserved"
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
  const acceptedSamplesExecutionPreflight = readJson(files.acceptedSamplesExecutionPreflight).exact_new_trial_003_accepted_samples_registration_execution_preflight;
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
    sourceRefs.accepted_samples_execution_preflight === files.acceptedSamplesExecutionPreflight &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const packageOk =
    input.phase === expected.phase &&
    input.execution_mode === "durable_archive_authorization_compiler_output_preflight_only" &&
    input.package_type === expected.packageType &&
    input.package_status === expected.packageStatus &&
    input.blocker === expected.blocker &&
    input.archive_copy_authorized === false &&
    input.archive_copy_performed === false &&
    input.target_archive_path_provided === false &&
    input.write_command_permission === false &&
    input.execution_allowed_now === false;

  const targetOk =
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.source_artifact_ref === expected.artifactRef &&
    target.source_artifact_hash_ref === expected.sha256 &&
    target.accepted_sample_registry_ref === files.registry &&
    target.accepted_sample_category_ref === files.categoryIndex &&
    target.accepted_sample_registration_completed === false &&
    target.blocker_decision === expected.blockerDecision &&
    target.target_archive_path === null &&
    target.hash_verification_required === true &&
    Array.isArray(allowedWritePaths) &&
    allowedWritePaths.length === 0 &&
    forbiddenWritePaths.includes("runs/real_generation/") &&
    forbiddenWritePaths.includes("accepted_samples/") &&
    forbiddenWritePaths.includes("failure_samples/") &&
    forbiddenWritePaths.includes("production_candidate/") &&
    forbiddenWritePaths.includes("DailyNote") &&
    forbiddenWritePaths.includes("VCP memory") &&
    humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId &&
    humanReview.candidate_comparison.selected_candidate_output_image_sha256 === expected.sha256 &&
    acceptedSamplesExecutionPreflight.target.sample_id === expected.sampleId &&
    acceptedSamplesExecutionPreflight.target.execution_allowed_now === false &&
    acceptedSamplesExecutionPreflight.preflight_status === "blocked" &&
    ((!registryText.includes(expected.sampleId) && !categoryText.includes(expected.sampleId)) || targetSampleRegisteredNow);

  const requiredOk =
    required.includes("Jenn human approval must already be captured through the exact_new_trial_003 shot_2 approval chain") &&
    required.includes("exact accepted_samples registration for the selected shot_2 candidate must be completed first") &&
    required.includes("Jenn exact A5 durable archive copy authorization") &&
    required.includes("exact target archive path") &&
    required.includes("hash verification requirement") &&
    required.includes("rollback plan") &&
    required.includes("reviewer") &&
    required.includes("stop conditions") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.js") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_accepted_samples_registration_execution_preflight.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.preflight_only === true &&
    guard.durable_archive_copy_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
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
      candidate.target.blocker_decision = null;
    }),
    expectFailure(validRecord, "archive_copy_authorization_overclaim_fails", (candidate) => {
      candidate.archive_copy_authorized = true;
      candidate.write_command_permission = true;
      candidate.execution_allowed_now = true;
    }),
    expectFailure(validRecord, "target_archive_path_filled_fails", (candidate) => {
      candidate.target.target_archive_path = "asset_archive/accepted/fashion_lookbook_portrait/example.png";
      candidate.target_archive_path_provided = true;
    }),
    expectFailure(validRecord, "broad_allowed_write_path_fails", (candidate) => {
      candidate.target.exact_allowed_write_paths.push("asset_archive/accepted/");
    }),
    expectFailure(validRecord, "durable_archive_copy_flag_fails", (candidate) => {
      candidate.guard.durable_archive_copy_performed = true;
      candidate.archive_copy_performed = true;
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
  const report = readJson(files.report).exact_new_trial_003_durable_archive_authorization_compiler_output_preflight;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_durable_archive_authorization_compiler_output_preflight;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_durable_archive_authorization_compiler_output_preflight;

  for (const token of [
    `phase: ${expected.phase}`,
    "package_type: durable_archive",
    `package_status: ${expected.packageStatus}`,
    `blocker: ${expected.blocker}`,
    "archive_copy_authorized: false",
    "target_archive_path_provided: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.js"), "validate_mvp missing new validator");

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
    archive_copy_authorized: report.archive_copy_authorized,
    archive_copy_performed: report.archive_copy_performed,
    target_archive_path_provided: report.target_archive_path_provided,
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
