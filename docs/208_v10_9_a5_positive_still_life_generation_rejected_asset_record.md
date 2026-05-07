# v10.9 A5 Positive Still-life Generation Rejected Asset Record

本文记录 Agent Image Lab v10.9 A5 positive still-life generation rejected asset record。用户用短批准模板授权一次 `a5_positive_still_life_prompt_v1` 的 DoubaoGen 真实生成；本阶段只执行一次授权内的真实生图，并在本地审片中判定资产不通过。

本阶段真实调用 DoubaoGen 一次，生成图片一张，输出只落在 ignored runtime output ref 下。由于图片生成了人物/脸和自然水景，没有生成锁定 prompt 要求的相机镜头、摄影棚桌面静物、空白色块卡或亚克力几何片，本阶段将资产标记为 `rejected`，不写 DailyNote，不写 VCP memory，不追加插件调用，不执行 commit/tag/push/PR/release。

```yaml
status: completed_validated_v10_9_a5_positive_still_life_generation_rejected_asset_record
version: v10.9
current_phase: "v10.9 A5 positive still-life generation rejected asset record"
validation_file: scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js
previous_phase: "v10.8 A5 positive still-life generation preflight gate"
previous_record: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md
default_next_phase: "BLOCKED for alternate generation strategy, alternate plugin, or human override; memory writes remain blocked because the asset was rejected"
```

## Authorization Applied

```yaml
authorization_applied:
  short_approval_template_used: true
  short_approval_phrase: "批准 v10.8 静物单次生成"
  private_plugin_dir_binding_used: true
  private_plugin_dir_raw_path_saved: false
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls_authorized: 1
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_source_record: docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md
  prompt_auto_edited: false
  overwrite_existing_files_allowed: false
  output_directory_ref: runs/a5_positive_still_life_prompt_v1
  gatekeeper_approved: true
  review_console_human_approved: true
  daily_note_direct_write_allowed: false
  vcp_memory_direct_write_allowed: false
  memory_delta_only: true
  rollback_plan_recorded: true
```

## Execution Result

```yaml
execution_result:
  real_generation_performed: true
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model_ref: doubao-seedream-5-0-260128
  actual_plugin_calls: 1
  api_called: true
  vcp_plugin_called: true
  image_file_created: true
  generated_asset_count: 1
  output_directory_ref: runs/a5_positive_still_life_prompt_v1
  generated_asset_ref: runs/a5_positive_still_life_prompt_v1/image/doubaogen/35bc0610-3f7c-4295-887b-8b2a2dcf8999.jpg
  generated_asset_sha256: 4a6aff4ff19127d8e817439ee585fa7eaf55874a1c6408abb3b76bde9e67092f
  generated_asset_bytes: 336179
  raw_plugin_output_saved: false
  raw_endpoint_saved: false
  raw_runtime_log_saved: false
  secret_value_saved: false
  image_binary_saved_to_git_or_memory: false
```

## Safety Review Result

```yaml
safety_review_result:
  automated_safety_review_performed: true
  asset_status: rejected
  no_people_or_faces_observed: false
  no_private_data_observed: true
  readable_text_or_logo_detected: false
  brand_or_logo_risk_detected: false
  person_or_face_detected: true
  product_still_life_requirement_met: false
  prompt_subject_match: false
  camera_lens_subject_present: false
  studio_tabletop_still_life_present: false
  rejection_reason_cn: "画面生成了人物/脸和自然水景，未生成相机镜头、摄影棚桌面静物、空白色块卡或亚克力几何片，严重偏离锁定 prompt；因此资产拒收。"
  candidate_accepted: false
  human_override_applied: false
```

## Memory Write Decision

```yaml
memory_write_decision:
  memory_write_stage_reached: true
  memory_write_allowed_by_authorization: false
  memory_write_blocked_by_asset_review: true
  daily_note_write_performed: false
  vcp_memory_write_performed: false
  max_daily_note_writes_observed: 0
  max_vcp_memory_writes_observed: 0
  memory_delta_only: true
  memory_delta_request_generated_by_runner: true
  memory_delta_applied: false
  memory_delta_archive_ref: runs/a5_positive_still_life_prompt_v1/memory_delta_request.sanitized.yaml
```

## Boundary Record

```yaml
boundary_record:
  bridge_methods_called_in_v10_9: 0
  submitDraft_called: false
  additional_plugin_calls_after_review: 0
  vcpchat_files_modified_in_v10_9: false
  vcptoolbox_files_modified: false
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
  commit_performed: false
  tag_performed: false
  push_performed: false
  pr_created: false
  github_release_created: false
  rollback_performed: false
  rejected_asset_retained_for_local_review_under_ignored_runs_ref: true
```

## Result Meaning

v10.9 表示：短批准模板已成功进入一次受控 DoubaoGen real generation，插件调用次数、输出目录和脱敏记录符合授权边界；但生成资产与锁定 prompt 严重不匹配，且包含人物/脸。因此该资产不能作为交付候选，也不能触发 DailyNote 或 VCP memory 写入。

下一步建议先切换策略：要么改用更可控的生成插件 / 编辑工作流，要么重新设计更硬约束的静物 prompt 并先做本地审查。没有新的明确授权前，不得再次调用插件、写记忆、commit/tag/push/PR/release。
