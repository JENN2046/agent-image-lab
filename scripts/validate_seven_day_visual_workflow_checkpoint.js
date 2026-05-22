#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_4_7_seven_day_visual_workflow_checkpoint";
const docPath = "docs/V0_4_7_SEVEN_DAY_VISUAL_WORKFLOW_CHECKPOINT.md";
const routeOptionsPath = "docs/next_14_day_route_options.md";
const reviewPackPath = "reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json";
const taxonomyPath = "tests/schema_examples/visual_failure_taxonomy.example.json";
const correctionHintPath = "tests/schema_examples/visual_prompt_correction_hint.example.json";
const sampleRegistryPath = "reports/visual_asset_eval_dry_run/v0_4_4_sample_registry_dry_run.json";
const consistencyPath = "tests/schema_examples/visual_eval_consistency_check.example.json";
const noopRunnerPath = "tests/schema_examples/visual_noop_workflow_runner_plan.example.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

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

function validateSourceArtifacts() {
  const reviewPack = readJson(reviewPackPath).visual_asset_review_pack;
  const taxonomy = readJson(taxonomyPath).visual_failure_taxonomy;
  const correctionHints = readJson(correctionHintPath).visual_prompt_correction_hints;
  const sampleRegistry = readJson(sampleRegistryPath).visual_sample_registry_dry_run;
  const consistency = readJson(consistencyPath).visual_eval_consistency_check;
  const noopRunner = readJson(noopRunnerPath).visual_noop_workflow_runner_plan;
  const records = { reviewPack, taxonomy, correctionHints, sampleRegistry, consistency, noopRunner };
  assertNoSecretOrRawPath(records, "seven_day_visual_workflow_checkpoint_sources");

  assert(reviewPack.phase === "v0_4_1_visual_asset_review_pack", "review pack phase mismatch");
  assert(taxonomy.phase === "v0_4_2_visual_failure_taxonomy", "failure taxonomy phase mismatch");
  assert(correctionHints.phase === "v0_4_3_review_to_prompt_correction_hint", "prompt correction hint phase mismatch");
  assert(sampleRegistry.phase === "v0_4_4_sample_registry_dry_run", "sample registry dry-run phase mismatch");
  assert(consistency.phase === "v0_4_5_visual_eval_consistency_check", "consistency check phase mismatch");
  assert(noopRunner.phase === "v0_4_6_noop_visual_workflow_runner_plan", "no-op runner phase mismatch");

  assert(reviewPack.review_pack_boundaries.image_binary_read_performed === false, "review pack must not read image binary");
  assert(reviewPack.review_pack_boundaries.image_generation_performed === false, "review pack must not generate image");
  assert(reviewPack.review_pack_boundaries.VCP_memory_write_performed === false, "review pack must not write memory");
  assert(reviewPack.review_pack_boundaries.real_executor_implemented_now === false, "review pack must not implement executor");
  assert(taxonomy.taxonomy_boundaries.image_generation_performed === false, "taxonomy must not generate image");
  assert(correctionHints.boundaries.image_generation_performed === false, "prompt hints must not generate image");
  assert(sampleRegistry.registry_boundaries.image_generation_performed === false, "sample registry must not generate image");
  assert(consistency.boundaries.image_binary_read_performed === false, "consistency must not read image binary");
  assert(noopRunner.boundaries.image_generation_performed === false, "no-op runner must not generate image");
  assert(noopRunner.boundaries.VCP_memory_write_performed === false, "no-op runner must not write memory");
  assert(noopRunner.boundaries.real_executor_implemented_now === false, "no-op runner must not implement executor");

  return records;
}

function validateTextSurfaces() {
  const doc = read(docPath);
  const routeOptions = read(routeOptionsPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const combined = `${doc}\n${routeOptions}`;
  for (const token of [
    phase,
    "review_pack exists: true",
    "failure_taxonomy exists: true",
    "prompt_correction_hint exists: true",
    "sample_registry_dry_run exists: true",
    "consistency_check exists: true",
    "image_generation: false",
    "memory_write: false",
    "real_executor: false"
  ]) {
    assert(combined.includes(token), `checkpoint text surface missing token: ${token}`);
  }
  assert(routeOptions.includes("Option A") && routeOptions.includes("Option B") && routeOptions.includes("Option C"), "route options must define three options");
  assert(mvp.includes("scripts/validate_seven_day_visual_workflow_checkpoint.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_4_7_seven_day_visual_workflow_checkpoint_slice"), "exact slice wiring missing");
}

function main() {
  validateTextSurfaces();
  validateSourceArtifacts();

  const output = {
    passed: true,
    validator: "validate_seven_day_visual_workflow_checkpoint",
    phase,
    checkpoint_doc_present: fs.existsSync(repoPath(docPath)),
    next_14_day_route_options_present: fs.existsSync(repoPath(routeOptionsPath)),
    review_pack_exists: fs.existsSync(repoPath(reviewPackPath)),
    failure_taxonomy_exists: fs.existsSync(repoPath(taxonomyPath)),
    prompt_correction_hint_exists: fs.existsSync(repoPath(correctionHintPath)),
    sample_registry_dry_run_exists: fs.existsSync(repoPath(sampleRegistryPath)),
    consistency_check_exists: fs.existsSync(repoPath(consistencyPath)),
    noop_runner_plan_exists: fs.existsSync(repoPath(noopRunnerPath)),
    visual_judgment_loop_closed: true,
    image_generation: false,
    memory_write: false,
    real_executor: false,
    provider_call_performed: false,
    image_generation_performed: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    production_candidate_created: false,
    accepted_sample_auto_promotion: false,
    memory_seed_promoted: false,
    Push_L2_exercised: false,
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
