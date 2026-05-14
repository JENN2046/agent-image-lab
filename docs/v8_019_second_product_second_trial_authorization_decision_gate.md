# v8.019 Second Product Second Trial Authorization Decision Gate

```yaml
phase: v8_019_second_product_second_trial_authorization_decision_gate
base_contract: AGENTS.md
mode: A4 decision gate
intent: planning
risk_level: R1
source_phase: v8_018_second_product_prompt_or_runner_static_fix_gate
source_commit: d7db551471fdedbfe3f5d98d96d8e64282ccaaea
```

## Current State

```yaml
prompt_mapping_fix_completed: true
prompt_package_path: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
runner_canonical_prompt_field: prompt
positive_prompt_retained_and_synchronized: true
v8_016_prior_result: failed_http_400
retry_allowed_now: false
new_A5_authorization_required_for_retry: true
provider_contact_allowed_by_this_gate: false
image_generation_allowed_by_this_gate: false
env_local_secret_value_read_allowed_by_this_gate: false
```

## Options

### Option A - Authorize Second Minimal Real Generation Trial

Meaning: authorize one new controlled A5 trial based on the canonical `prompt`
mapping fix.

```yaml
risk: high_but_controlled
requires_A5: true
requires_provider_contact: true
requires_env_local_necessary_secret_read: true
requires_image_generation: true
limits_if_selected:
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 1
  auto_retry: false
  stop_after_generation: true
```

This is the recommended option if the product goal is to verify that Route B can
reuse the image workflow for a second product. It still requires explicit human
authorization before execution.

### Option B - More Static Runner / Payload Review Before Retry

Meaning: continue A4.8 static review of runner payload shape before any retry.

```yaml
risk: low
requires_A5: false
requires_provider_contact: false
requires_image_generation: false
best_if:
  - size_parameter_compatibility_is_uncertain
  - n_parameter_compatibility_is_uncertain
  - watermark_parameter_compatibility_is_uncertain
  - negative_prompt_compatibility_is_uncertain
  - endpoint_model_compatibility_needs_more_static_review
```

### Option C - Stop Second Product Real Generation Route

Meaning: keep the second product prompt package as a reusable planning artifact,
but stop real generation for this product.

```yaml
risk: lowest
tradeoff: Route B cross-product real generation remains unverified
requires_A5: false
```

## Recommendation

```yaml
recommended_option: authorize_second_minimal_real_generation_trial
reason: "The canonical prompt mapping issue has been fixed; a single new controlled trial is the shortest path to verify multi-product reuse."
human_decision_required: true
codex_may_not_auto_execute_option_A: true
```

## Stop State

```yaml
recommended_next:
  phase: pending_human_retry_authorization
  auto_execution_allowed: false
  purpose: 等待人工选择 Option A/B/C；不得自动进入 provider execution。
```
