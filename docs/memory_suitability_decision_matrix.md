# Memory Suitability Decision Matrix

Status: A4 docs-only memory suitability planning.

This matrix decides whether future reviewed assets are worth preparing for a separate memory authorization. It never writes DailyNote or VCP memory.

## Inputs

```yaml
inputs:
  asset_status_ref: "<future review status ref>"
  prompt_package_ref: "<prompt package ref>"
  human_review_status: "<future review status>"
  human_score: "<placeholder>"
  rejection_reasons: []
  acceptance_notes: "<placeholder>"
```

## Suitability Status Values

```yaml
suitability_status:
  - not_reviewable
  - do_not_write
  - draft_failure_lesson
  - draft_success_case
  - needs_human_memory_review
  - eligible_for_future_memory_authorization
```

## Matrix

```yaml
matrix:
  not_created: not_reviewable
  generated_pending_review: not_reviewable
  needs_revision: do_not_write
  rejected: draft_failure_lesson
  accepted_candidate: needs_human_memory_review
  accepted_final: draft_success_case
  archived_reference_only: needs_human_memory_review
  superseded: do_not_write
```

## Candidate Record

```yaml
memory_candidate_record:
  candidate_id: "<MEMCAND placeholder>"
  candidate_status: draft
  lesson_type: "<success_case | failure_lesson | style_preference | constraint_update | do_not_write>"
  sanitized_summary: "<placeholder>"
  reusable_learning: "<placeholder>"
  sensitive_content_present: false
  raw_prompt_included: false
  raw_payload_included: false
  raw_endpoint_included: false
  private_path_included: false
  DailyNote_write_allowed_now: false
  VCP_memory_write_allowed_now: false
```

## Boundary

```yaml
boundary:
  memory_write_allowed_now: false
  DailyNote_write_allowed_now: false
  future_authorization_required_for_write: true
  no_secret_or_env_value: true
  no_private_path: true
  no_raw_provider_payload: true
```
