#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_3_failed_provider_attempt_inspection";
const docPath = "docs/V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION.md";
const schemaPath = "schemas/failed_provider_attempt_inspection.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json";
const passFixturePath = "tests/schema_examples/failed_provider_attempt_inspection.example.json";
const failFixturePath = "tests/schema_examples/failed_provider_attempt_inspection_fail.example.json";
const gatePath = "docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md";
const receiptPath = "reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json";
const registryPath = "reports/provider_receipts/provider_receipt_registry.json";
const attemptResultPath = "runs/real_generation/v0_3_3_codex_sample_first_trial/generation_attempt_result.json";
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

function loadSources() {
  const receipt = readJson(receiptPath);
  const registry = readJson(registryPath);
  const attemptResult = readJson(attemptResultPath);
  const registryEntry = registry.entries.find((entry) => entry.receipt_path === receiptPath);

  assert(receipt.status === "failed_no_image_generated", "receipt status mismatch");
  assert(attemptResult.attempt_status === "failed_no_image_generated", "attempt_result status mismatch");
  assert(registryEntry, "provider receipt registry entry missing");

  return { receipt, registry, attemptResult, registryEntry };
}

function validateRecord(record) {
  assert(record && typeof record === "object", "failed provider attempt inspection missing");
  assertNoSecretOrRawPath(record, "failed_provider_attempt_inspection");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_gate_ref === gatePath, "source_gate_ref mismatch");
  assert(record.receipt_ref === receiptPath, "receipt_ref mismatch");
  assert(record.receipt_registry_ref === registryPath, "receipt_registry_ref mismatch");
  assert(record.attempt_result_ref === attemptResultPath, "attempt_result_ref mismatch");
  assert(record.review_console_bridge_ref === "review_console/live_receipt_bridge/v0_3_3_codex_sample_first_trial", "review_console_bridge_ref mismatch");

  const { receipt, attemptResult, registryEntry } = loadSources();
  const facts = record.source_attempt_facts;
  assert(facts.source_attempt_status === receipt.status, "source_attempt_status mismatch");
  assert(facts.provider_calls_used === receipt.calls_used.provider_calls, "provider_calls_used mismatch");
  assert(facts.plugin_calls_used === receipt.calls_used.plugin_calls, "plugin_calls_used mismatch");
  assert(facts.api_calls_used === receipt.calls_used.api_calls, "api_calls_used mismatch");
  assert(facts.image_candidates_requested === receipt.calls_used.image_candidates_requested, "image_candidates_requested mismatch");
  assert(facts.image_candidates_generated === receipt.calls_used.image_candidates_generated, "image_candidates_generated mismatch");
  assert(facts.retries_used === receipt.calls_used.retries_used, "retries_used mismatch");
  assert(facts.retry_limit === receipt.budgets.retry_limit, "retry_limit mismatch");
  assert(facts.failure_class === receipt.failure.class, "failure_class mismatch");
  assert(facts.stop_reason === receipt.stop_reason, "stop_reason mismatch");
  assert(facts.output_image_path === receipt.output_image_path, "output_image_path mismatch");
  assert(facts.review_bridge_materialized_now === false, "review_bridge_materialized_now must be false");

  const assertions = record.inspection_assertions;
  assert(assertions.receipt_present === true, "receipt_present must be true");
  assert(assertions.registry_present === true, "registry_present must be true");
  assert(assertions.attempt_result_present === true, "attempt_result_present must be true");
  assert(assertions.registry_entry_present === true, "registry_entry_present must be true");
  assert(assertions.receipt_registry_status_match === (receipt.status === registryEntry.status), "receipt_registry_status_match mismatch");
  assert(assertions.receipt_registry_receipt_match === (receiptPath === registryEntry.receipt_path), "receipt_registry_receipt_match mismatch");
  assert(assertions.receipt_attempt_result_status_match === (receipt.status === attemptResult.attempt_status), "receipt_attempt_result_status_match mismatch");
  assert(assertions.receipt_attempt_result_receipt_match === (receiptPath === attemptResult.receipt_path), "receipt_attempt_result_receipt_match mismatch");
  assert(assertions.no_image_artifact_produced === (receipt.output_image_path === null && attemptResult.output_image_path === null), "no_image_artifact_produced mismatch");
  assert(assertions.retry_blocked_by_zero_retry_limit === (receipt.failure.retry_allowed === false && receipt.failure.retry_blocked_by === "retry_limit=0"), "retry_blocked_by_zero_retry_limit mismatch");
  assert(assertions.failure_class_locked === (receipt.failure.class === "provider_tool_user_error" && attemptResult.failure_class === "provider_tool_user_error"), "failure_class_locked mismatch");
  assert(assertions.review_bridge_ref_recorded === true, "review_bridge_ref_recorded must be true");
  assert(assertions.review_bridge_materialized_now_false === true, "review_bridge_materialized_now_false must be true");
  assert(assertions.boundary_flags_preserved === true, "boundary_flags_preserved must be true");
  assert(assertions.all_required_failed_attempt_evidence_present === true, "all_required_failed_attempt_evidence_present must be true");

  assert(fs.existsSync(repoPath(gatePath)), "source gate must exist");
  assert(fs.existsSync(repoPath(receiptPath)), "receipt must exist");
  assert(fs.existsSync(repoPath(registryPath)), "registry must exist");
  assert(fs.existsSync(repoPath(attemptResultPath)), "attempt result must exist");
  assert(fs.existsSync(repoPath("review_console/live_receipt_bridge/v0_3_3_codex_sample_first_trial")) === false, "review bridge must not be materialized now");

  assert(receipt.cost.known_exact_amount === false, "receipt cost exact amount must remain unknown");
  assert(receipt.secret_value_read_performed === false, "receipt secret_value_read_performed must remain false");
  assert(receipt.raw_provider_payload_capture_performed === false, "receipt raw_provider_payload_capture_performed must remain false");
  assert(receipt.raw_provider_response_capture_performed === false, "receipt raw_provider_response_capture_performed must remain false");
  assert(receipt.DailyNote_write_performed === false, "receipt DailyNote_write_performed must remain false");
  assert(receipt.VCP_memory_write_performed === false, "receipt VCP_memory_write_performed must remain false");
  assert(receipt.runtime_probe_performed === false, "receipt runtime_probe_performed must remain false");
  assert(receipt.push_tag_release_deploy_performed === false, "receipt push_tag_release_deploy_performed must remain false");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.inspection_only === true, "inspection_only must be true");
  assert(record.boundaries?.no_new_trial_executed === true, "no_new_trial_executed must be true");
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
  assert(invalidFixtureCaught, "invalid failed-attempt inspection fixture must fail");

  const cases = [
    expectFailure(validRecord, "receipt_ref_missing_fails", (candidate) => { candidate.receipt_ref = ""; }),
    expectFailure(validRecord, "registry_ref_missing_fails", (candidate) => { candidate.receipt_registry_ref = ""; }),
    expectFailure(validRecord, "attempt_result_ref_missing_fails", (candidate) => { candidate.attempt_result_ref = ""; }),
    expectFailure(validRecord, "image_candidates_generated_nonzero_fails", (candidate) => { candidate.source_attempt_facts.image_candidates_generated = 1; }),
    expectFailure(validRecord, "output_image_path_non_null_fails", (candidate) => { candidate.source_attempt_facts.output_image_path = "runs/real_generation/fake.png"; }),
    expectFailure(validRecord, "retry_block_false_fails", (candidate) => { candidate.inspection_assertions.retry_blocked_by_zero_retry_limit = false; }),
    expectFailure(validRecord, "review_bridge_materialized_true_fails", (candidate) => { candidate.source_attempt_facts.review_bridge_materialized_now = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "memory_write_true_fails", (candidate) => { candidate.side_effects.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => { candidate.side_effects.runtime_call_performed = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.inspection_id = "C:\\private\\inspection.json"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.inspection_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).failed_provider_attempt_inspection;
  const validRecord = readJson(passFixturePath).failed_provider_attempt_inspection;
  const invalidRecord = readJson(failFixturePath).failed_provider_attempt_inspection;

  for (const token of ["receipt_ref", "receipt_registry_ref", "attempt_result_ref", "review_console_bridge_ref", "provider_tool_user_error"]) {
    assert(doc.includes(token), `doc missing token: ${token}`);
  }
  assert(schema.includes("failed_provider_attempt_inspection"), "schema must define failed_provider_attempt_inspection");
  assert(mvp.includes("validate_failed_provider_attempt_inspection.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_3_FAILED_PROVIDER_ATTEMPT_INSPECTION_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_failed_provider_attempt_inspection",
    phase,
    inspection_doc_present: true,
    inspection_schema_present: true,
    inspection_report_present: true,
    inspection_fixture_present: true,
    inspection_fail_fixture_present: true,
    receipt_present: true,
    registry_present: true,
    attempt_result_present: true,
    registry_entry_present: true,
    receipt_registry_status_match: true,
    receipt_registry_receipt_match: true,
    receipt_attempt_result_status_match: true,
    receipt_attempt_result_receipt_match: true,
    no_image_artifact_produced: true,
    retry_blocked_by_zero_retry_limit: true,
    failure_class_locked: true,
    review_bridge_ref_recorded: true,
    review_bridge_materialized_now_false: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    metadata_only: true,
    inspection_only: true,
    no_new_trial_executed: true,
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

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
}
