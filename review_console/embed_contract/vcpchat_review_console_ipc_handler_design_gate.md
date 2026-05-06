# VCPChat Review Console IPC Handler Design Gate Contract

本文定义 v7.3 Review Console 专用 IPC handler design contract。它只设计未来主进程 `imageLabReview` channel 的 sender 校验、payload 校验和 ack contract；不修改真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 代码，不调用插件、API、DailyNote 或文件系统写入。

## Contract Status

```yaml
contract:
  name: vcpchat_review_console_ipc_handler_design_gate
  version: v7.3-ipc-handler-design-gate-contract
  status: design_gate_only
  source_contracts:
    - review_console/embed_contract/vcpchat_review_console_preload_design_gate.md
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

## Allowed IPC Surface

```yaml
allowed_ipc_surface:
  namespace: imageLabReview
  channels:
    - imageLabReview.loadSession
    - imageLabReview.previewDraft
    - imageLabReview.submitDraft
    - imageLabReview.cancel
  wildcard_channels_allowed: false
  broad_passthrough_allowed: false
  side_effects_allowed: false
```

## Sender Gate

```yaml
sender_gate:
  registered_review_console_window_required: true
  sender_webcontents_match_required: true
  session_registry_match_required: true
  request_correlation_id_required: true
  unknown_sender_allowed: false
  url_query_secret_allowed: false
  hash_secret_allowed: false
  raw_private_path_allowed: false
```

## Payload Gate

```yaml
payload_gate:
  prototype_guard_required: true
  required_guard_values:
    api_called: false
    vcp_plugin_called: false
    daily_note_called: false
    disk_write_performed: false
    image_file_created: false
  forbidden_payload_content:
    raw_source_code: forbidden
    raw_private_path: forbidden
    secret_or_token: forbidden
    cookie: forbidden
    password: forbidden
    endpoint_raw: forbidden
    image_binary: forbidden
    plugin_output_raw: forbidden
```

## Ack Shape

```yaml
ack_shape:
  ack_id: string
  request_id: string
  channel: string
  session_id: string
  accepted_by_handler: boolean
  validation_passed: boolean
  rejection_reason_cn: string_or_null
  audit_summary_cn: string
  side_effects_performed: false
  next_authorization_point: map_or_null
```

## Acceptance

- 本 contract 可供 v7.4 后续设计门引用。
- 本 contract 不授权修改真实 VCPChat / VCPToolBox。
- 本 contract 不授权创建 `ipcMain.handle`、preload bridge 或 renderer mount。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
