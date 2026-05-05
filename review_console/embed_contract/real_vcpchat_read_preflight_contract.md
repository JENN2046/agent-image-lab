# Real VCPChat Read Preflight Contract

本文定义真实 VCPChat 源码读取前的最终 preflight contract。它只用于形成未来授权包，不读取真实源码，不列真实路径，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: real_vcpchat_read_preflight_contract
  version: v2.1-read-preflight
  status: final_preflight_only
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  exact_real_paths: []
  exact_real_paths_listed: false
  raw_source_copy_allowed: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  real_execution_allowed: false
```

## Required Preflight Shape

```yaml
required_preflight_shape:
  preflight_id: string
  authorization_required: true
  user_authorized: false
  selected_source_categories: []
  exact_real_paths: []
  exact_real_paths_listed: false
  source_read_performed: false
  allowed_sanitized_output_fields: []
  forbidden_outputs: list
  read_command_policy: documented_only
  stop_conditions: list
  reviewer_required: true
  audit_summary_cn: string
```

`exact_real_paths` 和 `selected_source_categories` 必须保持空列表，直到未来独立授权。

## Candidate Category Allowlist

本阶段只允许引用候选类别：

```yaml
candidate_category_allowlist:
  - review_console_child_window_candidate
  - ipc_handler_candidate
  - preload_boundary_candidate
  - window_lifecycle_candidate
  - schema_bridge_candidate
```

类别名不是读取授权。真实读取必须在未来授权中选择类别并填写真实路径 allowlist。

## Read Command Policy

本 contract 只定义未来读取命令的政策，不写真实命令：

```yaml
read_command_policy:
  command_written_in_this_phase: false
  must_be_read_only: documented_only
  recursive_unscoped_read_allowed: false
  config_read_allowed: false
  env_read_allowed: false
  log_read_allowed: false
  credential_read_allowed: false
  binary_asset_read_allowed: false
```

## Sanitized Output Policy

```yaml
sanitized_output_policy:
  raw_source_copy_allowed: false
  raw_path_copy_allowed: false
  allowed_future_fields:
    - sanitized_module_purpose_cn
    - sanitized_window_lifecycle_summary_cn
    - sanitized_ipc_channel_summary_cn
    - sanitized_preload_boundary_summary_cn
    - sanitized_schema_validation_summary_cn
    - sanitized_security_risk_notes_cn
    - sanitized_required_change_summary_cn
    - sanitized_stop_condition_summary_cn
```

所有输出必须是中文脱敏摘要。

## Forbidden Outputs

```yaml
forbidden_outputs:
  - raw_source_code
  - real_local_path
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

## Stop Conditions

必须立即停止摘录：

- 发现 secret-like 内容。
- 发现 endpoint 原文。
- 发现私密路径。
- 发现客户隐私。
- 发现 raw runtime log。
- 发现 raw IPC payload。
- 发现 credential 或配置原文。
- 发现未授权文件类别。

停止记录只能写中文脱敏摘要。

## Post-read Boundary

```yaml
post_read_boundary:
  can_modify_vcpchat_after_read: false
  can_create_ipc_handler_after_read: false
  can_create_preload_code_after_read: false
  can_call_plugin_after_read: false
  can_call_api_after_read: false
  can_call_daily_note_after_read: false
  can_write_memory_after_read: false
```

读取完成不等于修改授权。

## Acceptance

- 本 contract 不授权真实读取。
- 本 contract 不授权列真实路径。
- 本 contract 不授权复制 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权创建 IPC handler。
- 本 contract 不授权插件、API、DailyNote 或文件系统调用。
