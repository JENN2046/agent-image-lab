const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v5.11 post-merge reconciliation";
const mergeCommitShort = "3e3405e";
const headCommitShort = "5ccf059";
const tagName = "v5.10-local-delivery-agents-merge";

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractTextBlock(content, heading) {
  const pattern = new RegExp(
    `^## ${escapeRegExp(heading)}\\s*\\r?\\n\\s*\\r?\\n\`\`\`text\\r?\\n([\\s\\S]*?)\\r?\\n\`\`\``,
    "m"
  );
  const match = content.match(pattern);
  assert(match, `Missing text block for heading: ${heading}`);
  return match[1].trim();
}

function main() {
  const requiredFiles = [
    "docs/137_v5_10_local_true_loop_candidate_delivery.md",
    "docs/138_v5_11_post_merge_reconciliation.md",
    "tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml",
    "tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml",
    "scripts/validate_v5_true_loop_candidate_delivery.js",
    "scripts/validate_v5_post_merge_reconciliation.js",
    "scripts/validate_v5_handoff_freshness.js",
    "scripts/validate_v5_index_consistency.js",
    "scripts/validate_mvp.ps1",
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/CHECKPOINT.md",
    ".agent_board/TASK_QUEUE.md",
    ".agent_board/VALIDATION_LOG.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v5.11 reconciliation files: ${missingFiles.join(", ")}`);

  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const record = read("docs/138_v5_11_post_merge_reconciliation.md");
  const schema = read("tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml");
  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const handoffFreshness = read("scripts/validate_v5_handoff_freshness.js");
  const validateMvp = read("scripts/validate_mvp.ps1");

  const currentPhaseRecorded =
    extractTextBlock(runState, "Current Phase") === currentPhase &&
    extractTextBlock(runState, "Current Stop Status") === "not blocked" &&
    handoff.includes(`${currentPhase} is active locally`);
  const boardMergeStateRecorded = [runState, handoff].every((content) =>
    includesAll(content, [
      "PR #2 status: merged",
      `PR #2 merge commit: ${mergeCommitShort}`,
      `PR #2 head: ${headCommitShort}`,
      `Local head: ${mergeCommitShort}`,
      "pending local commits: 0"
    ]) ||
    includesAll(content, [
      "pr_number: 2",
      "pr_merged: true",
      `pr_merge_commit_short: ${mergeCommitShort}`,
      `pr_head_commit_short: ${headCommitShort}`
    ])
  );
  const checkpointMergeStateRecorded =
    checkpoint.includes(`PR #2 merged: merge commit ${mergeCommitShort}`) &&
    checkpoint.includes(`PR #2 head: ${headCommitShort}`);
  const recordMergeStateRecorded = [record, schema].every((content) =>
    includesAll(content, [
      "pr_number: 2",
      "pr_merged: true",
      `pr_merge_commit_short: ${mergeCommitShort}`,
      `pr_head_commit_short: ${headCommitShort}`
    ])
  );
  const mergeStateRecorded =
    boardMergeStateRecorded &&
    checkpointMergeStateRecorded &&
    recordMergeStateRecorded;
  const syncStateRecorded =
    runState.includes("Master sync: local master synced to origin/master") &&
    runState.includes("master...origin/master: 0 0") &&
    handoff.includes("master...origin/master: 0 0") &&
    includesAll(record, ["local_master_synced: true", "master_origin_divergence: \"0 0\""]) &&
    includesAll(schema, ["local_master_synced: true", "master_origin_divergence: \"0 0\""]);
  const tagRecorded =
    [runState, handoff, record, schema, checkpoint].every((content) => content.includes(tagName)) &&
    record.includes("tag_pushed: true") &&
    schema.includes("tag_pushed: true");
  const indexesCurrent =
    [readme, manifest, roadmap, releaseNotes, checklist].every((content) => content.includes(currentPhase)) &&
    readme.includes("docs/138_v5_11_post_merge_reconciliation.md") &&
    manifest.includes("docs/138_v5_11_post_merge_reconciliation.md") &&
    checklist.includes("## v5.11 Post-Merge Reconciliation 检查");
  const validatorsCurrent =
    includesAll(handoffFreshness, ["expectedCurrentPhase", currentPhase, "run_state_current_phase"]) &&
    includesAll(validateMvp, [
      "scripts/validate_v5_post_merge_reconciliation.js",
      "docs/138_v5_11_post_merge_reconciliation.md",
      "tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml",
      currentPhase
    ]);
  const agentBoardCurrent =
    validationLog.includes("VALIDATION-20260506-V5-11") &&
    validationLog.includes("node scripts/validate_v5_post_merge_reconciliation.js") &&
    taskQueue.includes("Completed v5.11 post-merge reconciliation.") &&
    checkpoint.includes("v5.11 local: PR #2 post-merge reconciliation recorded");
  const boundaryPreserved = [record, schema].every((content) =>
    includesAll(content, [
      "commit_authorized: false",
      "push_authorized: false",
      "tag_authorized: false",
      "pr_authorized: false",
      "release_authorized: false",
      "remote_write_performed_in_this_batch: false",
      "real_vcpchat_source_read: false",
      "real_vcptoolbox_source_read: false",
      "real_manifest_read: false",
      "api_called: false",
      "vcp_plugin_called: false",
      "daily_note_called: false",
      "vcp_memory_written: false",
      "image_file_created: false"
    ])
  );
  const remoteGatePreserved =
    runState.includes("Remote action in current batch: none") &&
    runState.includes("Commit/tag/push authorization: not active") &&
    handoff.includes("Commit/tag/push/release require explicit separate authorization");

  assert(currentPhaseRecorded, "Current phase must be v5.11 post-merge reconciliation.");
  assert(mergeStateRecorded, "PR #2 merge state must be recorded.");
  assert(syncStateRecorded, "Local master and origin/master sync state must be recorded.");
  assert(tagRecorded, "v5.10 delivery tag state must be recorded.");
  assert(indexesCurrent, "Top-level indexes must reference v5.11 post-merge reconciliation.");
  assert(validatorsCurrent, "v5.11 validators must be wired into handoff freshness and MVP validation.");
  assert(agentBoardCurrent, "Agent board must record v5.11 post-merge reconciliation.");
  assert(boundaryPreserved, "v5.11 record and schema must preserve no-execution boundaries.");
  assert(remoteGatePreserved, "v5.11 must preserve remote action gate.");

  const result = {
    passed: true,
    post_merge_reconciliation: {
      version: "v5.11",
      current_phase: currentPhase,
      pr_number: 2,
      pr_merged: true,
      pr_merge_commit_short: mergeCommitShort,
      pr_head_commit_short: headCommitShort,
      tag_name: tagName,
      tag_pushed: true,
      local_master_synced: true,
      origin_master_short: mergeCommitShort,
      local_head_short: mergeCommitShort,
      master_origin_divergence: "0 0",
      post_merge_reconciled: true,
      indexes_current: indexesCurrent,
      validators_current: validatorsCurrent,
      agent_board_current: agentBoardCurrent,
      commit_authorized: false,
      push_authorized: false,
      tag_authorized: false,
      pr_authorized: false,
      release_authorized: false,
      remote_write_performed_in_this_batch: false,
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
