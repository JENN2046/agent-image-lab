# VCPChat Embed Implementation Preflight Contract

本文定义未来 VCPChat 嵌入实现前的 preflight contract。它只用于本仓库内规划和验收，不创建真实 IPC handler，不创建 preload 代码，不创建 renderer 集成代码，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: vcpchat_embed_implementation_preflight
  version: v6.6-preflight-contract
  status: preflight_only
  source_contracts:
    - review_console/embed_contract/vcpchat_embed_contract.md
    - review_console/embed_contract/host_bridge_contract_v2.md
    - review_console/embed_contract/memory_handoff_runtime_status.md
    - docs/147_v6_5_memory_handoff_runtime_status.md
  implementation_task_authorized: false
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

## Required Authorization Inputs

```yaml
required_authorization_inputs:
  target_vcpchat_root:
    required_later: true
    value_now: null
    raw_private_path_allowed_now: false
  allowed_read_paths:
    required_later: true
    value_now: []
  allowed_write_paths:
    required_later: true
    value_now: []
  implementation_objective_cn:
    required_later: true
    value_now: "仅规划未来最小嵌入 patch，不创建代码。"
  rollback_plan_cn:
    required_later: true
    value_now: "未来 patch 必须能通过普通 Git revert 回退。"
  validation_plan:
    required_later: true
    value_now:
      - node_check
      - local_runtime_guard
      - electron_security_review
```

## Future Channel Binding

```yaml
future_channel_binding:
  load_session:
    channel: imageLabReview.loadSession
    implementation_status_now: not_created
    allowed_payload: sanitized_review_session_seed
  preview_draft:
    channel: imageLabReview.previewDraft
    implementation_status_now: not_created
    allowed_payload: runtime_draft_bundle
  submit_draft:
    channel: imageLabReview.submitDraft
    implementation_status_now: not_created
    allowed_payload: runtime_draft_bundle
  cancel:
    channel: imageLabReview.cancel
    implementation_status_now: not_created
    allowed_payload: cancel_request
```

## Required Future Safety Review

```yaml
required_future_safety_review:
  context_isolation_confirmed: false
  node_integration_disabled_confirmed: false
  preload_allowlist_reviewed: false
  ipc_sender_validation_reviewed: false
  origin_window_validation_reviewed: false
  payload_schema_validation_reviewed: false
  raw_payload_logging_blocked: false
  url_secret_transfer_blocked: false
  renderer_direct_side_effects_blocked: false
```

这些字段目前保持 false，因为 v6.6 没有读取真实 VCPChat，也没有检查真实 Electron 配置。未来只有在独立授权读取后，才能把审查结果推进。

## Forbidden Current Actions

```yaml
forbidden_current_actions:
  create_ipc_handler: forbidden
  create_preload_bridge: forbidden
  create_renderer_mount: forbidden
  modify_real_vcpchat: forbidden
  read_real_vcpchat_source: forbidden
  read_real_vcptoolbox_source: forbidden
  call_plugin: forbidden
  call_api: forbidden
  call_daily_note: forbidden
  write_vcp_memory: forbidden
  create_image_file: forbidden
```

## Acceptance

- 本 contract 可供未来 v6.7 范围填写引用。
- 本 contract 不代表真实 VCPChat 集成已经实现。
- 本 contract 不授权读取真实 VCPChat / VCPToolBox。
- 本 contract 不授权创建 IPC/preload/renderer 代码。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆、文件系统写入或图片创建。
