# Final Retouch Action Package - Multi-Color Mesh Sports Visor v8.033

```yaml
package_id: final_retouch_action_package_multi_color_mesh_sports_visor_v8_033
source_phase: v9_021_sports_visor_final_retouch_action_package_gate
source_decision_gate: v9_020_sports_visor_commercial_delivery_review_result_decision_gate
source_commit: 9f088d4aced2e09c2afbba161a84c68846f2c988
selected_asset: sports_visor_v8_033
selected_product: multi_color_mesh_sports_visor
source_output: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg
previous_review_result: needs_minor_retouch
commercial_delivery_ready: false
memory_suitability: deferred
```

## Purpose

This package converts the v9.019 commercial delivery review finding into a bounded minor-retouch action list for a future retoucher or post-production executor.

This is not retouch execution. It does not edit the image, create a derivative file, copy or move the source output, write `accepted_samples/`, write memory, start `production_candidate_002`, or mark the asset as commercial delivery ready.

## Source Asset Identity

```yaml
source_asset:
  selected_asset: sports_visor_v8_033
  selected_product: multi_color_mesh_sports_visor
  product_identity: open_top_multi_color_mesh_sports_visor
  source_output: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg
  source_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
  source_asset_status: accepted_candidate_with_minor_watch_items
  current_review_result: needs_minor_retouch
  commercial_delivery_ready: false
  memory_suitability: deferred
```

The source output remains under ignored `runs/` and must be treated as a reference. Do not copy it into this repository, move it, commit it, create a derivative image, or create an accepted sample without separate authorization.

## Review Result Lineage

```yaml
review_lineage:
  accepted_candidate_review:
    ref: reviews/v8_034_multi_color_mesh_sports_visor_v2_human_review.md
    result: accepted_candidate_with_minor_watch_items
  delivery_readiness_package:
    ref: docs/delivery_readiness_package_multi_color_mesh_sports_visor_v8_033.md
  acceptance_criteria:
    ref: docs/delivery_readiness_acceptance_criteria_multi_color_mesh_sports_visor_v8_033.md
  commercial_delivery_review_plan:
    ref: docs/commercial_delivery_review_plan_multi_color_mesh_sports_visor_v8_033.md
  commercial_delivery_review_record:
    ref: reviews/v9_019_sports_visor_v8_033_commercial_delivery_review.md
    review_result: needs_minor_retouch
  review_result_decision:
    ref: docs/v9_020_sports_visor_commercial_delivery_review_result_decision_gate.md
    selected_route: create_sports_visor_final_retouch_action_package
```

## Minor Retouch Objectives

```yaml
minor_retouch_objectives:
  primary_goal: Move sports_visor_v8_033 closer to commercial delivery review readiness through light local polish only.
  preserve_candidate_identity: true
  preserve_open_top_visor_identity: true
  preserve_multi_color_collection: true
  preserve_lifestyle_context: true
  improve_color_hierarchy_and_material_readability: true
  commercial_delivery_ready_after_package: false
```

The retouch should make the asset clearer and more campaign-ready without changing the product, scene, collection identity, or accepted-candidate status.

## Exact Retouch Actions

```yaml
retouch_actions:
  turquoise_pink_hero_color_balance:
    intent: Make the turquoise blue and soft pink hero colors read as the primary visual anchors.
    action: Slightly rebalance local color emphasis so turquoise leads and pink supports without oversaturation.
    avoid: Do not recolor the collection, remove secondary colors, or let black / navy become dominant.

  color_collection_hierarchy_cleanup:
    intent: Keep the full multi-color collection readable and intentional.
    action: Separate hero colors from support colors with subtle contrast and clarity cleanup.
    avoid: Do not remove deep navy, black, muted olive, or warm white support colors where applicable.

  mesh_and_stitching_clarity_refinement:
    intent: Improve premium tactile readability of mesh panels and stitched fabric edges.
    action: Clean small soft areas and clarify stitching lines only enough to read as fabric detail.
    avoid: Do not over-sharpen, add halo artifacts, or make stitching look printed or metallic.

  breathable_fabric_texture_preservation:
    intent: Preserve breathable sports fabric and mesh material.
    action: Maintain subtle fabric texture while reducing local muddiness.
    avoid: Do not make the visor look glossy, plastic, molded, metallic, or rubbery.

  urban_sports_lifestyle_context_preservation:
    intent: Keep the realistic urban sports lifestyle background as supportive context.
    action: Preserve the scene while gently reducing distractions that compete with the product.
    avoid: Do not replace the scene, convert it to studio-only, add people, or add props.

  background_not_overpowering_product:
    intent: Keep the product dominant in the frame.
    action: Slightly soften or de-emphasize high-distraction background areas while preserving realism.
    avoid: Do not blur the product, flatten the whole image, or make the background feel artificial.

  product_silhouette_and_open_top_structure_preservation:
    intent: Preserve the open-top visor silhouette and credible curved brim.
    action: Maintain crown opening, brim curve, side panel cues, and rear structure while cleaning minor edge softness.
    avoid: Do not change hat shape, close the open top, turn it into a baseball cap, or alter the collection layout.

  mild_ecommerce_polish_only:
    intent: Raise commercial polish without changing identity.
    action: Apply small cleanliness, contrast, and local readability improvements suitable for a product handoff.
    avoid: Do not create a new style, over-process the image, or infer commercial_delivery_ready.
```

## Forbidden Edits

```yaml
forbidden_edits:
  change_hat_structure: true
  change_open_top_visor_identity: true
  remove_multi_color_collection: true
  let_black_or_navy_become_dominant: true
  add_logo_text_or_people: true
  replace_scene: true
  over_sharpen_edges_or_texture: true
  shift_fabric_to_plastic_or_metal: true
  change_accepted_candidate_identity: true
  mark_current_image_as_commercial_delivery_ready: true
  create_new_generation: true
  write_accepted_samples: true
  move_or_copy_runs_output: true
```

## Before / After Acceptance Criteria

```yaml
before_state:
  source_asset_status: accepted_candidate_with_minor_watch_items
  review_result: needs_minor_retouch
  commercial_delivery_ready: false

after_retouch_candidate_may_pass_if:
  turquoise_pink_hero_balance_clearer: true
  color_collection_hierarchy_intentional: true
  mesh_and_stitching_more_readable: true
  breathable_fabric_texture_preserved: true
  urban_sports_lifestyle_context_preserved: true
  background_supports_product_not_overpowers: true
  product_silhouette_unchanged: true
  open_top_visor_structure_preserved: true
  mild_ecommerce_polish_improved: true
  no_logo_text_people: true
  no_scene_replacement: true
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
  turquoise_pink_hero_balance_checked: false
  color_collection_hierarchy_checked: false
  mesh_and_stitching_clarity_checked: false
  breathable_fabric_texture_checked: false
  urban_sports_lifestyle_context_checked: false
  background_distraction_checked: false
  open_top_visor_structure_checked: false
  curved_brim_shape_checked: false
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
  phase: v9_022_v9_delivery_readiness_layer_closeout_or_next_route_decision_gate
  auto_execution_allowed: false
  purpose: 人工决定是否封存 V9 delivery readiness layer，进入 V10 route selection，或继续补 sports visor retouch execution planning。
```
