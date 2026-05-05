# 93 v2.3 Execute-once Final Read Authorization Gate

本文定义 Agent Image Lab v2.3 第四阶段的“真实 VCPChat 一次性读取最终授权门”。该阶段只创建最终授权门的记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不保存真实路径，不保存真实读取命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Final Gate Decision

```yaml
v2_3_execute_once_final_read_authorization_gate:
  status: final_read_authorization_gate_template_only
  final_read_authorization_gate_required: true
  final_read_authorization_gate_requested: false
  final_read_authorization_gate_passed: false
  execute_once_authorization_granted: false
  command_binding_preflight_passed: false
  read_command_bound: false
  read_command_executed: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.3 Patch 03 的“命令绑定 preflight”推进到“最终读取授权门”。它用于未来在真正读取前做最后一次人工确认：

- 授权请求、命令绑定、读取范围和停止条件都已被人工复核。
- 真实读取范围和真实读取命令仍保存在仓库外。
- Git 中只保留脱敏引用和审计摘要。
- 读取仍然只能是一次性、只读、受限范围。
- 读取结果只能进入后续脱敏审查，不得直接进入实现、记忆写入或资产写入。
- 任何真实读取都必须在本门之后再次由用户明确授权执行。

本阶段只补齐最终读取授权门模板，不批准真实读取，不执行读取。

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

## Required Gate Inputs

```yaml
required_gate_inputs:
  execute_once_authorization_request_exists: true
  command_binding_preflight_exists: true
  final_read_authorization_gate_required: true
  final_read_authorization_gate_requested: false
  final_read_authorization_gate_passed: false
  authorized_by: null
  authorized_at: null
  read_scope_ref: redacted_allowlist_reference
  read_command_ref: redacted_read_command_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
```

本阶段样例仍保持最终授权未请求、未批准、命令未执行、源码未读取。

## Final Gate Record Shape

```yaml
final_read_authorization_gate:
  gate_id: string
  request_id: string
  command_binding_preflight_id: string
  final_read_authorization_gate_required: true
  final_read_authorization_gate_requested: false
  final_read_authorization_gate_passed: false
  final_authorizer: null
  final_authorized_at: null
  read_scope_ref: redacted_allowlist_reference
  read_command_ref: redacted_read_command_reference
  read_command_bound: false
  read_command_executed: false
  read_attempt_limit: 1
  read_attempt_used: 0
  source_read_performed: false
  real_vcpchat_source_read: false
  raw_source_copy_allowed: false
```

`read_scope_ref`、`read_command_ref` 和 `command_binding_preflight_id` 只能是脱敏引用，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Final Gate Checks

未来最终授权门通过前必须确认：

- 授权请求和命令绑定 preflight 已经存在。
- 外部读取范围引用可以追溯到用户批准的 allowlist。
- 外部读取命令引用可以追溯到用户批准的只读命令。
- 读取尝试次数仍限制为一次。
- 停止条件已经被人工确认。
- 读取后输出只允许进入脱敏审查。
- 读取不得启动、修改或写入 VCPChat。
- 读取不得调用插件、API、DailyNote 或 VCP 记忆。
- 读取不得复制 raw source 到 Git、审计日志、memory_delta 或 DailyNote。

## Rejection Conditions

必须拒绝以下最终授权请求：

- 真实路径、真实读取命令或 raw source 被写入仓库。
- 授权请求、命令绑定记录或外部引用无法互相对应。
- 读取范围不够精确，可能扩展到未授权目录。
- 读取命令可能递归扫描未授权目录。
- 读取命令可能读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 读取命令可能写文件、启动或修改 VCPChat。
- 读取命令可能调用插件、API、DailyNote、VCP 记忆或图片写入。
- 读取结果可能直接进入实现、记忆写入、资产写入或发布流程。

## Acceptance

- execute-once final read authorization gate 文档存在。
- execute-once final read authorization gate contract 存在。
- execute-once final read authorization gate 样例存在。
- validation checklist 包含 v2.3 final read authorization gate 检查项。
- 样例保持 `final_read_authorization_gate_requested=false`。
- 样例保持 `final_read_authorization_gate_passed=false`。
- 样例保持 `execute_once_authorization_granted=false`。
- 样例保持 `command_binding_preflight_passed=false`。
- 样例保持 `read_command_bound=false`。
- 样例保持 `read_command_executed=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `exact_real_paths_stored_in_git=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Hard Authorization Point

```yaml
next_hard_authorization_point:
  authorization_name: v2_3_execute_once_real_read_execution
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - final read authorization gate
    - external read command reference
    - external read scope reference
    - final human authorization outside git
    - one-time read attempt boundary
    - stop conditions accepted
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

