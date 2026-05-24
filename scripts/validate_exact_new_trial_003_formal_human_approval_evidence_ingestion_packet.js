#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_54_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_INGESTION_PACKET.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet.json",
  packet: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_ingestion_packet.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_formal_human_approval_evidence_ingestion_packet.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_formal_human_approval_evidence_ingestion_packet_fail.example.json",
  sourceSurface: "reports/visual_asset_eval_dry_run/v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel.json",
  sourceEvidencePacket: "reports/visual_asset_eval_dry_run/v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet",
  sourcePhase: "v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel",
  sourceEvidencePacketPhase: "v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  reviewer: "Jenn",
  packetRef: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_ingestion_packet.json",
  recommendedNext: "await_user_submitted_jenn_formal_approval_before_any_accepted_sample_registration"
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
  const state = record.current_ingestion_state || {};
  const guard = record.guard || {};
  return (
    record.version === "v1" &&
    record.phase === expected.phase &&
    record.status === "completed_validated_local_ingestion_packet_blocked_on_user_submitted_jenn_approval" &&
    record.execution_mode === "formal_human_approval_evidence_ingestion_packet_only" &&
    record.packet_ref === expected.packetRef &&
    record.source_phase === expected.sourcePhase &&
    record.source_evidence_packet_phase === expected.sourceEvidencePacketPhase &&
    target.candidate_id === expected.candidateId &&
    target.sample_id === expected.sampleId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.sha256 === expected.sha256 &&
    target.dimensions === expected.dimensions &&
    target.mime === expected.mime &&
    target.reviewer_required === expected.reviewer &&
    state.ingestion_packet_only === true &&
    state.approval_submission_present_now === false &&
    state.approval_statement_text_present_now === false &&
    state.approval_statement_source_is_user_submission === false &&
    state.formal_human_approval_status === "pending" &&
    state.formal_human_approval_captured_now === false &&
    state.accepted_samples_registration_ready_now === false &&
    state.registration_unlock_allowed_now === false &&
    state.next_write_action_allowed_now === false &&
    state.current_blocker === "user_submitted_jenn_approval_missing" &&
    guard.approval_ingestion_performed === false &&
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
    record.recommended_next === expected.recommendedNext
  );
}

function validatePacket(packet, context) {
  const state = packet.current_ingestion_state || {};
  assert(packet.phase === expected.phase, `${context} packet phase mismatch`);
  assert(packet.source_phase === expected.sourcePhase, `${context} packet source phase mismatch`);
  assert(packet.source_evidence_packet_phase === expected.sourceEvidencePacketPhase, `${context} source evidence phase mismatch`);
  assert(packet.packet_type === "pending_user_submission_formal_human_approval_ingestion_packet", `${context} packet type mismatch`);
  assert(packet.required_input_source === "future_user_submitted_jenn_approval_only", `${context} required input source mismatch`);
  assert(packet.target.candidate_id === expected.candidateId, `${context} candidate mismatch`);
  assert(packet.target.sample_id === expected.sampleId, `${context} sample mismatch`);
  assert(packet.target.sha256 === expected.sha256, `${context} sha mismatch`);
  assert(packet.required_fields.length === 7, `${context} required field count mismatch`);
  assert(packet.required_statement_tokens.includes(expected.reviewer), `${context} reviewer token missing`);
  assert(packet.required_statement_tokens.includes(expected.sampleId), `${context} sample token missing`);
  assert(state.approval_submission_present_now === false, `${context} must not claim approval submission`);
  assert(state.formal_human_approval_captured_now === false, `${context} must not claim formal approval`);
  assert(state.next_write_action_allowed_now === false, `${context} must not unlock write`);
  assert(packet.routing_decision.current_blocker_class === "user_submitted_jenn_approval_missing", `${context} blocker class mismatch`);
  assert(packet.routing_decision.next_safe_task_lane === "blocked_on_human_input", `${context} next task lane mismatch`);
  assert(packet.routing_decision.downstream_write_allowed_now === false, `${context} downstream write must be blocked`);
}

function validateRecord(record, packet, context) {
  assert(record && typeof record === "object", `${context} record missing`);
  assert(packet && typeof packet === "object", `${context} packet missing`);
  assertNoRawLocalDrivePath(record, `${context}.record`);
  assertNoRawLocalDrivePath(packet, `${context}.packet`);
  assert(commonChecks(record), `${context} common checks failed`);
  validatePacket(packet, context);
}

function expectFailure(baseRecord, basePacket, caseId, mutate) {
  const record = clone(baseRecord);
  const packet = clone(basePacket);
  mutate(record, packet);
  try {
    validateRecord(record, packet, caseId);
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
  const report = readJson(files.report).exact_new_trial_003_formal_human_approval_evidence_ingestion_packet;
  const packet = readJson(files.packet).formal_human_approval_evidence_ingestion_packet;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_formal_human_approval_evidence_ingestion_packet;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_formal_human_approval_evidence_ingestion_packet;
  const sourceSurface = readJson(files.sourceSurface).exact_new_trial_003_formal_human_approval_capture_surface_static_panel;
  const sourceEvidencePacket = readJson(files.sourceEvidencePacket).exact_new_trial_003_formal_human_approval_evidence_capture_packet;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "required_input_source: future_user_submitted_jenn_approval_only",
    "approval_submission_present_now: false",
    "formal_human_approval_captured_now: false",
    "current_blocker: user_submitted_jenn_approval_missing",
    "accepted_samples_write_performed: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet.js"),
    "validate_mvp missing formal human approval evidence ingestion packet validator"
  );
  assert(sourceSurface.phase === expected.sourcePhase, "source surface phase mismatch");
  assert(sourceSurface.current_evidence_state.formal_human_approval_captured_now === false, "source surface must not claim approval");
  assert(sourceSurface.current_evidence_state.next_write_action_allowed_now === false, "source surface must keep writes locked");
  assert(sourceEvidencePacket.phase === expected.sourceEvidencePacketPhase, "source evidence packet phase mismatch");
  assert(sourceEvidencePacket.current_evidence_state.formal_human_approval_captured_now === false, "source evidence packet must not claim approval");

  validateRecord(report, packet, "report");
  validateRecord(passFixture, packet, "pass_fixture");

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, packet, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, packet, "approval_submission_present_overclaim_fails", (record, packet) => {
      record.current_ingestion_state.approval_submission_present_now = true;
      packet.current_ingestion_state.approval_submission_present_now = true;
    }),
    expectFailure(passFixture, packet, "approval_statement_source_user_submission_overclaim_fails", (record, packet) => {
      record.current_ingestion_state.approval_statement_source_is_user_submission = true;
      packet.current_ingestion_state.approval_statement_source_is_user_submission = true;
    }),
    expectFailure(passFixture, packet, "formal_human_approval_captured_overclaim_fails", (record, packet) => {
      record.current_ingestion_state.formal_human_approval_captured_now = true;
      packet.current_ingestion_state.formal_human_approval_captured_now = true;
    }),
    expectFailure(passFixture, packet, "registration_ready_overclaim_fails", (record, packet) => {
      record.current_ingestion_state.accepted_samples_registration_ready_now = true;
      packet.current_ingestion_state.accepted_samples_registration_ready_now = true;
    }),
    expectFailure(passFixture, packet, "next_write_action_allowed_overclaim_fails", (record, packet) => {
      record.current_ingestion_state.next_write_action_allowed_now = true;
      packet.current_ingestion_state.next_write_action_allowed_now = true;
    }),
    expectFailure(passFixture, packet, "approval_ingestion_performed_flag_fails", (record, packet) => {
      record.guard.approval_ingestion_performed = true;
      packet.guard.approval_ingestion_performed = true;
    }),
    expectFailure(passFixture, packet, "accepted_samples_write_flag_fails", (record, packet) => {
      record.guard.accepted_samples_write_performed = true;
      packet.guard.accepted_samples_write_performed = true;
    }),
    expectFailure(passFixture, packet, "memory_write_flag_fails", (record, packet) => {
      record.guard.DailyNote_write_performed = true;
      packet.guard.VCP_memory_write_performed = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    source_phase: report.source_phase,
    source_evidence_packet_phase: report.source_evidence_packet_phase,
    target_candidate_id: report.target.candidate_id,
    target_sample_id: report.target.sample_id,
    required_reviewer: report.target.reviewer_required,
    approval_submission_present_now: report.current_ingestion_state.approval_submission_present_now,
    approval_statement_source_is_user_submission: report.current_ingestion_state.approval_statement_source_is_user_submission,
    formal_human_approval_captured_now: report.current_ingestion_state.formal_human_approval_captured_now,
    accepted_samples_registration_ready_now: report.current_ingestion_state.accepted_samples_registration_ready_now,
    next_write_action_allowed_now: report.current_ingestion_state.next_write_action_allowed_now,
    current_blocker: report.current_ingestion_state.current_blocker,
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
