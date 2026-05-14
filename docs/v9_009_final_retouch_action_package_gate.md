# v9.009 Final Retouch Action Package Gate

```yaml
phase: v9_009_final_retouch_action_package_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_final_retouch_action_package_gate
source_phase: v9_008_commercial_delivery_review_result_decision_gate
source_commit: f1f87ab3e5a82e22004da8f83d19e400ded5ae0f
selected_asset: ceramic_mug_v4
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
memory_write: false
production_candidate_002: false
accepted_samples_write: false
real_commercial_delivery_execution: false
commercial_delivery_ready: false
image_editing_performed: false
image_file_move_or_copy: false
```

## Purpose

This gate records the human-selected v9.008 Option B and creates a docs-only
final retouch action package for `ceramic_mug_v4`.

It translates the v9.007 `needs_final_retouch` review result into bounded,
actionable instructions for a future human retoucher or post-production
executor. It does not modify the image, create a derivative, move or copy the
source output, write memory, write `accepted_samples/`, start
`production_candidate_002`, or execute real commercial delivery.

## Source Asset Identity

```yaml
selected_asset: ceramic_mug_v4
product: matte_ceramic_mug
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
source_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
source_human_review: reviews/v7_282_matte_ceramic_mug_v4_human_review.md
commercial_delivery_review_record: reviews/v9_007_ceramic_mug_v4_commercial_delivery_review.md
previous_review_result: needs_final_retouch
commercial_delivery_ready: false
memory_suitability: deferred
```

The source image path is a reference only. This gate does not copy, move, stage,
commit, edit, export, or otherwise transform the `runs/` output.

## Review Result Lineage

```yaml
lineage:
  v7_281_generation:
    output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
    result: success
    output_added_to_git: false
  v7_282_human_review:
    asset_status: accepted_candidate_with_minor_retouch
    commercial_delivery_ready: false
    memory_suitability: deferred
  v9_007_commercial_delivery_review:
    review_result: needs_final_retouch
    commercial_delivery_ready: false
  v9_008_result_decision:
    selected_route: create_final_retouch_action_package
```

## Package Created

```yaml
final_retouch_action_package_created: true
final_retouch_action_package_ref: docs/final_retouch_action_package_matte_ceramic_mug_v4.md
image_editing_performed: false
retouched_output_created: false
commercial_delivery_ready: false
accepted_samples_written: false
memory_write_performed: false
production_candidate_002_started: false
```

## Required Retouch Coverage

The retouch action package must cover:

- `handle upper attachment cleanup`
- `handle-to-body ceramic continuity refinement`
- `rim edge cleanup`
- `background brightness / transparency improvement`
- `bottom shadow cleanup`
- `subtle matte ceramic microtexture preservation`
- `overall premium ecommerce polish`

## Boundary

```yaml
not_allowed:
  modify_source_image: false
  copy_source_image: false
  move_source_image: false
  create_derivative_image: false
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
  runs_output_committed: false
  real_commercial_delivery_execution: false
  commercial_delivery_ready_true: false
```

## Next Decision

```yaml
recommended_next:
  phase: v9_010_final_retouch_execution_or_closeout_decision_gate
  auto_execution_allowed: false
  purpose: 人工决定是否进入真实修图执行规划、封存 first asset delivery lane，或转向 sports visor delivery readiness。
```

## Closeout

```yaml
closeout:
  phase: v9_009_final_retouch_action_package_gate
  source_commit: f1f87ab3e5a82e22004da8f83d19e400ded5ae0f
  selected_asset: ceramic_mug_v4
  source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
  previous_review_result: needs_final_retouch
  final_retouch_action_package_created: true
  commercial_delivery_ready: false
  memory_suitability: deferred
  output_image_added_to_git: false
  accepted_samples_written: false
  memory_write_performed: false
  production_candidate_002_started: false
  provider_contact: false
  image_generation: false
  retry: false
  real_commercial_delivery_execution: false
  next_phase_started: false
```
