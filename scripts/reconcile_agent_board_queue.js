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
  const handoff = contents.get(".agent_board/HANDOFF.md") || "";
  const combined = Array.from(contents.values()).join("\n");

  const historicalTaskQueueTokens = [
    materialized.goal_id,
    materialized.current_goal,
    materialized.next_safe_task.task_id,
    "executable_queue",
    "blocked_red_items",
    "next_safe_task"
  ];
  for (const task of materialized.executable_tasks) {
    historicalTaskQueueTokens.push(task.task_id, task.source_step_id, task.lane);
  }
  for (const item of materialized.blocked_red_items) {
    historicalTaskQueueTokens.push(item.item_id, item.blocked_action, item.required_authorization_or_action);
  }

  const requiredCurrentStateTokens = [
    "current_autonomy_model: Smart Standing Authorization v3",
    "local_full_autopilot_ready_closeout",
    "COMPLETED_VALIDATED_LOCAL_FULL_AUTOPILOT_READY",
    "push_allowed: false",
    "push_status: not_performed",
    "owner_push_safety_gate_after_review"
  ];

  const requiredHistoricalEvidenceTokens = [
    ...historicalTaskQueueTokens,
    "phase: agent_board_queue_reconciler_v1",
    "latest_validation",
    "commit_message: test: add agent board queue reconciler",
    "no push",
    "not_performed"
  ];

  const currentStateMissing = includesAll(runState + "\n" + handoff + "\n" + checkpoint + "\n" + taskQueue, requiredCurrentStateTokens);
  const historicalEvidenceMissing = includesAll(combined, requiredHistoricalEvidenceTokens);
  const blockedRedPushRecorded = materialized.blocked_red_items.every((item) => combined.includes(item.item_id) && combined.includes(item.blocked_action));
  const readyForPushSafetyGateRecorded = combined.includes("owner_push_safety_gate_after_review");
  const historicalEvidenceWarning = historicalEvidenceMissing.length > 0
    ? "Historical fixture queue evidence is incomplete, but current final-state reconciliation is evaluated separately."
    : null;

  const queueDriftDetected =
    missingRequiredSurfaces.length > 0 ||
    currentStateMissing.length > 0 ||
    !blockedRedPushRecorded ||
    !readyForPushSafetyGateRecorded;

  return {
    version: "v1",
    phase: "agent_board_queue_reconciler_v1",
    source_snapshot: materializedSnapshotPath,
    agent_board_files_checked: boardFiles,
    matched_goal_id: !historicalEvidenceMissing.includes(materialized.goal_id) && combined.includes(materialized.goal_id),
    matched_current_goal: !historicalEvidenceMissing.includes(materialized.current_goal),
    matched_executable_queue: materialized.executable_tasks.map((task) => ({
      task_id: task.task_id,
      source_step_id: task.source_step_id,
      lane: task.lane,
      matched: !historicalEvidenceMissing.includes(task.task_id) && !historicalEvidenceMissing.includes(task.source_step_id)
    })),
    matched_next_safe_task: {
      task_id: materialized.next_safe_task.task_id,
      evidence_type: "historical_test_fixture",
      matched: !historicalEvidenceMissing.includes(materialized.next_safe_task.task_id)
    },
    matched_blocked_red_items: materialized.blocked_red_items.map((item) => ({
      item_id: item.item_id,
      blocked_action: item.blocked_action,
      matched: !historicalEvidenceMissing.includes(item.item_id) && !historicalEvidenceMissing.includes(item.blocked_action)
    })),
    current_state_matches: {
      active_model: combined.includes("current_autonomy_model: Smart Standing Authorization v3"),
      no_push_boundary: combined.includes("push_allowed: false") && combined.includes("push_status: not_performed"),
      final_closeout_phase: combined.includes("local_full_autopilot_ready_closeout"),
      full_autopilot_ready_status: combined.includes("COMPLETED_VALIDATED_LOCAL_FULL_AUTOPILOT_READY"),
      current_next_boundary: readyForPushSafetyGateRecorded,
      current_next_boundary_type: combined.includes("owner_push_safety_gate_after_review") && combined.includes("push"),
      blocked_red_push_item: blockedRedPushRecorded
    },
    current_state_missing: currentStateMissing,
    historical_evidence_matches: {
      agent_board_queue_reconciler_v1: historicalEvidenceMissing.length === 0,
      fixture_goal_id: !historicalEvidenceMissing.includes(materialized.goal_id),
      fixture_current_goal: !historicalEvidenceMissing.includes(materialized.current_goal),
      fixture_next_safe_task: !historicalEvidenceMissing.includes(materialized.next_safe_task.task_id)
    },
    historical_evidence_missing: historicalEvidenceMissing,
    historical_evidence_warning: historicalEvidenceWarning,
    queue_drift_detected: queueDriftDetected,
    missing_required_surfaces: missingRequiredSurfaces,
    warnings: historicalEvidenceWarning ? [historicalEvidenceWarning] : [],
    result: queueDriftDetected ? "failed" : "passed",
    details: {
      current_boundary: "owner_push_safety_gate_after_review",
      current_boundary_type: "Red push-safety-gate boundary",
      current_state_missing: currentStateMissing,
      historical_evidence_missing: historicalEvidenceMissing
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
