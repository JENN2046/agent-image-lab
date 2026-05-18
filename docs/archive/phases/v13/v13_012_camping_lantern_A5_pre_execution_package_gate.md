# v13.012 Camping Lantern A5 Pre-Execution Package Gate

```yaml
phase: v13_012_camping_lantern_A5_pre_execution_package_gate
base_contract: AGENTS.md
mode: A5_pre_execution_package
intent: planning
risk_level: R3
source_phase: v13_011_camping_lantern_minimal_generation_authorization_draft_gate
source_commit: 4d8420ed75aa53f96c9a095050591388f4c1bd03
commit_message: "docs: confirm camping lantern A5 pre-execution package"
```

## Purpose

This gate consolidates the v13.011 camping lantern authorization draft into a
complete A5 pre-execution package. It finalizes the authorization boundary,
execution confirmation, output directory policy, provider call budget, secret
read boundary, stop conditions, and success condition for a possible future
one-shot generation attempt.

This phase still does not execute. It does not contact a provider, generate an
image, retry, read `.env.local`, print or record secrets, create the output
directory, write memory, enter production, write `accepted_samples/`, commit
`runs/` output, execute retouch, execute delivery, or enter `v13.013`.

Future real execution requires a separate explicit human authorization for
`v13.013`.

## Pre-Execution Package

```yaml
execution_target:
  approved_product: premium_portable_led_camping_lantern
  approved_prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  output_directory: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/

budget:
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 1
  auto_retry: false
  second_provider_call_allowed: false
  second_generation_attempt_allowed: false

secret_boundary:
  env_local_secret_value_read_now: false
  secret_value_printed: false
  secret_value_recorded: false
  future_secret_read_allowed_only_in_v13_013_execution_after_explicit_human_authorization: true

stop_conditions:
  stop_after_generation: true
  stop_after_one_attempt_even_if_failed: true
  no_auto_retry: true
  if_http_200_but_no_verified_local_file: failed_no_local_output_file
  if_local_files_verified_count_gt_0: human_review_required_now
  output_added_to_git: false
  accepted_samples_written: false
  memory_write: false
  production_candidate_002: false

success_condition:
  success_requires_verified_local_file: true
  local_files_verified_count_must_be_greater_than_0: true
  human_review_required_after_success: true

must_remain_false:
  A5_execution_started: false
  provider_contact: false
  image_generation: false
  env_local_secret_value_read: false
  output_directory_created: false
  memory_write: false
  production_candidate_002: false
  accepted_samples_written: false
  runs_output_committed: false
```

## v13.013 Authorization Boundary

The next execution phase is not automatic. Before any provider call or
secret-bearing read, `v13.013` must be explicitly authorized by a human and must
keep these rules:

- one provider call maximum.
- one generation attempt maximum.
- one output image maximum.
- no automatic retry and no second attempt.
- stop after one attempt even if the attempt fails.
- if an HTTP success response does not produce a verified local file, record
  `failed_no_local_output_file`.
- if `local_files_verified_count > 0`, record
  `human_review_required_now: true`.
- do not stage or commit `runs/` output.
- do not write `accepted_samples/`.
- do not write memory.
- do not start `production_candidate_002`.

## Current Non-Execution Boundary

```yaml
current_phase_starts_A5_execution: false
current_phase_contacts_provider: false
current_phase_generates_image: false
current_phase_reads_env_local: false
current_phase_creates_output_directory: false
current_phase_enters_v13_013: false
```

## Closeout

```yaml
closeout:
  phase: v13_012_camping_lantern_A5_pre_execution_package_gate
  commit_message: "docs: confirm camping lantern A5 pre-execution package"
  branch: master
  source_commit: 4d8420ed75aa53f96c9a095050591388f4c1bd03
  pre_execution_package:
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
    failed_no_local_output_file_policy_defined: true
    local_file_verification_required: true
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
    secret_value_recorded: false
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
    phase: pending_human_camping_lantern_one_minimal_real_generation_execution_authorization
    auto_execution_allowed: false
    purpose: 等待人工明确授权 v13.013；只允许一次 provider call / one generation attempt / one output image max。
  final_state:
    next_phase_started: false
```
