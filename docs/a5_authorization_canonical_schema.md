# A5 Authorization Canonical Schema

```yaml
schema_id: a5_authorization_canonical_schema_v1
route: V11 Prompt Schema Hardening
source_phase: v11_010_A5_authorization_schema_draft_gate
source_inventory: docs/prompt_artifact_schema_inventory.md
mode: A4.8 docs-only schema draft
```

This schema draft separates three adjacent records that must not be collapsed:

1. `authorization_draft`: a proposed or recorded boundary.
2. `execution_confirmation`: the final human confirmation before execution.
3. `execution_closeout`: the sanitized result after execution.

This file is not an A5 authorization. It does not contact a provider, generate an image, read `.env.local`, create an output directory, write memory, write accepted_samples, promote production, or run runtime code.

## Authorization Draft Shape

```yaml
authorization_draft:
  authorization_id: string_required
  authorization_status: draft_only | human_selected_pending_confirmation | recorded_authorization_gate
  source_phase: string_required
  source_commit: string_optional
  human_decision_ref: string_required

  approved_scope:
    approved_product: string_required
    approved_prompt_package: string_required
    approved_runner: string_required
    proposed_output_directory: string_required
    selected_provider: string_required

  budgets:
    provider_calls_max: 1
    generation_attempts_max: 1
    output_images_max: 1
    auto_retry: false
    stop_after_generation: true

  success_policy:
    success_requires_verified_local_file: true
    local_files_verified_count_must_be_greater_than_zero: true
    human_review_requires_verified_local_file: true
    provider_http_success_alone_is_not_generation_success: true
    runner_reported_image_count_alone_is_not_generation_success: true

  secret_boundary_draft:
    env_local_secret_value_read_allowed_now: false
    env_local_secret_value_read_allowed_only_if_execution_confirmed: true
    allowed_reader_if_confirmed: scripts/run_native_doubao_image_generation.js
    allowed_secret_scope_if_confirmed: string_required
    secret_value_printed: false
    secret_value_recorded: false
    secret_value_committed: false
    env_local_modified: false
    env_local_staged_or_committed: false

  non_inheritance:
    this_is_new_authorization: boolean_required
    previous_authorization_consumed: boolean_optional
    retry_allowed_by_previous_authorization: false

  execution_state:
    A5_authorization_draft_created: true
    A5_execution_started: false
    provider_contact: false
    image_generation: false
    env_local_secret_value_read: false
    output_directory_created: false
```

## Execution Confirmation Shape

```yaml
execution_confirmation:
  confirmation_id: string_required
  source_authorization_draft: string_required
  source_phase: string_required
  source_commit: string_optional
  human_execution_authorization: true

  approved_execution:
    approved_product: string_required
    approved_prompt_package: string_required
    approved_runner: string_required
    output_directory: string_required
    provider_calls_max: 1
    generation_attempts_max: 1
    output_images_max: 1
    auto_retry: false
    stop_after_generation: true
    success_requires_verified_local_file: true
    human_review_required_after_success: true

  secret_boundary:
    env_local_secret_value_read_allowed_now: true
    allowed_reader: scripts/run_native_doubao_image_generation.js
    allowed_secret_scope: string_required
    secret_use_limit: one_provider_call_one_generation_attempt
    secret_value_printed: false
    secret_value_recorded: false
    secret_value_committed: false
    env_local_modified: false
    env_local_staged_or_committed: false

  execution_limits:
    second_provider_call_allowed: false
    retry_allowed: false
    switch_prompt_package_allowed: false
    switch_product_allowed: false
    accepted_samples_write_allowed: false
    production_candidate_allowed: false
    memory_write_allowed: false
    runs_output_git_add_allowed: false
```

## Execution Closeout Shape

```yaml
execution_closeout:
  closeout_id: string_required
  source_execution_confirmation: string_required
  phase: string_required
  prompt_package_used: string_required
  approved_product: string_required

  execution_result:
    execution_status: success | failed_no_local_output_file | failed_http_error | failed_provider_result | failed_runner_error
    provider_contact: boolean_required
    image_generation_attempted: boolean_required
    image_created: boolean_required
    provider_calls_used: number_required
    generation_attempts_used: number_required
    output_directory: string_required
    output_images_count: number_required
    output_files: list_required
    local_files_verified_count: number_required
    local_persistence_success: boolean_required
    auto_retry_used: false
    stopped_after_generation: true
    human_review_required_now: boolean_required

  safety:
    second_provider_call_started: false
    retry: false
    next_generation_started: false
    secret_value_printed: false
    secret_value_recorded: false
    DailyNote_write: false
    VCP_memory_write: false
    memory_write_path: false
    output_added_to_git: false
    accepted_samples_written: false
    production_candidate_002: false
    Batch_005: false
    dependency_change: false
    package_json_modified: false

  recommended_next:
    phase: string_required
    auto_execution_allowed: false
```

## Field Rules

### Authorization Draft Is Not Execution

An `authorization_draft` can record a human route choice and the proposed A5 boundary. It must keep `A5_execution_started`, provider contact, image generation, `.env.local` read, output directory creation, and memory write false.

### Execution Confirmation Is Still Bounded

An `execution_confirmation` can permit exactly one configured execution only when the human explicitly grants it. It must name the runner, prompt package, output directory, budgets, secret boundary, and success policy.

### Execution Closeout Must Split Provider And Local Persistence

An `execution_closeout` must record provider contact separately from local persistence. Success requires verified local files, not only HTTP success or provider-reported image count.

### Retry And Inheritance

Retry is false by default. A previous authorization cannot be reused unless a future explicit phase records a new bounded authorization.

## Validation Strategy

Future machine validation should check:

```yaml
a5_authorization_static_checks:
  authorization_draft_has_approved_product: true
  authorization_draft_has_approved_prompt_package: true
  authorization_draft_has_runner: true
  authorization_draft_provider_calls_max_one: true
  authorization_draft_generation_attempts_max_one: true
  authorization_draft_output_images_max_one: true
  authorization_draft_auto_retry_false: true
  authorization_draft_execution_started_false: true
  authorization_draft_env_read_now_false: true
  execution_confirmation_requires_human_authorization: true
  execution_confirmation_names_secret_reader: true
  execution_confirmation_limits_secret_use: true
  execution_confirmation_blocks_retry: true
  execution_closeout_splits_provider_contact_and_local_persistence: true
  execution_closeout_requires_local_files_verified_count: true
  execution_closeout_blocks_output_git_add: true
  execution_closeout_recommended_next_auto_execution_false: true
```

## Non-Authorization

```yaml
A5_authorization_created_by_this_schema: false
A5_execution_started: false
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
accepted_samples_written: false
runs_output_committed: false
runtime_execution: false
runner_behavior_changed: false
machine_validator_implemented: false
```
