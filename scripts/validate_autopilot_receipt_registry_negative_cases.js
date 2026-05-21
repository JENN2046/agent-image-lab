const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const registryPath = "tests/schema_examples/autopilot_receipt_registry.example.json";
const fixturePath = "tests/schema_examples/autopilot_receipt_registry_negative_cases.example.json";

const receiptGlobPrefix = "autopilot_execution_receipt";
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

function listReceiptExampleFiles() {
  const dir = path.join(root, "tests/schema_examples");
  return fs.readdirSync(dir)
    .filter((file) => file.startsWith(receiptGlobPrefix) && file.endsWith(".json"))
    .map((file) => `tests/schema_examples/${file}`)
    .sort();
}

function assertGuardFalse(guard, label) {
  assert(guard && typeof guard === "object", `${label} guard is required`);
  for (const flag of guardFlags) {
    assert(Object.prototype.hasOwnProperty.call(guard, flag), `${label} missing guard flag ${flag}`);
    assert(guard[flag] === false, `${label} must keep ${flag}=false`);
  }
}

function assertZeroCalls(callsUsed, label) {
  assert(callsUsed && typeof callsUsed === "object", `${label} calls_used is required`);
  assert(callsUsed.provider_calls === 0, `${label} provider_calls must be 0`);
  assert(callsUsed.plugin_calls === 0, `${label} plugin_calls must be 0`);
  assert(callsUsed.api_calls === 0, `${label} api_calls must be 0`);
  assert(callsUsed.image_candidates === 0, `${label} image_candidates must be 0`);
  assert(callsUsed.runtime_probe_minutes === 0, `${label} runtime_probe_minutes must be 0`);
}

function validateReceiptAgainstRegistryEntry(registry, entry, receipt) {
  assert(entry.path && fs.existsSync(path.join(root, entry.path)), `Registry entry file missing: ${entry.path}`);
  assert(receipt.receipt_id === entry.receipt_id, `receipt_id mismatch for ${entry.path}`);
  assert(receipt.task_id === entry.task_id, `task_id mismatch for ${entry.path}`);
  assert(receipt.envelope_id === entry.envelope_id, `envelope_id mismatch for ${entry.path}`);
  assert(receipt.lane === entry.lane, `lane mismatch for ${entry.path}`);
  assert(entry.receipt_only_or_replay === true, `receipt_only_or_replay must be true for ${entry.path}`);
  assertZeroCalls(receipt.calls_used, `Receipt ${entry.path}`);
  assert(Array.isArray(receipt.files_written), `files_written must be an array for ${entry.path}`);
  assert(receipt.files_written.length <= entry.max_write_files, `files_written exceeds max_write_files for ${entry.path}`);
  assert(Array.isArray(receipt.dependency_actions_used), `dependency_actions_used must be an array for ${entry.path}`);
  assert(receipt.dependency_actions_used.length <= entry.max_dependency_actions, `dependency actions exceed budget for ${entry.path}`);
  assert(receipt.cost_accounting && typeof receipt.cost_accounting === "object", `cost_accounting required for ${entry.path}`);
  assert(receipt.cost_accounting.cost_tracking_required === true, `cost tracking required for ${entry.path}`);
  assert(receipt.cost_accounting.cost_unknown === false, `cost_unknown must be false for ${entry.path}`);
  assert(receipt.cost_accounting.cost_unknown_is_red === true, `cost_unknown_is_red must be true for ${entry.path}`);
  if (typeof entry.max_cost_amount === "number" && typeof receipt.cost_accounting.cost_amount === "number") {
    assert(receipt.cost_accounting.cost_amount <= entry.max_cost_amount, `cost exceeds registry budget for ${entry.path}`);
  }
  assert(typeof receipt.rollback_or_cleanup_available === "boolean", `rollback availability required for ${entry.path}`);
  assert(typeof receipt.rollback_or_cleanup_plan === "string" && receipt.rollback_or_cleanup_plan.length > 0, `rollback plan required for ${entry.path}`);
  assert(Array.isArray(receipt.files_to_revert), `files_to_revert must be an array for ${entry.path}`);
  assert(Array.isArray(receipt.cleanup_targets), `cleanup_targets must be an array for ${entry.path}`);
  assert(Array.isArray(receipt.irreversible_actions_performed), `irreversible_actions_performed must be an array for ${entry.path}`);
  assert(receipt.irreversible_actions_performed.length === 0, `irreversible actions must not be hidden in ${entry.path}`);
  assert(typeof receipt.next_auto_step_allowed === "boolean", `next_auto_step_allowed must be boolean for ${entry.path}`);
  assert(["passed", "pending", "failed", "blocked", "not_run", "passed_with_warnings"].includes(receipt.validation_result), `validation_result invalid for ${entry.path}`);
  assertGuardFalse(receipt.guard, `Receipt ${entry.path}`);

  const registryPaths = registry.receipts.map((item) => item.path).sort();
  const receiptFiles = listReceiptExampleFiles();
  assertDeepEqual(registryPaths, receiptFiles, "Registry coverage for autopilot execution receipt examples");
}

function validateRegistry(registry) {
  assert(registry && registry.contract_type === "autopilot_receipt_registry", "Receipt registry contract_type mismatch");
  assert(registry.cost_unknown_is_red === true, "Registry must declare cost_unknown_is_red");
  assert(registry.rollback_structure_required === true, "Registry must require rollback structure");
  assert(Array.isArray(registry.receipts) && registry.receipts.length > 0, "Registry receipts are required");
  for (const entry of registry.receipts) {
    const receipt = readJson(entry.path).autopilot_execution_receipt;
    validateReceiptAgainstRegistryEntry(registry, entry, receipt);
  }
}

function expectFailure(caseId, mutate) {
  const registry = clone(readJson(registryPath).autopilot_receipt_registry);
  const entry = clone(registry.receipts.find((item) => item.path === "tests/schema_examples/autopilot_execution_receipt.amber_dry_run_loop.example.json"));
  const receipt = clone(readJson(entry.path).autopilot_execution_receipt);
  mutate({ registry, entry, receipt });
  try {
    validateReceiptAgainstRegistryEntry(registry, entry, receipt);
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
  const registry = readJson(registryPath).autopilot_receipt_registry;
  validateRegistry(registry);

  const negativeCases = [
    expectFailure("registry_missing_receipt_file", ({ entry }) => {
      entry.path = "tests/schema_examples/missing_autopilot_execution_receipt.example.json";
    }),
    expectFailure("registry_receipt_id_mismatch", ({ entry }) => {
      entry.receipt_id = "receipt-mismatched-id";
    }),
    expectFailure("receipt_files_written_over_budget", ({ entry, receipt }) => {
      entry.max_write_files = 1;
      receipt.files_written = ["a", "b"];
    }),
    expectFailure("receipt_cost_unknown_not_allowed", ({ receipt }) => {
      receipt.cost_accounting.cost_unknown = true;
    }),
    expectFailure("receipt_irreversible_action_hidden", ({ receipt }) => {
      receipt.irreversible_actions_performed = ["external provider charge"];
    }),
    expectFailure("receipt_side_effect_guard_true", ({ receipt }) => {
      receipt.guard.provider_contact_performed = true;
    }),
    expectFailure("receipt_dependency_actions_over_budget", ({ entry, receipt }) => {
      entry.max_dependency_actions = 0;
      receipt.dependency_actions_used = ["npm install imaginary-package"];
    })
  ];

  const candidateGaps = [
    {
      gap_id: "receipt_registry_negative_cases_missing",
      lane: "Green",
      priority: "highest",
      selected: true,
      source_evidence: [
        "scripts/validate_autopilot_governance_kernel.js",
        "tests/schema_examples/autopilot_receipt_registry.example.json"
      ],
      rationale: "The registry validates compliant receipts but did not prove malformed registry/receipt cases fail."
    },
    {
      gap_id: "receipt_registry_fixture_coverage_drift",
      lane: "Green",
      priority: "high",
      selected: false,
      source_evidence: [
        "tests/schema_examples/autopilot_execution_receipt*.json",
        "tests/schema_examples/autopilot_receipt_registry.example.json"
      ],
      rationale: "Coverage drift is now checked inside the selected validator by comparing registry paths against all receipt example files."
    },
    {
      gap_id: "readiness_receipt_registry_cross_claims",
      lane: "Green",
      priority: "next",
      selected: false,
      source_evidence: [
        "scripts/validate_complete_autopilot_readiness_gate.js",
        "tests/schema_examples/complete_autopilot_readiness_gate.example.json"
      ],
      rationale: "Readiness gate can later assert richer per-receipt coverage, but registry negative cases are the smaller direct fix."
    },
    {
      gap_id: "real_amber_provider_receipt_preflight",
      lane: "Red",
      priority: "blocked",
      selected: false,
      source_evidence: [
        "schemas/autopilot_autonomy_envelope.schema.yaml",
        "schemas/autopilot_execution_receipt.schema.yaml"
      ],
      rationale: "Testing live provider/API/image receipt behavior is blocked by the current no external action boundary."
    }
  ];

  return {
    autopilot_receipt_registry_negative_cases: {
      version: "v1",
      phase: "receipt_registry_negative_cases_v1",
      selected_task: "add_receipt_registry_negative_case_validator",
      selected_task_lane: "Green",
      candidate_gaps: candidateGaps,
      candidate_gap_count: candidateGaps.length,
      registry_path: registryPath,
      registry_receipt_count: registry.receipts.length,
      receipt_example_files: listReceiptExampleFiles(),
      registry_coverage_verified: true,
      negative_cases: negativeCases,
      negative_case_count: negativeCases.length,
      caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
      all_negative_cases_caught: negativeCases.every((item) => item.result === "caught" && item.expected_failure === true),
      validator_strengthened: "Receipt registry validation now proves invalid Amber receipt and registry coverage cases fail.",
      lower_priority_candidates: candidateGaps.filter((gap) => !gap.selected && gap.lane !== "Red").map((gap) => gap.gap_id),
      red_blocked_candidates: candidateGaps.filter((gap) => gap.lane === "Red").map((gap) => gap.gap_id),
      side_effect_flags: falseFlags
    }
  };
}

function main() {
  const report = buildReport();
  const actual = report.autopilot_receipt_registry_negative_cases;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "Receipt registry negative-case deterministic output");
  assertDeepEqual(report, expected, "Receipt registry negative-case fixture");
  assert(actual.phase === "receipt_registry_negative_cases_v1", "phase mismatch");
  assert(actual.selected_task === "add_receipt_registry_negative_case_validator", "selected task mismatch");
  assert(actual.selected_task_lane === "Green", "selected task must be Green");
  assert(actual.candidate_gap_count >= 3, "at least three candidate gaps are required");
  assert(actual.candidate_gaps.filter((gap) => gap.selected).length === 1, "exactly one candidate gap must be selected");
  assert(actual.registry_coverage_verified === true, "registry coverage must be verified");
  assert(actual.negative_case_count >= 6, "at least six receipt negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "caught count must equal negative case count");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");
  assert(actual.red_blocked_candidates.includes("real_amber_provider_receipt_preflight"), "Red-blocked provider receipt preflight must be recorded");
  assertGuardFalse(actual.side_effect_flags, "Receipt registry negative-case validator");

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
    registry_coverage_verified: actual.registry_coverage_verified,
    receipt_example_file_count: actual.receipt_example_files.length,
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
  validateReceiptAgainstRegistryEntry,
  validateRegistry
};
