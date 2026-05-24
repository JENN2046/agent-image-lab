#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_25_exact_new_trial_artifact_persistence_truth_review";
const docPath = "docs/V0_6_25_EXACT_NEW_TRIAL_ARTIFACT_PERSISTENCE_TRUTH_REVIEW.md";
const schemaPath = "schemas/exact_new_trial_artifact_persistence_truth_review.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_artifact_persistence_truth_review_fail.example.json";
const attemptPath = "runs/real_generation/v0_3_3_exact_new_trial_002/generation_attempt_result.json";
const receiptPath = "reports/provider_receipts/v0_3_3_exact_new_trial_002_receipt.json";
const registryPath = "reports/provider_receipts/v0_3_3_exact_new_trial_002_registry.json";
const bridgePath = "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_002/bridge_entry.json";
const v623ReportPath = "reports/visual_asset_eval_dry_run/v0_6_23_single_generation_with_payload_capture_and_artifact_trace.json";
const missingImagePath = "runs/real_generation/v0_3_3_exact_new_trial_002/safe_adult_editorial_portrait_v1.png";
const runDir = "runs/real_generation/v0_3_3_exact_new_trial_002";
const expectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const expectedProviderRoute = "image_gen.imagegen";
const expectedSha = "3c08be9be98d36d94cc5d13de82b8c21c3f63533915fe59e814d99fdef3b4d96";

const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "external_private_path_recovery_performed",
  "secret_value_read_performed",
  "VCP_memory_write_performed",
  "DailyNote_write_performed",
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

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
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

function assertNoRawOrSecretPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env|token|cookie|secret/i.test(value), `Secret-sensitive token found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawOrSecretPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawOrSecretPath(item, `${context}.${key}`));
  }
}

function assertFalseFlags(boundary, context) {
  assert(boundary && typeof boundary === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(boundary[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawOrSecretPath(record, context);
  assert(record.phase === phase, `${context}.phase mismatch`);
  assert(record.attempt_id === "v0_3_3_exact_new_trial_002", `${context}.attempt_id mismatch`);
  assert(record.doc_ref === docPath, `${context}.doc_ref mismatch`);
  assert(record.schema_ref === schemaPath || context !== "report", `${context}.schema_ref mismatch`);
  assert(record.prompt_package_ref === expectedPrompt, `${context}.prompt_package_ref mismatch`);
  assert(record.provider_route === expectedProviderRoute, `${context}.provider_route mismatch`);

  const refs = record.evidence_refs;
  assert(refs.attempt_result_path === attemptPath, `${context}.evidence_refs.attempt_result_path mismatch`);
  assert(refs.receipt_path === receiptPath, `${context}.evidence_refs.receipt_path mismatch`);
  assert(refs.registry_path === registryPath, `${context}.evidence_refs.registry_path mismatch`);
  assert(refs.bridge_entry_path === bridgePath, `${context}.evidence_refs.bridge_entry_path mismatch`);
  assert(refs.v0_6_23_report_ref === v623ReportPath, `${context}.evidence_refs.v0_6_23_report_ref mismatch`);

  const claim = record.artifact_claim;
  assert(claim.artifact_return_trace_status === "artifact_located_and_copied_to_project", `${context}.artifact_return_trace_status mismatch`);
  assert(claim.claimed_output_image_path === missingImagePath, `${context}.claimed_output_image_path mismatch`);
  assert(claim.claimed_output_image_sha256 === expectedSha, `${context}.claimed_output_image_sha256 mismatch`);
  assert(claim.review_required_after_success === true, `${context}.review_required_after_success must be true`);

  const filesystemTruth = record.filesystem_truth;
  assert(filesystemTruth.project_output_directory === "runs/real_generation/v0_3_3_exact_new_trial_002/", `${context}.project_output_directory mismatch`);
  assert(filesystemTruth.project_output_directory_exists === true, `${context}.project_output_directory_exists must be true`);
  assert(Array.isArray(filesystemTruth.project_output_directory_entries), `${context}.project_output_directory_entries must be an array`);
  assert(filesystemTruth.project_output_directory_entries.length === 1, `${context}.project_output_directory_entries must contain one entry`);
  assert(filesystemTruth.project_output_directory_entries[0] === "generation_attempt_result.json", `${context}.directory entry mismatch`);
  assert(filesystemTruth.project_output_image_present_now === false, `${context}.project_output_image_present_now must be false`);
  assert(filesystemTruth.project_output_image_sha256_verified_now === false, `${context}.project_output_image_sha256_verified_now must be false`);

  const findings = record.truth_findings;
  assert(findings.records_claim_artifact_copied_to_project === true, `${context}.records_claim_artifact_copied_to_project must be true`);
  assert(findings.current_project_output_missing === true, `${context}.current_project_output_missing must be true`);
  assert(findings.local_persistence_verified_now === false, `${context}.local_persistence_verified_now must be false`);
  assert(findings.reviewable_sample_now === false, `${context}.reviewable_sample_now must be false`);
  assert(findings.human_review_allowed_now === false, `${context}.human_review_allowed_now must be false`);
  assert(findings.accepted_sample_eligible === false, `${context}.accepted_sample_eligible must be false`);
  assert(findings.memory_write_eligible === false, `${context}.memory_write_eligible must be false`);
  assert(findings.production_candidate_eligible === false, `${context}.production_candidate_eligible must be false`);

  assertFalseFlags(record.boundary, `${context}.boundary`);
  assert(record.recommended_next === "create_local_persistence_repair_preflight_before_any_human_review_or_new_shot_execution" || context !== "pass_fixture", `${context}.recommended_next mismatch`);
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateRecord(invalidRecord, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const cases = [
    expectFailure(validRecord, "attempt_id_drift", (candidate) => { candidate.attempt_id = "other"; }),
    expectFailure(validRecord, "prompt_drift", (candidate) => { candidate.prompt_package_ref = "other.yaml"; }),
    expectFailure(validRecord, "provider_route_drift", (candidate) => { candidate.provider_route = "other.route"; }),
    expectFailure(validRecord, "attempt_path_drift", (candidate) => { candidate.evidence_refs.attempt_result_path = "other.json"; }),
    expectFailure(validRecord, "claim_status_drift", (candidate) => { candidate.artifact_claim.artifact_return_trace_status = "missing"; }),
    expectFailure(validRecord, "claim_path_drift", (candidate) => { candidate.artifact_claim.claimed_output_image_path = "runs/real_generation/fake.png"; }),
    expectFailure(validRecord, "sha_drift", (candidate) => { candidate.artifact_claim.claimed_output_image_sha256 = "deadbeef"; }),
    expectFailure(validRecord, "directory_exists_false", (candidate) => { candidate.filesystem_truth.project_output_directory_exists = false; }),
    expectFailure(validRecord, "directory_entry_drift", (candidate) => { candidate.filesystem_truth.project_output_directory_entries = []; }),
    expectFailure(validRecord, "image_present_true", (candidate) => { candidate.filesystem_truth.project_output_image_present_now = true; }),
    expectFailure(validRecord, "sha_verified_true", (candidate) => { candidate.filesystem_truth.project_output_image_sha256_verified_now = true; }),
    expectFailure(validRecord, "missing_flag_false", (candidate) => { candidate.truth_findings.current_project_output_missing = false; }),
    expectFailure(validRecord, "reviewable_true", (candidate) => { candidate.truth_findings.reviewable_sample_now = true; }),
    expectFailure(validRecord, "human_review_true", (candidate) => { candidate.truth_findings.human_review_allowed_now = true; }),
    expectFailure(validRecord, "accepted_sample_true", (candidate) => { candidate.truth_findings.accepted_sample_eligible = true; }),
    expectFailure(validRecord, "memory_true", (candidate) => { candidate.truth_findings.memory_write_eligible = true; }),
    expectFailure(validRecord, "production_true", (candidate) => { candidate.truth_findings.production_candidate_eligible = true; }),
    expectFailure(validRecord, "provider_call_true", (candidate) => { candidate.boundary.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true", (candidate) => { candidate.boundary.image_generation_performed = true; }),
    expectFailure(validRecord, "external_recovery_true", (candidate) => { candidate.boundary.external_private_path_recovery_performed = true; }),
    expectFailure(validRecord, "raw_local_path", (candidate) => { candidate.doc_ref = "C:\\private\\doc.md"; }),
    expectFailure(validRecord, "secret_path", (candidate) => { candidate.doc_ref = ".env"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  for (const relativePath of [docPath, schemaPath, reportPath, passFixturePath, failFixturePath, attemptPath, receiptPath, registryPath, bridgePath, v623ReportPath]) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  assert(exists(runDir), "run directory must exist");
  assert(!exists(missingImagePath), "project output image must currently be absent");

  const attempt = readJson(attemptPath);
  const receipt = readJson(receiptPath);
  const registry = readJson(registryPath);
  const bridge = readJson(bridgePath);
  const v623 = readJson(v623ReportPath);
  const report = readJson(reportPath).exact_new_trial_artifact_persistence_truth_review;
  const passFixture = readJson(passFixturePath).exact_new_trial_artifact_persistence_truth_review;
  const failFixture = readJson(failFixturePath).exact_new_trial_artifact_persistence_truth_review;
  const doc = read(docPath);
  const schema = read(schemaPath);

  assert(attempt.attempt_status === "succeeded_image_generated", "attempt status mismatch");
  assert(receipt.receipt_status === "succeeded_image_generated", "receipt status mismatch");
  assert(registry.registry_status === "succeeded_image_generated", "registry status mismatch");
  assert(bridge.bridge_status === "ready_for_human_review", "bridge status mismatch");
  assert(v623.status === "succeeded_image_generated_review_required", "v0.6.23 report status mismatch");

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  assert(doc.includes("# v0.6.25 Exact New-Trial Artifact Persistence Truth Review"), "doc title missing");
  assert(doc.includes("human review can proceed") === false, "doc must not claim human review can proceed");
  assert(doc.includes("human_review_blocked_by_missing_local_artifact"), "doc must record blocked human review truth");
  assert(schema.includes("current_project_output_missing: true"), "schema missing missing-output invariant");
  assert(schema.includes("human_review_allowed_now: false"), "schema missing human review invariant");

  const currentEntries = fs.readdirSync(repoPath(runDir)).sort();
  assert(currentEntries.length === 1 && currentEntries[0] === "generation_attempt_result.json", "run directory must only contain generation_attempt_result.json");

  const result = {
    phase,
    passed: true,
    attempt_id: report.attempt_id,
    claimed_output_image_path: report.artifact_claim.claimed_output_image_path,
    output_directory_exists: report.filesystem_truth.project_output_directory_exists,
    output_image_present_now: report.filesystem_truth.project_output_image_present_now,
    current_project_output_missing: report.truth_findings.current_project_output_missing,
    local_persistence_verified_now: report.truth_findings.local_persistence_verified_now,
    reviewable_sample_now: report.truth_findings.reviewable_sample_now,
    human_review_allowed_now: report.truth_findings.human_review_allowed_now,
    accepted_sample_eligible: report.truth_findings.accepted_sample_eligible,
    memory_write_eligible: report.truth_findings.memory_write_eligible,
    production_candidate_eligible: report.truth_findings.production_candidate_eligible,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
