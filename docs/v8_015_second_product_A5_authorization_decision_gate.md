# v8.015 Second Product A5 Authorization Decision Gate

```yaml
phase: v8_015_second_product_A5_authorization_decision_gate
base_contract: AGENTS.md
mode: A5_authorization_decision
intent: remote_or_side_effectful_action_authorization_package
risk_level: R4
source_commit: 4c7f4461089d0181e3c0f1172b7b31934b05632a
selected_option: Option A
selected_option_zh: 授权第二商品一次最小真实生成试跑
```

## Decision

The project owner explicitly selected Option A for the Route B second product.

```yaml
approved_product: multi_color_mesh_sports_visor
approved_prompt_package: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
approved_output_directory: runs/real_generation/v8_016_multi_color_mesh_sports_visor_trial/
approved_next_phase: v8_016_second_product_minimal_real_generation_trial_execution
```

This gate authorizes one controlled A5 trial for the second product prompt
package. It is not batch generation, not production candidate promotion, and
not memory writing.

## Authorized A5 Window

```yaml
provider_contact_allowed_once: true
image_generation_allowed_once: true
env_local_doubao_fields_read_by_existing_runner_once: true
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 1
auto_retry: false
stop_after_generation: true
human_review_required_after_generation: true
```

The existing project runner may read the project-root `.env.local` only for the
Doubao image generation fields needed by this single call. Secret values must
not be printed, copied, recorded in docs, committed, written to DailyNote, or
written to any VCP memory surface.

## Forbidden In This Authorization

```yaml
second_generation: false
auto_retry: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
accepted_samples_write: false
runs_output_added_to_git: false
package_json_change: false
dependency_change: false
git_add_dot: false
post_v8_017_execution: false
```

## Preflight Stop Conditions

Stop before v8.016 if any of these are true:

- the approved prompt package path does not exist or differs from the package above
- the output directory is outside `runs/real_generation/v8_016_multi_color_mesh_sports_visor_trial/`
- the runner requires extra secrets or an unapproved provider path
- execution would require more than one provider call, one generation attempt, or one output image
- provider output, secret values, raw payloads, or generated image files would be staged or committed

## Required v8.016 Closeout

The next phase must stop after one success or failure and hand off to human
review.

```yaml
recommended_next:
  phase: v8_017_human_review_of_second_product_first_real_output
  auto_execution_allowed: false
```

