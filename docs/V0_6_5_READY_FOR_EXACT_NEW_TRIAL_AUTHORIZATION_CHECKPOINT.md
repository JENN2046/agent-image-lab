# v0.6.5 Ready For Exact New-Trial Authorization Checkpoint

base_contract: AGENTS.md
phase: v0_6_5_ready_for_exact_new_trial_authorization_checkpoint
status: local_checkpoint_validator

## Purpose

This checkpoint closes Batch A of the first-month recovery route by proving the
project is now ready for an exact new-trial authorization request, while still
remaining non-executing.

The checkpoint confirms that:

```text
failed_provider_attempt_inspection
-> exact_new_trial_authorization_refresh
-> ready_for_exact_new_trial_authorization
```

It does not authorize a new provider call, a new image generation run, output
directory creation, receipt writing, registry writing, memory writing,
DailyNote writing, runtime integration, or a real executor.

## Required Artifact Check

- `failed_provider_attempt_inspection exists: true`
- `exact_new_trial_authorization_refresh exists: true`
- `ready_for_exact_new_trial_authorization: true`
- `future_exact_approval_phrase_required: true`
- `can_execute_now: false`

## Authorization Readiness Check

- `first_attempt_failed_no_image: true`
- `retry_001_failed_no_image: true`
- `smoke_001_succeeded_image_generated: true`
- `safe_portrait_001_succeeded_image_generated: true`
- `reuse_original_prompt_by_default: false`
- `reuse_retry_001_prompt_by_default: false`
- `explicit_new_prompt_package_or_override_required: true`
- `new_output_directory_required: true`
- `new_receipt_path_required: true`
- `new_registry_path_required: true`
- `new_review_console_bridge_ref_required: true`
- `max_provider_calls_still_1: true`
- `max_image_candidates_still_1: true`
- `retry_limit_still_0: true`
- `no_memory_write_default_still_true: true`

## Boundary Check

- `provider_call_performed: false`
- `image_generation_performed: false`
- `VCP_memory_write_performed: false`
- `DailyNote_write_performed: false`
- `runtime_call_performed: false`
- `secret_value_read_performed: false`
- `production_candidate_created: false`
- `accepted_sample_auto_promotion: false`
- `memory_seed_promoted: false`
- `Push_L2_exercised: false`
- `package_dependency_change_performed: false`

## Current Result

Batch A is now closed as a reviewable, validator-backed, exact-authorization
checkpoint. A future new trial can only proceed after a separately exact human
approval phrase fills the refreshed prompt, output, receipt, registry, and
review-bridge values. This checkpoint remains metadata-only and does not reopen
execution.

## Recommended Next

If no new A5 authorization is granted, keep the route at
`ready_for_exact_new_trial_authorization`.

If a new exact A5 authorization is granted later, the next route is a single
new minimal trial with one provider call, one image candidate, zero automatic
retry, and post-trial human review.
