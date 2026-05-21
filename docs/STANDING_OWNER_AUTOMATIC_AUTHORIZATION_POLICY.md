# Smart Standing Authorization v3 — Budgeted Autonomy Envelope

base_contract: AGENTS.md
status: active
date: 2026-05-21

## Purpose

Record the project owner's explicit instruction that selected formerly gated
production categories now run inside a bounded autonomy envelope. Codex should
not ask for step-by-step approval inside that envelope.

Core rule:

```text
Standing owner authorization grants Codex a bounded autonomy envelope.
Within that envelope, Codex must not ask for step-by-step approval.
Codex should plan, execute, validate, repair once when safe, record receipts, and continue until the goal is complete or a Red condition appears.
```

## Default Autonomy Envelope

```yaml
standing_owner_smart_authorization_v3_active: true
autonomy_envelope_active: true
green_lane_direct: true
amber_lane_autonomous_with_budget_and_receipts: true
red_lane_requires_user: true
default_autonomy_envelope:
  max_provider_calls: 3
  max_plugin_calls: 3
  max_api_calls: 5
  max_image_candidates: 3
  max_external_read_files: 20
  max_write_files: 10
  max_dependency_actions: 2
  max_retry_per_transient_failure: 1
  max_runtime_probe_minutes: 10
  overwrite_existing_files_allowed: false
  secret_value_read_allowed: false
  raw_private_data_print_allowed: false
  push_allowed: false
  tag_release_deploy_allowed: false
  destructive_action_allowed: false
```

## Lane Model

### Green Lane

Direct automatic execution with after-action recording:

```text
docs/schema/validator/static prototype local maintenance
.agent_board status sync
local validation
small reversible code or documentation fixes
no external service contact
no cost
no memory write
no dependency change
no secret read
```

### Amber Lane

Continuous autonomous execution inside the envelope without step-by-step
approval. Codex should plan, execute, validate, repair once when safe, record a
receipt, and continue.

```text
A5
provider contact
plugin call
API call
image generation
DailyNote write
VCP memory write
real manifest read
real VCPChat read
real VCPToolBox read
small dependency change
production metadata write
bounded runtime/integration probe
```

Amber VCPChat / VCPToolBox / manifest reads must be exact reads. Write or modify
actions require exact scope, rollback, validation, and receipt. Wide VCPChat /
VCPToolBox writes are Red.

Dependency changes are Amber only when the exact package/action list is known
and the action count stays within `max_dependency_actions`. Audit-fix, bulk
upgrades, package-manager switching, or unclear dependency changes are Red.

### Red Lane

Must stop and ask the user:

```text
git push
tag
release
deploy
force push
history rewrite
destructive Git or filesystem action
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

## Receipt Rule

Every meaningful Amber external or write action must record a receipt:

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
validation_run
validation_result
rollback_or_cleanup_available
next_auto_step_allowed
stop_reason
```

## Continuation Rule

Codex may continue through multiple Amber steps without asking the user when all
conditions are true:

```text
the current user goal is clear
each step stays inside the envelope budget
each step has a clear target and validation path
no Red condition appears
each meaningful Amber action records a receipt
validation failure receives at most one obvious, safe, local repair or retry
```

Ambiguous instructions such as `继续`, `go ahead`, or `自动推进` may continue
Green work and Amber work inside the envelope. They do not authorize Red Lane
actions.

## Operating Rules

- Standing authorization grants a bounded autonomy envelope, not unchecked execution.
- Do not ask for step-by-step approval inside Green or Amber.
- Do not skip budget, target, validation, rollback, receipt, or stop-condition checks.
- If a Red Lane condition appears, stop and ask the user.
- Choose the smallest action inside the active envelope.
- Do not print secrets, raw private data, or raw chat history.
- Record meaningful production actions in the status surfaces.
- Run available validation after changes.
- Preserve exact-file staging and never use `git add .`.
