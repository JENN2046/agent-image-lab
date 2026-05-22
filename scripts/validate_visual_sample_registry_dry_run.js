#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_4_sample_registry_dry_run";
const docPath = "docs/V0_4_4_SAMPLE_REGISTRY_DRY_RUN.md";
const schemaPath = "schemas/visual_sample_registry_dry_run.schema.yaml";
const registryPath = "reports/visual_asset_eval_dry_run/v0_4_4_sample_registry_dry_run.json";
const passFixturePath = "tests/schema_examples/visual_sample_registry_dry_run.example.json";
const failFixturePath = "tests/schema_examples/visual_sample_registry_dry_run_fail.example.json";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const taxonomyPath = "tests/schema_examples/visual_failure_taxonomy.example.json";
const correctionHintPath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const authorizationRegistryPath = "assets/visual_asset_authorization_registry.example.json";
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

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
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

function taxonomyCategories() {
  const taxonomy = readJson(taxonomyPath).visual_failure_taxonomy;
  assert(taxonomy.phase === "v0_4_2_visual_failure_taxonomy", "source taxonomy phase mismatch");
  return new Set(taxonomy.categories.map((category) => category.category_id));
}

function validateSourceBinding(record) {
  assert(record.source_review_pack_ref === reviewPackPath, "source_review_pack_ref mismatch");
  assert(record.source_failure_taxonomy_ref === taxonomyPath, "source_failure_taxonomy_ref mismatch");
  assert(record.source_prompt_correction_hint_ref === correctionHintPath, "source_prompt_correction_hint_ref mismatch");
  assert(record.source_authorization_registry_ref === authorizationRegistryPath, "source_authorization_registry_ref mismatch");

  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  const correctionHints = readJson(correctionHintPath).visual_prompt_correction_hints;
  const authorizationRegistry = readJson(authorizationRegistryPath);
  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "source review pack phase mismatch");
  assert(reviewPack.review_pack_boundaries.image_binary_read_performed === false, "source review pack must not read image binary");
  assert(correctionHints.phase === "v0_4_3_review_to_prompt_correction_hint", "source correction hint phase mismatch");
  assert(authorizationRegistry.entries.some((entry) => entry.asset_id === reviewPack.asset_ref.asset_id), "source asset must exist in authorization registry");
}

function validateAcceptedEntry(entry) {
  assertNonEmptyString(entry.dry_run_entry_id, "accepted dry-run entry id missing");
  assertNonEmptyString(entry.source_asset_id, "accepted source asset id missing");
  assert(entry.source_review_pack_ref === reviewPackPath, "accepted source review pack ref mismatch");
  assert(entry.accepted_sample_eligible === false, "accepted_sample_eligible must remain false");
  assert(entry.human_accepted === false, "human_accepted must remain false");
  assert(entry.accepted_gate_id === null, "accepted_gate_id must remain null");
  assert(entry.would_create_accepted_sample === false, "would_create_accepted_sample must remain false");
  assert(entry.actual_accepted_sample_created === false, "actual_accepted_sample_created must remain false");
  assert(entry.accepted_sample_promotion === false, "accepted_sample_promotion must remain false");
  assertNonEmptyString(entry.reason, "accepted dry-run reason missing");
}

function validateRejectedEntry(entry, allowedCategories) {
  assertNonEmptyString(entry.dry_run_entry_id, "rejected dry-run entry id missing");
  assertNonEmptyString(entry.source_asset_id, "rejected source asset id missing");
  assert(entry.source_review_pack_ref === reviewPackPath, "rejected source review pack ref mismatch");
  assertNonEmptyString(entry.rejection_reason, "rejection_reason missing");
  assert(Array.isArray(entry.failure_categories) && entry.failure_categories.length > 0, "failure_categories missing");
  entry.failure_categories.forEach((category) => assert(allowedCategories.has(category), `unknown failure category: ${category}`));
  assert(entry.correction_hint_ref === correctionHintPath, "correction_hint_ref mismatch");
  assert(entry.would_register_rejected_sample === true, "would_register_rejected_sample must be true in dry-run");
  assert(entry.actual_rejected_sample_created === false, "actual_rejected_sample_created must remain false");
  assertNonEmptyString(entry.reason, "rejected dry-run reason missing");
}

function validateFalseFlags(container, context) {
  for (const flag of falseFlags) {
    assert(container?.[flag] === false, `${context} flag must remain false: ${flag}`);
  }
}

function validateRegistryBoundaries(boundaries) {
  assert(boundaries?.metadata_only === true, "metadata_only must be true");
  assert(boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(boundaries?.accepted_sample_promotion === false, "accepted_sample_promotion must remain false");
  assert(boundaries?.accepted_sample_auto_promotion === false, "accepted_sample_auto_promotion must remain false");
  assert(boundaries?.actual_accepted_sample_created === false, "actual_accepted_sample_created must remain false");
  assert(boundaries?.actual_rejected_sample_created === false, "actual_rejected_sample_created must remain false");
  assert(boundaries?.VCP_memory_write_performed === false, "VCP_memory_write_performed must remain false");
  assert(boundaries?.DailyNote_write_performed === false, "DailyNote_write_performed must remain false");
  assert(boundaries?.production_candidate_created === false, "production_candidate_created must remain false");
  assert(boundaries?.image_binary_read_performed === false, "image_binary_read_performed must remain false");
  assert(boundaries?.real_executor_implemented_now === false, "real executor must remain unimplemented");
  assert(boundaries?.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  validateFalseFlags(boundaries, "registry_boundaries");
}

function validateSampleRegistryDryRun(record) {
  assert(record && typeof record === "object", "sample registry dry-run missing");
  assertNoSecretOrRawPath(record, "visual_sample_registry_dry_run");
  assert(record.phase === phase, "phase mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.registry_mode === "dry_run_no_promotion", "registry_mode mismatch");
  validateSourceBinding(record);

  assert(record.accepted_registry_dry_run?.registry_type === "accepted_sample_dry_run", "accepted registry type mismatch");
  assert(Array.isArray(record.accepted_registry_dry_run.entries) && record.accepted_registry_dry_run.entries.length > 0, "accepted dry-run entries missing");
  record.accepted_registry_dry_run.entries.forEach(validateAcceptedEntry);

  const allowedCategories = taxonomyCategories();
  assert(record.rejected_registry_dry_run?.registry_type === "rejected_sample_dry_run", "rejected registry type mismatch");
  assert(Array.isArray(record.rejected_registry_dry_run.entries) && record.rejected_registry_dry_run.entries.length > 0, "rejected dry-run entries missing");
  record.rejected_registry_dry_run.entries.forEach((entry) => validateRejectedEntry(entry, allowedCategories));

  validateRegistryBoundaries(record.registry_boundaries);
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateSampleRegistryDryRun(candidate);
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
    validateSampleRegistryDryRun(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid sample registry dry-run fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_accepted_registry_fails", (candidate) => {
      delete candidate.accepted_registry_dry_run;
    }),
    expectFailure(validRecord, "missing_rejected_registry_fails", (candidate) => {
      delete candidate.rejected_registry_dry_run;
    }),
    expectFailure(validRecord, "accepted_sample_eligible_true_fails", (candidate) => {
      candidate.accepted_registry_dry_run.entries[0].accepted_sample_eligible = true;
    }),
    expectFailure(validRecord, "human_accepted_true_fails", (candidate) => {
      candidate.accepted_registry_dry_run.entries[0].human_accepted = true;
    }),
    expectFailure(validRecord, "accepted_gate_id_present_fails", (candidate) => {
      candidate.accepted_registry_dry_run.entries[0].accepted_gate_id = "accepted_gate_forbidden";
    }),
    expectFailure(validRecord, "would_create_accepted_sample_true_fails", (candidate) => {
      candidate.accepted_registry_dry_run.entries[0].would_create_accepted_sample = true;
    }),
    expectFailure(validRecord, "actual_accepted_sample_created_true_fails", (candidate) => {
      candidate.accepted_registry_dry_run.entries[0].actual_accepted_sample_created = true;
    }),
    expectFailure(validRecord, "accepted_sample_promotion_true_fails", (candidate) => {
      candidate.accepted_registry_dry_run.entries[0].accepted_sample_promotion = true;
    }),
    expectFailure(validRecord, "actual_rejected_sample_created_true_fails", (candidate) => {
      candidate.rejected_registry_dry_run.entries[0].actual_rejected_sample_created = true;
    }),
    expectFailure(validRecord, "unknown_rejected_failure_category_fails", (candidate) => {
      candidate.rejected_registry_dry_run.entries[0].failure_categories = ["unknown_failure"];
    }),
    expectFailure(validRecord, "correction_hint_source_drift_fails", (candidate) => {
      candidate.rejected_registry_dry_run.entries[0].correction_hint_ref = "tests/schema_examples/missing_hint.json";
    }),
    expectFailure(validRecord, "review_pack_source_drift_fails", (candidate) => {
      candidate.source_review_pack_ref = "reports/visual_asset_eval_dry_run/missing.json";
    }),
    expectFailure(validRecord, "vcp_memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "daily_note_write_true_fails", (candidate) => {
      candidate.side_effects.DailyNote_write_performed = true;
    }),
    expectFailure(validRecord, "production_candidate_created_true_fails", (candidate) => {
      candidate.side_effects.production_candidate_created = true;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
    }),
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => {
      candidate.side_effects.runtime_call_performed = true;
    }),
    expectFailure(validRecord, "secret_value_read_true_fails", (candidate) => {
      candidate.side_effects.secret_value_read_performed = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.accepted_registry_dry_run.entries[0].reason = "C:\\private\\sample.png";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.rejected_registry_dry_run.entries[0].reason = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    accepted_promotion_caught: cases.some((item) => item.case_id === "accepted_sample_promotion_true_fails" && item.result === "caught"),
    memory_write_caught: cases.some((item) => item.case_id === "vcp_memory_write_true_fails" && item.result === "caught"),
    production_candidate_caught: cases.some((item) => item.case_id === "production_candidate_created_true_fails" && item.result === "caught")
  };
}

function validatePassFixturePointer() {
  const fixture = readJson(passFixturePath).visual_sample_registry_dry_run;
  assert(fixture.registry_ref === registryPath, "pass fixture must point to registry report");
}

function validateTextSurfaces() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const combined = `${doc}\n${schema}`;
  for (const token of [
    phase,
    "accepted_registry_dry_run",
    "rejected_registry_dry_run",
    "accepted_sample_promotion: false",
    "VCP_memory_write_performed: false",
    "DailyNote_write_performed: false",
    "production_candidate_created: false",
    "dry_run_no_promotion"
  ]) {
    assert(combined.includes(token), `sample registry dry-run text surface missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_visual_sample_registry_dry_run.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_4_sample_registry_dry_run_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  validatePassFixturePointer();
  const validRecord = readJson(registryPath).visual_sample_registry_dry_run;
  const invalidRecord = readJson(failFixturePath).visual_sample_registry_dry_run;
  validateSampleRegistryDryRun(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_sample_registry_dry_run",
    phase,
    sample_registry_doc_present: fs.existsSync(repoPath(docPath)),
    sample_registry_schema_present: fs.existsSync(repoPath(schemaPath)),
    sample_registry_report_present: fs.existsSync(repoPath(registryPath)),
    sample_registry_fixture_present: fs.existsSync(repoPath(passFixturePath)),
    sample_registry_fail_fixture_present: fs.existsSync(repoPath(failFixturePath)),
    accepted_registry_dry_run_present: true,
    rejected_registry_dry_run_present: true,
    source_review_pack_verified: true,
    source_failure_taxonomy_verified: true,
    source_prompt_correction_hint_verified: true,
    accepted_sample_promotion: false,
    accepted_sample_auto_promotion: false,
    actual_accepted_sample_created: false,
    actual_rejected_sample_created: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    production_candidate_created: false,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    accepted_promotion_caught: negativeCaseSummary.accepted_promotion_caught,
    memory_write_caught: negativeCaseSummary.memory_write_caught,
    production_candidate_caught: negativeCaseSummary.production_candidate_caught,
    metadata_only: true,
    dry_run_only: true,
    image_binary_read_performed: false,
    Push_L2_exercised: false,
    real_executor_implemented_now: false,
    provider_call_performed: false,
    image_generation_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
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

module.exports = {
  validateSampleRegistryDryRun,
  validateNegativeCases
};
