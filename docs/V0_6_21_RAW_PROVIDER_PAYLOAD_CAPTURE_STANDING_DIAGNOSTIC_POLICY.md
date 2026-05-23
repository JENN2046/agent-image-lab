# v0.6.21 Raw Provider Payload Capture Standing Diagnostic Policy

phase: v0_6_21_raw_provider_payload_capture_standing_diagnostic_policy
base_contract: AGENTS.md
status: completed_validated_local_policy_update

## Purpose

Record Jenn's standing diagnostic instruction to keep provider request payload
capture enabled until the exact-new-trial generation route is stable.

This policy is local governance only. It does not call the provider, generate an
image, retry the failed attempt, write memory, promote an accepted sample, or
push.

## Standing Diagnostic Authorization

- authorization_state: `active_until_generation_route_stable_or_revoked`
- authorized_scope: `future exact-new-trial diagnostic generation attempts`
- raw_provider_payload_capture_allowed: true
- sanitized_request_payload_capture_required: true
- raw_provider_response_capture_allowed: false
- secret_value_read_allowed: false
- raw_private_data_print_allowed: false
- binary_image_payload_capture_allowed: false
- memory_write_allowed: false
- DailyNote_write_allowed: false
- accepted_sample_auto_promotion_allowed: false
- production_candidate_auto_promotion_allowed: false
- push_allowed: false

## Capture Rules

For every future provider/image diagnostic attempt in this route, record the
final request payload immediately before the call. The capture must prove whether
the call sends:

- only the extracted positive `prompt` field.
- no full YAML package text.
- no `negative_prompt` text unless a future provider adapter explicitly supports
  a separate negative prompt field.
- no authorization prose.
- no receipt, registry, bridge, or local filesystem paths inside the prompt.
- no secrets, tokens, cookies, env values, raw private paths, or raw provider
  response.

The captured request may include normal prompt text, selected provider route,
candidate count, retry limit, aspect ratio, and non-secret routing metadata.

## Stability Exit Criteria

The policy remains active until either:

- Jenn explicitly revokes it.
- The route completes a successful exact-new-trial generation with captured
  request payload proving clean prompt extraction.
- A later validated policy gate replaces it.

## Required Future Payload Capture Artifact

Future attempts should write a local artifact similar to:

```text
reports/provider_payload_captures/<attempt_id>_request_payload.sanitized.json
```

Minimum required fields:

- `attempt_id`
- `prompt_package_ref`
- `provider_route`
- `payload_capture_mode`
- `prompt_source_field`
- `prompt_text_sha256`
- `prompt_text_preview`
- `negative_prompt_included`
- `yaml_metadata_included`
- `authorization_text_included`
- `path_text_included_in_prompt`
- `secret_value_read_performed`
- `raw_provider_response_capture_performed`
- `safe_to_call_provider`

## Boundary Confirmation

- policy_update_only: true
- provider_call_performed: false
- image_generation_performed: false
- retry_performed: false
- raw_provider_payload_capture_performed_now: false
- raw_provider_response_capture_performed: false
- secret_value_read_performed: false
- VCP_memory_write_performed: false
- DailyNote_write_performed: false
- accepted_sample_auto_promotion: false
- production_candidate_created: false
- commit_performed: false
- push_performed: false

## Recommended Next

Create a no-provider-call payload extraction preflight for
`prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`, then inspect
the captured request payload before any future real generation call.
