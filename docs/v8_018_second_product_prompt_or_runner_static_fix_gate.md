# v8.018 Second Product Prompt Or Runner Static Fix Gate

```yaml
phase: v8_018_second_product_prompt_or_runner_static_fix_gate
base_contract: AGENTS.md
mode: A4.8 static fix gate
intent: local_implementation
risk_level: R2
source_phase: v8_017_second_product_failed_trial_review_or_prompt_fix_decision_gate
source_commit: e59fe0cac8df4d61e5b705f10640c6057ceb916f
```

## Purpose

Fix the static mapping risk found after the failed v8.016 second-product trial:
the prompt package used `positive_prompt`, while the Native Doubao loader reads
the runner-facing canonical `prompt` field.

This stage does not call the provider, does not retry generation, does not read
`.env.local`, and does not authorize any new A5 execution.

## Static Fix

```yaml
prompt_package_path: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
canonical_prompt_field_added_or_confirmed: true
positive_prompt_mapping_resolved: true
runner_prompt_field: prompt
positive_prompt_retained_for_review: true
prompt_and_positive_prompt_synchronized: true
runner_or_loader_fallback_added: false
```

The package now includes:

- `prompt: |` as the field consumed by the Native Doubao loader
- `positive_prompt: |` retained as the human-review semantic field
- `runner_prompt_mapping` metadata to prevent future schema drift

## Static Optional Field Review

```yaml
provider_optional_fields_reviewed: true
size_parameter_reviewed: true
negative_prompt_reviewed: true
n_parameter_reviewed: true
watermark_parameter_reviewed: true
model_endpoint_compatibility_reviewed: true
```

No code fallback was added in this phase because the approved second-product
package can be made executable-compatible by adding the canonical `prompt`
field. A future shared schema hardening gate may add loader fallback if multiple
packages need backward compatibility.

## Remaining Boundaries

```yaml
retry_allowed_now: false
new_A5_authorization_required_for_retry: true
provider_contact: false
image_generation: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
runs_output_committed: false
```

## Recommended Next

```yaml
phase: v8_019_second_product_second_trial_authorization_decision_gate
auto_execution_allowed: false
purpose: 人工决定是否基于静态修正，重新授权一次最小真实生成试跑。
```
