# v10.004 Third Product Brief Gate

```yaml
phase: v10_004_third_product_brief_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_third_product_brief_gate
source_phase: v10_003_third_product_prompt_workflow_expansion_route_gate
source_commit: 155d30caae054821bb839f331fedbd62da36e0d2
selected_route: third_product_prompt_workflow_expansion
selected_product: cosmetic_skincare_bottle / premium_serum_bottle
product_brief_created: true
prompt_package_created: false
A5_authorization_created: false
provider_contact_allowed_now: false
image_generation_allowed_now: false
memory_write_allowed_now: false
production_candidate_002_allowed_now: false
```

## Purpose

v10.004 creates the docs-only product brief for the third product lane: a premium serum bottle / cosmetic skincare bottle.

This gate defines product identity, material direction, packaging boundary, scene direction, commercial image goal, visual risks, acceptance criteria draft, negative constraints draft, and the next prompt package direction. It does not create a prompt package, authorize A5, generate images, contact a provider, read `.env.local`, write memory, enter `production_candidate_002`, write `accepted_samples/`, create `runs/` outputs, or enter runtime.

## Product Identity

```yaml
product_identity:
  product_category: cosmetic_skincare_bottle
  product_direction: premium_serum_bottle
  locked_structure: frosted_translucent_glass_bottle_with_clean_dropper_cap
  product_role: hero ecommerce beauty product
  brand_state: unbranded / no readable logo
  label_state: elegant minimal blank-label zone, no readable text
```

The product should read as a premium skincare serum bottle, not a generic plastic bottle, perfume bottle, medicine bottle, candle jar, or drink container.

## Material And Texture Description

The bottle should use frosted or softly translucent glass with controlled internal depth. The glass should catch soft highlights along the shoulders and vertical edges without noisy mirror reflections.

The dropper cap should be clean, symmetric, and credible: a smooth cap collar and simple dropper top, without malformed seams, fused geometry, random pump parts, or broken attachment points. The material may be satin white, warm silver, champagne metal, or soft neutral cap material, but it should stay subtle and premium.

## Packaging And Label Boundary

The packaging direction is elegant skincare packaging with a refined blank label panel or very minimal non-readable label area.

Label boundary rules:

- No readable brand logo unless separately authorized later.
- No fake text, random text, broken label, watermark, or pseudo-brand marks.
- The label panel may imply a premium cosmetic label through layout, spacing, and paper / frosted surface quality.
- The label must not become the visual subject; the bottle shape, glass, cap, and premium product identity remain dominant.

## Scene Direction

```yaml
scene_direction:
  composition: clean premium product still life
  product_scale: dominant hero product, approximately 60-75 percent visual importance
  camera: straight-on or slight three-quarter front angle
  surface: clean stone, warm-gray, ivory, or soft neutral beauty surface
  background: subtle luxury background, soft gradient or layered neutral depth
  props: none by default
  people: none
```

The background should support the serum bottle without overpowering it. A subtle luxury background is allowed, but overdecorated spa props, flowers, hands, faces, and brand-like assets are not part of the first brief.

## Commercial Image Goal

The commercial goal is a premium beauty ecommerce hero image that could later support either a clean main image or a refined lifestyle-adjacent product still life.

The image should communicate:

- premium skincare;
- controlled glass / cap reflections;
- clean packaging discipline;
- strong product identity at first glance;
- high-end beauty product photography rather than generic AI product mockup.

## Key Visual Risks

| Risk | Why it matters | Brief-level control |
|---|---|---|
| Glass / plastic material drift | Frosted glass can collapse into cheap plastic or perfume glass | Require frosted translucent glass, soft depth, controlled highlights |
| Broken label or fake text | Skincare packaging often triggers random text or logos | Require blank / non-readable label zone and no brand logo |
| Unrealistic reflections | Glass and cap reflections can become noisy or impossible | Require soft controlled reflections and premium studio lighting |
| Liquid / bottle distortion | Translucent material can warp product shape or imply messy liquid | Require stable bottle silhouette and subtle internal depth |
| Cap / dropper geometry errors | Dropper caps can fuse, bend, or turn into pump parts | Lock clean dropper cap structure and forbid malformed cap / pump artifacts |
| Overdecorated luxury scene | Beauty images often add props that distract from product | Default to no props, subtle luxury background only |
| Product scale ambiguity | Small bottles can feel like samples or props | Require dominant hero product and clear bottle scale |
| Logo / brand hallucination | Models may invent brand marks | Forbid readable logo, fake text, watermark, and random label marks |
| Background overpowering product | Reflective / luxury scenes can bury the hero asset | Require product dominance and supporting background |

## Acceptance Criteria Draft

```yaml
acceptance_criteria_draft:
  product_identity_clear: true
  serum_bottle_not_perfume_or_medicine: true
  frosted_or_translucent_glass_reads_premium: true
  clean_dropper_cap_structure: true
  label_boundary_clean_and_non_readable: true
  controlled_reflections: true
  product_dominant: true
  background_supports_product: true
  no_logo_text_people_props: true
  no_material_or_shape_drift: true
```

The first future prompt package should be judged on whether it can preserve product identity, material realism, label discipline, and quiet premium commercial composition without relying on decorative scene clutter.

## Negative Constraints Draft

```yaml
negative_constraints_draft:
  no_readable_brand_logo: true
  no_fake_text: true
  no_random_text: true
  no_broken_label: true
  no_watermark: true
  no_people: true
  no_hands: true
  no_overdecorated_spa_scene: true
  no_plastic_material_drift: true
  no_metallic_bottle_body_drift: true
  no_perfume_bottle_drift: true
  no_medicine_bottle_drift: true
  no_malformed_dropper_cap: true
  no_fused_cap_or_pump_artifact: true
  no_unrealistic_reflections: true
  no_background_overpowering_product: true
```

## Next Prompt Package Direction

The next A4.8 prompt package draft should translate this brief into a structured prompt package for the serum bottle. It should keep the product locked as a frosted translucent glass serum bottle with a clean dropper cap, specify premium beauty product photography, define controlled reflection behavior, and carry the negative label / logo / fake-text constraints forward.

```yaml
recommended_next:
  phase: v10_005_third_product_prompt_package_draft_gate
  auto_execution_allowed: true
  purpose: 基于第三商品 brief 创建 prompt package draft；仍不生成图、不接 provider、不写 memory。
final_state:
  next_phase_started: false
```
