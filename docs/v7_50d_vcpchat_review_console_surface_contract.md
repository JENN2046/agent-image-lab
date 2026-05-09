# v7.50d VCPChat Review Console Surface Contract

定义未来 Review Console 可接收的 surface payload contract。

### Surface input

```yaml
review_console_surface_input:
  schema_version: v1
  phase: v7_50d
  surface_id: v7_50d_vcpchat_review_console_surface_001
  source_phase: v7_50c
  source_dry_run_id: v7_50c_read_only_bridge_dry_run_001
  mode: read_only_surface
  bridge_mode: read_only
  payload_type: text_only_refs
  returned_refs_only: true
  case_id: french_summer_rattan_bag_v3_production_candidate_001
  current_case_state: closed_no_memory_write
```

### Allowed display fields

```yaml
allowed_display_fields:
  - phase
  - status
  - dry_run_type
  - bridge_mode
  - payload_type
  - returned_refs_only
  - returned_resource_refs
  - safety_gate_result
  - closed_case_checks
  - current_case_state
  - next_allowed_steps
  - hard_stops
```

### Forbidden display fields

```yaml
forbidden_display_fields:
  - image_binary
  - raw_image_file
  - raw_request_payload
  - raw_response_payload
  - api_key
  - token
  - cookie
  - provider_endpoint
  - private_absolute_path
  - full_file_content
  - dailynote_write_result
  - vcp_memory_write_result
  - production_approved_claim
```

### Surface output

```yaml
review_console_surface_output:
  schema_version: v1
  phase: v7_50d
  surface_id: v7_50d_vcpchat_review_console_surface_001
  render_mode: read_only
  status: planned
  user_actions_enabled:
    approve_memory_write: false
    write_dailynote: false
    write_vcp_memory: false
    generate_image: false
    retry_generation: false
    reopen_closed_case: false
  visible_payload_type: text_only_refs
  image_binary_rendered: false
  private_path_rendered: false
  memory_write_action_rendered: false
```
