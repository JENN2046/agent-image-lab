# Execute-once Authorization Request Template Contract

本文定义真实 VCPChat 一次性读取执行授权请求模板的 contract。它只描述未来执行一次只读读取时的授权请求记录形态，不读取真实源码，不保存真实路径，不保存真实命令，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: execute_once_authorization_request_template
  version: v2.3-execute-once-request-template
  status: execute_once_authorization_request_template_only
  execute_once_authorization_requested: false
  execute_once_authorization_granted: false
  one_time_read_authorized: false
  execution_preflight_passed: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  read_command_bound: false
  read_command_executed: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

## Required Request Shape

```yaml
required_request_shape:
  request_id: string
  based_on_preplan_packet_id: string
  execute_once_authorization_required: true
  execute_once_authorization_requested: false
  execute_once_authorization_granted: false
  authorization_status: pending_execute_once_authorization_request
  authorized_by: null
  authorized_at: null
  read_scope_ref: redacted_allowlist_reference
  read_command_ref: redacted_read_command_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、真实读取命令、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 request shape。

## Approval Preconditions

```yaml
approval_preconditions:
  required_before_granting:
    - human_authorizer_present
    - authorization_time_present
    - redacted_allowlist_reference_confirmed
    - redacted_read_command_reference_confirmed
    - stop_conditions_confirmed
    - read_attempt_limit_confirmed
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

本阶段样例不得把 `execute_once_authorization_granted` 设为 `true`。未来即使授权请求获批，也只允许进入下一独立命令绑定 preflight，不得自动读取源码。

## Forbidden Request Content

```yaml
forbidden_request_content:
  - real_local_path
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

## Boundary After Request

授权请求完成后也不得自动进入：

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

- 本 contract 只定义一次性读取执行授权请求模板。
- 本 contract 不执行真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

