# v6.8 VCPChat Embed Scope Review Gate

本文记录 v6.8 VCPChat Embed Scope Review Gate。该阶段只定义未来最小 VCPChat 嵌入 patch 范围提交后的人工审查门槛、通过条件、拒绝条件和下一授权点；不读取真实 VCPChat / VCPToolBox，不填写真实私密路径，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v6_8_vcpchat_embed_scope_review_gate
version: v6.8
current_phase: "v6.8 vcpchat embed scope review gate"
validation_file: scripts/validate_v6_8_vcpchat_embed_scope_review_gate.js
current_head: be4ea6e
previous_phase: "v6.7 vcpchat embed minimal patch scope"
previous_record: docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md
default_next_phase: "v6.9 VCPChat Embed Implementation Authorization Request"
review_gate_only: true
implementation_not_authorized_by_this_record: true
```

## Review Gate Goal

```yaml
review_gate_goal:
  summary_cn: "定义未来最小嵌入 patch 范围被提交后，如何人工审查是否允许进入实现授权请求。"
  primary_question_cn: "哪些范围条件必须全部通过，才允许进入下一阶段的实现授权请求。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_real_target_path_filled: true
```

## Evidence Scope

```yaml
evidence_scope:
  minimal_patch_scope: docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md
  minimal_patch_scope_contract: review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md
  implementation_preflight: docs/148_v6_6_vcpchat_embed_implementation_preflight.md
  host_bridge_contract_v2: review_console/embed_contract/host_bridge_contract_v2.md
  memory_handoff_status: review_console/embed_contract/memory_handoff_runtime_status.md
```

## Scope Review Input

```yaml
scope_review_input:
  scope_request_id: scope-v6-8-placeholder-001
  scope_request_status: placeholder_only
  source_read_authorized: false
  source_read_performed: false
  real_target_path_submitted: false
  raw_real_path_stored: false
  candidate_target_categories:
    - host_main_process
    - preload_bridge
    - renderer_mount
    - static_asset_reference
  implementation_allowed_before_review: false
```

## Required Review Checks

```yaml
required_review_checks:
  scope_is_minimal:
    required: true
    current_status: pending
  target_category_valid:
    required: true
    current_status: pending
  raw_private_path_absent:
    required: true
    current_status: passed_for_placeholder
  no_secret_or_customer_data:
    required: true
    current_status: passed_for_placeholder
  no_execution_path_added:
    required: true
    current_status: passed_for_placeholder
  electron_boundary_preserved:
    required: true
    current_status: pending_real_source_review
  rollback_plan_present:
    required: true
    current_status: pending
  validation_plan_present:
    required: true
    current_status: pending
  user_owned_change_check_planned:
    required: true
    current_status: pending
```

## Decision Routes

```yaml
decision_routes:
  approve_for_implementation_authorization_request:
    allowed_now: false
    future_conditions_cn:
      - "真实读取范围已单独授权并完成脱敏审查。"
      - "候选目标文件已脱敏填写。"
      - "scope_is_minimal、rollback_plan_present、validation_plan_present 全部通过。"
    next_state: implementation_authorization_request
  request_scope_revision:
    allowed_now: true
    reason_cn: "当前仍是占位范围，可要求补齐或缩小未来目标。"
    next_state: scope_revision_required
  reject_scope:
    allowed_now: true
    reason_cn: "如果未来范围包含真实执行、敏感信息、广泛重构或越权写入，应拒绝。"
    next_state: scope_rejected
```

## Rejection Conditions

```yaml
rejection_conditions:
  - raw_private_path_or_secret_present
  - broad_vcpchat_refactor_requested
  - plugin_execution_or_daily_note_write_in_scope
  - external_api_or_image_save_in_scope
  - target_files_unclear
  - rollback_plan_missing
  - validation_plan_missing
  - user_owned_change_check_missing
```

## Scope Review Guard

```yaml
scope_review_guard:
  implementation_authorization_granted: false
  implementation_allowed: false
  source_read_authorized: false
  source_read_performed: false
  real_target_paths_filled: false
  raw_private_path_stored: false
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  real_manifest_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  adapter_execution_entrypoint_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
```

## Acceptance Meaning

v6.8 表示未来最小 VCPChat 嵌入 patch 的范围审查门槛已经具备。它不代表范围已通过，不代表实现已授权，不代表真实源码已读取，也不代表 IPC/preload/renderer 已创建。

默认下一步是 `v6.9 VCPChat Embed Implementation Authorization Request`，继续只补实现授权请求模板；仍不得读取真实 VCPChat 或创建集成代码，除非用户进入独立硬授权点。
