# Host Bridge Contract v2

本文定义未来 Review Console 嵌入 VCPChat 时的 host bridge v2 contract。它只用于本仓库内 contract 对齐，不创建真实 IPC handler，不创建 preload 代码，不创建 renderer 集成代码，不修改真实 VCPChat，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: image_lab_host_bridge_contract_v2
  version: v6.3-contract-v2
  status: contract_only
  source_contracts:
    - review_console/embed_contract/vcpchat_embed_contract.md
    - review_console/embed_contract/review_console_runtime_handoff.md
    - docs/144_v6_2_runtime_state_model_alignment.md
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  real_vcptoolbox_source_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
```

## Channel Allowlist

```yaml
ipc_channel_allowlist_v2:
  load_session:
    channel: imageLabReview.loadSession
    direction: host_to_renderer
    returns: sanitized_review_session_seed
  preview_draft:
    channel: imageLabReview.previewDraft
    direction: renderer_to_host
    returns: validation_preview_ack
  submit_draft:
    channel: imageLabReview.submitDraft
    direction: renderer_to_host
    returns: host_submit_ack
  cancel:
    channel: imageLabReview.cancel
    direction: renderer_to_host
    returns: cancel_ack
```

这些 channel 只允许承载 Review Console 草案流，不允许承载插件执行、DailyNote 写入、API 调用、文件系统访问、shell 访问、secret 读取或图片二进制传输。

## Host To Renderer

```yaml
host_to_renderer:
  allowed_response_from_load_session:
    review_session_seed: map
    image_case_seed: map
    memory_preview_seed: map
    prototype_guard:
      api_called: false
      daily_note_called: false
      vcp_plugin_called: false
      disk_write_performed: false
      image_file_created: false
    host_context:
      source_kind: placeholder_or_sanitized_reference
      raw_source_included: false
      real_path_included: false
  forbidden_response_content:
    - api_key
    - token
    - cookie
    - password
    - endpoint_raw_value
    - private_path_raw_value
    - customer_private_data
    - raw_source_code
    - raw_manifest
    - raw_plugin_output
    - image_binary
```

## Renderer To Host

```yaml
renderer_to_host:
  allowed_request_for_preview_or_submit:
    review_session_draft: map
    image_case_draft: map
    memory_delta_draft: map
    prototype_guard:
      api_called: false
      daily_note_called: false
      vcp_plugin_called: false
      disk_write_performed: false
      image_file_created: false
    requested_route: review_only | archive_candidate | memory_request | cancel
  forbidden_request_content:
    - daily_note_write_result
    - plugin_execution_result
    - api_response_raw
    - disk_write_result
    - image_binary_result
    - raw_ipc_payload
    - raw_runtime_log
```

## Ack Semantics

```yaml
ack_semantics:
  preview_ack:
    validation_passed: boolean
    validation_summary_cn: string
    field_mapping_warnings_cn: list
    side_effects_performed: false
  host_submit_ack:
    accepted_by_host: boolean
    draft_received: boolean
    validation_passed: boolean
    side_effects_performed: false
    status_cn: string
  cancel_ack:
    cancelled: boolean
    side_effects_performed: false
    status_cn: string
```

ack 只能表示 host 侧 contract 校验结果或取消结果，不代表 DailyNote 已写入、插件已调用、API 已调用、文件已写入或图片已创建。

## Validation Rules

```yaml
validation_rules:
  schema_validation_required: true
  prototype_guard_required: true
  human_review_overrides_ai_required: true
  accepted_requires_human_approval: true
  memory_approval_required_for_write_request: true
  sensitive_content_rejection_required: true
  sanitized_chinese_error_required: true
  raw_value_logging_allowed: false
  side_effects_allowed: false
```

## Electron Boundary

```yaml
electron_boundary:
  contextIsolation: true
  nodeIntegration: false
  preload_exposes_minimal_allowlist_only: true
  ipc_sender_validation_required: true
  origin_window_validation_required: true
  channel_allowlist_required: true
  url_query_secret_transfer_allowed: false
  url_hash_secret_transfer_allowed: false
  browser_storage_secret_transfer_allowed: false
  clipboard_secret_transfer_allowed: false
  raw_ipc_logging_allowed: false
```

## Acceptance

- 本 contract 可供 v6.4 之后的本地 roundtrip fixture 引用。
- 本 contract 不代表真实 VCPChat 集成已经实现。
- 本 contract 不授权读取真实 VCPChat / VCPToolBox。
- 本 contract 不授权创建 IPC/preload/renderer 代码。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统或图片创建。
