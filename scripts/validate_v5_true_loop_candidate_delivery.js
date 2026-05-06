const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const recordPhase = "v5.10 local true-loop candidate delivery closeout";
const currentPhase = "v5.12 release candidate readiness";
const localHeadShort = "9ac4ca8";
const pendingLocalCommitCount = 5;
const localCommitChain = "6bd255d -> 876d335 -> b04e253 -> a2ae539 -> 9ac4ca8";

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
    "docs/30_release_readiness_report.md",
    "docs/31_install_and_operation_guide.md",
    "docs/32_final_acceptance_report.md",
    "docs/34_v1_0_true_loop_closeout.md",
    "docs/137_v5_10_local_true_loop_candidate_delivery.md",
    "docs/138_v5_11_post_merge_reconciliation.md",
    "docs/139_v5_12_release_candidate_readiness.md",
    "tests/schema_examples/v1_0_true_loop_closeout.example.yaml",
    "tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml",
    "tests/schema_examples/v5_11_post_merge_reconciliation.example.yaml",
    "tests/schema_examples/v5_12_release_candidate_readiness.example.yaml",
    "scripts/validate_v5_true_loop_candidate_delivery.js",
    "scripts/validate_v5_post_merge_reconciliation.js",
    "scripts/validate_v5_12_release_candidate_readiness.js",
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
  assert(missingFiles.length === 0, `Missing v5.10 delivery files: ${missingFiles.join(", ")}`);

  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const releaseReadiness = read("docs/30_release_readiness_report.md");
  const finalAcceptance = read("docs/32_final_acceptance_report.md");
  const v1Closeout = read("docs/34_v1_0_true_loop_closeout.md");
  const record = read("docs/137_v5_10_local_true_loop_candidate_delivery.md");
  const schema = read("tests/schema_examples/v5_10_local_true_loop_candidate_delivery.example.yaml");
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
  const boardGitStateRecorded = [runState, handoff].every((content) =>
    includesAll(content, [
      `Historical v5.10 local head: ${localHeadShort}`,
      `Historical v5.10 pending local commits: ${pendingLocalCommitCount}`,
      `Historical v5.10 local pending commit chain: ${localCommitChain}`
    ])
  );
  const deliveryRecordGitStateRecorded = [record, schema].every((content) =>
    (content.includes(`local_head_short: ${localHeadShort}`) || content.includes(`local_head: ${localHeadShort}`)) &&
    (content.includes(`pending_local_commit_count: ${pendingLocalCommitCount}`) || content.includes(`pending_local_commits: ${pendingLocalCommitCount}`)) &&
    content.includes(localCommitChain)
  );
  const localGitStateRecorded = boardGitStateRecorded && deliveryRecordGitStateRecorded;
  const closeoutDocsReady =
    includesAll(v1Closeout, [
      "true_real_loop_completed: true",
      "final_v1_0_ready: true",
      "release_publish_authorized: false"
    ]) &&
    finalAcceptance.includes("当前可作为 v1.0 true-loop closeout 候选") &&
    releaseReadiness.includes("ready_for_local_v1_0_closeout");
  const reviewFindingFixed =
    includesAll(handoffFreshness, [
      "extractTextBlock",
      "run_state_current_phase",
      currentPhase
    ]) &&
    validateMvp.includes("run_state_current_phase") &&
    validateMvp.includes(currentPhase);
  const indexesCurrent =
    [readme, manifest, roadmap, releaseNotes, checklist].every((content) => content.includes(recordPhase)) &&
    readme.includes("docs/137_v5_10_local_true_loop_candidate_delivery.md") &&
    manifest.includes("docs/137_v5_10_local_true_loop_candidate_delivery.md") &&
    checklist.includes("## v5.10 Local True-Loop Candidate Delivery Closeout 检查");
  const agentBoardCurrent =
    checkpoint.includes("v5.10 local: true-loop candidate delivery closeout added") &&
    taskQueue.includes("Completed v5.10 local true-loop candidate delivery closeout.") &&
    validationLog.includes("VALIDATION-20260506-V5-10") &&
    validationLog.includes("node scripts/validate_v5_true_loop_candidate_delivery.js");
  const deliveryRecordClean = [record, schema].every((content) =>
    includesAll(content, [
      "true_loop_candidate_ready: true",
      "review_finding_fixed: true",
      "local_delivery_complete: true",
      "commit_authorized: false",
      "push_authorized: false",
      "tag_authorized: false",
      "pr_authorized: false",
      "release_authorized: false",
      "remote_write_performed: false",
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

  assert(currentPhaseRecorded, "Current phase must be v5.12 release candidate readiness.");
  assert(localGitStateRecorded, "Historical v5.10 git state must record v5.9 committed head and five pending commits.");
  assert(closeoutDocsReady, "v1.0 closeout, final acceptance, and release readiness docs must be ready.");
  assert(reviewFindingFixed, "Handoff freshness review finding must be fixed and covered by validate_mvp.");
  assert(indexesCurrent, "Top-level indexes must reference v5.10 local delivery closeout.");
  assert(agentBoardCurrent, "Agent board must record v5.10 local delivery closeout.");
  assert(deliveryRecordClean, "v5.10 record and schema must preserve no-execution boundaries.");
  assert(remoteGatePreserved, "v5.10 must preserve remote action gate.");

  const result = {
    passed: true,
    local_true_loop_candidate_delivery: {
      version: "v5.10",
      record_phase: recordPhase,
      current_phase: recordPhase,
      run_state_current_phase: currentPhase,
      local_head_short: localHeadShort,
      pending_local_commit_count: pendingLocalCommitCount,
      local_commit_chain: localCommitChain,
      true_loop_candidate_ready: true,
      local_delivery_complete: true,
      closeout_docs_ready: closeoutDocsReady,
      review_finding_fixed: reviewFindingFixed,
      indexes_current: indexesCurrent,
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
