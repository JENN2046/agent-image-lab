# Autopilot Readiness Receipt Registry Cross Claims

Phase: `readiness_receipt_registry_cross_claims_v1`

This Green Lane hardening step binds the complete readiness gate to the receipt
registry with an explicit local validator. It remains fixture-only and does not
perform provider, plugin, API, image, memory, runtime, source-read,
dependency, secret, push, tag, release, or deploy actions.

## Goal Decomposition Result

Mission:

```text
Prove that the readiness gate's Amber receipt claims map to a registry entry
and a schema-valid receipt fixture.
```

Selected next safe task:

```text
add_readiness_receipt_registry_cross_claim_validator
```

The selected task is Green Lane because it adds only local validation, a
checked fixture, status-surface updates, and documentation. It closes the
bridge between two already validated surfaces:

1. the complete readiness gate's claim that the Amber dry-run receipt is
   registered
2. the receipt registry's concrete entry and receipt fixture

## Candidate Gaps Found

1. `readiness_receipt_registry_cross_claims`
   - Evidence: `scripts/validate_complete_autopilot_readiness_gate.js`,
     `tests/schema_examples/complete_autopilot_readiness_gate.example.json`,
     and `tests/schema_examples/autopilot_receipt_registry.example.json`.
   - Risk: readiness could cite a receipt id that no longer maps to a real
     registry entry or valid receipt fixture.
   - Decision: selected now.

2. `amber_packet_to_receipt_traceability`
   - Evidence: `scripts/validate_autopilot_amber_action_packet_preflight.js`
     and `scripts/validate_amber_dry_run_execution_loop.js`.
   - Risk: packet safety and receipt safety are both validated, but direct
     field-level traceability between the two is still a future bridge.
   - Decision: next Green candidate after this phase.

3. `agent_board_resume_compaction_guard`
   - Evidence: `.agent_board` resume surfaces.
   - Risk: long validator chains can still drift in prose status surfaces.
   - Decision: lower priority and still local.

4. `future_real_provider_cost_boundary`
   - Evidence: receipt and envelope schemas.
   - Risk: live provider cost boundaries still need exact preflight controls.
   - Decision: Red-blocked because this mission is local validation only.

## Cross-Claim Invariants

`scripts/validate_autopilot_readiness_receipt_registry_cross_claims.js`
verifies that:

```text
complete readiness still passes as local no-push evidence
the readiness gate's Amber receipt id maps to a registry entry
the mapped registry entry points to a real receipt fixture
receipt_id / task_id / envelope_id agree across readiness, registry, and receipt
the receipt remains schema-valid through the existing registry validator path
the receipt keeps the future-fixture-only readiness claim
the receipt keeps the fixture selected_current_next_safe_task binding
the evolution backlog advances beyond this now-completed bridge
```

Checked fixture:

```text
tests/schema_examples/autopilot_readiness_receipt_registry_cross_claims.example.json
```

MVP integration:

```text
scripts/validate_mvp.ps1
```

## Negative Cases

The validator mutates known-good readiness/registry/receipt data into known-bad
cases. Every bad case must fail.

Covered cases:

- readiness receipt id no longer exists in the registry
- readiness task id no longer matches the mapped registry entry
- readiness envelope id no longer matches the mapped registry entry
- readiness registry count drifts from the real registry size
- receipt readiness claim overreaches current task execution
- receipt selected current next safe task no longer matches readiness fixture
- registry link is removed entirely

## Evolution Update

After this phase, `readiness_receipt_registry_cross_claims_v1` moves from a
future proposal into `completed_capabilities` inside the Evolution Engine. The
next recommended local hardening task advances to:

```text
amber_packet_to_receipt_traceability_v1
```
