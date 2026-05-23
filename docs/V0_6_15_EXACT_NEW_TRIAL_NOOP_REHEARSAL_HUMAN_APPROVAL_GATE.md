# v0.6.15 Exact New-Trial No-op Rehearsal And Human Approval Gate

base_contract: AGENTS.md
phase: v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate
mode: Green Lane no-op execution rehearsal and human approval packet
status: local no-op rehearsal completed; human approval gate pending

## Purpose

v0.6.15 rehearses the frozen `exact_new_trial_action_packet_v0_1` without
submitting it. It proves the future execution path can be described as a
bounded no-op sequence and exposes the human decision gate that must be crossed
before any real generation is attempted.

This phase does not contact a provider, generate an image, create the output
directory, write the provider receipt, write the registry, materialize the
review bridge, write DailyNote/VCP memory, run runtime surfaces, commit, or
push.

authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
action_packet_id: exact_new_trial_action_packet_v0_1
noop_rehearsal_id: exact_new_trial_noop_rehearsal_v0_1
human_approval_packet_id: exact_new_trial_human_approval_packet_v0_1
phase: v0_6_15_exact_new_trial_noop_rehearsal_human_approval_gate
source_action_packet_ref: reports/visual_asset_eval_dry_run/v0_6_14_exact_new_trial_action_packet_v0_1.json

## No-op Execution Report

The no-op runner simulates only three local steps:

- would_read: frozen action packet, prompt package metadata, target path
  collision state
- would_call: `image_gen.imagegen` exactly once if a future explicit human
  approval selects real generation
- would_write_if_real: output directory, provider receipt, provider registry,
  review console bridge entry

The actual local rehearsal emits:

- would_generate: true
- would_review: true
- would_stop: true
- stop_reason: `human_approval_pending_real_generation_not_authorized`

The rehearsal confirms that all future target paths are currently clear:

- output_directory_clear: true
- receipt_path_clear: true
- registry_path_clear: true
- review_console_bridge_clear: true

## Human Approval Packet

The gate offers exactly three human choices:

- keep_idle
- continue_dry_run
- authorize_one_real_generation

Current state:

- selected_option: `keep_idle_until_explicit_human_decision`
- human_approval_status: `pending`
- real_generation_authorized_now: false
- can_execute_now: false
- authorization_phrase_captured: false
- future_provider_execution_requires_new_explicit_step: true

If the future human chooses `authorize_one_real_generation`, the authorization
must still name the exact prompt package, output directory, receipt path,
registry path, review bridge, one provider call, one candidate, zero retry,
no overwrite, no secret read, no raw provider capture, no memory write, no
DailyNote write, and no push/tag/release/deploy.

## Exact Future Approval Statement Template

```text
I, Jenn, explicitly authorize Agent Image Lab to run exactly one real generation for AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001 using prompt prompts/image_generation/safe_adult_editorial_portrait_v1.yaml, output directory runs/real_generation/v0_3_3_exact_new_trial_001/, receipt reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json, registry reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json, review bridge review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001, provider route image_gen.imagegen, exactly 1 call, exactly 1 candidate, 0 retry, no overwrite, no secret read, no raw provider payload or response capture, no DailyNote or VCP memory write, no accepted-sample promotion, no production-candidate promotion, and no push/tag/release/deploy.
```

## Stop Conditions

- human_approval_pending
- authorization_phrase_missing
- selected_option_not_authorize_one_real_generation
- prompt_package_missing_or_changed
- output_directory_exists_before_execution
- receipt_path_exists_before_execution
- registry_path_exists_before_execution
- review_console_bridge_exists_before_execution
- overwrite_requested
- retry_requested
- max_image_candidates_above_one
- secret_value_required
- raw_provider_payload_capture_requested
- raw_provider_response_capture_requested
- memory_write_requested
- DailyNote_write_requested
- runtime_execution_requested
- provider_or_image_call_requested_during_noop
- accepted_sample_promotion_requested
- production_candidate_promotion_requested
- push_tag_release_deploy_requested
- validation_failure_requiring_judgment

## Boundary

- metadata_only: true
- no_op_rehearsal_only: true
- human_approval_packet_only: true
- no_new_trial_executed: true
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
- memory_seed_promoted: false
- package_dependency_change_performed: false
- commit_performed: false
- push_performed: false

## Recommended Next

Keep the gate idle unless Jenn explicitly selects `continue_dry_run` or issues
the exact one-real-generation authorization. The next local-safe task can refine
the human approval intake validator; the next real-generation task remains
blocked until an explicit one-call approval is captured.
