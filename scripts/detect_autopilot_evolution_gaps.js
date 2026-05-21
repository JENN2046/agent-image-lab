const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const knownInputs = [
  "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  "docs/AUTOPILOT_GOAL_COMPILER_V1.md",
  "docs/AUTOPILOT_GOAL_DECOMPOSITION_RUNTIME.md",
  "docs/AUTOPILOT_NEXT_SAFE_TASK_ORCHESTRATOR.md",
  "docs/AUTOPILOT_AMBER_DRY_RUN_EXECUTION_LOOP.md",
  "scripts/validate_autopilot_governance_kernel.js",
  "scripts/validate_autopilot_goal_compiler.js",
  "scripts/validate_agent_board_queue_reconciliation.js",
  "scripts/validate_next_safe_task_orchestrator.js",
  "scripts/validate_amber_dry_run_execution_loop.js",
  "tests/schema_examples/autopilot_receipt_registry.example.json",
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
    }
  ];

  const proposals = [
    buildProposal({
      proposal_id: "receipt_registry_negative_cases_v1",
      title: "Add negative-case coverage for receipt registry failures",
      lane: "Green",
      detected_gap: "Registry validation currently proves accepted examples; future hardening should also prove missing cost, missing rollback, and over-budget receipts fail locally.",
      proposed_local_task: "Add local invalid receipt fixtures and a validator branch that confirms they are rejected without weakening accepted receipt checks.",
      allowed_write_targets: [
        "scripts/",
        "tests/schema_examples/",
        "docs/",
        ".agent_board/"
      ],
      validation: [
        "node scripts/validate_autopilot_governance_kernel.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Do not create real Amber side effects while testing negative cases."
    }),
    buildProposal({
      proposal_id: "amber_action_packet_preflight_v1",
      title: "Promote Amber action packets into reusable preflight fixtures",
      lane: "Green",
      detected_gap: "The Amber dry-run loop embeds the action packet shape; future real Amber work needs reusable local packet fixtures before any provider/plugin/API/image/memory/source-read/runtime action.",
      proposed_local_task: "Add action-packet schema/example validation and require packet validation before receipt generation.",
      allowed_write_targets: [
        "schemas/",
        "tests/schema_examples/",
        "scripts/",
        "docs/",
        ".agent_board/"
      ],
      validation: [
        "node scripts/validate_amber_action_packet_preflight.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Packet fixtures do not authorize provider calls, runtime probes, source reads, or dependency changes."
    }),
    buildProposal({
      proposal_id: "agent_board_resume_compaction_guard_v1",
      title: "Guard resume surfaces against long-session drift",
      lane: "Green",
      detected_gap: "Long-running sessions can update validators and receipts while resume prose lags behind; a compact resume guard would reduce handoff drift.",
      proposed_local_task: "Add a local validator that checks README, roadmap, RUN_STATE, TASK_QUEUE, CHECKPOINT, HANDOFF, and AUTOPILOT_LEDGER all cite the current phase and next safe task.",
      allowed_write_targets: [
        "scripts/",
        ".agent_board/",
        "README.md",
        "docs/00_project_roadmap.md"
      ],
      validation: [
        "node scripts/validate_agent_board_state.js",
        "node scripts/validate_agent_board_queue_reconciliation.js",
        "powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1"
      ],
      red_boundary: "Do not overwrite unrelated user-owned status notes."
    }),
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
    next_recommended_task: "receipt_registry_negative_cases_v1",
    next_recommended_task_lane: "Green",
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
