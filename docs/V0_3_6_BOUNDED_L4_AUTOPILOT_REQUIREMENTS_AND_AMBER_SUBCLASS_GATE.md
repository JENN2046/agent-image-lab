# v0.3.6 Bounded L4 Autopilot Requirements And Amber Subclass Gate

base_contract: AGENTS.md
phase: v0_3_6_bounded_l4_autopilot_requirements_and_amber_subclass_gate
mode: A4 local docs/schema/validator planning gate
status: local_requirements_gate
source_local_baseline: a9d0835e460874546bcfcc2ce0a9408eb6df2bd3
source_remote_baseline: df4d7c69d3f0e628836c77fe0d8c6ec723502b1a

## Purpose

This gate defines the requirements for evolving Smart Standing Authorization v3
from a budgeted autonomy governance kernel into a Bounded Level-4 Engineering
Autopilot. It does not implement a real executor loop and does not authorize
provider calls, image generation, DailyNote writes, VCP memory writes, runtime
calls, dependency changes, production candidates, accepted sample promotion,
secret reads, commit, or push.

## Operational Design Domain

```yaml
bounded_l4_operational_design_domain:
  allowed_project_domain: Agent-Image-Lab only
  allowed_execution_modes:
    - Green local execution
    - Amber_A exact reads
    - Amber_B provider/image only with action packet
    - Amber_C memory only with memory gate
    - Amber_D dependency/runtime only with exact package/probe packet
  red_always:
    - push_tag_release_deploy
    - secret_value_read
    - uncapped_cost
    - unbounded_loop
    - destructive_action
    - production_candidate_without_gate
    - accepted_sample_without_review_gate
    - memory_write_without_memory_gate
```

Bounded L4 is project-local and domain-limited. It may operate only on Agent
Image Lab tasks whose boundaries can be expressed as exact files, exact action
packets, explicit budgets, validation commands, receipt registry entries, and
stop conditions. It is not a universal autonomous agent target.

## Amber Subclasses

```yaml
amber_subclasses:
  Amber_A_exact_read:
    max_external_read_files_required: true
    receipt_required: true
    allowed_scope: exact manifest / VCPChat / VCPToolBox read only
    forbidden_scope:
      - raw private data print
      - secret value read
      - broad source dump
      - write action
  Amber_B_provider_image:
    prompt_package_ref_required: true
    output_path_required: true
    receipt_path_required: true
    asset_class_required: true
    cost_cap_required: true
    allowed_scope: provider/image action only after action packet preflight
    forbidden_scope:
      - missing receipt registry entry
      - uncapped cost
      - output path collision
      - production_candidate creation
  Amber_C_memory:
    memory_gate_id_required: true
    redacted_learning_summary_required: true
    raw_asset_forbidden: true
    allowed_scope: DailyNote/VCP memory write only after memory gate
    forbidden_scope:
      - raw image binary
      - unredacted private data
      - memory_seed without memory gate
  Amber_D_dependency_runtime:
    exact_package_or_probe_required: true
    rollback_required: true
    runtime_minutes_budget_required: true
    allowed_scope: exact dependency action or bounded runtime probe only
    forbidden_scope:
      - package manager switch
      - audit-fix
      - unbounded runtime
      - missing rollback plan
```

Provider/image, memory, dependency, and runtime actions must not remain hidden in
one generic Amber class. A future executor must classify each task into exactly
one Amber subclass before execution.

## Receipt Registry Schema Requirement

The receipt registry is mandatory before any real Amber action. The schema must
require:

```yaml
receipt_registry_schema_must_require:
  - registry_id
  - receipts
  - receipt_id
  - receipt_path
  - envelope_id
  - task_id
  - lane
  - amber_subclass
  - max_write_files
  - max_cost_amount
  - cost_unknown_is_red
  - rollback_or_cleanup_available
  - validation_result
  - side_effect_flags
```

For backward compatibility, the current fixture may keep `path` as an alias, but
`receipt_path` is the required primary field for Bounded L4 registry entries.

## Real Executor Loop Requirements

```yaml
real_executor_requirements:
  implemented_now: false
  required_future_loop:
    - select_next_safe_task
    - acquire_task_lock
    - verify_lane_and_budget
    - execute_one_action
    - capture_receipt
    - validate
    - repair_once_if_safe
    - update_agent_board
    - continue_or_stop
```

This gate intentionally does not add `execute_one_action` code. The current
scripts remain materializers, orchestrators, validators, and dry-run simulators.
A future executor must run one action at a time, hold a task lock, and stop on
budget overflow, unknown cost, missing receipt path, missing rollback, missing
validation, side-effect flag drift, or Red Lane detection.

## Repair Once Policy

```yaml
repair_once_policy:
  enforced_now_by_real_executor: false
  future_requirement: true
  max_repair_attempts_per_task: 1
  non_obvious_failure: Red
```

The current governance kernel states the repair-once rule, but no real executor
enforces it. Bounded L4 requires executor state that records the first failed
validation, the repair attempt, the repair validation, and the stop reason when
a second failure or non-obvious decision appears.

## Budget Exceeded Stop Requirements

```yaml
budget_exceeded_stop_requirements:
  cost_unknown_is_red: true
  uncapped_cost_is_red: true
  max_provider_calls_enforced: true
  max_plugin_calls_enforced: true
  max_api_calls_enforced: true
  max_image_candidates_enforced: true
  max_external_read_files_enforced: true
  max_write_files_enforced: true
  max_dependency_actions_enforced: true
  max_runtime_probe_minutes_enforced: true
  receipt_registry_budget_must_match_receipt_usage: true
```

Any future executor must stop before running an action that lacks a known budget
or would exceed a registry/envelope budget. A receipt that shows budget overflow
must block continuation.

## Executor Negative Cases Requirement

A future real executor validator must prove at least these negative cases:

```yaml
executor_negative_cases_required:
  - red_item_enters_executable_queue_fails
  - missing_receipt_registry_entry_fails
  - missing_amber_subclass_fails
  - amber_subclass_mismatch_fails
  - budget_exceeded_fails
  - cost_unknown_fails
  - missing_rollback_fails
  - missing_validation_fails
  - repair_attempts_greater_than_one_fails
  - production_candidate_without_gate_fails
  - accepted_sample_without_review_gate_fails
  - memory_write_without_memory_gate_fails
  - side_effect_flag_drift_fails
```

## Boundary Preservation

This phase preserves:

```yaml
real_executor_implemented_now: false
provider_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_call_performed: false
secret_value_read_performed: false
production_candidate_created: false
accepted_sample_promoted: false
push_performed: false
```

Recommended next phase after review:

```yaml
recommended_next_phase: v0_3_7_bounded_l4_executor_preflight_contract_gate
```
