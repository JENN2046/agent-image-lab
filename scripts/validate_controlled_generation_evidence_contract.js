#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_5_8_controlled_generation_evidence_contract";
const docPath = "docs/V0_5_8_CONTROLLED_GENERATION_EVIDENCE_CONTRACT.md";
const schemaPath = "schemas/controlled_generation_evidence_contract.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_5_8_controlled_generation_evidence_contract.json";
const passFixturePath = "tests/schema_examples/controlled_generation_evidence_contract.example.json";
const failFixturePath = "tests/schema_examples/controlled_generation_evidence_contract_fail.example.json";
const promptPreviewPath = "reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json";
const reviewGatePath = "reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json";
const readinessPacketPath = "reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json";
const wouldGenerateReceiptPath = "reports/visual_asset_eval_dry_run/v0_5_7_noop_controlled_generation_runner_dry_run.json";
const expectedReviewReportPath = "schemas/visual_asset_review_report.schema.yaml";
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
  const reviewGate = readJson(reviewGatePath).human_review_gate_packet;
  const readiness = readJson(readinessPacketPath).controlled_generation_readiness_packet;
  const wouldGenerate = readJson(wouldGenerateReceiptPath).noop_controlled_generation_runner_dry_run;
  const reviewReportSchema = read(expectedReviewReportPath);
  assert(preview.phase === "v0_5_1_prompt_package_preview", "prompt preview phase mismatch");
  assert(reviewGate.phase === "v0_5_6_human_review_gate_packet", "review gate phase mismatch");
  assert(readiness.phase === "v0_5_0_controlled_generation_readiness_packet", "readiness packet phase mismatch");
  assert(wouldGenerate.phase === "v0_5_7_noop_controlled_generation_runner_dry_run", "would-generate receipt phase mismatch");
  assert(reviewReportSchema.includes("visual_asset_review_report"), "expected review report schema missing");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "controlled generation evidence contract missing");
  assertNoSecretOrRawPath(record, "controlled_generation_evidence_contract");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  validateSources();

  assert(record.prompt_package_preview_ref === promptPreviewPath, "prompt_package_preview_ref mismatch");
  assert(record.review_gate_packet_ref === reviewGatePath, "review_gate_packet_ref mismatch");
  assert(record.readiness_packet_ref === readinessPacketPath, "readiness_packet_ref mismatch");
  assert(record.would_generate_receipt_ref === wouldGenerateReceiptPath, "would_generate_receipt_ref mismatch");
  assert(record.expected_review_report_ref === expectedReviewReportPath, "expected_review_report_ref mismatch");

  const assertions = record.evidence_assertions;
  assert(assertions.prompt_package_preview_ref_present === true, "prompt_package_preview_ref_present must be true");
  assert(assertions.review_gate_packet_ref_present === true, "review_gate_packet_ref_present must be true");
  assert(assertions.readiness_packet_ref_present === true, "readiness_packet_ref_present must be true");
  assert(assertions.would_generate_receipt_ref_present === true, "would_generate_receipt_ref_present must be true");
  assert(assertions.expected_review_report_ref_present === true, "expected_review_report_ref_present must be true");
  assert(assertions.all_required_refs_present === true, "all_required_refs_present must be true");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.evidence_contract_only === true, "evidence_contract_only must be true");
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
  assert(invalidFixtureCaught, "invalid evidence contract fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_prompt_preview_ref_fails", (candidate) => { candidate.prompt_package_preview_ref = ""; }),
    expectFailure(validRecord, "missing_review_gate_packet_ref_fails", (candidate) => { candidate.review_gate_packet_ref = ""; }),
    expectFailure(validRecord, "missing_readiness_packet_ref_fails", (candidate) => { candidate.readiness_packet_ref = ""; }),
    expectFailure(validRecord, "missing_would_generate_receipt_ref_fails", (candidate) => { candidate.would_generate_receipt_ref = ""; }),
    expectFailure(validRecord, "missing_expected_review_report_ref_fails", (candidate) => { candidate.expected_review_report_ref = ""; }),
    expectFailure(validRecord, "all_required_refs_present_false_fails", (candidate) => { candidate.evidence_assertions.all_required_refs_present = false; }),
    expectFailure(validRecord, "review_gate_packet_ref_present_false_fails", (candidate) => { candidate.evidence_assertions.review_gate_packet_ref_present = false; }),
    expectFailure(validRecord, "would_generate_receipt_ref_present_false_fails", (candidate) => { candidate.evidence_assertions.would_generate_receipt_ref_present = false; }),
    expectFailure(validRecord, "expected_review_report_ref_present_false_fails", (candidate) => { candidate.evidence_assertions.expected_review_report_ref_present = false; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "daily_note_write_true_fails", (candidate) => { candidate.side_effects.DailyNote_write_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
    expectFailure(validRecord, "production_candidate_true_fails", (candidate) => { candidate.side_effects.production_candidate_created = true; }),
    expectFailure(validRecord, "push_l2_true_fails", (candidate) => { candidate.boundaries.Push_L2_exercised = true; }),
    expectFailure(validRecord, "real_executor_true_fails", (candidate) => { candidate.boundaries.real_executor_implemented_now = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.evidence_contract_id = "C:\\private\\evidence.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.evidence_contract_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    prompt_package_preview_ref_caught: cases.some((item) => item.case_id === "missing_prompt_preview_ref_fails" && item.result === "caught"),
    review_gate_packet_ref_caught: cases.some((item) => item.case_id === "missing_review_gate_packet_ref_fails" && item.result === "caught"),
    readiness_packet_ref_caught: cases.some((item) => item.case_id === "missing_readiness_packet_ref_fails" && item.result === "caught"),
    would_generate_receipt_ref_caught: cases.some((item) => item.case_id === "missing_would_generate_receipt_ref_fails" && item.result === "caught"),
    expected_review_report_ref_caught: cases.some((item) => item.case_id === "missing_expected_review_report_ref_fails" && item.result === "caught"),
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
  const reportRecord = readJson(reportPath).controlled_generation_evidence_contract;
  const validRecord = readJson(passFixturePath).controlled_generation_evidence_contract;
  const invalidRecord = readJson(failFixturePath).controlled_generation_evidence_contract;

  for (const token of ["prompt_package_preview_ref", "review_gate_packet_ref", "readiness_packet_ref", "would_generate_receipt_ref", "expected_review_report_ref"]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("controlled_generation_evidence_contract"), "schema must define controlled_generation_evidence_contract");
  assert(mvp.includes("validate_controlled_generation_evidence_contract.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_5_8_CONTROLLED_GENERATION_EVIDENCE_CONTRACT_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_controlled_generation_evidence_contract",
    phase,
    evidence_doc_present: true,
    evidence_schema_present: true,
    evidence_report_present: true,
    evidence_fixture_present: true,
    evidence_fail_fixture_present: true,
    prompt_package_preview_ref_present: true,
    review_gate_packet_ref_present: true,
    readiness_packet_ref_present: true,
    would_generate_receipt_ref_present: true,
    expected_review_report_ref_present: true,
    all_required_refs_present: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    prompt_package_preview_ref_caught: negativeCaseSummary.prompt_package_preview_ref_caught,
    review_gate_packet_ref_caught: negativeCaseSummary.review_gate_packet_ref_caught,
    readiness_packet_ref_caught: negativeCaseSummary.readiness_packet_ref_caught,
    would_generate_receipt_ref_caught: negativeCaseSummary.would_generate_receipt_ref_caught,
    expected_review_report_ref_caught: negativeCaseSummary.expected_review_report_ref_caught,
    provider_call_caught: negativeCaseSummary.provider_call_caught,
    image_generation_caught: negativeCaseSummary.image_generation_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    runtime_call_caught: negativeCaseSummary.runtime_call_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    metadata_only: true,
    dry_run_only: true,
    evidence_contract_only: true,
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
