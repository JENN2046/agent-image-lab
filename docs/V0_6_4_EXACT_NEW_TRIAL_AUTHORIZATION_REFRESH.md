# v0.6.4 Exact New-Trial Authorization Refresh

base_contract: AGENTS.md
phase: v0_6_4_exact_new_trial_authorization_refresh
mode: A4 compact batch
status: local next-trial authorization refresh

## Purpose

v0.6.4 converts the failed-attempt inspection into an exact refresh packet for
any future new trial request. It does not overwrite the historical `v0_3_2`
candidate packet or `v0_3_3` pilot gate. Instead, it records which fields must
be refreshed before a second request can be considered reviewable.

This phase does not execute a new trial. It does not call the provider, does
not generate an image, does not write memory, does not write DailyNote, does
not run runtime surfaces, and does not implement a real executor.

## Required Evidence Refs

- `source_candidate_packet_ref`
- `source_pilot_gate_ref`
- `failed_attempt_inspection_ref`
- `first_attempt_receipt_ref`
- `retry_001_receipt_ref`
- `smoke_001_receipt_ref`
- `safe_portrait_001_receipt_ref`

## Source Bindings

- source candidate packet:
  `docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md`
- source pilot gate:
  `docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md`
- failed-attempt inspection:
  `reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json`
- first attempt receipt:
  `reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json`
- retry 001 receipt:
  `reports/provider_receipts/v0_3_3_retry_001_receipt.json`
- smoke 001 receipt:
  `reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json`
- safe portrait 001 receipt:
  `reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json`
- schema:
  `schemas/exact_new_trial_authorization_refresh.schema.yaml`
- report:
  `reports/visual_asset_eval_dry_run/v0_6_4_exact_new_trial_authorization_refresh.json`
- fixture:
  `tests/schema_examples/exact_new_trial_authorization_refresh.example.json`
- fail fixture:
  `tests/schema_examples/exact_new_trial_authorization_refresh_fail.example.json`
- validator:
  `scripts/validate_exact_new_trial_authorization_refresh.js`

## Refresh Decision Surface

This refresh packet must lock the following:

- the first attempt and retry 001 both failed with no image artifact
- the neutral smoke route succeeded
- the safe adult editorial portrait route succeeded
- the failure must not be reported as a general route outage
- the original first-trial prompt must not be silently reused by default
- the retry 001 simplified prompt must not be silently reused by default
- any new trial must use a newly reviewed prompt package or an explicit override
- `max_provider_calls` remains `1`
- `max_image_candidates` remains `1`
- `retry_limit` remains `0`
- `no_memory_write_default` remains `true`
- output directory, receipt path, registry path, and review bridge ref must all
  be new or explicitly non-colliding
- a fresh exact authorization phrase is required before any future call

## Exact Refresh Fields

The refresh record must explicitly encode these field names:

- `reuse_original_prompt_by_default=false`
- `reuse_retry_001_prompt_by_default=false`
- `explicit_new_prompt_package_or_override_required=true`
- `new_output_directory_required=true`
- `new_receipt_path_required=true`
- `new_registry_path_required=true`
- `new_review_console_bridge_ref_required=true`
- `exact_authorization_phrase_refresh_required=true`

## Boundary

- `metadata_only: true`
- `refresh_packet_only: true`
- `no_new_trial_executed: true`
- `provider_call_performed: false`
- `image_generation_performed: false`
- `VCP_memory_write_performed: false`
- `DailyNote_write_performed: false`
- `runtime_call_performed: false`
- `production_candidate_created: false`
- `accepted_sample_auto_promotion: false`
- `memory_seed_promoted: false`
- `Push_L2_exercised: false`
- `real_executor_implemented_now: false`

## Closeout Expectation

The validator must prove the two failed fashion-oriented attempts and the two
successful route checks are all recorded, that the new-trial refresh flags
remain fail-closed, and that no field silently reopens provider, image, memory,
runtime, or push behavior.
