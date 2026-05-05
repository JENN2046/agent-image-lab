# Filled Authorization Review Gate Contract

本文定义真实 VCPChat 读取授权填写包的人工复核 contract。它只描述未来已填写授权包如何被人工复核，不读取真实源码，不保存真实路径，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: filled_authorization_review_gate
  version: v2.2-review-gate-template
  status: review_gate_template_only
  filled_request_received: false
  filled_request_reviewed: false
  filled_request_approved: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

## Required Review Shape

```yaml
required_review_shape:
  review_id: string
  request_id: string
  filled_request_reference: string
  filled_request_received: false
  filled_request_reviewed: false
  filled_request_approved: false
  root_path_presence_confirmed: false
  root_path_redaction_confirmed: false
  exact_allowlist_presence_confirmed: false
  exact_allowlist_redaction_confirmed: false
  selected_source_categories_confirmed: false
  allowed_sanitized_output_fields_confirmed: false
  read_command_permission_confirmed: false
  reviewer_confirmed: false
  stop_conditions_confirmed: false
  post_read_boundaries_confirmed: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 review shape。

## Approval Preconditions

```yaml
approval_preconditions:
  root_path_presence_confirmed: true
  root_path_redaction_confirmed: true
  exact_allowlist_presence_confirmed: true
  exact_allowlist_redaction_confirmed: true
  selected_source_categories_confirmed: true
  allowed_sanitized_output_fields_confirmed: true
  read_command_permission_confirmed: true
  reviewer_confirmed: true
  stop_conditions_confirmed: true
  post_read_boundaries_confirmed: true
```

本阶段样例不得把这些条件设为 `true` 后直接读取源码。复核通过只允许进入下一独立最终授权点。

## Forbidden Review Content

```yaml
forbidden_review_content:
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

## Rejection Rules

必须拒绝：

- review 记录包含真实路径或 raw source。
- filled request 未确认脱敏却要求进入最终授权。
- allowlist 为空却要求读取。
- allowlist 覆盖配置、日志、环境变量、credential、客户数据、二进制资产或无关模块。
- 请求允许递归扫描未授权目录。
- 请求允许修改 VCPChat 或 VCPToolBox。
- 请求允许创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求允许插件、API、DailyNote、VCP 记忆或文件系统写入。

## Boundary After Review

人工复核通过后也不得自动进入：

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

- 本 contract 只定义人工复核门槛。
- 本 contract 不授权真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

