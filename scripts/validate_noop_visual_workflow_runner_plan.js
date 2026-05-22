#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_6_noop_visual_workflow_runner_plan";
const docPath = "docs/V0_4_6_NOOP_VISUAL_WORKFLOW_RUNNER_PLAN.md";
const schemaPath = "schemas/visual_noop_workflow_runner_plan.schema.yaml";
const passFixturePath = "tests/schema_examples/visual_noop_workflow_runner_plan.example.json";
const failFixturePath = "tests/schema_examples/visual_noop_workflow_runner_plan_fail.example.json";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const correctionHintPath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const sampleRegistryPath = "reports/visual_asset_eval_dry_run/v0_4_4_sample_registry_dry_run.json";
const consistencyPath = "tests/schema_examples/visual_eval_consistency_check.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const allowedNoopSteps = [
  "read_review_pack",
  "select_next_dry_run_action",
  "emit_would_apply_correction_hint",
  "emit_would_register_rejected_sample"
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
  assert(record.source_prompt_correction_hint_ref === correctionHintPath, "source_prompt_correction_hint_ref mismatch");
  assert(record.source_sample_registry_dry_run_ref === sampleRegistryPath, "source_sample_registry_dry_run_ref mismatch");
  assert(record.source_eval_consistency_check_ref === consistencyPath, "source_eval_consistency_check_ref mismatch");
}

function readSources() {
  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  const correctionHints = readJson(correctionHintPath).visual_prompt_correction_hints;
  const sampleRegistry = readJson(sampleRegistryPath).visual_sample_registry_dry_run;
  const consistency = readJson(consistencyPath).visual_eval_consistency_check;
  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "review pack phase mismatch");
  assert(correctionHints.phase === "v0_4_3_review_to_prompt_correction_hint", "prompt correction phase mismatch");
  assert(sampleRegistry.phase === "v0_4_4_sample_registry_dry_run", "sample registry phase mismatch");
  assert(consistency.phase === "v0_4_5_visual_eval_consistency_check", "consistency check phase mismatch");
  assert(consistency.invariants.same_asset_same_contract === true, "consistency same asset invariant must pass");
  assert(consistency.invariants.memory_suitability_stays_false === true, "consistency memory invariant must pass");
  assert(consistency.invariants.accepted_sample_eligible_stays_false === true, "consistency accepted invariant must pass");
  assert(consistency.invariants.production_candidate_eligible_stays_false === true, "consistency production invariant must pass");
  assert(consistency.invariants.failure_taxonomy_stable === true, "consistency taxonomy invariant must pass");
  return { reviewPack, correctionHints, sampleRegistry, consistency };
}

function validateRunnerPlan(record) {
  assert(record && typeof record === "object", "runner plan missing");
  assertNoSecretOrRawPath(record, "visual_noop_workflow_runner_plan");
  assert(record.phase === phase, "phase mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.runner_mode === "no_op_plan_only", "runner_mode must be no_op_plan_only");
  validateSourceRefs(record);
  const sources = readSources();
  assert(sources.reviewPack.review_summary.overall_result === "patch", "review pack result must stay patch for this no-op route");
  assert(sources.reviewPack.review_pack_boundaries.image_binary_read_performed === false, "review pack must not read image binary");
  assert(sameStringList(record.allowed_noop_steps, allowedNoopSteps), "allowed_noop_steps mismatch");
  assert(record.selected_next_dry_run_action === "would_apply_correction_hint_then_register_rejected_sample", "selected next dry-run action mismatch");

  const rejectedEntry = sources.sampleRegistry.rejected_registry_dry_run.entries[0];
  assert(record.would_apply_correction_hint.emit === true, "would_apply_correction_hint must emit");
  assert(record.would_apply_correction_hint.correction_hint_ref === correctionHintPath, "correction hint ref mismatch");
  assert(sameStringList(record.would_apply_correction_hint.source_failure_categories, rejectedEntry.failure_categories), "source failure categories must match rejected registry");
  assert(record.would_apply_correction_hint.actual_prompt_change_applied === false, "actual prompt change must remain false");
  assert(record.would_apply_correction_hint.generation_action_allowed === false, "generation action must remain false");
  assert(record.would_apply_correction_hint.future_execution_allowed_by_this_plan === false, "future execution must remain false");

  assert(record.would_register_rejected_sample.emit === true, "would_register_rejected_sample must emit");
  assert(record.would_register_rejected_sample.source_sample_registry_dry_run_ref === sampleRegistryPath, "sample registry ref mismatch");
  assert(record.would_register_rejected_sample.registry_write_performed === false, "registry write must remain false");
  assert(record.would_register_rejected_sample.actual_rejected_sample_created === false, "actual rejected sample must remain false");
  assert(record.would_register_rejected_sample.accepted_sample_promotion === false, "accepted sample promotion must remain false");
  assert(record.would_register_rejected_sample.production_candidate_created === false, "production candidate must remain false");

  assert(record.boundaries.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries.dry_run_only === true, "dry_run_only must be true");
  assert(record.boundaries.noop_only === true, "noop_only must be true");
  assert(record.boundaries.image_binary_read_performed === false, "image_binary_read_performed must remain false");
  assert(record.boundaries.real_executor_implemented_now === false, "real executor must remain unimplemented");
  assert(record.boundaries.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  validateFalseFlags(record.boundaries, "boundaries");
  validateFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRunnerPlan(candidate);
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
    validateRunnerPlan(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid no-op runner plan fixture must fail");

  const cases = [
    expectFailure(validRecord, "runner_mode_real_executor_fails", (candidate) => {
      candidate.runner_mode = "real_executor";
    }),
    expectFailure(validRecord, "missing_read_review_pack_step_fails", (candidate) => {
      candidate.allowed_noop_steps = candidate.allowed_noop_steps.filter((step) => step !== "read_review_pack");
    }),
    expectFailure(validRecord, "provider_step_fails", (candidate) => {
      candidate.allowed_noop_steps.push("call_provider");
    }),
    expectFailure(validRecord, "selected_generation_action_fails", (candidate) => {
      candidate.selected_next_dry_run_action = "generate_new_image";
    }),
    expectFailure(validRecord, "correction_hint_emit_false_fails", (candidate) => {
      candidate.would_apply_correction_hint.emit = false;
    }),
    expectFailure(validRecord, "correction_hint_ref_drift_fails", (candidate) => {
      candidate.would_apply_correction_hint.correction_hint_ref = "tests/schema_examples/missing_hint.json";
    }),
    expectFailure(validRecord, "failure_category_drift_fails", (candidate) => {
      candidate.would_apply_correction_hint.source_failure_categories = ["unknown_failure"];
    }),
    expectFailure(validRecord, "actual_prompt_change_true_fails", (candidate) => {
      candidate.would_apply_correction_hint.actual_prompt_change_applied = true;
    }),
    expectFailure(validRecord, "generation_action_true_fails", (candidate) => {
      candidate.would_apply_correction_hint.generation_action_allowed = true;
    }),
    expectFailure(validRecord, "future_execution_true_fails", (candidate) => {
      candidate.would_apply_correction_hint.future_execution_allowed_by_this_plan = true;
    }),
    expectFailure(validRecord, "registry_write_true_fails", (candidate) => {
      candidate.would_register_rejected_sample.registry_write_performed = true;
    }),
    expectFailure(validRecord, "actual_rejected_sample_created_true_fails", (candidate) => {
      candidate.would_register_rejected_sample.actual_rejected_sample_created = true;
    }),
    expectFailure(validRecord, "accepted_sample_promotion_true_fails", (candidate) => {
      candidate.would_register_rejected_sample.accepted_sample_promotion = true;
    }),
    expectFailure(validRecord, "production_candidate_created_true_fails", (candidate) => {
      candidate.would_register_rejected_sample.production_candidate_created = true;
    }),
    expectFailure(validRecord, "noop_only_false_fails", (candidate) => {
      candidate.boundaries.noop_only = false;
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
    expectFailure(validRecord, "runtime_call_true_fails", (candidate) => {
      candidate.side_effects.runtime_call_performed = true;
    }),
    expectFailure(validRecord, "secret_value_read_true_fails", (candidate) => {
      candidate.side_effects.secret_value_read_performed = true;
    }),
    expectFailure(validRecord, "push_l2_true_fails", (candidate) => {
      candidate.boundaries.Push_L2_exercised = true;
    }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => {
      candidate.runner_plan_id = "C:\\private\\runner.json";
    }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => {
      candidate.would_apply_correction_hint.reason = ".env.local";
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught"),
    real_executor_caught: cases.some((item) => item.case_id === "runner_mode_real_executor_fails" && item.result === "caught"),
    generation_action_caught: cases.some((item) => item.case_id === "generation_action_true_fails" && item.result === "caught"),
    registry_write_caught: cases.some((item) => item.case_id === "registry_write_true_fails" && item.result === "caught"),
    runtime_caught: cases.some((item) => item.case_id === "runtime_call_true_fails" && item.result === "caught")
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
    "read_review_pack",
    "select_next_dry_run_action",
    "would_apply_correction_hint",
    "would_register_rejected_sample",
    "no_op_plan_only",
    "runtime_call_performed"
  ]) {
    assert(combined.includes(token), `no-op runner plan text surface missing token: ${token}`);
  }
  assert(mvp.includes("scripts/validate_noop_visual_workflow_runner_plan.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_6_noop_visual_workflow_runner_plan_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  const validRecord = readJson(passFixturePath).visual_noop_workflow_runner_plan;
  const invalidRecord = readJson(failFixturePath).visual_noop_workflow_runner_plan;
  validateRunnerPlan(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_noop_visual_workflow_runner_plan",
    phase,
    noop_runner_doc_present: fs.existsSync(repoPath(docPath)),
    noop_runner_schema_present: fs.existsSync(repoPath(schemaPath)),
    noop_runner_fixture_present: fs.existsSync(repoPath(passFixturePath)),
    noop_runner_fail_fixture_present: fs.existsSync(repoPath(failFixturePath)),
    source_review_pack_verified: true,
    source_prompt_correction_hint_verified: true,
    source_sample_registry_dry_run_verified: true,
    source_eval_consistency_check_verified: true,
    read_review_pack_allowed: true,
    select_next_dry_run_action_allowed: true,
    would_apply_correction_hint_emitted: true,
    would_register_rejected_sample_emitted: true,
    actual_prompt_change_applied: false,
    registry_write_performed: false,
    actual_rejected_sample_created: false,
    invalid_fixture_failure_caught: negativeCaseSummary.invalid_fixture_failure_caught,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught,
    real_executor_caught: negativeCaseSummary.real_executor_caught,
    generation_action_caught: negativeCaseSummary.generation_action_caught,
    registry_write_caught: negativeCaseSummary.registry_write_caught,
    runtime_caught: negativeCaseSummary.runtime_caught,
    metadata_only: true,
    dry_run_only: true,
    noop_only: true,
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
  validateRunnerPlan,
  validateNegativeCases
};
