# v0.3.1 Real Provider Cost Boundary Plan

Phase: `v0_3_1_real_provider_cost_boundary_plan`

Status: Red-gated local planning complete when validated.

This document defines the first boundary for moving toward a real provider
production loop. It is not an execution authorization package. It does not
authorize provider contact, plugin calls, API calls, image generation, output
creation, DailyNote write, VCP memory write, runtime integration, push, tag,
release, deploy, or destructive action.

## Boundary Packet

```yaml
real_provider_cost_boundary:
  version: v1
  phase: v0_3_1_real_provider_cost_boundary_plan
  long_term_goal: v0_3_controlled_real_provider_production_loop
  lane: Red-gated planning
  execution_authorized_by_this_plan: false
  current_allowed_actions:
    - local documentation
    - local fixture
    - local validator
    - local .agent_board status sync
  live_provider_call_allowed_now: false
  plugin_call_allowed_now: false
  api_call_allowed_now: false
  image_generation_allowed_now: false
  daily_note_write_allowed_now: false
  vcp_memory_write_allowed_now: false
  runtime_probe_allowed_now: false
  push_allowed_now: false
```

## Required Before Any Future Live Call

```yaml
future_live_call_requirements:
  exact_provider_target_required: true
  selected_provider_target_now: null
  selected_plugin_id_now: null
  selected_model_now: null
  selected_command_now: null
  exact_visual_task_required: true
  exact_prompt_package_required: true
  max_provider_calls_required: true
  max_provider_calls_after_authorization_cap: 3
  max_image_candidates_after_authorization_cap: 3
  retry_limit_after_authorization_cap: 1
  cost_cap_required: true
  cost_cap_amount_now: null
  cost_cap_currency_now: null
  cost_tracking_required: true
  cost_unknown_is_red: true
  output_directory_required: true
  overwrite_existing_files_allowed: false
  receipt_required: true
  registry_entry_required: true
  review_console_bridge_required: true
```

## Rollback Reality

```yaml
rollback_limitations:
  provider_cost_spend_reversible: false
  external_provider_request_reversible: false
  generated_image_external_side_effect_reversible: false
  local_uncommitted_docs_reversible: true
  future_local_artifacts_removable_if_exactly_scoped: true
  rollback_plan_required_before_live_call: true
```

## Stop Conditions

```yaml
stop_conditions:
  missing_exact_provider_target: Red
  missing_call_budget: Red
  missing_cost_cap: Red
  unknown_or_uncapped_cost: Red
  missing_rollback_limitations: Red
  secret_value_required: Red
  raw_request_or_response_would_be_recorded: Red
  endpoint_or_token_would_be_recorded: Red
  output_path_collision_without_overwrite_authorization: Red
  owner_authorization_phrase_missing: Red
  validation_failure_requiring_judgment: Red
```

## Future Activation Shape

A future live pilot requires a separate exact authorization packet. The packet
must include:

```yaml
future_authorization_packet_required_fields:
  - provider_target
  - plugin_id_or_provider_route
  - model
  - command
  - visual_task_id
  - prompt_package_ref
  - max_provider_calls
  - max_image_candidates
  - retry_limit
  - cost_cap_amount
  - cost_cap_currency
  - output_directory
  - receipt_path
  - registry_path
  - rollback_limitations_acknowledged
  - owner_authorization_phrase
```

## Current Result

```yaml
result:
  v0_3_1_plan_created: true
  execution_authorized_by_this_plan: false
  current_live_call_budget: 0
  current_image_generation_budget: 0
  current_cost_budget: 0
  red_boundary_requires_owner_authorization: true
  recommended_next: v0_3_2_live_candidate_action_packet
```
