# Real VCPChat Read Final Authorization Preflight Contract

本文定义真实 VCPChat 读取前最终授权 preflight 的 contract。它只描述未来读取前最后检查的记录形态，不读取真实源码，不保存真实路径，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: real_vcpchat_read_final_authorization_preflight
  version: v2.2-final-preflight-template
  status: final_authorization_preflight_only
  final_authorization_requested: false
  final_authorization_granted: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  read_command_ready: false
  real_execution_allowed: false
```

## Required Preflight Shape

```yaml
required_preflight_shape:
  packet_id: string
  request_id: string
  review_id: string
  final_authorization_required: true
  final_authorization_requested: false
  final_authorization_granted: false
  authorized_by: null
  authorized_at: null
  root_path_redaction_confirmed: false
  exact_allowlist_redaction_confirmed: false
  allowed_source_categories_confirmed: false
  allowed_sanitized_output_fields_confirmed: false
  read_command_permission_confirmed: false
  reviewer_confirmed: false
  stop_conditions_confirmed: false
  post_read_boundaries_confirmed: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 preflight shape。

## Final Approval Invariants

```yaml
final_approval_invariants:
  when_final_authorization_granted_true:
    authorized_by: required
    authorized_at: required
    root_path_redaction_confirmed: true
    exact_allowlist_redaction_confirmed: true
    read_command_permission_confirmed: true
    reviewer_confirmed: true
    stop_conditions_confirmed: true
    post_read_boundaries_confirmed: true
  still_not_allowed:
    - source_read_performed
    - raw_source_copied
    - vcpchat_modified
    - ipc_handler_created
    - preload_runtime_code_created
    - api_called
    - daily_note_called
```

本阶段样例不得把 `final_authorization_granted` 设为 `true`。未来即使最终授权获批，也只允许进入一次性只读读取请求，不得自动读取源码。

## Read Command Constraints

```yaml
read_command_constraints:
  read_only: true
  allowlist_only: true
  recursive_scan_allowed: false
  config_read_allowed: false
  log_read_allowed: false
  credential_read_allowed: false
  customer_data_read_allowed: false
  raw_source_output_allowed: false
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

最终授权 preflight 通过后也不得自动进入：

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

- 本 contract 只定义最终授权 preflight。
- 本 contract 不授权真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。
