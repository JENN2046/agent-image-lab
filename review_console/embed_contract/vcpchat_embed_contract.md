# VCPChat Embed Contract

本文定义 Review Console 未来进入 VCPChat 子窗口前必须满足的嵌入契约。它是 contract，不是实现；不创建真实 IPC handler，不创建 preload 代码，不修改真实 VCPChat，不调用 DailyNote、VCP 插件、API 或文件系统。

## Contract Status

```yaml
contract:
  name: image_lab_review_console_vcpchat_embed_contract
  version: v2.1-preflight
  status: contract_only
  real_vcpchat_modified: false
  real_vcpchat_source_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  execution_entry_created: false
```

## Channel Allowlist

允许的候选 channel 名称：

```yaml
ipc_channel_allowlist:
  - imageLabReview.loadSession
  - imageLabReview.previewDraft
  - imageLabReview.submitDraft
  - imageLabReview.cancel
```

这些名称只用于契约对齐，不代表当前已经在真实 VCPChat 中注册。

## Host To Renderer Input

host 未来只能向 Review Console renderer 提供受控草案：

```yaml
host_to_renderer:
  allowed_payload:
    review_session_draft:
      type: map
      required: true
      schema_ref: schemas/review_session.schema.yaml
  forbidden_payload:
    - api_key
    - token
    - cookie
    - password
    - private_path
    - customer_private_data
    - endpoint_raw_value
    - raw_manifest
    - raw_plugin_output
    - image_binary
```

输入必须先由 host 侧完成 schema 校验和敏感信息拦截。

## Renderer To Host Output

renderer 未来只能返回草案对象：

```yaml
renderer_to_host:
  allowed_payload:
    review_session_draft: map
    image_case_draft: map
    memory_delta_draft: map
    prototype_guard:
      api_called: false
      daily_note_called: false
      vcp_plugin_called: false
      disk_write_performed: false
      image_file_created: false
  forbidden_result:
    - daily_note_write_result
    - plugin_execution_result
    - api_response_raw
    - disk_write_result
    - image_binary_result
```

草案输出不等于真实执行完成。任何 DailyNote 写入、插件调用、API 调用、资产落盘或图片创建都必须走未来独立授权。

## Electron Invariants

```yaml
electron_invariants:
  context_isolation_required: true
  context_isolation_expected_value: true
  node_integration_allowed: false
  node_integration_expected_value: false
  preload_allowlist_required: true
  ipc_sender_validation_required: true
  origin_window_validation_required: true
  ipc_channel_allowlist_required: true
  payload_schema_validation_required: true
```

如果未来发现 `contextIsolation=false` 或 `nodeIntegration=true`，不得进入真实嵌入实现。

## Preload Allowlist Policy

preload 未来只能暴露与 Review Console 草案流相关的最小 API：

```yaml
preload_allowlist_policy:
  allowed_api_groups:
    - load_review_session_draft
    - preview_review_draft
    - submit_review_draft
    - cancel_review_session
  forbidden_api_groups:
    - filesystem_access
    - process_access
    - shell_access
    - network_access
    - daily_note_access
    - plugin_execution_access
    - secret_access
```

## Sensitive Data Rules

不得通过以下通道传递敏感信息：

- URL query。
- URL hash。
- window title。
- localStorage。
- sessionStorage。
- clipboard。
- renderer console log。
- raw IPC payload。
- crash report。
- runtime log 原文。

如发现 key、token、cookie、密码、私密路径、客户隐私、endpoint 原文或 raw 插件输出，只能保留中文脱敏拒绝摘要，不得复制原文。

## Draft Semantics

- `review_session_draft` 只是评审会话草案。
- `image_case_draft` 只是资产归档草案。
- `memory_delta_draft` 只是记忆申请草案。
- `prototype_guard` 是无执行证明字段。
- `accepted` 必须来自人工批准，AI 建议不能替代人工批准。
- `memory_approval.status != approved` 时不得进入 DailyNote 写入流程。
- `memory_delta_draft.final_decision.should_write_to_vcp=true` 也只表示写入申请，不表示已经写入。

## Rejection Conditions

出现任一情况时，未来接入必须拒绝推进：

- 真实 VCPChat 修改未获授权。
- 真实 VCPChat 源码读取未获授权。
- IPC sender 未校验。
- payload 未做 schema 校验。
- preload 暴露文件系统、网络、shell、DailyNote 或插件执行能力。
- renderer 可直接调用 API、DailyNote、VCP 插件或文件系统。
- 通过 URL、浏览器存储、剪贴板、日志或 raw IPC 传递敏感信息。
- 输出宣称已执行插件、已写 DailyNote、已创建图片或已写磁盘。

## Acceptance

- 本 contract 可被 Review Console 和未来 VCPChat 接入任务引用。
- 本 contract 不代表真实 VCPChat 已被修改。
- 本 contract 不授权读取真实外部源码。
- 本 contract 不授权真实插件执行、DailyNote 写入、API 调用或图片创建。
