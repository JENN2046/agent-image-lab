# First Runtime Code Patch Authorization Contract

本文定义 first runtime code patch authorization contract。它只描述未来第一次 runtime code patch 前必须完成的授权记录形状，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: first_runtime_code_patch_authorization
  version: v3.6-first-runtime-code-patch-authorization-template
  status: first_runtime_code_patch_authorization_contract_only
  template_status: first_runtime_code_patch_authorization_template_only
  final_preflight_passed: false
  code_patch_authorization_requested: false
  code_patch_authorization_completed: false
  code_patch_authorization_granted: false
  code_patch_execution_authorized: false
  implementation_code_creation_authorized: false
  authorized_task_id: null
  patch_objective_cn: null
  planned_commands: []
  planned_validation_commands: []
  rollback_commands: []
  electron_boundary_confirmed: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  real_execution_allowed: false
```

## Required Authorization Shape

```yaml
required_authorization_shape:
  authorization_id: string
  final_preflight_id: string
  execution_plan_id: string
  code_patch_authorization_requested: false
  code_patch_authorization_completed: false
  code_patch_authorization_granted: false
  code_patch_execution_authorized: false
  implementation_code_creation_authorized: false
  authorization_owner: null
  authorization_reviewed_by: null
  authorization_reviewed_at: null
  authorization_rejection_reason_cn: null
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 authorization shape。

## Required Authorization Inputs

```yaml
required_authorization_inputs:
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

本阶段样例保持所有 scope 列表和命令列表为空且未授权代码补丁。未来真实 authorization 必须只引用已通过的 final preflight 记录，并且不得通过授权覆盖多个未列明任务。

## Authorization Preconditions

```yaml
first_runtime_code_patch_authorization_preconditions:
  required_before_code_patch_authorization:
    - passed_final_preflight_record
    - approved_execution_plan_record
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
    - human_code_patch_authorization_reviewer
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

本阶段样例不得把 `code_patch_authorization_requested`、`code_patch_authorization_completed`、`code_patch_authorization_granted`、`code_patch_execution_authorized` 或任何执行字段设为 `true`。未来即使授权完成，也只覆盖授权记录列出的单个 patch。

## Forbidden Authorization Content

```yaml
forbidden_authorization_content:
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

## Boundary After Authorization

first runtime code patch authorization 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer runtime 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

真实 code patch 执行必须作为下一独立执行点，并且只能使用已通过人工批准的 authorization 记录。

## Acceptance

- 本 contract 只定义第一次 runtime code patch authorization 模板。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。
