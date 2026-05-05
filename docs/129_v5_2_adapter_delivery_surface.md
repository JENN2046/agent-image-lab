# v5.2 Adapter Delivery Surface Validation

## Summary

本记录把 Agent Image Lab 的 Adapter dry-run 交付面纳入机器校验。范围只包含仓库内实验 Adapter、VCPToolBox 导出级 dry-run Adapter 包、本地 fixture、README 边界说明和 placeholder config。

本批次仍是项目本地验证，不读取真实 VCPToolBox / VCPChat 源码，不读取外部真实 manifest，不调用插件、API、DailyNote，不创建图片，不写 VCP 记忆，也不授权 commit、tag、push 或 release。

## Validation Record

```yaml
status: completed_validated_project_local_v5_2_adapter_delivery_surface
version: v5.2
validation_file: scripts/validate_adapter_delivery_surface.js
adapter_file_count: 9
adapter_files_present: true
manifest_dry_run_only: true
allowed_command_dry_run_only: true
forbidden_commands_declared: true
dry_run_contract_current: true
lab_accepted_fixture_passed: true
lab_rejected_fixture_passed: true
export_accepted_stdio_passed: true
export_rejected_stdio_passed: true
no_execution_guard_verified: true
readme_boundary_current: true
config_example_secret_free: true
forbidden_runtime_calls_present: false
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

- `adapter_dry_run_lab/adapter_dry_run.js`
- `adapter_dry_run_lab/README.md`
- `adapter_dry_run_lab/fixtures/accepted_request.json`
- `adapter_dry_run_lab/fixtures/rejected_request.json`
- `adapter_dry_run_lab/fixtures/photo_studio_os_v0_7_rehearsal_request.json`
- `exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js`
- `exports/vcptoolbox/Plugin/AgentImageLabAdapter/plugin-manifest.json`
- `exports/vcptoolbox/Plugin/AgentImageLabAdapter/README.md`
- `exports/vcptoolbox/Plugin/AgentImageLabAdapter/config.env.example`

## Acceptance

```yaml
accepted_fixture_status: accepted_draft
rejected_fixture_status: rejected
selected_plugin: null
max_plugin_calls: 0
execution_blocked: true
api_called: false
vcp_plugin_called: false
daily_note_called: false
file_write_performed: false
image_file_created: false
real_execution_allowed: false
```

## Boundary

`accepted_draft` 仍然只是 dry-run 草案，不是实际执行授权。任何真实插件选择、真实生图、DailyNote 写入、VCP 记忆写入、外部仓库读取、VCPToolBox / VCPChat 修改、commit、tag、push 或 release 均需要新的单独授权。
