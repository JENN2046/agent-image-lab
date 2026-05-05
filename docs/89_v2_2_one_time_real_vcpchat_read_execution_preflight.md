# 89 v2.2 One-time Real VCPChat Read Execution Preflight

本文定义 Agent Image Lab v2.2 第五阶段的“一次性真实 VCPChat 读取执行 preflight”。该阶段只创建未来真实读取执行前最后预检的记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Execution Preflight Decision

```yaml
v2_2_one_time_real_vcpchat_read_execution_preflight:
  status: execution_preflight_template_only
  one_time_read_authorized: false
  execution_preflight_requested: false
  execution_preflight_passed: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  read_command_bound: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.2 Patch 04 的“一次性读取授权请求模板”推进到“读取执行前最后预检”。它用于未来真实读取前确认：

- 一次性读取授权请求已经在独立授权点获批。
- 读取命令已绑定，但命令本身保持只读。
- 读取范围只引用外部授权上下文中的精确 allowlist。
- 仓库内不保存真实路径。
- 输出策略只允许中文脱敏摘要。
- 停止条件、审查人和失败处理已确认。
- 读取后不得自动进入 VCPChat 修改或代码实现。

本阶段只补齐预检模板，不执行读取。

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

## Required Authorization Inputs

```yaml
required_authorization_inputs:
  one_time_authorization_request_exists: true
  one_time_read_requested: false
  one_time_read_authorized: false
  authorized_by: null
  authorized_at: null
  read_command_approved: false
  read_scope_ref: redacted_allowlist_reference
  read_attempt_limit: 1
  stop_conditions_confirmed: false
  post_read_boundaries_confirmed: false
```

本阶段样例仍保持一次性读取未授权、读取命令未批准。未来只有这些输入全部在独立授权中通过，才能进入真实读取执行授权点。

## Execution Preflight Shape

```yaml
execution_preflight:
  preflight_id: string
  request_id: string
  execution_preflight_required: true
  execution_preflight_requested: false
  execution_preflight_passed: false
  read_command_bound: false
  read_command_id: null
  read_scope_ref: redacted_allowlist_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  exact_real_paths_stored_in_git: false
  source_read_performed: false
  real_vcpchat_source_read: false
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

`read_command_id` 只能在未来独立授权点绑定，只能代表只读读取命令，不得包含真实路径、shell 片段、endpoint、secret 或可执行插件调用。

## Command Safety Constraints

未来执行 preflight 即使通过，也必须确认读取命令满足：

- 只读。
- 只读取精确 allowlist。
- 不递归扫描未授权目录。
- 不读取配置、日志、环境变量、credential 或客户数据。
- 不输出真实路径。
- 不输出 raw source。
- 不写文件。
- 不启动 VCPChat。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不重复执行超过一次。

## Allowed Execution Result Envelope

未来真实读取的结果 envelope 只能进入脱敏审查，不得直接进入实现或记忆写入：

```yaml
allowed_execution_result_envelope:
  read_attempt_id: string
  source_read_performed: boolean
  result_status: pending_sanitized_review
  sanitized_summary_required: true
  raw_source_copied: false
  real_local_path_copied: false
  direct_implementation_allowed: false
  daily_note_write_allowed: false
  vcp_memory_write_allowed: false
```

本阶段不生成读取结果 envelope，只定义未来结果必须遵守的形态。

## Stop Conditions

执行 preflight 或未来读取准备过程中出现以下情况，必须停止：

- 请求保存真实路径或 raw source。
- 请求读取未授权路径。
- 请求读取配置、日志、环境变量、credential 或客户数据。
- 请求递归扫描未授权目录。
- 请求写文件、启动 VCPChat 或修改 VCPChat。
- 请求创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求调用插件、API、DailyNote、VCP 记忆或图片写入。
- 发现 secret、endpoint 原文、私密路径、客户隐私、runtime log 原文或 IPC payload 原文。

## Acceptance

- one-time real VCPChat read execution preflight 文档存在。
- one-time real VCPChat read execution preflight contract 存在。
- one-time real VCPChat read execution preflight 样例存在。
- validation checklist 包含 v2.2 one-time read execution preflight 检查项。
- 样例保持 `one_time_read_authorized=false`。
- 样例保持 `execution_preflight_requested=false`。
- 样例保持 `execution_preflight_passed=false`。
- 样例保持 `source_read_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `read_command_bound=false`。
- 样例保持 `read_attempt_used=0`。
- 样例保持 `exact_real_paths_stored_in_git=false`。
- 样例不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_2_patch_06_one_time_real_vcpchat_read_execute_once
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - one_time_read_authorized
    - execution_preflight_passed
    - read_command_bound
    - read scope held outside git
    - stop conditions accepted
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

