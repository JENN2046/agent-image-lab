# v0.5.6 Human Review Gate Packet

base_contract: AGENTS.md
phase: v0_5_6_human_review_gate_packet
mode: A4 compact batch
status: local human review gate packet

## Purpose

v0.5.6 defines the first human review gate packet that must exist before any
future controlled generation can be authorized. It specifies who must review,
what can be approved, the maximum generation-call ceiling, the approved output
policy, and the stop conditions that keep execution blocked when review is
missing or drifted.

This phase is metadata-only and dry-run-only. It does not authorize provider
dispatch, image generation, memory writes, DailyNote writes, runtime activity,
or real executor behavior.

## Required Review Gate Fields

- `reviewer_required`
- `approval_scope`
- `max_generation_calls`
- `approved_output_policy`
- `stop_conditions`
- `no_memory_by_default`

## Source Bindings

- readiness semantics hardening:
  `reports/visual_asset_eval_dry_run/v0_5_5_controlled_generation_readiness_semantics_hardening.json`
- prompt package preview:
  `reports/visual_asset_eval_dry_run/v0_5_1_prompt_package_preview.json`
- schema: `schemas/human_review_gate_packet.schema.yaml`
- report:
  `reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json`
- fixture: `tests/schema_examples/human_review_gate_packet.example.json`
- fail fixture: `tests/schema_examples/human_review_gate_packet_fail.example.json`
- validator: `scripts/validate_human_review_gate_packet.js`

## Boundary

- `metadata_only: true`
- `dry_run_only: true`
- `review_gate_packet_only: true`
- `actual_generation_calls: 0`
- `reviewer_required: true`
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

The validator must prove the packet requires human review, narrows approval
scope, preserves a bounded call ceiling, keeps output policy pre-approved but
non-executable, preserves stop conditions, blocks memory writes by default, and
catches any drift into provider/image/memory/runtime execution or raw-path
exposure.
