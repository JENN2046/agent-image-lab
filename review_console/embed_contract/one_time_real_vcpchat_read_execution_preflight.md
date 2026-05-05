# One-time Real VCPChat Read Execution Preflight Contract

本文定义一次性真实 VCPChat 只读读取执行 preflight 的 contract。它只描述未来真实读取执行前最后预检的记录形态，不读取真实源码，不保存真实路径，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: one_time_real_vcpchat_read_execution_preflight
  version: v2.2-execution-preflight-template
  status: execution_preflight_template_only
  one_time_read_authorized: false
  execution_preflight_requested: false
  execution_preflight_passed: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  read_command_bound: false
  read_attempt_limit: 1
  read_attempt_used: 0
  real_execution_allowed: false
```

## Required Preflight Shape

```yaml
required_preflight_shape:
  preflight_id: string
  request_id: string
  execution_preflight_required: true
  execution_preflight_requested: false
  execution_preflight_passed: false
  read_command_bound: false
  read_command_id: null
  read_scope_ref: redacted_allowlist_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  exact_real_paths_stored_in_git: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 preflight shape。

## Execution Preconditions

```yaml
execution_preconditions:
  required_before_execute_once:
    - one_time_read_authorized
    - authorized_by_present
    - authorized_at_present
    - read_command_bound
    - redacted_allowlist_reference_confirmed
    - stop_conditions_confirmed
    - post_read_boundaries_confirmed
  still_not_allowed:
    - source_read_performed
    - raw_source_copied
    - vcpchat_modified
    - ipc_handler_created
    - preload_runtime_code_created
    - api_called
    - daily_note_called
```

本阶段样例不得把 `execution_preflight_passed` 设为 `true`。未来即使执行 preflight 通过，也只允许进入一次性读取执行授权点，不得自动读取源码。

## Command Constraints

```yaml
command_constraints:
  read_attempt_limit: 1
  read_attempt_used: 0
  read_only: true
  allowlist_only: true
  recursive_scan_allowed: false
  config_read_allowed: false
  log_read_allowed: false
  credential_read_allowed: false
  customer_data_read_allowed: false
  raw_source_output_allowed: false
  real_path_output_allowed: false
  file_write_allowed: false
  vcpchat_launch_allowed: false
```

## Forbidden Preflight Content

```yaml
forbidden_preflight_content:
  - real_local_path
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

## Boundary After Preflight

执行 preflight 通过后也不得自动进入：

- 真实 VCPChat 源码读取。
- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义一次性读取执行 preflight。
- 本 contract 不执行真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

