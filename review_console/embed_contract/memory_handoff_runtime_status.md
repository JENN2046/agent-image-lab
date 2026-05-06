# Memory Handoff Runtime Status

本文定义 Review Console runtime 中记忆交接状态的 contract。它只描述状态展示和 no-write 审计，不调用 DailyNote，不写 VCP 长期记忆，不创建 IPC/preload/renderer 代码，不读取真实 VCPChat / VCPToolBox。

## Contract Status

```yaml
contract:
  name: memory_handoff_runtime_status
  version: v6.5-status-contract
  status: status_only
  source_contracts:
    - memory_policy/v1_3_daily_note_handoff_contract.md
    - memory_policy/memory_delta.schema.yaml
    - review_console/runtime_prototype/FIELD_MAPPING.md
    - tests/schema_examples/phase15_memory_handoff_no_write.example.yaml
  daily_note_called: false
  vcp_memory_written: false
  actual_write_performed: false
  runtime_code_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
```

## Allowed Runtime Input

```yaml
allowed_runtime_input:
  memory_preview:
    chinese_diary_title: string
    chinese_diary_content: string
    target_notebook: string
    safety: map
  memory_approval:
    status: pending | approved | rejected | not_required
    approved_by: string | null
    approved_at: string | null
    rejection_reason_cn: string | null
  prototype_guard:
    daily_note_called: false
    vcp_plugin_called: false
    api_called: false
    disk_write_performed: false
    image_file_created: false
```

输入不得包含密钥、token、cookie、密码、endpoint 原文、私密路径、客户隐私、raw manifest、raw plugin output、raw runtime log 或图片二进制。

## Runtime Output Status

```yaml
runtime_output_status:
  memory_delta_draft:
    type: map
    required: true
  memory_write_request_status:
    type: map
    required: true
  daily_note_preflight_status:
    type: map
    required: true
  no_write_execution_audit_stub:
    type: map
    required: true
  task_panel_memory_status:
    type: map
    required: true
```

这些输出只用于展示和人工审计，不是写入回执。

## Route Semantics

```yaml
route_semantics:
  pending_memory_request:
    write_mode: draft
    approval_status: pending
    should_write_to_vcp: false
    daily_note_called: false
  approved_request_no_write:
    write_mode: confirmed
    approval_status: approved
    should_write_to_vcp: true
    daily_note_write_authorized: false
    daily_note_called: false
    vcp_memory_written: false
    actual_write_performed: false
  forbidden_sensitive_rejection:
    write_mode: forbidden
    approval_status: rejected
    should_write_to_vcp: false
    sensitive_original_copied: false
    raw_sensitive_content_saved: false
```

## No-write Assertions

```yaml
no_write_assertions:
  should_write_to_vcp_is_request_not_execution: true
  confirmed_is_approval_invariant_not_execution: true
  daily_note_write_authorized: false
  daily_note_called: false
  vcp_memory_written: false
  actual_write_performed: false
  daily_note_write_proof_present: false
  image_binary_saved_to_memory: false
  raw_sensitive_content_saved: false
```

## Acceptance

- Runtime 可以展示记忆写入申请状态。
- Runtime 不得调用 DailyNote。
- Runtime 不得写 VCP 长期记忆。
- Runtime 不得把图片二进制、raw manifest、raw plugin output、密钥、私密路径或客户隐私写入 memory_delta。
- `should_write_to_vcp=true` 只能表示写入申请被批准。
- `write_mode=confirmed` 只能表示审批不变量满足，不代表写入完成。
