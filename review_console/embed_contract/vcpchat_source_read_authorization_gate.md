# VCPChat Source Read Authorization Gate

本文定义未来读取真实 VCPChat 源码之前的授权门槛。它只属于 Agent Image Lab 仓库内 contract，不读取真实 VCPChat，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Gate Status

```yaml
gate:
  name: vcpchat_source_read_authorization_gate
  version: v2.1-preflight
  status: authorization_gate_only
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  real_vcptoolbox_source_read: false
  real_vcptoolbox_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  real_execution_allowed: false
```

## Required Fields

```yaml
required_fields:
  authorization_request_id: string
  requested_phase: v2.1_source_read_preflight
  target_repository_ref: placeholder_only
  target_source_ref: placeholder_only
  authorization_required: true
  user_authorized: false
  allowed_source_files: []
  forbidden_source_files: []
  allowed_extract_fields: []
  forbidden_extract_fields: list
  sensitive_path_redaction_required: true
  raw_source_copy_allowed: false
  reviewer_required: true
  audit_summary_cn: string
```

`target_repository_ref` 和 `target_source_ref` 在本阶段只能是占位描述，不得写真实本地路径。

## Default Lock Values

```yaml
default_lock_values:
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  real_vcptoolbox_source_read: false
  real_vcptoolbox_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  real_execution_allowed: false
  raw_source_copy_allowed: false
```

## Allowed Source Scope Policy

授权记录必须先列出未来允许读取的文件类别，且只能使用类别或占位引用：

```yaml
allowed_source_scope_policy:
  allowed_source_files: []
  allowed_file_categories_candidate:
    - review_console_child_window_candidate
    - ipc_handler_candidate
    - preload_boundary_candidate
    - routing_or_window_lifecycle_candidate
  exact_real_paths_allowed_in_this_phase: false
```

只要 `allowed_source_files=[]`，读取真实源码就是 forbidden。

## Forbidden Source Scope

以下内容即使未来授权读取源码，也不得读取、摘录或复制原文：

- 配置文件原文。
- 环境变量文件。
- cookie、token、key、密码。
- 私密路径。
- 客户隐私和客户未公开信息。
- endpoint 原文。
- raw runtime log。
- raw IPC payload。
- raw plugin output。
- 图片二进制。

## Extract Policy

允许的输出只能是中文脱敏摘要：

```yaml
extract_policy:
  raw_source_copy_allowed: false
  allowed_extract_fields:
    - sanitized_module_purpose_cn
    - sanitized_window_lifecycle_summary_cn
    - sanitized_ipc_channel_summary_cn
    - sanitized_preload_boundary_summary_cn
    - sanitized_security_risk_notes_cn
  forbidden_extract_fields:
    - raw_source_code
    - endpoint_raw_value
    - secret_raw_value
    - private_path_raw_value
    - customer_private_data
    - raw_runtime_log
    - raw_ipc_payload
```

## Approval Chain

```yaml
approval_chain:
  review_console_required: true
  gatekeeper_required: true
  imagelab_master_required: true
  reviewer_required: true
  approval_status: pending
  approved_by: null
  approved_at: null
```

`approval_status=approved` 也只允许进入后续读取计划，不允许自动修改真实 VCPChat 或创建 IPC handler。

## Rejection Conditions

必须拒绝推进的条件：

- `user_authorized=false`。
- `source_read_performed=true` 出现在授权前记录中。
- `real_vcpchat_source_read=true` 出现在授权前记录中。
- `allowed_source_files=[]` 却要求读取源码。
- `raw_source_copy_allowed=true`。
- 授权记录包含真实源码片段。
- 授权记录包含 secret、endpoint 原文、私密路径或客户隐私。
- 授权记录试图同时授权插件执行、API 调用、DailyNote 写入或图片创建。

## Acceptance

- 本 gate 只定义授权前记录形态。
- 本 gate 不授权读取真实 VCPChat。
- 本 gate 不授权修改真实 VCPChat。
- 本 gate 不授权创建 IPC handler。
- 本 gate 不授权插件、API、DailyNote 或文件系统调用。
