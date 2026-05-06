# v6.4 Adapter -> Review Console Runtime Roundtrip Fixture

本文记录 v6.4 Adapter -> Review Console Runtime Roundtrip Fixture。该阶段只固化一个本仓库内的 roundtrip fixture：`Adapter dry-run dispatch -> Gatekeeper handoff -> Review Console handoff -> Host Bridge Contract v2 -> runtime draft bundle -> Task Panel 状态`。它不选择真实插件，不调用插件、API、DailyNote，不读取真实 VCPChat / VCPToolBox，不创建 IPC/preload/renderer 实现代码，不创建图片，不写 VCP 记忆，也不发布 GitHub Release。

```yaml
status: completed_validated_project_local_v6_4_adapter_review_console_roundtrip_fixture
version: v6.4
current_phase: "v6.4 adapter review console runtime roundtrip fixture"
validation_file: scripts/validate_v6_4_adapter_review_console_roundtrip_fixture.js
current_head: 43dc358
previous_phase: "v6.3 host bridge contract v2"
previous_record: docs/145_v6_3_host_bridge_contract_v2.md
default_next_phase: "v6.5 Memory Handoff Runtime Status"
fixture_only: true
implementation_not_authorized_by_this_record: true
```

## Fixture Goal

```yaml
fixture_goal:
  summary_cn: "用占位 dry-run 数据验证 Adapter 输出如何进入 Review Console runtime 状态流。"
  primary_question_cn: "dispatch_plan_draft、Gatekeeper handoff、Review Console handoff 和 host bridge v2 草案如何映射成 runtime draft bundle。"
  no_runtime_code_change_required: true
  no_external_read_required: true
  no_plugin_selection_allowed: true
```

## Evidence Scope

```yaml
evidence_scope:
  adapter_runtime_contract: integrations/vcp/adapter_runtime_contract.md
  vcp_dispatch_plan_schema: integrations/vcp/vcp_dispatch_plan.schema.yaml
  adapter_dry_run_fixture: tests/schema_examples/phase_d_adapter_dry_run_minimal.example.yaml
  dispatch_readiness_fixture: tests/schema_examples/phase13_dry_run_dispatch_readiness.example.yaml
  adapter_delivery_surface: tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml
  review_console_adapter_handoff: tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml
  host_bridge_contract_v2: review_console/embed_contract/host_bridge_contract_v2.md
  runtime_field_mapping: review_console/runtime_prototype/FIELD_MAPPING.md
  runtime_state_alignment: docs/144_v6_2_runtime_state_model_alignment.md
  host_bridge_contract_record: docs/145_v6_3_host_bridge_contract_v2.md
```

## Roundtrip Flow

```yaml
roundtrip_flow:
  - step: adapter_dry_run_input
    owner: AgentImageLabAdapter
    state_source: vcp_task_envelope_dry_run
    output_state: adapter_preflight_input
    summary_cn: "Adapter 只接收 dry-run task envelope，占位输入不含图片二进制或敏感原文。"

  - step: adapter_dry_run_dispatch
    owner: AgentImageLabAdapter
    state_source: adapter_preflight_input
    output_state: dispatch_plan_draft
    summary_cn: "Adapter 返回 dry-run dispatch_plan_draft，selected_plugin=null，max_plugin_calls=0，execution_blocked=true。"

  - step: gatekeeper_display_handoff
    owner: Gatekeeper_Agent
    state_source: dispatch_plan_draft
    output_state: gatekeeper_handoff
    summary_cn: "Gatekeeper 只接收中文脱敏风险摘要和 blocked_actions，不接收敏感原文。"

  - step: review_console_display_handoff
    owner: Review_Console
    state_source:
      - dispatch_plan_draft
      - gatekeeper_handoff
    output_state: review_console_handoff
    summary_cn: "Review Console handoff 只用于展示和人工意见，不触发真实执行。"

  - step: host_bridge_load_session
    owner: host_bridge_contract_v2
    state_source:
      - review_console_handoff
      - sanitized_runtime_seed
    output_state: review_session_seed
    summary_cn: "host bridge loadSession 只返回脱敏 seed 和 prototype_guard，不返回 raw source 或真实路径。"

  - step: runtime_draft_bundle_built
    owner: Review_Console_Runtime
    state_source:
      - review_session_seed
      - review_console_handoff
    output_state: runtime_draft_bundle
    summary_cn: "runtime 生成 review_session_draft、image_case_draft、memory_delta_draft 和 prototype_guard。"

  - step: host_bridge_preview_ack
    owner: host_bridge_contract_v2
    state_source: runtime_draft_bundle
    output_state: validation_preview_ack
    summary_cn: "previewDraft 只返回校验摘要和中文 warnings，side_effects_performed=false。"

  - step: host_bridge_submit_ack
    owner: host_bridge_contract_v2
    state_source: runtime_draft_bundle
    output_state: host_submit_ack
    summary_cn: "submitDraft 只返回 host_submit_ack 和下一授权点，不执行插件、API、DailyNote 或文件写入。"

  - step: task_panel_projection
    owner: Task_Panel_Status_Backbone
    state_source:
      - dispatch_plan_draft
      - gatekeeper_handoff
      - runtime_draft_bundle
      - host_submit_ack
    output_state: task_panel_state
    summary_cn: "Task Panel 只展示 dispatch、review、memory、asset、Gatekeeper 和下一授权点状态。"
```

## Mapping Rules

```yaml
mapping_rules:
  adapter_to_review_session:
    dispatch_plan_draft.task_id: review_session_draft.task_id
    dispatch_plan_draft.mode: review_session_draft.audit_log.mode
    dispatch_plan_draft.review_console_handoff.purpose_cn: review_session_draft.next_iteration.note_cn

  adapter_to_image_case:
    dispatch_plan_draft.task_id: image_case_draft.task_id
    dispatch_plan_draft.selected_plugin: image_case_draft.plugin_used
    dispatch_plan_draft.expected_outputs: image_case_draft.output_assets_count_expected
    rule_cn: "selected_plugin 必须保持 null，image_case 只能保留占位资产引用。"

  adapter_to_memory_delta:
    dispatch_plan_draft.audit_record.audit_summary_cn: memory_delta_draft.chinese_diary_content
    dispatch_plan_draft.task_id: memory_delta_draft.task_id
    rule_cn: "memory_delta 保持 draft，should_write_to_vcp=false，DailyNote 未调用。"

  gatekeeper_to_task_panel:
    gatekeeper_handoff.risk_summary_cn: task_panel_state.gatekeeper_status.risk_summary_cn
    gatekeeper_handoff.blocked_actions: task_panel_state.dispatch_status.forbidden_actions
    rule_cn: "Gatekeeper handoff 只展示风险，不授权执行。"

  host_ack_to_task_panel:
    host_submit_ack.validation_passed: task_panel_state.status
    host_submit_ack.side_effects_performed: task_panel_state.no_execution_guard.file_write_performed
    rule_cn: "host_submit_ack 只证明草案被 host mock/contract 接收，不代表外部副作用。"
```

## Roundtrip Guard

```yaml
roundtrip_guard:
  selected_plugin: null
  max_plugin_calls: 0
  execution_blocked: true
  external_api_allowed: false
  allow_file_write: false
  allow_image_binary: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_performed: false
  image_file_created: false
  side_effects_performed: false
  real_execution_allowed: false
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  real_manifest_read: false
```

## Boundary State

```yaml
boundary_state:
  fixture_file_added: true
  runtime_code_modified: false
  adapter_code_modified: false
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

v6.4 表示 Adapter dry-run handoff 到 Review Console runtime 的本地 roundtrip fixture 已经形成。它只证明占位 dry-run 数据可以沿 contract 映射到 runtime 草案和 Task Panel 状态，不代表真实插件、真实 VCPChat、真实 IPC/preload 或 DailyNote 执行已经存在。

默认下一步是 `v6.5 Memory Handoff Runtime Status`，继续在 no-write 边界内把 runtime 的记忆申请状态和 DailyNote 前置授权状态展示清楚。
