# Delivery Readiness Acceptance Criteria - Matte Ceramic Mug v4

```yaml
criteria_id: delivery_readiness_acceptance_criteria_matte_ceramic_mug_v4
source_phase: v9_003_delivery_readiness_acceptance_criteria_gate
source_commit: 3b178749d28fc38ecf2f3fff860b9d8a3d8c11fd
selected_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
current_asset_status: accepted_candidate_with_minor_retouch
target_status_after_future_review: commercial_delivery_review_ready
commercial_delivery_ready_now: false
memory_suitability: deferred
acceptance_criteria_created: true
```

## Purpose

This document defines how `ceramic_mug_v4` should be judged before it can enter
commercial delivery review. It is a delivery-readiness acceptance standard only.
It does not execute retouching, generate a new image, move files, write memory,
or promote the asset to production.

## Decision Taxonomy

```yaml
decision_taxonomy:
  pass:
    meaning: All required criteria pass; the asset may enter commercial delivery review.
    target_status: commercial_delivery_review_ready
    commercial_delivery_ready_now: false
    human_approval_required: true

  needs_retouch:
    meaning: The asset remains an accepted candidate but still needs bounded cleanup before commercial delivery review.
    target_status: accepted_candidate_with_minor_retouch
    commercial_delivery_ready_now: false

  reject:
    meaning: Product identity, material, composition, or forbidden-content checks fail.
    target_status: not_ready_for_delivery_review
    commercial_delivery_ready_now: false
```

`pass` means ready for a future commercial delivery review, not final delivery
approval. Final commercial delivery still requires a separate human review
decision.

## Required Pass Criteria

```yaml
required_pass_criteria:
  handle_attachment_cleanup:
    required: true
    pass: Upper and lower handle joins look clean, natural, and ceramic-realistic.
    needs_retouch: Handle joins improve but still show slight softness or local dark dirt.
    reject: Handle has blocky notch, cutout, dent, broken joint, fused geometry, or impossible connection.

  rim_edge_cleanup:
    required: true
    pass: Cup rim is continuous, smooth, clean, and ceramic-like.
    needs_retouch: Rim is mostly clean but has a small local rough edge.
    reject: Rim is jagged, melted, over-sharpened, doubled, or structurally inconsistent.

  background_brightness_transparency_improvement:
    required: true
    pass: Warm-gray background is brighter, more transparent, and still premium.
    needs_retouch: Background is improved but still slightly heavy or muddy.
    reject: Background becomes flat white, noisy, too dark, too busy, or style-breaking.

  bottom_shadow_refinement:
    required: true
    pass: Bottom contact shadow is soft, clean, grounded, and not dirty.
    needs_retouch: Shadow is directionally correct but slightly heavy or uneven.
    reject: Mug appears floating, cut out, smeared, or anchored by a dark dirty patch.

  matte_ceramic_microtexture_preservation:
    required: true
    pass: Cream-white matte ceramic texture remains subtle, premium, and believable.
    needs_retouch: Texture is preserved but too conservative or slightly flat.
    reject: Surface becomes noisy, glossy, plastic, metallic, glassy, or speckled.

  no_product_shape_drift:
    required: true
    pass: Mug body, handle silhouette, camera angle, scale, and composition remain recognizably v4.
    needs_retouch: No shape drift, but one local edge still needs cleanup.
    reject: Product proportions, handle position, mug silhouette, or main composition changes.

  no_over_sharpening:
    required: true
    pass: Edges are clean without halos, brittle contrast, or crunchy texture.
    needs_retouch: One edge is slightly crisp but still natural.
    reject: Rim, handle, or body shows visible sharpening halos or brittle outlines.

  no_plastic_or_metallic_material_drift:
    required: true
    pass: Material still reads as matte cream-white ceramic.
    needs_retouch: Material is slightly flat but still ceramic.
    reject: Material reads as plastic, metallic, glossy porcelain, glass, enamel, or resin.

  no_logo_text_props_people:
    required: true
    pass: No logo, text, props, people, hands, extra objects, or lifestyle scene are present.
    needs_retouch: Not applicable; any forbidden addition fails.
    reject: Any logo, text, prop, person, hand, extra object, or lifestyle scene appears.

  file_outside_git:
    required: true
    pass: Source output remains under ignored `runs/` and is not copied, moved, staged, or committed.
    needs_retouch: Not applicable; file handling violation blocks review.
    reject: Source output or generated image is staged, committed, moved into `accepted_samples/`, or promoted without separate authorization.

  human_approval_required:
    required: true
    pass: Human reviewer records the delivery-readiness decision.
    needs_retouch: Human reviewer records bounded remaining issues.
    reject: Human reviewer rejects due to product, material, composition, artifact, or boundary failure.
```

## Retouch Completion Checklist

```yaml
retouch_completion_checklist:
  source_asset_identity_confirmed: false
  handle_upper_attachment_cleaned: false
  handle_lower_attachment_cleaned: false
  handle_body_join_realism_confirmed: false
  rim_edge_cleanup_confirmed: false
  background_brightness_transparency_confirmed: false
  bottom_shadow_refinement_confirmed: false
  matte_ceramic_microtexture_preserved: false
  product_shape_drift_absent: false
  over_sharpening_absent: false
  material_drift_absent: false
  logo_text_props_people_absent: false
  file_handling_policy_confirmed: false
  human_review_decision_recorded: false
  final_decision: pass | needs_retouch | reject | not_reviewed
```

## Commercial Delivery Review Preconditions

```yaml
commercial_delivery_review_preconditions:
  selected_asset: ceramic_mug_v4
  source_output_confirmed: true
  delivery_readiness_package_created: true
  acceptance_criteria_created: true
  pass_decision_required_before_review: true
  human_review_required: true
  commercial_delivery_ready_now: false
  memory_suitability: deferred
  accepted_samples_written: false
  memory_write_performed: false
  production_candidate_002_started: false
```

The next review may only consider `commercial_delivery_review_ready` if every
required pass criterion is satisfied and a human reviewer records the decision.

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
  future_file_promotion_requires_separate_authorization: true
```

## Human Review Checklist

```yaml
human_review_checklist:
  reviewer_confirms_selected_asset: false
  reviewer_checks_source_lineage: false
  reviewer_checks_handle_attachment: false
  reviewer_checks_rim_edge: false
  reviewer_checks_background_brightness: false
  reviewer_checks_bottom_shadow: false
  reviewer_checks_microtexture: false
  reviewer_checks_product_shape: false
  reviewer_checks_material_identity: false
  reviewer_checks_forbidden_content: false
  reviewer_checks_file_handling_boundary: false
  reviewer_records_pass_needs_retouch_or_reject: false
```

## Not Allowed Boundary

```yaml
not_allowed:
  provider_contact_allowed: false
  image_generation_allowed: false
  retry_allowed: false
  env_local_secret_value_read_allowed: false
  secret_value_print_allowed: false
  DailyNote_write_allowed: false
  VCP_memory_write_allowed: false
  memory_write_path_allowed: false
  accepted_samples_write_allowed: false
  production_candidate_002_allowed: false
  Batch_005_allowed: false
  runtime_CDP_bridge_MCP_allowed: false
  dependency_change_allowed: false
  package_json_modification_allowed: false
  commercial_delivery_execution_allowed: false
```

## Next Decision Gate

```yaml
recommended_next:
  phase: v9_004_delivery_readiness_review_or_closeout_decision_gate
  auto_execution_allowed: false
  purpose: 人工决定 ceramic_mug_v4 是否进入 commercial delivery review、继续补交付材料，或封存 V9 第一资产包。
```
