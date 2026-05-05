# Execute-once Final Read Authorization Gate Contract

本文定义真实 VCPChat 一次性读取最终授权门的 contract。它只描述未来读取前最后一道人工授权记录形态，不读取真实源码，不保存真实路径，不保存真实命令，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: execute_once_final_read_authorization_gate
  version: v2.3-final-read-authorization-gate-template
  status: final_read_authorization_gate_template_only
  final_read_authorization_gate_required: true
  final_read_authorization_gate_requested: false
  final_read_authorization_gate_passed: false
  execute_once_authorization_granted: false
  command_binding_preflight_passed: false
  read_command_bound: false
  read_command_executed: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

## Required Gate Shape

```yaml
required_gate_shape:
  gate_id: string
  request_id: string
  command_binding_preflight_id: string
  final_read_authorization_gate_required: true
  final_read_authorization_gate_requested: false
  final_read_authorization_gate_passed: false
  final_authorizer: null
  final_authorized_at: null
  read_scope_ref: redacted_allowlist_reference
  read_command_ref: redacted_read_command_reference
  read_command_bound: false
  read_command_executed: false
  read_attempt_limit: 1
  read_attempt_used: 0
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 gate shape。

## Final Gate Preconditions

```yaml
final_gate_preconditions:
  required_before_final_gate:
    - execute_once_authorization_request_record
    - command_binding_preflight_record
    - redacted_allowlist_reference
    - redacted_read_command_reference
    - one_time_read_attempt_boundary
    - stop_conditions_reviewed
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

本阶段样例不得把 `final_read_authorization_gate_passed` 设为 `true`。未来即使最终授权门通过，也只允许进入下一独立真实读取执行授权，不得由文档、contract 或 Review Console 自动读取源码。

## Forbidden Gate Content

```yaml
forbidden_gate_content:
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

## Boundary After Final Gate

最终授权门记录完成后也不得自动进入：

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

- 本 contract 只定义一次性读取最终授权门。
- 本 contract 不执行真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

