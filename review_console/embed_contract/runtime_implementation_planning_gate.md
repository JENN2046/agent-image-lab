# Runtime Implementation Planning Gate Contract

本文定义 runtime implementation planning gate contract。它只描述未来 Review Console runtime handoff 授权后，如何进入实现规划门，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: runtime_implementation_planning_gate
  version: v2.7-runtime-implementation-planning-gate-template
  status: implementation_planning_gate_contract_only
  runtime_implementation_planning_required: true
  runtime_implementation_planning_requested: false
  runtime_implementation_planning_approved: false
  runtime_handoff_authorization_granted: false
  implementation_file_scope_declared: false
  rollback_plan_declared: false
  validation_plan_declared: false
  electron_boundary_review_completed: false
  ipc_handler_creation_authorized: false
  preload_runtime_creation_authorized: false
  renderer_runtime_creation_authorized: false
  real_vcpchat_modification_authorized: false
  real_execution_allowed: false
```

## Required Gate Shape

```yaml
required_gate_shape:
  gate_id: string
  runtime_handoff_authorization_gate_id: string
  runtime_implementation_planning_required: true
  runtime_implementation_planning_requested: false
  runtime_implementation_planning_approved: false
  implementation_planning_reviewer: null
  implementation_planning_reviewed_at: null
  implementation_file_scope_declared: false
  rollback_plan_declared: false
  validation_plan_declared: false
  electron_boundary_review_completed: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 gate shape。

## Planning Preconditions

```yaml
runtime_implementation_planning_preconditions:
  required_before_planning_approval:
    - runtime_handoff_authorization_gate_record
    - file_scope_declaration
    - rollback_plan
    - validation_plan
    - electron_boundary_review
    - no_git_storage_for_raw_values
    - human_reviewer
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

本阶段样例不得把 `runtime_implementation_planning_requested`、`runtime_implementation_planning_approved`、`ipc_handler_creation_authorized` 或任何执行字段设为 `true`。未来即使实现规划被批准，也只允许进入下一独立 runtime implementation task authorization。

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

runtime implementation planning gate 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer runtime 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义 runtime implementation planning gate。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

