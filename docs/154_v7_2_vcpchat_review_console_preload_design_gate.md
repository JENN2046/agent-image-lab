# v7.2 VCPChat Review Console Preload Design Gate

本文记录 v7.2 VCPChat Review Console Preload Design Gate。该阶段只在 Agent Image Lab 内设计未来专用 `imageLabReview` preload allowlist 和 channel contract；不读取或修改真实 VCPChat / VCPToolBox，不保存真实本机路径，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v7_2_vcpchat_review_console_preload_design_gate
version: v7.2
current_phase: "v7.2 vcpchat review console preload design gate"
validation_file: scripts/validate_v7_2_vcpchat_review_console_preload_design_gate.js
current_head: cfffec3
previous_phase: "v7.1 vcpchat preload surface read-only intake"
previous_record: docs/153_v7_1_vcpchat_preload_surface_read_only_intake.md
default_next_phase: "v7.3 VCPChat Review Console IPC Handler Design Gate"
design_gate_only: true
implementation_not_authorized_by_this_record: true
```

## Design Goal

```yaml
design_goal:
  summary_cn: "为未来 Review Console 嵌入 VCPChat 设计专用 imageLabReview preload allowlist。"
  primary_question_cn: "如何用最小 API 暴露 Review Console 草案流，而不复用 broad electronAPI。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_vcpchat_write_allowed: true
```

## Evidence Scope

```yaml
evidence_scope:
  preload_surface_intake: docs/153_v7_1_vcpchat_preload_surface_read_only_intake.md
  preload_surface_contract: review_console/embed_contract/vcpchat_preload_surface_read_only_intake.md
  host_bridge_contract_v2: review_console/embed_contract/host_bridge_contract_v2.md
  implementation_authorization_request: docs/151_v6_9_vcpchat_embed_implementation_authorization_request.md
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
```

## Dedicated Preload Allowlist

```yaml
dedicated_preload_allowlist:
  api_name: imageLabReview
  must_not_reuse_broad_electronAPI: true
  must_not_expose_chatAPI_wholesale: true
  allowed_methods:
    loadSession:
      channel: imageLabReview.loadSession
      direction: host_to_renderer
      side_effects_allowed: false
    previewDraft:
      channel: imageLabReview.previewDraft
      direction: renderer_to_host
      side_effects_allowed: false
    submitDraft:
      channel: imageLabReview.submitDraft
      direction: renderer_to_host
      side_effects_allowed: false
    cancel:
      channel: imageLabReview.cancel
      direction: renderer_to_host
      side_effects_allowed: false
```

## Channel Payload Contract

```yaml
channel_payload_contract:
  imageLabReview.loadSession:
    request_allowed:
      session_ref: string
      task_id: string
      case_id: string
    response_allowed:
      review_session_seed: map
      image_case_seed: map
      memory_preview_seed: map
      prototype_guard: map
    forbidden:
      - raw_source_code
      - raw_private_path
      - secret_or_token
      - image_binary

  imageLabReview.previewDraft:
    request_allowed:
      review_session_draft: map
      image_case_draft: map
      memory_delta_draft: map
      prototype_guard: map
    response_allowed:
      validation_passed: boolean
      validation_summary_cn: string
      field_mapping_warnings_cn: list
      side_effects_performed: false

  imageLabReview.submitDraft:
    request_allowed:
      review_session_draft: map
      image_case_draft: map
      memory_delta_draft: map
      prototype_guard: map
      requested_route: review_only | archive_candidate | memory_request | cancel
    response_allowed:
      host_submit_ack: map
      next_authorization_point: map
      side_effects_performed: false

  imageLabReview.cancel:
    request_allowed:
      session_id: string
      cancel_reason_cn: string
    response_allowed:
      cancelled: boolean
      status_cn: string
      side_effects_performed: false
```

## Explicitly Forbidden Bindings

```yaml
explicitly_forbidden_bindings:
  sendToVCP: forbidden
  getFileAsBase64: forbidden
  getTextContent: forbidden
  saveChatHistory: forbidden
  saveGroupChatHistory: forbidden
  writeTxtNote: forbidden
  savePastedImageToFile: forbidden
  desktopGetCredentials: forbidden
  desktopSaveWidgetFile: forbidden
  executePythonCode: forbidden
  readImageFromClipboard: forbidden
```

这些能力存在于 VCPChat 当前 broad preload surface 中，但不得进入 `imageLabReview` 专用 allowlist。

## Future Implementation Shape

```yaml
future_implementation_shape:
  preferred_location_cn: "未来应新增或扩展专用 preload allowlist，而不是把 Review Console 接到 broad electronAPI。"
  renderer_global_name: imageLabReview
  global_object_shape:
    loadSession: function
    previewDraft: function
    submitDraft: function
    cancel: function
  implementation_allowed_now: false
  ipc_handler_creation_allowed_now: false
  preload_code_creation_allowed_now: false
  renderer_mount_creation_allowed_now: false
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

v7.2 表示未来 `imageLabReview` 专用 preload allowlist 和 channel payload contract 已设计完成。它不代表真实 VCPChat 已修改，不代表 IPC handler 或 preload 代码已创建，也不代表 Review Console 已嵌入真实 VCPChat。

默认下一步是 `v7.3 VCPChat Review Console IPC Handler Design Gate`，只设计主进程 IPC handler 的最小行为和 sender 校验；继续不写真实 VCPChat。
