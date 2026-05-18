# v14.174 Review Console Local Artifact Detail Drawer

```yaml
phase: v14_174_review_console_local_artifact_detail_drawer_static_only
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
execution_mode: review_console_static_detail_drawer_only
```

## Purpose

Add a local static artifact detail drawer to Review Console. The drawer shows
the selected lifecycle record's artifact path, hash, dimensions, MIME, prompt
ref, import record, review record, category index, approval status, completion
status, and blocker.

## Detail Contract

```yaml
selected_artifact_id: accepted_womens_resort_relaxed_knit_codex_v2_001
expected_selectable_count: 3
required_detail_fields:
  - artifact_ref
  - sha256
  - dimensions
  - mime
  - prompt_package_ref
  - import_record_ref
  - review_record_ref
  - category_index_ref
  - human_approval_status
  - registration_blocker
```

## Boundary

```yaml
static_detail_only: true
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

The drawer only displays already-loaded static lifecycle records. It does not
fetch, read local files, write files, write registry metadata, approve the lamp
candidate, or prove real VCP runtime integration.
