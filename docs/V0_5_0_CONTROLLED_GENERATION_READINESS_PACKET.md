# v0.5.0 Controlled Generation Readiness Packet

base_contract: AGENTS.md
phase: v0_5_0_controlled_generation_readiness_packet
mode: A4 compact batch
status: local readiness packet

## Purpose

v0.5.0 defines a controlled generation readiness packet without executing any
generation. It turns the hardened review semantics and evidence consistency
records into a bounded future-action envelope that can be reviewed before any
provider, runtime, image, memory, production, or sample-promotion action exists.

This phase is planning-only and metadata-only. It does not call providers,
generate images, read image binaries, write memory, create production
candidates, or promote accepted samples.

## Required Readiness Fields

- `prompt_package_preview` describes the next prompt package candidate without
  dispatching it.
- `max_generation_calls` declares a future upper bound while keeping
  `actual_generation_calls` at `0`.
- `output_policy` requires preview-only/no-output behavior for this phase.
- `review_gate` defines the review checks required before any future sample can
  be accepted.
- `failure_stop_condition` defines when a future run must stop instead of
  retrying or promoting.
- `no_memory_by_default` keeps memory and DailyNote writes disabled.

## Source Bindings

- evidence consistency report:
  `reports/visual_asset_eval_dry_run/v0_4_9_evidence_consistency_hardening.json`
- prompt correction hints:
  `tests/schema_examples/visual_prompt_correction_hint.example.json`
- schema: `schemas/controlled_generation_readiness_packet.schema.yaml`
- report:
  `reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json`
- fixture:
  `tests/schema_examples/controlled_generation_readiness_packet.example.json`
- fail fixture:
  `tests/schema_examples/controlled_generation_readiness_packet_fail.example.json`
- validator: `scripts/validate_controlled_generation_readiness_packet.js`

## Boundary

- `planning_only: true`
- `metadata_only: true`
- `dry_run_only: true`
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

The validator must prove the packet contains every required readiness field,
binds to the v0.4.9 evidence record and v0.4.3 correction hints, keeps all
actual execution counters at zero, and catches attempts to turn readiness into
generation, provider contact, memory write, production promotion, raw path
exposure, or Push_L2 exercise.
