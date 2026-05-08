# Phase E IPC 契约草案

本文是 Phase E 的第二项交付物：VCPChat Review Console 子窗口与主进程之间的 IPC 契约草案。它定义通道、消息 schema、错误处理和 sender 校验规则。本阶段不创建真实 IPC handler，不修改真实 VCPChat。

本文继承 `review_console/v1_1_vcpchat_review_console_contract.md` 的 IPC draft 并扩展为完整契约。

```yaml
phase_e_ipc_contract:
  status: completed_local_ipc_contract
  phase: "Phase E — IPC contract draft"
  previous: "review_console/v1_1_vcpchat_review_console_contract.md"
  real_ipc_handler_created: false
  real_vcpchat_modified: false
```

## 通道注册

```yaml
ipc_channels:
  - channel: "imageLabReview.loadSession"
    direction: "main → renderer"
    handler: "ipcMain.handle"
    allowed_in_preload: true
    max_calls_per_session: 1

  - channel: "imageLabReview.previewDraft"
    direction: "renderer → main"
    handler: "ipcMain.on"
    allowed_in_preload: true
    max_calls_per_session: unlimited (preview only)

  - channel: "imageLabReview.submitDraft"
    direction: "renderer → main"
    handler: "ipcMain.on"
    allowed_in_preload: false (Phase E/F 默认禁止)
    max_calls_per_session: 1 (仅在激活授权包后)

  - channel: "imageLabReview.cancel"
    direction: "renderer → main"
    handler: "ipcMain.on"
    allowed_in_preload: true
    max_calls_per_session: 1
```

## 消息 Schema

### loadSession

```yaml
loadSession_request:
  channel: "imageLabReview.loadSession"
  sent_by: "main process (IPC handler)"
  received_by: "renderer (review.js)"
  payload:
    session_id: string (required)
    task_id: string (required)
    case_id: string (required)
    project: string (required)
    review_session: map (required, 受控 review_session 草案)
  response:
    status: "loaded" | "error"
    session_id: string
    loaded_at: string (ISO timestamp)

loadSession_constraints:
  - "payload 不包含图片二进制"
  - "payload 不包含 raw plugin output"
  - "session_id 必须与 session_fingerprint 匹配"
  - "renderer 不持久化 session 到 disk 或 localStorage"
```

### previewDraft

```yaml
previewDraft_request:
  channel: "imageLabReview.previewDraft"
  sent_by: "renderer (review.js)"
  received_by: "main process (IPC handler)"
  payload:
    review_session_draft: map
    image_case_draft: map
    memory_delta_draft: map
    memory_completion_state_draft: map
    accepted_candidate_delivery_package_draft: map
    human_override_traceability_draft: map
    inactive_authorization_capsules_draft: map
    runtime_review_state_draft: map
    local_commit_scope_plan_draft: map
    bridge_mock_roundtrip_candidate_draft: map
    real_bridge_authorization_package_draft: map
    plugin_reliability_prompt_discipline_draft: map
    memory_write_completion_candidate_draft: map
    single_real_generation_retry_gate_draft: map
    real_memory_write_authorization_package_draft: map
    asset_archive_candidate_draft: map
    traceability_items: list
    traceability_counts: map
    traceability_summary_cn: string
    traceability_boundary_cn: string
    prototype_guard:
      api_called: false
      daily_note_called: false
      vcp_plugin_called: false
      disk_write_performed: false
      image_file_created: false
  response:
    status: "previewed" | "rejected"
    accepted_by_host_mock: true | false
    validation_passed: true | false
    side_effects_performed: false
    previewed_at: string (ISO timestamp)

previewDraft_constraints:
  - "host ack 中 side_effects_performed 必须为 false"
  - "prototype_guard 五个 flag 必须全部为 false"
  - "主进程校验后不得触发 DailyNote/API/插件/文件写入/图片创建"
  - "响应不含 raw IPC payload/runtime log/endpoint/源码/敏感值"
```

### submitDraft（默认禁止）

```yaml
submitDraft_request:
  channel: "imageLabReview.submitDraft"
  status: "PERMANENTLY_BLOCKED_IN_PHASE_E"
  activation: "需要 A5 active authorization package + preflight 通过"

submitDraft_rules:
  - "Phase E/F 默认返回 rejected，不执行任何写入"
  - "仅在 A5 授权包激活且 max_submitDraft_calls=1 时打开"
  - "执行后 authorization package 即被消耗"
  - "任何情况下不把图片二进制写入 Git 或 VCP memory"
```

### cancel

```yaml
cancel_request:
  channel: "imageLabReview.cancel"
  sent_by: "renderer (review.js)"
  received_by: "main process (IPC handler)"
  payload:
    reason: string (optional, 中文脱敏)
  response:
    status: "cancelled"
    cancelled_at: string (ISO timestamp)

cancel_constraints:
  - "不产生副作用"
  - "不清除主进程状态（仅标记取消）"
  - "不写入 DailyNote/VCP memory"
```

## Sender 校验

```yaml
sender_validation:
  rule_1:
    name: "来源窗口校验"
    check: "event.senderFrame 或 webContents.id 匹配已注册的 ImageLab Review 窗口"
    on_failure: "拒绝请求，返回 error，不执行任何 handler 逻辑"

  rule_2:
    name: "allowlist 通道校验"
    check: "channel 必须在已注册的 allowlist 中"
    on_failure: "拒绝请求，返回 'unknown channel'"

  rule_3:
    name: "payload 大小校验"
    check: "payload JSON 序列化后不超过 1MB"
    on_failure: "拒绝请求，返回 'payload too large'"

  rule_4:
    name: "禁止字段扫描"
    check: "payload 不包含 key/token/secret/password/endpoint/private_path 模式"
    on_failure: "拒绝请求，返回 'forbidden field detected'"

  rule_5:
    name: "guard 校验"
    check: "previewDraft 的 prototype_guard 五个 flag 必须全部为 false"
    on_failure: "拒绝请求，返回 'dirty guard detected'"
```

## 错误处理

```yaml
error_responses:
  invalid_session:
    code: "ERR_INVALID_SESSION"
    message_cn: "会话草案无效或已过期"
  forbidden_channel:
    code: "ERR_FORBIDDEN_CHANNEL"
    message_cn: "该 IPC 通道当前被禁止"
  dirty_guard:
    code: "ERR_DIRTY_GUARD"
    message_cn: "草案包含脏 guard 标记，可能已触发副作用"
  forbidden_field:
    code: "ERR_FORBIDDEN_FIELD"
    message_cn: "payload 包含禁止字段"
  sender_invalid:
    code: "ERR_SENDER_INVALID"
    message_cn: "IPC sender 校验失败"
  submitDraft_blocked:
    code: "ERR_SUBMITDRAFT_BLOCKED"
    message_cn: "submitDraft 当前被禁止，需要 active authorization package"

error_rules:
  - "错误消息必须是中文脱敏摘要"
  - "不返回 raw stack trace、raw path、raw endpoint 或 raw plugin output"
  - "不在错误消息中暴露内部文件路径"
  - "错误码固定，不动态生成"
```

## Preload Allowlist

```yaml
preload_allowlist:
  exposed_api:
    imageLabReview:
      loadSession: "ipcRenderer.invoke"
      previewDraft: "ipcRenderer.send"
      cancel: "ipcRenderer.send"
      # submitDraft 不在 preload allowlist 中
  not_exposed:
    - "fs (文件系统)"
    - "child_process"
    - "fetch / XMLHttpRequest"
    - "localStorage / sessionStorage (审片数据)"
    - "indexedDB"
    - "webRequest"
```

## 契约兼容性

```yaml
compatibility:
  with:
    - "review_console/v1_1_vcpchat_review_console_contract.md (IPC draft)"
    - "review_console/v1_6_embed_boundary_contract.md (embed boundary)"
    - "review_console/runtime_prototype/host_bridge_mock.js (mock bridge)"
    - "review_console/runtime_prototype/runtime_guard.js (shared guard)"
  mock_bridge_alignment:
    loadSession: "mock 与真实 IPC 使用相同的 session schema"
    previewDraft: "mock ack 字段与真实 IPC response 字段一致"
    submitDraft: "mock 与真实 IPC 均默认返回 rejected"
```

## 验收标准（本 Phase E）

```yaml
phase_e_ipc_acceptance:
  four_channels_defined: true
  each_channel_has_schema: true
  sender_validation_rules_complete: true
  error_handling_rules_complete: true
  preload_allowlist_defined: true
  submitDraft_permanently_blocked: true
  compatibility_with_existing_contracts: true
  no_real_ipc_handler_created: true
  no_real_vcpchat_modified: true
```
