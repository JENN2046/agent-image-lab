# v0.5.9 Visual Memory ReadOnly Query Contract

base_contract: AGENTS.md
phase: v0_5_9_visual_memory_readonly_query_contract
mode: A4 compact batch
status: local visual memory readonly query contract

## Purpose

v0.5.9 narrows the earlier visual-memory readonly plan into a fail-closed query
contract. It defines the exact readonly query shapes that a future guarded phase
may use for accepted samples, rejected patterns, and style DNA without reading
real memory now and without enabling any memory or DailyNote write path.

This phase is metadata-only and contract-only. It does not perform real memory
reads, write VCP memory, write DailyNote, promote accepted samples, promote
memory seeds, create production candidates, call providers, generate images, or
implement a real executor.

## Required Query Contract Fields

- `accepted_sample_readonly_query`
- `rejected_pattern_readonly_query`
- `style_dna_readonly_query`
- `no_write_flags`

## Source Bindings

- readonly plan:
  `reports/visual_asset_eval_dry_run/v0_5_3_visual_memory_readonly_plan.json`
- visual sample memory policy: `docs/VISUAL_SAMPLE_MEMORY_POLICY.md`
- accepted sample schema: `schemas/accepted_sample_record.schema.yaml`
- rejected sample schema: `schemas/rejected_sample_record.schema.yaml`
- schema: `schemas/visual_memory_readonly_query_contract.schema.yaml`
- report:
  `reports/visual_asset_eval_dry_run/v0_5_9_visual_memory_readonly_query_contract.json`
- fixture:
  `tests/schema_examples/visual_memory_readonly_query_contract.example.json`
- fail fixture:
  `tests/schema_examples/visual_memory_readonly_query_contract_fail.example.json`
- validator: `scripts/validate_visual_memory_readonly_query_contract.js`

## Boundary

- `metadata_only: true`
- `readonly_query_contract_only: true`
- `query_contract_dry_run_only: true`
- `no_live_memory_access: true`
- `provider_call_performed: false`
- `image_generation_performed: false`
- `real_memory_read_performed: false`
- `VCP_memory_write_performed: false`
- `DailyNote_write_performed: false`
- `runtime_call_performed: false`
- `production_candidate_created: false`
- `accepted_sample_auto_promotion: false`
- `memory_seed_promoted: false`
- `Push_L2_exercised: false`
- `real_executor_implemented_now: false`

## Closeout Expectation

The validator must prove every readonly query contract exists, stays
metadata-only, exposes only query-shape fields, preserves `no_write_flags`, and
catches drift into real memory access, memory writes, DailyNote writes, sample
promotion, memory-seed promotion, provider/image/runtime activity, raw local
paths, and secret-bearing paths.
