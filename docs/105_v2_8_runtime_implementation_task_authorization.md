# 105 v2.8 Runtime Implementation Task Authorization

本文定义 Agent Image Lab v2.8 第一阶段的 runtime implementation task authorization。该阶段接在 v2.7 runtime implementation planning gate 之后，只定义未来单个具体实现 patch 必须持有的任务授权票据。本文不读取真实 VCPChat，不读取真实 VCPToolBox，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Authorization Status

```yaml
v2_8_runtime_implementation_task_authorization:
  status: runtime_implementation_task_authorization_template_only
  runtime_implementation_task_authorization_required: true
  runtime_implementation_task_authorization_requested: false
  runtime_implementation_task_authorization_granted: false
  runtime_implementation_planning_approved: false
  authorized_task_id: null
  authorized_file_scope_ref: null
  authorized_rollback_plan_ref: null
  authorized_validation_plan_ref: null
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

v2.8 的目标是把“实现规划门”推进为“具体实现任务授权点”。它只回答：

- 未来某一次实现 patch 必须持有哪些授权字段。
- 授权票据必须如何限定文件范围、创建范围、IPC channel、preload API、renderer 入口。
- 授权票据必须如何引用回滚计划和验证计划。
- 哪些动作即使在未来授权后也不得自动扩展。
- 哪些情况必须拒绝任务授权。

本阶段只补齐 task authorization 模板，不授权任何真实实现任务，不写任何运行时代码。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实根目录、真实 allowlist 路径或真实读取命令。
- 不填真实路径，不填真实文件名。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取环境文件、credential、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer runtime 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不写资产，不创建图片文件。

## Required Authorization Inputs

```yaml
required_authorization_inputs:
  runtime_implementation_planning_gate_exists: true
  runtime_implementation_planning_approved: false
  runtime_implementation_task_authorization_required: true
  runtime_implementation_task_authorization_requested: false
  runtime_implementation_task_authorization_granted: false
  authorized_task_id: null
  authorized_file_scope_ref: null
  authorized_rollback_plan_ref: null
  authorized_validation_plan_ref: null
  implementation_task_authorizer: null
  implementation_task_authorized_at: null
```

当前样例仍保持实现规划未批准、任务授权未请求、授权任务和范围引用均为空。

## Authorization Record Shape

```yaml
runtime_implementation_task_authorization:
  authorization_id: string
  runtime_implementation_planning_gate_id: string
  runtime_implementation_task_authorization_required: true
  runtime_implementation_task_authorization_requested: false
  runtime_implementation_task_authorization_granted: false
  implementation_task_authorizer: null
  implementation_task_authorized_at: null
  authorized_task_id: null
  authorized_file_scope_ref: null
  authorized_rollback_plan_ref: null
  authorized_validation_plan_ref: null
  audit_summary_cn: string
```

`runtime_implementation_planning_gate_id` 只能引用 v2.7 实现规划门记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Future Authorized Scope Fields

未来单个实现任务授权票据必须显式限定以下字段，但本阶段样例不得填真实路径或真实文件名：

```yaml
future_authorized_scope_fields:
  allowed_modify_files: []
  allowed_create_files: []
  forbidden_modify_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  allowed_preload_api_names: []
  allowed_renderer_entry_points: []
  allowed_validation_commands: []
  allowed_rollback_steps: []
```

这些字段必须在未来单次实现授权中具体填写。授权不得通过“继续”自动扩大范围。

## Authorization Rules

未来具体实现任务授权必须遵守：

- `runtime_implementation_task_authorization_granted=true` 只能由人工审查产生。
- 授权只覆盖单个实现 patch，不覆盖后续追加任务。
- 授权必须列出允许修改文件、允许创建文件、禁止修改文件、禁止创建文件。
- 授权必须列出允许的 IPC channel、preload API 名称和 renderer 入口。
- 授权必须引用回滚计划和验证计划。
- 授权不得包含真实 secret、客户隐私、raw source、raw IPC payload 或 raw plugin output。
- DailyNote、VCP 记忆、资产写入、插件调用和 API 调用仍需各自独立授权。
- 任何未列在授权票据中的文件、命令或动作都必须拒绝。

## Rejection Conditions

必须拒绝以下 runtime implementation task authorization 记录：

- runtime implementation planning 未批准，却请求具体实现任务授权。
- `authorized_task_id`、文件范围、回滚计划或验证计划缺失，却宣称可进入实现。
- allowed scope 为空却宣称可以写代码。
- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- 授权票据暗示允许自动扩展到其他文件或后续任务。
- 授权票据暗示已经允许插件、API、DailyNote、VCP 记忆、资产写入或图片创建。

## Acceptance

- runtime implementation task authorization 文档存在。
- runtime implementation task authorization contract 存在。
- runtime implementation task authorization 样例存在。
- validation checklist 包含 v2.8 implementation task authorization 检查项。
- 样例保持 `runtime_implementation_task_authorization_required=true`。
- 样例保持 `runtime_implementation_task_authorization_requested=false`。
- 样例保持 `runtime_implementation_task_authorization_granted=false`。
- 样例保持 `runtime_implementation_planning_approved=false`。
- 样例保持 `authorized_task_id=null`。
- 样例保持 `authorized_file_scope_ref=null`。
- 样例保持 `authorized_rollback_plan_ref=null`。
- 样例保持 `authorized_validation_plan_ref=null`。
- 样例保持 `allowed_modify_files=[]`。
- 样例保持 `allowed_create_files=[]`。
- 样例保持 `allowed_ipc_channels=[]`。
- 样例保持 `ipc_handler_creation_authorized=false`。
- 样例保持 `preload_runtime_creation_authorized=false`。
- 样例保持 `renderer_runtime_creation_authorized=false`。
- 样例保持 `real_vcpchat_modification_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_8_closeout_or_v2_9_runtime_patch_preflight
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - implementation task authorization review
    - concrete file scope
    - concrete rollback plan
    - concrete validation plan
    - explicit implementation patch approval
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

