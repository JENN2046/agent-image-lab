const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const knownInputs = [
  "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  "docs/AUTOPILOT_GOAL_COMPILER_V1.md",
  "docs/AUTOPILOT_GOAL_DECOMPOSITION_RUNTIME.md",
  "docs/AUTOPILOT_NEXT_SAFE_TASK_ORCHESTRATOR.md",
  "docs/AUTOPILOT_AMBER_DRY_RUN_EXECUTION_LOOP.md",
  "docs/AUTOPILOT_AMBER_ACTION_PACKET_PREFLIGHT.md",
  "docs/AUTOPILOT_READINESS_RECEIPT_REGISTRY_CROSS_CLAIMS.md",
  "docs/AUTOPILOT_AMBER_PACKET_TO_RECEIPT_TRACEABILITY.md",
  "docs/AUTOPILOT_AGENT_BOARD_RESUME_COMPACTION_GUARD.md",
  "scripts/validate_autopilot_governance_kernel.js",
  "scripts/validate_autopilot_goal_compiler.js",
  "scripts/validate_agent_board_queue_reconciliation.js",
  "scripts/validate_next_safe_task_orchestrator.js",
  "scripts/validate_amber_dry_run_execution_loop.js",
  "scripts/validate_autopilot_amber_action_packet_preflight.js",
  "scripts/validate_autopilot_readiness_receipt_registry_cross_claims.js",
  "scripts/validate_autopilot_amber_packet_to_receipt_traceability.js",
  "scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
  "schemas/autopilot_amber_action_packet.schema.yaml",
  "tests/schema_examples/autopilot_amber_action_packet.example.json",
  "tests/schema_examples/autopilot_amber_action_packet_negative_cases.example.json",
  "tests/schema_examples/autopilot_receipt_registry.example.json",
  "tests/schema_examples/autopilot_readiness_receipt_registry_cross_claims.example.json",
  "tests/schema_examples/autopilot_amber_packet_to_receipt_traceability.example.json",
  "tests/schema_examples/autopilot_agent_board_resume_compaction_guard.example.json",
  "tests/schema_examples/amber_dry_run_execution_loop.example.json",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/AUTOPILOT_LEDGER.md"
];

const sideEffectFlags = {
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

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function buildProposal({
  proposal_id,
  title,
  lane,
  detected_gap,
  proposed_local_task,
  allowed_write_targets,
  validation,
  red_boundary,
  required_authorization_or_action = null
}) {
  return {
    proposal_id,
    title,
    lane,
    detected_gap,
    proposed_local_task,
    allowed_write_targets,
    validation,
    red_boundary,
    self_authorized: lane !== "Red",
    required_authorization_or_action
  };
}

function detectAutopilotEvolutionGaps() {
  const receiptRegistry = readJson("tests/schema_examples/autopilot_receipt_registry.example.json").autopilot_receipt_registry;
  const inputPresence = Object.fromEntries(knownInputs.map((input) => [input, exists(input)]));
  const missingInputs = Object.entries(inputPresence)
    .filter(([, present]) => !present)
    .map(([input]) => input);

  const completedCapabilities = [
    {
      capability_id: "complete_autopilot_readiness_gate_v1",
      proposal_id: "complete_autopilot_readiness_gate_v1",
      title: "Prove the complete autopilot chain in one readiness gate",
      lane: "Green",
      status: "completed_current_evidence",
      evidence: "Final local gate proves goal -> route -> queue -> materializer -> reconciler -> fixture next-safe evidence -> Amber dry-run receipt -> registry -> checkpoint -> evolution backlog.",
      validation: [
        "node scripts/validate_complete_autopilot_readiness_gate.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Do not push, deploy, read secrets, call providers, or touch real runtime/source systems."
    },
    {
      capability_id: "receipt_registry_negative_cases_v1",
      proposal_id: "receipt_registry_negative_cases_v1",
      title: "Add negative-case coverage for receipt registry failures",
      lane: "Green",
      status: "completed_current_evidence",
      evidence: "Receipt registry negative-case validation proves malformed receipt/registry examples fail, including missing files, id mismatch, over-budget writes, unknown cost, irreversible actions, dependency actions, and side-effect flags.",
      validation: [
        "node scripts/validate_autopilot_receipt_registry_negative_cases.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Do not create real Amber side effects while testing negative cases."
    },
    {
      capability_id: "amber_action_packet_preflight_v1",
      proposal_id: "amber_action_packet_preflight_v1",
      title: "Promote Amber action packets into reusable preflight fixtures",
      lane: "Green",
      status: "completed_current_evidence",
      evidence: "Amber action packet preflight validation proves future Amber packets fail closed when identity, target, budget, cost, rollback, validation, receipt, registry, continuation, or side-effect boundaries are missing.",
      validation: [
        "node scripts/validate_autopilot_amber_action_packet_preflight.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Packet fixtures do not authorize provider calls, runtime probes, source reads, dependency changes, or live external actions."
    },
    {
      capability_id: "readiness_receipt_registry_cross_claims_v1",
      proposal_id: "readiness_receipt_registry_cross_claims_v1",
      title: "Cross-check readiness claims against receipt registry coverage",
      lane: "Green",
      status: "completed_current_evidence",
      evidence: "Readiness cross-claim validation proves the complete readiness gate's Amber receipt claim maps to a registry entry and a schema-valid receipt fixture without overclaiming current task execution.",
      validation: [
        "node scripts/validate_autopilot_readiness_receipt_registry_cross_claims.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Cross-claim validation stays local and must not execute provider, runtime, source-read, dependency, or remote actions."
    },
    {
      capability_id: "amber_packet_to_receipt_traceability_v1",
      proposal_id: "amber_packet_to_receipt_traceability_v1",
      title: "Cross-check Amber packet fields against receipt fields",
      lane: "Green",
      status: "completed_current_evidence",
      evidence: "Amber packet-to-receipt traceability validation proves receipt task, write, validation, rollback, cost, registry, and guard evidence trace to a preflight packet.",
      validation: [
        "node scripts/validate_autopilot_amber_packet_to_receipt_traceability.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Traceability validation remains fixture-only and must not execute provider, runtime, source-read, dependency, or remote actions."
    },
    {
      capability_id: "agent_board_resume_compaction_guard_v1",
      proposal_id: "agent_board_resume_compaction_guard_v1",
      title: "Guard resume surfaces against long-session drift",
      lane: "Green",
      status: "completed_current_evidence",
      evidence: "Agent board resume compaction validation proves RUN_STATE, TASK_QUEUE, CHECKPOINT, HANDOFF, ledger, and roadmap cite the current phase, completed traceability bridge, no-push state, and the next Red boundary.",
      validation: [
        "node scripts/validate_autopilot_agent_board_resume_compaction_guard.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Resume compaction validation remains local and must not overwrite unrelated status notes or perform remote, runtime, source-read, dependency, provider, or secret actions."
    }
  ];

  const proposals = [
    buildProposal({
      proposal_id: "future_real_provider_cost_boundary_v1",
      title: "Design a Red-gated real provider cost boundary before live calls",
      lane: "Red",
      detected_gap: "Future real provider/plugin/API/image work will need exact cost and provider target confirmation before crossing from dry-run to live Amber.",
      proposed_local_task: "Draft a preflight plan only; do not execute provider/plugin/API/image calls.",
      allowed_write_targets: [
        "docs/",
        ".agent_board/"
      ],
      validation: [
        "documented_human_authorization_required"
      ],
      red_boundary: "Any live provider/plugin/API/image call remains blocked until a valid envelope and exact owner authorization or standing envelope budget applies without Red conditions.",
      required_authorization_or_action: "Human review of exact provider target, call budget, cost cap, and rollback limitations."
    })
  ];

  return {
    version: "v1",
    phase: "autopilot_evolution_engine_v1",
    source_inputs: knownInputs,
    all_source_inputs_present: missingInputs.length === 0,
    missing_source_inputs: missingInputs,
    receipt_registry_count: receiptRegistry.receipts.length,
    completed_capabilities: completedCapabilities,
    detected_gap_count: proposals.length,
    proposals,
    next_recommended_task: "future_real_provider_cost_boundary_v1",
    next_recommended_task_lane: "Red",
    local_write_targets_only: true,
    red_lane_self_authorized: proposals.some((proposal) => proposal.lane === "Red" && proposal.self_authorized),
    side_effect_flags: sideEffectFlags
  };
}

function main() {
  process.stdout.write(`${JSON.stringify({ autopilot_evolution_backlog: detectAutopilotEvolutionGaps() }, null, 2)}\n`);
}

if (require.main === module) {
  main();
}

module.exports = {
  detectAutopilotEvolutionGaps,
  knownInputs
};
