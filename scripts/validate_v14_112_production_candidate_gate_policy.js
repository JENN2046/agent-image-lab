#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const acceptedSampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const codexPlanToken = "womens_resort_relaxed_knit_final_v2";

const files = {
  registry: "accepted_samples/accepted_sample_registry.yaml",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  closeout: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  memoryDraft: "tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml",
  productionPlan: "production/plans/french_summer_rattan_bag_v3_production_candidate_001_plan.yaml",
  productionReview: "production/reviews/v7_53_french_summer_rattan_bag_v3_production_candidate_001_review.md",
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

function collectText(relativeDirectory) {
  const directory = repoPath(relativeDirectory);
  const chunks = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(md|ya?ml|json|txt)$/i.test(entry.name)) {
        chunks.push(fs.readFileSync(full, "utf8"));
      }
    }
  };
  walk(directory);
  return chunks.join("\n--- production-file-boundary ---\n");
}

function sampleBlock(registry, sampleId) {
  const start = registry.indexOf(`sample_id: ${sampleId}`);
  if (start === -1) return "";
  const next = registry.indexOf("\n    - sample_id:", start + 1);
  return registry.slice(start, next === -1 ? registry.length : next);
}

for (const [label, relativePath] of Object.entries(files)) {
  addResult(`${label}_exists`, exists(relativePath), relativePath);
}

const registry = readText(files.registry);
const runState = readText(files.runState);
const taskQueue = readText(files.taskQueue);
const closeout = readText(files.closeout);
const memoryDraft = readText(files.memoryDraft);
const productionPlan = readText(files.productionPlan);
const productionReview = readText(files.productionReview);
const productionText = collectText("production");
const codexSampleBlock = sampleBlock(registry, acceptedSampleId);

addResult("codex_sample_registered", codexSampleBlock.includes(`sample_id: ${acceptedSampleId}`));
addResult("codex_sample_provider_is_session_image", codexSampleBlock.includes("provider_type: codex_session_image"));
addResult("codex_sample_has_no_plugin", codexSampleBlock.includes("plugin_id: null"));
addResult("codex_sample_not_memory_write", codexSampleBlock.includes("write_to_memory_allowed: false"));
addResult("codex_sample_not_daily_note_write", codexSampleBlock.includes("daily_note_write_allowed: false"));
addResult("codex_sample_block_has_no_production_acceptance_flag", !codexSampleBlock.includes("production_candidate_accepted: true"));
addResult("codex_sample_block_has_no_production_write_allowance", !codexSampleBlock.includes("production_candidate_write_allowed: true"));

addResult("accepted_samples_registry_blocks_global_memory", registry.includes("memory_write_allowed: false"));
addResult("accepted_samples_registry_blocks_global_daily_note", registry.includes("daily_note_write_allowed: false"));
addResult("accepted_samples_registry_is_registry_only", registry.includes("registry_only: true"));
addResult("accepted_samples_registry_no_image_commit", registry.includes("image_files_committed_to_git: false"));

addResult("run_state_blocks_production_promotion", runState.includes("production_candidate_upgrade_allowed_without_separate_authorization: false"));
addResult("task_queue_blocks_production_promotion", taskQueue.includes("production_candidate_upgrade_allowed_without_separate_authorization: false"));
addResult(
  "accepted_sample_closeout_blocks_production",
  closeout.includes("production_candidate_write_performed: false") &&
    closeout.includes("production_candidate_requires_separate_authorization: true") &&
    closeout.includes("production_candidate_started: false")
);
addResult("memory_delta_draft_blocks_production_write", memoryDraft.includes("production_candidate_write_performed: false"));

addResult("existing_production_plan_requires_independent_a5", productionPlan.includes("requires_independent_a5: true"));
addResult("existing_production_plan_not_self_authorized", productionPlan.includes("execution_authorized_by_this_record: false"));
addResult("existing_production_review_is_historical_candidate", productionReview.includes("production_candidate_accepted: true"));
addResult("existing_production_review_not_codex_session_sample", !productionReview.includes(acceptedSampleId));

addResult("no_codex_sample_id_in_production_tree", !productionText.includes(acceptedSampleId));
addResult("no_codex_plan_token_in_production_tree", !productionText.includes(codexPlanToken));
addResult("no_accepted_samples_auto_promotion_marker", !registry.includes("auto_promote_to_production_candidate: true"));
addResult("no_production_candidate_write_true_in_current_surfaces", ![
  registry,
  runState,
  taskQueue,
  closeout,
  memoryDraft,
].join("\n").includes("production_candidate_write_allowed: true"));

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_112_production_candidate_gate_policy",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  accepted_sample_id: acceptedSampleId,
  accepted_samples_metadata_auto_allowed: true,
  accepted_samples_auto_promote_to_production_candidate: false,
  production_candidate_write_allowed: false,
  production_candidate_write_performed: false,
  production_directory_write_performed: false,
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
