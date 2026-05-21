const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const materializedSnapshotPath = "tests/schema_examples/autopilot_goal_decomposition_materialized.example.json";

const boardFiles = [
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/DECISIONS.md",
  ".agent_board/AUTOPILOT_LEDGER.md"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function includesAll(content, values) {
  return values.filter((value) => !content.includes(value));
}

function reconcileAgentBoardQueue(materialized) {
  assert(materialized && typeof materialized === "object", "Materialized snapshot is required");
  assert(materialized.goal_id && materialized.current_goal, "Materialized snapshot requires goal_id and current_goal");
  assert(Array.isArray(materialized.executable_tasks), "Materialized snapshot requires executable_tasks");
  assert(Array.isArray(materialized.blocked_red_items), "Materialized snapshot requires blocked_red_items");
  assert(materialized.next_safe_task && materialized.next_safe_task.task_id, "Materialized snapshot requires next_safe_task");

  const contents = new Map();
  const missingRequiredSurfaces = [];
  for (const relativePath of boardFiles) {
    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath)) {
      missingRequiredSurfaces.push(relativePath);
      contents.set(relativePath, "");
    } else {
      contents.set(relativePath, read(relativePath));
    }
  }

  const taskQueue = contents.get(".agent_board/TASK_QUEUE.md") || "";
  const runState = contents.get(".agent_board/RUN_STATE.md") || "";
  const checkpoint = contents.get(".agent_board/CHECKPOINT.md") || "";
  const combined = Array.from(contents.values()).join("\n");

  const requiredTaskQueueTokens = [
    materialized.goal_id,
    materialized.current_goal,
    materialized.next_safe_task.task_id,
    "executable_queue",
    "blocked_red_items",
    "next_safe_task"
  ];
  for (const task of materialized.executable_tasks) {
    requiredTaskQueueTokens.push(task.task_id, task.source_step_id, task.lane);
  }
  for (const item of materialized.blocked_red_items) {
    requiredTaskQueueTokens.push(item.item_id, item.blocked_action, item.required_authorization_or_action);
  }

  const requiredRunStateTokens = [
    "current_autonomy_model: Smart Standing Authorization v3",
    "phase: agent_board_queue_reconciler_v1",
    "phase_id: agent_board_queue_reconciler_v1",
    "current_task_id: agent_board_queue_reconciler_v1",
    "stage: Green Lane local queue reconciliation validation",
    "ahead_count_before_edit: 2",
    "push_allowed: false"
  ];

  const requiredCheckpointTokens = [
    "phase: agent_board_queue_reconciler_v1",
    "latest_validation",
    "commit_message: test: add agent board queue reconciler",
    "no push",
    "not_performed"
  ];

  const taskQueueMissing = includesAll(taskQueue, requiredTaskQueueTokens);
  const runStateMissing = includesAll(runState, requiredRunStateTokens);
  const checkpointMissing = includesAll(checkpoint, requiredCheckpointTokens);

  const queueDriftDetected =
    missingRequiredSurfaces.length > 0 ||
    taskQueueMissing.length > 0 ||
    runStateMissing.length > 0 ||
    checkpointMissing.length > 0;

  return {
    version: "v1",
    phase: "agent_board_queue_reconciler_v1",
    source_snapshot: materializedSnapshotPath,
    agent_board_files_checked: boardFiles,
    matched_goal_id: !taskQueueMissing.includes(materialized.goal_id) && combined.includes(materialized.goal_id),
    matched_current_goal: !taskQueueMissing.includes(materialized.current_goal),
    matched_executable_queue: materialized.executable_tasks.map((task) => ({
      task_id: task.task_id,
      source_step_id: task.source_step_id,
      lane: task.lane,
      matched: !taskQueueMissing.includes(task.task_id) && !taskQueueMissing.includes(task.source_step_id)
    })),
    matched_next_safe_task: {
      task_id: materialized.next_safe_task.task_id,
      matched: !taskQueueMissing.includes(materialized.next_safe_task.task_id)
    },
    matched_blocked_red_items: materialized.blocked_red_items.map((item) => ({
      item_id: item.item_id,
      blocked_action: item.blocked_action,
      matched: !taskQueueMissing.includes(item.item_id) && !taskQueueMissing.includes(item.blocked_action)
    })),
    queue_drift_detected: queueDriftDetected,
    missing_required_surfaces: missingRequiredSurfaces,
    warnings: [],
    result: queueDriftDetected ? "failed" : "passed",
    details: {
      task_queue_missing: taskQueueMissing,
      run_state_missing: runStateMissing,
      checkpoint_missing: checkpointMissing
    }
  };
}

function main() {
  const materialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const report = reconcileAgentBoardQueue(materialized);
  process.stdout.write(`${JSON.stringify({ agent_board_queue_reconciliation: report }, null, 2)}\n`);
  if (report.result !== "passed") {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  boardFiles,
  materializedSnapshotPath,
  reconcileAgentBoardQueue
};
