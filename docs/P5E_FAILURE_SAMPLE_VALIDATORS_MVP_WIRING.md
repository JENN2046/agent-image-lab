# P5e Failure Sample Validators MVP Wiring

base_contract: AGENTS.md
mode: A4.8 local validation wiring
status: completed_validated

## Purpose

Wire the failure sample capsule registry validator and its negative-case validator
into the main MVP validation surface.

This keeps the failure sample lane visible even while the current valid state has
zero real failure sample capsules.

## Validators Added To MVP

```text
scripts/validate_failure_sample_capsule_registry.js
scripts/validate_failure_sample_capsule_registry_negative_cases.js
```

Expected current behavior:

- `scripts/validate_failure_sample_capsule_registry.js` passes with `total_samples=0`
- `scripts/validate_failure_sample_capsule_registry_negative_cases.js` passes with ignored `.agent_private/` fixtures
- `scripts/validate_mvp.ps1` passes

## Non-Authorization

This wiring does not authorize:

- creating a real `asset_archive/failure_samples/<sample_id>/` capsule
- creating real sample `manifest.json`, `preview.webp`, `failure_record.json`, or `review_record.json`
- copying, converting, or generating preview images
- package.json changes
- provider/plugin/API/image generation
- DailyNote or VCP memory writes
- runtime, real manifest, VCPChat, or VCPToolBox reads
- production candidate promotion
- push, tag, release, or deploy

## Recommended Next

Prepare a future exact authorization package for the first real failure sample
capsule only when a concrete rejected source image and review record are selected.
