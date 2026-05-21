const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const materializedSnapshotPath = "tests/schema_examples/autopilot_goal_decomposition_materialized.example.json";

const sideEffectFlags = {
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  dependency_change_performed: false,
  runtime_probe_performed: false,
  secret_value_read_performed: false,
  push_tag_release_deploy_performed: false
};

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

function isValidAmber(task) {
  return task.lane === "Amber" && task.envelope_ref && task.receipt_required === true && task.budget_checked === true && task.push_allowed === false;
}

function isExecutable(task) {
  return task.lane === "Green" || isValidAmber(task);
}

function rank(task) {
  const laneRank = task.lane === "Green" ? 0 : 1;
  const statusRank = task.status === "in_progress" ? 0 : task.status === "todo" ? 1 : 2;
  return `${laneRank}:${statusRank}:${task.task_id}`;
}

function orchestrateNextSafeTask(materialized) {
  assert(materialized && typeof materialized === "object", "Materialized snapshot is required");
  assert(Array.isArray(materialized.executable_tasks), "Materialized snapshot requires executable_tasks");
  assert(Array.isArray(materialized.blocked_red_items), "Materialized snapshot requires blocked_red_items");
  assert(materialized.next_safe_task && materialized.next_safe_task.task_id, "Materialized snapshot requires next_safe_task");

  const executable = materialized.executable_tasks.filter((task) => ["todo", "in_progress"].includes(task.status) && isExecutable(task));
  executable.sort((a, b) => rank(a).localeCompare(rank(b)));
  const selected = executable[0] || null;
  assert(selected, "At least one executable next safe task is required");
  assert(selected.task_id === materialized.next_safe_task.task_id, "Selected task must match materialized next_safe_task");
  assert(selected.lane === "Green" || isValidAmber(selected), "Selected task must be Green or valid budgeted Amber");

  return {
    version: "v1",
    phase: "next_safe_task_orchestrator_v1",
    source_snapshot: materializedSnapshotPath,
    goal_id: materialized.goal_id,
    selected_next_safe_task: {
      task_id: selected.task_id,
      lane: selected.lane,
      status_before: selected.status,
      orchestrator_decision: "select_for_local_execution",
      execution_allowed_now: true,
      external_execution_allowed_now: false,
      validation_required: selected.validation_required,
      receipt_required: selected.receipt_required,
      envelope_ref: selected.envelope_ref
    },
    eligible_executable_tasks: executable.map((task) => ({
      task_id: task.task_id,
      lane: task.lane,
      status: task.status,
      valid_budgeted_amber: task.lane === "Amber" ? isValidAmber(task) : false
    })),
    blocked_red_items: materialized.blocked_red_items.map((item) => ({
      item_id: item.item_id,
      blocked_action: item.blocked_action,
      required_authorization_or_action: item.required_authorization_or_action
    })),
    advancement_preview: {
      task_id: selected.task_id,
      from_status: selected.status,
      to_status_after_successful_validation: "done",
      writes_real_state_now: false
    },
    continuation_decision: {
      continue_automatically: true,
      stop_reason: null,
      red_lane_encountered: false
    },
    side_effect_flags: sideEffectFlags
  };
}

function main() {
  const materialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const report = orchestrateNextSafeTask(materialized);
  process.stdout.write(`${JSON.stringify({ next_safe_task_orchestration: report }, null, 2)}\n`);
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
  materializedSnapshotPath,
  orchestrateNextSafeTask,
  sideEffectFlags
};
