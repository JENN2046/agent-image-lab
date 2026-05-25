# v0.6.73d Real Generation Review Handoff Contract

```yaml
phase_name: v0_6_73d_real_generation_review_handoff_contract
mode: Green local review handoff contract only
source_phase: v0_6_73c_secretless_provider_receipt_contract
source_commit: 60f4e769a8de1906425d0e970998962eb6e51a3d
result: COMPLETED_VALIDATED
v0_6_73_execution_allowed: false
```

## Purpose

This gate defines the future Review Console handoff format for a NativeDoubao
one-shot generation result. It is contract-only. It does not write a review
handoff, write output, read image binaries, extract image metadata, contact a
provider, call a plugin, call an API, run VCPToolBox, run VCPChat, write
DailyNote, or write VCP memory.

## Review Handoff Contract

```yaml
review_handoff_contract_kind: native_doubao_real_generation_review_handoff_contract
future_review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
future_review_handoff_ref_under: review_console/live_receipt_bridge/
source_receipt_contract_ref: docs/vcp_integration/V0_6_73C_SECRETLESS_PROVIDER_RECEIPT_CONTRACT.md
future_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
selected_route: NativeDoubaoImage_one_shot_project_plugin
selected_plugin_id: NativeDoubaoImage
provider_id: native_doubao
model: doubao-seedream-5-0-260128
provider_binding_ref_redacted: true
provider_binding_ref_is_secret: false
human_review_required: true
review_console_required: true
review_handoff_write_allowed_now: false
review_handoff_written: false
image_binary_embedded_in_handoff_allowed: false
image_binary_read_allowed_now: false
image_metadata_extraction_allowed_now: false
output_ref_placeholder_only_now: true
sanitized_result_metadata_only: true
raw_prompt_payload_allowed: false
raw_provider_payload_allowed: false
raw_provider_response_allowed: false
secret_value_allowed: false
private_absolute_path_allowed: false
accepted_samples_write_allowed: false
production_candidate_write_allowed: false
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
```

## Allowed Future Handoff Fields

```yaml
allowed_future_handoff_fields:
  - phase_name
  - review_status
  - receipt_ref
  - selected_route
  - selected_plugin_id
  - provider_id
  - model
  - sanitized_output_refs
  - provider_binding_ref_redacted
  - provider_contact_count
  - plugin_call_count
  - api_call_count
  - image_count
  - human_review_required
  - reviewer_decision_placeholder
forbidden_future_handoff_fields:
  - raw_prompt_payload
  - raw_provider_payload
  - raw_provider_response
  - env_file_path
  - env_local_file_path
  - api_key
  - token
  - authorization_header
  - image_binary
  - private_absolute_path
```

## Non-Execution Evidence

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
VCPToolBox_runtime_performed: false
VCPChat_runtime_performed: false
image_generation_performed: false
image_binary_read_performed: false
image_metadata_extraction_performed: false
output_write_performed: false
review_handoff_write_performed: false
env_file_content_read_performed: false
env_local_file_content_read_performed: false
secret_value_read_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
v0_6_73_execution_allowed: false
next_phase_started: true
```

## Pass Conditions

```yaml
review_handoff_contract_declared: true
future_handoff_path_is_project_relative: true
future_handoff_path_under_review_console_bridge: true
human_review_receives_sanitized_metadata_only: true
review_handoff_write_allowed_now: false
image_binary_read_allowed_now: false
next_safe_phase: v0_6_73e_one_shot_execution_readiness_packet
```
