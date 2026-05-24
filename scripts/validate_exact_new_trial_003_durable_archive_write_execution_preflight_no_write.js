#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const key = "exact_new_trial_003_durable_archive_write_execution_preflight_no_write";

const files = {
  phaseRecord: "docs/V0_6_59_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_PREFLIGHT_NO_WRITE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_59_exact_new_trial_003_durable_archive_write_execution_preflight_no_write.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_preflight_no_write.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_preflight_no_write_fail.example.json",
  authorizationPackage: "reports/visual_asset_eval_dry_run/v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.json",
  metadataPreflight: "reports/visual_asset_eval_dry_run/v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration.json",
  approvalEvidence: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  postWriteReceipt: "reports/visual_asset_eval_dry_run/v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_59_exact_new_trial_003_durable_archive_write_execution_preflight_no_write",
  packageType: "durable_archive_write_execution_preflight_no_write",
  packageStatus: "execution_preflight_passed_archive_write_ready_not_performed",
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
  recommendedNext: "execute_exact_new_trial_003_durable_archive_write_exact_three_files_with_hash_verification"
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

function assertArchiveTargetsActuallyAbsent(record, context) {
  if (exactArchiveWriteCompleted(record.target?.exact_allowed_write_paths || [])) return;
  assert(!exists(record.target.target_archive_root), `${context}: archive root already exists`);
  for (const relativePath of record.target.exact_allowed_write_paths || []) {
    assert(!exists(relativePath), `${context}: archive target already exists: ${relativePath}`);
  }
}

function exactArchiveWriteCompleted(candidatePaths) {
  if (!exists(files.postWriteReceipt)) return false;
  const receipt = readJson(files.postWriteReceipt).exact_new_trial_003_durable_archive_write_execution_receipt;
  const written = receipt?.receipt?.files_written || [];
  return (
    receipt?.phase === "v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt" &&
    receipt?.package_status === "archive_write_completed_validated" &&
    receipt?.archive_write_performed === true &&
    receipt?.budget?.actual_write_files === 3 &&
    Array.isArray(candidatePaths) &&
    candidatePaths.length === expected.allowedWritePaths.length &&
    expected.allowedWritePaths.every((item) => candidatePaths.includes(item)) &&
    written.length === expected.allowedWritePaths.length &&
    expected.allowedWritePaths.every((item) => written.includes(item)) &&
    expected.allowedWritePaths.every((item) => exists(item))
  );
}

function evaluate(record) {
  const sourceRefs = record.source_refs || {};
  const target = record.target || {};
  const budget = record.budget || {};
  const guard = record.guard || {};
  const required = record.required_before_future_archive_write || [];
  const rollback = record.rollback_or_cleanup_plan || [];
  const stopConditions = record.stop_conditions || [];
  const allowedPaths = target.exact_allowed_write_paths || [];

  const authorization = readJson(files.authorizationPackage)
    .exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight;
  const metadata = readJson(files.metadataPreflight)
    .exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration;
  const approval = readJson(files.approvalEvidence).user_submitted_formal_human_approval_evidence;
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);

  const sourceRefsOk =
    sourceRefs.archive_write_authorization_package === files.authorizationPackage &&
    sourceRefs.metadata_preflight === files.metadataPreflight &&
    sourceRefs.approval_evidence === files.approvalEvidence &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const upstreamOk =
    authorization.archive_write_authorization_package_prepared === true &&
    authorization.archive_write_authorized_next === true &&
    authorization.execution_allowed_now === false &&
    authorization.guard?.archive_write_performed === false &&
    authorization.guard?.image_binary_read_performed === false &&
    authorization.guard?.image_file_copy_performed === false &&
    authorization.target?.sample_id === expected.sampleId &&
    authorization.target?.candidate_id === expected.candidateId &&
    authorization.target?.source_artifact_hash_ref === expected.sha256 &&
    Array.isArray(authorization.target?.exact_allowed_write_paths) &&
    authorization.target.exact_allowed_write_paths.length === expected.allowedWritePaths.length &&
    expected.allowedWritePaths.every((item) => authorization.target.exact_allowed_write_paths.includes(item)) &&
    metadata.archive_metadata_preflight_compiled === true &&
    metadata.archive_write_performed === false &&
    metadata.image_binary_read_performed === false &&
    metadata.image_file_copy_performed === false &&
    approval.current_capture_state?.formal_human_approval_captured_now === true &&
    approval.target?.sample_id === expected.sampleId &&
    approval.target?.candidate_id === expected.candidateId &&
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    categoryText.includes(`  - ${expected.sampleId}`);

  const packageOk =
    record.phase === expected.phase &&
    record.execution_mode === "durable_archive_write_execution_preflight_no_write" &&
    record.package_type === expected.packageType &&
    record.package_status === expected.packageStatus &&
    record.authorization_model === expected.authorizationModel &&
    record.archive_write_execution_preflight_passed === true &&
    record.source_hash_verification_deferred_to_write_gate === true &&
    record.execution_allowed_now === false &&
    record.archive_write_allowed_next_gate === true;

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
    target.archive_write_authorization_package_prepared === true &&
    target.archive_write_authorized_next === true &&
    target.target_archive_root === expected.archiveRoot &&
    target.target_archive_root_exists === false &&
    target.target_archive_paths_absent === true &&
    target.overwrite_existing_files_allowed === false &&
    Array.isArray(allowedPaths) &&
    allowedPaths.length === expected.allowedWritePaths.length &&
    expected.allowedWritePaths.every((item) => allowedPaths.includes(item));

  const budgetOk =
    budget.current_write_files === 0 &&
    budget.current_image_binary_reads === 0 &&
    budget.next_gate_max_write_files === 3 &&
    budget.next_gate_max_image_binary_reads === 1 &&
    budget.next_gate_max_runtime_probe_minutes === 10 &&
    budget.overwrite_existing_files_allowed === false &&
    budget.secret_value_read_allowed === false;

  const requiredOk =
    required.includes("read the source image binary exactly once for sha256 verification") &&
    required.includes(`source image sha256 must equal ${expected.sha256}`) &&
    required.includes("write only the exact manifest/original/preview archive paths") &&
    required.includes("do not overwrite existing archive files") &&
    required.includes("validate the archive manifest after write") &&
    required.includes("retain rollback cleanup limited to the exact target archive directory");

  const rollbackOk =
    rollback.includes(`future write rollback may remove only ${expected.archiveRoot}/`) &&
    rollback.includes("do not remove or modify accepted_samples registry entries") &&
    rollback.includes("do not modify runs/real_generation source artifacts");

  const stopOk =
    stopConditions.includes("any target archive path exists") &&
    stopConditions.includes("target archive root exists before execution") &&
    stopConditions.includes("source hash verification fails during the future write gate") &&
    stopConditions.includes("preview generation requires a new dependency or broad runtime change") &&
    stopConditions.includes("more than three archive files would be written") &&
    stopConditions.includes("secret/private path exposure") &&
    stopConditions.includes("production candidate, DailyNote, or VCP memory scope expansion");

  const noWrites =
    guard.preflight_only === true &&
    guard.authorization_package_verified === true &&
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

  return {
    passed: sourceRefsOk && upstreamOk && packageOk && targetOk && budgetOk && requiredOk && rollbackOk && stopOk && noWrites && noExternal,
    sourceRefsOk,
    upstreamOk,
    packageOk,
    targetOk,
    budgetOk,
    requiredOk,
    rollbackOk,
    stopOk,
    noWrites,
    noExternal
  };
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.recommended_next === expected.recommendedNext, `${context}.recommended_next mismatch`);
  assertArchiveTargetsActuallyAbsent(record, context);
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
    expectFailure(validRecord, "authorization_package_not_verified_fails", (candidate) => {
      candidate.guard.authorization_package_verified = false;
    }),
    expectFailure(validRecord, "archive_preflight_not_passed_fails", (candidate) => {
      candidate.archive_write_execution_preflight_passed = false;
    }),
    expectFailure(validRecord, "execution_now_overclaim_fails", (candidate) => {
      candidate.execution_allowed_now = true;
    }),
    expectFailure(validRecord, "target_archive_root_exists_fails", (candidate) => {
      candidate.target.target_archive_root_exists = true;
      candidate.target.target_archive_paths_absent = false;
    }),
    expectFailure(validRecord, "archive_write_performed_fails", (candidate) => {
      candidate.guard.archive_write_performed = true;
      candidate.guard.durable_archive_manifest_write_performed = true;
    }),
    expectFailure(validRecord, "image_binary_read_or_copy_fails", (candidate) => {
      candidate.guard.image_binary_read_performed = true;
      candidate.guard.image_file_copy_performed = true;
      candidate.budget.current_image_binary_reads = 1;
    }),
    expectFailure(validRecord, "broad_allowed_write_path_fails", (candidate) => {
      candidate.target.exact_allowed_write_paths.push("asset_archive/accepted_samples/");
    }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => {
      candidate.target.overwrite_existing_files_allowed = true;
      candidate.budget.overwrite_existing_files_allowed = true;
    }),
    expectFailure(validRecord, "budget_expansion_fails", (candidate) => {
      candidate.budget.next_gate_max_write_files = 4;
    }),
    expectFailure(validRecord, "missing_future_write_requirement_fails", (candidate) => {
      candidate.required_before_future_archive_write = [];
    }),
    expectFailure(validRecord, "rollback_missing_fails", (candidate) => {
      candidate.rollback_or_cleanup_plan = [];
    }),
    expectFailure(validRecord, "wrong_hash_fails", (candidate) => {
      candidate.target.source_artifact_hash_ref = "bad";
    }),
    expectFailure(validRecord, "hash_not_deferred_fails", (candidate) => {
      candidate.source_hash_verification_deferred_to_write_gate = false;
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
    "package_type: durable_archive_write_execution_preflight_no_write",
    "package_status: execution_preflight_passed_archive_write_ready_not_performed",
    "archive_write_execution_preflight_passed: true",
    "target_archive_root_exists: false",
    "target_archive_paths_absent: true",
    "source_hash_verification_deferred_to_write_gate: true",
    "execution_allowed_now: false",
    "archive_write_performed: false",
    "image_binary_read_performed: false",
    "image_file_copy_performed: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_durable_archive_write_execution_preflight_no_write.js"),
    "validate_mvp missing v0.6.59 validator"
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
    archive_metadata_preflight_compiled: report.target.archive_metadata_preflight_compiled,
    archive_write_authorization_package_prepared: report.target.archive_write_authorization_package_prepared,
    archive_write_authorized_next: report.target.archive_write_authorized_next,
    archive_write_execution_preflight_passed: report.archive_write_execution_preflight_passed,
    target_archive_root_exists: report.target.target_archive_root_exists,
    target_archive_paths_absent: report.target.target_archive_paths_absent,
    source_hash_verification_deferred_to_write_gate: report.source_hash_verification_deferred_to_write_gate,
    execution_allowed_now: report.execution_allowed_now,
    archive_write_allowed_next_gate: report.archive_write_allowed_next_gate,
    archive_write_performed: report.guard.archive_write_performed,
    image_binary_read_performed: report.guard.image_binary_read_performed,
    image_file_copy_performed: report.guard.image_file_copy_performed,
    future_write_path_count: report.target.exact_allowed_write_paths.length,
    current_write_files: report.budget.current_write_files,
    current_image_binary_reads: report.budget.current_image_binary_reads,
    next_gate_max_write_files: report.budget.next_gate_max_write_files,
    next_gate_max_image_binary_reads: report.budget.next_gate_max_image_binary_reads,
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
