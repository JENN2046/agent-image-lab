# Phase C Manifest Sanitized Read Contract

本文定义 Phase C 的独立授权申请表和脱敏读取结果格式。当前文件只提供契约，不读取真实 VCPToolBox、不读取真实 VCPChat、不读取真实 manifest、不调用插件、不调用 API、不写 DailyNote、不创建图片文件。

## 目标

Phase C 只允许在用户单独授权后读取一个候选 manifest，并只输出中文脱敏摘要。Phase C 的目标不是选择插件、执行插件或确认插件可用，而是判断一个候选 manifest 是否可以从 `pending_manifest_review` 推进到 `manifest_reviewed_safe` 或 `rejected`。

## Phase C 进入条件

进入 Phase C 前必须同时满足：

- 存在唯一候选 manifest。
- 用户明确授权读取该单一候选 manifest。
- 授权中写明读取方式，并确认只读。
- 授权中写明允许摘录字段和禁止摘录字段。
- Gatekeeper_Agent 确认可读范围和拒绝条件。
- Review Console 只展示授权记录和读取结果，不触发读取或执行。
- Archivist_Agent 只生成中文脱敏 memory_delta 草案，不写 DailyNote。

## 授权申请表

真实读取前必须形成以下申请对象：

```yaml
phase_c_manifest_read_authorization:
  authorization_id: phase-c-manifest-read-auth-001
  requested_phase: phase_c_manifest_sanitized_read
  candidate_id: candidate-plugin-placeholder-001
  target_repository_ref: repository-ref-placeholder
  target_manifest_ref: manifest-ref-placeholder
  read_scope:
    single_manifest_only: true
    repository_wide_scan_allowed: false
    vcpchat_read_allowed: false
    runtime_data_read_allowed: false
    config_env_read_allowed: false
    image_file_read_allowed: false
  read_method:
    read_only: true
    executable_command_allowed: false
    plugin_execution_allowed: false
    api_call_allowed: false
    file_write_allowed: false
  allowed_extract_fields:
    - plugin_display_name_summary_cn
    - command_summary_cn
    - input_output_summary_cn
    - permission_risk_cn
    - gatekeeper_notes_cn
    - sanitized_review_summary_cn
  forbidden_extract_fields:
    - raw_manifest_text
    - api_key
    - token
    - cookie
    - password
    - private_path
    - endpoint_raw
    - webhook_raw
    - database_url_raw
    - customer_private_data
    - image_binary
    - real_plugin_output
    - runtime_log
  approval:
    user_authorized: false
    gatekeeper_approved: false
    review_console_required: true
    archivist_required_for_memory: true
    imagelab_master_required: true
  no_execution_guard:
    selected_plugin: null
    max_plugin_calls: 0
    api_called: false
    vcp_plugin_called: false
    daily_note_called: false
    file_write_performed: false
    image_file_created: false
```

未获得用户明确授权前，`user_authorized` 必须保持 `false`，且不得读取真实 manifest。

## 脱敏读取结果格式

如果未来获得授权并完成读取，只能输出以下结果对象：

```yaml
phase_c_manifest_sanitized_review_record:
  review_id: phase-c-manifest-review-001
  authorization_id: phase-c-manifest-read-auth-001
  candidate_id: candidate-plugin-placeholder-001
  read_performed: true
  raw_manifest_copied: false
  source_scope:
    single_manifest_only: true
    repository_wide_scan_performed: false
    vcpchat_read_performed: false
    runtime_data_read_performed: false
  sanitized_review:
    plugin_display_name_summary_cn: "中文脱敏摘要。"
    command_summary_cn: "中文脱敏摘要。"
    input_output_summary_cn: "中文脱敏摘要。"
    permission_risk_cn: "中文脱敏摘要。"
    gatekeeper_notes_cn: "中文脱敏摘要。"
    sanitized_review_summary_cn: "中文脱敏摘要。"
  safety_result:
    raw_manifest_saved: false
    contains_secret: false
    contains_private_path: false
    contains_customer_private_data: false
    contains_endpoint_raw: false
    contains_image_binary: false
    contains_real_plugin_output: false
  state_decision:
    previous_state: pending_manifest_review
    next_state: manifest_reviewed_safe | rejected
    real_execution_allowed: false
    dry_run_allowed: false
    decision_reason_cn: "中文脱敏说明。"
  no_execution_guard:
    selected_plugin: null
    max_plugin_calls: 0
    api_called: false
    vcp_plugin_called: false
    daily_note_called: false
    file_write_performed: false
    image_file_created: false
```

即使 `next_state=manifest_reviewed_safe`，也不代表允许真实执行。它只代表 manifest 脱敏审查通过，可以进入后续 dry-run 评估规划。

## 拒绝条件

出现以下任一情况，Phase C 必须输出 `next_state=rejected` 或保持 `pending_manifest_review`：

- 授权对象不是单一候选 manifest。
- 读取方式可能执行脚本、触发插件或调用 API。
- 需要保存 raw manifest 原文。
- 需要复制密钥、token、cookie、密码、endpoint、webhook、数据库地址或私密路径。
- 需要读取 VCPChat、运行态目录、日志、图片或客户目录。
- manifest 内容无法用中文脱敏摘要表达。
- Gatekeeper_Agent 要求拒绝。
- Review Console 没有人工确认记录。

## 禁止推进

Phase C 不得推进到：

- `dry_run_checked`
- `tested`
- `plugin_selected`
- `execution_ready`
- `real_execution_ready`

这些状态必须等 Phase D 或后续独立授权任务处理。

## 记忆边界

Phase C 可以生成 `memory_delta` 草案，但必须保持：

```yaml
write_mode: draft
approval_required: true
approval_status: pending
final_decision:
  should_write_to_vcp: false
```

Phase C 不写 DailyNote，不写 VCP 长期记忆，不保存 raw manifest，不保存敏感原文。
