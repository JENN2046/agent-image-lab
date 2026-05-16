"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const surfaceFiles = [
  "README.md",
  "docs/00_project_roadmap.md",
  "PROJECT_MASTER_PLAN.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/VALIDATION_LOG.md",
];

const historicalSafetyFiles = [
  ".agent_board/BLOCKERS.md",
  "docs/v7_260_product_workflow_paper_chain_quality_stop_gate.md",
  "docs/product_workflow_paper_chain_quality_stop.md",
];

const requiredV14020Markers = [
  "v14_020_visual_eval_and_failure_taxonomy_planning_gate",
  "selected_product_route: B_visual_eval_and_failure_taxonomy_planning",
  "visual_rubric_planning_created: true",
  "failure_taxonomy_planning_created: true",
  "accepted_rejected_policy_draft_created: true",
  "minimal_eval_seed_planning_created: true",
  "schema_files_created: false",
  "eval_samples_created: false",
  "accepted_samples_written: false",
  "image_generation: false",
  "memory_write: false",
  "production_candidate_002: false",
  "Batch_005: false",
];

const requiredCommitSplitMarkers = [
  "source_commit: e5705dbb678acb60339ef1ad3f3476223c338711",
  "phase_commit: 48d634c9cedb8b4ea221bb1e6788867d830475cc",
  "remote_head_after_phase: 48d634c9cedb8b4ea221bb1e6788867d830475cc",
];

const requiredNarrowNextMarkers = [
  "docs_only_gate_creation_and_validation_only: true",
  "runtime_provider_image_memory_production_batch: false",
];

function readRepoFile(relPath) {
  const fullPath = path.resolve(ROOT, relPath);
  if (!fullPath.startsWith(ROOT + path.sep)) {
    throw new Error(`Unsafe path outside repository: ${relPath}`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

function pushResult(results, file, check, pass, detail = undefined) {
  results.push({ file, check, pass, ...(detail ? { detail } : {}) });
}

const results = [];
const filesChecked = [...surfaceFiles, ...historicalSafetyFiles];

for (const file of filesChecked) {
  try {
    readRepoFile(file);
    pushResult(results, file, "file_exists", true);
  } catch (err) {
    pushResult(results, file, "file_exists", false, err.message);
  }
}

for (const file of surfaceFiles) {
  let text = "";
  try {
    text = readRepoFile(file);
  } catch {
    continue;
  }

  for (const marker of requiredV14020Markers) {
    pushResult(results, file, `contains_v14_020_marker:${marker}`, text.includes(marker));
  }

  for (const marker of requiredCommitSplitMarkers) {
    pushResult(results, file, `contains_commit_split_marker:${marker}`, text.includes(marker));
  }

  for (const marker of requiredNarrowNextMarkers) {
    pushResult(results, file, `contains_narrow_next_marker:${marker}`, text.includes(marker));
  }

}

for (const file of ["README.md", "docs/00_project_roadmap.md", "PROJECT_MASTER_PLAN.md"]) {
  let text = "";
  try {
    text = readRepoFile(file);
  } catch {
    continue;
  }
  pushResult(
    results,
    file,
    "current_entry_no_dirty_worktree_next_action",
    !text.includes("Recommended next after active preflight: resolve_dirty_worktree_before_a5_execution") &&
      !text.includes("Next action is\n`resolve_dirty_worktree_before_a5_execution`")
  );
}

const passed = results.every((item) => item.pass);
const output = {
  validator: "validate_current_state_alignment",
  files_checked: filesChecked,
  required_current_gate: "v14_020_visual_eval_and_failure_taxonomy_planning_gate",
  passed,
  failed_checks: results.filter((item) => !item.pass),
};

console.log(JSON.stringify(output, null, 2));
process.exit(passed ? 0 : 2);
