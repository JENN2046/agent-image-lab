# AIL-VIS-02 Visual Eval Rubric And Failure Taxonomy Refresh

Base contract: `AGENTS.md`

Phase: `AIL-VIS-02_visual_eval_rubric_and_failure_taxonomy_refresh`
Mode: `docs_only_visual_review_planning`
Risk: `low_to_medium`

## Purpose

This phase refreshes the visual evaluation rubric and failure taxonomy for the
next visual production cycle.

The goal is to keep the visual review language stable before the next image
attempt so that pass, patch, reject, archive, and future memory suitability
decisions are explicit and repeatable.

This phase does not generate images, review new image outputs, or open any
memory write path.

## Source Context

This phase follows:

- `AIL-VIS-01_return_to_visual_production_mainline_gate`

That prior gate paused the AIL-MEM shadow-evidence line and returned the
project route to the visual production mainline.

The memory line remains a supporting guardrail only.

## Visual Evaluation Dimensions

The rubric evaluates the following dimensions:

- `subject_integrity`
- `composition`
- `lighting`
- `material_realism`
- `commercial_usability`
- `brand_or_style_fit`
- `ai_artifact_risk`
- `production_readiness`
- `memory_suitability`

Each dimension must be reviewed explicitly, even when the final outcome is
`reject`.

## Pass Criteria

A visual asset may pass when:

- the subject is recognizable and stable
- the composition supports the intended use
- the lighting is coherent and useful
- the material appearance is plausible
- the asset is commercially usable for the intended route
- the brand or style fit is strong enough for the route goal
- AI artifact risk is low enough to accept
- production readiness is sufficient for the current route
- memory suitability is not assumed; it stays separately gated

Pass means the asset can continue as review evidence or accepted candidate
evidence, but it does not automatically become a commercial delivery asset or a
memory entry.

## Patch Criteria

Patch is appropriate when the asset is promising but has one or more bounded
fixable issues.

Common patch triggers:

- minor subject drift
- small composition imbalance
- lighting that is directionally correct but not yet polished
- mild material realism weakness
- small commercial usability gap
- contained AI artifact cleanup opportunity
- style fit that is close but not yet on target

Patch means the route should stay in the visual workflow, but the next action
is a correction or refinement step rather than acceptance.

## Reject Criteria

Reject is appropriate when the asset fails in a way that makes the current
route unusable or misleading.

Common reject triggers:

- the subject is wrong or too unstable
- the material reads as fake, cheap, or plastic in a way that breaks the route
- the lighting is incoherent or misleading
- the composition is unusable
- the asset is commercially unfit for the target route
- the background noise overwhelms the intended subject
- distortion is too severe to correct cheaply
- text, logos, or brand-like artifacts create risk
- human or hand anomalies distract from the asset
- the AI artifact risk is too visible to trust the image
- provenance or trace metadata is missing in a way that breaks review
- the asset is not suitable for memory consideration

Reject keeps the asset as review evidence, but not as a promotion target.

## Archive Rules

Archive records preserve learning without promoting the asset further.

Archive may be used when:

- the asset is useful as evidence
- the decision route needs a durable record
- the result should remain reference-only
- the case should not be confused with delivery readiness

Archive records must not imply:

- actual memory write
- DailyNote write
- VCP memory write
- production candidate creation
- provider/runtime execution

## Failure Taxonomy

The failure taxonomy used by this phase is defined in
`docs/VISUAL_FAILURE_TAXONOMY.md`.

Every `reject` or `patch` decision should name the applicable failure tags
explicitly.

## Material Realism Checks

Material realism checks answer whether the asset reads as the intended real
material rather than a generic rendered surface.

Review the:

- shell finish
- diffuser quality
- surface reflections
- edge transitions
- perceived density and weight

## Composition Checks

Composition checks answer whether the asset is framed for the route goal.

Review the:

- subject scale
- subject centering or deliberate offset
- negative space
- table or base placement
- background separation
- visual hierarchy

## Lighting Checks

Lighting checks answer whether the asset can be trusted visually.

Review the:

- key direction
- shadow coherence
- highlight control
- contrast
- background brightness balance
- material readability under the chosen lighting

## Commercial Usability Checks

Commercial usability checks answer whether the asset could support a real
product or campaign route without confusing defects.

Review the:

- product clarity
- route-specific polish
- tolerance for campaign use
- cropping resilience
- obvious repair burden
- visual confidence

## AI Artifact Checks

AI artifact checks answer whether the asset exposes enough synthetic instability
to weaken trust.

Review the:

- duplicate or warped structures
- inconsistent detail density
- unnatural edge behavior
- illogical reflections
- unresolved geometry
- text or logo hallucinations

## Accepted Sample Eligibility

An asset is eligible to remain an accepted sample only when:

- the review outcome is explicitly `pass`
- the human review path accepts it
- the route definition allows accepted evidence
- no separate promotion boundary is crossed

Accepted sample eligibility is not the same as commercial delivery readiness.

## Rejected Sample Archive Rules

Rejected assets may be archived when:

- the failure is informative
- the failure tag is explicit
- the review record explains why the asset is not enough
- the archive remains reference-only

Rejected sample archive records must not imply future memory suitability.

## Memory Suitability Reminder

`memory_suitability` remains blocked unless a separate gate explicitly opens
the write path.

This phase may record whether a visual case is interesting for future memory
planning, but it must not convert that interest into a write authorization.

## Next Visual Production Gate

The next route after this rubric refresh should move toward the next visual
production planning task, such as prompt package refinement or shot-plan
alignment.

For this phase, the recommended next local route is:

- `AIL-VIS-03_visual_prompt_package_and_shot_plan_refresh`

## Forbidden Actions

This phase forbids:

- image generation
- provider call
- plugin call
- API call
- runtime execution
- Review Console runtime launch
- actual memory write
- DailyNote write
- VCP memory write
- codex-memory mutation
- production_candidate_002
- Batch 005
- dependency change
- `package.json` modification
- `git add .`

## Closeout YAML Template

```yaml
AIL_VIS_02_closeout:
  phase: AIL-VIS-02_visual_eval_rubric_and_failure_taxonomy_refresh
  mode: docs_only_visual_review_planning
  status: completed_validated
  source_phase: AIL-VIS-01_return_to_visual_production_mainline_gate
  rubric_dimensions:
    - subject_integrity
    - composition
    - lighting
    - material_realism
    - commercial_usability
    - brand_or_style_fit
    - ai_artifact_risk
    - production_readiness
    - memory_suitability
  failure_taxonomy_ref: docs/VISUAL_FAILURE_TAXONOMY.md
  actual_memory_write_allowed_now: false
  selected_next_phase: AIL-VIS-03_visual_prompt_package_and_shot_plan_refresh
```
