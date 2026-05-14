# Final Retouch Action Package - Matte Ceramic Mug v4

```yaml
package_id: final_retouch_action_package_matte_ceramic_mug_v4
source_phase: v9_009_final_retouch_action_package_gate
source_decision_gate: v9_008_commercial_delivery_review_result_decision_gate
source_commit: f1f87ab3e5a82e22004da8f83d19e400ded5ae0f
selected_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
previous_review_result: needs_final_retouch
commercial_delivery_ready: false
memory_suitability: deferred
```

## Purpose

This package converts the v9.007 commercial delivery review finding into a
bounded final-retouch action list for a future retoucher or post-production
executor.

This is not a retouch execution. It does not edit the image, create a derivative
file, move or copy the source output, write `accepted_samples/`, write memory,
start `production_candidate_002`, or mark the asset as commercial delivery
ready.

## Source Asset Identity

```yaml
source_asset:
  selected_asset: ceramic_mug_v4
  product: matte_ceramic_mug
  source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
  source_asset_status: accepted_candidate_with_minor_retouch
  current_review_result: needs_final_retouch
  commercial_delivery_ready: false
  memory_suitability: deferred
```

The source output remains under ignored `runs/` and must be treated as a
reference. Do not copy it into this repository, move it, commit it, or create an
accepted sample without separate authorization.

## Review Result Lineage

```yaml
review_lineage:
  accepted_candidate_review:
    ref: reviews/v7_282_matte_ceramic_mug_v4_human_review.md
    result: accepted_candidate_with_minor_retouch
  delivery_readiness_package:
    ref: docs/delivery_readiness_package_matte_ceramic_mug_v4.md
  acceptance_criteria:
    ref: docs/delivery_readiness_acceptance_criteria_matte_ceramic_mug_v4.md
  commercial_delivery_review_plan:
    ref: docs/commercial_delivery_review_plan_matte_ceramic_mug_v4.md
  commercial_delivery_review_record:
    ref: reviews/v9_007_ceramic_mug_v4_commercial_delivery_review.md
    review_result: needs_final_retouch
```

## Retouch Objectives

```yaml
retouch_objectives:
  primary_goal: Move ceramic_mug_v4 closer to commercial delivery review readiness through local polish only.
  preserve_candidate_identity: true
  preserve_product_shape: true
  preserve_camera_angle_and_scale: true
  preserve_matte_cream_white_ceramic_material: true
  improve_local_polish: true
  commercial_delivery_ready_after_package: false
```

The retouch should make the image cleaner and more premium without changing the
core product, composition, or accepted-candidate identity.

## Exact Retouch Actions

```yaml
retouch_actions:
  handle_upper_attachment_cleanup:
    intent: Clean the slight dark and soft area near the upper handle attachment.
    action: Reduce local dirtiness, restore a smoother ceramic join, and keep the transition believable.
    avoid: Do not redraw the handle, change the handle silhouette, or create a hard artificial seam.

  handle_to_body_ceramic_continuity_refinement:
    intent: Make the handle-to-body connection read as real ceramic structure.
    action: Clarify local continuity and attachment realism while preserving v4 geometry.
    avoid: Do not thicken, shrink, detach, fuse, or reposition the handle.

  rim_edge_cleanup:
    intent: Preserve the clean cup rim and remove any remaining local roughness.
    action: Smooth only small edge inconsistencies while keeping the rim naturally photographed.
    avoid: Do not over-sharpen, double the rim, melt the rim, or change the cup opening.

  background_brightness_transparency_improvement:
    intent: Make the warm-gray background slightly brighter and more breathable.
    action: Lift background brightness and transparency subtly while preserving premium neutral tone.
    avoid: Do not switch scenes, create flat white background, add texture clutter, or change to lifestyle context.

  bottom_shadow_cleanup:
    intent: Make the product grounding cleaner and more premium.
    action: Soften and clean the contact shadow while keeping the mug anchored.
    avoid: Do not make the mug float, create a dark dirty base, or add reflective surface effects.

  subtle_matte_ceramic_microtexture_preservation:
    intent: Keep the cream-white matte ceramic surface believable.
    action: Preserve or lightly enhance subtle ceramic grain without adding visible noise.
    avoid: Do not make the mug plastic, metallic, glossy, glassy, speckled, or over-textured.

  overall_premium_ecommerce_polish:
    intent: Improve final product-image polish without changing identity.
    action: Balance cleanliness, contrast, and local edge confidence for premium ecommerce use.
    avoid: Do not create a new style, add props, change framing, or make the image look synthetic.
```

## Forbidden Edits

```yaml
forbidden_edits:
  change_cup_shape: true
  change_handle_structure: true
  replace_background_scene: true
  add_logo_text_props_people: true
  over_sharpen_edges: true
  shift_material_to_plastic_or_metal: true
  change_accepted_candidate_identity: true
  forbid_marking_current_image_as_commercial_ready: true
  create_new_generation: true
  write_accepted_samples: true
  move_or_copy_runs_output: true
```

## Before / After Acceptance Criteria

```yaml
before_state:
  source_asset_status: accepted_candidate_with_minor_retouch
  review_result: needs_final_retouch
  commercial_delivery_ready: false

after_retouch_candidate_may_pass_if:
  handle_upper_attachment_cleaner: true
  handle_to_body_continuity_more_ceramic_realistic: true
  rim_edge_clean_and_natural: true
  warm_gray_background_brighter_and_more_transparent: true
  bottom_shadow_cleaner_and_grounded: true
  matte_ceramic_microtexture_preserved: true
  ecommerce_polish_improved: true
  product_shape_unchanged: true
  handle_structure_unchanged: true
  no_logo_text_props_people: true
  no_over_sharpening: true
  no_material_drift: true

after_retouch_must_still_require:
  human_review: true
  commercial_delivery_ready_decision: separate_future_gate
  memory_write_authorization: separate_future_gate
  production_candidate_002_authorization: separate_future_gate
```

## Delivery Reviewer Checklist

```yaml
delivery_reviewer_checklist:
  source_asset_identity_confirmed: false
  retouched_asset_reference_confirmed_if_future_artifact_exists: false
  handle_upper_attachment_checked: false
  handle_to_body_continuity_checked: false
  rim_edge_checked: false
  background_brightness_transparency_checked: false
  bottom_shadow_checked: false
  matte_ceramic_microtexture_checked: false
  premium_ecommerce_polish_checked: false
  forbidden_edits_absent: false
  file_handling_policy_confirmed: false
  commercial_delivery_ready_not_inferred: false
  final_decision: pass_to_review | needs_rework | fail | not_reviewed
```

## File Handling Policy

```yaml
file_handling_policy:
  source_output_reference_only: true
  generated_output_remains_under_runs: true
  generated_output_remains_ignored: true
  copy_source_output: false
  move_source_output: false
  create_derivative_output_in_this_gate: false
  stage_source_output: false
  commit_source_output: false
  write_accepted_samples: false
  future_retouch_execution_requires_separate_authorization: true
  future_file_promotion_requires_separate_authorization: true
```

## Next Decision Gate

```yaml
recommended_next:
  phase: v9_010_final_retouch_execution_or_closeout_decision_gate
  auto_execution_allowed: false
  purpose: 人工决定是否进入真实修图执行规划、封存 first asset delivery lane，或转向 sports visor delivery readiness。
```
