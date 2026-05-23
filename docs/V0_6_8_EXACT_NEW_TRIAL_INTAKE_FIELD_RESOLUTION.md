# v0.6.8 Exact New-Trial Intake Field Resolution

base_contract: AGENTS.md
phase: v0_6_8_exact_new_trial_intake_field_resolution
status: local_field_resolution_validator

## Purpose

This phase continues the local-only intake route after `v0.6.7` by resolving
the five exact new-trial fields into one concrete, reviewable candidate set.

It does not submit the request.
It does not grant A5.
It does not authorize provider contact, image generation, output-directory
creation, receipt writing, registry writing, memory writing, DailyNote writing,
runtime integration, or a real executor.

## Resolution Header

```yaml
exact_new_trial_intake_field_resolution:
  authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
  phase: v0_6_8_exact_new_trial_intake_field_resolution
  authorization_status: draft_not_submitted
  approval_status: not_requested
  active: false
  execute_now: false
  submit_ready: false
  request_text_regenerated_after_resolution: false
  resolution_only: true
```

## Source Bindings

- `reports/visual_asset_eval_dry_run/v0_6_7_exact_new_trial_authorization_intake_preflight.json`
- `reports/visual_asset_eval_dry_run/v0_6_6_exact_new_trial_a5_request_draft.json`
- `reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json`
- `reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json`
- `reports/provider_receipts/v0_3_3_safe_portrait_001_registry.json`

## Resolved Exact Field Set

The five exact fields are now locally resolved as one new candidate bundle:

- `prompt_package_ref_or_override`
  - `resolution_mode: prompt_package_ref`
  - `selected_value: prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
  - `why_selected: closest successful adult person-portrait route in the current v0.3.3 evidence chain`
  - `blocked_values`
    - `prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml`
    - `prompts/image_generation/fashion_night_balcony_vertical_portrait_retry_001_simple.yaml`
- `output_directory`
  - `selected_value: runs/real_generation/v0_3_3_exact_new_trial_001/`
- `receipt_path`
  - `selected_value: reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json`
- `registry_path`
  - `selected_value: reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json`
  - `do_not_reuse: reports/provider_receipts/provider_receipt_registry.json`
- `review_console_bridge_ref`
  - `selected_value: review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001`
  - `corrected_allowed_ref_root: review_console/live_receipt_bridge/`

## Cross-Field Consistency

- `shared_trial_key: v0_3_3_exact_new_trial_001`
- `output_receipt_registry_bridge_share_same_key: true`
- `every_selected_value_is_new_not_reused_from_failed_attempts: true`
- `review_console_bridge_root_corrected_from_preflight_placeholder_note: true`
- `safe_portrait_prompt_selected_as_closest_successful_person_portrait_route: true`

## Fixed Constraint Confirmation

- `provider_target: codex_builtin_image_generation`
- `plugin_id_or_provider_route: image_gen.imagegen`
- `model: managed_by_codex_image_tool`
- `command: generate`
- `exact_call_count: 1`
- `max_image_candidates: 1`
- `retry_limit: 0`
- `review_required_after_generation: true`
- `no_memory_write_default: true`
- `overwrite_existing_files_allowed: false`

## Pre-Submission Assertions

- `all_five_exact_fields_resolved_locally: true`
- `request_text_regenerated_after_resolution: false`
- `ready_to_regenerate_request_text: true`
- `exact_human_A5_phrase_still_required: true`
- `can_submit_now: false`
- `can_execute_now: false`

## Explicit Non-Authorization

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
- `commit_performed: false`
- `push_performed: false`

## Current Result

The route now has:

```text
ready_for_exact_new_trial_authorization
+ exact_new_trial_a5_request_draft
+ exact_new_trial_authorization_intake_preflight
+ exact_new_trial_intake_field_resolution
```

That means the five exact fields are no longer generic placeholders, but the
request still remains local-only until the request text is regenerated and a
human separately issues the exact A5 approval phrase.

## Recommended Next

Regenerate the exact request text from these resolved values, keep the request
unsubmitted, and stop again before any A5 submission or real provider call.
