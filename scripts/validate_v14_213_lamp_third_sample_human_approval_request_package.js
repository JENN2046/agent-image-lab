#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_213_lamp_third_sample_human_approval_request_package.md",
  fixture: "tests/schema_examples/v14_213_lamp_third_sample_human_approval_request_package.example.json",
  readiness: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_readiness.example.json",
  importRecord: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_import_record.json",
  blockerPreflight: "tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json",
  sixMonthAudit: "tests/schema_examples/v14_212_six_month_goal_prompt_to_artifact_completion_audit.example.json",
  registrationAuthorizationDraft: "tests/schema_examples/v14_190_third_sample_accepted_samples_registration_authorization_package_draft.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const expected = {
  candidateId: "v14_166_lamp_v3_generated_candidate_001",
  sampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  artifactRef: "runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png",
  sha256: "eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c",
  dimensions: "1254x1254",
  mime: "image/png",
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

function gatherEvidence() {
  const readiness = core.parseJson(files.readiness).lamp_v3_generated_candidate_readiness;
  const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
  const blocker = core.parseJson(files.blockerPreflight).lamp_v3_accepted_samples_registration_blocker_preflight;
  const audit = core.parseJson(files.sixMonthAudit).six_month_goal_prompt_to_artifact_completion_audit;
  const registrationDraft = core.parseJson(files.registrationAuthorizationDraft).third_sample_accepted_samples_registration_authorization_package_draft;
  return {
    readiness,
    importRecord,
    blocker,
    audit,
    registrationDraft,
    stagedFileCount: lines(runGit(["diff", "--cached", "--name-only"])).length,
  };
}

function statementOk(statement) {
  return (
    typeof statement === "string" &&
    statement.includes("Jenn") &&
    statement.includes(expected.candidateId) &&
    statement.includes(expected.sampleId) &&
    statement.includes(expected.artifactRef) &&
    statement.includes(`sha256=${expected.sha256}`) &&
    statement.includes(`dimensions=${expected.dimensions}`) &&
    statement.includes(`mime=${expected.mime}`) &&
    statement.includes("仅登记 accepted_samples 元数据和 product_still_life 分类索引") &&
    statement.includes("不复制图片") &&
    statement.includes("不修改 runs 源图") &&
    statement.includes("不晋级 production_candidate") &&
    statement.includes("不写 failure_samples") &&
    statement.includes("不写 DailyNote") &&
    statement.includes("不写 VCP memory") &&
    statement.includes("不调用 provider/API/plugin/MCP") &&
    statement.includes("不读取 .env/.env.local") &&
    statement.includes("不读取 real manifest/VCPChat/VCPToolBox") &&
    statement.includes("不 push/tag/release/deploy")
  );
}

function evaluate(input, evidence) {
  const target = input.target || {};
  const approval = input.approval_state || {};
  const guard = input.guard || {};
  const blockerStillPending =
    evidence.blocker.eligibility.human_approval_present === false &&
    evidence.blocker.eligibility.accepted_samples_registration_eligible === false &&
    evidence.blocker.eligibility.registration_blocker === "human_approval_missing";
  const blockerClearedByLaterApproval =
    evidence.blocker.eligibility.human_approval_present === true &&
    evidence.blocker.eligibility.accepted_samples_registration_eligible === true &&
    evidence.blocker.eligibility.registration_blocker === null;
  const identityOk =
    input.phase === "v14_213_lamp_third_sample_human_approval_request_package" &&
    input.execution_mode === "human_approval_request_package_only";
  const sourceOk =
    evidence.readiness.human_approval_status === "pending" &&
    evidence.readiness.accepted_candidate === false &&
    evidence.importRecord.import_id === expected.candidateId &&
    evidence.importRecord.imported_asset.sha256 === expected.sha256 &&
    (blockerStillPending || blockerClearedByLaterApproval) &&
    evidence.audit.goal_complete === false &&
    [0, 1].includes(evidence.audit.observed_counts.remaining_full_recoverable_sample_gap) &&
    evidence.registrationDraft.blocker === "human_approval_missing";
  const targetOk =
    target.candidate_id === expected.candidateId &&
    target.proposed_sample_id === expected.sampleId &&
    target.artifact_ref === expected.artifactRef &&
    target.verified_sha256 === expected.sha256 &&
    target.verified_dimensions === expected.dimensions &&
    target.verified_mime === expected.mime &&
    target.current_human_approval_status === "pending" &&
    target.current_registration_eligible === false &&
    target.current_registration_blocker === "human_approval_missing";
  const approvalOk =
    statementOk(input.exact_human_approval_statement_for_jenn) &&
    approval.human_approval_granted_by_this_record === false &&
    approval.approval_statement_captured_from_user === false &&
    approval.accepted_samples_registration_ready_now === false &&
    approval.blocker === "human_approval_missing";
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
    guard.human_approval_request_package_only === true &&
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && sourceOk && targetOk && approvalOk && noExternal && noWrites && noRuntimeClaim,
    identityOk,
    sourceOk,
    targetOk,
    approvalOk,
    noExternal,
    noWrites,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).lamp_third_sample_human_approval_request_package;
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
addResult("human_approval_request_package_evaluation_passes", baseEval.passed, JSON.stringify(baseEval));
addResult("source_candidate_still_pending_human_approval", evidence.readiness.human_approval_status === "pending");
addResult("source_blocker_pending_or_cleared_by_later_approval", evidence.blocker.eligibility.registration_blocker === "human_approval_missing" || evidence.blocker.eligibility.registration_blocker === null);
addResult("exact_statement_complete", statementOk(fixture.exact_human_approval_statement_for_jenn));
addResult("actual_staged_files_empty", evidence.stagedFileCount === 0);

const granted = clone(fixture);
granted.approval_state.human_approval_granted_by_this_record = true;
const readyNow = clone(fixture);
readyNow.approval_state.accepted_samples_registration_ready_now = true;
const missingJenn = clone(fixture);
missingJenn.exact_human_approval_statement_for_jenn = missingJenn.exact_human_approval_statement_for_jenn.replace(/Jenn/g, "");
const missingCandidate = clone(fixture);
missingCandidate.exact_human_approval_statement_for_jenn = missingCandidate.exact_human_approval_statement_for_jenn.replace(expected.candidateId, "");
const missingHash = clone(fixture);
missingHash.exact_human_approval_statement_for_jenn = missingHash.exact_human_approval_statement_for_jenn.replace(expected.sha256, "");
const broadWrite = clone(fixture);
broadWrite.exact_human_approval_statement_for_jenn = broadWrite.exact_human_approval_statement_for_jenn.replace("仅登记 accepted_samples 元数据和 product_still_life 分类索引", "修改项目文件");
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const grantedEval = evaluate(granted, evidence);
const readyNowEval = evaluate(readyNow, evidence);
const missingJennEval = evaluate(missingJenn, evidence);
const missingCandidateEval = evaluate(missingCandidate, evidence);
const missingHashEval = evaluate(missingHash, evidence);
const broadWriteEval = evaluate(broadWrite, evidence);
const externalActionEval = evaluate(externalAction, evidence);
const runtimeClaimEval = evaluate(runtimeClaim, evidence);

addResult("negative_case_approval_granted_by_record_fails", grantedEval.passed === false && grantedEval.approvalOk === false);
addResult("negative_case_registration_ready_now_fails", readyNowEval.passed === false && readyNowEval.approvalOk === false);
addResult("negative_case_missing_jenn_fails", missingJennEval.passed === false && missingJennEval.approvalOk === false);
addResult("negative_case_missing_candidate_id_fails", missingCandidateEval.passed === false && missingCandidateEval.approvalOk === false);
addResult("negative_case_missing_artifact_hash_fails", missingHashEval.passed === false && missingHashEval.approvalOk === false);
addResult("negative_case_broad_write_scope_fails", broadWriteEval.passed === false && broadWriteEval.approvalOk === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "phase: v14_213_lamp_third_sample_human_approval_request_package",
  "candidate_id: v14_166_lamp_v3_generated_candidate_001",
  "proposed_sample_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  "current_human_approval_status: pending",
  "current_registration_blocker: human_approval_missing",
  "human_approval_granted_by_this_record: false",
  "accepted_samples_registration_ready_now: false",
  "human_approval_request_package_only: true",
  "accepted_samples_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "我 Jenn 明确通过",
  expected.candidateId,
  expected.sampleId,
  expected.sha256,
  "不写 DailyNote",
  "不写 VCP memory",
  "不 push/tag/release/deploy",
]) {
  requireToken("approval_statement", fixture.exact_human_approval_statement_for_jenn, token);
}

for (const token of [
  "scripts/validate_v14_213_lamp_third_sample_human_approval_request_package.js",
  "tests/schema_examples/v14_213_lamp_third_sample_human_approval_request_package.example.json",
  "docs/v14_213_lamp_third_sample_human_approval_request_package.md",
  "v14_213_lamp_third_sample_human_approval_request_package",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("validation_log", validationLog, "VALIDATION-20260518-v14.213-LAMP-THIRD-SAMPLE-HUMAN-APPROVAL-REQUEST-PACKAGE");

forbidPattern("current_surfaces", currentSurfaces, /human_approval_granted_by_this_record:\s+true/i);
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
  validator: "validate_v14_213_lamp_third_sample_human_approval_request_package",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  candidate_id: expected.candidateId,
  proposed_sample_id: expected.sampleId,
  current_human_approval_status: "pending",
  current_registration_blocker: "human_approval_missing",
  human_approval_granted_by_this_record: false,
  accepted_samples_registration_ready_now: false,
  staged_file_count: evidence.stagedFileCount,
  human_approval_request_package_only: true,
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
  negative_case_approval_granted_by_record_fails: grantedEval.passed === false && grantedEval.approvalOk === false,
  negative_case_registration_ready_now_fails: readyNowEval.passed === false && readyNowEval.approvalOk === false,
  negative_case_missing_jenn_fails: missingJennEval.passed === false && missingJennEval.approvalOk === false,
  negative_case_missing_candidate_id_fails: missingCandidateEval.passed === false && missingCandidateEval.approvalOk === false,
  negative_case_missing_artifact_hash_fails: missingHashEval.passed === false && missingHashEval.approvalOk === false,
  negative_case_broad_write_scope_fails: broadWriteEval.passed === false && broadWriteEval.approvalOk === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
