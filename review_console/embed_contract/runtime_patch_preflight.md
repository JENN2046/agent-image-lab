# Runtime Patch Preflight Contract

本文定义 runtime patch preflight contract。它只描述未来真正写 runtime integration patch 前必须通过的最后 preflight，不读取真实源码，不保存真实路径，不创建 IPC handler，不创建 preload 或 renderer runtime 代码，不修改真实 VCPChat，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: runtime_patch_preflight
  version: v2.9-runtime-patch-preflight-template
  status: runtime_patch_preflight_contract_only
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
  real_execution_allowed: false
```

## Required Preflight Shape

```yaml
required_preflight_shape:
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

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 preflight shape。

## Required Readiness Shape

```yaml
required_readiness_shape:
  authorized_task_id: null
  authorized_file_scope_ref: null
  authorized_rollback_plan_ref: null
  authorized_validation_plan_ref: null
  allowed_modify_files_ready: false
  allowed_create_files_ready: false
  forbidden_files_ready: false
  allowed_ipc_channels_ready: false
  preload_allowlist_ready: false
  renderer_entry_points_ready: false
```

本阶段样例保持所有 readiness 为 false 或 null。未来真实 preflight 必须逐项确认，并且不得通过 preflight 自动补齐缺失授权。

## Preflight Preconditions

```yaml
runtime_patch_preflight_preconditions:
  required_before_preflight_pass:
    - runtime_implementation_task_authorization_record
    - authorized_task_id
    - file_scope_ref
    - rollback_plan_ref
    - validation_plan_ref
    - electron_boundary_review
    - stop_conditions_review
    - human_reviewer
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

本阶段样例不得把 `runtime_patch_preflight_requested`、`runtime_patch_preflight_passed`、`implementation_patch_authorized` 或任何执行字段设为 `true`。未来即使 preflight 通过，也只允许进入下一独立 implementation patch authorization。

## Forbidden Preflight Content

```yaml
forbidden_preflight_content:
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

## Boundary After Preflight

runtime patch preflight 记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer runtime 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

真实 implementation patch 必须作为下一独立授权点，并且只能使用任务授权票据和 preflight 记录明确列出的文件和动作。

## Acceptance

- 本 contract 只定义 runtime patch preflight。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保留 raw source。
- 本 contract 不创建 IPC handler、preload 或 renderer runtime 代码。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

