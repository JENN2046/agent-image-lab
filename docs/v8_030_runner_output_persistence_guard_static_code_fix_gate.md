# v8.030 Runner Output Persistence Guard Static Code Fix Gate

```yaml
phase: v8_030_runner_output_persistence_guard_static_code_fix_gate
base_contract: AGENTS.md
mode: A4.8
intent: static_code_fix
risk_level: R2
source_phase: v8_029_timestamp_evidence_policy_patch
source_commit: 2cb27d2789fd639dbee46709fa15ceb485979ae3
```

## 中文说明

本阶段的中文意思是：静态修复 runner / adapter / plugin 的本地文件落盘判定。它不接 provider，不生成图片，不读取 `.env.local`，也不 retry。

## Problem

v8.029 已经把 provider success 和 local persistence 拆开，但 `normalizeResult()` 仍有一个静态风险：如果旧式结果只提供 `files_written_count: 1`，或错误地设置 `local_persistence_success: true`，但没有显式 `local_files_verified_count > 0`，归一化层仍可能把它当成本地成功。

这会重新打开 v8.027 的风险面：

```yaml
http_status: 200
provider_reported_image_count: 1
legacy_files_written_count: 1
local_files_verified_count: 0
should_be_reviewable: false
```

## Fix

`normalizeResult()` 现在只信任显式的 verified local file count:

```yaml
local_success_condition: local_files_verified_count > 0
legacy_files_written_count_can_create_success: false
local_persistence_success_flag_alone_can_create_success: false
human_review_required_now_requires_verified_local_file: true
```

## Validator Coverage

`scripts/validate_native_doubao_sandbox.js` 增加静态 negative cases:

```yaml
normalize_result_rejects_legacy_files_written_overcount: true
normalize_result_requires_verified_count_even_if_flag_true: true
```

These checks do not call provider, do not generate images, and do not read `.env.local`.

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
phase: v8_031_second_product_retry_after_persistence_fix_decision_gate
auto_execution_allowed: false
purpose: 人工决定是否在 persistence guard 静态修复后，重新授权一次最小真实生成试跑。
```
