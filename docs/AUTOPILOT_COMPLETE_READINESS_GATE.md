# Autopilot Complete Readiness Gate v1

base_contract: AGENTS.md
policy_model: Smart Standing Authorization v3 — Budgeted Autonomy Envelope
mode: Green Lane local readiness validation
status: active_local_complete_gate

## Purpose

The Complete Readiness Gate proves that the product-grade autopilot chain is
locally coherent before final closeout:

```text
user goal
-> goal
-> route_plan
-> task_queue
-> materialized snapshot
-> reconciled .agent_board
-> fixture next_safe_task evidence
-> current final boundary
-> Amber dry-run receipt
-> receipt registry
-> validation checkpoint
-> evolution backlog
```

This gate does not execute external work. It is a local validator over existing
fixtures, receipts, status surfaces, and governance scripts.

## Required Invariants

```text
goal / route_plan / task_queue links are consistent
materialized snapshot is deterministic
.agent_board current-state reconciliation passes
fixture next_safe_task evidence is labeled historical/test fixture evidence
current final boundary is owner_push_safety_gate_after_review
current final boundary type is a Red push-safety-gate boundary
Red items remain blocked
Amber dry-run receipt validates and is registered without pretending to execute the current next_safe_task when ids differ
final local closeout checkpoint, run state, task queue, handoff, and no-push boundary exist
evolution backlog advances beyond the completed readiness gate
push, deploy, secret read, provider calls, runtime probes, source reads, and dependency actions remain false
```

## Validator

`scripts/validate_complete_autopilot_readiness_gate.js` builds the complete local
readiness report and compares it to:

```text
tests/schema_examples/complete_autopilot_readiness_gate.example.json
```

The readiness result after final closeout is
`passed_local_full_autopilot_ready_no_push`. This still does not authorize push;
push remains a Red Lane action requiring a separate push safety gate and owner
authorization.

The readiness gate is now complemented by
`scripts/validate_autopilot_readiness_receipt_registry_cross_claims.js`, which
proves the gate's Amber receipt claim maps to a concrete registry entry and a
schema-valid receipt fixture.

It is also complemented by
`scripts/validate_autopilot_amber_packet_to_receipt_traceability.js`, which
proves the mapped Amber receipt's task, write, validation, rollback, cost,
registry, and guard evidence trace to a preflight packet.

The final local resume surface is guarded by
`scripts/validate_autopilot_agent_board_resume_compaction_guard.js`, which keeps
the compact handoff surfaces aligned on the current phase, completed
traceability bridge, no-push state, and next Red boundary.

Current-boundary cleanup: the old fixture task
`add_goal_decomposition_runtime_validation` may remain as historical test
evidence, but the current final boundary is
`owner_push_safety_gate_after_review`. No executable local task remains required
before the push safety gate unless a validator fails.
