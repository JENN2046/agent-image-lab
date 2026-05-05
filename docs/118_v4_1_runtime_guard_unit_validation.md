# 118 v4.1 Runtime Guard Unit Validation

本文记录 v4.1 项目内 runtime guard unit validation。该阶段只新增本地 Node unit harness，直接加载 `review_console/runtime_prototype/runtime_guard.js` 并验证共享 guard 的核心规则。它不读取真实 VCPChat，不读取真实 VCPToolBox，不调用插件、API、DailyNote、VCP 记忆或外部文件系统。

## Runtime Guard Unit Status

```yaml
v4_1_runtime_guard_unit_validation:
  status: completed_validated_project_local_runtime_guard_unit_validation
  runtime_guard_unit_harness_added: true
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

## Unit Scope

```yaml
unit_scope:
  unit_test_file: scripts/validate_runtime_guard_unit.js
  runtime_guard_file: review_console/runtime_prototype/runtime_guard.js
  browser_required_for_unit_test: false
  network_required: false
  external_service_required: false
```

## Assertions

```yaml
assertions:
  clean_guard_passed: true
  dirty_guard_rejected: true
  extra_key_guard_rejected: true
  clone_deep_copy_verified: true
  normalize_session_defaults_verified: true
  base_candidate_draft_safe: true
  accepted_without_approval_rejected: true
  memory_write_without_approval_rejected: true
  memory_write_with_approval_allowed_as_request: true
  dirty_audit_guard_rejected: true
  missing_required_section_rejected: true
```

## Validation

```yaml
validation:
  node_check_runtime_guard_unit: passed
  node_runtime_guard_unit: passed
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
  can_write_disk_from_runtime: false
  can_create_image_file: false
  commit_tag_push_authorized: false
```

v4.1 提升的是共享 runtime guard 的本地可测试性，不授权真实 VCPChat 集成、外部执行、DailyNote 写入或远程发布。
