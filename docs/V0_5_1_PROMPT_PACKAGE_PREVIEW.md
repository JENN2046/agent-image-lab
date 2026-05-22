# v0.5.1 Prompt Package Preview

base_contract: AGENTS.md
phase: v0_5_1_prompt_package_preview
mode: A4 compact batch
status: local prompt preview

## Purpose

v0.5.1 converts the v0.4.3 review-to-prompt correction hint into a reusable
next-round prompt package preview. It keeps the v0.5.0 controlled generation
readiness boundary: the preview may describe what should change next, but it
must not dispatch to a provider, generate an image, write memory, create a
production candidate, or promote a sample.

## Required Preview Fields

- `positive_constraints` records what the next prompt should add or strengthen.
- `negative_constraints` records what must remain forbidden during preview.
- `avoid_fragments` records fragile prompt fragments to avoid.
- `expected_visual_change` states the intended visible change without claiming
  an output exists.
- `risk_notes` records known failure risks before any future generation.

## Source Bindings

- correction hints:
  `tests/schema_examples/visual_prompt_correction_hint.example.json`
- controlled generation readiness packet:
  `reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json`
- schema: `schemas/prompt_package_preview.schema.yaml`
- report: `reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json`
- fixture: `tests/schema_examples/prompt_package_preview.example.json`
- fail fixture: `tests/schema_examples/prompt_package_preview_fail.example.json`
- validator: `scripts/validate_prompt_package_preview.js`

## Boundary

- `metadata_only: true`
- `dry_run_only: true`
- `prompt_preview_only: true`
- `actual_generation_calls: 0`
- `provider_call_performed: false`
- `image_generation_performed: false`
- `image_binary_read_performed: false`
- `VCP_memory_write_performed: false`
- `DailyNote_write_performed: false`
- `runtime_call_performed: false`
- `production_candidate_created: false`
- `accepted_sample_auto_promotion: false`
- `memory_seed_promoted: false`
- `Push_L2_exercised: false`
- `real_executor_implemented_now: false`

## Closeout Expectation

The validator must prove the prompt preview is derived from correction hints,
contains every required preview field, stays bound to the readiness packet, and
catches missing constraints, missing expected visual changes, missing risk
notes, provider/image/memory drift, raw paths, and generation dispatch drift.
