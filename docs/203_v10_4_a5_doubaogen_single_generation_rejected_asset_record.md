# v10.4 A5 DoubaoGen Single Generation Rejected Asset Record

本文记录 Agent Image Lab v10.4 A5 DoubaoGen single generation rejected asset record。用户已在复核 v10.3 初始 `submitDraft` rejected probe 偏差后明确授权继续 A5 生产链路，本阶段只执行一次授权内的 DoubaoGen 真实生图，并在自动审片中判定资产不通过。

本阶段真实调用 DoubaoGen 一次，生成图片一张，输出只落在 ignored runtime output ref 下。由于图片包含明显可读文字和类似 logo/标记，违反“无文字、无 logo、无品牌标识”规则，本阶段将资产标记为 `rejected`，不写 DailyNote，不写 VCP memory，不追加插件调用，不执行 commit/tag/push/PR/release。

```yaml
status: completed_validated_v10_4_a5_doubaogen_single_generation_rejected_asset_record
version: v10.4
current_phase: "v10.4 A5 DoubaoGen single generation rejected asset record"
validation_file: scripts/validate_v10_4_a5_doubaogen_single_generation_rejected_asset_record.js
previous_phase: "v10.3 A5 bridge integration smoke record"
previous_record: docs/202_v10_3_a5_bridge_integration_smoke_record.md
default_next_phase: "BLOCKED for new generation retry authorization or human override; memory writes remain blocked because the asset was rejected"
```

## Authorization Applied

```yaml
authorization_applied:
  a5_production_continuation_authorized_after_human_review: true
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls_authorized: 1
  overwrite_existing_files_allowed: false
  output_directory_ref: runs/a5_complete_delivery_photo_studio_os
  gatekeeper_approved: true
  review_console_human_approved: true
  daily_note_write_allowed_by_authorization: true
  vcp_memory_write_allowed_by_authorization: true
  max_daily_note_writes: 1
  max_vcp_memory_writes: 1
  github_release_allowed: false
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
  output_directory_ref: runs/a5_complete_delivery_photo_studio_os
  generated_asset_ref: runs/a5_complete_delivery_photo_studio_os/image/doubaogen/fa3d1a57-efdc-4806-8153-03d986856dee.jpg
  generated_asset_sha256: 430b313954d1abb72ca32e9ab0778572b288772a1ed073e231822e4d3c544215
  generated_asset_bytes: 231316
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
  no_people_or_faces_observed: true
  no_private_data_observed: true
  readable_text_or_logo_detected: true
  brand_or_logo_risk_detected: true
  rejection_reason_cn: "画面包含明显可读文字和类似 logo/标记，不满足 A5 封面任务的无文字、无 logo、无品牌标识规则。"
  candidate_accepted: false
  human_override_applied: false
```

## Memory Write Decision

```yaml
memory_write_decision:
  memory_write_stage_reached: true
  memory_write_allowed_by_authorization: true
  memory_write_blocked_by_asset_review: true
  daily_note_write_performed: false
  vcp_memory_write_performed: false
  max_daily_note_writes_observed: 0
  max_vcp_memory_writes_observed: 0
  memory_delta_only: true
  memory_delta_request_generated_by_runner: true
  memory_delta_applied: false
  memory_delta_archive_ref: runs/a5_complete_delivery_photo_studio_os/memory_delta_request.sanitized.yaml
```

## Boundary Record

```yaml
boundary_record:
  bridge_methods_called_in_v10_4: 0
  submitDraft_called: false
  additional_plugin_calls_after_review: 0
  vcpchat_files_modified_in_v10_4: false
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

v10.4 表示：A5 真实链路已经完成一次受控 DoubaoGen 调用，插件调用次数、输出目录和脱敏记录符合授权边界；但生成资产未通过审片，因此不能作为交付候选资产，也不能触发 DailyNote 或 VCP memory 写入。

下一步需要二选一：要么重新授权一次新的生图重试并提供更强的无文字约束，要么人工明确 override 该被拒资产的使用边界。没有新的明确授权前，不得再次调用插件、写记忆、commit/tag/push/PR/release。
