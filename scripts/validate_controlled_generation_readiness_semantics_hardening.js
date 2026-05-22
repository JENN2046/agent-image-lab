#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_5_controlled_generation_readiness_semantics_hardening";
const docPath = "docs/V0_5_5_CONTROLLED_GENERATION_READINESS_SEMANTICS_HARDENING.md";
const schemaPath = "schemas/controlled_generation_readiness_semantics_hardening.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_5_controlled_generation_readiness_semantics_hardening.json";
const passFixturePath = "tests/schema_examples/controlled_generation_readiness_semantics_hardening.example.json";
const failFixturePath = "tests/schema_examples/controlled_generation_readiness_semantics_hardening_fail.example.json";
const readinessPacketPath = "reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

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

function assertNoSecretOrRawPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Generated image path found in ${context}`);
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

function validateSourceReadinessPacket() {
  const readiness = readJson(readinessPacketPath).controlled_generation_readiness_packet;
  assert(readiness.phase === "v0_5_0_controlled_generation_readiness_packet", "source readiness packet phase mismatch");
  assert(readiness.max_generation_calls.actual_generation_calls === 0, "source readiness actual generation calls must remain zero");
  assert(readiness.max_generation_calls.future_execution_authorized_by_this_packet === false, "source readiness packet must not authorize execution");
  assert(readiness.review_gate.review_required_before_acceptance === true, "source readiness review gate missing");
  assert(readiness.failure_stop_condition.stop_on_review_gate_failure === true, "source readiness failure stop condition missing");
  return readiness;
}

function validateRecord(record) {
  assert(record && typeof record === "object", "readiness semantics hardening record missing");
  assertNoSecretOrRawPath(record, "controlled_generation_readiness_semantics_hardening");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_readiness_packet_ref === readinessPacketPath, "source readiness packet ref mismatch");

  validateSourceReadinessPacket();

  const readinessState = record.readiness_state;
  assert(readinessState && typeof readinessState === "object", "readiness_state missing");
  assert(readinessState.readiness === true, "readiness must be true");
  assert(readinessState.no_execute_now === true, "no_execute_now must be true");
  assert(readinessState.max_generation_calls_present === true, "max_generation_calls must be present when readiness=true");
  assert(readinessState.review_gate_present === true, "review_gate must be present when readiness=true");
  assert(readinessState.failure_stop_condition_present === true, "failure_stop_condition must be present when readiness=true");

  const semantics = record.semantic_assertions;
  assert(semantics && typeof semantics === "object", "semantic_assertions missing");
  assert(semantics.readiness_true_requires_failure_stop_condition === true, "semantic hardening must require failure_stop_condition");
  assert(semantics.readiness_true_requires_review_gate === true, "semantic hardening must require review_gate");
  assert(semantics.readiness_true_requires_max_generation_calls === true, "semantic hardening must require max_generation_calls");
  assert(semantics.no_execute_now_must_be_true === true, "semantic hardening must require no_execute_now=true");
  assert(semantics.field_complete_but_executable_hollow_blocked === true, "semantic hardening must block hollow readiness");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.semantics_only === true, "semantics_only must be true");
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
    return {
      case_id: caseId,
      result: "caught",
      failure_message: error.message
    };
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
  assert(invalidFixtureCaught, "invalid readiness semantics fixture must fail");

  const cases = [
    expectFailure(validRecord, "readiness_false_fails", (candidate) => {
      candidate.readiness_state.readiness = false;
    }),
    expectFailure(validRecord, "no_execute_now_false_fails", (candidate) => {
      candidate.readiness_state.no_execute_now = false;
    }),
    expectFailure(validRecord, "missing_max_generation_calls_fails", (candidate) => {
      candidate.readiness_state.max_generation_calls_present = false;
    }),
    expectFailure(validRecord, "missing_review_gate_fails", (candidate) => {
      candidate.readiness_state.review_gate_present = false;
    }),
    expectFailure(validRecord, "missing_failure_stop_condition_fails", (candidate) => {
      candidate.readiness_state.failure_stop_condition_present = false;
    }),
    expectFailure(validRecord, "semantic_max_generation_calls_guard_fails", (candidate) => {
      candidate.semantic_assertions.readiness_true_requires_max_generation_calls = false;
    }),
    expectFailure(validRecord, "semantic_review_gate_guard_fails", (candidate) => {
      candidate.semantic_assertions.readiness_true_requires_review_gate = false;
    }),
    expectFailure(validRecord, "semantic_failure_stop_guard_fails", (candidate) => {
      candidate.semantic_assertions.readiness_true_requires_failure_stop_condition = false;
    }),
    expectFailure(validRecord, "semantic_no_execute_guard_fails", (candidate) => {
      candidate.semantic_assertions.no_execute_now_must_be_true = false;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
    }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "daily_note_write_true_fails", (candidate) => {
      candidate.side_effects.DailyNote_write_performed = true;
    }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => {
      candidate.side_effects.production_candidate_created = true;
    }),
    expectFailure(validRecord, "push_l2_exercised_true_fails", (candidate) => {
      candidate.boundaries.Push_L2_exercised = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.readiness_semantics_id = "C:\\private\\readiness.json";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.readiness_semantics_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    no_execute_now_guard_caught: cases.some((item) => item.case_id === "no_execute_now_false_fails" && item.result === "caught"),
    max_generation_calls_guard_caught: cases.some((item) => item.case_id === "missing_max_generation_calls_fails" && item.result === "caught"),
    review_gate_guard_caught: cases.some((item) => item.case_id === "missing_review_gate_fails" && item.result === "caught"),
    failure_stop_condition_guard_caught: cases.some((item) => item.case_id === "missing_failure_stop_condition_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "memory_write_true_fails" && item.result === "caught"),
    production_candidate_caught: cases.some((item) => item.case_id === "production_candidate_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).controlled_generation_readiness_semantics_hardening;
  const validRecord = readJson(passFixturePath).controlled_generation_readiness_semantics_hardening;
  const invalidRecord = readJson(failFixturePath).controlled_generation_readiness_semantics_hardening;

  for (const token of [
    "readiness=true",
    "failure_stop_condition",
    "review_gate",
    "max_generation_calls",
    "no_execute_now"
  ]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("controlled_generation_readiness_semantics_hardening"), "schema must define readiness semantics hardening");
  assert(mvp.includes("validate_controlled_generation_readiness_semantics_hardening.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_5_CONTROLLED_GENERATION_READINESS_SEMANTICS_HARDENING_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_controlled_generation_readiness_semantics_hardening",
    phase,
    semantics_doc_present: true,
    semantics_schema_present: true,
    semantics_report_present: true,
    semantics_fixture_present: true,
    semantics_fail_fixture_present: true,
    source_readiness_packet_verified: true,
    readiness_true_enforced: true,
    no_execute_now_true: true,
    max_generation_calls_required: true,
    review_gate_required: true,
    failure_stop_condition_required: true,
    field_complete_but_executable_hollow_blocked: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    no_execute_now_guard_caught: negativeCaseSummary.no_execute_now_guard_caught,
    max_generation_calls_guard_caught: negativeCaseSummary.max_generation_calls_guard_caught,
    review_gate_guard_caught: negativeCaseSummary.review_gate_guard_caught,
    failure_stop_condition_guard_caught: negativeCaseSummary.failure_stop_condition_guard_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    production_candidate_caught: negativeCaseSummary.production_candidate_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    dry_run_only: true,
    semantics_only: true,
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
