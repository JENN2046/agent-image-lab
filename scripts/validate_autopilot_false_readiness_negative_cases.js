const fs = require("node:fs");
const path = require("node:path");
const { buildCompleteAutopilotReadinessGate } = require("./validate_complete_autopilot_readiness_gate.js");
const { reconcileAgentBoardQueue, materializedSnapshotPath } = require("./reconcile_agent_board_queue.js");
const { detectAutopilotEvolutionGaps } = require("./detect_autopilot_evolution_gaps.js");

const root = path.resolve(__dirname, "..");
const fixturePath = "tests/schema_examples/autopilot_false_readiness_negative_cases.example.json";

const falseFlags = {
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
  for (const [key, value] of Object.entries(flags)) {
    assert(value === false, `${key} must be false`);
  }
}

function assertCompleteReadinessSemantics(report) {
  assert(report.readiness_result === "passed_local_full_autopilot_ready_no_push", "readiness result must be final local no-push");
  assert(report.chain, "complete readiness chain is required");
  assert(!Object.prototype.hasOwnProperty.call(report.chain, "selected_next_safe_task"), "ambiguous selected_next_safe_task must not be present");
  assert(report.chain.fixture_selected_next_safe_task === "add_goal_decomposition_runtime_validation", "fixture selected next-safe task evidence mismatch");
  assert(report.chain.fixture_next_safe_task_evidence_type === "historical_test_fixture", "fixture next-safe evidence must be historical");
  assert(report.chain.current_next_boundary === "owner_push_safety_gate_after_review", "current next boundary must be owner push safety gate");
  assert(report.chain.current_next_boundary_type.includes("Red") && report.chain.current_next_boundary_type.includes("push-safety-gate"), "current boundary type must be Red push-safety-gate");
  assert(report.chain.amber_dry_run_matches_current_next_safe_task === false, "future Amber dry-run must not match current next-safe task");
  assert(report.chain.amber_readiness_claim === "future_amber_loop_fixture_validated_not_current_task_execution", "Amber readiness claim must remain fixture-scoped");
  assert(report.local_only_boundaries.push_allowed === false, "push must remain blocked");
  assertFalseFlags(report.side_effect_flags);
}

function assertReconciliationSemantics(report) {
  assert(report.result === "passed", "reconciliation result must pass");
  assert(report.queue_drift_detected === false, "reconciliation must not hide current-state drift");
  assert(Array.isArray(report.current_state_missing) && report.current_state_missing.length === 0, "current_state_missing must be empty");
  assert(report.current_state_matches && Object.values(report.current_state_matches).every((value) => value === true), "all current-state matches must be true");
  assert(report.details.current_boundary === "owner_push_safety_gate_after_review", "current boundary mismatch");
  assert(report.details.current_boundary_type.includes("Red") && report.details.current_boundary_type.includes("push-safety-gate"), "current boundary type mismatch");
}

function assertEvolutionSemantics(report) {
  assert(report.next_recommended_task !== "complete_autopilot_readiness_gate_v1", "next recommended task must not be completed readiness gate");
  assert(Array.isArray(report.completed_capabilities), "completed_capabilities required");
  assert(report.completed_capabilities.some((capability) => capability.capability_id === "complete_autopilot_readiness_gate_v1"), "completed readiness gate must be completed evidence");
  assert(report.proposals.every((proposal) => proposal.proposal_id !== "complete_autopilot_readiness_gate_v1"), "completed readiness gate must not reappear as a future proposal");
  assert(!report.completed_capabilities.some((capability) => capability.capability_id === report.next_recommended_task), "next recommended task must not be completed");
  assert(report.red_lane_self_authorized === false, "Red proposals must not self-authorize");
  assertFalseFlags(report.side_effect_flags);
}

function expectFailure(caseId, target, mutate, validator) {
  const candidate = clone(target);
  mutate(candidate);
  try {
    validator(candidate);
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

function buildNegativeCaseReport() {
  const completeReadiness = buildCompleteAutopilotReadinessGate();
  const materialized = readJson(materializedSnapshotPath).autopilot_goal_decomposition_materialized;
  const reconciliation = reconcileAgentBoardQueue(materialized);
  const evolution = detectAutopilotEvolutionGaps();

  assertCompleteReadinessSemantics(completeReadiness);
  assertReconciliationSemantics(reconciliation);
  assertEvolutionSemantics(evolution);

  const negativeCases = [
    expectFailure(
      "complete_readiness_ambiguous_selected_next_safe_task",
      completeReadiness,
      (candidate) => {
        candidate.chain.selected_next_safe_task = candidate.chain.fixture_selected_next_safe_task;
      },
      assertCompleteReadinessSemantics
    ),
    expectFailure(
      "complete_readiness_current_boundary_is_fixture_green_task",
      completeReadiness,
      (candidate) => {
        candidate.chain.current_next_boundary = candidate.chain.fixture_selected_next_safe_task;
        candidate.chain.current_next_boundary_type = "Green executable task";
      },
      assertCompleteReadinessSemantics
    ),
    expectFailure(
      "complete_readiness_false_amber_current_task_match",
      completeReadiness,
      (candidate) => {
        candidate.chain.amber_dry_run_matches_current_next_safe_task = true;
        candidate.chain.amber_readiness_claim = "current_task_execution_validated";
      },
      assertCompleteReadinessSemantics
    ),
    expectFailure(
      "reconciler_hidden_current_boundary_drift",
      reconciliation,
      (candidate) => {
        candidate.current_state_matches.current_next_boundary = false;
        candidate.current_state_missing = [];
        candidate.queue_drift_detected = false;
      },
      assertReconciliationSemantics
    ),
    expectFailure(
      "evolution_completed_readiness_reintroduced_as_future_proposal",
      evolution,
      (candidate) => {
        candidate.proposals.push({
          proposal_id: "complete_autopilot_readiness_gate_v1",
          title: "Re-run completed readiness gate",
          lane: "Green",
          detected_gap: "Incorrectly reintroduced completed capability as future work",
          proposed_local_task: "Repeat completed readiness gate",
          red_boundary: "No Red action",
          self_authorized: true
        });
        candidate.next_recommended_task = "complete_autopilot_readiness_gate_v1";
      },
      assertEvolutionSemantics
    ),
    expectFailure(
      "complete_readiness_side_effect_flag_flipped_true",
      completeReadiness,
      (candidate) => {
        candidate.side_effect_flags.provider_contact_performed = true;
      },
      assertCompleteReadinessSemantics
    )
  ];

  const candidateGaps = [
    {
      gap_id: "positive_only_readiness_semantics",
      lane: "Green",
      priority: "highest",
      selected: true,
      source_evidence: [
        "scripts/validate_complete_autopilot_readiness_gate.js",
        "scripts/reconcile_agent_board_queue.js",
        "scripts/detect_autopilot_evolution_gaps.js"
      ],
      rationale: "Current readiness builders prove accepted outputs; this task adds proof that ambiguous next-task, hidden drift, completed-work recursion, and side-effect false claims fail."
    },
    {
      gap_id: "receipt_registry_cost_rollback_negative_cases",
      lane: "Green",
      priority: "next",
      selected: false,
      source_evidence: [
        "scripts/validate_autopilot_governance_kernel.js",
        "tests/schema_examples/autopilot_receipt_registry.example.json"
      ],
      rationale: "Important, but narrower than cross-chain false-readiness semantics; it remains queued as receipt_registry_negative_cases_v1."
    },
    {
      gap_id: "resume_surface_compaction_drift",
      lane: "Green",
      priority: "later",
      selected: false,
      source_evidence: [
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md"
      ],
      rationale: "Status surfaces are long and drift-prone, but current-state reconciliation already checks the final boundary tokens; negative readiness proof closes the sharper risk first."
    },
    {
      gap_id: "live_provider_cost_boundary",
      lane: "Red",
      priority: "blocked",
      selected: false,
      source_evidence: [
        "schemas/autopilot_autonomy_envelope.schema.yaml",
        "schemas/autopilot_execution_receipt.schema.yaml"
      ],
      rationale: "Testing a live provider boundary would cross the current no provider/plugin/API/image/runtime/source-read/dependency constraint."
    }
  ];

  return {
    autopilot_false_readiness_negative_cases: {
      version: "v1",
      phase: "autopilot_false_readiness_negative_cases_v1",
      mission: "Improve Autopilot Reliability Against False Readiness Claims",
      selected_task: "add_false_readiness_negative_case_validator",
      selected_task_lane: "Green",
      candidate_gaps: candidateGaps,
      candidate_gap_count: candidateGaps.length,
      negative_cases: negativeCases,
      negative_case_count: negativeCases.length,
      caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
      all_negative_cases_caught: negativeCases.every((item) => item.result === "caught" && item.expected_failure === true),
      validator_strengthened: "Readiness now proves critical malformed semantic reports fail instead of only proving accepted fixtures pass.",
      red_blocked_candidates: candidateGaps.filter((gap) => gap.lane === "Red").map((gap) => gap.gap_id),
      lower_priority_candidates: candidateGaps.filter((gap) => gap.selected === false && gap.lane !== "Red").map((gap) => gap.gap_id),
      side_effect_flags: falseFlags
    }
  };
}

function main() {
  const report = buildNegativeCaseReport();
  const actual = report.autopilot_false_readiness_negative_cases;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildNegativeCaseReport();
  assertDeepEqual(actualAgain, report, "False readiness negative-case deterministic output");
  assertDeepEqual(report, expected, "False readiness negative-case fixture");
  assert(actual.phase === "autopilot_false_readiness_negative_cases_v1", "phase mismatch");
  assert(actual.selected_task === "add_false_readiness_negative_case_validator", "selected task mismatch");
  assert(actual.selected_task_lane === "Green", "selected task must be Green");
  assert(actual.candidate_gap_count >= 3, "at least three concrete candidate gaps are required");
  assert(actual.candidate_gaps.filter((gap) => gap.selected === true).length === 1, "exactly one candidate gap must be selected");
  assert(actual.negative_case_count >= 4, "at least four negative cases are required");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "caught count must equal negative case count");
  assert(actual.red_blocked_candidates.includes("live_provider_cost_boundary"), "Red-blocked candidate must be recorded");
  assertFalseFlags(actual.side_effect_flags);

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    deterministic_output_verified: true,
    fixture_verified: true,
    selected_task: actual.selected_task,
    selected_task_lane: actual.selected_task_lane,
    candidate_gap_count: actual.candidate_gap_count,
    selected_gap: actual.candidate_gaps.find((gap) => gap.selected === true).gap_id,
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
  assertCompleteReadinessSemantics,
  assertEvolutionSemantics,
  assertReconciliationSemantics,
  buildNegativeCaseReport
};
