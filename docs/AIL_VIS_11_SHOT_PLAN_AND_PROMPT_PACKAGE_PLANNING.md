# AIL-VIS-11 Shot Plan And Prompt Package Planning

Base contract: `AGENTS.md`

Phase: `AIL-VIS-11_shot_plan_and_prompt_package_planning`
Mode: `docs_only_prompt_and_shot_planning`
Risk: `low_to_medium`

## Source Context

This planning gate follows the selected next visual target from:

- `AIL-VIS-10_next_visual_target_selection_gate`
  - commit: `3674127c082cfcd52732f984b36c0c7085a7ebc3`
  - branch: `ail-vis-10-next-visual-target-selection`
  - selected target: `premium_dark_tech_product_still_life`

The visual review language was hardened in:

- `AIL-VIS-09_visual_eval_failure_taxonomy_hardening`
  - commit: `e21b66a46cc347e292d473fbe703346c1b005429`
  - branch: `ail-vis-09-eval-taxonomy-hardening`
  - hardened items: `scene_intent_match`, `material_surface_match`,
    `control_layout_compliance`, `shot_role_adherence`,
    `product_identity_strength`, `pass_with_warnings_not_promotion`

The LED lantern cycle is held as review evidence only and is not being retried.

## Current Route State

- `AIL-VIS-08_retry_or_route_decision_gate`
  - selected route: `route_A_hold_as_review_evidence`
  - image status: `review_evidence_only`

- `AIL-VIS-09_visual_eval_failure_taxonomy_hardening`
  - pass-with-warnings policy clarified
  - review gaps converted into reusable review criteria

- `AIL-VIS-10_next_visual_target_selection_gate`
  - selected target: `premium_dark_tech_product_still_life`

This phase converts the selected target into a shot plan and prompt package
planning artifact only.

## Why The LED Lantern Cycle Is Held

The earlier one-shot LED lantern route is still useful evidence, but it is not
the right next generation route.

The review evidence showed:

- a studio packshot tendency instead of the intended outdoor blue-hour route
- material surface mismatch risk on the diffuser
- control layout mismatch risk
- shot role underrepresentation for the intended route
- product identity ambiguity around the modern LED lantern story

Those observations justify moving to a different target rather than retrying the
same lantern route immediately.

## Candidate Visual Targets

### `candidate_A`: `premium_dark_tech_product_still_life`

- best fit for the current dark premium direction
- tests metal, glass, low-key light, reflections, and commercial hero framing
- lowest risk among the current candidate pool

### `candidate_B`: `premium_cosmetic_bottle_hero_image`

- strong commercial value
- good material test for transparency and reflection
- higher text / label / packaging complexity

### `candidate_C`: `premium_bag_lifestyle_detail`

- more lifestyle oriented
- higher human / hand / pose risk
- less suitable as the next first-choice route

## Risk Comparison

- candidate A is the cleanest next route for a premium commercial still-life
- candidate B has greater packaging and surface-risk complexity
- candidate C has greater human-interaction and detail-risk complexity

Candidate A is the best next planning target because it preserves commercial
value while staying within a manageable review envelope.

## Selected Target

- selected target: `premium_dark_tech_product_still_life`

Route goal:

- build a low-key commercial still-life route
- test metal, glass, controlled reflections, dark premium lighting, product
  dominance, and clean commercial hero composition

## Why Selected

This target is selected because it:

- aligns with the darker, premium, tech-forward direction
- is stronger than the held LED lantern cycle for a new commercial still-life
  test
- reduces the risk of repeating the same review issues from the prior route
- remains visually rich enough to exercise material and lighting judgment

## Why Not Retry Now

This phase is a planning gate, not a generation gate.

No retry should happen here because:

- the prior cycle is already held as review evidence
- the new target needs a shot plan and prompt package first
- generation authorization has not been requested here

## Why No Memory Now

No memory write should happen here because:

- this is still planning work
- the task is about route preparation, not long-term storage
- memory write remains separately gated and explicitly blocked

## Next Allowed Phase

The next allowed phase is a separate generation authorization gate for the
selected target.

- next allowed phase: `AIL-VIS-12_visual_generation_authorization_gate`

That phase is not started here.

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
- execution prompt authorization
- A5 authorization request
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
AIL_VIS_11_planning_closeout:
  phase_name: AIL-VIS-11_shot_plan_and_prompt_package_planning
  source_phase: AIL-VIS-10_next_visual_target_selection_gate
  source_commit: 3674127c082cfcd52732f984b36c0c7085a7ebc3
  selected_target: premium_dark_tech_product_still_life
  decision: shot_plan_and_prompt_package_planned_only
  shot_plan_created: true
  prompt_package_created: true
  execution_prompt_written: false
  A5_authorization_requested: false
  generation_allowed_now: false
  retry_allowed_now: false
  memory_write_allowed_now: false
  accepted_sample_allowed_now: false
  production_candidate_002_allowed_now: false
  next_phase_started: false
```
