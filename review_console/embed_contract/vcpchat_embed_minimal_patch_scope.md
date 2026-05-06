# VCPChat Embed Minimal Patch Scope Contract

本文定义未来 VCPChat 嵌入最小 patch 的范围 contract。它只描述候选文件类别和未来授权填写字段，不读取真实 VCPChat / VCPToolBox，不保存真实路径，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: vcpchat_embed_minimal_patch_scope
  version: v6.7-scope-contract
  status: scope_only
  source_contracts:
    - review_console/embed_contract/vcpchat_embed_implementation_preflight.md
    - review_console/embed_contract/host_bridge_contract_v2.md
    - review_console/embed_contract/memory_handoff_runtime_status.md
  implementation_allowed: false
  source_read_authorized: false
  source_read_performed: false
  real_target_paths_filled: false
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
```

## Candidate Target Categories

```yaml
candidate_target_categories:
  host_main_process:
    expected_role_cn: "未来可能承载 BrowserWindow、IPC 注册或 host bridge 调度。"
    current_real_path: null
    current_write_allowed: false
  preload_bridge:
    expected_role_cn: "未来可能暴露 contextBridge 最小 allowlist。"
    current_real_path: null
    current_write_allowed: false
  renderer_mount:
    expected_role_cn: "未来可能挂载 Review Console runtime 入口。"
    current_real_path: null
    current_write_allowed: false
  static_asset_reference:
    expected_role_cn: "未来可能引用 Review Console runtime 静态资源。"
    current_real_path: null
    current_write_allowed: false
```

## Future Scope Request Shape

```yaml
future_scope_request_shape:
  scope_request_id: string
  candidate_target_category: string
  real_target_path_redacted: string
  raw_real_path_stored: false
  intended_change_cn: string
  expected_diff_size: small
  rollback_method_cn: string
  validation_commands: list
  implementation_allowed: false
```

## Forbidden Scope Expansion

```yaml
forbidden_scope_expansion:
  broad_vcpchat_refactor: forbidden
  dependency_change: forbidden
  plugin_execution_path: forbidden
  daily_note_write_path: forbidden
  external_api_path: forbidden
  file_system_write_generalization: forbidden
  image_generation_or_save_path: forbidden
  secret_or_private_path_transfer: forbidden
  raw_source_logging: forbidden
```

## Acceptance

- 本 contract 可供 v6.8 范围审查引用。
- 本 contract 不授权读取真实 VCPChat / VCPToolBox。
- 本 contract 不授权填写真实私密路径。
- 本 contract 不授权创建 IPC/preload/renderer 代码。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
