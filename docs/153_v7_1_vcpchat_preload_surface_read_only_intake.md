# v7.1 VCPChat Preload Surface Read-only Intake

本文记录 v7.1 VCPChat preload surface 的精确只读 intake。该阶段只读取已授权的 preload 相关文件并保存脱敏结构摘要；不保存真实本机路径，不复制源码大段内容，不修改真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v7_1_vcpchat_preload_surface_read_only_intake
version: v7.1
current_phase: "v7.1 vcpchat preload surface read-only intake"
validation_file: scripts/validate_v7_1_vcpchat_preload_surface_read_only_intake.js
current_head: d1bcf01
previous_phase: "v7.0 vcpchat read-only intake sanitized record"
previous_record: docs/152_v7_0_vcpchat_read_only_intake_sanitized_record.md
default_next_phase: "v7.2 VCPChat Review Console Preload Design Gate"
sanitized_record_only: true
implementation_not_authorized_by_this_record: true
```

## Authorized Read Scope

```yaml
authorized_read_scope:
  target_repository_name: VCPChat
  target_local_root_redacted: "<VCPCHAT_LOCAL_ROOT_REDACTED>"
  target_branch_observed: main
  target_head_short: c97ff0c
  files_observed:
    - modules/services/preloadPaths.js
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - preloads/chat.js
  source_read_authorized: true
  authorized_preload_surface_observation_completed: true
  source_read_only: true
  source_write_performed: false
```

## Sanitized Preload Surface Findings

```yaml
sanitized_preload_surface_findings:
  preload_role_resolver:
    file_summary: modules/services/preloadPaths.js
    roles_observed:
      - CHAT
      - DESKTOP
      - UTILITY
    mapping_summary_cn: "role 会映射到 preloads/{role}.js。"
  api_factory:
    file_summary: preloads/shared/apiFactory.js
    exposed_helpers:
      - command
      - query
      - subscription
      - createOps
      - materializeApi
      - createCompatApi
      - exposeRoleApis
    bridge_summary_cn: "apiFactory 集中封装 ipcRenderer invoke/send/subscribe，并通过 contextBridge 暴露 role API、compat electronAPI 和 path API。"
  shared_roles:
    file_summary: preloads/shared/roles.js
    role_key_groups:
      - SHARED_KEYS
      - CHAT_KEYS
      - DESKTOP_KEYS
      - UTILITY_KEYS
    chat_role_is_broad: true
    chat_role_contains_vcp_transport_keys: true
    utility_role_contains_note_and_image_keys: true
  chat_preload:
    file_summary: preloads/chat.js
    exposed_role_api_name: chatAPI
    exposed_compat_api_name: electronAPI
    exposes_path_api: true
    has_local_allowed_keys: true
    appears_standalone_or_legacy_copy_of_shared_pattern: true
  image_lab_channels_found:
    imageLabReview_loadSession: false
    imageLabReview_previewDraft: false
    imageLabReview_submitDraft: false
    imageLabReview_cancel: false
```

## Design Implications

```yaml
design_implications:
  review_console_should_not_reuse_broad_electron_api: true
  recommended_future_shape: dedicated_review_console_allowlist
  recommended_future_api_name: imageLabReview
  recommended_future_channel_group:
    - imageLabReview.loadSession
    - imageLabReview.previewDraft
    - imageLabReview.submitDraft
    - imageLabReview.cancel
  recommended_gate_cn: "下一阶段先设计专用 Review Console preload allowlist，不直接接入 sendToVCP、文件读取、DailyNote 或图片保存能力。"
```

## Sanitization Guard

```yaml
sanitization_guard:
  raw_local_path_saved: false
  raw_source_code_copied: false
  env_file_read: false
  config_env_read: false
  secret_file_read: false
  token_or_cookie_read: false
  package_scripts_executed: false
  npm_install_executed: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
```

## Boundary State

```yaml
boundary_state:
  sanitized_record_added: true
  implementation_task_authorized: false
  implementation_allowed: false
  runtime_code_modified: false
  vcpchat_code_modified: false
  vcptoolbox_code_modified: false
  tag_created: false
  package_created: false
  github_release_published: false
  release_assets_uploaded: false
  vcpchat_preload_surface_intake_completed: true
  vcpchat_preload_surface_intake_limited_to_authorized_scope: true
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

v7.1 表示已授权的 VCPChat preload surface 精确只读 intake 结果已被脱敏记录。它不代表真实 VCPChat 被修改，不代表 Review Console preload 已设计完成，也不代表 IPC/preload/renderer 已创建。

默认下一步是 `v7.2 VCPChat Review Console Preload Design Gate`，只设计专用 allowlist 和 channel 绑定；继续不写真实 VCPChat。
