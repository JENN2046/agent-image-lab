# Next Product Visual Production Trial Plan — v13.007

```yaml
plan_id: next_product_visual_production_trial_plan_v13_007
selected_product: premium_portable_led_camping_lantern
selected_product_zh: 高端便携式 LED 露营灯
product_category: outdoor_lifestyle_electronics
planning_scope: docs_only
generation_allowed: false
provider_contact_allowed: false
A5_execution_authorization_created: false
```

## Candidate Products

| Candidate | Category | What It Tests | Risk | Decision |
|---|---|---|---|---|
| `premium_portable_led_camping_lantern` | outdoor lifestyle electronics | emitted light, translucent diffuser, handle geometry, warm glow, outdoor tabletop context | medium | selected |
| `minimal_stainless_steel_thermal_bottle` | premium drinkware | brushed steel, cap geometry, cylindrical reflection control, outdoor/desk crossover | low-medium | not selected |
| `compact_modular_wireless_charger` | consumer electronics | charging pad geometry, modular parts, subtle indicator discipline, no UI text | medium | not selected |
| `premium_packable_travel_hair_dryer` | beauty / travel appliance | folded handle structure, matte plastic/metal mix, airflow grille, commercial lifestyle | medium-high | not selected |

## Recommendation

```yaml
recommended_product: premium_portable_led_camping_lantern
why_selected:
  - expands beyond ceramic mug, sports visor, and serum bottle
  - tests glow and light-emission discipline
  - tests translucent diffuser material without becoming another bottle
  - tests handle / base / body geometry
  - supports outdoor lifestyle context without people or action scenes
  - suitable for future one-shot generation only after separate A5 authorization
```

## Difference From Existing Products

| Previous product | Learned surface | Lantern difference |
|---|---|---|
| matte ceramic mug | simple hard goods, matte material, handle geometry | lantern adds controlled illumination, translucent diffuser, and outdoor/electronic identity |
| multi-color mesh sports visor | soft goods, color collection, mesh panels, lifestyle context | lantern is single hero product with hard/transparent materials and warm light behavior |
| premium serum bottle | glass/translucency, label discipline, beauty hero composition | lantern has no skincare label but requires glow, diffuser texture, handle shape, and rugged premium outdoor mood |

## ProductBrief Draft

```yaml
brief_id: product_brief_premium_portable_led_camping_lantern_v1_draft
product: premium_portable_led_camping_lantern
selected_product: premium_portable_led_camping_lantern
product_identity: compact premium portable LED camping lantern
product_category: outdoor_lifestyle_electronics
commercial_goal: premium outdoor product hero image suitable for future ecommerce or campaign review after separate authorization
target_scene: dusk outdoor tabletop or campsite-adjacent still life with restrained context
visual_direction: single premium lantern hero with controlled warm glow, readable silhouette, and quiet outdoor atmosphere
locked_structure: cylindrical_or_soft_rectangular_lantern_with_translucent_diffuser_top_handle_and_stable_base
primary_materials:
  - warm translucent diffuser
  - matte anodized aluminum or soft-touch polymer body
  - clean handle or hanging loop
  - stable non-slip base
material_constraints:
  - warm translucent diffuser must remain readable, not blown out
  - body should feel premium matte metal or soft-touch polymer
  - base contact should look stable and manufactured
structure_constraints:
  - single lantern body
  - continuous attached handle or hanging loop
  - visible diffuser, body, and base hierarchy
forbidden_elements:
  - readable logo or fake text
  - random icons or UI symbols
  - people, hands, open flame, smoke, tent-dominated scene
  - product drift into candle, flashlight, speaker, humidifier, thermos, table lamp, or smart speaker
  - impossible detached handle or warped diffuser
visual_goal: premium outdoor lifestyle product hero image
commercial_delivery_ready_by_default: false
acceptance_criteria_seed:
  - product identity reads as portable LED camping lantern
  - warm glow is controlled while edges remain visible
  - handle, diffuser, body, and base structure are plausible
  - background supports product without becoming the subject
  - no readable logo, fake text, people, or fire
```

### Product Identity

The product should read as a high-end portable LED camping lantern, not a table
lamp, flashlight, candle, speaker, humidifier, thermos, or smart home cylinder.

### Material And Texture Direction

- Warm translucent diffuser with visible light softness, not blown-out glow.
- Matte aluminum, graphite, olive, sand, or warm gray body finish.
- Clean handle or hanging loop, clearly attached and structurally plausible.
- Stable base with subtle rubber or shadow contact.
- Outdoor-capable premium finish, not toy plastic.

### Risk Points

| Risk | Control |
|---|---|
| Overexposed glow erases product shape | Require controlled warm light and readable silhouette |
| Product drifts into candle / lamp / speaker | Lock LED camping lantern identity and handle/base structure |
| Handle geometry becomes impossible | Require continuous, symmetric, attached handle |
| Outdoor scene overpowers product | Keep product dominant and background supportive |
| Fake branding or icons appear | Forbid readable text, logo, random letters, UI symbols |
| Plastic drift or toy-like finish | Require premium matte metal or soft-touch body |

## ShotPlan Draft

```yaml
shot_plan_id: shot_plan_premium_portable_led_camping_lantern_v1_draft
brief_ref: product_brief_premium_portable_led_camping_lantern_v1_draft
visual_direction: premium outdoor lifestyle product still life
scene_direction: dawn or dusk campsite table, weathered wood, stone, or neutral outdoor surface
composition_goal: single lantern as hero product, 55-70 percent visual importance
lighting_goal: lantern emits controlled warm glow while product edges remain readable
camera_goal: straight-on or slight three-quarter front angle, full product visible
background_role: soft outdoor depth, not busy camping scene
shots:
  - hero_product_shot
  - material_detail_shot
  - lifestyle_context_shot
visual_roles:
  hero_product_shot: prove product identity and commercial hero viability
  material_detail_shot: prove diffuser, handle, and body material quality
  lifestyle_context_shot: prove outdoor scene support without losing product dominance
risk_notes:
  - glow can blow out diffuser and hide shape
  - handle can become structurally impossible
  - scene can drift into camping advertisement instead of product still life
  - product can drift into candle, table lamp, speaker, or thermos
review_strategy: static review first, then future human review only after separately authorized generation
```

## Shot List

### `hero_product_shot`

```yaml
shot_id: hero_product_shot
role: primary commercial hero
composition: single lantern centered or slightly off-center, full product visible, 55-70 percent visual importance
lighting: dusk ambient with controlled warm lantern glow, readable diffuser and product edges
camera_angle: straight-on or slight three-quarter front angle at product height
scene_constraints: restrained outdoor tabletop or stone surface, soft background depth, no people or active camping scene
product_constraints: one lantern only, attached handle, visible diffuser/body/base hierarchy
review_focus: product identity, glow control, silhouette readability, structure plausibility, no fake text/logo
```

### `material_detail_shot`

```yaml
shot_id: material_detail_shot
role: future material and structure detail
composition: closer crop on diffuser, handle attachment, upper body, and body finish
lighting: soft controlled highlight plus subtle internal glow, no blown highlights
camera_angle: slight top-front three-quarter angle
scene_constraints: minimal neutral surface, background kept soft and secondary
product_constraints: handle remains continuous and attached, diffuser texture remains visible, body finish reads premium
review_focus: diffuser material, handle geometry, matte body quality, highlight control
```

### `lifestyle_context_shot`

```yaml
shot_id: lifestyle_context_shot
role: future outdoor lifestyle context
composition: lantern as hero with restrained context prop such as folded map, pack strap, or wood tabletop edge
lighting: early evening outdoor ambience, lantern glow supports mood without dominating frame
camera_angle: medium three-quarter angle with full product visible
scene_constraints: no people, no hands, no open flame, no tent-dominated scene, no extra lanterns
product_constraints: product remains dominant, one lantern only, no packaging box by default
review_focus: commercial scene fit, product dominance, context restraint, no product drift
```

Only `hero_product_shot` is recommended for a future first minimal
generation trial if separately authorized.

## PromptPackage Planning Requirements

A future prompt package should include:

```yaml
future_prompt_package_id: product_lifestyle_premium_portable_led_camping_lantern_v1
required_fields:
  - prompt
  - positive_prompt
  - negative_prompt
  - product_identity
  - selected_product
  - locked_structure
  - material_constraints
  - structure_constraints
  - scene_constraints
  - lighting_camera
  - forbidden_elements
  - acceptance_criteria
  - human_review_checklist
runner_prompt_mapping:
  canonical_prompt_field: prompt
  positive_prompt_alias_required: true
  prompt_positive_sync_required: true
```

Future prompt boundaries:

- no readable logo, fake text, random icons, UI marks, or watermark.
- no people, hands, flames, open fire, smoke, tent-dominated scene, or extra lanterns.
- no flashlight, candle, speaker, humidifier, thermos, table lamp, or smart speaker drift.
- no impossible handle, detached handle, warped diffuser, melted shape, or blown-out light.
- no generated product packaging boxes by default.

Planning boundaries:

```yaml
one_prompt_package_expected_later: true
prompt_package_created_now: false
prompt_field_required: true
positive_prompt_field_required: true
negative_prompt_field_required: true
product_identity_lock_required: true
structure_lock_required: true
material_constraints_required: true
forbidden_elements_required: true
human_review_checklist_required: true
A5_authorization_required_later: true
provider_contact_from_prompt_package_alone: false
```

## Static Review Plan

Before any future A5 decision, static review must check:

- product identity lock is explicit.
- `prompt`, `positive_prompt`, and `negative_prompt` exist as literal blocks.
- `prompt` and `positive_prompt` are synchronized.
- negative prompt blocks logo/text/icon/person/fire/smoke/product drift.
- provider contact remains false.
- image generation remains false.
- memory write remains false.
- static_review_result is present.
- watch_items are present or explicitly declared none.
- A5_authorization_created is false.
- prompt package is not A5 authorization.
- human review checklist includes glow control, handle geometry, diffuser texture,
  product dominance, and outdoor context restraint.

```yaml
reviewed_artifact: future_prompt_package
static_review_result_required: true
watch_items_required_or_none_declared: true
A5_authorization_created: false
provider_contact: false
image_generation: false
memory_write: false
```

## A5 Decision Gate Prerequisites

Any future A5 decision gate must separately define:

```yaml
approved_product: premium_portable_led_camping_lantern
approved_prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
output_directory: runs/real_generation/<future_lantern_trial_directory>/
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 1
auto_retry: false
stop_after_generation: true
success_requires_verified_local_file: true
human_review_required_after_success: true
secret_read_boundary: separately_authorized_only_for_required_provider_fields
execution_started: false
provider_contact: false
```

This plan does not create that A5 authorization and does not create the prompt
package file.

## Suitability For Future Real Generation

```yaml
suitable_for_future_real_generation: true
future_generation_authorized_now: false
reason: strong V13 loop test object with new material, structure, glow, and scene constraints
```

## Closeout

```yaml
closeout:
  phase: v13_007_next_product_visual_production_trial_planning_gate
  selected_product: premium_portable_led_camping_lantern
  candidate_products_presented_count: 4
  product_brief_draft_created: true
  shot_plan_draft_created: true
  shot_list_created: true
  prompt_package_planning_requirements_created: true
  static_review_plan_created: true
  A5_decision_gate_prerequisites_created: true
  prompt_package_created: false
  A5_authorization_created: false
  provider_contact: false
  image_generation: false
  output_directory_created: false
  env_local_secret_value_read: false
  memory_write: false
  accepted_samples_written: false
  runs_output_committed: false
  production_candidate_002: false
  final_state:
    next_phase_started: false
```
