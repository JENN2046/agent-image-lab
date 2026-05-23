# v0.6.7 Exact New-Trial Authorization Intake Preflight

base_contract: AGENTS.md
phase: v0_6_7_exact_new_trial_authorization_intake_preflight
status: local_intake_preflight_validator

## Purpose

This phase starts the next local-only step after the v0.6.6 draft by grouping
every still-unresolved exact A5 field into one fail-closed intake checklist.

It does not submit the request.
It does not grant A5.
It does not authorize provider contact, image generation, output-directory
creation, receipt writing, registry writing, memory writing, DailyNote writing,
runtime integration, or a real executor.

## Intake Header

```yaml
exact_new_trial_authorization_intake_preflight:
  authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
  phase: v0_6_7_exact_new_trial_authorization_intake_preflight
  authorization_status: draft_not_submitted
  approval_status: not_requested
  active: false
  execute_now: false
  submit_ready: false
  preflight_only: true
```

## Source Bindings

- `reports/visual_asset_eval_dry_run/v0_6_6_exact_new_trial_a5_request_draft.json`
- `reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json`
- `reports/visual_asset_eval_dry_run/v0_6_0_first_controlled_generation_authorization_packet.json`

## Required Exact Intake Checklist

Every item below must stay explicit and unresolved at this phase:

- `prompt_package_ref_or_override`
  - placeholder: `<new_prompt_package_ref_under_prompts_image_generation_or_exact_override_statement>`
  - allowed_ref_root: `prompts/image_generation/`
- `output_directory`
  - placeholder: `<new_output_directory_under_runs_real_generation>`
  - allowed_ref_root: `runs/real_generation/`
- `receipt_path`
  - placeholder: `<new_receipt_path_under_reports_provider_receipts>`
  - allowed_ref_root: `reports/provider_receipts/`
- `registry_path`
  - placeholder: `<new_registry_path_or_existing_registry_refresh_plan_ref>`
  - allowed_ref_root: `reports/provider_receipts/`
- `review_console_bridge_ref`
  - placeholder: `<new_review_console_bridge_ref>`
  - allowed_ref_root: `docs/ or reports/provider_receipts/`
- `exact_human_approval_phrase_regeneration_required: true`

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

## Preflight Assertions

- `placeholders_grouped_into_one_checklist: true`
- `all_placeholders_still_unresolved_at_this_phase: true`
- `exact_human_A5_phrase_still_required: true`
- `regenerate_request_text_after_resolution: true`
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
```

That means the next local work can focus on resolving intake fields one by one
without silently turning the request into a submitted or executable action.

## Recommended Next

Resolve the exact intake checklist locally, regenerate the exact request text
only after every placeholder is replaced, and stop again before any A5 request
submission or real provider call.
