const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v5.12 release candidate readiness";
const previousPhase = "v5.11 post-merge reconciliation";
const mergeCommitShort = "b3731bf";
const headCommitShort = "46bf42b";
const tagName = "v5.11-post-merge-reconciliation";
const trueLoopTag = "v1.0.0-true-loop-closeout";
const acceptedAssetSha = "b162fab50e6a5bf95b8f761441149ee27d498a3b136eafe6322f05c5499d06f0";

const candidateEvidenceFiles = [
  "docs/30_release_readiness_report.md",
  "docs/31_install_and_operation_guide.md",
  "docs/32_final_acceptance_report.md",
  "docs/34_v1_0_true_loop_closeout.md",
  "docs/35_v1_0_github_intake_review.md",
  "tests/schema_examples/v1_0_true_loop_closeout.example.yaml",
  "integrations/vcp/v0_5_adapter_install_verification.md",
  "integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md",
  "integrations/vcp/v0_7_gatekeeper_risk_boundary.md",
  "review_console/v0_7_human_approval_preflight.md",
  "workflows/v0_7_real_execution_preflight_confirmation.md",
  "integrations/vcp/v0_7_photo_studio_os_dry_run_rehearsal.md",
  "integrations/vcp/v0_7_photo_studio_os_real_execution_record.md",
  "integrations/vcp/v0_9_photo_studio_os_retry_real_execution_record.md",
  "integrations/vcp/v0_10_doubaogen_retry_real_execution_record.md",
  "docs/137_v5_10_local_true_loop_candidate_delivery.md",
  "docs/138_v5_11_post_merge_reconciliation.md",
  "docs/139_v5_12_release_candidate_readiness.md",
  "tests/schema_examples/v5_12_release_candidate_readiness.example.yaml"
];

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
    ...candidateEvidenceFiles,
    "scripts/validate_v5_12_release_candidate_readiness.js",
    "scripts/validate_v5_post_merge_reconciliation.js",
    "scripts/validate_v5_true_loop_candidate_delivery.js",
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
  assert(missingFiles.length === 0, `Missing v5.12 release candidate files: ${missingFiles.join(", ")}`);

  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const record = read("docs/139_v5_12_release_candidate_readiness.md");
  const schema = read("tests/schema_examples/v5_12_release_candidate_readiness.example.yaml");
  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const handoffFreshness = read("scripts/validate_v5_handoff_freshness.js");
  const validateMvp = read("scripts/validate_mvp.ps1");
  const v5IndexConsistency = read("scripts/validate_v5_index_consistency.js");
  const candidateEvidence = candidateEvidenceFiles.map((relativePath) => read(relativePath)).join("\n");

  const currentPhaseRecorded =
    extractTextBlock(runState, "Current Phase") === currentPhase &&
    extractTextBlock(runState, "Current Stop Status") === "not blocked" &&
    handoff.includes(`${currentPhase} is active locally`);
  const postMergeStateRecorded =
    [runState, handoff].every((content) =>
      includesAll(content, [
        "PR #3 status: merged",
        `PR #3 merge commit: ${mergeCommitShort}`,
        `PR #3 head: ${headCommitShort}`,
        `Local head: ${mergeCommitShort}`,
        "master...origin/master: 0 0"
      ])
    ) &&
    [record, schema].every((content) =>
      includesAll(content, [
        "pr_number: 3",
        "pr_merged: true",
        `pr_merge_commit_short: ${mergeCommitShort}`,
        `pr_head_commit_short: ${headCommitShort}`,
        `tag_name: ${tagName}`,
        "tag_pushed: true",
        "master_origin_divergence: \"0 0\""
      ])
    );
  const releaseCandidateReady = [record, schema].every((content) =>
    includesAll(content, [
      "release_candidate_ready: true",
      "final_delivery_candidate_package_ready: true",
      "true_loop_candidate_ready: true",
      "formal_release_published: false",
      "github_release_published_observed: false"
    ])
  );
  const candidateEvidencePresent = candidateEvidenceFiles.every((relativePath) => exists(relativePath));
  const trueLoopEvidenceReady = includesAll(candidateEvidence, [
    "true_real_loop_completed: true",
    "real_execution_complete: true",
    "generated_asset_accepted: true",
    "acceptance_mode: human_override",
    acceptedAssetSha,
    "daily_note_called: false",
    trueLoopTag
  ]);
  const indexesCurrent =
    [readme, manifest, roadmap, releaseNotes, checklist].every((content) => content.includes(currentPhase)) &&
    readme.includes("docs/139_v5_12_release_candidate_readiness.md") &&
    manifest.includes("docs/139_v5_12_release_candidate_readiness.md") &&
    checklist.includes("## v5.12 Release Candidate Readiness 检查") &&
    releaseNotes.includes("Added v5.12 release candidate readiness.");
  const validatorsCurrent =
    includesAll(handoffFreshness, ["expectedCurrentPhase", currentPhase, "run_state_current_phase"]) &&
    includesAll(v5IndexConsistency, [
      "v5.12",
      currentPhase,
      "docs/139_v5_12_release_candidate_readiness.md",
      "tests/schema_examples/v5_12_release_candidate_readiness.example.yaml",
      "scripts/validate_v5_12_release_candidate_readiness.js"
    ]) &&
    includesAll(validateMvp, [
      "scripts/validate_v5_12_release_candidate_readiness.js",
      "docs/139_v5_12_release_candidate_readiness.md",
      "tests/schema_examples/v5_12_release_candidate_readiness.example.yaml",
      currentPhase
    ]);
  const agentBoardCurrent =
    validationLog.includes("VALIDATION-20260506-V5-12") &&
    validationLog.includes("node scripts/validate_v5_12_release_candidate_readiness.js") &&
    taskQueue.includes("Completed v5.12 release candidate readiness.") &&
    checkpoint.includes("v5.12 local: final delivery candidate package readiness recorded");
  const priorPhaseRetained =
    runState.includes(`Historical v5.11 phase: ${previousPhase}`) &&
    handoff.includes(`Historical v5.11 phase: ${previousPhase}`);
  const boundaryPreserved = [record, schema].every((content) =>
    includesAll(content, [
      "commit_authorized: false",
      "push_authorized: false",
      "tag_authorized: false",
      "pr_authorized: false",
      "merge_authorized: false",
      "release_authorized: false",
      "release_publish_authorized: false",
      "package_release_authorized: false",
      "remote_write_performed_in_this_batch: false",
      "real_vcpchat_source_read: false",
      "real_vcptoolbox_source_read: false",
      "real_manifest_read: false",
      "api_called: false",
      "vcp_plugin_called: false",
      "daily_note_called: false",
      "daily_note_direct_write_allowed: false",
      "vcp_memory_written: false",
      "image_file_created: false",
      "image_binary_saved_to_git: false",
      "image_binary_saved_to_memory: false",
      "raw_plugin_output_saved: false",
      "secret_value_saved: false",
      "endpoint_raw_saved: false",
      "runtime_log_saved: false",
      "additional_real_generation_authorized: false"
    ])
  );
  const remoteGatePreserved =
    runState.includes("Remote action in current batch: none") &&
    runState.includes("Commit/tag/push authorization: not active") &&
    handoff.includes("Commit/tag/push/release require explicit separate authorization");

  assert(currentPhaseRecorded, "Current phase must be v5.12 release candidate readiness.");
  assert(postMergeStateRecorded, "PR #3 merge state and synced master state must be recorded.");
  assert(releaseCandidateReady, "Release candidate readiness flags must be present.");
  assert(candidateEvidencePresent, "Release candidate evidence files must exist.");
  assert(trueLoopEvidenceReady, "True-loop evidence chain must be ready.");
  assert(indexesCurrent, "Top-level indexes must reference v5.12 release candidate readiness.");
  assert(validatorsCurrent, "v5.12 validators must be wired into handoff freshness, index consistency, and MVP validation.");
  assert(agentBoardCurrent, "Agent board must record v5.12 release candidate readiness.");
  assert(priorPhaseRetained, "v5.11 historical phase must be retained after v5.12 opens.");
  assert(boundaryPreserved, "v5.12 record and schema must preserve no-execution boundaries.");
  assert(remoteGatePreserved, "v5.12 must preserve remote action gate.");

  const result = {
    passed: true,
    release_candidate_readiness: {
      version: "v5.12",
      current_phase: currentPhase,
      pr_number: 3,
      pr_merged: true,
      pr_merge_commit_short: mergeCommitShort,
      pr_head_commit_short: headCommitShort,
      tag_name: tagName,
      tag_pushed: true,
      true_loop_tag_observed: true,
      true_loop_tag: trueLoopTag,
      local_master_synced: true,
      origin_master_short: mergeCommitShort,
      local_head_short: mergeCommitShort,
      master_origin_divergence: "0 0",
      release_candidate_ready: releaseCandidateReady,
      final_delivery_candidate_package_ready: true,
      true_loop_candidate_ready: true,
      candidate_evidence_present: candidateEvidencePresent,
      true_loop_evidence_ready: trueLoopEvidenceReady,
      indexes_current: indexesCurrent,
      validators_current: validatorsCurrent,
      agent_board_current: agentBoardCurrent,
      commit_authorized: false,
      push_authorized: false,
      tag_authorized: false,
      pr_authorized: false,
      merge_authorized: false,
      release_authorized: false,
      release_publish_authorized: false,
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
