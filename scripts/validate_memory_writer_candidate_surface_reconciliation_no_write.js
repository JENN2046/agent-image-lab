#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_94_MEMORY_WRITER_CANDIDATE_SURFACE_RECONCILIATION_NO_WRITE.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_94_memory_writer_candidate_surface_reconciliation_no_write.json",
  receipt: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_memory_writer_candidate_surface_reconciliation_no_write.json",
  passFixture: "tests/schema_examples/memory_writer_candidate_surface_reconciliation_no_write.example.json",
  failFixture: "tests/schema_examples/memory_writer_candidate_surface_reconciliation_no_write_fail.example.json",
  sourceContract: "reports/visual_asset_eval_dry_run/v0_6_93_exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write.json"
};

const expected = {
  phase: "v0_6_94_memory_writer_candidate_surface_reconciliation_no_write",
  sourcePhase: "v0_6_93_exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  artifactSha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  recommendedNext: "pause_memory_write_until_exact_writer_packet_or_no_write_adapter_mapping"
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

function validateSourceContract(record) {
  const reconciliation = record.v0_6_93_contract_reconciliation || {};
  assert(reconciliation.source_contract_present === true, "source contract must be present");
  assert(reconciliation.source_contract_ref === files.sourceContract, "source contract ref mismatch");
  const source = readJson(files.sourceContract).exact_new_trial_003_memory_writer_target_resolution_preflight_design_no_write;
  assert(source.phase === expected.sourcePhase, "source contract phase mismatch");
  assert(source.go_no_go.exact_writer_target_resolved_now === false, "source contract must remain unresolved");
  assert(source.go_no_go.memory_write_can_execute_now === false, "source contract must not allow memory write");
}

function validateCommon(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);

  const target = record.target || {};
  const discovery = record.tool_surface_discovery || {};
  const observed = record.candidate_tool_contract_observed || {};
  const reconciliation = record.v0_6_93_contract_reconciliation || {};
  const goNoGo = record.go_no_go || {};
  const guard = record.guard || {};

  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === "completed_validated_memory_writer_candidate_surface_reconciliation_no_write", `${context} status mismatch`);
  assert(record.execution_mode === "tool_surface_reconciliation_no_write", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_reconciliation_only", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_reconciliation_only", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);
  assert(target.sample_id === expected.sampleId, `${context} sample mismatch`);
  assert(target.candidate_id === expected.candidateId, `${context} candidate mismatch`);
  assert(target.artifact_sha256 === expected.artifactSha256, `${context} hash mismatch`);

  assert(discovery.discovery_method === "tool_search_metadata_only", `${context} discovery method mismatch`);
  assert(discovery.tool_search_performed === true, `${context} tool search must be true`);
  assert(discovery.write_tool_metadata_visible === true, `${context} write tool metadata must be visible`);
  assert(discovery.candidate_tool_namespace === "mcp__vcp_codex_memory__", `${context} namespace mismatch`);
  assert(discovery.candidate_write_tool === "record_memory", `${context} candidate write tool mismatch`);
  assert(includesAll(discovery.candidate_read_tools || [], ["search_memory", "memory_overview"]), `${context} read tools incomplete`);
  assert(discovery.candidate_write_tool_called === false, `${context} candidate writer must not be called`);
  assert(discovery.candidate_read_tool_called === false, `${context} candidate read tools must not be called`);
  assert(discovery.external_memory_write_performed === false, `${context} external memory write must be false`);
  assert(discovery.raw_private_data_returned === false, `${context} raw private data must be false`);

  assert(observed.record_memory_description.includes("Write normal Codex memory"), `${context} record_memory description mismatch`);
  assert(includesAll(observed.record_memory_targets || [], ["process", "knowledge"]), `${context} record_memory targets mismatch`);
  assert(observed.has_daily_note_canonical_target_id === false, `${context} DailyNote target must be absent`);
  assert(observed.has_vcp_memory_exact_target_id === false, `${context} VCP target must be absent`);
  assert(observed.has_daily_note_root_preflight === false, `${context} root preflight must be absent`);
  assert(observed.has_post_write_daily_note_canonical_target_proof === false, `${context} canonical proof must be absent`);
  assert(observed.has_post_write_daily_note_content_hash_proof === false, `${context} hash proof must be absent`);
  assert(observed.has_two_step_daily_note_then_vcp_memory_chain === false, `${context} two-step chain must be absent`);
  assert(observed.has_bounded_two_entry_receipt_contract === false, `${context} bounded receipt must be absent`);

  assert(reconciliation.candidate_surface_is_write_capable === true, `${context} candidate must be write-capable`);
  assert(reconciliation.candidate_surface_is_codex_memory_only === true, `${context} candidate must be Codex memory only`);
  assert(reconciliation.candidate_surface_meets_exact_daily_note_target_requirement === false, `${context} DailyNote requirement must fail`);
  assert(reconciliation.candidate_surface_meets_exact_vcp_memory_target_requirement === false, `${context} VCP requirement must fail`);
  assert(reconciliation.candidate_surface_meets_canonical_hash_requirement === false, `${context} hash requirement must fail`);
  assert(reconciliation.candidate_surface_meets_dual_target_chain_requirement === false, `${context} dual-target chain must fail`);
  assert(reconciliation.candidate_surface_meets_v0_6_93_contract === false, `${context} source contract must not be satisfied`);
  assert(reconciliation.selected_writer_tool_or_command === null, `${context} must not select writer`);
  assert(reconciliation.exact_writer_target_resolved_now === false, `${context} target must not resolve`);
  assert(reconciliation.memory_write_can_execute_now === false, `${context} memory write must not execute`);

  assert(
    includesAll(record.forbidden_resolution_paths || [], [
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

  assert(goNoGo.tool_surface_reconciled === true, `${context} must reconcile tool surface`);
  assert(goNoGo.candidate_can_be_selected_as_exact_writer_now === false, `${context} candidate must not be selectable`);
  assert(goNoGo.memory_write_can_execute_now === false, `${context} memory write must be false`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  for (const [key, value] of Object.entries(guard)) {
    if (key === "reconciliation_only") {
      assert(value === true, `${context} reconciliation_only must be true`);
    } else {
      assert(value === false, `${context} guard.${key} must be false`);
    }
  }

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === false, `${context} auto execution must be false`);
  validateSourceContract(record);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_no_write_memory_writer_candidate_surface_reconciliation_receipt", "receipt type mismatch");
  assert(receipt.status === "completed_validated_memory_writer_candidate_surface_reconciliation_no_write", "receipt status mismatch");
  assert(receipt.lane_attempted === "Green_reconciliation_only", "receipt lane attempted mismatch");
  assert(receipt.lane_executed === "Green_reconciliation_only", "receipt lane executed mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.target_sample_id === expected.sampleId, "receipt sample mismatch");
  assert(receipt.target_candidate_id === expected.candidateId, "receipt candidate mismatch");
  assert(receipt.artifact_sha256 === expected.artifactSha256, "receipt hash mismatch");
  assert(receipt.calls_used.tool_search_metadata_queries === 1, "receipt tool search count mismatch");
  assert(receipt.calls_used.record_memory_calls === 0, "record_memory must not be called");
  assert(receipt.calls_used.memory_write_entries === 0, "memory writes must be zero");
  assert(receipt.candidate_result.candidate_write_tool_visible === true, "candidate writer must be visible");
  assert(receipt.candidate_result.candidate_write_tool_called === false, "candidate writer must not be called");
  assert(receipt.candidate_result.candidate_surface_meets_v0_6_93_contract === false, "candidate must not satisfy v0.6.93");
  assert(receipt.candidate_result.selected_writer_tool_or_command === null, "receipt must not select writer");
  assert(receipt.candidate_result.memory_write_can_execute_now === false, "receipt must block memory write");
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
  const report = readJson(files.report).memory_writer_candidate_surface_reconciliation_no_write;
  const receipt = readJson(files.receipt).memory_writer_candidate_surface_reconciliation_no_write;
  const passFixture = readJson(files.passFixture).memory_writer_candidate_surface_reconciliation_no_write;
  const failFixture = readJson(files.failFixture).memory_writer_candidate_surface_reconciliation_no_write;

  for (const token of [
    `phase: ${expected.phase}`,
    "candidate_write_tool_visible: true",
    "candidate_write_tool_called: false",
    "exact_daily_note_writer_resolved: false",
    "memory_write_can_execute_now: false",
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
    expectFailure(passFixture, "record_memory_called_fails", (candidate) => {
      candidate.tool_surface_discovery.candidate_write_tool_called = true;
    }),
    expectFailure(passFixture, "external_memory_write_fails", (candidate) => {
      candidate.tool_surface_discovery.external_memory_write_performed = true;
    }),
    expectFailure(passFixture, "daily_note_target_overclaim_fails", (candidate) => {
      candidate.candidate_tool_contract_observed.has_daily_note_canonical_target_id = true;
    }),
    expectFailure(passFixture, "canonical_hash_overclaim_fails", (candidate) => {
      candidate.v0_6_93_contract_reconciliation.candidate_surface_meets_canonical_hash_requirement = true;
    }),
    expectFailure(passFixture, "contract_satisfied_overclaim_fails", (candidate) => {
      candidate.v0_6_93_contract_reconciliation.candidate_surface_meets_v0_6_93_contract = true;
    }),
    expectFailure(passFixture, "selected_writer_overclaim_fails", (candidate) => {
      candidate.v0_6_93_contract_reconciliation.selected_writer_tool_or_command = "record_memory";
    }),
    expectFailure(passFixture, "memory_write_allowed_fails", (candidate) => {
      candidate.go_no_go.memory_write_can_execute_now = true;
    }),
    expectFailure(passFixture, "forbidden_call_missing_fails", (candidate) => {
      candidate.forbidden_resolution_paths = candidate.forbidden_resolution_paths.filter((item) => item !== "call_record_memory");
    }),
    expectFailure(passFixture, "codex_memory_write_claim_fails", (candidate) => {
      candidate.guard.Codex_memory_write_performed = true;
    }),
    expectFailure(passFixture, "next_auto_allowed_fails", (candidate) => {
      candidate.recommended_next_auto_execution_allowed = true;
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    candidate_write_tool_visible: report.tool_surface_discovery.write_tool_metadata_visible,
    candidate_write_tool: report.tool_surface_discovery.candidate_write_tool,
    candidate_write_tool_called: report.tool_surface_discovery.candidate_write_tool_called,
    candidate_surface_meets_v0_6_93_contract: report.v0_6_93_contract_reconciliation.candidate_surface_meets_v0_6_93_contract,
    exact_writer_target_resolved_now: report.v0_6_93_contract_reconciliation.exact_writer_target_resolved_now,
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
