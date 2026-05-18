# v7.227 Prompt Package Builder Taskbook Gate

## Executive Verdict

```yaml
phase: v7.227_prompt_package_builder_taskbook_gate
phase_type: A4_docs_only_product_taskbook
overall_status: pass
source_commit: dbc5043ec7de2b28d20e0d2dc22ed065cb8a6583
latest_completed_phase: v7.226_image_workflow_product_return_gate
recommended_unique_route_from_v7_226: prompt_package_builder
product_artifact:
  prompt_package_schema_created: true
  taskbook_created: true
  A5_generation_authorization_required_later: true
safety:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  memory_write: false
  runtime_execution: false
recommended_next: v7.228_product_image_prompt_package_template_instance_gate
```

## Purpose

The Product Image Prompt Package Builder converts a product shooting brief into a reviewable prompt package. It is the planning object between product intent and any future generation authorization.

It is the package desk, not the generation button.

The builder must:

- preserve the product brief as structured intent
- assemble positive prompt language
- assemble negative constraints
- define shot, style, material, lighting, camera, and review criteria
- hand off a bounded package to human review
- hand off only a package reference to future A5 generation authorization
- hand off only a memory suitability draft, never a memory write

## Product Chain Placement

```text
product brief
-> prompt package builder
-> prompt package human review
-> future generation authorization package
-> future generation
-> human visual review
-> asset status
-> memory suitability decision
-> delivery / review surface
```

This gate covers only the second step. It does not authorize generation, provider contact, runtime integration, image creation, DailyNote write, or VCP memory write.

## Prompt Package Schema

```yaml
product_image_prompt_package:
  package_id: "PP-{YYYYMMDD}-{slug}-{NNN}"
  package_version: "v1"
  package_status: draft | review_ready | approved_for_authorization | rejected | superseded
  product_brief_ref: string
  product_identity:
    product_name: string
    product_category: string
    intended_use: string
    audience_context: string
    brand_context_sanitized: string
  product_detail:
    hero_features: []
    material: []
    texture: []
    color_palette: []
    finish: []
    scale_cues: []
    packaging_or_accessory_notes: []
  positive_prompt:
    subject_anchor: string
    product_fidelity: string
    material_texture_language: string
    composition_language: string
    lighting_language: string
    camera_language: string
    environment_language: string
    quality_bar: string
  negative_constraints:
    forbidden_subjects: []
    forbidden_text_or_logo: []
    forbidden_style_drift: []
    forbidden_artifacts: []
    forbidden_people_or_faces: []
    forbidden_brand_claims: []
    forbidden_background_elements: []
  shot_spec:
    shot_type: string
    aspect_ratio: string
    framing: string
    angle: string
    depth_of_field: string
    crop_safety: string
    output_count_request: integer
  style_lock:
    style_name: string
    mood: string
    color_temperature: string
    contrast_level: string
    realism_level: string
    reference_policy: string
  acceptance_criteria:
    must_have: []
    must_not_have: []
    review_questions: []
    rejection_reasons: []
  handoff:
    human_review_ref: string
    A5_generation_authorization_ref: null
    memory_suitability_ref: string
  audit:
    created_by: string
    created_at: "ISO 8601 timestamp"
    reviewer: string
    approval_status: not_requested | requested | approved | denied
```

## Required Fields

```yaml
required_fields:
  - package_id
  - package_version
  - package_status
  - product_brief_ref
  - product_name
  - product_category
  - intended_use
  - hero_features
  - material
  - texture
  - positive_prompt.subject_anchor
  - positive_prompt.product_fidelity
  - positive_prompt.composition_language
  - positive_prompt.lighting_language
  - positive_prompt.camera_language
  - negative_constraints.forbidden_text_or_logo
  - negative_constraints.forbidden_artifacts
  - shot_spec.shot_type
  - shot_spec.aspect_ratio
  - shot_spec.framing
  - style_lock.style_name
  - style_lock.realism_level
  - acceptance_criteria.must_have
  - acceptance_criteria.must_not_have
  - handoff.human_review_ref
  - handoff.memory_suitability_ref
```

Required fields must be explicit. Empty placeholders do not make a package review-ready.

## Optional Fields

```yaml
optional_fields:
  - audience_context
  - brand_context_sanitized
  - scale_cues
  - packaging_or_accessory_notes
  - environment_language
  - forbidden_background_elements
  - depth_of_field
  - crop_safety
  - color_temperature
  - contrast_level
  - reference_policy
  - review_questions
  - rejection_reasons
  - reviewer
  - risk_notes
```

Optional fields may sharpen the package but cannot loosen hard constraints, allow provider contact, or authorize generation.

## Positive Prompt Sections

```yaml
positive_prompt_sections:
  subject_anchor: "What the image must primarily show"
  product_fidelity: "Which product traits must be preserved"
  material_texture_language: "Material, finish, weave, grain, gloss, translucency, or tactile surface"
  composition_language: "Placement, balance, foreground/background relationship, negative space"
  lighting_language: "Light direction, softness, shadow behavior, highlight control"
  camera_language: "Lens feel, angle, focal distance, depth, product photography vocabulary"
  environment_language: "Scene context that supports the product without stealing focus"
  quality_bar: "Minimum production standard for realism, cleanliness, and commercial usability"
```

Positive language should describe the target image directly. It should avoid provider-specific syntax unless a future A5 authorization package explicitly binds a provider or plugin.

## Negative Constraint Sections

```yaml
negative_constraint_sections:
  forbidden_subjects: "Objects, people, animals, scenes, or props that must not appear"
  forbidden_text_or_logo: "Readable text, logo-like marks, watermarks, labels, or brand claims unless explicitly allowed"
  forbidden_style_drift: "Aesthetic directions that would undermine the product brief"
  forbidden_artifacts: "Distortion, extra objects, malformed product parts, blur, watermark, duplicate product, broken geometry"
  forbidden_people_or_faces: "Human presence, faces, hands, or body parts unless the brief explicitly requires them"
  forbidden_brand_claims: "Unverified brand names, certification marks, medical claims, or legal claims"
  forbidden_background_elements: "Background clutter, irrelevant props, unsafe symbols, or distracting signage"
```

Negative constraints are review requirements. They are not a provider payload and must not include raw endpoint, raw private path, secret, or runtime log content.

## Shot Spec Fields

```yaml
shot_spec_fields:
  shot_type: hero | detail | lifestyle | packshot | comparison | texture_macro
  aspect_ratio: "1:1 | 4:5 | 3:2 | 16:9 | custom_review_only"
  framing: close_up | medium | full_product | flat_lay | three_quarter
  angle: front | three_quarter | side | top_down | low_angle
  depth_of_field: deep | moderate | shallow | macro
  crop_safety: "no clipped product edges unless intentional"
  output_count_request: "planning request only; future authorization must set actual allowed_call_count"
```

## Style Lock Fields

```yaml
style_lock_fields:
  style_name: string
  mood: string
  color_temperature: warm | neutral | cool | mixed
  contrast_level: low | medium | high
  realism_level: product_photo | editorial_photo | stylized_but_realistic
  reference_policy: no_external_reference | internal_reference_ref_only | human_supplied_reference_requires_review
```

The style lock is meant to prevent prompt drift. It cannot override product fidelity or negative constraints.

## Product Detail, Material, And Texture Fields

```yaml
product_detail_material_texture_fields:
  hero_features: "Product traits that must remain visible"
  material: "Primary material names and sanitized descriptors"
  texture: "Surface pattern, weave, grain, smoothness, translucency, or tactile features"
  color_palette: "Observed or requested product colors"
  finish: "matte, satin, glossy, metallic, ceramic, leather, textile, etc."
  scale_cues: "Safe props or context for size, if allowed"
  packaging_or_accessory_notes: "Packaging, label, strap, handle, closure, cap, or bundled accessory details"
```

## Composition, Lighting, And Camera Language Fields

```yaml
composition_lighting_camera_language_fields:
  composition_language:
    - product remains the visual anchor
    - no distracting background text
    - clear silhouette and readable material
  lighting_language:
    - soft controlled shadows
    - highlight behavior appropriate to material
    - no blown highlights on product edges
  camera_language:
    - realistic product photography vocabulary
    - angle and lens feel match shot_spec
    - product geometry remains plausible
```

## Acceptance Criteria

```yaml
acceptance_criteria:
  must_have:
    - subject matches product_brief_ref
    - hero features visible
    - material and texture recognizable
    - composition matches shot_spec
    - style lock respected
    - no watermark or raw text unless explicitly allowed
  must_not_have:
    - wrong product category
    - readable accidental text or logo-like marks
    - people/faces/hands unless authorized by brief
    - broken product geometry
    - duplicated or mutated product parts
    - provider/runtime artifacts
  review_questions:
    - "Would a human reviewer understand what product is being sold?"
    - "Does the prompt package prevent the known failure modes?"
    - "Is the package narrow enough for one future generation authorization?"
```

## Human Review Handoff

Human review receives the package as a structured artifact, not an image. The reviewer decides whether the package is:

```yaml
human_review_status:
  - draft
  - needs_revision
  - review_ready
  - approved_for_generation_authorization
  - rejected
```

The reviewer must check product fidelity, prohibited content, style lock clarity, output count request, and whether the package is narrow enough for a single future A5 authorization.

## A5 Generation Authorization Handoff

The prompt package does not authorize generation. A future A5 generation authorization package must independently name:

```yaml
A5_generation_authorization_handoff:
  prompt_package_id: required
  prompt_package_version: required
  selected_plugin_or_provider: required_later
  selected_model: required_later
  allowed_call_count: required_later
  retry_limit: required_later
  output_directory_ref: required_later
  output_save_policy: required_later
  human_approval_phrase: required_later
  review_console_ref: required_later
```

No provider contact, plugin call, runtime execution, or image generation may occur from this package alone.

## Memory Suitability Handoff

Memory suitability starts as a draft decision only:

```yaml
memory_suitability_handoff:
  default_status: draft
  memory_write_allowed: false
  daily_note_write_allowed: false
  requires_human_visual_review_first: true
  requires_asset_status_first: true
  possible_decisions:
    - do_not_write
    - draft_memory_delta_after_accepted_asset
    - needs_human_memory_review
```

The package may record future suitability criteria, but it cannot write DailyNote or VCP memory.

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_227:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  DailyNote_write: false
  VCP_memory_write: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  CDP_access: false
  bridge_methods: false
  MCP_calls: false
  production_candidate_002: false
  batch_005: false
  tag_release_deploy: false
```

## Recommended Next Phase

```yaml
recommended_next:
  phase: v7.228_product_image_prompt_package_template_instance_gate
  type: A4_docs_only_product_template_instance
  purpose: >
    Create the first non-executing product image prompt package instance template
    from this taskbook, proving that a product brief can become a review-ready
    package without provider contact, runtime, plugin call, image generation, or
    memory write.
  auto_execution_allowed: true
```

## Closeout Template

```yaml
closeout:
  phase: v7.227_prompt_package_builder_taskbook_gate
  commit_hash: null
  commit_message: "docs: add prompt package builder taskbook"
  branch: master
  source_commit: dbc5043ec7de2b28d20e0d2dc22ed065cb8a6583
  changed_files: 0
  push: not_performed
  product_artifact:
    prompt_package_schema_created: true
    taskbook_created: true
    A5_generation_authorization_required_later: true
  validation:
    git_status_checked: true
    git_diff_check: pass
    exact_diff_reviewed: true
    agent_board_state_validator: pass
  safety:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    image_generation: false
    memory_write: false
    runtime_execution: false
  final_state:
    next_phase_started: false
```
