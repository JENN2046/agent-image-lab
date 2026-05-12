# Product Image Prompt Package Instance Template

Status: A4 docs-only fillable template.

This file is not a real generation task. It contains placeholders only. It does not authorize A5, provider contact, plugin calls, image generation, runtime execution, output saving, DailyNote write, or VCP memory write.

## Template Metadata

```yaml
prompt_package_instance:
  instance_id: "PPI-{YYYYMMDD}-{slug}-{NNN}"
  instance_version: "v1"
  instance_status: draft
  source_taskbook: prompt_templates/product_image_prompt_package_builder_taskbook.md
  source_gate: v7.228_product_image_prompt_package_template_instance_gate
  executable_generation_request_created: false
```

## Brief Intake

```yaml
brief_intake:
  brief_id: "<brief_id_placeholder>"
  brief_source: "<human_brief | product_sheet_summary | internal_request>"
  product_goal: "<what this product image should help communicate>"
  intended_use: "<catalog | campaign | review | exploration | other>"
  target_audience: "<audience placeholder>"
  required_output_context: "<where the future image would be reviewed or used>"
  known_constraints:
    - "<constraint placeholder>"
  missing_information:
    - "<missing information placeholder>"
```

## Product Identity

```yaml
product_identity:
  product_name: "<product name placeholder>"
  product_category: "<category placeholder>"
  product_variant: "<variant placeholder or none>"
  brand_context_sanitized: "<sanitized context placeholder or none>"
  hero_features:
    - "<visible feature placeholder>"
  product_detail:
    material:
      - "<material placeholder>"
    texture:
      - "<texture placeholder>"
    finish:
      - "<finish placeholder>"
    color_palette:
      - "<color placeholder>"
    scale_cues:
      - "<safe scale cue placeholder or none>"
    packaging_or_accessory_notes:
      - "<packaging/accessory placeholder or none>"
```

## Shot Intent

```yaml
shot_intent:
  shot_type: "<hero | detail | lifestyle | packshot | comparison | texture_macro>"
  aspect_ratio: "<1:1 | 4:5 | 3:2 | 16:9 | review_only_custom>"
  framing: "<full_product | close_up | medium | flat_lay | three_quarter>"
  angle: "<front | side | three_quarter | top_down | low_angle>"
  depth_of_field: "<deep | moderate | shallow | macro>"
  crop_safety: "<crop safety placeholder>"
  output_count_request: "<planning only; future A5 must set allowed_call_count>"
```

## Visual Direction

```yaml
visual_direction:
  style_lock:
    style_name: "<style label placeholder>"
    mood: "<mood placeholder>"
    realism_level: "<product_photo | editorial_photo | stylized_but_realistic>"
    color_temperature: "<warm | neutral | cool | mixed>"
    contrast_level: "<low | medium | high>"
    reference_policy: no_external_reference
  composition:
    product_anchor: "<how product remains primary>"
    supporting_scene: "<supporting scene placeholder>"
    negative_space: "<negative space placeholder>"
  lighting:
    light_quality: "<soft | crisp | diffused | directional>"
    shadow_behavior: "<shadow placeholder>"
    highlight_control: "<highlight placeholder>"
  camera_language:
    lens_feel: "<lens feel placeholder>"
    perspective: "<perspective placeholder>"
    product_geometry_rule: "product geometry must remain plausible"
```

## Positive Prompt Draft

```yaml
positive_prompt_draft:
  subject_anchor: "<primary subject sentence placeholder>"
  product_fidelity: "<accuracy sentence placeholder>"
  material_texture_language: "<material and texture sentence placeholder>"
  composition_language: "<composition sentence placeholder>"
  lighting_language: "<lighting sentence placeholder>"
  camera_language: "<camera sentence placeholder>"
  environment_language: "<environment sentence placeholder>"
  quality_bar: "<commercial quality threshold placeholder>"
```

This draft is not a model payload. A future A5 package must approve any provider-specific prompt transformation.

## Negative Constraints

```yaml
negative_constraints:
  forbidden_subjects:
    - "<forbidden subject placeholder>"
  forbidden_text_or_logo:
    - "no readable accidental text"
    - "no watermark"
    - "no unapproved logo-like mark"
  forbidden_style_drift:
    - "<style drift placeholder>"
  forbidden_artifacts:
    - "no malformed product geometry"
    - "no duplicate product parts"
    - "no blur that hides material detail"
  forbidden_people_or_faces:
    - "no people, faces, hands, or body parts unless brief explicitly allows them"
  forbidden_brand_claims:
    - "no unverified brand, certification, legal, or medical claims"
  forbidden_background_elements:
    - "<background blocker placeholder>"
```

## Acceptance Criteria

```yaml
acceptance_criteria:
  must_have:
    - "product identity matches the brief"
    - "hero features remain visible"
    - "material and texture remain recognizable"
    - "shot intent is followed"
    - "style lock is respected"
  must_not_have:
    - "wrong product category"
    - "readable accidental text or logo-like marks"
    - "watermark"
    - "people/faces/hands unless explicitly allowed"
    - "broken geometry or duplicate product parts"
  reviewer_questions:
    - "Is the package narrow enough for one future generation authorization?"
    - "Are known failure modes blocked by explicit constraints?"
    - "Would a reviewer know how to accept, reject, or request revision?"
```

## Human Review Checklist

```yaml
human_review_checklist:
  package_complete: false
  placeholders_resolved: false
  product_brief_preserved: false
  product_identity_clear: false
  shot_intent_clear: false
  visual_direction_clear: false
  positive_prompt_reviewable: false
  negative_constraints_reviewable: false
  acceptance_criteria_reviewable: false
  generation_not_authorized_by_template: true
  reviewer_decision: draft
  reviewer_notes: "<review notes placeholder>"
```

Allowed reviewer decisions:

```yaml
reviewer_decision_enum:
  - draft
  - needs_revision
  - review_ready
  - approved_for_A5_authorization
  - rejected
```

## A5 Generation Authorization Handoff

```yaml
A5_generation_authorization_handoff:
  package_is_authorization: false
  current_generation_allowed: false
  future_A5_required: true
  future_A5_must_name:
    - prompt_package_instance_id
    - prompt_package_instance_version
    - selected_plugin_or_provider
    - selected_model
    - allowed_call_count
    - retry_limit
    - output_directory_ref
    - output_save_policy
    - human_approval_phrase
    - review_console_ref
  future_A5_must_forbid:
    - hidden second call
    - silent retry
    - unreviewed output save
    - memory write without independent authorization
```

## Memory Suitability Decision

```yaml
memory_suitability_decision:
  default_status: draft
  memory_write_allowed_now: false
  daily_note_write_allowed_now: false
  requires_before_any_memory_write:
    - human_visual_review
    - asset_status_assignment
    - acceptance_or_rejection_reason
    - independent_memory_write_authorization
  possible_future_decisions:
    - do_not_write
    - draft_memory_delta_after_accepted_asset
    - needs_human_memory_review
```

## Instance Closeout

```yaml
prompt_package_instance_closeout:
  instance_template_used: true
  real_generation_task_created: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  output_saved: false
  memory_write: false
  human_review_ready: false
  A5_generation_authorization_required_later: true
```
