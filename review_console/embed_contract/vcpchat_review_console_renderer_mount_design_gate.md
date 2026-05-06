# VCPChat Review Console Renderer Mount Design Gate Contract

本文定义 v7.4 Review Console renderer mount design contract。它只设计未来 renderer mount、host bridge mock 和 runtime 挂载边界；不修改真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统写入。

## Contract Status

```yaml
contract:
  name: vcpchat_review_console_renderer_mount_design_gate
  version: v7.4-renderer-mount-design-gate-contract
  status: design_gate_only
  source_contracts:
    - review_console/embed_contract/vcpchat_review_console_preload_design_gate.md
    - review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md
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

## Renderer Mount Surface

```yaml
renderer_mount_surface:
  future_mount_root_id: image-lab-review-root
  future_global_dependency: imageLabReview
  isolated_surface_required: true
  auto_mount_into_chat_surface_allowed: false
  broad_dom_scraping_allowed: false
  direct_vcpchat_state_mutation_allowed: false
```

## Host Bridge Mock Surface

```yaml
host_bridge_mock_surface:
  mock_contract_source: review_console/runtime_prototype/host_bridge_mock.js
  future_real_bridge_global_name: imageLabReview
  methods:
    - loadSession
    - previewDraft
    - submitDraft
    - cancel
  side_effects_allowed: false
  external_api_call_allowed: false
  daily_note_call_allowed: false
  plugin_call_allowed: false
  disk_write_allowed: false
  image_file_create_allowed: false
```

## Runtime Boundary

```yaml
runtime_boundary:
  allowed_inputs:
    - review_session_seed
    - image_case_seed
    - memory_preview_seed
    - prototype_guard
  allowed_outputs:
    - review_session_draft
    - image_case_draft
    - memory_delta_draft
    - prototype_guard
    - requested_route
  required_guard_values:
    api_called: false
    vcp_plugin_called: false
    daily_note_called: false
    disk_write_performed: false
    image_file_created: false
```

## Acceptance

- 本 contract 可供 v7.5 真实实现授权门槛引用。
- 本 contract 不授权修改真实 VCPChat / VCPToolBox。
- 本 contract 不授权创建 renderer mount、preload bridge 或 `ipcMain.handle`。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
