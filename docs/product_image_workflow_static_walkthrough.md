# Product Image Workflow Static Walkthrough

Status: A4 docs-only synthetic walkthrough.

This walkthrough uses a synthetic, non-branded product brief to test the current Agent Image Lab product image workflow. It does not generate images, contact providers, call plugins, enter runtime, save output, write DailyNote, or write VCP memory.

## Walkthrough Identity

```yaml
walkthrough:
  walkthrough_id: STATIC-WALKTHROUGH-20260512-001
  source_runbook: docs/product_image_workflow_runbook.md
  synthetic_brief_id: SYNBRIEF-20260512-001
  product: matte ceramic coffee mug
  scene: morning kitchen counter
  execution_status: docs_only
```

## 1. Product Brief Intake

```yaml
product_brief:
  product_goal: "Show a matte ceramic coffee mug as a calm everyday kitchen object."
  intended_use: catalog_review_planning
  product_identity: "unbranded matte ceramic coffee mug"
  target_audience: "home and lifestyle buyers"
  known_constraints:
    - "no visible brand logo"
    - "no readable text"
    - "no people or hands"
    - "no liquid splash or steam emphasis"
  missing_information:
    - "exact dimensions"
    - "final color variant"
```

```yaml
brief_intake_result:
  structured_brief_ready: true
  real_customer_data_present: false
  private_path_present: false
  generation_requested_now: false
```

## 2. Prompt Package Instance

```yaml
prompt_package_instance:
  instance_id: PPI-20260512-matte-ceramic-mug-001
  instance_version: v1
  instance_status: review_ready
  source_template: prompt_templates/product_image_prompt_package_instance_template.md
  executable_generation_request_created: false
```

```yaml
brief_intake:
  brief_id: SYNBRIEF-20260512-001
  brief_source: internal_synthetic_walkthrough
  product_goal: "Plan a calm catalog-ready product image for a matte ceramic coffee mug."
  intended_use: catalog_review_planning
  target_audience: home_and_lifestyle_buyers
  required_output_context: "future human review surface"
  known_constraints:
    - "synthetic placeholder only"
    - "no brand, logo, watermark, people, or readable text"
  missing_information:
    - "exact color can be finalized before A5"
```

```yaml
product_identity:
  product_name: "matte ceramic coffee mug"
  product_category: drinkware
  product_variant: neutral_warm_gray_placeholder
  brand_context_sanitized: none
  hero_features:
    - "smooth matte ceramic finish"
    - "simple curved handle"
    - "clean cylindrical body"
  product_detail:
    material:
      - ceramic
    texture:
      - smooth_matte
    finish:
      - non_glossy
    color_palette:
      - warm_gray
      - soft_white
      - pale_wood
    scale_cues:
      - "kitchen counter context only"
    packaging_or_accessory_notes:
      - none
```

```yaml
shot_intent:
  shot_type: lifestyle_catalog
  aspect_ratio: "4:5"
  framing: three_quarter
  angle: front_three_quarter
  depth_of_field: moderate
  crop_safety: "entire mug and handle visible with safe margins"
  output_count_request: "planning only; future A5 must set allowed_call_count"
```

```yaml
visual_direction:
  style_lock:
    style_name: calm_morning_kitchen_catalog
    mood: calm_clean_everyday
    realism_level: product_photo
    color_temperature: neutral_warm
    contrast_level: medium
    reference_policy: no_external_reference
  composition:
    product_anchor: "mug remains the main subject at center-left"
    supporting_scene: "simple morning kitchen counter with soft background shapes"
    negative_space: "clean space around mug for review readability"
  lighting:
    light_quality: soft_window_light
    shadow_behavior: "gentle contact shadow"
    highlight_control: "avoid glossy specular highlights"
  camera_language:
    lens_feel: natural_product_lens
    perspective: eye_level_slightly_above
    product_geometry_rule: "handle and rim must remain plausible"
```

## 3. Positive Prompt Draft

This draft is review text only, not a provider payload.

```yaml
positive_prompt_draft:
  subject_anchor: "A matte ceramic coffee mug on a clean morning kitchen counter."
  product_fidelity: "The mug has a simple cylindrical body, smooth matte surface, and a clear curved handle."
  material_texture_language: "Soft non-glossy ceramic texture with subtle edge definition."
  composition_language: "Three-quarter product view with safe crop margins and uncluttered negative space."
  lighting_language: "Soft natural window light with gentle contact shadows."
  camera_language: "Natural product photography perspective, moderate depth of field, plausible geometry."
  environment_language: "Minimal kitchen counter setting with pale wood and soft neutral tones."
  quality_bar: "Catalog-review quality, clean product readability, no accidental text."
```

## 4. Negative Constraints

```yaml
negative_constraints:
  forbidden_subjects:
    - "people"
    - "hands"
    - "faces"
    - "extra mugs competing with the hero product"
  forbidden_text_or_logo:
    - "no readable accidental text"
    - "no watermark"
    - "no brand logo"
    - "no certification mark"
  forbidden_style_drift:
    - "no cyberpunk"
    - "no luxury jewelry lighting"
    - "no overly dramatic steam or splash"
  forbidden_artifacts:
    - "no malformed handle"
    - "no broken rim"
    - "no duplicate handle"
    - "no warped cylindrical body"
  forbidden_brand_claims:
    - "no brand, health, safety, or legal claims"
  forbidden_background_elements:
    - "no visible private home photos"
    - "no readable packaging"
```

## 5. Acceptance Criteria

```yaml
acceptance_criteria:
  must_have:
    - "mug category is immediately recognizable"
    - "matte ceramic finish remains visible"
    - "handle and rim geometry are plausible"
    - "mug remains the primary subject"
    - "scene feels like a calm morning kitchen counter"
  must_not_have:
    - "readable text, watermark, or logo"
    - "people, faces, or hands"
    - "deformed handle or rim"
    - "extra hero products"
    - "provider payload or real generation instruction"
  reviewer_questions:
    - "Is the package narrow enough for one future generation authorization?"
    - "Are the highest-risk geometry failures blocked?"
    - "Would a reviewer know why to accept or reject the future image?"
```

## 6. Human Prompt Review

```yaml
human_prompt_review:
  source_checklist: prompt_templates/product_image_prompt_package_human_review_checklist.md
  package_complete: true
  placeholders_resolved_enough_for_walkthrough: true
  product_identity_clear: true
  shot_intent_clear: true
  visual_direction_clear: true
  positive_prompt_reviewable: true
  negative_constraints_reviewable: true
  acceptance_criteria_reviewable: true
  generation_not_authorized_by_review: true
  simulated_reviewer_decision: approved_for_A5_authorization
  actual_generation_allowed_now: false
```

The review decision is part of a synthetic walkthrough only. It does not approve a real generation run.

## 7. A5 Authorization Handoff Draft

```yaml
A5_generation_authorization_handoff:
  source_template: prompt_templates/product_image_prompt_package_a5_authorization_handoff.md
  handoff_id: PPA5H-20260512-matte-ceramic-mug-001
  handoff_status: ready_for_A5_draft
  source_prompt_package:
    prompt_package_instance_id: PPI-20260512-matte-ceramic-mug-001
    prompt_package_instance_version: v1
    human_review_status: approved_for_A5_authorization
  future_A5_authorization_draft_inputs:
    generation_plan_ref: "<required later>"
    generation_plan_version: "<required later>"
    prompt_package_ref: PPI-20260512-matte-ceramic-mug-001
    target_model_or_plugin: "<required later>"
    allowed_call_count: "<required later>"
    retry_limit: "<required later>"
    output_directory_ref: "<required later>"
    output_save_allowed: "<required later>"
    provider_contact_allowed: "<required later>"
    plugin_call_allowed: "<required later>"
    memory_write_allowed: false
    review_console_ref: "<required later>"
    approval_phrase: "<required later>"
    expires_at: "<required later>"
```

```yaml
A5_handoff_boundary:
  active_A5_authorization_created: false
  generation_allowed_now: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  runtime_execution_allowed_now: false
```

## 8. Future Generation Stop

```yaml
future_generation_step:
  allowed_now: false
  stop_reason: active_A5_authorization_package_missing
  generated_asset_ref: not_created
  output_saved: false
```

This is the correct stop point for v7.235.

## 9. Asset Status Branch

No asset exists in this walkthrough, so the active branch is `not_created`.

```yaml
asset_status_record:
  source_taxonomy: docs/review_console_asset_status_taxonomy.md
  asset_ref: not_created
  asset_status: not_created
  human_visual_review_possible: false
  rejection_reasons: []
  revision_request: "not applicable until future A5 generation exists"
```

Future branches remain documented but unexecuted:

```yaml
future_asset_status_routing:
  rejected: "record rejection reasons and possible failure lesson candidate"
  needs_revision: "return to prompt package revision planning"
  accepted_candidate: "hold for final human approval"
  accepted_final: "include in delivery summary and review memory suitability"
```

## 10. Memory Suitability Branch

```yaml
memory_suitability_decision:
  source_matrix: docs/memory_suitability_decision_matrix.md
  asset_status: not_created
  suitability_status: not_reviewable
  memory_candidate_record_created: false
  DailyNote_write_allowed_now: false
  VCP_memory_write_allowed_now: false
```

## 11. Delivery Review Package Draft

```yaml
delivery_review_surface_package:
  source_package_spec: docs/delivery_review_surface_package.md
  package_id: DRSP-20260512-matte-ceramic-mug-001
  package_version: v1
  package_status: draft
  product_brief_ref: SYNBRIEF-20260512-001
  prompt_package_ref: PPI-20260512-matte-ceramic-mug-001
  prompt_package_review_ref: synthetic_walkthrough_review
  A5_authorization_ref: "<required later>"
  generated_asset_refs: []
  asset_status_records:
    - asset_status: not_created
  human_review_records:
    - review_type: prompt_package_review
      review_status: approved_for_A5_authorization
      synthetic_only: true
  memory_suitability_records:
    - suitability_status: not_reviewable
```

## Walkthrough Closeout

```yaml
walkthrough_closeout:
  brief_intake_completed: true
  prompt_package_created: true
  prompt_package_review_status: approved_for_A5_authorization
  A5_handoff_created: true
  active_A5_authorization_present: false
  generated_assets_present: false
  asset_status_review_completed: false
  asset_status_branch_checked: not_created
  memory_suitability_completed: false
  memory_suitability_branch_checked: not_reviewable
  delivery_review_package_created: true
  generation_allowed_now: false
  memory_write_allowed_now: false
```

## Product Finding

The workflow is coherent enough to support a future A5 readiness review. The next useful task is not generation. It is a final docs-only readiness review that checks whether the package chain contains enough exact fields to draft a bounded A5 generation authorization package.
