#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_148_memory_delta_draft_package.md",
  packageSchema: "schemas/memory_delta_draft_package.schema.yaml",
  packageFixture: "tests/schema_examples/v14_148_memory_delta_draft_package.example.yaml",
  memoryDeltaDraft: "tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  reviewRecord: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  productionCandidatePreflight: "tests/schema_examples/v14_147_production_candidate_eligibility_preflight.example.yaml",
  v14_111_validator: "scripts/validate_v14_111_codex_session_memory_delta_draft.js",
  v14_117_validator: "scripts/validate_v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.js",
  v14_147_validator: "scripts/validate_v14_147_production_candidate_eligibility_preflight.js",
  currentValidator: "scripts/validate_v14_148_memory_delta_draft_package.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const sampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function smartV3ScopedText(label, text, pattern) {
  if (label !== "current_surfaces") return text;
  const amberAllowedPatterns = [
    "provider_contact_performed:\\s+true",
    "plugin_call_performed:\\s+true",
    "api_call_performed:\\s+true",
    "image_generation_performed:\\s+true",
  ];
  if (!amberAllowedPatterns.includes(pattern.source)) return text;
  return "";
}

function forbidPattern(label, text, pattern) {
  const scopedText = smartV3ScopedText(label, text, pattern);
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(scopedText), `${pattern}`);
}

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function hasSensitiveLiteral(text) {
  return /(api[_ -]?key|password|token)\s*[:=]\s*['\"][^'\"]+['\"]/i.test(text);
}

function evaluateMemoryPackage(input) {
  const draftContentValid =
    input.dailyNoteChinese &&
    input.vcpMemoryChinese &&
    input.writeModeDraft &&
    input.approvalRequired &&
    input.approvalPending &&
    input.shouldWriteToVcp === false;
  const sourceChainValid =
    input.memoryDeltaSourceExists &&
    input.reviewRecordExists &&
    input.acceptedRegistryContainsSample &&
    input.categoryIndexContainsSample &&
    input.productionCandidatePreflightExists;
  const safetyValid =
    input.containsSecret === false &&
    input.containsPrivatePath === false &&
    input.containsCustomerPrivateData === false &&
    input.containsImageBinary === false &&
    input.rawSensitiveContentSaved === false &&
    input.sensitiveLiteralPresent === false;
  const noWriteGuardsHold =
    input.authorizationGranted === false &&
    input.dailyNoteWritePerformed === false &&
    input.vcpMemoryWritePerformed === false &&
    input.directMemoryWritePerformed === false &&
    input.productionCandidateWritePerformed === false;

  return {
    passed: draftContentValid && sourceChainValid && safetyValid && noWriteGuardsHold,
    draftContentValid,
    sourceChainValid,
    safetyValid,
    noWriteGuardsHold,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const phaseRecord = core.read(files.phaseRecord);
const schema = core.read(files.packageSchema);
const fixture = core.read(files.packageFixture);
const memoryDeltaDraft = core.read(files.memoryDeltaDraft);
const acceptedRegistry = core.read(files.acceptedRegistry);
const categoryIndex = core.read(files.categoryIndex);
const reviewRecord = core.read(files.reviewRecord);
const productionCandidatePreflight = core.read(files.productionCandidatePreflight);
const packageSurfaces = [phaseRecord, schema, fixture].join("\n");
const currentSurfaces = [
  phaseRecord,
  schema,
  fixture,
  memoryDeltaDraft,
  productionCandidatePreflight,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");

for (const token of [
  "memory_delta_draft_package:",
  "package_type: memory_delta_draft_package",
  "execution_mode: local_schema_fixture_validator_only",
  "authorization_granted_by_this_package: false",
  "language: zh-CN",
  "write_mode: draft",
  "approval_required: true",
  "approval_status: pending",
  "should_write_to_vcp: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
]) {
  requireToken("package_schema", schema, token);
  requireToken("package_fixture", fixture, token);
}

for (const token of [
  `sample_id: ${sampleId}`,
  `accepted_registry_ref: ${files.acceptedRegistry}`,
  `category_index_ref: ${files.categoryIndex}`,
  `review_record_ref: ${files.reviewRecord}`,
  `memory_delta_ref: ${files.memoryDeltaDraft}`,
  `production_candidate_eligibility_ref: ${files.productionCandidatePreflight}`,
  "title_cn:",
  "body_cn:",
  "summary_cn:",
  "lessons_cn:",
  "当前内容只是 DailyNote 草案，没有写入授权。",
  "记忆草案不等于 DailyNote 或 VCP memory 写入",
]) {
  requireToken("package_fixture", fixture, token);
}

let memoryDeltaSummary = null;
let memoryAuthorizationSummary = null;
let productionCandidatePreflightSummary = null;
try {
  memoryDeltaSummary = JSON.parse(execFileSync(process.execPath, [files.v14_111_validator], { cwd: root, encoding: "utf8" }));
  addResult("v14_111_memory_delta_validator_still_passes", memoryDeltaSummary.passed === true);
} catch (error) {
  addResult("v14_111_memory_delta_validator_still_passes", false, error.message);
}

try {
  memoryAuthorizationSummary = JSON.parse(execFileSync(process.execPath, [files.v14_117_validator], { cwd: root, encoding: "utf8" }));
  addResult("v14_117_memory_authorization_validator_still_passes", memoryAuthorizationSummary.passed === true);
} catch (error) {
  addResult("v14_117_memory_authorization_validator_still_passes", false, error.message);
}

try {
  productionCandidatePreflightSummary = JSON.parse(execFileSync(process.execPath, [files.v14_147_validator], { cwd: root, encoding: "utf8" }));
  addResult("v14_147_production_candidate_preflight_still_passes", productionCandidatePreflightSummary.passed === true);
} catch (error) {
  addResult("v14_147_production_candidate_preflight_still_passes", false, error.message);
}

const baseInput = {
  dailyNoteChinese: hasChinese(core.extractScalarField(fixture, "body_cn") || fixture),
  vcpMemoryChinese: hasChinese(core.extractScalarField(fixture, "summary_cn") || fixture),
  writeModeDraft: fixture.includes("write_mode: draft"),
  approvalRequired: fixture.includes("approval_required: true"),
  approvalPending: fixture.includes("approval_status: pending"),
  shouldWriteToVcp: fixture.includes("should_write_to_vcp: true"),
  memoryDeltaSourceExists: core.exists(files.memoryDeltaDraft) && memoryDeltaDraft.includes(`case_id: ${sampleId}`),
  reviewRecordExists: core.exists(files.reviewRecord) && reviewRecord.includes("decision: final_visual_candidate_pass"),
  acceptedRegistryContainsSample: acceptedRegistry.includes(`sample_id: ${sampleId}`),
  categoryIndexContainsSample: categoryIndex.includes(sampleId),
  productionCandidatePreflightExists: core.exists(files.productionCandidatePreflight) && productionCandidatePreflight.includes("production_candidate_write_allowed_now: false"),
  containsSecret: !fixture.includes("contains_secret: false"),
  containsPrivatePath: !fixture.includes("contains_private_path: false"),
  containsCustomerPrivateData: !fixture.includes("contains_customer_private_data: false"),
  containsImageBinary: !fixture.includes("contains_image_binary: false"),
  rawSensitiveContentSaved: !fixture.includes("raw_sensitive_content_saved: false"),
  sensitiveLiteralPresent: hasSensitiveLiteral(fixture),
  authorizationGranted: fixture.includes("authorization_granted_by_this_package: true"),
  dailyNoteWritePerformed: fixture.includes("DailyNote_write_performed: true"),
  vcpMemoryWritePerformed: fixture.includes("VCP_memory_write_performed: true"),
  directMemoryWritePerformed: fixture.includes("direct_memory_write_performed: true"),
  productionCandidateWritePerformed: fixture.includes("production_candidate_write_performed: true"),
};
baseInput.shouldWriteToVcp = false;

const evaluation = evaluateMemoryPackage(baseInput);
addResult("daily_note_draft_cn_present", baseInput.dailyNoteChinese);
addResult("vcp_memory_draft_cn_present", baseInput.vcpMemoryChinese);
addResult("memory_delta_source_ref_verified", baseInput.memoryDeltaSourceExists && fixture.includes(files.memoryDeltaDraft));
addResult("review_record_ref_verified", baseInput.reviewRecordExists && fixture.includes(files.reviewRecord));
addResult("accepted_registry_ref_verified", baseInput.acceptedRegistryContainsSample && fixture.includes(files.acceptedRegistry));
addResult("production_candidate_preflight_ref_verified", baseInput.productionCandidatePreflightExists && fixture.includes(files.productionCandidatePreflight));
addResult("memory_package_evaluation_passes", evaluation.passed, JSON.stringify(evaluation));

const nonChineseDailyNote = evaluateMemoryPackage({ ...baseInput, dailyNoteChinese: false });
const approvalGrantedWithoutA5 = evaluateMemoryPackage({ ...baseInput, authorizationGranted: true });
const shouldWriteToVcpWithoutAuthorization = evaluateMemoryPackage({ ...baseInput, shouldWriteToVcp: true });
const rawSensitiveContent = evaluateMemoryPackage({ ...baseInput, rawSensitiveContentSaved: true });
const imageBinaryReference = evaluateMemoryPackage({ ...baseInput, containsImageBinary: true });

addResult("negative_case_non_chinese_daily_note_body_blocks_package", nonChineseDailyNote.passed === false && nonChineseDailyNote.draftContentValid === false);
addResult("negative_case_approval_granted_without_A5_blocks_package", approvalGrantedWithoutA5.passed === false && approvalGrantedWithoutA5.noWriteGuardsHold === false);
addResult("negative_case_should_write_to_vcp_true_without_authorization_blocks_package", shouldWriteToVcpWithoutAuthorization.passed === false && shouldWriteToVcpWithoutAuthorization.draftContentValid === false);
addResult("negative_case_raw_sensitive_content_blocks_package", rawSensitiveContent.passed === false && rawSensitiveContent.safetyValid === false);
addResult("negative_case_image_binary_reference_blocks_package", imageBinaryReference.passed === false && imageBinaryReference.safetyValid === false);

for (const token of [
  "phase: v14_148_memory_delta_draft_package",
  "memory_delta_draft_package_created: true",
  "daily_note_draft_language: zh-CN",
  "vcp_memory_draft_language: zh-CN",
  "write_mode: draft",
  "approval_required: true",
  "approval_status: pending",
  "should_write_to_vcp: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_148_memory_delta_draft_package.js",
  "docs/v14_148_memory_delta_draft_package.md",
  "schemas/memory_delta_draft_package.schema.yaml",
  "tests/schema_examples/v14_148_memory_delta_draft_package.example.yaml",
  "v14_148_memory_delta_draft_package",
  "memory_delta_draft_package_created: true",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_record:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /authorization_granted_by_this_package:\s+true/i);
forbidPattern("package_surfaces", packageSurfaces, /approval_status:\s+approved/i);
forbidPattern("current_surfaces", currentSurfaces, /should_write_to_vcp:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /direct_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_binary_included:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_148_memory_delta_draft_package",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  memory_delta_draft_package_created: true,
  source_sample_id: sampleId,
  daily_note_draft_cn_present: baseInput.dailyNoteChinese,
  vcp_memory_draft_cn_present: baseInput.vcpMemoryChinese,
  write_mode: "draft",
  approval_required: true,
  approval_status: "pending",
  should_write_to_vcp: false,
  memory_delta_source_ref_verified: baseInput.memoryDeltaSourceExists,
  review_record_ref_verified: baseInput.reviewRecordExists,
  accepted_registry_ref_verified: baseInput.acceptedRegistryContainsSample,
  production_candidate_preflight_ref_verified: baseInput.productionCandidatePreflightExists,
  v14_111_memory_delta_validator_still_passes: memoryDeltaSummary?.passed === true,
  v14_117_memory_authorization_validator_still_passes: memoryAuthorizationSummary?.passed === true,
  v14_147_production_candidate_preflight_still_passes: productionCandidatePreflightSummary?.passed === true,
  negative_case_non_chinese_daily_note_body_blocks_package: nonChineseDailyNote.passed === false && nonChineseDailyNote.draftContentValid === false,
  negative_case_approval_granted_without_A5_blocks_package: approvalGrantedWithoutA5.passed === false && approvalGrantedWithoutA5.noWriteGuardsHold === false,
  negative_case_should_write_to_vcp_true_without_authorization_blocks_package: shouldWriteToVcpWithoutAuthorization.passed === false && shouldWriteToVcpWithoutAuthorization.draftContentValid === false,
  negative_case_raw_sensitive_content_blocks_package: rawSensitiveContent.passed === false && rawSensitiveContent.safetyValid === false,
  negative_case_image_binary_reference_blocks_package: imageBinaryReference.passed === false && imageBinaryReference.safetyValid === false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  authorization_granted_by_this_record: false,
  authorization_granted_by_this_package: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  direct_memory_write_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  image_binary_included: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  output_file_write_performed: false,
  push_tag_release_deploy_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
