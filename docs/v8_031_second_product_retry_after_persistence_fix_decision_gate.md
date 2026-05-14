# v8.031 Second Product Retry After Persistence Fix Decision Gate

```yaml
phase: v8_031_second_product_retry_after_persistence_fix_decision_gate
base_contract: AGENTS.md
mode: A4
intent: decision_gate
risk_level: R1
source_phase: v8_030_runner_output_persistence_guard_static_code_fix_gate
source_commit: 785cb23452c37c1893855cf75360d32c841e5075
```

## 中文说明

本阶段的中文意思是：在 output persistence guard 静态修复之后，只记录是否重新授权一次最小真实生成试跑的人工决策选项。

本阶段不调用 provider，不生成图片，不读取 `.env.local` secret 值，不 retry，也不进入 v8.032 execution。

## Current Evidence

```yaml
previous_execution_status: failed_no_local_output_file
previous_anomaly:
  http_status: 200
  runner_reported_generated: true
  local_verified_files: 0
prompt_v2_path: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
output_persistence_guard_fixed: true
normalize_result_requires_verified_local_file_count: true
legacy_files_written_count_can_create_success: false
local_persistence_success_flag_alone_can_create_success: false
human_review_requires_verified_local_file: true
current_A5_authorization_created: false
provider_contact_allowed_now: false
image_generation_allowed_now: false
retry_allowed_now: false
```

The important change after v8.030 is that a future successful provider response is not enough for review. The run may enter human review only when `local_files_verified_count > 0`.

## Options

### Option A — Authorize One More Minimal Real Generation Trial After Persistence Fix

含义：基于 prompt v2 和已修复的 output persistence guard，再授权一次最小真实生成。

```yaml
risk: high_but_bounded
requires:
  - A5
  - provider_contact
  - env_local_necessary_secret_read
  - image_generation
limits_if_authorized_later:
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 1
  auto_retry: false
  stop_after_generation: true
success_condition:
  local_files_verified_count_must_be_greater_than_zero: true
current_default_allowed: false
```

### Option B — Do More Local Static / Sandbox Testing Before Generation

含义：继续 A4.8 本地静态和 sandbox 验证，不接 provider。

```yaml
risk: low
requires:
  - A4.8_static_testing
  - local_validation
provider_contact: false
image_generation: false
env_local_secret_value_read: false
recommended_when: runner_output_persistence_guard_still_feels_under-tested
```

### Option C — Stop Second Product Real Generation Route Here

含义：保留第二商品 prompt v2、失败样本和 runner guard 修复，不再继续真实生成。

```yaml
risk: lowest
provider_contact: false
image_generation: false
tradeoff: second_product_has_no_accepted_candidate
```

## Recommendation

```yaml
recommended_option: authorize_one_more_minimal_real_generation_trial_after_persistence_fix
reason: Route B still aims to validate cross-product real generation reuse, and v8.030 removed the specific local persistence overclaim risk.
human_decision_required: true
codex_may_auto_execute_option_A: false
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
  dependency_change: false
  package_json_modified: false
  runs_output_committed: false
```

## Decision Gate Result

```yaml
A5_authorization_created: false
options_presented:
  - authorize_one_more_minimal_real_generation_trial_after_persistence_fix
  - more_local_static_sandbox_testing
  - stop_second_product_real_generation_route
recommended_next:
  phase: pending_human_retry_authorization_after_persistence_fix
  auto_execution_allowed: false
```
