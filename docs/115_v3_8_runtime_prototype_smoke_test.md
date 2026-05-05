# 115 v3.8 Runtime Prototype Smoke Test

本文记录 v3.8 项目内 runtime prototype smoke test。该阶段只新增本地 Node 校验 harness，用 fake DOM 执行 `review_console/runtime_prototype/host_bridge_mock.js` 和 `review_console/runtime_prototype/app.js`，不读取真实 VCPChat，不读取真实 VCPToolBox，不调用插件、API、DailyNote、VCP 记忆或外部文件系统。

## Smoke Test Status

```yaml
v3_8_runtime_prototype_smoke_test:
  status: completed_validated_project_local_smoke_test
  project_runtime_smoke_test_added: true
  node_smoke_test_added: true
  headless_browser_required: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  real_vcptoolbox_source_read: false
  real_vcptoolbox_modified: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  runtime_disk_write_performed: false
  image_file_created: false
  commit_tag_push_authorized: false
```

## Test Scope

```yaml
test_scope:
  test_file: scripts/validate_runtime_prototype_smoke.js
  runtime_files_loaded:
    - review_console/runtime_prototype/host_bridge_mock.js
    - review_console/runtime_prototype/app.js
  fake_dom_used: true
  browser_required: false
  network_required: false
  external_service_required: false
```

## Assertions

```yaml
assertions:
  initial_asset_status: candidate
  initial_memory_write_mode: draft
  approved_asset_status: accepted
  approved_memory_write_mode: confirmed
  approved_should_write_to_vcp: true
  dirty_guard_rejected: true
  accepted_without_approval_rejected: true
  prototype_guard_clean: true
```

## Validation

```yaml
validation:
  node_check_smoke_test: passed
  node_smoke_test: passed
  validate_mvp: passed_after_integration
  git_diff_check: passed
```

## Boundary

```yaml
boundary:
  can_continue_project_runtime_prototype_locally: true
  can_modify_real_vcpchat: false
  can_modify_real_vcptoolbox: false
  can_call_plugin: false
  can_call_api: false
  can_write_daily_note: false
  can_write_vcp_memory: false
  can_create_image_file: false
  commit_tag_push_authorized: false
```

v3.8 提升的是本地可验证性，不授权真实 VCPChat 集成、外部执行或远程发布。
