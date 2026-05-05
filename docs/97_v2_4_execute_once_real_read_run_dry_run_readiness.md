# 97 v2.4 Execute-once Real Read Run Dry-run Readiness

本文定义 Agent Image Lab v2.4 第四阶段的“真实 VCPChat 一次性读取运行 dry-run readiness”。该阶段只创建未来真实读取运行前的无执行预检记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不保存真实根目录，不保存真实读取路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Dry-run Readiness Decision

```yaml
v2_4_execute_once_real_read_run_dry_run_readiness:
  status: real_read_run_dry_run_readiness_template_only
  real_read_run_dry_run_required: true
  real_read_run_dry_run_requested: false
  real_read_run_dry_run_passed: false
  execution_authorization_granted: false
  one_time_read_attempt_authorized: false
  real_read_run_authorized: false
  read_command_executed: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.4 Patch 03 的“执行授权门”推进到“真实读取运行前 dry-run readiness”。它用于未来确认：

- 执行授权门是否存在。
- 真实读取运行仍需要下一条独立、明确的人类授权。
- dry-run readiness 只展示将要检查的条件，不运行读取命令。
- 读取尝试仍限制为一次。
- 读取结果仍只允许进入脱敏审查。
- Git 中仍不得保存真实路径、真实命令或 raw source。

本阶段只补齐 dry-run readiness 模板，不批准真实读取，不执行读取命令。

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

## Required Readiness Inputs

```yaml
required_readiness_inputs:
  execution_authorization_gate_exists: true
  execution_authorization_granted: false
  one_time_read_attempt_authorized: false
  real_read_run_dry_run_required: true
  real_read_run_dry_run_requested: false
  real_read_run_dry_run_passed: false
  real_read_run_authorized: false
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
```

本阶段样例仍保持执行授权未批准、dry-run readiness 未通过、真实运行未授权、命令未执行。

## Dry-run Readiness Record Shape

```yaml
real_read_run_dry_run_readiness:
  readiness_id: string
  execution_gate_id: string
  real_read_run_dry_run_required: true
  real_read_run_dry_run_requested: false
  real_read_run_dry_run_passed: false
  real_read_run_authorized: false
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
  source_read_performed: false
  real_vcpchat_source_read: false
  raw_source_copy_allowed: false
```

`execution_gate_id` 只能引用脱敏执行授权门记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Dry-run Readiness Checks

未来 dry-run readiness 通过前必须确认：

- 执行授权门存在，但不得暗示已经执行。
- 仓库外真实读取命令仍未进入 Git。
- 仓库外真实读取范围仍未进入 Git。
- 读取尝试仍限制为一次。
- 停止条件仍被记录为未执行状态。
- 读取后脱敏审查路径已经存在。
- 任何读取结果不得直接进入实现、记忆写入、资产写入或发布流程。
- dry-run readiness 通过也不得自动执行读取命令。

## Rejection Conditions

必须拒绝以下 dry-run readiness 记录：

- 真实路径、真实读取命令或 raw source 被写入仓库。
- 执行授权门未存在或无法追溯。
- 读取命令或读取范围不来自同一授权上下文。
- 读取命令可能递归扫描未授权目录。
- 读取命令可能读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 读取命令可能写文件、启动或修改 VCPChat。
- 读取命令可能调用插件、API、DailyNote、VCP 记忆或图片写入。
- dry-run readiness 记录暗示已经执行或已经读取真实源码。

## Acceptance

- execute-once real read run dry-run readiness 文档存在。
- execute-once real read run dry-run readiness contract 存在。
- execute-once real read run dry-run readiness 样例存在。
- validation checklist 包含 v2.4 real read run dry-run readiness 检查项。
- 样例保持 `real_read_run_dry_run_requested=false`。
- 样例保持 `real_read_run_dry_run_passed=false`。
- 样例保持 `execution_authorization_granted=false`。
- 样例保持 `one_time_read_attempt_authorized=false`。
- 样例保持 `real_read_run_authorized=false`。
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
    - real read run dry-run readiness
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

