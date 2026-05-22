#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_1_visual_asset_review_pack";
const docPath = "docs/V0_4_1_VISUAL_ASSET_REVIEW_PACK.md";
const packPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const dryRunPath = "tests/schema_examples/visual_asset_eval_dry_run.example.json";
const registryPath = "assets/visual_asset_authorization_registry.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

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

function assertNoSecretOrRawLocalPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Generated image path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretOrRawLocalPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoSecretOrRawLocalPath(item, `${context}.${key}`));
  }
}

function validateScoreFindingDimension(report, dimension) {
  const value = report?.[dimension];
  assert(value && typeof value === "object", `missing review dimension: ${dimension}`);
  assert(Number.isInteger(value.score) && value.score >= 0 && value.score <= 10, `score out of range: ${dimension}`);
  assertNonEmptyString(value.finding, `finding missing: ${dimension}`);
}

function findRegistryEntry(assetRef) {
  const registry = readJson(registryPath);
  assert(assetRef.registry_ref === registryPath, "asset_ref.registry_ref must use the existing registry example");
  const entry = registry.entries.find((item) => item.asset_id === assetRef.asset_id);
  assert(entry, "asset_ref.asset_id must exist in authorization registry");
  return entry;
}

function validateExistingAssetMetadata(pack) {
  const assetRef = pack.asset_ref;
  assert(assetRef && typeof assetRef === "object", "asset_ref missing");
  assert(assetRef.image_binary_read_performed === false, "review pack must not read image binary");
  assert(assetRef.image_binary_included === false, "review pack must not include image binary");
  assert(assetRef.raw_local_path_included === false, "review pack must not include raw local path");
  assert(assetRef.asset_path_redacted === true, "review pack asset path must stay redacted");

  const entry = findRegistryEntry(assetRef);
  assert(assetRef.asset_class === entry.asset_class, "asset_ref.asset_class must match registry entry");
  assert(entry.owner_authorized_upload === true, "asset must be owner-authorized");
  assert(entry.raw_private_source_path_present === false, "registry entry must not include raw private path");
  assert(entry.accepted_sample === false, "registry entry must not already be accepted_sample");
  assert(entry.production_candidate === false, "registry entry must not be production_candidate");
  assert(entry.memory_seed === false, "registry entry must not be memory_seed");
  assert(entry.task_id === assetRef.task_id, "task id must match registry entry");
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

  const dryRun = readJson(dryRunPath).visual_asset_eval_dry_run;
  assert(pack.source_dry_run_ref === dryRunPath, "review pack must cite the v0.4.0 dry-run fixture");
  assert(dryRun.asset_ref.asset_id === assetRef.asset_id, "dry-run asset id must match review pack");
  assert(dryRun.asset_ref.task_id === assetRef.task_id, "dry-run task id must match review pack");
  assert(dryRun.asset_ref.receipt_path === assetRef.receipt_path, "dry-run receipt path must match review pack");
  assert(dryRun.asset_ref.attempt_result_path === assetRef.attempt_result_path, "dry-run attempt path must match review pack");
  assert(dryRun.asset_class === assetRef.asset_class, "dry-run asset_class must match review pack");
  assert(dryRun.asset_ref.image_binary_read_performed === false, "source dry-run must not read image binary");
}

function validateReviewPack(pack) {
  assertNoSecretOrRawLocalPath(pack, "visual_asset_review_pack");
  assert(pack && typeof pack === "object", "review pack missing");
  assert(pack.phase === phase, "phase mismatch");
  assert(pack.review_mode === "dry_run_review_pack", "review_mode must be dry_run_review_pack");
  assert(pack.existing_asset_metadata_only === true, "existing_asset_metadata_only must be true");
  validateExistingAssetMetadata(pack);

  const report = pack.structured_review_report;
  assert(report && typeof report === "object", "structured_review_report missing");
  for (const dimension of scoredDimensions) {
    validateScoreFindingDimension(report, dimension);
  }
  assert(report.memory_suitability?.value === false, "memory_suitability.value must remain false");
  assert(report.memory_suitability.reason === "memory write remains blocked in dry-run review pack", "memory_suitability reason mismatch");

  assert(pack.review_summary && typeof pack.review_summary === "object", "review_summary missing");
  assert(decisionResults.has(pack.review_summary.overall_result), "review_summary.overall_result outside pass/patch/reject");
  assertNonEmptyString(pack.review_summary.why_keep_for_review, "why_keep_for_review missing");
  assertNonEmptyString(pack.review_summary.why_not_accept, "why_not_accept missing");
  assert(pack.review_summary.next_dry_run_action === "define_failure_taxonomy", "next_dry_run_action must point to failure taxonomy");

  const decision = pack.review_pack_decision;
  assert(decision && typeof decision === "object", "review_pack_decision missing");
  assert(decisionResults.has(decision.result), "review_pack_decision.result outside pass/patch/reject");
  assert(decision.accepted_sample_eligible === false, "accepted_sample_eligible must remain false");
  assert(decision.production_candidate_eligible === false, "production_candidate_eligible must remain false");
  assert(decision.memory_seed_eligible === false, "memory_seed_eligible must remain false");
  assert(decision.requires_human_review === true, "requires_human_review must remain true");

  assert(pack.review_pack_boundaries?.existing_assets_only === true, "existing_assets_only must be true");
  assert(pack.review_pack_boundaries?.read_review_metadata_only === true, "read_review_metadata_only must be true");
  assert(pack.review_pack_boundaries?.image_binary_read_performed === false, "image_binary_read_performed must remain false");
  assert(pack.review_pack_boundaries?.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  assert(pack.review_pack_boundaries?.real_executor_implemented_now === false, "real executor must remain unimplemented");

  for (const flag of falseSideEffectFlags) {
    assert(pack.side_effects?.[flag] === false, `side-effect flag must remain false: ${flag}`);
  }
}

function expectFailure(basePack, caseId, mutate) {
  const candidate = clone(basePack);
  mutate(candidate);
  try {
    validateReviewPack(candidate);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      failure_message: error.message
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validPack) {
  const cases = [
    expectFailure(validPack, "missing_review_pack_fails", (candidate) => {
      delete candidate.phase;
    }),
    expectFailure(validPack, "missing_asset_ref_fails", (candidate) => {
      delete candidate.asset_ref;
    }),
    expectFailure(validPack, "registry_asset_class_mismatch_fails", (candidate) => {
      candidate.asset_ref.asset_class = "runs_artifact";
    }),
    expectFailure(validPack, "dry_run_binding_mismatch_fails", (candidate) => {
      candidate.asset_ref.receipt_path = "reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json";
    }),
    expectFailure(validPack, "missing_structured_review_report_fails", (candidate) => {
      delete candidate.structured_review_report;
    }),
    expectFailure(validPack, "missing_commercial_fitness_fails", (candidate) => {
      delete candidate.structured_review_report.commercial_fitness;
    }),
    expectFailure(validPack, "memory_suitability_true_fails", (candidate) => {
      candidate.structured_review_report.memory_suitability.value = true;
    }),
    expectFailure(validPack, "accepted_sample_eligible_true_fails", (candidate) => {
      candidate.review_pack_decision.accepted_sample_eligible = true;
    }),
    expectFailure(validPack, "production_candidate_eligible_true_fails", (candidate) => {
      candidate.review_pack_decision.production_candidate_eligible = true;
    }),
    expectFailure(validPack, "memory_seed_eligible_true_fails", (candidate) => {
      candidate.review_pack_decision.memory_seed_eligible = true;
    }),
    expectFailure(validPack, "image_binary_read_true_fails", (candidate) => {
      candidate.asset_ref.image_binary_read_performed = true;
    }),
    expectFailure(validPack, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validPack, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
    }),
    expectFailure(validPack, "vcp_memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validPack, "raw_local_drive_path_fails", (candidate) => {
      candidate.review_summary.why_keep_for_review = "C:\\private\\image.png";
    }),
    expectFailure(validPack, "secret_env_path_fails", (candidate) => {
      candidate.review_summary.why_not_accept = ".env.local";
    })
  ];

  return {
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    registry_asset_class_mismatch_caught: cases.some((item) => {
      return item.case_id === "registry_asset_class_mismatch_fails" && item.result === "caught";
    }),
    image_binary_read_negative_case_caught: cases.some((item) => {
      return item.case_id === "image_binary_read_true_fails" && item.result === "caught";
    })
  };
}

function validateTextSurfaces() {
  const doc = read(docPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  for (const token of [
    phase,
    "structured review report",
    "existing asset metadata",
    "image_binary_read_performed: false",
    "accepted_sample_eligible: false",
    "production_candidate_eligible: false",
    "memory_seed_eligible: false",
    "Push_L2_exercised: false",
    "real_executor_implemented_now: false",
    "define_failure_taxonomy"
  ]) {
    assert(doc.includes(token), `review pack doc missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_visual_asset_review_pack.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_1_visual_asset_review_pack_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const pack = readJson(packPath).visual_asset_review_pack;
  validateReviewPack(pack);
  const negativeCaseSummary = validateNegativeCases(pack);

  const output = {
    passed: true,
    validator: "validate_visual_asset_review_pack",
    phase,
    review_pack_doc_present: fs.existsSync(repoPath(docPath)),
    review_pack_json_present: fs.existsSync(repoPath(packPath)),
    structured_review_report_present: Boolean(pack.structured_review_report),
    existing_asset_metadata_only: pack.existing_asset_metadata_only === true,
    dry_run_binding_verified: true,
    image_binary_read_performed: false,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    registry_asset_class_mismatch_caught: negativeCaseSummary.registry_asset_class_mismatch_caught,
    image_binary_read_negative_case_caught: negativeCaseSummary.image_binary_read_negative_case_caught,
    memory_suitability_false_by_default: pack.structured_review_report.memory_suitability.value === false,
    accepted_sample_eligible: false,
    production_candidate_eligible: false,
    memory_seed_eligible: false,
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
  validateReviewPack,
  validateNegativeCases
};
