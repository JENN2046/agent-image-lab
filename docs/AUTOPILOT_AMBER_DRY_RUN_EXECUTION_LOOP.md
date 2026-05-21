# Autopilot Amber Dry-Run Execution Loop v1

This Green Lane local fixture proves the Amber workflow without real external
side effects:

```text
envelope -> action packet -> dry-run action -> execution receipt -> registry -> validation -> continuation decision
```

The action packet shape is now also validated as a standalone preflight fixture
by `scripts/validate_autopilot_amber_action_packet_preflight.js`. Future real
Amber work must pass that preflight before receipt generation or real action.

The dry-run envelope has zero provider/plugin/API/image/runtime calls, zero
dependency actions, zero external reads, known zero cost, structured rollback,
and all Red Lane gates still closed.

Semantic scope: this loop validates a future budgeted Amber task fixture. It
records `selected_current_next_safe_task_id`, `amber_dry_run_task_id`,
`amber_dry_run_matches_current_next_safe_task`, and the readiness claim
`future_amber_loop_fixture_validated_not_current_task_execution` when the Amber
fixture is not the current next safe task. A passing dry-run receipt must not be
reported as execution of the current next safe task unless the task ids match.

This document and its validator do not authorize provider contact, plugin calls,
API calls, image generation, memory writes, real source reads, runtime probes,
dependency changes, push, tag, release, or deploy.
