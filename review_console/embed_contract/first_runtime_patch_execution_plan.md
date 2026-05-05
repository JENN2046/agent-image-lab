# First Runtime Patch Execution Plan Contract

本文定义 first runtime patch execution plan contract。它只描述未来第一次 runtime patch 前必须完成的执行计划记录形状，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: first_runtime_patch_execution_plan
  version: v3.4-first-runtime-patch-execution-plan-template
  status: first_runtime_patch_execution_plan_contract_only
  implementation_authorization_granted: false
  implementation_patch_authorized: false
  execution_plan_required: true
  execution_plan_requested: false
  execution_plan_completed: false
  execution_plan_approved: false
  code_patch_execution_authorized: false
  authorized_task_id: null
  patch_objective_cn: null
  planned_commands: []
  planned_validation_commands: []
  rollback_commands: []
  electron_boundary_confirmed: false
  real_execution_allowed: false
```

## Required Execution Plan Shape

```yaml
required_execution_plan_shape:
  execution_plan_id: string
  implementation_authorization_id: string
  scope_review_id: string
  execution_plan_required: true
  execution_plan_requested: false
  execution_plan_completed: false
  execution_plan_approved: false
  execution_plan_rejected: false
  code_patch_execution_authorized: false
  execution_plan_owner: null
  execution_plan_reviewed_by: null
  execution_plan_reviewed_at: null
  execution_plan_rejection_reason_cn: null
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 execution plan shape。

## Required Plan Inputs

```yaml
required_plan_inputs:
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

本阶段样例保持所有 scope 列表和命令列表为空且未批准执行计划。未来真实 execution plan 必须只引用已批准的 implementation authorization 记录，并且不得通过计划覆盖多个未列明任务。

## Execution Plan Preconditions

```yaml
first_runtime_patch_execution_plan_preconditions:
  required_before_execution_plan_approval:
    - approved_implementation_authorization_record
    - authorized_task_id
    - patch_objective_cn
    - reviewed_allowed_modify_files
    - reviewed_allowed_create_files_or_explicit_empty_reason
    - reviewed_forbidden_modify_files
    - reviewed_forbidden_create_files
    - reviewed_allowed_ipc_channels_or_explicit_empty_reason
    - reviewed_allowed_preload_api_names_or_explicit_empty_reason
    - reviewed_allowed_renderer_entry_points_or_explicit_empty_reason
    - reviewed_rollback_plan_ref
    - reviewed_validation_plan_ref
    - reviewed_stop_conditions_ref
    - electron_boundary_confirmation
    - human_execution_plan_reviewer
  still_not_allowed:
    - real_vcpchat_source_read
    - real_vcpchat_modified
    - ipc_handler_created
    - preload_runtime_code_created
    - renderer_runtime_code_created
    - api_called
    - daily_note_called
    - vcp_memory_written
```

本阶段样例不得把 `execution_plan_requested`、`execution_plan_completed`、`execution_plan_approved`、`code_patch_execution_authorized` 或任何执行字段设为 `true`。未来即使执行计划完成，也只覆盖计划记录列出的单个 patch。

## Forbidden Plan Content

```yaml
forbidden_plan_content:
  - real_local_path
  - raw_allowlist_path
  - raw_read_command
  - shell_command_text
  - raw_source_code
  - complete_function_body
  - endpoint_raw_value
  - env_value
  - secret_raw_value
  - private_path_raw_value
  - customer_private_data
  - raw_runtime_log
  - raw_ipc_payload
  - raw_plugin_output
  - image_binary
```

## Boundary After Execution Plan

first runtime patch execution plan 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer runtime 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

真实 code patch 必须作为下一独立 final preflight 或代码 patch 授权点，并且只能使用已通过人工批准的 execution plan 记录。

## Acceptance

- 本 contract 只定义第一次 runtime patch execution plan 模板。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。
