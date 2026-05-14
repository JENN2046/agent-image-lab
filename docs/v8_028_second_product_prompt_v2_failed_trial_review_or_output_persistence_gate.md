# v8.028 Second Product Prompt V2 Failed Trial Review Or Output Persistence Gate

```yaml
phase: v8_028_second_product_prompt_v2_failed_trial_review_or_output_persistence_gate
base_contract: AGENTS.md
mode: A4 / A0
intent: failure_anomaly_review_and_decision_gate
risk_level: R1
source_phase: v8_027_second_product_prompt_v2_minimal_generation_trial_execution
approved_product: multi_color_mesh_sports_visor
prompt_package_used: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
execution_status: failed_no_local_output_file
suspected_issue_class: output_persistence_anomaly
```

## 中文说明

本阶段的中文意思是：第二商品 prompt v2 的真实生成试跑已经发生一次，provider 层返回成功信号，但本地没有可复核图片文件。因此本阶段只封存异常、拆分责任层、给出下一步静态修复建议，不再次生成。

## v8.027 Closeout Record

```yaml
v8_027_result:
  provider_contact_happened: true
  image_generation_attempted: true
  provider_calls_used: 1
  generation_attempts_used: 1
  http_status: 200
  observed_runner_result_status: COMPLETED_GENERATED
  observed_runner_result_image_count: 1
  observed_runner_result_files_written_count: 1
  local_file_count_verified: 0
  output_images_count: 0
  output_files: []
  auto_retry_used: false
  human_review_required_now: false
  no_local_image_to_review: true
```

The single authorized v8.027 provider call was consumed. The trial must be treated as failed for review and delivery purposes because no local image file is available for human inspection.

## No-Image Review Explanation

No visual review is possible because the local artifact layer contains zero verified image files. Even though the runner reported `COMPLETED_GENERATED`, `image_count: 1`, and `files_written_count: 1`, the repository-side verification found no local output file in:

```text
runs/real_generation/v8_027_multi_color_mesh_sports_visor_v2_trial/
```

Therefore:

```yaml
image_created_for_review: false
no_image_to_review: true
accepted_candidate: false
commercial_delivery_ready: false
memory_suitability: deferred
```

## Sanitized Anomaly Summary

This is not recorded as a prompt quality failure, a visual quality failure, or a provider raw-error failure. It is recorded as an output persistence anomaly:

```yaml
sanitized_anomaly:
  provider_success_layer_seen: true
  local_artifact_layer_failed: true
  raw_provider_error_available: false
  raw_provider_payload_retained: false
  secret_values_printed_or_recorded: false
  retry_allowed_now: false
```

No raw provider error is invented here. The only recorded facts are the sanitized runner status and the local file verification result.

## Provider Layer vs Local Artifact Layer

The v8.027 result must be read as two separate layers:

| Layer | Observed result | Meaning |
|---|---|---|
| Provider / runner public layer | HTTP 200, `COMPLETED_GENERATED`, `image_count: 1`, `files_written_count: 1` | The upstream call appeared successful through the sanitized runner result. |
| Local artifact layer | `local_file_count_verified: 0`, `output_files: []` | The project has no image file to review, deliver, or archive. |

The project should not treat provider-level success as delivery success unless the local output file exists and passes a concrete persistence check.

## Possible Failure Categories

```yaml
possible_failure_categories:
  - provider_url_returned_but_download_failed
  - provider_payload_returned_but_not_exposed_publicly
  - runner_files_written_count_overcount
  - output_path_mismatch
  - async_write_or_flush_gap
  - permission_or_filesystem_write_gap
  - adapter_success_criterion_too_loose
  - unknown_runner_persistence_bug
```

These are categories only. They are not claims about the provider raw response.

## Runner / Adapter Output Persistence Risk Checklist

Before any new generation authorization, a static runner / adapter review should check:

- Whether `files_written_count` is based on actual files that exist on disk.
- Whether a successful provider URL response can be counted even if local download or write fails.
- Whether public result redaction removes raw payloads while still allowing the write path to persist the asset internally.
- Whether the output directory used by the runner is exactly the same path verified after execution.
- Whether file writes are awaited and flushed before success is returned.
- Whether success requires `fs.existsSync`, file size greater than zero, and image extension verification.
- Whether the adapter can return `COMPLETED_GENERATED` when the local artifact layer is empty.
- Whether the runner should downgrade to `failed_no_local_output_file` when post-write verification fails.

## Why Retry Is Not Allowed

The v8.027 authorization allowed:

```yaml
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 1
auto_retry: false
```

That call has been consumed. A new provider call would be a new A5 action and requires a new explicit authorization package. This v8.028 gate does not authorize provider contact, image generation, retry, or `.env.local` secret value reading.

## Static Fix Recommendation

Recommended next phase:

```yaml
phase: v8_029_runner_output_persistence_static_review_and_fix_gate
auto_execution_allowed: false
purpose: 静态复核 runner/adapter 为什么显示写入成功但本地目录为空；不自动重新生成。
```

The likely next useful work is a static code review and narrow persistence fix for the Native Doubao runner / adapter. That work should not call provider or run the generation runner in real mode.

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
  new_A5_authorization_created: false
```
