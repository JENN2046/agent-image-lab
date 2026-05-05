# 95 v2.4 Execute-once Manual Parameter Review Gate

本文定义 Agent Image Lab v2.4 第二阶段的“真实 VCPChat 一次性读取执行前人工参数复核门”。该阶段只创建未来人工复核仓库外参数的记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不保存真实根目录，不保存真实读取路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Manual Review Decision

```yaml
v2_4_execute_once_manual_parameter_review_gate:
  status: manual_parameter_review_gate_template_only
  manual_parameter_fill_required: true
  manual_parameter_fill_completed: false
  manual_parameter_review_required: true
  manual_parameter_review_requested: false
  manual_parameter_review_passed: false
  parameter_integrity_confirmed: false
  source_read_authorized: false
  source_read_performed: false
  read_command_executed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.4 Patch 01 的“人工填参清单”推进到“人工参数复核门”。它用于未来确认：

- 人类是否已经在仓库外填写真实根目录、allowlist 和读取命令。
- 外部引用是否可以对应到同一组人工填写参数。
- 读取范围是否足够精确且只覆盖授权路径。
- 读取命令是否仍然是一次性只读。
- Git 中是否仍然没有真实路径、真实命令或 raw source。
- 人工复核通过也不等于执行读取。

本阶段只补齐人工参数复核门模板，不读取参数，不批准真实读取，不执行读取。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实 VCPChat 根目录。
- 不保存真实 allowlist 路径。
- 不保存真实读取命令、shell 片段或脚本内容。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取 `.env`、`config.env`、credential、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不创建图片文件。

## Required Review Inputs

```yaml
required_review_inputs:
  manual_parameter_fill_checklist_exists: true
  manual_parameter_fill_completed: false
  manual_parameter_review_required: true
  manual_parameter_review_requested: false
  manual_parameter_review_passed: false
  parameter_reviewer: null
  parameter_reviewed_at: null
  real_vcpchat_root_ref: redacted_external_root_reference
  allowed_read_paths_ref: redacted_external_allowlist_reference
  read_command_ref: redacted_external_read_command_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
```

本阶段样例仍保持人工参数未填写、未复核、未授权、未执行。

## Manual Review Record Shape

```yaml
manual_parameter_review_gate:
  review_gate_id: string
  checklist_id: string
  manual_parameter_review_required: true
  manual_parameter_review_requested: false
  manual_parameter_review_passed: false
  parameter_integrity_confirmed: false
  parameter_reviewer: null
  parameter_reviewed_at: null
  real_vcpchat_root_ref: redacted_external_root_reference
  allowed_read_paths_ref: redacted_external_allowlist_reference
  read_command_ref: redacted_external_read_command_reference
  exact_real_paths_stored_in_git: false
  raw_read_command_stored_in_git: false
  source_read_performed: false
  real_vcpchat_source_read: false
```

`real_vcpchat_root_ref`、`allowed_read_paths_ref` 和 `read_command_ref` 仍只能是脱敏外部引用，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Review Checks

未来人工参数复核前必须确认：

- 仓库外真实根目录、allowlist 和读取命令来自同一授权上下文。
- 真实参数没有被写入 Git。
- 外部引用本身不泄露真实路径或命令文本。
- allowlist 精确且不包含未授权目录。
- 读取命令是一次性只读。
- 读取命令不会递归扫描未授权目录。
- 读取命令不会读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 读取命令不会写文件、启动 VCPChat 或修改 VCPChat。
- 读取命令不会调用插件、API、DailyNote 或 VCP 记忆。
- 参数复核完成后仍必须进入下一独立执行授权门。

## Rejection Conditions

必须拒绝以下人工参数复核记录：

- 真实路径、真实读取命令或 raw source 被写入仓库。
- 外部引用无法对应到同一组人工填写参数。
- allowlist 范围过宽、含糊或包含未授权目录。
- 读取命令包含递归扫描、写入、启动 VCPChat 或修改 VCPChat 的风险。
- 读取命令可能读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 读取命令可能调用插件、API、DailyNote、VCP 记忆或图片写入。
- 复核记录暗示已经读取、已经执行或已经进入实现。

## Acceptance

- execute-once manual parameter review gate 文档存在。
- execute-once manual parameter review gate contract 存在。
- execute-once manual parameter review gate 样例存在。
- validation checklist 包含 v2.4 manual parameter review gate 检查项。
- 样例保持 `manual_parameter_fill_completed=false`。
- 样例保持 `manual_parameter_review_requested=false`。
- 样例保持 `manual_parameter_review_passed=false`。
- 样例保持 `parameter_integrity_confirmed=false`。
- 样例保持 `source_read_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `read_command_executed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_4_execute_once_execution_authorization_gate
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - manual parameter review gate
    - parameter integrity confirmation outside git
    - external root reference
    - external allowlist reference
    - external read command reference
    - human execution authorization
  forbidden_without_next_authorization:
    - read real VCPChat source
    - execute read command
    - copy raw source
    - modify VCPChat
    - create IPC handler
    - create preload code
    - call plugin
    - call API
    - call DailyNote
    - write VCP memory
```

