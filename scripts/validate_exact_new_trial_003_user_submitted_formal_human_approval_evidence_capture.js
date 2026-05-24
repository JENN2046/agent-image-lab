#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_55_EXACT_NEW_TRIAL_003_USER_SUBMITTED_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.json",
  evidence: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture_fail.example.json",
  sourcePacket: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_ingestion_packet.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture",
  sourcePhase: "v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  reviewer: "Jenn",
  localDate: "2026-05-24",
  evidenceRef: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  nextScope: "accepted_samples_metadata_registration_only",
  recommendedNext: "execute_exact_new_trial_003_accepted_samples_metadata_registration_only"
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

function commonChecks(record) {
  const target = record.target || {};
  const evidence = record.approval_evidence || {};
  const state = record.current_capture_state || {};
  const guard = record.guard || {};
  return (
    record.version === "v1" &&
    record.phase === expected.phase &&
    record.status === "completed_validated_user_submitted_formal_human_approval_evidence_captured_pending_accepted_sample_registration" &&
    record.execution_mode === "user_submitted_formal_human_approval_evidence_capture_only" &&
    record.lane === "Amber_E_production_metadata_evidence_capture" &&
    record.evidence_ref === expected.evidenceRef &&
    record.source_phase === expected.sourcePhase &&
    target.candidate_id === expected.candidateId &&
    target.sample_id === expected.sampleId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.artifact_sha256 === expected.sha256 &&
    target.dimensions === expected.dimensions &&
    target.mime === expected.mime &&
    target.reviewer_required === expected.reviewer &&
    evidence.submitted_by === expected.reviewer &&
    evidence.submitted_at_local_date === expected.localDate &&
    evidence.capture_source === "current_user_message" &&
    evidence.approval_statement_source_is_user_submission === true &&
    evidence.accepted_sample_registration_explicitly_allowed_next === true &&
    evidence.archive_write_explicitly_not_included === true &&
    evidence.production_write_explicitly_not_included === true &&
    evidence.DailyNote_write_explicitly_not_included === true &&
    evidence.VCP_memory_write_explicitly_not_included === true &&
    state.approval_submission_present_now === true &&
    state.approval_statement_text_present_now === true &&
    state.formal_human_approval_status === "captured" &&
    state.formal_human_approval_captured_now === true &&
    state.accepted_samples_registration_ready_now === true &&
    state.registration_unlock_allowed_now === true &&
    state.next_write_action_allowed_now === true &&
    state.next_write_scope === expected.nextScope &&
    state.current_blocker === null &&
    guard.approval_evidence_fabricated === false &&
    guard.accepted_samples_write_performed === false &&
    guard.archive_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.secret_value_read_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    record.recommended_next === expected.recommendedNext &&
    record.recommended_next_auto_execution_allowed === "true_exact_scope_accepted_samples_metadata_registration_only"
  );
}

function validateEvidence(evidenceRecord, context) {
  const target = evidenceRecord.target || {};
  const claims = evidenceRecord.approval_claims || {};
  const state = evidenceRecord.current_capture_state || {};
  const routing = evidenceRecord.routing_decision || {};
  assert(evidenceRecord.phase === expected.phase, `${context} evidence phase mismatch`);
  assert(evidenceRecord.source_phase === expected.sourcePhase, `${context} evidence source phase mismatch`);
  assert(evidenceRecord.evidence_type === "user_submitted_formal_human_approval", `${context} evidence type mismatch`);
  assert(evidenceRecord.capture_source === "current_user_message", `${context} capture source mismatch`);
  assert(evidenceRecord.submitted_by === expected.reviewer, `${context} submitted_by mismatch`);
  assert(evidenceRecord.submitted_at_local_date === expected.localDate, `${context} submitted_at date mismatch`);
  assert(target.candidate_id === expected.candidateId, `${context} candidate mismatch`);
  assert(target.sample_id === expected.sampleId, `${context} sample mismatch`);
  assert(target.artifact_sha256 === expected.sha256, `${context} artifact hash mismatch`);
  assert(claims.approver === expected.reviewer, `${context} claim approver mismatch`);
  assert(claims.candidate === expected.candidateId, `${context} claim candidate mismatch`);
  assert(claims.sample_id === expected.sampleId, `${context} claim sample mismatch`);
  assert(claims.artifact_hash === expected.sha256, `${context} claim hash mismatch`);
  assert(claims.accepted_sample_registration_explicitly_allowed_next === true, `${context} accepted-sample registration grant missing`);
  assert(claims.archive_write_explicitly_not_included === true, `${context} archive boundary missing`);
  assert(claims.production_write_explicitly_not_included === true, `${context} production boundary missing`);
  assert(claims.DailyNote_write_explicitly_not_included === true, `${context} DailyNote boundary missing`);
  assert(claims.VCP_memory_write_explicitly_not_included === true, `${context} VCP memory boundary missing`);
  assert(state.next_write_scope === expected.nextScope, `${context} next write scope mismatch`);
  assert(routing.next_safe_task === expected.recommendedNext, `${context} next task mismatch`);
  assert(routing.accepted_samples_metadata_registration_allowed_next === true, `${context} registration not allowed next`);
  assert(routing.archive_or_memory_allowed_next === false, `${context} archive or memory must remain blocked`);
}

function validateRecord(record, evidenceRecord, context) {
  assert(record && typeof record === "object", `${context} record missing`);
  assert(evidenceRecord && typeof evidenceRecord === "object", `${context} evidence missing`);
  assertNoRawLocalDrivePath(record, `${context}.record`);
  assertNoRawLocalDrivePath(evidenceRecord, `${context}.evidence`);
  assert(commonChecks(record), `${context} common checks failed`);
  validateEvidence(evidenceRecord, context);
}

function expectFailure(baseRecord, baseEvidence, caseId, mutate) {
  const record = clone(baseRecord);
  const evidenceRecord = clone(baseEvidence);
  mutate(record, evidenceRecord);
  try {
    validateRecord(record, evidenceRecord, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture;
  const evidenceRecord = readJson(files.evidence).user_submitted_formal_human_approval_evidence;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture;
  const sourcePacket = readJson(files.sourcePacket).formal_human_approval_evidence_ingestion_packet;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "submitted_by: Jenn",
    "approval_submission_present_now: true",
    "approval_statement_source_is_user_submission: true",
    "formal_human_approval_captured_now: true",
    "next_write_scope: accepted_samples_metadata_registration_only",
    "archive_write_performed: false",
    "DailyNote_write_performed: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture.js"),
    "validate_mvp missing user-submitted formal human approval evidence capture validator"
  );
  assert(sourcePacket.phase === expected.sourcePhase, "source packet phase mismatch");
  assert(sourcePacket.current_ingestion_state.approval_submission_present_now === false, "source packet must remain pending before v0.6.55");
  assert(sourcePacket.current_ingestion_state.next_write_action_allowed_now === false, "source packet must keep writes locked before v0.6.55");

  validateRecord(report, evidenceRecord, "report");
  validateRecord(passFixture, evidenceRecord, "pass_fixture");

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, evidenceRecord, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, evidenceRecord, "wrong_reviewer_fails", (record, evidence) => {
      record.approval_evidence.submitted_by = "NotJenn";
      evidence.submitted_by = "NotJenn";
    }),
    expectFailure(passFixture, evidenceRecord, "wrong_sample_id_fails", (record, evidence) => {
      record.target.sample_id = "wrong_sample";
      evidence.target.sample_id = "wrong_sample";
    }),
    expectFailure(passFixture, evidenceRecord, "wrong_artifact_hash_fails", (record, evidence) => {
      record.target.artifact_sha256 = "wrong_hash";
      evidence.target.artifact_sha256 = "wrong_hash";
    }),
    expectFailure(passFixture, evidenceRecord, "non_user_submission_source_fails", (record, evidence) => {
      record.approval_evidence.approval_statement_source_is_user_submission = false;
      evidence.capture_source = "fixture";
    }),
    expectFailure(passFixture, evidenceRecord, "formal_approval_not_captured_fails", (record, evidence) => {
      record.current_capture_state.formal_human_approval_captured_now = false;
      evidence.current_capture_state.formal_human_approval_captured_now = false;
    }),
    expectFailure(passFixture, evidenceRecord, "wrong_next_scope_fails", (record, evidence) => {
      record.current_capture_state.next_write_scope = "archive_write";
      evidence.current_capture_state.next_write_scope = "archive_write";
    }),
    expectFailure(passFixture, evidenceRecord, "accepted_samples_write_already_performed_fails", (record, evidence) => {
      record.guard.accepted_samples_write_performed = true;
      evidence.guard.accepted_samples_write_performed = true;
    }),
    expectFailure(passFixture, evidenceRecord, "archive_write_flag_fails", (record, evidence) => {
      record.guard.archive_write_performed = true;
      evidence.guard.archive_write_performed = true;
    }),
    expectFailure(passFixture, evidenceRecord, "memory_write_flag_fails", (record, evidence) => {
      record.guard.DailyNote_write_performed = true;
      evidence.guard.VCP_memory_write_performed = true;
    }),
    expectFailure(passFixture, evidenceRecord, "provider_or_image_flag_fails", (record, evidence) => {
      record.guard.provider_contact_performed = true;
      evidence.guard.image_generation_performed = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    source_phase: report.source_phase,
    target_candidate_id: report.target.candidate_id,
    target_sample_id: report.target.sample_id,
    required_reviewer: report.target.reviewer_required,
    submitted_by: report.approval_evidence.submitted_by,
    artifact_sha256: report.target.artifact_sha256,
    approval_submission_present_now: report.current_capture_state.approval_submission_present_now,
    approval_statement_source_is_user_submission: report.approval_evidence.approval_statement_source_is_user_submission,
    formal_human_approval_captured_now: report.current_capture_state.formal_human_approval_captured_now,
    accepted_samples_registration_ready_now: report.current_capture_state.accepted_samples_registration_ready_now,
    next_write_action_allowed_now: report.current_capture_state.next_write_action_allowed_now,
    next_write_scope: report.current_capture_state.next_write_scope,
    accepted_samples_write_performed: report.guard.accepted_samples_write_performed,
    archive_write_performed: report.guard.archive_write_performed,
    production_candidate_write_performed: report.guard.production_candidate_write_performed,
    DailyNote_write_performed: report.guard.DailyNote_write_performed,
    VCP_memory_write_performed: report.guard.VCP_memory_write_performed,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
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
