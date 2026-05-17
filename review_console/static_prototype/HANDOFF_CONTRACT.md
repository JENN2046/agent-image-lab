# Review Console Static Handoff Contract

```yaml
contract_id: v14_152_review_console_handoff_contract
mode: static_child_window_data_contract
runtime_integration: false
child_window_runtime_allowed: false
ipc_channel_allowed: false
preload_script_allowed: false
renderer_integration_allowed: false
fetch_allowed: false
file_write_allowed: false
vcpchat_integration: false
vcptoolbox_integration: false
real_manifest_read_allowed: false
```

## Data Envelope

```yaml
handoff_envelope:
  accepted_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001
  import_record_ref: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json
  review_record_ref: docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md
  accepted_registry_ref: accepted_samples/accepted_sample_registry.yaml
  category_index_ref: accepted_samples/categories/fashion_lookbook_portrait.yaml
  recoverability_suite_ref: scripts/run_v14_local_regression_suite.js
  dry_run_vcp_adapter_contract_ref: integrations/vcp/dry_run_vcp_adapter_contract_v1.yaml
  authorization_package_compiler_ref: scripts/compile_v14_149_authorization_packages.js
```

## Display-Only Responsibilities

```yaml
display_only_actions:
  - display_artifact_recoverability_evidence
  - display_import_record_summary
  - display_review_record_summary
  - display_human_approval_status
  - display_category_index_status
  - display_dry_run_vcp_handoff_status
  - display_authorization_package_draft_status
  - request_human_review
```

## Forbidden Runtime Responsibilities

```yaml
forbidden_actions:
  - create_ipc_channel
  - create_preload_script
  - create_renderer_integration
  - fetch_remote_data
  - write_local_or_remote_files
  - read_real_manifest
  - read_real_vcpchat
  - read_real_vcptoolbox
  - call_provider_api_plugin_or_mcp
  - generate_image
  - write_dailynote
  - write_vcp_memory
  - write_production_candidate
  - write_failure_samples
```

## Non-Execution Evidence

```yaml
authorization_granted_by_this_record: false
child_window_runtime_created: false
ipc_channel_created: false
preload_script_created: false
renderer_integration_created: false
fetch_performed: false
file_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

This handoff contract is only a static data interface. It does not prove or
perform VCP runtime integration.
