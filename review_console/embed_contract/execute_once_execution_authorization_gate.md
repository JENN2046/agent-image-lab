# Execute-once Execution Authorization Gate Contract

本文定义真实 VCPChat 一次性读取执行授权门的 contract。它只描述未来执行读取命令前的最后授权记录形态，不读取真实源码，不保存真实路径，不保存真实命令，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: execute_once_execution_authorization_gate
  version: v2.4-execution-authorization-gate-template
  status: execution_authorization_gate_template_only
  execution_authorization_required: true
  execution_authorization_requested: false
  execution_authorization_granted: false
  manual_parameter_review_passed: false
  parameter_integrity_confirmed: false
  one_time_read_attempt_authorized: false
  source_read_authorized: false
  source_read_performed: false
  read_command_executed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Required Gate Shape

```yaml
required_gate_shape:
  gate_id: string
  review_gate_id: string
  execution_authorization_required: true
  execution_authorization_requested: false
  execution_authorization_granted: false
  execution_authorizer: null
  execution_authorized_at: null
  one_time_read_attempt_authorized: false
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 gate shape。

## Execution Authorization Preconditions

```yaml
execution_authorization_preconditions:
  required_before_authorization:
    - manual_parameter_review_gate
    - parameter_integrity_confirmation_outside_git
    - external_read_scope_reference
    - external_read_command_reference
    - one_time_read_attempt_boundary
    - post_read_sanitization_route
  still_not_allowed:
    - read_command_executed
    - source_read_performed
    - raw_source_copied
    - vcpchat_modified
    - ipc_handler_created
    - preload_runtime_code_created
    - api_called
    - daily_note_called
```

本阶段样例不得把 `execution_authorization_granted` 或 `one_time_read_attempt_authorized` 设为 `true`。未来即使执行授权门通过，也只允许进入下一独立真实读取运行授权，不得由文档、contract 或 Review Console 自动执行读取命令。

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

## Boundary After Execution Authorization

执行授权门记录完成后也不得自动进入：

- 真实 VCPChat 源码读取。
- 读取命令执行。
- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义一次性读取执行授权门。
- 本 contract 不执行真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

