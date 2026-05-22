#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_3_review_to_prompt_correction_hint";
const docPath = "docs/V0_4_3_REVIEW_TO_PROMPT_CORRECTION_HINT.md";
const schemaPath = "schemas/visual_prompt_correction_hint.schema.yaml";
const passFixturePath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const failFixturePath = "tests/schema_examples/visual_prompt_correction_hint_fail.example.json";
const taxonomyPath = "tests/schema_examples/visual_failure_taxonomy.example.json";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const requiredHintFields = [
  "prompt_constraints_to_add",
  "prompt_fragments_to_avoid",
  "lighting_adjustment",
  "composition_adjustment",
  "material_adjustment"
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

function sameStringList(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

function assertNonEmptyStringArray(value, message) {
  assert(Array.isArray(value) && value.length > 0, message);
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
  return taxonomy.categories.map((category) => category.category_id);
}

function validateSourceBinding(record) {
  assert(record.source_failure_taxonomy_ref === taxonomyPath, "source_failure_taxonomy_ref mismatch");
  assert(record.source_review_pack_ref === reviewPackPath, "source_review_pack_ref mismatch");
  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "source review pack phase mismatch");
  assert(reviewPack.review_pack_boundaries.image_binary_read_performed === false, "source review pack must not read image binary");
}

function validateFalseFlags(container, context) {
  for (const flag of falseFlags) {
    assert(container?.[flag] === false, `${context} flag must remain false: ${flag}`);
  }
}

function validateHint(hint, requiredCategories) {
  assert(requiredCategories.includes(hint.taxonomy_category_id), `unknown taxonomy category: ${hint.taxonomy_category_id}`);
  assertNonEmptyStringArray(hint.prompt_constraints_to_add, "prompt_constraints_to_add missing");
  assertNonEmptyStringArray(hint.prompt_fragments_to_avoid, "prompt_fragments_to_avoid missing");
  assertNonEmptyString(hint.lighting_adjustment, "lighting_adjustment missing");
  assertNonEmptyString(hint.composition_adjustment, "composition_adjustment missing");
  assertNonEmptyString(hint.material_adjustment, "material_adjustment missing");
  assertNonEmptyString(hint.rationale, "rationale missing");
  assert(hint.generation_action_allowed === false, "generation_action_allowed must remain false");
  assert(hint.future_execution_allowed_by_this_hint === false, "future_execution_allowed_by_this_hint must remain false");
}

function validatePromptCorrectionHints(record) {
  assert(record && typeof record === "object", "prompt correction hints missing");
  assertNoSecretOrRawPath(record, "visual_prompt_correction_hints");
  assert(record.phase === phase, "phase mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.hint_mode === "dry_run_no_generation", "hint_mode must be dry_run_no_generation");
  validateSourceBinding(record);

  assert(sameStringList(record.required_hint_fields, requiredHintFields), "required_hint_fields mismatch");
  assert(Array.isArray(record.hints), "hints missing");
  const requiredCategories = taxonomyCategories();
  assert(record.hints.length === requiredCategories.length, "hint count must match taxonomy category count");
  const hintCategoryIds = record.hints.map((hint) => hint.taxonomy_category_id);
  assert(new Set(hintCategoryIds).size === hintCategoryIds.length, "duplicate taxonomy category hint found");
  assert(sameStringList(hintCategoryIds, requiredCategories), "hints must cover exact taxonomy categories");
  record.hints.forEach((hint) => validateHint(hint, requiredCategories));

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries?.image_binary_read_performed === false, "image_binary_read_performed must remain false");
  assert(record.boundaries?.real_executor_implemented_now === false, "real executor must remain unimplemented");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validatePromptCorrectionHints(candidate);
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
    validatePromptCorrectionHints(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid prompt correction hint fixture must fail");

  const cases = [
    expectFailure(validRecord, "missing_taxonomy_category_hint_fails", (candidate) => {
      candidate.hints = candidate.hints.filter((hint) => hint.taxonomy_category_id !== "lighting_failure");
    }),
    expectFailure(validRecord, "unknown_taxonomy_category_fails", (candidate) => {
      candidate.hints[0].taxonomy_category_id = "style_failure";
    }),
    expectFailure(validRecord, "duplicate_taxonomy_category_hint_fails", (candidate) => {
      candidate.hints[1].taxonomy_category_id = candidate.hints[0].taxonomy_category_id;
    }),
    expectFailure(validRecord, "missing_prompt_constraints_to_add_fails", (candidate) => {
      delete candidate.hints[0].prompt_constraints_to_add;
    }),
    expectFailure(validRecord, "empty_prompt_constraints_to_add_fails", (candidate) => {
      candidate.hints[0].prompt_constraints_to_add = [];
    }),
    expectFailure(validRecord, "missing_prompt_fragments_to_avoid_fails", (candidate) => {
      delete candidate.hints[0].prompt_fragments_to_avoid;
    }),
    expectFailure(validRecord, "empty_prompt_fragments_to_avoid_fails", (candidate) => {
      candidate.hints[0].prompt_fragments_to_avoid = [];
    }),
    expectFailure(validRecord, "missing_lighting_adjustment_fails", (candidate) => {
      candidate.hints[0].lighting_adjustment = "";
    }),
    expectFailure(validRecord, "missing_composition_adjustment_fails", (candidate) => {
      candidate.hints[0].composition_adjustment = "";
    }),
    expectFailure(validRecord, "missing_material_adjustment_fails", (candidate) => {
      candidate.hints[0].material_adjustment = "";
    }),
    expectFailure(validRecord, "taxonomy_source_drift_fails", (candidate) => {
      candidate.source_failure_taxonomy_ref = "tests/schema_examples/missing_taxonomy.example.json";
    }),
    expectFailure(validRecord, "review_pack_source_drift_fails", (candidate) => {
      candidate.source_review_pack_ref = "reports/visual_asset_eval_dry_run/missing.json";
    }),
    expectFailure(validRecord, "generation_action_allowed_true_fails", (candidate) => {
      candidate.hints[0].generation_action_allowed = true;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "vcp_memory_write_true_fails", (candidate) => {
      candidate.side_effects.VCP_memory_write_performed = true;
    }),
    expectFailure(validRecord, "accepted_sample_auto_promotion_true_fails", (candidate) => {
      candidate.side_effects.accepted_sample_auto_promotion = true;
    }),
    expectFailure(validRecord, "production_candidate_created_true_fails", (candidate) => {
      candidate.side_effects.production_candidate_created = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.hints[0].rationale = "C:\\private\\prompt.txt";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.hints[0].rationale = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    missing_required_field_caught: cases.some((item) => item.case_id === "missing_prompt_constraints_to_add_fails" && item.result === "caught"),
    generation_action_caught: cases.some((item) => item.case_id === "generation_action_allowed_true_fails" && item.result === "caught"),
    taxonomy_source_drift_caught: cases.some((item) => item.case_id === "taxonomy_source_drift_fails" && item.result === "caught")
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
    "prompt_constraints_to_add",
    "prompt_fragments_to_avoid",
    "lighting_adjustment",
    "composition_adjustment",
    "material_adjustment",
    "dry_run_no_generation",
    "image_generation_performed: false",
    "provider_call_performed: false",
    "VCP_memory_write_performed: false",
    "accepted_sample_auto_promotion: false",
    "production_candidate_created: false"
  ]) {
    assert(combined.includes(token), `prompt correction hint text surface missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_visual_prompt_correction_hints.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_3_review_to_prompt_correction_hint_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const validRecord = readJson(passFixturePath).visual_prompt_correction_hints;
  const invalidRecord = readJson(failFixturePath).visual_prompt_correction_hints;
  validatePromptCorrectionHints(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_prompt_correction_hints",
    phase,
    prompt_correction_doc_present: fs.existsSync(repoPath(docPath)),
    prompt_correction_schema_present: fs.existsSync(repoPath(schemaPath)),
    prompt_correction_fixture_present: fs.existsSync(repoPath(passFixturePath)),
    prompt_correction_fail_fixture_present: fs.existsSync(repoPath(failFixturePath)),
    source_failure_taxonomy_verified: true,
    source_review_pack_verified: true,
    required_hint_fields_present: true,
    prompt_constraints_to_add_present: true,
    prompt_fragments_to_avoid_present: true,
    lighting_adjustment_present: true,
    composition_adjustment_present: true,
    material_adjustment_present: true,
    hints_cover_all_taxonomy_categories: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    missing_required_field_caught: negativeCaseSummary.missing_required_field_caught,
    generation_action_caught: negativeCaseSummary.generation_action_caught,
    taxonomy_source_drift_caught: negativeCaseSummary.taxonomy_source_drift_caught,
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

module.exports = {
  validatePromptCorrectionHints,
  validateNegativeCases
};
