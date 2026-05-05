# Runtime Handoff Authorization Gate Contract

本文定义 runtime handoff authorization gate contract。它只描述未来 Review Console runtime handoff planning 如何进入独立授权门，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: runtime_handoff_authorization_gate
  version: v2.6-runtime-handoff-authorization-gate-template
  status: authorization_gate_contract_only
  runtime_handoff_authorization_required: true
  runtime_handoff_authorization_requested: false
  runtime_handoff_authorization_granted: false
  runtime_handoff_planning_completed: false
  route_specific_authorization_granted: false
  implementation_planning_authorized: false
  ipc_handler_creation_authorized: false
  preload_runtime_creation_authorized: false
  renderer_runtime_creation_authorized: false
  real_vcpchat_modification_authorized: false
  daily_note_write_authorized: false
  vcp_memory_write_authorized: false
  asset_write_authorized: false
  real_execution_allowed: false
```

## Required Gate Shape

```yaml
required_gate_shape:
  gate_id: string
  handoff_id: string
  runtime_handoff_authorization_required: true
  runtime_handoff_authorization_requested: false
  runtime_handoff_authorization_granted: false
  runtime_handoff_authorizer: null
  runtime_handoff_authorized_at: null
  implementation_planning_authorized: false
  ipc_handler_creation_authorized: false
  preload_runtime_creation_authorized: false
  renderer_runtime_creation_authorized: false
  real_vcpchat_modification_authorized: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 gate shape。

## Authorization Preconditions

```yaml
runtime_handoff_authorization_preconditions:
  required_before_authorization:
    - route_specific_authorization_gate_record
    - runtime_handoff_plan_record
    - schema_mapping_review
    - electron_boundary_review
    - no_git_storage_for_raw_values
    - human_authorizer
  still_not_allowed:
    - real_vcpchat_source_read
    - real_vcpchat_modified
    - ipc_handler_created
    - preload_runtime_code_created
    - renderer_runtime_code_created
    - api_called
    - daily_note_called
    - vcp_memory_written
```

本阶段样例不得把 `runtime_handoff_authorization_requested`、`runtime_handoff_authorization_granted`、`implementation_planning_authorized` 或任何执行字段设为 `true`。未来即使授权门被批准，也只允许进入下一独立 runtime implementation planning gate。

## Forbidden Gate Content

```yaml
forbidden_gate_content:
  - real_local_path
  - raw_allowlist_path
  - raw_read_command
  - shell_command_text
  - raw_source_code
  - complete_function_body
  - endpoint_raw_value
  - env_value
  - secret_raw_value
  - private_path_raw_value
  - customer_private_data
  - raw_runtime_log
  - raw_ipc_payload
  - raw_plugin_output
  - image_binary
```

## Boundary After Gate

runtime handoff authorization gate 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer runtime 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义 runtime handoff 授权门。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

