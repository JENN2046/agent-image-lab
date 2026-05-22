# Smart Standing Authorization v3 — Budgeted Autonomy Envelope

base_contract: AGENTS.md
status: active
date: 2026-05-21
startup_default_model: Smart Standing Authorization v3
a4_8_status: retained_as_green_lane_substrate

## Purpose

Record the project owner's explicit instruction that selected formerly gated
production categories now run inside a bounded autonomy envelope. Codex should
not ask for step-by-step approval inside that envelope.

Authority rule: v3 is the active startup and autonomy model for Agent Image Lab.
A4.8 only supplies Green Lane local-safe behavior.

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

Bounded L4 planning refines Amber into typed subclasses before any future real
executor may run:

```text
Amber_A_exact_read: exact manifest / VCPChat / VCPToolBox reads; requires max_external_read_files and receipt
Amber_B_provider_image: provider/image actions; requires prompt_package_ref, output_path, receipt_path, asset_class, and cost cap
Amber_C_memory: DailyNote/VCP memory writes; requires memory_gate_id and redacted learning summary; raw assets forbidden
Amber_D_dependency_runtime: dependency/runtime probe actions; requires exact package or probe packet, rollback, and runtime minute budget
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
cost unknown or unbounded for real external Amber action
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

Every Amber receipt must be registered through:

```text
tests/schema_examples/autopilot_receipt_registry.example.json
```

The receipt registry is the durable local entry point for receipt validation. It
must list each receipt path, envelope id, write budget, dependency action budget,
and cost budget. Future real Amber execution must have an envelope, receipt, and
registry path before execution. Cost unknown, uncapped cost, or missing call
budget is Red. Rollback must be structured; any irreversible action must be
explicit and trigger stricter stop or review conditions.

Bounded L4 registry entries must use `receipt_path` as the primary receipt path,
must record `amber_subclass`, and must preserve side-effect flags. The legacy
`path` field may remain only as a compatibility alias for existing validators.

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
