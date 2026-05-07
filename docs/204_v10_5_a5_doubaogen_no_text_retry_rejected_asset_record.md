# v10.5 A5 DoubaoGen No-text Retry Rejected Asset Record

本文记录 Agent Image Lab v10.5 A5 DoubaoGen no-text retry rejected asset record。用户明确授权一次更强无文字约束的 DoubaoGen 重试，本阶段只执行一次授权内的真实生图，并在自动审片中再次判定资产不通过。

本阶段真实调用 DoubaoGen 一次，生成图片一张，输出只落在 ignored runtime output ref 下。由于图片包含明显可读标题、界面文字、logo / 品牌标识、人物脸部和设备品牌标记，违反“纯产品静物、无文字、无 logo、无品牌、无人物”的重试规则，本阶段将资产标记为 `rejected`，不写 DailyNote，不写 VCP memory，不追加插件调用，不执行 commit/tag/push/PR/release。

```yaml
status: completed_validated_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record
version: v10.5
current_phase: "v10.5 A5 DoubaoGen no-text retry rejected asset record"
validation_file: scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js
previous_phase: "v10.4 A5 DoubaoGen single generation rejected asset record"
previous_record: docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md
default_next_phase: "BLOCKED for alternate generation strategy, alternate plugin, or human override; memory writes remain blocked because the asset was rejected"
```

## Authorization Applied

```yaml
authorization_applied:
  a5_retry_authorization_present: true
  retry_phase: v10.5_a5_doubaogen_no_text_retry
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls_authorized: 1
  overwrite_existing_files_allowed: false
  output_directory_ref: runs/a5_complete_delivery_photo_studio_os_retry_no_text
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
  output_directory_ref: runs/a5_complete_delivery_photo_studio_os_retry_no_text
  generated_asset_ref: runs/a5_complete_delivery_photo_studio_os_retry_no_text/image/doubaogen/08877789-45f1-41fa-b377-1efc580988fd.jpg
  generated_asset_sha256: 06498714e91a17ccd28981e43a1d96b6ccf9b3803f3766c5694e09376c6d892c
  generated_asset_bytes: 263341
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
  readable_text_or_logo_detected: true
  brand_or_logo_risk_detected: true
  person_or_face_detected: true
  product_still_life_requirement_met: false
  rejection_reason_cn: "画面包含明显可读标题、界面文字、logo / 品牌标识、人物脸部和设备品牌标记，不满足 A5 重试的纯产品静物、无文字、无 logo、无人物规则。"
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
  memory_delta_archive_ref: runs/a5_complete_delivery_photo_studio_os_retry_no_text/memory_delta_request.sanitized.yaml
```

## Boundary Record

```yaml
boundary_record:
  bridge_methods_called_in_v10_5: 0
  submitDraft_called: false
  additional_plugin_calls_after_review: 0
  vcpchat_files_modified_in_v10_5: false
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

v10.5 表示：A5 重试链路已经完成一次受控 DoubaoGen no-text retry 调用，插件调用次数、输出目录和脱敏记录符合授权边界；但生成资产再次未通过审片，且问题扩展到人物/品牌/文字同时出现。因此该资产不能作为交付候选，也不能触发 DailyNote 或 VCP memory 写入。

下一步建议切换策略：要么改用更可控的生成插件 / 编辑工作流，要么先做一个无文字构图草案 dry-run，再单独授权真实生成。没有新的明确授权前，不得再次调用插件、写记忆、commit/tag/push/PR/release。
