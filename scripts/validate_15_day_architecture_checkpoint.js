#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_3_15_fifteen_day_architecture_checkpoint";
const checkpointPath = "docs/V0_3_15_FIFTEEN_DAY_ARCHITECTURE_CHECKPOINT.md";
const routeOptionsPath = "next_30_day_route_options.md";
const roadmapPath = "docs/00_project_roadmap.md";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";

const requiredFiles = [
  "docs/V0_3_15_FIFTEEN_DAY_ARCHITECTURE_CHECKPOINT.md",
  "next_30_day_route_options.md",
  "docs/PUSH_L1_USAGE_RULE.md",
  "docs/PUSH_L1_REGRESSION_CASES.md",
  "tests/schema_examples/push_l1_status_sync_pass.example.json",
  "tests/schema_examples/push_l1_forbidden_paths_fail.example.json",
  "docs/VISUAL_ASSET_EVAL_V0_1.md",
  "schemas/visual_asset_review_report.schema.yaml",
  "tests/schema_examples/visual_asset_review_report.example.json",
  "scripts/validate_visual_asset_eval_v0_1.js",
  "docs/VISUAL_SAMPLE_MEMORY_POLICY.md",
  "schemas/accepted_sample_record.schema.yaml",
  "schemas/rejected_sample_record.schema.yaml",
  "scripts/validate_visual_sample_memory_policy.js",
  "docs/V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_GATE.md",
  "scripts/validate_bounded_l4_executor_preflight_contract.js"
];

const requiredDimensions = [
  "composition",
  "lighting",
  "material_realism",
  "product_fidelity",
  "commercial_fitness",
  "AI_artifact_risk",
  "memory_suitability"
];

const requiredQuestions = [
  "why_did_it_pass",
  "why_was_it_rejected",
  "failed_dimension",
  "commercial_use_suitability",
  "accepted_sample_eligibility",
  "memory_seed_eligibility"
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

function fileExists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function requireTokens(text, tokens, label) {
  for (const token of tokens) {
    assert(text.includes(token), `${label} missing token: ${token}`);
  }
}

function assertNoForbiddenClaims(text) {
  const forbiddenTruthClaims = [
    "Push_L2_auto_push_test_performed: true",
    "real_executor_implemented_now: true",
    "provider_call_performed: true",
    "image_generation_performed: true",
    "VCP_memory_write_performed: true",
    "DailyNote_write_performed: true",
    "production_candidate_created: true",
    "accepted_sample_auto_promotion: true",
    "package_dependency_change_performed: true",
    "Push_L1_widened_to_broad_docs: true"
  ];
  for (const token of forbiddenTruthClaims) {
    assert(!text.includes(token), `Forbidden completion claim found: ${token}`);
  }
}

function main() {
  for (const file of requiredFiles) {
    assert(fileExists(file), `Required 15-day evidence file missing: ${file}`);
  }

  const checkpoint = read(checkpointPath);
  const routeOptions = read(routeOptionsPath);
  const roadmap = read(roadmapPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const combined = `${checkpoint}\n${routeOptions}\n${roadmap}`;

  requireTokens(checkpoint, [
    phase,
    "Push_L1_green_auto",
    "proven_and_regression_guarded",
    "f26e9478c94c7a3dcfc4ba93b6a3efac806ebece",
    "Push_L2_amber_auto_guarded",
    "still_defined_not_proven",
    "Push_L3_red_manual",
    "Visual Asset Eval v0.1",
    "sample_memory_v0_1",
    "schema_only_defined",
    "executor_preflight_contract: defined",
    "real_executor_implemented_now: false",
    "no-op executor simulator only if reviewed"
  ], "checkpoint");

  requireTokens(checkpoint, requiredDimensions, "checkpoint dimensions");
  requireTokens(checkpoint, requiredQuestions, "checkpoint questions");
  requireTokens(checkpoint, [
    "accepted_gate_id",
    "human_accepted: true",
    "review_report_ref",
    "visual_traits",
    "reuse_conditions",
    "rejection_reason",
    "failure_taxonomy",
    "correction_hint",
    "do_not_reuse_conditions"
  ], "checkpoint sample memory requirements");

  requireTokens(combined, [
    "Push_L2_auto_push_test_performed: false",
    "real_executor_implemented_now: false",
    "provider_call_performed: false",
    "image_generation_performed: false",
    "VCP_memory_write_performed: false",
    "DailyNote_write_performed: false",
    "production_candidate_created: false",
    "accepted_sample_auto_promotion: false",
    "package_dependency_change_performed: false",
    "Push_L1_widened_to_broad_docs: false"
  ], "boundary evidence");
  assertNoForbiddenClaims(`${checkpoint}\n${routeOptions}`);

  requireTokens(routeOptions, [
    "Route A: No-Op Executor Simulator",
    "Route B: Visual Asset Eval Dataset Fixtures",
    "Route C: Sample Memory Policy Expansion",
    "Route D: Push_L1 Maintenance Only",
    "Push_L2 should remain paused",
    "real executor",
    "Not allowed"
  ], "route options");

  assert(mvp.includes("scripts/validate_15_day_architecture_checkpoint.js"), "MVP validator wiring missing");
  assert(slice.includes("v0_3_15_fifteen_day_architecture_checkpoint_slice"), "exact slice wiring missing");

  const output = {
    passed: true,
    validator: "validate_15_day_architecture_checkpoint",
    phase,
    Push_L1_green_auto: "proven_and_regression_guarded",
    Push_L2_amber_auto_guarded: "still_defined_not_proven",
    Push_L3_red_manual: "preserved",
    visual_asset_eval_v0_1_defined: true,
    review_report_schema_defined: true,
    accepted_rejected_sample_schema_defined: true,
    memory_write_still_blocked: true,
    executor_preflight_contract_defined: true,
    real_executor_implemented_now: false,
    no_op_executor_simulator_next_only_if_reviewed: true,
    route_options_present: true,
    Push_L2_auto_push_test_performed: false,
    provider_call_performed: false,
    image_generation_performed: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    production_candidate_created: false,
    accepted_sample_auto_promotion: false,
    package_dependency_change_performed: false,
    Push_L1_widened_to_broad_docs: false,
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
