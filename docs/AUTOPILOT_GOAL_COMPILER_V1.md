# Autopilot Goal Compiler v1

base_contract: AGENTS.md
policy_model: Smart Standing Authorization v3 — Budgeted Autonomy Envelope
status: active_local_goal_compiler_baseline
mode: Green Lane local implementation
startup_default_model: Smart Standing Authorization v3
a4_8_status: retained_as_green_lane_substrate

## Purpose

Autopilot Goal Compiler v1 turns a user goal into a machine-checkable local
route plan and near-term task queue. It is the planning layer that sits before
Amber execution receipts: Codex must understand the goal, inspect current truth,
choose a route, assign Green / Amber / Red lanes, and create a bounded queue
before continuing.

Authority rule: v3 is the active startup and autonomy model. A4.8 only supplies
Green Lane local-safe behavior.

Runtime rule: Goal Compiler is not only a schema layer. For any non-single-step
goal, Codex must compile `goal -> route_plan -> executable task_queue ->
blocked_red_items -> next_safe_task`, execute only `next_safe_task`, validate,
update `.agent_board`, record a receipt if Amber, and continue until done,
blocked, or a Red condition appears.

This document does not authorize provider contact, plugin calls, API calls,
image generation, DailyNote writes, VCP memory writes, real manifest reads, real
VCPChat reads, real VCPToolBox reads, dependency changes, runtime probes, push,
tag, release, deploy, destructive action, or secret access.

## Goal Compiler

The Goal Compiler converts a user objective into a bounded goal object:

```text
goal_id
objective
requester_intent
scope
non_goals
allowed_lanes
forbidden_actions
success_criteria
validation_expectations
stop_conditions
```

The compiler must preserve the user's intent without silently widening it into
remote, runtime, provider, memory, dependency, source-read, or destructive work.

## Current Truth Intake

Current Truth Intake gathers repository facts before route selection:

```text
branch
head
origin_state
worktree_state
policy_model
available_validators
current_status_surfaces
known_open_tasks
red_lane_boundaries
```

Repository reality and observed command output outrank stale handoffs, roadmap
entries, memory, or historical records.

## Route Option Analysis

Route Option Analysis enumerates plausible paths and classifies each one:

```text
route_id
lane
objective
allowed_actions
forbidden_actions
validation_path
expected_receipts
risk_summary
status
```

The analysis must include rejected Red routes when they are tempting but not
authorized, such as push, release, provider generation, memory write, or broad
external repository modification.

## Route Selection

Route Selection chooses one route that is:

```text
inside the current user goal
inside the allowed files and actions
validated by existing or newly allowed local checks
not blocked by Red Lane conditions
small enough to checkpoint and resume
```

Rejected routes remain evidence. They must not become executable tasks.

## Near-term Task Queue

The selected route is compiled into a near-term task queue. Each task records:

```text
task_id
objective
lane
allowed_files
forbidden_files
allowed_actions
forbidden_actions
envelope_ref
validation_required
commit_allowed
push_allowed
stop_conditions
receipt_required
```

The queue should be short enough to act on, but complete enough for another
agent to resume without guessing.

## Lane Assignment

Green Lane tasks are local, reversible, non-external, non-secret-bearing,
non-dependency-changing, and validated by local checks.

Amber Lane tasks are allowed to continue inside an autonomy envelope when they
have exact scope, budget, validation, stop conditions, and receipts.

Red Lane routes require the user before execution. They include:

```text
git push
tag
release
deploy
force push
history rewrite
destructive Git/filesystem action
secret value read or edit
raw private data / raw chat history exposure
external repository broad modification
uncapped cost
unbounded loops
overwriting existing artifacts without explicit overwrite allowance
wide VCPChat / VCPToolBox write without exact scope
dependency changes without exact package/action list
validation failure requiring non-obvious judgment
```

## Envelope Assignment For Amber Tasks

Every Amber task in the queue must reference a non-empty `envelope_ref` and set
`receipt_required=true`. The envelope must declare budgets, target systems,
allowed and forbidden objects, validation requirements, rollback or cleanup
plan, and stop conditions before execution.

## Validation Plan

Goal Compiler v1 is validated by:

```text
schemas/autopilot_goal.schema.yaml
schemas/autopilot_route_plan.schema.yaml
schemas/autopilot_task_queue.schema.yaml
tests/schema_examples/autopilot_goal.example.json
tests/schema_examples/autopilot_route_plan.example.json
tests/schema_examples/autopilot_task_queue.example.json
scripts/validate_autopilot_goal_compiler.js
```

The validator must prove schema field presence, example parseability, ID
linkage, legal lanes, Amber receipt and envelope requirements, Red route
exclusion from executable tasks, default push blocking, and no current
provider/plugin/API/image/memory/source-read/dependency/runtime execution
signals.

## Continuation Policy

Codex may continue through Green tasks and budgeted Amber tasks when:

```text
the current goal is clear
the selected route is still valid
each task has a validation path
the task stays inside its lane and envelope
no Red condition appears
status surfaces stay synchronized
```

Validation failure allows at most one obvious, safe, local repair or retry.
Non-obvious judgment failures stop.

## Stop Conditions

Stop before execution when any of these appear:

```text
worktree is dirty with unrelated or user-owned changes
branch is behind origin
allowed files or actions are ambiguous
secret value access would be required
provider/plugin/API/image/memory/source-read/dependency/runtime action is needed without a valid envelope
push/tag/release/deploy is requested without explicit remote authorization
destructive Git/filesystem action is required
validation failure requires design judgment
```

## Handoff / Resume Surface Update Rule

When Goal Compiler v1 changes README, roadmap, validators, schema refs, or task
queue refs, Codex must update `.agent_board/HANDOFF.md`,
`.agent_board/RUN_STATE.md`, `.agent_board/TASK_QUEUE.md`, and
`.agent_board/CHECKPOINT.md`. Decision-level policy additions must also update
`.agent_board/DECISIONS.md`.
