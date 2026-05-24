# v0.6.26 Exact New-Trial Local Persistence Repair Preflight

phase: v0_6_26_exact_new_trial_local_persistence_repair_preflight
base_contract: AGENTS.md
status: completed_validated_local_persistence_repair_preflight

## Purpose

Choose the safest exact repair route after v0.6.25 proved that
`v0_3_3_exact_new_trial_002` no longer has a local PNG in the repository.

This phase does not recover from a private external path, call the provider,
generate a new image, retry, write memory, promote an accepted sample, or push.
It only decides which route is currently valid for closing the missing-artifact
gap.

## Evidence Reviewed

- `reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json`
- `runs/real_generation/v0_3_3_exact_new_trial_002/generation_attempt_result.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_002_receipt.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_002_registry.json`
- `reports/visual_asset_eval_dry_run/v0_6_24_exact_new_trial_3shot_stability_preflight.json`
- `runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json`
- `reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json`
- `runs/real_generation/v0_3_3_safe_portrait_001/safe_adult_editorial_portrait_v1.png`

## Repair Route Review

### Route A — Replace 002 with another repo-tracked artifact

Rejected.

The repository does contain another safe portrait artifact under
`v0_3_3_safe_portrait_001`, but it is a different attempt with a different hash:

- alternative_attempt_id: `attempt-v0-3-3-safe-portrait-001`
- alternative_output_image_path:
  `runs/real_generation/v0_3_3_safe_portrait_001/safe_adult_editorial_portrait_v1.png`
- alternative_output_image_sha256:
  `e041f1c69624595aa92592b5209b8e887fec9d2d49155f9bae82409a76d65591`
- claimed_002_output_image_sha256:
  `3c08be9be98d36d94cc5d13de82b8c21c3f63533915fe59e814d99fdef3b4d96`

That alternative proves the prompt family can succeed, but it must not be
substituted as an exact recovery of `v0_3_3_exact_new_trial_002`.

### Route B — Recover 002 from an out-of-repo private local path

Blocked.

The historical records mention a sanitized external source path, but this phase
does not probe or recover from private local paths outside the project root.
That route remains outside the current safe local preflight scope.

### Route C — Use a fresh non-overwriting future shot

Selected.

The `v0.6.24` 3-shot stability preflight already defines a clean fresh route.
The first valid replacement path is:

- selected_shot_id: `v0_3_3_exact_new_trial_003_shot_1`
- output_directory:
  `runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/`
- output_image_path:
  `runs/real_generation/v0_3_3_exact_new_trial_003_shot_1/safe_adult_editorial_portrait_v1.png`
- payload_capture_ref:
  `reports/provider_payload_captures/v0_3_3_exact_new_trial_003_shot_1_request_payload.sanitized.json`
- receipt_path:
  `reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_receipt.json`
- registry_path:
  `reports/provider_receipts/v0_3_3_exact_new_trial_003_shot_1_registry.json`
- review_console_bridge_ref:
  `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_003_shot_1/bridge_entry.json`

This route keeps `002` immutable, avoids artifact substitution, and allows the
next successful attempt to become locally reviewable only if the new PNG is
actually present and verified after execution.

## Decision

The safest valid repair route is not to recover or replace `002` directly.
Instead, treat `002` as historical prompt-route evidence only and use a fresh
future shot as the next reviewable candidate route.

Current decision state:

- exact_002_repo_replacement_available: false
- repo_tracked_same_prompt_alternative_exists: true
- repo_tracked_same_prompt_alternative_substitutable_for_002: false
- private_out_of_repo_recovery_allowed_now: false
- selected_repair_route: `fresh_non_overwriting_future_shot`
- selected_shot_id: `v0_3_3_exact_new_trial_003_shot_1`
- selected_shot_path_collision_clear_now: true
- selected_shot_local_persistence_verification_required: true
- selected_shot_review_required_after_success: true
- current_human_review_of_002_allowed: false

## Boundary Confirmation

- route_selection_only: true
- provider_call_performed: false
- image_generation_performed: false
- retry_performed: false
- private_out_of_repo_recovery_performed: false
- secret_value_read_performed: false
- VCP_memory_write_performed: false
- DailyNote_write_performed: false
- accepted_sample_auto_promotion: false
- production_candidate_created: false
- commit_performed: false
- push_performed: false

## Recommended Next

Use `v0_3_3_exact_new_trial_003_shot_1` as the next candidate execution route,
with an immediate pre-execution path-collision recheck and a mandatory
post-write local persistence verification before any human review claim is
restored.
