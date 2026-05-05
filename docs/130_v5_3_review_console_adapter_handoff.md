# v5.3 Review Console Adapter Handoff Validation

## Summary

本记录把 Adapter dry-run accepted fixture 与 Review Console static prototype 的 handoff 展示草案做项目内交叉校验。

v5.3 只增加静态原型 fixture、字段映射和本地 validator。它不读取真实 VCPToolBox / VCPChat，不读取外部真实 manifest，不调用插件、API、DailyNote，不创建图片，不写 VCP 记忆，也不授权 commit、tag、push 或 release。

## Validation Record

```yaml
status: completed_validated_project_local_v5_3_review_console_adapter_handoff
version: v5.3
validation_file: scripts/validate_review_console_adapter_handoff.js
static_handoff_fixture_present: true
adapter_fixture_compared: true
accepted_draft_status_verified: true
dispatch_plan_mapped: true
gatekeeper_handoff_mapped: true
review_console_handoff_mapped: true
audit_record_mapped: true
no_execution_guard_verified: true
allowed_actions_verified: true
forbidden_actions_verified: true
static_app_draft_output_current: true
field_mapping_current: true
external_network_required: false
external_service_required: false
file_write_performed: false
real_vcpchat_source_read: false
real_vcpchat_modified: false
real_vcptoolbox_source_read: false
real_vcptoolbox_modified: false
real_manifest_read: false
api_called: false
vcp_plugin_called: false
daily_note_called: false
vcp_memory_written: false
image_file_created: false
commit_tag_push_authorized: false
```

## Checked Surface

- `review_console/static_prototype/mock_data.js`
- `review_console/static_prototype/app.js`
- `review_console/static_prototype/FIELD_MAPPING.md`
- `adapter_dry_run_lab/fixtures/accepted_request.json`
- `exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js`

## Acceptance

```yaml
adapter_handoff_status: accepted_draft
selected_plugin: null
max_plugin_calls: 0
execution_blocked: true
api_called: false
vcp_plugin_called: false
daily_note_called: false
file_write_performed: false
image_file_created: false
real_execution_allowed: false
allowed_actions:
  - mark_candidate
  - reject_candidate
  - request_gatekeeper_review
  - request_memory_edit
forbidden_actions:
  - execute_plugin
  - call_api
  - write_daily_note
  - save_image
```

## Boundary

`accepted_draft` 仍然只是 dry-run 草案可展示，不是实际执行授权。Review Console static prototype 只能展示 handoff 和审批动作草案，不得触发插件执行、API 调用、DailyNote 写入、文件写入、图片创建或长期记忆写入。
