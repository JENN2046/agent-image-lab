# 85 v2.2 Real VCPChat Read Authorization Fill

本文定义 Agent Image Lab v2.2 第一阶段的真实 VCPChat 读取授权填写包。该阶段只补齐“用户如何填写未来读取授权”的记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Fill Decision

```yaml
v2_2_real_vcpchat_read_authorization_fill:
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

## Goal

本阶段把 v2.1 的空授权请求推进为“可填写授权包”的规范。它用于未来让用户明确填写或确认：

- 是否提供真实 VCPChat 根目录。
- 是否只允许保存脱敏后的根目录摘要。
- 精确允许读取的文件路径清单。
- 允许读取的源码类别。
- 禁止读取的源码类别。
- 允许输出的中文脱敏字段。
- 读取命令权限。
- 审查人。
- 停止条件。
- 读取完成后的边界。

本阶段不替用户填写真实路径，也不读取外部源码。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不在仓库中写入真实 VCPChat 根目录。
- 不在仓库中写入真实本地文件路径。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取 `.env`、`config.env`、credential、token、cookie、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不创建图片文件。

## Authorization Fill Package

```yaml
authorization_fill_package:
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
  forbidden_source_categories:
    - env_or_config_files
    - credential_or_secret_files
    - runtime_logs
    - user_data_or_chat_history
    - binary_assets
    - unrelated_modules
  allowed_sanitized_output_fields: []
  read_command_permission: false
  reviewer_required: true
  reviewer: null
  stop_conditions_required: true
  raw_source_copy_allowed: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

`target_repository_root_redacted` 只能保存脱敏摘要，不得保存真实绝对路径。`exact_allowed_paths` 在可提交样例中必须保持空数组；如果未来用户在会话中提供真实路径，进入 Git 的记录也只能保留脱敏后的 `exact_allowed_paths_redacted` 摘要。

## Allowed Source Categories

可填写的源码类别仍限制为候选类别，不代表读取已经发生：

```yaml
allowed_source_category_candidates:
  - review_console_child_window_candidate
  - ipc_handler_candidate
  - preload_boundary_candidate
  - window_lifecycle_candidate
  - schema_bridge_candidate
```

本阶段样例必须保持 `allowed_source_categories=[]`。

## Allowed Sanitized Output Fields

未来可申请输出的字段必须是中文脱敏摘要字段：

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

不得输出 raw source、真实路径、endpoint 原文、环境变量值、secret 原文、客户隐私、runtime log 原文、IPC payload 原文或图片二进制。

## Read Command Permission

`read_command_permission=true` 只能在未来独立授权中由用户明确给出。本阶段保持 `false`。

即使未来设置为 `true`，也只允许读取精确 allowlist 中的文件，并且不得：

- 递归扫描未授权目录。
- 读取配置、日志、环境变量、credential 或客户数据。
- 写入文件。
- 执行 VCPChat。
- 修改 VCPChat。
- 创建 IPC handler、preload、renderer 或 Adapter 执行入口。

## Stop Conditions

未来填写包必须包含停止条件。读取准备过程中发现以下情况时，必须停止并只保留中文脱敏摘要：

- 真实路径被要求写入仓库。
- secret-like 内容。
- endpoint 原文。
- 私密路径。
- 客户隐私。
- raw source 超出允许摘录范围。
- raw runtime log。
- raw IPC payload。
- credential、配置或环境变量原文。
- 未授权文件类别。

## Rejection Conditions

授权填写包必须被拒绝的情况：

- `user_authorized=false` 却要求读取。
- `source_read_authorized=false` 却要求读取。
- 没有精确 allowlist 却要求读取。
- 请求允许复制 raw source。
- 请求允许读取配置、日志、环境变量、credential 或客户数据。
- 请求允许修改 VCPChat 或 VCPToolBox。
- 请求允许创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求允许调用插件、API、DailyNote 或 VCP 记忆。
- 请求允许写入图片文件。
- 请求把真实路径、secret、endpoint 原文、私密路径或客户隐私写入仓库。

## Acceptance

- authorization fill 文档存在。
- authorization fill contract 存在。
- authorization fill 样例存在。
- validation checklist 包含 v2.2 authorization fill 检查项。
- 样例保持 `user_authorized=false`。
- 样例保持 `source_read_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `target_repository_root_provided=false`。
- 样例保持 `target_repository_root_redacted=null`。
- 样例保持 `exact_allowed_paths=[]`。
- 样例保持 `read_command_permission=false`。
- 样例不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_2_patch_02_real_vcpchat_read_filled_request_review
  authorization_required: true
  requires_user_to_provide_outside_git:
    - real VCPChat root
    - exact allowed file paths
    - selected source categories
    - allowed sanitized outputs
    - reviewer
    - read command permission
  forbidden_without_next_authorization:
    - read real VCPChat source
    - copy raw source
    - modify VCPChat
    - create IPC handler
    - create preload code
    - call plugin
    - call API
    - call DailyNote
    - write VCP memory
```

