# 86 v2.2 Filled Authorization Review Gate

本文定义 Agent Image Lab v2.2 第二阶段的“已填写授权包人工复核门槛”。该阶段只审查未来用户填写的真实 VCPChat 读取授权包是否具备进入最终读取授权点的条件，不读取真实 VCPChat，不读取真实 VCPToolBox，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Review Gate Decision

```yaml
v2_2_filled_authorization_review_gate:
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

## Goal

本阶段把 v2.2 Patch 01 的“授权填写包”推进到“人工复核门槛”。它回答一个问题：

> 如果用户未来在会话中提供了真实 VCPChat 根目录和精确 allowlist，怎样在不把真实路径写入 Git 的前提下判断该授权包是否足够进入最终读取授权点？

本阶段不填写真实路径，也不读取外部源码。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实 VCPChat 根目录。
- 不保存真实 allowlist 路径。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取 `.env`、`config.env`、credential、token、cookie、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不创建图片文件。

## Required Review Inputs

未来人工复核只能检查这些脱敏后的记录形态：

```yaml
required_review_inputs:
  request_id: string
  filled_request_reference: string
  root_path_presence_confirmed: boolean
  root_path_redaction_confirmed: boolean
  exact_allowlist_presence_confirmed: boolean
  exact_allowlist_redaction_confirmed: boolean
  selected_source_categories: list
  allowed_sanitized_output_fields: list
  forbidden_source_categories: list
  read_command_permission_confirmed: boolean
  reviewer_confirmed: boolean
  stop_conditions_confirmed: boolean
  post_read_boundaries_confirmed: boolean
  source_read_performed: false
```

真实根目录和真实文件路径不得进入本仓库。仓库内只能保存是否已由用户在独立授权上下文中提供、是否已脱敏、是否通过人工复核。

## Review Checklist

人工复核必须确认：

- 用户明确提供了真实 VCPChat 根目录，但仓库记录只保留脱敏摘要。
- 用户明确提供了精确 allowlist，但仓库记录只保留脱敏摘要。
- allowlist 不包含配置、日志、环境变量、credential、客户数据、二进制资产或无关模块。
- 允许源码类别只来自候选 allowlist。
- 允许输出字段只包含中文脱敏摘要字段。
- 禁止输出字段覆盖 raw source、真实路径、endpoint 原文、环境变量值、secret 原文、私密路径、客户隐私、runtime log 原文、IPC payload 原文和图片二进制。
- 读取命令权限仍只允许只读命令。
- 审查人已明确。
- 停止条件已覆盖敏感信息和越界文件。
- 读取完成后不得自动进入 VCPChat 修改、IPC handler、preload、插件、API、DailyNote 或 VCP 记忆写入。

## Approval Rules

```yaml
approval_rules:
  can_mark_filled_request_approved: false
  approval_requires:
    - root_path_presence_confirmed
    - root_path_redaction_confirmed
    - exact_allowlist_presence_confirmed
    - exact_allowlist_redaction_confirmed
    - selected_source_categories_confirmed
    - allowed_sanitized_output_fields_confirmed
    - read_command_permission_confirmed
    - reviewer_confirmed
    - stop_conditions_confirmed
    - post_read_boundaries_confirmed
  still_forbidden_after_approval:
    - source_read_performed
    - real_vcpchat_source_read
    - raw_source_copied
    - vcpchat_modified
    - ipc_handler_created
    - preload_runtime_code_created
    - renderer_runtime_code_created
    - plugin_called
    - api_called
    - daily_note_called
```

本阶段样例必须保持 `filled_request_approved=false`。未来即使复核通过，也只允许进入“真实读取最终授权点”，不得自动读取源码。

## Rejection Conditions

人工复核必须拒绝以下授权包：

- 真实路径被写入 Git 文件。
- allowlist 为空却要求读取。
- allowlist 包含配置、日志、环境变量、credential、客户数据、二进制资产或无关模块。
- 请求允许复制 raw source。
- 请求允许读取未授权目录或递归扫描。
- 请求允许修改 VCPChat 或 VCPToolBox。
- 请求允许创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求允许调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- 请求包含 secret、endpoint 原文、私密路径、客户隐私、runtime log 原文或 IPC payload 原文。

## Acceptance

- filled authorization review gate 文档存在。
- filled authorization review gate contract 存在。
- filled authorization review gate 样例存在。
- validation checklist 包含 v2.2 filled authorization review gate 检查项。
- 样例保持 `filled_request_received=false`。
- 样例保持 `filled_request_reviewed=false`。
- 样例保持 `filled_request_approved=false`。
- 样例保持 `source_read_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `exact_real_paths_stored_in_git=false`。
- 样例不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_2_patch_03_real_vcpchat_read_final_authorization_preflight
  authorization_required: true
  requires_prior_review:
    - filled_request_reviewed
    - root_path_redaction_confirmed
    - exact_allowlist_redaction_confirmed
    - reviewer_confirmed
    - stop_conditions_confirmed
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

