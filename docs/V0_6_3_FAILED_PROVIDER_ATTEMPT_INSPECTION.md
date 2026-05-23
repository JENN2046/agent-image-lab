# v0.6.3 Failed Provider Attempt Inspection

base_contract: AGENTS.md
phase: v0_6_3_failed_provider_attempt_inspection
mode: A4 compact batch
status: local failed-attempt inspection

## Purpose

v0.6.3 turns the first real pilot failure into an explicit inspection record.
It binds the receipt, provider receipt registry entry, and generation-attempt
result into one fail-closed evidence packet so Batch A can proceed from
"failed once" to "failure classified and re-authorizable."

This phase does not execute a new trial. It does not call the provider again,
does not generate an image, does not write memory, does not write DailyNote,
does not run runtime surfaces, and does not implement a real executor.

## Required Evidence Refs

- `source_gate_ref`
- `receipt_ref`
- `receipt_registry_ref`
- `attempt_result_ref`
- `review_console_bridge_ref`

## Source Bindings

- source gate:
  `docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md`
- receipt:
  `reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json`
- provider receipt registry:
  `reports/provider_receipts/provider_receipt_registry.json`
- attempt result:
  `runs/real_generation/v0_3_3_codex_sample_first_trial/generation_attempt_result.json`
- schema:
  `schemas/failed_provider_attempt_inspection.schema.yaml`
- report:
  `reports/visual_asset_eval_dry_run/v0_6_3_failed_provider_attempt_inspection.json`
- fixture:
  `tests/schema_examples/failed_provider_attempt_inspection.example.json`
- fail fixture:
  `tests/schema_examples/failed_provider_attempt_inspection_fail.example.json`
- validator:
  `scripts/validate_failed_provider_attempt_inspection.js`

## Inspection Focus

The inspection must prove the following:

- the first attempt status is `failed_no_image_generated`
- `provider_calls_used=1`
- `image_candidates_generated=0`
- the failure class is `provider_tool_user_error`
- retry is blocked by `retry_limit=0`
- `output_image_path` remains `null`
- the review bridge ref is recorded
- no materialized review bridge artifact exists yet
- secret, raw payload, memory write, DailyNote write, runtime, and push
  boundaries remain preserved

## Boundary

- `metadata_only: true`
- `inspection_only: true`
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

The validator must prove the receipt, registry entry, and attempt result agree
on failure status, failure class, retry block, and no-artifact outcome; it must
also catch any drift into secret access, raw provider capture, new provider
calls, memory writes, or fake "success" interpretation.
