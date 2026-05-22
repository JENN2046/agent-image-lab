#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_0_visual_asset_eval_dry_run";
const docPath = "docs/V0_4_0_VISUAL_ASSET_EVAL_DRY_RUN.md";
const evalDocPath = "docs/VISUAL_ASSET_EVAL_V0_1.md";
const passFixturePath = "tests/schema_examples/visual_asset_eval_dry_run.example.json";
const failFixturePath = "tests/schema_examples/visual_asset_eval_dry_run_fail.example.json";
const registryPath = "assets/visual_asset_authorization_registry.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const allowedAssetClasses = new Set(["test_asset", "user_authorized_test_image", "runs_artifact"]);
const decisionResults = new Set(["pass", "patch", "reject"]);
const scoredDimensions = [
  "composition",
  "lighting",
  "material_realism",
  "product_fidelity",
  "commercial_fitness",
  "ai_artifact_risk"
];
const falseSideEffectFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "VCP_memory_write_performed",
  "DailyNote_write_performed",
  "runtime_call_performed",
  "secret_value_read_performed",
  "production_candidate_created",
  "accepted_sample_promoted",
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

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

function assertNoSecretOrGeneratedPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Generated image path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretOrGeneratedPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoSecretOrGeneratedPath(item, `${context}.${key}`));
  }
}

function validateScoreFindingDimension(report, dimension) {
  const value = report.review_report?.[dimension];
  assert(value && typeof value === "object", `missing review dimension: ${dimension}`);
  assert(Number.isInteger(value.score) && value.score >= 0 && value.score <= 10, `score out of range: ${dimension}`);
  assertNonEmptyString(value.finding, `finding missing: ${dimension}`);
}

function validateExistingAssetRefs(record) {
  const registry = readJson(registryPath);
  const assetRef = record.asset_ref;
  assert(assetRef.registry_ref === registryPath, "asset_ref.registry_ref must use the existing registry example");
  assert(assetRef.image_binary_read_performed === false, "dry-run must not read image binary");
  assert(assetRef.image_binary_included === false, "dry-run must not include image binary");
  assert(assetRef.raw_local_path_included === false, "dry-run must not include raw local path");
  assert(assetRef.asset_path_redacted === true, "dry-run asset path must stay redacted");

  const entry = registry.entries.find((item) => item.asset_id === assetRef.asset_id);
  assert(entry, "asset_ref.asset_id must exist in authorization registry");
  assert(record.asset_class === entry.asset_class, "asset_class must match registry entry");
  assert(entry.owner_authorized_upload === true, "asset must be owner-authorized");
  assert(entry.raw_private_source_path_present === false, "registry entry must not include raw private path");
  assert(entry.accepted_sample === false, "registry entry must not already be accepted_sample");
  assert(entry.production_candidate === false, "registry entry must not be production_candidate");
  assert(entry.memory_seed === false, "registry entry must not be memory_seed");
  assert(entry.receipt_path === assetRef.receipt_path, "receipt path must match registry entry");
  assert(entry.attempt_result_path === assetRef.attempt_result_path, "attempt result path must match registry entry");

  const receipt = readJson(assetRef.receipt_path);
  const attempt = readJson(assetRef.attempt_result_path);
  assert(receipt.receipt_id && receipt.task_id === entry.task_id, "receipt must match registry task");
  assert(receipt.output_image_sha256 === entry.output_image_sha256, "receipt hash must match registry metadata");
  assert(receipt.secret_value_read_performed === false, "receipt must not include secret read");
  assert(receipt.DailyNote_write_performed === false, "receipt must not include DailyNote write");
  assert(receipt.VCP_memory_write_performed === false, "receipt must not include VCP memory write");
  assert(attempt.attempt_id && attempt.task_id === entry.task_id, "attempt result must match registry task");
  assert(attempt.receipt_path === assetRef.receipt_path, "attempt result must point to the same receipt");
  assert(attempt.secret_value_read_performed === false, "attempt result must not include secret read");
}

function validateDryRun(record) {
  assertNoSecretOrGeneratedPath(record, "visual_asset_eval_dry_run");
  assert(record && typeof record === "object", "dry-run record missing");
  assert(record.phase === phase, "phase mismatch");
  assert(record.asset_ref && typeof record.asset_ref === "object", "asset_ref missing");
  assert(allowedAssetClasses.has(record.asset_class), "asset_class outside allowed values");
  assert(record.review_mode === "dry_run", "review_mode must be dry_run");
  validateExistingAssetRefs(record);

  assert(record.review_report && typeof record.review_report === "object", "review_report missing");
  for (const dimension of scoredDimensions) {
    validateScoreFindingDimension(record, dimension);
  }
  const memorySuitability = record.review_report.memory_suitability;
  assert(memorySuitability && typeof memorySuitability === "object", "missing memory_suitability");
  assert(memorySuitability.value === false, "memory_suitability.value must remain false");
  assert(memorySuitability.reason === "memory write remains blocked in dry-run", "memory_suitability reason mismatch");

  assert(record.decision && typeof record.decision === "object", "decision missing");
  assert(decisionResults.has(record.decision.result), "decision.result outside pass/patch/reject");
  assert(record.decision.accepted_sample_eligible === false, "accepted_sample_eligible must remain false");
  assert(record.decision.production_candidate_eligible === false, "production_candidate_eligible must remain false");
  assert(record.decision.memory_seed_eligible === false, "memory_seed_eligible must remain false");

  assert(record.dry_run_boundaries?.existing_assets_only === true, "existing_assets_only must be true");
  assert(record.dry_run_boundaries?.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  assert(record.dry_run_boundaries?.real_executor_implemented_now === false, "real executor must remain unimplemented");
  assert(record.dry_run_boundaries?.no_v0_4_1_started === true, "v0.4.1 must not be started");

  for (const flag of falseSideEffectFlags) {
    assert(record.side_effects?.[flag] === false, `side-effect flag must remain false: ${flag}`);
  }
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateDryRun(candidate);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      failure_message: error.message
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let fixtureFailureCaught = false;
  try {
    validateDryRun(invalidRecord);
  } catch {
    fixtureFailureCaught = true;
  }
  assert(fixtureFailureCaught, "invalid dry-run fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_asset_ref_fails", (candidate) => {
      delete candidate.asset_ref;
    }),
    expectFailure(validRecord, "missing_review_report_fails", (candidate) => {
      delete candidate.review_report;
    }),
    expectFailure(validRecord, "accepted_sample_eligible_true_fails", (candidate) => {
      candidate.decision.accepted_sample_eligible = true;
    }),
    expectFailure(validRecord, "production_candidate_eligible_true_fails", (candidate) => {
      candidate.decision.production_candidate_eligible = true;
    }),
    expectFailure(validRecord, "memory_seed_eligible_true_fails", (candidate) => {
      candidate.decision.memory_seed_eligible = true;
    }),
    expectFailure(validRecord, "vcp_memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "asset_class_outside_allowed_values_fails", (candidate) => {
      candidate.asset_class = "accepted_sample";
    }),
    expectFailure(validRecord, "registry_asset_class_mismatch_fails", (candidate) => {
      candidate.asset_class = candidate.asset_class === "runs_artifact" ? "user_authorized_test_image" : "runs_artifact";
    }),
    expectFailure(validRecord, "decision_result_outside_allowed_values_fails", (candidate) => {
      candidate.decision.result = "approve";
    }),
    expectFailure(validRecord, "missing_commercial_fitness_fails", (candidate) => {
      delete candidate.review_report.commercial_fitness;
    }),
    expectFailure(validRecord, "missing_ai_artifact_risk_fails", (candidate) => {
      delete candidate.review_report.ai_artifact_risk;
    }),
    expectFailure(validRecord, "missing_memory_suitability_fails", (candidate) => {
      delete candidate.review_report.memory_suitability;
    })
  ];

  return {
    invalid_fixture_failure_caught: fixtureFailureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    registry_asset_class_mismatch_caught: cases.some((item) => {
      return item.case_id === "registry_asset_class_mismatch_fails" && item.result === "caught";
    })
  };
}

function validateTextSurfaces() {
  const doc = read(docPath);
  const evalDoc = read(evalDocPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const combined = `${doc}\n${evalDoc}`;
  for (const token of [
    phase,
    "existing authorized test assets",
    "provider receipts",
    "generation attempt result",
    "memory write remains blocked in dry-run",
    "accepted_sample_eligible: false",
    "production_candidate_eligible: false",
    "memory_seed_eligible: false",
    "Push_L2_exercised: false",
    "real_executor_implemented_now: false"
  ]) {
    assert(combined.includes(token), `dry-run docs missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_visual_asset_eval_dry_run.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_0_visual_asset_eval_dry_run_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const validRecord = readJson(passFixturePath).visual_asset_eval_dry_run;
  const invalidRecord = readJson(failFixturePath).visual_asset_eval_dry_run;
  validateDryRun(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_asset_eval_dry_run",
    phase,
    dry_run_doc_present: fs.existsSync(repoPath(docPath)),
    dry_run_fixture_pass_present: fs.existsSync(repoPath(passFixturePath)),
    dry_run_fixture_fail_present: fs.existsSync(repoPath(failFixturePath)),
    existing_assets_only: true,
    valid_dry_run_fixture_passes: true,
    invalid_dry_run_fixture_fails: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    registry_asset_class_mismatch_caught: negativeCaseSummary.registry_asset_class_mismatch_caught,
    memory_suitability_false_by_default: validRecord.review_report.memory_suitability.value === false,
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
    package_dependency_change_performed: false,
    no_v0_4_1_started: true,
    commit_performed: false,
    push_performed: false
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  validateDryRun,
  validateNegativeCases
};
