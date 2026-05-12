# Product Image Prompt Package Human Review Checklist

Status: A4 docs-only review template.

This checklist reviews prompt package instances before any future A5 authorization package is drafted. It does not authorize generation, provider contact, plugin calls, runtime execution, output saving, DailyNote write, or VCP memory write.

## Review Target

```yaml
review_target:
  prompt_package_instance_id: "<PPI placeholder>"
  prompt_package_instance_version: "<version placeholder>"
  source_template: prompt_templates/product_image_prompt_package_instance_template.md
  review_stage: pre_A5
  generated_image_present: false
  provider_payload_present: false
  plugin_request_present: false
```

## Status Decision

```yaml
review_status:
  selected: draft
  allowed_values:
    - draft
    - needs_revision
    - review_ready
    - approved_for_A5_authorization
    - rejected
    - superseded
  generation_allowed_now: false
```

## Checklist

```yaml
checklist:
  package_metadata:
    instance_id_present: false
    instance_version_present: false
    source_template_present: false
    status_valid: false
  brief_intake:
    product_goal_clear: false
    intended_use_clear: false
    target_audience_clear: false
    constraints_captured: false
    missing_information_empty_or_explained: false
  product_identity:
    product_name_clear: false
    category_clear: false
    hero_features_clear: false
    material_texture_finish_clear: false
    color_palette_clear: false
  shot_intent:
    shot_type_selected: false
    aspect_ratio_selected: false
    framing_selected: false
    angle_selected: false
    crop_safety_clear: false
    output_count_is_planning_only: true
  visual_direction:
    style_lock_clear: false
    composition_clear: false
    lighting_clear: false
    camera_language_clear: false
    reference_policy_safe: false
  positive_prompt_draft:
    subject_anchor_reviewable: false
    product_fidelity_reviewable: false
    material_texture_reviewable: false
    composition_reviewable: false
    lighting_reviewable: false
    camera_reviewable: false
    environment_reviewable: false
    quality_bar_reviewable: false
    not_provider_payload: true
  negative_constraints:
    text_logo_watermark_blockers_present: false
    artifact_blockers_present: false
    people_faces_policy_present: false
    style_drift_blockers_present: false
    background_blockers_present: false
  acceptance_criteria:
    must_have_reviewable: false
    must_not_have_reviewable: false
    reviewer_questions_reviewable: false
```

## Boundary Checks

```yaml
boundary_checks:
  A5_not_authorized_by_review: true
  provider_not_contacted: true
  plugin_not_called: true
  image_not_generated: true
  output_not_saved: true
  runtime_not_entered: true
  memory_not_written: true
  DailyNote_not_written: true
  no_secret_or_env_value: true
  no_private_path: true
  no_raw_endpoint: true
  no_raw_payload: true
```

## Rejection Reasons

```yaml
rejection_reason_options:
  - incomplete_brief
  - ambiguous_product_identity
  - unsafe_or_unreviewable_prompt
  - weak_negative_constraints
  - overbroad_generation_scope
  - unauthorized_execution_language
  - memory_boundary_violation
  - superseded_by_newer_instance
```

## Reviewer Closeout

```yaml
reviewer_closeout:
  reviewer: "<human reviewer placeholder>"
  reviewed_at: "<ISO 8601 timestamp placeholder>"
  review_status: draft
  blocking_reasons: []
  required_revisions: []
  approved_for_A5_authorization_package_drafting: false
  generation_allowed_now: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  memory_write_allowed_now: false
```

## Pass Criteria

```yaml
pass_criteria_for_approved_for_A5_authorization:
  package_metadata_complete: true
  brief_intake_complete: true
  product_identity_complete: true
  shot_intent_complete: true
  visual_direction_complete: true
  positive_prompt_draft_reviewable: true
  negative_constraints_reviewable: true
  acceptance_criteria_reviewable: true
  boundary_checks_all_true: true
```
