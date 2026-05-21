const fs = require("node:fs");
const path = require("node:path");
const { reconcileAgentBoardQueue, materializedSnapshotPath } = require("./reconcile_agent_board_queue.js");

const root = path.resolve(__dirname, "..");
const fixturePath = "tests/schema_examples/agent_board_queue_reconciliation.example.json";

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
  const actualText = JSON.stringify(actual, null, 2);
  const expectedText = JSON.stringify(expected, null, 2);
  assert(actualText === expectedText, `${label} mismatch`);
}

function main() {
  const materialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const expected = readJson(fixturePath).agent_board_queue_reconciliation;
  const actual = reconcileAgentBoardQueue(materialized);
  const actualAgain = reconcileAgentBoardQueue(materialized);

  assertDeepEqual(actualAgain, actual, "Agent board queue reconciliation deterministic output");
  assertDeepEqual(actual, expected, "Agent board queue reconciliation fixture");
  assert(actual.result === "passed", "Agent board queue reconciliation must pass");
  assert(actual.queue_drift_detected === false, "Agent board queue reconciliation must not detect drift");
  assert(Array.isArray(actual.missing_required_surfaces) && actual.missing_required_surfaces.length === 0, "Agent board queue reconciliation must have no missing surfaces");
  assert(Array.isArray(actual.current_state_missing) && actual.current_state_missing.length === 0, "Agent board current-state surfaces must not miss required final boundary tokens");
  assert(actual.matched_goal_id === true, "Agent board queue reconciliation must match goal_id");
  assert(actual.matched_current_goal === true, "Agent board queue reconciliation must match current_goal");
  assert(actual.matched_next_safe_task && actual.matched_next_safe_task.evidence_type === "historical_test_fixture", "Agent board reconciliation must label fixture next_safe_task as historical evidence");
  assert(Array.isArray(actual.matched_executable_queue), "Agent board reconciliation must expose historical executable queue evidence");
  assert(actual.matched_blocked_red_items.every((item) => item.matched === true), "Agent board queue reconciliation must match every blocked Red item");
  assert(actual.current_state_matches && Object.values(actual.current_state_matches).every((value) => value === true), "Agent board queue reconciliation must match current final state");
  assert(actual.historical_evidence_matches && typeof actual.historical_evidence_matches === "object", "Agent board queue reconciliation must expose historical evidence matches");
  assert(Array.isArray(actual.historical_evidence_missing), "Agent board queue reconciliation must expose historical evidence missing tokens");
  assert(actual.details.current_state_missing.length === 0, "Agent board current state surfaces must not miss required state tokens");
  assert(actual.details.current_boundary === "owner_push_safety_gate_after_review", "Agent board reconciliation must use owner push safety gate as current boundary");
  assert(actual.details.current_boundary_type.includes("Red") && actual.details.current_boundary_type.includes("push-safety-gate"), "Agent board reconciliation must label current boundary as Red push-safety-gate");

  const result = {
    passed: true,
    phase: "agent_board_queue_reconciler_v1",
    source_snapshot: actual.source_snapshot,
    agent_board_files_checked: actual.agent_board_files_checked,
    matched_goal_id: actual.matched_goal_id,
    fixture_next_safe_task_evidence: actual.matched_next_safe_task.task_id,
    fixture_next_safe_task_evidence_type: actual.matched_next_safe_task.evidence_type,
    current_next_boundary: actual.details.current_boundary,
    current_next_boundary_type: actual.details.current_boundary_type,
    matched_blocked_red_items: actual.matched_blocked_red_items.length,
    current_state_matches: actual.current_state_matches,
    current_state_missing: actual.current_state_missing,
    historical_evidence_matches: actual.historical_evidence_matches,
    historical_evidence_missing: actual.historical_evidence_missing,
    historical_evidence_warning: actual.historical_evidence_warning,
    queue_drift_detected: actual.queue_drift_detected,
    missing_required_surfaces: actual.missing_required_surfaces,
    warnings: actual.warnings,
    result: actual.result,
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
