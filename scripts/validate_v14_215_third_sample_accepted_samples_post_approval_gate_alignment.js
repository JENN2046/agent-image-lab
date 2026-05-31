#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_215_third_sample_accepted_samples_post_approval_gate_alignment.md",
  fixture: "tests/schema_examples/v14_215_third_sample_accepted_samples_post_approval_gate_alignment.example.json",
  readiness: "tests/schema_examples/v14_166_lamp_v3_generated_candidate_readiness.example.json",
  blockerPreflight: "tests/schema_examples/v14_167_lamp_v3_accepted_samples_registration_blocker_preflight.example.json",
  requestPackage: "tests/schema_examples/v14_213_lamp_third_sample_human_approval_request_package.example.json",
  intakeValidator: "scripts/validate_v14_214_lamp_third_sample_human_approval_intake_validator.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const expected = {
  phase: "v14_215_third_sample_accepted_samples_post_approval_gate_alignment",
  candidateId: "v14_166_lamp_v3_generated_candidate_001",
  sampleId: "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  category: "product_still_life",
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

function runNode(relativePath) {
  return JSON.parse(childProcess.execFileSync("node", [relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }));
}

function runGit(args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function currentBoardBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function gatherEvidence() {
  const readiness = core.parseJson(files.readiness).lamp_v3_generated_candidate_readiness;
  const blocker = core.parseJson(files.blockerPreflight).lamp_v3_accepted_samples_registration_blocker_preflight;
  const request = core.parseJson(files.requestPackage).lamp_third_sample_human_approval_request_package;
  const intake = runNode(files.intakeValidator);
  return {
    readiness,
    blocker,
    request,
    intake,
    stagedFileCount: lines(runGit(["diff", "--cached", "--name-only"])).length,
  };
}

function evaluate(input, evidence) {
  const target = input.target || {};
  const gate = input.gate || {};
  const guard = input.guard || {};
  const allowedFiles = input.future_allowed_files_after_approval || [];
  const required = input.future_required_before_write || [];

  const identityOk =
    input.phase === expected.phase &&
    input.execution_mode === "post_approval_gate_alignment_only";
  const blockerStillPending = evidence.blocker.eligibility.registration_blocker === "human_approval_missing";
  const blockerClearedByLaterApproval =
    evidence.blocker.eligibility.human_approval_present === true &&
    evidence.blocker.eligibility.accepted_samples_registration_eligible === true &&
    evidence.blocker.eligibility.registration_blocker === null;

  const sourceOk =
    input.source_refs?.readiness === files.readiness &&
    input.source_refs?.blocker_preflight === files.blockerPreflight &&
    input.source_refs?.approval_request_package === files.requestPackage &&
    input.source_refs?.approval_intake_validator === files.intakeValidator &&
    evidence.readiness.human_approval_status === "pending" &&
    (blockerStillPending || blockerClearedByLaterApproval) &&
    evidence.request.approval_state.human_approval_granted_by_this_record === false &&
    evidence.intake.passed === true &&
    evidence.intake.approval_statement_matches_required_form === true &&
    evidence.intake.approval_statement_source_is_user_submission === false &&
    evidence.intake.human_approval_captured_now === false &&
    evidence.intake.accepted_samples_registration_ready_now === false;

  const targetOk =
    target.candidate_id === expected.candidateId &&
    target.proposed_sample_id === expected.sampleId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.verified_sha256 === expected.sha256 &&
    target.verified_dimensions === expected.dimensions &&
    target.verified_mime === expected.mime;

  const gateOk =
    gate.gate_status === "blocked" &&
    gate.blocker === "human_approval_missing" &&
    gate.approval_statement_matches_required_form === true &&
    gate.approval_statement_source_is_user_submission === false &&
    gate.human_approval_captured_now === false &&
    gate.registration_unlocks_only_after_external_user_approval === true &&
    gate.accepted_samples_registration_ready_now === false &&
    gate.future_registration_requires_v14_214_user_submission === true;

  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/product_still_life.yaml") &&
    !allowedFiles.includes("accepted_samples/") &&
    required.includes("v14.214 intake validator reports approval_statement_source_is_user_submission=true") &&
    required.includes("v14.214 intake validator reports human_approval_captured_now=true") &&
    required.includes("no image copy, no runs source image modification, no production_candidate, no failure_samples, no DailyNote, no VCP memory");

  const noWrites =
    guard.post_approval_gate_alignment_only === true &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false &&
    evidence.stagedFileCount === 0;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && sourceOk && targetOk && gateOk && scopeOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    sourceOk,
    targetOk,
    gateOk,
    scopeOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).third_sample_accepted_samples_post_approval_gate_alignment;
const evidence = gatherEvidence();
const phaseRecord = core.read(files.phaseRecord);
const validationLog = core.exists(files.validationLog) ? core.read(files.validationLog) : "";
const currentSurfaces = [
  Object.values(files).join("\n"),
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(fixture, evidence);
addResult("post_approval_gate_alignment_evaluation_passes", baseEval.passed, JSON.stringify(baseEval));
addResult("v14_214_intake_validator_still_passes", evidence.intake.passed === true);
addResult("v14_214_intake_still_not_user_submission", evidence.intake.approval_statement_source_is_user_submission === false);
addResult("v14_214_intake_still_no_human_approval", evidence.intake.human_approval_captured_now === false);
addResult("current_lamp_blocker_pending_or_cleared_by_later_approval", evidence.blocker.eligibility.registration_blocker === "human_approval_missing" || evidence.blocker.eligibility.registration_blocker === null);
addResult("actual_staged_files_empty", evidence.stagedFileCount === 0);

const missingV14Requirement = clone(fixture);
missingV14Requirement.future_required_before_write = missingV14Requirement.future_required_before_write.filter((item) => !item.includes("approval_statement_source_is_user_submission"));
const userSubmissionOverclaim = clone(fixture);
userSubmissionOverclaim.gate.approval_statement_source_is_user_submission = true;
const humanApprovalOverclaim = clone(fixture);
humanApprovalOverclaim.gate.human_approval_captured_now = true;
const registrationReadyOverclaim = clone(fixture);
registrationReadyOverclaim.gate.accepted_samples_registration_ready_now = true;
const broadAllowedFiles = clone(fixture);
broadAllowedFiles.future_allowed_files_after_approval.push("accepted_samples/");
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingV14RequirementEval = evaluate(missingV14Requirement, evidence);
const userSubmissionOverclaimEval = evaluate(userSubmissionOverclaim, evidence);
const humanApprovalOverclaimEval = evaluate(humanApprovalOverclaim, evidence);
const registrationReadyOverclaimEval = evaluate(registrationReadyOverclaim, evidence);
const broadAllowedFilesEval = evaluate(broadAllowedFiles, evidence);
const acceptedWriteEval = evaluate(acceptedWrite, evidence);
const externalActionEval = evaluate(externalAction, evidence);
const runtimeClaimEval = evaluate(runtimeClaim, evidence);

addResult("negative_case_missing_v14_214_requirement_fails", missingV14RequirementEval.passed === false && missingV14RequirementEval.scopeOk === false);
addResult("negative_case_user_submission_overclaim_fails", userSubmissionOverclaimEval.passed === false && userSubmissionOverclaimEval.gateOk === false);
addResult("negative_case_human_approval_overclaim_fails", humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.gateOk === false);
addResult("negative_case_registration_ready_overclaim_fails", registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.gateOk === false);
addResult("negative_case_broad_allowed_files_fails", broadAllowedFilesEval.passed === false && broadAllowedFilesEval.scopeOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "phase: v14_215_third_sample_accepted_samples_post_approval_gate_alignment",
  "gate_status: blocked",
  "blocker: human_approval_missing",
  "approval_statement_source_is_user_submission: false",
  "human_approval_captured_now: false",
  "accepted_samples_registration_ready_now: false",
  "post_approval_gate_alignment_only: true",
  "accepted_samples_write_performed: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_215_third_sample_accepted_samples_post_approval_gate_alignment.js",
  "tests/schema_examples/v14_215_third_sample_accepted_samples_post_approval_gate_alignment.example.json",
  "docs/v14_215_third_sample_accepted_samples_post_approval_gate_alignment.md",
  "v14_215_third_sample_accepted_samples_post_approval_gate_alignment",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

for (const pattern of [
  /approval_statement_source_is_user_submission:\s+true/i,
  /human_approval_captured_now:\s+true/i,
  /accepted_samples_registration_ready_now:\s+true/i,
  /accepted_samples_write_performed:\s+true/i,
  /category_index_write_performed:\s+true/i,
  /provider_contact_performed:\s+true/i,
  /plugin_call_performed:\s+true/i,
  /api_call_performed:\s+true/i,
  /mcp_runtime_performed:\s+true/i,
  /image_generation_performed:\s+true/i,
  /env_or_secret_read_performed:\s+true/i,
  /real_manifest_read_performed:\s+true/i,
  /real_vcpchat_read_performed:\s+true/i,
  /real_vcptoolbox_read_performed:\s+true/i,
  /vcp_runtime_integration_proven:\s+true/i,
]) {
  forbidPattern("current_surfaces", currentSurfaces, pattern);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_215_third_sample_accepted_samples_post_approval_gate_alignment",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  candidate_id: fixture.target.candidate_id,
  proposed_sample_id: fixture.target.proposed_sample_id,
  gate_status: fixture.gate.gate_status,
  current_registration_blocker: fixture.gate.blocker,
  v14_214_intake_validator_passed: evidence.intake.passed === true,
  approval_statement_source_is_user_submission: fixture.gate.approval_statement_source_is_user_submission,
  human_approval_captured_now: fixture.gate.human_approval_captured_now,
  accepted_samples_registration_ready_now: fixture.gate.accepted_samples_registration_ready_now,
  future_registration_requires_v14_214_user_submission: fixture.gate.future_registration_requires_v14_214_user_submission,
  staged_file_count: evidence.stagedFileCount,
  post_approval_gate_alignment_only: fixture.guard.post_approval_gate_alignment_only,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  category_index_write_performed: fixture.guard.category_index_write_performed,
  failure_samples_write_performed: fixture.guard.failure_samples_write_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  mcp_runtime_performed: fixture.guard.mcp_runtime_performed,
  image_generation_performed: fixture.guard.image_generation_performed,
  env_or_secret_read_performed: fixture.guard.env_or_secret_read_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  commit_performed: fixture.guard.commit_performed,
  push_tag_release_deploy_performed: fixture.guard.push_tag_release_deploy_performed,
  artifact_recoverability_is_not_vcp_runtime_integration: fixture.guard.artifact_recoverability_is_not_vcp_runtime_integration,
  vcp_runtime_integration_proven: fixture.guard.vcp_runtime_integration_proven,
  negative_case_missing_v14_214_requirement_fails: missingV14RequirementEval.passed === false && missingV14RequirementEval.scopeOk === false,
  negative_case_user_submission_overclaim_fails: userSubmissionOverclaimEval.passed === false && userSubmissionOverclaimEval.gateOk === false,
  negative_case_human_approval_overclaim_fails: humanApprovalOverclaimEval.passed === false && humanApprovalOverclaimEval.gateOk === false,
  negative_case_registration_ready_overclaim_fails: registrationReadyOverclaimEval.passed === false && registrationReadyOverclaimEval.gateOk === false,
  negative_case_broad_allowed_files_fails: broadAllowedFilesEval.passed === false && broadAllowedFilesEval.scopeOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  validation_log_mentions_phase: validationLog.includes("v14.215") || validationLog.includes("V14.215"),
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
