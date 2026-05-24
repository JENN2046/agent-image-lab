# Real VCP Agent Generation Preflight No-Call

```yaml
phase: v0_6_72_real_vcp_agent_generation_preflight_no_call
source_phase: v0_6_71_real_vcp_agent_generation_action_packet
goal_target: to_real_VCP_agent_generation
base_contract: AGENTS.md
lane: Amber_B_provider_image
intent: local_implementation
risk_level: R2
status: blocked_validated_no_call
execution: false
```

## Purpose

This gate performs the no-call preflight for the real VCP Agent generation route.
It validates exact route, model, prompt package, output directory, budget,
receipt path, review handoff path, and stop conditions before any real provider,
plugin, API, or image generation call.

## Preflight Inputs

```yaml
preflight_inputs:
  action_packet_ref: docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ACTION_PACKET.md
  activation_gate_ref: docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ROUTE_ACTIVATION_GATE.md
  selected_route: NativeDoubaoImage_one_shot_project_plugin
  selected_plugin_id: NativeDoubaoImage
  command: generate
  mode: text_to_image
  model: doubao-seedream-5-0-260128
  prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml
  output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
  receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
  blocked_receipt_ref: reports/provider_receipts/v0_6_72_real_vcp_agent_generation_preflight_blocked_receipt.json
  review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
```

## Passed No-Call Checks

```yaml
passed_no_call_checks:
  prompt_package_ref_exists: true
  prompt_package_ref_under_prompts_image_generation: true
  output_directory_ref_under_runs_real_generation: true
  selected_plugin_id_matches_action_packet: true
  command_matches_action_packet: true
  model_matches_action_packet: true
  max_plugin_calls: 1
  max_images_created: 1
  retry_limit: 0
  overwrite_existing_files_allowed: false
  output_directory_has_overwrite_risk: false
  future_success_receipt_path_has_overwrite_risk: false
  review_handoff_path_has_overwrite_risk: false
  raw_provider_payload_retention_policy: forbidden
  stop_conditions_present: true
  no_call_preflight_performed: true
```

## Blocking Finding

```yaml
blocking_finding:
  result: BLOCKED
  blocker_id: red_lane_secret_value_read_required_by_current_native_doubao_runner
  blocker_lane: Red
  current_runner_ref: scripts/run_native_doubao_image_generation.js
  current_runner_real_mode_requires_env_local_value_load: true
  forbidden_by_current_goal:
    - secret_value_read_or_secret_edit
    - .env_or_.env.local_secret_value_read
  exact_evidence_without_secret_read:
    - runner_source_contains_loadEnvLocal_real_execution_path
    - runner_source_contains_loadDotEnv_ENV_LOCAL_PATH_value_loader
    - plugin_real_gate_requires_DOUBAO_IMAGE_API_KEY_environment_variable
  env_file_content_read_performed: false
  secret_value_read_performed: false
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  image_generation_performed: false
  output_write_performed: false
```

The no-call preflight blocks before `v0_6_73` because the current local
`NativeDoubaoImage` real execution path requires loading `.env.local` secret
values. The action packet explicitly sets `secret_value_read_allowed: false`, and
the current goal forbids `.env` / `.env.local` secret value reads. There is no
available non-secret callable provider binding in the current tool surface.

## Sanitized Blocked Receipt

```yaml
receipt_ref: reports/provider_receipts/v0_6_72_real_vcp_agent_generation_preflight_blocked_receipt.json
receipt_type: sanitized_blocked_preflight_receipt
raw_provider_payload_recorded: false
secret_recorded: false
private_absolute_path_recorded: false
provider_endpoint_recorded: false
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
phase: v0_6_72_real_vcp_agent_generation_preflight_no_call
source_phase: v0_6_71_real_vcp_agent_generation_action_packet
result: BLOCKED
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
receipt_ref: reports/provider_receipts/v0_6_72_real_vcp_agent_generation_preflight_blocked_receipt.json
review_handoff_ref: null
next_recommended: BLOCKED_non_secret_native_doubao_runtime_binding_required_before_v0_6_73
```
