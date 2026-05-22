# v0.4.5 Visual Eval Consistency Check

base_contract: AGENTS.md
phase: v0_4_5_visual_eval_consistency_check
status: local_doc_schema_fixture_validator_gate

## Purpose

This gate proves that the visual judgment records created so far do not drift
when they are read together as a dry-run chain:

```text
review_pack -> failure_taxonomy -> prompt_correction_hint -> sample_registry_dry_run
```

The consistency check is metadata-only. It does not inspect image binaries,
generate images, call providers, write memory, write DailyNote, create
production candidates, promote accepted samples, or run a real executor.

## Source Binding

The check binds to:

- `reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json`
- `tests/schema_examples/visual_failure_taxonomy.example.json`
- `tests/schema_examples/visual_prompt_correction_hint.example.json`
- `reports/visual_asset_eval_dry_run/v0_4_4_sample_registry_dry_run.json`

## Required Invariants

```yaml
visual_eval_consistency_check:
  phase: v0_4_5_visual_eval_consistency_check
  consistency_mode: dry_run_metadata_consistency
  invariants:
    same_asset_same_contract: true
    memory_suitability_stays_false: true
    accepted_sample_eligible_stays_false: true
    production_candidate_eligible_stays_false: true
    failure_taxonomy_stable: true
```

## Stability Rules

- The review pack asset id must match the accepted and rejected registry dry-run
  source asset ids.
- `structured_review_report.memory_suitability.value` must remain `false`.
- `review_pack_decision.accepted_sample_eligible` must remain `false`.
- `review_pack_decision.production_candidate_eligible` must remain `false`.
- The seven v0.4.2 failure taxonomy categories must remain exact and stable.
- Prompt correction hints must continue to cover the exact taxonomy categories.
- Rejected registry dry-run categories must be drawn from the same taxonomy.

## Negative Cases

The validator must fail closed for:

- source reference drift
- asset id mismatch between review pack and registry dry-run
- `same_asset_same_contract: false`
- `memory_suitability_stays_false: false`
- `accepted_sample_eligible_stays_false: false`
- `production_candidate_eligible_stays_false: false`
- missing, unknown, or duplicate taxonomy categories
- prompt hint taxonomy coverage drift
- rejected registry category drift
- provider, image, memory, DailyNote, runtime, secret, production, promotion,
  dependency, commit, or push side-effect drift
- raw local drive path or secret/env path references

## Non-Actions

This gate did not read image binaries, call a provider, generate an image, write
DailyNote, write VCP memory, perform runtime calls, read secrets, create a
production candidate, promote an accepted sample, promote a memory seed, change
dependencies, push, tag, release, or deploy.

Recommended next: v0.4.6 No-op Visual Workflow Runner Plan.
