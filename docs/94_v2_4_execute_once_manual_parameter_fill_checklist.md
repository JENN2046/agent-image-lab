# 94 v2.4 Execute-once Manual Parameter Fill Checklist

本文定义 Agent Image Lab v2.4 第一阶段的“真实 VCPChat 一次性读取执行前人工填参清单”。该阶段只创建未来人工填参前的检查记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不保存真实根目录，不保存真实读取路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Manual Parameter Decision

```yaml
v2_4_execute_once_manual_parameter_fill_checklist:
  status: manual_parameter_fill_checklist_template_only
  manual_parameter_fill_required: true
  manual_parameter_fill_completed: false
  manual_parameter_review_passed: false
  real_vcpchat_root_supplied_outside_git: false
  allowed_read_paths_supplied_outside_git: false
  read_command_supplied_outside_git: false
  source_read_authorized: false
  source_read_performed: false
  read_command_executed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.3 的“最终读取授权门”推进到“执行前人工填参清单”。它用于未来提醒人类在仓库外确认以下内容：

- 真实 VCPChat 根目录由人类在仓库外填写。
- 允许读取路径由人类在仓库外填写。
- 一次性只读命令由人类在仓库外填写。
- Git 中只允许保存脱敏引用和中文审计摘要。
- 人工填参完成不等于授权读取。
- 人工填参完成不等于执行读取命令。

本阶段只补齐填参清单模板，不收集真实参数，不批准真实读取，不执行读取。

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

## Required Manual Inputs

```yaml
required_manual_inputs:
  manual_parameter_fill_required: true
  manual_parameter_fill_completed: false
  manual_parameter_review_passed: false
  real_vcpchat_root_supplied_outside_git: false
  allowed_read_paths_supplied_outside_git: false
  read_command_supplied_outside_git: false
  real_vcpchat_root_ref: redacted_external_root_reference
  allowed_read_paths_ref: redacted_external_allowlist_reference
  read_command_ref: redacted_external_read_command_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
```

本阶段样例仍保持人工参数未填写、未复核、未授权、未执行。

## Manual Parameter Record Shape

```yaml
manual_parameter_fill_checklist:
  checklist_id: string
  final_gate_id: string
  manual_parameter_fill_required: true
  manual_parameter_fill_completed: false
  manual_parameter_review_passed: false
  real_vcpchat_root_supplied_outside_git: false
  allowed_read_paths_supplied_outside_git: false
  read_command_supplied_outside_git: false
  real_vcpchat_root_ref: redacted_external_root_reference
  allowed_read_paths_ref: redacted_external_allowlist_reference
  read_command_ref: redacted_external_read_command_reference
  exact_real_paths_stored_in_git: false
  raw_read_command_stored_in_git: false
  source_read_performed: false
  real_vcpchat_source_read: false
```

`real_vcpchat_root_ref`、`allowed_read_paths_ref` 和 `read_command_ref` 只能是脱敏外部引用，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Manual Fill Checklist

未来人工填参前必须确认：

- 真实根目录只在仓库外填写。
- 真实 allowlist 只在仓库外填写。
- 真实读取命令只在仓库外填写。
- 外部引用可以被人类追溯，但不能泄露真实内容。
- 读取范围必须是精确 allowlist，不允许模糊目录。
- 读取命令必须是一次性只读，不允许写入、启动或修改 VCPChat。
- 读取命令不得读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 读取命令不得调用插件、API、DailyNote 或 VCP 记忆。
- 填参完成后仍必须进入下一独立人工复核门。

## Rejection Conditions

必须拒绝以下人工填参记录：

- 真实路径、真实读取命令或 raw source 被写入仓库。
- 外部引用无法追溯到人类填写的参数。
- allowlist 范围过宽或包含未授权目录。
- 读取命令包含递归扫描、写入、启动 VCPChat 或修改 VCPChat 的风险。
- 读取命令可能读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 读取命令可能调用插件、API、DailyNote、VCP 记忆或图片写入。
- 填参记录暗示已经读取、已经授权执行或已经进入实现。

## Acceptance

- execute-once manual parameter fill checklist 文档存在。
- execute-once manual parameter fill checklist contract 存在。
- execute-once manual parameter fill checklist 样例存在。
- validation checklist 包含 v2.4 manual parameter fill 检查项。
- 样例保持 `manual_parameter_fill_completed=false`。
- 样例保持 `manual_parameter_review_passed=false`。
- 样例保持 `real_vcpchat_root_supplied_outside_git=false`。
- 样例保持 `allowed_read_paths_supplied_outside_git=false`。
- 样例保持 `read_command_supplied_outside_git=false`。
- 样例保持 `source_read_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `read_command_executed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_4_manual_parameter_review_gate
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - manual parameter fill checklist
    - external root reference
    - external allowlist reference
    - external read command reference
    - human parameter review
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

