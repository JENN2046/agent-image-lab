#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight";
const expectedAttemptId = "v0_3_3_exact_new_trial_003_shot_3";
const expectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const payloadCapturePath = "reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_3_request_payload.sanitized.json";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_003_shot_3_pre_call_payload_capture_preflight_fail.example.json";
const shot3ExecutionCloseoutPath = "reports/visual_asset_eval_dry_run/v0_6_31_exact_new_trial_003_shot_3_execution_closeout.json";
const outputDirectory = "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/";
const outputImagePath = "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/safe_adult_editorial_portrait_v1.png";
const attemptResultPath = "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/generation_attempt_result.json";
const receiptPath = "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_receipt.json";
const registryPath = "reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_3_registry.json";
const bridgePath = "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_3/bridge_entry.json";

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

function sha256(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function extractYamlBlock(text, key) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${key}: |`);
  assert(start !== -1, `Missing YAML block: ${key}`);

  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^[A-Za-z0-9_]+:\s*/.test(line)) break;
    if (line.trim() === "" && block.length === 0) continue;
    block.push(line.startsWith("  ") ? line.slice(2) : line);
  }
  return block.join("\n").trim();
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

function validateCapture(capture) {
  const promptPackageText = read(expectedPrompt);
  const promptText = extractYamlBlock(promptPackageText, "prompt");
  const negativePromptText = extractYamlBlock(promptPackageText, "negative_prompt");

  assertNoRawOrSecretPath(capture, "capture");
  assert(capture.phase === phase, "capture.phase mismatch");
  assert(capture.payload_capture_id === "v0_3_3_exact_new_trial_003_shot_3_request_payload_sanitized", "capture id mismatch");
  assert(capture.attempt_id === expectedAttemptId, "capture.attempt_id mismatch");
  assert(capture.mode === "real_generation_request_payload_capture_before_provider_call", "capture.mode mismatch");
  assert(capture.provider_route === "image_gen.imagegen", "capture.provider_route mismatch");
  assert(capture.prompt_package_ref === expectedPrompt, "capture.prompt_package_ref mismatch");
  assert(capture.prompt_source_field === "prompt", "capture.prompt_source_field mismatch");
  assert(capture.payload_capture_mode === "pre_provider_call_sanitized_request_payload", "capture.payload_capture_mode mismatch");
  assert(capture.payload.prompt === promptText, "capture payload prompt mismatch");
  assert(capture.prompt_text_sha256 === sha256(promptText), "capture.prompt_text_sha256 mismatch");
  assert(capture.prompt_text_length === promptText.length, "capture.prompt_text_length mismatch");
  assert(capture.prompt_package_sha256 === sha256(promptPackageText), "capture.prompt_package_sha256 mismatch");
  assert(capture.negative_prompt_text_sha256 === sha256(negativePromptText), "capture.negative_prompt_text_sha256 mismatch");
  assert(capture.final_payload_prompt_equals_prompt_field === true, "capture.final_payload_prompt_equals_prompt_field must be true");
  assert(capture.negative_prompt_included === false, "capture.negative_prompt_included must be false");
  assert(capture.yaml_metadata_included === false, "capture.yaml_metadata_included must be false");
  assert(capture.authorization_text_included === false, "capture.authorization_text_included must be false");
  assert(capture.path_text_included_in_prompt === false, "capture.path_text_included_in_prompt must be false");
  assert(capture.diagnostic_axes_before_call.path_authorization === "003_shot_3_paths_absent_payload_captured_no_overwrite", "capture.path_authorization mismatch");

  const targetFiles = capture.target_execution_files_at_capture_time;
  assert(targetFiles.output_directory_exists_now === false, "capture.target_execution_files_at_capture_time.output_directory_exists_now must be false");
  assert(targetFiles.output_image_exists_now === false, "capture.target_execution_files_at_capture_time.output_image_exists_now must be false");
  assert(targetFiles.attempt_result_exists_now === false, "capture.target_execution_files_at_capture_time.attempt_result_exists_now must be false");
  assert(targetFiles.receipt_exists_now === false, "capture.target_execution_files_at_capture_time.receipt_exists_now must be false");
  assert(targetFiles.registry_exists_now === false, "capture.target_execution_files_at_capture_time.registry_exists_now must be false");
  assert(targetFiles.review_console_bridge_exists_now === false, "capture.target_execution_files_at_capture_time.review_console_bridge_exists_now must be false");

  const boundary = capture.boundary_before_call;
  assert(boundary.max_provider_calls === 1, "capture.boundary_before_call.max_provider_calls must be 1");
  assert(boundary.max_image_candidates === 1, "capture.boundary_before_call.max_image_candidates must be 1");
  assert(boundary.retry_limit === 0, "capture.boundary_before_call.retry_limit must be 0");
  assert(boundary.overwrite_existing_files_allowed === false, "capture.boundary_before_call.overwrite_existing_files_allowed must be false");
  assert(boundary.raw_provider_payload_capture_performed === true, "capture.boundary_before_call.raw_provider_payload_capture_performed must be true");
  assert(boundary.raw_provider_response_capture_allowed === false, "capture.boundary_before_call.raw_provider_response_capture_allowed must be false");
  assert(boundary.secret_value_read_allowed === false, "capture.boundary_before_call.secret_value_read_allowed must be false");
  assert(boundary.VCP_memory_write_allowed === false, "capture.boundary_before_call.VCP_memory_write_allowed must be false");
  assert(boundary.DailyNote_write_allowed === false, "capture.boundary_before_call.DailyNote_write_allowed must be false");
  assert(boundary.accepted_sample_auto_promotion_allowed === false, "capture.boundary_before_call.accepted_sample_auto_promotion_allowed must be false");
  assert(boundary.push_allowed === false, "capture.boundary_before_call.push_allowed must be false");
  assert(boundary.provider_call_performed === false, "capture.boundary_before_call.provider_call_performed must be false");
  assert(boundary.image_generation_performed === false, "capture.boundary_before_call.image_generation_performed must be false");
}

function validateRecord(record, context) {
  const promptPackageText = read(expectedPrompt);
  const negativePromptText = extractYamlBlock(promptPackageText, "negative_prompt");
  assertNoRawOrSecretPath(record, context);
  assert(record.phase === phase, `${context}.phase mismatch`);
  assert(record.attempt_id === expectedAttemptId, `${context}.attempt_id mismatch`);
  assert(record.provider_route === "image_gen.imagegen", `${context}.provider_route mismatch`);
  assert(record.prompt_package_ref === expectedPrompt, `${context}.prompt_package_ref mismatch`);
  assert(record.payload_capture_ref === payloadCapturePath, `${context}.payload_capture_ref mismatch`);
  assert(record.planned_output_directory === outputDirectory, `${context}.planned_output_directory mismatch`);
  assert(record.planned_output_image_path === outputImagePath, `${context}.planned_output_image_path mismatch`);
  assert(record.planned_attempt_result_path === attemptResultPath, `${context}.planned_attempt_result_path mismatch`);
  assert(record.planned_receipt_path === receiptPath, `${context}.planned_receipt_path mismatch`);
  assert(record.planned_registry_path === registryPath, `${context}.planned_registry_path mismatch`);
  assert(record.planned_review_console_bridge_ref === bridgePath, `${context}.planned_review_console_bridge_ref mismatch`);

  const collision = record.path_collision_recheck;
  assert(collision.output_directory_exists_now === false, `${context}.path_collision_recheck.output_directory_exists_now must be false`);
  assert(collision.output_image_exists_now === false, `${context}.path_collision_recheck.output_image_exists_now must be false`);
  assert(collision.attempt_result_exists_now === false, `${context}.path_collision_recheck.attempt_result_exists_now must be false`);
  assert(collision.receipt_exists_now === false, `${context}.path_collision_recheck.receipt_exists_now must be false`);
  assert(collision.registry_exists_now === false, `${context}.path_collision_recheck.registry_exists_now must be false`);
  assert(collision.review_console_bridge_exists_now === false, `${context}.path_collision_recheck.review_console_bridge_exists_now must be false`);
  assert(collision.path_collision_clear_now === true, `${context}.path_collision_recheck.path_collision_clear_now must be true`);

  const payloadTruth = record.payload_capture_truth;
  assert(payloadTruth.pre_provider_call_payload_capture_required === true, `${context}.payload_capture_truth.pre_provider_call_payload_capture_required must be true`);
  assert(payloadTruth.pre_provider_call_payload_capture_satisfied === true, `${context}.payload_capture_truth.pre_provider_call_payload_capture_satisfied must be true`);
  assert(payloadTruth.payload_capture_mode === "pre_provider_call_sanitized_request_payload", `${context}.payload_capture_truth.payload_capture_mode mismatch`);
  assert(payloadTruth.prompt_text_sha256 === "8469661cb4fe64e8280f6a64801e8583b3180f4a405b25cba433f7e3eb6172fd", `${context}.payload_capture_truth.prompt_text_sha256 mismatch`);
  assert(payloadTruth.prompt_text_length === 519, `${context}.payload_capture_truth.prompt_text_length mismatch`);
  assert(payloadTruth.prompt_package_sha256 === sha256(promptPackageText), `${context}.payload_capture_truth.prompt_package_sha256 mismatch`);
  assert(payloadTruth.negative_prompt_text_sha256 === sha256(negativePromptText), `${context}.payload_capture_truth.negative_prompt_text_sha256 mismatch`);
  assert(payloadTruth.final_payload_prompt_equals_prompt_field === true, `${context}.payload_capture_truth.final_payload_prompt_equals_prompt_field must be true`);
  assert(payloadTruth.negative_prompt_included === false, `${context}.payload_capture_truth.negative_prompt_included must be false`);
  assert(payloadTruth.yaml_metadata_included === false, `${context}.payload_capture_truth.yaml_metadata_included must be false`);
  assert(payloadTruth.authorization_text_included === false, `${context}.payload_capture_truth.authorization_text_included must be false`);
  assert(payloadTruth.path_text_included_in_prompt === false, `${context}.payload_capture_truth.path_text_included_in_prompt must be false`);

  const boundary = record.boundary;
  assert(boundary.provider_call_performed === false, `${context}.boundary.provider_call_performed must be false`);
  assert(boundary.image_generation_performed === false, `${context}.boundary.image_generation_performed must be false`);
  assert(boundary.retry_performed === false, `${context}.boundary.retry_performed must be false`);
  assert(boundary.raw_provider_payload_capture_performed === true, `${context}.boundary.raw_provider_payload_capture_performed must be true`);
  assert(boundary.raw_provider_response_capture_performed === false, `${context}.boundary.raw_provider_response_capture_performed must be false`);
  assert(boundary.secret_value_read_performed === false, `${context}.boundary.secret_value_read_performed must be false`);
  assert(boundary.VCP_memory_write_performed === false, `${context}.boundary.VCP_memory_write_performed must be false`);
  assert(boundary.DailyNote_write_performed === false, `${context}.boundary.DailyNote_write_performed must be false`);
  assert(boundary.accepted_sample_auto_promotion === false, `${context}.boundary.accepted_sample_auto_promotion must be false`);
  assert(boundary.production_candidate_created === false, `${context}.boundary.production_candidate_created must be false`);
  assert(boundary.commit_performed === false, `${context}.boundary.commit_performed must be false`);
  assert(boundary.push_performed === false, `${context}.boundary.push_performed must be false`);

  assert(record.recommended_next === "execute_v0_3_3_exact_new_trial_003_shot_3_with_pre_captured_payload_and_post_write_local_persistence_verification_before_any_auto_promotion_or_memory_write", `${context}.recommended_next mismatch`);
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
    expectFailure(validRecord, "provider_route_drift", (candidate) => { candidate.provider_route = "other.route"; }),
    expectFailure(validRecord, "payload_capture_ref_drift", (candidate) => { candidate.payload_capture_ref = "reports/provider_payload_captures/other.json"; }),
    expectFailure(validRecord, "output_dir_collision", (candidate) => { candidate.path_collision_recheck.output_directory_exists_now = true; }),
    expectFailure(validRecord, "image_collision", (candidate) => { candidate.path_collision_recheck.output_image_exists_now = true; }),
    expectFailure(validRecord, "collision_clear_false", (candidate) => { candidate.path_collision_recheck.path_collision_clear_now = false; }),
    expectFailure(validRecord, "pre_call_required_false", (candidate) => { candidate.payload_capture_truth.pre_provider_call_payload_capture_required = false; }),
    expectFailure(validRecord, "pre_call_satisfied_false", (candidate) => { candidate.payload_capture_truth.pre_provider_call_payload_capture_satisfied = false; }),
    expectFailure(validRecord, "payload_mode_drift", (candidate) => { candidate.payload_capture_truth.payload_capture_mode = "post_provider_call_reconstructed_sanitized_request_payload"; }),
    expectFailure(validRecord, "prompt_hash_drift", (candidate) => { candidate.payload_capture_truth.prompt_text_sha256 = "deadbeef"; }),
    expectFailure(validRecord, "negative_prompt_included_true", (candidate) => { candidate.payload_capture_truth.negative_prompt_included = true; }),
    expectFailure(validRecord, "yaml_metadata_included_true", (candidate) => { candidate.payload_capture_truth.yaml_metadata_included = true; }),
    expectFailure(validRecord, "authorization_text_included_true", (candidate) => { candidate.payload_capture_truth.authorization_text_included = true; }),
    expectFailure(validRecord, "path_text_included_true", (candidate) => { candidate.payload_capture_truth.path_text_included_in_prompt = true; }),
    expectFailure(validRecord, "provider_called", (candidate) => { candidate.boundary.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generated", (candidate) => { candidate.boundary.image_generation_performed = true; }),
    expectFailure(validRecord, "raw_payload_false", (candidate) => { candidate.boundary.raw_provider_payload_capture_performed = false; }),
    expectFailure(validRecord, "secret_true", (candidate) => { candidate.boundary.secret_value_read_performed = true; }),
    expectFailure(validRecord, "memory_true", (candidate) => { candidate.boundary.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "promotion_true", (candidate) => { candidate.boundary.accepted_sample_auto_promotion = true; }),
    expectFailure(validRecord, "push_true", (candidate) => { candidate.boundary.push_performed = true; }),
    expectFailure(validRecord, "recommended_next_drift", (candidate) => { candidate.recommended_next = "promote_now"; }),
    expectFailure(validRecord, "raw_local_path", (candidate) => { candidate.payload_capture_ref = "C:\\private\\payload.json"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function shot3ExecutionCloseoutExists() {
  if (!exists(shot3ExecutionCloseoutPath)) return false;
  const reportRoot = readJson(shot3ExecutionCloseoutPath);
  const report = reportRoot.exact_new_trial_003_shot_3_execution_closeout;
  return Boolean(
    report &&
    report.phase === "v0_6_31_exact_new_trial_003_shot_3_execution_closeout" &&
    report.attempt_id === expectedAttemptId &&
    report.protocol_compliance?.local_persistence_verification_satisfied === true
  );
}

function main() {
  for (const relativePath of [payloadCapturePath, reportPath, passFixturePath, failFixturePath, expectedPrompt]) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const executedAfterPreflight = shot3ExecutionCloseoutExists();
  if (executedAfterPreflight) {
    assert(exists(outputDirectory), "output directory must exist after shot_3 execution closeout");
    assert(exists(outputImagePath), "output image must exist after shot_3 execution closeout");
    assert(exists(attemptResultPath), "attempt result must exist after shot_3 execution closeout");
    assert(exists(receiptPath), "receipt must exist after shot_3 execution closeout");
    assert(exists(registryPath), "registry must exist after shot_3 execution closeout");
    assert(exists("review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_3"), "review console bridge directory must exist after shot_3 execution closeout");
  } else {
    assert(!exists(outputDirectory), "output directory must remain absent before shot_3 execution");
    assert(!exists(outputImagePath), "output image must remain absent before shot_3 execution");
    assert(!exists(attemptResultPath), "attempt result must remain absent before shot_3 execution");
    assert(!exists(receiptPath), "receipt must remain absent before shot_3 execution");
    assert(!exists(registryPath), "registry must remain absent before shot_3 execution");
    assert(!exists("review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_3"), "review console bridge directory must remain absent before shot_3 execution");
  }

  const capture = readJson(payloadCapturePath);
  const report = readJson(reportPath).exact_new_trial_003_shot_3_pre_call_payload_capture_preflight;
  const passFixture = readJson(passFixturePath).exact_new_trial_003_shot_3_pre_call_payload_capture_preflight;
  const failFixture = readJson(failFixturePath).exact_new_trial_003_shot_3_pre_call_payload_capture_preflight;

  validateCapture(capture);
  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeSummary = validateNegativeCases(passFixture, failFixture);

  process.stdout.write(`${JSON.stringify({
    phase,
    passed: true,
    attempt_id: report.attempt_id,
    payload_capture_ref: report.payload_capture_ref,
    pre_provider_call_payload_capture_satisfied: report.payload_capture_truth.pre_provider_call_payload_capture_satisfied,
    path_collision_clear_now: report.path_collision_recheck.path_collision_clear_now,
    provider_call_performed: report.boundary.provider_call_performed,
    image_generation_performed: report.boundary.image_generation_performed,
    executed_after_preflight: executedAfterPreflight,
    negative_case_count: negativeSummary.negative_case_count,
    caught_negative_case_count: negativeSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeSummary.all_negative_cases_caught
  }, null, 2)}\n`);
}

main();
