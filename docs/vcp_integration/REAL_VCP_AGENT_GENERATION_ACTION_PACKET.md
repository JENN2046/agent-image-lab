# Real VCP Agent Generation Action Packet

```yaml
phase: v0_6_71_real_vcp_agent_generation_action_packet
source_phase: v0_6_70_real_vcp_agent_generation_route_activation_gate
goal_target: to_real_VCP_agent_generation
base_contract: AGENTS.md
lane: Amber_B_provider_image
intent: local_implementation
risk_level: R2
status: completed_validated
execution: false
```

## Purpose

This gate creates the exact Amber_B provider-image action packet for the real
VCP Agent generation route. It prepares the bounded packet only; it does not
execute the provider, plugin, API, or image generation call.

## Amber_B Action Packet

```yaml
amber_b_provider_image_action_packet:
  packet_id: amber_b_v0_6_71_real_vcp_agent_generation_one_shot
  task_id: v0_6_73_real_vcp_agent_generation_execution_one_shot
  lane: Amber_B_provider_image
  caller: VCP_Agent
  selected_route: NativeDoubaoImage_one_shot_project_plugin
  selected_plugin_id: NativeDoubaoImage
  command: generate
  mode: text_to_image
  model: doubao-seedream-5-0-260128
  plugin_profile_ref: plugins/image_generation/native_doubao_image/plugin.profile.yaml
  runner_ref: scripts/run_native_doubao_image_generation.js
  adapter_ref: adapters/image_generation/native_doubao_adapter.js
  prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml
  generation_plan_ref: docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ROUTE_ACTIVATION_GATE.md
  output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
  receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
  blocked_receipt_ref: reports/provider_receipts/v0_6_72_real_vcp_agent_generation_preflight_blocked_receipt.json
  review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
```

## Envelope

```yaml
exact_allowed_paths_or_objects:
  - plugins/image_generation/native_doubao_image/plugin.profile.yaml
  - scripts/run_native_doubao_image_generation.js
  - adapters/image_generation/native_doubao_adapter.js
  - plugins/image_generation/native_doubao_image/native_doubao_image.js
  - prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml
  - runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
  - reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
  - reports/provider_receipts/v0_6_72_real_vcp_agent_generation_preflight_blocked_receipt.json
  - review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
forbidden_paths_or_objects:
  - .env
  - .env.local
  - config.env
  - accepted_samples/
  - production/
  - asset_archive/accepted_samples/
  - memory_policy/
  - external repositories
```

## Budget

```yaml
budget:
  max_plugin_calls: 1
  max_provider_calls: 1
  max_api_calls: 1
  max_images_created: 1
  retry_limit: 0
  overwrite_existing_files_allowed: false
  secret_value_read_allowed: false
  raw_private_data_print_allowed: false
  raw_provider_payload_retention_policy: forbidden
  raw_stdout_stderr_retention_policy: forbidden
```

## Receipt And Review Requirements

```yaml
receipt_required: true
review_handoff_required: true
human_review_required: true
memory_write_allowed: false
accepted_samples_write_allowed: false
production_candidate_write_allowed: false
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
```

## Rollback Or Cleanup Plan

```yaml
rollback_or_cleanup_plan:
  before_execution: remove only newly created v0.6.70-v0.6.72 docs/fixtures/validators/receipts if abandoning before commit
  after_failed_preflight: keep sanitized blocked receipt and do not create output directory
  after_partial_execution_without_verified_image: keep sanitized receipt, do not retry, do not write review handoff as successful
  after_successful_execution: preserve output and receipt for human review, do not auto-promote
```

## Stop Conditions

```yaml
stop_conditions:
  - selected_plugin_id_mismatch
  - command_or_model_mismatch
  - prompt_package_ref_missing_or_outside_prompts_image_generation
  - output_directory_ref_outside_runs_real_generation
  - output_directory_has_overwrite_risk
  - receipt_path_missing_or_overwrite_risk
  - review_handoff_path_missing_or_overwrite_risk
  - secret_value_read_required
  - env_file_value_read_required
  - raw_provider_payload_retention_required
  - raw_stdout_stderr_retention_required
  - provider_quota_or_rate_limit_risk_without_one_shot_receipt
  - second_call_required
  - retry_required
  - validation_failure
```

## Validation Required

```yaml
validation_required:
  - node --check scripts/validate_real_vcp_agent_generation_action_packet.js
  - node scripts/validate_real_vcp_agent_generation_action_packet.js
  - node --check scripts/validate_real_vcp_agent_generation_route_activation_gate.js
  - node scripts/validate_real_vcp_agent_generation_route_activation_gate.js
  - git diff --check
```

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
env_value_read_performed: false
secret_value_read_performed: false
push_performed: false
```

## Closeout

```yaml
phase: v0_6_71_real_vcp_agent_generation_action_packet
source_phase: v0_6_70_real_vcp_agent_generation_route_activation_gate
result: COMPLETED_VALIDATED
goal_target: to_real_VCP_agent_generation
selected_route: NativeDoubaoImage_one_shot_project_plugin
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
push_performed: false
receipt_ref: null
review_handoff_ref: null
next_recommended: v0_6_72_real_vcp_agent_generation_preflight_no_call
```
