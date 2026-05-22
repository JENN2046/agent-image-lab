"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_GATE.md",
  schema: "schemas/bounded_l4_executor_preflight_packet.schema.yaml",
  fixture: "tests/schema_examples/bounded_l4_executor_preflight_packet.example.json",
  roadmap: "docs/00_project_roadmap.md",
  kernel: "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  standingPolicy: "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md",
  overlay: "AGENTS.autopilot-overlay.md",
  runState: ".agent_board/RUN_STATE.md",
  handoff: ".agent_board/HANDOFF.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  mvp: "scripts/validate_mvp.ps1"
};

const requiredPacketFields = [
  "packet_id",
  "task_id",
  "source_goal_id",
  "source_route_plan_id",
  "selected_next_safe_task_id",
  "lane",
  "amber_subclass",
  "exact_target_systems",
  "exact_allowed_paths_or_objects",
  "forbidden_paths_or_objects",
  "allowed_operation",
  "budget_snapshot",
  "receipt_registry_ref",
  "receipt_path",
  "rollback_or_cleanup_plan",
  "validation_required",
  "stop_conditions",
  "side_effect_flags_initial",
  "can_execute_now"
];

const amberSubclasses = [
  "Green_local",
  "Amber_A_exact_read",
  "Amber_B_provider_image",
  "Amber_C_memory",
  "Amber_D_dependency_runtime"
];

const stopReasons = [
  "red_lane_detected",
  "missing_preflight_packet",
  "missing_receipt_path",
  "missing_rollback_plan",
  "budget_exceeded",
  "cost_unknown",
  "side_effect_flag_drift",
  "validation_failed_non_obvious",
  "repair_limit_exceeded",
  "secret_required",
  "production_candidate_gate_required",
  "memory_gate_required"
];

const sideEffectFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "runtime_call_performed",
  "secret_value_read_performed",
  "production_candidate_created",
  "accepted_sample_promoted"
];

const negativeCaseIds = [
  "missing_preflight_packet_fails",
  "red_lane_cannot_execute",
  "missing_amber_subclass_fails",
  "missing_receipt_path_fails",
  "missing_rollback_plan_fails",
  "budget_exceeded_fails",
  "cost_unknown_fails",
  "repair_attempt_count_greater_than_one_fails",
  "memory_write_without_memory_gate_fails",
  "production_candidate_without_gate_fails",
  "side_effect_flag_drift_fails"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function includesAll(content, values, label) {
  const missing = values.filter((value) => !content.includes(value));
  assert(missing.length === 0, `${label} missing: ${missing.join(", ")}`);
}

function assertFalseFlags(flags, label) {
  assert(flags && typeof flags === "object", `${label} side_effect_flags_initial are required`);
  for (const flag of sideEffectFlags) {
    assert(Object.prototype.hasOwnProperty.call(flags, flag), `${label} missing ${flag}`);
    assert(flags[flag] === false, `${label} must keep ${flag}=false`);
  }
}

function validatePacket(contract) {
  assert(contract && typeof contract === "object", "missing_preflight_packet");
  const packet = contract.preflight_packet;
  assert(packet && typeof packet === "object", "missing_preflight_packet");

  for (const field of requiredPacketFields) {
    assert(Object.prototype.hasOwnProperty.call(packet, field), `missing_packet_field:${field}`);
  }

  assert(packet.can_execute_now === false, "can_execute_now must be false in v0.3.7");
  assert(packet.lane !== "Red", "red_lane_detected");
  assert(["Green", "Amber"].includes(packet.lane), "lane must be Green or Amber");
  assert(packet.amber_subclass, "missing_amber_subclass");
  assert(amberSubclasses.includes(packet.amber_subclass), "invalid_amber_subclass");
  assert(packet.lane === "Green" ? packet.amber_subclass === "Green_local" : packet.amber_subclass !== "Green_local", "amber_subclass_lane_mismatch");
  assert(Array.isArray(packet.exact_target_systems) && packet.exact_target_systems.length > 0, "exact_target_systems required");
  assert(Array.isArray(packet.exact_allowed_paths_or_objects) && packet.exact_allowed_paths_or_objects.length > 0, "exact_allowed_paths_or_objects required");
  assert(Array.isArray(packet.forbidden_paths_or_objects) && packet.forbidden_paths_or_objects.includes(".env.local"), "forbidden_paths_or_objects must block secrets");
  assert(packet.receipt_path, "missing_receipt_path");
  assert(packet.receipt_registry_ref, "missing_receipt_registry_ref");
  assert(packet.rollback_or_cleanup_plan && packet.rollback_or_cleanup_plan.rollback_available === true, "missing_rollback_plan");
  assert(Array.isArray(packet.validation_required) && packet.validation_required.length >= 4, "validation_required missing");
  includesAll(packet.stop_conditions.join("\n"), stopReasons, "packet stop_conditions");
  assertFalseFlags(packet.side_effect_flags_initial, "packet");

  const budget = packet.budget_snapshot;
  assert(budget && typeof budget === "object", "budget_snapshot required");
  assert(budget.cost_unknown_is_red === true, "cost_unknown_is_red required");
  assert(budget.cost_unknown === false, "cost_unknown");
  assert(budget.budget_would_exceed_envelope === false, "budget_exceeded");
  assert(typeof budget.max_write_files === "number", "max_write_files numeric required");
  assert(Object.prototype.hasOwnProperty.call(budget, "max_cost_amount"), "max_cost_amount required");

  if (packet.allowed_operation === "memory_write") {
    assert(packet.memory_gate_id, "memory_gate_required");
  }
  if (packet.allowed_operation === "production_candidate") {
    assert(packet.production_gate_id, "production_candidate_gate_required");
  }

  const lock = contract.task_lock_contract;
  assert(lock?.task_lock_required === true, "task_lock_required");
  assert(lock.lock_scope && lock.lock_owner && lock.lock_expiry_or_manual_release_policy, "lock metadata required");
  assert(lock.stale_lock_is_red_or_blocked === true, "stale_lock_is_red_or_blocked required");
  assert(lock.one_active_task_only === true, "one_active_task_only required");

  const oneAction = contract.one_action_execution_contract;
  assert(oneAction?.execute_one_action_only_per_loop === true, "execute_one_action_only_per_loop required");
  assert(oneAction.real_executor_implemented_now === false, "real_executor_implemented_now must be false");
  assert(oneAction.no_action_without_preflight_packet === true, "no_action_without_preflight_packet required");
  assert(oneAction.no_action_without_receipt_path === true, "no_action_without_receipt_path required");
  assert(oneAction.no_action_if_budget_would_exceed_envelope === true, "budget stop required");
  assert(oneAction.no_action_if_lane_is_Red === true, "Red lane stop required");

  const repair = contract.repair_once_state_model;
  assert(repair?.max_repair_attempts_per_task === 1, "max_repair_attempts_per_task must be 1");
  assert(repair.repair_attempt_count <= 1, "repair_limit_exceeded");
  assert(Object.prototype.hasOwnProperty.call(repair, "repair_reason"), "repair_reason required");
  assert(Object.prototype.hasOwnProperty.call(repair, "repair_validation_result"), "repair_validation_result required");
  assert(repair.second_failure_is_red === true, "second_failure_is_red required");
  assert(repair.non_obvious_repair_is_red === true, "non_obvious_repair_is_red required");

  includesAll(contract.stop_reason_taxonomy.join("\n"), stopReasons, "contract stop_reason_taxonomy");
  return true;
}

function expectFailure(caseId, mutate) {
  const base = clone(readJson(files.fixture).bounded_l4_executor_preflight_contract);
  const candidate = mutate ? mutate(base) || base : null;
  try {
    validatePacket(candidate);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      failure_message: error.message
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function buildReport() {
  for (const file of Object.values(files)) {
    assert(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`);
  }

  const doc = read(files.doc);
  const schema = read(files.schema);
  const fixture = readJson(files.fixture).bounded_l4_executor_preflight_contract;
  const statusSurfaces = [read(files.roadmap), read(files.runState), read(files.handoff), read(files.taskQueue), read(files.checkpoint)].join("\n");
  const governanceDocs = [read(files.kernel), read(files.standingPolicy), read(files.overlay)].join("\n");
  const mvp = read(files.mvp);

  includesAll(doc, requiredPacketFields, "preflight doc packet fields");
  includesAll(doc, stopReasons, "preflight doc stop reasons");
  includesAll(doc, negativeCaseIds, "preflight doc negative cases");
  includesAll(doc, [
    "task_lock_required: true",
    "one_active_task_only: true",
    "execute_one_action_only_per_loop: true",
    "real_executor_implemented_now: false",
    "max_repair_attempts_per_task: 1",
    "second_failure_is_red: true",
    "non_obvious_repair_is_red: true",
    "can_execute_now: false"
  ], "preflight doc core requirements");
  includesAll(schema, requiredPacketFields, "preflight schema packet fields");
  includesAll(schema, stopReasons, "preflight schema stop reasons");
  includesAll(schema, negativeCaseIds, "preflight schema negative cases");
  includesAll(governanceDocs, ["bounded_l4_executor_preflight_packet", "can_execute_now: false", "execute_one_action_only_per_loop"], "governance docs preflight refs");
  includesAll(statusSurfaces, ["v0_3_7_bounded_l4_executor_preflight_contract_gate", "scripts/validate_bounded_l4_executor_preflight_contract.js"], "status surfaces");
  includesAll(mvp, ["scripts/validate_bounded_l4_executor_preflight_contract.js", "bounded_l4_executor_preflight_packet.example.json"], "MVP wiring");

  assert(fixture.phase === "v0_3_7_bounded_l4_executor_preflight_contract_gate", "fixture phase mismatch");
  assert(fixture.real_executor_implemented_now === false, "fixture must not implement executor");
  validatePacket(fixture);
  assert(fixture.negative_cases_required.length === negativeCaseIds.length, "fixture negative case count mismatch");
  includesAll(fixture.negative_cases_required.join("\n"), negativeCaseIds, "fixture negative cases");
  assert(fixture.current_phase_boundaries.real_executor_implemented_now === false, "boundary must keep executor false");
  assert(fixture.current_phase_boundaries.provider_call_performed === false, "boundary must keep provider false");
  assert(fixture.current_phase_boundaries.image_generation_performed === false, "boundary must keep image false");
  assert(fixture.current_phase_boundaries.VCP_memory_write_performed === false, "boundary must keep memory false");
  assert(fixture.current_phase_boundaries.runtime_call_performed === false, "boundary must keep runtime false");
  assert(fixture.current_phase_boundaries.secret_value_read_performed === false, "boundary must keep secret false");

  const negativeCases = [
    expectFailure("missing_preflight_packet_fails"),
    expectFailure("red_lane_cannot_execute", (candidate) => {
      candidate.preflight_packet.lane = "Red";
    }),
    expectFailure("missing_amber_subclass_fails", (candidate) => {
      delete candidate.preflight_packet.amber_subclass;
    }),
    expectFailure("missing_receipt_path_fails", (candidate) => {
      delete candidate.preflight_packet.receipt_path;
    }),
    expectFailure("missing_rollback_plan_fails", (candidate) => {
      candidate.preflight_packet.rollback_or_cleanup_plan.rollback_available = false;
    }),
    expectFailure("budget_exceeded_fails", (candidate) => {
      candidate.preflight_packet.budget_snapshot.budget_would_exceed_envelope = true;
    }),
    expectFailure("cost_unknown_fails", (candidate) => {
      candidate.preflight_packet.budget_snapshot.cost_unknown = true;
    }),
    expectFailure("repair_attempt_count_greater_than_one_fails", (candidate) => {
      candidate.repair_once_state_model.repair_attempt_count = 2;
    }),
    expectFailure("memory_write_without_memory_gate_fails", (candidate) => {
      candidate.preflight_packet.lane = "Amber";
      candidate.preflight_packet.amber_subclass = "Amber_C_memory";
      candidate.preflight_packet.allowed_operation = "memory_write";
    }),
    expectFailure("production_candidate_without_gate_fails", (candidate) => {
      candidate.preflight_packet.lane = "Amber";
      candidate.preflight_packet.amber_subclass = "Amber_B_provider_image";
      candidate.preflight_packet.allowed_operation = "production_candidate";
    }),
    expectFailure("side_effect_flag_drift_fails", (candidate) => {
      candidate.preflight_packet.side_effect_flags_initial.image_generation_performed = true;
    })
  ];

  return {
    passed: true,
    phase: fixture.phase,
    real_executor_implemented_now: false,
    can_execute_now_false: fixture.preflight_packet.can_execute_now === false,
    task_lock_contract_defined: fixture.task_lock_contract.task_lock_required === true && fixture.task_lock_contract.one_active_task_only === true,
    one_action_contract_defined: fixture.one_action_execution_contract.execute_one_action_only_per_loop === true,
    repair_once_state_model_defined: fixture.repair_once_state_model.max_repair_attempts_per_task === 1,
    stop_reason_taxonomy_defined: stopReasons.every((reason) => fixture.stop_reason_taxonomy.includes(reason)),
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    provider_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    commit_performed: false,
    push_performed: false
  };
}

function main() {
  const report = buildReport();
  assert(report.negative_case_count === negativeCaseIds.length, "All required negative cases must be modeled");
  assert(report.all_negative_cases_caught === true, "All negative cases must be caught");
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
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
  buildReport,
  validatePacket
};
