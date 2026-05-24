#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const key = "exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration";

const files = {
  phaseRecord: "docs/V0_6_57_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_METADATA_PREFLIGHT_AFTER_ACCEPTED_SAMPLE_REGISTRATION.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration_fail.example.json",
  approvalEvidence: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  acceptedRegistrationReport: "reports/visual_asset_eval_dry_run/v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration",
  packageType: "durable_archive_metadata_preflight",
  packageStatus: "metadata_preflight_ready_archive_write_not_authorized",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  sourceArtifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  width: 941,
  height: 1672,
  mime: "image/png",
  archiveRoot: "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  recommendedNext: "prepare_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight"
};

expected.manifestPath = `${expected.archiveRoot}/manifest.json`;
expected.originalPath = `${expected.archiveRoot}/original.png`;
expected.previewPath = `${expected.archiveRoot}/preview.webp`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
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
    Object.entries(value).forEach(([field, item]) => assertNoRawLocalDrivePath(item, `${context}.${field}`));
  }
}

function assertTargetArchivePathsDoNotExist(record) {
  for (const relativePath of record.target.exact_future_write_paths || []) {
    assert(!exists(relativePath), `Future archive path already exists without overwrite authorization: ${relativePath}`);
  }
}

function evaluate(record) {
  const sourceRefs = record.source_refs || {};
  const target = record.target || {};
  const guard = record.guard || {};
  const required = record.required_before_archive_write || [];
  const futurePaths = target.exact_future_write_paths || [];

  const approval = readJson(files.approvalEvidence).user_submitted_formal_human_approval_evidence;
  const registration = readJson(files.acceptedRegistrationReport).exact_new_trial_003_accepted_samples_metadata_registration;
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);

  const sourceRefsOk =
    sourceRefs.approval_evidence === files.approvalEvidence &&
    sourceRefs.accepted_samples_metadata_registration_report === files.acceptedRegistrationReport &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const upstreamRegistrationOk =
    approval.submitted_by === "Jenn" &&
    approval.current_capture_state?.formal_human_approval_captured_now === true &&
    approval.target?.candidate_id === expected.candidateId &&
    approval.target?.sample_id === expected.sampleId &&
    approval.target?.artifact_sha256 === expected.sha256 &&
    registration.registration_result?.accepted_samples_metadata_registered === true &&
    registration.target?.candidate_id === expected.candidateId &&
    registration.target?.sample_id === expected.sampleId &&
    registration.target?.artifact_sha256 === expected.sha256 &&
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    registryText.includes("source_phase: v0_6_56") &&
    categoryText.includes(`  - ${expected.sampleId}`) &&
    categoryText.includes(`  ${expected.sampleId}:`);

  const packageOk =
    record.phase === expected.phase &&
    record.execution_mode === "durable_archive_metadata_preflight_only" &&
    record.package_type === expected.packageType &&
    record.package_status === expected.packageStatus &&
    record.archive_metadata_preflight_compiled === true &&
    record.archive_write_authorized === false &&
    record.archive_write_performed === false &&
    record.image_binary_read_performed === false &&
    record.image_file_copy_performed === false &&
    record.execution_allowed_now === false;

  const targetOk =
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.source_artifact_ref === expected.sourceArtifactRef &&
    target.source_artifact_hash_ref === expected.sha256 &&
    target.source_dimensions?.width === expected.width &&
    target.source_dimensions?.height === expected.height &&
    target.verified_mime === expected.mime &&
    target.accepted_sample_registration_completed === true &&
    target.target_archive_manifest_path === expected.manifestPath &&
    target.target_archive_original_path === expected.originalPath &&
    target.target_archive_preview_path === expected.previewPath &&
    target.overwrite_existing_files_allowed === false &&
    Array.isArray(futurePaths) &&
    futurePaths.length === 3 &&
    futurePaths.includes(expected.manifestPath) &&
    futurePaths.includes(expected.originalPath) &&
    futurePaths.includes(expected.previewPath);

  const requiredOk =
    required.includes("exact durable archive write authorization") &&
    required.includes("target archive paths must not already exist unless overwrite is explicitly authorized") &&
    required.includes("hash verification must be run against the source artifact during the archive write gate") &&
    required.includes("rollback cleanup plan for the exact target archive directory") &&
    required.includes("post-write manifest validation") &&
    required.includes("human approval boundary must remain linked to Jenn approval evidence");

  const noWrites =
    guard.preflight_only === true &&
    guard.durable_archive_manifest_write_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.image_binary_read_performed === false &&
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
    guard.push_tag_release_deploy_performed === false &&
    guard.secret_value_read_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: sourceRefsOk && upstreamRegistrationOk && packageOk && targetOk && requiredOk && noWrites && noExternal && noRuntimeClaim,
    sourceRefsOk,
    upstreamRegistrationOk,
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
  assert(record.recommended_next === expected.recommendedNext, `${context}.recommended_next mismatch`);
  assertTargetArchivePathsDoNotExist(record);
  const result = evaluate(record);
  assert(result.passed, `${context} evaluation failed: ${JSON.stringify(result)}`);
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
    expectFailure(validRecord, "missing_accepted_sample_registration_fails", (candidate) => {
      candidate.target.accepted_sample_registration_completed = false;
    }),
    expectFailure(validRecord, "archive_write_authorization_overclaim_fails", (candidate) => {
      candidate.archive_write_authorized = true;
      candidate.execution_allowed_now = true;
    }),
    expectFailure(validRecord, "archive_write_performed_fails", (candidate) => {
      candidate.archive_write_performed = true;
      candidate.guard.durable_archive_manifest_write_performed = true;
    }),
    expectFailure(validRecord, "image_binary_read_or_copy_fails", (candidate) => {
      candidate.image_binary_read_performed = true;
      candidate.image_file_copy_performed = true;
      candidate.guard.image_binary_read_performed = true;
      candidate.guard.image_file_copy_performed = true;
    }),
    expectFailure(validRecord, "broad_future_write_path_fails", (candidate) => {
      candidate.target.exact_future_write_paths.push("asset_archive/accepted_samples/");
    }),
    expectFailure(validRecord, "overwrite_without_explicit_authorization_fails", (candidate) => {
      candidate.target.overwrite_existing_files_allowed = true;
    }),
    expectFailure(validRecord, "wrong_hash_fails", (candidate) => {
      candidate.target.source_artifact_hash_ref = "bad";
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
  const report = readJson(files.report)[key];
  const passFixture = readJson(files.passFixture)[key];
  const failFixture = readJson(files.failFixture)[key];

  for (const token of [
    `phase: ${expected.phase}`,
    "package_type: durable_archive_metadata_preflight",
    "package_status: metadata_preflight_ready_archive_write_not_authorized",
    "accepted_sample_registration_completed: true",
    "archive_metadata_preflight_compiled: true",
    "archive_write_performed: false",
    "image_binary_read_performed: false",
    "image_file_copy_performed: false",
    "execution_allowed_now: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.js"),
    "validate_mvp missing v0.6.57 validator"
  );

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const summary = {
    phase: expected.phase,
    passed: true,
    package_type: report.package_type,
    package_status: report.package_status,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    accepted_sample_registration_completed: report.target.accepted_sample_registration_completed,
    archive_metadata_preflight_compiled: report.archive_metadata_preflight_compiled,
    archive_write_authorized: report.archive_write_authorized,
    archive_write_performed: report.archive_write_performed,
    image_binary_read_performed: report.image_binary_read_performed,
    image_file_copy_performed: report.image_file_copy_performed,
    execution_allowed_now: report.execution_allowed_now,
    future_write_path_count: report.target.exact_future_write_paths.length,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught,
    recommended_next: report.recommended_next
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
