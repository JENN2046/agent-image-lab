const fs = require("node:fs");
const path = require("node:path");
const { orchestrateNextSafeTask, materializedSnapshotPath } = require("./orchestrate_next_safe_task.js");

const root = path.resolve(__dirname, "..");
const fixturePath = "tests/schema_examples/next_safe_task_orchestration.example.json";

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

function assertDeepEqual(actual, expected, label) {
  assert(JSON.stringify(actual, null, 2) === JSON.stringify(expected, null, 2), `${label} mismatch`);
}

function assertNoSideEffects(flags) {
  assert(flags && typeof flags === "object", "side_effect_flags are required");
  for (const [key, value] of Object.entries(flags)) {
    assert(value === false, `${key} must be false`);
  }
}

function main() {
  const materialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const actual = orchestrateNextSafeTask(materialized);
  const actualAgain = orchestrateNextSafeTask(materialized);
  const expected = readJson(fixturePath).next_safe_task_orchestration;

  assertDeepEqual(actualAgain, actual, "Next Safe Task Orchestrator deterministic output");
  assertDeepEqual(actual, expected, "Next Safe Task Orchestrator fixture");
  assert(actual.phase === "next_safe_task_orchestrator_v1", "phase mismatch");
  assert(actual.selected_next_safe_task.task_id === materialized.next_safe_task.task_id, "selected task must match materialized next_safe_task");
  assert(["Green", "Amber"].includes(actual.selected_next_safe_task.lane), "selected task must be Green or Amber");
  assert(actual.selected_next_safe_task.lane !== "Amber" || (actual.selected_next_safe_task.envelope_ref && actual.selected_next_safe_task.receipt_required === true), "Amber selected task requires envelope and receipt");
  assert(actual.blocked_red_items.length >= 1, "blocked Red items must remain recorded");
  assert(actual.blocked_red_items.every((item) => item.required_authorization_or_action), "blocked Red items require authorization/action");
  assert(actual.advancement_preview.writes_real_state_now === false, "orchestrator must not write real state");
  assert(actual.continuation_decision.red_lane_encountered === false, "orchestrator must not cross Red Lane");
  assertNoSideEffects(actual.side_effect_flags);

  const result = {
    passed: true,
    phase: "next_safe_task_orchestrator_v1",
    source_snapshot: actual.source_snapshot,
    selected_next_safe_task: actual.selected_next_safe_task.task_id,
    selected_lane: actual.selected_next_safe_task.lane,
    eligible_executable_task_count: actual.eligible_executable_tasks.length,
    blocked_red_items_preserved: actual.blocked_red_items.length,
    deterministic_output_verified: true,
    fixture_verified: true,
    no_real_state_write: true,
    continuation_decision: actual.continuation_decision,
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
