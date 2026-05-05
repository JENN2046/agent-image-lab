# 90 v2.3 Real VCPChat Execute-once Authorization Preplan

本文定义 Agent Image Lab v2.3 第一阶段的“真实 VCPChat 一次性读取执行授权前规划”。该阶段只规划未来一次性真实读取执行授权链，不读取真实 VCPChat，不读取真实 VCPToolBox，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Preplan Decision

```yaml
v2_3_real_vcpchat_execute_once_authorization_preplan:
  status: execute_once_authorization_preplan_only
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

v2.3 不再继续扩展“空模板链”，而是把 v2.2 的五段读取前置链收束为未来真正执行一次只读读取时必须满足的授权前规划。它用于定义：

- 未来谁能批准一次性读取执行。
- 读取命令如何在仓库外绑定。
- 精确 allowlist 如何在仓库外持有。
- 仓库内如何只保存脱敏引用。
- 读取结果如何进入脱敏审查。
- 读取失败、停止和回滚如何记录。
- 为什么一次读取执行不等于 VCPChat 修改授权。

本阶段只规划授权链，不执行读取。

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

## Required Upstream Gates

```yaml
required_upstream_gates:
  v2_2_authorization_fill_exists: true
  v2_2_filled_authorization_review_gate_exists: true
  v2_2_final_authorization_preflight_exists: true
  v2_2_one_time_read_authorization_request_exists: true
  v2_2_execution_preflight_exists: true
  one_time_read_authorized: false
  execution_preflight_passed: false
  read_command_bound: false
```

本阶段样例仍保持所有授权状态为 `false`。未来只有用户单独授权并完成 v2.2 全链条复核后，才能进入真实读取执行请求。

## Execute-once Authorization Chain

未来一次性读取执行授权必须按以下顺序发生：

```text
v2.2 authorization fill
→ filled authorization review gate
→ final authorization preflight
→ one-time read authorization request
→ one-time read execution preflight
→ v2.3 execute-once authorization request
→ execute-once read performed
→ sanitized read result review
```

本阶段只定义 `v2.3 execute-once authorization request` 前的规划，不创建真实执行请求。

## Authorization Packet Shape

```yaml
execute_once_authorization_packet:
  packet_id: string
  based_on_execution_preflight_id: string
  execute_once_authorization_required: true
  execute_once_authorization_requested: false
  execute_once_authorization_granted: false
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

## Pre-authorization Checks

未来执行授权前必须确认：

- v2.2 五段链条均存在。
- 执行 preflight 没有失败项。
- 读取命令只读。
- 读取范围只包含精确 allowlist。
- 读取命令和 allowlist 均不写入 Git。
- 读取次数限制为一次。
- 输出只能进入脱敏审查。
- 读取结果不得直接变成代码实现。
- 读取结果不得直接写 DailyNote 或 VCP 长期记忆。
- 读取结果不得包含图片二进制。

## Stop Conditions

未来执行授权前如出现以下情况，必须停止：

- 请求把真实路径、读取命令或 raw source 写入仓库。
- 请求读取未授权路径。
- 请求读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 请求递归扫描未授权目录。
- 请求写文件、启动 VCPChat 或修改 VCPChat。
- 请求创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求调用插件、API、DailyNote、VCP 记忆或图片写入。
- 发现 secret、endpoint 原文、私密路径、客户隐私、runtime log 原文或 IPC payload 原文。

## Acceptance

- execute-once authorization preplan 文档存在。
- execute-once authorization preplan contract 存在。
- execute-once authorization preplan 样例存在。
- validation checklist 包含 v2.3 execute-once authorization preplan 检查项。
- 样例保持 `execute_once_authorization_requested=false`。
- 样例保持 `execute_once_authorization_granted=false`。
- 样例保持 `one_time_read_authorized=false`。
- 样例保持 `execution_preflight_passed=false`。
- 样例保持 `read_command_bound=false`。
- 样例保持 `read_command_executed=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `exact_real_paths_stored_in_git=false`。
- 样例不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_3_patch_02_execute_once_authorization_request_template
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - execute-once authorization packet
    - human approver
    - external read scope reference
    - external read command reference
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

