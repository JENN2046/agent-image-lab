#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const key = "exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight";

const files = {
  phaseRecord: "docs/V0_6_58_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_AUTHORIZATION_PACKAGE_AFTER_METADATA_PREFLIGHT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight_fail.example.json",
  metadataPreflight: "reports/visual_asset_eval_dry_run/v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.json",
  approvalEvidence: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight",
  packageType: "durable_archive_write_authorization",
  packageStatus: "authorization_package_ready_execution_not_performed",
  authorizationModel: "smart_standing_authorization_v3_default_real_class_allowed",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  sourceArtifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  width: 941,
  height: 1672,
  mime: "image/png",
  archiveRoot: "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  recommendedNext: "run_exact_new_trial_003_durable_archive_write_execution_preflight_no_write"
};

expected.allowedWritePaths = [
  `${expected.archiveRoot}/manifest.json`,
  `${expected.archiveRoot}/original.png`,
  `${expected.archiveRoot}/preview.webp`
];

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

function assertFutureTargetsAbsent(record) {
  for (const relativePath of record.target.exact_allowed_write_paths || []) {
    assert(!exists(relativePath), `Archive target already exists without overwrite authorization: ${relativePath}`);
  }
}

function evaluate(record) {
  const sourceRefs = record.source_refs || {};
  const target = record.target || {};
  const budget = record.budget || {};
  const guard = record.guard || {};
  const validationRequired = record.validation_required_for_future_execution || [];
  const rollback = record.rollback_or_cleanup_plan || [];
  const stopConditions = record.stop_conditions || [];
  const allowedPaths = target.exact_allowed_write_paths || [];

  const metadata = readJson(files.metadataPreflight).exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration;
  const approval = readJson(files.approvalEvidence).user_submitted_formal_human_approval_evidence;
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);

  const sourceRefsOk =
    sourceRefs.metadata_preflight === files.metadataPreflight &&
    sourceRefs.approval_evidence === files.approvalEvidence &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const upstreamOk =
    metadata.archive_metadata_preflight_compiled === true &&
    metadata.archive_write_performed === false &&
    metadata.image_binary_read_performed === false &&
    metadata.image_file_copy_performed === false &&
    metadata.target?.accepted_sample_registration_completed === true &&
    metadata.target?.sample_id === expected.sampleId &&
    metadata.target?.candidate_id === expected.candidateId &&
    metadata.target?.source_artifact_hash_ref === expected.sha256 &&
    Array.isArray(metadata.target?.exact_future_write_paths) &&
    metadata.target.exact_future_write_paths.length === expected.allowedWritePaths.length &&
    expected.allowedWritePaths.every((item) => metadata.target.exact_future_write_paths.includes(item)) &&
    approval.current_capture_state?.formal_human_approval_captured_now === true &&
    approval.target?.sample_id === expected.sampleId &&
    approval.target?.candidate_id === expected.candidateId &&
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    categoryText.includes(`  - ${expected.sampleId}`);

  const packageOk =
    record.phase === expected.phase &&
    record.execution_mode === "durable_archive_write_authorization_package_only" &&
    record.package_type === expected.packageType &&
    record.package_status === expected.packageStatus &&
    record.authorization_model === expected.authorizationModel &&
    record.archive_write_authorization_package_prepared === true &&
    record.archive_write_authorized_next === true &&
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
    target.archive_metadata_preflight_compiled === true &&
    target.overwrite_existing_files_allowed === false &&
    Array.isArray(allowedPaths) &&
    allowedPaths.length === expected.allowedWritePaths.length &&
    expected.allowedWritePaths.every((item) => allowedPaths.includes(item));

  const budgetOk =
    budget.max_write_files === 3 &&
    budget.max_image_binary_reads === 1 &&
    budget.max_runtime_probe_minutes === 10 &&
    budget.overwrite_existing_files_allowed === false &&
    budget.secret_value_read_allowed === false;

  const validationOk =
    validationRequired.includes("target archive paths must be absent before write") &&
    validationRequired.includes(`source image sha256 must equal ${expected.sha256}`) &&
    validationRequired.includes("manifest must bind sample id, candidate id, approval evidence, source hash, source dimensions, and generated archive file refs") &&
    validationRequired.includes("archive validator must pass after write") &&
    validationRequired.includes("git diff --check must pass") &&
    validationRequired.includes("npm run validate:mvp must pass");

  const rollbackOk =
    rollback.includes(`remove only the exact new ${expected.archiveRoot}/ directory if future execution fails before validation`) &&
    rollback.includes("do not remove or modify accepted_samples registry entries") &&
    rollback.includes("do not modify runs/real_generation source artifacts");

  const stopOk =
    stopConditions.includes("any target archive path already exists") &&
    stopConditions.includes("source hash mismatch") &&
    stopConditions.includes("preview generation requires new dependency or broad runtime change") &&
    stopConditions.includes("more than three archive files would be written") &&
    stopConditions.includes("secret/private path exposure") &&
    stopConditions.includes("production candidate, DailyNote, or VCP memory scope expansion");

  const noWrites =
    guard.authorization_package_only === true &&
    guard.archive_write_performed === false &&
    guard.durable_archive_manifest_write_performed === false &&
    guard.durable_archive_copy_performed === false &&
    guard.image_binary_read_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.preview_generation_performed === false &&
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
    passed: sourceRefsOk && upstreamOk && packageOk && targetOk && budgetOk && validationOk && rollbackOk && stopOk && noWrites && noExternal && noRuntimeClaim,
    sourceRefsOk,
    upstreamOk,
    packageOk,
    targetOk,
    budgetOk,
    validationOk,
    rollbackOk,
    stopOk,
    noWrites,
    noExternal,
    noRuntimeClaim
  };
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.recommended_next === expected.recommendedNext, `${context}.recommended_next mismatch`);
  assertFutureTargetsAbsent(record);
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
    expectFailure(validRecord, "missing_metadata_preflight_fails", (candidate) => {
      candidate.target.archive_metadata_preflight_compiled = false;
    }),
    expectFailure(validRecord, "execution_now_overclaim_fails", (candidate) => {
      candidate.execution_allowed_now = true;
    }),
    expectFailure(validRecord, "archive_write_performed_fails", (candidate) => {
      candidate.guard.archive_write_performed = true;
    }),
    expectFailure(validRecord, "image_binary_read_or_copy_fails", (candidate) => {
      candidate.guard.image_binary_read_performed = true;
      candidate.guard.image_file_copy_performed = true;
    }),
    expectFailure(validRecord, "broad_allowed_write_path_fails", (candidate) => {
      candidate.target.exact_allowed_write_paths.push("asset_archive/accepted_samples/");
    }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => {
      candidate.target.overwrite_existing_files_allowed = true;
      candidate.budget.overwrite_existing_files_allowed = true;
    }),
    expectFailure(validRecord, "budget_expansion_fails", (candidate) => {
      candidate.budget.max_write_files = 4;
    }),
    expectFailure(validRecord, "rollback_missing_fails", (candidate) => {
      candidate.rollback_or_cleanup_plan = [];
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
    "package_type: durable_archive_write_authorization",
    "package_status: authorization_package_ready_execution_not_performed",
    "authorization_model: smart_standing_authorization_v3_default_real_class_allowed",
    "archive_write_authorization_package_prepared: true",
    "archive_write_authorized_next: true",
    "execution_allowed_now: false",
    "archive_write_performed: false",
    "image_binary_read_performed: false",
    "image_file_copy_performed: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.js"),
    "validate_mvp missing v0.6.58 validator"
  );

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const summary = {
    phase: expected.phase,
    passed: true,
    package_type: report.package_type,
    package_status: report.package_status,
    authorization_model: report.authorization_model,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    accepted_sample_registration_completed: report.target.accepted_sample_registration_completed,
    archive_metadata_preflight_compiled: report.target.archive_metadata_preflight_compiled,
    archive_write_authorization_package_prepared: report.archive_write_authorization_package_prepared,
    archive_write_authorized_next: report.archive_write_authorized_next,
    execution_allowed_now: report.execution_allowed_now,
    archive_write_performed: report.guard.archive_write_performed,
    image_binary_read_performed: report.guard.image_binary_read_performed,
    image_file_copy_performed: report.guard.image_file_copy_performed,
    future_write_path_count: report.target.exact_allowed_write_paths.length,
    max_write_files: report.budget.max_write_files,
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
