# Execute-once Manual Parameter Review Gate Contract

本文定义真实 VCPChat 一次性读取执行前人工参数复核门的 contract。它只描述未来人类复核仓库外真实根目录、allowlist 和读取命令的记录形态，不读取真实源码，不保存真实路径，不保存真实命令，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: execute_once_manual_parameter_review_gate
  version: v2.4-manual-parameter-review-gate-template
  status: manual_parameter_review_gate_template_only
  manual_parameter_fill_required: true
  manual_parameter_fill_completed: false
  manual_parameter_review_required: true
  manual_parameter_review_requested: false
  manual_parameter_review_passed: false
  parameter_integrity_confirmed: false
  source_read_authorized: false
  source_read_performed: false
  read_command_executed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Required Review Shape

```yaml
required_review_shape:
  review_gate_id: string
  checklist_id: string
  manual_parameter_review_required: true
  manual_parameter_review_requested: false
  manual_parameter_review_passed: false
  parameter_integrity_confirmed: false
  parameter_reviewer: null
  parameter_reviewed_at: null
  real_vcpchat_root_ref: redacted_external_root_reference
  allowed_read_paths_ref: redacted_external_allowlist_reference
  read_command_ref: redacted_external_read_command_reference
  exact_real_paths_stored_in_git: false
  raw_read_command_stored_in_git: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 review shape。

## Review Preconditions

```yaml
manual_parameter_review_preconditions:
  required_before_review:
    - manual_parameter_fill_checklist
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

本阶段样例不得把 `manual_parameter_review_passed` 或 `parameter_integrity_confirmed` 设为 `true`。未来即使人工参数复核通过，也只允许进入下一独立执行授权门，不得由文档、contract 或 Review Console 自动读取源码。

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

## Boundary After Parameter Review

人工参数复核门完成后也不得自动进入：

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

- 本 contract 只定义一次性读取人工参数复核门。
- 本 contract 不执行真实读取。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

