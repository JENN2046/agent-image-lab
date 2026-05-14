# v8.017 Second Product Failed Trial Review Or Prompt Fix Decision Gate

```yaml
phase: v8_017_second_product_failed_trial_review_or_prompt_fix_decision_gate
base_contract: AGENTS.md
mode: A4/A0 failure review and decision gate
intent: review
risk_level: R1
source_phase: v8_016_second_product_minimal_real_generation_trial_execution
source_commit: be841c1affce059da662d64f6ae85978d7009d58
```

## Trial Closeout Record

```yaml
approved_product: multi_color_mesh_sports_visor
prompt_package_used: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
execution_status: failed_http_400
provider_contact_happened: true
provider_calls_used: 1
generation_attempts_used: 1
image_created: false
output_images_count: 0
output_directory_created: false
auto_retry_used: false
no_image_to_review: true
secret_value_printed: false
raw_provider_error_retained: false
retry_allowed_now: false
new_A5_authorization_required_for_retry: true
```

The v8.016 trial consumed its single authorized provider call and single
generation attempt. The runner returned `HTTP 400` with the sanitized error
`API returned error`. No output image exists, so no human visual review can be
performed.

## Sanitized Failure Summary

The failure can only be recorded as a sanitized category. The project did not
retain or print provider raw error details, request payload, secret values, raw
stdout/stderr, image payload, or provider URLs.

```yaml
known:
  provider_contact_happened: true
  http_status: 400
  image_created: false
  output_images_count: 0
  output_directory_created: false
unknown:
  provider_raw_error_code: not_retained
  provider_raw_error_message: not_retained
```

## Possible Failure Categories

These are categories, not claims about the raw provider response:

```yaml
possible_failure_categories:
  - request_payload_validation
  - prompt_package_to_runner_mapping
  - provider_parameter_mismatch
  - unsupported_field_or_size
  - model_endpoint_constraint
  - unknown_provider_side_rejection
```

## Static Diagnostic Notes

Local static review found one strong runner/package mapping risk:

- the prompt package uses `positive_prompt: |`
- the Native Doubao loader currently extracts only `prompt: |` and `negative_prompt: |`
- therefore the generated request may have sent an empty or incomplete positive prompt

Other non-proven risks to check before any retry:

- whether `1920x1920` is accepted by the active endpoint/model
- whether `negative_prompt` is accepted by the active endpoint/model
- whether `watermark: false` is accepted by the active endpoint/model
- whether the selected model name is valid for the configured base URL

## Decision

Do not retry now.

Recommended next:

```yaml
phase: v8_018_second_product_prompt_or_runner_static_fix_gate
auto_execution_allowed: false
purpose: 人工决定是否做 prompt / runner 参数静态修正；不自动重新生成。
```
