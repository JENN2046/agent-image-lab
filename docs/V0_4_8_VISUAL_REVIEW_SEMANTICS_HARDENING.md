# v0.4.8 Visual Review Semantics Hardening

base_contract: AGENTS.md
phase: v0_4_8_visual_review_semantics_hardening
mode: A4 compact batch
status: local validator hardening

## Purpose

v0.4.8 hardens the visual review report contract so a report cannot pass by
only filling fields. The validator must prove the decision semantics are not
empty and remain bound to the existing dry-run visual judgment loop.

## Required Semantic Rules

- `pass` cannot include any `blocking_failures`.
- `reject` must include at least one explicit failure taxonomy category.
- `patch` must include a correction hint reference and correction hint category.
- low score findings must be present for every low-scored review dimension.
- `memory_suitability` must remain `false`.

The low-score threshold for this dry-run semantic layer is `score <= 5`.

## Source Bindings

- source review pack: `reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json`
- source failure taxonomy: `tests/schema_examples/visual_failure_taxonomy.example.json`
- source correction hints: `tests/schema_examples/visual_prompt_correction_hint.example.json`
- schema: `schemas/visual_review_semantics_hardening.schema.yaml`
- fixture: `tests/schema_examples/visual_review_semantics_hardening.example.json`
- fail fixture: `tests/schema_examples/visual_review_semantics_hardening_fail.example.json`
- validator: `scripts/validate_visual_review_semantics_hardening.js`

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

The validator output must record that all required semantic negative cases were
caught, including pass with blocking failure, reject without taxonomy, patch
without correction hint, low score without finding, and memory suitability drift.
