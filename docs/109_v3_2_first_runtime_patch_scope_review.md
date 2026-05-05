# 109 v3.2 First Runtime Patch Scope Review

本文定义 Agent Image Lab v3.2 的 first runtime patch scope review。该阶段接在 v3.1 first runtime patch scope fill baseline 之后，只规划未来第一次 runtime patch 的 scope 复查门槛，不读取真实 VCPChat，不读取真实 VCPToolBox，不填真实本地路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Scope Review Status

```yaml
v3_2_first_runtime_patch_scope_review:
  status: first_runtime_patch_scope_review_template_only
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_granted: false
  scope_fill_required: true
  scope_fill_requested: false
  scope_fill_completed: false
  scope_review_required: true
  scope_review_requested: false
  scope_review_completed: false
  scope_review_passed: false
  scope_review_rejected: false
  authorized_task_id: null
  patch_objective_cn: null
  scope_review_owner: null
  scope_reviewed_by: null
  scope_reviewed_at: null
  scope_rejection_reason_cn: null
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

v3.2 的目标是把“第一次 runtime patch scope fill”推进到“第一次 runtime patch scope review 规划”。它只回答：

- 未来 scope 填写完成后，哪些复查条件必须通过。
- 文件范围、IPC channel、preload API 和 renderer 入口应如何被人工复核。
- 哪些缺失或模糊 scope 必须拒绝。
- 为什么 scope review 通过也不等于实现授权。
- 为什么 scope review 不能通过“继续”“ok”“去吧”等口头续接自动扩大或进入实现。

本阶段只补齐 scope review 文档、contract、样例和验收清单，不写运行时代码。

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

## Required Scope Review Inputs

```yaml
required_scope_review_inputs:
  first_runtime_patch_authorization_record: true
  first_runtime_patch_authorization_granted: false
  scope_fill_required: true
  scope_fill_completed: false
  scope_review_required: true
  scope_review_requested: false
  scope_review_completed: false
  scope_review_passed: false
  authorized_task_id: null
  patch_objective_cn: null
  scope_review_owner: null
  scope_reviewed_by: null
  scope_reviewed_at: null
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

当前样例仍保持 scope 未请求、未完成、未通过复查，所有 allowlist 和文件范围均为空。未来真实 scope review 必须只审查已经人工填写的 scope 记录，且不得保留私密路径、真实源码或敏感配置原文。

## Scope Review Record Shape

```yaml
first_runtime_patch_scope_review:
  scope_review_id: string
  scope_fill_id: string
  authorization_id: string
  scope_review_required: true
  scope_review_requested: false
  scope_review_completed: false
  scope_review_passed: false
  scope_review_rejected: false
  scope_review_owner: null
  scope_reviewed_by: null
  scope_reviewed_at: null
  scope_rejection_reason_cn: null
  audit_summary_cn: string
```

`scope_fill_id` 只能引用 v3.1 first runtime patch scope fill 记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Review Checklist Shape

```yaml
scope_review_checklist:
  file_scope_reviewed: false
  ipc_scope_reviewed: false
  preload_scope_reviewed: false
  renderer_scope_reviewed: false
  rollback_plan_reviewed: false
  validation_plan_reviewed: false
  stop_conditions_reviewed: false
  electron_boundary_reviewed: false
  sensitive_content_reviewed: false
  raw_source_absent: true
  real_path_absent: true
  execution_authorization_absent: true
```

本阶段样例保持所有复查项未通过，所有执行授权缺席。未来真实复查必须逐项记录中文结论，并且不得把缺失项默认为通过。

## Future Review Policy

未来真实 scope review 必须遵守：

- `scope_review_requested=true` 只能在 scope fill 已完成后出现。
- `scope_review_completed=true` 只能在人工审查所有必需项后出现。
- `scope_review_passed=true` 必须有 `scope_reviewed_by` 和 `scope_reviewed_at`。
- `scope_review_passed=true` 不得在 allowed scope 为空时出现。
- 每个允许修改文件必须确认是仓库内相对路径。
- 每个允许新建文件必须确认是仓库内相对路径。
- 每个 IPC channel 必须确认有中文用途说明、payload 摘要和拒绝条件。
- 每个 preload API 名称必须确认最小暴露范围。
- 每个 renderer 入口必须确认只读或受控写入边界。
- 回滚计划、验证计划和停止条件必须可追溯。
- scope review 不得授权插件、API、DailyNote、VCP 记忆、资产写入或图片创建。

## Rejection Conditions

必须拒绝以下 scope review 记录：

- scope 未填写却请求复查。
- scope 未完成却宣称复查通过。
- allowed scope 为空却宣称可写代码。
- 使用通配符或模糊范围扩大到未列明文件。
- 缺少 `scope_reviewed_by` 或 `scope_reviewed_at` 却宣称复查通过。
- 包含真实 VCPChat 或 VCPToolBox 私密路径。
- 包含真实读取命令、源码片段、完整函数体或 endpoint 原文。
- 包含环境变量值、credential、密钥文件、token、cookie、密码或客户隐私。
- 暗示可以创建 IPC handler、preload 或 renderer runtime 代码。
- 暗示可以调用插件、API、DailyNote 或 VCP 记忆。
- 暗示可以写资产或创建图片文件。
- 暗示“继续”“ok”“去吧”可自动扩大本次 scope 或进入实现。

## Acceptance

- first runtime patch scope review 文档存在。
- first runtime patch scope review contract 存在。
- first runtime patch scope review 样例存在。
- validation checklist 包含 v3.2 first runtime patch scope review 检查项。
- 样例保持 `scope_review_required=true`。
- 样例保持 `scope_review_requested=false`。
- 样例保持 `scope_review_completed=false`。
- 样例保持 `scope_review_passed=false`。
- 样例保持 `scope_fill_completed=false`。
- 样例保持 `authorized_task_id=null`。
- 样例保持 `patch_objective_cn=null`。
- 样例保持 `allowed_modify_files=[]`。
- 样例保持 `allowed_create_files=[]`。
- 样例保持 `allowed_ipc_channels=[]`。
- 样例保持 `allowed_preload_api_names=[]`。
- 样例保持 `allowed_renderer_entry_points=[]`。
- 样例保持 `electron_boundary_confirmed=false`。
- 样例保持 `implementation_patch_authorized=false`。
- 样例保持 `real_execution_allowed=false`。
- 样例不包含真实路径、真实读取命令、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v3_2_closeout_or_v3_3_first_runtime_patch_implementation_authorization
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - first runtime patch scope review
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
