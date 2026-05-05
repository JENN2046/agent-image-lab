# 106 v2.9 Runtime Patch Preflight

本文定义 Agent Image Lab v2.9 第一阶段的 runtime patch preflight。该阶段接在 v2.8 runtime implementation task authorization 之后，只定义真正写代码前的最后 preflight 门槛。本文不读取真实 VCPChat，不读取真实 VCPToolBox，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Preflight Status

```yaml
v2_9_runtime_patch_preflight:
  status: runtime_patch_preflight_template_only
  runtime_patch_preflight_required: true
  runtime_patch_preflight_requested: false
  runtime_patch_preflight_passed: false
  runtime_implementation_task_authorization_granted: false
  authorized_task_id: null
  authorized_file_scope_ref: null
  authorized_rollback_plan_ref: null
  authorized_validation_plan_ref: null
  file_scope_ready: false
  rollback_plan_ready: false
  validation_plan_ready: false
  electron_boundary_ready: false
  stop_conditions_ready: false
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

v2.9 的目标是把“具体实现任务授权点”推进为“runtime patch preflight”。它只回答：

- 写代码前是否已经有单次任务授权票据。
- 文件范围、回滚计划、验证计划和停止条件是否已经齐全。
- Electron 安全边界是否已经复核。
- 哪些条件不满足时必须拒绝进入 implementation patch。
- 即使 preflight 未来通过，为什么仍不能由 preflight 自动写代码。

本阶段只补齐 preflight 模板，不授权实现，不写任何运行时代码。

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

## Required Preflight Inputs

```yaml
required_preflight_inputs:
  runtime_implementation_task_authorization_exists: true
  runtime_implementation_task_authorization_granted: false
  runtime_patch_preflight_required: true
  runtime_patch_preflight_requested: false
  runtime_patch_preflight_passed: false
  authorized_task_id: null
  authorized_file_scope_ref: null
  authorized_rollback_plan_ref: null
  authorized_validation_plan_ref: null
  preflight_reviewer: null
  preflight_reviewed_at: null
```

当前样例仍保持任务授权未授予、preflight 未请求、授权任务和计划引用均为空。

## Preflight Record Shape

```yaml
runtime_patch_preflight:
  preflight_id: string
  task_authorization_id: string
  runtime_patch_preflight_required: true
  runtime_patch_preflight_requested: false
  runtime_patch_preflight_passed: false
  preflight_reviewer: null
  preflight_reviewed_at: null
  file_scope_ready: false
  rollback_plan_ready: false
  validation_plan_ready: false
  electron_boundary_ready: false
  stop_conditions_ready: false
  implementation_patch_authorized: false
  audit_summary_cn: string
```

`task_authorization_id` 只能引用 v2.8 具体实现任务授权记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Required Readiness Checks

未来 runtime patch preflight 必须确认：

- `authorized_task_id` 已存在。
- `authorized_file_scope_ref` 已存在。
- `authorized_rollback_plan_ref` 已存在。
- `authorized_validation_plan_ref` 已存在。
- 允许修改和创建的文件范围明确，且禁止范围明确。
- Electron 边界已确认：`contextIsolation=true`、`nodeIntegration=false`、IPC sender 校验、payload schema 校验。
- 停止条件已明确：发现敏感信息、越权文件、未授权命令、验证失败或用户工作区冲突时必须停止。

本阶段样例不得填真实路径、真实文件名或真实命令。

## Preflight Rules

未来 runtime patch preflight 必须遵守：

- `runtime_patch_preflight_passed=true` 只能由人工审查产生。
- `runtime_patch_preflight_passed=true` 不等于自动写代码。
- `implementation_patch_authorized=true` 只能进入下一独立 implementation patch 授权点。
- preflight 只覆盖单个授权任务，不覆盖后续追加任务。
- 任何未列在授权票据中的文件、命令或动作都必须拒绝。
- DailyNote、VCP 记忆、资产写入、插件调用和 API 调用仍需各自独立授权。

## Rejection Conditions

必须拒绝以下 runtime patch preflight 记录：

- runtime implementation task authorization 未授予，却请求 preflight 通过。
- `authorized_task_id`、文件范围、回滚计划或验证计划缺失，却宣称可以进入 implementation patch。
- Electron 边界未复核，却宣称可以创建 IPC/preload/renderer 代码。
- raw source、完整函数体或源码片段被写入仓库。
- 真实路径、真实读取命令或 endpoint 原文被写入仓库。
- 环境变量值、credential、密钥文件、token、cookie、密码或客户隐私进入任何摘要。
- preflight 记录暗示允许自动扩展到其他文件或后续任务。
- preflight 记录暗示已经允许插件、API、DailyNote、VCP 记忆、资产写入或图片创建。

## Acceptance

- runtime patch preflight 文档存在。
- runtime patch preflight contract 存在。
- runtime patch preflight 样例存在。
- validation checklist 包含 v2.9 runtime patch preflight 检查项。
- 样例保持 `runtime_patch_preflight_required=true`。
- 样例保持 `runtime_patch_preflight_requested=false`。
- 样例保持 `runtime_patch_preflight_passed=false`。
- 样例保持 `runtime_implementation_task_authorization_granted=false`。
- 样例保持 `authorized_task_id=null`。
- 样例保持 `authorized_file_scope_ref=null`。
- 样例保持 `authorized_rollback_plan_ref=null`。
- 样例保持 `authorized_validation_plan_ref=null`。
- 样例保持 `file_scope_ready=false`。
- 样例保持 `rollback_plan_ready=false`。
- 样例保持 `validation_plan_ready=false`。
- 样例保持 `electron_boundary_ready=false`。
- 样例保持 `stop_conditions_ready=false`。
- 样例保持 `implementation_patch_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_9_closeout_or_v3_0_first_runtime_patch_authorization
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - runtime patch preflight review
    - granted implementation task authorization
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

