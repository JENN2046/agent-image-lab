const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const localCommitShort = "6d4253f";
const localTag = "v4.8-local-validation-checkpoint";
const lastPushedCommitShort = "7f58408";
const lastPushedTag = "v4.6-guarded-autopilot-commit-scope";

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
    "docs/126_v4_9_local_tag_push_readiness.md",
    "tests/schema_examples/v4_9_local_tag_push_readiness.example.yaml",
    "scripts/validate_local_tag_push_readiness.js",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/CHECKPOINT.md",
    ".agent_board/VALIDATION_LOG.md",
    "README.md",
    "MANIFEST.md",
    "docs/00_project_roadmap.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v4.9 local tag push-readiness files: ${missingFiles.join(", ")}`);

  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const record = read("docs/126_v4_9_local_tag_push_readiness.md");
  const schema = read("tests/schema_examples/v4_9_local_tag_push_readiness.example.yaml");

  const currentPhaseUpdated =
    runState.includes("v4.9 local tag push-readiness preflight") &&
    handoff.includes("v4.9 local tag push-readiness preflight");
  const localTagRecorded = [runState, handoff, checkpoint, record, schema].every((content) => {
    return content.includes(localCommitShort) && content.includes(localTag);
  });
  const lastPushedBaselineRecorded = [runState, handoff, record, schema].every((content) => {
    return content.includes(lastPushedCommitShort) && content.includes(lastPushedTag);
  });
  const pushPendingDeclared =
    runState.includes("Push readiness: local tag present, push not authorized") &&
    handoff.includes("Push status: pending explicit authorization");
  const remoteGatePreserved =
    runState.includes("Commit/tag/push authorization: not active") &&
    handoff.includes("Commit/tag/push/release require explicit separate authorization");
  const validationSnapshotUpdated =
    validationLog.includes("node scripts/validate_local_tag_push_readiness.js") &&
    validationLog.includes("scripts/validate_mvp.ps1") &&
    validationLog.includes("git diff --check");
  const topIndexesUpdated =
    readme.includes("v4.9 local tag push-readiness preflight") &&
    manifest.includes("v4.3-v4.9") &&
    roadmap.includes("v4.9 local tag push-readiness preflight");
  const recordBoundaryClean = [record, schema].every((content) => {
    return (
      content.includes("api_called: false") &&
      content.includes("vcp_plugin_called: false") &&
      content.includes("daily_note_called: false") &&
      content.includes("vcp_memory_written: false") &&
      content.includes("image_file_created: false") &&
      content.includes("push_authorized: false") &&
      content.includes("commit_tag_push_authorized: false")
    );
  });

  assert(currentPhaseUpdated, "v4.9 current phase must be reflected in RUN_STATE and HANDOFF.");
  assert(localTagRecorded, "v4.9 must record local commit and local tag.");
  assert(lastPushedBaselineRecorded, "v4.9 must retain last pushed baseline.");
  assert(pushPendingDeclared, "v4.9 must declare push pending explicit authorization.");
  assert(remoteGatePreserved, "v4.9 must preserve remote action gate.");
  assert(validationSnapshotUpdated, "v4.9 validation snapshot must include local tag push-readiness validation.");
  assert(topIndexesUpdated, "v4.9 top-level indexes must be updated.");
  assert(recordBoundaryClean, "v4.9 docs and schema must preserve no-execution boundaries.");

  const result = {
    passed: true,
    local_tag_push_readiness: {
      local_commit_short: localCommitShort,
      local_tag: localTag,
      last_pushed_commit_short: lastPushedCommitShort,
      last_pushed_tag: lastPushedTag,
      current_phase_updated: currentPhaseUpdated,
      local_tag_recorded: localTagRecorded,
      last_pushed_baseline_recorded: lastPushedBaselineRecorded,
      push_pending_declared: pushPendingDeclared,
      remote_gate_preserved: remoteGatePreserved,
      validation_snapshot_updated: validationSnapshotUpdated,
      top_indexes_updated: topIndexesUpdated,
      push_authorized: false,
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
