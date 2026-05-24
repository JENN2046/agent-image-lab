#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const key = "exact_new_trial_003_durable_archive_write_execution_receipt";

const files = {
  phaseRecord: "docs/V0_6_60_EXACT_NEW_TRIAL_003_DURABLE_ARCHIVE_WRITE_EXECUTION_RECEIPT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_receipt.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_durable_archive_write_execution_receipt_fail.example.json",
  manifest: "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/manifest.json",
  original: "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/original.png",
  preview: "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/preview.webp",
  sourceImage: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  preflight: "reports/visual_asset_eval_dry_run/v0_6_59_exact_new_trial_003_durable_archive_write_execution_preflight_no_write.json",
  authorizationPackage: "reports/visual_asset_eval_dry_run/v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight.json",
  approvalEvidence: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt",
  status: "completed_validated_exact_local_durable_archive_write",
  packageType: "durable_archive_write_execution_receipt",
  packageStatus: "archive_write_completed_validated",
  authorizationModel: "smart_standing_authorization_v3_default_real_class_allowed",
  lane: "Amber_E",
  envelopeId: "smart_standing_authorization_v3_default_autonomy_envelope",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  previewSha256: "93af7b4468d7294f0c1eaef1f9cf260ed86b11122ba81d0230edb9eaedae47c7",
  originalWidth: 941,
  originalHeight: 1672,
  previewWidth: 288,
  previewHeight: 512,
  previewLongEdge: 512,
  archiveRoot: "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  recommendedNext: "prepare_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write"
};

expected.writtenFiles = [
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

function readBuffer(relativePath) {
  return fs.readFileSync(repoPath(relativePath));
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
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

function listArchiveFiles() {
  return fs.readdirSync(repoPath(expected.archiveRoot)).map((name) => `${expected.archiveRoot}/${name}`).sort();
}

function evaluate(record) {
  const target = record.target || {};
  const budget = record.budget || {};
  const receipt = record.receipt || {};
  const callsUsed = receipt.calls_used || {};
  const archiveManifest = record.archive_manifest || {};
  const originalRecord = archiveManifest.original || {};
  const previewRecord = archiveManifest.preview || {};
  const guard = record.guard || {};
  const sourceRefs = record.source_refs || {};

  const preflight = readJson(files.preflight).exact_new_trial_003_durable_archive_write_execution_preflight_no_write;
  const authorization = readJson(files.authorizationPackage)
    .exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight;
  const approval = readJson(files.approvalEvidence).user_submitted_formal_human_approval_evidence;
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);

  const sourceRefsOk =
    sourceRefs.execution_preflight === files.preflight &&
    sourceRefs.archive_write_authorization_package === files.authorizationPackage &&
    sourceRefs.approval_evidence === files.approvalEvidence &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const upstreamOk =
    preflight.archive_write_allowed_next_gate === true &&
    preflight.target?.target_archive_paths_absent === true &&
    preflight.target?.sample_id === expected.sampleId &&
    authorization.archive_write_authorized_next === true &&
    authorization.execution_allowed_now === false &&
    approval.current_capture_state?.formal_human_approval_captured_now === true &&
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    categoryText.includes(`  - ${expected.sampleId}`);

  const packageOk =
    record.phase === expected.phase &&
    record.status === expected.status &&
    record.execution_mode === "exact_local_durable_archive_write" &&
    record.lane === expected.lane &&
    record.envelope_id === expected.envelopeId &&
    record.package_type === expected.packageType &&
    record.package_status === expected.packageStatus &&
    record.authorization_model === expected.authorizationModel;

  const targetOk =
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.source_artifact_ref === files.sourceImage &&
    target.source_artifact_sha256_verified === expected.sha256 &&
    target.target_archive_root === expected.archiveRoot &&
    target.manifest_ref === files.manifest &&
    target.original_ref === files.original &&
    target.preview_ref === files.preview &&
    target.overwrite_existing_files_allowed === false;

  const archiveManifestOk =
    archiveManifest.manifest_type === "accepted_sample_durable_archive_manifest" &&
    archiveManifest.version === "v1" &&
    originalRecord.format === "png" &&
    originalRecord.mime === "image/png" &&
    originalRecord.width === expected.originalWidth &&
    originalRecord.height === expected.originalHeight &&
    originalRecord.sha256 === expected.sha256 &&
    previewRecord.format === "webp" &&
    previewRecord.mime === "image/webp" &&
    previewRecord.long_edge === expected.previewLongEdge &&
    previewRecord.width === expected.previewWidth &&
    previewRecord.height === expected.previewHeight &&
    previewRecord.sha256 === expected.previewSha256;

  const budgetOk =
    budget.max_write_files === 3 &&
    budget.actual_write_files === 3 &&
    budget.max_image_binary_reads === 1 &&
    budget.actual_image_binary_reads === 1 &&
    budget.max_runtime_probe_minutes === 10 &&
    budget.dependency_actions_used === 0 &&
    budget.overwrite_existing_files_allowed === false &&
    budget.secret_value_read_allowed === false;

  const receiptOk =
    receipt.task_id === "execute_exact_new_trial_003_durable_archive_write_exact_three_files_with_hash_verification" &&
    receipt.lane === expected.lane &&
    receipt.envelope_id === expected.envelopeId &&
    receipt.action_performed === "exact_local_durable_archive_write" &&
    Array.isArray(receipt.target_systems) &&
    receipt.target_systems.includes("local_repository_asset_archive") &&
    callsUsed.provider_calls === 0 &&
    callsUsed.plugin_calls === 0 &&
    callsUsed.api_calls === 0 &&
    callsUsed.image_generation_calls === 0 &&
    callsUsed.image_binary_reads === 1 &&
    Array.isArray(receipt.files_read) &&
    receipt.files_read.length === 1 &&
    receipt.files_read[0] === files.sourceImage &&
    Array.isArray(receipt.files_written) &&
    receipt.files_written.length === expected.writtenFiles.length &&
    expected.writtenFiles.every((item) => receipt.files_written.includes(item)) &&
    receipt.dependency_actions_used === 0 &&
    receipt.validation_required === true &&
    Array.isArray(receipt.validation_run) &&
    receipt.validation_run.includes("node scripts/validate_exact_new_trial_003_durable_archive_write_execution_receipt.js") &&
    receipt.validation_result === "passed" &&
    receipt.rollback_or_cleanup_available === "exact_target_archive_directory_only" &&
    receipt.next_auto_step_allowed === true &&
    receipt.stop_reason === null;

  const actionFlagsOk =
    record.archive_write_performed === true &&
    record.image_binary_read_performed === true &&
    record.image_file_copy_performed === true &&
    record.preview_generation_performed === true &&
    record.production_candidate_write_performed === false &&
    record.DailyNote_write_performed === false &&
    record.VCP_memory_write_performed === false &&
    record.provider_contact_performed === false &&
    record.plugin_call_performed === false &&
    record.api_call_performed === false &&
    record.secret_value_read_performed === false &&
    record.push_tag_release_deploy_performed === false;

  const guardOk =
    guard.archive_write_performed === true &&
    guard.durable_archive_manifest_write_performed === true &&
    guard.durable_archive_original_write_performed === true &&
    guard.durable_archive_preview_write_performed === true &&
    guard.image_binary_read_performed === true &&
    guard.image_binary_reads_used === 1 &&
    guard.files_written === 3 &&
    guard.overwrite_existing_files_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.secret_value_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  return {
    passed: sourceRefsOk && upstreamOk && packageOk && targetOk && archiveManifestOk && budgetOk && receiptOk && actionFlagsOk && guardOk,
    sourceRefsOk,
    upstreamOk,
    packageOk,
    targetOk,
    archiveManifestOk,
    budgetOk,
    receiptOk,
    actionFlagsOk,
    guardOk
  };
}

async function validateArchiveFiles(record, context) {
  assert(exists(files.manifest), `${context}: archive manifest missing`);
  assert(exists(files.original), `${context}: archive original missing`);
  assert(exists(files.preview), `${context}: archive preview missing`);
  assert(JSON.stringify(listArchiveFiles()) === JSON.stringify(expected.writtenFiles), `${context}: archive directory must contain exactly the three expected files`);

  const manifest = readJson(files.manifest);
  assert(manifest.manifest_type === "accepted_sample_durable_archive_manifest", `${context}: manifest type mismatch`);
  assert(manifest.sample_id === expected.sampleId, `${context}: manifest sample_id mismatch`);
  assert(manifest.candidate_id === expected.candidateId, `${context}: manifest candidate_id mismatch`);
  assert(manifest.source?.artifact_ref === files.sourceImage, `${context}: manifest source artifact mismatch`);
  assert(manifest.source?.sha256 === expected.sha256, `${context}: manifest source sha mismatch`);
  assert(manifest.source?.binary_reads_used === 1, `${context}: manifest binary read count mismatch`);
  assert(manifest.artifact?.original?.path === "original.png", `${context}: manifest original path mismatch`);
  assert(manifest.artifact?.preview?.path === "preview.webp", `${context}: manifest preview path mismatch`);
  assert(manifest.guard?.files_written === 3, `${context}: manifest write count mismatch`);
  assert(manifest.guard?.DailyNote_write_performed === false, `${context}: manifest DailyNote guard mismatch`);
  assert(manifest.guard?.VCP_memory_write_performed === false, `${context}: manifest VCP memory guard mismatch`);

  const sourceBuffer = readBuffer(files.sourceImage);
  const originalBuffer = readBuffer(files.original);
  const previewBuffer = readBuffer(files.preview);
  assert(sha256(sourceBuffer) === expected.sha256, `${context}: source hash mismatch`);
  assert(sha256(originalBuffer) === expected.sha256, `${context}: original hash mismatch`);
  assert(sha256(previewBuffer) === expected.previewSha256, `${context}: preview hash mismatch`);

  const originalMetadata = await sharp(originalBuffer).metadata();
  const previewMetadata = await sharp(previewBuffer).metadata();
  assert(originalMetadata.format === "png", `${context}: original format mismatch`);
  assert(originalMetadata.width === expected.originalWidth && originalMetadata.height === expected.originalHeight, `${context}: original dimensions mismatch`);
  assert(previewMetadata.format === "webp", `${context}: preview format mismatch`);
  assert(previewMetadata.width === expected.previewWidth && previewMetadata.height === expected.previewHeight, `${context}: preview dimensions mismatch`);
  assert(Math.max(previewMetadata.width || 0, previewMetadata.height || 0) === expected.previewLongEdge, `${context}: preview long edge mismatch`);

  assert(record.archive_manifest?.original?.sha256 === manifest.artifact?.original?.sha256, `${context}: report original sha does not match manifest`);
  assert(record.archive_manifest?.preview?.sha256 === manifest.artifact?.preview?.sha256, `${context}: report preview sha does not match manifest`);
}

async function validateRecord(record, context, options = {}) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(record.recommended_next === expected.recommendedNext, `${context}.recommended_next mismatch`);
  const result = evaluate(record);
  assert(result.passed, `${context} evaluation failed: ${JSON.stringify(result)}`);
  if (options.realArchive) await validateArchiveFiles(record, context);
}

async function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    await validateRecord(candidate, caseId);
  } catch (_error) {
    return true;
  }
  throw new Error(`Negative case unexpectedly passed: ${caseId}`);
}

async function main() {
  Object.values(files).forEach((file) => assert(exists(file), `Missing file: ${file}`));
  const report = readJson(files.report)[key];
  const passFixture = readJson(files.passFixture)[key];
  const failFixture = readJson(files.failFixture)[key];

  await validateRecord(report, "report", { realArchive: true });
  await validateRecord(passFixture, "passFixture");

  let failFixtureRejected = false;
  try {
    await validateRecord(failFixture, "failFixture");
  } catch (_error) {
    failFixtureRejected = true;
  }
  assert(failFixtureRejected, "fail fixture should be rejected");

  const negativeCases = [
    ["wrong_phase", (record) => { record.phase = "wrong"; }],
    ["wrong_hash", (record) => { record.target.source_artifact_sha256_verified = "0".repeat(64); }],
    ["too_many_writes", (record) => { record.budget.actual_write_files = 4; }],
    ["too_many_binary_reads", (record) => { record.budget.actual_image_binary_reads = 2; }],
    ["missing_written_file", (record) => { record.receipt.files_written.pop(); }],
    ["bad_preview_hash", (record) => { record.archive_manifest.preview.sha256 = "0".repeat(64); }],
    ["overwrite_allowed", (record) => { record.target.overwrite_existing_files_allowed = true; }],
    ["production_candidate", (record) => { record.production_candidate_write_performed = true; }],
    ["memory_write", (record) => { record.guard.VCP_memory_write_performed = true; }],
    ["provider_call", (record) => { record.guard.provider_contact_performed = true; }],
    ["secret_read", (record) => { record.guard.secret_value_read_performed = true; }],
    ["bad_rollback", (record) => { record.receipt.rollback_or_cleanup_available = "broad_delete"; }],
    ["missing_validation", (record) => { record.receipt.validation_run = []; }]
  ];
  const caught = [];
  for (const [caseId, mutate] of negativeCases) {
    if (await expectFailure(report, caseId, mutate)) caught.push(caseId);
  }

  const summary = {
    phase: expected.phase,
    passed: true,
    package_type: expected.packageType,
    package_status: expected.packageStatus,
    target_sample_id: expected.sampleId,
    target_candidate_id: expected.candidateId,
    category: expected.category,
    source_artifact_sha256_verified: expected.sha256,
    archive_write_performed: true,
    image_binary_read_performed: true,
    image_file_copy_performed: true,
    preview_generation_performed: true,
    actual_write_files: 3,
    actual_image_binary_reads: 1,
    target_archive_root: expected.archiveRoot,
    manifest_ref: files.manifest,
    original_ref: files.original,
    preview_ref: files.preview,
    original_sha256: expected.sha256,
    preview_sha256: expected.previewSha256,
    original_width: expected.originalWidth,
    original_height: expected.originalHeight,
    preview_width: expected.previewWidth,
    preview_height: expected.previewHeight,
    preview_long_edge: expected.previewLongEdge,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    secret_value_read_performed: false,
    push_tag_release_deploy_performed: false,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: caught.length,
    all_negative_cases_caught: caught.length === negativeCases.length,
    recommended_next: expected.recommendedNext
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  });
}
