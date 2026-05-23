# v0.6.14 Exact New-Trial Action Packet v0.1

base_contract: AGENTS.md
phase: v0_6_14_exact_new_trial_action_packet_v0_1
mode: Green Lane action-packet freeze
status: local action packet frozen

## Purpose

v0.6.14 freezes `exact_new_trial_action_packet_v0_1` from the v0.6.12 local
preflight gate and the v0.6.13 failed-provider-attempt review. This artifact is
a non-executing action packet. It fixes the exact prompt package, output
directory, receipt path, registry path, review bridge, call limits, overwrite
policy, secret policy, retry policy, and stop conditions for a future human
approval gate.

This phase does not submit a request, contact a provider, generate an image,
create an output directory, write a receipt, write a registry, materialize a
review bridge, write DailyNote/VCP memory, run runtime surfaces, commit, or
push.

authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
action_packet_id: exact_new_trial_action_packet_v0_1
phase: v0_6_14_exact_new_trial_action_packet_v0_1
source_preflight_phase: v0_6_12_local_preflight_only_gate
source_review_phase: v0_6_13_failed_provider_attempt_review

## Frozen Target Package

- prompt_package_ref: `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- output_directory: `runs/real_generation/v0_3_3_exact_new_trial_001/`
- receipt_path: `reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json`
- registry_path: `reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json`
- review_console_bridge_ref: `review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001`

## Frozen Provider Command

- provider_target: `codex_builtin_image_generation`
- plugin_id_or_provider_route: `image_gen.imagegen`
- model: `managed_by_codex_image_tool`
- command: `generate`
- exact_call_count: 1
- max_image_candidates: 1
- retry_limit: 0
- review_required_after_generation: true
- no_memory_write_default: true
- overwrite_existing_files_allowed: false
- secret_value_read_allowed: false
- raw_private_data_print_allowed: false
- raw_provider_payload_capture_allowed: false
- raw_provider_response_capture_allowed: false

## Packet State

- packet_status: frozen_not_executable
- request_submitted: false
- execute_now: false
- can_execute_now: false
- human_approval_gate_required: true
- future_provider_execution_requires_new_explicit_step: true
- no_op_runner_required_before_execution: true

## Stop Conditions

- missing_human_approval_gate
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
- provider_or_image_call_requested_during_freeze
- push_tag_release_deploy_requested
- validation_failure_requiring_judgment

## Boundary

- metadata_only: true
- action_packet_only: true
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

Build a no-op execution rehearsal packet and human approval gate that can choose
between `keep_idle`, `continue_dry_run`, or `authorize_one_real_generation`.
