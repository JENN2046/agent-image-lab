# Autopilot Next Safe Task Orchestrator v1

This is a Green Lane local validation component for Smart Standing Authorization
v3. It selects the next safe executable task from the deterministic Goal
Decomposition materialized snapshot.

The orchestrator must:

- read the materialized snapshot
- keep Red Lane items blocked
- select only Green tasks or valid budgeted Amber tasks
- require Amber tasks to have an envelope, budget check, receipt requirement,
  validation path, and stop conditions
- emit a deterministic local report
- preview state advancement without writing real production state
- leave all provider/plugin/API/image/memory/source-read/runtime/dependency,
  secret, push, tag, release, and deploy flags false

It is not a real executor. It does not execute tasks, contact external systems,
write memory, run runtime probes, or authorize remote actions.

Validator:

```text
scripts/validate_next_safe_task_orchestrator.js
```

Fixture:

```text
tests/schema_examples/next_safe_task_orchestration.example.json
```
