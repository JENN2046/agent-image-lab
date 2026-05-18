# v10.010 Third Product Minimal Generation Execution Confirmation Gate

```yaml
phase: v10_010_third_product_minimal_generation_execution_confirmation_gate
base_contract: AGENTS.md
mode: A4
intent: planning
risk_level: R3
source_phase: v10_009_third_product_minimal_generation_authorization_draft_gate_remote_sync
source_commit: a206d66a5838f1e35925aebe3a40fa72dc6bdffa
```

## Purpose

This gate confirms the exact execution boundary that would be used by a later
single minimal generation trial for the third product. It does not execute A5.
It does not contact a provider, read `.env.local`, generate an image, create the
output directory, run `scripts/run_native_doubao_image_generation.js`, write
memory, or commit any `runs/` output.

## Confirmed Execution Boundary

```yaml
execution_confirmation:
  approved_product: cosmetic_skincare_bottle / premium_serum_bottle
  approved_prompt_package: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
  output_directory: runs/real_generation/v10_010_premium_serum_bottle_first_trial/
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 1
  auto_retry: false
  stop_after_generation: true
  success_requires_verified_local_file: true
  human_review_required_after_success: true
  new_explicit_execution_authorization_still_required_before_provider_call: true
```

## Secret Boundary Confirmation

```yaml
secret_boundary:
  env_local_secret_value_read_allowed_now: false
  future_execution_reader_if_authorized_later: scripts/run_native_doubao_image_generation.js
  future_allowed_scope_if_authorized_later: Doubao image generation fields required by the runner
  secret_value_printed: false
  secret_value_recorded: false
  secret_value_committed: false
  env_local_modified: false
  env_local_staged_or_committed: false
```

No `.env.local` read is allowed by this confirmation gate. A later v10.011
execution gate would need explicit human authorization before the runner may
read only the required Doubao image generation fields.

## Output Persistence Success Rule

```yaml
output_persistence_success_rule:
  success_requires_verified_local_file: true
  local_files_verified_count_must_be_greater_than_zero: true
  human_review_requires_verified_local_file: true
  provider_http_success_alone_is_not_generation_success: true
  runner_reported_image_count_alone_is_not_generation_success: true
```

The later execution may be treated as reviewable only if at least one local
image file exists and passes local file verification.

## Execution Status

```yaml
execution_status:
  A5_execution_started: false
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  output_directory_created: false
  output_images_count: 0
```

## Boundary Confirmation

```yaml
safety:
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
  runtime_execution: false
  CDP_bridge_MCP: false
  dependency_change: false
  package_json_modified: false
  runs_output_committed: false
  accepted_samples_written: false
```

## Recommended Next

```yaml
phase: v10_011_third_product_minimal_generation_trial_execution
auto_execution_allowed: false
purpose: 只有人工明确执行授权后，才允许一次 provider call / one generation attempt。
```
