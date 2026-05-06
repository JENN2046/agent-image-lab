# v7.4 VCPChat Review Console Renderer Mount Design Gate

本文记录 v7.4 VCPChat Review Console Renderer Mount Design Gate。该阶段只在 Agent Image Lab 内设计未来 Review Console runtime 的 renderer mount、host bridge mock 和挂载边界；不读取或修改真实 VCPChat / VCPToolBox，不保存真实本机路径，不创建 IPC/preload/renderer 实现代码，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v7_4_vcpchat_review_console_renderer_mount_design_gate
version: v7.4
current_phase: "v7.4 vcpchat review console renderer mount design gate"
validation_file: scripts/validate_v7_4_vcpchat_review_console_renderer_mount_design_gate.js
current_head: 856e7a8
previous_phase: "v7.3 vcpchat review console ipc handler design gate"
previous_record: docs/155_v7_3_vcpchat_review_console_ipc_handler_design_gate.md
default_next_phase: "v7.5 VCPChat Review Console Runtime Integration Authorization Gate"
design_gate_only: true
implementation_not_authorized_by_this_record: true
```

## Design Goal

```yaml
design_goal:
  summary_cn: "为未来 Review Console 嵌入 VCPChat 设计 renderer mount、host bridge mock 和 runtime 挂载边界。"
  primary_question_cn: "renderer 如何只通过 imageLabReview host bridge 交换草案，而不触达 broad electronAPI、chatAPI、插件、API、DailyNote 或文件系统。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_vcpchat_write_allowed: true
```

## Evidence Scope

```yaml
evidence_scope:
  preload_design_gate: docs/154_v7_2_vcpchat_review_console_preload_design_gate.md
  ipc_handler_design_gate: docs/155_v7_3_vcpchat_review_console_ipc_handler_design_gate.md
  preload_design_contract: review_console/embed_contract/vcpchat_review_console_preload_design_gate.md
  ipc_handler_design_contract: review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md
  runtime_prototype_readme: review_console/runtime_prototype/README.md
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
  runtime_guard: review_console/runtime_prototype/runtime_guard.js
  host_bridge_mock: review_console/runtime_prototype/host_bridge_mock.js
```

## Renderer Mount Boundary

```yaml
renderer_mount_boundary:
  future_renderer_global_dependency: imageLabReview
  future_mount_root_id: image-lab-review-root
  future_mount_mode: isolated_review_console_surface
  mount_must_be_explicit: true
  auto_mount_into_chat_surface_allowed: false
  broad_dom_scraping_allowed: false
  chat_history_access_allowed: false
  direct_vcpchat_state_mutation_allowed: false
  direct_file_system_access_allowed: false
  direct_daily_note_access_allowed: false
  direct_plugin_access_allowed: false
```

未来 renderer mount 只能把 Review Console runtime 挂到明确的隔离容器中。不得从聊天 DOM 抓取上下文，不得改写 VCPChat 既有消息状态，不得用 URL query、hash、窗口标题或私密路径传递权限。

## Host Bridge Mock Boundary

```yaml
host_bridge_mock_boundary:
  mock_contract_source: review_console/runtime_prototype/host_bridge_mock.js
  future_real_bridge_global_name: imageLabReview
  mock_purpose_cn: "在 Agent Image Lab 内模拟未来 host bridge 输入输出，不代表真实 VCPChat 已接入。"
  allowed_mock_methods:
    loadSession: imageLabReview.loadSession
    previewDraft: imageLabReview.previewDraft
    submitDraft: imageLabReview.submitDraft
    cancel: imageLabReview.cancel
  mock_side_effects_allowed: false
  real_bridge_side_effects_allowed: false
  mock_must_not_call_fetch: true
  mock_must_not_call_daily_note: true
  mock_must_not_call_vcp_plugin: true
  mock_must_not_write_disk: true
  mock_must_not_create_image: true
```

host bridge mock 的责任只是帮助 Review Console runtime 形成可映射草案：`review_session_draft`、`image_case_draft`、`memory_delta_draft` 和 `prototype_guard`。它不证明真实 VCPChat bridge 已经存在。

## Runtime Input Contract

```yaml
runtime_input_contract:
  source: imageLabReview.loadSession
  required_seed_fields:
    review_session_seed: map
    image_case_seed: map
    memory_preview_seed: map
    prototype_guard: map
  prototype_guard_required_values:
    api_called: false
    vcp_plugin_called: false
    daily_note_called: false
    disk_write_performed: false
    image_file_created: false
  forbidden_input_content:
    raw_source_code: forbidden
    raw_private_path: forbidden
    secret_or_token: forbidden
    cookie: forbidden
    password: forbidden
    endpoint_raw: forbidden
    image_binary: forbidden
    plugin_output_raw: forbidden
```

## Runtime Output Contract

```yaml
runtime_output_contract:
  preview_route:
    method: imageLabReview.previewDraft
    output:
      review_session_draft: map
      image_case_draft: map
      memory_delta_draft: map
      prototype_guard: map
    side_effects_performed: false
  submit_route:
    method: imageLabReview.submitDraft
    output:
      review_session_draft: map
      image_case_draft: map
      memory_delta_draft: map
      prototype_guard: map
      requested_route: review_only | archive_candidate | memory_request | cancel
    side_effects_performed: false
  cancel_route:
    method: imageLabReview.cancel
    output:
      session_id: string
      cancel_reason_cn: string
    side_effects_performed: false
```

## Runtime Guard Boundary

```yaml
runtime_guard_boundary:
  guard_source: review_console/runtime_prototype/runtime_guard.js
  required_guard_values:
    api_called: false
    daily_note_called: false
    vcp_plugin_called: false
    disk_write_performed: false
    image_file_created: false
  human_review_overrides_ai_review: true
  accepted_requires_human_approval: true
  memory_approval_not_approved_keeps_draft: true
  memory_preview_chinese_required: true
```

## Mount Lifecycle Design

```yaml
mount_lifecycle_design:
  initialize:
    requires_registered_session: true
    requires_imageLabReview_global: true
    requires_prototype_guard: true
    failure_mode: render_sanitized_error_state
  preview:
    validates_field_mapping: true
    returns_drafts_only: true
    writes_daily_note: false
    writes_files: false
  submit:
    creates_authorization_request_only: true
    performs_actual_write: false
    performs_plugin_call: false
    performs_api_call: false
  cancel:
    records_sanitized_cancel_reason_cn: true
    performs_actual_write: false
```

## Implementation Non-goals

```yaml
implementation_non_goals:
  create_renderer_mount_code: false
  create_preload_bridge: false
  create_ipcMain_handle: false
  modify_vcpchat_source: false
  read_additional_vcpchat_source: false
  call_vcp_plugin: false
  call_external_api: false
  call_daily_note: false
  write_vcp_memory: false
  write_files_from_renderer: false
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

v7.4 表示未来 Review Console runtime 的 renderer mount、host bridge mock 和挂载边界已设计完成。它不代表真实 VCPChat 已修改，不代表 renderer mount 已创建，不代表 preload bridge 或 IPC handler 已实现，也不代表 Review Console 已嵌入真实 VCPChat。

默认下一步是 `v7.5 VCPChat Review Console Runtime Integration Authorization Gate`，只整理首次真实实现前的授权门槛；继续不写真实 VCPChat，除非用户明确给出精确文件级写入授权。
