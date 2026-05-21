# Autopilot Receipt Registry Negative Cases

Phase: `receipt_registry_negative_cases_v1`

This Green Lane hardening step improves protection against invalid Amber
receipts and registry coverage drift. It is local validation only and does not
perform provider, plugin, API, image, memory, runtime, source-read, dependency,
secret, push, tag, release, or deploy actions.

## Goal Decomposition Result

Mission:

```text
Improve Autopilot protection against invalid Amber receipt, registry coverage,
and readiness proof gaps.
```

Selected next safe task:

```text
add_receipt_registry_negative_case_validator
```

The selected task is Green Lane because it only adds local validation,
fixtures, and status-surface updates. It directly addresses the current highest
risk in the receipt system: positive receipt fixtures were validated, but
malformed registry/receipt cases did not yet have explicit fail-closed proof.

## Candidate Gaps Found

1. `receipt_registry_negative_cases_missing`
   - Evidence: `scripts/validate_autopilot_governance_kernel.js` and
     `tests/schema_examples/autopilot_receipt_registry.example.json`.
   - Risk: compliant receipts pass, but malformed receipt or registry examples
     were not separately proven to fail.
   - Decision: selected now.

2. `receipt_registry_fixture_coverage_drift`
   - Evidence: `tests/schema_examples/autopilot_execution_receipt*.json` and
     `tests/schema_examples/autopilot_receipt_registry.example.json`.
   - Risk: a future receipt example could be added without registry coverage.
   - Decision: handled inside the selected validator by comparing all receipt
     example files against registry paths.

3. `readiness_receipt_registry_cross_claims`
   - Evidence: `scripts/validate_complete_autopilot_readiness_gate.js` and
     `tests/schema_examples/complete_autopilot_readiness_gate.example.json`.
   - Risk: a future readiness proof could mention a receipt id without a
     matching registry entry.
   - Decision: lower priority; queued as a future Green hardening candidate.

4. `real_amber_provider_receipt_preflight`
   - Evidence: receipt and envelope schemas.
   - Risk: future live Amber work needs exact provider target, cost, and
     rollback proof.
   - Decision: Red-blocked in this mission because live external actions are
     forbidden.

## Negative Cases

`scripts/validate_autopilot_receipt_registry_negative_cases.js` builds a
canonical registry report from current local fixtures and mutates known-good
data into known-bad cases. Every bad case must fail.

Covered cases:

- registry entry points to a missing receipt file
- registry `receipt_id` differs from the receipt body
- receipt writes more files than the registry budget allows
- receipt marks cost as unknown
- receipt hides irreversible actions
- receipt flips a provider side-effect flag to true
- receipt uses dependency actions beyond the registry budget

The validator also proves registry coverage by comparing every
`tests/schema_examples/autopilot_execution_receipt*.json` file with the registry
path list.

Checked fixture:

```text
tests/schema_examples/autopilot_receipt_registry_negative_cases.example.json
```

MVP integration:

```text
scripts/validate_mvp.ps1
```

## Evolution Update

After this phase, `receipt_registry_negative_cases_v1` is recorded as a
completed capability in the Evolution Engine. The next recommended local
hardening task advances to:

```text
amber_action_packet_preflight_v1
```
