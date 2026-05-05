# First Runtime Patch Authorization Contract

本文定义 first runtime patch authorization contract。它只描述未来第一次真实 runtime integration patch 前必须填写的授权模板，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: first_runtime_patch_authorization
  version: v3.0-first-runtime-patch-authorization-template
  status: first_runtime_patch_authorization_contract_only
  first_runtime_patch_authorization_required: true
  first_runtime_patch_authorization_requested: false
  first_runtime_patch_authorization_granted: false
  runtime_patch_preflight_passed: false
  authorized_task_id: null
  patch_objective_cn: null
  rollback_plan_ref: null
  validation_plan_ref: null
  stop_conditions_ref: null
  electron_boundary_confirmed: false
  implementation_patch_authorized: false
  real_execution_allowed: false
```

## Required Authorization Shape

```yaml
required_authorization_shape:
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

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 authorization shape。

## Required Scope Shape

```yaml
required_scope_shape:
  allowed_modify_files: []
  allowed_create_files: []
  forbidden_modify_files: []
  forbidden_create_files: []
  allowed_ipc_channels: []
  allowed_preload_api_names: []
  allowed_renderer_entry_points: []
```

本阶段样例保持所有 scope 列表为空。未来真实授权必须逐项填写，并且不得通过单次授权覆盖多个未列明任务。

## Authorization Preconditions

```yaml
first_runtime_patch_authorization_preconditions:
  required_before_first_patch_authorization:
    - runtime_patch_preflight_record
    - authorized_task_id
    - patch_objective_cn
    - file_scope
    - rollback_plan_ref
    - validation_plan_ref
    - stop_conditions_ref
    - electron_boundary_confirmation
    - human_authorizer
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

本阶段样例不得把 `first_runtime_patch_authorization_requested`、`first_runtime_patch_authorization_granted`、`implementation_patch_authorized` 或任何执行字段设为 `true`。未来即使授权被批准，也只覆盖授权票据列出的第一次 runtime patch。

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

first runtime patch authorization 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer runtime 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

真实 implementation patch 必须作为下一独立授权点，并且只能使用授权票据明确列出的文件和动作。

## Acceptance

- 本 contract 只定义第一次 runtime patch 授权填写模板。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

