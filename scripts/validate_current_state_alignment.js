"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const files = [
  "README.md",
  "docs/00_project_roadmap.md",
  "PROJECT_MASTER_PLAN.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/BLOCKERS.md",
  ".agent_board/VALIDATION_LOG.md",
  "docs/v7_245_native_doubao_syntax_and_sandbox_hardening.md",
];

const requiredEverywhere = [
  "failed_no_image_repeated_quota_or_rate_limit",
  "v7.246_no_generation_quota_or_provider_path_diagnostic_readiness_gate",
];

const requiredCurrentSurfaces = [
  "same_provider_retry_allowed_now: false",
  "A5_execution_allowed_now: false",
  "provider_contact_allowed_now: false",
];

function readRepoFile(relPath) {
  const fullPath = path.resolve(ROOT, relPath);
  if (!fullPath.startsWith(ROOT + path.sep)) {
    throw new Error(`Unsafe path outside repository: ${relPath}`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

const results = [];

for (const file of files) {
  let text = "";
  try {
    text = readRepoFile(file);
    results.push({ file, check: "file_exists", pass: true });
  } catch (err) {
    results.push({ file, check: "file_exists", pass: false, detail: err.message });
    continue;
  }

  for (const marker of requiredEverywhere) {
    results.push({
      file,
      check: `contains:${marker}`,
      pass: text.includes(marker),
    });
  }
}

for (const file of ["README.md", "docs/00_project_roadmap.md", "PROJECT_MASTER_PLAN.md", ".agent_board/HANDOFF.md", ".agent_board/RUN_STATE.md", ".agent_board/TASK_QUEUE.md", ".agent_board/CHECKPOINT.md"]) {
  const text = readRepoFile(file);
  for (const marker of requiredCurrentSurfaces) {
    results.push({
      file,
      check: `current_surface_contains:${marker}`,
      pass: text.includes(marker),
    });
  }
}

for (const file of ["README.md", "docs/00_project_roadmap.md", "PROJECT_MASTER_PLAN.md"]) {
  const text = readRepoFile(file);
  results.push({
    file,
    check: "current_entry_no_dirty_worktree_next_action",
    pass: !text.includes("Recommended next after active preflight: resolve_dirty_worktree_before_a5_execution") &&
      !text.includes("Next action is\n`resolve_dirty_worktree_before_a5_execution`"),
  });
}

const passed = results.every((item) => item.pass);
const output = {
  validator: "validate_current_state_alignment",
  files_checked: files,
  passed,
  failed_checks: results.filter((item) => !item.pass),
};

console.log(JSON.stringify(output, null, 2));
process.exit(passed ? 0 : 2);
