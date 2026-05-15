# v10.009 Third Product Minimal Generation Authorization Draft Gate

```yaml
phase: v10_009_third_product_minimal_generation_authorization_draft_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R3
source_phase: v10_007_third_product_A5_authorization_decision_gate
source_commit: caf3e68d471cfed7f9e3a61cca015aa476fbda50
human_selected_option: authorize_one_minimal_real_generation_trial
```

## Purpose

The human selected v10.007 Option A: authorize one minimal real generation trial
for the third product prompt workflow.

This gate converts that selection into a concrete A5 authorization draft. It
does not execute the draft. It does not contact a provider, read `.env.local`,
generate an image, create an output directory, write memory, or commit any
`runs/` output.

## Approved Product And Prompt Package

```yaml
approved_product: cosmetic_skincare_bottle / premium_serum_bottle
locked_structure: frosted_translucent_glass_bottle_with_clean_dropper_cap
prompt_package_path: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
static_review_result: pass_for_static_review
```

## A5 Authorization Draft

```yaml
a5_authorization_draft:
  target_system: native_doubao_image_generation_runner
  runner: scripts/run_native_doubao_image_generation.js
  approved_product: cosmetic_skincare_bottle / premium_serum_bottle
  approved_prompt_package: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
  proposed_output_directory: runs/real_generation/v10_010_premium_serum_bottle_first_trial/
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 1
  auto_retry: false
  stop_after_generation: true
  human_review_required_after_generation: true
  success_requires_verified_local_file: true
```

## Secret Boundary Draft

```yaml
secret_boundary_draft:
  env_local_secret_value_read_allowed_only_if_execution_confirmed: true
  allowed_reader: scripts/run_native_doubao_image_generation.js
  allowed_secret_scope: Doubao image generation fields required by the runner
  secret_value_printed: false
  secret_value_recorded: false
  secret_value_committed: false
  env_local_modified: false
  env_local_staged_or_committed: false
```

The draft would allow `.env.local` reads only during a later explicitly confirmed
A5 execution gate. This v10.009 gate itself does not read `.env.local`.

## Execution Status

```yaml
execution_status:
  A5_authorization_draft_created: true
  A5_execution_started: false
  provider_contact: false
  image_generation: false
  retry: false
  output_directory_created: false
  output_images_count: 0
```

## Confirmation Still Required

Before any real generation can run, the human must confirm the exact execution
package, including:

- prompt package path
- output directory
- provider call budget
- generation attempt budget
- output image budget
- `.env.local` access boundary
- no retry
- stop after generation
- human review requirement

## Boundary Confirmation

```yaml
safety:
  A5_execution: false
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
phase: v10_010_third_product_minimal_generation_execution_confirmation_gate
auto_execution_allowed: false
purpose: 人工确认 v10.009 A5 草案中的输出目录、预算和 secret 读取边界后，才允许一次最小真实生成试跑。
```
