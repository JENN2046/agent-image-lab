# 30 Day Exact New-Trial Checkpoint

phase: v0_6_17_30_day_exact_new_trial_checkpoint
base_contract: AGENTS.md
status: completed_validated_local_30_day_checkpoint
checkpoint_doc: 30_DAY_EXACT_NEW_TRIAL_CHECKPOINT.md

## Executive Decision

Recommendation: do not enter real generation yet.

Reason: the preparation loop is auditable through v0.6.16, but the current
human approval intake state is still `not_captured`. The real-generation path
therefore remains blocked until Jenn explicitly chooses
`authorize_one_real_generation` with the exact required phrase and a separate
execution preflight is created.

## Readiness State

- readiness_state: ready_for_human_choice_not_ready_for_execution
- auditable_preparation_loop_complete: true
- preflight_consumed: true
- failed_attempt_review_complete: true
- action_packet_frozen: true
- noop_rehearsal_complete: true
- human_approval_gate_defined: true
- human_approval_intake_validator_complete: true
- human_choice_captured: false
- real_generation_authorized_now: false
- can_execute_now: false

## Evidence Chain

- v0.6.12 consumed the metadata-only preflight authorization locally.
- v0.6.13 reviewed two failed no-image provider attempts and blocked failed path reuse.
- v0.6.14 froze `exact_new_trial_action_packet_v0_1`.
- v0.6.15 rehearsed the future execution path as no-op.
- v0.6.16 validated the future human approval intake rules.

## Frozen Trial Package

- authorization_package_id: `AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001`
- action_packet_id: `exact_new_trial_action_packet_v0_1`
- prompt_package_ref: `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- output_directory: `runs/real_generation/v0_3_3_exact_new_trial_001/`
- receipt_path: `reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json`
- registry_path: `reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json`
- review_console_bridge_ref: `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001`
- provider_route: `image_gen.imagegen`
- exact_call_count: 1
- max_image_candidates: 1
- retry_limit: 0
- overwrite_existing_files_allowed: false
- secret_value_read_allowed: false

## Risk List

- human_approval_missing: no current explicit authorization to run the real generation.
- provider_tool_user_error_history: two prior no-image attempts exist and must not be reused as successful evidence.
- path_collision_risk: future real execution must re-check output, receipt, registry, and bridge targets before writing.
- prompt_route_risk: the safer portrait prompt is selected, but a real call may still fail or return no image.
- review_gap_risk: any future generated candidate still requires human review before classification.
- memory_promotion_risk: no accepted sample or VCP/DailyNote memory write is allowed by default.

## Next Stage Route

If Jenn chooses `keep_idle`, keep the checkpoint as the current terminal state.

If Jenn chooses `continue_dry_run`, continue local dry-run review-loop or
execution-preflight hardening without provider/image calls.

If Jenn chooses `authorize_one_real_generation`, create a separate execution
preflight record first. The future execution must still be exactly one call,
one candidate, zero retry, no overwrite, no secret read, no raw provider
capture, no automatic accepted-sample promotion, no memory write, and no push,
tag, release, or deploy.

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
