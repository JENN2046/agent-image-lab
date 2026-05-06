# VCPChat Review Console Preload Design Gate Contract

本文定义 v7.2 Review Console 专用 preload allowlist contract。它只设计未来 `imageLabReview` global API 和 channel payload，不修改真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统写入。

## Contract Status

```yaml
contract:
  name: vcpchat_review_console_preload_design_gate
  version: v7.2-preload-design-gate-contract
  status: design_gate_only
  source_contracts:
    - review_console/embed_contract/vcpchat_preload_surface_read_only_intake.md
    - review_console/embed_contract/host_bridge_contract_v2.md
  implementation_allowed: false
  vcpchat_code_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  image_file_created: false
```

## Allowed API Surface

```yaml
allowed_api_surface:
  global_name: imageLabReview
  methods:
    - loadSession
    - previewDraft
    - submitDraft
    - cancel
  broad_electron_api_allowed: false
  chat_api_wholesale_allowed: false
```

## Channel Allowlist

```yaml
channel_allowlist:
  - imageLabReview.loadSession
  - imageLabReview.previewDraft
  - imageLabReview.submitDraft
  - imageLabReview.cancel
```

## Forbidden Capabilities

```yaml
forbidden_capabilities:
  plugin_execution: forbidden
  external_api_call: forbidden
  daily_note_call: forbidden
  vcp_memory_write: forbidden
  file_system_write: forbidden
  image_binary_create_or_save: forbidden
  raw_private_path_transfer: forbidden
  secret_transfer: forbidden
  raw_source_logging: forbidden
```

## Acceptance

- 本 contract 可供 v7.3 IPC handler design gate 引用。
- 本 contract 不授权修改真实 VCPChat / VCPToolBox。
- 本 contract 不授权创建 IPC/preload/renderer 代码。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
