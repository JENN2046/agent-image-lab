# Second Product Prompt Runner Mapping Fix

## Problem

The v8.016 second-product real generation trial failed with sanitized
`failed_http_400`. The project did not retain raw provider error details. A
static review then found a local mapping risk:

```yaml
prompt_package_field_present_before_fix: positive_prompt
runner_loader_reads: prompt
possible_result: intended positive prompt may not reach provider payload
```

## Fix

For executable prompt packages, `prompt` is the runner-facing canonical field.
`positive_prompt` may remain as a human-review alias, but it must stay
synchronized with `prompt`.

```yaml
runner_canonical_prompt_field: prompt
human_review_positive_field: positive_prompt
prompt_and_positive_prompt_synchronized: true
```

The second product package now includes both fields:

```text
prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
```

## Future Preflight Checklist

Before any new A5 authorization for this package, verify:

- `prompt` exists and contains the intended positive prompt
- `positive_prompt`, if present, matches `prompt`
- `negative_prompt` remains intentional
- requested size is compatible with the selected provider/model
- optional fields such as `n` and `watermark` are allowed by the selected provider/model
- model and endpoint compatibility are explicitly reviewed

No provider contact or image generation was performed by this fix.
