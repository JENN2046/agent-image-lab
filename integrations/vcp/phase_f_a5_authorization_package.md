# Phase F A5 Authorization Package

本文件是从 `docs/231` consolidation template 填入具体值后的 Phase F A5 激活授权包。
激活短语：**`批准 Phase F 2次人像生图`**

```yaml
a5_authorization_package:
  # ── Metadata ──
  metadata:
    package_id: "a5-package-20260508-phase-f-portrait"
    activation_status: inactive_package
    activation_phrase: "批准 Phase F 2次人像生图"
    authorized_by: "user"
    authorized_at: null
    expires_after: null
    mode: single_batch_a5_end_to_end

  # ── External Roots (placeholders only; real values never in Git) ──
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

  # ── Bridge (沿用 v10.3 allowlist) ──
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

  # ── Plugin (DoubaoGen 人像, 2次) ──
  plugin:
    selected_plugin_id: "DoubaoGen"
    selected_plugin_command: "generate"
    selected_plugin_model: "doubao-seedream-5-0-260128"
    max_plugin_calls: 2
    max_image_outputs: 2
    output_directory_ref: "runs/phase_f_f4_portrait_generation"
    overwrite_existing_files_allowed: false
    prompt_id: "a5_portrait_prompt_v1"
    prompt_hash_utf8: null
    prompt_safety_scan_passed: false
    model_lock_verified: true
    runner_transport: "UTF-8 no BOM byte-write"
    provider_side_capture_allowed: false
    provider_side_capture_max_calls: 0

  # ── Asset Review (人像专用：允许人脸，禁止文字/logo) ──
  asset_review:
    review_gate_required: true
    human_review_overrides_ai_review: true
    accepted_candidate_criteria:
      prompt_subject_match: true
      person_or_face_detected: true
      readable_text_or_logo_detected: false
      brand_or_device_marks: false
      image_size: "1024x1024"
    auto_reject_when:
      readable_text_or_logo_detected: true
      prompt_subject_mismatch: true
      face_distorted_or_unrealistic: true
    needs_human_review_when:
      brand_or_device_marks: true
      face_partially_obscured: true
    archive_policy: "metadata_only_no_binary"
    binary_storage_allowed: false

  # ── DailyNote / VCP Memory (照旧：暂不写入) ──
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

  # ── Version Actions (本地 commit/tag 可自动，push 待授权) ──
  version_actions:
    git_commit_allowed: true
    git_tag_allowed: true
    git_push_allowed: false
    github_pr_allowed: false
    github_release_allowed: false
    working_branch: "master"
    pr_target_branch: "master"
    tag_format: "v5.24-phase-f-portrait-generation"
    commit_message_template: "feat: Phase F portrait generation record"

  # ── Forbidden Outputs ──
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
      - f1_preflight_pass
      - f2_bridge_smoke
      - f3_adapter_dry_run_handoff
      - f4_portrait_generation_run_1
      - f4_portrait_generation_run_2
      - f5_asset_review
      - f6_memory_draft_if_accepted
      - f8_closeout
    skip_stages:
      - f7_memory_write
    reason_f7_skipped: "memory.daily_note_write_allowed=false, memory.vcp_memory_write_allowed=false"
    stop_before_next_stage: true
    each_stage_requires_pass: true

  # ── Preflight Checklist ──
  preflight_checklist:
    all_required_fields_filled: true
    no_missing_external_roots: false
    external_worktrees_clean: required
    bridge_smoke_passed: false
    plugin_model_verified: true
    prompt_created_and_scanned: false
    runner_transport_verified: true
    forbidden_outputs_absent: true
    rollback_plan_present: true
    human_activation_confirmed: false
    all_checks_passed: false

  # ── Boundary ──
  this_record_boundary:
    activation_status: inactive_package
    execution_authorized_by_this_record: false
    real_vcpchat_read: false
    real_vcptoolbox_read: false
    bridge_calls_observed: 0
    plugin_calls_observed: 0
    image_created: false
    daily_note_called: false
    vcp_memory_written: false
    commit_performed: false
    tag_performed: false
    push_performed: false
```

## 与 v10.19 (静物) 的差异

| 项目 | v10.19 静物 | Phase F 人像 |
| --- | --- | --- |
| 主题 | 静物 still-life | 人像 portrait |
| person/face | auto-reject | **expected & required** |
| 次数 | 2 | 2 |
| prompt | a5_positive_still_life_prompt_v1 | a5_portrait_prompt_v1 (待创建) |
| memory write | 后续 v10.25 单独授权 | 本包不授权 (false) |

## 激活前仍缺失

- [ ] **人像 prompt 未创建** — 需要写一个中文人像 prompt 并通过安全扫描
- [ ] **外部工作树未确认** — VCPChat/VCPToolBox worktrees 需确认干净
- [ ] **用户未激活** — 需说出 `批准 Phase F 2次人像生图` 激活
