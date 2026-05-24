#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_31_exact_new_trial_003_shot_3_execution_closeout";
const payloadCapturePath = "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_3_request_payload.sanitized.json";
const attemptPath = "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/generation_attempt_result.json";
const receiptPath = "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_receipt.json";
const registryPath = "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_registry.json";
const bridgePath = "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_3/bridge_entry.json";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_31_exact_new_trial_003_shot_3_execution_closeout.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_003_shot_3_execution_closeout.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_003_shot_3_execution_closeout_fail.example.json";
const imagePath = "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/safe_adult_editorial_portrait_v1.png";
const expectedSha = "c3f69ce85eb2fa1d7e92fe0bc0c493a13fb830ea9fd10d2e5d73056e33e143a7";
const expectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const expectedRecommendedNext = "human_review_generated_asset_before_any_promotion_or_memory_write";

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

function fileSha(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
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

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawOrSecretPath(record, context);
  assert(record.phase === phase, `${context}.phase mismatch`);
  assert(record.attempt_id === "v0_3_3_exact_new_trial_003_shot_3", `${context}.attempt_id mismatch`);
  assert(record.provider_route === "image_gen.imagegen", `${context}.provider_route mismatch`);
  assert(record.prompt_package_ref === expectedPrompt, `${context}.prompt_package_ref mismatch`);
  assert(record.payload_capture_ref === payloadCapturePath, `${context}.payload_capture_ref mismatch`);
  assert(record.attempt_result_path === attemptPath, `${context}.attempt_result_path mismatch`);
  assert(record.receipt_path === receiptPath, `${context}.receipt_path mismatch`);
  assert(record.registry_path === registryPath, `${context}.registry_path mismatch`);
  assert(record.review_console_bridge_ref === "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_3", `${context}.review_console_bridge_ref mismatch`);
  assert(record.output_image_path === imagePath, `${context}.output_image_path mismatch`);
  assert(record.output_image_sha256 === expectedSha, `${context}.output_image_sha256 mismatch`);
  assert(record.provider_calls_used === 1, `${context}.provider_calls_used must be 1`);
  assert(record.image_candidates_generated === 1, `${context}.image_candidates_generated must be 1`);
  assert(record.retry_limit === 0, `${context}.retry_limit must be 0`);
  assert(record.retries_used === 0, `${context}.retries_used must be 0`);

  const protocol = record.protocol_compliance;
  assert(protocol.selected_shot_id === "v0_3_3_exact_new_trial_003_shot_3", `${context}.protocol.selected_shot_id mismatch`);
  assert(protocol.fresh_non_overwriting_route_used === true, `${context}.protocol.fresh_non_overwriting_route_used must be true`);
  assert(protocol.path_collision_recheck_passed_now === true, `${context}.protocol.path_collision_recheck_passed_now must be true`);
  assert(protocol.independent_receipt_registry_bridge_created === true, `${context}.protocol.independent_receipt_registry_bridge_created must be true`);
  assert(protocol.pre_provider_call_payload_capture_required === true, `${context}.protocol.pre_provider_call_payload_capture_required must be true`);
  assert(protocol.pre_provider_call_payload_capture_satisfied === true, `${context}.protocol.pre_provider_call_payload_capture_satisfied must be true`);
  assert(protocol.post_provider_call_payload_reconstruction_performed === false, `${context}.protocol.post_provider_call_payload_reconstruction_performed must be false`);
  assert(protocol.local_persistence_verification_satisfied === true, `${context}.protocol.local_persistence_verification_satisfied must be true`);
  assert(protocol.review_required_after_generation === true, `${context}.protocol.review_required_after_generation must be true`);

  const review = record.review;
  assert(review.reviewable_sample === true, `${context}.review.reviewable_sample must be true`);
  assert(review.asset_status === "accepted_candidate_with_minor_watch_items", `${context}.review.asset_status mismatch`);
  assert(review.accepted_candidate === true, `${context}.review.accepted_candidate must be true`);
  assert(review.commercial_delivery_ready === false, `${context}.review.commercial_delivery_ready must be false`);
  assert(review.memory_suitability === "deferred", `${context}.review.memory_suitability must be deferred`);

  const boundary = record.boundary;
  assert(boundary.provider_call_performed === true, `${context}.boundary.provider_call_performed must be true`);
  assert(boundary.image_generation_performed === true, `${context}.boundary.image_generation_performed must be true`);
  assert(boundary.retry_performed === false, `${context}.boundary.retry_performed must be false`);
  assert(boundary.raw_provider_payload_capture_performed === true, `${context}.boundary.raw_provider_payload_capture_performed must be true`);
  assert(boundary.raw_provider_response_capture_performed === false, `${context}.boundary.raw_provider_response_capture_performed must be false`);
  assert(boundary.secret_value_read_performed === false, `${context}.boundary.secret_value_read_performed must be false`);
  assert(boundary.VCP_memory_write_performed === false, `${context}.boundary.VCP_memory_write_performed must be false`);
  assert(boundary.DailyNote_write_performed === false, `${context}.boundary.DailyNote_write_performed must be false`);
  assert(boundary.accepted_sample_auto_promotion === false, `${context}.boundary.accepted_sample_auto_promotion must be false`);
  assert(boundary.production_candidate_created === false, `${context}.boundary.production_candidate_created must be false`);
  assert(boundary.push_performed === false, `${context}.boundary.push_performed must be false`);

  assert(record.recommended_next === expectedRecommendedNext, `${context}.recommended_next mismatch`);
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
    expectFailure(validRecord, "sha_drift", (candidate) => { candidate.output_image_sha256 = "deadbeef"; }),
    expectFailure(validRecord, "provider_calls_drift", (candidate) => { candidate.provider_calls_used = 2; }),
    expectFailure(validRecord, "retry_limit_drift", (candidate) => { candidate.retry_limit = 1; }),
    expectFailure(validRecord, "route_not_fresh", (candidate) => { candidate.protocol_compliance.fresh_non_overwriting_route_used = false; }),
    expectFailure(validRecord, "path_collision_failed", (candidate) => { candidate.protocol_compliance.path_collision_recheck_passed_now = false; }),
    expectFailure(validRecord, "pre_call_capture_false", (candidate) => { candidate.protocol_compliance.pre_provider_call_payload_capture_satisfied = false; }),
    expectFailure(validRecord, "post_call_reconstruction_true", (candidate) => { candidate.protocol_compliance.post_provider_call_payload_reconstruction_performed = true; }),
    expectFailure(validRecord, "local_persistence_false", (candidate) => { candidate.protocol_compliance.local_persistence_verification_satisfied = false; }),
    expectFailure(validRecord, "review_not_required", (candidate) => { candidate.protocol_compliance.review_required_after_generation = false; }),
    expectFailure(validRecord, "reviewable_false", (candidate) => { candidate.review.reviewable_sample = false; }),
    expectFailure(validRecord, "asset_status_drift", (candidate) => { candidate.review.asset_status = "commercial_delivery_ready"; }),
    expectFailure(validRecord, "commercial_ready_true", (candidate) => { candidate.review.commercial_delivery_ready = true; }),
    expectFailure(validRecord, "memory_ready_now", (candidate) => { candidate.review.memory_suitability = "ready_now"; }),
    expectFailure(validRecord, "retry_performed_true", (candidate) => { candidate.boundary.retry_performed = true; }),
    expectFailure(validRecord, "raw_payload_false", (candidate) => { candidate.boundary.raw_provider_payload_capture_performed = false; }),
    expectFailure(validRecord, "raw_response_true", (candidate) => { candidate.boundary.raw_provider_response_capture_performed = true; }),
    expectFailure(validRecord, "memory_write_true", (candidate) => { candidate.boundary.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "promotion_true", (candidate) => { candidate.boundary.accepted_sample_auto_promotion = true; }),
    expectFailure(validRecord, "production_true", (candidate) => { candidate.boundary.production_candidate_created = true; }),
    expectFailure(validRecord, "recommended_next_drift", (candidate) => { candidate.recommended_next = "promote_directly_to_memory"; }),
    expectFailure(validRecord, "raw_local_path", (candidate) => { candidate.output_image_path = "C:\\private\\image.png"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  for (const relativePath of [payloadCapturePath, attemptPath, receiptPath, registryPath, bridgePath, reportPath, passFixturePath, failFixturePath, imagePath]) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  assert(fileSha(imagePath) === expectedSha, "image hash mismatch");

  const payload = readJson(payloadCapturePath);
  const attempt = readJson(attemptPath);
  const receipt = readJson(receiptPath);
  const registry = readJson(registryPath);
  const bridge = readJson(bridgePath);
  const report = readJson(reportPath).exact_new_trial_003_shot_3_execution_closeout;
  const passFixture = readJson(passFixturePath).exact_new_trial_003_shot_3_execution_closeout;
  const failFixture = readJson(failFixturePath).exact_new_trial_003_shot_3_execution_closeout;

  assert(payload.phase === "v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight", "payload phase mismatch");
  assert(payload.diagnostic_axes_before_call.provider_tool_result === "not_called_yet", "payload must stay pre-call");
  assert(payload.boundary_before_call.raw_provider_payload_capture_performed === true, "payload must prove pre-call capture");
  assert(payload.boundary_before_call.provider_call_performed === false, "payload must not record provider call");
  assert(attempt.attempt_status === "succeeded_image_generated", "attempt status mismatch");
  assert(attempt.output_image_sha256 === expectedSha, "attempt output sha mismatch");
  assert(attempt.local_persistence_success === true && attempt.reviewable_sample === true, "attempt must prove local persistence and reviewability");
  assert(attempt.raw_provider_payload_capture_performed === true && attempt.post_provider_payload_reconstruction_performed === false, "attempt must preserve pre-call payload timing truth");
  assert(receipt.receipt_status === "succeeded_image_generated", "receipt status mismatch");
  assert(receipt.local_persistence_success === true, "receipt must prove local persistence success");
  assert(receipt.raw_provider_payload_capture_performed === true && receipt.post_provider_payload_reconstruction_performed === false, "receipt must preserve payload timing truth");
  assert(registry.entries.length === 1 && registry.entries[0].output_image_path === imagePath, "registry entry mismatch");
  assert(bridge.bridge_status === "ready_for_review_and_post_run_assessment", "bridge status mismatch");

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const result = {
    phase,
    passed: true,
    attempt_id: report.attempt_id,
    output_image_sha256: report.output_image_sha256,
    local_persistence_verification_satisfied: report.protocol_compliance.local_persistence_verification_satisfied,
    pre_provider_call_payload_capture_satisfied: report.protocol_compliance.pre_provider_call_payload_capture_satisfied,
    post_provider_call_payload_reconstruction_performed: report.protocol_compliance.post_provider_call_payload_reconstruction_performed,
    reviewable_sample: report.review.reviewable_sample,
    accepted_candidate: report.review.accepted_candidate,
    commercial_delivery_ready: report.review.commercial_delivery_ready,
    memory_suitability: report.review.memory_suitability,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
