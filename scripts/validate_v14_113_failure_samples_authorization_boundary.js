#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const codexAcceptedSampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";

const files = {
  registry: "failure_samples/failure_registry.yaml",
  taxonomy: "failure_samples/failure_taxonomy.yaml",
  legacyValidator: "scripts/validate_v7_33_failure_registry.js",
  goalGate: "docs/v14_108_three_month_visual_control_layer_goal_alignment_gate.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  productionGate: "docs/v14_112_production_candidate_gate_local_policy_refresh.md",
};

const results = [];
const errors = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

for (const [label, relativePath] of Object.entries(files)) {
  addResult(`${label}_exists`, exists(relativePath), relativePath);
}

const registry = readText(files.registry);
const taxonomy = readText(files.taxonomy);
const legacyValidator = readText(files.legacyValidator);
const goalGate = readText(files.goalGate);
const runState = readText(files.runState);
const taskQueue = readText(files.taskQueue);
const productionGate = readText(files.productionGate);
const currentSurfaces = [goalGate, runState, taskQueue, productionGate].join("\n");

addResult("failure_registry_is_historical_v7_33", registry.includes("updated_by_phase: v7_33"));
addResult("failure_registry_is_registry_only", registry.includes("registry_only: true"));
addResult("failure_registry_no_images_committed", registry.includes("image_files_committed_to_git: false"));
addResult("failure_registry_blocks_memory_write", registry.includes("memory_write_allowed: false"));
addResult("failure_registry_blocks_daily_note", registry.includes("daily_note_write_allowed: false"));
addResult("failure_registry_has_expected_count", registry.includes("failure_count: 3"));
addResult("failure_registry_has_existing_failure_ids", [
  "failure_tennis_wallet_v7_21_001",
  "failure_french_summer_rattan_bag_v7_26_001",
  "failure_french_summer_rattan_bag_v7_29_001",
].every((value) => registry.includes(value)));

addResult("failure_taxonomy_has_blocking_types", [
  "watermark_or_generated_mark_present",
  "clean_image_corners_failed",
  "api_payload_missing_watermark_false",
  "prompt_watermark_control_insufficient",
].every((value) => taxonomy.includes(value)));
addResult("failure_taxonomy_has_correction_strategy", taxonomy.includes("correction_strategy:"));
addResult("legacy_failure_validator_present", legacyValidator.includes("failure_samples/failure_registry.yaml"));
addResult("legacy_failure_validator_wired_to_mvp", legacyValidator.includes("validate_mvp_includes_v7_33"));

addResult("goal_gate_requires_separate_failure_samples_authorization", goalGate.includes("failure_samples_write_requires_separate_authorization: true"));
addResult("run_state_blocks_failure_samples_without_authorization", runState.includes("failure_samples_write_allowed_without_separate_authorization: false"));
addResult("task_queue_blocks_failure_samples_without_authorization", taskQueue.includes("failure_samples_write_allowed_without_separate_authorization: false"));
addResult("production_gate_explicitly_does_not_write_failure_samples", productionGate.includes("failure_samples_write: false"));
addResult("codex_accepted_sample_not_in_failure_registry", !registry.includes(codexAcceptedSampleId));
addResult("no_failure_samples_auto_write_true_in_current_surfaces", !currentSurfaces.includes("failure_samples_write_allowed_without_separate_authorization: true"));
addResult("no_failure_samples_write_performed_true_in_current_surfaces", !currentSurfaces.includes("failure_samples_write_performed: true"));
addResult("no_failure_registry_auto_promote_marker", !registry.includes("auto_register_without_authorization: true"));

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_113_failure_samples_authorization_boundary",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  existing_failure_registry_preserved: true,
  failure_samples_write_allowed_without_separate_authorization: false,
  failure_samples_write_performed: false,
  failure_samples_registry_write_performed: false,
  failure_samples_taxonomy_write_performed: false,
  codex_accepted_sample_written_to_failure_registry: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  image_binary_included: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
