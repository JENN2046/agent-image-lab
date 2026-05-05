# Real VCPChat Read Authorization Request Contract

本文定义真实 VCPChat 源码读取授权请求模板。它只描述未来用户授权时必须填写的字段，不填写真实路径，不读取真实源码，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: real_vcpchat_read_authorization_request
  version: v2.1-request-template
  status: request_template_only
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  target_repository_root: null
  exact_real_paths: []
  selected_source_categories: []
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

## Required Request Shape

```yaml
required_request_shape:
  request_id: string
  authorization_required: true
  user_authorized: false
  target_repository_root: null
  selected_source_categories: []
  exact_real_paths: []
  allowed_sanitized_output_fields: []
  forbidden_outputs: list
  stop_conditions: list
  reviewer_required: true
  source_read_performed: false
  audit_summary_cn: string
```

所有路径字段在本阶段必须为空。

## User-provided Fields For Future Authorization

未来进入真实读取前，必须由用户明确提供：

```yaml
future_user_provided_fields:
  target_repository_root: required_later
  exact_real_paths: required_later
  selected_source_categories: required_later
  allowed_sanitized_output_fields: required_later
  reviewer: required_later
  read_command_permission: required_later
```

本 contract 不替用户填写这些字段。

## Candidate Category Allowlist

```yaml
candidate_category_allowlist:
  - review_console_child_window_candidate
  - ipc_handler_candidate
  - preload_boundary_candidate
  - window_lifecycle_candidate
  - schema_bridge_candidate
```

类别选择不等于读取授权。读取授权必须同时有真实路径 allowlist。

## Forbidden Outputs

```yaml
forbidden_outputs:
  - raw_source_code
  - real_local_path
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

## Request Rejection Rules

必须拒绝：

- `user_authorized=false` 却要求读取。
- `target_repository_root=null` 却要求读取。
- `exact_real_paths=[]` 却要求读取。
- 请求允许复制 raw source。
- 请求允许读取配置、日志、环境变量、credential 或客户数据。
- 请求允许修改 VCPChat。
- 请求允许创建 IPC handler 或 preload 代码。
- 请求允许插件、API、DailyNote 或文件系统调用。
- 请求包含 secret、endpoint 原文、私密路径或客户隐私。

## Boundary After Approval

即使未来授权请求被批准，也只允许进入只读源码 intake，不允许自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义授权请求模板。
- 本 contract 不授权真实读取。
- 本 contract 不填写真实路径。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote 或文件系统调用。
