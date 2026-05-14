# Delivery Package Spec - Matte Ceramic Mug v4

```yaml
package_id: delivery_package_spec_matte_ceramic_mug_v4
source_phase: v8_002_retouch_acceptance_criteria_or_delivery_package_gate
current_best_candidate: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
retouch_plan_ref: docs/final_retouch_plan_matte_ceramic_mug_v4.md
acceptance_criteria_ref: docs/retouch_acceptance_criteria_matte_ceramic_mug_v4.md
commercial_delivery_ready: false
memory_suitability: deferred
```

## Purpose

This package defines the paper structure for a future delivery review of the v4
matte ceramic mug candidate after retouch. It does not create a deliverable image
and does not promote the candidate to `accepted_samples/` or
`production_candidate_002`.

## Delivery Package Fields

```yaml
delivery_package:
  package_id:
    type: string
    required: true

  source_candidate_path:
    type: string
    required: true
    value: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg

  retouched_asset_ref:
    type: string
    required: false
    note: "Only filled by a future authorized retouch handoff or review gate."

  source_asset_status:
    type: string
    required: true
    value: accepted_candidate_with_minor_retouch

  target_review_status:
    type: string
    required: true
    value: commercial_delivery_review_candidate

  retouch_plan_ref:
    type: string
    required: true
    value: docs/final_retouch_plan_matte_ceramic_mug_v4.md

  acceptance_criteria_ref:
    type: string
    required: true
    value: docs/retouch_acceptance_criteria_matte_ceramic_mug_v4.md

  human_reviewer:
    type: string
    required: false

  review_decision:
    type: string
    enum: [not_reviewed, pass, needs_rework, fail]
    required: true

  commercial_delivery_ready:
    type: boolean
    required: true
    default: false

  memory_suitability:
    type: string
    enum: [yes, no, deferred]
    required: true
    value: deferred
```

## Pre-Delivery Human Review Checklist

```yaml
pre_delivery_human_review:
  source_candidate_identity_preserved: false
  handle_attachment_cleanup_passed: false
  rim_edge_cleanup_passed: false
  background_brightness_passed: false
  bottom_shadow_passed: false
  matte_ceramic_microtexture_passed: false
  no_logo_text_props_people_passed: false
  no_over_sharpening_passed: false
  no_product_shape_drift_passed: false
  no_material_drift_passed: false
  delivery_package_fields_complete: false
  human_decision_recorded: false
```

## Delivery Readiness Rules

```yaml
delivery_readiness_rules:
  pass_requires_all_required_checks: true
  needs_rework_blocks_commercial_delivery_ready: true
  fail_blocks_commercial_delivery_ready: true
  memory_deferred_does_not_block_delivery_review: true
  memory_write_requires_independent_authorization: true
  production_candidate_002_requires_independent_authorization: true
```

## Non-Delivery Conditions

The package must remain `commercial_delivery_ready: false` if any of these are
true:

- retouched asset does not exist;
- product identity is not confirmed;
- handle/body join remains visibly weak;
- background or shadow still looks unpolished;
- material identity drifts from matte ceramic;
- logo, text, props, people, or lifestyle context appears;
- human decision is missing;
- production candidate promotion is being inferred rather than authorized.

## Explicit Non-Authorization

```yaml
image_generation: false
provider_contact: false
plugin_call: false
retry: false
DailyNote_write: false
VCP_memory_write: false
accepted_samples_write: false
runs_output_git_add: false
production_candidate_002: false
Batch_005: false
runtime_execution: false
```
