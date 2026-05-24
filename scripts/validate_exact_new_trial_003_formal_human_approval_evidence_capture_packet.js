#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_52_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_EVIDENCE_CAPTURE_PACKET.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet.json",
  packet: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_capture_packet.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_formal_human_approval_evidence_capture_packet.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_formal_human_approval_evidence_capture_packet_fail.example.json",
  sourceReconciliation: "reports/visual_asset_eval_dry_run/v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet.json",
  sourceIntake: "reports/visual_asset_eval_dry_run/v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package.json",
  sourceReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  sourceCloseout: "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet",
  sourcePhase: "v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet",
  intakePhase: "v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  reviewer: "Jenn",
  packetRef: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_capture_packet.json",
  recommendedNext: "prepare_review_console_formal_human_approval_capture_surface_static_only_before_any_accepted_sample_registration"
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

function commonChecks(report) {
  const target = report.target || {};
  const state = report.current_evidence_state || {};
  const guard = report.guard || {};
  return (
    report.version === "v1" &&
    report.phase === expected.phase &&
    report.status === "completed_validated_local_formal_human_approval_evidence_capture_packet_pending_jenn_submission" &&
    report.execution_mode === "formal_human_approval_evidence_capture_packet_only" &&
    report.packet_ref === expected.packetRef &&
    target.candidate_id === expected.candidateId &&
    target.sample_id === expected.sampleId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.sha256 === expected.sha256 &&
    target.dimensions === expected.dimensions &&
    target.mime === expected.mime &&
    target.reviewer_required === expected.reviewer &&
    state.evidence_packet_only === true &&
    state.approval_evidence_present_now === false &&
    state.approval_statement_text_present_now === false &&
    state.approval_statement_source === "not_present" &&
    state.approval_statement_source_is_user_submission === false &&
    state.formal_human_approval_status === "pending" &&
    state.formal_human_approval_captured_now === false &&
    state.accepted_samples_registration_ready_now === false &&
    state.registration_unlock_allowed_now === false &&
    state.next_write_action_allowed_now === false &&
    state.current_blocker === "formal_human_approval_evidence_missing" &&
    guard.formal_human_approval_evidence_capture_packet_only === true &&
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
    report.recommended_next === expected.recommendedNext
  );
}

function validateRecord(report, packet, context) {
  assert(report && typeof report === "object", `${context} report missing`);
  assert(packet && typeof packet === "object", `${context} packet missing`);
  assertNoRawLocalDrivePath(report, `${context}.report`);
  assertNoRawLocalDrivePath(packet, `${context}.packet`);
  assert(commonChecks(report), `${context} report checks failed`);
  assert(packet.phase === expected.phase, `${context} packet phase mismatch`);
  assert(packet.source_phase === expected.sourcePhase, `${context} packet source phase mismatch`);
  assert(packet.human_approval_intake_source_phase === expected.intakePhase, `${context} intake phase mismatch`);
  assert(packet.packet_type === "formal_human_approval_evidence_capture_packet", `${context} packet type mismatch`);
  assert(packet.target.candidate_id === expected.candidateId, `${context} packet candidate mismatch`);
  assert(packet.target.sample_id === expected.sampleId, `${context} packet sample mismatch`);
  assert(packet.required_approval_evidence.required_statement_source === "user_submitted_jenn_approval", `${context} required statement source mismatch`);
  assert(packet.required_approval_evidence.required_reviewer === expected.reviewer, `${context} required reviewer mismatch`);
  assert(packet.required_approval_evidence.required_boundary_acknowledgement_count === 9, `${context} boundary acknowledgement count mismatch`);
  assert(packet.current_evidence_state.approval_evidence_present_now === false, `${context} packet must not claim approval evidence`);
  assert(packet.current_evidence_state.formal_human_approval_captured_now === false, `${context} packet must not claim formal approval`);
  assert(packet.current_evidence_state.next_write_action_allowed_now === false, `${context} packet must not unlock writes`);
  assert(packet.future_evidence_slots.approval_statement_text === null, `${context} future approval statement slot must remain empty`);
  assert(packet.future_evidence_slots.submitted_by === null, `${context} future submitter slot must remain empty`);
  assert(packet.guard.approval_evidence_fabricated === false, `${context} packet must not fabricate evidence`);
  assert(packet.guard.accepted_samples_write_performed === false, `${context} packet must not write accepted samples`);
  assert(packet.guard.DailyNote_write_performed === false, `${context} packet must not write DailyNote`);
  assert(packet.guard.VCP_memory_write_performed === false, `${context} packet must not write VCP memory`);
  assert(packet.guard.push_tag_release_deploy_performed === false, `${context} packet must not push/tag/release/deploy`);
  assert(packet.routing_decision.current_blocker_class === "formal_human_approval_evidence_gap", `${context} blocker class mismatch`);
  assert(packet.routing_decision.next_safe_task === expected.recommendedNext, `${context} next safe task mismatch`);
  assert(packet.routing_decision.next_safe_task_lane === "Green", `${context} next safe task lane mismatch`);
}

function expectFailure(baseReport, basePacket, caseId, mutate) {
  const report = clone(baseReport);
  const packet = clone(basePacket);
  mutate(report, packet);
  try {
    validateRecord(report, packet, caseId);
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
  const report = readJson(files.report).exact_new_trial_003_formal_human_approval_evidence_capture_packet;
  const packet = readJson(files.packet).formal_human_approval_evidence_capture_packet;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_formal_human_approval_evidence_capture_packet;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_formal_human_approval_evidence_capture_packet;
  const sourceReconciliation = readJson(files.sourceReconciliation).exact_new_trial_003_workflow_prerequisite_reconciliation_packet;
  const sourceIntake = readJson(files.sourceIntake).exact_new_trial_003_selected_candidate_human_approval_intake_package;
  const sourceReview = readJson(files.sourceReview).exact_new_trial_003_human_review;
  const sourceCloseout = readJson(files.sourceCloseout).exact_new_trial_003_shot_2_execution_closeout;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "formal_human_approval_captured_now: false",
    "approval_statement_source_is_user_submission: false",
    "registration_unlock_allowed_now: false",
    "current_blocker: formal_human_approval_evidence_missing",
    "accepted_samples_write_performed: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_formal_human_approval_evidence_capture_packet.js"),
    "validate_mvp missing formal human approval evidence capture validator"
  );

  assert(sourceReconciliation.workflow_prerequisite_matrix.formal_human_approval_captured === false, "source reconciliation must preserve missing formal human approval");
  assert(sourceReconciliation.workflow_prerequisite_matrix.go_allowed_now === false, "source reconciliation must remain no-go");
  assert(sourceIntake.target.current_formal_human_approval_status === "pending", "source intake must preserve pending approval");
  assert(sourceIntake.approval_intake.approval_statement_source_is_user_submission === false, "source intake must remain fixture-only");
  assert(sourceIntake.approval_intake.human_approval_captured_now === false, "source intake must not claim captured approval");
  assert(sourceReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId, "source review selected candidate mismatch");
  assert(sourceReview.decision_boundary.formal_human_approval_status === "pending", "source review approval status mismatch");
  assert(sourceReview.decision_boundary.human_approval_captured_now === false, "source review must not claim captured approval");
  assert(sourceCloseout.attempt_id === expected.candidateId, "source closeout candidate mismatch");
  assert(sourceCloseout.output_image_sha256 === expected.sha256, "source closeout hash mismatch");

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
    expectFailure(passFixture, packet, "approval_evidence_present_overclaim_fails", (report, packet) => {
      report.current_evidence_state.approval_evidence_present_now = true;
      packet.current_evidence_state.approval_evidence_present_now = true;
    }),
    expectFailure(passFixture, packet, "approval_statement_source_user_submission_overclaim_fails", (report, packet) => {
      report.current_evidence_state.approval_statement_source_is_user_submission = true;
      packet.current_evidence_state.approval_statement_source_is_user_submission = true;
    }),
    expectFailure(passFixture, packet, "formal_human_approval_captured_overclaim_fails", (report, packet) => {
      report.current_evidence_state.formal_human_approval_captured_now = true;
      packet.current_evidence_state.formal_human_approval_captured_now = true;
    }),
    expectFailure(passFixture, packet, "registration_ready_overclaim_fails", (report, packet) => {
      report.current_evidence_state.accepted_samples_registration_ready_now = true;
      packet.current_evidence_state.accepted_samples_registration_ready_now = true;
    }),
    expectFailure(passFixture, packet, "next_write_action_allowed_overclaim_fails", (report, packet) => {
      report.current_evidence_state.next_write_action_allowed_now = true;
      packet.current_evidence_state.next_write_action_allowed_now = true;
    }),
    expectFailure(passFixture, packet, "fabricated_evidence_flag_fails", (report, packet) => {
      report.guard.approval_evidence_fabricated = true;
      packet.guard.approval_evidence_fabricated = true;
    }),
    expectFailure(passFixture, packet, "accepted_samples_write_flag_fails", (report, packet) => {
      report.guard.accepted_samples_write_performed = true;
      packet.guard.accepted_samples_write_performed = true;
    }),
    expectFailure(passFixture, packet, "memory_write_flag_fails", (report, packet) => {
      report.guard.DailyNote_write_performed = true;
      packet.guard.VCP_memory_write_performed = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    source_phase: packet.source_phase,
    human_approval_intake_source_phase: packet.human_approval_intake_source_phase,
    target_candidate_id: report.target.candidate_id,
    target_sample_id: report.target.sample_id,
    required_reviewer: report.target.reviewer_required,
    approval_evidence_present_now: report.current_evidence_state.approval_evidence_present_now,
    approval_statement_source_is_user_submission: report.current_evidence_state.approval_statement_source_is_user_submission,
    formal_human_approval_captured_now: report.current_evidence_state.formal_human_approval_captured_now,
    accepted_samples_registration_ready_now: report.current_evidence_state.accepted_samples_registration_ready_now,
    next_write_action_allowed_now: report.current_evidence_state.next_write_action_allowed_now,
    current_blocker: report.current_evidence_state.current_blocker,
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
