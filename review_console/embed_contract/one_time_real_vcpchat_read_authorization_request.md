# One-time Real VCPChat Read Authorization Request Contract

本文定义一次性真实 VCPChat 只读读取授权请求的 contract。它只描述未来一次性读取授权请求的记录形态，不读取真实源码，不保存真实路径，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: one_time_real_vcpchat_read_authorization_request
  version: v2.2-one-time-read-request-template
  status: one_time_read_request_template_only
  one_time_read_requested: false
  one_time_read_authorized: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  read_command_approved: false
  read_attempt_limit: 1
  real_execution_allowed: false
```

## Required Request Shape

```yaml
required_request_shape:
  request_id: string
  based_on_final_preflight_packet_id: string
  one_time_read_required: true
  one_time_read_requested: false
  one_time_read_authorized: false
  authorized_by: null
  authorized_at: null
  read_scope_ref: redacted_allowlist_reference
  exact_real_paths_stored_in_git: false
  read_command_approved: false
  read_command_id: null
  read_attempt_limit: 1
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 request shape。

## Authorization Invariants

```yaml
authorization_invariants:
  when_one_time_read_authorized_true:
    authorized_by: required
    authorized_at: required
    read_attempt_limit: 1
    exact_real_paths_stored_in_git: false
    raw_source_copy_allowed: false
    required_confirmations:
      - read_command_approved
      - redacted_allowlist_reference_confirmed
      - stop_conditions_confirmed
  still_not_allowed:
    - source_read_performed
    - raw_source_copied
    - vcpchat_modified
    - ipc_handler_created
    - preload_runtime_code_created
    - api_called
    - daily_note_called
```

本阶段样例不得把 `one_time_read_authorized` 设为 `true`。未来即使授权请求获批，也只允许进入一次性读取执行 preflight，不得自动读取源码。

## One-time Constraints

```yaml
one_time_constraints:
  read_attempt_limit: 1
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

## Forbidden Request Content

```yaml
forbidden_request_content:
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

## Boundary After Request

一次性读取授权请求获批后也不得自动进入：

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

- 本 contract 只定义一次性读取授权请求。
- 本 contract 不执行真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。
