#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_1_fifteen_day_controlled_generation_readiness_checkpoint";
const docPath = "docs/V0_6_1_FIFTEEN_DAY_CONTROLLED_GENERATION_READINESS_CHECKPOINT.md";
const schemaPath = "schemas/fifteen_day_controlled_generation_readiness_checkpoint.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_1_fifteen_day_controlled_generation_readiness_checkpoint.json";
const passFixturePath = "tests/schema_examples/fifteen_day_controlled_generation_readiness_checkpoint.example.json";
const failFixturePath = "tests/schema_examples/fifteen_day_controlled_generation_readiness_checkpoint_fail.example.json";
const readinessSemanticsPath = "reports/visual_asset_eval_dry_run/v0_5_5_controlled_generation_readiness_semantics_hardening.json";
const humanReviewGatePath = "reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json";
const noopRunnerPath = "reports/visual_asset_eval_dry_run/v0_5_7_noop_controlled_generation_runner_dry_run.json";
const evidenceContractPath = "reports/visual_asset_eval_dry_run/v0_5_8_controlled_generation_evidence_contract.json";
const readonlyQueryContractPath = "reports/visual_asset_eval_dry_run/v0_5_9_visual_memory_readonly_query_contract.json";
const firstAuthorizationPacketPath = "reports/visual_asset_eval_dry_run/v0_6_0_first_controlled_generation_authorization_packet.json";
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

function assertFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateSources() {
  const readinessSemantics = readJson(readinessSemanticsPath).controlled_generation_readiness_semantics_hardening;
  const humanReviewGate = readJson(humanReviewGatePath).human_review_gate_packet;
  const noopRunner = readJson(noopRunnerPath).noop_controlled_generation_runner_dry_run;
  const evidenceContract = readJson(evidenceContractPath).controlled_generation_evidence_contract;
  const readonlyQueryContract = readJson(readonlyQueryContractPath).visual_memory_readonly_query_contract;
  const firstAuthorizationPacket = readJson(firstAuthorizationPacketPath).first_controlled_generation_authorization_packet;
  const records = { readinessSemantics, humanReviewGate, noopRunner, evidenceContract, readonlyQueryContract, firstAuthorizationPacket };
  assertNoSecretOrRawPath(records, "fifteen_day_controlled_generation_sources");

  assert(readinessSemantics.phase === "v0_5_5_controlled_generation_readiness_semantics_hardening", "readiness semantics phase mismatch");
  assert(readinessSemantics.semantic_assertions?.readiness_true_requires_failure_stop_condition === true, "readiness semantics must require failure stop condition");
  assert(readinessSemantics.semantic_assertions?.readiness_true_requires_review_gate === true, "readiness semantics must require review gate");
  assert(readinessSemantics.semantic_assertions?.readiness_true_requires_max_generation_calls === true, "readiness semantics must require max generation calls");
  assert(readinessSemantics.readiness_state?.no_execute_now === true, "readiness semantics must keep no_execute_now");

  assert(humanReviewGate.phase === "v0_5_6_human_review_gate_packet", "human review gate phase mismatch");
  assert(humanReviewGate.reviewer_required?.enabled === true, "human reviewer must remain required");
  assert(humanReviewGate.approval_scope?.allowed_action === "future_single_controlled_generation_after_explicit_A5_only", "human review gate allowed action mismatch");

  assert(noopRunner.phase === "v0_5_7_noop_controlled_generation_runner_dry_run", "noop runner phase mismatch");
  assert(noopRunner.would_generate?.emit === true, "noop runner must simulate would_generate");
  assert(noopRunner.would_review?.emit === true, "noop runner must simulate would_review");
  assert(noopRunner.would_stop?.emit === true, "noop runner must simulate would_stop");

  assert(evidenceContract.phase === "v0_5_8_controlled_generation_evidence_contract", "evidence contract phase mismatch");
  assert(evidenceContract.evidence_assertions?.all_required_refs_present === true, "evidence contract must keep all required refs");

  assert(readonlyQueryContract.phase === "v0_5_9_visual_memory_readonly_query_contract", "readonly query contract phase mismatch");
  assert(readonlyQueryContract.no_write_flags?.VCP_memory_write_allowed === false, "readonly query contract must keep memory writes blocked");

  assert(firstAuthorizationPacket.phase === "v0_6_0_first_controlled_generation_authorization_packet", "first authorization packet phase mismatch");
  assert(firstAuthorizationPacket.explicit_A5_required?.enabled === true, "first authorization packet must keep explicit A5 required");
  assert(firstAuthorizationPacket.explicit_A5_required?.execution_authorized_now === false, "first authorization packet must remain inactive");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "fifteen day controlled generation readiness checkpoint missing");
  assertNoSecretOrRawPath(record, "fifteen_day_controlled_generation_readiness_checkpoint");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_readiness_semantics_hardening_ref === readinessSemanticsPath, "source readiness semantics ref mismatch");
  assert(record.source_human_review_gate_packet_ref === humanReviewGatePath, "source human review gate ref mismatch");
  assert(record.source_noop_generation_runner_ref === noopRunnerPath, "source noop runner ref mismatch");
  assert(record.source_evidence_contract_ref === evidenceContractPath, "source evidence contract ref mismatch");
  assert(record.source_visual_memory_readonly_query_contract_ref === readonlyQueryContractPath, "source readonly query contract ref mismatch");
  assert(record.source_first_generation_authorization_packet_ref === firstAuthorizationPacketPath, "source first authorization packet ref mismatch");

  validateSources();

  const assertions = record.checkpoint_assertions;
  assert(assertions.readiness_semantics_hardening_exists === true, "readiness semantics hardening must exist");
  assert(assertions.human_review_gate_packet_exists === true, "human review gate packet must exist");
  assert(assertions.noop_generation_runner_exists === true, "noop generation runner must exist");
  assert(assertions.evidence_contract_exists === true, "evidence contract must exist");
  assert(assertions.visual_memory_readonly_query_contract_exists === true, "readonly query contract must exist");
  assert(assertions.first_generation_authorization_packet_exists === true, "first generation authorization packet must exist");
  assert(assertions.image_generation === false, "image_generation must remain false");
  assert(assertions.memory_write === false, "memory_write must remain false");
  assert(assertions.real_executor === false, "real_executor must remain false");

  const capabilities = record.workflow_capabilities;
  assert(capabilities.readiness_semantics_hardened === true, "readiness semantics capability missing");
  assert(capabilities.human_review_gate_defined === true, "human review gate capability missing");
  assert(capabilities.noop_generation_runner_defined === true, "noop generation runner capability missing");
  assert(capabilities.evidence_contract_defined === true, "evidence contract capability missing");
  assert(capabilities.readonly_query_contract_defined === true, "readonly query contract capability missing");
  assert(capabilities.first_authorization_packet_defined === true, "first authorization packet capability missing");

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length > 0, "next_route_options required");
  assert(record.next_route_options.every((item) => !/execute_real_generation_now|provider_call|memory_write/i.test(item)), "next route options must not authorize execution");

  assert(record.boundaries?.metadata_only === true, "checkpoint must remain metadata-only");
  assert(record.boundaries?.dry_run_only === true, "checkpoint must remain dry-run-only");
  assert(record.boundaries?.checkpoint_only === true, "checkpoint must remain checkpoint-only");
  assert(record.boundaries?.image_generation === false, "boundary image_generation must remain false");
  assert(record.boundaries?.memory_write === false, "boundary memory_write must remain false");
  assert(record.boundaries?.real_executor === false, "boundary real_executor must remain false");
  assert(record.boundaries?.real_executor_implemented_now === false, "real executor must remain false");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2 must remain false");
  assertFalseFlags(record.boundaries, "boundaries");
  assertFalseFlags(record.side_effects, "side_effects");
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
  assert(invalidFixtureCaught, "invalid fifteen day controlled generation readiness checkpoint fixture must fail");

  const cases = [
    expectFailure(validRecord, "readiness_semantics_missing_fails", (candidate) => { candidate.checkpoint_assertions.readiness_semantics_hardening_exists = false; }),
    expectFailure(validRecord, "human_review_gate_missing_fails", (candidate) => { candidate.checkpoint_assertions.human_review_gate_packet_exists = false; }),
    expectFailure(validRecord, "noop_runner_missing_fails", (candidate) => { candidate.checkpoint_assertions.noop_generation_runner_exists = false; }),
    expectFailure(validRecord, "evidence_contract_missing_fails", (candidate) => { candidate.checkpoint_assertions.evidence_contract_exists = false; }),
    expectFailure(validRecord, "readonly_query_contract_missing_fails", (candidate) => { candidate.checkpoint_assertions.visual_memory_readonly_query_contract_exists = false; }),
    expectFailure(validRecord, "authorization_packet_missing_fails", (candidate) => { candidate.checkpoint_assertions.first_generation_authorization_packet_exists = false; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.checkpoint_assertions.image_generation = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.checkpoint_assertions.memory_write = true; }),
    expectFailure(validRecord, "real_executor_true_fails", (candidate) => { candidate.checkpoint_assertions.real_executor = true; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => { candidate.side_effects.production_candidate_created = true; }),
    expectFailure(validRecord, "accepted_sample_auto_promotion_true_fails", (candidate) => { candidate.side_effects.accepted_sample_auto_promotion = true; }),
    expectFailure(validRecord, "push_l2_exercised_true_fails", (candidate) => { candidate.boundaries.Push_L2_exercised = true; }),
    expectFailure(validRecord, "execution_route_option_fails", (candidate) => { candidate.next_route_options = ["execute_real_generation_now"]; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.checkpoint_id = "C:\\private\\checkpoint.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.checkpoint_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    readiness_semantics_missing_caught: cases.some((item) => item.case_id === "readiness_semantics_missing_fails" && item.result === "caught"),
    human_review_gate_missing_caught: cases.some((item) => item.case_id === "human_review_gate_missing_fails" && item.result === "caught"),
    noop_runner_missing_caught: cases.some((item) => item.case_id === "noop_runner_missing_fails" && item.result === "caught"),
    evidence_contract_missing_caught: cases.some((item) => item.case_id === "evidence_contract_missing_fails" && item.result === "caught"),
    readonly_query_contract_missing_caught: cases.some((item) => item.case_id === "readonly_query_contract_missing_fails" && item.result === "caught"),
    authorization_packet_missing_caught: cases.some((item) => item.case_id === "authorization_packet_missing_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "memory_write_true_fails" && item.result === "caught"),
    real_executor_caught: cases.some((item) => item.case_id === "real_executor_true_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).fifteen_day_controlled_generation_readiness_checkpoint;
  const validRecord = readJson(passFixturePath).fifteen_day_controlled_generation_readiness_checkpoint;
  const invalidRecord = readJson(failFixturePath).fifteen_day_controlled_generation_readiness_checkpoint;

  for (const token of [
    "readiness_semantics_hardening exists: true",
    "human_review_gate_packet exists: true",
    "noop_generation_runner exists: true",
    "evidence_contract exists: true",
    "visual_memory_readonly_query_contract exists: true",
    "first_generation_authorization_packet exists: true",
    "image_generation: false",
    "memory_write: false",
    "real_executor: false"
  ]) {
    assert(doc.includes(token), `checkpoint doc missing token: ${token}`);
  }
  assert(schema.includes("fifteen_day_controlled_generation_readiness_checkpoint"), "schema must define fifteen day controlled generation readiness checkpoint");
  assert(mvp.includes("validate_fifteen_day_controlled_generation_readiness_checkpoint.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_1_FIFTEEN_DAY_CONTROLLED_GENERATION_READINESS_CHECKPOINT_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_fifteen_day_controlled_generation_readiness_checkpoint",
    phase,
    checkpoint_doc_present: true,
    checkpoint_schema_present: true,
    checkpoint_report_present: true,
    checkpoint_fixture_present: true,
    checkpoint_fail_fixture_present: true,
    readiness_semantics_hardening_exists: true,
    human_review_gate_packet_exists: true,
    noop_generation_runner_exists: true,
    evidence_contract_exists: true,
    visual_memory_readonly_query_contract_exists: true,
    first_generation_authorization_packet_exists: true,
    readiness_semantics_hardened: true,
    human_review_gate_defined: true,
    noop_generation_runner_defined: true,
    evidence_contract_defined: true,
    readonly_query_contract_defined: true,
    first_authorization_packet_defined: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    readiness_semantics_missing_caught: negativeCaseSummary.readiness_semantics_missing_caught,
    human_review_gate_missing_caught: negativeCaseSummary.human_review_gate_missing_caught,
    noop_runner_missing_caught: negativeCaseSummary.noop_runner_missing_caught,
    evidence_contract_missing_caught: negativeCaseSummary.evidence_contract_missing_caught,
    readonly_query_contract_missing_caught: negativeCaseSummary.readonly_query_contract_missing_caught,
    authorization_packet_missing_caught: negativeCaseSummary.authorization_packet_missing_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    real_executor_caught: negativeCaseSummary.real_executor_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    dry_run_only: true,
    checkpoint_only: true,
    image_generation: false,
    memory_write: false,
    real_executor: false,
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
