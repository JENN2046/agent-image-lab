# v14.171 Review Console Lifecycle State Local Filter Controls

```yaml
phase: v14_171_review_console_lifecycle_state_local_filter_controls_static_only
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: review_console_static_ui_filter_only
```

## Purpose

Add local Review Console lifecycle filter controls so a reviewer can view all
records, recoverable accepted samples, or blocked candidates without any fetch,
file write, runtime call, accepted_samples write, or production promotion.

## Filter Contract

```yaml
allowed_filters:
  - all
  - recoverable
  - blocked
expected_visible_counts:
  all: 3
  recoverable: 2
  blocked: 1
draft_output_key: artifact_lifecycle_filter_state
filter_is_local_ui_only: true
```

## Boundary

```yaml
fetch_performed: false
file_write_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

The filter is a local UI state over already-loaded static records. It does not
read files, fetch data, write registry metadata, approve the pending lamp
candidate, or prove VCP runtime integration.
