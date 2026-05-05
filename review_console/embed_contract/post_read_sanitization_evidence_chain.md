# Post-read Sanitization and Evidence Chain Contract

本文定义真实 VCPChat 一次性读取后的 post-read 脱敏与证据处理链 contract。它只描述未来读取后材料如何进入脱敏复核，不读取真实源码，不保存真实路径，不保存真实命令，不保存 raw source，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Contract Status

```yaml
contract:
  name: post_read_sanitization_evidence_chain
  version: v2.5-post-read-sanitization-evidence-chain-template
  status: post_read_sanitization_chain_template_only
  post_read_sanitization_required: true
  post_read_sanitization_requested: false
  post_read_sanitization_performed: false
  evidence_packet_created: false
  sanitized_evidence_summary_created: false
  raw_evidence_retained: false
  raw_source_retained: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_execution_allowed: false
```

## Required Chain Shape

```yaml
required_chain_shape:
  chain_id: string
  read_run_id: null
  post_read_sanitization_required: true
  post_read_sanitization_requested: false
  post_read_sanitization_performed: false
  evidence_packet_created: false
  sanitized_evidence_summary_created: false
  raw_evidence_retained: false
  raw_source_retained: false
  source_read_performed: false
  audit_summary_cn: string
```

真实路径、真实读取命令、shell 文本、源码原文、endpoint 原文、环境变量值、secret、客户隐私和 runtime log 原文不得进入 chain shape。

## Sanitization Preconditions

```yaml
sanitization_preconditions:
  required_before_sanitization:
    - real_read_run_record_reference
    - raw_evidence_boundary
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

本阶段样例不得把 `post_read_sanitization_performed`、`evidence_packet_created` 或 `sanitized_evidence_summary_created` 设为 `true`。未来即使完成脱敏，也只允许进入下一独立脱敏证据人工复核门，不得由文档、contract 或 Review Console 自动写实现或写记忆。

## Forbidden Evidence Content

```yaml
forbidden_evidence_content:
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

## Boundary After Sanitization Chain

post-read 脱敏与证据处理链记录完成后也不得自动进入：

- VCPChat 修改。
- IPC handler 创建。
- preload 或 renderer 代码创建。
- 插件调用。
- API 调用。
- DailyNote 写入。
- VCP 长期记忆写入。
- 图片创建或资产写入。

## Acceptance

- 本 contract 只定义 post-read 脱敏与证据处理链。
- 本 contract 不读取真实源码。
- 本 contract 不保存真实路径。
- 本 contract 不保存真实读取命令。
- 本 contract 不保留 raw source。
- 本 contract 不授权修改真实 VCPChat。
- 本 contract 不授权插件、API、DailyNote、VCP 记忆或文件系统调用。

