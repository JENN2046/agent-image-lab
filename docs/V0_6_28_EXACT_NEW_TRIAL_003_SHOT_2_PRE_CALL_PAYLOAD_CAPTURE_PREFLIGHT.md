# v0.6.28 Exact New-Trial 003 Shot 2 Pre-Call Payload Capture Preflight

phase: v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight
base_contract: AGENTS.md
status: completed_validated_pre_call_payload_capture_preflight

## Purpose

Restore literal pre-call payload capture discipline before the second shot in
the 3-shot exact-new-trial sequence.

This phase does not call the provider, generate an image, create a receipt, or
write a review bridge. It only materializes the exact sanitized request payload
for `v0_3_3_exact_new_trial_003_shot_2`, proves the future execution paths are
still collision-free, and keeps promotion, memory, production-candidate, commit,
and push actions blocked.

## Inputs

- `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- `stability_tests/plans/safe_adult_editorial_portrait_v1_3shot_stability_preflight.yaml`
- `reports/visual_asset_eval_dry_run/v0_6_27_exact_new_trial_003_shot_1_execution_closeout.json`

## Evidence Produced

- `reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_2_request_payload.sanitized.json`
- `reports/visual_asset_eval_dry_run/v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.json`
- `scripts/validate_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight.js`

## Pre-Call Capture Truth

Materialized payload target:

- attempt_id: `v0_3_3_exact_new_trial_003_shot_2`
- provider_route: `image_gen.imagegen`
- prompt_package_ref: `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- payload_capture_ref:
  `reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_2_request_payload.sanitized.json`

Verified payload characteristics:

- pre_provider_call_payload_capture_required: `true`
- pre_provider_call_payload_capture_satisfied: `true`
- payload_capture_mode: `pre_provider_call_sanitized_request_payload`
- final_payload_prompt_equals_prompt_field: `true`
- negative_prompt_included: `false`
- yaml_metadata_included: `false`
- authorization_text_included: `false`
- path_text_included_in_prompt: `false`

## Path-Collision Recheck

Future execution targets remain unclaimed at capture time:

- output_directory_exists_now: `false`
- output_image_exists_now: `false`
- attempt_result_exists_now: `false`
- receipt_exists_now: `false`
- registry_exists_now: `false`
- review_console_bridge_exists_now: `false`
- path_collision_clear_now: `true`

This means `shot_2` now has the exact sanitized payload already captured, while
the remaining execution targets are still clean for a future single-call
attempt.

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

Execute `v0_3_3_exact_new_trial_003_shot_2` as a single real provider/image
attempt using the already captured pre-call payload, then require immediate
post-write local persistence verification before any review promotion, memory
write, or commercial-readiness claim.
