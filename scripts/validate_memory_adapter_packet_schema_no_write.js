#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const yaml = require("yaml");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_96_MEMORY_ADAPTER_PACKET_SCHEMA_NO_WRITE.md",
  schema: "schemas/memory_adapter_packet.schema.yaml",
  report: "reports/visual_asset_eval_dry_run/v0_6_96_memory_adapter_packet_schema_no_write.json",
  receipt: "reports/memory_write_receipts/v0_3_3_exact_new_trial_003_shot_2_memory_adapter_packet_schema_no_write.json",
  passFixture: "tests/schema_examples/memory_adapter_packet_schema_no_write.example.json",
  failFixture: "tests/schema_examples/memory_adapter_packet_schema_no_write_fail.example.json",
  sourceReport: "reports/visual_asset_eval_dry_run/v0_6_95_codex_memory_candidate_adapter_mapping_no_write.json"
};

const expected = {
  phase: "v0_6_96_memory_adapter_packet_schema_no_write",
  sourcePhase: "v0_6_95_codex_memory_candidate_adapter_mapping_no_write",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  artifactSha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  schemaId: "memory_adapter_packet.schema.v1",
  recommendedNext: "fill_concrete_memory_adapter_packet_no_write_or_pause"
};

const requiredTopLevel = [
  "version",
  "packet_id",
  "phase",
  "source_refs",
  "target",
  "candidate_surface",
  "adapter_mapping",
  "execution_limits",
  "preflight_requirements",
  "post_write_evidence_requirements",
  "receipt_plan",
  "rollback_or_cleanup_plan",
  "stop_conditions",
  "guard",
  "go_no_go"
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

function readYaml(relativePath) {
  return yaml.parse(read(relativePath));
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

function validateSchemaDocument(schema) {
  assert(schema.schema_id === expected.schemaId, "schema id mismatch");
  assert(includesAll(schema.required_top_level_fields || [], requiredTopLevel), "schema top-level fields incomplete");
  assert(schema.required_values.version === "v1", "schema version requirement mismatch");
  assert(schema.required_values.execute_now_default === false, "schema execute default must be false");
  assert(schema.required_values.secret_value_read_allowed === false, "schema secret read must be false");
  assert(schema.required_values.raw_private_data_print_allowed === false, "schema raw private print must be false");
  assert(schema.required_values.max_write_entries === 2, "schema max write entries mismatch");
  assert(schema.required_values.max_plugin_calls === 1, "schema max plugin calls mismatch");
  assert(schema.required_values.max_api_calls === 0, "schema max api calls mismatch");
  assert(includesAll(schema.required_target_fields || [], ["exact_daily_note_target_id", "exact_vcp_memory_target_id"]), "schema target fields incomplete");
  assert(includesAll(schema.required_adapter_mapping_fields || [], ["selected_writer_tool_or_command", "two_phase_ordering"]), "schema adapter fields incomplete");
  assert(includesAll(schema.required_post_write_evidence || [], ["daily_note_content_hash_proof", "vcp_memory_receipt_id_or_immutable_ref"]), "schema post-write evidence incomplete");
  assert(includesAll(schema.forbidden_actions || [], ["call_record_memory_during_packet_validation", "read_env_or_secret_files", "push_tag_release_deploy"]), "schema forbidden actions incomplete");
}

function validateSource() {
  const source = readJson(files.sourceReport).codex_memory_candidate_adapter_mapping_no_write;
  assert(source.phase === expected.sourcePhase, "source phase mismatch");
  assert(source.go_no_go.adapter_mapping_created === true, "source mapping must exist");
  assert(source.go_no_go.adapter_packet_schema_created === false, "source must not already create schema");
  assert(source.guard.record_memory_called === false, "source must not call record_memory");
}

function validateCommon(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);

  const target = record.target || {};
  const summary = record.schema_summary || {};
  const fields = record.required_contract_fields || {};
  const limits = (fields.execution_limits || {});
  const example = record.example_packet || {};
  const goNoGo = record.go_no_go || {};
  const guard = record.guard || {};

  assert(record.version === "v1", `${context} version mismatch`);
  assert(record.phase === expected.phase, `${context} phase mismatch`);
  assert(record.status === "completed_validated_memory_adapter_packet_schema_no_write", `${context} status mismatch`);
  assert(record.execution_mode === "memory_adapter_packet_schema_no_write", `${context} execution mode mismatch`);
  assert(record.lane_attempted === "Green_schema_only", `${context} lane attempted mismatch`);
  assert(record.lane_executed === "Green_schema_only", `${context} lane executed mismatch`);
  assert(record.source_phase === expected.sourcePhase, `${context} source phase mismatch`);
  assert(record.schema_ref === files.schema, `${context} schema ref mismatch`);
  assert(target.sample_id === expected.sampleId, `${context} sample mismatch`);
  assert(target.candidate_id === expected.candidateId, `${context} candidate mismatch`);
  assert(target.artifact_sha256 === expected.artifactSha256, `${context} hash mismatch`);

  assert(summary.adapter_packet_schema_created === true, `${context} schema must be created`);
  assert(summary.schema_static_only === true, `${context} schema must be static only`);
  assert(summary.concrete_packet_instance_created === false, `${context} concrete packet must be false`);
  assert(summary.writer_selected === false, `${context} writer must not be selected`);
  assert(summary.adapter_can_execute_now === false, `${context} adapter must not execute`);
  assert(summary.execute_now_default === false, `${context} execute default must be false`);
  assert(summary.required_top_level_field_count === 14, `${context} top-level count mismatch`);
  assert(includesAll(record.required_top_level_fields || [], requiredTopLevel), `${context} required top-level fields incomplete`);

  assert(includesAll(fields.target || [], ["exact_daily_note_target_id", "exact_vcp_memory_target_id"]), `${context} target contract incomplete`);
  assert(includesAll(fields.adapter_mapping || [], ["selected_writer_tool_or_command", "record_memory_target_mapping", "two_phase_ordering"]), `${context} adapter contract incomplete`);
  assert(limits.max_write_entries === 2, `${context} max write entries mismatch`);
  assert(limits.max_plugin_calls === 1, `${context} max plugin calls mismatch`);
  assert(limits.max_api_calls === 0, `${context} max api calls mismatch`);
  assert(limits.secret_value_read_allowed === false, `${context} secret read must be false`);
  assert(limits.raw_private_data_print_allowed === false, `${context} raw private print must be false`);
  assert(limits.execute_now_default === false, `${context} execute default must be false`);

  assert(example.execute_now === false, `${context} example execute_now must be false`);
  assert(example.selected_writer_tool_or_command === null, `${context} example must not select writer`);
  assert(example.writer_kind === null, `${context} example writer kind must be null`);
  assert(example.record_memory_target_mapping.candidate_only === true, `${context} example record_memory mapping must be candidate-only`);
  assert(example.preflight_requirements_satisfied_now === false, `${context} preflight must be unsatisfied`);
  assert(example.post_write_evidence_available_now === false, `${context} post-write evidence must be unavailable`);

  assert(
    includesAll(record.forbidden_actions_preserved || [], [
      "call_record_memory_during_packet_validation",
      "call_daily_note_writer_during_packet_validation",
      "call_vcp_memory_writer_during_packet_validation",
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

  assert(goNoGo.schema_created === true, `${context} schema must be created`);
  assert(goNoGo.concrete_packet_instance_created === false, `${context} concrete packet must be false`);
  assert(goNoGo.adapter_can_execute_now === false, `${context} adapter must not execute`);
  assert(goNoGo.memory_write_can_execute_now === false, `${context} memory write must not execute`);
  assert(goNoGo.next_auto_step_allowed === false, `${context} next auto must be false`);

  for (const [key, value] of Object.entries(guard)) {
    if (key === "schema_only") {
      assert(value === true, `${context} schema_only must be true`);
    } else {
      assert(value === false, `${context} guard.${key} must be false`);
    }
  }

  assert(record.recommended_next === expected.recommendedNext, `${context} recommended next mismatch`);
  assert(record.recommended_next_auto_execution_allowed === true, `${context} next no-write step should be allowed`);
}

function validateReceipt(receipt) {
  assert(receipt.phase === expected.phase, "receipt phase mismatch");
  assert(receipt.receipt_type === "green_no_write_memory_adapter_packet_schema_receipt", "receipt type mismatch");
  assert(receipt.status === "completed_validated_memory_adapter_packet_schema_no_write", "receipt status mismatch");
  assert(receipt.source_phase === expected.sourcePhase, "receipt source phase mismatch");
  assert(receipt.target_sample_id === expected.sampleId, "receipt sample mismatch");
  assert(receipt.target_candidate_id === expected.candidateId, "receipt candidate mismatch");
  assert(receipt.artifact_sha256 === expected.artifactSha256, "receipt hash mismatch");
  assert(receipt.calls_used.record_memory_calls === 0, "record_memory calls must be zero");
  assert(receipt.calls_used.memory_write_entries === 0, "memory write entries must be zero");
  assert(receipt.schema_result.adapter_packet_schema_created === true, "receipt schema must be created");
  assert(receipt.schema_result.concrete_packet_instance_created === false, "receipt concrete packet must be false");
  assert(receipt.schema_result.adapter_can_execute_now === false, "receipt adapter must not execute");
  assert(receipt.schema_result.memory_write_can_execute_now === false, "receipt memory write must be false");
  assert(receipt.next_auto_step_allowed === true, "receipt should allow next no-write fill step");
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

  validateSource();
  validateSchemaDocument(readYaml(files.schema));

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).memory_adapter_packet_schema_no_write;
  const receipt = readJson(files.receipt).memory_adapter_packet_schema_no_write;
  const passFixture = readJson(files.passFixture).memory_adapter_packet_schema_no_write;
  const failFixture = readJson(files.failFixture).memory_adapter_packet_schema_no_write;

  for (const token of [
    `phase: ${expected.phase}`,
    "adapter_packet_schema_created: true",
    "example_packet_execute_now: false",
    "adapter_can_execute_now: false",
    "record_memory_called: false",
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
    expectFailure(passFixture, "concrete_packet_overclaim_fails", (candidate) => {
      candidate.schema_summary.concrete_packet_instance_created = true;
    }),
    expectFailure(passFixture, "writer_selected_fails", (candidate) => {
      candidate.example_packet.selected_writer_tool_or_command = "record_memory";
    }),
    expectFailure(passFixture, "execute_now_true_fails", (candidate) => {
      candidate.example_packet.execute_now = true;
    }),
    expectFailure(passFixture, "secret_allowed_fails", (candidate) => {
      candidate.required_contract_fields.execution_limits.secret_value_read_allowed = true;
    }),
    expectFailure(passFixture, "top_level_fields_missing_fails", (candidate) => {
      candidate.required_top_level_fields = ["version"];
    }),
    expectFailure(passFixture, "post_write_evidence_overclaim_fails", (candidate) => {
      candidate.example_packet.post_write_evidence_available_now = true;
    }),
    expectFailure(passFixture, "adapter_execute_now_fails", (candidate) => {
      candidate.go_no_go.adapter_can_execute_now = true;
    }),
    expectFailure(passFixture, "memory_write_allowed_fails", (candidate) => {
      candidate.go_no_go.memory_write_can_execute_now = true;
    }),
    expectFailure(passFixture, "record_memory_called_fails", (candidate) => {
      candidate.guard.record_memory_called = true;
    }),
    expectFailure(passFixture, "forbidden_record_memory_missing_fails", (candidate) => {
      candidate.forbidden_actions_preserved = candidate.forbidden_actions_preserved.filter((item) => item !== "call_record_memory_during_packet_validation");
    })
  ];

  const output = {
    phase: report.phase,
    passed: true,
    status: report.status,
    source_phase: report.source_phase,
    schema_ref: report.schema_ref,
    adapter_packet_schema_created: report.schema_summary.adapter_packet_schema_created,
    concrete_packet_instance_created: report.schema_summary.concrete_packet_instance_created,
    adapter_can_execute_now: report.go_no_go.adapter_can_execute_now,
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
