# VCPChat Source Scope Review Contract

本文定义未来真实 VCPChat 源码读取之前的范围审查 contract。它只描述候选源码类别、脱敏输出字段和拒绝条件，不读取真实源码，不列真实路径，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: vcpchat_source_scope_review_contract
  version: v2.1-scope-review
  status: scope_review_plan_only
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  exact_real_paths_listed: false
  raw_source_copy_allowed: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  real_execution_allowed: false
```

## Candidate Category Registry

本阶段只允许登记候选类别：

```yaml
candidate_category_registry:
  review_console_child_window_candidate:
    allowed_now: false
    future_read_purpose_cn: "审查子窗口承载边界、生命周期和导航限制。"
  ipc_handler_candidate:
    allowed_now: false
    future_read_purpose_cn: "审查 IPC handler 注册点、channel allowlist 和 sender 校验。"
  preload_boundary_candidate:
    allowed_now: false
    future_read_purpose_cn: "审查 preload API allowlist 和禁止能力。"
  window_lifecycle_candidate:
    allowed_now: false
    future_read_purpose_cn: "审查窗口创建、销毁、来源校验和隔离配置。"
  schema_bridge_candidate:
    allowed_now: false
    future_read_purpose_cn: "审查 host payload 与 review_session draft 的 schema 校验衔接。"
```

`allowed_now=false` 是硬边界：本 contract 不允许读取真实文件。

## Scope Record Shape

```yaml
source_scope_review:
  scope_review_id: string
  authorization_required: true
  user_authorized: false
  selected_source_categories: []
  exact_real_paths_listed: false
  exact_real_paths: []
  source_read_performed: false
  allowed_sanitized_outputs: list
  forbidden_outputs: list
  reviewer_required: true
  audit_summary_cn: string
```

`exact_real_paths` 必须保持空列表，直到未来独立授权。

## Allowed Sanitized Output Fields

```yaml
allowed_sanitized_output_fields:
  - sanitized_module_purpose_cn
  - sanitized_window_lifecycle_summary_cn
  - sanitized_ipc_channel_summary_cn
  - sanitized_preload_boundary_summary_cn
  - sanitized_schema_validation_summary_cn
  - sanitized_security_risk_notes_cn
  - sanitized_required_change_summary_cn
```

所有输出必须是中文脱敏摘要，不得包含 raw source 或真实路径。

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

必须停止并拒绝推进：

- `source_read_performed=true` 出现在本阶段记录。
- `real_vcpchat_source_read=true` 出现在本阶段记录。
- `exact_real_paths_listed=true` 出现在本阶段记录。
- `raw_source_copy_allowed=true`。
- 记录包含真实本地路径。
- 记录包含 raw source。
- 记录包含 secret、endpoint 原文、私密路径或客户隐私。
- 记录把 scope review 解释为真实修改授权。
- 记录把 scope review 解释为插件、API、DailyNote 或文件系统调用授权。

## Approval Boundary

```yaml
approval_boundary:
  scope_review_can_request_future_read: true
  scope_review_can_read_source: false
  scope_review_can_modify_vcpchat: false
  scope_review_can_create_ipc_handler: false
  scope_review_can_call_external_systems: false
```

## Acceptance

- 本 contract 可作为未来真实读取授权的前置范围记录。
- 本 contract 不授权读取真实 VCPChat。
- 本 contract 不授权列真实路径。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权创建 IPC handler。
- 本 contract 不授权插件、API、DailyNote 或文件系统调用。
