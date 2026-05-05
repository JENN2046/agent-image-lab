# 91 v2.3 Execute-once Authorization Request Template

本文定义 Agent Image Lab v2.3 第二阶段的“真实 VCPChat 一次性读取执行授权请求模板”。该阶段只创建未来执行一次只读读取时的授权请求记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Request Decision

```yaml
v2_3_execute_once_authorization_request_template:
  status: execute_once_authorization_request_template_only
  execute_once_authorization_requested: false
  execute_once_authorization_granted: false
  one_time_read_authorized: false
  execution_preflight_passed: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  read_command_bound: false
  read_command_executed: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.3 Patch 01 的“执行授权前规划”推进为“执行授权请求模板”。它用于未来让用户在一个独立授权点明确批准或拒绝：

- 是否允许执行一次只读读取。
- 授权人和授权时间。
- 外部 allowlist 引用是否有效。
- 外部读取命令引用是否有效。
- 读取次数是否限制为一次。
- 读取结果是否只能进入脱敏审查。
- 失败、停止和越界发现时如何处理。

本阶段只补齐请求模板，不执行读取。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实 VCPChat 根目录。
- 不保存真实 allowlist 路径。
- 不保存真实读取命令。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取 `.env`、`config.env`、credential、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不创建图片文件。

## Required Preplan Inputs

```yaml
required_preplan_inputs:
  execute_once_authorization_preplan_exists: true
  execute_once_authorization_requested: false
  execute_once_authorization_granted: false
  read_scope_ref: redacted_allowlist_reference
  read_command_ref: redacted_read_command_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
```

本阶段样例仍保持授权未请求、未批准、命令未执行。

## Execute-once Request Shape

```yaml
execute_once_authorization_request:
  request_id: string
  based_on_preplan_packet_id: string
  execute_once_authorization_required: true
  execute_once_authorization_requested: false
  execute_once_authorization_granted: false
  authorization_status: pending_execute_once_authorization_request
  authorized_by: null
  authorized_at: null
  read_scope_ref: redacted_allowlist_reference
  read_command_ref: redacted_read_command_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
```

`read_scope_ref` 和 `read_command_ref` 只能是脱敏引用，不得包含真实路径、shell 片段、endpoint、secret、客户数据或 raw source。

## Human Authorization Fields

未来真正授权时必须由用户明确提供：

```yaml
future_human_authorization_fields:
  authorized_by: required_later
  authorized_at: required_later
  execute_once_authorization_granted: required_later
  read_scope_ref_confirmed: required_later
  read_command_ref_confirmed: required_later
  stop_conditions_confirmed: required_later
```

本阶段不得代填这些字段。

## Approval Invariants

未来授权请求如被批准，必须满足：

- 授权人存在。
- 授权时间存在。
- 外部 allowlist 引用已确认。
- 外部读取命令引用已确认。
- 读取次数限制为一次。
- 命令只读。
- 输出只能进入脱敏审查。
- 仓库不保存真实路径或真实命令。
- raw source 仍禁止复制。

授权请求获批也不代表已经执行读取；真实读取执行仍必须是下一独立授权点。

## Rejection Conditions

必须拒绝以下授权请求：

- 请求把真实路径、读取命令或 raw source 写入仓库。
- 请求读取未授权路径。
- 请求读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 请求递归扫描未授权目录。
- 请求写文件、启动 VCPChat 或修改 VCPChat。
- 请求创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求调用插件、API、DailyNote、VCP 记忆或图片写入。
- 请求读取次数超过一次。
- 请求将读取结果直接用于代码实现、DailyNote 或 VCP 长期记忆。

## Acceptance

- execute-once authorization request template 文档存在。
- execute-once authorization request template contract 存在。
- execute-once authorization request template 样例存在。
- validation checklist 包含 v2.3 execute-once authorization request template 检查项。
- 样例保持 `execute_once_authorization_requested=false`。
- 样例保持 `execute_once_authorization_granted=false`。
- 样例保持 `authorized_by=null`。
- 样例保持 `authorized_at=null`。
- 样例保持 `read_command_executed=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `exact_real_paths_stored_in_git=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_3_patch_03_execute_once_command_binding_preflight
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - execute-once authorization request
    - human authorization decision
    - external read scope reference
    - external read command reference
    - command binding preflight
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

