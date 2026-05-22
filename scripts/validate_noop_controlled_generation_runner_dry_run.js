#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_7_noop_controlled_generation_runner_dry_run";
const docPath = "docs/V0_5_7_NOOP_CONTROLLED_GENERATION_RUNNER_DRY_RUN.md";
const schemaPath = "schemas/noop_controlled_generation_runner_dry_run.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_7_noop_controlled_generation_runner_dry_run.json";
const passFixturePath = "tests/schema_examples/noop_controlled_generation_runner_dry_run.example.json";
const failFixturePath = "tests/schema_examples/noop_controlled_generation_runner_dry_run_fail.example.json";
const promptPreviewPath = "reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json";
const readinessSemanticsPath = "reports/visual_asset_eval_dry_run/v0_5_5_controlled_generation_readiness_semantics_hardening.json";
const reviewGatePath = "reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const allowedNoopOutputs = ["would_generate", "would_review", "would_stop"];
const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "VCP_memory_write_performed",
  "DailyNote_write_performed",
  "runtime_call_performed",
  "secret_value_read_performed",
  "production_candidate_created",
  "accepted_sample_auto_promotion",
  "memory_seed_promoted",
  "package_dependency_change_performed",
  "commit_performed",
  "push_performed"
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sameStringList(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

function assertNoSecretOrRawPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretOrRawPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoSecretOrRawPath(item, `${context}.${key}`));
  }
}

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateSources() {
  const preview = readJson(promptPreviewPath).prompt_package_preview;
  const semantics = readJson(readinessSemanticsPath).controlled_generation_readiness_semantics_hardening;
  const reviewGate = readJson(reviewGatePath).human_review_gate_packet;
  assert(preview.phase === "v0_5_1_prompt_package_preview", "prompt preview phase mismatch");
  assert(preview.boundaries.actual_generation_calls === 0, "prompt preview actual generation calls must remain zero");
  assert(semantics.phase === "v0_5_5_controlled_generation_readiness_semantics_hardening", "readiness semantics phase mismatch");
  assert(semantics.readiness_state.no_execute_now === true, "readiness semantics must keep no_execute_now true");
  assert(reviewGate.phase === "v0_5_6_human_review_gate_packet", "review gate phase mismatch");
  assert(reviewGate.reviewer_required.enabled === true, "review gate reviewer requirement missing");
  return { preview, semantics, reviewGate };
}

function validateRecord(record) {
  assert(record && typeof record === "object", "noop controlled generation runner record missing");
  assertNoSecretOrRawPath(record, "noop_controlled_generation_runner_dry_run");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_prompt_package_preview_ref === promptPreviewPath, "prompt preview ref mismatch");
  assert(record.source_readiness_semantics_ref === readinessSemanticsPath, "readiness semantics ref mismatch");
  assert(record.source_review_gate_packet_ref === reviewGatePath, "review gate ref mismatch");
  assert(record.runner_mode === "no_op_controlled_generation_dry_run_only", "runner_mode must remain no-op");
  assert(sameStringList(record.allowed_noop_outputs, allowedNoopOutputs), "allowed_noop_outputs mismatch");
  assert(record.selected_dry_run_sequence === "would_generate_then_would_review_then_would_stop", "selected_dry_run_sequence mismatch");

  const sources = validateSources();
  assert(sources.reviewGate.max_generation_calls.actual_generation_calls === 0, "source review gate actual generation calls must remain zero");

  assert(record.would_generate?.emit === true, "would_generate must emit");
  assert(record.would_generate?.actual_generation_call_performed === false, "would_generate must not perform actual generation");
  assert(record.would_generate?.provider_dispatch_allowed === false, "would_generate must not allow provider dispatch");

  assert(record.would_review?.emit === true, "would_review must emit");
  assert(record.would_review?.actual_review_report_written === false, "would_review must not write actual review report");
  assert(record.would_review?.human_review_required_before_execution === true, "would_review must keep human review required");

  assert(record.would_stop?.emit === true, "would_stop must emit");
  assert(record.would_stop?.actual_executor_stop_performed === false, "would_stop must not stop a real executor");
  assert(typeof record.would_stop?.stop_reason === "string" && record.would_stop.stop_reason.length > 0, "would_stop reason required");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.noop_runner_only === true, "noop_runner_only must be true");
  assert(record.boundaries?.actual_generation_calls === 0, "actual_generation_calls must remain zero");
  assert(record.boundaries?.real_executor_implemented_now === false, "real executor must remain false");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2 must remain false");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateRecord(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid noop controlled generation runner fixture must fail");

  const cases = [
    expectFailure(validRecord, "runner_mode_real_executor_fails", (candidate) => { candidate.runner_mode = "real_executor"; }),
    expectFailure(validRecord, "allowed_noop_outputs_drift_fails", (candidate) => { candidate.allowed_noop_outputs = ["would_generate", "generate_now"]; }),
    expectFailure(validRecord, "selected_dry_run_sequence_drift_fails", (candidate) => { candidate.selected_dry_run_sequence = "generate_now"; }),
    expectFailure(validRecord, "would_generate_emit_false_fails", (candidate) => { candidate.would_generate.emit = false; }),
    expectFailure(validRecord, "actual_generation_call_true_fails", (candidate) => { candidate.would_generate.actual_generation_call_performed = true; }),
    expectFailure(validRecord, "provider_dispatch_allowed_true_fails", (candidate) => { candidate.would_generate.provider_dispatch_allowed = true; }),
    expectFailure(validRecord, "would_review_emit_false_fails", (candidate) => { candidate.would_review.emit = false; }),
    expectFailure(validRecord, "actual_review_report_written_true_fails", (candidate) => { candidate.would_review.actual_review_report_written = true; }),
    expectFailure(validRecord, "human_review_required_false_fails", (candidate) => { candidate.would_review.human_review_required_before_execution = false; }),
    expectFailure(validRecord, "would_stop_emit_false_fails", (candidate) => { candidate.would_stop.emit = false; }),
    expectFailure(validRecord, "actual_executor_stop_performed_true_fails", (candidate) => { candidate.would_stop.actual_executor_stop_performed = true; }),
    expectFailure(validRecord, "stop_reason_missing_fails", (candidate) => { candidate.would_stop.stop_reason = ""; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
    expectFailure(validRecord, "push_l2_true_fails", (candidate) => { candidate.boundaries.Push_L2_exercised = true; }),
    expectFailure(validRecord, "real_executor_true_fails", (candidate) => { candidate.boundaries.real_executor_implemented_now = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.runner_dry_run_id = "C:\\private\\runner.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.runner_dry_run_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    runner_mode_guard_caught: cases.some((item) => item.case_id === "runner_mode_real_executor_fails" && item.result === "caught"),
    would_generate_guard_caught: cases.some((item) => item.case_id === "actual_generation_call_true_fails" && item.result === "caught"),
    would_review_guard_caught: cases.some((item) => item.case_id === "actual_review_report_written_true_fails" && item.result === "caught"),
    would_stop_guard_caught: cases.some((item) => item.case_id === "actual_executor_stop_performed_true_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "memory_write_true_fails" && item.result === "caught"),
    runtime_call_caught: cases.some((item) => item.case_id === "runtime_call_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).noop_controlled_generation_runner_dry_run;
  const validRecord = readJson(passFixturePath).noop_controlled_generation_runner_dry_run;
  const invalidRecord = readJson(failFixturePath).noop_controlled_generation_runner_dry_run;

  for (const token of ["would_generate", "would_review", "would_stop", "no_op_controlled_generation_dry_run_only"]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("noop_controlled_generation_runner_dry_run"), "schema must define noop controlled generation runner dry run");
  assert(mvp.includes("validate_noop_controlled_generation_runner_dry_run.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_7_NOOP_CONTROLLED_GENERATION_RUNNER_DRY_RUN_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_noop_controlled_generation_runner_dry_run",
    phase,
    runner_doc_present: true,
    runner_schema_present: true,
    runner_report_present: true,
    runner_fixture_present: true,
    runner_fail_fixture_present: true,
    source_prompt_package_preview_verified: true,
    source_readiness_semantics_verified: true,
    source_review_gate_packet_verified: true,
    would_generate: true,
    would_review: true,
    would_stop: true,
    actual_generation_calls_zero: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    runner_mode_guard_caught: negativeCaseSummary.runner_mode_guard_caught,
    would_generate_guard_caught: negativeCaseSummary.would_generate_guard_caught,
    would_review_guard_caught: negativeCaseSummary.would_review_guard_caught,
    would_stop_guard_caught: negativeCaseSummary.would_stop_guard_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    runtime_call_caught: negativeCaseSummary.runtime_call_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    dry_run_only: true,
    noop_runner_only: true,
    Push_L2_exercised: false,
    real_executor_implemented_now: false,
    provider_call_performed: false,
    image_generation_performed: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    production_candidate_created: false,
    accepted_sample_auto_promotion: false,
    memory_seed_promoted: false,
    package_dependency_change_performed: false,
    commit_performed: false,
    push_performed: false
  };
  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
