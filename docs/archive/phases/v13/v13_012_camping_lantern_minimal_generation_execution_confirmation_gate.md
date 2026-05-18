# v13.012 Camping Lantern Minimal Generation Execution Confirmation Gate

```yaml
phase: v13_012_camping_lantern_minimal_generation_execution_confirmation_gate
base_contract: AGENTS.md
mode: A5_pre_execution_confirmation
intent: planning
risk_level: R3
source_phase: v13_011_camping_lantern_minimal_generation_authorization_draft_gate
source_commit: 4d8420ed75aa53f96c9a095050591388f4c1bd03
commit_message: "docs: confirm camping lantern minimal generation execution boundary"
```

## Purpose

This gate converts the v13.011 authorization draft into an execution
confirmation record that can be reviewed by a human before any future real
generation. This phase still does not execute.

This phase does not contact a provider, generate images, retry, read
`.env.local`, print secrets, create the output directory, write memory, enter
production, write accepted samples, commit `runs/` output, execute retouch, or
execute delivery.

The next possible execution phase, `v13.013`, requires a new explicit human
authorization before any provider call, secret-bearing read, output directory
creation, or generation attempt is allowed.

## Execution Confirmation

```yaml
execution_confirmation:
  approved_product: premium_portable_led_camping_lantern
  approved_prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  output_directory: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 1
  auto_retry: false
  stop_after_generation: true
  success_requires_verified_local_file: true
  human_review_required_after_success: true
  secret_read_boundary: only during v13.013 execution if human explicitly authorizes
  execution_started: false
  provider_contact: false
  image_generation: false
  env_local_secret_value_read: false
  output_directory_created: false
```

## v13.013 Execution Rules

If a future human explicitly authorizes `v13.013`, execution must obey:

- exactly one provider call max.
- exactly one generation attempt max.
- one output image max.
- no auto retry.
- stop immediately after the generation attempt.
- if the provider succeeds but no verified local file exists, mark
  `failed_no_local_output_file`.
- if `local_files_verified_count > 0`, mark
  `human_review_required_now: true`.
- do not stage or commit `runs/` output.
- do not write `accepted_samples/`.
- do not write memory.
- do not start a second attempt.

## Current Non-Execution Boundary

```yaml
current_phase_executes_provider: false
current_phase_generates_image: false
current_phase_reads_env_local: false
current_phase_creates_output_directory: false
current_phase_starts_A5_execution: false
current_phase_enters_v13_013: false
```

## Closeout

```yaml
closeout:
  phase: v13_012_camping_lantern_minimal_generation_execution_confirmation_gate
  execution_confirmation:
    approved_product: premium_portable_led_camping_lantern
    approved_prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
    output_directory: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/
    provider_calls_max: 1
    generation_attempts_max: 1
    output_images_max: 1
    auto_retry: false
    stop_after_generation: true
    success_requires_verified_local_file: true
    human_review_required_after_success: true
    execution_started: false
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
    phase: pending_human_camping_lantern_minimal_generation_execution_authorization
    auto_execution_allowed: false
    purpose: 等待人工明确授权 v13.013；不得自动进入 provider execution。
  final_state:
    next_phase_started: false
```
