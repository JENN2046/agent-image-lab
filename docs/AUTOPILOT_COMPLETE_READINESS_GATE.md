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
-> next_safe_task
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
.agent_board reconciliation passes
next_safe_task is selected and executable
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
