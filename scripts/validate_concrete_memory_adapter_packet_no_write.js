#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const yaml = require("yaml");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_97_CONCRETE_MEMORY_ADAPTER_PACKET_NO_WRITE.md",
  schema: "schemas/memory_adapter_packet.schema.yaml",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_96_memory_adapter_packet_schema_no_write.json",
  report: "reports/visual_asset_eval_dry_run/v0_6_97_concrete_memory_adapter_packet_no_write.json",
  receipt: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_concrete_memory_adapter_packet_no_write.json",
  passFixture: "tests/schema_examples/concrete_memory_adapter_packet_no_write.example.json",
  failFixture: "tests/schema_examples/concrete_memory_adapter_packet_no_write_fail.example.json"
};

const expected = {
  phase: "v0_6_97_concrete_memory_adapter_packet_no_write",
  status: "completed_validated_concrete_memory_adapter_packet_no_write",
  sourcePhase: "v0_6_96_memory_adapter_packet_schema_no_write",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  artifactSha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  packetId: "exact_new_trial_003_shot_2_concrete_memory_adapter_packet_no_write",
  dailyNoteTargetId: "daily_note_review_learning_exact_new_trial_003_shot_2",
  vcpMemoryTargetId: "vcp_memory_review_learning_exact_new_trial_003_shot_2",
  recommendedNext: "pause_before_memory_write_until_exact_writer_or_authorize_path_hygiene"
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

function readYaml(relativePath) {
  return yaml.parse(read(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function includesAll(values, required) {
  return required.every((item) => values.includes(item));
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

function requireFiles() {
  Object.values(files).forEach((relativePath) => {
    assert(fs.existsSync(repoPath(relativePath)), `Missing required file: ${relativePath}`);
  });
}

function validateSchema(schema) {
  assert(schema.schema_id === "memory_adapter_packet.schema.v1", "schema id mismatch");
  assert(includesAll(schema.required_top_level_fields || [], [
    "version",
    "packet_id",
    "source_refs",
    "target",
    "adapter_mapping",
    "execution_limits",
    "preflight_requirements",
    "post_write_evidence_requirements",
    "guard",
    "go_no_go"
  ]), "schema required fields incomplete");
  assert(schema.required_values.execute_now_default === false, "schema execute default must be false");
  assert(schema.required_values.secret_value_read_allowed === false, "schema secret read must be false");
  assert(schema.required_values.raw_private_data_print_allowed === false, "schema raw private print must be false");
}

function validateSource(source) {
  const record = source.memory_adapter_packet_schema_no_write;
  assert(record.phase === expected.sourcePhase, "source phase mismatch");
  assert(record.schema_summary.adapter_packet_schema_created === true, "source schema must exist");
  assert(record.schema_summary.concrete_packet_instance_created === false, "source must not already fill packet");
  assert(record.guard.record_memory_called === false, "source must not call record_memory");
}

function validatePacketContainer(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  assertNoRawLocalDrivePath(container, context);
  assert(container.version === "v1", `${context} version mismatch`);
  assert(container.phase === expected.phase, `${context} phase mismatch`);
  assert(container.status === expected.status, `${context} status mismatch`);
  assert(container.execution_mode === "concrete_memory_adapter_packet_no_write", `${context} execution mode mismatch`);
  assert(container.lane_attempted === "Green_no_write_packet_fill", `${context} lane attempted mismatch`);
  assert(container.lane_executed === "Green_no_write_packet_fill", `${context} lane executed mismatch`);
  assert(container.source_phase === expected.sourcePhase, `${context} source phase mismatch`);
  assert(container.schema_ref === files.schema, `${context} schema ref mismatch`);
  assert(container.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(container.recommended_next_auto_execution_allowed === false, `${context} next auto must be false`);

  const packet = container.packet || {};
  const target = packet.target || {};
  const surface = packet.candidate_surface || {};
  const mapping = packet.adapter_mapping || {};
  const limits = packet.execution_limits || {};
  const preflight = packet.preflight_requirements || {};
  const postWrite = packet.post_write_evidence_requirements || {};
  const receiptPlan = packet.receipt_plan || {};
  const cleanup = packet.rollback_or_cleanup_plan || {};
  const goNoGo = packet.go_no_go || {};
  const guard = packet.guard || {};

  assert(packet.version === "v1", `${context} packet version mismatch`);
  assert(packet.packet_id === expected.packetId, `${context} packet id mismatch`);
  assert(packet.phase === expected.phase, `${context} packet phase mismatch`);
  assert(packet.source_refs.schema_ref === files.schema, `${context} source schema ref mismatch`);
  assert(packet.source_refs.schema_report_ref === files.sourceReport, `${context} source report ref mismatch`);

  assert(target.sample_id === expected.sampleId, `${context} sample mismatch`);
  assert(target.candidate_id === expected.candidateId, `${context} candidate mismatch`);
  assert(target.artifact_sha256 === expected.artifactSha256, `${context} hash mismatch`);
  assert(target.exact_daily_note_target_id === expected.dailyNoteTargetId, `${context} DailyNote target mismatch`);
  assert(target.exact_vcp_memory_target_id === expected.vcpMemoryTargetId, `${context} VCP memory target mismatch`);

  assert(surface.record_memory_surface_visible === true, `${context} record_memory surface should be visible`);
  assert(surface.record_memory_surface_called === false, `${context} record_memory surface must not be called`);
  assert(surface.surface_is_selected_writer === false, `${context} candidate surface must not be selected writer`);
  assert(surface.candidate_surface_status === "candidate_only_not_exact_dual_target_writer", `${context} surface status mismatch`);

  assert(mapping.selected_writer_tool_or_command === null, `${context} selected writer must be null`);
  assert(mapping.writer_kind === "unresolved_no_write", `${context} writer kind mismatch`);
  assert(mapping.record_memory_target_mapping.candidate_only === true, `${context} record_memory mapping must be candidate-only`);
  assert(mapping.record_memory_target_mapping.allowed_role === "future_codex_summary_side_only", `${context} record_memory role mismatch`);
  assert(mapping.daily_note_adapter.required === true, `${context} DailyNote adapter must be required`);
  assert(mapping.daily_note_adapter.available_now === false, `${context} DailyNote adapter must not be available`);
  assert(mapping.vcp_memory_adapter.required === true, `${context} VCP adapter must be required`);
  assert(mapping.vcp_memory_adapter.available_now === false, `${context} VCP adapter must not be available`);
  assert(mapping.two_phase_ordering.required_order === "daily_note_success_then_vcp_memory", `${context} ordering mismatch`);
  assert(mapping.two_phase_ordering.executable_now === false, `${context} ordering must not execute`);

  assert(limits.max_write_entries === 2, `${context} max write entries mismatch`);
  assert(limits.max_plugin_calls === 1, `${context} max plugin calls mismatch`);
  assert(limits.max_api_calls === 0, `${context} max api calls mismatch`);
  assert(limits.secret_value_read_allowed === false, `${context} secret read must be false`);
  assert(limits.raw_private_data_print_allowed === false, `${context} raw private print must be false`);
  assert(limits.execute_now === false, `${context} execute now must be false`);

  assert(preflight.canonical_daily_note_root_preflight.satisfied === false, `${context} DailyNote preflight must be false`);
  assert(preflight.canonical_daily_note_root_preflight.evidence_ref === null, `${context} DailyNote preflight evidence must be null`);
  assert(preflight.exact_target_ids_present === true, `${context} exact target ids must be present`);
  assert(typeof preflight.source_payload_ref === "string" && preflight.source_payload_ref.length > 0, `${context} source payload ref missing`);
  assert(preflight.sensitive_data_scan_ref === "npm run validate:public-disclosure", `${context} sensitive scan ref mismatch`);

  assert(postWrite.daily_note_canonical_target_proof.available_now === false, `${context} DailyNote proof must be false`);
  assert(postWrite.daily_note_content_hash_proof.available_now === false, `${context} DailyNote hash proof must be false`);
  assert(postWrite.vcp_memory_receipt_id_or_immutable_ref.available_now === false, `${context} VCP receipt proof must be false`);
  assert(postWrite.bounded_write_count_receipt.available_now === false, `${context} write count receipt must be false`);

  assert(receiptPlan.future_receipt_required === true, `${context} future receipt must be required`);
  assert(receiptPlan.current_no_write_receipt_ref === files.receipt, `${context} no-write receipt ref mismatch`);
  assert(cleanup.cleanup_required_for_this_no_write_packet === false, `${context} cleanup must not be required for no-write packet`);
  assert(includesAll(packet.stop_conditions || [], [
    "missing_exact_daily_note_writer",
    "missing_exact_vcp_memory_writer",
    "secret_or_env_read_required",
    "push_tag_release_deploy_requested"
  ]), `${context} stop conditions incomplete`);

  assert(goNoGo.concrete_packet_instance_created === true, `${context} concrete packet must be true`);
  assert(goNoGo.exact_target_ids_present === true, `${context} exact target ids go/no-go mismatch`);
  assert(goNoGo.writer_selected === false, `${context} writer selected must be false`);
  assert(goNoGo.preflight_requirements_satisfied_now === false, `${context} preflight satisfied must be false`);
  assert(goNoGo.post_write_evidence_available_now === false, `${context} post write evidence must be false`);
  assert(goNoGo.adapter_can_execute_now === false, `${context} adapter must not execute`);
  assert(goNoGo.memory_write_can_execute_now === false, `${context} memory write must not execute`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  for (const [key, value] of Object.entries(guard)) {
    assert(value === false, `${context} guard.${key} must be false`);
  }
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_no_write_concrete_memory_adapter_packet_receipt", "receipt type mismatch");
  assert(receipt.status === expected.status, "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.target_sample_id === expected.sampleId, "receipt sample mismatch");
  assert(receipt.target_candidate_id === expected.candidateId, "receipt candidate mismatch");
  assert(receipt.artifact_sha256 === expected.artifactSha256, "receipt hash mismatch");
  assert(receipt.calls_used.record_memory_calls === 0, "receipt record_memory calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "receipt memory write entries must be zero");
  assert(receipt.packet_result.concrete_packet_instance_created === true, "receipt packet must be created");
  assert(receipt.packet_result.writer_selected === false, "receipt writer must not be selected");
  assert(receipt.packet_result.adapter_can_execute_now === false, "receipt adapter must not execute");
  assert(receipt.packet_result.memory_write_can_execute_now === false, "receipt memory write must be false");
  assert(receipt.next_auto_step_allowed === false, "receipt next auto must be false");
  assert(receipt.recommended_next === expected.recommendedNext, "receipt recommended next mismatch");
  for (const [key, value] of Object.entries(receipt.guard || {})) {
    assert(value === false, `receipt guard.${key} must be false`);
  }
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validatePacketContainer(candidate, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  requireFiles();
  validateSchema(readYaml(files.schema));
  validateSource(readJson(files.sourceReport));

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).concrete_memory_adapter_packet_no_write;
  const receipt = readJson(files.receipt).concrete_memory_adapter_packet_no_write;
  const passFixture = readJson(files.passFixture).concrete_memory_adapter_packet_no_write;
  const failFixture = readJson(files.failFixture).concrete_memory_adapter_packet_no_write;

  for (const token of [
    `phase: ${expected.phase}`,
    "concrete_packet_instance_created: true",
    "writer_selected: false",
    "adapter_can_execute_now: false",
    "record_memory_called: false",
    expected.recommendedNext
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  validatePacketContainer(report, "report");
  validatePacketContainer(passFixture, "pass_fixture");
  validateReceipt(receipt);

  let failFixtureCaught = false;
  try {
    validatePacketContainer(failFixture, "fail_fixture");
  } catch {
    failFixtureCaught = true;
  }
  assert(failFixtureCaught, "fail fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "execute_now_true_fails", (candidate) => {
      candidate.packet.execution_limits.execute_now = true;
    }),
    expectFailure(passFixture, "writer_selected_fails", (candidate) => {
      candidate.packet.adapter_mapping.selected_writer_tool_or_command = "record_memory";
    }),
    expectFailure(passFixture, "writer_kind_overclaim_fails", (candidate) => {
      candidate.packet.adapter_mapping.writer_kind = "codex_memory_write";
    }),
    expectFailure(passFixture, "daily_note_target_missing_fails", (candidate) => {
      candidate.packet.target.exact_daily_note_target_id = "";
    }),
    expectFailure(passFixture, "secret_read_allowed_fails", (candidate) => {
      candidate.packet.execution_limits.secret_value_read_allowed = true;
    }),
    expectFailure(passFixture, "record_memory_called_fails", (candidate) => {
      candidate.packet.guard.record_memory_called = true;
    }),
    expectFailure(passFixture, "preflight_overclaim_fails", (candidate) => {
      candidate.packet.preflight_requirements.canonical_daily_note_root_preflight.satisfied = true;
    }),
    expectFailure(passFixture, "post_write_evidence_overclaim_fails", (candidate) => {
      candidate.packet.post_write_evidence_requirements.daily_note_content_hash_proof.available_now = true;
    }),
    expectFailure(passFixture, "memory_write_allowed_fails", (candidate) => {
      candidate.packet.go_no_go.memory_write_can_execute_now = true;
    }),
    expectFailure(passFixture, "raw_local_path_fails", (candidate) => {
      candidate.packet.source_refs.schema_ref = "A:\\secret\\schema.yaml";
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    concrete_packet_instance_created: report.packet.go_no_go.concrete_packet_instance_created,
    exact_target_ids_present: report.packet.go_no_go.exact_target_ids_present,
    writer_selected: report.packet.go_no_go.writer_selected,
    adapter_can_execute_now: report.packet.go_no_go.adapter_can_execute_now,
    memory_write_can_execute_now: report.packet.go_no_go.memory_write_can_execute_now,
    record_memory_called: report.packet.guard.record_memory_called,
    DailyNote_write_performed: report.packet.guard.DailyNote_write_performed,
    VCP_memory_write_performed: report.packet.guard.VCP_memory_write_performed,
    Codex_memory_write_performed: report.packet.guard.Codex_memory_write_performed,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    recommended_next: report.recommended_next,
    recommended_next_auto_execution_allowed: report.recommended_next_auto_execution_allowed
  };

  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
