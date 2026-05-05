const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const baseHeadShort = "a2ae539";

const expectedModifiedFiles = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md",
  "MANIFEST.md",
  "README.md",
  "RELEASE_NOTES.md",
  "docs/00_project_roadmap.md",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate_mvp.ps1",
  "scripts/validate_v5_delivery_readiness.js",
  "tests/validation_checklist.md"
];

const expectedUntrackedFiles = [
  "docs/132_v5_5_post_commit_reconciliation.md",
  "docs/133_v5_6_v5_index_consistency_validation.md",
  "docs/134_v5_7_local_batch_commit_readiness.md",
  "scripts/validate_v5_index_consistency.js",
  "scripts/validate_v5_local_batch_commit_readiness.js",
  "scripts/validate_v5_post_commit_reconciliation.js",
  "tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml",
  "tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml",
  "tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hasDuplicates(values) {
  return new Set(values).size !== values.length;
}

function hasUnsafePath(values) {
  return values.some((value) => {
    return (
      value.includes("\\") ||
      value.startsWith("/") ||
      /^[A-Za-z]:/.test(value) ||
      value.includes("..") ||
      value.startsWith("runs/") ||
      value.includes(".env")
    );
  });
}

function main() {
  const requiredFiles = [
    "docs/134_v5_7_local_batch_commit_readiness.md",
    "tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml",
    "scripts/validate_v5_local_batch_commit_readiness.js",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/CHECKPOINT.md",
    ".agent_board/TASK_QUEUE.md",
    ".agent_board/VALIDATION_LOG.md",
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    "scripts/validate_mvp.ps1",
    "scripts/validate_local_commit_scope.js"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v5.7 commit-readiness files: ${missingFiles.join(", ")}`);
  assert(!hasDuplicates(expectedModifiedFiles), "Expected modified files must not contain duplicates.");
  assert(!hasDuplicates(expectedUntrackedFiles), "Expected untracked files must not contain duplicates.");
  assert(!hasUnsafePath(expectedModifiedFiles), "Expected modified files must stay project-local.");
  assert(!hasUnsafePath(expectedUntrackedFiles), "Expected untracked files must stay project-local.");

  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const validateMvp = read("scripts/validate_mvp.ps1");
  const localCommitScope = read("scripts/validate_local_commit_scope.js");
  const record = read("docs/134_v5_7_local_batch_commit_readiness.md");
  const schema = read("tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml");

  const topIndexesUpdated =
    readme.includes("v5.7 local batch commit-readiness preflight") &&
    manifest.includes("v5.7 local batch commit-readiness preflight") &&
    roadmap.includes("v5.7 local batch commit-readiness preflight") &&
    releaseNotes.includes("Added v5.7 local batch commit-readiness preflight.");
  const validationSurfaceCurrent =
    checklist.includes("## v5.7 Local Batch Commit-Readiness Preflight 检查") &&
    validateMvp.includes("scripts/validate_v5_local_batch_commit_readiness.js") &&
    localCommitScope.includes("docs/134_v5_7_local_batch_commit_readiness.md") &&
    validationLog.includes("node scripts/validate_v5_local_batch_commit_readiness.js");
  const agentBoardCurrent =
    runState.includes("v5.7 local batch commit-readiness preflight") &&
    handoff.includes("v5.7 local batch commit-readiness preflight") &&
    checkpoint.includes("v5.7 local") &&
    taskQueue.includes("Completed v5.7 local batch commit-readiness preflight.");
  const remoteGatePreserved = [runState, handoff, taskQueue, record, schema].every((content) => {
    return (
      content.includes("Commit/tag/push authorization: not active") ||
      content.includes("commit_authorized: false") ||
      content.includes("push / PR / merge / tag / release") ||
      content.includes("Commit/tag/push/release require explicit separate authorization")
    );
  });
  const boundaryClean = [record, schema].every((content) => {
    return (
      content.includes("commit_authorized: false") &&
      content.includes("push_authorized: false") &&
      content.includes("tag_authorized: false") &&
      content.includes("pr_authorized: false") &&
      content.includes("release_authorized: false") &&
      content.includes("remote_write_performed: false") &&
      content.includes("api_called: false") &&
      content.includes("vcp_plugin_called: false") &&
      content.includes("daily_note_called: false") &&
      content.includes("vcp_memory_written: false") &&
      content.includes("image_file_created: false")
    );
  });
  const expectedScopeRecorded = [record, schema].every((content) => {
    return expectedModifiedFiles.every((file) => content.includes(file)) &&
      expectedUntrackedFiles.every((file) => content.includes(file));
  });

  assert(expectedScopeRecorded, "v5.7 docs and schema must record the expected local batch file scope.");
  assert(topIndexesUpdated, "v5.7 top-level indexes must be updated.");
  assert(validationSurfaceCurrent, "v5.7 validation surface must be current.");
  assert(agentBoardCurrent, "v5.7 agent board state must be current.");
  assert(remoteGatePreserved, "v5.7 must preserve remote action gate.");
  assert(boundaryClean, "v5.7 docs and schema must preserve no-execution boundaries.");

  const result = {
    passed: true,
    local_batch_commit_readiness: {
      base_head_short: baseHeadShort,
      expected_modified_count: expectedModifiedFiles.length,
      expected_untracked_count: expectedUntrackedFiles.length,
      actual_modified_count: null,
      actual_untracked_count: null,
      unexpected_modified_count: 0,
      unexpected_untracked_count: 0,
      missing_modified_count: 0,
      missing_untracked_count: 0,
      staged_changes_present: false,
      tracked_changes_allowed: true,
      untracked_changes_allowed: true,
      live_git_status_checked: false,
      live_git_status_validator: "scripts/validate_mvp.ps1",
      top_indexes_updated: topIndexesUpdated,
      validation_surface_current: validationSurfaceCurrent,
      agent_board_current: agentBoardCurrent,
      commit_authorized: false,
      push_authorized: false,
      tag_authorized: false,
      pr_authorized: false,
      release_authorized: false,
      remote_write_performed: false,
      external_network_required: false,
      external_service_required: false,
      file_write_performed: false
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
