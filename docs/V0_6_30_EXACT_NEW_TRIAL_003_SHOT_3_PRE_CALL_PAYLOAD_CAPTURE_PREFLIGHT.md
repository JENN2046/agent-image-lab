# v0.6.30 Exact New-Trial 003 Shot 3 Pre-Call Payload Capture Preflight

phase: v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight
base_contract: AGENTS.md
status: completed_validated_pre_call_payload_capture_preflight

## Purpose

Restore literal pre-call payload capture discipline for `shot_3`, bind its
remaining execution paths before any provider call, and keep the final planned
stability shot collision-free and non-overwriting.

This phase only materializes the exact sanitized request payload for
`v0_3_3_exact_new_trial_003_shot_3`, proves the remaining output / receipt /
registry / review bridge targets are absent, and updates local validation
surfaces. It does not perform a provider call, image generation, review
promotion, memory write, DailyNote write, production-candidate write, commit,
or push.

## Evidence Produced

- `reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_3_request_payload.sanitized.json`
- `reports/visual_asset_eval_dry_run/v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.json`
- `scripts/validate_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight.js`

## Execution Truth

Selected route:

- source_phase: `v0_6_29_exact_new_trial_003_shot_2_execution_closeout`
- attempt_id: `v0_3_3_exact_new_trial_003_shot_3`
- provider_route: `image_gen.imagegen`
- prompt_package_ref: `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- planned_output_image_path:
  `runs/real_generation/v0_3_3_exact_new_trial_003_shot_3/safe_adult_editorial_portrait_v1.png`

Current preflight truth:

- pre_provider_call_payload_capture_required: `true`
- pre_provider_call_payload_capture_satisfied: `true`
- path_collision_clear_now: `true`
- provider_call_performed: `false`
- image_generation_performed: `false`

## Payload Capture Truth

The payload capture is literal pre-call evidence for the last planned shot:

- payload_capture_mode: `pre_provider_call_sanitized_request_payload`
- final_payload_prompt_equals_prompt_field: `true`
- negative_prompt_included: `false`
- yaml_metadata_included: `false`
- authorization_text_included: `false`
- path_text_included_in_prompt: `false`

## Boundary Confirmation

- provider_call_performed: false
- image_generation_performed: false
- retry_performed: false
- raw_provider_payload_capture_performed: true
- raw_provider_response_capture_performed: false
- secret_value_read_performed: false
- VCP_memory_write_performed: false
- DailyNote_write_performed: false
- accepted_sample_auto_promotion: false
- production_candidate_created: false
- commit_performed: false
- push_performed: false

## Recommended Next

Execute `v0_3_3_exact_new_trial_003_shot_3` as one real provider/image call
using the already captured payload, then require post-write local persistence
verification before any auto-promotion, memory write, or commercial-delivery
claim.
