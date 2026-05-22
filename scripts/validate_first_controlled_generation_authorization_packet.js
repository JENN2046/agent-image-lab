#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_0_first_controlled_generation_authorization_packet";
const docPath = "docs/V0_6_0_FIRST_CONTROLLED_GENERATION_AUTHORIZATION_PACKET.md";
const schemaPath = "schemas/first_controlled_generation_authorization_packet.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_0_first_controlled_generation_authorization_packet.json";
const passFixturePath = "tests/schema_examples/first_controlled_generation_authorization_packet.example.json";
const failFixturePath = "tests/schema_examples/first_controlled_generation_authorization_packet_fail.example.json";
const readinessPacketPath = "reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json";
const humanReviewGatePath = "reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json";
const evidenceContractPath = "reports/visual_asset_eval_dry_run/v0_5_8_controlled_generation_evidence_contract.json";
const readonlyQueryContractPath = "reports/visual_asset_eval_dry_run/v0_5_9_visual_memory_readonly_query_contract.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "output_write_performed",
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

function validateSourceEvidence() {
  const readiness = readJson(readinessPacketPath).controlled_generation_readiness_packet;
  const reviewGate = readJson(humanReviewGatePath).human_review_gate_packet;
  const evidence = readJson(evidenceContractPath).controlled_generation_evidence_contract;
  const readonlyQuery = readJson(readonlyQueryContractPath).visual_memory_readonly_query_contract;
  assert(readiness.phase === "v0_5_0_controlled_generation_readiness_packet", "readiness packet phase mismatch");
  assert(readiness.max_generation_calls?.configured_limit === 1, "readiness packet configured limit mismatch");
  assert(reviewGate.phase === "v0_5_6_human_review_gate_packet", "human review gate packet phase mismatch");
  assert(reviewGate.reviewer_required?.enabled === true, "human reviewer must remain required");
  assert(evidence.phase === "v0_5_8_controlled_generation_evidence_contract", "evidence contract phase mismatch");
  assert(evidence.evidence_assertions?.all_required_refs_present === true, "evidence contract must keep all required refs");
  assert(readonlyQuery.phase === "v0_5_9_visual_memory_readonly_query_contract", "readonly query contract phase mismatch");
  assert(readonlyQuery.no_write_flags?.VCP_memory_write_allowed === false, "readonly query contract must keep memory writes blocked");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "first controlled generation authorization packet missing");
  assertNoSecretOrRawPath(record, "first_controlled_generation_authorization_packet");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_readiness_packet_ref === readinessPacketPath, "source readiness packet ref mismatch");
  assert(record.source_human_review_gate_packet_ref === humanReviewGatePath, "source human review gate packet ref mismatch");
  assert(record.source_evidence_contract_ref === evidenceContractPath, "source evidence contract ref mismatch");
  assert(record.source_visual_memory_readonly_query_contract_ref === readonlyQueryContractPath, "source readonly query contract ref mismatch");

  validateSourceEvidence();

  assert(record.explicit_A5_required?.enabled === true, "explicit_A5_required must be enabled");
  assert(record.explicit_A5_required?.separate_human_authorization_required === true, "separate human authorization must be required");
  assert(record.explicit_A5_required?.execution_authorized_now === false, "execution must not be authorized now");

  assert(record.exact_call_count?.configured_limit === 1, "exact call count configured_limit must be 1");
  assert(record.exact_call_count?.actual_generation_calls === 0, "actual_generation_calls must be 0");
  assert(record.exact_call_count?.provider_call_budget_consumed === 0, "provider_call_budget_consumed must be 0");

  assert(record.allowed_output_dir_policy?.output_dir_preapproved === false, "output directory must not be preapproved yet");
  assert(record.allowed_output_dir_policy?.output_directory_selection_required_before_execution === true, "output directory selection must remain required before execution");
  assert(record.allowed_output_dir_policy?.project_relative_output_dir_required === true, "project-relative output dir must be required");
  assert(record.allowed_output_dir_policy?.raw_local_path_allowed === false, "raw local path output dir must not be allowed");
  assert(record.allowed_output_dir_policy?.output_write_performed === false, "output writes must not be performed");

  assert(record.review_required_after_generation?.enabled === true, "review_required_after_generation must be enabled");
  assert(record.review_required_after_generation?.human_review_required_after_generation === true, "human review after generation must be required");
  assert(record.review_required_after_generation?.accepted_sample_promotion_allowed === false, "accepted sample promotion must not be allowed");
  assert(record.review_required_after_generation?.production_candidate_allowed === false, "production candidate creation must not be allowed");

  assert(record.no_memory_write_default?.enabled === true, "no_memory_write_default must be enabled");
  assert(record.no_memory_write_default?.VCP_memory_write_allowed === false, "VCP memory write must not be allowed");
  assert(record.no_memory_write_default?.DailyNote_write_allowed === false, "DailyNote write must not be allowed");
  assert(record.no_memory_write_default?.memory_seed_promotion_allowed === false, "memory seed promotion must not be allowed");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.authorization_packet_only === true, "authorization_packet_only must be true");
  assert(record.boundaries?.preflight_only === true, "preflight_only must be true");
  assert(record.boundaries?.execution_authorized_by_this_packet === false, "execution_authorized_by_this_packet must remain false");
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
  assert(invalidFixtureCaught, "invalid first controlled generation authorization packet fixture must fail");

  const cases = [
    expectFailure(validRecord, "explicit_a5_required_disabled_fails", (candidate) => { candidate.explicit_A5_required.enabled = false; }),
    expectFailure(validRecord, "execution_authorized_now_true_fails", (candidate) => { candidate.explicit_A5_required.execution_authorized_now = true; }),
    expectFailure(validRecord, "exact_call_count_not_one_fails", (candidate) => { candidate.exact_call_count.configured_limit = 2; }),
    expectFailure(validRecord, "actual_generation_calls_nonzero_fails", (candidate) => { candidate.exact_call_count.actual_generation_calls = 1; }),
    expectFailure(validRecord, "output_dir_preapproved_true_fails", (candidate) => { candidate.allowed_output_dir_policy.output_dir_preapproved = true; }),
    expectFailure(validRecord, "raw_local_path_allowed_true_fails", (candidate) => { candidate.allowed_output_dir_policy.raw_local_path_allowed = true; }),
    expectFailure(validRecord, "review_required_after_generation_disabled_fails", (candidate) => { candidate.review_required_after_generation.enabled = false; }),
    expectFailure(validRecord, "no_memory_write_default_disabled_fails", (candidate) => { candidate.no_memory_write_default.enabled = false; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "output_write_true_fails", (candidate) => { candidate.side_effects.output_write_performed = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "daily_note_write_true_fails", (candidate) => { candidate.side_effects.DailyNote_write_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => { candidate.side_effects.production_candidate_created = true; }),
    expectFailure(validRecord, "accepted_sample_auto_promotion_true_fails", (candidate) => { candidate.side_effects.accepted_sample_auto_promotion = true; }),
    expectFailure(validRecord, "memory_seed_promoted_true_fails", (candidate) => { candidate.side_effects.memory_seed_promoted = true; }),
    expectFailure(validRecord, "push_l2_exercised_true_fails", (candidate) => { candidate.boundaries.Push_L2_exercised = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.authorization_packet_id = "C:\\private\\authorization.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.authorization_packet_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    explicit_A5_required_caught: cases.some((item) => item.case_id === "explicit_a5_required_disabled_fails" && item.result === "caught"),
    exact_call_count_caught: cases.some((item) => item.case_id === "exact_call_count_not_one_fails" && item.result === "caught"),
    allowed_output_dir_policy_caught: cases.some((item) => item.case_id === "output_dir_preapproved_true_fails" && item.result === "caught"),
    review_required_after_generation_caught: cases.some((item) => item.case_id === "review_required_after_generation_disabled_fails" && item.result === "caught"),
    no_memory_write_default_caught: cases.some((item) => item.case_id === "no_memory_write_default_disabled_fails" && item.result === "caught"),
    provider_call_caught: cases.some((item) => item.case_id === "provider_call_true_fails" && item.result === "caught"),
    image_generation_caught: cases.some((item) => item.case_id === "image_generation_true_fails" && item.result === "caught"),
    output_write_caught: cases.some((item) => item.case_id === "output_write_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "memory_write_true_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).first_controlled_generation_authorization_packet;
  const validRecord = readJson(passFixturePath).first_controlled_generation_authorization_packet;
  const invalidRecord = readJson(failFixturePath).first_controlled_generation_authorization_packet;

  for (const token of [
    "explicit_A5_required",
    "exact_call_count",
    "allowed_output_dir_policy",
    "review_required_after_generation",
    "no_memory_write_default"
  ]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("first_controlled_generation_authorization_packet"), "schema must define first_controlled_generation_authorization_packet");
  assert(mvp.includes("validate_first_controlled_generation_authorization_packet.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_0_FIRST_CONTROLLED_GENERATION_AUTHORIZATION_PACKET_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_first_controlled_generation_authorization_packet",
    phase,
    authorization_doc_present: true,
    authorization_schema_present: true,
    authorization_report_present: true,
    authorization_fixture_present: true,
    authorization_fail_fixture_present: true,
    source_readiness_packet_verified: true,
    source_human_review_gate_packet_verified: true,
    source_evidence_contract_verified: true,
    source_visual_memory_readonly_query_contract_verified: true,
    explicit_A5_required: true,
    exact_call_count: true,
    allowed_output_dir_policy: true,
    review_required_after_generation: true,
    no_memory_write_default: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    explicit_A5_required_caught: negativeCaseSummary.explicit_A5_required_caught,
    exact_call_count_caught: negativeCaseSummary.exact_call_count_caught,
    allowed_output_dir_policy_caught: negativeCaseSummary.allowed_output_dir_policy_caught,
    review_required_after_generation_caught: negativeCaseSummary.review_required_after_generation_caught,
    no_memory_write_default_caught: negativeCaseSummary.no_memory_write_default_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    output_write_caught: negativeCaseSummary.output_write_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    authorization_packet_only: true,
    preflight_only: true,
    execution_authorized_by_this_packet: false,
    Push_L2_exercised: false,
    real_executor_implemented_now: false,
    provider_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
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
