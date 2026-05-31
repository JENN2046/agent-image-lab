# AIL-VIS-10 Next Visual Target Selection Gate

Base contract: `AGENTS.md`

Phase: `AIL-VIS-10_next_visual_target_selection_gate`
Mode: `docs_only_route_selection`
Risk: `low_to_medium`

## Source Context

This gate follows the hardened visual evaluation language from:

- `AIL-VIS-09_visual_eval_failure_taxonomy_hardening`
  - commit: `e21b66a46cc347e292d473fbe703346c1b005429`
  - branch: `ail-vis-09-eval-taxonomy-hardening`
  - status: `final_closed`
  - visual_eval_hardened: `true`

The LED lantern one-shot cycle has been held as review evidence only. The next
step is to choose the next visual production target, not to write an execution
prompt.

## Current Route State

- `AIL-VIS-08_retry_or_route_decision_gate`
  - selected route: `route_A_hold_as_review_evidence`
  - image status: `review_evidence_only`

- `AIL-VIS-09_visual_eval_failure_taxonomy_hardening`
  - hardened review language
  - `pass_with_warnings` clarified as review evidence only

This means the LED lantern cycle is held, not retried, and not promoted.

## Why The LED Lantern Cycle Is Held

The reviewed image is useful evidence, but it is not the best next route for the
next production cycle.

The review language now clearly distinguishes:

- studio packshot vs intended route scene
- transparent vs frosted diffuser intent
- control layout mismatch
- shot role underrepresentation
- modern LED identity ambiguity

Since those observations are already captured, the next step should choose a
new target with stronger commercial testing value.

## Candidate Visual Targets

### `candidate_A`: `premium_dark_tech_product_still_life`

Reason:

- closest to the current dark, premium visual direction
- good for testing metal, glass, low-key lighting, and commercial hero framing
- avoids the higher risk of hands, faces, or complex human pose issues

### `candidate_B`: `premium_cosmetic_bottle_hero_image`

Reason:

- strong commercial value
- good for testing reflections, transparent containers, and packaging clarity
- carries more text / label / surface-risk complexity than candidate A

### `candidate_C`: `premium_bag_lifestyle_detail`

Reason:

- closer to photography-business style output
- useful for lifestyle detail work
- higher risk because of hands, human interaction, and material complexity

## Risk Comparison

- `candidate_A` is the lowest-risk commercial still-life route for the next
  round
- `candidate_B` has stronger packaging/text risk even though its commercial
  value is clear
- `candidate_C` has more human-interaction and anatomy risk

For a next-step target after the LED lantern review cycle, candidate A gives
the best balance of commercial value and manageable review complexity.

## Selected Target

- selected target: `premium_dark_tech_product_still_life`

## Why Selected

This target is preferred because it:

- stays aligned with the darker, higher-end visual direction
- is more commercially useful than a generic product still life
- reduces the risk of human anatomy or hand issues
- gives a clean next test of metal, glass, and low-key lighting

## Why Not Retry Now

This phase is a target-selection gate, not a generation gate.

No retry should happen here because:

- the current cycle is already held as review evidence
- retry authorization has not been opened
- the next useful step is to choose the next target, not to rerun the LED
  lantern image

## Why No Memory Now

No memory write should happen here because:

- this gate only selects the next target
- the task is still on the planning side of the workflow
- memory write remains separately gated and explicitly blocked

## Next Allowed Phase

The next allowed phase is a separate shot-plan and prompt-package planning gate
for the selected target.

- next allowed phase: `AIL-VIS-11_shot_plan_and_prompt_package_for_selected_target`

This phase is not started here.

## Boundary Checks

- `image_generated: false`
- `generation_allowed_now: false`
- `retry_generation_performed: false`
- `retry_allowed_now: false`
- `second_image_generated: false`
- `image_editing_performed: false`
- `provider_called: false`
- `plugin_called: false`
- `api_called: false`
- `runtime_execution_performed: false`
- `review_console_runtime_launched: false`
- `accepted_sample_created: false`
- `accepted_sample_allowed_now: false`
- `memory_candidate_created: false`
- `actual_memory_write_performed: false`
- `memory_write_allowed_now: false`
- `daily_note_written: false`
- `vcp_memory_written: false`
- `codex_memory_mutated: false`
- `production_candidate_002_started: false`
- `production_candidate_002_allowed_now: false`
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

## Closeout Template

```yaml
AIL_VIS_10_target_selection_closeout:
  phase_name: AIL-VIS-10_next_visual_target_selection_gate
  source_phase: AIL-VIS-09_visual_eval_failure_taxonomy_hardening
  source_commit: e21b66a46cc347e292d473fbe703346c1b005429
  candidate_targets:
    - premium_dark_tech_product_still_life
    - premium_cosmetic_bottle_hero_image
    - premium_bag_lifestyle_detail
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
