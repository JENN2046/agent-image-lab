const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/AUTOPILOT_GOAL_COMPILER_V1.md",
  goalSchema: "schemas/autopilot_goal.schema.yaml",
  routePlanSchema: "schemas/autopilot_route_plan.schema.yaml",
  taskQueueSchema: "schemas/autopilot_task_queue.schema.yaml",
  runtimeDoc: "docs/AUTOPILOT_GOAL_DECOMPOSITION_RUNTIME.md",
  goalExample: "tests/schema_examples/autopilot_goal.example.json",
  routePlanExample: "tests/schema_examples/autopilot_route_plan.example.json",
  taskQueueExample: "tests/schema_examples/autopilot_task_queue.example.json",
  runtimeExample: "tests/schema_examples/autopilot_goal_decomposition_runtime.example.json",
  agents: "AGENTS.md",
  overlay: "AGENTS.autopilot-overlay.md",
  readme: "README.md",
  roadmap: "docs/00_project_roadmap.md",
  runState: ".agent_board/RUN_STATE.md",
  handoff: ".agent_board/HANDOFF.md",
  taskQueueSurface: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md"
};

const requiredDocComponents = [
  "Goal Compiler",
  "Current Truth Intake",
  "Route Option Analysis",
  "Route Selection",
  "Near-term Task Queue",
  "Lane Assignment",
  "Envelope Assignment For Amber Tasks",
  "Validation Plan",
  "Continuation Policy",
  "Stop Conditions",
  "Handoff / Resume Surface Update Rule"
];

const requiredGoalFields = [
  "goal_id",
  "objective",
  "requester_intent",
  "scope",
  "non_goals",
  "allowed_lanes",
  "forbidden_actions",
  "success_criteria",
  "validation_expectations",
  "stop_conditions"
];

const requiredRoutePlanFields = [
  "route_plan_id",
  "source_goal_id",
  "current_truth",
  "route_options",
  "selected_route",
  "rejected_routes",
  "risks",
  "lane_distribution",
  "validation_strategy",
  "next_decision_point"
];

const requiredTaskQueueFields = [
  "task_queue_id",
  "source_route_plan_id",
  "tasks"
];

const requiredTaskFields = [
  "task_id",
  "objective",
  "lane",
  "allowed_files",
  "forbidden_files",
  "allowed_actions",
  "forbidden_actions",
  "envelope_ref",
  "validation_required",
  "commit_allowed",
  "push_allowed",
  "stop_conditions",
  "receipt_required"
];

const legalLanes = ["Green", "Amber", "Red"];
const legalTaskStatuses = ["todo", "in_progress", "done", "blocked", "skipped"];

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

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values, label) {
  const missing = values.filter((value) => !content.includes(value));
  assert(missing.length === 0, `${label} missing: ${missing.join(", ")}`);
}

function assertOwnFields(object, fields, label) {
  const missing = fields.filter((field) => !Object.prototype.hasOwnProperty.call(object, field));
  assert(missing.length === 0, `${label} missing fields: ${missing.join(", ")}`);
}

function assertGuardFalse(guard, label) {
  assert(guard && typeof guard === "object", `${label} missing guard object`);
  for (const flag of guardFlags) {
    assert(Object.prototype.hasOwnProperty.call(guard, flag), `${label} missing guard flag ${flag}`);
    assert(guard[flag] === false, `${label} must keep ${flag}=false`);
  }
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(fs.existsSync(path.join(root, relativePath)), `Missing required file: ${relativePath}`);
  }

  const doc = read(files.doc);
  const runtimeDoc = read(files.runtimeDoc);
  const goalSchema = read(files.goalSchema);
  const routePlanSchema = read(files.routePlanSchema);
  const taskQueueSchema = read(files.taskQueueSchema);
  const goal = readJson(files.goalExample).autopilot_goal;
  const routePlan = readJson(files.routePlanExample).autopilot_route_plan;
  const taskQueue = readJson(files.taskQueueExample).autopilot_task_queue;
  const runtime = readJson(files.runtimeExample).autopilot_goal_decomposition_runtime;
  const agents = read(files.agents);
  const overlay = read(files.overlay);
  const startupSurfaces = [
    agents,
    overlay,
    read(files.readme),
    read(files.roadmap),
    read(files.runState),
    read(files.handoff),
    read(files.taskQueueSurface),
    read(files.checkpoint),
    doc
  ].join("\n");
  const defaultModeBlock = (agents.match(/Default mode:\s*```text\s*([\s\S]*?)```/) || [])[1] || "";

  includesAll(doc, requiredDocComponents, "Goal Compiler doc components");
  includesAll(doc, ["Green Lane", "Amber Lane", "Red Lane"], "Goal Compiler doc lanes");
  includesAll(doc + runtimeDoc, [
    "goal",
    "route_plan",
    "executable task_queue",
    "blocked_red_items",
    "next_safe_task",
    "execute only `next_safe_task`",
    "update `.agent_board`"
  ], "Goal decomposition runtime docs");
  assert(defaultModeBlock.includes("Smart Standing Authorization v3") && !defaultModeBlock.includes("A4.8"), "AGENTS.md Default mode must be Smart Standing Authorization v3, not A4.8");
  assert(overlay.includes("Active startup model: Smart Standing Authorization v3."), "Overlay must declare v3 active startup model");
  includesAll(startupSurfaces, [
    "current_autonomy_model: Smart Standing Authorization v3",
    "startup_default_model: Smart Standing Authorization v3",
    "a4_8_status: retained_as_green_lane_substrate",
    "A4.8",
    "Green Lane substrate"
  ], "startup model surfaces");
  includesAll(startupSurfaces, ["push", "tag", "release", "deploy", "secret", "destructive"], "startup Red Lane hard stops");
  includesAll(goalSchema, requiredGoalFields, "goal schema fields");
  includesAll(routePlanSchema, requiredRoutePlanFields, "route plan schema fields");
  includesAll(taskQueueSchema, requiredTaskQueueFields, "task queue schema fields");
  includesAll(taskQueueSchema, requiredTaskFields, "task queue task fields");
  includesAll(goalSchema + routePlanSchema + taskQueueSchema, legalLanes, "schema lane enum");

  assert(goal.version === "v1", "Goal example version must be v1");
  assert(goal.contract_type === "autopilot_goal", "Goal example contract_type mismatch");
  assert(routePlan.version === "v1", "Route plan example version must be v1");
  assert(routePlan.contract_type === "autopilot_route_plan", "Route plan example contract_type mismatch");
  assert(taskQueue.version === "v1", "Task queue example version must be v1");
  assert(taskQueue.contract_type === "autopilot_task_queue", "Task queue example contract_type mismatch");

  assertOwnFields(goal, requiredGoalFields, "Goal example");
  assertOwnFields(routePlan, requiredRoutePlanFields, "Route plan example");
  assertOwnFields(taskQueue, requiredTaskQueueFields, "Task queue example");
  assert(routePlan.source_goal_id === goal.goal_id, "Route plan source_goal_id must link to goal_id");
  assert(taskQueue.source_route_plan_id === routePlan.route_plan_id, "Task queue source_route_plan_id must link to route_plan_id");

  assert(Array.isArray(routePlan.route_options) && routePlan.route_options.length >= 3, "Route plan must include at least three route options");
  assert(routePlan.selected_route && routePlan.selected_route.route_id, "Route plan selected_route must include route_id");
  assert(Array.isArray(routePlan.rejected_routes) && routePlan.rejected_routes.length >= 1, "Route plan must include at least one rejected route");
  assert(Array.isArray(routePlan.validation_strategy) && routePlan.validation_strategy.length > 0, "Route plan validation_strategy must exist");
  assert(routePlan.route_options.every((route) => legalLanes.includes(route.lane)), "Every route option lane must be legal");
  assert(routePlan.rejected_routes.some((route) => route.lane === "Red"), "At least one rejected Red route is required");

  assert(Array.isArray(taskQueue.tasks) && taskQueue.tasks.length >= 3, "Task queue must include at least three tasks");
  const executableTaskIds = new Set(taskQueue.tasks.map((task) => task.task_id));
  for (const task of taskQueue.tasks) {
    assertOwnFields(task, requiredTaskFields, `Task ${task.task_id || "<missing>"}`);
    assert(legalLanes.includes(task.lane), `Task ${task.task_id} has illegal lane`);
    assert(Array.isArray(task.validation_required) && task.validation_required.length > 0, `Task ${task.task_id} must include validation_required`);
    assert(Array.isArray(task.stop_conditions) && task.stop_conditions.length > 0, `Task ${task.task_id} must include stop_conditions`);
    assert(task.push_allowed === false, `Task ${task.task_id} must keep push_allowed=false`);
    if (task.lane === "Amber") {
      assert(task.receipt_required === true, `Amber task ${task.task_id} must require receipt`);
      assert(typeof task.envelope_ref === "string" && task.envelope_ref.length > 0, `Amber task ${task.task_id} must include envelope_ref`);
    }
  }

  for (const route of routePlan.rejected_routes) {
    assert(!executableTaskIds.has(route.route_id), `Rejected route ${route.route_id} must not appear as executable task`);
  }

  assertGuardFalse(goal.guard, "Goal example");
  assertGuardFalse(routePlan.guard, "Route plan example");
  assertGuardFalse(taskQueue.guard, "Task queue example");

  assert(runtime.version === "v1", "Runtime example version must be v1");
  assert(runtime.contract_type === "autopilot_goal_decomposition_runtime", "Runtime example contract_type mismatch");
  assert(runtime.trigger === "non_single_step_goal", "Runtime example must trigger on non_single_step_goal");
  assert(runtime.goal && runtime.goal.goal_id === goal.goal_id, "Runtime goal must link to goal example");
  assert(runtime.route_plan && runtime.route_plan.source_goal_id === runtime.goal.goal_id, "Runtime route_plan must link to runtime goal");
  assert(runtime.task_queue && runtime.task_queue.source_route_plan_id === runtime.route_plan.route_plan_id, "Runtime task_queue must link to runtime route_plan");
  assert(Array.isArray(runtime.route_plan.route_steps) && runtime.route_plan.route_steps.length >= 3, "Runtime route_plan must include at least three route_steps");
  assert(Array.isArray(runtime.task_queue.tasks) && runtime.task_queue.tasks.length >= 1, "Runtime task_queue must include executable tasks");
  assert(Array.isArray(runtime.blocked_red_items) && runtime.blocked_red_items.length >= 1, "Runtime must include blocked_red_items");

  const runtimeTaskIds = new Set(runtime.task_queue.tasks.map((task) => task.task_id));
  const runtimeTaskStepIds = new Set(runtime.task_queue.tasks.map((task) => task.source_step_id));
  const redStepIds = new Set(runtime.route_plan.route_steps.filter((step) => step.lane === "Red").map((step) => step.step_id));
  for (const step of runtime.route_plan.route_steps) {
    assert(step.step_id && step.objective && step.lane && step.status, `Runtime route step missing required identity fields`);
    assert(legalLanes.includes(step.lane), `Runtime route step ${step.step_id} lane must be legal`);
    assert(legalTaskStatuses.includes(step.status), `Runtime route step ${step.step_id} status must be legal`);
    assert(Array.isArray(step.stop_conditions) && step.stop_conditions.length > 0, `Runtime route step ${step.step_id} must include stop_conditions`);
    assert(
      (Array.isArray(step.validation_required) && step.validation_required.length > 0) ||
        (typeof step.validation_skip_reason === "string" && step.validation_skip_reason.length > 0),
      `Runtime route step ${step.step_id} must include validation_required or validation_skip_reason`
    );
  }
  for (const redStepId of redStepIds) {
    assert(!runtimeTaskStepIds.has(redStepId), `Red route step ${redStepId} must not appear in executable task queue`);
    assert(runtime.blocked_red_items.some((item) => item.source_step_id === redStepId), `Red route step ${redStepId} must be recorded in blocked_red_items`);
  }
  for (const task of runtime.task_queue.tasks) {
    assert(task.task_id && task.source_step_id && task.objective && task.lane && task.status, "Runtime task missing required identity fields");
    assert(["Green", "Amber"].includes(task.lane), `Runtime executable task ${task.task_id} must be Green or Amber`);
    assert(legalTaskStatuses.includes(task.status), `Runtime task ${task.task_id} status must be legal`);
    assert(Array.isArray(task.validation_required) && task.validation_required.length > 0, `Runtime task ${task.task_id} must include validation_required`);
    assert(task.push_allowed === false, `Runtime task ${task.task_id} must keep push_allowed=false`);
    if (task.lane === "Amber") {
      assert(task.receipt_required === true, `Runtime Amber task ${task.task_id} must require receipt`);
      assert(typeof task.envelope_ref === "string" && task.envelope_ref.length > 0, `Runtime Amber task ${task.task_id} must include envelope_ref`);
      assert(task.budget_checked === true, `Runtime Amber task ${task.task_id} must be budget_checked`);
    }
  }
  assert(runtime.task_queue.tasks.filter((task) => task.status === "in_progress").length <= 1, "Runtime must have at most one in_progress task");
  assert(runtime.next_safe_task && runtime.next_safe_task.task_id, "Runtime next_safe_task must exist while executable tasks remain");
  assert(runtimeTaskIds.has(runtime.next_safe_task.task_id), "Runtime next_safe_task must reference an executable task");
  assert(["Green", "Amber"].includes(runtime.next_safe_task.lane), "Runtime next_safe_task must be Green or Amber");
  const nextSafeTask = runtime.task_queue.tasks.find((task) => task.task_id === runtime.next_safe_task.task_id);
  assert(nextSafeTask.lane === runtime.next_safe_task.lane, "Runtime next_safe_task lane must match executable task");
  if (runtime.next_safe_task.lane === "Amber") {
    assert(nextSafeTask.receipt_required === true && nextSafeTask.envelope_ref && nextSafeTask.budget_checked === true, "Runtime next_safe_task Amber must be valid budgeted Amber");
  }
  for (const item of runtime.blocked_red_items) {
    assert(item.item_id && item.source_step_id && item.blocked_action && item.reason && item.required_authorization_or_action, "Blocked Red item missing required fields");
    assert(item.lane === "Red", `Blocked Red item ${item.item_id} must have lane Red`);
  }
  assert(runtime.agent_board_sync_required === true, "Runtime must require agent board sync");
  assert(runtime.continuation_policy && runtime.continuation_policy.execute_only_next_safe_task === true, "Runtime must execute only next_safe_task");
  assert(runtime.continuation_policy.record_receipt_if_amber === true, "Runtime must record receipt if Amber");
  assertGuardFalse(runtime.guard, "Goal decomposition runtime example");

  const result = {
    passed: true,
    phase: "autopilot_goal_compiler_v1",
    goal_id: goal.goal_id,
    route_plan_id: routePlan.route_plan_id,
    task_queue_id: taskQueue.task_queue_id,
    doc_components_verified: requiredDocComponents.length,
    schemas_verified: [
      files.goalSchema,
      files.routePlanSchema,
      files.taskQueueSchema
    ],
    examples_verified: [
      files.goalExample,
      files.routePlanExample,
      files.taskQueueExample,
      files.runtimeExample
    ],
    runtime_decomposition_verified: true,
    blocked_red_items_verified: runtime.blocked_red_items.length,
    next_safe_task_verified: runtime.next_safe_task.task_id,
    executable_task_queue_verified: true,
    at_most_one_in_progress_verified: true,
    agent_board_sync_required: true,
    task_count: taskQueue.tasks.length,
    amber_tasks_with_receipts_verified: taskQueue.tasks.filter((task) => task.lane === "Amber").length,
    rejected_red_routes_verified: routePlan.rejected_routes.filter((route) => route.lane === "Red").length,
    startup_default_v3_verified: true,
    a4_8_green_lane_substrate_verified: true,
    red_lane_hard_stops_verified: true,
    validation_strategy_present: true,
    stop_conditions_present: true,
    red_routes_excluded_from_executable_tasks: true,
    push_allowed_default_false: true,
    no_current_external_execution_signals: true,
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

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
}
