#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_53_EXACT_NEW_TRIAL_003_FORMAL_HUMAN_APPROVAL_CAPTURE_SURFACE_STATIC_PANEL.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_formal_human_approval_capture_surface_static_panel.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_formal_human_approval_capture_surface_static_panel_fail.example.json",
  sourceEvidencePacket: "reports/visual_asset_eval_dry_run/v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet.json",
  sourcePacket: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_capture_packet.json",
  index: "review_console/static_prototype/index.html",
  app: "review_console/static_prototype/app.js",
  mockData: "review_console/static_prototype/mock_data.js",
  styles: "review_console/static_prototype/styles.css",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel",
  sourcePhase: "v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  reviewer: "Jenn",
  sourcePacketRef: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_formal_human_approval_evidence_capture_packet.json",
  draftOutputKey: "exact_new_trial_003_formal_human_approval_capture_surface_state",
  recommendedNext: "prepare_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet_pending_user_submission"
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
  const surface = record.static_surface || {};
  const state = record.current_evidence_state || {};
  const guard = record.guard || {};
  return (
    record.version === "v1" &&
    record.phase === expected.phase &&
    record.status === "completed_validated_local_static_capture_surface_pending_jenn_submission" &&
    record.execution_mode === "review_console_static_capture_surface_only" &&
    record.source_phase === expected.sourcePhase &&
    record.source_packet_ref === expected.sourcePacketRef &&
    target.candidate_id === expected.candidateId &&
    target.sample_id === expected.sampleId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.sha256 === expected.sha256 &&
    target.dimensions === expected.dimensions &&
    target.mime === expected.mime &&
    target.reviewer_required === expected.reviewer &&
    surface.draft_output_key === expected.draftOutputKey &&
    surface.capture_surface_status === "static_capture_ready_pending_jenn_submission" &&
    surface.index_section_id === "exactNewTrial003ApprovalCaptureTitle" &&
    surface.summary_dom_id === "exactNewTrial003ApprovalCaptureSummary" &&
    surface.body_dom_id === "exactNewTrial003ApprovalCaptureBody" &&
    surface.guard_dom_id === "exactNewTrial003ApprovalCaptureGuard" &&
    Array.isArray(surface.required_capture_fields) &&
    surface.required_capture_fields.length === 4 &&
    surface.required_capture_fields.includes("approval_statement_text") &&
    surface.required_capture_fields.includes("submitted_by") &&
    surface.required_capture_fields.includes("submitted_at") &&
    surface.required_capture_fields.includes("boundary_acknowledgement") &&
    Array.isArray(surface.required_statement_tokens) &&
    surface.required_statement_tokens.includes(expected.reviewer) &&
    surface.required_statement_tokens.includes(expected.candidateId) &&
    surface.required_statement_tokens.includes(expected.sampleId) &&
    surface.required_statement_tokens.includes(expected.sha256) &&
    surface.required_statement_tokens.includes(expected.dimensions) &&
    surface.required_statement_tokens.includes(expected.category) &&
    surface.boundary_acknowledgement_count === 8 &&
    state.approval_evidence_present_now === false &&
    state.approval_statement_text_present_now === false &&
    state.approval_statement_source_is_user_submission === false &&
    state.formal_human_approval_status === "pending" &&
    state.formal_human_approval_captured_now === false &&
    state.accepted_samples_registration_ready_now === false &&
    state.registration_unlock_allowed_now === false &&
    state.next_write_action_allowed_now === false &&
    state.current_blocker === "formal_human_approval_evidence_missing" &&
    guard.static_panel_only === true &&
    guard.read_only_capture_surface === true &&
    guard.approval_capture_performed === false &&
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

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} record missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(commonChecks(record), `${context} common checks failed`);
}

function validateStaticSurfaceBindings(indexText, appText, mockText, stylesText) {
  const requiredIndexTokens = [
    "exactNewTrial003ApprovalCaptureTitle",
    "exactNewTrial003ApprovalCaptureSummary",
    "exactNewTrial003ApprovalCaptureBody",
    "exactNewTrial003ApprovalCaptureGuard",
    "exact-new-trial-approval-capture-body"
  ];
  const requiredAppTokens = [
    "exact_new_trial_003_formal_human_approval_capture_surface: mock.exact_new_trial_003_formal_human_approval_capture_surface_seed",
    "function exactNewTrial003FormalHumanApprovalCaptureSurfaceState()",
    "function renderExactNewTrial003FormalHumanApprovalCaptureSurface()",
    "exact_new_trial_003_formal_human_approval_capture_surface_state: exactNewTrial003FormalHumanApprovalCaptureSurfaceState()",
    "renderExactNewTrial003FormalHumanApprovalCaptureSurface();"
  ];
  const requiredMockTokens = [
    "exact_new_trial_003_formal_human_approval_capture_surface_seed",
    expected.sourcePacketRef,
    expected.draftOutputKey,
    expected.sampleId,
    "approval_capture_performed: false",
    "accepted_samples_write_performed: false",
    "DailyNote_write_performed: false",
    "VCP_memory_write_performed: false"
  ];
  const requiredStyleTokens = [
    ".exact-new-trial-approval-capture-body",
    ".exact-new-trial-approval-capture-card",
    ".exact-new-trial-approval-capture-fields"
  ];

  for (const token of requiredIndexTokens) assert(indexText.includes(token), `index missing token: ${token}`);
  for (const token of requiredAppTokens) assert(appText.includes(token), `app missing token: ${token}`);
  for (const token of requiredMockTokens) assert(mockText.includes(token), `mock data missing token: ${token}`);
  for (const token of requiredStyleTokens) assert(stylesText.includes(token), `styles missing token: ${token}`);
}

function expectFailure(baseRecord, caseId, mutate) {
  const record = clone(baseRecord);
  mutate(record);
  try {
    validateRecord(record, caseId);
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
  const report = readJson(files.report).exact_new_trial_003_formal_human_approval_capture_surface_static_panel;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_formal_human_approval_capture_surface_static_panel;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_formal_human_approval_capture_surface_static_panel;
  const sourceEvidencePacket = readJson(files.sourceEvidencePacket).exact_new_trial_003_formal_human_approval_evidence_capture_packet;
  const sourcePacket = readJson(files.sourcePacket).formal_human_approval_evidence_capture_packet;
  const indexText = read(files.index);
  const appText = read(files.app);
  const mockText = read(files.mockData);
  const stylesText = read(files.styles);
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    `draft_output_key: ${expected.draftOutputKey}`,
    "approval_statement_source_is_user_submission: false",
    "next_write_action_allowed_now: false",
    "current_blocker: formal_human_approval_evidence_missing",
    "image_generation_performed: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  validateStaticSurfaceBindings(indexText, appText, mockText, stylesText);
  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  assert(
    sourceEvidencePacket.phase === expected.sourcePhase &&
      sourceEvidencePacket.current_evidence_state.formal_human_approval_captured_now === false &&
      sourceEvidencePacket.current_evidence_state.next_write_action_allowed_now === false,
    "source evidence packet must remain pending and locked"
  );
  assert(sourcePacket.phase === expected.sourcePhase, "source packet phase mismatch");
  assert(sourcePacket.future_evidence_slots.approval_statement_text === null, "source packet future approval text slot must remain empty");
  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_formal_human_approval_capture_surface_static_panel.js"),
    "validate_mvp missing formal approval capture surface static panel validator"
  );

  const negativeCases = [
    expectFailure(passFixture, "approval_capture_overclaim_fails", (record) => {
      record.guard.approval_capture_performed = true;
    }),
    expectFailure(passFixture, "approval_statement_source_user_submission_overclaim_fails", (record) => {
      record.current_evidence_state.approval_statement_source_is_user_submission = true;
    }),
    expectFailure(passFixture, "formal_human_approval_captured_overclaim_fails", (record) => {
      record.current_evidence_state.formal_human_approval_captured_now = true;
    }),
    expectFailure(passFixture, "registration_ready_overclaim_fails", (record) => {
      record.current_evidence_state.accepted_samples_registration_ready_now = true;
    }),
    expectFailure(passFixture, "next_write_action_allowed_overclaim_fails", (record) => {
      record.current_evidence_state.next_write_action_allowed_now = true;
    }),
    expectFailure(passFixture, "accepted_samples_write_flag_fails", (record) => {
      record.guard.accepted_samples_write_performed = true;
    }),
    expectFailure(passFixture, "memory_write_flag_fails", (record) => {
      record.guard.DailyNote_write_performed = true;
      record.guard.VCP_memory_write_performed = true;
    }),
    expectFailure(passFixture, "provider_or_image_generation_flag_fails", (record) => {
      record.guard.provider_contact_performed = true;
      record.guard.image_generation_performed = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    source_phase: report.source_phase,
    target_candidate_id: report.target.candidate_id,
    target_sample_id: report.target.sample_id,
    required_reviewer: report.target.reviewer_required,
    draft_output_key: report.static_surface.draft_output_key,
    capture_surface_status: report.static_surface.capture_surface_status,
    required_capture_field_count: report.static_surface.required_capture_fields.length,
    boundary_acknowledgement_count: report.static_surface.boundary_acknowledgement_count,
    approval_evidence_present_now: report.current_evidence_state.approval_evidence_present_now,
    approval_statement_source_is_user_submission: report.current_evidence_state.approval_statement_source_is_user_submission,
    formal_human_approval_captured_now: report.current_evidence_state.formal_human_approval_captured_now,
    accepted_samples_registration_ready_now: report.current_evidence_state.accepted_samples_registration_ready_now,
    next_write_action_allowed_now: report.current_evidence_state.next_write_action_allowed_now,
    current_blocker: report.current_evidence_state.current_blocker,
    static_dom_binding_present: true,
    draft_output_key_present: true,
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
