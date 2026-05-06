# v6.6 VCPChat Embed Implementation Preflight

本文记录 v6.6 VCPChat Embed Implementation Preflight。该阶段只把未来 VCPChat 嵌入实现前的授权门槛、目标范围、文件边界、Electron 安全条件和回退条件固定下来；不读取真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v6_6_vcpchat_embed_implementation_preflight
version: v6.6
current_phase: "v6.6 vcpchat embed implementation preflight"
validation_file: scripts/validate_v6_6_vcpchat_embed_implementation_preflight.js
current_head: 392701d
previous_phase: "v6.5 memory handoff runtime status"
previous_record: docs/147_v6_5_memory_handoff_runtime_status.md
default_next_phase: "v6.7 VCPChat Embed Minimal Patch Scope"
preflight_only: true
implementation_not_authorized_by_this_record: true
```

## Preflight Goal

```yaml
preflight_goal:
  summary_cn: "在真正创建 VCPChat 嵌入代码前，固定实现范围、授权条件、安全边界和停止条件。"
  primary_question_cn: "未来最小嵌入 patch 在动手前必须满足哪些前置条件，才能避免越权读取、越权调用或误写记忆。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_ipc_or_preload_creation: true
```

## Evidence Scope

```yaml
evidence_scope:
  vcpchat_embed_preflight: docs/80_v2_1_vcpchat_embed_preflight.md
  source_read_authorization_chain: docs/84_v2_1_real_vcpchat_read_authorization_request.md
  host_bridge_contract_v2: docs/145_v6_3_host_bridge_contract_v2.md
  adapter_roundtrip_fixture: docs/146_v6_4_adapter_review_console_roundtrip_fixture.md
  memory_handoff_status: docs/147_v6_5_memory_handoff_runtime_status.md
  embed_contract_v2: review_console/embed_contract/host_bridge_contract_v2.md
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
  runtime_delivery_surface: review_console/runtime_prototype/README.md
```

## Implementation Preflight Gate

```yaml
implementation_preflight_gate:
  implementation_task_authorized: false
  real_vcpchat_source_read_required_before_implementation: true
  real_vcpchat_source_read_authorized: false
  real_vcpchat_source_read_performed: false
  scope_fill_required: true
  scope_review_required: true
  final_human_authorization_required: true
  rollback_plan_required: true
  validation_plan_required: true
  user_owned_change_check_required: true
```

该 gate 的含义是：v6.6 只说明未来实现需要满足的门槛，不授权当前读取真实 VCPChat，也不授权当前创建集成代码。

## Future Minimal Patch Candidate

```yaml
future_minimal_patch_candidate:
  candidate_name: vcpchat_review_console_embed_minimal_patch
  candidate_status: planning_only
  target_files_allowed_now: []
  target_files_must_be_filled_later:
    - host_main_process_file_placeholder
    - preload_bridge_file_placeholder
    - renderer_mount_file_placeholder
    - review_console_asset_reference_placeholder
  code_creation_allowed_now: false
  ipc_handler_creation_allowed_now: false
  preload_creation_allowed_now: false
  renderer_creation_allowed_now: false
  implementation_patch_must_remain_minimal: true
```

## Required Future Implementation Constraints

```yaml
future_implementation_constraints:
  electron_boundary:
    contextIsolation: true
    nodeIntegration: false
    preload_exposes_minimal_allowlist_only: true
    ipc_sender_validation_required: true
    origin_window_validation_required: true
    ipc_channel_allowlist_required: true
    payload_schema_validation_required: true
    sanitized_error_required: true
    raw_ipc_payload_logging_allowed: false
  allowed_channels:
    - imageLabReview.loadSession
    - imageLabReview.previewDraft
    - imageLabReview.submitDraft
    - imageLabReview.cancel
  forbidden_renderer_capabilities:
    - direct_file_system_access
    - direct_daily_note_call
    - direct_vcp_plugin_call
    - direct_external_api_call
    - secret_storage_or_transfer
    - image_binary_creation
```

## Runtime Draft Boundary

```yaml
runtime_draft_boundary:
  allowed_input:
    - sanitized_review_session_seed
    - image_case_seed
    - memory_preview_seed
    - prototype_guard
  allowed_output:
    - review_session_draft
    - image_case_draft
    - memory_delta_draft
    - prototype_guard
    - host_submit_ack
  required_invariants:
    - "human_review 覆盖 ai_review。"
    - "accepted 必须有人工作为批准来源。"
    - "memory_approval 未 approved 时 memory_delta.write_mode 保持 draft。"
    - "should_write_to_vcp=true 只表示写入申请，不表示 DailyNote 已写入。"
    - "prototype_guard 必须保持无插件、无 API、无 DailyNote、无磁盘写入、无图片创建。"
```

## Stop Conditions

```yaml
stop_conditions:
  - condition: real_vcpchat_source_path_missing
    action_cn: "停止，不读取源码，不猜测文件位置。"
  - condition: user_owned_changes_detected_in_future_target
    action_cn: "停止，先报告冲突，不覆盖用户修改。"
  - condition: ipc_or_preload_file_unclear
    action_cn: "停止，只补范围审查，不创建代码。"
  - condition: secret_or_private_path_detected
    action_cn: "停止，只报告脱敏摘要。"
  - condition: requested_action_can_call_plugin_api_or_daily_note
    action_cn: "停止，要求独立授权。"
```

## Boundary State

```yaml
boundary_state:
  preflight_file_added: true
  implementation_task_authorized: false
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

v6.6 表示 VCPChat 嵌入实现前的门槛已经固化为 preflight。它不代表真实 VCPChat 已读取，不代表 IPC/preload/renderer 已创建，也不代表 Review Console 已嵌入真实 VCPChat。

默认下一步是 `v6.7 VCPChat Embed Minimal Patch Scope`，继续只填写未来最小 patch 的候选范围和授权条件；仍不得读取真实 VCPChat 或创建集成代码，除非用户进入独立硬授权点。
