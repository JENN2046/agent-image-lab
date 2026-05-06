# v7.3 VCPChat Review Console IPC Handler Design Gate

本文记录 v7.3 VCPChat Review Console IPC Handler Design Gate。该阶段只在 Agent Image Lab 内设计未来 `imageLabReview` 主进程 IPC handler 的 sender 校验、payload 校验和 ack contract；不读取或修改真实 VCPChat / VCPToolBox，不保存真实本机路径，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v7_3_vcpchat_review_console_ipc_handler_design_gate
version: v7.3
current_phase: "v7.3 vcpchat review console ipc handler design gate"
validation_file: scripts/validate_v7_3_vcpchat_review_console_ipc_handler_design_gate.js
current_head: 154993d
previous_phase: "v7.2 vcpchat review console preload design gate"
previous_record: docs/154_v7_2_vcpchat_review_console_preload_design_gate.md
default_next_phase: "v7.4 VCPChat Review Console Renderer Mount Design Gate"
design_gate_only: true
implementation_not_authorized_by_this_record: true
```

## Design Goal

```yaml
design_goal:
  summary_cn: "为未来 Review Console 嵌入 VCPChat 设计主进程 IPC handler 的最小安全门。"
  primary_question_cn: "主进程如何只接受专用 imageLabReview channel，并对 sender、payload、ack 做受控校验。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_vcpchat_write_allowed: true
```

## Evidence Scope

```yaml
evidence_scope:
  preload_design_gate: docs/154_v7_2_vcpchat_review_console_preload_design_gate.md
  preload_design_contract: review_console/embed_contract/vcpchat_review_console_preload_design_gate.md
  preload_surface_intake: docs/153_v7_1_vcpchat_preload_surface_read_only_intake.md
  host_bridge_contract_v2: review_console/embed_contract/host_bridge_contract_v2.md
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
```

## IPC Channel Allowlist

```yaml
ipc_channel_allowlist:
  allowed_channels:
    imageLabReview.loadSession:
      pattern: invoke_request_response
      side_effects_allowed: false
    imageLabReview.previewDraft:
      pattern: invoke_request_response
      side_effects_allowed: false
    imageLabReview.submitDraft:
      pattern: invoke_request_response
      side_effects_allowed: false
    imageLabReview.cancel:
      pattern: invoke_request_response
      side_effects_allowed: false
  forbidden_channel_prefixes:
    - vcp
    - file
    - history
    - credential
    - image_binary
  wildcard_channel_allowed: false
  broad_passthrough_allowed: false
```

## Sender Validation Design

```yaml
sender_validation_design:
  required_sender_checks:
    registered_review_console_window: required
    sender_webcontents_matches_registered_window: required
    sender_not_destroyed: required
    session_id_matches_host_registered_session: required
    route_context_matches_review_console: required
    request_correlation_id_present: required
  forbidden_sender_sources:
    unknown_window: reject
    arbitrary_renderer: reject
    devtools_console: reject
    url_query_token_source: reject
    hash_token_source: reject
  rejection_behavior:
    throw_raw_error: false
    return_sanitized_ack: true
    log_raw_payload: false
```

Sender 校验不得依赖 URL query、hash、窗口标题、原始私密路径或未脱敏环境值传递权限。未来实现应由 host 创建 Review Console session，并把允许的 window / webContents / session ref 保存在主进程受控 registry 中。

## Payload Validation Design

```yaml
payload_validation_design:
  common_required_fields:
    request_id: string
    session_id: string
    task_id: string
    case_id: string
    prototype_guard: map
  common_guard_invariants:
    api_called: false
    vcp_plugin_called: false
    daily_note_called: false
    disk_write_performed: false
    image_file_created: false
  forbidden_payload_fields:
    - raw_source_code
    - raw_private_path
    - secret_or_token
    - cookie
    - password
    - endpoint_raw
    - image_binary
    - plugin_output_raw
  chinese_text_requirements:
    memory_preview.chinese_diary_content: required_when_present
    rejection_reason_cn: required_for_rejection
    audit_summary_cn: required
```

## Channel Handler Design

```yaml
channel_handler_design:
  imageLabReview.loadSession:
    validates:
      - sender
      - request_id
      - session_ref
      - task_id
      - case_id
    response:
      review_session_seed: map
      image_case_seed: map
      memory_preview_seed: map
      prototype_guard: map
      ack: map
    side_effects_performed: false

  imageLabReview.previewDraft:
    validates:
      - sender
      - request_id
      - review_session_draft
      - image_case_draft
      - memory_delta_draft
      - prototype_guard
    response:
      validation_passed: boolean
      validation_summary_cn: string
      field_mapping_warnings_cn: list
      ack: map
    side_effects_performed: false

  imageLabReview.submitDraft:
    validates:
      - sender
      - request_id
      - review_session_draft
      - image_case_draft
      - memory_delta_draft
      - requested_route
      - prototype_guard
    response:
      host_submit_ack: map
      next_authorization_point: map
      ack: map
    side_effects_performed: false

  imageLabReview.cancel:
    validates:
      - sender
      - request_id
      - session_id
      - cancel_reason_cn
    response:
      cancelled: boolean
      status_cn: string
      ack: map
    side_effects_performed: false
```

## Ack Contract

```yaml
ack_contract:
  required_fields:
    ack_id: string
    request_id: string
    channel: string
    session_id: string
    accepted_by_handler: boolean
    validation_passed: boolean
    rejection_reason_cn: string_or_null
    audit_summary_cn: string
    side_effects_performed: false
    next_authorization_point: map_or_null
  rejected_ack_rules:
    accepted_by_handler: false
    validation_passed: false
    side_effects_performed: false
    rejection_reason_cn: required_sanitized_chinese
  accepted_ack_rules:
    accepted_by_handler: true
    validation_passed: true
    side_effects_performed: false
    rejection_reason_cn: null
```

## Implementation Non-goals

```yaml
implementation_non_goals:
  create_ipcMain_handle: false
  create_preload_bridge: false
  create_renderer_mount: false
  modify_vcpchat_source: false
  call_vcp_plugin: false
  call_external_api: false
  call_daily_note: false
  write_vcp_memory: false
  write_files_from_handler: false
  create_image_file: false
```

## Boundary State

```yaml
boundary_state:
  design_gate_added: true
  implementation_task_authorized: false
  implementation_allowed: false
  runtime_code_modified: false
  vcpchat_code_modified: false
  vcptoolbox_code_modified: false
  tag_created: false
  package_created: false
  github_release_published: false
  release_assets_uploaded: false
  additional_vcpchat_read_performed: false
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

v7.3 表示未来 `imageLabReview` IPC handler 的 sender 校验、payload 校验和 ack contract 已设计完成。它不代表真实 VCPChat 已修改，不代表 `ipcMain.handle` 已创建，不代表 preload bridge 或 renderer mount 已实现，也不代表 Review Console 已嵌入真实 VCPChat。

默认下一步是 `v7.4 VCPChat Review Console Renderer Mount Design Gate`，只设计 renderer mount 与 host bridge mock 的收口关系；继续不写真实 VCPChat。
