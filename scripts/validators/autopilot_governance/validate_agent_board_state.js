const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "../../..");
const boardRoot = path.join(root, ".agent_board");

const requiredFiles = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/DECISIONS.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function hasAll(content, patterns) {
  return patterns.every((pattern) => content.includes(pattern));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getAheadBehind() {
  try {
    const currentBranch = execFileSync("git", ["branch", "--show-current"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
    const upstreamRef = execFileSync("git", ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
    const output = execFileSync("git", ["rev-list", "--left-right", "--count", `${upstreamRef}...HEAD`], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
    const [behindRaw, aheadRaw] = output.split(/\s+/);
    return {
      branch: currentBranch,
      upstream: upstreamRef,
      behind: Number.parseInt(behindRaw, 10),
      ahead: Number.parseInt(aheadRaw, 10),
      raw: output
    };
  } catch (error) {
    return null;
  }
}

function getGitStatusShort() {
  try {
    return execFileSync("git", ["status", "--short"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
  } catch (error) {
    return null;
  }
}

function getCurrentPhaseBlock(runState) {
  const phaseMatch = runState.match(/phase_id:\s*([^\s]+)/);
  if (!phaseMatch) {
    return { phaseId: null, block: "" };
  }

  const start = phaseMatch.index;
  const nextSeparator = runState.indexOf("---", start);
  const block = nextSeparator === -1 ? runState.slice(start) : runState.slice(start, nextSeparator);
  return {
    phaseId: phaseMatch[1],
    block
  };
}

function getFirstTextBlock(content) {
  const match = content.match(/```text\s*([\s\S]*?)```/);
  return match ? match[1] : "";
}

function getCurrentSegment(content) {
  const block = getFirstTextBlock(content);
  const separatorIndex = block.indexOf("---");
  return separatorIndex === -1 ? block : block.slice(0, separatorIndex);
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !fs.existsSync(path.join(root, relativePath)));
  assert(missingFiles.length === 0, `Missing agent board files: ${missingFiles.join(", ")}`);
  assert(fs.existsSync(boardRoot), ".agent_board directory must exist.");

  const runState = read(".agent_board/RUN_STATE.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const blockers = read(".agent_board/BLOCKERS.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const decisions = read(".agent_board/DECISIONS.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const agents = read("AGENTS.md");
  const overlay = read("AGENTS.autopilot-overlay.md");
  const readme = read("README.md");
  const roadmap = read("docs/00_project_roadmap.md");

  const agentsDefaultModeBlock = (agents.match(/Default mode:\s*```text\s*([\s\S]*?)```/) || [])[1] || "";
  const startupDefaultV3Declared = agentsDefaultModeBlock.includes("Smart Standing Authorization v3") && !agentsDefaultModeBlock.includes("A4.8");
  const overlayStartupV3Declared = overlay.includes("Active startup model: Smart Standing Authorization v3.");
  const currentStatusSurfacesText = runState + "\n" + taskQueue + "\n" + checkpoint + "\n" + handoff + "\n" + readme + "\n" + roadmap;
  const currentModeDeclared = hasAll(currentStatusSurfacesText, [
    "current_autonomy_model: Smart Standing Authorization v3",
    "startup_default_model: Smart Standing Authorization v3",
    "a4_8_status: retained_as_green_lane_substrate",
    "a5_status: classified_by_lane_and_envelope"
  ]);
  const a48GreenSubstrateDeclared = hasAll(agents + overlay + currentStatusSurfacesText, [
    "A4.8",
    "Green Lane substrate"
  ]);
  const redLaneHardStopsPresent = hasAll(agents + overlay + currentStatusSurfacesText, [
    "push",
    "tag",
    "release",
    "deploy",
    "secret",
    "destructive"
  ]);
  const a5GateDeclared = hasAll(blockers + taskQueue + runState + handoff, [
    "A5",
    "active authorization package",
    "production actions remain blocked"
  ]);
  const noExternalReadGateDeclared = hasAll(blockers + taskQueue + checkpoint, [
    "real VCPChat",
    "real VCPToolBox",
    "real manifest"
  ]);
  const realExecutionGateDeclared = hasAll(blockers + taskQueue + checkpoint, [
    "plugin",
    "API",
    "DailyNote",
    "VCP memory",
    "image"
  ]);
  const remoteActionGateDeclared = hasAll(blockers + taskQueue + runState, [
    "push",
    "tag",
    "release"
  ]);
  const validationSnapshotPresent = hasAll(validationLog + runState + handoff, [
    "scripts/validate_mvp.ps1",
    "scripts/validate-agent-image-lab-local.ps1",
    "node scripts/validate_runtime_prototype_suite.js",
    "git diff --check"
  ]);
  const handoffResumePromptPresent = hasAll(handoff, [
    "AGENTS.autopilot-overlay.md",
    ".agent_board/*",
    "不要读取真实 VCPChat/VCPToolBox",
    "用中文汇报"
  ]);
  const overlaySeparationDecisionPresent = hasAll(decisions, [
    "Overlay, not overwrite",
    "Keep overlay separate from root AGENTS.md"
  ]);
  const localWorkStateDeclared = hasAll(runState + handoff, [
    "Worktree:",
    "Validator Governance Chain v1",
    "Push/tag/release"
  ]);

  const aheadBehind = getAheadBehind();
  const gitStatusShort = getGitStatusShort();
  const currentPhase = getCurrentPhaseBlock(runState);
  const branchIsSynced = aheadBehind && aheadBehind.behind === 0 && aheadBehind.ahead === 0;
  const worktreeIsClean = gitStatusShort === "";
  const stalePostPushPatterns = [
    "completed_validated_pending_guarded_commit_push",
    "completed_validated_pending_guarded_commit_and_push",
    "guarded commit and push pending",
    "commit and push pending"
  ];
  const currentStatusSurfaces = [
    currentPhase.block,
    getCurrentSegment(handoff),
    getCurrentSegment(checkpoint),
    getCurrentSegment(taskQueue)
  ].join("\n");
  const stalePostPushMatches = stalePostPushPatterns.filter((pattern) => currentStatusSurfaces.includes(pattern));
  const postPushStatusSyncVerified = !branchIsSynced || !worktreeIsClean || stalePostPushMatches.length === 0;
  const terminalStatusSurfaceSyncDetected =
    currentStatusSurfaces.includes("terminal_status_surface_sync: true") ||
    currentStatusSurfaces.includes("no_followup_agent_board_write_after_push: true") ||
    currentStatusSurfaces.includes("post_push_followup: read_only_remote_sync_only");
  const terminalStatusSurfaceSyncVerified = !terminalStatusSurfaceSyncDetected || hasAll(currentStatusSurfaces, [
    "terminal_status_surface_sync: true",
    "post_push_followup: read_only_remote_sync_only",
    "no_followup_agent_board_write_after_push: true",
  ]);
  const statusSurfaceSyncCommitRecommendsAnotherStatusSurfaceCommit =
    currentStatusSurfaces.includes("terminal_status_surface_sync: true") &&
    (
      currentStatusSurfaces.includes("optional exact-file commit of .agent_board status-surface sync") ||
      currentStatusSurfaces.includes("optional exact-file commit of this .agent_board status-surface sync") ||
      currentStatusSurfaces.includes("exact-file local commit of this .agent_board status-surface sync") ||
      currentStatusSurfaces.includes("commit and push this terminal status-surface sync") ||
      currentStatusSurfaces.includes("commit this terminal status-surface sync") ||
      currentStatusSurfaces.includes("push this terminal status-surface sync")
    );
  const statusSurfaceRecursionStopRuleDeclared = hasAll(agents + currentStatusSurfaces, [
    "Status-surface recursion stop rule",
    "terminal_status_surface_sync: true",
    "post_push_followup: read_only_remote_sync_only",
    "no_followup_agent_board_write_after_push: true",
  ]);

  const phaseFreshnessVerified = hasAll(runState + handoff + checkpoint + taskQueue, [
    "Validator Governance Chain v1: closed",
    "batch_005_allowed_now: false",
    "production_candidate_002_allowed_now: false",
    "memory_write_path_allowed_now: false"
  ]);

  assert(startupDefaultV3Declared, "AGENTS.md must declare Smart Standing Authorization v3 as Default mode and not A4.8.");
  assert(overlayStartupV3Declared, "AGENTS.autopilot-overlay.md must declare v3 as the active startup model.");
  assert(currentModeDeclared, "Current status surfaces must declare Smart Standing Authorization v3 startup defaults.");
  assert(a48GreenSubstrateDeclared, "A4.8 must be declared as Green Lane substrate.");
  assert(redLaneHardStopsPresent, "Red Lane hard stops must remain declared.");
  assert(a5GateDeclared, "Agent board must declare A5 production-execution gate.");
  assert(noExternalReadGateDeclared, "Agent board must declare external-read gates.");
  assert(realExecutionGateDeclared, "Agent board must declare real-execution gates.");
  assert(remoteActionGateDeclared, "Agent board must declare remote-action gates.");
  assert(validationSnapshotPresent, "Agent board must include current validation snapshot.");
  assert(handoffResumePromptPresent, "Agent board handoff must include guarded resume prompt.");
  assert(overlaySeparationDecisionPresent, "Agent board decisions must keep overlay separate from root AGENTS.md.");
  assert(localWorkStateDeclared, "Agent board must declare current local work state.");
  assert(
    postPushStatusSyncVerified,
    `Current phase ${currentPhase.phaseId || "(unknown)"} still has post-push stale wording while master equals origin/master and the worktree is clean: ${stalePostPushMatches.join(", ")}. Run post-push status sync and use completed_remote_synced_after_guarded_push or equivalent synced wording.`
  );
  assert(terminalStatusSurfaceSyncVerified, "Terminal status-surface sync must declare terminal_status_surface_sync, read-only post-push followup, and no follow-up .agent_board write.");
  assert(!statusSurfaceSyncCommitRecommendsAnotherStatusSurfaceCommit, "Terminal status-surface sync must not recommend another status-surface commit; after push, use read-only remote sync only.");
  assert(statusSurfaceRecursionStopRuleDeclared, "Status-surface recursion stop rule must be declared in AGENTS.md and current status surfaces.");
  assert(phaseFreshnessVerified, "Agent board phase freshness check failed: stale board state detected (governance chain / v7.170 state not reflected).");

  const result = {
    passed: true,
    agent_board_state: {
      required_files_present: true,
      current_mode_declared: currentModeDeclared,
      startup_default_v3_declared: startupDefaultV3Declared,
      overlay_startup_v3_declared: overlayStartupV3Declared,
      a4_8_green_lane_substrate_declared: a48GreenSubstrateDeclared,
      red_lane_hard_stops_present: redLaneHardStopsPresent,
      a5_gate_declared: a5GateDeclared,
      no_external_read_gate_declared: noExternalReadGateDeclared,
      real_execution_gate_declared: realExecutionGateDeclared,
      remote_action_gate_declared: remoteActionGateDeclared,
      validation_snapshot_present: validationSnapshotPresent,
      handoff_resume_prompt_present: handoffResumePromptPresent,
      overlay_separation_decision_present: overlaySeparationDecisionPresent,
      local_work_state_declared: localWorkStateDeclared,
      post_push_status_sync_verified: postPushStatusSyncVerified,
      terminal_status_surface_sync_detected: terminalStatusSurfaceSyncDetected,
      terminal_status_surface_sync_verified: terminalStatusSurfaceSyncVerified,
      status_surface_recursion_stop_rule_declared: statusSurfaceRecursionStopRuleDeclared,
      status_surface_sync_commit_recommends_another_status_surface_commit: statusSurfaceSyncCommitRecommendsAnotherStatusSurfaceCommit,
      stale_post_push_patterns_checked: stalePostPushPatterns,
      stale_post_push_matches: stalePostPushMatches,
      current_branch: aheadBehind ? aheadBehind.branch : "unavailable",
      upstream_ref: aheadBehind ? aheadBehind.upstream : "unavailable",
      ahead_behind: aheadBehind ? aheadBehind.raw : "unavailable",
      git_status_short: gitStatusShort === "" ? "clean" : gitStatusShort || "unavailable",
      current_phase_checked: currentPhase.phaseId,
      phase_freshness_verified: phaseFreshnessVerified,
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
