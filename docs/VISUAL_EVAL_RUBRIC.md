# Visual Eval Rubric

Base contract: `AGENTS.md`

This rubric defines the stable review dimensions used by the visual production
mainline.

It is a planning and review document only. It does not authorize image
generation, provider contact, runtime execution, or memory write.

## Review Outcome Model

The evaluation result should resolve to one of three outcomes:

- `pass`
- `patch`
- `reject`

The outcome must be justified by explicit dimension-level review.

`pass_with_warnings` may be used in phase-specific review closeouts as a
decision note, but it does not change the three core outcome types above. When
used, it means the result is valid review evidence with warnings that must be
carried forward into the next routing decision.

## Score Bands

Each dimension uses the same score range:

- `0` = severe failure
- `1` = strong failure
- `2` = weak failure
- `3` = borderline
- `4` = acceptable with minor watch items
- `5` = strong pass

Suggested interpretation:

- `pass` usually requires mostly `4` and `5` scores, with no severe or strong
  failures.
- `patch` usually has one or more `3` scores or a bounded fixable weakness.
- `reject` usually has one or more `0` to `2` scores in a critical dimension.

## Dimensions

### `subject_integrity`

Checks whether the intended subject is recognizable, stable, and not drifting
into a different product or scene.

Review notes:

- distinguish a technically usable product hero from the intended route scene
- if the route expects outdoor / blue-hour / lifestyle context, a clean studio
  packshot is not a full pass on this dimension

### `composition`

Checks whether framing, scale, spacing, cropping, and subject placement support
the route goal.

### `lighting`

Checks whether the illumination is coherent, legible, and appropriate for the
intended mood or commercial use.

### `material_realism`

Checks whether the materials read as plausible and convincing rather than fake,
cheap, or over-smoothed.

Review notes:

- realism includes material character, not only polish
- if the route expects a frosted diffuser, transparent or glossy readings are
  a mismatch even when the image is otherwise clean

### `commercial_usability`

Checks whether the asset can support a real product, campaign, or route-specific
presentation without obvious defects.

### `brand_or_style_fit`

Checks whether the asset matches the intended visual language, style direction,
or brand constraint.

Review notes:

- product identity should stay specific enough to avoid generic lantern or
  decorative-light ambiguity
- modern LED identity should remain legible when the route requires it

### `ai_artifact_risk`

Checks whether visible synthetic instability reduces trust in the asset.

### `production_readiness`

Checks whether the asset is strong enough to continue in the visual production
workflow without immediate correction.

Review notes:

- `pass_with_warnings` does not automatically imply accepted-sample status,
  memory-candidate status, retry authorization, or production-candidate
  promotion
- a result may be useful review evidence and still remain below promotion
  threshold

### `memory_suitability`

Checks whether the case is interesting for future memory planning.

This dimension does not authorize memory write. It only informs future review.

## Decision Rules

### Pass

Use `pass` when:

- the subject is correct
- the composition supports the route
- the lighting is coherent
- the material reading is plausible
- the commercial use case is strong enough
- the AI artifact risk is low
- the asset is ready to continue as evidence

### Patch

Use `patch` when:

- the asset is close
- the weakness is bounded
- the next step is correction, not rejection
- the route should stay alive

### Reject

Use `reject` when:

- the subject is wrong
- the material reading is implausible in a way that breaks trust
- the lighting is too broken to rescue cheaply
- the composition is unusable
- the commercial route is not viable
- the AI artifact risk is too visible

## Required Notes

Every result should include:

- a short summary
- the top positive reasons
- the main watch items
- the failure tags when applicable
- the archive or next-step action

## Memory Note

`memory_suitability` stays separate from review outcome.

An asset may be useful for learning and still remain blocked from actual memory
write unless a separate gate opens that path.
