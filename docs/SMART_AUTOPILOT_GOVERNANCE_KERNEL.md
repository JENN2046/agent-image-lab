# Smart Autopilot Governance Kernel

base_contract: AGENTS.md
policy_model: Smart Standing Authorization v3 — Budgeted Autonomy Envelope
status: active_local_validation_kernel
mode: Green Lane local implementation
startup_default_model: Smart Standing Authorization v3
a4_8_status: retained_as_green_lane_substrate

## Purpose

This kernel makes the Smart Standing Authorization v3 policy machine-checkable
before any real Amber action is attempted. It defines the local governance
objects that must exist around autonomy: the envelope, the receipt, and the
continuation decision.

Authority rule: v3 is the active startup and autonomy model. A4.8 only supplies
Green Lane local-safe behavior.

This document does not authorize provider contact, plugin calls, API calls,
image generation, DailyNote writes, VCP memory writes, real manifest reads,
real VCPChat reads, real VCPToolBox reads, dependency changes, runtime probes,
push, tag, release, deploy, or secret access.

## Kernel Components

### Goal Compiler

Turns the current user goal into a bounded task shape:

```text
task_id
goal
intent
lane
target_systems
validation_required
stop_conditions
```

The Goal Compiler must keep the smallest useful scope and must not convert vague
continuation words into Red Lane permission.

For any non-single-step goal, Goal Compiler must operate as a runtime flow, not
only a schema example:

```text
goal -> route_plan -> executable task_queue -> blocked_red_items -> next_safe_task
```

Codex may execute only `next_safe_task`. It must validate, update `.agent_board`,
record a receipt if the task is Amber, and continue until done, blocked, or a
Red condition appears.

`scripts/materialize_autopilot_goal_decomposition.js` provides the local dry-run
materializer for that runtime flow. It normalizes the runtime example into a
deterministic snapshot for validation. It is not a real executor and must not
perform provider/plugin/API/image/memory/source-read/runtime/dependency actions.

`scripts/reconcile_agent_board_queue.js` provides the local queue reconciliation
check between that deterministic snapshot and `.agent_board` status surfaces. It
fails on missing required surfaces, next-safe-task drift, or missing blocked Red
items, while allowing harmless prose differences as warnings. It is not a real
executor and must not perform external actions.

`scripts/orchestrate_next_safe_task.js` provides the local Next Safe Task
Orchestrator. It selects only Green tasks or valid budgeted Amber tasks from the
materialized snapshot, preserves blocked Red items, previews state advancement,
and keeps all external side-effect flags false. It is not a real executor.

`scripts/simulate_amber_dry_run_execution_loop.js` proves the Amber execution
shape without external side effects: envelope, action packet, zero-cost dry-run
action, execution receipt, receipt registry entry, validation, and continuation
decision.

`scripts/detect_autopilot_evolution_gaps.js` is the local Evolution Engine. It
inspects known governance docs, validators, examples, receipts, and `.agent_board`
surfaces to propose future local tasks. It writes no live state, self-authorizes
no Red Lane item, and exists only to keep the autopilot backlog evolving.

### Truth Model

Uses repository reality as ground:

```text
git status
current branch
current HEAD
tracked files
project policy files
validation output
```

Memory, previous handoffs, and historical phase records are advisory only when
they conflict with current files or observed command output.

### Lane Classifier

Classifies each proposed step:

```text
Green Lane: local, reversible, no external service, no cost, no memory write, no dependency change, no secret read
Amber Lane: inside the active autonomy envelope, budgeted, exact target, validated, receipted
Red Lane: requires the user before execution
```

Red Lane includes:

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
cost unknown or unbounded for real external Amber action
uncapped cost
unbounded loops
overwriting existing artifacts without explicit overwrite allowance
wide VCPChat / VCPToolBox write without exact scope
dependency changes without exact package/action list
validation failure requiring non-obvious judgment
```

### Budget Engine

Checks each Amber action against the active envelope:

```text
max_provider_calls: 3
max_plugin_calls: 3
max_api_calls: 5
max_image_candidates: 3
max_external_read_files: 20
max_write_files: 10
max_dependency_actions: 2
max_retry_per_transient_failure: 1
max_runtime_probe_minutes: 10
max_cost_amount: bounded number or not_applicable
max_cost_currency: explicit currency or not_applicable
cost_tracking_required: true
cost_unknown_is_red: true
overwrite_existing_files_allowed: false
secret_value_read_allowed: false
raw_private_data_print_allowed: false
push_allowed: false
tag_release_deploy_allowed: false
destructive_action_allowed: false
```

### Receipt Recorder

Every meaningful Amber external or write action must leave a receipt with:

```text
task_id
lane
envelope_id
action_performed
target_systems
calls_used
files_read
files_written
dependency_actions_used
cost_accounting
validation_run
validation_result
rollback_or_cleanup_available
rollback_or_cleanup_plan
files_to_revert
cleanup_targets
irreversible_actions_performed
next_auto_step_allowed
stop_reason
```

The receipt registry is the entry point for all Amber receipt validation:

```text
tests/schema_examples/autopilot_receipt_registry.example.json
```

The registry lists each receipt fixture or replay, its path, envelope id,
max_write_files, dependency action budget, and cost budget. The validator must
iterate the registry rather than relying only on hardcoded receipt paths. Future
real Amber execution must have an envelope, receipt schema compatibility, and a
registry path before it proceeds.

Cost unknown, missing cost tracking, uncapped cost, or a missing call budget is
Red for real external Amber actions. Local-only receipt trials and replays must
record cost as `0` or `not_applicable`.

Rollback must be structured. Receipts must record whether rollback or cleanup is
available, the rollback plan, files to revert, cleanup targets, and any
irreversible actions. Irreversible actions must be explicit and require stricter
stop or review conditions before continuation.

## Amber Closeout Sync

After a meaningful Amber receipt action completes, Codex must automatically run a
separate Green Lane status-surface sync when any of these surfaces changed or
gained new authoritative refs:

```text
README
roadmap
.agent_board resume surfaces
Autopilot ledger
validators
local validation references
```

This sync is local closeout work. It does not consume the preceding Amber
action's `max_write_files` budget. It must remain local, reversible,
non-external, non-secret-bearing, non-runtime, non-dependency,
non-production-writing, and non-remote. It may update README, roadmap,
`.agent_board/HANDOFF.md`, `.agent_board/RUN_STATE.md`,
`.agent_board/TASK_QUEUE.md`, `.agent_board/CHECKPOINT.md`, and related local
validation references. It must run validation before completion.

### Continuation Judge

Allows continued autonomy only when all are true:

```text
current user goal is clear
each step remains inside the envelope budget
each step has a clear target and validation path
no Red Lane condition appears
each meaningful Amber action records a receipt
validation failure receives at most one obvious, safe, local repair or retry
```

## Local Validation Surface

The kernel is validated by:

```text
schemas/autopilot_autonomy_envelope.schema.yaml
schemas/autopilot_execution_receipt.schema.yaml
tests/schema_examples/autopilot_autonomy_envelope.example.json
tests/schema_examples/autopilot_receipt_registry.example.json
tests/schema_examples/autopilot_execution_receipt.example.json
scripts/validate_autopilot_governance_kernel.js
```

The validator must prove the Green / Amber / Red definitions, default envelope
budget, required Red gates, Amber receipt requirement, receipt registry
coverage, cost accounting, structured rollback, examples, and no-real-A5 guard
flags remain present.
