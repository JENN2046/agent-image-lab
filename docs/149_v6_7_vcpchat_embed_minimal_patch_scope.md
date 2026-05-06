# v6.7 VCPChat Embed Minimal Patch Scope

本文记录 v6.7 VCPChat Embed Minimal Patch Scope。该阶段只定义未来最小 VCPChat 嵌入 patch 的范围填写模板、候选文件类别、禁止扩展项和验收边界；不读取真实 VCPChat / VCPToolBox，不填写真实私密路径，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v6_7_vcpchat_embed_minimal_patch_scope
version: v6.7
current_phase: "v6.7 vcpchat embed minimal patch scope"
validation_file: scripts/validate_v6_7_vcpchat_embed_minimal_patch_scope.js
current_head: 01859d3
previous_phase: "v6.6 vcpchat embed implementation preflight"
previous_record: docs/148_v6_6_vcpchat_embed_implementation_preflight.md
default_next_phase: "v6.8 VCPChat Embed Scope Review Gate"
scope_only: true
implementation_not_authorized_by_this_record: true
```

## Scope Goal

```yaml
scope_goal:
  summary_cn: "把未来最小 VCPChat 嵌入 patch 的目标类别、允许变更、禁止变更和验收条件写成可审查范围。"
  primary_question_cn: "未来实现时哪些文件类别可以成为候选目标，哪些行为必须保持禁止。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_real_target_path_filled: true
```

## Evidence Scope

```yaml
evidence_scope:
  implementation_preflight: docs/148_v6_6_vcpchat_embed_implementation_preflight.md
  implementation_preflight_contract: review_console/embed_contract/vcpchat_embed_implementation_preflight.md
  host_bridge_contract_v2: review_console/embed_contract/host_bridge_contract_v2.md
  runtime_delivery_surface: review_console/runtime_prototype/README.md
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
  memory_handoff_status: docs/147_v6_5_memory_handoff_runtime_status.md
```

## Minimal Patch Scope Template

```yaml
minimal_patch_scope_template:
  scope_status: placeholder_only
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_root_filled: false
  real_target_paths_filled: false
  target_files_allowed_now: []
  future_target_file_categories:
    host_main_process:
      purpose_cn: "注册受控窗口或 host side bridge 的候选入口。"
      real_path: null
      write_allowed_now: false
    preload_bridge:
      purpose_cn: "暴露最小 allowlist API 的候选 preload。"
      real_path: null
      write_allowed_now: false
    renderer_mount:
      purpose_cn: "挂载 Review Console runtime 的候选 renderer 入口。"
      real_path: null
      write_allowed_now: false
    static_asset_reference:
      purpose_cn: "引用本仓库 Review Console runtime 静态资源的候选位置。"
      real_path: null
      write_allowed_now: false
```

## Allowed Future Change Shape

```yaml
allowed_future_change_shape:
  max_patch_intent: minimal_embed_wiring
  allowed_when_authorized_later:
    - "添加或调整受控 IPC channel allowlist。"
    - "添加或调整 preload 最小 API 映射。"
    - "添加或调整 Review Console runtime 的嵌入入口。"
    - "添加或调整 host_submit_ack 的无副作用返回路径。"
  must_remain_out_of_scope:
    - "插件执行。"
    - "DailyNote 写入。"
    - "外部 API 调用。"
    - "自动保存图片。"
    - "读取或传递密钥、token、cookie、密码、endpoint 原文、私密路径或客户隐私。"
    - "大范围重构 VCPChat。"
```

## Required Future Review Fields

```yaml
required_future_review_fields:
  scope_request_id: string
  candidate_target_category: host_main_process | preload_bridge | renderer_mount | static_asset_reference
  real_target_path_redacted: string
  raw_real_path_stored: false
  intended_change_cn: string
  expected_diff_size: small
  rollback_method_cn: string
  validation_commands: list
  user_owned_change_check_result: pending
  security_review_result: pending
  implementation_allowed: false
```

## Scope Guard

```yaml
scope_guard:
  implementation_allowed: false
  target_files_allowed_now: []
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  real_manifest_read: false
  raw_source_copy_allowed: false
  raw_private_path_stored: false
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

## Boundary State

```yaml
boundary_state:
  scope_file_added: true
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

v6.7 表示未来最小 VCPChat 嵌入 patch 的范围模板已经具备。它不代表真实目标路径已填写，不代表真实源码已读取，不代表 IPC/preload/renderer 已创建。

默认下一步是 `v6.8 VCPChat Embed Scope Review Gate`，继续只审查范围模板和未来授权条件；仍不得读取真实 VCPChat 或创建集成代码，除非用户进入独立硬授权点。
