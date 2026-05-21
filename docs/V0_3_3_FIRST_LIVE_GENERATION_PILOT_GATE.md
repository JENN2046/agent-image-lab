# v0.3.3 First Live Generation Pilot Gate

Phase: `v0_3_3_first_live_generation_pilot`

Status: execution authorized and attempted once; provider tool failed with no
image artifact and no retry budget.

This gate receives the filled v0.3.2 live candidate action packet and decides
whether the first real image generation pilot can safely move from Red-gated
preflight into Amber execution. It does not itself execute image generation.
It does not authorize provider contact, plugin calls, API calls, image
generation, output directory creation, receipt writes, registry writes,
DailyNote write, VCP memory write, runtime integration, real source read, push,
tag, release, deploy, or destructive action.

## Gate Packet

```yaml
v0_3_3_first_live_generation_pilot_gate:
  version: v1
  phase: v0_3_3_first_live_generation_pilot
  long_term_goal: v0_3_controlled_real_provider_production_loop
  source_phase: v0_3_2_live_candidate_action_packet
  lane: Red-to-Amber execution gate
  gate_id: gate-v0-3-3-first-live-generation-pilot
  packet_id: packet-v0-3-2-live-candidate-action-packet
  visual_task_id: v0_3_3_first_codex_sample_generation
  gate_status: attempted_failed_no_retry
  candidate_packet_status: filled_pending_v0_3_3_execution_gate
  execution_authorized_by_this_gate: true
  live_provider_call_allowed_now: false
  plugin_call_allowed_now: false
  api_call_allowed_now: false
  image_generation_allowed_now: false
  output_write_allowed_now: false
  receipt_write_allowed_now: false
  registry_write_allowed_now: false
  daily_note_write_allowed_now: false
  vcp_memory_write_allowed_now: false
  runtime_probe_allowed_now: false
  push_allowed_now: false
```

## Filled Candidate Inputs

```yaml
candidate_inputs:
  provider_target: codex_builtin_image_generation
  plugin_id_or_provider_route: image_gen.imagegen
  model: managed_by_codex_image_tool
  command: generate
  prompt_package_ref: prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml
  prompt_package_id: fashion_night_balcony_vertical_portrait_v1
  visual_task_id: v0_3_3_first_codex_sample_generation
  output_directory: runs/real_generation/v0_3_3_codex_sample_first_trial/
  receipt_path: reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json
  registry_path: reports/provider_receipts/provider_receipt_registry.json
  review_console_bridge_ref: review_console/live_receipt_bridge/v0_3_3_codex_sample_first_trial
  max_provider_calls: 1
  max_plugin_calls: 1
  max_api_calls: 1
  max_image_candidates: 1
  retry_limit: 0
  cost_cap_amount: 1
  cost_cap_currency: usage_unit_or_lowest_available_quota
  rollback_limitations_acknowledged: true
  overwrite_existing_files_allowed: false
  secret_value_read_allowed: false
  raw_private_data_print_allowed: false
  raw_provider_payload_capture_allowed: false
  raw_provider_response_capture_allowed: false
```

## Gate Readiness

```yaml
gate_readiness:
  v0_3_2_packet_filled: true
  prompt_package_exists: true
  prompt_package_allows_generation_by_itself: false
  output_directory_exists_now: true
  receipt_file_exists_now: true
  output_path_collision: false
  receipt_path_collision: false
  registry_parent_write_plan_checked: true
  image_tool_output_capture_plan_checked: true
  exact_v0_3_3_execution_authorization_present: true
  execution_runner_available_and_bound: true
  can_execute_now: false
  provider_calls_used: 1
  image_candidates_generated: 0
  failure_class: provider_tool_user_error
```

## Current Execution Budgets

The v0.3.2 candidate contains a future one-shot budget, but this gate has not
converted that candidate budget into an active provider/image budget.

```yaml
current_execution_budgets:
  provider_calls: 0
  plugin_calls: 0
  api_calls: 0
  image_candidates: 0
  runtime_probe_minutes: 0
  cost_amount: 0
  cost_currency: not_applicable
  cost_unknown_is_red: true
```

## Candidate Budget If Later Activated

```yaml
candidate_budget_if_activated:
  provider_calls: 1
  plugin_calls: 1
  api_calls: 1
  image_candidates: 1
  retry_limit: 0
  cost_cap_amount: 1
  cost_cap_currency: usage_unit_or_lowest_available_quota
```

## Required Before Image Generation

```yaml
required_before_image_generation:
  - exact_owner_authorization_phrase_for_v0_3_3_execution
  - output_directory_creation_and_no_overwrite_plan
  - receipt_write_plan
  - provider_receipt_registry_update_plan
  - image_tool_output_capture_or_manual_artifact_binding_plan
  - post_generation_review_console_bridge_plan
  - no_secret_read_confirmation
  - no_raw_provider_payload_or_response_capture_confirmation
  - one_provider_call_one_image_candidate_zero_retry_confirmation
```

## Stop Conditions

```yaml
stop_conditions:
  missing_exact_v0_3_3_execution_authorization: Red
  missing_prompt_package: Red
  prompt_package_subject_mismatch: Red
  output_path_collision_without_overwrite_authorization: Red
  receipt_path_collision_without_overwrite_authorization: Red
  missing_receipt_or_registry_write_plan: Red
  missing_image_tool_output_capture_plan: Red
  unknown_or_uncapped_cost: Red
  retry_requested: Red
  secret_value_required: Red
  raw_request_or_response_capture_requested: Red
  provider_or_image_call_requested_before_gate_passes: Red
  push_tag_release_deploy_requested: Red
  validation_failure_requiring_judgment: Red
```

## Current Result

```yaml
result:
  v0_3_3_gate_entered: true
  v0_3_2_packet_filled: true
  gate_status: attempted_failed_no_retry
  execution_authorized_by_this_gate: true
  live_provider_call_allowed_now: false
  image_generation_allowed_now: false
  output_write_allowed_now: false
  receipt_write_allowed_now: false
  registry_write_allowed_now: false
  current_live_call_budget: 0
  current_image_generation_budget: 0
  current_cost_budget: 0
  actual_image_generation_performed: false
  provider_contact_performed: true
  plugin_call_performed: true
  api_call_performed: false
  receipt_written: true
  registry_written: true
  output_directory_created: true
  recommended_next: inspect_failed_provider_tool_attempt_or_authorize_new_trial
```
