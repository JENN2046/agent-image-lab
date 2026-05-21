# Autopilot False Readiness Negative Cases

Phase: `autopilot_false_readiness_negative_cases_v1`

This Green Lane hardening step improves resistance to false readiness claims by
proving that malformed readiness reports fail locally. It does not execute
provider, plugin, API, image, memory, runtime, source-read, dependency, secret,
push, tag, release, or deploy actions.

## Goal Decomposition Result

Mission:

```text
Improve Autopilot Reliability Against False Readiness Claims
```

Selected next safe task:

```text
add_false_readiness_negative_case_validator
```

The selected task is Green Lane because it only adds local fixtures,
documentation, and validation. It strengthens the existing readiness chain by
testing failure cases instead of only testing accepted fixtures.

## Reliability Gaps Found

Codex identified these concrete gaps from current repository files:

1. `positive_only_readiness_semantics`
   - Evidence: `scripts/validate_complete_autopilot_readiness_gate.js`,
     `scripts/reconcile_agent_board_queue.js`,
     `scripts/detect_autopilot_evolution_gaps.js`.
   - Risk: accepted fixtures could pass while a future bad report reintroduces
     ambiguous `selected_next_safe_task`, hides current-boundary drift, or
     treats fixture evidence as current execution.
   - Decision: selected now.

2. `receipt_registry_cost_rollback_negative_cases`
   - Evidence: `scripts/validate_autopilot_governance_kernel.js`,
     `tests/schema_examples/autopilot_receipt_registry.example.json`.
   - Risk: receipt registry validation mostly proves accepted receipts; future
     negative receipt fixtures should prove missing cost, missing rollback, or
     over-budget receipts fail.
   - Decision: lower priority for this task; keep queued as
     `receipt_registry_negative_cases_v1`.

3. `resume_surface_compaction_drift`
   - Evidence: `.agent_board/RUN_STATE.md`, `.agent_board/TASK_QUEUE.md`,
     `.agent_board/CHECKPOINT.md`.
   - Risk: long status surfaces may drift during resume, especially after
     repeated local commits.
   - Decision: lower priority because the current-state reconciler already
     checks the final boundary tokens; negative readiness proof is sharper.

4. `live_provider_cost_boundary`
   - Evidence: `schemas/autopilot_autonomy_envelope.schema.yaml`,
     `schemas/autopilot_execution_receipt.schema.yaml`.
   - Risk: future live provider or image work needs exact cost and call limits.
   - Decision: Red-blocked under this mission because live external actions are
     forbidden.

## Negative Cases

`scripts/validate_autopilot_false_readiness_negative_cases.js` builds canonical
valid outputs from the existing readiness, reconciliation, and evolution
builders. It then mutates copies into invalid reports and requires each mutated
report to fail semantic assertions.

Covered false-readiness classes:

- ambiguous top-level `selected_next_safe_task` reintroduced
- current boundary replaced by historical Green fixture task
- future Amber dry-run falsely reported as current task execution
- current-state drift hidden by `queue_drift_detected: false`
- completed readiness gate reintroduced as future work
- side-effect flag flipped to true

The checked fixture is:

```text
tests/schema_examples/autopilot_false_readiness_negative_cases.example.json
```

The validator is wired into:

```text
scripts/validate_mvp.ps1
```

## Boundary

This phase is local validation hardening only. Push remains blocked until an
explicit owner push authorization and safety gate. Real external actions remain
blocked by the current task constraints and Red Lane rules.
