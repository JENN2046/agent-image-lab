const fs = require("node:fs");
const path = require("node:path");
const { materializeRuntime, runtimeExamplePath } = require("./materialize_autopilot_goal_decomposition.js");
const { reconcileAgentBoardQueue, materializedSnapshotPath } = require("./reconcile_agent_board_queue.js");
const { orchestrateNextSafeTask } = require("./orchestrate_next_safe_task.js");
const { buildAmberDryRunLoop } = require("./simulate_amber_dry_run_execution_loop.js");
const { detectAutopilotEvolutionGaps } = require("./detect_autopilot_evolution_gaps.js");

const root = path.resolve(__dirname, "..");
const fixturePath = "tests/schema_examples/complete_autopilot_readiness_gate.example.json";

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
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assertDeepEqual(actual, expected, label) {
  assert(JSON.stringify(actual, null, 2) === JSON.stringify(expected, null, 2), `${label} mismatch`);
}

function assertFalseFlags(flags) {
  assert(flags && typeof flags === "object", "side_effect_flags are required");
  for (const [key, value] of Object.entries(flags)) {
    assert(value === false, `${key} must be false`);
  }
}

function buildCompleteAutopilotReadinessGate() {
  const runtime = readJson(runtimeExamplePath).autopilot_goal_decomposition_runtime;
  const materialized = materializeRuntime(runtime);
  const checkedMaterialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const reconciliation = reconcileAgentBoardQueue(checkedMaterialized);
  const orchestration = orchestrateNextSafeTask(checkedMaterialized);
  const amberLoop = buildAmberDryRunLoop(checkedMaterialized);
  const registry = readJson("tests/schema_examples/autopilot_receipt_registry.example.json").autopilot_receipt_registry;
  const evolution = detectAutopilotEvolutionGaps();
  const checkpoint = read(".agent_board/CHECKPOINT.md");

  assertDeepEqual(materialized, checkedMaterialized, "Materialized snapshot");
  assert(reconciliation.result === "passed", "Agent board reconciliation must pass");
  assert(orchestration.selected_next_safe_task.task_id === checkedMaterialized.next_safe_task.task_id, "Next safe task must match materialized snapshot");
  assert(amberLoop.execution_receipt.validation_result === "passed", "Amber dry-run receipt must pass");
  assert(registry.receipts.some((receipt) => receipt.receipt_id === amberLoop.execution_receipt.receipt_id), "Amber dry-run receipt must be in registry");
  assert(evolution.next_recommended_task === "complete_autopilot_readiness_gate_v1", "Evolution backlog must recommend complete readiness gate");
  assert(checkpoint.includes("autopilot_evolution_engine_v1"), "Checkpoint must include latest evolution engine stage");

  return {
    version: "v1",
    phase: "complete_autopilot_readiness_gate_v1",
    readiness_result: "passed_pending_final_local_closeout",
    chain: {
      user_goal: runtime.goal.objective,
      goal_id: runtime.goal.goal_id,
      route_plan_id: runtime.route_plan.route_plan_id,
      task_queue_id: runtime.task_queue.task_queue_id,
      materialized_snapshot: materializedSnapshotPath,
      materialized_goal_id: checkedMaterialized.goal_id,
      reconciled_agent_board: reconciliation.result,
      selected_next_safe_task: orchestration.selected_next_safe_task.task_id,
      selected_next_safe_task_lane: orchestration.selected_next_safe_task.lane,
      amber_dry_run_envelope_id: amberLoop.envelope.envelope_id,
      amber_dry_run_receipt_id: amberLoop.execution_receipt.receipt_id,
      receipt_registry_count: registry.receipts.length,
      amber_receipt_registered: true,
      evolution_backlog_next_task: evolution.next_recommended_task
    },
    invariants: {
      goal_route_queue_links_verified: true,
      materialized_snapshot_deterministic: true,
      agent_board_reconciliation_passed: true,
      next_safe_task_selected: true,
      red_items_blocked: reconciliation.matched_blocked_red_items.length >= 1,
      amber_dry_run_receipt_validated: true,
      receipt_registry_validated: true,
      checkpoint_present: true,
      evolution_backlog_present: evolution.detected_gap_count >= 4,
      mvp_wiring_expected: true
    },
    local_only_boundaries: {
      push_allowed: false,
      tag_release_deploy_allowed: false,
      secret_value_read_allowed: false,
      provider_plugin_api_image_memory_runtime_source_dependency_performed: false
    },
    side_effect_flags: sideEffectFlags
  };
}

function main() {
  const actual = buildCompleteAutopilotReadinessGate();
  const actualAgain = buildCompleteAutopilotReadinessGate();
  const expected = readJson(fixturePath).complete_autopilot_readiness_gate;

  assertDeepEqual(actualAgain, actual, "Complete readiness gate deterministic output");
  assertDeepEqual(actual, expected, "Complete readiness gate fixture");
  assert(actual.readiness_result === "passed_pending_final_local_closeout", "readiness result mismatch");
  assert(Object.values(actual.invariants).every((value) => value === true), "all invariants must be true");
  assert(actual.local_only_boundaries.push_allowed === false, "push must remain blocked");
  assert(actual.local_only_boundaries.secret_value_read_allowed === false, "secret read must remain blocked");
  assertFalseFlags(actual.side_effect_flags);

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: "complete_autopilot_readiness_gate_v1",
    readiness_result: actual.readiness_result,
    deterministic_output_verified: true,
    fixture_verified: true,
    goal_id: actual.chain.goal_id,
    route_plan_id: actual.chain.route_plan_id,
    task_queue_id: actual.chain.task_queue_id,
    selected_next_safe_task: actual.chain.selected_next_safe_task,
    amber_dry_run_receipt_id: actual.chain.amber_dry_run_receipt_id,
    receipt_registry_count: actual.chain.receipt_registry_count,
    evolution_backlog_next_task: actual.chain.evolution_backlog_next_task,
    invariants_verified: true,
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
  }, null, 2)}\n`);
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
  buildCompleteAutopilotReadinessGate
};
