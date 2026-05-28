const fs = require("node:fs");
const path = require("node:path");
const { detectAutopilotEvolutionGaps } = require("../../detect_autopilot_evolution_gaps.js");

const root = path.resolve(__dirname, "../../..");
const fixturePath = "tests/schema_examples/autopilot_evolution_backlog.example.json";

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
  assert(flags && typeof flags === "object", "side_effect_flags are required");
  for (const [key, value] of Object.entries(flags)) {
    assert(value === false, `${key} must be false`);
  }
}

function main() {
  const actual = detectAutopilotEvolutionGaps();
  const expected = readJson(fixturePath).autopilot_evolution_backlog;
  const actualAgain = detectAutopilotEvolutionGaps();

  assertDeepEqual(actualAgain, actual, "Evolution Engine deterministic output");
  assertDeepEqual(actual, expected, "Evolution Engine fixture");
  assert(actual.phase === "autopilot_evolution_engine_v1", "phase mismatch");
  assert(actual.all_source_inputs_present === true, "all known local inputs must exist");
  assert(actual.detected_gap_count >= 1, "expected at least one remaining evolution proposal or boundary");
  assert(actual.detected_gap_count === actual.proposals.length, "detected_gap_count must count only future proposals/gaps");
  assert(actual.receipt_registry_count >= 4, "receipt registry should include existing Amber receipts");
  assert(Array.isArray(actual.completed_capabilities), "completed_capabilities must be present");
  assert(actual.completed_capabilities.some((capability) => capability.capability_id === "complete_autopilot_readiness_gate_v1"), "completed readiness gate must be recorded as completed capability evidence");
  assert(actual.completed_capabilities.some((capability) => capability.capability_id === "receipt_registry_negative_cases_v1"), "receipt registry negative cases must be recorded as completed capability evidence");
  assert(actual.completed_capabilities.some((capability) => capability.capability_id === "amber_action_packet_preflight_v1"), "Amber action packet preflight must be recorded as completed capability evidence");
  assert(actual.completed_capabilities.some((capability) => capability.capability_id === "readiness_receipt_registry_cross_claims_v1"), "readiness receipt registry cross claims must be recorded as completed capability evidence");
  assert(actual.completed_capabilities.some((capability) => capability.capability_id === "amber_packet_to_receipt_traceability_v1"), "Amber packet-to-receipt traceability must be recorded as completed capability evidence");
  assert(actual.completed_capabilities.some((capability) => capability.capability_id === "agent_board_resume_compaction_guard_v1"), "Agent board resume compaction guard must be recorded as completed capability evidence");
  assert(actual.proposals.every((proposal) => proposal.proposal_id !== "complete_autopilot_readiness_gate_v1"), "future proposals must not include completed readiness gate");
  assert(actual.proposals.every((proposal) => proposal.proposal_id !== "receipt_registry_negative_cases_v1"), "future proposals must not include completed receipt registry negative cases");
  assert(actual.proposals.every((proposal) => proposal.proposal_id !== "amber_action_packet_preflight_v1"), "future proposals must not include completed Amber action packet preflight");
  assert(actual.proposals.every((proposal) => proposal.proposal_id !== "readiness_receipt_registry_cross_claims_v1"), "future proposals must not include completed readiness receipt registry cross claims");
  assert(actual.proposals.every((proposal) => proposal.proposal_id !== "amber_packet_to_receipt_traceability_v1"), "future proposals must not include completed Amber packet-to-receipt traceability");
  assert(actual.proposals.every((proposal) => proposal.proposal_id !== "agent_board_resume_compaction_guard_v1"), "future proposals must not include completed agent board resume compaction guard");
  assert(actual.next_recommended_task !== "complete_autopilot_readiness_gate_v1", "next task must advance beyond completed readiness gate");
  assert(actual.next_recommended_task !== "receipt_registry_negative_cases_v1", "next task must advance beyond completed receipt registry negative cases");
  assert(actual.next_recommended_task !== "amber_action_packet_preflight_v1", "next task must advance beyond completed Amber action packet preflight");
  assert(actual.next_recommended_task !== "readiness_receipt_registry_cross_claims_v1", "next task must advance beyond completed readiness receipt registry cross claims");
  assert(actual.next_recommended_task !== "amber_packet_to_receipt_traceability_v1", "next task must advance beyond completed Amber packet-to-receipt traceability");
  assert(actual.next_recommended_task !== "agent_board_resume_compaction_guard_v1", "next task must advance beyond completed agent board resume compaction guard");
  assert(!actual.completed_capabilities.some((capability) => capability.capability_id === actual.next_recommended_task), "next recommended task must not already be completed");
  const nextProposal = actual.proposals.find((proposal) => proposal.proposal_id === actual.next_recommended_task);
  assert(nextProposal, "next recommended task must reference an existing proposal");
  assert(
    ["Green", "Amber"].includes(nextProposal.lane) || (nextProposal.lane === "Red" && nextProposal.required_authorization_or_action),
    "next recommended task must be Green/Amber-safe local hardening or an explicitly gated Red boundary"
  );
  assert(actual.local_write_targets_only === true, "evolution proposals must write only local targets");
  assert(actual.red_lane_self_authorized === false, "Red proposals must not be self-authorized");
  assert(actual.proposals.some((proposal) => proposal.lane === "Red" && proposal.required_authorization_or_action), "Red proposal must require explicit authorization/action");
  assert(actual.proposals.every((proposal) => proposal.proposal_id && proposal.detected_gap && proposal.proposed_local_task && proposal.red_boundary), "each proposal requires core fields");
  assertFalseFlags(actual.side_effect_flags);

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: "autopilot_evolution_engine_v1",
    deterministic_output_verified: true,
    fixture_verified: true,
    detected_gap_count: actual.detected_gap_count,
    proposal_count: actual.proposals.length,
    completed_capabilities: actual.completed_capabilities.map((capability) => capability.capability_id),
    next_recommended_task: actual.next_recommended_task,
    next_recommended_task_lane: actual.next_recommended_task_lane,
    receipt_registry_count: actual.receipt_registry_count,
    local_write_targets_only: actual.local_write_targets_only,
    red_lane_self_authorized: actual.red_lane_self_authorized,
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
