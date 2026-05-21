const fs = require("node:fs");
const path = require("node:path");
const { buildAmberDryRunLoop, materializedSnapshotPath } = require("./simulate_amber_dry_run_execution_loop.js");

const root = path.resolve(__dirname, "..");
const schemaPath = "schemas/autopilot_amber_action_packet.schema.yaml";
const packetFixturePath = "tests/schema_examples/autopilot_amber_action_packet.example.json";
const negativeFixturePath = "tests/schema_examples/autopilot_amber_action_packet_negative_cases.example.json";

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

const falseFlags = Object.fromEntries(guardFlags.map((flag) => [flag, false]));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertDeepEqual(actual, expected, label) {
  assert(JSON.stringify(actual, null, 2) === JSON.stringify(expected, null, 2), `${label} mismatch`);
}

function assertFalseFlags(flags) {
  assert(flags && typeof flags === "object", "side_effect_flags are required");
  for (const flag of guardFlags) {
    assert(Object.prototype.hasOwnProperty.call(flags, flag), `side_effect_flags missing ${flag}`);
    assert(flags[flag] === false, `${flag} must be false`);
  }
}

function assertSchemaContainsRequiredFields() {
  const schema = read(schemaPath);
  const requiredTokens = [
    "packet_id",
    "task_id",
    "intent",
    "target_systems",
    "exact_allowed_paths_or_objects",
    "forbidden_paths_or_objects",
    "allowed_commands_or_operations",
    "max_call_count",
    "max_write_count",
    "max_cost_when_applicable",
    "selected_plugin_id",
    "command",
    "model",
    "input_reference",
    "output_directory_or_write_target",
    "overwrite_existing_files_allowed",
    "secret_value_read_allowed",
    "raw_private_data_print_allowed",
    "dependency_manifest_change_allowed",
    "dependency_manifest_change_allowed_exact_package_list",
    "rollback_or_cleanup_plan",
    "validation_required",
    "stop_conditions",
    "evidence_to_record",
    "receipt_required",
    "registry_entry_required",
    "continuation_judge_required",
    "cost_unknown_is_red"
  ];

  for (const token of requiredTokens) {
    assert(schema.includes(token), `Schema missing ${token}`);
  }
}

function validatePacket(packet) {
  assert(packet.contract_type === "autopilot_amber_action_packet", "contract_type mismatch");
  assert(packet.phase === "amber_action_packet_preflight_v1", "phase mismatch");
  assert(packet.packet_id && typeof packet.packet_id === "string", "packet_id is required");
  assert(packet.task_id && typeof packet.task_id === "string", "task_id is required");
  assert(packet.lane === "Amber", "lane must be Amber");
  assert(packet.intent && typeof packet.intent === "string", "intent is required");
  assert(Array.isArray(packet.target_systems) && packet.target_systems.includes("local_repository_fixture_only"), "target_systems must identify local fixture scope");
  assert(Array.isArray(packet.exact_allowed_paths_or_objects) && packet.exact_allowed_paths_or_objects.length > 0, "exact allowed paths are required");
  assert(Array.isArray(packet.forbidden_paths_or_objects) && packet.forbidden_paths_or_objects.includes(".env*"), "forbidden paths must include .env*");
  assert(packet.forbidden_paths_or_objects.includes("external repositories"), "forbidden paths must include external repositories");
  assert(packet.forbidden_paths_or_objects.includes("real VCPChat"), "forbidden paths must include real VCPChat");
  assert(packet.forbidden_paths_or_objects.includes("real VCPToolBox"), "forbidden paths must include real VCPToolBox");
  assert(Array.isArray(packet.allowed_commands_or_operations) && packet.allowed_commands_or_operations.length > 0, "allowed commands or operations are required");

  assert(packet.max_call_count && typeof packet.max_call_count === "object", "max_call_count is required");
  assert(packet.max_call_count.provider_calls === 0, "local preflight provider_calls must be 0");
  assert(packet.max_call_count.plugin_calls === 0, "local preflight plugin_calls must be 0");
  assert(packet.max_call_count.api_calls === 0, "local preflight api_calls must be 0");
  assert(packet.max_call_count.image_candidates === 0, "local preflight image_candidates must be 0");
  assert(packet.max_call_count.runtime_probe_minutes === 0, "local preflight runtime_probe_minutes must be 0");
  assert(Number.isInteger(packet.max_write_count) && packet.max_write_count >= packet.exact_allowed_paths_or_objects.length, "max_write_count must cover allowed local writes");
  assert(packet.max_cost_when_applicable && typeof packet.max_cost_when_applicable === "object", "max_cost_when_applicable is required");
  assert(packet.max_cost_when_applicable.amount === 0, "local preflight cost amount must be 0");
  assert(packet.max_cost_when_applicable.currency === "not_applicable", "local preflight cost currency must be not_applicable");
  assert(packet.max_cost_when_applicable.cost_tracking_required === true, "cost tracking is required");
  assert(packet.max_cost_when_applicable.cost_unknown_is_red === true, "unknown cost must be Red");

  assert(packet.selected_plugin_id === null, "local preflight selected_plugin_id must be null");
  assert(packet.command === "local_fixture_dry_run", "local preflight command mismatch");
  assert(packet.model === null, "local preflight model must be null");
  assert(packet.input_reference === materializedSnapshotPath, "input_reference mismatch");
  assert(packet.output_directory_or_write_target === "tests/schema_examples", "output target mismatch");
  assert(packet.overwrite_existing_files_allowed === false, "overwrite must be false");
  assert(packet.secret_value_read_allowed === false, "secret reads must be false");
  assert(packet.raw_private_data_print_allowed === false, "raw private data printing must be false");
  assert(packet.dependency_manifest_change_allowed === false, "dependency manifest changes must be false");
  assert(Array.isArray(packet.dependency_manifest_change_allowed_exact_package_list), "dependency exact package list is required");
  assert(packet.dependency_manifest_change_allowed_exact_package_list.length === 0, "local preflight dependency package list must be empty");
  assert(packet.rollback_or_cleanup_plan && typeof packet.rollback_or_cleanup_plan === "string", "rollback plan is required");
  assert(Array.isArray(packet.validation_required) && packet.validation_required.length > 0, "validation_required is required");
  assert(Array.isArray(packet.stop_conditions) && packet.stop_conditions.some((item) => item.includes("Red Lane")), "stop_conditions must include Red Lane");
  assert(Array.isArray(packet.evidence_to_record) && packet.evidence_to_record.includes("execution receipt"), "evidence must include execution receipt");
  assert(packet.evidence_to_record.includes("receipt registry entry"), "evidence must include receipt registry entry");
  assert(packet.receipt_required === true, "receipt_required must be true");
  assert(packet.registry_entry_required === true, "registry_entry_required must be true");
  assert(packet.continuation_judge_required === true, "continuation_judge_required must be true");
  assertFalseFlags(packet.side_effect_flags);
}

function comparePacketToEmbeddedDryRun(packet) {
  const materialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const loop = buildAmberDryRunLoop(materialized);
  const embedded = loop.action_packet;
  const mirroredFields = [
    "task_id",
    "target_systems",
    "exact_allowed_paths_or_objects",
    "forbidden_paths_or_objects",
    "allowed_commands_or_operations",
    "selected_plugin_id",
    "command",
    "model",
    "input_reference",
    "output_directory_or_write_target",
    "overwrite_existing_files_allowed",
    "secret_value_read_allowed",
    "raw_private_data_print_allowed",
    "dependency_manifest_change_allowed",
    "rollback_or_cleanup_plan",
    "validation_required",
    "stop_conditions",
    "evidence_to_record"
  ];

  for (const field of mirroredFields) {
    assertDeepEqual(packet[field], embedded[field], `Action packet mirror field ${field}`);
  }
  assert(packet.max_write_count === loop.envelope.max_write_files, "max_write_count must mirror envelope max_write_files");
  assert(packet.max_cost_when_applicable.amount === loop.envelope.max_cost_amount, "cost amount must mirror envelope");
  assert(packet.max_cost_when_applicable.cost_unknown_is_red === loop.envelope.cost_unknown_is_red, "cost_unknown_is_red must mirror envelope");
}

function expectFailure(caseId, mutate) {
  const packet = clone(readJson(packetFixturePath).autopilot_amber_action_packet);
  mutate(packet);
  try {
    validatePacket(packet);
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
  assertSchemaContainsRequiredFields();
  const packet = readJson(packetFixturePath).autopilot_amber_action_packet;
  validatePacket(packet);
  comparePacketToEmbeddedDryRun(packet);

  const negativeCases = [
    expectFailure("missing_packet_id", (packet) => {
      delete packet.packet_id;
    }),
    expectFailure("provider_budget_nonzero_in_local_preflight", (packet) => {
      packet.max_call_count.provider_calls = 1;
    }),
    expectFailure("cost_unknown_or_unbounded", (packet) => {
      packet.max_cost_when_applicable.amount = "unknown";
    }),
    expectFailure("secret_value_read_allowed_true", (packet) => {
      packet.secret_value_read_allowed = true;
    }),
    expectFailure("raw_private_data_print_allowed_true", (packet) => {
      packet.raw_private_data_print_allowed = true;
    }),
    expectFailure("overwrite_existing_files_allowed_true", (packet) => {
      packet.overwrite_existing_files_allowed = true;
    }),
    expectFailure("dependency_manifest_change_without_exact_package_list", (packet) => {
      packet.dependency_manifest_change_allowed = true;
    }),
    expectFailure("missing_rollback_plan", (packet) => {
      packet.rollback_or_cleanup_plan = "";
    }),
    expectFailure("missing_validation_required", (packet) => {
      packet.validation_required = [];
    }),
    expectFailure("missing_stop_conditions", (packet) => {
      packet.stop_conditions = [];
    }),
    expectFailure("missing_receipt_requirement", (packet) => {
      packet.receipt_required = false;
    }),
    expectFailure("side_effect_guard_true", (packet) => {
      packet.side_effect_flags.provider_contact_performed = true;
    })
  ];

  const candidateGaps = [
    {
      gap_id: "embedded_action_packet_no_standalone_preflight",
      lane: "Green",
      priority: "highest",
      selected: true,
      source_evidence: [
        "scripts/simulate_amber_dry_run_execution_loop.js",
        "scripts/validate_amber_dry_run_execution_loop.js"
      ],
      rationale: "The Amber dry-run loop embedded an action packet, but future real Amber work needs a reusable standalone preflight fixture and fail-closed validator."
    },
    {
      gap_id: "readiness_receipt_registry_cross_claims",
      lane: "Green",
      priority: "next",
      selected: false,
      source_evidence: [
        "scripts/validate_complete_autopilot_readiness_gate.js",
        "tests/schema_examples/autopilot_receipt_registry.example.json"
      ],
      rationale: "Readiness-to-registry cross-claim checks are valuable after packet preflight, but packet validation is the nearer pre-execution boundary."
    },
    {
      gap_id: "agent_board_resume_compaction_guard",
      lane: "Green",
      priority: "later",
      selected: false,
      source_evidence: [
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md"
      ],
      rationale: "Resume drift remains important, but it is less directly tied to real Amber execution safety than action packet preflight."
    },
    {
      gap_id: "live_provider_action_packet_preflight",
      lane: "Red",
      priority: "blocked",
      selected: false,
      source_evidence: [
        "AGENTS.md",
        "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md"
      ],
      rationale: "A live provider/plugin/API/image packet cannot be exercised in this mission because real external actions are explicitly forbidden."
    }
  ];

  return {
    autopilot_amber_action_packet_negative_cases: {
      version: "v1",
      phase: "amber_action_packet_preflight_v1",
      selected_task: "add_amber_action_packet_preflight_validator",
      selected_task_lane: "Green",
      schema_path: schemaPath,
      packet_fixture_path: packetFixturePath,
      packet_id: packet.packet_id,
      packet_valid: true,
      packet_mirrors_embedded_dry_run_packet: true,
      cost_unknown_is_red: true,
      receipt_required: packet.receipt_required,
      registry_entry_required: packet.registry_entry_required,
      continuation_judge_required: packet.continuation_judge_required,
      candidate_gaps: candidateGaps,
      candidate_gap_count: candidateGaps.length,
      lower_priority_candidates: candidateGaps.filter((gap) => !gap.selected && gap.lane !== "Red").map((gap) => gap.gap_id),
      red_blocked_candidates: candidateGaps.filter((gap) => gap.lane === "Red").map((gap) => gap.gap_id),
      negative_cases: negativeCases,
      negative_case_count: negativeCases.length,
      caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
      all_negative_cases_caught: negativeCases.every((item) => item.result === "caught" && item.expected_failure === true),
      validator_strengthened: "Amber action packet preflight now rejects missing identity, budget, cost, rollback, validation, stop-condition, receipt, registry, and side-effect boundaries before real Amber work.",
      side_effect_flags: falseFlags
    }
  };
}

function main() {
  const report = buildReport();
  const actual = report.autopilot_amber_action_packet_negative_cases;

  if (process.argv.includes("--write-fixture")) {
    writeJson(negativeFixturePath, report);
  }

  const expected = readJson(negativeFixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "Amber action packet preflight deterministic output");
  assertDeepEqual(report, expected, "Amber action packet preflight fixture");
  assert(actual.phase === "amber_action_packet_preflight_v1", "phase mismatch");
  assert(actual.selected_task === "add_amber_action_packet_preflight_validator", "selected task mismatch");
  assert(actual.selected_task_lane === "Green", "selected task must be Green");
  assert(actual.packet_valid === true, "packet must be valid");
  assert(actual.packet_mirrors_embedded_dry_run_packet === true, "packet must mirror embedded dry-run packet");
  assert(actual.cost_unknown_is_red === true, "cost unknown must be Red");
  assert(actual.receipt_required === true && actual.registry_entry_required === true && actual.continuation_judge_required === true, "receipt, registry, and continuation requirements must be true");
  assert(actual.candidate_gap_count >= 3, "at least three candidate gaps are required");
  assert(actual.candidate_gaps.filter((gap) => gap.selected).length === 1, "exactly one candidate gap must be selected");
  assert(actual.negative_case_count >= 8, "at least eight packet negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "caught count must equal negative case count");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");
  assert(actual.red_blocked_candidates.includes("live_provider_action_packet_preflight"), "live provider action packet must remain Red-blocked");
  assertFalseFlags(actual.side_effect_flags);

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    selected_task: actual.selected_task,
    selected_task_lane: actual.selected_task_lane,
    deterministic_output_verified: true,
    fixture_verified: true,
    schema_verified: true,
    packet_valid: actual.packet_valid,
    packet_mirrors_embedded_dry_run_packet: actual.packet_mirrors_embedded_dry_run_packet,
    candidate_gap_count: actual.candidate_gap_count,
    lower_priority_candidates: actual.lower_priority_candidates,
    red_blocked_candidates: actual.red_blocked_candidates,
    negative_case_count: actual.negative_case_count,
    caught_negative_case_count: actual.caught_negative_case_count,
    all_negative_cases_caught: actual.all_negative_cases_caught,
    cost_unknown_is_red: actual.cost_unknown_is_red,
    receipt_required: actual.receipt_required,
    registry_entry_required: actual.registry_entry_required,
    continuation_judge_required: actual.continuation_judge_required,
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
