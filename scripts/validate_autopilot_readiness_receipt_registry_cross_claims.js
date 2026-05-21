const fs = require("node:fs");
const path = require("node:path");
const { buildCompleteAutopilotReadinessGate } = require("./validate_complete_autopilot_readiness_gate.js");
const {
  validateReceiptAgainstRegistryEntry,
  validateRegistry
} = require("./validate_autopilot_receipt_registry_negative_cases.js");
const { detectAutopilotEvolutionGaps } = require("./detect_autopilot_evolution_gaps.js");

const root = path.resolve(__dirname, "..");
const registryPath = "tests/schema_examples/autopilot_receipt_registry.example.json";
const fixturePath = "tests/schema_examples/autopilot_readiness_receipt_registry_cross_claims.example.json";
const dryRunReceiptPath = "tests/schema_examples/autopilot_execution_receipt.amber_dry_run_loop.example.json";

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

function assertGuardFalse(guard, label) {
  assert(guard && typeof guard === "object", `${label} guard is required`);
  for (const flag of guardFlags) {
    assert(Object.prototype.hasOwnProperty.call(guard, flag), `${label} missing guard flag ${flag}`);
    assert(guard[flag] === false, `${label} must keep ${flag}=false`);
  }
}

function validateCrossClaims(readiness, registry, receiptOverride = null) {
  const chain = readiness.chain;

  assert(readiness.readiness_result === "passed_local_full_autopilot_ready_no_push", "readiness result mismatch");
  assert(chain.amber_receipt_registered === true, "readiness gate must claim Amber receipt registered");
  assert(chain.receipt_registry_count === registry.receipts.length, "readiness registry count mismatch");

  const registryEntry = registry.receipts.find((entry) => entry.receipt_id === chain.amber_dry_run_receipt_id);
  assert(registryEntry, `registry entry missing for readiness receipt ${chain.amber_dry_run_receipt_id}`);
  assert(registryEntry.task_id === chain.amber_dry_run_task_id, "readiness task id does not match registry entry");
  assert(registryEntry.envelope_id === chain.amber_dry_run_envelope_id, "readiness envelope id does not match registry entry");
  assert(registryEntry.lane === "Amber", "registry entry lane must remain Amber");
  assert(fs.existsSync(path.join(root, registryEntry.path)), `registry receipt path missing: ${registryEntry.path}`);

  const receipt = receiptOverride || readJson(registryEntry.path).autopilot_execution_receipt;
  validateReceiptAgainstRegistryEntry(registry, registryEntry, receipt);

  assert(receipt.receipt_id === chain.amber_dry_run_receipt_id, "receipt_id does not match readiness claim");
  assert(receipt.task_id === chain.amber_dry_run_task_id, "receipt task_id does not match readiness claim");
  assert(receipt.envelope_id === chain.amber_dry_run_envelope_id, "receipt envelope_id does not match readiness claim");
  assert(receipt.readiness_claim === chain.amber_readiness_claim, "receipt readiness claim does not match readiness gate");
  assert(receipt.amber_dry_run_matches_current_next_safe_task === chain.amber_dry_run_matches_current_next_safe_task, "receipt current-task-match flag does not match readiness gate");
  assert(receipt.selected_current_next_safe_task_id === chain.fixture_selected_next_safe_task, "receipt selected current next safe task must match readiness fixture evidence");
  assert(receipt.readiness_claim === "future_amber_loop_fixture_validated_not_current_task_execution", "receipt readiness claim must stay scoped to future fixture execution");

  return {
    registryEntry,
    receipt
  };
}

function expectFailure(caseId, mutate) {
  const readiness = clone(buildCompleteAutopilotReadinessGate());
  const registry = clone(readJson(registryPath).autopilot_receipt_registry);
  const receipt = clone(readJson(dryRunReceiptPath).autopilot_execution_receipt);
  mutate({ readiness, registry, receipt });

  try {
    validateCrossClaims(readiness, registry, receipt);
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
  const readiness = buildCompleteAutopilotReadinessGate();
  const registry = readJson(registryPath).autopilot_receipt_registry;
  validateRegistry(registry);
  const evolution = detectAutopilotEvolutionGaps();
  const { registryEntry, receipt } = validateCrossClaims(readiness, registry);

  const negativeCases = [
    expectFailure("readiness_missing_registry_entry_fails", ({ readiness, registry }) => {
      registry.receipts = registry.receipts.filter((entry) => entry.receipt_id !== readiness.chain.amber_dry_run_receipt_id);
    }),
    expectFailure("readiness_stale_receipt_id_fails", ({ readiness }) => {
      readiness.chain.amber_dry_run_receipt_id = "receipt-stale-readiness-id";
    }),
    expectFailure("readiness_stale_task_id_fails", ({ readiness }) => {
      readiness.chain.amber_dry_run_task_id = "task-stale-readiness-id";
    }),
    expectFailure("readiness_stale_envelope_id_fails", ({ readiness }) => {
      readiness.chain.amber_dry_run_envelope_id = "envelope-stale-readiness-id";
    }),
    expectFailure("readiness_registry_count_drift_fails", ({ readiness, registry }) => {
      readiness.chain.receipt_registry_count = registry.receipts.length + 1;
    }),
    expectFailure("receipt_readiness_claim_mismatch_fails", ({ receipt }) => {
      receipt.readiness_claim = "current_next_safe_task_amber_loop_validated";
    }),
    expectFailure("receipt_selected_task_claim_mismatch_fails", ({ receipt }) => {
      receipt.selected_current_next_safe_task_id = "future_budgeted_amber_receipt_task";
    })
  ];

  const candidateGaps = [
    {
      gap_id: "readiness_receipt_registry_cross_claims",
      lane: "Green",
      priority: "highest",
      selected: true,
      source_evidence: [
        "scripts/validate_complete_autopilot_readiness_gate.js",
        "tests/schema_examples/complete_autopilot_readiness_gate.example.json",
        "tests/schema_examples/autopilot_receipt_registry.example.json"
      ],
      rationale: "Readiness claims now need an explicit bridge to registry entries and schema-valid receipt fixtures."
    },
    {
      gap_id: "amber_packet_to_receipt_traceability",
      lane: "Green",
      priority: "next",
      selected: false,
      source_evidence: [
        "scripts/validate_autopilot_amber_action_packet_preflight.js",
        "scripts/validate_amber_dry_run_execution_loop.js",
        dryRunReceiptPath
      ],
      rationale: "The next local bridge should prove receipt fields trace directly to a preflighted action packet."
    },
    {
      gap_id: "agent_board_resume_compaction_guard",
      lane: "Green",
      priority: "lower",
      selected: false,
      source_evidence: [
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        ".agent_board/HANDOFF.md"
      ],
      rationale: "Resume surfaces can still drift during long validator chains."
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
      rationale: "Live provider cost boundaries remain Red-gated and out of scope for local fixture-only validation."
    }
  ];

  return {
    autopilot_readiness_receipt_registry_cross_claims: {
      version: "v1",
      phase: "readiness_receipt_registry_cross_claims_v1",
      selected_task: "add_readiness_receipt_registry_cross_claim_validator",
      selected_task_lane: "Green",
      candidate_gaps: candidateGaps,
      candidate_gap_count: candidateGaps.length,
      readiness_gate_fixture_ref: "tests/schema_examples/complete_autopilot_readiness_gate.example.json",
      registry_path: registryPath,
      registry_receipt_count: registry.receipts.length,
      mapped_receipt_id: readiness.chain.amber_dry_run_receipt_id,
      mapped_task_id: readiness.chain.amber_dry_run_task_id,
      mapped_envelope_id: readiness.chain.amber_dry_run_envelope_id,
      registry_entry_path: registryEntry.path,
      receipt_schema_ref: registry.receipt_schema_ref,
      readiness_claim: readiness.chain.amber_readiness_claim,
      readiness_claim_registry_bridge_verified: true,
      receipt_registry_entry_verified: true,
      schema_valid_receipt_link_verified: true,
      receipt_selected_current_next_safe_task_matches_fixture: receipt.selected_current_next_safe_task_id === readiness.chain.fixture_selected_next_safe_task,
      receipt_future_fixture_scope_verified: receipt.readiness_claim === "future_amber_loop_fixture_validated_not_current_task_execution",
      evolution_next_recommended_task: evolution.next_recommended_task,
      negative_cases: negativeCases,
      negative_case_count: negativeCases.length,
      caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
      all_negative_cases_caught: negativeCases.every((item) => item.result === "caught" && item.expected_failure === true),
      validator_strengthened: "Readiness validation now proves its Amber receipt claim maps to a registry entry and schema-valid receipt fixture.",
      lower_priority_candidates: candidateGaps.filter((gap) => !gap.selected && gap.lane !== "Red").map((gap) => gap.gap_id),
      red_blocked_candidates: candidateGaps.filter((gap) => gap.lane === "Red").map((gap) => gap.gap_id),
      side_effect_flags: falseFlags
    }
  };
}

function main() {
  const report = buildReport();
  const actual = report.autopilot_readiness_receipt_registry_cross_claims;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "Readiness receipt registry cross-claim deterministic output");
  assertDeepEqual(report, expected, "Readiness receipt registry cross-claim fixture");
  assert(actual.phase === "readiness_receipt_registry_cross_claims_v1", "phase mismatch");
  assert(actual.selected_task === "add_readiness_receipt_registry_cross_claim_validator", "selected task mismatch");
  assert(actual.selected_task_lane === "Green", "selected task must be Green");
  assert(actual.candidate_gap_count >= 4, "at least four candidate gaps are required");
  assert(actual.candidate_gaps.filter((gap) => gap.selected).length === 1, "exactly one candidate gap must be selected");
  assert(actual.readiness_claim_registry_bridge_verified === true, "readiness claim bridge must be verified");
  assert(actual.receipt_registry_entry_verified === true, "receipt registry entry must be verified");
  assert(actual.schema_valid_receipt_link_verified === true, "schema-valid receipt link must be verified");
  assert(actual.receipt_selected_current_next_safe_task_matches_fixture === true, "receipt selected current next safe task must match readiness fixture evidence");
  assert(actual.receipt_future_fixture_scope_verified === true, "receipt future fixture scope must be verified");
  assert(actual.evolution_next_recommended_task !== "readiness_receipt_registry_cross_claims_v1", "evolution next task must advance beyond completed cross-claim hardening");
  assert(actual.negative_case_count >= 6, "at least six negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "caught count must equal negative case count");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");
  assert(actual.red_blocked_candidates.includes("future_real_provider_cost_boundary"), "Red-blocked future provider cost boundary must be recorded");
  assertGuardFalse(actual.side_effect_flags, "Readiness receipt registry cross-claim validator");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    deterministic_output_verified: true,
    fixture_verified: true,
    selected_task: actual.selected_task,
    selected_task_lane: actual.selected_task_lane,
    candidate_gap_count: actual.candidate_gap_count,
    selected_gap: actual.candidate_gaps.find((gap) => gap.selected).gap_id,
    registry_receipt_count: actual.registry_receipt_count,
    mapped_receipt_id: actual.mapped_receipt_id,
    registry_entry_path: actual.registry_entry_path,
    readiness_claim_registry_bridge_verified: actual.readiness_claim_registry_bridge_verified,
    receipt_registry_entry_verified: actual.receipt_registry_entry_verified,
    schema_valid_receipt_link_verified: actual.schema_valid_receipt_link_verified,
    evolution_next_recommended_task: actual.evolution_next_recommended_task,
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
  buildReport,
  validateCrossClaims
};
