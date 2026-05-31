# AIL-VIS-20 Accepted Sample Candidate Review Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-20_accepted_sample_candidate_review_gate`
Mode: `docs_only_candidate_review_gate`
Risk: `medium_high`

## Purpose

This phase reviews whether the headphones image can become an accepted-sample
candidate.

It may decide candidate eligibility, but it does not create accepted sample
files, does not promote the image, does not write memory, and does not start
`production_candidate_002`.

## Source Context

This review follows:

- `AIL-VIS-19_acceptance_or_hold_decision_gate`
  - commit: `2ce83519c8a8b2c8438a07acf046845b56806670`
  - branch: `ail-vis-19-acceptance-or-hold-decision`
  - selected route: `route_B_prepare_accepted_sample_candidate_gate`
  - review decision: `pass_with_warnings`
  - score: `86`
  - target match: `pass`

## Reviewed Image

```yaml
reviewed_image:
  path: A:\agent-image-lab\agent-image-lab-v0.2\runs\real_generation\ail_vis_17_premium_black_wireless_headphones_hero\ail_vis_17_premium_black_wireless_headphones_hero_01.png
  sha256: 8954a5404bc6a296b6d86091a9dab46e048cec1decb55cca07b5b12fba3c203e
```

## Recommended Decision

- candidate_status: `accepted_sample_candidate`
- promotion_status: `not_promoted`
- reason: Score `86` and `target_match pass` are strong enough for candidate
  status. But `pass_with_warnings` and the design / manufacturing / readability
  watchpoints mean this must remain a candidate, not a promoted accepted
  sample.

## Candidate Review Record

```yaml
candidate_review:
  candidate_status: accepted_sample_candidate
  accepted_sample_created: false
  accepted_sample_promoted: false
  accepted_sample_file_created: false
  memory_candidate_created: false
  actual_memory_write_performed: false
```

## Unresolved Watchpoints

- `product_identity_needs_stronger_design_signature`
- `manufacturing_plausibility_watchpoint`
- `commercial_readability_darkness_watchpoint`

## Boundary Checks

- `image_generated: false`
- `retry_generation_performed: false`
- `second_image_generated: false`
- `image_editing_performed: false`
- `provider_called: false`
- `plugin_called: false`
- `api_called: false`
- `runtime_execution_performed: false`
- `review_console_runtime_launched: false`
- `accepted_sample_created: false`
- `accepted_sample_promoted: false`
- `accepted_sample_file_created: false`
- `image_copied_into_accepted_samples: false`
- `memory_candidate_created: false`
- `actual_memory_write_performed: false`
- `daily_note_written: false`
- `vcp_memory_written: false`
- `codex_memory_mutated: false`
- `production_candidate_002_started: false`
- `batch_005_started: false`
- `dependency_changed: false`
- `package_json_modified: false`
- `git_add_dot_used: false`

## Forbidden Actions

This phase forbids:

- image generation
- retry generation
- second image
- image editing
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- accepted sample promotion
- accepted sample file creation
- copying image into accepted_samples
- memory candidate creation
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Selected Next State

This gate does not start the next phase.

The next allowed phase is `AIL-VIS-21_accepted_sample_promotion_authorization_gate`.

## Final State

- `accepted_sample_candidate_status: true`
- `accepted_sample_allowed_now: false`
- `memory_write_allowed_now: false`
- `generation_allowed_now: false`
- `next_phase_started: false`

## Closeout YAML Template

```yaml
AIL_VIS_20_accepted_sample_candidate_review_closeout:
  phase_name: AIL-VIS-20_accepted_sample_candidate_review_gate
  candidate_status: accepted_sample_candidate
  source_phase: AIL-VIS-19_acceptance_or_hold_decision_gate
  source_commit: 2ce83519c8a8b2c8438a07acf046845b56806670
  review_decision: pass_with_warnings
  score: 86
  accepted_sample_created: false
  accepted_sample_promoted: false
  accepted_sample_file_created: false
  memory_candidate_created: false
  actual_memory_write_performed: false
  production_candidate_002_started: false
  batch_005_started: false
  next_phase_started: false
```
