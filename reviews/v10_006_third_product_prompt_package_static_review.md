# v10.006 Third Product Prompt Package Static Review

```yaml
review_id: v10_006_third_product_prompt_package_static_review
review_type: prompt_package_static_review
source_phase: v10_005_third_product_prompt_package_draft_gate
source_commit: 19c6a5a7f71d2af208c381a23a4c5ab0771ba533
prompt_package_path: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
selected_product: cosmetic_skincare_bottle / premium_serum_bottle
static_review_result: pass_for_static_review
A5_authorization_created: false
provider_contact: false
image_generation: false
memory_write: false
production_candidate_002: false
```

## YAML Shape Findings

- `prompt: |` is present as an independent top-level field.
- `positive_prompt: |` is present as an independent top-level field.
- `negative_prompt: |` is present as an independent top-level field.
- `prompt` and `positive_prompt` are synchronized.
- `negative_prompt` was reformatted into a more readable multi-line literal block.

## Product Identity Findings

The prompt package clearly defines a premium serum bottle / cosmetic skincare bottle. It avoids major category drift by explicitly excluding perfume bottle, medicine bottle, candle jar, beverage bottle, lotion pump bottle, and generic plastic container.

## Structure Lock Findings

The structure lock is strong enough for a first static review pass. The package specifies a frosted translucent glass bottle with a clean dropper cap, and it forbids pump dispenser drift, malformed cap geometry, fused cap, broken cap, crooked cap, and impossible cap geometry.

## Material And Reflection Findings

Material constraints are explicit: frosted or softly translucent glass, subtle internal depth, soft edge highlights, controlled premium reflections, and no cheap plastic or metallic bottle-body drift.

## Label Boundary Findings

The label boundary is appropriate for an unbranded first trial. The package forbids readable brand logo, fake text, random text, random letters, broken label, and watermark.

## Composition Findings

Composition direction is clear: single bottle, hero product dominance, 60-75% visual importance, full bottle visible, straight-on or slight three-quarter front angle, subtle premium background, and no distracting people, hands, props, or extra bottles.

## Review Decision

```yaml
static_review_result: pass_for_static_review
authorization_decision_required_next: true
recommended_next_phase: v10_007_third_product_A5_authorization_decision_gate
generation_allowed_now: false
```

This package can proceed to a human A5 authorization decision gate. It must not be executed without separate explicit authorization.
