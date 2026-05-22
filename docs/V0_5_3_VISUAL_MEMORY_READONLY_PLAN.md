# v0.5.3 Visual Memory ReadOnly Plan

base_contract: AGENTS.md
phase: v0_5_3_visual_memory_readonly_plan
mode: A4 compact batch
status: local read-only memory planning

## Purpose

v0.5.3 plans future visual memory read-only integration without reading real
memory stores and without writing memory. It defines how a later guarded phase
could recall accepted samples, rejected patterns, and style DNA as read-only
context after review replay stability exists.

This phase is planning-only and metadata-only. It does not access VCP memory,
DailyNote, VCPChat, VCPToolBox, runtime bridges, providers, or image binaries.

## Required ReadOnly Plans

- `accepted_sample_recall_read_only` describes future accepted-sample lookup
  context without creating or promoting accepted samples.
- `rejected_pattern_recall_read_only` describes future rejected-pattern lookup
  context without writing failure lessons.
- `style_dna_read_only` describes future style-DNA lookup context without
  creating memory seeds.
- `no_memory_write` keeps VCP memory writes disabled.
- `no_DailyNote_write` keeps DailyNote writes disabled.

## Source Bindings

- review replay set: `reports/visual_asset_eval_dry_run/v0_5_2_review_replay_set.json`
- visual sample memory policy: `docs/VISUAL_SAMPLE_MEMORY_POLICY.md`
- accepted sample schema: `schemas/accepted_sample_record.schema.yaml`
- rejected sample schema: `schemas/rejected_sample_record.schema.yaml`
- schema: `schemas/visual_memory_readonly_plan.schema.yaml`
- report: `reports/visual_asset_eval_dry_run/v0_5_3_visual_memory_readonly_plan.json`
- fixture: `tests/schema_examples/visual_memory_readonly_plan.example.json`
- fail fixture: `tests/schema_examples/visual_memory_readonly_plan_fail.example.json`
- validator: `scripts/validate_visual_memory_readonly_plan.js`

## Boundary

- `planning_only: true`
- `metadata_only: true`
- `read_only_plan_only: true`
- `real_memory_read_performed: false`
- `VCP_memory_write_performed: false`
- `DailyNote_write_performed: false`
- `accepted_sample_auto_promotion: false`
- `production_candidate_created: false`
- `memory_seed_promoted: false`
- `provider_call_performed: false`
- `image_generation_performed: false`
- `runtime_call_performed: false`
- `Push_L2_exercised: false`
- `real_executor_implemented_now: false`

## Closeout Expectation

The validator must prove every read-only plan exists, remains future/planning
only, binds to replay stability evidence and memory policy surfaces, and catches
write permission drift, real memory reads, DailyNote writes, sample promotion,
production creation, raw paths, and provider/image/runtime drift.
