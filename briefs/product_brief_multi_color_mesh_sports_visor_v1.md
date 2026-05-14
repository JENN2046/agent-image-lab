# Product Brief: Multi-Color Mesh Sports Visor v1

```yaml
brief_id: product_brief_multi_color_mesh_sports_visor_v1
brief_status: draft_for_prompt_package
product_name: multi-color breathable mesh sports visor
product_name_zh: 多色透气网眼运动空顶帽
product_category: sports_headwear
route: Route_B_multi_product_prompt_package_expansion
generation_request_created: false
provider_contact_allowed: false
image_generation_allowed: false
memory_write_allowed: false
```

## Product Summary

A lightweight open-top sports sun visor with a curved brim, breathable mesh panels, soft athletic fabric body, and multiple coordinated colorways for summer outdoor use.

The brief is intended to feed a future prompt package draft. It is not an executable generation request.

## Product Identity

```yaml
identity:
  product_type: open-top sports visor
  target_use:
    - running
    - tennis
    - golf
    - hiking
    - summer commute
  audience: shoppers looking for lightweight sun protection and breathable athletic styling
  ecommerce_role:
    - main product image
    - color collection image
    - product detail visual
```

## Structure

```yaml
structure:
  open_top: true
  full_crown: false
  curved_brim: true
  brim_shape: smooth athletic curve
  side_panels: breathable mesh
  band: soft fabric sweatband
  back: adjustable strap or closure
  silhouette_must_read_as: sports visor
  silhouette_must_not_read_as:
    - baseball cap
    - cycling cap
    - bucket hat
    - helmet
```

## Material And Texture

```yaml
materials:
  fabric: lightweight matte athletic textile
  mesh: fine breathable mesh with visible perforation or weave
  stitching: subtle clean stitching along brim and band
  closure: simple adjustable back detail
  finish: soft matte textile
  avoid:
    - glossy plastic
    - metallic shell
    - rubber helmet look
    - overly stiff brim material
```

## Color Collection

```yaml
color_collection:
  collection_type: multi-color series
  preferred_lead_colors:
    - white
    - light gray
    - beige
    - soft pink
    - sky blue
    - mint green
  dark_colors_allowed_as_supporting_only:
    - black
    - navy
  color_priority_rule: light neutral or pastel visor should be the hero; dark colorways must not dominate
  color_count_target: 4_to_6_visible_colorways
```

## Visual Direction

```yaml
visual_direction:
  primary_shot: clean ecommerce hero color collection
  alternate_shot: airy outdoor lifestyle product-only scene
  aspect_ratio_preference: "4:5 or 1:1"
  mood:
    - fresh
    - breathable
    - sporty
    - summer
    - lightweight
  background:
    - bright neutral studio
    - soft daylight
    - minimal outdoor cue if lifestyle variant is later selected
```

## Boundaries

```yaml
commercial_main_image_boundary:
  product_first: true
  no_people: true
  no_faces: true
  no_hands: true
  no_logo: true
  no_readable_text: true
  no_extra_props: true

lifestyle_boundary:
  product_must_remain_primary: true
  environment_must_be_light_and_uncluttered: true
  no_model_or_human_body_parts_in_v1: true
```

## Initial Acceptance Criteria

```yaml
acceptance_criteria:
  - open-top visor structure is unmistakable
  - curved brim is plausible and clean
  - mesh panels are visible
  - fabric texture looks lightweight and breathable
  - multiple colorways appear as one coordinated product family
  - light or pastel colorway leads the image
  - black or navy does not dominate the visual hierarchy
  - no full cap crown, helmet, cycling cap, or bucket hat drift
  - no people, hands, faces, readable text, logo, watermark, or props
  - background supports the product without taking attention
```

## Known Risks

```yaml
known_risks:
  - color dominance by dark visor
  - open-top visor misread as baseball cap
  - sports visor misread as cycling cap
  - mesh material rendered as plastic or rubber
  - curved brim warped or flattened
  - product family appears inconsistent
  - lifestyle background overwhelms product
```

## Handoff

```yaml
next_artifact: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
next_phase: v8_013_second_product_prompt_package_draft_gate
A5_authorization_required_later: true
plugin_call_allowed_by_this_brief: false
image_generation_allowed_by_this_brief: false
memory_write_allowed_by_this_brief: false
```
