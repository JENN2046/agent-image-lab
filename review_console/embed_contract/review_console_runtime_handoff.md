# Review Console Runtime Handoff Contract

本文定义 Review Console runtime handoff contract。它只描述未来如何把脱敏草案和 route-specific authorization gate 结果交给 runtime planning，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: review_console_runtime_handoff
  version: v2.6-runtime-handoff-plan-template
  status: runtime_handoff_contract_only
  runtime_handoff_planning_required: true
  runtime_handoff_planning_completed: false
  runtime_handoff_authorized: false
  route_specific_authorization_granted: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
  real_execution_allowed: false
```

## Allowed Input Shape

```yaml
allowed_input_shape:
  review_session_draft:
    type: map
    required: true
  image_case_draft:
    type: map
    required: true
  memory_delta_draft:
    type: map
    required: true
  prototype_guard:
    type: map
    required: true
  route_specific_authorization_gate_ref:
    type: string
    required: true
```

输入只能是草案对象或记录引用，不得携带 raw source、真实路径、真实读取命令、endpoint 原文、环境变量值、secret、客户隐私、raw runtime log、raw IPC payload 或 raw plugin output。

## Allowed Output Shape

```yaml
allowed_output_shape:
  runtime_handoff_plan: map
  embed_boundary_notes: map
  schema_mapping_notes: map
  authorization_gap_list: list
  chinese_audit_summary: string
```

输出只允许用于规划、映射和人工审计，不得表示真实 VCPChat 修改、真实 IPC handler 创建、DailyNote 写入、插件调用、API 调用或图片创建。

## Handoff Preconditions

```yaml
runtime_handoff_preconditions:
  required_before_handoff:
    - post_read_decision_routing_record
    - route_specific_authorization_gate_record
    - schema_mapping_review
    - no_git_storage_for_raw_values
    - electron_boundary_review
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

本阶段样例不得把 `runtime_handoff_planning_completed`、`runtime_handoff_authorized`、`route_specific_authorization_granted` 或任何执行字段设为 `true`。未来即使 handoff planning 完成，也只允许进入下一独立 runtime implementation planning 授权点。

## Forbidden Handoff Content

```yaml
forbidden_handoff_content:
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

## Electron Boundary Reminder

未来 runtime implementation planning 必须重新确认：

- `contextIsolation=true`
- `nodeIntegration=false`
- preload 只暴露最小 allowlist API。
- IPC sender 必须校验来源窗口。
- renderer 不得直接调用 API、DailyNote、VCP 插件或文件系统。
- 不得通过 URL、浏览器存储、剪贴板或日志传递敏感信息。

## Acceptance

- 本 contract 只定义 Review Console runtime handoff planning。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

