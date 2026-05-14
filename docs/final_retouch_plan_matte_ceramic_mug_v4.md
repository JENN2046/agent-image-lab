# Final Retouch Plan - Matte Ceramic Mug v4

```yaml
plan_id: final_retouch_plan_matte_ceramic_mug_v4
source_phase: v8_001_final_retouch_planning_gate
source_route: final_retouch_planning
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
asset_status: accepted_candidate_with_minor_retouch
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
```

## Current Image Quality Summary

The v4 matte ceramic mug output is the current best candidate from the V7 product
loop. It preserves the successful product scale and composition from v2, restores
handle credibility after the v3 regression, keeps a clean warm-gray ecommerce
main-image direction, and maintains a believable cream-white matte ceramic
surface. It remains below commercial delivery ready because several local polish
areas still need final retouch direction.

Known strengths:

- Product scale and centered composition are suitable for an ecommerce main image.
- The cup rim is cleaner than earlier trials.
- The handle structure is much more credible than v3.
- The warm-gray background feels more premium than the first trial.
- The visible matte ceramic identity is preserved.
- The obvious colored-speck issue is mostly resolved.

Remaining issues:

- Upper handle attachment has slight dark and soft contamination.
- Handle/body join needs stronger real ceramic structure.
- Background is slightly dark and can be more transparent.
- Body microtexture is conservative and can carry a little more premium ceramic grain.
- Bottom contact shadow can be cleaner and more refined.

## Final Retouch Objective

Move the v4 accepted candidate from `accepted_candidate_with_minor_retouch`
toward `commercial_delivery_ready_candidate` through local polish only. The
retouch should improve credibility, cleanliness, and delivery readiness without
changing the product identity, composition, or accepted-candidate status.

This is a retouch instruction package, not an image-editing operation.

## Local Retouch Item List

1. Clean the upper handle attachment:
   - reduce the slight dark dirty patch;
   - sharpen only the structural boundary that should read as ceramic;
   - keep the transition soft enough to remain naturally photographed.

2. Refine handle/body realism:
   - clarify the attachment geometry;
   - avoid a pasted-on handle look;
   - preserve the v4 handle silhouette and orientation.

3. Lift background transparency:
   - slightly brighten the warm-gray background;
   - preserve the premium neutral tone;
   - avoid making the scene flat white or sterile.

4. Add subtle ceramic microtexture:
   - introduce very light premium ceramic grain on the body;
   - keep the surface matte and cream-white;
   - avoid visible noise, speckles, plastic sheen, or metallic reflection.

5. Refine bottom shadow:
   - clean the contact shadow edge;
   - keep the mug grounded;
   - avoid a floating product look or heavy dark base.

## Do Not Change

- Do not change the product.
- Do not alter the mug's basic shape.
- Do not change the main composition or product scale.
- Do not add logo, text, props, people, or lifestyle context.
- Do not turn the image into a lifestyle scene.
- Do not over-sharpen rim, handle, or body edges.
- Do not make the ceramic look plastic, glass, or metal.
- Do not change the accepted-candidate identity of v4.
- Do not create a fifth generation.
- Do not write or move the output into `accepted_samples/`.

## Retouch Acceptance Criteria

```yaml
retouch_acceptance_criteria:
  handle_attachment_cleaner: true
  handle_body_join_more_realistic: true
  background_slightly_lifted: true
  matte_ceramic_identity_preserved: true
  body_microtexture_subtle: true
  bottom_shadow_cleaner: true
  product_identity_unchanged: true
  composition_unchanged: true
  no_logo_text_props_people: true
  no_lifestyle_scene: true
  no_plastic_or_metal_shift: true
```

## Pre-Delivery Checklist

```yaml
pre_delivery_checklist:
  source_candidate_path_recorded: true
  retouch_targets_named: true
  forbidden_changes_named: true
  commercial_delivery_ready_before_retouch: false
  fifth_generation_required: false
  provider_contact_required: false
  plugin_call_required: false
  memory_write_required: false
  production_candidate_002_required_now: false
```

Before commercial delivery, a future review gate should confirm whether a
retouched artifact exists, whether it preserves v4 identity, and whether the
result can move from `accepted_candidate_with_minor_retouch` to a stronger
delivery status.

## Why No Fifth Generation Is Needed

A fifth generation is not the best next move because the open issues are local
polish issues, not broad prompt-discovery issues. v4 already solved the main
structure regression from v3 and preserves the strongest composition direction.
Another provider call could regress product shape, handle geometry, background,
or material identity. Final retouch planning has lower risk and higher immediate
delivery value.

## Why No Memory Write Is Performed

Memory suitability remains `deferred`. The project has useful lessons from v1-v4,
but this phase does not write DailyNote, VCP memory, or any memory delta. A future
memory planning or memory authorization gate must separately decide whether the
loop is suitable for memory and what sanitized Chinese summary would be allowed.

## Recommended Next

```yaml
recommended_next:
  phase: v8_002_retouch_acceptance_criteria_or_delivery_package_gate
  purpose: "定义修图验收标准或交付包，不生成新图。"
  auto_execution_allowed: false
```
