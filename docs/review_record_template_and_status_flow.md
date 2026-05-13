# Review Record Template And Status Flow

Status: A4 docs-only review record specification.

中文说明：这是审片记录模板与状态流，不是运行时代码，不生成图片，不写记忆。

Current upstream status marker:

```text
current_status: failed_no_image_repeated_quota_or_rate_limit
recommended_next: v7.251_static_review_surface_acceptance_checklist_gate
```

## Review Record Schema

```yaml
review_record:
  review_record_id: "RR-{YYYYMMDD}-{NNN}"
  review_record_version: "v1"
  review_record_status: draft
  review_surface_ref: "<RS placeholder>"
  prompt_package_ref: "<PPI placeholder>"
  generation_plan_ref: "<future GP ref or none>"
  A5_authorization_ref: "<future authorization ref or none>"
  asset_ref: "<future sanitized asset ref or not_created>"
  asset_status: not_created
  human_decision: deferred
  human_score: not_reviewed
  reviewer: "<reviewer placeholder>"
  reviewed_at: "<ISO 8601 timestamp placeholder>"
```

## Status Values

```yaml
asset_status_values:
  not_created:
    zh: 尚未生成
    meaning: No asset exists.
  generated_pending_review:
    zh: 已生成待审
    meaning: Future generated asset awaits human review.
  accepted_candidate:
    zh: 可接受候选
    meaning: Looks usable but still needs final delivery or approval handling.
  rejected:
    zh: 拒绝
    meaning: Not suitable for use.
  needs_revision:
    zh: 需要修订
    meaning: Return to prompt package revision planning.
  deferred:
    zh: 暂缓
    meaning: Human reviewer cannot decide yet.
  accepted_final:
    zh: 最终接受
    meaning: Approved for delivery closeout after future authorized asset exists.
```

## Status Flow

```yaml
status_flow:
  not_created:
    allowed_next:
      - generated_pending_review
      - deferred
  generated_pending_review:
    allowed_next:
      - accepted_candidate
      - rejected
      - needs_revision
      - deferred
  accepted_candidate:
    allowed_next:
      - accepted_final
      - needs_revision
      - deferred
  rejected:
    allowed_next:
      - needs_revision
      - deferred
  needs_revision:
    allowed_next:
      - not_created
      - deferred
  deferred:
    allowed_next:
      - generated_pending_review
      - accepted_candidate
      - rejected
      - needs_revision
```

## Rejection Reasons

```yaml
rejection_reasons:
  required_when_status_rejected: true
  options:
    - wrong_product_identity
    - missing_hero_feature
    - broken_geometry
    - text_logo_watermark
    - poor_material_fidelity
    - composition_mismatch
    - lighting_failure
    - background_distraction
    - style_drift
    - unsafe_or_private_content
```

## Revision Request

```yaml
revision_request:
  required_when_status_needs_revision: true
  fields:
    revision_summary: "<what must change>"
    affected_prompt_sections:
      - brief_intake
      - product_identity
      - shot_intent
      - visual_direction
      - positive_prompt_draft
      - negative_constraints
      - acceptance_criteria
    reviewer_notes: "<human notes>"
    new_generation_allowed_now: false
```

## Accepted Candidate Conditions

```yaml
accepted_candidate_conditions:
  required:
    - product_identity_matches_brief
    - hero_features_visible
    - material_texture_plausible
    - shot_intent_followed
    - style_lock_respected
    - no_watermark
    - no_unapproved_text_or_logo
    - no_people_faces_hands_unless_allowed
    - no_broken_geometry
  does_not_mean:
    - final_delivery
    - memory_write
    - provider_success
    - automatic_acceptance
```

## Memory Suitability Routing

```yaml
memory_suitability_routing:
  yes:
    zh: 适合未来记忆草稿
    route: prepare sanitized memory candidate only after separate authorization
    DailyNote_write_now: false
    VCP_memory_write_now: false
  no:
    zh: 不适合写入记忆
    route: do not prepare memory candidate
    DailyNote_write_now: false
    VCP_memory_write_now: false
  deferred:
    zh: 暂缓判断
    route: hold for later human review
    DailyNote_write_now: false
    VCP_memory_write_now: false
```

## Boundary

```yaml
boundary:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  renderer_code_created: false
  preload_code_created: false
  IPC_handler_created: false
  output_save: false
  DailyNote_write: false
  VCP_memory_write: false
  real_manifest_read: false
  env_or_secret_read: false
```
