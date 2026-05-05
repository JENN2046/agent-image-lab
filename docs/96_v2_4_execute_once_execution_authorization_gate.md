# 96 v2.4 Execute-once Execution Authorization Gate

本文定义 Agent Image Lab v2.4 第三阶段的“真实 VCPChat 一次性读取执行授权门”。该阶段只创建未来执行前最后授权门的记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不保存真实根目录，不保存真实读取路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Execution Authorization Decision

```yaml
v2_4_execute_once_execution_authorization_gate:
  status: execution_authorization_gate_template_only
  execution_authorization_required: true
  execution_authorization_requested: false
  execution_authorization_granted: false
  manual_parameter_review_passed: false
  parameter_integrity_confirmed: false
  one_time_read_attempt_authorized: false
  source_read_authorized: false
  source_read_performed: false
  read_command_executed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.4 Patch 02 的“人工参数复核门”推进到“执行授权门”。它用于未来确认：

- 人工参数复核是否已完成。
- 仓库外真实根目录、allowlist 和读取命令是否仍可追溯。
- 读取尝试是否仍限制为一次。
- 停止条件是否已被人类接受。
- 读取结果是否只进入脱敏审查。
- 真实执行是否仍需要下一条独立、明确的用户指令。

本阶段只补齐执行授权门模板，不批准真实读取，不执行读取命令。

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

## Required Authorization Inputs

```yaml
required_execution_authorization_inputs:
  manual_parameter_review_gate_exists: true
  manual_parameter_review_passed: false
  parameter_integrity_confirmed: false
  execution_authorization_required: true
  execution_authorization_requested: false
  execution_authorization_granted: false
  execution_authorizer: null
  execution_authorized_at: null
  one_time_read_attempt_authorized: false
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
```

本阶段样例仍保持人工参数未通过复核、执行授权未请求、未批准、未执行。

## Execution Authorization Record Shape

```yaml
execution_authorization_gate:
  gate_id: string
  review_gate_id: string
  execution_authorization_required: true
  execution_authorization_requested: false
  execution_authorization_granted: false
  execution_authorizer: null
  execution_authorized_at: null
  one_time_read_attempt_authorized: false
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
  source_read_performed: false
  real_vcpchat_source_read: false
  raw_source_copy_allowed: false
```

`review_gate_id` 只能引用脱敏复核记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Authorization Checks

未来执行授权前必须确认：

- 人工参数复核门已通过，但通过记录不得包含真实参数。
- 真实读取命令仍在仓库外持有。
- 真实读取范围仍在仓库外持有。
- 读取尝试限制为一次。
- 执行后输出只进入脱敏审查。
- 执行不得启动、修改或写入 VCPChat。
- 执行不得调用插件、API、DailyNote 或 VCP 记忆。
- 执行不得复制 raw source 到 Git、审计日志、memory_delta 或 DailyNote。
- 执行授权门通过也不得自动执行读取命令。

## Rejection Conditions

必须拒绝以下执行授权记录：

- 真实路径、真实读取命令或 raw source 被写入仓库。
- 人工参数复核门未通过或无法追溯。
- 读取命令和读取范围不来自同一授权上下文。
- 读取命令可能递归扫描未授权目录。
- 读取命令可能读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 读取命令可能写文件、启动或修改 VCPChat。
- 读取命令可能调用插件、API、DailyNote、VCP 记忆或图片写入。
- 授权记录暗示已经执行或已经读取真实源码。

## Acceptance

- execute-once execution authorization gate 文档存在。
- execute-once execution authorization gate contract 存在。
- execute-once execution authorization gate 样例存在。
- validation checklist 包含 v2.4 execution authorization gate 检查项。
- 样例保持 `execution_authorization_requested=false`。
- 样例保持 `execution_authorization_granted=false`。
- 样例保持 `manual_parameter_review_passed=false`。
- 样例保持 `parameter_integrity_confirmed=false`。
- 样例保持 `one_time_read_attempt_authorized=false`。
- 样例保持 `source_read_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `read_command_executed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Hard Authorization Point

```yaml
next_hard_authorization_point:
  authorization_name: v2_4_execute_once_real_read_run
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - execution authorization gate
    - external read command reference
    - external read scope reference
    - one-time read attempt boundary
    - post-read sanitization route
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

