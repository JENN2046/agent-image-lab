# v7.2 Generation Failure Taxonomy + Retry Policy

## 目的

定义真实生成失败分类和重试策略。

## 失败分类

```text
- plugin_call_failed
- api_timeout
- image_created_but_rejected
- prompt_mismatch
- unsafe_output
- person_face_detected
- readable_text_or_logo_detected
- wrong_style_direction
- memory_write_blocked
- asset_archive_blocked
- unknown_failure
```

## Retry Policy

```yaml
retry_allowed_by_default: false
automatic_retry_allowed: false
max_retry_without_new_authorization: 0
manual_retry_requires_new_authorization: true
prompt_revision_required_before_retry: true
asset_review_required_before_retry: true
```
