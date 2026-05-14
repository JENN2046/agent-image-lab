# Real Retouch Execution Plan — Matte Ceramic Mug v4

```yaml
plan_id: real_retouch_execution_plan_matte_ceramic_mug_v4
phase: v9_011_real_retouch_execution_planning_gate
source_phase: v9_010_final_retouch_execution_or_closeout_decision_gate
source_commit: 4125dde4dfe9c2f936affbf9472cdc5a31248f12
selected_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
retouch_action_package_ref: docs/final_retouch_action_package_matte_ceramic_mug_v4.md
previous_review_result: needs_final_retouch
execution_authorization_required: true
real_retouch_execution_planning_created: true
real_retouch_execution_performed: false
image_editing_performed: false
derivative_image_created: false
commercial_delivery_ready: false
accepted_samples_written: false
memory_write_performed: false
production_candidate_002_started: false
```

## Execution Intent

The future retouch pass should move `ceramic_mug_v4` closer to commercial delivery review readiness without changing the accepted candidate identity.

The intended work is conservative: preserve the product, camera angle, composition, matte ceramic material, and warm-gray premium scene, then clean up the remaining retouch issues documented in v9.007 and v9.009.

## Required Inputs

```yaml
source_asset_reference: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
review_lineage:
  delivery_readiness_package: docs/delivery_readiness_package_matte_ceramic_mug_v4.md
  acceptance_criteria: docs/delivery_readiness_acceptance_criteria_matte_ceramic_mug_v4.md
  commercial_delivery_review: reviews/v9_007_ceramic_mug_v4_commercial_delivery_review.md
  final_retouch_action_package: docs/final_retouch_action_package_matte_ceramic_mug_v4.md
required_human_authorization_before_execution: true
```

The source file is referenced only. v9.011 does not read pixels for editing, create copies, or write derivatives.

## Output Artifact Policy

Future derivatives should be written only after a separate execution authorization. Suggested future output root:

```text
runs/retouch/v9_012_matte_ceramic_mug_v4_retouch/
```

Policy:

- The original `runs/real_generation/...jpg` file must remain unchanged.
- Future derivative files must be new files only.
- No overwrite is allowed.
- Derivatives remain ignored runtime artifacts unless a later promotion gate explicitly authorizes otherwise.
- `accepted_samples/` remains untouched.
- No production candidate or memory write is implied by creating a retouched derivative.

## Derivative Naming Policy

Recommended future names:

```text
ceramic_mug_v4_final_retouch_candidate_001.png
ceramic_mug_v4_final_retouch_candidate_001_review.md
```

If multiple derivatives are authorized later, increment the three-digit suffix. Do not encode private paths, secrets, tool names, or operator identities into filenames.

## Retouch Objectives

- Clean the handle upper attachment without changing the handle shape.
- Improve handle-to-body ceramic continuity so the joint reads as manufactured ceramic.
- Lightly clean the rim edge while preserving cup geometry.
- Brighten the warm-gray background and improve transparency without changing scene identity.
- Refine the bottom shadow so it remains premium, soft, and grounded.
- Preserve subtle matte ceramic microtexture without turning the surface plastic, metallic, glossy, or over-sharpened.
- Keep the accepted candidate identity stable.

## Forbidden Edits

- Do not change the cup silhouette or product scale.
- Do not redesign the handle.
- Do not replace the background scene.
- Do not add logo, text, props, people, decorative objects, or branding.
- Do not over-sharpen edges or add artificial halos.
- Do not change material identity from matte ceramic to plastic, metal, glass, or glossy porcelain.
- Do not mark the current image or future derivative as commercial delivery ready without human review.

## Future Execution Steps

1. Receive explicit authorization for real retouch execution and derivative creation.
2. Confirm the authorized source path matches `ceramic_mug_v4`.
3. Confirm the authorized output directory and derivative count.
4. Preserve the original generated image unchanged.
5. Perform the retouch actions listed in this plan.
6. Save derivative output using the approved naming policy.
7. Run final QA with a human reviewer.
8. Record the result in a separate review gate.
9. Stop before accepted_samples, memory, production candidate, or final delivery unless separately authorized.

## Human Approval Gate

Future execution must stop if the authorization does not explicitly name:

- `ceramic_mug_v4`
- The source output path
- The derivative output directory
- The maximum derivative output count
- Whether image editing is allowed
- Whether accepted_samples is forbidden or allowed
- Whether memory write is forbidden or allowed
- Whether production candidate promotion is forbidden or allowed
- The human reviewer
- The stop condition after execution

For the current lane, the safe default remains:

```yaml
accepted_samples_write_allowed: false
memory_write_allowed: false
production_candidate_002_allowed: false
commercial_delivery_ready_now: false
```

## Final QA Checklist

```yaml
handle_upper_attachment_cleanup: required
handle_to_body_ceramic_continuity: required
rim_edge_cleanup: required
background_brightness_transparency_improvement: required
bottom_shadow_cleanup: required
matte_ceramic_microtexture_preservation: required
no_product_shape_drift: required
no_logo_text_props_people: required
no_over_sharpening: required
no_material_drift: required
human_review_required: true
```

## Next Decision Gate

```yaml
recommended_next:
  phase: v9_012_real_retouch_execution_authorization_decision_gate
  auto_execution_allowed: false
  purpose: 人工决定是否授权真实修图执行、封存 ceramic_mug lane，或切换到 sports visor delivery readiness。
```
