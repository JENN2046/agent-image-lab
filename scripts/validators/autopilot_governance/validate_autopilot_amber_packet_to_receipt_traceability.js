const fs = require("node:fs");
const path = require("node:path");
const { validateReceiptAgainstRegistryEntry, validateRegistry } = require("./validate_autopilot_receipt_registry_negative_cases.js");

const root = path.resolve(__dirname, "../../..");
const packetPath = "tests/schema_examples/autopilot_amber_action_packet.example.json";
const receiptPath = "tests/schema_examples/autopilot_execution_receipt.amber_dry_run_loop.example.json";
const registryPath = "tests/schema_examples/autopilot_receipt_registry.example.json";
const fixturePath = "tests/schema_examples/autopilot_amber_packet_to_receipt_traceability.example.json";

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

function assertStringListEqual(actual, expected, label) {
  assertDeepEqual([...actual].sort(), [...expected].sort(), label);
}

function assertGuardFalse(guard, label) {
  assert(guard && typeof guard === "object", `${label} guard is required`);
  for (const flag of guardFlags) {
    assert(Object.prototype.hasOwnProperty.call(guard, flag), `${label} missing guard flag ${flag}`);
    assert(guard[flag] === false, `${label} must keep ${flag}=false`);
  }
}

function assertPacketCallBudgetCoversReceipt(packet, receipt) {
  const calls = receipt.calls_used;
  const budget = packet.max_call_count;
  assert(calls.provider_calls <= budget.provider_calls, "provider_calls exceed packet budget");
  assert(calls.plugin_calls <= budget.plugin_calls, "plugin_calls exceed packet budget");
  assert(calls.api_calls <= budget.api_calls, "api_calls exceed packet budget");
  assert(calls.image_candidates <= budget.image_candidates, "image_candidates exceed packet budget");
  assert(calls.runtime_probe_minutes <= budget.runtime_probe_minutes, "runtime_probe_minutes exceed packet budget");
}

function assertReceiptFilesCoveredByPacket(packet, receipt) {
  const allowed = new Set(packet.exact_allowed_paths_or_objects);
  const uncovered = receipt.files_written.filter((file) => !allowed.has(file));
  assert(uncovered.length === 0, `receipt files_written not covered by packet exact_allowed_paths_or_objects: ${uncovered.join(", ")}`);
  assert(packet.exact_allowed_paths_or_objects.includes(receiptPath), "packet must explicitly allow the receipt fixture path");
  assert(packet.exact_allowed_paths_or_objects.includes(registryPath), "packet must explicitly allow the receipt registry path");
  assert(packet.max_write_count >= receipt.files_written.length, "receipt files_written exceeds packet max_write_count");
}

function validateTraceability(packet, receipt, registry) {
  assert(packet.contract_type === "autopilot_amber_action_packet", "packet contract_type mismatch");
  assert(receipt.contract_type === "autopilot_execution_receipt", "receipt contract_type mismatch");
  assert(packet.lane === "Amber" && receipt.lane === "Amber", "packet and receipt must both stay Amber");
  assert(packet.task_id === receipt.task_id, "packet task_id must match receipt task_id");
  assert(packet.task_id === receipt.amber_dry_run_task_id, "packet task_id must match receipt amber dry-run task id");
  assert(packet.max_write_count === 7, "packet max_write_count must cover the exact local dry-run write set");
  assert(packet.output_directory_or_write_target === "tests/schema_examples", "packet output target mismatch");
  assert(packet.overwrite_existing_files_allowed === false, "packet overwrite must remain false");
  assert(packet.secret_value_read_allowed === false, "packet secret read must remain false");
  assert(packet.raw_private_data_print_allowed === false, "packet raw private data printing must remain false");
  assert(packet.dependency_manifest_change_allowed === false, "packet dependency change must remain false");
  assert(receipt.validation_result === "passed", "receipt validation_result must be passed");
  assert(receipt.stop_reason === "none", "receipt stop_reason must be none");
  assert(receipt.next_auto_step_allowed === true, "receipt next_auto_step_allowed must be true");
  assert(receipt.rollback_or_cleanup_plan === packet.rollback_or_cleanup_plan, "receipt rollback plan must trace to packet rollback plan");
  assertStringListEqual(receipt.target_systems, packet.target_systems, "target_systems");
  assertStringListEqual(receipt.validation_run, packet.validation_required, "validation_run traces to packet validation_required");
  assert(packet.evidence_to_record.includes("execution receipt"), "packet evidence must require execution receipt");
  assert(packet.evidence_to_record.includes("receipt registry entry"), "packet evidence must require receipt registry entry");
  assert(packet.evidence_to_record.includes("validation result"), "packet evidence must require validation result");
  assert(packet.stop_conditions.some((item) => item.includes("Red Lane")), "packet stop conditions must include Red Lane");
  assertPacketCallBudgetCoversReceipt(packet, receipt);
  assertReceiptFilesCoveredByPacket(packet, receipt);
  assert(receipt.cost_accounting.cost_tracking_required === packet.max_cost_when_applicable.cost_tracking_required, "cost tracking requirement mismatch");
  assert(receipt.cost_accounting.cost_amount <= packet.max_cost_when_applicable.amount, "receipt cost exceeds packet cost cap");
  assert(receipt.cost_accounting.cost_currency === packet.max_cost_when_applicable.currency, "cost currency mismatch");
  assert(receipt.cost_accounting.cost_unknown === false, "receipt cost_unknown must be false");
  assert(receipt.cost_accounting.cost_unknown_is_red === packet.max_cost_when_applicable.cost_unknown_is_red, "cost unknown Red boundary mismatch");
  assertGuardFalse(packet.side_effect_flags, "packet");
  assertGuardFalse(receipt.guard, "receipt");

  const registryEntry = registry.receipts.find((entry) => entry.receipt_id === receipt.receipt_id);
  assert(registryEntry, "receipt registry entry missing");
  assert(registryEntry.task_id === packet.task_id, "registry entry task_id must trace to packet task_id");
  assert(registryEntry.max_write_files === packet.max_write_count, "registry max_write_files must trace to packet max_write_count");
  validateReceiptAgainstRegistryEntry(registry, registryEntry, receipt);

  return { registryEntry };
}

function expectFailure(caseId, mutate) {
  const packet = clone(readJson(packetPath).autopilot_amber_action_packet);
  const receipt = clone(readJson(receiptPath).autopilot_execution_receipt);
  const registry = clone(readJson(registryPath).autopilot_receipt_registry);
  mutate({ packet, receipt, registry });

  try {
    validateTraceability(packet, receipt, registry);
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
  const packet = readJson(packetPath).autopilot_amber_action_packet;
  const receipt = readJson(receiptPath).autopilot_execution_receipt;
  const registry = readJson(registryPath).autopilot_receipt_registry;
  validateRegistry(registry);
  const { registryEntry } = validateTraceability(packet, receipt, registry);

  const negativeCases = [
    expectFailure("receipt_task_id_not_preflighted_fails", ({ receipt }) => {
      receipt.task_id = "unpreflighted-task";
    }),
    expectFailure("registry_write_budget_not_traced_to_packet_fails", ({ registry }) => {
      const entry = registry.receipts.find((item) => item.path === receiptPath);
      entry.max_write_files = 5;
    }),
    expectFailure("receipt_file_outside_packet_allowlist_fails", ({ receipt }) => {
      receipt.files_written.push("docs/UNPREFLIGHTED_WRITE.md");
    }),
    expectFailure("receipt_validation_not_required_by_packet_fails", ({ receipt }) => {
      receipt.validation_run = ["node scripts/unpreflighted_validator.js"];
    }),
    expectFailure("receipt_cost_exceeds_packet_cap_fails", ({ receipt }) => {
      receipt.cost_accounting.cost_amount = 1;
    }),
    expectFailure("receipt_rollback_plan_drift_fails", ({ receipt }) => {
      receipt.rollback_or_cleanup_plan = "Revert something else.";
    }),
    expectFailure("packet_secret_boundary_weakened_fails", ({ packet }) => {
      packet.secret_value_read_allowed = true;
    }),
    expectFailure("receipt_side_effect_guard_true_fails", ({ receipt }) => {
      receipt.guard.provider_contact_performed = true;
    })
  ];

  const candidateGaps = [
    {
      gap_id: "amber_packet_to_receipt_traceability",
      lane: "Green",
      priority: "highest",
      selected: true,
      source_evidence: [
        packetPath,
        receiptPath,
        registryPath
      ],
      rationale: "The receipt must prove its identity, budget, write set, validation, rollback, cost, and registry entry trace back to the preflight packet."
    },
    {
      gap_id: "agent_board_resume_compaction_guard",
      lane: "Green",
      priority: "next",
      selected: false,
      source_evidence: [
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        ".agent_board/HANDOFF.md"
      ],
      rationale: "After packet-to-receipt traceability, the next local hardening target is reducing long-session resume drift."
    },
    {
      gap_id: "future_real_provider_cost_boundary",
      lane: "Red",
      priority: "blocked",
      selected: false,
      source_evidence: [
        "schemas/autopilot_autonomy_envelope.schema.yaml",
        "schemas/autopilot_execution_receipt.schema.yaml"
      ],
      rationale: "Live provider cost validation remains Red-gated and out of scope for fixture-only traceability."
    }
  ];

  return {
    autopilot_amber_packet_to_receipt_traceability: {
      version: "v1",
      phase: "amber_packet_to_receipt_traceability_v1",
      selected_task: "add_amber_packet_to_receipt_traceability_validator",
      selected_task_lane: "Green",
      candidate_gaps: candidateGaps,
      candidate_gap_count: candidateGaps.length,
      packet_path: packetPath,
      packet_id: packet.packet_id,
      receipt_path: receiptPath,
      receipt_id: receipt.receipt_id,
      registry_path: registryPath,
      registry_entry_path: registryEntry.path,
      task_id_trace_verified: true,
      target_systems_trace_verified: true,
      call_budget_trace_verified: true,
      write_budget_trace_verified: true,
      receipt_files_covered_by_packet: true,
      validation_trace_verified: true,
      rollback_trace_verified: true,
      cost_trace_verified: true,
      registry_trace_verified: true,
      guard_trace_verified: true,
      negative_cases: negativeCases,
      negative_case_count: negativeCases.length,
      caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
      all_negative_cases_caught: negativeCases.every((item) => item.result === "caught" && item.expected_failure === true),
      validator_strengthened: "Amber packet-to-receipt traceability now rejects receipts whose task, write set, validation, rollback, cost, registry, or guard evidence does not trace to a preflight packet.",
      lower_priority_candidates: candidateGaps.filter((gap) => !gap.selected && gap.lane !== "Red").map((gap) => gap.gap_id),
      red_blocked_candidates: candidateGaps.filter((gap) => gap.lane === "Red").map((gap) => gap.gap_id),
      side_effect_flags: falseFlags
    }
  };
}

function main() {
  const report = buildReport();
  const actual = report.autopilot_amber_packet_to_receipt_traceability;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "Amber packet-to-receipt traceability deterministic output");
  assertDeepEqual(report, expected, "Amber packet-to-receipt traceability fixture");
  assert(actual.phase === "amber_packet_to_receipt_traceability_v1", "phase mismatch");
  assert(actual.selected_task === "add_amber_packet_to_receipt_traceability_validator", "selected task mismatch");
  assert(actual.selected_task_lane === "Green", "selected task must be Green");
  assert(actual.candidate_gap_count >= 3, "at least three candidate gaps are required");
  assert(actual.candidate_gaps.filter((gap) => gap.selected).length === 1, "exactly one candidate gap must be selected");
  assert(actual.task_id_trace_verified === true, "task id trace must be verified");
  assert(actual.receipt_files_covered_by_packet === true, "receipt write set must be covered by packet");
  assert(actual.validation_trace_verified === true, "validation trace must be verified");
  assert(actual.rollback_trace_verified === true, "rollback trace must be verified");
  assert(actual.cost_trace_verified === true, "cost trace must be verified");
  assert(actual.registry_trace_verified === true, "registry trace must be verified");
  assert(actual.negative_case_count >= 8, "at least eight traceability negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "caught count must equal negative case count");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");
  assert(actual.red_blocked_candidates.includes("future_real_provider_cost_boundary"), "Red-blocked future provider cost boundary must be recorded");
  assertGuardFalse(actual.side_effect_flags, "Amber packet-to-receipt traceability validator");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    deterministic_output_verified: true,
    fixture_verified: true,
    selected_task: actual.selected_task,
    selected_task_lane: actual.selected_task_lane,
    candidate_gap_count: actual.candidate_gap_count,
    selected_gap: actual.candidate_gaps.find((gap) => gap.selected).gap_id,
    packet_id: actual.packet_id,
    receipt_id: actual.receipt_id,
    registry_entry_path: actual.registry_entry_path,
    task_id_trace_verified: actual.task_id_trace_verified,
    receipt_files_covered_by_packet: actual.receipt_files_covered_by_packet,
    validation_trace_verified: actual.validation_trace_verified,
    rollback_trace_verified: actual.rollback_trace_verified,
    cost_trace_verified: actual.cost_trace_verified,
    registry_trace_verified: actual.registry_trace_verified,
    lower_priority_candidates: actual.lower_priority_candidates,
    red_blocked_candidates: actual.red_blocked_candidates,
    negative_case_count: actual.negative_case_count,
    caught_negative_case_count: actual.caught_negative_case_count,
    all_negative_cases_caught: actual.all_negative_cases_caught,
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
  main,
  buildReport,
  validateTraceability
};
