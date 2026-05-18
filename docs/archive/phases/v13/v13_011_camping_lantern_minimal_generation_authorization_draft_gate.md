# v13.011 Camping Lantern Minimal Generation Authorization Draft Gate

```yaml
phase: v13_011_camping_lantern_minimal_generation_authorization_draft_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R2
source_phase: v13_010_premium_portable_led_camping_lantern_A5_authorization_decision_gate
source_commit: 7d6b16ab0baf54f95e7a05f3dc8395aef3061651
human_selected_option: authorize_one_minimal_real_generation_trial_later
commit_message: "docs: draft camping lantern minimal generation authorization"
```

## Purpose

This gate drafts a minimal A5 authorization package for a future one-shot real
generation trial of `premium_portable_led_camping_lantern`.

This phase is not provider execution, not image generation, and not execution
confirmation. It does not call a provider, read `.env.local`, create the
proposed output directory, create images, write memory, enter production, create
accepted samples, execute retouch, or execute delivery.

Future real execution must pass a separate
`v13_012_camping_lantern_minimal_generation_execution_confirmation_gate` before
any provider call, secret-bearing read, output directory creation, or generation
attempt is allowed.

## Authorization Draft

```yaml
authorization_draft:
  human_selected_option: authorize_one_minimal_real_generation_trial_later
  approved_product: premium_portable_led_camping_lantern
  approved_prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  proposed_output_directory: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 1
  auto_retry: false
  stop_after_generation: true
  success_requires_verified_local_file: true
  human_review_required_after_success: true
  secret_read_boundary: only in future execution gate, never in this phase
  A5_authorization_draft_created: true
  A5_execution_started: false
  provider_contact: false
  image_generation: false
  env_local_secret_value_read: false
  output_directory_created: false
```

## Execution Boundary

```yaml
not_provider_execution: true
not_image_generation: true
not_execution_confirmation: true
env_local_read_performed: false
output_directory_created: false
image_created: false
memory_write_performed: false
production_candidate_002_started: false
accepted_samples_written: false
runs_output_committed: false
```

## Future Execution Confirmation Requirements

Before any future A5 execution, a separate confirmation gate must explicitly
confirm:

- approved product and prompt package path.
- exact output directory string and whether creation is allowed in that later
  phase.
- `provider_calls_max: 1`.
- `generation_attempts_max: 1`.
- `output_images_max: 1`.
- `auto_retry: false`.
- `stop_after_generation: true`.
- the secret read boundary for only the required provider fields.
- success condition requiring at least one verified local file.
- human review requirement after a successful output.

## Closeout

```yaml
closeout:
  phase: v13_011_camping_lantern_minimal_generation_authorization_draft_gate
  authorization_draft:
    human_selected_option: authorize_one_minimal_real_generation_trial_later
    approved_product: premium_portable_led_camping_lantern
    approved_prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
    proposed_output_directory: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/
    provider_calls_max: 1
    generation_attempts_max: 1
    output_images_max: 1
    auto_retry: false
    stop_after_generation: true
    success_requires_verified_local_file: true
    human_review_required_after_success: true
    A5_authorization_draft_created: true
    A5_execution_started: false
    provider_contact: false
    image_generation: false
    env_local_secret_value_read: false
    output_directory_created: false
  safety:
    provider_contact: false
    image_generation: false
    retry: false
    env_local_secret_value_read: false
    secret_value_printed: false
    output_directory_created: false
    DailyNote_write: false
    VCP_memory_write: false
    memory_write_path: false
    production_candidate_002: false
    Batch_005: false
    runtime_execution: false
    dependency_change: false
    package_json_modified: false
    package_lock_modified: false
    scripts_modified: false
    runs_output_committed: false
    accepted_samples_written: false
    real_retouch_execution: false
    real_commercial_delivery_execution: false
  recommended_next:
    phase: v13_012_camping_lantern_minimal_generation_execution_confirmation_gate
    auto_execution_allowed: false
    purpose: 人工确认输出目录、预算、secret 读取边界和一次 provider call 后，才允许真实执行。
  final_state:
    next_phase_started: false
```
