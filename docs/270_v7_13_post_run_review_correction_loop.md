# v7.13 Post-Run Review & Correction Loop v1

## 目的

建立第一次真实生成后的复查与纠错机制。

## 规则

- 复查机制不等于自动重试
- 纠错建议不等于 A5 授权
- 第二次生成必须重新 A5
- rejected / needs_human_review 不得写 memory
- output_directory_deviation 必须记录
- model_mismatch 必须记录
- prompt_subject_mismatch 必须触发 prompt correction

## Schema

```yaml
post_run_review:
  run_id:
  source_output_dir:
  plugin_calls_observed:
  images_created:
  model_used:
  prompt_package_ref:
  asset_status:
  deviations:
    - output_directory_deviation
    - prompt_subject_mismatch
    - model_mismatch
    - commercial_usability_low
  correction_plan:
    next_prompt_package_ref:
    model_override:
    retry_allowed: false
    new_a5_required: true
    memory_write_allowed: false
    daily_note_write_allowed: false
```
