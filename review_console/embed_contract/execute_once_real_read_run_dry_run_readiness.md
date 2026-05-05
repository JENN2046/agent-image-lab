# Execute-once Real Read Run Dry-run Readiness Contract

本文定义真实 VCPChat 一次性读取运行 dry-run readiness 的 contract。它只描述未来真实读取运行前的无执行预检记录形态，不读取真实源码，不保存真实路径，不保存真实命令，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: execute_once_real_read_run_dry_run_readiness
  version: v2.4-real-read-run-dry-run-readiness-template
  status: real_read_run_dry_run_readiness_template_only
  real_read_run_dry_run_required: true
  real_read_run_dry_run_requested: false
  real_read_run_dry_run_passed: false
  execution_authorization_granted: false
  one_time_read_attempt_authorized: false
  real_read_run_authorized: false
  source_read_performed: false
  read_command_executed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Required Readiness Shape

```yaml
required_readiness_shape:
  readiness_id: string
  execution_gate_id: string
  real_read_run_dry_run_required: true
  real_read_run_dry_run_requested: false
  real_read_run_dry_run_passed: false
  real_read_run_authorized: false
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 readiness shape。

## Dry-run Readiness Preconditions

```yaml
dry_run_readiness_preconditions:
  required_before_readiness:
    - execution_authorization_gate
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

本阶段样例不得把 `real_read_run_dry_run_passed` 或 `real_read_run_authorized` 设为 `true`。未来即使 dry-run readiness 通过，也只允许进入下一独立真实读取运行授权，不得由文档、contract 或 Review Console 自动执行读取命令。

## Forbidden Readiness Content

```yaml
forbidden_readiness_content:
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

## Boundary After Dry-run Readiness

dry-run readiness 记录完成后也不得自动进入：

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

- 本 contract 只定义一次性读取运行 dry-run readiness。
- 本 contract 不执行真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

