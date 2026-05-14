# v8.026 Second Product Prompt V2 Generation Authorization Gate

```yaml
phase: v8_026_second_product_prompt_v2_generation_authorization_gate
base_contract: AGENTS.md
mode: A5_authorization_record_gate
intent: remote_or_side_effectful_action
risk_level: R4
source_phase: v8_025_second_product_next_minimal_generation_authorization_decision_gate
source_commit: 6a2417802daa95cf05e611dd607183a374154011
selected_option: Option A
approved_product: multi_color_mesh_sports_visor
approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
authorization_record_only: true
provider_contact_performed_in_this_gate: false
image_generation_performed_in_this_gate: false
env_local_secret_value_read_in_this_gate: false
```

## Purpose

This gate records the owner's explicit selection of v8.025 Option A. It creates
a new, single-use A5 authorization for one prompt v2 minimal real generation
trial in v8.027. This is not an automatic retry and does not inherit the
consumed v8.020 / v8.021 authorization.

## Authorization Scope

```yaml
this_is_new_A5_authorization: true
previous_v8_020_authorization_consumed: true
retry_allowed_by_previous_authorization: false
approved_product: multi_color_mesh_sports_visor
approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
authorization_purpose:
  - validate_whether_prompt_v2_can_move_the_second_product_closer_to_accepted_candidate
  - validate_Route_B_multi_product_reuse
not_production_candidate_002: true
not_batch_generation: true
memory_write_allowed: false
```

## Execution Limits For v8.027

```yaml
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 1
auto_retry: false
stop_after_generation: true
human_review_required_after_generation: true
output_directory: runs/real_generation/v8_027_multi_color_mesh_sports_visor_v2_trial/
```

## Secret Handling Boundary

Only `scripts/run_native_doubao_image_generation.js` may read the necessary
Doubao image generation fields from the project-root `.env.local` during
v8.027 execution. Secret values may be used only for the one authorized provider
call / generation attempt.

```yaml
secret_value_printing_allowed: false
secret_value_recording_allowed: false
secret_value_copying_allowed: false
secret_value_committing_allowed: false
secret_value_logging_allowed: false
secret_value_docs_or_closeout_allowed: false
env_local_modification_allowed: false
env_local_stage_or_commit_allowed: false
```

## Hard Stop Conditions

```yaml
stop_if_prompt_package_path_differs: true
stop_if_runner_requires_extra_secret: true
stop_if_output_directory_differs: true
stop_if_provider_calls_would_exceed_one: true
stop_if_generation_attempts_would_exceed_one: true
stop_if_retry_required: true
stop_if_package_json_or_dependency_change_required: true
stop_if_DailyNote_or_VCP_memory_write_required: true
stop_if_production_candidate_002_required: true
```

## Non-Execution Boundary For This Gate

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
accepted_samples_written: false
dependency_change: false
package_json_modified: false
```

## Recommended Next

```yaml
phase: v8_027_second_product_prompt_v2_minimal_generation_trial_execution
auto_execution_allowed: true_after_this_gate_is_committed_and_pushed
purpose: perform exactly one authorized prompt v2 minimal real generation trial, then stop for human review or failure review
```
