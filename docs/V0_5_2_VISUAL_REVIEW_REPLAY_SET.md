# v0.5.2 Visual Review Replay Set

base_contract: AGENTS.md
phase: v0_5_2_visual_review_replay_set
mode: A4 compact batch
status: local replay fixture set

## Purpose

v0.5.2 defines repeatable review replay fixtures for the same existing asset.
The replay set proves that repeated review passes over the same metadata input
produce the same decision contract, stable failure taxonomy, stable correction
hint binding, and false memory flags.

This phase is metadata-only. It does not read image binaries, call providers,
generate images, write memory, create production candidates, or promote samples.

## Required Replay Checks

- `same_input_produces_same_decision_contract`
- `failure_taxonomy_stable`
- `correction_hint_stable`
- `memory_flags_stay_false`

## Source Bindings

- review pack: `reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json`
- semantic hardening:
  `tests/schema_examples/visual_review_semantics_hardening.example.json`
- prompt package preview:
  `reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json`
- schema: `schemas/visual_review_replay_set.schema.yaml`
- report: `reports/visual_asset_eval_dry_run/v0_5_2_review_replay_set.json`
- fixture: `tests/schema_examples/visual_review_replay_set.example.json`
- fail fixture: `tests/schema_examples/visual_review_replay_set_fail.example.json`
- validator: `scripts/validate_visual_review_replay_set.js`

## Boundary

- `metadata_only: true`
- `dry_run_only: true`
- `replay_only: true`
- `image_binary_read_performed: false`
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

The validator must catch input drift, decision-contract drift, failure-taxonomy
drift, correction-hint drift, memory flag drift, raw local path exposure, image
binary read drift, and any attempt to turn replay into provider/image/memory or
production action.
