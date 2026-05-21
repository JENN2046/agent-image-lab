const fs = require("node:fs");
const path = require("node:path");
const { buildAmberDryRunLoop, materializedSnapshotPath, receiptPath } = require("./simulate_amber_dry_run_execution_loop.js");

const root = path.resolve(__dirname, "..");
const loopFixturePath = "tests/schema_examples/amber_dry_run_execution_loop.example.json";
const registryPath = "tests/schema_examples/autopilot_receipt_registry.example.json";

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
  for (const [key, value] of Object.entries(flags)) {
    assert(value === false, `${key} must be false`);
  }
}

function main() {
  const materialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const actual = buildAmberDryRunLoop(materialized);
  const expected = readJson(loopFixturePath).amber_dry_run_execution_loop;
  const receipt = readJson(receiptPath).autopilot_execution_receipt;
  const registry = readJson(registryPath).autopilot_receipt_registry;

  assertDeepEqual(buildAmberDryRunLoop(materialized), actual, "Amber dry-run loop deterministic output");
  assertDeepEqual(actual, expected, "Amber dry-run loop fixture");
  assertDeepEqual(actual.execution_receipt, receipt, "Amber dry-run receipt");
  assert(registry.receipts.some((entry) => entry.receipt_id === receipt.receipt_id && entry.path === receiptPath), "Receipt registry must include Amber dry-run receipt");
  assert(actual.envelope.lane === "Amber", "Envelope lane must be Amber");
  assert(actual.dry_run_scope === "future_budgeted_amber_task_fixture", "Amber dry-run scope must identify future fixture");
  assert(actual.selected_current_next_safe_task_id, "Amber dry-run must record current next_safe_task id");
  assert(actual.amber_dry_run_task_id === receipt.task_id, "Amber dry-run task id must match receipt task");
  assert(actual.amber_dry_run_matches_current_next_safe_task === false, "Current fixture must not pretend future Amber task is current next_safe_task");
  assert(actual.readiness_claim === "future_amber_loop_fixture_validated_not_current_task_execution", "Readiness claim must be semantically scoped to future Amber fixture");
  assert(receipt.dry_run_scope === actual.dry_run_scope, "Receipt must record dry-run scope");
  assert(receipt.selected_current_next_safe_task_id === actual.selected_current_next_safe_task_id, "Receipt must record selected current next_safe_task");
  assert(receipt.amber_dry_run_matches_current_next_safe_task === false, "Receipt must not imply current next_safe_task execution");
  assert(actual.envelope.max_cost_amount === 0 && actual.envelope.cost_unknown_is_red === true, "Dry-run cost must be known zero");
  assert(actual.action_packet.secret_value_read_allowed === false, "Action packet must not allow secrets");
  assert(actual.action_packet.dependency_manifest_change_allowed === false, "Action packet must not allow dependency changes");
  assert(actual.dry_run_action.external_side_effects === false, "Dry-run action must have no external side effects");
  assert(receipt.validation_result === "passed", "Receipt validation_result must be passed");
  assert(receipt.rollback_or_cleanup_available === true && receipt.rollback_or_cleanup_plan, "Receipt requires structured rollback");
  assert(receipt.irreversible_actions_performed.length === 0, "Dry-run must have no irreversible actions");
  assert(receipt.next_auto_step_allowed === true, "Continuation must be allowed after dry-run");
  assertFalseFlags(actual.side_effect_flags);
  assertFalseFlags(receipt.guard);

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: "amber_dry_run_execution_loop_v1",
    envelope_id: actual.envelope.envelope_id,
    dry_run_scope: actual.dry_run_scope,
    selected_current_next_safe_task_id: actual.selected_current_next_safe_task_id,
    amber_dry_run_task_id: actual.amber_dry_run_task_id,
    amber_dry_run_matches_current_next_safe_task: actual.amber_dry_run_matches_current_next_safe_task,
    readiness_claim: actual.readiness_claim,
    action_packet_verified: true,
    receipt_verified: true,
    registry_entry_verified: true,
    validation_result: receipt.validation_result,
    continuation_allowed: receipt.next_auto_step_allowed,
    cost_known_zero: true,
    rollback_structured: true,
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

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
}
