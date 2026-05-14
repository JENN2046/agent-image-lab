# v8.029 Runner Output Persistence Static Review And Fix Gate

```yaml
phase: v8_029_runner_output_persistence_static_review_and_fix_gate
base_contract: AGENTS.md
mode: A4.8
intent: static_code_review_and_local_fix
risk_level: R2
source_phase: v8_028_second_product_prompt_v2_failed_trial_review_or_output_persistence_gate
source_commit: 1c5c97605be208222c326101335d29cb84f48eb2
```

## 中文说明

本阶段的中文意思是：只在本地静态修复 Native Doubao runner / adapter 的“落盘成功判定”。它不调用 provider，不生成图片，不读取 `.env.local` secret 值，也不重新授权生成。

## Anomaly Reviewed

v8.027 had a split result:

```yaml
provider_layer:
  http_status: 200
  runner_reported_completed_generated: true
  runner_reported_image_count: 1
  runner_reported_files_written_count: 1

local_artifact_layer:
  local_file_count_verified: 0
  output_images_count: 0
  image_created_for_review: false
```

The safe conclusion is that provider success and local output persistence are separate layers. A generated image is not reviewable unless a real local file exists.

## Static Findings

The static review found three persistence risks:

- `writeImageOutput()` could include URL download failure notes in its `written` array.
- The adapter used `writeResult.files.length` as `files_written_count` without a separate local existence / stat-success contract.
- Runner public output used provider-level image presence as `image_count`, which could overclaim local reviewability.

## Fix Summary

The patch adds a local persistence guard:

```yaml
provider_success_vs_local_persistence_split: true
local_file_existence_required_for_success: true
local_file_count_verification_added_or_confirmed: true
zero_local_file_forces_failed_no_local_output_file: true
human_review_requires_local_file: true
runner_success_condition_tightened: true
```

## Updated Result Fields

Public runner / adapter results now distinguish:

```yaml
provider_request_success: boolean
provider_reported_image_count: number
local_files_written_count: number
local_files_verified_count: number
local_persistence_success: boolean
image_count: local_files_verified_count
image_created: local_persistence_success
output_files: sanitized_local_filenames_only
```

`provider_reported_image_count` may be greater than zero while `image_count` remains zero. In that case, the result must not be treated as reviewable output.

## Failure Rule

When no local output file passes verification:

```yaml
status: failed_no_local_output_file
image_created: false
image_count: 0
local_files_verified_count: 0
local_persistence_success: false
human_review_required_now: false
```

The adapter does not allow HTTP 200 or provider image presence alone to count as generated local output.

## Files Changed

```text
plugins/image_generation/native_doubao_image/native_doubao_image.js
adapters/image_generation/native_doubao_adapter.js
scripts/run_native_doubao_image_generation.js
scripts/validate_native_doubao_sandbox.js
docs/native_doubao_output_persistence_guard.md
```

## Validation Plan

```text
node --check plugins/image_generation/native_doubao_image/native_doubao_image.js
node --check adapters/image_generation/native_doubao_adapter.js
node --check scripts/run_native_doubao_image_generation.js
node --check scripts/validate_native_doubao_sandbox.js
node scripts/validate_native_doubao_sandbox.js
node scripts/validate_agent_board_state.js
node scripts/validate_current_state_alignment.js
powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
git diff --check
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

## Recommended Next

```yaml
phase: v8_030_second_product_retry_after_persistence_fix_decision_gate
auto_execution_allowed: false
purpose: 人工决定是否在 output persistence guard 修复后，重新授权一次最小真实生成试跑。
```
