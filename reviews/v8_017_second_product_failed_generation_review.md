# v8.017 Second Product Failed Generation Review

## Result

```yaml
trial: v8_016_second_product_minimal_real_generation_trial_execution
approved_product: multi_color_mesh_sports_visor
prompt_package_used: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
result: failed_http_400
provider_contact_happened: true
provider_calls_used: 1
generation_attempts_used: 1
image_created: false
output_images_count: 0
output_directory_created: false
retry_allowed_now: false
```

## No-Image Review Explanation

There is no image to inspect. Human visual review cannot evaluate product
identity, material, color hierarchy, composition, or artifact quality because
the provider rejected the request before an output was written.

## Static Review Checklist

```yaml
prompt_package_exists: true
prompt_package_path_matches_authorization: true
runner_path_known: scripts/run_native_doubao_image_generation.js
adapter_path_known: adapters/image_generation/native_doubao_adapter.js
plugin_path_known: plugins/image_generation/native_doubao_image/native_doubao_image.js
provider_raw_error_available: false
secret_value_printed: false
output_added_to_git: false
```

## Prompt / Runner Findings

```yaml
finding_1:
  category: prompt_package_to_runner_mapping
  evidence: "prompt package uses positive_prompt, while loader recognizes prompt"
  impact: "request may have omitted the intended positive prompt"
  confidence: medium_high
  requires_provider_retry_to_confirm: true

finding_2:
  category: unsupported_field_or_size
  evidence: "request builder may send size 1920x1920, negative_prompt, n, and watermark"
  impact: "provider may reject unsupported parameters"
  confidence: medium
  requires_provider_retry_to_confirm: true

finding_3:
  category: model_endpoint_constraint
  evidence: "model and endpoint compatibility was not proven by a successful v8.016 call"
  impact: "configured endpoint may require a different model or payload shape"
  confidence: medium
  requires_provider_retry_to_confirm: true
```

## Recommendation

Do an A4.8 static fix gate before any second attempt. The likely useful fix is
to align the prompt package schema and runner loader so the intended positive
prompt is definitely passed as `prompt`, then review whether size and optional
fields should be narrowed for the active provider path.

No new generation is allowed by this review.
