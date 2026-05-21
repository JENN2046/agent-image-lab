# Autopilot Goal Decomposition Runtime v1

base_contract: AGENTS.md
policy_model: Smart Standing Authorization v3 — Budgeted Autonomy Envelope
status: active_local_runtime_contract
mode: Green Lane local governance/runtime hardening

## Purpose

Goal Compiler v1 is not only a schema surface. For any non-single-step user
goal, Codex must compile the goal into a checked runtime chain before executing
work.

This document does not authorize provider contact, plugin calls, API calls,
image generation, DailyNote writes, VCP memory writes, real manifest reads,
real VCPChat reads, real VCPToolBox reads, dependency changes, runtime probes,
push, tag, release, deploy, destructive actions, or secret access.

## Runtime Rule

For any non-single-step goal, Codex must run this sequence:

```text
read current project reality and .agent_board
compile user objective into goal
generate route_plan
classify each route step as Green / Amber / Red
put only Green and envelope-valid Amber tasks into executable task_queue
put Red steps into blocked_red_items
select next_safe_task
execute only next_safe_task
validate
update .agent_board
record receipt if Amber
continue until done, blocked, or Red condition appears
```

## Required Runtime Objects

```text
goal
route_plan
task_queue
blocked_red_items
next_safe_task
guard
```

`goal.goal_id`, `route_plan.source_goal_id`, and
`task_queue.source_route_plan_id` must link consistently.

## Route Step Rules

Each route step must include:

```text
step_id
objective
lane
status
validation_required or validation_skip_reason
stop_conditions
```

Red route steps must be recorded in `blocked_red_items`. Red route steps must
not appear in the executable `task_queue`.

## Task Queue Rules

Executable tasks may be Green or envelope-valid Amber only.

```text
Green task:
  receipt_required: false
  envelope_ref: null

Amber task:
  receipt_required: true
  envelope_ref: non-empty
  budget_checked: true
  registry_or_receipt_path present when meaningful action occurs

Red task:
  not allowed in executable task_queue
```

Task statuses are limited to:

```text
todo
in_progress
done
blocked
skipped
```

At most one executable task may be `in_progress`.

## Next Safe Task

`next_safe_task` must exist while executable tasks remain. It must reference a
task in the executable queue and must be either Green or a budget-checked Amber
task with receipt requirements.

If no safe executable task remains, `next_safe_task` must be null and the
runtime must explain the stop reason.

## Blocked Red Items

Each blocked Red item must include:

```text
item_id
source_step_id
lane: Red
blocked_action
reason
required_authorization_or_action
```

Red items are not failures. They are evidence that the runtime preserved the
hard stop and kept the executable queue safe.

## Validation Surface

The runtime is validated by:

```text
scripts/materialize_autopilot_goal_decomposition.js
tests/schema_examples/autopilot_goal_decomposition_runtime.example.json
tests/schema_examples/autopilot_goal_decomposition_materialized.example.json
scripts/validate_autopilot_goal_compiler.js
scripts/validate_mvp.ps1
```

The materializer is a local dry-run normalizer, not a real executor. It reads
the runtime example, verifies the required objects, and emits a deterministic
materialized snapshot containing `goal_id`, `current_goal`, `route_steps`,
`executable_tasks`, `blocked_red_items`, `next_safe_task`,
`validation_required`, `receipt_required_tasks`, `red_lane_summary`, and
`side_effect_flags`. It must not execute tasks or contact external systems.

The queue reconciler is also local validation only. `scripts/reconcile_agent_board_queue.js`
reads the materialized snapshot and `.agent_board` status surfaces, then emits a
deterministic reconciliation report for goal id, executable queue, blocked Red
items, next safe task, run state, checkpoint, and no-push boundary alignment. It
is not a real executor and must not rewrite production files, execute tasks, or
contact external systems.

The validator must prove that the runtime example has no provider/plugin/API,
image, memory, source-read, runtime, dependency, secret, push, tag, release, or
deploy side-effect signals.
