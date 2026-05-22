#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_9_visual_evidence_consistency_hardening";
const docPath = "docs/V0_4_9_VISUAL_EVIDENCE_CONSISTENCY_HARDENING.md";
const schemaPath = "schemas/visual_evidence_consistency_hardening.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_4_9_evidence_consistency_hardening.json";
const passFixturePath = "tests/schema_examples/visual_evidence_consistency_hardening.example.json";
const failFixturePath = "tests/schema_examples/visual_evidence_consistency_hardening_fail.example.json";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const dryRunPath = "tests/schema_examples/visual_asset_eval_dry_run.example.json";
const registryPath = "assets/visual_asset_authorization_registry.example.json";
const receiptPath = "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json";
const attemptResultPath = "runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const consistencyRules = [
  "asset_id_consistent",
  "receipt_path_consistent",
  "attempt_result_path_consistent",
  "output_image_sha256_consistent",
  "no_raw_local_path",
  "no_image_binary_read"
];
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

function assertSha256(value, message) {
  assert(typeof value === "string" && /^[a-f0-9]{64}$/.test(value), message);
}

function assertNoSecretOrRawPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    assert(!value.includes("/.codex/generated_images/"), `Generated image path found in ${context}`);
    assert(!value.includes("\\.codex\\generated_images\\"), `Generated image path found in ${context}`);
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

function sourceEvidence() {
  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  const dryRun = readJson(dryRunPath).visual_asset_eval_dry_run;
  const registry = readJson(registryPath);
  const receipt = readJson(receiptPath);
  const attempt = readJson(attemptResultPath);
  const registryEntry = registry.entries.find((entry) => entry.asset_id === reviewPack.asset_ref.asset_id);
  assert(registryEntry, "review pack asset_id must exist in registry");
  return { reviewPack, dryRun, registry, registryEntry, receipt, attempt };
}

function validateSourceMetadataNoRawPaths(sources) {
  assertNoSecretOrRawPath({
    reviewPack: sources.reviewPack,
    dryRun: sources.dryRun,
    registryEntry: {
      asset_id: sources.registryEntry.asset_id,
      task_id: sources.registryEntry.task_id,
      receipt_path: sources.registryEntry.receipt_path,
      attempt_result_path: sources.registryEntry.attempt_result_path,
      output_image_sha256: sources.registryEntry.output_image_sha256,
      raw_private_source_path_present: sources.registryEntry.raw_private_source_path_present,
      source_image_path_redacted: sources.registryEntry.source_image_path_redacted
    },
    receipt: {
      receipt_id: sources.receipt.receipt_id,
      task_id: sources.receipt.task_id,
      attempt_result_path: sources.receipt.attempt_result_path,
      output_image_sha256: sources.receipt.output_image_sha256,
      source_image_path_redacted: sources.receipt.source_image_path_redacted
    },
    attempt: {
      attempt_id: sources.attempt.attempt_id,
      task_id: sources.attempt.task_id,
      receipt_path: sources.attempt.receipt_path,
      output_image_sha256: sources.attempt.output_image_sha256
    }
  }, "visual_evidence_consistency_sources");
}

function validateSourceConsistency(sources) {
  const { reviewPack, dryRun, registryEntry, receipt, attempt } = sources;
  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "review pack phase mismatch");
  assert(dryRun.phase === "v0_4_0_visual_asset_eval_dry_run", "dry-run phase mismatch");
  assert(reviewPack.asset_ref.registry_ref === registryPath, "review pack registry ref mismatch");
  assert(dryRun.asset_ref.registry_ref === registryPath, "dry-run registry ref mismatch");
  assert(reviewPack.asset_ref.asset_id === dryRun.asset_ref.asset_id, "review pack and dry-run asset_id mismatch");
  assert(reviewPack.asset_ref.asset_id === registryEntry.asset_id, "registry asset_id mismatch");
  assert(reviewPack.asset_ref.task_id === dryRun.asset_ref.task_id, "review pack and dry-run task_id mismatch");
  assert(reviewPack.asset_ref.task_id === registryEntry.task_id, "registry task_id mismatch");
  assert(receipt.task_id === registryEntry.task_id, "receipt task_id mismatch");
  assert(attempt.task_id === registryEntry.task_id, "attempt task_id mismatch");

  for (const item of [reviewPack.asset_ref, dryRun.asset_ref, registryEntry]) {
    assert(item.receipt_path === receiptPath, "receipt_path mismatch across sources");
    assert(item.attempt_result_path === attemptResultPath, "attempt_result_path mismatch across sources");
  }
  assert(receipt.attempt_result_path === attemptResultPath, "receipt attempt_result_path mismatch");
  assert(attempt.receipt_path === receiptPath, "attempt receipt_path mismatch");

  assertSha256(registryEntry.output_image_sha256, "registry output_image_sha256 invalid");
  assert(receipt.output_image_sha256 === registryEntry.output_image_sha256, "receipt hash must match registry");
  assert(attempt.output_image_sha256 === registryEntry.output_image_sha256, "attempt hash must match registry");

  assert(reviewPack.asset_ref.image_binary_read_performed === false, "review pack must not read image binary");
  assert(reviewPack.asset_ref.image_binary_included === false, "review pack must not include image binary");
  assert(reviewPack.asset_ref.raw_local_path_included === false, "review pack must not include raw local path");
  assert(reviewPack.review_pack_boundaries.image_binary_read_performed === false, "review pack boundary must not read image binary");
  assert(dryRun.asset_ref.image_binary_read_performed === false, "dry-run must not read image binary");
  assert(dryRun.asset_ref.image_binary_included === false, "dry-run must not include image binary");
  assert(dryRun.asset_ref.raw_local_path_included === false, "dry-run must not include raw local path");
  assert(registryEntry.raw_private_source_path_present === false, "registry must not include raw private source path");
  assert(registryEntry.source_image_path_redacted === true, "registry source image path must be redacted");
  assert(receipt.source_image_path_redacted === true, "receipt source image path must be redacted");
}

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateEvidenceRecord(record) {
  assert(record && typeof record === "object", "visual evidence consistency record missing");
  assertNoSecretOrRawPath(record, "visual_evidence_consistency_hardening");
  assert(record.phase === phase, "phase mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.source_review_pack_ref === reviewPackPath, "source_review_pack_ref mismatch");
  assert(record.source_dry_run_report_ref === dryRunPath, "source_dry_run_report_ref mismatch");
  assert(record.source_authorization_registry_ref === registryPath, "source_authorization_registry_ref mismatch");
  assert(record.source_receipt_path === receiptPath, "source_receipt_path mismatch");
  assert(record.source_attempt_result_path === attemptResultPath, "source_attempt_result_path mismatch");

  const sources = sourceEvidence();
  validateSourceMetadataNoRawPaths(sources);
  validateSourceConsistency(sources);

  const evidence = record.asset_evidence;
  assert(evidence && typeof evidence === "object", "asset_evidence missing");
  assert(evidence.asset_id === sources.registryEntry.asset_id, "asset_evidence.asset_id mismatch");
  assert(evidence.task_id === sources.registryEntry.task_id, "asset_evidence.task_id mismatch");
  assert(evidence.receipt_path === receiptPath, "asset_evidence.receipt_path mismatch");
  assert(evidence.attempt_result_path === attemptResultPath, "asset_evidence.attempt_result_path mismatch");
  assert(evidence.output_image_sha256 === sources.registryEntry.output_image_sha256, "asset_evidence output_image_sha256 mismatch");
  assert(evidence.asset_class === sources.registryEntry.asset_class, "asset_evidence.asset_class mismatch");
  assert(evidence.raw_local_path_included === false, "asset_evidence.raw_local_path_included must remain false");
  assert(evidence.image_binary_read_performed === false, "asset_evidence.image_binary_read_performed must remain false");

  for (const rule of consistencyRules) {
    assert(record.consistency_rules?.[rule] === true, `consistency rule must be true: ${rule}`);
  }
  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.image_binary_read_performed === false, "image_binary_read_performed must remain false");
  assert(record.boundaries?.real_executor_implemented_now === false, "real_executor_implemented_now must remain false");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateEvidenceRecord(candidate);
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
  let invalidFixtureCaught = false;
  try {
    validateEvidenceRecord(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid visual evidence consistency fixture must fail");

  const cases = [
    expectFailure(validRecord, "asset_id_mismatch_fails", (candidate) => {
      candidate.asset_evidence.asset_id = "visual-asset-wrong";
    }),
    expectFailure(validRecord, "receipt_path_mismatch_fails", (candidate) => {
      candidate.asset_evidence.receipt_path = "reports/provider_receipts/missing.json";
    }),
    expectFailure(validRecord, "attempt_result_path_mismatch_fails", (candidate) => {
      candidate.asset_evidence.attempt_result_path = "runs/real_generation/missing/generation_attempt_result.json";
    }),
    expectFailure(validRecord, "output_image_sha256_mismatch_fails", (candidate) => {
      candidate.asset_evidence.output_image_sha256 = "0000000000000000000000000000000000000000000000000000000000000000";
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.evidence_consistency_id = "C:\\private\\image.png";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.evidence_consistency_id = ".env.local";
    }),
    expectFailure(validRecord, "image_binary_read_true_fails", (candidate) => {
      candidate.asset_evidence.image_binary_read_performed = true;
    }),
    expectFailure(validRecord, "boundary_image_binary_read_true_fails", (candidate) => {
      candidate.boundaries.image_binary_read_performed = true;
    }),
    expectFailure(validRecord, "vcp_memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "missing_consistency_rule_fails", (candidate) => {
      delete candidate.consistency_rules.asset_id_consistent;
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    asset_id_mismatch_caught: cases.some((item) => item.case_id === "asset_id_mismatch_fails" && item.result === "caught"),
    receipt_path_mismatch_caught: cases.some((item) => item.case_id === "receipt_path_mismatch_fails" && item.result === "caught"),
    attempt_result_path_mismatch_caught: cases.some((item) => item.case_id === "attempt_result_path_mismatch_fails" && item.result === "caught"),
    output_image_sha256_mismatch_caught: cases.some((item) => item.case_id === "output_image_sha256_mismatch_fails" && item.result === "caught"),
    raw_local_path_caught: cases.some((item) => item.case_id === "raw_local_path_fails" && item.result === "caught"),
    image_binary_read_caught: cases.some((item) => item.case_id === "image_binary_read_true_fails" && item.result === "caught")
  };
}

function validateTextSurfaces() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const combined = `${doc}\n${schema}`;
  for (const token of [
    phase,
    "asset_id_consistent",
    "receipt_path_consistent",
    "attempt_result_path_consistent",
    "output_image_sha256_consistent",
    "no_raw_local_path",
    "no_image_binary_read",
    "image_binary_read_performed: false",
    "provider_call_performed: false",
    "VCP_memory_write_performed: false",
    "Push_L2_exercised: false"
  ]) {
    assert(combined.includes(token), `visual evidence consistency surface missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_visual_evidence_consistency_hardening.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_9_visual_evidence_consistency_hardening_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const report = readJson(reportPath).visual_evidence_consistency_hardening;
  const validRecord = readJson(passFixturePath).visual_evidence_consistency_hardening;
  const invalidRecord = readJson(failFixturePath).visual_evidence_consistency_hardening;
  validateEvidenceRecord(report);
  validateEvidenceRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_evidence_consistency_hardening",
    phase,
    evidence_consistency_doc_present: fs.existsSync(repoPath(docPath)),
    evidence_consistency_schema_present: fs.existsSync(repoPath(schemaPath)),
    evidence_consistency_report_present: fs.existsSync(repoPath(reportPath)),
    evidence_consistency_fixture_present: fs.existsSync(repoPath(passFixturePath)),
    evidence_consistency_fail_fixture_present: fs.existsSync(repoPath(failFixturePath)),
    source_review_pack_verified: true,
    source_dry_run_report_verified: true,
    source_authorization_registry_verified: true,
    source_receipt_verified: true,
    source_attempt_result_verified: true,
    asset_id_consistent: true,
    receipt_path_consistent: true,
    attempt_result_path_consistent: true,
    output_image_sha256_consistent: true,
    no_raw_local_path: true,
    no_image_binary_read: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    asset_id_mismatch_caught: negativeCaseSummary.asset_id_mismatch_caught,
    receipt_path_mismatch_caught: negativeCaseSummary.receipt_path_mismatch_caught,
    attempt_result_path_mismatch_caught: negativeCaseSummary.attempt_result_path_mismatch_caught,
    output_image_sha256_mismatch_caught: negativeCaseSummary.output_image_sha256_mismatch_caught,
    raw_local_path_caught: negativeCaseSummary.raw_local_path_caught,
    image_binary_read_caught: negativeCaseSummary.image_binary_read_caught,
    metadata_only: true,
    dry_run_only: true,
    image_binary_read_performed: false,
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

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}
