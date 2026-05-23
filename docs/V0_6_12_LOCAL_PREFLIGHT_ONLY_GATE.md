# v0.6.12 Local Preflight-Only Gate

base_contract: AGENTS.md
phase: v0_6_12_local_preflight_only_gate
status: local_preflight_only_validator

## Purpose

This phase consumes the `v0.6.11` metadata-only preflight authorization by
running a local preflight gate over the exact new-trial package.

It does not submit the request.
It does not contact the provider.
It does not generate an image.
It does not create the output directory.
It does not write the receipt or registry.
It does not materialize the Review Console bridge.
It does not write DailyNote.
It does not write VCP memory.
It does not enable a real executor.

## Source Bindings

- `reports/visual_asset_eval_dry_run/v0_6_11_exact_new_trial_preflight_authorization_gate.json`
- `reports/visual_asset_eval_dry_run/v0_6_9_exact_new_trial_request_text_regenerated.json`
- `reports/visual_asset_eval_dry_run/v0_6_8_exact_new_trial_intake_field_resolution.json`
- `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`

## Preflight Result

```yaml
exact_new_trial_local_preflight_only_gate:
  authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
  phase: v0_6_12_local_preflight_only_gate
  preflight_authorization_consumed: true
  consumed_by_phase: v0_6_12_local_preflight_only_gate
  local_preflight_run_performed: true
  request_not_submitted: true
  can_execute_now: false
  provider_contact_allowed_now: false
  image_generation_allowed_now: false
```

## Checked Exact Targets

- `prompt_package_ref: prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- `output_directory: runs/real_generation/v0_3_3_exact_new_trial_001/`
- `receipt_path: reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json`
- `registry_path: reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json`
- `review_console_bridge_ref: review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001`

## Fixed Constraints

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
- `secret_value_read_allowed: false`

## Explicit Non-Execution

- `provider_call_performed: false`
- `image_generation_performed: false`
- `output_directory_created: false`
- `receipt_write_performed: false`
- `registry_write_performed: false`
- `review_console_bridge_materialized: false`
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

The exact new-trial package now has a consumed local preflight record. The
preflight proves the package can be checked locally while keeping every live
execution boundary closed.

This is still not a provider or image-generation authorization.

## Recommended Next

Move to failed provider attempt review and exact action-packet freezing for the
30-day route. Any future provider contact or image generation still requires a
new explicit execution step.
