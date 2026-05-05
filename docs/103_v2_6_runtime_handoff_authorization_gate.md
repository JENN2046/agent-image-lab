# 103 v2.6 Runtime Handoff Authorization Gate

本文定义 Agent Image Lab v2.6 第二阶段的 runtime handoff authorization gate。该阶段接在 Review Console runtime handoff planning 之后，只说明未来 handoff planning 被人工复核后，仍必须经过独立授权门才能进入下一阶段。本文不读取真实 VCPChat，不读取真实 VCPToolBox，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Gate Status

```yaml
v2_6_runtime_handoff_authorization_gate:
  status: runtime_handoff_authorization_gate_template_only
  runtime_handoff_authorization_required: true
  runtime_handoff_authorization_requested: false
  runtime_handoff_authorization_granted: false
  runtime_handoff_planning_completed: false
  route_specific_authorization_granted: false
  implementation_planning_authorized: false
  ipc_handler_creation_authorized: false
  preload_runtime_creation_authorized: false
  renderer_runtime_creation_authorized: false
  real_vcpchat_modification_authorized: false
  daily_note_write_authorized: false
  vcp_memory_write_authorized: false
  asset_write_authorized: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.6 Patch 01 的 runtime handoff planning 收束为“handoff 授权门”。它用于未来确认：

- runtime handoff planning 完成不等于授权实现。
- runtime handoff authorization granted 也只允许进入下一阶段 implementation planning，不等于创建 IPC/preload/renderer 代码。
- route-specific authorization gate 未通过时，不得请求 runtime handoff 授权。
- 任何授权门记录不得包含 raw source、真实路径、真实读取命令、endpoint 原文、secret 或客户隐私。
- 下一阶段若要创建真实运行时代码，必须另行授权并列出文件范围、回滚路径和验证命令。

本阶段只补齐授权门模板，不批准 handoff，不进入实现规划。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实根目录、真实 allowlist 路径或真实读取命令。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取环境文件、credential、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer runtime 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不写资产，不创建图片文件。

## Required Authorization Inputs

```yaml
required_authorization_inputs:
  runtime_handoff_plan_exists: true
  runtime_handoff_planning_completed: false
  route_specific_authorization_granted: false
  runtime_handoff_authorization_required: true
  runtime_handoff_authorization_requested: false
  runtime_handoff_authorization_granted: false
  runtime_handoff_authorizer: null
  runtime_handoff_authorized_at: null
```

当前样例仍保持 handoff planning 未完成、路线专属授权未授予、runtime handoff 授权未请求、未授予任何后续动作。

## Authorization Record Shape

```yaml
runtime_handoff_authorization_gate:
  gate_id: string
  handoff_id: string
  runtime_handoff_authorization_required: true
  runtime_handoff_authorization_requested: false
  runtime_handoff_authorization_granted: false
  runtime_handoff_authorizer: null
  runtime_handoff_authorized_at: null
  implementation_planning_authorized: false
  ipc_handler_creation_authorized: false
  preload_runtime_creation_authorized: false
  renderer_runtime_creation_authorized: false
  real_vcpchat_modification_authorized: false
  audit_summary_cn: string
```

`handoff_id` 只能引用 runtime handoff planning 记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Authorization Rules

未来 runtime handoff 授权门必须遵守：

- `runtime_handoff_authorization_granted=true` 只能由人工审查产生。
- `runtime_handoff_authorization_granted=true` 不等于授权创建 IPC handler。
- `runtime_handoff_authorization_granted=true` 不等于授权创建 preload 或 renderer runtime 代码。
- `runtime_handoff_authorization_granted=true` 不等于授权修改真实 VCPChat。
- `implementation_planning_authorized=true` 只能进入下一阶段规划，不得自动写代码。
- DailyNote、VCP 记忆、资产写入、插件调用和 API 调用仍需各自独立授权。
- 任何授权门都不得绕过 schema、Electron 边界和敏感信息复核。

## Rejection Conditions

必须拒绝以下 runtime handoff authorization gate 记录：

- route-specific authorization 未授予，却请求 runtime handoff 授权。
- handoff planning 未完成，却宣称可以进入 implementation planning。
- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- 授权记录暗示已经允许创建 IPC handler、preload、renderer runtime 或修改真实 VCPChat。
- 授权记录暗示已经允许插件、API、DailyNote、VCP 记忆、资产写入或图片创建。

## Acceptance

- runtime handoff authorization gate 文档存在。
- runtime handoff authorization gate contract 存在。
- runtime handoff authorization gate 样例存在。
- validation checklist 包含 v2.6 authorization gate 检查项。
- 样例保持 `runtime_handoff_authorization_required=true`。
- 样例保持 `runtime_handoff_authorization_requested=false`。
- 样例保持 `runtime_handoff_authorization_granted=false`。
- 样例保持 `runtime_handoff_planning_completed=false`。
- 样例保持 `route_specific_authorization_granted=false`。
- 样例保持 `implementation_planning_authorized=false`。
- 样例保持 `ipc_handler_creation_authorized=false`。
- 样例保持 `preload_runtime_creation_authorized=false`。
- 样例保持 `renderer_runtime_creation_authorized=false`。
- 样例保持 `real_vcpchat_modification_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_6_closeout_or_v2_7_runtime_implementation_planning_gate
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - runtime handoff authorization gate review
    - no raw source confirmation
    - no execution confirmation
    - human decision for next phase
  forbidden_without_next_authorization:
    - write implementation code
    - create IPC handler
    - create preload code
    - create renderer runtime code
    - modify VCPChat
    - call plugin
    - call API
    - call DailyNote
    - write VCP memory
    - write assets
```

