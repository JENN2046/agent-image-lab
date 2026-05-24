# Real VCP Agent Generation Route Activation Gate

```yaml
phase: v0_6_70_real_vcp_agent_generation_route_activation_gate
source_phase: v0_6_69a_exact_file_commit_readiness_gate
goal_target: to_real_VCP_agent_generation
base_contract: AGENTS.md
mode: Green local route activation only
intent: local_implementation
risk_level: R1
status: completed_validated
execution: false
```

## Purpose

This gate selects and locks the real VCP Agent generation route after
`codex_session_image_import` was closed as a manual fallback.

It does not call a provider, plugin, API, MCP runtime, VCPToolBox, or VCPChat.
It does not generate an image, read image binaries, write output, write
DailyNote, write VCP memory, write accepted samples, create production
candidates, read secrets, push, tag, release, or deploy.

## Route Activation

```yaml
real_vcp_agent_generation_route_activation:
  selected_route: NativeDoubaoImage_one_shot_project_plugin
  selected_plugin_id: NativeDoubaoImage
  plugin_profile_ref: plugins/image_generation/native_doubao_image/plugin.profile.yaml
  command: generate
  mode: text_to_image
  model: doubao-seedream-5-0-260128
  prompt_package_ref: prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml
  generation_plan_ref: docs/vcp_integration/REAL_VCP_AGENT_GENERATION_ROUTE_ACTIVATION_GATE.md
  output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
  receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
  review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
```

## Locked Budget

```yaml
budget:
  max_plugin_calls: 1
  max_provider_calls: 1
  max_api_calls: 1
  max_images_created: 1
  retry_limit: 0
  overwrite_existing_files_allowed: false
  memory_write_allowed: false
  accepted_samples_write_allowed: false
  production_candidate_write_allowed: false
```

## Route Decision

```yaml
route_decision:
  codex_session_image_import_status: closed_as_safe_manual_import_path
  codex_session_image_import_can_generate_image_by_itself: false
  future_vcp_provider_adapter_status: reserved_for_future_design_route
  selected_real_route_status: activated_for_action_packet_preflight
  next_required_gate: v0_6_71_real_vcp_agent_generation_action_packet
```

The selected route is the existing local `NativeDoubaoImage` project plugin
surface. The route is only activated for an action packet and no-call preflight.
Real execution remains blocked until the action packet and preflight pass without
Red Lane conditions.

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
phase: v0_6_70_real_vcp_agent_generation_route_activation_gate
source_phase: v0_6_69a_exact_file_commit_readiness_gate
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
next_recommended: v0_6_71_real_vcp_agent_generation_action_packet
```
