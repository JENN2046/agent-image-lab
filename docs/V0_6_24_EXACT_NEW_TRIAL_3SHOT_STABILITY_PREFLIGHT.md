# v0.6.24 Exact New-Trial 3-Shot Stability Preflight

phase: v0_6_24_exact_new_trial_3shot_stability_preflight

## Purpose

Establish a 3-shot stability protocol for `safe_adult_editorial_portrait_v1.yaml`
through `image_gen.imagegen` before any additional continuous generation is
allowed.

This preflight reuses the existing `stability_tests/` 3-shot model, but changes
the scoring axis from final image acceptance to generation-path stability:

- `3/3 succeeded_image_generated`: generation route is a stable candidate, but
  human image-quality review is still required.
- `2/3 succeeded_image_generated`: conditionally stable; inspect the failed
  shot provider/tool/artifact trace before any continuation.
- `0-1/3 succeeded_image_generated`: unstable; stop generation and enter
  failure taxonomy / prompt or wrapper repair.

## Binding

- prompt package: `prompts/image_generation/safe_adult_editorial_portrait_v1.yaml`
- provider route: `image_gen.imagegen`
- source success: `v0_3_3_exact_new_trial_002`
- source success receipt: `reports/provider_receipts/v0_3_3_exact_new_trial_002_receipt.json`
- source success registry: `reports/provider_receipts/v0_3_3_exact_new_trial_002_registry.json`
- source payload capture: `reports/provider_payload_captures/v0_3_3_exact_new_trial_002_request_payload.sanitized.json`

## Shot Protocol

Each shot is a separate future one-call attempt:

1. `v0_3_3_exact_new_trial_003_shot_1`
2. `v0_3_3_exact_new_trial_003_shot_2`
3. `v0_3_3_exact_new_trial_003_shot_3`

Each shot must have independent:

- output directory
- request payload capture
- attempt result
- provider receipt
- provider registry
- review-console bridge entry
- artifact-return trace

The previous `v0_3_3_exact_new_trial_002` paths are read-only historical
evidence and must not be overwritten.

## Boundaries

- no provider call in this preflight
- no image generation in this preflight
- no retry
- no overwrite of `002`
- no raw provider response capture
- no secret read
- no automatic accepted-sample promotion
- no production candidate
- no VCP memory write
- no DailyNote write
- no push

## Required Stop Conditions

Stop before any future shot if:

- any planned shot path already exists
- the payload capture path is not unique per shot
- the receipt path is not unique per shot
- the registry path is not unique per shot
- the attempt result path is not unique per shot
- the review bridge path is not unique per shot
- retry is requested
- overwrite is requested
- raw response capture is requested
- secret read is requested
- memory, DailyNote, promotion, production candidate, commit, tag, release,
  deploy, or push is requested

## Validation

The local validator is:

```powershell
node scripts/validate_exact_new_trial_3shot_stability_preflight.js
```

It proves that the protocol is plan-only, bound to the current safe portrait
prompt and `image_gen.imagegen`, preserves independent per-shot paths, avoids
`002` overwrite, and keeps all side-effect flags false.
