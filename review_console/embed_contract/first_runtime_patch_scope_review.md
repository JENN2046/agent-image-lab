# First Runtime Patch Scope Review Contract

本文定义 first runtime patch scope review contract。它只描述未来第一次 runtime patch 前必须完成的 scope 复查记录形状，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: first_runtime_patch_scope_review
  version: v3.2-first-runtime-patch-scope-review-template
  status: first_runtime_patch_scope_review_contract_only
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_granted: false
  scope_fill_required: true
  scope_fill_completed: false
  scope_review_required: true
  scope_review_requested: false
  scope_review_completed: false
  scope_review_passed: false
  scope_review_rejected: false
  authorized_task_id: null
  patch_objective_cn: null
  electron_boundary_confirmed: false
  implementation_patch_authorized: false
  real_execution_allowed: false
```

## Required Scope Review Shape

```yaml
required_scope_review_shape:
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
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 scope review shape。

## Required Review Inputs

```yaml
required_review_inputs:
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

本阶段样例保持所有 scope 列表为空且未通过复查。未来真实 scope review 必须只审查已填写的 scope 记录，并且不得通过复查覆盖多个未列明任务。

## Review Preconditions

```yaml
first_runtime_patch_scope_review_preconditions:
  required_before_scope_review_pass:
    - first_runtime_patch_authorization_record
    - completed_scope_fill_record
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
    - human_scope_reviewer
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

本阶段样例不得把 `scope_review_requested`、`scope_review_completed`、`scope_review_passed`、`implementation_patch_authorized` 或任何执行字段设为 `true`。未来即使 scope review 通过，也只表示范围复查完成，不表示允许写代码。

## Forbidden Review Content

```yaml
forbidden_review_content:
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

## Boundary After Scope Review

first runtime patch scope review 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer runtime 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

真实 implementation patch 必须作为下一独立授权点，并且只能使用已通过人工复查的 scope 记录。

## Acceptance

- 本 contract 只定义第一次 runtime patch scope review 模板。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。
