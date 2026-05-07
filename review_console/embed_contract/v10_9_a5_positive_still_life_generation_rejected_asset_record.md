# v10.9 A5 Positive Still-life Generation Rejected Asset Contract

本文定义 v10.9 A5 positive still-life generation rejected asset contract。它记录一次短批准模板驱动的 DoubaoGen 真实生成已经完成，但本地审片拒绝生成资产，因此后续记忆写入和交付候选归档仍被阻断。

```yaml
contract:
  name: v10_9_a5_positive_still_life_generation_rejected_asset_record
  version: v10.9-a5-positive-still-life-generation-rejected-asset-contract
  status: generation_completed_asset_rejected_memory_blocked
  record: docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md
  validation_file: scripts/validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js
  selected_plugin_id: DoubaoGen
  actual_plugin_calls: 1
  generated_asset_count: 1
  asset_status: rejected
  memory_write_blocked_by_asset_review: true
```

## Execution Guard

```yaml
execution_guard:
  short_approval_template_used: true
  prompt_id: a5_positive_still_life_prompt_v1
  prompt_auto_edited: false
  max_plugin_calls_authorized: 1
  actual_plugin_calls: 1
  additional_plugin_calls_after_review: 0
  overwrite_existing_files_allowed: false
  output_directory_ref: runs/a5_positive_still_life_prompt_v1
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
  readable_text_or_logo_detected: false
  brand_or_logo_risk_detected: false
  person_or_face_detected: true
  product_still_life_requirement_met: false
  prompt_subject_match: false
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
