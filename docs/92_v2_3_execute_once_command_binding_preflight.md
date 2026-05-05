# 92 v2.3 Execute-once Command Binding Preflight

本文定义 Agent Image Lab v2.3 第三阶段的“真实 VCPChat 一次性读取命令绑定 preflight”。该阶段只创建未来读取命令绑定前的检查记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不保存真实命令，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Command Binding Decision

```yaml
v2_3_execute_once_command_binding_preflight:
  status: command_binding_preflight_template_only
  command_binding_preflight_requested: false
  command_binding_preflight_passed: false
  execute_once_authorization_granted: false
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

本阶段把 v2.3 Patch 02 的“执行授权请求模板”推进到“命令绑定 preflight”。它用于未来确认：

- 授权请求已经由人类批准。
- 外部读取命令引用存在，但命令文本不进入 Git。
- 外部 allowlist 引用存在，但真实路径不进入 Git。
- 命令用途只限一次性只读读取。
- 命令不得启动或修改 VCPChat。
- 命令不得调用插件、API、DailyNote 或 VCP 记忆。
- 命令输出只允许进入脱敏审查。

本阶段只补齐命令绑定检查模板，不绑定真实命令，不执行读取。

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
required_authorization_inputs:
  execute_once_authorization_request_exists: true
  execute_once_authorization_requested: false
  execute_once_authorization_granted: false
  authorized_by: null
  authorized_at: null
  read_scope_ref: redacted_allowlist_reference
  read_command_ref: redacted_read_command_reference
  read_attempt_limit: 1
  read_attempt_used: 0
  read_command_executed: false
```

本阶段样例仍保持授权未请求、未批准、命令未绑定、命令未执行。

## Command Binding Preflight Shape

```yaml
command_binding_preflight:
  preflight_id: string
  request_id: string
  command_binding_preflight_required: true
  command_binding_preflight_requested: false
  command_binding_preflight_passed: false
  read_scope_ref: redacted_allowlist_reference
  read_command_ref: redacted_read_command_reference
  read_command_bound: false
  read_command_id: null
  read_command_executed: false
  read_attempt_limit: 1
  read_attempt_used: 0
  exact_real_paths_stored_in_git: false
  source_read_performed: false
  real_vcpchat_source_read: false
  raw_source_copy_allowed: false
```

`read_command_id` 和 `read_command_ref` 只能是脱敏引用，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Binding Checks

未来命令绑定前必须确认：

- 命令引用在仓库外持有。
- allowlist 引用在仓库外持有。
- 命令只读。
- 命令只读取精确 allowlist。
- 命令不会递归扫描未授权目录。
- 命令不会读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 命令不会写文件。
- 命令不会启动或修改 VCPChat。
- 命令不会创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 命令不会调用插件、API、DailyNote 或 VCP 记忆。

## Rejection Conditions

必须拒绝以下命令绑定请求：

- 命令文本、真实路径或 raw source 被写入仓库。
- 命令引用无法与外部授权上下文对应。
- allowlist 引用无法与外部授权上下文对应。
- 命令包含写操作、启动 VCPChat、修改 VCPChat 或递归扫描未授权目录。
- 命令可能读取配置、日志、环境变量、credential、密钥文件或客户数据。
- 命令可能调用插件、API、DailyNote、VCP 记忆或图片写入。
- 命令可能输出真实路径、raw source、endpoint 原文、secret 或客户隐私。

## Acceptance

- execute-once command binding preflight 文档存在。
- execute-once command binding preflight contract 存在。
- execute-once command binding preflight 样例存在。
- validation checklist 包含 v2.3 command binding preflight 检查项。
- 样例保持 `command_binding_preflight_requested=false`。
- 样例保持 `command_binding_preflight_passed=false`。
- 样例保持 `execute_once_authorization_granted=false`。
- 样例保持 `read_command_bound=false`。
- 样例保持 `read_command_executed=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `exact_real_paths_stored_in_git=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_3_patch_04_execute_once_final_read_authorization_gate
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - command binding preflight
    - external read command reference
    - external read scope reference
    - final human authorization
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

