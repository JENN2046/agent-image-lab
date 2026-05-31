# AIL-VIS-08 Retry Or Route Decision Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-08_retry_or_route_decision_gate`
Mode: `docs_only_decision_gate`
Risk: `medium`

## Purpose

This phase decides the route after the first one-shot visual generation review.

It selects `route_A_hold_as_review_evidence` and keeps the result as review
evidence only. It does not retry generation, edit the image, promote it to an
accepted sample, archive it to memory, or open any production candidate path.

## Source Context

This decision gate follows the human visual review closeout:

- `AIL-VIS-07_human_visual_review_closeout`
  - commit: `dcb36a1115008f339de15d54c87187b76f0f4e0d`
  - branch: `ail-vis-07-human-review-closeout`
  - decision: `pass_with_warnings`
  - score: `78`
  - accepted sample created: `false`
  - memory candidate created: `false`
  - retry allowed now: `false`

The reviewed image is valid review evidence, but it is not accepted-sample
quality.

## Selected Route

- route: `route_A_hold_as_review_evidence`
- reason: The generated image is valid review evidence but not accepted-sample
  quality. It should be held as evidence, not retried automatically and not
  promoted.

## Route Decision

- decision: `hold_as_review_evidence`
- retry generation performed: `false`
- second image generated: `false`
- image editing performed: `false`
- accepted sample created: `false`
- memory candidate created: `false`
- actual memory write allowed now: `false`
- production_candidate_002 allowed now: `false`
- batch_005 allowed now: `false`

## Why This Route Was Chosen

The first one-shot image is useful evidence for the pipeline, but it still
leans closer to a clean studio packshot than the original premium outdoor
blue-hour lifestyle direction.

The image therefore remains:

- reviewable
- referenceable
- non-promoted
- memory-blocked

## Boundary Checks

- `retry_generation_performed: false`
- `second_image_generated: false`
- `image_editing_performed: false`
- `provider_called: false`
- `plugin_called: false`
- `api_called: false`
- `runtime_execution_performed: false`
- `review_console_runtime_launched: false`
- `accepted_sample_created: false`
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

- retry generation
- second image
- image editing
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- accepted sample promotion
- memory candidate creation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Selected Next State

This gate does not start the next phase.

The image remains held as review evidence only until a future explicit route or
review instruction is given.

## Closeout YAML Template

```yaml
AIL_VIS_08_route_decision_closeout:
  phase_name: AIL-VIS-08_retry_or_route_decision_gate
  selected_route: route_A_hold_as_review_evidence
  source_phase: AIL-VIS-07_human_visual_review_closeout
  source_commit: dcb36a1115008f339de15d54c87187b76f0f4e0d
  decision: hold_as_review_evidence
  review_decision: pass_with_warnings
  score: 78
  retry_generation_performed: false
  second_image_generated: false
  image_editing_performed: false
  accepted_sample_created: false
  memory_candidate_created: false
  actual_memory_write_performed: false
  production_candidate_002_started: false
  batch_005_started: false
  next_phase_started: false
```
