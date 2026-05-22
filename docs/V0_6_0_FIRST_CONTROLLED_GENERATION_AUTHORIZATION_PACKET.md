# v0.6.0 First Controlled Generation Authorization Packet

base_contract: AGENTS.md
phase: v0_6_0_first_controlled_generation_authorization_packet
mode: A4 compact batch
status: local first controlled generation authorization packet

## Purpose

v0.6.0 defines the smallest authorization packet that must exist before any
future first real controlled generation could ever be requested. The packet is
still inactive. It does not authorize execution now. Instead, it binds the
future request to an explicit A5 requirement, an exact call count, an output
directory policy, mandatory post-generation review, and no-memory-write
defaults.

This phase is metadata-only and preflight-only. It does not call providers,
generate images, read or write memory, write DailyNote, write outputs, create
production candidates, promote accepted samples, or implement a real executor.

## Required Authorization Fields

- `explicit_A5_required`
- `exact_call_count`
- `allowed_output_dir_policy`
- `review_required_after_generation`
- `no_memory_write_default`

## Source Bindings

- readiness packet:
  `reports/visual_asset_eval_dry_run/v0_5_0_controlled_generation_readiness_packet.json`
- human review gate packet:
  `reports/visual_asset_eval_dry_run/v0_5_6_human_review_gate_packet.json`
- evidence contract:
  `reports/visual_asset_eval_dry_run/v0_5_8_controlled_generation_evidence_contract.json`
- readonly query contract:
  `reports/visual_asset_eval_dry_run/v0_5_9_visual_memory_readonly_query_contract.json`
- schema:
  `schemas/first_controlled_generation_authorization_packet.schema.yaml`
- report:
  `reports/visual_asset_eval_dry_run/v0_6_0_first_controlled_generation_authorization_packet.json`
- fixture:
  `tests/schema_examples/first_controlled_generation_authorization_packet.example.json`
- fail fixture:
  `tests/schema_examples/first_controlled_generation_authorization_packet_fail.example.json`
- validator:
  `scripts/validate_first_controlled_generation_authorization_packet.js`

## Boundary

- `metadata_only: true`
- `authorization_packet_only: true`
- `preflight_only: true`
- `execution_authorized_by_this_packet: false`
- `provider_call_performed: false`
- `image_generation_performed: false`
- `output_write_performed: false`
- `VCP_memory_write_performed: false`
- `DailyNote_write_performed: false`
- `runtime_call_performed: false`
- `production_candidate_created: false`
- `accepted_sample_auto_promotion: false`
- `memory_seed_promoted: false`
- `Push_L2_exercised: false`
- `real_executor_implemented_now: false`

## Closeout Expectation

The validator must prove the packet stays inactive, requires explicit A5,
limits the future first run to an exact call count, keeps output-directory
selection unapproved until a later gate, requires review after generation, and
catches drift into execution, memory writes, output writes, production
promotion, raw paths, or secret-bearing paths.
