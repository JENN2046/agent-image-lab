# v6.2 Runtime State Model Alignment

本文记录 v6.2 Runtime State Model Alignment。该阶段只对齐 Review Console runtime prototype 的草案输出、核心 schema、Task Panel 状态骨架、prototype guard 和 host submit ack 的状态关系；不修改 runtime 代码，不创建 IPC/preload/renderer 集成，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不创建图片，不写 VCP 记忆，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v6_2_runtime_state_model_alignment
version: v6.2
current_phase: "v6.2 runtime state model alignment"
validation_file: scripts/validate_v6_2_runtime_state_model_alignment.js
current_head: b2ab526
previous_phase: "v6.1 runtime product surface audit"
previous_record: docs/143_v6_1_runtime_product_surface_audit.md
default_next_phase: "v6.3 Host Bridge Contract v2"
implementation_not_authorized_by_this_record: true
```

## Alignment Goal

```yaml
alignment_goal:
  summary_cn: "把 runtime 草案输出、schema 边界、Task Panel 状态和 no-execution guard 对齐成一条可验收状态流。"
  primary_question_cn: "后续 host bridge contract v2 应该接收和返回哪些状态，而不是直接创建真实 IPC 或 preload。"
  no_runtime_code_change_required: true
  no_external_read_required: true
```

## Source Evidence

```yaml
source_evidence:
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
  runtime_output_example: tests/schema_examples/v1_2_runtime_prototype_output.example.yaml
  task_panel_state_example: tests/schema_examples/v1_5_task_panel_state.example.yaml
  review_session_schema: schemas/review_session.schema.yaml
  image_case_schema: schemas/image_case.schema.yaml
  memory_delta_schema: schemas/memory_delta.schema.yaml
  task_panel_state_schema: task_panel/task_panel_state.schema.yaml
  runtime_product_surface_audit: docs/143_v6_1_runtime_product_surface_audit.md
```

## Runtime State Flow

```yaml
runtime_state_flow:
  - step: host_input_normalized
    owner: host_bridge_mock
    state_source: controlled_placeholder_session
    output_state: normalized_session
    summary_cn: "host mock 提供受控占位 session，runtime_guard.normalizeSession 为可选列表字段提供默认值。"

  - step: review_session_draft_built
    owner: runtime_app
    state_source:
      - normalized_session
      - ai_review
      - human_review
      - memory_preview
      - memory_approval
    output_state: review_session_draft
    summary_cn: "runtime app 生成 review_session_draft，human_review 覆盖 ai_review，memory_preview 仍只是中文预览。"

  - step: image_case_draft_built
    owner: runtime_app
    state_source:
      - review_session_draft
      - current_version
      - human_approval
    output_state: image_case_draft
    summary_cn: "image_case_draft 与 task_id/case_id 对齐，accepted 必须来自人工批准，资产仍是占位引用。"

  - step: memory_delta_draft_built
    owner: runtime_app
    state_source:
      - review_session_draft.memory_preview
      - review_session_draft.memory_approval
    output_state: memory_delta_draft
    summary_cn: "memory_delta_draft 根据 memory_approval 派生 write_mode；未 approved 时保持 draft，approved 也只是写入申请。"

  - step: prototype_guard_checked
    owner: runtime_guard
    state_source:
      - review_session_draft
      - image_case_draft
      - memory_delta_draft
      - prototype_guard
    output_state: guard_result
    summary_cn: "runtime_guard 检查所有 no-execution flag、accepted 人工审批和 memory write 审批不变量。"

  - step: host_submit_ack_generated
    owner: host_bridge_mock
    state_source:
      - safe_draft_bundle
      - guard_result
    output_state: host_submit_ack
    summary_cn: "host mock 只生成安全回执，side_effects_performed 固定 false。"

  - step: task_panel_state_projected
    owner: task_panel_status_backbone
    state_source:
      - review_session_draft
      - image_case_draft
      - memory_delta_draft
      - prototype_guard
      - host_submit_ack
    output_state: task_panel_state
    summary_cn: "Task Panel 只展示任务、评审、记忆、资产、插件候选、Gatekeeper 和下一授权点状态，不触发执行。"
```

## State Alignment Rules

```yaml
state_alignment_rules:
  review_to_final:
    ai_review_is_suggestion: true
    human_review_overrides_ai: true
    final_review_source_required: human_review
    no_human_review_prevents_accepted: true

  review_to_image_case:
    task_id_must_match: true
    case_id_must_match: true
    final_score_uses_human_review: true
    accepted_requires_human_approval: true
    ai_archive_recommendation_is_final: false

  review_to_memory_delta:
    memory_preview_is_preview_only: true
    chinese_diary_content_required: true
    memory_approval_pending_maps_to_write_mode: draft
    memory_approval_rejected_maps_to_write_mode: forbidden
    memory_approval_approved_maps_to_write_mode: confirmed
    confirmed_is_write_request_not_daily_note_execution: true
    daily_note_called_by_runtime: false

  drafts_to_task_panel:
    review_status_source: review_session_draft
    asset_status_source: image_case_draft
    memory_status_source: memory_delta_draft
    no_execution_guard_source: prototype_guard
    next_authorization_point_required: true

  guard_to_host_ack:
    guard_must_pass_before_host_ack: true
    host_ack_is_not_external_write: true
    side_effects_performed_must_be_false: true
```

## Boundary State

```yaml
boundary_state:
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

v6.2 表示 runtime prototype 的草案输出、核心 schema、Task Panel 状态和 guard/ack 边界已经对齐成一条可审查状态流。它不是 runtime 代码变更，也不授权真实 VCPChat 集成。

默认下一步是 `v6.3 Host Bridge Contract v2`：在不读取真实 VCPChat、不创建 preload/IPC 的前提下，把 host bridge 未来 contract v2 的输入输出和安全字段固化。
