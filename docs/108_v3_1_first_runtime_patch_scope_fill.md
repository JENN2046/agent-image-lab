# 108 v3.1 First Runtime Patch Scope Fill

本文定义 Agent Image Lab v3.1 的 first runtime patch scope fill。该阶段接在 v3.0 first runtime patch authorization baseline 之后，只规划未来第一次 runtime patch 需要填写的 scope 字段，不读取真实 VCPChat，不读取真实 VCPToolBox，不填真实本地路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不调用插件、API、DailyNote、VCP 记忆或文件系统。

## Scope Fill Status

```yaml
v3_1_first_runtime_patch_scope_fill:
  status: first_runtime_patch_scope_fill_template_only
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_granted: false
  scope_fill_required: true
  scope_fill_requested: false
  scope_fill_completed: false
  scope_review_required: true
  scope_review_passed: false
  authorized_task_id: null
  patch_objective_cn: null
  scope_owner: null
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

v3.1 的目标是把“第一次 runtime patch 授权模板”推进到“第一次 runtime patch scope fill 规划”。它只回答：

- 第一次 runtime patch 的文件范围未来应如何填写。
- IPC channel、preload API 和 renderer 入口未来应如何列入 allowlist。
- 哪些 scope 字段必须保持空值，直到人工填写和复查完成。
- 为什么 scope fill 不等于实现授权。
- 为什么 scope fill 不能通过“继续”“ok”“去吧”等口头续接自动扩大。

本阶段只补齐 scope fill 文档、contract、样例和验收清单，不写运行时代码。

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

## Required Scope Fill Inputs

```yaml
required_scope_fill_inputs:
  first_runtime_patch_authorization_record: true
  first_runtime_patch_authorization_granted: false
  scope_fill_required: true
  scope_fill_requested: false
  scope_fill_completed: false
  authorized_task_id: null
  patch_objective_cn: null
  scope_owner: null
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

当前样例仍保持 scope 未请求、未完成、未通过复查，所有 allowlist 和文件范围均为空。未来真实 scope fill 必须由人工逐项填写，且不得包含私密路径、真实源码或敏感配置原文。

## Scope Fill Record Shape

```yaml
first_runtime_patch_scope_fill:
  scope_fill_id: string
  authorization_id: string
  scope_fill_required: true
  scope_fill_requested: false
  scope_fill_completed: false
  scope_review_required: true
  scope_review_passed: false
  authorized_task_id: null
  patch_objective_cn: null
  allowed_modify_files: []
  allowed_create_files: []
  forbidden_modify_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  allowed_preload_api_names: []
  allowed_renderer_entry_points: []
  audit_summary_cn: string
```

`authorization_id` 只能引用 v3.0 first runtime patch authorization 记录，不得包含真实路径、shell 文本、endpoint、secret、客户数据、插件调用或 raw source。

## Future Fill Policy

未来真实 scope fill 必须遵守：

- 每个允许修改文件必须以仓库内相对路径表达。
- 每个允许新建文件必须以仓库内相对路径表达。
- 每个禁止修改文件必须明确列出原因。
- 每个 IPC channel 必须有中文用途说明、payload 摘要和拒绝条件。
- 每个 preload API 名称必须有最小暴露范围说明。
- 每个 renderer 入口必须有只读或受控写入边界说明。
- 文件范围不得使用通配符扩大到整个目录。
- scope fill 不得包含真实本机路径、真实读取命令、源码原文、完整函数体或配置原文。
- scope fill 不得包含 API key、token、cookie、密码、私钥、endpoint 原文、客户隐私或聊天记录原文。
- scope fill 不得授权插件、API、DailyNote、VCP 记忆、资产写入或图片创建。

## Scope Review Rules

未来 scope review 必须确认：

- `scope_fill_completed=true` 只能在人工填写所有必需字段后出现。
- `scope_review_passed=true` 只能在人工复查通过后出现。
- `implementation_patch_authorized=true` 不得由 scope fill 自动产生。
- allowed scope 为空时，不得进入实现。
- Electron 边界未确认时，不得创建 IPC/preload/renderer 代码。
- 未列明的文件、IPC channel、preload API、renderer 入口均视为禁止。
- 后续每个真实 implementation patch 仍需要独立授权。

## Rejection Conditions

必须拒绝以下 scope fill 记录：

- scope 未完成却宣称可以进入实现。
- allowed scope 为空却宣称可以写代码。
- 使用通配符或模糊范围扩大到未列明文件。
- 包含真实 VCPChat 或 VCPToolBox 私密路径。
- 包含真实读取命令、源码片段、完整函数体或 endpoint 原文。
- 包含环境变量值、credential、密钥文件、token、cookie、密码或客户隐私。
- 暗示可以创建 IPC handler、preload 或 renderer runtime 代码。
- 暗示可以调用插件、API、DailyNote 或 VCP 记忆。
- 暗示可以写资产或创建图片文件。
- 暗示“继续”“ok”“去吧”可自动扩大本次 scope。

## Acceptance

- first runtime patch scope fill 文档存在。
- first runtime patch scope fill contract 存在。
- first runtime patch scope fill 样例存在。
- validation checklist 包含 v3.1 first runtime patch scope fill 检查项。
- 样例保持 `scope_fill_required=true`。
- 样例保持 `scope_fill_requested=false`。
- 样例保持 `scope_fill_completed=false`。
- 样例保持 `scope_review_passed=false`。
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
  authorization_name: v3_1_closeout_or_v3_2_first_runtime_patch_scope_review
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - first runtime patch scope fill review
    - explicit task id
    - concrete patch objective
    - concrete file scope
    - concrete IPC allowlist
    - concrete preload API allowlist
    - concrete renderer entrypoint allowlist
    - concrete rollback plan
    - concrete validation plan
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
