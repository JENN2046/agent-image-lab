# AIL-VIS-10 Visual Target Selection Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-10_visual_target_selection_gate`
Mode: `docs_only_target_selection_gate`
Risk: `low`

## Purpose

This phase selects the next visual target for the following visual planning
cycle.

It records the target choice only. It does not write an execution prompt, does
not generate images, and does not open any memory write path.

## Source Context

This selection gate follows the hardened review language:

- `AIL-VIS-09_visual_eval_failure_taxonomy_hardening`
  - commit: `e21b66a46cc347e292d473fbe703346c1b005429`
  - branch: `ail-vis-09-eval-taxonomy-hardening`
  - result: `completed_validated_pushed`
  - visual_eval_hardened: `true`

The hardened rubric now makes the review evidence from the first one-shot
generation easier to reuse in later rounds.

## Selected Target

- next visual target: `premium_dark_tech_product_still_life`

## Why This Target

This target is selected because the project should now move away from the
earlier premium portable LED camping lantern route and toward a darker,
tech-forward product still life route.

This choice is a target selection only. It does not define the prompt package,
shot plan, provider/model, or execution authorization.

## What This Gate Does Not Do

This phase does not:

- write an execution prompt
- generate images
- retry generation
- edit images
- promote samples
- create memory candidates
- write memory
- start production_candidate_002
- start Batch 005

## Boundary Checks

- `generation_allowed_now: false`
- `retry_allowed_now: false`
- `memory_write_allowed_now: false`
- `accepted_sample_allowed_now: false`
- `production_candidate_002_allowed_now: false`
- `batch_005_allowed_now: false`
- `provider_called: false`
- `plugin_called: false`
- `api_called: false`
- `runtime_execution_performed: false`
- `review_console_runtime_launched: false`
- `actual_memory_write_performed: false`
- `daily_note_written: false`
- `vcp_memory_written: false`
- `codex_memory_mutated: false`
- `dependency_changed: false`
- `package_json_modified: false`
- `git_add_dot_used: false`

## Forbidden Actions

This phase forbids:

- execution prompt authoring
- image generation
- retry generation
- image editing
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- accepted sample promotion
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

## Next Safe Step

The next safe step is a separate planning gate that can turn this target into a
shot plan and prompt package.

That step is not started here.

## Closeout Template

```yaml
AIL_VIS_10_target_selection_closeout:
  phase_name: AIL-VIS-10_visual_target_selection_gate
  source_phase: AIL-VIS-09_visual_eval_failure_taxonomy_hardening
  source_commit: e21b66a46cc347e292d473fbe703346c1b005429
  selected_target: premium_dark_tech_product_still_life
  decision: target_selected_only
  execution_prompt_written: false
  generation_allowed_now: false
  retry_allowed_now: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  production_candidate_002_allowed_now: false
  next_phase_started: false
```
