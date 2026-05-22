#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_2_visual_failure_taxonomy";
const docPath = "docs/V0_4_2_VISUAL_FAILURE_TAXONOMY.md";
const schemaPath = "schemas/visual_failure_taxonomy.schema.yaml";
const passFixturePath = "tests/schema_examples/visual_failure_taxonomy.example.json";
const failFixturePath = "tests/schema_examples/visual_failure_taxonomy_fail.example.json";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const requiredCategories = [
  "composition_failure",
  "lighting_failure",
  "material_realism_failure",
  "product_fidelity_failure",
  "commercial_fitness_failure",
  "ai_artifact_failure",
  "registry_or_provenance_mismatch"
];
const severityScale = ["minor", "moderate", "major", "blocking"];
const allowedDimensions = new Set([
  "composition",
  "lighting",
  "material_realism",
  "product_fidelity",
  "commercial_fitness",
  "ai_artifact_risk",
  "provenance"
]);
const categoryDimensionMap = new Map([
  ["composition_failure", "composition"],
  ["lighting_failure", "lighting"],
  ["material_realism_failure", "material_realism"],
  ["product_fidelity_failure", "product_fidelity"],
  ["commercial_fitness_failure", "commercial_fitness"],
  ["ai_artifact_failure", "ai_artifact_risk"],
  ["registry_or_provenance_mismatch", "provenance"]
]);
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

function sameStringList(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

function assertNonEmptyArray(value, message) {
  assert(Array.isArray(value) && value.length > 0, message);
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

function validateReviewPackBinding(record) {
  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  assert(record.source_review_pack_ref === reviewPackPath, "source_review_pack_ref mismatch");
  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "source review pack phase mismatch");
  assert(reviewPack.existing_asset_metadata_only === true, "source review pack must be metadata-only");
  assert(reviewPack.review_pack_boundaries.image_binary_read_performed === false, "source review pack must not read image binary");
  assert(reviewPack.review_summary.next_dry_run_action === "define_failure_taxonomy", "source review pack must point to failure taxonomy");
}

function validateCategory(category) {
  assert(requiredCategories.includes(category.category_id), `unknown category: ${category.category_id}`);
  assertNonEmptyString(category.definition, `definition missing: ${category.category_id}`);
  assertNonEmptyArray(category.applies_to_dimensions, `applies_to_dimensions missing: ${category.category_id}`);
  assert(category.applies_to_dimensions.every((dimension) => allowedDimensions.has(dimension)), `invalid dimension: ${category.category_id}`);
  assert(
    category.applies_to_dimensions.includes(categoryDimensionMap.get(category.category_id)),
    `category not mapped to required dimension: ${category.category_id}`
  );
  assert(sameStringList(category.severity_scale, severityScale), `severity_scale mismatch: ${category.category_id}`);
  assertNonEmptyArray(category.dry_run_detection_signals, `dry_run_detection_signals missing: ${category.category_id}`);
  assert(category.dry_run_detection_signals.every((signal) => typeof signal === "string" && signal.trim()), `empty detection signal: ${category.category_id}`);
  assertNonEmptyString(category.reviewer_question, `reviewer_question missing: ${category.category_id}`);
  assert(category.correction_hint_bridge && typeof category.correction_hint_bridge === "object", `correction_hint_bridge missing: ${category.category_id}`);
  assertNonEmptyString(category.correction_hint_bridge.prompt_constraint_candidate, `prompt constraint bridge missing: ${category.category_id}`);
  assertNonEmptyString(category.correction_hint_bridge.avoid_fragment_candidate, `avoid fragment bridge missing: ${category.category_id}`);
  assert(
    category.correction_hint_bridge.future_phase === "v0_4_3_review_to_prompt_correction_hint",
    `future phase bridge mismatch: ${category.category_id}`
  );
}

function validateFalseFlags(container, context) {
  for (const flag of falseFlags) {
    assert(container?.[flag] === false, `${context} flag must remain false: ${flag}`);
  }
}

function validateFailureTaxonomy(record) {
  assert(record && typeof record === "object", "taxonomy missing");
  assertNoSecretOrRawPath(record, "visual_failure_taxonomy");
  assert(record.phase === phase, "phase mismatch");
  assert(record.version === "v0_1", "version mismatch");
  validateReviewPackBinding(record);
  assert(sameStringList(record.required_categories, requiredCategories), "required_categories mismatch");
  assert(Array.isArray(record.categories), "categories missing");
  assert(record.categories.length === requiredCategories.length, "category count mismatch");
  const categoryIds = record.categories.map((category) => category.category_id);
  assert(new Set(categoryIds).size === categoryIds.length, "duplicate category found");
  assert(sameStringList(categoryIds, requiredCategories), "categories must match required exact set");
  record.categories.forEach(validateCategory);

  assert(record.taxonomy_boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.taxonomy_boundaries?.source_review_pack_required === true, "source_review_pack_required must be true");
  assert(record.taxonomy_boundaries?.image_binary_read_performed === false, "image_binary_read_performed must remain false");
  assert(record.taxonomy_boundaries?.real_executor_implemented_now === false, "real executor must remain unimplemented");
  assert(record.taxonomy_boundaries?.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  validateFalseFlags(record.taxonomy_boundaries, "taxonomy_boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateFailureTaxonomy(candidate);
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
    validateFailureTaxonomy(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid taxonomy fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_category_fails", (candidate) => {
      candidate.categories = candidate.categories.filter((category) => category.category_id !== "lighting_failure");
    }),
    expectFailure(validRecord, "unknown_category_fails", (candidate) => {
      candidate.categories[0].category_id = "style_failure";
    }),
    expectFailure(validRecord, "duplicate_category_fails", (candidate) => {
      candidate.categories[1].category_id = candidate.categories[0].category_id;
    }),
    expectFailure(validRecord, "empty_definition_fails", (candidate) => {
      candidate.categories[0].definition = "";
    }),
    expectFailure(validRecord, "missing_severity_scale_fails", (candidate) => {
      delete candidate.categories[0].severity_scale;
    }),
    expectFailure(validRecord, "invalid_severity_scale_fails", (candidate) => {
      candidate.categories[0].severity_scale = ["minor", "major"];
    }),
    expectFailure(validRecord, "missing_detection_signals_fails", (candidate) => {
      candidate.categories[0].dry_run_detection_signals = [];
    }),
    expectFailure(validRecord, "missing_correction_hint_bridge_fails", (candidate) => {
      delete candidate.categories[0].correction_hint_bridge;
    }),
    expectFailure(validRecord, "category_dimension_mismatch_fails", (candidate) => {
      candidate.categories[0].applies_to_dimensions = ["lighting"];
    }),
    expectFailure(validRecord, "review_pack_ref_drift_fails", (candidate) => {
      candidate.source_review_pack_ref = "reports/visual_asset_eval_dry_run/missing.json";
    }),
    expectFailure(validRecord, "accepted_sample_auto_promotion_true_fails", (candidate) => {
      candidate.side_effects.accepted_sample_auto_promotion = true;
    }),
    expectFailure(validRecord, "production_candidate_created_true_fails", (candidate) => {
      candidate.side_effects.production_candidate_created = true;
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
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => {
      candidate.side_effects.runtime_call_performed = true;
    }),
    expectFailure(validRecord, "secret_value_read_true_fails", (candidate) => {
      candidate.side_effects.secret_value_read_performed = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.categories[0].definition = "C:\\private\\visual.png";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.categories[0].definition = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    missing_category_caught: cases.some((item) => item.case_id === "missing_category_fails" && item.result === "caught"),
    unknown_category_caught: cases.some((item) => item.case_id === "unknown_category_fails" && item.result === "caught"),
    duplicate_category_caught: cases.some((item) => item.case_id === "duplicate_category_fails" && item.result === "caught")
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
    "composition_failure",
    "lighting_failure",
    "material_realism_failure",
    "product_fidelity_failure",
    "commercial_fitness_failure",
    "ai_artifact_failure",
    "registry_or_provenance_mismatch",
    "v0_4_3_review_to_prompt_correction_hint",
    "provider_call_performed: false",
    "image_generation_performed: false",
    "VCP_memory_write_performed: false",
    "accepted_sample_auto_promotion: false",
    "production_candidate_created: false"
  ]) {
    assert(combined.includes(token), `taxonomy text surface missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_visual_failure_taxonomy.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_2_visual_failure_taxonomy_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const validRecord = readJson(passFixturePath).visual_failure_taxonomy;
  const invalidRecord = readJson(failFixturePath).visual_failure_taxonomy;
  validateFailureTaxonomy(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_failure_taxonomy",
    phase,
    taxonomy_doc_present: fs.existsSync(repoPath(docPath)),
    taxonomy_schema_present: fs.existsSync(repoPath(schemaPath)),
    taxonomy_fixture_present: fs.existsSync(repoPath(passFixturePath)),
    taxonomy_fail_fixture_present: fs.existsSync(repoPath(failFixturePath)),
    required_category_count: requiredCategories.length,
    exact_required_categories_defined: true,
    categories: requiredCategories,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    missing_category_caught: negativeCaseSummary.missing_category_caught,
    unknown_category_caught: negativeCaseSummary.unknown_category_caught,
    duplicate_category_caught: negativeCaseSummary.duplicate_category_caught,
    source_review_pack_verified: true,
    metadata_only: true,
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

module.exports = {
  validateFailureTaxonomy,
  validateNegativeCases
};
