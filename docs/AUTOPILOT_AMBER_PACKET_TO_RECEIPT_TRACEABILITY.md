# Autopilot Amber Packet To Receipt Traceability

Phase: `amber_packet_to_receipt_traceability_v1`

This Green Lane hardening step binds a preflighted Amber action packet to the
execution receipt that claims the action happened. It remains fixture-only and
does not perform provider, plugin, API, image, memory, runtime, source-read,
dependency, secret, push, tag, release, or deploy actions.

## Goal Decomposition Result

Mission:

```text
Prove that Amber receipt identity, write scope, validation, rollback, cost,
registry, and guard evidence all trace to a preflight packet.
```

Selected next safe task:

```text
add_amber_packet_to_receipt_traceability_validator
```

The selected task is Green Lane because it adds only local validation, a
checked fixture, status-surface updates, and documentation. It closes the bridge
between:

1. `tests/schema_examples/autopilot_amber_action_packet.example.json`
2. `tests/schema_examples/autopilot_execution_receipt.amber_dry_run_loop.example.json`
3. `tests/schema_examples/autopilot_receipt_registry.example.json`

## Traceability Invariants

`scripts/validate_autopilot_amber_packet_to_receipt_traceability.js` verifies
that:

```text
packet task_id matches receipt task_id and amber_dry_run_task_id
packet and receipt both remain Amber Lane
receipt target_systems trace to packet target_systems
receipt calls_used stay within packet max_call_count
receipt files_written are covered by packet exact_allowed_paths_or_objects
registry max_write_files traces to packet max_write_count
receipt validation_run traces to packet validation_required
receipt rollback plan traces to packet rollback plan
receipt cost accounting stays inside packet cost cap
receipt registry entry points back to the same receipt and packet task
packet and receipt side-effect guards remain false
```

Checked fixture:

```text
tests/schema_examples/autopilot_amber_packet_to_receipt_traceability.example.json
```

MVP integration:

```text
scripts/validate_mvp.ps1
```

## Boundary Fix

This phase also corrects the Amber dry-run packet write allowlist. The packet
now explicitly includes the dry-run documentation and simulator file already
listed by the receipt's `files_written` evidence:

```text
docs/AUTOPILOT_AMBER_DRY_RUN_EXECUTION_LOOP.md
scripts/simulate_amber_dry_run_execution_loop.js
```

The local write budget for that packet and registry entry is therefore `7`,
which covers the five receipt writes plus the registry and ledger recording
surfaces declared by the packet.

## Negative Cases

The validator mutates known-good packet/receipt/registry data into known-bad
cases. Every bad case must fail.

Covered cases:

- receipt task id was not preflighted by the packet
- registry write budget no longer traces to packet max write count
- receipt writes a file outside the packet allowlist
- receipt validation command was not required by the packet
- receipt cost exceeds the packet cap
- receipt rollback plan drifts from the packet rollback plan
- packet secret boundary is weakened
- receipt side-effect guard becomes true

## Evolution Update

After this phase, `amber_packet_to_receipt_traceability_v1` moves from a future
proposal into `completed_capabilities` inside the Evolution Engine. The next
recommended local hardening task advances to:

```text
agent_board_resume_compaction_guard_v1
```
