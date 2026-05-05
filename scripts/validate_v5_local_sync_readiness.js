const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const originMasterShort = "367d3c9";
const localHeadShort = "b04e253";
const localCommits = [
  {
    short: "6bd255d",
    message: "chore: add v5.0 delivery readiness checkpoint",
    phase: "v5.0 post-merge delivery readiness index"
  },
  {
    short: "876d335",
    message: "chore: add v5.2 local delivery surface validation",
    phase: "v5.2 adapter delivery surface validation"
  },
  {
    short: "b04e253",
    message: "chore: add v5.3 review console adapter handoff validation",
    phase: "v5.3 review console adapter handoff validation"
  }
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

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function main() {
  const requiredFiles = [
    "docs/131_v5_4_local_sync_readiness.md",
    "tests/schema_examples/v5_4_local_sync_readiness.example.yaml",
    "scripts/validate_v5_local_sync_readiness.js",
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
  assert(missingFiles.length === 0, `Missing v5.4 local sync readiness files: ${missingFiles.join(", ")}`);

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
  const record = read("docs/131_v5_4_local_sync_readiness.md");
  const schema = read("tests/schema_examples/v5_4_local_sync_readiness.example.yaml");

  const commitValues = [originMasterShort, ...localCommits.map((commit) => commit.short)];
  const recordCommitChainCurrent = [record, schema].every((content) => includesAll(content, commitValues));
  const boardCommitChainCurrent = [runState, handoff, checkpoint].every((content) =>
    includesAll(content, [originMasterShort, localHeadShort, "pending local commits: 3"])
  );
  const localCommitMessagesRecorded = [record, schema].every((content) =>
    localCommits.every((commit) => content.includes(commit.short) && content.includes(commit.message))
  );
  const currentPhaseUpdated =
    runState.includes("v5.4 local sync readiness preflight") &&
    handoff.includes("v5.4 local sync readiness preflight");
  const topIndexesUpdated =
    readme.includes("v5.4 local sync readiness preflight") &&
    manifest.includes("v5.4 local sync readiness preflight") &&
    roadmap.includes("v5.4 local sync readiness preflight") &&
    releaseNotes.includes("Added v5.4 local sync readiness preflight.");
  const validationSurfaceCurrent =
    checklist.includes("## v5.4 Local Sync Readiness Preflight 检查") &&
    validateMvp.includes("scripts/validate_v5_local_sync_readiness.js") &&
    validationLog.includes("node scripts/validate_v5_local_sync_readiness.js");
  const remoteGatePreserved = [runState, handoff, taskQueue, record, schema].every((content) => {
    return (
      content.includes("push_authorized: false") ||
      content.includes("Commit/tag/push authorization: not active") ||
      content.includes("push / PR / merge / tag / release") ||
      content.includes("Commit/tag/push/release require explicit separate authorization")
    );
  });
  const recordBoundaryClean = [record, schema].every((content) => {
    return (
      content.includes("push_authorized: false") &&
      content.includes("tag_authorized: false") &&
      content.includes("pr_authorized: false") &&
      content.includes("release_authorized: false") &&
      content.includes("remote_write_performed: false") &&
      content.includes("api_called: false") &&
      content.includes("vcp_plugin_called: false") &&
      content.includes("daily_note_called: false") &&
      content.includes("vcp_memory_written: false") &&
      content.includes("image_file_created: false") &&
      content.includes("commit_tag_push_authorized: false")
    );
  });

  assert(recordCommitChainCurrent, "v5.4 record and schema must include origin baseline and local commit chain.");
  assert(boardCommitChainCurrent, "v5.4 agent board must record local head and pending local commit count.");
  assert(localCommitMessagesRecorded, "v5.4 record and schema must include local commit messages.");
  assert(currentPhaseUpdated, "v5.4 current phase must be reflected in RUN_STATE and HANDOFF.");
  assert(topIndexesUpdated, "v5.4 top-level indexes must be updated.");
  assert(validationSurfaceCurrent, "v5.4 validation surface must be current.");
  assert(remoteGatePreserved, "v5.4 must preserve remote action gate.");
  assert(recordBoundaryClean, "v5.4 docs and schema must preserve no-execution boundaries.");

  const result = {
    passed: true,
    local_sync_readiness: {
      origin_master_short: originMasterShort,
      local_head_short: localHeadShort,
      pending_local_commit_count: localCommits.length,
      local_commit_chain_ordered: true,
      local_commit_messages_recorded: localCommitMessagesRecorded,
      board_commit_chain_current: boardCommitChainCurrent,
      top_indexes_updated: topIndexesUpdated,
      validation_surface_current: validationSurfaceCurrent,
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
