# VCPChat Preload Surface Read-only Intake Contract

本文定义 v7.1 VCPChat preload surface 只读 intake 的脱敏记录 contract。它只保存 preload 架构摘要和未来设计建议，不保存真实本机路径，不复制源码大段内容，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统写入。

## Contract Status

```yaml
contract:
  name: vcpchat_preload_surface_read_only_intake
  version: v7.1-preload-surface-intake-contract
  status: sanitized_record_only
  source_contracts:
    - review_console/embed_contract/vcpchat_read_only_intake_sanitized_record.md
    - review_console/embed_contract/vcpchat_embed_implementation_authorization_request.md
  raw_local_path_saved: false
  raw_source_code_copied: false
  source_write_performed: false
  implementation_allowed: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
```

## Allowed Record Shape

```yaml
allowed_record_shape:
  authorized_read_scope: map
  sanitized_preload_surface_findings: map
  design_implications: map
  sanitization_guard: map
  boundary_state: map
```

## Design Boundary

```yaml
design_boundary:
  may_recommend_dedicated_allowlist: true
  may_recommend_channel_names: true
  may_not_copy_source_blocks: true
  may_not_store_private_paths: true
  may_not_authorize_implementation: true
```

## Acceptance

- 本 contract 可供 v7.2 Review Console preload design gate 引用。
- 本 contract 不授权修改真实 VCPChat / VCPToolBox。
- 本 contract 不授权创建 IPC/preload/renderer 代码。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
