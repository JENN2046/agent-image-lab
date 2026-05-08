# Runtime Review Batch 10C Future A5 Authorization Package Consolidation

本文把未来 A5 Autonomous Production Execution 所需的所有 preflight 字段合并到一个结构化模板中。该模板覆盖 bridge、plugin、asset review、DailyNote/VCP memory、rollback、forbidden outputs 和 version actions 七个领域，保持所有真实路径为占位符。

本批只补文档，不修改真实 VCPChat / VCPToolBox，不调用 bridge / CDP / 插件 / API / DailyNote，不写 VCP memory，不创建图片，也不执行版本动作。

```yaml
runtime_review_batch_10c_future_a5_authorization_package_consolidation:
  status: completed_validated_a5_authorization_package_consolidation
  current_phase: "Runtime Review Batch 10C future A5 authorization package consolidation"
  previous_phase: "Runtime Review Batch 10A release-candidate acceptance matrix"
  doc: docs/231_runtime_review_batch_10c_future_a5_authorization_package_consolidation.md
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  bridge_or_cdp_call: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  version_action_performed: false
```

## Consolidated Authorization Package Template

```yaml
a5_authorization_package:
  # ── Metadata ──
  metadata:
    package_id: "a5-package-<YYYYMMDD-HHMM>-<batch-label>"
    activation_status: inactive_package
    activation_phrase: "<user-supplied activation phrase>"
    authorized_by: "<user identity>"
    authorized_at: "<ISO timestamp>"
    expires_after: "<ISO timestamp or null for single-batch>"
    mode: single_batch_a5_end_to_end

  # ── External Roots (placeholders only in template; real values never stored in Git) ──
  external_roots:
    real_vcpchat_root: required_external_value_not_recorded_in_git
    real_vcptoolbox_root: required_external_value_not_recorded_in_git
    real_plugin_dir_binding: required_external_value_not_recorded_in_git
    raw_real_paths_recorded_in_git: false

  # ── External Target Worktrees ──
  external_worktrees:
    vcpchat_worktree_clean: required
    vcptoolbox_worktree_clean: required
    binding_private_file_present: required_if_plugin_dir_needed
    auto_reconcile_allowed: false

  # ── Bridge ──
  bridge:
    bridge_methods_allowed:
      - cancel
      - loadSession
      - previewDraft
    bridge_methods_forbidden:
      - submitDraft
    max_bridge_calls_per_method: 1
    production_bridge_invocation: false
    cdp_access_allowed: false
    bridge_mode: "project_local_mock_or_real_with_explicit_authorization"
    source_fixture_policy: "project_local_fixtures_only"

  # ── Plugin ──
  plugin:
    selected_plugin_id: "<plugin-id e.g. DoubaoGen>"
    selected_plugin_command: "<command e.g. generate>"
    selected_plugin_model: "<model e.g. doubao-seedream-5-0-260128>"
    max_plugin_calls: 0
    max_image_outputs: 0
    output_directory_ref: "runs/<batch_label>"
    overwrite_existing_files_allowed: false
    prompt_id: "<locked prompt id>"
    prompt_hash_utf8: "<sha256 of UTF-8 no BOM prompt payload>"
    prompt_safety_scan_passed: true
    model_lock_verified: true
    runner_transport: "UTF-8 no BOM byte-write"
    provider_side_capture_allowed: false
    provider_side_capture_max_calls: 0

  # ── Asset Review ──
  asset_review:
    review_gate_required: true
    human_review_overrides_ai_review: true
    accepted_candidate_criteria:
      prompt_subject_match: true
      person_or_face_detected: false
      readable_text_or_logo_detected: false
      brand_or_device_marks: false
      image_size: "1024x1024"
    auto_reject_when:
      person_or_face_detected: true
      prompt_subject_mismatch: true
    needs_human_review_when:
      readable_text_or_logo_detected: true
      brand_or_device_marks: true
    archive_policy: "metadata_only_no_binary"
    binary_storage_allowed: false

  # ── DailyNote / VCP Memory ──
  memory:
    daily_note_write_allowed: false
    vcp_memory_write_allowed: false
    max_daily_note_writes: 0
    max_vcp_memory_writes: 0
    max_retry_attempts_per_write: 0
    write_content_must_be_chinese_desanitized_summary: true
    canonical_location_verification_required: true
    canonical_hash_match_required: true
    plugin_success_sufficient: false
    no_success_fabrication_rule: true
    wrong_location_label: "plugin_success_wrong_location"
    memory_delta_draft_reviewed: required
    human_approval_for_write: required

  # ── Rollback ──
  rollback:
    rollback_conditions:
      - preflight_failure
      - plugin_error
      - bridge_timeout
      - write_error
      - human_interrupt
      - guard_violation_detected
    rollback_actions:
      - "stop all pending operations"
      - "restore pre-package state"
      - "record failure with sanitized reason"
      - "do not retry automatically"
    state_restoration_required: true
    auto_retry_on_failure: false

  # ── Version Actions ──
  version_actions:
    git_commit_allowed: false
    git_tag_allowed: false
    git_push_allowed: false
    github_pr_allowed: false
    github_release_allowed: false
    working_branch: "<branch or null>"
    pr_target_branch: master
    tag_format: "v<major>.<minor>.<patch>-<label>"
    commit_message_template: "<type>: <description>"

  # ── Forbidden Outputs (any recording of these in Git blocks activation) ──
  forbidden_outputs:
    - raw_local_path
    - raw_endpoint
    - raw_websocket_url
    - raw_runtime_log
    - raw_ipc_payload
    - raw_plugin_output
    - raw_request_body
    - raw_response_body
    - raw_source_code
    - raw_prompt_text
    - secret
    - token
    - cookie
    - password
    - customer_private_data
    - image_binary_in_git_or_memory
    - plugin_dir_config_values
    - provider_observed_prompt_text

  # ── Execution Plan ──
  execution_plan:
    stages:
      - a5_preflight
      - external_worktree_verification
      - bridge_smoke
      - plugin_generation
      - asset_review_and_archive
      - memory_delta_draft_review
      - daily_note_and_vcp_memory_write
      - delivery_candidate_closeout
      - version_actions_if_authorized
    stop_before_next_stage: true
    each_stage_requires_pass: true

  # ── Preflight Checklist ──
  preflight_checklist:
    all_required_fields_filled: false
    no_missing_external_roots: false
    external_worktrees_clean: false
    bridge_smoke_passed: false
    plugin_model_verified: false
    prompt_safety_scan_passed: false
    runner_transport_verified: false
    forbidden_outputs_absent: false
    rollback_plan_present: false
    human_activation_confirmed: false
    all_checks_passed: false
```

## Field Dependency Map

某些字段只有在前序字段被允许时才生效：

```yaml
field_dependencies:
  - trigger: "bridge.bridge_methods_allowed is non-empty"
    then_required:
      - "bridge.max_bridge_calls_per_method"
      - "bridge.production_bridge_invocation"
  - trigger: "plugin.max_plugin_calls > 0"
    then_required:
      - "plugin.selected_plugin_id"
      - "plugin.selected_plugin_command"
      - "plugin.selected_plugin_model"
      - "plugin.prompt_id"
      - "plugin.prompt_hash_utf8"
      - "plugin.prompt_safety_scan_passed"
      - "plugin.output_directory_ref"
      - "asset_review.review_gate_required"
  - trigger: "memory.daily_note_write_allowed is true or memory.vcp_memory_write_allowed is true"
    then_required:
      - "memory.max_daily_note_writes"
      - "memory.max_vcp_memory_writes"
      - "memory.canonical_location_verification_required"
      - "memory.canonical_hash_match_required"
      - "memory.memory_delta_draft_reviewed"
      - "memory.human_approval_for_write"
  - trigger: "version_actions.git_commit_allowed is true"
    then_required:
      - "version_actions.commit_message_template"
      - "version_actions.working_branch"
  - trigger: "version_actions.git_push_allowed is true"
    then_required:
      - "version_actions.git_commit_allowed"
  - trigger: "version_actions.github_pr_allowed is true"
    then_required:
      - "version_actions.pr_target_branch"
  - trigger: "version_actions.github_release_allowed is true"
    then_required:
      - "version_actions.git_tag_allowed"
      - "version_actions.tag_format"
```

## Activation Flow

```text
Inactive template → user fills required fields → user supplies activation phrase
→ preflight checklist runs → all checks pass → package becomes active
→ execution proceeds stage by stage within limits → package consumed after batch
```

该模板本身不是自动执行触发器。只有在用户填完所有必填字段、preflight 通过、并用显式激活短语授予后，它才驱动条件自动执行——且只在授权上限内。

## Historical Alignment

该模板整合了以下现有本地草案，保证与已交付的 runtime prototype 和 validator suite 一致：

```yaml
historical_alignment:
  - source: "real_bridge_authorization_package_draft (Batch 4B)"
    mapped_to: "bridge section"
  - source: "plugin_reliability_prompt_discipline_draft (Batch 5A)"
    mapped_to: "plugin section (prompt safety, model lock, runner transport)"
  - source: "single_real_generation_retry_gate_draft (Batch 5B)"
    mapped_to: "plugin section (max_plugin_calls, max_image_outputs)"
  - source: "memory_write_completion_candidate_draft (Batch 6A)"
    mapped_to: "memory section (completion checks)"
  - source: "real_memory_write_authorization_package_draft (Batch 6B)"
    mapped_to: "memory section (write limits, content rules)"
  - source: "asset_archive_candidate_draft (Batch 7A)"
    mapped_to: "asset_review section (archive policy)"
  - source: "inactive_authorization_capsules_draft (Batch 3A)"
    mapped_to: "metadata section (activation_status, activation_phrase)"
  - source: "v10.0 A5 activation package"
    mapped_to: "full template shape (external roots, bridge, plugin, memory, version actions)"
  - source: "v10.12 provider-side fingerprint capture package"
    mapped_to: "plugin section (provider_side_capture)"
```

## Missing-Field Block Rules

```yaml
missing_field_rules:
  - rule: "Any required field in preflight_checklist that is false blocks activation"
  - rule: "Any external_root that is still a placeholder blocks A5 execution"
  - rule: "Any forbidden_output found in the filled package blocks activation"
  - rule: "plugin.max_plugin_calls=0 means no generation, even if other plugin fields are filled"
  - rule: "memory.max_daily_note_writes=0 and memory.max_vcp_memory_writes=0 means no write, even if other memory fields are filled"
  - rule: "version_actions with all false means no version action"
  - rule: "A filled template with activation_status=inactive_package is still inactive"
```

## Acceptance Criteria

```yaml
acceptance:
  all_seven_domains_covered: true
  bridge_section_present: true
  plugin_section_present: true
  asset_review_section_present: true
  memory_section_present: true
  rollback_section_present: true
  forbidden_outputs_section_present: true
  version_actions_section_present: true
  field_dependency_map_present: true
  activation_flow_documented: true
  historical_alignment_documented: true
  missing_field_rules_documented: true
  preflight_checklist_present: true
  all_real_roots_are_placeholders: true
  template_is_not_auto_trigger: true
  no_version_action: true
```

## Validation

```powershell
node --check scripts\validate_local_commit_scope.js
node scripts\validate_local_commit_scope.js
git diff --check
```

人工验收时还应确认:
- 模板七个领域完整无缺
- 所有真实路径保持为 `required_external_value_not_recorded_in_git`
- 每个 dependency trigger 的 then_required 字段逻辑正确
- forbidden_outputs 列表覆盖所有历史记录中的禁止项
- 模板可以填入具体值变成 concrete active package，空白模板不能驱动任何执行
