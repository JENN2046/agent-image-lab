#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_8_visual_review_semantics_hardening";
const docPath = "docs/V0_4_8_VISUAL_REVIEW_SEMANTICS_HARDENING.md";
const schemaPath = "schemas/visual_review_semantics_hardening.schema.yaml";
const passFixturePath = "tests/schema_examples/visual_review_semantics_hardening.example.json";
const failFixturePath = "tests/schema_examples/visual_review_semantics_hardening_fail.example.json";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const taxonomyPath = "tests/schema_examples/visual_failure_taxonomy.example.json";
const correctionHintPath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const decisionResults = new Set(["pass", "patch", "reject"]);
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
const requiredConstraints = [
  "pass_blocks_blocking_failure",
  "reject_requires_failure_taxonomy",
  "patch_requires_correction_hint",
  "low_score_requires_finding",
  "memory_suitability_stays_false"
];
const dimensionToFailureCategory = {
  composition: "composition_failure",
  lighting: "lighting_failure",
  material_realism: "material_realism_failure",
  product_fidelity: "product_fidelity_failure",
  commercial_fitness: "commercial_fitness_failure",
  ai_artifact_risk: "ai_artifact_failure"
};

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

function assertStringArray(value, message) {
  assert(Array.isArray(value), message);
  value.forEach((item, index) => assertNonEmptyString(item, `${message} at ${index}`));
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

function correctionHintCategories() {
  const hints = readJson(correctionHintPath).visual_prompt_correction_hints;
  assert(hints.phase === "v0_4_3_review_to_prompt_correction_hint", "source correction hint phase mismatch");
  return new Set(hints.hints.map((hint) => hint.taxonomy_category_id));
}

function validateSourceBinding(record, reviewPack) {
  assert(record.source_review_pack_ref === reviewPackPath, "source_review_pack_ref mismatch");
  assert(record.source_failure_taxonomy_ref === taxonomyPath, "source_failure_taxonomy_ref mismatch");
  assert(record.source_prompt_correction_hint_ref === correctionHintPath, "source_prompt_correction_hint_ref mismatch");
  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "source review pack phase mismatch");
  assert(reviewPack.review_pack_decision.result === reviewPack.review_summary.overall_result, "source review pack result fields must agree");
  assert(record.review_decision.result === reviewPack.review_pack_decision.result, "semantic result must match source review pack");
  assert(reviewPack.structured_review_report.memory_suitability.value === false, "source review pack memory_suitability must remain false");
  assert(reviewPack.review_pack_boundaries.image_binary_read_performed === false, "source review pack must not read image binary");
}

function validateFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateSemanticConstraints(record) {
  assert(record.semantic_constraints && typeof record.semantic_constraints === "object", "semantic_constraints missing");
  for (const constraint of requiredConstraints) {
    assert(record.semantic_constraints[constraint] === true, `semantic constraint must be true: ${constraint}`);
  }
}

function validateDecisionSemantics(record, allowedCategories, allowedHintCategories) {
  const decision = record.review_decision;
  assert(decision && typeof decision === "object", "review_decision missing");
  assert(decisionResults.has(decision.result), "review_decision.result outside allowed values");
  assertStringArray(decision.blocking_failures, "blocking_failures must be an array");
  assertStringArray(decision.failure_taxonomy, "failure_taxonomy must be an array");
  assertStringArray(decision.correction_hint_categories, "correction_hint_categories must be an array");
  assert(decision.memory_suitability === false, "review_decision.memory_suitability must remain false");

  decision.failure_taxonomy.forEach((category) => assert(allowedCategories.has(category), `unknown failure taxonomy category: ${category}`));
  decision.correction_hint_categories.forEach((category) => assert(allowedHintCategories.has(category), `unknown correction hint category: ${category}`));

  if (decision.result === "pass") {
    assert(decision.blocking_failures.length === 0, "pass cannot include blocking failures");
  }
  if (decision.result === "reject") {
    assert(decision.failure_taxonomy.length > 0, "reject requires explicit failure taxonomy");
  }
  if (decision.result === "patch") {
    assert(decision.correction_hint_ref === correctionHintPath, "patch requires correction hint ref");
    assert(decision.correction_hint_categories.length > 0, "patch requires correction hint categories");
  }
}

function lowScoreDimensions(reviewPack, threshold) {
  return Object.entries(dimensionToFailureCategory)
    .filter(([dimension]) => reviewPack.structured_review_report[dimension]?.score <= threshold)
    .map(([dimension, category]) => {
      const reviewDimension = reviewPack.structured_review_report[dimension];
      return {
        dimension,
        score: reviewDimension.score,
        finding: reviewDimension.finding,
        mapped_failure_category: category
      };
    });
}

function validateLowScoreFindings(record, reviewPack, allowedCategories) {
  assert(Number.isInteger(record.low_score_threshold) && record.low_score_threshold >= 0 && record.low_score_threshold <= 10, "low_score_threshold out of range");
  assert(Array.isArray(record.low_score_findings), "low_score_findings missing");
  const expected = lowScoreDimensions(reviewPack, record.low_score_threshold);
  assert(record.low_score_findings.length === expected.length, "low_score_findings must cover every low-scored source dimension");
  for (const item of expected) {
    assertNonEmptyString(item.finding, `source low-score finding missing: ${item.dimension}`);
    const actual = record.low_score_findings.find((candidate) => candidate.dimension === item.dimension);
    assert(actual, `low score finding missing for dimension: ${item.dimension}`);
    assert(actual.score === item.score, `low score finding score mismatch: ${item.dimension}`);
    assert(actual.finding === item.finding, `low score finding text mismatch: ${item.dimension}`);
    assert(actual.mapped_failure_category === item.mapped_failure_category, `low score failure category mismatch: ${item.dimension}`);
    assert(allowedCategories.has(actual.mapped_failure_category), `low score finding uses unknown category: ${actual.mapped_failure_category}`);
  }
}

function validateReviewSemanticsHardening(record) {
  assert(record && typeof record === "object", "visual review semantics hardening missing");
  assertNoSecretOrRawPath(record, "visual_review_semantics_hardening");
  assert(record.phase === phase, "phase mismatch");
  assert(record.version === "v0_1", "version mismatch");
  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  validateSourceBinding(record, reviewPack);
  const allowedCategories = taxonomyCategories();
  const allowedHintCategories = correctionHintCategories();
  validateSemanticConstraints(record);
  validateDecisionSemantics(record, allowedCategories, allowedHintCategories);
  validateLowScoreFindings(record, reviewPack, allowedCategories);

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
    validateReviewSemanticsHardening(candidate);
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
    validateReviewSemanticsHardening(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid visual review semantics hardening fixture must fail");

  const cases = [
    expectFailure(validRecord, "pass_with_blocking_failure_fails", (candidate) => {
      candidate.review_decision.result = "pass";
      candidate.review_decision.blocking_failures = ["commercial_fitness_failure"];
    }),
    expectFailure(validRecord, "reject_without_failure_taxonomy_fails", (candidate) => {
      candidate.review_decision.result = "reject";
      candidate.review_decision.failure_taxonomy = [];
    }),
    expectFailure(validRecord, "patch_without_correction_hint_ref_fails", (candidate) => {
      candidate.review_decision.correction_hint_ref = null;
    }),
    expectFailure(validRecord, "patch_without_correction_hint_categories_fails", (candidate) => {
      candidate.review_decision.correction_hint_categories = [];
    }),
    expectFailure(validRecord, "low_score_missing_finding_fails", (candidate) => {
      candidate.low_score_findings[0].finding = "";
    }),
    expectFailure(validRecord, "low_score_dimension_missing_fails", (candidate) => {
      candidate.low_score_findings = candidate.low_score_findings.filter((item) => item.dimension !== "ai_artifact_risk");
    }),
    expectFailure(validRecord, "memory_suitability_true_fails", (candidate) => {
      candidate.review_decision.memory_suitability = true;
    }),
    expectFailure(validRecord, "unknown_failure_taxonomy_fails", (candidate) => {
      candidate.review_decision.failure_taxonomy = ["style_failure"];
    }),
    expectFailure(validRecord, "unknown_correction_hint_category_fails", (candidate) => {
      candidate.review_decision.correction_hint_categories = ["style_failure"];
    }),
    expectFailure(validRecord, "image_binary_read_true_fails", (candidate) => {
      candidate.boundaries.image_binary_read_performed = true;
    }),
    expectFailure(validRecord, "vcp_memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.semantic_hardening_id = "C:\\private\\image.png";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.semantic_hardening_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    pass_blocking_failure_caught: cases.some((item) => item.case_id === "pass_with_blocking_failure_fails" && item.result === "caught"),
    reject_without_taxonomy_caught: cases.some((item) => item.case_id === "reject_without_failure_taxonomy_fails" && item.result === "caught"),
    patch_without_correction_hint_caught: cases.some((item) => item.case_id === "patch_without_correction_hint_ref_fails" && item.result === "caught"),
    low_score_without_finding_caught: cases.some((item) => item.case_id === "low_score_missing_finding_fails" && item.result === "caught"),
    memory_suitability_drift_caught: cases.some((item) => item.case_id === "memory_suitability_true_fails" && item.result === "caught")
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
    "pass_blocks_blocking_failure",
    "reject_requires_failure_taxonomy",
    "patch_requires_correction_hint",
    "low_score_requires_finding",
    "memory_suitability_stays_false",
    "image_binary_read_performed: false",
    "provider_call_performed: false",
    "VCP_memory_write_performed: false",
    "Push_L2_exercised: false"
  ]) {
    assert(combined.includes(token), `visual review semantics surface missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_visual_review_semantics_hardening.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_8_visual_review_semantics_hardening_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const validRecord = readJson(passFixturePath).visual_review_semantics_hardening;
  const invalidRecord = readJson(failFixturePath).visual_review_semantics_hardening;
  validateReviewSemanticsHardening(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_review_semantics_hardening",
    phase,
    semantic_hardening_doc_present: fs.existsSync(repoPath(docPath)),
    semantic_hardening_schema_present: fs.existsSync(repoPath(schemaPath)),
    semantic_hardening_fixture_present: fs.existsSync(repoPath(passFixturePath)),
    semantic_hardening_fail_fixture_present: fs.existsSync(repoPath(failFixturePath)),
    source_review_pack_verified: true,
    source_failure_taxonomy_verified: true,
    source_prompt_correction_hint_verified: true,
    pass_blocks_blocking_failure: true,
    reject_requires_failure_taxonomy: true,
    patch_requires_correction_hint: true,
    low_score_requires_finding: true,
    memory_suitability_stays_false: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    pass_blocking_failure_caught: negativeCaseSummary.pass_blocking_failure_caught,
    reject_without_taxonomy_caught: negativeCaseSummary.reject_without_taxonomy_caught,
    patch_without_correction_hint_caught: negativeCaseSummary.patch_without_correction_hint_caught,
    low_score_without_finding_caught: negativeCaseSummary.low_score_without_finding_caught,
    memory_suitability_drift_caught: negativeCaseSummary.memory_suitability_drift_caught,
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
