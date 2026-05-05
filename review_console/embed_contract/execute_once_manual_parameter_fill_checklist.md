# Execute-once Manual Parameter Fill Checklist Contract

本文定义真实 VCPChat 一次性读取执行前人工填参清单的 contract。它只描述未来人类在仓库外填写真实根目录、allowlist 和读取命令之前的检查记录形态，不读取真实源码，不保存真实路径，不保存真实命令，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: execute_once_manual_parameter_fill_checklist
  version: v2.4-manual-parameter-fill-checklist-template
  status: manual_parameter_fill_checklist_template_only
  manual_parameter_fill_required: true
  manual_parameter_fill_completed: false
  manual_parameter_review_passed: false
  real_vcpchat_root_supplied_outside_git: false
  allowed_read_paths_supplied_outside_git: false
  read_command_supplied_outside_git: false
  source_read_authorized: false
  source_read_performed: false
  read_command_executed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Required Checklist Shape

```yaml
required_checklist_shape:
  checklist_id: string
  final_gate_id: string
  manual_parameter_fill_required: true
  manual_parameter_fill_completed: false
  manual_parameter_review_passed: false
  real_vcpchat_root_supplied_outside_git: false
  allowed_read_paths_supplied_outside_git: false
  read_command_supplied_outside_git: false
  real_vcpchat_root_ref: redacted_external_root_reference
  allowed_read_paths_ref: redacted_external_allowlist_reference
  read_command_ref: redacted_external_read_command_reference
  exact_real_paths_stored_in_git: false
  raw_read_command_stored_in_git: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 checklist shape。

## Manual Parameter Preconditions

```yaml
manual_parameter_preconditions:
  required_before_manual_fill:
    - v2_3_final_read_authorization_gate
    - external_parameter_holder
    - redaction_policy_confirmed
    - no_git_storage_for_real_values
    - one_time_read_attempt_boundary
  still_not_allowed:
    - read_command_executed
    - source_read_performed
    - raw_source_copied
    - vcpchat_modified
    - ipc_handler_created
    - preload_runtime_code_created
    - api_called
    - daily_note_called
```

本阶段样例不得把 `manual_parameter_fill_completed` 或 `manual_parameter_review_passed` 设为 `true`。未来即使人工填参完成，也只允许进入下一独立参数复核门，不得由文档、contract 或 Review Console 自动读取源码。

## Forbidden Parameter Content

```yaml
forbidden_parameter_content:
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

## Boundary After Manual Fill

人工填参清单完成后也不得自动进入：

- 真实 VCPChat 源码读取。
- 读取命令执行。
- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义一次性读取人工填参清单。
- 本 contract 不执行真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

