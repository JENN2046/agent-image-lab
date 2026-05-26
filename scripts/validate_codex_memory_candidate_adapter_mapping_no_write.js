#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_95_CODEX_MEMORY_CANDIDATE_ADAPTER_MAPPING_NO_WRITE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_95_codex_memory_candidate_adapter_mapping_no_write.json",
  receipt: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_codex_memory_candidate_adapter_mapping_no_write.json",
  passFixture: "tests/schema_examples/codex_memory_candidate_adapter_mapping_no_write.example.json",
  failFixture: "tests/schema_examples/codex_memory_candidate_adapter_mapping_no_write_fail.example.json",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_94_memory_writer_candidate_surface_reconciliation_no_write.json"
};

const expected = {
  phase: "v0_6_95_codex_memory_candidate_adapter_mapping_no_write",
  sourcePhase: "v0_6_94_memory_writer_candidate_surface_reconciliation_no_write",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  artifactSha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  mappingId: "codex_memory_record_memory_to_exact_new_trial_003_memory_route_mapping_v1",
  recommendedNext: "draft_no_write_memory_adapter_packet_schema_or_pause"
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

function validateSource(record) {
  const source = record.source_surface_reconciliation || {};
  assert(source.source_report_present === true, "source report must be present");
  assert(source.source_report_ref === files.sourceReport, "source report ref mismatch");
  assert(source.candidate_write_tool_visible === true, "source candidate writer must be visible");
  assert(source.candidate_write_tool === "record_memory", "source candidate writer mismatch");
  assert(source.candidate_surface_meets_v0_6_93_contract === false, "source candidate must not satisfy v0.6.93");
  assert(source.source_memory_write_can_execute_now === false, "source memory write must not execute");
  const sourceReport = readJson(files.sourceReport).memory_writer_candidate_surface_reconciliation_no_write;
  assert(sourceReport.phase === expected.sourcePhase, "source phase mismatch");
  assert(sourceReport.guard.record_memory_called === false, "source must not have called record_memory");
}

function validateCommon(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);

  const target = record.target || {};
  const mapping = record.adapter_mapping || {};
  const possible = mapping.possible_field_mapping || {};
  const limits = mapping.required_future_limits || {};
  const goNoGo = record.go_no_go || {};
  const guard = record.guard || {};

  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === "completed_validated_codex_memory_candidate_adapter_mapping_no_write", `${context} status mismatch`);
  assert(record.execution_mode === "codex_memory_candidate_adapter_mapping_no_write", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_mapping_only", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_mapping_only", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);
  assert(target.sample_id === expected.sampleId, `${context} sample mismatch`);
  assert(target.candidate_id === expected.candidateId, `${context} candidate mismatch`);
  assert(target.artifact_sha256 === expected.artifactSha256, `${context} hash mismatch`);

  validateSource(record);

  assert(mapping.mapping_id === expected.mappingId, `${context} mapping id mismatch`);
  assert(mapping.candidate_surface === "mcp__vcp_codex_memory__.record_memory", `${context} candidate surface mismatch`);
  assert(mapping.adapter_mapping_created === true, `${context} mapping must be created`);
  assert(mapping.adapter_can_execute_now === false, `${context} adapter must not execute`);
  assert(mapping.record_memory_can_stand_in_for_daily_note === false, `${context} record_memory must not stand in for DailyNote`);
  assert(mapping.record_memory_can_stand_in_for_vcp_memory_dual_target_chain === false, `${context} record_memory must not stand in for dual chain`);
  assert(mapping.record_memory_candidate_use.includes("future_codex_memory_summary_side_only"), `${context} candidate use mismatch`);
  assert(possible.target === "knowledge", `${context} target mapping mismatch`);
  assert(possible.client_id === "codex", `${context} client id mismatch`);
  assert(possible.validated === true, `${context} possible mapping must be validated true`);
  assert(possible.reusable === true, `${context} possible mapping must be reusable`);
  assert(possible.sensitivity === "non_secret_desensitized_project_learning", `${context} sensitivity mismatch`);

  assert(
    includesAll(mapping.missing_required_adapter_layers || [], [
      "DailyNote canonical entry adapter",
      "VCP memory exact target adapter",
      "two-phase DailyNote success then VCP memory ordering",
      "post-write DailyNote canonical target proof",
      "post-write DailyNote content hash proof",
      "immutable VCP memory receipt reference",
      "exact rollback or cleanup plan for two new entries"
    ]),
    `${context} missing adapter layers incomplete`
  );
  assert(
    includesAll(mapping.required_future_adapter_packet_fields || [], [
      "source_payload_ref",
      "selected_writer_tool_or_command",
      "record_memory_target_mapping",
      "exact_daily_note_target_id",
      "exact_vcp_memory_target_id",
      "canonical_daily_note_root_preflight",
      "post_write_target_hash_verifier",
      "receipt_path",
      "rollback_or_cleanup_plan",
      "stop_conditions",
      "execute_now"
    ]),
    `${context} future adapter fields incomplete`
  );
  assert(limits.max_write_entries === 2, `${context} max write entries mismatch`);
  assert(limits.max_plugin_calls === 1, `${context} max plugin calls mismatch`);
  assert(limits.max_api_calls === 0, `${context} max api calls mismatch`);
  assert(limits.secret_value_read_allowed === false, `${context} secret read must be false`);
  assert(limits.raw_private_data_print_allowed === false, `${context} raw private print must be false`);
  assert(limits.execute_now_default === false, `${context} execute default must be false`);

  assert(
    includesAll(record.forbidden_actions_preserved || [], [
      "call_record_memory",
      "call_daily_note_writer",
      "call_vcp_memory_writer",
      "read_env_or_secret_files",
      "print_raw_private_data",
      "broad_vcp_write",
      "provider_or_plugin_or_api_call",
      "image_generation",
      "production_candidate_write",
      "push_tag_release_deploy"
    ]),
    `${context} forbidden actions incomplete`
  );

  assert(goNoGo.adapter_mapping_created === true, `${context} go/no-go mapping must be created`);
  assert(goNoGo.adapter_packet_schema_created === false, `${context} adapter packet schema must remain future work`);
  assert(goNoGo.adapter_can_execute_now === false, `${context} adapter must not execute`);
  assert(goNoGo.record_memory_selected_as_writer_now === false, `${context} record_memory must not be selected`);
  assert(goNoGo.memory_write_can_execute_now === false, `${context} memory write must not execute`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  for (const [key, value] of Object.entries(guard)) {
    if (key === "mapping_only") {
      assert(value === true, `${context} mapping_only must be true`);
    } else {
      assert(value === false, `${context} guard.${key} must be false`);
    }
  }

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === true, `${context} next Green design step should be allowed`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_no_write_codex_memory_candidate_adapter_mapping_receipt", "receipt type mismatch");
  assert(receipt.status === "completed_validated_codex_memory_candidate_adapter_mapping_no_write", "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.target_sample_id === expected.sampleId, "receipt sample mismatch");
  assert(receipt.target_candidate_id === expected.candidateId, "receipt candidate mismatch");
  assert(receipt.artifact_sha256 === expected.artifactSha256, "receipt hash mismatch");
  assert(receipt.calls_used.record_memory_calls === 0, "record_memory calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "memory write entries must be zero");
  assert(receipt.mapping_result.adapter_mapping_created === true, "receipt mapping must be created");
  assert(receipt.mapping_result.adapter_can_execute_now === false, "receipt adapter must not execute");
  assert(receipt.mapping_result.record_memory_selected_as_writer_now === false, "receipt must not select record_memory");
  assert(receipt.mapping_result.memory_write_can_execute_now === false, "receipt memory write must be false");
  assert(receipt.next_auto_step_allowed === true, "receipt should allow next no-write schema step");
  assert(receipt.recommended_next === expected.recommendedNext, "receipt recommended next mismatch");
  for (const [key, value] of Object.entries(receipt.guard || {})) {
    assert(value === false, `receipt guard.${key} must be false`);
  }
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateCommon(candidate, caseId);
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
  const report = readJson(files.report).codex_memory_candidate_adapter_mapping_no_write;
  const receipt = readJson(files.receipt).codex_memory_candidate_adapter_mapping_no_write;
  const passFixture = readJson(files.passFixture).codex_memory_candidate_adapter_mapping_no_write;
  const failFixture = readJson(files.failFixture).codex_memory_candidate_adapter_mapping_no_write;

  for (const token of [
    `phase: ${expected.phase}`,
    "adapter_mapping_created: true",
    "adapter_can_execute_now: false",
    "record_memory_called: false",
    "Codex_memory_write_performed: false",
    expected.recommendedNext
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  validateCommon(report, "report");
  validateCommon(passFixture, "pass_fixture");
  validateReceipt(receipt);

  let failFixtureCaught = false;
  try {
    validateCommon(failFixture, "fail_fixture");
  } catch {
    failFixtureCaught = true;
  }
  assert(failFixtureCaught, "fail fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "source_contract_overclaim_fails", (candidate) => {
      candidate.source_surface_reconciliation.candidate_surface_meets_v0_6_93_contract = true;
    }),
    expectFailure(passFixture, "adapter_execute_now_fails", (candidate) => {
      candidate.adapter_mapping.adapter_can_execute_now = true;
    }),
    expectFailure(passFixture, "record_memory_daily_note_standin_fails", (candidate) => {
      candidate.adapter_mapping.record_memory_can_stand_in_for_daily_note = true;
    }),
    expectFailure(passFixture, "missing_layers_removed_fails", (candidate) => {
      candidate.adapter_mapping.missing_required_adapter_layers = [];
    }),
    expectFailure(passFixture, "secret_allowed_fails", (candidate) => {
      candidate.adapter_mapping.required_future_limits.secret_value_read_allowed = true;
    }),
    expectFailure(passFixture, "execute_default_true_fails", (candidate) => {
      candidate.adapter_mapping.required_future_limits.execute_now_default = true;
    }),
    expectFailure(passFixture, "record_memory_selected_fails", (candidate) => {
      candidate.go_no_go.record_memory_selected_as_writer_now = true;
    }),
    expectFailure(passFixture, "memory_write_allowed_fails", (candidate) => {
      candidate.go_no_go.memory_write_can_execute_now = true;
    }),
    expectFailure(passFixture, "record_memory_called_fails", (candidate) => {
      candidate.guard.record_memory_called = true;
    }),
    expectFailure(passFixture, "forbidden_record_memory_missing_fails", (candidate) => {
      candidate.forbidden_actions_preserved = candidate.forbidden_actions_preserved.filter((item) => item !== "call_record_memory");
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    adapter_mapping_created: report.go_no_go.adapter_mapping_created,
    adapter_can_execute_now: report.go_no_go.adapter_can_execute_now,
    record_memory_selected_as_writer_now: report.go_no_go.record_memory_selected_as_writer_now,
    memory_write_can_execute_now: report.go_no_go.memory_write_can_execute_now,
    record_memory_called: report.guard.record_memory_called,
    DailyNote_write_performed: report.guard.DailyNote_write_performed,
    VCP_memory_write_performed: report.guard.VCP_memory_write_performed,
    Codex_memory_write_performed: report.guard.Codex_memory_write_performed,
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
