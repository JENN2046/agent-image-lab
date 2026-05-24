#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_51_EXACT_NEW_TRIAL_003_WORKFLOW_PREREQUISITE_RECONCILIATION_PACKET.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet.json",
  packet: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_workflow_prerequisite_reconciliation_packet.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_workflow_prerequisite_reconciliation_packet.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_workflow_prerequisite_reconciliation_packet_fail.example.json",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_50_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint.json",
  sourceCheckpoint: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_go_no_go_checkpoint.json",
  acceptedSamplesPreflight: "reports/visual_asset_eval_dry_run/v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight.json",
  archivePreflight: "reports/visual_asset_eval_dry_run/v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight.json",
  productionPreflight: "reports/visual_asset_eval_dry_run/v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight.json",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet",
  sourcePhase: "v0_6_50_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  reviewer: "Jenn",
  packetRef: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_workflow_prerequisite_reconciliation_packet.json",
  nextSafeTask: "prepare_exact_new_trial_003_formal_human_approval_evidence_capture_packet_before_any_accepted_sample_registration_or_memory_write"
};

const noGoReasons = [
  "formal_human_approval_not_captured",
  "accepted_sample_registration_not_completed",
  "durable_archive_not_ready",
  "production_candidate_not_ready"
];

const excludedFalseReasons = [
  "missing_step_by_step_real_class_authorization",
  "missing_memory_write_authorization"
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

function sameList(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
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
  return (
    report.version === "v1" &&
    report.phase === expected.phase &&
    report.status === "completed_validated_local_workflow_prerequisite_reconciliation_packet_memory_write_still_no_go" &&
    report.execution_mode === "workflow_prerequisite_reconciliation_only" &&
    report.packet_ref === expected.packetRef &&
    report.target.sample_id === expected.sampleId &&
    report.target.candidate_id === expected.candidateId &&
    report.target.category === expected.category &&
    report.target.reviewer === expected.reviewer &&
    report.authorization_reconciliation.active_autonomy_model === "Smart Standing Authorization v3" &&
    report.authorization_reconciliation.amber_lane_type === "Amber_C_memory" &&
    report.authorization_reconciliation.real_class_authorization_default_allowed === true &&
    report.authorization_reconciliation.amber_memory_write_default_allowed === true &&
    report.authorization_reconciliation.step_by_step_auth_request_required === false &&
    report.authorization_reconciliation.authorization_missing_is_current_blocker === false &&
    report.authorization_reconciliation.exact_scope_defined === true &&
    report.workflow_prerequisite_matrix.go_allowed_now === false &&
    report.workflow_prerequisite_matrix.workflow_prerequisites_missing_is_blocker === true &&
    report.workflow_prerequisite_matrix.formal_human_approval_captured === false &&
    report.workflow_prerequisite_matrix.accepted_sample_registration_completed === false &&
    report.workflow_prerequisite_matrix.durable_archive_ready === false &&
    report.workflow_prerequisite_matrix.production_candidate_ready === false &&
    sameList(report.workflow_prerequisite_matrix.current_no_go_reasons, noGoReasons) &&
    sameList(report.workflow_prerequisite_matrix.excluded_false_no_go_reasons, excludedFalseReasons) &&
    report.guard.reconciliation_only === true &&
    report.guard.authorization_request_performed === false &&
    report.guard.DailyNote_write_performed === false &&
    report.guard.VCP_memory_write_performed === false &&
    report.guard.accepted_samples_write_performed === false &&
    report.guard.archive_write_performed === false &&
    report.guard.production_candidate_write_performed === false &&
    report.guard.provider_contact_performed === false &&
    report.guard.plugin_call_performed === false &&
    report.guard.api_call_performed === false &&
    report.guard.mcp_runtime_performed === false &&
    report.guard.image_generation_performed === false &&
    report.guard.secret_value_read_performed === false &&
    report.guard.staging_performed === false &&
    report.guard.commit_performed === false &&
    report.guard.push_tag_release_deploy_performed === false &&
    report.recommended_next === expected.nextSafeTask
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
  assert(packet.packet_type === "workflow_prerequisite_reconciliation_packet", `${context} packet type mismatch`);
  assert(packet.target_sample_id === expected.sampleId, `${context} sample mismatch`);
  assert(packet.target_candidate_id === expected.candidateId, `${context} candidate mismatch`);
  assert(packet.authorization_reconciliation.authorization_missing_is_current_blocker === false, `${context} packet must not treat authorization as blocker`);
  assert(packet.workflow_prerequisite_matrix.workflow_prerequisites_missing_is_blocker === true, `${context} packet must preserve workflow blocker`);
  assert(sameList(packet.workflow_prerequisite_matrix.current_no_go_reasons, noGoReasons), `${context} packet no-go reasons mismatch`);
  assert(sameList(packet.workflow_prerequisite_matrix.excluded_false_no_go_reasons, excludedFalseReasons), `${context} packet excluded false reasons mismatch`);
  assert(packet.guard.reconciliation_only === true, `${context} packet guard must be reconciliation only`);
  assert(packet.guard.DailyNote_write_performed === false, `${context} packet must not write DailyNote`);
  assert(packet.guard.VCP_memory_write_performed === false, `${context} packet must not write VCP memory`);
  assert(packet.guard.accepted_samples_write_performed === false, `${context} packet must not write accepted samples`);
  assert(packet.guard.archive_write_performed === false, `${context} packet must not write archive`);
  assert(packet.guard.production_candidate_write_performed === false, `${context} packet must not write production candidate`);
  assert(packet.guard.push_tag_release_deploy_performed === false, `${context} packet must not push/tag/release/deploy`);
  assert(packet.routing_decision.current_route_decision === "no_go_before_memory_write", `${context} route decision mismatch`);
  assert(packet.routing_decision.current_blocker_class === "workflow_prerequisite_gap", `${context} blocker class mismatch`);
  assert(packet.routing_decision.next_safe_task === expected.nextSafeTask, `${context} next safe task mismatch`);
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
  const report = readJson(files.report).exact_new_trial_003_workflow_prerequisite_reconciliation_packet;
  const packet = readJson(files.packet).workflow_prerequisite_reconciliation_packet;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_workflow_prerequisite_reconciliation_packet;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_workflow_prerequisite_reconciliation_packet;
  const sourceReport = readJson(files.sourceReport).exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint;
  const sourceCheckpoint = readJson(files.sourceCheckpoint).daily_note_vcp_memory_write_go_no_go_checkpoint;
  const acceptedSamples = readJson(files.acceptedSamplesPreflight).exact_new_trial_003_accepted_samples_registration_execution_preflight;
  const archive = readJson(files.archivePreflight).exact_new_trial_003_durable_archive_authorization_compiler_output_preflight;
  const production = readJson(files.productionPreflight).exact_new_trial_003_production_candidate_authorization_compiler_output_preflight;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "real_class_authorization_default_allowed: true",
    "authorization_missing_is_current_blocker: false",
    "workflow_prerequisites_missing_is_blocker: true",
    "formal_human_approval_captured:",
    "accepted_sample_registration_completed:",
    "durable_archive_ready:",
    "production_candidate_ready:"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_workflow_prerequisite_reconciliation_packet.js"),
    "validate_mvp missing workflow prerequisite reconciliation validator"
  );

  assert(sourceReport.authorization_model.amber_memory_write_default_allowed === true, "source report must preserve default memory authorization");
  assert(sourceReport.authorization_model.authorization_missing_is_current_blocker === false, "source report must not treat authorization as blocker");
  assert(sourceReport.readiness.formal_human_approval_captured === false, "source report must preserve missing human approval");
  assert(sourceReport.readiness.accepted_sample_registration_completed === false, "source report must preserve missing accepted sample");
  assert(sourceReport.readiness.durable_archive_ready === false, "source report must preserve missing archive");
  assert(sourceReport.readiness.production_candidate_ready === false, "source report must preserve missing production candidate");
  assert(sourceCheckpoint.authorization_model.authorization_missing_is_current_blocker === false, "source checkpoint must not treat authorization as blocker");
  assert(acceptedSamples.target.human_approval_status === "pending", "accepted-samples preflight must preserve pending human approval");
  assert(acceptedSamples.target.execution_allowed_now === false, "accepted-samples preflight must remain blocked");
  assert(archive.target.accepted_sample_registration_completed === false, "archive preflight must preserve missing accepted sample");
  assert(archive.execution_allowed_now === false, "archive preflight must remain blocked");
  assert(production.target.accepted_sample_registration_completed === false, "production preflight must preserve missing accepted sample");
  assert(production.target.durable_archive_ready === false, "production preflight must preserve missing archive");
  assert(production.execution_allowed_now === false, "production preflight must remain blocked");

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
    expectFailure(passFixture, packet, "authorization_missing_blocker_overclaim_fails", (report, packet) => {
      report.authorization_reconciliation.authorization_missing_is_current_blocker = true;
      packet.authorization_reconciliation.authorization_missing_is_current_blocker = true;
    }),
    expectFailure(passFixture, packet, "workflow_prerequisites_missing_false_fails", (report, packet) => {
      report.workflow_prerequisite_matrix.workflow_prerequisites_missing_is_blocker = false;
      packet.workflow_prerequisite_matrix.workflow_prerequisites_missing_is_blocker = false;
    }),
    expectFailure(passFixture, packet, "go_allowed_now_overclaim_fails", (report, packet) => {
      report.workflow_prerequisite_matrix.go_allowed_now = true;
      packet.workflow_prerequisite_matrix.go_allowed_now = true;
    }),
    expectFailure(passFixture, packet, "human_approval_overclaim_fails", (report, packet) => {
      report.workflow_prerequisite_matrix.formal_human_approval_captured = true;
      packet.workflow_prerequisite_matrix.formal_human_approval_captured = true;
    }),
    expectFailure(passFixture, packet, "accepted_sample_overclaim_fails", (report, packet) => {
      report.workflow_prerequisite_matrix.accepted_sample_registration_completed = true;
      packet.workflow_prerequisite_matrix.accepted_sample_registration_completed = true;
    }),
    expectFailure(passFixture, packet, "archive_ready_overclaim_fails", (report, packet) => {
      report.workflow_prerequisite_matrix.durable_archive_ready = true;
      packet.workflow_prerequisite_matrix.durable_archive_ready = true;
    }),
    expectFailure(passFixture, packet, "production_ready_overclaim_fails", (report, packet) => {
      report.workflow_prerequisite_matrix.production_candidate_ready = true;
      packet.workflow_prerequisite_matrix.production_candidate_ready = true;
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
    real_class_authorization_default_allowed: report.authorization_reconciliation.real_class_authorization_default_allowed,
    authorization_missing_is_current_blocker: report.authorization_reconciliation.authorization_missing_is_current_blocker,
    workflow_prerequisites_missing_is_blocker: report.workflow_prerequisite_matrix.workflow_prerequisites_missing_is_blocker,
    go_allowed_now: report.workflow_prerequisite_matrix.go_allowed_now,
    formal_human_approval_captured: report.workflow_prerequisite_matrix.formal_human_approval_captured,
    accepted_sample_registration_completed: report.workflow_prerequisite_matrix.accepted_sample_registration_completed,
    durable_archive_ready: report.workflow_prerequisite_matrix.durable_archive_ready,
    production_candidate_ready: report.workflow_prerequisite_matrix.production_candidate_ready,
    excluded_false_no_go_reason_count: report.workflow_prerequisite_matrix.excluded_false_no_go_reasons.length,
    no_go_reason_count: report.workflow_prerequisite_matrix.current_no_go_reasons.length,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
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
