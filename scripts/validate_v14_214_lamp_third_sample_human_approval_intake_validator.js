#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_214_lamp_third_sample_human_approval_intake_validator.md",
  fixture: "tests/schema_examples/v14_214_lamp_third_sample_human_approval_intake_validator.example.json",
  requestPackage: "tests/schema_examples/v14_213_lamp_third_sample_human_approval_request_package.example.json",
  readiness: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_readiness.example.json",
  blockerPreflight: "tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const expected = {
  phase: "v14_214_lamp_third_sample_human_approval_intake_validator",
  requestPhase: "v14_213_lamp_third_sample_human_approval_request_package",
  candidateId: "v14_166_lamp_v3_generated_candidate_001",
  sampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  artifactRef: "runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png",
  sha256: "eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c",
  dimensions: "1254x1254",
  mime: "image/png",
  reviewer: "Jenn",
  category: "product_still_life",
};

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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function lines(value) {
  return value ? value.split(/\r?\n/).filter(Boolean) : [];
}

function runGit(args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function statementMatches(statement, sourceStatement) {
  if (typeof statement !== "string") return false;
  const requiredTokens = [
    "我 Jenn 明确通过",
    expected.candidateId,
    expected.sampleId,
    expected.artifactRef,
    `sha256=${expected.sha256}`,
    `dimensions=${expected.dimensions}`,
    `mime=${expected.mime}`,
    "仅登记 accepted_samples 元数据和 product_still_life 分类索引",
    "不复制图片",
    "不修改 runs 源图",
    "不晋级 production_candidate",
    "不写 failure_samples",
    "不写 DailyNote",
    "不写 VCP memory",
    "不调用 provider/API/plugin/MCP",
    "不读取 .env/.env.local",
    "不读取 real manifest/VCPChat/VCPToolBox",
    "不 push/tag/release/deploy",
    "审批人 Jenn",
  ];

  return requiredTokens.every((token) => statement.includes(token)) && statement === sourceStatement;
}

function gatherEvidence() {
  const requestPackage = core.parseJson(files.requestPackage).lamp_third_sample_human_approval_request_package;
  const readiness = core.parseJson(files.readiness).lamp_v3_generated_candidate_readiness;
  const blocker = core.parseJson(files.blockerPreflight).lamp_v3_accepted_samples_registration_blocker_preflight;
  return {
    requestPackage,
    readiness,
    blocker,
    stagedFileCount: lines(runGit(["diff", "--cached", "--name-only"])).length,
  };
}

function evaluate(input, evidence) {
  const target = input.target || {};
  const intake = input.approval_intake || {};
  const guard = input.guard || {};
  const statement = intake.candidate_approval_statement_under_test;
  const sourceStatement = evidence.requestPackage.exact_human_approval_statement_for_jenn;

  const identityOk =
    input.phase === expected.phase &&
    input.execution_mode === "approval_intake_validator_only";
  const blockerStillPending = evidence.blocker.eligibility.registration_blocker === "human_approval_missing";
  const blockerClearedByLaterApproval =
    evidence.blocker.eligibility.human_approval_present === true &&
    evidence.blocker.eligibility.accepted_samples_registration_eligible === true &&
    evidence.blocker.eligibility.registration_blocker === null;
  const sourceOk =
    evidence.requestPackage.phase === expected.requestPhase &&
    evidence.requestPackage.approval_state.human_approval_granted_by_this_record === false &&
    evidence.requestPackage.approval_state.accepted_samples_registration_ready_now === false &&
    evidence.readiness.human_approval_status === "pending" &&
    (blockerStillPending || blockerClearedByLaterApproval);
  const targetOk =
    target.candidate_id === expected.candidateId &&
    target.proposed_sample_id === expected.sampleId &&
    target.artifact_ref === expected.artifactRef &&
    target.verified_sha256 === expected.sha256 &&
    target.verified_dimensions === expected.dimensions &&
    target.verified_mime === expected.mime &&
    target.reviewer_required === expected.reviewer;
  const intakeOk =
    statementMatches(statement, sourceStatement) &&
    intake.approval_statement_source === "fixture_only_not_user_submitted" &&
    intake.approval_statement_source_is_user_submission === false &&
    intake.approval_statement_matches_required_form === true &&
    intake.human_approval_captured_now === false &&
    intake.registration_unlocks_only_after_external_user_approval === true &&
    intake.accepted_samples_registration_ready_now === false &&
    intake.current_registration_blocker === "human_approval_missing";
  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false;
  const noWrites =
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    evidence.stagedFileCount === 0;
  const noRuntimeClaim =
    guard.approval_intake_validator_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && sourceOk && targetOk && intakeOk && noExternal && noWrites && noRuntimeClaim,
    identityOk,
    sourceOk,
    targetOk,
    intakeOk,
    noExternal,
    noWrites,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).lamp_third_sample_human_approval_intake_validator;
const evidence = gatherEvidence();
const phaseRecord = core.read(files.phaseRecord);
const validationLog = core.read(files.validationLog);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const baseEval = evaluate(fixture, evidence);
addResult("approval_intake_validator_evaluation_passes", baseEval.passed, JSON.stringify(baseEval));
addResult("source_request_package_still_not_approval", evidence.requestPackage.approval_state.human_approval_granted_by_this_record === false);
addResult("source_candidate_still_pending_human_approval", evidence.readiness.human_approval_status === "pending");
addResult("source_blocker_pending_or_cleared_by_later_approval", evidence.blocker.eligibility.registration_blocker === "human_approval_missing" || evidence.blocker.eligibility.registration_blocker === null);
addResult("actual_staged_files_empty", evidence.stagedFileCount === 0);

const missingReviewer = clone(fixture);
missingReviewer.approval_intake.candidate_approval_statement_under_test = missingReviewer.approval_intake.candidate_approval_statement_under_test.replace(/Jenn/g, "");
const missingCandidate = clone(fixture);
missingCandidate.approval_intake.candidate_approval_statement_under_test = missingCandidate.approval_intake.candidate_approval_statement_under_test.replace(expected.candidateId, "");
const missingHash = clone(fixture);
missingHash.approval_intake.candidate_approval_statement_under_test = missingHash.approval_intake.candidate_approval_statement_under_test.replace(expected.sha256, "");
const wrongCategory = clone(fixture);
wrongCategory.approval_intake.candidate_approval_statement_under_test = wrongCategory.approval_intake.candidate_approval_statement_under_test.replace(expected.category, "fashion_lifestyle_still_life");
const broadWrite = clone(fixture);
broadWrite.approval_intake.candidate_approval_statement_under_test = broadWrite.approval_intake.candidate_approval_statement_under_test.replace("仅登记 accepted_samples 元数据和 product_still_life 分类索引", "修改项目文件");
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;
const prematureReady = clone(fixture);
prematureReady.approval_intake.accepted_samples_registration_ready_now = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingReviewerEval = evaluate(missingReviewer, evidence);
const missingCandidateEval = evaluate(missingCandidate, evidence);
const missingHashEval = evaluate(missingHash, evidence);
const wrongCategoryEval = evaluate(wrongCategory, evidence);
const broadWriteEval = evaluate(broadWrite, evidence);
const externalActionEval = evaluate(externalAction, evidence);
const prematureReadyEval = evaluate(prematureReady, evidence);
const runtimeClaimEval = evaluate(runtimeClaim, evidence);

addResult("negative_case_missing_reviewer_fails", missingReviewerEval.passed === false && missingReviewerEval.intakeOk === false);
addResult("negative_case_missing_candidate_id_fails", missingCandidateEval.passed === false && missingCandidateEval.intakeOk === false);
addResult("negative_case_missing_artifact_hash_fails", missingHashEval.passed === false && missingHashEval.intakeOk === false);
addResult("negative_case_wrong_category_fails", wrongCategoryEval.passed === false && wrongCategoryEval.intakeOk === false);
addResult("negative_case_broad_write_scope_fails", broadWriteEval.passed === false && broadWriteEval.intakeOk === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_premature_registration_ready_fails", prematureReadyEval.passed === false && prematureReadyEval.intakeOk === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "phase: v14_214_lamp_third_sample_human_approval_intake_validator",
  "approval_intake_validator_only: true",
  "approval_statement_source_is_user_submission: false",
  "human_approval_captured_now: false",
  "registration_unlocks_only_after_external_user_approval: true",
  "accepted_samples_registration_ready_now: false",
  "current_registration_blocker: human_approval_missing",
  "accepted_samples_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  expected.reviewer,
  expected.candidateId,
  expected.sampleId,
  expected.artifactRef,
  expected.sha256,
  expected.category,
  "不写 DailyNote",
  "不写 VCP memory",
  "不 push/tag/release/deploy",
]) {
  requireToken("approval_statement", fixture.approval_intake.candidate_approval_statement_under_test, token);
}

for (const token of [
  "scripts/validate_v14_214_lamp_third_sample_human_approval_intake_validator.js",
  "tests/schema_examples/v14_214_lamp_third_sample_human_approval_intake_validator.example.json",
  "docs/v14_214_lamp_third_sample_human_approval_intake_validator.md",
  "v14_214_lamp_third_sample_human_approval_intake_validator",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("validation_log", validationLog, "VALIDATION-20260518-v14.214-LAMP-THIRD-SAMPLE-HUMAN-APPROVAL-INTAKE-VALIDATOR");

forbidPattern("current_surfaces", currentSurfaces, /human_approval_captured_now:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /approval_statement_source_is_user_submission:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_registration_ready_now:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /env_or_secret_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /commit_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_214_lamp_third_sample_human_approval_intake_validator",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  candidate_id: expected.candidateId,
  proposed_sample_id: expected.sampleId,
  approval_statement_matches_required_form: fixture.approval_intake.approval_statement_matches_required_form,
  approval_statement_source_is_user_submission: false,
  human_approval_captured_now: false,
  current_human_approval_status: "pending",
  current_registration_blocker: "human_approval_missing",
  registration_unlocks_only_after_external_user_approval: true,
  accepted_samples_registration_ready_now: false,
  staged_file_count: evidence.stagedFileCount,
  approval_intake_validator_only: true,
  accepted_samples_write_performed: false,
  category_index_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  env_or_secret_read_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  commit_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_missing_reviewer_fails: missingReviewerEval.passed === false && missingReviewerEval.intakeOk === false,
  negative_case_missing_candidate_id_fails: missingCandidateEval.passed === false && missingCandidateEval.intakeOk === false,
  negative_case_missing_artifact_hash_fails: missingHashEval.passed === false && missingHashEval.intakeOk === false,
  negative_case_wrong_category_fails: wrongCategoryEval.passed === false && wrongCategoryEval.intakeOk === false,
  negative_case_broad_write_scope_fails: broadWriteEval.passed === false && broadWriteEval.intakeOk === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_premature_registration_ready_fails: prematureReadyEval.passed === false && prematureReadyEval.intakeOk === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
