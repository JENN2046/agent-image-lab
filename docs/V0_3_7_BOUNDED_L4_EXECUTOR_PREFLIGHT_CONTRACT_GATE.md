# v0.3.7 Bounded L4 Executor Preflight Contract Gate

base_contract: AGENTS.md
phase: v0_3_7_bounded_l4_executor_preflight_contract_gate
mode: A4 local docs/schema/validator planning gate
status: local_preflight_contract_gate
source_remote_baseline: 313def823dde746b75f151b8b3d3e28c6dc9e246

## Purpose

This gate defines the preflight contract that a future Bounded L4 executor must
validate before running any action. It does not implement a real executor loop,
does not execute provider/image/memory/runtime work, does not create a
production candidate, and does not authorize commit or push.

## Executor Preflight Packet

Every future executor action must have an explicit preflight packet before it
can execute. The packet is a planning and validation contract, not an execution
entrypoint.

```yaml
executor_preflight_packet:
  packet_id: preflight_v0_3_7_green_status_sync_example
  task_id: bounded_l4_executor_preflight_contract_gate
  source_goal_id: goal_v0_3_7_bounded_l4_executor_preflight_contract
  source_route_plan_id: route_v0_3_7_bounded_l4_executor_preflight_contract
  selected_next_safe_task_id: task_define_preflight_packet_contract
  lane: Green
  amber_subclass: Green_local
  exact_target_systems:
    - Agent-Image-Lab repository
  exact_allowed_paths_or_objects:
    - docs/V0_3_7_BOUNDED_L4_EXECUTOR_PREFLIGHT_CONTRACT_GATE.md
    - schemas/bounded_l4_executor_preflight_packet.schema.yaml
    - tests/schema_examples/bounded_l4_executor_preflight_packet.example.json
    - scripts/validate_bounded_l4_executor_preflight_contract.js
  forbidden_paths_or_objects:
    - .env
    - .env.local
    - runs/
    - assets/
    - accepted_samples/
    - production_candidate/
  allowed_operation: define_preflight_contract_only
  budget_snapshot:
    max_write_files: 15
    max_cost_amount: 0
    cost_unknown: false
    cost_unknown_is_red: true
    budget_would_exceed_envelope: false
  receipt_registry_ref: schemas/autopilot_receipt_registry.schema.yaml
  receipt_path: tests/schema_examples/bounded_l4_executor_preflight_packet.example.json
  rollback_or_cleanup_plan:
    rollback_available: true
    cleanup_required: false
    manual_revert_allowed: true
  validation_required:
    - git diff --check
    - node --check scripts/validate_bounded_l4_executor_preflight_contract.js
    - node scripts/validate_bounded_l4_executor_preflight_contract.js
    - npm run validate:mvp
  stop_conditions:
    - red_lane_detected
    - missing_preflight_packet
    - missing_receipt_path
    - missing_rollback_plan
    - budget_exceeded
    - cost_unknown
    - side_effect_flag_drift
    - validation_failed_non_obvious
    - repair_limit_exceeded
    - secret_required
    - production_candidate_gate_required
    - memory_gate_required
  side_effect_flags_initial:
    provider_call_performed: false
    image_generation_performed: false
    DailyNote_write_performed: false
    VCP_memory_write_performed: false
    runtime_call_performed: false
    secret_value_read_performed: false
    production_candidate_created: false
    accepted_sample_promoted: false
  can_execute_now: false
```

`can_execute_now` must remain false in this gate. A later real executor may only
change that value after a separate gate proves locks, budget, lane, receipt,
rollback, repair, and validation enforcement.

## Task Lock Contract

```yaml
task_lock_contract:
  task_lock_required: true
  lock_scope: selected_next_safe_task_id
  lock_owner: future_real_executor_instance_id
  lock_expiry_or_manual_release_policy: explicit_expiry_or_manual_release_required
  stale_lock_is_red_or_blocked: true
  one_active_task_only: true
```

A future executor must acquire a task lock before one action starts. If a lock is
stale, missing owner metadata, ambiguous, or held by another action, the task is
Red or blocked and must not enter the executable queue.

## One-Action Execution Contract

```yaml
one_action_execution_contract:
  future_requirement: true
  execute_one_action_only_per_loop: true
  real_executor_implemented_now: false
  no_action_without_preflight_packet: true
  no_action_without_receipt_path: true
  no_action_if_budget_would_exceed_envelope: true
  no_action_if_lane_is_Red: true
```

The future executor loop may execute at most one action per loop. It must stop
before execution if the lane is Red, if the preflight packet is missing, if the
receipt path is missing, or if the budget would exceed the active envelope.

## Repair Once State Model

```yaml
repair_once_state_model:
  max_repair_attempts_per_task: 1
  repair_attempt_count: 0
  repair_reason: null
  repair_validation_result: not_run
  second_failure_is_red: true
  non_obvious_repair_is_red: true
```

The first repair may occur only when it is obvious, local, safe, and inside the
same task boundary. A second failure, a non-obvious repair, or a repair requiring
new scope becomes Red.

## Stop Reason Taxonomy

```yaml
stop_reason_taxonomy:
  - red_lane_detected
  - missing_preflight_packet
  - missing_receipt_path
  - missing_rollback_plan
  - budget_exceeded
  - cost_unknown
  - side_effect_flag_drift
  - validation_failed_non_obvious
  - repair_limit_exceeded
  - secret_required
  - production_candidate_gate_required
  - memory_gate_required
```

Stop reasons must be machine-readable. A future executor must write one of these
reasons before halting or requesting human review.

## Negative Cases

The local validator must prove these fail-closed cases:

```yaml
negative_cases:
  - missing_preflight_packet_fails
  - red_lane_cannot_execute
  - missing_amber_subclass_fails
  - missing_receipt_path_fails
  - missing_rollback_plan_fails
  - budget_exceeded_fails
  - cost_unknown_fails
  - repair_attempt_count_greater_than_one_fails
  - memory_write_without_memory_gate_fails
  - production_candidate_without_gate_fails
  - side_effect_flag_drift_fails
```

## Boundary Preservation

```yaml
real_executor_implemented_now: false
provider_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_call_performed: false
secret_value_read_performed: false
commit_performed: false
push_performed: false
```

Recommended next after review:

```yaml
recommended_next_phase: guarded local commit review for v0.3.7, not executor implementation
```
