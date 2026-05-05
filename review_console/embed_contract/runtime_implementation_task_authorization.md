# Runtime Implementation Task Authorization Contract

本文定义 runtime implementation task authorization contract。它只描述未来单个 runtime integration patch 进入实现前必须持有的任务授权票据，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: runtime_implementation_task_authorization
  version: v2.8-runtime-implementation-task_authorization-template
  status: task_authorization_contract_only
  runtime_implementation_task_authorization_required: true
  runtime_implementation_task_authorization_requested: false
  runtime_implementation_task_authorization_granted: false
  runtime_implementation_planning_approved: false
  authorized_task_id: null
  authorized_file_scope_ref: null
  authorized_rollback_plan_ref: null
  authorized_validation_plan_ref: null
  ipc_handler_creation_authorized: false
  preload_runtime_creation_authorized: false
  renderer_runtime_creation_authorized: false
  real_vcpchat_modification_authorized: false
  real_execution_allowed: false
```

## Required Authorization Shape

```yaml
required_authorization_shape:
  authorization_id: string
  runtime_implementation_planning_gate_id: string
  runtime_implementation_task_authorization_required: true
  runtime_implementation_task_authorization_requested: false
  runtime_implementation_task_authorization_granted: false
  implementation_task_authorizer: null
  implementation_task_authorized_at: null
  authorized_task_id: null
  authorized_file_scope_ref: null
  authorized_rollback_plan_ref: null
  authorized_validation_plan_ref: null
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 authorization shape。

## Required Scope Shape

```yaml
required_scope_shape:
  allowed_modify_files: []
  allowed_create_files: []
  forbidden_modify_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  allowed_preload_api_names: []
  allowed_renderer_entry_points: []
  allowed_validation_commands: []
  allowed_rollback_steps: []
```

本阶段样例保持所有 scope 列表为空。未来真实实现任务授权必须逐项填写，并且不得通过单次授权覆盖多个未列明任务。

## Authorization Preconditions

```yaml
runtime_implementation_task_authorization_preconditions:
  required_before_task_authorization:
    - runtime_implementation_planning_gate_record
    - authorized_task_id
    - file_scope_ref
    - rollback_plan_ref
    - validation_plan_ref
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

本阶段样例不得把 `runtime_implementation_task_authorization_requested`、`runtime_implementation_task_authorization_granted`、`ipc_handler_creation_authorized` 或任何执行字段设为 `true`。未来即使任务授权被批准，也只覆盖授权票据列出的单个实现 patch。

## Forbidden Authorization Content

```yaml
forbidden_authorization_content:
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

## Boundary After Authorization

runtime implementation task authorization 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer runtime 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

真实实现 patch 必须作为下一独立授权点，并且只能使用任务授权票据明确列出的文件和动作。

## Acceptance

- 本 contract 只定义具体实现任务授权点。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。
