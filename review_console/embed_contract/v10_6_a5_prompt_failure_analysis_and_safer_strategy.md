# v10.6 A5 Prompt Failure Analysis And Safer Strategy Contract

本文定义 v10.6 A5 prompt failure analysis and safer strategy contract。它将 v10.4 / v10.5 的 DoubaoGen prompt 失败归档为可审查记录，并规定下一次真实调用前必须先人工确认候选 prompt。

```yaml
contract:
  name: v10_6_a5_prompt_failure_analysis_and_safer_strategy
  version: v10.6-a5-prompt-failure-analysis-contract
  status: prompt_failure_analyzed_real_generation_blocked
  record: docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md
  validation_file: scripts/validate_v10_6_a5_prompt_failure_analysis_and_safer_strategy.js
  failed_attempts_reviewed:
    - v10.4
    - v10.5
  next_prompt_must_be_shown_to_user_before_execution: true
```

## Strategy Guard

```yaml
strategy_guard:
  direct_doubaogen_cover_retry_recommended: false
  next_real_generation_allowed_by_this_record: false
  next_real_generation_requires_new_authorization: true
  prompt_preview_required_before_real_call: true
  memory_write_allowed_before_accepted_asset: false
  commit_tag_push_pr_release_allowed_by_this_record: false
```

## Candidate Prompt Status

```yaml
candidate_prompt_status:
  candidate_prompt_exists: true
  execution_authorized: false
  uses_photo_studio_os_name: false
  uses_software_or_ui_terms: false
  uses_cover_or_brand_terms: false
  positive_subjects_only: true
```
