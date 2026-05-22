# v0.5.8 Controlled Generation Evidence Contract

base_contract: AGENTS.md
phase: v0_5_8_controlled_generation_evidence_contract
mode: A4 compact batch
status: local controlled generation evidence contract

## Purpose

v0.5.8 defines the minimum evidence contract that must exist before any future
real controlled generation can be requested. The contract links the prompt
preview, review gate packet, readiness packet, no-op would-generate receipt, and
the expected post-generation review-report contract into one fail-closed chain.

This phase is metadata-only and dry-run-only. It does not generate images, write
review output, write memory, write DailyNote, call runtime surfaces, or
implement a real executor.

## Required Evidence Refs

- `prompt_package_preview_ref`
- `review_gate_packet_ref`
- `readiness_packet_ref`
- `would_generate_receipt_ref`
- `expected_review_report_ref`

## Source Bindings

- prompt package preview:
  `reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json`
- human review gate packet:
  `reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json`
- controlled generation readiness packet:
  `reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json`
- no-op controlled generation runner dry run:
  `reports/visual_asset_eval_dry_run/v0_5_7_noop_controlled_generation_runner_dry_run.json`
- expected review report schema:
  `schemas/visual_asset_review_report.schema.yaml`
- schema:
  `schemas/controlled_generation_evidence_contract.schema.yaml`
- report:
  `reports/visual_asset_eval_dry_run/v0_5_8_controlled_generation_evidence_contract.json`
- fixture:
  `tests/schema_examples/controlled_generation_evidence_contract.example.json`
- fail fixture:
  `tests/schema_examples/controlled_generation_evidence_contract_fail.example.json`
- validator:
  `scripts/validate_controlled_generation_evidence_contract.js`

## Boundary

- `metadata_only: true`
- `dry_run_only: true`
- `evidence_contract_only: true`
- `all_required_refs_present: true`
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

The validator must prove every required evidence ref exists, binds to the
current protocol chain, preserves expected review-report shape as a future
contract only, and catches any drift into provider/image/memory/runtime
execution or raw-path exposure.
