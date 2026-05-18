# v8.012 Second Product Candidate And Brief Gate

```yaml
base_contract: AGENTS.md
phase: v8_012_second_product_candidate_and_brief_gate
mode: A4.8
intent: local_implementation
risk_level: R1
```

## Purpose

Select the second product for Route B multi-product prompt package expansion and create a reviewable product brief.

This is product planning only. It does not create a generation request, contact a provider, call a plugin, read secrets, write memory, or promote any asset.

## Selected Product

```yaml
selected_product: multi_color_mesh_sports_visor
selected_product_display: multi-color breathable mesh sports visor / open-top sun visor
selected_product_zh: 多色透气网眼运动空顶帽
product_category: sports_headwear
brief_ref: briefs/product_brief_multi_color_mesh_sports_visor_v1.md
```

## Selection Rationale

```yaml
selection_rationale:
  - aligns_with_recent_real_product_visual_needs: true
  - tests_non_ceramic_transfer: true
  - tests_soft_goods_and_fabric_texture: true
  - tests_mesh_panel_visibility: true
  - tests_curved_brim_structure: true
  - tests_multi_color_collection_control: true
  - stays_A4_8_docs_only: true
```

The visor is deliberately different from the matte ceramic mug. It has fabric, mesh, stitching, curved brim geometry, open-top structure, and multi-color collection requirements. This makes it useful for testing whether the prompt package workflow can generalize beyond hard, simple tabletop objects.

## Product Identity

```yaml
product_identity:
  product_name: multi-color breathable mesh sports visor
  product_type: open-top sun visor
  use_case:
    - outdoor sports
    - running
    - tennis
    - golf
    - summer sun protection
  buyer_context:
    - ecommerce product listing
    - colorway comparison
    - lifestyle product detail page
```

## Product Structure

```yaml
product_structure:
  open_top_crown: true
  curved_front_brim: true
  breathable_mesh_side_panels: true
  fabric_sweatband: true
  adjustable_back_closure: true
  soft_fabric_body: true
  must_not_become:
    - baseball_cap
    - cycling_cap
    - bucket_hat
    - full_crown_hat
```

## Material And Texture

```yaml
material_texture:
  primary_material: lightweight athletic fabric
  mesh: visible breathable mesh texture
  brim: structured curved fabric brim
  stitching: subtle clean stitching
  finish: matte textile, not plastic or metallic
  texture_risk:
    - mesh may disappear
    - fabric may become rubber/plastic
    - brim may become too rigid or helmet-like
```

## Multi-Color Series

```yaml
color_collection:
  hero_color_priority: light_neutral_or_soft_pastel
  supporting_colorways:
    - white
    - light gray
    - beige
    - pink
    - sky blue
    - mint green
  avoid_color_dominance:
    - black
    - dark navy
    - overly saturated neon
  color_relationship: show a coordinated multi-color product family without letting any one dark item dominate the image
```

## Target Visual Direction

```yaml
visual_direction:
  primary_direction: clean ecommerce product hero or grouped colorway display
  secondary_direction: light outdoor lifestyle product scene
  mood: fresh, breathable, sporty, summer, lightweight
  commercial_main_image_boundary:
    background: clean bright studio or softly lit minimal surface
    product_priority: product first, no distracting props
    people_allowed_now: false
  lifestyle_boundary:
    allowed_later_for_prompt_variant: true
    people_faces_hands_allowed_now: false
    environment_must_not_overpower_product: true
```

## Initial Acceptance Criteria

```yaml
acceptance_criteria:
  must_have:
    - open-top visor structure is clear
    - curved brim is visible and plausible
    - mesh panels are recognizable
    - soft athletic fabric texture is preserved
    - multiple colorways are legible as one product family
    - light or pastel colorways lead the composition
    - product remains the visual subject
  must_not_have:
    - full baseball cap crown
    - cycling cap silhouette
    - helmet-like structure
    - black or dark navy dominating the image
    - people, faces, hands, logos, readable text, or extra props
    - background overpowering product clarity
```

## Risk Points

```yaml
risk_points:
  color_dominance: dark colorways can visually dominate the scene
  structure_misread: open-top visor can become baseball cap or cycling cap
  material_error: mesh and fabric can become plastic or rubber
  brim_error: curved brim can become flat, warped, or helmet-like
  background_noise: lifestyle context can overwhelm product details
  series_confusion: multi-color group can look like unrelated products
```

## Next Step

```yaml
recommended_next: v8_013_second_product_prompt_package_draft_gate
A5_authorization_required_later: true
provider_contact_allowed_now: false
image_generation_allowed_now: false
memory_write_allowed_now: false
```
