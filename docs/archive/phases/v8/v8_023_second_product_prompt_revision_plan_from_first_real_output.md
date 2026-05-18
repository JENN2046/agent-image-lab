# v8.023 Second Product Prompt Revision Plan From First Real Output

```yaml
phase: v8_023_second_product_prompt_revision_plan_from_first_real_output
base_contract: AGENTS.md
mode: A4.8_docs_only_prompt_revision_planning
intent: local_draft
risk_level: R1
source_phase: v8_022_human_review_of_second_product_second_real_output
source_output: runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/native_doubao_1778733554203_0.jpg
route: Route_B_multi_product_prompt_package_expansion
selected_product: multi_color_mesh_sports_visor
provider_contact: false
image_generation: false
retry: false
memory_write: false
```

## Purpose

This gate turns the v8.021 review findings into a second-product prompt v2 plan.
It does not request or authorize another generation. The next real provider call,
if any, still requires a separate A5 authorization decision.

## Source Review Summary

```yaml
reviewed_output: runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/native_doubao_1778733554203_0.jpg
asset_status: needs_revision
accepted_candidate: false
commercial_delivery_ready: false
memory_suitability: deferred
reviewable_sample: true
route_B_generation_recovered_after_http_400: true
```

The second product chain is now technically proven: v8.021 produced one
reviewable image after the v8.018 canonical `prompt` mapping fix. The image
still falls short of accepted-candidate quality because color coverage, scene
language, material detail, and product hierarchy need stronger instruction.

## Problems To Fix

```yaml
missing_required_colors:
  - deep navy
  - black
  - muted olive green
turquoise_blue_problem: too_pale_not_bright_enough
warm_white_problem: visually_too_dominant
scene_problem: studio_like_not_realistic_urban_sports_lifestyle
missing_lifestyle_cues:
  - city_greenway
  - sports_rest_area
  - outdoor_cafe_table
  - racket_sport_club_entrance
material_problem: mesh_stitching_honeycomb_detail_not_strong_enough
commercial_lifestyle_problem: insufficient
```

## Prompt V2 Revision Directions

### 1. Complete The Color Collection

Prompt v2 must visibly include all six target colorways:

```yaml
required_visible_colorways:
  - bright turquoise blue
  - soft pink
  - warm white
  - deep navy
  - black
  - muted olive green
```

The color set should read as a coordinated retail collection, not as one
cream-led product with minor accents.

### 2. Strengthen Color Hierarchy

```yaml
primary_visual_highlight:
  allowed:
    - bright_turquoise_blue
    - soft_pink
warm_white_role: secondary_supporting_color
deep_navy_role: supporting_color_only
black_role: supporting_color_only
muted_olive_green_role: visible_supporting_color
forbidden:
  - black_or_navy_as_dominant_hero
  - warm_white_as_visual_majority
  - pale_or_desaturated_turquoise
```

The prompt should explicitly prevent black, deep navy, or warm white from
becoming the dominant visual mass.

### 3. Move From Studio To Urban Sports Lifestyle

Prompt v2 should replace studio-product-shot language with a realistic lifestyle
setting. Acceptable scene directions:

```yaml
allowed_lifestyle_settings:
  - outdoor_cafe_table_beside_city_greenway
  - stylish_sports_rest_area
  - modern_racket_sport_club_entrance
background_cues:
  - pale_concrete_wall
  - glass_storefront
  - blurred_greenery
  - city_pavement
background_focus: softly_out_of_focus
```

The background should add context while remaining subordinate to the product.

### 4. Strengthen Material And Structure Detail

Prompt v2 must emphasize:

```yaml
material_and_structure:
  - breathable_honeycomb_mesh_panels
  - visible_perforated_weave
  - stitched_fabric_edges
  - soft_flexible_curved_brim
  - lightweight_summer_sports_material
  - open_top_visor_structure
  - adjustable_back_strap
```

This should reduce the risk that the image reads as a smooth plastic cap, a
cycling cap, or a generic fabric accessory.

### 5. Preserve Product Dominance

```yaml
composition:
  product_frame_coverage: 65_to_75_percent
  background: softly_out_of_focus
  clutter_allowed: false
  human_model_allowed: false
  people_or_hands_allowed: false
```

No model, hand, face, logo, text, or crowded prop setup is allowed in this v2
package unless a future authorization explicitly changes the target.

## Prompt Package Decision

```yaml
prompt_v2_created: true
prompt_v2_ref: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
v1_overwritten: false
runner_facing_canonical_prompt_field_required: true
positive_prompt_retained_for_review: true
```

The v2 prompt package is a new static artifact. It preserves v1 as historical
input and adds stronger color, lifestyle, mesh, stitching, and hierarchy rules.

## Non-Authorization Boundary

```yaml
A5_authorization_created: false
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
runs_output_committed: false
accepted_samples_written: false
```

## Recommended Next

```yaml
phase: v8_024_second_product_prompt_v2_static_review_gate
auto_execution_allowed: true
purpose: statically review prompt v2 against the v8.021 review gaps before any future A5 authorization decision
```
