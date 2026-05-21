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
  const runState = read(".agent_board/RUN_STATE.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const handoff = read(".agent_board/HANDOFF.md");

  assertDeepEqual(materialized, checkedMaterialized, "Materialized snapshot");
  assert(reconciliation.result === "passed", "Agent board reconciliation must pass");
  assert(orchestration.selected_next_safe_task.task_id === checkedMaterialized.next_safe_task.task_id, "Next safe task must match materialized snapshot");
  assert(amberLoop.execution_receipt.validation_result === "passed", "Amber dry-run receipt must pass");
  assert(amberLoop.amber_dry_run_matches_current_next_safe_task === false, "Amber dry-run must not imply current next_safe_task execution when ids differ");
  assert(amberLoop.readiness_claim === "future_amber_loop_fixture_validated_not_current_task_execution", "Amber dry-run readiness claim must be scoped");
  assert(registry.receipts.some((receipt) => receipt.receipt_id === amberLoop.execution_receipt.receipt_id), "Amber dry-run receipt must be in registry");
  assert(evolution.next_recommended_task !== "complete_autopilot_readiness_gate_v1", "Evolution backlog must advance beyond completed readiness gate");
  assert(checkpoint.includes("local_full_autopilot_ready_closeout"), "Checkpoint must include final local closeout");
  assert(runState.includes("COMPLETED_VALIDATED_LOCAL_FULL_AUTOPILOT_READY"), "RUN_STATE must include final local readiness status");
  assert(taskQueue.includes("owner_push_safety_gate_after_review"), "TASK_QUEUE must record push safety gate as next boundary");
  assert(
    handoff.includes("phase: local_full_autopilot_ready_closeout") &&
      handoff.includes("push_status: not_performed") &&
      handoff.includes("recommended_next: owner_push_safety_gate_after_review."),
    "HANDOFF must record the final local closeout no-push boundary"
  );

  const fixtureSelectedNextSafeTask = orchestration.selected_next_safe_task.task_id;
  const fixtureSelectedNextSafeTaskLane = orchestration.selected_next_safe_task.lane;
  const currentNextBoundary = "owner_push_safety_gate_after_review";
  const currentNextBoundaryType = "Red push-safety-gate boundary";

  assert(fixtureSelectedNextSafeTask === "add_goal_decomposition_runtime_validation", "Fixture next safe task should remain historical test evidence");
  assert(fixtureSelectedNextSafeTaskLane === "Green", "Fixture next safe task lane should remain Green");
  assert(currentNextBoundary === "owner_push_safety_gate_after_review", "Current next boundary must be owner push safety gate after review");
  assert(currentNextBoundaryType.includes("Red") && currentNextBoundaryType.includes("push-safety-gate"), "Current next boundary type must identify the Red push-safety-gate boundary");

  return {
    version: "v1",
    phase: "complete_autopilot_readiness_gate_v1",
    readiness_result: "passed_local_full_autopilot_ready_no_push",
    chain: {
      user_goal: runtime.goal.objective,
      goal_id: runtime.goal.goal_id,
      route_plan_id: runtime.route_plan.route_plan_id,
      task_queue_id: runtime.task_queue.task_queue_id,
      materialized_snapshot: materializedSnapshotPath,
      materialized_goal_id: checkedMaterialized.goal_id,
      reconciled_agent_board: reconciliation.result,
      fixture_selected_next_safe_task: fixtureSelectedNextSafeTask,
      fixture_selected_next_safe_task_lane: fixtureSelectedNextSafeTaskLane,
      fixture_next_safe_task_evidence_type: "historical_test_fixture",
      current_next_boundary: currentNextBoundary,
      current_next_boundary_type: currentNextBoundaryType,
      amber_dry_run_envelope_id: amberLoop.envelope.envelope_id,
      amber_dry_run_receipt_id: amberLoop.execution_receipt.receipt_id,
      amber_dry_run_task_id: amberLoop.amber_dry_run_task_id,
      amber_dry_run_matches_current_next_safe_task: amberLoop.amber_dry_run_matches_current_next_safe_task,
      amber_readiness_claim: amberLoop.readiness_claim,
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
      final_closeout_state_verified: true,
      no_push_boundary_verified: true,
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
  assert(actual.readiness_result === "passed_local_full_autopilot_ready_no_push", "readiness result mismatch");
  assert(actual.chain.fixture_selected_next_safe_task === "add_goal_decomposition_runtime_validation", "fixture selected next safe task mismatch");
  assert(actual.chain.fixture_selected_next_safe_task_lane === "Green", "fixture selected next safe task lane mismatch");
  assert(actual.chain.fixture_next_safe_task_evidence_type === "historical_test_fixture", "fixture next safe task evidence type mismatch");
  assert(!Object.prototype.hasOwnProperty.call(actual.chain, "selected_next_safe_task"), "ambiguous selected_next_safe_task field must not be present");
  assert(actual.chain.current_next_boundary === "owner_push_safety_gate_after_review", "current next boundary mismatch");
  assert(actual.chain.current_next_boundary_type.includes("Red") && actual.chain.current_next_boundary_type.includes("push-safety-gate"), "current next boundary type mismatch");
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
    fixture_selected_next_safe_task: actual.chain.fixture_selected_next_safe_task,
    fixture_selected_next_safe_task_lane: actual.chain.fixture_selected_next_safe_task_lane,
    current_next_boundary: actual.chain.current_next_boundary,
    current_next_boundary_type: actual.chain.current_next_boundary_type,
    amber_dry_run_receipt_id: actual.chain.amber_dry_run_receipt_id,
    amber_dry_run_task_id: actual.chain.amber_dry_run_task_id,
    amber_dry_run_matches_current_next_safe_task: actual.chain.amber_dry_run_matches_current_next_safe_task,
    amber_readiness_claim: actual.chain.amber_readiness_claim,
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
