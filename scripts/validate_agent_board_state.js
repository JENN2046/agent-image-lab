const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
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

  const currentModeDeclared = hasAll(runState + taskQueue, ["A4 — Sustained Local Autopilot"]);
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
    "v7.45 cdp read-only attempt record",
    "Push/tag/release"
  ]);

  assert(currentModeDeclared, "Agent board must declare A4 sustained local autopilot mode.");
  assert(a5GateDeclared, "Agent board must declare A5 production-execution gate.");
  assert(noExternalReadGateDeclared, "Agent board must declare external-read gates.");
  assert(realExecutionGateDeclared, "Agent board must declare real-execution gates.");
  assert(remoteActionGateDeclared, "Agent board must declare remote-action gates.");
  assert(validationSnapshotPresent, "Agent board must include current validation snapshot.");
  assert(handoffResumePromptPresent, "Agent board handoff must include guarded resume prompt.");
  assert(overlaySeparationDecisionPresent, "Agent board decisions must keep overlay separate from root AGENTS.md.");
  assert(localWorkStateDeclared, "Agent board must declare current local work state.");

  const result = {
    passed: true,
    agent_board_state: {
      required_files_present: true,
      current_mode_declared: currentModeDeclared,
      a5_gate_declared: a5GateDeclared,
      no_external_read_gate_declared: noExternalReadGateDeclared,
      real_execution_gate_declared: realExecutionGateDeclared,
      remote_action_gate_declared: remoteActionGateDeclared,
      validation_snapshot_present: validationSnapshotPresent,
      handoff_resume_prompt_present: handoffResumePromptPresent,
      overlay_separation_decision_present: overlaySeparationDecisionPresent,
      local_work_state_declared: localWorkStateDeclared,
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
