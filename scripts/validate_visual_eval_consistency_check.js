#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_5_visual_eval_consistency_check";
const docPath = "docs/V0_4_5_VISUAL_EVAL_CONSISTENCY_CHECK.md";
const schemaPath = "schemas/visual_eval_consistency_check.schema.yaml";
const passFixturePath = "tests/schema_examples/visual_eval_consistency_check.example.json";
const failFixturePath = "tests/schema_examples/visual_eval_consistency_check_fail.example.json";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const taxonomyPath = "tests/schema_examples/visual_failure_taxonomy.example.json";
const correctionHintPath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const sampleRegistryPath = "reports/visual_asset_eval_dry_run/v0_4_4_sample_registry_dry_run.json";
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

function validateFalseFlags(container, context) {
  for (const flag of falseFlags) {
    assert(container?.[flag] === false, `${context} flag must remain false: ${flag}`);
  }
}

function validateSourceRefs(record) {
  assert(record.source_review_pack_ref === reviewPackPath, "source_review_pack_ref mismatch");
  assert(record.source_failure_taxonomy_ref === taxonomyPath, "source_failure_taxonomy_ref mismatch");
  assert(record.source_prompt_correction_hint_ref === correctionHintPath, "source_prompt_correction_hint_ref mismatch");
  assert(record.source_sample_registry_dry_run_ref === sampleRegistryPath, "source_sample_registry_dry_run_ref mismatch");
}

function readSources() {
  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  const taxonomy = readJson(taxonomyPath).visual_failure_taxonomy;
  const correctionHints = readJson(correctionHintPath).visual_prompt_correction_hints;
  const sampleRegistry = readJson(sampleRegistryPath).visual_sample_registry_dry_run;
  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "source review pack phase mismatch");
  assert(taxonomy.phase === "v0_4_2_visual_failure_taxonomy", "source taxonomy phase mismatch");
  assert(correctionHints.phase === "v0_4_3_review_to_prompt_correction_hint", "source correction hint phase mismatch");
  assert(sampleRegistry.phase === "v0_4_4_sample_registry_dry_run", "source sample registry phase mismatch");
  return { reviewPack, taxonomy, correctionHints, sampleRegistry };
}

function validateStableTaxonomy(record, taxonomy, correctionHints, sampleRegistry) {
  assert(record.invariants.failure_taxonomy_stable === true, "failure_taxonomy_stable must be true");
  assert(sameStringList(record.stable_failure_taxonomy, requiredCategories), "stable_failure_taxonomy must match required categories");
  const taxonomyCategories = taxonomy.categories.map((category) => category.category_id);
  assert(sameStringList(taxonomy.required_categories, requiredCategories), "taxonomy required categories drifted");
  assert(sameStringList(taxonomyCategories, requiredCategories), "taxonomy categories drifted");
  assert(new Set(taxonomyCategories).size === taxonomyCategories.length, "duplicate taxonomy category found");
  assert(sameStringList(correctionHints.hints.map((hint) => hint.taxonomy_category_id), requiredCategories), "prompt hint taxonomy coverage drifted");
  for (const hint of correctionHints.hints) {
    assert(hint.generation_action_allowed === false, "prompt hint generation action must remain false");
    assert(hint.future_execution_allowed_by_this_hint === false, "prompt hint future execution must remain false");
  }
  for (const entry of sampleRegistry.rejected_registry_dry_run.entries) {
    entry.failure_categories.forEach((category) => assert(requiredCategories.includes(category), `rejected registry category drifted: ${category}`));
  }
}

function validateSourceContractSnapshot(record, sources) {
  const { reviewPack, sampleRegistry } = sources;
  const acceptedEntry = sampleRegistry.accepted_registry_dry_run.entries[0];
  const rejectedEntry = sampleRegistry.rejected_registry_dry_run.entries[0];
  const snapshot = record.source_contract_snapshot;

  assert(snapshot.review_pack_result === reviewPack.review_summary.overall_result, "review result snapshot drifted");
  assert(snapshot.review_pack_memory_suitability_value === false, "review pack memory suitability snapshot must be false");
  assert(reviewPack.structured_review_report.memory_suitability.value === false, "review pack memory suitability must remain false");
  assert(snapshot.review_pack_accepted_sample_eligible === false, "review pack accepted_sample_eligible snapshot must be false");
  assert(reviewPack.review_pack_decision.accepted_sample_eligible === false, "review pack accepted_sample_eligible must remain false");
  assert(snapshot.review_pack_production_candidate_eligible === false, "review pack production_candidate_eligible snapshot must be false");
  assert(reviewPack.review_pack_decision.production_candidate_eligible === false, "review pack production_candidate_eligible must remain false");
  assert(snapshot.sample_registry_accepted_sample_eligible === false, "sample registry accepted_sample_eligible snapshot must be false");
  assert(acceptedEntry.accepted_sample_eligible === false, "sample registry accepted_sample_eligible must remain false");
  assert(snapshot.sample_registry_actual_accepted_sample_created === false, "actual accepted sample snapshot must be false");
  assert(acceptedEntry.actual_accepted_sample_created === false, "actual accepted sample must remain false");
  assert(snapshot.sample_registry_actual_rejected_sample_created === false, "actual rejected sample snapshot must be false");
  assert(rejectedEntry.actual_rejected_sample_created === false, "actual rejected sample must remain false");
  assert(snapshot.sample_registry_accepted_sample_promotion === false, "accepted sample promotion snapshot must be false");
  assert(acceptedEntry.accepted_sample_promotion === false, "accepted sample promotion must remain false");
  assert(snapshot.sample_registry_memory_write_performed === false, "sample registry memory write snapshot must be false");
  assert(sampleRegistry.registry_boundaries.VCP_memory_write_performed === false, "sample registry memory write must remain false");
  assert(snapshot.sample_registry_daily_note_write_performed === false, "sample registry DailyNote snapshot must be false");
  assert(sampleRegistry.registry_boundaries.DailyNote_write_performed === false, "sample registry DailyNote write must remain false");
  assert(snapshot.sample_registry_production_candidate_created === false, "sample registry production snapshot must be false");
  assert(sampleRegistry.registry_boundaries.production_candidate_created === false, "sample registry production candidate must remain false");
  assert(snapshot.prompt_hint_generation_action_allowed === false, "prompt hint generation snapshot must be false");
}

function validateAssetConsistency(record, sources) {
  const { reviewPack, sampleRegistry } = sources;
  const asset = record.checked_asset;
  const reviewAssetId = reviewPack.asset_ref.asset_id;
  const acceptedAssetId = sampleRegistry.accepted_registry_dry_run.entries[0].source_asset_id;
  const rejectedAssetId = sampleRegistry.rejected_registry_dry_run.entries[0].source_asset_id;
  assert(record.invariants.same_asset_same_contract === true, "same_asset_same_contract invariant must be true");
  assert(asset.same_asset_same_contract === true, "checked asset same_asset_same_contract must be true");
  assert(asset.asset_id === reviewAssetId, "checked asset id must match review pack");
  assert(asset.review_pack_asset_id === reviewAssetId, "review pack asset id drifted");
  assert(asset.accepted_registry_asset_id === acceptedAssetId, "accepted registry asset id drifted");
  assert(asset.rejected_registry_asset_id === rejectedAssetId, "rejected registry asset id drifted");
  assert(reviewAssetId === acceptedAssetId && reviewAssetId === rejectedAssetId, "source asset ids must match");
}

function validateInvariants(record) {
  assert(record.phase === phase, "phase mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.consistency_mode === "dry_run_metadata_consistency", "consistency_mode mismatch");
  assert(record.invariants.memory_suitability_stays_false === true, "memory_suitability_stays_false must be true");
  assert(record.invariants.accepted_sample_eligible_stays_false === true, "accepted_sample_eligible_stays_false must be true");
  assert(record.invariants.production_candidate_eligible_stays_false === true, "production_candidate_eligible_stays_false must be true");
}

function validateBoundaries(record) {
  assert(record.boundaries.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries.image_binary_read_performed === false, "image_binary_read_performed must remain false");
  assert(record.boundaries.real_executor_implemented_now === false, "real executor must remain unimplemented");
  assert(record.boundaries.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function validateVisualEvalConsistencyCheck(record) {
  assert(record && typeof record === "object", "visual eval consistency check missing");
  assertNoSecretOrRawPath(record, "visual_eval_consistency_check");
  validateSourceRefs(record);
  validateInvariants(record);
  const sources = readSources();
  validateAssetConsistency(record, sources);
  validateStableTaxonomy(record, sources.taxonomy, sources.correctionHints, sources.sampleRegistry);
  validateSourceContractSnapshot(record, sources);
  validateBoundaries(record);
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateVisualEvalConsistencyCheck(candidate);
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
    validateVisualEvalConsistencyCheck(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid visual eval consistency fixture must fail");

  const cases = [
    expectFailure(validRecord, "review_pack_source_ref_drift_fails", (candidate) => {
      candidate.source_review_pack_ref = "reports/visual_asset_eval_dry_run/missing.json";
    }),
    expectFailure(validRecord, "same_asset_same_contract_false_fails", (candidate) => {
      candidate.invariants.same_asset_same_contract = false;
    }),
    expectFailure(validRecord, "checked_asset_contract_false_fails", (candidate) => {
      candidate.checked_asset.same_asset_same_contract = false;
    }),
    expectFailure(validRecord, "review_pack_asset_id_mismatch_fails", (candidate) => {
      candidate.checked_asset.review_pack_asset_id = "different-asset";
    }),
    expectFailure(validRecord, "accepted_registry_asset_id_mismatch_fails", (candidate) => {
      candidate.checked_asset.accepted_registry_asset_id = "different-asset";
    }),
    expectFailure(validRecord, "memory_suitability_invariant_false_fails", (candidate) => {
      candidate.invariants.memory_suitability_stays_false = false;
    }),
    expectFailure(validRecord, "memory_suitability_snapshot_true_fails", (candidate) => {
      candidate.source_contract_snapshot.review_pack_memory_suitability_value = true;
    }),
    expectFailure(validRecord, "accepted_sample_eligible_invariant_false_fails", (candidate) => {
      candidate.invariants.accepted_sample_eligible_stays_false = false;
    }),
    expectFailure(validRecord, "accepted_sample_eligible_snapshot_true_fails", (candidate) => {
      candidate.source_contract_snapshot.review_pack_accepted_sample_eligible = true;
    }),
    expectFailure(validRecord, "production_candidate_eligible_invariant_false_fails", (candidate) => {
      candidate.invariants.production_candidate_eligible_stays_false = false;
    }),
    expectFailure(validRecord, "production_candidate_eligible_snapshot_true_fails", (candidate) => {
      candidate.source_contract_snapshot.review_pack_production_candidate_eligible = true;
    }),
    expectFailure(validRecord, "failure_taxonomy_stable_false_fails", (candidate) => {
      candidate.invariants.failure_taxonomy_stable = false;
    }),
    expectFailure(validRecord, "missing_taxonomy_category_fails", (candidate) => {
      candidate.stable_failure_taxonomy = candidate.stable_failure_taxonomy.filter((category) => category !== "lighting_failure");
    }),
    expectFailure(validRecord, "unknown_taxonomy_category_fails", (candidate) => {
      candidate.stable_failure_taxonomy[0] = "unknown_failure";
    }),
    expectFailure(validRecord, "duplicate_taxonomy_category_fails", (candidate) => {
      candidate.stable_failure_taxonomy[1] = candidate.stable_failure_taxonomy[0];
    }),
    expectFailure(validRecord, "sample_registry_memory_write_snapshot_true_fails", (candidate) => {
      candidate.source_contract_snapshot.sample_registry_memory_write_performed = true;
    }),
    expectFailure(validRecord, "prompt_hint_generation_snapshot_true_fails", (candidate) => {
      candidate.source_contract_snapshot.prompt_hint_generation_action_allowed = true;
    }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => {
      candidate.side_effects.provider_call_performed = true;
    }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => {
      candidate.side_effects.image_generation_performed = true;
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
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => {
      candidate.side_effects.runtime_call_performed = true;
    }),
    expectFailure(validRecord, "secret_value_read_true_fails", (candidate) => {
      candidate.side_effects.secret_value_read_performed = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.checked_asset.asset_id = "C:\\private\\sample.png";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.consistency_check_id = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    same_asset_mismatch_caught: cases.some((item) => item.case_id === "review_pack_asset_id_mismatch_fails" && item.result === "caught"),
    memory_suitability_drift_caught: cases.some((item) => item.case_id === "memory_suitability_snapshot_true_fails" && item.result === "caught"),
    accepted_sample_eligible_drift_caught: cases.some((item) => item.case_id === "accepted_sample_eligible_snapshot_true_fails" && item.result === "caught"),
    production_candidate_eligible_drift_caught: cases.some((item) => item.case_id === "production_candidate_eligible_snapshot_true_fails" && item.result === "caught"),
    failure_taxonomy_drift_caught: cases.some((item) => item.case_id === "unknown_taxonomy_category_fails" && item.result === "caught")
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
    "same_asset_same_contract",
    "memory_suitability_stays_false",
    "accepted_sample_eligible_stays_false",
    "production_candidate_eligible_stays_false",
    "failure_taxonomy_stable",
    "image_binary_read_performed"
  ]) {
    assert(combined.includes(token), `visual eval consistency text surface missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_visual_eval_consistency_check.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_5_visual_eval_consistency_check_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const validRecord = readJson(passFixturePath).visual_eval_consistency_check;
  const invalidRecord = readJson(failFixturePath).visual_eval_consistency_check;
  validateVisualEvalConsistencyCheck(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_visual_eval_consistency_check",
    phase,
    consistency_doc_present: fs.existsSync(repoPath(docPath)),
    consistency_schema_present: fs.existsSync(repoPath(schemaPath)),
    consistency_fixture_present: fs.existsSync(repoPath(passFixturePath)),
    consistency_fail_fixture_present: fs.existsSync(repoPath(failFixturePath)),
    source_review_pack_verified: true,
    source_failure_taxonomy_verified: true,
    source_prompt_correction_hint_verified: true,
    source_sample_registry_dry_run_verified: true,
    same_asset_same_contract: true,
    memory_suitability_stays_false: true,
    accepted_sample_eligible_stays_false: true,
    production_candidate_eligible_stays_false: true,
    failure_taxonomy_stable: true,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    same_asset_mismatch_caught: negativeCaseSummary.same_asset_mismatch_caught,
    memory_suitability_drift_caught: negativeCaseSummary.memory_suitability_drift_caught,
    accepted_sample_eligible_drift_caught: negativeCaseSummary.accepted_sample_eligible_drift_caught,
    production_candidate_eligible_drift_caught: negativeCaseSummary.production_candidate_eligible_drift_caught,
    failure_taxonomy_drift_caught: negativeCaseSummary.failure_taxonomy_drift_caught,
    metadata_only: true,
    dry_run_only: true,
    image_binary_read_performed: false,
    Push_L2_exercised: false,
    real_executor_implemented_now: false,
    provider_call_performed: false,
    image_generation_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
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
  validateVisualEvalConsistencyCheck,
  validateNegativeCases
};
