# 112 v3.5 First Runtime Patch Final Preflight

本文定义 Agent Image Lab v3.5 的 first runtime patch final preflight。该阶段接在 v3.4 first runtime patch execution plan baseline 之后，只规划未来第一次 runtime patch 真正写代码前的最终检查票据，不读取真实 VCPChat，不读取真实 VCPToolBox，不填真实本地路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Final Preflight Status

```yaml
v3_5_first_runtime_patch_final_preflight:
  status: first_runtime_patch_final_preflight_template_only
  implementation_authorization_granted: false
  implementation_patch_authorized: false
  execution_plan_required: true
  execution_plan_approved: false
  final_preflight_required: true
  final_preflight_requested: false
  final_preflight_completed: false
  final_preflight_passed: false
  final_preflight_rejected: false
  final_preflight_rejection_reason_cn: null
  code_patch_execution_authorized: false
  implementation_code_creation_authorized: false
  final_preflight_owner: null
  final_preflight_reviewed_by: null
  final_preflight_reviewed_at: null
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

v3.5 的目标是把“第一次 runtime patch execution plan”推进到“第一次 runtime patch final preflight 规划”。它只回答：

- 未来真正写第一段 runtime code 前，最终检查必须确认哪些字段。
- execution plan、文件范围、IPC allowlist、preload API、renderer 入口、回滚计划、验证计划和停止条件如何进入最终检查。
- 为什么 final preflight 中命令列表必须保持为空，直到用户进入下一独立授权点。
- 为什么 final preflight 不等于已经允许写代码。
- 为什么“继续”“ok”“去吧”等口头续接不能自动启动实现。

本阶段只补齐最终检查文档、contract、样例和验收清单，不写运行时代码。

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

## Required Final Preflight Inputs

```yaml
required_final_preflight_inputs:
  execution_plan_record: true
  execution_plan_approved: false
  code_patch_execution_authorized: false
  final_preflight_required: true
  final_preflight_requested: false
  final_preflight_completed: false
  final_preflight_passed: false
  implementation_code_creation_authorized: false
  authorized_task_id: null
  patch_objective_cn: null
  final_preflight_owner: null
  final_preflight_reviewed_by: null
  final_preflight_reviewed_at: null
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

当前样例仍保持 execution plan 未批准、final preflight 未请求、未完成、未通过、未授权执行，所有文件范围、allowlist 和命令列表均为空。未来真实 final preflight 必须只引用已批准的 execution plan 记录，且不得保留私密路径、真实源码或敏感配置原文。

## Final Preflight Record Shape

```yaml
first_runtime_patch_final_preflight:
  final_preflight_id: string
  execution_plan_id: string
  implementation_authorization_id: string
  final_preflight_required: true
  final_preflight_requested: false
  final_preflight_completed: false
  final_preflight_passed: false
  final_preflight_rejected: false
  code_patch_execution_authorized: false
  implementation_code_creation_authorized: false
  final_preflight_owner: null
  final_preflight_reviewed_by: null
  final_preflight_reviewed_at: null
  final_preflight_rejection_reason_cn: null
  audit_summary_cn: string
```

`execution_plan_id` 只能引用 v3.4 first runtime patch execution plan 记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Final Checklist Shape

```yaml
final_preflight_checklist:
  execution_plan_approved: false
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
  implementation_code_creation_authorized: false
  raw_source_absent: true
  real_path_absent: true
  side_effect_absent: true
```

本阶段样例保持所有最终检查项未通过，所有命令列表为空，代码创建仍未授权。未来真实 final preflight 必须逐项记录中文结论，并且不得把缺失项默认为通过。

## Future Final Preflight Policy

未来真实 final preflight 必须遵守：

- 只有已批准的 execution plan 记录，才能进入最终检查。
- 最终检查必须列出单个任务 ID 和中文目标。
- 最终检查必须引用已复查的文件范围、IPC allowlist、preload API allowlist 和 renderer 入口。
- 最终检查必须引用回滚计划、验证计划和停止条件。
- 最终检查必须确认 Electron 安全边界。
- 最终检查不得覆盖未列明文件、未列明 IPC channel、未列明 preload API 或未列明 renderer 入口。
- 最终检查不得包含真实命令文本，直到进入下一独立授权点。
- 最终检查不得授权插件、API、DailyNote、VCP 记忆、资产写入或图片创建。
- 最终检查不得自动延伸到后续 patch。

## Rejection Conditions

必须拒绝以下 final preflight 记录：

- execution plan 未批准却通过最终检查。
- allowed scope 为空却宣称可以写代码。
- planned commands、validation commands 或 rollback commands 非空。
- 缺少任务 ID、目标、文件范围、回滚计划、验证计划或停止条件。
- 未确认 Electron 安全边界却准备 IPC/preload/renderer 相关实现。
- 使用通配符或模糊范围扩大到未列明文件。
- 包含真实 VCPChat 或 VCPToolBox 私密路径。
- 包含真实读取命令、源码片段、完整函数体或 endpoint 原文。
- 包含环境变量值、credential、密钥文件、token、cookie、密码或客户隐私。
- 暗示可以调用插件、API、DailyNote 或 VCP 记忆。
- 暗示可以写资产或创建图片文件。
- 暗示“继续”“ok”“去吧”可自动开始写代码或扩大范围。

## Acceptance

- first runtime patch final preflight 文档存在。
- first runtime patch final preflight contract 存在。
- first runtime patch final preflight 样例存在。
- validation checklist 包含 v3.5 first runtime patch final preflight 检查项。
- 样例保持 `final_preflight_required=true`。
- 样例保持 `final_preflight_requested=false`。
- 样例保持 `final_preflight_completed=false`。
- 样例保持 `final_preflight_passed=false`。
- 样例保持 `execution_plan_approved=false`。
- 样例保持 `code_patch_execution_authorized=false`。
- 样例保持 `implementation_code_creation_authorized=false`。
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
  authorization_name: v3_5_closeout_or_v3_6_first_runtime_code_patch_authorization
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - first runtime patch final preflight review
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
