# v10.005 Third Product Prompt Package Draft Gate

```yaml
phase: v10_005_third_product_prompt_package_draft_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_prompt_package_draft_gate
source_phase: v10_004_third_product_brief_gate
source_commit: d3d2f41b44fb696d3bdaf1fc9e9c64d2f69e6d2f
selected_route: third_product_prompt_workflow_expansion
selected_product: cosmetic_skincare_bottle / premium_serum_bottle
locked_structure: frosted_translucent_glass_bottle_with_clean_dropper_cap
product_brief_ref: briefs/product_brief_premium_serum_bottle_v1.md
prompt_package_path: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
prompt_package_created: true
A5_authorization_created: false
provider_contact_allowed_now: false
image_generation_allowed_now: false
memory_write_allowed_now: false
production_candidate_002_allowed_now: false
```

## Purpose

v10.005 creates the docs-only prompt package draft for the third product lane: a premium serum bottle / cosmetic skincare bottle.

This gate converts the v10.004 product brief into a structured prompt package draft. It does not create A5 authorization, contact providers, generate images, read `.env.local`, write memory, enter `production_candidate_002`, write `accepted_samples/`, create `runs/` outputs, or enter runtime.

## Prompt Package Draft

```yaml
prompt_package_path: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
canonical_prompt_field_present: true
positive_prompt_alias_present: true
positive_prompt_sync_required: true
negative_prompt_present: true
```

The package includes:

- runner-facing canonical `prompt: |`;
- human-review alias `positive_prompt: |` synchronized with `prompt: |`;
- `negative_prompt: |`;
- product identity and structure lock;
- material / texture constraints;
- scene, lighting, camera, composition language;
- acceptance criteria;
- human review checklist;
- explicit non-authorization for A5, provider contact, image generation, memory, production, accepted samples, and runs output creation.

## Product Identity

```yaml
selected_product: cosmetic_skincare_bottle / premium_serum_bottle
locked_structure: frosted_translucent_glass_bottle_with_clean_dropper_cap
product_brief_ref: briefs/product_brief_premium_serum_bottle_v1.md
```

The package keeps the product as a single premium serum bottle, not a perfume bottle, medicine bottle, candle jar, beverage bottle, lotion pump bottle, or generic plastic container.

## Structure Lock

The structure is locked to a frosted translucent glass bottle with a clean dropper cap.

The package explicitly forbids pump dispenser drift, malformed cap geometry, fused cap artifacts, broken cap, crooked cap, extra bottles, and product identity drift.

## Material / Texture Constraints

The prompt package requires:

- frosted or softly translucent glass body;
- subtle internal depth;
- soft edge highlights;
- controlled reflections;
- clean premium cap finish;
- blank or non-readable label zone;
- no cheap plastic drift;
- no metallic bottle body drift.

## Scene Direction

The first prompt direction is clean premium beauty product still life, with a refined stone, ivory, warm-gray, or soft neutral luxury surface. The background should be subtle and supportive, not a prop-heavy spa scene.

## Lighting / Camera Language

The package specifies premium soft studio lighting, soft highlights on frosted glass, cap, and label area, controlled reflections, tidy contact shadow, and a straight-on or slight three-quarter front camera angle.

## Acceptance Criteria

The prompt package draft includes acceptance criteria for:

- clear premium serum bottle identity;
- credible frosted translucent glass material;
- clean dropper cap structure;
- blank or non-readable label boundary;
- no readable logo or fake text;
- controlled reflections and soft highlights;
- dominant product scale;
- subtle premium background;
- no people, hands, props, extra bottles, or material drift.

## Human Review Checklist

The package includes a human review checklist so static review can verify product identity, material, cap structure, label discipline, composition, lighting, and non-authorization boundaries before any future A5 authorization is considered.

## A5 Authorization Required Later

```yaml
A5_authorization_required_later: true
A5_authorization_created: false
provider_contact_allowed_by_this_file: false
image_generation_allowed_by_this_file: false
memory_write_allowed: false
production_candidate_002_allowed: false
accepted_samples_write_allowed: false
runs_output_creation_allowed: false
```

This file is an input candidate for future review and authorization. It is not itself authorization to execute.

## Recommended Next

```yaml
recommended_next:
  phase: v10_006_third_product_prompt_package_static_review_gate
  auto_execution_allowed: true
  purpose: 静态审查第三商品 prompt package；仍不生成图、不接 provider、不写 memory。
final_state:
  next_phase_started: false
```
