# Visual Failure Taxonomy

Base contract: `AGENTS.md`

This taxonomy names the common ways a visual asset can fail in the Agent Image
Lab workflow.

It is a review vocabulary, not an execution authorization.

## Taxonomy Categories

### `subject_drift`

The generated result no longer matches the intended subject, route, or product
identity.

### `material_fake_or_plastic`

The material reads as fake, cheap, or overly plastic when the route requires
more believable material character.

### `lighting_inconsistent`

The lighting is visually incoherent, unstable, or misleading.

### `composition_unusable`

The framing, scale, spacing, or placement does not support the intended use.

### `commercial_unfit`

The asset is not strong enough for commercial or campaign use on the intended
route.

### `background_noise`

The background distracts from the subject or adds unnecessary visual clutter.

### `detail_distortion`

Important structural detail is warped, stretched, duplicated, or otherwise
damaged.

### `text_logo_or_brand_risk`

The asset contains text, logo-like shapes, or brand-like artifacts that create
review risk.

### `human_or_hand_anomaly`

Human anatomy, hand shapes, or hand interactions appear incorrect or
distracting.

### `ai_artifact_visible`

The asset exposes synthetic instability strongly enough to weaken trust in the
result.

### `provenance_or_trace_missing`

The case lacks enough traceability or review metadata to support a reliable
decision record.

### `memory_unsuitable`

The case should not be used as a candidate for future memory planning.

## Practical Mapping

- `pass` results may have no failure tag or only non-blocking watch items.
- `patch` results should usually map to one or more bounded failure tags.
- `reject` results should always map to at least one clear failure tag.

## Review Guidance

Use the taxonomy to keep review language precise:

- name the primary failure first
- keep secondary issues separate
- avoid vague labels when a concrete tag exists
- keep archive records reference-only

## Memory Boundary

`memory_unsuitable` is a review outcome tag, not a write instruction.

The taxonomy does not open `actual memory write`, `DailyNote_write`, or
`VCP_memory_write`.
