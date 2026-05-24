#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_26_exact_new_trial_local_persistence_repair_preflight";
const docPath = "docs/V0_6_26_EXACT_NEW_TRIAL_LOCAL_PERSISTENCE_REPAIR_PREFLIGHT.md";
const schemaPath = "schemas/exact_new_trial_local_persistence_repair_preflight.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_26_exact_new_trial_local_persistence_repair_preflight.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_local_persistence_repair_preflight_fail.example.json";
const truthReviewPath = "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json";
const stabilityReportPath = "reports/visual_asset_eval_dry_run/v0_6_24_exact_new_trial_3shot_stability_preflight.json";
const altAttemptPath = "runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json";
const altReceiptPath = "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json";
const altImagePath = "runs/real_generation/v0_3_3_safe_portrait_001/safe_adult_editorial_portrait_v1.png";
const claimedMissingImagePath = "runs/real_generation/v0_3_3_exact_new_trial_002/safe_adult_editorial_portrait_v1.png";
const expectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const expectedProviderRoute = "image_gen.imagegen";
const expectedAltSha = "e041f1c69624595aa92592b5209b8e887fec9d2d49155f9bae82409a76d65591";
const expectedClaimed002Sha = "3c08be9be98d36d94cc5d13de82b8c21c3f63533915fe59e814d99fdef3b4d96";
const selectedShotId = "v0_3_3_exact_new_trial_003_shot_1";

const falseBoundaryFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "private_out_of_repo_recovery_performed",
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

function sha256File(relativePath) {
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

function assertFalseBoundary(boundary, context) {
  assert(boundary && typeof boundary === "object", `${context} missing`);
  for (const flag of falseBoundaryFlags) {
    assert(boundary[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawOrSecretPath(record, context);
  assert(record.phase === phase, `${context}.phase mismatch`);
  assert(record.doc_ref === docPath, `${context}.doc_ref mismatch`);
  assert(record.source_truth_review_ref === truthReviewPath, `${context}.source_truth_review_ref mismatch`);
  assert(record.target_attempt_id === "v0_3_3_exact_new_trial_002", `${context}.target_attempt_id mismatch`);
  assert(record.prompt_package_ref === expectedPrompt, `${context}.prompt_package_ref mismatch`);
  assert(record.provider_route === expectedProviderRoute, `${context}.provider_route mismatch`);

  assert(Array.isArray(record.repair_route_review) && record.repair_route_review.length === 3, `${context}.repair_route_review must contain 3 routes`);
  const routeIds = record.repair_route_review.map((route) => route.route_id);
  assert(JSON.stringify(routeIds) === JSON.stringify([
    "exact_repo_replacement",
    "private_out_of_repo_recovery",
    "fresh_non_overwriting_future_shot"
  ]), `${context}.repair_route_review route ids mismatch`);

  const exactReplacement = record.repair_route_review[0];
  assert(exactReplacement.status === "rejected_non_exact_substitution", `${context}.exact_repo_replacement status mismatch`);
  assert(exactReplacement.repo_tracked_same_prompt_alternative_exists === true, `${context}.exact_repo_replacement alt existence mismatch`);
  assert(exactReplacement.alternative_attempt_id === "attempt-v0-3-3-safe-portrait-001", `${context}.exact_repo_replacement alternative_attempt_id mismatch`);
  assert(exactReplacement.alternative_output_image_path === altImagePath, `${context}.exact_repo_replacement alternative_output_image_path mismatch`);
  assert(exactReplacement.alternative_output_image_sha256 === expectedAltSha, `${context}.exact_repo_replacement alternative_output_image_sha256 mismatch`);
  assert(exactReplacement.claimed_002_output_image_sha256 === expectedClaimed002Sha, `${context}.exact_repo_replacement claimed_002_output_image_sha256 mismatch`);
  assert(exactReplacement.substitutable_for_exact_002 === false, `${context}.exact_repo_replacement substitution flag must be false`);

  const privateRecovery = record.repair_route_review[1];
  assert(privateRecovery.status === "blocked_private_path_boundary", `${context}.private_out_of_repo_recovery status mismatch`);
  assert(privateRecovery.private_out_of_repo_recovery_allowed_now === false, `${context}.private_out_of_repo_recovery_allowed_now must be false`);

  const freshShot = record.repair_route_review[2];
  assert(freshShot.status === "selected_preferred_route", `${context}.fresh_non_overwriting_future_shot status mismatch`);
  assert(freshShot.selected_shot_id === selectedShotId, `${context}.fresh_non_overwriting_future_shot selected_shot_id mismatch`);
  assert(freshShot.output_directory === "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/", `${context}.fresh_non_overwriting_future_shot output_directory mismatch`);
  assert(freshShot.output_image_path === "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/safe_adult_editorial_portrait_v1.png", `${context}.fresh_non_overwriting_future_shot output_image_path mismatch`);
  assert(freshShot.path_collision_clear_now === true, `${context}.fresh_non_overwriting_future_shot path_collision_clear_now must be true`);
  assert(freshShot.local_persistence_verification_required === true, `${context}.fresh_non_overwriting_future_shot local persistence flag mismatch`);
  assert(freshShot.review_required_after_success === true, `${context}.fresh_non_overwriting_future_shot review_required_after_success mismatch`);
  assert(freshShot.overwrite_existing_files_allowed === false, `${context}.fresh_non_overwriting_future_shot overwrite flag mismatch`);

  const selected = record.selected_repair_route;
  assert(selected.route_id === "fresh_non_overwriting_future_shot", `${context}.selected_repair_route route_id mismatch`);
  assert(selected.selected_shot_id === selectedShotId, `${context}.selected_repair_route selected_shot_id mismatch`);
  assert(selected.path_collision_clear_now === true, `${context}.selected_repair_route path_collision_clear_now mismatch`);
  assert(selected.local_persistence_verification_required === true, `${context}.selected_repair_route local persistence flag mismatch`);
  assert(selected.review_required_after_success === true, `${context}.selected_repair_route review flag mismatch`);
  assert(selected.current_human_review_of_002_allowed === false, `${context}.selected_repair_route current_human_review_of_002_allowed must be false`);
  assert(selected.treat_002_as_historical_prompt_route_evidence_only === true, `${context}.selected_repair_route historical evidence flag mismatch`);

  assertFalseBoundary(record.boundary, `${context}.boundary`);
  assert(record.recommended_next === "use_v0_3_3_exact_new_trial_003_shot_1_with_immediate_path_collision_recheck_and_post_write_local_persistence_verification", `${context}.recommended_next mismatch`);
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
    expectFailure(validRecord, "target_attempt_drift", (candidate) => { candidate.target_attempt_id = "other"; }),
    expectFailure(validRecord, "prompt_drift", (candidate) => { candidate.prompt_package_ref = "other.yaml"; }),
    expectFailure(validRecord, "provider_route_drift", (candidate) => { candidate.provider_route = "other.route"; }),
    expectFailure(validRecord, "missing_route", (candidate) => { candidate.repair_route_review.pop(); }),
    expectFailure(validRecord, "substitution_true", (candidate) => { candidate.repair_route_review[0].substitutable_for_exact_002 = true; }),
    expectFailure(validRecord, "alt_sha_drift", (candidate) => { candidate.repair_route_review[0].alternative_output_image_sha256 = "deadbeef"; }),
    expectFailure(validRecord, "private_recovery_allowed", (candidate) => { candidate.repair_route_review[1].private_out_of_repo_recovery_allowed_now = true; }),
    expectFailure(validRecord, "fresh_shot_not_selected", (candidate) => { candidate.repair_route_review[2].status = "rejected"; }),
    expectFailure(validRecord, "selected_shot_drift", (candidate) => { candidate.repair_route_review[2].selected_shot_id = "other"; }),
    expectFailure(validRecord, "path_collision_false", (candidate) => { candidate.repair_route_review[2].path_collision_clear_now = false; }),
    expectFailure(validRecord, "local_persistence_not_required", (candidate) => { candidate.repair_route_review[2].local_persistence_verification_required = false; }),
    expectFailure(validRecord, "overwrite_allowed", (candidate) => { candidate.repair_route_review[2].overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "selected_route_wrong", (candidate) => { candidate.selected_repair_route.route_id = "exact_repo_replacement"; }),
    expectFailure(validRecord, "human_review_002_allowed", (candidate) => { candidate.selected_repair_route.current_human_review_of_002_allowed = true; }),
    expectFailure(validRecord, "historical_evidence_flag_false", (candidate) => { candidate.selected_repair_route.treat_002_as_historical_prompt_route_evidence_only = false; }),
    expectFailure(validRecord, "private_recovery_performed", (candidate) => { candidate.boundary.private_out_of_repo_recovery_performed = true; }),
    expectFailure(validRecord, "provider_call_true", (candidate) => { candidate.boundary.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true", (candidate) => { candidate.boundary.image_generation_performed = true; }),
    expectFailure(validRecord, "recommended_next_drift", (candidate) => { candidate.recommended_next = "human_review_002_now"; }),
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
  for (const relativePath of [docPath, schemaPath, reportPath, passFixturePath, failFixturePath, truthReviewPath, stabilityReportPath, altAttemptPath, altReceiptPath, altImagePath]) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  assert(!exists(claimedMissingImagePath), "claimed 002 image must remain absent for this preflight");
  assert(sha256File(altImagePath) === expectedAltSha, "alternative image hash mismatch");

  const truthReview = readJson(truthReviewPath).exact_new_trial_artifact_persistence_truth_review;
  const stability = readJson(stabilityReportPath).exact_new_trial_3shot_stability_preflight;
  const altAttempt = readJson(altAttemptPath);
  const altReceipt = readJson(altReceiptPath);
  const report = readJson(reportPath).exact_new_trial_local_persistence_repair_preflight;
  const passFixture = readJson(passFixturePath).exact_new_trial_local_persistence_repair_preflight;
  const failFixture = readJson(failFixturePath).exact_new_trial_local_persistence_repair_preflight;
  const doc = read(docPath);
  const schema = read(schemaPath);

  assert(truthReview.truth_findings.current_project_output_missing === true, "v0.6.25 truth review must prove missing current project output");
  assert(truthReview.truth_findings.human_review_allowed_now === false, "v0.6.25 truth review must block human review");
  assert(stability.shots[0].shot_id === selectedShotId, "v0.6.24 stability preflight first shot id mismatch");
  assert(stability.shots[0].output_directory === "runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/", "v0.6.24 shot 1 output_directory mismatch");
  assert(altAttempt.attempt_id === "attempt-v0-3-3-safe-portrait-001", "alternative attempt id mismatch");
  assert(altAttempt.output_image_sha256 === expectedAltSha, "alternative attempt sha mismatch");
  assert(altReceipt.output_image_sha256 === expectedAltSha, "alternative receipt sha mismatch");
  assert(altAttempt.prompt_package_ref === expectedPrompt && altReceipt.prompt_package_ref === expectedPrompt, "alternative prompt package mismatch");
  assert(altAttempt.output_image_path === altImagePath && altReceipt.output_image_path === altImagePath, "alternative image path mismatch");

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  assert(doc.includes("# v0.6.26 Exact New-Trial Local Persistence Repair Preflight"), "doc title missing");
  assert(doc.includes("Route C — Use a fresh non-overwriting future shot"), "doc must record selected fresh-shot route");
  assert(doc.includes("Route B — Recover 002 from an out-of-repo private local path"), "doc must record blocked private-path recovery route");
  assert(schema.includes("selected_repair_route: fresh_non_overwriting_future_shot"), "schema missing selected route invariant");
  assert(schema.includes("repo_tracked_same_prompt_alternative_substitutable_for_002: false"), "schema missing substitution invariant");

  const result = {
    phase,
    passed: true,
    target_attempt_id: report.target_attempt_id,
    repo_tracked_same_prompt_alternative_exists: report.repair_route_review[0].repo_tracked_same_prompt_alternative_exists,
    repo_tracked_same_prompt_alternative_substitutable_for_002: report.repair_route_review[0].substitutable_for_exact_002,
    private_out_of_repo_recovery_allowed_now: report.repair_route_review[1].private_out_of_repo_recovery_allowed_now,
    selected_repair_route: report.selected_repair_route.route_id,
    selected_shot_id: report.selected_repair_route.selected_shot_id,
    selected_shot_path_collision_clear_now: report.selected_repair_route.path_collision_clear_now,
    selected_shot_local_persistence_verification_required: report.selected_repair_route.local_persistence_verification_required,
    current_human_review_of_002_allowed: report.selected_repair_route.current_human_review_of_002_allowed,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
