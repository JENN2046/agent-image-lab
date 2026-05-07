# v10.5 A5 DoubaoGen No-text Retry Rejected Asset Contract

本文定义 v10.5 A5 DoubaoGen no-text retry rejected asset contract。它记录一次更强无文字约束下的 DoubaoGen 重试已经完成，但自动审片再次拒绝生成资产，因此后续记忆写入和交付候选归档仍被阻断。

```yaml
contract:
  name: v10_5_a5_doubaogen_no_text_retry_rejected_asset_record
  version: v10.5-a5-doubaogen-no-text-retry-rejected-asset-contract
  status: retry_generation_completed_asset_rejected_memory_blocked
  record: docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md
  validation_file: scripts/validate_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.js
  selected_plugin_id: DoubaoGen
  actual_plugin_calls: 1
  generated_asset_count: 1
  asset_status: rejected
  memory_write_blocked_by_asset_review: true
```

## Execution Guard

```yaml
execution_guard:
  max_plugin_calls_authorized: 1
  actual_plugin_calls: 1
  additional_plugin_calls_after_review: 0
  overwrite_existing_files_allowed: false
  output_directory_ref: runs/a5_complete_delivery_photo_studio_os_retry_no_text
  raw_plugin_output_saved: false
  raw_endpoint_saved: false
  raw_runtime_log_saved: false
  secret_value_saved: false
  image_binary_saved_to_git_or_memory: false
```

## Review Gate

```yaml
review_gate:
  automated_safety_review_performed: true
  asset_status: rejected
  readable_text_or_logo_detected: true
  brand_or_logo_risk_detected: true
  person_or_face_detected: true
  product_still_life_requirement_met: false
  candidate_accepted: false
  human_override_applied: false
  daily_note_write_performed: false
  vcp_memory_write_performed: false
```

## Next Gate

```yaml
next_gate:
  retry_requires_new_authorization: true
  alternate_plugin_requires_new_authorization: true
  human_override_requires_new_authorization: true
  submitDraft_called: false
  commit_tag_push_pr_release_requires_separate_authorization: true
  github_release_allowed: false
```
