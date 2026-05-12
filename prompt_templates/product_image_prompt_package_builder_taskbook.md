# Product Image Prompt Package Builder Taskbook

Status: A4 docs-only template. This taskbook creates prompt packages for review. It does not generate images, contact providers, call plugins, enter runtime, or write memory.

## Inputs

```yaml
input_product_brief:
  brief_id: string
  product_name: string
  product_category: string
  intended_use: string
  audience_context: string
  hero_features: []
  material: []
  texture: []
  color_palette: []
  style_direction: string
  forbidden_elements: []
  acceptance_notes: []
```

Do not include secrets, private filesystem paths, raw provider payloads, raw endpoints, customer-private details, or runtime logs.

## Builder Steps

1. Normalize the brief into product identity and product detail fields.
2. Choose one primary shot spec.
3. Write positive prompt sections from observable product requirements.
4. Write negative constraints from known failure modes and brief-specific risks.
5. Add style lock fields that narrow the visual target without weakening product fidelity.
6. Add acceptance criteria that a human reviewer can apply before any A5 request.
7. Prepare human review, A5 authorization, and memory suitability handoff fields.

## Output Schema

```yaml
product_image_prompt_package:
  package_id: "PP-{YYYYMMDD}-{slug}-{NNN}"
  package_version: "v1"
  package_status: draft
  product_brief_ref: "<brief_id>"
  product_identity:
    product_name: "<product_name>"
    product_category: "<product_category>"
    intended_use: "<intended_use>"
    audience_context: "<audience_context>"
    brand_context_sanitized: "<optional sanitized context>"
  product_detail:
    hero_features:
      - "<visible product feature>"
    material:
      - "<material>"
    texture:
      - "<texture>"
    color_palette:
      - "<color>"
    finish:
      - "<finish>"
    scale_cues:
      - "<safe scale cue or none>"
    packaging_or_accessory_notes:
      - "<packaging/accessory note or none>"
  positive_prompt:
    subject_anchor: "<primary subject phrase>"
    product_fidelity: "<traits that must remain accurate>"
    material_texture_language: "<material and surface language>"
    composition_language: "<layout and product placement>"
    lighting_language: "<light direction, softness, shadow, highlights>"
    camera_language: "<angle, framing, lens feel, depth>"
    environment_language: "<supporting scene without distraction>"
    quality_bar: "<commercial quality threshold>"
  negative_constraints:
    forbidden_subjects:
      - "<forbidden subject>"
    forbidden_text_or_logo:
      - "no readable accidental text"
      - "no watermark"
      - "no unapproved logo-like mark"
    forbidden_style_drift:
      - "<style to avoid>"
    forbidden_artifacts:
      - "no malformed product geometry"
      - "no duplicate product parts"
      - "no blur that hides material detail"
    forbidden_people_or_faces:
      - "no people, faces, hands, or body parts unless brief explicitly allows them"
    forbidden_brand_claims:
      - "no unverified brand, certification, legal, or medical claims"
    forbidden_background_elements:
      - "<background element to avoid>"
  shot_spec:
    shot_type: hero
    aspect_ratio: "1:1"
    framing: full_product
    angle: three_quarter
    depth_of_field: moderate
    crop_safety: "full product visible; no clipped edges"
    output_count_request: 1
  style_lock:
    style_name: "<style label>"
    mood: "<mood>"
    color_temperature: neutral
    contrast_level: medium
    realism_level: product_photo
    reference_policy: no_external_reference
  acceptance_criteria:
    must_have:
      - "product category matches brief"
      - "hero features are visible"
      - "material and texture are recognizable"
      - "shot spec is followed"
      - "style lock is respected"
    must_not_have:
      - "wrong product"
      - "people/faces/hands unless explicitly allowed"
      - "readable accidental text or logo-like marks"
      - "watermark"
      - "broken geometry or duplicate product parts"
    review_questions:
      - "Is the package narrow enough for one future generation authorization?"
      - "Are known failure modes blocked by explicit constraints?"
  handoff:
    human_review_ref: "<review_package_ref>"
    A5_generation_authorization_ref: null
    memory_suitability_ref: "<memory_suitability_draft_ref>"
  audit:
    created_by: "<agent_or_human>"
    created_at: "<ISO 8601 timestamp>"
    reviewer: "<reviewer_or_null>"
    approval_status: not_requested
```

## Required Review Checklist

```yaml
review_checklist:
  product_brief_preserved: false
  required_fields_complete: false
  positive_prompt_sections_complete: false
  negative_constraints_complete: false
  shot_spec_complete: false
  style_lock_complete: false
  acceptance_criteria_reviewable: false
  A5_authorization_not_inferred: true
  provider_contact_not_performed: true
  plugin_call_not_performed: true
  image_generation_not_performed: true
  memory_write_not_performed: true
```

## Handoff Rules

```yaml
human_review_handoff:
  reviewer_decides: draft | needs_revision | review_ready | approved_for_generation_authorization | rejected
  reviewer_must_check:
    - product fidelity
    - prohibited content
    - shot spec clarity
    - style lock clarity
    - whether one future authorization can cover the package

A5_generation_authorization_handoff:
  package_is_authorization: false
  future_authorization_must_name:
    - package_id
    - package_version
    - selected_plugin_or_provider
    - selected_model
    - allowed_call_count
    - retry_limit
    - output_directory_ref
    - output_save_policy
    - human_approval_phrase

memory_suitability_handoff:
  default_status: draft
  memory_write_allowed: false
  requires_human_visual_review_first: true
  requires_asset_status_first: true
```

## Closeout

```yaml
prompt_package_builder_closeout:
  prompt_package_schema_complete: true
  required_fields_complete: true
  optional_fields_reviewed: true
  human_review_handoff_ready: true
  A5_generation_authorization_required_later: true
  memory_suitability_draft_only: true
  provider_contact: false
  plugin_call: false
  image_generation: false
  memory_write: false
  runtime_execution: false
```
