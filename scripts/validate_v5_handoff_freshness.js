const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const recordPhase = "v5.8 handoff freshness validation";
const expectedCurrentPhase = "v5.10 local true-loop candidate delivery closeout";

const boardFiles = [
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/DECISIONS.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md"
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
  const missingBoardFiles = boardFiles.filter((relativePath) => !exists(relativePath));
  assert(missingBoardFiles.length === 0, `Missing agent board files: ${missingBoardFiles.join(", ")}`);

  const requiredFiles = [
    "docs/135_v5_8_handoff_freshness_validation.md",
    "tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml",
    "scripts/validate_v5_handoff_freshness.js",
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    "scripts/validate_mvp.ps1",
    "scripts/validate_local_commit_scope.js"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v5.8 handoff freshness files: ${missingFiles.join(", ")}`);

  const blockers = read(".agent_board/BLOCKERS.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const validateMvp = read("scripts/validate_mvp.ps1");
  const localCommitScope = read("scripts/validate_local_commit_scope.js");
  const record = read("docs/135_v5_8_handoff_freshness_validation.md");
  const schema = read("tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml");

  const runStateCurrentPhase = extractTextBlock(runState, "Current Phase");
  const runStateCurrentStopStatus = extractTextBlock(runState, "Current Stop Status");
  const handoffSummary = extractTextBlock(handoff, "Handoff Summary");
  const handoffValidation = extractTextBlock(handoff, "Validation");

  const runStateCurrent =
    runStateCurrentPhase === expectedCurrentPhase &&
    runState.includes("node scripts/validate_v5_handoff_freshness.js: passed") &&
    runStateCurrentStopStatus === "not blocked";
  const handoffCurrent =
    handoffSummary.includes(`${expectedCurrentPhase} is active locally`) &&
    handoffValidation.includes("node scripts/validate_v5_handoff_freshness.js: passed");
  const taskQueueCurrent =
    taskQueue.includes("If user authorizes v5.10 version movement") &&
    taskQueue.includes("Completed v5.8 handoff freshness validation.") &&
    taskQueue.includes("Completed v5.9 expanded v5 index consistency validation.") &&
    taskQueue.includes("Completed v5.10 local true-loop candidate delivery closeout.");
  const checkpointCurrent =
    checkpoint.includes("v5.10 local: true-loop candidate delivery closeout added") &&
    checkpoint.includes("node scripts/validate_v5_handoff_freshness.js: passed");
  const validationLogCurrent =
    validationLog.includes("VALIDATION-20260506-V5-8") &&
    validationLog.includes("node scripts/validate_v5_handoff_freshness.js");
  const resumePromptPresent =
    handoff.includes("Exact Resume Prompt") &&
    handoff.includes("不要读取真实 VCPChat/VCPToolBox") &&
    handoff.includes("用中文汇报");
  const hardStopGatesPresent = includesAll(blockers + taskQueue + checkpoint, [
    "real VCPChat",
    "real VCPToolBox",
    "real manifest",
    "plugin",
    "DailyNote",
    "push",
    "tag",
    "release"
  ]);
  const noExecutionBoundaryPresent = includesAll(runState + record + schema, [
    "Plugin call: no",
    "API call: no",
    "DailyNote call: no",
    "VCP memory write: no",
    "Image creation: no"
  ]);
  const remoteActionGatePresent = includesAll(runState + handoff + taskQueue + record + schema, [
    "Commit/tag/push authorization: not active",
    "commit_authorized: false",
    "push_authorized: false",
    "tag_authorized: false",
    "release_authorized: false"
  ]);
  const externalReadGatePresent = includesAll(runState + handoff + record + schema, [
    "VCPChat read: no",
    "VCPToolBox read: no",
    "Real manifest read: no"
  ]);
  const blockedStateClear =
    runState.includes("not blocked") &&
    taskQueue.includes("### blocked") &&
    taskQueue.includes("none");
  const topIndexesUpdated =
    readme.includes(recordPhase) &&
    manifest.includes(recordPhase) &&
    roadmap.includes(recordPhase) &&
    releaseNotes.includes("Added v5.8 handoff freshness validation.");
  const validationSurfaceCurrent =
    checklist.includes("## v5.8 Handoff Freshness Validation 检查") &&
    validateMvp.includes("scripts/validate_v5_handoff_freshness.js") &&
    localCommitScope.includes("docs/135_v5_8_handoff_freshness_validation.md");

  assert(runStateCurrent, "RUN_STATE must reflect the actual current phase and validation.");
  assert(handoffCurrent, "HANDOFF must reflect the actual current phase and validation.");
  assert(taskQueueCurrent, "TASK_QUEUE must reflect the current v5 queue state.");
  assert(checkpointCurrent, "CHECKPOINT must reflect the current v5.10 checkpoint state.");
  assert(validationLogCurrent, "VALIDATION_LOG must include v5.8 validation entry.");
  assert(resumePromptPresent, "HANDOFF must preserve exact resume prompt.");
  assert(hardStopGatesPresent, "Agent board must preserve hard stop gates.");
  assert(noExecutionBoundaryPresent, "v5.8 must preserve no-execution boundary.");
  assert(remoteActionGatePresent, "v5.8 must preserve remote action gate.");
  assert(externalReadGatePresent, "v5.8 must preserve external read gate.");
  assert(blockedStateClear, "v5.8 must record clear blocked state.");
  assert(topIndexesUpdated, "v5.8 top-level indexes must be updated.");
  assert(validationSurfaceCurrent, "v5.8 validation surface must be current.");

  const result = {
    passed: true,
    handoff_freshness: {
      record_phase: recordPhase,
      current_phase: expectedCurrentPhase,
      run_state_current_phase: runStateCurrentPhase,
      agent_board_files_present: true,
      run_state_current: runStateCurrent,
      handoff_current: handoffCurrent,
      task_queue_current: taskQueueCurrent,
      checkpoint_current: checkpointCurrent,
      validation_log_current: validationLogCurrent,
      resume_prompt_present: resumePromptPresent,
      hard_stop_gates_present: hardStopGatesPresent,
      no_execution_boundary_present: noExecutionBoundaryPresent,
      remote_action_gate_present: remoteActionGatePresent,
      external_read_gate_present: externalReadGatePresent,
      blocked_state_clear: blockedStateClear,
      top_indexes_updated: topIndexesUpdated,
      validation_surface_current: validationSurfaceCurrent,
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
