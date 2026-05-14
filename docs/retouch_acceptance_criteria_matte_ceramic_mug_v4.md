# Retouch Acceptance Criteria - Matte Ceramic Mug v4

```yaml
criteria_id: retouch_acceptance_criteria_matte_ceramic_mug_v4
source_phase: v8_002_retouch_acceptance_criteria_or_delivery_package_gate
source_plan: docs/final_retouch_plan_matte_ceramic_mug_v4.md
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
asset_status: accepted_candidate_with_minor_retouch
commercial_delivery_ready: false
memory_suitability: deferred
```

## Purpose

This document defines how a future retouched version of the v4 matte ceramic mug
candidate should be judged before commercial delivery review. It is a paper
acceptance standard only. It does not create, edit, move, stage, or commit image
assets.

## Decision Taxonomy

```yaml
decision_taxonomy:
  pass:
    meaning: "Retouch satisfies all required criteria and may proceed to commercial delivery review."
    commercial_delivery_ready: "candidate_for_review"

  needs_rework:
    meaning: "Retouch improves the image but one or more required criteria still need local correction."
    commercial_delivery_ready: false

  fail:
    meaning: "Retouch damages product identity, composition, material, or boundary rules."
    commercial_delivery_ready: false
```

## Required Pass Criteria

```yaml
required_pass_criteria:
  handle_attachment_cleanup:
    required: true
    pass: "Upper handle attachment is cleaner, less dark, and less soft while still natural."
    fail: "Dark dirty patch remains obvious, or the handle join becomes artificial."

  rim_edge_cleanup:
    required: true
    pass: "Cup rim remains clean, continuous, and ceramic-like."
    fail: "Rim becomes jagged, over-sharpened, melted, or visually inconsistent."

  background_brightness_transparency:
    required: true
    pass: "Background is slightly brighter and more transparent while preserving premium warm-gray tone."
    fail: "Background becomes flat white, muddy, noisy, or distractingly bright."

  bottom_shadow_refinement:
    required: true
    pass: "Bottom contact shadow is cleaner and grounds the mug naturally."
    fail: "Mug appears floating, heavy, dirty, or cut out."

  matte_ceramic_microtexture:
    required: true
    pass: "Subtle premium ceramic microtexture is preserved or lightly improved."
    fail: "Surface becomes plastic, metallic, glossy, noisy, or speckled."

  no_logo_text_props_people:
    required: true
    pass: "No logo, text, prop, person, hand, or lifestyle object is added."
    fail: "Any new logo, text, prop, person, hand, or lifestyle object appears."

  no_over_sharpening:
    required: true
    pass: "Edges look clean but not brittle or haloed."
    fail: "Rim, handle, or body shows halos, brittle sharpening, or crunchy texture."

  no_product_shape_drift:
    required: true
    pass: "Mug body, handle silhouette, scale, and composition remain recognizably v4."
    fail: "Product shape, handle position, scale, or main composition changes."

  no_material_drift:
    required: true
    pass: "Material still reads as cream-white matte ceramic."
    fail: "Material reads as plastic, metal, glass, enamel, or glossy porcelain."
```

## Needs Rework Conditions

Use `needs_rework` when the retouch is directionally correct but still has a
bounded local issue, such as:

- handle attachment is improved but still slightly dark;
- bottom shadow is cleaner but too heavy;
- background is lifted but still a little muddy;
- microtexture is present but too conservative;
- rim edge is mostly clean but has one small local defect.

`needs_rework` must not be used if the product identity, material, or composition
has drifted. Those are fail conditions.

## Fail Conditions

```yaml
fail_conditions:
  product_changed: true
  mug_shape_changed: true
  handle_geometry_drifted: true
  composition_changed: true
  logo_text_props_people_added: true
  lifestyle_scene_created: true
  over_sharpened: true
  material_drift_to_plastic_or_metal: true
  accepted_candidate_identity_lost: true
```

## Local Review Checklist

```yaml
local_review_checklist:
  handle_attachment_cleanup_checked: false
  rim_edge_cleanup_checked: false
  background_lift_checked: false
  bottom_shadow_checked: false
  matte_microtexture_checked: false
  forbidden_additions_checked: false
  sharpening_checked: false
  product_shape_checked: false
  material_identity_checked: false
  final_decision: pass | needs_rework | fail | not_reviewed
```

## Boundary Reminder

This criteria package does not authorize retouch execution, provider contact,
image generation, plugin calls, memory write, `accepted_samples/` write, or
`production_candidate_002` promotion.
