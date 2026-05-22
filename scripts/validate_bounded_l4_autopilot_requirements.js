const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/V0_3_6_BOUNDED_L4_AUTOPILOT_REQUIREMENTS_AND_AMBER_SUBCLASS_GATE.md",
  standingPolicy: "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md",
  kernel: "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  overlay: "AGENTS.autopilot-overlay.md",
  receiptRegistrySchema: "schemas/autopilot_receipt_registry.schema.yaml",
  receiptRegistryExample: "tests/schema_examples/autopilot_receipt_registry.example.json",
  fixture: "tests/schema_examples/bounded_l4_autopilot_requirements.example.json",
  roadmap: "docs/00_project_roadmap.md",
  runState: ".agent_board/RUN_STATE.md",
  handoff: ".agent_board/HANDOFF.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md"
};

const amberSubclasses = [
  "Amber_A_exact_read",
  "Amber_B_provider_image",
  "Amber_C_memory",
  "Amber_D_dependency_runtime"
];

const requiredLoop = [
  "select_next_safe_task",
  "acquire_task_lock",
  "verify_lane_and_budget",
  "execute_one_action",
  "capture_receipt",
  "validate",
  "repair_once_if_safe",
  "update_agent_board",
  "continue_or_stop"
];

const redAlways = [
  "push_tag_release_deploy",
  "secret_value_read",
  "uncapped_cost",
  "unbounded_loop",
  "destructive_action",
  "production_candidate_without_gate",
  "accepted_sample_without_review_gate",
  "memory_write_without_memory_gate"
];

const registryRequiredFields = [
  "registry_id",
  "receipts",
  "receipt_id",
  "receipt_path",
  "envelope_id",
  "task_id",
  "lane",
  "amber_subclass",
  "max_write_files",
  "max_cost_amount",
  "cost_unknown_is_red",
  "rollback_or_cleanup_available",
  "validation_result",
  "side_effect_flags"
];

const sideEffectFlags = [
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

const falseSideEffectFlags = Object.fromEntries(sideEffectFlags.map((flag) => [flag, false]));

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

function assertDeepEqual(actual, expected, label) {
  assert(JSON.stringify(actual, null, 2) === JSON.stringify(expected, null, 2), `${label} mismatch`);
}

function assertFalseFlags(flags, label) {
  assert(flags && typeof flags === "object", `${label} side_effect_flags are required`);
  for (const flag of sideEffectFlags) {
    assert(Object.prototype.hasOwnProperty.call(flags, flag), `${label} missing ${flag}`);
    assert(flags[flag] === false, `${label} must keep ${flag}=false`);
  }
}

function validateRegistryEntry(entry) {
  for (const field of registryRequiredFields.slice(2)) {
    assert(Object.prototype.hasOwnProperty.call(entry, field), `Registry entry missing ${field}`);
  }
  assert(entry.path === entry.receipt_path, `Registry entry path alias must match receipt_path for ${entry.receipt_id}`);
  assert(fs.existsSync(path.join(root, entry.receipt_path)), `Registry receipt_path missing: ${entry.receipt_path}`);
  assert(["Green", "Amber"].includes(entry.lane), `Registry lane invalid for ${entry.receipt_id}`);
  assert(
    entry.lane === "Green" ? entry.amber_subclass === "Green_local" : amberSubclasses.includes(entry.amber_subclass),
    `Registry amber_subclass invalid for ${entry.receipt_id}`
  );
  assert(typeof entry.max_write_files === "number", `Registry max_write_files must be numeric for ${entry.receipt_id}`);
  assert(Object.prototype.hasOwnProperty.call(entry, "max_cost_amount"), `Registry max_cost_amount missing for ${entry.receipt_id}`);
  assert(entry.cost_unknown_is_red === true, `Registry cost_unknown_is_red must be true for ${entry.receipt_id}`);
  assert(entry.rollback_or_cleanup_available === true, `Registry rollback_or_cleanup_available must be true for ${entry.receipt_id}`);
  assert(["passed", "pending", "failed", "blocked", "not_run", "passed_with_warnings"].includes(entry.validation_result), `Registry validation_result invalid for ${entry.receipt_id}`);
  assertFalseFlags(entry.side_effect_flags, `Registry entry ${entry.receipt_id}`);

  const receipt = readJson(entry.receipt_path).autopilot_execution_receipt;
  assert(receipt.receipt_id === entry.receipt_id, `Receipt id mismatch for ${entry.receipt_id}`);
  assert(receipt.task_id === entry.task_id, `Task id mismatch for ${entry.receipt_id}`);
  assert(receipt.envelope_id === entry.envelope_id, `Envelope id mismatch for ${entry.receipt_id}`);
  assert(receipt.lane === entry.lane, `Lane mismatch for ${entry.receipt_id}`);
  assert(receipt.validation_result === entry.validation_result, `Validation result mismatch for ${entry.receipt_id}`);
  assert(receipt.rollback_or_cleanup_available === entry.rollback_or_cleanup_available, `Rollback availability mismatch for ${entry.receipt_id}`);
  assert(receipt.cost_accounting.cost_unknown_is_red === true, `Receipt cost_unknown_is_red must be true for ${entry.receipt_id}`);
  assert(receipt.cost_accounting.cost_unknown === false, `Receipt cost_unknown must be false for ${entry.receipt_id}`);
  assert(receipt.files_written.length <= entry.max_write_files, `Receipt files_written exceeds max_write_files for ${entry.receipt_id}`);
  assertFalseFlags(receipt.guard, `Receipt ${entry.receipt_id}`);
}

function validateRegistry(registry) {
  assert(registry.registry_id, "Registry requires registry_id");
  assert(Array.isArray(registry.receipts) && registry.receipts.length >= 4, "Registry requires receipts");
  for (const entry of registry.receipts) {
    validateRegistryEntry(entry);
  }
}

function expectFailure(caseId, mutate) {
  const registry = clone(readJson(files.receiptRegistryExample).autopilot_receipt_registry);
  mutate(registry);
  try {
    validateRegistry(registry);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      expected_failure: true,
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
  const standingPolicy = read(files.standingPolicy);
  const kernel = read(files.kernel);
  const overlay = read(files.overlay);
  const registrySchema = read(files.receiptRegistrySchema);
  const fixture = readJson(files.fixture).bounded_l4_autopilot_requirements;
  const registry = readJson(files.receiptRegistryExample).autopilot_receipt_registry;
  const statusSurfaces = [
    read(files.roadmap),
    read(files.runState),
    read(files.handoff),
    read(files.taskQueue),
    read(files.checkpoint)
  ].join("\n");

  includesAll(doc, ["bounded_l4_operational_design_domain", "Agent-Image-Lab only", "real_executor_implemented_now: false"], "Bounded L4 doc");
  includesAll(doc, amberSubclasses, "Bounded L4 doc amber subclasses");
  includesAll(doc, requiredLoop, "Bounded L4 doc executor loop");
  includesAll(doc, redAlways, "Bounded L4 doc Red boundaries");
  includesAll(doc, registryRequiredFields, "Bounded L4 doc registry fields");
  includesAll(doc, ["max_repair_attempts_per_task: 1", "non_obvious_failure: Red", "budget_exceeded_stop_requirements"], "Bounded L4 doc repair/budget");

  includesAll(standingPolicy, amberSubclasses, "Standing policy amber subclasses");
  includesAll(kernel, amberSubclasses, "Kernel amber subclasses");
  includesAll(overlay, amberSubclasses, "Overlay amber subclasses");
  includesAll(statusSurfaces, ["v0_3_6_bounded_l4_autopilot_requirements_and_amber_subclass_gate", "scripts/validate_bounded_l4_autopilot_requirements.js"], "Status surfaces");

  includesAll(registrySchema, registryRequiredFields, "Receipt registry schema required fields");
  includesAll(registrySchema, amberSubclasses, "Receipt registry schema amber subclasses");
  includesAll(registrySchema, ["real_executor_implemented_now: false", "missing_registry_entry_is_red: true", "side_effect_flag_drift_blocks_continuation: true"], "Receipt registry schema executor boundaries");
  validateRegistry(registry);

  assert(fixture.real_executor_requirements.implemented_now === false, "Fixture must keep real executor unimplemented");
  assert(fixture.repair_once_policy.enforced_now_by_real_executor === false, "Fixture must not overclaim repair_once executor enforcement");
  assert(fixture.repair_once_policy.future_requirement === true, "Fixture must require future repair_once enforcement");
  assert(fixture.repair_once_policy.max_repair_attempts_per_task === 1, "Fixture repair attempts must be 1");
  assert(
    fixture.bounded_l4_operational_design_domain.allowed_execution_modes.length === 5 &&
      fixture.bounded_l4_operational_design_domain.allowed_execution_modes.some((mode) => mode.includes("Green local execution")) &&
      fixture.bounded_l4_operational_design_domain.allowed_execution_modes.filter((mode) => mode.includes("Amber_")).length === 4,
    "Fixture must define Green plus four Amber allowed execution modes"
  );
  for (const subclass of amberSubclasses) {
    assert(fixture.amber_subclasses[subclass], `Fixture missing ${subclass}`);
  }
  assertDeepEqual(fixture.real_executor_requirements.required_future_loop, requiredLoop, "Fixture future executor loop");
  assertDeepEqual(fixture.bounded_l4_operational_design_domain.red_always, redAlways, "Fixture red_always");
  assertDeepEqual(fixture.receipt_registry_schema_must_require, registryRequiredFields, "Fixture registry required fields");
  assert(fixture.budget_exceeded_stop_requirements.cost_unknown_is_red === true, "Fixture must define cost_unknown stop");
  assert(fixture.budget_exceeded_stop_requirements.uncapped_cost_is_red === true, "Fixture must define uncapped cost stop");
  assert(fixture.current_phase_boundaries.real_executor_implemented_now === false, "Fixture must preserve no real executor");
  assert(fixture.current_phase_boundaries.provider_call_performed === false, "Fixture must preserve no provider call");
  assert(fixture.current_phase_boundaries.image_generation_performed === false, "Fixture must preserve no image generation");
  assert(fixture.current_phase_boundaries.VCP_memory_write_performed === false, "Fixture must preserve no VCP memory write");
  assert(fixture.current_phase_boundaries.runtime_call_performed === false, "Fixture must preserve no runtime call");
  assert(fixture.current_phase_boundaries.secret_value_read_performed === false, "Fixture must preserve no secret read");

  const negativeCases = [
    expectFailure("registry_entry_missing_receipt_path_fails", (candidate) => {
      delete candidate.receipts[0].receipt_path;
    }),
    expectFailure("registry_entry_missing_amber_subclass_fails", (candidate) => {
      delete candidate.receipts[1].amber_subclass;
    }),
    expectFailure("registry_entry_invalid_amber_subclass_fails", (candidate) => {
      candidate.receipts[1].amber_subclass = "Amber_untyped";
    }),
    expectFailure("registry_entry_path_alias_drift_fails", (candidate) => {
      candidate.receipts[1].path = "tests/schema_examples/other.json";
    }),
    expectFailure("registry_entry_cost_unknown_not_red_fails", (candidate) => {
      candidate.receipts[1].cost_unknown_is_red = false;
    }),
    expectFailure("registry_entry_missing_rollback_fails", (candidate) => {
      candidate.receipts[1].rollback_or_cleanup_available = false;
    }),
    expectFailure("registry_entry_side_effect_flag_true_fails", (candidate) => {
      candidate.receipts[1].side_effect_flags.provider_contact_performed = true;
    }),
    expectFailure("receipt_guard_side_effect_flag_true_fails", (candidate) => {
      candidate.receipts[1].receipt_path = "tests/schema_examples/autopilot_execution_receipt.amber_01_local_trial.example.json";
      candidate.receipts[1].side_effect_flags.provider_contact_performed = true;
    })
  ];

  return {
    bounded_l4_autopilot_requirements_validation: {
      passed: true,
      phase: "v0_3_6_bounded_l4_autopilot_requirements_and_amber_subclass_gate",
      bounded_l4_ready: false,
      requirements_gate_ready: true,
      real_executor_implemented_now: false,
      amber_subclasses_defined: true,
      amber_subclasses: amberSubclasses,
      receipt_registry_schema_present: true,
      receipt_registry_entry_count: registry.receipts.length,
      repair_once_future_requirement_defined: true,
      repair_once_enforced_now_by_real_executor: false,
      budget_stop_requirements_defined: true,
      executor_negative_cases_required: true,
      memory_gate_requirement_preserved: true,
      production_candidate_red_boundary_preserved: true,
      accepted_sample_red_boundary_preserved: true,
      negative_case_count: negativeCases.length,
      caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
      all_negative_cases_caught: negativeCases.every((item) => item.result === "caught" && item.expected_failure === true),
      recommended_next_phase: "v0_3_7_bounded_l4_executor_preflight_contract_gate",
      side_effect_flags: falseSideEffectFlags
    }
  };
}

function main() {
  const report = buildReport();
  const actual = report.bounded_l4_autopilot_requirements_validation;
  assert(actual.negative_case_count >= 8, "At least eight Bounded L4 negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "All Bounded L4 negative cases must be caught");
  assert(actual.all_negative_cases_caught === true, "Bounded L4 negative cases must all be caught");
  assertFalseFlags(actual.side_effect_flags, "Bounded L4 validator");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    bounded_l4_ready: actual.bounded_l4_ready,
    requirements_gate_ready: actual.requirements_gate_ready,
    real_executor_implemented_now: actual.real_executor_implemented_now,
    amber_subclasses_defined: actual.amber_subclasses_defined,
    amber_subclasses: actual.amber_subclasses,
    receipt_registry_schema_present: actual.receipt_registry_schema_present,
    receipt_registry_entry_count: actual.receipt_registry_entry_count,
    repair_once_future_requirement_defined: actual.repair_once_future_requirement_defined,
    repair_once_enforced_now_by_real_executor: actual.repair_once_enforced_now_by_real_executor,
    budget_stop_requirements_defined: actual.budget_stop_requirements_defined,
    executor_negative_cases_required: actual.executor_negative_cases_required,
    memory_gate_requirement_preserved: actual.memory_gate_requirement_preserved,
    production_candidate_red_boundary_preserved: actual.production_candidate_red_boundary_preserved,
    accepted_sample_red_boundary_preserved: actual.accepted_sample_red_boundary_preserved,
    negative_case_count: actual.negative_case_count,
    caught_negative_case_count: actual.caught_negative_case_count,
    all_negative_cases_caught: actual.all_negative_cases_caught,
    recommended_next_phase: actual.recommended_next_phase,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    runtime_call_performed: false,
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
  buildReport,
  validateRegistry,
  validateRegistryEntry
};
