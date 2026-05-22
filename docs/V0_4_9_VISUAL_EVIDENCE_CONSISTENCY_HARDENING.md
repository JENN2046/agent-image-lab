# v0.4.9 Visual Evidence Consistency Hardening

base_contract: AGENTS.md
phase: v0_4_9_visual_evidence_consistency_hardening
mode: A4 compact batch
status: local validator hardening

## Purpose

v0.4.9 hardens the evidence chain behind the visual review loop. It proves the
review pack, provider receipt metadata, generation attempt result, authorization
registry entry, and dry-run report all refer to the same asset and same redacted
evidence paths.

This phase is metadata-only. It does not read image binaries, call providers,
generate images, write memory, create production candidates, or promote samples.

## Required Consistency Rules

- `asset_id` must match across review pack, dry-run report, and registry entry.
- `receipt_path` must match across review pack, dry-run report, registry entry,
  receipt metadata, and attempt result.
- `attempt_result_path` must match across review pack, dry-run report, registry
  entry, receipt metadata, and attempt result.
- `output_image_sha256` must match across registry entry, receipt metadata,
  attempt result, and the evidence consistency report.
- no raw local path may appear in the hardened evidence report.
- image binary read must remain `false`.

## Source Bindings

- review pack: `reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json`
- dry-run report: `tests/schema_examples/visual_asset_eval_dry_run.example.json`
- authorization registry: `assets/visual_asset_authorization_registry.example.json`
- receipt metadata: `reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json`
- attempt result: `runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json`
- schema: `schemas/visual_evidence_consistency_hardening.schema.yaml`
- report: `reports/visual_asset_eval_dry_run/v0_4_9_evidence_consistency_hardening.json`
- fixture: `tests/schema_examples/visual_evidence_consistency_hardening.example.json`
- fail fixture: `tests/schema_examples/visual_evidence_consistency_hardening_fail.example.json`
- validator: `scripts/validate_visual_evidence_consistency_hardening.js`

## Boundary

- `metadata_only: true`
- `dry_run_only: true`
- `image_binary_read_performed: false`
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
- `real_executor_implemented_now: false`

## Closeout Expectation

The validator must catch asset ID drift, receipt path drift, attempt result path
drift, output image hash drift, raw local path exposure, and image binary read
drift.
