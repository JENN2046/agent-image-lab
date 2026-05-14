# v9.003 Delivery Readiness Acceptance Criteria Gate

```yaml
phase: v9_003_delivery_readiness_acceptance_criteria_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_delivery_readiness_acceptance_criteria_gate
source_phase: v9_002_delivery_readiness_package_gate
source_commit: 3b178749d28fc38ecf2f3fff860b9d8a3d8c11fd
selected_route: delivery_readiness_layer
selected_asset: ceramic_mug_v4
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
memory_write: false
production_candidate_002: false
accepted_samples_write: false
```

## Purpose

This gate defines the acceptance criteria that `ceramic_mug_v4` must satisfy
before it can move from delivery readiness package into commercial delivery
review.

It does not create a final commercial deliverable, does not retouch the image,
does not copy or move the generated output, does not write memory, and does not
promote the asset into `production_candidate_002`.

## Selected Asset

```yaml
selected_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
current_asset_status: accepted_candidate_with_minor_retouch
target_status_after_future_review: commercial_delivery_review_ready
commercial_delivery_ready_now: false
memory_suitability: deferred
acceptance_criteria_created: true
```

## Acceptance Criteria Package

The detailed acceptance criteria are recorded in:

```yaml
acceptance_criteria_ref: docs/delivery_readiness_acceptance_criteria_matte_ceramic_mug_v4.md
delivery_readiness_package_ref: docs/delivery_readiness_package_matte_ceramic_mug_v4.md
retouch_acceptance_criteria_ref: docs/retouch_acceptance_criteria_matte_ceramic_mug_v4.md
delivery_package_spec_ref: docs/delivery_package_spec_matte_ceramic_mug_v4.md
```

The new V9 criteria package narrows the handoff from "accepted candidate with
minor retouch" into a reviewable set of pass / needs_retouch / reject standards.
It preserves the V8 retouch criteria but adds a delivery-readiness decision
surface and file-handling policy.

## Decision Standards

```yaml
decision_standards:
  pass:
    meaning: Candidate or future retouched derivative satisfies all required delivery-readiness criteria and may enter commercial delivery review.
    resulting_status: commercial_delivery_review_ready
    commercial_delivery_ready: false
    human_approval_required: true

  needs_retouch:
    meaning: Candidate remains directionally useful but still needs bounded local retouch before commercial delivery review.
    resulting_status: accepted_candidate_with_minor_retouch
    commercial_delivery_ready: false

  reject:
    meaning: Candidate or derivative fails product identity, material, composition, or forbidden-content checks.
    resulting_status: not_ready_for_delivery_review
    commercial_delivery_ready: false
```

## Required Coverage

The criteria cover:

- handle attachment cleanup;
- rim edge cleanup;
- background brightness and transparency improvement;
- bottom shadow refinement;
- matte ceramic microtexture preservation;
- no product shape drift;
- no over-sharpening;
- no plastic or metallic material drift;
- no logo, text, props, or people;
- file remains outside Git unless separately authorized;
- commercial delivery review requires human approval.

## Retouch Completion Checklist

```yaml
retouch_completion_checklist:
  handle_attachment_cleanup_passed: false
  rim_edge_cleanup_passed: false
  background_brightness_transparency_passed: false
  bottom_shadow_refinement_passed: false
  matte_ceramic_microtexture_preserved: false
  no_product_shape_drift_confirmed: false
  no_over_sharpening_confirmed: false
  no_material_drift_confirmed: false
  forbidden_content_absent: false
  human_review_decision_recorded: false
```

## Commercial Delivery Review Preconditions

```yaml
commercial_delivery_review_preconditions:
  source_asset_identity_confirmed: true
  delivery_readiness_package_exists: true
  acceptance_criteria_exists: true
  future_review_must_apply_pass_needs_retouch_reject_taxonomy: true
  human_reviewer_required: true
  commercial_delivery_ready_now: false
  production_candidate_002_requires_separate_authorization: true
  memory_write_requires_separate_authorization: true
```

## File Handling Policy

```yaml
file_handling_policy:
  source_output_reference_only: true
  output_image_remains_ignored: true
  copy_output_image: false
  move_output_image: false
  stage_output_image: false
  commit_output_image: false
  accepted_samples_written: false
  future_derivative_requires_separate_retouched_asset_policy: true
```

The `runs/` output path is referenced only as evidence. This phase does not add,
copy, move, transform, stage, or commit the generated image.

## Not Allowed

```yaml
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
secret_value_printed: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
accepted_samples_write: false
production_candidate_002: false
Batch_005: false
runtime_CDP_bridge_MCP: false
dependency_change: false
package_json_modified: false
commercial_delivery_execution: false
```

## Next Decision Gate

Recommended next:

```yaml
phase: v9_004_delivery_readiness_review_or_closeout_decision_gate
auto_execution_allowed: false
purpose: 人工决定 ceramic_mug_v4 是否进入 commercial delivery review、继续补交付材料，或封存 V9 第一资产包。
```

## Closeout

```yaml
closeout:
  phase: v9_003_delivery_readiness_acceptance_criteria_gate
  source_commit: 3b178749d28fc38ecf2f3fff860b9d8a3d8c11fd
  selected_asset: ceramic_mug_v4
  source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
  current_asset_status: accepted_candidate_with_minor_retouch
  acceptance_criteria_created: true
  commercial_delivery_ready: false
  memory_suitability: deferred
  output_image_added_to_git: false
  accepted_samples_written: false
  memory_write_performed: false
  production_candidate_002_started: false
  provider_contact: false
  image_generation: false
  retry: false
  next_phase_started: false
```
