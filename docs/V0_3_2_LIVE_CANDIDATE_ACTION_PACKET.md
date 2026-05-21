# v0.3.2 Live Candidate Action Packet

Phase: `v0_3_2_live_candidate_action_packet`

Status: Red-gated preflight packet filled, pending the separate v0.3.3 execution
gate before any live generation.

This document converts the v0.3.1 cost boundary into a reviewable candidate
action packet for a future first controlled real generation loop. It is not an
execution authorization package. It does not authorize provider contact, plugin
calls, API calls, image generation, output directory creation, DailyNote write,
VCP memory write, runtime integration, real source read, push, tag, release,
deploy, or destructive action.

## Candidate Packet

```yaml
live_candidate_action_packet:
  version: v1
  phase: v0_3_2_live_candidate_action_packet
  long_term_goal: v0_3_controlled_real_provider_production_loop
  source_phase: v0_3_1_real_provider_cost_boundary_plan
  lane: Red-gated preflight
  packet_id: packet-v0-3-2-live-candidate-action-packet
  task_id: first_controlled_real_generation_candidate
  packet_status: filled_pending_v0_3_3_execution_gate
  execution_authorized_by_this_packet: false
  live_provider_call_allowed_now: false
  plugin_call_allowed_now: false
  api_call_allowed_now: false
  image_generation_allowed_now: false
  output_write_allowed_now: false
  daily_note_write_allowed_now: false
  vcp_memory_write_allowed_now: false
  runtime_probe_allowed_now: false
  push_allowed_now: false
```

## Current Candidate Field State

The owner supplied the live candidate fields on 2026-05-22. These fields make
the packet reviewable for the next gate, but they still do not authorize
execution in this phase.

```yaml
current_candidate_fields:
  provider_target: codex_builtin_image_generation
  plugin_id_or_provider_route: image_gen.imagegen
  model: managed_by_codex_image_tool
  command: generate
  visual_task_id: v0_3_3_first_codex_sample_generation
  prompt_package_ref: prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml
  max_provider_calls: 1
  max_image_candidates: 1
  retry_limit: 0
  cost_cap_amount: 1
  cost_cap_currency: usage_unit_or_lowest_available_quota
  output_directory: runs/real_generation/v0_3_3_codex_sample_first_trial/
  receipt_path: reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json
  registry_path: reports/provider_receipts/provider_receipt_registry.json
  review_console_bridge_ref: review_console/live_receipt_bridge/v0_3_3_codex_sample_first_trial
  rollback_limitations_acknowledged: true
  owner_authorization_phrase: "批准填充 v0_3_2 候选包：使用 Codex 内置 image generation，生成 1 张夜景城市阳台竖屏时装人像，prompt_package_ref=prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml，max_provider_calls=1，max_image_candidates=1，retry_limit=0，成本上限为 1 usage unit；仅写入指定 output/receipt/registry 路径，不覆盖已有文件，不读 secret，不写 DailyNote/VCP memory，不 push/tag/release；审批人 Jenn。"
```

## Missing Fields Blocking Activation

```yaml
missing_required_fields: []
filled_required_field_count: 17
```

## Current Execution Budgets

```yaml
current_execution_budgets:
  provider_calls: 0
  plugin_calls: 0
  api_calls: 0
  image_candidates: 0
  runtime_probe_minutes: 0
  cost_amount: 0
  cost_currency: not_applicable
  cost_tracking_required: true
  cost_unknown_is_red: true
```

## Candidate Fill Budgets

```yaml
candidate_fill_budgets:
  provider_calls: 1
  plugin_calls: 1
  api_calls: 1
  image_candidates: 1
  retry_limit: 0
  cost_cap_amount: 1
  cost_cap_currency: usage_unit_or_lowest_available_quota
```

## Future Fill Limits

If the owner later fills the packet, the filled values must stay inside these
caps or the packet remains Red:

```yaml
future_fill_limits:
  max_provider_calls_cap: 1
  max_plugin_calls_cap: 1
  max_api_calls_cap: 1
  max_image_candidates_cap: 1
  retry_limit_cap: 0
  overwrite_existing_files_allowed: false
  secret_value_read_allowed: false
  raw_private_data_print_allowed: false
  raw_provider_payload_capture_allowed: false
  raw_provider_response_capture_allowed: false
```

## Allowed Local Work Now

```yaml
allowed_now:
  - create_or_update_this_local_packet_doc
  - create_or_update_local_packet_fixture
  - create_or_update_local_packet_validator
  - update_local_roadmap_and_agent_board_status
```

## Stop Conditions

```yaml
stop_conditions:
  missing_exact_provider_target: Red
  missing_prompt_package: Red
  missing_cost_cap: Red
  unknown_or_uncapped_cost: Red
  missing_output_directory: Red
  output_path_collision_without_overwrite_authorization: Red
  missing_receipt_or_registry_path: Red
  missing_review_console_bridge_ref: Red
  missing_rollback_limitations_acknowledgement: Red
  owner_authorization_phrase_missing: Red
  secret_value_required: Red
  raw_request_or_response_capture_requested: Red
  live_provider_or_plugin_or_api_or_image_action_requested_now: Red
  validation_failure_requiring_judgment: Red
```

## Future Owner Fill Prompt

To activate the next stage, the owner should provide an exact packet fill or
reject this candidate. A valid fill must name the provider route, model, command,
visual task, prompt package, call budget, cost cap, output directory, receipt,
registry, Review Console bridge, rollback acknowledgement, and authorization
phrase.

```text
Owner decision needed before v0.3.3:
fill or reject packet-v0-3-2-live-candidate-action-packet.
```

## Current Result

```yaml
result:
  v0_3_2_packet_created: true
  candidate_packet_reviewable: true
  execution_authorized_by_this_packet: false
  live_provider_call_allowed_now: false
  current_live_call_budget: 0
  current_image_generation_budget: 0
  current_cost_budget: 0
  activation_blocked_by_missing_exact_owner_target: false
  packet_status: filled_pending_v0_3_3_execution_gate
  recommended_next: v0_3_3_first_live_generation_pilot
  next_phase_after_owner_fill: v0_3_3_first_live_generation_pilot
```
