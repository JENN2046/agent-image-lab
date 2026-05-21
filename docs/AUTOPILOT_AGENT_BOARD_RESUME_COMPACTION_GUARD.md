# Autopilot Agent Board Resume Compaction Guard

Phase: `agent_board_resume_compaction_guard_v1`

This Green Lane hardening step verifies that the compact resume surfaces do not
drift after long validator chains. It remains local-only and does not perform
provider, plugin, API, image, memory, runtime, source-read, dependency, secret,
push, tag, release, or deploy actions.

## Purpose

The previous local chain now proves:

```text
packet preflight
-> receipt
-> registry
-> readiness cross-claim
-> packet-to-receipt traceability
```

This guard makes the handoff surfaces reflect that truth consistently. Its job
is not to create new production authority; its job is to make resuming the
project boring, obvious, and hard to misread.

## Checked Surfaces

`scripts/validate_autopilot_agent_board_resume_compaction_guard.js` checks:

```text
.agent_board/RUN_STATE.md
.agent_board/TASK_QUEUE.md
.agent_board/CHECKPOINT.md
.agent_board/HANDOFF.md
.agent_board/AUTOPILOT_LEDGER.md
docs/00_project_roadmap.md
```

The latest compact section in each surface must cite:

```text
agent_board_resume_compaction_guard_v1
amber_packet_to_receipt_traceability_v1
future_real_provider_cost_boundary_v1
push_status: not_performed or push_allowed: false
no provider/plugin/API/image/memory/source-read/dependency/runtime action
```

## Resulting Boundary

After this guard, the Evolution Engine has no remaining self-authorized local
Green hardening task in this chain. The next recommended item is the Red-gated:

```text
future_real_provider_cost_boundary_v1
```

That boundary is planning/preflight only unless the owner gives exact live
provider target, cost cap, call budget, rollback limitations, and authorization.

## Negative Cases

The validator mutates known-good resume surfaces into known-bad cases. Every bad
case must fail.

Covered cases:

- RUN_STATE latest section loses the current phase
- TASK_QUEUE loses the next Red boundary
- CHECKPOINT loses the completed traceability phase
- HANDOFF loses no-push state
- roadmap current phase drifts
