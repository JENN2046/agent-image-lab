# v0.6.18 Single Generation Execution Preflight

phase: v0_6_18_single_generation_execution_preflight
base_contract: AGENTS.md
status: completed_validated_local_execution_preflight

## Purpose

Prepare the final local preflight packet for one future real generation attempt
without calling the provider or generating an image.

This phase converts the v0.6.17 Day 30 conclusion into an execution-adjacent
preflight surface. It proves the exact frozen package, path collision checks,
required human authorization phrase, review obligations, and stop conditions are
ready to inspect again immediately before a provider call.

## Authorization State

- preflight_id: `single_generation_execution_preflight_v0_1`
- authorization_package_id: `AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001`
- source_checkpoint: `30_DAY_EXACT_NEW_TRIAL_CHECKPOINT.md`
- readiness_state: `preflight_ready_waiting_for_exact_execution_authorization`
- execution_preflight_ready: true
- exact_real_generation_authorization_captured: false
- authorization_phrase_captured: false
- provider_call_allowed_now: false
- image_generation_allowed_now: false
- can_execute_now: false

## Frozen Execution Package

- prompt_package_ref: `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- output_directory: `runs/real_generation/v0_3_3_exact_new_trial_001/`
- receipt_path: `reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json`
- registry_path: `reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json`
- review_console_bridge_ref: `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001`
- provider_route: `image_gen.imagegen`
- command: `generate`
- exact_call_count: 1
- max_image_candidates: 1
- retry_limit: 0
- overwrite_existing_files_allowed: false
- secret_value_read_allowed: false
- raw_provider_payload_capture_allowed: false
- raw_provider_response_capture_allowed: false
- review_required_after_generation: true
- no_memory_write_default: true

## Local Path Collision Preflight

- prompt_package_exists: true
- output_directory_exists: false
- receipt_path_exists: false
- registry_path_exists: false
- review_console_bridge_exists: false
- target_paths_clear_now: true
- recheck_required_immediately_before_execution: true

## Required Future Authorization Tokens

The future execution authorization must explicitly preserve:

- `authorize_one_real_generation`
- `AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001`
- `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- `runs/real_generation/v0_3_3_exact_new_trial_001/`
- `reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json`
- `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001`
- `image_gen.imagegen`
- `1 call`
- `1 candidate`
- `0 retry`
- `no overwrite`
- `no secret read`
- `no raw provider payload capture`
- `no raw provider response capture`
- `review required`
- `no automatic accepted-sample promotion`
- `no memory write`
- `no push`

## Stop Conditions

Stop before provider call if any condition is true:

- exact human authorization is missing.
- the authorization phrase omits any required token.
- output directory, receipt path, registry path, or bridge path already exists.
- prompt package is missing or changed outside this package.
- retry count is greater than 0.
- candidate limit is greater than 1.
- overwrite is allowed.
- secret value read is requested.
- raw provider payload or raw response capture is requested.
- review after generation is not required.
- memory write, DailyNote write, accepted-sample promotion, production-candidate
  promotion, commit, push, tag, release, or deploy is requested.

## Boundary Confirmation

- provider_call_performed: false
- image_generation_performed: false
- output_directory_created: false
- receipt_write_performed: false
- registry_write_performed: false
- review_console_bridge_materialized: false
- VCP_memory_write_performed: false
- DailyNote_write_performed: false
- runtime_call_performed: false
- secret_value_read_performed: false
- production_candidate_created: false
- accepted_sample_auto_promotion: false
- commit_performed: false
- push_performed: false

## Next Route

Recommended next: wait for Jenn to provide the exact
`authorize_one_real_generation` execution authorization. If that authorization is
captured, rerun this preflight immediately before the provider call and stop on
any drift.
