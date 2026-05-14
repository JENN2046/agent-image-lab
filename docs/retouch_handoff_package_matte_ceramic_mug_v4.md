# Retouch Handoff Package - Matte Ceramic Mug v4

```yaml
handoff_package_id: retouch_handoff_package_matte_ceramic_mug_v4
source_phase: v8_003_delivery_package_closeout_or_retouch_handoff_gate
source_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
asset_status: accepted_candidate_with_minor_retouch
commercial_delivery_ready: false
memory_suitability: deferred
```

## Purpose

This package gives a future human retoucher or post-production executor a clear,
bounded handoff for the v4 matte ceramic mug candidate. It summarizes the source
asset, retouch target, forbidden changes, acceptance rules, delivery package
fields, and post-delivery review steps.

This is a handoff package only. It does not execute retouching, create a new
image, call a provider, call a plugin, write memory, move assets, or promote the
candidate to production.

## Input Asset

```yaml
source_asset_path: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
source_asset_status: accepted_candidate_with_minor_retouch
source_candidate_identity: matte_ceramic_mug_v4
source_review_ref: reviews/v7_282_matte_ceramic_mug_v4_human_review.md
retouch_plan_ref: docs/final_retouch_plan_matte_ceramic_mug_v4.md
acceptance_criteria_ref: docs/retouch_acceptance_criteria_matte_ceramic_mug_v4.md
delivery_package_spec_ref: docs/delivery_package_spec_matte_ceramic_mug_v4.md
```

The source path is a reference only. This package does not copy, move, stage, or
commit the `runs/` output image.

## Task For Retoucher

Retouch only the local polish issues that keep v4 from commercial delivery
review:

- clean the slight dark and soft area around the upper handle attachment;
- improve the realism of the handle/body ceramic join;
- keep the rim edge clean and ceramic-like;
- lift the background slightly while preserving premium warm-gray tone;
- refine the bottom contact shadow so the mug feels grounded and clean;
- preserve or lightly improve subtle matte ceramic microtexture.

## Do Not Change

- Do not change the product.
- Do not change the mug shape, scale, orientation, or main composition.
- Do not add logo, text, props, hands, people, or lifestyle context.
- Do not make the image a lifestyle scene.
- Do not over-sharpen edges or create halos.
- Do not shift material toward plastic, metal, glass, or glossy porcelain.
- Do not change the v4 accepted-candidate identity.
- Do not infer `commercial_delivery_ready` without a later human review.

## Decision Criteria

```yaml
decision_criteria:
  pass:
    requires:
      - handle_attachment_cleanup_passed
      - rim_edge_cleanup_passed
      - background_brightness_passed
      - bottom_shadow_passed
      - matte_ceramic_microtexture_passed
      - no_logo_text_props_people_passed
      - no_over_sharpening_passed
      - no_product_shape_drift_passed
      - no_material_drift_passed
    result: "May proceed to commercial delivery review."

  needs_rework:
    meaning: "Direction is correct, but one or more bounded local issues remain."
    result: "Return to retoucher with specific local correction notes."

  fail:
    meaning: "Product identity, material, composition, or forbidden boundary is damaged."
    result: "Do not use as delivery candidate; preserve v4 source identity."
```

## Delivery Package Field Checklist

```yaml
delivery_package_fields:
  package_id: required
  source_candidate_path: required
  retouched_asset_ref: optional_future
  source_asset_status: required
  target_review_status: required
  retouch_plan_ref: required
  acceptance_criteria_ref: required
  human_reviewer: optional_until_review
  review_decision: not_reviewed | pass | needs_rework | fail
  commercial_delivery_ready: false
  memory_suitability: deferred
```

## Post-Delivery Human Review Steps

1. Confirm the retouched asset reference is present and points to the intended
   artifact.
2. Compare the retouched artifact against the v4 source candidate identity.
3. Apply the retouch acceptance checklist item by item.
4. Record `pass`, `needs_rework`, or `fail`.
5. Keep `commercial_delivery_ready: false` unless a later review explicitly
   promotes the artifact to delivery-ready status.
6. Keep `memory_suitability: deferred` unless a separate memory gate changes it.
7. Do not write memory, DailyNote, `accepted_samples/`, or `production_candidate_002`
   from this package.

## Why Memory Still Is Not Written

The V7/V8 loop contains useful lessons, but this package is only a handoff for
retouch and delivery review. Memory suitability remains `deferred`; any future
memory write requires a separate memory authorization with sanitized Chinese
summary rules.

## Why Production Candidate 002 Still Is Not Entered

The current source asset is not commercial delivery ready and no retouched asset
has been reviewed. `production_candidate_002` requires independent authorization
after delivery readiness is proven by a future human review.

## V8 Closeout Remaining

Before the final retouch route can be closed, the project still needs:

- a V8 route closeout record;
- confirmation that all V8 retouch planning artifacts are linked;
- confirmation that no generation, memory write, `accepted_samples/`, or
  production candidate promotion occurred;
- a decision whether the next safe step is human retouch handoff, route closeout,
  memory planning, or a separate production-readiness gate.
