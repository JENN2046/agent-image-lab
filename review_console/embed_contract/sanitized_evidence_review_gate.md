# Sanitized Evidence Review Gate Contract

本文定义脱敏证据人工复核门 contract。它只描述未来 sanitized evidence 如何进入人工复核，不读取真实源码，不保存真实路径，不保存真实命令，不保存 raw source，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: sanitized_evidence_review_gate
  version: v2.5-sanitized-evidence-review-gate-template
  status: sanitized_evidence_review_gate_template_only
  sanitized_evidence_review_required: true
  sanitized_evidence_review_requested: false
  sanitized_evidence_review_passed: false
  sanitized_evidence_summary_exists: false
  evidence_packet_created: false
  raw_evidence_retained: false
  raw_source_retained: false
  implementation_authorized: false
  memory_write_authorized: false
  daily_note_write_authorized: false
  real_execution_allowed: false
```

## Required Review Shape

```yaml
required_review_shape:
  review_gate_id: string
  chain_id: string
  sanitized_evidence_review_required: true
  sanitized_evidence_review_requested: false
  sanitized_evidence_review_passed: false
  sanitized_evidence_summary_exists: false
  evidence_reviewer: null
  evidence_reviewed_at: null
  review_result: pending
  raw_evidence_retained: false
  raw_source_retained: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 review shape。

## Review Preconditions

```yaml
sanitized_evidence_review_preconditions:
  required_before_review:
    - post_read_sanitization_chain
    - sanitized_evidence_summary
    - redaction_policy
    - no_git_storage_for_raw_values
    - manual_safety_review_route
  still_not_allowed:
    - raw_source_retained
    - raw_evidence_retained
    - implementation_code_created
    - ipc_handler_created
    - preload_runtime_code_created
    - api_called
    - daily_note_called
```

本阶段样例不得把 `sanitized_evidence_review_passed`、`implementation_authorized`、`memory_write_authorized` 或 `daily_note_write_authorized` 设为 `true`。未来即使复核通过，也只允许进入下一独立 decision routing，不得由文档、contract 或 Review Console 自动写实现或写记忆。

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

## Boundary After Review Gate

脱敏证据人工复核门记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义脱敏证据人工复核门。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不保留 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

