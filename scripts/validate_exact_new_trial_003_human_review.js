#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { sourceArtifactHashEvidence } = require("./lib/exact_new_trial_legacy_artifacts");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_32_exact_new_trial_003_human_review";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_003_human_review.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_003_human_review_fail.example.json";
const expectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const expectedProviderRoute = "image_gen.imagegen";
const expectedRecommendedNext = "prepare_exact_new_trial_003_selected_candidate_human_approval_intake_before_any_promotion_or_memory_write";

const candidateExpectations = [
  {
    attempt_id: "v0_3_3_exact_new_trial_003_shot_1",
    closeout_phase: "v0_6_27_exact_new_trial_003_shot_1_execution_closeout",
    closeout_report_ref: "reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json",
    output_image_path: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/safe_adult_editorial_portrait_v1.png",
    output_image_sha256: "07a4ddc934c6e7ed88deefa9a1de6c8d06eb4407f4858f6688411dfa2bf60840",
    pre_provider_call_payload_capture_satisfied: false,
    post_provider_call_payload_reconstruction_performed: true,
    preference_rank: 3
  },
  {
    attempt_id: "v0_3_3_exact_new_trial_003_shot_2",
    closeout_phase: "v0_6_29_exact_new_trial_003_shot_2_execution_closeout",
    closeout_report_ref: "reports/visual_asset_eval_dry_run/v0_6_29_exact_new_trial_003_shot_2_execution_closeout.json",
    output_image_path: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
    output_image_sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
    pre_provider_call_payload_capture_satisfied: true,
    post_provider_call_payload_reconstruction_performed: false,
    preference_rank: 1
  },
  {
    attempt_id: "v0_3_3_exact_new_trial_003_shot_3",
    closeout_phase: "v0_6_31_exact_new_trial_003_shot_3_execution_closeout",
    closeout_report_ref: "reports/visual_asset_eval_dry_run/v0_6_31_exact_new_trial_003_shot_3_execution_closeout.json",
    output_image_path: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/safe_adult_editorial_portrait_v1.png",
    output_image_sha256: "c3f69ce85eb2fa1d7e92fe0bc0c493a13fb830ea9fd10d2e5d73056e33e143a7",
    pre_provider_call_payload_capture_satisfied: true,
    post_provider_call_payload_reconstruction_performed: false,
    preference_rank: 2
  }
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

function dimensionsEqual(actual) {
  return actual && actual.width === 941 && actual.height === 1672;
}

function uniqueValues(items, key) {
  return new Set(items.map((item) => item[key])).size === items.length;
}

function rootKeyForPhase(phaseName) {
  if (phaseName === "v0_6_27_exact_new_trial_003_shot_1_execution_closeout") return "exact_new_trial_003_shot_1_execution_closeout";
  if (phaseName === "v0_6_29_exact_new_trial_003_shot_2_execution_closeout") return "exact_new_trial_003_shot_2_execution_closeout";
  if (phaseName === "v0_6_31_exact_new_trial_003_shot_3_execution_closeout") return "exact_new_trial_003_shot_3_execution_closeout";
  throw new Error(`Unsupported closeout phase: ${phaseName}`);
}

function validateCandidate(candidate, expected, context) {
  assert(candidate.attempt_id === expected.attempt_id, `${context}.attempt_id mismatch`);
  assert(candidate.closeout_phase === expected.closeout_phase, `${context}.closeout_phase mismatch`);
  assert(candidate.closeout_report_ref === expected.closeout_report_ref, `${context}.closeout_report_ref mismatch`);
  assert(candidate.output_image_path === expected.output_image_path, `${context}.output_image_path mismatch`);
  assert(candidate.output_image_sha256 === expected.output_image_sha256, `${context}.output_image_sha256 mismatch`);
  assert(dimensionsEqual(candidate.output_image_dimensions), `${context}.output_image_dimensions mismatch`);
  assert(candidate.pre_provider_call_payload_capture_satisfied === expected.pre_provider_call_payload_capture_satisfied, `${context}.pre_provider_call_payload_capture_satisfied mismatch`);
  assert(candidate.post_provider_call_payload_reconstruction_performed === expected.post_provider_call_payload_reconstruction_performed, `${context}.post_provider_call_payload_reconstruction_performed mismatch`);
  assert(candidate.reviewable_sample === true, `${context}.reviewable_sample must be true`);
  assert(candidate.accepted_candidate === true, `${context}.accepted_candidate must be true`);
  assert(candidate.commercial_delivery_ready === false, `${context}.commercial_delivery_ready must be false`);
  assert(candidate.preference_rank === expected.preference_rank, `${context}.preference_rank mismatch`);
  assert(Array.isArray(candidate.review_notes) && candidate.review_notes.length >= 2, `${context}.review_notes missing`);

  const closeoutRoot = readJson(expected.closeout_report_ref);
  const closeout = closeoutRoot[rootKeyForPhase(expected.closeout_phase)];
  assert(closeout.phase === expected.closeout_phase, `${context}.closeout.phase mismatch`);
  assert(closeout.attempt_id === expected.attempt_id, `${context}.closeout.attempt_id mismatch`);
  assert(closeout.output_image_path === expected.output_image_path, `${context}.closeout.output_image_path mismatch`);
  assert(closeout.output_image_sha256 === expected.output_image_sha256, `${context}.closeout.output_image_sha256 mismatch`);
  assert(dimensionsEqual(closeout.output_image_dimensions), `${context}.closeout.output_image_dimensions mismatch`);
  assert(closeout.protocol_compliance.pre_provider_call_payload_capture_satisfied === expected.pre_provider_call_payload_capture_satisfied, `${context}.closeout pre-call truth mismatch`);
  assert(closeout.protocol_compliance.post_provider_call_payload_reconstruction_performed === expected.post_provider_call_payload_reconstruction_performed, `${context}.closeout post-call truth mismatch`);
  assert(closeout.review.reviewable_sample === true, `${context}.closeout reviewable_sample mismatch`);
  assert(closeout.review.accepted_candidate === true, `${context}.closeout accepted_candidate mismatch`);

  const imageEvidence = sourceArtifactHashEvidence(expected.output_image_path, expected.output_image_sha256);
  assert(imageEvidence.passed, `${context}.output image hash evidence mismatch`);
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawOrSecretPath(record, context);
  assert(record.phase === phase, `${context}.phase mismatch`);
  assert(
    record.status === "completed_validated_local_candidate_selection_pending_formal_human_approval" ||
      record.status === "fixture_valid_local_human_review_selection",
    `${context}.status mismatch`
  );
  assert(record.source_phase === "v0_6_31_exact_new_trial_003_shot_3_execution_closeout", `${context}.source_phase mismatch`);
  assert(record.prompt_package_ref === expectedPrompt, `${context}.prompt_package_ref mismatch`);
  assert(record.provider_route === expectedProviderRoute, `${context}.provider_route mismatch`);
  assert(record.three_shot_execution_status === "3_of_3_completed", `${context}.three_shot_execution_status mismatch`);

  const comparison = record.candidate_comparison;
  assert(comparison.review_mode === "local_visual_comparison_before_formal_human_approval", `${context}.candidate_comparison.review_mode mismatch`);
  assert(comparison.review_completed_now === true, `${context}.candidate_comparison.review_completed_now must be true`);
  assert(comparison.preferred_candidate_selected_now === true, `${context}.candidate_comparison.preferred_candidate_selected_now must be true`);
  assert(JSON.stringify(comparison.compared_attempt_ids) === JSON.stringify(candidateExpectations.map((candidate) => candidate.attempt_id)), `${context}.candidate_comparison.compared_attempt_ids mismatch`);
  assert(comparison.selected_candidate_attempt_id === "v0_3_3_exact_new_trial_003_shot_2", `${context}.candidate_comparison.selected_candidate_attempt_id mismatch`);
  assert(comparison.selected_candidate_output_image_path === candidateExpectations[1].output_image_path, `${context}.candidate_comparison.selected_candidate_output_image_path mismatch`);
  assert(comparison.selected_candidate_output_image_sha256 === candidateExpectations[1].output_image_sha256, `${context}.candidate_comparison.selected_candidate_output_image_sha256 mismatch`);
  assert(Array.isArray(comparison.selection_rationale) && comparison.selection_rationale.length === 3, `${context}.candidate_comparison.selection_rationale mismatch`);

  const candidates = record.candidate_matrix;
  assert(Array.isArray(candidates) && candidates.length === 3, `${context}.candidate_matrix must contain exactly 3 candidates`);
  assert(uniqueValues(candidates, "attempt_id"), `${context}.candidate_matrix attempt ids must be unique`);
  assert(uniqueValues(candidates, "preference_rank"), `${context}.candidate_matrix preference ranks must be unique`);
  for (let index = 0; index < candidateExpectations.length; index += 1) {
    validateCandidate(candidates[index], candidateExpectations[index], `${context}.candidate_matrix.${index}`);
  }

  const decision = record.decision_boundary;
  assert(decision.selected_candidate_ready_for_formal_human_approval_intake === true, `${context}.decision_boundary.selected_candidate_ready_for_formal_human_approval_intake must be true`);
  assert(decision.formal_human_approval_status === "pending", `${context}.decision_boundary.formal_human_approval_status must be pending`);
  assert(decision.human_approval_captured_now === false, `${context}.decision_boundary.human_approval_captured_now must be false`);
  assert(decision.accepted_sample_auto_promotion === false, `${context}.decision_boundary.accepted_sample_auto_promotion must be false`);
  assert(decision.archive_write_performed === false, `${context}.decision_boundary.archive_write_performed must be false`);
  assert(decision.production_candidate_created === false, `${context}.decision_boundary.production_candidate_created must be false`);
  assert(decision.commercial_delivery_ready === false, `${context}.decision_boundary.commercial_delivery_ready must be false`);
  assert(decision.memory_suitability === "deferred", `${context}.decision_boundary.memory_suitability must be deferred`);
  assert(decision.VCP_memory_write_performed === false, `${context}.decision_boundary.VCP_memory_write_performed must be false`);
  assert(decision.DailyNote_write_performed === false, `${context}.decision_boundary.DailyNote_write_performed must be false`);

  const boundary = record.boundary;
  assert(boundary.provider_call_performed === false, `${context}.boundary.provider_call_performed must be false`);
  assert(boundary.image_generation_performed === false, `${context}.boundary.image_generation_performed must be false`);
  assert(boundary.raw_provider_payload_capture_performed === false, `${context}.boundary.raw_provider_payload_capture_performed must be false`);
  assert(boundary.raw_provider_response_capture_performed === false, `${context}.boundary.raw_provider_response_capture_performed must be false`);
  assert(boundary.secret_value_read_performed === false, `${context}.boundary.secret_value_read_performed must be false`);
  assert(boundary.accepted_sample_auto_promotion === false, `${context}.boundary.accepted_sample_auto_promotion must be false`);
  assert(boundary.archive_write_performed === false, `${context}.boundary.archive_write_performed must be false`);
  assert(boundary.production_candidate_created === false, `${context}.boundary.production_candidate_created must be false`);
  assert(boundary.VCP_memory_write_performed === false, `${context}.boundary.VCP_memory_write_performed must be false`);
  assert(boundary.DailyNote_write_performed === false, `${context}.boundary.DailyNote_write_performed must be false`);
  assert(boundary.commit_performed === false, `${context}.boundary.commit_performed must be false`);
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
    expectFailure(validRecord, "selected_candidate_drift", (candidate) => { candidate.candidate_comparison.selected_candidate_attempt_id = "v0_3_3_exact_new_trial_003_shot_1"; }),
    expectFailure(validRecord, "selected_candidate_sha_drift", (candidate) => { candidate.candidate_comparison.selected_candidate_output_image_sha256 = "deadbeef"; }),
    expectFailure(validRecord, "compared_attempt_ids_drift", (candidate) => { candidate.candidate_comparison.compared_attempt_ids = ["v0_3_3_exact_new_trial_003_shot_2"]; }),
    expectFailure(validRecord, "rank_duplicate", (candidate) => { candidate.candidate_matrix[2].preference_rank = 1; }),
    expectFailure(validRecord, "shot1_precall_truth_drift", (candidate) => { candidate.candidate_matrix[0].pre_provider_call_payload_capture_satisfied = true; }),
    expectFailure(validRecord, "shot2_selected_rank_drift", (candidate) => { candidate.candidate_matrix[1].preference_rank = 2; }),
    expectFailure(validRecord, "shot3_hash_drift", (candidate) => { candidate.candidate_matrix[2].output_image_sha256 = "badbad"; }),
    expectFailure(validRecord, "human_approval_true", (candidate) => { candidate.decision_boundary.human_approval_captured_now = true; }),
    expectFailure(validRecord, "accepted_sample_true", (candidate) => { candidate.decision_boundary.accepted_sample_auto_promotion = true; }),
    expectFailure(validRecord, "archive_write_true", (candidate) => { candidate.decision_boundary.archive_write_performed = true; }),
    expectFailure(validRecord, "production_true", (candidate) => { candidate.decision_boundary.production_candidate_created = true; }),
    expectFailure(validRecord, "memory_write_true", (candidate) => { candidate.decision_boundary.VCP_memory_write_performed = true; }),
    expectFailure(validRecord, "provider_call_true", (candidate) => { candidate.boundary.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true", (candidate) => { candidate.boundary.image_generation_performed = true; }),
    expectFailure(validRecord, "recommended_next_drift", (candidate) => { candidate.recommended_next = "promote_directly_to_memory"; }),
    expectFailure(validRecord, "raw_local_path", (candidate) => { candidate.candidate_matrix[1].output_image_path = "C:\\private\\image.png"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  for (const relativePath of [reportPath, passFixturePath, failFixturePath, ...candidateExpectations.map((candidate) => candidate.closeout_report_ref)]) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const report = readJson(reportPath).exact_new_trial_003_human_review;
  const passFixture = readJson(passFixturePath).exact_new_trial_003_human_review;
  const failFixture = readJson(failFixturePath).exact_new_trial_003_human_review;

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const result = {
    phase,
    passed: true,
    selected_candidate_attempt_id: report.candidate_comparison.selected_candidate_attempt_id,
    selected_candidate_output_image_sha256: report.candidate_comparison.selected_candidate_output_image_sha256,
    compared_candidate_count: report.candidate_matrix.length,
    formal_human_approval_status: report.decision_boundary.formal_human_approval_status,
    human_approval_captured_now: report.decision_boundary.human_approval_captured_now,
    accepted_sample_auto_promotion: report.decision_boundary.accepted_sample_auto_promotion,
    production_candidate_created: report.decision_boundary.production_candidate_created,
    commercial_delivery_ready: report.decision_boundary.commercial_delivery_ready,
    memory_suitability: report.decision_boundary.memory_suitability,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
