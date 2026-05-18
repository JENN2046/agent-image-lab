# v9.011 Real Retouch Execution Planning Gate

```yaml
phase: v9_011_real_retouch_execution_planning_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_real_retouch_execution_planning_gate
source_phase: v9_010_final_retouch_execution_or_closeout_decision_gate
source_commit: 4125dde4dfe9c2f936affbf9472cdc5a31248f12
selected_route: delivery_readiness_layer
selected_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
previous_review_result: needs_final_retouch
final_retouch_action_package_created: true
real_retouch_execution_planning_created: true
real_retouch_execution_performed: false
image_editing_performed: false
derivative_image_created: false
commercial_delivery_ready: false
memory_suitability: deferred
accepted_samples_written: false
memory_write_performed: false
production_candidate_002_started: false
```

## Purpose

v9.011 records how a future real retouch execution could be authorized and controlled for `ceramic_mug_v4`.

This gate does not perform retouching. It does not edit, copy, move, stage, or commit the generated image. It only converts the v9.009 final retouch action package into an execution plan that can be reviewed before any future image-editing authorization.

## Input Asset Reference

```yaml
selected_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
retouch_action_package_ref: docs/final_retouch_action_package_matte_ceramic_mug_v4.md
previous_review_result: needs_final_retouch
commercial_delivery_ready: false
memory_suitability: deferred
```

The source image remains an ignored runtime artifact. This phase records the path as evidence only and does not copy or move the file.

## Output Artifact Policy

A future retouch execution must use a separately authorized derivative output directory. Suggested future location:

```text
runs/retouch/v9_012_matte_ceramic_mug_v4_retouch/
```

That directory is not created by v9.011. Any future derivative file must remain outside Git unless a later task explicitly authorizes file promotion. The original generated output must remain unchanged.

## Derivative File Naming Policy

Future derivative files should use deterministic, reviewable names:

```text
ceramic_mug_v4_final_retouch_candidate_001.png
ceramic_mug_v4_final_retouch_candidate_001_review.md
```

Rules:

- Include the selected asset id.
- Include `final_retouch_candidate`.
- Use a three-digit sequence number.
- Never overwrite an existing derivative.
- Keep sidecar review records separate from image binaries.

## Planned Retouch Execution Steps

1. Verify that a separate human authorization explicitly allows real retouch execution, image editing, derivative file creation, and the exact output directory.
2. Verify the source image path and confirm the original generated image will not be modified.
3. Create the authorized derivative output directory only in the future execution phase.
4. Apply only the approved retouch actions: handle upper attachment cleanup, handle-to-body ceramic continuity refinement, rim edge cleanup, brighter warm-gray background, cleaner bottom shadow, subtle matte ceramic microtexture preservation, and overall premium ecommerce polish.
5. Save one or more authorized derivative candidates using the naming policy, without overwriting existing files.
6. Run human QA against the final checklist before any delivery, accepted_samples, memory, or production decision.
7. Record the future execution result in a separate review or decision gate.

## Human Approval Gate

Real retouch execution requires a new explicit authorization package before any image file is edited or created.

Minimum future authorization fields:

```yaml
target_asset: ceramic_mug_v4
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
allowed_operation: real_retouch_execution
allowed_output_directory: runs/retouch/v9_012_matte_ceramic_mug_v4_retouch/
max_derivative_outputs:
overwrite_existing_files_allowed: false
accepted_samples_write_allowed: false
memory_write_allowed: false
production_candidate_002_allowed: false
reviewer:
stop_after_execution: true
```

If any field is missing, ambiguous, or broader than the ceramic mug retouch task, execution must not start.

## Final QA Checklist

- Handle upper attachment looks clean and continuous.
- Handle-to-body joint reads as real ceramic, not dented, fused, cut out, or blocky.
- Cup rim stays clean without shape drift.
- Background is brighter and more transparent while staying warm-gray and premium.
- Bottom shadow is soft, controlled, and not muddy.
- Matte ceramic microtexture is preserved without plastic or metallic material drift.
- Product scale, angle, and identity remain consistent with the accepted candidate.
- No logo, text, people, props, or new scene elements are introduced.
- No over-sharpening, halo, or artificial edge artifacts are introduced.
- Output files remain outside Git unless later authorized.

## Forbidden Operations

```yaml
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
secret_value_printed: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
accepted_samples_written: false
runs_output_committed: false
image_editing_performed: false
derivative_image_created: false
real_commercial_delivery_execution: false
commercial_delivery_ready: false
```

## Next Decision Gate

```yaml
recommended_next:
  phase: v9_012_real_retouch_execution_authorization_decision_gate
  auto_execution_allowed: false
  purpose: 人工决定是否授权真实修图执行、封存 ceramic_mug lane，或切换到 sports visor delivery readiness。
final_state:
  next_phase_started: false
```

## Closeout

```yaml
closeout:
  phase: v9_011_real_retouch_execution_planning_gate
  source_commit: 4125dde4dfe9c2f936affbf9472cdc5a31248f12
  selected_asset: ceramic_mug_v4
  source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
  previous_review_result: needs_final_retouch
  final_retouch_action_package_created: true
  real_retouch_execution_planning_created: true
  real_retouch_execution_performed: false
  derivative_image_created: false
  commercial_delivery_ready: false
  accepted_samples_written: false
  memory_write_performed: false
  production_candidate_002_started: false
```
