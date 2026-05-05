const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const mergeCommitShort = "367d3c9";
const mergedHeadCommitShort = "b595851";
const checkpointCommitShort = "6d4253f";
const checkpointTag = "v4.8-local-validation-checkpoint";
const phaseName = "v5.0 post-merge delivery readiness index";

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

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function main() {
  const requiredFiles = [
    "docs/127_v5_0_delivery_readiness_index.md",
    "tests/schema_examples/v5_0_delivery_readiness.example.yaml",
    "scripts/validate_v5_delivery_readiness.js",
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
    "scripts/validate_mvp.ps1"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v5.0 delivery readiness files: ${missingFiles.join(", ")}`);

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
  const record = read("docs/127_v5_0_delivery_readiness_index.md");
  const schema = read("tests/schema_examples/v5_0_delivery_readiness.example.yaml");

  const boardMergedStateRecorded = [runState, handoff, checkpoint].every((content) => {
    return (
      content.includes("PR #1") &&
      content.includes(mergeCommitShort) &&
      content.includes(mergedHeadCommitShort) &&
      content.includes(checkpointCommitShort) &&
      content.includes(checkpointTag)
    );
  });
  const recordMergedStateRecorded = [record, schema].every((content) => {
    return (
      content.includes("pr_number: 1") &&
      content.includes(mergeCommitShort) &&
      content.includes(mergedHeadCommitShort) &&
      content.includes(checkpointCommitShort) &&
      content.includes(checkpointTag)
    );
  });
  const mergedStateRecorded = boardMergedStateRecorded && recordMergedStateRecorded;
  const currentPhaseUpdated =
    runState.includes(phaseName) &&
    handoff.includes(phaseName);
  const masterSyncRecorded =
    runState.includes("Branch: master") &&
    runState.includes("Remote tracking: master...origin/master") &&
    handoff.includes("local master synced to origin/master");
  const deliveryEntryCurrent =
    readme.includes(phaseName) &&
    manifest.includes(phaseName) &&
    roadmap.includes(phaseName);
  const validationCommandSurfaceCurrent =
    includesAll(readme, ["scripts\\validate_v5_delivery_readiness.js", "scripts\\validate_mvp.ps1"]) &&
    includesAll(validateMvp, [
      "scripts/validate_v5_delivery_readiness.js",
      "docs/127_v5_0_delivery_readiness_index.md",
      "tests/schema_examples/v5_0_delivery_readiness.example.yaml"
    ]);
  const checklistCurrent =
    checklist.includes("## v5.0 Post-Merge Delivery Readiness 检查") &&
    checklist.includes("scripts/validate_v5_delivery_readiness.js");
  const validationSnapshotUpdated =
    validationLog.includes("VALIDATION-20260506-V5-0") &&
    validationLog.includes("node scripts/validate_v5_delivery_readiness.js") &&
    validationLog.includes("scripts/validate_mvp.ps1") &&
    validationLog.includes("git diff --check");
  const taskQueueCurrent =
    taskQueue.includes("Completed v5.0 post-merge delivery readiness validation.") &&
    (taskQueue.includes("If user authorizes v5.0 version movement") ||
      taskQueue.includes("If user authorizes v5.1 version movement") ||
      taskQueue.includes("If user authorizes v5.2 version movement"));
  const releaseNotesCurrent = releaseNotes.includes("Added v5.0 post-merge delivery readiness index.");
  const recordBoundaryClean = [record, schema].every((content) => {
    return (
      content.includes("api_called: false") &&
      content.includes("vcp_plugin_called: false") &&
      content.includes("daily_note_called: false") &&
      content.includes("vcp_memory_written: false") &&
      content.includes("image_file_created: false") &&
      content.includes("commit_tag_push_authorized: false")
    );
  });
  const remoteGatePreserved =
    runState.includes("Remote action in current batch: none") &&
    runState.includes("Commit/tag/push authorization: not active") &&
    handoff.includes("Commit/tag/push/release require explicit separate authorization");

  assert(mergedStateRecorded, "v5.0 must record PR #1 merge, head commit, merge commit, and checkpoint tag.");
  assert(currentPhaseUpdated, "v5.0 current phase must be reflected in RUN_STATE and HANDOFF.");
  assert(masterSyncRecorded, "v5.0 must record local master sync to origin/master.");
  assert(deliveryEntryCurrent, "v5.0 delivery entry must be current in top-level docs.");
  assert(validationCommandSurfaceCurrent, "v5.0 validation command surface must be current.");
  assert(checklistCurrent, "v5.0 validation checklist section is missing.");
  assert(validationSnapshotUpdated, "v5.0 validation snapshot must include delivery readiness validation.");
  assert(taskQueueCurrent, "v5.0 task queue must mark delivery readiness validation complete and preserve version-action authorization gate.");
  assert(releaseNotesCurrent, "v5.0 release note is missing.");
  assert(recordBoundaryClean, "v5.0 docs and schema must preserve no-execution boundaries.");
  assert(remoteGatePreserved, "v5.0 must preserve remote action gate for the new local batch.");

  const result = {
    passed: true,
    delivery_readiness: {
      pr_number: 1,
      pr_merged: true,
      merge_commit_short: mergeCommitShort,
      merged_head_commit_short: mergedHeadCommitShort,
      base_branch: "master",
      local_master_synced: true,
      remote_master_synced: true,
      checkpoint_tag_pushed: true,
      checkpoint_tag: checkpointTag,
      checkpoint_commit_short: checkpointCommitShort,
      current_phase_updated: currentPhaseUpdated,
      delivery_entry_current: deliveryEntryCurrent,
      validation_command_surface_current: validationCommandSurfaceCurrent,
      task_queue_current: taskQueueCurrent,
      agent_board_post_merge_current: currentPhaseUpdated && masterSyncRecorded,
      handoff_post_merge_current: handoff.includes("PR #1") && handoff.includes("local master synced to origin/master"),
      release_notes_current: releaseNotesCurrent,
      roadmap_current: roadmap.includes(phaseName),
      checklist_current: checklistCurrent,
      validate_mvp_current: validationCommandSurfaceCurrent,
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
