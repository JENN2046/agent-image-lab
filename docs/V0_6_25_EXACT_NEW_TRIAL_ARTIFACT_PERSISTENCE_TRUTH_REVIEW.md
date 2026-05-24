# v0.6.25 Exact New-Trial Artifact Persistence Truth Review

phase: v0_6_25_exact_new_trial_artifact_persistence_truth_review
base_contract: AGENTS.md
status: completed_validated_local_artifact_truth_review

## Purpose

Audit the current local filesystem truth for the successful
`v0_3_3_exact_new_trial_002` run after v0.6.23 and v0.6.24 recorded it as a
human-reviewable success.

This phase does not call the provider, generate a new image, retry, recover
from a private external path, write memory, promote an accepted sample, or
push. It only reconciles the difference between the recorded artifact-copy claim
and the current repository reality.

## Evidence Reviewed

- `runs/real_generation/v0_3_3_exact_new_trial_002/generation_attempt_result.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_002_receipt.json`
- `reports/provider_receipts/v0_3_3_exact_new_trial_002_registry.json`
- `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_002/bridge_entry.json`
- `reports/visual_asset_eval_dry_run/v0_6_23_single_generation_with_payload_capture_and_artifact_trace.json`
- `reports/visual_asset_eval_dry_run/v0_6_24_exact_new_trial_3shot_stability_preflight.json`
- `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- current repository directory listing for
  `runs/real_generation/v0_3_3_exact_new_trial_002/`

## Findings

- attempt_status_recorded: `succeeded_image_generated`
- artifact_return_trace_status: `artifact_located_and_copied_to_project`
- claimed_output_image_path:
  `runs/real_generation/v0_3_3_exact_new_trial_002/safe_adult_editorial_portrait_v1.png`
- current_output_directory_exists: true
- current_output_directory_entries: `generation_attempt_result.json`
- current_output_image_present_now: false
- current_output_image_sha256_verified_now: false
- local_persistence_verified_now: false
- reviewable_sample_now: false
- human_review_allowed_now: false
- accepted_sample_eligible: false
- memory_write_eligible: false
- production_candidate_eligible: false

The v0.6.23 records consistently claim that the generated image artifact was
copied into the project and is ready for human review. Current repository
reality contradicts that claim: the run directory still exists, but the PNG is
missing from the worktree. Because the review target is absent, no honest human
review can proceed from the current project state.

## Review Findings

P1: `review_required: true` remains directionally correct, but the required
review cannot execute on the current worktree because the referenced review
asset is missing. The truthful state is `human_review_blocked_by_missing_local_artifact`.

P1: v0.6.24 uses `v0_3_3_exact_new_trial_002` as source success evidence for the
future 3-shot stability route. That remains historically useful, but it is no
longer sufficient as a currently reviewable local asset until a separate local
persistence repair decision is recorded.

P2: this phase intentionally does not attempt out-of-repo recovery from the
sanitized Codex-generated image source path. Recovering from a user-private path
outside the project root is a separate task and must not be hidden inside this
truth audit.

## Boundary Confirmation

- review_only: true
- filesystem_truth_audit_only: true
- provider_call_performed: false
- image_generation_performed: false
- retry_performed: false
- external_private_path_recovery_performed: false
- raw_provider_payload_capture_performed: false
- raw_provider_response_capture_performed: false
- secret_value_read_performed: false
- VCP_memory_write_performed: false
- DailyNote_write_performed: false
- accepted_sample_auto_promotion: false
- production_candidate_created: false
- commit_performed: false
- push_performed: false

## Decision

The current repository does not contain the recorded output image for
`v0_3_3_exact_new_trial_002`. Therefore the run is not a reviewable local
sample right now, despite the historical success receipt. Human review,
accepted-sample promotion, memory planning, and production-candidate reasoning
must remain blocked until a separate local persistence repair or replacement
path is defined.

## Recommended Next

Create a local persistence repair preflight that decides, without reading
secrets or touching external systems, whether to:

1. record the missing artifact as irrecoverable and require a fresh
   non-overwriting future shot path, or
2. perform a separately scoped local-only recovery action from already recorded
   non-secret evidence if such a path can be proven safe and exact.

Do not perform human review, memory write, accepted-sample promotion, or a new
generation call until that persistence truth gap is closed.
