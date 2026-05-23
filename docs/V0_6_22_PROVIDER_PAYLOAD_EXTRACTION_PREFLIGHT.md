# v0.6.22 Provider Payload Extraction Preflight

## Purpose

This gate adds a local diagnostic capability for stable image generation work:
before any future real provider call, the project can materialize and validate
the exact sanitized request payload that would be handed to `image_gen.imagegen`.

The goal is not to explain the previous `failed_no_image_generated` record as a
generic safety issue. The goal is to locate the failure layer.

## Diagnostic Axes

- `prompt_extraction`: whether the prompt package is reduced to the positive
  `prompt` field only.
- `payload_wrapping`: whether the final provider request excludes YAML metadata,
  `negative_prompt`, authorization prose, paths, and receipt text.
- `path_authorization`: whether target paths and authorization state are valid
  at call time. This preflight does not execute that layer.
- `provider_tool_result`: whether the provider tool returns an image artifact.
  This preflight does not call the provider.

## Result

The generated capture is:

```text
reports/provider_payload_captures/v0_3_3_exact_new_trial_001_request_payload.sanitized.json
```

The capture proves:

- `provider_route: image_gen.imagegen`
- `prompt_source_field: prompt`
- `negative_prompt_included: false`
- `yaml_metadata_included: false`
- `authorization_text_included: false`
- `path_text_included_in_prompt: false`
- `provider_call_performed: false`
- `image_generation_performed: false`
- `raw_provider_response_capture_performed: false`
- `secret_value_read_performed: false`

## Current Localization

Based on this preflight plus the direct Codex image-generation checks:

- Codex image generation itself is working.
- The positive prompt text from
  `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml` works when
  sent directly.
- This preflight rules out prompt extraction contamination for the next
  diagnostic attempt.
- Remaining likely layers are provider-tool transient `UserError`, runtime call
  context or artifact return handling, and authorization/path state drift at
  call time.

## Boundary

No provider call, image generation, raw provider response capture, secret read,
memory write, DailyNote write, promotion, commit, push, tag, release, or deploy
is performed by this gate.

## Next

Run the next separately authorized single-generation attempt with payload
capture and artifact-return trace enabled, while keeping raw provider response
capture and secret reads blocked.
