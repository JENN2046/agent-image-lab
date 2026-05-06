# v6.9 VCPChat Embed Implementation Authorization Request

本文记录 v6.9 VCPChat Embed Implementation Authorization Request。该阶段只提供未来创建真实 VCPChat 嵌入代码前的授权请求模板、必填字段、拒绝条件和硬停止点；不读取真实 VCPChat / VCPToolBox，不填写真实私密路径，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v6_9_vcpchat_embed_implementation_authorization_request
version: v6.9
current_phase: "v6.9 vcpchat embed implementation authorization request"
validation_file: scripts/validate_v6_9_vcpchat_embed_implementation_authorization_request.js
current_head: 5e9c03e
previous_phase: "v6.8 vcpchat embed scope review gate"
previous_record: docs/150_v6_8_vcpchat_embed_scope_review_gate.md
default_next_phase: "v7.0 First VCPChat Embed Runtime Patch Hard Authorization"
authorization_template_only: true
implementation_not_authorized_by_this_record: true
```

## Authorization Request Goal

```yaml
authorization_request_goal:
  summary_cn: "把未来真实创建 VCPChat 嵌入代码前必须填写和审查的授权请求固定下来。"
  primary_question_cn: "进入真实实现前，用户必须明确批准哪些目标、命令、文件范围、回退方案和验证方式。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_real_target_path_filled: true
```

## Evidence Scope

```yaml
evidence_scope:
  scope_review_gate: docs/150_v6_8_vcpchat_embed_scope_review_gate.md
  scope_review_contract: review_console/embed_contract/vcpchat_embed_scope_review_gate.md
  minimal_patch_scope: docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md
  implementation_preflight: docs/148_v6_6_vcpchat_embed_implementation_preflight.md
  host_bridge_contract_v2: review_console/embed_contract/host_bridge_contract_v2.md
```

## Authorization Request Template

```yaml
authorization_request_template:
  authorization_request_id: v6-9-implementation-request-placeholder
  request_status: template_only_not_submitted
  requested_patch_name: vcpchat_review_console_embed_minimal_patch
  requested_target_categories:
    - host_main_process
    - preload_bridge
    - renderer_mount
    - static_asset_reference
  requested_real_target_paths_redacted: []
  raw_real_paths_stored: false
  requested_commands: []
  requested_write_scope: []
  requested_validation_commands: []
  requested_rollback_method_cn: "未来必须填写可执行的 Git 回退方式。"
  implementation_authorization_granted: false
  implementation_allowed: false
```

## Required Before Submission

```yaml
required_before_submission:
  real_vcpchat_source_read_authorized: false
  real_vcpchat_source_read_completed: false
  sanitized_source_notes_available: false
  scope_request_filled: false
  scope_review_passed: false
  target_paths_redacted_and_reviewed: false
  user_owned_change_check_passed: false
  rollback_plan_reviewed: false
  validation_plan_reviewed: false
  electron_security_review_ready: false
```

## Human Authorization Checklist

```yaml
human_authorization_checklist:
  must_name_repository: true
  must_name_branch: true
  must_name_exact_files_or_redacted_paths: true
  must_name_allowed_commands: true
  must_name_forbidden_commands: true
  must_name_validation_commands: true
  must_name_rollback_plan: true
  must_confirm_no_secret_copy: true
  must_confirm_no_plugin_api_daily_note_call: true
  must_confirm_no_image_creation: true
  must_confirm_user_owned_change_policy: true
```

## Rejection Conditions

```yaml
rejection_conditions:
  - missing_real_source_read_authorization
  - missing_scope_review_pass
  - unredacted_private_path_or_secret_present
  - target_files_unclear
  - broad_refactor_requested
  - plugin_or_daily_note_or_external_api_execution_requested
  - image_creation_requested
  - rollback_plan_missing
  - validation_plan_missing
  - user_owned_change_check_missing
```

## Hard Stop Boundary

```yaml
hard_stop_boundary:
  next_phase_requires_explicit_hard_authorization: true
  hard_authorization_reason_cn: "下一阶段可能首次创建真实 VCPChat IPC/preload/renderer 集成代码。"
  current_record_authorizes_code_creation: false
  current_record_authorizes_source_read: false
  current_record_authorizes_remote_release: false
```

## Boundary State

```yaml
boundary_state:
  authorization_template_added: true
  implementation_task_authorized: false
  implementation_authorization_granted: false
  implementation_allowed: false
  runtime_code_modified: false
  adapter_code_modified: false
  tag_created: false
  package_created: false
  github_release_published: false
  release_assets_uploaded: false
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
  disk_write_runtime_performed: false
  image_file_created: false
```

## Acceptance Meaning

v6.9 表示未来真实 VCPChat 嵌入实现前的授权请求模板已经具备。它不代表授权请求已提交，不代表实现已批准，不代表真实源码已读取，也不代表 IPC/preload/renderer 已创建。

默认下一步是 `v7.0 First VCPChat Embed Runtime Patch Hard Authorization`。该阶段会越过今天的低/中风险自动推进范围，必须由用户明确填写目标和批准后才能继续。
