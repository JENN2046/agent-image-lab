#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_61_EXACT_NEW_TRIAL_003_CHINESE_MEMORY_ENTRY_READINESS_PREFLIGHT_NO_WRITE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write.json",
  packet: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_chinese_memory_entry_readiness_preflight_no_write.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write_fail.example.json",
  approvalEvidence: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  acceptedRegistration: "reports/visual_asset_eval_dry_run/v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration.json",
  archiveReceipt: "reports/visual_asset_eval_dry_run/v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt.json",
  archiveManifest: "asset_archive/accepted_samples/accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001/manifest.json",
  memoryDeltaDraft: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_memory_delta_draft.yaml",
  sensitiveDataScan: "reports/memory_delta_drafts/v0_3_3_exact_new_trial_003_shot_2_sensitive_data_scan.json",
  exactAllowedTargets: "reports/memory_target_packages/v0_3_3_exact_new_trial_003_shot_2_exact_allowed_memory_targets.json",
  payloadRefresh: "reports/memory_write_payloads/v0_3_3_exact_new_trial_003_shot_2_daily_note_vcp_memory_write_payload_refresh_package.json",
  chineseMemoryPolicy: "memory_policy/chinese_memory_policy.md",
  writePermissionsPolicy: "memory_policy/write_permissions.md",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_61_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write",
  sourcePhase: "v0_6_60_exact_new_trial_003_durable_archive_write_execution_receipt",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  approvedBy: "Jenn",
  artifactSha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  packetRef: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_chinese_memory_entry_readiness_preflight_no_write.json",
  dailyNoteTargetId: "exact_new_trial_003_shot_2_daily_note_review_learning_entry",
  vcpMemoryTargetId: "exact_new_trial_003_shot_2_vcp_memory_review_learning_summary",
  nextSafeTask: "execute_exact_new_trial_003_chinese_memory_entry_amber_c_memory_write_with_receipt_if_exact_writer_target_is_resolved"
};

const excludedFalseNoGoReasons = [
  "missing_step_by_step_real_class_authorization",
  "missing_memory_write_authorization",
  "production_candidate_not_required_for_accepted_sample_review_learning"
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

function hasChinese(text) {
  return typeof text === "string" && /[\u4e00-\u9fff]/.test(text);
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

function validatePayload(payload) {
  const daily = payload?.daily_note_payload || {};
  const memory = payload?.vcp_memory_payload || {};
  const lessons = memory.lessons_cn || [];
  return (
    daily.target_id === expected.dailyNoteTargetId &&
    daily.language === "zh-CN" &&
    hasChinese(daily.title_cn) &&
    hasChinese(daily.body_cn) &&
    daily.body_cn.includes("已完成 Jenn 人工批准") &&
    daily.body_cn.includes("durable archive") &&
    !daily.body_cn.includes("不得写入") &&
    daily.DailyNote_write_performed === false &&
    memory.target_id === expected.vcpMemoryTargetId &&
    memory.language === "zh-CN" &&
    memory.memory_type === "accepted_sample_review_learning" &&
    hasChinese(memory.summary_cn) &&
    Array.isArray(lessons) &&
    lessons.length >= 3 &&
    lessons.every(hasChinese) &&
    memory.depends_on_daily_note_success === true &&
    memory.VCP_memory_write_performed === false
  );
}

function commonChecks(record) {
  const auth = record.authorization_reconciliation || {};
  const ready = record.readiness || {};
  const envelope = record.next_amber_packet_envelope || {};
  const guard = record.guard || {};
  const target = record.target || {};

  return (
    record.version === "v1" &&
    record.phase === expected.phase &&
    record.status === "completed_validated_local_chinese_memory_entry_readiness_preflight_no_write" &&
    record.execution_mode === "chinese_memory_entry_readiness_preflight_no_write" &&
    record.lane === "Green" &&
    record.source_phase === expected.sourcePhase &&
    record.packet_ref === expected.packetRef &&
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.approved_by === expected.approvedBy &&
    target.artifact_sha256 === expected.artifactSha256 &&
    auth.active_autonomy_model === "Smart Standing Authorization v3" &&
    auth.amber_lane_type_next === "Amber_C_memory" &&
    auth.real_class_authorization_default_allowed === true &&
    auth.step_by_step_auth_request_required === false &&
    auth.authorization_request_artifact_created === false &&
    auth.authorization_missing_is_current_blocker === false &&
    auth.exact_scope_defined === true &&
    ready.memory_route_type === "accepted_sample_review_learning" &&
    ready.go_allowed_next_amber_memory_packet === true &&
    ready.execution_allowed_now_by_this_preflight === false &&
    ready.formal_human_approval_captured === true &&
    ready.accepted_sample_registration_completed === true &&
    ready.durable_archive_ready === true &&
    ready.production_candidate_required_for_this_memory_route === false &&
    ready.production_candidate_ready === false &&
    ready.memory_delta_draft_present === true &&
    ready.sensitive_data_scan_passed === true &&
    ready.payload_refresh_present === true &&
    ready.exact_memory_targets_defined === true &&
    ready.daily_note_payload_chinese === true &&
    ready.vcp_memory_payload_chinese === true &&
    Array.isArray(ready.current_no_go_reasons) &&
    ready.current_no_go_reasons.length === 0 &&
    sameList(ready.excluded_false_no_go_reasons, excludedFalseNoGoReasons) &&
    envelope.task_id === "execute_exact_new_trial_003_chinese_memory_entry_daily_note_vcp_memory_write" &&
    envelope.lane === "Amber_C_memory" &&
    sameList(envelope.target_systems, ["DailyNote", "VCP_memory"]) &&
    envelope.allowed_operations.includes("write_one_DailyNote_entry_in_Chinese_only_to_exact_target") &&
    envelope.allowed_operations.includes("write_one_VCP_memory_summary_after_DailyNote_success_to_exact_target") &&
    envelope.exact_allowed_target_count === 2 &&
    envelope.max_write_entries === 2 &&
    envelope.max_plugin_calls === 1 &&
    envelope.max_api_calls === 0 &&
    envelope.secret_value_read_allowed === false &&
    envelope.raw_private_data_print_allowed === false &&
    envelope.receipt_required === true &&
    validatePayload(record.validated_chinese_payload) &&
    guard.preflight_only === true &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.direct_memory_write_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.image_generation_performed === false &&
    guard.image_binary_read_performed === false &&
    guard.secret_value_read_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.archive_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    record.recommended_next === expected.nextSafeTask
  );
}

function validateSourceRefs(report) {
  const refs = report.source_refs || {};
  assert(refs.approval_evidence === files.approvalEvidence, "approval evidence ref mismatch");
  assert(refs.accepted_samples_metadata_registration === files.acceptedRegistration, "accepted registration ref mismatch");
  assert(refs.durable_archive_execution_receipt === files.archiveReceipt, "archive receipt ref mismatch");
  assert(refs.archive_manifest === files.archiveManifest, "archive manifest ref mismatch");
  assert(refs.memory_delta_draft === files.memoryDeltaDraft, "memory delta draft ref mismatch");
  assert(refs.sensitive_data_scan === files.sensitiveDataScan, "sensitive data scan ref mismatch");
  assert(refs.exact_allowed_targets_package === files.exactAllowedTargets, "exact targets ref mismatch");
  assert(refs.payload_refresh_package === files.payloadRefresh, "payload refresh ref mismatch");
  assert(refs.chinese_memory_policy === files.chineseMemoryPolicy, "Chinese memory policy ref mismatch");
  assert(refs.write_permissions_policy === files.writePermissionsPolicy, "write permissions policy ref mismatch");

  const approval = readJson(files.approvalEvidence).user_submitted_formal_human_approval_evidence;
  const accepted = readJson(files.acceptedRegistration).exact_new_trial_003_accepted_samples_metadata_registration;
  const archive = readJson(files.archiveReceipt).exact_new_trial_003_durable_archive_write_execution_receipt;
  const manifest = readJson(files.archiveManifest);
  const scan = readJson(files.sensitiveDataScan);
  const targets = readJson(files.exactAllowedTargets).exact_allowed_memory_targets_package;
  const payloadRefresh = readJson(files.payloadRefresh).daily_note_vcp_memory_write_payload_refresh_package;
  const chinesePolicy = read(files.chineseMemoryPolicy);
  const writePolicy = read(files.writePermissionsPolicy);
  const draft = read(files.memoryDeltaDraft);

  assert(approval.current_capture_state.formal_human_approval_captured_now === true, "formal human approval must be captured");
  assert(approval.approval_claims.approver === expected.approvedBy, "approver mismatch");
  assert(accepted.registration_result.accepted_samples_metadata_registered === true, "accepted sample must be registered");
  assert(accepted.registration_result.category_index_updated === true, "category index must be updated");
  assert(archive.archive_write_performed === true, "archive write must be complete");
  assert(archive.target.manifest_ref === files.archiveManifest, "archive manifest ref must match");
  assert(manifest.manifest_type === "accepted_sample_durable_archive_manifest", "archive manifest type mismatch");
  assert(manifest.guard.archive_write_performed === true, "archive manifest guard must record archive write");
  assert(scan.scan_passed === true, "sensitive data scan must pass");
  assert(scan.contains_secret === false && scan.contains_private_path === false && scan.contains_image_binary === false, "scan must be clean");
  assert(targets.exact_allowed_memory_targets.length === 2, "exact memory targets must have two entries");
  assert(targets.exact_allowed_memory_targets[0].target_id === expected.dailyNoteTargetId, "DailyNote target mismatch");
  assert(targets.exact_allowed_memory_targets[1].target_id === expected.vcpMemoryTargetId, "VCP memory target mismatch");
  assert(payloadRefresh.daily_note_payload.target_id === expected.dailyNoteTargetId, "payload refresh DailyNote target mismatch");
  assert(payloadRefresh.vcp_memory_payload.target_id === expected.vcpMemoryTargetId, "payload refresh VCP memory target mismatch");
  assert(chinesePolicy.includes("所有写入 VCP DailyNote 的 `Content` 正文必须使用中文"), "Chinese memory policy must require Chinese body");
  assert(writePolicy.includes("真正写入 DailyNote / VCP 长期记忆，必须经过"), "write policy must describe controlled write flow");
  assert(draft.includes("daily_note_draft:") && draft.includes("vcp_memory_draft:"), "source memory draft must be present");
}

function validatePacket(report, packet) {
  assert(packet.phase === expected.phase, "packet phase mismatch");
  assert(packet.source_phase === expected.sourcePhase, "packet source phase mismatch");
  assert(packet.target_sample_id === expected.sampleId, "packet sample mismatch");
  assert(packet.authorization_reconciliation.authorization_request_artifact_created === false, "packet must not create auth request artifact");
  assert(packet.readiness_matrix.go_allowed_next_amber_memory_packet === true, "packet next Amber readiness mismatch");
  assert(packet.readiness_matrix.execution_allowed_now_by_this_preflight === false, "packet must remain no-write preflight");
  assert(packet.exact_next_amber_packet.max_write_entries === 2, "packet max write entries mismatch");
  assert(packet.exact_next_amber_packet.exact_allowed_targets.length === 2, "packet exact targets mismatch");
  assert(validatePayload(packet.validated_chinese_payload), "packet payload validation failed");
  assert(packet.guard.DailyNote_write_performed === false, "packet must not write DailyNote");
  assert(packet.guard.VCP_memory_write_performed === false, "packet must not write VCP memory");
  assert(packet.guard.plugin_call_performed === false, "packet must not call plugin");
  assert(packet.guard.secret_value_read_performed === false, "packet must not read secrets");
  assert(packet.routing_decision.next_safe_task === report.recommended_next, "packet routing next mismatch");
  assert(packet.routing_decision.next_safe_task_lane === "Amber_C_memory", "packet next lane mismatch");
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  assert(commonChecks(record), `${context} common checks failed`);
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate, caseId);
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
  const report = readJson(files.report).exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write;
  const packet = readJson(files.packet).chinese_memory_entry_readiness_preflight_no_write;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    "go_allowed_next_amber_memory_packet: true",
    "production_candidate_required_for_this_memory_route: false",
    "DailyNote_write_performed: false",
    "VCP_memory_write_performed: false",
    expected.nextSafeTask
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_chinese_memory_entry_readiness_preflight_no_write.js"),
    "validate_mvp missing v0.6.61 validator"
  );

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  validateSourceRefs(report);
  validatePacket(report, packet);

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "authorization_request_artifact_overclaim_fails", (candidate) => {
      candidate.authorization_reconciliation.authorization_request_artifact_created = true;
    }),
    expectFailure(passFixture, "go_next_false_fails", (candidate) => {
      candidate.readiness.go_allowed_next_amber_memory_packet = false;
    }),
    expectFailure(passFixture, "approval_missing_fails", (candidate) => {
      candidate.readiness.formal_human_approval_captured = false;
    }),
    expectFailure(passFixture, "accepted_registration_missing_fails", (candidate) => {
      candidate.readiness.accepted_sample_registration_completed = false;
    }),
    expectFailure(passFixture, "archive_missing_fails", (candidate) => {
      candidate.readiness.durable_archive_ready = false;
    }),
    expectFailure(passFixture, "production_candidate_required_overclaim_fails", (candidate) => {
      candidate.readiness.production_candidate_required_for_this_memory_route = true;
    }),
    expectFailure(passFixture, "non_chinese_payload_fails", (candidate) => {
      candidate.validated_chinese_payload.daily_note_payload.language = "en-US";
      candidate.validated_chinese_payload.daily_note_payload.body_cn = "English-only memory content.";
    }),
    expectFailure(passFixture, "sensitive_scan_failed_fails", (candidate) => {
      candidate.readiness.sensitive_data_scan_passed = false;
    }),
    expectFailure(passFixture, "memory_write_flag_fails", (candidate) => {
      candidate.guard.DailyNote_write_performed = true;
      candidate.validated_chinese_payload.daily_note_payload.DailyNote_write_performed = true;
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    lane: report.lane,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    approved_by: report.target.approved_by,
    formal_human_approval_captured: report.readiness.formal_human_approval_captured,
    accepted_sample_registration_completed: report.readiness.accepted_sample_registration_completed,
    durable_archive_ready: report.readiness.durable_archive_ready,
    production_candidate_required_for_this_memory_route: report.readiness.production_candidate_required_for_this_memory_route,
    production_candidate_ready: report.readiness.production_candidate_ready,
    memory_route_type: report.readiness.memory_route_type,
    go_allowed_next_amber_memory_packet: report.readiness.go_allowed_next_amber_memory_packet,
    execution_allowed_now_by_this_preflight: report.readiness.execution_allowed_now_by_this_preflight,
    daily_note_payload_chinese: report.readiness.daily_note_payload_chinese,
    vcp_memory_payload_chinese: report.readiness.vcp_memory_payload_chinese,
    exact_allowed_target_count: report.next_amber_packet_envelope.exact_allowed_target_count,
    max_write_entries: report.next_amber_packet_envelope.max_write_entries,
    max_plugin_calls: report.next_amber_packet_envelope.max_plugin_calls,
    no_go_reason_count: report.readiness.current_no_go_reasons.length,
    excluded_false_no_go_reason_count: report.readiness.excluded_false_no_go_reasons.length,
    authorization_request_artifact_created: report.authorization_reconciliation.authorization_request_artifact_created,
    step_by_step_auth_request_required: report.authorization_reconciliation.step_by_step_auth_request_required,
    DailyNote_write_performed: report.guard.DailyNote_write_performed,
    VCP_memory_write_performed: report.guard.VCP_memory_write_performed,
    plugin_call_performed: report.guard.plugin_call_performed,
    api_call_performed: report.guard.api_call_performed,
    secret_value_read_performed: report.guard.secret_value_read_performed,
    push_tag_release_deploy_performed: report.guard.push_tag_release_deploy_performed,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    recommended_next: report.recommended_next
  };

  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
