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
| `minimal_modular_desk_lamp` | home / office lighting | adjustable joints, metal finish, light cone control, desk context | medium | not selected |
| `premium_wireless_over_ear_headphones` | consumer electronics / wearable | soft cushions, metal/plastic contrast, curved geometry, no logo/text | medium | not selected |
| `trail_running_hydration_vest` | technical sports soft goods | mesh fabric, straps, pockets, apparel structure, outdoor context | medium-high | not selected |

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
selected_product: premium_portable_led_camping_lantern
product_identity: compact premium portable LED camping lantern
product_category: outdoor_lifestyle_electronics
locked_structure: cylindrical_or_soft_rectangular_lantern_with_translucent_diffuser_top_handle_and_stable_base
primary_materials:
  - warm translucent diffuser
  - matte anodized aluminum or soft-touch polymer body
  - clean handle or hanging loop
  - stable non-slip base
visual_goal: premium outdoor lifestyle product hero image
commercial_delivery_ready_by_default: false
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
visual_direction: premium outdoor lifestyle product still life
scene_direction: dawn or dusk campsite table, weathered wood, stone, or neutral outdoor surface
composition_goal: single lantern as hero product, 55-70 percent visual importance
lighting_goal: lantern emits controlled warm glow while product edges remain readable
camera_goal: straight-on or slight three-quarter front angle, full product visible
background_role: soft outdoor depth, not busy camping scene
```

## Shot List

| Shot ID | Role | Description | Success Criteria |
|---|---|---|---|
| `shot_01_hero_dusk_tabletop` | primary hero | single lantern on outdoor table at dusk, warm glow on diffuser, product dominant | lantern identity clear, handle/base readable, glow controlled |
| `shot_02_detail_handle_diffuser` | future detail shot | closer view of handle attachment and translucent diffuser texture | structure plausible, no impossible handle, no blown highlights |
| `shot_03_context_packable_outdoor` | future lifestyle shot | lantern near backpack or folded map as subtle context | context supports product, no people, product remains hero |

Only `shot_01_hero_dusk_tabletop` is recommended for a future first minimal
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

## Static Review Plan

Before any future A5 decision, static review must check:

- product identity lock is explicit.
- `prompt`, `positive_prompt`, and `negative_prompt` exist as literal blocks.
- `prompt` and `positive_prompt` are synchronized.
- negative prompt blocks logo/text/icon/person/fire/smoke/product drift.
- provider contact remains false.
- image generation remains false.
- prompt package is not A5 authorization.
- human review checklist includes glow control, handle geometry, diffuser texture,
  product dominance, and outdoor context restraint.

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
env_local_secret_value_read_boundary: separately_authorized_only
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
  provider_contact: false
  image_generation: false
  memory_write: false
  production_candidate_002: false
  final_state:
    next_phase_started: false
```
