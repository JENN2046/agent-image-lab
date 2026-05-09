# v7.50c VCP Read-only Bridge Dry-run Contract

定义未来 dry-run 的 request / response contract。

## Request

```yaml
dry_run_request:
  schema_version: v1
  phase: v7_50c
  dry_run_id: v7_50c_read_only_bridge_dry_run_001
  bridge_mode: read_only
  requested_by: human_operator
  source_repo: JENN2046/agent-image-lab
  case_id: french_summer_rattan_bag_v3_production_candidate_001
  requested_resources:
    - project_state
    - production_candidate_review
    - memory_write_skip_closeout
    - bridge_contract
    - bridge_security_gates
    - memory_boundary
  write_intent: false
  image_binary_requested: false
  secrets_requested: false
  raw_payload_requested: false
  private_absolute_path_requested: false
```

## Response

```yaml
dry_run_response:
  schema_version: v1
  phase: v7_50c
  dry_run_id: v7_50c_read_only_bridge_dry_run_001
  bridge_mode: read_only
  status: ok | blocked | failed
  payload_type: text_only_refs
  returned_refs_only: true
  image_binary_included: false
  secrets_included: false
  raw_payload_included: false
  private_absolute_path_included: false
  write_performed: false
  memory_write_performed: false
  daily_note_write_performed: false
  vcp_call_performed: false
  vcpchat_bridge_call_performed: false
```

## Forbidden Dry-run Outputs

- image_binary
- raw_image_file
- API key
- token
- cookie
- raw_request_payload
- raw_response_payload
- provider_endpoint
- private_absolute_path
- DailyNote write result
- VCP memory write result
- production_approved claim
- reopened closed_no_memory_write claim
