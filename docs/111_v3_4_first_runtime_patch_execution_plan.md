# 111 v3.4 First Runtime Patch Execution Plan

本文定义 Agent Image Lab v3.4 的 first runtime patch execution plan。该阶段接在 v3.3 first runtime patch implementation authorization baseline 之后，只规划未来第一次 runtime patch 的执行计划票据，不读取真实 VCPChat，不读取真实 VCPToolBox，不填真实本地路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Execution Plan Status

```yaml
v3_4_first_runtime_patch_execution_plan:
  status: first_runtime_patch_execution_plan_template_only
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_granted: false
  scope_fill_completed: false
  scope_review_passed: false
  implementation_authorization_granted: false
  implementation_patch_authorized: false
  execution_plan_required: true
  execution_plan_requested: false
  execution_plan_completed: false
  execution_plan_approved: false
  code_patch_execution_authorized: false
  execution_plan_rejected: false
  execution_plan_rejection_reason_cn: null
  execution_plan_owner: null
  execution_plan_reviewed_by: null
  execution_plan_reviewed_at: null
  authorized_task_id: null
  patch_objective_cn: null
  allowed_modify_files: []
  allowed_create_files: []
  forbidden_modify_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  allowed_preload_api_names: []
  allowed_renderer_entry_points: []
  planned_commands: []
  planned_validation_commands: []
  rollback_commands: []
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
  electron_boundary_confirmed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  file_write_performed: false
  disk_write_performed: false
  image_file_created: false
  real_execution_allowed: false
```

## Goal

v3.4 的目标是把“第一次 runtime patch implementation authorization”推进到“第一次 runtime patch execution plan 规划”。它只回答：

- 未来真正执行第一个 runtime patch 前，执行计划必须包含哪些字段。
- 文件范围、IPC allowlist、preload API、renderer 入口、回滚计划、验证计划和停止条件如何映射到执行计划。
- 为什么命令列表必须为空，直到用户进入下一独立授权点。
- 为什么 execution plan 不等于已经允许写代码。
- 为什么“继续”“ok”“去吧”等口头续接不能自动启动实现。

本阶段只补齐执行计划文档、contract、样例和验收清单，不写运行时代码。

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

## Required Execution Plan Inputs

```yaml
required_execution_plan_inputs:
  implementation_authorization_record: true
  implementation_authorization_granted: false
  implementation_patch_authorized: false
  execution_plan_required: true
  execution_plan_requested: false
  execution_plan_completed: false
  execution_plan_approved: false
  code_patch_execution_authorized: false
  authorized_task_id: null
  patch_objective_cn: null
  execution_plan_owner: null
  execution_plan_reviewed_by: null
  execution_plan_reviewed_at: null
  allowed_modify_files: []
  allowed_create_files: []
  forbidden_modify_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  allowed_preload_api_names: []
  allowed_renderer_entry_points: []
  planned_commands: []
  planned_validation_commands: []
  rollback_commands: []
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
```

当前样例仍保持实现授权未批准、执行计划未请求、未完成、未批准、未授权执行，所有文件范围、allowlist 和命令列表均为空。未来真实 execution plan 必须只引用已批准的 implementation authorization 记录，且不得保留私密路径、真实源码或敏感配置原文。

## Execution Plan Record Shape

```yaml
first_runtime_patch_execution_plan:
  execution_plan_id: string
  implementation_authorization_id: string
  scope_review_id: string
  execution_plan_required: true
  execution_plan_requested: false
  execution_plan_completed: false
  execution_plan_approved: false
  code_patch_execution_authorized: false
  execution_plan_owner: null
  execution_plan_reviewed_by: null
  execution_plan_reviewed_at: null
  execution_plan_rejection_reason_cn: null
  audit_summary_cn: string
```

`implementation_authorization_id` 只能引用 v3.3 first runtime patch implementation authorization 记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Execution Checklist Shape

```yaml
execution_plan_checklist:
  implementation_authorization_granted: false
  reviewed_file_scope_attached: false
  reviewed_ipc_allowlist_attached: false
  reviewed_preload_api_allowlist_attached: false
  reviewed_renderer_entrypoint_allowlist_attached: false
  rollback_plan_attached: false
  validation_plan_attached: false
  stop_conditions_attached: false
  electron_boundary_confirmed: false
  planned_commands_empty: true
  planned_validation_commands_empty: true
  rollback_commands_empty: true
  code_patch_execution_authorized: false
  raw_source_absent: true
  real_path_absent: true
  side_effect_absent: true
```

本阶段样例保持所有执行授权项未通过，所有命令列表为空。未来真实执行计划必须逐项记录中文结论，并且不得把缺失项默认为通过。

## Future Execution Plan Policy

未来真实 execution plan 必须遵守：

- 只有已批准的 implementation authorization 记录，才能进入执行计划审查。
- 执行计划必须列出单个任务 ID 和中文目标。
- 执行计划必须引用已复查的文件范围、IPC allowlist、preload API allowlist 和 renderer 入口。
- 执行计划必须引用回滚计划、验证计划和停止条件。
- 执行计划必须确认 Electron 安全边界。
- 执行计划不得覆盖未列明文件、未列明 IPC channel、未列明 preload API 或未列明 renderer 入口。
- 执行计划不得包含真实命令文本，直到进入下一独立授权点。
- 执行计划不得授权插件、API、DailyNote、VCP 记忆、资产写入或图片创建。
- 执行计划不得自动延伸到后续 patch。

## Rejection Conditions

必须拒绝以下 execution plan 记录：

- implementation authorization 未批准却创建执行计划。
- allowed scope 为空却宣称可以写代码。
- planned commands、validation commands 或 rollback commands 非空。
- 缺少任务 ID、目标、文件范围、回滚计划、验证计划或停止条件。
- 未确认 Electron 安全边界却规划 IPC/preload/renderer 相关执行。
- 使用通配符或模糊范围扩大到未列明文件。
- 包含真实 VCPChat 或 VCPToolBox 私密路径。
- 包含真实读取命令、源码片段、完整函数体或 endpoint 原文。
- 包含环境变量值、credential、密钥文件、token、cookie、密码或客户隐私。
- 暗示可以调用插件、API、DailyNote 或 VCP 记忆。
- 暗示可以写资产或创建图片文件。
- 暗示“继续”“ok”“去吧”可自动开始写代码或扩大范围。

## Acceptance

- first runtime patch execution plan 文档存在。
- first runtime patch execution plan contract 存在。
- first runtime patch execution plan 样例存在。
- validation checklist 包含 v3.4 first runtime patch execution plan 检查项。
- 样例保持 `execution_plan_required=true`。
- 样例保持 `execution_plan_requested=false`。
- 样例保持 `execution_plan_completed=false`。
- 样例保持 `execution_plan_approved=false`。
- 样例保持 `implementation_authorization_granted=false`。
- 样例保持 `implementation_patch_authorized=false`。
- 样例保持 `code_patch_execution_authorized=false`。
- 样例保持 `planned_commands=[]`。
- 样例保持 `planned_validation_commands=[]`。
- 样例保持 `rollback_commands=[]`。
- 样例保持 `allowed_modify_files=[]`。
- 样例保持 `allowed_create_files=[]`。
- 样例保持 `allowed_ipc_channels=[]`。
- 样例保持 `allowed_preload_api_names=[]`。
- 样例保持 `allowed_renderer_entry_points=[]`。
- 样例保持 `electron_boundary_confirmed=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v3_4_closeout_or_v3_5_first_runtime_patch_final_preflight
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - first runtime patch execution plan review
    - explicit task id
    - concrete patch objective
    - reviewed file scope
    - reviewed IPC allowlist
    - reviewed preload API allowlist
    - reviewed renderer entrypoint allowlist
    - reviewed rollback plan
    - reviewed validation plan
    - reviewed stop conditions
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
