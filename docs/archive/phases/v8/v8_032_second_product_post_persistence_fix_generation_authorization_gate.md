# v8.032 Second Product Post Persistence Fix Generation Authorization Gate

```yaml
phase: v8_032_second_product_post_persistence_fix_generation_authorization_gate
base_contract: AGENTS.md
mode: A5_authorization_record_gate
intent: authorization_record
risk_level: R4
source_phase: v8_031_second_product_retry_after_persistence_fix_decision_gate
source_commit: 9c457d991b2e6e1159f5e5d652943ee0c81d8fbb
```

## 中文说明

本阶段只记录新的单次 A5 授权边界。它不调用 provider，不生成图片，不读取 `.env.local`。

## Authorization

```yaml
this_is_new_A5_authorization: true
not_an_automatic_retry: true
does_not_inherit_v8_020_or_v8_027_authorization: true
approved_product: multi_color_mesh_sports_visor
approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
output_directory: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 1
auto_retry: false
stop_after_generation: true
human_review_required_after_generation: true
success_requires_verified_local_file: true
```

## Purpose

```yaml
purpose:
  - verify_runner_splits_provider_success_from_local_persistence_success
  - verify_prompt_v2_can_produce_a_real_local_reviewable_image
not_for:
  - production_candidate_002
  - batch_generation
  - memory_write
```

## v8.033 Execution Boundary

Only after this v8.032 authorization gate is committed and pushed, v8.033 may perform exactly one bounded execution:

```yaml
provider_contact_allowed_in_v8_033: true
image_generation_allowed_in_v8_033: true
env_local_secret_value_read_allowed_in_v8_033: true
env_reader: scripts/run_native_doubao_image_generation.js
secret_use_limit: one_provider_call_one_generation_attempt
secret_value_printed: false
secret_value_recorded: false
secret_value_committed: false
```

Success in v8.033 requires:

```yaml
local_files_verified_count_must_be_greater_than_zero: true
output_files_must_reference_existing_local_image: true
human_review_required_now_requires_local_file_verification: true
```

## Forbidden

```yaml
second_provider_call: false
retry: false
next_generation: false
switch_prompt_package: false
switch_product: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
runtime_CDP_bridge_MCP: false
accepted_samples_write: false
output_image_added_to_git: false
dependency_change: false
package_json_modified: false
git_add_dot: false
```

## v8.032 Boundary Confirmation

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
runs_output_committed: false
```

## Recommended Next

```yaml
phase: v8_033_second_product_post_persistence_fix_minimal_generation_trial_execution
auto_execution_allowed: true_after_v8_032_commit_and_guarded_push
purpose: Execute exactly one bounded provider call and image generation attempt, then stop.
```
