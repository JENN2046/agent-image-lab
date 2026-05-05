# 107 v3.0 First Runtime Patch Authorization

本文定义 Agent Image Lab v3.0 第一阶段的 first runtime patch authorization。该阶段接在 v2.9 runtime patch preflight 之后，只提供第一次真实 runtime patch 的授权填写模板。本文不读取真实 VCPChat，不读取真实 VCPToolBox，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Authorization Status

```yaml
v3_0_first_runtime_patch_authorization:
  status: first_runtime_patch_authorization_template_only
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_requested: false
  first_runtime_patch_authorization_granted: false
  runtime_patch_preflight_passed: false
  authorized_task_id: null
  patch_objective_cn: null
  allowed_modify_files: []
  allowed_create_files: []
  forbidden_modify_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  allowed_preload_api_names: []
  allowed_renderer_entry_points: []
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
  electron_boundary_confirmed: false
  implementation_patch_authorized: false
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

v3.0 的目标是把“runtime patch preflight”推进为“第一次真实 runtime patch 授权填写模板”。它只回答：

- 第一次真实 runtime patch 需要人工填写哪些授权字段。
- 哪些文件范围、IPC channel、preload API 和 renderer 入口必须被明确列出。
- 回滚计划、验证计划、停止条件和 Electron 边界如何成为授权前置条件。
- 哪些条件不满足时必须拒绝进入真实实现。
- 为什么填写模板不等于授权写代码。

本阶段只补齐授权填写模板，不读取真实源码，不写任何运行时代码。

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
  runtime_patch_preflight_exists: true
  runtime_patch_preflight_passed: false
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_requested: false
  first_runtime_patch_authorization_granted: false
  authorized_task_id: null
  patch_objective_cn: null
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
  first_patch_authorizer: null
  first_patch_authorized_at: null
```

当前样例仍保持 preflight 未通过、首次 patch 授权未请求、任务 ID、目标、回滚计划、验证计划和停止条件均为空。

## Authorization Record Shape

```yaml
first_runtime_patch_authorization:
  authorization_id: string
  runtime_patch_preflight_id: string
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_requested: false
  first_runtime_patch_authorization_granted: false
  first_patch_authorizer: null
  first_patch_authorized_at: null
  authorized_task_id: null
  patch_objective_cn: null
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
  audit_summary_cn: string
```

`runtime_patch_preflight_id` 只能引用 v2.9 preflight 记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Required Future Fill Fields

未来第一次真实 runtime patch 授权必须由人工填写：

```yaml
future_fill_fields:
  authorized_task_id: null
  patch_objective_cn: null
  allowed_modify_files: []
  allowed_create_files: []
  forbidden_modify_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  allowed_preload_api_names: []
  allowed_renderer_entry_points: []
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
```

本阶段样例不得填真实路径、真实文件名、真实命令或真实 VCPChat 文件结构。未来授权必须逐项填写，不能由“继续”自动推断或扩大范围。

## Electron Boundary Requirements

未来第一次真实 runtime patch 授权前必须确认：

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

未来第一次 runtime patch 授权必须遵守：

- `first_runtime_patch_authorization_granted=true` 只能由人工审查产生。
- 授权只覆盖第一张授权票据列出的单个实现 patch。
- 授权必须列出允许修改文件、允许创建文件、禁止修改文件、禁止创建文件。
- 授权必须列出允许的 IPC channel、preload API 名称和 renderer 入口。
- 授权必须引用回滚计划、验证计划和停止条件。
- 授权不得包含真实 secret、客户隐私、raw source、raw IPC payload 或 raw plugin output。
- DailyNote、VCP 记忆、资产写入、插件调用和 API 调用仍需各自独立授权。
- 任何未列在授权票据中的文件、命令或动作都必须拒绝。

## Rejection Conditions

必须拒绝以下 first runtime patch authorization 记录：

- runtime patch preflight 未通过，却请求第一次 runtime patch 授权。
- `authorized_task_id`、目标、文件范围、回滚计划、验证计划或停止条件缺失，却宣称可进入实现。
- allowed scope 为空却宣称可以写代码。
- Electron 边界未确认却宣称可以创建 IPC/preload/renderer 代码。
- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- 授权票据暗示允许自动扩展到其他文件或后续任务。
- 授权票据暗示已经允许插件、API、DailyNote、VCP 记忆、资产写入或图片创建。

## Acceptance

- first runtime patch authorization 文档存在。
- first runtime patch authorization contract 存在。
- first runtime patch authorization 样例存在。
- validation checklist 包含 v3.0 first runtime patch authorization 检查项。
- 样例保持 `first_runtime_patch_authorization_required=true`。
- 样例保持 `first_runtime_patch_authorization_requested=false`。
- 样例保持 `first_runtime_patch_authorization_granted=false`。
- 样例保持 `runtime_patch_preflight_passed=false`。
- 样例保持 `authorized_task_id=null`。
- 样例保持 `patch_objective_cn=null`。
- 样例保持 `allowed_modify_files=[]`。
- 样例保持 `allowed_create_files=[]`。
- 样例保持 `allowed_ipc_channels=[]`。
- 样例保持 `rollback_plan_ref=null`。
- 样例保持 `validation_plan_ref=null`。
- 样例保持 `stop_conditions_ref=null`。
- 样例保持 `electron_boundary_confirmed=false`。
- 样例保持 `implementation_patch_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v3_0_closeout_or_v3_1_first_runtime_patch_scope_fill
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - first runtime patch authorization review
    - explicit task id
    - concrete patch objective
    - concrete file scope
    - concrete rollback plan
    - concrete validation plan
    - explicit approval for any real VCPChat read or modification
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

