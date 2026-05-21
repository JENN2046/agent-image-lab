const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const runtimeExamplePath = "tests/schema_examples/autopilot_goal_decomposition_runtime.example.json";

const guardFlags = [
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "dependency_change_performed",
  "runtime_probe_performed",
  "secret_value_read_performed",
  "push_tag_release_deploy_performed"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function stableTask(task) {
  return {
    task_id: task.task_id,
    source_step_id: task.source_step_id,
    objective: task.objective,
    lane: task.lane,
    status: task.status,
    validation_required: task.validation_required || [],
    envelope_ref: task.envelope_ref || null,
    receipt_required: task.receipt_required === true,
    budget_checked: task.budget_checked === true,
    push_allowed: task.push_allowed === true,
    stop_conditions: task.stop_conditions || []
  };
}

function materializeRuntime(runtime) {
  assert(runtime && typeof runtime === "object", "Runtime object is required");
  assert(runtime.goal && runtime.goal.goal_id, "Runtime goal is required");
  assert(runtime.route_plan && Array.isArray(runtime.route_plan.route_steps), "Runtime route_plan.route_steps is required");
  assert(runtime.task_queue && Array.isArray(runtime.task_queue.tasks), "Runtime task_queue.tasks is required");
  assert(Array.isArray(runtime.blocked_red_items), "Runtime blocked_red_items is required");
  assert(runtime.next_safe_task && runtime.next_safe_task.task_id, "Runtime next_safe_task is required");
  assert(runtime.guard && typeof runtime.guard === "object", "Runtime guard is required");

  const redStepIds = new Set(runtime.route_plan.route_steps.filter((step) => step.lane === "Red").map((step) => step.step_id));
  const executableTasks = runtime.task_queue.tasks.map(stableTask);
  for (const task of executableTasks) {
    assert(task.lane === "Green" || task.lane === "Amber", `Executable task ${task.task_id} must be Green or Amber`);
    assert(!redStepIds.has(task.source_step_id), `Executable task ${task.task_id} must not come from a Red route step`);
    if (task.lane === "Amber") {
      assert(task.envelope_ref, `Amber executable task ${task.task_id} requires envelope_ref`);
      assert(task.receipt_required === true, `Amber executable task ${task.task_id} requires receipt`);
      assert(task.budget_checked === true, `Amber executable task ${task.task_id} must be budget_checked`);
    }
  }

  const nextTask = executableTasks.find((task) => task.task_id === runtime.next_safe_task.task_id);
  assert(nextTask, "next_safe_task must reference an executable task");
  assert(nextTask.lane === runtime.next_safe_task.lane, "next_safe_task lane must match executable task");
  assert(nextTask.lane === "Green" || (nextTask.lane === "Amber" && nextTask.envelope_ref && nextTask.receipt_required && nextTask.budget_checked), "next_safe_task must be Green or valid budgeted Amber");

  for (const item of runtime.blocked_red_items) {
    assert(item.source_step_id && redStepIds.has(item.source_step_id), `Blocked Red item ${item.item_id} must reference a Red route step`);
    assert(item.required_authorization_or_action, `Blocked Red item ${item.item_id} requires required_authorization_or_action`);
  }

  const sideEffectFlags = {};
  for (const flag of guardFlags) {
    assert(Object.prototype.hasOwnProperty.call(runtime.guard, flag), `Runtime guard missing ${flag}`);
    assert(runtime.guard[flag] === false, `Runtime guard ${flag} must be false`);
    sideEffectFlags[flag] = false;
  }

  const validationRequired = Array.from(new Set(executableTasks.flatMap((task) => task.validation_required))).sort();
  const receiptRequiredTasks = executableTasks
    .filter((task) => task.receipt_required)
    .map((task) => ({
      task_id: task.task_id,
      lane: task.lane,
      envelope_ref: task.envelope_ref
    }))
    .sort((a, b) => a.task_id.localeCompare(b.task_id));

  return {
    version: "v1",
    materializer_id: "materializer-autopilot-goal-decomposition-v1",
    source_runtime_id: runtime.runtime_id,
    goal_id: runtime.goal.goal_id,
    current_goal: runtime.goal.objective,
    route_steps: runtime.route_plan.route_steps.map((step) => ({
      step_id: step.step_id,
      objective: step.objective,
      lane: step.lane,
      status: step.status,
      validation_required: step.validation_required || [],
      validation_skip_reason: step.validation_skip_reason || null
    })),
    executable_tasks: executableTasks,
    blocked_red_items: runtime.blocked_red_items.map((item) => ({
      item_id: item.item_id,
      source_step_id: item.source_step_id,
      blocked_action: item.blocked_action,
      reason: item.reason,
      required_authorization_or_action: item.required_authorization_or_action
    })),
    next_safe_task: {
      task_id: runtime.next_safe_task.task_id,
      lane: runtime.next_safe_task.lane,
      reason: runtime.next_safe_task.reason
    },
    validation_required: validationRequired,
    receipt_required_tasks: receiptRequiredTasks,
    red_lane_summary: runtime.blocked_red_items.map((item) => ({
      blocked_action: item.blocked_action,
      required_authorization_or_action: item.required_authorization_or_action
    })),
    side_effect_flags: sideEffectFlags
  };
}

function main() {
  const runtime = readJson(runtimeExamplePath).autopilot_goal_decomposition_runtime;
  const materialized = materializeRuntime(runtime);
  process.stdout.write(`${JSON.stringify({ autopilot_goal_decomposition_materialized: materialized }, null, 2)}\n`);
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
  guardFlags,
  materializeRuntime,
  runtimeExamplePath
};
