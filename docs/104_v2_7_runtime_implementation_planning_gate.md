# 104 v2.7 Runtime Implementation Planning Gate

本文定义 Agent Image Lab v2.7 第一阶段的 runtime implementation planning gate。该阶段接在 v2.6 runtime handoff authorization gate 之后，只规划未来进入实现任务前必须满足的授权链、文件范围、回滚方案和验证要求。本文不读取真实 VCPChat，不读取真实 VCPToolBox，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Gate Status

```yaml
v2_7_runtime_implementation_planning_gate:
  status: runtime_implementation_planning_gate_template_only
  runtime_implementation_planning_required: true
  runtime_implementation_planning_requested: false
  runtime_implementation_planning_approved: false
  runtime_handoff_authorization_granted: false
  implementation_file_scope_declared: false
  rollback_plan_declared: false
  validation_plan_declared: false
  electron_boundary_review_completed: false
  ipc_handler_creation_authorized: false
  preload_runtime_creation_authorized: false
  renderer_runtime_creation_authorized: false
  real_vcpchat_modification_authorized: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
  real_execution_allowed: false
```

## Goal

v2.7 的目标是把 runtime handoff 授权门推进为“实现规划门”。它只回答：

- 如果未来要写 runtime integration 代码，必须先声明哪些文件范围。
- 如果未来要创建 IPC/preload/renderer 代码，必须先通过哪些授权项。
- Electron 安全边界、schema mapping、回滚路径和验证命令必须如何进入实现规划。
- 什么情况下必须拒绝实现规划申请。
- 哪些动作必须留到下一独立实现授权点。

本阶段只补齐 implementation planning gate，不读取真实源码，不写任何运行时代码。

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

## Required Planning Inputs

```yaml
required_planning_inputs:
  runtime_handoff_authorization_gate_exists: true
  runtime_handoff_authorization_granted: false
  runtime_implementation_planning_required: true
  runtime_implementation_planning_requested: false
  runtime_implementation_planning_approved: false
  implementation_file_scope_declared: false
  rollback_plan_declared: false
  validation_plan_declared: false
  electron_boundary_review_completed: false
  implementation_planning_reviewer: null
  implementation_planning_reviewed_at: null
```

当前样例仍保持 runtime handoff 授权未授予、实现规划未请求、文件范围未声明、回滚和验证计划未声明。

## Planning Record Shape

```yaml
runtime_implementation_planning_gate:
  gate_id: string
  runtime_handoff_authorization_gate_id: string
  runtime_implementation_planning_required: true
  runtime_implementation_planning_requested: false
  runtime_implementation_planning_approved: false
  implementation_planning_reviewer: null
  implementation_planning_reviewed_at: null
  implementation_file_scope_declared: false
  rollback_plan_declared: false
  validation_plan_declared: false
  electron_boundary_review_completed: false
  audit_summary_cn: string
```

`runtime_handoff_authorization_gate_id` 只能引用 v2.6 授权门记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Required Future Scope Fields

未来实现规划申请必须单独列出以下字段，但本阶段样例不得填真实路径或真实文件名：

```yaml
future_required_scope_fields:
  allowed_modify_files: []
  forbidden_modify_files: []
  allowed_create_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  preload_allowlist_api_names: []
  renderer_entry_points: []
  rollback_plan_ref: null
  validation_commands_ref: null
```

这些字段只能在未来授权点用脱敏引用或明确文件范围填写，不得在本阶段推测真实 VCPChat 文件结构。

## Electron Boundary Requirements

未来 implementation planning 必须复核：

- `contextIsolation=true`
- `nodeIntegration=false`
- preload 只暴露最小 allowlist API。
- IPC sender 必须校验来源窗口。
- IPC channel 必须使用固定 allowlist。
- payload 必须做 schema 校验。
- renderer 不得直接访问文件系统、网络、DailyNote、插件或 shell。
- 不得通过 URL、浏览器存储、剪贴板或日志传递敏感信息。

本阶段只记录这些要求，不实现任何 Electron 代码。

## Authorization Rules

未来实现规划门必须遵守：

- `runtime_implementation_planning_approved=true` 只能由人工审查产生。
- `runtime_implementation_planning_approved=true` 不等于授权写 IPC handler。
- `runtime_implementation_planning_approved=true` 不等于授权写 preload 或 renderer runtime 代码。
- `runtime_implementation_planning_approved=true` 不等于授权修改真实 VCPChat。
- 真实文件修改必须另行授权，且必须列出允许修改文件、禁止修改文件、回滚方式和验证命令。
- DailyNote、VCP 记忆、资产写入、插件调用和 API 调用仍需各自独立授权。

## Rejection Conditions

必须拒绝以下 runtime implementation planning gate 记录：

- runtime handoff 授权未授予，却请求实现规划批准。
- 文件范围、回滚计划或验证计划缺失，却宣称可进入实现。
- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- 记录暗示已经允许创建 IPC handler、preload、renderer runtime 或修改真实 VCPChat。
- 记录暗示已经允许插件、API、DailyNote、VCP 记忆、资产写入或图片创建。

## Acceptance

- runtime implementation planning gate 文档存在。
- runtime implementation planning gate contract 存在。
- runtime implementation planning gate 样例存在。
- validation checklist 包含 v2.7 implementation planning gate 检查项。
- 样例保持 `runtime_implementation_planning_required=true`。
- 样例保持 `runtime_implementation_planning_requested=false`。
- 样例保持 `runtime_implementation_planning_approved=false`。
- 样例保持 `runtime_handoff_authorization_granted=false`。
- 样例保持 `implementation_file_scope_declared=false`。
- 样例保持 `rollback_plan_declared=false`。
- 样例保持 `validation_plan_declared=false`。
- 样例保持 `electron_boundary_review_completed=false`。
- 样例保持 `ipc_handler_creation_authorized=false`。
- 样例保持 `preload_runtime_creation_authorized=false`。
- 样例保持 `renderer_runtime_creation_authorized=false`。
- 样例保持 `real_vcpchat_modification_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_7_closeout_or_v2_8_runtime_implementation_task_authorization
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - runtime implementation planning gate review
    - file scope declaration
    - rollback plan declaration
    - validation plan declaration
    - Electron boundary review
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

