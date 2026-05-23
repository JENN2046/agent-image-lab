#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_13_failed_provider_attempt_review";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const docPath = "docs/V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW.md";
const schemaPath = "schemas/exact_new_trial_failed_provider_attempt_review.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_13_failed_provider_attempt_review.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_failed_provider_attempt_review.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_failed_provider_attempt_review_fail.example.json";
const localPreflightPath = "reports/visual_asset_eval_dry_run/v0_6_12_local_preflight_only_gate.json";
const failedInspectionPath = "reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json";
const firstReceiptPath = "reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json";
const firstAttemptPath = "runs/real_generation/v0_3_3_codex_sample_first_trial/generation_attempt_result.json";
const retryReceiptPath = "reports/provider_receipts/v0_3_3_retry_001_receipt.json";
const retryAttemptPath = "runs/real_generation/v0_3_3_retry_001_codex_sample/generation_attempt_result.json";
const smokeReceiptPath = "reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json";
const safePortraitReceiptPath = "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const nextPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const nextOutput = "runs/real_generation/v0_3_3_exact_new_trial_001/";
const nextReceipt = "reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json";
const nextRegistry = "reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json";
const nextBridge = "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001";

const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "output_directory_created",
  "receipt_write_performed",
  "registry_write_performed",
  "review_console_bridge_materialized",
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

function assertFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function loadSources() {
  const localPreflight = readJson(localPreflightPath).exact_new_trial_local_preflight_only_gate;
  const failedInspection = readJson(failedInspectionPath).failed_provider_attempt_inspection;
  const firstReceipt = readJson(firstReceiptPath);
  const firstAttempt = readJson(firstAttemptPath);
  const retryReceipt = readJson(retryReceiptPath);
  const retryAttempt = readJson(retryAttemptPath);
  const smokeReceipt = readJson(smokeReceiptPath);
  const safePortraitReceipt = readJson(safePortraitReceiptPath);

  assert(localPreflight.phase === "v0_6_12_local_preflight_only_gate", "local preflight source phase mismatch");
  assert(localPreflight.local_preflight_status?.source_preflight_authorization_consumed === true, "v0.6.12 must consume preflight authorization");
  assert(failedInspection.phase === "v0_6_3_failed_provider_attempt_inspection", "failed inspection source phase mismatch");
  assert(firstReceipt.status === "failed_no_image_generated", "first receipt status mismatch");
  assert(firstAttempt.attempt_status === "failed_no_image_generated", "first attempt status mismatch");
  assert(retryReceipt.status === "failed_no_image_generated", "retry receipt status mismatch");
  assert(retryAttempt.attempt_status === "failed_no_image_generated", "retry attempt status mismatch");
  assert(smokeReceipt.status === "succeeded_image_generated", "smoke receipt status mismatch");
  assert(safePortraitReceipt.status === "succeeded_image_generated", "safe portrait receipt status mismatch");

  return {
    localPreflight,
    failedInspection,
    failedAttempts: [
      { receipt: firstReceipt, attempt: firstAttempt, receiptPath: firstReceiptPath, attemptPath: firstAttemptPath },
      { receipt: retryReceipt, attempt: retryAttempt, receiptPath: retryReceiptPath, attemptPath: retryAttemptPath }
    ],
    smokeReceipt,
    safePortraitReceipt
  };
}

function validateReviewedAttempt(item, source) {
  assert(item.receipt_ref === source.receiptPath, "reviewed attempt receipt_ref mismatch");
  assert(item.attempt_result_ref === source.attemptPath, "reviewed attempt attempt_result_ref mismatch");
  assert(item.prompt_package_ref === source.receipt.prompt_package_ref, "reviewed attempt prompt_package_ref mismatch");
  assert(item.status === "failed_no_image_generated", "reviewed attempt status must be failed_no_image_generated");
  assert(item.status === source.receipt.status && item.status === source.attempt.attempt_status, "reviewed attempt status must match sources");
  assert(item.failure_class === "provider_tool_user_error", "reviewed attempt failure class mismatch");
  assert(item.failure_class === source.receipt.failure?.class && item.failure_class === source.attempt.failure_class, "failure class must match receipt and attempt");
  assert(item.stop_reason === "provider_tool_user_error_no_retry_budget", "reviewed attempt stop reason mismatch");
  assert(item.stop_reason === source.receipt.stop_reason && item.stop_reason === source.attempt.stop_reason, "stop reason must match receipt and attempt");
  assert(item.provider_calls_used === 1 && item.provider_calls_used === source.receipt.calls_used.provider_calls, "provider calls mismatch");
  assert(item.plugin_calls_used === 1 && item.plugin_calls_used === source.receipt.calls_used.plugin_calls, "plugin calls mismatch");
  assert(item.image_candidates_requested === 1 && item.image_candidates_requested === source.receipt.calls_used.image_candidates_requested, "image candidates requested mismatch");
  assert(item.image_candidates_generated === 0 && item.image_candidates_generated === source.receipt.calls_used.image_candidates_generated && item.image_candidates_generated === source.attempt.image_candidates_generated, "image candidates generated mismatch");
  assert(item.retries_used === 0 && item.retries_used === source.receipt.calls_used.retries_used, "retries used mismatch");
  assert(item.retry_limit === 0 && item.retry_limit === source.receipt.budgets.retry_limit, "retry limit mismatch");
  assert(item.output_image_path === null && source.receipt.output_image_path === null && source.attempt.output_image_path === null, "failed attempt must not have output image");
  assert(item.reusable_for_new_trial === false, "failed attempt must not be reusable for new trial");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "failed provider attempt review missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_failed_provider_attempt_review");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_local_preflight_ref === localPreflightPath, "source_local_preflight_ref mismatch");
  assert(record.source_failed_attempt_inspection_ref === failedInspectionPath, "source_failed_attempt_inspection_ref mismatch");

  const sources = loadSources();
  assert(Array.isArray(record.reviewed_attempts) && record.reviewed_attempts.length === 2, "exactly two failed attempts must be reviewed");
  record.reviewed_attempts.forEach((item, index) => validateReviewedAttempt(item, sources.failedAttempts[index]));

  const diagnostic = record.diagnostic_context;
  assert(diagnostic.neutral_smoke_test_receipt_ref === smokeReceiptPath, "neutral smoke receipt ref mismatch");
  assert(diagnostic.safe_adult_editorial_portrait_receipt_ref === safePortraitReceiptPath, "safe portrait receipt ref mismatch");
  assert(diagnostic.neutral_smoke_test_succeeded === true, "neutral smoke test must be marked succeeded");
  assert(diagnostic.safe_adult_editorial_portrait_succeeded === true, "safe portrait test must be marked succeeded");
  assert(diagnostic.route_not_globally_unavailable === true, "route_not_globally_unavailable must be true");
  assert(diagnostic.safe_portrait_prompt_package_available === true && fs.existsSync(repoPath(nextPrompt)), "safe portrait prompt must be available");
  assert(sources.smokeReceipt.output_image_path && sources.safePortraitReceipt.output_image_path, "diagnostic success receipts must bind output images");

  const findings = record.review_findings;
  assert(findings.failed_attempt_count === 2, "failed_attempt_count must be 2");
  assert(findings.all_failed_attempts_produced_no_image === true, "all failed attempts must produce no image");
  assert(findings.all_failed_attempts_used_one_provider_call === true, "failed attempts must use one provider call each");
  assert(findings.all_failed_attempts_used_zero_retry === true, "failed attempts must use zero retry");
  assert(findings.retry_blocked_by_zero_retry_limit === true, "retry must be blocked by zero retry limit");
  assert(findings.failure_type === "provider_tool_user_error_no_image", "failure_type mismatch");
  assert(findings.failure_scope === "prompt_or_content_path_specific_not_global_route_outage", "failure_scope mismatch");
  assert(findings.cannot_reuse_failed_prompt_path_by_default === true, "failed prompt path must not be reused by default");
  assert(findings.cannot_reuse_failed_output_receipt_registry_bridge_paths === true, "failed paths must not be reused");
  assert(findings.failed_attempts_are_not_review_assets === true, "failed attempts must not be review assets");
  assert(findings.failed_attempts_are_not_accepted_samples === true, "failed attempts must not be accepted samples");
  assert(findings.failed_attempts_must_not_seed_memory === true, "failed attempts must not seed memory");

  const nonReusable = record.non_reusable_paths;
  for (const source of sources.failedAttempts) {
    assert(nonReusable.prompt_package_refs.includes(source.receipt.prompt_package_ref), "failed prompt package missing from non-reusable list");
    assert(nonReusable.output_directories.includes(source.receipt.output_directory), "failed output directory missing from non-reusable list");
    assert(nonReusable.receipt_paths.includes(source.receiptPath), "failed receipt missing from non-reusable list");
    assert(nonReusable.review_console_bridge_refs.includes(source.receipt.review_console_bridge_ref), "failed bridge missing from non-reusable list");
  }
  assert(!nonReusable.output_directories.includes(nextOutput), "next output directory must not be in failed non-reusable list");
  assert(!nonReusable.receipt_paths.includes(nextReceipt), "next receipt must not be in failed non-reusable list");
  assert(!nonReusable.registry_paths.includes(nextRegistry), "next registry must not be in failed non-reusable list");
  assert(!nonReusable.review_console_bridge_refs.includes(nextBridge), "next bridge must not be in failed non-reusable list");

  const required = record.next_trial_required_conditions;
  assert(required.prompt_package_ref === sources.localPreflight.checked_exact_targets.prompt_package_ref, "next prompt must match local preflight");
  assert(required.output_directory === sources.localPreflight.checked_exact_targets.output_directory, "next output must match local preflight");
  assert(required.receipt_path === sources.localPreflight.checked_exact_targets.receipt_path, "next receipt must match local preflight");
  assert(required.registry_path === sources.localPreflight.checked_exact_targets.registry_path, "next registry must match local preflight");
  assert(required.review_console_bridge_ref === sources.localPreflight.checked_exact_targets.review_console_bridge_ref, "next bridge must match local preflight");
  assert(required.prompt_package_ref === nextPrompt, "next prompt mismatch");
  assert(required.output_directory === nextOutput, "next output mismatch");
  assert(required.receipt_path === nextReceipt, "next receipt mismatch");
  assert(required.registry_path === nextRegistry, "next registry mismatch");
  assert(required.review_console_bridge_ref === nextBridge, "next bridge mismatch");
  assert(required.exact_call_count === 1, "exact_call_count must remain 1");
  assert(required.max_image_candidates === 1, "max_image_candidates must remain 1");
  assert(required.retry_limit === 0, "retry_limit must remain 0");
  assert(required.overwrite_existing_files_allowed === false, "overwrite must remain false");
  assert(required.secret_value_read_allowed === false, "secret read must remain false");
  assert(required.review_required_after_generation === true, "review must be required");
  assert(required.no_memory_write_default === true, "no-memory default must remain true");
  assert(required.future_provider_execution_requires_new_explicit_step === true, "future provider execution must require new explicit step");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.review_only === true, "review_only must be true");
  assert(record.boundaries?.no_new_trial_executed === true, "no_new_trial_executed must be true");
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
  assert(invalidFixtureCaught, "invalid failed-provider-attempt review fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_attempt_fails", (candidate) => { candidate.reviewed_attempts = candidate.reviewed_attempts.slice(0, 1); }),
    expectFailure(validRecord, "failed_status_success_fails", (candidate) => { candidate.reviewed_attempts[0].status = "succeeded_image_generated"; }),
    expectFailure(validRecord, "failure_class_drift_fails", (candidate) => { candidate.reviewed_attempts[0].failure_class = "quota_or_rate_limit"; }),
    expectFailure(validRecord, "stop_reason_drift_fails", (candidate) => { candidate.reviewed_attempts[0].stop_reason = "retry_allowed"; }),
    expectFailure(validRecord, "provider_call_widened_fails", (candidate) => { candidate.reviewed_attempts[0].provider_calls_used = 2; }),
    expectFailure(validRecord, "image_generated_fails", (candidate) => { candidate.reviewed_attempts[0].image_candidates_generated = 1; }),
    expectFailure(validRecord, "retry_used_fails", (candidate) => { candidate.reviewed_attempts[0].retries_used = 1; }),
    expectFailure(validRecord, "retry_limit_widened_fails", (candidate) => { candidate.reviewed_attempts[0].retry_limit = 1; }),
    expectFailure(validRecord, "output_image_path_fails", (candidate) => { candidate.reviewed_attempts[0].output_image_path = "runs/real_generation/fake.png"; }),
    expectFailure(validRecord, "reusable_failed_attempt_fails", (candidate) => { candidate.reviewed_attempts[0].reusable_for_new_trial = true; }),
    expectFailure(validRecord, "neutral_smoke_false_fails", (candidate) => { candidate.diagnostic_context.neutral_smoke_test_succeeded = false; }),
    expectFailure(validRecord, "safe_portrait_false_fails", (candidate) => { candidate.diagnostic_context.safe_adult_editorial_portrait_succeeded = false; }),
    expectFailure(validRecord, "global_outage_claim_fails", (candidate) => { candidate.diagnostic_context.route_not_globally_unavailable = false; }),
    expectFailure(validRecord, "failed_count_drift_fails", (candidate) => { candidate.review_findings.failed_attempt_count = 1; }),
    expectFailure(validRecord, "reuse_failed_prompt_allowed_fails", (candidate) => { candidate.review_findings.cannot_reuse_failed_prompt_path_by_default = false; }),
    expectFailure(validRecord, "failed_review_asset_fails", (candidate) => { candidate.review_findings.failed_attempts_are_not_review_assets = false; }),
    expectFailure(validRecord, "failed_accepted_sample_fails", (candidate) => { candidate.review_findings.failed_attempts_are_not_accepted_samples = false; }),
    expectFailure(validRecord, "failed_memory_seed_fails", (candidate) => { candidate.review_findings.failed_attempts_must_not_seed_memory = false; }),
    expectFailure(validRecord, "next_output_reuses_failed_fails", (candidate) => { candidate.next_trial_required_conditions.output_directory = "runs/real_generation/v0_3_3_codex_sample_first_trial/"; }),
    expectFailure(validRecord, "next_receipt_reuses_failed_fails", (candidate) => { candidate.next_trial_required_conditions.receipt_path = firstReceiptPath; }),
    expectFailure(validRecord, "next_registry_reuses_failed_fails", (candidate) => { candidate.next_trial_required_conditions.registry_path = "reports/provider_receipts/provider_receipt_registry.json"; }),
    expectFailure(validRecord, "next_bridge_reuses_failed_fails", (candidate) => { candidate.next_trial_required_conditions.review_console_bridge_ref = "review_console/live_receipt_bridge/v0_3_3_retry_001"; }),
    expectFailure(validRecord, "next_call_count_widened_fails", (candidate) => { candidate.next_trial_required_conditions.exact_call_count = 2; }),
    expectFailure(validRecord, "overwrite_allowed_fails", (candidate) => { candidate.next_trial_required_conditions.overwrite_existing_files_allowed = true; }),
    expectFailure(validRecord, "secret_read_allowed_fails", (candidate) => { candidate.next_trial_required_conditions.secret_value_read_allowed = true; }),
    expectFailure(validRecord, "future_step_false_fails", (candidate) => { candidate.next_trial_required_conditions.future_provider_execution_requires_new_explicit_step = false; }),
    expectFailure(validRecord, "provider_call_performed_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_performed_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.authorization_package_id = ".env.local"; })
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
  const reportRecord = readJson(reportPath).exact_new_trial_failed_provider_attempt_review;
  const validRecord = readJson(passFixturePath).exact_new_trial_failed_provider_attempt_review;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_failed_provider_attempt_review;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    "phase: v0_6_13_failed_provider_attempt_review",
    "first_attempt_failed_no_image: true",
    "retry_001_failed_no_image: true",
    "route_not_globally_unavailable: true",
    "future_provider_execution_requires_new_explicit_step: true",
    nextPrompt,
    nextOutput,
    nextReceipt,
    nextRegistry,
    nextBridge
  ]) {
    assert(doc.includes(token), `failed provider attempt review doc missing token: ${token}`);
  }

  assert(schema.includes("exact_new_trial_failed_provider_attempt_review"), "schema must define exact_new_trial_failed_provider_attempt_review");
  assert(mvp.includes("validate_exact_new_trial_failed_provider_attempt_review.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_13_FAILED_PROVIDER_ATTEMPT_REVIEW_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_failed_provider_attempt_review",
    phase,
    review_doc_present: true,
    review_schema_present: true,
    review_report_present: true,
    review_fixture_present: true,
    review_fail_fixture_present: true,
    authorization_package_id: packageId,
    source_local_preflight_verified: true,
    source_failed_attempt_inspection_verified: true,
    failed_attempt_count: 2,
    first_attempt_failed_no_image: true,
    retry_001_failed_no_image: true,
    failure_type: "provider_tool_user_error_no_image",
    retry_blocked_by_zero_retry_limit: true,
    neutral_smoke_test_succeeded: true,
    safe_adult_editorial_portrait_succeeded: true,
    route_not_globally_unavailable: true,
    cannot_reuse_failed_prompt_path_by_default: true,
    cannot_reuse_failed_output_receipt_registry_bridge_paths: true,
    failed_attempts_are_not_review_assets: true,
    failed_attempts_are_not_accepted_samples: true,
    failed_attempts_must_not_seed_memory: true,
    next_prompt_package_ref: nextPrompt,
    next_output_directory: nextOutput,
    next_receipt_path: nextReceipt,
    next_registry_path: nextRegistry,
    next_review_console_bridge_ref: nextBridge,
    exact_call_count: 1,
    max_image_candidates: 1,
    retry_limit: 0,
    overwrite_existing_files_allowed: false,
    secret_value_read_allowed: false,
    future_provider_execution_requires_new_explicit_step: true,
    metadata_only: true,
    review_only: true,
    no_new_trial_executed: true,
    provider_call_performed: false,
    image_generation_performed: false,
    output_directory_created: false,
    receipt_write_performed: false,
    registry_write_performed: false,
    review_console_bridge_materialized: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    production_candidate_created: false,
    accepted_sample_auto_promotion: false,
    memory_seed_promoted: false,
    real_executor_implemented_now: false,
    Push_L2_exercised: false,
    package_dependency_change_performed: false,
    commit_performed: false,
    push_performed: false,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
