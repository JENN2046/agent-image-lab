# Real VCPChat Read Authorization Fill Contract

本文定义真实 VCPChat 源码读取授权填写包的 contract。它只描述未来用户填写授权包时必须提供和禁止提供的字段，不读取真实源码，不保存真实本地路径，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: real_vcpchat_read_authorization_fill
  version: v2.2-fill-template
  status: fill_template_only
  user_authorized: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  target_repository_root_provided: false
  target_repository_root_redacted: null
  exact_allowed_paths: []
  exact_allowed_paths_redacted: []
  read_command_permission: false
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

## Required Fill Shape

```yaml
required_fill_shape:
  request_id: string
  based_on_request_id: string
  authorization_required: true
  user_authorized: false
  source_read_authorized: false
  target_repository_root_provided: false
  target_repository_root_redacted: null
  exact_allowed_paths: []
  exact_allowed_paths_redacted: []
  allowed_source_categories: []
  forbidden_source_categories: list
  allowed_sanitized_output_fields: []
  read_command_permission: false
  reviewer_required: true
  reviewer: null
  stop_conditions: list
  source_read_performed: false
  audit_summary_cn: string
```

可提交记录不得包含真实根目录或真实文件路径。真实路径如在未来会话中被用户提供，也必须在进入仓库前脱敏。

## Candidate Category Allowlist

```yaml
candidate_category_allowlist:
  - review_console_child_window_candidate
  - ipc_handler_candidate
  - preload_boundary_candidate
  - window_lifecycle_candidate
  - schema_bridge_candidate
```

类别选择不等于读取授权。读取授权还必须有精确 allowlist、审查人、读取命令权限和下一独立授权点。

## Forbidden Source Categories

```yaml
forbidden_source_categories:
  - env_or_config_files
  - credential_or_secret_files
  - runtime_logs
  - user_data_or_chat_history
  - binary_assets
  - unrelated_modules
```

## Allowed Sanitized Output Fields

```yaml
allowed_sanitized_output_field_candidates:
  - sanitized_module_purpose_cn
  - sanitized_window_lifecycle_summary_cn
  - sanitized_ipc_channel_summary_cn
  - sanitized_preload_boundary_summary_cn
  - sanitized_schema_validation_summary_cn
  - sanitized_security_risk_notes_cn
  - sanitized_required_change_summary_cn
  - sanitized_stop_condition_summary_cn
  - sanitized_followup_question_cn
```

所有输出字段必须是中文脱敏摘要，不得包含 raw source、真实路径、endpoint 原文、环境变量值、secret 原文、客户隐私或 runtime log 原文。

## Request Rejection Rules

必须拒绝：

- `user_authorized=false` 却要求读取。
- `source_read_authorized=false` 却要求读取。
- `read_command_permission=false` 却要求读取。
- `target_repository_root_provided=false` 却要求读取。
- `exact_allowed_paths=[]` 却要求读取。
- 请求允许复制 raw source。
- 请求允许读取配置、日志、环境变量、credential 或客户数据。
- 请求允许修改 VCPChat 或 VCPToolBox。
- 请求允许创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求允许插件、API、DailyNote、VCP 记忆或文件系统写入。
- 请求把真实路径、secret、endpoint 原文、私密路径或客户隐私写入仓库。

## Boundary After Filled Request

即使未来填写包被人工确认，也只允许进入“读取前最终复核”。它不得自动进入：

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

- 本 contract 只定义授权填写包。
- 本 contract 不授权真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

