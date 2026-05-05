const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pushedCommitShort = "7f58408";
const pushedTag = "v4.6-guarded-autopilot-commit-scope";

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

function main() {
  const requiredFiles = [
    "docs/124_v4_7_post_push_state_reconciliation.md",
    "tests/schema_examples/v4_7_post_push_state_reconciliation.example.yaml",
    "scripts/validate_post_push_state.js",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/CHECKPOINT.md",
    ".agent_board/VALIDATION_LOG.md",
    "docs/00_project_roadmap.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v4.7 post-push files: ${missingFiles.join(", ")}`);

  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const record = read("docs/124_v4_7_post_push_state_reconciliation.md");
  const schema = read("tests/schema_examples/v4_7_post_push_state_reconciliation.example.yaml");

  const currentPhaseUpdated =
    runState.includes("Last pushed commit: 7f58408") &&
    runState.includes("Last pushed tag: v4.6-guarded-autopilot-commit-scope") &&
    handoff.includes("Last pushed commit: 7f58408") &&
    handoff.includes("Last pushed tag: v4.6-guarded-autopilot-commit-scope");
  const pushedBaselineRecorded =
    [runState, handoff, checkpoint, record, schema].every((content) => {
      return content.includes(pushedCommitShort) && content.includes(pushedTag);
    });
  const newLocalBatchDeclared =
    runState.includes("Worktree: local uncommitted changes present") &&
    handoff.includes("State: local uncommitted changes present");
  const remoteGatePreserved =
    runState.includes("Remote action in current batch: none") &&
    runState.includes("Commit/tag/push authorization: not active") &&
    handoff.includes("Commit/tag/push/release require explicit separate authorization");
  const validationSnapshotUpdated =
    validationLog.includes("node scripts/validate_post_push_state.js") &&
    validationLog.includes("scripts/validate_mvp.ps1") &&
    validationLog.includes("node scripts/validate_local_commit_scope.js") &&
    validationLog.includes("git diff --check");
  const roadmapUpdated = roadmap.includes("v4.7 post-push state reconciliation");
  const recordBoundaryClean =
    [record, schema].every((content) => {
      return (
        content.includes("api_called: false") &&
        content.includes("vcp_plugin_called: false") &&
        content.includes("daily_note_called: false") &&
        content.includes("vcp_memory_written: false") &&
        content.includes("image_file_created: false") &&
        content.includes("commit_tag_push_authorized: false")
      );
    });

  assert(currentPhaseUpdated, "v4.7 current phase must be reflected in RUN_STATE and HANDOFF.");
  assert(pushedBaselineRecorded, "v4.6 pushed commit and tag must be recorded.");
  assert(newLocalBatchDeclared, "v4.7 must declare the new local uncommitted batch.");
  assert(remoteGatePreserved, "v4.7 must preserve commit/tag/push authorization gate.");
  assert(validationSnapshotUpdated, "v4.7 validation snapshot must include post-push state validation.");
  assert(roadmapUpdated, "Roadmap must mention v4.7 post-push state reconciliation.");
  assert(recordBoundaryClean, "v4.7 docs and schema must preserve no-execution boundaries.");

  const result = {
    passed: true,
    post_push_state: {
      pushed_commit_short: pushedCommitShort,
      pushed_tag: pushedTag,
      current_phase_updated: currentPhaseUpdated,
      pushed_baseline_recorded: pushedBaselineRecorded,
      new_local_batch_declared: newLocalBatchDeclared,
      remote_gate_preserved: remoteGatePreserved,
      validation_snapshot_updated: validationSnapshotUpdated,
      roadmap_updated: roadmapUpdated,
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
