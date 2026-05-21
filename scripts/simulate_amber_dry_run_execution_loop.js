const fs = require("node:fs");
const path = require("node:path");
const { orchestrateNextSafeTask } = require("./orchestrate_next_safe_task.js");

const root = path.resolve(__dirname, "..");
const materializedSnapshotPath = "tests/schema_examples/autopilot_goal_decomposition_materialized.example.json";
const receiptPath = "tests/schema_examples/autopilot_execution_receipt.amber_dry_run_loop.example.json";

const guard = {
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

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function buildAmberDryRunLoop(materialized) {
  const orchestration = orchestrateNextSafeTask(materialized);
  const selectedCurrentNextSafeTaskId = orchestration.selected_next_safe_task.task_id;
  const amberTask = orchestration.eligible_executable_tasks.find((task) => task.lane === "Amber" && task.valid_budgeted_amber === true);
  if (!amberTask) {
    throw new Error("Amber dry-run loop requires one valid budgeted Amber task");
  }
  const matchesCurrentNextSafeTask = amberTask.task_id === selectedCurrentNextSafeTaskId;
  const readinessClaim = matchesCurrentNextSafeTask
    ? "current_next_safe_task_amber_loop_validated"
    : "future_amber_loop_fixture_validated_not_current_task_execution";

  const envelope = {
    envelope_id: "envelope-amber-dry-run-execution-loop-v1",
    task_id: amberTask.task_id,
    lane: "Amber",
    max_provider_calls: 0,
    max_plugin_calls: 0,
    max_api_calls: 0,
    max_image_candidates: 0,
    max_external_read_files: 0,
    max_write_files: 7,
    max_dependency_actions: 0,
    max_runtime_probe_minutes: 0,
    max_cost_amount: 0,
    max_cost_currency: "not_applicable",
    cost_tracking_required: true,
    cost_unknown_is_red: true,
    overwrite_existing_files_allowed: false,
    secret_value_read_allowed: false,
    raw_private_data_print_allowed: false,
    push_allowed: false,
    tag_release_deploy_allowed: false,
    destructive_action_allowed: false
  };

  const actionPacket = {
    task_id: amberTask.task_id,
    intent: "prove local Amber envelope to receipt loop without external side effects",
    target_systems: ["local_repository_fixture_only"],
    exact_allowed_paths_or_objects: [
      "docs/AUTOPILOT_AMBER_DRY_RUN_EXECUTION_LOOP.md",
      "tests/schema_examples/amber_dry_run_execution_loop.example.json",
      receiptPath,
      "tests/schema_examples/autopilot_receipt_registry.example.json",
      "scripts/simulate_amber_dry_run_execution_loop.js",
      "scripts/validate_amber_dry_run_execution_loop.js",
      ".agent_board/AUTOPILOT_LEDGER.md"
    ],
    forbidden_paths_or_objects: [".env*", "external repositories", "production runtime", "real VCPChat", "real VCPToolBox"],
    allowed_commands_or_operations: ["node scripts/simulate_amber_dry_run_execution_loop.js", "node scripts/validate_amber_dry_run_execution_loop.js"],
    selected_plugin_id: null,
    command: "local_fixture_dry_run",
    model: null,
    input_reference: materializedSnapshotPath,
    output_directory_or_write_target: "tests/schema_examples",
    overwrite_existing_files_allowed: false,
    secret_value_read_allowed: false,
    raw_private_data_print_allowed: false,
    dependency_manifest_change_allowed: false,
    rollback_or_cleanup_plan: "Revert the local dry-run fixture, receipt, registry entry, validator, docs, and agent-board status surfaces.",
    validation_required: ["node scripts/validate_amber_dry_run_execution_loop.js"],
    stop_conditions: ["budget exceeded", "receipt cannot be recorded", "Red Lane condition appears"],
    evidence_to_record: ["execution receipt", "receipt registry entry", "validation result", "continuation decision"]
  };

  const receipt = {
    version: "v1",
    contract_type: "autopilot_execution_receipt",
    policy_model: "Smart Standing Authorization v3 — Budgeted Autonomy Envelope",
    receipt_id: "receipt-amber-dry-run-execution-loop-v1",
    task_id: amberTask.task_id,
    lane: "Amber",
    envelope_id: envelope.envelope_id,
    action_performed: "local_amber_envelope_packet_receipt_dry_run",
    dry_run_scope: "future_budgeted_amber_task_fixture",
    selected_current_next_safe_task_id: selectedCurrentNextSafeTaskId,
    amber_dry_run_task_id: amberTask.task_id,
    amber_dry_run_matches_current_next_safe_task: matchesCurrentNextSafeTask,
    readiness_claim: readinessClaim,
    target_systems: ["local_repository_fixture_only"],
    calls_used: {
      provider_calls: 0,
      plugin_calls: 0,
      api_calls: 0,
      image_candidates: 0,
      runtime_probe_minutes: 0
    },
    files_read: [materializedSnapshotPath, "tests/schema_examples/next_safe_task_orchestration.example.json"],
    files_written: [
      "docs/AUTOPILOT_AMBER_DRY_RUN_EXECUTION_LOOP.md",
      "tests/schema_examples/amber_dry_run_execution_loop.example.json",
      receiptPath,
      "scripts/simulate_amber_dry_run_execution_loop.js",
      "scripts/validate_amber_dry_run_execution_loop.js"
    ],
    dependency_actions_used: [],
    cost_accounting: {
      cost_tracking_required: true,
      cost_amount: 0,
      cost_currency: "not_applicable",
      cost_unknown: false,
      cost_unknown_is_red: true
    },
    validation_run: ["node scripts/validate_amber_dry_run_execution_loop.js"],
    validation_result: "passed",
    rollback_or_cleanup_available: true,
    rollback_or_cleanup_plan: actionPacket.rollback_or_cleanup_plan,
    files_to_revert: [
      "docs/AUTOPILOT_AMBER_DRY_RUN_EXECUTION_LOOP.md",
      "tests/schema_examples/amber_dry_run_execution_loop.example.json",
      receiptPath,
      "scripts/simulate_amber_dry_run_execution_loop.js",
      "scripts/validate_amber_dry_run_execution_loop.js"
    ],
    cleanup_targets: [],
    irreversible_actions_performed: [],
    next_auto_step_allowed: true,
    stop_reason: "none",
    guard
  };

  return {
    version: "v1",
    phase: "amber_dry_run_execution_loop_v1",
    source_snapshot: materializedSnapshotPath,
    dry_run_scope: "future_budgeted_amber_task_fixture",
    selected_current_next_safe_task_id: selectedCurrentNextSafeTaskId,
    amber_dry_run_task_id: amberTask.task_id,
    amber_dry_run_matches_current_next_safe_task: matchesCurrentNextSafeTask,
    readiness_claim: readinessClaim,
    envelope,
    action_packet: actionPacket,
    dry_run_action: {
      action_id: "local_fixture_dry_run",
      performed: true,
      external_side_effects: false,
      cost_amount: 0,
      cost_currency: "not_applicable"
    },
    execution_receipt: receipt,
    receipt_registry_entry: {
      receipt_id: receipt.receipt_id,
      task_id: receipt.task_id,
      lane: receipt.lane,
      path: receiptPath,
      envelope_id: receipt.envelope_id,
      receipt_only_or_replay: true,
      max_write_files: envelope.max_write_files,
      max_dependency_actions: 0,
      max_cost_amount: 0,
      max_cost_currency: "not_applicable"
    },
    validation: {
      validation_required: receipt.validation_run,
      validation_result: "passed"
    },
    continuation_decision: {
      next_auto_step_allowed: true,
      continue_automatically: true,
      stop_reason: "none"
    },
    side_effect_flags: guard
  };
}

function main() {
  const materialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const report = buildAmberDryRunLoop(materialized);
  process.stdout.write(`${JSON.stringify({ amber_dry_run_execution_loop: report }, null, 2)}\n`);
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
  buildAmberDryRunLoop,
  materializedSnapshotPath,
  receiptPath
};
