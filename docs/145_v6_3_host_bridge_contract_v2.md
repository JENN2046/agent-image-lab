# v6.3 Host Bridge Contract v2

本文记录 v6.3 Host Bridge Contract v2。该阶段只固化未来 VCPChat host bridge 的 channel、payload、ack、安全边界和授权门槛；不创建真实 IPC handler，不创建 preload 代码，不创建 renderer 集成代码，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不创建图片，不写 VCP 记忆，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v6_3_host_bridge_contract_v2
version: v6.3
current_phase: "v6.3 host bridge contract v2"
validation_file: scripts/validate_v6_3_host_bridge_contract_v2.js
current_head: abf0c1d
previous_phase: "v6.2 runtime state model alignment"
previous_record: docs/144_v6_2_runtime_state_model_alignment.md
default_next_phase: "v6.4 Adapter -> Review Console Runtime Roundtrip Fixture"
contract_only: true
implementation_not_authorized_by_this_record: true
```

## Contract Goal

```yaml
contract_goal:
  summary_cn: "把未来 host bridge v2 的输入、输出、channel allowlist、ack 和 Electron 安全边界固定为 contract。"
  primary_question_cn: "未来 VCPChat 嵌入实现应暴露哪些最小 API，以及每个 API 只能传递哪些草案字段。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_ipc_or_preload_creation: true
```

## Evidence Scope

```yaml
evidence_scope:
  existing_embed_contract: review_console/embed_contract/vcpchat_embed_contract.md
  runtime_handoff_contract: review_console/embed_contract/review_console_runtime_handoff.md
  host_bridge_mock: review_console/runtime_prototype/host_bridge_mock.js
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
  runtime_state_alignment: docs/144_v6_2_runtime_state_model_alignment.md
  runtime_output_example: tests/schema_examples/v1_2_runtime_prototype_output.example.yaml
```

## Channel Allowlist v2

```yaml
channel_allowlist_v2:
  - channel: imageLabReview.loadSession
    direction: host_to_renderer
    purpose_cn: "加载受控 review session seed。"
    implementation_exists_now: false
  - channel: imageLabReview.previewDraft
    direction: renderer_to_host
    purpose_cn: "预览草案并返回 host 侧安全检查摘要。"
    implementation_exists_now: false
  - channel: imageLabReview.submitDraft
    direction: renderer_to_host
    purpose_cn: "提交草案给 host 侧受控流程并返回 host_submit_ack。"
    implementation_exists_now: false
  - channel: imageLabReview.cancel
    direction: renderer_to_host
    purpose_cn: "取消当前 Review Console session，不产生外部副作用。"
    implementation_exists_now: false
```

这些 channel 名称来自既有 VCPChat embed contract，但 v6.3 仍是 contract。它们不代表真实 VCPChat 已注册 IPC handler。

## Method Contracts

```yaml
method_contracts:
  loadSession:
    channel: imageLabReview.loadSession
    request_payload_allowed:
      session_ref: string
      task_id: string
      case_id: string
      project: string
    response_payload_allowed:
      review_session_seed: map
      image_case_seed: map
      memory_preview_seed: map
      prototype_guard: map
      host_context:
        source_kind: placeholder_or_sanitized_reference
        raw_source_included: false
    forbidden_payload:
      - secret_raw_value
      - endpoint_raw_value
      - private_path_raw_value
      - raw_source_code
      - raw_manifest
      - raw_plugin_output
      - image_binary

  previewDraft:
    channel: imageLabReview.previewDraft
    request_payload_allowed:
      review_session_draft: map
      image_case_draft: map
      memory_delta_draft: map
      prototype_guard: map
    response_payload_allowed:
      validation_passed: boolean
      validation_summary_cn: string
      field_mapping_warnings_cn: list
      safety_gate: map
      side_effects_performed: false
    forbidden_result:
      - daily_note_write_result
      - plugin_execution_result
      - api_response_raw
      - disk_write_result
      - image_binary_result

  submitDraft:
    channel: imageLabReview.submitDraft
    request_payload_allowed:
      review_session_draft: map
      image_case_draft: map
      memory_delta_draft: map
      prototype_guard: map
      requested_route: review_only | archive_candidate | memory_request | cancel
    response_payload_allowed:
      host_submit_ack:
        accepted_by_host: boolean
        draft_received: boolean
        validation_passed: boolean
        side_effects_performed: false
        status_cn: string
      next_authorization_point: map
    forbidden_result:
      - actual_daily_note_write
      - actual_plugin_call
      - actual_api_call
      - actual_file_write
      - actual_image_creation

  cancel:
    channel: imageLabReview.cancel
    request_payload_allowed:
      session_id: string
      cancel_reason_cn: string
    response_payload_allowed:
      cancelled: boolean
      side_effects_performed: false
      status_cn: string
    forbidden_result:
      - delete_remote_state
      - delete_local_assets
      - write_memory
```

## Draft Bundle v2

```yaml
draft_bundle_v2:
  required_sections:
    - review_session_draft
    - image_case_draft
    - memory_delta_draft
    - prototype_guard
  optional_sections:
    - host_submit_ack
    - next_authorization_point
  invariant_summary:
    - "human_review 覆盖 ai_review。"
    - "accepted 必须有人工作为批准来源。"
    - "memory_approval 未 approved 时 memory_delta.write_mode 保持 draft。"
    - "confirmed 只表示写入申请，不表示 DailyNote 已执行。"
    - "prototype_guard 必须保持无插件、无 API、无 DailyNote、无磁盘写入、无图片创建。"
```

## Electron Security Boundary v2

```yaml
electron_security_boundary_v2:
  context_isolation_required: true
  context_isolation_expected_value: true
  node_integration_allowed: false
  node_integration_expected_value: false
  preload_allowlist_required: true
  ipc_sender_validation_required: true
  origin_window_validation_required: true
  ipc_channel_allowlist_required: true
  payload_schema_validation_required: true
  sanitized_error_required: true
  url_query_secret_transfer_allowed: false
  url_hash_secret_transfer_allowed: false
  renderer_storage_secret_transfer_allowed: false
  raw_ipc_payload_logging_allowed: false
```

## Boundary State

```yaml
boundary_state:
  contract_file_added: true
  runtime_code_modified: false
  tag_created: false
  package_created: false
  github_release_published: false
  release_assets_uploaded: false
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  real_manifest_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  adapter_execution_entrypoint_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_runtime_performed: false
  image_file_created: false
```

## Acceptance Meaning

v6.3 表示 host bridge v2 的 channel、payload、ack 和 Electron 安全边界已经具备 contract 草案。它不代表真实 VCPChat 已读取、真实 IPC handler 已创建、preload 已创建或 renderer 集成已实现。

默认下一步是 `v6.4 Adapter -> Review Console Runtime Roundtrip Fixture`，继续使用本仓库内占位 dry-run 数据，验证 Adapter 草案如何进入 Review Console runtime 状态流。
