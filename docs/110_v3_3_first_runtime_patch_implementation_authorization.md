# 110 v3.3 First Runtime Patch Implementation Authorization

本文定义 Agent Image Lab v3.3 的 first runtime patch implementation authorization。该阶段接在 v3.2 first runtime patch scope review baseline 之后，只规划未来第一次 runtime patch 的实现授权门槛，不读取真实 VCPChat，不读取真实 VCPToolBox，不填真实本地路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Implementation Authorization Status

```yaml
v3_3_first_runtime_patch_implementation_authorization:
  status: first_runtime_patch_implementation_authorization_template_only
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_granted: false
  scope_fill_required: true
  scope_fill_completed: false
  scope_review_required: true
  scope_review_passed: false
  implementation_authorization_required: true
  implementation_authorization_requested: false
  implementation_authorization_granted: false
  implementation_authorization_rejected: false
  implementation_patch_authorized: false
  implementation_rejection_reason_cn: null
  authorized_task_id: null
  patch_objective_cn: null
  implementation_authorizer: null
  implementation_authorized_at: null
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

v3.3 的目标是把“第一次 runtime patch scope review”推进到“第一次 runtime patch implementation authorization 规划”。它只回答：

- 未来真正写 runtime patch 前，必须有哪些实现授权字段。
- scope review、文件范围、IPC allowlist、preload API、renderer 入口、回滚计划、验证计划和停止条件如何成为实现授权前置条件。
- 哪些缺失或模糊授权必须拒绝。
- 为什么 implementation authorization 模板不等于已经允许写代码。
- 为什么“继续”“ok”“去吧”等口头续接不能自动启动实现。

本阶段只补齐实现授权文档、contract、样例和验收清单，不写运行时代码。

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

## Required Implementation Authorization Inputs

```yaml
required_implementation_authorization_inputs:
  first_runtime_patch_authorization_record: true
  first_runtime_patch_authorization_granted: false
  scope_fill_required: true
  scope_fill_completed: false
  scope_review_required: true
  scope_review_passed: false
  implementation_authorization_required: true
  implementation_authorization_requested: false
  implementation_authorization_granted: false
  authorized_task_id: null
  patch_objective_cn: null
  implementation_authorizer: null
  implementation_authorized_at: null
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

当前样例仍保持 scope review 未通过、实现授权未请求、未批准、未授权写代码，所有 allowlist 和文件范围均为空。未来真实 implementation authorization 必须只引用已通过人工复查的 scope 记录，且不得保留私密路径、真实源码或敏感配置原文。

## Implementation Authorization Record Shape

```yaml
first_runtime_patch_implementation_authorization:
  implementation_authorization_id: string
  scope_review_id: string
  scope_fill_id: string
  authorization_id: string
  implementation_authorization_required: true
  implementation_authorization_requested: false
  implementation_authorization_granted: false
  implementation_authorization_rejected: false
  implementation_patch_authorized: false
  implementation_authorizer: null
  implementation_authorized_at: null
  implementation_rejection_reason_cn: null
  audit_summary_cn: string
```

`scope_review_id` 只能引用 v3.2 first runtime patch scope review 记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Authorization Checklist Shape

```yaml
implementation_authorization_checklist:
  scope_review_passed: false
  file_scope_reviewed: false
  ipc_scope_reviewed: false
  preload_scope_reviewed: false
  renderer_scope_reviewed: false
  rollback_plan_reviewed: false
  validation_plan_reviewed: false
  stop_conditions_reviewed: false
  electron_boundary_reviewed: false
  sensitive_content_reviewed: false
  implementation_authorization_granted: false
  implementation_patch_authorized: false
  raw_source_absent: true
  real_path_absent: true
  execution_side_effect_absent: true
```

本阶段样例保持所有实现授权项未通过，所有执行授权缺席。未来真实授权必须逐项记录中文结论，并且不得把缺失项默认为通过。

## Future Authorization Policy

未来真实 implementation authorization 必须遵守：

- 只有已完成并通过人工复查的 scope 记录，才能进入实现授权审查。
- 实现授权必须列出单个任务 ID 和中文目标。
- 实现授权必须列出允许修改文件、允许创建文件、禁止修改文件、禁止创建文件。
- 实现授权必须列出允许的 IPC channel、preload API 名称和 renderer 入口。
- 实现授权必须引用回滚计划、验证计划和停止条件。
- 实现授权必须确认 Electron 安全边界。
- 实现授权不得覆盖未列明文件、未列明 IPC channel、未列明 preload API 或未列明 renderer 入口。
- 实现授权不得授权插件、API、DailyNote、VCP 记忆、资产写入或图片创建。
- 实现授权不得自动延伸到后续 patch。

## Rejection Conditions

必须拒绝以下 implementation authorization 记录：

- scope review 未通过却请求实现授权。
- allowed scope 为空却宣称可以写代码。
- 缺少任务 ID、目标、文件范围、回滚计划、验证计划或停止条件。
- 未确认 Electron 安全边界却授权 IPC/preload/renderer 相关实现。
- 使用通配符或模糊范围扩大到未列明文件。
- 包含真实 VCPChat 或 VCPToolBox 私密路径。
- 包含真实读取命令、源码片段、完整函数体或 endpoint 原文。
- 包含环境变量值、credential、密钥文件、token、cookie、密码或客户隐私。
- 暗示可以调用插件、API、DailyNote 或 VCP 记忆。
- 暗示可以写资产或创建图片文件。
- 暗示“继续”“ok”“去吧”可自动开始写代码或扩大范围。

## Acceptance

- first runtime patch implementation authorization 文档存在。
- first runtime patch implementation authorization contract 存在。
- first runtime patch implementation authorization 样例存在。
- validation checklist 包含 v3.3 first runtime patch implementation authorization 检查项。
- 样例保持 `implementation_authorization_required=true`。
- 样例保持 `implementation_authorization_requested=false`。
- 样例保持 `implementation_authorization_granted=false`。
- 样例保持 `implementation_patch_authorized=false`。
- 样例保持 `scope_review_passed=false`。
- 样例保持 `authorized_task_id=null`。
- 样例保持 `patch_objective_cn=null`。
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
  authorization_name: v3_3_closeout_or_v3_4_first_runtime_patch_execution_plan
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - first runtime patch implementation authorization review
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
