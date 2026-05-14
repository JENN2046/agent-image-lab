# v8.020 Second Product Second Trial Authorization Gate

```yaml
phase: v8_020_second_product_second_trial_authorization_gate
base_contract: AGENTS.md
mode: A5 authorization record gate
intent: remote_or_side_effectful_action_authorization_record
risk_level: R4
source_phase: v8_019_second_product_second_trial_authorization_decision_gate
source_commit: e8bb77905cfd03e2e5ced9676810192885b2a558
```

## Decision

Human selected Option A from v8.019.

```yaml
selected_option: authorize_second_minimal_real_generation_trial
approved_product: multi_color_mesh_sports_visor
approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
output_directory: runs/real_generation/v8_021_multi_color_mesh_sports_visor_second_trial/
this_is_new_A5_authorization: true
previous_v8_015_authorization_consumed: true
retry_allowed_by_previous_authorization: false
```

This record does not perform provider contact, image generation, retry, or
`.env.local` reading. It only records the boundary for the next phase,
`v8_021_second_product_second_minimal_generation_trial_execution`.

## Prompt Mapping Preconditions

```yaml
canonical_prompt_field_required: true
prompt_field_present_after_v8_018: true
positive_prompt_retained_for_review: true
runner_canonical_prompt_field: prompt
```

## v8.021 Authorized Execution Boundary

```yaml
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 1
auto_retry: false
stop_after_generation: true
human_review_required_after_generation: true
provider_contact_authorized_for_v8_021_only: true
image_generation_authorized_for_v8_021_only: true
env_local_secret_value_read_authorized_for_v8_021_only: true
secret_value_printing_allowed: false
secret_value_recording_allowed: false
accepted_samples_write_allowed: false
runs_output_git_add_allowed: false
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
memory_write_path_allowed: false
production_candidate_002_allowed: false
Batch_005_allowed: false
```

## Stop Conditions

Stop before v8.021 if any of these are true:

- prompt package path differs from the approved path
- runner requires any additional secret, provider call, or output path
- output directory differs from the approved directory
- generation would require more than one provider call or one attempt
- retry becomes necessary
- worktree is dirty with unrelated changes
- `.env.local` would need to be printed, copied, modified, staged, or committed

## Recommended Next

```yaml
phase: v8_021_second_product_second_minimal_generation_trial_execution
auto_execution_allowed: true_after_v8_020_guarded_push
purpose: Perform one bounded real generation attempt using the approved prompt package and output directory.
```
